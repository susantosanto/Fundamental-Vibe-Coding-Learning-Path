# 00 — MULAI DARI SINI

> ## ⚠️ Kalau Anda belajar JavaScript — JANGAN baca file ini.
>
> ## Buka folder **`belajar-javascript/`** dan mulai dari `00-RENCANA.md`.
>
> Folder itu berdiri sendiri. Anda tidak perlu file apa pun di folder ini.
>
> File yang sedang Anda baca ini adalah **peta umum** untuk semua orang, dan isinya
> bisa membuat bingung. Anda tidak membutuhkannya.

---

> **Baca file ini dulu. Hanya file ini. Jangan buka folder lain sebelum selesai membacanya.**
>
> **Waktu baca:** 8 menit | **Yang Anda dapat:** tahu persis harus baca apa berikutnya

---

## Kenapa folder ini ada

Repo ini punya **244 file markdown**. Itu kabar baik dan kabar buruk.

Kabar baiknya: materinya lengkap — dari system design, AI tooling, prompting, sampai runbook produksi.

Kabar buruknya: **tidak ada pintu masuk.** Kalau Anda buka repo ini sebagai pemula, Anda akan melihat `fase-1-arsitektur-dasar/`, `arsitektur-vibe-coding/`, `book-resource/`, `vibecoding/`, `prompting-fundamental/`, `easy-vibe-materi/` — dan tidak ada satu pun yang memberi tahu mana yang harus dibaca lebih dulu, atau mana yang boleh dilewati.

Ada juga masalah kedua: **materi debugging sangat tipis.** Yang ada hanya `fase-2-ai-tools-dasar/09-testing-debugging-ai.md`, dan itu pun berisi *"cara minta AI membetulkan error"* — bukan *"cara Anda sendiri menemukan akar masalah"*. Padahal dalam vibe coding, kemampuan debugging justru **lebih** penting, bukan kurang: Anda membaca, mereview, dan mempertanggungjawabkan kode yang tidak Anda tulis.

Folder `fase-0-peta-belajar/` menambal dua hal itu:

1. **Peta** — satu pintu masuk untuk 244 file yang sudah ada (§01, §02)
2. **Fondasi** — dua jalur yang belum ada di fase mana pun: **debugging fundamental** dan **pengambilan keputusan arsitektur**

Fase 1–6 mengajarkan **materi**. Fase 0 mengajarkan **cara memakai materi itu**.

---

## Isi folder ini

```
fase-0-peta-belajar/
├── 00-MULAI-DARI-SINI.md            ← Anda di sini
├── 01-peta-materi-lengkap.md        Semua 244 file, dikelompokkan + kapan dibaca
├── 02-diagnostik-dan-jalur.md       Tes 12 pertanyaan → jalur belajar personal
├── 03-cara-belajar-fondasi.md       Cara belajar yang benar (deliberate practice)
├── 04-jalur-arsitektur-desain.md    Jalur arsitektur + yang belum ada di fase lain
├── 05-jalur-debugging-dan-fix-error.md  Jalur debugging (index)
├── 06-contoh-alur-belajar.md        ← CONTOH KONKRET: menit per menit, hari per hari
│
├── debugging/                        ← MATERI BARU: fondasi debugging
│   ├── 01-mental-model-debugging.md
│   ├── 02-membaca-error-dan-stack-trace.md
│   ├── 03-metode-ilmiah-bisection-delta.md
│   ├── 04-taktik-debugging.md
│   ├── 05-pola-bug-umum.md
│   ├── 06-debugging-kode-buatan-ai.md
│   ├── 07-latihan-bertahap-debugging.md
│   └── 08-debugging-produksi-dan-postmortem.md
│
└── arsitektur/                       ← MATERI BARU: keputusan arsitektur
    ├── 01-berpikir-arsitektur.md
    ├── 02-trade-off-dan-adr.md
    ├── 03-dari-kebutuhan-ke-desain.md
    └── 04-review-dan-latihan-arsitektur.md
```

---

## Router: 3 pertanyaan, 3 jawaban

Baca pertanyaan di bawah, pilih yang paling menggambarkan kondisi Anda **hari ini**.

---

### 🅰️ "Saya baru mulai. Saya tidak tahu harus baca apa."

Jangan buka `fase-1-arsitektur-dasar/` dulu.

**Lakukan ini, berurutan:**

