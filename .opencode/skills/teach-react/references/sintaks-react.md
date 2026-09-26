# Kamus Sintaks — HTML, CSS & JSX yang muncul di kode hasil AI

> **Untuk siapa:** **tutor**, bukan pembelajar. Tutor membaca ini sendiri, lalu menjelaskan
> (lihat §MODE PENYAMPAIAN di `SKILL.md`).
>
> **Kenapa file ini ada:** kode React hasil generate AI memakai `className`, `{ }` di dalam
> tag, `&&` untuk percabangan, `.map()`, `?.`, dan `style={{ }}` **sejak baris pertama**.
> Ditambah HTML/CSS yang punya `display: flex` dan `grid-template-columns` di mana-mana.
> Pembelajar yang belum pernah melihatnya akan **macet di baris 1** — bukan karena
> konsepnya sulit, tapi karena bentuknya asing.
>
> **Aturan pakai:** kalau pembelajar bertanya *"tanda ini apa?"*, **jangan bilang "itu di
> luar materi"**. Cek file ini, jelaskan **satu bentuk** dalam 1–2 kalimat, kaitkan ke unit
> tempat ia dilatih, lalu lanjut. **Satu bentuk per kejadian** — jangan menumpuk.

**Tingkat bahaya** = seberapa sering bentuk ini jadi sumber bug yang *tidak terlihat*.
🔴 tinggi · 🟡 sedang · ⚪ rendah (aman, hanya perlu dikenali).

> **Batas kejujuran:** tingkat bahaya ini **penilaian**, bukan hasil riset terukur.
> Dasarnya: frekuensi kemunculan di kode hasil AI + apakah bugnya menimbulkan error atau
> tidak. Untuk React, kolom 🔴 hampir selalu berarti **"hasil salah tanpa error"**.

---

## A. HTML — struktur & atribut

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `<tag>` … `</tag>` | Elemen: pembuka + isi + penutup | `<p>Halo</p>` | 🟡 | 1 |
| `<tag attr="nilai">` | Atribut = keterangan tambahan | `<a href="/x">` | ⚪ | 1 |
| `<div>` | Wadah **tanpa arti** — paling sering dipakai AI | `<div class="kartu">` | ⚪ | 1 |
| `<span>` | Wadah **sebaris** (di dalam teks) | `<span class="tebal">` | ⚪ | 1 |
| `class="..."` | Nama untuk CSS. **Satu elemen boleh punya beberapa** | `class="kartu aktif"` | ⚪ | 1, 2 |
| `id="..."` | Nama **unik** satu elemen di halaman | `id="total"` | 🟡 | 1, 2 |
| `<ul>` / `<ol>` / `<li>` | Daftar (tak bernomor / bernomor / itemnya) | `<ul><li>a</li></ul>` | ⚪ | 1 |
| `<h1>`–`<h6>` | Judul bertingkat | `<h2>Laporan</h2>` | ⚪ | 1 |
| `<a href="...">` | Tautan | `<a href="/guru">` | ⚪ | 1 |
| `<img src="..." alt="...">` | Gambar. **`alt` bukan hiasan** — untuk pembaca layar | `<img src="a.jpg" alt="Foto">` | 🟡 | 1 |
| `<input>` `<img>` `<br>` | **Elemen kosong** — tidak punya penutup | `<input type="text">` | 🟡 | 1, 6 |
| `<form>` | Pembungkus input yang dikirim bersama | `<form>…</form>` | 🟡 | 6 |
| `<label for="x">` | Teks label; klik = fokus ke input ber-`id="x"` | `<label for="nama">` | 🟡 | 6 |
| `<button type="submit">` | Tombol pengirim form | `<button>Simpan</button>` | 🟡 | 6, 13 |
| **`<div onClick={...}>`** | **BUKAN tombol** — tak bisa dijangkau Tab/Enter, tak dikenali pembaca layar | `<div onClick={simpan}>` | 🔴 | 17 |
| `<table>` `<tr>` `<td>` `<th>` | Tabel: baris, sel, sel judul | `<tr><td>1</td></tr>` | ⚪ | 1 |
| `<section>` `<article>` `<nav>` `<header>` | Elemen **bermakna** (semantic) | `<section>` | ⚪ | 1 |

