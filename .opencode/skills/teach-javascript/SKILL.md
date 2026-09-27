---
name: teach-javascript
description: Belajar fundamental JavaScript dari nol absolut sampai mahir dengan mode inspeksi (era vibe coding) — membaca kode hasil generate AI, melacak nilai variabel, menemukan bug, menelusuri sebab saat hasilnya salah (debug), memperbaiki, dan memutuskan layak-tidaknya kode diterima. Menilai posisi pembelajar di roadmap 4 tingkatan / 20 unit (18 bergerbang + 2 pelengkap), membuat workspace belajar stateful (MISSION.md, RESOURCES.md, NOTES.md, LEARNING-RECORDS/, PRAKTIK/), memakai pedagogi PRIMM (Predict-Run-Investigate-Modify-Make) versi Indonesia, dan menyediakan kamus ±50 bentuk sintaks modern yang muncul di kode AI. Gunakan saat user bilang "saya mau belajar JavaScript dari nol", "lanjutkan belajar JavaScript saya", "jelaskan kode JavaScript ini ke saya", "saya tidak paham kode hasil AI ini", "kode ini jalan tapi hasilnya salah", "tanda ini apa" tentang sintaks JS, atau saat perlu menilai apakah kode AI benar-benar melakukan apa yang dikatakannya.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, opencode, pi, omp, WorkBuddy, agy, Claude Code, Codex).
---

# Teach JavaScript — Mode Inspeksi

Skill ini mengajarkan **fundamental JavaScript** kepada pemula absolut — tetapi dengan
cara yang **berbeda dari cara lama**.

**Kontrak utama:** dulu orang belajar JavaScript untuk **menulis** kode. Sekarang AI yang
menulis. Maka yang dilatih bukan lagi produksi sintaks, tapi **inspeksi** — membaca,
melacak, mencurigai, memperbaiki, dan memutuskan.

> **Prinsip tunggal:** *Pilih aktivitas yang kalau kamu serahkan ke AI, pelajarannya ikut
> hilang.*

| Boleh diserahkan ke AI | JANGAN diserahkan ke AI |
|---|---|
| Mengetik kode panjang | **Memprediksi output** |
| Mencari nama method | **Melacak nilai variabel** |
| Menulis konfigurasi | **Menemukan bug** |
| Merapikan format | **Menelusuri sebab saat hasilnya salah (debug)** |
| | **Memutuskan apakah klaim kode itu benar** |
| | **Memperbaiki, lalu menilai perbaikan itu aman** |

Polanya: yang boleh = **produksi**. Yang tidak boleh = **inspeksi**.

**Durasi realistis:** ± 25 sesi · 1 jam per sesi · ritme nyata **1–2 jam/minggu**.
Ini bukan sprint. Skill ini dirancang bertahan sepanjang perjalanan itu.

## ⚠️ MODE PENYAMPAIAN — BERLAKU DI SELURUH SKILL `teach-*`

> xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi, karena sangat
> tidak paham."*

**Pembelajar TIDAK ditugaskan membaca file referensi. Tutor yang membaca.**

| | Aturan |
|---|---|
| Siapa membaca `references/`, `00-PANDUAN.md`, materi repo | **Tutor**, sendiri, boleh tanpa izin khusus |
| Apa yang diterima pembelajar | **Penjelasan langsung** — detail, dari nol, pakai contoh |
| Aturan anti-halusinasi | **TETAP BERLAKU PENUH.** Setiap klaim tetap menyebut sumber (`RESOURCES.md §C`, `MDN: Closures`) |
| 🔎 Research sumber luar | **DIIZINKAN** — dokumentasi resmi, standar, paper peer-reviewed, repo populer. Syarat ketat; lihat §IZIN RESEARCH |
| Rujukan baris/heading | Untuk tutor sendiri — **jangan pernah** ditulis sebagai instruksi ("baca baris 9–60") ke pembelajar |
| Panjang penjelasan | Boleh detail/panjang — **tetap satu konsep per sesi** |
| Konsekuensi | Lebih lambat dari membaca sendiri; sudah disetujui pembelajar |

