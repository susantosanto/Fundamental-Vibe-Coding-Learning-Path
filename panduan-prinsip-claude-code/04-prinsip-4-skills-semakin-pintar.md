# Prinsip 4: Skills yang Semakin Pintar Setiap Sesi

> **"Skills That Get Smarter Every Session"**
> Claude di hari ke-30 harus jauh lebih baik daripada Claude di hari pertama.

---

## 📖 Ringkasan Prinsip

**Tujuan Anthropic:**

> *"Our goal is that Claude on day 30 of working with you is going to be a lot better than Claude on day 1."*
>
> "Tujuan kami adalah Claude pada hari ke-30 bekerja dengan Anda akan jauh lebih baik daripada Claude pada hari pertama."

**— Barry Zhang, Anthropic**

Hari ke-30 lebih baik dari hari pertama. **Itu tidak terjadi secara kebetulan.** Ada mekanisme yang harus kamu lakukan secara konsisten.

---

## 🔄 Mekanisme: Siklus Perbaikan Berkelanjutan

```
┌─────────────────────────────────────────────┐
│                                             │
│  1. Gunakan skill pada tugas nyata          │
│             │                               │
│             ▼                               │
│  2. Dapatkan output (mungkin tidak sempurna)│
│             │                               │
│             ▼                               │
│  3. Tanyakan:                               │
│     "One-time fix ATAU forever?"            │
│             │                               │
│      ┌──────┴──────┐                        │
│      ▼              ▼                       │
│  One-time fix   Forever                     │
│  (perbaiki       (masukkan ke skill)        │
│   sekarang)          │                      │
│                     ▼                       │
│              Update SKILL.md                │
│              + Contoh + Edge case           │
│              + Commit                       │
│                     │                       │
│                     ▼                       │
│          Next session starts SMARTER        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Pertanyaan Kunci Setelah Setiap Output

Setelah setiap output yang **tidak sempurna** dari sebuah skill, tanyakan pada dirimu satu pertanyaan:

> **"Apakah ini perbaikan satu kali (one-time fix)? Atau harus ini ada di skill selamanya (forever)?"**

### 1️⃣ One-Time Fix (Perbaikan Sekali Pakai)

Jika masalahnya **spesifik untuk konteks saat ini** dan tidak akan terulang:

**Contoh:**
- Kamu minta Claude membuat landing page, dan warna backgroundnya tidak sesuai preferensi kamu kali ini
- Kamu cukup bilang: "Ubah warna background jadi biru muda"
- **Tidak perlu masuk ke skill** karena ini preferensi spesifik untuk task ini saja

### 2️⃣ Forever (Masukkan ke Skill Selamanya)

Jika masalahnya adalah **pola umum** yang mungkin terulang di masa depan:

**Contoh:**
- Kamu minta Claude membuat landing page, dan dia lupa menambahkan meta tags untuk SEO
- Ini bukan masalah satu kali — ini pola yang akan terus muncul
- **Tambahkan ke skill:** "Selalu sertakan meta tags SEO: title, description, og:image"

---

## 📝 Cara Memperbarui Skill

### Langkah-langkah:

1. **Identifikasi** apa yang kurang dari output Claude
2. **Tentukan** apakah ini pola umum atau kasus spesifik
3. **Buka** file `SKILL.md` dari skill yang bersangkutan
4. **Tambahkan** prinsip, contoh, atau edge case yang kurang
5. **Commit** perubahan (simpan ke git)
6. **Sesi berikutnya** — Claude sudah lebih pintar!

### Contoh Sebelum dan Sesudah:

**Sebelum (SKILL.md):**
```markdown
---
name: create-react-component
description: Membuat komponen React baru
---

Buat komponen React dengan functional component.
Gunakan TypeScript.
```

**Sesudah (SKILL.md) — setelah belajar dari pengalaman:**
```markdown
---
name: create-react-component
description: Membuat komponen React baru dengan TypeScript
---

Buat komponen React dengan functional component.
Gunakan TypeScript.

PENTING — Pelajaran dari sesi sebelumnya:
1. Selalu export komponen dengan "export default" 
   (bukan named export, kecuali ada alasan spesifik)
