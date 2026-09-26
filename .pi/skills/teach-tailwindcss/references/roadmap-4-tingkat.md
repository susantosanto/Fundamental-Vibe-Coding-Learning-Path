# Roadmap 4 Bagian / 15 Unit — Tailwind CSS Mode Inspeksi

> **Untuk tutor.** File ini adalah detail yang tidak dimuat di `SKILL.md`.
> WAJIB dibaca sebelum menjawab "apa berikutnya untuk saya?"
>
> **Jangan pernah** menyuruh pembelajar membaca file ini (§MODE PENYAMPAIAN).
> Tutor membaca, lalu menjelaskan.
>
> **Dibuat:** 26 September 2026 · **Sumber kerangka:** `teach-react` (skill sejajar)
> · **Tujuan akhir:** tampilan aplikasi **fullstack JavaScript** yang bisa dinilai,
> bukan hanya terlihat "sudah jalan"

---

## Peta file referensi — jangan tumpang tindih

| File | Isinya | Kapan dipakai |
|---|---|---|
| **`roadmap-4-tingkat.md`** (ini) | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| **`peta-unit.md`** | **Detail per unit**: konsep, kelas yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| **`korpus-ai.md`** | Cara menyiapkan **korpus kode AI** + 4 jenis latihan inspeksi | Sebelum menyiapkan sesi latihan |
| **`sintaks-tailwind.md`** | **Kamus kelas → CSS asli** + tingkat bahaya + unit tempat dilatih | Saat pembelajar bertanya "kelas ini artinya apa?" |
| **`cakupan-vs-dokumen-resmi.md`** | **Audit cakupan** vs tailwindcss.com & MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

**Aturan anti-drift:** detail satu unit **hanya boleh** hidup di `peta-unit.md`.
Detail korpus **hanya boleh** hidup di `korpus-ai.md`. Kamus kelas **hanya** di
`sintaks-tailwind.md`. File ini tidak mengulanginya — ia hanya menunjuk.

---

## 0. Prinsip yang mengikat seluruh roadmap

1. **Bagian 0 (CSS + cara kerja) adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh
   dilompati. `p-4` **adalah** `padding: 1rem`; tanpa tahu apa itu padding, kelas Tailwind
   hanyalah teka-teki yang dihafal.
2. **Korpus wajib kode hasil generate AI.** Bukan kode contoh buatan tutor. Lihat §5.
3. **Satu unit = 1–2 sesi.** Satu sesi = satu konsep, maksimal 1 jam.
4. **Urutan tidak boleh dilompati.** Setiap bagian punya gerbang yang bisa diperiksa.
5. **Gerbang gagal = ulangi bagian itu**, bukan lanjut.
6. **Setiap sesi wajib punya momen salah prediksi.** Kalau tidak, materinya terlalu mudah.
7. **Semua tebakan ditulis di editor** (`prediksi.md`), bukan di kertas. Urutan PREDIKSI →
   JALANKAN diperiksa lewat timestamp.
8. **Kelas asing BUKAN "di luar materi".** Kode AI memakai `flex`, `items-center`, `gap-4`,
   `hover:bg-blue-600`, `md:grid-cols-2` sejak baris pertama. Kalau pembelajar bertanya
   *"kelas ini artinya apa?"* → cek `sintaks-tailwind.md`, **terjemahkan satu kelas**
   1–2 kalimat, lanjut. **Jangan** bilang "di luar materi", **jangan** menjelaskan lima
   kelas sekaligus.
9. **Prasyarat JavaScript diperiksa lebih dulu untuk Unit 12.** Unit 12 (kelas dinamis)
   murni soal **template literal**, bukan soal CSS. Tanpa itu, unit terpenting di skill
   ini tidak bisa dipahami.
10. **Tailwind TIDAK menggantikan pemahaman CSS.** Ia menggantikan **penulisan** CSS,
    bukan **pemahaman**-nya. Kalau pembelajar hanya hafal kelas, ia akan macet di Unit 13.
11. **Bagian 0 di sini sama dengan Bagian 0 `teach-react`.** Kalau pembelajar sudah lulus
    Gerbang 1 `teach-react`, Bagian 0 di sini **boleh dilewati** — jangan mengulang.

---

## 1. BAGIAN 0 — PRASYARAT: CSS + CARA KERJA (Unit 1–3)

