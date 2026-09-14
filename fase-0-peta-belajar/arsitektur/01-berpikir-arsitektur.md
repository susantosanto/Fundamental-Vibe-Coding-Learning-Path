# 01 — Berpikir Arsitektur

> **Level:** Menengah
> **Waktu:** 45 menit
> **Yang Anda dapat:** kerangka berpikir yang mengubah "menggambar diagram" menjadi "mengambil keputusan"

---

## 📖 Definisi yang bekerja

Kebanyakan orang mengira arsitektur adalah **menggambar diagram**: kotak-kotak, panah-panah, ada database di bawah, ada load balancer di atas.

Itu bukan arsitektur. Itu **dokumentasi** arsitektur — hasilnya, bukan prosesnya.

Definisi yang lebih berguna:

> **Arsitektur adalah kumpulan keputusan yang sulit diubah.**
>
> Kalau sebuah keputusan mahal untuk dibatalkan, itu keputusan arsitektur.
> Kalau murah dibatalkan, itu keputusan implementasi — dan tidak perlu diperdebatkan lama.

Ini definisi yang bisa dipakai. Ia memberi Anda alat untuk memutuskan **apa yang perlu dipikirkan serius** dan apa yang tidak.

### Uji cepat: pintu satu arah vs pintu dua arah

```
🚪 Pintu dua arah (mudah dibatalkan)
   → Pilih nama fungsi, struktur folder, library UI, format tanggal
   → Putuskan cepat. Kalau salah, ubah. Biaya kesalahannya kecil.

🚪 Pintu satu arah (sulit dibatalkan)
   → Pilih database, skema data, batas antar-service, model autentikasi
   → Pikirkan serius. Ini arsitektur. Salah di sini = migrasi berbulan-bulan.
```

Kesalahan paling umum: **memperlakukan pintu dua arah seperti pintu satu arah** (berdebat berjam-jam soal penamaan) dan **memperlakukan pintu satu arah seperti pintu dua arah** (memilih database karena "coba-coba dulu").

---

## Empat pertanyaan pembuka

Sebelum menggambar apa pun, jawab empat ini. Kalau tidak bisa, Anda belum siap mendesain — Anda sedang menggambar.

### 1. Siapa yang memakai, dan berapa banyak?

```
10 pengguna        → satu server, satu database. Selesai.
1.000 pengguna     → mungkin butuh cache. Mungkin belum.
100.000 pengguna   → sekarang arsitektur jadi penting.
10.000.000         → sekarang arsitektur jadi masalah utama.
```

**Kesalahan paling umum:** mendesain untuk 1.000.000 pengguna ketika Anda punya 50. Ini bukan ambisi — ini **biaya** yang dibayar sekarang untuk masalah yang mungkin tidak pernah datang.

### 2. Apa yang paling penting: benar, cepat, atau murah?

Tiga hal ini tidak bisa dimaksimalkan bersamaan. Pilih prioritasnya.

```
Akurasi mutlak  →  keuangan, absensi, nilai siswa, rekam medis
Kecepatan       →  feed sosial, rekomendasi, pencarian
Biaya rendah    →  proyek internal, prototipe, proyek sekolah
```

Ini menentukan **semua** keputusan berikutnya. Sistem keuangan memerlukan transaksi ketat dan audit; sistem feed tidak. Memilih arsitektur feed untuk data keuangan akan merusak data.

### 3. Apa yang terjadi kalau sistem ini mati?

```
"Pengguna tidak bisa absen hari ini"        →  penting, tapi bisa manual
"Nilai siswa hilang"                         →  tidak bisa diterima
"Pengguna melihat data siswa lain"           →  tidak bisa diterima, dan ini keamanan
"Beberapa pengguna melihat halaman lambat"   →  tidak apa-apa
```

Jawaban pertanyaan ini menentukan **seberapa banyak** kerumitan yang layak Anda tambahkan untuk ketersediaan. Sistem yang boleh mati selama jam sekolah tidak perlu arsitektur multi-region.

