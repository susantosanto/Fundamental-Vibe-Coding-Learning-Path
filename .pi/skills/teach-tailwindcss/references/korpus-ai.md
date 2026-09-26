# Korpus Kode Hasil AI — Tailwind CSS (Cara Menyiapkan & Empat Latihan Inspeksi)

> Referensi untuk skill `teach-tailwindcss`. **Tutor membaca file ini sendiri.**
> Pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 26 September 2026 · **Kerangka asal:** `teach-react/references/korpus-ai.md`
> · **Versi yang dirujuk:** Tailwind CSS v4

---

## 1. Kenapa korpusnya HARUS kode hasil generate AI

Karena **itu yang akan dihadapi pembelajar setelah lulus.** Bukan kode rapi dari tutorial,
bukan contoh yang ditulis tutor dengan hati-hati — tapi kode yang dihasilkan AI, yang
**terlihat benar** dan **sering hampir benar**.

Alasannya berlapis, dan semuanya dari sumber yang bisa diperiksa:

| Sumber | Temuan | Konsekuensi untuk korpus |
|---|---|---|
| **Stack Overflow Developer Survey 2025** | **66%** developer frustrasi utamanya *"solutions that are almost right, but not quite"*; **45%** bilang men-debug kode AI **lebih memakan waktu** | Korpusnya harus kode yang **hampir** benar — bukan yang jelas salah |
| **RCT Anthropic** (arXiv 2601.20245, Jan 2026) | Gap terbesar AI vs manual justru di **debugging** | Latihan TELUSUR wajib ada, dan porsinya besar |
| **MIT Media Lab** (arXiv 2506.08872) | Pengguna LLM kesulitan mengutip karyanya sendiri | Pembelajar wajib bisa **menerjemahkan** tiap kelas yang ia terima |

> **Batas kejujuran:** angka-angka di atas berasal dari survei & studi dengan populasi
> berbeda. Ia dipakai sebagai **indikasi arah**, bukan bukti sebab-akibat. RCT Anthropic
> sampelnya kecil (52), satu library, mayoritas junior.

**Yang paling penting untuk Tailwind:** cacat paling berbahaya di sini **tidak
menghasilkan error sama sekali.** Kelas dinamis yang tidak ter-generate, kelas yang
bertabrakan, `dark:` yang belum diaktifkan — semuanya **diam**. Hanya tampilan yang salah.

**Dan satu hal khusus Tailwind:** cacatnya sering **tidak terlihat oleh mata yang tidak
mencarinya.** Warna yang sedikit kurang kontras, `<div onClick>` yang tidak bisa
difokus — keduanya tampak "bagus" di layar.

---

## 2. Tangga korpus per bagian

| Bagian | Korpus | Ukuran | Contoh konkret |
|---|---|---|---|
| **0** | Potongan HTML + CSS hasil AI | **5–15 baris** | Satu kartu dengan CSS biasa (belum Tailwind) |
| **1** | Satu elemen dengan banyak kelas Tailwind hasil AI | **8–15 kelas** | Satu kartu: `flex flex-col gap-4 p-6 rounded-lg shadow-md` |
| **2** | Satu komponen React utuh ber-Tailwind hasil AI | **20–50 baris** | Tombol + kartu + daftar, dengan `hover:` dan `md:` |
| **3** | Satu halaman React multi-komponen hasil AI | **3–6 file** | Halaman daftar siswa dengan warna dinamis |

**Aturan tangga:** jangan naik sebelum korpus di tingkat itu **selesai dibedah**. Bagian 1
dengan 8 kelas lebih baik daripada Bagian 1 dengan 30 kelas.

---

## 3. Cara menyiapkan korpus + cacat khas kode Tailwind hasil AI

### Langkah 1 — Minta AI membuat sesuatu yang kecil dan biasa

Contoh permintaan (boleh dipakai apa adanya):

> *"Buat satu kartu siswa dengan Tailwind: nama, kelas, dan tombol 'Lihat'. Pakai
> rounded, shadow, dan hover pada tombolnya."*