**Yang dilatih:** tahu **dari mana** kelas Tailwind datang, dan **apa yang sebenarnya
terjadi** saat halaman dimuat.
**Korpus:** potongan **5–15 baris** HTML + CSS hasil AI.
**Prasyarat:** tidak ada. Ini titik masuk pemula absolut.
**Alat:** browser + DevTools (Inspector). Belum ada Tailwind, belum ada build tool.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 1 | **Masalah yang Tailwind selesaikan** | CSS tumbuh tanpa kendali. Nama kelas jadi tidak jelas (`card-2-final`). Spesifisitas bertabrakan. CSS "mati" yang tidak dipakai siapa pun. Tailwind menjawab dengan **kelas kecil yang langsung terbaca** | Dari satu file CSS 30 baris, tandai aturan mana yang **tidak dipakai** oleh HTML-nya | MDN: *CSS first steps*, *Specificity* |
| 2 | **Kotak, flex, grid** | Box model (content → padding → border → margin). `display: flex` + `justify-content`/`align-items`. `display: grid` + kolom. **Ini yang disingkat Tailwind** | Prediksi di mana tiap kotak berakhir **sebelum** dilihat di DevTools | MDN: *The box model*, *Flexbox*, *CSS Grid* |
| 3 | **Cara Tailwind bekerja** | Tailwind **memindai file** untuk mencari nama kelas, lalu **membuat** CSS yang berisi hanya kelas yang dipakai. Itu **langkah build**, bukan runtime. v4 memakai `@import "tailwindcss"` dan konfigurasi lewat CSS (`@theme`), bukan `tailwind.config.js` | Buka DevTools → sebut: kelas mana yang **benar-benar** menghasilkan aturan CSS, dan mana yang tidak | tailwindcss.com/docs/installation |

### → GERBANG 1 — Baca halaman ber-Tailwind, sebut dari mana bentuknya datang

Diberi satu halaman HTML + Tailwind hasil AI (± 40 baris) yang belum pernah dilihat.

**Tanpa membuka DevTools**, tuliskan:

1. **Terjemahan** 5 kelas menjadi CSS aslinya
2. Elemen mana yang menghasilkan **kotak** yang terlihat di mana
3. Satu kelas yang, kalau dihapus, **paling merusak** tampilan — dan kenapa

Lalu buka DevTools untuk memverifikasi. **Lulus kalau poin 1 dan 3 benar.**

> **Kenapa gerbang ini ada:** tanpa kemampuan menerjemahkan, Tailwind akan terasa seperti
> menghafal bahasa asing tanpa kamus. Semua "kok tampilannya aneh" bermuara ke CSS.

**Gagal?** Ulangi Unit 1–3 dengan halaman yang lebih pendek (15 baris, bukan 40).

---

## 2. BAGIAN 1 — UTILITY INTI (Unit 4–7)

**Yang dilatih:** menerjemahkan kelas ke CSS, dan **memprediksi** tampilannya.
**Korpus:** **satu elemen** dengan 8–15 kelas Tailwind hasil AI.
**Alat:** proyek Vite + Tailwind yang sudah disiapkan tutor (`npm run dev`), browser, DevTools.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 4 | **Tata letak** | `flex`, `grid`, `block`, `hidden`, `gap-*`, `items-*`, `justify-*`, `flex-1`, `grid-cols-*` | Terjemahkan 10 kelas tata letak → CSS. Prediksi susunan akhirnya | tailwindcss.com/docs/display, /flex, /grid |
| 5 | **Ruang & ukuran** | Skala `p-*`/`m-*` (1 unit = 0.25rem = 4px). `w-*`, `h-*`, `max-w-*`, `min-h-screen`, `space-y-*` | Prediksi **lebar total** sebuah kotak dari `w-64 p-4 border` | tailwindcss.com/docs/padding, /width |
| 6 | **Tipografi & warna** | `text-sm`…`text-4xl`, `font-bold`, `leading-*`, `tracking-*`, `text-center`. `text-{warna}-{shade}` vs `bg-{warna}-{shade}`. Shade 50–950 | Sebut **shade** mana yang lebih gelap, dan apakah kelasnya mengubah **teks** atau **latar** | tailwindcss.com/docs/font-size, /colors |
| 7 | **Batas, bayangan, transparansi** | `border`, `border-2`, `border-gray-200`, `rounded-*`, `shadow-*`, `ring-*`, `opacity-*` | Prediksi: mana yang lebih terlihat — `border` atau `ring`? Kenapa keduanya ada | tailwindcss.com/docs/border-width, /box-shadow |

