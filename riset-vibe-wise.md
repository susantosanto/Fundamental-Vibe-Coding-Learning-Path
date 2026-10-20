# Riset — VibeWise (`nykooi1/vibe-wise`)

> **MULAI:** apa fungsi dan kegunaan `nykooi1/vibe-wise`, dan apa hubungannya dengan repo ini?\
> **SELESAI:** penjelasan bahasa sederhana + fakta terverifikasi + perbandingan jujur dengan\
> Mode Inspeksi repo ini + daftar hal yang layak/tidak layak diadopsi.\
> **Tanggal riset:** 11 Okt 2026 · **Metode:** `gh api` + `raw.githubusercontent.com` +\
> klon dangkal (`git clone --depth 1`) lalu baca berkasnya langsung — sesuai `MEMORY.md` §2\
> (hanya repo/dokumen resmi).

---

## 0\. Ringkasan — kenapa ini penting untuk repo ini

VibeWise adalah **plugin Claude Code / Codex yang tujuannya hampir sama dengan repo ini**:\
supaya orang *belajar* sambil AI menulis kode. Ia menyelesaikan masalah yang sama dengan\
**cara yang berbeda** — dan justru di situlah nilainya.

Tiga temuan yang menentukan:

1. 🔴 **Ia TIDAK punya dasar riset pedagogis apa pun.** Dokumen `docs/development.md` bagian\
   *"Design and official references"* hanya menyebut dokumentasi platform (plugin, skills,\
   hooks, marketplace) dan satu plugin Anthropic (`learning-output-style`). **Nol** sitasi\
   PRIMM, Parsons, Lister, atau literatur pendidikan lain. Ini persis posisi\
   `teach-software-design` di repo ini (`MEMORY.md` §4) — **boleh dipakai, tapi tidak boleh\
   diklaim berbasis riset.**
2. ✅ **Ia punya satu mekanisme yang repo ini TIDAK punya:** hook `SessionStart` yang\
   **mengembalikan mode belajar otomatis** setelah sesi baru / `/clear` / `/compact`.\
   Repo ini bergantung pada pemanggilan skill manual — begitu konteks terpotong, mode belajar\
   hilang tanpa jejak.
3. ⚠️ **Posisinya berlawanan dengan inti Mode Inspeksi.** VibeWise: *"You build. AI writes."*\
   Pelajar merancang, **AI menulis kodenya**. Mode Inspeksi repo ini justru melarang AI\
   mengerjakan bagian yang membawa pelajarannya (`MEMORY.md` §3). Jadi ini **bukan pengganti,\
   bukan pelengkap** — ini **pendekatan saingan** yang perlu dipahami, bukan disalin.

---

## 1\. Fakta terverifikasi

| Item | Nilai |
| --- | --- |
| Repo | `nykooi1/vibe-wise` |
| Deskripsi resmi | *"A Claude Code / Codex plugin that helps you learn how to build while AI writes the code."* |
| Penulis | **Noah Kim** (satu-satunya kontributor, 79 commit) |
| Lisensi | **MIT** (`Copyright (c) 2026 Noah Kim`) |
| Bahasa | **Python** (33.040 byte — hook + helper reset + tes) |
| Versi | **0.1.44** (`plugin.json`) |
| Dibuat | **29 Sep 2026** |
| Push terakhir | **9 Okt 2026** |
| Bintang / fork | **3.392** / 139 (11 *watcher* sungguhan) |
| Issue terbuka | **21** |
| Rilis GitHub | **tidak ada** (belum pernah `release`) |
| Ukuran | 210 KB · **22 berkas** · 1.201 baris kode+markdown |

**Kecepatan bintang:** 3.392 bintang dalam **12 hari** ≈ 283/hari. Ini pola viral\
(sosial media / HN), **bukan** pola adopsi bertahap. Bintang ≠ kematangan — lihat §7.

---

## 2\. Apa ini sebenarnya (bahasa sederhana)

Bayangkan kamu mau bikin aplikasi. Cara biasa: kamu bilang ke AI *"buatkan fitur X"*,\
AI langsung menulis kodenya, selesai — dan kamu **tidak paham apa pun** tentang yang barusan\
dibuat.

VibeWise menyisipkan **percakapan sebelum kode**:

