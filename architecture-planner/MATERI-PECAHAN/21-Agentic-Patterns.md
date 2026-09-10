## 21. AGENTIC PATTERNS & AI AGENT WORKFLOW

> **💬 Bayangkan ini:** Anda punya asisten pribadi yang tidak hanya menjawab pertanyaan, tapi bisa **mengerjakan tugas sendiri** — membaca email, membuat janji, memperbaiki jadwal, bahkan menelepon vendor. Itulah bedanya **chatbot biasa** dengan **AI Agent**.

### 21.1 Apa Itu Agentic System? (Penjelasan Super Sederhana)

**Chatbot biasa** = seperti punya kamus pintar. Anda tanya, dia jawab. Selesai.

**AI Agent** = seperti punya karyawan yang bisa **bekerja sendiri** — membaca, berpikir, bertindak, memperbaiki kesalahan, dan melaporkan hasil.

```
PERBANDINGAN NYATA:
═══════════════════════════════════════════════════════════════

ASISTEN BIASA (Chatbot):
─────────────────────
Anda: "Buatkan saya fitur login"
AI: [menulis kode login] → Kirim ke Anda → Selesai

Anda HARUS:
├── Copy-paste kode ke project
├── Jalankan test sendiri
├── Jika error, Anda yang debug
├── Jika perlu file lain, Anda yang beritahu AI
└── Anda yang deploy

───

ASISTEN PINTAR (AI Agent):
─────────────────────────
Anda: "Buatkan saya fitur login"
AI: [melakukan SEMUA ini sendiri!]
├── 📖 Membaca project Anda (file apa saja yang ada)
├── 📋 Merencanakan langkah implementasi
├── ✍️ Menulis kode login
├── 🧪 Menjalankan test otomatis
├── 🔧 Jika test gagal → MEMPERBAIKI KODE SENDIRI
├── 🧪 Menjalankan test ulang
├── 🧹 Menjalankan linting (cek kode rapi)
├── 📊 Melaporkan hasil dengan bukti
└── ✅ Selesai — Anda tinggal review!

→ ANDA HANYA PERLU MEREVIEW, BUKAN MENGERJAKAN!
```

> **💡 Dari Anthropic (Desember 2024):**
> *"Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems."*

**Analogi Sederhana:**
- **Chatbot** seperti tukang yang hanya kasih resep masakan — Anda harus masak sendiri.
- **AI Agent** seperti tukang yang masak sendiri, cicip sendiri, koreksi sendiri, dan sajikan ke meja Anda.

### 21.2 Mengapa Vibe Coder PERLU Memahami Agentic Patterns?

**Jawaban singkatnya:** Semua tool yang Anda pakai sehari-hari (Claude Code, Codex, Cursor) **sudah menggunakan pola-pola ini**. Memahami polanya = Anda bisa mengarahkan AI dengan lebih efektif.

**Contoh Nyata:**
```
Tanpa memahami agentic patterns:
Anda: "Buatkan fitur login"
AI: [membuat kode yang salah]
Anda: "Eh, yang tadi salah"
AI: [membuat kode yang benar tapi melupakan hal lain]
Anda: "Eh, yang itu juga salah"
→ LOOP TANPA AKHIR! 😫

Dengan memahami agentic patterns:
Anda: "Buatkan fitur login. Gunakan JWT. 
       Test dengan email valid & invalid. 
       Jika test gagal, perbaiki sendiri."
AI: [membuat kode → test → perbaiki → test lagi → selesai]
→ SELESAI DALAM 1 STEP! 🎉
```

### 21.3 6 Pola Agentic yang PALING Penting untuk Vibe Coder

Dari 12+ pola agentic yang ada, berikut **6 pola yang paling sering Anda gunakan** — dijelaskan dengan bahasa sehari-hari:

