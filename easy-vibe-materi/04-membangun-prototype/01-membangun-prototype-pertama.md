# MEMBANGUN PROTOTYPE: DARI IDE MENJADI APLIKASI

---

## Apa Itu Prototype?

### Definisi Sederhana

**Prototype** adalah versi awal dari aplikasi yang berfungsi (bisa dijalankan) tapi belum lengkap. Tujuannya adalah untuk:
- Menguji apakah ide Anda bisa diwujudkan
- Mendemonstrasikan ke orang lain (klien, investor, tim)
- Mendapat feedback sebelum invest waktu lebih banyak

### Perbedaan Prototype vs Produk Jadi

| Aspek | Prototype | Produk Jadi |
|-------|-----------|--------------|
| **Fitur** | Fitur inti saja | Semua fitur planned |
| **Design** | Sederhana, fungsional | Polished, professional |
| **Data** | Dummy data | Data real |
| **Testing** | Terbatas | Komprehensif |
| **Waktu** | Hari - 1-2 minggu | Minggu - bulan |

---

## Tahapan Membangun Prototype

### Tahap 1: Perencanaan (Pre-Development)

#### 1.1. Definisikan Fitur Inti (MVP - Minimum Viable Product)

**MVP** adalah versi paling sederhana dari produk yang masih bisa memberikan nilai ke user.

**Cara menentukan MVP:**
1. Tulis semua fitur yang Anda bayangkan
2. Prioritaskan dengan framework:
   - **Must Have**: Tanpa ini, app tidak berguna
   - **Should Have**: Penting tapi bisa ditunda
   - **Nice to Have**: Bagus ada tapi tidak krusial

**Contoh - App Todo List:**

```
Must Have:
- Tambah tugas baru
- Tandai selesai
- Hapus tugas
- Lihat semua tugas

Should Have:
- Kategori/tags
- Tanggal deadline
- Filter tugas

Nice to Have:
- Dark mode
- Share ke sosmed
- Sync antar device
```

#### 1.2. Tentukan Tech Stack

**Pertanyaan:**
- Platform apa? (Web, Mobile, Desktop)
- Bahasa pemrograman apa?
- Framework apa?
- Database perlu atau tidak?

**Rekomendasi untuk Pemula:**

| Kebutuhan | Tech Stack | Alasan |
|-----------|------------|--------|
| Web sederhana | HTML + CSS + JS | Tidak perlu setup rumit |
| Web dengan interaksi | React + Vite | Populer, banyak tutorial |
| Web dengan data | Next.js + Supabase | Full-stack dalam satu |
| Mobile sederhana | React Native / Expo | Sekali code untuk iOS & Android |

#### 1.3. Buat Wireframe Sederhana

**Wireframe** adalah sketsa kasar dari tampilan app.

**Cara membuat:**
- Di atas kertas
- Di aplikasi seperti Figma/Flowchart
- Bahkan di head saja cukup untuk awal

**Elemen yang perlu ada:**
- Layout halaman utama
- Navigation (bagaimana user bergerak antar halaman)
- Input form (data apa yang perlu diinput)
- Button dan action utama

---

### Tahap 2: Setup Environment

#### 2.1. Pilih AI IDE

**Rekomendasi: Cursor**

**Langkah setup Cursor:**
1. Download dari https://cursor.sh
2. Install dan buka
3. Buat project baru atau open folder kosong
4. Tekan `Ctrl + L` untuk membuka AI chat

#### 2.2. Inisialisasi Proyek

**Untuk Web Sederhana (HTML + CSS + JS):**
```
Buat struktur folder:
├── index.html
├── style.css
├── script.js
└── assets/ (untuk gambar, dll)
```

**Untuk React (menggunakan Vite):**
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

**Untuk Next.js:**
```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

---

### Tahap 3: Development dengan AI

#### 3.1. Cara Berkomunikasi dengan AI

**Struktur Prompt yang Baik:**

```
[Context: Konteks aplikasi]
Saya sedang membuat [jenis aplikasi] untuk [target user].

[Task: Tugas yang ingin dilakukan]
Tolong buatkan [komponen/fitur spesifik].

