# BAB 29 — Sentry: Logging Error di Production

> **💬 Bayangkan ini:** Aplikasi laporan sekolahmu sudah live. Guru memakainya setiap hari.
> Suatu pagi ada yang menelepon: *"layar rekap kosong, kenapa ya?"* Kamu buka laptop,
> coba sendiri — **jalan normal**. Kamu tidak tahu guru itu pakai browser apa, halaman
> mana, jam berapa, dan apa yang dia klik sebelumnya.
>
> **Tanpa logging, kamu buta.** Kamu hanya tahu ada masalah setelah seseorang mengeluh —
> dan kamu tidak punya cara mereproduksinya. Bab ini memasang **mata** untuk aplikasi
> produksimu.

> **🔗 Kenapa bab ini ada:** Bab 27 **sudah menyebut Sentry** di Tahap 6 langkah 22 dan
> langkah 25 (*"🚀 PRODUCTION — dipantau Sentry + UptimeRobot"*), tapi **tidak pernah
> menjelaskan cara memasangnya**. Bab ini menutup celah itu.

> **MULAI:** aplikasi produksi yang jalan **tanpa** logging error terstruktur.
> **SELESAI (kriteria yang bisa diperiksa):**
> 1. Error nyata dari aplikasi produksi **muncul di dashboard** Sentry — bukan di log lokal.
> 2. Setiap error membawa **requestId**, **release/versi**, dan **user context**.
> 3. Ada **alert** yang sampai ke email saat error baru muncul, dengan **runbook 3 baris**.
> 4. AI agent bisa **membaca error itu lewat MCP** dan menelusuri akarnya.
> 5. Terpasang di **Bab 27**: instrumentasi di Tahap 5, gate di Tahap 6, loop insiden pasca-rilis.

---

## 29.1 Sentry dalam Satu Paragraf

**Sentry = sistem alarm + kotak hitam untuk aplikasi produksi.**

Ia **bukan** alat yang kamu buka seperti aplikasi biasa. Kamu menempelkan **SDK**
(sekitar 3 baris) ke dalam kode, lalu setiap kali terjadi error di aplikasi nyata, SDK
melapor ke server Sentry. Kamu dapat:

- **Error apa** yang terjadi, dengan **baris kode** penyebabnya
- **Berapa kali** dan **sejak kapan**
- **Siapa** yang kena, di **browser/perangkat** apa
- **Apa** yang dia lakukan sebelum error (session replay)
- **Seberapa lambat** halaman itu (performance monitoring)

**Analogi yang tepat:** kalau `console.log` adalah **menulis catatan di buku pribadi**,
Sentry adalah **CCTV + alarm** yang merekam sendiri, mengelompokkan kejadian, dan
membangunkanmu saat ada yang tidak wajar.

---

## 29.2 📖 TEORI — Tiga Jenis Data, Jangan Dicampur

Sentry menangani tiga hal berbeda. Pemula sering mengira semuanya sama.

| Jenis | Menjawab pertanyaan | Contoh |
|---|---|---|
| **Error** | *"Apa yang rusak?"* | `TypeError: Cannot read property 'nama' of undefined` di `rekap.js:42` |
| **Tracing / Performance** | *"Apa yang lambat?"* | Query database butuh 4,2 detik; render halaman 8 detik |
| **Session Replay** | *"Apa yang dia lakukan sebelum itu?"* | Rekaman 30 detik: klik tombol → pilih tanggal → layar putih |

**Kenapa ini penting:** ketiganya punya **kuota terpisah** di paket gratis. Error 5.000/bulan,
tapi replay hanya **50**. Jangan mengaktifkan replay untuk semua orang — kamu akan
kehabisan kuota di hari kedua.

### 29.2.1 Hubungan dengan `/observability-and-instrumentation`

Ini sering salah dipahami, jadi ditulis tegas:

| | `/observability-and-instrumentation` | **Sentry** |
|---|---|---|
| Apa itu | **Cara berpikir** — disiplin instrumentasi | **Alat** — tempat datanya mendarat |
| Bentuk | Skill (panduan agent) | Layanan (SaaS atau self-host) |
| Isi | Pertanyaan on-call dulu → structured logging + requestId → RED metrics → OTel tracing → alert symptom-based + runbook | Menyimpan, mengelompokkan, menampilkan, dan memberi alert |

