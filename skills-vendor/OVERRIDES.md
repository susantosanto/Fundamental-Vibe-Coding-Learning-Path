# OVERRIDES.md — Override Tingkat Proyek untuk Skill Vendor

> **Mengapa file ini ada.** Bab 27.4b menetapkan skill pihak ketiga disimpan **verbatim, tanpa modifikasi** — supaya bisa disinkronkan ulang dengan upstream. Tapi kadang sebuah klausa di skill vendor tidak cocok dengan lingkungan proyek. Jawabannya bukan mengedit skill-nya, melainkan **mencatat override di file terpisah** (file ini).
>
> **Cara membaca:** setiap baris = satu klausa vendor yang dinetralkan + aturan penggantinya + alasan. Kalau tidak tercatat di sini, klausa vendor berlaku apa adanya.

**Dibuat:** September 2026 · **Pemilik:** manusia (agent boleh membaca, tidak boleh mengubah)

---

## 1. Ringkasan override aktif

| # | Skill vendor | Klausa yang dinetralkan | Diganti oleh | Prioritas |
|---|---|---|---|---|
| O-1 | `subagent-driven-development` | `## Model Selection` — seluruh bagian | `MODEL-POLICY.md` §2 + §3 | **KERAS** |
| O-2 | `subagent-driven-development` | Fix-loop rounds 4–5: *"more capable model"* | `MODEL-POLICY.md` §4 (tangga eskalasi) | **KERAS** |
| O-3 | `subagent-driven-development` | Final review: *"most capable available model"* | Deklarasi manusia di `MODEL-POLICY.md` §3.2 | **KERAS** |
| O-4 | `subagent-driven-development` | Field `[MODEL]` di 3 file template | Diisi **manusia** (tabel atau saat ditanya), bukan dipilih | **KERAS** |
| O-CDD-1 | `constraint-driven-development` | Blok Caveman menempel di vendor; klausa standar "conducts NO developer interviews" kontradiktif untuk skill yang justru berbasis interview | Interview 4 pertanyaan (Step 2) & verdict block/warn = **JELAS PENUH** (Auto-Clarity); output rutin = caveman terse | SEDANG |

**Prinsip tunggal yang mengikat keempatnya:** nilai model hanya boleh berasal dari manusia. Kalau belum ada → agent **berhenti dan bertanya**, bukan menebak.

Skill vendor yang **TIDAK punya override** (aman apa adanya):

| Skill | Alasan |
|---|---|
| `using-git-worktrees` | 0 rujukan model. Isinya murni deteksi isolasi workspace, `git worktree`, dan verifikasi baseline test. Tidak ada yang perlu dinetralkan. |
| `dispatching-parallel-agents` | 0 rujukan model. Hanya menyebut "Subagent (general-purpose)" tanpa meminta pemilihan model. |
| `systematic-debugging` | 0 rujukan model. |
| `debugging-and-error-recovery` | 0 rujukan model. |
| `observability-and-instrumentation` | 0 rujukan model. |

---

## 2. Detail override

### O-1 — Bagian `## Model Selection` dinetralkan seluruhnya

**Lokasi di vendor:** `subagent-driven-development/SKILL.md`, bagian `## Model Selection` (± 40 baris)

**Kutipan klausa asli:**
> "Use the least powerful model that can handle each role to conserve cost and increase speed."
> "**Architecture and design tasks**: use the most capable available model."
> "**Always specify the model explicitly when dispatching a subagent.**"

**Mengapa dinetralkan:** instruksi ini meminta agent **menilai** kemampuan model dan memilih tier per tugas. Di lingkungan model gratis multi-provider, agent tidak punya dasar sah untuk menilai — sehingga ia menebak. Penebakan itulah yang dilarang.

**Pengganti:** `MODEL-POLICY.md` §2 (aturan R1–R8) + §3 (deklarasi manusia: peran → model).