**Kalau pembelajar bilang "belum paham": mundur satu langkah, jangan menambah penjelasan.**
Kebingungan tidak pernah disembuhkan dengan kata-kata yang lebih banyak.

### 🔎 IZIN RESEARCH — sumber resmi di luar folder materi

Tutor **boleh mencari sumber baru** (web, repo, dokumentasi resmi) — tidak terbatas pada
folder materi lokal dan `RESOURCES.md`. Syaratnya **keempat wajib**:

1. **Resmi/otoritatif** — dokumentasi resmi vendor (MDN, Node.js docs), standar
   (ECMAScript/TC39, WHATWG), paper peer-reviewed, atau repo proyeknya sendiri.
   **Bukan** blog pribadi / artikel SEO / konten hasil AI / "10 tips belajar JavaScript".
2. **Populer & teruji** — dipakai luas di industri nyata; riwayat rilis & kontributor jadi bukti.
3. **Bisa dipertanggungjawabkan** — jelas penulis/lembaga, ada tanggal, ada versi.
4. **Terverifikasi langsung** — tutor membuka sendiri sumbernya, lalu mencatat **apa yang
   TIDAK diverifikasi**.

**JANGAN menjanjikan "akurat 100%".** Yang dijanjikan sebagai gantinya:

- sumbernya **nyata dan sudah dibuka sendiri** (bukan dari ingatan),
- sumber disebut **lengkap** (URL + judul + tanggal akses) supaya pembelajar bisa memeriksa
  sendiri tanpa harus percaya pada tutor,
- **batasnya diakui jujur** — klaim satu sumber dikatakan sebagai klaim satu sumber,
- kalau sumber layak **tidak ditemukan → bilang tidak ada**, jangan menutupi dengan sumber lemah.

**Prinsipnya: *bukti bisa diperiksa* lebih berharga daripada *janji akurasi*.**

**Wajib dicatat:** setiap sumber baru masuk `RESOURCES.md` pembelajar (§A/§C/§E) dengan
tanggal verifikasi. Sumber yang dipakai tapi belum terdaftar = pelanggaran aturan folder.

## Sebelum Mulai: Asesmen Posisi (WAJIB, tidak boleh dilewati)

Jangan menebak level pembelajar. Untuk pemula absolut, tebakan akan salah dengan cara yang
paling merugikan: mengajarkan hal yang sudah dipahami, atau melompati prasyarat.

Sebelum lesson pertama, jalankan asesmen **5 pertanyaan** — **satu pertanyaan sekaligus**,
masing-masing dengan konteks 4 blok (kenapa ditanya → apa yang diukur → contoh jawaban →
apa yang terjadi setelah dijawab):

```
A1. Pernah menulis kode sebelumnya — bahasa apa pun, walau satu baris?
    Kalau pernah, sejauh mana? (belum pernah / pernah sedikit / pernah serius)
A2. Pernah memakai AI (ChatGPT, Claude, Cursor, opencode, dll) untuk membuat
    sesuatu? Ceritakan SATU yang pernah kamu buat — walau hasilnya jelek.
A3. Kalau saya beri kamu satu file .js 20 baris hasil AI, apa yang kamu lakukan
    pertama? (jawab apa adanya — ini mengukur titik mulai, bukan diuji)
A4. Belajar JavaScript ini untuk apa? (tujuan akhir konkret — mis. bisa mengaudit
    kode proyek React sendiri / bisa memperbaiki aplikasi laporan keuangan sekolah
    / interview / penasaran)
A5. Berapa jam PER MINGGU yang realistis kamu bisa dedikasikan? Jujur saja —
    1 jam/hari dan 1 jam/minggu menghasilkan rencana yang sangat berbeda.
```

