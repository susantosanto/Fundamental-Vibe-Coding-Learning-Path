# 🚀 Panduan Memulai untuk Pemula

> Langkah demi langkah memulai perjalanan dengan Claude Code dan Skills
> Khusus untuk pemula yang baru pertama kali mendengar tentang AI Agent

---

## 🎯 Siapa Panduan Ini untuk?

Panduan ini untuk kamu jika:
- ✅ **Baru pertama kali** mendengar tentang Claude Code
- ✅ **Belum pernah** menggunakan AI untuk coding sebelumnya
- ✅ Bingung harus mulai dari mana dengan berbagai istilah teknis
- ✅ Ingin belajar dengan cara yang **sederhana dan praktis**

---

## 🧠 Sebelum Mulai: Mindset yang Benar

### 1️⃣ AI adalah Alat, Bukan Pengganti

Bayangkan Claude Code seperti **kalkulator** untuk programmer:
- Kalkulator tidak menggantikan kemampuan matematika kamu
- Tapi kalkulator membuat perhitungan rumit jadi jauh lebih cepat
- **Kamu tetap harus tahu apa yang ingin kamu capai**

### 2️⃣ Tidak Perlu Sempurna dari Awal

Skill pertamamu tidak harus sempurna. Mulailah dengan:
```
--- Sederhana ---→ Terus diperbaiki ---→ Makin baik
```

### 3️⃣ Belajar Sambil Praktek

Teori saja tidak cukup. **Praktek langsung adalah kunci.**

---

## 📚 Prasyarat (Apa yang Perlu Kamu Punya)

| No | Prasyarat | Penjelasan |
|----|-----------|------------|
| 1 | **Komputer (PC/Mac/Linux)** | Claude Code berjalan di terminal/command prompt |
| 2 | **Koneksi Internet** | Untuk berkomunikasi dengan server Claude |
| 3 | **Akun Anthropic** | Untuk mengakses Claude API (anthropic.com) |
| 4 | **Rasa Ingin Tahu** | Yang paling penting! |

> **Catatan:** Kamu tidak perlu bisa coding untuk memulai dengan Claude Code, tapi akan sangat membantu jika kamu memiliki dasar-dasar programming.

---

## 🗺️ Roadmap: 7 Hari Pertama

### Hari 1: Kenalan dengan Claude Code

**Apa yang dilakukan:**
- Install Claude Code di komputer
- Buka terminal/command prompt
- Kirim prompt pertama: "Halo, siapa kamu?"
- Minta Claude Code menjelaskan satu konsep sederhana

**Target:** Bisa menjalankan Claude Code dan mendapat respons pertama

### Hari 2: Pahami Konsep Skills

**Apa yang dilakukan:**
- Baca Prinsip 1 dari panduan ini
- Buka folder skills Claude Code
- Lihat apakah ada skills yang sudah terinstall
- Coba pahami struktur folder skills

**Target:** Paham apa itu skill dan di mana lokasinya

### Hari 3-4: Buat Skill Pertama

**Apa yang dilakukan:**
- Pilih satu tugas sederhana yang sering kamu lakukan
- Contoh: Membuat catatan harian, menulis commit message, atau format JSON
- Buat folder skill baru
- Buat file `SKILL.md` dengan instruksi sederhana (5-10 baris)
- Coba panggil skill dengan `/nama-skill`

**Target:** Memiliki 1 skill fungsional yang bisa dipanggil

### Hari 5: Eksplorasi Tools

**Apa yang dilakukan:**
- Baca Prinsip 2 dari panduan ini
- Identifikasi satu tugas manual yang kamu lakukan setelah Claude memberi output
- Contoh: Kamu cek manual apakah JSON valid
- Buat script tool sederhana untuk mengotomatisasi pengecekan itu
- Gabungkan tool ke dalam skill

**Target:** Memiliki skill yang dilengkapi tool otomatis

### Hari 6: Praktek Composable

**Apa yang dilakukan:**
- Baca Prinsip 3 dari panduan ini
- Buat skill kedua yang terpisah tapi bisa dipanggil dari skill pertama
- Contoh: Skill `/validate-json` dipanggil dari skill `/process-data`
- Coba workflow yang menggabungkan beberapa skill

**Target:** Memiliki 2+ skill yang bisa bekerja sama

### Hari 7: Siklus Perbaikan

**Apa yang dilakukan:**
- Baca Prinsip 4 dan 5 dari panduan ini
- Gunakan skill yang sudah dibuat untuk tugas nyata
- Identifikasi 1-2 hal yang perlu diperbaiki
- Update `SKILL.md` dengan perbaikan
- Coba lagi dan lihat perbedaannya

**Target:** Mengalami sendiri bagaimana skill menjadi lebih pintar

---

## 🛠️ Cheat Sheet: Perintah Dasar Claude Code