**Sentry bukan pengganti skill itu — Sentry adalah salah satu tempat menerapkannya.**
Skill mengajarkan **apa yang harus diukur**; Sentry adalah **wadahnya**.

⚠️ Kalau kamu pasang Sentry tanpa mengikuti disiplin itu, kamu hanya dapat **tumpukan
error tanpa konteks** — dan itu hampir tidak berguna untuk debugging.

---

## 29.3 💰 Yang Gratis vs Berbayar — Kenyataan Sebelum Mulai

**Bisa dipakai gratis. Paket `Developer` = $0, tanpa batas waktu, tanpa kartu kredit.**
Kalimat resmi: *"Start free on the Developer plan **forever**."*

| | Kuota gratis |
|---|---|
| Error | **5.000 / bulan** |
| Tracing | 5 juta span |
| Logs | 5 GB |
| **Session Replay** | **50** rekaman ← paling cepat habis |
| Uptime / Cron monitor | 1 masing-masing |
| Dashboard kustom | 10 |
| Proyek | Tak terbatas |
| **MCP access** | ✅ **termasuk** |
| Retensi data | **30 hari** |

### 🔴 Dua hal yang wajib kamu tahu

**1. "1 pengguna" ≠ "1 orang memakai aplikasimu".**
Yang dibatasi adalah **siapa yang bisa membuka dashboard Sentry** — cuma kamu. Aplikasi
sekolah tetap bisa dipakai berapa pun guru. Ini kekeliruan yang paling sering terjadi.

**2. Kuota lewat = data DIBUANG, bukan ditagih.**
Kalimat verbatim dari dokumentasi resmi:

> *"Events and attachments that exceed your quota **will not be accepted**."*

Artinya **tidak ada tagihan kejutan**. Paket gratis **tidak bisa** diam-diam berubah jadi
berbayar. Ini yang membuatnya aman untuk dicoba.

### Kapan perlu naik paket

| Paket | Harga | Naik kalau… |
|---|---|---|
| Developer | **$0** | (mulai di sini) |
| Team | $26/bln | Butuh **orang lain** membuka dashboard, atau retensi >30 hari |
| Business | $80/bln | Butuh manajemen kuota lanjutan, SAML/SCIM |

⚠️ **Seer** (debugger AI bawaan Sentry) = **$40/kontributor aktif/bulan** — **tidak**
termasuk paket gratis.

### ❌ Jangan self-hosted (untuk sekarang)

Self-hosted gratis dan tanpa batas kuota, **tapi butuh**:

```
4 CPU core · 16 GB RAM + 16 GB swap · 20 GB disk
Docker 19.03.6+ · Docker Compose 2.32.2+
```

Kalimat resminya: *"no guarantees or dedicated support."* Plus **Seer dan semua fitur
AI/ML tidak tersedia** (closed source). Untuk belajar dan aplikasi sekolah, ini
**berlebihan** dan menambah beban operasional yang tidak melayani tujuan.

---

## 29.4 🎯 CONTOH NYATA — Aplikasi Laporan Sekolah

Ini yang terjadi **tanpa** Sentry:

```
07:40  Guru membuka halaman rekap → layar kosong
07:41  Guru menutup, buka lagi → masih kosong
07:42  Guru bertanya ke teman → temannya juga kosong
08:15  Kamu baru tahu (ditelepon)
08:16  Kamu buka di laptopmu → JALAN NORMAL
08:17  Kamu bingung. Tidak ada log. Tidak tahu error apa.
       → 2 jam menebak, mungkin tidak ketemu
```

Ini yang terjadi **dengan** Sentry:

```
07:40  Guru membuka halaman rekap → error
07:40  SDK melapor ke Sentry, otomatis
07:40  Sentry kirim email ke kamu:
       "TypeError baru di /rekap, 12 kejadian, 12 pengguna kena"

08:15  Kamu buka email, klik tautan:
       - Baris kode: rekap.js:42
       - Penyebab: tanggal kosong tidak ditangani
       - Browser: 11 dari 12 pengguna pakai Safari
       - requestId: a3f9-...  → bisa dilacak di log lengkap
       - Release: v1.4.2 (rilis kemarin 21:00)

08:20  Kamu tahu persis. Fix 15 menit.
```

**Bedanya bukan "lebih cepat sedikit" — bedanya antara *tahu* dan *menebak*.**

---

## 29.5 💡 PRAKTIK — Langkah demi Langkah

Ikuti berurutan. Jangan lompati **Langkah 5** — itu langkah yang paling sering dilewati
dan paling penting.

### Langkah 0 — Prasyarat

- [ ] Aplikasi sudah bisa dijalankan secara lokal
- [ ] Kamu tahu stack-nya (Node/Express? Next.js? React saja?)
- [ ] **Sudah ada** `observability-and-instrumentation` dijalankan minimal sebagian
      (Bab 27.4b) — kalau belum, mulai dari situ dulu
- [ ] Aplikasi **belum** wajib live; Sentry berguna sejak lokal

### Langkah 1 — Buat Akun & Organisasi

1. Buka `sentry.io/signup/`
2. Daftar → pilih **Developer plan** (gratis, jangan pilih trial Business kalau tidak perlu)
3. Buat **organization** (mis. `sekolah-xyz`)
4. **Tidak perlu kartu kredit.**

### Langkah 2 — Buat Proyek → Dapat DSN

1. **Projects → Create Project**
2. Pilih **platform** sesuai stack → Sentry menampilkan **DSN**
3. DSN berbentuk seperti ini (contoh, bukan milikmu):

```
https://<kunci-publik>@o<org-id>.ingest.sentry.io/<project-id>
```

⚠️ **DSN bukan rahasia** — ia memang dikirim ke browser. Tapi **tetap** jangan
menaruhnya mentah di kode; pakai environment variable supaya bisa diganti per lingkungan
(dev/staging/production).

### Langkah 3 — Simpan DSN dengan Benar

```
.env                 ← berisi DSN asli       (JANGAN di-commit)
.env.example         ← berisi nama variabel  (WAJIB di-commit, tanpa nilai asli)
.gitignore           ← pastikan .env ada di sini
```

Isi `.env.example` (aman di-commit):

```
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

⚠️ **Repo ini sudah memuat API key bocor** (`freellmapi-api-keys.md`). **Jangan menambah
yang baru.** Kalau `.env` pernah ter-commit, ganti DSN-nya — bukan sekadar hapus filenya.

### Langkah 4 — Pasang SDK

Pilih **satu** paket sesuai stack (versi terverifikasi: **11.6.0**):

| Stack | Paket |
|---|---|
| Node / Express / backend | `@sentry/node` |
| React (SPA, tanpa SSR) | `@sentry/react` |
| Next.js | `@sentry/nextjs` |
| Browser murni (tanpa bundler) | `@sentry/browser` |

**Prinsip yang berlaku di semua stack** (bukan kode lengkap — ambil snippet persisnya
dari halaman *Setup* proyekmu di Sentry):

1. **Inisialisasi harus jalan SEBELUM kode aplikasimu dimuat.** Untuk Node, pola resminya
   adalah file instrument terpisah yang dimuat dengan flag:

   ```bash
   node --import ./instrument.mjs app.mjs
   ```

   ⚠️ `--require` **sudah tidak didukung** untuk inisialisasi. Pakai `--import`.
   Kalau salah urutan, error saat *startup* tidak akan tertangkap.

2. **Kirim `environment`** (`development` / `staging` / `production`) supaya error dari
   laptopmu tidak tercampur dengan error guru di sekolah.

3. **Jangan mengaktifkan semua fitur sekaligus.** Mulai dari **error saja**. Tracing
   belakangan. Replay **jangan dulu** (kuota 50).

### Langkah 5 — ⚠️ BUKTI: Pastikan Error Benar-benar Masuk

**Ini langkah yang paling sering dilewati.** Banyak orang memasang SDK, merasa selesai,
lalu berbulan-bulan kemudian baru sadar tidak ada satu pun error yang masuk.

```
1. Tambahkan rute/aksi yang sengaja error (sementara):
     throw new Error("TES SENTRY — hapus setelah ini")

