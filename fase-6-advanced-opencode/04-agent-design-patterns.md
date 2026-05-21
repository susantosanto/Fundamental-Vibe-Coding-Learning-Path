# 04: Agent Design Patterns

> **Pola desain Agent dari Anthropic & praktisi terbaik**

**Estimasi**: 25 menit belajar + 30 menit praktik | **Level**: Advanced

## 🎯 Outcome
- Pilih arsitektur Agent yang tepat
- Kuasai 5 pola Workflow
- Desain multi-Agent collaboration
- Hindari jebakan desain umum
- Terapkan ke workflow administrasi sekolah

## 🔑 3 Prinsip Inti (dari Anthropic)

### 1. Tetap Sederhana
> "Implementasi paling sukses pakai pola sederhana dan bisa digabung, bukan framework rumit."

**Praktik**:
- Bisa 1 Agent? Jangan pakai banyak
- Bisa alur tetap? Jangan dinamis
- Bisa pakai prompt? Jangan tambah tools

**Prinsip "Start Simple"**:

```
Level 0: Single prompt → Cukup? Stop di sini.
Level 1: Single Agent + tools → Cukup? Stop di sini.
Level 2: Multi-Agent sequential → Cukup? Stop di sini.
Level 3: Multi-Agent parallel → Cukup? Stop di sini.
Level 4: Orchestrator-Workers → Last resort.
```

### 2. Transparansi
> "Tampilkan langkah planning Agent secara eksplisit."

**Praktik**:
- Proses pikir Agent harus terlihat
- Tiap step punya input/output jelas
- User paham Agent lagi ngapain

**Implementasi transparansi:**

```markdown
# Format output Agent

## Step 1: Analisis Requirement
- Input: [deskripsi dari user]
- Action: [apa yang dilakukan]
- Output: [hasil analisis]

## Step 2: Eksekusi
- Input: [hasil Step 1]
- Action: [tool yang dipakai]
- Output: [hasil eksekusi]

## Step 3: Verifikasi
- Input: [hasil Step 2]
- Action: [validasi]
- Output: [status: PASS/FAIL]
```

### 3. Desain Tool Interface (ACI) dengan Baik
> "Desain Agent-Computer Interface seperti mendesain HCI untuk junior developer."

**Praktik**:
- Deskripsi tool = docstring yang bagus
- Include contoh penggunaan
- Hindari format yang butuh counting/escaping rumit

**Contoh deskripsi tool yang baik:**

```jsonc
{
  "name": "read_file",
  "description": "Baca isi file teks. Gunakan untuk melihat konten file sebelum edit.\n\nContoh:\n  read_file(path='config.json')\n  read_file(path='src/main.py', head=20) // 20 baris pertama",
  "parameters": {
    "path": { "type": "string", "description": "Path absolut ke file" },
    "head": { "type": "number", "description": "Jumlah baris dari awal (opsional)" }
  }
}
```

## 📊 Workflow vs Agent: Pilih Mana?

| Tipe | Karakteristik | Cocok Untuk | Implementasi OpenCode |
|------|---------------|-------------|----------------------|
| **Workflow** | Step tetap, terprediksi | Task terstruktur | Skill, Command |
| **Agent** | LLM decide sendiri | Open-ended, tidak bisa prediksi | Agent + Task tool |

### Flowchart Pilih

```
Task masuk
    ↓
Step-nya tetap?
    ├─ Ya → Pakai Workflow (Skill/Command)
    └─ Tidak → Butuh berapa otonomi?
                  ├─ Rendah → Agent terbatas (steps + permission)
                  └─ Tinggi → Agent full otonom
```

### Decision Tree Lengkap

```
Task masuk
    ↓
Apakah step bisa diprediksi?
    ├─ YA (step selalu sama)
    │   ↓
    │   Apakah butuh decision di tengah jalan?
    │       ├─ TIDAK → Pakai Skill (fixed workflow)
    │       └─ YA → Pakai Agent dengan steps limit
    │
    └─ TIDAK (step tergantung kondisi)
        ↓
        Berapa banyak sub-task independen?
            ├─ 0 (single task) → 1 Agent biasa
            ├─ 1-3 (beberapa sub-task) → Sequential/Parallel
            └─ 4+ (banyak sub-task) → Orchestrator-Workers
```

