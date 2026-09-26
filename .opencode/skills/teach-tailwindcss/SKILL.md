---
name: teach-tailwindcss
description: Belajar Tailwind CSS dari nol absolut dengan mode inspeksi (era vibe coding) — dimulai dari CSS yang disingkatnya (Tailwind adalah lapisan di atas CSS, bukan penggantinya), lalu membaca, melacak, mencurigai, dan memperbaiki kelas Tailwind hasil AI. Fokus pada sumber masalah Tailwind yang sebenarnya (kelas dinamis yang tidak ter-generate, urutan & konflik kelas, dark mode, breakpoint mobile-first, kelas yang menumpuk) dan pada keputusan layak-tidaknya tampilan diterima. Menilai posisi di roadmap 15 unit / 4 gerbang, membuat workspace belajar stateful, memakai pedagogi PRIMM versi Indonesia, dan menyediakan kamus kelas Tailwind v4 ke CSS asli. Gunakan saat user bilang "saya mau belajar Tailwind dari nol", "lanjutkan belajar Tailwind saya", "kelas Tailwind ini artinya apa", "kenapa warna saya tidak muncul di Tailwind", "styling saya tidak kena", atau saat perlu menilai apakah tampilan Tailwind hasil AI benar-benar seperti yang diklaim.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, opencode, pi, omp, WorkBuddy, agy, Claude Code, Codex) plus Node.js 20+ and npm on PATH to run a Vite dev server. Tailwind v4 requires a modern browser.
---

# Teach Tailwind CSS — Mode Inspeksi

Skill ini mengajarkan **Tailwind CSS** kepada pemula absolut — dengan cara yang **berbeda
dari cara lama**, dan dengan **satu perbedaan penting dari skill `teach-react`**:

> **Tailwind adalah lapisan di atas CSS, bukan penggantinya.** `p-4` **adalah**
> `padding: 1rem`. Kalau kamu tidak tahu apa itu padding, `p-4` tidak berarti apa-apa —
> kamu hanya menghafal teka-teki. Maka Bagian 0 skill ini adalah **CSS yang disingkatnya**.

**Kontrak utama:** dulu orang belajar Tailwind untuk **menulis** kelas. Sekarang AI yang
menulis. Maka yang dilatih bukan lagi produksi kelas, tapi **inspeksi** — membaca,
melacak, mencurigai, memperbaiki, dan memutuskan.

> **Prinsip tunggal:** *Pilih aktivitas yang kalau kamu serahkan ke AI, pelajarannya ikut
> hilang.*

| Boleh diserahkan ke AI | JANGAN diserahkan ke AI |
|---|---|
| Mengetik 20 kelas di satu elemen | **Menerjemahkan kelas → CSS asli** |
| Mencari nama kelas untuk efek tertentu | **Memprediksi tampilan akhir** |
| Menulis konfigurasi Vite | **Menemukan kenapa warna tidak muncul** |
| Merapikan urutan kelas | **Menelusuri sebab saat tampilannya salah (debug)** |
| Menulis `@theme` untuk token | **Memutuskan apakah tampilan itu benar** |

Polanya: yang boleh = **produksi**. Yang tidak boleh = **inspeksi**.

**Durasi realistis:** ± 24 sesi · 1 jam per sesi · ritme nyata **1–2 jam/minggu**.
Bagian 0 (CSS + cara kerja) ± 6 sesi, Bagian 1–3 (Tailwind) ± 18 sesi.

**Tujuan akhir skill ini:** pembelajar bisa **menerjemahkan** kelas Tailwind menjadi CSS
yang sebenarnya, **memprediksi** tampilannya, dan **menemukan** kenapa sebuah kelas tidak
bekerja — tanpa menebak-nebak.

## ⚠️ MODE PENYAMPAIAN — BERLAKU DI SELURUH SKILL `teach-*`

> xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi, karena sangat
> tidak paham."*

**Pembelajar TIDAK ditugaskan membaca file referensi. Tutor yang membaca.**

