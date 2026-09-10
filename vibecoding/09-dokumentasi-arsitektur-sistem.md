# Dokumentasi Arsitektur Sistem: Memetakan Alam Semesta Kode 🗺️

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/system-architecture-guide.md

Sebagai *vibe coder*, kita paham bahwa sistem kita seperti ekosistem yang hidup. Ada komponen yang saling berinteraksi, dependensi yang membentuk hubungan, dan pola yang muncul dari kompleksitas. Panduan ini membahas cara mendokumentasikan arsitektur sistem dengan cara yang menciptakan kejelasan, membangun pemahaman bersama, dan mendukung evolusi yang penuh kesadaran.

> 📌 **Buat yang masih baru:** *Dokumentasi arsitektur* = peta sistemmu. Kalau aplikasi kamu adalah kota, dokumentasi arsitektur adalah peta kota + buku sejarahnya: menunjukkan di mana setiap bangunan berada, jalan mana yang menghubungkan apa, dan kenapa kota dibangun seperti itu. Tanpa peta ini, kamu (atau orang lain) akan tersesat begitu sistemnya mulai besar.

## Apa itu Dokumentasi Arsitektur Sistem?

Dokumentasi arsitektur sistem menangkap struktur, hubungan, dan prinsip sistem software-mu. Ini **peta sekaligus cerita** — menunjukkan di mana hal-hal berada dan menjelaskan kenapa mereka ada di sana.

Dokumentasi arsitektur yang baik seharusnya:
- Menyampaikan gambaran besar tanpa tenggelam dalam detail.
- Menyorot hubungan kunci antar komponen.
- Menjelaskan keputusan desain dan alasannya.
- Memandu anggota tim baru dalam perjalanan mereka.
- Mendukung keputusan masa depan tentang evolusi sistem.

## Komponen Dokumentasi Arsitektur yang Efektif

### Gambaran Sistem 🌐
Mulai dengan pandangan tingkat tinggi yang bisa dipahami siapa pun:
- **Pernyataan Tujuan**: Masalah apa yang dipecahkan sistem ini?
- **Konsep Inti**: Apa ide fundamental di balik sistem?
- **Stakeholder Kunci**: Siapa yang memakai, memelihara, atau bergantung pada sistem?
- **Batas Sistem**: Apa yang termasuk ruang lingkup dan apa yang eksplisit di luar?
- **Dependensi Eksternal**: Sistem apa yang berinteraksi dengan sistemmu?

> 💡 **Tips vibe:** Tulis bagian ini seolah menjelaskan sistemmu ke teman non-teknis yang penasaran dengan pekerjaanmu.

### Diagram Arsitektur 📊
Representasi visual menghidupkan sistemmu:
- **Diagram Konteks**: Sistemmu dan dependensi eksternalnya.
- **Diagram Kontainer**: Komponen teknis tingkat tinggi (web server, aplikasi, database).
- **Diagram Komponen**: Komponen logis di dalam setiap kontainer.
- **Diagram Kode**: Class/modul kunci dan hubungannya (pakai hemat).
- **Diagram Infrastruktur**: Deployment fisik sistemmu.

> 💡 **Tips vibe:** Gunakan **model C4** (Context, Containers, Components, Code) untuk menciptakan pengalaman zoom yang konsisten dari pandangan tingkat tinggi ke detail.
>
> 📌 **Buat yang masih baru:** C4 adalah cara berpikir berjenjang: mulai dari lingkaran terluar (siapa yang memakai sistem ini?) lalu perbesar ke kontainer (web app, API, database), lalu ke komponen (login, daftar produk...), lalu ke kode (class, fungsi). Ini mencegah diagram yang langsung "tenggelam" di detail.

