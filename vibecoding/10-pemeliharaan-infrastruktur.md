# Pemeliharaan Infrastruktur: Menjaga Kode Vibe-mu Sehat 🔧

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/infrastructure-maintenance.md

Sebagai *vibe coder*, kita tahu bahwa membuat kode hanyalah permulaan. Seperti taman yang butuh perawatan rutin, aplikasi kita butuh pemeliharaan berkelanjutan untuk berkembang. Panduan ini membahas seni pemeliharaan infrastruktur di lingkungan tradisional maupun cloud.

> 📌 **Buat yang masih baru:** *Infrastruktur* = semua yang MENJADI TEMPAT kode kamu berjalan: server, database, jaringan, layanan cloud (Vercel, Cloudflare, Supabase, dll.). Banyak pemula cuma fokus menulis fitur baru dan lupa bahwa "taman" yang tidak dirawat akan ditumbuhi rumput liar — berupa bug keamanan, aplikasi lambat, atau server mati tengah malam.

## Apa itu Pemeliharaan Infrastruktur?

Pemeliharaan infrastruktur adalah **perawatan dan "pemberian makan" berkelanjutan** bagi sistem yang menghosting kode-mu. Termasuk memperbarui, menambal, memantau, mengoptimalkan, dan kadang mengganti komponen supaya aplikasi tetap:
- Aman 🔒
- Andal ⚙️
- Efisien ⚡
- Skalabel 📈
- Hemat biaya 💰

Pemeliharaan yang baik menciptakan fondasi tempat kode-mu bisa mengekspresikan vibe terbaiknya, bebas dari disonansi masalah teknis yang sebenarnya bisa dicegah.

## Jenis Pemeliharaan

### Pemeliharaan Korektif 🩹
Memperbaiki yang rusak — biasanya reaktif:
- Menangani server crash.
- Menyelesaikan masalah koneksi database.
- Menangani kegagalan penyimpanan.
- Memperbaiki pemadaman jaringan.

> **Kondisi vibe:** Energi penyelesaian masalah yang waspada.

### Pemeliharaan Preventif 🛡️
Perawatan rutin untuk mencegah masalah sebelum terjadi:
- Penambalan keamanan.
- Pembaruan sistem.
- Verifikasi backup.
- Perencanaan kapasitas.

> **Kondisi vibe:** Alur perawatan yang penuh kesadaran.

### Pemeliharaan Adaptif 🌱
Mengevolusi infrastruktur untuk memenuhi kebutuhan yang berubah:
- Menambah/mengurangi sumber daya.
- Migrasi ke teknologi baru.
- Memperbarui dependensi.
- Memperbaiki arsitektur.

> **Kondisi vibe:** Eksplorasi berorientasi pertumbuhan.

### Pemeliharaan Perfektif ✨
Memperbaiki sistem yang berfungsi tapi bisa lebih baik:
- Optimasi performa.
- Pengurangan biaya.
- Perbaikan arsitektural.
- Peningkatan pemantauan.

> **Kondisi vibe:** Penyempurnaan sang pengrajin.

> 📌 **Buat yang masih baru:** Perhatikan 4 jenis ini — mayoritas pemula cuma mengenal yang *korektif* (menunggu rusak baru dibetulkan). Kunci infrastruktur sehat adalah porsi *preventif* dan *perfektif* yang lebih besar: mencegah lebih murah daripada memperbaiki.

## Pemeliharaan Infrastruktur Tradisional

Infrastruktur tradisional (self-hosted atau data center) butuh pemeliharaan langsung di layer fisik dan virtual.

### Perawatan Layer Fisik
- **Manajemen Siklus Hidup Hardware**: Rencanakan siklus penggantian server/equipment jaringan (biasanya 3-5 tahun).
- **Keamanan Fisik**: Review rutin kontrol akses, sistem kamera, dan faktor lingkungan.
- **Pemantauan Lingkungan**: Periksa suhu, kelembapan, dan kondisi daya.
- **Manajemen Kabel**: Atur, beri label, dan dokumentasikan semua koneksi.
- **Inventaris Suku Cadang**: Pertahankan komponen kritis cadangan.