1. Baca `02-diagnostik-dan-jalur.md` → isi 12 pertanyaan → Anda dapat **jalur personal 8 minggu**
2. Baca `03-cara-belajar-fondasi.md` → ini menentukan **cara** Anda belajar, bukan **apa**
3. Ikuti jalur yang keluar dari diagnostik. Kalau hasilnya "mulai dari fondasi pemrograman", jalur itu akan menunjuk ke `learning-python/` atau `learning-javascript/` dulu — bukan ke fase 1.

**Aturan tunggal:** jangan baca dua fase bersamaan. Selesaikan satu fase, baru pindah. Materi di repo ini saling merujuk, dan membaca acak akan membuat Anda merasa bodoh padahal masalahnya cuma urutan.

---

### 🅱️ "Saya sedang macet. Kode saya error dan saya tidak tahu kenapa."

Buka langsung: **`debugging/01-mental-model-debugging.md`**

Lalu berurutan:

| Kalau masalahnya… | Baca |
|---|---|
| Saya tidak paham pesan error-nya | `debugging/02-membaca-error-dan-stack-trace.md` |
| Errornya muncul-hilang, tidak konsisten | `debugging/03-metode-ilmiah-bisection-delta.md` → bagian "bug intermiten" |
| Saya tidak tahu harus mulai dari mana | `debugging/04-taktik-debugging.md` |
| Saya sudah tahu errornya tapi ingin tahu polanya | `debugging/05-pola-bug-umum.md` |
| **Errornya di kode yang AI yang tulis** | `debugging/06-debugging-kode-buatan-ai.md` |
| Error hanya muncul di server, tidak di laptop | `debugging/08-debugging-produksi-dan-postmortem.md` |

Kalau Anda hanya punya waktu 10 menit dan sedang panik: lompat ke **`debugging/03`** bagian *REDUCE Framework*. Itu prosedur 6 langkah yang berlaku untuk semua bug.

---

### 🅲 "Saya bisa bikin aplikasi jalan, tapi saya merasa tidak paham *kenapa*."

Ini kondisi paling umum setelah beberapa bulan vibe coding. Yang hilang biasanya **model mental**, bukan sintaks.

**Urutan yang saya sarankan:**

1. `arsitektur/01-berpikir-arsitektur.md` — mengubah cara Anda melihat sistem
2. `debugging/01-mental-model-debugging.md` — bug = selisih antara model mental Anda dan kenyataan. Kalau modelnya kabur, debugging jadi menebak-nebak.
3. `debugging/07-latihan-bertahap-debugging.md` — 12 latihan berjenjang. Ini yang paling cepat menaikkan kemampuan, karena Anda **mengalami**, bukan membaca.
4. Baru setelah itu masuk `fase-1-arsitektur-dasar/` secara berurutan.

---

## Peta cepat: apa ada di mana

Ini ringkasan 30 detik. Detail lengkapnya di `01-peta-materi-lengkap.md`.

| Folder | Isi | Baca kapan |
|---|---|---|
| **`fase-0-peta-belajar/`** | Peta + fondasi debugging & arsitektur | **Sekarang** |
| `fase-1-arsitektur-dasar/` (22 file) | Konsep system design: scalability, CAP, DNS, CDN, cache, DB | Setelah fondasi. Ini teori arsitektur inti. |
| `fase-2-ai-tools-dasar/` (11 file) | Claude Code, CLAUDE.md, skills, hooks, git+AI | Setelah fase 1, atau bersamaan kalau Anda sudah pakai AI tool |
| `fase-3-advanced-workflows/` (10 file) | Spec-driven dev, autonomous agents, multi-agent | Setelah fase 2 |
| `fase-4-deep-system-design/` (12 file) | Microservices, sharding, message queue, event sourcing, observability | Setelah fase 1 & 3. Level menengah–lanjut. |
| `fase-5-scenario-praktis/` (11 file) | Skenario harian: refactoring, CI/CD, dokumentasi, otomatisasi | Saat sudah mengerjakan proyek nyata |
| `fase-6-advanced-opencode/` (10 file) | Konfigurasi agent lanjutan, MCP, agent design patterns | ⚠️ Belum lengkap (nomor file bolong). Level lanjut. |
| `architecture-planner/MATERI-PECAHAN/` (30 file) | **Metode inti repo ini** — Architect-Builder Method, 6 tahap, 27 bab | Referensi utama. Baca 01–08 lebih dulu. |
| `arsitektur-vibe-coding/` (24 file) | Arsitektur praktis + per-stack (React, Node, Next, Laravel, Postgres) | Saat mulai membangun proyek nyata |
| `prompting-fundamental/` (6 fase) | Prompting dari dasar sampai logika arsitektur | Paralel dengan fase 2 |
| `vibecoding/` (16 file) | Operasional: PRD, keamanan, **runbook, respons insiden, pemulihan** | Saat aplikasi sudah dipakai orang lain |
| `book-resource/ai-engineering-indonesia/` (10 bab) | Chip Huyen, *AI Engineering* — versi Indonesia | Kalau Anda mau membangun produk AI, bukan pakai AI |
| `easy-vibe-materi/` (16 folder) | Vibe coding + lampiran bisnis (JTBD, mom test, B2B/B2C) | Kalau tujuan Anda produk/usaha, bukan karier teknis |
| `panduan-prinsip-claude-code/` (9 file) | 5 prinsip Anthropic soal skills | Pendamping fase 2 |
| `resources/` | Cheat-sheet, glosarium, progress tracker | Sepanjang belajar |
| `skills/` + `skills-vendor/` | 7 skill proyek + 4 skill vendor | Saat Anda mulai menulis skill sendiri |

