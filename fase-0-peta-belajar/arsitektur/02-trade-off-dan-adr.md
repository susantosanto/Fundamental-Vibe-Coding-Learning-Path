# 02 — Trade-off & ADR

> **Level:** Menengah
> **Waktu:** 55 menit
> **Yang Anda dapat:** cara menimbang pilihan secara sistematis, dan cara mencatatnya agar tidak lupa

---

## 📖 Apa itu trade-off sebenarnya

Setiap keputusan teknis punya **harga**. Bukan hanya manfaat.

> **Trade-off adalah ketika Anda memilih untuk mendapat sesuatu, dengan sadar menerima bahwa Anda kehilangan sesuatu yang lain.**

Kebanyakan orang hanya melihat sisi manfaatnya:

```
"Saya pakai cache supaya cepat."            ← hanya manfaat
"Saya pakai microservices supaya scalable." ← hanya manfaat
```

Yang tidak disebutkan:

```
Cache:          mendapat kecepatan, membayar dengan inkonsistensi + kompleksitas invalidasi
Microservices:  mendapat skalabilitas independen, membayar dengan kompleksitas operasional
                + debugging lintas service + konsistensi data yang sulit
```

**Arsitektur yang matang bukan yang menghindari trade-off. Ia yang mengetahui trade-off-nya dan memilih dengan sadar.**

### Uji sederhana

Untuk setiap keputusan teknis yang Anda buat, coba lengkapi dua kalimat ini:

```
Saya memilih ___ karena ___.
Harganya adalah ___.
```

Kalau Anda tidak bisa menyelesaikan kalimat kedua, **Anda belum mengambil keputusan** — Anda baru memilih yang familiar.

**Contoh pengisian:**

```
Saya memilih SQLite karena aplikasi ini hanya diakses oleh 3 staf
sekolah di satu komputer, dan tidak perlu server database terpisah.
Harganya adalah tidak bisa diakses dari luar jaringan, dan akan
menghambat kalau nanti siswa perlu akses sendiri.

→ Perhatikan: saya TAHU batasnya. Itu yang membuatnya keputusan,
  bukan kebiasaan.
```

---

## Cara menyatakan kebutuhan secara presisi

Sebelum menimbang, Anda butuh tahu **apa yang sebenarnya Anda butuhkan**. Ini lebih sulit dari yang terlihat.

### Masalah dengan pernyataan kabur

```
❌ "Sistemnya harus cepat."
❌ "Sistemnya harus aman."
❌ "Sistemnya harus scalable."
```

Ketiganya tidak bisa dinilai. Cepat untuk siapa? Berapa cepat? Aman dari apa?

### Quality attribute scenario

Cara menyatakannya secara presisi — dan ini format yang bisa Anda pakai:

```
Ketika  [situasi/pemicu]
Sistem harus  [respons terukur]
Dalam  [kondisi tertentu]
```

**Contoh:**

| Kabur | Presisi |
|---|---|
| "Harus cepat" | "Ketika 100 guru mengakses bersamaan pada jam 07:00, halaman absensi harus terbuka dalam **< 2 detik** di 95% permintaan." |
| "Harus aman" | "Ketika pengguna yang login sebagai guru kelas 6A mengakses data kelas 6B, sistem harus **menolak dengan 403**." |
| "Harus scalable" | "Sistem harus menangani **10× jumlah sekolah saat ini** tanpa perubahan arsitektur." |
| "Harus tersedia" | "Sistem harus tersedia **99% selama jam sekolah (07:00–15:00)**, dan boleh mati di luar itu." |

Perhatikan: versi presisi **bisa diukur**. Itu bedanya. Dan yang bisa diukur bisa diuji — dan yang bisa diuji bisa dijaga (lihat fitness function di `01`).

### Kenapa ini penting

Tanpa presisi, Anda tidak bisa:

- **Menilai** apakah desain Anda memenuhi kebutuhan
- **Memilih** antara dua opsi (lebih baik dalam hal apa?)
- **Tahu** kapan optimasi sudah cukup

Dan yang paling berbahaya: tanpa presisi, Anda akan **over-engineer**. Karena "harus scalable" tanpa angka bisa berarti apa saja — dan ketakutan membuat orang mendesain untuk skala tak terbatas.

---

## Aturan minimal 3 opsi

Ini kebiasaan yang mengubah kualitas keputusan Anda secara permanen.

