# 🎯 FASE 3: Dari Prompt ke Kode

> **Belajar baca dan pahami kode yang dihasilkan AI — tanpa takut**
> Waktu: ~60 menit | Level: 🟢 Pemula (no coding experience needed)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Cara "membaca" kode JavaScript dasar
✅ Struktur: Variable → Function → Kondisi
✅ Cara AI menerjemahkan prompt ke kode
✅ Membaca dan memahami error
✅ Latihan: modifikasi kode hasil AI
```

---

## 🧠 3.1 KENAPA KAMU HARUS PAHAM KODE?

### Realitanya:

```
KAMU KASIH PROMPT KE AI
       │
       ▼
AI KASIH KODE JAVASCRIPT
       │
       ▼
KAMU BINGUNG: "Ini kode apa?"
       │
       ▼
KAMU COPY-PASTE SEMBARANGAN
       │
       ▼
ERROR! GAK JALAN!
```

### Solusinya:

Kamu gak perlu bisa nulis kode dari nol. Tapi kamu perlu **bisa baca kode** biar:

1. Tahu apa yang dilakukan AI
2. Bisa debug error sederhana
3. Bisa modifikasi sesuai kebutuhan
4. Gak jadi "copy-paste programmer"

---

## 🧠 3.2 STRUKTUR DASAR JAVASCRIPT

### Kamu cuma perlu paham 4 hal ini:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. VARIABLE ── Kotak untuk nyimpan data               │
│     let nama = "Budi"                                   │
│                                                         │
│  2. FUNCTION ── Blok kode yang bisa dipanggil           │
│     function sapa(nama) { return "Halo " + nama }       │
│                                                         │
│  3. KONDISI ── Decision: if ini, else itu              │
│     if (umur >= 17) { dewasa } else { belum }           │
│                                                         │
│  4. EVENT ── "Kalau tombol diklik, lakukan ini"        │
│     button.onclick = function() { ... }                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 1. Variable (Paling Dasar)

Variable = **tempat nyimpan data**. Seperti kotak dengan label.

```javascript
// Cara buat variable:
let namaSaya = "Budi";        // Teks (string)
let umurSaya = 25;            // Angka (number)
let sudahBelajar = true;      // Benar/salah (boolean)

// Cara pake:
console.log(namaSaya);        // Output: "Budi"
console.log(umurSaya + 5);    // Output: 30
```

**Baca ini di kode hasil AI:**
```javascript
let nama = "Budi";   // "AI nyimpen teks 'Budi' di variable 'nama'"
let umur = 25;       // "AI nyimpen angka 25 di variable 'umur'"
```

### 2. Function (Yang Paling Sering Muncul)

Function = **blok kode yang melakukan tugas tertentu**. Seperti resep masakan.

```javascript
// Cara bikin function:
function sapaUser(nama) {
  // ↑ nama ini namanya PARAMETER (input)
  return "Halo, " + nama + "!";
  // ↑ return ini OUTPUT function
}

// Cara pake:
let hasil = sapaUser("Budi");
//            ↑ panggil function dengan input "Budi"
console.log(hasil);  
// Output: "Halo, Budi!"
```

**Struktur Function:**
```
function NAMA_FUNCTION(INPUT) {
  // Kode yang dijalankan
  return OUTPUT;
}
```

### 3. Kondisi (If-Else)

Kondisi = **"Kalau ini terjadi, lakukan A. Kalau tidak, lakukan B"**

```javascript
let nilai = 80;

if (nilai >= 75) {
  // Kalau nilai >= 75, jalanin ini
  console.log("Lulus!");
} else {
  // Kalau tidak, jalanin ini
  console.log("Tidak lulus!");
}
// Output: "Lulus!"
```

### 4. Event Handler (Untuk Web)

Event = **"Kalau user melakukan X, jalankan Y"**

```javascript
// Dapatkan element HTML
let tombol = document.getElementById("tombolSaya");

// Kalau tombol diklik, jalanin function ini
tombol.onclick = function() {
  alert("Tombol diklik!");
};
```

---

## 🧠 3.3 BACA KODE HASIL AI: CONTOH NYATA

### Contoh 1: Kalkulator Sederhana

Prompt: *"Buatkan function JavaScript untuk menjumlahkan dua angka"*

```javascript
// AI menghasilkan ini:
function tambah(a, b) {
  // ↑ Function bernama 'tambah' dengan 2 input: a dan b
  return a + b;
  // ↑ Output: hasil penjumlahan a dan b
}