```plaintext
Kamu  : "Catatan bisa ada di beberapa folder. Hapus folder = hapus catatannya."
AI    : ✦ Build checkpoint: Menghapus catatan bersama
        "Catatan ini ada di Travel DAN Summer. Kalau Travel dihapus,
         catatan itu di Summer harus jadi apa?"
Kamu  : "Tetap di Summer. Kalau tidak ada folder lagi, biarkan tanpa folder."
AI    : ✦ Design checkpoint: Keanggotaan folder
        [ringkasan rancangan + tradeoff]
        ❯ 1. Confirm and continue   2. Discuss
```

AI **tidak menyarankan solusi dulu**. Ia menunggu kamu berpikir. Baru setelah kamu\
**konfirmasi**, AI menulis kodenya — lalu melaporkan apa yang berubah dan kenapa.

**Aturan intinya** (dari `skills/learn/behavior.md`):

- Pelajar = *engineer*-nya. Ia yang memiliki rancangan.
- AI **menunggu** pendekatanmu sebelum menawarkan miliknya.
- Kalau kamu minta bantuan/tersangkut → baru AI memberi opsi, lalu **mengembalikan\
  keputusan** ke kamu.
- Dilarang: memuji ("bagus sekali!"), *hype*, merendahkan.
- Dilarang: menyuapi satu per satu bahan yang kurang supaya "kamu" seolah menemukannya.

---

## 3\. Isi teknis — hanya 22 berkas

```plaintext
.claude-plugin/     plugin.json · marketplace.json · icon.svg
.codex-plugin/      plugin.json                    (bundel Codex native)
.agents/plugins/    marketplace.json               (katalog agen generik)
hooks/              hooks.json · session_start.py  (127 baris)
skills/learn/       SKILL.md (55) · behavior.md (136) · onboarding.md (63)
                    state-templates.md (100) · codex.md (21) · agents/openai.yaml
skills/reset/       SKILL.md (51) · reset.py (112) · codex.md (14) · agents/openai.yaml
tests/              test_session_start.py (280) · test_reset.py (242)
docs/               development.md · demos/notion-dupe.md
```

**Perhatikan proporsinya:** yang "mengajar" hanya **136 baris** (`behavior.md`).\
Selebihnya infrastruktur: hook, state, tes, dua varian harness. Ini plugin **engineering**,\
bukan plugin **pedagogi**.

### 3.1 Tiga berkas status di `.vibe-wise/`

| Berkas | Isi |
| --- | --- |
| `profile.md` | Situasi proyek · level pengalaman · preferensi · konsep kuat/berkembang/perlu diulang |
| `progress.md` | Catatan per topik: *Introduced* / *Demonstrated understanding* / *Needs reinforcement* |
| `project-map.md` | Tujuan · kebutuhan · komponen · alur utama · batas data & kepercayaan · build/deploy · **Unknowns** |

Dua baris pertama `profile.md` (`Learning mode:` dan `Onboarding:`) **dibaca oleh hook** —\
jadi formatnya tidak boleh diubah. Ada juga dukungan nama lama `.sensible-vibes/`\
(plugin ini pernah bernama *sensible-vibes*, diganti di versi 0.1.13).

### 3.2 Hook `SessionStart` — mekanisme paling menarik

```json
{ "hooks": { "SessionStart": [ { "matcher": "startup|resume|clear|compact|fork",
  "hooks": [ { "type": "command",
    "command": "python3 \"${CLAUDE_PLUGIN_ROOT}/hooks/session_start.py\"", "timeout": 5 } ] } ] } }
```

Yang dilakukannya — dan **ini yang cerdik**:

1. Mencari `.vibe-wise/` dari direktori kerja ke atas, **berhenti di batas repo Git**\
   (supaya tidak memuat catatan proyek lain).
2. Menolak *symlink* (mencegah catatan proyek lain disusupkan).
3. Membaca `profile.md` **baris demi baris** untuk mencari `Learning mode: paused` —\
   tanpa memuat isinya ke memori.
4. Kalau mode belajar aktif → mengeluarkan `additionalContext` berisi **instruksi baca**\
   (bukan isi catatan).

**Konsekuensi desain yang bagus:** ukuran keluaran hook **tidak tumbuh** seiring riwayat\
belajar. Catatan besar tidak membanjiri konteks di awal sesi; Claude yang membaca berkasnya\
sendiri. Ada tes khusus untuk ini ("constant-size restoration instructions as notes grow").

**Yang tidak dilakukannya** (dan dikatakan jujur di komentar): hook **tidak mengajar**,\
**tidak menulis catatan**, **tidak membaca transkrip percakapan**. Ia hanya menunjuk berkas.

### 3.3 Tiga jenis *checkpoint*