> *"Buat komponen React yang menampilkan daftar tombol kategori. Warna tombol mengikuti
> data kategori (biru, merah, hijau)."*
> ← **permintaan ini hampir selalu menghasilkan cacat #1**

> *"Buat form login dengan Tailwind, lengkap dengan mode gelap dan tampilan responsif."*
> ← sering menghasilkan cacat #5 dan #4 sekaligus

**Jangan** meminta hal yang rumit. Satu kartu lebih baik daripada satu halaman.

### Langkah 2 — JANGAN dirapikan

Ini bagian yang paling sering dilanggar tutor. **Pakai kode AI apa adanya.** Jangan:
- mengganti `p-2 p-4` menjadi `p-4`,
- menambahkan `md:` yang kurang,
- memperbaiki `bg-${warna}-500` menjadi peta kelas,
- menambahkan `alt` pada gambar,
- memperbaiki `focus:outline-none` dengan `focus-visible:ring-2`,
- mengganti `<div onClick>` menjadi `<button>`.

**Kalau tutor merapikan kode, ia menghapus pelajarannya.**

### Cacat khas kode Tailwind hasil AI — daftar periksa

Tabel ini adalah **inti** dari file ini. Saat menyiapkan korpus, tutor memeriksa kode AI
terhadap daftar ini — **bukan untuk memperbaikinya**, tapi untuk **tahu apa yang ada di
dalamnya**, supaya bisa mengarahkan latihan.

| # | Cacat | Gejala | Unit |
|---|---|---|---|
| 1 | **Kelas dinamis** `` `bg-${warna}-500` `` | warna **hilang** untuk sebagian/semua nilai, tanpa error | **12** |
| 2 | **Kelas bertabrakan** `p-2 p-4`, `mt-4 m-2` | satu kelas "tidak berpengaruh"; yang menang bukan yang terakhir ditulis | **13** |
| 3 | **Kelas tidak ada** `text-4xxl`, `bg-blue-550`, `p-13` | tidak ada efek, tanpa error | **13** |
| 4 | **Urutan breakpoint terbalik** `w-1/3 sm:w-full` | di layar besar tampilannya seperti ponsel | **9** |
| 5 | **`dark:` tanpa mode gelap diaktifkan** | kelas gelap tidak berpengaruh | **10** |
| 6 | **`hover:` untuk hal penting di perangkat sentuh** | tidak bisa dipakai di ponsel | 8, 14 |
| 7 | **`text-` vs `bg-` tertukar** | "warna tidak muncul" (sebenarnya latarnya yang berubah) | 6 |
| 8 | **`focus:outline-none` tanpa pengganti** | navigasi keyboard jadi **tidak terlihat** | **14** |
| 9 | **`<div onClick>` bukan `<button>`** | tidak bisa difokus dengan Tab, tidak bisa Enter | **14** |
| 10 | **`<img>` tanpa `alt`** | pembaca layar tidak tahu isinya | 14 |
| 11 | **Kontras kurang** `text-gray-400` di atas putih | gagal ambang WCAG 4.5:1 | **14** |
| 12 | **`@apply` untuk "merapikan"** | nama kelas kabur kembali (masalah Unit 1) | **11** |
| 13 | **Nilai bebas diulang** `bg-[#1da1f2]` di 20 tempat | tidak bisa diubah serentak | 11 |
| 14 | **`!important`** `!p-4` | tanda konflik yang tidak diselesaikan | 11, 13 |
| 15 | **`space-y-*` dicampur `mt-*`** | jarak tidak konsisten | 5 |
| 16 | **`mx-auto` tanpa lebar** | tidak menengahkan apa pun | 5 |
| 17 | **`absolute` tanpa induk `relative`** | elemen "kabur" ke seluruh halaman | 4 |
| 18 | **`hidden` padahal butuh `sr-only`** | ikon tanpa teks tidak terbaca pembaca layar | 14 |
| 19 | **Judul pakai `<div>`** `<div className="text-2xl font-bold">` | bukan `<h2>` — struktur hilang untuk pembaca layar | 14 |
| 20 | **`w-64` dianggap 64px** | perkiraan ukuran salah (sebenarnya 256px) | 5 |
| 21 | **`border` dianggap tidak mengubah ukuran** | tata letak bergeser setelah menambah border | 7 |
| 22 | **`opacity-50` dipakai untuk memudarkan warna** | seluruh elemen ikut memudar, termasuk isinya | 7 |

