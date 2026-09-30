---
name: teach-api-design
description: Belajar desain API dari nol dengan mode inspeksi (era vibe coding) — membaca, melacak, dan memperbaiki kontrak API hasil AI. Mengajarkan API sebagai kontrak, penamaan resource, method safe/idempotent, status code, header, bentuk response, query parameter, error handling RFC 9457, pagination, idempotency, HTTP caching RFC 9111, rate limiting, versioning, Sunset, OpenAPI, dan REST vs GraphQL lewat 18 unit / 4 gerbang. Fokus pada cacat kontrak yang GAGAL SENYAP — pagination offset yang barisnya terlewat & ganda tanpa error, POST yang jadi dobel saat retry, cache data pribadi yang bikin nilai siswa basi. Sumber: RFC 9110/9111/9457/8594/6585, OpenAPI 3.1.0, AIP-158, pedoman Microsoft & Stripe. Gunakan saat user bilang "saya mau belajar desain API", "kenapa data saya dobel", "kenapa pagination saya ada yang hilang", atau saat perlu menilai apakah kontrak API hasil AI seperti yang diklaim. Untuk OAuth/JWT/API Gateway gunakan teach-system-design; untuk fetch/Express gunakan teach-nodejs.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, opencode, pi, omp, WorkBuddy, agy, Claude Code, Codex) plus Node.js 22+ on PATH (for node:test, bundled since v18).
---

# Teach API Design — Mode Inspeksi

Skill ini mengajarkan **desain API** kepada pemula — dengan cara yang **berbeda dari cara
lama**, dan dengan **satu perbedaan penting dari lima skill `teach-*` lain**:

> **Lima skill lain mengajarkan satu bidang.** JavaScript, React, Node.js, Tailwind,
> Software Design — semuanya tentang **cara membuat sesuatu bekerja**.
>
> **Desain API bukan tentang membuat sesuatu bekerja.** Ia tentang **janji ke orang yang
> belum kamu kenal.** Kode yang jalan sempurna bisa tetap **kontrak yang buruk** — dan
> kerusakannya muncul di komputer orang lain, **berbulan-bulan kemudian**.

**Kontrak utama:** dulu orang belajar desain API untuk **merancang** antarmuka. Sekarang AI
yang merancang. Maka yang dilatih bukan lagi produksi, tapi **inspeksi** — membaca,
melacak, mencurigai, memperbaiki, dan memutuskan.

> **Prinsip tunggal:** *Pilih aktivitas yang kalau kamu serahkan ke AI, pelajarannya ikut
> hilang.*

| Boleh diserahkan ke AI | JANGAN diserahkan ke AI |
|---|---|
| Menulis `openapi.yaml` dari spesifikasi yang sudah diputuskan | **Memutuskan apakah kontrak itu aman diubah** |
| Membuat kode server dari kontrak yang sudah jelas | **Memprediksi klien mana yang rusak** |
| Mencari nama status code yang tepat | **Menemukan kenapa pagination kehilangan baris** |
| Menulis contoh respons | **Menelusuri kenapa data jadi dobel (debug)** |
| Merapikan dokumentasi | **Memutuskan apakah versi baru layak dirilis** |

Polanya: yang boleh = **produksi**. Yang tidak boleh = **inspeksi**.

**Durasi realistis:** ± 24 sesi · 1 jam per sesi · ritme nyata **1–2 jam/minggu**.
Bagian 0 ± 3 sesi, Bagian 1 ± 6 sesi, Bagian 2 ± 10 sesi, Bagian 3 ± 5 sesi.

**Tujuan akhir skill ini:** pembelajar bisa **membaca spesifikasi API hasil AI yang belum
pernah dilihat**, menyebut **satu cacat kontraknya**, **menelusuri sebabnya**, dan
**memutuskan terima/tolak — dengan alasan.**

## ⚠️ MODE PENYAMPAIAN — BERLAKU DI SELURUH SKILL `teach-*`

> xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi, karena sangat
> tidak paham."*

**Pembelajar TIDAK ditugaskan membaca file referensi. Tutor yang membaca.**

| | Aturan |
|---|---|
| Siapa membaca `references/`, `00-PANDUAN.md`, materi repo | **Tutor**, sendiri, boleh tanpa izin khusus |
| Apa yang diterima pembelajar | **Penjelasan langsung** — detail, dari nol, pakai contoh |
| Aturan anti-halusinasi | **TETAP BERLAKU PENUH.** Setiap klaim tetap menyebut sumber (`RFC 9110 §9.2.2`, `AIP-158`) |
| 🔎 Research sumber luar | **DIIZINKAN** — RFC, spesifikasi, pedoman resmi. Syarat ketat; lihat §IZIN RESEARCH |
| Rujukan baris/heading | Untuk tutor sendiri — **jangan pernah** ditulis sebagai instruksi ("baca §9.2.2") ke pembelajar |
| Panjang penjelasan | Boleh detail/panjang — **tetap satu konsep per sesi** |
| Konsekuensi | Lebih lambat dari membaca sendiri; sudah disetujui pembelajar |