**Efek:** bagian Model Selection dibaca sebagai **informasi konteks** (menjelaskan mengapa tier berbeda berguna), tetapi **tidak dieksekusi**. Peran yang disebutkan di sana (mechanical / integration / architecture / review / re-review / fix-loop) tetap dipakai sebagai **kategori** — tetapi nilainya diambil dari deklarasi manusia, dan kalau belum ada, agent berhenti dan bertanya. **Tidak ada default, tidak ada fallback, tidak ada tebakan.**

---

### O-2 — Eskalasi "more capable model" diganti tangga eskalasi

**Lokasi di vendor:** `subagent-driven-development/SKILL.md` baris ± 381 dan diagram alur baris ± 75, 103–109

**Kutipan klausa asli:**
> "**Rounds 4-5 — dispatch a fresh implementer on a more capable model** (per Model Selection)"
> "If the task requires more reasoning, re-dispatch with a more capable model"

**Mengapa dinetralkan:** ini jalur keluar utama skill saat tugas macet. Kalau tidak diganti, agent akan mencari nama model untuk memenuhi instruksi — tepat di momen paling rawan improvisasi (tugas gagal berulang).

**Pengganti:** `MODEL-POLICY.md` §4 — tangga eskalasi:

```
1–3  : resume implementer yang sama, model SAMA
4–5  : fresh eyes — subagent BARU, model TETAP SAMA
setelah 5 : re-scope (pecah brief), bukan naik tier
gagal juga : STOP → eskalasi ke manusia via QUESTIONS.MD
```

**Prinsip pengganti:** ketika kemampuan model tidak bisa ditambah, yang ditambah adalah **kejelasan spec** dan **kecilnya tugas**. Dua hal itu seringkali lebih menentukan daripada tier model.

**Efek:** struktur 5 putaran tetap dipakai. Hanya isi langkah "naik tier" yang berubah menjadi "re-scope".

---

### O-3 — Final review tidak lagi memakai "most capable available model"

**Lokasi di vendor:** `subagent-driven-development/SKILL.md` baris ± 452 dan contoh alur baris ± 562

**Kutipan klausa asli:**
> "Dispatch on the **most capable available model** (see Model Selection), using superpowers:requesting-code-review's code-reviewer.md"

**Mengapa dinetralkan:** sama dengan O-1 — "most capable available" adalah penilaian yang tidak bisa dilakukan agent di lingkungan ini.

**Pengganti:** nilai dari deklarasi manusia untuk baris `Reviewer final (whole-branch)` di `MODEL-POLICY.md` §3.2. **Kalau baris itu belum diisi → agent berhenti dan bertanya.** Tidak ada fallback ke model sesi ini.

---

### O-4 — Field `[MODEL]` wajib diisi dari tabel

**Lokasi di vendor:** tiga file template di folder yang sama:

| File | Baris | Isi asli |
|---|---|---|
| `implementer-prompt.md` | 8–9 | `model: [MODEL — REQUIRED: choose per SKILL.md Model Selection; an omitted model silently inherits the session's most expensive one]` |
| `task-reviewer-prompt.md` | 13–14 | idem |
| `re-review-prompt.md` | 13–14 | idem |

**Mengapa ini justru menguntungkan:** field ini **WAJIB**. Kalau dibiarkan kosong, perilakunya bergantung pada harness masing-masing tool — tidak deterministik. Karena wajib, ia menjadi **titik kontrol yang bersih**: kita cukup mengisinya lebih dulu dari tabel.

**Pengganti:** isi `[MODEL]` dengan **menyalin** nilai yang dinyatakan manusia. Peran → sumber nilai:

| Template | Sumber nilai |
|---|---|
| `implementer-prompt.md` | deklarasi untuk kategori tugas (mekanis / integrasi / desain) di §3.2 |
| `task-reviewer-prompt.md` | deklarasi untuk `Reviewer tugas` di §3.2 |
| `re-review-prompt.md` | deklarasi untuk `Re-reviewer (diff fix kecil)` di §3.2 |

