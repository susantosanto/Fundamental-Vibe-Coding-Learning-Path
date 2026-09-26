# Korpus Kode Hasil AI — React (Cara Menyiapkan & Empat Latihan Inspeksi)

> Referensi untuk skill `teach-react`. **Tutor membacanya sendiri** — pembelajar tidak
> diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Kenapa file ini ada:** bagian yang paling sering hilang dari rencana belajar bukan
> *apa* yang dipelajari, tapi **dari mana kodenya diambil**. Kalau kode latihannya ditulis
> tutor sendiri, yang dilatih adalah "membaca kode yang rapi" — dan itu bukan kemampuan
> yang dibutuhkan.

---

## 1. Kenapa korpusnya HARUS kode hasil generate AI

Yang dihadapi pembelajar seumur hidup setelah ini adalah **kode hasil AI**. Dan ciri khas
kode AI bukan "jelas salah" — tapi **"hampir benar"**.

> Stack Overflow Developer Survey 2025 (~49.000 responden): frustrasi **nomor satu**
> developer terhadap AI adalah *"solutions that are **almost right, but not quite**"*
> — **66%** responden. Frustrasi kedua: *"debugging AI-generated code is more
> time-consuming"* — **45%**.

Untuk React, gejala "hampir benar" itu punya bentuk yang sangat khas — dan **hampir
selalu tanpa pesan error**:

| Gejala yang dilihat pembelajar | Yang sebenarnya terjadi |
|---|---|
| Tombol ditekan, layar tidak berubah | State dimutasi, bukan diganti (Unit 15) |
| Data tertukar setelah daftar disaring | `key={index}` (Unit 10) |
| Aplikasi makin lambat tiap detik | `useEffect` tanpa dependency / tanpa cleanup (Unit 11, 16) |
| Input tidak bisa diketik | `value` tanpa `onChange` (Unit 13) |
| Layar kosong, console bersih | `return` hilang, atau `.map()` pada data kosong (Unit 7, 10) |
| Angka yang tampil ketinggalan satu langkah | Stale closure (Unit 16) |

**Semuanya lolos dari "sudah saya jalankan, jalan kok".** Itulah alasan latihannya harus
memakai kode AI yang **terlihat benar**, bukan kode yang jelas rusak.

> Dasar riset tambahan: RCT Anthropic (Jan 2026, arXiv 2601.20245) — 52 engineer, grup
> yang memakai AI **50%** vs grup manual **67%** pada tugas yang sama; **gap terbesar
> justru di debugging**. Maka men-debug **tidak boleh** diserahkan ke AI.

---

## 2. Tangga korpus per bagian

| Bagian | Bentuk korpus | Ukuran | Yang dilatih |
|---|---|---|---|
| **0** (HTML/CSS) | Potongan HTML/CSS utuh | **5–15 baris** | Melihat dari mana bentuknya datang |
| **1** | **Satu komponen** | **10–30 baris** | Komponen, props, state, daftar |
| **2** | **Satu file komponen dengan hook** | **30–80 baris** | Efek, ambil data, form, susunan |
| **3** | **Proyek React multi-file** | **3–8 file** | Menilai sistem, bukan baris |

**Aturan ukuran (jangan dilanggar):** Bagian 0–1 **≤ 15 baris** per penjelasan.
Working memory pemula kecil — PRIMM menyebut ini *"learners' working memory is very small,
and we need to stay within it."*

**Catatan React:** di Bagian 0, korpusnya adalah **file `.html` + `.css` biasa** — belum ada
JSX, belum ada build tool. Itu disengaja: satu hal pada satu waktu.

---

## 3. Cara menyiapkan korpus + cacat khas kode React hasil AI

### Langkah 1 — Minta AI membuat sesuatu yang kecil dan biasa

Tugasnya harus **konkret dan membosankan**. Contoh yang cocok:

**Bagian 0 (HTML/CSS):**
- "kartu profil dengan foto, nama, dan tiga baris keterangan"
- "tabel daftar nilai dengan judul kolom"
- "form input nama dan tanggal dengan tombol simpan"

**Bagian 1–2 (React):**
- "komponen daftar belanja dengan tombol tambah dan hapus"
- "komponen yang menampilkan total setelah diskon dan berubah saat jumlah diubah"
- "komponen form input nama siswa dengan tombol simpan"
- "komponen yang mengambil daftar barang dari server dan menampilkannya"

