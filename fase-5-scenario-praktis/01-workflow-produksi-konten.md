# A1: Workflow Produksi Konten — Panduan Lengkap

> **Plan 构思 → Build 输出 → 文件化管理**

**Estimasi**: 20 menit belajar + 40 menit praktik | **Level**: Pemula-Menengah

---

## 🎯 Outcome Pembelajaran

Setelah menyelesaikan modul ini, Anda akan mampu:

- **Menguasai alur AI-assisted writing** standar industri untuk berbagai jenis konten
- **Menggunakan Plan mode** untuk构思, outline, dan strategi konten sebelum menulis
- **Menggunakan Build mode** untuk output konten resmi: artikel, script, newsletter, dokumentasi
- **Melakukan iterasi dan revisi** yang efektif tanpa harus mulai dari awal
- **Membuat content calendar** dan mengelola batch content creation
- **Mengoptimalkan konten untuk SEO** dengan bantuan AI
- **Melakukan content repurposing** — satu konten jadi banyak format
- **Membuat prompt image generation** untuk konten visual
- **Menganalisis performa konten** dan mengoptimalkan strategi

---

## 🔑 Konsep Inti

### 3 Tahap AI Writing

| Tahap | Mode | Aktivitas | Output |
|-------|------|-----------|--------|
| 构思 (Planning) | Plan | Tentukan topik, struktur, outline, target audience | Framework konten, outline detail |
| Output (Building) | Build | Generate konten lengkap, simpan sebagai file | File konten siap pakai |
| Iterasi (Refining) | Build | Edit, poles, ekspansi, repurpose | Konten final berkualitas |

### Kenapa Harus Bertahap

- **构思阶段不写文件**: Hindari半成品 — jangan buat file sebelum outline jelas
- **想清楚再动手**: Kurangi rework — planning yang matang menghemat waktu editing
- **迭代有依据**: Berdasarkan outline, tidak melenceng dari tujuan awal
- **Kualitas konsisten**: Setiap konten mengikuti standar yang sudah ditetapkan

### Jenis Konten yang Bisa Dibuat dengan AI

| Jenis Konten | Estimasi Waktu | AI Role | Output Format |
|--------------|----------------|---------|---------------|
| Blog Post / Artikel | 15-30 menit | Writer + Editor | Markdown, HTML, DOCX |
| Social Media Post | 5-10 menit | Copywriter | Text, Caption |
| Video Script | 20-40 menit | Scriptwriter | Text dengan cue |
| Newsletter | 15-25 menit | Email Marketer | HTML, Text |
| Dokumentasi Teknis | 30-60 menit | Technical Writer | Markdown, PDF |
| Image Prompt | 5-10 menit | Prompt Engineer | Text prompt |
| Content Calendar | 10-20 menit | Content Strategist | Table, Spreadsheet |
| SEO Meta Tags | 5-10 menit | SEO Specialist | HTML tags |

---

## 📋困境 yang Diselesaikan

| Masalah | Sebelum AI | Setelah AI |
|---------|------------|------------|
| Konten tidak terstruktur | Nulis langsung, hasil berantakan | Outline dulu, konten rapi |
| Kualitas tidak konsisten | Tiap artikel beda kualitas | Template + style guide |
| Sulit iterasi | Harus mulai dari awal | Edit file existing dengan konteks |
| Writer's block | Berjam-jam staring di layar | AI generate draft dalam menit |
| SEO tidak optimal | Tidak tahu cara optimize | AI suggest keyword, meta tags |
| Konten satu format saja | Satu artikel = satu postingan | Repurpose ke 5+ format |
| Tidak ada jadwal konten | Posting random | Content calendar terstruktur |

---

## 📖 Bagian 1: Workflow Dasar Produksi Konten

### 1.1 Setup Proyek Writing

```bash
mkdir ~/produksi-konten
cd ~/produksi-konten
mkdir -p blog social-media video newsletter dokumentasi
opencode
```

### 1.2 Plan Mode — 构思 dan Outline

Tekan `Tab` pastikan status bar显示 `Plan`.

```
Saya ingin menulis artikel tentang "Keuntungan dan Kerugian Remote Work" 
untuk pembaca fresh graduate, sekitar 800 kata. Bantu saya:
1. Tentukan struktur artikel
2. List poin setiap bagian
3. Sarankan judul yang menarik
4. Rekomendasikan keyword SEO
```

**Expected**: AI output framework dan outline, TIDAK buat file.

### 1.3 Diskusi dan Sempurnakan Outline

```
Di bagian "Kerugian Remote Work", bisa tambahkan contoh pengalaman pribadi? 
Revisi outline-nya dan tambahkan data statistik tentang produktivitas remote work.
```

### 1.4 Build Mode — Output Konten

Tekan `Tab` switch ke `Build`.

```
Berdasarkan outline yang sudah didiskusikan, tulis artikel lengkap 
dan simpan sebagai blog/remote-work-pro-kontra.md
```