| Perintah | Fungsi | Contoh |
|----------|--------|--------|
| `/nama-skill` | Memanggil skill | `/git-commit` |
| `open ~/.claude/skills/` | Buka folder global skills (Mac) | — |
| `explorer %USERPROFILE%\.claude\skills\` | Buka folder global skills (Windows) | — |
| Kirim prompt biasa | Berbicara langsung dengan Claude | "Buatkan fungsi untuk menghitung diskon" |

---

## 💡 Contoh Sederhana untuk Dicoba

### Contoh 1: Skill untuk Membuat Catatan

Buat folder: `~/.claude/skills/catatan/`

Buat file `SKILL.md`:

```markdown
---
name: catatan
description: Membantu membuat catatan belajar yang rapi dan terstruktur
---

Bantu saya membuat catatan tentang [topik]. Format:
1. Ringkasan 3 kalimat
2. Poin-poin penting (bullet points)
3. Contoh sederhana
4. Hal yang perlu diingat
```

**Coba panggil:** `/catatan Apa itu API?`

### Contoh 2: Skill untuk Menulis Kode Sederhana

Buat folder: `~/.claude/skills/buat-fungsi/`

Buat file `SKILL.md`:

```markdown
---
name: buat-fungsi
description: Membuat fungsi JavaScript/TypeScript sederhana
---

Buat fungsi JavaScript/TypeScript untuk [deskripsi fungsi]. 
Sertakan:
1. Nama fungsi yang jelas
2. Parameter dengan tipe data
3. JSDoc comment
4. Contoh penggunaan
```

**Coba panggil:** `/buat-fungsi Menghitung total harga dengan diskon`

---

## 🔥 Latihan Praktis: Proyek Mini

### 🎯 Tujuan: Buat Kalkulator Sederhana dengan Claude Code

Ini adalah latihan untuk membantumu merasakan langsung bagaimana bekerja dengan Claude Code.

**Langkah 1:** Buka Claude Code dan ketik:
```
"Bantu saya membuat kalkulator sederhana di JavaScript. 
Fitur: tambah, kurang, kali, bagi. Buat dalam satu file HTML 
yang bisa dibuka di browser."
```

**Langkah 2:** Setelah Claude memberikan kode, minta perbaikan:
```
"Tambah tombol clear (C) dan tampilkan history perhitungan."
```

**Langkah 3:** Simpan kode yang dihasilkan, buka di browser, dan lihat hasilnya.

**Langkah 4:** Buat skill untuk ini:
```
Buat folder: ~/.claude/skills/kalkulator/
+ Buat SKILL.md dengan instruksi untuk membuat kalkulator
```

---

## ❓ FAQ untuk Pemula

### Q: Apakah saya harus bisa coding?
**A:** Tidak harus, tapi akan sangat membantu. Claude Code bisa menulis kode untuk kamu, tapi kamu perlu tahu apa yang kamu minta.

### Q: Berapa biaya menggunakan Claude Code?
**A:** Claude Code menggunakan token. Setiap prompt dan respons menghabiskan token. Biaya tergantung pada penggunaan. Cek website Anthropic untuk harga terbaru.

### Q: Apakah data saya aman?
**A:** Anthropic memiliki kebijakan privasi yang ketat. Code kamu diproses oleh AI, tapi tidak disimpan untuk training model secara default.

### Q: Skill itu folder? Serius?
**A:** Ya! Sesederhana itu. Folder + file SKILL.md. Kesederhanaan ini disengaja oleh Anthropic.

### Q: Berapa banyak skill yang harus saya buat?
**A:** Mulai dengan 1-3 skill sederhana. Yang penting adalah kualitas, bukan kuantitas.

### Q: Skill saya tidak bekerja dengan baik. Apa yang salah?
**A:** Itu normal! Gunakan Prinsip 4: update skill setelah output tidak sempurna. Setiap kegagalan adalah kesempatan belajar.

---

## 📚 Sumber Belajar Tambahan

1. **Dokumentasi Resmi Anthropic:** docs.anthropic.com
2. **Video "Don't Build Agents, Build Skills Instead"** — Barry Zhang & Mahesh Murag di AI Engineer Code Summit
3. **Channel YouTube "How I AI"** — Wawancara dengan Thariq Shihipar
4. **Video "How Anthropic uses Claude in Product Engineering"** — Chuma Kabaghe
5. **Komunitas Agentic Architects** — Frank Nillard

---

## 🏁 Kata Penutup

Ingatlah selalu:

> **"Claude pada hari ke-30 akan jauh lebih baik daripada Claude pada hari pertama."**

Tapi itu hanya terjadi jika kamu:
1. ✅ **Mulai** — Jangan hanya baca, praktekkan
2. ✅ **Konsisten** — Gunakan setiap hari, walau hanya 15 menit
3. ✅ **Iterasi** — Perbaiki skills kamu secara terus-menerus
4. ✅ **Bersenang-senang** — Nikmati proses belajarnya!

**Selamat belajar dan selamat membangun! 🚀**

---

**👉 Kembali ke [Daftar Isi](./README.md)**
