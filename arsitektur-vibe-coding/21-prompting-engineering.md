# 🤖 Modul 21: Prompting Engineering — Seni Berbicara dengan AI

> **Semua modul sebelumnya penuh prompt — sekarang Anda belajar TEORI di baliknya. Prompting = skill inti vibe coding.**
> Waktu: ~4-5 jam (bisa dipecah) | Level: 🟢🟡 | Prasyarat: baca `prompting-fundamental/fase-01` & `fase-02` (atau mulai dari sini dari nol)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu prompt & kenapa AI "kadang ngaco"
✅ 4 komponen prompt: Konteks → Tugas → Format → Batasan
✅ Teknik: Persona, Chain-of-Thought, Few-Shot, Self-Correction
✅ Prompt Chaining: pecah tugas besar jadi langkah kecil
✅ Structured Output & XML tags
✅ Semua teknik digabung untuk vibe coding
✅ Bedanya prompt di chat web vs CLI agent
```

> 🎯 **Dari mana materi ini?**
> Diambil & disederhanakan dari folder `prompting-fundamental/`
> (fase 1-6), yang bersumber dari praktik terbaik dokumentasi
> resmi **Claude Prompt Engineering** (Anthropic) — lalu disesuaikan
> dengan gaya belajar di folder ini.
> Untuk pendalaman, buka `prompting-fundamental/`!

---

## 🧠 21.1 APA ITU PROMPT & KENAPA PENTING?

### Definisi Sederhana

```text
PROMPT = instruksi yang Anda berikan ke AI.

Kenapa ada istilah "ENGINEERING"?
→ Karena CARA Anda berbicara SANGAT menentukan hasilnya.
```

### Analogi: Asisten yang Pintar tapi Tidak Bisa Baca Pikiran

```text
❌ "Bantu saya"      → Asisten bingung: bantu apa? bagaimana?
✅ "Tolong buatkan laporan penjualan bulan ini dalam format
   Excel, kolom: tanggal, produk, jumlah, total"
   → Asisten tahu persis!

AI = asisten itu. Butuh instruksi JELAS.
```

### Garbage In, Garbage Out

```text
PROMPT JELEK  ──→  AI BINGUNG  ──→  HASIL NGACO
PROMPT BIASA  ──→  AI TEBAK    ──→  HASIL RATA-RATA
PROMPT BAGUS  ──→  AI PAHAM    ──→  HASIL TEPAT
```

### Golden Rule (dari Claude Docs)

> **"Tunjukkan prompt Anda ke rekan kerja yang tidak tahu
> konteksnya. Kalau mereka bingung, AI juga akan bingung."**

```text
LANGKAH 1: Tulis prompt
LANGKAH 2: Bayangkan berikan ke teman yang tidak tahu konteks
LANGKAH 3: Apakah mereka paham tanpa bertanya lagi?
           YA → kirim. TIDAK → perbaiki sampai jelas.
```

---

## 🧠 21.2 4 KOMPONEN PROMPT + 1 RAHASIA

### Komponen Wajib

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. KONTEKS                                             │
│     → Latar belakang yang AI perlu tahu                 │
│     → "Saya pemula...", "Ini untuk proyek sekolah..."   │
│                                                         │
│  2. TUGAS                                               │
│     → Apa yang harus AI lakukan                         │
│     → "Buatkan function...", "Jelaskan konsep..."       │
│                                                         │
│  3. FORMAT                                              │
│     → Bagaimana output disajikan                        │
│     → "Tabel", "JSON", "Langkah demi langkah"           │
│                                                         │
│  4. BATASAN                                             │
│     → Apa yang TIDAK boleh dilakukan                    │
│     → "Jangan pakai framework", "Maks 100 kata"         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ✨ Rahasia Tambahan: Jelaskan "KENAPA"

```text
❌ "Buat kode yang mudah dibaca."

✅ "Buat kode yang mudah dibaca karena akan di-maintain tim
    pemula. Jadi tiap function butuh komentar & nama jelas."

