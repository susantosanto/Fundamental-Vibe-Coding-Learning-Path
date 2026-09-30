# Peta Unit — Detail per Unit (API Design Mode Inspeksi)

> Referensi untuk skill **`teach-api-design`**. **Tutor membaca file ini sendiri** —
> pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **18 unit · 4 bagian · 4 gerbang.** Bagian 0 = **prasyarat** (apa itu kontrak).
> Bagian 3 = **opsional**, hanya setelah Bagian 0–2 lulus.
> Setiap unit: **konsep · kode yang dikenali · yang diajarkan · latihan inspeksi ·
> miskonsepsi · kriteria lulus · sumber.**
> Satu unit = 1–2 sesi × maks 1 jam.
>
> **Kamus istilah lengkap ada di `sintaks-http-api.md`.** Baris *"Kode yang dikenali"*
> di tiap unit hanya menyebut yang paling sering muncul.
>
> **Bidang skill ini: ANTARMUKA (kontrak).** Bukan kode (`teach-software-design`),
> bukan sistem (`teach-system-design`). Lihat `roadmap-4-tingkat.md` §6.
>
> **Dibuat:** 29 September 2026

---

## Aturan umum semua unit

| | |
|---|---|
| Bentuk sesi | 6 tahap: PREDIKSI → JALANKAN → BEDAH → UBAH → [PERBAIKI] → CATAT |
| Alat | Terminal + Node.js (v22+). Bagian 2+: `node:test` (bawaan, tanpa instalasi) |
| Korpus | **Kode/spesifikasi hasil generate AI** (lihat `korpus-ai.md`) |
| Ukuran korpus | Bagian 0: 20–40 baris. Bagian 1: 30–80. Bagian 2: 3–5 file / 150–250. Bagian 3: 250–400. |
| Aturan mutlak | `prediksi.md` ditulis & disimpan **sebelum** kode dijalankan |
| Sumber sitasi | `RFC 9110 §x` · `RFC 9111 §x` · `RFC 9457` · `AIP-158` · `Microsoft Azure REST Guidelines` · `Stripe API` · `MDN: <topik>` · `OpenAPI 3.1.0` |
| **Istilah asing** | **JANGAN bilang "di luar materi"** → cek `sintaks-http-api.md`, jelaskan **satu istilah**, lanjut |
| **Tahap PERBAIKI** | **BUKTI dulu** (jalankan & lihat), baru perbaiki. Tidak boleh membalik urutan |
| **Yang DILARANG diajarkan** | OAuth · JWT · API Gateway · Microservices · Webhook · `fetch`/Express/React · SOLID. Semuanya milik skill lain (`roadmap-4-tingkat.md` §6) |

**Cara menyiapkan terminal (dilakukan tutor sekali, sebelum Unit 1):**

```
mkdir -p PRAKTIK/sesi-001 && cd PRAKTIK/sesi-001
node --version        # pastikan v22+ (untuk node:test)
```

Sebutkan ke pembelajar **apa yang baru saja terjadi** — lalu **jangan** jadikan sesi
penyiapan sebagai sesi belajar. Sesi pertama harus langsung Unit 1.

---

## Perbedaan penting: skill ini TIDAK menjalankan HTTP sungguhan

`teach-api-design` mengajarkan **kontrak**, dan kontrak bisa diperiksa **tanpa jaringan**.

| Boleh dipakai | Tidak boleh dipakai |
|---|---|
| `node:http` bawaan (server lokal, `localhost`) | Memanggil API publik yang butuh kunci |
| Objek biasa yang **mensimulasikan** respons | Memasang Express/Fastify/NestJS (itu `teach-nodejs`) |
| `node:test` untuk membuktikan perilaku | Postman/Insomnia (GUI — menyembunyikan kontraknya) |
| `curl -i` ke `localhost` (untuk melihat header) | Blog / artikel SEO sebagai sumber |

**Alasannya:** yang diperiksa adalah **bentuk kontrak** (method, status, header, bentuk
body, perilaku saat gagal) — bukan kecepatan jaringan. Simulasi cukup, dan **lebih jujur**
karena tidak ada variabel luar yang mengaburkan sebab-akibat.

---

## BAGIAN 0 — API ITU KONTRAK (Unit 1–3) · **prasyarat**

**Yang dilatih:** menyadari bahwa API adalah **janji ke pihak yang tidak dikenal** —
sebelum menyentuh HTTP sama sekali.
**Korpus:** satu file spesifikasi API hasil AI (Markdown/JSON), 20–40 baris.
**Prasyarat teknis:** `teach-javascript` Unit 1–8 (objek, array, fungsi).

---

### Unit 1 — API = kontrak, bukan kode

| | |
|---|---|
| **Konsep** | Kode bisa diubah kapan saja oleh yang menulisnya. **Kontrak tidak** — ada pihak lain yang sudah menulis kode terhadapnya, dan kode itu tidak ada di komputer kita. Perubahan pada kontrak adalah perubahan pada **kode orang lain**. |
| **Kode yang dikenali** | `README` API · tabel endpoint di Markdown · `openapi.yaml` · komentar `// kontrak: ...` · `docs/api.md` |
| **Yang diajarkan** | (a) RFC 9110 §1 menyebut HTTP sebagai *"generic interface"* dengan *"extensible semantics"* — artinya **perilaku yang disepakati**, bukan format data. (b) **Tiga pihak** yang terikat kontrak: penulis API, pemanggil API, dan **pemanggil yang belum lahir**. (c) Perubahan kontrak = **biaya di luar tim sendiri**. |
| **Latihan inspeksi (LACAK)** | Diberi satu perubahan kecil pada API (`?nama=` → `?q=`). **Sebut siapa saja** yang harus ikut berubah — dan **sebut satu pihak yang tidak ada di ruangan ini**. |
| **Miskonsepsi** | ❌ *"Ini cuma ganti nama parameter, cepat."* → Nama parameter **adalah** kontrak. Penggantiannya memecahkan setiap klien yang sudah dipasang. ❌ *"Kode kita yang pakai, jadi kita bebas."* → Kalau begitu ini bukan API, tapi fungsi internal. |
| **Kriteria lulus** | Bisa menyebut **minimal satu pihak di luar tim** yang menanggung akibat perubahan. Kalau jawabannya "tidak ada", Unit 1 belum lulus. |
| **Sumber** | RFC 9110 §1 (*Architecture* / *Generic Interface*) · AIP-122 (Resource Names) |

> **Cara mengajar:** jangan mulai dari HTTP. Mulai dari **satu janji**: *"setiap orang
> yang memanggil `GET /siswa/123` akan menerima bentuk yang sama seperti kemarin."*
> Tanya: *"kalau janji ini berubah, siapa yang marah?"* — itu pintu masuknya.

---

