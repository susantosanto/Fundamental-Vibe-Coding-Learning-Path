# RISET: Harness Engineering — dan Audit Apakah Workflow Bab 27 Termasuk di Dalamnya

*Riset mendalam • 13 September 2026 • Sumber: 22 (sumber primer: Hashimoto, OpenAI, Anthropic, LangChain, martinfowler.com)*
*Pertanyaan: (1) Apa itu harness engineering? (2) Apakah workflow di `27-Panduan-EndToEnd-Semua-Skill.md` bisa disebut harness engineering?*

---

## RINGKASAN EKSEKUTIF

**Harness engineering** adalah disiplin merancang **seluruh infrastruktur di sekitar model AI** — bukan modelnya — supaya agent yang powerful tapi non-deterministik bisa bekerja secara andal di produksi. Formulanya: **Agent = Model + Harness**.

**Jawaban atas pertanyaan kedua: YA — tapi dengan satu kualifikasi penting.** Workflow Bab 27 adalah **harness engineering yang sah**, tepatnya pada lapisan yang oleh Martin Fowler disebut **"outer harness untuk pengguna coding agent"**. Bab 27 sudah mengimplementasikan tiga pilar inti harness engineering dengan sangat baik: **(a) feedforward guides**, **(b) feedback sensors**, dan **(c) steering loop**. Yang belum ada bukan kelemahan konsep, melainkan **satu lapisan yang belum digarap**: *mechanical enforcement* (lint kustom + structural test) dan *entropy garbage collection* — dua hal yang justru menjadi inti artikel OpenAI.

**Satu temuan penting:** Bab 27 **sama sekali tidak menyebut istilah "harness"**. Istilah yang dipakai di sana adalah "pipeline", "architect pack", "kontrol", "bukti bukan klaim". Artinya: dokumen ini secara praktik sudah sampai ke harness engineering, tetapi belum menyadari/menyebutkan bahwa ia sedang melakukan itu — sehingga beberapa mekanisme kunci yang memberi leverage terbesar (lint sebagai koreksi otomatis, GC drift terjadwal) belum diadopsi.

---

# BAGIAN 1 — APA ITU HARNESS ENGINEERING

## 1.1 Definisi dan formula inti

Definisi paling ringkas datang dari komunitas Thoughtworks:

> "The term **harness** has emerged as a shorthand to mean **everything in an AI agent except the model itself** — **Agent = Model + Harness**."
> — Birgitta Böckeler, *Harness engineering for coding agent users*, martinfowler.com, 2 April 2026

Sementara definisi operasional yang lebih formal:

> "**Harness engineering is the discipline of designing, building, and operating the infrastructure that constrains, informs, verifies, and corrects AI agents in production.**"
> — harness-engineering.ai, Maret 2026

Yang termasuk "harness": *context assembly, tool orchestration, verification loops, cost controls, observability instrumentation*. Yang **tidak** termasuk: bobot model dan reasoning internalnya.

Analogi komputasi yang dipakai berulang kali di literatur:

| Komponen | Analogi |
|---|---|
| Model | CPU |
| Context | RAM |
| **Harness** | **Sistem operasi** |

## 1.2 Akar kata: "harness" bukan istilah baru — 40 tahun

Ini penting untuk tidak terjebak hype. Kata "harness" sudah dipakai di software engineering sejak lama, dan **logikanya identik** setiap kali: *bungkus unit eksekusi yang tidak bisa dipercaya penuh dengan kontrol, isolasi, verifikasi, dan umpan balik.*

| Era | Bentuk | Objek yang dibungkus | Alasan tidak dipercaya |
|---|---|---|---|
| 1997+ | **Test harness** (JUnit/xUnit) | Kode yang diuji | Punya bug |
| 2010s | **Fuzzing harness** (AFL, libFuzzer, OSS-Fuzz) | API target | Punya kerentanan |
| 2020+ | **Eval harness** (EleutherAI `lm-evaluation-harness`, SWE-bench, Stanford HELM) | LLM | Halusinasi |
| 2024+ | **Agent harness** (SWE-agent ACI) | LLM Agent | Non-deterministik + tanpa konteks |

Esensinya, dalam satu kalimat:

> "**Harness is fundamentally a cybernetics problem**: building a regulator around an execution unit that cannot be fully trusted."

Dan hukum yang mengikatnya adalah **Ashby's Law of Requisite Variety** (dikutip Fowler): *regulator harus punya keragaman minimal sebesar sistem yang diatur.* Makin banyak yang bisa dilakukan agent, makin banyak dimensi kontrol yang dibutuhkan harness. **Itulah sebabnya agent harness jauh lebih kompleks daripada test harness** — bukan karena konsepnya beda, tapi karena objeknya naik beberapa orde besaran.

> **Catatan untuk proyek ini:** Bab 15.3 di `MATERI-LENGKAP-Architect-Builder-Method.md` sudah memakai istilah **"Test Harness"** ("bangun test DULU baru fitur", kutipan Chris Titus Tech). Jadi fondasi kosakata *harness* sudah ada di proyek — hanya belum naik satu tingkat ke *agent harness*.

## 1.3 Timeline: siapa mempopulerkan apa