### → GERBANG 2 — Terjemahkan kelas (ambang 50%)

Diberi **20 kelas Tailwind** yang belum pernah dilihat, tanpa konteks.

Tulis di `prediksi.md`: CSS asli untuk setiap kelas. Lalu verifikasi dengan DevTools atau
dokumentasi resmi.

**Lulus kalau ≥ 50% benar** (termasuk arah yang benar — mis. `text-` untuk teks, `bg-` untuk latar).

> **Dasar ambang:** *"novices require a 50% tracing code accuracy before they can
> independently write code with confidence"* — Lister et al. (2004), ACM SIGCSE Bulletin
> 36(4), 119–150. Ambang yang sama dipakai `teach-javascript`, `teach-react`, dan
> `teach-nodejs`, supaya konsisten. **Batas kejujuran:** studi 2004, konteks kurikulum
> universitas, dan konteksnya **melacak kode**, bukan menerjemahkan kelas CSS.
> Adaptasi ini **belum teruji**.

**Di bawah 50%?** Ulangi Unit 4–7 dengan 10 kelas, dan kerjakan bersama tutor (satu kelas
sekaligus) — bukan 20 kelas sendiri.

---

## 3. BAGIAN 2 — VARIAN, RESPONSIF, TEMA (Unit 8–11)

**Yang dilatih:** melihat komponen dan tahu **apa yang berubah, kapan, dan kenapa**.
**Korpus:** **satu komponen React** utuh ber-Tailwind hasil AI (20–50 baris).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 8 | **Varian keadaan** | `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:`, `peer-*`. Kenapa varian **menambah** spesifisitas, tidak menggantikan | Prediksi warna tombol pada 3 keadaan: biasa, disorot, dinonaktifkan | tailwindcss.com/docs/hover-focus-and-other-states |
| 9 | **Breakpoint (mobile-first)** | `sm:` `md:` `lg:` `xl:` `2xl:`. **Tanpa prefix = semua ukuran.** Prefix berarti "**dari** ukuran ini ke atas" — bukan "hanya di ukuran ini" | Ubah lebar jendela — kelas mana yang **aktif** di tiap lebar, dan kenapa | tailwindcss.com/docs/responsive-design |
| 10 | **Dark mode & tema** | `dark:` + cara mengaktifkannya. `@theme` untuk mendefinisikan token (warna, jarak). Kenapa warna default memakai `oklch()` | KLAIM: *"halaman ini berubah gelap saat mode gelap aktif"* → verifikasi | tailwindcss.com/docs/dark-mode, /theme |
| 11 | **Keluar dari utility** | `w-[37px]` (nilai bebas), `@apply` (kapan **boleh**, kapan **jangan**), `@layer`, dan **kapan berhenti** memakai utility sama sekali | KLAIM: *"`@apply` di sini membuat kode lebih mudah dirawat"* → verifikasi | tailwindcss.com/docs/adding-custom-styles |

> **Unit 11 penting secara sikap.** Banyak tutorial mengajarkan `@apply` sebagai "cara
> merapikan kelas yang panjang". Itu **mengembalikan** masalah yang Tailwind selesaikan.
> Yang diajarkan di sini: `@apply` untuk **kasus sempit** (mis. gaya bawaan komponen
> pihak ketiga), bukan sebagai kebiasaan.

### → GERBANG 3 — Perbaiki layout, jelaskan tiap kelas

Diberi **satu komponen React ber-Tailwind hasil AI** yang tampilannya **berantakan**
(mis. elemen tidak sejajar, jarak tidak konsisten, teks meluber).

1. Sebut **kelas mana** yang menyebabkan masalah — **tanpa** membuka DevTools dulu
2. **Perbaiki**, lalu buktikan dengan menjalankan
3. Jelaskan **tiap kelas** di perbaikanmu — apa CSS-nya

**Lulus kalau poin 1 dan 3 benar.** Poin 2 hanya membuktikan, bukan menentukan.

---

## 4. BAGIAN 3 — MEMBONGKAR & MENJAGA (Unit 12–15)