**Expected**: AI buat file dan tulis artikel lengkap.

### 1.5 Iterasi Revisi

```
@blog/remote-work-pro-kontra.md Pembukaannya terlalu datar. 
Ganti dengan deskripsi场景 yang menarik — bayangkan seorang fresh graduate 
yang baru pertama kali kerja remote di kamarnya.
```

---

## 📖 Bagian 2: Blog Post dan Artikel

### 2.1 Template Outline Artikel

```
## Role
Kamu adalah content planner senior, ahli dalam structural thinking dan SEO.

## Task
Buat framework dan outline artikel berdasarkan topik.

## Input
- Topik: [topik]
- Target pembaca: [profil]
- Tujuan: [edukasi/hiburan/tutorial/promosi?]
- Jumlah kata: [angka]
- Tone: [formal/santai/hangat/autoritatif?]
- Keyword utama: [keyword]
- Keyword sekunder: [keyword1, keyword2]

## Output
1. **Posisi Artikel** — Inti dalam 1 kalimat
2. **Struktur** — Tabel: Bagian | Fungsi | Estimasi kata | Keyword target
3. **Poin per Bagian** — Detail setiap section dengan sub-poin
4. **3 Alternatif Judul** — Dengan analisis SEO potential
5. **Meta Description** — 150-160 karakter
6. **Internal Link Suggestions** — Topik terkait yang bisa di-link
```

### 2.2 Prompt Generate Artikel Lengkap

```
## Role
Kamu adalah content writer profesional dengan spesialisasi [topik].

## Task
Tulis artikel lengkap berdasarkan outline berikut.

## Outline
[Paste outline dari tahap planning]

## Writing Guidelines
1. **Hook di paragraf pertama** — Buat pembaca ingin lanjut membaca
2. **Subheading setiap 200-300 kata** — Agar mudah di-scan
3. **Contoh konkret** — Minimal 2 contoh per section utama
4. **Data dan statistik** — Sertakan angka untuk kredibilitas
5. **Transisi smooth** — Antar section mengalir natural
6. **CTA di akhir** — Ajakan bertindak yang relevan
7. **Keyword density** — 1-2% untuk keyword utama, natural placement
8. **Panjang** — Target [jumlah] kata

## Output
Simpan sebagai: [nama-file.md]
```

### 2.3 Contoh: Artikel untuk Website Sekolah

```
Saya ingin menulis artikel untuk website SD Negeri Pasirhalang:
"Program Literasi Digital di SD Negeri Pasirhalang: Persiapan Siswa Menghadapi Era Digital"

Target pembaca: Orang tua siswa, komite sekolah, dinas pendidikan
Tujuan: Edukasi + promosi program sekolah
Jumlah kata: 1000 kata
Tone: Hangat, profesional, informatif
Keyword utama: literasi digital SD
Keyword sekunder: pendidikan digital, teknologi sekolah, SD Pasirhalang

Buat outline lengkap dengan struktur:
1. Pendahuluan — Kenapa literasi digital penting untuk anak SD
2. Program yang sudah berjalan — Deskripsi kegiatan
3. Hasil dan dampak — Data peningkatan kemampuan siswa
4. Rencana ke depan — Ekspansi program
5. Ajakan untuk orang tua — Cara mendukung di rumah
```

### 2.4 SEO Optimization Prompt

```
## Role
Kamu adalah SEO specialist dengan pengalaman 10+ tahun.

## Task
Optimasi artikel berikut untuk mesin pencari.

## Input
- Artikel: @blog/[nama-file.md]
- Keyword utama: [keyword]
- Keyword sekunder: [keyword1, keyword2, keyword3]
- Target audience: [siapa]

## Output
1. **SEO Score** — Rating A/B/C/D dengan penjelasan
2. **Keyword Analysis** — Density, placement, suggestions
3. **Meta Tags** — Title tag (≤60 char), Meta description (≤160 char)
4. **Heading Structure** — H1, H2, H3 hierarchy review
5. **Internal Linking** — Saran anchor text dan target
6. **Image Alt Text** — Saran alt text untuk gambar
7. **Schema Markup** — JSON-LD suggestion untuk Article schema
8. **Readability Score** — Flesch-Kincaid atau sejenisnya
```

---

## 📖 Bagian 3: Social Media Content

### 3.1 Platform-Specific Content Strategy

Setiap platform punya karakteristik berbeda:

| Platform | Panjang Ideal | Tone | Format | Frekuensi |
|----------|---------------|------|--------|-----------|
| Instagram | 100-200 char caption | Visual, engaging | Carousel, Reels | 3-5x/minggu |
| Twitter/X | 280 char | Concise, punchy | Thread, single tweet | 1-3x/hari |
| Facebook | 200-500 char | Conversational | Post, video | 2-3x/minggu |
| LinkedIn | 300-800 char | Professional | Article, post | 2-3x/minggu |
| TikTok | Script 30-60 detik | Casual, entertaining | Video script | 3-5x/minggu |
| WhatsApp | 50-150 char | Personal, direct | Broadcast, status | Sesuai kebutuhan |