| Tanggal | Sumber | Kontribusi |
|---|---|---|
| **26 Nov 2025** | **Anthropic** (Justin Young) — *Effective harnesses for long-running agents* | Memakai istilah "agent harness" secara teknis; mendokumentasikan initializer agent + coding agent |
| **5 Feb 2026** | **Mitchell Hashimoto** — *My AI Adoption Journey*, Step 5: "Engineer the Harness" | **Pencetus istilah "harness engineering"** — mendefinisikannya sebagai disiplin |
| **17 Feb 2026** | **LangChain** (Vivek Trivedy) — *Improving Deep Agents with harness engineering* | Bukti empiris: 52.8% → 66.5% di Terminal Bench 2.0 **tanpa ganti model** |
| **± 27 Feb 2026** | **OpenAI** (Ryan Lopopolo) — *Harness engineering: leveraging Codex in an agent-first world* | Studi kasus 1 juta baris kode, **0 baris ditulis manusia** |
| **2 Apr 2026** | **Martin Fowler / Birgitta Böckeler** — *Harness engineering for coding agent users* | Sistematisasi: guides vs sensors, computational vs inferential |

**Verdict soal atribusi:** Mitchell Hashimoto adalah **pencetus istilah** (5 Feb 2026, blog pribadi). OpenAI **memformalkan** sebagai disiplin engineering. Fowler **memberi kerangka konseptual**. Ada sedikit ketidaksepakatan di sumber sekunder (sebagian menyebut Anthropic "mempopulerkan analogi", sebagian menyebut Hashimoto "mencetuskan istilah") — keduanya tidak bertentangan: Anthropic memakai *istilah teknis* "harness" lebih dulu, Hashimoto menciptakan *frasa disiplin* "harness **engineering**".

## 1.4 Anatomi: lima komponen harness modern

| # | Komponen | Isi |
|---|---|---|
| 1 | **Context engineering** | Apa yang agent ketahui di tiap langkah — RAG, memori, riwayat, file system. Tantangannya presisi: jangan terlalu sedikit, jangan terlalu banyak |
| 2 | **Tool orchestration** | Apa yang agent bisa lakukan — validasi input, parsing output, error handling, timeout |
| 3 | **Verification loops** | Cek pekerjaan agent tiap langkah. Disebut *"the single highest-ROI component of any agent harness"* |
| 4 | **Cost envelope management** | Plafon budget per-task, ditegakkan apa pun niat agent. Juga berfungsi sebagai **sinyal reliabilitas** |
| 5 | **Observability & evaluation** | Structured trace + pipeline evaluasi otomatis |

> "**Most teams build two or three of them.**" — dan justru itu yang membedakan agent demo dari agent produksi.

**Bedakan juga:** *agent framework* (LangChain, CrewAI, AutoGen) = scaffolding, titik awal. *Agent harness* = infrastruktur produksi lengkap. "**Frameworks give you a starting point. The harness is what makes it production-grade.**"

## 1.5 Kerangka paling berguna: GUIDES vs SENSORS

Inilah kontribusi konseptual terbesar (Fowler/Böckeler) — dan inilah kerangka yang akan saya pakai untuk mengaudit Bab 27.

> "To harness a coding agent we both **anticipate unwanted outputs and try to prevent them**, and we put **sensors in place to allow the agent to self-correct**."

**GUIDES (feedforward controls)** — mengantisipasi perilaku agent dan mengarahkannya **SEBELUM** ia bertindak. Menaikkan probabilitas benar di percobaan pertama.

**SENSORS (feedback controls)** — mengamati **SETELAH** agent bertindak, membantunya mengoreksi diri. Paling kuat kalau sinyalnya dioptimalkan untuk konsumsi LLM — misalnya pesan linter kustom yang **berisi instruksi perbaikan** di dalamnya. Fowler menyebutnya *"a positive kind of prompt injection."*

**Mengapa harus dua-duanya?**

> "Separately, you get either an agent that keeps repeating the same mistakes (**feedback-only**) or an agent that encodes rules but never finds out whether they worked (**feed-forward-only**)."

Setiap kontrol punya **dua jenis eksekusi**:

| Jenis | Sifat | Contoh |
|---|---|---|
| **Computational** | Deterministik, cepat, murah (CPU). Hasilnya bisa dipercaya | Test, linter, type checker, analisis struktural, ArchUnit |
| **Inferential** | Semantik, lambat, mahal, non-deterministik (GPU/NPU) | AI code review, "LLM as judge", skill review |

**Tiga kategori regulasi harness:**
1. **Maintainability harness** — kualitas internal kode (paling mudah; tooling sudah banyak)
2. **Architecture fitness harness** — karakteristik arsitektur (Fitness Functions)
3. **Behaviour harness** — apakah aplikasi berperilaku seperti yang dibutuhkan (**yang paling belum terpecahkan**)

**Contoh nyata dari artikel Fowler (tabel verbatim):**

| Arah | Jenis | Implementasi contoh |
|---|---|---|
| Konvensi coding | feedforward | Inferential — **AGENTS.md, Skills** |
| Instruksi bootstrap proyek | feedforward | Keduanya — **Skill + bootstrap script** |
| Code mods | feedforward | Computational — **tool dengan resep OpenRewrite** |
| Structural tests | feedback | Computational — **pre-commit hook menjalankan ArchUnit** |
| Instruksi cara review | feedback | Inferential — **Skills** |

## 1.6 Posisi terhadap prompt & context engineering

Ketiganya **bersarang**, bukan saling menggantikan:

```
Prompt Engineering ⊂ Context Engineering ⊂ Harness Engineering
```

