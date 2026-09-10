## 23. VIBE ENGINEERING: EVOLUSI DARI VIBE CODING

> **💬 Bayangkan ini:** Anda suka memasak dengan bebas — tanpa resep, ikut feeling. Di awal, masakan Anda enak dan cepat. Tapi setelah beberapa bulan, masakan mulai tidak konsisten, bahan terbuang, dan Anda lupa apa yang sudah dibuat. **Vibe Engineering** adalah cara memasak yang tetap kreatif, tapi dengan catatan resep yang rapi agar hasilnya konsisten.

### 23.1 Apa Itu Vibe Engineering? (Penjelasan untuk Pemula)

```
PERBANDINGAN 3 PENDAKATAN:
═══════════════════════════════════════════════════════════════

1. VIBE CODING (2025)
   Analogi: Memasak tanpa resep
   ├── Anda deskripsikan ke AI: "Buatkan toko online"
   ├── AI langsung menulis kode
   ├── Anda coba → ada error → koreksi
   ├── AI perbaiki → coba lagi → error lagi
   └── Loop sampai "kelihatannya" berfungsi

   Kelebihan: SANGAT CEPAT untuk mulai!
   Kekurangan: 3-6 bulan lagi → berantakan!

2. STRUCTURED METHOD / ARCHITECT-BUILDER (Metode di materi ini)
   Analogi: Memasak dengan resep lengkap
   ├── Buat resep dulu (requirements)
   ├── Buat daftar belanja (blueprint)
   ├── Masak step by step (implementation)
   ├── Cicip dan koreksi (testing)
   └── Sajikan ke meja (deployment)

   Kelebihan: HASIL KONSISTEN, SIAP PRODUCTION!
   Kekurangan: Lebih lambat di awal.

3. VIBE ENGINEERING (2026 - Pendekatan Baru!)
   Analogi: Memasak bebas di awal, lalu CATAT resepnya
   ├── Masak bebas tanpa resep (eksplorasi)
   ├── Temukan resep yang enak (formalisasi)
   ├── Tulis resepnya dengan rapi (living spec)
   ├── Masak pakai resep itu (implementasi)
   └── Sajikan ke meja (deployment)

   Kelebihan: CEPAT di awal + RAPI untuk production!
   Kekurangan: Perlu disiplin transisi.
```

**Intinya:** Vibe Engineering menggabungkan yang terbaik dari kedua dunia:
- **Kecepatan** vibe coding di awal (eksplorasi)
- **Disiplin** structured method untuk production

> **💡 Dari riset Augment Code (2026):**
> *"Vibe coding delivers discovery speed; SDD delivers production durability. The three-month wall is real, requirements drift is measurable, and the synthesis is structured exploration with living specs."*

### 23.2 Dinding 3 Bulan: Mengapa Vibe Coding Tidak Bertahan

Ini adalah **fenomena nyata** yang dialami hampir semua vibe coder. Mari kita pahami:

```
POLA DECAY VIBE CODING:
═══════════════════════════════════════════════════════════════

BULAN 1-3: EUPHORIA (Keceriaan) 😄
─────────────────────────────────
Anda: "Wah, AI bisa buat aplikasi dalam sehari!"
├── ✅ Fitur baru ship dengan cepat
├── ✅ Semua terasa mudah
├── ✅ Teman-teman kagum
└── ⚠️ TAPI: Anda tidak mencatat keputusan!
    ⚠️ TAPI: Anda tidak menulis test!
    ⚠️ TAPI: Kode tidak terstruktur!

BULAN 4-9: PLATEAU (Datar) 😐
─────────────────────────────
Anda: "Kok error-nya makin banyak ya..."
├── ⚠️ Bug yang diperbaiki justru memecah fitur lain
├── ⚠️ AI mulai "lupa" instruksi awal
├── ⚠️ Kode duplikat di mana-mana
├── ⚠️ Waktu fix bug > waktu buat fitur baru
└── ⚠️ Codebase mulai sulit dipahami

BULAN 10-15: DECLINE (Penurunan) 😰
────────────────────────────────────
Anda: "Kenapa fitur baru butuh waktu berminggu-minggu?"
├── ❌ Setiap fitur baru → harus debug 3 fitur lama
├── ❌ Kode duplikat naik 8x lipat!
├── ❌ Refactoring activity turun 60%
├── ❌ Anda tidak pahami kode Anda sendiri!
└── ❌ AI juga bingung dengan kode yang berantakan

BULAN 16-18: STALL (Mandek) 🚫
───────────────────────────────
Anda: "Saya harus mulai dari nol lagi..."
├── 🚫 Delivery berhenti total
├── 🚫 Rewrite menjadi satu-satunya opsi
└── 🚫 Semua investasi waktu sebelumnya TERBUANG
```

