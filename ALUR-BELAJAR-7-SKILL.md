# ALUR-BELAJAR-7-SKILL.md — Alur Pembelajaran Terstruktur

> Dibuat **29 September 2026** · atas permintaan xcode:
> *"alur pembelajaran terstruktur dari setiap skill teach saya, dari mulai
> teach-javascript hingga teach akhir sesuai urutan pembelajaran"*
>
> **7 skill · 6 tahap · 1 urutan yang bisa diperiksa.**

---

## 1. MULAI dan SELESAI

**MULAI:** `teach-javascript` Unit 1 — *Nama menunjuk nilai*.
Sesi pertama dijalankan dengan **asesmen A1–A6** dulu (satu pertanyaan sekaligus).

**SELESAI:** tiga kriteria ini terpenuhi —

| # | Kriteria | Cara memeriksa |
|---|---|---|
| 1 | **Semua gerbang 6 skill lulus** | 4 gerbang × 6 skill = **24 gerbang**. Setiap gerbang = terima/tolak **dengan alasan** |
| 2 | **Checkpoint Fase 2 arsitektur lulus** | Jelaskan **3 dari 4** tanpa membaca: CAP · load balancer · cache hit/miss · SQL vs NoSQL |
| 3 | **Uji akhir gabungan** | Diberi satu aplikasi hasil AI yang belum pernah dilihat → sebut **1 cacat kode** + **1 cacat kontrak** + **1 cacat desain**, lalu **putuskan dengan alasan** |

**Bukan tanggal** — bisa diperiksa kapan saja.

---

## 2. Kenapa urutannya begini — bukan selera

Urutan ini **tidak** dipilih karena "kelihatannya enak". Ia ditentukan oleh
**tabel prasyarat** di bawah. Kalau prasyarat belum lewat, materinya tidak bisa dipakai.

| Skill | Prasyarat | Unit yang dibutuhkan |
|---|---|---|
| `teach-javascript` | — | **fondasi semua** |
| `teach-software-design` | `teach-javascript` | **U1–8** (fungsi, objek, array) |
| `teach-tailwindcss` | `teach-javascript` | **U6** (template literal) |
| `teach-react` | `teach-javascript` | **U6, 7, 8 (alamat vs isi), 10 (async)** |
| `teach-nodejs` | `teach-javascript` | **U6, 7, 8, 10** |
| `teach-api-design` | `teach-nodejs` | **server yang berjalan** — kontrak butuh wujud |
| `teach-system-design` | semua di atas | **tidak ada prasyarat kode** — tapi butuh semua di atas untuk berguna |

**Tiga temuan yang menentukan urutan:**

1. **`teach-software-design` bisa mulai lebih awal dari `teach-react`.**
   Ia butuh JS U1–8; React butuh JS U1–10. Software-design **2 unit lebih awal**.
2. **`teach-api-design` butuh `teach-nodejs` — bukan sekadar JS.**
   Ia mengajarkan **janji** yang dibuat server. Tanpa server yang berjalan,
   tidak ada yang bisa diperiksa.
3. **`teach-system-design` terakhir, dan itu bukan karena ia tersulit.**
   Ia menyusun **banyak** API jadi satu sistem. Kalau satu API-nya belum punya kontrak
   yang benar, menyusunnya hanya **memperbesar** masalahnya.

---

## 3. Enam tahap

### TAHAP 1 — FONDASI · `teach-javascript`

| | |
|---|---|
| **Unit** | 20 unit / 4 tingkatan / 4 gerbang |
| **Durasi** | ± 20 sesi |
| **Yang didapat** | model mental eksekusi · nilai & alamat · fungsi & closure · `async`/`await` |
| **Kenapa pertama** | **Semua** skill lain memakai JavaScript. Tidak ada yang bisa dilewati |

**Unit ⭐ (gagal senyap):** closure · alamat vs isi · `await` yang hilang.

**Gerbang keluar:** Gerbang 4 — review sebagai PR (terima/tolak + alasan).

---

### TAHAP 2 — CARA MENULIS · `teach-software-design`

| | |
|---|---|
| **Unit** | 18 unit / 4 bagian / 4 gerbang |
| **Durasi** | ± 24 sesi |
| **Mulai setelah** | **JS Unit 8** (boleh paralel dengan JS Unit 9–20) |
| **Yang didapat** | membaca kode yang **tidak bisa diubah** · SOLID (dengan koreksi sejarah) · pola · TDD · immutability |

**Kenapa di sini, bukan nanti:** React & Node.js **memakai** JavaScript yang
ditulis dengan disiplin ini. Belajar disiplinnya **sebelum** menulis React =
menghindari bug React nomor satu (*stale closure*) **sebelum** ia terjadi.

**Unit ⭐ (gagal senyap):** Unit 9 (`worker_threads`/blocking) ·
Unit 11 (`Object.freeze` **shallow** — `asli.alamat.kota` berhasil berubah).