| Dimensi | Prompt Eng. | Context Eng. | **Harness Eng.** |
|---|---|---|---|
| Era | 2022–2024 | 2025 | **2026+** |
| Unit kontrol | Pesan | Sesi | **Sistem** |
| Yang dikontrol | Instruksi tunggal | Isi context window | **Seluruh environment agent** |
| Failure mode utama | Instruksi kurang jelas | Konteks salah/kurang | **Kegagalan tingkat sistem: tool error, cost overrun, degradasi senyap** |
| Dampak ke reliabilitas | 5–15% | 15–30% | **50–80%** |
| Siapa yang mempopulerkan | Komunitas/informal | Karpathy, Lutke (2025) | **Fowler, Lopopolo (2026)** |

Kutipan yang paling sering diulang:

> "**You cannot prompt your way to 99.9% reliability. The prompt is one input to the system. The harness is the system.**"

Dan dari Ryan Lopopolo (tim Codex, OpenAI):

> "**Agents aren't hard; the Harness is hard.**"

---

# BAGIAN 2 — PRAKTIK KONKRET DARI SUMBER PRIMER

## 2.1 Mitchell Hashimoto (5 Feb 2026) — definisi asli

> "I don't know if there is a broad industry-accepted term for this yet, but I've grown to calling this **'harness engineering.'** It is the idea that **anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again.**"

Ia menyebut **dua bentuk**:

1. **Better implicit prompting (AGENTS.md).** Untuk hal sederhana — agent salah jalankan command, salah temukan API → perbarui `AGENTS.md`.
   > "**Each line in that file is based on a bad agent behavior**, and it almost completely resolved them all."
2. **Actual, programmed tools.** Script untuk screenshot, menjalankan test terfilter, dsb — biasanya dipasangkan dengan perubahan AGENTS.md supaya agent tahu tool itu ada.

Prasyarat yang ia identifikasi lebih awal di journey-nya:
> "**If you give an agent a way to verify its work, it more often than not fixes its own mistakes and prevents regressions.**"

Dan satu detail penting soal disiplin: **matikan notifikasi desktop agent.** "Context switching is very expensive… it was my job as a human to be in control of when I interrupt the agent."

## 2.2 OpenAI — studi kasus paling ekstrem (Feb 2026)

**Eksperimen:** tim Harness membangun & mengirim produk beta internal selama **5 bulan** dengan **NOL baris kode ditulis manusia**.

| Metrik | Nilai |
|---|---|
| Baris kode ditulis manusia | **0** |
| Total codebase | **± 1 juta baris** |
| PR dibuka & di-merge | **± 1.500** |
| Throughput rata-rata | **3,5 PR / engineer / hari** |
| Tim awal | **3 engineer** (tumbuh ke 7) |
| Durasi maksimum satu run Codex | **6+ jam** |
| Waktu cleanup manual (sebelum otomasi) | **20% per minggu** (tiap Jumat) |

**Praktik harness yang mereka bangun:**

1. **Repo sebagai single system of record.**
   > "Slack discussions, Google Docs, and tacit human knowledge are **invisible to agents** — if it isn't discoverable in the repo, it **effectively doesn't exist** for the agent."

2. **AGENTS.md sebagai daftar isi, bukan ensiklopedia — ± 100 baris.**
   > "A monolithic instruction file fails because it **crowds out task context**, causes agents to **pattern-match locally** instead of navigating intentionally, **rots instantly** as rules go stale, and is **hard to verify mechanically**."
   > "Too much upfront guidance becomes **'non-guidance'** — when everything is marked important, nothing is."

3. **Progressive disclosure** — entry point kecil & stabil, agent diajari ke mana harus mencari (`docs/` terindeks: design docs, execution plans, product specs, architecture maps, quality grades).

4. **Penegakan arsitektur secara mekanis.**
   - Arsitektur berlapis rigid + aturan dependency **ditegakkan mesin**
   - **Lint kustom yang pesan errornya berisi instruksi perbaikan** — di-inject langsung ke context agent
     > "Write custom lint error messages that **inject remediation instructions directly into agent context**, turning every violation into a learning opportunity for the agent."
   - Structural tests + "taste invariants" (structured logging, konvensi nama, batas ukuran file)
   > "In a human-first workflow, strict linting rules might feel pedantic. **With agents, they become multipliers** — once encoded, they apply everywhere at once, preventing drift across a million-line codebase."

5. **Aplikasi dibuat bisa memvalidasi dirinya sendiri.**
   - Aplikasi **bootable per git worktree**
   - **Chrome DevTools Protocol di-wire ke runtime agent** → agent bisa ambil DOM snapshot, screenshot, navigasi UI, reproduksi bug, validasi fix
   - **Local observability stack** dengan API yang bisa di-query: **LogQL** (log), **PromQL** (metrics), **TraceQL** (trace)
   > "The team's bottleneck shifted from **code throughput to human QA capacity**."

6. **"Garbage collection" untuk entropy.**
   > "Implement recurring background cleanup tasks ('garbage collection') where agents **scan for deviations from 'golden principles'**, update quality grades, and open targeted refactoring pull requests on a regular cadence."
   > "By automating this into background Codex tasks with codified principles, they **scaled cleanup proportionally to code generation throughput**."

7. **Depth-first capability building — jangan pernah "coba lebih keras".**
   > "When agents struggle with a task, **resist the urge to 'try harder' or write the code manually**. Instead, diagnose what capability is missing — tools, guardrails, abstractions, or documentation — and **have the agent itself build that missing capability into the repository.**"