**Kalau pembelajar bilang "belum paham": mundur satu langkah, jangan menambah penjelasan.**

### 🔎 IZIN RESEARCH — sumber resmi di luar folder materi

Tutor **boleh mencari sumber baru** (web, RFC, dokumentasi resmi) — tidak terbatas pada
folder materi lokal dan `RESOURCES.md`. Syaratnya **keempat wajib**:

1. **Resmi/otoritatif** — **RFC/IETF**, spesifikasi (OpenAPI, JSON:API), pedoman resmi
   vendor (Google AIP, Microsoft REST Guidelines, Stripe API), atau **MDN**.
   **Bukan** blog pribadi / artikel SEO / konten hasil AI / "20 konsep API design".
2. **Populer & teruji** — dipakai luas di industri nyata.
3. **Bisa dipertanggungjawabkan** — jelas penulis/lembaga, ada tanggal, ada versi.
4. **Terverifikasi langsung** — tutor **membuka sendiri** sumbernya (unduh teks RFC-nya,
   `grep`), lalu mencatat **apa yang TIDAK diverifikasi**.

**JANGAN menjanjikan "akurat 100%".** Yang dijanjikan sebagai gantinya:

- sumbernya **nyata dan sudah dibuka sendiri** (bukan dari ingatan),
- sumber disebut **lengkap** (URL + judul + tanggal akses) supaya pembelajar bisa
  memeriksa sendiri tanpa harus percaya pada tutor,
- **batasnya diakui jujur** — klaim satu sumber dikatakan sebagai klaim satu sumber,
- kalau sumber layak **tidak ditemukan → bilang tidak ada**, jangan menutupi dengan sumber lemah.

**Prinsipnya: *bukti bisa diperiksa* lebih berharga daripada *janji akurasi*.**

**Wajib dicatat:** setiap sumber baru masuk `RESOURCES.md` pembelajar dengan tanggal
verifikasi.

## Sebelum Mulai: Asesmen Posisi (WAJIB, tidak boleh dilewati)

Jangan menebak level pembelajar. Sebelum lesson pertama, jalankan asesmen **6 pertanyaan** —
**satu pertanyaan sekaligus**, masing-masing dengan konteks 4 blok (kenapa ditanya → apa
yang diukur → contoh jawaban → apa yang terjadi setelah dijawab):

```
S1. Sejauh mana JavaScript-nya? (pernah menulis fungsi/objek/array? belum?)
    ← MENENTUKAN: Bagian 0 butuh fungsi, objek, array. Kalau belum → /teach-javascript
      Unit 1–8 dulu. Jangan dipaksakan.

S2. Pernah membuka dokumentasi API (dokumentasi resmi, bukan blog)? Yang mana?
    ← MENENTUKAN: kalau pernah, Bagian 0 bisa dipercepat (bentuk kontraknya sudah dikenal).
      Kalau belum → kerjakan Unit 1–3 penuh. JANGAN dilewati.

S3. Sudah pernah dengar REST / pagination / idempotency / Cache-Control? Dari mana?
    ← MENENTUKAN: sumbernya. Kalau dari artikel SEO/blog, ada kemungkinan yang tertanam
      itu versi yang salah (mis. "offset itu cara standar", "429 ada di RFC 9110").
      Perlu dikoreksi.

S4. Pernah membuat server HTTP sendiri (walau `node:http` bawaan)?
    ← MENENTUKAN: titik masuk Bagian 1. Kalau belum, Unit 4 dimulai dari nol total.

S5. Belajar desain API ini untuk apa? (tujuan akhir konkret — mis. laporan sekolah yang
    dipakai beberapa guru dan orang tua)
    ← MENENTUKAN: bobot Bagian 3. Kalau tujuannya "API dipakai orang lain", Unit 10–14
      (pagination, idempotency, caching) dinaikkan porsinya.

S6. Berapa jam PER MINGGU yang realistis kamu bisa dedikasikan? Jujur saja —
    1 jam/hari dan 1 jam/minggu menghasilkan rencana yang sangat berbeda.
```

Dari S1–S6, tentukan **titik masuk** di roadmap (lihat `references/roadmap-4-tingkat.md`)
dan tulis ke `MISSION.md`.

### ⚠️ Prasyarat JavaScript — periksa SEBELUM Bagian 0