### Katalog Komponen 📚
Dokumentasikan setiap komponen penting:
- **Tujuan**: Kenapa komponen ini ada.
- **Tanggung Jawab**: Apa yang dilakukannya (dan tidak dilakukan).
- **Antarmuka**: Bagaimana yang lain berinteraksi dengannya.
- **Dependensi**: Apa yang ia andalkan.
- **Perilaku Kunci**: Bagaimana ia merespons rangsangan penting.
- **Atribut Kualitas**: Karakteristik performa, keamanan, keandalan.
- **Keputusan Desain**: Kenapa dibangun seperti itu.

> 💡 **Tips vibe:** Fokus pada "kenapa" di balik setiap komponen. Detail teknis berubah, tapi tujuan bertahan lama.

### Arsitektur Data 💾
Jelaskan bagaimana informasi mengalir dan bertahan:
- **Model Data**: Entitas kunci dan hubungannya.
- **Diagram Aliran Data**: Bagaimana informasi bergerak melalui sistem.
- **Transisi State**: Bagaimana sistem berubah state.
- **Strategi Persistensi**: Bagaimana dan di mana data disimpan.
- **Siklus Hidup Data**: Bagaimana data dibuat, diproses, diarsipkan, dan dihapus.

### Concern Lintas-Potong (Cross-Cutting) ✂️
Tangani aspek yang membentang di banyak komponen:
- **Model Keamanan**: Autentikasi, otorisasi, perlindungan data.
- **Penanganan Error**: Bagaimana kegagalan dikelola di seluruh sistem.
- **Logging & Pemantauan**: Bagaimana kesehatan dan aktivitas sistem dilacak.
- **Performa**: Strategi menjaga kecepatan dan responsivitas.
- **Skalabilitas**: Bagaimana sistem menangani pertumbuhan.
- **Internasionalisasi**: Bagaimana sistem mendukung banyak bahasa/wilayah.

> 📌 **Buat yang masih baru:** "Concern lintas-potong" = urusan yang menyentuh SEMUA bagian sistem, bukan satu modul. Keamanan misalnya: bukan cuma "fungsi login" — dia menentukan bagaimana setiap permintaan divalidasi, setiap data disimpan, setiap error dilaporkan.

## Format Dokumentasi untuk Vibe Berbeda

Dokumentasi arsitektur bisa mengambil banyak bentuk — pilih yang cocok dengan vibe timmu:

### Vibe Visual 👁️ (untuk tim yang berpikir visual)
- Diagram arsitektur sebagai artefak utama.
- Kode warna untuk jenis komponen berbeda.
- Ikon yang mewakili fungsi secara intuitif.
- Penataan spasial yang menunjukkan hubungan logis.
- Papan tulis digital yang bisa diedit kolaboratif.

### Vibe Naratif 📖 (untuk tim yang berpikir dalam cerita)
- Arsitektur digambarkan sebagai perjalanan melalui sistem.
- Penjelasan berpusat pengguna tentang komponen.
- Konteks historis kenapa hal berevolusi seperti itu.
- Deskripsi berorientasi masa depan tentang evolusi yang diinginkan.
- Metafora yang membuat konsep kompleks mudah dipahami.

### Vibe Terstruktur 🧰 (untuk tim yang suka organisasi)
- Templat standar untuk setiap komponen.
- Tabel yang menunjukkan hubungan dan tanggung jawab.
- Matriks yang memetakan fitur ke komponen.
- Koneksi yang bisa ditelusuri antara persyaratan dan arsitektur.
- Kategorisasi dan hierarki yang jelas.

## Alat untuk Dokumentasi Arsitektur

Pilih alat yang sesuai dengan vibe dokumentasimu:
- **Alat Diagram**: Lucidchart, draw.io, Miro, PlantUML.
- **Alat Khusus Arsitektur**: Alat model C4, alat ArchiMate.
- **Platform Dokumentasi**: Confluence, Notion, wiki GitHub/GitLab.
- **Kode sebagai Dokumentasi**: ADR di codebase, diagram yang digenerate dari kode.
- **Alat Pemodelan**: Enterprise Architect, Visio, Sparx.

