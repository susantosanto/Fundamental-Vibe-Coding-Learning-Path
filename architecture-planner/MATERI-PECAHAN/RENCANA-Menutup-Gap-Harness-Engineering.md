# RENCANA: Menutup Gap Harness Engineering di Proyek Ini

> **Latar:** hasil audit di `RISET-Harness-Engineering-dan-Audit-Bab-27.md`. Verdict-nya: workflow Bab 27 **sudah sah sebagai harness engineering**, tetapi belum lengkap di lapisan yang justru paling memberi leverage. Dokumen ini adalah rencana eksekusinya — beserta **alasan terkuat** tiap gap dan **repo sumber** untuk mengisinya.
>
> **Tanggal:** 13 September 2026 · **Basis data repo:** bintang GitHub diambil via API pada 13 Sep 2026

---

## 0. RINGKASAN SATU HALAMAN

| # | Gap | Alasan terkuat (satu baris) | Solusi | Prioritas |
|---|---|---|---|---|
| **1** | Tidak ada **mechanical enforcement** (lint kustom / structural test) | Constraint tekstual *"rots instantly"* & *"hard to verify mechanically"*; yang mekanis jadi **multiplier** — sekali dikodekan, berlaku di seluruh codebase sekaligus (OpenAI) | Skill baru `/constraint-forge` + 2 skill vendor | **P1** |
| **2** | Tidak ada **entropy garbage collection** terjadwal | Tim OpenAI awalnya buang **20% waktu tiap Jumat** membersihkan "AI slop"; setelah diotomasi, cleanup **scale proporsional** dengan throughput generasi kode | Skill baru `/entropy-scan` + automation terjadwal + 2 skill vendor | **P1** |
| **3** | Tidak ada **cost envelope** per task | Cost overrun bukan cuma pemborosan — ia **sinyal reliabilitas**. Harness yang tidak punya plafon tidak bisa membedakan "mahal karena sulit" dari "mahal karena loop" | Skill baru `/cost-envelope` + integrasi gateway | **P2** |
| **4** | Tidak ada **metrik kualitas harness itu sendiri** | Fowler: *"If sensors never fire, is that high quality or inadequate detection mechanisms?"* Kita tidak tahu apakah checklist P1 menangkap masalah atau cuma formalitas | Skill baru `/harness-audit` + eval framework | **P2** |
| **5** | Tidak ada desain **ACI / tool interface** | ACI disebut *"the most imitated idea in coding agents"*; LangChain menempatkan *tool choice* sebagai 1 dari 3 knob paling berdampak | Skill vendor `api-and-interface-design` + referensi ACI | **P3** |
| **6** | **Context engineering** belum diformalkan sebagai keputusan sadar | LangChain: *"Context assembly is still difficult for agents today"*; harness tanpa strategi context = agent kehilangan jejak di tugas panjang | Skill vendor `context-engineering` | **P3** |
| **7** | Verifikasi belum **adversarial** & belum ada verifikasi runtime browser yang setara CDP | Bab 27 sudah punya `/browser-skill`, tapi belum ada *"ensure the fix is actually fixed"* sebagai skill tersendiri | 4 skill vendor (superpowers + addyosmani) | **P3** |

**Ringkasnya:** 4 skill baru buatan sendiri + **12 skill vendor** dari 2 repo yang sudah dipakai proyek ini. Total 4 gelombang.

---

## 1. PRINSIP PERENCANAAN

Rencana ini mengikuti konvensi proyek sendiri — bukan aturan baru:

1. **Satu gap = satu sprint.** Tidak ada jalur pintas. Mengikuti Bab 27.6 ("Tidak ada jalur pintas ke builder. Fitur/revisi/ganti fitur = sprint baru melalui perencanaan").
2. **Skill buatan sendiri → `skills/`; skill pihak ketiga → `skills-vendor/` verbatim, tanpa modifikasi.** Mengikuti pola 27.4b yang sudah dipakai untuk 3 skill addyosmani/superpowers.
3. **Setiap skill baru wajib punya struktur lengkap** seperti `skills/sprint-planner/SKILL.md`: frontmatter (`name`, `description`, `license`, `compatibility`) → `Input` → `Workflow` (langkah bernomor) → `Rules` (MUST / MUST NOT) → `False Positives` (tabel) → `Next Step` → `Materi Reference (WAJIB)`.
4. **Setiap skill wajib memanggil `/materi-reference`** sebelum bertindak, dan mengutip nomor bab.
5. **Skill vendor harus dicatat di `skills-lock.json`** dengan `source` / `sourceType` / `skillPath` / `computedHash` (lihat §9 — ada temuan kecil di sini).
6. **Aturan "lebih formal" (27.6.4) berlaku**: kalau ragu antara menambal langsung atau bikin skill, pilih bikin skill.

**Urutan pengerjaan ditentukan oleh rasio leverage/effort**, bukan urutan gap secara alfabetis. Gap 1 dan 2 dikerjakan lebih dulu karena keduanya mengubah aturan dari *deskriptif* menjadi *mekanis* — dan itu titik di mana sebagian besar leverage berada.

---

## 2. GAP 1 — MECHANICAL ENFORCEMENT

### 2.1 Alasan terkuat

Ini gap dengan leverage terbesar, dan alasannya datang dari tiga sumber independen yang konvergen.

**a) Aturan tekstual tidak bertahan.** OpenAI, dalam artikel harness engineering mereka, menyatakan secara eksplisit mengapa file instruksi monolitik gagal:

> "A monolithic instruction file fails because it **crowds out task context**, causes agents to **pattern-match locally** instead of navigating intentionally, **rots instantly** as rules go stale, and is **hard to verify mechanically**."

Tiga dari empat alasan itu persis berlaku untuk cara Bab 27 menegakkan aturan saat ini (`DILARANG pakai library di luar BLUEPRINT.MD`, checklist P1, dll.): ditulis dalam teks, dibaca oleh agent, tidak ada yang memverifikasi secara mekanis bahwa aturan itu benar-benar ditegakkan.

**b) Yang mekanis adalah multiplier, bukan biaya tambahan.** Ini argumen paling kuat dari OpenAI:

> "In a human-first workflow, strict linting rules might feel pedantic. **With agents, they become multipliers** — once encoded, they apply everywhere at once, preventing drift across a million-line codebase generated at high throughput."

Logikanya: lint rule ditulis **sekali**, tapi menegakkan diri di **setiap** perubahan kode, selamanya, tanpa perlu diingat. Dibandingkan dengan instruksi teks yang harus dibaca ulang agent di setiap sesi, rasio output/input-nya berbeda orde besaran.