> 🟡 **Elemen kosong yang diberi penutup = kesalahan yang membuat struktur berantakan.**
> `<input></input>` salah. `<br></br>` salah. `<img>` selalu kosong.
>
> 🟡 **Tag yang tidak tertutup bisa merusak SELURUH halaman**, bukan hanya satu baris.
> Ini pengalaman pertama yang bagus untuk Unit 1 — gejalanya jauh dari sebabnya.
>
> 🔴 **`<div onClick={...}>` — cacat aksesibilitas yang paling sering lolos dari kode AI.**
> Di layar ia **terlihat seperti tombol**, bisa diklik dengan mouse, dan **tidak memunculkan
> error apa pun**. Tapi ia tidak bisa dijangkau dengan **Tab**, tidak bisa ditekan dengan
> **Enter**, dan tidak dikenali **pembaca layar**. Yang benar: `<button>`.
> Ini contoh sempurna pola yang diajarkan skill ini — **salah, tapi tidak berbunyi**.
> Dicurigai di Unit 17 (review); audit aksesibilitas lengkap ada di `/accessibility-audit`.

---

## B. CSS — selektor & properti dasar

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `p { }` | Selektor **tag** — kena semua `<p>` | `p { color: red }` | ⚪ | 2 |
| `.kelas { }` | Selektor **kelas** — ini yang seharusnya dipakai | `.kartu { }` | ⚪ | 2 |
| `#id { }` | Selektor **id** — hanya satu elemen | `#total { }` | 🟡 | 2 |
| `p, h1 { }` | Beberapa selektor sekaligus | `.a, .b { }` | ⚪ | 2 |
| `.a .b { }` | **Keturunan** — `.b` di dalam `.a` (**ada spasi**) | `.kartu .judul` | 🟡 | 2 |
| `.a.b { }` | **Dua kelas pada satu elemen** (**tanpa spasi**) | `.kartu.aktif` | 🔴 | 2 |
| `.a > .b { }` | **Anak langsung** saja | `.kartu > .judul` | 🟡 | 2 |
| `* { }` | Semua elemen | `* { box-sizing: border-box }` | 🟡 | 3 |
| `color` / `background` / `font-size` / `font-weight` | Warna teks, latar, ukuran, ketebalan | `font-weight: 600` | ⚪ | 2 |
| `text-align` | Perataan teks mendatar | `text-align: center` | ⚪ | 2 |
| `line-height` | Jarak antar-baris | `line-height: 1.5` | ⚪ | 2 |
| `text-decoration` | Garis bawah pada teks | `text-decoration: none` | ⚪ | 2 |
| `:hover` / `:focus` / `:disabled` | **Keadaan** elemen | `button:hover { }` | ⚪ | 6 |
| `cursor: pointer` | Kursor berubah jadi tangan | — | ⚪ | 6 |
| `!important` | Memaksa aturan menang | `color: red !important` | 🔴 | 2 |
| `display: none` | Hilang **dan** tidak makan tempat | — | 🟡 | 2 |
| `visibility: hidden` | Tak terlihat **tapi masih makan tempat** | — | 🟡 | 2 |
| `opacity: 0` | Transparan, masih bisa diklik | — | 🟡 | 2 |
| `overflow: hidden` / `auto` | Isi yang keluar kotak: dipotong / bisa digulir | — | 🟡 | 5 |
| `box-shadow` / `border-radius` | Bayangan / sudut membulat | `border-radius: 8px` | ⚪ | 2 |
| `transition` / `transform` | Perubahan halus / geser-putar-skala | `transition: all .2s` | ⚪ | — |
| `position: relative` / `absolute` / `fixed` / `sticky` | Cara mengeluarkan elemen dari aliran normal | `position: absolute` | 🔴 | — |
| `top` / `right` / `bottom` / `left` | Posisi — **hanya bekerja kalau `position` diset** | `top: 0` | 🔴 | — |
| `z-index` | Tumpukan mana di depan | `z-index: 10` | 🟡 | — |
| `flexbox` / `grid` (nilai `display`) | Lihat bagian C | — | 🟡 | 4, 5 |

