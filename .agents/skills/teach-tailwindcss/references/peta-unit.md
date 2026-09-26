# Peta Unit — Detail per Unit (Tailwind CSS Mode Inspeksi)

> Referensi untuk skill `teach-tailwindcss`. **Tutor membaca file ini sendiri** —
> pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **15 unit · 4 bagian · 4 gerbang.** Bagian 0 = **prasyarat** CSS + cara kerja.
> Setiap unit: **konsep · kelas yang dikenali · yang diajarkan · latihan inspeksi ·
> kriteria lulus · sumber.**
> Satu unit = 1–2 sesi × maks 1 jam.
>
> **Kamus kelas lengkap ada di `sintaks-tailwind.md`.** Baris *"Kelas yang dikenali"* di
> tiap unit hanya menyebut yang paling sering muncul.
>
> **Versi yang dirujuk: Tailwind CSS v4** (CSS-first). Lihat `cakupan-vs-dokumen-resmi.md` §5.

---

## Aturan umum semua unit

| | |
|---|---|
| Bentuk sesi | 6 tahap: PREDIKSI → JALANKAN → BEDAH → UBAH → [PERBAIKI] → CATAT |
| Alat | Editor + browser · Bagian 0: DevTools Inspector · Bagian 1–3: `npm run dev` + Inspector |
| Korpus | **Kode hasil generate AI** (lihat `korpus-ai.md`) |
| Ukuran kode | Bagian 0: 5–15 baris. Bagian 1: 8–15 kelas. Bagian 2: 20–50 baris. Bagian 3: 3–6 file. |
| Aturan mutlak | `prediksi.md` ditulis & disimpan **sebelum** kode dijalankan |
| Sumber sitasi | `tailwindcss.com/docs/<halaman>` · `MDN: <topik>` · `W3C CSS` · `WCAG` · `PRIMM §<tahap>` |
| **Kelas asing** | **JANGAN bilang "di luar materi"** → cek `sintaks-tailwind.md`, terjemahkan **satu kelas**, lanjut |
| **Satuan** | Tailwind memakai **rem** dan **skala 0.25rem**. Sebutkan angkanya (mis. `p-4` = `1rem` = `16px`) |

**Cara memulai proyek (dilakukan tutor sekali, sebelum Bagian 1):**

```
npm create vite@latest proyek-vite -- --template react
cd proyek-vite
npm install tailwindcss @tailwindcss/vite
# tambahkan plugin ke vite.config.js, lalu `@import "tailwindcss";` di src/index.css
npm run dev
```

Sebutkan ke pembelajar **apa yang baru saja terjadi** (Tailwind memindai file untuk
mencari nama kelas, lalu membuat CSS yang berisi hanya kelas yang dipakai) — tapi
**jangan jadikan sesi sendiri**. Itu produksi, bukan inspeksi.

---

# BAGIAN 0 — PRASYARAT: CSS + CARA KERJA (Unit 1–3)

> **Ini bukan pemanasan.** Tailwind **adalah** CSS dengan nama pendek. `p-4` tidak
> berarti apa-apa kalau kamu tidak tahu apa itu padding.
> **Belum ada Tailwind, belum ada build tool** — hanya file `.html` dan `.css` yang
> dibuka di browser. Itu disengaja: satu hal pada satu waktu.
>
> ⚠️ **Bagian ini materinya sama dengan Bagian 0 `teach-react`.** Kalau pembelajar sudah
> lulus Gerbang 1 di sana, **lewati** — jangan mengulang.

---

## Unit 1 — Masalah yang Tailwind selesaikan

**Konsep:** CSS yang tumbuh menjadi **sulit dirawat**. Nama kelas kehilangan arti, aturan
bertabrakan, dan sebagian CSS tidak dipakai siapa pun tapi tidak berani dihapus. Tailwind
menjawab bukan dengan "CSS yang lebih pintar", tapi dengan **kelas kecil yang langsung
terbaca** dan **satu sumber kebenaran** untuk jarak, warna, dan ukuran.

**Yang diajarkan tutor:**
- Tiga masalah nyata: nama kelas kabur (`card-2-final`), **spesifisitas** bertabrakan,
  dan **CSS mati** (aturan yang tidak dipakai HTML mana pun)
- Kenapa "memberi nama yang bagus" itu sulit — dan kenapa itu bukan salah penulisnya
- Gagasan *utility-first*: kelas kecil, satu tugas, dikomposisi di HTML
- Harga yang dibayar: HTML jadi panjang. **Itu pertukaran, bukan cacat** — dan itu
  dibahas lagi di Unit 11 dan Unit 15
- Kenapa AI sangat cocok menghasilkan kelas Tailwind (tidak perlu mengarang nama)

**Kelas yang dikenali:** belum ada kelas Tailwind di unit ini. Yang dilatih membaca
**CSS biasa**: `p { }` · `.kartu { }` · `#utama { }` · `!important` (⚠️ tanda masalah)

**Latihan inspeksi:**
1. Beri satu file CSS 30 baris + HTML-nya. **LACAK:** tandai aturan CSS yang **tidak
   dipakai** HTML itu.
2. **KLAIM:** *"semua kartu akan berlatar abu-abu"* → verifikasi (apakah selektornya
   `.kartu`, atau `#kartu` yang hanya satu elemen?).
3. **TELUSUR:** gaya tidak kena padahal aturannya ada — cari sebabnya (spesifisitas?
   nama kelas beda huruf besar/kecil?).

**Kriteria lulus:** dari satu file CSS, bisa menunjuk **satu aturan yang tidak dipakai**
dan **satu aturan yang kalah** karena spesifisitas.

**Miskonsepsi yang paling sering muncul:**
- Mengira masalah CSS itu "kurang rapi" (masalahnya **spesifisitas & ketergantungan**)
- Mengira `!important` adalah solusi (itu tanda masalah sudah menumpuk)
- Mengira Tailwind "menggantikan CSS" (ia menggantikan **penulisan**, bukan **pemahaman**)

**Sumber:** MDN: *CSS first steps*, *Specificity*, *Cascade*

---

## Unit 2 — Kotak, flex, grid