Dari A1–A5, tentukan **titik masuk** di roadmap (lihat `references/roadmap-4-tingkat.md`)
dan tulis ke `MISSION.md`.

**Aturan penting untuk A4:** tujuan akhir **bukan hiasan**. Ia dipakai di akhir untuk
mengaudit apakah materi ini benar-benar berguna (lihat §Cek Tanda Berhasil). Materi yang
rapi secara topik tapi tidak bisa dipakai untuk tujuan A4 **dianggap belum selesai**.

## Langkah 1 — Kenali Workspace Belajar

Belajar JavaScript adalah proyek jangka panjang → butuh tempat yang **stateful**.
Modelnya dari skill `teach` (mattpocock): *folder adalah kontinuitas, bukan chat history*.

Workspace **WAJIB terpisah dari repo proyek apa pun**. Rekomendasi: folder sendiri
bernama `belajar-javascript/` (sejajar dengan `belajar-arsitektur/`, **di luar** repo kode).

```
belajar-javascript/
├── MISSION.md            ← kenapa belajar (dari A4) + titik masuk + kriteria SELESAI
├── RESOURCES.md          ← sumber terverifikasi (DILARANG mengajar dari ingatan)
├── NOTES.md              ← preferensi belajar + aturan cara belajar
├── 00-PANDUAN.md         ← panduan lengkap 4 tingkatan / 18 unit
├── AUDIT-CAKUPAN.md      ← catatan celah yang pernah ditemukan & ditambal
├── LEARNING-RECORDS/     ← catatan per sesi: LR-NNNN-<topik>.md
└── PRAKTIK/              ← sesi-001/ { prediksi.md, kode.js, hasil.md }
```

**Workspace ini sudah ada** di `D:/Programming/belajar-javascript/`. Kalau belum ada,
buat dengan struktur di atas. **Jangan** menaruh latihan di repo produksi mana pun.

**RESOURCES.md = anti-halusinasi.** Pengetahuan model dianggap **UNTRUSTED**.
Setiap klaim di setiap sesi belajar wajib punya sumber dari `RESOURCES.md`.

Sumber yang sudah terverifikasi untuk JavaScript (tambahkan saat pertama membuat file):

- **MDN Web Docs — JavaScript Guide & Reference** — rujukan teknis utama
- **ECMAScript Language Specification (TC39)** — sumber kebenaran perilaku bahasa
  (mis. kenapa `"2" + 2 === "22"`); dipakai saat MDN kurang tegas
- **Node.js Docs** — saat kode dijalankan lewat `node kode.js`
- **PRIMM** — Computing Education Research Centre, Univ. Cambridge — kerangka
  Predict-Run-Investigate-Modify-Make
- **NCCA Pedagogy Quick Read #11 & #13** — ambang 50% tracing; editor kosong;
  Parsons Problems
- **Anthropic RCT** (arXiv 2601.20245) — bukti pola pemakaian AI: >65% vs <40%
- **MIT Media Lab "Your Brain on ChatGPT"** (arXiv 2506.08872) — cognitive debt
- **Stack Overflow Developer Survey 2025** — "almost right, but not quite" (66%)
- `00-PANDUAN.md` + `AUDIT-CAKUPAN.md` di workspace pembelajar — materi yang sudah diadaptasi

Aturan sitasi: setiap konsep yang diajarkan → sebut sumbernya
(`MDN: Closures`, `ECMAScript §13.2`, `00-PANDUAN.md §5 Tingkat 2`).
**Lesson tanpa sitasi = skill mengajar dari ingatan = RED FLAG.**

## Langkah 2 — Pahami Roadmap (ringkas di sini, detail di references)

