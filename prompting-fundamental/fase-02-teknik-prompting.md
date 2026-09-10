# 🎯 FASE 2: Teknik Prompting

> **Pattern yang bikin AI selalu ngasih hasil berkualitas — berdasarkan praktik terbaik dari Claude Docs**
> Waktu: ~60 menit | Level: 🟢 Pemula

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Persona Pattern: Suruh AI jadi "siapa"
✅ Chain-of-Thought: Minta AI mikir step-by-step
✅ Few-Shot Prompting: Kasih contoh biar AI paham
✅ Self-Correction: Minta AI cek jawabannya sendiri
✅ Prompt Chaining: Pecah tugas kompleks jadi langkah kecil
✅ Structured Output: Minta format tertentu (tabel, JSON, dll)
✅ Latihan: Kombinasi semua teknik
```

---

## 🧠 2.1 PERSONA PATTERN

### Apa Itu?

**Persona = kamu suruh AI jadi "seseorang"** dengan karakter tertentu.

```
┌─────────────────────────────────────────────┐
│  "Kamu adalah [PERSONA] yang [KARAKTER]    │
│                                             │
│  Contoh:                                    │
│  "Kamu adalah guru JavaScript yang sabar    │
│   dan suka pakai analogi makanan"           │
└─────────────────────────────────────────────┘
```

### Kenapa Efektif?

Karena AI punya **data training dari berbagai sumber**. Dengan persona, kamu mengaktifkan "mode" tertentu dari AI.

Ini juga disebut **Role Prompting** di dokumentasi Claude — memberikan peran di system prompt sangat membantu mengarahkan nada dan perilaku AI.

### Contoh Perbandingan:

```text
❌ TANPA PERSONA:
"Jelaskan apa itu Closure di JavaScript"

→ Jawaban: Teknis, kaku, penuh istilah sulit
```

```text
✅ DENGAN PERSONA:
"Kamu adalah tutor programming yang sabar
dan suka menggunakan analogi dari kehidupan
sehari-hari. Jelaskan apa itu Closure di
JavaScript padaku, yang masih pemula."

→ Jawaban: Sederhana, ada analogi, mudah dipahami
```

### Template Persona:

```text
Kamu adalah [peran] yang [karakteristik/kemampuan].

[TUGAS / PERTANYAAN]
[FORMAT / BATASAN]
```

### Contoh Persona Lain:

| Situasi | Persona yang Pas |
|---------|------------------|
| Belajar coding | "Kamu adalah mentor programming yang sabar dan suka kasih analogi" |
| Debugging | "Kamu adalah senior developer dengan 10 tahun pengalaman" |
| Code Review | "Kamu adalah code reviewer strict yang fokus pada best practices" |
| Belajar konsep | "Kamu adalah guru SD yang jago menjelaskan hal rumit dengan cara sederhana" |

**Latihan Cepat:** Buka AI dan coba:

```text
Kamu adalah koki profesional yang hobi coding.
Jelaskan apa itu Array di JavaScript, tapi
gunakan analogi dari dunia memasak.
```

---

## 🧠 2.2 CHAIN-OF-THOUGHT (CoT)

### Apa Itu?

**Chain-of-Thought = minta AI mikir step-by-step**, bukan langsung lompat ke jawaban.

### Kenapa Efektif?

Sama seperti kamu, kalau AI disuruh "mikir bertahap", hasilnya lebih akurat. Ini mengurangi tebak-tebakan.

Di dokumentasi Claude, ini termasuk dalam **Thinking & Reasoning** — Claude secara dinamis bisa memutuskan kapan perlu berpikir lebih dalam. Tapi kamu bisa memandunya dengan instruksi eksplisit.

### Contoh:

```text
❌ TANPA CoT:
"Apakah 7 × 8 + 3 = 59?"

→ AI: "Ya" (langsung jawab, mungkin salah)
```

```text
✅ DENGAN CoT:
"Hitung 7 × 8 + 3, jelaskan setiap langkahnya."

→ AI:
"Langkah 1: 7 × 8 = 56 (perkalian duluan, sesuai aturan matematika)
Langkah 2: 56 + 3 = 59
Langkah 3: Jadi hasilnya adalah 59"
```

### Untuk Coding:

```text
❌ "Buatkan kalkulator"

