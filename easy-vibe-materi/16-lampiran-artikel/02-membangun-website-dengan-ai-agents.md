# 🌐 Tutorial: Membangun Website dengan AI Coding & Design Agents

> **Durasi:** ~3 jam
> **Tingkat:** Pemula - Menengah
> **Output:** 1 website fungsional yang dibangun dengan AI agents

---

## Pengantar

Di tutorial sebelumnya, Anda membuat game Snake dengan satu percakapan AI. Sekarang, saatnya naik level: **membangun website multi-halaman dengan bantuan AI agents**.

Yang membedakan tutorial ini:
- Anda tidak hanya menggunakan **satu** AI, tapi **beberapa AI agents** yang bekerja sama
- Satu agent untuk desain, satu agent untuk coding, satu agent untuk debugging
- Anda bertindak sebagai **manajer produk** yang mengarahkan, bukan programmer

---

## Bagian 1: Konsep — Apa Itu AI Agents?

### Analogi: Restoran

Bayangkan Anda ingin membuat restoran:

| Peran | Manusia | AI Agent |
|-------|---------|----------|
| **Manajer** | **Anda** | Memberi arahan dan approve |
| **Koki Utama** | Claude/ChatGPT | Menulis kode utama |
| **Koki Pastry** | Claude/Cursor | Membuat komponen UI |
| **Quality Control** | AI Review | Mengecek kualitas kode |
| **Waiters** | Browser | Menampilkan hasil |

Anda tidak perlu bisa masak. Anda hanya perlu tahu **apa yang ingin Anda buat** dan bisa **memberi instruksi yang jelas**.

### Tools yang Dibutuhkan

Untuk tutorial ini, Anda perlu:

1. **Claude Code** atau **Cursor** (AI IDE) — untuk coding utama
2. **Browser** — untuk preview hasil
3. **AI Chat** (Claude/ChatGPT/DeepSeek) — untuk desain dan perencanaan

---

## Bagian 2: Perencanaan — Tanya AI untuk Desain

### Langkah 1: Minta AI Membuatkan Spesifikasi

Buka AI Chat (Claude/ChatGPT) dan tanya:

```
Saya ingin membuat website portofolio pribadi.

Bantu saya membuat spesifikasi:
1. Halaman apa saja yang diperlukan?
2. Fitur apa saja di setiap halaman?
3. Desain seperti apa yang cocok untuk portofolio?
4. Teknologi apa yang sebaiknya digunakan?

Saya target audiens: [pekerjaan/industri Anda]
Saya ingin tampilan: [modern/minimalis/kreatif]
```

### Langkah 2: Dapatkan Wireframe

Minta AI membuat deskripsi wireframe:

```
Berdasarkan spesifikasi di atas, buat deskripsi wireframe untuk setiap halaman:

1. Header: [deskripsi]
2. Hero section: [deskripsi]
3. About section: [deskripsi]
4. Portfolio grid: [deskripsi]
5. Contact form: [deskripsi]
6. Footer: [deskripsi]

Sertakan tata letak dan elemen UI di setiap bagian.
```

### Langkah 3: Minta AI Pilih Tech Stack

```
Untuk website portofolio pribadi, tech stack apa yang paling cocok?
Pertimbangkan:
- Saya pemula (belum bisa coding)
- Ingin cepat jadi
- Ingin mudah diubah nanti
- Ingin gratis hosting

Beri rekomendasi dengan alasan.
```

---

## Bagian 3: Implementasi — Coding dengan AI Agents

### Skenario 1: Satu Prompt, Satu Halaman

Buka **Claude Code** atau **Cursor**, lalu beri prompt:

```
Buat website portofolio pribadi 1 halaman dengan:

HEADER:
- Nama saya: [nama Anda]
- Navigasi: Home, About, Portfolio, Contact

HERO:
- Foto/avatar (bisa pakai emoji atau placeholder)
- Tagline: [tagline Anda]
- Tombol: "Lihat Portfolio Saya" dan "Hubungi Saya"

ABOUT:
- Paragraf singkat tentang saya
- 3 keahlian utama (dengan icon)
- Tombol download CV

PORTFOLIO:
- Grid 3x2 menampilkan project
- Setiap card: gambar placeholder, judul, deskripsi singkat, link
- Hover effect yang keren

CONTACT:
- Form: nama, email, pesan
- Tombol kirim

FOOTER:
- Social media links (icon)
- Copyright

DESAIN:
- Modern, clean, responsive
- Warna: [warna favorit Anda]
- Animasi halus
- Font yang bagus
```

### Skenario 2: Multi-Agent Workflow

Pendekatan yang lebih canggih — gunakan agent berbeda untuk tugas berbeda:

**Agent 1: Designer** (AI Chat)
```
Buatkan design system untuk website portofolio:
1. Color palette (5 warna)
2. Typography (heading, body, accent)
3. Spacing system
4. Component styles (button, card, form)
5. Contoh implementasi CSS
```

**Agent 2: HTML/CSS Developer** (Claude Code)
```
Berdasarkan design system ini [tempel hasil dari Agent 1],
buat struktur HTML dan CSS untuk homepage portofolio.
```

