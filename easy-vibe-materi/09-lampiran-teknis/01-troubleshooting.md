# LAMPIRAN TEKNIS: TROUBLESHOOTING DAN ALAT PEMROGRAMAN AI

---

## Bagian 1: Apa yang Harus Dilakukan Jika Mengalami Error

### Step-by-Step Debugging

#### Step 1: Baca Pesan Error dengan Seksama

**Pertama-tama, jangan panik!** Error adalah bagian normal dari development.

**Perhatikan:**
- Jenis error (Syntax, Runtime, Logic)
- Lokasi error (baris mana, file mana)
- Pesan spesifik yang diberikan

**Contoh:**
```
Error: Cannot read property 'map' of undefined
Location: app.js:45:15
```

---

#### Step 2: Cari di Google

**Tips mencari error:**
- Copy-paste pesan error yang persis
- Tambahkan nama framework/teknologi
- Cari di Stack Overflow atau GitHub Issues

**Contoh query:**
```
"Cannot read property 'map' of undefined" JavaScript
"TypeError: undefined is not an object" React Native
```

---

#### Step 3: Gunakan AI untuk Debugging

**Prompt yang efektif:**
```
Saya mendapat error berikut:

[Tempel error message di sini]

Konteks:
- Menggunakan [teknologi, versi]
- Kode ada di file [nama file]
- Sedang mencoba [apa yang ingin dilakukan]

Tolong:
1. Jelaskan mengapa error terjadi
2. Berikan kode perbaikan yang bisa langsung dicoba
3. Jelaskan cara mencegah error serupa
```

---

#### Step 4: Konsol dan Network Tab

**Chrome DevTools (F12):**

| Tab | Fungsi |
|-----|--------|
| Console | Lihat error dan log JavaScript |
| Network | Lihat request yang keluar/masuk |
| Elements | Inspect HTML dan CSS |
| Sources | Debug JavaScript dengan breakpoint |

---

#### Step 5: Isolation Testing

**Teknik:**
1. Comment out kode yang mencurigakan
2. Run ulang aplikasi
3. Jika error hilang, berarti masalah di kode yang di-comment
4. Jika masih ada, berarti masalah di tempat lain
5. Ulangi sampai ketemu

---

## Bagian 2: Error Umum dan Solusinya

### 1. Syntax Errors

#### a. Unexpected Token

**Pesan:**
```
SyntaxError: Unexpected token {
```

**Penyebab:**
- Kurung kurawal tidak match
- Typo di kode
- Salah indentasi

**Solusi:**
- Cek semua kurung buka dan tutup
- Gunakan code formatter (Prettier)
- Cek tanda kurung yang match

---

#### b. Uncaught SyntaxError

**Pesan:**
```
Uncaught SyntaxError: Unexpected end of input
```

**Penyebab:**
- Kurung tidak tertutup
- String tidak ditutup
- Kurung () tidak match

**Solusi:**
- Cek setiap string punya kutip awal dan akhir
- Cek setiap function punya kurung yang match

---

### 2. Runtime Errors

#### a. Cannot read property of undefined

**Pesan:**
```
TypeError: Cannot read property 'map' of undefined
```

**Penyebab:**
- Mengakses properti object yang tidak ada
- Array belum terinisialisasi
- Data dari API belum ada

**Solusi:**
```javascript
// Sebelum
data.map(item => item.name)

// Sesudah
data?.map(item => item.name) || []

// Atau
if (data) {
    data.map(item => item.name)
}
```

---

#### b. CORS Error

**Pesan:**
```
Access to fetch at 'https://api.example.com/data' 
from origin 'http://localhost:3000' has been blocked 
by CORS policy
```

**Penyebab:**
- Server tidak mengizinkan request dari origin Anda

**Solusi:**
- Jika Anda yang kontrol server: tambahkan CORS headers
- Jika tidak: gunakan proxy atau JSONP
- Untuk development: install CORS extension

---

#### c. 404 Not Found

**Pesan:**
```
GET https://api.example.com/data 404 (Not Found)
```