**Mengapa Ini Terjadi?**

```
ANALOGI: MEMBANGUN RUMAH TANPA DENAH
═══════════════════════════════════════════════════════════════

Bulan 1: Anda bilang ke tukang "Bangun rumah 2 lantai"
├── Tukang bangun sesuai tebakan
├── Rumah kelihatan bagus dari luar
└── TAPI: tidak ada denah, tidak ada struktur

Bulan 3: Anda minta tambah kamar mandi
├── Tukang tambah kamar mandi di mana saja
├── Listrik jadi kacau
└── Pipa air bocor

Bulan 6: Anda minta tambah dapur
├── Dapur harusnya dekat kamar mandi (untuk pipa air)
├── TAPI kamar mandi sudah di tempat yang salah
├── Harus bongkar dulu → biaya besar
└── Rumah jadi berantakan

Bulan 12: Anda sadar harus BONGKAR TOTAL
└── Semua yang dibangun 12 bulan lalu TERBUANG

───

ITU PERSIS APA YANG TERJADI DENGAN VIBE CODING!
Tanpa denah (system design) dan catatan (documentation),
proyek akan COLLAPSE setelah beberapa bulan.
```

> **💡 Dari riset GitClear (211 juta baris kode):**
> *"Code duplication increased ~48% since 2021. Copy-pasted lines exceeded refactored lines for the first time in 2024. Models generate self-contained snippets rather than discovering existing abstractions."*
>
> Artinya: AI cenderung membuat kode yang **terisolasi** dan **berulang** — bukan kode yang **terstruktur** dan **reusable**.

> **💡 Dari Addy Osmani (Chrome Engineering Lead, Google):**
> *"Vibe coding is not the same as AI-assisted engineering. The consensus from leaders is that vibe coding puts critical software qualities at risk: security, clarity, maintainability, and team knowledge."*

### 23.3 Kapan Harus Transisi? (Tanda-tanda yang Harus Anda Waspadai)

Jangan menunggu sampai bulan 12! **Transisi SEGERA** saat Anda melihat tanda-tanda ini:

```
TANDA-TANDA ANDA HARUS BERPINDAH KE STRUCTURED METHOD:
═══════════════════════════════════════════════════════════════

🟡 TANDA 1: CONTEXT DRIFT (Konteks Terpengaruh)
──────────────────────────────────────────────────
Gejala:
├── AI memperbaiki 1 bug, tapi MEMECAH 3 file lain
├── Anda harus koreksi AI lebih dari 2 kali untuk hal SAMA
└── AI mulai "lupa" instruksi yang sudah Anda berikan

Contoh nyata:
Anda: "Tambahkan kolom 'telepon' di form registrasi"
AI: [menambah kolom telepon] TAPI [menghapus validasi email]!
Anda: "Eh, kok validasi email hilang?"
AI: [memperbaiki validasi] TAPI [mengubah warna button]!
→ INI=context drift! AI tidak bisa melihat big picture.

Solusi: Mulai pakai architect pack + acceptance criteria.

───

🟡 TANDA 2: REGRESSION PATTERNS (Bug Berulang)
──────────────────────────────────────────────────
Gejala:
├── Fitur yang sudah benar, jadi error lagi
├── Bug yang sama muncul berulang kali
└── Anda merasa "sudah pernah fix ini"

Contoh nyata:
Bulan 1: Login berhasil → Deploy
Bulan 2: Login error "Cannot read property 'email'"
Bulan 3: Login berhasil lagi → Deploy
Bulan 4: Login error "Cannot read property 'email'" LAGI!
→ INI=regression! Tidak ada test yang mencegah.

Solusi: Tulis test! Minimal test untuk fitur kritis.

───

🟡 TANDA 3: TEAM EXPANSION (Tim Bertambah)
──────────────────────────────────────────────────
Gejala:
├── Ada orang baru yang harus memahami codebase
├── Orang baru bertanya: "Kenapa kodenya begini?"
└── Tidak ada dokumentasi yang menjelaskan

Contoh nyata:
Anda: "Oh, yang ini... ya... intinya gitu deh..."
→ Anda sendiri juga tidak ingat kenapa menulis kode begitu!

Solusi: Buat folder system + documentation.

───

🟡 TANDA 4: PRODUCTION INTENT (Siap Dipakai User)
──────────────────────────────────────────────────
Gejala:
├── User/client sudah menunggu aplikasi Anda
├── Bisnis process akan bergantung pada sistem
└── Jika error → ada dampak finansial/reputasi

Contoh nyata:
Klien: "Kapan aplikasinya selesai? Sudah 2 bulan..."
Anda: "Sebentar, masih ada bug..."
→ Jika dipakai user, error = DSA PUBLIK!

Solusi: Full Architect-Builder method + production checklist.

───

🟡 TANDA 5: SCOPE MELEBIHI 10 FITUR
──────────────────────────────────────
Gejala:
├── Proyek sudah punya > 10 fitur
├── Satu chat AI sudah terlalu panjang
└── AI mulai "bingung" dengan codebase

Contoh nyata:
Chat AI sudah 200+ message
Anda: "Buatkan fitur baru..."
AI: "Maaf, saya tidak bisa menemukan file yang Anda maksuk"
→ Context window sudah penuh!

Solusi: Mulai pakai sprint-based development.

───

🟡 TANDA 6: AI LOOP (AI Terjebak)
───────────────────────────────────
Gejala:
├── AI mengoreksi error yang SAMA lebih dari 2 kali
├── AI membuat perubahan yang tidak relevan
└── Anda sudah 10 menit koreksi tapi belum selesai

Contoh nyata:
Anda: "Fix error di line 42"
AI: [fix line 42] TAPI [error di line 87]
Anda: "Fix error di line 87"
AI: [fix line 87] TAPI [error di line 42 LAGI!]
→ AI terjebak dalam loop!

Solusi: /clear lalu buat prompt baru yang lebih spesifik.
```

