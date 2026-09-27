# Riset: Apakah Paradigma Development Sudah Bergeser ke Arsitektur & Planning, Meninggalkan Fundamental Bahasa?

> **Tanggal riset:** 25 September 2026
> **Pertanyaan:** Di era vibe coding, apakah arah development sekarang lebih ke arsitektur/design/planning dibandingkan fundamental bahasa pemrograman tertentu?
> **Sumber:** studi peer-review/arXiv, laporan industri (DORA, Stack Overflow, GitClear, Veracode, Qodo), repo GitHub populer, dan tulisan praktisi (Addy Osmani, Martin Fowler/Thoughtworks).

---

## Ringkasan Jawaban (TL;DR)

**Premisnya separuh benar, dan separuh berbahaya.**

Yang benar: **bottleneck sudah pindah.** Menulis kode bukan lagi pekerjaan tersulit — verifikasi, penilaian (judgment), dan perancangan sistem yang jadi langka. Nilai ekonomi seorang engineer bergeser naik dari "menulis sintaks" ke "menentukan apa yang harus ada, dan memutuskan kapan bukti cukup untuk ship."

Yang berbahaya: kesimpulan "karena itu fundamental bahasa tidak perlu lagi." **Data 2025–2026 menunjukkan sebaliknya.** Fundamental tidak menjadi opsional — ia **berubah peran**: dari *keahlian produksi* menjadi *keahlian inspeksi*. Dan justru keahlian inspeksi inilah yang paling tajam menurun ketika orang menyerahkan semuanya ke AI.

Kalimat paling ringkas untuk menggambarkannya:

> Arsitektur naik ke atas panggung, tapi ia berdiri di atas fondasi yang sama. Yang berubah adalah **pekerjaan siapa** — bukan **apa yang perlu diketahui.**

---

## 1. Bukti bahwa arahnya benar: bottleneck memang pindah

### 1.1 Gerakan "spec-driven development" — industri menulis ulang alurnya

Ini bukti paling telak. Industri tidak hanya *berbicara* soal "planning dulu" — ia sedang **membakukan**-nya jadi tool.

| Tool | Pemilik | Stars | Alur yang dipaksakan |
|---|---|---|---|
| **Spec Kit** | GitHub | ~139k (12,4k fork) | constitution → specify → plan → tasks → implement → converge |
| **Kiro** | AWS | — | spec-first IDE |
| **OpenSpec** | komunitas | — | spec sebagai sumber kebenaran |

Spec Kit melewati 111k stars pada Juni 2026 dan menembus ~139k pada September 2026. Isi workflow-nya berbicara sendiri: `specify` (apa & kenapa) **sebelum** `plan` (bagaimana) **sebelum** `tasks` **sebelum** `implement`. Fase `converge` mengulang implement→converge sampai laporan menyatakan "Converged."

Menarik: Spec Kit juga punya ekstensi **bug fixing** dengan aturan eksplisit *"Missing verification is not a successful fix"* — dan ekstensi **idea assessment** yang berakhir pada keputusan **go / needs-clarification / kill**. Itu pengakuan bahwa pertanyaan "haruskah ini dibuat?" adalah pekerjaan engineering, bukan pekerjaan produk.

**Baca ini sebagai apa:** ketika tool terpopuler di platform terbesar dunia mengubah alur default-nya dari "tulis kode" menjadi "tulis spesifikasi dulu", itu tanda bahwa **kode berhenti menjadi artefak utama.**

### 1.2 DORA 2025: AI adalah *amplifier*, bukan pengganti

Laporan DORA 2025 (Google Cloud, ~5.000 responden) menyimpulkan:

> "AI's primary role is as an amplifier, magnifying an organization's existing strengths and weaknesses. The greatest returns on AI investment come not from the tools themselves, but from a strategic focus on the underlying organizational system."

Artinya: AI **tidak** meratakan lapangan. Organisasi dengan arsitektur dan praktik yang baik jadi jauh lebih baik; organisasi yang berantakan jadi lebih berantakan lebih cepat. Ini argumen *pro*-arsitektur, bukan *pro*-"lupakan fundamental."

### 1.3 Qodo 2026: verifikasi adalah bottleneck universal

Survei Censuswide untuk Qodo (500 developer AS + 300 engineering leader AS, September 2026):

