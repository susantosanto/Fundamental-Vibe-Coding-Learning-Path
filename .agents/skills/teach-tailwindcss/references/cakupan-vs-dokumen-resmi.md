# Cakupan vs Dokumen Resmi — apakah materi ini selengkap tailwindcss.com & MDN?

> Referensi untuk skill `teach-tailwindcss`. **Tutor membaca file ini sendiri.**
>
> **Dibuat:** 26 September 2026 · **Audit dilakukan:** 26 September 2026
> **Kerangka asal:** `teach-react/references/cakupan-vs-dokumen-resmi.md`

---

## 1. Kenapa "selengkap tailwindcss.com" bukan target yang benar

Pertanyaan yang wajar: *"apakah materinya sudah selengkap dokumentasi resmi?"*

Jawabannya: **tidak, dan memang tidak boleh.**

| | Dokumentasi resmi (`tailwindcss.com/docs`) | Kurikulum (skill ini) |
|---|---|---|
| Tujuan | **Referensi** — satu halaman per topik, untuk dipakai saat sudah tahu apa yang dicari | **Kurikulum** — berurutan, untuk orang yang belum tahu apa pun |
| Ukuran | **Ratusan halaman** kelas, dikelompokkan per sifat CSS | 15 unit, 4 gerbang |
| Bentuk | **Katalog kelas** (mis. satu halaman untuk semua `padding`) | **Urutan kemampuan**, bukan urutan kelas |
| Kalau tidak lengkap | **Cacat** — ada kelas yang tidak bisa ditemukan | **Bukan cacat** — ia sengaja memilih |
| Yang penting | Kelengkapan | **Bisa dipakai** |

Kurikulum yang "lengkap" adalah kurikulum yang **tidak selesai dibaca**. Ini pengalaman
langsung di repo ini: `fase-0-peta-belajar/` pernah dibangun 19 file dengan router,
diagnostik, dan empat jalur — dan hasilnya **tidak bisa dipakai**.

> **Prinsipnya:** kelengkapan bukan pengganti kejelasan. Materi yang bisa dipakai lebih
> berharga daripada materi yang lengkap.

Maka file ini **tidak** mengejar kelengkapan. Ia melakukan tiga hal:

1. **Mengaudit** — memeriksa sumber resminya **satu per satu**, bukan dari ingatan
2. **Menyebut celah nyata** — dan **menambalnya**, bukan hanya melaporkannya
3. **Menyatakan apa yang sengaja dilewati** — beserta alasannya, supaya keputusan itu
   bisa dibantah

---

## 2. Audit 1 — `tailwindcss.com/docs`

**Sumber yang dibuka:** `https://tailwindcss.com/docs/installation`,
`https://tailwindcss.com/docs/display`, `https://tailwindcss.com/docs/theme` —
26 Sep 2026.

### ⚠️ Yang TIDAK bisa diaudit — dan ini harus dikatakan

**Sidebar dokumentasi Tailwind tidak bisa dibaca.** Ia **dirender di sisi klien**
(JavaScript), sehingga alat pengambil halaman hanya menerima **isi artikel**, bukan
navigasinya. Upaya lain juga gagal:

| Upaya | Hasil |
|---|---|
| `tailwindcss.com/docs` | Mengembalikan halaman *installation*, bukan daftar isi |
| `tailwindcss.com/docs/theme` | Hanya isi artikel; sidebar **tidak ada** |
| `tailwindcss.com/docs/display` | Hanya isi artikel + breadcrumb |
| `tailwindcss.com/sitemap.xml` | **404** |

**Konsekuensinya:** audit ini **tidak bisa** menyatakan "Tailwind punya N halaman
dokumentasi, dan kita mencakup M di antaranya". Yang **bisa** dinyatakan adalah apa yang
**berhasil dibuka**, dan apa yang **disimpulkan dari situ**.

> **Ini batas nyata, bukan kerendahan hati.** Kalau pembelajar bertanya *"apakah semua
> kelas Tailwind diajarkan?"*, jawabannya: **tidak**, dan file ini **belum punya bukti
> lengkap** untuk menyebut berapa banyak yang terlewat.