### 23.4 Hybrid Workflow: Best of Both Worlds (Step-by-Step)

Berikut **alur kerja hybrid** yang bisa langsung Anda praktikkan:

```
HYBRID WORKFLOW: 5 TAHAP
═══════════════════════════════════════════════════════════════

TAHAP 1: VIBE EXPLORATION (Hari 1-2)
──────────────────────────────────────
Tujuan: Eksplorasi ide dengan BEBAS tanpa tekanan

Cara:
1. Buka ChatGPT/Claude
2. Deskripsikan ide Anda secara bebas:
   "Saya ingin membuat [deskripsi aplikasi]"
   "Masalah yang ingin diselesaikan: [masalah]"
   "Pengguna: [siapa]"
3. AI generate prototype cepat
4. Coba prototype-nya
5. Catat apa yang WORKS dan apa yang TIDAK

Yang Anda dapatkan:
├── Prototype yang bisa dilihat
├── Pemahaman awal tentang requirements
├── Tahu fitur mana yang sudah jelas
└── Tahu pertanyaan yang masih terbuka

Contoh output:
"Prototype toko online sudah jadi.
 Fitur yang sudah jelas:
 - Daftar produk ✓
 - Keranjang belanja ✓
 - Checkout (belum jelas cara pembayarannya)
 Pertanyaan: Bayar via apa? Transfer? QRIS? Kartu?"

───

TAHAP 2: FORMALIZATION TRIGGER (Hari 2-3)
──────────────────────────────────────────
Tujuan: Putuskan kapan harus berpindah ke structured method

Tanyakan diri Anda:
□ Apakah prototype ini akan dipakai user sungguhan?
□ Apakah ada lebih dari 1 fitur yang sudah jelas?
□ Apakah Anda sudah mulai "bingung" dengan kode yang ada?
□ Apakah ada open questions yang perlu dijawab?

Jika jawabannya YA untuk 2 atau lebih pertanyaan:
→ SAATNYA BERPINDAH KE STRUCTURED METHOD!

Yang Anda lakukan:
1. Buat folder proyek dengan struktur scaffold
   (lihat Bagian 6 materi ini)
2. Buat file-file dasar:
   ├── STATE.MD (status proyek)
   ├── DECISIONS.MD (keputusan yang sudah dibuat)
   ├── DOMAIN.MD (konteks bisnis)
   └── AGENTS.MD (aturan untuk AI)
3. Jawab pertanyaan-pertanyaan yang masih terbuka

Yang Anda dapatkan:
├── Foundation yang rapi untuk proyek
├── Semua keputusan terdokumentasi
└── Siap untuk sprint-based development

───

TAHAP 3: LIVING SPEC CREATION (Hari 3-5)
──────────────────────────────────────────
Tujuan: Buat "resep masak" yang bisa diikuti AI

Cara:
1. Buka Architect AI (ChatGPT/Claude Project)
2. Upload prototype + findings dari Tahap 1
3. Minta Architect buat:
   ├── Requirements.MD (apa yang harus dibangun)
   ├── Blueprint.MD (bagaimana cara membangunnya)
   ├── Acceptance.MD (kriteria "sudah selesai")
   └── Handoff-Prompt.MD (prompt untuk Builder)
4. Save di folder planning/sprints/sprint-001/

Yang Anda dapatkan:
├── Architect Pack lengkap untuk Sprint 1
├── Rencana yang bisa di-review
└── Prompt yang siap di-paste ke Builder

───

TAHAP 4: ITERATE WITHIN SPEC (Hari 5+)
─────────────────────────────────────────
Tujuan: Bangun aplikasi secara terstruktur

Cara (ulangi untuk setiap sprint):
1. Buka Builder AI (Claude Code/Codex)
2. Paste prompt dari Handoff-Prompt.MD
3. Builder dry run → Anda review
4. Builder coding → Anda review
5. Builder test → Anda review hasil
6. Update STATE.MD
7. Buat Architect Pack untuk sprint berikutnya
8. Ulangi!

Yang Anda dapatkan:
├── Fitur baru setiap sprint
├── Kode yang terstruktur dan terdokumentasi
├── Test yang berfungsi
└── Aplikasi yang siap production

───

TAHAP 5: PRODUCTION LAUNCH (Kapan saja siap)
──────────────────────────────────────────────
Tujuan: Deploy ke production dengan aman

Cara:
1. Centang Production Readiness Checklist (Bagian 22)
2. Deploy frontend ke Vercel
3. Deploy backend ke Railway
4. Deploy database ke Supabase
5. Aktifkan monitoring (Sentry + UptimeRobot)
6. Test dari browser yang berbeda
7. 🎉 Aplikasi LIVE!

Yang Anda dapatkan:
├── Aplikasi yang bisa diakses dari internet
├── Monitoring aktif
├── Siap untuk user sungguhan
└── Dibangun dengan cara yang BENAR! 🎉
```

