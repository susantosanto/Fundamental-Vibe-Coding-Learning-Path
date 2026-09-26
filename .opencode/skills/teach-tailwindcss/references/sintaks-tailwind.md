# Kamus Kelas — Tailwind CSS → CSS Asli

> Referensi untuk skill `teach-tailwindcss`. **Tutor membaca file ini sendiri** dan
> **menerjemahkan satu kelas per kejadian** (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 26 September 2026 · **Kerangka asal:** `teach-react/references/sintaks-react.md`
> · **Versi yang dirujuk:** Tailwind CSS v4
>
> **Aturan pemakaian (penting):**
> - Pembelajar **bertanya** *"kelas ini artinya apa?"* → jawab **satu kelas**, 1–2 kalimat,
>   **sebut CSS aslinya**, kaitkan ke unit, lalu **lanjut**.
> - **JANGAN** menjelaskan lima kelas sekaligus. Menumpuk = menenggelamkan.
> - **JANGAN** menyuruh pembelajar membaca file ini sendiri.
> - **JANGAN** bilang *"itu di luar materi"*. Kode AI memakai semua ini sejak baris pertama.
>
> **Tingkat bahaya:**
> - 🔴 **Berbahaya** — sering jadi sumber masalah nyata
> - 🟡 **Perlu hati-hati** — benar kalau dipakai tepat
> - ⚪ **Aman** — cukup dikenali
>
> **Batas kejujuran:** tingkat bahaya di sini adalah **penilaian**, bukan hasil riset.
> Angka px di bawah mengasumsikan **font akar 16px** (bawaan browser).

---

## A. Cara membaca sebuah kelas Tailwind

Satu kelas bisa punya **tiga bagian**, dan urutannya selalu sama:

```
md:hover:bg-blue-500
│  │     │   │    └── nilai (shade)
│  │     │   └─────── sifat (warna latar)
│  │     └─────────── varian (saat disorot)
│  └───────────────── varian (dari layar sedang ke atas)
└──────────────────── varian (bisa lebih dari satu)
```

| Bagian | Contoh | Artinya |
|---|---|---|
| **Varian** (opsional) | `md:` `hover:` `dark:` `focus:` | **syarat** — kapan kelas ini berlaku |
| **Sifat** | `bg` `text` `p` `m` `flex` `gap` | **apa** yang diubah |
| **Nilai** | `blue-500` `4` `center` `full` | **seberapa** |

> **Kunci memahami varian:** `hover:bg-blue-600` **bukan** kelas baru. Ia berarti:
> *"kelas `bg-blue-600`, tapi **hanya saat** elemen disorot."* (Unit 8)

---

## B. Tata letak

| Kelas | CSS asli | Bahaya | Unit |
|---|---|---|---|
| `block` | `display: block` | ⚪ | 4 |
| `inline-block` | `display: inline-block` | ⚪ | 4 |
| `inline` | `display: inline` | ⚪ | 4 |
| `hidden` | `display: none` | 🟡 | 4 |
| `flex` | `display: flex` | ⚪ | 4 |
| `inline-flex` | `display: inline-flex` | ⚪ | 4 |
| `grid` | `display: grid` | ⚪ | 4 |
| `flex-col` | `flex-direction: column` | 🟡 | 4 |
| `flex-row` | `flex-direction: row` (bawaan) | ⚪ | 4 |
| `flex-wrap` | `flex-wrap: wrap` | ⚪ | 4 |
| `flex-1` | `flex: 1 1 0%` — mengisi sisa ruang | 🟡 | 4 |
| `items-center` | `align-items: center` (**sumbu silang**) | 🔴 | 4 |
| `items-start` / `items-end` | `align-items: flex-start` / `flex-end` | 🟡 | 4 |
| `justify-center` | `justify-content: center` (**sumbu utama**) | 🔴 | 4 |
| `justify-between` | `justify-content: space-between` | ⚪ | 4 |
| `justify-end` | `justify-content: flex-end` | ⚪ | 4 |
| `gap-4` | `gap: 1rem` (16px) | ⚪ | 4 |
| `grid-cols-3` | `grid-template-columns: repeat(3, minmax(0,1fr))` | ⚪ | 4 |
| `col-span-2` | `grid-column: span 2 / span 2` | ⚪ | 4 |
| `relative` | `position: relative` | 🟡 | 4 |
| `absolute` | `position: absolute` | 🔴 | 4 |
| `fixed` | `position: fixed` | 🟡 | 4 |
| `sticky` | `position: sticky` | 🟡 | 4 |
| `inset-0` | `inset: 0` (menempel ke 4 sisi induk) | 🟡 | 4 |
| `top-4` / `right-4` | `top: 1rem` / `right: 1rem` | ⚪ | 4 |
| `z-10` | `z-index: 10` | 🟡 | 4 |
| `overflow-hidden` | `overflow: hidden` | ⚪ | 4 |

> **🔴 Yang paling sering salah:** `items-*` dan `justify-*` **bertukar peran** saat
> `flex-col`. `justify-*` selalu mengikuti **sumbu utama** (arah flex), `items-*` selalu
> **sumbu silang**. (Unit 4)
>
> **🔴 `absolute` tanpa induk `relative`** → elemen mencari induk berposisi terdekat, dan
> kalau tidak ada, ia menempel ke **seluruh halaman**.

---

## C. Ruang & ukuran

**Skala jarak** (v4: `--spacing: 0.25rem`, jadi angka × 4 = px):

| Kelas | Nilai | px |
|---|---|---|
| `p-0` | `0` | 0 |
| `p-px` | `1px` | 1 |
| `p-0.5` | `0.125rem` | 2 |
| `p-1` | `0.25rem` | **4** |
| `p-1.5` | `0.375rem` | 6 |
| `p-2` | `0.5rem` | **8** |
| `p-3` | `0.75rem` | 12 |
| `p-4` | `1rem` | **16** |
| `p-5` | `1.25rem` | 20 |
| `p-6` | `1.5rem` | **24** |
| `p-8` | `2rem` | **32** |
| `p-10` | `2.5rem` | 40 |
| `p-12` | `3rem` | 48 |
| `p-16` | `4rem` | 64 |
| `p-20` | `5rem` | 80 |
| `p-24` | `6rem` | 96 |

| Kelas | CSS asli | Bahaya | Unit |
|---|---|---|---|
| `p-*` | `padding` (semua sisi) | ⚪ | 5 |
| `px-*` / `py-*` | `padding-inline` / `padding-block` | ⚪ | 5 |
| `pt-*` `pr-*` `pb-*` `pl-*` | satu sisi | ⚪ | 5 |
| `m-*` | `margin` (semua sisi) | ⚪ | 5 |
| `-mt-4` | `margin-top: -1rem` (negatif) | 🟡 | 5 |
| `mx-auto` | `margin-inline: auto` — **butuh lebar** | 🔴 | 5 |
| `space-y-4` | margin antar anak (vertikal) | 🔴 | 5 |
| `space-x-4` | margin antar anak (horizontal) | 🟡 | 5 |
| `w-64` | `width: 16rem` (**256px**, bukan 64px) | 🔴 | 5 |
| `w-full` | `width: 100%` | ⚪ | 5 |
| `w-screen` | `width: 100vw` | 🟡 | 5 |
| `w-1/2` | `width: 50%` (pecahan, **bukan** skala) | 🟡 | 5 |
| `w-fit` | `width: fit-content` | ⚪ | 5 |
| `size-5` | `width: 1.25rem; height: 1.25rem` | ⚪ | 5 |
| `max-w-md` | `max-width: 28rem` | ⚪ | 5 |
| `max-w-4xl` | `max-width: 56rem` | ⚪ | 5 |
| `min-h-screen` | `min-height: 100vh` | ⚪ | 5 |

> **🔴 `space-y-*` vs `gap-*`:** keduanya memberi jarak, tapi berbeda cara. `gap` hanya
> berlaku di flex/grid dan tidak kolaps. `space-y-*` menambah **margin** pada anak —
> sehingga bisa **bertabrakan** dengan `mt-*` di anak yang sama. (Unit 5)
>
> **🔴 `mx-auto` tanpa `w-*`/`max-w-*`** tidak menengahkan apa pun — elemen block sudah
> memenuhi lebar penuh, jadi tidak ada ruang untuk dibagi.

---

## D. Tipografi

| Kelas | CSS asli | Bahaya | Unit |
|---|---|---|---|
| `text-xs` | `font-size: .75rem; line-height: 1rem` | ⚪ | 6 |
| `text-sm` | `font-size: .875rem; line-height: 1.25rem` | ⚪ | 6 |
| `text-base` | `font-size: 1rem; line-height: 1.5rem` | ⚪ | 6 |
| `text-lg` | `font-size: 1.125rem; line-height: 1.75rem` | ⚪ | 6 |
| `text-xl` | `font-size: 1.25rem; line-height: 1.75rem` | ⚪ | 6 |
| `text-2xl` | `font-size: 1.5rem; line-height: 2rem` | ⚪ | 6 |
| `text-3xl` | `font-size: 1.875rem; line-height: 2.25rem` | ⚪ | 6 |
| `text-4xl` | `font-size: 2.25rem; line-height: 2.5rem` | ⚪ | 6 |
| `text-9xl` | `font-size: 8rem; line-height: 1` | ⚪ | 6 |
| `font-normal` | `font-weight: 400` | ⚪ | 6 |
| `font-medium` | `font-weight: 500` | ⚪ | 6 |
| `font-semibold` | `font-weight: 600` | ⚪ | 6 |
| `font-bold` | `font-weight: 700` | ⚪ | 6 |
| `text-left` / `text-center` / `text-right` | `text-align: ...` | ⚪ | 6 |
| `leading-relaxed` | `line-height: 1.625` | ⚪ | 6 |
| `tracking-wide` | `letter-spacing: 0.025em` | ⚪ | 6 |
| `truncate` | `overflow:hidden; text-overflow:ellipsis; white-space:nowrap` | 🟡 | 6 |
| `italic` / `underline` / `line-through` | sesuai nama | ⚪ | 6 |

> **Perhatikan:** setiap `text-*` **membawa `line-height` sekaligus**. Itu sebabnya
> menaikkan ukuran huruf bisa mengubah tinggi baris tanpa kamu memintanya. (Unit 6)
>
> **🟡 `truncate` hanya bekerja pada elemen dengan lebar terbatas.** Di dalam `flex`,
> elemen juga perlu `min-w-0` — kalau tidak, teks tidak mau memotong.

---

## E. Warna

**Bentuk:** `{sifat}-{warna}-{shade}`

| Sifat | Mengubah | Contoh |
|---|---|---|
| `text-` | warna **teks** | `text-blue-600` |
| `bg-` | warna **latar** | `bg-blue-600` |
| `border-` | warna **garis** | `border-gray-200` |
| `ring-` | warna **garis fokus** | `ring-blue-500` |
| `divide-` | warna garis **antar anak** | `divide-gray-200` |
| `from-` / `via-` / `to-` | gradasi | `from-blue-500` |

**Shade:** `50` (paling terang) → `100` → `200` … `500` (sedang) … → `900` → `950` (paling gelap)

| Kelas | CSS asli (perkiraan) | Bahaya | Unit |
|---|---|---|---|
| `text-gray-500` | `color: oklch(...)` | ⚪ | 6 |
| `text-gray-400` di atas `bg-white` | kontras **≈ 2.5:1** → **gagal WCAG AA** | 🔴 | **14** |
| `bg-white` / `bg-black` | `#fff` / `#000` | ⚪ | 6 |
| `bg-transparent` | `transparent` | ⚪ | 6 |
| `bg-black/50` | `rgb(0 0 0 / 0.5)` — **hanya warna itu** | 🟡 | 6, 7 |
| `text-current` | mewarisi warna teks induk | ⚪ | 6 |
| `bg-blue-550` | **TIDAK ADA** — shade hanya pada langkah tertentu | 🔴 | **13** |
| `bg-[#1da1f2]` | `background-color: #1da1f2` (nilai bebas) | 🟡 | 11 |

> **🔴 Kesalahan paling sering:** `text-` dan `bg-` **tertukar**. `text-blue-500`
> mengubah **warna huruf**, bukan latar. (Unit 6)
>
> **🔴 Warna default v4 memakai `oklch()`**, bukan `rgb`/hex. Efek praktisnya: perbedaan
> terang/gelap antar-warna lebih seragam — tapi nilai hex-nya **tidak sama** dengan v3.

---

## F. Batas, bayangan, transparansi

| Kelas | CSS asli | Bahaya | Unit |
|---|---|---|---|
| `border` | `border-width: 1px` | 🟡 | 7 |
| `border-2` / `border-4` | `border-width: 2px` / `4px` | ⚪ | 7 |
| `border-b` / `border-t` | satu sisi saja | ⚪ | 7 |
| `border-dashed` / `border-dotted` | gaya garis | ⚪ | 7 |
| `rounded` / `rounded-md` / `rounded-lg` | `border-radius` kecil → sedang | 🟡 | 7 |
| `rounded-xl` / `rounded-2xl` | radius lebih besar | ⚪ | 7 |
| `rounded-full` | `border-radius: calc(infinity * 1px)` (lingkaran) | ⚪ | 7 |
| `rounded-t-lg` | hanya sudut atas | ⚪ | 7 |
| `shadow-sm` / `shadow-md` / `shadow-lg` | `box-shadow` kecil → besar | 🟡 | 7 |
| `ring` / `ring-2` | `box-shadow: 0 0 0 1px/2px` — **tidak menggeser susunan** | 🟡 | 7, 14 |
| `ring-offset-2` | jarak antara elemen dan ring | ⚪ | 14 |
| `opacity-50` | `opacity: .5` — **seluruh elemen**, termasuk isinya | 🔴 | 7 |
| `outline-none` | `outline: none` — **menghapus penanda fokus** | 🔴 | **14** |

> **🔴 `border` menambah ukuran elemen.** Tailwind memasang `box-sizing: border-box`
> secara bawaan, jadi **padding dan border dihitung ke dalam** lebar yang diminta —
> tapi elemen tetap butuh ruang untuk border itu. Bandingkan dengan `ring`, yang
> **tidak menggeser apa pun**. (Unit 7)
>
> **🔴 `opacity-50` vs `bg-black/50`** — yang pertama memudarkan **seluruh** elemen
> (termasuk teks dan gambar di dalamnya), yang kedua hanya warna itu. (Unit 7)
>
> ⚠️ **Catatan versi:** nama skala `shadow-*` dan `rounded-*` **berubah antara v3 dan v4**
> (v4 menambahkan `shadow-2xs`/`shadow-xs`/`rounded-xs` dan menggeser arti `shadow-sm`).
> **Verifikasi dengan dokumentasi versi yang dipakai** sebelum mengajarkan nama spesifik.

---

## G. Varian keadaan

| Kelas | Artinya | Bahaya | Unit |
|---|---|---|---|
| `hover:` | saat kursor di atas elemen | 🟡 | 8 |
| `focus:` | saat elemen difokus | ⚪ | 8 |
| `focus-visible:` | fokus **lewat keyboard saja** | ⚪ | 8, 14 |
| `active:` | saat ditekan | ⚪ | 8 |
| `disabled:` | saat `disabled` aktif (**butuh elemen yang bisa dinonaktifkan**) | 🔴 | 8 |
| `checked:` | saat dicentang | ⚪ | 8 |
| `group` | menandai induk | 🟡 | 8 |
| `group-hover:` | anak berubah saat **induk** disorot | 🔴 | 8 |
| `peer` | menandai saudara | 🟡 | 8 |
| `peer-checked:` | berubah menurut keadaan **saudara** | 🔴 | 8 |
| `hover-bg-blue-500` | **SALAH** — harusnya `hover:bg-blue-500` | 🔴 | **13** |

> **🔴 `group-hover:` tidak bekerja tanpa kelas `group` di induk.** Cacat klasik AI:
> kelasnya ditulis di anak, tapi `group` lupa dipasang di induk. (Unit 8)
>
> **🟡 `hover:` tidak ada di perangkat sentuh.** Jangan menaruh informasi penting
> (mis. tombol hapus) hanya di balik `hover:`. (Unit 8, 14)

---

## H. Responsif — mobile-first

| Kelas | Aktif dari | px (asumsi 16px) |
|---|---|---|
| *(tanpa prefix)* | **semua ukuran** | 0 ke atas |
| `sm:` | 40rem | **640px** ke atas |
| `md:` | 48rem | **768px** ke atas |
| `lg:` | 64rem | **1024px** ke atas |
| `xl:` | 80rem | **1280px** ke atas |
| `2xl:` | 96rem | **1536px** ke atas |

| Kelas | Artinya | Bahaya | Unit |
|---|---|---|---|
| `w-full md:w-1/2` | penuh di ponsel, setengah dari 768px ke atas | ⚪ | 9 |
| `hidden md:block` | hilang di ponsel, muncul dari 768px | ⚪ | 9 |
| `grid-cols-1 md:grid-cols-3` | 1 kolom → 3 kolom | ⚪ | 9 |
| `w-1/3 sm:w-full` | 🔴 **urutan terbalik** — di layar besar tetap penuh | 🔴 | **9** |

> **🔴 Aturan yang paling sering salah:** `md:` berarti **"dari 768px ke atas"**, bukan
> **"hanya di 768px"**. Karena itu **selalu tulis yang kecil dulu**, lalu tambahkan
> untuk yang lebih besar. (Unit 9)

---

## I. Tema & keluar dari utility

| Kelas / sintaks | Artinya | Bahaya | Unit |
|---|---|---|---|
| `@import "tailwindcss";` | memuat Tailwind (v4) | ⚪ | 3 |
| `@tailwind base/components/utilities` | cara **v3** — tidak dipakai lagi di v4 | 🟡 | 3 |
| `@theme { --color-merek: #1da1f2; }` | mendefinisikan token (v4) | ⚪ | 10 |
| `bg-merek` | memakai token di atas | ⚪ | 10 |
| `dark:bg-gray-900` | latar gelap **saat mode gelap aktif** | 🔴 | 10 |
| `@custom-variant dark` | mendefinisikan cara mode gelap diaktifkan | 🟡 | 10 |
| `w-[37px]` | nilai bebas — `width: 37px` | 🟡 | 11 |
| `text-[clamp(1rem,2vw,2rem)]` | nilai bebas dengan fungsi CSS | 🟡 | 11 |
| `@apply p-4 rounded` | menyalin utility ke aturan CSS sendiri | 🔴 | 11 |
| `@layer components { }` | menentukan urutan CSS sendiri | 🟡 | 11 |
| `!p-4` | `padding: 1rem !important` | 🔴 | 11 |
| `@source inline("bg-red-500")` | memaksa kelas tertentu dibuat (v4) | 🟡 | 12 |
| `safelist` (v3) | daftar kelas yang selalu dibuat — **cara v3** | 🟡 | 12 |

> **🔴 `@apply` bukan "cara merapikan".** Ia mengembalikan nama kelas kabur yang menjadi
> masalah Unit 1. Untuk kelas yang panjang dan berulang, jawaban yang benar adalah
> **ekstrak komponen**, bukan `@apply`. (Unit 11, 15)
>
> **🔴 `dark:` diam-diam tidak berpengaruh** kalau mode gelap belum diaktifkan — dan itu
> **tidak** menghasilkan error. (Unit 10)

---

## J. Kelas yang SERING TIDAK BERFUNGSI — dan kenapa

Ringkasan cepat untuk tutor. Ini **daftar periksa pertama** saat pembelajar bilang
"kelasnya tidak berpengaruh".

| Gejala | Sebab paling sering | Unit |
|---|---|---|
| Warna hilang untuk sebagian nilai | Kelas dinamis `` `bg-${x}-500` `` → tidak ter-generate | **12** |
| Warna hilang untuk **semua** nilai | Tidak ada satu pun kelas tertulis utuh | **12** |
| Satu kelas "tidak berpengaruh" | Kelas lain **bertabrakan** (`p-2 p-4`) | **13** |
| Tidak ada efek sama sekali | Kelas **tidak ada** (`p-13`, `bg-blue-550`) | **13** |
| Tidak ada efek sama sekali | **Salah tulis varian** (`hover-bg-...` bukan `hover:bg-...`) | **13** |
| Di layar besar seperti ponsel | **Urutan breakpoint terbalik** | **9** |
| `dark:` tidak bekerja | Mode gelap belum diaktifkan | **10** |
| `group-hover:` tidak bekerja | Induk tidak punya kelas `group` | 8 |
| `disabled:` tidak bekerja | Elemennya bukan `<button>`/`<input>` | 8 |
| `mx-auto` tidak menengahkan | Tidak ada `w-*`/`max-w-*` | 5 |
| `mt-4` tidak menambah jarak | Ada `m-*` atau `space-y-*` yang menang | **13** |
| `absolute` "kabur" | Tidak ada induk `relative` | 4 |
| `truncate` tidak memotong | Di dalam `flex` tanpa `min-w-0` | 6 |
| Tidak bisa difokus dengan Tab | `<div onClick>`, bukan `<button>` | **14** |
| Fokus tidak terlihat | `outline-none` tanpa `ring` pengganti | **14** |
| `@apply` tidak berfungsi | Kelas tidak ada, atau urutan `@layer` salah | 11 |

> **Aturan untuk tutor:** kalau pembelajar bilang *"kelas ini tidak berpengaruh"*,
> **jangan langsung menyebut sebabnya.** Minta ia **menulis dugaan** dulu — itu latihan
> TELUSUR-nya. (Lihat `korpus-ai.md` §4(d))

---

## K. Yang SENGAJA tidak diajarkan — dan kenapa

| Topik | Kenapa tidak |
|---|---|
| **`tailwind.config.js` sebagai hal wajib** | v4 memakai `@theme` di CSS. Config masih ada untuk proyek lama — cukup **dikenali** |
| **`@layer components` + `@apply` sebagai pola utama** | Bukan cara berpikir Tailwind, dan bukan sumber masalah utama |
| **Animasi & transisi kompleks** (`animate-*`, keyframes) | Bukan sumber masalah utama; cukup dikenali |
| **Gradasi mendalam** (`from-`/`via-`/`to-`) | Cukup dikenali; jarang jadi sumber bug |
| **`container` queries** | Berguna, tapi menambah lapisan sebelum dasar kuat |
| **Plugin Tailwind (`@plugin`)** | Konteks lanjutan; bukan sumber bug pemula |
| **`@utility` (v4) untuk utility sendiri** | Berguna; belum dibutuhkan untuk **menilai** kode AI |
| **Prefiks (`tw:`)** | Konteks khusus (integrasi dengan CSS lain) |
| **Tailwind + framework lain** (Vue/Svelte/Astro) | Skill ini memakai React sebagai latihan; framework lain punya skill sendiri |
| **Sistem desain lengkap** (token, skala, tema perusahaan) | Itu ranah desain, bukan inspeksi kode |
| **Perbandingan dengan Bootstrap/MUI/CSS-in-JS** | Bukan materi, itu opini |
| **Build & optimasi CSS di produksi** | Ada di `/teach-nodejs` Unit 18 dan dokumentasi Vite |

> **Kalau pembelajar menemui salah satu topik ini di kode nyata dan tersandung** — itu
> **tanda daftar ini perlu ditinjau**, bukan tanda pembelajar kurang. Catat, lalu
> tambahkan dengan sumber yang diverifikasi.

---

## Cara memakai file ini (untuk tutor)

1. **Pembelajar bertanya** → cari kelasnya di sini → **sebut CSS aslinya** (termasuk
   angka px-nya) → sebut unit tempat ia dilatih → **lanjut**. Jangan menawarkan kelas lain.
2. **Tidak ada di sini?** → itu **celah**. Buka `tailwindcss.com/docs`, tambahkan
   barisnya, lalu jawab. Catat di `RESOURCES.md`.
3. **Bahaya 🔴** → boleh disebut singkat ("ini sering jadi sumber masalah"), tapi **tetap
   satu kelas**. Penjelasan mendalam menunggu unitnya.
4. **Bagian J** → ini **daftar periksa tutor**, **bukan** untuk dibacakan ke pembelajar.
   Ia memandu pertanyaan yang mempersempit, bukan jawaban.
5. **Jangan pernah** menyerahkan file ini ke pembelajar untuk dibaca sendiri.

**Aturan tunggal:** satu pertanyaan → satu kelas → CSS aslinya → lanjut.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `peta-unit.md` · `korpus-ai.md` · `teach-react/references/sintaks-react.md`
