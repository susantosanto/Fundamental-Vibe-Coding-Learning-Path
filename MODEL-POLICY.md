# MODEL-POLICY.md — Kebijakan Pemilihan Model

> ## Aturan nomor satu
> **Agent TIDAK PERNAH memilih model.** Model ditentukan manusia, ditulis di file ini, dan agent hanya **menyalin nilainya**. Kalau agent merasa perlu "model yang lebih mampu" — itu bukan wewenangnya.

**Berlaku untuk:** semua agent yang bekerja di repo ini, dan semua proyek yang memakai skill dari `skills-vendor/`.
**Dibuat:** September 2026 · **Konteks:** lingkungan memakai model gratis dari beberapa provider, tanpa jaminan akses ke model tier atas.

---

## 1. Mengapa file ini ada

Tiga skill dari `obra/superpowers` yang direncanakan diadopsi punya **tingkat keterikatan model yang berbeda-beda** — sudah saya periksa isi aslinya satu per satu:

| Skill | Rujukan model | Status |
|---|---|---|
| `using-git-worktrees` | **0** — tidak menyebut model sama sekali | ✅ Aman apa adanya |
| `dispatching-parallel-agents` | **0** — hanya menyebut "Subagent (general-purpose)", tanpa model | ✅ Aman apa adanya |
| `subagent-driven-development` | **9 di SKILL.md + placeholder `[MODEL]` WAJIB di 3 file template** | ⚠️ **Perlu override** |

Isi bagian `## Model Selection` di `subagent-driven-development` (kutipan verbatim):

> "Use the least powerful model that can handle each role to conserve cost and increase speed."
>
> "**Architecture and design tasks**: use the most capable available model."
>
> "**Fix-loop escalation (rounds 4-5)**: use a model at least one tier above the implementer that got stuck."
>
> "**Always specify the model explicitly when dispatching a subagent.** An omitted model inherits your session's model — often the most capable and most expensive — which silently defeats this section."

Dan di ketiga file template-nya (`implementer-prompt.md`, `task-reviewer-prompt.md`, `re-review-prompt.md`) ada field wajib:

```
model: [MODEL — REQUIRED: choose per SKILL.md Model Selection; an omitted
        model silently inherits the session's most expensive one]
```

**Masalahnya ada dua:**

1. **"Most capable available model" bukan instruksi yang bisa dijalankan** di lingkungan model gratis multi-provider. Agent tidak punya cara sah untuk membandingkan kemampuan model, jadi ia akan **menebak** — dan tebakan itu yang Anda tidak inginkan.
2. **Field `[MODEL]` bersifat WAJIB.** Kalau dibiarkan kosong, perilakunya bergantung pada harness masing-masing tool — tidak deterministik. Kalau diisi tanpa aturan, agent memilih.

**Kabar baiknya:** field `[MODEL]` yang WAJIB itu justru **titik kontrol yang bagus**. Kita tidak perlu melawan skill-nya — kita cukup memastikan placeholder itu **selalu diisi oleh manusia** (dari deklarasi §3.2, atau saat agent bertanya). Agent tidak pernah memilih; ia menyalin atau berhenti.

---

## 2. Aturan (WAJIB dibaca agent)

```
R1. Agent DILARANG memilih, menilai, membandingkan, atau "mengusulkan" model.
R2. Setiap nilai [MODEL] diambil dari deklarasi manusia (§3). Cara mengambilnya:
    LIHAT deklarasi, bukan NILAI kemampuan model.
R3. Kalau peran tidak ada di deklarasi, atau nilainya belum dinyatakan manusia:
    → STOP. Tanya manusia. JANGAN dispatch. JANGAN mengisi sendiri.
    Tidak ada fallback. Tidak ada default. Tidak ada tebakan.
R4. Agent DILARANG mengeskalasi ke "model yang lebih mampu".
    Kalau tugas gagal, eskalasi yang benar ada di §4 — bukan ganti model.
R5. Kalau manusia menyebut model spesifik di percakapan, itu MENANG atas tabel ini.
R6. Kalau agent merasa deklarasi ini salah atau kurang, ia MELAPOR ke manusia
    (catat di QUESTIONS.MD) — ia TIDAK mengubah tabel ini sendiri.
R7. DILARANG menulis nama model yang tidak ada di deklarasi ke dalam file apa pun
    (dispatch prompt, ledger, report, commit message).
R8. Agent WAJIB menuliskan nilai [MODEL] yang dipakai ke ledger untuk setiap
    dispatch — supaya manusia bisa mengaudit, bukan hanya mempercayai.
```

**Kenapa R4 penting:** skill aslinya memakai eskalasi kemampuan sebagai jalan keluar saat tugas macet. Di lingkungan model tetap, jalan keluar itu tidak tersedia. Kalau aturannya tidak diganti, agent akan mengarang nama model untuk memenuhi instruksi skill — persis yang Anda hindari.

---

## 3. Tabel pemetaan model

### 3.1 TIDAK ADA DEFAULT — agent WAJIB berhenti dan bertanya