| | Aturan |
|---|---|
| Siapa membaca `references/`, `00-PANDUAN.md`, materi repo | **Tutor**, sendiri, boleh tanpa izin khusus |
| Apa yang diterima pembelajar | **Penjelasan langsung** — detail, dari nol, pakai contoh |
| Aturan anti-halusinasi | **TETAP BERLAKU PENUH.** Setiap klaim tetap menyebut sumber (`RESOURCES.md §C`, `tailwindcss.com/docs/display`) |
| 🔎 Research sumber luar | **DIIZINKAN** — dokumentasi resmi, standar, paper peer-reviewed, repo populer. Syarat ketat; lihat §IZIN RESEARCH |
| Rujukan baris/heading | Untuk tutor sendiri — **jangan pernah** ditulis sebagai instruksi ("baca baris 9–60") ke pembelajar |
| Panjang penjelasan | Boleh detail/panjang — **tetap satu konsep per sesi** |
| Konsekuensi | Lebih lambat dari membaca sendiri; sudah disetujui pembelajar |

**Kalau pembelajar bilang "belum paham": mundur satu langkah, jangan menambah penjelasan.**
Kebingungan tidak pernah disembuhkan dengan kata-kata yang lebih banyak.

### 🔎 IZIN RESEARCH — sumber resmi di luar folder materi

Tutor **boleh mencari sumber baru** (web, repo, dokumentasi resmi) — tidak terbatas pada
folder materi lokal dan `RESOURCES.md`. Syaratnya **keempat wajib**:

1. **Resmi/otoritatif** — dokumentasi resmi vendor (`tailwindcss.com`, MDN, Vite docs),
   standar (W3C CSS specs, WHATWG HTML), paper peer-reviewed, atau repo proyeknya sendiri.
   **Bukan** blog pribadi / artikel SEO / konten hasil AI / "10 tips belajar Tailwind".
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
C1. Pernah menulis CSS sebelumnya — walau satu baris?
    (belum pernah / pernah sedikit / pernah serius)
    ← MENENTUKAN: mulai dari Unit 1, atau masuk di tengah Bagian 0.

C2. Sudah menyelesaikan Bagian 0 skill teach-react? Kalau belum, sejauh mana?
    ← MENENTUKAN: Bagian 0 di sini **sama materinya** dengan Bagian 0 teach-react.
      Kalau sudah lulus Gerbang 1 teach-react, Bagian 0 di sini boleh dilewati.

C3. Sudah menyelesaikan skill teach-javascript? Kalau belum, sejauh mana?
    ← MENENTUKAN: Bagian 3 (kelas dinamis) butuh template literal `${}`.
      Tanpa itu, Unit 12 tidak bisa dipahami.

C4. Sudah pernah memakai React? Sampai mana?
    ← MENENTUKAN: latihan Bagian 2–3 memakai komponen React. Kalau belum,
      latihan bisa dikerjakan dengan HTML biasa (tutor menyesuaikan).

C5. Belajar Tailwind ini untuk apa? (tujuan akhir konkret — mis. tampilan aplikasi
    fullstack yang tidak terlihat "seperti buatan AI")
    ← MENENTUKAN: bobot Bagian 3. Kalau tujuannya "tampilan yang bagus", Unit 14
      dan Unit 15 dinaikkan porsinya.

C6. Berapa jam PER MINGGU yang realistis kamu bisa dedikasikan? Jujur saja —
    1 jam/hari dan 1 jam/minggu menghasilkan rencana yang sangat berbeda.
