# USULAN — Belajar Fundamental JavaScript di Era Vibe Coding (Mode Inspeksi)

> **Status:** USULAN. Belum jadi materi. Belum ada file materi yang dibuat.
> Menunggu keputusan xcode sebelum dibangun (§11).
>
> **Tanggal:** 25 September 2026
> **Dasar:** Bab 28 `MATERI-PECAHAN/28-Panduan-Mode-Belajar-Workflow.md` + riset pedagogi
> yang punya bukti (bukan blog) + riset era-AI yang sudah diverifikasi di sesi sebelumnya.

---

## 1. Kenapa cara lama tidak bisa dipakai lagi

Cara lama mengasumsikan satu hal: **menulis kode dari nol itu sulit, dan kesulitan itulah yang mengajari.**

Asumsi itu sudah tidak berlaku, dan buktinya ada dua sisi.

**Sisi pertama — kesulitannya hilang.** Menghasilkan kode sekarang gratis. Jadi latihan "tulis kode dari editor kosong" tidak lagi memaksa pemahaman; ia hanya memaksa kesabaran. Riset PRIMM menyebut editor kosong bagi pemula sebagai *"very stressful... it's easy to be put off having a go, or for teachers to resort to getting students to copy code that they don't yet understand"* (Sentance & Waite, NCCA Pedagogy Quick Read #11).

**Sisi kedua — yang hilang justru bagian yang mengajari.** RCT Anthropic (Januari 2026, 52 engineer, library baru) memisahkan hasil berdasarkan **cara** memakai AI, bukan berdasarkan AI-nya:

| Cara memakai AI | Skor pemahaman |
|---|---|
| Tanya konsep, kerjakan sendiri | **di atas 65%** |
| Copy-paste kode yang dihasilkan | **di bawah 40%** |
| Rata-rata seluruh grup AI | 50% |
| Kerjakan sendiri tanpa AI | 67% |

Gap terbesar ada di soal **debugging**. Dan efek ini diperkirakan **lebih kuat** pada produk agentic daripada pada setup studi.

**Kesimpulannya:** masalahnya bukan "AI membuat orang bodoh". Masalahnya adalah **AI menghapus gesekan, dan gesekan itu tempat pelajarannya berada.** Maka desain belajar yang benar bukan "jangan pakai AI", tapi **memilih aktivitas yang pelajarannya hilang kalau didelegasikan.**

---

## 2. Prinsip desain: batas delegasi

Ini prinsip tunggal yang menurunkan seluruh desain di bawah.

> **Pilih aktivitas yang kalau kamu serahkan ke AI, pelajarannya ikut hilang.**
>
> Kalau sebuah aktivitas masih mengajari sesuatu walaupun didelegasikan — delegasikan saja. Itu bukan latihan, itu pekerjaan.

| Aktivitas | Boleh didelegasikan? | Kenapa |
|---|---|---|
| Mengetik boilerplate | **Ya** | Tidak ada pelajaran di mengetik |
| Mencari nama method | **Ya** | Hafalan, bukan pemahaman |
| Menulis konfigurasi | **Ya** | Sekali benar, selesai |
| **Memprediksi output** | **Tidak** | Kalau AI yang memprediksi, kamu tidak melatih model mentalmu |
| **Melacak nilai variabel** | **Tidak** | Ini inti "notional machine" — alat berpikir, bukan hasil |
| **Menemukan bug** | **Tidak** | Ini skill yang paling tajam menurun menurut RCT Anthropic |
| **Menjelaskan kenapa** | **Tidak** | Kalau AI yang menjelaskan, kamu hanya mengangguk |
| **Memutuskan trade-off** | **Tidak** | Nilai ditentukan manusia, bukan dihafal |

Perhatikan polanya: yang **tidak** boleh didelegasikan semuanya aktivitas **inspeksi**. Yang boleh didelegasikan semuanya **produksi**. Itulah kenapa arah belajarnya berubah.

---

## 3. Fondasi pedagogis yang sudah terbukti

Bagian ini bukan opini. Ini riset pendidikan komputasi yang sudah teruji, dan kebetulan cocok persis dengan "mode inspeksi".

### 3.1 PRIMM — membaca dulu, menulis kemudian

**PRIMM** = **P**redict → **R**un → **I**nvestigate → **M**odify → **M**ake. Dikembangkan di King's College London, kini dikelola Computing Education Research Centre (University of Cambridge).

| Tahap | Isi | Peran di mode inspeksi |
|---|---|---|
| **Predict** | Pembelajar melihat program pendek, menuliskan tebakannya. Fokus pada **fungsi**, bukan cara. | Melatih model mental. Ini inti inspeksi. |
| **Run** | Jalankan untuk menguji tebakan. | **Tanpa menyalin kode.** PRIMM eksplisit: beri program untuk **dijalankan**, bukan diketik ulang. |
| **Investigate** | Telusuri isi kode: trace, annotate, Parsons, **menyuntik error lalu debug**. | **Ini tahap yang paling hilang** di cara lama. |
| **Modify** | Ubah sedikit-sedikit, makin lama makin sulit. | Kepemilikan bergeser: *"not mine"* → *"partly mine"*. |
| **Make** | Buat program baru, boleh meminjam potongan dari yang lama. | Per unit, bukan per sesi. |

**Buktinya:**

- Studi kuasi-eksperimental 2018: **500 pembelajar usia 11–14 tahun**, 8–12 minggu → hasil belajar meningkat (Sentance, Waite & Kallia, 2019, *Computer Science Education* 29(2–3), 136–176).
- **188 sitasi** per Maret 2024. Dipakai di Jerman, AS, Tasmania, Hong Kong, Argentina, Norwegia, Turki. Diterjemahkan ke Jerman dan masuk buku teks sekolah Bavaria.
- PRIMM dibangun di atas riset sebelumnya: Use-Modify-Create, dan **"reading code before writing"** yang punya dasar "decades of research".

**Kutipan yang paling penting untuk kita:**

> "In this approach, rather than copying code or writing programs from scratch, beginners instead start by focussing on **reading working code**."

### 3.2 Ambang 50% — angka yang bisa dipakai sebagai gerbang

Ini temuan paling konkret yang saya dapat, dan langsung bisa dipakai sebagai checkpoint:

> "Comparing tracing skills to code writing, they demonstrated that **novices require a 50% tracing code accuracy before they can independently write code with confidence**." — mengacu pada **Lister et al. (2004)**, *A multi-national study of reading and tracing skills in novice programmers*, ACM SIGCSE Bulletin 36(4), 119–150.

Jadi ada ambang terukur: **kalau akurasi melacak kode masih di bawah 50%, menulis kode dari nol bukan latihan — itu untung-untungan.** Bagi kita ini berarti: **trace dulu sampai lewat 50%, baru `Make`.**

### 3.3 Parsons Problems — menyusun ulang baris yang diacak

Baris-baris kode disediakan tapi urutannya diacak; pembelajar menyusun ulang.

**Kenapa efektif** (NCCA Pedagogy Quick Read #13):
- Mengurangi beban kognitif — fokus pada **struktur dan logika**, bukan sintaks
- Melatih pemahaman *notional machine* (bagaimana program dieksekusi)
- **"Immediate feedback also avoids any misconceptions being committed to long-term memory."**
- Menutup kesalahan ketik sebagai variabel pengganggu: *"when using a Parson's Problem, we can be sure that an error was not caused by a typing mistake"* (Denny et al.)

**Asal riset:** Denny, Luxton-Reilly & Simon (2008), *Evaluating a New Exam Question: Parsons Problems*, ICER '08, hlm. 113–124. Lalu Izu et al. (2019), ITiCSE-WGR '19.

**Kutipan Izu et al. yang persis menggambarkan era kita:**

> "novice programmers should develop program comprehension skills as they learn to code so that they are able to **both read and reason about code created by others**, and to reflect on their code when writing, debugging or extending it"

*"read and reason about code created by others"* — di era agentic, hampir semua kode yang kamu hadapi adalah kode orang lain.

**⚠️ Peringatan penting dari riset:** Harms, Chen & Kelleher (2016, ICER '16) menemukan **distractor** (baris palsu yang disisipkan sebagai jebakan) **menurunkan efisiensi belajar** bagi pemula. Jadi: **mulai tanpa distractor.** Baru tambahkan setelah dasar terbentuk.

### 3.4 Storage strength, bukan fluency

Dari skill `teach` (mattpocock/skills, yang sudah jadi rujukan Bab 28 §28.8):

> "**Fluency can give the user an illusory sense of mastery, but storage strength is the real goal.**"

- **Fluency strength** = bisa mengingat saat itu juga
- **Storage strength** = benar-benar menempel jangka panjang

Tiga alat untuk membangun storage strength — semuanya sudah dipakai di repo ini, tinggal diterapkan ke JavaScript:

1. **Retrieval practice** — mengingat tanpa membaca. (Sudah ada: "review 15 menit TANPA membaca", Bab 28.7)
2. **Spacing** — disebar, bukan ditumpuk. (Sudah ada: ritme mingguan)
3. **Interleaving** — campur topik terkait saat latihan.

Dan satu prinsip yang menjelaskan kenapa cara lama gagal:

> "**For acquiring knowledge, difficulty is the enemy.** It eats working memory you need for understanding. **For skill acquisition, difficulty is the tool.**"

Artinya: saat **memahami konsep baru**, kecilkan kesulitan (jelas, analogi, contoh). Saat **melatih**, justru besarkan (prediksi dulu, jangan dikasih tahu).

### 3.5 Transfer kepemilikan — obat untuk comprehension debt

Ini bagian yang menyambungkan semuanya dengan kartun "Vibe Construction".

PRIMM menggambarkan perpindahan kepemilikan kode dalam tiga langkah:

```
"not mine"  →  "partly mine"  →  "mine"
   (Run)          (Modify)        (Make)
```

**Masalah era vibe coding adalah kepemilikan yang melompat.** Kode masuk ke repo, kamu setujui, tapi statusnya masih **"not mine"** — lalu ia dirilis seolah-olah "mine". Itulah yang Osmani sebut *comprehension debt*: repo itu punyamu, tapi kamu tidak bisa menjelaskan cara kerjanya.

Dan MIT Media Lab (*Your Brain on ChatGPT*, Kosmyna et al., arXiv 2506.08872, Juni 2025) mengukur sisi syarafnya:

- 54 partisipan (18 lanjut ke sesi 4), diukur dengan **EEG**
- Konektivitas otak: **Brain-only paling kuat → Search Engine sedang → LLM paling lemah**
- *"Cognitive activity scaled down in relation to external tool use"*
- Kelompok LLM punya **rasa kepemilikan terendah** atas tulisannya sendiri, dan **kesulitan mengutip** kalimat yang baru saja mereka hasilkan

Jadi "transfer kepemilikan" itu bukan metafora puitis — ia punya korelat syaraf, dan ia yang mencegah comprehension debt.

---

## 4. Loop sesi mode inspeksi (adaptasi PRIMM)

Satu sesi = **satu konsep**, ≤ 1 jam. Mengikuti ritme yang sudah ditetapkan Bab 28.4 dan `MODE-PENYAMPAIAN.md` (tutor yang membaca, pembelajar tidak).

```
1. PREDIKSI    (10')  Tutor menyiapkan kode pendek (<15 baris).
                      Pembelajar menulis di KERTAS: output-nya apa, dan kenapa.
                      ← Tidak boleh dibantu. Ini bagian yang tidak bisa didelegasikan.

2. JALANKAN    (5')   Jalankan. Bandingkan dengan tebakan.
                      Di mana meleset?  ← DI SINI pelajarannya, bukan di jawaban benar.

3. BEDAH       (20')  Salah satu dari tiga (bergilir):
                        (a) TRACE — tuliskan nilai tiap variabel di tiap langkah
                        (b) PARSONS — susun ulang baris yang diacak
                        (c) BUG HUNT — tutor menyuntik bug, pembelajar menemukan
                      Tutor bertanya "kenapa kamu pilih itu?", TIDAK mengerjakan.

4. UBAH        (15')  Ubah SATU hal kecil. Prediksi lagi. Jalankan lagi.
                      ← di sini kepemilikan bergeser ke "partly mine"

5. CATAT       (10')  Tulis LEARNING-RECORD: apa yang dipahami, apa yang masih bingung,
                      satu miskonsepsi yang terdeteksi.
```

**Aturan keras:**

- **Prediksi ditulis SEBELUM menjalankan.** Ini sudah jadi aturan di `belajar-javascript/00-RENCANA.md` baris 84 — dipertahankan, dan sekarang punya dasar riset (PRIMM Predict + retrieval practice).
- **Tidak ada penyalinan kode.** PRIMM eksplisit: beri program untuk *dijalankan*, bukan *diketik ulang*. Menyalin menambah beban kognitif tanpa menambah pemahaman.
- **Tutor tidak memberi jawaban sebelum pembelajar menebak.** Mengikuti protokol penjelasan bertingkat `teach-build-coach` Tingkat 0.
- **Kalau dalam satu sesi tidak pernah salah, materinya terlalu mudah** — naikkan kesulitan. (Sudah ada di `00-RENCANA.md` baris 90; ini juga sesuai prinsip *desirable difficulty*.)

**`Make` (tahap 5 PRIMM) tidak dilakukan tiap sesi.** PRIMM sendiri menyatakan tahap-tahapnya *"may not be in every lesson"* dan tahap 1–4 *"may be cycled through several times"*. `Make` dilakukan **per unit** — setelah gate lolos.

---

## 5. Aturan memakai AI (posture)

Ini bukan pelengkap. Ini bagian yang menentukan hasil, menurut RCT Anthropic.

| Aturan | Dasar |
|---|---|
| **Tulis prediksi 2–3 kalimat dulu**, baru boleh bertanya ke AI. Pakai jawaban AI untuk **menguji teori**, bukan menggantinya. | RCT: pola "conceptual inquiry" skornya di atas 65% |
| **Minta penjelasan sebelum minta kode.** *"Jelaskan cara kerjanya, alternatifnya, dan trade-off-nya."* | Sama — ini persis pola yang skornya tinggi |
| **Kalau AI memberi kode, kamu wajib bisa menjelaskan tiap barisnya.** Kalau tidak bisa → jangan pakai. | MIT: kelompok LLM kesulitan mengutip karyanya sendiri |
| **Perlakukan output AI seperti PR dari junior.** Baca, kritik, bantah. | Osmani: *"Would you merge it just because the tests passed?"* |
| **Turunkan ulang dari nol sesekali** — ambil kode yang AI tulis, coba tulis sendiri. | Kalibrasi: mengukur berapa yang diam-diam hilang |
| **Tutup sesi dengan: hari ini saya belajar, atau cuma menutup tugas?** | Osmani: *"Ship and learn are two separate metrics"* |

---

## 6. Gate yang bisa diperiksa (bukan tanggal)

Menggantikan "ujian akhir" yang sifatnya hafalan. Tiga gerbang berurutan, semuanya **bisa diperiksa**.

### Gerbang 1 — Trace (ambang 50%)

Ambil kode **15 baris yang belum pernah kamu lihat**. Tuliskan di kertas, langkah per langkah, nilai setiap variabel. Buka di debugger. Hitung akurasi.

**Lulus kalau ≥ 50%** — ambang dari Lister et al. (2004). Kalau di bawah, **jangan lanjut ke `Modify`**; ulangi `Investigate`.

### Gerbang 2 — Inspeksi kode orang lain

Baca satu file JavaScript **yang bukan kamu tulis** (boleh hasil AI). Jelaskan:
1. Apa yang dilakukannya
2. **Satu** keputusan desain di dalamnya — dan kenapa itu dipilih
3. **Satu** cara kode itu bisa gagal

**Lulus kalau ketiganya bisa dijawab tanpa membuka catatan.** Ini versi terperiksa dari "kesimpulan kartun Vibe Construction".

### Gerbang 3 — Bug hunt

Diberi kode dengan **satu bug yang disuntik** (bukan bug acak — tutor tahu di mana). Temukan, dan jelaskan **kenapa** itu bug.

**Lulus kalau menemukan tanpa menjalankan kode** (baca saja). Kalau harus menjalankan dulu untuk menemukan, itu sah — tapi tandai dan ulangi latihannya.

---

## 7. Yang dihapus dari cara lama

| Cara lama | Kenapa dihapus |
|---|---|
| Tulis dari nol di editor kosong | Di era AI ini gratis; dan riset PRIMM menyebutnya sumber frustrasi bagi pemula |
| Menghafal sintaks / nama method | Bisa dicari; agent sudah tahu |
| Copy-paste kode lalu pastikan jalan | Skor kognitif terendah (<40%) di RCT Anthropic |
| Tutorial "buat aplikasi X" dari awal | Menyembunyikan JavaScript di balik framework — sudah jadi aturan di `00-RENCANA.md` baris 129 |
| Menonton tutorial video panjang | Pasif. Tidak ada prediksi, tidak ada retrieval. |
| Langsung `Make` sebelum `Investigate` | Melanggar ambang 50% tracing |

---

## 8. Hubungan dengan Bab 28 dan skill yang sudah ada

Penting: **tidak ada yang perlu dibangun dari nol.** Mesinnya sudah ada.

| Yang sudah ada | Dipakai untuk apa |
|---|---|
| **Bab 28** (`28-Panduan-Mode-Belajar-Workflow.md`) | Kerangka: protokol 4 blok, ritme sesi, LR, larangan kontaminasi, "checkpoint gagal = ulangi" |
| `MODE-PENYAMPAIAN.md` | **Tutor yang membaca, pembelajar tidak.** Berlaku mutlak. |
| `teach-build-coach` | Protokol penjelasan bertingkat (Tingkat 0–4) + anatomi sesi 1 jam |
| `teach-clarifier` | Protokol 4 blok untuk pertanyaan ke pembelajar |
| `teach-system-design` | Workspace stateful (`MISSION.md`, `RESOURCES.md`, `LEARNING-RECORDS/`) |
| `belajar-javascript/00-RENCANA.md` | Aturan "tulis tebakan sebelum jalankan" — **sudah benar**, tinggal diperkuat |

**Yang belum ada dan jadi inti usulan ini:** lapisan **`Investigate`** (trace, Parsons, bug hunt) yang eksplisit, plus **gate terukur** (§6).

Bab 28 membangun jalur **arsitektur** (12 fase, 12–18 bulan). Usulan ini adalah **jalur bahasa** — prasyaratnya. Keduanya bisa jalan bersamaan, tapi **bahasa dulu**, karena Bab 28 sendiri menetapkan `teach-dsa` sebagai jalur paralel yang butuh dasar pemrograman.

---

## 9. MULAI dan SELESAI

**MULAI:** satu sesi pertama — tutor memberi **satu potongan kode JavaScript 10 baris**, pembelajar menulis tebakan output di kertas. Tidak ada penjelasan sebelum tebakan ditulis.

**SELESAI (kriteria yang bisa diperiksa, bukan tanggal):**

> Pembelajar bisa mengambil **file JavaScript 30 baris yang belum pernah dilihat** — lalu, **tanpa menjalankannya**, menuliskan: (a) apa yang dilakukannya, (b) nilai akhir tiap variabel utama, (c) satu cara kode itu bisa gagal. Lalu **dijalankan untuk memverifikasi** — dan tebakannya benar.

Itu satu kalimat, dan tidak bisa dipalsukan.

---

## 10. Risiko dan batas kejujuran

| Risiko | Penilaian jujur |
|---|---|
| PRIMM dirancang untuk **sekolah** (usia 11–14), bukan orang dewasa yang sudah pernah lihat sintaks | Adaptasi ke orang dewasa **belum teruji**. Yang bisa saya klaim: tahapannya masuk akal, bukan: "sudah terbukti untuk kasusmu" |
| Ambang 50% tracing dari Lister et al. (2004) | Studi 2004 — konteksnya kurikulum universitas 20 tahun lalu. Angkanya dipakai sebagai **ambang kasar**, bukan hukum |
| Parsons: distractor menurunkan efisiensi (Harms et al. 2016) | Sudah diakomodasi: mulai tanpa distractor |
| MIT *Your Brain on ChatGPT* | Studi **penulisan esai**, bukan coding. Penulisnya sendiri menyebut perlu penelitian lanjut. Dipakai sebagai indikasi arah, bukan bukti langsung untuk programming |
| RCT Anthropic | Sampel kecil (52), **satu library**, mayoritas junior. Peneliti menyatakan efek pada produk agentic *"likely to be more pronounced"* — tapi itu perkiraan, bukan hasil |
| Banyak artikel "cara belajar coding 2026" di web | **Tidak dipakai.** Sesuai aturan sumber `MODE-PENYAMPAIAN.md`: blog pribadi/SEO/konten AI dilarang sebagai sumber |

---

## 11. Keputusan xcode (25 September 2026)

Tiga hal yang tidak boleh saya tebak sudah dijawab:

| Pertanyaan | Keputusan xcode | Akibat pada desain |
|---|---|---|
| **Untuk siapa** | **Pemula absolut** — belum pernah menulis kode | Titik mulai mundur jauh: bukan "referensi vs nilai", tapi **"nama menunjuk nilai"**. `Investigate` tidak bisa jadi tahap pertama karena pemula belum bisa membaca kode sama sekali. |
| **Nasib `belajar-javascript/`** | **Buat panduan baru yang lebih relevan** — tidak memakai cara lama | `belajar-javascript/` (7 file) **tidak disentuh**. Dibuat jalur terpisah untuk pemula absolut. |
| **Kedalaman** | **Sampai Gerbang 3 + bikin satu hal** | Perlu 3 tingkatan: baca → nilai → bongkar. Berakhir di Unit 13 (`Make`). |

**Hasil:** `belajar-javascript-dari-nol/00-PANDUAN.md` — 3 tingkatan, 13 unit, 3 gerbang, satu jalur linear tanpa cabang.

**Yang BELUM dibuat:** materi per unit (13 unit). Sesuai aturan kerja: satu halaman sederhana dulu, tambah hanya kalau diminta.

**Dua jalur terpisah, jangan digabung:**

| | `belajar-javascript/` (lama) | `belajar-javascript-dari-nol/` (baru) |
|---|---|---|
| Untuk | Sudah pernah lihat sintaks | **Belum pernah menulis kode** |
| Mulai dari | Referensi vs nilai | Nama menunjuk nilai |
| Unit | 6 langkah, 7 minggu | 13 unit, 3 tingkatan, ± 12 minggu |
| Berakhir di | Ujian 6 pertanyaan | Gerbang 3 + bikin satu hal |

---

## 12. Sumber

### Pedagogi (punya bukti, sumber resmi)

| Sumber | Yang diambil |
|---|---|
| [PRIMM — Computing Education Research Centre](https://computingeducationresearch.org/projects/primm/) (Univ. Cambridge; dikembangkan di King's College London) | Lima tahap, rasional membaca-dulu, riwayat studi 2017–2021, 188 sitasi |
| [NCCA Pedagogy Quick Read #11 — PRIMM](https://static.teachcomputing.org/pedagogy/QR11-PRIMM.pdf) (Teach Computing / Raspberry Pi Foundation) | Studi 500 pembelajar 8–12 minggu; ambang **50% tracing** (Lister et al. 2004); transfer kepemilikan *"not mine" → "mine"*; dasar Vygotsky/ZPD |
| [NCCA Pedagogy Quick Read #13 — Parsons Problems](https://static.teachcomputing.org/pedagogy/QR13-Parsons-problems.pdf) | Manfaat Parsons; peringatan **distractor** (Harms et al. 2016); Denny et al. 2008; Izu et al. 2019 |
| Sentance, S., Waite, J., & Kallia, M. (2019) *Teaching computer programming with PRIMM: a sociocultural perspective*. Computer Science Education 29(2–3), 136–176. DOI: 10.1080/08993408.2019.1608781 | Studi utama PRIMM |
| Lister, R. et al. (2004) *A multi-national study of reading and tracing skills in novice programmers*. ACM SIGCSE Bulletin 36(4), 119–150 | Ambang 50% tracing |
| Schulte, C. (2008) *Block Model*. ICER '08 | Kerangka pemahaman program (dipakai PRIMM & Parsons) |

### Era AI (sudah diverifikasi sesi sebelumnya)

| Sumber | Yang diambil |
|---|---|
| [Anthropic — How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills) (arXiv 2601.20245, Jan 2026) | 50% vs 67%; pola interaksi >65% vs <40%; gap terbesar di debugging |
| [MIT Media Lab — Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt/) (Kosmyna et al., arXiv 2506.08872) | 54 partisipan; EEG; cognitive debt; rasa kepemilikan terendah di grup LLM |
| [Addy Osmani — Don't Outsource the Learning](https://addyosmani.com/blog/dont-outsource-learning/) | *"The tool didn't determine the outcome. The posture did."* |

### Mesin yang sudah ada di repo ini

| Sumber | Yang diambil |
|---|---|
| `MATERI-PECAHAN/28-Panduan-Mode-Belajar-Workflow.md` | Protokol 4 blok, ritme sesi, LR, gerbang per fase, larangan kontaminasi |
| `skills/teach-build-coach/SKILL.md` + `MODE-PENYAMPAIAN.md` | Penjelasan bertingkat Tingkat 0–4; tutor yang membaca; metode saat bilang "belum paham" |
| [mattpocock/skills — teach](https://github.com/mattpocock/skills/blob/main/skills/productivity/teach/SKILL.md) | Storage strength vs fluency; retrieval/spacing/interleaving; *"difficulty is the enemy for knowledge, the tool for skill"* |
| `belajar-javascript/00-RENCANA.md` | Aturan "tulis tebakan sebelum jalankan" — dipertahankan, kini punya dasar riset |

---

_Dibuat: 25 September 2026 · Status: USULAN, menunggu keputusan xcode_