2. Jalankan aplikasi, picu error itu

3. Buka dashboard Sentry → Issues
   → error "TES SENTRY" HARUS muncul dalam hitungan detik

4. HAPUS kode tes itu, lalu picu sekali lagi
   → error baru tidak boleh muncul
```

Kalau langkah 3 gagal, penyebab tersering:

| Gejala | Penyebab umum |
|---|---|
| Tidak ada apa pun di dashboard | `Sentry.init()` jalan **terlalu telat** (setelah modul lain dimuat) |
| Error lokal masuk, produksi tidak | DSN produksi belum di-set / salah lingkungan |
| Hanya sebagian error masuk | Error tertangkap lebih dulu oleh error handler milikmu |
| Error browser tidak masuk | Ad-blocker memblokir request ke `ingest.sentry.io` |

✅ **Kriteria lulus:** kamu sudah **melihat sendiri** error tes muncul, lalu hilang setelah
dihapus. Kalau belum, **jangan lanjut**.

### Langkah 6 — Beri Konteks (Ini yang Membuat Sentry Berguna)

Error tanpa konteks = tumpukan teks. Yang membuatnya berharga adalah **konteks**.
Ini bagian yang menyambung langsung ke `/observability-and-instrumentation`:

| Yang ditambahkan | Kenapa |
|---|---|
| **`requestId` / correlation ID** | Menghubungkan error di Sentry dengan log lengkap di server — **paling penting** |
| **Release / versi** | *"Error ini muncul sejak rilis mana?"* → bisa langsung kaitkan dengan deploy |
| **User context** | ID pengguna (⚠️ **bukan** nama/email — lihat jebakan di 29.9) |
| **Environment & tag** | Memisahkan production / staging / development |
| **Breadcrumbs** | Jejak langkah sebelum error (otomatis, tapi bisa diperkaya) |

⚠️ **Aturan:** Sentry **bukan** pengganti log server. Ia **penunjuk arah**. Log lengkap
tetap di server, dihubungkan lewat `requestId`. Jangan kirim seluruh isi log ke Sentry —
kuotanya akan habis dan biayanya mahal.

### Langkah 7 — Alert + Runbook 3 Baris

Alert tanpa runbook = kamu bangun tengah malam dan tidak tahu harus apa.

```
Untuk SETIAP alert, tulis 3 baris di docs/runbooks/:
  1. ARTINYA   : apa yang terjadi kalau alert ini bunyi
  2. CEK DULU  : satu perintah / satu tautan pertama yang dibuka
  3. ESKALASI  : kalau tidak selesai dalam X menit, hubungi siapa / lakukan apa