**Bagian 3:** minta satu proyek kecil — "aplikasi catatan sederhana dengan tambah, hapus,
dan simpan ke penyimpanan browser".

### Langkah 2 — JANGAN dirapikan

**Ini bagian terpentingnya.** Kode AI yang sudah dibersihkan kehilangan gunanya.

**Cacat khas kode React hasil AI** — pilih **satu** per sesi:

| Cacat khas kode React hasil AI | Unit yang melatihnya |
|---|---|
| **State dimutasi langsung** (`arr.push()`, `arr.sort()`, `obj.x =`) → layar tidak berubah | **15** ⭐ |
| `key={index}` pada daftar yang bisa diurutkan/disaring → data tertukar | 10, 15 |
| `useEffect` tanpa dependency array yang benar → jalan tiap render / loop | 11, 16 |
| `useEffect` dipakai padahal nilainya bisa dihitung saat render | 11 |
| `useEffect` tanpa `return () => ...` saat pakai timer/langganan | 11, 16 |
| `value` tanpa `onChange` → input beku, **tanpa error** | 13 |
| `onChange` menulis ke state yang salah → nilai yang dikirim selalu nilai awal | 13 |
| `e.preventDefault()` hilang di `onSubmit` → halaman memuat ulang | 13 |
| `.map()` dengan `{ }` tapi lupa `return` → daftar kosong, **tanpa error** | 10 |
| `.map()` pada data yang belum datang (`undefined`) → **error** | 10, 12 |
| `await` hilang di rantai async → loading tidak pernah selesai | 12 |
| `async` langsung dipasang sebagai callback `useEffect` | 12 |
| `fetch` tanpa `catch` → layar kosong selamanya kalau server mati | 12 |
| Hanya dua keadaan (loading/selesai) → keadaan **kosong** & **error** tak tertangani | 12 |
| Props diubah di dalam komponen | 8 |
| Nama prop beda huruf besar/kecil → `undefined` | 8 |
| Lupa `{ }` saat mengirim variabel → yang tampil teks nama variabelnya | 8 |
| `return` hilang di fungsi komponen → halaman kosong, **tanpa error** | 7 |
| Dua elemen bersebelahan tanpa induk → **error** | 7 |
| `class` dipakai di JSX (harusnya `className`) | 7 |
| `useState` dipanggil di dalam `if` atau loop | 9 |
| State ditetapkan dengan nilai yang sama → tidak render ulang (kelihatan bug, padahal bukan) | 9 |
| `setNilai` dikira langsung mengubah variabel di baris itu | 9 |
| State ditaruh terlalu tinggi → semua komponen ikut render ulang | 14 |
| `App.jsx` menumpuk semuanya dalam satu file | 14 |
| `useMemo`/`useCallback` dipakai tanpa alasan → kerumitan tanpa manfaat | 16 |
| `onClick={handleClick()}` — **dipanggil**, bukan dioper → fungsi jalan saat render, bukan saat diklik | 9 |
| `key={Math.random()}` atau `key={item.nama}` → isian pengguna **hilang sendiri** tiap data berubah | 10 |
| **`<div onClick={...}>` alih-alih `<button>`** → terlihat seperti tombol, **tak bisa dipakai keyboard** | 17 |
| **`<img>` tanpa `alt`** → tak terlihat masalahnya; tak terbaca pembaca layar | 1, 17 |
| Tag HTML tidak tertutup → **seluruh halaman** berantakan | 1 |
| `!important` dipakai untuk menutupi masalah spesifisitas | 2 |
| `display: flex` dipasang di **anak**, bukan induk → tidak berjajar | 4 |
| `width` dikira lebar total (tanpa `box-sizing: border-box`) | 3 |
| `@media` dikira mengubah HTML (ia hanya mengubah gaya) | 5 |
| `label for` tidak cocok dengan `id` → klik label tidak memfokuskan input | 6, 17 |
| `placeholder` dikira `value` | 6 |
| **`<div onClick={...}>` alih-alih `<button>`** → tidak bisa dipakai dengan keyboard | 17 |
| **`<img>` tanpa `alt`** → tidak terbaca pembaca layar | 1, 17 |
| **`<div>` dipakai untuk judul, bukan `<h1>`–`<h6>`** → struktur halaman tidak terbaca | 1, 17 |

