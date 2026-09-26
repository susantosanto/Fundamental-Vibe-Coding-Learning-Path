# Peta Unit — Detail per Unit (React Mode Inspeksi)

> Referensi untuk skill `teach-react`. **Tutor membaca file ini sendiri** — pembelajar
> tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **18 unit · 4 bagian · 4 gerbang.** Bagian 0 = **prasyarat** HTML + CSS.
> Setiap unit: **konsep · sintaks yang dikenali · yang diajarkan · latihan inspeksi ·
> kriteria lulus · sumber.**
> Satu unit = 1–2 sesi × maks 1 jam.
>
> **Kamus sintaks lengkap ada di `sintaks-react.md`.** Baris *"Sintaks yang dikenali"* di
> tiap unit hanya menyebut yang paling sering muncul.

---

## Aturan umum semua unit

| | |
|---|---|
| Bentuk sesi | 6 tahap: PREDIKSI → JALANKAN → BEDAH → UBAH → [PERBAIKI] → CATAT |
| Alat | Editor + browser · Bagian 0: DevTools Inspector · Bagian 1–3: `npm run dev` + React DevTools |
| Korpus | **Kode hasil generate AI** (lihat `korpus-ai.md`) |
| Ukuran kode | Bagian 0: 5–15 baris. Bagian 1: 10–30 baris. Bagian 2: 30–80 baris. Bagian 3: 3–8 file. |
| Aturan mutlak | `prediksi.md` ditulis & disimpan **sebelum** kode dijalankan |
| Sumber sitasi | `react.dev: <halaman>` · `MDN: <topik>` · `WHATWG HTML` · `W3C CSS` · `PRIMM §<tahap>` |
| **Sintaks asing** | **JANGAN bilang "di luar materi"** → cek `sintaks-react.md`, jelaskan **satu bentuk**, lanjut |

**Cara memulai proyek (dilakukan tutor sekali, sebelum Bagian 1):**

```
npm create vite@latest proyek-vite -- --template react
cd proyek-vite && npm install && npm run dev
```

Sebutkan ke pembelajar **apa yang baru saja terjadi** (Vite = alat yang mengubah JSX jadi
JavaScript yang bisa dibaca browser) — tapi **jangan jadikan sesi sendiri**. Itu produksi,
bukan inspeksi.

---

# BAGIAN 0 — PRASYARAT: HTML + CSS (Unit 1–6)

> **Ini bukan pemanasan.** React adalah lapisan di atas HTML/CSS. Tanpa Bagian 0,
> setiap "kok tampilannya aneh" di React akan terasa seperti sihir.
> **Belum ada React, belum ada build tool** — hanya file `.html` dan `.css` yang dibuka
> di browser. Itu disengaja: satu hal pada satu waktu.

---

## Unit 1 — Struktur halaman

**Konsep:** HTML bukan teks berurutan. Ia **pohon elemen** — elemen di dalam elemen.
Bentuk tampilan datang dari susunan itu.

**Yang diajarkan tutor:**
- Tag pembuka & penutup, elemen, atribut (`class`, `id`, `href`, `src`)
- Elemen yang **bersarang**: `<ul>` berisi `<li>`, `<div>` berisi apa saja
- `div` dan `span` — dua elemen "tanpa arti" yang paling sering dipakai AI
- Kenapa "menutup tag yang salah" bisa membuat seluruh halaman berantakan

**Sintaks yang dikenali:** `<tag>` · `<tag attr="nilai">` · `class` · `id` · `div` · `span` ·
`ul`/`li` · `h1`–`h6` · `p` · `a` · `img`

**Latihan inspeksi:**
1. Beri potongan HTML 10 baris. **LACAK:** gambar pohonnya (siapa di dalam siapa).
2. **SUSUN:** baris diacak → susun ulang jadi pohon yang benar.
3. **KLAIM:** *"teks ini akan muncul sebagai daftar bernomor"* → verifikasi.

**Kriteria lulus:** bisa menggambar pohon elemen dengan benar untuk HTML 10 baris yang
belum pernah dilihat.

**Miskonsepsi yang paling sering muncul:**
- Mengira HTML itu "tulisan yang diwarnai", bukan struktur
- Mengira `<div>` punya arti khusus (tidak — ia hanya wadah)
- Mengira urutan tag tidak penting selama semua tertutup

**Sumber:** MDN: *HTML basics* · WHATWG HTML Living Standard

---

## Unit 2 — Selektor & gaya

**Konsep:** CSS **memilih** elemen, lalu memberi gaya. Kalau gayanya "tidak kena", itu
berarti selektornya tidak menunjuk elemen yang dimaksud.

**Yang diajarkan tutor:**
- Selektor tag (`p`), kelas (`.kartu`), id (`#utama`)
- Kenapa **kelas** yang dipakai, bukan id — dan kenapa AI sering mencampur keduanya
- **Spesifisitas dasar:** kenapa dua aturan bisa bertabrakan, dan mana yang menang
- Properti yang paling sering: `color`, `background`, `font-size`, `font-weight`, `display`

**Sintaks yang dikenali:** `p { }` · `.kelas { }` · `#id { }` · `p, h1 { }` ·
`.a .b { }` (di dalam) · `display: none` · `!important` (⚠️ tanda kode bermasalah)

**Latihan inspeksi:**
1. Beri potongan CSS 12 baris. Sebut elemen mana yang terkena tiap aturan.
2. **KLAIM:** *"semua kartu akan berlatar abu-abu"* → verifikasi (apakah selektornya
   `.kartu`, atau `#kartu` yang hanya satu elemen?).
3. **TELUSUR:** gaya tidak kena padahal aturannya ada — cari sebabnya (spesifisitas?
   nama kelas beda huruf besar/kecil?).

**Kriteria lulus:** dari 5 aturan CSS, bisa menyebut elemen mana yang terkena dan mana
yang tidak — tanpa membuka DevTools.