**c) Fowler menempatkan ini sebagai sensor computational — kelas sensor yang paling bisa dipercaya.** Dalam kerangka guides/sensors, kontrol *computational* (deterministik, cepat, murah) adalah yang paling bisa diandalkan; kontrol *inferential* (LLM-as-judge) mahal dan probabilistik. Bab 27 saat ini **condong berat ke inferential**: acceptance-runner menafsirkan kriteria, impeccable melakukan critique, ai-coding-coach menilai dry run. Itu semua berharga — tapi tidak deterministik.

Dan yang paling penting, Fowler menyebut apa yang **tidak** bisa ditangkap oleh keduanya:

> "**Neither catches reliably** some of the higher-impact problems: misdiagnosis of issues, overengineering and unnecessary features, misunderstood instructions."

Artinya menambah sensor computational **bukan** menggantikan sensor inferential — ia menutup kelas masalah yang berbeda. Sekarang kelas masalah *struktural* (duplikasi, kompleksitas, drift arsitektur, pelanggaran gaya) **tidak punya sensor sama sekali** di Bab 27.

**d) Bukti empiris bahwa ini bekerja.** LangChain menaikkan skor agent dari 52.8% ke 66.5% **tanpa mengganti model** — hanya dengan mengubah harness. OpenAI mengirim produk 1 juta baris dengan 0 baris kode manual, dan kuncinya adalah *"investing in environment design, feedback loops, and agent tooling rather than writing code directly."*

### 2.2 Solusi: skill baru `/constraint-forge`

**Tujuan:** mengubah `BLUEPRINT.MD` + `DECISIONS.MD` + `AGENTS.MD` menjadi artefak yang **ditegakkan mesin**, bukan dibaca manusia.

**Posisi dalam pipeline:** Tahap 3 (Architect Pack), dijalankan **setelah** `/sprint-planner` dan **sebelum** handoff ke builder. Bisa juga dipanggil ulang tiap sprint baru.

**Input:**
- `planning/sprints/sprint-XXX/BLUEPRINT.MD` (daftar file + batas modul)
- `DECISIONS.MD` (ADR — keputusan arsitektur yang harus dijaga)
- `AGENTS.MD` (aturan proyek)
- `DOMAIN.MD` (aturan domain/keamanan)

**Output — folder `constraints/` di root proyek:**

```
constraints/
├── README.md                  ← peta: rule mana menjaga keputusan mana
├── lint/
│   ├── <rule-name>.yml        ← aturan lint kustom (ast-grep / ESLint / Semgrep)
│   └── messages/              ← PESAN ERROR BERISI INSTRUKSI PERBAIKAN
├── structural/
│   └── boundaries.*           ← structural test batas modul
└── hooks/
    └── pre-commit             ← jalankan keduanya sebelum commit
```

**Aturan paling penting dari skill ini — dan ini yang membedakannya dari lint biasa:**

> Setiap pesan error **harus berisi instruksi perbaikan**, bukan sekadar deskripsi pelanggaran.

OpenAI menyebut ini sebagai teknik inti: *"Write custom lint error messages that **inject remediation instructions directly into agent context**, turning every violation into a learning opportunity for the agent."* Fowler menyebut pola yang sama *"a positive kind of prompt injection"* — sinyal yang dioptimalkan untuk konsumsi LLM.

Contoh bentuknya:

```
✗ SALAH:  "Import dari layer UI ke layer DB tidak diizinkan."
✓ BENAR:  "Import dari layer UI ke layer DB tidak diizinkan.
           Perbaikan: pindahkan query ini ke src/data/repositories/<nama>.ts,
           lalu panggil lewat repository interface. Jangan tambahkan
           adapter baru — lihat DECISIONS.MD ADR-004."
```

Bedanya besar: yang pertama agent harus mencari tahu sendiri; yang kedua agent langsung tahu apa yang harus dilakukan. Yang kedua juga otomatis menjaga keputusan arsitektur tetap hidup (merujuk ADR).

**Workflow skill (7 langkah):**
1. Baca BLUEPRINT + DECISIONS + AGENTS + DOMAIN lewat `/materi-reference`
2. Ekstrak **invariant** — keputusan yang harus selalu benar (arah dependency, batas modul, konvensi nama, batas ukuran file, aturan logging)
3. Pilih tool per bahasa (tabel §2.3)
4. Generate rule + pesan error yang berisi instruksi perbaikan + rujukan ADR
5. Generate structural test batas modul
6. Pasang pre-commit hook
7. **Verifikasi sensor menyala** — sengaja langgar satu aturan, pastikan lint menangkap. Kalau tidak menyala, sensornya rusak (lihat Gap 4)

**Kriteria selesai (harus bisa dibuktikan, bukan diklaim):**
- [ ] Ada ≥1 lint rule untuk setiap invariant di DECISIONS.MD
- [ ] Setiap pesan error berisi instruksi perbaikan + rujukan ADR
- [ ] Pre-commit hook menolak commit yang melanggar
- [ ] Dibuktikan dengan output nyata: pelanggaran sengaja → lint menyala → pesan terbaca agent
- [ ] Cross-check: agent diberi pelanggaran, **tanpa diberi tahu**, apakah ia memperbaiki sendiri dari pesan lint? (uji kualitas pesan)

### 2.3 Repo sumber — Gap 1

**Skill vendor (paling langsung mengisi gap):**

| Skill | Repo | ⭐ | Mengapa |
|---|---|---|---|
| **`constraint-driven-development`** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 93.9k | **Paling relevan dari semua.** "Interviews you for a quality bar, writes CONSTRAINTS.md, and **catches agents silencing checks or skipping tests to get green**" — persis masalah yang belum tertangani di Bab 27 |
| **`ci-cd-and-automation`** | addyosmani/agent-skills | 93.9k | Shift Left, quality gate pipelines, failure feedback loops — menempatkan sensor di pipeline |
| **`test-driven-development`** | addyosmani/agent-skills | 93.9k | Red-Green-Refactor, test pyramid 80/15/5, DAMP over DRY, Beyonce Rule |

**Tool lint & structural test:**