**Cara memakai tabel ini:** pilih **satu** cacat per sesi. Satu. Kalau kode AI punya lima
cacat, ambil **satu** untuk sesi ini, sisanya untuk sesi lain. **Jangan** menumpuk.

> **Cacat #1 adalah yang paling penting.** Kalau tutor hanya punya waktu menyiapkan satu
> latihan TELUSUR untuk seluruh roadmap ini, pilih **cacat #1**.

### Langkah 3 — Potong sesuai bagian

Kode AI sering lebih panjang dari yang dibutuhkan. Potong — tapi **potong dari ujung**,
jangan dari tengah, supaya strukturnya tetap masuk akal.

- Bagian 0: ambil **5–15 baris** HTML + CSS
- Bagian 1: ambil **satu elemen** dengan 8–15 kelas
- Bagian 2: ambil **satu komponen** utuh
- Bagian 3: ambil **3–6 file**, sertakan `package.json` dan file CSS-nya

### Langkah 4 — Simpan di `PRAKTIK/`

```
PRAKTIK/
└── sesi-009/
    ├── prediksi.md       ← tebakan pembelajar (DITULIS LEBIH DULU)
    ├── App.jsx           ← kode AI, apa adanya
    ├── hasil.md          ← hasil BEDAH (LACAK/SUSUN/KLAIM/TELUSUR)
    └── catatan.md        ← (opsional) apa yang benar-benar terjadi di browser
```

**Jangan pernah** menjalankan korpus di repo produksi. Selalu di `PRAKTIK/`.

### ⛔ Aturan keamanan — tidak bisa ditawar

Kode AI kadang memuat URL, token, atau kunci yang seharusnya rahasia — terutama kalau
korpusnya diambil dari proyek nyata.

1. **Ganti semua nilai rahasia dengan nilai palsu** sebelum menyimpan.
2. **Jangan pernah** menjalankan korpus yang menghubungi layanan nyata.
3. **Jangan pernah** menempelkan `.env` asli pembelajar ke AI — untuk alasan apa pun.

---

## 4. Empat jenis latihan inspeksi (tahap BEDAH)

### (a) LACAK — menerjemahkan kelas, dan memprediksi tampilannya

**Yang diuji:** *notional machine* — apakah pembelajar benar-benar tahu apa yang
dilakukan tiap kelas, atau hanya mengenali polanya.

**Bentuk:** diberi kode, pembelajar menulis **CSS asli** untuk setiap kelas, lalu
**menggambarkan** tampilannya.

```
## LACAK — sesi-009
Kelas pada <div>:
  flex        → display: flex
  flex-col    → flex-direction: column
  gap-4       → gap: 1rem (16px)
  p-6         → padding: 1.5rem (24px)
  rounded-lg  → border-radius: 0.5rem (8px)
  shadow-md   → box-shadow: ...

Gambaran saya: kotak dengan isi bertumpuk ke bawah, jarak antar isi 16px,
ruang dalam 24px, sudut membulat, ada bayangan sedang.
```

**Tambahan wajib untuk Tailwind:** LACAK harus menyertakan **angka**-nya (px/rem).
Kalau pembelajar hanya bisa menulis `padding: 1.5rem` tanpa tahu itu 24px, ia belum
punya model mental yang bisa dipakai untuk memprediksi tata letak.

**Contoh soal yang bagus (Bagian 1):**