**Konsep:** **Ini yang disingkat Tailwind.** Setiap kelas Tailwind punya padanan CSS
yang persis. Kalau CSS-nya tidak dipahami, kelasnya jadi hafalan.

**Yang diajarkan tutor:**
- **Box model:** content → padding → border → margin. Kenapa `w-64 p-4 border` tidak
  menghasilkan lebar `64`
- `display: block` vs `inline` vs `inline-block` vs `flex` vs `grid`
- **Flexbox:** arah (`flex-row`/`flex-col`), `justify-content` (sumbu utama),
  `align-items` (sumbu silang), `gap`
- **Grid:** `grid-cols-3`, `grid-rows-2`, `gap-4`
- Satuan: `rem` (relatif terhadap ukuran font akar), `%`, `vw`/`vh`, `px`
- Kenapa "elemen menumpuk ke bawah" itu **perilaku normal** `div` (block), bukan bug

**Kelas yang dikenali:** `flex` · `flex-col` · `items-center` · `justify-between` ·
`gap-4` · `grid` · `grid-cols-3` · `block` · `inline-block` · `w-64` · `h-screen` ·
`max-w-md`

**Latihan inspeksi:**
1. **LACAK:** beri 6 kelas, tulis CSS aslinya satu per satu.
2. **SUSUN:** kelas diacak → susun ulang supaya menghasilkan susunan target.
3. **TELUSUR:** tiga kotak seharusnya sejajar, tapi menumpuk — cari penyebabnya
   (`flex` hilang? salah arah? `block` menang?).

**Kriteria lulus:** dari satu potongan HTML+CSS 12 baris, bisa menggambar **di mana tiap
kotak berakhir** — sebelum dibuka di DevTools.

**Miskonsepsi yang paling sering muncul:**
- Mengira `justify-content` mengatur **vertikal** (ia mengatur **sumbu utama**, yang
  berubah saat `flex-col`)
- Mengira `gap` sama dengan `margin` (keduanya menambah ruang, tapi `gap` hanya di antara
  anak, bukan di tepi)
- Mengira `w-64` berarti 64 piksel (itu **16rem** = 256px pada font akar 16px)
- Mengira elemen yang menumpuk itu "rusak" (itu perilaku bawaan `div`)

**Sumber:** MDN: *The box model*, *Flexbox*, *CSS Grid*, *CSS values and units*

---

## Unit 3 — Cara Tailwind bekerja

**Konsep:** Tailwind **tidak** mengirim semua kelasnya ke browser. Ia **memindai file
kamu** untuk mencari nama kelas yang **dipakai**, lalu **membuat** CSS yang berisi hanya
kelas itu. Itu sebabnya ada **langkah build** — dan itu sebabnya kelas yang **tidak
pernah tertulis utuh** tidak akan pernah dibuat (Unit 12).

**Yang diajarkan tutor:**
- Dua fase: **pindai** (cari teks nama kelas) → **buat** (tulis CSS-nya)
- v4: `@import "tailwindcss";` di file CSS — **bukan** `@tailwind base/components/utilities` (itu v3)
- v4: pemindaian file **otomatis** — tidak perlu mendaftar `content` seperti v3
- v4: konfigurasi tema lewat **CSS** (`@theme`), bukan `tailwind.config.js`
- **Konsekuensi yang wajib dipahami:** kalau sebuah nama kelas tidak muncul **sebagai teks
  utuh** di file sumber, CSS-nya **tidak dibuat**. Tidak ada error. Hanya gaya yang hilang.
- Perbedaan ini dengan CSS biasa: di CSS biasa, kamu menulis aturannya lalu memakainya.
  Di Tailwind, kamu **memakainya** dulu, baru aturannya dibuat.

**Kelas yang dikenali:** `@import "tailwindcss";` · `@theme { }` · `@source` ·
`@apply` · `@layer`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"semua kelas di file ini akan dibuat CSS-nya"* → verifikasi.
2. **LACAK:** beri 6 kelas, tandai mana yang **pasti dibuat** dan mana yang **mungkin tidak**.
3. **TELUSUR:** satu kelas terlihat di HTML tapi tidak ada efeknya — cari sebabnya
   (salah tulis? kelas tidak ada? tidak terpindai?).

**Kriteria lulus:** bisa menjelaskan **kenapa Tailwind butuh langkah build**, dan **apa
yang terjadi** kalau sebuah kelas tidak tertulis utuh di file sumber.

**Miskonsepsi yang paling sering muncul:**
- Mengira Tailwind mengirim **semua** kelasnya (itu sebabnya ukurannya kecil — ia hanya
  mengirim yang dipakai)
- Mengira `@tailwind base/components/utilities` masih dipakai di v4 (tidak — itu v3)
- Mengira `tailwind.config.js` wajib (v4 mengarahkan ke `@theme` di CSS)
- Mengira kelas yang tidak dibuat akan **error** (tidak — ia **diam**)

**Sumber:** tailwindcss.com/docs/installation · /theme · /detecting-classes-in-source-files

---

### → GERBANG 1 setelah Unit 3

**Baca halaman ber-Tailwind, sebut dari mana bentuknya datang.** Detail:
`roadmap-4-tingkat.md` §1.

---

# BAGIAN 1 — UTILITY INTI (Unit 4–7)

> **Yang dilatih:** menerjemahkan kelas ke CSS, dan **memprediksi** tampilannya.
> Urutannya disengaja: **tata letak dulu**, baru ruang, lalu tipografi & warna, terakhir
> batas. Kalau tata letak belum jelas, semua yang lain tidak bisa diprediksi.

---

## Unit 4 — Tata letak

**Konsep:** Kelas tata letak menentukan **di mana** elemen berada. Mereka hampir selalu
muncul **berpasangan**: satu kelas membuat wadah (`flex`), kelas lain mengatur isinya
(`items-center`). Membaca kelas tata letak berarti membaca **pasangan** itu.

