# Roadmap 4 Bagian / 18 Unit — Software Design Mode Inspeksi

> **Untuk tutor.** File ini adalah detail yang tidak dimuat di `SKILL.md`.
> WAJIB dibaca sebelum menjawab "apa berikutnya untuk saya?"
>
> **Jangan pernah** menyuruh pembelajar membaca file ini (§MODE PENYAMPAIAN).
> Tutor membaca, lalu menjelaskan.
>
> **Dibuat:** 28 September 2026
> **Sumber kerangka:** `teach-tailwindcss` (skill sejajar)
> **Tujuan akhir:** pembelajar bisa **menilai desain kode hasil AI** — menemukan kode
> yang *terlihat rapi* tapi **tidak bisa diubah**, dan memutuskan perbaikannya.
>
> **Bidang skill ini:** **rekayasa perangkat lunak** — cara menulis & merawat kode
> **di dalam** satu aplikasi. **Bukan** arsitektur sistem (lihat §10).

---

## Peta file referensi — jangan tumpang tindih

| File | Isinya | Kapan dipakai |
|---|---|---|
| **`roadmap-4-tingkat.md`** (ini) | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| **`peta-unit.md`** | **Detail per unit**: konsep, kode yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| **`korpus-ai.md`** | Cara menyiapkan **korpus kode AI** + 4 jenis latihan inspeksi | Sebelum menyiapkan sesi latihan |
| **`sintaks-javascript.md`** | **Kamus istilah & pola JS** (OOP, `freeze`, `worker_threads`, `Promise`) + tingkat bahaya | Saat pembelajar bertanya "ini artinya apa?" |
| **`cakupan-vs-dokumen-resmi.md`** | **Audit cakupan** vs sumber resmi: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

**Aturan anti-drift:** detail satu unit **hanya boleh** hidup di `peta-unit.md`.
Detail korpus **hanya boleh** hidup di `korpus-ai.md`. Kamus istilah **hanya** di
`sintaks-javascript.md`. File ini tidak mengulanginya — ia hanya menunjuk.

---

## 0. Prinsip yang mengikat seluruh roadmap

1. **Bagian 0 (kenapa desain penting) adalah PRASYARAT.** Tidak boleh dilewati.
   Membahas SOLID sebelum pembelajar pernah **merasakan** kode yang sulit diubah =
   menghafal singkatan.
2. **Korpus wajib kode hasil generate AI.** Bukan kode contoh buatan tutor. Lihat §5.
3. **Satu unit = 1–2 sesi.** Satu sesi = satu konsep, maksimal 1 jam.
4. **Urutan tidak boleh dilompati.** Setiap bagian punya gerbang yang bisa diperiksa.
5. **Gerbang gagal = ulangi bagian itu**, bukan lanjut.
6. **Setiap sesi wajib punya momen salah prediksi.** Kalau tidak, materinya terlalu mudah.
7. **Semua tebakan ditulis di editor** (`prediksi.md`), bukan di kertas. Urutan PREDIKSI →
   JALANKAN diperiksa lewat timestamp.
8. **Istilah asing BUKAN "di luar materi".** Kode AI memakai `class`, `extends`,
   `Object.freeze`, `new Worker`, `Promise.all` sejak baris pertama. Kalau pembelajar
   bertanya → cek `sintaks-javascript.md`, jelaskan **satu istilah**, lanjut.
9. **Multithreading diajarkan DUA KALI dengan sudut berbeda** (keputusan xcode):
   **Unit 9** = di JavaScript (yang bisa dijalankan pembelajar) ·
   **Unit 10** = sebagai **konsep umum** (GIL Python, model thread). Jangan digabung.
10. **Riset pedagogis untuk skill ini BELUM ADA.** Skill `teach-*` lain bersandar pada
    PRIMM/Parsons/tracing. Untuk **desain perangkat lunak**, dasar itu **belum
    terkumpul** — lihat §9. Jangan mengarang dasarnya.
11. **Level 4 hanya dijalankan kalau Level 1–3 lulus.** Ia mengandaikan kemampuan
    menilai kode yang belum dimiliki pemula. Ini bukan penundaan sewenang-wenang.