### Yang BERHASIL diverifikasi

| Halaman | Yang diambil | Dipakai di |
|---|---|---|
| `/docs/installation` | **5 jalur instalasi**: Using Vite · Using PostCSS · Tailwind CLI · Framework Guides · Play CDN | Unit 3 |
| `/docs/installation` | `@import "tailwindcss";` — sintaks v4 | Unit 3 |
| `/docs/installation` | `npm install tailwindcss @tailwindcss/vite` + plugin Vite | Unit 3 |
| `/docs/installation` | Contoh pertama: `class="text-3xl font-bold underline"` | Unit 3 |
| `/docs/display` | Halaman **`display`** berada di bagian **Layout** (dari breadcrumb) | Unit 4 |
| `/docs/display` | Kelas: `inline`, `block`, `inline-block`, `flow-root`, `flex`, `inline-flex`, `grid`, `inline-grid`, `contents`, `table`, `hidden` | Unit 4 |
| `/docs/display` | `sr-only` / `not-sr-only` untuk menyembunyikan secara visual | Unit 14 |
| `/docs/display` | Varian responsif: `md:inline-flex` | Unit 9 |
| `/docs/theme` | `@theme` — variabel tema lewat CSS (**ciri v4**) | Unit 10 |
| `/docs/theme` | Palet default memakai **`oklch()`** | Unit 6 |
| `/docs/theme` | `@layer theme, base, components, utilities;` | Unit 3, 11 |

### Yang DISIMPULKAN (dan dasarnya)

| Simpulan | Dasar |
|---|---|
| Versi yang didokumentasikan adalah **v4** | `@theme` (khusus v4) · konfigurasi lewat CSS (bukan `tailwind.config.js`) · `@import "tailwindcss"` (bukan `@tailwind base/components/utilities`) · `oklch()` di palet default |
| Struktur dokumentasi dikelompokkan **per sifat CSS** (Layout, dll.) | Breadcrumb `display - Layout - Tailwind CSS` |
| Varian responsif memakai prefix `md:` | Contoh di `/docs/display` |

> ⚠️ **Nomor versi tidak tertulis verbatim di halaman yang dibuka.** Simpulan "v4" dibuat
> dari **ciri-ciri**, bukan dari label. Ini dicatat supaya pembelajar bisa memeriksa
> sendiri — dan supaya tutor tidak mengklaim lebih dari yang benar-benar diperiksa.

---

## 3. Audit 2 — MDN, W3C CSS, WCAG (lapisan yang tidak ada di tailwindcss.com)

Tailwind mendokumentasikan **kelasnya sendiri**. Ia **tidak** mendokumentasikan CSS yang
disingkatnya, dan **tidak** mendokumentasikan kewajiban aksesibilitas. Empat di antaranya
wajib:

| Topik | Kenapa tailwindcss.com tidak mendokumentasikannya | Sumber yang dipakai | Di mana |
|---|---|---|---|
| **CSS dasar** (box model, flex, grid) | Tailwind hanya memberi **nama pendek**; CSS-nya milik W3C | MDN: *The box model*, *Flexbox*, *CSS Grid* | **Bagian 0** |
| **Spesifisitas & cascade** | Sama — itu aturan CSS | MDN: *Specificity*, *Cascade* | Unit 1, 13 |
| **Aksesibilitas** | Ada halaman singkat di Tailwind, tapi kewajibannya milik WCAG | MDN: *Accessibility* · **WCAG 2.2 (W3C)** | **Unit 14** |
| **Semantik HTML** | Tailwind tidak mengatur elemen mana yang benar | MDN: *HTML elements reference* | Unit 14 |

**Kenapa ini penting:** tanpa lapisan ini, pembelajar hanya bisa **menghafal kelas** —
ia tidak bisa **memprediksi** tampilan, dan tidak bisa tahu kapan tampilan itu **tidak
bisa dipakai**. Dua hal itu adalah inti skill ini.

---

## 4. Yang benar-benar hilang — dan sudah ditambal