### Unit 2 — Resource & endpoint — cara menamai

| | |
|---|---|
| **Konsep** | **Resource = kata benda.** Aksi ditentukan oleh **method HTTP**, bukan oleh nama endpoint. `GET /siswa/123` ✅ · `GET /ambilSiswa?id=123` ❌ · `POST /siswa` ✅ (buat baru). |
| **Kode yang dikenali** | `app.get('/getUsers', …)` · `app.post('/createUser', …)` · `app.post('/deleteUser/:id', …)` · `/api/doLogin` · `/api/prosesData` |
| **Yang diajarkan** | (a) Pola `kata kerja + kata benda` di URL adalah tanda **RPC yang menyamar jadi REST**. (b) **Plural konsisten**: `/siswa` bukan campuran `/siswa` + `/guru` + `/nilais`. (c) Resource **bertingkat** menunjukkan kepemilikan: `/siswa/123/nilai` (nilai milik siswa 123). (d) `AIP-122` memberi bentuk resmi untuk *resource name*. |
| **Latihan inspeksi (KLAIM)** | Diberi 6 endpoint hasil AI. **Sebut mana yang menamai AKSI**, bukan resource. Lalu: **sebut satu yang tidak bisa kamu putuskan** — dan jelaskan kenapa (batas ambigu itu bagian dari jawabannya). |
| **Miskonsepsi** | ❌ *"`/getUsers` lebih jelas daripada `/users`."* → Lebih jelas bagi **penulisnya**, bukan bagi kontrak. Method sudah mengatakan "get". ❌ *"Plural/plural itu soal selera."* → Ia soal **prediktabilitas**. Klien yang tidak bisa menebak nama endpoint akan bertanya — dan pertanyaan itu biaya. |
| **Kriteria lulus** | Menemukan **minimal 3** dari 6 endpoint yang menamai aksi, dan bisa menjelaskan **kenapa** salah satu di antaranya ambigu. |
| **Sumber** | Google **AIP-122** (Resource Names) · RFC 9110 §9 (method) · `16-komunikasi-protokol.md` §363 |

> **Penting — jangan menyebut ini "REST yang benar".** Sebut: *"ini konvensi yang paling
> banyak dipakai, dan ada alasannya."* RPC yang jelas dan konsisten juga sah — yang
> berbahaya adalah **campuran yang tidak diumumkan**.

---

### Unit 3 — Siapa pembaca kontrak ini

| | |
|---|---|
| **Konsep** | Satu kontrak punya **tiga pembaca**: **klien** (kode orang lain yang memanggilnya) · **manusia** (yang membaca dokumentasi) · **mesin** (OpenAPI, generator SDK). Kontrak yang baik melayani ketiganya; kontrak yang hanya melayani penulisnya akan gagal di dua yang lain. |
| **Kode yang dikenali** | `openapi.yaml` yang tidak sinkron dengan kode · komentar `// TODO: dokumentasi` · README tanpa contoh respons · nama field singkatan (`nm`, `tgl`, `jml`) |
| **Yang diajarkan** | (a) **Nama field adalah bagian kontrak** — `nm` vs `nama` bukan soal estetika. (b) Dokumentasi yang **tidak sinkron** lebih berbahaya daripada tidak ada dokumentasi. (c) `OpenAPI 3.1.0` = kontrak yang **bisa dibaca mesin**; root wajib `openapi` + `info`, minimal satu dari `paths`/`components`/`webhooks`. |
| **Latihan inspeksi (LACAK)** | Diberi **satu endpoint**. **Sebut** apa yang **tidak bisa diketahui** pembaca hanya dari namanya — misalnya: apa yang terjadi kalau data kosong? apa satuannya? apa format tanggalnya? |
| **Miskonsepsi** | ❌ *"Dokumentasi nanti saja."* → Dokumentasi **adalah** kontraknya. Yang tidak didokumentasikan akan **ditebak** klien — dan tebakan itu jadi beban. ❌ *"OpenAPI itu opsional."* → Opsional bagi penulis, **wajib** bagi pembaca mesin. |
| **Kriteria lulus** | Bisa menyebut **minimal 2 hal** yang tidak bisa diketahui pembaca tanpa bertanya, untuk **satu** endpoint. |
| **Sumber** | **OpenAPI Specification 3.1.0** · RFC 9110 §1 |

### → GERBANG 1 — Kenali kontrak yang buruk, tanpa solusi

Diberi **satu spesifikasi API hasil AI** (± 40 baris) yang belum pernah dilihat.

**Tanpa menulis kode**, tuliskan:

1. **Berapa endpoint** yang menamai **aksi** alih-alih resource — sebutkan
2. **Satu hal** yang tidak bisa diketahui pembaca tanpa bertanya ke penulisnya
3. **Satu kalimat:** kenapa ini berbahaya bagi klien yang sudah jadi

**Lulus kalau poin 1 dan 3 benar.**
Gerbang ini **sengaja tidak meminta solusi** — solusi baru ada di Bagian 1–2.

---

## BAGIAN 1 — KOSAKATA HTTP (Unit 4–8)

**Yang dilatih:** membaca HTTP sebagai **bahasa kontrak**, bukan sekadar cara mengirim data.
**Korpus:** satu file server hasil AI (30–80 baris) dengan routing.
**Alat:** Terminal + Node.js.

---

### Unit 4 — Methods: `safe` & `idempotent` ⭐

| | |
|---|---|
| **Konsep** | Dua sifat yang menentukan **apa yang boleh dilakukan klien saat jaringan gagal**. **`safe`** = tidak mengubah apa pun di server. **`idempotent`** = diulang berapa kali pun, hasilnya sama seperti sekali. |
| **Kode yang dikenali** | `app.get('/lihat/:id', …)` yang di dalamnya ada `db.update(...)` · `app.get` yang menaikkan penghitung · `app.put` yang menambah baris baru tiap panggilan · `app.post('/simpan')` untuk hal yang sebenarnya bisa diulang |
| **Yang diajarkan (verbatim)** | RFC 9110 **§9.2.1**: *"Request methods are considered 'safe' if their defined semantics are essentially read-only"* → **GET, HEAD, OPTIONS, TRACE**. RFC 9110 **§9.2.2**: *"A request method is considered 'idempotent' if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request"* → **PUT, DELETE, dan semua yang safe**. |
| **Latihan inspeksi (TELUSUR)** | Kode: `GET /halaman-profil/:nama` yang mencatat kunjungan ke array. Klien memanggil 3×. **Tidak ada error.** Cari sebabnya. |
| **Bukti empiris (terverifikasi 29 Sep 2026, Node v22.22.2)** | `GET` dipanggil 3× untuk pengguna yang sama → `Catatan kunjungan : ["budi","budi","budi"]` · `Panjang catatan : 3` (seharusnya 0) · `Error yang muncul : TIDAK ADA` |
| **Miskonsepsi** | ❌ *"GET cuma baca, pasti aman."* → **Niatnya** baca. Kodenya bisa apa saja. Itu bedanya. ❌ *"DELETE tidak idempotent karena kedua kali error 404."* → Idempotent bicara soal **efek di server**, bukan **status balasan**. `404` pada DELETE kedua justru bukti efeknya sama: sudah terhapus. ❌ *"POST selalu tidak idempotent."* → Benar secara default, tapi bisa **dibuat** idempotent (Unit 11). |
| **Kriteria lulus** | Bisa menyebut **satu endpoint di korpus** yang melanggar `safe`, dan menjelaskan **kenapa ini tidak muncul sebagai error**. |
| **Sumber** | **RFC 9110 §9.2.1, §9.2.2** (verbatim) · MDN *HTTP request methods* |