```

Setelan alert yang disarankan untuk pemula (**symptom-based**, bukan setiap error):

- ✅ Alert kalau **error baru** (yang belum pernah muncul) — ini yang penting
- ✅ Alert kalau **jumlah error naik tajam** dibanding biasanya
- ❌ **Jangan** alert untuk setiap error — kamu akan mematikan notifikasinya dalam 3 hari
- ✅ Aktifkan **spike protection** (otomatis di SaaS) — mencegah satu bug loop
  menghabiskan seluruh kuota

### Langkah 8 — Jaga Kuota

⚠️ **Risiko nyatanya bukan jumlah kuota, tapi POLA BERULANG.**

Satu bug yang menyala di setiap pemuatan halaman bisa menghabiskan 5.000 error dalam
**hitungan jam**. Penangkalnya:

1. **Spike protection** — aktifkan (otomatis di SaaS)
2. **Rate limit** di SDK — batasi jumlah event per menit
3. **`beforeSend`** — saring event yang tidak berguna sebelum dikirim
4. **Sample rate untuk tracing** — jangan kirim 100% trace; mulai dari 10%
5. **Jangan aktifkan replay untuk semua orang**

---

## 29.6 🤖 Integrasi dengan AI Agent (MCP)

Ini bagian yang membuat Sentry jauh lebih berguna di alur kerjamu: **agent bisa membaca
error sendiri**, tanpa kamu menyalin-tempel.

### 29.6.1 Kenapa ini penting

Tanpa MCP, alurnya: *kamu* buka dashboard → *kamu* baca error → *kamu* jelaskan ke agent.
Dengan MCP: agent membaca error langsung dari Sentry, dan bisa menelusuri akarnya.

**Perhatikan:** ini **bukan** menggantikan `/debugging-and-error-recovery`. Urutannya tetap:

```
1. Agent BACA error dari Sentry (MCP)        → tahu APA yang terjadi
2. Agent CARI AKAR MASALAH                    → /debugging-and-error-recovery
3. Baru fix                                   → /ai-coding-coach
```

⚠️ **Aturan Bab 27.4b tetap berlaku: TIDAK BOLEH menulis fix SEBELUM akar masalah terbukti.**
MCP hanya mempercepat langkah 1 — ia **tidak** membolehkan lompat ke langkah 3.

### 29.6.2 Dua Cara Menyambung

Sentry menyediakan MCP resmi (`getsentry/toolkit`, 919 ⭐, npm `@sentry/mcp-server` v0.42.0).

**Cara A — Remote (paling mudah, OAuth)**

```
URL: https://mcp.sentry.dev/mcp
```

Kamu tidak perlu menyimpan token. Saat pertama dipakai, agent akan membuka alur OAuth
untuk login ke Sentry.

**Cara B — Remote dengan token eksplisit**

Untuk klien yang mendukung header kustom:

```json
{
  "mcpServers": {
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp",
      "headers": {
        "Authorization": "Sentry-Bearer ${SENTRY_ACCESS_TOKEN}"
      }
    }
  }
}
```

⚠️ `Sentry-Bearer` **berbeda** dari `Bearer` biasa. `Bearer` disediakan untuk token OAuth
MCP; `Sentry-Bearer` meneruskan token Sentry-mu apa adanya.

**Cara C — stdio lokal (untuk self-hosted)**

```bash
npx @sentry/mcp-server@latest --access-token=sentry-user-token
```

Untuk self-hosted, tambahkan `--host=nama-host` (hanya nama host, mis.
`--host=sentry.example.com`). Kalau internal tanpa TLS, tambah `--insecure-http`.

### 29.6.3 🔑 Scope Token yang Dibutuhkan

Buat **User Auth Token** di Sentry dengan scope berikut (daftar resmi dari repo-nya):

```
org:read
project:read
project:write
team:read
team:write
event:write
```

⚠️ **Token ini SANGAT sensitif** — ia bisa membaca dan menulis data di organisasi Sentry-mu.
Simpan sebagai environment variable. **JANGAN pernah** menaruhnya di repo ini, yang sudah
memuat 9 API key bocor.

### 29.6.4 Membatasi Tool yang Diekspos

MCP Sentry punya beberapa kelompok kemampuan (*skills*): `inspect`, `triage`, `seer`,
`project-management`. Kamu bisa mempersempit:

```
?skills=inspect,triage              (remote, lewat query string)
--skills=inspect,seer               (stdio)
--disable-skills=project-management (stdio)
```

**Saran:** mulai dari `inspect` saja. Ia yang membaca error — itu yang kamu butuhkan.
`project-management` memberi agent kemampuan **mengubah** data di Sentry; aktifkan hanya
kalau kamu memang mau.

⚠️ **`seer` tidak tersedia di self-hosted** — Sentry otomatis membuangnya kalau `--host`
menunjuk ke host non-`sentry.io`.

### 29.6.5 ⚠️ Dua Peringatan Penting

**1. Tool pencarian AI butuh provider LLM sendiri.**
Tool seperti `search_errors`, `search_traces`, `search_logs`, `search_issues` menerjemahkan
bahasa manusia jadi sintaks query Sentry — dan itu **butuh provider LLM** (OpenAI, Azure
OpenAI, Anthropic, atau OpenRouter).

🔴 **Ini keputusan manusia.** Sesuai `MODEL-POLICY.md`, **agent dilarang memilih model.**
Kalau kamu ingin tool pencarian AI ini aktif, **kamu** yang menentukan provider-nya.
Tanpa itu, tool lain tetap berfungsi normal.

**2. Data sensitif bisa ikut terbaca agent.**
MCP memberi agent akses ke isi error — dan isi error bisa memuat data guru/siswa.
Sebelum menyambungkan MCP ke proyek sekolah, pastikan kamu sudah menerapkan penyaringan
di Langkah 6 (§29.9).

### 29.6.6 Di Mana Config Ditulis

| Agent | Lokasi config |
|---|---|
| WorkBuddy | `~/.workbuddy-ai/mcp.json` |
| opencode | `~/.config/opencode/opencode.json` (blok `mcp`, `"type": "remote"`) |
| agy (Antigravity) | `~/.gemini/config/mcp_config.json` |
| cline | config MCP cline |
| pi / omp | config MCP masing-masing |

⚠️ **Tidak ada installer otomatis** untuk agent-agent di atas — tulis manual, lalu
**verifikasi dengan tool nyata** (panggil `list_projects` atau yang setara). Jangan
percaya status "konek" saja: ada MCP yang menjawab handshake dengan sukses meski
kredensialnya salah.

---

## 29.7 🔗 Integrasi ke Workflow Bab 27

Inilah bagian yang menyatukan semuanya. Sentry menyentuh Bab 27 di **empat titik**.

### 29.7.1 Peta Titik Sentuh

```
TAHAP 5 — BUILD
  └─ /observability-and-instrumentation  (instrumentasi bersama build)
     └─ Sentry = wadah untuk: structured log + requestId + release tag
        ⚠️ DIPASANG SAAT BUILD, bukan setelah deploy