**Miskonsepsi yang paling sering muncul:**
- Mengira `.kartu` dan `#kartu` itu sama
- Mengira urutan penulisan selalu menentukan pemenang
- Mengira `!important` adalah solusi (itu tanda masalah)

**Sumber:** MDN: *CSS first steps*, *CSS selectors*, *Specificity*

---

## Unit 3 — Kotak

**Konsep:** setiap elemen adalah **kotak**, dan kotak itu punya empat lapis:
content → padding → border → margin. Sebagian besar "tampilan aneh" berakhir di sini.

**Yang diajarkan tutor:**
- Keempat lapis, dari dalam ke luar — dan bedanya
- **`box-sizing: border-box`** — kenapa hampir semua kode modern memakainya
- `width` vs lebar **total** (yang terlihat di layar)
- `margin: 0 auto` (memusatkan) · `gap` vs `margin`

**Sintaks yang dikenali:** `padding` · `margin` · `border` · `box-sizing` · `width`/`height` ·
`max-width` · `margin: 0 auto` · satuan `px` `rem` `%`

**Latihan inspeksi:**
1. Beri satu kotak dengan `padding` + `border` + `margin`. **Prediksi lebar totalnya**
   sebelum diperiksa di DevTools.
2. **KLAIM:** *"kotak ini lebarnya 300px"* → verifikasi. (Kalau `box-sizing` tidak
   diset, lebarnya 300 + padding + border.)
3. **TELUSUR:** dua kotak saling menempel padahal seharusnya berjarak — cari barisnya.

**Kriteria lulus:** bisa menghitung lebar total sebuah kotak dari CSS-nya, benar, untuk
3 dari 4 kasus.

**Miskonsepsi yang paling sering muncul:**
- Mengira `width` adalah lebar yang terlihat
- Mengira `padding` dan `margin` sama saja
- Mengira margin antar-elemen selalu dijumlahkan (tidak — ia bisa "runtuh")

**Sumber:** MDN: *The box model*, *box-sizing*

---

## Unit 4 — Susunan: flexbox

**Konsep:** elemen menumpuk ke bawah karena itu **perilaku bawaan**. Untuk menyusunnya
berdampingan, kamu harus **mengatakannya** — dan itu tugas `display: flex`.

**Yang diajarkan tutor:**
- `display: flex` pada **induk**, bukan anak — kenapa ini sering terbalik
- Arah: baris (bawaan) vs kolom
- `justify-content` (sepanjang arah) vs `align-items` (melintang) — dua hal berbeda
- `gap` (jarak) — cara modern, menggantikan `margin` per anak
- `flex: 1` (anak mengisi ruang sisa)

**Sintaks yang dikenali:** `display: flex` · `flex-direction` · `justify-content` ·
`align-items` · `gap` · `flex: 1` · `flex-wrap`

**Latihan inspeksi:**
1. **Prediksi di mana tiap kotak berakhir** sebelum dilihat di browser.
2. **UBAH:** tukar `justify-content` dan `align-items`. Prediksi lagi.
3. **KLAIM:** *"ketiga kotak akan berjajar dan membagi lebar sama rata"* → verifikasi.
4. **TELUSUR:** kotak tidak berjajar padahal `display: flex` sudah ada — cari sebabnya
   (dipasang di anak, bukan induk).

**Kriteria lulus:** bisa menggambar posisi akhir 3 kotak dari CSS flexbox-nya, benar,
tanpa membuka browser.

**Miskonsepsi yang paling sering muncul:**
- Memasang `display: flex` di anak, bukan induk
- Menukar peran `justify-content` dan `align-items`
- Mengira `align-items: center` memusatkan secara horizontal (tergantung arah)

**Sumber:** MDN: *Flexbox*, *Basic concepts of flexbox*

---

## Unit 5 — Susunan: grid & responsif

**Konsep:** flexbox menyusun **satu baris/kolom**. Grid menyusun **dua arah sekaligus**
— baris dan kolom. Dan halaman nyata harus berubah saat layarnya menyempit.

**Yang diajarkan tutor:**
- `display: grid` · `grid-template-columns` · `gap`
- `repeat(3, 1fr)` — artinya "tiga kolom sama rata"
- **`@media`** — aturan yang hanya berlaku pada lebar tertentu
- Satuan relatif: `rem` (ikut ukuran font dasar) vs `px` (mutlak) · `%` · `vw`
- Kenapa "tampilan di HP" bukan hiasan — aplikasi sekolah dibuka di HP juga

**Sintaks yang dikenali:** `display: grid` · `grid-template-columns` · `repeat()` · `1fr` ·
`@media (max-width: ...)` · `rem` · `%` · `vw`/`vh`

**Latihan inspeksi:**
1. **Prediksi:** pada lebar 500px, berapa kolom yang terlihat?
2. **UBAH:** ubah `max-width` di `@media`. Apa yang berubah?
3. **KLAIM:** *"tata letak ini akan tetap rapi di HP"* → verifikasi dengan menyempitkan
   jendela.

**Kriteria lulus:** bisa menyebut berapa kolom yang terlihat pada dua lebar layar berbeda,
dari membaca CSS-nya saja.

**Miskonsepsi yang paling sering muncul:**
- Mengira `1fr` itu "satu piksel" atau "satu kolom"
- Mengira `@media` mengubah HTML (ia hanya mengubah gaya)
- Mengira `rem` sama dengan `px`

**Sumber:** MDN: *CSS Grid Layout*, *Media queries*, *CSS values and units*

---

## Unit 6 — Bentuk & keadaan

**Konsep:** elemen bisa punya **keadaan** — normal, disorot, difokus, mati. Keadaan itu
diatur CSS, bukan JavaScript. Ini jembatan langsung ke React (Unit 9, 13).

**Yang diajarkan tutor:**
- `form`, `label`, `input`, `button` — dan kenapa `label` bukan hiasan
  (klik teks = fokus ke input; juga untuk pembaca layar)
- `type` pada input: `text`, `number`, `date`, `checkbox` — mengubah perilaku
- **Pseudo-class:** `:hover` (disorot) · `:focus` (dipilih) · `:disabled` (mati)
- Kenapa `input` tidak punya penutup `</input>` (elemen kosong)