### 3.2 Prompt Social Media Post

```
## Role
Kamu adalah social media manager kreatif.

## Task
Buat konten social media untuk berbagai platform dari satu topik.

## Input
- Topik: [topik]
- Platform: [Instagram/Twitter/Facebook/LinkedIn/TikTok]
- Brand voice: [deskripsi tone dan style]
- CTA: [ajakan bertindak]

## Output per Platform
1. **Caption** — Sesuai batas karakter platform
2. **Hashtags** — 5-15 hashtag relevan (mix popular + niche)
3. **Visual Suggestion** — Deskripsi gambar/video yang cocok
4. **Best Time to Post** — Berdasarkan platform analytics umum
5. **Engagement Strategy** — Cara meningkatkan interaksi
```

### 3.3 Contoh: Konten Sosmed untuk Sekolah

```
Buat konten social media untuk SD Negeri Pasirhalang:
Topik: "Perayaan Hari Pendidikan Nasional 2 Mei"

Platform: Instagram, Facebook, WhatsApp Status
Brand voice: Hangat, edukatif, membanggakan
CTA: "Ikuti kegiatan kami dan dukung pendidikan berkualitas"

Untuk setiap platform:
1. Caption yang engaging
2. Hashtag relevan (mix nasional + lokal)
3. Saran visual (foto kegiatan, infografis)
4. Waktu posting optimal
```

### 3.4 Thread Twitter/X Generator

```
Buat Twitter thread tentang "5 Kesalahan Umum Orang Tua dalam Mendampingi Anak Belajar di Rumah":

Rules:
- Tweet 1: Hook yang kuat — buat orang ingin baca selanjutnya
- Tweet 2-6: Satu kesalahan per tweet, dengan solusi praktis
- Tweet 7: Kesimpulan + CTA
- Setiap tweet max 280 karakter
- Gunakan numbering (1/7, 2/7, dst)
- Tone: Empatik, tidak menghakimi, solusi-oriented
- Sertakan emoji secukupnya (max 2 per tweet)
```

---

## 📖 Bagian 4: Video Script Writing

### 4.1 Struktur Video Script

```
## Struktur Video Script yang Efektif

1. **Hook (0-5 detik)** —抓住 perhatian, buat penasaran
2. **Intro (5-15 detik)** — Perkenalkan topik, kenapa penting
3. **Main Content (15-50 detik)** — Poin utama, contoh, demonstrasi
4. **CTA (50-60 detik)** — Ajakan: subscribe, like, comment, share

## Elemen Script
- [Visual] Deskripsi apa yang tampil di layar
- [Audio] Narasi yang diucapkan
- [Text] Teks overlay di video
- [SFX] Sound effect atau musik
```

### 4.2 Prompt Video Script

```
## Role
Kamu adalah scriptwriter video edukasi untuk YouTube/TikTok/Reels.

## Task
Buat video script lengkap dengan visual cue dan timing.

## Input
- Topik: [topik]
- Platform: [YouTube/TikTok/Instagram Reels]
- Durasi target: [detik/menit]
- Target audience: [siapa]
- Style: [edukasi/hiburan/tutorial/storytelling]

## Output Format
| Timestamp | Visual | Audio (Narasi) | Text Overlay | Notes |
|-----------|--------|----------------|--------------|-------|
| 0:00-0:05 | [deskripsi] | [narasi] | [teks] | [hook] |
| 0:05-0:15 | [deskripsi] | [narasi] | [teks] | [intro] |
| ... | ... | ... | ... | ... |

## Requirements
- Hook di 3 detik pertama harus kuat
- Setiap 10-15 detik ada "pattern interrupt" (perubahan visual/nada)
- Bahasa conversational, bukan formal
- Sertakan B-roll suggestions
- CTA natural, tidak terlalu salesy
```

### 4.3 Contoh: Video Script untuk Sekolah

```
Buat video script TikTok 60 detik tentang:
"Sehari Menjadi Siswa di SD Negeri Pasirhalang"

Style: Vlog-style, fun, edukatif
Target: Orang tua calon siswa, masyarakat umum

Struktur:
- 0-5s: Hook — "Pernah penasaran seperti apa sehari di SD kami?"
- 5-15s: Morning routine — Upacara, salam guru
- 15-30s: Kegiatan belajar — Kelas interaktif, praktikum
- 30-45s: Ekstrakurikuler — Olahraga, seni
- 45-55s: Pulang sekolah — Pesan dari kepala sekolah
- 55-60s: CTA — "Daftarkan anak Anda! Info: [kontak]"

Sertakan:
- Visual description untuk setiap scene
- Narasi yang diucapkan
- Text overlay suggestions
- Musik/SFX recommendations
```