### 23.5 Kapan Tetap Vibe Coding? Kapan Pindah?

```
DECISION MATRIX:
═══════════════════════════════════════════════════════════════

TETAP VIBE CODING JIKA:
────────────────────────
✅ Prototype / MVP yang tidak akan dipakai lama
✅ Personal automation script (cron job, scraper)
✅ Learning exercise / tutorial project
✅ Hackathon project (< 1 minggu)
✅ "Home-cooked software" (hanya untuk Anda)
✅ Eksplorasi ide sebelum commit ke project besar

Berapa lama? Biasanya 1-2 minggu. Setelah itu, review:
"Apakah ini akan jadi project serius?"
Jika YA → transisi ke Structured Method.

───

PINDAH KE STRUCTURED METHOD JIKA:
─────────────────────────────────
🟡 Aplikasi akan dipakai user sungguhan
🟡 Tim lebih dari 1 orang
🟡 Fitur sudah > 10
🟡 Ada requirement yang berubah-ubah
🟡 AI mulai "bingung" (context drift)
🟡 Bug yang sama berulang (regression)

Berapa lama transisi? 1-2 hari untuk setup foundation.
Setelah itu, workflow tetap sama dengan vibe coding
TAPI dengan arsitektur yang rapi.

───

GUNAKAN FULL ARCHITECT-BUILDER METHOD JIKA:
─────────────────────────────────────────────
🔴 Proyek untuk klien / bisnis
🔴 Tim > 3 orang
🔴 Deadline yang ketat
🔴 Compliance / regulasi harus dipenuhi
🔴 Aplikasi menangani data sensitif
🔴 Butuh maintenance jangka panjang (> 1 tahun)
```

> **💡 Pesan Penting:**
> **Tidak ada yang salah dengan vibe coding!** Andrej Karpathy sendiri bilang vibe coding cocok untuk "throwaway weekend projects." Masalahnya adalah ketika vibe coding dipakai untuk project yang **seharusnya** production-ready.
>
> **Vibe Engineering** adalah jawabannya: mulai dengan bebas (vibe coding), lalu formalisasi saat project mulai serius (structured method). Ini adalah practice yang **emerging** di tahun 2026 dan menjadi standar baru untuk developer yang ingin cepat TAPI tetap berkualitas.
```

---