---

## Cara memakai AI saat belajar dari folder ini

Anda punya akses ke AI agent di repo ini. Ada dua cara memakainya, dan hanya satu yang membuat Anda pintar:

**❌ Yang tidak bekerja:**
> "Ini error saya. Betulkan."
>
> Hasilnya: kode jalan, Anda tidak belajar apa-apa, dan error yang sama akan muncul lagi minggu depan dalam bentuk berbeda.

**✅ Yang bekerja:**
> "Ini error saya dan ini yang sudah saya coba: [daftar]. Hipotesis saya: [hipotesis].
> Jangan beri saya jawabannya. Beri tahu saya **satu** eksperimen berikutnya yang paling
> banyak mempersempit pencarian, dan apa yang harus saya perhatikan dari hasilnya."

Bedanya: yang kedua melatih **proses**. Yang pertama cuma memindahkan pekerjaan.

Aturan praktisnya: **AI boleh memberi tahu Anda di mana harus melihat. AI tidak boleh melihat untuk Anda**, kecuali Anda sudah menyerah setelah 30 menit mencoba sendiri.

Detail lengkap cara ini ada di `03-cara-belajar-fondasi.md`.

---

## Cara memakai progress tracker

`resources/progress-tracker.md` saat ini hanya melacak fase 1–4 (55 file, semuanya 0%) dan **tidak menyertakan fase 5–6 maupun folder ini**. Perlu diperbarui.

Sementara itu, pakai template log ringkas di akhir `02-diagnostik-dan-jalur.md`. Satu baris per sesi belajar:

```
2026-09-14 | debugging/03 | REDUCE framework | 45 mnt | Latihan 3 gagal, ternyata bug di data bukan kode
```

Kolom terakhir itu yang paling berharga. Setelah 20 baris, Anda akan melihat pola kelemahan Anda sendiri.

---

## Satu aturan yang mengikat semuanya

> **Anda tidak belajar dari membaca. Anda belajar dari memprediksi lalu salah.**
>
> Setiap kali Anda membaca kode (termasuk kode buatan AI), berhenti sebelum menjalankannya dan
> tebak: *apa outputnya? apa yang akan gagal?* Baru jalankan. Selisih antara tebakan dan hasil
> itulah pelajarannya. Kalau tebakan Anda selalu benar, Anda tidak sedang belajar — Anda sedang
> mengulang yang sudah Anda kuasai.

---

## Langkah berikutnya

Pilih satu, jangan dua:

- **Ingin contoh konkret menit per menit** → [`06-contoh-alur-belajar.md`](./06-contoh-alur-belajar.md) ← **paling praktis**
- **Baru mulai** → [`02-diagnostik-dan-jalur.md`](./02-diagnostik-dan-jalur.md)
- **Sedang macet dengan error** → [`debugging/01-mental-model-debugging.md`](./debugging/01-mental-model-debugging.md)
- **Mau tahu isi semua materi dulu** → [`01-peta-materi-lengkap.md`](./01-peta-materi-lengkap.md)
- **Mau ubah cara belajar** → [`03-cara-belajar-fondasi.md`](./03-cara-belajar-fondasi.md)

---

> **Catatan tentang nama folder:** "fase-0" bukan berarti "level nol" atau "materi mudah".
> Artinya "baca sebelum fase 1" — sebuah lapisan orientasi. Materi di dalam
> `debugging/` dan `arsitektur/` justru beberapa yang paling menantang di repo ini.
