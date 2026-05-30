# Prinsip 3: Skills Composable untuk Tugas Berulang, Tools Sekali Pakai untuk Tugas Spesifik

> **"Composable for Repeats, Throwaway for One-Shots"**
> Skills kecil yang dirantai + tools kustom sekali pakai mengalahkan satu skill raksasa.

---

## 📖 Ringkasan Prinsip

**Anthropic memiliki 4 prinsip untuk skills:**
1. **Composable** — Bisa digabungkan, bekerja sama
2. **Portable** — Bisa dipindahkan antar lingkungan
3. **Efficient** — Jaga konteks tetap kecil
4. **Powerful** — Beri agen kemampuan nyata

Dari keempatnya, prinsip yang paling penting untuk kebanyakan orang adalah: **COMPOSABLE.**

---

## 🔬 Analisis: Satu Skill Raksasa vs Banyak Skill Kecil

### 🚫 Masalah: Satu Skill Besar (Monolitik)

Contoh nyata dari penulis panduan (Frank Nillard):

```
/content-creation (SATU skill raksasa yang melakukan SEMUANYA)

Di dalamnya:
- Ide konten
- Naskah script
- Social media posts
- Seluruh pipeline
```

**Masalah yang muncul:**
1. ❌ **Tidak terkelola** — Mau ubah cara penulisan script? Harus tulis ulang SELURUH skill
2. ❌ **Sulit di-debug** — Ada error di bagian mana? Susah dilacak
3. ❌ **Perubahan tidak terisolasi** — Setiap tweak berisiko merusak bagian lain
4. ❌ **Sulit diuji** — Test satu fungsi berarti test semuanya

### ✅ Solusi: Banyak Skill Kecil (Composable)

Setelah dipecah menjadi 12 skill kecil:

```
Sebelum:                          Sesudah (12 skill independen):
/content-creation                 /idea-title
(1 skill raksasa)                 /video-prep
                                  /guide
                                  /title
                                  /timestamps
                                  /publish
                                  /thumbnail
                                  /analyze
                                  /excalidraw-diagrams
                                  /excalidraw-visuals
                                  /idea-to-prep
                                  /claude-youtube
```

---

## 🎯 Tiga Alasan Skill Kecil Mengalahkan Satu Skill Besar

### 1️⃣ Masalah Mudah Ditemukan

Ketika sebuah skill fokus (hanya melakukan satu hal) rusak, kamu langsung tahu di mana masalahnya.

**Contoh:**
- `/thumbnail` error → masalah hanya di pembuatan thumbnail
- `/publish` error → masalah hanya di proses publish
- Tidak perlu debugging seluruh pipeline

### 2️⃣ Perbaikan Bersifat Kumulatif

> **"Update `/title`, dan semua workflow yang menggunakannya mendapat upgrade secara gratis."**

Ini yang disebut **compounding improvements** — setiap perbaikan pada satu skill secara otomatis meningkatkan kualitas SEMUA workflow yang menggunakan skill itu.

**Analogi:**
- Kamu punya skill `/validate-json` yang diperbaiki untuk menangani edge case
- Semua skill yang menggunakan `/validate-json` (mungkin 5-10 workflow berbeda) langsung mendapat perbaikan itu
- **Tanpa perlu mengubah satu baris pun** di workflow tersebut!

### 3️⃣ Reuse (Penggunaan Kembali) Mengalahkan Rebuild (Membangun Ulang)

```
/analyze 
  └──► bisa dipakai di /video-prep
  └──► bisa dipakai di /guide
  └──► bisa dipakai di /title
    └──► Dibangun SEKALI, digunakan di mana-mana
```

**Tanpa composability**, kamu harus:
1. Copy-paste logika analisis ke /video-prep
2. Copy-paste lagi ke /guide
3. Copy-paste lagi ke /title
4. Kalau ada bug di logika analisis, perbaiki di 3 tempat!
5. Kalau ada peningkatan fitur, upgrade di 3 tempat!

**Dengan composability**, kamu cukup:
1. Panggil `/analyze` dari skill lain
2. Kalau ada bug, perbaiki di SATU tempat
3. Semua yang menggunakan `/analyze` otomatis diperbaiki

---

## 💡 Pola 1: Simpan Script di Dalam Skill

> *"We kept seeing Claude write the same Python script over and over again to apply styling to slides. So we just asked Claude to save it inside the skill as a tool for his future self. Now we can just run the script and that makes everything a lot more consistent."*

> "Kami terus melihat Claude menulis script Python yang sama berulang kali untuk menerapkan styling ke slide. Jadi kami minta Claude untuk menyimpannya di dalam skill sebagai alat untuk dirinya di masa depan. Sekarang kami bisa menjalankan script itu dan semuanya jauh lebih konsisten."

**— Barry Zhang, Anthropic**

### 🧠 Kenapa Ini Penting?

| Aspek | Script (Kode) | Prompt AI (Token) |
|-------|--------------|-------------------|
| **Deterministik** | ✅ Input sama → Output pasti sama | ❌ Bisa berbeda setiap kali |
| **Biaya** | ✅ Murah (hanya komputasi) | ❌ Mahal (token mahal) |
| **Kecepatan** | ✅ Instan | ❌ Butuh waktu generate |
| **Konsistensi** | ✅ 100% konsisten | ❌ Bervariasi |

### 📌 Aturan Praktis:

> **Jika Claude menulis script yang sama dua kali, simpan di dalam skill.**

### Contoh:

Daripada setiap kali minta Claude membuat styling slide dengan prompt panjang, buat script Python:

```python
# tools/apply-slide-styling.py
"""
Terapkan styling konsisten ke slide.
Parameter:
  - slide_path: path ke file slide
  - theme: dark | light | brand
"""
def apply_styling(slide_path: str, theme: str = "brand"):
    # Logika styling yang konsisten
    pass
```

**Hasilnya:** Klik satu perintah → styling slide konsisten → tidak perlu bayar token AI setiap kali.

---

## 🔒 Pola 2: Kontrol Siapa yang Bisa Memicu Skill

Ada **dua flag frontmatter** di file `SKILL.md` yang jarang diketahui orang:

### 1️⃣ `disable-model-invocation: true`

Hanya **kamu** yang bisa memicu skill. Claude **tidak bisa** memutuskan menggunakan skill ini sendiri.

```yaml
---
name: publish
description: Gunakan saat Frank ingin publish video baru...
disable-model-invocation: true
---
```

**Kapan pakai ini?**
⚠️ Untuk hal-hal berisiko atau destruktif:
- Publishing ke production
- Deploy aplikasi
- Mengirim email massal
- Menghapus data
- Melakukan pembayaran

### 2️⃣ `user-invocable: false`

Kebalikannya. Skill ini **sembunyi dari menu slash** kamu. Hanya **Claude** yang bisa memicunya — biasanya saat skill induk (parent skill) memanggilnya.

```yaml
---
name: excalidraw-visuals
description: Gunakan saat seseorang meminta visual hand-drawn...
user-invocable: false
---
```

**Kapan pakai ini?**
🔧 Untuk **helper skills** yang tidak boleh dipanggil langsung:
- Skill validasi internal
- Skill format data
- Skill preprocessing
- Skill yang hanya dipanggil oleh skill lain

### 📊 Perbandingan Flag

| Flag | `disable-model-invocation: true` | `user-invocable: false` |
|------|----------------------------------|------------------------|
| **Kamu (user) bisa panggil?** | ✅ Ya | ❌ Tidak (sembunyi dari menu) |
| **Claude bisa panggil?** | ❌ Tidak | ✅ Ya |
| **Use case** | Operasi berisiko (publish, deploy) | Helper internal untuk skill lain |

---

## 🔍 Discovery Prompt: Audit Skill Kamu

```
"Audit my Claude Skills for: visibility, deterministic vs non-deterministic, composability."
```

**Terjemahan:**
> "Audit Skills Claude saya untuk: visibilitas, deterministik vs non-deterministik, composability."

### Apa yang Claude akan lakukan:
1. **Visibilitas** — Cek apakah setiap skill punya flag yang tepat (`disable-model-invocation`, `user-invocable`)
2. **Deterministik vs Non-Deterministik** — Identifikasi bagian mana yang seharusnya jadi script (deterministik) vs tetap di prompt (non-deterministik)
3. **Composability** — Cari skill yang bisa dipecah atau digabungkan untuk reuse yang lebih baik

---

## ⚖️ Counterweight: Tools Sekali Pakai Juga OK

Tidak semua engineer Anthropic religius tentang composability. **Thariq Shihipar** memberikan perspektif berbeda:

> *"I like this idea of just-in-time documentation, very high quality, throwaway software, which is nice. It's cheap, so you can toss it."*
>
> "Saya suka ide dokumentasi tepat-waktu, berkualitas sangat tinggi, software sekali pakai. Ini bagus karena murah, jadi kamu bisa buang saja."

### 🧠 Artinya:

- **Token itu murah** — jangan takut menggunakan token untuk tugas satu kali
- Untuk tugas **one-shot** (hanya sekali pakai):
  - Bangun interface kustom
  - Gunakan untuk keputusan itu
  - Buang setelah selesai
- **Tidak semuanya harus bisa dipakai ulang**

### 📊 Kapan Pakai Composable vs Throwaway:

| Situasi | Pendekatan | Contoh |
|---------|-----------|--------|
| Kamu melakukan ini SETIAP MINGGU | **Composable skill** | `/git-commit`, `/code-review`, `/deploy` |
| Kamu melakukan ini SEKALI SAJA | **Throwaway tool** | "Buat HTML interface untuk membandingkan 3 opsi arsitektur" |
| Logika yang DETERMINISTIK | **Script dalam skill** | Format JSON, styling, transformasi data |
| Logika yang KREATIF | **Prompt + Claude** | Menulis konten, brainstorming ide |

---

## ✅ Intisari Prinsip 3

> **Bangun skill kecil yang berantai untuk tugas berulang. Bangun tools sekali pakai untuk tugas spesifik. Simpan bagian yang deterministik sebagai script. Kunci yang berisiko dengan flag.**

### 🎯 Action Items untuk Kamu:

1. ✅ Audit skill yang ada — apakah ada yang terlalu besar (monolitik)?
2. ✅ Pecah skill besar menjadi beberapa skill kecil yang fokus
3 ✅ Identifikasi script yang ditulis Claude berulang kali → simpan di dalam skill
4. ✅ Tambahkan flag `disable-model-invocation: true` untuk skill berisiko
5. ✅ Tambahkan flag `user-invocable: false` untuk helper skill
6. ✅ Jangan takut membuat tools sekali pakai untuk tugas one-shot

---

**👉 Lanjut ke [Prinsip 4: Skills yang Semakin Pintar Setiap Sesi](./04-prinsip-4-skills-semakin-pintar.md)**  
**👈 [Kembali ke Daftar Isi](./README.md)**
