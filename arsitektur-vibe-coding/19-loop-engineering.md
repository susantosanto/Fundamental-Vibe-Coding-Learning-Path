# 🔁 Modul 19: Loop Engineering — Workflow Vibe Coding Profesional

> **Loop engineering = cara kerja profesional: dari ide jadi aplikasi dengan 6 fase berulang (loop), semua dibantu AI.**
> Waktu: ~4-5 jam | Level: 🟡🔴 | Lanjutan dari: Semua modul (1-18) | Konsep dasar: SDLC & DevOps Loop (IBM)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu loop engineering & vibe coding
✅ 6 fase loop: Brainstorming → Planning → PRD → Desain UI → Implementasi → Testing
✅ Kenapa "loop" (berulang), bukan garis lurus
✅ Peran AI di setiap fase
✅ Template dokumen: PRD, task list, desain, test plan
```

> 🎯 **Ini "jembatan" antara semua yang sudah Anda pelajari.**
> Modul 1-9: arsitektur. Modul 10-15: tech stack. Modul 16-18:
> network & server. Sekarang: CARA mengelola proyek penuh
> seperti developer profesional.

---

## 🧠 19.1 APA ITU LOOP ENGINEERING & VIBE CODING?

### Vibe Coding

```text
VIBE CODING = membangun aplikasi dengan AI sebagai "tukang utama"
              Anda = sutradara yang memberi arah & vibe.

Bukan "prompt sekali jadi". Bukan juga "semua manual".
Tapi: ANDA desain arah → AI tulis kode → Anda review → ulangi.
```

### Loop Engineering (sumber: IBM)

```text
LOOP ENGINEERING = merancang siklus kerja BERULANG di mana AI
bekerja secara iteratif: menulis kode → menguji → mengevaluasi
error → memperbaiki → sampai tujuan tercapai.

Bukan waterfall (garis lurus sekali jalan), tapi LOOP
(siklus yang terus berputar & membaik).
```

### Perbedaan Kunci

```text
GARIS LURUS (waterfall kuno):        LOOP (modern):
Desain → kode → tes → jadi           ┌─────────────────┐
            │                        │ Brainstorming   │
            ▼                        ▼                 │
        (kalau error,              Planning            │
         mulai dari awal!)              │              │
                                    PRD                │
                                        │              │
                                    Desain UI          │
                                        │              │
                                    Implementasi       │
                                        │              │
                                    Testing ──(ada bug?)──┘
                                        │
                                        ▼
                                    Deploy (Modul 18)

LOOP: setiap fase bisa KEMBALI ke fase sebelumnya.
Testing menemukan bug → kembali ke implementasi. Itu normal!
```

> 💡 **Anda sebenarnya sudah melakukan loop ini** — di Modul 8
> (proyek) Anda "denah dulu, kode belakangan, tes tiap langkah".
> Sekarang kita FORMAL-kan & lengkapi dengan dokumen.

---

## 🧠 19.2 PETA 6 FASE LOOP ENGINEERING

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   FASE 1: BRAINSTORMING    → IDE                            │
│   "Aplikasi apa? Untuk siapa? Kenapa?"                      │
│   Output: ide & kebutuhan (belum detail)                    │
│                                                             │
│   FASE 2: PLANNING         → RENCANA                        │
│   "Fitur apa saja? Urutan kerja? Tech stack?"               │
│   Output: task list & prioritas (MUST/SHOULD/NICE)          │
│                                                             │
│   FASE 3: PRD              → SPESIFIKASI                    │
│   "Detail tiap fitur + data + alur"                         │
│   Output: dokumen PRD (sumber kebenaran)                    │
│                                                             │
│   FASE 4: DESAIN UI        → TAMPILAN                       │
│   "Bagaimana tampilan & alur pengguna?"                     │
│   Output: wireframe → mockup → prototype                    │
│                                                             │
│   FASE 5: IMPLEMENTASI     → KODE                           │
│   "Tulis kode per task, tes per langkah"                    │
│   Output: aplikasi yang jalan                                │
│                                                             │
│   FASE 6: TESTING          → VERIFIKASI                     │
│   "Apakah sesuai PRD? Ada bug?"                             │
│   Output: daftar bug & perbaikan → KEMBALI ke fase 5        │
│                                                             │
│   ── lalu: DEPLOY (Modul 18) & mulai loop lagi ──          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> 🎯 **Ingat aturan emas dari Modul 1:** *"Anda arsitek, AI tukang."*
> Di semua fase, AI membantu — tapi arah & keputusan tetap Anda.

---

## 🧠 19.3 FASE 1: BRAINSTORMING (MENCARI IDE)

### Apa Itu?

```text
BRAINSTORMING = fase eksplorasi ide seluas-luasnya, belum
disaring. Tujuannya menghasilkan BANYAK ide dulu, baru
dirampingkan.