> **Kaitkan ke nyata:** inilah alasan browser & crawler **boleh** memanggil `GET` kapan
> saja. Kalau `GET` mengubah data, crawler bisa merusak datamu. Tanpa error.

---

### Unit 5 — Status codes — bahasa hasil

| | |
|---|---|
| **Konsep** | Status code = **hasil** dari permintaan, dalam bahasa yang sudah disepakati. `1xx` informasi · `2xx` berhasil · `3xx` pindah · `4xx` **salahmu** · `5xx` **salahku**. |
| **Kode yang dikenali** | `res.status(200).json({ error: 'Tidak ditemukan' })` 🔴 · semua kesalahan → `500` · `res.send(200)` untuk kegagalan · `201` tidak dipakai untuk pembuatan · `204` diabaikan |
| **Yang diajarkan** | (a) Kelas status dari **RFC 9110 §15**. (b) 🔴 **`429 Too Many Requests` TIDAK ada di RFC 9110** — ia dari **RFC 6585 §4**. Ini kesalahan yang sering dikutip. (c) RFC 9110 menamai `422` **"Unprocessable Content"** — bukan *"Unprocessable Entity"*. Nama lama masih beredar. (d) **Kode harus cocok dengan isi body.** |
| **Latihan inspeksi (KLAIM)** | Diberi **5 situasi** (data tidak ada · input salah bentuk · input benar tapi tidak masuk akal · server mati · berhasil dibuat). **Prediksi** status code-nya, lalu buktikan. **Sebut mana yang bukan dari RFC 9110.** |
| **Miskonsepsi** | ❌ *"`200` selalu aman."* → `200` dengan `{"error": …}` **berbohong**. Klien yang memeriksa status akan menganggap semuanya berhasil. ❌ *"`400` dan `422` itu sama."* → `400` = **bentuknya** salah. `422` = bentuknya benar, **isinya** tidak bisa diproses. ❌ *"`500` untuk semua kegagalan."* → `500` artinya **salah server**. Kalau input pengguna salah, itu `4xx` — kalau tidak, kamu menyalahkan dirimu sendiri dan menyembunyikan bug. |
| **Kriteria lulus** | 4 dari 5 situasi benar, **dan** bisa menyebut `429` sebagai yang bukan dari RFC 9110. |
| **Sumber** | **RFC 9110 §15** (daftar status) · **RFC 6585 §4** (429) · MDN *HTTP response status codes* |

---

### Unit 6 — Header & `Content-Type`

| | |
|---|---|
| **Konsep** | Header = **metadata kontrak**. Ia mengatakan apa isinya, bagaimana membacanya, dan bagaimana menyimpannya — **tanpa membuka isinya**. |
| **Kode yang dikenali** | `res.send(JSON.stringify(data))` **tanpa** `Content-Type` · `res.setHeader('Content-Type', 'text/plain')` padahal isinya JSON · `Accept` tidak pernah dibaca server · error dikirim sebagai `text/html` |
| **Yang diajarkan** | (a) **`Content-Type`** = *"ini apa yang saya kirim"*. **`Accept`** = *"ini apa yang saya mau"*. Dua hal berbeda. (b) **`application/problem+json`** adalah **media type tersendiri** (RFC 9457) — bukan sekadar `application/json`. (c) RFC 9110 §8 membahas field header. |
| **Latihan inspeksi (KLAIM)** | Klaim tertulis: *"endpoint ini selalu mengembalikan JSON."* → **Verifikasi**. Periksa **header**, bukan body — body bisa terlihat seperti JSON padahal headernya `text/plain`. |
| **Miskonsepsi** | ❌ *"Body terlihat seperti JSON, berarti JSON."* → Tanpa `Content-Type` yang benar, klien harus **menebak**. Beberapa klien akan salah tebak. ❌ *"Header cuma formalitas."* → Header menentukan apakah klien **boleh menyimpan**, **boleh membagi ke cache bersama**, dan **cara membaca byte**. Bukan formalitas. |
| **Kriteria lulus** | Bisa menunjukkan **perbedaan `Content-Type` dan `Accept`** dengan contoh dari korpus, dan menyebut satu akibat nyata kalau `Content-Type` salah. |
| **Sumber** | RFC 9110 §8 (field header) · **RFC 9457 §3** (`application/problem+json`) |

---

### Unit 7 — Bentuk response: data langsung vs envelope

| | |
|---|---|
| **Konsep** | Dua gaya sah: **data langsung** (`[{"id":1}]`) vs **envelope** (`{"value":[{"id":1}]}`). Envelope memberi **ruang untuk metadata** tanpa memecahkan bentuk. Data langsung lebih ringkas, tapi **tidak bisa ditambah apa pun** nanti. |
| **Kode yang dikenali** | `res.json(array)` · `res.json({ data: … })` · `res.json({ value: … })` · `{ "results": …, "error": null }` · campuran dua gaya di satu API 🔴 |
| **Yang diajarkan** | (a) **Microsoft Azure REST Guidelines** **mewajibkan** envelope (`{ "value": [...], "nextLink": ... }`) untuk daftar. (b) **Stripe** memakai envelope berlapis (`{"object":"list","data":[…],"has_more":…}`). (c) Banyak API populer mengembalikan array langsung — **sah**, tapi **jalan buntu** saat perlu pagination atau total. |
| **Latihan inspeksi (KLAIM)** | Diberi **dua bentuk respons**. **Putuskan** mana yang lebih mudah ditambah metadata (total, halaman, peringatan) — lalu **sebut biayanya** (satu lapis pembungkus yang harus dibuka klien, selamanya). |
| **Miskonsepsi** | ❌ *"Envelope itu tidak perlu, tambah ribet."* → Sampai kamu perlu mengirim **total baris** — dan tidak punya tempat. Mengubah array jadi objek **memecahkan** setiap klien. ❌ *"Array langsung lebih RESTful."* → REST tidak mengatur ini. **Konsistensi** yang mengatur. Yang salah adalah **campuran**. |
| **Kriteria lulus** | Bisa menyebut **satu hal yang tidak bisa dikirim** dengan gaya data langsung, dan **biaya** gaya envelope. |
| **Sumber** | Microsoft Azure REST API Guidelines (§Pagination) · Stripe API reference (`object` / `data` / `has_more`) |