→ AI paham TUJUAN di balik instruksi → hasil lebih sesuai!
```

### Template Universal

```text
[KONTEKS]
Saya [siapa], sedang [situasi], sudah paham [pengetahuan].

[TUGAS]
Tolong [apa yang harus dilakukan] dengan [kriteria].

[FORMAT]
Berikan dalam bentuk [output yang diinginkan].

[BATASAN]
Jangan [hal yang dihindari].

[ALASAN — opsional]
Saya butuh ini karena [alasan], jadi mohon [penyesuaian].
```

---

## 🧠 21.3 TEKNIK 1: PERSONA PATTERN

### Apa Itu?

```text
PERSONA = suruh AI berperan sebagai "seseorang" tertentu.

"Kamu adalah [PERAN] yang [KARAKTER]."
```

### Kenapa Efektif?

AI punya data training dari banyak sumber. Persona mengaktifkan
"mode" tertentu → nada & kualitas jawaban ikut berubah.

### Contoh

```text
❌ TANPA PERSONA:
"Jelaskan apa itu closure di JavaScript"
→ Jawaban: teknis, kaku, penuh istilah sulit

✅ DENGAN PERSONA:
"Kamu adalah tutor programming yang sabar dan suka analogi
dari kehidupan sehari-hari. Jelaskan apa itu closure di
JavaScript untuk saya yang masih pemula."
→ Jawaban: sederhana, ada analogi, mudah dipahami
```

### Pilih Persona yang Tepat

| Situasi | Persona |
|---------|---------|
| Belajar coding | Mentor yang sabar, suka analogi |
| Debugging | Senior developer 10 tahun pengalaman |
| Code review | Reviewer strict fokus best practices |
| Arsitektur | Arsitek aplikasi web senior |

> 💡 **Di semua modul folder ini, prompt sudah pakai persona!**
> Sekarang Anda tahu kenapa.

---

## 🧠 21.4 TEKNIK 2: CHAIN-OF-THOUGHT (CoT)

### Apa Itu?

```text
CoT = minta AI BERPIKIR LANGKAH DEMI LANGKAH,
bukan langsung lompat ke jawaban.
```

### Kenapa Efektif?

```text
Seperti hitung matematika: kalau disuruh "mikir bertahap",
lebih akurat daripada langsung tebak jawaban.
```

### Contoh

```text
❌ "Apakah 7 × 8 + 3 = 59?"  → "Ya" (bisa salah!)

✅ "Hitung 7 × 8 + 3, jelaskan setiap langkah."
→ Langkah 1: 7 × 8 = 56 (perkalian dulu)
  Langkah 2: 56 + 3 = 59
  Langkah 3: Jadi 59
```

### Untuk Coding

```text
✅ "Buatkan kalkulator. SEBELUM menulis kode, jelaskan:
   1. Fitur apa saja yang perlu ada
   2. Struktur HTML-nya bagaimana
   3. Logika JavaScript-nya bagaimana
   Setelah itu baru tulis kodenya."
```

> 🎯 **Ini pola yang SAMA dengan "denah dulu, kode belakangan"
> di Modul 1!** CoT = meminta AI melakukan hal yang sama.

### Template CoT

```text
[TUGAS]
Sebelum menjawab, jelaskan langkah demi langkah cara berpikirmu.
Setelah itu, berikan jawaban akhir.
```

---

## 🧠 21.5 TEKNIK 3: FEW-SHOT PROMPTING

### Apa Itu?

```text
FEW-SHOT = berikan 3-5 CONTOH ke AI agar paham pola & format
yang Anda inginkan. (Dokumentasi Claude: 3-5 contoh = sweet spot)
```

### Kenapa Efektif?

AI belajar dari contoh. Dengan contoh, Anda "mengarahkan" AI
ke format dan gaya yang diinginkan.

### Contoh

```text
❌ "Buatkan beberapa soal matematika"  → format acak

✅ "Buatkan 3 soal matematika dengan format seperti ini:

Contoh 1:
Soal: Toko menjual apel Rp5.000/buah. Budi membeli 3 apel
      dan membayar Rp20.000. Berapa kembaliannya?
