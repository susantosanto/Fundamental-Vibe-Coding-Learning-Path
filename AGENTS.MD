# AGENTS.MD — Aturan Kerja untuk Agent di Repo Ini

> **Catatan:** repo ini adalah **repo materi pembelajaran**, bukan proyek aplikasi hasil `/scaffolder`. Karena itu file ini sengaja minimal — hanya memuat aturan yang harus dibaca **setiap sesi**. Aturan lain (struktur folder, kontrak file, ritel handoff) ada di `architecture-planner/MATERI-PECAHAN/` dan diakses lewat skill `/materi-reference`.

## 1. Kebijakan Model — ATURAN KERAS

Sumber kebenaran: **`MODEL-POLICY.md`** (root repo). Baca file itu sebelum melakukan apa pun yang melibatkan subagent.

```
- DILARANG memilih model. Model sepenuhnya ditentukan manusia.
- Setiap field [MODEL] pada dispatch prompt (mis. implementer-prompt.md,
  task-reviewer-prompt.md, re-review-prompt.md) diisi dengan MENYALIN nilai
  yang dinyatakan manusia — dari tabel MODEL-POLICY.md §3.2 atau dari
  perkataan manusia langsung. Tidak ada penilaian, tidak ada usulan.
- TIDAK ADA DEFAULT. Kalau nilai belum dinyatakan manusia → STOP dan TANYA.
  Jangan dispatch, jangan mengisi sendiri, jangan pakai model sesi ini.
- DILARANG mengeskalasi ke "model yang lebih mampu". Kalau tugas gagal,
  ikuti tangga eskalasi MODEL-POLICY.md §4:
  resume → fresh eyes (model SAMA) → re-scope → manusia.
- DILARANG menulis nama model yang tidak dinyatakan manusia ke file apa pun
  (dispatch prompt, ledger, report, commit message).
- DILARANG mengusulkan model ("sebaiknya pakai X"). Melaporkan keadaan boleh;
  menyarankan model tidak.
- Catat nilai [MODEL] yang dipakai ke ledger setiap dispatch (aturan R8),
  supaya manusia bisa mengaudit — bukan hanya mempercayai.
- Ragu? → lapor ke manusia lewat QUESTIONS.MD. Jangan memutuskan sendiri.
```

**Latar:** proyek ini memakai model gratis dari beberapa provider, tanpa jaminan akses ke model tier atas. Instruksi skill vendor seperti *"use the most capable available model"* tidak bisa dijalankan di lingkungan ini — agent tidak punya dasar sah untuk menilai kemampuan model, sehingga ia akan menebak.

**Pembagian peran:** **manusia mengatur model, agent mengerjakan tugas.** Kalau agent tidak tahu model apa yang harus dipakai, itu bukan masalah yang perlu ia pecahkan — itu pertanyaan untuk manusia.

## 2. Override Skill Vendor

Skill pihak ketiga di `skills-vendor/` disimpan **verbatim** (Bab 27.4b) dan **DILARANG diedit**.

Kalau ada klausa vendor yang tidak cocok, override dicatat di **`skills-vendor/OVERRIDES.md`** — bukan dengan mengubah file skill-nya.

Override yang berlaku saat ini: **O-1 … O-4** (semuanya menyangkut pemilihan model di `subagent-driven-development`).

## 3. Konsultasi Materi

Sebelum langkah penting, konsultasi **`/materi-reference`** — folder materi adalah sumber kebenaran, memori model bukan. Kutip aturan verbatim + sebut nomor bab (Bab X.Y).

## 4. Prinsip Kerja Umum

```
- Bukti, bukan klaim: output test asli + screenshot untuk kriteria visual
- Dry run dulu → tunggu approve → baru build
- DILARANG mengubah requirements tanpa persetujuan
- DILARANG pakai library di luar BLUEPRINT.MD (versi pinned)
- Keputusan baru → DECISIONS.MD; pertanyaan baru → QUESTIONS.MD
  (bukan asumsi diam-diam)
- Verifikasi di konteks segar (/acceptance-runner)
```

---

**📅 Dibuat:** September 2026
**📚 Terkait:** `MODEL-POLICY.md` · `skills-vendor/OVERRIDES.md` · `architecture-planner/MATERI-PECAHAN/27-Panduan-EndToEnd-Semua-Skill.md`