| Tingkat | Unit | Nama | Kata kunci lulus |
|---|---|---|---|
| **1 — BISA MEMBACA** | 1–6 | Melihat kode dan tahu **apa yang terjadi** | Lacak 15 baris kode asing, akurasi **≥ 50%** |
| **2 — BISA MENILAI** | 7–10 | Melihat kode dan tahu **apa yang salah, dan kenapa** | Jelaskan 1 file hasil AI + 1 cara kode itu bisa gagal |
| **3 — BISA MEMBONGKAR** | 11–14 | **Menemukan, menelusuri, memperbaiki** cacat pada satu file | Temukan cacat **tanpa menjalankan** · **telusuri** sebab saat hasilnya salah · perbaiki & buktikan |
| **4 — BISA MEMUTUSKAN** | 15–18 | Menilai kode AI **pada skala nyata** | Review proyek 3–6 file: terima/tolak **+ alasan** |
| **PELENGKAP** | 19–20 | **JSON · tanggal · angka lokal · pola teks** | Bisa menyebut 2 jebakan "hasil salah tanpa error" |

> **Unit 19–20 tidak bergerbang** — boleh diajarkan kapan saja setelah Tingkat 2.
> Ia ada karena audit cakupan vs MDN (26 Sep 2026) menemukan tiga hal yang wajib untuk
> aplikasi keuangan tapi tidak diajarkan: `JSON.parse` yang melempar error, `parseFloat`
> pada angka ber-koma Indonesia, dan desimal yang tidak eksak.

**Rincian 20 unit, 4 gerbang, bentuk sesi, kamus sintaks, dan aturan korpus:**
**WAJIB baca keempat file `references/` sebelum menjawab "apa berikutnya untuk saya?"**

| File | Isinya | Kapan dibaca |
|---|---|---|
| `references/roadmap-4-tingkat.md` | Tingkat, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| `references/peta-unit.md` | **Detail per unit**: konsep, sintaks yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| `references/korpus-ai.md` | Cara menyiapkan **korpus kode AI** + 4 latihan inspeksi | Sebelum menyiapkan latihan |
| `references/sintaks-modern.md` | **Kamus ± 50 bentuk sintaks** + tingkat bahaya + unit tempat dilatih | **Setiap kali pembelajar bertanya "tanda ini apa?"** |
| `references/cakupan-vs-mdn.md` | **Audit cakupan** terhadap MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

### ⚠️ Aturan sintaks asing — DILARANG bilang "di luar materi"

Kode hasil AI memakai `const`, `=>`, `?.`, `??`, `...`, destructuring **sejak baris pertama**.
Pembelajar yang belum pernah melihatnya akan **macet di baris 1** — bukan karena konsepnya
sulit, tapi karena bentuknya asing.

| Kalau pembelajar bertanya | Lakukan |
|---|---|
| *"tanda ini apa?"* / *"`?.` itu apa?"* | Buka `sintaks-modern.md` → jelaskan **satu bentuk**, 1–2 kalimat → kaitkan ke unit → **lanjut** |
| *"apakah saya harus hafal semua ini?"* | **TIDAK.** Yang dilatih: **mengenali** bentuk dan tahu mana yang berbahaya. Menghafal sintaks bukan tujuan |

**JANGAN** menjawab *"itu di luar materi"*, **JANGAN** menjelaskan 5 bentuk sekaligus,
dan **JANGAN** menyuruh pembelajar membaca kamusnya sendiri (§MODE PENYAMPAIAN — tutor
yang membaca).

### Bentuk satu sesi (6 tahap, ≤ 1 jam) — versi Zed