> 💡 **Tips vibe:** Alat terbaik adalah yang benar-benar dipakai timmu. Prioritaskan aksesibilitas dan kemudahan pembaruan di atas kelengkapan fitur.

> 📌 **Buat yang masih baru:** Jangan terjebak memilih alat berbulan-bulan. Mulailah dengan **draw.io** (gratis) atau bahkan diagram ASCII di README. Yang penting petanya ADA dan MUDAH DIPERBARUI — bukan seberapa cantiknya.

## Dokumentasi Arsitektur sebagai Praktik

Anggap dokumentasi arsitektur sebagai **praktik berkelanjutan**, bukan sekali jadi:

### Membuat Ritme Dokumentasi 🕰️
- Dokumentasikan keputusan arsitektur saat terjadi (ADR).
- Review dan perbarui diagram selama sprint review.
- Jadwalkan sesi "refleksi arsitektur" kuartalan.
- Perbarui dokumentasi saat mengon-boarding anggota tim baru.
- Buat dokumentasi bersama sebagai latihan tim.

> 📌 **Buat yang masih baru:** *ADR (Architecture Decision Record)* = catatan singkat (1 halaman) tentang keputusan arsitektur penting: "kita memilih PostgreSQL alih-alih MongoDB karena butuh transaksi; alternatif yang dipertimbangkan: X, Y; konsekuensi: ...". Membuat ADR saat keputusan dibuat jauh lebih mudah daripada mengingatnya 6 bulan kemudian.

### Menemukan Tingkat Detail yang Tepat 🔍
- Dokumentasikan apa yang tidak mungkin sering berubah.
- Fokus pada "kenapa" lebih dari "bagaimana".
- Tangkap keputusan yang sulit atau kontroversial.
- Dokumentasikan alternatif yang dipertimbangkan dan ditolak.
- Tautkan ke dokumentasi yang lebih detail daripada menduplikasi.

### Menjaga Dokumentasi Tetap Hidup 🌱
- Simpan dokumentasi bersama kode bila memungkinkan.
- Siapkan pemeriksaan otomatis untuk kesegaran dokumentasi.
- Jadikan pembaruan dokumentasi bagian dari definisi selesai (definition of done).
- Gunakan dokumentasi saat onboarding dan berbagi pengetahuan.
- Rayakan dokumentasi yang baik sebagai pencapaian tim.

## Anti-Pattern Dokumentasi Arsitektur

Perhatikan "vibe" ini yang menandakan dokumentasi tidak sehat:
- **The Ghost Town (Kota Hantu)**: Dokumentasi detail yang tidak pernah dibaca atau diperbarui.
- **The Utopia**: Dokumen arsitektur yang menggambarkan kondisi ideal, bukan kenyataan.
- **The Encyclopedia (Ensiklopedia)**: Detail begitu banyak hingga informasi kunci hilang.
- **The Ancient Scroll (Gulungan Kuno)**: Dokumentasi bertahun-tahun lalu yang tidak lagi mencerminkan sistem.
- **The Secret Map (Peta Rahasia)**: Pengetahuan arsitektur hanya di kepala segelintir orang.

## Dokumentasi Arsitektur untuk Vibe Coding Berbantuan AI

Saat bekerja dengan alat AI:
- **Penyediaan Konteks**: Gunakan dokumentasi arsitektur untuk memberi konteks tentang sistemmu kepada AI.
- **Diagram Generatif**: Minta AI membuat diagram awal berdasarkan deskripsi.
- **Review Dokumentasi**: Minta AI meninjau dokumentasi untuk kejelasan dan kelengkapan.
- **Ekstraksi Pengetahuan**: Gunakan AI untuk mengekstrak wawasan arsitektur dari codebase.
- **Penjelasan Alternatif**: Minta AI memparafrasekan konsep kompleks dengan cara berbeda.