```

Dari C1–C6, tentukan **titik masuk** di roadmap (lihat `references/roadmap-4-tingkat.md`)
dan tulis ke `MISSION.md`.

### ⚠️ Prasyarat JavaScript — periksa SEBELUM Unit 12

Satu unit di skill ini **bergantung langsung** pada JavaScript, bukan CSS:

| Prasyarat | Kenapa Tailwind butuh | Kalau belum |
|---|---|---|
| **Template literal** `` `bg-${warna}-500` `` | **Unit 12** (kelas dinamis) tidak bisa dipahami tanpa ini | `/teach-javascript` Unit 6 |
| **Fungsi & ekspresi** | Kelas dibangun dari nilai yang dihitung | `/teach-javascript` Unit 6 |
| **Array & `.map()`** | Membangun daftar elemen berkelas sama | `/teach-javascript` Unit 7 |

**Kalau ada yang belum:** selesaikan dulu di `/teach-javascript`, **baru** kembali ke sini.
Ini bukan formalitas — Unit 12 adalah unit **terpenting** di skill ini, dan ia murni soal
JavaScript, bukan soal CSS.

## Langkah 1 — Kenali Workspace Belajar

Belajar Tailwind CSS adalah proyek jangka panjang → butuh tempat yang **stateful**.
Modelnya dari skill `teach` (mattpocock): *folder adalah kontinuitas, bukan chat history*.

Workspace **WAJIB terpisah dari repo proyek apa pun**. Rekomendasi: folder sendiri
bernama `belajar-tailwindcss/` (sejajar dengan `belajar-javascript/`, `belajar-react/`, dan
`belajar-nodejs/`, **di luar** repo kode).

```
belajar-tailwindcss/
├── MISSION.md            ← kenapa belajar (dari C5) + titik masuk + kriteria SELESAI
├── RESOURCES.md          ← sumber terverifikasi (DILARANG mengajar dari ingatan)
├── NOTES.md              ← preferensi belajar + aturan cara belajar
├── 00-PANDUAN.md         ← panduan lengkap Bagian 0–3 / 15 unit
├── AUDIT-CAKUPAN.md      ← catatan celah yang pernah ditemukan & ditambal
├── LEARNING-RECORDS/     ← catatan per sesi: LR-NNNN-<topik>.md
├── PRAKTIK/              ← sesi-001/ { prediksi.md, kode-ai.jsx, hasil.md }
└── proyek-vite/          ← proyek React + Tailwind yang dijalankan, dibuat sekali
```

**RESOURCES.md = anti-halusinasi.** Pengetahuan model dianggap **UNTRUSTED**.
Setiap klaim di setiap sesi belajar wajib punya sumber dari `RESOURCES.md`.

Sumber yang sudah terverifikasi untuk Tailwind CSS (tambahkan saat pertama membuat file):

- **tailwindcss.com/docs** — dokumentasi resmi Tailwind CSS (v4, CSS-first)
- **MDN Web Docs** — CSS, HTML, aksesibilitas — sumber kebenaran untuk lapisan di bawahnya
- **CSS Specifications (W3C)** — saat MDN kurang tegas (flexbox, grid, custom properties)
- **Vite Docs** — alat yang menjalankan proyek React + Tailwind
- **WCAG (W3C)** — kontras warna & aksesibilitas (Unit 14)
- **PRIMM** — Computing Education Research Centre, Univ. Cambridge
- **NCCA Pedagogy Quick Read #11 & #13** — ambang 50% tracing; editor kosong; Parsons
- **Anthropic RCT** (arXiv 2601.20245) — bukti pola pemakaian AI; gap terbesar di debugging
- **Stack Overflow Developer Survey 2025** — "almost right, but not quite" (66%)
- `00-PANDUAN.md` + `AUDIT-CAKUPAN.md` di workspace pembelajar — materi yang sudah diadaptasi

Aturan sitasi: setiap konsep yang diajarkan → sebut sumbernya
(`tailwindcss.com/docs/display`, `MDN: Flexbox`, `00-PANDUAN.md §5 Bagian 1`).
**Lesson tanpa sitasi = skill mengajar dari ingatan = RED FLAG.**

## Langkah 2 — Pahami Roadmap (ringkas di sini, detail di references)

**Bagian 0 adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh dilompati.

| Bagian | Unit | Nama | Kata kunci lulus |
|---|---|---|---|
| **0 — PRASYARAT: CSS + cara kerja** | 1–3 | Tahu **dari mana** kelas Tailwind datang | Baca satu halaman ber-Tailwind, sebut efek CSS tiap kelas |
| **1 — UTILITY INTI** | 4–7 | Tata letak, ruang, tipografi, warna, batas | Terjemahkan 20 kelas → CSS asli, akurasi **≥ 50%** |
| **2 — VARIAN, RESPONSIF, TEMA** | 8–11 | Keadaan, breakpoint, dark mode, keluar dari utility | Perbaiki layout React yang berantakan + jelaskan tiap kelas |
| **3 — MEMBONGKAR & MENJAGA** | 12–15 | **Kenapa kelas tidak ter-generate** · konflik · aksesibilitas · keputusan | Telusuri sebab "warna tidak muncul" · putuskan tampilan terima/tolak |

**Rincian 15 unit, 4 gerbang, bentuk sesi, kamus kelas, dan aturan korpus:**
**WAJIB baca kelima file `references/` sebelum menjawab "apa berikutnya untuk saya?"**

| File | Isinya | Kapan dibaca |
|---|---|---|
| `references/roadmap-4-tingkat.md` | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| `references/peta-unit.md` | **Detail per unit**: konsep, kelas yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| `references/korpus-ai.md` | Cara menyiapkan **korpus kode AI** + 4 latihan inspeksi | Sebelum menyiapkan latihan |
| `references/sintaks-tailwind.md` | **Kamus kelas Tailwind → CSS asli** + tingkat bahaya + unit tempat dilatih | **Setiap kali pembelajar bertanya "kelas ini artinya apa?"** |
| `references/cakupan-vs-dokumen-resmi.md` | **Audit cakupan** vs tailwindcss.com + MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

### ⚠️ Aturan sintaks asing — DILARANG bilang "di luar materi"

Kode Tailwind hasil AI memakai `className="flex items-center gap-4 rounded-lg shadow-md"`,
`hover:bg-blue-600`, `md:grid-cols-2`, `dark:text-white`, `bg-${warna}-500` — **sejak
baris pertama**. Pembelajar yang belum pernah melihatnya akan **macet di baris 1**.

| Kalau pembelajar bertanya | Lakukan |
|---|---|
| *"kelas ini artinya apa?"* | Buka `sintaks-tailwind.md` → terjemahkan **satu kelas** ke CSS aslinya, 1–2 kalimat → kaitkan ke unit → **lanjut** |
| *"apakah saya harus hafal semua kelas ini?"* | **TIDAK.** Yang dilatih: **menerjemahkan** dan tahu mana yang berbahaya |

**JANGAN** menjawab *"itu di luar materi"*, **JANGAN** menjelaskan 5 kelas sekaligus,
dan **JANGAN** menyuruh pembelajar membaca kamusnya sendiri (§MODE PENYAMPAIAN).

### Bentuk satu sesi (6 tahap, ≤ 1 jam) — versi editor + browser

```
1. PREDIKSI   (10')  Tutor menyerahkan PRAKTIK/sesi-NNN/App.jsx. Browser DITUTUP.
                     Pembelajar menulis tebakan di PRAKTIK/sesi-NNN/prediksi.md —
                     termasuk MENERJEMAHKAN tiap kelas ke CSS aslinya. DISIMPAN.
                     ← Tutor membaca prediksi.md sebelum melanjutkan.
2. JALANKAN   ( 5')  Buka browser. `npm run dev`. Bandingkan dengan tebakan.
                     Di mana meleset?  ← DI SINI pelajarannya.
3. BEDAH      (20')  Bergilir EMPAT cara:
                       (a) LACAK   — terjemahkan tiap kelas → CSS asli
                       (b) SUSUN   — kelas diacak, susun ulang (Parsons Problem)
                       (c) KLAIM   — tentukan apakah klaim tampilan itu benar
                       (d) TELUSUR — tampilan salah, cari kelas penyebabnya
                                     ← dugaan WAJIB ditulis SEBELUM menyentuh kode
                     Tulis di PRAKTIK/sesi-NNN/hasil.md.
4. UBAH       (10')  Ubah SATU kelas kecil. Prediksi lagi. Jalankan lagi.
5. PERBAIKI   (10')  HANYA kalau ada bug. Perbaiki. Jalankan lagi. Lalu jawab:
                     "apakah perbaikan ini bisa merusak yang lain?"
6. CATAT      ( 5')  Tulis LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi.
```

**PRIMM ↔ nama Indonesia:** PREDIKSI = *Predict* · JALANKAN = *Run* · BEDAH = *Investigate* ·
UBAH = *Modify* · PERBAIKI + CATAT = tahap tambahan kita · *Make* = Unit 11 dan Unit 15.

### Empat cara membedah — dan bedanya

| Kode | Nama | Yang dilakukan | Melatih |
|---|---|---|---|
| (a) | **LACAK** | Terjemahkan tiap kelas ke CSS aslinya, berurutan | Model mental (*notional machine*) |
| (b) | **SUSUN** | Kelas diacak → susun ulang sesuai target tampilan | Struktur & logika, tanpa beban menghafal nama |
| (c) | **KLAIM** | Kode + klaim tampilan → benar atau tidak? | Deteksi "hampir benar" |
| (d) | **TELUSUR** | Tampilan sudah jalan, hasilnya salah → cari kelas penyebabnya | **Debug** — memburu, bukan menebak |

> ⚠️ **TELUSUR punya aturan khusus: dugaan ditulis SEBELUM menyentuh kode.**
> Menghapus kelas satu per satu tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> Protokol 5 langkah lengkap: `references/korpus-ai.md` §4(d).

> **Catatan khusus Tailwind:** alat utamanya adalah **DevTools Inspector** (lihat CSS mana
> yang sebenarnya menang). Tapi **DevTools bukan pengganti dugaan** — ia membuat menebak
> lebih cepat, bukan lebih benar. Tetap **satu alat per dugaan**.

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
| **0** (CSS) | Potongan **5–15 baris** HTML + CSS hasil AI |
| **1** | **Satu elemen** dengan 8–15 kelas Tailwind hasil AI |
| **2** | **Satu komponen React** utuh ber-Tailwind hasil AI (20–50 baris) |
| **3** | **Satu halaman React** multi-komponen ber-Tailwind hasil AI (3–6 file) |

**Aturan korpus:**

1. Kode disalin ke `PRAKTIK/`. **Tidak pernah** dijalankan di repo produksi.
2. Kode boleh **tidak sempurna** — justru itu gunanya. Kode yang selalu benar tidak
   melatih apa pun.
3. **Kode yang dipakai adalah kode yang *terlihat* benar.** Itu musuh sebenarnya.
   Stack Overflow 2025: **66% developer** frustrasi utamanya *"almost right, but not quite"*.
4. **Untuk latihan TELUSUR:** korpusnya harus **sudah dijalankan** dan **tampilannya
   salah** — tapi **tidak ada error di console**. Kalau ada error, itu bukan TELUSUR.
   Dan **jangan tandai di mana cacatnya.**

**Cacat khas kode Tailwind hasil AI** (daftar lengkap: `korpus-ai.md` §3):
kelas dinamis yang tidak ter-generate · warna dengan shade yang tidak ada · kelas yang
bertabrakan tanpa disadari · `dark:` dipakai tanpa mode gelap diaktifkan · breakpoint
yang salah urutan · `<div onClick>` alih-alih `<button>` · fokus yang dihilangkan.

### Latihan inti: "klaim vs kenyataan"

> Tutor memberi **kode + satu kalimat klaim** — misalnya: *"tombol ini berwarna biru dan
> menjadi lebih gelap saat disorot."*
> Tugas pembelajar: **tentukan apakah klaim itu benar.**

Bukan mencari bug. **Menentukan apakah kode melakukan apa yang dikatakannya.**
Kode yang lolos latihan ini = kode yang benar-benar diperiksa. Kode yang lolos begitu
saja = **utang pemahaman**.

## Langkah 4 — Delegasikan ke Skill yang Tepat

| Situasi | Serahkan ke |
|---|---|
| JavaScript belum dikuasai (template literal, fungsi, `.map()`) | **`/teach-javascript`** — Unit 12 tidak akan bisa dipahami tanpa itu |
| Bagian 0 (CSS dasar) belum lulus di `teach-react` | **`/teach-react`** — materinya sama; jangan diulang dua kali |
| React belum dikuasai | **`/teach-react`** — Bagian 0–1 tetap boleh jalan lebih dulu |
| Backend / server / API | **`/teach-nodejs`** |
| Menetapkan tujuan, menjernihkan apa yang mau dipelajari, asesmen level | `/teach-clarifier` |
| Materi konsep Tailwind baru (mode inspeksi) | **skill ini**, mengikuti roadmap |
| Pembelajar stuck / minta jawaban langsung | `/gentle-teaching` |
| Merancang arsitektur aplikasi nyata (bukan latihan) | `/teach-system-design` |
| Menganalisis arsitektur aplikasi nyata | `/teach-case-study` |

**Aturan chaining: maksimal 1 skill aktif per sesi.** Selesaikan satu tujuan sesi →
tulis LR → tutup. Konteks bersih > konteks penuh.

## Langkah 5 — Tutup Setiap Sesi dengan LEARNING-RECORD

Setiap sesi WAJIB diakhiri: buat `LEARNING-RECORDS/LR-NNNN-<topik>.md` berisi:

```markdown
# LR-NNNN — <topik> (<tanggal>)
Bagian/Unit: B<x>-U<y> · Sesi ke: <n> · Durasi: <±jam>
Korpus: <kode AI dari mana — elemen / komponen / halaman>
## Yang dipelajari hari ini (3 poin max, kata-kata pembelajar)
## Prediksi vs kenyataan (di mana tebakan meleset — ini bagian terpenting)
## Miskonsepsi yang terkoreksi (jika ada)
## Bukti paham: <akurasi terjemahan kelas / kelas penyebab yang ditemukan /
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
- **Pembelajar menerjemahkan kelas ke CSS asli tanpa membuka kamus** — `p-4` → `padding: 1rem`
- **Pembelajar menulis dugaan sebelum menghapus kelas** — bukan menghapus acak-acakan
- `hasil.md` memuat **dugaan yang gugur**, bukan hanya dugaan yang benar
- Pembelajar bisa menjawab **"kenapa warna saya tidak muncul?"** dengan menunjuk penyebabnya
- Di akhir Bagian 3: pembelajar bisa membaca komponen ber-Tailwind hasil AI yang belum
  pernah dilihat, menyebut satu cacat, dan memutuskan **terima/tolak — dengan alasan**

## Anti-Pattern (JANGAN)

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Menyuruh pembelajar "baca `00-PANDUAN.md` bagian 5" | **JANGAN.** Tutor baca file itu sendiri, lalu jelaskan isinya (§MODE PENYAMPAIAN) |
| Memberi kode contoh buatan sendiri yang rapi | **JANGAN.** Korpus wajib kode hasil AI (§Langkah 3) |
| Membiarkan kode dijalankan sebelum `prediksi.md` disimpan | **JANGAN.** Cek timestamp; kalau bocor, sesi diulang |
| Mengajar dari ingatan karena "ini kelas dasar Tailwind" | Cari sumber di `RESOURCES.md` dulu; belum ada? Tambahkan dengan verifikasi, baru ajarkan |
| Satu sesi membahas 3 konsep sekaligus | Satu sesi satu konsep; sisanya masuk jadwal |
| **Mengajarkan kelas Tailwind sebelum CSS-nya dipahami** | **JANGAN.** `p-4` tanpa tahu padding = menghafal teka-teki. Bagian 0 adalah prasyarat |
| **Melompat ke Unit 12 tanpa template literal** | **JANGAN.** Itu unit terpenting, dan ia murni JavaScript |
| **Mengajarkan `@apply` sebagai "cara merapikan"** | **JANGAN.** Itu justru mengembalikan masalah yang Tailwind selesaikan. Unit 11 mengajarkan **kapan berhenti**, bukan cara menghindari utility |
| Memberi jawaban saat pembelajar stuck | Itu ranah `/gentle-teaching` — delegasikan atau terapkan |
| Memakai tutorial "bikin landing page dengan Tailwind" | **JANGAN.** Itu menyembunyikan Tailwind di balik menyalin desain |
| **Membiarkan pembelajar menghapus kelas acak tanpa menulis dugaan** | **JANGAN.** Itu menebak, bukan memburu. **Dugaan dulu, baru uji.** Satu alat per dugaan |
| **Memberi petunjuk di mana letak cacatnya pada latihan TELUSUR** | **JANGAN.** Diam. Tunggu dugaan pertama pembelajar. |
| **Menjawab "itu di luar materi" untuk kelas yang tidak dikenal** | **JANGAN.** Cek `sintaks-tailwind.md`, terjemahkan **satu kelas**, lanjut |
| **Menjelaskan 5 kelas sekaligus karena pembelajar bertanya** | **JANGAN.** Satu kelas per kejadian. Menumpuk = menenggelamkan |
| **Mengajarkan `tailwind.config.js` sebagai hal wajib** | **JANGAN.** Tailwind v4 memakai `@theme` di CSS. `config.js` masih ada untuk kasus lama — cukup dikenali |
| **Mengajarkan `@layer components` + `@apply` sebagai pola utama** | **JANGAN.** Bukan cara berpikir Tailwind, dan bukan sumber masalah utama |
| **Menyerahkan debugging ke AI** | **JANGAN.** RCT Anthropic: **gap terbesar** justru di debugging. AI hanya untuk memeriksa **setelah** pembelajar menemukannya |
| **Mengajarkan animasi & transisi kompleks** | **JANGAN.** Bukan sumber masalah utama. Cukup dikenali (`sintaks-tailwind.md`) |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Men-debug tampilan produksi pembelajar | Pakai skill ini | `/debugging-and-error-recovery` |
| Membangun aplikasi fullstack sungguhan | Pakai skill ini | `/idea-clarifier` → pipeline produksi (Bab 27) |
| Belajar CSS dari nol (belum pernah sama sekali) | Pakai skill ini | `/teach-react` Bagian 0 (materinya sama) |
| Belajar JavaScript (belum dikuasai) | Pakai skill ini | `/teach-javascript` dulu |
| Belajar React | Pakai skill ini | `/teach-react` |
| Belajar Bootstrap / SASS / CSS-in-JS | Pakai skill ini | Skill yang sesuai — skill ini khusus Tailwind CSS |
| Membuat tutorial/konten untuk orang lain | Pakai skill ini | Itu skill untuk pembuat konten, bukan pembelajar |
| Menjawab satu pertanyaan Tailwind lewat di tengah kerja | Buka asesmen lengkap | Jawab langsung dengan sitasi; sarankan `/teach-tailwindcss` kalau mau belajar serius |
| Minta "cara cepat belajar Tailwind dalam 3 hari" | Menyetujui | Tegur jujur: CSS dulu, lalu Tailwind. Tawarkan jalur ringkas **dengan konsekuensinya** |

## Next Step

Setelah workspace + `MISSION.md` + titik masuk siap:
→ `/teach-clarifier` untuk menetapkan target sesi pertama
→ lalu kembali ke skill ini, mulai **Unit 1: "masalah yang Tailwind selesaikan"**

## Materi Reference (WAJIB)

Sebelum menjawab pertanyaan materi atau menetapkan roadmap, baca sumbernya — folder materi
adalah sumber kebenaran, ingatan model bukan:

- **`references/roadmap-4-tingkat.md`** — bagian, 4 gerbang, bentuk sesi, aturan AI (WAJIB)
- **`references/peta-unit.md`** — detail per unit: konsep, kelas, miskonsepsi, sumber (WAJIB)
- **`references/korpus-ai.md`** — menyiapkan korpus kode AI + 4 latihan inspeksi (WAJIB)
- **`references/sintaks-tailwind.md`** — kamus kelas → CSS asli + tingkat bahaya (WAJIB saat
  pembelajar bertanya "kelas ini artinya apa?")
- **`references/cakupan-vs-dokumen-resmi.md`** — audit cakupan vs tailwindcss.com & MDN
- **Workspace pembelajar** `D:/Programming/belajar-tailwindcss/`:
  - `00-PANDUAN.md` — panduan lengkap yang sudah diadaptasi
  - `MISSION.md` — tujuan akhir (dari C5) + kriteria SELESAI
  - `RESOURCES.md` — daftar sumber + status verifikasi + batas kejujuran
  - `NOTES.md` — preferensi belajar + aturan cara belajar
  - `AUDIT-CAKUPAN.md` — celah yang pernah ditemukan & tambalannya
- **Skill terkait:** `/teach-javascript` (prasyarat Unit 12), `/teach-react` (Bagian 0 & latihan), `/teach-nodejs` (backend)
- **Sumber eksternal resmi:** tailwindcss.com/docs, MDN, W3C CSS, Vite Docs, WCAG — lihat
  `RESOURCES.md` §C

Kutip aturan verbatim + sebut nomor sumbernya. Jika ragu: baca dulu, baru bertindak.
Jangan mengarang dari ingatan.