**Sintaks yang dikenali:** `<form>` · `<label for="">` · `<input type="">` · `<button>` ·
`:hover` · `:focus` · `:disabled` · `cursor: pointer`

**Latihan inspeksi:**
1. **KLAIM:** *"tombol ini tidak bisa diklik"* → verifikasi (apakah ada `disabled`?).
2. **KLAIM:** *"mengetik di sini akan mengubah nilainya"* → verifikasi di Unit 13 nanti
   (`value` tanpa `onChange` = beku).
3. **TELUSUR:** klik label tidak memfokuskan input — cari baris penyebabnya (`for` tidak
   cocok dengan `id`).

**Kriteria lulus:** bisa menyebut **dua** keadaan yang berbeda untuk satu elemen, dan
baris CSS mana yang mengaturnya.

**Miskonsepsi yang paling sering muncul:**
- Mengira `label` hanya teks biasa
- Mengira `placeholder` sama dengan `value`
- Mengira `:hover` bekerja di layar sentuh (tidak selalu)

**Sumber:** MDN: *Web forms — your first form*, *Pseudo-classes*

### → GERBANG 1 setelah Unit 6

Lihat `roadmap-4-tingkat.md` §1. Satu halaman HTML + CSS ± 40 baris, belum pernah dilihat:
gambar pohon elemen · sebut elemen mana menghasilkan kotak mana · sebut satu baris CSS
yang paling merusak kalau dihapus. **Lulus kalau poin 1 dan 3 benar.**

---

# BAGIAN 1 — REACT DASAR (Unit 7–10)

---

## Unit 7 — Komponen & JSX

**Konsep:** komponen React **adalah fungsi** yang mengembalikan tampilan. JSX terlihat
seperti HTML, **tapi bukan HTML** — ia diterjemahkan menjadi pemanggilan fungsi JavaScript.

**Yang diajarkan tutor:**
- Komponen = fungsi, namanya **huruf besar** (itu bukan gaya penulisan, itu aturan)
- `return` mengembalikan **satu** elemen induk — kenapa dua elemen bersebelahan error
- **JSX ≠ HTML:** `class` jadi `className` · `for` jadi `htmlFor` · semua tag harus tertutup
- **`{ }` di dalam JSX** = "di sini JavaScript", bukan teks
- `<></>` (fragment) — pembungkus tak terlihat
- Kenapa komponen **dipanggil** oleh React, bukan oleh kita

**Sintaks yang dikenali:** `function Nama() { return (...) }` · `export default` ·
`className` · `{ekspresi}` · `<>...</>` · `<Komponen />` · `{/* komentar */}`

**Latihan inspeksi:**
1. **LACAK:** fungsi mana yang dipanggil React, apa yang dikembalikan.
2. **KLAIM:** *"komponen ini menampilkan dua paragraf"* → verifikasi (bisa jadi error
   karena dua elemen bersebelahan tanpa induk).
3. **SUSUN:** baris JSX diacak → susun ulang.
4. **TELUSUR:** halaman kosong tanpa error di console — cari barisnya (`return` hilang,
   atau mengembalikan `undefined`).

**Kriteria lulus:** bisa menyebut elemen apa yang dihasilkan sebuah komponen, dan
menunjuk satu perbedaan JSX vs HTML.

**Miskonsepsi yang paling sering muncul:**
- Mengira JSX itu HTML (lalu bingung kenapa `class` tidak bekerja)
- Menulis `{ }` di JSX untuk teks biasa
- Lupa `return` di fungsi komponen → halaman kosong, **tanpa error**

**Sumber:** react.dev: *Your First Component*, *Writing Markup with JSX*

---

## Unit 8 — Props

**Konsep:** props adalah **data yang masuk dari luar**. Komponen tidak boleh mengubah
props-nya — data mengalir **satu arah**, dari atas ke bawah.

**Yang diajarkan tutor:**
- `function Kartu({ judul, isi })` — destructuring di parameter (bentuk yang dipakai AI)
- Kenapa `<Kartu judul="A" />` dan `<Kartu judul={x} />` berbeda
- Props bersifat **hanya-baca** — React tidak melarang, tapi merusaknya bikin bug aneh
- **Nilai bawaan:** `function Kartu({ judul = "Tanpa judul" })`
- `children` — apa yang ada di antara tag pembuka & penutup

**Sintaks yang dikenali:** `({ a, b })` di parameter · `props.nama` · `{nilai}` vs `"teks"` ·
`children` · `{...props}`

**Latihan inspeksi:**
1. **LACAK:** nilai tiap prop untuk **dua pemakaian berbeda** dari komponen yang sama.
2. **KLAIM:** *"komponen ini menampilkan nama pengguna"* → verifikasi (apakah prop-nya
   dikirim, atau `undefined`?).
3. **TELUSUR:** teks di layar kosong padahal komponen dipanggil — cari sebabnya
   (nama prop beda huruf besar/kecil, atau `{ }` lupa dipakai).

**Kriteria lulus:** bisa menuliskan nilai setiap prop untuk dua pemakaian berbeda, benar,
tanpa menjalankan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `judul="x"` dan `judul={x}` sama
- Mengira props bisa diubah di dalam komponen
- Lupa `{ }` saat mengirim variabel → yang tampil teks nama variabelnya

**Sumber:** react.dev: *Passing Props to a Component*

---

## Unit 9 — State

**Konsep:** state adalah **memori komponen**. Mengubahnya **menggambar ulang** komponen.
State **bukan** variabel biasa — dan itulah sumber kebingungan terbesar di React.

**Yang diajarkan tutor:**
- `const [nilai, setNilai] = useState(awal)`
- Kenapa `let nilai = 0; nilai = 1` **tidak** mengubah layar — React tidak tahu
- **Menetapkan state = minta render ulang**, bukan mengubah nilai di tempat
- State bisa bertambah lewat **fungsi**: `setN(n => n + 1)` — kenapa bentuk ini lebih aman
- Aturan: panggil `useState` di **atas** komponen, jangan di dalam `if`/loop
- Satu komponen boleh punya beberapa state — dan itu normal