[Requirements: Spesifikasi teknis]
- Menggunakan [teknologi]
- Fitur: [detail fitur]
- Design: [gaya yang diinginkan]

[Constraints: Batasan]
- Hindari: [hal yang dihindari]
- Prioritas: [prioritas tertentu]
```

**Contoh Prompt:**

```
Context: Saya membuat todo list app sederhana untuk personal use.
Task: Tolong buatkan halaman utama dengan daftar tugas.
Requirements:
- Menggunakan HTML, CSS, JavaScript murni
- Ada form input untuk menambah tugas baru
- Ada list untuk menampilkan tugas
- Setiap tugas ada checkbox untuk tandai selesai dan tombol hapus
- Design: clean, modern, warna biru
Constraints: Jangan gunakan framework eksternal
```

#### 3.2. Proses Iteratif

**Langkah development:**

```
1. Minta AI generate struktur dasar
   ↓
2. Review dan test
   ↓
3. Ada error? → Copy error message ke AI → Minta perbaikan
   ↓
4. Mau tambah fitur? → Minta ke AI dengan spesifik
   ↓
5. Review dan test lagi
   ↓
6. Ulangi sampai满意
```

#### 3.3. Contoh Dialog dengan AI

**Anda:** "Buatkan struktur HTML untuk todo list app dengan form input dan list tugas."

**AI:** (Menggenerate kode)

**Anda:** "Tolong tambahkan CSS agar terlihat modern dengan warna biru."

**AI:** (Menggenerate CSS)

**Anda:** "Sekarang tambahkan JavaScript agar form bisa menambah tugas ke list."

**AI:** (Menggenerate JavaScript)

**Anda:** "Ada bug, saat klik checkbox tidak berubah jadi selesai. Tolong perbaiki."

**AI:** (Memperbaiki kode)

---

### Tahap 4: Testing dan Debugging

#### 4.1. Cara Testing

**Manual Testing:**
1. Buka aplikasi di browser
2. Coba semua fitur satu per satu
3. Catat apa yang tidak bekerja

**Testing Checklist:**

| Fitur | Test Case | Hasil |
|-------|-----------|-------|
| Tambah tugas | Isi form, submit, cek muncul di list | ✅/❌ |
| Hapus tugas | Klik hapus, cek hilang dari list | ✅/❌ |
| Tandai selesai | Klik checkbox, cek berubah style | ✅/❌ |
| Form validation | Submit kosong, cek ada pesan error | ✅/❌ |
| Responsive | Buka di mobile, cek layout baik | ✅/❌ |

#### 4.2. Debugging dengan AI

**Cara efektif meminta bantuan AI untuk debug:**

```
Saya mendapat error berikut saat menjalankan kode:

[Tempel error message di sini]

Konteks:
- Menggunakan [teknologi]
- Kode ada di file [nama file]
- Saya menggunakan [browser/environment]

Tolong bantu找出问题 dan berikan solusi yang bisa langsung dicoba.
```

**Tips:**
- Selalu tempel error message lengkap
- Jelaskan environment yang digunakan
- Minta penjelasan bukan hanya kode, agar belajar

---

### Tahap 5: Polish dan Presentation

#### 5.1. Cara Membuat Tampilan Lebih Baik

**Tambahkan:**
- Consistent color scheme
- Proper spacing dan alignment
- Hover effects untuk interaktivitas
- Loading states untuk feedback
- Error messages yang helpful

**Sumber design inspiration:**
- Dribbble.com
- Behance.net
- Pinterest
- UI patterns dari Google

#### 5.2. Cara Mendemonstrasikan

**Siapkan:**
1. **Demo script**: Langkah-langkah yang akan ditunjukkan
2. **Flow yang jelas**: Mulai dari mana, ending di mana
3. **Scenario**: Ceritakan use case yang akan di-demo

**Contoh Demo Script untuk Todo List:**
```
1. "Ini adalah aplikasi Todo List yang saya buat"
2. "Pertama, saya akan menambah tugas baru: 'Belanja bahan makanan'"
3. "Terlihat tugas muncul di list"
4. "Sekarang saya tandai selesai pada tugas pertama"
5. "Tugas berubah menjadi crossed out"
6. "Terakhir, saya hapus tugas kedua"
7. "Tugas hilang dari list"
8. "Sekian demo dari aplikasi saya, pertanyaan?"
```

---

## Contoh Project: Todo List Sederhana

### Spesifikasi

- **Target**: Personal use
- **Tech**: HTML + CSS + JavaScript
- **Fitur MVP**:
  - Tambah tugas
  - Tandai selesai
  - Hapus tugas
  - Simpan ke localStorage (data tidak hilang saat refresh)

### Langkah Pembuatan

#### Langkah 1: Struktur HTML

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>📝 Todo List Saya</h1>
        
        <form id="todoForm">
            <input type="text" id="todoInput" placeholder="Apa yang perlu dilakukan?" required>
            <button type="submit">Tambah</button>
        </form>
        
        <ul id="todoList"></ul>
        
        <div class="stats">
            <span id="totalTodos">Total: 0</span>
            <span id="completedTodos">Selesai: 0</span>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```

