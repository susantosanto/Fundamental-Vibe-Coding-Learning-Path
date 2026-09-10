# Runbook: Zen Alur Operasional 📓

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/runbooks-guide.md

Sebagai *vibe coder*, kita sadar bahwa bahkan sistem yang paling intuitif pun kadang butuh panduan. **Runbook adalah praktik "spiritual" dalam mendokumentasikan kearifan operasional** — mengubah pengetahuan abstrak di kepala kita menjadi langkah konkret yang bisa diikuti siapa pun. Panduan ini membahas cara membuat runbook yang memungkinkan *flow state* selama tugas operasional.

> 📌 **Buat yang masih baru:** *Runbook* = "resep masakan" untuk sistemmu. Seperti resep yang menuliskan bahan, urutan langkah, dan cara tahu masakan sudah matang, runbook menuliskan langkah demi langkah untuk menjalankan tugas operasional — misalnya "cara deploy aplikasi", "cara restart database", "cara menambah user". Kenapa penting? Karena pengetahuan di kepalamu suatu saat akan hilang (lupa, resign, atau kamu lagi panik saat sistem down).

## Apa itu Runbook?

Runbook adalah **prosedur terdokumentasi untuk menjalankan tugas operasional tertentu**. Anggap sebagai resep untuk codebase-mu — serangkaian instruksi jelas yang memandu pembaca melewati proses dengan percaya diri dan kejelasan.

Runbook efektif punya banyak tujuan:
- Mendemokratisasi pengetahuan operasional di seluruh tim.
- Mengurangi beban kognitif selama situasi penuh tekanan.
- Memastikan eksekusi konsisten dari prosedur penting.
- Menciptakan jaring pengaman untuk anggota tim yang kurang berpengalaman.
- Mendokumentasikan pengetahuan tribal yang mungkin hilang.

> 📌 **Buat yang masih baru:** *Pengetahuan tribal* = pengetahuan yang "cuma si A yang tahu" — misalnya "kalau server error aneh, jalankan perintah X dulu, nanti normal". Selama pengetahuan ini cuma di kepala si A, tim lumpuh saat si A libur. Runbook memindahkannya ke tempat semua orang bisa membaca.

## Anatomi Runbook yang "Vibing"

### Judul dan Tujuan 🎯
Setiap runbook dimulai dengan kejelasan tentang apa yang dilakukannya:
- **Judul Jelas**: Nama yang langsung menyampaikan tujuan prosedur.
- **Pernyataan Tujuan**: Penjelasan singkat kapan dan kenapa memakai runbook ini.
- **Hasil yang Diharapkan**: Apa yang dicapai dengan menyelesaikan prosedur dengan sukses.
- **Otorisasi yang Diperlukan**: Siapa yang diizinkan menjalankan prosedur ini.
- **Perkiraan Durasi**: Berapa lama prosedur biasanya berjalan.

> 💡 **Tips vibe:** Pernyataan tujuan yang baik menjawab "Kenapa saya harus meraih runbook ini?"

### Prasyarat dan Persiapan 🧰
Siapkan panggung untuk keberhasilan:
- **Akses yang Diperlukan**: Akun, izin, dan sistem yang dibutuhkan.
- **Alat yang Dibutuhkan**: Software, utilitas, atau script yang diperlukan.
- **Prakondisi**: Kondisi yang harus dipenuhi sistem sebelum memulai.
- **Pemeriksaan Keamanan**: Verifikasi yang dilakukan sebelum melanjutkan.
- **Prosedur Backup**: Langkah yang diambil sebelum membuat perubahan.

> 💡 **Tips vibe:** Persiapan yang baik menciptakan ruang mental yang dibutuhkan untuk eksekusi yang fokus.

### Instruksi Langkah demi Langkah 👣
Jantung dari setiap runbook:
- **Langkah Sekuensial**: Instruksi jelas dan bisa ditindaklanjuti dalam urutan logis.
- **Titik Verifikasi**: Cara mengonfirmasi setiap langkah berhasil.
- **Output yang Diharapkan**: Apa yang harus kamu lihat kalau semuanya berjalan benar.
- **Screenshot/Contoh**: Panduan visual untuk antarmuka kompleks.
- **Contoh Perintah**: Sintaks persis dengan placeholder yang ditandai jelas.

> 💡 **Tips vibe:** Tulis langkah dengan asumsi pembacanya cerdas tapi tidak familiar dengan sistem.

### Panduan Troubleshooting 🔍
Antisipasi hal tak terduga:
- **Titik Kegagalan Umum**: Di mana biasanya terjadi kesalahan.
- **Pesan Error**: Artinya dan cara mengatasinya.
- **Perintah Verifikasi**: Cara memeriksa state sistem.
- **Tindakan Pemulihan**: Cara kembali ke jalur.
- **Prosedur Eskalasi**: Kapan dan bagaimana memanggil bantuan.