---

## 1. BAGIAN 0 — PRASYARAT: KENAPA DESAIN PENTING (Unit 1–3)

**Yang dilatih:** **merasakan** sakitnya desain buruk — sebelum tahu nama obatnya.
**Korpus:** satu file JS hasil AI, **20–40 baris**, yang "jalan tapi kaku".
**Prasyarat:** `teach-javascript` Unit 1–8 (fungsi, objek, array).
**Alat:** Terminal + Node.js. Belum ada framework, belum ada test runner.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 1 | **Kode yang jalan ≠ kode yang bisa diubah** | Empat gejala desain membusuk dari paper Martin 2000: **rigidity** (satu perubahan menyebar), **fragility** (rusak di tempat tak terduga), **immobility** (tidak bisa dipakai ulang), **viscosity** (jalan pintas lebih mudah dari jalan benar) | Diberi file 30 baris. **Sebut gejala mana** yang muncul kalau satu persyaratan diubah | Martin (2000) *Design Principles and Design Patterns* §*Symptoms of Rotting Design* |
| 2 | **Perubahan yang menyebar** | Kenapa `if (tipe === 'A') … else if (tipe === 'B')` yang muncul **di 5 tempat** adalah masalah. Setiap tipe baru = 5 file disentuh | Ubah **satu persyaratan** → hitung **berapa tempat** harus diedit. Prediksi dulu, baru buktikan | Martin (2000) — rigidity |
| 3 | **Kenapa ini penting untuk KAMU** | Kode AI **selalu jalan** dan **sering terlihat rapi**. Masalahnya muncul **3 bulan kemudian**, saat kamu minta perubahan kecil | Dari dua versi kode yang **sama-sama jalan**, tentukan mana yang lebih mudah diubah — **dan sebut alasannya** | Stack Overflow Survey 2025: 66% *"almost right, but not quite"* |

### → GERBANG 1 — Rasakan, beri nama, tanpa solusi

Diberi **satu file JS hasil AI** (± 40 baris) yang belum pernah dilihat, dengan **satu
persyaratan baru** (mis. "sekarang harus mendukung tipe C").

**Tanpa menulis kode**, tuliskan:

1. **Berapa tempat** yang harus diedit — dan **sebutkan tempatnya**
2. **Gejala mana** dari empat gejala Martin yang muncul (boleh lebih dari satu)
3. **Satu kalimat:** kenapa kode ini sulit diubah — dalam kata-katamu sendiri

**Lulus kalau poin 1 dan 3 benar.** Poin 2 boleh memakai istilah Martin
(`rigidity`/`fragility`) atau kata sendiri — **yang penting gejalanya tepat**.

> **Kenapa gerbang ini ada:** SOLID tanpa gerbang ini = menghafal lima huruf.
> Pembelajar harus **kenal gejalanya dulu**, baru diberi nama obatnya.
> Gerbang ini **sengaja tidak meminta solusi** — solusi baru ada di Bagian 1.

**Gagal?** Ulangi Unit 1–3 dengan file yang lebih pendek (20 baris, bukan 40).

---

## 2. BAGIAN 1 — PRINSIP: KODE YANG BISA DIUBAH (Unit 4–7)

**Yang dilatih:** menamai masalah desain, dan **mengenali solusinya di kode AI**.
**Korpus:** satu modul JS hasil AI, **40–80 baris**, dengan `class` atau fungsi pabrik.
**Alat:** Terminal + Node.js.

