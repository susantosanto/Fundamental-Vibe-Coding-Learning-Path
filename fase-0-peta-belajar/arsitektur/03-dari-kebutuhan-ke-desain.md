# 03 — Dari Kebutuhan ke Desain

> **Level:** Menengah
> **Waktu:** 70 menit
> **Yang Anda dapat:** metode 8 langkah dari kebutuhan sampai desain yang bisa dipertanggungjawabkan

---

## 📖 Kenapa butuh metode

Tanpa metode, "mendesain sistem" berarti menggambar kotak-kotak yang terasa benar. Anda tidak punya cara untuk tahu apakah desain Anda masuk akal, dan tidak punya cara menjelaskannya.

Dengan metode, setiap langkah menghasilkan **sesuatu yang bisa diperiksa**. Di akhir, Anda punya desain yang bisa Anda bela — bukan karena Anda yakin, tapi karena Anda punya alasan untuk setiap bagiannya.

**Metode ini berurutan. Jangan melompat** — setiap langkah memakai hasil langkah sebelumnya.

```
1. Kumpulkan kebutuhan        (fungsional + non-fungsional)
2. Nyatakan atribut kualitas  (secara presisi, terukur)
3. Identifikasi data          (entitas + relasi + volume)
4. Tentukan komponen          (sesedikit mungkin)
5. Gambar alur data           (siapa memanggil siapa)
6. Analisis mode gagal        (apa yang terjadi kalau mati/lambat/salah)
7. Perkirakan kapasitas       (kapan akan mulai lambat)
8. Validasi & catat           (skenario + ADR)
```

---

## Langkah 1 — Kumpulkan kebutuhan

Ada dua jenis, dan yang kedua paling sering dilewatkan.

### Kebutuhan fungsional — "apa yang dilakukan sistem"

```
- Staf dapat mencatat kehadiran siswa per hari
- Staf dapat melihat rekap kehadiran per bulan
- Staf dapat mengekspor rekap ke Excel
- Sistem menolak mencatat absensi di hari libur
- Siswa tidak boleh tercatat absen di hari libur nasional
```

### Kebutuhan non-fungsional — "bagaimana sistem melakukannya"

Ini yang menentukan arsitektur. Yang fungsional biasanya bisa dipenuhi banyak arsitektur; yang non-fungsional yang membedakan.

```
- Maksimal 5 pengguna bersamaan, di satu komputer
- Halaman harus terbuka < 2 detik
- Data 3 tahun harus bisa dilaporkan
- Hanya staf yang login boleh mengakses data
- Data harus bisa di-backup harian
- Harus jalan di komputer kantor yang spesifikasinya sederhana
```

### Cara mengumpulkan

**Untuk proyek sendiri:** tulis semua yang Anda inginkan, lalu **buang setengahnya**. Versi pertama harus sekecil mungkin.

**Untuk proyek orang lain:** tanyakan pertanyaan ini, dalam urutan ini:

```
1. "Sekarang prosesnya bagaimana?"         ← pahami yang ada dulu
2. "Apa yang paling menyulitkan?"          ← masalah sebenarnya
3. "Berapa lama proses itu sekarang?"      ← untuk mengukur perbaikan
4. "Siapa saja yang terlibat?"             ← pengguna & peran
5. "Apa yang terjadi kalau sistemnya mati?" ← kebutuhan ketersediaan
6. "Apa yang TIDAK boleh salah?"           ← kebutuhan akurasi/keamanan
7. "Seberapa sering?"                      ← volume data
```

**Pertanyaan 1 dan 2 yang paling berharga.** Kebanyakan orang melompat ke solusi sebelum memahami proses yang ada. Akibatnya mereka menyelesaikan masalah yang bukan masalahnya.

**Yang paling penting di langkah ini: tuliskan asumsi Anda.** Kalau Anda berasumsi "5 pengguna", tulis "asumsi: 5 pengguna — perlu dikonfirmasi". Asumsi yang tidak dituliskan adalah bug arsitektur yang menunggu waktu.

---

## Langkah 2 — Nyatakan atribut kualitas secara presisi

Ubah kebutuhan non-fungsional yang kabur menjadi terukur. Format:

```
Ketika [situasi]
Sistem harus [respons terukur]
Dalam [kondisi]
```

