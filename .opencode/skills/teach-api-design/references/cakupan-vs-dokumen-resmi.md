# Cakupan vs Sumber Resmi — apakah materi ini selengkap sumber aslinya?

> Referensi untuk skill **`teach-api-design`**. **Tutor membaca file ini sendiri.**
>
> **Dibuat:** 29 September 2026 · **Audit dilakukan:** 29 September 2026
> **Kerangka asal:** `teach-software-design/references/cakupan-vs-dokumen-resmi.md`

---

## 1. Kenapa "selengkap sumber resmi" bukan target yang benar

Pertanyaan yang wajar: *"apakah materinya sudah selengkap RFC-nya / dokumentasi resminya?"*

Jawabannya: **tidak, dan memang tidak boleh.**

| | Sumber resmi | Kurikulum (skill ini) |
|---|---|---|
| Tujuan | **Referensi** — dipakai saat sudah tahu apa yang dicari | **Kurikulum** — berurutan, untuk orang yang belum tahu apa pun |
| Ukuran | RFC 9110: **10.785 baris** · RFC 9111: **2.400+ baris** · OpenAPI 3.1.0: **± 4.000 baris** | 18 unit, 4 gerbang |
| Bentuk | Spesifikasi lengkap (termasuk yang tidak akan pernah dipakai) | **Urutan kemampuan**, bukan urutan topik |
| Kalau tidak lengkap | **Cacat** — ada yang tidak bisa ditemukan | **Bukan cacat** — ia sengaja memilih |
| Yang penting | Kelengkapan | **Bisa dipakai** |

Kurikulum yang "lengkap" adalah kurikulum yang **tidak selesai dibaca**. Ini pengalaman
langsung di repo ini: `fase-0-peta-belajar/` pernah dibangun **19 file** dengan router,
diagnostik, dan empat jalur — dan hasilnya **tidak bisa dipakai**.

> **Prinsipnya:** kelengkapan bukan pengganti kejelasan.

Maka file ini melakukan tiga hal:

1. **Mengaudit** — memeriksa sumber resminya **satu per satu**, bukan dari ingatan
2. **Menyebut celah nyata** — dan **menambalnya**, bukan hanya melaporkannya
3. **Menyatakan apa yang sengaja dilewati** — beserta alasannya, supaya keputusan itu
   bisa dibantah

---

## 2. Metode audit

Semua teks RFC **diunduh apa adanya** ke `/tmp/rfc/` lalu diperiksa dengan `grep` dan `sed`.
**Tidak ada kutipan di skill ini yang ditulis dari ingatan.**

| Berkas | Ukuran | Diperiksa untuk |
|---|---|---|
| `rfc9110.txt` | 502 KB (10.785 baris) | §1 · §8 · §9.2.1 · §9.2.2 · §15 |
| `rfc9111.txt` | 84 KB | §5.2 (semua directive) |
| `rfc9457.txt` | 34 KB | §3 · §3.1 |
| `rfc8594.txt` | 23 KB | §3 |
| `rfc6585.txt` | 17 KB | §4 |
| `rfc6749.txt` | 163 KB | **hanya untuk memastikan ia milik skill LAIN** |
| `rfc7519.txt` | 63 KB | **hanya untuk memastikan ia milik skill LAIN** |

---

## 3. Audit 1 — RFC 9110 (*HTTP Semantics*)

**Terverifikasi verbatim:**

| Klaim | Lokasi | Teks |
|---|---|---|
| Definisi `safe` | §9.2.1, baris 3816 | *"Request methods are considered "safe" if their defined semantics are essentially read-only"* |
| Daftar yang `safe` | §9.2.1 | **GET, HEAD, OPTIONS, TRACE** |
| Definisi `idempotent` | §9.2.2, baris 3865 | *"A request method is considered "idempotent" if the intended effect on the server of multiple identical requests with that method is the same as the effect for a single such request."* |
| Daftar yang `idempotent` | §9.2.2 | *"PUT, DELETE, and safe request methods are idempotent."* |
| Nama `422` | §15.5.21, baris 7824 | **`422 Unprocessable Content`** |
| **`429` ADA?** | — | 🔴 **TIDAK.** `grep -c "429 Too Many Requests" rfc9110.txt` → **0** |