**Yang diajarkan tutor:**
- `block`, `inline-block`, `hidden` (`display: none`)
- `flex` + `items-*` (sumbu silang) + `justify-*` (sumbu utama) + `gap-*`
- `flex-1` (mengisi sisa ruang), `flex-wrap`, `flex-col`
- `grid` + `grid-cols-N` + `col-span-N` + `gap-*`
- `absolute`/`relative`/`fixed`/`sticky` + `top-*`/`right-*` — dan kenapa `absolute`
  tanpa induk `relative` "kabur" ke seluruh halaman
- Kenapa urutan kelas di HTML **tidak menentukan** hasil akhir (Unit 13 melanjutkan ini)

**Kelas yang dikenali:** `flex` · `inline-flex` · `grid` · `hidden` · `block` ·
`flex-col` · `flex-1` · `flex-wrap` · `items-center` · `items-start` · `justify-between` ·
`justify-center` · `gap-2`/`gap-4`/`gap-6` · `grid-cols-2`/`grid-cols-3` · `col-span-2` ·
`relative` · `absolute` · `sticky` · `inset-0`

**Latihan inspeksi:**
1. **LACAK (wajib):** beri 10 kelas tata letak, tulis CSS aslinya, lalu gambarkan susunannya.
2. **SUSUN:** kelas diacak → susun ulang untuk mencapai susunan target.
3. **TELUSUR:** `items-center` tidak berpengaruh — cari sebabnya (induknya bukan `flex`?).

**Kriteria lulus:** dari 10 kelas tata letak, bisa menggambar susunannya **dengan benar**
tanpa membuka browser.

**Miskonsepsi yang paling sering muncul:**
- Mengira `items-*` mengatur horizontal (ia mengatur **sumbu silang** — berubah saat `flex-col`)
- Mengira `flex-1` = "lebar 100%"
- Mengira `absolute` bekerja sendiri (butuh induk ber-`relative`)
- Mengira `hidden` sama dengan `invisible` (`hidden` = `display:none`, elemen **hilang**
  dari susunan; `invisible` = tetap memakan ruang)
- Mengira urutan penulisan kelas menentukan pemenang

**Sumber:** tailwindcss.com/docs/display · /flex · /grid · /position

---

## Unit 5 — Ruang & ukuran

**Konsep:** Tailwind punya **satu skala** untuk semua jarak. Angkanya bukan piksel —
ia **kelipatan 0.25rem**. Karena itu `p-4` = 1rem = 16px, dan `p-1` = 4px. Memahami
skalanya berarti bisa menebak jarak **tanpa membuka browser**.

**Yang diajarkan tutor:**
- Skala: `1` = 0.25rem · `2` = 0.5rem · `4` = 1rem · `6` = 1.5rem · `8` = 2rem · `16` = 4rem
- `p-*` (semua sisi) · `px-*`/`py-*` (sumbu) · `pt-*`/`pr-*`/`pb-*`/`pl-*` (satu sisi)
- `m-*` sama polanya, tapi **margin negatif** juga ada: `-mt-4`
- **`space-y-*`** vs `gap-*` — yang pertama menambah margin antar anak, yang kedua jarak
  di flex/grid
- `w-*`, `h-*`, `size-*` (lebar+tinggi sekaligus), `max-w-*`, `min-h-screen`
- Satuan khusus: `w-full`, `w-screen`, `w-1/2`, `w-fit`, `w-auto`
- **Kenapa `max-w-*` lebih sering benar daripada `w-*`** untuk wadah konten

**Kelas yang dikenali:** `p-4` · `px-6` · `py-2` · `mt-4` · `-mt-2` · `space-y-3` ·
`gap-4` · `w-64` · `h-10` · `size-5` · `w-full` · `max-w-4xl` · `min-h-screen` ·
`mx-auto` (tengah horizontal)

**Latihan inspeksi:**
1. **LACAK (wajib):** prediksi **lebar total** sebuah kotak dari `w-64 p-4 border`.
   (Jawabannya tergantung `box-sizing` — sebut itu.)
2. **KLAIM:** *"`mx-auto` akan menengahkan kotak ini"* → verifikasi (apakah ada `max-w-*`
   atau `w-*`? tanpa lebar, `mx-auto` tidak ada efeknya).
3. **TELUSUR:** jarak antar kartu tidak konsisten — cari penyebabnya (`space-y-*` dicampur
   `mt-*` di anak).

**Kriteria lulus:** dari 10 kelas jarak/ukuran, bisa menyebut **angka px-nya** dengan
benar (asumsi font akar 16px).

**Miskonsepsi yang paling sering muncul:**
- Mengira `p-4` = 4px (itu **16px**)
- Mengira `p-*` dan `m-*` sama (padding **di dalam**, margin **di luar** — dan margin bisa
  bertabrakan/kolaps)
- Mengira `space-y-4` sama dengan `gap-4` (yang pertama menambah margin; yang kedua
  tidak kolaps dan hanya berlaku di flex/grid)
- Mengira `w-1/2` = `w-50` (yang pertama **pecahan**, yang kedua kelipatan skala)

**Sumber:** tailwindcss.com/docs/padding · /margin · /width · /height

---

## Unit 6 — Tipografi & warna

**Konsep:** Dua kesalahan paling sering: **(a)** menukar kelas **teks** dengan kelas
**latar** (`text-blue-500` ≠ `bg-blue-500`), dan **(b)** memakai **shade** yang tidak ada
atau salah gelap. Shade berjalan dari `50` (paling terang) sampai `950` (paling gelap).

**Yang diajarkan tutor:**
- Ukuran: `text-xs`…`text-9xl` — dan bahwa setiap ukuran membawa **line-height** bawaan
- Berat: `font-normal` · `font-medium` · `font-semibold` · `font-bold`
- Perataan: `text-left` · `text-center` · `text-right`
- Jarak baris & huruf: `leading-*` · `tracking-*`
- **Warna:** `text-{warna}-{shade}` (warna **teks**) · `bg-{warna}-{shade}` (warna
  **latar**) · `border-{warna}-{shade}` (warna **garis**)
- Skala shade: `50` terang → `500` sedang → `950` gelap. Kenapa `text-gray-400` di atas
  `bg-white` sering **tidak terbaca** (Unit 14)