```html
<div class="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow-md">
  <div>
    <h2 class="text-lg font-semibold text-gray-900">Budi</h2>
    <p class="text-sm text-gray-500">Kelas 6A</p>
  </div>
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Lihat
  </button>
</div>
```

Pertanyaan: **berapa** ruang dalam kartu ini, dan **di mana** tombolnya berada?
**Jawaban:** `p-6` = 24px ruang dalam; `justify-between` mendorong tombol ke **kanan**;
`items-center` menyejajarkan secara **vertikal**. `gap-4` tidak berpengaruh di sini karena
kedua anak dipisahkan `justify-between`.

> **Perhatikan:** jawaban terakhir itu penting — `gap-4` **ada** tapi **tidak terlihat
> efeknya**. Itu contoh bagus bahwa "kelas ada" ≠ "kelas berpengaruh".

---

### (b) SUSUN — Parsons Problem

**Yang diuji:** struktur & logika, tanpa beban menghafal nama kelas.

**Bentuk:** kelas diacak; pembelajar menyusun ulang untuk mencapai **target tampilan**.

**Cara menulis Parsons Problem yang benar:**

1. **Satu jawaban benar.** Kalau ada beberapa susunan yang sama-sama benar, sebutkan
   aturannya ("pakai `justify-between`, bukan `ml-auto`").
2. **Pakai kelas asli** dari korpus AI.
3. **Sertakan deskripsi target** — di Tailwind, **gambar** atau deskripsi tampilan wajib:

```
## SUSUN — sesi-011
Target: kartu dengan judul di kiri-atas, deskripsi di bawahnya, dan tombol
        di kanan yang sejajar tengah dengan judul.

Kelas tersedia (acak):
  gap-4          justify-between      rounded-lg
  flex           items-center        p-6
  bg-white       shadow-md           flex-col
```

> ⚠️ **Jangan pakai kelas pengecoh (*distractor*) di Bagian 0.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan pengecoh **menurunkan efisiensi
> belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.
>
> **Catatan khusus Tailwind:** kelas seperti `p-2` vs `p-4` **bukan** pengecoh yang baik —
> keduanya sah, dan perbedaannya soal selera. Pengecoh yang baik adalah kelas yang
> **bertabrakan** (`flex` + `block`) atau **tidak ada** (`p-13`).