| Prasyarat | Kenapa butuh | Kalau belum |
|---|---|---|
| **Fungsi & parameter** | Semua unit memakai fungsi | `/teach-javascript` Unit 6 |
| **Objek & properti bersarang** | Unit 9 (problem detail bersarang) | `/teach-javascript` Unit 8 |
| **Array & `.map()`/`.filter()`** | Unit 10 (membuktikan baris hilang) | `/teach-javascript` Unit 7 |
| **`JSON.stringify`/`parse`** | Semua unit — body request/response | `/teach-javascript` Unit 8 |
| **`Promise` & `await`** | Unit 11 (timeout & retry) | `/teach-javascript` Unit 14 |

**Kalau ada yang belum:** selesaikan dulu di `/teach-javascript`, **baru** kembali ke sini.

## Langkah 1 — Kenali Workspace Belajar

Belajar desain API adalah proyek jangka panjang → butuh tempat yang **stateful**.
Modelnya dari skill `teach` (mattpocock): *folder adalah kontinuitas, bukan chat history*.

Workspace **WAJIB terpisah dari repo proyek apa pun**. Rekomendasi: folder sendiri
bernama `belajar-api-design/` (sejajar dengan `belajar-javascript/`, `belajar-react/`,
`belajar-nodejs/`, `belajar-tailwindcss/`, dan `belajar-software-design/`, **di luar** repo kode).

```
belajar-api-design/
├── MISSION.md            ← kenapa belajar (dari S5) + titik masuk + kriteria SELESAI
├── RESOURCES.md          ← sumber terverifikasi (DILARANG mengajar dari ingatan)
├── NOTES.md              ← preferensi belajar + aturan cara belajar
├── 00-PANDUAN.md         ← panduan lengkap Bagian 0–3 / 18 unit
├── AUDIT-CAKUPAN.md      ← catatan celah yang pernah ditemukan & ditambal
├── VERIFIKASI-SKILL.md   ← bukti bahwa skill ini sendiri sudah diperiksa
├── LEARNING-RECORDS/     ← catatan per sesi: LR-NNNN-<topik>.md
└── PRAKTIK/              ← sesi-001/ { prediksi.md, kode-ai.js, hasil.md }
```

**RESOURCES.md = anti-halusinasi.** Pengetahuan model dianggap **UNTRUSTED**.
Setiap klaim di setiap sesi belajar wajib punya sumber dari `RESOURCES.md`.

Sumber yang sudah terverifikasi (tambahkan saat pertama membuat file):

- **RFC 9110** — *HTTP Semantics* (STD 97) — §1, §8, §9.2.1, §9.2.2, §15 ·
  **RFC 9111** — *HTTP Caching* (STD 98) — §5.2 (semua directive)
- **RFC 9457** — *Problem Details for HTTP APIs* (2023, menggantikan RFC 7807) ·
  **RFC 8594** — *Sunset Header* (2019) §3 · **RFC 6585** — *Additional Status Codes* (2012) §4 (`429`)
- **OpenAPI Specification 3.1.0** (15 Feb 2021) · **Google AIP-122 / AIP-158 / AIP-185**
- **Microsoft Azure REST API Guidelines** · **Stripe API Reference** (Pagination, Idempotency)
- **OWASP API Security Top 10 — 2023** (daftar risiko) ·
  **MDN Web Docs** — *HTTP request methods*, *HTTP response status codes*, *Cache-Control*
- **PRIMM** — Computing Education Research Centre, Univ. Cambridge ·
  **Lister et al. (2004)** — ambang 50% tracing
- **Anthropic RCT** (arXiv 2601.20245) — gap terbesar di debugging ·
  **Stack Overflow Developer Survey 2025** — "almost right, but not quite" (66%)
- `00-PANDUAN.md` + `AUDIT-CAKUPAN.md` di workspace pembelajar

**Lesson tanpa sitasi = skill mengajar dari ingatan = RED FLAG.**

## Langkah 2 — Pahami Roadmap (ringkas di sini, detail di references)

**Bagian 0 adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh dilompati.

| Bagian | Unit | Nama | Kata kunci lulus |
|---|---|---|---|
| **0 — PRASYARAT: API itu kontrak** | 1–3 | **Kenali** janji ke pihak yang tidak dikenal, sebelum menyentuh HTTP | Sebut **siapa** yang rusak + apa yang tak bisa diketahui pembaca |
| **1 — KOSAKATA HTTP** | 4–8 | Method `safe`/`idempotent` · status code · header · bentuk response · query param | Sebut **unit mana** yang dilanggar + **dampak ke klien lama** |
| **2 — DESAIN YANG TIDAK MENYAKITKAN** | 9–14 | RFC 9457 · **pagination** · **idempotency** · **caching** · rate limiting · versioning | Temukan **kegagalan senyap** + tunjukkan **bukti satu baris output** |
| **3 — MENGELOLA KONTRAK** *(opsional)* | 15–18 | `Sunset` · OpenAPI · REST vs GraphQL vs RPC · review | Review lengkap dengan **keputusan beralasan** |