8. **"Boring technology".** Teknologi yang membosankan lebih mudah dimodelkan agent (komposabilitas, API stabil, representasi kuat di training data).

**Kesimpulan filosofis mereka:**
> "Our most difficult challenges now center on **designing environments, feedback loops, and control systems**."

## 2.3 Anthropic (26 Nov 2025) — harness untuk tugas panjang

**Masalahnya:** agent bekerja dalam sesi diskrit; tiap sesi baru mulai tanpa ingatan.
> "Imagine a software project staffed by engineers working in **shifts**, where each new engineer arrives with **no memory** of what happened on the previous shift."

**Solusi dua bagian:**
1. **Initializer agent** — sesi pertama menyiapkan environment: `init.sh`, `claude-progress.txt`, git commit awal
2. **Coding agent** — tiap sesi berikutnya membuat kemajuan inkremental + meninggalkan update terstruktur

**Komponen kunci:**

| Masalah | Solusi harness |
|---|---|
| Agent men-*one-shot* app → kehabisan context di tengah | **Feature list JSON** (200+ fitur, semua awalnya `passes: false`) |
| Agent salah paham sudah selesai | Pilih **satu** fitur per sesi, self-verify, baru tandai `passes: true` |
| Sesi berikutnya menebak-nebak apa yang terjadi | **`claude-progress.txt`** + git log + `init.sh` |
| Agent tandai fitur selesai tanpa testing | **Browser automation tools** (Puppeteer MCP) — tes seperti manusia |

Detail cerdas: mereka memilih **JSON, bukan Markdown**, karena model lebih jarang mengubah/overwrite JSON. Dan instruksi tegas: *"It is unacceptable to remove or edit tests."*

> "Providing Claude with these kinds of testing tools **dramatically improved performance**, as the agent was able to identify and fix bugs that weren't obvious from the code alone."

## 2.4 LangChain (17 Feb 2026) — bukti empiris paling bersih

**Klaim:** `52.8` → `66.5` di Terminal Bench 2.0 (**+13.7 poin**), **model tidak diubah** (tetap `gpt-5.2-codex`).

> "**We only changed the harness.**"

**Tiga knob yang mereka pilih** (dari banyak knob): **System Prompt, Tools, Middleware**.

**Yang benar-benar menaikkan skor:**

1. **Build & Self-Verify loop.** Failure pattern paling umum:
   > "The agent wrote a solution, **re-read its own code, confirmed it looks ok, and stopped.**"
   
   Perbaikannya: prompting eksplisit 4 fase (**Planning & Discovery → Build → Verify → Fix**) + **`PreCompletionChecklistMiddleware`** yang mencegat agent sebelum exit dan mengingatkannya menjalankan verifikasi terhadap spec.

2. **Memberi agent konteks tentang environment-nya.**
   - **`LocalContextMiddleware`** — memetakan `cwd`, parent+child directories, mencari tool seperti instalasi Python
   - Mengajari agent menulis kode yang **testable** (patuhi path di spec persis, tangani edge case)
   - **Time budgeting** — injeksi peringatan budget waktu; "Agents are famously bad at time estimation"

3. **`LoopDetectionMiddleware`** — melacak jumlah edit per file; menambahkan konteks *"…consider reconsidering your approach"* setelah N edit ke file yang sama. Mengatasi *"doom loops"* (10+ variasi dari pendekatan yang sama-sama rusak).

4. **"Reasoning sandwich"** — `xhigh-high-xhigh`. Menghabiskan reasoning lebih banyak untuk **planning dan verification**.
   - Hanya `xhigh` → **53.9%** (timeout)
   - `high` → **63.6%**
   - sandwich → **66.5%**

5. **Tracing sebagai sinyal feedback.** Trace Analyzer Skill: fetch trace → spawn parallel error analysis agents → sintesis → perubahan bertarget ke harness. Mirip teknik *boosting*.

**Catatan kejujuran mereka:**
> "This is a design heuristic that engineers around **today's perceived model issues**. As models improve, these guardrails will likely be unnecessary."

**Lima prinsip umum mereka:**
1. Context engineering on behalf of agents
2. Help agents self-verify their work
3. Tracing as a feedback signal
4. Detect & fix bad patterns in the short term
5. **Tailor harnesses to models** (Codex vs Claude butuh prompting berbeda)

## 2.5 Martin Fowler / Böckeler — batas & kejujuran

Ini bagian terpenting untuk tidak overclaim. Yang **tidak** bisa ditangkap harness:

> "**Neither catches reliably** some of the higher-impact problems: **misdiagnosis of issues, overengineering and unnecessary features, misunderstood instructions.** They'll sometimes catch them, but not reliably enough to reduce supervision. **Correctness is outside any sensor's remit if the human didn't clearly specify what they wanted in the first place.**"

> "So overall, we still have **a lot to do to figure out good harnesses for functional behaviour** that increase our confidence enough to reduce supervision and manual testing."

**Harnessability tidak seragam:**
> "Not every codebase is equally amenable to harnessing. A codebase written in a **strongly typed language** naturally has type-checking as a sensor; clearly definable **module boundaries** afford architectural constraint rules… **Without those properties, those controls aren't available to build.**"
> "**Greenfield teams can bake harnessability in from day one… Legacy teams… face the harder problem: the harness is most needed where it is hardest to build.**"