---

## 📖 Bagian 5: Newsletter dan Email Marketing

### 5.1 Struktur Newsletter Efektif

```
## Struktur Newsletter

1. **Subject Line** — 40-50 karakter, curiosity-driven
2. **Preheader** — 50-100 karakter, complement subject
3. **Greeting** — Personalized, warm
4. **Opening** — Hook, kenapa email ini penting
5. **Main Content** — 1-3 poin utama, scannable
6. **CTA** — Satu CTA utama, jelas dan actionable
7. **Closing** — Personal sign-off
8. **P.S.** — Secondary CTA atau bonus info
```

### 5.2 Prompt Newsletter

```
## Role
Kamu adalah email marketing specialist.

## Task
Buat newsletter yang engaging dan high-converting.

## Input
- Topik: [topik]
- Audience: [siapa]
- Tujuan: [informasi/promosi/engagement]
- Brand voice: [deskripsi]
- CTA utama: [ajakan]

## Output
1. **5 Alternatif Subject Line** — Dengan A/B test rationale
2. **Preheader Text** — Complement subject line
3. **Full Email Body** — HTML-ready format
4. **CTA Button Text** — 3 alternatif
5. **Plain Text Version** — Untuk email client yang tidak support HTML
6. **Send Time Recommendation** — Berdasarkan best practices

## Constraints
- Subject line max 50 karakter
- Email body max 500 kata
- Satu CTA utama (jangan confuse reader)
- Mobile-friendly (paragraph pendek, spacing adequate)
- Include personalization tokens: {{nama}}, {{sekolah}}
```

### 5.3 Contoh: Newsletter untuk Orang Tua Siswa

```
Buat newsletter bulanan untuk orang tua siswa SD Negeri Pasirhalang:

Topik: "Update Program Sekolah Bulan Mei 2026"
Audience: Orang tua/wali siswa
Tujuan: Informasi + engagement
Brand voice: Hangat, profesional, transparan

Konten yang perlu disampaikan:
1. Prestasi siswa di lomba tingkat kecamatan
2. Jadwal ujian semester genap
3. Program baru: Literasi Digital
4. Jadwal pertemuan orang tua-bulan depan
5. Pengumuman: Libur nasional dan cuti bersama

CTA: "Konfirmasi kehadiran di pertemuan orang tua"
Personalization: {{nama_ortu}}, {{nama_siswa}}, {{kelas}}
```

---

## 📖 Bagian 6: Dokumentasi Teknis

### 6.1 Jenis Dokumentasi

| Jenis | Tujuan | Audience | Format |
|-------|--------|----------|--------|
| User Guide | Cara menggunakan produk | End user | Markdown, PDF |
| API Documentation | Referensi endpoint | Developer | Markdown, Swagger |
| Technical Spec | Desain sistem | Developer | Markdown, Confluence |
| SOP | Prosedur operasional | Staff | Markdown, DOCX |
| Changelog | Riwayat perubahan | Semua | Markdown |
| Troubleshooting | Solusi masalah | User + Support | Markdown, FAQ |

### 6.2 Prompt Dokumentasi Teknis

```
## Role
Kamu adalah technical writer senior.

## Task
Buat dokumentasi teknis yang lengkap dan mudah dipahami.

## Input
- Topik: [fitur/sistem/proses]
- Audience: [developer/user/admin]
- Level teknis: [pemula/menengah/advanced]
- Kode sumber: @file atau deskripsi

## Output Structure
1. **Overview** — Apa ini, kenapa penting
2. **Prerequisites** — Yang perlu disiapkan sebelum mulai
3. **Quick Start** — Langkah minimal untuk mulai
4. **Detailed Guide** — Step-by-step lengkap
5. **API Reference** (jika applicable) — Endpoint, parameter, response
6. **Troubleshooting** — Masalah umum + solusi
7. **FAQ** — Pertanyaan yang sering ditanyakan
8. **Changelog** — Riwayat perubahan

## Writing Standards
- Gunakan active voice
- Code block dengan syntax highlighting
- Screenshot/diagram placeholder dimana perlu
- Contoh kode yang runnable
- Link cross-reference antar section
```

### 6.3 Contoh: SOP Administrasi Sekolah

```
Buat SOP (Standard Operating Procedure) untuk:
"Proses Penerimaan Peserta Didik Baru (PPDB) SD Negeri Pasirhalang"

Audience: Panitia PPDB, staff administrasi
Level: Pemula (staff baru bisa mengikuti)

Struktur yang diperlukan:
1. Tujuan SOP
2. Scope dan batasan
3. Persyaratan calon siswa
4. Timeline PPDB (dari pengumuman sampai pengumuman hasil)
5. Prosedur step-by-step:
   a. Pendaftaran online/offline
   b. Verifikasi dokumen
   c. Seleksi (jika ada)
   d. Pengumuman hasil
   e. Daftar ulang
6. Dokumen yang diperlukan (checklist)
7. Contact person untuk pertanyaan
8. Troubleshooting: Masalah umum saat PPDB

Format: Markdown dengan table dan checklist
```

