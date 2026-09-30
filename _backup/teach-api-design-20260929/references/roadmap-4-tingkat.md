# Roadmap 4 Bagian / 18 Unit — API Design Mode Inspeksi

> Skill: **`teach-api-design`** · dibuat **29 September 2026**
> Bentuk mengikuti 5 skill `teach-*` lain: **4 bagian · 18 unit · 4 gerbang**.

---

## 0. Prinsip yang mengikat

1. **Bagian 0 (apa itu kontrak) adalah PRASYARAT.** Tidak boleh dilewati.
2. **Satu konsep per sesi.** Sesi 1 jam = 6 tahap
   (`PREDIKSI → JALANKAN → BEDAH → UBAH → PERBAIKI → CATAT`).
3. **Tebakan ditulis di `prediksi.md` SEBELUM kode dijalankan.** Diperiksa lewat timestamp.
4. **Gerbang gagal = ulangi bagian itu**, bukan lanjut.
5. **Korpus WAJIB kode hasil generate AI** — dipakai apa adanya, tidak dirapikan.
6. **Bagian 3 (Unit 15–18) opsional** — baru berguna setelah Bagian 0–2 lulus.
7. **JANGAN mengajarkan OAuth / JWT / API Gateway / Microservices / Webhook di sini.**
   Keempatnya milik `/teach-system-design`. Lihat §6.
8. **JANGAN mengajarkan `fetch`/React/Express di sini.** Itu `/teach-nodejs` & `/teach-react`.
   Skill ini mengajarkan **kontraknya**, bukan **kodenya**.
9. **Setiap klaim menyebut sumber** (RFC / spesifikasi / pedoman resmi). Bukan blog.
10. **Verifikasi empiris sebelum menulis angka atau perilaku.** Pernah salah sekali
    (hitungan prima 148933 → 348513). Jalankan, jangan ingat.
11. **Tiga gaya berbeda itu SAH semua.** Pagination punya 3 gaya resmi yang saling
    bertentangan (AIP-158 · Microsoft `nextLink` · Stripe cursor). Yang diajarkan:
    **memilih dengan alasan**, bukan "yang benar cuma satu".

---

## 1. BAGIAN 0 — API ITU KONTRAK (Unit 1–3)

**Yang dilatih:** menyadari bahwa API adalah **janji ke pihak yang tidak dikenal** —
sebelum menyentuh HTTP.
**Korpus:** satu file spesifikasi API hasil AI (Markdown/JSON), 20–40 baris.
**Prasyarat:** `teach-javascript` Unit 1–8.
**Alat:** Terminal + Node.js.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 1 | **API = kontrak, bukan kode** | Kode bisa diubah tanpa izin siapa pun. Kontrak **tidak** — ada pihak lain yang sudah menulis kode terhadapnya. Kenapa ini mengubah segalanya | Diberi satu perubahan pada API. **Sebut siapa saja** yang harus ikut berubah — di luar tim sendiri | RFC 9110 §1 (HTTP sebagai *"generic interface, extensible semantics"*) |
| 2 | **Resource & endpoint — cara menamai** | Resource = **kata benda**, bukan kata kerja. `GET /siswa/123`, bukan `GET /ambilSiswa?id=123`. Kenapa plural konsisten itu penting | Diberi 6 endpoint hasil AI. **Sebut mana yang menamai aksi**, bukan resource | Google AIP-122 (Resource Names) · `16-komunikasi-protokol.md` §363 |
| 3 | **Siapa pembaca kontrak ini** | Tiga pembaca berbeda: **klien** (kode orang lain) · **manusia** (dokumentasi) · **mesin** (OpenAPI). Kontrak yang baik melayani ketiganya | Diberi satu endpoint. **Sebut** apa yang tidak bisa diketahui pembaca hanya dari namanya | OpenAPI 3.1.0 · RFC 9110 §1 |

### → GERBANG 1 — Kenali kontrak yang buruk, tanpa solusi

Diberi **satu spesifikasi API hasil AI** (± 40 baris) yang belum pernah dilihat.

**Tanpa menulis kode**, tuliskan:

1. **Berapa endpoint** yang menamai **aksi** alih-alih resource — sebutkan
2. **Satu hal** yang tidak bisa diketahui pembaca tanpa bertanya ke penulisnya
3. **Satu kalimat:** kenapa ini berbahaya bagi klien yang sudah jadi

**Lulus kalau poin 1 dan 3 benar.**
Gerbang ini **sengaja tidak meminta solusi** — solusi baru ada di Bagian 1–2.

---

## 2. BAGIAN 1 — KOSAKATA HTTP (Unit 4–8)

**Yang dilatih:** membaca HTTP sebagai **bahasa kontrak**, bukan sekadar cara mengirim data.
**Korpus:** satu file server hasil AI (30–80 baris) dengan routing.
**Alat:** Terminal + Node.js.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 4 | **Methods — safe & idempotent** ⭐ | Verbatim RFC 9110 §9.2.1: *"Request methods are considered 'safe' if their defined semantics are essentially read-only"* → **GET, HEAD, OPTIONS, TRACE**. §9.2.2: *"A request method is considered 'idempotent' if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request"* → **PUT, DELETE, dan semua yang safe** | **TELUSUR:** klien memanggil endpoint "lihat data" berkali-kali, dan data **berubah**. Cari sebabnya — **tidak ada error** | RFC 9110 §9.2.1, §9.2.2 (verbatim) · MDN *HTTP request methods* |
| 5 | **Status codes — bahasa hasil** | Kelas `1xx`–`5xx` dari RFC 9110 §15. 🔴 **Yang sering salah:** `429 Too Many Requests` **TIDAK ada di RFC 9110** — ia dari **RFC 6585 §4**. Dan RFC 9110 menamai `422` **"Unprocessable Content"** (bukan "Entity") | Diberi 5 situasi. Prediksi status code-nya, lalu buktikan. **Sebut mana yang bukan dari RFC 9110** | RFC 9110 §15 (TOC lengkap) · **RFC 6585 §4** (429) |
| 6 | **Header & `Content-Type`** | Header = metadata kontrak. `Content-Type` (apa isinya) vs `Accept` (apa yang klien mau). Kenapa `application/problem+json` itu **media type sendiri** | KLAIM: *"endpoint ini selalu mengembalikan JSON"* → verifikasi (cek header, bukan body) | RFC 9110 §8 · RFC 9457 §3 |
| 7 | **Bentuk response — data vs envelope** | Dua gaya sah: **data langsung** (`[{...}]`) vs **envelope** (`{ "value": [...] }`). Microsoft **mewajibkan** envelope; banyak API populer tidak. Kenapa envelope lebih mudah diubah nanti | Diberi dua bentuk response. **Putuskan** mana yang lebih mudah ditambah metadata — dan sebut biayanya | Microsoft Azure REST Guidelines §Pagination · Stripe API (`object`/`data`) |
| 8 | **Query parameter: filter, sort, pilih field** | `?filter=` · `?orderby=` · `?select=`. Kenapa **nama parameter itu sendiri** bagian dari kontrak. ⚠️ Azure memakai **tanpa `$`**; OData memakai `$` — dua konvensi sah | Diberi satu endpoint list. **Sebut** parameter mana yang akan **mustahil diubah** setelah klien memakainya | Microsoft Azure REST Guidelines §Query options |

### → GERBANG 2 — Baca HTTP sebagai kontrak

Diberi **satu file server hasil AI** (± 60 baris) dengan **dua masalah kontrak**.

1. Sebut **unit mana** yang dilanggar di tiap masalah
2. **Perbaiki satu** — cukup satu
3. Jelaskan: *"perbaikan ini memecahkan klien lama atau tidak?"* — jujur

**Lulus kalau poin 1 benar dan poin 3 menyebut dampak ke klien lama.**
Perbaikan yang mengaku "lebih baik dan tetap kompatibel" = **gagal**.

---

## 3. BAGIAN 2 — DESAIN YANG TIDAK MENYAKITKAN (Unit 9–14) · **INTI**