**Peran manusia tidak hilang:**
> "A coding agent has none of this: **no social accountability, no aesthetic disgust at a 300-line function, no intuition that 'we don't do it that way here', and no organisational memory.** It doesn't know which convention is **load-bearing** and which is just habit."
> "A good harness should **not necessarily aim to fully eliminate human input, but to direct it to where our input is most important.**"

**Steering loop — inti pekerjaan manusia:**
> "The human's job in this is to **steer** the agent by **iterating on the harness**. Whenever an issue happens **multiple times**, the feedforward and feedback controls should be **improved to make the issue less probable to occur in the future, or even prevent it.**"

**Pertanyaan terbuka (belum terjawab siapa pun):**
> "If sensors **never fire**, is that a sign of **high quality or inadequate detection mechanisms**? We need a way to **evaluate harness coverage and quality** similar to what code coverage and mutation testing do for tests."
> "Building this outer harness is emerging as an **ongoing engineering practice, not a one-time configuration.**"

---

# BAGIAN 3 — PERDEBATAN: AKANKAH HARNESS "DIMAKAN" MODEL?

Wajib diketahui supaya tidak menelan konsep ini mentah-mentah.

**Sisi "harness akan dimakan model":**
- **Gleb Rodionov (Yandex, April 2026)** — fenomena *"Reasoning Shift"*: prefiks 64.000 token Shakespeare menurunkan akurasi, tapi menggantinya dengan **token kosong pun** tetap turun. Artinya model bukan kewalahan informasi — ia **"malas" dan memperpendek reasoning**. Kalau benar, premis dasar harness ("model pasti degradasi di konteks panjang") berubah sifat.
- **Noam Brown (OpenAI)** — banyak komponen scaffolding mungkin digantikan model reasoning yang lebih kuat.
- **Claude Code / Anthropic** sengaja mengejar **"thin harness"** — argumennya: constraint tidak perlu ditambahkan dari luar, training sudah membuat model berperilaku benar.
- **Jevons Paradox** — model makin murah/kuat → pemakaian meledak (riset Cursor April 2026: pesan mingguan naik 44%) → vendor punya insentif besar terus memperkuat model.

**Sisi "harness tidak akan dimakan":**
- **Tiga lapis scaffolding, tiap lapis mengungkap masalah lebih dalam** — 2023 RAG (U-shaped attention) → 2025 context engineering (context length sendiri merusak reasoning) → handoff control. "Three layers of problems, three layers of scaffolding."
- **Model lebih kuat → software lebih kompleks → butuh lebih banyak constraint.** Tim software hanya 30–40% waktunya untuk coding; sisanya testing, security, deployment, ops. AI mempercepat coding → tekanan pindah ke **outer loop**.
- **Enterprise ≠ lab.** Harness bukan "mengajari model apa yang harus dilakukan" tapi **"mengambil tanggung jawab atas nama sistem"** — permission, transaction, audit, rollback, memory. Ini **masalah pembagian kepercayaan**, bukan masalah kemampuan.
  > "You need two different AIs. Don't trust one AI to both do accounting and audit."
- **Data lapangan:** Deloitte — 80% enterprise klaim sudah deploy AI, hanya **15%** mencapai value berskala. Gartner — **78%** pemimpin AI enterprise menyebut "ketidakstabilan agent di tugas kompleks" sebagai hambatan #1.

**Verdict yang paling seimbang:**
> "Harness dan Model itu seperti **institusi dan kognisi**, **konstitusi dan eksekutor** — yang pertama bisa makin tak terlihat, tapi **tidak akan hilang**."

**Yang bersifat sementara (kandidat dimakan):** Todolist, checkpoint, handoff control — apa pun yang murni **menambal celah kemampuan**.
**Yang bersifat tahan lama (moat):** pengetahuan tacit *mengapa* sebuah constraint harus ditulis begitu — **ini masalah pengalaman, bukan masalah kemampuan**, dan tidak bisa di-*train* habis.

---

# BAGIAN 4 — AUDIT: APAKAH WORKFLOW BAB 27 HARUSNYA DISEBUT HARNESS ENGINEERING?

## 4.1 Verdict

> ### ✅ YA — Bab 27 adalah **harness engineering** yang sah.
> Tepatnya: **"outer harness untuk pengguna coding agent"**, persis kategori yang didefinisikan Fowler/Böckeler — bukan *inner harness* (system prompt, tool schema, middleware, sandbox) yang merupakan milik vendor (Claude Code / opencode / zcode).
>
> ### ⚠️ Tapi belum lengkap di **dua pilar** yang justru paling memberi leverage menurut OpenAI: **mechanical enforcement** dan **entropy garbage collection**.

**Tiga alasan mengapa verdict-nya YA, bukan "mirip":**

1. **Bab 27 punya GUIDES dan SENSORS secara lengkap dan seimbang.** Ini bukan kebetulan — strukturnya identik dengan kerangka Fowler.
2. **Bab 27 punya STEERING LOOP eksplisit.** 27.4b berisi: temukan masalah → cari akar → fix → verifikasi → **catat akar masalah & perbarui runbook**. Fowler mendefinisikan steering loop sebagai *pekerjaan utama manusia* dalam harness engineering. Bab 27 sudah menuliskannya sebagai aturan operasional.
3. **Bab 27 punya SESSION HANDOFF sebagai harness primitive.** Bagian 27.7 (Checklist A/B pindah agent) adalah implementasi langsung dari temuan Anthropic (initializer agent + progress artifact) dan dari prinsip "source of truth = folder, bukan chat history".

