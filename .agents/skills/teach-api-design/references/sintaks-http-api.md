# Kamus Istilah & Pola — API Design → HTTP / JSON

> Referensi untuk skill **`teach-api-design`**. **Tutor membaca file ini sendiri** dan
> **menjelaskan satu istilah per kejadian** (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 29 September 2026 · **Kerangka asal:** `teach-software-design/references/sintaks-javascript.md`
>
> **Aturan pemakaian (penting):**
> - Pembelajar **bertanya** *"ini maksudnya apa?"* → jawab **satu istilah**, 1–2 kalimat,
>   **sebut padanan yang sudah ia kenal**, kaitkan ke unit, lalu **lanjut**.
> - **JANGAN** menjelaskan lima istilah sekaligus. Menumpuk = menenggelamkan.
> - **JANGAN** menyuruh pembelajar membaca file ini sendiri.
> - **JANGAN** bilang *"itu di luar materi"*. Kode & spesifikasi AI memakai semua ini
>   sejak baris pertama.
>
> **Tingkat bahaya:**
> - 🔴 **Berbahaya** — sering jadi sumber masalah nyata, dan **gagal senyap**
> - 🟡 **Perlu hati-hati** — benar kalau dipakai tepat
> - ⚪ **Aman** — cukup dikenali
>
> **Batas kejujuran:** tingkat bahaya di sini adalah **penilaian**, bukan hasil riset.
> Kutipan bersumber disebutkan di tiap barisnya.

---

## A. Istilah API ↔ padanannya di HTTP

Ini bagian yang paling sering dibutuhkan. **Istilah API terasa asing, padahal
bentuknya sudah dikenal pembelajar.**

| Istilah API | Di HTTP / JavaScript | Contoh |
|---|---|---|
| **Endpoint** | **path** + **method** | `GET /siswa/123` |
| **Resource** | kata benda di path | `/siswa`, `/nilai` |
| **Method** | kata kerja protokol | `GET`, `POST`, `PUT`, `DELETE` |
| **Request body** | isi permintaan | `{ "nama": "Budi" }` |
| **Response body** | isi balasan | `[{ "id": 1 }]` |
| **Status code** | angka hasil | `200`, `404`, `500` |
| **Header** | metadata | `Content-Type: application/json` |
| **Query parameter** | setelah `?` di URL | `?page=2&limit=20` |
| **Path parameter** | bagian dari path | `/siswa/:id` → `/siswa/123` |
| **Payload** | sebutan lain untuk body | sama dengan request/response body |
| **Contract / spec** | file yang menyatakan janji | `openapi.yaml` |
| **Pagination** | memecah daftar panjang | `?page=` atau `?page_token=` |
| **Idempotent** | boleh diulang, efeknya sama | `PUT`, `DELETE` |
| **Safe** | tidak mengubah apa pun | `GET`, `HEAD` |
| **Envelope** | pembungkus respons | `{ "value": [...] }` |
| **Deprecation** | penanda akan dihapus | header `Deprecation` + `Sunset` |

---

## B. Pola kode yang perlu dikenali (dengan tingkat bahaya)

### 🔴 Berbahaya — gagal senyap

| Pola | Kenapa berbahaya | Unit | Gagal senyap? |
|---|---|---|---|
| `?page=2&limit=20` + `ORDER BY` | Posisi bergeser saat ada data baru → baris terlewat & ganda | 10 | ✅ ya |
| `app.post('/pesanan')` tanpa kunci idempotency | Retry setelah timeout = data ganda | 11 | ✅ ya |
| `Cache-Control: public, max-age=86400` untuk data pribadi | Data pribadi tersimpan di cache bersama; klien lihat data lama | 12 | ✅ ya |
| `res.status(500).json({ error: 'failed' })` untuk semua kegagalan | Klien tidak bisa membedakan sebab | 9 | ✅ ya |
| `res.status(200).json({ error: 'Tidak ditemukan' })` | Status berbohong; klien menganggap berhasil | 5 | ✅ ya |
| `app.get('/lihat/:id', …)` yang di dalamnya ada `db.update(…)` | Melanggar `safe`; crawler bisa merusak data | 4 | ✅ ya |
| `429` tanpa `Retry-After` | Klien menebak kapan boleh mencoba → memperparah | 13 | ✅ ya |
| `/v1/` dihapus tanpa `Sunset` | Klien mati mendadak | 14, 15 | ❌ belakangan |
| `GET /siswa?nama=` diubah jadi `?q=` | Setiap klien yang sudah dipasang berhenti | 1, 8 | ❌ di sisi klien |

### 🟡 Perlu hati-hati — benar kalau dipakai tepat

| Pola | Kapan benar | Kapan salah | Unit |
|---|---|---|---|
| `Cache-Control: no-cache` | Boleh menyimpan, wajib validasi ulang | Dikira "tidak menyimpan" — yang tidak menyimpan adalah `no-store` | 12 |
| `Cache-Control: private` | Data pribadi **boleh** di-cache **oleh klien sendiri** | Dipakai untuk data yang tidak boleh disimpan sama sekali → pakai `no-store` | 12 |
| `ETag` + `If-None-Match` → `304` | Menghemat bandwidth untuk data besar | Dikirim untuk data yang berubah tiap detik | 12 |
| Envelope `{ "value": [...] }` | Memberi ruang untuk metadata | Dicampur dengan array langsung di API yang sama | 7 |
| `?$filter=` (OData) | Kalau seluruh API memakai OData | Dicampur dengan `?filter=` tanpa `$` | 8 |
| `?api-version=2024-01-01` | API yang berubah per tanggal | Dipakai untuk API kecil yang jarang berubah | 14 |
| `/v1/` di path | API publik, versi sedikit | Microsoft **melarangnya** — jumlah versi bisa meledak | 14 |
| `PUT` yang membuat resource baru kalau belum ada | Sah menurut RFC 9110 §9.2.2 | Kalau klien mengira `PUT` tidak akan membuat apa pun | 4 |
| `202 Accepted` untuk pekerjaan lama | Server menerima, belum selesai | Klien tidak diberi cara memeriksa hasilnya | 5 |

### ⚪ Aman — cukup dikenali

| Pola | Arti | Unit |
|---|---|---|
| `Content-Type: application/json` | Body JSON | 6 |
| `Accept: application/json` | Klien mau JSON | 6 |
| `201 Created` + header `Location` | Resource baru dibuat; alamatnya di `Location` | 5 |
| `204 No Content` | Berhasil, tanpa body | 5 |
| `304 Not Modified` | Cache masih valid; pakai salinan lama | 12 |
| `OPTIONS` | Menanyakan kemampuan endpoint | 4 |
| `HEAD` | Sama seperti `GET` tapi tanpa body | 4 |
| `application/problem+json` | Media type untuk error RFC 9457 | 6, 9 |
| `Retry-After: 30` | Tunggu 30 detik | 13 |
| `Sunset: Sat, 31 Dec 2018 23:59:59 GMT` | Kapan resource berhenti melayani | 15 |

---

## C. Status code — yang sering tertukar

| Code | Nama resmi | Kapan | Sering disalahartikan sebagai |
|---|---|---|---|
| `200` | OK | Berhasil, ada body | "selalu aman" — **tidak**, kalau body-nya `{error}` |
| `201` | Created | Resource baru dibuat | `200` (banyak AI memakai `200`) |
| `202` | Accepted | Diterima, belum selesai | `200` |
| `204` | No Content | Berhasil, tanpa body | `200` dengan body kosong |
| `400` | Bad Request | **Bentuk** permintaan salah | `422` |
| `401` | Unauthorized | **Belum** terautentikasi | `403` |
| `403` | Forbidden | Sudah terautentikasi, **tidak boleh** | `401` |
| `404` | Not Found | Tidak ada | `410` |
| `409` | Conflict | Bentrok keadaan (mis. duplikat) | `400` |
| `410` | Gone | Dulu ada, sekarang sengaja dihapus | `404` |
| `422` | **Unprocessable Content** | Bentuk benar, **isi** tidak bisa diproses | *"Unprocessable Entity"* — nama lama |
| `429` | Too Many Requests | Terlalu sering | `503` — **dan bukan dari RFC 9110** |
| `500` | Internal Server Error | **Salah server** | "semua kegagalan" |
| `503` | Service Unavailable | Server sedang tidak bisa melayani | `429` |

> ⚠️ **Dua koreksi yang sering dikutip salah:**
> - **`429` TIDAK ada di RFC 9110.** Ia dari **RFC 6585 §4**.
> - RFC 9110 menamai `422` **"Unprocessable Content"**, bukan *"Unprocessable Entity"*.

---

## D. Header yang perlu dikenali

| Header | Arah | Arti | Unit |
|---|---|---|---|
| `Content-Type` | respons & permintaan | *"isi ini apa"* | 6 |
| `Accept` | permintaan | *"saya mau apa"* | 6 |
| `Content-Length` | keduanya | panjang body dalam byte | 6 |
| `Cache-Control` | keduanya | aturan penyimpanan | 12 |
| `ETag` | respons | sidik jari versi isi | 12 |
| `If-None-Match` | permintaan | *"saya punya versi ini"* → bisa `304` | 12 |
| `Location` | respons | alamat resource (dengan `201`/`3xx`) | 5 |
| `Retry-After` | respons | berapa lama menunggu (dengan `429`/`503`) | 13 |
| `Deprecation` | respons | penanda akan dihapus | 15 |
| `Sunset` | respons | kapan berhenti melayani | 15 |
| `Idempotency-Key` | permintaan | kunci anti-duplikat untuk `POST` | 11 |

---

## E. Directive `Cache-Control` — yang paling sering tertukar

| Directive | Menyimpan? | Wajib validasi? | Untuk siapa | Dipakai untuk |
|---|---|---|---|---|
| `max-age=3600` | ✅ ya | ❌ tidak, selama 1 jam | semua cache | Data publik yang jarang berubah |
| `s-maxage=3600` | ✅ ya | ❌ tidak | **cache bersama saja** (proxy/CDN) | Menimpa `max-age` untuk CDN |
| `private` | ✅ ya | sesuai `max-age` | **klien saja** | Data pribadi yang boleh disimpan di perangkat sendiri |
| `public` | ✅ ya | sesuai `max-age` | semua | Data yang boleh dibagi ke siapa pun |
| `no-cache` | ✅ **ya** | ✅ **ya, selalu** | semua | Data yang harus diperiksa kesegarannya tiap kali |
| `no-store` | ❌ **tidak** | — | semua | **Data pribadi/sensitif** |
| `must-revalidate` | ✅ ya | ✅ setelah basi | semua | Mencegah pemakaian salinan basi saat offline |

> 🔴 **Yang paling sering salah:** `no-cache` **bukan** "jangan simpan".
> RFC 9111 §5.2: `no-store` verbatim — *"a cache MUST NOT store any part of either the
> immediate request or the response"*.
>
> **Kalimat yang bisa dipakai ke pembelajar:**
> *"`no-cache` = 'tanya dulu sebelum pakai'. `no-store` = 'jangan simpan sama sekali'.
> Dua hal berbeda; yang sering ditulis orang adalah `no-cache` padahal maksudnya `no-store`."*

---

## F. Tiga gaya pagination — semuanya sah

| Gaya | Parameter | Kursor berupa | Kelebihan | Kekurangan |
|---|---|---|---|---|
| **Offset** (paling umum di tutorial) | `?page=2&limit=20` | **angka** | Bisa lompat ke halaman mana saja | 🔴 Baris terlewat & ganda saat data berubah |
| **AIP-158** (Google) | `?page_size=20&page_token=…` | **string buram** | Aman terhadap perubahan data | Tidak bisa lompat halaman |
| **Microsoft** | `nextLink` | **URL absolut** | Klien tidak perlu menyusun URL | URL panjang; tidak bisa lompat halaman |
| **Stripe** | `?limit=20&starting_after=…` | **ID objek** | Stabil & mudah dibaca manusia | Butuh kolom yang bisa diurutkan |

> **AIP-158 verbatim:** *"Page tokens provided by APIs must be opaque (but URL-safe)
> strings, and must not be user-parseable."*
>
> **Kalimat yang bisa dipakai:** *"Tiga-tiganya benar. Yang salah adalah memakai offset
> untuk data yang terus bertambah — dan tidak memberi tahu klien."*

---

## G. Istilah yang sering muncul tapi bukan milik skill ini

Pembelajar akan menemui istilah ini di kode AI. **Sebutkan sebagai batas, jangan ajarkan.**

| Istilah | Milik siapa | Kalau ditanya, jawab |
|---|---|---|
| **JWT** | `/teach-system-design` | *"Token yang isinya bisa dibaca siapa pun, tapi tidak bisa dipalsukan. Itu materi keamanan sistem — di sini kita berhenti di 'header apa yang membawanya'."* |
| **OAuth 2.0** | `/teach-system-design` | *"Cara memberi izin ke aplikasi lain tanpa memberi password. Materi sistem."* |
| **API Gateway** | `/teach-system-design` | *"Satu pintu di depan banyak layanan. Materi arsitektur."* |
| **Microservices** | `/teach-system-design` | *"Memecah satu aplikasi jadi banyak layanan kecil. Materi arsitektur."* |
| **Webhook** | `/teach-system-design` | *"Server kita yang memanggil klien, bukan sebaliknya. Materi asinkron."* |
| **Express / Fastify** | `/teach-nodejs` | *"Kerangka kerja server. Di sini kita pakai `node:http` bawaan supaya kontraknya terlihat."* |
| **`fetch` / `axios`** | `/teach-nodejs` | *"Cara klien memanggil. Materi Node.js."* |
| **SOLID / design pattern** | `/teach-software-design` | *"Cara menulis kode. Materi desain perangkat lunak."* |
| **Redis / CDN** | `/teach-system-design` | *"Alat cache di infrastruktur. Di sini kita hanya bahas header cache HTTP."* |

---

## H. Alat — apa yang dipakai & apa yang tidak

| Alat | Dipakai? | Kenapa |
|---|---|---|
| **Terminal** | ✅ wajib | Menjalankan & melihat output |
| **Node.js v22+** | ✅ wajib | `node:http` bawaan + `node:test` bawaan |
| **`node:test`** | ✅ wajib | Membuktikan perilaku (Unit 12–16) |
| **`curl -i`** | ✅ disarankan | Melihat **header**, bukan cuma body |
| **Editor teks** (Zed) | ✅ wajib | Menulis `prediksi.md` |
| **`openapi.yaml`** | ✅ untuk Unit 16 | Dibaca sebagai teks |
| **Postman / Insomnia** | ❌ **jangan** | GUI menyembunyikan kontraknya — pembelajar tidak melihat method, status, header |
| **Express / Fastify / NestJS** | ❌ **jangan** | Itu `teach-nodejs`. Di sini fokusnya kontrak, bukan kerangka kerja |
| **API publik yang butuh kunci** | ❌ **jangan** | Tidak bisa diulang; hasilnya berubah-ubah |
| **Docker / Kubernetes** | ❌ **jangan** | Materi sistem |

**Perintah yang paling sering dipakai:**

```bash
node --version                      # pastikan v22+
node server.js                      # jalankan server lokal
curl -i http://localhost:3000/siswa # lihat HEADER + body
node --test                         # jalankan node:test
ls -l --time-style=full-iso PRAKTIK/sesi-001/   # verifikasi timestamp prediksi.md
```

---

## I. Cara menjawab "ini artinya apa?" — 4 langkah

1. **Jawab satu istilah** — 1–2 kalimat, jangan lebih
2. **Sebut padanannya** yang sudah ia kenal (§A) — *"`endpoint` itu cuma `path` + `method`"*
3. **Kaitkan ke unit yang sedang dikerjakan**
4. **Lanjut** — jangan menawarkan penjelasan tambahan

**Contoh jawaban yang benar:**

> Pembelajar: *"Apa itu `idempotent`?"*
> Tutor: *"Artinya: boleh dikirim berapa kali pun, hasil di server tetap sama seperti
> sekali kirim. `PUT` begitu, `POST` tidak. Kita bahas ini di Unit 11 — di situ `POST`
> yang diulang bikin data ganda. Lanjut ya?"*

**Contoh jawaban yang salah (jangan):**

> *"Idempotent adalah properti matematis dalam ilmu komputer di mana f(f(x)) = f(x),
> yang dalam konteks HTTP mengacu pada RFC 9110 §9.2.2 yang juga berkaitan dengan
> konsep safe methods, retry semantics, dan…"* ← **terlalu panjang, menenggelamkan**

---

## J. Batas kejujuran

- **Tingkat bahaya (§B) adalah penilaian**, bukan hasil pengukuran. Yang **berbukti**
  adalah baris yang menyebut hasil verifikasi (Unit 4, 10, 11, 12, 13) —
  dijalankan di Node v22.22.2, 29 Sep 2026.
- **Nama & nomor RFC diverifikasi** dengan membaca teks RFC-nya langsung
  (RFC 9110, 9111, 9457, 8594, 6585, 6749, 7519), bukan dari ingatan.
- **Konvensi vendor (Microsoft, Stripe, Google) diverifikasi dari dokumentasi resminya.**
  Ia bisa berubah; kalau ragu, periksa ulang sumbernya.
- **Padanan istilah di §A dibuat untuk pembelajar repo ini** (latar JavaScript).
  Untuk latar bahasa lain, padanannya berbeda.

---

**📅 Dibuat:** 29 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `korpus-ai.md` ·
`cakupan-vs-dokumen-resmi.md`