- Warna khusus: `bg-transparent` · `text-current` · `bg-black/50` (opasitas lewat garis miring)
- Kenapa warna default v4 memakai `oklch()` — dan apa efeknya pada konsistensi

**Kelas yang dikenali:** `text-sm` · `text-2xl` · `font-bold` · `text-center` ·
`text-gray-500` · `bg-white` · `bg-blue-600` · `border-gray-200` · `bg-black/50` ·
`leading-relaxed` · `tracking-wide`

**Latihan inspeksi:**
1. **LACAK (wajib):** beri 10 kelas. Untuk masing-masing, sebut: **teks atau latar?** dan
   **seberapa gelap?**
2. **KLAIM:** *"judul ini berwarna biru"* → verifikasi (mungkin `bg-blue-500` — latarnya
   biru, teksnya tidak).
3. **TELUSUR:** warna tidak muncul — cari sebabnya (shade tidak ada? `text-` vs `bg-`
   tertukar? kelas dinamis — Unit 12?).

**Kriteria lulus:** dari 10 kelas warna, bisa menyebut **teks/latar/garis** dengan benar
**dan** mengurutkan dua shade mana yang lebih gelap.

**Miskonsepsi yang paling sering muncul:**
- Mengira `text-blue-500` mengubah latar (ia mengubah **teks**)
- Mengira `bg-blue-550` ada (shade hanya pada langkah tertentu; kalau butuh nilai lain,
  itu `bg-[#...]` atau `@theme`)
- Mengira `text-4xl` hanya ukuran (ia juga membawa **line-height**)
- Mengira `text-gray-400` selalu cukup kontras (sering **tidak** — Unit 14)

**Sumber:** tailwindcss.com/docs/font-size · /font-weight · /text-color · /background-color · /colors

---

## Unit 7 — Batas, bayangan, transparansi

**Konsep:** Kelas yang membuat antarmuka terasa "punya bentuk". Ketiganya bekerja dengan
cara yang **berbeda** dari dugaan: `border` menambah ukuran, `ring` tidak menggeser
apa pun, dan `shadow` tidak memakan ruang sama sekali.

**Yang diajarkan tutor:**
- `border` (1px) · `border-2` · `border-t` (satu sisi) · `border-dashed` ·
  `border-gray-200`
- **`rounded-*`:** `rounded` · `rounded-lg` · `rounded-xl` · `rounded-full` · `rounded-t-lg`
- **`shadow-*`:** `shadow-sm` · `shadow` · `shadow-md` · `shadow-lg` · `shadow-xl`
- **`ring-*`:** garis luar berbentuk bayangan — **tidak menggeser susunan**.
  Kenapa ia dipakai untuk **fokus** (Unit 14)
- `opacity-*` (seluruh elemen) vs warna dengan `/` (`bg-black/50`, hanya warna itu)
- Kenapa `shadow` tidak memakan ruang dan tidak memengaruhi tata letak

**Kelas yang dikenali:** `border` · `border-2` · `border-b` · `border-gray-200` ·
`rounded-lg` · `rounded-full` · `shadow-md` · `shadow-lg` · `ring-2` · `ring-blue-500` ·
`ring-offset-2` · `opacity-50` · `bg-black/50`

**Latihan inspeksi:**
1. **KLAIM:** *"`border-2` di sini tidak akan menggeser tata letak"* → verifikasi
   (ia **menambah** ukuran — bandingkan dengan `ring`).
2. **LACAK:** prediksi mana yang lebih terlihat tebal: `border` atau `ring-2`.
3. **TELUSUR:** menambahkan `border` membuat susunan bergeser — cari sebabnya.

**Kriteria lulus:** bisa menjelaskan **perbedaan** antara `border`, `ring`, dan `shadow`
dalam hal **apakah mereka memengaruhi tata letak**.

**Miskonsepsi yang paling sering muncul:**
- Mengira `border` tidak mengubah ukuran elemen (ia menambah, kecuali `box-border` sudah
  menangani — dan Tailwind memasang `border-box` secara bawaan)
- Mengira `ring` sama dengan `border` (`ring` tidak menggeser susunan)
- Mengira `opacity-50` sama dengan `bg-black/50` (yang pertama memudarkan **seluruh**
  elemen termasuk isinya)
- Mengira `rounded` dan `rounded-md` itu sama

**Sumber:** tailwindcss.com/docs/border-width · /border-radius · /box-shadow · /opacity

---

### → GERBANG 2 setelah Unit 7

**Terjemahkan kelas (ambang 50%).** Detail: `roadmap-4-tingkat.md` §2.

---

# BAGIAN 2 — VARIAN, RESPONSIF, TEMA (Unit 8–11)

> **Yang dilatih:** melihat komponen dan tahu **apa yang berubah, kapan, dan kenapa**.
> Ini bagian yang paling sering disalahpahami: **varian bukan kelas tambahan** — ia
> **kelas yang sama** dengan **syarat**.

---

## Unit 8 — Varian keadaan

**Konsep:** `hover:bg-blue-600` **bukan** kelas baru. Ia berarti: *"kelas `bg-blue-600`,
tapi hanya saat elemen disorot"*. Varian menambahkan **syarat**, bukan menambah kelas.
Karena itu varian juga **menambah spesifisitas** — dan itu sumber bug di Unit 13.

**Yang diajarkan tutor:**
- Keadaan: `hover:` · `focus:` · `active:` · `disabled:` · `visited:` · `checked:`
- **`group`** + `group-hover:` — mengubah anak saat **induk** disorot
- **`peer`** + `peer-checked:` — mengubah saudara berdasarkan keadaan saudara lain
- `focus-visible:` — fokus hanya saat lewat **keyboard** (penting untuk aksesibilitas)
- Varian bisa **digabung**: `md:hover:bg-blue-600`
- Kenapa `disabled:` tidak berpengaruh kalau elemennya `<div>`, bukan `<button>`
- Kenapa `hover:` **tidak ada** di perangkat sentuh

**Kelas yang dikenali:** `hover:bg-blue-600` · `focus:ring-2` · `focus-visible:outline` ·
`active:scale-95` · `disabled:opacity-50` · `group` · `group-hover:text-blue-600` ·
`peer` · `peer-checked:block`