**Satu catatan ironis:** Bab 27 **tidak pernah menyebut kata "harness" sama sekali** (sudah saya verifikasi dengan pencarian teks di seluruh proyek). Istilah yang dipakai: *pipeline, architect pack, bukti bukan klaim, kontrak folder*. Ini artinya dokumen tersebut **sudah sampai ke tujuan sebelum tahu nama tujuannya** — dan justru karena itu, dua mekanisme paling leverage belum diadopsi.

## 4.2 Pemetaan lengkap: mekanisme Bab 27 → kontrol harness

| Mekanisme Bab 27 | Jenis kontrol (Fowler) | Eksekusi | Padanan di sumber primer |
|---|---|---|---|
| `/materi-reference` (Lapis 0, selalu aktif) | Guide | Inferential | Router anti-halusinasi; "repo as single system of record" (OpenAI) |
| `/constitution` | Guide | Inferential | Team norms di repo (OpenAI) |
| `AGENTS.MD` + aturan 27.7.3 | **Guide** | Inferential | **Persis Hashimoto bentuk #1** ("better implicit prompting") & Fowler tabel "Coding conventions → AGENTS.md" |
| Architect pack: `REQUIREMENTS` / `BLUEPRINT` / `ACCEPTANCE` / `HANDOFF-PROMPT` | Guide | Inferential | **Functional specification** sebagai feedforward control (Fowler) |
| `DECISIONS.MD` (ADR) | Guide | Inferential | ADR sebagai machine-readable artifact (harness-engineering.ai) |
| `DOMAIN.MD`, `QUESTIONS.MD` | Guide | Inferential | Progressive disclosure; tacit knowledge jadi artefak (OpenAI) |
| **MODE DRY RUN → tunggu approve → MODE BUILD** | **Guide + human gate** | Inferential | LangChain `PreCompletionChecklistMiddleware` (versi manusia) |
| `/pen-design` mockup sebelum coding | Guide | Inferential | Spesifikasi visual = feedforward termurah |
| `/taste` "Design Read" + 3 dial | Guide | Inferential | Konvensi desain sebagai guide |
| "DILARANG pakai library di luar BLUEPRINT.MD (versi pinned)" | Guide | **Computational** | Mechanical constraint (OpenAI) |
| Cross-artifact check di `/sprint-planner` | **Sensor** | Computational | Konsistensi antar-artefak |
| **`/acceptance-runner`** (fresh context, Given-When-Then + command persis) | **Sensor** | Inferential + Computational | **Verification loop** — "single highest-ROI component" |
| **`/browser-skill`** (screenshot nyata, observe-act-observe) | **Sensor** | Computational | **Chrome DevTools Protocol di-wire ke runtime agent (OpenAI)** — padanan hampir 1:1 |
| `/security-dependency-auditor` (npm audit, secret scan, drift BLUEPRINT) | **Sensor** | Computational | Linter/type checker/scanner sebagai sensor deterministik |
| `/deploy-production-gate` (P1 berbukti → GO/NO-GO) | **Sensor + Gate** | Campuran | "Gate layer" pada arsitektur governance 4 lapis |
| `/observability-and-instrumentation` (log/metrics/trace/alert + runbook) | **Sensor** | Computational | **Local observability stack LogQL/PromQL/TraceQL (OpenAI)** — padanan langsung |
| `/debugging-and-error-recovery`, `/systematic-debugging` | **Sensor + koreksi** | Inferential | "Root-cause sebelum fix" — feedback loop |
| "Bug fixed = test gejala asli PASS + red-green dicek — BUKAN 'kode sudah diubah'" | **Definisi sensor yang rigor** | Campuran | Sensor yang sinyalnya dioptimalkan untuk konsumsi LLM |
| `/impeccable` critique / audit / polish / harden | Sensor | Inferential | "LLM as judge" — inferential sensor |
| `/state-keeper` (STATE/DECISIONS/RISKS/QUESTIONS tiap tutup tahap) | **Progress artifact** | Campuran | **Anthropic `claude-progress.txt` + git**, digeneralisasi |
| **27.4b Bug Fix Routing + "perbarui runbook"** | **STEERING LOOP** | Campuran | **Definisi steering loop Fowler** — hampir verbatim |
| **27.7 Checklist A/B handoff antar agent** | **Session handoff primitive** | Campuran | **Anthropic initializer/coding agent + progress file** |
| 27.8 Jalur Adopsi (A/B/C) | Harnessability untuk legacy | — | "**The harness is most needed where it is hardest to build**" (Fowler) |
| "Maks 5 putaran → manusia"; impeccable "jangan QA tanpa akhir — boros uang user" | Cost envelope | Computational | **Cost envelope management** (komponen #4) — versi parsial |
| 27.6.3 dekomisi + cek dependensi yatim | Entropy management | Computational | Sebagian dari "garbage collection" (OpenAI) |

## 4.3 Yang sudah kuat (jangan diubah)

1. **Keseimbangan guides ↔ sensors.** Banyak tim hanya punya satu. Bab 27 punya keduanya, berpasangan per tahap.
2. **Steering loop yang eksplisit.** Kalimat *"TIDAK BOLEH menulis fix SEBELUM akar masalah terbukti"* + *"catat akar masalah; ada runbook? perbarui runbook"* adalah harness engineering murni — mungkin bagian paling matang dari dokumen ini.
3. **"Bukti, bukan klaim."** Ini adalah **definisi sensor yang benar**: sensor yang tidak menghasilkan artefak yang bisa diperiksa bukan sensor, itu harapan. `/browser-skill` + screenshot + output test asli = sensor sungguhan.
4. **Fresh context untuk verifikasi.** `/acceptance-runner` wajib di konteks segar — ini mencegah *self-confirmation bias* yang diidentifikasi LangChain ("re-read its own code, confirmed it looks ok, and stopped").
5. **Folder sebagai single source of truth.** Identik dengan temuan OpenAI dan Anthropic. Handoff 27.7 adalah implementasi paling matang dari prinsip ini yang saya temukan di literatur praktik.
6. **Klasifikasi perubahan (27.6.4) dengan aturan "pilih yang lebih formal".** Ini adalah *decision rule* untuk steering — persis yang Fowler maksud dengan "iterating on the harness".

## 4.4 Gap: apa yang belum ada

| # | Gap | Mengapa penting | Padanan di sumber |
|---|---|---|---|
| **1** | **Tidak ada lint kustom / structural test yang di-generate** | Bab 27 menegakkan aturan lewat **teks** (`DILARANG…`, checklist). OpenAI menegaskan teks saja "**rots instantly**" dan "**hard to verify mechanically**". Constraint mekanis adalah **multiplier** | OpenAI: custom lint dengan instruksi remediasi di pesan error; ArchUnit; fitness functions |
| **2** | **Tidak ada "garbage collection" / drift scanner terjadwal** | Entropy menumpuk terus; Bab 27 hanya menangani drift secara **event-driven** (saat sprint/dekomisi), bukan berkala | OpenAI: recurring cleanup agents scanning for deviations from "golden principles" |
| **3** | **Tidak ada cost envelope per-task** | Hanya ada batas putaran (maks 5) & peringatan "boros uang user". Tidak ada plafon token/biaya yang ditegakkan | harness-engineering.ai komponen #4; LangChain time budgeting |
| **4** | **Tidak ada metrik kualitas harness itu sendiri** | Fowler: *"If sensors never fire, is that high quality or inadequate detection?"* Kita tidak tahu apakah checklist P1 benar-benar menangkap masalah atau hanya formalitas | Fowler open question (belum ada solusi standar di industri) |
| **5** | **Tidak ada desain ACI / tool interface** | Bab 27 memakai tool apa adanya. SWE-agent membuktikan desain interface tool (ACI) sangat menentukan | SWE-agent ACI; LangChain "tool choice" sebagai knob |
| **6** | **Behaviour harness masih lemah** | 27.6.2 mewajibkan acceptance regresi KEEP/CHANGE/REMOVE — ini **lebih baik dari rata-rata industri**. Tapi tetap bergantung pada AI-generated tests | Fowler: "This approach puts a lot of faith into the AI-generated tests" |
| **7** | **Tidak ada strategi context/compaction** | Bab 27 menyerahkan sepenuhnya ke builder tool. Wajar untuk outer harness, tapi tidak disebut sebagai keputusan sadar | Anthropic compaction vs context reset; LangChain context assembly |
| **8** | **Tidak ada mekanisme "harness juga diperbarui oleh agent"** | Hashimoto & OpenAI: agent sendiri yang membangun capability yang hilang ke dalam repo. Bab 27 masih human-driven sepenuhnya | OpenAI: "have the agent itself build that missing capability into the repository" |

## 4.5 Rekomendasi konkret (urutan prioritas)

**Prioritas 1 — Mekanikal, bukan tekstual.** Tambahkan tahap di `/sprint-planner` (atau skill baru `/harness-builder`) yang **men-generate** dari BLUEPRINT:
- lint rule kustom (pesan error berisi instruksi perbaikan, bukan cuma "error")
- structural test untuk batas modul
- pre-commit hook yang menjalankan keduanya

Ini mengubah `DILARANG` dari teks menjadi **sensor computational**. Dampaknya paling besar per usaha.

**Prioritas 2 — Garbage collection terjadwal.** Tambahkan `/entropy-scan` (atau perluas `/security-dependency-auditor`) yang berjalan **berkala, di luar siklus sprint**: deteksi dead code, drift dari BLUEPRINT, wrapper/adapter yang sudah lewat masa transisi, duplikasi semantik. Keluarannya: PR refactoring bertarget, bukan laporan.

**Prioritas 3 — Cost envelope.** Tambahkan ke `ACCEPTANCE.MD`/`HANDOFF-PROMPT.MD`: plafon token/biaya per sprint. Ketika terlampaui → **itu sinyal harness-nya yang kurang**, bukan modelnya yang kurang pintar (ini poin penting: cost overrun adalah sinyal reliabilitas).

**Prioritas 4 — Ukur harness-nya.** Tambahkan ke `STATE.MD` per sprint: berapa kali tiap sensor menyala, berapa temuan yang lolos ke produksi. Kalau checklist P1 tidak pernah menyala selama 5 sprint → **curigai deteksinya**, bukan bersyukur.

**Prioritas 5 — Perkenalkan kosakatanya.** Sisipkan definisi harness engineering + kerangka guides/sensors ke Bab 19 (Glosarium) dan 25/26. Manfaatnya bukan kosmetik: begitu tim punya kata untuk "feedforward guide" dan "computational sensor", mereka akan otomatis mencari gap-nya.

---

# BAGIAN 5 — SATU OBSERVASI STRUKTURAL

Proyek ini bernama `fundamental-vibe-coding`. Ada literatur 2026 yang secara eksplisit berjudul **"Dari Vibe Coding ke Harness Engineering"** — dan diagnosisnya persis masalah yang Bab 27 selesaikan:

> "Masalahnya bukan model 'menulis kode rusak dari udara kosong', tapi ia **memperbesar batas, kontrak, dan kepemilikan yang sejak awal belum dibekukan** dengan kecepatan iterasi yang tak terkendali."
> — dan: "**Komponen transisi yang tidak benar-benar dipensiunkan, akhirnya menjadi host default yang baru.**"

Aturan Bab 27 seperti *"Tidak ada jalur pintas ke builder"*, *"DILARANG refactor kode lama 'sekalian' di luar cakupan sprint"*, dan pola **dekomisi 27.6.3** adalah jawaban langsung atas masalah itu.

**Jadi:** Bab 27 bukan hanya *bisa* disebut harness engineering — ia adalah **titik konvergensi** antara dua jalur literatur yang berbeda (vibe-coding-governance dan agent-harness). Ia sampai ke tempat yang sama lewat jalan yang berbeda.

Yang tersisa hanyalah menutup tiga gap teknis (4.4 #1–#3) untuk berubah dari **harness yang deskriptif** menjadi **harness yang mekanis** — dan di situlah sebagian besar leverage berada.

---

# SUMBER

## Sumber primer
1. [Mitchell Hashimoto — My AI Adoption Journey (5 Feb 2026)](https://mitchellh.com/writing/my-ai-adoption-journey) — pencetus istilah "harness engineering", Step 5
2. [Martin Fowler / Birgitta Böckeler — Harness engineering for coding agent users (2 Apr 2026)](https://martinfowler.com/articles/harness-engineering.html) — kerangka guides vs sensors, computational vs inferential
3. [Anthropic — Effective harnesses for long-running agents (26 Nov 2025)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — initializer agent + coding agent, feature list, progress file
4. [LangChain — Improving Deep Agents with harness engineering (17 Feb 2026)](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering) — 52.8 → 66.5 tanpa ganti model
5. [OpenAI — Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering) (dibaca via [engineering.fyi](https://www.engineering.fyi/article/harness-engineering-leveraging-codex-in-an-agent-first-world)) — 1 juta baris, 0 baris manual

## Sumber sekunder & analisis
6. [Atlan — Prompt vs Context vs Harness Engineering](https://atlan.com/know/harness-engineering-vs-prompt-engineering/) — perbandingan 8 dimensi, kutipan Karpathy/Fowler/Lopopolo/Lutke *(catatan: konten vendor, framing mengarah ke data governance)*
7. [harness-engineering.ai — What Is Harness Engineering?](https://harness-engineering.ai/blog/what-is-harness-engineering/) — 5 komponen, analogi horse tack
8. [agent-engineering.dev — Harness Engineering in 2026](https://www.agent-engineering.dev/article/harness-engineering-in-2026-the-discipline-that-makes-ai-agents-production-ready) — komponen harness, panduan membangun
9. [知乎 — Harness Engineering 技术全景（上）：从 Test Harness 到 Agent Harness](https://zhuanlan.zhihu.com/p/2035055433522655252) — sejarah 40 tahun kata "harness"; test → fuzzing → eval → agent harness
10. [腾讯云 — 从 Vibe Coding 到 Harness Engineering 的实践与思考](https://cloud.tencent.com/developer/article/2653873) — arsitektur governance 4 lapis, 6承重点, 5 aturan praktis, handoff sebagai harness primitive
11. [知乎 — 模型会吃掉 Harness 吗？Boris 访谈](https://zhuanlan.zhihu.com/p/2037499823096648771) — perdebatan "model akan memakan harness"; data Deloitte/Gartner
12. [知乎 — 驾驭工程 / 百度百科](https://baike.baidu.com/item/%E9%A9%BE%E9%A9%AD%E5%B7%A5%E7%A8%8B/67627768) — atribusi istilah ke Mitchell Hashimoto (5 Feb 2026)

## Dokumen internal yang diaudit
13. `architecture-planner/MATERI-PECAHAN/27-Panduan-EndToEnd-Semua-Skill.md` (692 baris)
14. `architecture-planner/MATERI-LENGKAP-Architect-Builder-Method.md` — Bab 15.3 "Test Harness: Bangun Test DULU Baru Fitur"
15. `architecture-planner/MATERI-PECAHAN/23-Vibe-Engineering.md` — "Dinding 3 Bulan", context drift

## Catatan metodologi & keterbatasan
- **Alat:** firecrawl/exa MCP **tidak tersedia** di environment ini; riset dilakukan dengan web search + full-page fetch.
- **Kueri:** ± 14 pencarian, 9 halaman dibaca penuh.
- **Keterbatasan:** sebagian besar literatur kaya (Cina) hanya tersedia sebagai sumber sekunder; artikel Atlan adalah konten vendor; klaim angka (mis. "harness = 80% faktor kualitas") berasal dari satu sumber dan **belum saya verifikasi silang** — perlakukan sebagai estimasi, bukan fakta terukur.
- **Yang tidak ditemukan:** tidak ada studi peer-review independen yang mengukur kontribusi harness vs model secara terkontrol di luar benchmark vendor. Ini gap literatur yang nyata.