> 🔴 **KOREKSI PENTING — jangan diajarkan salah.**
> Paper Martin (2000) memuat **4 prinsip**: OCP · LSP · ISP · DIP.
> **Paper itu TIDAK memuat SRP**, dan **TIDAK memuat akronim "SOLID"**.
> Mencari `"Single Responsibility"` → **0 hasil**. Mencari `"SOLID"` → **0 hasil**.
> Urutan benar: **2000 = 4 prinsip** → SRP menyusul (akhir 1990-an) → akronim **SOLID**
> diusulkan **Michael Feathers** ⚠️ (sumber sekunder).
> **Jangan menulis "SOLID diperkenalkan Martin 2000".**

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 4 | **Tanggung jawab tunggal (SRP)** | *"Setiap modul seharusnya punya satu dan hanya satu alasan untuk berubah."* Martin menegaskan: *"This principle is about people."* Kenapa "satu hal" itu kabur, dan "satu **orang yang minta perubahan**" itu jelas | Sebut **berapa orang/divisi** yang bisa meminta perubahan pada satu file, **dan bagian mana** masing-masing | Martin (2014) *The Single Responsibility Principle*, blog resmi |
| 5 | **Terbuka–tertutup (OCP)** | *"A module should be open for extension but closed for modification."* Menambah kemampuan **tanpa** mengedit kode yang sudah lulus uji | KLAIM: *"menambah jenis laporan baru tidak perlu mengubah file lama"* → verifikasi | Martin (2000) — OCP |
| 6 | **Substitusi & ketergantungan (LSP · DIP)** | LSP: *"Subclasses should be substitutable for their base classes."* DIP: *"Depend upon Abstractions. Do not depend upon concretions."* Kenapa `new LaporanPDF()` di dalam fungsi adalah masalah | Ganti satu implementasi **tanpa** menyentuh pemanggilnya — prediksi apakah mungkin, lalu buktikan | Martin (2000) — LSP, DIP |
| 7 | **Pemisahan antarmuka (ISP)** + **kapan berhenti** | *"Many client specific interfaces are better than one general purpose interface"*. **Dan batas jujurnya:** prinsip ini bisa disalahgunakan jadi puluhan file kecil | Putuskan: satu file besar vs lima file kecil — **mana yang lebih mudah dirawat di sini**, dan kenapa | Martin (2000) — ISP |

> **Unit 7 adalah sikap, bukan teknik.** Tanpa unit ini, pembelajar cenderung
> **memecah segalanya** untuk "menaati prinsip". Yang diajarkan: prinsip itu **alat
> menilai**, bukan **aturan yang harus dipatuhi buta**.

### → GERBANG 2 — Namai prinsip, dan putuskan

Diberi **satu modul JS hasil AI** (± 60 baris) yang punya **dua masalah desain**.

1. Sebut **prinsip mana** yang dilanggar di tiap masalah (boleh menyebut lebih dari satu)
2. **Usulkan perbaikan** untuk salah satunya — cukup **satu**, tidak perlu keduanya
3. Jelaskan: *"perbaikan ini menambah/mengurangi apa?"* — jujur soal biayanya

**Lulus kalau poin 1 benar dan poin 3 menyebut biaya.** Perbaikan yang mengaku
"lebih baik di segala hal" = **gagal** (tidak ada perbaikan tanpa biaya).

---

## 3. BAGIAN 2 — POLA & DATA AMAN (Unit 8–11)