**Latihan inspeksi:**
1. **LACAK (wajib):** prediksi warna/latar tombol pada 3 keadaan: biasa, disorot,
   dinonaktifkan. Sebut **kelas mana** yang menang di tiap keadaan.
2. **KLAIM:** *"tombol ini menjadi lebih gelap saat disorot"* → verifikasi.
3. **TELUSUR:** `disabled:` tidak berpengaruh — cari sebabnya (elemennya bukan `<button>`?
   atribut `disabled` tidak dipasang?).
4. **SUSUN:** susun kelas + varian untuk mencapai perilaku target.

**Kriteria lulus:** dari satu komponen, bisa menyebut **kelas mana yang aktif** pada
setiap keadaan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `hover:` menambah kelas baru (ia memberi **syarat** pada kelas yang sama)
- Mengira `group-hover:` bekerja tanpa kelas `group` di induk
- Mengira `focus:` dan `focus-visible:` itu sama
- Mengira `disabled:` bekerja di elemen apa pun (butuh elemen yang bisa dinonaktifkan)
- Mengira `hover:` bisa diuji di ponsel (tidak ada kursor)

**Sumber:** tailwindcss.com/docs/hover-focus-and-other-states

---

## Unit 9 — Breakpoint (mobile-first)

**Konsep:** Tailwind bekerja **mobile-first**: kelas **tanpa prefix** berlaku di **semua**
ukuran; kelas **dengan prefix** berlaku **dari ukuran itu ke atas**. Jadi `md:flex`
berarti *"flex mulai dari layar sedang ke atas"* — bukan *"hanya di layar sedang"*.

**Yang diajarkan tutor:**
- Breakpoint bawaan (v4 memakai **rem**, asumsi font akar 16px):
  `sm:` 40rem (640px) · `md:` 48rem (768px) · `lg:` 64rem (1024px) · `xl:` 80rem (1280px) ·
  `2xl:` 96rem (1536px)
- **Aturan membaca:** tulis yang **kecil** dulu, lalu **tambah** untuk yang besar
- Contoh benar: `w-full md:w-1/2 lg:w-1/3`
- Contoh **salah** yang sering dihasilkan AI: `w-1/3 sm:w-full` (urutan terbalik → di layar
  besar tetap `w-full` karena `sm:` masih berlaku)
- Kenapa urutan **tulisan** kelas tidak penting, tapi urutan **breakpoint** penting
- Menyembunyikan: `hidden md:block` (muncul hanya di layar sedang ke atas)
- Varian bisa digabung dengan keadaan: `md:hover:bg-blue-600`

**Kelas yang dikenali:** `sm:` · `md:` · `lg:` · `xl:` · `2xl:` · `hidden md:block` ·
`grid-cols-1 md:grid-cols-2 lg:grid-cols-3` · `text-sm md:text-base`

**Latihan inspeksi:**
1. **LACAK (wajib):** beri 4 kelas responsif. Untuk **tiga** lebar jendela berbeda, sebut
   kelas mana yang aktif.
2. **KLAIM:** *"di layar besar, kartu akan tersusun 3 kolom"* → verifikasi (apakah
   `grid-cols-3` ada **tanpa** prefix, atau hanya `md:`?).
3. **TELUSUR:** di layar besar tampilannya **sama** dengan di ponsel — cari sebabnya
   (urutan breakpoint terbalik? prefix salah?).
4. **SUSUN:** susun kelas responsif untuk target 3 lebar layar.

**Kriteria lulus:** dari 4 kelas responsif, bisa menyebut hasilnya di **tiga** lebar layar
**tanpa** mengubah ukuran jendela.

**Miskonsepsi yang paling sering muncul:**
- Mengira `md:` berarti "hanya di layar sedang" (ia "**dari** sedang **ke atas**")
- Mengira kelas tanpa prefix hanya berlaku di ponsel (berlaku di **semua** ukuran)
- Mengira `sm:` adalah "ponsel" (ia breakpoint **pertama ke atas** — 640px)
- Mengira urutan penulisan kelas responsif menentukan hasilnya

**Sumber:** tailwindcss.com/docs/responsive-design

---

## Unit 10 — Dark mode & tema

**Konsep:** `dark:` mengubah gaya saat mode gelap aktif — **tapi hanya kalau mode gelap
diaktifkan**. Dan `@theme` adalah cara v4 mendefinisikan **token**: satu tempat untuk
warna, jarak, dan font, supaya tidak tersebar.

**Yang diajarkan tutor:**
- `dark:` bekerja seperti varian lain — menambah **syarat**
- **Cara mengaktifkan** mode gelap: lewat `prefers-color-scheme` (bawaan) atau lewat
  kelas di `<html>`/`<body>` — dan kenapa **pilihan ini menentukan** apakah tombol
  "mode gelap" buatan sendiri akan bekerja
- Kenapa `dark:` **diam-diam tidak berefek** kalau mode gelap belum diaktifkan
  (dan itu **tidak** menghasilkan error)
- **`@theme`:** mendefinisikan token (`--color-merek`, `--spacing`, `--font-*`)
- Kenapa token lebih baik daripada mengulang nilai `bg-[#1da1f2]` di 20 tempat
- Warna default v4 memakai `oklch()` — apa artinya bagi konsistensi terang/gelap

**Kelas yang dikenali:** `dark:bg-gray-900` · `dark:text-white` ·
`@theme { --color-merek: #1da1f2; }` · `bg-merek` · `text-merek` · `@custom-variant dark`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"halaman ini berubah gelap saat mode gelap aktif"* → verifikasi
   (apakah mode gelapnya benar-benar diaktifkan? apakah ada `dark:` yang cocok?).
2. **LACAK:** beri 6 kelas dengan `dark:`. Sebut mana yang aktif di mode terang vs gelap.
3. **TELUSUR:** `dark:` tidak berpengaruh — cari sebabnya.

**Kriteria lulus:** bisa menjelaskan **dua cara** mengaktifkan mode gelap, dan **kenapa
pilihan itu penting**.