| Kebutuhan kabur | Quality attribute scenario |
|---|---|
| "Harus cepat" | "Ketika staf membuka halaman rekap 1 bulan, halaman harus siap dalam < 1.5 detik untuk 300 siswa." |
| "Harus aman" | "Ketika pengguna tanpa login mengakses /api/siswa, sistem harus menolak dengan 401." |
| "Harus andal" | "Sistem boleh tidak tersedia maksimal 2 hari per tahun ajaran, dan hanya di luar jam sekolah." |
| "Harus tahan lama" | "Data 3 tahun ajaran harus bisa dilaporkan tanpa arsip terpisah." |

### Kenapa ini menentukan arsitektur

```
"Harus tersedia 99% selama jam sekolah"     →  satu server cukup
"Harus tersedia 99.9% 24/7"                  →  butuh redundansi, failover, monitoring
```

Perbedaan satu angka ini mengubah desain secara drastis. Tanpa angka, Anda akan cenderung **memilih yang paling aman** (paling rumit) karena takut — dan itu over-engineering.

### Uji kualitas pernyataan Anda

Sebuah pernyataan atribut kualitas sudah baik kalau:

- [ ] Bisa **diukur** (ada angka atau kondisi yang bisa diuji)
- [ ] Bisa **diuji** (Anda bisa membayangkan cara memverifikasinya)
- [ ] Ada **konteksnya** (kapan, untuk siapa)
- [ ] **Realistis** (bukan "0 detik" atau "100% tersedia")

---

## Langkah 3 — Identifikasi data

Data adalah bagian yang paling sulit diubah. Jadi identifikasi lebih dulu, sebelum memilih teknologi.

### 3a. Entitas dan atribut

```
Siswa
  - nisn (unik, 10 digit)
  - nama
  - kelas_id → Kelas
  - tanggal_lahir
  - jenis_kelamin

Kelas
  - nama (6A, 6B)
  - tingkat (6)
  - tahun_ajaran

Absensi
  - siswa_id → Siswa
  - tanggal
  - status (hadir/sakit/izin/alpa)
  - dicatat_oleh → Pengguna
  - dicatat_pada (timestamp)

Pengguna
  - username
  - password_hash
  - peran (admin/staf)

HariLibur
  - tanggal
  - keterangan
```

### 3b. Relasi dan kardinalitas

```
Kelas 1 ──── n Siswa           (satu kelas banyak siswa)
Siswa 1 ──── n Absensi         (satu siswa banyak catatan absensi)
HariLibur: tabel referensi
```

**Tanda bahwa Anda butuh database relasional:** ada relasi antar entitas, dan Anda perlu menjaga konsistensi antar tabel. Untuk kasus di atas, jawabannya jelas SQL.

### 3c. Volume — ini yang menentukan skala

```
Siswa:        300
Kelas:        12
Absensi:      300 siswa × 180 hari = 54.000 baris per tahun
              3 tahun = 162.000 baris
Pengguna:     5
```

**162.000 baris itu sangat kecil.** Untuk perbandingan: PostgreSQL dan SQLite menangani jutaan baris tanpa kesulitan. Ini berarti:

```
→ Tidak perlu sharding
→ Tidak perlu NoSQL
→ Tidak perlu cache untuk alasan volume
→ Bahkan index pun mungkin tidak perlu (tapi tetap pasang untuk kenyamanan)
```

**Menghitung volume menghemat Anda dari over-engineering.** Kebanyakan orang membayangkan "jutaan baris" ketika kenyataannya puluhan ribu.

### 3d. Pola akses

```
Baca:  sangat sering (rekap, daftar siswa, laporan)
Tulis: sekali sehari per kelas (input absensi)
       ~12 kelas × 1 kali = 12 penulisan per hari
```

**Rasio baca:tulis sangat tinggi** (mungkin 100:1). Ini menyiratkan:

```
→ Kalau ada masalah kecepatan, kandidat pertama adalah optimasi BACA
→ Cache akan sangat efektif (data jarang berubah)
→ Tapi: volume kecil, jadi mungkin tidak perlu apa-apa
```

**Ini juga mengungkap apa yang TIDAK perlu:** karena penulisan sangat jarang (12/hari), tidak ada gunanya mengoptimalkan penulisan, dan tidak ada risiko contention.

---

## Langkah 4 — Tentukan komponen

**Prinsipnya: sesedikit mungkin.**

Mulai dari yang paling sederhana, dan tambahkan komponen hanya kalau ada kebutuhan yang menuntutnya.

### Versi paling sederhana

```
┌─────────────────────────────────────┐
│         Aplikasi (1 proses)         │
│  ┌─────────────┐  ┌──────────────┐  │
│  │   Web UI    │  │   Logika     │  │
│  └─────────────┘  └──────────────┘  │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │   SQLite    │
        └─────────────┘
```

