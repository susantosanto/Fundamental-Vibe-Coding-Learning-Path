---
name: prompt-engineering-loop
description: Belajar cara prompting efektif dan loop-engineering dengan AI — dari fundamental ke pattern lanjutan
---

# Prompt Engineering & Loop Engineering dengan AI

## 📋 Filosofi
Skill ini mengajarkan **seni berkomunikasi dengan AI** dan **menggunakan loop iteratif** untuk menghasilkan output berkualitas tinggi. Anda akan belajar dari **cara paling dasar memberi instruksi** sampai **pattern kompleks** untuk membangun sistem AI.

## 🗺️ Learning Path

### Fase 1: Prompting Fundamentals
*"Belajar berbicara dengan AI secara efektif"*

#### 1.1 Apa Itu Prompt?
```
🔍 DEFINISI:
Prompt = Instruksi yang Anda berikan ke AI

💡 ANALOGI:
Prompt seperti memberi instruksi ke asisten pribadi:
- "Bantu saya" → ❌ Terlalu umum
- "Tolong buatkan function JavaScript untuk menghitung diskon 10% dari harga Rp100.000" → ✅ Spesifik
```

#### 1.2 Struktur Prompt Dasar
```
FORMAT PROMPT DASAR:

[KONTEKS]   → Latar belakang yang AI perlu tahu
[TUGAS]     → Apa yang harus AI lakukan
[FORMAT]    → Bagaimana output harus disajikan
[CONTOH]    → Contoh yang diinginkan (optional)

CONTOH:
"Konteks: Saya sedang belajar JavaScript, sudah paham variabel.
Tugas: Jelaskan apa itu function dengan analogi sederhana.
Format: Berikan 1 analogi, 1 contoh kode, dan 1 latihan."
```

#### 1.3 Teknik Prompting Dasar
| Teknik | Cara | Contoh |
|--------|------|--------|
| **Be Specific** | Semakin detail, semakin baik | ❌ "Buatkan kode" → ✅ "Buatkan function untuk menghitung rata-rata array angka" |
| **Provide Context** | Beri latar belakang | "Saya pemula, sudah paham loop" |
| **Set Format** | Tentukan format output | "Jawab dalam format: penjelasan, contoh kode, latihan" |
| **Use Examples** | Beri contoh (few-shot) | "Seperti ini contohnya: [contoh]" |
| **Chain of Thought** | Minta AI berpikir step-by-step | "Jelaskan langkah demi langkah" |

**📝 Latihan:** Tulis prompt untuk meminta AI menjelaskan konsep `array.map()` di JavaScript

### Fase 2: Advanced Prompting Patterns
*"Pattern yang menghasilkan output berkualitas tinggi"*

#### 2.1 Persona Pattern
```
"Kamu adalah tutor programming yang sabar dan 
suka menggunakan analogi makanan Indonesia.
Jelaskan konsep OOP kepadaku..."
```

#### 2.2 Chain-of-Thought (CoT)
```
"Jelaskan langkah demi langkah bagaimana 
cara kerja binary search. Untuk setiap langkah,
berikan contoh dengan angka konkret."
```

#### 2.3 Few-Shot Prompting
```
"Berikut contoh format yang saya inginkan:

Topik: Variabel
Penjelasan: Variabel seperti kotak penyimpanan
Contoh: let nama = 'Andi';

Topik: Function
Penjelasan: ...
Contoh: ..."
```

#### 2.4 Iterative Refinement
```
PUTARAN 1: "Buatkan halaman login dengan HTML/CSS"
→ Hasil awal

PUTARAN 2: "Tambah validasi form: email harus valid, 
password minimal 8 karakter"
→ Perbaikan

PUTARAN 3: "Tambah animasi loading saat submit"
→ Final
```

#### 2.5 Structured Output
```
"Beri output dalam format JSON:
{
  "konsep": "string",
  "analogi": "string",
  "contoh_kode": "string",
  "tingkat_kesulitan": "mudah/sedang/sulit"
}"
```

### Fase 3: Loop Engineering Fundamentals
*"Dasar-dasar siklus kerja dengan AI"*

#### 3.1 Apa Itu Loop Engineering?
```
LOOP ENGINEERING = Siklus iteratif:
PLAN → DO → REVIEW → REFINE

Bukan hanya 1 prompt, tapi SERANGKAIAN prompt
yang saling terkait untuk mencapai tujuan kompleks.
```

#### 3.2 The Basic Loop
```
┌─────────────┐
│   PLAN      │  "Saya ingin membuat aplikasi todo"
│   (Tujuan)  │
└──────┬──────┘
       ▼
┌─────────────┐
│   GENERATE  │  AI menghasilkan output
│   (Buat)    │
└──────┬──────┘
       ▼
┌─────────────┐
│   REVIEW    │  "Apakah ini sesuai yang saya mau?"
│   (Periksa) │
└──────┬──────┘
       │
    ┌──┴──┐
    │     │
  YES    NO
    │     │
    ▼     └──→ KEMBALI KE GENERATE
 SELESAI       dengan refined prompt
```