> ⚠️ **Boleh paralel dengan `teach-javascript` Unit 9–20.** Jadwal yang sudah ada
> (`JADWAL-BELAJAR.md` Versi 2) menaruhnya di slot Sabtu, mulai minggu 7.

---

### TAHAP 3 — MEMBANGUN TAMPILAN · `teach-react` + `teach-tailwindcss`

| | |
|---|---|
| **Unit** | React 18 unit · Tailwind 15 unit · 4 gerbang masing-masing |
| **Durasi** | ± 18 sesi (React) + ± 8 sesi (Tailwind, sebagai selipan) |
| **Mulai setelah** | **JS Unit 10** |
| **Yang didapat** | UI · state · render · styling · interaksi |

**Urutan di dalam tahap ini:** **React dulu**, Tailwind **sebagai selipan** saat
styling menghambat. Tailwind **tidak punya kegagalan senyap yang butuh kursus** —
ia bisa dipelajari sambil jalan.

**Unit ⭐ (gagal senyap):** React **15** (React membandingkan **alamat**, bukan isi) ·
Tailwind **12** (`` `bg-${warna}-500` `` tidak pernah ada sebagai teks utuh → warna hilang).

> ⚠️ **Jangan** mulai React sebelum JS Unit 8. Stale closure akan terjadi, dan
> pembelajar tidak punya alat untuk memahaminya.

---

### TAHAP 4 — SERVER · `teach-nodejs`

| | |
|---|---|
| **Unit** | 18 unit / 4 bagian / 4 gerbang |
| **Durasi** | ± 18 sesi |
| **Mulai setelah** | **JS Unit 10** |
| **Yang didapat** | HTTP dasar · server · Express · validasi · database · login & sesi · deploy |

**Unit ⭐ (gagal senyap):** **6** (`await` hilang) · **13** (CORS) ·
**15** (data kosong, 4 sebab).

**Gerbang keluar:** server yang **berjalan** — ini prasyarat Tahap 5.

---

### TAHAP 5 — KONTRAK · `teach-api-design` ⬅ **BARU**

| | |
|---|---|
| **Unit** | 18 unit / 4 bagian / 4 gerbang |
| **Durasi** | ± 24 sesi |
| **Mulai setelah** | **`teach-nodejs` selesai** (server berjalan) |
| **Yang didapat** | kontrak · HTTP sebagai bahasa · pagination · idempotency · **caching** · 429 · versioning · OpenAPI |

**Kenapa setelah Node.js:** Node.js mengajarkan **menjalankan** server.
API design mengajarkan **janji** yang dibuat server itu. Janji tanpa server =
tidak ada yang bisa diperiksa.

**Unit ⭐ (gagal senyap) — 7 unit:**

| Unit | Kegagalan |
|---|---|
| 4 | `GET` yang mengubah data — crawler menghapus data |
| 9 | Error tanpa `type` — klien tidak bisa membedakan kegagalan |
| 10 | **Offset pagination** — baris hilang & dobel |
| 11 | `POST` tanpa `Idempotency-Key` — retry → data dobel |
| 12 | `Cache-Control: public` pada data privat — kebocoran |
| 13 | `429` tanpa `Retry-After` — klien menembak terus |
| 17 | GraphQL tanpa batas kedalaman |

**Kenapa sebelum `teach-system-design`:** system-design menyusun **banyak** API.
Kontrak yang belum benar × banyak API = masalah yang diperbesar.

**Dua celah yang ditambal tahap ini** (audit 28 Sep 2026):
**HTTP API caching** (`Cache-Control`/`ETag` → **0 kemunculan** di repo) ·
**Throttling** (hanya 2 baris nama).

---

### TAHAP 6 — SISTEM · `teach-system-design`

| | |
|---|---|
| **Fase** | 12 fase / 4 level |
| **Durasi** | ± 1 tahun untuk Fase 1–2 · **3,5–5 tahun** untuk 12 fase penuh |
| **Mulai setelah** | semua di atas (untuk **berguna**; secara teknis tanpa prasyarat kode) |
| **Yang didapat** | CAP · load balancer · cache · queue · **TLS · JWT · OAuth** · API Gateway · microservices · observability |

**Kenapa terakhir:** ia menjawab *"bagaimana komponen ini **disusun**?"* —
pertanyaan yang baru masuk akal setelah komponennya ada.

**Unit ⭐ (gagal senyap):** cache stampede · thundering herd · retry storm.

> ⚠️ **Jalur 12 fase penuh (3,5–5 tahun @2 jam/minggu) belum diambil.**
> Jadwal sekarang mengambil **Fase 1–2** saja. Fase 3–12 ditinjau ulang nanti.

---

## 4. Yang boleh berjalan BERSAMAAN

> Aturan: **dua tahap boleh paralel kalau yang satu tidak butuh pemahaman
> mendalam dari yang lain.**