Pola pikir: DIVERGENT (melebar) → CONVERGENT (menyempit)
(sumber: Digital.gov HCD)
```

### Teknik Brainstorming

```text
1. TULIS SEMUA IDE (jangan disaring dulu!)
   → "aplikasi absensi", "aplikasi keuangan", "aplikasi perpustakaan"...

2. PERTANYAKAN SETIAP IDE:
   - Masalah apa yang diselesaikan?
   - Siapa penggunanya?
   - Apa bedanya dengan yang sudah ada?

3. RAMPINGKAN (convergent):
   - Mana yang paling menarik?
   - Mana yang paling realistis untuk dibuat?
   - Mana yang paling mungkin dipakai orang?
```

### Template Brainstorming dengan AI

```text
Saya ingin membuat aplikasi untuk [sekolah / usaha / pribadi].

BRAINSTORMING — jangan menulis kode!

1. Usulkan 10 ide aplikasi yang mungkin (kreatif, jangan saring)
2. Untuk tiap ide, jawab singkat:
   - Masalah apa yang diselesaikan?
   - Siapa penggunanya?
   - Butuh database? Butuh login?
3. Bantu saya menyempitkan ke 1-3 ide terbaik dengan alasan

Gaya: antusias, kreatif, bahasa sederhana.
```

### Latihan Cepat

```text
☐ Tulis 5 ide aplikasi sendiri (apa pun!)
☐ Pilih 1 yang paling menarik
☐ Minta AI brainstorming 10 ide dari ide Anda itu
☐ Pilih final: SATU aplikasi untuk dikerjakan
```

---

## 🧠 19.4 FASE 2: PLANNING (MERENCANAKAN)

### Apa Itu?

```text
PLANNING = menerjemahkan ide menjadi RENCANA KERJA.
Fitur apa yang wajib? Urutan kerja apa? Tech stack apa?

Ini yang menghubungkan "mau apa" (PRD) dengan "gimana bikin"
(task list teknis).
```

### Teknik Prioritas: MUST / SHOULD / NICE (dari Modul 7)

```text
MUST HAVE     → wajib, tanpa ini aplikasi tidak jalan
SHOULD HAVE   → penting, tapi bisa menyusul
NICE TO HAVE  → bagus kalau ada, tapi bisa ditunda
```

### Output Planning: Task List

```text
📋 TASK LIST APLIKASI PERPUSTAKAAN
┌────┬──────────────────────────────────┬─────────┐
│ #  │ Task                             │ Prioritas│
├────┼──────────────────────────────────┼─────────┤
│ 1  │ Setup proyek + database          │ MUST    │
│ 2  │ API CRUD buku                    │ MUST    │
│ 3  │ API pinjam/kembali               │ MUST    │
│ 4  │ Halaman dashboard                │ MUST    │
│ 5  │ Pencarian buku                   │ SHOULD  │
│ 6  │ Login guru & siswa               │ SHOULD  │
│ 7  │ Laporan Excel                    │ NICE    │
└────┴──────────────────────────────────┴─────────┘

URUTAN KERJA: 1 → 2 → 3 → 4 → (5) → (6) → (7)
```

### Template Prompt Planning

```text
Saya mau membangun aplikasi [nama] dengan ide:
[tempel hasil brainstorming]