**Penyebab:**
- URL salah
- Endpoint tidak ada
- Endpoint berubah

**Solusi:**
- Cek URL sudah benar
- Cek dokumentasi API
- Coba endpoint lain

---

### 3. Logic Errors

#### a. Infinite Loop

**Gejala:**
- Browser freeze
- Page tidak responsif

**Penyebab:**
- Loop tanpa kondisi berhenti
- Kondisi selalu true

**Solusi:**
```javascript
// Sebelum (salah)
while (true) {
    console.log('loop');
}

// Sesudah (benar)
let count = 0;
while (count < 10) {
    console.log('loop');
    count++;
}
```

---

#### b. Async/Await Issues

**Pesan:**
```
UnhandledPromiseRejectionWarning: Unhandled promise rejection
```

**Penyebab:**
- Tidak handle error di async function
- Forget to await

**Solusi:**
```javascript
// Sebelum (salah)
async function getData() {
    fetch('/api/data') // forget await
}

// Sesudah (benar)
async function getData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

### 4. CSS/UI Errors

#### a. Element Tidak Tampil

**Kemungkinan:**
- Display: none
- Visibility: hidden
- Width/Height: 0
- Z-index rendah

**Solusi:**
- Inspect element di DevTools
- Cek computed styles

---

#### b. Responsive Tidak Berfungsi

**Kemungkinan:**
- Meta viewport tidak ada
- Media query salah
- Fixed width

**Solusi:**
```html
<!-- Pastikan ada ini di head -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

```css
/* Gunakan relative units */
.container {
    width: 100%; /* bukan fixed px */
    max-width: 1200px;
}
```

---

## Bagian 3: Perbandingan 7 Alat Pemrograman AI

### Tabel Perbandingan

| Alat | Kelebihan | Kekurangan | Harga | Cocok Untuk |
|------|-----------|------------|-------|-------------|
| **Cursor** | - AI terintegrasi penuh<br>- Code completion<br>- Chat dengan konteks | - Paid untuk fitur lengkap<br>- Butuh learning curve | Free + $19/bln | Semua level |
| **Claude Code** | - Konteks sangat baik<br>- Kode berkualitas tinggi<br>- Multi-file analysis | - Setup lebih rumit<br>- Akses terbatas | Free + API | Developer berpengalaman |
| **GitHub Copilot** | - Integrasi luas<br>- Autocomplete cerdas<br>- Multi-language | - Kadang tidak akurat<br>- Paid untuk fitur lengkap | $10/bln | Pemula - Menengah |
| **Tabnine** | - Offline mode<br>- Ringan<br>- Multi-IDE | - Fitur terbatas<br>- Kurang smart | Free + $12/bln | Yang butuh offline |
| **Replit AI** | - Online, tidak perlu install<br>- Instant deploy<br>- Collaboration | - Terbatas dibanding lokal<br>- Perlu internet | Free + $7/bln | Pemula, belajar |
| **v0 (Vercel)** | - Generate UI cepat<br>- Tailwind based<br>- Beautiful by default | - Hanya React<br>- Tidak untuk backend | Free + $20/bln | Frontend developer |
| **bolt.new** | - Full-stack generation<br>- Deploy langsung<br>- Natural language | - Masih baru<br>- Kurang kontrol | Free + $20/bln | Rapid prototyping |

---

### Rekomendasi Berdasarkan Use Case

#### Untuk Pemula yang Ingin Belajar

**Rekomendasi: Replit atau bolt.new**

Alasan:
- Tidak perlu setup environment
- Langsung bisa coding di browser
- Ada template yang bisa dipelajari
- Error handling yang baik

---

#### Untuk Membangun Prototype Cepat

**Rekomendasi: bolt.new + v0**

Alasan:
- Generate full app dari deskripsi
- Langsung bisa deploy
- UI yang sudah bagus
- Cocok untuk validasi ide

---

#### Untuk Proyek Real yang Lebih Kompleks

**Rekomendasi: Cursor + Claude Code**