→ Langsung kasih kode, mungkin ada bug
```

```text
✅ "Buatkan kalkulator sederhana dengan HTML/CSS/JS.
Sebelum menulis kode, jelaskan dulu:
1. Fitur apa saja yang perlu ada
2. Struktur HTML-nya bagaimana
3. Logika JavaScript-nya bagaimana
Setelah itu, baru tulis kodenya."
```

### Template CoT:

```text
[TUGAS]
Sebelum menjawab, jelaskan langkah demi langkah
cara berpikir kamu. Setelah itu, berikan jawaban akhir.
```

### Variasi CoT:

```text
1. "Jelaskan langkah demi langkah..."
2. "Pertama-tama, ... lalu ... setelah itu ... akhirnya..."
3. "Analisis masalah ini dengan urutan: apa inputnya,
   bagaimana prosesnya, apa outputnya"
```

**Latihan Cepat:** Coba bandingkan dua prompt ini:

```text
PROMPT A (tanpa CoT):
"Buatkan function untuk cek bilangan prima"

PROMPT B (dengan CoT):
"Buatkan function untuk cek bilangan prima.
Sebelum ngasih kode, jelaskan dulu langkah-langkah
logika yang diperlukan untuk mengecek bilangan prima."
```

---

## 🧠 2.3 FEW-SHOT PROMPTING

### Apa Itu?

**Few-Shot = kasih 2-5 contoh** ke AI biar dia paham format dan pola yang kamu mau. Dokumentasi Claude bilang: **3–5 contoh adalah sweet spot**.

### Kenapa Efektif?

AI belajar dari contoh. Dengan kasih contoh, kamu **"mengarahkan" AI** ke format dan gaya yang kamu inginkan.

### Tips dari Claude Docs:

```
✅ RELEVAN: Contoh harus mirip dengan tugas asli
✅ BERAGAM: Contoh harus mencakup variasi dan edge cases
✅ TERSTRUKTUR: Bungkus contoh dalam tag <example>
```

### Contoh:

```text
❌ TANPA CONTOH:
"Buatkan beberapa soal matematika"

→ Formatnya acak, bisa macam-macam
```

```text
✅ DENGAN CONTOH:
"Buatkan 3 soal matematika dengan format seperti ini:

Contoh 1:
Soal: Sebuah toko menjual apel Rp5.000 per buah.
Budi membeli 3 apel dan membayar dengan uang Rp20.000.
Berapa kembaliannya?
Jawaban: Rp5.000

Sekarang buat soal dengan format yang sama (soal & jawaban)."
```

### Template Few-Shot (dengan XML tags, cara Claude):

```xml
<task>
  Buatkan function JavaScript berdasarkan contoh di bawah.
</task>

<examples>
  <example>
    <input>Function: tambah(a, b) — menjumlahkan dua angka</input>
    <output>
      function tambah(a, b) {
        return a + b;
      }
    </output>
  </example>
  <example>
    <input>Function: kali(a, b) — mengalikan dua angka</input>
    <output>
      function kali(a, b) {
        return a * b;
      }
    </output>
  </example>
</examples>

<task_input>
  Function: hitungLuasPersegiPanjang(panjang, lebar)
  Tugas: menghitung luas persegi panjang
</task_input>
```

**Latihan Cepat:** Coba di AI:

```text
Buatkan 3 teka-teki logika dengan format:

Contoh:
Teka-teki: Ada 5 burung di pohon. Aku tembak 1.
Berapa sisa burung?
Jawaban: 0 (yang lain terbang karena kaget)

Sekarang buat 3 teka-teki dengan format yang sama.
```

---

## 🧠 2.4 SELF-CORRECTION: MINTA AI CEK DIRI SENDIRI

### Apa Itu?

**Self-Correction = minta AI memverifikasi jawabannya sendiri** sebelum memberikan hasil akhir.

Ini adalah teknik dari Claude Docs yang sangat efektif untuk **menangkap error sebelum hasil dikirim**.

### Kenapa Efektif?

AI kadang bikin kesalahan, terutama di kode dan matematika. Tapi kalau diminta "cek lagi", AI bisa menemukan dan memperbaiki errornya sendiri.

### Contoh:

```text
❌ TANPA SELF-CORRECTION:
"Buatkan function untuk sorting array"

→ AI kasih jawaban, mungkin ada bug yang tidak terdeteksi
```

```text
✅ DENGAN SELF-CORRECTION:
"Buatkan function untuk sorting array.
Setelah menulis kode, periksa kembali:
1. Apakah ada bug atau edge case?
2. Apakah function menangani array kosong?
3. Apakah function menangani array dengan 1 element?
Perbaiki jika ada masalah."

→ AI: Nulis kode → Cek sendiri → Perbaiki bug → Kirim hasil fix
```

### Template Self-Correction:

```text
[TUGAS]