**Temuan penting — `429` tidak ada di RFC 9110.**
Ini sering dikutip salah. RFC 9110 §15 memuat `400`, `422`, `428`, tapi **bukan `429`**.
`429` berasal dari **RFC 6585 §4**. Skill ini menyebutnya di **Unit 5 dan Unit 13** sebagai
koreksi eksplisit.

**Temuan kedua — `422` bernama "Unprocessable Content", bukan "Entity".**
Nama *"Unprocessable Entity"* adalah nama lama dari RFC 4918 (WebDAV) dan masih beredar
luas di blog. RFC 9110 menggantinya. Skill ini menyebutnya di **Unit 5**.

### Celah yang **sengaja** dilewati di RFC 9110

| Dilewati | Kenapa |
|---|---|
| §3–§7 (terminologi, URI, koneksi) | Prasyarat HTTP umum, bukan **desain kontrak** |
| §10–§13 (field per-method, autentikasi, range, konnegosiasi) | Terlalu dalam; sebagian milik `teach-system-design` |
| §14 (koneksi), §16–§18 | Infrastruktur, bukan kontrak |
| Method `PATCH`, `CONNECT` | Jarang dipakai di konteks repo ini (laporan sekolah) — disebut sebagai daftar saja |
| §11 (autentikasi: `Authorization`, `WWW-Authenticate`) | 🔴 **Milik `teach-system-design`** — batas eksplisit |

**Yang ditambal:** definisi `safe` & `idempotent` **verbatim** masuk ke Unit 4 —
sebelumnya tidak ada satu pun skill di repo ini yang mengutipnya.

---

## 4. Audit 2 — RFC 9111 (*HTTP Caching*)

**Terverifikasi verbatim:**

| Klaim | Lokasi | Teks |
|---|---|---|
| `no-store` (respons) | §5.2.2.5, baris 1297 | *"The no-store response directive indicates that a cache MUST NOT store any part of either the immediate request or the response and MUST NOT use the response to satisfy any other request."* |
| `no-store` (permintaan) | §5.2.1.5, baris 1172 | *"The no-store request directive indicates that a cache MUST NOT store any part of either this request or any response to it."* |
| `private` | §5.2.2.7, baris 1328 | *"The unqualified private response directive indicates that a shared cache MUST NOT store the response (i.e., the response is intended for a single user). It also indicates that a private cache MAY store the response"* |
| ⚠️ Peringatan privasi | §5.2.2.5 | *"This directive is not a reliable or sufficient mechanism for ensuring privacy. In particular, malicious or compromised caches might not recognize or obey this directive"* |

**Temuan penting — RFC-nya sendiri jujur soal batasnya.**
`no-store` **bukan jaminan privasi**. Ini masuk ke Unit 12 sebagai peringatan:
*"`no-store` mencegah cache yang jujur. Ia tidak mencegah cache yang tidak jujur."*
Kurikulum yang menyembunyikan ini akan mengajarkan rasa aman yang palsu.

**Temuan kedua — `no-cache` ≠ `no-store`.**
`no-cache` **boleh menyimpan**, tapi wajib validasi ulang. `no-store` **tidak menyimpan**.
Ini miskonsepsi #14 di `peta-unit.md`.

### 🔴 Celah terbesar yang ditambal

**Sebelum skill ini dibuat, `Cache-Control` dan `ETag` punya 0 kemunculan di seluruh
materi skill repo ini** (audit 28 Sep 2026). Padahal inilah penyebab **data basi** yang
paling umum — dan gagal senyap. Unit 12 adalah **tambalan** untuk celah itu.