> **Sebelum memutuskan, tulis minimal 3 opsi. Termasuk "tidak melakukan apa-apa".**

### Kenapa minimal 3

```
1 opsi   → bukan keputusan. Itu kebiasaan.
2 opsi   → sering jadi "yang saya kenal" vs "yang saya tidak kenal".
           Perbandingannya jadi soal kenyamanan, bukan kebutuhan.
3 opsi   → memaksa Anda berpikir tentang RUANG solusi, bukan dua titik.
```

Opsi ketiga hampir selalu yang paling menarik, karena ia memaksa Anda keluar dari biner "pakai / tidak pakai" menjadi "bagaimana lagi bisa diselesaikan?".

### Kenapa "tidak melakukan apa-apa" harus selalu ada

Karena sering kali itu jawaban yang benar.

```
Opsi 1: Tambahkan cache Redis
Opsi 2: Optimalkan query database
Opsi 3: Tidak melakukan apa-apa ← INI SERING MENANG

Kenapa opsi 3 sering menang:
- Apakah masalahnya nyata? Sudah diukur?
- Apakah 200ms benar-benar mengganggu pengguna?
- Apakah masalahnya akan hilang sendiri saat jumlah data berkurang?
```

**Kalau Anda tidak bisa menjelaskan kenapa opsi 3 ditolak, Anda belum punya alasan untuk mengerjakan apa pun.**

### Contoh: menyusun 3 opsi

**Kebutuhan:** "Halaman laporan absensi lambat, 8 detik untuk 3 tahun data."

```
Opsi 1: Tambahkan cache (Redis / in-memory)
  Manfaat: cepat untuk permintaan berulang
  Harga: invalidasi saat data berubah, sumber kebenaran kedua,
         butuh infrastruktur tambahan
  Cocok kalau: laporan sering dibuka dengan parameter yang sama

Opsi 2: Optimalkan query (index, agregasi di database, paginasi)
  Manfaat: tidak menambah infrastruktur, memperbaiki akar masalah
  Harga: butuh waktu analisis query, mungkin perlu ubah skema
  Cocok kalau: masalahnya memang query yang tidak efisien ← paling sering

Opsi 3: Tidak melakukan apa-apa (atau batasi rentang laporan maksimal 1 tahun)
  Manfaat: nol biaya
  Harga: pengguna tidak bisa melihat data 3 tahun sekaligus
  Cocok kalau: kebutuhan 3 tahun itu jarang, dan 1 tahun sudah cukup

Opsi 4 (bonus): Hitung laporan secara terjadwal (batch), simpan hasilnya
  Manfaat: cepat, tidak membebani database saat dibuka
  Harga: data tidak real-time, butuh mekanisme penjadwalan
```

Perhatikan: dengan 4 opsi, pilihan yang benar biasanya **opsi 2** (perbaiki akarnya) — dan Anda baru tahu itu karena opsi lain dituliskan dan ditolak dengan alasan, bukan karena kebetulan.

---

## Tabel harga: biaya setiap teknik

Ini rujukan cepat. Setiap teknik punya harga, dan harganya sering tidak disebutkan saat teknik itu diperkenalkan.

| Teknik | Manfaat | Harga |
|---|---|---|
| **Cache** | Kecepatan baca | Inkonsistensi, invalidasi rumit, sumber kebenaran kedua |
| **Load balancer** | Distribusi beban, ketersediaan | Sesi harus stateless, health check, titik kegagalan baru |
| **Microservices** | Skala independen, tim otonom | Komunikasi jaringan, kegagalan sebagian, deployment terkoordinasi, debugging lintas service |
| **Message queue** | Decoupling, tahan beban | Konsistensi akhir, duplikasi, urutan, penanganan pesan gagal |
| **Sharding** | Skala tulis | Query lintas shard sulit, rebalancing, transaksi lintas shard |
| **Event sourcing** | Jejak audit lengkap, replay | Kompleksitas tinggi, versi event, query sulit, penyimpanan besar |
| **Replikasi database** | Ketersediaan baca | Lag replikasi, konsistensi akhir, failover |
| **CDN** | Kecepatan global, beban asal | Invalidasi cache, biaya, konfigurasi |
| **Denormalisasi** | Kecepatan baca | Data ganda, risiko tidak konsisten, update lebih rumit |
| **Async processing** | Tidak memblokir pengguna | Status "sedang diproses", penanganan kegagalan, kompleksitas |
| **Multi-tenant** | Satu sistem untuk banyak organisasi | Isolasi data, kebocoran antar tenant, kompleksitas izin |
| **Autentikasi OAuth** | Tidak mengelola kata sandi | Ketergantungan pihak ketiga, alur yang rumit, sesi |