Dua komponen: aplikasi dan database. **Ini cukup untuk hampir semua proyek kecil**, termasuk kasus absensi ini.

### Kapan menambahkan komponen

| Kebutuhan | Komponen tambahan | Perlu di kasus ini? |
|---|---|---|
| 5 pengguna, 1 komputer | — | ✅ Tidak perlu apa-apa |
| Akses dari jaringan | PostgreSQL (bukan SQLite) | ❌ Belum (tidak ada rencana) |
| Beban baca sangat tinggi | Cache | ❌ 300 siswa, 5 pengguna |
| Pekerjaan yang lambat | Antrean/worker | ❌ Laporan < 2 detik |
| Banyak pengguna tersebar | Load balancer | ❌ |
| Banyak sekolah (multi-tenant) | Pemisahan tenant | ❌ |
| Audit lengkap setiap perubahan | Log audit | ⚠️ Mungkin, untuk absensi |

**Perhatikan hasilnya: hanya 2 komponen, dan satu pertimbangan.** Kalau Anda mulai dari daftar teknologi yang ingin dipakai, Anda akan punya 8 komponen dan tidak ada yang benar-benar dibutuhkan.

### Cara memutuskan: dari kebutuhan ke komponen

```
Untuk setiap komponen yang Anda pertimbangkan, tanyakan:

"Kebutuhan MANA yang menuntut komponen ini?"

Kalau Anda tidak bisa menyebutkan kebutuhan spesifiknya → jangan tambahkan.
```

Contoh:

```
❌ "Saya tambahkan Redis untuk cache."
   → Kebutuhan mana? "Supaya cepat." → sudah < 2 detik. Tidak perlu.

✅ "Saya tambahkan log audit karena requirement 7.3 menyebut
    'setiap perubahan absensi harus bisa dilacak ke pengguna yang mengubahnya'."
   → Ada kebutuhan spesifik. Layak dipertimbangkan.
```

---

## Langkah 5 — Gambar alur data

Ini langkah yang paling sering mengungkap masalah. Gambar alur **data**, bukan hanya kotak komponen.

### Contoh: input absensi

```
1. Staf pilih kelas + tanggal di form
2. UI kirim POST /api/absensi {kelas_id, tanggal, [{siswa_id, status}]}
3. Server validasi:
   a. Pengguna sudah login?          → tidak: 401
   b. Tanggal ini hari libur?        → ya: 400 "tidak bisa absen di hari libur"
   c. Siswa ada di kelas itu?        → tidak: 400
   d. Tanggal sudah pernah diisi?    → ya: tanya "timpa?" atau tolak
4. Simpan dalam satu transaksi
5. Kembalikan ringkasan: "12 siswa tercatat"
6. UI tampilkan konfirmasi
```

### Contoh: rekap bulanan

```
1. Staf pilih kelas + bulan + tahun
2. UI kirim GET /api/rekap?kelas_id=1&bulan=9&tahun=2026
3. Server:
   a. Ambil semua absensi kelas itu di bulan itu
   b. Ambil daftar hari libur di bulan itu
   c. Hitung: total hari kerja (exclude weekend + libur)
   d. Hitung: per siswa → hadir/sakit/izin/alpa
   e. Hitung persentase
4. Kembalikan JSON
5. UI tampilkan tabel
```

### Yang harus Anda cari saat menggambar alur

```
[ ] Di mana data diubah? (titik yang berisiko)
[ ] Di mana ada keputusan? (titik yang bisa salah)
[ ] Di mana data dari luar masuk? (titik yang perlu validasi)
[ ] Apakah ada langkah yang bisa gagal separuh jalan?
[ ] Apakah ada dua hal yang harus konsisten tapi bisa berubah terpisah?
```

**Langkah 4 pada alur pertama itu penting:** "simpan dalam satu transaksi". Kalau 12 siswa disimpan satu per satu dan gagal di siswa ke-8, Anda punya data setengah tersimpan. Itu keputusan arsitektur.

---

## Langkah 6 — Analisis mode gagal

Ini langkah yang paling membedakan desain matang dari yang belum. Untuk setiap komponen, tanyakan **tiga hal**.

```
Untuk setiap komponen dalam desain Anda:

1. Apa yang terjadi kalau komponen ini MATI?
2. Apa yang terjadi kalau komponen ini LAMBAT?
3. Apa yang terjadi kalau komponen ini mengembalikan data SALAH?
```

### Contoh untuk kasus absensi