Saat audit, **lima hal** tidak ada di sumber resmi **sebagai materi yang diajarkan**
(walaupun topiknya disebut). Semuanya sudah ditambal — bukan hanya dilaporkan.

### Celah 1 — Kelas dinamis: disebut sebagai *fitur*, bukan sebagai *jebakan*

**Masalah:** Tailwind punya halaman tentang cara ia memindai kelas. Tapi halaman itu
**menjelaskan cara kerja**, bukan **mengajarkan bahayanya**. Akibatnya: pembelajar tahu
Tailwind "memindai file", tapi **tidak menghubungkan** itu dengan "kenapa warna saya
hilang".

**Tambalan:** **Unit 12** — dijadikan unit **paling penting** (⭐⭐), dengan gejala yang
dinamai, **empat** cara memperbaiki, dan **dua** latihan TELUSUR. Ditambah baris 🔴 di
`sintaks-tailwind.md` §J.

### Celah 2 — Konflik kelas: ada aturannya, tidak ada cara debug-nya

**Masalah:** dokumentasi menjelaskan bahwa urutan kelas di HTML tidak menentukan pemenang.
Tapi tidak ada yang mengajarkan: *"jadi bagaimana cara menemukan kenapa `mt-4` saya tidak
berpengaruh?"*

**Tambalan:** **Unit 13** — dengan tabel tiga sebab, dan `sintaks-tailwind.md` §J sebagai
**daftar periksa pertama** untuk tutor.

### Celah 3 — Cacat yang tidak terlihat

**Masalah:** Tailwind punya halaman *accessibility*, tapi singkat. Tidak ada yang
mengajarkan hal yang justru paling berbahaya: **tampilan yang salah bisa terlihat
sempurna**. `<div onClick>` tampak seperti tombol; `text-gray-400` tampak "elegan".

**Tambalan:** **Unit 14** (kontras WCAG 4.5:1, fokus, elemen semantik, `sr-only`),
ditambah **`korpus-ai.md` §6** dengan aturan untuk tutor: **pilih cacat yang tidak
kentara**.

### Celah 4 — Kapan BERHENTI memakai utility

**Masalah:** dokumentasi menjelaskan `@apply` dengan netral — *"ini cara memakainya"*.
Tidak ada yang menyatakan bahwa memakainya sebagai kebiasaan **mengembalikan** masalah
yang Tailwind selesaikan.

**Tambalan:** **Unit 11** (kapan `@apply` **tepat**: gaya bawaan pihak ketiga; kapan
**salah**: "merapikan") dan **Unit 15** (jawaban yang benar untuk kelas berulang:
**ekstrak komponen**).

### Celah 5 — Mode gelap yang diam-diam tidak bekerja

**Masalah:** dokumentasi menjelaskan `dark:`. Tapi tidak menekankan bahwa kalau mode gelap
**belum diaktifkan**, kelasnya **diam-diam tidak berpengaruh** — tanpa error.

**Tambalan:** **Unit 10** — dengan dua cara mengaktifkan, dan penekanan bahwa
**pilihan cara** itu menentukan apakah tombol mode gelap buatan sendiri akan bekerja.

---

## 5. Versi: v3 vs v4 — kenapa ini penting

Tailwind v4 mengubah **cara konfigurasi** dan **beberapa nama skala**. Ini bukan detail —
kalau pembelajar memakai v3, sebagian materi akan **salah**.

| | v3 | v4 |
|---|---|---|
| Memuat Tailwind | `@tailwind base/components/utilities` | `@import "tailwindcss";` |
| Konfigurasi | `tailwind.config.js` | `@theme { }` di CSS |
| Mendaftar file | array `content` di config | **otomatis** |
| Palet warna | `rgb`/hex | **`oklch()`** |
| Plugin Vite | `tailwindcss` + PostCSS | `@tailwindcss/vite` |
| Kelas yang dipaksa dibuat | `safelist` di config | `@source inline(...)` |
| Nama skala bayangan/radius | `shadow`, `shadow-sm`, `rounded`, `rounded-sm` | `shadow-xs`, `shadow-sm`, `rounded-xs`, `rounded-sm` |

