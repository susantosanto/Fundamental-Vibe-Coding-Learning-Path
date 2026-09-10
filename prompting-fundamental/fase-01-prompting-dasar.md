# 🎯 FASE 1: Prompting Dasar

> **Dari "halo" sampai bisa bikin prompt yang benar**
> Waktu: ~45 menit | Level: 🟢 Pemula Absolute

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu prompt dan kenapa penting
✅ Kenapa AI kadang ngasih jawaban aneh
✅ 3 komponen prompt: Konteks → Tugas → Format
✅ Bedanya prompt bagus dan prompt jelek
✅ Latihan: bikin prompt untuk kebutuhan sehari-hari
```

---

## 🧠 1.1 APA ITU PROMPT?

### Definisi Sederhana

**Prompt = Instruksi yang kamu kasih ke AI**

Kamu ngomong/mengetik sesuatu → AI merespon.

```
KAMU: "Buatkan function untuk menghitung diskon"
   │
   ▼
  AI berpikir... 
   │
   ▼
  AI: "Berikut function untuk menghitung diskon: ..."
```

### Kenapa Ada Istilah "Engineering"?

Karena **cara kamu ngomong ke AI sangat menentukan hasilnya**.

```
❌ Prompt jelek:  "Buatkan kode"  
   → Hasil: Ngaco, gak sesuai

✅ Prompt bagus: "Buatkan function JavaScript untuk menghitung 
   diskon 20% dari harga Rp100.000"
   → Hasil: Tepat, sesuai yang diminta
```

### Analogi: Kamu Punya Asisten Pribadi

Bayangkan kamu punya asisten yang **sangat pintar tapi tidak bisa membaca pikiran**.

```
❌ "Bantu saya"  
   → Asisten bingung: Bantu apa? Gimana caranya?

✅ "Tolong buatkan laporan penjualan bulan ini dalam 
   format Excel, dengan kolom: tanggal, produk, jumlah, total"
   → Asisten tahu persis apa yang harus dilakukan!
```

**AI seperti asisten itu!** Dia butuh instruksi yang jelas.

---

## 🧠 1.2 KENAPA AI KADANG NGACO?

### The Garbage In, Garbage Out Principle

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   PROMPT JELEK  ──→  AI BINGUNG  ──→  HASIL NGACO     │
│                                                         │
│   PROMPT BIASA  ──→  AI TEBAK-TEBAK ──→  HASIL RATA-RATA│
│                                                         │
│   PROMPT BAGUS  ──→  AI PAHAM  ──→  HASIL TEPAT       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Kenapa Ini Terjadi?

AI itu seperti **mesin prediksi super canggih**. Dia menebak kata berikutnya berdasarkan:

1. **Prompt kamu** (paling penting!)
2. Data training yang dia punya
3. Pola yang paling sering muncul

**Kalau prompt kamu ambigu, AI nebak-nebak → hasilnya lotrean.**

### Contoh Nyata:

```text
❌ PROMPT AMBIGU:
"Buatkan aplikasi"

AI bingung:
- Aplikasi apa? Web? Mobile? Desktop?
- Untuk apa? Jualan? Catatan? Game?
- Bahasa apa? JavaScript? Python? Lainnya?

AI terpaksa nebak → hasilnya mungkin gak sesuai
```

```text
✅ PROMPT JELAS:
"Buatkan halaman HTML untuk daftar belanjaan.
Saya bisa menambah dan menghapus item.
Gunakan JavaScript untuk logikanya.
Tampilkan total harga di bagian bawah."

AI paham:
- Ini web app (HTML)
- Fungsinya: tambah & hapus item
- Pakai JavaScript
- Ada fitur total harga

AI langsung bisa kerja → hasil tepat!
```

---

## 🧠 1.3 GOLDEN RULE: UJI PROMPT KAMU

### Aturan Emas dari Claude Docs:

> **"Tunjukkan prompt kamu ke rekan kerja yang tidak tahu konteksnya. Kalau mereka bingung, AI juga akan bingung."**

Ini cara paling sederhana untuk ngetes prompt kamu:

```text
❌ Sebelum dikirim: "Bantu saya dengan data itu"
→ Rekan kerja: "Data apa? Bantu gimana?"
→ AI juga bingung!