**Yang dilatih:** mengenali **pola** di kode AI, termasuk pola favorit yang salah.
**Korpus:** satu folder kecil hasil AI (2–4 file, 80–150 baris total).
**Alat:** Terminal + Node.js. Mulai Bagian ini: **`node:test`** (bawaan, tanpa instalasi).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 8 | **Pola pabrik & dekorator** | **Factory Method** (*Creational*): *"provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created."* **Decorator** (*Structural*): *"lets you attach new behaviors to objects by placing these objects inside special wrapper objects"* — jawaban untuk *"combinatorial explosion of subclasses"* | KLAIM: *"menambah varian baru tidak perlu mengubah kode lama"* → verifikasi. Bandingkan dengan Unit 5 (OCP) | GoF (1994), ISBN 0201633612; katalog pola per halaman |
| 9 | **Multithreading di JavaScript** ⭐ | Node.js memproses **satu pernyataan pada satu waktu** (MDN: *"the interpreter can only process one statement at a time"*). Kode CPU-berat **memblokir** — **tanpa error apa pun**. `worker_threads` adalah jawabannya. 🔴 **Batasnya (verbatim Node docs):** *"They do not help much with I/O-intensive work. The Node.js built-in asynchronous I/O operations are more efficient than Workers can be."* | **TELUSUR:** aplikasi "menggantung" saat memproses data besar — **tidak ada error di console**. Cari sebabnya | Node.js docs `node:worker_threads`; MDN *JavaScript execution model* |
| 10 | **Multithreading sebagai konsep umum** | Model **"satu per satu"** muncul di banyak bahasa. Python: *"only one thread executes Python bytecode at a time"* (GIL). Python 3.13+: *"the GIL can be disabled using the `--disable-gil` build configuration."* **Kapan pakai apa** — dan kenapa jawabannya tergantung **CPU-bound vs I/O-bound** | Diberi tiga skenario, tentukan: **paralel benar-benar perlu, atau tidak?** Sebut alasannya | Python docs: Glossary `global interpreter lock`, `concurrency`, `parallelism`, `free threading` |
| 11 | **Immutability & TDD** ⭐⭐ | **`Object.freeze` itu SHALLOW dan gagal SENYAP.** MDN: *"only applies to the immediate properties of `object` itself"*. Objek bersarang **tidak ikut beku**. Lalu **TDD**: *"the most common way that I screw up TDD is neglecting the third step"* — **Red → Green → Refactor**, dan refactor-lah yang paling sering dilupakan | **TELUSUR:** "kenapa data saya tetap berubah padahal sudah saya `freeze`?" — tanpa error. Lalu tulis **satu tes** yang gagal dulu (Red), baru perbaiki | MDN `Object.freeze()`; Fowler (2023) *Test Driven Development*; Beck (2002) ISBN 0321146530; `node:test` |

> **Unit 9, 10, dan 11 adalah inti Bagian ini** — ketiganya **gagal tanpa error**.
> Unit 9 & 11 adalah ⭐ (kegagalan senyap); Unit 11 memuat **dua** konsep berbeda
> (`freeze` dan TDD) — **wajib dipecah jadi 2 sesi**, jangan digabung satu sesi.

### → GERBANG 3 — Kenali pola, temukan kegagalan senyap

**Tiga bagian, semua harus lulus:**

**(a) Statis.** Diberi kode AI yang memakai **satu pola** dari Unit 8. Sebut:
pola apa, klasifikasi (*Creational*/*Structural*/*Behavioral*), dan **satu
kelemahannya**.

**(b) Dinamis (TELUSUR).** Diberi kode yang **sudah dijalankan**, hasilnya salah,
**tanpa pesan error** — dari Unit 9 atau Unit 11.
`hasil.md` harus memuat **minimal dua dugaan tertulis** — salah satunya boleh salah.

**(c) TDD.** Tulis **satu tes yang gagal dulu** (Red), lalu perbaiki sampai hijau,
lalu **refactor** dan sebut apa yang dirapikan.

**Lulus kalau poin (b) menunjuk penyebab yang benar, dan (c) benar-benar mendahulukan tes.**

---

## 4. BAGIAN 3 — MENILAI & MEMUTUSKAN (Unit 12–15) · **opsional, setelah Level 1–3 lulus**

**Yang dilatih:** menjalankan **review desain** pada kode yang bukan buatan sendiri.
**Korpus:** satu modul hasil AI yang lebih besar (150–300 baris, 3–5 file).
**Alat:** Terminal + Node.js + `node:test`.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 12 | **Singleton — pola favorit AI yang paling sering salah** | **Singleton** (*Creational*): *"lets you ensure that a class has only one instance, while providing a global access point to this instance."* 🔴 **Kritik dari katalognya sendiri (verbatim):** *"Violates the Single Responsibility Principle. The pattern solves two problems at the time."* · *"requires special treatment in a multithreaded environment so that multiple threads won't create a singleton object several times"* · *"Or just don't write the tests. Or don't use the Singleton pattern."* | **TELUSUR:** dua bagian aplikasi saling mengganggu lewat state bersama. Cari penyebabnya — **tanpa menyalahkan "bug"** | Katalog pola — Singleton, §*Criticism* |
| 13 | **Observer & aliran data** | **Observer** (*Behavioral*): *"lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing."* Kenapa ini **mudah bocor** (listener tidak pernah dilepas) | KLAIM: *"halaman ini bersih saat ditutup"* → verifikasi (cek listener yang tersisa) | Katalog pola — Observer |
| 14 | **Streaming & batas memori** | Perbedaan **streaming** vs **menampung semua di memori**. SSE: *"This is a one-way connection, so you can't send events from a client to a server."* ⚠️ Batas nyatanya: *"the limit is per browser and is set to a very low number (6). The issue has been marked as 'Won't fix' in Chrome and in Firefox."* | Prediksi: pada 1.000 baris data, mana yang lebih dulu kehabisan memori — dan **kenapa** | MDN *Using server-sent events*; WHATWG HTML Standard |
| 15 | **Review desain & keputusan** | Bentuk review: **klaim → bukti → risiko → keputusan**. Kenapa *"jalan kok"* bukan alasan. Kapan **menolak** perbaikan karena biayanya lebih besar dari manfaatnya | Tulis **review lengkap**: satu klaim, satu bukti, satu risiko, **terima/tolak + alasan** | Martin (2000) — viscosity; Addy Osmani, *Agentic Code Review* |