**Yang dilatih:** enam masalah yang **muncul berbulan-bulan kemudian** — semuanya
**gagal senyap**.
**Korpus:** satu proyek kecil hasil AI (3–5 file, 150–250 baris).
**Alat:** Terminal + Node.js + **`node:test`** (bawaan, tanpa instalasi).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 9 | **Error handling — RFC 9457** ⭐ | Verbatim RFC 9457: *"defines a 'problem detail' to carry machine-readable details of errors in HTTP response content to avoid the need to define new error response formats for HTTP APIs"*. Lima anggota: **`type` · `title` · `status` · `detail` · `instance`**; media type `application/problem+json`. RFC 9457 **menggantikan RFC 7807** | **TELUSUR:** klien tidak bisa membedakan "stok habis" dari "server mati" — keduanya `500` dengan `{"error":"failed"}`. Cari sebabnya | **RFC 9457** (verbatim) · Microsoft error response format |
| 10 | **Pagination — 3 gaya sah** ⭐⭐ | **Tiga gaya resmi yang saling bertentangan:** (a) **AIP-158** — `page_size` + `page_token` **opaque**, *"Page tokens provided by APIs must be opaque (but URL-safe) strings, and must not be user-parseable"*; (b) **Microsoft** — `nextLink` **URL absolut**; (c) **Stripe** — `starting_after`/`ending_before` (cursor = **ID objek**). 🔴 **Bahaya offset:** data baru masuk → baris **terlewat DAN duplikat**, tanpa error | **TELUSUR:** daftar 10 item, 2 data baru masuk, halaman 2 diambil → **2 baris hilang, 2 baris dobel**. Tidak ada error. Cari sebabnya | **AIP-158** (verbatim) · Microsoft Azure REST Guidelines · Stripe API Pagination |
| 11 | **Idempotency & retry** ⭐ | Verbatim RFC 9110 §9.2.2: *"the request can be repeated automatically if a communication failure occurs before the client is able to read the server's response"*. **Idempotency-Key** = jawaban untuk `POST` yang tidak idempotent. Kenapa klien **selalu** retry `POST` saat timeout | **TELUSUR:** satu pesanan jadi **dua** di database. Klien timeout lalu retry. Tidak ada error | RFC 9110 §9.2.2 · Microsoft (retry guidance) |
| 12 | **Caching — RFC 9111** ⭐⭐ | `Cache-Control` (RFC 9111 §5.2): **response directives** `max-age` · `must-revalidate` · `no-store` · `private` · `public` · `s-maxage`. `ETag` (RFC 9110 §8.8.3) + `If-None-Match` → `304 Not Modified`. 🔴 **`no-store` verbatim:** *"a cache MUST NOT store any part of either the immediate request or the response"*. Kenapa `GET /siswa` boleh di-cache tapi `GET /nilai-saya` **tidak** | **TELUSUR:** klien melihat **data lama** setelah diubah. Tidak ada error. Cari sebabnya — lalu tentukan directive yang benar | **RFC 9111 §5.2** (verbatim) · RFC 9110 §8.8.3 |
| 13 | **Rate limiting & throttling** ⭐ | **429** dari **RFC 6585 §4**: *"The 429 status code indicates that the user has sent too many requests in a given amount of time ('rate limiting')"* + *"MAY include a `Retry-After` header indicating how long to wait"*. 🔴 **Beda throttling vs rate limiting** — dan kenapa klien **harus** tahu bedanya | **TELUSUR:** klien menembak terus saat dibatasi, makin parah. Cari sebabnya — **tidak ada error**, hanya `429` berulang | **RFC 6585 §4** (verbatim) · MDN *429* |
| 14 | **Versioning — kontrak yang berubah** | **Dua konvensi sah & bertentangan:** (a) **Microsoft** — *"DO NOT include a version number segment in any operation path"* → wajib `?api-version=YYYY-MM-DD`; (b) **umum** — `/v1/` di path. Kapan masing-masing masuk akal | Diberi satu perubahan breaking. **Putuskan** gaya versioning-nya, dan **sebut apa yang rusak** di tiap pilihan | **Microsoft Azure REST Guidelines §Versioning** (verbatim) · AIP-185 |

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