| Temuan | Angka |
|---|---|
| Organisasi yang sudah punya insiden produksi terkait AI | **89%** |
| Engineering leader yang bilang proses mereka **cukup** untuk menjaga kualitas | **3,7%** |
| Menyebut "review & validasi kode AI" sebagai constraint utama | **26% developer, 26% leader** |
| Developer yang bilang agent **selalu** mengikuti standar organisasi | **35%** |
| Leader yang punya traceability AI-activity → code change | **45%** |

Yang penting: dua audiens dengan kepentingan berbeda menunjuk titik yang sama. Qodo menyebutnya *"generation scaled across the entire lifecycle, and verification never scaled with it."*

Dan satu detail yang relevan untuk siapa pun yang belajar: **36% developer bilang mereview kode AI tidak lebih lama — tapi butuh usaha kognitif lebih besar** untuk menemukan bug halus. Jadi biayanya nyata, hanya tidak muncul di stopwatch.

### 1.4 Thoughtworks / Martin Fowler, Engelberg Summit (Juni 2026)

Pertemuan tertutup 40 sesi di Swiss, dilaporkan 31 Juli 2026. Kalimat yang paling banyak dikutip:

> "Engineering is now compressed into two things: how I describe the goal, and how I verify I reached it."

Dua hal itu — **mendeskripsikan tujuan** dan **memverifikasi pencapaian** — persis "arsitektur" dan "pengujian". Sintaks tidak masuk daftar.

Satu temuan pahit di dalamnya: *"Not a single person in the room could say how many defects human review actually catches."* Praktik yang dianggap jaminan kualitas ternyata tidak pernah diukur.

### 1.5 Addy Osmani (Google Chrome, praktisi)

Judul tulisannya sendiri adalah tesisnya:

> **"Human judgment doesn't leave the software factory. It relocates."**

Ia menolak narasi "manusia keluar dari loop", dan menggantinya dengan lima tanggung jawab yang tetap manusia:

1. Someone still chooses the problem.
2. Someone still chooses the architecture.
3. Someone still sets the quality bar.
4. Someone decides which verification signals deserve trust.
5. Someone decides when the evidence is sufficient to ship.

Dan penutupnya:

> "The best software factories will not be defined by how completely they eliminate human involvement. They will be defined by how intelligently they **place** it."

Perhatikan kata **relocates** dan **place**. Bukan "hilang". **Dipindahkan.** Ini jawaban paling akurat untuk pertanyaan xcode.

---

## 2. Bukti bahwa premisnya salah: fundamental tidak jadi opsional

Di sinilah riset ini penting. Kalau hanya membaca bagian 1, orang bisa menyimpulkan "bagus, saya tidak perlu belajar fundamental lagi." Data berikut membantahnya.

### 2.1 RCT Anthropic (Januari 2026) — *posture* menentukan hasil, bukan tool

Studi terkontrol acak, 52 software engineer (mayoritas junior, sudah pakai Python >1 tahun/minggu), mempelajari library baru (**Trio**, async). Dibagi dua: dengan AI, tanpa AI. Lalu dikuis.

**Hasil kuantitatif:**

| Metrik | Grup AI | Grup manual |
|---|---|---|
| Skor kuis | **50%** | **67%** |
| Waktu selesai | ~2 menit lebih cepat | — (tidak signifikan) |