TAHAP 6 — VERIFIKASI, KEAMANAN, DEPLOY
  ├─ langkah 22: /deploy-production-gate
  │    └─ Checklist P1 termasuk: DSN produksi terpasang + error tes terbukti masuk
  └─ langkah 25: 🚀 PRODUCTION — dipantau Sentry + UptimeRobot

PASCA-PRODUCTION (loop insiden)
  └─ Alert masuk → agent BACA via MCP → /debugging-and-error-recovery
     → /sprint-planner (kalau perlu) → fix → runbook diperbarui

BUG FIX ROUTING (27.4b)
  └─ Langkah 1 "Perlu tahu APA yang terjadi?" → Sentry adalah jawabannya
```

### 29.7.2 Aturan Batin (Gaya 27.4)

Tambahkan blok ini ke keluarga aturan batin di Bab 27:

```
/sentry  (Sentry — logging error produksi)
KAPAN  : Tahap 5 (instrumentasi bersama build), Tahap 6 (deploy gate),
         dan setiap kali ada bug produksi.
BUTUH  : Akun Sentry (paket Developer, gratis) + DSN sebagai env var.
         Untuk agent: MCP https://mcp.sentry.dev/mcp + User Auth Token.
OUTPUT : Dashboard Sentry + alert email + runbook 3 baris di docs/runbooks/
ATURAN : 🔴 Sentry = PENUNJUK ARAH, bukan pengganti log server.
         Log lengkap tetap di server, dihubungkan lewat requestId.
         DILARANG memasang Sentry SETELAH deploy — instrumentasi
         DIBERSAMA build (Tahap 5), sama seperti aturan observability.
         DILARANG mengaktifkan session replay untuk semua orang (kuota 50).
         DILARANG menulis fix sebelum akar masalah terbukti (27.4b).
         DILARANG memilih provider LLM untuk tool pencarian AI
         (MODEL-POLICY.md) — itu keputusan manusia.
BATAL  : Proyek lokal/sekali pakai yang tidak akan dipakai orang lain;
         prototipe throwaway.
