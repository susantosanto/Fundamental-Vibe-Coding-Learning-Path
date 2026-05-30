# Prinsip 2: Skills Lebih dari Sekadar Prompt

> **"Skills Are More Than Prompts"**
> Skills terdiri dari 3 lapisan: **Deskripsi**, **Instruksi**, dan **Tools**.
> Lapisan tools adalah tempat leverage (daya ungkit) terbesar berada.

---

## 📖 Ringkasan Prinsip

Kebanyakan orang menghabiskan banyak waktu membuat prompt yang indah dan detail, tapi tools yang mereka buat sangat minim — tanpa dokumentasi, parameter diberi nama `A` dan `B` saja. **Ini adalah kesalahan paling umum.**

---

## 🏗️ Tiga Lapisan Sebuah Skill

Buka file `SKILL.md` mana pun, dan kamu akan menemukan tiga hal:

| Lapisan | Fungsi | Kesalahan Paling Umum |
|---------|--------|----------------------|
| **Deskripsi (Description)** | Memberi tahu Claude **KAPAN** harus menggunakan skill ini (dibaca di awal setiap chat) | **Terlalu samar.** Claude tidak pernah memicu skill karena tidak paham kapan harus menggunakannya |
| **Instruksi (Instructions)** | Panduan langkah-demi-langkah tentang apa yang harus dilakukan | **Over-engineered.** Terlalu panjang, terlalu kaku, terlalu membatasi |
| **Tools** | Script, API, file referensi yang BENERAN digunakan Claude | **Minim banget.** Padahal ini tempat leverage (daya ungkit) paling besar |

---

## 🔥 Kutipan Paling Kena dari Anthropic

> *"Maybe the funniest thing I see is that people will put a lot of effort into creating these really beautiful, detailed prompts. And then the tools that they make to give the model are sort of these incredibly bare-bones, no documentation, parameters named A and B."*

> "Mungkin hal paling lucu yang saya lihat adalah orang-orang menghabiskan banyak usaha untuk membuat prompt yang sangat indah dan detail. Tapi tools yang mereka buat untuk model itu sangat minim, tanpa dokumentasi, parameter-nya dinamai A dan B."

**— Erik Schluntz, Anthropic**

### 🧠 Apa Artinya?

Bayangkan seorang koki yang membuat resep 10 halaman untuk masakan yang rumit, tapi alat dapurnya hanya pisau tumpul dan panci bocor. **Prompts yang indah + Tools yang minim = Hasil yang mengecewakan.**

Kebanyakan orang melakukan **kesalahan sebaliknya**:
- Mereka menghabiskan **90% energi** untuk prompt
- Mereka memberi **10% energi** untuk tools
- **Padahal harusnya terbalik!**

---

## 🔍 Discovery Prompt: Temukan Kesenjangan Tools Kamu

```
"Find a task where I'm doing manual checking, lookup, or verification 
after AI gives me an output."
```

**Terjemahan:**
> "Temukan tugas di mana saya melakukan pengecekan manual, pencarian, atau verifikasi setelah AI memberikan saya output."

### Cara Kerjanya:

1. **Identifikasi** tugas yang kamu cek manual setelah Claude memberi output
2. **Contoh:** Kamu minta Claude menulis kode, lalu kamu manual cek apakah kodenya jalan
3. **Celanya:** Apa pun yang kamu cek manual seharusnya **bisa diotomatisasi dengan tools**
4. **Buat tool untuk itu:** Kamu bisa minta Claude menjalankan tool yang melakukan pengecekan otomatis

### 💡 Contoh Tools yang Sering Terlewat:

| Tugas Manual | Seharusnya Tools |
|-------------|------------------|
| Cek apakah kode jalan | Tool untuk run script dan cek output |
| Cek apakah UI terlihat benar | Tool untuk screenshot dan perbandingan |
| Validasi format output | Tool untuk linting dan validasi |
| Cek di database | Tool untuk query langsung |
| Baca dokumentasi API | Tool untuk fetch dan parse docs |

---

## 🚀 Contoh Nyata dari Anthropic: Chuma Kabaghe

**Siapa Chuma Kabaghe?** Seorang backend engineer di tim Product Engineering Anthropic.

**Tugasnya:** Mendapat assignment untuk mengerjakan **frontend feature** di claude.ai.

### Workflow-nya:

```
Step 1 ──► Prompt Claude Code dengan referensi design doc + 
           "use the Playwright MCP"

Step 2 ──► Claude membaca codebase, membuka UI melalui Playwright 
           (alat untuk test browser), mengonfirmasi state saat ini

Step 3 ──► Claude mengimplementasi fitur, memvalidasi via Playwright, 
           melakukan iterasi jika perlu

Step 4 ──► Chuma review dan ship (kirim ke production)
```