### 4. Apa yang akan berubah dalam 6 bulan?

```
"Jumlah sekolah akan bertambah 10×"      →  desain untuk multi-tenant sejak awal
"Siswa akan bisa akses sendiri"          →  butuh autentikasi dan izin
"Akan ada fitur laporan keuangan"        →  butuh audit trail dan akurasi
"Tidak ada rencana perubahan"            →  desain sesederhana mungkin
```

**Catatan:** jangan mendesain untuk perubahan yang **mungkin** terjadi. Desain untuk perubahan yang **sudah pasti** akan terjadi. Sisanya, buat mudah diubah (pintu dua arah).

---

## Anti-pola: resume-driven development

Ini pola kegagalan arsitektur yang paling umum, dan paling jarang disadari.

> **Memilih teknologi karena ingin memakainya — bukan karena masalahnya membutuhkannya.**

Gejalanya:

```
"Saya pakai Kubernetes"        → untuk aplikasi dengan 20 pengguna
"Saya pakai microservices"     → untuk tim berisi 1 orang
"Saya pakai Kafka"             → untuk 100 pesan per hari
"Saya pakai event sourcing"    → untuk aplikasi CRUD sederhana
"Saya pakai GraphQL"           → untuk satu endpoint
```

Setiap teknologi ini **bagus** — untuk masalah yang tepat. Masalahnya bukan teknologinya, tapi **waktunya**.

### Kenapa ini berbahaya

Setiap teknologi tambahan adalah **biaya permanen**:

| Yang ditambahkan | Biaya yang ikut masuk |
|---|---|
| Microservices | Komunikasi jaringan, penanganan kegagalan sebagian, deployment terkoordinasi, debugging lintas service |
| Kubernetes | Kurva belajar, konfigurasi, pemantauan, biaya operasional |
| Message queue | Urutan pesan, duplikasi, penanganan pesan gagal, konsistensi akhir |
| Cache | Invalidasi, inkonsistensi, sumber kebenaran kedua |
| Event sourcing | Versi event, replay, migrasi skema event, query yang kompleks |

Biaya ini **dibayar setiap hari**, sedangkan manfaatnya mungkin tidak pernah terwujud (kalau skala yang Anda antisipasi tidak datang).

### Pertanyaan penawar

Sebelum menambahkan teknologi apa pun, tanyakan:

```
1. Masalah apa yang saya selesaikan dengan ini?
2. Apakah saya SUDAH punya masalah itu, atau saya mengantisipasinya?
3. Kalau saya belum punya masalahnya, apa buktinya bahwa masalah itu akan datang?
4. Apa versi paling sederhana yang menyelesaikan masalah itu?
5. Kalau saya tidak menambahkannya, apa yang rusak?
```

Kalau jawaban nomor 5 adalah "tidak ada yang rusak, tapi nanti mungkin" — **jangan tambahkan sekarang.**

**Aturan praktis:** tambahkan kerumitan ketika Anda **merasakan** sakitnya, bukan ketika Anda **membayangkan** sakitnya. Sakit nyata memberi Anda informasi tentang masalah yang sebenarnya; imajinasi tidak.

---

## "It depends" — jawaban yang benar tapi tidak berguna

Kalau Anda bertanya "harus pakai SQL atau NoSQL?", jawaban yang jujur adalah **"tergantung"**. Itu benar. Dan tidak berguna.

Cara mengubahnya menjadi berguna: **sebutkan tergantung pada apa.**

```
❌ "Tergantung." (benar, tidak berguna)

✅ "Tergantung apakah:
     - Skema data Anda stabil? → SQL
     - Butuh transaksi lintas tabel? → SQL
     - Data tidak terstruktur / skema sangat bervariasi? → NoSQL
     - Butuh skala tulis sangat besar dengan konsistensi akhir? → NoSQL
     - Tim Anda lebih familiar yang mana? → itu juga pertimbangan sah
   Untuk aplikasi absensi sekolah dengan relasi siswa-kelas-absensi,
   saya akan pilih SQL (PostgreSQL)."
```

