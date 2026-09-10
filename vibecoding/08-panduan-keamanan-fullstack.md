# Panduan Keamanan Fullstack untuk Programmer Pemula

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/full-stack-security-guide.md

## Pengantar untuk Vibe Coder

Belakangan ini banyak programmer pemula yang melaporkan masalah keamanan di aplikasi mereka. Panduan ini akan membantu kamu memahami cara mendokumentasikan dan mengamankan aplikasi fullstack dengan benar.

> 📌 **Buat yang masih baru:** Kenapa panduan ini dimulai dari *dokumentasi*, bukan langsung daftar trik keamanan? Karena **kamu tidak bisa mengamankan sesuatu yang tidak kamu pahami**. Kebanyakan bug keamanan pemula terjadi karena aplikasi dibangun "asal jalan" tanpa sadar ada lapisan apa saja — dan tiap lapisan punya celahnya sendiri.

## Dokumentasikan Arsitektur Fullstack-mu

Buat dokumen teks bernama `full_stack.txt` dengan informasi berikut:

1. **Daftarkan setiap lapisan stack-mu secara terpisah** (satu baris per lapisan).
2. **Untuk setiap lapisan, dokumentasikan:**
   - Teknologi yang kamu gunakan
   - Langkah keamanan yang diimplementasikan
   - Konfigurasi rate limiting (pembatasan jumlah permintaan)
   - Detail infrastruktur
   - Perkiraan jumlah pengguna bersamaan
3. **Untuk keseluruhan aplikasi, dokumentasikan:**
   - Puncak permintaan per menit/jam/hari
   - Rata-rata durasi sesi pengguna

> 📌 **Buat yang masih baru:** *Rate limiting* = membatasi berapa banyak permintaan yang boleh masuk ke server dalam jangka waktu tertentu (mis. 100 permintaan/menit per pengguna). Ini pertahanan pertama terhadap penyalahgunaan dan serangan. *Stack* = kumpulan teknologi berlapis yang membangun aplikasi (misal: React → Node.js → PostgreSQL → server VPS → Cloudflare).

## Review Dokumentasi-mu

Setelah dokumentasi selesai:
- Bagikan dengan asisten AI seperti Claude 3.7 Sonnet dan minta umpan balik.
- Minta mereka menjelaskan kenapa merekomendasikan perubahan tertentu.
- Minta pro dan kontra untuk setiap rekomendasi.
- **Ingat: kamu yang membuat keputusan final.**

## Pendekatan Keamanan

Ingat prinsip kunci berikut:
- Keamanan itu penting, tapi bukan satu-satunya pertimbangan.
- **Perlakukan setiap lapisan stack sebagai komponen independen.**
- Mengamankan satu lapisan tidak otomatis mengamankan lapisan lain.
- Optimalkan performa (misalnya, membuang paket yang tidak diinginkan bisa mengurangi beban CPU).
- **Memahami seluruh arsitektur membantumu membatasi vektor serangan.**

> 💡 **Poin emas:** Banyak pemula berpikir "saya sudah pakai HTTPS jadi aman" atau "backend sudah aman jadi frontend tak perlu". Salah! Penyerang mencari lapisan TERLEMAH. Tiap lapisan harus dipertahankan sendiri.

## Praktik Keamanan Esensial

### 1. Manajemen Kredensial (Password & API Key)
- **Environment Variables**: Jangan pernah menuliskan API key, password, atau konfigurasi sensitif langsung di kode.
- Gunakan file `.env` untuk pengembangan lokal (tambahkan ke `.gitignore`).
- Gunakan manajemen environment variable yang aman di produksi.
- Pertimbangkan menggunakan layanan secrets manager untuk lingkungan produksi.