// Cara pake:
let hasil = tambah(5, 3);
//            ↑ masukin 5 sebagai a, 3 sebagai b
console.log(hasil);  
// Output: 8
```

### Contoh 2: Cek Usia

Prompt: *"Buatkan function yang ngecek apakah seseorang sudah dewasa (>= 17 tahun)"*

```javascript
function cekDewasa(usia) {
  // ↑ Input: usia (angka)

  if (usia >= 17) {
    // ↑ Kalau usia 17 atau lebih
    return "Sudah dewasa";
  } else {
    // ↑ Kalau kurang dari 17
    return "Belum dewasa";
  }
}

console.log(cekDewasa(20));  // Output: "Sudah dewasa"
console.log(cekDewasa(15));  // Output: "Belum dewasa"
```

### Contoh 3: Daftar Belanja

Prompt: *"Buatkan array berisi daftar belanjaan"*

```javascript
// Array = daftar
let belanjaan = ["Apel", "Jeruk", "Mangga", "Pisang"];
//                ↑ index 0    ↑ 1      ↑ 2       ↑ 3

// Cara akses:
console.log(belanjaan[0]);   // Output: "Apel"
console.log(belanjaan[2]);   // Output: "Mangga"

// Cara lihat semua:
for (let i = 0; i < belanjaan.length; i++) {
  //  ↑ mulai dari 0  ↑ selama i < panjang array  ↑ naikin i
  console.log("Item ke-" + (i+1) + ": " + belanjaan[i]);
}
// Output:
// Item ke-1: Apel
// Item ke-2: Jeruk
// Item ke-3: Mangga
// Item ke-4: Pisang
```

---

## 🧠 3.4 BACA ERROR: JANGAN PANIK!

Error itu **teman, bukan musuh**. Setiap programmer, bahkan yang senior, lihat error setiap hari.

### 3 Jenis Error Paling Umum:

```text
🔴 SYNTAX ERROR: Salah nulis
   Contoh: keLupaan tanda kurung atau titik koma
   
🔴 REFERENCE ERROR: Variable gak dikenal
   Contoh: pake 'nama' padahal belum didefinisikan

🔴 TYPE ERROR: Salah tipe data
   Contoh: ngitung pake teks
```

### Cara Baca Error:

```javascript
// Contoh kode error:
console.log(haloDunia);
//            ↑ variable ini belum pernah didefinisikan!

// Pesan error yang muncul:
// Uncaught ReferenceError: haloDunia is not defined
//    ↑ jenis error            ↑ variable penyebab
// at namafile:baris:kolom
//    ↑ lokasi error

// Artinya: "Variable 'haloDunia' belum pernah dibuat"
// Solusi: Tambahin: let haloDunia = "apa aja";
```

### Langkah Debugging:

```text
1. BACA pesan error-nya (jangan langsung panik)
2. LIHAT baris yang disebut (biasanya ada nomor baris)
3. CEK variable/function yang disebut
4. COBA perbaiki
5. JALANKAN ulang

🚀 TIPS: Copy paste error message ke AI!
   "Saya punya error: [error message]. Ini kode saya: [kode]. 
    Tolong bantu perbaiki."
```

---

## 🧠 3.5 LATIHAN: DARI PROMPT KE KODE

### LATIHAN 1: Baca & Pahami (10 menit)

Baca kode di bawah, lalu jawab pertanyaannya:

```javascript
function hitungLuasPersegi(sisi) {
  let luas = sisi * sisi;
  return luas;
}

let hasil1 = hitungLuasPersegi(5);
let hasil2 = hitungLuasPersegi(10);