| Checkpoint | Isi | Tombol |
| --- | --- | --- |
| **Build** | Pelajar menalar pendekatannya | — (pertanyaan terbuka di chat) |
| **Design** | Ringkasan rancangan + tradeoff | *Confirm and continue* / *Discuss* |
| **Implementation** | Perubahan kode spesifik | *Implement this step* / *Discuss* |

Bukan tiga perhentian wajib. Kalau sudah siap menulis kode, *Implementation* sekaligus\
mengesahkan rancangan. Judul wajib persis: `✦ Build checkpoint: <deskripsi>` — satu `✦`\
di depan, tanpa emoji lain.

### 3.4 Level & preferensi

- Pengalaman: **Beginner / Intermediate / Advanced** (mengubah **cara menjelaskan**,\
  bukan kepemilikan keputusan).
- Frekuensi checkpoint: **Light / Normal / Frequent** (terpisah dari level).
- Gaya pertanyaan: **Open-ended / Multiple choice / Mixed**.
- Siapa menulis kode: **AI writes / A mix / More hands-on**.

---

## 4\. 🟢 Kalimat-kalimat yang selaras dengan repo ini

Ini yang membuat saya menghormati proyek ini — ia jujur tentang batasnya:

&nbsp;

> *"Self-reported experience isn't demonstrated understanding."*\
> (Level yang dilaporkan sendiri ≠ pemahaman yang dibuktikan)

> *"Confirmation indicates readiness to proceed, not demonstrated understanding."*\
> (Menekan tombol konfirmasi ≠ paham)

> *"They do not prove that Claude follows the instructions or teaches well."*\
> (Tentang 37 tes otomatisnya sendiri — di `docs/development.md`)

> *"Checkpoint quality remains model-dependent; these examples verify observed behavior,\
> not a guarantee for every conversation."*

> *"Be factual: no personal praise, hype, or belittling."*

Keempatnya persis prinsip yang sudah berlaku di repo ini: **bukti bukan klaim**, dan\
jangan menyamakan aktivitas dengan pemahaman.

---

## 5\. Perbandingan jujur dengan Mode Inspeksi repo ini

| Aspek | VibeWise | Repo ini |
| --- | --- | --- |
| Siapa menulis kode | **AI** (pelajar merancang) | AI hanya untuk boilerplate; inti dikerjakan pelajar |
| Tingkat kedalaman | **Arsitektur/desain** saja | Arsitektur **dan** kode (LACAK · SUSUN · KLAIM · TELUSUR) |
| Dasar riset | ❌ tidak ada | PRIMM · Parsons · Lister 2004 · Harms 2016 · RCT Anthropic 2026 |
| Gerbang terukur | ❌ tidak ada | ✅ ambang **50% akurasi melacak** (Lister 2004) |
| Bukti pemahaman | catatan `progress.md` (self-report AI) | `prediksi.md` + verifikasi **timestamp** |
| Latihan membaca kode | ❌ tidak ada | ✅ 4 latihan BEDAH |
| Persistensi mode | ✅ **hook otomatis** (startup/resume/clear/compact) | ❌ manual — panggil skill |
| Distribusi ke agen | Claude Code + Codex (+ port komunitas) | **12 lokasi** (7 global + 4 in-repo + junction agy) |
| Struktur | 22 berkas, 1.201 baris | \~12 skill `teach-*` + 18 skill pipeline Bab 27 |
| Kematangan | 12 hari, 1 penulis, **0 rilis** | sejak Sep 2026, banyak sesi audit |

**Kesimpulan:** dua proyek ini **tidak bersaing secara langsung**. VibeWise menjawab\
*"bagaimana saya tidak kehilangan pemahaman saat AI menulis kode saya?"* Repo ini menjawab\
*"bagaimana saya melatih kemampuan membaca & menalar kode?"*. Yang pertama soal **desain**,\
yang kedua soal **kompetensi**.

---

## 6\. Yang layak dipertimbangkan untuk repo ini

Bukan rekomendasi untuk dibangun — hanya daftar bahan pertimbangan.

1. **Hook pengembalian konteks.** Ini celah nyata di repo ini. Mode Inspeksi hari ini\
   hilang begitu konteks terpotong; `prediksi.md` harus diingat manual. Mekanisme\
   `SessionStart` → `additionalContext` bisa dipelajari (WorkBuddy punya hook juga —\
   lihat dokumentasi WorkBuddy).