JANGAN menulis kode. Bantu saya PLANNING:

1. Pecah menjadi task list dengan format:
   | # | Task | Prioritas (MUST/SHOULD/NICE) | Estimasi |
2. Urutkan task dari yang paling sederhana dulu
3. Tech stack yang saya sudah pelajari: [Next.js / Express / Laravel, SQLite/PostgreSQL]
   → rekomendasikan kombinasi yang paling sesuai
4. Tunjukkan DAG/skema: task mana yang tergantung task mana

Fokus: rencana yang bisa dikerjakan bertahap.
```

---

## 🧠 19.5 FASE 3: PRD (SPESIFIKASI PRODUK)

### Apa Itu PRD?

```text
PRD (Product Requirements Document) = dokumen "sumber kebenaran"
yang menjelaskan APA yang dibangun dan MENGAPA.
(sumber: Atlassian)

Bedanya dengan planning:
- PLANNING = urutan kerja & prioritas
- PRD      = DETAIL setiap fitur (data, alur, aturan)
```

### Struktur PRD (adaptasi standar Atlassian)

```markdown
# PRD: Aplikasi Perpustakaan Sekolah

## 1. LATAR BELAKANG
Perpustakaan sekolah masih pakai buku catatan manual.
Sulit mencari buku, sering kehilangan jejak peminjaman.

## 2. TUJUAN & METRIK
- Tujuan: memudahkan pencatatan buku & peminjaman
- Metrik sukses: tidak ada buku hilang tercatat (100% akurat)

## 3. PENGGUNA (PERSONA)
- Pustakawan: kelola buku, catat pinjam/kembali
- Guru/Siswa: cari buku, lihat stok

## 4. FITUR (USER STORIES)
- "Sebagai pustakawan, saya ingin menambah buku agar stok tercatat"
- "Sebagai pustakawan, saya ingin mencatat peminjaman agar tahu
   buku siapa dan kapan dikembalikan"

## 5. DATA (ENTITAS)
- Buku → id, judul, penulis, kategori, stok
- Peminjaman → id, buku_id, nama_peminjam, tanggal_pinjam, tanggal_kembali

## 6. ALUR
INPUT:  pustakawan isi form tambah buku → klik Simpan
PROSES: API simpan ke database
OUTPUT: daftar buku tampil dengan stok terbaru

## 7. LUAR CAKUPAN (OUT OF SCOPE)
- Laporan Excel (nanti)
- Foto sampul buku (nanti)
```

> 🎯 **PRD = "denah" yang Anda buat di Modul 1, tapi versi
> LENGKAP dan TERTULIS.** Ini yang mencegah aplikasi "melenceng"
> selama dikerjakan.

### Template Prompt PRD

```text
Buatkan PRD untuk aplikasi [nama] berdasarkan:
[tempel hasil brainstorming + planning]

Ikuti struktur:
1. Latar belakang
2. Tujuan & metrik sukses
3. Pengguna/persona
4. Fitur (user stories)
5. Data/entitas (+ contoh 3-5 data dummy)
6. Alur (INPUT-PROSES-OUTPUT per fitur)
7. Luar cakupan (yang ditunda)

Jangan menulis kode. Dokumen PRD saja. Setelah selesai,
tanyakan: "Apakah ada yang mau Anda tambahkan/ubah?"
```

---

## 🧠 19.6 FASE 4: DESAIN UI (VIBE DESIGN)

### Apa Itu?

```text
DESAIN UI = menentukan TAMPILAN & ALUR pengguna SEBELUM kode.
Tiga level: wireframe → mockup → prototype
(sumber: Figma Resource Library)
```

### Tiga Level Desain

| Level | Apa itu | Fokus | Bisa diklik? |
|-------|---------|-------|--------------|
| **Wireframe** | Sketsa kasar hitam-putih | Struktur & tata letak | ❌ |
| **Mockup** | Desain visual lengkap (warna, font) | Estetika & branding | ❌ |
| **Prototype** | Model interaktif | Alur & pengalaman user | ✅ |

### Untuk Vibe Coding (Ringkas)

```text
Untuk proyek belajar, TIDAK perlu Figma rumit.
Cukup 2 hal:

1. SKETSA (wireframe): di kertas / catatan / minta AI gambar ASCII
2. DESKRIPSI UI: jelaskan ke AI dalam kata-kata

┌─────────────────────────────┐
│  SKETSA DASHBOARD           │
│  ┌───┐ ┌───┐ ┌───┐         │
│  │ 3 │ │ 5 │ │ 2 │  ← kartu │
│  │buku│ │stok│ │pinjam│      │
│  └───┘ └───┘ └───┘         │
│  [Form tambah buku]         │
│  ┌────────────┬───────────┐ │
│  │ Tabel buku │ Aksi      │ │
│  └────────────┴───────────┘ │
└─────────────────────────────┘
```

### Template Prompt Desain UI

```text
Desain UI untuk aplikasi [nama] — JANGAN tulis kode dulu.

1. Buatkan wireframe ASCII untuk halaman-halaman ini:
   [daftar halaman: dashboard, form tambah, daftar, detail]
2. Untuk tiap halaman, jelaskan:
   - Elemen apa saja (judul, form, tombol, tabel)
   - Urutan visual (apa yang paling menonjol)
3. Saran desain: warna, font, tata letak yang sesuai
   dengan [sekolah/modern/minimalis]

SETELAH saya setujui desain ini, baru lanjut ke kode.
```

> 💡 **Mau bikin UI sungguhan di browser?** Minta AI bantu:
> "Buatkan mockup HTML satu halaman (tanpa logika) untuk halaman
> ini agar saya bisa melihat desainnya di browser." — ini cara
> cepat melihat desain tanpa harus install Figma.

---

## 🧠 19.7 FASE 5: IMPLEMENTASI (MENULIS KODE)

### Aturan Utama

```text
1. KERJAKAN PER TASK (dari planning) — bukan semua sekaligus
2. TES SETIAP TASK sebelum lanjut (ini kunci loop!)
3. DENAH/PRD DULU, kode belakangan (Modul 1, diingatkan terus)
4. Minta AI jelaskan rencana → setujui → baru kode
```

### Pola Per Task

```text
LANGKAH 1: "Baca PRD & task #3. Buat API CRUD buku.
            Jelaskan rencanamu dulu."

LANGKAH 2: (setelah setuju) "Oke, tulis kodenya."

LANGKAH 3: "Tes endpoint dengan curl. Perlihatkan hasilnya."

LANGKAH 4: "Kalau error: [tempel]. Perbaiki & jelaskan."

→ Task selesai → lanjut task berikutnya
```

### Peran AI di Setiap Sub-Langkah

| Sub-langkah | Yang AI lakukan |
|-------------|-----------------|
| Struktur | Buat komponen/file per task |
| Data | Tulis schema/model/migrasi |
| Logika | Tulis handler, validasi |
| Style | Tailwind/CSS sesuai desain |
| Debug | Baca error, perbaiki, jelaskan |

---

## 🧠 19.8 FASE 6: TESTING (MENJAGA KUALITAS)

### Mengapa Testing?

```text
Testing bukan "tambahan" — ini bagian dari LOOP.
Tanpa testing: bug menumpuk, aplikasi rusak diam-diam.
Dengan testing: setiap perubahan terverifikasi.

Jenis testing (sumber: Atlassian):
1. MANUAL TEST   → Anda coba langsung di browser
2. UNIT TEST     → tes fungsi/komponen kecil (Jest/Vitest)
3. INTEGRATION   → tes antar modul (frontend + API + database)
4. E2E           → tes alur penuh pengguna (Playwright)
```

### Testing untuk Vibe Coder (prioritas)

```text
1. MANUAL TEST (WAJIB, selalu):      coba sendiri tiap fitur
2. UNIT TEST (sebaiknya):            untuk logika penting
3. E2E (untuk proyek besar):         alur login → pakai → logout