## 🔄 5 Pola Workflow

### Pola 1: Sequential (Rantai Linear)

**Prinsip**: Pecah task jadi step berurutan. Output step 1 = input step 2.

**Cocok untuk**:
- Task bisa dipecah jelas
- Mau akurasi lebih dari kecepatan
- Step bergantung pada hasil step sebelumnya
- Validasi di tiap tahap penting

**Karakteristik**:
- ✅ Akurasi tinggi (tiap step fokus 1 hal)
- ✅ Mudah debug (tahu step mana yang gagal)
- ✅ Output konsisten
- ❌ Lambat (step jalan serial)
- ❌ Tidak bisa parallelize

**Contoh 1: Multi-step Translation**

```markdown
---
description: Multi-step translation
mode: subagent
steps: 10
---

Jalankan berurutan:

1. **Terjemahan literal** - per kalimat, jaga makna asli
2. **Poles bahasa** - jadi bahasa Indonesia natural
3. **Cek istilah** - istilah teknis保留英文, tambahkan penjelasan
4. **Format** - sesuai target (Markdown, HTML, dll)
5. **Review final** - baca keseluruhan, cek flow

Output tiap step, terakhir kasih versi final.
```

**Contoh 2: Laporan BOS Bulanan**

```markdown
---
description: Generate laporan BOS bulanan
mode: subagent
steps: 8
---

## Workflow Sequential

### Step 1: Kumpulkan Data
- Baca database ARKAS
- Filter transaksi bulan ini
- Kategorikan per kegiatan

### Step 2: Hitung Realisasi
- Total pemasukan
- Total pengeluaran
- Saldo berjalan
- Persentase realisasi per kegiatan

### Step 3: Validasi Data
- Cek konsistensi angka
- Verifikasi terhadap RKAS
- Flag anomaly (pengeluaran tidak biasa)

### Step 4: Generate Laporan
- Format sesuai template Kemdikbud
- Include tabel ringkasan
- Include grafik trend

### Step 5: Review
- Cek kelengkapan
- Verifikasi format
- Final check
```

**Konfigurasi di opencode.json:**

```jsonc
{
  "agent": {
    "laporan-bos": {
      "description": "Generate laporan BOS bulanan dari data ARKAS",
      "mode": "subagent",
      "steps": 8,
      "permission": {
        "file": { "read": "allow", "write": "ask" },
        "bash": { "read": "allow", "edit": "ask" }
      }
    }
  }
}
```

**Implementasi sebagai Skill:**

```markdown
---
name: sequential-translation
description: |
  Translation multi-step untuk dokumen teknis.
  5 tahap: literal → poles → istilah → format → review.
  Cocok untuk: dokumen API, manual teknis, dokumentasi kode.
  Tidak cocok: terjemahan kreatif, sastra, marketing copy.
---

# Sequential Translation Workflow

## Step-by-Step Process

### Phase 1: Literal Translation
Terjemahkan per kalimat, jaga struktur dan makna asli.
Jangan interpretasi atau parafrase.

### Phase 2: Natural Language Polish
Buat bahasa lebih natural Indonesia.
Perbaiki urutan kata, hapus literal yang kaku.

### Phase 3: Terminology Check
Pastikan istilah teknis konsisten.
Daftar istilah: `references/glossary.md`

### Phase 4: Format Application
Terapkan format target (Markdown/HTML).
Jaga code block, link, heading.

### Phase 5: Final Review
Baca keseluruhan.
Cek: flow, konsistensi, kelengkapan.
```

### Pola 2: Parallel (Eksekusi Konkuren)

**Prinsip**: Banyak task jalan bersamaan, lalu汇总.

**2 Varian**:
- **Sectioning**: Subtask independen, jalan paralel
- **Voting**: Task sama, banyak perspektif

**Cocok untuk**:
- Subtask independen (tidak saling bergantung)
- Butuh multi-perspektif
- Time-sensitive (butuh cepat)
- Task bisa dipecah jadi bagian terpisah