**Miskonsepsi yang paling sering muncul:**
- Mengira `dark:` otomatis bekerja (butuh mode gelap **diaktifkan**)
- Mengira `dark:` berefek tanpa error kalau salah (ia **diam**)
- Mengira `@theme` sama dengan `tailwind.config.js` (tujuannya mirip, tempatnya beda)
- Mengira warna `oklch()` "sama saja" dengan hex (rentang terang/gelapnya lebih seragam)

**Sumber:** tailwindcss.com/docs/dark-mode · /theme

---

## Unit 11 — Keluar dari utility

**Konsep:** Tailwind punya **pintu keluar** untuk kasus yang tidak bisa diselesaikan
utility: **nilai bebas** (`w-[37px]`) dan `@apply`. Pintu itu **ada gunanya** — tapi
memakainya sebagai kebiasaan justru **mengembalikan** masalah yang Tailwind selesaikan.

**Yang diajarkan tutor:**
- **Nilai bebas:** `w-[37px]` · `bg-[#1da1f2]` · `grid-cols-[1fr_2fr]` ·
  `text-[clamp(1rem,2vw,2rem)]`
- Kapan nilai bebas **tepat**: nilai yang benar-benar sekali pakai, atau belum ada di skala
- Kapan nilai bebas **salah**: nilai yang seharusnya jadi token (pakai `@theme`)
- **`@apply`:** menyalin utility ke dalam aturan CSS sendiri
- **Kapan `@apply` boleh:** gaya bawaan untuk komponen pihak ketiga yang tidak bisa
  diberi kelas
- **Kapan `@apply` jangan:** untuk "merapikan" kelas yang panjang — itu mengembalikan
  nama kelas kabur yang jadi masalah di Unit 1
- **`@layer`:** menentukan urutan CSS sendiri
- **Alternatif yang lebih benar** untuk kelas panjang: **ekstrak komponen** (React) —
  dibahas di Unit 15
- Kenapa `!important` (`!p-4`) hampir selalu tanda masalah

**Kelas yang dikenali:** `w-[37px]` · `bg-[#1da1f2]` · `text-[10px]` · `@apply p-4 rounded` ·
`@layer components { }` · `!p-4`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"`@apply` di sini membuat kode lebih mudah dirawat"* → verifikasi
   (apakah ia menyembunyikan masalah, atau menyelesaikannya?).
2. **LACAK:** beri 5 nilai bebas. Sebut CSS aslinya.
3. **SUSUN:** pilih susunan yang benar antara tiga pilihan: utility · `@apply` ·
   ekstrak komponen — untuk satu kasus tertentu, **dengan alasan**.
4. **TELUSUR:** `@apply` tidak berfungsi — cari sebabnya (kelas tidak ada? urutan `@layer`?).

**Kriteria lulus:** bisa menyebut **satu situasi** di mana `@apply` **tepat**, dan
**satu** di mana ia **salah** — dengan alasan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `@apply` adalah "cara merapikan" (itu mengembalikan masalah Unit 1)
- Mengira nilai bebas sama baiknya dengan token (nilai bebas **tidak bisa** diubah serentak)
- Mengira `!important` adalah alat normal (itu tanda konflik yang tidak diselesaikan)
- Mengira kelas panjang itu **selalu** masalah (sering kali benar — ekstrak **komponen**,
  bukan `@apply`)

**Sumber:** tailwindcss.com/docs/adding-custom-styles · /styling-with-utility-classes

---

### → GERBANG 3 setelah Unit 11

**Perbaiki layout, jelaskan tiap kelas.** Detail: `roadmap-4-tingkat.md` §3.

---

# BAGIAN 3 — MEMBONGKAR & MENJAGA (Unit 12–15)

> **Yang dilatih:** menemukan masalah pada tampilan, **menelusuri sebabnya**, dan
> **memutuskan** apakah tampilan itu layak diterima.
> Unit 12 dan 13 adalah **inti seluruh roadmap**: keduanya **tidak menimbulkan error**.
> Hanya warna yang hilang, atau jarak yang tidak berubah.

---

## Unit 12 — Kelas dinamis yang tidak ter-generate ⭐⭐

**Konsep:** Ini unit **terpenting** di seluruh roadmap. Tailwind **memindai teks** di
file untuk mencari nama kelas. `` `bg-${warna}-500` `` **tidak pernah ada** sebagai teks
utuh di file mana pun — jadi **CSS-nya tidak pernah dibuat**.

```jsx
// 🔴 TIDAK BEKERJA — kelasnya tidak pernah ada sebagai teks utuh
const warna = "blue";
<div className={`bg-${warna}-500`}>…</div>
```

**Tidak ada error. Tidak ada peringatan. Warnanya hanya hilang.**

**Yang diajarkan tutor:**
- Kenapa: Tailwind bekerja dengan **memindai teks**, bukan menjalankan kode
- Gejala khas: warna muncul untuk **sebagian** nilai, hilang untuk yang lain
  (karena kebetulan ada tempat lain yang menulis kelas itu secara utuh)
- **Perbaikan 1 (utama):** tulis kelas **lengkap** di dalam peta

```jsx
// ✅ BEKERJA — setiap kelas tertulis utuh, jadi terpindai
const WARNA = { biru: "bg-blue-500", merah: "bg-red-500", hijau: "bg-green-500" };
<div className={WARNA[warna]}>…</div>
```

- **Perbaikan 2:** pisahkan **nama kelas** dari **nilai** (`text-blue-500` tetap utuh,
  hanya angkanya yang dinamis — dan itu pun sering harus lewat token)
- **Perbaikan 3:** `style={{ ... }}` untuk nilai yang benar-benar berubah-ubah
- **Perbaikan 4:** daftarkan kelas yang mungkin dipakai secara eksplisit (v3: `safelist`;
  v4: `@source inline(...)`) — sebut sebagai pilihan **terakhir**, karena menambah CSS
  yang mungkin tidak dipakai
- **Batasnya:** masalah ini **tidak** terjadi pada `className="bg-blue-500"` biasa,
  **tidak** pada `hover:`/`md:`, dan **tidak** pada nilai bebas `bg-[#1da1f2]`

