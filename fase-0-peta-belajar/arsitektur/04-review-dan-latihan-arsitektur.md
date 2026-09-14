# 04 — Review & Latihan Arsitektur

> **Level:** Menengah
> **Waktu:** 60 menit baca + 6 latihan
> **Yang Anda dapat:** cara memeriksa desain (termasuk buatan AI), dan 6 latihan dengan rubrik

---

## 📖 Kenapa review itu keterampilan tersendiri

Mendesain dan mereview adalah dua keterampilan berbeda. Orang yang bisa mendesain belum tentu bisa memeriksa desainnya sendiri — dan itu masalah, karena desain yang tidak diperiksa hampir selalu punya lubang.

Ada juga alasan kedua yang lebih mendesak di vibe coding:

> **AI menghasilkan arsitektur yang PLAUSIBLE, bukan yang COCOK.**
>
> Struktur foldernya rapi, penamaannya bagus, polanya familiar. Semuanya terasa benar.
> Dan kadang tidak cocok dengan kebutuhan Anda sama sekali.

Karena itu review bukan opsional. Ia bagian dari pekerjaan.

---

## Bagian 1 — Checklist review arsitektur

Gunakan ini untuk desain Anda sendiri maupun desain yang diusulkan AI.

### A. Kebutuhan & konteks

- [ ] Saya bisa menyebutkan **siapa** penggunanya dan **berapa banyak**
- [ ] Kebutuhan non-fungsional dinyatakan dengan **angka**, bukan kata sifat
- [ ] Asumsi yang belum dikonfirmasi sudah **dituliskan** sebagai asumsi
- [ ] Saya tahu apa yang **paling penting**: benar, cepat, atau murah
- [ ] Saya tahu apa yang terjadi kalau sistem ini **mati**

**Kalau ada yang gagal di sini, jangan lanjut.** Masalah di bagian A akan membuat semua bagian lain tidak relevan.

### B. Data

- [ ] Entitas utama teridentifikasi
- [ ] Relasi antar entitas jelas (dan kardinalitasnya)
- [ ] **Volume data dihitung** — bukan dibayangkan
- [ ] Pola akses diketahui (rasio baca:tulis)
- [ ] Saya tahu data mana yang **paling mahal kalau salah**
- [ ] Saya tahu apa yang terjadi pada data **historis** saat keadaan berubah

**Baris terakhir itu yang paling sering dilewatkan.** "Apa yang terjadi pada laporan tahun lalu saat siswa naik kelas?" adalah pertanyaan yang menghancurkan banyak desain.

### C. Komponen

- [ ] Setiap komponen punya **kebutuhan spesifik** yang menuntutnya
- [ ] Tidak ada komponen yang ada hanya karena "bagus kalau ada"
- [ ] Saya bisa menjelaskan versi **paling sederhana** yang menyelesaikan masalah
- [ ] Saya bisa menjelaskan kenapa versi sederhana itu **tidak cukup** (kalau saya menambahkan komponen)

**Uji:** untuk setiap komponen, lengkapi: *"Komponen ini ada karena kebutuhan nomor ___."* Kalau tidak bisa, hapus.

### D. Alur data

- [ ] Setiap operasi utama punya alur yang tergambar
- [ ] Saya tahu di mana data **diubah**
- [ ] Saya tahu di mana data dari **luar** masuk (dan divalidasi)
- [ ] Saya tahu di mana ada **keputusan** yang bisa salah
- [ ] Saya tahu langkah mana yang bisa **gagal separuh jalan**

### E. Mode gagal

- [ ] Untuk setiap komponen: apa yang terjadi kalau **mati**?
- [ ] Untuk setiap komponen: apa yang terjadi kalau **lambat**?
- [ ] Untuk setiap komponen: apa yang terjadi kalau data yang dikembalikan **salah**?
- [ ] Ada **prosedur manual** kalau sistem tidak tersedia?
- [ ] Saya tahu **berapa lama** pemulihan, dan **siapa** yang bisa melakukannya
- [ ] Backup ada, dan **sudah pernah diuji restore**

### F. Kapasitas