---

## 📖 Bagian 7: Image Generation Prompts

### 7.1 Prompt Engineering untuk AI Image Generator

```
## Formula Prompt Image Generation

[Subject] + [Action/Context] + [Style] + [Lighting] + [Composition] + [Mood] + [Technical Details]

Contoh breakdown:
- Subject: "Seorang guru SD sedang mengajar di kelas"
- Action/Context: "menunjuk papan tulis dengan antusias"
- Style: "illustration, flat design"
- Lighting: "natural light dari jendela"
- Composition: "rule of thirds, medium shot"
- Mood: "warm, inspiring, educational"
- Technical: "high resolution, 16:9 aspect ratio"
```

### 7.2 Prompt Template Image Generation

```
## Role
Kamu adalah prompt engineer untuk AI image generation (Midjourney, DALL-E, Stable Diffusion).

## Task
Buat prompt image generation yang detail dan spesifik.

## Input
- Deskripsi gambar: [apa yang ingin digambar]
- Style: [realistic/illustration/3D/watercolor/dll]
- Use case: [blog header/social media/presentation/dll]
- Aspect ratio: [16:9/1:1/9:16/4:5]

## Output
1. **Primary Prompt** — Prompt lengkap untuk hasil terbaik
2. **Simplified Prompt** — Versi lebih pendek untuk model yang terbatas
3. **Negative Prompt** — Apa yang TIDAK ingin muncul (untuk Stable Diffusion)
4. **Parameter Suggestions** — CFG scale, steps, seed (untuk Advanced users)
5. **Variation Prompts** — 3 alternatif dengan mood/style berbeda
```

### 7.3 Contoh: Gambar untuk Konten Sekolah

```
Buat prompt image generation untuk:
"Header image untuk artikel 'Program Literasi Digital di SD'"

Style: Modern illustration, colorful, educational
Use case: Blog header image
Aspect ratio: 16:9

Elemen yang harus ada:
- Anak-anak SD menggunakan tablet/laptop
- Guru mendampingi
- Classroom setting yang modern
- Warna cerah dan inviting
- Nuansa teknologi + pendidikan

Buat 3 variasi:
1. Warm tone — Kuning, orange, hijau
2. Cool tone — Biru, ungu, teal
3. Neutral tone — Earth tone, natural
```

---

## 📖 Bagian 8: Content Calendar Management

### 8.1 Struktur Content Calendar

```
## Content Calendar Template

| Tanggal | Platform | Jenis Konten | Topik | Status | PIC | Notes |
|---------|----------|--------------|-------|--------|-----|-------|
| 2026-05-01 | Instagram | Carousel | Hari Pendidikan | Draft | Admin | - |
| 2026-05-02 | Facebook | Video | Upacara Hardiknas | Planned | Tim | Butuh footage |
| 2026-05-05 | Blog | Artikel | Tips Belajar di Rumah | Outline | Writer | SEO focus |
| 2026-05-07 | WhatsApp | Broadcast | Info Ujian | Ready | Admin | - |
| 2026-05-10 | TikTok | Video | Behind the Scene Sekolah | Planned | Tim | - |
```

### 8.2 Prompt Content Calendar Generator

```
## Role
Kamu adalah content strategist dan planner.

## Task
Buat content calendar untuk periode tertentu.

## Input
- Periode: [tanggal mulai - tanggal akhir]
- Platform: [daftar platform]
- Frekuensi: [berapa kali per minggu per platform]
- Tema bulanan: [tema utama]
- Event penting: [hari besar, event sekolah, dll]
- Content pillars: [3-5 kategori konten utama]

## Output
1. **Content Calendar Table** — Seperti template di atas
2. **Content Pillar Distribution** — Persentase per kategori
3. **Key Dates Highlight** — Event penting yang harus di-cover
4. **Content Gap Analysis** — Area yang kurang di-cover
5. **Batch Production Plan** — Kelompokkan konten yang bisa dibuat sekaligus
```

### 8.3 Contoh: Content Calendar Sekolah

```
Buat content calendar untuk SD Negeri Pasirhalang:
Periode: Mei - Juni 2026
Platform: Instagram, Facebook, WhatsApp, Blog
Frekuensi: IG 3x/minggu, FB 2x/minggu, WA 1x/minggu, Blog 2x/bulan

Tema bulanan: "Pendidikan Karakter dan Prestasi Siswa"
Content pillars:
1. Prestasi Siswa (25%)
2. Kegiatan Sekolah (25%)
3. Tips untuk Orang Tua (20%)
4. Informasi Administrasi (15%)
5. Profil Guru dan Staff (15%)

Event penting:
- 2 Mei: Hari Pendidikan Nasional
- 15 Mei: Ujian Semester Genap dimulai
- 20 Mei: Peringatan Hari Bakti TNI AU
- 1 Juni: Hari Lahir Pancasila
- 15 Juni: Pembagian rapor

Buat calendar lengkap dengan topik spesifik untuk setiap tanggal.
```