```
═══════════════════════════════════════════════════════════════
POLA 1: 🔁 REFLECTION (AI Mengevaluasi Dirinya Sendiri)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan Anda menulis surat lamaran kerja:
1. Anda tulis draft pertama
2. Anda baca ulang → "Hmm, ada typo"
3. Anda perbaiki → "Hmm, kalimat ini kurang jelas"
4. Anda perbaiki lagi → "Oke, sudah bagus!"

Itulah REFLECTION — AI melakukan hal yang sama!

CONTOH DALAM VIBE CODING:
AI menulis kode fitur login
   → AI menjalankan test
   → Test GAGAL
   → AI BERPIKIR: "Kenapa gagal? Ah, saya lupa import module"
   → AI memperbaiki kode
   → AI menjalankan test lagi
   → Test PASS! ✅

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Buatkan fitur login. Setelah selesai, JALANKAN test.
 Jika ada error, PERBAIKI sendiri tanpa saya minta."

→ AI akan otomatis menulis kode, test, dan memperbaiki
   errornya sendiri — tanpa Anda perlu bolak-balik koreksi!

═══════════════════════════════════════════════════════════════
POLA 2: 🛠️ TOOL USE (AI Memanggil Alat Bantu)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan koki yang tidak hanya bisa masak, tapi juga:
├── Membaca resep dari buku (membaca file)
├── Menimbang bahan (menjalankan command)
├── Mencari info nutrisi di internet (search web)
├── Menggunakan oven, blender, dll ( menjalankan tools)
└── Merekam proses masak (logging)

AI Agent juga bisa "memanggil alat bantu"!

CONTOH DALAM VIBE CODING:
AI bisa:
├── 📖 Membaca file di project Anda (read file)
├── ✍️ Menulis file baru atau mengubah yang ada (write file)
├── 🖥️ Menjalankan command di terminal (run command)
├── 🧪 Menjalankan test (npm test)
├── 📦 Install package baru (npm install)
├── 🔍 Mencari di codebase (code search)
└── 🌐 Mencari informasi di web (web search)

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Baca file src/auth/login.js, pahami strukturnya,
 lalu buat fitur OAuth di file baru src/auth/oauth.js"

→ AI akan MEMBACA file yang ada, MEMAHAMI strukturnya,
   lalu MENULIS kode yang KONSISTEN dengan kode yang sudah ada.

═══════════════════════════════════════════════════════════════
POLA 3: 📋 PLANNING (AI Merencanakan Langkah)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan Anda mau bangun rumah:
1. Arsitek merencanakan: fondasi → dinding → atap → interior
2. Tukang eksekusi: fondasi dulu, baru dinding, baru atap
3. Tidak mungkin atap dulu baru fondasi!

AI juga bisa merencanakan sebelum menulis kode!

CONTOH DALAM VIBE CODING:
Anda: "Buatkan fitur keranjang belanja"

AI (dengan Planning):
"Oke, saya akan:
1. Buat model Cart di database
2. Buat API GET /api/cart (lihat isi keranjang)
3. Buat API POST /api/cart/items (tambah item)
4. Buat API DELETE /api/cart/items/:id (hapus item)
5. Buat API PUT /api/cart/items/:id (update jumlah)
6. Tulis test untuk setiap API
7. Update dokumentasi

Apakah rencana ini sudah benar?"

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Buatkan fitur [nama fitur]. TAPI JANGAN LANGSUNG CODING!
 Buat dulu RENCANA implementasi-nya. Saya review dulu."

→ AI akan membuat rencana dulu, Anda approve,
   baru AI eksekusi. Hasilnya lebih akurat!

═══════════════════════════════════════════════════════════════
POLA 4: 🔗 PROMPT CHAINING (Satu Output = Input Berikutnya)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan pabrik sepatu:
1. Bahan mentah → Dipotong → 2. Potongan dijahit →
3. Sepatu jadi → Dikemas → 4. Dikirim ke toko

Setiap tahap HASILNYA menjadi BAHAN untuk tahap berikutnya.

CONTOH DALAM VIBE CODING:
Step 1: AI membuat Requirements.MD
   ↓ (output = input step 2)
Step 2: AI membuat Blueprint.MD berdasarkan Requirements
   ↓ (output = input step 3)
Step 3: AI membuat kode berdasarkan Blueprint
   ↓ (output = input step 4)
Step 4: AI membuat test berdasarkan kode
   ↓ (output = input step 5)
Step 5: AI menjalankan test dan melaporkan hasil

→ Inilah yang terjadi dalam Architect-Builder Method!
   Requirements → Blueprint → Code → Test → Deploy

═══════════════════════════════════════════════════════════════
POLA 5: 👤 HUMAN-IN-THE-LOOP (Manusia Tetap Mengontrol!)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan autopilot di pesawat:
├── Pesawat bisa terbang sendiri (AI bekerja)
├── Tapi pilot TETAP MEMANTAU (Anda review)
├── Jika ada masalah, pilot ambil alih (Anda approve)
└── Pilot tidak tidur selama penerbangan (Anda tetap kontrol)

POLA INI ADALAH YANG PALING PENTING!

CONTOH DALAM VIBE CODING:
AI selesai menulis kode fitur baru
   → ANDA review kode tersebut
   → ANDA approve atau minta perubahan
   → BARU deploy ke production

TANPA Human-in-the-Loop:
AI menulis kode → AI deploy sendiri → Error production!
→ Anda tidak tahu apa yang terjadi!

DENGAN Human-in-the-Loop:
AI menulis kode → ANDA review → ANDA approve → Deploy aman!
→ Anda tetap punya kontrol penuh!

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Katakan ke AI:
"Buatkan fitur [nama]. TAPI JANGAN deploy!
 Hanya buat kode dan test-nya saja.
 Saya review dulu sebelum deploy."

→ AI akan menulis kode TANPA deploy.
   Anda review, approve, baru deploy manual.

═══════════════════════════════════════════════════════════════
POLA 6: 🏗️ ORCHESTRATOR-WORKERS (Satu Pengawas, Banyak Pekerja)
═══════════════════════════════════════════════════════════════

ANALOGI:
Bayangkan manajer restoran:
├── Manajer (Orchestrator): Menerima pesanan, menugaskan
├── Koki Indonesia (Worker 1): Masak nasi goreng
├── Koki Jepang (Worker 2): Masak sushi
├── Pelayan (Worker 3): Antarkan ke meja
└── Manajer mengkoordinasi semua pekerja!

Dalam Architect-Builder Method:
├── Architect = Orchestrator (mengkoordinasi)
├── Builder = Worker 1 (menulis kode)
├── Tester = Worker 2 (menjalankan test)
└── Reviewer = Worker 3 (review kode)

BAGAIMANA ANDA MEMANFAATKAN POLA INI:
Anda bertindak sebagai "manajer" yang mengkoordinasi:
1. Bertanya ke Architect (LLM) tentang rencana
2. Menugaskan Builder (Claude Code/Codex) untuk coding
3. Menugaskan Tester untuk testing
4. Review semua hasilnya
5. Approve atau minta perubahan

→ ANDA adalah Orchestrator-nya!
   AI tools adalah Worker-nya!
```

