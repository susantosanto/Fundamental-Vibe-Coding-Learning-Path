# 01 — Peta Materi Lengkap

> **Fungsi:** daftar semua materi di repo ini, dikelompokkan berdasarkan **tujuan**, bukan berdasarkan folder.
>
> **Cara pakai:** cari tujuan Anda di kolom kiri, lalu baca kolom "kapan dibaca".

Repo ini punya **244 file markdown**. Dikelompokkan jadi 9 blok di bawah.

---

## Ringkasan: 9 blok materi

| # | Blok | File | Pertanyaan yang dijawab |
|---|---|---|---|
| A | Fondasi & Peta | 18 | "Saya harus mulai dari mana?" |
| B | Arsitektur — konsep | 22 | "Bagaimana sistem besar dirancang?" |
| C | Arsitektur — terapan | 24 | "Bagaimana menerapkannya di proyek saya?" |
| D | Metode kerja (Architect-Builder) | 30 | "Bagaimana cara kerja saya dengan AI?" |
| E | AI tooling & agent | 21 | "Bagaimana memakai AI tool dengan benar?" |
| F | Prompting | 15 | "Bagaimana menulis prompt yang menghasilkan kode bagus?" |
| G | Debugging & kualitas | 20 | "Kode saya rusak / jelek. Bagaimana memperbaikinya?" |
| H | Produksi & operasional | 26 | "Aplikasi saya sudah dipakai orang. Bagaimana menjaganya?" |
| I | Referensi & pelacakan | 8 | "Saya lupa istilahnya / di mana saya tadi?" |

---

## A. Fondasi & Peta (18 file) — `fase-0-peta-belajar/`

**Pertanyaan:** "Saya harus mulai dari mana?"

| File | Isi | Kapan dibaca |
|---|---|---|
| `00-MULAI-DARI-SINI.md` | Pintu masuk, router 3 pertanyaan | **Pertama kali** |
| `01-peta-materi-lengkap.md` | File ini | Saat bingung mencari materi |
| `02-diagnostik-dan-jalur.md` | 12 pertanyaan → jalur personal | Sebelum mulai serius |
| `03-cara-belajar-fondasi.md` | Metode belajar: deliberate practice | Sebelum mulai serius |
| `04-jalur-arsitektur-desain.md` | Jalur arsitektur + celah yang ditambal | Saat masuk arsitektur |
| `05-jalur-debugging-dan-fix-error.md` | Index jalur debugging | Saat masuk debugging |
| `debugging/01` … `debugging/08` | 8 file fondasi debugging | Lihat blok G |
| `arsitektur/01` … `arsitektur/04` | 4 file keputusan arsitektur | Lihat blok C |

**Catatan:** blok ini adalah lapisan orientasi. Setelah Anda tahu arah, Anda akan lebih banyak menghabiskan waktu di blok B–H.

---

## B. Arsitektur — konsep (22 file) — `fase-1-arsitektur-dasar/`

**Pertanyaan:** "Bagaimana sistem besar dirancang?"

Durasi: ~6 minggu @ 1 jam/hari. Sumber: `donnemartin/system-design-primer` + `ashishps1/awesome-system-design-resources`.

| Minggu | File | Topik |
|---|---|---|
| 1 | 01–05 | System design, performance vs scalability, latency vs throughput, CAP theorem, pola konsistensi |
| 2 | 06–10 | Availability patterns, DNS, CDN, load balancer, reverse proxy |
| 3 | 11–14 | Application layer & microservices, RDBMS, NoSQL, cache |
| 4 | 15–17 | Asynchronism, protokol komunikasi, keamanan sistem |
| 5 | 18–20 | Studi kasus: Pastebin/Bit.ly, Twitter timeline, web crawler |
| 6 | 21 | Ringkasan + latihan final |

**Struktur tiap file:** 📖 TEORI → 🎯 CONTOH NYATA → 💡 PRAKTIK → ✅ CHECKLIST → 🔗 REFERENSI

**Kapan dibaca:** setelah fondasi. Ini blok teori paling padat — jangan dibaca sambil melakukan hal lain.

---

## C. Arsitektur — terapan (24 + 4 file)

**Pertanyaan:** "Bagaimana menerapkannya di proyek saya?"

### C1. `arsitektur-vibe-coding/` (24 file)

