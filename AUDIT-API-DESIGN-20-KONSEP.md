# AUDIT — 20 Konsep API Design

> Dibuat **28 September 2026** · Menjawab pertanyaan xcode:
> *"cek apakah ada materi terkait [20 konsep API design] di semua skill teach saya?"*
>
> ⚠️ **Metode:** hitung dulu → **lalu BACA KONTEKS tiap kemunculan.**
> Aturan `MEMORY.md` §1.5 — *grep menemukan LOKASI, bukan KEDALAMAN.*
> Audit ini **menemukan 3 jebakan** yang membuat hitungan mentah menyesatkan (§5).

---

## 1. Jawaban singkat

| Pertanyaan | Jawaban |
|---|---|
| Ada di **6 skill `teach-*`**? | ❌ **Hanya 7 dari 20** — hampir semuanya di `teach-nodejs` |
| Ada di **materi repo** (`fase-1..5`)? | ✅ **18 dari 20** — banyak yang **dalam** |
| **Tidak ada sama sekali**? | ❌ **2 dari 20** — Throttling · HTTP API caching |
| Ada **skill `teach-api-design`**? | ❌ **Belum ada** |

**Kesimpulan utama:** materinya **sudah ada** — tapi **tersebar di file materi, bukan di skill**.
Artinya tidak bisa dipelajari lewat **Mode Inspeksi** (prediksi → jalankan → bedah),
karena bentuk materi itu **bacaan**, bukan **latihan**.

---

## 2. Tabel lengkap — 20 konsep × 2 lokasi

Kolom **Skill** = ada di 6 skill `teach-*`? Kolom **Materi** = ada di file `fase-*`?

| # | Konsep | Skill `teach-*` | Materi repo | Di mana (kalau ada) |
|---|---|---|---|---|
| 1 | Endpoint | ⚠️ sebagian | ✅ **dalam** | `16-komunikasi-protokol.md` §363 Resource Naming · `11-application-layer.md` §683 |
| 2 | HTTP Methods | ✅ | ✅ **dalam** | `teach-nodejs` U9 · `16-komunikasi §389` tabel method + idempotent |
| 3 | Request–Response | ✅ | ✅ **dalam** | `teach-nodejs` U9 · `11-application-layer.md` §683 |
| 4 | Status Codes | ✅ | ✅ **dalam** | `teach-nodejs` U9, U12 · `16-komunikasi §381` **tabel 10 status** |
| 5 | Authentication | ✅ | ✅ **dalam** | `teach-nodejs` U17 · `17-keamanan-sistem.md` §538 (Session, JWT, OAuth, OIDC, SAML) |
| 6 | Authorization | ⚠️ sebagian | ✅ **dalam** | `17-keamanan §889` RBAC · OWASP A01 Broken Access Control §55 |
| 7 | Access Tokens | ⚠️ sebagian | ✅ **dalam** | `17-keamanan §602` **JWT Authentication** |
| 8 | OAuth 2.0 | ❌ | ✅ **dalam** | `17-keamanan §723` **Delegated Authorization** + Grant Types §778 + OIDC §795 |
| 9 | Rate Limiting | ❌ | ✅ **dalam** | `06-availability-patterns.md` §1205 **BAGIAN 8** + perbandingan algoritma §1445 |
| 10 | Throttling | ❌ | ⚠️ **nama saja** | `08-cdn.md` §880 · `02-service-discovery-api-gateway.md` §1544 (fitur gateway) |
| 11 | Pagination | ❌ | ✅ **dalam** | `16-komunikasi §411` **offset vs cursor** · `12-database-rdbms §495` keyset |
| 12 | Caching | ❌ | ⚠️ **infra saja** | `14-cache.md` 1.174 baris (**Redis/distributed**) — ❌ **bukan HTTP API caching** |
| 13 | Idempotency | ❌ | ✅ **dalam** | `11-application-layer §706` · `15-asynchronism §531` · `04-message-queues §573` |
| 14 | Webhooks | ❌ | ✅ **sangat dalam** | `15-asynchronism.md` §461–599: flow, retry, HMAC, security checklist, latihan §1271 |
| 15 | API Versioning | ❌ | ✅ **dalam** | `11-application-layer.md` §1003 **API Versioning Strategies** |
| 16 | OpenAPI | ❌ | ✅ **dalam** | `11-application-layer.md` §1137 + contoh YAML + Swagger UI/Postman |
| 17 | REST vs GraphQL | ⚠️ implicit | ✅ **dalam** | `16-komunikasi §323` REST 6 Constraints · §530 GraphQL · §225 tabel 4-way. ⚠️ Di `teach-nodejs`: REST **dipakai** (routing Express) tapi tidak **dinamai**; GraphQL **dikecualikan sengaja** |
| 18 | API Gateway | ❌ | ✅ **sangat dalam** | `02-service-discovery-api-gateway.md` **1.870 baris** |
| 19 | Microservices | ❌ | ✅ **dalam** | `11-application-layer §530` · `01-microservices-deep-dive.md` |
| 20 | Error Handling | ✅ | ✅ **dalam** | `teach-nodejs` U8 · `16-komunikasi §466` **Error Response Format** |