- [ ] Saya sudah menghitung kapasitas kasar (volume × waktu proses)
- [ ] Saya tahu **kapan** sistem akan mulai lambat
- [ ] Saya tahu **apa yang akan dilakukan** saat itu (opsi sudah dicatat)
- [ ] Saya sudah **mengukur**, bukan hanya menebak

### G. Keputusan

- [ ] Keputusan yang sulit dibatalkan punya **ADR**
- [ ] Setiap ADR menyebutkan **opsi yang ditolak** beserta alasannya
- [ ] Setiap ADR menyebutkan **kapan harus ditinjau ulang**
- [ ] Ada daftar **yang belum diputuskan** (dan itu diakui, bukan disembunyikan)

### H. Kesederhanaan

- [ ] Saya bisa menjelaskan seluruh desain dalam **5 menit** tanpa melihat catatan
- [ ] Tidak ada komponen yang bisa dihapus tanpa merusak sesuatu
- [ ] Saya tidak memilih teknologi karena **ingin memakainya**
- [ ] Saya sudah mempertimbangkan **"tidak melakukan apa-apa"** untuk setiap masalah

**Bagian H adalah yang paling sering gagal, dan paling sering diabaikan.**

---

## Bagian 2 — Review arsitektur buatan AI

Ini situasi khusus yang butuh pendekatan berbeda.

### Masalahnya

AI sangat baik menghasilkan arsitektur yang **terlihat profesional**. Ia tahu pola-pola umum, penamaan yang lazim, dan struktur folder yang rapi. Tapi:

```
❌ AI tidak tahu jumlah pengguna Anda
❌ AI tidak tahu bahwa aplikasi Anda hanya dipakai di satu komputer
❌ AI tidak tahu aturan bisnis sekolah Anda
❌ AI cenderung memilih pola yang POPULER, bukan yang COCOK
❌ AI sering menambahkan lapisan yang tidak dibutuhkan (karena "best practice")
```

Akibatnya: Anda bisa mendapat arsitektur microservices dengan message queue, cache, dan event sourcing — untuk aplikasi yang dipakai 5 orang di satu komputer.

### Tanda-tanda arsitektur AI yang over-engineered

```
🚩 Lebih dari 4–5 komponen untuk aplikasi kecil
🚩 Ada message queue padahal tidak ada pekerjaan asinkron
🚩 Ada cache padahal volume data kecil dan query cepat
🚩 Ada layer "service" dan "repository" untuk CRUD sederhana
🚩 Ada abstraksi (interface, factory) yang hanya punya satu implementasi
🚩 Ada Docker/Kubernetes untuk aplikasi satu proses
🚩 Struktur folder berlapis 4–5 tingkat untuk proyek < 5000 baris
```

**Kalau Anda melihat 3 atau lebih dari ini, kemungkinan besar arsitekturnya terlalu berat.**

### Cara mereview: protokol 5 pertanyaan

Jalankan ini untuk setiap komponen yang AI usulkan.

```
1. "Kebutuhan mana yang menuntut komponen ini?"
   → Kalau AI tidak bisa menyebutkan kebutuhan spesifik → curigai

2. "Apa versi paling sederhana yang menyelesaikan kebutuhan itu?"
   → Sering kali jawabannya: tidak perlu komponen itu sama sekali

3. "Berapa biaya pemeliharaan komponen ini per bulan?"
   → Setiap komponen dibayar setiap bulan, bukan sekali

4. "Kalau komponen ini tidak ada, apa yang rusak?"
   → Kalau jawabannya "tidak ada yang rusak, tapi nanti mungkin" → hapus

5. "Apakah AI memilih ini karena cocok, atau karena populer?"
   → AI cenderung merekomendasikan yang paling banyak di data latihnya
```

### Prompt untuk meminta AI mereview arsitekturnya sendiri

Ini teknik yang sangat berguna:

```
Lihat arsitektur yang Anda usulkan untuk proyek ini.

Konteks yang perlu Anda pertimbangkan:
- Pengguna: [jumlah] di [lingkungan]
- Volume data: [angka]
- Target performa: [angka terukur]
- Tim: [jumlah orang]
- Kebutuhan terpenting: [benar/cepat/murah]

Sekarang JANGAN membela desain Anda. Jawab ini:
1. Komponen mana yang TIDAK dituntut oleh kebutuhan mana pun?
2. Kalau Anda harus memotong desain ini menjadi separuhnya,
   apa yang Anda buang lebih dulu? Kenapa?
3. Bagian mana yang over-engineered untuk konteks ini?
4. Apa versi paling sederhana yang masih memenuhi SEMUA kebutuhan?
```