| Kelompok | File | Isi |
|---|---|---|
| Dasar | 01–02 | "Arsitektur itu gampang", peta aplikasi modern |
| Struktur | 03–05 | Struktur folder Next.js, komponen & props, state & data flow |
| Data & API | 06, 16, 17 | API & database, networking, API design |
| Trade-off | 07 | Trade-off untuk pemula ← **baca ini sebelum 08** |
| Proyek | 08, 20 | Proyek semi-kompleks, proyek akhir |
| Per-stack | 10–15 | React, Node.js, Next.js, Laravel, SQLite, PostgreSQL |
| Infrastruktur | 18 | VPS & server |
| Lanjutan | 19, 21, 22, 23 | Loop engineering, prompting engineering, arsitektur desain sistem, arsitektur integrasi AI |
| Referensi | `cheat-sheet-prompt.md` | Prompt siap pakai |

**Kapan dibaca:** saat Anda **sudah** mulai membangun proyek nyata. Blok ini menjawab "bagaimana menata", bukan "apa itu".

### C2. `fase-0-peta-belajar/arsitektur/` (4 file) — **MATERI BARU**

| File | Isi | Celah yang ditambal |
|---|---|---|
| `01-berpikir-arsitektur.md` | Arsitektur sebagai pengambilan keputusan, bukan menggambar diagram | Fase 1 mengajarkan *komponen*, tidak mengajarkan *cara memilih* |
| `02-trade-off-dan-adr.md` | Analisis trade-off + template ADR | Tidak ada di fase mana pun |
| `03-dari-kebutuhan-ke-desain.md` | Metode: kebutuhan → kualitas → komponen → alur → mode gagal | Tidak ada di fase mana pun |
| `04-review-dan-latihan-arsitektur.md` | Checklist review + 6 latihan desain + rubrik | Tidak ada di fase mana pun |

**Kapan dibaca:** setelah `fase-1-arsitektur-dasar/` selesai. Blok ini melengkapi konsep dengan praktik keputusan.

---

## D. Metode kerja — Architect-Builder Method (30 file)

**Pertanyaan:** "Bagaimana cara kerja saya dengan AI?"

**Lokasi:** `architecture-planner/MATERI-PECAHAN/`

Ini **metode inti repo ini**. Kalau Anda hanya punya waktu untuk satu blok, baca blok ini.

| Bab | Topik | Prioritas |
|---|---|---|
| 00 | Header + Index | Orientasi |
| 01 | Mengapa vibe coding gagal | 🔴 Baca dulu |
| 02 | Konsep inti Architect-Builder | 🔴 Baca dulu |
| 03 | Tiga pilar metode | 🔴 Baca dulu |
| 04 | Analogi membangun rumah | 🟡 Membantu pemahaman |
| 05 | Persiapan sebelum memulai | 🔴 Baca dulu |
| 06 | Struktur folder proyek | 🔴 Baca dulu |
| 07 | Penjelasan detail setiap file | 🔴 Baca dulu |
| 08 | Workflow lengkap 6 tahap | 🔴 Baca dulu |
| 09 | Context engineering | 🟠 Penting |
| 10 | Sprint-based development | 🟠 Penting |
| 11 | Cara menulis prompt | 🟠 Penting |
| 12 | Sistem verifikasi & review | 🟠 Penting |
| 13 | Keamanan & dependency check | 🟡 Sesuai kebutuhan |
| 14 | Manajemen session AI | 🟠 Penting |
| 15 | Tools & teknologi | 🟡 Referensi |
| 16 | Tips praktis & best practices | 🟡 Referensi |
| 17 | Kesalahan umum | 🟠 Baca sebelum proyek pertama |
| 18 | Contoh kasus nyata | 🟡 Referensi |
| 19 | Glosarium lengkap | 🟡 Referensi |
| 20 | System design & architecture | 🟠 Penting |
| 21 | Agentic patterns | 🟠 Penting |
| 22 | Standar production-ready | 🟠 Penting |
| 23 | Vibe engineering | 🟡 Lanjutan |
| 24 | Referensi & sumber | 🟡 Referensi |
| 25 | Skill lengkap & workflow | 🟠 Penting |
| 26 | Riset referensi GitHub skill | 🟡 Referensi |
| 27 | **Panduan end-to-end semua skill** | 🔴 Baca setelah 08 |
| +2 | `RISET-Harness-Engineering-…`, `RENCANA-Menutup-Gap-…` | 🟡 Dokumen riset |

**Cara membaca blok ini:** 01→08 berurutan (itu inti metodenya). Setelah itu bebas.

