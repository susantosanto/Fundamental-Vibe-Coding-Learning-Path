# Panduan Respons Insiden: Tetap Tenang di Tengah Kekacauan 🧯

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/incident-response-guide.md

Sebagai *vibe coder*, kita paham bahwa bahkan sistem yang paling hati-hati pun bisa mengalami turbulensi tak terduga. **Rencana respons insiden adalah persiapan penuh kesadaran kita untuk momen kekacauan ini** — menciptakan jalur terstruktur melewati gangguan yang membuat kita tetap tenang dan efektif. Panduan ini membahas cara mengembangkan rencana respons insiden yang menjaga keseimbangan teknis dan emosionalmu selama situasi penuh tekanan.

> 📌 **Buat yang masih baru:** *Insiden* = gangguan tak terduga: server down, aplikasi error massal, data bocor, atau fitur rusak setelah deploy. *Respons insiden* = prosedur terstruktur untuk menghadapinya. Kuncinya: **rencana dibuat SAAT TENANG untuk dipakai SAAT PANIK**. Tanpa rencana, orang di tengah krisis cenderung panik, mencoba-coba asal, dan memperparah keadaan.

## Apa itu Rencana Respons Insiden?

Rencana respons insiden adalah **strategi terdokumentasi untuk mendeteksi, merespons, dan pulih dari gangguan layanan, pelanggaran keamanan, atau peristiwa tak terduga lain** yang berdampak pada sistemmu. Ini playbook teknis sekaligus jangkar emosional yang membantu tim menavigasi situasi bertekanan tinggi dengan kejelasan dan tujuan.

Rencana respons insiden yang efektif membantumu:
- Merespons masalah dengan konsistensi dan kepercayaan diri.
- Meminimalkan downtime dan dampak layanan.
- Menjaga komunikasi yang jelas selama peristiwa penuh tekanan.
- Belajar secara sistematis dari setiap insiden.
- Membangun ketahanan di sistem dan timmu.

## Siklus Hidup Respons Insiden

### 1. Persiapan 🧰
Siapkan fondasi sebelum insiden terjadi:
- **Struktur Tim**: Definisikan peran dan tanggung jawab.
- **Saluran Komunikasi**: Tetapkan jalur primer dan cadangan.
- **Akses Alat**: Pastikan semua orang punya akses sistem yang diperlukan.
- **Playbook Respons**: Buat protokol detail untuk skenario umum.
- **Latihan Rutin**: Latih respons untuk membangun memori otot.

> 💡 **Tips vibe:** Persiapan adalah bentuk welas asih untuk dirimu di masa depan yang sedang menghadapi krisis.

### 2. Deteksi 🔍
Temukan insiden dengan cepat dan akurat:
- **Sistem Pemantauan**: Alat yang mengawasi anomali.
- **Ambang Peringatan**: Definisi jelas tentang apa yang termasuk insiden.
- **Klasifikasi Keparahan**: Kerangka untuk menilai dampak.
- **Penilaian Awal**: Evaluasi pertama cakupan dan dampak.
- **Alur Notifikasi**: Siapa yang diberi peringatan dan bagaimana.

### 3. Respons 🚒
Ambil tindakan saat insiden terjadi:
- **Komando Insiden**: Struktur kepemimpinan yang jelas.
- **Protokol Komunikasi**: Cara menjaga stakeholder tetap terinformasi.
- **Prosedur Investigasi**: Langkah troubleshooting yang metodis.
- **Strategi Mitigasi**: Opsi untuk mengurangi dampak.
- **Pendekatan Resolusi**: Jalur untuk memulihkan operasi normal.

> 💡 **Tips vibe:** Responder terbaik menjaga ketenangan batin sementara sistem "terbakar".

### 4. Pemulihan 🌱
Kembali ke operasi normal:
- **Pemulihan Layanan**: Langkah membawa sistem kembali online.
- **Prosedur Verifikasi**: Konfirmasi operasi normal.
- **Komunikasi Pengguna**: Informasikan pengguna tentang resolusi.
- **Tugas Tindak Lanjut**: Tangani masalah yang tersisa.
- **Kembali ke Normal**: Mundur formal dari mode insiden.

> 💡 **Tips vibe:** Pemulihan bukan cuma soal teknologi — ini juga soal memulihkan energi tim.

### 5. Analisis Pasca-Insiden 🔄
Belajar dan meningkatkan:
- **Linimasa Insiden**: Rekonstruksi apa yang terjadi kapan.
- **Analisis Akar Masalah (Root Cause Analysis)**: Identifikasi masalah mendasar.
- **Penilaian Dampak**: Ukur efek insiden.
- **Evaluasi Proses**: Review bagaimana respons berjalan.
- **Rencana Perbaikan**: Langkah konkret mencegah terulang.