**Kelas yang dikenali:** `` `bg-${x}-500` `` (🔴) · `` `text-${x}-600` `` (🔴) ·
`` `w-${n}` `` (🔴) · `WARNA[warna]` (✅) · `@source inline(...)` ·
`style={{ backgroundColor: x }}` (✅ untuk nilai dinamis)

**Latihan inspeksi:**
1. **TELUSUR (wajib, dua kali):**
   - **(i)** Daftar tombol berwarna dari data. Sebagian berwarna, sebagian **tidak**.
     Tidak ada error. Cari sebabnya. **Dugaan ditulis sebelum menyentuh kode.**
   - **(ii)** Sama, tapi kali ini semua tombol **tidak berwarna** — pembelajar harus
     menemukan bahwa tidak ada satu pun kelas yang tertulis utuh.
2. **KLAIM:** *"warna tombol mengikuti data"* → verifikasi.
3. **LACAK:** beri 5 cara menulis kelas. Tandai mana yang **akan ter-generate** dan mana
   yang **tidak** — tanpa menjalankan.

**Kriteria lulus:** dari satu komponen, bisa menunjuk **kelas dinamis mana** yang tidak
akan ter-generate — **tanpa menjalankan**, dalam dua dugaan atau kurang.

**Miskonsepsi yang paling sering muncul:**
- Mengira kelas dinamis "kadang jalan" (ia **tidak pernah** di-generate; kalau terlihat
  jalan, itu kebetulan ada penulisan utuh di tempat lain)
- Mengira masalahnya di data (bukan — datanya benar, kelasnya yang tidak dibuat)
- Mengira harus pakai `safelist` (itu pilihan terakhir; peta kelas lengkap lebih baik)
- Mengira `hover:` atau `md:` kena masalah yang sama (tidak — keduanya tertulis utuh)

**Sumber:** tailwindcss.com/docs/detecting-classes-in-source-files · `teach-javascript`
(template literal) · `korpus-ai.md` §4(d)

---

## Unit 13 — Kenapa kelas lain tidak "kena"

**Konsep:** Setelah Unit 12, masih ada **tiga sebab lain** sebuah kelas tampak tidak
berpengaruh — dan **ketiganya juga tanpa error**:

| # | Sebab | Contoh | Perbaikan |
|---|---|---|---|
| a | **Dua kelas bertabrakan** | `p-2 p-4` — yang menang **bukan** yang terakhir ditulis, tapi yang **urutan CSS-nya lebih belakang** | Pakai satu kelas; atau sadari urutan CSS Tailwind |
| b | **Kelas tidak ada** | `text-4xxl`, `bg-blue-550`, `p-13` | Pakai yang ada, atau nilai bebas `text-[3rem]` |
| c | **Varian salah tulis** | `hover-bg-blue-500` (tanda hubung, bukan titik dua) | `hover:bg-blue-500` |

**Yang diajarkan tutor:**
- **Aturan penting:** urutan kelas di `className` **tidak menentukan** pemenang.
  Yang menentukan adalah **urutan di dalam file CSS** yang dihasilkan Tailwind
- Karena itu `p-2 p-4` dan `p-4 p-2` menghasilkan **hal yang sama** — dan itu sering
  berlawanan dengan dugaan
- Kenapa ini berbeda dari CSS biasa, di mana urutan penulisan **memang** menentukan
- Cara memastikan: **DevTools Inspector** menunjukkan aturan mana yang **menang** (dicoret
  = kalah)
- Kenapa kelas yang tidak ada **tidak error** (Tailwind hanya mengabaikannya)
- Kenapa ini alasan kuat untuk **memakai komponen**, bukan menumpuk kelas

**Kelas yang dikenali:** `p-2 p-4` (🔴 konflik) · `mt-4 m-2` (🔴 konflik) ·
`text-4xxl` (🔴 tidak ada) · `bg-blue-550` (🔴 tidak ada) · `hover-bg-blue-500` (🔴 salah
tulis) · `text-[3rem]` (✅ nilai bebas)

**Latihan inspeksi:**
1. **TELUSUR (wajib):** `mt-4` tidak berpengaruh. Cari sebabnya (ada `m-2` di elemen yang
   sama? ada `space-y-*` di induk?). **Dugaan ditulis sebelum menyentuh kode.**
2. **KLAIM:** *"jarak atas kartu ini 1rem"* → verifikasi (mungkin `m-2` yang menang).
3. **LACAK:** beri 6 pasang kelas yang bertabrakan. Sebut **mana yang menang** dan kenapa.
4. **SUSUN:** susun kelas untuk mencapai jarak target tanpa konflik.

**Kriteria lulus:** bisa menjelaskan **kenapa `p-2 p-4` tidak selalu menghasilkan `p-4`**
— dan itu **tanpa** membuka browser.

**Miskonsepsi yang paling sering muncul:**
- Mengira kelas yang **terakhir ditulis** di `className` yang menang
- Mengira kelas yang tidak ada akan **error** (ia diabaikan)
- Mengira `mt-4` menang atas `m-2` karena lebih spesifik (keduanya sama spesifik —
  yang menang karena urutan CSS)
- Mengira konflik kelas itu masalah sepele (ini sumber "kenapa jaraknya tidak berubah"
  yang paling sering)

**Sumber:** tailwindcss.com/docs/styling-with-utility-classes · /adding-custom-styles

---

## Unit 14 — Aksesibilitas

**Konsep:** Tampilan yang "bagus" belum tentu **bisa dipakai**. Tailwind membuat
penulisan gaya jadi cepat — dan itu berarti membuat kesalahan aksesibilitas juga cepat.
Cacat ini **tidak terlihat** oleh mata yang tidak mencarinya.

**Yang diajarkan tutor:**
- **`sr-only`** — menyembunyikan secara visual, tapi **tetap** dibaca pembaca layar.
  Untuk ikon tanpa teks (mis. tombol dengan hanya ikon)
- **Kontras:** `text-gray-400` di atas `bg-white` sering **gagal** ambang WCAG.
  Ambang WCAG 2.2 AA: **4.5:1** untuk teks normal