Pertanyaan **"kalau harus dipotong separuh"** sangat efektif. Ia memaksa AI keluar dari pola "tambahkan lebih banyak" dan mulai mempertimbangkan kesederhanaan.

### Prompt untuk menemukan lubang dalam desain

```
Berikut desain saya untuk [proyek].
Kebutuhan: [daftar]

JANGAN memuji desain ini. Tugas Anda: temukan lubangnya.

Periksa khusus:
1. Apa yang terjadi kalau [komponen X] mati?
2. Apa yang terjadi kalau dua pengguna melakukan hal yang sama bersamaan?
3. Apa yang terjadi pada data HISTORIS saat keadaan berubah?
   (misalnya: siswa naik kelas, tahun ajaran berganti)
4. Di mana desain ini akan mulai lambat, dan pada volume berapa?
5. Kebutuhan mana yang TIDAK terpenuhi oleh desain ini?
6. Keputusan mana yang paling mahal kalau salah?
```

Pertanyaan **3** adalah yang paling sering mengungkap masalah nyata. Masalah data historis hampir tidak pernah dipikirkan sampai sudah terlambat.

---

## Bagian 3 — Enam latihan berjenjang

Setiap latihan punya rubrik. **Nilai diri Anda sendiri** — itu bagian dari latihannya, karena menilai desain adalah keterampilan yang sama dengan mereviewnya.

### Aturan umum untuk semua latihan

```
1. Kerjakan di kertas atau dokumen. Bukan di kepala.
2. Jalankan 8 langkah dari file 03.
3. SEBELUM menilai, tulis: "bagian mana yang saya ragu?"
   Keraguan Anda adalah daftar belajar Anda yang sebenarnya.
4. Baru nilai dengan rubrik.
5. Tulis ADR untuk keputusan yang paling mahal kalau salah.
```

---

### Latihan 1 — Daftar tugas pribadi (⚪ mudah)

**Sistem:** aplikasi daftar tugas untuk Anda sendiri.

```
Kebutuhan:
- Tambah, edit, hapus tugas
- Tandai selesai
- Filter: semua / belum selesai / selesai
- Data tersimpan (tidak hilang saat aplikasi ditutup)
- Hanya saya yang pakai
- Jalan di laptop
```

**Yang dilatih:** kesederhanaan. Ini latihan untuk **tidak** menambahkan apa pun.

**Rubrik (10 poin):**

| Kriteria | Poin |
|---|---|
| Komponen ≤ 2 | 3 |
| Tidak ada database server | 2 |
| Model data lengkap (entitas + atribut) | 2 |
| Alur data tergambar | 2 |
| Bisa menjelaskan dalam 5 menit | 1 |

**Jawaban yang baik:** 1 proses + file lokal (JSON atau SQLite). Selesai. Tidak ada server, tidak ada cache, tidak ada autentikasi.

**Kalau Anda membuat lebih dari 2 komponen untuk ini, ulangi.** Ini latihan paling dasar untuk menahan diri.

---

### Latihan 2 — Absensi kelas (🟢 sedang)

**Sistem:** absensi harian satu kelas, untuk satu guru.

```
Kebutuhan:
- Guru pilih tanggal, tandai status tiap siswa (hadir/sakit/izin/alpa)
- Lihat rekap 1 bulan
- Export ke Excel
- 1 guru, 30 siswa
- Data 3 tahun harus bisa dilaporkan
```

**Yang dilatih:** atribut kualitas presisi, dan menghitung volume.

**Rubrik (12 poin):**

| Kriteria | Poin |
|---|---|
| Kebutuhan non-fungsional punya ANGKA | 3 |
| Volume data dihitung | 2 |
| Model data lengkap + kardinalitas | 3 |
| Analisis mode gagal (mati/lambat/salah) | 3 |
| Kesimpulan kapasitas (kapan lambat?) | 1 |

**Jebakan:** 30 siswa × 180 hari × 3 tahun = 16.200 baris. Itu **sangat kecil**. Kalau Anda mengusulkan cache atau sharding, Anda over-engineer.