**⭐ Dua model mental yang WAJIB dinamai di unit ini** (react.dev punya halaman khusus untuk
keduanya — jangan dilewati, karena keduanya adalah dasar Unit 15):

1. **State adalah POTRET (snapshot), bukan variabel hidup.**
   Setiap render memegang **salinan nilainya sendiri**. Mengubah variabel di baris
   berikutnya **tidak** mengubah potret render yang sedang berjalan. Itulah kenapa React
   butuh `setNilai` — untuk **meminta potret baru**. Kalimat yang bisa dipakai tutor:
   *"Bayangkan tiap render adalah foto. `setNilai` tidak mengubah foto yang sedang kamu
   lihat — ia meminta React mengambil foto baru."*

2. **Dua fase: render lalu commit.**
   React **memanggil komponenmu dulu** (render), **baru setelah itu** mengubah layar
   (commit). Itulah kenapa perubahan **tidak** terlihat di baris yang sama saat `setNilai`
   dipanggil. Nama resminya di react.dev: *Render and Commit*.

> **Kenapa dua hal ini masuk Unit 9, bukan Unit 15?** Karena Unit 15 hanyalah **akibat
> lanjutan** dari keduanya. Kalau model potret sudah tertanam di Unit 9, Unit 15 berubah
> dari "menghafal jangan pakai `.push()`" menjadi "oh, tentu saja".

**⭐ Pertanyaan ketiga — mengantre (react.dev: *Queueing a Series of State Updates*)**

Ini pertanyaan yang paling sering membuat pembelajar menyimpulkan "React rusak":

> *"Saya panggil `setN(n + 1)` **dua kali**, kok angkanya cuma nambah 1?"*

Jawabannya bukan bug — ini **akibat langsung** dari model potret di atas. Karena `n` adalah
potret render yang sedang berjalan, **kedua baris itu mengirim nilai yang sama**:

```jsx
setN(n + 1);   // kirim 1
setN(n + 1);   // kirim 1 LAGI — bukan 2, karena n masih 0
// hasil: 1, bukan 2
```

React **mengantre** pembaruan, lalu menjalankannya berurutan saat render berikutnya. Dua
permintaan "jadikan 1" = satu hasil: 1.

**Bentuk yang benar — beri React fungsi, bukan nilai:**

```jsx
setN(n => n + 1);   // "tambahkan 1 ke nilai TERBARU di antrean"
setN(n => n + 1);   // hasil: 2
```

Kalimat yang bisa dipakai tutor: *"Kalau kamu menyebut nilainya, kamu menyebut potret yang
kamu pegang. Kalau kamu memberi fungsi, React yang membacakan potret terbaru dari antrean."*

**Aturan praktisnya:** kalau nilai baru **bergantung pada nilai lama** → selalu pakai
bentuk fungsi `setN(n => ...)`. Kalau tidak bergantung (mis. `setNama("Budi")`) → bentuk
biasa sudah aman.

**Latihan LACAK wajib untuk ketiga pertanyaan di atas:**

```markdown
# Kode A — bentuk nilai
const [n, setN] = useState(0)
function tambah() { setN(n + 1); setN(n + 1); }

# Kode B — bentuk fungsi
const [n, setN] = useState(0)
function tambah() { setN(n => n + 1); setN(n => n + 1); }

# Pertanyaan (jawab SEBELUM menjalankan)
1. Kode A: setelah satu klik, berapa angka di layar? Berapa kali render?
2. Kode B: setelah satu klik, berapa angka di layar? Berapa kali render?
# (jawaban: A → 1, render 1× · B → 2, render 1×)
```

**Sintaks yang dikenali:** `useState()` · `[nilai, setNilai]` · `setNilai(baru)` ·
`setN(n => n + 1)` · `onClick={() => ...}`

**Latihan inspeksi:**
1. **LACAK:** nilai state tiap render. Prediksi **berapa kali** komponen render.
2. **KLAIM:** *"menekan tombol ini akan menambah angka di layar"* → verifikasi.
3. **TELUSUR:** tombol ditekan, angka tidak berubah — cari sebabnya (memutasi, bukan
   menetapkan; atau menetapkan nilai yang sama).

**Kriteria lulus:** bisa menuliskan urutan nilai state untuk 3 kali klik, benar, tanpa
menjalankan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `nilai = 1` mengubah layar
- Mengira `setNilai` langsung mengubah variabel di baris itu juga
- Mengira `useState` bisa dipanggil di dalam `if`
- Mengira state itu **variabel hidup** yang bisa dibaca "nilai terbarunya" kapan saja
  (padahal tiap render memegang potretnya sendiri) ← ini akar Unit 15 & 16

**Sumber:** react.dev: *State: A Component's Memory*, ***State as a Snapshot***,
*Render and Commit*, *Queueing a Series of State Updates*

---

## Unit 10 — Daftar & key

**Konsep:** menampilkan banyak data = `.map()` di dalam JSX. Dan setiap item butuh
**`key`** — bukan hiasan, tapi cara React mengenali item mana yang mana.

**Yang diajarkan tutor:**
- `{daftar.map(item => <li key={item.id}>{item.nama}</li>)}`
- Kenapa `.map()` di JSX **wajib** mengembalikan nilai (jangan pakai `{ }` tanpa `return`)
- **`key` harus unik dan stabil.** Indeks array **tidak** stabil saat urutan berubah
- Kenapa `key` yang salah membuat data "tertukar" — bug yang tidak error
- Daftar kosong: `.map()` pada `undefined` → **error**. Ini kasus batas #1
- **`key` punya DUA fungsi** (react.dev: *Preserving and Resetting State*):
  1. **Mengenali** item mana yang mana di dalam daftar — ini yang sudah di atas
  2. **MERESET state** sebuah komponen saat `key`-nya berubah. React menyimpan state
     selama komponen tetap di posisi yang sama; mengganti `key` = memaksa komponen itu
     dibuang & dibuat ulang dari nol, state-nya ikut kosong.