**Cara memakai tabel ini:** saat Anda (atau AI) mengusulkan sebuah teknik, buka tabel ini dan tuliskan **harganya** di dokumen keputusan Anda. Itu langsung membuat keputusan Anda lebih matang.

---

## Reversibilitas: berapa biaya kalau saya salah?

Ini dimensi yang paling sering dilewatkan, dan paling berguna.

```
Keputusan                          Biaya kalau salah          Waktu
─────────────────────────────────────────────────────────────────────
Nama variabel                      Sangat kecil               Detik
Struktur folder                    Kecil                      Menit
Library UI                         Kecil–sedang               Jam
Framework backend                  Besar                      Minggu
Database (SQL vs NoSQL)            Sangat besar               Bulan
Model autentikasi                  Sangat besar               Bulan
Skema data inti                    Sangat besar               Bulan
Batas antar-service                Sangat besar               Bulan
```

**Aturan praktis:**

```
Kalau biaya kesalahannya < 1 hari  → putuskan cepat, jangan diskusikan lama
Kalau biaya kesalahannya > 1 minggu → tulis ADR, minta pendapat, pikirkan serius
```

Kesalahan umum di kedua arah:

- **Terlalu serius pada yang murah:** berdebat 2 jam soal nama fungsi
- **Terlalu santai pada yang mahal:** memilih database "karena mudah dipasang"

---

## ADR: Architecture Decision Record

ADR adalah cara mencatat keputusan arsitektur agar Anda (dan orang lain) tahu **kenapa** keputusan itu dibuat, enam bulan kemudian.

### Kenapa ADR penting

```
Tanpa ADR, 6 bulan kemudian:

  "Kenapa kita pakai SQLite?"
  "Tidak tahu. Dulu yang bikin sudah resign."
  → Tidak ada yang berani mengubahnya, karena tidak tahu apa yang rusak.
  → Atau: seseorang mengubahnya, dan merusak sesuatu yang tidak ia ketahui.

Dengan ADR:

  "Kenapa kita pakai SQLite?"
  → Baca ADR-001: dipilih karena hanya 3 staf di satu komputer,
    dan tidak perlu akses jaringan. Konsekuensi yang diterima:
    tidak bisa diakses dari luar.
  → Kalau sekarang siswa perlu akses sendiri, kita TAHU ADR ini
    sudah tidak berlaku, dan kita tahu apa yang harus diubah.
```

ADR bukan dokumentasi untuk formalitas. Ia **melindungi keputusan Anda dari dilupakan**, dan melindungi pengganti Anda dari menebak-nebak.

### Template ADR

```markdown
# ADR-<nomor>: <judul keputusan>

- **Tanggal:** YYYY-MM-DD
- **Status:** Diusulkan / Diterima / Digantikan oleh ADR-<nomor>
- **Konteks kebutuhan:** <quality attribute scenario yang relevan>

## Situasi

<Apa yang memaksa kita mengambil keputusan ini? Apa kendalanya?
 Sebutkan angka kalau ada: jumlah pengguna, volume data, batas waktu.>

## Opsi yang dipertimbangkan

### Opsi 1: <nama>
- **Manfaat:** <...>
- **Harga:** <...>
- **Alasan ditolak:** <...>

### Opsi 2: <nama>
- **Manfaat:** <...>
- **Harga:** <...>
- **Alasan ditolak:** <...>

### Opsi 3: Tidak melakukan apa-apa
- **Manfaat:** nol biaya, tidak ada risiko perubahan
- **Harga:** <masalah tetap ada>
- **Alasan ditolak:** <...>

## Keputusan

<Keputusan yang diambil, dalam satu kalimat tegas.>

## Alasan

<Kenapa opsi ini menang. Kaitkan dengan kebutuhan di bagian Situasi.>

## Konsekuensi

**Yang menjadi lebih mudah:**
- <...>

**Yang menjadi lebih sulit:**
- <...>

**Yang kita terima sebagai keterbatasan:**
- <...>

## Kapan keputusan ini perlu ditinjau ulang

<Kondisi konkret yang membuat ADR ini tidak lagi berlaku.>
Contoh: "Kalau pengguna melebihi 100 orang" atau
      "Kalau siswa perlu akses dari luar jaringan sekolah"

## Referensi

- <dokumentasi, artikel, hasil pengukuran>
```