**Jebakan kedua:** export Excel. Ini bisa **lambat** kalau dilakukan langsung di request. Perhatikan mode gagalnya: apa yang terjadi kalau ekspor 3 tahun butuh 30 detik?

---

### Latihan 3 — Absensi sekolah penuh (🟡 sedang–sulit)

**Sistem:** absensi untuk seluruh sekolah, multi-kelas, multi-pengguna.

```
Kebutuhan:
- 5 staf administrasi, 1 komputer kantor
- 300 siswa, 12 kelas
- Input absensi per kelas per hari
- Rekap per kelas / per bulan / per tahun
- Rekap seluruh sekolah
- Export Excel
- Hanya staf login yang bisa akses
- Data 5 tahun harus bisa dilaporkan
- Wajib menolak absensi di hari libur
```

**Yang dilatih:** menangani aturan bisnis, dan data historis.

**Rubrik (15 poin):**

| Kriteria | Poin |
|---|---|
| Atribut kualitas presisi | 2 |
| Model data lengkap, termasuk `HariLibur` | 3 |
| **Penanganan tahun ajaran / siswa naik kelas** | 4 |
| Analisis mode gagal, termasuk prosedur manual | 3 |
| Perhitungan kapasitas | 2 |
| ADR untuk keputusan termahal | 1 |

**Perhatikan rubrik terbesar: penanganan tahun ajaran.** Ini jebakan utama latihan ini, dan sengaja diberi bobot tertinggi.

**Pertanyaan yang harus Anda jawab:**

```
Siswa A kelas 6A tahun 2025/2026. Tahun ajaran baru, ia lulus.
Siswa B naik dari 5A ke 6A.

Sekarang: "Berapa rata-rata kehadiran kelas 6A tahun 2025/2026?"

Kalau model data Anda menyimpan `kelas_id` di tabel `Siswa`,
jawaban query ini akan SALAH setelah siswa naik kelas —
karena kelas 6A sekarang berisi siswa yang berbeda.

→ Solusi: `kelas_id` harus disimpan di tabel `Absensi`
  (atau di tabel penghubung `SiswaKelas` per tahun ajaran),
  BUKAN di tabel `Siswa`.
```

Kalau Anda melewatkan ini, Anda baru saja menemukan — dengan cara terbaik — kenapa review data historis itu penting.

---

### Latihan 4 — Keuangan BOS (🟡 sulit)

**Sistem:** pencatatan pemasukan dan pengeluaran dana BOS.

```
Kebutuhan:
- Catat pemasukan (dana masuk) dan pengeluaran
- Kategorikan pengeluaran (honor, ATK, listrik, dll)
- Lihat saldo terkini
- Laporan per bulan / per semester
- Export untuk audit
- 2 bendahara
- Setiap perubahan harus bisa dilacak ke pengguna
- Tidak boleh ada data yang hilang atau berubah diam-diam
```

**Yang dilatih:** akurasi, audit trail, dan integritas data.

**Rubrik (16 poin):**

| Kriteria | Poin |
|---|---|
| Atribut kualitas presisi (angka!) | 2 |
| Model data dengan audit trail | 4 |
| **Penanganan koreksi (bukan hapus)** | 3 |
| Transaksi database (atomik) | 3 |
| Tipe data uang (integer/Decimal, bukan float) | 2 |
| Mode gagal + prosedur pemulihan | 2 |

**Tiga jebakan utama:**

```
1. TIPE DATA UANG
   ❌ float → 0.1 + 0.2 ≠ 0.3, dan uang tidak akan cocok
   ✅ integer (satuan sen) atau Decimal

2. KOREKSI vs HAPUS
   ❌ DELETE FROM transaksi WHERE id=5
      → hilang jejaknya, tidak bisa diaudit
   ✅ UPDATE ... SET dibatalkan_pada=..., dibatalkan_oleh=...
      → atau tambahkan transaksi koreksi (reversal)

3. TRANSAKSI ATOMIK
   ❌ update saldo, lalu insert transaksi (kalau gagal di tengah → saldo salah)
   ✅ BEGIN; update saldo; insert transaksi; COMMIT;
```