Yang kedua adalah jawaban arsitektur. Ia menyebutkan **variabel keputusan**, lalu **memilih dengan alasan**.

Ini keterampilan yang harus dilatih: setiap kali Anda ingin menjawab "tergantung", paksa diri untuk melanjutkan dengan **"tergantung pada apa"** dan **"untuk kasus ini, saya pilih ___ karena ___"**.

---

## Fitness function: cara tahu desain Anda masih sehat

Konsep dari dunia arsitektur perangkat lunak yang sangat berguna:

> **Fitness function adalah pengukuran otomatis yang memberi tahu Anda apakah
> karakteristik penting dari sistem Anda masih terjaga.**

Ini mengubah arsitektur dari "dokumen yang dibaca sekali" menjadi "sesuatu yang bisa diperiksa".

### Contoh fitness function

| Karakteristik yang dijaga | Fitness function |
|---|---|
| Lapisan tetap terpisah | Test struktural: "lapisan `domain` tidak boleh import dari `infrastructure`" |
| Tidak ada ketergantungan melingkar | Analisis dependency otomatis |
| Waktu respons tetap cepat | Test performa: endpoint harus < 200ms |
| Tidak ada operasi database di controller | Lint kustom |
| Skema database sesuai aturan | Test migrasi |

**Kenapa ini penting:** dokumen arsitektur **membusuk dalam hitungan minggu**. Kode berubah, dokumennya tidak. Fitness function adalah arsitektur yang **tidak bisa membusuk**, karena ia dijalankan setiap kali kode berubah.

### Yang bisa Anda lakukan sekarang

Bahkan untuk proyek kecil, Anda bisa memasang 2–3 fitness function sederhana:

```python
# tests/test_arsitektur.py

def test_domain_tidak_bergantung_pada_framework():
    """Lapisan domain harus bebas dari framework."""
    import ast
    from pathlib import Path

    for file in Path("src/domain").rglob("*.py"):
        tree = ast.parse(file.read_text())
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    assert not alias.name.startswith("fastapi"), \
                        f"{file}: domain tidak boleh import fastapi"
```

```python
def test_tidak_ada_dependency_melingkar():
    """Modul tidak boleh saling import secara melingkar."""
    # atau pakai alat seperti dependency-cruiser, import-linter
```

**Kaitannya dengan harness engineering:** ini persis apa yang dibahas di `architecture-planner/MATERI-PECAHAN/RENCANA-Menutup-Gap-Harness-Engineering.md` — gap pertama, "constraint masih tekstual". Fitness function adalah cara mengubah aturan arsitektur dari **teks** (yang "rots instantly") menjadi **kode yang bisa diverifikasi**.

---

## Cara mengembangkan penilaian arsitektur

Kemampuan ini tidak datang dari membaca. Ia datang dari **membuat keputusan, lalu hidup dengan konsekuensinya**.

### Tiga latihan yang benar-benar bekerja

**1. Prediksi, lalu bandingkan**

```
Untuk sistem yang Anda kenal (aplikasi yang Anda pakai, atau proyek Anda sendiri):

1. Tulis: "Saya tebak bottleneck utama sistem ini adalah ___"
2. Tulis: "Saya tebak keputusan yang paling mereka sesali adalah ___"
3. Baru cari tahu: baca blog engineering mereka, dokumentasi, atau tanya AI
4. Bandingkan dengan tebakan Anda
```

Perbedaan antara tebakan dan kenyataan adalah pelajaran Anda.

**2. Balik keputusan**

```
Ambil satu keputusan arsitektur di proyek Anda (misalnya "pakai SQLite").
Tulis jawaban untuk:

- Kalau harus pakai PostgreSQL, apa yang berubah? Berapa biayanya?
- Kalau harus pakai MongoDB, apa yang rusak?
- Kalau harus tanpa database (file JSON), kapan itu gagal?

Tujuannya bukan mengubah keputusan Anda. Tujuannya MERASAKAN
kenapa keputusan itu ada. Keputusan yang tidak bisa Anda bela
saat dibalik adalah keputusan yang belum matang.
```