**Yang dilatih:** menemukan masalah pada tampilan, **menelusuri sebabnya**, dan
**memutuskan** apakah tampilan itu layak diterima.
**Korpus:** **satu halaman React** multi-komponen ber-Tailwind hasil AI (3–6 file).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 12 | **Kelas dinamis yang tidak ter-generate** ⭐⭐ | Tailwind **memindai teks** di file. `` `bg-${warna}-500` `` **tidak pernah ada** sebagai teks utuh — jadi CSS-nya **tidak pernah dibuat**. Tidak ada error. Warnanya hanya hilang. Ini **penyebab #1** "warna saya tidak muncul" | **TELUSUR:** tombol berwarna dari data, warnanya hilang untuk sebagian nilai, tanpa error | tailwindcss.com/docs/detecting-classes-in-source-files |
| 13 | **Kenapa kelas lain tidak "kena"** | Dua kelas bertabrakan (`p-2 p-4`) — yang menang bukan yang terakhir ditulis, tapi **urutan di dalam CSS Tailwind**. Kelas dengan varian lebih spesifik. Kelas yang tidak ada (`text-4xxl`, `bg-blue-550`) | **TELUSUR:** `mt-4` tidak berpengaruh karena `m-2` juga ada — cari sebabnya | tailwindcss.com/docs/styling-with-utility-classes |
| 14 | **Aksesibilitas** | `sr-only`, kontras warna (WCAG), **fokus yang terlihat** (jangan `outline-none` tanpa pengganti), `<div onClick>` vs `<button>`, `alt` pada gambar | KLAIM: *"halaman ini bisa dipakai dengan keyboard"* → verifikasi (Tab, Enter) | MDN: *Accessibility*; WCAG 2.2 |
| 15 | **Review, konsistensi & keputusan** | Bentuk review: klaim → bukti → risiko → keputusan. Kapan mengekstrak **komponen** (bukan `@apply`). Kenapa "jalan kok" bukan alasan | Putuskan: **terima atau tolak**. Tulis alasannya | Addy Osmani — *Agentic Code Review* |

> **Unit 12 dan Unit 13 adalah inti dari seluruh roadmap ini.**
> Keduanya adalah **alasan nomor satu** orang bilang *"Tailwind saya tidak jalan"* — dan
> **keduanya tidak menimbulkan error**. Tidak ada pesan merah. Hanya warna yang hilang,
> atau jarak yang tidak berubah.
>
> Unit 12 juga bersandar pada **satu konsep dari `teach-javascript`** (template literal).
> Itulah kenapa skill itu prasyaratnya untuk bagian ini, bukan pelengkap.

### → GERBANG 4 — Temukan, telusuri, perbaiki, putuskan

**Tiga bagian, semuanya harus lulus:**

**(a) Statis.** Diberi komponen ber-Tailwind dengan **satu cacat yang disuntik** (tutor
tahu di mana). Temukan **tanpa menjalankan**, lalu **perbaiki** dan jalankan untuk membuktikan.

**(b) Dinamis (TELUSUR).** Diberi halaman ber-Tailwind yang **sudah dijalankan** dengan
tampilan yang salah — **tanpa pesan error di console**, tanpa petunjuk lokasi.
Pakai protokol 5 langkah sampai menunjuk kelas penyebabnya.
`hasil.md` harus memuat **minimal dua dugaan tertulis** — salah satunya boleh salah.

**(c) Review.** Tulis review berisi: apakah klaimnya benar + bukti · satu cacat/risiko
(boleh cacat aksesibilitas) · **keputusan terima/tolak + alasan**.

**Lulus kalau keputusannya beralasan**, bukan kalau keputusannya "benar".

- Menolak tampilan yang sebenarnya baik **dengan alasan jelas** = **lulus**
- Menerima tampilan yang tidak bisa dipakai dengan keyboard **tanpa alasan** = **gagal**
- Menerima karena "sudah saya jalankan dan tampilannya bagus kok" = **gagal**

---

## 5. Aturan Korpus — kode hasil generate AI

| Bagian | Korpus | Ukuran |
|---|---|---|
| 0 | Potongan HTML + CSS hasil AI | 5–15 baris |
| 1 | Satu elemen dengan banyak kelas Tailwind hasil AI | 8–15 kelas |
| 2 | Satu komponen React utuh ber-Tailwind hasil AI | 20–50 baris |
| 3 | Satu halaman React multi-komponen hasil AI | 3–6 file |

**Yang perlu tutor ingat di sini (detail lengkap di `korpus-ai.md`):**

1. Tutor **tidak menulis kode sendiri** untuk latihan. Kalau perlu kode, minta AI
   menghasilkannya, lalu pakai hasilnya **apa adanya** — jangan dirapikan.