**Karakteristik**:
- ✅ Cepat (eksekusi bersamaan)
- ✅ Multi-perspektif (voting variant)
- ✅ Scalable (tambah worker = tambah cepat)
- ❌ Butuh sinkronisasi di akhir
- ❌ Resource intensif (banyak Agent bersamaan)
- ❌ Sulit debug (banyak proses jalan)

**Contoh 1: Parallel Code Quality Check**

```markdown
---
description: Parallel code quality check
mode: subagent
---

Panggil BERDAMPINGAN (semua sekaligus):

1. @security-auditor - Cek vulnerability, auth bypass, injection
2. @performance-reviewer - Analisis complexity, memory, bottleneck
3. @style-checker - Cek coding standard, naming, formatting
4. @test-coverage-analyzer - Cek unit test coverage, edge cases

汇总生成 laporan:
- Skor per dimensi (X/10)
- Semua masalah sorted by severity
- TOP 3 prioritas fix
- Estimasi effort per fix
```

**Contoh 2: Parallel Data Validation (ARKAS)**

```markdown
---
description: Parallel validation data ARKAS
mode: subagent
---

Jalankan PARALEL:

### Validator 1: Konsistensi Angka
- Total debet = total kredit?
- Saldo akhir = saldo awal + pemasukan - pengeluaran?
- Angka di laporan = angka di database?

### Validator 2: Kelengkapan Dokumen
- Semua transaksi punya bukti?
- Semua kegiatan punya RKAS item?
- Semua PTK punya data lengkap?

### Validator 3: Compliance Check
- Pengeluaran sesuai peruntukan BOS?
- Tidak melebihi pagu?
- Sesuai standar biaya Kemdikbud?

汇总:
- PASS/FAIL per validator
- Detail temuan
- Rekomendasi perbaikan
```

**Konfigurasi Parallel Agent:**

```jsonc
{
  "agent": {
    "parallel-audit": {
      "description": "Audit paralel multi-dimensi",
      "mode": "subagent",
      "parallel": true,
      "workers": [
        "security-auditor",
        "performance-reviewer",
        "style-checker"
      ],
      "aggregation": {
        "method": "merge",
        "format": "consolidated_report"
      }
    }
  }
}
```

### Pola 3: Hierarchical (Manager-Worker)

**Prinsip**: Central LLM (Manager) analisis task, pecah, delegasi ke Worker specialists.

**Cocok untuk**:
- Tidak bisa prediksi subtask di awal
- Kompleksitas tidak pasti
- Butuh spesialis berbeda
- Task besar yang perlu分解

**Karakteristik**:
- ✅ Fleksibel (Manager decide di runtime)
- ✅ Scalable (tambah specialist sesuai butuh)
- ✅ Cocok untuk task kompleks
- ❌ Manager jadi bottleneck
- ❌ Overhead komunikasi
- ❌ Sulit prediksi resource

**Contoh: Project Analysis Orchestrator**

```markdown
---
description: Orchestrator analisis proyek
mode: primary
---

Kamu koordinator analisis proyek.

## Ahli Tersedia
- @architecture-analyst - Struktur proyek, design pattern
- @dependency-auditor - Cek dependency, version conflict
- @security-auditor - Vulnerability, auth, data protection
- @performance-profiler - Bottleneck, optimization
- @docs-reviewer - Kelengkapan docs, accuracy
- @test-analyzer - Coverage, quality test

## Workflow
1. Pahami kebutuhan user
2. Tentukan ahli mana yang perlu (jangan panggil semua!)
3. Panggil ahli (berurutan atau paralel)
4.汇总 semua temuan
5. Beri rekomendasi prioritas

## Prinsip
- Jangan over-analyze, pilih ahli yang perlu saja
- Kalau pertanyaan simpel, mungkin tidak perlu ahli
- Prioritaskan temuan by severity
- Beri estimasi effort per rekomendasi
```

**Contoh: Sistem Administrasi Sekolah**