### Celah yang **sengaja** dilewati di RFC 9111

| Dilewati | Kenapa |
|---|---|
| §2–§4 (model cache, penyimpanan, konstruksi dari cache) | Teori cache internal — bukan kontrak |
| §5.1 (`Age`, `Date`, `Expires`) | Disebut sebagai istilah, tidak diajarkan |
| §5.3, §5.4 (cache invalidation, `Vary`) | Terlalu dalam untuk pemula; disebut di `sintaks-http-api.md` |
| §6, §7 (`Cache-Status`, `Pragma`) | Diagnostik/infrastruktur |
| **Cache di sisi infrastruktur (Redis, CDN)** | 🔴 **Milik `teach-system-design`** (`14-cache.md`) |

---

## 5. Audit 3 — RFC 9457 (*Problem Details for HTTP APIs*)

**Terverifikasi verbatim** (baris 17):

> *"This document defines a "problem detail" to carry machine-readable details of errors
> in HTTP response content to avoid the need to define new error response formats for
> HTTP APIs."*

| Anggota | §3.1 | Wajib? |
|---|---|---|
| `type` | §3.1.1 | Disarankan (default `about:blank` kalau kosong) |
| `status` | §3.1.2 | Disarankan |
| `title` | §3.1.3 | Disarankan |
| `detail` | §3.1.4 | Disarankan |
| `instance` | §3.1.5 | Opsional |

**Media type:** `application/problem+json` (baris 114, 156).
**Menggantikan:** *"This document obsoletes RFC 7807."* (baris 24) — RFC 9457 (Juli 2023),
RFC 7807 (Juli 2016).

**Temuan penting — `message` bukan anggota resmi.**
Banyak AI menghasilkan `{ "error": { "message": "..." } }`. RFC 9457 memakai `title`
(ringkas, tetap) dan `detail` (khusus kejadian ini). **`message` tidak ada** di modelnya.
Skill ini mengajarkan: **kode klien bercabang pada `type`, bukan `message`** (Unit 9).

### Celah yang **sengaja** dilewati

| Dilewati | Kenapa |
|---|---|
| §3.2 (ekstensi problem type) | Lanjutan; disebut sebagai "boleh ditambah" |
| §4 (keamanan) | Dibahas ringkas; sebagian milik `teach-system-design` |
| Registri IANA problem types | Tidak ada yang perlu dihafal |

---

## 6. Audit 4 — RFC 6585 §4 (`429`) & RFC 8594 §3 (`Sunset`)

### RFC 6585 §4 — `429 Too Many Requests`

**Terverifikasi verbatim** (baris 134):

> *"The 429 status code indicates that the user has sent too many requests in a given
> amount of time ("rate limiting")."*

> *"The response representations SHOULD include details explaining the condition, and MAY
> include a Retry-After header indicating how long to wait before making a new request."*

> ➕ **Fakta bonus yang sering terlewat** (baris 165): *"Responses with the 429 status code
> MUST NOT be stored by a cache."*

**Temuan penting — `Retry-After` itu `MAY`, bukan `MUST`.**
RFC membolehkan, tidak mewajibkan. Tapi tanpa itu klien **menebak** — dan tebakan yang
terlalu cepat **memperparah** pembatasan. Unit 13 mengajarkan ini sebagai
*"boleh ≠ cukup"*.

**Temuan kedua — `429` tidak boleh di-cache.** Ini keterkaitan langsung Unit 12 ↔ Unit 13
yang jarang disebut di tutorial mana pun.

### RFC 8594 §3 — `Sunset`

**Terverifikasi verbatim** (baris 200):

> *"The Sunset HTTP response header field allows a server to communicate the fact that a
> resource is expected to become unresponsive at a specific point in time."*

> *"The Sunset value is an HTTP-date timestamp, as defined in Section 7.1.1.1 of [RFC7231],
> and SHOULD be a timestamp in the future."*