> 📌 **Buat yang masih baru:** *Environment variable* = nilai yang disimpan di luar kode, diisi saat aplikasi dijalankan. Contoh: `DATABASE_URL=postgres://...` disimpan di file `.env` (yang TIDAK ikut di-commit ke GitHub), bukan diketik langsung di kode. Kenapa? Karena kalau kode kamu bocor ke publik (misal salah commit), kunci API ikut bocor dan bisa disalahgunakan orang lain.

### 2. Keamanan Database
- **Rate Limiting**: Implementasikan di tingkat database.
- Atur batas koneksi pool.
- Tambah batas waktu query dan transaksi.
- Pantau dan beri peringatan pada pola query yang tidak biasa.
- **Row Level Security (RLS)**: Terapkan kebijakan akses di tingkat database.
- Uji kebijakan RLS-mu secara menyeluruh.
- **Gunakan UUID** alih-alih ID increment (1, 2, 3) untuk mencegah serangan enumerasi.

> 📌 **Buat yang masih baru:** *Enumerasi* = serangan dengan menebak ID berurutan. Kalau URL aplikasi kamu `.../profil/3`, orang bisa coba `.../profil/4`, `5`, dst untuk mengakses data orang lain. UUID (angka acak panjang seperti `3f2a9c1e-...`) membuat tebakan menjadi mustahil.

### 3. Keamanan API
- **Rate Limiting**: Implementasikan di semua endpoint API.
- Lacak permintaan berdasarkan IP, ID pengguna, dan API key.
- Atur batas sesuai sensitivitas endpoint.
- Tambahkan penurunan kualitas yang anggun (graceful degradation) saat mendekati batas.
- **Validasi Input**: Validasi semua input pengguna di setiap lapisan.
- Gunakan tipe kuat dan skema (schema) bila memungkinkan.
- Sanitasi input sebelum diproses atau disimpan.
- **Implementasikan token CSRF untuk semua permintaan POST/PUT/DELETE.**

> 📌 **Buat yang masih baru:** *CSRF* = serangan yang memaksa pengguna yang sudah login menjalankan aksi tak diinginkan (misal transfer uang) lewat website jahat. Token CSRF adalah kode rahasia acak yang disisipkan di form — server hanya menerima permintaan yang membawa token valid. *Validasi input* = periksa semua data dari pengguna sebelum dipakai: format benar? panjang wajar? mengandung karakter aneh?

### 4. Keamanan Version Control (Git)
- **.gitignore**: Konfigurasi dengan benar untuk mengecualikan:
  - File environment (`.env`, `.env.local`, dll.)
  - File log dan informasi debugging
  - Direktori dependensi (`node_modules`, `vendor`, dll.)
  - File kredensial, sertifikat, dan kunci
- **.dockerignore**: Konfigurasi untuk mengecualikan:
  - File khusus development
  - File test dan fixture
  - Dokumentasi dan aset non-esensial
  - Konfigurasi lokal

> 📌 **Buat yang masih baru:** `.gitignore` adalah "daftar larangan" untuk Git — file yang terdaftar di situ tidak akan ikut di-commit. Ini lapisan pertahanan pertama untuk API key-mu. Periksa dengan `git status` sebelum commit: kalau muncul `.env` di daftar file yang akan di-commit, STOP — kamu hampir bocor!

### 5. Keamanan Infrastruktur
- **Cloudflare** DNS proxy dan cache situs.
- **Web Application Firewalls (WAF)**.
- **Tunnel dan reverse proxy**.
- **Firewall lokal** (UFW, IPTABLES).
- **Autentikasi mTLS**.
- **Certificate Authority (CA)**.
- **Praktik keamanan CI/CD** dengan pemindaian keamanan dalam pipeline.

> 📌 **Buat yang masih baru:** *WAF* = "satpam" yang menyaring lalu lintas jahat sebelum sampai ke server. *Firewall* = aturan di server yang membolehkan/memblokir koneksi berdasarkan port dan alamat. *Reverse proxy* = perantara yang menerima permintaan lalu meneruskannya ke aplikasi (juga membantu menyembunyikan detail server). Mulai dari firewall sederhana dan Cloudflare — keduanya gratis untuk skala kecil.