### Pemeliharaan Layer Sistem
- **Pembaruan Sistem Operasi**: Jadwal penambalan rutin (bulanan untuk non-kritis, segera untuk keamanan).
- **Pembaruan Driver**: Terutama untuk komponen penyimpanan dan jaringan.
- **Pembaruan Firmware**: Untuk server, equipment jaringan, dan sistem penyimpanan.
- **Service Pack**: Terapkan setelah pengujian menyeluruh di staging.
- **Manajemen Konfigurasi**: Kontrol versi untuk semua konfigurasi sistem.

### Layer Dukungan Aplikasi
- **Pembaruan Runtime**: Jaga bahasa dan framework tetap terbaru.
- **Pemeliharaan Database**: Vacuum rutin, reindexing, dan optimasi.
- **Konfigurasi Load Balancer**: Perbarui sertifikat dan review aturan routing.
- **Penalaan Web Server**: Sesuaikan worker process dan batas koneksi berdasarkan penggunaan.
- **Manajemen Layer Cache**: Bersihkan, ubah ukuran, dan optimalkan cache.

## Pemeliharaan Infrastruktur Cloud

Cloud mengalihkan banyak tugas pemeliharaan ke penyedia, tapi memperkenalkan tanggung jawab baru.

### Pemeliharaan Cloud Umum
- **IAM dan Izin**: Audit rutin akses dan hapus akun yang tidak digunakan.
- **Pemantauan Biaya**: Review pola penggunaan dan optimalkan alokasi sumber daya.
- **Konfigurasi Skala Otomatis**: Perbarui pemicu dan batas berdasarkan pola traffic.
- **Batas Layanan**: Pantau penggunaan kuota dan minta kenaikan sebelum menyentuh batas.
- **Penandaan Sumber Daya**: Pertahankan tagging konsisten untuk penagihan dan manajemen.
- **Rotasi Rahasia**: Rotasi API key dan secret secara rutin.

> 📌 **Buat yang masih baru:** *IAM* = sistem izin siapa boleh akses apa di cloud-mu. Aturan praktis: "least privilege" — beri izin seminimal mungkin yang dibutuhkan. *Rotasi secret* = ganti API key/password secara berkala, karena semakin lama sebuah rahasia dipakai, semakin besar peluangnya bocor.

### Pemeliharaan Khusus Vercel
- **Pembaruan Framework**: Jaga Next.js atau framework lain tetap terbaru.
- **Manajemen Edge Config**: Review dan perbarui konfigurasi edge secara rutin.
- **Review Deployment**: Bersihkan deployment lama untuk menghindari biaya penyimpanan.
- **Pemantauan Fungsi**: Periksa cold start dan optimalkan ukuran fungsi.
- **Manajemen Domain dan Sertifikat**: Pastikan perpanjangan otomatis dikonfigurasi.
- **Review Akses Tim**: Audit izin anggota tim secara berkala.

### Pemeliharaan Khusus Cloudflare
- **Optimasi Script Worker**: Review dan perbarui worker untuk performa.
- **Pemeliharaan Set Aturan**: Audit aturan keamanan dan ruleset khusus.
- **Konfigurasi Cache**: Sesuaikan TTL cache berdasarkan frekuensi perubahan konten.
- **Review Catatan DNS**: Verifikasi konfigurasi DNS secara berkala.
- **Manajemen Sertifikat**: Pantau kedaluwarsa sertifikat khusus.
- **Aturan Rate Limiting**: Perbarui berdasarkan pola traffic dan tren serangan.

### Pemeliharaan Khusus Supabase
- **Pemantauan Ukuran Database**: Lacak pertumbuhan dan rencanakan scaling.
- **Review Kebijakan RLS**: Audit rutin kebijakan row level security.
- **Pembaruan Fungsi**: Optimalkan fungsi PostgreSQL untuk performa.
- **Pengaturan Autentikasi**: Review penyedia dan pengaturan auth.
- **Verifikasi Backup**: Periksa berkala point-in-time recovery.
- **Pemeliharaan Edge Function**: Perbarui versi runtime dan dependensi.

## Jadwal dan Ritme Pemeliharaan

Pemeliharaan yang baik mengikuti ritme yang menjaga sistem tetap harmonis:

### Pemeriksaan Harian 📅
- Review peringatan pemantauan.
- Verifikasi backup berhasil.
- Periksa kesehatan layanan kritis.
- Pindai advisory keamanan.
- Cari pola tidak biasa di log.