| Komponen | Kalau MATI | Kalau LAMBAT | Kalau data SALAH |
|---|---|---|---|
| Aplikasi | Tidak bisa absen. **Bisa manual di kertas**, input kemudian | Staf menunggu | — |
| Database | Data tidak bisa diakses. **Backup harian = kerugian maksimal 1 hari** | Laporan lambat | Laporan salah → keputusan salah |
| Komputer kantor | Sama dengan aplikasi mati | — | — |
| Listrik | Tidak ada yang jalan. **Tidak ada UPS** | — | — |

**Yang ditemukan:**

```
Temuan 1: kalau aplikasi mati, ada prosedur manual (kertas). Itu
          MITIGASI yang harus dituliskan, bukan diasumsikan.

Temuan 2: backup harian berarti kerugian maksimal 1 hari data absensi.
          Apakah itu dapat diterima? Kalau tidak → backup lebih sering
          atau tambahkan WAL/point-in-time recovery.

Temuan 3: tidak ada UPS. Kalau listrik mati saat input absensi,
          data yang sedang disimpan bisa rusak. SQLite relatif tahan
          (transaksional), tapi ini tetap risiko yang harus disadari.
```

**Perhatikan:** analisis ini mengungkap kebutuhan yang **tidak muncul** di daftar kebutuhan awal (prosedur manual, frekuensi backup, UPS). Itu nilai dari langkah ini.

### Pertanyaan lanjutan yang berguna

```
- Kalau database harus di-restore, berapa lama? Siapa yang bisa melakukannya?
- Kalau backup rusak, apa rencana B?
- Bagaimana staf tahu kalau sistem bermasalah? (atau mereka akan menebak)
- Kalau data salah dan sudah dipakai untuk laporan, bagaimana memperbaikinya?
```

---

## Langkah 7 — Perkirakan kapasitas

Tujuannya bukan memprediksi masa depan dengan tepat. Tujuannya **tahu kapan sistem akan mulai lambat**, dan apa yang akan Anda lakukan saat itu.

### Hitung kasar

```
Data per tahun:        54.000 baris absensi
Query rekap bulanan:   scan 54.000/12 = 4.500 baris (per kelas: ~375)
Waktu query:           ~50ms (dengan index)
Total waktu halaman:   ~300ms
Target:                < 1.500ms
Margin:                5× ✅
```

### Kapan mulai lambat

```
Dengan SQLite dan satu index pada (kelas_id, tanggal):
- Sampai ~1 juta baris: tetap < 500ms ✅
- 1 juta baris ≈ 18 tahun data
→ Tidak akan menjadi masalah dalam masa pakai aplikasi ini
```

**Kesimpulan: tidak perlu optimasi apa pun untuk skala.** Ini kesimpulan yang membebaskan — Anda bisa berhenti memikirkan performa dan fokus pada kebenaran.

### Kalau perkiraan menunjukkan masalah

```
Kalau 10 tahun data (540.000 baris) mulai lambat:
  → Opsi 1: tambahkan index yang lebih tepat
  → Opsi 2: arsipkan data lama ke tabel terpisah
  → Opsi 3: hitung laporan secara terjadwal
  → Opsi 4: tidak melakukan apa-apa (batasi laporan maksimal 2 tahun)
```

Catat opsi-opsinya **sekarang**, saat Anda masih tenang. Nanti saat masalahnya muncul, Anda sudah punya daftar untuk ditinjau — dan bisa memilih dengan data nyata, bukan panik.

---

## Langkah 8 — Validasi & catat

### 8a. Uji desain dengan skenario

Jalankan desain Anda melalui skenario konkret. Kalau ada yang tidak bisa dijawab, desainnya belum lengkap.

```
Skenario 1: Staf A sedang input absensi kelas 6A. Listrik mati.
  → Apa yang terjadi pada data yang sedang disimpan?
  → Apa yang staf A lihat setelah listrik kembali?

Skenario 2: Dua staf mengisi absensi kelas yang sama di hari yang sama.
  → Siapa yang menang? Apa yang terjadi pada data yang lain?

Skenario 3: Data 2023 dihapus tidak sengaja.
  → Berapa lama sampai diketahui? Bisa dipulihkan? Sampai kapan?

Skenario 4: Tahun ajaran baru, siswa naik kelas.
  → Apa yang harus dilakukan? Apakah data lama masih benar?
  → Apakah laporan tahun lalu masih akurat?

Skenario 5: Ada siswa pindah sekolah di tengah tahun.
  → Apakah datanya dihapus? Dinonaktifkan? Bagaimana dengan laporan?
```