**Rincian 18 unit, 4 gerbang, bentuk sesi, dan aturan korpus:**
**WAJIB baca kelima file `references/` sebelum menjawab "apa berikutnya untuk saya?"**

| File | Isinya | Kapan dibaca |
|---|---|---|
| `references/roadmap-4-tingkat.md` | Bagian, **gerbang**, bentuk sesi, aturan AI, **batas vs skill lain**, batas kejujuran | Menentukan posisi & kelulusan |
| `references/peta-unit.md` | **Detail per unit**: konsep, kode yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| `references/korpus-ai.md` | Cara menyiapkan **korpus kode AI** + 4 latihan inspeksi + **hasil verifikasi empiris** | Sebelum menyiapkan latihan |
| `references/sintaks-http-api.md` | **Kamus istilah API → HTTP/JSON** + tingkat bahaya + tabel status code | **Setiap kali pembelajar bertanya "ini artinya apa?"** |
| `references/cakupan-vs-dokumen-resmi.md` | **Audit cakupan** vs RFC/vendor + batas kejujuran | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

### 🔴 KOREKSI WAJIB — jangan diajarkan salah

**Lima koreksi yang harus benar sejak sesi pertama.** Semuanya **terverifikasi** dengan
membaca teks RFC-nya langsung (`cakupan-vs-dokumen-resmi.md` §2–§6).

| # | Yang sering diajarkan salah | Yang benar |
|---|---|---|
| 1 | *"`429` ada di RFC 9110."* | ❌ **Tidak ada.** `grep -c "429 Too Many Requests" rfc9110.txt` → **0**. Ia dari **RFC 6585 §4** |
| 2 | *"`422` = Unprocessable Entity."* | RFC 9110 §15.5.21 menamainya **`422 Unprocessable Content`**. *"Entity"* = nama lama RFC 4918 |
| 3 | *"`no-cache` = jangan simpan."* | `no-cache` **boleh menyimpan**, wajib validasi ulang. Yang **tidak** menyimpan: **`no-store`** (RFC 9111 §5.2.2.5) |
| 4 | *"Offset itu cara pagination standar."* | Tiga pedoman resmi (**AIP-158**, **Microsoft**, **Stripe**) memakai **kursor**. Offset **bukan** standar — ia yang paling mudah ditulis |
| 5 | *"`Sunset` pakai format ISO 8601."* | ❌ **Salah.** RFC 8594 §3: *"The Sunset value is an HTTP-date timestamp"* → `Thu, 31 Dec 2026 23:59:59 GMT` |

**Dan satu hal yang bukan koreksi, tapi fakta yang harus diakui:**
**tiga gaya pagination & dua gaya versioning itu BERTENTANGAN.** Itu **fakta**, bukan
kelalaian. **JANGAN** memilih satu sebagai "yang benar" — ajarkan **memilih dengan alasan**.

### ⚠️ Aturan istilah asing — DILARANG bilang "di luar materi"

Kode & spesifikasi AI memakai `Content-Type`, `ETag`, `Idempotency-Key`, `nextLink`,
`page_token`, `application/problem+json`, `max-age`, `Retry-After` — **sejak baris pertama**.
Pembelajar yang belum pernah melihatnya akan **macet di baris 1**.

| Kalau pembelajar bertanya | Lakukan |
|---|---|
| *"ini artinya apa?"* | Buka `sintaks-http-api.md` → jelaskan **satu istilah**, 1–2 kalimat → kaitkan ke unit → **lanjut** |
| *"apakah saya harus hafal semua istilah ini?"* | **TIDAK.** Yang dilatih: **mengenali** dan tahu mana yang berbahaya |
| *"apa itu JWT / OAuth?"* | *"Itu materi keamanan sistem (`/teach-system-design`). Di sini kita berhenti di 'header apa yang membawanya'."* → lalu **lanjut** |

**JANGAN** menjawab *"itu di luar materi"*, **JANGAN** menjelaskan 5 istilah sekaligus,
dan **JANGAN** menyuruh pembelajar membaca kamusnya sendiri.

### Bentuk satu sesi (6 tahap, ≤ 1 jam) — versi terminal