Alasan:
- Konteks proyek yang baik
- Kode berkualitas tinggi
- Debugging yang efektif
- Multi-file editing

---

#### Untuk Developer yang Sudah Pro

**Rekomendasi: Claude Code + GitHub Copilot**

Alasan:
- Claude untuk reasoning kompleks
- Copilot untuk autocomplete cepat
- Kombinasi yang powerful
- Workflow yang fleksibel

---

## Bagian 4: Cara Menggunakan AI untuk Debugging Secara Efektif

### Template Prompt untuk Debugging

#### Template 1: Error Umum

```
[Error Message]
[Tempel error message di sini]

[Context]
- Bahasa/Framework: [contoh: JavaScript, React]
- File: [contoh: src/App.js]
- Apa yang sedang dilakukan: [contoh: mengambil data dari API]

[Yang sudah dicoba]
- [Langkah 1]
- [Langkah 2]

[Tolong berikan]
1. Penjelasan error
2. Solusi yang bisa langsung dicoba
3. Cara mencegah error serupa
```

#### Template 2: Bug yang Tidak Jelas

```
[Deskripsi Bug]
[Deskripsikan apa yang terjadi vs yang diharapkan]

[Reproduction Steps]
1. Buka halaman X
2. Klik tombol Y
3. Hasil yang diharapkan: Z
4. Hasil aktual: W

[Environment]
- Browser:
- OS:
- Versi framework:

[Tolong bantu]
1.找出 kemungkinan penyebab
2. Cara debugging yang efektif
3. Solusi yang bisa dicoba
```

#### Template 3: Performance Issue

```
[Deskripsi]
Halaman/app terasa lambat saat [aktivitas tertentu]

[Data]
- Waktu load: [contoh: 5 detik]
- Jumlah data: [contoh: 1000 items]
- Device: [contoh: iPhone 12]

[Yang sudah dicek]
- [contoh: Lazy loading sudah digunakan]
- [contoh: Images sudah dioptimasi]

[Tolong bantu]
1. Kemungkinan penyebab
2. Cara optimize
3. Tools untuk profiling
```

---

## Bagian 5: Best Practices untuk Error Handling

### 1. Always Use Try-Catch

```javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // atau fallback value
    }
}
```

### 2. Provide User-Friendly Error Messages

```javascript
// Sebelum
alert('Error: ' + error.message)

// Sesudah
alert('Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa menit.');
```

### 3. Log Errors for Debugging

```javascript
function logError(error, context) {
    console.error(`[${new Date().toISOString()}] ${context}:`, error);
    // Kirim ke error tracking service
    // errorTracker.capture(error, { context });
}
```

### 4. Graceful Degradation

```javascript
function getData() {
    try {
        return fetchFromAPI();
    } catch (error) {
        // Fallback ke cached data
        return getCachedData() || [];
    }
}
```

---

## Checklist Debugging

### Sebelum Ask for Help

- [ ] Sudah baca dan memahami pesan error
- [ ] Sudah mencoba cari di Google
- [ ] Sudah coba debug sendiri dengan console.log
- [ ] Sudah isolir masalah dengan comment/uncomment code

### Saat Ask for Help

- [ ] Sediakan konteks yang cukup
- [ ] Sediakan kode yang relevan
- [ ] Sediakan langkah reproduksi
- [ ] Sediakan screenshot jika ada

### Setelah Dapat Solusi

- [ ] Coba solusi yang diberikan
- [ ] Pahami mengapa error terjadi
- [ ] Catat untuk referensi future
- [ ] Share solusi jika masih stuck

---

## Kesimpulan

Error adalah bagian dari proses learning. Dengan memahami cara debug yang efektif:

1. **Tidak perlu panik** saat error muncul
2. **Lebih cepat menyelesaikan** masalah
3. **Lebih mandiri** dalam development
4. **Lebih baik dalam menggunakan AI** untuk debugging

Ingat: Setiap error adalah kesempatan untuk belajar sesuatu yang baru!