Untuk proyek belajar, mulailah dari MANUAL + minta AI
membuatkan test sederhana.
```

### Template Prompt Testing

```text
Buatkan test untuk aplikasi [nama] saya.

1. TES MANUAL: buatkan checklist langkah demi langkah
   yang harus saya coba di browser (berdasarkan PRD)
2. UNIT TEST: buatkan [Jest/Vitest] test untuk fungsi
   [fungsi penting, mis. hitungTotal]
3. INTEGRATION TEST: buatkan test untuk API [endpoint]
   (pastikan: response benar, status code benar)

Jangan tulis semua sekaligus — per bagian, jelaskan dulu.
```

### Checklist Manual Test (contoh)

```text
☐ Buka halaman utama → tampil tanpa error
☐ Tambah buku → muncul di daftar
☐ Refresh halaman → data masih ada (tersimpan di database)
☐ Hapus buku → hilang dari daftar
☐ Input kosong → muncul pesan error
☐ Halaman tidak ada → tampil 404
☐ Cek di HP (responsive) → tampilan tidak rusak
```

---

## 🧠 19.9 LOOP DALAM PRAKTIK: CONTOH PENUH

Bayangkan Anda membuat aplikasi **absensi sekolah**:

```text
FASE 1 BRAINSTORMING
  Ide: "absensi manual sering hilang, mau yang digital"
  → Pilih: aplikasi absensi sederhana

FASE 2 PLANNING
  MUST: CRUD siswa, absen harian, rekap bulanan
  SHOULD: filter per kelas
  NICE: export Excel
  Tech stack: Next.js + SQLite (awal)

FASE 3 PRD
  Dokumen lengkap: fitur, data (siswa, absen), alur, out of scope

FASE 4 DESAIN UI
  Wireframe: daftar siswa + tombol "Hadir/Sakit/Izin" per baris
  → Setujui → minta AI buat mockup HTML preview

FASE 5 IMPLEMENTASI (per task!)
  Task 1: setup proyek + database → TES ✅
  Task 2: CRUD siswa → TES ✅
  Task 3: API absen → TES ✅
  Task 4: halaman absen → TES ✅

FASE 6 TESTING
  Manual: klik semua fitur → TEMUKAN BUG:
  "Absen dobel saat tombol diklik 2x"
  → KEMBALI ke FASE 5 (perbaiki + tambah validasi) → TES ulang ✅

DEPLOY (Modul 18) → ONLINE! 🎉
LOOP LAGI: dapat feedback guru → tambah fitur filter kelas
```

> 🎯 **Lihat polanya?** Setiap fase saling terhubung, dan bug
> membuat Anda "berputar" kembali. Itu BUKAN kegagalan —
> itu LOOP ENGINEERING yang bekerja!

---

## 🤖 19.10 TEMPLATE PROMPT LENGKAP LOOP (Satu Sesi)

Gunakan prompt "kapten" ini untuk memulai proyek baru:

```text
Kamu adalah partner pengembangan aplikasi (vibe coding) saya.
Kita akan membangun [nama aplikasi] bersama.

IKUTI LOOP INI, jangan pernah menulis kode sebelum fase
Desain UI disetujui:

FASE 1 — Brainstorming:
  Bantu saya eksplorasi ide & kebutuhan (10 ide → 1 pilihan)

FASE 2 — Planning:
  Task list dengan prioritas MUST/SHOULD/NICE + urutan kerja

FASE 3 — PRD:
  Dokumen lengkap (latar belakang, pengguna, fitur, data, alur,
  out of scope)

FASE 4 — Desain UI:
  Wireframe ASCII + deskripsi visual tiap halaman

FASE 5 — Implementasi:
  Kerjakan SATU task → tes → minta persetujuan → lanjut

FASE 6 — Testing:
  Checklist manual + unit test untuk logika penting