---

### Unit 8 — Query parameter: filter, sort, pilih field

| | |
|---|---|
| **Konsep** | **Nama parameter adalah kontrak.** `?status=aktif` yang diubah jadi `?s=aktif` memecahkan klien sama seperti mengubah path. |
| **Kode yang dikenali** | `?filter=` · `?orderby=` · `?select=` · `?$filter=` (OData) · `?q=` tanpa dokumentasi · `?sort=-nama` (tanda minus = menurun) · parameter tanpa nilai default yang diumumkan |
| **Yang diajarkan** | (a) Tiga hal yang sering diminta klien: **filter** (pilih baris), **sort** (urutkan), **select** (pilih kolom). (b) ⚠️ **Dua konvensi sah & berbeda:** Microsoft Azure memakai **tanpa `$`** (`?filter=`, `?orderby=`, `?select=`), **OData** memakai **`$`** (`?$filter=`, `?$orderby=`). Keduanya resmi. (c) Parameter **wajib punya nilai default yang diumumkan** — kalau tidak, klien menebak. |
| **Latihan inspeksi (KLAIM)** | Diberi **satu endpoint list**. **Sebut** parameter mana yang akan **mustahil diubah** setelah klien memakainya — dan kenapa. |
| **Miskonsepsi** | ❌ *"Query parameter gampang diubah, kan cuma di URL."* → **Semudah itu juga klien rusak.** Tidak ada versi, tidak ada peringatan. ❌ *"Tambah parameter baru itu aman."* → Benar — **selama opsional dan punya default**. Parameter **wajib** baru = breaking change. ❌ *"Nama parameter itu urusan internal."* → Ia terlihat di setiap log, setiap bookmark, setiap kode klien. |
| **Kriteria lulus** | Bisa menyebut **satu parameter** yang tidak boleh diubah tanpa versi baru, dan menjelaskan alasannya. |
| **Sumber** | Microsoft Azure REST API Guidelines (§Query options) · OData URL Conventions (§5) |

### → GERBANG 2 — Baca HTTP sebagai kontrak

Diberi **satu file server hasil AI** (± 60 baris) dengan **dua masalah kontrak**.

1. Sebut **unit mana** yang dilanggar di tiap masalah
2. **Perbaiki satu** — cukup satu
3. Jelaskan: *"perbaikan ini memecahkan klien lama atau tidak?"* — jujur

**Lulus kalau poin 1 benar dan poin 3 menyebut dampak ke klien lama.**
Perbaikan yang mengaku "lebih baik dan tetap kompatibel" = **gagal**.

---

## BAGIAN 2 — DESAIN YANG TIDAK MENYAKITKAN (Unit 9–14) · **INTI**

**Yang dilatih:** enam masalah yang **muncul berbulan-bulan kemudian** — semuanya
**gagal senyap**.
**Korpus:** satu proyek kecil hasil AI (3–5 file, 150–250 baris).
**Alat:** Terminal + Node.js + **`node:test`** (bawaan, tanpa instalasi).

> **Kenapa bagian ini INTI:** Bagian 0–1 bisa dipelajari dari membaca. Bagian 2 **tidak** —
> karena kegagalannya tidak muncul saat dibaca, hanya saat **dijalankan berulang**.
> Unit 10, 11, 12, 13 adalah empat kegagalan senyap yang paling mahal.

---

### Unit 9 — Error handling: RFC 9457 ⭐

| | |
|---|---|
| **Konsep** | Kesalahan juga bagian dari **kontrak**. Kalau setiap API mengarang format error sendiri, setiap klien harus menulis penerjemah sendiri. RFC 9457 menyeragamkannya. |
| **Kode yang dikenali** | `res.status(500).json({ error: 'failed' })` · `{ success: false, msg: '...' }` · `{ error: { code: 1, message: '...' } }` (format sendiri) · `message` dalam bahasa manusia yang dipakai untuk bercabang di kode klien 🔴 |
| **Yang diajarkan (verbatim)** | RFC 9457 mendefinisikan *"a 'problem detail' to carry machine-readable details of errors in HTTP response content to avoid the need to define new error response formats for HTTP APIs"*. **Lima anggota:** `type` (URI — jenis masalah) · `title` (ringkas, tetap) · `status` (angka) · `detail` (penjelasan khusus kejadian ini) · `instance` (URI kejadian ini). **Media type:** `application/problem+json`. **RFC 9457 menggantikan RFC 7807.** |
| **Latihan inspeksi (TELUSUR)** | Kode: klien tidak bisa membedakan **"stok habis"** dari **"server mati"** — keduanya `500` dengan `{"error":"failed"}`. **Tidak ada error** di sisi mana pun. Cari sebabnya. |
| **Miskonsepsi** | ❌ *"Klien bisa membaca `message`."* → `message` ditulis untuk **manusia** dan bisa berubah kapan saja (bahkan diterjemahkan). Kode klien harus bercabang pada `type`, bukan `message`. ❌ *"Satu format error cukup: `{error: '...'}`."* → Cukup untuk **manusia**, tidak untuk **mesin**. Mesin butuh **pembeda**. ❌ *"`type` itu opsional."* → Kalau `type` kosong, klien kembali ke menebak dari `status` — dan `400` mencakup puluhan sebab berbeda. |
| **Kriteria lulus** | Bisa menyebut **`type`** sebagai pembeda mesin (bukan `message`), dan menyebut **`application/problem+json`** sebagai media typenya. |
| **Sumber** | **RFC 9457** (verbatim) · Microsoft Azure REST Guidelines (error response format) |

---

### Unit 10 — Pagination: tiga gaya sah ⭐⭐