Setelah selesai, periksa kembali jawaban kamu:
[DAFTAR CEK]
1. ...
2. ...
3. ...

Jika ada masalah, perbaiki sebelum memberikan jawaban akhir.
```

### Contoh untuk Coding:

```text
"Buatkan function untuk menghitung diskon.

Setelah menulis kode, verifikasi:
1. Apakah function handle diskon 0% dengan benar?
2. Apakah function handle diskon 100% (gratis)?
3. Apakah function handle input negatif?
4. Coba test dengan: hitungDiskon(100000, 20) → harusnya 80000

Perbaiki jika ada yang salah."
```

### Self-Correction untuk Belajar:

```text
"Jelaskan konsep Promise di JavaScript.

Setelah menjelaskan, cek pemahaman kamu:
1. Apakah penjelasan sudah benar secara teknis?
2. Apakah ada istilah yang terlalu rumit untuk pemula?
3. Apakah contoh kode sudah benar dan bisa dijalankan?

Koreksi jika ada kesalahan."
```

**Latihan Cepat:** Coba prompt ini:

```text
Buatkan soal matematika: 25 + 17 × 3 = ?

Setelah menjawab, periksa kembali menggunakan
aturan prioritas operasi (dahulukan × sebelum +).
Perbaiki jika jawaban awal salah.
```

---

## 🧠 2.5 PROMPT CHAINING: PECAH TUGAS BESAR

### Apa Itu?

**Prompt Chaining = memecah tugas kompleks menjadi beberapa langkah kecil** yang dikerjakan bergantian.

Dari Claude Docs: untuk tugas kompleks, lebih baik pecah menjadi subtasks yang lebih kecil. Setiap subtask bisa di-review dulu sebelum lanjut.

### Kenapa Efektif?

```
❌ SATU PROMPT RAKSASA:
"Buatkan aplikasi manajemen keuangan lengkap dengan
10 fitur, grafik, export, dan database"

→ AI overwhelmed → hasil berantakan
```

```
✅ PROMPT BERTAHAP (CHAINING):

LANGKAH 1: "Desain struktur data untuk aplikasi keuangan"
           → Review → OK

LANGKAH 2: "Buatkan HTML structure berdasarkan desain data"
           → Review → OK

LANGKAH 3: "Tambahkan CSS styling"
           → Review → OK

LANGKAH 4: "Buatkan JavaScript logic untuk CRUD"
           → Review → OK

HASIL: Aplikasi rapi, terkontrol, mudah diperbaiki!
```

### Chaining Pattern: Generate → Review → Refine

Ini adalah pola paling umum dari Claude Docs:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   PUTARAN 1: GENERATE                                   │
│   "Buat draft halaman login"                            │
│                                                         │
│   PUTARAN 2: REVIEW                                     │
│   "Review halaman ini. Apakah ada security issue?"      │
│                                                         │
│   PUTARAN 3: REFINE                                     │
│   "Tambah validasi sesuai review"                       │
│                                                         │
│   PUTARAN 4: FINAL                                      │
│   "Tambah animasi, polish UI"                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Contoh Prompt Chaining:

```text
LANGKAH 1 (Arsitektur):
"Saya ingin membuat aplikasi catatan.
Bantu desain:
1. Apa saja data yang perlu disimpan?
2. Fitur apa yang diperlukan?
3. Bagaimana struktur file-nya?"

→ Dapat desain

LANGKAH 2 (Implementasi):
"Sekarang berdasarkan desain di atas,
buatkan HTML structure untuk halaman utama."

→ Dapat HTML