---

## 📖 Bagian 9: Content Repurposing

### 9.1 Repurposing Framework

```
## Satu Konten → Banyak Format

Artikel Blog (1000 kata)
├── Instagram Carousel (5-10 slide)
├── Twitter Thread (7-10 tweets)
├── TikTok/Reels Script (60 detik)
├── Newsletter (500 kata)
├── LinkedIn Post (300 kata)
├── Infographic Prompt (untuk image generation)
└── Podcast Outline (10 menit)
```

### 9.2 Prompt Content Repurposing

```
## Role
Kamu adalah content repurposing specialist.

## Task
Ubah satu konten utama menjadi multiple format untuk berbagai platform.

## Input
- Konten sumber: @blog/[nama-file.md]
- Platform target: [daftar platform]
- Brand voice: [konsisten dengan sumber]

## Output per Platform
1. **Format-specific content** — Sesuai karakteristik platform
2. **Hook/Caption** — Optimasi untuk engagement
3. **Visual suggestion** — Jenis media yang cocok
4. **Hashtag/Tag strategy** — Relevan dengan platform
5. **Cross-linking** — Link ke konten sumber atau platform lain

## Constraints
- Pesan inti tetap sama di semua platform
- Tone konsisten tapi format berbeda
- Setiap platform punya unique value (tidak copy-paste)
- CTA berbeda sesuai platform
```

### 9.3 Contoh: Repurpose Artikel Sekolah

```
Repurpose artikel ini menjadi multiple format:
@blog/program-literasi-digital.md

Konten sumber: Artikel 1000 kata tentang Program Literasi Digital

Platform target:
1. Instagram — Carousel 8 slide (poin-poin visual)
2. Facebook — Post dengan foto kegiatan + ringkasan
3. WhatsApp — Broadcast singkat ke orang tua
4. TikTok — Script 60 detik (behind the scene program)
5. Newsletter — Versi email untuk orang tua
6. LinkedIn — Post profesional tentang inovasi pendidikan

Untuk setiap format:
- Konten lengkap siap posting
- Visual/media suggestion
- Hashtag strategy
- Best time to post
- Expected engagement metric
```

---

## 📖 Bagian 10: Batch Content Creation

### 10.1 Strategi Batch Production

```
## Batch Content Creation Workflow

Phase 1: Planning (Plan mode)
├── Tentukan tema bulanan
├── Buat content calendar
├── Outline semua konten
└── Review dan approve outline

Phase 2: Production (Build mode)
├── Batch 1: Semua blog post (3-4 artikel)
├── Batch 2: Semua social media post (2 minggu)
├── Batch 3: Semua video script (4 video)
└── Batch 4: Newsletter (2 edisi)

Phase 3: Review & Polish
├── Quality check setiap konten
├── SEO optimization
├── Consistency check
└── Final approval
```

### 10.3 Prompt Batch Content Generation

```
## Role
Kamu adalah content production manager.

## Task
Buat batch konten berdasarkan content calendar yang sudah direncanakan.

## Input
- Content calendar: [table atau list]
- Style guide: [tone, format, branding]
- Template: [struktur yang konsisten]

## Output
1. **Batch Production Plan** — Urutan pembuatan yang efisien
2. **Shared Assets** — Elemen yang bisa dipakai ulang (intro, CTA, branding)
3. **Konten per Item** — Draft lengkap setiap konten
4. **Quality Checklist** — Item yang harus dicek sebelum publish

## Efficiency Tips
- Gunakan template yang konsisten
- Batch by type (semua blog, semua sosmed, dll)
- Reuse hooks dan CTA yang sudah terbukti efektif
- Maintain brand voice document
```

---

## 📖 Bagian 11: Content Analytics dan Optimization

### 11.1 Metrik yang Perlu Dilacak

| Platform | Metrik Utama | Metrik Sekunder | Tools |
|----------|--------------|-----------------|-------|
| Blog | Pageviews, Time on page | Bounce rate, Scroll depth | Google Analytics |
| Instagram | Reach, Engagement rate | Saves, Shares, Profile visits | Instagram Insights |
| Facebook | Reach, Engagement | Click-through, Shares | Meta Business Suite |
| TikTok | Views, Completion rate | Likes, Comments, Shares | TikTok Analytics |
| Newsletter | Open rate, Click rate | Unsubscribe rate, Forward rate | Mailchimp/SendGrid |
| WhatsApp | Read rate, Response rate | Forward rate, Block rate | WhatsApp Business |

### 11.2 Prompt Content Analysis

