#!/usr/bin/env node
/**
 * sync-provider.js — Sinkronisasi provider SATU ARAH: opencode → pi
 *
 * Membaca provider dari : ~/.config/opencode/opencode.json  (key "provider")
 * Menulis (merge) ke    : ~/.pi/agent/models.json           (key "providers")
 *
 * Konversi schema otomatis:
 *   opencode                                  pi
 *   provider.<name>.baseURL            →      providers.<name>.baseUrl
 *   provider.<name>.type "openai"      →      api "openai-completions"
 *   provider.<name>.type "anthropic"   →      api "anthropic-messages"
 *   provider.<name>.model { map }      →      models [ array ]
 *   model.contextLength                →      contextWindow
 *   model.limit.output (jika ada)      →      maxTokens
 *
 * Merge TANPA menimpa:
 *   - provider yang hanya ada di pi         → DIPERTAHANKAN (tidak disentuh)
 *   - provider yang sudah ada di keduanya   → SKIP (kecuali --force)
 *   - provider yang hanya ada di opencode   → DITAMBAHKAN
 *
 * Opsi:
 *   --dry-run            tampilkan rencana tanpa menulis apa pun
 *   --force              timpa provider yang sudah ada di pi dengan versi opencode
 *   --provider=a,b       sinkron hanya provider tertentu (default: semua)
 *   --opencode-path=...  override path sumber
 *   --pi-path=...        override path tujuan
 *   --help               bantuan
 *
 * Backup otomatis: models.json.bak-sync-<timestamp> sebelum menulis
 * (tidak dibuat pada --dry-run).
 *
 * Contoh:
 *   node sync-provider.js --dry-run
 *   node sync-provider.js
 *   node sync-provider.js --force --provider=nvidia,cerebras
 */

'use strict';

const DEFAULT_OPENCODE_PATH = process.env.USERPROFILE
  ? process.env.USERPROFILE + '\\.config\\opencode\\opencode.json'
  : '/.config/opencode/opencode.json';
const DEFAULT_PI_PATH = process.env.USERPROFILE
  ? process.env.USERPROFILE + '\\.pi\\agent\\models.json'
  : '/.pi/agent/models.json';

const TYPE_TO_API = {
  openai: 'openai-completions',
  anthropic: 'anthropic-messages',
  google: 'google-generative-ai',
  azure: 'openai-completions',
  'openai-compatible': 'openai-completions',
};

function parseArgs(argv) {
  const args = {
    'dry-run': false,
    force: false,
    provider: null,
    'opencode-path': DEFAULT_OPENCODE_PATH,
    'pi-path': DEFAULT_PI_PATH,
    help: false,
  };
  for (const a of argv) {
    if (a === '--dry-run') args['dry-run'] = true;
    else if (a === '--force') args.force = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a.startsWith('--provider=')) args.provider = a.slice('--provider='.length);
    else if (a.startsWith('--opencode-path=')) args['opencode-path'] = a.slice('--opencode-path='.length);
    else if (a.startsWith('--pi-path=')) args['pi-path'] = a.slice('--pi-path='.length);
    else {
      console.error(`Argumen tidak dikenal: ${a} (lihat --help)`);
      process.exit(2);
    }
  }
  return args;
}

/** Convert one opencode provider object → pi provider object (or error if unusable). */
function convertProvider(oc) {
  if (!oc || typeof oc !== 'object') return { error: 'entri bukan objek' };

  // Format A: baseURL di root. Format B (npm-based): di dalam options.
  const opts = oc.options && typeof oc.options === 'object' ? oc.options : {};
  const baseUrl = oc.baseURL || oc.baseUrl || opts.baseURL || opts.baseUrl;
  const apiKey = oc.apiKey || opts.apiKey;

  // api: dari type, atau dari nama paket npm (@ai-sdk/xxx)
  let api = TYPE_TO_API[oc.type];
  if (!api && oc.npm) {
    if (oc.npm.includes('openai-compatible')) api = 'openai-completions';
    else if (oc.npm.includes('anthropic')) api = 'anthropic-messages';
    else if (oc.npm.includes('google')) api = 'google-generative-ai';
  }
  api = api || 'openai-completions';

  if (!baseUrl) {
    return { error: 'baseUrl kosong (provider hostless/berbasis auth — dilewati)' };
  }

  const out = { baseUrl, api };
  if (apiKey) out.apiKey = apiKey;
  if (oc.name) out.displayName = oc.name; // display name opencode (info tambahan)

  const models = [];
  const modelMap = oc.model || oc.models || {};
  for (const [key, m] of Object.entries(modelMap)) {
    if (!m || typeof m !== 'object') continue;
    const id = m.id || key;
    const entry = { id, name: m.name || id };
    const ctx = m.contextLength ?? (m.limit && m.limit.context);
    const maxOut = (m.limit && m.limit.output) ?? m.maxTokens;
    if (ctx) entry.contextWindow = ctx;
    if (maxOut) entry.maxTokens = maxOut;
    if (m.reasoning != null) entry.reasoning = !!m.reasoning;
    if (m.tool_call != null) entry.toolCall = !!m.tool_call;
    models.push(entry);
  }
  out.models = models;
  return { value: out };
}

/** Mask API key for console output. */
function mask(k) {
  if (!k) return '(tidak ada)';
  return k.length <= 8 ? k.slice(0, 2) + '***' : k.slice(0, 6) + '***' + k.slice(-3);
}