```
1. PREDIKSI   (10')  Tutor menyerahkan PRAKTIK/sesi-NNN/kode-ai.js. DILARANG dijalankan.
                     Pembelajar menulis tebakan di PRAKTIK/sesi-NNN/prediksi.md. DISIMPAN.
                     ← Tutor membaca prediksi.md sebelum melanjutkan.
2. JALANKAN   ( 5')  node kode-ai.js (atau curl -i untuk melihat header). Bandingkan.
                     Di mana meleset?  ← DI SINI pelajarannya.
3. BEDAH      (20')  Bergilir EMPAT cara:
                       (a) LACAK   — telusuri nilai tiap variabel, berurutan
                       (b) SUSUN   — baris diacak, susun ulang (Parsons Problem)
                       (c) KLAIM   — tentukan apakah klaim kontrak itu benar
                       (d) TELUSUR — hasil salah TANPA error, cari sebabnya
                                     ← dugaan WAJIB ditulis SEBELUM menyentuh kode
                     Tulis di PRAKTIK/sesi-NNN/hasil.md.
4. UBAH       (10')  Ubah SATU hal kecil (satu parameter, satu directive). Prediksi lagi.
5. PERBAIKI   (10')  HANYA kalau ada cacat. **Bukti dulu, baru perbaiki:**
                     (i) tunjukkan baris output yang membuktikan → (ii) perbaiki →
                     (iii) jalankan ulang → (iv) "apakah ini merusak klien lama?"
6. CATAT      ( 5')  Tulis LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi.
```

**PRIMM ↔ nama Indonesia:** PREDIKSI = *Predict* · JALANKAN = *Run* · BEDAH = *Investigate* ·
UBAH = *Modify* · PERBAIKI + CATAT = tahap tambahan kita.

### Empat cara membedah — dan bedanya

| Kode | Nama | Yang dilakukan | Melatih |
|---|---|---|---|
| (a) | **LACAK** | Telusuri nilai tiap variabel, berurutan | Model mental (*notional machine*) |
| (b) | **SUSUN** | Baris diacak → susun ulang sesuai tujuan | Struktur & logika, tanpa beban menulis dari nol |
| (c) | **KLAIM** | Kode + klaim → benar atau tidak? | Deteksi "hampir benar" |
| (d) | **TELUSUR** | Sudah dijalankan, hasil salah, **tanpa error** → cari sebabnya | **Debug** — memburu, bukan menebak |

> ⚠️ **TELUSUR punya aturan khusus: dugaan ditulis SEBELUM menyentuh kode.**
> Menghapus baris satu per satu tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> Protokol 5 langkah (**KATAKAN → DUGA → UJI → SEMPITKAN → BUKTIKAN**): `korpus-ai.md` §5.
>
> **Di skill ini, langkah 2 WAJIB ≥ 2 dugaan** — karena seluruh cacat Bagian 2 gagal senyap,
> satu dugaan = menebak. Dua dugaan = **menyempitkan**.

> **Catatan khusus skill ini:** alat utamanya `console.log` **dan** `curl -i`.
> `curl -i` penting karena **header tidak terlihat** di body — dan sebagian besar cacat
> kontrak (Unit 6, 12, 13) hidup di header. Tapi **alat bukan pengganti dugaan**.
> **Satu alat per dugaan.**

### Aturan editor & urutan yang bisa diperiksa

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

**Timestamp `prediksi.md` harus lebih tua daripada waktu kode dijalankan.** Kalau tidak,
sesi itu tidak dihitung sebagai bukti paham, dan diulang.

### 4 aturan sesi yang mengikat

1. **Tulis `prediksi.md` sebelum menjalankan apa pun.** Diperiksa lewat timestamp.
2. **Tidak menyalin kode.** Kode diberi untuk **dijalankan**, bukan diketik ulang.
3. **Tidak bertanya ke AI sebelum menulis tebakan.**
4. **Kalau dalam satu sesi tidak pernah salah, materinya terlalu mudah.** Naikkan kesulitannya.

## Langkah 3 — Korpus Latihan: WAJIB kode hasil generate AI

**Semua kode latihan diambil dari kode hasil generate AI.** Bukan ditulis tutor.

| Bagian | Korpus | Ukuran |
|---|---|---|
| **0** | Satu file spesifikasi API (Markdown/JSON) | **20–40 baris** |
| **1** | Satu file server dengan routing | **30–80 baris** |
| **2** | Satu proyek kecil | **3–5 file, 150–250 baris** |
| **3** | Satu spesifikasi API + dokumentasi | **250–400 baris** |

**Aturan korpus:**

1. Kode disalin ke `PRAKTIK/`. **Tidak pernah** dijalankan di repo produksi.
2. Kode boleh **tidak sempurna** — justru itu gunanya.
3. **Kode yang dipakai adalah kode yang *terlihat* benar.** Itu musuh sebenarnya.
4. **Untuk TELUSUR:** korpusnya harus **sudah dijalankan**, hasilnya **salah**, tapi
   **tidak ada error di console**. Kalau ada error → itu latihan baca stack trace.
   Dan **jangan tandai di mana cacatnya** — hapus komentar penunjuk.
5. **Tutor tidak menulis kode sendiri.** Kalau perlu kode, minta AI menghasilkannya
   dengan permintaan **wajar**, lalu pakai **apa adanya** — jangan dirapikan.