> **Unit 15 menutup lingkaran.** Pembelajar kembali ke tempat ia mulai (Unit 1: gejala
> desain membusuk) — tapi sekarang ia bisa **menamai** gejalanya, **menemukan**
> penyebabnya, dan **memutuskan** dengan alasan. Itu definisi SELESAI skill ini.
>
> ⚠️ **Bagian 3 berbeda dari tiga bagian lain.** Ia **bukan** lanjutan wajib. Ia
> **magang**: menilai kode yang lebih besar. Kalau Level 1–3 belum lulus, bagian ini
> akan terasa seperti menebak.

### → GERBANG 4 — Review yang bisa dibantah

Diberi **satu modul hasil AI** (± 200 baris) yang belum pernah dilihat.

Tulis review berisi **keempatnya**:

1. **Klaim** — satu hal yang kode itu *katakan* tentang dirinya (dari komentar/nama fungsi)
2. **Bukti** — apakah klaimnya benar? Sebut cara kamu memeriksanya
3. **Risiko** — satu masalah desain (boleh pola yang salah, boleh `freeze` yang bocor,
   boleh streaming yang menampung semua)
4. **Keputusan** — **terima atau tolak** + alasan

**Lulus kalau keputusannya beralasan**, bukan kalau keputusannya "benar".

- Menolak kode yang sebenarnya baik **dengan alasan jelas** = **lulus**
- Menerima kode yang gagal senyap **tanpa alasan** = **gagal**
- Menerima karena *"sudah saya jalankan dan jalan kok"* = **gagal**

---

## 5. Aturan Korpus — kode hasil generate AI

| Bagian | Korpus | Ukuran |
|---|---|---|
| 0 | Satu file JS hasil AI, "jalan tapi kaku" | 20–40 baris |
| 1 | Satu modul JS hasil AI dengan `class`/pabrik | 40–80 baris |
| 2 | Satu folder hasil AI | 2–4 file, 80–150 baris |
| 3 | Satu modul lebih besar hasil AI | 150–300 baris, 3–5 file |

**Yang perlu tutor ingat di sini (detail lengkap di `korpus-ai.md`):**

1. Tutor **tidak menulis kode sendiri** untuk latihan. Kalau perlu kode, minta AI
   menghasilkannya, lalu pakai hasilnya **apa adanya** — jangan dirapikan.
2. **Yang dicari adalah kode yang *terlihat* benar.** Kode yang jelas salah terlalu mudah.
3. Kode disalin ke `PRAKTIK/sesi-NNN/`. **Tidak pernah** dijalankan di repo produksi.
4. **Untuk TELUSUR:** korpusnya harus **sudah dijalankan**, hasilnya salah,
   tapi **tidak ada error di console**. Kalau ada error → itu latihan baca stack trace,
   bukan TELUSUR. Dan **jangan tandai di mana cacatnya.**