Selisih 17 poin ≈ hampir dua peringkat huruf (Cohen's d = 0,738; p = 0,01). **Gap terbesar ada di soal debugging.**

**Hasil kualitatif — ini bagian terpentingnya:**

| Pola interaksi | Skor rata-rata |
|---|---|
| AI delegation (serahkan semua) | **< 40%** |
| Progressive AI reliance | **< 40%** |
| Iterative AI debugging (minta AI debug, bukan minta penjelasan) | **< 40%** |
| Generation-then-comprehension | **> 65%** |
| Hybrid code-explanation | **> 65%** |
| Conceptual inquiry (tanya konsep, kerjakan sendiri) | **> 65%** |

Kesimpulan Osmani atas data ini: **"The tool didn't determine the outcome. The posture did."**

Dua orang memakai tool yang sama, tugas yang sama, waktu yang sama. Yang satu paham, yang satu tidak. **Pembedanya bukan AI-nya — pembedanya adalah apakah orang itu berusaha memahami.**

Catatan penting dari peneliti: mereka memperkirakan efek ini **lebih kuat** pada produk agentic seperti Claude Code daripada pada setup studi ini.

### 2.2 Anthropic: 400.000 sesi Claude Code (Okt 2025 – Apr 2026)

Analisis ~400.000 sesi dari ~235.000 pengguna. Metrik "verified success" = sukses menurut klasifikasi transcript **DAN** ada bukti keras (commit/PR cocok, test lulus, atau afirmasi eksplisit user).

| Tingkat keahlian | Verified success | Partial success |
|---|---|---|
| **Novice** | **15%** | 77% |
| Intermediate ke atas | **28–33%** | 91–92% |
| Expert | 28–33% | 91–92% |

| Metrik lain | Novice | Expert |
|---|---|---|
| Abandonment saat sesi bermasalah | **19%** | 5–7% |
| Aksi Claude per prompt | ~5 | **~12** |
| Output per prompt | ~600 kata | **~3.200 kata** |

Dua hal yang sangat relevan:

**(a) Sebagian besar keuntungan datang dari novice → intermediate**, bukan intermediate → expert. Artinya: kamu tidak perlu jadi jenius untuk memanen manfaat AI. Kamu hanya perlu **berhenti jadi pemula.** Itu kabar bagus, dan itu target yang bisa dicapai.

**(b) Expert memberi instruksi 2,4× lebih banyak aksi dan 5× lebih banyak output per prompt.** Orang yang paham tidak "menyerahkan tugas"; ia **mengarahkan**. Kemampuan mengarahkan presisi itu datang dari pemahaman domain.

Catatan penting: keahlian di sini bersifat **spesifik-tugas**, bukan berdasar jabatan. Senior engineer yang pertama kali bertanya soal Rust adalah pemula di Rust.

### 2.3 Veracode 2025 GenAI Code Security Report

100+ LLM diuji pada 80 tugas coding di Java, JavaScript, C#, Python.

> Hanya **55%** tugas menghasilkan kode yang aman. Dengan kata lain, **45% gagal** dari sisi keamanan.

### 2.4 GitClear — data 211 juta baris kode (2020–2024)

Dataset repo milik Google, Microsoft, Meta, dan enterprise lain.

| Metrik | 2021 | 2024 |
|---|---|---|
| Baris terkait **refactoring** | 25% | **< 10%** |
| Baris hasil **copy/paste** (clone) | 8,3% | **12,3%** |

Pertumbuhan code clone ~4×. Dan untuk pertama kali dalam sejarah data ini, **copy/paste melebihi "moved lines"** — artinya kode baru ditulis ulang, bukan dipakai ulang. Ini lawan langsung dari prinsip DRY.

### 2.5 Stack Overflow Developer Survey 2025 (~49.000 responden, 177 negara)

| Temuan | Angka |
|---|---|
| Pakai / berencana pakai tool AI | **84%** |
| Profesional yang pakai AI setiap hari | **51%** |
| **Actively distrust** akurasi AI | **46%** |
| Trust akurasi AI | 33% |
| "Highly trust" | **3%** |
| Frustrasi #1: "solutions that are almost right, but not quite" | **66%** |
| Frustrasi #2: "debugging AI-generated code is more time-consuming" | **45%** |
| Sentimen positif terhadap AI | 60% (turun dari 70%+) |

Developer berpengalaman adalah kelompok **paling hati-hati**: tingkat "highly trust" terendah (2,6%) dan "highly distrust" tertinggi (20%).

Angka 66% + 45% itu penting: keluhan utamanya bukan "AI bodoh", tapi **"AI hampir benar."** Dan untuk membedakan "hampir benar" dari "benar", kamu butuh tepatnya fundamental yang sedang dipertanyakan.

### 2.6 METR (Juli 2025) — dan mengapa saya memasukkannya dengan hati-hati

RCT, 16 developer open-source berpengalaman, 246 issue nyata, repo rata-rata 22k+ stars dan 1M+ baris kode:

- Dengan AI: **19% lebih lambat**
- Developer **memprediksi** 24% lebih cepat
- Setelah mengalami sendiri, mereka masih **percaya** 20% lebih cepat

Gap persepsi vs realitas ini mengerikan: orang tidak bisa menilai sendiri apakah AI membantu mereka.

**Tapi — penting:** METR sendiri menerbitkan update pada Februari 2026 yang menyatakan hasil Juli 2025 itu *"out of date"* dan *"no longer reflect the current impact."* Sampelnya kecil (16 orang), dan peneliti eksplisit menyatakan tidak menyimpulkan AI tidak membantu secara umum.

**Cara membacanya dengan jujur:** angka 19% itu **bukan** bukti AI tidak berguna di 2026. Yang masih berlaku adalah **pelajarannya** — bahwa persepsi produktivitas tidak bisa dipercaya, dan bahwa konteks (repo besar, standar kualitas tinggi, banyak requirement implisit) mengubah segalanya.

---

## 3. Sintesis: model mental yang akurat

### 3.1 Bottleneck pindah, bukan hilang

```
SEBELUM                          SESUDAH
─────────────────────            ─────────────────────
Bottleneck: menulis kode         Bottleneck: memverifikasi kode
Langka: kemampuan mengetik       Langka: kemampuan menilai
Nilai: kecepatan produksi        Nilai: ketepatan penilaian
```

Analogi yang paling jujur: **pabrik.** Dulu semua orang bekerja di lantai produksi. Sekarang lini produksinya otomatis. Yang jadi langka bukan "orang yang bisa berdiri di lantai produksi" — tapi orang yang bisa **merancang lini itu** dan **memeriksa hasilnya**.

### 3.2 Fundamental berubah peran: dari produksi ke inspeksi

Ini inti jawabannya, dan ini yang paling sering salah dipahami.

| | Dulu | Sekarang |
|---|---|---|
| **Kenapa belajar sintaks** | Supaya bisa **menulis** kode | Supaya bisa **membaca** kode |
| **Kenapa belajar struktur data** | Supaya bisa memilih implementasi | Supaya bisa **menilai** pilihan implementasi |
| **Kenapa belajar debugging** | Supaya bisa memperbaiki | Supaya bisa **tahu bahwa ada yang salah** |
| **Kenapa belajar closure/mutability** | Detail implementasi | **Menjelaskan bug yang tidak terlihat** |

Jadi fundamental **tidak berkurang nilainya** — ia **berpindah tujuan**. Dan bukti dari Anthropic RCT menunjukkan justru kemampuan inspeksi ini (debugging, code reading, conceptual) yang **paling parah menurun** kalau orang menyerahkan semuanya ke AI.

### 3.3 Di mana premis xcode paling akurat

Perhatikan daftar tanggung jawab Osmani lagi: memilih masalah, memilih arsitektur, menetapkan standar kualitas, memutuskan sinyal verifikasi mana yang dipercaya, memutuskan kapan bukti cukup.

**Tidak satu pun dari lima itu bisa dijalankan tanpa memahami sistem.** Kamu tidak bisa "menetapkan standar kualitas" kalau kamu tidak tahu apa yang membuat kode ini buruk. Kamu tidak bisa "memutuskan sinyal verifikasi mana yang dipercaya" kalau kamu tidak bisa membaca test-nya.

Arsitektur **bukan** lapisan di atas fundamental. Arsitektur adalah **fundamental yang dipakai untuk mengambil keputusan.** Spesifikasi bagus butuh pemahaman trade-off, dan pemahaman trade-off datang dari pengalaman membangun — atau, kalau tidak punya pengalaman, dari belajar.

**Ini juga menjelaskan kenapa spec-driven development tidak menyelamatkan pemula.** Menulis spec yang benar adalah skill tersendiri. Spec yang ditulis orang yang tidak paham domain hanyalah tebakan yang ditulis dengan percaya diri.

### 3.4 Risiko baru yang wajib dinamai: *comprehension debt*

Osmani memberi contoh pribadi yang konkret. Ia merge sebuah fitur karena semua test lulus. Belakangan ia kembali ke kode itu dan:

> "I couldn't explain to you how the feature worked. This repository was mine... but my understanding hadn't kept up pace with all of the code that had been building up."

Akar masalahnya:

> "Code often preserves a decision that was made, but not why the decision was made."

Ini jenis utang baru. **Technical debt** hidup di kode. **Cognitive debt** hidup di kepalamu. **Comprehension debt** adalah jarak antara kode yang ada dan pemahamanmu tentang kode itu.

Dan ia tidak muncul di dashboard mana pun. Qodo menemukan angka yang cocok: 36% developer bilang review kode AI butuh usaha kognitif lebih besar meski waktunya sama. Cycle time sehat, throughput sehat, tapi kepercayaan pada PR rekan menurun.

---

## 4. Komentar atas kartun "Vibe Construction"

**Konteks:** kartun Aram J. French (mandatoryrollercoaster.com), © 2026. Seorang pria berbaju safety sambil tersenyum lebar di depan rumah miring — dinding retak, jendela tidak sejajar, atap bengkok, pipa mencuat dari dinding, ada lubang menganga di tanah. Ia berkata: *"It's called Vibe Construction. I'm not even a contractor! Pretty soon all buildings will be made this way."*

### 4.1 Yang benar dari kartun ini

**(a) "I'm not even a contractor" — ini kritik paling tajamnya.**

Ini persis **comprehension debt**. Orang yang membangun tidak paham apa yang ia bangun. Osmani menulis: *"When the resulting system fails, 'the agent wrote it' doesn't cut it."* Kamu tetap pemiliknya. Repo itu tetap namamu.

**(b) Hasilnya "berdiri" tapi cacat struktural.**

Rumah itu berdiri. Tidak roboh. Hanya salah bentuk. Ini **persis** temuan Veracode: 55% kode aman — artinya **45% terlihat benar tapi tidak**. Dan persis temuan Stack Overflow: 66% developer mengeluh "almost right, but not quite."

**(c) "Pretty soon all buildings will be made this way" — satir terhadap bandwagon.**

FOMO arsitektural. "Semua orang melakukannya, jadi ini pasti benar." Ini kritik sosial yang valid, bukan kritik teknis.

**(d) Retakan halus dan lubang di tanah.**

Detail kecil yang bagus: kerusakan yang **butuh mata terlatih** untuk melihat. Kamu harus tahu bagaimana dinding yang benar terlihat, untuk tahu bahwa dinding ini salah. Itu definisi keahlian inspeksi.

### 4.2 Yang tidak adil dari kartun ini (analoginya bocor)

**(a) Bangunan fisik tidak bisa di-revert. Software bisa.**

Rumah yang salah harus dibongkar. Kode yang salah bisa `git revert`, bisa diuji, bisa diiterasi dalam detik. Kartun ini menyiratkan "sekali jadi, langsung rusak selamanya" — padahal keunggulan utama software justru **loop verifikasi yang murah dan cepat**. Kalau loop itu dipakai, kartunnya kehilangan dasar.

**(b) Yang paling penting: cacatnya KELIHATAN.**

Pelanggan di kartun itu bisa melihat rumahnya miring. Ia bisa menolak. Dalam software, cacat yang setara — celah keamanan, kebocoran data, kode yang tidak bisa dirawat — **tidak kelihatan sama sekali.** Kode yang buruk terlihat sama rapinya dengan kode yang baik. Test lulus. Naming konsisten. Diff-nya bahkan terlihat *lebih* rapi daripada tulisan manusia yang dikejar deadline (ini temuan Qodo).

Jadi kartun ini sebenarnya **terlalu optimis.** Ia menggambarkan skenario di mana masalahnya terlihat. Skenario nyata lebih buruk: masalahnya tidak terlihat sampai produksi jatuh — 89% organisasi sudah mengalaminya.

**(c) Kartun membunuh satu profesi. Kenyataannya profesi itu berpindah, bukan hilang.**

Kartun itu menyiratkan "kontraktor tidak diperlukan lagi." Osmani: *"human judgment... relocates."* Kontraktornya masih ada. Ia sekarang merancang gambar kerja dan memeriksa hasil — bukan memasang bata. Bedanya: **ia masih tahu cara memasang bata.**

### 4.3 Poin paling dalam: masalahnya bukan AI-nya, tapi kata "vibe"

Baca ulang leluconnya. **"Vibe."**

Vibe artinya: **tidak ada kriteria keberhasilan.** Kamu tidak tahu kapan selesai, kamu tidak tahu kapan benar, kamu hanya tahu kapan *kelihatannya jalan*.

Itu masalahnya. Bukan AI-nya. Orang bisa membangun rumah miring tanpa AI sama sekali — cukup dengan tidak punya gambar kerja dan tidak punya inspektur. AI hanya mempercepat produksi cacat.

**Kesimpulan komentar saya:**

> Kartun itu **benar sebagai peringatan** dan **salah sebagai ramalan.**
> Ia benar bahwa melepas keahlian menghasilkan struktur yang cacat.
> Ia salah kalau dibaca sebagai "maka jangan pakai AI."
>
> Yang membedakan bukan **pakai AI atau tidak**, tapi **ada kriteria verifikasi atau tidak.**
> Vibe coding bukan "coding dengan AI". Vibe coding adalah **coding tanpa definisi selesai.**

Kalau kamu punya definisi "selesai" yang bisa diperiksa, kamu bukan sedang vibe coding — kamu sedang **engineering dengan agent.** Itu dua hal yang berbeda, dan kartun ini menggambarkan yang pertama.

---

## 5. Implikasi praktis untuk belajar

### 5.1 Apa yang naik nilainya (investasikan di sini)

Berdasarkan seluruh data di atas, empat skill ini yang paling terukur berkorelasi dengan keberhasilan:

1. **Specifying** — mendeskripsikan tujuan dengan presisi. (Anthropic: expert memberi 12 aksi per prompt vs 5 untuk novice.)
2. **Steering** — mengarahkan saat agent melenceng. (Anthropic: abandonment novice 19% vs 5–7% expert.)
3. **Verifying** — tahu bukti apa yang cukup untuk percaya. (Qodo: bottleneck universal.)
4. **Debugging** — tahu bahwa ada yang salah, dan kenapa. (Anthropic RCT: gap terbesar tepat di sini.)

### 5.2 Apa yang turun nilainya

- Menghafal sintaks API (bisa dicari, dan agent sudah tahu)
- Mengetik kode boilerplate
- Review baris-per-baris sebagai default

### 5.3 Kebiasaan yang harus ditambahkan (murah, berdampak besar)

Dari Osmani, dan **didukung langsung oleh RCT Anthropic** (pola "conceptual inquiry" skornya >65%):

| Kebiasaan | Kenapa |
|---|---|
| **Tulis hipotesis dulu sebelum minta perbaikan.** 2–3 kalimat: menurutmu masalahnya apa. | Memakai jawaban AI untuk **menguji teori**, bukan menggantinya. |
| **Minta penjelasan sebelum minta kode.** "Jelaskan cara kerjanya, alternatifnya, dan trade-off-nya." | Ini persis pola "conceptual inquiry" yang skornya tinggi. |
| **Perlakukan output AI seperti PR dari junior.** Baca. Kritik. Bantah. | Standar yang sama seperti kamu menilai kode manusia. |
| **Turunkan ulang dari nol sesekali.** Ambil kode yang AI tulis, coba tulis sendiri. | Kalibrasi: mengukur berapa yang diam-diam hilang. |
| **Tanya: "konsep apa yang baru saja kamu pakai?"** | Satu prompt tambahan mengubah apa yang kamu bawa pulang. |
| **Tutup sesi dengan: hari ini saya belajar, atau cuma menutup tugas?** | "Ship and learn are two separate metrics." |

### 5.4 MULAI dan SELESAI

Karena ini riset, bukan kurikulum — tapi tetap saya beri batasnya supaya bisa diperiksa.

**MULAI:** dari kebiasaan paling murah, yaitu **menulis 2–3 kalimat hipotesis sebelum meminta AI memperbaiki apa pun.**

**SELESAI (kriteria yang bisa diperiksa):** kamu bisa membaca satu file JavaScript yang **bukan kamu yang tulis** — dan menjelaskan (a) apa yang dilakukannya, (b) satu keputusan desain di dalamnya, dan (c) satu cara itu bisa gagal. Kalau bisa, kamu sedang di kategori "intermediate" — dan data Anthropic bilang di situlah 77% keuntungannya sudah kamu ambil.

---

## 6. Kesimpulan

**Pertanyaan:** apakah paradigma sekarang lebih ke arsitektur/planning dibanding fundamental bahasa?

**Jawaban:** Arah pergeserannya **benar**, tapi framing "dibandingkan" yang salah.

Bukan *arsitektur **menggantikan** fundamental.* Yang terjadi:

- **Bottleneck pindah** dari produksi ke verifikasi. ✅ (Qodo, DORA, Thoughtworks)
- **Artefak utama bergeser** dari kode ke spesifikasi. ✅ (Spec Kit 139k stars, Kiro)
- **Judgment manusia naik nilainya** — tapi **direlokasi**, bukan dihapus. ✅ (Osmani)
- **Fundamental berubah peran** dari keahlian produksi → keahlian inspeksi. ✅ (Anthropic RCT + 400k sesi)
- **Melepas fundamental terbukti berbahaya** — 45% kode tidak aman, code clone naik 4×, 89% organisasi kena insiden produksi. ✅ (Veracode, GitClear, Qodo)

Jadi kalimat yang paling akurat adalah:

> **Arsitektur naik ke atas panggung. Tapi ia berdiri di atas fondasi yang sama.**
> Yang berubah bukan *apa yang perlu kamu ketahui* — tapi *untuk apa pengetahuan itu kamu pakai*:
> bukan lagi untuk **menulis**, tapi untuk **menilai**.

Dan kartun "Vibe Construction" benar pada satu hal yang paling penting: **bangunan yang tidak dipahami pembangunnya akan retak.** Yang tidak ia tunjukkan adalah bahwa solusinya bukan berhenti membangun — tapi **memahami apa yang kamu bangun.**

---

## 7. Daftar Sumber

### Studi & data primer

| Sumber | Tahun | Yang diambil |
|---|---|---|
| [Anthropic — How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills) (arXiv 2601.20245) | Jan 2026 | RCT 52 dev, Trio; 50% vs 67%; pola interaksi <40% vs >65% |
| [Anthropic — How Claude Code is used in practice](https://www.anthropic.com/research/claude-code-expertise) | Jun 2026 | 400k sesi, 235k user; novice 15% vs expert 28–33% |
| [METR — Measuring the Impact of Early-2025 AI on Experienced OSS Devs](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) | Jul 2025 (+ update Feb 2026) | RCT 16 dev, 246 issue; +19% waktu; gap persepsi 24%/20% |
| [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/) | 2025 | AI sebagai amplifier; sistem organisasi > tool |
| [Stack Overflow Developer Survey 2025 — AI section](https://survey.stackoverflow.co/2025/ai) | 2025 | 49k responden; 46% distrust; 66% "almost right" |
| [GitClear — AI Copilot Code Quality 2025](https://www.gitclear.com/ai_assistant_code_quality_2025_research) | 2025 | 211M baris; refactor 25%→<10%; clone 8,3%→12,3% |
| [Veracode — 2025 GenAI Code Security Report](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/) | 2025 | 100+ LLM, 80 tugas; hanya 55% aman |
| [Qodo — 2026 State of AI Code Quality Report](https://www.qodo.ai/blog/state-of-ai-code-quality-report-2026/) | Sep 2026 | 500 dev + 300 leader; 89% insiden; 26%/26% bottleneck |
| [Thoughtworks / Martin Fowler — Future of Software Engineering (Engelberg Summit)](https://tonybai.com/2026/07/31/thoughtworks-future-of-software-engineering-2026-verification-bottleneck/) | Jun–Jul 2026 | "how I describe the goal, and how I verify I reached it" |

### Repo & tool

| Sumber | Yang diambil |
|---|---|
| [github/spec-kit](https://github.com/github/spec-kit) | ~139k stars, 12,4k fork; workflow constitution→specify→plan→tasks→implement→converge |
| [GitHub Octoverse 2025](https://github.blog/) | TypeScript menyalip Python & JavaScript (Agustus 2025); 180 juta developer |

### Tulisan praktisi

| Sumber | Yang diambil |
|---|---|
| [Addy Osmani — Human judgment doesn't leave the software factory. It relocates.](https://addyosmani.com/blog/human-judgment-doesnt-leave-the-software/) | Lima tanggung jawab manusia; comprehension debt |
| [Addy Osmani — Don't Outsource the Learning](https://addyosmani.com/blog/dont-outsource-learning/) | "The tool didn't determine the outcome. The posture did." |
| [Addy Osmani — Agentic Skill Decay](https://addyosmani.com/blog/agentic-skill-decay/) | "plausible code may arrive faster than your ability to judge it" |
| [Addy Osmani — Agentic Code Review](https://addyosmani.com/blog/agentic-code-review/) | Bottleneck pindah dari menulis ke memutuskan |

### Catatan tentang kualitas sumber

- **Kuat:** Anthropic RCT (peer-review track, arXiv 2601.20245), METR RCT, Science (arXiv 2506.08945), Stack Overflow (49k), DORA (~5k), GitClear (211M baris).
- **Sedang:** Qodo (survei vendor, tapi metodologi jelas + dua audiens terpisah), Veracode (vendor, tapi metodologi terbuka).
- **Lemah / perlu hati-hati:** banyak blog berbahasa Mandarin dan artikel SEO yang mengutip angka-angka ini tanpa sumber asli, dan sebagian menambahkan klaim sendiri. Semua angka di laporan ini diambil dari sumber primer atau laporan yang bisa dilacak — bukan dari blog turunan.

---

_Dibuat: 25 September 2026 · Riset untuk repo `fundamental-vibe-coding`_