**Cacat khas kode AI di bidang ini** — daftar lengkap: `korpus-ai.md` §7.
Yang paling berbahaya (**gagal senyap**):

| Cacat | Unit |
|---|---|
| **Pagination offset** — baris terlewat & ganda ⭐⭐ | **10** |
| **`POST` tanpa idempotency** — data dobel saat retry ⭐ | **11** |
| **Cache `max-age` besar untuk data pribadi** ⭐⭐ | **12** |
| `GET` yang mengubah data | **4** |
| Semua error → `500` `{"error":"failed"}` | **9** |
| `429` tanpa `Retry-After` | **13** |
| `Content-Type` hilang padahal body JSON | **6** |
| Spec OpenAPI tidak sinkron dengan kode | **16** |

### Latihan inti: "klaim vs kenyataan"

> Tutor memberi **kode + satu kalimat klaim** — misalnya: *"endpoint ini aman dipanggil
> berulang kali."*
> Tugas pembelajar: **tentukan apakah klaim itu benar.**

Bukan mencari bug. **Menentukan apakah kontrak melakukan apa yang dikatakannya.**

**Latihan terkuat di skill ini** memakai satu baris output sebagai bukti:

> *"Item asli yang TERLEWAT: H,I,J · Item yang GANDA: B,C · Error yang muncul: TIDAK ADA"*

Kode yang lolos latihan ini = kontrak yang benar-benar diperiksa. Kode yang lolos begitu
saja = **utang pemahaman**.

## Langkah 4 — Delegasikan ke Skill yang Tepat

| Situasi | Serahkan ke |
|---|---|
| JavaScript belum dikuasai (fungsi, objek, array, `JSON`) | **`/teach-javascript`** — prasyarat mutlak |
| **OAuth · JWT · API Gateway · Microservices · Webhook** | **`/teach-system-design`** — **jangan** diajarkan di sini |
| **Caching infrastruktur (Redis, CDN)** | **`/teach-system-design`** — di sini hanya **header cache HTTP** |
| **Rate limiting sebagai kapasitas sistem** | **`/teach-system-design`** — di sini hanya **sisi kontrak** (`429` + `Retry-After`) |
| **`fetch` · Express · server · middleware** | **`/teach-nodejs`** |
| React (membaca data dari API) | **`/teach-react`** |
| SOLID · design pattern · TDD | **`/teach-software-design`** |
| Tampilan / styling | **`/teach-tailwindcss`** |
| Menetapkan tujuan, asesmen level | `/teach-clarifier` |
| Pembelajar stuck / minta jawaban langsung | `/gentle-teaching` |
| Menganalisis API nyata milik orang lain | `/teach-case-study` |

**Aturan chaining: maksimal 1 skill aktif per sesi.**
**Urutan yang disarankan:** `teach-javascript` → `teach-software-design` →
**`teach-api-design`** → `teach-nodejs` → `teach-system-design`.
Alasannya: kontrak ditetapkan **sebelum** kode server ditulis — supaya kodenya mengikuti
kontrak, bukan sebaliknya.

## Langkah 5 — Tutup Setiap Sesi dengan LEARNING-RECORD

Setiap sesi WAJIB diakhiri: buat `LEARNING-RECORDS/LR-NNNN-<topik>.md` berisi:

```markdown
# LR-NNNN — <topik> (<tanggal>)
Bagian/Unit: B<x>-U<y> · Sesi ke: <n> · Durasi: <±jam>
Korpus: <kode AI dari mana — file / spesifikasi / proyek>

## Yang dipelajari hari ini (3 poin max, kata-kata pembelajar)
## Prediksi vs kenyataan (di mana tebakan meleset — ini bagian terpenting)
## Miskonsepsi yang terkoreksi (jika ada)
## Bukti paham: <unit yang dilanggar / directive yang benar / parameter yang tak bisa diubah>
## Dugaan telusur (kalau ada): <dugaan apa, gugur atau terkonfirmasi>  ← ini bukti debug
## Baris output yang membuktikan: <kutip SATU baris>  ← WAJIB di Bagian 2
## Dampak ke klien lama: <rusak / tidak rusak — dan kenapa>  ← WAJIB di Bagian 1+
## Sumber: <dari RESOURCES.md, dengan bagian spesifik — mis. RFC 9110 §9.2.2>
## Selanjutnya: <1 langkah konkret + skill pemiliknya>
```

**Baris "Baris output yang membuktikan" wajib di Bagian 2 ke atas.**
Jawaban *"sepertinya karena offset"* **belum lulus**. Yang lulus:
*"baris `hal 2: B,C,D` membuktikan posisinya bergeser."*