```markdown
---
description: Koordinator administrasi sekolah
mode: primary
---

Kamu koordinator administrasi SD Negeri Pasirhalang.

## Ahli Tersedia
- @dapodik-operator - Data PD, GTK, Sarpras, Rombel
- @arkas-analyst - Keuangan BOS, RKAS, LPJ
- @surat-writer - Surat-menyurat resmi
- @inventory-manager - Inventaris sekolah
- @schedule-planner - Jadwal pelajaran, kegiatan

## Workflow
1. Terima request dari user (kepala sekolah/guru)
2. Klasifikasi: butuh ahli mana?
3. Delegate ke ahli yang relevan
4.汇总 hasil
5. Deliver ke user

## Contoh Routing
- "Input data siswa baru" → @dapodik-operator
- "Laporan realisasi BOS" → @arkas-analyst
- "Buat surat keterangan" → @surat-writer
- "Cek inventaris lab" → @inventory-manager
- "Jadwal semester depan" → @schedule-planner
```

**Konfigurasi Hierarchical:**

```jsonc
{
  "agent": {
    "school-coordinator": {
      "description": "Koordinator utama administrasi sekolah",
      "mode": "primary",
      "delegation": {
        "strategy": "dynamic",
        "max_workers": 3,
        "timeout_per_worker": 300
      },
      "specialists": [
        "dapodik-operator",
        "arkas-analyst",
        "surat-writer",
        "inventory-manager",
        "schedule-planner"
      ]
    }
  }
}
```

### Pola 4: Pipeline (Stage-Based Processing)

**Prinsip**: Data mengalir melalui stage-stage固定的. Tiap stage transform data.

**Cocok untuk**:
- Data processing pipeline
- ETL (Extract, Transform, Load)
- Content processing
- Quality assurance pipeline

**Karakteristik**:
- ✅ Stream processing (data mengalir)
- ✅ Tiap stage bisa di-test terpisah
- ✅ Mudah tambah/hapus stage
- ❌ Error di stage awal propagate ke bawah
- ❌ Stage harus urut tetap
- ❌ Sulit backtrack

**Contoh: Data Processing Pipeline**

```markdown
---
description: Pipeline proses data Dapodik
mode: subagent
steps: 15
---

## Pipeline Stage

### Stage 1: Extract
- Ambil data dari Dapodik Web Service
- Parse response JSON
- Validasi struktur data

### Stage 2: Clean
- Hapus data duplikat
- Fix format tanggal (DD/MM/YYYY)
- Standardize nama (title case)
- Handle missing values

### Stage 3: Transform
- Map ke format internal
- Hitung derived fields (usia, kelas)
- Enrich dengan data referensi

### Stage 4: Validate
- Cek business rules
- Validasi cross-reference
- Flag data anomali

### Stage 5: Load
- Simpan ke database lokal
- Generate report
- Update index

## Error Handling
- Error di Stage 1 → Retry 3x, lalu abort
- Error di Stage 2-4 → Log, skip record, lanjut
- Error di Stage 5 → Rollback, notify
```

**Konfigurasi Pipeline:**

```jsonc
{
  "agent": {
    "dapodik-pipeline": {
      "description": "Pipeline proses data Dapodik",
      "mode": "subagent",
      "pipeline": {
        "stages": ["extract", "clean", "transform", "validate", "load"],
        "error_strategy": "skip_and_log",
        "max_retries": 3,
        "batch_size": 100
      }
    }
  }
}
```

### Pola 5: Collaborative (Peer-to-Peer)

**Prinsip**: Multiple Agent setara, share context, build consensus.

**Cocok untuk**:
- Brainstorming
- Design review
- Complex problem solving
- Decision making

**Karakteristik**:
- ✅ Multi-perspektif setara
- ✅ Consensus building
- ✅ Kreatif (kombinasi ide)
- ❌ Lambat (banyak diskusi)
- ❌ Mungkin tidak converge
- ❌ Butuh facilitator

**Contoh: Design Review Collaborative**

```markdown
---
description: Collaborative design review
mode: subagent
steps: 20
---

## Collaborative Review Session

### Participants
- @ux-reviewer - User experience perspective
- @security-reviewer - Security perspective
- @performance-reviewer - Performance perspective
- @accessibility-reviewer - Accessibility perspective

### Process
1. **Round 1: Individual Review**
   - Tiap reviewer analisis desain secara independen
   - Catat temuan, concern, suggestion

2. **Round 2: Share Findings**
   - Present temuan ke group
   - Clarify misunderstanding

3. **Round 3: Discussion**
   - Diskusi tradeoff
   - Resolve conflict
   - Prioritize issues

4. **Round 4: Consensus**
   - Agree on action items
   - Assign priority
   - Set timeline

### Output
- Consolidated review report
- Priority matrix (impact vs effort)
- Action items dengan owner
```