| | |
|---|---|
| **Konsep** | Mengirim data banyak **sedikit-sedikit**. Ada **tiga gaya resmi yang saling bertentangan** — dan yang paling populer di tutorial (offset) adalah yang **paling berbahaya**. |
| **Kode yang dikenali** | `?page=2&limit=20` (offset) · `?offset=40&limit=20` · `?page_token=…` (kursor) · `nextLink` · `starting_after=…` · `has_more` · `total` |
| **Yang diajarkan (verbatim + 3 gaya)** | **(a) AIP-158** — `page_size` + `page_token`; *"Page tokens provided by APIs must be opaque (but URL-safe) strings, and must not be user-parseable"*. **(b) Microsoft** — `nextLink` berupa **URL absolut** ke halaman berikutnya. **(c) Stripe** — `starting_after` / `ending_before`; kursor = **ID objek**, bukan angka. 🔴 **Bahaya offset:** saat ada data baru masuk di **depan**, offset bergeser → baris **terlewat DAN ganda**, tanpa error. |
| **Latihan inspeksi (TELUSUR)** | Daftar 10 item, halaman 3 item, **2 data baru masuk di depan** setelah halaman 1 diambil, klien mengambil 3 halaman. Cari apa yang hilang & apa yang dobel — **tanpa error**. |
| **Bukti empiris (terverifikasi 29 Sep 2026, Node v22.22.2)** | <br>`hal 1: A,B,C \| offset berikutnya = 3`<br>`   (2 data baru masuk di depan)`<br>`hal 2: B,C,D \| offset berikutnya = 6`<br>`hal 3: E,F,G`<br><br>`Yang terkumpul klien   : A,B,C,B,C,D,E,F,G`<br>`Item asli yang TERLEWAT: H,I,J`<br>`Item yang GANDA        : B,C`<br>`Error yang muncul      : TIDAK ADA` |
| **Miskonsepsi** | ❌ *"Offset itu cara standar."* → Ia cara yang **paling mudah ditulis**, bukan paling aman. Tiga pedoman resmi memilih kursor. ❌ *"Tambah `ORDER BY` menyelesaikannya."* → Tidak. Urutannya jadi **stabil**, tapi **posisinya tetap bergeser** saat ada baris baru. ❌ *"Laporan saya tidak pernah berubah, jadi aman."* → Laporan keuangan sekolah **berubah** tiap ada pembayaran baru. Ini justru kasus terburuknya. |
| **Kriteria lulus** | Bisa menjelaskan **kenapa offset gagal** dengan menyebut **pergeseran posisi** (bukan "bug kode"), dan menyebut **satu** gaya kursor sebagai alternatif — **beserta biayanya** (tidak bisa lompat ke halaman 5). |
| **Sumber** | **AIP-158** (verbatim) · Microsoft Azure REST Guidelines (§Pagination) · Stripe API (Pagination) |

> **Kaitkan ke tujuan akhir xcode:** ini persis masalah **laporan keuangan sekolah** —
> daftar pembayaran diurutkan tanggal, ada 3 pembayaran baru masuk, lalu halaman 2
> dibuka → **3 baris terlewat, 3 baris dobel** di rekap. Tanpa error.

---

### Unit 11 — Idempotency & retry ⭐

| | |
|---|---|
| **Konsep** | Klien **selalu** retry saat timeout — karena ia tidak tahu apakah permintaan sampai. Kalau endpoint-nya `POST` yang membuat data, retry = **data ganda**. Jawabannya: **`Idempotency-Key`**. |
| **Kode yang dikenali** | `app.post('/pesanan', …)` tanpa pemeriksaan kunci · `POST` yang menaikkan nomor urut tiap panggilan · retry otomatis di klien tanpa kunci · `Idempotency-Key` dibaca tapi tidak disimpan |
| **Yang diajarkan (verbatim)** | RFC 9110 **§9.2.2**: idempotent berarti *"the request can be repeated automatically if a communication failure occurs before the client is able to read the server's response"*. **`Idempotency-Key`** = jawaban untuk `POST`: klien mengirim kunci unik; server menyimpan hasil **kunci pertama** dan mengembalikan hasil yang sama untuk kunci yang sama. |
| **Latihan inspeksi (TELUSUR)** | Satu pesanan jadi **dua** di database. Klien timeout, lalu retry. **Tidak ada error** di mana pun. Cari sebabnya. |
| **Bukti empiris (terverifikasi 29 Sep 2026, Node v22.22.2)** | `Jumlah pesanan di database : 2` · `Isi : [{"id":1,"item":"Buku Laporan"},{"id":2,"item":"Buku Laporan"}]` · `Error yang muncul : TIDAK ADA` · → *"Klien melihat 1 pesanan. Database berisi 2."* |
| **Miskonsepsi** | ❌ *"Klien saya tidak retry."* → Browser, `fetch` dengan retry library, proxy, dan load balancer **retry sendiri**. Kamu tidak mengendalikannya. ❌ *"Timeout berarti gagal."* → Timeout berarti **tidak tahu**. Bisa berhasil, bisa gagal. Itu justru masalahnya. ❌ *"Kunci idempotency itu fitur Stripe."* → Ia **pola**, bukan fitur vendor. Stripe mempopulerkannya; siapa pun bisa menerapkannya. |
| **Kriteria lulus** | Bisa menjelaskan **kenapa timeout ≠ gagal**, dan menyebut **`Idempotency-Key`** sebagai jawabannya — termasuk **apa yang harus disimpan server** (kunci → hasil). |
| **Sumber** | **RFC 9110 §9.2.2** (verbatim) · Microsoft Azure REST Guidelines (retry guidance) · Stripe API (Idempotent requests) |

> **Uang nyata:** kalau ini terjadi pada **pembayaran SPP**, satu pembayaran tercatat dua
> kali. Ini contoh paling jelas kenapa Unit 11 tidak bisa dilewati.

---

### Unit 12 — Caching: RFC 9111 ⭐⭐

| | |
|---|---|
| **Konsep** | Cache membuat API **cepat** — dan membuat klien melihat **data lama**. Keduanya dari mekanisme yang sama. Yang membedakan hanya **directive**-nya. |
| **Kode yang dikenali** | `res.json(data)` tanpa header cache apa pun · `Cache-Control: public, max-age=86400` untuk data pribadi 🔴 · `ETag` tidak dikirim · `If-None-Match` tidak pernah diperiksa · `no-store` tidak dipakai untuk data sensitif |
| **Yang diajarkan (verbatim)** | **RFC 9111 §5.2** — *response directives*: `max-age` (detik) · `s-maxage` (khusus cache bersama) · `must-revalidate` · `no-cache` · `no-store` · `private` · `public`. 🔴 **`no-store` §5.2.2.5 verbatim:** *"The no-store response directive indicates that a cache MUST NOT store any part of either the immediate request or the response and MUST NOT use the response to satisfy any other request."* ⚠️ **Dan RFC-nya sendiri jujur:** *"This directive is not a reliable or sufficient mechanism for ensuring privacy."* **`ETag`** (RFC 9110 §8.8.3) + **`If-None-Match`** → `304 Not Modified` (kirim ulang tanpa body). |
| **Yang harus dipahami** | `GET /siswa` (daftar umum) **boleh** di-cache. `GET /nilai-saya` (data pribadi) **tidak boleh** di-cache bersama — kalau salah, **siswa lain bisa melihatnya**. |
| **Latihan inspeksi (TELUSUR)** | Klien melihat **data lama** setelah diubah. **Tidak ada error.** Cari sebabnya — lalu tentukan directive yang benar. |
| **Bukti empiris (terverifikasi 29 Sep 2026, Node v22.22.2)** | `Permintaan 1 (umur 0s)  → dari database: {"nilai":70}` · `(guru mengubah nilai 70 → 95 di database)` · `Permintaan 2 (umur 30s) → dari cache: {"nilai":70}` · `Nilai sebenarnya di database : 95` · `Error yang muncul : TIDAK ADA` |
| **Miskonsepsi** | ❌ *"Cache itu urusan browser, bukan API."* → **Header cache dikirim API.** Kalau API tidak mengirim apa pun, browser & proxy **menebak** — dan tebakan itu berbeda-beda. ❌ *"`no-cache` berarti tidak menyimpan."* → `no-cache` **boleh menyimpan**, tapi wajib **memvalidasi ulang**. Yang tidak menyimpan adalah **`no-store`**. Dua hal berbeda, sering tertukar. ❌ *"Data pribadi aman karena URL-nya beda."* → Cache bersama (proxy, CDN) berkunci pada **URL**, bukan pada **siapa yang meminta** — kecuali kamu menulis `private`. |
| **Kriteria lulus** | Bisa membedakan **`no-cache` dan `no-store`**, dan menyebut **directive** yang benar untuk data pribadi. |
| **Sumber** | **RFC 9111 §5.2** (verbatim) · RFC 9110 §8.8.3 (`ETag`) |