### 6. Keamanan Tingkat Kode
- **OWASP Top 10**: Kenali kerentanan umum (daftar 10 besar risiko keamanan web yang diperbarui secara berkala).
- Pencegahan SQL Injection.
- Perlindungan Cross-site scripting (XSS).
- Mitigasi deserialization tidak aman.
- Pencegahan autentikasi rusak.
- **Pemindaian Rutin**: Gunakan alat seperti:
  - Static Application Security Testing (SAST) — pemindaian kode statis.
  - Dynamic Application Security Testing (DAST) — pemindaian aplikasi berjalan.
  - Software Composition Analysis (SCA) — analisis dependensi.
  - Pemindai khusus seperti Corgea.

### 7. Autentikasi Pengguna & Sesi
- **Penyimpanan Password yang Aman**: Gunakan algoritma hashing yang tepat (bcrypt, Argon2).
- **Multi-Factor Authentication (MFA)**: Implementasikan bila memungkinkan.
- **Manajemen Sesi**: Gunakan cookie yang aman, httpOnly, SameSite.
- **Kebijakan Kunci Akun (Account Lockout)**: Cegah serangan brute force.

> 📌 **Buat yang masih baru:** Jangan pernah menyimpan password "apa adanya" di database. *Hash* mengubah password menjadi rangkaian acak yang tidak bisa dibalik — saat login, yang dibandingkan adalah hash-nya. bcrypt/Argon2 sengaja lambat supaya penyerang tidak bisa menebak jutaan password per detik. *httpOnly cookie* = cookie yang tidak bisa dibaca JavaScript (mencegah pencurian lewat XSS).

### 8. Pemantauan & Respons
- **Logging**: Implementasikan logging komprehensif di semua lapisan stack.
- **Alerting**: Siapkan peringatan untuk peristiwa terkait keamanan.
- **Program Bug Bounty**: Pertimbangkan implementasi setelah kamu mulai dikenal.
  - Tawarkan hadiah sesuai tingkat keparahan kerentanan.
  - Aturan dan cakupan yang jelas untuk mendorong pelaporan yang bertanggung jawab.

## Menguji Keamanan-mu

Uji aplikasi secara rutin menggunakan:
1. Alat pemindaian keamanan.
2. Penetration testing manual.
3. Review kode berfokus keamanan.
4. Pemindaian kerentanan dependensi.
5. Pembaruan keamanan rutin untuk semua komponen.

Ingat bahwa **keamanan adalah proses berkelanjutan, bukan implementasi sekali jalan**. Tetap ikuti informasi tentang kerentanan baru dan terus tingkatkan praktik keamananmu.

Dengan mengikuti pendekatan terstruktur ini, kamu akan menciptakan aplikasi yang lebih aman dan lebih siap menghadapi potensi ancaman.

## Intinya buat pemula

- **Mulai dari dokumentasi**: tulis `full_stack.txt` — kamu tidak bisa mengamankan yang tidak kamu pahami.
- **8 area esensial**: kredensial (.env + .gitignore), database (RLS, UUID, rate limit), API (validasi input, CSRF, rate limit), Git (jangan commit rahasia!), infrastruktur (firewall, WAF, Cloudflare), kode (OWASP Top 10), autentikasi (bcrypt/Argon2, httpOnly cookie), pemantauan (logging + alerting).
- **Prinsip terpenting**: tiap lapisan dijaga sendiri — mengamankan backend tidak otomatis mengamankan frontend.
- **Untuk pemula, urutan prioritas**: (1) jangan bocorkan kunci di kode/Git, (2) validasi semua input, (3) hash password dengan benar, (4) batasi permintaan (rate limit), (5) backup dan log.
- **Keamanan itu proses**: scan rutin, update dependensi, dan jadikan review keamanan kebiasaan.