> ⚠️ **Baris terakhir perlu diverifikasi ulang.** Nama skala di v4 **bergeser** (mis.
> `shadow-sm` di v4 setara `shadow` di v3). File ini **mencatat pergeseran itu sebagai
> peringatan**, bukan sebagai daftar lengkap — karena **daftar resminya tidak berhasil
> dibuka saat audit**. Sebelum mengajarkan nama skala spesifik, **buka dokumentasi versi
> yang dipakai pembelajar.**

**Aturan praktis untuk tutor:** sebelum sesi Bagian 1, **cek versi** di `package.json`
pembelajar. Kalau `"tailwindcss": "^3..."`, sesuaikan Unit 3, 10, dan 11.

---

## 6. Yang SENGAJA tidak ditambahkan

Daftar lengkap beserta alasannya ada di **`sintaks-tailwind.md` §K**. Ringkasnya:

| Yang dilewati | Alasan satu baris |
|---|---|
| `tailwind.config.js` sebagai wajib | v4 memakai `@theme`; config untuk proyek lama — cukup dikenali |
| `@layer components` + `@apply` sebagai pola utama | Bukan cara berpikir Tailwind; bukan sumber masalah utama |
| Animasi & transisi kompleks | Bukan sumber masalah utama |
| Gradasi mendalam | Cukup dikenali |
| Container queries | Menambah lapisan sebelum dasar kuat |
| Plugin & `@utility` | Konteks lanjutan |
| Prefiks (`tw:`) | Konteks khusus |
| Tailwind + Vue/Svelte/Astro | Latihan memakai React; framework lain punya skill sendiri |
| Sistem desain lengkap | Ranah desain, bukan inspeksi |
| Perbandingan dengan Bootstrap/MUI | Itu opini, bukan materi |
| Optimasi CSS di produksi | Ada di `/teach-nodejs` Unit 18 |

**Aturan:** kalau pembelajar **menemui** salah satu topik ini di kode nyata dan tersandung,
itu **tanda daftar ini perlu ditinjau** — bukan tanda pembelajar kurang.

---

## 7. Bentuk akhir materi

```
15 unit · 4 bagian · 4 gerbang

Bagian 0 — PRASYARAT: CSS + cara kerja             Unit 1–3    → GERBANG 1
Bagian 1 — UTILITY INTI                            Unit 4–7    → GERBANG 2
Bagian 2 — VARIAN, RESPONSIF, TEMA                 Unit 8–11   → GERBANG 3
Bagian 3 — MEMBONGKAR & MENJAGA                    Unit 12–15  → GERBANG 4
```

| Berkas | Isi |
|---|---|
| `SKILL.md` | Router, asesmen, aturan sesi, anti-pattern, delegasi |
| `roadmap-4-tingkat.md` | Bagian, gerbang, bentuk sesi, aturan AI, batas kejujuran |
| `peta-unit.md` | Detail 15 unit: konsep, kelas, miskonsepsi, kriteria lulus |
| `korpus-ai.md` | Tangga korpus, **22 cacat khas kode Tailwind AI**, 4 latihan inspeksi |
| `sintaks-tailwind.md` | Kamus ±180 kelas → CSS asli + tingkat bahaya + **§J daftar periksa** |
| `cakupan-vs-dokumen-resmi.md` | File ini |

**Catatan bentuk:** jumlah unit di sini **15**, bukan 18 seperti `teach-react` dan
`teach-nodejs`. Itu **disengaja**: Tailwind lebih kecil dari React, dan **menambal angka
supaya sama** justru melanggar prinsip "kelengkapan bukan pengganti kejelasan".

---

## 8. Batas kejujuran

- **Sidebar dokumentasi Tailwind TIDAK bisa dibaca** (dirender di sisi klien), dan
  `sitemap.xml` mengembalikan **404**. Maka audit ini **tidak bisa** menyatakan berapa
  banyak halaman yang tercakup dari berapa banyak yang ada. Yang diaudit adalah
  **tiga halaman** yang berhasil dibuka.