> **Ini unit yang paling mahal** dan **paling kosong** di materi repo ini sebelum skill
> dibuat (audit 28 Sep 2026: `Cache-Control`/`ETag` = **0 kemunculan**).

---

### Unit 13 — Rate limiting & throttling ⭐

| | |
|---|---|
| **Konsep** | Membatasi berapa banyak permintaan yang diterima. Bedanya: **rate limiting** = batas **per waktu** (10 permintaan/detik). **Throttling** = **melambatkan**, bukan menolak — permintaan tetap dilayani, hanya lebih lambat. |
| **Kode yang dikenali** | `res.status(429)` tanpa `Retry-After` · `Retry-After` dikirim tapi klien mengabaikan · batas dihitung per **IP** padahal butuh per **pengguna** · tidak ada header `RateLimit-*` |
| **Yang diajarkan (verbatim)** | **RFC 6585 §4**: *"The 429 status code indicates that the user has sent too many requests in a given amount of time ('rate limiting')."* + *"The response representations SHOULD include details explaining the condition, and MAY include a Retry-After header indicating how long to wait before making a new request."* ➕ **Fakta bonus yang sering terlewat:** *"Responses with the 429 status code MUST NOT be stored by a cache."* 🔴 **Beda throttling vs rate limiting** — dan kenapa klien **harus** tahu bedanya: pada throttling, ia **tidak boleh** menyerah; pada rate limiting, ia **harus menunggu**. |
| **Latihan inspeksi (TELUSUR)** | Klien menembak terus saat dibatasi → makin parah. **Tidak ada error**, hanya `429` berulang. Cari sebabnya. |
| **Bukti empiris (terverifikasi 29 Sep 2026, Node v22.22.2)** | `0s: 200` … `0.4s: 200` · `0.5s: 429 (Retry-After: 30)` · `0.6s: 429 (Retry-After: 30)` · `0.7s: 429 (Retry-After: 30)` · `Jumlah 429 diterima : 3` · `Error yang muncul : TIDAK ADA (hanya 429 berulang)` |
| **Miskonsepsi** | ❌ *"`429` itu `503` versi lain."* → `503` = **server sedang tidak bisa**. `429` = **kamu terlalu sering**. Yang pertama bukan salahmu, yang kedua salahmu. ❌ *"`Retry-After` opsional, jadi tidak perlu."* → `MAY` di RFC = **boleh**. Tapi tanpa itu, klien menebak — dan tebakan yang terlalu cepat **memperparah** pembatasan. ❌ *"Throttling sama dengan rate limiting."* → Beda, dan bedanya **mengubah perilaku klien yang benar**. |
| **Kriteria lulus** | Bisa menjelaskan **kenapa `429` bukan `503`**, dan menyebut **`Retry-After`** sebagai cara klien tahu kapan boleh mencoba lagi. |
| **Sumber** | **RFC 6585 §4** (verbatim) · MDN *429 Too Many Requests* |

---

### Unit 14 — Versioning: kontrak yang berubah

| | |
|---|---|
| **Konsep** | Suatu saat kontrak **harus** berubah. Versioning = cara mengubah **tanpa memecahkan** klien yang sudah ada. |
| **Kode yang dikenali** | `/v1/siswa` (versi di path) · `/siswa?api-version=2024-01-01` · `/siswa` dengan header `X-Api-Version` · tidak ada versi sama sekali · `/v2/` di mana `v1` sudah dihapus 🔴 |
| **Yang diajarkan (verbatim + 2 konvensi)** | **(a) Microsoft** — *"DO NOT include a version number segment in any operation path"* → wajib `?api-version=YYYY-MM-DD` (versi = **tanggal**). **(b) Umum** — `/v1/` di path; sederhana, terlihat, mudah di-route. **Keduanya sah.** Kapan masing-masing masuk akal: `/v1/` untuk API publik yang jarang berubah; `?api-version=` untuk API yang berubah **per tanggal** dan butuh versi per-operasi. |
| **Latihan inspeksi (KLAIM)** | Diberi **satu perubahan breaking**. **Putuskan** gaya versioning-nya, dan **sebut apa yang rusak** di tiap pilihan. |
| **Miskonsepsi** | ❌ *"Tidak perlu versi, kami belum punya klien lain."* → Hari ini belum. Kontrak dibuat **untuk besok**. ❌ *"Versi di path itu paling benar."* → Ia **salah satu** yang benar. Microsoft **melarangnya** — dan punya alasan (routing, cache, dan jumlah versi yang meledak). ❌ *"Versi baru berarti versi lama bisa dihapus."* → Versi lama hanya boleh dihapus setelah **deprecation** (Unit 15). |
| **Kriteria lulus** | Bisa menyebut **dua gaya versioning**, **satu kelebihan & satu kekurangan** masing-masing, dan menyebut satu hal yang **rusak** saat versi dinaikkan. |
| **Sumber** | **Microsoft Azure REST API Guidelines §Versioning** (verbatim) · Google AIP-185 |

> **Unit 10, 11, 12, 13 adalah inti Bagian ini** — keempatnya **gagal tanpa error**.
> Unit 12 adalah **yang paling mahal** (data basi ke pengguna) dan **yang paling kosong**
> di materi repo ini sebelum skill dibuat.

### → GERBANG 3 — Temukan kegagalan senyap