```
## Role
Kamu adalah content analyst dan strategist.

## Task
Analisis performa konten dan berikan rekomendasi optimasi.

## Input
- Data konten: [table dengan metrik]
- Periode: [tanggal]
- Goal: [awareness/engagement/conversion]

## Output
1. **Performance Summary** — Overview metrik utama
2. **Top Performers** — Konten dengan performa terbaik + analisis kenapa
3. **Underperformers** — Konten dengan performa terburuk + analisis kenapa
4. **Pattern Recognition** — Tren yang terlihat (waktu, format, topik)
5. **Actionable Recommendations** — Langkah konkret untuk improvement
6. **Next Content Plan** — Berdasarkan insights, apa yang harus dibuat selanjutnya
```

### 11.3 Contoh: Analisis Konten Sekolah

```
Analisis performa konten SD Negeri Pasirhalang bulan April 2026:

Data:
| Tanggal | Platform | Topik | Reach | Engagement | CTR |
|---------|----------|-------|-------|------------|-----|
| 01-Apr | Instagram | Prestasi Siswa | 2500 | 180 (7.2%) | - |
| 05-Apr | Facebook | Info PPDB | 1800 | 95 (5.3%) | 3.2% |
| 10-Apr | Blog | Tips Belajar | 800 | - | - |
| 15-Apr | WhatsApp | Jadwal Ujian | 450 | 320 (71%) | - |
| 20-Apr | TikTok | Kegiatan Sekolah | 5000 | 400 (8%) | - |
| 25-Apr | Instagram | Profil Guru | 1500 | 90 (6%) | - |

Analisis:
1. Konten mana yang paling efektif dan kenapa?
2. Platform mana yang paling cocok untuk jenis konten tertentu?
3. Pola apa yang terlihat dari data?
4. Rekomendasi untuk bulan Mei?
```

---

## 📋 Magic Prompt Templates

### Template 1: Outline Artikel

```
## Role
Kamu adalah content planner senior, ahli dalam structural thinking.

## Task
Buat framework dan outline artikel berdasarkan topik.

## Input
- Topik: [topik]
- Target pembaca: [profil]
- Tujuan: [edukasi/hiburan/tutorial?]
- Jumlah kata: [angka]
- Tone: [formal/santai/hangat?]

## Output
1. **Posisi Artikel** - Inti dalam 1 kalimat
2. **Struktur** - Tabel: Bagian | Fungsi | Estimasi kata
3. **Poin per Bagian** - Detail setiap section
4. **3 Alternatif Judul**
```

### Template 2: Social Media Multi-Platform

```
## Role
Kamu adalah social media strategist.

## Task
Buat konten untuk semua platform dari satu topik.

## Input
- Topik: [topik]
- Brand voice: [deskripsi]
- CTA: [ajakan]

## Output
Untuk SETIAP platform (IG, FB, Twitter, LinkedIn, TikTok):
1. Caption/Script
2. Hashtags
3. Visual suggestion
4. Best posting time
```

### Template 3: SEO Optimization

```
## Role
Kamu adalah SEO specialist.

## Task
Optimasi artikel untuk mesin pencari.

## Input
- Artikel: @file
- Keyword utama: [keyword]
- Keyword sekunder: [keyword1, keyword2]

## Output
1. SEO Score (A/B/C/D)
2. Meta tags (title + description)
3. Heading structure review
4. Keyword placement suggestions
5. Internal linking strategy
6. Schema markup suggestion
```

### Template 4: Content Repurposing

```
## Role
Kamu adalah content repurposing specialist.

## Task
Ubah satu konten menjadi multi-format.

## Input
- Konten sumber: @file
- Platform target: [daftar]

## Output per platform:
1. Konten siap posting
2. Visual suggestion
3. Hashtag strategy
4. Cross-linking
```

### Template 5: Content Calendar

```
## Role
Kamu adalah content strategist.

## Task
Buat content calendar bulanan.

## Input
- Periode: [bulan/tahun]
- Platform: [daftar]
- Frekuensi: [per platform]
- Tema: [tema bulanan]
- Event: [hari besar, event]

## Output
1. Calendar table lengkap
2. Content pillar distribution
3. Key dates highlight
4. Batch production plan
```

### Template 6: Video Script

```
## Role
Kamu adalah video scriptwriter.

## Task
Buat video script dengan timing dan visual cue.

## Input
- Topik: [topik]
- Platform: [YouTube/TikTok/Reels]
- Durasi: [detik]
- Style: [edukasi/hiburan]

## Output
Table: Timestamp | Visual | Audio | Text Overlay | Notes
```

### Template 7: Newsletter

```
## Role
Kamu adalah email marketing specialist.

## Task
Buat newsletter yang engaging.

## Input
- Topik: [topik]
- Audience: [siapa]
- CTA: [ajakan]

## Output
1. 5 Subject line alternatives
2. Preheader text
3. Full email body
4. CTA button text
5. Plain text version
```