5. **Cacat khas kode AI di bidang ini** (daftar lengkap: `korpus-ai.md` §3):
   `freeze` pada objek bersarang (mengira sudah aman) · `await` di dalam loop · CPU-berat
   di jalur utama · `class` yang menangani 4 hal · `new SomethingConcrete()` di dalam
   fungsi · singleton sebagai jalan pintas · listener tanpa `removeEventListener` ·
   menampung seluruh data di memori sebelum diproses · tes yang ditulis **setelah** kode.

→ **Cara menyiapkan korpus, daftar cacat khas, dan empat jenis latihan inspeksi
(LACAK · SUSUN · KLAIM · TELUSUR): baca `korpus-ai.md`.**

---

## 6. Bentuk Sesi (6 tahap, ≤ 1 jam) — versi terminal

```
1. PREDIKSI   (10')  Tutor serahkan PRAKTIK/sesi-NNN/kode-ai.js. DILARANG dijalankan.
                     Pembelajar tulis tebakan → PRAKTIK/sesi-NNN/prediksi.md (SIMPAN).
                     ← Tutor baca prediksi.md SEBELUM melanjutkan.
2. JALANKAN   ( 5')  node kode-ai.js (atau node --test). Bandingkan. Di mana meleset?
3. BEDAH      (20')  (a) LACAK / (b) SUSUN / (c) KLAIM / (d) TELUSUR → tulis hasil.md
4. UBAH       (10')  Ubah SATU hal kecil (satu persyaratan, satu baris). Prediksi lagi.
5. PERBAIKI   (10')  Kalau ada bug: (i) tulis tes yang GAGAL dulu → (ii) perbaiki →
                     (iii) refactor → (iv) jalankan → "apakah ini bisa merusak yang lain?"
6. CATAT      ( 5')  LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi
```

**Verifikasi urutan (bisa diperiksa):**

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

Timestamp `prediksi.md` **harus lebih tua** daripada waktu kode dijalankan.
Kalau tidak → sesi diulang.

> **Tahap PERBAIKI di skill ini punya bentuk khusus: TDD.**
> Urutannya **tidak boleh dibalik**: **tes gagal dulu**, baru kode diperbaiki.
> Kalau pembelajar memperbaiki kode lalu menulis tes yang mengikuti kodenya,
> **tegur** — itu bukan TDD, itu dokumentasi.

### Empat bentuk tahap BEDAH — ringkas

| Kode | Nama | Kapan dipakai | Unit |
|---|---|---|---|
| **(a)** | **LACAK** — telusuri alur eksekusi, nilai tiap variabel | Menguji *notional machine* | 1–3, 9, 10 |
| **(b)** | **SUSUN** — baris diacak, susun ulang (*Parsons*) | Melatih struktur tanpa menulis dari nol | 5, 8, 12, 14 |
| **(c)** | **KLAIM** — tentukan apakah klaim kode itu benar | Melatih deteksi "hampir benar" | 5, 6, 8, 13 |
| **(d)** | **TELUSUR** — hasil salah, **tanpa error** → cari sebabnya | **Melatih memburu sebab (debug)** | **9, 11, 12** · juga 1, 10, 13, 14 |

> ⚠️ **Parsons Problem: jangan pakai distractor di Bagian 0.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan baris pengecoh **menurunkan
> efisiensi belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.
> Cara menulis Parsons Problem yang benar: **`korpus-ai.md` §4(b)**.

> ⚠️ **TELUSUR: dugaan WAJIB ditulis sebelum menyentuh kode.**
> Protokol 5 langkah: **KATAKAN → DUGA → UJI → SEMPITKAN → BUKTIKAN**.
> **Satu alat per dugaan** — dan di skill ini alatnya `console.log`, bukan debugger.
> Protokol lengkap: **`korpus-ai.md` §4(d)**.

> ⚠️ **`console.log` bukan pengganti dugaan.** Ia membuat memburu lebih cepat,
> bukan lebih benar. Kalau pembelajar menyebar `console.log` tanpa dugaan dulu,
> tegur — itu TELUSUR yang tidak dijalankan.

---

## 7. Aturan Memakai AI

Menurut RCT Anthropic (Januari 2026), **cara** memakai AI menentukan hasilnya:

| Cara memakai AI | Skor pemahaman |
|---|---|
| Tanya konsep, kerjakan sendiri | **di atas 65%** |
| Copy-paste kode yang dihasilkan | **di bawah 40%** |
| Rata-rata seluruh grup AI | 50% |
| Kerjakan sendiri tanpa AI | 67% |

Gap terbesar ada di soal **debugging**.

**Aturan yang diturunkan dari ini:**

| Aturan | Kenapa |
|---|---|
| **Tulis tebakan 2–3 kalimat dulu**, baru boleh bertanya ke AI. Pakai jawaban AI untuk **menguji teori**, bukan menggantinya | Pola ini skornya di atas 65% |
| **Minta penjelasan sebelum minta kode.** *"Jelaskan cara kerjanya, alternatifnya, dan trade-off-nya."* | Sama |
| **Kalau AI memberi modul, pembelajar wajib bisa menjelaskan alur tiap fungsinya.** Kalau tidak bisa → jangan pakai | MIT Media Lab: pengguna LLM kesulitan mengutip karyanya sendiri |
| **Perlakukan hasil AI seperti PR dari junior.** Baca, kritik, bantah | *"Would you merge it just because the tests passed?"* |
| **Sesekali, tulis ulang dari nol** modul yang AI tulis. Ukur berapa yang hilang | Mengukur *cognitive debt* |
| **Tutup sesi dengan satu pertanyaan:** hari ini saya belajar, atau cuma menutup tugas? | Mengirim dan belajar itu dua hal berbeda |

---

## 8. Kalau Berhenti di Tengah

Normal. Yang **tidak** boleh: mengulang dari Unit 1.

```
Berhenti di Unit 1–3    → ulangi latihan unit terakhir, lanjut
Berhenti di Unit 4–7    → langsung lanjut, tidak perlu mengulang
Berhenti di Unit 8–11   → selesaikan Unit 11 (pecah 2 sesi), jangan digabung
Berhenti di Unit 12–15  → selesaikan Unit 15 walau hasil review-nya jelek
```

**Potong lingkupnya, jangan gandakan jamnya.** Satu jam yang konsisten mengalahkan
empat jam setiap Sabtu. Sisipkan 1 hari kosong per minggu.

---

## 9. Batas Kejujuran

- 🔴 **Skill ini TIDAK punya dasar riset pedagogis.** `teach-javascript`, `teach-react`,
  `teach-nodejs`, dan `teach-tailwindcss` semuanya bersandar pada PRIMM, Parsons
  Problems, dan ambang tracing 50%. **Untuk desain perangkat lunak, dasar itu belum
  terkumpul.** Isi skill ini disusun dari **sumber primer bidangnya** (paper Martin,
  katalog pola, dokumentasi resmi) — **bukan** dari penelitian cara mengajarkannya.
  **Ini keterbatasan yang diakui, bukan diabaikan.**
- **Ambang 50% tracing tetap dipakai** (Lister et al. 2004) supaya konsisten dengan
  skill lain. Tapi di sini konteksnya **lebih jauh lagi**: studi 2004 mengukur
  **melacak kode**, sedangkan skill ini menilai **kualitas desain**. Adaptasi ini
  **belum teruji, dan lebih lemah dasarnya** daripada di skill lain.
- **Urutan 18 unit belum diuji.** Ia disusun dari **masalah yang paling sering muncul
  di kode AI**, bukan dari studi urutan pembelajaran desain perangkat lunak.
- **Pemecahan 4 bagian belum diuji.** Bagian 3 (Unit 12–15) sengaja opsional — dan
  pembagian itu adalah **penilaian**, bukan hasil penelitian.
- **Buku berhak cipta tidak dibaca isinya.** GoF (1994) dan Beck (2002) hanya
  diverifikasi **keberadaan, penerbit, ISBN, tanggal terbit** — **bukan isinya**.
  Kalau materi mengutipnya, sebut **buku**-nya, jangan mengaku mengutip halaman tertentu.
- **Akronim SOLID oleh Michael Feathers** → **sumber sekunder**. Belum diverifikasi ke
  sumber primer. Ditandai ⚠️ dan tidak boleh ditulis sebagai fakta pasti.