> **Kenapa fungsi kedua penting untuk inspeksi?** Karena ia sering muncul di kode AI
> secara **tidak sengaja**: `key={Math.random()}` atau `key={item.nama}` pada data yang
> namanya bisa berubah → komponen di-reset terus, isian pengguna **hilang tiap kali**
> data berubah. Ini cacat 🔴 yang **tidak error** — dan hanya bisa dikenali kalau
> pembelajar tahu `key` punya fungsi kedua.

**Sintaks yang dikenali:** `.map()` di JSX · `key={}` · `(item, index)` ·
`daftar.length === 0` · `daftar?.map()` · `&&` untuk percabangan di JSX ·
`key={Math.random()}` (⚠️ mereset terus) · `key={item.nama}` (⚠️ reset saat nama berubah)

**Latihan inspeksi:**
1. **KLAIM:** *"daftar ini akan tetap benar setelah diurutkan ulang"* → verifikasi
   (kalau `key={index}`, klaimnya **salah**).
2. **KLAIM:** *"komponen ini aman kalau datanya kosong"* → verifikasi (`.map()` pada
   `undefined` → error).
3. **TELUSUR:** data tertukar setelah daftar disaring — cari barisnya (`key` indeks).
4. **TELUSUR (reset):** pembelajar mengetik di satu baris daftar, lalu data diperbarui —
   isiannya **hilang sendiri**. Cari barisnya (`key` berubah nilainya).
   ← ini latihan yang menguji fungsi kedua `key`

**Kriteria lulus:** bisa menyebut kenapa `key={index}` berbahaya, bisa menunjuk satu tempat
di mana `.map()` bisa error karena data kosong, **dan** bisa menjelaskan kenapa mengganti
`key` bisa membuat isian pengguna hilang.

**Miskonsepsi yang paling sering muncul:**
- Mengira `key` hanya untuk menghilangkan peringatan di console
- Memakai indeks sebagai `key` karena "lebih mudah"
- Mengira `.map()` aman kalau datanya belum datang
- Mengira `key` hanya soal daftar (padahal ia juga **mereset state**)

**Sumber:** react.dev: *Rendering Lists*, *Keeping Components Pure*,
***Preserving and Resetting State***

### → GERBANG 2 setelah Unit 10

Lihat `roadmap-4-tingkat.md` §2. Komponen ± 30 baris dengan dua state dan satu `.map()`:
lacak nilai tiap state dan prop **pada setiap render**. **Lulus kalau ≥ 50% benar.**

---

# BAGIAN 2 — REACT MENENGAH (Unit 11–14)

---

## Unit 11 — Efek samping

**Konsep:** `useEffect` bukan "kode yang jalan setelah render". Ia **menyelaraskan**
komponen dengan sesuatu di luar React (server, waktu, penyimpanan). Salah paham soal ini
menghasilkan efek yang jalan terus-menerus.

**Yang diajarkan tutor:**
- `useEffect(() => { ... }, [])` — kenapa `[]` berarti "sekali saja"
- **Dependency array** = "jalan lagi kalau ini berubah". Bukan daftar hiasan.
- Kenapa menghapus dependency membuat efek jalan **tiap render** (dan bisa jadi loop)
- **Cleanup** (`return () => ...`) — kenapa perlu saat berlangganan / timer
- **Kapan TIDAK perlu `useEffect`** — kalau nilainya bisa dihitung saat render, hitung saja.
  react.dev secara eksplisit menulis *"You Might Not Need an Effect"*.

**Sintaks yang dikenali:** `useEffect(() => {}, [])` · `useEffect(() => {}, [x])` ·
`return () => {}` (cleanup) · `setInterval`/`clearInterval` · `AbortController`

**Latihan inspeksi:**
1. **LACAK:** untuk 3 variasi dependency array, **prediksi berapa kali** efek jalan.
2. **KLAIM:** *"efek ini hanya jalan sekali"* → verifikasi.
3. **TELUSUR:** aplikasi makin lambat tiap detik — cari barisnya (efek tanpa cleanup, atau
   dependency yang berubah tiap render).

**Kriteria lulus:** bisa menuliskan berapa kali sebuah efek jalan untuk 3 variasi
dependency array, benar, tanpa menjalankan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `useEffect` selalu jalan sekali
- Mengira dependency array adalah "daftar variabel yang saya pakai" (ia **daftar pemicu**)
- Menaruh semua logika di dalam `useEffect` padahal bisa dihitung saat render

**Sumber:** react.dev: *Synchronizing with Effects*, *Removing Effect Dependencies*,
*You Might Not Need an Effect*

---

## Unit 12 — Mengambil data

**Konsep:** mengambil data dari luar punya **empat keadaan**, bukan dua. Sebagian besar
kode AI hanya menangani satu.

**Yang diajarkan tutor:**
- Empat keadaan: **loading · error · kosong · ada isi.** Semuanya harus punya tampilan.
- `fetch` + `async`/`await` di dalam komponen
- Kenapa `await` yang **hilang** menghasilkan `undefined` yang muncul belakangan
- Kenapa `async` **tidak boleh** langsung dipasang di `useEffect`
  (harus fungsi di dalam, lalu dipanggil)
- Kenapa "loading tidak pernah berhenti" adalah gejala klasik `await` hilang
- Membatalkan permintaan saat komponen hilang (cleanup) — cukup dikenali

**Sintaks yang dikenali:** `async`/`await` · `fetch()` · `.json()` · `try/catch` ·
`useState(null)` untuk loading · `if (error)` · `if (data.length === 0)`

**Latihan inspeksi:**
1. **KLAIM:** *"loading akan berhenti setelah data datang"* → verifikasi.
2. **KLAIM:** *"kalau server mati, pengguna akan melihat pesan"* → verifikasi
   (biasanya tidak ada `catch`, jadi layar kosong selamanya).