## 4. BAGIAN 3 — MENGELOLA KONTRAK (Unit 15–18) · **opsional**

> ⚠️ **Bukan lanjutan wajib.** Kalau Bagian 0–2 belum lulus, bagian ini terasa seperti menebak.

**Korpus:** satu spesifikasi API lebih besar (250–400 baris, dengan dokumentasi).
**Alat:** Terminal + Node.js + `node:test`.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 15 | **Deprecation & `Sunset`** | **RFC 8594 §3**: *"The Sunset HTTP response header field allows a server to communicate the fact that a resource is expected to become unresponsive at a specific point in time."* Format: `Sunset: Sat, 31 Dec 2018 23:59:59 GMT`. + link relation `sunset` untuk penjelasan | KLAIM: *"API lama masih bisa dipakai"* → verifikasi. Apakah klien **bisa tahu** kapan berhenti? | **RFC 8594 §3** (verbatim) |
| 16 | **OpenAPI — kontrak sebagai file** | **OpenAPI 3.1.0** (15 Feb 2021). Root **wajib** `openapi` + `info`; minimal satu dari `paths` / `components` / `webhooks`. `paths` = path relatif, `Operation` = aksi di satu path | Diberi satu file OpenAPI hasil AI. **Sebut satu endpoint yang ada di kode tapi TIDAK ada di spec** — atau sebaliknya | **OpenAPI Specification 3.1.0** |
| 17 | **REST vs GraphQL vs RPC — memilih gaya** ⭐ | **REST** = resource + method HTTP · **GraphQL** = satu endpoint, klien memilih field · **gRPC/RPC** = memanggil fungsi. ⚠️ Bahaya GraphQL: klien bisa meminta **query mahal** — satu request bisa jadi N+1 | Diberi 3 skenario. **Pilih gaya** untuk masing-masing, dan sebut **apa yang dikorbankan** | OpenAPI 3.1.0 · `16-komunikasi-protokol.md` §323, §530 · OWASP API4 (Unrestricted Resource Consumption) |
| 18 | **Review kontrak & keputusan** | Bentuk review: **klaim → bukti → risiko → keputusan**. Kapan **menolak** perubahan yang "lebih bersih" karena memecahkan klien | Tulis **review lengkap**: satu klaim, satu bukti, satu risiko, **terima/tolak + alasan** | RFC 8594 (deprecation) · Microsoft (breaking-change rules) · OWASP API Top 10 2023 |

> **Unit 18 menutup lingkaran.** Pembelajar kembali ke Unit 1 (API = kontrak) — tapi
> sekarang bisa **membaca** kontraknya, **menemukan** yang gagal senyap, dan
> **memutuskan** dengan alasan. Itu definisi SELESAI.

### → GERBANG 4 — Review yang bisa dibantah

Diberi **satu spesifikasi API hasil AI** (± 300 baris) yang belum pernah dilihat.

Tulis review berisi **keempatnya**: **Klaim · Bukti · Risiko · Keputusan + alasan**.
**Menolak dengan alasan = lulus.** Menerima tanpa alasan = gagal.

---

## 5. Korpus

| Bagian | Korpus | Ukuran |
|---|---|---|
| 0 | Satu file spesifikasi API (Markdown/JSON) hasil AI | 20–40 baris |
| 1 | Satu file server hasil AI dengan routing | 30–80 baris |
| 2 | Satu proyek kecil (3–5 file) hasil AI | 150–250 baris |
| 3 | Satu spesifikasi API + dokumentasi hasil AI | 250–400 baris |

**Aturan:** kode AI **apa adanya**. Cacat yang dipilih **harus yang tidak kentara** —
kode harus **jalan, lulus tes, terlihat rapi**. Kalau cacatnya kelihatan dari membaca
sekilas, itu bukan latihan.

Detail persiapan: `korpus-ai.md`.

---

## 6. Batas dengan skill lain — JANGAN tumpang tindih