LANGKAH 3 (Styling):
"Bagus! Sekarang tambahkan CSS:
- Background putih bersih
- Warna aksen biru (#4A90D9)
- Card dengan shadow"

→ Dapat CSS

LANGKAH 4 (Logika):
"Sekarang tambahkan JavaScript:
- tambahCatatan(teks)
- hapusCatatan(id)
- simpan ke localStorage"

→ Dapat JS + Review tiap langkah
```

### Kapan Pakai Chaining?

| Situasi | Pakai Chaining? |
|---------|-----------------|
| Minta bikin 1 function | ❌ Cukup 1 prompt |
| Minta bikin halaman HTML sederhana | ❌ Cukup 1 prompt |
| Minta bikin aplikasi dengan 5+ fitur | ✅ Chaining |
| Minta bikin desain arsitektur dulu | ✅ Chaining |
| Debugging kode kompleks | ✅ Chaining |

**Latihan Cepat:** Coba workflow ini:

```text
LANGKAH 1: "Buatkan desain struktur data untuk aplikasi
            daftar belanja (item, harga, kategori)"

LANGKAH 2: "Berdasarkan desain di atas, buatkan HTML-nya"

LANGKAH 3: "Tambahkan CSS dan JavaScript"
```

---

## 🧠 2.6 STRUCTURED OUTPUT

### Apa Itu?

**Structured Output = minta AI ngasih hasil dalam format tertentu** yang udah ditentukan.

### Kenapa Efektif?

Biar hasil dari AI **bisa langsung dipake**, tanpa perlu di-parse manual.

### Format yang Paling Berguna:

```text
📋 TABEL:
"Berikan dalam format tabel:
| No | Nama | Fungsi | Contoh |
|----|------|--------|--------|"

📦 JSON:
"Berikan dalam format JSON:
{
  "nama": "...",
  "fungsi": "...",
  "contoh": "..."
}"

📝 LIST:
"Berikan dalam bentuk list:
1. Item pertama
2. Item kedua
   - Sub-item"

🎯 BULLET POINTS:
"Jelaskan dalam 3 poin singkat:
• Poin 1
• Poin 2
• Poin 3"
```

### Contoh Structured Output:

```text
"Jelaskan 3 method Array JavaScript dengan format JSON:

[
  {
    "nama": "...",
    "fungsi": "...",
    "contoh": "...",
    "return_value": "..."
  },
  ...
]"
```

### Kenapa JSON Penting?

Karena JSON bisa langsung dipake di kode JavaScript! Ini jembatan antara AI dan aplikasi kamu.

### Template:

```text
[TUGAS]

Berikan output dalam format berikut:
[FORMAT YANG DIINGINKAN]
[CONTOH FORMAT]

Isi dengan data yang sesuai.
```

---

## 🧠 2.7 KOMBINASI SEMUA TEKNIK

Ini dia rahasianya: **gabungin semua teknik di atas** untuk hasil maksimal!

### Template Lengkap (dengan XML tags):

```xml
<persona>
  Kamu adalah [PERSONA] yang [KARAKTER].
</persona>

<instructions>
  [Tugas utama yang harus dikerjakan]
</instructions>

<reasoning>
  Sebelum menjawab, jelaskan langkah demi langkah
  cara berpikir kamu.
</reasoning>

<examples>
  <example>
    <input>[Contoh input]</input>
    <output>[Contoh output yang diinginkan]</output>
  </example>
</examples>

<input>
  [Data/input yang mau diproses]
</input>

<output_format>
  [Format output yang diinginkan: JSON/tabel/list]
</output_format>

<verification>
  Setelah selesai, periksa kembali jawaban kamu.
  Pastikan tidak ada error atau kesalahan.
</verification>
```

### Contoh Kombinasi Lengkap:

```xml
<persona>
  Kamu adalah senior JavaScript developer
  yang jago menjelaskan dengan analogi sederhana.
</persona>

<instructions>
  Buatkan 3 function untuk mengelola data siswa:
  tambahSiswa, hapusSiswa, cariSiswa.
</instructions>

<reasoning>
  Sebelum menulis kode, jelaskan dulu:
  1. Struktur data siswa yang diperlukan
  2. Parameter setiap function
  3. Validasi apa yang diperlukan
</reasoning>

<examples>
  <example>
    <input>
      Function: tambah(nama, umur) — menambah data
    </input>
    <output>
      function tambah(nama, umur) {
        data.push({ nama, umur });
        return data;
      }
    </output>
  </example>
</examples>

<output_format>
  Berikan dalam format tabel:
  | Nama Function | Parameter | Return | Deskripsi |
  |---------------|-----------|--------|-----------|
  | ...           | ...       | ...    | ...       |

  Setelah tabel, berikut kode lengkapnya.
</output_format>

<verification>
  Setelah selesai, periksa kembali:
  1. Apakah function handle data kosong?
  2. Apakah tidak ada bug?
  Perbaiki jika ada masalah.
</verification>
```

---

## 🧠 2.8 LATIHAN FASE 2

### LATIHAN 1: Persona + CoT (10 menit)

Coba prompt ini ke AI:

```text
Kamu adalah arsitek aplikasi web yang berpengalaman.
Jelaskan langkah demi langkah bagaimana cara merancang
aplikasi catatan sederhana sebelum menulis kode.

Fokus pada:
1. Struktur data yang diperlukan
2. Fitur apa saja yang harus ada
3. Urutan pembuatan (mana yang dibuat dulu)
```

### LATIHAN 2: Few-Shot + Self-Correction (10 menit)

Coba prompt ini:

```text
Buatkan function JavaScript dengan format seperti ini:

Contoh 1:
Function: tambah(a, b) — menjumlahkan dua angka
function tambah(a, b) { return a + b; }

Contoh 2:
Function: kali(a, b) — mengalikan dua angka
function kali(a, b) { return a * b; }

Sekarang buat: hitungDiskon(harga, persenDiskon)

Setelah selesai, periksa kembali:
1. Test dengan harga 100000 dan diskon 20 → harus 80000
2. Apakah function handle diskon 0%?
Perbaiki jika ada yang salah.
```

### LATIHAN 3: Prompt Chaining (15 menit)

Lakukan workflow ini langkah demi langkah:

```text
LANGKAH 1:
"Buatkan struktur HTML untuk halaman profil pengguna:
- Foto profil (placeholder)
- Nama pengguna
- Bio singkat
- 3 tombol: Ikuti, Pesan, Bagikan"

→ Dapat HTML

LANGKAH 2:
"Tambahkan CSS:
- Layout modern dengan card
- Foto profil bulat
- Tombol dengan warna gradasi
- Hover effect di tombol"

→ Dapat CSS

LANGKAH 3:
"Tambahkan JavaScript:
- Klik 'Ikuti' → teks berubah jadi 'Mengikuti'
- Klik 'Bagikan' → copy link ke clipboard
- Animasi smooth untuk semua interaksi"

→ Dapat JS
```

### LATIHAN 4: Semua Teknik (15 menit)

Gabungin SEMUA teknik dalam 1 prompt:

```xml
<persona>
  Kamu adalah developer JavaScript berpengalaman.
</persona>

<instructions>
  Buatkan aplikasi counter sederhana dengan HTML/CSS/JS.
  Fitur: tombol +, tombol -, reset, tampilkan angka.
</instructions>

<reasoning>
  Jelaskan dulu struktur yang akan dibuat.
</reasoning>

<examples>
  <example>
    <input>Counter mulai dari 0, klik + jadi 1</input>
    <output>Angka berubah di layar</output>
  </example>
</examples>

<output_format>
  Kode HTML lengkap dalam 1 file.
  Setiap function punya 1 tugas.
</output_format>

<verification>
  Setelah selesai, cek: tombol +, -, reset semua berfungsi.
</verification>
```

---

## 🧠 2.9 RANGKUMAN FASE 2

### 7 Teknik Prompting:

| Teknik | Cara | Kapan Dipakai |
|--------|------|---------------|
| **Persona** | Suruh AI jadi karakter tertentu | Mau jawaban dengan gaya/nada tertentu |
| **Chain-of-Thought** | Minta langkah-langkah | Butuh logika yang akurat |
| **Few-Shot** | Kasih 3-5 contoh | Mau format yang konsisten |
| **Self-Correction** | Minta AI cek sendiri | Kode/matematika yang butuh ketelitian |
| **Prompt Chaining** | Pecah jadi langkah kecil | Tugas kompleks dengan banyak fitur |
| **Iterative Refinement** | Perbaiki bertahap | Belum tahu persis apa yang mau |
| **Structured Output** | Minta format tertentu | Hasilnya mau dipakai langsung |

### Checklist:

```
☐ Paham dan bisa pakai Persona Pattern
☐ Paham dan bisa pakai Chain-of-Thought
☐ Paham dan bisa pakai Few-Shot Prompting
☐ Paham dan bisa pakai Self-Correction
☐ Paham dan bisa pakai Prompt Chaining
☐ Paham dan bisa pakai Iterative Refinement
☐ Paham dan bisa pakai Structured Output
☐ Bisa menggunakan XML tags untuk struktur prompt
☐ Bisa mengkombinasikan semua teknik
☐ Udah coba LATIHAN 1-4
```

### Sebelum Lanjut:

```text
🎯 TARGET: Kamu bisa dapat kode berkualitas dari AI dengan
          menggabungkan teknik-teknik prompting — berdasarkan
          praktik terbaik dari dokumentasi Claude resmi.

Jika masih bingung:
- Fokus kuasai Persona + CoT + Self-Correction dulu
- Praktik tiap teknik satu per satu
- XML tags adalah kunci untuk prompt yang rapi

Jika sudah paham:
→ Buka fase-03-dari-prompt-ke-kode.md
```

---

**📂 Lanjut ke: `fase-03-dari-prompt-ke-kode.md`**

---

> 💡 **Sumber:** Modul ini mengacu pada praktik terbaik dari dokumentasi resmi Claude Prompt Engineering (https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) yang telah disederhanakan untuk pemula.
