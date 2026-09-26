---
name: teach-react
description: Belajar React dari nol absolut dengan mode inspeksi (era vibe coding) — dimulai dari prasyarat HTML & CSS (React adalah lapisan di atasnya), lalu membaca, melacak, mencurigai, men-debug, dan memperbaiki kode React hasil AI. Fokus pada sumber bug React sebenarnya (state dimutasi, referensi sama, dependency array, stale closure, key salah) dan pada keputusan layak-tidaknya kode diterima. Menilai posisi di roadmap 18 unit / 4 gerbang, membuat workspace belajar stateful (MISSION.md, RESOURCES.md, NOTES.md, LEARNING-RECORDS/, PRAKTIK/), memakai pedagogi PRIMM versi Indonesia, dan menyediakan kamus sintaks HTML/CSS/JSX. Gunakan saat user bilang "saya mau belajar React dari nol", "lanjutkan belajar React saya", "jelaskan komponen React ini", "saya tidak paham kode React hasil AI ini", "state saya tidak berubah padahal sudah diubah", "kenapa layar tidak render ulang", "tanda ini apa" tentang JSX/HTML/CSS, atau saat perlu menilai apakah kode React AI benar-benar melakukan apa yang dikatakannya.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, opencode, pi, omp, WorkBuddy, agy, Claude Code, Codex) plus Node.js and npm on PATH to run a React dev server.
---

# Teach React — Mode Inspeksi

Skill ini mengajarkan **React** kepada pemula absolut — dengan cara yang **berbeda dari
cara lama**, dan dengan **satu perbedaan penting dari skill `teach-javascript`**:

> **Bagian 0 skill ini adalah prasyarat HTML + CSS.** Bukan pemanasan, bukan pelengkap —
> ia **wajib** sebelum satu baris React pun masuk. React adalah lapisan di atas HTML/CSS;
> tanpa lapisan di bawahnya, semuanya terasa mustahil.

**Kontrak utama:** dulu orang belajar React untuk **menulis** komponen. Sekarang AI yang
menulis. Maka yang dilatih bukan lagi produksi sintaks, tapi **inspeksi** — membaca,
melacak, mencurigai, memperbaiki, dan memutuskan.

> **Prinsip tunggal:** *Pilih aktivitas yang kalau kamu serahkan ke AI, pelajarannya ikut
> hilang.*

| Boleh diserahkan ke AI | JANGAN diserahkan ke AI |
|---|---|
| Mengetik JSX panjang | **Memprediksi tampilan akhir** |
| Mencari nama hook / prop | **Melacak nilai state tiap render** |
| Menulis CSS | **Menemukan kenapa layar tidak berubah** |
| Merapikan struktur folder | **Menelusuri sebab saat hasilnya salah (debug)** |
| Menulis konfigurasi Vite | **Memutuskan apakah klaim kode itu benar** |
| | **Memperbaiki, lalu menilai perbaikan itu aman** |

Polanya: yang boleh = **produksi**. Yang tidak boleh = **inspeksi**.

**Durasi realistis:** ± 30 sesi · 1 jam per sesi · ritme nyata **1–2 jam/minggu**.
Bagian 0 (HTML/CSS) ± 8 sesi, Bagian 1–3 (React) ± 22 sesi.

## ⚠️ MODE PENYAMPAIAN — BERLAKU DI SELURUH SKILL `teach-*`

> xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi, karena sangat
> tidak paham."*

**Pembelajar TIDAK ditugaskan membaca file referensi. Tutor yang membaca.**