2. **Yang dicari adalah kode yang *terlihat* benar.** Kode yang jelas salah terlalu mudah.
3. Kode disalin ke `PRAKTIK/sesi-NNN/`. **Tidak pernah** dijalankan di repo produksi.
4. Sampai Bagian 2, korpus dibatasi pada tampilan **statis** — tanpa data dari server.

→ **Cara menyiapkan korpus, daftar cacat khas AI Tailwind, dan empat jenis latihan
inspeksi (LACAK · SUSUN · KLAIM · TELUSUR): baca `korpus-ai.md`.**

---

## 6. Bentuk Sesi (6 tahap, ≤ 1 jam) — versi editor + browser

```
1. PREDIKSI   (10')  Tutor serahkan PRAKTIK/sesi-NNN/App.jsx. Browser DITUTUP.
                     Pembelajar tulis tebakan + TERJEMAHAN kelas
                     → PRAKTIK/sesi-NNN/prediksi.md (SIMPAN).
                     ← Tutor baca prediksi.md SEBELUM melanjutkan.
2. JALANKAN   ( 5')  npm run dev → buka browser. Bandingkan. Di mana meleset?
3. BEDAH      (20')  (a) LACAK / (b) SUSUN / (c) KLAIM / (d) TELUSUR → tulis hasil.md
4. UBAH       (10')  Ubah SATU kelas. Prediksi lagi. Jalankan lagi.
5. PERBAIKI   (10')  Kalau ada bug: perbaiki → jalankan → "apakah ini bisa merusak yang lain?"
6. CATAT      ( 5')  LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi
```

**Verifikasi urutan (bisa diperiksa):**

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

Timestamp `prediksi.md` **harus lebih tua** daripada waktu kode dijalankan.
Kalau tidak → sesi diulang.

### Empat bentuk tahap BEDAH — ringkas

| Kode | Nama | Kapan dipakai | Unit |
|---|---|---|---|
| **(a)** | **LACAK** — terjemahkan tiap kelas → CSS asli | Menguji *notional machine* | 1–7, 10 |
| **(b)** | **SUSUN** — kelas diacak, susun ulang (*Parsons*) | Melatih struktur tanpa menghafal nama | 4–7, 11 |
| **(c)** | **KLAIM** — tentukan apakah klaim tampilan itu benar | Melatih deteksi "hampir benar" | 3, 8, 10, 11, 14, 15 |
| **(d)** | **TELUSUR** — tampilan salah, cari kelas penyebabnya | **Melatih memburu sebab (debug)** | **12, 13**, 15 · juga 5, 6, 7, 9, 10, 14 |

> ⚠️ **Parsons Problem: jangan pakai distractor di Bagian 0.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan baris pengecoh **menurunkan
> efisiensi belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.
>
> Cara menulis Parsons Problem yang benar (satu jawaban benar, pakai kode asli,
> sertakan deskripsi): **`korpus-ai.md` §4(b)**.

> ⚠️ **TELUSUR: dugaan WAJIB ditulis sebelum menyentuh kode.**
> Menghapus kelas satu per satu tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> **Satu alat per dugaan.** Di Tailwind, alatnya boleh DevTools Inspector — tapi tetap
> **satu per dugaan**. Protokol lengkap: **`korpus-ai.md` §4(d)**.

> ⚠️ **DevTools Inspector bukan pengganti dugaan.** Ia membuat menebak jadi lebih cepat,
> bukan lebih benar. Kalau pembelajar membuka Inspector tanpa menulis dugaan dulu,
> tegur — itu TELUSUR yang tidak dijalankan.

---

## 7. Aturan Memakai AI

Menurut RCT Anthropic (Januari 2026), **cara** memakai AI menentukan hasilnya:

| Cara memakai AI | Skor pemahaman |
|---|---|
| Tanya konsep, kerjakan sendiri | **di atas 65%** |
| Copy-paste kode yang dihasilkan | **di bawah 40%** |
| Rata-rata seluruh grup AI | 50% |
| Kerjakan sendiri tanpa AI | 67% |

Gap terbesar ada di soal **debugging**.

**Aturan yang diturunkan dari ini:**