```
1. PREDIKSI   (10')  Tutor menyerahkan PRAKTIK/sesi-NNN/kode.js. Panel terminal DITUTUP.
                     Pembelajar menulis tebakan di PRAKTIK/sesi-NNN/prediksi.md — DISIMPAN.
                     ← Tutor membaca prediksi.md sebelum melanjutkan.
2. JALANKAN   ( 5')  Buka terminal. node kode.js. Bandingkan dengan tebakan.
                     Di mana meleset?  ← DI SINI pelajarannya.
3. BEDAH      (20')  Bergilir EMPAT cara:
                       (a) LACAK   — nilai tiap variabel di tiap langkah
                       (b) SUSUN   — baris diacak, susun ulang (Parsons Problem)
                       (c) KLAIM   — tentukan apakah klaim kode itu benar
                       (d) TELUSUR — hasil salah, cari baris penyebabnya
                                     ← dugaan WAJIB ditulis SEBELUM menyentuh kode
                     Tulis di PRAKTIK/sesi-NNN/hasil.md.
4. UBAH       (10')  Ubah SATU hal kecil. Prediksi lagi. Jalankan lagi.
5. PERBAIKI   (10')  HANYA kalau ada bug. Perbaiki. Jalankan lagi. Lalu jawab:
                     "apakah perbaikan ini bisa merusak yang lain?"
6. CATAT      ( 5')  Tulis LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi.
```

**PRIMM ↔ nama Indonesia:** PREDIKSI = *Predict* · JALANKAN = *Run* · BEDAH = *Investigate* ·
UBAH = *Modify* · PERBAIKI + CATAT = tahap tambahan kita (memperbaiki & merefleksikan) ·
*Make* = Unit 14 dan Unit 18.

### Empat cara membedah — dan bedanya

| Kode | Nama | Yang dilakukan | Melatih |
|---|---|---|---|
| (a) | **LACAK** | Nilai tiap variabel di tiap langkah | Model mental (*notional machine*) |
| (b) | **SUSUN** | Baris diacak → susun ulang | Struktur & logika, tanpa beban sintaks |
| (c) | **KLAIM** | Kode + klaim → benar atau tidak? | Deteksi "hampir benar" |
| (d) | **TELUSUR** | Kode sudah jalan, hasilnya salah → cari sebabnya | **Debug** — memburu, bukan menebak |

> ⚠️ **TELUSUR punya aturan khusus: dugaan ditulis SEBELUM menyentuh kode.**
> Menabur `console.log` tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> Protokol 5 langkah lengkap: `references/korpus-ai.md` §4(d).

### ⚠️ Aturan Zed — kertas tidak dipakai lagi (ditetapkan 25 Sep 2026)

xcode: *"ubah konsep dari saya menulis di kertas menjadi di dalam code editor saja (zed)"*.

Semua tebakan ditulis **di dalam Zed**, sebagai `prediksi.md` — bukan di kertas.

**Alasannya bukan sekadar kerapian:** di Zed, kode hanya berjarak satu klik dari dijalankan.
Kalau urutan PREDIKSI → JALANKAN bocor, pembelajar melihat jawaban sebelum menebak, dan
tidak ada yang dipelajari. Karena tebakan sekarang **berkas**, urutannya **bisa diperiksa**:

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

**Timestamp `prediksi.md` harus lebih tua daripada waktu kode dijalankan.** Kalau tidak,
sesi itu tidak dihitung sebagai bukti paham, dan diulang.

### 4 aturan sesi yang mengikat

1. **Tulis `prediksi.md` sebelum menjalankan apa pun.** Diperiksa lewat timestamp.
2. **Tidak menyalin kode.** Kode diberi untuk **dijalankan**, bukan diketik ulang.
   Menyalin menambah lelah tanpa menambah paham.
3. **Tidak bertanya ke AI sebelum menulis tebakan.** Kalau AI yang menebak, pembelajar
   tidak melatih apa pun.
4. **Kalau dalam satu sesi tidak pernah salah, materinya terlalu mudah.** Naikkan kesulitannya.

## Langkah 3 — Korpus Latihan: WAJIB kode hasil generate AI

Ini bagian yang paling sering hilang. Bukan *apa* yang dipelajari — tapi **dari mana
kodenya diambil**.

**Semua kode latihan diambil dari kode hasil generate AI.** Bukan ditulis tutor.