SETIAP FASE: jelaskan ringkas → tanya persetujuan saya → lanjut.
Jangan melompat ke kode sebelum saya setuju.
```

---

## 🏗️ 19.11 PRAKTIK

### Latihan 1: Loop Mini (2 jam)

```text
Pilih SATU ide aplikasi SEDERHANA (bukan dari modul sebelumnya,
mis. "daftar menu kantin" atau "catatan inventaris kelas").

Kerjakan 6 fase dalam 1 sesi:
1. Brainstorming (10 ide → 1)
2. Planning (task list)
3. PRD (dokumen lengkap)
4. Desain UI (wireframe)
5. Implementasi (1-2 task inti saja)
6. Testing (checklist manual)

Simpan semua dokumen di folder proyek Anda:
proyek-latihan/
├── 01-brainstorming.md
├── 02-planning.md
├── 03-prd.md
├── 04-desain-ui.md
└── 05-test-checklist.md
```

### Latihan 2: Review Dokumen (30 menit)

```text
Minta AI review dokumen PRD Anda:
"Review PRD ini. Apakah ada:
1. Fitur yang tidak jelas? (jelas = bisa langsung dikerjakan)
2. Data yang kurang lengkap?
3. Fitur yang sebaiknya ditunda (out of scope)?
Beri saran perbaikan."

Perbaiki PRD berdasarkan review.
```

### Latihan 3: Refleksi (15 menit)

```text
Jawab:
1. Fase mana yang paling Anda nikmati? Kenapa?
2. Fase mana yang paling sulit? Kenapa?
3. Apa bedanya loop engineering dengan "minta AI langsung bikin"?
4. Mana yang biasanya Anda lewatkan? (banyak orang: testing!)
```

---

## 🧠 19.12 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Fase | Output | Pertanyaan kunci |
|------|--------|------------------|
| **Brainstorming** | Ide & pilihan | "Mau buat apa? Untuk siapa?" |
| **Planning** | Task list + prioritas | "Fitur apa? Urutan apa?" |
| **PRD** | Dokumen spesifikasi | "Detail tiap fitur?" |
| **Desain UI** | Wireframe → mockup | "Tampilannya bagaimana?" |
| **Implementasi** | Kode per task | "Satu task → tes → lanjut" |
| **Testing** | Checklist + perbaikan | "Sesuai PRD? Ada bug?" |

### Checklist

```
☐ Paham perbedaan loop vs garis lurus
☐ Bisa brainstorm dengan AI (divergent → convergent)
☐ Bisa buat task list MUST/SHOULD/NICE
☐ Bisa buat PRD lengkap
☐ Bisa buat wireframe ASCII & deskripsi UI
☐ Implementasi per task dengan tes tiap langkah
☐ Bisa membuat checklist manual test
☐ Pernah menjalankan 1 loop penuh (Latihan 1)
```

### Ketika Bingung

```text
❓ "Loop-nya panjang sekali, capek"
   → Fase tidak harus berjam-jam. Brainstorming bisa 15 menit,
     planning 15 menit, PRD 30 menit. Seimbangkan.

❓ "PRD terlalu detail"
   → Mulai dari PRD 1 halaman. Lengkapi saat perlu.
     Lebih baik ada PRD singkat daripada tidak ada.

❓ "AI langsung menulis kode padahal saya minta planning"
   → Tegaskan: "JANGAN menulis kode sebelum saya setujui desain.
     Jawab sesuai fase yang saya minta saja."

❓ "Tidak tahu mulai dari mana"
   → Mulai dari Latihan 1 (loop mini). Satu ide kecil.
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **Proyek Akhir** jika sudah bisa:

```
☐ Menjalankan 6 fase loop engineering
☐ Membuat PRD sendiri
☐ Implementasi per task dengan testing
☐ Paham peran AI di setiap fase
```

> **Sekarang waktunya ujian terbesar:** gabungkan SEMUA —
> arsitektur, tech stack, network, server, loop engineering —
> dalam SATU proyek: **Modul 20: Proyek Akhir**!

---

**📂 Lanjut ke: `20-proyek-akhir.md`**