#### Langkah 2: Styling CSS

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    background: white;
    border-radius: 20px;
    padding: 30px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
}

input:focus {
    border-color: #667eea;
}

button {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #5568d3;
}

ul {
    list-style: none;
}

li {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 10px;
    margin-bottom: 10px;
    transition: all 0.3s;
}

li:hover {
    transform: translateY(2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

li.completed {
    opacity: 0.6;
}

li.completed span {
    text-decoration: line-through;
}

.checkbox {
    width: 20px;
    height: 20px;
    margin-right: 15px;
    cursor: pointer;
}

span {
    flex: 1;
    color: #333;
}

.delete-btn {
    background: #ff5f5f;
    padding: 8px 12px;
    font-size: 14px;
}

.delete-btn:hover {
    background: #ff3333;
}

.stats {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    color: #666;
}
```

#### Langkah 3: JavaScript Logic

```javascript
// Select elements
const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');
const totalSpan = document.getElementById('totalTodos');
const completedSpan = document.getElementById('completedTodos');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Render todos
function renderTodos() {
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">Hapus</button>
        `;
        
        list.appendChild(li);
    });
    
    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    totalSpan.textContent = `Total: ${total}`;
    completedSpan.textContent = `Selesai: ${completed}`;
}

// Add new todo
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        input.value = '';
    }
});

// Toggle todo completion
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Delete todo
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// Save to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Initial render
renderTodos();
```

---

## Troubleshooting Umum

### 1. AI Menghasilkan Kode yang Tidak Sesuai Ekspektasi

**Solusi:**
- Berikan contoh visual (screenshot)
- Pecah jadi langkah-langkah lebih kecil
- Minta AI menjelaskan dulu sebelum generate

### 2. Aplikasi Tidak Tampil di Browser

**Solusi:**
- Cek struktur folder sudah benar
- Cek path file di HTML sudah sesuai
- Cek ada error di console browser (F12)

### 3. Data Tidak Tersimpan

**Solusi:**
- Cek localStorage sudah digunakan dengan benar
- Cek ada error di console saat save
- Ingat: localStorage hanya untuk browser, tidak untuk production

### 4. Responsif di Mobile Tidak Bagus

**Solusi:**
- Tambahkan meta viewport di HTML
- Gunakan relative units (%, rem) bukan fixed (px)
- Test langsung di mobile atau responsive mode browser

---

## Checklist Sebelum Selesai

- [ ] Semua fitur MVP sudah berfungsi
- [ ] Tidak ada error saat diuji
- [ ] Tampilan sudah rapi dan konsisten
- [ ] Data tersimpan dengan benar (jika ada)
- [ ] Responsive untuk berbagai ukuran layar
- [ ] Sudah di-test di browser berbeda (Chrome, Firefox, Safari)
- [ ] Demo sudah disiapkan dan dipraktekkan

---

## Langkah Selanjutnya

Setelah prototype jadi, Anda bisa:

1. **Tambah fitur** dari "Should Have" list
2. **Deploy** ke internet agar bisa diakses orang lain
3. **Validasi** dengan user target untuk dapat feedback
4. **Iterasi** berdasarkan feedback yang masuk

Ingat: Prototype bukan终点, tapi awal dari proses pembelajaran dan improvement terus-menerus.