| Tingkat | Korpus |
|---|---|
| **1** | Potongan **4–8 baris** hasil AI untuk tugas kecil |
| **2** | **Fungsi utuh** hasil AI — termasuk salinan dari proyek §A4 sendiri |
| **3** | **Satu file utuh** hasil AI (30–80 baris) |
| **4** | **Proyek multi-file** hasil AI (3–6 file) |

**Aturan korpus:**

1. Kode disalin ke `PRAKTIK/`. **Tidak pernah** dijalankan di repo produksi.
2. Kode boleh **tidak sempurna** — justru itu gunanya. Kode yang selalu benar tidak
   melatih apa pun.
3. **Kode yang dipakai adalah kode yang *terlihat* benar.** Itu musuh sebenarnya.
   Stack Overflow 2025: **66% developer** frustrasi utamanya *"almost right, but not quite"*.
   Bukan kode yang jelas salah — kode yang hampir benar.
4. **Untuk latihan TELUSUR:** korpusnya harus **sudah dijalankan** dan **hasilnya salah** —
   tapi **tidak error**. Kalau error, itu ranah Unit 11 (baca pesan error), bukan Unit 13.
   Dan **jangan tandai di mana cacatnya.**

### Latihan inti: "klaim vs kenyataan"

> Tutor memberi **kode + satu kalimat klaim** — misalnya: *"fungsi ini menghitung total
> setelah diskon."*
> Tugas pembelajar: **tentukan apakah klaim itu benar.**

Bukan mencari bug. **Menentukan apakah kode melakukan apa yang dikatakannya.**
Kode yang lolos latihan ini = kode yang benar-benar diperiksa. Kode yang lolos begitu
saja = **utang pemahaman**.

## Langkah 4 — Delegasikan ke Skill yang Tepat

| Situasi | Serahkan ke |
|---|---|
| Menetapkan tujuan, menjernihkan apa yang mau dipelajari, asesmen level | `/teach-clarifier` (interview interaktif) |
| Materi konsep JavaScript baru (mode inspeksi) | **skill ini**, mengikuti roadmap |
| Pembelajar stuck / minta jawaban langsung | `/gentle-teaching` (metode Socratic repo ini) |
| Review kode latihan dengan lensa struktur data & algoritma | `/dsa-review` |
| Merancang arsitektur aplikasi nyata (bukan latihan) | `/teach-system-design` |
| Belajar performance & stress testing | `/teach-test-ladder` |
| Menganalisis arsitektur aplikasi nyata | `/teach-case-study` |

**Aturan chaining: maksimal 1 skill aktif per sesi.** Selesaikan satu tujuan sesi →
tulis LR → tutup. Konteks bersih > konteks penuh.

## Langkah 5 — Tutup Setiap Sesi dengan LEARNING-RECORD

Setiap sesi WAJIB diakhiri: buat `LEARNING-RECORDS/LR-NNNN-<topik>.md` berisi:

```markdown
# LR-NNNN — <topik> (<tanggal>)
Tingkat/Unit: T<x>-U<y> · Sesi ke: <n> · Durasi: <±jam>
Korpus: <kode AI dari mana — 4-8 baris / fungsi / file / proyek>
## Yang dipelajari hari ini (3 poin max, kata-kata pembelajar)
## Prediksi vs kenyataan (di mana tebakan meleset — ini bagian terpenting)
## Miskonsepsi yang terkoreksi (jika ada)
## Bukti paham: <akurasi lacak / bug yang ditemukan / baris penyebab dari telusur /
                  perbaikan yang terbukti aman>
## Dugaan telusur (kalau ada): <dugaan apa, gugur atau terkonfirmasi>  ← ini bukti debug
## Sumber: <dari RESOURCES.md, dengan bagian spesifik>
## Selanjutnya: <1 langkah konkret + skill pemiliknya>
```

LR = memori jangka panjang. Sesi berikutnya: baca `MISSION.md` + LR terakhir dulu —
*jangan pernah* mengulang materi yang sudah terbukti (lihat LR), *jangan pernah*
melanjutkan dari ingatan chat lama.