- **Fokus yang terlihat:** jangan `focus:outline-none` **tanpa pengganti**.
  Pengganti yang benar: `focus-visible:ring-2`
- **Elemen yang benar:** `<button>` untuk aksi, `<a>` untuk navigasi.
  `<div onClick>` **tidak** bisa difokus dengan Tab, **tidak** bisa diaktifkan dengan Enter
- `<img>` wajib punya `alt` (atau `alt=""` kalau murni dekoratif)
- `<label for="...">` yang benar-benar terhubung ke input
- Kenapa `hover:` saja tidak cukup (perangkat sentuh tidak punya kursor)

**Kelas yang dikenali:** `sr-only` · `not-sr-only` · `focus:outline-none` (🔴 tanpa
pengganti) · `focus-visible:ring-2` (✅) · `focus-visible:outline-2` · `text-gray-400`
(⚠️ cek kontras) · `<div onClick>` (🔴) · `<button disabled>` (✅)

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"halaman ini bisa dipakai dengan keyboard"* → verifikasi
   (tekan **Tab**, lalu **Enter** — apakah semuanya bisa dicapai?).
2. **TELUSUR:** satu tombol tidak bisa diaktifkan dengan keyboard — cari sebabnya.
3. **LACAK:** beri 5 elemen, tandai mana yang bisa difokus dan mana yang tidak.

**Kriteria lulus:** dari satu halaman, bisa menyebut **dua** cacat aksesibilitas
**tanpa** menjalankannya.

**Miskonsepsi yang paling sering muncul:**
- Mengira aksesibilitas itu "untuk penyandang disabilitas saja" (ia untuk **semua** —
  termasuk yang memakai keyboard karena apa pun alasannya)
- Mengira `focus:outline-none` itu perbaikan tampilan (ia **menghapus** kemampuan
  keyboard, kalau tanpa pengganti)
- Mengira `<div onClick>` sama dengan `<button>` (tidak — beda 4 perilaku bawaan)
- Mengira kontras itu soal selera

**Sumber:** MDN: *Accessibility*, *ARIA* · WCAG 2.2 (W3C) · tailwindcss.com/docs/accessibility

---

## Unit 15 — Review, konsistensi & keputusan

**Konsep:** Ini unit penutup. Bukan menambah pengetahuan baru, tapi **mengubah cara
memutuskan**: kapan menerima tampilan hasil AI, kapan menolaknya, dan **kapan kelas
panjang itu masalah nyata dan kapan bukan**.

**Yang diajarkan tutor:**
- Bentuk review: **klaim → bukti → risiko → keputusan**
- **Kapan mengekstrak komponen** (React) alih-alih `@apply`:
  - Kelas yang sama muncul di 3+ tempat → **komponen**
  - Satu bagian punya logika + tampilan → **komponen**
  - Gaya bawaan pihak ketiga → `@apply` (jarang)
- **Konsistensi:** apakah jarak memakai skala yang sama? Apakah ada 5 abu-abu berbeda?
  Apakah ada `p-3` di satu tempat dan `px-3 py-3` di tempat lain?
- Kenapa **kelas panjang itu sering benar** (semuanya terlihat di satu tempat)
- Kenapa **"jalan kok" bukan alasan** — RCT Anthropic menunjukkan rasa percaya diri
  tidak berkorelasi dengan pemahaman
- Menyatakan keputusan: *terima / tolak*, dengan **alasan yang bisa diperiksa**

**Kelas yang dikenali:** (tidak ada kelas baru — unit ini tentang **membaca** kumpulan kelas)

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"tampilan ini konsisten dan siap dipakai"* → verifikasi.
2. **REVIEW:** tulis review lengkap berisi klaim · bukti · satu risiko · keputusan + alasan.
3. **SUSUN:** untuk satu kasus, pilih: biarkan utility · ekstrak komponen · `@apply` —
   **dengan alasan**.
4. **TELUSUR:** satu komponen yang sama tampil berbeda di dua tempat — cari sebabnya
   (kelas di-timpa? urutan CSS? varian?).

**Kriteria lulus:** bisa menulis review berisi **keputusan terima/tolak dengan alasan yang
bisa diperiksa** — bukan "sudah saya jalankan dan bagus kok".

**Miskonsepsi yang paling sering muncul:**
- Mengira kelas panjang selalu buruk (sering kali **lebih baik** — semuanya terlihat)
- Mengira `@apply` cara merapikan yang setara dengan komponen (tidak setara — satu
  menyembunyikan, satu menyusun)
- Mengira "berhasil dijalankan" = "layak diterima"
- Mengira konsistensi itu soal estetika (ia soal **kecepatan mengubah** nanti)

**Sumber:** Addy Osmani — *Agentic Code Review* · `AGENTS.MD` repo (bukti, bukan klaim) ·
RCT Anthropic (arXiv 2601.20245)

---

### → GERBANG 4 setelah Unit 15

**Temukan, telusuri, perbaiki, putuskan.** Detail: `roadmap-4-tingkat.md` §4.

---

## Setelah Gerbang 4

Roadmap ini berhenti di **"bisa menerjemahkan kelas Tailwind, menemukan kenapa sebuah
kelas tidak bekerja, dan memutuskan apakah tampilan itu layak diterima"** — bukan di
"bisa mendesain antarmuka yang indah". Itu **disengaja**: menilai lebih dulu, mendesain
kemudian.

Yang **belum** diajarkan di sini (dan di mana melanjutkannya):

| Mau ke mana | Ke mana |
|---|---|
| Desain antarmuka (bukan hanya menerjemahkan kelas) | Skill desain / `/frontend-design` |
| React lebih dalam (komponen, state, render) | `/teach-react` |
| Backend, API, database | `/teach-nodejs` |
| Arsitektur aplikasi nyata (skala, batas modul) | `/teach-system-design` |
| Analisis arsitektur aplikasi nyata | `/teach-case-study` |
| Animasi & transisi kompleks | Dokumentasi resmi Tailwind — **di luar** cakupan skill ini |
| Membangun aplikasi sungguhan dari nol | `/idea-clarifier` → pipeline produksi (Bab 27) |

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `teach-react/references/peta-unit.md`