| Topik | Milik siapa | Di sini? |
|---|---|---|
| **OAuth 2.0 · JWT · Access Token · Authentication · Authorization** | `/teach-system-design` (`17-keamanan-sistem.md` §538, §602, §723, §889) | ❌ **sebut sebagai batas**, jangan ajarkan |
| **API Gateway · Microservices** | `/teach-system-design` (`fase-4` §01, §02) | ❌ jangan |
| **Webhooks** | `/teach-system-design` (`15-asynchronism.md` §461–599) | ❌ jangan |
| **Rate limiting *sebagai kapasitas sistem*** | `/teach-system-design` (`06-availability-patterns.md` §1205) | ⚠️ di sini hanya **sisi kontrak** (429 + `Retry-After`) |
| **Caching *infrastruktur* (Redis)** | `/teach-system-design` (`14-cache.md`) | ⚠️ di sini hanya **HTTP caching** (RFC 9111) |
| **`fetch` · React · Express · middleware** | `/teach-nodejs`, `/teach-react` | ❌ jangan |
| **SOLID · design patterns · TDD** | `/teach-software-design` | ❌ jangan |

**Aturan pembagian:** skill ini menjawab *"bagaimana **kontrak** antara pemanggil dan
penyedia ditetapkan?"* — **satuan: antarmuka**.
`teach-software-design` = **kode**. `teach-system-design` = **sistem**.
Tiga satuan berbeda; jangan dicampur.

---

## 7. Urutan sesi & verifikasi

```
PREDIKSI (10') → JALANKAN (5') → BEDAH (20') → UBAH (10') → PERBAIKI (10') → CATAT (5')
```

**Verifikasi urutan (wajib):**

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

Timestamp `prediksi.md` **harus lebih tua** daripada waktu kode dijalankan.
Kalau tidak → sesi diulang.

---

## 8. Aturan AI di skill ini

1. **Kode korpus dari AI** — boleh, itu justru syaratnya.
2. **Tebakan tidak boleh dari AI.** Pertanyaan ke AI **setelah** `prediksi.md` ditulis.
3. **Jangan menyerahkan penilaian kontrak ke AI.** *"Apakah kontrak ini aman diubah?"*
   adalah latihan intinya — kalau diserahkan, pelajarannya hilang.
4. **Sumber wajib disebut.** RFC / spesifikasi / pedoman resmi. Blog pribadi & artikel SEO
   **dilarang** — kecuali sebagai **contoh praktik industri**, dan harus disebut begitu.

---

## 9. Kalau berhenti di tengah

Normal. Yang **tidak** boleh: mengulang dari Unit 1.

| Berhenti di | Lanjutkan dengan |
|---|---|
| Unit 1–3 | ulangi latihan unit terakhir, lanjut |
| Unit 4–8 | langsung lanjut Bagian 2, tidak perlu mengulang |
| Unit 9–14 | selesaikan **Unit 12 (caching)** walau hasilnya jelek — itu yang paling mahal |
| Unit 15–18 | selesaikan Unit 18 walau review-nya jelek |

---

## 10. Batas kejujuran

- **Pemecahan 4 bagian / 18 unit ini BELUM DIUJI.** Tidak ada yang menjalankannya.
  Perkiraan **± 24 sesi** adalah **hitungan**, bukan pengalaman.
- **Belum ada dasar riset pedagogis khusus API design** yang terkumpul. Yang dipakai:
  PRIMM, Parsons, ambang 50% tracing (Lister et al. 2004) — sama seperti skill lain,
  tapi **belum diuji untuk topik ini**.
- **Tiga gaya pagination & dua gaya versioning itu bertentangan.** Itu **fakta**, bukan
  kelalaian. Skill ini **tidak** memilih satu sebagai "yang benar" — ia mengajarkan
  **memilih dengan alasan**.
- **OWASP API Top 10 dipakai sebagai daftar risiko**, bukan diajarkan satu per satu —
  itu materi `/teach-system-design`.
- **Angka & perilaku diverifikasi dengan menjalankan kode** (Node v22.22.2), bukan dari
  ingatan. Kalau nanti Node berubah, periksa ulang.

---

**📅 Dibuat:** 29 September 2026
**📚 Terkait:** `SKILL.md` · `peta-unit.md` · `korpus-ai.md` · `sintaks-http-api.md` ·
`cakupan-vs-dokumen-resmi.md`