> 💡 **Tips vibe:** Panduan troubleshooting yang baik mengantisipasi bukan cuma apa yang bisa salah, tapi juga bagaimana rasanya saat itu terjadi.

### Pembersihan dan Verifikasi 🧹
Beri penutup pada prosedur:
- **Pemeriksaan Pasca-Prosedur**: Konfirmasi semua berjalan.
- **Langkah Pembersihan**: Hapus file atau pengaturan sementara.
- **Persyaratan Logging**: Apa yang harus didokumentasikan tentang eksekusi.
- **Persyaratan Notifikasi**: Siapa yang perlu diberi tahu setelah selesai.
- **Langkah Berikutnya**: Apa yang mungkin perlu terjadi setelah prosedur ini.

> 💡 **Tips vibe:** Ritual penutup yang tepat membantu transisi mulus ke tugas berikutnya.

## Gaya Runbook untuk Vibe Operasional Berbeda

### Runbook Respons Darurat 🚨
Untuk situasi kritis yang butuh aksi cepat:
- Langkah ultra-jelas dan ringkas.
- Pohon keputusan untuk skenario berbeda.
- Peringatan penting dengan penekanan tebal.
- Perintah verifikasi cepat.
- Tanpa penjelasan yang tidak perlu di langkah (simpan untuk lampiran).

> **Vibe:** Panduan tenang dan berwibawa di tengah kekacauan.

### Runbook Pemeliharaan Rutin 🔄
Untuk operasi terjadwal reguler:
- Checklist komprehensif.
- Ruang mencatat observasi.
- Tautan ke metrik dan dashboard terkait.
- Konteks historis dari eksekusi sebelumnya.
- Langkah jaminan kualitas.

> **Vibe:** Ketelitian metodis yang membangun familiaritas sistem.

### Runbook Onboarding 🌱
Untuk membantu anggota tim baru:
- Penjelasan lebih detail tentang "kenapa".
- Tautan ke dokumentasi arsitektur.
- Glosarium istilah dan konsep.
- Screenshot dan bantuan visual.
- Saran untuk pembelajaran lebih lanjut.

> **Vibe:** Panduan ramah yang membangun kepercayaan diri.

### Runbook Optimasi ⚡
Untuk meningkatkan performa sistem:
- Metrik baseline untuk dikumpulkan sebelum perubahan.
- Langkah bertahap dengan verifikasi di antaranya.
- Instruksi rollback untuk setiap perubahan.
- Panduan analisis komparatif.
- Pelacakan eksperimen.

> **Vibe:** Eksperimen hati-hati dengan hasil yang terukur.

## Menyusun Runbook yang Mengalir

### Bahasa Instruksi yang Jelas 🔤
- **Gunakan Kalimat Aktif**: "Restart layanan" vs. "Layanan harus di-restart".
- **Bersikap Spesifik**: "Tunggu 30 detik" vs. "Tunggu sampai selesai".
- **Gunakan Terminologi Konsisten**: Jangan berganti istilah untuk hal yang sama.
- **Sorot Bahaya Potensial**: Buat peringatan menonjol secara visual.
- **Beri Nomor Langkah**: Memudahkan referensi dan pelacakan kemajuan.

### Menguji Runbook 🧪
Bahkan runbook butuh pengujian:
- Minta seseorang yang tidak familiar mengikuti prosedur secara persis.
- Amati di mana mereka ragu atau membuat kesalahan.
- Buat lingkungan sandbox untuk melatih runbook kritis.
- Jalankan runbook darurat secara rutin sebagai latihan.
- Perbarui runbook setelah penggunaan nyata dengan pelajaran yang didapat.

> 📌 **Buat yang masih baru:** Uji runbook dengan "penguji buta": minta orang yang belum pernah melakukan tugas itu mengikutinya dari nol. Di langkah mana mereka macet? Di situlah runbook-mu kurang jelas. Kalau tidak ada orang lain, pura-pura lupa caranya dan ikuti runbook-mu sendiri secara harfiah.

### Runbook Hidup 🌱
Jaga runbook tetap hidup dan berkembang:
- Simpan di repositori yang dikontrol versi.
- Beri tanggal pada setiap revisi dengan changelog.
- Review runbook setelah insiden.
- Jadwalkan review rutin (setidaknya kuartalan).
- Tautkan runbook terkait satu sama lain.
- Beri tag runbook untuk kemudahan pencarian.

## Anti-Pattern Runbook Umum