#### 3.3 Design-Implement-Review Loop
```
Ini adalah loop utama untuk engineering:

1. DESIGN → "Desain arsitektur untuk aplikasi chat"
2. IMPLEMENT → "Implementasi komponen User Service"
3. REVIEW → "Review kode, apa yang perlu diperbaiki?"
4. ITERATE → Kembali ke step 2 atau 1
```

### Fase 4: Loop Engineering Patterns
*"Pattern profesional untuk bekerja dengan AI"*

#### 4.1 Top-Down Loop (Architecture First)
```
Langkah 1: "Desain arsitektur high-level"
Langkah 2: "Breakdown komponen pertama"
Langkah 3: "Implementasi komponen"
Langkah 4: "Review dan refine"
Langkah 5: "Lanjut ke komponen berikutnya"
```

#### 4.2 Bottom-Up Loop (Test First)
```
Langkah 1: "Buat test case untuk fungsi ini"
Langkah 2: "Implementasi fungsi sampai test passing"
Langkah 3: "Refactor"
Langkah 4: "Lanjut ke fungsi berikutnya"
```

#### 4.3 Spiral Loop (Progressive Enhancement)
```
PUTARAN 1: Buat versi minimal yang bekerja
PUTARAN 2: Tambah error handling
PUTARAN 3: Tambah validasi
PUTARAN 4: Tambah optimization
PUTARAN 5: Tambah documentation
```

#### 4.4 Debug Loop (Systematic Debugging)
```
LOOP DEBUGGING:

1. "Apa yang terjadi?" → Deskripsi masalah
2. "Apa yang seharusnya terjadi?" → Expected behavior
3. "Apa penyebabnya?" → Hipotesis
4. "Coba solusi ini" → Implementasi
5. "Apakah berhasil?" → Verifikasi
   - YA → Selesai
   - TIDAK → Kembali ke step 3
```

### Fase 5: Workflow Integrasi
*"Menggabungkan semua pattern menjadi workflow utuh"*

#### 5.1 Workflow Harian dengan Loop Engineering
```
PAGI — PLANNING LOOP:
/architecture-planner "rencanakan fitur baru"

SIANG — IMPLEMENTASI LOOP:
/design-architecture-loop "implementasi fitur"

SORE — REVIEW LOOP:
/implement-review-loop "review dan perbaiki"

MALAM — LEARNING LOOP:
/learning-opportunities "apa yang saya pelajari hari ini?"
```

#### 5.2 Workflow Belajar dengan Loop
```
1. EXPLORE: /teach "Saya ingin belajar [topik]"
2. PRACTICE: Coba sendiri tanpa AI
3. STUCK: /gentle-teaching "saya stuck"
4. DEEPEN: /learning-opportunities
5. REVIEW: /code-documentation-code-explain
6. ITERATE: Kembali ke step 1 untuk topik berikutnya
```

#### 5.3 Workflow Debugging dengan Loop
```
1. IDENTIFY: "Apa yang salah?"
2. HYPOTHESIZE: "Mungkin penyebabnya X"
3. TEST: "Coba solusi Y"
4. VERIFY: "Apakah berhasil?"
5. LEARN: "Apa yang saya pelajari?"
6. DOCUMENT: Catat untuk referensi
```

## 🧠 Framework Prompting untuk Berbagai Situasi

### Untuk Belajar Konsep Baru
```
"Saya pemula di [topik]. 
Jelaskan [konsep] dengan:
1. Analogi dunia nyata
2. Contoh kode sederhana
3. Latihan yang bisa saya coba
Gunakan bahasa yang mudah dipahami."
```

### Untuk Debugging
```
"Saya punya kode [tempel kode].
Yang seharusnya terjadi: [harapan].
Yang terjadi: [error/output salah].
Sudah saya coba: [langkah yang sudah dicoba].
Apa langkah selanjutnya?"
```

### Untuk Code Review
```
"Review kode ini:
[tempel kode]

Periksa:
1. Apakah ada bug?
2. Apakah bisa lebih efisien?
3. Apakah best practices terpenuhi?
4. Apakah ada security issue?"
```

### Untuk Refactoring
```
"Tolong refactor kode ini:
[tempel kode]

Tujuan: [misal: lebih readable, lebih modular]
Batasan: [misal: tidak boleh ubah API]
Format output: jelaskan perubahan yang dilakukan"
```

## 🔗 Integrasi dengan Skill Lain

| Situasi | Skill |
|---------|-------|
| Belajar prompting dari nol | `/prompt-engineering-loop` (fase 1-2) |
| Latihan loop engineering | `/prompt-engineering-loop` (fase 3-4) |
| Implementasi dengan loop | `/design-architecture-loop` |
| Review & iterate | `/implement-review-loop` |
| Belajar arsitektur | `/architecture-planner` |
| Praktik debugging | `/code-documentation-code-explain` |

## 💡 Cara Menggunakan

1. Mulai belajar: `/prompt-engineering-loop "Saya ingin belajar prompting dari nol"`
2. Praktik loop: `/prompt-engineering-loop "coba workflow loop untuk [proyek]"`
3. Latihan: `/learning-opportunities` setelah selesai fase