### Template 8: Image Prompt

```
## Role
Kamu adalah prompt engineer untuk AI image generation.

## Task
Buat prompt untuk generate gambar.

## Input
- Deskripsi: [apa yang digambar]
- Style: [style]
- Aspect ratio: [rasio]

## Output
1. Primary prompt
2. Simplified prompt
3. Negative prompt
4. 3 Variations
```

---

## ✅ Checklist Kompetensi

### Workflow Dasar
- [ ] Plan mode untuk构思 selesai
- [ ] Build mode generate file
- [ ] Bisa iterasi file yang sudah ada
- [ ] Style guide konsisten

### Blog dan Artikel
- [ ] Outline terstruktur
- [ ] SEO optimization
- [ ] Meta tags generated
- [ ] Internal linking strategy

### Social Media
- [ ] Platform-specific content
- [ ] Hashtag strategy
- [ ] Visual suggestions
- [ ] Engagement plan

### Video Script
- [ ] Hook kuat di awal
- [ ] Timing dan visual cue
- [ ] CTA natural
- [ ] B-roll suggestions

### Newsletter
- [ ] Subject line A/B test
- [ ] Mobile-friendly format
- [ ] Single CTA focus
- [ ] Personalization tokens

### Dokumentasi
- [ ] Struktur lengkap
- [ ] Code examples runnable
- [ ] Troubleshooting section
- [ ] Cross-references

### Image Generation
- [ ] Prompt detail dan spesifik
- [ ] Multiple variations
- [ ] Negative prompt (jika applicable)
- [ ] Parameter suggestions

### Content Calendar
- [ ] Calendar table lengkap
- [ ] Content pillars defined
- [ ] Key dates highlighted
- [ ] Batch production plan

### Content Repurposing
- [ ] Satu konten → multi-format
- [ ] Platform-specific adaptation
- [ ] Consistent messaging
- [ ] Cross-linking strategy

### Content Analytics
- [ ] Metrik terdefinisi
- [ ] Performance analysis
- [ ] Pattern recognition
- [ ] Actionable recommendations

---

## ⚠️ Pitfalls dan Cara Menghindarinya

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| AI langsung nulis panjang tanpa struktur | Tidak构思 dulu | Plan mode dulu |
| Revisi makin berantakan | Tidak berdasarkan outline | Kembali ke outline |
| Style tidak konsisten | Tidak fix style | Simpan style di AGENTS.md |
| SEO score rendah | Keyword tidak natural | AI optimize placement |
| Konten terlalu generic | Prompt tidak spesifik | Tambahkan konteks detail |
| Repurposing copy-paste | Tidak adaptasi per platform | Format-specific prompt |
| Content calendar tidak realistis | Frekuensi terlalu tinggi | Sesuaikan dengan capacity |
| Analytics tidak actionable | Data tanpa insight | Minta pattern recognition |
| Image prompt hasil tidak sesuai | Prompt terlalu vague | Tambahkan style, lighting, composition |
| Newsletter open rate rendah | Subject line lemah | Generate 5+ alternatif, A/B test |

### Pitfall Terbesar: Konten Tanpa Strategi

AI bisa generate konten dalam hitungan menit. Tapi konten tanpa strategi tidak akan efektif. Selalu:

1. **Tentukan tujuan** sebelum menulis (awareness? engagement? conversion?)
2. **Kenali audience** — siapa yang baca, apa yang mereka butuhkan
3. **Plan dulu** — outline, calendar, content pillars
4. **Konsisten** — brand voice, posting schedule, quality standard
5. **Ukur dan optimasi** — track metrik, adjust strategy berdasarkan data

---

## 📝 Ringkasan

### Workflow Inti

1. **3 tahap**: 构思 → Output → Iterasi
2. **Plan mode** untuk构思, Build mode untuk output
3. **`@filename`** untuk revisi konten existing
4. **Template prompt** untuk konsistensi dan efisiensi

### Prinsip Utama

- **Plan before write** — Outline dulu, konten mengikuti
- **Platform matters** — Setiap platform punya karakteristik unik
- **Repurpose smartly** — Satu konten, banyak format, bukan copy-paste
- **SEO is essential** — Optimasi dari awal, bukan afterthought
- **Measure and improve** — Data-driven content strategy
- **Batch production** — Efisiensi waktu dengan membuat konten sekaligus

### Prompt Engineering Tips

- **Spesifik** — Semakin detail prompt, semakin relevan output
- **Kontekstual** — Sertakan audience, tujuan, brand voice
- **Struktur** — Gunakan template untuk konsistensi
- **Iteratif** — Draft → Review → Polish → Publish
- **Data-driven** — Gunakan analytics untuk improve prompt

---

> **Modul selanjutnya**: [A2: Development Daily](./02-development-daily.md) — Workflow pengembangan harian dengan AI assistance.