3. **TELUSUR:** aplikasi jalan, tidak error, tapi layar kosong selamanya — cari barisnya
   (`await` hilang / `setLoading(false)` ada di tempat yang tidak pernah tercapai).

**Kriteria lulus:** bisa menyebut **empat** keadaan data, dan menunjuk satu tempat di mana
`await` yang hilang membuat hasilnya salah.

**Miskonsepsi yang paling sering muncul:**
- Mengira "berhasil atau gagal" hanya dua keadaan (ada loading & kosong)
- Mengira `fetch` mengembalikan data langsung (ia mengembalikan janji)
- Mengira `async` boleh langsung jadi callback `useEffect`

**Sumber:** react.dev: *You Might Not Need an Effect* → *Fetching data* ·
MDN: *Using Fetch*, *Promises*

---

## Unit 13 — Form terkendali

**Konsep:** di React, nilai input **dikendalikan oleh state**. Kalau kamu memberi `value`
tanpa `onChange`, React akan terus mengembalikannya ke nilai itu — kotaknya **beku**.

**Yang diajarkan tutor:**
- `value={nilai} onChange={e => setNilai(e.target.value)}` — pasangan yang tidak boleh dipisah
- Kenapa `value` tanpa `onChange` = input yang tidak bisa diketik (**dan tidak error**)
- `onSubmit` + `e.preventDefault()` — kenapa halaman "refresh sendiri" tanpa ini
- Validasi: kapan di `onChange`, kapan di `onSubmit`
- Kenapa form laporan keuangan wajib memikirkan input yang salah

**Sintaks yang dikenali:** `value={}` · `onChange={e => ...}` · `e.target.value` ·
`onSubmit` · `e.preventDefault()` · `type="number"`

**Latihan inspeksi:**
1. **KLAIM:** *"input ini bisa diketik"* → verifikasi.
2. **KLAIM:** *"menekan kirim tidak akan memuat ulang halaman"* → verifikasi
   (`preventDefault` ada?).
3. **TELUSUR:** input bisa diketik, tapi nilai yang dikirim selalu nilai awal — cari
   barisnya (`onChange` menulis ke state yang salah, atau `value` dari state lain).

**Kriteria lulus:** bisa menyebut kenapa `value` tanpa `onChange` membuat input beku, dan
menunjuk satu tempat di mana `preventDefault` seharusnya ada.

**Miskonsepsi yang paling sering muncul:**
- Mengira `value` hanya "nilai awal"
- Mengira `e.target.value` selalu ada (untuk `checkbox` beda: `e.target.checked`)
- Mengira `preventDefault` tidak perlu karena "di React tidak apa-apa"

**Sumber:** react.dev: *Reacting to Input with State*, *Managing State → Updating Objects in State*

---

## Unit 14 — Menyusun aplikasi

**Konsep:** satu komponen besar bukan "kode yang lengkap" — ia kode yang sulit diperiksa.
Memecah komponen punya aturan, dan **state harus tinggal di tempat yang benar**.

**Yang diajarkan tutor:**
- Kapan memecah: kalau satu komponen punya **dua alasan berbeda untuk berubah**
- **"State naik" (lifting state up):** kalau dua komponen perlu data yang sama, state
  dinaikkan ke induk bersama
- Kenapa menaruh state **terlalu tinggi** juga salah (semua ikut render ulang)
- Struktur folder yang lazim di proyek AI: `components/`, `pages/`, `hooks/`
- Kenapa `App.jsx` yang menumpuk semuanya adalah tanda bahaya

**⚠️ Kapan state dipertahankan, kapan direset** (react.dev: *Preserving and Resetting
State*) — sub-kasus yang **belum** dibahas di Unit 10 (Unit 10 membahas `key`; di sini
masalahnya **posisi**).

React menyimpan state berdasarkan **posisi komponen di pohon**, bukan berdasarkan nama
variabel. Akibatnya:

| Yang terjadi di kode | Yang terjadi pada state |
|---|---|
| Komponen **disembunyikan** dengan `{tampil && <Form />}` lalu dimunculkan lagi | Statenya **hilang** — React membuang komponennya |
| Dua komponen **ditukar urutannya** di dalam induk yang sama | State bisa **tertukar** (React menganggapnya komponen yang sama, cuma pindah) |
| Komponen **dipindah** ke cabang `if`/`else` yang berbeda | React menganggapnya komponen **berbeda** → state direset |

**Gejala yang dilaporkan pembelajar:** *"isian saya hilang sendiri saat pindah tab"* ·
*"nilai di baris ini pindah ke baris lain"*.

**Perbaikannya:** kalau state memang harus bertahan → **naikkan** (lihat "state naik" di
atas) atau beri `key` yang stabil. Kalau state memang harus reset → itu sudah benar.

**Sintaks yang dikenali:** `export default function` · `import X from "./X"` ·
`<Komponen />` · props sebagai callback (`onUbah={setNilai}`) · folder `components/` ·
`{tampil && <Form />}` (⚠️ state di dalamnya hilang saat disembunyikan)

**Latihan inspeksi:**
1. Gambar **peta**: komponen mana merender komponen mana, state ada di mana.
2. **KLAIM:** *"mengubah nilai di sini akan memperbarui keduanya"* → verifikasi
   (apakah state-nya benar-benar di induk bersama?).
3. Cari satu state yang **seharusnya tidak** ada di tempatnya.
4. **TELUSUR (state hilang):** isian di sebuah form **hilang sendiri** saat pengguna
   berpindah tab di dalam aplikasi — cari baris penyebabnya (komponennya disembunyikan,
   bukan hanya digeser).

**Kriteria lulus:** bisa menggambar peta komponen + lokasi state dengan benar untuk proyek
3–6 komponen, **dan** bisa menyebut satu situasi di mana state akan hilang karena posisi.