Contoh dari RFC: `Sunset: Sat, 31 Dec 2018 23:59:59 GMT`.

**Temuan penting — formatnya HTTP-date, bukan ISO 8601.**
`2026-12-31T23:59:59Z` (ISO 8601) **salah** untuk header ini. Yang benar:
`Thu, 31 Dec 2026 23:59:59 GMT`. Ini kesalahan yang mudah terjadi kalau ditulis dari ingatan.

### Celah yang **sengaja** dilewati

| Dilewati | Kenapa |
|---|---|
| RFC 6585 §1–§3 (`428`, `431`, `511`) | Tidak berkaitan dengan desain kontrak |
| RFC 8594 §4–§6 (link relation, contoh, IANA) | Disebut ringkas; `rel="sunset"` cukup dikenali |
| **Header `RateLimit-*` (draft IETF)** | ⚠️ **Masih draft**, belum standar. Sengaja **tidak** diajarkan sebagai resmi |

---

## 7. Audit 5 — Pedoman vendor (Google · Microsoft · Stripe)

Tiga sumber ini **bukan standar**, tapi **pedoman resmi perusahaan** — dan justru
**bertentangan satu sama lain**. Itu sebabnya mereka dipakai.

| Sumber | Diverifikasi | Dipakai untuk |
|---|---|---|
| **Google AIP-158** (Pagination) | *"Page tokens provided by APIs must be opaque (but URL-safe) strings, and must not be user-parseable."* | Unit 10 — gaya pagination #1 |
| **Google AIP-122** (Resource Names) | Bentuk resmi *resource name* | Unit 2 — penamaan resource |
| **Google AIP-185** (Versioning) | Versi sebagai segmen path | Unit 14 — gaya versioning #2 |
| **Microsoft Azure REST API Guidelines** | *"DO NOT include a version number segment in any operation path"* · `nextLink` = URL absolut · `?api-version=YYYY-MM-DD` | Unit 7, 8, 10, 14 |
| **Stripe API Reference** | `starting_after` / `ending_before` · `has_more` · envelope `{object, data, has_more}` · `Idempotency-Key` | Unit 7, 10, 11 |

### 🔴 Temuan paling penting: **sumber resmi bisa bertentangan**

| Topik | Google (AIP) | Microsoft | Stripe |
|---|---|---|---|
| **Pagination** | `page_token` **buram** | `nextLink` **URL absolut** | `starting_after` = **ID objek** |
| **Versi** | di **path** (`/v1/`) | **DILARANG** di path → `?api-version=` | di **path** (`/v1/`) |
| **Envelope** | `{ ... }` | `{ "value": [...] }` **wajib** | `{object, data, has_more}` |
| **Parameter** | `page_size` | `filter` (tanpa `$`) | `limit` |

**Ini bukan kelalaian — ini faktanya.** Skill ini **tidak** memilih satu sebagai
"yang benar". Ia mengajarkan **memilih dengan alasan** (prinsip #11 di
`roadmap-4-tingkat.md`).

> **Konsekuensi pedagogis:** pembelajar yang mencari "cara yang benar" akan frustrasi.
> Itu **disengaja**. Yang harus ia bawa pulang: *"kontrak itu keputusan, bukan rumus."*

### Celah yang **sengaja** dilewati

| Dilewati | Kenapa |
|---|---|
| Microsoft: ARM template, `x-ms-*` header | Spesifik Azure, tidak portabel |
| Google: AIP-13x, AIP-15x lainnya | Terlalu banyak; hanya 3 AIP yang dipakai |
| Stripe: seluruh SDK & produk | Bukan materi kontrak |
| ⚠️ **Konvensi vendor bisa berubah** | Ditandai di `RESOURCES.md` — periksa ulang kalau ragu |

---

## 8. Audit 6 — OpenAPI 3.1.0 & OWASP API Top 10