---

## E. AI tooling & agent (21 file)

**Pertanyaan:** "Bagaimana memakai AI tool dengan benar?"

| Folder | File | Isi |
|---|---|---|
| `fase-2-ai-tools-dasar/` | 11 | Apa itu Claude Code, setup, CLAUDE.md, skills, slash commands, agents, hooks, git+AI, testing/debugging |
| `fase-6-advanced-opencode/` | 10 | Konfigurasi, agent quickstart, agent design patterns, skill dasar, custom commands, MCP, IDE integration, debugging tools, panduan lanjut |
| `panduan-prinsip-claude-code/` | 9 | 5 prinsip Anthropic: prompt skills bukan Claude, skills > prompt, composable vs throwaway, skills semakin pintar, format output adalah prompt |

⚠️ **Peringatan:** `fase-6-advanced-opencode/` **belum lengkap** — nomor file bolong (01, 03, 04, 07, 10, 14, 17, 22, 23). Materi 02, 05, 06, 08, 09, 11–13, 15–16, 18–21 belum ada.

**Kapan dibaca:** fase 2 bisa dibaca paralel dengan fase 1 kalau Anda sudah memakai AI tool sehari-hari. Fase 6 hanya setelah fase 2 & 3.

---

## F. Prompting (15 file)

**Pertanyaan:** "Bagaimana menulis prompt yang menghasilkan kode bagus?"

| Folder | File | Isi |
|---|---|---|
| `prompting-fundamental/` | 6 fase + 2 HTML + proyek | Fase 1 prompting dasar → 2 teknik → 3 dari prompt ke kode → 4 logika arsitektur → 5 membangun aplikasi → 6 aplikasi semi-kompleks |
| `vibecoding/02-panduan-prompt-engineering.md` | 1 | Prompt engineering untuk vibe coding |
| `architecture-planner/MATERI-PECAHAN/11` | 1 | Cara menulis prompt (versi metode) |
| `panduan-prinsip-claude-code/*` | 9 | Prinsip di balik prompt yang baik |

**Dua latihan interaktif:** `latihan-prompt-interaktif.html` dan `latihan-sistem-desain.html` — buka di browser, bukan dibaca sebagai teks.

**Kapan dibaca:** paralel dengan fase 2. Jangan menunggu sampai "mahir prompting" untuk mulai membangun — prompting justru diasah dengan membangun.

---

## G. Debugging & kualitas (20 file) ← **blok paling timpang**

**Pertanyaan:** "Kode saya rusak / jelek. Bagaimana memperbaikinya?"

### G1. Yang sudah ada (12 file) — tersebar, tidak berjenjang

| File | Isi | Kelemahan |
|---|---|---|
| `fase-2-ai-tools-dasar/09-testing-debugging-ai.md` | Testing pyramid, TDD, generate test, analisis error, stack trace, 5 pola bug, CI | Berorientasi **"cara minta AI"**, bukan "cara Anda sendiri" |
| `fase-3-advanced-workflows/04-testing-debugging-lanjut.md` | Testing & debugging tingkat lanjut | Belum diverifikasi isinya |
| `fase-6-advanced-opencode/22-debugging-tools.md` | Tool debugging di OpenCode | Spesifik tool |
| `fase-5-scenario-praktis/04-refactoring-testing.md` | Refactoring & testing harian | Skenario, bukan fondasi |
| `vibecoding/03-panduan-quality-assurance.md` | QA dalam alur vibe coding | Proses, bukan teknik |
| `skills-vendor/systematic-debugging/` | Skill debugging sistematis | Format skill agent, bukan materi belajar |
| `skills-vendor/debugging-and-error-recovery/` | Skill pemulihan error | Sama — untuk agent, bukan untuk Anda |
| `skills-vendor/observability-and-instrumentation/` | Instrumentasi & observability | Sama |
| `fase-4-deep-system-design/07-observability-monitoring.md` | Observability skala sistem | Level lanjut, bukan debugging harian |
| `vibecoding/11-panduan-runbook.md` | Runbook operasional | Operasional, bukan debugging |
| `vibecoding/12-panduan-respons-insiden.md` | Respons insiden | Setelah aplikasi live |
| `vibecoding/14-panduan-prosedur-pemulihan.md` | Prosedur pemulihan | Setelah aplikasi live |