console.log(hasil1);
console.log(hasil2);
```

**Pertanyaan:**
1. Apa output dari `console.log(hasil1)`?
   - Jawab dulu, baru cek ke AI
2. Apa output dari `console.log(hasil2)`?
3. Kalau `hitungLuasPersegi(7)`, hasilnya berapa?

<details>
<summary>🔍 Jawaban (klik setelah jawab sendiri)</summary>

1. hasil1 = 25 (5 × 5)
2. hasil2 = 100 (10 × 10)
3. hitungLuasPersegi(7) = 49 (7 × 7)
</details>

---

### LATIHAN 2: Prediksi Output (10 menit)

```javascript
function cekNilai(nilai) {
  if (nilai >= 90) {
    return "A";
  } else if (nilai >= 75) {
    return "B";
  } else if (nilai >= 60) {
    return "C";
  } else {
    return "D";
  }
}

console.log(cekNilai(95));
console.log(cekNilai(80));
console.log(cekNilai(65));
console.log(cekNilai(50));
```

**Tebak output-nya, lalu cek ke AI atau console browser!**

---

### LATIHAN 3: Modifikasi Kode (15 menit)

Minta AI bikin kode ini:

```text
"Buatkan function JavaScript bernama 'sapaPengguna' 
yang menerima parameter 'nama' dan 'waktu' (pagi/siang/malam).
Function mengembalikan: 'Selamat [waktu], [nama]!'
Contoh: sapaPengguna('Budi', 'pagi') → 'Selamat pagi, Budi!'"
```

**Setelah dapat kode dari AI, modifikasi:**
1. Ganti sapaan bahasa Indonesia ke Inggris (Good morning, etc.)
2. Tambah validasi: kalau 'waktu' bukan pagi/siang/malam, return "Halo, [nama]!"
3. Tambah ucapan semangat di akhir

---

### LATIHAN 4: Debugging (10 menit)

Kode di bawah punya ERROR. Coba cari dan perbaiki:

```javascript
function hitungDiskon(harga, persen) {
  let diskon = harga * (persen / 100);
  let hargaAkhir = harga - diskon;
  return hargaAkhir;
}

// Test
console.log(hitungDiskon(100000, 20));  // Harusnya: 80000

// ERROR DI BAWAH INI:
let hasil = hitungDiskon("seratus ribu", 20);
console.log(hasil);
```

**Tugas:**
1. Jalankan kode ini di console browser
2. Apa yang terjadi? Ada error?
3. Perbaiki bagian yang error (ganti input "seratus ribu" dengan angka)
4. Minta AI jelasin kenapa error itu terjadi

---

## 🧠 3.6 RANGKUMAN FASE 3

### Yang Udah Kamu Pelajari:

| Konsep | Intinya |
|--------|---------|
| **Variable** | Kotak nyimpan data: `let x = 5` |
| **Function** | Blok kode dengan input → proses → output |
| **Kondisi** | If-else untuk decision |
| **Event** | "Kalau diklik, lakukan..." |
| **Array** | Daftar item: `[1, 2, 3]` |
| **Error** | Baca pesannya, cari barisnya, perbaiki |

### Checklist:

```
☐ Paham 4 struktur dasar JavaScript
☐ Bisa baca dan pahami function sederhana
☐ Bisa tebak output kode JavaScript
☐ Bisa baca error message tanpa panik
☐ Udah coba LATIHAN 1-4
☐ Bisa modifikasi kode hasil AI
```

### Sebelum Lanjut:

```text
🎯 TARGET: Kamu tidak takut lagi lihat kode JavaScript.
          Kamu bisa baca, pahami, dan modifikasi kode dasar.

Jika masih bingung:
- Fokus di variable dan function (paling sering muncul)
- Coba baca kode hasil AI, tebak outputnya
- Minta AI jelasin setiap baris kode yang dia kasih

Jika sudah paham:
→ Buka fase-04-logika-arsitektur.md
```

---

## 📝 GLOSARIUM FASE 3

| Istilah | Arti |
|---------|------|
| **Variable** | Tempat nyimpen data (let, const) |
| **Function** | Blok kode yang bisa dipanggil ulang |
| **Parameter** | Input yang diterima function |
| **Return** | Output yang dikeluarkan function |
| **Array** | Kumpulan data dalam 1 variable |
| **Index** | Posisi item dalam array (mulai dari 0) |
| **Loop** | Perulangan (for, while) |
| **Event** | Aksi user (klik, hover, ketik) |
| **Error** | Kesalahan dalam kode |
| **Debugging** | Proses mencari dan memperbaiki error |

---

**📂 Lanjut ke: `fase-04-logika-arsitektur.md`**