### Bagian yang paling sering dilewatkan (dan paling berharga)

| Bagian | Kenapa berharga |
|---|---|
| **Opsi 3: tidak melakukan apa-apa** | Memaksa Anda mempertanyakan apakah masalahnya nyata |
| **Alasan ditolak** untuk setiap opsi | Tanpa ini, ADR hanya jadi daftar pilihan tanpa penalaran |
| **Yang menjadi lebih sulit** | Menyebutkan harga secara eksplisit mencegah kejutan di masa depan |
| **Kapan ditinjau ulang** | Mengubah ADR dari dokumen mati menjadi dokumen hidup |

---

## Contoh ADR lengkap

```markdown
# ADR-001: Database untuk aplikasi absensi sekolah

- **Tanggal:** 2026-09-14
- **Status:** Diterima
- **Konteks kebutuhan:** "Sistem harus tersedia 99% selama jam sekolah,
  dan digunakan oleh maksimal 5 staf administrasi pada satu komputer."

## Situasi

Aplikasi absensi SD Negeri Pasirhalang akan dipakai oleh 5 staf
administrasi di satu komputer kantor. Data: ~300 siswa, ~180 hari
sekolah per tahun → ~54.000 baris absensi per tahun.

Tidak ada rencana akses dari luar jaringan sekolah dalam 6 bulan ke depan.

## Opsi yang dipertimbangkan

### Opsi 1: SQLite
- **Manfaat:** tidak butuh server terpisah, tidak butuh konfigurasi jaringan,
  satu file, backup = copy file, nol biaya operasional
- **Harga:** tidak bisa diakses bersamaan dari banyak komputer,
  penulisan bersamaan terbatas (satu penulis pada satu waktu)
- **Alasan ditolak:** —

### Opsi 2: PostgreSQL
- **Manfaat:** bisa diakses dari jaringan, konkurensi tinggi,
  query analitik kuat, bisa tumbuh ke multi-sekolah
- **Harga:** butuh server, butuh konfigurasi, butuh backup terjadwal,
  butuh seseorang yang memeliharanya, ~2 hari kerja tambahan untuk setup
- **Alasan ditolak:** biaya operasional tidak sepadan dengan kebutuhan saat ini.
  5 pengguna di satu komputer tidak membutuhkan konkurensi jaringan.

### Opsi 3: Tidak melakukan apa-apa (pakai spreadsheet)
- **Manfaat:** nol biaya, staf sudah familiar
- **Harga:** tidak ada validasi, rawan kesalahan input, sulit bikin laporan,
  tidak ada riwayat perubahan
- **Alasan ditolak:** masalah yang ingin diselesaikan (validasi + laporan otomatis)
  tidak bisa diselesaikan dengan spreadsheet

## Keputusan

Gunakan **SQLite** untuk versi pertama.

## Alasan

Kebutuhan saat ini adalah 5 pengguna di satu komputer tanpa akses jaringan.
SQLite memenuhi itu dengan biaya operasional nol. PostgreSQL menawarkan
kemampuan yang tidak dibutuhkan saat ini, dengan biaya 2 hari kerja
+ pemeliharaan berkelanjutan.

Yang menentukan: **biaya pemeliharaan dibayar setiap bulan, sedangkan
manfaat konkurensi jaringan belum dibutuhkan.**

## Konsekuensi

**Yang menjadi lebih mudah:**
- Tidak ada server database yang perlu dipantau
- Backup = copy satu file
- Pengembangan lokal identik dengan produksi

**Yang menjadi lebih sulit:**
- Kalau nanti butuh akses jaringan, harus migrasi ke PostgreSQL
- Penulisan bersamaan terbatas (tidak masalah untuk 5 pengguna)

**Yang kita terima sebagai keterbatasan:**
- Aplikasi hanya bisa dipakai di satu komputer
- Tidak ada akses dari rumah

## Kapan keputusan ini perlu ditinjau ulang

- Kalau lebih dari 10 staf perlu mengakses bersamaan
- Kalau ada kebutuhan akses dari luar jaringan sekolah
- Kalau jumlah siswa melebihi 2.000 (mulai terasa lambat untuk laporan)
- Kalau muncul kebutuhan guru mengisi absensi sendiri

## Referensi

- Dokumentasi SQLite: "Appropriate Uses For SQLite"
- Hasil pengukuran: laporan 1 tahun = 1.2 detik (dapat diterima)
```