**Tiga bagian, semua harus lulus:**

**(a) Statis.** Diberi spesifikasi API hasil AI. Sebut **dua unit** Bagian 2 yang dilanggar.

**(b) Dinamis (TELUSUR).** Diberi kode yang **sudah dijalankan**, hasilnya salah,
**tanpa pesan error** — dari Unit 10, 11, atau 12.
`hasil.md` harus memuat **minimal dua dugaan tertulis** — salah satunya boleh salah.

**(c) Keputusan.** Untuk **satu** masalah: tulis `klaim → bukti → risiko → keputusan`.
**Sebut biaya** dari keputusan itu.

**Lulus kalau (b) menunjuk penyebab yang benar, dan (c) menyebut biaya.**

---

## BAGIAN 3 — MENGELOLA KONTRAK (Unit 15–18) · **opsional**

> ⚠️ **Bukan lanjutan wajib.** Kalau Bagian 0–2 belum lulus, bagian ini terasa seperti
> menebak — karena keputusannya **tidak bisa dibantah** tanpa bukti dari Bagian 2.

**Korpus:** satu spesifikasi API lebih besar (250–400 baris, dengan dokumentasi).
**Alat:** Terminal + Node.js + `node:test`.

---

### Unit 15 — Deprecation & `Sunset`

| | |
|---|---|
| **Konsep** | Menghapus endpoint tanpa memberi tahu klien = **memecahkan mereka tanpa peringatan**. Deprecation = memberi tahu **sebelum** mematikan. |
| **Kode yang dikenali** | `res.setHeader('Deprecation', 'true')` · `Sunset: Sat, 31 Dec 2018 23:59:59 GMT` · `Link: <…>; rel="sunset"` · versi lama dihapus langsung tanpa header apa pun 🔴 |
| **Yang diajarkan (verbatim)** | **RFC 8594 §3**: *"The Sunset HTTP response header field allows a server to communicate the fact that a resource is expected to become unresponsive at a specific point in time."* Formatnya **tanggal HTTP** (`Sat, 31 Dec 2018 23:59:59 GMT`). Ditambah **link relation `sunset`** untuk menunjuk penjelasan. |
| **Latihan inspeksi (KLAIM)** | Klaim tertulis: *"API lama masih bisa dipakai."* → **Verifikasi.** Apakah klien **bisa tahu** kapan ia akan berhenti? Kalau tidak, klaimnya **benar hari ini dan menyesatkan besok**. |
| **Miskonsepsi** | ❌ *"Kirim email ke klien sudah cukup."* → Kalau kliennya **program**, ia tidak membaca email. Ia membaca **header**. ❌ *"`Sunset` berarti endpoint langsung mati."* → Ia **mengumumkan** kapan akan mati. Kalau sudah mati, headernya tidak akan pernah terkirim. ❌ *"Deprecation itu cukup dicatat di changelog."* → Changelog dibaca **manusia**. Header dibaca **mesin**. |
| **Kriteria lulus** | Bisa menyebut **`Sunset`** sebagai cara **mesin** tahu kapan berhenti, dan menyebut satu hal yang **tidak** bisa dilakukan klien tanpa header itu. |
| **Sumber** | **RFC 8594 §3** (verbatim) |

---

### Unit 16 — OpenAPI: kontrak sebagai file

| | |
|---|---|
| **Konsep** | Kontrak yang **bisa dibaca mesin** — dari satu file, bisa dibuat dokumentasi, SDK, dan tes. |
| **Kode yang dikenali** | `openapi.yaml` · `openapi: 3.1.0` · `info:` · `paths:` · `components:` · `webhooks:` · spec yang **tidak sinkron** dengan kode 🔴 · endpoint ada di kode tapi tidak di spec |
| **Yang diajarkan** | **OpenAPI 3.1.0** (15 Feb 2021). Root **wajib** `openapi` (versi) + `info`. Minimal **satu** dari `paths` / `components` / `webhooks`. `paths` berisi path **relatif** (dimulai `/`); tiap path punya **Operation** (aksi pada path itu: `get`, `post`, …). |
| **Latihan inspeksi (TELUSUR)** | Diberi satu file OpenAPI hasil AI. **Sebut satu endpoint yang ada di KODE tapi TIDAK ada di spec** — atau sebaliknya. Kegagalan ini **senyap**: tidak ada yang error, tapi klien yang dibuat dari spec akan **salah**. |
| **Miskonsepsi** | ❌ *"Spec bisa ditulis setelah kode selesai."* → Bisa — tapi spec yang **ditulis belakangan** cenderung **menggambarkan yang diinginkan**, bukan **yang sebenarnya**. Ia jadi iklan, bukan kontrak. ❌ *"OpenAPI itu dokumentasi."* → Ia **kontrak mesin** yang **kebetulan** bisa jadi dokumentasi. Beda arah. ❌ *"Spec dan kode tidak akan pernah beda."* → Mereka akan beda, kecuali ada tes yang membandingkannya. |
| **Kriteria lulus** | Bisa menemukan **satu ketidaksinkronan** antara spec dan kode, dan menjelaskan **siapa yang dirugikan** olehnya. |
| **Sumber** | **OpenAPI Specification 3.1.0** |

---

### Unit 17 — REST vs GraphQL vs RPC — memilih gaya ⭐

| | |
|---|---|
| **Konsep** | Tiga cara berbeda membentuk antarmuka. Bukan soal mana yang "modern", tapi **apa yang dikorbankan**. |
| **Kode yang dikenali** | `GET /siswa/123/nilai` (REST) · `POST /graphql` dengan `query { siswa(id:123){nilai} }` · `POST /rpc/getStudentGrades` · `service SiswaService { rpc GetNilai(...) }` (gRPC) |
| **Yang diajarkan** | **REST** = resource + method HTTP; **cache HTTP bekerja otomatis**, tapi klien sering menerima **lebih banyak** dari yang perlu. **GraphQL** = satu endpoint, klien memilih field; efisien untuk UI kompleks, tapi ⚠️ klien bisa meminta **query mahal** — satu request bisa jadi **N+1** di server. **RPC/gRPC** = memanggil fungsi; kontrak ketat, tapi **tidak** memanfaatkan cache HTTP. |
| **Latihan inspeksi (KLAIM)** | Diberi **3 skenario** (laporan sekolah sederhana · aplikasi mobile dengan banyak layar · layanan internal antar-server). **Pilih gaya** untuk masing-masing, dan sebut **apa yang dikorbankan**. |
| **Miskonsepsi** | ❌ *"GraphQL selalu lebih baik karena tidak over-fetching."* → Ia memindahkan masalahnya: dari **jaringan** ke **server**. Query mahal kini datang dari klien. (OWASP API4: *Unrestricted Resource Consumption*.) ❌ *"REST sudah kuno."* → Ia **cocok** untuk laporan sekolah: sederhana, cache-nya jalan, kliennya sedikit. ❌ *"gRPC untuk semuanya."* → Browser tidak memanggil gRPC langsung. ❌ *"Pilih satu dan pakai selamanya."* → Boleh dicampur — tapi **jangan** di satu resource yang sama. |
| **Kriteria lulus** | Bisa memilih gaya untuk **laporan sekolah** dan **menyebut alasannya** — termasuk satu hal yang **dikorbankan**. |
| **Sumber** | OpenAPI 3.1.0 · `16-komunikasi-protokol.md` §323, §530 · OWASP API Security Top 10 2023 (API4) |