## Cek Tanda Berhasil (It's working if)

- Membuka folder workspace + `MISSION.md` cukup untuk melanjutkan — tanpa chat lama
- `PRAKTIK/sesi-NNN/prediksi.md` **selalu ada dan timestamp-nya lebih tua** dari kode dijalankan
- `RESOURCES.md` bertambah setiap tingkat, dan setiap lesson punya sitasi
- `LEARNING-RECORDS/` tumbuh 3–5 file per minggu
- Pembelajar bisa **menjelaskan balik** konsep minggu lalu tanpa membuka catatan
- **Pembelajar pernah salah prediksi minimal sekali per sesi** — kalau tidak, materinya terlalu mudah
- **Pembelajar menulis dugaan sebelum menambah `console.log`** — bukan menaburnya acak-acakan
- `hasil.md` memuat **dugaan yang gugur**, bukan hanya dugaan yang benar
- Di akhir Tingkat 4: pembelajar bisa membaca file JS hasil AI yang belum pernah dilihat,
  menyebut satu cacat, dan memutuskan terima/tolak **dengan alasan**

## Anti-Pattern (JANGAN)

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Menyuruh pembelajar "baca `00-PANDUAN.md` bagian 5" | **JANGAN.** Tutor baca file itu sendiri, lalu jelaskan isinya (§MODE PENYAMPAIAN) |
| Memberi kode contoh buatan sendiri yang rapi | **JANGAN.** Korpus wajib kode hasil AI (§Langkah 3) |
| Membiarkan kode dijalankan sebelum `prediksi.md` disimpan | **JANGAN.** Cek timestamp; kalau bocor, sesi diulang |
| Mengajar dari ingatan karena "ini konsep dasar JS" | Cari sumber di `RESOURCES.md` dulu; belum ada? Tambahkan dengan verifikasi, baru ajarkan |
| Satu sesi membahas 3 konsep sekaligus | Satu sesi satu konsep; sisanya masuk jadwal |
| Melompat ke Tingkat 3 karena pembelajar tidak sabar | Tegur ramah: ambang 50% tracing itu gerbang, bukan formalitas. Tawarkan jalur jujur + konsekuensinya |
| Memberi jawaban saat pembelajar stuck | Itu ranah `/gentle-teaching` — delegasikan atau terapkan |
| Meminta pembelajar menulis tebakan di kertas | **JANGAN.** Semua di Zed (§Aturan Zed) |
| Menyuruh pembelajar "tulis kode dari nol di editor kosong" sebagai latihan utama | **JANGAN.** Itu cara lama — sumber frustrasi, dan di era AI ia gratis sehingga tidak melatih apa pun |
| Memakai tutorial "buat aplikasi X dari awal" | **JANGAN.** Itu menyembunyikan JavaScript di balik framework |
| **Membiarkan pembelajar menabur `console.log` tanpa menulis dugaan** | **JANGAN.** Itu menebak, bukan memburu. **Dugaan dulu, baru uji.** Satu `console.log` per dugaan |
| **Memberi petunjuk di mana letak cacatnya pada latihan TELUSUR** | **JANGAN.** Diam. Tunggu dugaan pertama pembelajar. |
| **Menjawab "itu di luar materi" untuk sintaks yang tidak dikenal** | **JANGAN.** Cek `sintaks-modern.md`, jelaskan **satu bentuk**, lanjut (§Aturan sintaks asing) |
| **Menjelaskan 5 bentuk sintaks sekaligus karena pembelajar bertanya** | **JANGAN.** Satu bentuk per kejadian. Menumpuk = menenggelamkan |
| **Menyerahkan debugging ke AI** | **JANGAN.** RCT Anthropic: **gap terbesar** justru di debugging. AI hanya untuk memeriksa **setelah** pembelajar menemukannya |
| **Menggabungkan Unit 12 (cari bug dengan membaca) dan Unit 13 (telusur)** | **JANGAN.** Dua kemampuan berbeda — statis vs dinamis. Ajarkan terpisah, uji terpisah |
| **Meminta pembelajar mengisi tabel markdown** | **JANGAN.** Kolom tabel harus sejajar — di editor teks itu menyiksa untuk diisi. Terjadi 27 Sep 2026: xcode menulis *"format tabel nya acak2an ketika mau saya isi"*, lalu memindahkan jawabannya ke file lain. Pakai **daftar ber-panah** (`- baris 2 →`). Tabel hanya untuk **bacaan** yang tutor isi sendiri. Kalau pembelajar menulis jawaban di file lain dan isinya jelas → **terima apa adanya**, jangan pindahkan — yang dinilai isinya, bukan letak filenya |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Men-debug kode proyek produksi pembelajar | Pakai skill ini | `/systematic-debugging` atau `/debugging-and-error-recovery` |
| Rancang arsitektur aplikasi NYATA produksi | Pakai skill ini | `/teach-system-design` lalu pipeline Bab 27 (`/scaffolder`, `/idea-clarifier`) |
| Membuat tutorial/konten untuk orang lain | Pakai skill ini | Itu skill untuk pembuat konten, bukan pembelajar |
| Menjawab satu pertanyaan JS lewat di tengah kerja | Buka asesmen lengkap | Jawab langsung dengan sitasi; sarankan `/teach-javascript` kalau mau belajar serius |
| Belajar bahasa lain (Python, PHP, Go) | Pakai skill ini | Cari skill bahasa yang sesuai — skill ini khusus JavaScript |
| Minta "cara cepat belajar JS dalam 3 hari" | Menyetujui | Tegur jujur: ambang 50% tracing tidak bisa dilewati. Tawarkan jalur ringkas **dengan konsekuensinya** |