> **Parsons Problem adalah bentuk asli dari riset:** Denny, Luxton-Reilly & Simon
> (2008, ICER '08). Ia dipakai di sini **karena bukti**, bukan karena kebiasaan.

---

### (c) KLAIM — menentukan apakah kode melakukan apa yang dikatakannya

**Yang diuji:** deteksi "hampir benar" — kemampuan yang paling dibutuhkan di era AI.

**Bentuk:** tutor memberi **kode + satu kalimat klaim tentang tampilannya**. Pembelajar
menentukan apakah klaim itu **benar**.

```
## KLAIM — sesi-012

Kode: (komponen React 25 baris)

Klaim: "Tombol kategori akan berwarna sesuai data, dan berubah lebih gelap saat disorot."

## Verdict: BENAR / TIDAK / SEBAGIAN
## Bukti
  (tunjuk kelas/baris yang mendukung atau membantah)
## Kalau tidak benar — apa yang sebenarnya terjadi?
  (jelaskan tampilan nyatanya, bukan hanya "salah")
```

**Contoh klaim yang bagus untuk Tailwind** (semuanya **hampir** benar):

| Klaim | Kenyataan | Unit |
|---|---|---|
| *"Warna tombol mengikuti data kategori"* | kelas dinamis → tidak ter-generate | **12** |
| *"Jarak atas kartu ini 16px"* | ada `m-2` yang menang | **13** |
| *"Di layar besar kartu tersusun 3 kolom"* | `grid-cols-3` hanya ada di `md:` | 9 |
| *"Halaman ini berubah gelap saat mode gelap aktif"* | mode gelap belum diaktifkan | 10 |
| *"Tombol ini berwarna biru"* | `bg-blue-500` — latarnya biru, teksnya tidak | 6 |
| *"Halaman ini bisa dipakai dengan keyboard"* | `<div onClick>` | **14** |
| *"Teks abu-abu ini mudah dibaca"* | kontras < 4.5:1 | 14 |
| *"`@apply` di sini membuat kode lebih mudah dirawat"* | ia menyembunyikan, bukan menyusun | 11 |

> **Ini latihan inti seluruh skill.** Bukan mencari bug — **menentukan apakah kode
> melakukan apa yang dikatakannya.** Kode yang lolos latihan ini = kode yang benar-benar
> diperiksa. Kode yang lolos begitu saja = **utang pemahaman**.

---

### (d) TELUSUR — memburu sebab saat tampilannya salah ⭐

**Yang diuji:** **debugging.** Menurut RCT Anthropic (2026), inilah **gap terbesar**
antara orang yang memakai AI dan yang tidak. Karena itu latihan ini **wajib** — dan
protokolnya ketat.

#### Aturan keras

> **Dugaan ditulis SEBELUM menyentuh kode.**
> Menghapus kelas satu per satu tanpa dugaan **tidak** melatih memburu — hanya melatih
> menebak. **Satu alat per dugaan.**

#### Protokol 5 langkah

```
1. KATAKAN   — apa yang diharapkan, dan apa yang sebenarnya terlihat?
               (tulis di hasil.md, jangan di kepala)
2. DUGA      — satu dugaan: "saya kira masalahnya di kelas ___, karena ___"
               ← WAJIB ditulis sebelum mengubah/menghapus apa pun
3. UJI       — satu alat saja untuk menguji dugaan itu.
               (buka Inspector, lihat SATU elemen — bukan menyisir semuanya)
4. SEMPITKAN — dugaan gugur? tulis kenapa, lalu buat dugaan baru. Ulangi.
5. BUKTIKAN  — setelah menemukan, tunjuk kelasnya, dan jelaskan kenapa kelas itu
               menghasilkan gejala itu.
```

#### Format `hasil.md` untuk TELUSUR

```
## Yang diharapkan vs yang terjadi
  Harapan: tombol "Olahraga" berwarna hijau
  Kenyataan: tombol itu tidak berwarna sama sekali; tombol lain berwarna
  Console: TIDAK ada error

## Dugaan 1 — kelas pada <button>
  "Saya kira shade-nya salah (bg-green-550 tidak ada)."
  Alat: buka Inspector, lihat kelas pada tombol itu
  Hasil: kelasnya `bg-green-500` — kelas itu ADA dan sah.
         Tapi di panel Styles, tidak ada aturan untuknya. Dugaan GUGUR.

## Dugaan 2 — cara kelas dibentuk
  "Kalau kelasnya benar tapi CSS-nya tidak ada, mungkin ia tidak pernah
   tertulis utuh di file."
  Alat: cari `bg-green-500` sebagai teks di seluruh folder
  Hasil: tidak ditemukan. Yang ada `bg-${warna}-500`. DUGAAN TERKONFIRMASI.

## Kelas penyebab: baris 7 — `className={`bg-${warna}-500`}`
  Tailwind memindai TEKS. `${warna}` membuat nama kelas tidak pernah ada
  sebagai teks utuh → CSS-nya tidak pernah dibuat → tidak ada error.
```

> **Perhatikan:** `hasil.md` memuat **dugaan yang gugur**. Itu bukan kegagalan — itu
> **bukti** bahwa pembelajar benar-benar memburu, bukan menebak lalu kebetulan benar.

#### Korpus untuk TELUSUR

Wajib memenuhi **tiga** syarat:

1. **Sudah dijalankan** — tutor sudah memastikan tampilannya salah.
2. **Tidak ada pesan error** — baik di console browser maupun di terminal.
3. **Tidak ada petunjuk lokasi** — tidak ada komentar "bug di sini", tidak ada penanda.

#### Prioritas TELUSUR per unit

| Prioritas | Unit | Gejala yang dicari |
|---|---|---|
| ⭐ tertinggi | **12** | Warna hilang untuk sebagian/semua nilai, tanpa error |
| ⭐ tinggi | **13** | Satu kelas "tidak berpengaruh" (konflik) |
| ⭐ tinggi | **14** | Tidak bisa difokus dengan keyboard |
| Tinggi | 9 | Di layar besar tampilannya seperti ponsel |
| Tinggi | 10 | `dark:` tidak berpengaruh |
| Sedang | 5, 6, 7 | Jarak/warna/border tidak seperti dugaan |
| Sedang | 11 | `@apply` tidak berfungsi |
| Sedang | 15 | Komponen yang sama tampil berbeda di dua tempat |

> **Petunjuk untuk tutor:** saat pembelajar macet, **jangan** menyebut lokasinya.
> Beri **satu** pertanyaan yang mempersempit ("kelas itu seharusnya menghasilkan apa?").
> Membiarkan pembelajar menemukannya sendiri adalah **seluruh gunanya** latihan ini.

---

## 5. Checklist korpus yang baik

Sebelum menyerahkan korpus ke pembelajar, tutor memeriksa:

- [ ] Kode **dari AI**, bukan ditulis tutor
- [ ] **Tidak dirapikan** — cacatnya masih ada
- [ ] Ukurannya sesuai bagian (5–15 baris / 8–15 kelas / 20–50 baris / 3–6 file)
- [ ] **Satu** cacat utama untuk sesi ini (bukan lima)
- [ ] Tidak memuat rahasia atau URL layanan nyata
- [ ] Untuk TELUSUR: sudah dijalankan, tampilannya salah, **tidak ada error**
- [ ] Untuk TELUSUR: **tidak ada** petunjuk lokasi cacat
- [ ] Disimpan di `PRAKTIK/sesi-NNN/`
- [ ] `prediksi.md` **belum** dibuat (pembelajar yang menulis, lebih dulu)

---

## 6. Yang sering salah dilakukan tutor

| Kesalahan | Kenapa itu masalah | Lakukan sebaliknya |
|---|---|---|
| Merapikan kode AI sebelum diberikan | Menghapus pelajarannya | Pakai apa adanya |
| Menulis kode contoh sendiri karena "lebih rapi" | Kode tutor tidak punya cacat khas AI | Minta AI, pakai hasilnya |
| Memberi 5 cacat sekaligus | Pembelajar tenggelam; tidak ada yang diingat | Satu cacat per sesi |
| Menunjuk lokasi cacat saat pembelajar macet | Mengubah TELUSUR jadi latihan membaca | Beri satu pertanyaan yang mempersempit |
| Membiarkan pembelajar menghapus kelas acak tanpa dugaan | Itu menebak, bukan memburu | Dugaan dulu, lalu satu alat |
| Memberi korpus yang jelas salah | Terlalu mudah; tidak melatih deteksi "hampir benar" | Pilih kode yang **tampak** benar |
| Memilih cacat **visual yang kentara** (mis. warna sangat salah) | Mata langsung menemukannya; tidak melatih dugaan | Pilih cacat yang **hanya** terlihat di Inspector atau saat diuji keyboard |
| Menaikkan ukuran kode karena pembelajar "cepat" | Kecepatan ≠ pemahaman; ukuran besar menyembunyikan cacat | Naikkan **kesulitan cacat**, bukan ukuran |
| Memakai `p-2` vs `p-4` sebagai pengecoh Parsons | Keduanya sah — itu soal selera, bukan salah/benar | Pakai kelas yang **bertabrakan** atau **tidak ada** |
| Menganggap "tampilannya bagus" = "tidak ada masalah" | Cacat aksesibilitas tidak terlihat | Periksa Tab + Enter, dan kontras |

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `teach-react/references/korpus-ai.md`