```

### 29.7.3 Perubahan yang Perlu di Bab 27

| Lokasi di Bab 27 | Perubahan |
|---|---|
| 27.1 Lapis 2 | tambah baris `/sentry` sebagai alat (bukan skill) |
| 27.2 tabel routing | baris `/sentry` + rujukan ke Bab 29 |
| 27.3 Tahap 5 | sebut Sentry sebagai wadah instrumentasi |
| 27.3 Tahap 6 langkah 22 | rinci: DSN + error tes terbukti masuk = bagian checklist P1 |
| 27.3 Tahap 6 langkah 25 | rujuk Bab 29 untuk loop pasca-production |
| 27.4 aturan batin | blok `/sentry` di atas |
| 27.4b routing bug fix | langkah 1 → tambahkan "(atau Sentry via MCP)" |
| 27.5 cheat sheet | baris `/sentry` |
| changelog | catat Bab 29 |

### 29.7.4 Yang **Tidak** Boleh Diubah

⚠️ **Jangan menjadikan Sentry pengganti `/observability-and-instrumentation`.**
Skill itu mengajarkan **cara berpikir** (pertanyaan on-call dulu, RED metrics, alert
symptom-based, runbook). Sentry hanya **wadah**. Memasang Sentry tanpa disiplin itu
menghasilkan tumpukan error tanpa konteks — hampir tidak berguna.

⚠️ **Jangan menaruh Sentry di jalur kritis tanpa rencana cadangan.** Sentry adalah
layanan pihak ketiga. Kalau ia mati, aplikasimu **tetap harus jalan**. SDK-nya sudah
dirancang gagal-senyap (fail silently), tapi pastikan error handling aplikasimu tidak
bergantung padanya.

---

## 29.8 ✅ CHECKLIST — Sentry Siap Production

**Sebelum deploy (Tahap 5–6):**

- [ ] Akun Sentry dibuat, paket **Developer** (gratis)
- [ ] Proyek dibuat, **DSN** disimpan di `.env` — **bukan** di kode
- [ ] `.env.example` ada dan berisi nama variabel (tanpa nilai asli)
- [ ] `.env` sudah masuk `.gitignore`
- [ ] SDK terpasang dengan versi yang **di-pin** di `package.json`
- [ ] `Sentry.init()` jalan **sebelum** modul aplikasi dimuat
- [ ] `environment` di-set (`production` / `staging` / `development`)
- [ ] 🔴 **Error tes TERBUKTI masuk dashboard**, lalu terbukti hilang setelah dihapus
- [ ] `requestId` dikirim bersama setiap error
- [ ] `release` / versi di-set, terhubung dengan commit hash
- [ ] Session replay **TIDAK** aktif untuk semua orang

**Setelah deploy (pasca-production):**

- [ ] Alert "error baru" aktif dan **sampai ke email** (uji sendiri)
- [ ] Setiap alert punya **runbook 3 baris** di `docs/runbooks/`
- [ ] Spike protection aktif
- [ ] Rate limit / `beforeSend` dikonfigurasi
- [ ] Kuota dipantau di halaman **Stats → Usage**
- [ ] **Tidak ada** data pribadi (nama/email/NIK siswa) terkirim ke Sentry

**Integrasi agent:**

- [ ] MCP Sentry terdaftar di config agent
- [ ] 🔴 **Diverifikasi dengan tool nyata** — bukan hanya "status konek"
- [ ] Token disimpan sebagai environment variable, **bukan** di repo
- [ ] Scope dibatasi (`inspect` dulu, bukan semua)
- [ ] Provider LLM untuk tool pencarian AI ditentukan **manusia** (bukan agent)

---

## 29.9 ⚠️ JEBAKAN — Yang Paling Sering Menggigit

| Jebakan | Akibat | Pencegahan |
|---|---|---|
| **SDK dipasang setelah deploy** | Error yang paling penting (saat startup) tidak tertangkap | Instrumentasi **bersama build** (Tahap 5) |
| **Lupa Langkah 5** | Merasa aman padahal tidak ada error yang masuk | Selalu buktikan dengan error tes |
| **`Sentry.init()` terlalu telat** | Error startup hilang | Pakai `--import` untuk Node |
| **`--require` masih dipakai** | Inisialisasi gagal senyap | `--require` sudah tidak didukung → `--import` |
| **Session replay dinyalakan penuh** | Kuota 50 habis dalam hitungan menit | Replay untuk subset kecil saja, atau jangan dulu |
| **Alert setiap error** | Notifikasi dimatikan dalam 3 hari | Alert **error baru** + lonjakan saja |
| **DSN di-commit ke repo** | Bukan kebocoran kritis, tapi mengunci config | Pakai `.env` |
| **Token MCP di-commit** | 🔴 **Kebocoran nyata** — token bisa baca/tulis organisasi | Environment variable, selalu |
| **Data pribadi siswa terkirim** | Pelanggaran privasi + kuota penuh | Saring di `beforeSend`; kirim **ID**, bukan nama |
| **Error PII di session replay** | Rekaman bisa memuat data sensitif | Masking teks di replay |
| **Sentry dianggap pengganti log server** | Kuota habis, biaya naik, log tetap tidak lengkap | Sentry = penunjuk arah; log lengkap di server |
| **Agent memilih provider LLM** | Melanggar `MODEL-POLICY.md` | Manusia yang menentukan |
| **Memasang self-hosted untuk belajar** | Butuh server 16 GB RAM, tanpa dukungan | Pakai SaaS gratis |

---

## 29.10 🔗 REFERENSI

**Sumber resmi:**

1. `https://sentry.io/pricing/` — paket Developer/Team/Business, kuota lengkap, harga Seer
2. `getsentry/sentry-docs` → `docs/pricing/quotas/index.mdx` — kalimat *"will not be accepted"*
3. `getsentry/sentry-docs` → `docs/security-legal-pii/security/data-retention-periods.mdx`
   — tabel retensi per paket (Developer 30 hari)