**3. Desain ulang sistem yang sudah ada**

```
Ambil satu fitur di proyek Anda. Gambar ulang alur datanya di kertas.
Lalu tandai:
- Di mana data bisa hilang?
- Bagian mana yang paling lambat?
- Bagian mana yang paling sulit diubah?
- Kalau satu bagian mati, apa yang terjadi?
```

Latihan ini ada di `04-review-dan-latihan-arsitektur.md` dengan rubrik penilaian.

### Yang TIDAK mengembangkan penilaian

- Membaca artikel arsitektur tanpa memutuskan apa pun
- Menghafal nama teknologi dan kegunaannya
- Menonton "desain sistem X" tanpa memprediksi dulu
- Menyalin arsitektur perusahaan besar untuk proyek kecil

Yang terakhir itu paling sering terjadi dan paling merugikan. Arsitektur Netflix dirancang untuk masalah Netflix — masalah Anda berbeda, dan solusinya akan berbeda.

---

## Tiga hal yang harus Anda lepaskan

Kalau Anda datang dari latar belakang teknis, tiga kebiasaan ini akan menghambat:

### 1. Mengejar "arsitektur yang benar"

Tidak ada arsitektur yang benar. Ada arsitektur yang **cocok untuk konteks tertentu** dan **tidak cocok untuk konteks lain**.

```
Microservices BUKAN lebih baik dari monolith.
Event sourcing BUKAN lebih baik dari CRUD.
NoSQL BUKAN lebih baik dari SQL.
```

Semuanya alat. Alat yang tepat bergantung pada masalah, tim, dan konteks.

### 2. Meremehkan kesederhanaan

Kesederhanaan terasa seperti "kurang ambisius". Padahal:

> **Sistem paling sederhana yang menyelesaikan masalah Anda adalah sistem terbaik — sampai ia tidak lagi menyelesaikannya.**

Monolith yang jalan mengalahkan microservices yang setengah jadi. SQLite yang bekerja mengalahkan PostgreSQL yang salah dikonfigurasi.

### 3. Optimasi prematur

Mengoptimalkan tanpa mengukur adalah menebak. Anda akan mengoptimalkan bagian yang salah, menambah kerumitan, dan **tidak** memperbaiki masalahnya.

```
Urutan yang benar:
1. Bangun versi paling sederhana
2. UKUR (bukan tebak)
3. Temukan bottleneck sebenarnya
4. Baru optimalkan itu
5. Ukur lagi — apakah benar membaik?
```

Lompati langkah 2, dan langkah 4 Anda akan salah.

---

## Ringkasan

| Yang salah | Yang benar |
|---|---|
| Arsitektur = menggambar diagram | Arsitektur = keputusan yang sulit diubah |
| Semua keputusan sama pentingnya | Bedakan pintu satu arah vs dua arah |
| Pilih teknologi karena keren | Pilih karena masalahnya membutuhkannya |
| "Tergantung" | "Tergantung pada ___, dan untuk kasus ini saya pilih ___" |
| Dokumen arsitektur | Fitness function — arsitektur yang bisa diperiksa |
| Cari arsitektur "yang benar" | Cari yang cocok untuk konteks Anda |
| Optimasi dulu | Ukur dulu, baru optimasi |

**Empat pertanyaan yang harus selalu Anda jawab sebelum mendesain:**

1. Siapa yang memakai, berapa banyak?
2. Apa yang paling penting: benar, cepat, atau murah?
3. Apa yang terjadi kalau ini mati?
4. Apa yang akan berubah dalam 6 bulan?

---

> **Lanjut ke:** [`02-trade-off-dan-adr.md`](./02-trade-off-dan-adr.md) — cara menimbang dan mencatat keputusan.