**Agent 3: JavaScript Developer** (Cursor)
```
Tambah interaktivitas ke website ini [tempel HTML]:
1. Smooth scroll untuk navigasi
2. Animasi scroll reveal
3. Form validation untuk contact form
4. Dark mode toggle
5. Mobile hamburger menu
```

**Agent 4: Reviewer** (AI Chat)
```
Review kode ini [tempel kode]. Cari:
1. Bug potensial
2. Masalah performa
3. Masalah accessibility
4. Saran perbaikan
```

---

## Bagian 4: Studi Kasus — Website Portofolio Multi-Halaman

### Arsitektur Halaman

```
portfolio/
├── index.html          (Homepage)
├── about.html          (Tentang Saya)
├── portfolio.html      (Portfolio)
├── blog.html           (Blog/Artikel)
├── contact.html        (Kontak)
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
```

### Prompt untuk Index.html

```
Buat homepage portofolio (index.html) dengan:

1. Hero Section:
   - Background gradient
   - Nama besar dengan efek typing
   - Subtitle: peran/pekerjaan saya
   - CTA buttons: "Lihat Project" dan "Hubungi Saya"

2. Featured Projects:
   - 3 project terbaik (card layout)
   - Masing-masing dengan gambar, judul, tech stack badge
   - Hover: scale up + shadow

3. Skills Section:
   - Progress bar untuk setiap skill
   - Animasi saat muncul di viewport

4. Testimonials:
   - Carousel/slider
   - 3 testimoni dari klien/teman

5. Footer:
   - Social links
   - Newsletter signup form
   - Copyright

Desain responsif untuk mobile, tablet, dan desktop.
```

### Prompt untuk Portfolio.html

```
Buat halaman portfolio dengan:

1. Filter gallery:
   - Kategori: Web App, Mobile App, AI/ML, Design
   - Klik kategori → filter project
   - Animasi transisi yang halus

2. Project cards dalam grid:
   - Gambar thumbnail
   - Judul project
   - Deskripsi singkat
   - Tech stack badges
   - Link live demo dan GitHub

3. Modal/lightbox untuk detail project:
   - Gambar besar
   - Deskripsi lengkap
   - Timeline project
   - Link

4. Infinite scroll atau pagination untuk banyak project
```

---

## Bagian 5: Tips Multi-Agent

### 1. Bagi Tugas dengan Jelas

Setiap agent harus punya tugas spesifik:

| Agent | Tugas | Output |
|-------|-------|--------|
| Agent 1 | Perencanaan | Spesifikasi + wireframe |
| Agent 2 | HTML struktur | File HTML |
| Agent 3 | CSS styling | File CSS |
| Agent 4 | JavaScript | File JS |
| Agent 5 | Review | Laporan bug |

### 2. Gunakan Prompt Berantai

```
Agent 1: "Buat wireframe..."
↓ (output Agent 1 jadi input Agent 2)
Agent 2: "Berdasarkan wireframe ini, buat HTML..."
↓ (output Agent 2 jadi input Agent 3)
Agent 3: "Styling untuk HTML ini dengan CSS..."
```

### 3. Iterasi dengan Cepat

Jangan menunggu sempurna. Buat versi kasar dulu, lalu perbaiki:

```
"Iterasi 1: Buat halaman dengan layout dasar"
"Iterasi 2: Tambah styling dan warna"
"Iterasi 3: Tambah interaktivitas"
"Iterasi 4: Responsif untuk mobile"
"Iterasi 5: Polish dan animasi"
```

### 4. Gunakan AI untuk Debugging

Jika ada error, jangan bingung:

```
"Ada error di console: [screenshot/salin error].
Tolong analisis penyebab dan beri solusi."
```

---

## Bagian 6: Dari Lokal ke Publik

### Deploy ke GitHub Pages

Minta AI deploy website Anda:

```
Saya punya file HTML, CSS, dan JS di folder project.
Bantu saya deploy ke GitHub Pages langkah demi langkah:
1. Buat repository baru
2. Upload file
3. Aktifkan GitHub Pages
4. Beri URL publik
```

Atau gunakan layanan gratis lainnya:
- **Vercel** → vercel.com
- **Netlify** → netlify.com
- **GitHub Pages** → github.com

---

## Ringkasan

Dengan pendekatan multi-agent, Anda telah belajar:

1. ✅ **Menggunakan AI sebagai perencana** — buat spesifikasi
2. ✅ **Menggunakan AI sebagai designer** — buat design system
3. ✅ **Menggunakan AI sebagai developer** — tulis kode
4. ✅ **Menggunakan AI sebagai reviewer** — cek kualitas
5. ✅ **Multi-agent workflow** — bagi tugas ke beberapa AI

**Ingat:** Anda bukan programmer dalam skenario ini. Anda adalah **manajer produk** yang mengarahkan tim AI untuk mewujudkan visi Anda.

> 🎯 **Next step:** Lanjut ke [Bab 3: Mencari Ide Produk](../../03-mencari-ide-produck/01-mencari-ide-yang-benar.md) untuk belajar menemukan ide yang layak dibangun.

---

*Kembali ke: [01-Tutorial-Snake-Game.md](./01-tutorial-snake-game.md)*