4. `getsentry/sentry-docs` → `docs/platforms/javascript/common/install/index.mdx`
   — pola instalasi Node (`--import`, bukan `--require`)
5. `getsentry/sentry-docs` → `develop-docs/self-hosted/index.mdx` — kebutuhan minimum
   self-hosted + daftar fitur yang hilang
6. `getsentry/toolkit` (919 ⭐) → `README.md` — MCP: `https://mcp.sentry.dev/mcp`,
   `npx @sentry/mcp-server`, scope token, `--skills` / `--disable-skills`
7. `getsentry/sentry` (45.520 ⭐) — repositori server; lisensi **FSL-1.1-Apache-2.0**
8. `getsentry/sentry-javascript` — SDK resmi JS (`@sentry/node`, `@sentry/react`,
   `@sentry/nextjs`, `@sentry/browser` — v11.6.0)

**Bab terkait di repo ini:**

- **Bab 22** — Standar Production-Ready (checklist produksi)
- **Bab 27.4b** — skill otentik: `observability-and-instrumentation`,
  `debugging-and-error-recovery`, `systematic-debugging`
- **Bab 27.3 Tahap 5 & 6** — tempat Sentry dipasang dan digerbangi
- **Bab 13** — Keamanan & dependency check
- **`riset-sentry.md`** — riset dasar (fungsi, lisensi, paket gratis, self-hosted)

**⚠️ Catatan lisensi:**

Sentry **bukan** open source versi OSI. Lisensinya **FSL-1.1-Apache-2.0** (*fair source*).
Yang **boleh**: pemakaian internal, pendidikan non-komersial, riset non-komersial.
Yang **tidak boleh**: *Competing Use* — membuat produk/jasa komersial yang menggantikan
Sentry. Tiap versi **otomatis jadi Apache-2.0 pada ulang tahunnya yang kedua**.

Untuk aplikasi sekolah (internal, non-komersial) → **boleh dipakai**.

---

**📅 Ditambahkan:** 9 Okt 2026
**🎯 Tujuan:** Menutup celah di Bab 27 — Sentry disebut sebagai bagian dari produksi tapi
tidak pernah diajarkan cara memasangnya. Bab ini memberi langkah yang bisa diperiksa,
integrasi MCP untuk agent, dan empat titik sambung ke workflow Bab 27.
**⚠️ Status:** materi ini **belum diuji end-to-end** di proyek nyata. Kriteria "SELESAI"
di atas sudah ditulis sebagai gerbang yang bisa diperiksa — jalankan pada aplikasi
pertama, lalu perbarui bab ini dengan temuan nyata.
