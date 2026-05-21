# 01 — Vibe Coding Mindset

> **Estimasi:** 2-3 jam | **Level:** Pemula → Menengah
> **Sumber:** [`analyticalrohit/awesome-vibe-coding-guide`](https://github.com/analyticalrohit/awesome-vibe-coding-guide)

---

## 📖 TEORI

### Apa itu Vibe Coding?

**Vibe coding** adalah mindset AI-assisted development di mana Anda "vibe" dengan AI — memanfaatkan kekuatannya sambil memberikan arahan yang jelas, kontekstual, dan terstruktur. Istilah "vibe" di sini bukan berarti coding tanpa arah atau asal-asalan. Sebaliknya, vibe coding adalah seni menciptakan **aliran kerja yang harmonis** antara intuisi manusia dan kapasitas komputasi AI.

Dalam vibe coding, Anda bertindak sebagai **arsitek dan direktur**, sementara AI berperan sebagai **developer senior yang sangat cepat**. Anda tidak menulis setiap baris kode secara manual — Anda mengarahkan, mereview, dan mengiterasi. Hasilnya: kecepatan pengembangan yang jauh lebih tinggi tanpa mengorbankan kualitas.

Vibe coding BUKAN tentang menggantikan programmer. Vibe coding adalah tentang **mengamplifikasi kemampuan programmer** — membuat developer junior bisa menghasilkan karya level senior, dan membuat developer senior bisa menyelesaikan pekerjaan yang sebelumnya membutuhkan tim besar.

### Mengapa "Vibe"?

Kata "vibe" dipilih karena menggambarkan perasaan alami saat bekerja dengan AI yang tepat. Ketika prompt Anda jelas, konteks AI lengkap, dan workflow Anda terstruktur, coding terasa seperti **mengalir** — bukan seperti berjuang melawan syntax error atau bug yang tidak masuk akal. Anda "merasakan" arah yang benar, dan AI membantu mewujudkannya.

---

## 📜 Sejarah Vibe Coding: Dari Pair Programming ke AI-Assisted

Evolusi vibe coding tidak terjadi dalam semalam. Ini adalah hasil dari dekad inovasi dalam cara manusia menulis kode. Memahami sejarah ini membantu Anda melihat di mana posisi vibe coding dalam spektrum yang lebih besar.

### Era 1: Solo Programming (1970-an — 1990-an)

Di era awal, programmer bekerja sendiri. Mereka menulis kode dari nol, debug dengan `print` statement, dan dokumentasi ditulis manual di kertas. Produktivitas sangat bergantung pada pengalaman individu.

**Karakteristik:**
- Satu developer, satu keyboard, satu layar
- Debugging = trial and error
- Tidak ada code review otomatis
- Learning curve sangat curam
- Produktivitas: ~10-50 baris kode berkualitas per hari

**Keterbatasan:**
- Cognitive overload saat menangani sistem kompleks
- Tidak ada safety net untuk mistake
- Knowledge silo — jika satu orang pergi, pengetahuannya hilang

### Era 2: Pair Programming (1990-an — 2010-an)

Extreme Programming (XP) memperkenalkan pair programming: dua developer bekerja di satu workstation. Satu sebagai "driver" (menulis kode), satu sebagai "navigator" (melihat gambaran besar, catch error).

**Karakteristik:**
- Dua orang, satu layar, bergantian role
- Real-time code review
- Knowledge sharing otomatis
- Bug catch rate lebih tinggi 15-50%
- Produktivitas per orang turun, tapi kualitas naik signifikan

**Keterbatasan:**
- Mahal — butuh 2x resource manusia
- Tidak scalable untuk tim besar
- Kelelahan mental lebih cepat
- Tidak semua developer cocok dengan style ini

### Era 3: AI-Assisted Development (2019 — 2023)

GitHub Copilot (2021) mengubah segalanya. Untuk pertama kalinya, developer memiliki "pair programmer" yang tidak pernah lelah, tidak pernah bosan, dan bisa menghasilkan kode dalam hitungan detik.

**Karakteristik:**
- AI sebagai autocomplete yang sangat pintar
- Developer tetap menulis kode utama
- AI membantu boilerplate, fungsi umum, pattern yang sudah dikenal
- Produktivitas meningkat 20-55% (studi GitHub 2022)

**Keterbatasan:**
- AI hanya merespons konteks lokal (beberapa baris di sekitar cursor)
- Tidak punya pemahaman arsitektur global
- Developer masih harus tahu apa yang harus diketik
- Masih butuh keahlian coding yang kuat

### Era 4: AI Agentic Development (2023 — 2024)

Claude, GPT-4, dan model besar lainnya membawa kemampuan baru: AI bisa memahami file lengkap, arsitektur proyek, dan instruksi kompleks. Developer mulai beralih dari "menulis kode dengan bantuan AI" ke "mengarahkan AI untuk menulis kode."

**Karakteristik:**
- AI bisa membaca dan memahami seluruh codebase
- Developer memberikan instruksi natural language
- AI menghasilkan kode lengkap, bukan hanya snippet
- Tool use: AI bisa menjalankan terminal, edit file, search codebase

**Keterbatasan:**
- Context window masih terbatas
- AI bisa "hallucinate" — menghasilkan kode yang terlihat benar tapi salah
- Developer butuh skill baru: prompt engineering, review discipline

### Era 5: Vibe Coding (2024 — Sekarang)

Vibe coding adalah evolusi natural dari semua era sebelumnya. Ini bukan tentang AI menggantikan developer — ini tentang **developer dan AI bekerja dalam sinkronisasi sempurna**. Developer membawa visi, arsitektur, dan judgment. AI membawa kecepatan, pengetahuan pattern, dan eksekusi.

**Karakteristik:**
- Developer sebagai arsitek dan direktur
- AI sebagai executor yang sangat cepat
- Workflow iteratif: prompt → generate → review → refine → commit
- Konteks dijaga secara eksplisit (CLAUDE.md, spec files, plan files)
- Testing dan verification adalah bagian integral, bukan afterthought

**Keunggulan:**
- Kecepatan 3-10x dibanding traditional coding
- Developer junior bisa menghasilkan output level senior
- Developer senior bisa menangani scope yang jauh lebih besar
- Learning curve lebih landai untuk pemula
- Dokumentasi dan testing menjadi natural part of workflow

**Tantangan:**
- Butuh skill baru: specification writing, AI review, context management
- Risiko over-reliance pada AI
- Perlu disiplin verification yang ketat
- Bisa kehilangan "feel" untuk kode jika tidak hati-hati

### Timeline Ringkas

```
1970s ---- Solo Programming
              |
1990s ---- Pair Programming (XP)
              |
2021  ---- AI-Assisted (Copilot)
              |
2023  ---- AI Agentic (Claude, GPT-4)
              |
2024+ ---- Vibe Coding (Human + AI Sync)
```

---

## 🎯 Spektrum Vibe Coding: Dari Full Manual ke Full AI

Tidak semua vibe coding sama. Ada spektrum yang luas, dan posisi Anda di spektrum ini menentukan seberapa efektif Anda.

### Level 0: Full Manual (0% AI)

```
Anda menulis SEMUA kode dari nol.
Tidak ada AI involvement sama sekali.
```

**Kapan tepat:**
- Belajar fundamental programming untuk pertama kali
- Sistem keamanan kritis yang tidak boleh ada AI involvement
- Interview coding test (jika AI dilarang)

**Kelemahan:**
- Sangat lambat untuk proyek produktif
- Tidak memanfaatkan tool yang tersedia
- Tidak realistis untuk development modern

### Level 1: AI Autocomplete (10-25% AI)

```
Anda menulis kode utama, AI membantu autocomplete.
Contoh: GitHub Copilot, Tabnine, Codeium.
```

**Workflow:**
1. Anda mengetik function signature
2. AI menawarkan completion
3. Anda terima atau modifikasi
4. Anda tetap kontrol penuh atas flow

**Kapan tepat:**
- Developer yang baru mulai dengan AI
- Proyek dengan codebase yang sudah stabil
- Ketika Anda butuh kontrol granular

**Skill yang dibutuhkan:**
- Pemahaman coding yang kuat
- Kemampuan menilai suggestion AI
- Disiplin untuk tidak blindly accept

### Level 2: AI-Assisted Functions (25-50% AI)

```
Anda mendeskripsikan function yang dibutuhkan,
AI menulis implementasi lengkap, Anda review.
```

**Workflow:**
1. Anda tulis comment/deskripsi function
2. AI generate implementasi
3. Anda review, modifikasi, test
4. Anda integrasikan ke codebase

**Kapan tepat:**
- Boilerplate dan repetitive code
- Fungsi dengan pattern yang sudah dikenal
- CRUD operations, data transformation, validation

**Skill yang dibutuhkan:**
- Specification writing (menjelaskan apa yang dibutuhkan)
- Code review yang efektif
- Testing discipline

### Level 3: AI-Assisted Features (50-75% AI)

```
Anda mendeskripsikan fitur lengkap,
AI menghasilkan multiple files, Anda arsitek dan review.
```

**Workflow:**
1. Anda buat spec/plan untuk fitur
2. AI generate multiple files dan components
3. Anda review arsitektur, integrasi, edge cases
4. Anda test, refine, commit

**Kapan tepat:**
- Fitur baru yang well-defined
- Refactoring yang terstruktur
- Prototyping dan MVP development

**Skill yang dibutuhkan:**
- Architecture thinking
- Specification writing yang detail
- Systematic review process
- Integration testing

### Level 4: Vibe Coding Penuh (75-90% AI)

```
Anda memberikan visi dan arah,
AI menangani mayoritas implementasi,
Anda fokus pada quality, architecture, dan decision making.
```

**Workflow:**
1. Anda definisikan masalah dan constraint
2. Anda buat detailed spec dengan acceptance criteria
3. AI generate implementasi lengkap (multiple iterations)
4. Anda review kritis, test comprehensively
5. Anda refine prompt berdasarkan hasil review
6. Repeat sampai quality standard terpenuhi

**Kapan tepat:**
- Developer berpengalaman yang paham arsitektur
- Proyek dengan timeline ketat
- Ketika Anda punya domain knowledge yang kuat

**Skill yang dibutuhkan:**
- Semua skill dari level sebelumnya PLUS:
- Context management yang excellent
- Iterative refinement mastery
- Risk assessment (kapan trust AI, kapan verify extra)
- Tool chain mastery

### Level 5: Full AI Delegation (90-100% AI) ⚠️

```
Anda memberikan instruksi high-level,
AI handle semuanya termasuk testing dan deployment.
ANDA MASIH HARUS REVIEW SEMUA OUTPUT.
```

**Peringatan:** Level ini SANGAT berisiko. Bahkan developer paling berpengalaman tidak boleh skip review. AI bisa hallucinate, miss edge cases, atau introduce security vulnerability.

**Kapan (mungkin) tepat:**
- Script sederhana untuk personal use
- Prototyping yang akan di-review ulang
- Task yang sudah sangat familiar dan low-risk

**Skill yang dibutuhkan:**
- Semua skill sebelumnya PLUS:
- Deep understanding of AI limitations
- Automated verification pipeline
- Rollback strategy yang jelas

### Di Mana Anda Seharusnya Berada?

| Experience Level | Recommended Level | Focus Area |
|---|---|---|
| Beginner (< 1 tahun) | Level 1-2 | Belajar fundamental sambil pakai AI |
| Intermediate (1-3 tahun) | Level 2-3 | Bangun specification & review skill |
| Senior (3-5 tahun) | Level 3-4 | Optimasi workflow, architecture focus |
| Expert (5+ tahun) | Level 4 | Full vibe coding dengan verification ketat |
| Non-technical | Level 3-4 (dengan mentor) | Belajar tech concept sambil build |

**Aturan emas:** Naik level hanya ketika Anda bisa confidently review output AI di level saat ini. Jangan skip level — setiap level membangun skill yang dibutuhkan di level berikutnya.

---

## 🧠 Psikologi Vibe Coding: Mengapa Ini Bekerja

Vibe coding bukan sekadar "coding lebih cepat." Ada alasan psikologis dan kognitif yang mendalam mengapa pendekatan ini efektif.

### 1. Cognitive Load Reduction

Otak manusia memiliki **working memory yang terbatas** — sekitar 4-7 item sekaligus. Saat coding tradisional, Anda harus memegang di kepala:

- Syntax dan semantics bahasa
- Arsitektur sistem secara keseluruhan
- State dan flow data
- Edge cases dan error handling
- Best practices dan pattern
- Bug yang sedang di-debug

**Total cognitive load:** Sangat tinggi. Tidak heran developer sering merasa "mentok" atau burnout.

**Vibe coding mengurangi load ini dengan:**
- AI menangani syntax dan boilerplate → freed mental space
- AI generate implementasi → Anda fokus pada "apa" bukan "bagaimana"
- AI suggest pattern → Anda tidak perlu mengingat semua pattern
- Anda fokus pada: architecture, decision making, quality assurance

**Hasil:** Mental energy dialokasikan ke hal yang bernilai tinggi.

### 2. Flow State Enhancement

**Flow state** adalah kondisi mental di mana Anda sepenuhnya immersed dalam aktivitas. Dalam flow:
- Waktu terasa berlalu cepat
- Produktivitas meningkat drastis
- Kreativitas meningkat
- Frustrasi menurun

**Vibe coding memfasilitasi flow state karena:**
- **Reduced friction:** Tidak stuck di syntax error selama 30 menit
- **Continuous progress:** Selalu ada sesuatu yang bergerak forward
- **Clear feedback loop:** Generate → review → refine → repeat
- **Momentum:** Setiap successful iteration membangun confidence

### 3. The Teacher-Student Dynamic

Saat Anda mereview kode AI, terjadi proses belajar yang powerful:
- AI menghasilkan kode yang mungkin menggunakan pattern yang belum Anda kenal
- Anda investigate, memahami, dan decide apakah pattern itu tepat
- Proses ini **mempercepat learning curve** secara signifikan

**Contoh nyata:**
```
Developer junior: "Saya tidak tahu cara implement rate limiting."
AI: Generate implementasi dengan sliding window algorithm.
Developer: "Oh, jadi begini caranya. Saya pelajari kodenya..."
Developer: "Sekarang saya paham konsepnya, bisa apply di tempat lain."
```

### 4. Confidence Building

Untuk developer junior, vibe coding membangun confidence dengan cara:
- Mereka bisa menghasilkan working code lebih cepat
- Mereka belajar dari contoh kode yang dihasilkan AI
- Mereka merasa capable menangani task yang sebelumnya intimidating
- Mereka develop "taste" untuk good code melalui review process

### 5. The "Rubber Duck" Effect

Dalam traditional programming, "rubber duck debugging" adalah teknik di mana Anda menjelaskan kode Anda ke bebek karet — proses menjelaskan sering membantu Anda menemukan bug sendiri.

**Vibe coding adalah rubber duck debugging yang supercharged:**
- Anda menjelaskan apa yang Anda inginkan ke AI
- AI tidak hanya mendengarkan, tapi juga merespons dengan solusi
- Proses articulating requirements memperjelas thinking Anda
- AI bisa challenge assumption Anda dengan pertanyaan atau alternatif

### 6. Risk: The Illusion of Competence

**Peringatan penting:** Vibe coding bisa menciptakan **illusion of competence** — Anda merasa lebih pintar dari yang sebenarnya karena AI menghasilkan kode yang bagus.

**Cara mitigasi:**
- Selalu review dan pahami kode yang AI generate
- Test secara independen (jangan trust AI's test saja)
- Sesekali coding tanpa AI untuk maintain fundamental skill
- Teach orang lain — jika Anda bisa explain, Anda benar-benar paham

---

## 🏛️ 5 Pilar Vibe Coding Expert

Vibe coding yang efektif dibangun di atas 5 pilar fundamental. Tanpa pilar-pilar ini, Anda hanya "meminta AI menulis kode" — bukan vibe coding yang sesungguhnya.

### Pilar 1: Architecture Thinking

**Definisi:** Kemampuan untuk melihat gambaran besar sistem — bagaimana komponen berinteraksi, di mana data mengalir, apa yang bisa break, dan bagaimana scale.

**Mengapa penting untuk vibe coding:**
AI adalah executor yang excellent, tapi architect yang mediocre. AI bisa menulis function yang sempurna, tapi tidak selalu tahu di mana function itu seharusnya berada dalam arsitektur yang lebih besar.

**Skill yang dibutuhkan:**
- Memahami separation of concerns
- Tahu kapan use pattern (MVC, Repository, Factory, dll)
- Bisa identify coupling dan cohesion issues
- Paham tradeoff antara simplicity dan flexibility

**Contoh dalam praktik:**
```
❌ Prompt buruk:
"Buatkan aplikasi todo list"

✅ Prompt expert:
"Buat REST API untuk todo list dengan struktur:
- Domain layer: Todo entity dengan id, title, description, status, created_at, updated_at
- Repository layer: Interface + SQLite implementation
- Service layer: Business logic dengan validation
- API layer: FastAPI routes dengan Pydantic models
- Error handling: Custom exception classes
- Testing: Unit test untuk service layer, integration test untuk API
Gunakan dependency injection untuk testability."
```

Perbedaannya? Prompt expert sudah memiliki **mental model arsitektur** dan mengkomunikasikannya ke AI.

### Pilar 2: Specification Writing

**Definisi:** Kemampuan untuk menulis deskripsi yang jelas, lengkap, dan unambiguous tentang apa yang harus dibangun.

**Mengapa penting untuk vibe coding:**
AI hanya sebaik instruksi yang Anda berikan. Specification yang buruk = output yang buruk. Specification yang excellent = output yang excellent.

**Anatomi specification yang baik:**

```markdown
# Feature: User Authentication

## Context
Sistem perlu autentikasi user untuk mengakses dashboard admin.

## Requirements
1. User bisa login dengan email dan password
2. Password harus di-hash dengan bcrypt (cost factor 12)
3. Session menggunakan JWT dengan expiry 24 jam
4. Refresh token dengan expiry 7 hari
5. Rate limiting: 5 failed attempts per 15 menit
6. Password reset via email dengan token expiry 1 jam

## Technical Constraints
- Framework: FastAPI
- Database: PostgreSQL
- JWT library: PyJWT
- Email service: SMTP (gunakan environment variables)

## Acceptance Criteria
- [ ] Login berhasil dengan credentials valid → return JWT
- [ ] Login gagal dengan credentials invalid → return 401
- [ ] Login gagal 5x berturut-turut → lock 15 menit
- [ ] Token expired → return 401 dengan message spesifik
- [ ] Refresh token valid → return new JWT
- [ ] Password reset link expired → return error

## Edge Cases
- User dengan email yang belum verified
- User yang sudah di-deactivate
- Concurrent login dari multiple device
- Token yang sudah di-revoke
```

**Tips specification writing:**
- Mulai dengan "mengapa" (context) sebelum "apa" (requirements)
- Gunakan acceptance criteria yang testable
- Include edge cases — AI tidak selalu think about mereka
- Specify technical constraints eksplisit
- Use checklist format untuk clarity

### Pilar 3: Review Discipline

**Definisi:** Kemampuan untuk secara sistematis dan kritis mereview kode yang dihasilkan AI — bukan sekadar "kelihatan benar, merge."

**Mengapa penting untuk vibe coding:**
Ini adalah pilar TERPENTING. Tanpa review discipline, vibe coding menjadi "blind trust" — dan blind trust ke AI adalah resep untuk disaster.

**Review checklist:**

```markdown
## Code Review Checklist

### Correctness
- [ ] Logika bisnis sesuai dengan specification?
- [ ] Edge cases ditangani dengan benar?
- [ ] Error handling comprehensive?
- [ ] No off-by-one errors, null pointer, dll?

### Security
- [ ] Input validation ada dan sufficient?
- [ ] No SQL injection, XSS, atau vulnerability lain?
- [ ] Authentication dan authorization correct?
- [ ] Sensitive data tidak di-log?

### Performance
- [ ] No N+1 query problem?
- [ ] Algorithm complexity reasonable?
- [ ] Memory usage acceptable?
- [ ] Database query optimized?

### Maintainability
- [ ] Code readable dan well-structured?
- [ ] Naming conventions consistent?
- [ ] No magic numbers atau hard-coded values?
- [ ] Comments menjelaskan "mengapa" bukan "apa"?

### Testing
- [ ] Test coverage sufficient?
- [ ] Test cases cover happy path dan error path?
- [ ] Test independen dan reproducible?
- [ ] Mock/stub digunakan dengan benar?
```

**Review process yang efektif:**
1. **Baca specification dulu** — ingat apa yang seharusnya dibangun
2. **Baca kode secara linear** — dari entry point ke leaf
3. **Trace data flow** — dari input ke output
4. **Identify assumptions** — apa yang AI assume? Apakah valid?
5. **Challenge edge cases** — apa yang terjadi jika input tidak valid?
6. **Run tests** — jangan trust tanpa verification
7. **Test manually** — coba use case yang tidak ada di test

### Pilar 4: Iterative Refinement

**Definisi:** Kemampuan untuk mengiterasi — generate, review, refine prompt, generate lagi — sampai kualitas memenuhi standard.

**Mengapa penting untuk vibe coding:**
AI jarang menghasilkan kode sempurna di pertama kali. Iterative refinement adalah cara Anda "mengajar" AI untuk menghasilkan output yang Anda inginkan.

**Iterative refinement cycle:**

```
Iteration 1: Initial prompt → AI generate → Review → Found issues
Iteration 2: Refined prompt (address issues) → AI generate → Review → Better
Iteration 3: Further refined prompt → AI generate → Review → Good enough
Iteration 4: Final polish → AI generate → Review → Ship
```

**Contoh iterative refinement:**

```
Iteration 1:
Prompt: "Buatkan fungsi validasi email"
Hasil: Fungsi basic dengan regex sederhana
Issue: Tidak handle edge case, tidak ada error message yang jelas

Iteration 2:
Prompt: "Buatkan fungsi validasi email dengan:
- Regex yang RFC 5322 compliant
- Custom error message untuk setiap jenis invalid input
- Handle None dan empty string
- Return tuple (is_valid, error_message)"
Hasil: Lebih baik, tapi regex terlalu kompleks dan lambat
Issue: Performance concern untuk bulk validation

Iteration 3:
Prompt: "Refactor fungsi validasi email:
- Gunakan regex yang lebih sederhana (cover 99% use case)
- Tambahkan parameter strict_mode untuk RFC compliance penuh
- Optimize untuk bulk validation (pre-compile regex)
- Tambahkan type hints dan docstring"
Hasil: Good — balanced antara correctness dan performance
```

**Tips iterative refinement:**
- Setiap iteration harus address specific issue
- Jangan change terlalu banyak hal sekaligus
- Document apa yang berubah dan mengapa
- Stop ketika quality standard terpenuhi — jangan over-refine

### Pilar 5: Tool Mastery

**Definisi:** Penguasaan tool chain yang Anda gunakan untuk vibe coding — IDE, AI assistant, version control, testing framework, dan automation tools.

**Mengapa penting untuk vibe coding:**
Tool yang Anda gunakan menentukan seberapa efisien workflow Anda. Mastery bukan tentang tahu semua feature — tapi tentang tahu feature mana yang matter untuk workflow Anda.

**Essential tool chain untuk vibe coding:**

| Kategori | Tool | Mengapa Penting |
|---|---|---|
| AI Assistant | Claude, Cursor, GitHub Copilot | Core engine untuk code generation |
| IDE/Editor | VS Code, Cursor, Zed | Environment utama untuk coding |
| Version Control | Git + GitHub/GitLab | Safety net dan collaboration |
| Testing | pytest, jest, vitest | Verification bahwa kode benar |
| Linting | ruff, eslint, biome | Consistency dan catch error dini |
| Terminal | Windows Terminal, iTerm2 | Command execution dan automation |
| Documentation | Markdown, Mermaid | Spec writing dan documentation |
| Project Context | CLAUDE.md, AGENTS.md | AI context management |

**Tool mastery checklist:**
- [ ] Tahu keyboard shortcuts utama di IDE Anda
- [ ] Bisa configure AI assistant untuk project-specific behavior
- [ ] Tahu cara use Git untuk save point dan rollback
- [ ] Bisa write dan run test dengan cepat
- [ ] Tahu cara configure linter untuk auto-fix
- [ ] Bisa setup project context files (CLAUDE.md, dll)
- [ ] Tahu cara use terminal untuk automation

---

## 🚫 Vibe Coding Anti-Patterns

Anti-pattern adalah kebiasaan yang terlihat benar tapi sebenarnya merusak. Kenali dan hindari ini.

### Anti-Pattern 1: Blind Trust (Kepercayaan Buta)

**Apa:** Menerima semua output AI tanpa review.

**Mengapa berbahaya:**
- AI bisa hallucinate — menghasilkan kode yang terlihat benar tapi salah
- AI tidak tahu context spesifik bisnis Anda
- AI bisa introduce security vulnerability yang tidak terlihat
- AI bisa use deprecated library atau pattern

**Contoh nyata:**
```python
# AI generate ini — terlihat benar, tapi ada bug
def calculate_discount(price, discount_percent):
    return price - (price * discount_percent)  # Bug: tidak divide by 100

# Developer yang tidak review akan deploy bug ini
```

**Cara hindari:**
- SELALU review kode sebelum commit
- Run tests — jangan trust tanpa verification
- Paham apa yang kode lakukan, bukan hanya bahwa kode "berjalan"

### Anti-Pattern 2: Over-Reliance (Ketergantungan Berlebihan)

**Apa:** Tidak bisa coding tanpa AI sama sekali.

**Mengapa berbahaya:**
- Fundamental skill atrofi — Anda lupa cara coding
- Ketika AI down atau tidak tersedia, Anda stuck
- Tidak bisa debug masalah yang AI tidak bisa handle
- Tidak bisa interview atau technical assessment tanpa AI

**Cara hindari:**
- Sesekali coding tanpa AI (1-2 jam per minggu)
- Pelajari fundamental — jangan hanya copy-paste
- Pahami "mengapa" di balik setiap kode yang AI generate
- Practice debugging tanpa AI assistance

### Anti-Pattern 3: Context Loss (Kehilangan Konteks)

**Apa:** AI tidak punya context yang cukup untuk menghasilkan kode yang tepat.

**Mengapa berbahaya:**
- AI generate kode yang tidak sesuai dengan arsitektur existing
- AI use pattern yang inconsistent dengan codebase
- AI tidak tahu tentang constraint bisnis yang penting
- AI duplicate functionality yang sudah ada

**Contoh:**
```
Developer: "Buatkan fungsi untuk send email notification"
AI: Generate fungsi dari scratch dengan SMTP library

Padahal di codebase sudah ada:
- EmailService class di src/services/email.py
- Template system di src/templates/
- Queue system untuk async email sending

Hasil: Duplicate code, inconsistency, wasted effort.
```

**Cara hindari:**
- Selalu provide context ke AI (file structure, existing code, conventions)
- Use CLAUDE.md atau context files untuk project-specific information
- Reference existing code dalam prompt ("ikuti pattern di file X")
- Ask AI untuk check existing code sebelum generate baru

### Anti-Pattern 4: Prompt Sprawl (Prompt yang Tidak Terstruktur)

**Apa:** Prompt yang terlalu panjang, tidak terstruktur, dan mencakup terlalu banyak hal sekaligus.

**Mengapa berbahaya:**
- AI tidak bisa process semua instruction dengan baik
- Important details hilang di antara noise
- Output tidak fokus dan tidak lengkap
- Sulit debug ketika output salah (tidak jelas instruction mana yang gagal)

**Contoh prompt sprawl:**
```
"Buatkan aplikasi web untuk manajemen toko dengan fitur login user,
dashboard dengan chart penjualan, manajemen produk CRUD, manajemen
kategori, manajemen supplier, laporan penjualan per hari/minggu/bulan,
export ke PDF dan Excel, notifikasi stok habis, integrasi payment gateway
Midtrans, responsive design, dark mode, multi-language support,
testing lengkap, deployment ke Vercel, dan dokumentasi API."
```

**Cara hindari:**
- Pecah jadi multiple prompt yang fokus
- Mulai dengan arsitektur, baru implementasi per fitur
- Use specification files untuk detail yang panjang
- Prioritize: apa yang harus dibangun dulu?

### Anti-Pattern 5: No Verification (Tidak Ada Verifikasi)

**Apa:** Menghasilkan kode tanpa test, tanpa lint, tanpa manual verification.

**Mengapa berbahaya:**
- Bug yang tidak terdeteksi sampai production
- Security vulnerability yang tidak terlihat
- Performance issue yang baru ketemu saat scale
- Regresi yang tidak terdeteksi saat refactor

**Cara hindari:**
- Test FIRST — minta AI generate test sebelum atau bersamaan dengan implementasi
- Run linter dan formatter sebelum commit
- Manual test untuk use case kritis
- Code review (oleh manusia lain atau diri sendiri dengan fresh eyes)

### Anti-Pattern 6: Skipping Planning (Melewati Perencanaan)

**Apa:** Langsung generate kode tanpa plan atau spec.

**Mengapa berbahaya:**
- AI generate kode tanpa arah yang jelas
- Hasil tidak terstruktur dan sulit di-maintain
- Banyak rework karena requirement tidak jelas dari awal
- Tidak ada acceptance criteria untuk verify correctness

**Cara hindari:**
- Selalu buat plan.md sebelum mulai coding
- Define acceptance criteria yang jelas
- Break down fitur jadi task yang manageable
- Review plan sebelum generate kode

---

## 👥 Vibe Coding untuk Berbagai Level

Setiap level developer punya focus area yang berbeda dalam vibe coding.

### Beginner (0-1 Tahun Experience)

**Karakteristik:**
- Masih belajar fundamental programming
- Belum punya mental model arsitektur yang kuat
- Mudah terintimidasi oleh kompleksitas

**Focus area:**
1. **Belajar fundamental** — Jangan skip ini. Pahami variable, function, loop, OOP, data structure.
2. **Gunakan AI sebagai tutor** — Minta AI explain kode, bukan hanya generate.
3. **Start dengan Level 1-2** — AI autocomplete dan function assistance.
4. **Review dengan bimbingan** — Minta AI explain setiap baris kode yang di-generate.

**Prompt template untuk beginner:**
```
"Saya sedang belajar [konsep]. Tolong jelaskan dengan contoh kode yang sederhana.
Setelah saya paham, bantu saya implementasikan [fitur] dengan penjelasan di setiap langkah."
```

**Yang harus dihindari:**
- Langsung ke Level 3-4 tanpa paham fundamental
- Copy-paste kode tanpa memahami
- Skip testing karena "AI sudah generate"

### Intermediate (1-3 Tahun Experience)

**Karakteristik:**
- Sudah paham fundamental
- Bisa build fitur sendiri tapi masih lambat
- Mulai bisa review kode dengan kritis

**Focus area:**
1. **Specification writing** — Belajar menulis spec yang jelas dan lengkap.
2. **Code review skill** — Develop kemampuan review kode AI secara efektif.
3. **Move ke Level 2-3** — AI-assisted features dan component generation.
4. **Architecture awareness** — Mulai think tentang bagaimana komponen fit together.

**Prompt template untuk intermediate:**
```
"Saya ingin build [fitur] dengan struktur berikut:
[spec detail]
Tolong generate implementasi dengan:
- Type hints dan docstring
- Error handling untuk edge cases
- Unit test untuk fungsi utama
- Penjelasan untuk design decision yang kamu buat"
```

**Yang harus dihindari:**
- Terlalu cepat naik ke Level 4 tanpa review skill yang kuat
- Tidak challenge assumption AI
- Skip learning tentang arsitektur

### Advanced (3-5 Tahun Experience)

**Karakteristik:**
- Strong fundamental dan architecture understanding
- Bisa review kode dengan efektif
- Mulai bisa mentor orang lain

**Focus area:**
1. **Architecture thinking** — Fokus pada design pattern, separation of concerns, scalability.
2. **Iterative refinement** — Master cycle generate → review → refine.
3. **Move ke Level 3-4** — Full vibe coding untuk fitur kompleks.
4. **Tool chain optimization** — Setup workflow yang efisien.

**Prompt template untuk advanced:**
```
"Context: [deskripsi arsitektur existing system]
Task: [fitur yang harus dibangun]
Constraints: [technical dan business constraint]
Acceptance criteria: [list kriteria yang harus dipenuhi]

Generate implementasi yang:
- Konsisten dengan existing architecture
- Follow SOLID principles
- Include comprehensive error handling
- Ready untuk production (logging, monitoring, dll)
- Include test strategy"
```

**Yang harus dihindari:**
- Over-engineering karena "bisa"
- Tidak involve stakeholder dalam decision making
- Skip documentation karena "kode sudah self-explanatory"

### Expert (5+ Tahun Experience)

**Karakteristik:**
- Deep understanding arsitektur dan system design
- Bisa handle complexity dengan baik
- Bisa mentor dan lead tim

**Focus area:**
1. **Full vibe coding (Level 4)** — AI handle implementasi, Anda handle architecture dan decision.
2. **Team workflow** — Setup vibe coding workflow untuk seluruh tim.
3. **Quality gate** — Setup automated verification pipeline.
4. **Knowledge sharing** — Document best practices dan pattern.

**Prompt template untuk expert:**
```
"Architecture context: [detailed system architecture]
Business requirement: [what needs to be achieved]
Technical constraints: [performance, security, scalability requirements]
Existing patterns: [conventions dan patterns yang sudah established]

Design dan implement solution yang:
- Minimal changes ke existing system
- Backward compatible
- Performance impact < X%
- Security reviewed
- Documented dengan ADR (Architecture Decision Record)"
```

**Yang harus dihindari:**
- Delegasi terlalu banyak ke AI tanpa oversight
- Tidak update skill — AI berubah cepat, Anda juga harus
- Tidak share knowledge dengan tim

### Comparison Table: Vibe Coder Levels

| Aspek | Beginner | Intermediate | Advanced | Expert |
|---|---|---|---|---|
| **AI Level** | 1-2 (Autocomplete) | 2-3 (Function/Feature) | 3-4 (Feature/Full) | 4 (Full Vibe) |
| **Focus** | Belajar fundamental | Spec writing & review | Architecture & iteration | Team workflow & quality |
| **Prompt Quality** | Vague, exploratory | Structured, detailed | Context-rich, constraint-aware | Architecture-driven |
| **Review Skill** | Perlu AI explain | Bisa review dengan guidance | Independent, systematic | Comprehensive, automated |
| **Architecture** | Belum paham | Mulai aware | Strong understanding | Design & lead |
| **Testing** | AI generate, tidak paham | Bisa review test | Write test strategy | Automated pipeline |
| **Tool Mastery** | Basic IDE | IDE + Git + AI | Full tool chain | Custom workflow |
| **Output Quality** | Variable, perlu banyak fix | Good, minor issues | Production-ready | Production-ready + optimized |
| **Speed** | 1-2x traditional | 2-4x traditional | 4-7x traditional | 7-10x traditional |
| **Risk Level** | Tinggi (blind trust) | Sedang (learning) | Rendah (experienced) | Sangat rendah (verified) |

---

## 🛠️ Membangun Vibe Coding Workflow Anda

Ini adalah panduan step-by-step untuk membangun personal vibe coding workflow yang efektif.

### Step 1: Setup Environment

**Tujuan:** Siapkan semua tool yang dibutuhkan.

```bash
# 1. Install AI assistant
# Pilih salah satu: Cursor, Claude Code, GitHub Copilot, dll

# 2. Setup IDE dengan extension
# - Linter (ruff untuk Python, eslint untuk JS)
# - Formatter (black/prettier)
# - Git integration

# 3. Setup project structure
mkdir my-project
cd my-project
git init

# 4. Create context files
# CLAUDE.md — project context untuk AI
# .cursorrules — rules untuk Cursor
# AGENTS.md — instructions untuk AI agent
```

**CLAUDE.md template:**
```markdown
# Project Context

## Tech Stack
- Language: Python 3.12
- Framework: FastAPI
- Database: PostgreSQL
- Testing: pytest

## Conventions
- Type hints untuk semua function
- Docstring Google style
- Error handling dengan custom exception
- Naming: snake_case untuk Python

## Architecture
- Layered: domain → repository → service → api
- Dependency injection untuk testability
- Repository pattern untuk data access

## Important Files
- src/domain/ — Business entities dan logic
- src/repository/ — Data access layer
- src/service/ — Business service layer
- src/api/ — API routes dan models
```

### Step 2: Define Your Workflow

**Tujuan:** Tentukan langkah-langkah yang akan Anda ikuti untuk setiap task.

**Standard workflow:**
```
1. Understand → Pahami requirement dan context
2. Plan → Buat plan.md dengan breakdown task
3. Spec → Tulis specification untuk setiap task
4. Generate → AI generate kode berdasarkan spec
5. Review → Review kode dengan checklist
6. Test → Run automated tests
7. Manual Test → Test use case kritis secara manual
8. Refine → Iterasi jika ada issue
9. Commit → Commit dengan message yang jelas
10. Document → Update dokumentasi jika perlu
```

### Step 3: Create Templates

**Tujuan:** Buat template untuk hal-hal yang sering diulang.

**Specification template:**
```markdown
# Spec: [Nama Fitur]

## Context
[Mengapa fitur ini dibutuhkan]

## Requirements
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

## Technical Details
- Framework: [framework]
- Database: [database]
- API: [endpoint details]

## Acceptance Criteria
- [ ] [Criteria 1]
- [ ] [Criteria 2]
- [ ] [Criteria 3]

## Edge Cases
- [Edge case 1]
- [Edge case 2]

## Dependencies
- [Dependency 1]
- [Dependency 2]
```

**Prompt template:**
```
Context: [project context dari CLAUDE.md]
Task: [task dari plan.md]
Specification: [spec dari spec file]

Generate implementasi yang:
- Follow project conventions
- Include type hints dan docstring
- Handle edge cases
- Include unit test
- Consistent dengan existing code
```

### Step 4: Practice dengan Project Kecil

**Tujuan:** Latihan workflow dengan project yang low-risk.

**Project suggestion:**
- Todo list API
- URL shortener
- Simple blog CMS
- Expense tracker

**Practice routine:**
1. Pilih project kecil
2. Ikuti workflow step-by-step
3. Time setiap step — berapa lama?
4. Review hasil — apa yang bisa diperbaiki?
5. Iterasi workflow berdasarkan learning

### Step 5: Refine dan Optimize

**Tujuan:** Terus improve workflow berdasarkan experience.

**Questions untuk self-review:**
- Step mana yang paling lama? Bisa diotomasi?
- Di mana sering terjadi error? Perlu checklist tambahan?
- Apakah prompt saya efektif? Bisa lebih spesifik?
- Apakah review saya thorough? Ada yang terlewat?
- Apakah testing coverage sufficient?

**Optimization tips:**
- Buat snippet untuk prompt yang sering dipakai
- Setup pre-commit hook untuk auto-lint dan auto-test
- Create project-specific AI rules
- Document pattern dan solution yang berhasil

---

## 📊 Mengukur Efektivitas Vibe Coding

Bagaimana Anda tahu vibe coding Anda efektif? Gunakan metrics ini.

### Metric 1: Development Speed

**Apa:** Berapa lama waktu yang dibutuhkan untuk menyelesaikan fitur.

**Cara ukur:**
```
Time to complete feature = End time - Start time
Speed improvement = (Traditional time - Vibe coding time) / Traditional time * 100%
```

**Benchmark:**
| Level | Speed Improvement | Example |
|---|---|---|
| Beginner | 20-50% | 4 jam → 2-3 jam |
| Intermediate | 50-150% | 4 jam → 1.5-2.5 jam |
| Advanced | 150-300% | 4 jam → 1-1.5 jam |
| Expert | 300-500% | 4 jam → 0.5-1 jam |

### Metric 2: Code Quality

**Apa:** Seberapa baik kualitas kode yang dihasilkan.

**Cara ukur:**
- **Bug rate:** Jumlah bug per fitur setelah deploy
- **Code review feedback:** Jumlah comment di code review
- **Test coverage:** Persentase code yang di-test
- **Lint score:** Score dari linter (0 issues = perfect)

**Target:**
| Metric | Beginner | Intermediate | Advanced | Expert |
|---|---|---|---|---|
| Bug rate per fitur | 3-5 | 1-3 | 0-1 | 0 |
| Code review comments | 5-10 | 2-5 | 0-2 | 0 |
| Test coverage | 40-60% | 60-80% | 80-95% | 95%+ |
| Lint issues | 5-10 | 1-5 | 0-1 | 0 |

### Metric 3: Learning Rate

**Apa:** Seberapa cepat Anda belajar konsep dan pattern baru.

**Cara ukur:**
- **Concepts learned per minggu:** Berapa konsep baru yang dipahami
- **Time to understand:** Berapa lama untuk paham konsep baru
- **Application rate:** Berapa sering konsep baru diaplikasikan

**Target:**
- Beginner: 2-3 konsep baru per minggu
- Intermediate: 1-2 konsep baru per minggu (lebih deep)
- Advanced: 1 konsep baru per minggu (sangat deep)
- Expert: Fokus pada knowledge sharing, bukan learning baru

### Metric 4: Satisfaction

**Apa:** Seberapa enjoyable dan sustainable workflow Anda.

**Cara ukur:**
- **Developer satisfaction:** 1-10 scale, seberapa enjoy coding
- **Burnout rate:** Seberapa sering merasa exhausted
- **Flow state frequency:** Seberapa sering masuk flow state

**Target:**
- Satisfaction: 7-10
- Burnout: < 1x per bulan
- Flow state: > 50% coding session

### Dashboard Sederhana

Buat tracking sederhana di spreadsheet:

| Tanggal | Fitur | Waktu (jam) | Bug | Review Comments | Test Coverage | Satisfaction |
|---|---|---|---|---|---|---|
| 2025-01-15 | Login API | 1.5 | 0 | 1 | 90% | 8 |
| 2025-01-16 | Dashboard | 2.0 | 1 | 3 | 75% | 7 |
| 2025-01-17 | Report Export | 1.0 | 0 | 0 | 95% | 9 |

Review mingguan:
- Rata-rata waktu per fitur: trending naik atau turun?
- Bug rate: acceptable atau perlu improve?
- Satisfaction: masih enjoyable atau mulai burnout?

---

## 🚀 Walkthrough: Building a Feature dari Scratch

Mari kita walkthrough lengkap membangun fitur menggunakan vibe coding.

**Scenario:** Build fitur "User Profile Management" untuk aplikasi web.

### Phase 1: Understanding (15 menit)

**Aktivitas:** Pahami requirement dan context.

```
User story:
- Sebagai user, saya bisa melihat dan mengedit profile saya
- Profile berisi: nama, email, avatar, bio, tanggal lahir
- User bisa upload avatar (max 2MB, format JPG/PNG)
- Email tidak bisa diubah tanpa verifikasi

Existing system:
- FastAPI backend
- PostgreSQL database
- SQLAlchemy ORM
- JWT authentication sudah ada
```

### Phase 2: Planning (15 menit)

**Aktivitas:** Buat plan.md.

```markdown
# Plan: User Profile Management

## Tasks
1. [ ] Create Profile model di database
2. [ ] Create Profile repository
3. [ ] Create Profile service dengan business logic
4. [ ] Create Profile API endpoints
5. [ ] Create avatar upload handler
6. [ ] Create unit test untuk service layer
7. [ ] Create integration test untuk API

## Order
Task 1 → 2 → 3 → 4 → 5 → 6 → 7

## Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
- Task 5 depends on Task 4
- Task 6 depends on Task 3
- Task 7 depends on Task 4
```

### Phase 3: Specification (20 menit)

**Aktivitas:** Tulis spec untuk Task 1 (Profile model).

```markdown
# Spec: Profile Model

## Requirements
- Table: profiles
- Columns:
  - id: UUID, primary key
  - user_id: UUID, foreign key ke users table, unique
  - display_name: VARCHAR(100), not null
  - bio: TEXT, nullable, max 500 karakter
  - avatar_url: VARCHAR(500), nullable
  - date_of_birth: DATE, nullable
  - created_at: TIMESTAMP, auto
  - updated_at: TIMESTAMP, auto

## Constraints
- user_id harus unique (1 profile per user)
- display_name tidak boleh empty
- bio max 500 karakter
- date_of_birth tidak boleh di masa depan
```

### Phase 4: Generate (5 menit)

**Aktivitas:** AI generate kode berdasarkan spec.

**Prompt:**
```
Context: FastAPI + SQLAlchemy project, layered architecture.
Task: Create Profile model sesuai spec di spec-profile-model.md.
Conventions:
- Type hints untuk semua attribute
- Mixin untuk created_at dan updated_at
- Relationship ke User model
- __tablename__ = "profiles"

Generate model class dengan validation.
```

**AI Output:**
```python
from datetime import date, datetime
from uuid import UUID, uuid4

from sqlalchemy import Column, Date, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from src.database import Base
from src.mixins import TimestampMixin


class Profile(TimestampMixin, Base):
    __tablename__ = "profiles"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        unique=True,
        nullable=False,
    )
    display_name = Column(String(100), nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    date_of_birth = Column(Date, nullable=True)

    user = relationship("User", back_populates="profile")

    def validate(self):
        if not self.display_name or not self.display_name.strip():
            raise ValueError("Display name cannot be empty")
        if self.bio and len(self.bio) > 500:
            raise ValueError("Bio cannot exceed 500 characters")
        if self.date_of_birth and self.date_of_birth > date.today():
            raise ValueError("Date of birth cannot be in the future")
```

### Phase 5: Review (10 menit)

**Aktivitas:** Review kode dengan checklist.

**Review:**
- [x] Model sesuai spec? Ya — semua kolom ada
- [x] Type hints? Ya — SQLAlchemy type hints sudah benar
- [x] Validation? Ya — validate method cover semua constraint
- [x] Relationship? Ya — relationship ke User model ada
- [x] Timestamp mixin? Ya — created_at dan updated_at via mixin
- [x] Edge cases? Ya — validation handle empty, max length, future date

**Issue ditemukan:**
- Validation tidak auto-trigger saat save → perlu hook atau call manual
- Tidak ada index di user_id (meski unique sudah implicit index)

**Refinement prompt:**
```
"Tambahkan SQLAlchemy event listener untuk auto-validate sebelum insert/update.
Juga tambahkan index eksplisit di user_id untuk clarity."
```

### Phase 6: Test (15 menit)

**Aktivitas:** Generate dan run test.

**Prompt:**
```
"Buatkan unit test untuk Profile model:
- Test valid creation
- Test validation: empty display_name
- Test validation: bio > 500 chars
- Test validation: future date_of_birth
- Test unique constraint pada user_id
Gunakan pytest dan in-memory SQLite untuk testing."
```

**AI generate test → Run test → All pass → Proceed.**

### Phase 7: Commit (2 menit)

**Aktivitas:** Commit dengan message yang jelas.

```bash
git add src/models/profile.py tests/test_profile.py
git commit -m "feat: add Profile model with validation and tests

- Create Profile SQLAlchemy model with all required fields
- Add validation method for business rules
- Add unit tests covering happy path and edge cases
- Auto-validate on insert/update via event listener"
```

### Phase 8: Repeat

Ulangi Phase 3-7 untuk setiap task dalam plan. Total waktu untuk seluruh fitur: **~2-3 jam** (dibandingkan **6-8 jam** dengan traditional coding).

---

## 📚 Referensi dan Sumber Belajar

### Primary Reference
- **[analyticalrohit/awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide)** — Panduan komprehensif tentang vibe coding, best practices, dan tool recommendations.

### Recommended Reading
- **The Pragmatic Programmer** — David Thomas & Andrew Hunt (fundamental software craftsmanship)
- **Clean Code** — Robert C. Martin (code quality dan maintainability)
- **A Philosophy of Software Design** — John Ousterhout (complexity management)
- **Designing Data-Intensive Applications** — Martin Kleppmann (system design)

### Online Resources
- **Cursor Documentation** — Best practices untuk AI-assisted development
- **Anthropic Claude Documentation** — Prompt engineering dan context management
- **GitHub Copilot Documentation** — AI autocomplete dan suggestion

### Community
- **r/vibecoding** — Reddit community untuk vibe coding discussion
- **Cursor Discord** — Community untuk Cursor users
- **GitHub Discussions** — Various AI coding tool communities

---

## ✅ CHECKLIST

Setelah mempelajari materi ini, pastikan Anda bisa:

### Pemahaman Dasar
- [ ] Menjelaskan apa itu vibe coding dan mengapa berbeda dari traditional coding
- [ ] Menjelaskan evolusi dari pair programming ke vibe coding
- [ ] Mengidentifikasi posisi Anda di spektrum vibe coding (Level 0-5)

### 5 Pilar
- [ ] Memahami pentingnya architecture thinking dalam vibe coding
- [ ] Bisa menulis specification yang jelas dan lengkap
- [ ] Punya review checklist dan bisa apply secara konsisten
- [ ] Memahami iterative refinement cycle
- [ ] Tahu tool chain essential untuk vibe coding

### Anti-Patterns
- [ ] Bisa identify blind trust dan cara hindari
- [ ] Tahu bahaya over-reliance dan cara maintain fundamental skill
- [ ] Paham pentingnya context management
- [ ] Bisa hindari prompt sprawl dengan structured prompt
- [ ] Selalu include verification dalam workflow

### Praktek
- [ ] Sudah setup environment (IDE, AI assistant, Git, linter)
- [ ] Sudah buat CLAUDE.md atau context file untuk project
- [ ] Sudah practice workflow lengkap (plan → spec → generate → review → test → commit)
- [ ] Sudah build minimal 1 fitur lengkap dengan vibe coding
- [ ] Sudah mulai track metrics (speed, quality, satisfaction)

### Next Steps
- [ ] Lanjut ke materi berikutnya: `02-setup-planning-lanjutan.md`
- [ ] Practice vibe coding di project sehari-hari
- [ ] Join community untuk share experience dan learn dari orang lain
- [ ] Review dan refine workflow secara berkala

---

> **Lanjut ke:** [`02-setup-planning-lanjutan.md`](./02-setup-planning-lanjutan.md)