✅ Setelah diperbaiki: "Tolong analisis data penjualan 
   bulan Januari 2024. Cari produk terlaris dan 
   tampilkan dalam format tabel."
→ Rekan kerja: "Oh, jelas!"
→ AI langsung paham!
```

### Cara Pakai Golden Rule:

```text
LANGKAH 1: Tulis prompt kamu
LANGKAH 2: Bayangkan kasih ke teman yang gak tahu konteks
LANGKAH 3: Apakah mereka paham tanpa perlu tanya lagi?
LANGKAH 4: Jika YA → prompt siap dikirim
           Jika TIDAK → perbaiki sampai jelas
```

---

## 🧠 1.4 4 KOMPONEN PROMPT + 1 RAHASIA

### Komponen Wajib:

Berdasarkan praktik terbaik dari Claude Docs, prompt yang baik punya **4 komponen**:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. KONTEKS                                             │
│     → Latar belakang yang AI perlu tahu                 │
│     → "Saya pemula...", "Ini untuk project..."          │
│                                                         │
│  2. TUGAS                                               │
│     → Apa yang harus AI lakukan                         │
│     → "Buatkan function...", "Jelaskan konsep..."       │
│                                                         │
│  3. FORMAT                                              │
│     → Bagaimana output harus disajikan                  │
│     → "Berikan dalam format tabel...", "Jawab singkat"  │
│                                                         │
│  4. BATASAN                                             │
│     → Apa yang TIDAK boleh dilakukan                    │
│     → "Jangan pakai framework...", "Maksimal 100 kata"  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ✨ Rahasia Tambahan: Jelaskan "KENAPA"

Ini teknik dari Claude Docs yang powerful: **jelaskan alasan/motivasi di balik instruksi kamu.**

```text
❌ TANPA ALASAN:
"Buat kode yang mudah dibaca."

✅ DENGAN ALASAN:
"Buat kode yang mudah dibaca karena nanti akan 
di-maintain oleh tim yang belum berpengalaman.
Jadi setiap function perlu komentar jelas dan 
nama variable yang deskriptif."

→ AI paham KONTEKS MENGAPA, hasilnya lebih sesuai!
```

### Mengapa Ini Efektif?

AI cukup pintar untuk **men-generalisasi dari penjelasan** kamu. Kalau kamu kasih alasan, AI bisa menyesuaikan output sesuai tujuan yang lebih dalam, bukan hanya instruksi permukaan.

### Contoh Lengkap (4 Komponen + Alasan):

```text
🏗️ KONTEKS:
"Saya sedang belajar JavaScript, sudah paham variable dan function.

📋 TUGAS:
Tolong jelaskan apa itu Array dengan analogi sederhana.

📤 FORMAT:
1. Analogi (maks 3 kalimat)
2. Contoh kode (dengan komentar)
3. 1 latihan kecil untuk saya coba

🚫 BATASAN:
Jangan gunakan istilah teknis yang rumit. 
Gunakan bahasa sehari-hari."

💡 ALASAN:
"Saya baru belajar coding 1 minggu dan mudah 
bingung dengan istilah asing. Mohon jelaskan 
seperti ngajari anak SD."
```

### Template Prompt Universal:

```text
[KONTEKS]
Saya [siapa kamu], sedang [situasi/proyek], sudah paham [pengetahuan].

[TUGAS]
Tolong [apa yang harus AI lakukan] dengan [kriteria spesifik].

[FORMAT]
Berikan dalam bentuk [format output yang diinginkan].

[BATASAN]
Jangan [hal yang dihindari].

[ALASAN - opsional]
Saya butuh ini karena [alasan], jadi mohon [penyesuaian].
```

---

### 🧠 Perbandingan Prompt dengan XML Tags (Cara Claude):

Claude (AI dari Anthropic) dirancang khusus untuk membaca **XML tags**. Ini cara paling efektif untuk bikin prompt yang terstruktur:

```text
<instructions>
  Kamu adalah tutor JavaScript yang ramah untuk pemula.
  Jelaskan konsep Array dengan cara yang sangat sederhana.