### 21.4 Pola Tambahan yang Perlu Diketahui

Selain 6 pola utama di atas, ada beberapa pola tambahan yang sudah Anda gunakan tanpa sadar:

```
POLA TAMBAHAN:
═══════════════════════════════════════════════════════════════

7. 🧠 CONTEXT ENGINEERING
   Analogi: Membawa catatan saat rapat
   Anda tidak bisa ingat SEMUA hal dari rapat kemarin.
   Anda tulis catatan penting dan bawa saat rapat berikutnya.
   
   Dalam vibe coding:
   STATE.MD = Catatan status proyek
   DECISIONS.MD = Catatan keputusan
   Folder system = Gudang catatan lengkap
   
   AI yang BAIK membaca catatan ini sebelum bekerja.

8. ⛔ BOUNDED EXECUTION (Batas Eksekusi)
   Analogi: Timer saat ujian
   Anda punya 2 jam untuk ujian. Jika belum selesai,
   Anda harus serahkan apa yang ada.
   
   Dalam vibe coding:
   AI juga harus punya BATAS.
   Jika AI sudah loop > 3 kali memperbaiki error yang sama,
   → STOP! Mulai ulang dengan pendekatan baru.
   
   Tips: Gunakan /clear jika AI sudah "bingung".

9. 🛡️ GUARDRAIL (Pengaman)
   Analogi: Pagar di jembatan
   Pagar tidak menghalangi Anda berjalan,
   tapi MENCEGAH Anda jatuh ke jurang.
   
   Dalam vibe coding:
   ├── AGENTS.MD = Aturan yang harus diikuti AI
   ├── Acceptance criteria = Batas "apa yang benar"
   ├── Code review = Pengaman sebelum deploy
   └── Test cases = Pengaman jika ada regression

10. 💾 MEMORY (Ingatan)
    Analogi: Otak manusia
    ├── Short-term memory = Apa yang sedang saya kerjakan
    │   → STATE.MD dalam metode ini
    ├── Long-term memory = Pengetahuan yang sudah saya miliki
    │   → Folder system dalam metode ini
    └── Episodic memory = Pengalaman masa lalu
        → DECISIONS.MD dalam metode ini
```