Ini latihan paling penting untuk memahami bahwa **"benar" adalah kebutuhan arsitektur**, bukan sekadar kualitas kode. Sistem keuangan dan sistem feed sosial membutuhkan arsitektur yang berbeda.

---

### Latihan 5 — Multi-sekolah (🔴 sulit)

**Sistem:** versi dari Latihan 3, tapi sekarang dipakai **10 sekolah**.

```
Kebutuhan tambahan:
- 10 sekolah, masing-masing 300 siswa
- Setiap sekolah punya staf sendiri
- Staf sekolah A TIDAK BOLEH melihat data sekolah B
- Ada admin pusat yang bisa melihat semua sekolah
- Total 3.000 siswa, 10× volume data
```

**Yang dilatih:** isolasi data (multi-tenancy) dan keamanan.

**Rubrik (16 poin):**

| Kriteria | Poin |
|---|---|
| Model data dengan pemisahan tenant | 4 |
| **Strategi isolasi dipilih + ADR** | 4 |
| Pencegahan kebocoran antar tenant | 4 |
| Perhitungan kapasitas 10× | 2 |
| Mode gagal (satu sekolah bermasalah, yang lain?) | 2 |

**Tiga strategi isolasi, dengan harganya:**

| Strategi | Manfaat | Harga |
|---|---|---|
| Kolom `sekolah_id` di setiap tabel | Sederhana, satu database | Risiko kebocoran kalau ada query yang lupa filter ← **bahaya utama** |
| Skema terpisah per sekolah | Isolasi lebih baik | 10× migrasi, query lintas sekolah sulit |
| Database terpisah per sekolah | Isolasi terbaik | Biaya operasional 10× |

**Jebakan terbesar:** kebocoran data antar sekolah. Satu query yang lupa `WHERE sekolah_id = ?` akan menampilkan data sekolah lain. Ini **bukan bug biasa — ini insiden keamanan.**

**Cara mencegahnya** (dan ini bagian terpenting dari latihan ini):

```
✅ Jangan andalkan ingatan. Pasang pengaman di level yang tidak bisa dilupakan:
   - Row Level Security (PostgreSQL)
   - Middleware yang otomatis menambahkan filter tenant
   - Test otomatis: "staf sekolah A tidak bisa melihat data sekolah B"
     untuk SETIAP endpoint

✅ Test keamanan itu bagian dari arsitektur, bukan tambahan.
```

**Ini contoh fitness function dari file `01`** — aturan keamanan yang tidak bisa "membusuk", karena dijalankan setiap kali kode berubah.

---

### Latihan 6 — Sistem yang sudah ada (🔴 lanjut)

**Tugas:** ambil sistem yang **sudah ada** dan reverse-engineer arsitekturnya.

```
Pilihan:
A. Aplikasi absensi sekolah Anda sendiri (kalau sudah ada)
B. Aplikasi yang Anda pakai sehari-hari (pilih yang sederhana)
C. Proyek open-source kecil di GitHub
```

**Proses:**

```
1. Tebak dulu: "Saya tebak arsitekturnya ___"
2. Baru periksa (baca kode, dokumentasi, atau tanya AI)
3. Bandingkan tebakan dengan kenyataan
4. Tulis: di mana saya meleset, dan kenapa
```

**Rubrik (14 poin):**

| Kriteria | Poin |
|---|---|
| Tebakan ditulis SEBELUM memeriksa | 3 |
| Arsitektur tergambar akurat | 3 |
| Identifikasi ≥ 2 keputusan trade-off | 3 |
| **Identifikasi 1 hal yang akan Anda ubah + alasan** | 3 |
| Bandingkan tebakan vs kenyataan | 2 |

**Poin paling berharga: "satu hal yang akan Anda ubah."** Itu tanda Anda mulai punya penilaian arsitektur — bukan hanya kemampuan menjelaskan.

**Catatan:** "saya akan mengubah X karena Y" berbeda dari "X jelek". Yang pertama adalah penilaian arsitektur; yang kedua adalah opini. Anda harus bisa menyebutkan **alasan**, dan mengakui **harga** dari perubahan yang Anda usulkan.

---

## Bagian 4 — Nilai diri Anda

Setelah 6 latihan, jawab ini jujur.

### Penilaian kemampuan