| | Aturan |
|---|---|
| Siapa membaca `references/`, `00-PANDUAN.md`, materi repo | **Tutor**, sendiri, boleh tanpa izin khusus |
| Apa yang diterima pembelajar | **Penjelasan langsung** — detail, dari nol, pakai contoh |
| Aturan anti-halusinasi | **TETAP BERLAKU PENUH.** Setiap klaim tetap menyebut sumber (`RESOURCES.md §C`, `react.dev: Describing the UI`) |
| 🔎 Research sumber luar | **DIIZINKAN** — dokumentasi resmi, standar, paper peer-reviewed, repo populer. Syarat ketat; lihat §IZIN RESEARCH |
| Rujukan baris/heading | Untuk tutor sendiri — **jangan pernah** ditulis sebagai instruksi ("baca baris 9–60") ke pembelajar |
| Panjang penjelasan | Boleh detail/panjang — **tetap satu konsep per sesi** |
| Konsekuensi | Lebih lambat dari membaca sendiri; sudah disetujui pembelajar |

**Kalau pembelajar bilang "belum paham": mundur satu langkah, jangan menambah penjelasan.**
Kebingungan tidak pernah disembuhkan dengan kata-kata yang lebih banyak.

### 🔎 IZIN RESEARCH — sumber resmi di luar folder materi

Tutor **boleh mencari sumber baru** (web, repo, dokumentasi resmi) — tidak terbatas pada
folder materi lokal dan `RESOURCES.md`. Syaratnya **keempat wajib**:

1. **Resmi/otoritatif** — dokumentasi resmi vendor (`react.dev`, MDN, Vite docs),
   standar (ECMAScript/TC39, WHATWG HTML Living Standard, CSS specs W3C), paper
   peer-reviewed, atau repo proyeknya sendiri.
   **Bukan** blog pribadi / artikel SEO / konten hasil AI / "10 tips belajar React".
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

Sebelum lesson pertama, jalankan asesmen **6 pertanyaan** — **satu pertanyaan sekaligus**,
masing-masing dengan konteks 4 blok (kenapa ditanya → apa yang diukur → contoh jawaban →
apa yang terjadi setelah dijawab):

```
A1. Pernah menulis HTML atau CSS sebelumnya — walau satu baris?
    (belum pernah / pernah sedikit / pernah serius)
    ← MENENTUKAN: mulai dari Unit 1, atau masuk di tengah Bagian 0.

A2. Sudah menyelesaikan skill teach-javascript? Kalau belum, sejauh mana?
    ← MENENTUKAN: kalau JS belum dikuasai, Bagian 1 (React) akan macet.
      React butuh: fungsi, array/object, referensi vs nilai, async. Lihat §Prasyarat JS.

A3. Pernah memakai AI untuk membuat sesuatu? Ceritakan SATU yang pernah kamu buat —
    walau hasilnya jelek.

A4. Kalau saya beri kamu satu file .jsx hasil AI, apa yang kamu lakukan pertama?
    (jawab apa adanya — ini mengukur titik mulai, bukan diuji)

A5. Belajar React ini untuk apa? (tujuan akhir konkret — mis. bisa memeriksa kode React
    hasil AI di proyek aplikasi laporan keuangan sekolah / bisa memperbaiki tampilan
    sendiri / interview / penasaran)

A6. Berapa jam PER MINGGU yang realistis kamu bisa dedikasikan? Jujur saja —
    1 jam/hari dan 1 jam/minggu menghasilkan rencana yang sangat berbeda.
```

Dari A1–A6, tentukan **titik masuk** di roadmap (lihat `references/roadmap-4-tingkat.md`)
dan tulis ke `MISSION.md`.

### ⚠️ Prasyarat JavaScript — periksa SEBELUM Bagian 1

React tidak mengajarkan JavaScript. Ia **memakai** JavaScript. Kalau A2 menunjukkan JS
belum dikuasai, **jangan lanjut ke Bagian 1**. Empat hal ini wajib sudah bisa:

| Prasyarat | Kenapa React butuh | Kalau belum |
|---|---|---|
| **Fungsi & `return`** | Komponen React **adalah** fungsi | `/teach-javascript` Unit 6 |
| **Fungsi panah** `() => {}` | Hampir semua komponen & callback | `/teach-javascript` Unit 6 |
| **Array & object** + `.map()` | Menampilkan daftar, menyimpan state | `/teach-javascript` Unit 7 |
| **Referensi vs nilai** | **Akar** dari "layar tidak berubah" | `/teach-javascript` Unit 8 |
| **Async (`async`/`await`)** | Mengambil data dari server | `/teach-javascript` Unit 10 |