| Tool | Repo | ⭐ | Bahasa / peran |
|---|---|---|---|
| **ast-grep** | [ast-grep/ast-grep](https://github.com/ast-grep/ast-grep) | 15.9k | **Pilihan utama** — lint kustom lintas bahasa via pola AST di YAML; punya `sg scan` + auto-fix |
| **Semgrep** | [semgrep/semgrep](https://github.com/semgrep/semgrep) | 16.6k | Aturan semantik; kuat untuk aturan keamanan |
| **ESLint** | [eslint/eslint](https://github.com/eslint/eslint) | 27.5k | Custom rules JS/TS (de facto standar) |
| **typescript-eslint** | [typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) | 16.4k | Rule type-aware |
| **Biome** | [biomejs/biome](https://github.com/biomejs/biome) | 25.8k | Alternatif cepat, satu konfigurasi |
| **dependency-cruiser** | [sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser) | 7.2k | **Batas modul JS/TS** — padanan ArchUnit untuk ekosistem JS |
| **ArchUnit** | [TNG/ArchUnit](https://github.com/TNG/ArchUnit) | 3.8k | Structural test Java/Kotlin — yang dirujuk langsung oleh Fowler |
| **import-linter** | [seddonym/import-linter](https://github.com/seddonym/import-linter) | 1.2k | Batas modul Python |
| **Deptrac** | [deptrac/deptrac](https://github.com/deptrac/deptrac) | 3.0k | "Keep your architecture clean" — PHP |

**Catatan penting:** Fowler menyebut ArchUnit dan dependency-cruiser sebagai contoh **fitness function** untuk kategori *architecture fitness harness*. Pilih satu sesuai bahasa proyek — jangan pasang semuanya.

---

## 3. GAP 2 — ENTROPY GARBAGE COLLECTION

### 3.1 Alasan terkuat

**a) Ada angka konkret tentang biayanya.** OpenAI mengukur persis berapa mahal tidak punya GC:

> "The team initially spent **20% of their week (every Friday) manually cleaning up 'AI slop.'** By automating this into background Codex tasks with codified principles, they **scaled cleanup proportionally to code generation throughput**."

Dua puluh persen waktu engineering hilang ke pekerjaan yang bisa diotomasi. Dan kalimat kedua adalah kuncinya: setelah diotomasi, cleanup **tumbuh sebanding** dengan produksi kode. Artinya: makin produktif agent, makin besar nilainya. Sistem tanpa GC akan makin tertinggal seiring makin cepatnya agent menulis kode — ini **utang yang bertambah secara eksponensial**.

**b) Diagnosisnya sudah ditulis persis untuk masalah ini.** Literatur "Vibe Coding → Harness Engineering" mengidentifikasi mekanisme kegagalannya:

> "**Komponen transisi yang tidak benar-benar dipensiunkan, akhirnya menjadi host default yang baru.**"

Dan:

> "Sebuah compat layer yang tidak dipensiunkan akan terus menyerap logika baru — membaca banyak state, menambah field, menambah fallback — sampai ia menjadi **'jalur utama yang paralel secara semantik'**."

Ini bukan teori abstrak. Ini persis pola yang muncul kalau wrapper/adapter lama dibiarkan hidup: agent berikutnya melihatnya sebagai "tempat legal untuk menggantung logika", karena **codebase itu sendiri menjadi prior arsitektur bagi agent**. Bab 27 sudah punya pola dekomisi (27.6.3), tapi hanya dipicu oleh keputusan manusia — bukan dipindai secara berkala.

**c) Sudah ada preseden internal di proyek ini.** Bab 27.6.3 sudah menyebut *"cek dependensi yatim (library yang hanya dipakai fitur X — kini boleh dibuang)"* sebagai langkah audit keamanan. Jadi konsepnya sudah ada; yang kurang adalah **mekanisme + jadwal**.

**d) Fowler menegaskan ini pekerjaan berkelanjutan, bukan sekali konfigurasi.**

> "Building this outer harness is emerging as an **ongoing engineering practice, not a one-time configuration.**"

Dan ia menyebut drift sebagai hal yang perlu sensor terpisah:

> "What type of drift accumulates gradually and should be monitored by **sensors running continuously against the codebase, outside the change lifecycle**? (e.g. dead code detection, analysis of the quality of the test coverage, dependency scanners)"

Kalimat *"outside the change lifecycle"* adalah tepat apa yang Bab 27 belum punya.

### 3.2 Solusi: skill baru `/entropy-scan` + automation terjadwal

**Tujuan:** memindai penyimpangan dari "golden principles" dan **membuka PR refactoring bertarget** — bukan menghasilkan laporan yang tidak dibaca.

**Posisi dalam pipeline:** **di luar siklus sprint.** Dijalankan berkala (mis. mingguan) atau setelah N sprint. Ini berbeda dari semua skill lain di Bab 27 yang terikat tahap.

**Dimensi yang dipindai:**

| Dimensi | Yang dicari | Tool |
|---|---|---|
| **Dead code** | Ekspor/fungsi/file yang tidak lagi dipakai | knip, vulture |
| **Duplikasi** | Blok kode berulang, duplikasi semantik | jscpd |
| **Drift arsitektur** | Dependency yang melanggar batas (regresi dari `/constraint-forge`) | dependency-cruiser, ArchUnit |
| **Wrapper/zombie** | Adapter/bridge/compat layer yang sudah lewat masa transisi | analisis + heuristik |
| **Dependensi yatim** | Library yang hanya dipakai fitur yang sudah dihapus | auditor |
| **Drift dokumentasi** | BLUEPRINT/DECISIONS vs kode aktual | cross-check |

**Aturan output (penting):** setiap temuan harus keluar sebagai **satu PR kecil bertarget**, bukan satu laporan besar. Alasannya persis prinsip OpenAI: *"corrections become cheap while waiting becomes expensive."* PR kecil bisa di-merge cepat; laporan menumpuk jadi utang baru.

**Kaitan dengan `/state-keeper`:** setiap pemindaian mencatat di `STATE.MD` berapa temuan, berapa yang diperbaiki, berapa yang ditunda ke `RISKS.MD`. Ini sekaligus memberi data untuk Gap 4.

**Golden principles — di mana ditulis?** Di `AGENTS.MD` atau file baru `GOLDEN-PRINCIPLES.md`, diturunkan dari `DECISIONS.MD`. Sama seperti OpenAI: *"scan for deviations from 'golden principles'"*. Ini penting — tanpa acuan tertulis, pemindaian jadi subjektif.

**Kriteria selesai:**
- [ ] Ada dokumen golden principles tertulis
- [ ] Pemindaian menghasilkan PR bertarget (bukan laporan)
- [ ] Ada jadwal (automation) yang berjalan tanpa diingat manusia
- [ ] Setiap temuan punya jalur: fix langsung / sprint baru / RISKS.MD

### 3.3 Repo sumber — Gap 2

**Skill vendor:**

| Skill | Repo | ⭐ | Mengapa |
|---|---|---|---|
| **`deprecation-and-migration`** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 93.9k | "Code-as-liability mindset, compulsory vs advisory deprecation, migration patterns, **zombie code removal**" — langsung mengisi pola dekomisi 27.6.3 |
| **`code-simplification`** | addyosmani/agent-skills | 93.9k | Chesterton's Fence, Rule of 500 — "reduce complexity while preserving exact behavior". Ini "GC untuk kompleksitas" |

**Tool deteksi:**

| Tool | Repo | ⭐ | Peran |
|---|---|---|---|
| **knip** | [webpro-nl/knip](https://github.com/webpro-nl/knip) | 12.3k | Dead code + dependensi + ekspor tak terpakai (JS/TS) |
| **jscpd** | [kucherenko/jscpd](https://github.com/kucherenko/jscpd) | 6.2k | Copy/paste detector 224 bahasa. **Punya agent skill bawaan** ("find and fix code duplication") + GitHub Action yang gagal-kan build |
| **vulture** | [jendrikseipp/vulture](https://github.com/jendrikseipp/vulture) | 4.8k | Dead code Python |
| **SonarQube** | [SonarSource/sonarqube](https://github.com/SonarSource/sonarqube) | 11.0k | Platform penuh — technical debt, code smells (lebih berat, untuk proyek besar) |

**Catatan:** `jscpd` menarik secara khusus karena sudah menyediakan agent skill bawaan — bisa jadi contoh pola untuk skill buatan sendiri.

---

## 4. GAP 3 — COST ENVELOPE

### 4.1 Alasan terkuat

**a) Cost overrun adalah sinyal reliabilitas, bukan sekadar pemborosan.** Ini poin yang mudah terlewat. Dari anatomi harness:

> "**Cost envelope management** — A per-task budget ceiling enforced regardless of agent/retry intentions. **Also serves as a reliability signal.**"

Logikanya: agent yang menghabiskan 10x budget normal untuk tugas sederhana kemungkinan besar sedang **loop**, salah membaca spec, atau menebak-nebak. Plafon biaya berfungsi sebagai **alarm dini** untuk masalah yang tidak tertangkap sensor lain. Tanpa plafon, masalah itu tidak terlihat sampai manusia memperhatikan tagihan.

**b) Agent tidak punya konsep waktu/biaya.** LangChain menemukan ini secara empiris:

> "**Agents are famously bad at time estimation** so this heuristic helps in this environment. Real world coding usually doesn't have strict time limits, but **without adding any knowledge of constraints, agents won't work within time bounds.**"

Solusi mereka bukan menyalahkan agent — mereka **menginjeksi peringatan budget** ke context. Dan hasilnya terukur: hanya `xhigh` (reasoning maksimal terus-menerus) skornya **53.9%** karena timeout, sedangkan `high` mencapai **63.6%**. Artinya **membatasi budget justru menaikkan hasil** — bukan menurunkannya. Ini counter-intuitive dan penting.

**c) Yang ada di Bab 27 baru setengah.** Saat ini hanya ada batas putaran (maks 5 untuk acceptance rework) dan satu peringatan kualitatif (*"Jangan QA tanpa akhir — boros uang user"* di `/impeccable`). Tidak ada plafon token/biaya yang bisa ditegakkan, dan tidak ada yang membaca plafon itu sebagai sinyal.

### 4.2 Solusi: skill baru `/cost-envelope`

**Tujuan:** menetapkan plafon per-sprint/per-task, dan memperlakukan pelanggaran plafon sebagai **temuan reliabilitas**.

**Posisi:** Tahap 3 (bersama `/sprint-planner`) untuk **menetapkan** plafon; Tahap 6 (bersama `/acceptance-runner`) untuk **memeriksa** pelanggaran.

**Artefak:**
- Tambahan ke `ACCEPTANCE.MD`: blok `## Budget` — plafon token/biaya + plafon durasi wall-clock
- Tambahan ke `STATE.MD`: kolom pemakaian aktual vs plafon per sprint
- Aturan: pelanggaran plafon **bukan** kegagalan builder — ia **temuan harness**. Diagnosa: apakah harness-nya kurang konteks, kurang tool, atau ada loop?

**Repo sumber — Gap 3:**

| Tool | Repo | ⭐ | Peran |
|---|---|---|---|
| **LiteLLM** | [BerriAI/litellm](https://github.com/BerriAI/litellm) | 58.6k | Gateway + **budget & virtual keys** — penegakan plafon di level routing, berlaku lintas model |
| **Langfuse** | [langfuse/langfuse](https://github.com/langfuse/langfuse) | 34.5k | Observability + cost analytics; bisa membaca trace LiteLLM |
| **Helicone** | [Helicone/helicone](https://github.com/Helicone/helicone) | 6.2k | Logging proxy + spend monitoring |
| **OpenLLMetry** | [traceloop/openllmetry](https://github.com/traceloop/openllmetry) | 7.4k | OpenTelemetry untuk LLM — menyatukan trace LLM dengan trace aplikasi |
| **Arize Phoenix** | [Arize-ai/phoenix](https://github.com/Arize-ai/phoenix) | 11.4k | Tracing + eval, bisa self-host |

**Catatan integrasi:** proyek ini sudah punya `observability-and-instrumentation` (vendor, verbatim — **tidak boleh dimodifikasi**). Karena itu cost envelope harus jadi **skill terpisah** yang *melengkapi*, bukan mengubah skill vendor tersebut. Ini konsisten dengan aturan 27.4b.

---

## 5. GAP 4 — METRIK KUALITAS HARNESS

### 5.1 Alasan terkuat

**a) Ini pertanyaan terbuka yang diakui belum terpecahkan.** Fowler merumuskannya dengan tajam:

> "**If sensors never fire, is that a sign of high quality or inadequate detection mechanisms?** We need a way to evaluate harness coverage and quality similar to what code coverage and mutation testing do for tests."

Kutipan ini penting karena menunjukkan **tidak ada jawaban standar di industri** — jadi proyek ini tidak bisa menyalin solusi orang. Tapi justru karena itu, menaruh metrik sederhana di sini akan menempatkan proyek di depan praktik umum.

**b) Tanpa metrik, Bab 27 tidak bisa membedakan "aman" dari "buta".** Contoh konkret: checklist P1 di `/deploy-production-gate` punya banyak item. Kalau selama 5 sprint tidak satu pun pernah gagal — apakah itu tanda kualitas tinggi, atau tanda checklist-nya terlalu longgar / dilewati? Saat ini tidak ada cara menjawabnya.

**c) Evaluasi harness adalah bagian dari loop, bukan tambahan.** Fowler menyebut harness coverage sebagai bagian dari pekerjaan berkelanjutan; LangChain menjadikan *trace analysis* sebagai skill tersendiri (*Trace Analyzer Skill*) yang berjalan sebagai **loop perbaikan**: fetch trace → spawn parallel error analysis agents → sintesis → perubahan bertarget ke harness. Tanpa mengukur, loop ini tidak punya input.

### 5.2 Solusi: skill baru `/harness-audit`

**Tujuan:** mengukur apakah harness-nya sendiri bekerja, dan mengubah hasilnya menjadi perbaikan harness.

**Metrik minimum (jangan muluk-muluk di awal):**

| Metrik | Definisi | Sinyal buruk |
|---|---|---|
| **Sensor fire rate** | Berapa kali tiap sensor menyala per sprint | 0 selama ≥3 sprint → curigai deteksinya |
| **Escaped defects** | Bug yang lolos ke produksi padahal ada sensor yang seharusnya menangkap | Ada sensor relevan tapi tidak menyala |
| **Rework rate** | Berapa putaran acceptance-runner sampai PASS | Naik terus → harness kurang konteks |
| **Dry-run accuracy** | Berapa kali laporan dry run sesuai kenyataan build | Rendah → BLUEPRINT kurang jelas |
| **Budget adherence** | Pemakaian vs plafon (Gap 3) | Overrun berulang → loop tak terdeteksi |

**Alur:** kumpulkan data dari `STATE.MD` → identifikasi sensor yang tidak pernah menyala → **uji apakah sensor itu rusak** (sengaja masukkan pelanggaran, lihat apakah tertangkap) → perbaiki harness.

**Ini adalah steering loop yang diinstrumentasi.** Fowler mendefinisikan steering loop sebagai pekerjaan utama manusia: *"Whenever an issue happens multiple times, the feedforward and feedback controls should be improved."* `/harness-audit` adalah cara sistematis menemukan *"issue happens multiple times"* sebelum manusia menyadarinya.

**Repo sumber — Gap 4:**

| Tool | Repo | ⭐ | Peran |
|---|---|---|---|
| **promptfoo** | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | 25.1k | Eval + red-team deklaratif, ramah CI. Dipakai ratusan ribu developer; diakuisisi OpenAI Maret 2026, tetap MIT |
| **DeepEval** | [confident-ai/deepeval](https://github.com/confident-ai/deepeval) | 18.2k | "Pytest for LLMs"; rilis 4.0 punya alur agent-native pada trace |
| **Inspect AI** | [UKGovernmentBEIS/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai) | 2.8k | Framework eval dari UK AI Security Institute |
| **agentevals** | [langchain-ai/agentevals](https://github.com/langchain-ai/agentevals) | 720 | **Khusus trajectory** — nilai jalur & tool call, bukan cuma jawaban akhir |
| **openevals** | [langchain-ai/openevals](https://github.com/langchain-ai/openevals) | 1.2k | Evaluator siap pakai (LLM-as-judge, structured output, tool-call) |
| **Strands Evals** | [strands-agents/evals](https://github.com/strands-agents/evals) | 193 | **Detectors** untuk root-cause otomatis dari trace; baca OpenTelemetry |
| **autoevals** | [braintrustdata/autoevals](https://github.com/braintrustdata/autoevals) | 1.0k | Scorer drop-in |

**Warisan historis (untuk pemahaman, bukan untuk dipasang):** [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) (14.0k), [SWE-bench/SWE-bench](https://github.com/SWE-bench/SWE-bench) (5.8k), [stanford-crfm/helm](https://github.com/stanford-crfm/helm) (2.9k), [google/oss-fuzz](https://github.com/google/oss-fuzz) (12.6k). Ini menunjukkan bahwa pola *harness* sudah ada 40 tahun — bukan konsep baru.

**Catatan penting:** artikel pembanding menegaskan *"Don't judge by star count"* — repo paling banyak bintang seringkali platform observability yang menambahkan eval sebagai fitur, sedangkan tool eval agent yang purpose-built lebih baru dan lebih kecil. **Cocokkan tool dengan pekerjaan, bukan dengan popularitas.**

---

## 6. GAP 5–7 — LAPIS PELENGKAP (SKILL VENDOR)

Ketiga gap ini lebih murah: tidak perlu membangun tool, cukup **mengadopsi skill vendor yang sudah matang**. Repo sumbernya adalah dua repo yang **sudah dipakai proyek ini** — jadi tidak ada dependensi baru.

### 6.1 Gap 5 — ACI / desain interface tool

**Alasan terkuat:** SWE-agent (Princeton) menjadikan ACI — *Agent-Computer Interface* — sebagai kontribusi utamanya, analog HCI tapi untuk agent. Ia disebut *"the most imitated idea in coding agents."* LangChain menempatkan *tool choice* sebagai salah satu dari **tiga knob** paling berdampak pada harness (dua lainnya: system prompt, middleware).

Artinya: **bentuk interface tool menentukan seberapa baik agent bekerja**, dan ini bisa didesain — bukan sekadar diwarisi dari tool vendor.

**Solusi:** adopsi skill vendor `api-and-interface-design` (contract-first design, Hyrum's Law, One-Version Rule, error semantics, boundary validation).

**Repo referensi:** [SWE-agent/SWE-agent](https://github.com/SWE-agent/SWE-agent) (20.3k), [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) (87.7k — ACI + evaluation harness sebagai objek SDK kelas satu), [langchain-ai/deepagents](https://github.com/langchain-ai/deepagents) (29.4k — "batteries-included agent harness": `write_todos`, virtual filesystem, planning/context/subagent/checkpoint sebagai primitif).

### 6.2 Gap 6 — Context engineering

**Alasan terkuat:** LangChain menyebut context assembly sebagai prinsip #1 mereka:

> "**Context assembly is still difficult for agents today**, especially in unseen environments. Onboarding models with context like directory structures, available tools, coding best practices, and problem solving strategies helps **reduce the error surface** for poor search and avoidable errors in planning."

Dan Fowler menegaskan hubungannya: *"Engineering a user harness for a coding agent is a **specific form of context engineering**."* Jadi context engineering bukan topik lain — ia **lapisan di dalam** harness engineering.

**Solusi:** adopsi skill vendor `context-engineering` (rules files, context packing, MCP integrations). Melengkapi `/materi-reference` yang sudah ada.

### 6.3 Gap 7 — Verifikasi adversarial & runtime browser

**Alasan terkuat:** OpenAI menyebut pergeseran bottleneck mereka secara eksplisit:

> "The team's bottleneck shifted from **code throughput to human QA capacity**. By making the application itself inspectable by agents, they enabled **autonomous bug reproduction, fix validation, and performance verification** without human intervention."

Mekanismenya: **Chrome DevTools Protocol di-wire ke runtime agent** + aplikasi bootable per git worktree + local observability stack (LogQL/PromQL/TraceQL).

Bab 27 sudah punya `/browser-skill` yang mengambil screenshot — jadi arahnya benar. Yang belum ada:
1. **Akses runtime browser yang kaya** (DOM snapshot, console log, network trace, profiling) — bukan hanya screenshot
2. **Skill khusus "pastikan fix benar-benar fixed"** sebagai langkah tersendiri
3. **Review adversarial fresh-context** yang eksplisit

**Solusi — 4 skill vendor:**

| Skill | Repo | ⭐ | Mengapa |
|---|---|---|---|
| **`browser-testing-with-devtools`** | addyosmani/agent-skills | 93.9k | Chrome DevTools MCP untuk data runtime live — **padanan langsung** dari wiring CDP di OpenAI |
| **`verification-before-completion`** | [obra/superpowers](https://github.com/obra/superpowers) | 286.1k | "Ensures the fix is **actually** fixed before declaring success" — menutup celah "kode sudah diubah ≠ bug fixed" |
| **`doubt-driven-development`** | addyosmani/agent-skills | 93.9k | Review adversarial fresh-context (CLAIM → EXTRACT → DOUBT → RECONCILE → STOP) |
| **`subagent-driven-development`** | obra/superpowers | 286.1k | Iterasi cepat dengan subagent per task + review dua tahap (spec compliance + kualitas). ⚠️ **Punya ketergantungan model — wajib override, lihat §6.4** |
| **`dispatching-parallel-agents`** | obra/superpowers | 286.1k | Dispatch satu subagent per domain masalah independen. ✅ 0 rujukan model — aman apa adanya |
| **`using-git-worktrees`** | obra/superpowers | 286.1k | Isolasi workspace via `git worktree` + verifikasi baseline test. ✅ 0 rujukan model — aman apa adanya |

### 6.4 Batasan Lingkungan: Model Gratis Multi-Provider

**Kondisi:** proyek ini memakai model gratis dari beberapa provider, tanpa jaminan akses ke model tier atas.

**Konsekuensinya terhadap adopsi skill vendor — sudah diperiksa satu per satu terhadap isi aslinya:**

| Skill | Rujukan model | Keputusan |
|---|---|---|
| `using-git-worktrees` | **0** | ✅ Adopsi apa adanya |
| `dispatching-parallel-agents` | **0** | ✅ Adopsi apa adanya |
| `subagent-driven-development` | **9 di SKILL.md + field `[MODEL]` WAJIB di 3 file template** | ⚠️ Adopsi **dengan override** |

**Klausa yang bermasalah** (kutipan verbatim dari `subagent-driven-development/SKILL.md`):

> "**Architecture and design tasks**: use the most capable available model."
>
> "**Fix-loop escalation (rounds 4-5)**: use a model at least one tier above the implementer that got stuck."
>
> "**Always specify the model explicitly when dispatching a subagent.**"

Dan di ketiga file template-nya (`implementer-prompt.md`, `task-reviewer-prompt.md`, `re-review-prompt.md`):

```
model: [MODEL — REQUIRED: choose per SKILL.md Model Selection; an omitted
        model silently inherits the session's most expensive one]
```

**Mengapa ini masalah:** *"most capable available model"* adalah instruksi yang **tidak bisa dijalankan** di lingkungan model gratis multi-provider — agent tidak punya dasar sah untuk menilai kemampuan model, sehingga ia akan **menebak**. Dan karena field `[MODEL]` bersifat **WAJIB**, agent tidak bisa mengabaikannya; ia harus mengisi sesuatu.

**Solusi — tiga lapis, tanpa mengubah file vendor:**

| Lapis | Artefak | Fungsi |
|---|---|---|
| **1. Kebijakan** | `MODEL-POLICY.md` (root) | Sumber kebenaran tunggal: aturan R1–R8 + deklarasi manusia (peran → model). **Tanpa default apa pun** |
| **2. Registry override** | `skills-vendor/OVERRIDES.md` | Mencatat klausa vendor mana yang dinetralkan (O-1…O-4) + penggantinya + alasan. Menjaga file vendor tetap **verbatim** sesuai 27.4b |
| **3. Enforcement** | blok di `AGENTS.MD` | Karena aturan harus dibaca tiap sesi, dan `AGENTS.MD` adalah file pertama dalam urutan Bab 7.1 |

**Tiga keputusan desain yang penting:**

1. **Field `[MODEL]` yang WAJIB itu justru menguntungkan.** Karena wajib, ia menjadi titik kontrol yang bersih: kita tidak melawan skill-nya, kita **mengisi placeholder-nya lebih dulu** dari tabel. Agent jadi tidak memilih — ia menyalin.

2. **Tidak ada default — agent berhenti dan bertanya.** Nilai model hanya boleh berasal dari manusia: deklarasi di tabel §3.2, perkataan manusia di percakapan, atau blok kebijakan di `AGENTS.MD`. Di luar itu → **STOP**, bukan menebak. Ini penting karena satu tebakan yang lolos akan tercatat di ledger sebagai keputusan, lalu dipakai lagi oleh dispatch berikutnya — kesalahan kecil di awal menyebar ke seluruh alur.

3. **Eskalasi kemampuan diganti eskalasi bentuk.** Klausa *"rounds 4-5: use a model at least one tier above"* adalah jalan keluar utama skill saat tugas macet. Di lingkungan model tetap, jalan keluar itu tidak tersedia — jadi harus diganti, bukan dihapus. Penggantinya: `resume → fresh eyes (model SAMA) → re-scope (pecah brief) → manusia`. Prinsipnya: **ketika kemampuan model tidak bisa ditambah, yang ditambah adalah kejelasan spec dan kecilnya tugas.**

**Dampak ke sprint H-006:** sprint ini mendapat satu prasyarat baru — `MODEL-POLICY.md` + `OVERRIDES.md` + blok `AGENTS.MD` harus ada **sebelum** `subagent-driven-development` disalin ke `skills-vendor/`. Kalau tidak, skill itu akan langsung mencari "model yang lebih mampu" pada kegagalan pertama.

---

## 7. ROADMAP — 4 GELOMBANG

Setiap sprint mengikuti ritel 27.3: `/sprint-planner` → dry run → build → `/acceptance-runner` → `/security-dependency-auditor` → `/deploy-production-gate` (bila rilis) → `/state-keeper`.

### GELOMBANG 1 — Mekanis (P1)

| Sprint | Isi | Artefak | Sumber |
|---|---|---|---|
| **H-001** | `/constraint-forge` — generate lint + structural test + pre-commit | `skills/constraint-forge/SKILL.md` + `constraints/` di proyek target | ast-grep, dependency-cruiser/ArchUnit + vendor `constraint-driven-development`, `ci-cd-and-automation` |
| **H-002** | `/entropy-scan` + automation terjadwal | `skills/entropy-scan/SKILL.md` + `GOLDEN-PRINCIPLES.md` + automation | knip, jscpd, vulture + vendor `deprecation-and-migration`, `code-simplification` |

**Mengapa dua ini lebih dulu:** keduanya mengubah aturan dari *deskriptif* → *mekanis*. Ini perubahan sifat, bukan penambahan fitur — dan itu sumber leverage terbesar.

### GELOMBANG 2 — Instrumen (P2)

| Sprint | Isi | Artefak | Sumber |
|---|---|---|---|
| **H-003** | `/cost-envelope` — plafon + pembacaan sebagai sinyal | `skills/cost-envelope/SKILL.md` + blok `## Budget` di ACCEPTANCE.MD | LiteLLM, Langfuse (atau Helicone) |
| **H-004** | `/harness-audit` — metrik sensor fire rate & escaped defects | `skills/harness-audit/SKILL.md` + kolom metrik di STATE.MD | promptfoo atau DeepEval; agentevals untuk trajectory |

**Ketergantungan:** H-004 butuh H-001 & H-002 selesai (untuk punya sensor yang bisa diukur) dan H-003 (untuk metrik budget). Jadi urutannya tidak bisa dibalik.

### GELOMBANG 3 — Adopsi skill vendor (P3)

| Sprint | Isi | Sumber |
|---|---|---|
| **H-005** | Adopsi `api-and-interface-design`, `context-engineering`, `browser-testing-with-devtools` | addyosmani/agent-skills |
| **H-006** | **Prasyarat dulu:** `MODEL-POLICY.md` + `skills-vendor/OVERRIDES.md` + blok model di `AGENTS.MD`. Lalu adopsi `verification-before-completion`, `doubt-driven-development`, `subagent-driven-development` (dengan override O-1…O-4), `dispatching-parallel-agents`, `using-git-worktrees` | obra/superpowers + addyosmani |

Semua masuk `skills-vendor/` **verbatim, tanpa modifikasi** — mengikuti pola 27.4b.

### GELOMBANG 4 — Integrasi dokumen

| Item | Aksi |
|---|---|
| **Bab 27** | Tambah **"Lapis 4 — Harness Mekanis"** berisi `/constraint-forge`, `/entropy-scan`, `/cost-envelope`, `/harness-audit`; perbarui tabel "Di Mana dan Kapan" (27.2) dan cheat sheet (27.5) |
| **Bab 19 (Glosarium)** | Tambah: *harness engineering*, *feedforward guide*, *feedback sensor*, *computational vs inferential control*, *ACI*, *cost envelope*, *entropy GC*, *steering loop* |
| **Bab 25 / 26** | Tambah kolom "sensor" di tabel kontrak folder; tambahkan sub-bab kerangka guides/sensors |
| **27.4b** | Tambah baris atribusi untuk 12 skill vendor baru (sumber + peran + pemetaan bab) |
| **`skills-lock.json`** | Daftarkan semua skill vendor baru (§9) |
| **`README.md`** | Perbarui daftar skill |

---

## 8. RISIKO & MITIGASI

| Risiko | Mitigasi |
|---|---|
| **Lint terlalu ketat → agent tersendat** | OpenAI memperingatkan "too much upfront guidance becomes **non-guidance**". Mulai dari **satu** invariant per sprint, ukur apakah menaikkan atau menurunkan throughput |
| **Lint rule ditulis manusia → tidak terawat** | OpenAI: *"have the agent itself build that missing capability into the repository."* `/constraint-forge` harus **men-generate** rule, bukan meminta manusia menulisnya |
| **Sensor menyala terus → alert fatigue** | Itu temuan untuk `/harness-audit`. Sensor yang selalu menyala berarti aturannya salah, bukan kodenya |
| **Skill baru menumpuk → kebingungan kapan pakai apa** | Wajib masuk tabel "Di Mana dan Kapan" (27.2) dengan kolom **"TIDAK dipakai kapan"** — kolom itu yang mencegah tumpang tindih |
| **Vendor skill hanyut dari upstream** | Catat di `skills-lock.json` + `skills-vendor/` untuk sinkronisasi ulang (pola yang sudah dipakai proyek) |
| **Agent memilih model sendiri saat tugas macet** | Ini risiko **paling mungkin terjadi** dan paling merusak di lingkungan model gratis multi-provider. Mitigasi: `MODEL-POLICY.md` + `OVERRIDES.md` + blok `AGENTS.MD` (§6.4), dan **uji khusus**: sengaja gagalkan satu tugas 4 kali, periksa apakah agent mencari "model yang lebih mampu" |
| **Override hanya di atas kertas, tidak dijalankan** | Aturan teks bisa "rots instantly" (kutipan OpenAI). Uji verifikasi §6 di `MODEL-POLICY.md` wajib dijalankan saat adopsi, bukan dilewati |
| **`MODEL-POLICY.md` tidak ikut tersalin ke proyek target** | Karena file ini per-proyek (ketersediaan model gratis bisa berbeda), jadikan langkah wajib di `/scaffolder` + daftar checklist handoff 27.7.1 |
| **Cost envelope → agent menyerah terlalu cepat** | LangChain: plafon justru **menaikkan** hasil (53.9% → 63.6%). Tapi tetap perlu tuning; mulai longgar, ketatkan bertahap |

**Risiko yang sengaja TIDAK dimitigasi:** perdebatan "harness akan dimakan model". Beberapa komponen (todolist, checkpoint, handoff control) kemungkinan besar akan diinternalisasi model. Rencana ini sengaja memprioritaskan **lapisan yang tahan lama** — constraint mekanis, entropi, trust/audit, pengalaman tacit — dan menempatkan skill yang paling mungkin usang (`subagent-driven-development`, `dispatching-parallel-agents`) di **gelombang terakhir**. Kalau model sudah menangani itu, gelombang 3 cukup dilewati.

---

## 9. TEMUAN KECIL YANG PERLU DIPERBAIKI

Saat menyiapkan rencana ini, ada satu inkonsistensi yang ditemukan:

**`skills-lock.json` tidak mencatat 3 skill vendor yang sudah ada.** Isinya saat ini hanya `firecrawl-deep-research` (dari `firecrawl/firecrawl-workflows`), padahal `skills-vendor/` sudah berisi:
- `observability-and-instrumentation` (addyosmani/agent-skills)
- `debugging-and-error-recovery` (addyosmani/agent-skills)
- `systematic-debugging` (obra/superpowers)

Padahal 27.4b menyatakan bahwa skill-skill itu disimpan di `skills-vendor/` **"untuk sinkronisasi ulang"** — dan sinkronisasi ulang butuh hash. Tanpa entri lock, tidak ada cara mendeteksi kalau upstream berubah.

**Perbaikan:** daftarkan ketiganya sekarang, lalu tambahkan 12 skill baru saat gelombang 3. Formatnya mengikuti entri yang sudah ada (`source`, `sourceType: "github"`, `skillPath`, `computedHash`).

---

## 10. KRITERIA KEBERHASILAN KESELURUHAN

Rencana ini berhasil kalau, setelah gelombang 1–2:

- [ ] Ada aturan proyek yang **ditegakkan mesin**, bukan hanya ditulis
- [ ] Ada sensor yang berjalan **di luar siklus sprint**
- [ ] Ada plafon biaya, dan pelanggarannya **dibaca sebagai sinyal**
- [ ] Kita bisa menjawab pertanyaan Fowler: *"sensor mana yang tidak pernah menyala, dan apakah itu karena kualitas atau deteksi yang lemah?"*
- [ ] Bab 27 menyebut istilah **harness engineering** dan memetakan skill-nya ke kerangka guides/sensors

Empat poin pertama mengubah harness dari **deskriptif** → **mekanis + terukur**. Poin kelima membuat kosakatanya bertahan lintas sesi.

---

## LAMPIRAN A — TABEL LENGKAP REPO SUMBER

⭐ diambil via GitHub API, 13 September 2026.

### A.1 Skill vendor (paling langsung mengisi gap)

| Repo | ⭐ | Skill yang diadopsi |
|---|---|---|
| [obra/superpowers](https://github.com/obra/superpowers) | **286,060** | `verification-before-completion`, `dispatching-parallel-agents`, `using-git-worktrees` (aman apa adanya), `subagent-driven-development` (**wajib override — §6.4**) (+ `systematic-debugging` sudah dipakai) |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | **93,892** | `constraint-driven-development`, `ci-cd-and-automation`, `deprecation-and-migration`, `code-simplification`, `browser-testing-with-devtools`, `api-and-interface-design`, `context-engineering`, `doubt-driven-development`, `test-driven-development` (+ 2 sudah dipakai) |

### A.2 Enforcement & struktur

| Repo | ⭐ | Peran |
|---|---|---|
| [eslint/eslint](https://github.com/eslint/eslint) | 27,501 | Custom lint rules |
| [biomejs/biome](https://github.com/biomejs/biome) | 25,773 | Lint+format cepat |
| [semgrep/semgrep](https://github.com/semgrep/semgrep) | 16,613 | Aturan semantik/keamanan |
| [typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) | 16,389 | Rule type-aware |
| [ast-grep/ast-grep](https://github.com/ast-grep/ast-grep) | 15,880 | **Lint kustom lintas bahasa via AST** |
| [sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser) | 7,168 | Batas modul JS/TS |
| [TNG/ArchUnit](https://github.com/TNG/ArchUnit) | 3,830 | Structural test Java/Kotlin |
| [deptrac/deptrac](https://github.com/deptrac/deptrac) | 3,014 | Batas arsitektur PHP |
| [seddonym/import-linter](https://github.com/seddonym/import-linter) | 1,176 | Batas modul Python |

### A.3 Entropy & dead code

| Repo | ⭐ | Peran |
|---|---|---|
| [webpro-nl/knip](https://github.com/webpro-nl/knip) | 12,250 | Dead code + dependensi |
| [SonarSource/sonarqube](https://github.com/SonarSource/sonarqube) | 10,978 | Technical debt platform |
| [kucherenko/jscpd](https://github.com/kucherenko/jscpd) | 6,203 | Duplikasi, 224 bahasa, punya agent skill |
| [jendrikseipp/vulture](https://github.com/jendrikseipp/vulture) | 4,809 | Dead code Python |

### A.4 Cost & observability

| Repo | ⭐ | Peran |
|---|---|---|
| [BerriAI/litellm](https://github.com/BerriAI/litellm) | 58,628 | Gateway + budget/virtual keys |
| [langfuse/langfuse](https://github.com/langfuse/langfuse) | 34,535 | Tracing + cost analytics |
| [Arize-ai/phoenix](https://github.com/Arize-ai/phoenix) | 11,439 | Tracing + eval self-host |
| [traceloop/openllmetry](https://github.com/traceloop/openllmetry) | 7,427 | OpenTelemetry untuk LLM |
| [Helicone/helicone](https://github.com/Helicone/helicone) | 6,153 | Proxy + spend |

### A.5 Evaluasi & metrik harness

| Repo | ⭐ | Peran |
|---|---|---|
| [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | 25,059 | Eval + red-team, CI-friendly |
| [confident-ai/deepeval](https://github.com/confident-ai/deepeval) | 18,247 | "Pytest for LLMs" |
| [UKGovernmentBEIS/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai) | 2,760 | Eval (UK AISI) |
| [langchain-ai/openevals](https://github.com/langchain-ai/openevals) | 1,193 | Evaluator siap pakai |
| [braintrustdata/autoevals](https://github.com/braintrustdata/autoevals) | 1,034 | Scorer drop-in |
| [langchain-ai/agentevals](https://github.com/langchain-ai/agentevals) | 720 | **Trajectory scoring** |
| [strands-agents/evals](https://github.com/strands-agents/evals) | 193 | Detectors + root-cause dari trace |

### A.6 Referensi harness (untuk dipelajari, bukan dipasang)

| Repo | ⭐ | Peran |
|---|---|---|
| [anomalyco/opencode](https://github.com/anomalyco/opencode) | 207,043 | Coding agent open source (dulu `sst/opencode`) |
| [anthropics/skills](https://github.com/anthropics/skills) | 176,071 | Repo resmi Agent Skills Anthropic |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | 144,909 | Referensi thin harness |
| [openai/codex](https://github.com/openai/codex) | 123,771 | Referensi harness OpenAI |
| [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | 87,743 | ACI + eval harness sebagai objek SDK |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 53,960 | Koleksi resource |
| [aider-AI/aider](https://github.com/aider-AI/aider) | 48,928 | Referensi repo-map / context |
| [langchain-ai/deepagents](https://github.com/langchain-ai/deepagents) | 29,362 | "Batteries-included agent harness" |
| [SWE-agent/SWE-agent](https://github.com/SWE-agent/SWE-agent) | 20,312 | **ACI** — Agent-Computer Interface |
| [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | 13,963 | Warisan eval harness |
| [google/oss-fuzz](https://github.com/google/oss-fuzz) | 12,643 | Warisan fuzzing harness |
| [SWE-bench/SWE-bench](https://github.com/SWE-bench/SWE-bench) | 5,833 | Benchmark agent |
| [stanford-crfm/helm](https://github.com/stanford-crfm/helm) | 2,907 | Holistic Evaluation of Language Models |

---

## LAMPIRAN B — RINGKASAN: 4 SKILL BARU

| Skill | Tahap | Satu baris | Sumber tool utama |
|---|---|---|---|
| **`/constraint-forge`** | Tahap 3 | Ubah BLUEPRINT+ADR jadi lint kustom + structural test + hook, dengan pesan error berisi instruksi perbaikan | ast-grep, dependency-cruiser / ArchUnit |
| **`/entropy-scan`** | Di luar siklus sprint | Pindai drift & zombie code, keluarkan PR refactoring bertarget | knip, jscpd, vulture |
| **`/cost-envelope`** | Tahap 3 + 6 | Tetapkan plafon token/biaya, baca pelanggarannya sebagai sinyal reliabilitas | LiteLLM, Langfuse |
| **`/harness-audit`** | Penutup gelombang | Ukur sensor fire rate & escaped defects, uji apakah sensor rusak | promptfoo / DeepEval, agentevals |

---

**📅 Dibuat:** September 2026
**📚 Basis:** `RISET-Harness-Engineering-dan-Audit-Bab-27.md` + sumber primer (Hashimoto 5 Feb 2026, OpenAI Codex, Anthropic 26 Nov 2025, LangChain 17 Feb 2026, martinfowler.com 2 Apr 2026)
**🎯 Tujuan:** Menutup 7 gap harness engineering di proyek ini melalui 4 gelombang sprint, dengan alasan terkuat dan repo sumber untuk tiap gap.