## 📋 Pattern Selection Guide

### Decision Tree

```
Task masuk
    ↓
Apakah step bisa diprediksi dan tetap?
    ├─ YA → Sequential Pattern
    │   ↓
    │   Apakah ada stage yang bisa paralel?
    │       ├─ YA → Parallel Pattern
    │       └─ TIDAK → Sequential Pattern
    │
    └─ TIDAK
        ↓
        Apakah butuh spesialis berbeda?
            ├─ YA → Hierarchical Pattern
            │   ↓
            │   Apakah specialist bisa jalan paralel?
            │       ├─ YA → Hierarchical + Parallel
            │       └─ TIDAK → Hierarchical Sequential
            │
            └─ TIDAK
                ↓
                Apakah data mengalir melalui transformasi?
                    ├─ YA → Pipeline Pattern
                    └─ TIDAK → Collaborative Pattern
```

### Quick Reference Table

| Pattern | Kecepatan | Akurasi | Kompleksitas | Best For |
|---------|-----------|---------|--------------|----------|
| Sequential | Lambat | Tinggi | Rendah | Task terstruktur |
| Parallel | Cepat | Sedang | Sedang | Subtask independen |
| Hierarchical | Sedang | Tinggi | Tinggi | Task kompleks |
| Pipeline | Cepat | Sedang | Sedang | Data processing |
| Collaborative | Lambat | Tinggi | Tinggi | Problem solving |

## ⚠️ Pattern Anti-Patterns

### Anti-Pattern 1: Over-Engineering

**Masalah**: Pakai multi-Agent untuk masalah simpel.

```
❌ SALAH:
User: "Buatkan surat keterangan siswa"
→ Orchestrator → 3 Workers → Collaborative Review → Output

✅ BENAR:
User: "Buatkan surat keterangan siswa"
→ 1 Agent dengan template → Output
```

**Solusi**: Mulai dari 1 Agent, scale up hanya kalau perlu.

### Anti-Pattern 2: Infinite Loop

**Masalah**: Agent saling panggil tanpa henti.

```
❌ SALAH:
Agent A → panggil Agent B → panggil Agent A → ...

✅ BENAR:
Agent A → panggil Agent B → selesai
// Set steps limit!
```

**Solusi**: Selalu set `steps` limit. Monitor recursion depth.

### Anti-Pattern 3: Permission Too Loose

**Masalah**: Subagent bisa akses semua.

```
❌ SALAH:
{
  "permission": {
    "file": "allow",
    "bash": "allow"
  }
}

✅ BENAR:
{
  "permission": {
    "file": { "read": "allow", "write": "ask" },
    "bash": { "read": "allow" }
  }
}
```

**Solusi**: Principle of Least Privilege. Beri akses minimal yang dibutuhkan.

### Anti-Pattern 4: No Error Handling

**Masalah**: Agent crash tanpa recovery.

```
❌ SALAH:
// Tidak ada error handling
Agent proses data → error → crash → user tidak tahu

✅ BENAR:
// Error handling di setiap stage
try:
    Agent proses data
catch:
    Log error
    Notify user
    Retry atau skip
```

**Solusi**: Definisikan error strategy di setiap pattern.

### Anti-Pattern 5: Black Box Agent

**Masalah**: Tidak tahu Agent ngapain.

```
❌ SALAH:
User: "Analisis data"
→ [black box processing]
→ Output tanpa konteks

✅ BENAR:
User: "Analisis data"
→ Step 1: Loading data...
→ Step 2: Cleaning data... (found 3 duplicates)
→ Step 3: Analyzing... (5 patterns found)
→ Output dengan penjelasan tiap step
```

**Solusi**: Minta Agent output intermediate steps. Enable verbose logging.

## 🏫 Real-World: School Admin Workflows

### Scenario 1: Input Data Siswa Baru

**Pattern**: Sequential