---

### Unit 18 — Review kontrak & keputusan

| | |
|---|---|
| **Konsep** | Menutup lingkaran: kembali ke Unit 1 (API = kontrak) — tapi sekarang bisa **membaca**, **menemukan yang gagal senyap**, dan **memutuskan** dengan alasan. |
| **Bentuk review** | **klaim → bukti → risiko → keputusan** |
| **Yang diajarkan** | (a) Review yang baik **bisa dibantah** — ia menyebut bukti, bukan selera. (b) **Menolak perubahan yang "lebih bersih"** karena memecahkan klien = **keputusan yang sah**. (c) Perubahan breaking harus lewat **deprecation** (Unit 15), bukan diumumkan mendadak. |
| **Latihan inspeksi (KLAIM)** | Tulis **review lengkap** atas satu spesifikasi: satu klaim, satu bukti, satu risiko, **terima/tolak + alasan**. |
| **Miskonsepsi** | ❌ *"Kode yang lebih bersih selalu lebih baik."* → Kalau ia memecahkan 40 klien, ia **lebih buruk**. Kebersihan internal bukan alasan untuk melanggar kontrak. ❌ *"Review = daftar masalah."* → Review = **keputusan**. Daftar masalah tanpa keputusan bukan review. ❌ *"Menolak itu berarti tidak bisa bekerja sama."* → **Menolak dengan alasan** adalah bentuk kerja sama yang paling mahal. |
| **Kriteria lulus** | Review memuat **keempatnya**, dan **keputusannya punya alasan**. **Menolak dengan alasan = lulus.** Menerima tanpa alasan = **gagal**. |
| **Sumber** | RFC 8594 (deprecation) · Microsoft Azure REST Guidelines (breaking-change rules) · OWASP API Security Top 10 2023 |

> **Unit 18 menutup lingkaran.** Pembelajar kembali ke Unit 1 — tapi sekarang bisa
> **membaca** kontraknya, **menemukan** yang gagal senyap, dan **memutuskan** dengan
> alasan. Itu definisi SELESAI.

### → GERBANG 4 — Review yang bisa dibantah

Diberi **satu spesifikasi API hasil AI** (± 300 baris) yang belum pernah dilihat.

Tulis review berisi **keempatnya**: **Klaim · Bukti · Risiko · Keputusan + alasan**.
**Menolak dengan alasan = lulus.** Menerima tanpa alasan = gagal.

---

## Ringkasan miskonsepsi — yang paling sering muncul

| # | Miskonsepsi | Koreksinya |
|---|---|---|
| 1 | *"Nama parameter cuma detail kecil."* | Nama parameter **adalah** kontrak (Unit 1, 8) |
| 2 | *"`GET` pasti aman."* | Niatnya baca; kodenya bisa mengubah (Unit 4) |
| 3 | *"DELETE tidak idempotent karena kali kedua 404."* | Idempotent = **efek di server**, bukan status balasan (Unit 4) |
| 4 | *"`200` dengan `{error}` itu tidak masalah."* | Status yang berbohong membuat klien salah bertindak (Unit 5) |
| 5 | *"`400` dan `422` sama."* | `400` bentuk salah; `422` isi tidak bisa diproses (Unit 5) |
| 6 | *"`429` ada di RFC 9110."* | Ia dari **RFC 6585 §4** (Unit 5, 13) |
| 7 | *"Body terlihat JSON, berarti JSON."* | Tanpa `Content-Type`, klien menebak (Unit 6) |
| 8 | *"Envelope itu ribet tanpa guna."* | Tanpa envelope, tidak ada tempat untuk metadata (Unit 7) |
| 9 | *"Klien bisa baca `message` error."* | `message` untuk manusia; mesin butuh `type` (Unit 9) |
| 10 | *"Offset itu cara standar."* | Tiga pedoman resmi memilih kursor (Unit 10) |
| 11 | *"Timeout berarti gagal."* | Timeout berarti **tidak tahu** (Unit 11) |
| 12 | *"Klien saya tidak retry."* | Proxy & library retry sendiri (Unit 11) |
| 13 | *"Cache itu urusan browser."* | Header cache **dikirim API** (Unit 12) |
| 14 | *"`no-cache` berarti tidak menyimpan."* | Yang tidak menyimpan adalah **`no-store`** (Unit 12) |
| 15 | *"`429` sama dengan `503`."* | `503` bukan salahmu; `429` kamu terlalu sering (Unit 13) |
| 16 | *"Tidak perlu versi, belum ada klien lain."* | Kontrak dibuat **untuk besok** (Unit 14) |
| 17 | *"GraphQL selalu lebih baik."* | Ia memindahkan beban ke server (Unit 17) |
| 18 | *"Kode lebih bersih selalu lebih baik."* | Kalau memecahkan klien, ia lebih buruk (Unit 18) |

---

## Batas kejujuran

- **Pemecahan 4 bagian / 18 unit ini BELUM DIUJI.** Tidak ada yang menjalankannya.
  Perkiraan **± 24 sesi** adalah **hitungan**, bukan pengalaman.
- **Angka & perilaku di unit 4, 10, 11, 12, 13 diverifikasi dengan menjalankan kode**
  (Node v22.22.2, 29 Sep 2026) — bukan dari ingatan. Kalau Node berubah, periksa ulang.
- **Tiga gaya pagination & dua gaya versioning itu bertentangan.** Itu **fakta**, bukan
  kelalaian. Skill ini **tidak** memilih satu sebagai "yang benar" — ia mengajarkan
  **memilih dengan alasan**.
- **Tidak ada dasar riset pedagogis khusus API design** yang terkumpul. Yang dipakai:
  PRIMM, Parsons, ambang 50% tracing (Lister et al. 2004) — sama seperti skill lain,
  **tapi belum diuji untuk topik ini**.
- **Tingkat "⭐" adalah penilaian**, bukan hasil pengukuran kesulitan.

---

**📅 Dibuat:** 29 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `korpus-ai.md` ·
`sintaks-http-api.md` · `cakupan-vs-dokumen-resmi.md`