> 💡 **Tips vibe:** Setiap insiden membawa pelajaran; dekati analisis dengan rasa ingin tahu, bukan menyalahkan.

## Menyusun Vibe Respons Insiden-mu

### Matriks Klasifikasi Insiden 📊
Definisikan tingkat keparahan untuk memandu intensitas respons:

#### Severity 1 (Kritis) 🔴
- Gangguan layanan total atau pelanggaran data.
- Dampak finansial atau reputasi signifikan.
- Memengaruhi mayoritas pengguna.
- Butuh respons all-hands segera.
- Contoh: Database produksi utama down.

> **Vibe respons:** Mobilisasi penuh dengan mentalitas "war room".

#### Severity 2 (Tinggi) 🟠
- Fitur utama tidak tersedia atau degradasi performa signifikan.
- Memengaruhi sebagian besar pengguna.
- Workaround mungkin ada tapi terbatas.
- Contoh: Sistem autentikasi gagal secara intermiten.

> **Vibe respons:** Respons fokus yang mendesak dengan tim khusus.

#### Severity 3 (Sedang) 🟡
- Fitur non-kritis tidak tersedia.
- Degradasi performa untuk beberapa operasi.
- Memengaruhi jumlah pengguna sedang.
- Workaround stabil tersedia.
- Contoh: Fungsi pencarian mengembalikan hasil tidak lengkap.

> **Vibe respons:** Pemantauan penuh perhatian dengan responder yang ditugaskan.

#### Severity 4 (Rendah) 🟢
- Bug minor atau masalah kasus tepi.
- Dampak pengguna minimal.
- Workaround jelas tersedia.
- Contoh: Masalah rendering UI di satu versi browser.

> **Vibe respons:** Respons terjadwal selama jam kerja.

### Peran Respons Insiden
Tanggung jawab yang terdefinisi jelas menciptakan kejelasan di tengah kekacauan:
- **Incident Commander (Komandan Insiden)**: Mengoordinasikan respons keseluruhan dan membuat keputusan kunci.
- **Technical Lead**: Mengarahkan investigasi teknis dan implementasi perbaikan.
- **Communications Coordinator**: Mengelola komunikasi internal dan eksternal.
- **Scribe (Pencatat)**: Mendokumentasikan linimasa, tindakan, dan keputusan.
- **Customer Liaison (Penghubung Pelanggan)**: Mewakili perspektif pelanggan dan menangani pertanyaan langsung.

> 💡 **Tips vibe:** Rotasikan peran selama latihan supaya semua orang mengembangkan "otot respons" yang berbeda.
>
> 📌 **Buat yang masih baru:** Untuk proyek solo, kamu memegang semua peran — tapi tetap tulis siapa yang bisa dihubungi (teman developer, vendor hosting) dan TETAP dokumentasikan linimasanya. Catatan sederhana "jam X: server down, jam Y: restart database, jam Z: pulih" sangat berharga untuk belajar.

## Templat Dokumentasi Respons Insiden

### Templat Deklarasi Insiden 📝
Gunakan saat secara resmi menyatakan insiden:
```
INSIDEN DIUMUMKAN: [Tanggal dan Waktu]
KEPARAHAN: [Tingkat]
KOMANDAN INSIDEN: [Nama]
DESKRIPSI: [Deskripsi singkat masalah]
DAMPAK: [Apa/siapa yang terkena dampak]
STATUS SAAT INI: [Apa yang kita ketahui sejauh ini]
SALURAN RESPONS: [Di mana koordinasi terjadi]
PEMBARUAN BERIKUTNYA: [Kapan informasi lebih lanjut diharapkan]
```

### Templat Pembaruan Status 📝
Gunakan untuk pembaruan rutin selama insiden:
```
PEMBARUAN INSIDEN: [Tanggal dan Waktu]
STATUS SAAT INI: [Ringkasan singkat situasi sekarang]
TINDAKAN YANG DIAMBIL: [Yang telah dilakukan sejak pembaruan terakhir]
LANGKAH BERIKUTNYA: [Yang sedang dikerjakan sekarang]
PERKIRAAN LINIMASA: [Perkiraan waktu resolusi jika diketahui]
WORKAROUND: [Workaround yang tersedia untuk pengguna]
PEMBARUAN BERIKUTNYA: [Kapan informasi lebih lanjut diharapkan]
```

### Templat Resolusi Insiden 📝
Gunakan saat menutup insiden:
```
INSIDEN TERSELESAIKAN: [Tanggal dan Waktu]
DURASI: [Total waktu insiden]
DAMPAK FINAL: [Penilaian dampak aktual]
RESOLUSI: [Bagaimana masalah diperbaiki]
TINDAK LANJUT: [Item tertunda atau pekerjaan masa depan]
POST-MORTEM: [Kapan review akan dilakukan]
KONTAK: [Siapa yang dihubungi dengan pertanyaan]
```