2. **Bagian** `## Pending decision` **yang bertahan lintas sesi.** VibeWise menyimpan\
   keputusan yang belum selesai **di luar** topik, lengkap dengan *stage*-nya\
   (*awaiting reasoning* / *choice confirmation* / *implementation approval*).\
   Repo ini punya gerbang, tapi tidak punya cara menyimpannya.
3. `disable-model-invocation: true` di frontmatter. Mencegah skill terpicu otomatis —\
   relevan untuk validasi frontmatter yang sudah dijalankan di repo ini (`MEMORY.md` §5).
4. **Pola** `ports/<harness>/` untuk port lintas agen. Ini cara lain memecahkan masalah\
   yang sama dengan 12 lokasi — *satu direktori per target*, perilaku kanonik tetap di\
   `skills/`. Perlu dibandingkan dengan skrip `cek-distribusi-skill.sh`.
5. **Berkas** `Unknowns` **eksplisit** di `project-map.md`. Repo ini sudah punya\
   `AUDIT-CAKUPAN.md`; VibeWise menaruh ketidaktahuan **di dalam** peta, bukan di berkas\
   terpisah.

---

## 7\. Jebakan & catatan

1. 🔴 **Bintang tinggi ≠ tervalidasi.** 3.392 bintang dalam 12 hari, tapi: **satu penulis**,\
   **nol rilis GitHub**, **21 issue terbuka**, dan tesnya sendiri diakui *"do not prove\
   that Claude follows the instructions or teaches well"*. Perlakukan sebagai **eksperimen\
   menarik**, bukan standar.
2. 🔴 **"Vibe coding" di namanya bertentangan dengan tesis repo ini.** Mengadopsi nama atau\
   posisinya utuh akan mengaburkan apa yang repo ini perjuangkan.
3. ⚠️ **Filosofinya berlawanan pada satu titik krusial:** AI tetap yang menulis kode.\
   Menyalin alurnya berarti membatalkan batas delegasi Mode Inspeksi (`MEMORY.md` §3).
4. ⚠️ **Kualitasnya bergantung model** — diakui sendiri di `docs/development.md`.\
   Artinya perilaku di model gratis (yang dipakai xcode) **belum diuji** oleh penulisnya.
5. ⚠️ **Butuh Python 3** (Claude Code: hook + reset; Codex: reset saja). Di Windows,\
   `hooks.json` memanggil `python3` — perlu dicek apakah alias itu ada.
6. ⚠️ **Ekosistem port belum resmi.** Issue #18 melacak port ke Cursor, OpenCode, Codex,\
   Antigravity, Copilot, Crush, Hermes, Pi — **semuanya masih PR/issue terbuka**, bukan\
   bagian dari repo utama. Port OpenCode yang disebut di issue #23\
   (`TeddySabatier/opencode-vibe-wise`) punya **0 bintang** dan tidak di-host penulis asli.
7. ℹ️ **Pernah berganti nama** dari `sensible-vibes` → `vibe-wise` (v0.1.13). Kalau mencari\
   referensi lama, namanya berbeda.

---

## 8\. Sumber

Semua diakses 11 Okt 2026.

1. `github.com/nykooi1/vibe-wise` — README · `skills/learn/SKILL.md` · `behavior.md` ·\
   `onboarding.md` · `state-templates.md` · `skills/reset/SKILL.md` · `reset.py` ·\
   `hooks/hooks.json` · `hooks/session_start.py` · `docs/development.md` ·\
   `docs/demos/notion-dupe.md` · `.claude-plugin/plugin.json` · `.codex-plugin/plugin.json`
2. GitHub REST API — metadata repo (bintang, fork, lisensi, tanggal, kontributor, bahasa)
3. Daftar issue terbuka #2, #13, #18, #23 dan daftar PR terbuka #8–#25
4. `github.com/anthropics/claude-plugins-official` → `plugins/learning-output-style`\
   (disebut VibeWise sebagai pembanding; **belum saya verifikasi sendiri**)
5. Dokumentasi Claude Code: `code.claude.com/docs/en/plugins/create` · `/skills` ·\
   `/hooks` · `/plugin-marketplaces` (dikutip VibeWise; **belum diverifikasi ulang**)

---

**📅 Riset:** 11 Oktober 2026 · **Untuk:** `xcode`\
**📚 Terkait:** `riset-stitch-cli-mcp-sdk.md` · `riset-sentry.md` ·\
`.workbuddy-ai/memory/MEMORY.md` §3 (Mode Inspeksi) · §4 (dasar riset)