**Miskonsepsi yang paling sering muncul:**
- Mengira memecah komponen selalu lebih baik (kadang menambah kerumitan)
- Mengira setiap komponen perlu state sendiri
- Mengira `props` bisa dipakai untuk mengirim data **naik** (tidak — hanya turun)
- Mengira state mengikuti **nama** komponen (tidak — ia mengikuti **posisi**)

**Sumber:** react.dev: *Sharing State Between Components*, *Thinking in React*,
*Managing State*, ***Preserving and Resetting State***

### → GERBANG 3 setelah Unit 14

Lihat `roadmap-4-tingkat.md` §3. Baca satu file komponen hasil AI: (a) apa yang
dilakukannya, (b) satu keputusan di dalamnya + kenapa, (c) satu cara ia bisa gagal.

---

# BAGIAN 3 — MEMBONGKAR REACT (Unit 15–18)

---

## Unit 15 — Kenapa layar tidak berubah ⭐

> **Penyebab #1 dari seluruh keluhan "React saya tidak jalan".** Unit paling penting
> di skill ini. Akarnya ada di `teach-javascript` Unit 8 (referensi vs nilai).

**Konsep:** React membandingkan **alamat** nilai, bukan isinya. Kalau kamu mengubah isi
array/object tanpa mengganti alamatnya, React menganggap **tidak ada yang berubah** —
dan tidak menggambar ulang.

**Yang diajarkan tutor:**
- `.push()`, `.sort()`, `.splice()`, `obj.prop = x` → **mengubah isi, alamat sama**
- Cara yang benar: **buat nilai baru** → `[...arr, item]`, `arr.filter(...)`,
  `{ ...obj, prop: x }`
- Kenapa ini berbahaya: **tidak ada error.** Tidak ada pesan merah. Hanya layar yang salah.
- `.map()` / `.filter()` **mengembalikan array baru** → aman
  `.sort()` / `.push()` **mengubah array aslinya** → berbahaya
- Versi aman: `.toSorted()` / `.toReversed()` (ES2023)
- Ini juga **akar bug React nomor satu yang dilaporkan** — dan alasannya
  `teach-javascript` Unit 8 jadi prasyarat

**Sintaks yang dikenali:** `.push()` `.pop()` `.sort()` `.splice()` `.reverse()` ·
`[...arr]` · `{...obj}` · `.map()` `.filter()` `.concat()` · `.toSorted()` · `setArr([...arr, x])`

**Latihan inspeksi:**
1. **Prediksi:** setelah `arr.push(x)`, apakah layar berubah? Tulis **sebelum** menjalankan.
2. **KLAIM:** *"menekan tombol ini akan menambah item ke daftar"* → verifikasi.
3. **TELUSUR:** tombol ditekan, tidak terjadi apa-apa, **tidak ada error** — cari barisnya.
   (Protokol 5 langkah. Ini latihan TELUSUR paling penting di seluruh skill.)
4. **UBAH:** ganti `.push()` jadi `[...arr, x]`. Jalankan lagi.

**Kriteria lulus:** bisa menunjukkan, tanpa menjalankan, **dua tempat** di mana state
dimutasi sehingga React tidak akan menggambar ulang.

**Miskonsepsi yang paling sering muncul:**
- Mengira "sudah saya ubah datanya" sama dengan "React akan tahu"
- Mengira `.sort()` mengembalikan array baru (ia mengubah yang asli)
- Mengira bug ini akan muncul sebagai error (tidak — diam total)

**Sumber:** react.dev: *Updating Objects in State*, *Updating Arrays in State* ·
`teach-javascript` Unit 8 · MDN: *Array.prototype.sort()* (memutasi)

---

## Unit 16 — Render berlebih & ketergantungan

**Konsep:** komponen React bisa **jalan terlalu sering** — dan itu sumber kedua keluhan
"React saya tidak jalan". Ia juga tempat **stale closure** muncul kembali.

**Yang diajarkan tutor:**
- **Infinite loop:** `useEffect` tanpa dependency yang menetapkan state yang dipakai efek itu
- Kenapa "loop tak berujung" terlihat sebagai aplikasi yang **makin lambat**, bukan error
- **Stale closure:** nilai di dalam callback/efek "ketinggalan" dari render sebelumnya
  (ini `teach-javascript` Unit 9 muncul di React)
- Kenapa menghapus dependency array **bukan** solusi (itu menyembunyikan masalah)
- **Render berlebih bukan selalu bug** — React memang murah. Tapi loop **selalu** bug.
- `useMemo`/`useCallback`/`memo` — **cukup dikenali**, bukan dioptimasi di sini
  (lihat `sintaks-react.md` §E)
- **`ref` tidak memicu render** — `ref.current = x` menyimpan nilai **tanpa** menggambar
  ulang. Ini **bukan** bug (ref memang begitu), tapi gejalanya **mirip** Unit 15 —
  dan itu justru kesempatan menguji apakah pembelajar sudah bisa membedakan
  "sengaja" dari "cacat"
- **`<StrictMode>` menjalankan efek DUA KALI di mode dev** — React sengaja menguji apakah
  efekmu bersih. Pembelajar sering mengira kodenya rusak. **Kodenya tidak rusak.**

**Sintaks yang dikenali:** `useEffect(() => {}, [x])` · `setX` di dalam efek ·
`useCallback` · `useMemo` · `memo()` · `setInterval` tanpa `clearInterval` ·
`useRef()` · `ref.current` · `<StrictMode>`

**Latihan inspeksi:**
1. **LACAK:** berapa kali komponen render setelah satu klik? Prediksi dulu.
2. **KLAIM:** *"efek ini jalan sekali saat komponen muncul"* → verifikasi.
3. **TELUSUR:** aplikasi makin lambat dan CPU naik — cari baris penyebabnya.
4. **TELUSUR (stale):** tombol menampilkan angka yang ketinggalan satu langkah — cari
   barisnya.
5. **BEDAKAN:** diberi dua potongan kode — satu memakai `ref.current = x` (sengaja, bukan
   bug), satu memutasi state (cacat). Mana yang cacat, dan **kenapa**? ← ini menguji
   apakah Unit 15 benar-benar dipahami, bukan dihafal