> 🔴 **`.a .b` vs `.a.b`** — beda **satu spasi**, artinya sangat berbeda. Yang pertama
> "b di dalam a", yang kedua "elemen yang punya dua kelas". Kode AI sering keliru di sini,
> dan gayanya cuma "tidak kena" — **tanpa error**.
>
> 🔴 **`!important` adalah tanda masalah, bukan solusi.** Kalau muncul di kode AI, itu
> petunjuk kuat bahwa ada konflik spesifisitas yang tidak diselesaikan.
>
> 🔴 **`position: absolute` tanpa induk ber-`position: relative`** akan "lari" ke seluruh
> halaman. Ini bug tampilan yang sangat sering dan tidak menimbulkan error.

---

## C. CSS — tata letak (flexbox, grid, responsif)

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `padding` | Ruang **di dalam** kotak (antara isi & tepi) | `padding: 12px` | 🟡 | 3 |
| `margin` | Ruang **di luar** kotak (jarak ke tetangga) | `margin: 8px` | 🟡 | 3 |
| `border` | Garis tepi | `border: 1px solid #ccc` | ⚪ | 3 |
| `box-sizing: border-box` | **Lebar sudah termasuk** padding + border | `* { box-sizing: border-box }` | 🔴 | 3 |
| `width` / `height` | Lebar / tinggi | `width: 300px` | 🟡 | 3 |
| `max-width` | Batas atas lebar (aman untuk layar kecil) | `max-width: 900px` | ⚪ | 3 |
| `margin: 0 auto` | Memusatkan kotak secara horizontal | — | ⚪ | 3 |
| `px` / `rem` / `%` / `vw` / `vh` | Satuan: mutlak / ikut font dasar / relatif induk / relatif layar | `font-size: 1.25rem` | 🟡 | 5 |
| `display: flex` | Menyusun **anak** berdampingan. **Ditaruh di INDUK** | `.baris { display: flex }` | 🟡 | 4 |
| `flex-direction` | Arah: baris (bawaan) atau kolom | `flex-direction: column` | ⚪ | 4 |
| `justify-content` | Perataan **sepanjang arah** | `justify-content: space-between` | 🟡 | 4 |
| `align-items` | Perataan **melintang** arah | `align-items: center` | 🟡 | 4 |
| `gap` | Jarak antar-anak — cara modern | `gap: 16px` | ⚪ | 4 |
| `flex: 1` | Anak **mengisi ruang sisa** | `flex: 1` | 🟡 | 4 |
| `flex-wrap` | Anak boleh turun baris | `flex-wrap: wrap` | ⚪ | 4 |
| `display: grid` | Menyusun **dua arah** (baris & kolom) | `.kisi { display: grid }` | 🟡 | 5 |
| `grid-template-columns` | Jumlah & lebar kolom | `grid-template-columns: 1fr 1fr` | 🟡 | 5 |
| `repeat(3, 1fr)` | "Tiga kolom sama rata" | `repeat(3, 1fr)` | 🟡 | 5 |
| `1fr` | **Satu bagian** ruang yang tersedia | `grid-template-columns: 1fr 2fr` | 🔴 | 5 |
| `@media (max-width: 600px)` | Aturan yang hanya berlaku di lebar ≤ 600px | `@media (max-width: 600px) { }` | 🟡 | 5 |