## Saluran Komunikasi dan Eskalasi

### Alur Komunikasi Internal 📢
- **Saluran Primer**: Tempat respons insiden terjadi (mis. channel Slack khusus).
- **Saluran Sekunder**: Cadangan kalau primer tidak tersedia (mis. Discord, SMS).
- **Halaman Status**: Dashboard internal menunjukkan insiden saat ini.
- **Jembatan Video**: Untuk insiden kompleks yang butuh komunikasi suara real-time.
- **Pembaruan Email**: Untuk audiens internal yang lebih luas dan arsip.

### Alur Komunikasi Eksternal 📣
- **Halaman Status**: Informasi insiden yang menghadap publik.
- **Komunikasi Pelanggan**: Templat untuk tingkat keparahan berbeda.
- **Protokol Media Sosial**: Siapa yang boleh memposting dan apa yang dikatakan.
- **Briefing Eksekutif**: Format untuk memperbarui pimpinan.
- **Pernyataan Pers**: Untuk insiden parah yang mungkin menarik perhatian media.

### Jalur Eskalasi 📈
- **Eskalasi Teknis**: Kapan melibatkan senior engineer, arsitek, vendor.
- **Eskalasi Manajemen**: Kapan memberi tahu direktur, VP, C-suite.
- **Eskalasi Eksternal**: Kapan melibatkan dukungan pihak ketiga, vendor, konsultan.
- **Manajemen Krisis**: Kapan mengaktifkan prosedur krisis seluruh organisasi.

## Menciptakan Budaya Belajar dari Insiden

### Post-Mortem Tanpa Menyalahkan 🔍
- Fokus pada sistem dan proses, bukan kesalahan individu.
- Akui bahwa manusia bisa salah dan rancang sistem dengan asumsi itu.
- Ciptakan keamanan psikologis untuk diskusi yang jujur.
- Dokumentasikan perbaikan spesifik yang bisa ditindaklanjuti.
- Review post-mortem lama untuk mengidentifikasi pola.

> 📌 **Buat yang masih baru:** *Post-mortem* = "autopsi" insiden — pertemuan (atau dokumen) setelah insiden selesai untuk membahas: apa yang terjadi, kenapa terjadi, apa pelajarannya. Prinsip kuncinya: **jangan menyalahkan orang**. Kalau deploy jam 3 pagi menyebabkan server down, masalahnya bukan "si X ceroboh" tapi "proses deploy kita tidak punya rollback otomatis" — dan itulah yang diperbaiki.

### Latihan Simulasi Insiden 🎭
- Jadwalkan skenario latihan rutin.
- Simulasikan kondisi dan kendala realistis.
- Rotasikan anggota tim melalui peran berbeda.
- Ciptakan kejutan tak terduga untuk menguji kemampuan beradaptasi.
- Lakukan debrief menyeluruh untuk menangkap pembelajaran.

### Basis Pengetahuan Insiden 📚
- Pertahankan repositori insiden masa lalu yang bisa dicari.
- Tag insiden berdasarkan sistem, penyebab, dan pendekatan resolusi.
- Tautkan insiden terkait untuk mengidentifikasi pola.
- Buat "arketipe insiden" untuk skenario umum.
- Perbarui playbook respons berdasarkan pembelajaran.

## Respons Insiden Penuh Kesadaran untuk Vibe Coder

### Psikologi Insiden 🧠
- **Respons Stres**: Kenali bagaimana adrenalin memengaruhi pemikiran.
- **Kelelahan Keputusan**: Rencanakan pergantian rutin selama insiden panjang.
- **Tunnel Vision**: Gunakan checklist untuk mencegah fiksasi pada satu hipotesis.
- **Kecemasan Status**: Ciptakan ruang bagi responder untuk mengakui ketidakpastian.
- **Waktu Pemulihan**: Bangun waktu decompression setelah insiden.

### Menciptakan Flow Selama Kekacauan 🌊
- **Teknik Pernapasan**: Praktik sederhana untuk menenangkan diri saat stres.
- **Ritual Kejelasan**: Check-in tim singkat untuk menyelaraskan pemahaman.
- **Penanda Kemajuan**: Akui kemenangan kecil selama insiden berkepanjangan.
- **Manajemen Energi**: Rotasikan troubleshooting intens dengan tugas lebih ringan.
- **Perlindungan Fokus**: Lindungi responder aktif dari gangguan.