**Ringkas:** ✅ dalam = **18** · ⚠️ nama/sebagian = **2** · ❌ tidak ada = **0 di materi**.
Di **skill**: ✅ = **3** · ⚠️ = **4** · ❌ = **13**.

---

## 3. Apa yang benar-benar KOSONG

### 3.1 Throttling — nama saja, tanpa isi

| Muncul di | Isinya |
|---|---|
| `08-cdn.md` §880 | satu baris diagram: `5. Rate limiting → THROTTLE` |
| `02-service-discovery-api-gateway.md` §1544 | satu baris di daftar fitur: `✓ Throttling (per API key, per method)` |

**Tidak ada:** bedanya throttling vs rate limiting, token bucket vs leaky bucket,
apa yang terjadi pada klien saat di-throttle.

⚠️ **Tapi ini bukan celah besar.** Throttling biasanya **bagian dari** Rate Limiting —
dan Rate Limiting **sudah dalam** (§1205 + perbandingan algoritma). Yang kurang hanya
**istilahnya**. Bisa ditambal dengan menambah 1 sub-bab di materi yang sudah ada.

### 3.2 HTTP API Caching — ini celah yang lebih nyata

| Yang ADA | Yang TIDAK ADA |
|---|---|
| `14-cache.md` (1.174 baris) — Redis, distributed caching | `Cache-Control` sebagai **desain respons API** |
| `06-distributed-caching.md` (886 baris) | `ETag` + `304 Not Modified` |
| `cache hit` / `cache miss` di CDN & DNS | **Conditional request** |
| | caching per-endpoint, cache invalidation di level API |

**Bukti:** mencari `cache-control|etag` di seluruh repo → **14 file**, dan **tidak satu pun**
membahasnya sebagai teknik desain API. Yang ada hanya `08-cdn.md` §292 (caching aset statis)
dan **file memori saya sendiri**.

**Kenapa ini penting:** konsep #12 di daftar itu ada di **konteks API design**. Kalau
seseorang belajar "caching" dari `14-cache.md`, ia akan paham Redis — tapi **tidak** paham
kenapa `GET /siswa` bisa di-cache sementara `GET /nilai-saya` tidak.

---

## 4. Temuan terpenting: materi ada, tapi TIDAK BISA DIPAKAI untuk Mode Inspeksi

Ini alasan sebenarnya kenapa pertanyaan xcode penting.

| | Bentuk materi `fase-*` | Bentuk skill `teach-*` |
|---|---|---|
| Sifat | **bacaan** — teori, diagram, contoh | **latihan** — prediksi → jalankan → bedah |
| Panjang | 1.400–2.000 baris per file | 18 unit × 1 jam |
| Korpus | contoh yang **sudah benar** | kode AI yang **salah, tanpa error** |
| Yang diuji | "apakah sudah dibaca?" | "apakah bisa **memprediksi**?" |

**Konsekuensi:** 18 konsep itu **bisa dibaca** hari ini — tapi **tidak bisa dilatih**.
Dan menurut RCT Anthropic 2026 (arXiv 2601.20245), **membaca/menyalin** memberi hasil
**<40%**, sementara **menjawab konsep** memberi **>65%** — dengan gap terbesar di debugging.

**Jadi jawaban jujurnya:** *"Ada. Tapi kalau Anda hanya membacanya, Anda akan merasa
paham dan tetap tidak bisa memakainya."*

---

## 5. 🔴 Tiga jebakan metodologi yang ditemukan audit ini

> Ini bagian yang harus dibaca sebelum mempercayai angka apa pun di atas.
> **Ketiganya nyaris membuat saya melaporkan hasil yang salah.**

### Jebakan 1 — `-i` membuat `GET` cocok dengan "target" dan "mengetik"

Pencarian pertama saya memakai `grep -i` (case-insensitive) dengan pola `GET|POST|PUT|...`.
Hasilnya: **6 file cocok di teach-javascript, teach-react, teach-tailwindcss.**

Setelah diperiksa, yang cocok adalah kata biasa:

```
Target · mengetik · pengetahuan
```

**Bukan** HTTP method sama sekali. Setelah pakai `\b(GET|POST|...)\b` **tanpa** `-i`:
**0 file.** Selisihnya 6 → 0.

### Jebakan 2 — "500" muncul 51×, dan **semuanya** angka Indonesia

`4 Status Codes` terlihat cocok di 5–6 file. Setelah dibaca:

```
parseFloat("1.500,25") → 1.5      ← bug uang, bukan HTTP 500
```

**51 kemunculan "500"**, dan **0** di antaranya HTTP 500.
Pencarian `"HTTP 500"` → **0 hasil.**

### Jebakan 3 — "ada materi" bisa berarti "JANGAN taruh di sini"

`teach-software-design` mencocokkan **Caching (3 file) · OAuth (3 file) · JWT (3 file)**.
Terlihat seperti cakupan bagus. Setelah dibaca:

> *"**Jangan mengajarkan caching / queue / TLS / JWT / OAuth di skill ini.**"*
> — `roadmap-4-tingkat.md` §390

> *"| **Mengajarkan caching / queue / TLS / JWT / OAuth di sini** | **JANGAN.**"*
> — `SKILL.md` tabel Anti-Pattern

Semuanya **penanda batas**, bukan materi. Hitungan 3 → **0 cakupan**.

### Jebakan 4 — `cursor` cocok dengan **CSS** `cursor: pointer`

`teach-react` terlihat punya **Pagination (2 file)**. Setelah dibaca:

```
cursor: pointer      ← properti CSS untuk kursor mouse
```

**Bukan** cursor-based pagination sama sekali. Hitungan 2 → **0**.

### Jebakan 5 — `microservices` & `GraphQL` di `teach-nodejs` juga **penanda batas**

`teach-nodejs` mencocokkan **microservices (3 file)** dan **GraphQL (3 file)**.
Setelah dibaca, ketiganya **penolakan sadar**:

> *"| Microservices | Skala masalah yang belum dihadapi |"*
> *"| **Mengajarkan Docker / Kubernetes / microservices** | **JANGAN.** Bukan prasyarat"*
> *"| GraphQL | Alternatif REST; satu gaya saja dulu, supaya tidak bercabang |"*

Hitungan 3 → **0 cakupan**.

**Pelajaran yang sama untuk KETIGA kali** (`MEMORY.md` §1.5 — sebelumnya di Sesi 7 dan 7c).
Yang menyelamatkan: **membaca konteks, bukan mempercayai hitungan.**

**Total koreksi audit ini:** 5 jebakan · **16 hitungan palsu dibuang** (6 + 51 + 3 + 2 + 6).
Tanpa membaca konteks, laporan ini akan menyebut **19 dari 20 ada di skill** — padahal
angkanya **7**. Itu kesalahan **3× lipat**.

---

## 6. Pilihan yang masuk akal (belum diputuskan)

Ada **4 pilihan**, dan saya **tidak memilih sendiri** — ini menyangkut arah belajar xcode.

| # | Pilihan | Untung | Rugi |
|---|---|---|---|
| **A** | **Skill baru `teach-api-design`** (18–20 unit, mode inspeksi) | Konsisten dengan 5 skill lain; bisa dilatih, bukan dibaca | Skill ke-7. Butuh riset sumber resmi dulu (RFC 9110, OpenAPI Spec, OWASP API Top 10) |
| **B** | **Tambah unit ke `teach-nodejs`** (U19–U22: API design) | Tidak menambah skill; Node.js memang tempatnya | `teach-nodejs` sudah 18 unit / 2.560 baris. Menambah 4 unit = **22 unit** — dan `SKILL.md` sudah 451 baris (batas 500) |
| **C** | **Cukup materi `fase-*`** — tidak dibuat skill | Nol kerja baru; materinya sudah dalam | **Tidak bisa dilatih.** Bertentangan dengan Mode Inspeksi |
| **D** | **Tunda** sampai 5 skill sekarang selesai dipakai | Fokus; menghindari membangun di atas asumsi | Celah tetap terbuka |

**Catatan saya (bukan keputusan):**

- Pilihan **A** paling konsisten — tapi **jangan dibangun sekarang.** Aturan repo:
  *"selesaikan 4 skill dulu"*. Sekarang sudah **6** skill (5 selesai + 1 system-design).
- Pilihan **C** jujur tapi melemahkan seluruh alasan repo ini dibuat.
- **Yang mendesak hanya 2 hal**, dan keduanya **kecil**:
  1. **HTTP API caching** — benar-benar kosong (bukan "nama saja")
  2. **Throttling** — hanya istilah yang kurang; isinya sudah ada di Rate Limiting