### Tugas Mingguan 📅
- Terapkan pembaruan non-kritis.
- Review metrik performa.
- Periksa tren pemanfaatan sumber daya.
- Bersihkan file sementara dan log.
- Verifikasi kesiapan disaster recovery.

### Praktik Bulanan 📅
- Terapkan pembaruan besar ke lingkungan staging.
- Lakukan pemindaian keamanan menyeluruh.
- Review dan sesuaikan parameter scaling.
- Audit kontrol akses dan izin.
- Uji prosedur fail-over.
- Optimalkan biaya di berbagai layanan.

### Pendalaman Kuartalan 📅
- Audit keamanan komprehensif.
- Review arsitektur untuk perbaikan.
- Perbarui dokumentasi dan runbook.
- Uji pemulihan penuh dari backup.
- Evaluasi teknologi baru untuk potensi adopsi.
- Lakukan load dan stress testing.

## Otomatisasi Pemeliharaan: Jalan Menuju Vibe Maintenance

Otomatiskan tugas pemeliharaan untuk membebaskan pikiranmu bagi pemikiran tingkat tinggi:
- **Infrastructure as Code (IaC)**: Gunakan Terraform, CloudFormation, atau Pulumi untuk membuat infrastruktur dapat direproduksi.
- **Manajemen Konfigurasi**: Implementasikan Ansible, Chef, atau Puppet untuk konfigurasi konsisten.
- **Pembaruan Berkelanjutan**: Siapkan penambalan otomatis dengan rollout dan rollback terkontrol.
- **Pemantauan sebagai Kode**: Definisikan peringatan dan dashboard dalam kode yang dikontrol versi.
- **Chaos Engineering**: Uji ketahanan secara rutin dengan sengaja memperkenalkan kegagalan.

> 📌 **Buat yang masih baru:** *Infrastructure as Code* = menulis konfigurasi server/database sebagai file kode (Terraform dll.) alih-alih klik manual di dashboard. Manfaatnya: bisa di-version-control (seperti kode biasa), bisa di-review, dan bisa dibuat ulang kapan saja. *Chaos engineering* = sengaja mematikan komponen (di lingkungan uji) untuk memastikan sistem tetap hidup — latihan api, bukan menunggu kebakaran.

### Manfaat Otomatisasi untuk Vibe Coder
- **Ruang Mental**: Tugas rutin tidak menyita kapasitas kreatifmu.
- **Hasil Konsisten**: Mesin menjalankan tugas berulang lebih andal dari manusia.
- **Dokumentasi**: Proses otomatis berfungsi sebagai dokumentasi hidup.
- **Fokus**: Gunakan energi untuk perbaikan, bukan pemadam kebakaran.
- **Keseimbangan**: Kurangi darurat larut malam dan ciptakan praktik berkelanjutan.

## Pemantauan: Praktik Kesadaran

Pemantauan efektif menciptakan kesadaran akan state sistemmu:
- **Empat Golden Signals**:
  - **Latency** (waktu respons)
  - **Traffic** (permintaan per detik)
  - **Errors** (permintaan yang gagal)
  - **Saturation** (beban sistem)
- **Log, Metrik, dan Trace**:
  - Sentralkan log supaya mudah dicari.
  - Simpan metrik untuk analisis tren.
  - Kumpulkan trace untuk debugging performa.
- **Peringatan dan Notifikasi**:
  - Beri peringatan pada gejala, bukan penyebab.
  - Tetapkan tingkat keparahan yang jelas.
  - Buat peringatan yang bisa ditindaklanjuti dengan tautan runbook.
  - Implementasikan rotasi on-call demi kewarasan tim.

> 📌 **Buat yang masih baru:** *Golden Signals* = 4 angka ajaib yang menceritakan kesehatan sistemmu. Kalau aplikasi kamu lambat (latency tinggi), lihat apakah traffic naik, error bertambah, atau server penuh (saturation). Mulai dari satu dashboard sederhana yang menampilkan keempatnya.

## Dokumentasi: Memori Bersama