</instructions>

<context>
  Saya baru belajar coding 1 minggu. Saya sudah paham 
  variable dan function dasar.
</context>

<examples>
  <example>
    <user>Array itu seperti...?</user>
    <assistant>Array itu seperti rak buku berisi banyak barang...</assistant>
  </example>
</examples>

<output_format>
  1. Satu analogi sederhana
  2. Contoh kode dengan komentar
  3. Satu latihan
</output_format>
```

### Kenapa XML Tags Begitu Efektif?

| Tanpa XML Tags | Dengan XML Tags |
|----------------|-----------------|
| AI harus nebak mana instruksi, mana contoh, mana input | AI langsung tahu: `<instructions>` = perintah, `<examples>` = contoh |
| Kalau prompt panjang, AI mudah bingung bagian mana yang penting | XML tags bikin AI bisa "scan" prompt dengan cepat |
| Susah dipisah antara instruksi dan data | Jelas terpisah: instruksi di `<instructions>`, data di `<input>` |

### Template XML Tags untuk Pemula:

```xml
<instructions>
  [Instruksi utama untuk AI]
</instructions>

<context>
  [Latar belakang yang perlu AI tahu]
</context>

<examples>
  <example>
    [Contoh 1: input → output yang diinginkan]
  </example>
  <example>
    [Contoh 2: input → output yang diinginkan]
  </example>
</examples>

<input>
  [Input/data yang mau diproses]
</input>

<output_format>
  [Format output yang diinginkan]
</output_format>
```

**Latihan Cepat:** Coba prompt ini di Claude:

```xml
<instructions>
  Buatkan puisi pendek tentang coding.
</instructions>

<context>
  Saya sedang merasa frustrasi karena kode error terus.
</context>

<output_format>
  Puisi 4 baris dengan rima a-b-a-b.
  Bersifat menghibur dan memotivasi.
</output_format>
```

---

## 🧠 1.5 BEDANYA PROMPT BAGUS VS JELEK

### Perbandingan Langsung:

| Aspek | ❌ Prompt Jelek | ✅ Prompt Bagus |
|-------|-----------------|-----------------|
| **Spesifik** | "Buatkan website" | "Buatkan halaman profil dengan foto, nama, dan bio singkat" |
| **Konteks** | "Bantu saya" | "Saya pemula web development, baru belajar HTML seminggu" |
| **Format** | (tidak disebut) | "Tolong dalam 3 bagian: penjelasan, contoh, latihan" |
| **Batasan** | (tidak ada) | "Jangan pakai framework, cukup HTML/CSS/JS vanilla" |

### Studi Kasus: Minta Bantuan Debugging

```text
❌ "Kode saya error, tolong bantu"

→ AI: Error apa? Kode mana? Bahasa apa?
→ Terpaksa nebak → saran jadi umum & gak tepat
```

```text
✅ "Saya punya kode JavaScript untuk kalkulator sederhana.
   Error: 'calc is not defined' di baris 15.
   Ini kode saya: [tempel kode]
   Saya sudah coba: refresh browser, cek typo baris 10-14
   Tolong bantu cari masalahnya."

→ AI: Langsung paham masalahnya
→ Bisa analisis kode spesifik
→ Solusi tepat sasaran
```

---

## 🧠 1.6 LATIHAN: BIKIN PROMPT PERTAMAMU

### LATIHAN 1: Prompt untuk Belajar (5 menit)

Buka ChatGPT/Claude/Gemini dan coba prompt ini:

```text
Konteks: Saya pemula absolute yang baru pertama kali belajar coding.
Tugas: Jelaskan apa itu JavaScript dengan analogi yang sangat sederhana.
Format: 
- 1 analogi dari kehidupan sehari-hari
- Maksimal 5 kalimat
- Beri 1 contoh kode paling sederhana
```

**Setelah dapat jawaban, coba tanya balik:**
"Tolong berikan 1 latihan yang bisa saya coba untuk memahami ini."

---

### LATIHAN 2: Prompt untuk Bikin Sesuatu (10 menit)

Sekarang coba prompt yang lebih spesifik:

```text
Konteks: Saya baru belajar HTML dan ingin membuat halaman web pertama.
Tugas: Buatkan halaman HTML sederhana yang berisi:
- Judul "Halo, Dunia!"
- Paragraf perkenalan tentang saya
- Daftar 3 hobi saya
Format: Berikan kode HTML lengkap yang bisa saya copy-paste ke file .html
```

**Setelah dapat kode:**
1. Copy paste ke file `halaman-pertama.html`
2. Buka di browser (double click file)
3. Lihat hasilnya!

---

### LATIHAN 3: Prompt dengan 3 Komponen (10 menit)

Sekarang bikin prompt sendiri dengan format 3 komponen:

```text
Pilih salah satu topik di bawah, lalu buat prompt dengan format:

[KONTEKS]
...
[TUGAS]
...
[FORMAT]
...

TOPIK (pilih satu):
A. Minta AI jelasin cara masak nasi goreng
B. Minta AI buatkan jadwal belajar 1 minggu
C. Minta AI jelasin perbedaan PANAS dan SUHU
```

**Coba prompt kamu ke AI. Apakah hasilnya sesuai?**
- Jika kurang sesuai → perbaiki promptnya
- Jika sudah sesuai → SELAMAT! Kamu sudah bisa prompting!

---

### LATIHAN 4: Identifikasi Prompt (5 menit)

Baca prompt di bawah, tebak mana yang BAGUS dan mana yang JELEK:

```text
PROMPT A:
"Buatkan kode"

PROMPT B:
"Buatkan function JavaScript bernama hitungDiskon 
yang menerima parameter harga (number) dan persenDiskon (number).
Function harus mengembalikan harga setelah dipotong diskon.
Contoh: hitungDiskon(100000, 20) → 80000"

PROMPT C:
"Coba tolong bantu saya buatkan suatu program yang bisa 
mengelola data mungkin untuk catatan keuangan 
sederhana gitu, yang penting bisa jalan aja"
```

**Jawaban:**
- Prompt A: ❌ Terlalu umum, AI bingung
- Prompt B: ✅ Sangat spesifik, ada contoh!
- Prompt C: ❌ Ambigu, tidak jelas formatnya

---

## 🧠 1.7 RANGKUMAN FASE 1

### Yang Udah Kamu Pelajari:

| Konsep | Intinya |
|--------|---------|
| **Prompt** | Instruksi ke AI |
| **Konteks** | Latar belakang yang AI perlu tahu |
| **Tugas** | Apa yang harus AI lakukan |
| **Format** | Bagaimana output disajikan |
| **Spesifik** | Semakin detail, semakin baik hasilnya |

### Checklist:

```
☐ Paham definisi prompt
☐ Paham kenapa prompt jelek bikin hasil ngaco
☐ Hafal 3 komponen prompt (Konteks, Tugas, Format)
☐ Bisa bedain prompt bagus dan jelek
☐ Udah coba LATIHAN 1-4
☐ Udah bikin prompt sendiri dan dapet hasil
```

### Sebelum Lanjut ke Fase 2:

```text
🎯 TARGET: Kamu bisa membuat prompt yang jelas dan terstruktur.

Jika kamu masih bingung:
- Ulangi baca bagian 1.3 (3 komponen prompt)
- Coba lagi LATIHAN 3 dengan topik lain
- Ingat: KONTEKS + TUGAS + FORMAT

Jika kamu sudah paham:
→ Buka fase-02-teknik-prompting.md
```

---

## 📝 GLOSARIUM FASE 1

| Istilah | Arti |
|---------|------|
| **AI/LLM** | Kecerdasan buatan yang bisa memahami dan menghasilkan teks |
| **Prompt** | Teks instruksi yang kamu berikan ke AI |
| **Konteks** | Informasi latar belakang yang membantu AI memahami situasi |
| **Output** | Hasil yang dikeluarkan AI setelah menerima prompt |
| **Ambigu** | Bermakna ganda, tidak jelas, bisa diartikan macam-macam |
| **Debugging** | Proses mencari dan memperbaiki error/kesalahan |

---

**📂 Lanjut ke: `fase-02-teknik-prompting.md`**