2. Sertakan tipe props yang lengkap — jangan gunakan "any"
3. Tambahkan JSDoc comment di atas komponen
4. Jangan lupa import React di file
5. Gunakan CSS modules, bukan inline styles
6. Tambahkan test file di folder __tests__/
```

**Hasilnya:** Sesi berikutnya, Claude akan otomatis mengikuti aturan-aturan ini. Tidak perlu kamu ingatkan manual.

---

## 📈 Grafik Pertumbuhan Skill

```
Kualitas Output
     ▲
     │                                    ● ← Hari ke-30
     │                                 ●
     │                              ●
     │                           ●
     │                        ●
     │                     ●
     │                  ●
     │               ●
     │            ●
     │         ●
     │      ●
     │   ●
     │● ← Hari ke-1
     └──────────────────────────────────────────► Waktu
     
     Garis lurus = orang yang TIDAK pernah update skill (stagnan)
     Garis naik  = orang yang UPDATE skill setelah setiap sesi
```

**Kebanyakan orang melewatkan ini.** Mereka:
1. Menjalankan skill
2. Mendapatkan output
3. Move on ke tugas berikutnya
4. **Tidak pernah memperbarui skill**

Itulah yang menyebabkan garis **datar** pada grafik — Claude hari ke-30 sama saja dengan Claude hari ke-1.

---

## 🔍 Discovery Prompt: Setelah Skill Meleset

```
"Review the back and forth I just had after using this skill. 
Can we enhance the skill so this is handled automatically, 
or we don't make the same mistake again?"
```

**Terjemahan:**
> "Review percakapan bolak-balik yang baru saja saya lakukan setelah menggunakan skill ini. Bisakah kita meningkatkan skill ini sehingga ini ditangani secara otomatis, atau kita tidak membuat kesalahan yang sama lagi?"

### Cara Menggunakan:

1. **Segera setelah** kamu selesai memperbaiki output Claude secara manual
2. **Paste prompt di atas** ke Claude
3. **Claude akan:**
   - Membaca percakapan yang baru saja terjadi
   - Mengidentifikasi pola yang menyebabkan masalah
   - Menyarankan perubahan ke skill
4. **Implementasikan saran** Claude

---

## 💡 Contoh Siklus Perbaikan di Dunia Nyata

### Skenario: Skill untuk Membuat Blog Post

**Sesi 1:** Kamu minta Claude membuat blog post. Outputnya kurang gambar.

→ **Update skill:** "Tambahkan minimal 1 gambar relevan per 500 kata. Gunakan placeholder dari picsum.photos."

**Sesi 2:** Kamu coba lagi. Sekarang gambarnya ada, tapi gaya penulisan terlalu formal.

→ **Update skill:** "Gunakan gaya penulisan santai dan conversational. Hindari jargon teknis. Bayangkan kamu sedang ngobrol dengan teman."

**Sesi 3:** Sekarang gaya penulisan sudah sesuai, tapi Claude lupa menambahkan call-to-action (CTA) di akhir.

→ **Update skill:** "Setiap blog post harus diakhiri dengan CTA yang relevan. Contoh: 'Bagaimana pendapat kamu? Tulis di kolom komentar!'"

**Sesi 10:** Skill ini sudah sangat matang. Hampir tidak perlu revisi manual.

---

## 🧠 Kapan Berhenti Memperbarui Skill?

Skill yang ideal sudah mencapai titik di mana:

1. ✅ **Output konsisten** — 90%+ output sesuai ekspektasi
2. ✅ **Edge cases tertangani** — Kasus khusus sudah didokumentasikan di skill
3. ✅ **Review minimal** — Kamu hanya perlu review cepat, bukan revisi besar

Tapi bahkan skill yang matang pun kadang perlu diperbarui ketika:
- Teknologi berubah (React rilis versi baru, API berubah)
- Preferensi kamu berubah (kamu mau gaya kode yang berbeda)
- Use case baru muncul

---

## ✅ Intisari Prinsip 4

> **Skill yang kamu gunakan hari ini adalah versi TERBURUK yang pernah ada. Setiap sesi harus membuatnya lebih baik.**

### 🎯 Action Items untuk Kamu:

1. ✅ Setelah setiap sesi dengan Claude, tanya: "One-time fix atau forever?"
2. ✅ Jika forever, update SKILL.md — tambahkan prinsip, contoh, edge case
3. ✅ Commit perubahan skill ke git agar tersimpan
4. ✅ Mulai dengan 1 skill kecil, perbaiki secara konsisten
5. ✅ Jangan tunggu sempurna — mulai dengan versi sederhana dan iterasi

### 📝 Aturan Praktis:

> **Jangan menunggu skill sempurna untuk mulai menggunakannya. Mulai dengan versi sederhana, dan biarkan skill itu tumbuh seiring waktu.**

---

**👉 Lanjut ke [Prinsip 5: Format Output Adalah Prompt](./05-prinsip-5-format-output-adalah-prompt.md)**  
**👈 [Kembali ke Daftar Isi](./README.md)**