## Next Step

Setelah workspace + `MISSION.md` + titik masuk siap:
→ `/teach-clarifier` untuk menetapkan target sesi pertama
→ lalu kembali ke skill ini, mulai Unit 1: **"nama menunjuk nilai"**

## Materi Reference (WAJIB)

Sebelum menjawab pertanyaan materi atau menetapkan roadmap, baca sumbernya — folder materi
adalah sumber kebenaran, ingatan model bukan:

- **`references/roadmap-4-tingkat.md`** — tingkat, 4 gerbang, bentuk sesi, aturan AI (WAJIB)
- **`references/peta-unit.md`** — detail per unit: konsep, sintaks, miskonsepsi, sumber (WAJIB)
- **`references/korpus-ai.md`** — menyiapkan korpus kode AI + 4 latihan inspeksi (WAJIB)
- **`references/sintaks-modern.md`** — kamus ± 50 bentuk sintaks + tingkat bahaya (WAJIB saat
  pembelajar bertanya "tanda ini apa?")
- **`references/cakupan-vs-mdn.md`** — audit cakupan vs MDN: apa yang sengaja dilewati & kenapa
- **Workspace pembelajar** `D:/Programming/belajar-javascript/`:
  - `00-PANDUAN.md` — panduan lengkap yang sudah diadaptasi
  - `MISSION.md` — tujuan akhir (dari A4) + kriteria SELESAI
  - `RESOURCES.md` — daftar sumber + status verifikasi + batas kejujuran
  - `NOTES.md` — preferensi belajar + aturan cara belajar
  - `AUDIT-CAKUPAN.md` — celah yang pernah ditemukan & tambalannya
- **Materi repo** (arsip, cara lama — jangan dipakai sebagai kurikulum):
  `belajar-javascript/` — disimpan hanya sebagai rujukan sejarah
- **Sumber eksternal resmi:** MDN, ECMAScript/TC39, Node.js Docs — lihat `RESOURCES.md` §C

Kutip aturan verbatim + sebut nomor sumbernya. Jika ragu: baca dulu, baru bertindak.
Jangan mengarang dari ingatan.