- **`refactoring.guru` bukan dokumentasi resmi.** Ia katalog pihak ketiga yang populer
  dan bisa diperiksa. Untuk definisi pola, ia **merujuk** ke GoF. Keterbatasan yang diakui.
- **Panduan "pakai multithreading kapan" belum lengkap.** Dokumentasi Python hanya
  **deskriptif** — tidak ada panduan preskriptif "pakai threading kapan". Halaman modul
  `threading`/`multiprocessing`/`asyncio` **belum diambil**. **Jangan menulis tabel
  "pakai X kalau Y" seolah-olah dari dokumentasi.**
- **Streaming baru satu sisi.** SSE sudah dibaca; **WebSocket belum**. Perbandingannya
  masih timpang.
- **Istilah "single-threaded" TIDAK dipakai sebagai kutipan resmi.** Dokumentasi Node.js
  dan MDN **tidak memuat** pernyataan *"Node.js is single-threaded"* / *"JavaScript is
  single-threaded"* sebagai kalimat berdiri sendiri. Yang akurat (verbatim MDN):
  *"the interpreter can only process one statement at a time."*
- **Payment gateway TIDAK ada di skill ini.** Keputusan xcode: ia masuk **`teach-nodejs`**.
  Dan **belum boleh ditulis** sampai sumber per provider (Midtrans/Xendit/Stripe) serta
  PCI DSS diambil — ia menyentuh **uang nyata**.
- **Bagian 0 3 unit mungkin terlalu sedikit.** Kalau di praktiknya pembelajar masih
  tersandung "kenapa kode ini sulit diubah", **tambahkan** — jangan paksakan lanjut.
- **Tingkat bahaya di `sintaks-javascript.md` adalah penilaian, bukan hasil riset.**
- **Sumber berubah.** Audit cakupan memakai sumber yang dibuka **28 Sep 2026**.

---

## 10. Batas dengan `teach-system-design` — jangan tumpang tindih

| | `teach-system-design` | **`teach-software-design`** (ini) |
|---|---|---|
| Pertanyaan yang dijawab | *"Bagaimana komponen-komponen ini disusun?"* | *"Bagaimana kode ini ditulis supaya bisa diubah?"* |
| Satuan | **Sistem** — layanan, database, antrian, jaringan | **Kode** — kelas, fungsi, modul, tes |
| Contoh isi | caching, message queue, load balancing, CAP, TLS, JWT, OAuth | SOLID, design patterns, TDD, immutability, multithreading |
| Kapan dipakai | Setelah aplikasi jalan, saat menambah layanan | **Sementara menulis** kode — setiap hari |
| Dasar riset | PRIMM/tracing **juga belum** terkumpul untuk topik ini | **Belum ada** (lihat §9) |

**Aturan pembagian:**

1. **Jangan mengajarkan caching / queue / TLS / JWT / OAuth di skill ini.**
   Keempatnya **sudah punya materi dalam** di `teach-system-design`
   (`14-cache.md` 1.174 baris · `04-message-queues.md` 1.346 baris ·
   `17-keamanan-sistem.md` 2.010 baris). Mengulang di sini = duplikasi.
2. **Jangan mengajarkan SOLID / patterns / TDD di `teach-system-design`.**
   Itu bidang skill ini.
3. **Yang benar-benar tumpang tindih hanya satu: multithreading.** Di sini dibahas
   sebagai **cara kerja kode**; di `teach-system-design` sebagai **kapasitas sistem**.
   Kalau pembelajar bertanya soal yang kedua → arahkan ke sana.
4. **Urutan yang disarankan:** `teach-software-design` **lebih dulu**, karena ia
   mengajarkan cara **menulis** kode yang akan disusun jadi sistem. Lihat
   `SKILL.md` §Langkah 4.

---

**📅 Dibuat:** 28 September 2026
**📚 Terkait:** `SKILL.md` · `teach-tailwindcss/references/roadmap-4-tingkat.md` (kerangka asal)
**🔬 Sumber utama bidangnya:** Martin (2000) · GoF (1994) · Fowler (2023) · Beck (2002) ·
MDN · Node.js docs · Python docs