**Diagnosis:** materi debugging yang ada menjawab *"bagaimana AI membantu saya debug"* dan *"apa yang dilakukan kalau server mati"*. Yang **tidak ada**: *"bagaimana saya, manusia, menyelidiki sebuah bug secara sistematis."* Tidak ada fondasi mental model, tidak ada latihan berjenjang.

### G2. Yang baru (8 file) — `fase-0-peta-belajar/debugging/`

| File | Isi | Menambal |
|---|---|---|
| `01-mental-model-debugging.md` | Bug = selisih model mental vs kenyataan; 3 mode gagal pemula; siklus debugging | Tidak ada fondasi |
| `02-membaca-error-dan-stack-trace.md` | Anatomi error, membaca stack trace dari bawah, taksonomi error | Sudah ada tapi dangkal |
| `03-metode-ilmiah-bisection-delta.md` | REDUCE framework, hipotesis-uji, binary search, git bisect, delta debugging, bug intermiten | **Tidak ada sama sekali** |
| `04-taktik-debugging.md` | 7 taktik: log, breakpoint, rubber duck, bisection, diferensial, reproduksi minimal, assert/timeout | Tersebar, tidak sistematis |
| `05-pola-bug-umum.md` | 12 pola bug dengan contoh Indonesia + cara mengenalinya | Ada 5, tanpa kedalaman |
| `06-debugging-kode-buatan-ai.md` | Profil bug khas kode AI, cara debug kode yang tidak Anda tulis, anti-pola "biar AI yang betulkan" | **Tidak ada sama sekali** |
| `07-latihan-bertahap-debugging.md` | 12 latihan berjenjang dari trivial → sulit, self-contained | **Tidak ada sama sekali** |
| `08-debugging-produksi-dan-postmortem.md` | Debug tanpa bisa reproduksi lokal, rollback-first, postmortem blameless | Ada di vibecoding, tapi tidak terhubung |

**Baca berurutan 01→08.** Setelah itu baru kembali ke G1 sebagai pendalaman.

---

## H. Produksi & operasional (26 file)

**Pertanyaan:** "Aplikasi saya sudah dipakai orang. Bagaimana menjaganya?"

| Folder | File | Isi |
|---|---|---|
| `vibecoding/` | 16 + CLAUDE.md | Workflow kolaborasi, prompt engineering, QA, terjemahan vibe, orkestrasi AI, PRD, lingkungan dev, keamanan fullstack, dokumentasi arsitektur, pemeliharaan infrastruktur, **runbook**, **respons insiden**, change log, prosedur pemulihan, kontak vendor |
| `fase-5-scenario-praktis/` | 11 | Konten, development harian, file management, refactoring/testing, dokumentasi/git, CI/CD, custom dev agents, pengolahan data, otomatisasi |
| `fase-4-deep-system-design/07` | 1 | Observability & monitoring |
| `book-resource/ai-engineering-indonesia/bab-10` | 1 | Arsitektur AI & umpan balik pengguna |

**Kapan dibaca:** **sebelum** aplikasi Anda dipakai orang lain, bukan sesudah. Khususnya `vibecoding/11-runbook` dan `12-respons-insiden` — menulis runbook sebelum insiden pertama adalah salah satu kebiasaan dengan rasio manfaat/usaha terbaik.

---

## I. Referensi & pelacakan (8 file)

| File | Isi | Kapan |
|---|---|---|
| `resources/cheat-sheet.md` | Ringkasan perintah & konsep | Sepanjang belajar |
| `resources/glossary.md` | Glosarium istilah | Saat lupa istilah |
| `resources/progress-tracker.md` | Pelacak progres fase 1–4 | ⚠️ Perlu diperbarui (fase 5–6 belum masuk) |
| `architecture-planner/MATERI-PECAHAN/19-Glosarium-Lengkap.md` | Glosarium versi metode | Saat lupa istilah |
| `architecture-planner/MATERI-PECAHAN/24-Referensi-Sumber.md` | Daftar sumber | Saat mau riset lebih dalam |
| `GuidePrincniplesforLearners.md` | 5 prinsip Anthropic untuk pembelajar | Sebelum menulis skill |
| `TUTORIAL-BELAJAR-PEMROGRAMAN-DENGAN-AI-SKILLS.md` | Tutorial belajar pakai skills | Kalau mau belajar lewat skill |
| `skills-lock.json` | Catatan skill yang dipasang | ⚠️ Belum mencatat skill vendor |

---

## Materi di luar 9 blok di atas

Beberapa folder menjawab kebutuhan yang lebih spesifik:

| Folder | Untuk siapa | Catatan |
|---|---|---|
| `easy-vibe-materi/` (16 folder) | Yang tujuannya **produk/usaha**, bukan karier teknis | Berisi lampiran bisnis: Double Diamond, JTBD, mom test, skenario B2B/B2C |
| `book-resource/ai-engineering-indonesia/` (10 bab) | Yang mau **membangun produk AI** | Chip Huyen, *AI Engineering* — versi Indonesia |
| `learning-*/` (7 skill) | Yang mau belajar **bahasa/framework spesifik** | `learning-python`, `-javascript`, `-php`, `-fullstack`, `-system-design`, `-ai-engineering`, + `coding-tutor`, `gentle-teaching` |
| `skills/` (7) | Yang sudah mengerjakan proyek nyata | acceptance-runner, deploy-production-gate, materi-reference, scaffolder, security-dependency-auditor, sprint-planner, state-keeper |
| `skills-vendor/` (4 + OVERRIDES) | Yang memakai skill pihak ketiga | constraint-driven-development, debugging-and-error-recovery, observability-and-instrumentation, systematic-debugging |
| `roadmap-belajar-uiux-frontend.md` | Yang mengarah ke frontend/UI-UX | Jalur alternatif |
| `orca-comprehensive-guide.md`, `panduan-crit-workflow.md`, `panduan-herdr-usage.md` | Pengguna tool spesifik | Referensi tool |
| `research-*.md` (3 file) | Yang mau tahu dasar risetnya | Riset skill belajar pemrograman, loop architect agents, AI belajar pemrograman |

---

## Tiga jalur contoh (biar konkret)

Supaya peta ini tidak jadi teori, ini tiga jalur nyata dari 244 file di atas.

### Jalur 1 — "Saya guru, mau bikin aplikasi administrasi sekolah"

```
fase-0/02-diagnostik → fase-0/03-cara-belajar
→ learning-python (atau -javascript)
→ fase-1-arsitektur-dasar (01–10 saja, sisanya nanti)
→ architecture-planner/MATERI-PECAHAN 01–08
→ fase-2-ai-tools-dasar
→ arsitektur-vibe-coding (03, 06, 07, 14)
→ fase-0/arsitektur/01–03
→ bangun proyek nyata
→ fase-0/debugging/01–08 (paralel, saat menghadapi error)
```

Estimasi: 4–5 bulan @ 1 jam/hari. Tidak perlu menyentuh fase 4 dan 6.

### Jalur 2 — "Saya developer, mau naik ke level arsitek"

```
fase-0/02-diagnostik → fase-0/03
→ fase-1-arsitektur-dasar (lengkap, 22 file)
→ fase-0/arsitektur/01–04
→ fase-4-deep-system-design (lengkap)
→ fase-0/debugging/01–08
→ fase-3-advanced-workflows
→ architecture-planner/MATERI-PECAHAN (lengkap)
→ vibecoding/09, 10, 11, 12, 14
```

Estimasi: 8–10 bulan. Fase 2 dan 5 boleh dilewati kalau sudah berpengalaman.

### Jalur 3 — "Saya ingin membangun produk AI"

```
fase-0/02-diagnostik → fase-0/03
→ learning-ai-engineering
→ book-resource/ai-engineering-indonesia (10 bab, berurutan)
→ fase-2-ai-tools-dasar
→ architecture-planner/MATERI-PECAHAN 01–08, 21
→ fase-0/debugging/01–08
→ fase-3-advanced-workflows (06, 07, 08)
→ easy-vibe-materi lampiran (JTBD, mom test)
→ bangun
```

Estimasi: 6–8 bulan. Fase 1 tetap perlu, tapi cukup 01–06 dan 14.

---

## Cara memakai peta ini dengan benar

1. **Jangan** mencoba membaca semuanya. 244 file itu untuk dirujuk, bukan ditamatkan.
2. **Pilih satu jalur**, tandai, lalu abaikan sisanya sampai jalur itu selesai.
3. **Boleh melewati** blok yang tidak relevan dengan tujuan Anda. Tapi jangan lewati blok A, D, dan G.
4. Kalau bingung antara dua file, baca yang **lebih konkret** dulu (yang ada contoh kode), lalu yang abstrak.

---

> **Lanjut ke:** [`02-diagnostik-dan-jalur.md`](./02-diagnostik-dan-jalur.md) — ubah peta ini jadi jadwal personal.