**Baris "Dampak ke klien lama" wajib di Bagian 1 ke atas.**
Perbaikan yang mengaku "lebih baik dan tetap kompatibel" adalah **belum lulus** —
tidak ada perbaikan kontrak tanpa biaya.

LR = memori jangka panjang. Sesi berikutnya: baca `MISSION.md` + LR terakhir dulu.

## Cek Tanda Berhasil (It's working if)

- Membuka folder workspace + `MISSION.md` cukup untuk melanjutkan — tanpa chat lama
- `PRAKTIK/sesi-NNN/prediksi.md` **selalu ada dan timestamp-nya lebih tua**
- `RESOURCES.md` bertambah setiap bagian, dan setiap lesson punya sitasi RFC/AIP/vendor
- `LEARNING-RECORDS/` tumbuh 3–5 file per minggu
- **Pembelajar pernah salah prediksi minimal sekali per sesi**
- **Pembelajar menyebut `no-cache` ≠ `no-store`** tanpa membuka catatan
- **Pembelajar menolak offset pagination untuk data yang bertambah** — dan menyebut alasannya
- **Pembelajar menyebut `429` bukan dari RFC 9110**
- **Pembelajar menyebut DAMPAK ke klien lama**, bukan hanya manfaat perbaikan
- **Pembelajar menulis ≥ 2 dugaan sebelum menyentuh kode** — bukan menghapus acak-acakan
- `hasil.md` memuat **dugaan yang gugur**, bukan hanya yang benar
- Pembelajar bisa menjawab **"kenapa data saya jadi dobel padahal saya kirim sekali?"**
- Pembelajar bisa menjawab **"kenapa ada baris yang hilang di laporan saya?"**
- Di akhir Bagian 3: bisa membaca spesifikasi API hasil AI yang belum pernah dilihat,
  menyebut satu cacat kontrak, dan memutuskan **terima/tolak — dengan alasan**

## Anti-Pattern (JANGAN)

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Menyuruh pembelajar "baca `00-PANDUAN.md` bagian 5" | **JANGAN.** Tutor baca sendiri, lalu jelaskan (§MODE PENYAMPAIAN) |
| Memberi kode contoh buatan sendiri yang rapi | **JANGAN.** Korpus wajib kode hasil AI |
| Membiarkan kode dijalankan sebelum `prediksi.md` disimpan | **JANGAN.** Cek timestamp; kalau bocor, sesi diulang |
| Mengajar dari ingatan karena "ini kan HTTP dasar" | Unduh teks RFC-nya, `grep`, baru ajarkan |
| Satu sesi membahas 3 directive cache sekaligus | Satu sesi satu konsep |
| **Menulis "`429` ada di RFC 9110"** | 🔴 **JANGAN.** `grep` → **0 kemunculan**. Ia dari **RFC 6585 §4** |
| **Menulis "`422` = Unprocessable Entity"** | 🔴 **JANGAN.** RFC 9110 §15.5.21: **"Unprocessable Content"** |
| **Menulis "`no-cache` berarti jangan simpan"** | 🔴 **JANGAN.** Yang tidak menyimpan adalah **`no-store`** |
| **Menyebut offset sebagai "cara standar"** | 🔴 **JANGAN.** Tiga pedoman resmi memakai **kursor** |
| **Menulis `Sunset` dengan format ISO 8601** | 🔴 **JANGAN.** RFC 8594 §3: **HTTP-date** |
| **Memilih satu gaya pagination sebagai "yang benar"** | **JANGAN.** Tiga-tiganya sah. Ajarkan **memilih dengan alasan** |
| **Memilih satu gaya versioning sebagai "yang benar"** | **JANGAN.** Microsoft melarang versi di path; Google memakainya |
| **Mengajarkan OAuth / JWT / API Gateway / Microservices / Webhook** | **JANGAN.** Itu `/teach-system-design` |
| **Mengajarkan `fetch` / Express / middleware** | **JANGAN.** Itu `/teach-nodejs` |
| **Mengajarkan SOLID / design pattern** | **JANGAN.** Itu `/teach-software-design` |
| **Menyebut `RateLimit-*` header sebagai standar** | **JANGAN.** Masih **draft** IETF, belum standar |
| **Mengajarkan Bagian 3 sebelum Bagian 0–2 lulus** | **JANGAN.** Bagian 3 mengandaikan kemampuan menilai |
| **Menerima jawaban "sepertinya karena…"** | **JANGAN.** Minta **satu baris output** sebagai bukti |
| **Menerima perbaikan yang mengaku "tetap kompatibel"** | **JANGAN.** Tidak ada perbaikan kontrak tanpa biaya. Minta dampaknya |
| **Memberi petunjuk letak cacat pada latihan TELUSUR** | **JANGAN.** Diam. Tunggu dugaan pertama pembelajar. |
| **Membiarkan `console.log` disebar tanpa dugaan** | **JANGAN.** Satu alat per dugaan |
| **Menjawab "itu di luar materi" untuk istilah yang tidak dikenal** | **JANGAN.** Cek `sintaks-http-api.md`, jelaskan **satu istilah**, lanjut |
| **Menyerahkan penilaian kontrak ke AI** | **JANGAN.** *"Apakah kontrak ini aman diubah?"* = latihan intinya |
| Menjanjikan "paham desain API dalam 3 hari" | Tegur jujur: Bagian 0–2 ± 19 sesi. Tawarkan jalur ringkas **dengan konsekuensinya** |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Men-debug API produksi pembelajar | Pakai skill ini | `/debugging-and-error-recovery` |
| Belajar **OAuth / JWT / keamanan API** | Pakai skill ini | `/teach-system-design` |
| Belajar **caching infrastruktur** (Redis, CDN) | Pakai skill ini | `/teach-system-design` |
| Belajar **backend / server / `fetch` / Express** | Pakai skill ini | `/teach-nodejs` |
| Belajar JavaScript (belum dikuasai) | Pakai skill ini | `/teach-javascript` dulu |
| Belajar **desain kode** (SOLID, pola) | Pakai skill ini | `/teach-software-design` |
| Belajar React / Tailwind | Pakai skill ini | `/teach-react` · `/teach-tailwindcss` |
| Merancang **seluruh arsitektur** aplikasi | Pakai skill ini | `/teach-system-design` |
| Membangun aplikasi fullstack sungguhan | Pakai skill ini | `/idea-clarifier` → pipeline produksi |
| Menjawab satu pertanyaan "apa itu REST" di tengah kerja | Buka asesmen lengkap | Jawab langsung dengan sitasi; sarankan skill ini kalau mau serius |
| Minta "cara cepat belajar desain API dalam 3 hari" | Menyetujui | Tegur jujur. Tawarkan jalur ringkas **dengan konsekuensinya** |