**Kalau baris itu belum diisi manusia** → agent **STOP dan bertanya**. Ia dilarang mengisi field wajib itu dengan model sesi ini, model tugas sebelumnya, atau tebakan apa pun.

**Efek:** agent tidak memilih; ia menyalin — atau berhenti. Instruksi *"choose per SKILL.md Model Selection"* di dalam placeholder dibaca sebagai **sudah terpenuhi oleh O-1**.

### O-CDD-1 — Caveman pada skill interview `constraint-driven-development`

**Lokasi:** blok di akhir `constraint-driven-development/SKILL.md` (ditempel 13 Sep 2026 atas instruksi eksplisit pemilik — presedan: 10 skill eksekusi sudah memakai pola yang sama).

**Deviasi:** skill vendor ini bukan skill eksekusi murni — Step 2-nya adalah **interview 4 pertanyaan kepada manusia**. Kalimat standar blok caveman *"This is an EXECUTION skill: it conducts NO developer interviews"* akan kontradiksi dengan proses skill-nya sendiri.

**Pengganti (tertulis di blok itu juga):**
- Interview 4 pertanyaan (Step 2) dan verdict per dimensi (block/warn) → **JELAS PENUH**, bukan terse — karena ini keputusan milik manusia.
- Laporan rutin, daftar tool, catatan install → caveman terse.
- Floor dan guard bar (Step 6) tetap dievaluasi ketat apa pun gaya komunikasinya.

**Efek:** konsisten dengan prinsip §1 — keputusan yang seharusnya milik manusia (memilih dimensi, menetapkan angka) selalu disajikan jelas penuh; yang terse hanya laporan.

---

## 3. Aturan penulisan override baru

Kalau nanti ditemukan klausa vendor lain yang tidak cocok:

```
1. JANGAN edit file skill vendor-nya.
2. Tambahkan baris di §1 tabel ringkasan + bagian detail di §2.
3. Format tiap override: lokasi (file + baris) → kutipan asli → alasan →
   pengganti → efek.
4. Kalau override menyangkut hal yang harus dibaca setiap sesi (seperti model),
   tambahkan juga blok ringkasnya ke AGENTS.MD.
5. Catat tanggal + alasan di commit message.
```

**Uji apakah override perlu ada:** kalau klausa vendor membuat agent mengambil **keputusan yang seharusnya milik manusia**, itu kandidat override. Kalau klausa itu hanya menjelaskan cara kerja, biarkan apa adanya.

---

## 4. Sinkronisasi ulang dengan upstream

Karena skill vendor disimpan verbatim, sinkronisasi bisa dilakukan kapan saja:

```
1. Ambil ulang SKILL.md dari upstream (obra/superpowers).
2. Diff terhadap salinan lokal → pastikan TIDAK ADA perubahan lokal
   (kalau ada, berarti ada yang mengedit vendor — itu pelanggaran 27.4b).
3. Periksa apakah klausa yang di-override masih ada dan masih berbunyi sama.
   Kalau berubah → perbarui §2 file ini.
4. Perbarui hash di skills-lock.json.
```

**Catatan (diperbarui 13 Sep 2026):** `skills-lock.json` kini **sudah mencatat 5 skill** (firecrawl-deep-research + 4 skill vendor dengan hash sha256). Temuan §9 RENCANA untuk 3 skill lama sudah tertutup; sinkronisasi ulang bisa dilakukan dengan aman. `constraint-driven-development` terdaftar dengan `extraFiles` untuk `references/floor-guard.md` (dependensi wajib).

---

**📅 Dibuat:** September 2026
**📚 Dasar:** inspeksi langsung `obra/superpowers` (SKILL.md, 3 file template) · Bab 27.4b (skill vendor verbatim) · `MODEL-POLICY.md`
**🎯 Tujuan:** menetralkan klausa vendor yang membuat agent memilih model, tanpa mengubah file vendor.