> **Kenapa tiga baris terakhir ada di sini:** ini kelas cacat yang **paling sering lolos
> dari AI** dan **paling tidak terlihat di layar** — kode "jalan sempurna" dengan mouse.
> Ia tidak error, tidak mengubah tampilan, dan tidak terdeteksi oleh "sudah saya coba,
> jalan kok". Cukup **dikenali & disebut** di Unit 17; perbaikan menyeluruh ada di skill
> `/accessibility-audit`.

> **Cara pakai tabel ini:** pilih **satu** cacat 🔴 dari `sintaks-react.md`, sisipkan ke kode
> latihan (atau temukan pada kode AI nyata), lalu arahkan ke unit yang melatihnya.
> **Jangan menumpuk dua cacat dalam satu sesi** — pembelajar akan berhenti melacak.

> ⚠️ **Tabel ini adalah penilaian, bukan hasil pengukuran.** Dasarnya: frekuensi kemunculan
> di kode hasil AI + apakah bugnya menimbulkan error atau tidak. Kalau di proyek nyata
> ditemukan cacat React yang tidak ada di daftar ini — **tambahkan ke sini**, itu tanda
> daftarnya perlu diperbarui.

### Langkah 3 — Potong sesuai bagian

- **Bagian 0:** ambil 5–15 baris HTML/CSS saja.
- **Bagian 1:** satu komponen utuh, lengkap dengan pemakaiannya (`<Kartu ... />`).
- **Bagian 2:** satu file komponen dengan hook — boleh ada komentar AI yang berlebihan.
- **Bagian 3:** 3–8 file yang saling mengimpor (`App.jsx`, `components/`, `hooks/`).

### Langkah 4 — Simpan di `PRAKTIK/`

```
PRAKTIK/sesi-NNN/
├── prediksi.md    ← ditulis pembelajar PERTAMA
├── App.jsx        ← korpus (hasil AI, disalin ke sini)
├── gaya.css       ← kalau Bagian 0
└── hasil.md       ← hasil nyata + tebakan yang meleset
```

Di Bagian 1–2, cara tercepat: taruh `App.jsx` hasil AI ke `proyek-vite/src/`, jalankan
`npm run dev`. **Jangan menaruhnya di repo produksi apa pun.**

### ⛔ Aturan keamanan — tidak bisa ditawar

1. **Kode korpus TIDAK PERNAH dijalankan di repo produksi.** Hanya di `PRAKTIK/` atau
   `proyek-vite/`.
2. **Jangan ambil kode nyata dari proyek pembelajar** tanpa menyalinnya dulu.
3. **Jangan menjalankan kode AI yang menyentuh jaringan, file, atau database** tanpa
   diperiksa lebih dulu. Kode `fetch` hanya boleh diarahkan ke data contoh lokal sampai
   Bagian 3.
4. **Jangan menjalankan perintah `npm install` paket yang tidak dikenal** dari kode AI
   tanpa membacanya dulu.
5. **Sumber kode dicatat** di `RESOURCES.md` §E kalau diambil dari luar.

---

## 4. Empat jenis latihan inspeksi (tahap BEDAH)

Bergilir, jangan pakai satu jenis terus. Masing-masing melatih hal berbeda.

| Kode | Nama | Melatih |
|---|---|---|
| (a) | **LACAK** | Model mental — bagaimana React berjalan tiap render |
| (b) | **SUSUN** | Struktur & logika JSX, tanpa beban sintaks |
| (c) | **KLAIM** | Deteksi "hampir benar" |
| (d) | **TELUSUR** | **Memburu sebab saat tampilannya salah** |

---

### (a) LACAK — melacak nilai tiap render

**Cara:** pembelajar menulis tabel nilai tiap state/prop **per render**, **sebelum**
menjalankan.

```markdown
| render | state A | state B | prop X | yang tampil di layar |
|--------|---------|---------|--------|----------------------|
| 1      |         |         |        |                      |
| 2      |         |         |        |                      |
```

**Yang dilatih:** model mental tentang bagaimana React berjalan — PRIMM menyebutnya
*notional machine*. Di React ini lebih sulit dari JavaScript biasa, karena komponen
**dijalankan ulang** setiap kali state berubah.

**Dasar riset:** Lister et al. (2004) menemukan pembelajar butuh **akurasi 50%** dalam
melacak kode sebelum bisa bekerja mandiri dengan percaya diri. Karena itu **Gerbang 2
mengukur tepat kemampuan ini** (dan Gerbang 1 versi HTML/CSS).