**Skenario 4 dan 5 adalah yang paling sering mengungkap masalah.** Perubahan data historis (naik kelas, siswa pindah) sering tidak dipikirkan, dan menyebabkan laporan lama menjadi salah.

### 8b. Tulis ADR untuk keputusan besar

Untuk setiap keputusan yang sulit dibatalkan, tulis ADR (lihat `02-trade-off-dan-adr.md`).

Untuk kasus ini, keputusan yang layak ADR:

```
ADR-001: SQLite vs PostgreSQL
ADR-002: Skema absensi (status sebagai string vs foreign key)
ADR-003: Penanganan tahun ajaran (bagaimana siswa naik kelas)
ADR-004: Strategi backup dan retensi
```

**ADR-003 adalah yang paling penting** dan paling sering dilewatkan. "Bagaimana siswa naik kelas tanpa merusak laporan tahun lalu?" adalah keputusan yang **sangat** mahal untuk diubah nanti.

### 8c. Catat yang belum diputuskan

```
Belum diputuskan:
- Apakah guru bisa input absensi sendiri? (memengaruhi model izin)
- Apakah perlu akses dari rumah? (memengaruhi pilihan database)
- Berapa lama data disimpan? (memengaruhi strategi arsip)

Ini tidak menghambat versi pertama. Tapi kalau jawabannya berubah,
tinjau ADR-001.
```

**Mencatat yang belum diputuskan itu penting.** Ia mencegah Anda membuat keputusan diam-diam yang menutup opsi.

---

## Ringkasan hasil desain

Setelah 8 langkah, Anda punya:

```
1. Daftar kebutuhan          → fungsional + non-fungsional + asumsi
2. Atribut kualitas presisi  → terukur dan bisa diuji
3. Model data                → entitas, relasi, volume, pola akses
4. Daftar komponen           → sesedikit mungkin, tiap komponen ada alasannya
5. Alur data                 → untuk setiap operasi utama
6. Analisis mode gagal       → mati / lambat / salah
7. Perkiraan kapasitas       → kapan lambat, dan apa yang dilakukan
8. ADR + daftar terbuka      → keputusan tercatat, yang belum jelas diakui
```

**Untuk kasus absensi, hasil akhirnya hanya 2 komponen.** Itu bukan desain yang "kurang ambisius" — itu desain yang **tepat**. Dan Anda bisa membelanya, karena setiap bagiannya punya alasan yang bisa ditunjuk.

---

## Kesalahan umum di setiap langkah

| Langkah | Kesalahan | Akibat |
|---|---|---|
| 1. Kebutuhan | Melompat ke solusi sebelum paham proses yang ada | Menyelesaikan masalah yang bukan masalahnya |
| 1. Kebutuhan | Tidak menuliskan asumsi | Asumsi tersembunyi menjadi bug arsitektur |
| 2. Atribut kualitas | Membiarkan "harus cepat" | Over-engineering karena takut |
| 3. Data | Memilih teknologi sebelum tahu data | Teknologi yang tidak cocok |
| 3. Data | Tidak menghitung volume | Membayangkan "jutaan baris" padahal puluhan ribu |
| 4. Komponen | Mulai dari teknologi yang ingin dipakai | 8 komponen, tidak ada yang dibutuhkan |
| 5. Alur data | Hanya gambar kotak, tidak alur data | Masalah tersembunyi sampai implementasi |
| 6. Mode gagal | Tidak dianalisis sama sekali | Kejutan saat produksi |
| 7. Kapasitas | Tidak dihitung | Optimasi prematur atau kejutan performa |
| 8. Validasi | Tidak menguji dengan skenario | Desain belum lengkap tapi terasa lengkap |
| 8. Validasi | Tidak mencatat keputusan | Enam bulan lagi tidak ada yang tahu kenapa |

---

## Latihan: terapkan pada sistem lain

Ambil salah satu dan jalankan 8 langkah ini:

```
A. Portal informasi sekolah untuk orang tua siswa
B. Aplikasi keuangan BOS (pemasukan/pengeluaran)
C. Sistem perpustakaan sekolah (peminjaman buku)
D. Aplikasi presensi guru dengan GPS
```

Rubrik penilaian ada di `04-review-dan-latihan-arsitektur.md`.

**Saran:** mulai dari yang paling kecil. Sistem perpustakaan dengan 500 buku dan 300 siswa lebih mudah dinilai daripada sistem dengan banyak pengguna.

---

> **Lanjut ke:** [`04-review-dan-latihan-arsitektur.md`](./04-review-dan-latihan-arsitektur.md) — cara memeriksa desain Anda, dan latihan berjenjang.