## Next Step

Setelah workspace + `MISSION.md` + titik masuk siap:
→ `/teach-clarifier` untuk menetapkan target sesi pertama, lalu kembali ke skill ini
dan mulai **Unit 1: "API itu kontrak, bukan kode"**

## Materi Reference (WAJIB)

Sebelum menjawab pertanyaan materi atau menetapkan roadmap, baca sumbernya — folder materi
adalah sumber kebenaran, ingatan model bukan:

- **`references/roadmap-4-tingkat.md`** — bagian, 4 gerbang, bentuk sesi, aturan AI,
  **batas vs skill lain** (WAJIB)
- **`references/peta-unit.md`** — detail per unit + 18 miskonsepsi (WAJIB)
- **`references/korpus-ai.md`** — menyiapkan korpus + 4 latihan + **hasil verifikasi empiris** (WAJIB)
- **`references/sintaks-http-api.md`** — kamus istilah → HTTP/JSON + tingkat bahaya
  (WAJIB saat pembelajar bertanya "ini artinya apa?")
- **`references/cakupan-vs-dokumen-resmi.md`** — audit cakupan + **batas kejujuran**
- **Workspace pembelajar** `D:/Programming/belajar-api-design/`:
  - `00-PANDUAN.md` — panduan lengkap yang sudah diadaptasi
  - `MISSION.md` — tujuan akhir (dari S5) + kriteria SELESAI
  - `RESOURCES.md` — daftar sumber + status verifikasi + batas kejujuran
  - `NOTES.md` — preferensi belajar + aturan cara belajar
  - `AUDIT-CAKUPAN.md` — celah yang pernah ditemukan & tambalannya
- **Skill terkait:** `/teach-javascript` (prasyarat) · `/teach-software-design` (desain kode) ·
  `/teach-nodejs` (implementasi server) · `/teach-system-design` (keamanan & arsitektur)
- **Sumber eksternal resmi:** rfc-editor.org, spec.openapis.org, google.aip.dev,
  github.com/microsoft/api-guidelines, stripe.com/docs/api, owasp.org, developer.mozilla.org —
  lihat `RESOURCES.md`

Kutip aturan verbatim + sebut nomor sumbernya. Jika ragu: unduh teks RFC-nya, `grep`,
baru bertindak. Jangan mengarang dari ingatan.

> 🔴 **Satu hal yang wajib pembelajar tahu sejak awal:** skill ini **tidak punya dasar
> riset pedagogis** seperti lima skill `teach-*` lain. Isinya disusun dari **standar
> bidangnya** (RFC & pedoman resmi), bukan dari penelitian cara mengajarkannya.
> Katakan ini kalau ia bertanya "kenapa urutannya begini?" — jawaban jujurnya:
> **"karena disusun dari cacat kontrak yang paling sering ditemukan, bukan dari
> penelitian urutan belajar."**
