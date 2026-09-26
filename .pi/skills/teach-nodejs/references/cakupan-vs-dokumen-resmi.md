# Cakupan vs Dokumen Resmi — apakah materi ini selengkap nodejs.org & MDN?

> Referensi untuk skill `teach-nodejs`. **Tutor membaca file ini sendiri.**
>
> **Dibuat:** 26 September 2026 · **Audit dilakukan:** 26 September 2026
> **Kerangka asal:** `teach-react/references/cakupan-vs-dokumen-resmi.md`

---

## 1. Kenapa "selengkap nodejs.org" bukan target yang benar

Pertanyaan yang wajar: *"apakah materinya sudah selengkap dokumentasi resmi?"*

Jawabannya: **tidak, dan memang tidak boleh.**

| | Dokumentasi resmi (`nodejs.org/api`) | Kurikulum (skill ini) |
|---|---|---|
| Tujuan | **Referensi** — lengkap, untuk dipakai saat sudah tahu apa yang dicari | **Kurikulum** — berurutan, untuk orang yang belum tahu apa pun |
| Ukuran | **70+ modul**, ribuan halaman | 18 unit, 4 gerbang |
| Urutan | Alfabetis (Assert, Async hooks, Buffer, …) | Berdasarkan **ketergantungan**, bukan abjad |
| Kalau tidak lengkap | **Cacat** — ada API yang tidak bisa ditemukan | **Bukan cacat** — ia sengaja memilih |
| Yang penting | Kelengkapan | **Bisa dipakai** |

Kurikulum yang "lengkap" adalah kurikulum yang **tidak selesai dibaca**. Ini pengalaman
langsung di repo ini: `fase-0-peta-belajar/` pernah dibangun 19 file dengan router,
diagnostik, dan empat jalur — dan hasilnya **tidak bisa dipakai**.

> **Prinsipnya:** kelengkapan bukan pengganti kejelasan. Materi yang bisa dipakai lebih
> berharga daripada materi yang lengkap.

Maka file ini **tidak** mengejar kelengkapan. Ia melakukan tiga hal:

1. **Mengaudit** — memeriksa sumber resminya **satu per satu**, bukan dari ingatan
2. **Menyebut celah nyata** — dan **menambalnya**, bukan hanya melaporkannya
3. **Menyatakan apa yang sengaja dilewati** — beserta alasannya, supaya keputusan itu
   bisa dibantah

---

## 2. Audit 1 — `nodejs.org/learn` (11 bagian)

**Sumber yang dibuka:** `https://nodejs.org/learn` — 26 Sep 2026.
Jalur belajar resmi Node.js. Ia punya **11 bagian**:

| # | Bagian resmi | Ada di roadmap? | Di mana |
|---|---|---|---|
| 1 | **Getting Started** | ✅ | Unit 1, 2, 3 |
| 2 | **Command Line** | ✅ | Unit 1, 2 |
| 3 | **HTTP** | ✅ | Unit 9, 10, 11 |
| 4 | **File System** | ✅ | Unit 5 |
| 5 | **Asynchronous Work** | ✅ | Unit 6, 7 |
| 6 | **Concurrency** | ❌ **sengaja** | Dikenali saja — `sintaks-node.md` §K |
| 7 | **TypeScript** | ❌ **sengaja** | Dikenali saja — `sintaks-node.md` §K |
| 8 | **Package Management** | ✅ | Unit 3 |
| 9 | **Diagnostics** | 🟡 **sebagian** | Unit 8 (stack trace, jenis error) |
| 10 | **Testing** | ❌ **sengaja** | Dikenali saja — `sintaks-node.md` §K |
| 11 | **Security** | ✅ | Unit 12, 14, 16, 17 |

**Hasil: 7 dari 11 bagian tercakup penuh, 1 sebagian, 3 sengaja dilewati.**

> **Catatan jujur soal #9 (Diagnostics):** bagian resminya jauh lebih luas dari yang
> diajarkan. Ia memuat profiling memori, `--inspect`, diagnostics channel, dan trace
> events. Yang **diambil** hanya satu hal — **membaca stack trace dan jenis error** —
> karena itulah yang dibutuhkan untuk inspeksi kode sehari-hari. Sisanya menunggu
> pembelajar punya masalah nyata yang menuntutnya.

---

## 3. Audit 2 — `nodejs.org/api/` (indeks modul)