**Kalau mau tindakan minimum:** tambal 2 celah itu ke materi `fase-1` yang sudah ada —
**jangan** bangun skill baru. Itu 1–2 jam kerja, bukan proyek baru.

---

## 7. Batas kejujuran

1. **Audit ini memakai `grep`, dan `grep` bisa salah** — sudah dibuktikan §5 (3 jebakan).
   Konteks sudah dibaca untuk **semua 20 konsep**, tapi pembacaan itu **sampel**, bukan
   pembacaan utuh 100.000+ baris materi.
2. **"Dalam" itu penilaian saya**, bukan ukuran objektif. Kriterianya: ada **sub-bab
   sendiri**, bukan sekadar disebut. Kalau ada yang terasa dangkal, katakan — saya periksa ulang.
3. **Belum diverifikasi apakah materinya benar.** Audit ini hanya memetakan
   **keberadaan**, bukan **kebenaran**. Materi `fase-*` belum pernah diaudit terhadap
   sumber primer.
4. **Angka baris** (`14-cache.md` 1.174 baris dsb.) berasal dari audit Sesi 7c — sudah
   pernah salah sekali (hitungan prima 148933 → 348513), jadi **periksa ulang kalau dipakai
   untuk keputusan**.

---

## 8. Bisakah dikategorikan ke `teach-software-design`? — **Tidak untuk semuanya**

> Pertanyaan xcode, 29 Sep 2026. Jawaban: **sebagian kecil saja — dan itu pun melanggar
> batas yang skill itu tulis sendiri.**

### 8.1 Skill itu sudah punya aturan batasnya sendiri

`teach-software-design` **sudah menulis** bahwa API **bukan** wilayahnya:

| Di mana | Bunyinya |
|---|---|
| `SKILL.md` §343 | `\| Backend / server / API \| **/teach-nodejs** \|` |
| `SKILL.md` §429 | `\| Belajar backend / API / server \| Pakai skill ini \| /teach-nodejs \|` |
| `SKILL.md` Anti-Pattern | *"Mengajarkan caching / queue / TLS / JWT / OAuth di sini → **JANGAN**"* |
| `roadmap-4-tingkat.md` §10 | *"Jangan mengajarkan caching / queue / TLS / JWT / OAuth di skill ini"* |

**Jadi jawabannya bukan sekadar "tidak cocok" — tapi "sudah diputuskan tidak cocok."**

### 8.2 Kenapa — satuan setiap skill berbeda

| Skill | Pertanyaan yang dijawab | Satuan |
|---|---|---|
| `teach-software-design` | *"Bagaimana kode ini **ditulis** supaya bisa diubah?"* | **kode** — kelas, fungsi, modul, tes |
| `teach-system-design` | *"Bagaimana komponen ini **disusun**?"* | **sistem** — layanan, DB, antrian |
| **API design** | *"Bagaimana **kontrak** antara pemanggil dan penyedia ditetapkan?"* | **antarmuka** ← **bidang ketiga** |

API design bukan "kode" dan bukan "susunan komponen". Ia duduk **di antara keduanya** —
dan itulah sebabnya ia tidak masuk rapi ke mana pun.

### 8.3 Klasifikasi 20 konsep menurut sifatnya