```
[ ] Saya bisa menyatakan kebutuhan non-fungsional dengan ANGKA
[ ] Saya bisa menghitung volume data, bukan membayangkannya
[ ] Saya bisa memilih komponen SESEDIKIT mungkin
[ ] Saya bisa menjelaskan versi paling sederhana yang menyelesaikan masalah
[ ] Saya selalu menganalisis mode gagal (mati/lambat/salah)
[ ] Saya memikirkan data HISTORIS saat keadaan berubah
[ ] Saya bisa menyebutkan harga dari setiap keputusan teknis
[ ] Saya menulis ADR untuk keputusan yang mahal kalau salah
[ ] Saya bisa mereview arsitektur buatan AI dan menemukan yang berlebihan
[ ] Saya bisa menjelaskan desain saya dalam 5 menit tanpa catatan
```

**Interpretasi:**

| Tercentang | Artinya |
|---|---|
| 0–3 | Kembali ke `01-berpikir-arsitektur.md` dan `02-trade-off-dan-adr.md` |
| 4–6 | Ulangi Latihan 2 dan 3 dengan rubrik yang lebih ketat |
| 7–8 | Kerjakan Latihan 4 dan 5. Fokus pada data historis dan integritas. |
| 9–10 | Terapkan pada proyek nyata. Tulis ADR untuk keputusan yang sudah Anda buat. |

### Daftar keraguan Anda

Yang lebih berharga daripada skor: **kumpulan "bagian yang saya ragu"** dari keenam latihan.

```
Latihan | Yang saya ragu | Materi yang perlu dibaca
1       | —              | —
2       | kapan perlu cache | fase-1/14-cache
3       | penanganan tahun ajaran | ← ini penting, cari materi tentang data historis
4       | audit trail | fase-1/12-database-rdbms
5       | isolasi tenant | fase-4/01-microservices-deep-dive
6       | —              | —
```

**Daftar ini adalah kurikulum pribadi Anda.** Ia jauh lebih akurat daripada silabus mana pun, karena ia dibentuk oleh **kesulitan nyata** yang Anda alami — bukan oleh urutan topik yang dipilih orang lain.

---

## Ringkasan

| Keterampilan | Cara melatih |
|---|---|
| Menyatakan kebutuhan presisi | Ubah setiap kata sifat menjadi angka |
| Menghitung volume | Selalu hitung; jangan bayangkan |
| Memilih sesedikit mungkin | Untuk setiap komponen, sebutkan kebutuhan yang menuntutnya |
| Analisis mode gagal | Untuk setiap komponen: mati / lambat / salah |
| Memikirkan data historis | "Apa yang terjadi pada laporan lama saat keadaan berubah?" |
| Menimbang trade-off | Selalu tulis "harganya adalah ___" |
| Mencatat keputusan | ADR, termasuk kapan harus ditinjau ulang |
| Mereview arsitektur AI | Protokol 5 pertanyaan + "kalau harus dipotong separuh" |
| Menilai diri | Rubrik + daftar keraguan |

---

## Langkah berikutnya

```
1. Kerjakan Latihan 1 dan 2 (mudah — melatih menahan diri)
2. Kerjakan Latihan 3 (jebakan data historis)
3. Tulis ADR untuk proyek nyata Anda
4. Kerjakan Latihan 4 atau 5 sesuai kebutuhan Anda
5. Lakukan Latihan 6 pada proyek Anda sendiri
6. Kembali ke file ini sebulan lagi, nilai ulang
```

**Materi lanjutan setelah ini:**

| Topik | Materi |
|---|---|
| Konsep arsitektur dasar | `fase-1-arsitektur-dasar/` (22 file) |
| Arsitektur terapan per-stack | `arsitektur-vibe-coding/` |
| Skala & kegagalan | `fase-4-deep-system-design/` |
| Dokumentasi keputusan | `vibecoding/09-dokumentasi-arsitektur-sistem.md` |
| Observability | `vibecoding/10-pemeliharaan-infrastruktur.md` |

---

> **Kembali ke:** [`../04-jalur-arsitektur-desain.md`](../04-jalur-arsitektur-desain.md) — jalur lengkap arsitektur
> **Jalur pasangannya:** [`../debugging/01-mental-model-debugging.md`](../debugging/01-mental-model-debugging.md)