**Sumber yang dibuka:** `https://nodejs.org/api/` — 26 Sep 2026.
**Versi yang terdokumentasi saat audit: Node.js v26.10.0.**
Indeksnya memuat **70+ modul**. Berikut yang **dipakai** roadmap ini:

| Modul | Dipakai di | Kenapa modul ini |
|---|---|---|
| `fs` | Unit 5 | I/O file — dasar semua pekerjaan Node |
| `path` | Unit 5 | **Sumber bug Windows** (`\` vs `/`) |
| `os` | Unit 5 | Skrip yang perlu tahu di mana ia berjalan |
| `process` | Unit 2, 16 | `argv`, `env`, `exit` — jembatan ke terminal |
| `console` | Unit 2 | Satu-satunya "layar" di Node |
| `globals` | Unit 2 | Apa yang tersedia tanpa `import` |
| `http` | Unit 9, 10 | HTTP mentah — **sebelum** framework |
| `errors` | Unit 8 | Stack trace, jenis error |
| `timers` | Unit 7 | `setTimeout`/`setInterval` dan antreannya |
| `url` | Unit 9 | Membaca jalur & query |
| `crypto` | Unit 17 | Hash password, perbandingan waktu-tetap |
| `sqlite` | Unit 14 | **Bawaan Node 26** — database tanpa server |
| `environment_variables` | Unit 16 | Rahasia & konfigurasi |
| `cli` | Unit 1, 16, 18 | `--env-file`, cek versi, perilaku produksi |
| `esm` / `modules` | Unit 4 | Dua sistem modul |
| `packages` | Unit 3 | `package.json`, resolusi paket |

**Modul yang sengaja TIDAK dipakai** (dan alasannya):

| Modul | Kenapa dilewati |
|---|---|
| `stream`, `buffer`, `string_decoder` | Penting untuk file besar, bukan sumber bug di aplikasi CRUD |
| `net`, `tls`, `dns`, `http2`, `https` | Menyentuh jaringan tingkat rendah; HTTP dasar sudah cukup |
| `cluster`, `worker_threads`, `child_process` | Skala lanjutan — cukup **dikenali** |
| `v8`, `vm`, `wasi`, `n-api`, `addons` | Di luar jangkauan pemula, dan bukan sumber bug aplikasi |
| `readline`, `repl`, `tty` | Alat, bukan konsep |
| `zlib`, `punycode`, `querystring`, `domain`, `dgram` | Jarang muncul di kode AI aplikasi biasa |
| `test`, `assert`, `bench` | Testing — penting untuk produksi, bukan cara belajar inspeksi |
| `perf_hooks`, `async_hooks`, `diagnostics_channel`, `inspector`, `report` | Diagnostik lanjutan |
| `deprecations`, `permissions`, `single-executable-applications` | Konteks platform, bukan materi pemula |
| `webcrypto`, `webstreams`, `stream_iter` | Alternatif; satu gaya saja dulu |
| `ffi`, `vfs`, `intl`, `module` | Tidak relevan untuk aplikasi CRUD pemula |

---

## 4. Audit 3 — MDN & standar (lapisan yang tidak ada di nodejs.org)

Node.js tidak mendokumentasikan hal-hal yang **bukan miliknya**. Tiga di antaranya wajib
untuk aplikasi fullstack:

| Topik | Kenapa Node.js tidak mendokumentasikannya | Di mana auditnya | Dipakai di |
|---|---|---|---|
| **CORS** | Ia **aturan browser**, bukan aturan Node | MDN: *CORS*, *Same-origin policy* | **Unit 13** |
| **HTTP semantics** | Node hanya *mengimplementasikan*; yang *mendefinisikan* adalah RFC | RFC 9110: *HTTP Semantics* | Unit 9, 12 |
| **`fetch` & Promise** | Ia bagian dari JavaScript/WHATWG, bukan API Node | MDN: *async function*, *Promise*, WHATWG Fetch | Unit 6, 9 |

**Kenapa ini penting:** tanpa ketiganya, aplikasi fullstack akan tampak "rusak padahal
tidak" — dan pembelajar akan mencari bug **di tempat yang salah** (terminal, padahal
errornya di console browser). Itu sebabnya Unit 13 ada.

---

## 5. Yang benar-benar hilang — dan sudah ditambal

Saat audit pertama, **lima hal** tidak ada di sumber resmi **sebagai materi yang diajarkan**
(walaupun API-nya terdokumentasi). Semuanya sudah ditambal — bukan hanya dilaporkan.

### Celah 1 — "Kenapa data saya kosong": empat sebab yang tidak pernah dinamai

**Masalah:** `nodejs.org` mendokumentasikan `fs`, `express` mendokumentasikan `req.body`,
MDN mendokumentasikan `await`. **Tidak ada** yang menyatukan bahwa **empat kesalahan
berbeda** menghasilkan gejala yang **sama**: daftar kosong, tanpa error.

**Tambalan:** **Unit 15** — keempat sebab itu dinamai, diurutkan cara memeriksanya, dan
diberi latihan TELUSUR dua kali. Ini unit **terpenting** di roadmap.

### Celah 2 — CORS: tidak ada di dokumentasi Node, wajib untuk fullstack

**Masalah:** Node.js benar tidak mendokumentasikannya — itu urusan browser. Tapi
pembelajar fullstack **akan** menemuinya, dan gejalanya menyesatkan: API berhasil di
`curl`, gagal dari React, dan **tidak ada pesan apa pun di terminal**.

**Tambalan:** **Unit 13** — lengkap dengan aturan untuk tutor: **jangan** menyebut CORS
saat pembelajar macet. Biarkan ia menemukan bahwa **tempat mencari errornya berbeda**.

### Celah 3 — Keamanan aplikasi ≠ keamanan platform

**Masalah:** `nodejs.org/learn` punya bagian **Security**, tapi isinya soal **platform**
(memperbarui Node, menghindari `eval`, permission model). Bukan soal **aplikasi**:
password polos, rahasia ter-commit, injeksi SQL.

**Tambalan:** **Unit 14** (injeksi), **Unit 16** (rahasia), **Unit 17** (login).
Dasar risetnya: **Veracode 2025** — hanya **55%** kode hasil LLM yang aman.

### Celah 4 — Tidak ada satu pun bagian tentang deploy atau build

**Masalah:** `nodejs.org/learn` berhenti di "aplikasi jalan di mesinmu". Tidak ada yang
mengajarkan bahwa **React harus di-build**, bahwa **jalur API berubah**, dan bahwa
**satu origin menghapus CORS**.

**Tambalan:** **Unit 18** — dengan latihan TELUSUR khusus: "jalan di lokal, gagal setelah
build".

### Celah 5 — `path.join`: API-nya ada, *kenapa*-nya tidak

**Masalah:** `nodejs.org/api/path` mendokumentasikan `path.join` dengan benar. Tapi ia
tidak menyatakan hal yang justru penting untuk pembelajar: **merangkai `"/"` sendiri
akan gagal di Windows** — dan itu salah satu cacat paling sering di kode AI.

**Tambalan:** **Unit 5** + baris 🔴 di `sintaks-node.md` §E. Latihannya: "sebut satu
baris yang akan gagal di Windows".

---

## 6. Yang SENGAJA tidak ditambahkan

Daftar lengkap beserta alasannya ada di **`sintaks-node.md` §K**. Ringkasnya:

| Yang dilewati | Alasan satu baris |
|---|---|
| Docker / Kubernetes | Bukan prasyarat untuk **menilai** kode satu aplikasi |
| Microservices | Skala masalah yang belum dihadapi |
| GraphQL, WebSocket | Satu gaya dulu; menghindari percabangan |
| TypeScript wajib | Lapisan tambahan sebelum dasarnya kuat — cukup dikenali |
| ORM (Prisma/Sequelize) | Menyembunyikan SQL, padahal SQL-nya sumber bug |
| Testing framework | Penting untuk produksi, bukan cara belajar inspeksi |
| PostgreSQL / MySQL | Butuh server terpisah → dua masalah sekaligus |
| JWT mendalam | Cukup dikenali; memilih bukan urusan unit ini |
| Deploy ke vendor tertentu | Berubah cepat; yang diajarkan konsepnya |
| `cluster` / `worker_threads` | Lanjutan; cukup dikenali |
| Streaming / `Buffer` | Bukan sumber bug di aplikasi CRUD |
| Next.js / NestJS / Bun / Deno | Framework/runtime lain — ada di skill terpisah |

**Aturan:** kalau pembelajar **menemui** salah satu topik ini di kode nyata dan tersandung,
itu **tanda daftar ini perlu ditinjau** — bukan tanda pembelajar kurang.

---

## 7. Bentuk akhir materi

```
18 unit · 4 bagian · 4 gerbang

Bagian 0 — PRASYARAT: terminal & runtime          Unit 1–4    → GERBANG 1
Bagian 1 — NODE DASAR: file, async, event loop    Unit 5–8    → GERBANG 2
Bagian 2 — MEMBANGUN SERVER: HTTP → Express       Unit 9–13   → GERBANG 3
Bagian 3 — DATA, AMAN, DEPLOY                     Unit 14–18  → GERBANG 4
```

| Berkas | Isi |
|---|---|
| `SKILL.md` | Router, asesmen, aturan sesi, anti-pattern, delegasi |
| `roadmap-4-tingkat.md` | Bagian, gerbang, bentuk sesi, aturan AI, batas kejujuran |
| `peta-unit.md` | Detail 18 unit: konsep, sintaks, miskonsepsi, kriteria lulus |
| `korpus-ai.md` | Tangga korpus, **20 cacat khas kode Node AI**, 4 latihan inspeksi |
| `sintaks-node.md` | Kamus ±120 bentuk (terminal/Node/HTTP/DB/keamanan) + tingkat bahaya |
| `cakupan-vs-dokumen-resmi.md` | File ini |

---

## 8. Batas kejujuran

- **Audit ini memeriksa dua halaman resmi** (`nodejs.org/learn` dan `nodejs.org/api/`)
  **dan tidak membaca setiap halaman modul satu per satu.** Yang diverifikasi adalah
  **daftar & struktur**, bukan isi tiap halaman.
- **Versi Node yang terdokumentasi saat audit: v26.10.0.** Dokumentasi Node berubah cepat.
  Kalau versi di mesin pembelajar berbeda, **cek `node --version` lebih dulu** — terutama
  untuk `node:sqlite` (Unit 14) dan `--env-file` (Unit 16).
- **`node:sqlite` dipilih sebagai keputusan desain, bukan rekomendasi industri.** Alasannya
  ada di `roadmap-4-tingkat.md` §9. Untuk produksi, PostgreSQL/MySQL lebih lazim.
- **Pemilihan 18 unit belum diuji.** Ia disusun dari **sumber bug yang paling sering
  dilaporkan** — bukan dari studi urutan pembelajaran Node.
- **Tingkat bahaya 🔴🟡⚪ adalah penilaian, bukan hasil riset.**
- **Ambang 50% tracing** dari studi 2004, konteks kurikulum universitas. Dipakai sebagai
  ambang kasar, bukan hukum.
- **Angka industri** (Stack Overflow 66%/45%, Veracode 55%) berasal dari survei & studi
  dengan populasi berbeda. Dipakai sebagai **indikasi arah**, bukan bukti sebab-akibat.
- **Protokol 5 langkah TELUSUR bukan dari satu sumber tunggal.** Ia disusun dari praktik
  debug yang lazim (hipotesis → uji → persempit) dan diselaraskan dengan temuan RCT
  Anthropic bahwa debugging adalah titik terlemah. **Belum diuji sebagai metode.**
- **Daftar "sengaja dilewati" bisa salah.** Ia keputusan, dan keputusan bisa dibantah.
- **Yang TIDAK diaudit di sini:** halaman `expressjs.com`, `tailwindcss.com`, dan
  `vite.dev`. Ketiganya dipakai sebagai sumber, tapi strukturnya tidak diaudit sedetail
  nodejs.org. Kalau pembelajar bertanya "apakah Express sudah lengkap diajarkan?", file ini
  **belum** bisa menjawabnya dengan bukti.

### Sumber yang dibuka langsung saat audit

| URL | Yang diambil | Tanggal |
|---|---|---|
| `https://nodejs.org/learn` | Daftar **11 bagian** jalur belajar resmi | 26 Sep 2026 |
| `https://nodejs.org/api/` | Indeks **70+ modul** + versi terdokumentasi (v26.10.0) | 26 Sep 2026 |
| `https://nodejs.org/api/fs` · `/path` · `/http` · `/sqlite` · `/crypto` · `/errors` | Nama & keberadaan modul | 26 Sep 2026 (indeks) |
| `https://developer.mozilla.org/` (CORS, async, Promise, HTTP) | Topik yang tidak dimiliki Node.js | Tidak dibuka ulang — **dari daftar, belum diverifikasi** |

> ⚠️ **Baris terakhir itu penting.** Sumber MDN dan RFC 9110 dipakai sebagai rujukan, tapi
> **tidak dibuka ulang** saat audit ini. Ia dicatat sebagai **terdaftar, belum diverifikasi**
> — supaya pembelajar bisa memeriksa sendiri, dan supaya tutor tidak mengklaim lebih dari
> yang benar-benar diperiksa.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `korpus-ai.md` · `sintaks-node.md`