| Aturan | Kenapa |
|---|---|
| **Tulis tebakan 2–3 kalimat dulu**, baru boleh bertanya ke AI. Pakai jawaban AI untuk **menguji teori**, bukan menggantinya | Pola ini skornya di atas 65% |
| **Minta penjelasan sebelum minta kode.** *"Jelaskan cara kerjanya, alternatifnya, dan trade-off-nya."* | Sama |
| **Kalau AI memberi komponen ber-Tailwind, pembelajar wajib bisa menerjemahkan tiap kelasnya.** Kalau tidak bisa → jangan pakai | MIT Media Lab: pengguna LLM kesulitan mengutip karyanya sendiri |
| **Perlakukan hasil AI seperti PR dari junior.** Baca, kritik, bantah | *"Would you merge it just because the tests passed?"* |
| **Sesekali, tulis ulang dari nol** tampilan yang AI tulis. Ukur berapa yang hilang | Mengukur *cognitive debt* |
| **Tutup sesi dengan satu pertanyaan:** hari ini saya belajar, atau cuma menutup tugas? | Mengirim dan belajar itu dua hal berbeda |

---

## 8. Kalau Berhenti di Tengah

Normal. Yang **tidak** boleh: mengulang dari Unit 1.

```
Berhenti di Unit 1–3    → ulangi latihan unit terakhir, lanjut
Berhenti di Unit 4–11   → langsung lanjut, tidak perlu mengulang
Berhenti di Unit 12–15  → selesaikan Unit 15 walau hasilnya jelek
```

**Potong lingkupnya, jangan gandakan jamnya.** Satu jam yang konsisten mengalahkan
empat jam setiap Sabtu. Sisipkan 1 hari kosong per minggu.

---

## 9. Batas Kejujuran

- **PRIMM** dirancang untuk sekolah (usia 11–14), bukan orang dewasa. Adaptasi ini masuk
  akal, **belum teruji** untuk kasus ini.
- **Ambang 50%** dari studi 2004 — konteks kurikulum universitas, dan konteksnya **melacak
  kode**, bukan menerjemahkan kelas CSS. Adaptasi ke Gerbang 2 skill ini **belum teruji**.
- **MIT Media Lab** meneliti **penulisan esai**, bukan coding. Indikasi arah, bukan bukti langsung.
- **RCT Anthropic:** sampel kecil (52), satu library, mayoritas junior.
- **Protokol 5 langkah TELUSUR bukan dari satu sumber tunggal.** Ia disusun dari praktik
  debug yang lazim (hipotesis → uji → persempit) dan diselaraskan dengan temuan RCT
  Anthropic bahwa debugging adalah titik terlemah. **Belum diuji sebagai metode.**
- **Pemilihan 15 unit untuk Tailwind belum diuji.** Ia disusun dari **sumber masalah yang
  paling sering dilaporkan** (kelas dinamis, konflik kelas, varian) — bukan dari studi
  urutan pembelajaran Tailwind.
- **Versi Tailwind yang dirujuk adalah v4.** Versi ini **disimpulkan dari fitur** yang
  terlihat di dokumentasi resmi (`@import "tailwindcss"`, `@theme`, `@tailwindcss/vite`,
  `oklch()`) — **bukan dari nomor versi yang tertulis di halaman yang dibuka.** Kalau
  pembelajar memakai Tailwind v3, sintaks konfigurasinya **berbeda** (lihat
  `cakupan-vs-dokumen-resmi.md` §5).
- **`tailwind.config.js` sengaja tidak diajarkan** sebagai hal wajib. Ia masih ada untuk
  proyek lama, tapi v4 mengarahkan konfigurasi ke CSS (`@theme`). Untuk proyek v3, unit 10
  perlu disesuaikan.
- **Bagian 0 (CSS) 3 unit mungkin terlalu sedikit.** Kalau di praktiknya pembelajar masih
  tersandung CSS, **tambahkan** — jangan paksakan lanjut ke Tailwind.
- **Tingkat bahaya sintaks (🔴🟡⚪ di `sintaks-tailwind.md`) adalah penilaian, bukan hasil riset.**
- **Daftar "sengaja dilewati" bisa salah.** Kalau di proyek nyata pembelajar menemui salah
  satu topik itu dan tersandung, itu tanda daftar perlu ditinjau — bukan tanda pembelajar kurang.
- **tailwindcss.com dan MDN berubah.** Audit cakupan memakai keduanya pada **26 Sep 2026**,
  dan **sidebar dokumentasi Tailwind tidak bisa dibaca** (dirender di sisi klien) — lihat
  `cakupan-vs-dokumen-resmi.md` §8.
- Artikel "cara belajar Tailwind 2026" di web **tidak dipakai** — aturan sumber repo ini
  melarang blog pribadi/SEO/konten AI.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `teach-react/references/roadmap-4-tingkat.md` (kerangka asal)