- **Nomor versi tidak tertulis verbatim** di halaman yang dibuka. Simpulan "v4" dibuat
  dari **ciri-ciri** (`@theme`, `@import "tailwindcss"`, `oklch()`, `@tailwindcss/vite`).
- **Nama skala `shadow-*`/`rounded-*` di v4 belum diverifikasi** dari dokumentasi resmi.
  Yang dicatat adalah **peringatan bahwa ada pergeseran** dari v3 — bukan daftar lengkap.
- **Angka px** di `sintaks-tailwind.md` mengasumsikan **font akar 16px** (bawaan browser).
  Kalau pembelajar mengubah ukuran font akar, angkanya berubah.
- **Angka breakpoint dalam px** adalah **konversi** dari nilai `rem` di dokumentasi resmi.
- **Pemilihan 15 unit belum diuji.** Ia disusun dari **sumber masalah yang paling sering
  dilaporkan** — bukan dari studi urutan pembelajaran Tailwind.
- **Tingkat bahaya 🔴🟡⚪ adalah penilaian, bukan hasil riset.**
- **Ambang 50% tracing** dari studi 2004, konteks kurikulum universitas, dan konteksnya
  **melacak kode** — bukan menerjemahkan kelas CSS. Adaptasi ke Gerbang 2 skill ini
  **belum teruji**.
- **Angka industri** (Stack Overflow 66%/45%) berasal dari survei dengan populasi berbeda.
  Dipakai sebagai **indikasi arah**, bukan bukti sebab-akibat.
- **Protokol 5 langkah TELUSUR bukan dari satu sumber tunggal.** Ia disusun dari praktik
  debug yang lazim (hipotesis → uji → persempit) dan diselaraskan dengan temuan RCT
  Anthropic bahwa debugging adalah titik terlemah. **Belum diuji sebagai metode.**
- **Bagian 0 (CSS) 3 unit mungkin terlalu sedikit.** Kalau di praktiknya pembelajar masih
  tersandung CSS, **tambahkan** — jangan paksakan lanjut.
- **Daftar "sengaja dilewati" bisa salah.** Ia keputusan, dan keputusan bisa dibantah.
- **Yang TIDAK diaudit di sini:** halaman `tailwindcss.com` selain tiga di atas, dan
  `mdn.mozilla.org`/`w3.org`. Ketiganya dipakai sebagai rujukan, tapi **tidak dibuka
  ulang** saat audit ini.

### Sumber yang dibuka langsung saat audit

| URL | Yang diambil | Tanggal |
|---|---|---|
| `https://tailwindcss.com/docs/installation` | 5 jalur instalasi · `@import "tailwindcss"` · `@tailwindcss/vite` | 26 Sep 2026 |
| `https://tailwindcss.com/docs/display` | Daftar kelas `display` · `sr-only` · breadcrumb bagian **Layout** | 26 Sep 2026 |
| `https://tailwindcss.com/docs/theme` | `@theme` · `oklch()` · `@layer theme, base, components, utilities` | 26 Sep 2026 |
| `https://tailwindcss.com/sitemap.xml` | **404** — tidak ada | 26 Sep 2026 |
| Sidebar `/docs/*` | **Tidak tersedia** (dirender di sisi klien) | 26 Sep 2026 |
| `https://developer.mozilla.org/` (CSS, aksesibilitas) | Topik yang tidak dimiliki Tailwind | Tidak dibuka ulang — **dari daftar, belum diverifikasi** |
| `https://www.w3.org/WAI/WCAG22/` | Ambang kontras 4.5:1 | Tidak dibuka ulang — **dari daftar, belum diverifikasi** |

> ⚠️ **Dua baris terakhir itu penting.** MDN dan WCAG dipakai sebagai rujukan, tapi
> **tidak dibuka ulang** saat audit ini. Ia dicatat sebagai **terdaftar, belum
> diverifikasi** — supaya pembelajar bisa memeriksa sendiri, dan supaya tutor tidak
> mengklaim lebih dari yang benar-benar diperiksa.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `korpus-ai.md` · `sintaks-tailwind.md`