/** Structural equality of converted provider vs existing pi entry (keys normalized). */
function providersEqual(a, b) {
  const norm = (p) => {
    const models = (p.models || []).map((m) => [m.id, m.name, m.contextWindow || null, m.maxTokens || null]);
    models.sort((x, y) => String(x[0]).localeCompare(String(y[0])));
    return JSON.stringify([p.baseUrl, p.api, p.apiKey || null, models]);
  };
  return norm(a) === norm(b);
}

function timestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

async function main() {
  // Dynamic import supaya script jalan baik di CJS maupun ESM context.
  const fs = await import('node:fs');
  const path = await import('node:path');
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].split('/**')[1]);
    return;
  }

  console.log('sync-provider.js — opencode → pi');
  console.log(`  sumber : ${args['opencode-path']}`);
  console.log(`  tujuan : ${args['pi-path']}`);
  console.log(`  mode   : ${args['dry-run'] ? 'DRY-RUN (tidak menulis)' : 'TULIS'}${args.force ? ' + FORCE' : ''}`);
  console.log('');

  // 1. Baca opencode.json
  let ocConfig;
  try {
    ocConfig = JSON.parse(fs.readFileSync(args['opencode-path'], 'utf8'));
  } catch (e) {
    console.error(`GAGAL membaca opencode config: ${e.message}`);
    process.exit(1);
  }
  const ocProviders = ocConfig.provider || {};
  let wanted = Object.keys(ocProviders);
  if (args.provider) {
    const filter = args.provider.split(',').map((s) => s.trim()).filter(Boolean);
    wanted = wanted.filter((n) => filter.includes(n));
    const missing = filter.filter((f) => !ocProviders[f]);
    if (missing.length) console.log(`  peringatan: tidak ditemukan di opencode: ${missing.join(', ')}`);
  }
  if (!wanted.length) {
    console.log('Tidak ada provider untuk disinkronkan. Selesai.');
    return;
  }

  // 2. Baca pi models.json
  let piConfig = { providers: {} };
  if (fs.existsSync(args['pi-path'])) {
    try {
      piConfig = JSON.parse(fs.readFileSync(args['pi-path'], 'utf8'));
      if (!piConfig.providers || typeof piConfig.providers !== 'object') piConfig.providers = {};
    } catch (e) {
      console.error(`GAGAL membaca pi models.json (JSON rusak?): ${e.message}`);
      console.error('Tidak ada yang diubah. Perbaiki file dulu.');
      process.exit(1);
    }
  }
  const piProviders = piConfig.providers;

  // 3. Konversi + klasifikasi aksi
  const toAdd = {};
  const toUpdate = {};
  const skipped = [];
  const failed = [];

  for (const name of wanted) {
    const conv = convertProvider(ocProviders[name]);
    if (conv.error) { failed.push([name, conv.error]); continue; }
    const value = conv.value;
    if (!piProviders[name]) {
      toAdd[name] = value;
    } else if (providersEqual(piProviders[name], value)) {
      skipped.push([name, 'sudah sinkron (identik)']);
    } else if (args.force) {
      // pertahankan field pi yang tidak relevan dari opencode? tidak — versi opencode menang penuh
      toUpdate[name] = value;
    } else {
      skipped.push([name, 'berbeda di pi — gunakan --force untuk menimpa']);
    }
  }

  // 4. Laporan rencana
  console.log('RENCANA:');
  for (const [n, v] of Object.entries(toAdd)) {
    console.log(`  + TAMBAH   ${n}  (${v.models.length} model, key: ${mask(v.apiKey)}, ${v.baseUrl})`);
  }
  for (const [n, v] of Object.entries(toUpdate)) {
    console.log(`  ~ TIMPA    ${n}  (${v.models.length} model, key: ${mask(v.apiKey)}, ${v.baseUrl})  [--force]`);
  }
  for (const [n, why] of skipped) console.log(`  = SKIP     ${n}  — ${why}`);
  for (const [n, why] of failed) console.log(`  ! GAGAL    ${n}  — ${why}`);
  console.log('');

  if (args['dry-run']) {
    console.log('DRY-RUN selesai — tidak ada file yang diubah.');
    return;
  }
  if (!Object.keys(toAdd).length && !Object.keys(toUpdate).length) {
    console.log('Tidak ada perubahan yang perlu ditulis. Selesai.');
    return;
  }

  // 5. Backup pi models.json
  const backupPath = args['pi-path'] + '.bak-sync-' + timestamp();
  if (fs.existsSync(args['pi-path'])) {
    fs.copyFileSync(args['pi-path'], backupPath);
    console.log(`Backup dibuat: ${path.basename(backupPath)}`);
  }

  // 6. Merge & tulis
  Object.assign(piConfig.providers, toAdd, toUpdate);
  const out = JSON.stringify(piConfig, null, 2) + '\n';
  fs.mkdirSync(path.dirname(args['pi-path']), { recursive: true });
  fs.writeFileSync(args['pi-path'], out, 'utf8');

  console.log('');
  console.log(`SELESAI: +${Object.keys(toAdd).length} ditambah, ~${Object.keys(toUpdate).length} ditimpa, =${skipped.length} dilewati.`);
  console.log('Penting: restart sesi pi yang sedang berjalan agar provider baru terbaca.');
}

main().catch((e) => {
  console.error('ERROR tak terduga:', e);
  process.exit(1);
});