| # | Konsep | Sifat | Rumah yang benar | Boleh masuk software-design? |
|---|---|---|---|---|
| 1 | Endpoint | antarmuka | **API** (belum ada) | ❌ satuan salah |
| 2 | HTTP Methods | protokol, dipakai sebagai kosakata API | **API** / `teach-nodejs` U9 ✅ | ⚠️ sudah ada di nodejs |
| 3 | Request–Response | protokol | **API** / `teach-nodejs` U9 ✅ | ⚠️ sudah ada di nodejs |
| 4 | Status Codes | protokol | **API** / `teach-nodejs` U9, U12 ✅ | ⚠️ sudah ada di nodejs |
| 5 | Authentication | komponen keamanan | **system-design** ✅ §538 | 🔴 **dilarang** |
| 6 | Authorization | komponen keamanan | **system-design** ✅ §889 | 🔴 **dilarang** |
| 7 | Access Tokens / JWT | komponen keamanan | **system-design** ✅ §602 | 🔴 **dilarang** |
| 8 | OAuth 2.0 | protokol keamanan | **system-design** ✅ §723 | 🔴 **dilarang** |
| 9 | Rate Limiting | resiliensi | **system-design** ✅ §1205 | 🔴 **dilarang** |
| 10 | Throttling | resiliensi | **system-design** (nama saja) | 🔴 **dilarang** |
| 11 | Pagination | **desain antarmuka** | **API** (belum ada) | ❌ satuan salah |
| 12 | Caching | infrastruktur | **system-design** ✅ `14-cache.md` | 🔴 **dilarang** |
| 13 | Idempotency | **terbelah** | method HTTP → **API** · consumer → **system-design** ✅ | ⚠️ separuh boleh |
| 14 | Webhooks | pola integrasi | **system-design** ✅ §461–599 | 🔴 **dilarang** |
| 15 | API Versioning | **evolusi kontrak** | **API** (belum ada) | ❌ satuan salah |
| 16 | OpenAPI | **spesifikasi kontrak** | **API** (belum ada) | ❌ satuan salah |
| 17 | REST vs GraphQL | gaya arsitektur API | **API** (belum ada) | ⚠️ batas |
| 18 | API Gateway | komponen infrastruktur | **system-design** ✅ `fase-4` | 🔴 **dilarang** |
| 19 | Microservices | arsitektur | **system-design** ✅ | 🔴 **dilarang** |
| 20 | Error Handling | **terbelah** | kode → `teach-nodejs` U8 ✅ · format error API → **API** | ⚠️ separuh boleh |

### 8.4 Hitungannya

| | Jumlah |
|---|---|
| 🔴 **Dilarang** — sudah punya rumah di `teach-system-design` | **11** (5,6,7,8,9,10,12,14,18,19 + sebagian 13) |
| ⚠️ **Sudah ada** di `teach-nodejs` | **4** (2,3,4 + sebagian 20) |
| ❌ **Tidak cocok** — satuan = antarmuka, bukan kode | **5** (1, 11, 15, 16, 17) |
| ✅ **Benar-benar cocok** masuk `teach-software-design` | **0–2** (separuh 13, separuh 20) |

> **Jawaban jujur:** memaksakan 20 konsep ini ke `teach-software-design` akan
> **(a)** melanggar 4 aturan yang skill itu tulis sendiri, **(b)** menduplikasi
> `teach-system-design` yang **sudah punya materinya**, dan **(c)** mencampur
> **3 satuan berbeda** (kode · sistem · antarmuka) dalam satu skill.
>
> **Yang benar-benar cocok hanya 0–2 dari 20. Itu bukan kategorisasi — itu kebetulan.**

### 8.5 Pilihan yang tersisa (belum diputuskan)

| # | Pilihan | Untuk konsep mana | Catatan |
|---|---|---|---|
| **A** | **Biarkan tersebar** — system-design (11) + nodejs (4) + fase-* (5) | semua | Nol kerja. Tapi 5 konsep kontrak **tidak punya rumah** |
| **B** | **Skill baru `teach-api-design`** | **5–8** konsep kontrak (1, 11, 15, 16, 17 + separuh 13, 20) | Satu-satunya yang **tidak** melanggar batas mana pun. Butuh riset sumber resmi (RFC 9110 · OpenAPI Spec · OWASP API Top 10) |
| **C** | **Paksa ke `teach-software-design`** | — | 🔴 **Jangan.** Melanggar 4 aturan sendiri |
| **D** | **Tambal 2 celah** ke materi `fase-1` | HTTP caching (12) · Throttling (10) | 1–2 jam. Tidak menyentuh skill |

**Rekomendasi saya: A + D sekarang, B nanti.**
Sebab: 5 konsep kontrak itu **butuh skill sendiri** kalau mau bisa **dilatih** (Mode Inspeksi).
Tapi aturan repo masih *"selesaikan skill yang ada dulu"* — dan sekarang sudah **6**.
Yang **mendesak** hanya **D** (2 celah, kecil). **B** jangan dibangun di atas asumsi.

---

**📅 Dibuat:** 28 September 2026 · **§8 ditambahkan 29 September 2026**
**📚 Terkait:** `JADWAL-BELAJAR.md` · `ALUR-FUNDAMENTAL-SOFTWARE-ENGINEER.md` ·
`skills/teach-software-design/SKILL.md` (§343, §429, Anti-Pattern) ·
`skills/teach-software-design/references/roadmap-4-tingkat.md` §10 ·
`skills/teach-nodejs/references/roadmap-4-tingkat.md` (U9, U12, U17) ·
`fase-1-arsitektur-dasar/11-application-layer.md` · `fase-1-arsitektur-dasar/16-komunikasi-protokol.md` ·
`fase-1-arsitektur-dasar/17-keamanan-sistem.md`