| Boleh bersamaan | Kenapa | Contoh |
|---|---|---|
| ✅ **Tahap 1 + 2** | JS U9–20 **tidak** menunggu software-design | JavaScript ↔ Software Design (mulai minggu 7) |
| ✅ **Tahap 3 + 3** | React & Tailwind saling melengkapi | React dulu, Tailwind selipan |
| ✅ **Tahap 4 + 2** | Node.js & software-design sama-sama butuh JS U8 | kalau Tahap 2 belum selesai |
| ✅ **Tahap 6 + apa pun** | Arsitektur tidak punya prasyarat kode | Arsitektur sudah jalan dari minggu 1 |
| ❌ **React sebelum JS U8** | → **stale closure** | React Unit 15 tidak punya pijakan |
| ❌ **Node.js sebelum JS U10** | → data kosong tanpa error | Node Unit 15 punya 4 sebab, salah satunya `await` |
| ❌ **API design sebelum Node.js** | → kontrak tanpa wujud | tidak ada server untuk diperiksa |
| ❌ **System design sebelum API design** | → arsitektur di atas kontrak yang belum benar | menyusun masalah lebih besar |
| ❌ **Software design sebelum JS U8** | → korpus tidak bisa dijalankan | butuh fungsi, objek, array |

**Bentuk paralel yang paling aman:**

```
Senin, Selasa  → JavaScript (Tahap 1)
Rabu           → LIBUR
Kamis, Jumat   → Arsitektur (Tahap 6, Fase 1–2)
Sabtu          → Software Design (Tahap 2) + review
Minggu         → LIBUR
```

Ini yang sudah jalan di `JADWAL-BELAJAR.md` Versi 2.

---

## 5. Gambaran total — 7 skill, 6 tahap

| Tahap | Skill | Unit | Sesi | Mulai setelah | ⭐ |
|---|---|---|---|---|---|
| **1** | `teach-javascript` | 20 | ± 20 | — | 3 |
| **2** | `teach-software-design` | 18 | ± 24 | JS U8 | 2 |
| **3** | `teach-react` | 18 | ± 18 | JS U10 | 1 |
| **3** | `teach-tailwindcss` | 15 | ± 8 | JS U6 | 1 |
| **4** | `teach-nodejs` | 18 | ± 18 | JS U10 | 3 |
| **5** | `teach-api-design` | 18 | ± 24 | Node.js | **7** |
| **6** | `teach-system-design` | 12 fase | ± 40+ | semua | 3 |
| | **TOTAL** | **107 unit + 12 fase** | **± 152 sesi** | | **20** |

**Pada 6 sesi/minggu (30–60 menit) → ± 26 minggu** untuk Tahap 1–5.
**Realistis: 32–40 minggu** — termasuk gerbang yang diulang dan minggu yang meleset.

⚠️ **Tahap 6 tidak dihitung di situ.** Ia jalur jangka panjang (3,5–5 tahun),
berjalan **paralel**, bukan setelah.

---

## 6. Setelah 7 skill ini — yang belum dibangun

| # | Yang belum | Status |
|---|---|---|
| 1 | **`teach-nextjs`** | Teknologi ke-7 dari daftar xcode. **Belum dibangun** — butuh keputusan |
| 2 | **PHP · Laravel · Python** | Ditunda ("Nanti saja"). Jujur: **tidak melayani MISSION** repo ini |
| 3 | **Fase 3–12 `teach-system-design`** | Ada materinya, **belum dijadwalkan** |
| 4 | **`teach-test-ladder`** (skill kerja) | Ada, belum ditinjau |

---

## 7. Batas kejujuran alur ini

1. **Urutan ini rancangan saya**, disusun dari **tabel prasyarat** (§2) — bukan dari
   riset yang mengukur urutan mana paling efektif. Prasyaratnya **fakta** (unit mana
   dipakai unit mana); **urutan optimalnya tidak diuji**.
2. **Angka sesi itu hitungan**, bukan pengalaman. Belum ada yang menjalani 7 skill ini
   sampai selesai.
3. **`teach-api-design` belum dijalankan siapa pun.** 24 sesinya perkiraan.
4. **Tahap 2 (software-design) di posisi 2 adalah pilihan, bukan keharusan.**
   Argumennya: React & Node.js memakai JS yang ditulis dengan disiplin itu.
   Argumen sebaliknya: React lebih konkret & memotivasi lebih cepat.
   **Keduanya sah.** Yang **tidak** sah: melewati JS U8.
5. **Tahap 6 (system-design) tidak punya dasar riset pedagogis** — dan
   `teach-software-design` juga tidak. Dikatakan di depan, bukan disembunyikan.
6. **`teach-api-design` juga belum punya dasar riset pedagogis khusus.**
   PRIMM & Parsons dipinjam dari skill lain; **belum diuji untuk topik API**.

---

**📅 Dibuat:** 29 September 2026
**📚 Terkait:** `JADWAL-BELAJAR.md` (Versi 2) · `ALUR-FUNDAMENTAL-SOFTWARE-ENGINEER.md` ·
`AUDIT-API-DESIGN-20-KONSEP.md` · skill `teach-javascript` … `teach-system-design`