**Kriteria lulus:** bisa menunjuk satu baris yang menyebabkan loop, dan bisa menjelaskan
kenapa menghapus dependency array bukan solusi.

**Miskonsepsi yang paling sering muncul:**
- Mengira "komponen render banyak kali" selalu masalah
- Mengira menghapus dependency array menyelesaikan loop
- Mengira `useMemo`/`useCallback` wajib dipakai di mana-mana (tidak — dan salah pakai
  bisa memperburuk)

**Sumber:** react.dev: *Removing Effect Dependencies*, *You Might Not Need an Effect* ·
`teach-javascript` Unit 9 (closure) · `sintaks-react.md` §F

---

## Unit 17 — Review sebagai PR

**Konsep:** inspeksi berujung pada **keputusan**. "Terima" dan "tolak" dua-duanya sah —
yang tidak sah adalah menerima tanpa alasan.

**Yang diajarkan tutor:**
- Bentuk review: **klaim → bukti → risiko → keputusan**
- Kenapa "sudah saya jalankan dan jalan kok" **bukan** bukti (lihat Unit 18)
- Kenapa "tidak ada error di console" **bukan** bukti — Unit 15 & 16 keduanya tanpa error
- **Cacat aksesibilitas wajib dicurigai** — karena inilah kelas cacat yang paling sering
  lolos dari AI, dan paling tidak terlihat di layar:
  - `<div onClick={...}>` alih-alih `<button>` → tak bisa dipakai keyboard
  - `<img>` tanpa `alt` → tak terbaca pembaca layar
  - `<label>` yang tidak terhubung ke `id` input → klik teks tidak memfokuskan
  Cukup **mengenali & menyebut** — tidak perlu memperbaiki di sini
  (audit aksesibilitas lengkap ada di skill `/accessibility-audit`)
- Menolak dengan alasan jelas = **lulus**. Menerima tanpa alasan = **gagal**.

**Sintaks yang dikenali:** tidak ada sintaks baru — ini unit keputusan.
Yang dicurigai: `<div onClick={...}>` · `<img>` tanpa `alt` · `<label>` tanpa `for`

**Latihan inspeksi:**
1. Beri satu komponen React + satu kalimat klaim tentang apa yang dilakukannya.
2. Tulis review berisi: (a) apakah klaimnya benar + bukti, (b) satu cacat/risiko,
   (c) **keputusan terima/tolak + alasan**.
3. Tukar peran: pembelajar menjelaskan, tutor jadi pemeriksa yang mencari cacat.
4. **Cari cacat aksesibilitas:** diberi komponen yang "berjalan sempurna" dengan mouse —
   temukan satu cacat yang hanya terlihat kalau dipakai dengan **keyboard** (Tab/Enter).

**Kriteria lulus:** keputusan beralasan. **Menolak komponen yang sebenarnya baik dengan
alasan jelas = LULUS.** Menerima komponen buruk tanpa alasan = gagal.

**Sumber:** Addy Osmani — *Agentic Code Review* (*"the hard part of engineering moved
from writing code to deciding whether..."*) · `AGENTS.MD` repo

---

## Unit 18 — Perbaiki tanpa merusak

**Konsep:** memperbaiki satu komponen sambil **membuktikan** komponen lain tidak rusak.

**Yang diajarkan tutor:**
- Kenapa "sudah saya cek, jalan kok" bukan bukti
- Cara memeriksa dampak: **siapa lagi yang memakai komponen/prop/state ini?**
- **Regression:** kerusakan yang muncul **belakangan** — saat komponen lain merender
- Kenapa memperbaiki `key` bisa mengubah urutan, dan memperbaiki dependency bisa
  membuat efek jalan di waktu yang salah

**Sintaks yang dikenali:** tidak ada sintaks baru — ini unit dampak

**Latihan inspeksi:**
1. Beri komponen yang perlu diubah (bukan bug — perubahan permintaan).
2. Ubah. Lalu **buktikan** bagian lain tidak rusak — dengan menjalankan & mengamati,
   bukan mengklaim.
3. Jawab: *"komponen lain mana yang memakai ini, dan apakah mereka masih benar?"*

**Kriteria lulus:** perubahan selesai **dan** ada bukti nyata (layar / output) bahwa
bagian lain masih bekerja. Klaim tanpa bukti = tidak lulus.

**Sumber:** `AGENTS.MD` repo (bukti, bukan klaim) · react.dev: *Keeping Components Pure*

### → GERBANG 4 setelah Unit 18

Lihat `roadmap-4-tingkat.md` §4. Tiga bagian: (a) statis — temukan & perbaiki;
(b) dinamis — TELUSUR dengan minimal dua dugaan tertulis; (c) review — keputusan + alasan.

---

## Setelah Gerbang 4

Yang sudah bisa dilakukan pembelajar:

- Membaca HTML/CSS dan tahu **dari mana bentuknya datang**
- Membaca komponen React dan tahu **apa yang terjadi tiap render**
- Melacak nilai state & props tanpa menjalankan
- Menemukan cacat **dengan membaca** (statis)
- **Menelusuri sebab** saat tampilannya salah, walau tidak ada error (dinamis)
- **Memperbaiki**, dan membuktikan perbaikannya tidak merusak
- Menulis review berisi keputusan yang beralasan
- Menjawab **"kenapa layar tidak berubah?"** dengan menunjuk barisnya

**Ini titik "mahir" untuk tujuan MISSION.** Kalau pembelajar ingin lanjut:
→ `/teach-system-design` di `belajar-arsitektur/` (merancang sistem, bukan komponen)

**Yang SENGAJA tidak diajarkan** (dan kenapa) ada di `cakupan-vs-dokumen-resmi.md` §6 —
Next.js, React Server Components, Redux/Zustand, React Router, TanStack Query,
`useMemo`/`useCallback` sebagai optimasi, testing library, Suspense, Server Actions.
Semuanya karena **menambah beban tanpa menambah kemampuan** untuk tujuan ini.