Perhatikan "vibe" ini yang menandakan runbook bermasalah:
- **The Novel (Novel)**: Narasi begitu banyak hingga langkahnya tenggelam.
- **The Assumption (Asumsi)**: Langkah yang mengasumsikan terlalu banyak pengetahuan.
- **The Time Capsule (Kapsul Waktu)**: Runbook usang yang tidak lagi berfungsi.
- **The Scrapbook (Buku Tempelan)**: Kumpulan perintah tanpa konteks atau urutan.
- **The Secret Scroll (Gulungan Rahasia)**: Runbook yang cuma bisa dipahami satu orang.

## Runbook untuk Operasi Berbantuan AI

Saat bekerja dengan asisten AI:
- **Format AI-Readable**: Struktur yang bisa diurai otomatisasi.
- **Bagian Konteks**: Latar belakang yang membantu AI memahami sistem.
- **Batas Keputusan**: Kriteria jelas kapan penilaian manusia dibutuhkan.
- **Langkah Verifikasi**: Cara AI mengonfirmasi eksekusi berhasil.
- **Protokol Serah Terima Manusia**: Proses bersih untuk mentransfer kendali.

> 💡 **Tips vibe:** Anggap AI sebagai anggota tim lain yang butuh instruksi jelas tapi punya ingatan sempurna.

### AI sebagai Kolaborator Runbook-mu
- **Generasi Runbook**: Minta AI menyusun draf runbook berdasarkan implementasi sistemmu.
- **Standardisasi Format**: Biarkan AI menyusun prosedur ad-hoc-mu menjadi runbook formal.
- **Validasi Langkah**: Minta AI meninjau langkah runbook untuk kelengkapan dan kejelasan.
- **Verifikasi Perintah**: AI dapat memeriksa perintah untuk kesalahan sintaks sebelum eksekusi.
- **Pembuatan Percabangan Kondisional**: AI dapat membantu memetakan pohon keputusan untuk prosedur kompleks.

**Workflow implementasi:**
1. Deskripsikan prosedur umum kepada AI: "Buat runbook untuk men-deploy aplikasi kami".
2. Bagikan contoh operasi yang sukses: "Beginilah cara saya restart layanan terakhir kali, ubah ini menjadi runbook yang layak".
3. Minta AI mengekstrak prosedur dari dokumentasi yang ada: "Ubah catatan ini menjadi format runbook terstruktur".
4. Review dan sempurnakan bersama: "Perbaiki runbook ini dengan menambahkan langkah verifikasi setelah setiap aksi".

### Mengeksekusi Runbook dengan Panduan AI
- **Navigasi Langkah demi Langkah**: AI dapat memandu kamu melewati setiap langkah prosedur kompleks.
- **Generasi Perintah**: Minta AI membuat perintah persis berdasarkan instruksi runbook.
- **Adaptasi Real-time**: Saat masalah tak terduga muncul, AI dapat membantu menyesuaikan prosedur.
- **Interpretasi Output**: AI dapat membantu menafsirkan output perintah dan pesan error.
- **Dokumentasi Selama Eksekusi**: AI dapat mencatat apa yang sebenarnya terjadi selama prosedur.

Ingat bahwa runbook yang dibuat kamu dan mitra AI menjadi aset berharga untuk menangani situasi rutin dan darurat. AI membantu kamu membuat prosedur lebih lengkap daripada yang mungkin kamu susun sendiri, sementara keahlian domainmu memastikan runbook tetap praktis dan selaras dengan realitas sistem.

> 💡 **Tips vibe:** Bahkan saat kamu mengeksekusi runbook sendiri, memiliki AI yang "mengawasi dari belakang bahu" memberikan jaring pengaman tambahan untuk menangkap kesalahan atau langkah terlewat.

## Budaya Runbook: Melampaui Dokumen

Ingat bahwa runbook pada akhirnya tentang manusia — mereka adalah cara merawat dirimu di masa depan dan rekan timmu. Runbook yang baik mengurangi stres, membangun kepercayaan diri, dan menciptakan ruang untuk pertumbuhan.

## Intinya buat pemula

- **Runbook = resep sistemmu**: langkah bernomor, output yang diharapkan, titik verifikasi, dan cara kembali ke jalur saat salah.
- **Anatomi**: judul+tujuan → prasyarat → langkah → troubleshooting → pembersihan. Semua bagian punya fungsi.
- **Bahasa runbook**: kalimat aktif, spesifik ("tunggu 30 detik"), terminologi konsisten, nomor langkah.
- **Uji runbook-mu**: minta orang tidak familiar menjalankannya — "penguji buta" mengungkap langkah yang kurang jelas.
- **AI sangat berguna di sini**: minta AI menyusun runbook dari catatanmu, memverifikasi perintah, dan memandu eksekusi. Simpan runbook di repo yang dikontrol versi, review berkala.