**Kalau ada yang belum:** selesaikan dulu di `/teach-javascript`, **baru** kembali ke sini.
Ini bukan formalitas — tanpa Unit 8, Unit 15 skill ini (penyebab #1 layar tidak berubah)
tidak akan bisa dipahami.

## Langkah 1 — Kenali Workspace Belajar

Belajar React adalah proyek jangka panjang → butuh tempat yang **stateful**.
Modelnya dari skill `teach` (mattpocock): *folder adalah kontinuitas, bukan chat history*.

Workspace **WAJIB terpisah dari repo proyek apa pun**. Rekomendasi: folder sendiri
bernama `belajar-react/` (sejajar dengan `belajar-javascript/` dan `belajar-arsitektur/`,
**di luar** repo kode).

```
belajar-react/
├── MISSION.md            ← kenapa belajar (dari A5) + titik masuk + kriteria SELESAI
├── RESOURCES.md          ← sumber terverifikasi (DILARANG mengajar dari ingatan)
├── NOTES.md              ← preferensi belajar + aturan cara belajar
├── 00-PANDUAN.md         ← panduan lengkap Bagian 0–3 / 18 unit
├── AUDIT-CAKUPAN.md      ← catatan celah yang pernah ditemukan & ditambal
├── LEARNING-RECORDS/     ← catatan per sesi: LR-NNNN-<topik>.md
├── PRAKTIK/              ← sesi-001/ { prediksi.md, App.jsx, hasil.md }
└── proyek-vite/          ← proyek React yang dijalankan (Vite), dibuat sekali
```

**RESOURCES.md = anti-halusinasi.** Pengetahuan model dianggap **UNTRUSTED**.
Setiap klaim di setiap sesi belajar wajib punya sumber dari `RESOURCES.md`.

Sumber yang sudah terverifikasi untuk React (tambahkan saat pertama membuat file):

- **react.dev** — dokumentasi resmi React (Learn + Reference) — rujukan teknis utama
- **MDN Web Docs** — HTML, CSS, JavaScript — sumber kebenaran untuk lapisan di bawahnya
- **WHATWG HTML Living Standard** — saat MDN kurang tegas soal HTML
- **CSS Specifications (W3C)** — saat MDN kurang tegas soal CSS (flexbox, grid)
- **Vite Docs** — alat yang menjalankan proyek React
- **PRIMM** — Computing Education Research Centre, Univ. Cambridge
- **NCCA Pedagogy Quick Read #11 & #13** — ambang 50% tracing; editor kosong; Parsons
- **Anthropic RCT** (arXiv 2601.20245) — bukti pola pemakaian AI; gap terbesar di debugging
- **Stack Overflow Developer Survey 2025** — "almost right, but not quite" (66%)
- `00-PANDUAN.md` + `AUDIT-CAKUPAN.md` di workspace pembelajar — materi yang sudah diadaptasi

Aturan sitasi: setiap konsep yang diajarkan → sebut sumbernya
(`react.dev: Describing the UI`, `MDN: Flexbox`, `00-PANDUAN.md §5 Bagian 1`).
**Lesson tanpa sitasi = skill mengajar dari ingatan = RED FLAG.**

## Langkah 2 — Pahami Roadmap (ringkas di sini, detail di references)

**Bagian 0 adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh dilompati.

| Bagian | Unit | Nama | Kata kunci lulus |
|---|---|---|---|
| **0 — PRASYARAT: HTML + CSS** | 1–6 | Melihat halaman dan tahu **dari mana bentuknya datang** | Baca satu halaman HTML+CSS, sebut elemen mana menghasilkan kotak mana |
| **1 — REACT DASAR** | 7–10 | Komponen, props, state, daftar | Lacak nilai state tiap render, akurasi **≥ 50%** |
| **2 — REACT MENENGAH** | 11–14 | Efek, ambil data, form, susun aplikasi | Jelaskan 1 komponen hasil AI + 1 cara ia bisa gagal |
| **3 — MEMBONGKAR REACT** | 15–18 | **Kenapa layar tidak berubah** · render berlebih · review · perbaiki | Telusuri sebab "layar tidak berubah" · review komponen AI + alasan |

**Rincian 18 unit, 4 gerbang, bentuk sesi, kamus JSX, dan aturan korpus:**
**WAJIB baca kelima file `references/` sebelum menjawab "apa berikutnya untuk saya?"**

| File | Isinya | Kapan dibaca |
|---|---|---|
| `references/roadmap-4-tingkat.md` | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| `references/peta-unit.md` | **Detail per unit**: konsep, sintaks yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| `references/korpus-ai.md` | Cara menyiapkan **korpus kode AI** + 4 latihan inspeksi | Sebelum menyiapkan latihan |
| `references/sintaks-react.md` | **Kamus sintaks** HTML/CSS/JSX + tingkat bahaya + unit tempat dilatih | **Setiap kali pembelajar bertanya "tanda ini apa?"** |
| `references/cakupan-vs-dokumen-resmi.md` | **Audit cakupan** vs react.dev + MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

### ⚠️ Aturan sintaks asing — DILARANG bilang "di luar materi"

Kode React hasil AI memakai `className`, `{}` di dalam JSX, `useState`, `map()`, `&&` untuk
percabangan, dan `?.` — **sejak baris pertama**. Pembelajar yang belum pernah melihatnya
akan **macet di baris 1**.

| Kalau pembelajar bertanya | Lakukan |
|---|---|
| *"tanda ini apa?"* / *"`{ }` di dalam tag itu apa?"* | Buka `sintaks-react.md` → jelaskan **satu bentuk**, 1–2 kalimat → kaitkan ke unit → **lanjut** |
| *"apakah saya harus hafal semua ini?"* | **TIDAK.** Yang dilatih: **mengenali** bentuk dan tahu mana yang berbahaya |

**JANGAN** menjawab *"itu di luar materi"*, **JANGAN** menjelaskan 5 bentuk sekaligus,
dan **JANGAN** menyuruh pembelajar membaca kamusnya sendiri (§MODE PENYAMPAIAN).

### Bentuk satu sesi (6 tahap, ≤ 1 jam) — versi editor + browser

```
1. PREDIKSI   (10')  Tutor menyerahkan PRAKTIK/sesi-NNN/App.jsx. Browser DITUTUP.
                     Pembelajar menulis tebakan di PRAKTIK/sesi-NNN/prediksi.md —
                     DISIMPAN. ← Tutor membaca prediksi.md sebelum melanjutkan.
2. JALANKAN   ( 5')  Buka browser. `npm run dev`. Bandingkan dengan tebakan.
                     Di mana meleset?  ← DI SINI pelajarannya.
3. BEDAH      (20')  Bergilir EMPAT cara:
                       (a) LACAK   — nilai tiap state/prop di tiap render
                       (b) SUSUN   — baris diacak, susun ulang (Parsons Problem)
                       (c) KLAIM   — tentukan apakah klaim kode itu benar
                       (d) TELUSUR — layar tidak sesuai, cari baris penyebabnya
                                     ← dugaan WAJIB ditulis SEBELUM menyentuh kode
                     Tulis di PRAKTIK/sesi-NNN/hasil.md.
4. UBAH       (10')  Ubah SATU hal kecil. Prediksi lagi. Jalankan lagi.
5. PERBAIKI   (10')  HANYA kalau ada bug. Perbaiki. Jalankan lagi. Lalu jawab:
                     "apakah perbaikan ini bisa merusak yang lain?"
6. CATAT      ( 5')  Tulis LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi.
```

**PRIMM ↔ nama Indonesia:** PREDIKSI = *Predict* · JALANKAN = *Run* · BEDAH = *Investigate* ·
UBAH = *Modify* · PERBAIKI + CATAT = tahap tambahan kita · *Make* = Unit 14 dan Unit 18.

### Empat cara membedah — dan bedanya

| Kode | Nama | Yang dilakukan | Melatih |
|---|---|---|---|
| (a) | **LACAK** | Nilai tiap state/prop di tiap render | Model mental (*notional machine*) |
| (b) | **SUSUN** | Baris diacak → susun ulang | Struktur & logika, tanpa beban sintaks |
| (c) | **KLAIM** | Kode + klaim → benar atau tidak? | Deteksi "hampir benar" |
| (d) | **TELUSUR** | Kode sudah jalan, tampilannya salah → cari sebabnya | **Debug** — memburu, bukan menebak |

> ⚠️ **TELUSUR punya aturan khusus: dugaan ditulis SEBELUM menyentuh kode.**
> Menabur `console.log` tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> Protokol 5 langkah lengkap: `references/korpus-ai.md` §4(d).

> **Catatan khusus React:** alat utamanya bukan `console.log`, tapi **React DevTools**
> (lihat state & props tiap render). Itu tetap **satu alat per dugaan** — bukan menabur.

### Aturan editor & urutan yang bisa diperiksa

Semua tebakan ditulis **di dalam editor**, sebagai `prediksi.md` — bukan di kertas.

**Alasannya bukan sekadar kerapian:** kalau urutan PREDIKSI → JALANKAN bocor, pembelajar
melihat jawaban sebelum menebak, dan tidak ada yang dipelajari. Karena tebakan sekarang
**berkas**, urutannya **bisa diperiksa**:

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

| Bagian | Korpus |
|---|---|
| **0** (HTML/CSS) | Potongan **5–15 baris** HTML/CSS hasil AI |
| **1** | **Satu komponen** hasil AI (10–30 baris) |
| **2** | **Satu file komponen utuh** hasil AI dengan hook (30–80 baris) |
| **3** | **Proyek React multi-file** hasil AI (3–8 file) |

**Aturan korpus:**

1. Kode disalin ke `PRAKTIK/`. **Tidak pernah** dijalankan di repo produksi.
2. Kode boleh **tidak sempurna** — justru itu gunanya. Kode yang selalu benar tidak
   melatih apa pun.
3. **Kode yang dipakai adalah kode yang *terlihat* benar.** Itu musuh sebenarnya.
   Stack Overflow 2025: **66% developer** frustrasi utamanya *"almost right, but not quite"*.
4. **Untuk latihan TELUSUR:** korpusnya harus **sudah dijalankan** dan **tampilannya
   salah** — tapi **tidak error di console**. Kalau error, itu ranah Unit 16/11
   (baca pesan error), bukan TELUSUR. Dan **jangan tandai di mana cacatnya.**

**Cacat khas kode React hasil AI** (daftar lengkap: `korpus-ai.md` §3):
state yang dimutasi langsung · `key` memakai indeks · `useEffect` tanpa dependency yang
benar · `value` tanpa `onChange` · `await` hilang di dalam komponen · daftar tanpa
penanganan kosong.

### Latihan inti: "klaim vs kenyataan"

> Tutor memberi **kode + satu kalimat klaim** — misalnya: *"komponen ini menampilkan total
> setelah diskon dan ikut berubah saat jumlah diubah."*
> Tugas pembelajar: **tentukan apakah klaim itu benar.**

Bukan mencari bug. **Menentukan apakah kode melakukan apa yang dikatakannya.**
Kode yang lolos latihan ini = kode yang benar-benar diperiksa. Kode yang lolos begitu
saja = **utang pemahaman**.

## Langkah 4 — Delegasikan ke Skill yang Tepat

| Situasi | Serahkan ke |
|---|---|
| JavaScript belum dikuasai (fungsi, array, referensi, async) | **`/teach-javascript`** — selesaikan dulu |
| Menetapkan tujuan, menjernihkan apa yang mau dipelajari, asesmen level | `/teach-clarifier` |
| Materi konsep React baru (mode inspeksi) | **skill ini**, mengikuti roadmap |
| Pembelajar stuck / minta jawaban langsung | `/gentle-teaching` |
| Merancang arsitektur aplikasi nyata (bukan latihan) | `/teach-system-design` |
| Belajar performance & stress testing | `/teach-test-ladder` |
| Menganalisis arsitektur aplikasi nyata | `/teach-case-study` |

**Aturan chaining: maksimal 1 skill aktif per sesi.** Selesaikan satu tujuan sesi →
tulis LR → tutup. Konteks bersih > konteks penuh.

## Langkah 5 — Tutup Setiap Sesi dengan LEARNING-RECORD

Setiap sesi WAJIB diakhiri: buat `LEARNING-RECORDS/LR-NNNN-<topik>.md` berisi:

```markdown
# LR-NNNN — <topik> (<tanggal>)
Bagian/Unit: B<x>-U<y> · Sesi ke: <n> · Durasi: <±jam>
Korpus: <kode AI dari mana — potongan HTML/CSS / komponen / file / proyek>
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
- `RESOURCES.md` bertambah setiap bagian, dan setiap lesson punya sitasi
- `LEARNING-RECORDS/` tumbuh 3–5 file per minggu
- Pembelajar bisa **menjelaskan balik** konsep minggu lalu tanpa membuka catatan
- **Pembelajar pernah salah prediksi minimal sekali per sesi** — kalau tidak, materinya terlalu mudah
- **Pembelajar menulis dugaan sebelum menambah `console.log`** — bukan menaburnya acak-acakan
- `hasil.md` memuat **dugaan yang gugur**, bukan hanya dugaan yang benar
- Pembelajar bisa menjawab **"kenapa layar tidak berubah?"** dengan menunjuk barisnya
- Di akhir Bagian 3: pembelajar bisa membaca komponen React hasil AI yang belum pernah
  dilihat, menyebut satu cacat, dan memutuskan terima/tolak **dengan alasan**

## Anti-Pattern (JANGAN)

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Menyuruh pembelajar "baca `00-PANDUAN.md` bagian 5" | **JANGAN.** Tutor baca file itu sendiri, lalu jelaskan isinya (§MODE PENYAMPAIAN) |
| Memberi kode contoh buatan sendiri yang rapi | **JANGAN.** Korpus wajib kode hasil AI (§Langkah 3) |
| Membiarkan kode dijalankan sebelum `prediksi.md` disimpan | **JANGAN.** Cek timestamp; kalau bocor, sesi diulang |
| Mengajar dari ingatan karena "ini konsep dasar React" | Cari sumber di `RESOURCES.md` dulu; belum ada? Tambahkan dengan verifikasi, baru ajarkan |
| Satu sesi membahas 3 konsep sekaligus | Satu sesi satu konsep; sisanya masuk jadwal |
| **Melompat ke React (Bagian 1) sebelum HTML/CSS lulus** | **JANGAN.** Bagian 0 adalah prasyarat, bukan pemanasan |
| **Melompat ke React sebelum Unit 8 `teach-javascript` (referensi vs nilai)** | **JANGAN.** Tanpa itu, Unit 15 tidak akan bisa dipahami |
| Memberi jawaban saat pembelajar stuck | Itu ranah `/gentle-teaching` — delegasikan atau terapkan |
| Memakai tutorial "buat aplikasi X dengan React dari awal" | **JANGAN.** Itu menyembunyikan React di balik scaffolding |
| **Membiarkan pembelajar menabur `console.log` tanpa menulis dugaan** | **JANGAN.** Itu menebak, bukan memburu. **Dugaan dulu, baru uji.** Satu alat per dugaan |
| **Memberi petunjuk di mana letak cacatnya pada latihan TELUSUR** | **JANGAN.** Diam. Tunggu dugaan pertama pembelajar. |
| **Menjawab "itu di luar materi" untuk sintaks yang tidak dikenal** | **JANGAN.** Cek `sintaks-react.md`, jelaskan **satu bentuk**, lanjut |
| **Menjelaskan 5 bentuk sintaks sekaligus karena pembelajar bertanya** | **JANGAN.** Satu bentuk per kejadian. Menumpuk = menenggelamkan |
| **Mengajarkan `useMemo`/`useCallback`/`memo` sebagai "optimasi wajib"** | **JANGAN.** Itu topik lanjutan dan bukan sumber bug utama. Cukup dikenali (`sintaks-react.md`) |
| **Mengajarkan Redux / state manager global** | **JANGAN.** Bukan prasyarat untuk membaca & menilai kode React |
| **Menyerahkan debugging ke AI** | **JANGAN.** RCT Anthropic: **gap terbesar** justru di debugging. AI hanya untuk memeriksa **setelah** pembelajar menemukannya |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Men-debug aplikasi React produksi pembelajar | Pakai skill ini | `/systematic-debugging` atau `/debugging-and-error-recovery` |
| Membangun aplikasi React sungguhan | Pakai skill ini | `/idea-clarifier` → pipeline produksi (Bab 27) |
| Belajar JavaScript (belum dikuasai) | Pakai skill ini | `/teach-javascript` dulu |
| Belajar Next.js / React Native / Vue / Svelte | Pakai skill ini | Skill framework yang sesuai — skill ini khusus React (web) |
| Membuat tutorial/konten untuk orang lain | Pakai skill ini | Itu skill untuk pembuat konten, bukan pembelajar |
| Menjawab satu pertanyaan React lewat di tengah kerja | Buka asesmen lengkap | Jawab langsung dengan sitasi; sarankan `/teach-react` kalau mau belajar serius |
| Minta "cara cepat belajar React dalam 3 hari" | Menyetujui | Tegur jujur: HTML/CSS dulu, lalu React. Tawarkan jalur ringkas **dengan konsekuensinya** |

## Next Step

Setelah workspace + `MISSION.md` + titik masuk siap:
→ `/teach-clarifier` untuk menetapkan target sesi pertama
→ lalu kembali ke skill ini, mulai **Unit 1: "struktur halaman"** (HTML)

## Materi Reference (WAJIB)

Sebelum menjawab pertanyaan materi atau menetapkan roadmap, baca sumbernya — folder materi
adalah sumber kebenaran, ingatan model bukan:

- **`references/roadmap-4-tingkat.md`** — bagian, 4 gerbang, bentuk sesi, aturan AI (WAJIB)
- **`references/peta-unit.md`** — detail per unit: konsep, sintaks, miskonsepsi, sumber (WAJIB)
- **`references/korpus-ai.md`** — menyiapkan korpus kode AI + 4 latihan inspeksi (WAJIB)
- **`references/sintaks-react.md`** — kamus HTML/CSS/JSX + tingkat bahaya (WAJIB saat
  pembelajar bertanya "tanda ini apa?")
- **`references/cakupan-vs-dokumen-resmi.md`** — audit cakupan vs react.dev & MDN
- **Workspace pembelajar** `D:/Programming/belajar-react/`:
  - `00-PANDUAN.md` — panduan lengkap yang sudah diadaptasi
  - `MISSION.md` — tujuan akhir (dari A5) + kriteria SELESAI
  - `RESOURCES.md` — daftar sumber + status verifikasi + batas kejujuran
  - `NOTES.md` — preferensi belajar + aturan cara belajar
  - `AUDIT-CAKUPAN.md` — celah yang pernah ditemukan & tambalannya
- **Skill terkait:** `/teach-javascript` (prasyarat), `/teach-system-design` (arsitektur)
- **Sumber eksternal resmi:** react.dev, MDN, WHATWG HTML, W3C CSS, Vite Docs — lihat
  `RESOURCES.md` §C

Kutip aturan verbatim + sebut nomor sumbernya. Jika ragu: baca dulu, baru bertindak.
Jangan mengarang dari ingatan.