### 21.5 Peta: Pola Agentic × Architect-Builder Method

**Kabar baiknya:** Metode Architect-Builder yang sudah Anda pelajari di Bagian 1-18 **SUDAH mengadopsi semua pola agentic ini** secara natural!

```
BAGAIMANA SETIAP POLA TEREKSPLIKASI:
═══════════════════════════════════════════════════════════════

Pola Agentic           │ Di Mana dalam Metode Ini?
───────────────────────┼─────────────────────────────────────
🔄 Reflection          │ Architect review hasil Builder
🛠️ Tool Use            │ Builder menjalankan test, build, lint
📋 Planning            │ Architect membuat sprint plan
🔗 Prompt Chaining     │ Requirements → Blueprint → Code
👤 Human-in-the-Loop   │ ANDA approve sebelum deploy
🏗️ Orchestrator-Workers│ Architect (orch) → Builder (worker)
🧠 Context Engineering │ Folder system (STATE.MD, dll)
⛔ Bounded Execution   │ Scope sprint dibatasi
🛡️ Guardrail           │ AGENTS.MD + Acceptance criteria
💾 Memory              │ DECISIONS.MD + git log

→ Metode Architect-Builder SUDAH mengadopsi
  SEMUA pola agentic yang dibutuhkan untuk production!
```

### 21.6 Workflow Agentic untuk Vibe Coder: Step-by-Step

Berikut **alur kerja lengkap** bagaimana AI Agent bekerja dalam konteks vibe coding:

```
WORKFLOW AGENTIC UNTUK VIBE CODER:
═══════════════════════════════════════════════════════════════

TAHAP 1: EKSPLORASI (Anda + Architect AI)
──────────────────────────────────────────
Anda: "Saya ingin menambahkan fitur X"
Architect AI:
├── 📖 Membaca project Anda (Tool Use)
├── 🧠 Mengerti konteks yang ada (Context Engineering)
├── ❓ Mengajukan pertanyaan klarifikasi
├── 📋 Membuat rencana implementasi (Planning)
└── 📄 Menghasilkan: Architect Pack

TAHAP 2: HANDOFF (Anda → Builder AI)
──────────────────────────────────────
Anda:
├── Menyimpan Architect Pack di folder
├── Membuka Builder AI (Claude Code/Codex)
├── Menyuruh Builder membaca Architect Pack
└── Builder: "Oke, saya paham. Ini rencana saya..."

TAHAP 3: IMPLEMENTASI (Builder AI)
───────────────────────────────────
Builder AI:
├── 📖 Membaca file yang relevan (Tool Use)
├── ✍️ Menulis kode baru (Tool Use)
├── 🧪 Menjalankan test (Tool Use)
├── 🔁 Jika test gagal → Perbaiki (Reflection)
├── 🧪 Test ulang (Reflection)
├── 🧹 Linting (Tool Use)
└── 📊 Melaporkan hasil dengan bukti

TAHAP 4: VERIFICATION (Anda + AI Reviewer)
───────────────────────────────────────────
Anda:
├── Review kode yang dihasilkan (Human-in-the-Loop)
├── Minta AI reviewer untuk second opinion (Evaluator-Optimizer)
├── Jika ada masalah → Minta Builder perbaiki (Reflection)
└── Approve jika sudah sesuai

TAHAP 5: DEPLOYMENT (Anda + CI/CD)
────────────────────────────────────
Anda:
├── Push ke GitHub
├── CI/CD otomatis jalankan test
├── Jika test pass → Auto-deploy (Tool Use)
├── Monitoring aktif (Tool Use)
└── 🎉 Fitur baru live!

TAHAP 6: DOCUMENTATION (Architect AI)
───────────────────────────────────────
Architect AI:
├── Update STATE.MD
├── Update DECISIONS.MD
├── Update dokumentasi yang terpengaruh
└── Siap untuk sprint berikutnya!
```

> **💡 Pesan Penting dari MIT Sloan (2026):**
> *"Agentic AI integrates with other software systems to complete tasks independently or with minimal human supervision. The agentic AI age is already here — we have agents deployed at scale in the economy to perform all kinds of tasks."*
>
> Artinya: AI Agent bukan lagi konsep masa depan. Ini sudah terjadi SEKARANG, dan Anda sudah menggunakannya setiap hari lewat Claude Code, Codex, dan Cursor!

---