> 💡 **Tips vibe:** Alat AI bekerja paling baik saat mereka memahami gambaran besar sistemmu — persis apa yang disediakan dokumentasi arsitektur yang baik.

### AI sebagai Mitra Dokumentasi Arsitektur-mu
- **Generasi Dokumentasi Awal**: Minta AI menyusun draf dokumentasi arsitektur berdasarkan codebase-mu.
- **Bantuan Visualisasi**: Deskripsikan sistemmu secara verbal, biarkan AI membuat draf diagram dan saran visualisasi.
- **Pemeriksaan Konsistensi**: Minta AI meninjau dokumentasi untuk inkonsistensi antar komponen atau diagram.
- **Penyempurnaan Tulisan Teknis**: Gunakan AI untuk meningkatkan kejelasan dan keterbacaan deskripsimu.
- **Identifikasi Kesenjangan Pengetahuan**: AI dapat menyorot area arsitektur yang kurang dokumentasi.

**Workflow implementasi:**
1. Bagikan kode-mu dengan AI dan minta: "Buat dokumen arsitektur sistem awal berdasarkan codebase ini".
2. Deskripsikan komponen sistem secara verbal: "Generate diagram yang menunjukkan cara kerja alur autentikasi pengguna".
3. Minta AI mendeteksi evolusi arsitektur: "Analisis perubahan ini dan perbarui dokumentasi arsitekturnya".
4. Minta AI membantu memelihara dokumentasi hidup: "Perbarui katalog komponen kami dengan layanan baru yang baru saja kami bangun".

### Memelihara Arsitektur Hidup dengan AI
- **Deteksi Perubahan**: AI dapat menganalisis perubahan kode untuk menyarankan pembaruan dokumentasi.
- **Generasi Berkelanjutan**: Minta AI membuat ulang diagram saat terjadi perubahan signifikan.
- **Adaptasi Audiens**: Minta AI membingkai ulang dokumentasi teknis untuk audiens berbeda.
- **Pengujian Dokumentasi**: Minta AI memvalidasi dokumentasi terhadap kode aktual.
- **Transfer Pengetahuan**: Gunakan AI untuk memahami dokumentasimu sendiri saat kembali ke proyek setelah lama pergi.

Ingat bahwa AI berperan sebagai **pembaca sekaligus penulis** dokumentasi arsitekturmu. Dengan menjaga dokumentasi tetap diperbarui, kamu menciptakan lingkaran kebajikan: AI lebih memahami sistemmu, memberikan bantuan kode yang lebih berwawasan, dan membantu memelihara dokumentasi yang akurat.

> 💡 **Tips vibe:** Saat dokumentasi arsitektur dan kode hidup harmonis lewat bantuan AI, keduanya jadi lebih bernilai — dokumentasi menjelaskan kode, dan kode memvalidasi dokumentasi.

---

> **"Dokumentasi arsitektur bukan hanya menggambar kotak dan garis — ini tentang menciptakan model mental bersama yang memungkinkan tim bergerak sebagai satu kesatuan."**

## Intinya buat pemula

- **Dokumentasi arsitektur = peta + cerita sistemmu**: menunjukkan di mana komponen berada DAN kenapa dirancang begitu.
- **Gunakan model C4**: Konteks → Kontainer → Komponen → Kode. Mulai dari lingkaran terluar, perbesar bertahap.
- **Fokus pada "kenapa"**, bukan "bagaimana" — alasan desain lebih awet daripada detail teknis.
- **Jadikan kebiasaan, bukan tugas sekali jalan**: dokumentasikan keputusan saat dibuat (ADR), perbarui saat berubah, simpan dekat kode.
- **AI adalah sekutu dokumentasi**: minta AI membuat draf dari codebase, mendeteksi perubahan, dan menjaga dokumentasi tetap segar.
- **Anti-pattern nomor satu**: The Ghost Town — dokumentasi yang tidak pernah dibaca. Lebih baik sedikit tapi hidup, daripada banyak tapi mati.