**Jangan:** mengisi tabel untuk pembelajar. Kalau macet, mundur satu render dan tanya
"setelah baris ini, nilai mana yang berubah?".

---

### (b) SUSUN — Parsons Problem

**Cara:** beri baris JSX/CSS yang **diacak**, pembelajar menyusun ulang jadi benar.

**Yang dilatih:** struktur dan logika — **tanpa beban sintaks.**

> "The main benefit of Parson's Problems is that the learner is focusing on the structure
> and logic of blocks of code, rather than the syntax of individual text elements."
> — NCCA Pedagogy Quick Read #13

**Aturan menulis Parsons Problem** (dari QR #13 dan Denny et al. 2008):

| Aturan | Kenapa |
|---|---|
| **Satu jawaban benar saja** | Kalau ada beberapa urutan yang jalan, tidak ada yang dinilai |
| **Pakai baris kode asli**, bukan huruf/angka | Supaya pembelajar tetap akrab dengan sintaksnya |
| **Sertakan deskripsi jelas** apa yang harus tampil | Mengurangi beban kognitif |
| **Sediakan struktur** (kurung, indentasi) di awal | Petunjuk visual membantu pemula |
| **Tanpa distractor** untuk pemula | ⚠️ Harms, Chen & Kelleher (2016, ICER '16): distractor **menurunkan efisiensi belajar** pemula |
| **Beberapa soal serupa sepanjang waktu** | Satu soal bisa dijawab dengan menebak; beberapa soal tidak |

**Catatan React:** untuk SUSUN, pakai komponen yang **hanya menampilkan** (tanpa state).
Baris state diacak = dua hal sulit sekaligus.

**Distractor** (baris palsu) baru ditambahkan **setelah pembelajar nyaman**.

---

### (c) KLAIM — menentukan apakah kode melakukan apa yang dikatakannya

**Ini latihan yang paling langsung melatih tujuan MISSION.**

**Cara:** tutor memberi kode + **satu kalimat klaim**, lalu berhenti.

> *Klaim: "komponen ini menampilkan total setelah diskon dan ikut berubah saat jumlah
> diubah."*
> *Tugasmu: tentukan apakah klaim itu benar.*

**Yang dilatih:** mendeteksi *"almost right, but not quite"* — frustrasi nomor satu
developer terhadap AI (66%, Stack Overflow 2025).

**Bentuk jawaban yang diminta:**

```markdown
## Klaim
<klaim dari tutor>

## Verdict: BENAR / TIDAK / SEBAGIAN
## Bukti
<baris berapa, nilai apa, kenapa>
## Kalau tidak benar — apa yang sebenarnya dilakukan?
```

**Perhatikan:** tugasnya **bukan mencari bug**. Tugasnya **menentukan apakah kode melakukan
apa yang dikatakannya.** Beda hal — dan yang kedua lebih dekat ke pekerjaan nyata.

**Contoh klaim yang bagus untuk React** (semuanya bisa **salah**, dan itulah gunanya):

| Klaim | Sering salah karena |
|---|---|
| "menekan tombol ini menambah satu item ke daftar" | State dimutasi → tidak render (Unit 15) |
| "input ini bisa diketik" | `value` tanpa `onChange` (Unit 13) |
| "loading akan berhenti setelah data datang" | `await` hilang / `setLoading` tak tercapai (Unit 12) |
| "kalau server mati, pengguna melihat pesan" | Tidak ada `catch` (Unit 12) |
| "daftar ini tetap benar setelah diurutkan" | `key={index}` (Unit 10) |
| "komponen ini aman kalau datanya kosong" | `.map()` pada `undefined` (Unit 10) |
| "komponen ini tampil sekali saja" | `<StrictMode>` menjalankannya dua kali di dev (Unit 11) |
| "efek ini jalan sekali saat komponen muncul" | Dependency array salah (Unit 11) |

**Variasi Bagian 3:** klaimnya bukan tentang satu komponen, tapi tentang **seluruh proyek**.
*"Aplikasi ini menyimpan data pengguna."* → pembelajar memverifikasi apakah benar.

---

### (d) TELUSUR — memburu sebab saat hasilnya salah ⭐

**Ini jenis latihan yang paling dekat dengan pekerjaan nyata — dan yang paling sering hilang
dari rencana belajar.**

**Bedanya dengan KLAIM:** di KLAIM, kode **belum** dijalankan dan tugasnya menilai klaim.
Di TELUSUR, kode **sudah** dijalankan, **tampilannya salah**, dan **tidak ada pesan error**
yang menuntun. Tugasnya: **cari baris penyebabnya.**

**Cara menyiapkan korpusnya:**

1. Minta AI membuat komponen untuk tugas kecil yang **hasilnya bisa diperiksa** —
   mis. "hitung total setelah diskon", "tampilkan daftar dengan nomor urut".
2. Jalankan. **Pastikan tampilannya salah** — tapi **console bersih**.
   Kalau ada error, itu ranah Unit 7/12 (baca pesan error), bukan TELUSUR.
3. Simpan kode **dan** catatan tampilan salahnya ke `PRAKTIK/sesi-NNN/`.
4. Jangan tandai di mana cacatnya. **Jangan beri petunjuk apa pun.**

**Protokol 5 langkah yang WAJIB dipakai pembelajar:**

```
1. KATAKAN    Apa yang DIHARAPKAN vs apa yang TERJADI (dua kalimat). Tulis di hasil.md.
2. DUGA       Di baris mana kira-kira sebabnya, dan KENAPA.
              ← WAJIB ditulis SEBELUM menyentuh kode. Ini aturan intinya.
3. UJI        Pakai SATU alat saja, tepat di titik dugaan. Jalankan.
4. SEMPITKAN  Dugaan benar? bagus. Salah? justru bagus — kamu baru menyingkirkan
              separuh kemungkinan. Ulangi 2–3 sampai tinggal satu baris.
5. BUKTIKAN   Tunjuk baris penyebab. Perbaiki. Jalankan lagi.
              Lalu jawab: "apakah perbaikan ini bisa merusak yang lain?"
```

> **Catatan khusus React — alatnya berbeda dari JavaScript biasa.**
> `console.log` tetap boleh, tapi alat utama untuk React adalah **React DevTools**
> (lihat nilai state & props tiap render) dan **tab Network** (lihat permintaan yang tidak
> pernah selesai). Yang penting: **satu alat per dugaan** — bukan menabur.
>
> ⚠️ **React DevTools bukan pengganti dugaan.** Membuka panel dan menggulir-gulir tanpa
> dugaan tertulis = menebak, bukan memburu. **Dugaan dulu, baru buka panel.**

**Kenapa langkah 2 harus SEBELUM menyentuh kode:**

Menabur `console.log` (atau membuka DevTools dan menatap panel) **tidak** mengajarkan apa
pun — hasilnya cuma deretan angka tanpa arah. Yang mengajarkan adalah **dugaan yang diuji**.
Bahkan dugaan yang salah mengajarkan: ia menyingkirkan separuh kemungkinan.

> Dasar riset: RCT Anthropic (Jan 2026) menemukan **gap terbesar** antara grup yang memakai
> AI dan grup yang mengerjakan sendiri justru ada di soal **debugging**. Maka bagian ini
> tidak boleh diserahkan ke AI — di situ pelajarannya paling hilang.

**Bentuk jawaban yang diminta (di `hasil.md`):**

```markdown
## Yang diharapkan vs yang terjadi
- Harapan: <...>
- Kenyataan: <...>

## Dugaan 1 — baris <n>
Alasan: <...>
Alat yang dipakai: <React DevTools / console.log / Network>
Hasil uji: <terkonfirmasi / gugur>

## Dugaan 2 — baris <n>
Alasan: <...>
Hasil uji: <...>

## Baris penyebab: <n>
Kenapa: <...>
Perbaikan: <...>
Apakah bisa merusak yang lain? <...>
```

**Aturan penilaian:**

| Keadaan | Artinya |
|---|---|
| Semua dugaan langsung benar | Materinya **terlalu mudah** — naikkan kesulitannya |
| Ada dugaan yang gugur, lalu ketemu | **Ideal.** Ini yang dilatih. |
| Tidak bisa menyebut dugaan, langsung menebak-nebak | Ulangi dengan komponen lebih pendek |
| Ketemu, tapi tidak bisa menjelaskan kenapa | Belum lulus — balik ke LACAK |

**Tempat TELUSUR paling penting di skill ini:**

| Unit | Latihan TELUSUR |
|---|---|
| 2 | Gaya tidak kena padahal aturannya ada (spesifisitas / beda huruf besar-kecil) |
| 3 | Dua kotak saling menempel padahal seharusnya berjarak |
| 4 | Kotak tidak berjajar padahal `display: flex` sudah ada (dipasang di anak) |
| 6 | Klik label tidak memfokuskan input (`for` ≠ `id`) |
| 7 | Halaman kosong, console bersih (`return` hilang) |
| 8 | Teks kosong padahal komponen dipanggil (nama prop beda) |
| 9 | Tombol ditekan, angka tidak berubah |
| 10 | Data tertukar setelah daftar disaring (`key` indeks) |
| 12 | Layar kosong selamanya, tidak error (`await` hilang) |
| 13 | Nilai yang dikirim selalu nilai awal |
| **15** | **Tombol ditekan, tidak terjadi apa-apa, tidak ada error** ⭐ |
| 16 | Aplikasi makin lambat tiap detik · angka ketinggalan satu langkah |

**Jangan:** memberi petunjuk lokasi cacat, atau membiarkan pembelajar menambah
`console.log` tanpa menulis dugaan lebih dulu.

---

## 5. Checklist korpus yang baik

Sebelum memakai korpus di sesi, periksa:

```
[ ] Diambil dari kode hasil generate AI (bukan ditulis tutor)
[ ] Ukurannya sesuai bagian (Bagian 0–1: ≤ 15 baris)
[ ] TIDAK dirapikan — cacat khas AI dibiarkan
[ ] Ada minimal satu hal yang bisa ditemukan pembelajar
[ ] Tugas yang diminta ke AI jelas dan biasa (bukan soal jebakan)
[ ] Disimpan di PRAKTIK/sesi-NNN/ atau proyek-vite/, bukan di repo produksi
[ ] Kode tidak menyentuh jaringan / file / database (sampai Bagian 3)
[ ] Untuk latihan TELUSUR: tampilannya SALAH tapi console BERSIH — dan tidak diberi petunjuk
[ ] Hanya SATU cacat disisipkan per sesi
```

**Kalau korpusnya "terlalu bersih"** — tidak ada yang bisa ditemukan — tambahkan satu cacat
**yang disengaja**. Tapi jangan di Bagian 0: di sana yang dilatih membaca struktur, bukan
mencari cacat.

---

## 6. Yang sering salah dilakukan tutor

| Kesalahan | Kenapa salah | Lakukan sebaliknya |
|---|---|---|
| Merapikan kode AI dulu sebelum dipakai | Menghapus justru bagian yang melatih | Pakai apa adanya |
| Memakai kode yang jelas rusak | Tidak melatih — langsung kelihatan | Pakai kode yang **terlihat** benar |
| Menjelaskan kode sebelum pembelajar menebak | Membatalkan seluruh gunanya | Tunggu `prediksi.md` ada |
| Menulis kode contoh sendiri karena "lebih rapi" | Melatih membaca kode bagus, bukan kode AI | Korpus wajib kode hasil AI |
| Menambah distractor di Parsons untuk pemula | Terbukti menurunkan efisiensi belajar (Harms et al. 2016) | Tanpa distractor sampai nyaman |
| Memberi korpus 100 baris "biar terasa nyata" | Melewati working memory pemula | Potong. Kecil itu disengaja. |
| Menjawab sendiri latihan KLAIM | Menghapus latihan verifikasi | Tunggu verdict pembelajar, baru bahas |
| Memberi petunjuk di mana cacatnya pada latihan TELUSUR | Menghapus seluruh gunanya | Diam. Tunggu dugaan pertama pembelajar. |
| Membiarkan pembelajar menabur `console.log` tanpa dugaan | Tidak melatih memburu — hanya melatih menebak | **Dugaan dulu, baru uji.** Satu alat per dugaan. |
| Menyerahkan debugging ke AI | RCT Anthropic: **gap terbesar** justru di sini | Ajarkan protokol 5 langkah; AI hanya untuk memeriksa setelah ketemu |
| Menaruh kode AI di repo produksi pembelajar | Risiko nyata + mengaburkan batas latihan | Selalu `PRAKTIK/` atau `proyek-vite/` |

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `sintaks-react.md` · `peta-unit.md` · `roadmap-4-tingkat.md` ·
`teach-javascript/references/korpus-ai.md` (versi JavaScript)