Perhatikan **bagian terakhir**. Itu yang mengubah ADR dari catatan mati menjadi alat kerja: Anda tahu **persis** kapan harus memikirkan ulang.

---

## ADR untuk keputusan yang dibuat AI

Ini situasi khusus di vibe coding, dan penting.

**Masalahnya:** AI sering membuat keputusan arsitektur tanpa memberi tahu Anda. Anda minta "buatkan API absensi", dan AI memilih struktur folder, pola akses database, dan cara penanganan error — semuanya tanpa menyebutkannya sebagai keputusan.

**Akibatnya:** enam bulan kemudian, Anda punya arsitektur yang tidak pernah Anda putuskan, dan tidak tahu kenapa begitu.

### Cara menanganinya

**1. Minta AI menyebutkan keputusannya, bukan hanya hasilnya.**

```
Sebelum menulis kode, sebutkan keputusan arsitektur yang akan Anda buat
untuk fitur ini. Untuk setiap keputusan:
- Apa yang Anda pilih
- Apa alternatifnya
- Kenapa memilih yang itu

Jangan tulis kode dulu. Saya mau meninjau keputusannya.
```

**2. Untuk keputusan besar (pintu satu arah), tulis ADR-nya.**

Kalau AI memilih skema database, model autentikasi, atau struktur data — tulis ADR. Bahkan kalau singkat.

**3. Untuk keputusan kecil (pintu dua arah), cukup catat satu baris.**

```markdown
<!-- Di catatan proyek -->
2026-09-14 — AI memilih struktur folder fitur-based (bukan layer-based).
Alasan: lebih mudah menemukan kode terkait fitur. Bisa diubah nanti.
```

**4. Ajukan pertanyaan "kenapa" untuk yang tidak Anda pahami.**

```
Kenapa Anda memilih menyimpan status absensi sebagai string
("hadir"/"sakit"/"izin") bukan sebagai enum/foreign key?
Apa konsekuensinya kalau nanti perlu status baru?
```

Kalau jawabannya tidak memuaskan, itu tanda keputusan yang perlu Anda ambil alih.

---

## Kesalahan umum dalam trade-off

| Kesalahan | Kenapa salah | Perbaikan |
|---|---|---|
| Hanya menyebut manfaat | Anda akan terkejut saat harganya muncul | Selalu tulis "harganya adalah ___" |
| Hanya 2 opsi | Perbandingan jadi soal kenyamanan | Minimal 3, termasuk "tidak melakukan apa-apa" |
| Kebutuhan kabur ("harus cepat") | Tidak bisa dinilai, cenderung over-engineer | Pakai quality attribute scenario |
| Memutuskan tanpa mengukur | Anda mengoptimalkan yang salah | Ukur dulu |
| Tidak mencatat keputusan | 6 bulan lagi tidak ada yang tahu kenapa | Tulis ADR |
| Menerima keputusan AI tanpa meninjau | Anda punya arsitektur yang tidak Anda putuskan | Minta AI menyebutkan keputusannya |
| Menilai opsi hanya dari sisi teknis | Tim dan konteks juga penentu | Familiaritas tim adalah pertimbangan sah |

---

## Ringkasan

```
Untuk setiap keputusan teknis:

1. Nyatakan kebutuhan secara PRESISI
   (quality attribute scenario, bukan "harus cepat")

2. Tulis MINIMAL 3 OPSI, termasuk "tidak melakukan apa-apa"

3. Untuk setiap opsi, tulis MANFAAT dan HARGA

4. Nilai REVERSIBILITAS
   murah dibatalkan → putuskan cepat
   mahal dibatalkan → tulis ADR

5. CATAT keputusannya (ADR) — termasuk kapan harus ditinjau ulang
```

**Dua kalimat yang harus selalu bisa Anda lengkapi:**

> Saya memilih ___ karena ___.
> Harganya adalah ___.

---

> **Lanjut ke:** [`03-dari-kebutuhan-ke-desain.md`](./03-dari-kebutuhan-ke-desain.md) — metode lengkap dari kebutuhan ke desain.