Jawaban: Rp5.000

Sekarang buat soal dengan format yang sama (soal & jawaban)."
```

### Tips dari Claude Docs

```text
✅ RELEVAN: contoh harus mirip dengan tugas asli
✅ BERAGAM: contoh mencakup variasi & kasus tepi (edge case)
✅ TERSTRUKTUR: bungkus contoh dalam tag <example>
```

---

## 🧠 21.6 TEKNIK 4: SELF-CORRECTION

### Apa Itu?

```text
SELF-CORRECTION = minta AI MEMERIKSA jawabannya sendiri
sebelum mengirim hasil akhir. (Teknik dari Claude Docs)
```

### Kenapa Efektif?

AI kadang salah, terutama di kode & matematika. Kalau diminta
"cek lagi", AI bisa menemukan & memperbaiki errornya sendiri.

### Contoh

```text
"Buatkan function menghitung diskon.

Setelah menulis kode, verifikasi:
1. Handle diskon 0% dengan benar?
2. Handle diskon 100% (gratis)?
3. Handle input negatif?
4. Test: hitungDiskon(100000, 20) → harus 80000

Perbaiki jika ada yang salah."
```

### Template

```text
[TUGAS]

Setelah selesai, periksa kembali jawaban Anda:
1. ...
2. ...

Jika ada masalah, perbaiki sebelum memberikan jawaban akhir.
```

---

## 🧠 21.7 TEKNIK 5: PROMPT CHAINING

### Apa Itu?

```text
CHAINING = memecah tugas kompleks menjadi beberapa langkah
kecil yang dikerjakan bergantian. (Dari Claude Docs:
untuk tugas kompleks, pecah jadi subtasks, review tiap langkah.)
```

### Kenapa Efektif?

```text
❌ SATU PROMPT RAKSASA:
"Buatkan aplikasi manajemen keuangan lengkap dengan 10 fitur,
grafik, export, dan database"
→ AI overwhelmed → hasil berantakan

✅ PROMPT BERTAHAP:
LANGKAH 1: "Desain struktur data untuk aplikasi keuangan" → OK
LANGKAH 2: "Buatkan HTML structure berdasarkan desain" → OK
LANGKAH 3: "Tambahkan CSS styling" → OK
LANGKAH 4: "Tambahkan JavaScript logic untuk CRUD" → OK
→ Aplikasi rapi, terkontrol!
```

### Pola: Generate → Review → Refine

```text
PUTARAN 1: GENERATE  "Buat draft halaman login"
PUTARAN 2: REVIEW    "Review. Ada security issue?"
PUTARAN 3: REFINE    "Tambahkan validasi sesuai review"
PUTARAN 4: FINAL     "Tambahkan polish UI"
```

> 🎯 **Ini = loop engineering dalam skala prompt!** Fase-fase
> di Modul 19 (brainstorming → ... → testing) adalah chaining
> tingkat proyek.

### Kapan Pakai Chaining?

| Situasi | Chaining? |
|---------|-----------|
| Buat 1 function | ❌ Cukup 1 prompt |
| Halaman HTML sederhana | ❌ Cukup 1 prompt |
| Aplikasi 5+ fitur | ✅ Chaining |
| Desain arsitektur dulu | ✅ Chaining |
| Debug kode kompleks | ✅ Chaining |

---

## 🧠 21.8 TEKNIK 6: STRUCTURED OUTPUT & XML TAGS

### Structured Output

```text
Structured Output = minta AI memberi hasil dalam FORMAT tertentu
yang bisa langsung dipakai.

📋 TABEL: "Berikan dalam format tabel: | No | Nama | Fungsi |"
📦 JSON:  "Berikan dalam format JSON: { \"nama\": \"...\" }"
📝 LIST:  "Berikan dalam bentuk list bernomor"
```

### XML Tags (cara Claude)

Claude dirancang untuk membaca **XML tags** — cara paling efektif
untuk prompt terstruktur:

```xml
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
    <input>Array itu seperti...?</input>
    <output>Array itu seperti rak buku berisi banyak barang...</output>
  </example>