> 🔴 **`box-sizing` — penyebab #1 dari "kok lebar kotak ini beda dari yang saya tulis".**
> Kalau tidak diset `border-box`, `width: 300px` berarti **isi** 300px; lebar yang terlihat
> di layar = 300 + padding + border. Hampir semua kode modern menyetel
> `* { box-sizing: border-box }` di awal.
>
> 🔴 **`1fr` bukan "satu piksel" dan bukan "satu kolom"** — ia "satu bagian dari ruang
> yang tersisa". `1fr 2fr` = kolom kedua dua kali lebih lebar.
>
> 🟡 **`display: flex` ditaruh di ANAK, bukan INDUK** → tidak terjadi apa-apa. Tidak error,
> hanya kotak yang tidak berjajar. Ini miskonsepsi flexbox nomor satu.
>
> 🟡 **`@media` tidak mengubah HTML** — ia hanya mengubah gaya. Kalau elemennya tidak ada
> di HTML, `@media` tidak akan memunculkannya.

---

## D. JSX — bentuk khusus React

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `className="..."` | Pengganti `class` di JSX (**wajib**) | `<div className="kartu">` | 🔴 | 7 |
| `htmlFor="..."` | Pengganti `for` di JSX | `<label htmlFor="nama">` | 🟡 | 7 |
| `{ekspresi}` | **"Di sini JavaScript"**, bukan teks | `<h1>{nama}</h1>` | 🟡 | 7 |
| `{/* komentar */}` | Komentar di dalam JSX | — | ⚪ | 7 |
| `<>…</>` | **Fragment** — pembungkus tak terlihat | `return (<><A/><B/></>)` | 🟡 | 7 |
| `<Komponen />` | Pakai komponen. **Huruf besar itu aturan, bukan gaya** | `<Kartu />` | 🔴 | 7 |
| `return (...)` | Komponen mengembalikan **satu** elemen induk | — | 🔴 | 7 |
| `{nilai}` vs `"teks"` | Variabel vs teks harfiah | `judul={x}` vs `judul="x"` | 🔴 | 8 |
| `{...props}` | Sebarkan semua properti objek jadi atribut | `<X {...props} />` | 🟡 | 8 |
| `children` | Isi di antara tag pembuka & penutup | `<Kartu>isi</Kartu>` | 🟡 | 8 |
| `style={{ color: "red" }}` | Gaya **inline** — objek, nama properti **camelCase** | `style={{ fontSize: 14 }}` | 🟡 | 7 |
| `onClick={...}` | Penangan kejadian | `onClick={() => setN(n+1)}` | 🟡 | 9 |
| `<div onClick={...}>` | ⚠️ **Bukan tombol** — tak bisa dipakai dengan keyboard | `<div onClick={simpan}>` | 🔴 | 17 |
| `<img>` tanpa `alt` | ⚠️ Tak terbaca pembaca layar | `<img src="a.jpg">` | 🔴 | 1, 17 |
| `{kondisi && <X />}` | Tampilkan `X` kalau kondisi benar | `{aktif && <B />}` | 🔴 | 10 |
| `{kondisi ? <A/> : <B/>}` | Pilih satu dari dua | `{ada ? <A/> : <B/>}` | 🟡 | 10 |
| `.map()` di dalam `{ }` | Menampilkan daftar | `{arr.map(x => <li>{x}</li>)}` | 🔴 | 10 |
| `key={...}` | Identitas tiap item daftar | `key={item.id}` | 🔴 | 10 |
| `onChange={e => ...}` | Reaksi saat nilai input berubah | `onChange={e => setN(e.target.value)}` | 🔴 | 13 |
| `value={...}` | Nilai input **dikendalikan state** | `value={nama}` | 🔴 | 13 |
| `e.target.value` / `e.target.checked` | Nilai input teks / status centang | — | 🔴 | 13 |
| `e.preventDefault()` | Mencegah perilaku bawaan (form memuat ulang halaman) | `onSubmit={e => {e.preventDefault()}}` | 🔴 | 13 |
| `disabled={...}` | Mematikan elemen | `disabled={!valid}` | ⚪ | 6 |
| `dangerouslySetInnerHTML` | Menyisipkan HTML mentah | ⚠️ | 🔴 | — |