```
TIDAK ADA DEFAULT.

Kalau nilai [MODEL] belum dinyatakan manusia secara eksplisit, agent:
  1. STOP — jangan dispatch subagent
  2. Tanya manusia: "Model apa untuk <peran> pada tugas ini?"
  3. Tunggu jawaban
  4. Baru dispatch, dengan nilai yang disebutkan manusia APA ADANYA
```

**DILARANG mengisi `[MODEL]` dengan:**

- "model yang sedang dipakai sesi ini" — sesi bisa berjalan di model apa saja, dan itu bukan keputusan Anda
- model yang dipakai tugas sebelumnya
- tebakan dari nama, tier, atau reputasi model
- model yang muncul di contoh, dokumentasi, skill vendor, atau percakapan lain
- model "teraman" atau "paling murah" menurut penilaian agent

Satu-satunya sumber sah adalah **manusia**. Kalau manusia belum menyebutkannya, nilainya **belum ada** — dan tugas agent berhenti di situ.

**Kenapa harus STOP, bukan menebak:** satu tebakan yang lolos akan tercatat di ledger sebagai keputusan, lalu dipakai lagi oleh dispatch berikutnya. Kesalahan kecil di awal menyebar ke seluruh alur. Lebih murah bertanya sekali daripada mengaudit satu sprint.

### 3.2 Deklarasi manusia: tabel peran → model

> **Ini deklarasi Anda, bukan default sistem.** Mengisi tabel = cara Anda menyatakan model **sekali** supaya tidak ditanya setiap kali. Baris yang masih `<ISI>` berarti **belum dinyatakan** → agent wajib bertanya, bukan menebak.
>
> Ganti `<ISI>` dengan nama model persis seperti yang Anda pakai. Kalau tidak ingin membedakan peran, isi baris yang relevan dengan model yang sama — atau biarkan kosong dan jawab saat ditanya.

| Peran | Model | Provider | Catatan |
|---|---|---|---|
| Implementer — tugas mekanis (1–2 file, spec lengkap) | `<ISI>` | | |
| Implementer — integrasi (multi-file) | `<ISI>` | | |
| Implementer — desain/arsitektur | `<ISI>` | | |
| Reviewer tugas | `<ISI>` | | |
| Re-reviewer (diff fix kecil) | `<ISI>` | | |
| Reviewer final (whole-branch) | `<ISI>` | | |
| Subagent paralel (dispatching-parallel-agents) | `<ISI>` | | |

**Catatan tentang mengisi tabel ini:**

- Kalau Anda **hanya punya satu model gratis yang bisa diandalkan**, isi semua baris dengan model itu. Itu sah — skill-nya tetap berjalan, hanya tanpa diferensiasi tier.
- Kalau Anda **tidak ingin mengisi tabel sama sekali**, itu juga sah. Konsekuensinya: agent akan bertanya setiap kali akan dispatch. Modelnya tetap sepenuhnya Anda yang tentukan.
- **Tabel ini diisi manusia, bukan agent.** Agent hanya membaca. Kalau agent merasa ada baris yang perlu ditambah atau diubah, ia mencatatnya di `QUESTIONS.MD` dan menunggu jawaban — ia tidak menulis ke tabel ini.

### 3.3 Nilai yang boleh dipakai agent

Hanya ada **tiga** sumber sah untuk `[MODEL]`, semuanya berasal dari manusia:

| Sumber | Contoh | Kapan dipakai |
|---|---|---|
| Baris di tabel §3.2 | `implementer mekanis → <nama model>` | Sudah Anda isi sebelumnya |
| Perkataan Anda di percakapan | "pakai model X untuk tugas ini" | Saat ditanya, atau saat Anda menyebutkan lebih dulu |
| Instruksi Anda di `AGENTS.MD` proyek target | blok kebijakan model | Anda tulis sendiri |

Di luar ketiga itu → **berhenti dan tanya.**

---

## 4. Eskalasi tanpa mengganti model

Bagian ini menggantikan klausa *"Fix-loop escalation (rounds 4-5): use a model at least one tier above the implementer"*.

Kalau sebuah tugas gagal berulang, **tangga eskalasi yang benar** adalah:

```
Percobaan 1–3 : RESUME implementer yang sama (konteksnya masih utuh)
                → kirim temuan review apa adanya
                → model: SAMA dengan yang Anda nyatakan untuk tugas ini

Percobaan 4–5 : FRESH EYES — subagent BARU, model TETAP SAMA
                → framing: "implementer sebelumnya mencoba N kali; sekarang kamu
                  yang pegang. Baca file report untuk tahu apa yang sudah dicoba."
                → ini masih berguna tanpa ganti model: subagent baru tidak
                  terjebak pada asumsi implementer lama

Setelah 5     : RE-SCOPE — pecah brief jadi lebih kecil.
                Ini pengganti "naik tier": kalau tidak bisa menambah kemampuan,
                kurangi kesulitan tugasnya.

Kalau masih gagal: STOP → eskalasi ke MANUSIA.
                Catat di QUESTIONS.MD: tugas apa, sudah berapa putaran,
                apa yang sudah dicoba, di mana macetnya.
                JANGAN mencoba model lain tanpa izin manusia.
```