</examples>

<input>
  Jelaskan array untuk pemula.
</input>

<output_format>
  1. Satu analogi sederhana
  2. Contoh kode dengan komentar
  3. Satu latihan
</output_format>
```

### Kenapa XML Tags Efektif?

```text
TANPA TAGS:                  DENGAN TAGS:
AI menebak mana instruksi,   AI langsung tahu:
mana contoh, mana input      <instructions> = perintah
                            <examples> = contoh
                            <input> = data
```

> 💡 **Tips:** untuk prompt panjang, XML tags membantu AI
> "memindai" prompt dengan cepat dan tidak bingung.

---

## 🧠 21.9 BEDANYA PROMPT DI CHAT WEB vs CLI AGENT

Ini penting untuk semua modul folder ini:

| Chat web (Claude.ai/ChatGPT) | CLI agent (Claude Code/OpenCode) |
|------------------------------|----------------------------------|
| Semua konteks diketik dalam 1 pesan | Agent bisa MEMBACA file di folder proyek |
| Hasil disalin manual ke file | Agent menulis LANGSUNG ke file |
| Harus repost kode tiap iterasi | Agent mengingat konteks dalam sesi |

### Pola Prompt CLI yang Ampuh

```text
[Beri peran]       → "Kamu adalah arsitek Next.js senior..."
[Berikan konteks]  → "Proyek ada di folder ini. Baca README.md..."
[Minta rencana]    → "Jangan langsung kode. Jelaskan rencanamu."
[Beri batasan]     → "Gunakan App Router, jangan Pages Router."
[Minta konfirmasi] → "Setujui rencana saya sebelum mulai."
```

> 🎯 **Ingat:** agent CLI bisa membaca file Anda — manfaatkan!
> "Baca file app/page.tsx lalu jelaskan strukturnya" jauh lebih
> efektif daripada menempel semua kode.

---

## 🧠 21.10 GABUNGKAN SEMUA TEKNIK (Template Master)

### Template Lengkap dengan XML

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
  [Format output: JSON/tabel/list]
</output_format>

<verification>
  Setelah selesai, periksa kembali jawaban kamu.
  Pastikan tidak ada error atau kesalahan.
</verification>
```

### Contoh Lengkap (Vibe Coding)

```xml
<persona>
  Kamu adalah arsitek Next.js senior yang jago menjelaskan
  dengan analogi sederhana untuk pemula.
</persona>

<instructions>
  Buatkan API CRUD untuk entitas "buku" di proyek ini.
</instructions>

<reasoning>
  Sebelum menulis kode, jelaskan dulu:
  1. Struktur data buku yang diperlukan
  2. Endpoint apa saja (method + URL + status code)
  3. Validasi apa yang diperlukan
</reasoning>

<examples>
  <example>
    <input>GET /api/buku → daftar semua buku</input>
    <output>200 + { sukses: true, data: [...] }</output>
  </example>
</examples>

<input>
  Proyek: [jalur folder proyek]. Baca struktur yang sudah ada.
</input>

<output_format>
  Kode untuk app/api/buku/route.ts, dengan komentar belajar.
</output_format>

<verification>
  Setelah selesai, periksa: validasi field wajib? status code
  benar? Perbaiki jika ada masalah.
</verification>
```

---

## 🤖 21.11 LATIHAN (dari prompting-fundamental, disesuaikan)

### Latihan 1: Persona + CoT (15 menit)

```text
Kamu adalah arsitek aplikasi web berpengalaman.
Jelaskan langkah demi langkah cara merancang aplikasi
catatan sederhana SEBELUM menulis kode.

Fokus pada:
1. Struktur data yang diperlukan
2. Fitur yang harus ada
3. Urutan pembuatan (mana dulu)
```

### Latihan 2: Few-Shot + Self-Correction (20 menit)

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
1. Test: harga 100000, diskon 20 → harus 80000
2. Handle diskon 0% dengan benar?
Perbaiki jika ada yang salah.
```

### Latihan 3: Chaining (20 menit)

```text
LANGKAH 1:
"Buatkan struktur HTML halaman profil: foto, nama, bio, 3 tombol"
→ Dapat HTML