### 🎯 Poin Penting dari Cerita Ini:

> **Seorang backend engineer bisa mengerjakan pekerjaan frontend dengan sukses karena TOOL LAYER yang melakukan pekerjaan berat.**

Kata-kata Chuma sendiri:

> *"Having Claude Code, it almost feels like having this superpower, this ability to send off a sidekick to go take the time, go figure it out, come back, report back."*
>
> "Memiliki Claude Code, rasanya seperti memiliki kekuatan super, kemampuan untuk mengirim asisten untuk pergi menghabiskan waktu, mencari tahu, kembali, dan melaporkan hasilnya."

### 🧠 Pelajaran:

- Chuma bukan frontend engineer — dia backend engineer
- Tapi dia bisa menyelesaikan tugas frontend **karena tools yang dia buat untuk Claude** (Playwright) melakukan pekerjaan berat
- **Tools menghilangkan hambatan** — kamu tidak perlu jadi ahli di bidang itu
- Yang kamu butuhkan adalah **kemampuan mendeskripsikan apa yang ingin dicapai**, ditambah **tools yang tepat**

---

## 📊 Perbandingan: Prompt yang Baik vs Tools yang Baik

### ❌ Pola yang Salah (Kebanyakan Orang)

```markdown
# SKILL.md (terlalu panjang, 100+ baris)

Kamu adalah ahli React senior dengan 10 tahun pengalaman.
Kamu harus mengikuti praktik terbaik berikut:
1. Gunakan functional components
2. Gunakan hooks untuk state management
3. Pastikan kode kamu accessible
4. [50 baris instruksi lagi...]
5. [30 baris contoh kode...]
6. [20 baris peringatan...]

# tools/script.py
def do_stuff(a, b):  # parameter A dan B! Tidak jelas!
    # tidak ada dokumentasi, tidak ada type hints
    pass
```

### ✅ Pola yang Benar (Anthropic Way)

```markdown
# SKILL.md (ringkas, 15 baris)

Buatkan komponen React untuk fitur [deskripsi].
Gunakan tools yang tersedia untuk validasi.
Pastikan komponen bisa diakses.
Tanyakan jika ada keputusan desain yang perlu dikonfirmasi.

# tools/validate-component.py
"""
Tool untuk memvalidasi komponen React:
- Cek aksesibilitas dengan axe-core
- Cek performance dengan Lighthouse
- Cek bundle size
Parameter:
  - component_path: path ke file komponen
  - strict_mode: boolean, jika True gagalkan jika ada warning
"""
def validate_component(component_path: str, strict_mode: bool = False):
    # dokumentasi jelas, parameter jelas, type hints ada
    pass
```

---

## 🛠️ Jenis Tools yang Bisa Kamu Buat untuk Claude

| Jenis Tool | Contoh | Manfaat |
|-----------|--------|---------|
| **Script** | Python script untuk styling slides, generate thumbnail | Deterministik, murah, bisa diulang |
| **MCP (Model Context Protocol)** | Playwright MCP untuk test browser, GitHub MCP | Memberi Claude akses ke dunia nyata |
| **Referensi File** | Contoh kode, template, panduan style | Konsistensi output |
| **API Client** | Memanggil API eksternal dari dalam skill | Integrasi dengan layanan lain |
| **Validator** | Script untuk validasi output Claude | Quality assurance otomatis |

---

## ✅ Intisari Prinsip 2

> **Jangan habiskan waktu pada prompt. Habiskan waktu pada tools.**

### 🎯 Action Items untuk Kamu:

1. ✅ Audit skill kamu — apakah kamu menghabiskan 90% waktu untuk prompt?
2. ✅ Cari tugas manual yang kamu lakukan setelah menerima output Claude
3. ✅ Buat tool (script) untuk mengotomatisasi pengecekan itu
4. ✅ Dokumentasikan tool dengan baik — jangan parameter `A` dan `B`
5. ✅ Jadikan tool sebagai bagian dari skill, bukan prompt

### 📝 Aturan Praktis:

> **"Jika kamu bisa menggunakan kode (tools) alih-alih AI, lakukanlah."**

Kode itu deterministik — input sama, output pasti sama. AI tidak deterministik — prompt yang sama bisa menghasilkan output berbeda. Dan token AI itu mahal. Komputasi kode itu murah. Jadi: **pindahkan logika yang bisa dipastikan ke tools, jangan ke prompt.**

---

**👉 Lanjut ke [Prinsip 3: Skills Composable untuk Tugas Berulang, Tools Sekali Pakai untuk Tugas Spesifik](./03-prinsip-3-composable-dan-throwaway.md)**  
**👈 [Kembali ke Daftar Isi](./README.md)**