> 🔴 **`className`, bukan `class`.** React **tidak error** kalau salah — ia hanya
> **mengabaikan** atributnya, jadi gayanya hilang tanpa pesan apa pun.
>
> 🔴 **`{nilai}` vs `"teks"`** — `<Kartu judul="nama" />` mengirim teks harfiah `"nama"`.
> Yang diinginkan hampir selalu `<Kartu judul={nama} />`. Bug ini menghasilkan teks yang
> terlihat aneh, bukan error.
>
> 🔴 **`{0 && <X />}` akan menampilkan angka `0`**, karena `0` itu falsy tapi tetap
> "dicetak" React. Jebakan klasik untuk nilai jumlah/harga yang bisa nol.
> (`{jumlah > 0 && <X />}` aman.)
>
> 🔴 **`style` butuh DUA kurung kurawal** — yang luar = "ini JavaScript", yang dalam =
> "ini objek". Nama properti **camelCase**: `fontSize`, bukan `font-size`.
>
> 🔴 **`value` tanpa `onChange` = input beku.** React terus mengembalikannya ke nilai itu,
> jadi pembelajar mengetik dan tidak ada yang muncul. **Tanpa error di console.**

---

## E. React — hook & pola

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `useState(awal)` | Memori komponen | `const [n, setN] = useState(0)` | 🔴 | 9 |
| `const [nilai, setNilai]` | Pasangan: nilai + fungsi pengubahnya | — | 🟡 | 9 |
| `setNilai(baru)` | **Minta render ulang**, bukan ubah di tempat | `setN(nama)` | 🔴 | 9 |
| `setN(n => n + 1)` | Bentuk aman saat bergantung nilai sebelumnya | `setN(n => n+1)` | 🔴 | 9 |
| `useEffect(() => {}, [])` | Efek yang jalan **sekali** setelah render pertama | — | 🔴 | 11 |
| `useEffect(() => {}, [x])` | Efek yang jalan lagi **saat `x` berubah** | — | 🔴 | 11 |
| `useEffect(() => {}, )` | **Tanpa array** → jalan **tiap render** (bisa loop) | — | 🔴 | 11, 16 |
| `return () => { }` di dalam efek | **Cleanup** — dijalankan sebelum efek berikutnya | — | 🟡 | 11 |
| `useRef()` | Nilai yang **tidak** memicu render; sering untuk elemen DOM | `const r = useRef(null)` | 🟡 | 16 |
| `useReducer()` | State kompleks dengan satu fungsi pengubah | — | 🟡 | — |
| `useContext()` | Data dari induk jauh tanpa mengoper props | — | 🟡 | — |
| `useMemo()` / `useCallback()` | Menyimpan hasil / fungsi agar tidak dihitung ulang | — | 🟡 | 16 (cukup dikenali) |
| `memo()` | Komponen tidak render ulang kalau props sama | `export default memo(X)` | 🟡 | 16 (cukup dikenali) |
| `useTransition()` / `useDeferredValue()` | Menandai pembaruan yang tidak mendesak | — | ⚪ | — |
| `createRoot(...).render(...)` | Titik masuk React di `main.jsx` | — | ⚪ | 7 |
| `<StrictMode>` | **Di mode dev, komponen & efek dijalankan DUA kali** | — | 🔴 | 11, 16 |
| `export default` / `import X from "./X"` | Menghubungkan antar-file | `import Kartu from "./Kartu"` | 🟡 | 14 |
| `props.onUbah` (callback sebagai prop) | Mengirim fungsi **turun** ke anak | `onUbah={setNama}` | 🟡 | 14 |

> 🔴 **`<StrictMode>` menjalankan komponen & efek DUA kali di mode development.**
> Ini **bukan bug** — React sengaja melakukannya untuk menemukan efek yang tidak bersih.
> Pembelajar yang tidak tahu akan mengira kodenya rusak. **Sebut ini di Unit 11.**
>
> 🔴 **Array dependency bukan "daftar variabel yang saya pakai"** — ia **daftar pemicu**
> ("jalan lagi kalau ini berubah"). Salah paham ini menghasilkan loop dan efek yang jalan
> terus.
>
> 🟡 **`useMemo`/`useCallback`/`memo` bukan "optimasi wajib".** Keduanya bisa menambah
> kerumitan tanpa manfaat kalau dipakai tanpa alasan. Untuk tujuan skill ini:
> **cukup dikenali**, tidak dioptimasi (lihat bagian F).