LANGKAH 2:
"Tambahkan CSS: layout card modern, foto bulat, hover effect"
→ Dapat CSS

LANGKAH 3:
"Tambahkan JavaScript: klik 'Ikuti' → teks jadi 'Mengikuti'"
→ Dapat JS

(Catatan: ini pola yang sama dengan membangun aplikasi di
Modul 5-6 prompting-fundamental / Modul 8 arsitektur!)
```

### Latihan 4: XML Master (25 menit)

```text
Gunakan template XML di bagian 21.10 untuk membuat:

"Buatkan form login sederhana di proyek Next.js saya"

Sertakan: persona, reasoning, contoh, output_format,
verification. Tempel prompt-nya di CLI agent Anda.
```

### Latihan 5: Debugging dengan Prompt Bagus (15 menit)

```text
❌ Buruk: "Kode saya error, tolong bantu"

✅ Bagus:
"Saya punya kode [nama file] untuk [fitur].
Error: [tempel pesan error lengkap] di baris [n].
Ini kode saya: [tempel kode].
Sudah dicoba: [langkah yang sudah dicoba].
Tolong cari masalahnya & jelaskan penyebabnya dengan
bahasa sederhana."
```

---

## 🧠 21.12 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Teknik | Cara | Kapan |
|--------|------|-------|
| **4 komponen** | Konteks, Tugas, Format, Batasan | SEMUA prompt |
| **Persona** | Suruh AI jadi karakter | Mau gaya/nada tertentu |
| **Chain-of-Thought** | Minta langkah-langkah | Butuh logika akurat |
| **Few-Shot** | Kasih 3-5 contoh | Mau format konsisten |
| **Self-Correction** | Minta AI cek sendiri | Kode/matematika teliti |
| **Chaining** | Pecah jadi langkah kecil | Tugas kompleks |
| **Structured Output** | Minta format tertentu | Hasil mau dipakai langsung |
| **XML tags** | Struktur prompt | Prompt panjang/kompleks |

### Checklist

```
☐ Hafal 4 komponen prompt (Konteks, Tugas, Format, Batasan)
☐ Bisa pakai Persona Pattern
☐ Bisa pakai Chain-of-Thought
☐ Bisa pakai Few-Shot (3-5 contoh)
☐ Bisa pakai Self-Correction
☐ Bisa pakai Prompt Chaining
☐ Bisa pakai Structured Output & XML tags
☐ Paham beda chat web vs CLI agent
☐ Sudah latihan 1-5
```

### Ketika Bingung

```text
❓ "AI jawabnya melenceng"
   → Cek: apakah Anda sudah kasih konteks cukup? Format jelas?

❓ "AI langsung menulis kode padahal saya mau rencana"
   → Tambah batasan: "JANGAN menulis kode. Jelaskan rencana dulu."

❓ "Hasil tidak konsisten"
   → Pakai few-shot + format output yang jelas

❓ "Prompt panjang tapi hasilnya makin buruk"
   → Gunakan XML tags untuk memisahkan bagian-bagiannya

❓ Ingin lebih dalam?
   → Buka prompting-fundamental/fase-01 s/d fase-06
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **Arsitektur Desain Sistem** jika sudah bisa:

```
☐ Menulis prompt dengan 4 komponen
☐ Menggabungkan minimal 3 teknik (persona + CoT + verification)
☐ Menggunakan chaining untuk proyek kompleks
☐ Mendapatkan hasil yang konsisten dari AI
```

> **Ingat:** Prompting adalah skill yang TERUS dilatih.
> Setiap prompt di modul 1-20 adalah latihan! Setelah modul 22,
> buka `cheat-sheet-prompt.md` untuk template siap pakai.

---

**📂 Lanjut ke: `22-arsitektur-desain-sistem.md`** — naik level:
belajar MERANCANG sistem, bukan hanya membuatnya! 🏛️