### Respons Insiden untuk Vibe Coder
Saat menangani insiden dengan bantuan AI:
- **Sistem Cek Diri**: Prompt terjadwal untuk menilai kondisi mentalmu.
- **Teman Eksternal**: Teman non-teknis yang memeriksa kesejahteraanmu.
- **Batas Waktu**: Tetapkan timebox yang jelas untuk setiap pendekatan.
- **Disiplin Dokumentasi**: Bicarakan langkah dengan lantang dan dokumentasikan sambil jalan.
- **Bantuan AI**: Gunakan alat AI sebagai mitra berpikir.

> 💡 **Tips vibe:** Bahkan dengan bantuan AI, ingatlah untuk merawat kesejahteraanmu sendiri selama insiden yang menegangkan.

## Respons Insiden untuk Operasi Berbantuan AI

Saat bekerja dengan alat AI selama insiden:
- **Serah Terima Konteks**: Cara memberi ringkasan cepat situasi kepada AI.
- **Pengenalan Pola**: Gunakan AI untuk mengidentifikasi insiden serupa di masa lalu.
- **Dukungan Keputusan**: Kerangka untuk troubleshooting berbantuan AI.
- **Tindakan Otomatis**: Batas jelas untuk respons AI otonom.
- **Override Manusia**: Protokol eksplisit untuk kapan mengambil kendali manual.

> 💡 **Tips vibe:** AI dapat menangani beban kognitif pelacakan detail, membebaskan pikiranmu untuk pemecahan masalah kreatif.

### AI sebagai Mitra Respons Insiden-mu
- **Dokumentasi Insiden**: Minta AI mendokumentasikan linimasa dan tindakan secara real-time.
- **Investigasi Paralel**: Minta AI meneliti kemungkinan penyebab sementara kamu menerapkan perbaikan.
- **Penyusunan Komunikasi**: AI dapat menyiapkan pembaruan untuk stakeholder sementara kamu fokus pada resolusi.
- **Pencocokan Pola**: AI dapat membandingkan gejala saat ini dengan insiden masa lalu.
- **Pengujian Sistematis**: AI dapat menyarankan pendekatan pengujian metodis saat kamu stres.

**Workflow implementasi:**
1. Saat insiden dimulai, beri AI konteks singkat: "Kita ada gangguan di sistem pembayaran, bantu saya investigasi".
2. Gunakan AI untuk mengorganisir respons: "Buat dokumen insiden untuk melacak apa yang kita lakukan".
3. Delegasikan tugas analitis: "Analisis log ini dan identifikasi pola sementara saya me-restart layanan".
4. Minta AI menyiapkan komunikasi: "Susun pembaruan status untuk pengguna berdasarkan apa yang kita ketahui".

### Analisis Pasca-Insiden dengan AI
- **Rekreasi Linimasa**: AI dapat membantu menyusun urutan peristiwa.
- **Analisis Akar Masalah**: AI dapat mengidentifikasi pola dan faktor penyumbang.
- **Pembuatan Dokumentasi**: AI dapat menyusun laporan post-mortem komprehensif.
- **Ekstraksi Pengetahuan**: AI membantu mengidentifikasi pelajaran dan wawasan yang bisa ditindaklanjuti.
- **Pelacakan Perbaikan**: AI dapat membantu menindaklanjuti item aksi dari post-mortem.

Ingat bahwa kemitraanmu dengan AI menjadi sangat berharga selama insiden. AI memberikan dukungan yang tenang dan sistematis, sementara kamu membawa kesadaran konteks dan pemecahan masalah kreatif yang dibutuhkan dalam situasi tak terduga.

> 💡 **Tips vibe:** Mengajari AI tentang setiap insiden menciptakan basis pengetahuan yang berkembang, yang membuat responsmu terhadap insiden masa depan lebih efektif.

## Intinya buat pemula

- **Siklus 5 fase**: Persiapan → Deteksi → Respons → Pemulihan → Analisis pasca-insiden. Siapkan SEMUA-nya saat tenang.
- **Keparahan S1-S4**: dari kritis (semua down) sampai rendah (bug kecil). Sesuaikan intensitas respons dengan level.
- **Peran**: Komandan, Lead Teknis, Komunikasi, Pencatat, Penghubung pelanggan — untuk solo, kamu semua; untuk tim, bagi dengan jelas.
- **3 templat siap pakai**: deklarasi, pembaruan status, resolusi — salin dan isi.
- **Post-mortem tanpa menyalahkan**: fokus pada sistem dan proses, bukan orang.
- **AI sangat membantu**: minta AI mendokumentasikan, menganalisis log secara paralel, dan menyusun komunikasi sementara kamu fokus memperbaiki.
- **Jaga dirimu**: insiden itu stres — istirahat, batas waktu, dan waktu pemulihan adalah bagian dari prosedur yang benar.