---

## F. Yang SENGAJA tidak diajarkan — dan kenapa

Bukan karena sulit, tapi karena **tidak melayani tujuan** (membaca & menilai kode React
hasil AI), atau karena menambah beban tanpa menambah kemampuan.

| Topik | Kenapa dilewati |
|---|---|
| **Next.js** | Bukan React — framework di atasnya (routing, server). Skill terpisah |
| **React Server Components / Server Actions** | Butuh pemahaman server; bukan sumber bug yang dihadapi pembelajar sekarang |
| **Redux / Zustand / Jotai** | Bukan prasyarat untuk **membaca** kode React. Menambah lapisan konsep |
| **React Router** | Topik routing, bukan topik inspeksi komponen |
| **TanStack Query / SWR** | Library pengambilan data. Unit 12 sudah cukup untuk memahami polanya |
| **`useMemo`/`useCallback`/`memo` sebagai optimasi** | Bukan sumber bug utama (Unit 16). Cukup dikenali |
| **Testing library (RTL, Vitest)** | Menulis test = produksi, bukan inspeksi |
| **Suspense / `lazy` / Error Boundary** | Fitur lanjutan; jarang jadi sumber kebingungan awal |
| **`useContext` secara mendalam** | Cukup dikenali. Unit 14 mengajarkan "state naik" yang lebih dasar |
| **CSS-in-JS (styled-components, emotion)** | Pilihan gaya, bukan konsep React |
| **TailwindCSS** | Materi tersendiri (direncanakan). Bagian 0 skill ini mengajarkan CSS dulu |
| **TypeScript** | Bahasa lain. Bisa ditambahkan setelah dasar ini kokoh |
| **Portals / `useImperativeHandle` / `useLayoutEffect` / `useSyncExternalStore`** | Dipakai penulis library, bukan pembaca kode aplikasi |
| **Animasi (framer-motion, GSAP)** | Pustaka pihak ketiga, bukan React |
| **`dangerouslySetInnerHTML` secara mendalam** | Cukup dikenali sebagai **tanda bahaya** (risiko XSS) |
| **Menghafal seluruh daftar hook** | Bisa dicari; AI sudah tahu. Yang dilatih: **mengenali & mencurigai** |

**Prinsipnya:** kamus ini untuk **mengenali**, bukan menghafal. Kalau sebuah bentuk muncul
dan pembelajar bisa menjawab *"ini apa, dan apa risikonya"* — itu sudah cukup.

---

## Cara memakai file ini (untuk tutor)

```
1. Pembelajar bertanya "tanda ini apa?"
   → cari di tabel, jelaskan SATU bentuk, 1–2 kalimat, kaitkan ke unit.

2. Kamu mau menyiapkan korpus latihan
   → pilih 1 bentuk 🔴 dari tabel, sisipkan ke kode latihan
     (lihat korpus-ai.md §3 — cacat khas kode React hasil AI).

3. Pembelajar bertanya "apakah saya harus hafal semua ini?"
   → TIDAK. Yang perlu: mengenali bentuk, dan tahu mana yang berbahaya.
     Menghafal sintaks bukan tujuan — mencurigainya yang tujuan.
```

**Referensi:** react.dev §Describing the UI / §Adding Interactivity · react.dev
§Reference: Hooks · MDN: *HTML basics*, *CSS selectors*, *The box model*, *Flexbox*,
*CSS Grid Layout* · `cakupan-vs-dokumen-resmi.md` (audit lengkap cakupan materi)

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `peta-unit.md` · `korpus-ai.md` · `teach-javascript/references/sintaks-modern.md`