### OpenAPI Specification 3.1.0 (15 Februari 2021)

**Diverifikasi:**
- Root **wajib** `openapi` + `info`
- Minimal **satu** dari `paths` / `components` / `webhooks`
- `paths` = path **relatif** (dimulai `/`)
- **Operation** = aksi pada satu path (`get`, `post`, …)

**Dipakai di:** Unit 3 (tiga pembaca kontrak) & Unit 16 (kontrak sebagai file).

**Celah yang dilewati:** seluruh bagian schema/SDK/codegen. Unit 16 hanya mengajarkan
**membandingkan spec dengan kode** — mencari **ketidaksinkronan**. Sisanya referensi.

### OWASP API Security Top 10 — 2023

**Dipakai sebagai daftar risiko**, bukan diajarkan satu per satu:

| # | Nama | Dipakai di |
|---|---|---|
| API1 | Broken Object Level Authorization | disebut sebagai batas |
| API2 | Broken Authentication | 🔴 milik `teach-system-design` |
| API3 | Broken Object Property Level Authorization | disebut |
| **API4** | **Unrestricted Resource Consumption** | ✅ **Unit 17** — bahaya query GraphQL mahal |
| API5 | Broken Function Level Authorization | disebut sebagai batas |
| API6 | Unrestricted Access to Sensitive Business Flows | disebut |
| API7 | Server Side Request Forgery | disebut sebagai batas |
| API8 | Security Misconfiguration | ✅ **Unit 12** — cache data pribadi |
| API9 | Improper Inventory Management | ✅ **Unit 15, 16** — versi & spec tidak sinkron |
| API10 | Unsafe Consumption of APIs | disebut |

**Yang diajarkan:** hanya **API4, API8, API9** — karena ketiganya **konsekuensi desain
kontrak**. Sisanya materi keamanan sistem, disebut sebagai batas.

---

## 9. Rekap: apa yang ADA, apa yang DITAMBAL, apa yang DILEWATI

### ✅ Ada di skill ini (dengan sumber resmi)

| Topik | Unit | Sumber |
|---|---|---|
| API sebagai kontrak | 1 | RFC 9110 §1 |
| Resource & penamaan | 2 | AIP-122 |
| Tiga pembaca kontrak | 3 | OpenAPI 3.1.0 |
| `safe` & `idempotent` (verbatim) | 4 | **RFC 9110 §9.2.1, §9.2.2** |
| Status codes + koreksi `429`/`422` | 5 | **RFC 9110 §15** + **RFC 6585 §4** |
| Header & `Content-Type` | 6 | RFC 9110 §8 · RFC 9457 §3 |
| Data langsung vs envelope | 7 | Microsoft · Stripe |
| Query parameter | 8 | Microsoft · OData |
| Error handling (verbatim) | 9 | **RFC 9457** |
| Pagination 3 gaya (verbatim) | 10 | **AIP-158** · Microsoft · Stripe |
| Idempotency & retry (verbatim) | 11 | **RFC 9110 §9.2.2** |
| HTTP caching (verbatim) | 12 | **RFC 9111 §5.2.2.5** |
| Rate limiting (verbatim) | 13 | **RFC 6585 §4** |
| Versioning 2 konvensi (verbatim) | 14 | **Microsoft** · AIP-185 |
| Deprecation & `Sunset` (verbatim) | 15 | **RFC 8594 §3** |
| OpenAPI sebagai file | 16 | **OpenAPI 3.1.0** |
| REST vs GraphQL vs RPC | 17 | OpenAPI · OWASP API4 |
| Review & keputusan | 18 | RFC 8594 · Microsoft · OWASP |

### 🔧 Ditambal (sebelumnya 0 di repo ini)