Pertahankan dokumentasi hidup dari infrastrukturmu:
- **Arsitektur Sistem**: Diagram dan deskripsi komponen.
- **Runbook**: Prosedur langkah demi langkah untuk tugas umum.
- **Rencana Respons Insiden**: Prosedur jelas untuk gangguan.
- **Change Log**: Catatan semua perubahan signifikan.
- **Prosedur Pemulihan**: Langkah pemulihan yang terdokumentasi dan teruji.
- **Kontak Vendor**: Informasi dukungan untuk semua layanan.

## Pendekatan Vibe terhadap Pemeliharaan

Pemeliharaan infrastruktur yang efektif punya vibe khusus:
- **Kesadaran**: Tetap hadir bersama sistem, bukan mengabaikannya.
- **Ritme**: Tetapkan pola pemeliharaan yang terasa alami.
- **Rasa Ingin Tahu**: Dekati masalah dengan pola pikir belajar.
- **Kesabaran**: Selesaikan masalah secara metodis, bukan terburu-buru.
- **Keseimbangan**: Jangan over-maintenance ataupun menelantarkan sistem.
- **Rasa Syukur**: Hargai saat hal-hal berjalan baik, bukan cuma fokus pada masalah.

### Anti-Pattern Pemeliharaan
Perhatikan "vibe" pemeliharaan yang menandakan masalah:
- **The Procrastinator (Penunda)**: Menunda pembaruan sampai dipaksa keadaan darurat.
- **The Over-Engineer**: Membuat sistem pemeliharaan kompleks yang justru butuh pemeliharaan.
- **The Lone Hero (Pahlawan Tunggal)**: Memelihara sistem tanpa dokumentasi atau berbagi pengetahuan.
- **The Penny Pincher (Pelit)**: Menghindari pemeliharaan yang diperlukan untuk menghemat biaya.
- **The Shiny Object Chaser**: Terus ganti teknologi sebelum menguasai pemeliharaannya.

## Cloud vs. Tradisional: Menemukan Vibe Pemeliharaan-mu

### Pilih Infrastruktur Tradisional Ketika:
- Kamu butuh kontrol penuh atas semua aspek sistem.
- Aplikasimu punya persyaratan performa yang tidak biasa.
- Kepatuhan mengharuskan kontrol fisik atas data.
- Timmu punya keterampilan administrasi sistem yang kuat.
- Biaya jangka panjang lebih menguntungkan kepemilikan daripada sewa.

### Pilih Infrastruktur Cloud Ketika:
- Kamu ingin fokus energi kreatif pada pengembangan aplikasi.
- Aplikasimu perlu diskalakan cepat atau tak terduga.
- Timmu lebih suka manajemen infrastruktur deklaratif.
- Kecepatan ke pasar adalah perhatian utama.
- Kamu ingin distribusi geografis tanpa banyak data center.

**Ingat**: Pilihan terbaik selaras dengan vibe pemeliharaan alami timmu.

## Pendekatan Hibrida: Terbaik dari Kedua Dunia

Banyak vibe coder menemukan keseimbangan dalam pendekatan hibrida:
- **Control Plane Cloud, Komputasi Lokal**: Gunakan cloud untuk mengorkestrasi server lokal.
- **Inti Tradisional, Burst ke Cloud**: Pertahankan beban kerja konsisten di dalam, lonjakan ke cloud.
- **Pengembangan Cloud, Produksi Tradisional**: Kembangkan di cloud fleksibel, deploy ke lingkungan tradisional terkontrol.
- **Tradisional dengan Backup Cloud**: Beroperasi tradisional tapi gunakan cloud untuk disaster recovery.

## Intinya buat pemula

- **4 jenis pemeliharaan**: korektif (perbaiki), preventif (cegah), adaptif (evolusi), perfektif (sempurnakan). Prioritaskan preventif!
- **Ritme**: harian (peringatan/backup), mingguan (update kecil), bulanan (scan + audit), kuartalan (audit besar + uji recovery).
- **Otomatisasi adalah teman**: Infrastructure as Code + backup otomatis + monitoring otomatis = lebih sedikit darurat tengah malam.
- **4 Golden Signals**: Latency, Traffic, Errors, Saturation — dashboard sederhana cukup.
- **Anti-pattern paling umum pemula**: The Procrastinator — "nanti saja update-nya". Padahal update keamanan yang tertunda adalah pintu masuk peretas.