**Kalau Anda ingin mengganti model di tengah alur** — itu hak Anda, dan agent mengikuti. Tapi agent **tidak pernah** mengusulkannya. Kalimat seperti *"sepertinya perlu model yang lebih kuat"* dilarang; yang boleh adalah melaporkan keadaan apa adanya: *"tugas gagal 4 kali pada pendekatan X; berikutnya re-scope atau ganti model — mana yang Anda pilih?"*

**Prinsipnya:** ketika Anda tidak bisa menambah *kemampuan model*, yang bisa ditambah adalah *kejelasan spec* dan *kecilnya tugas*. Dua hal itu seringkali lebih menentukan daripada tier model.

---

## 5. Blok siap tempel untuk `AGENTS.MD`

Karena aturan ini harus dibaca **setiap sesi**, ia perlu ada di `AGENTS.MD` — file yang dibaca pertama menurut urutan Bab 7.1 (`AGENTS.MD → STATE.MD → DECISIONS.MD → DOMAIN.MD`).

```markdown
## Kebijakan Model — ATURAN KERAS

- **DILARANG memilih model.** Model sepenuhnya ditentukan manusia.
- Setiap field `[MODEL]` pada dispatch prompt (mis. `implementer-prompt.md`,
  `task-reviewer-prompt.md`, `re-review-prompt.md`) diisi dengan **menyalin**
  nilai yang dinyatakan manusia — dari tabel `MODEL-POLICY.md` §3.2 atau dari
  perkataan manusia langsung. Tidak ada penilaian, tidak ada usulan.
- **TIDAK ADA DEFAULT.** Kalau nilai belum dinyatakan manusia → **STOP dan
  TANYA**. Jangan dispatch, jangan mengisi sendiri, jangan pakai model sesi ini.
- **DILARANG mengeskalasi ke "model yang lebih mampu".** Kalau tugas gagal,
  ikuti tangga eskalasi `MODEL-POLICY.md` §4 (resume → fresh eyes model sama →
  re-scope → manusia).
- **DILARANG** menulis nama model yang tidak dinyatakan manusia ke file apa pun.
- Catat nilai `[MODEL]` yang dipakai ke ledger setiap dispatch (aturan R8).
- Ragu? → lapor ke manusia lewat `QUESTIONS.MD`. Jangan memutuskan sendiri.
```

---

## 6. Cara memverifikasi aturan ini benar-benar jalan

Aturan yang tidak diuji adalah harapan. Uji sekali saat adopsi:

```
□ 1. KOSONGKAN tabel §3.2. Jalankan subagent-driven-development pada satu tugas kecil.
     Periksa: apakah agent BERHENTI dan bertanya, atau mengisi sendiri?
     → Ini ujian terpenting. Kalau agent mengisi sendiri (dengan model sesi ini,
       atau model "yang paling masuk akal"), kebijakannya BELUM jalan.
□ 2. Jawab pertanyaannya dengan satu nama model. Periksa: apakah nilainya dipakai
     APA ADANYA — bukan "dibulatkan" ke model lain yang menurut agent lebih cocok?
□ 3. Periksa dispatch prompt: apakah field model terisi dengan nilai itu?
□ 4. Sengaja buat satu tugas gagal 4 kali berturut-turut.
     Periksa: apakah agent mencari "model yang lebih mampu", atau mengikuti §4?
□ 5. Periksa ledger/report/commit: adakah nama model yang tidak pernah Anda sebutkan?
□ 6. Periksa: apakah agent pernah MENGUSULKAN model ("sebaiknya pakai X")?
     Itu pelanggaran R1 — laporkan, jangan biarkan.
□ 7. Kalau ada yang gagal → tambahkan ke `AGENTS.MD` sebagai larangan eksplisit,
     dan catat di `RISKS.MD`.
```

Poin 1 dan 4 adalah yang paling sering terlewat. Poin 1 menguji apakah agent benar-benar berhenti saat tidak ada instruksi; poin 4 menguji momen ketika agent paling cenderung berimprovisasi (tugas sedang macet).

---

## 7. Kaitan dengan skill vendor dan aturan 27.4b

Bab 27.4b menetapkan skill pihak ketiga disimpan **verbatim, tanpa modifikasi**. Karena itu:

- **File skill vendor TIDAK diubah.** `skills-vendor/subagent-driven-development/SKILL.md` tetap persis seperti aslinya — supaya bisa disinkronkan ulang dengan upstream.
- **Override dicatat terpisah** di `skills-vendor/OVERRIDES.md`. File itu yang menjadi rujukan "klausa mana yang dinetralkan dan oleh aturan apa".
- **Skill buatan sendiri** (di `skills/`) mengikuti kebijakan ini secara langsung, tanpa perlu override.

Ini konsisten dengan pola yang sudah dipakai proyek: vendor apa adanya, konfigurasi proyek terpisah.

---

**📅 Dibuat:** September 2026
**📚 Dasar:** inspeksi langsung `obra/superpowers` (SKILL.md + 3 file template) · kerangka override di Bab 27.4b
**🎯 Tujuan:** memastikan agent tidak pernah memilih model, tanpa mengubah skill pihak ketiga.