```
User: "Input data siswa baru atas nama Ahmad Fauzi"

Step 1: Verifikasi data (nama, NISN, TTL)
Step 2: Cek duplikasi di database
Step 3: Input ke Dapodik
Step 4: Verifikasi input berhasil
Step 5: Update data internal sekolah
```

### Scenario 2: Laporan Realisasi BOS Triwulan

**Pattern**: Parallel

```
User: "Buatkan laporan realisasi BOS triwulan 3"

Parallel:
- Validator 1: Cek data pemasukan
- Validator 2: Cek data pengeluaran
- Validator 3: Cek compliance

汇总:
- Generate laporan
- Include grafik
- Highlight anomaly
```

### Scenario 3: Persiapan Akreditasi

**Pattern**: Hierarchical

```
User: "Bantu persiapan akreditasi sekolah"

Manager: Analisis kebutuhan akreditasi
  ↓
Delegate:
  - @doc-reviewer: Cek kelengkapan dokumen
  - @facility-checker: Cek sarana prasarana
  - @teacher-auditor: Cek kualifikasi GTK
  - @curriculum-reviewer: Cek kurikulum
  ↓
汇总: Gap analysis + action plan
```

### Scenario 4: Processing Data Ujian

**Pattern**: Pipeline

```
User: "Proses data hasil ujian semester"

Stage 1: Extract - Ambil data dari form
Stage 2: Clean - Standardize format
Stage 3: Calculate - Hitung nilai, ranking
Stage 4: Validate - Cek anomali nilai
Stage 5: Report - Generate rapor
```

### Scenario 5: Review Kurikulum Baru

**Pattern**: Collaborative

```
User: "Review kurikulum merdeka untuk sekolah kita"

Collaborative:
- @curriculum-expert: Analisis kesesuaian
- @teacher-rep: Feedback implementasi
- @parent-rep: Feedback orang tua
- @student-rep: Feedback siswa
  ↓
Consensus: Rekomendasi adaptasi kurikulum
```

## 📊 Performance Comparison

### Benchmark per Pattern

| Metric | Sequential | Parallel | Hierarchical | Pipeline | Collaborative |
|--------|-----------|----------|--------------|----------|---------------|
| **Speed** | 1x | 3-5x | 2-3x | 3-4x | 1-2x |
| **Accuracy** | 95% | 85% | 90% | 88% | 92% |
| **Resource** | Low | High | Medium | Medium | High |
| **Debug** | Easy | Hard | Medium | Easy | Hard |
| **Scalability** | Low | High | Medium | High | Low |

### Kapan Pakai Pattern Mana

**Pakai Sequential kalau:**
- Task punya step yang jelas dan tetap
- Akurasi lebih penting dari kecepatan
- Butuh audit trail per step
- Contoh: Generate laporan resmi

**Pakai Parallel kalau:**
- Ada subtask yang independen
- Butuh hasil cepat
- Resource tersedia cukup
- Contoh: Validasi multi-dimensi

**Pakai Hierarchical kalau:**
- Task kompleks, tidak bisa prediksi subtask
- Butuh spesialis berbeda
- Manager bisa make good delegation decision
- Contoh: Analisis proyek besar

**Pakai Pipeline kalau:**
- Data perlu transformasi bertahap
- Tiap stage punya fungsi jelas
- Butuh stream processing
- Contoh: ETL data Dapodik

**Pakai Collaborative kalau:**
- Butuh multi-perspektif
- Tidak ada jawaban "benar" tunggal
- Konsensus penting
- Contoh: Design review, brainstorming

## 📝 Ringkasan

1. **3 prinsip inti**: Sederhana, transparan, desain ACI baik
2. **5 pola workflow**: Sequential, Parallel, Hierarchical, Pipeline, Collaborative
3. **3 komponen Agent**: Planning, Memory, Tool Use
4. **Pattern selection**: Decision tree untuk pilih pattern tepat
5. **5 anti-patterns**: Over-engineering, infinite loop, permission longgar, no error handling, black box
6. **School admin scenarios**: 5 scenario real dengan pattern mapping
7. **Performance comparison**: Speed, accuracy, resource, debug, scalability
8. **Checklist** sebelum deploy Agent
9. **Hindari** jebakan umum
10. **Start simple**, scale up only when needed