| Celah | Sebelum | Sesudah |
|---|---|---|
| **HTTP caching** (`Cache-Control`, `ETag`) | **0 kemunculan** (audit 28 Sep 2026) | **Unit 12** — unit paling mahal |
| **`safe`/`idempotent` verbatim** | Tidak dikutip di skill mana pun | **Unit 4** |
| **RFC 9457 problem detail** | Tidak ada | **Unit 9** |
| **`Sunset` header** | Tidak ada | **Unit 15** |
| **Tiga gaya pagination** | Hanya offset | **Unit 10** |
| **Koreksi `429` bukan dari RFC 9110** | Tidak ada | **Unit 5, 13** |
| **Batas tegas vs `teach-system-design`** | Kabur | **§6 `roadmap-4-tingkat.md`** |

### ⛔ Sengaja DILEWATI (dan ini keputusan, bukan lupa)

| Dilewati | Milik siapa / kenapa |
|---|---|
| OAuth 2.0 (RFC 6749) | 🔴 `teach-system-design` — **disebut sebagai batas**, tidak diajarkan |
| JWT (RFC 7519) | 🔴 `teach-system-design` |
| API Gateway · Microservices | 🔴 `teach-system-design` |
| Webhook / callback | 🔴 `teach-system-design` |
| Autentikasi (`Authorization`, `WWW-Authenticate`) | 🔴 `teach-system-design` |
| Cache infrastruktur (Redis, CDN) | 🔴 `teach-system-design` (`14-cache.md`) |
| Rate limiting **sebagai kapasitas sistem** | ⚠️ Di sini hanya **sisi kontrak** (`429` + `Retry-After`) |
| `fetch` · Express · React · middleware | 🔴 `teach-nodejs`, `teach-react` |
| SOLID · design patterns · TDD | 🔴 `teach-software-design` |
| `PATCH`, `CONNECT`, `TRACE` mendalam | Jarang dipakai; disebut sebagai daftar |
| gRPC detail, protobuf | Disebut sebagai gaya; bukan materi kontrak HTTP |
| `RateLimit-*` header | ⚠️ **Masih draft IETF**, belum standar — tidak diajarkan sebagai resmi |
| §3–§7 RFC 9110, §2–§4 RFC 9111 | Teori protokol, bukan desain kontrak |

---

## 10. Batas kejujuran

- **Semua kutipan RFC diverifikasi** dengan mengunduh teks aslinya ke `/tmp/rfc/` lalu
  `grep`/`sed`. Tidak ada kutipan dari ingatan. Perintah verifikasinya ada di §2.
- **Pemecahan 4 bagian / 18 unit BELUM DIUJI.** Tidak ada yang menjalankannya.
- **Tidak ada dasar riset pedagogis khusus API design** yang terkumpul. Yang dipakai
  (PRIMM, Parsons, ambang 50% tracing) dipinjam dari skill lain dan **belum diuji untuk
  topik ini**. Ini **dikatakan di depan**, tidak boleh dipalsukan dengan klaim.
- **Konvensi vendor (Google, Microsoft, Stripe) bisa berubah.** Yang diverifikasi adalah
  teks pada **29 September 2026**. Kalau ragu → periksa ulang sumbernya.
- **Tingkat "⭐" dan urutan unit adalah penilaian**, bukan hasil pengukuran kesulitan.
- **Cakupan OWASP dipangkas jadi 3 dari 10.** Itu pilihan sadar; sisanya materi keamanan
  sistem yang tidak boleh ditumpuk di sini.
- ⚠️ **Bahaya yang saya (agent) sadari pada diri sendiri:** audit 28 Sep 2026 menunjukkan
  **16 dari 23 hitungan awal saya salah** karena `grep` menemukan **lokasi**, bukan
  **kedalaman** (`CATATAN-TEKNIS.md` §8.3b). File ini dibuat dengan asumsi saya **bisa
  salah lagi** — karena itu setiap klaim punya lokasi baris, bukan hanya "ada".

---

**📅 Dibuat:** 29 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `korpus-ai.md` ·
`sintaks-http-api.md`
