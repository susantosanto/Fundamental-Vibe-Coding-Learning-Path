# Peta Unit — Detail per Unit

> Referensi untuk skill `teach-javascript`. **Tutor membaca file ini sendiri** — pembelajar
> tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **20 unit · 4 tingkatan · 4 gerbang** (+ 2 unit pelengkap, tidak bergerbang).
> Setiap unit: **konsep · sintaks yang dikenali · yang diajarkan · latihan inspeksi ·
> kriteria lulus · sumber.**
> Satu unit = 1–2 sesi × maks 1 jam.
>
> **Kamus sintaks lengkap (± 50 bentuk) ada di `sintaks-modern.md`.** Baris
> *"Sintaks yang dikenali"* di tiap unit hanya menyebut yang paling sering muncul.

---

## Aturan umum semua unit

| | |
|---|---|
| Bentuk sesi | 6 tahap: PREDIKSI → JALANKAN → BEDAH → UBAH → [PERBAIKI] → CATAT |
| Editor | Zed · jalankan: `node kode.js` |
| Korpus | **Kode hasil generate AI** (lihat `korpus-ai.md`) |
| Ukuran kode | Tingkat 1–2: **≤ 15 baris**. Tingkat 3: ≤ 40 baris. Tingkat 4: 3–6 file. |
| Aturan mutlak | `prediksi.md` ditulis & disimpan **sebelum** kode dijalankan |
| Sumber sitasi | `MDN §<bagian>` · `ECMA-262 §<klausa>` · `PRIMM §<tahap>` |
| **Sintaks asing** | **JANGAN bilang "di luar materi"** → cek `sintaks-modern.md`, jelaskan **satu bentuk**, lanjut |

---

# TINGKAT 1 — BISA MEMBACA (Unit 1–6)

Yang dilatih: melihat kode dan tahu **apa yang terjadi**.
Semua unit di tingkatan ini memakai kode ≤ 15 baris.

---

## Unit 1 — Nama menunjuk nilai

**Konsep:** variabel bukan "kotak berisi", tapi **nama yang menunjuk sebuah nilai**.
Nilai yang ditunjuk bisa **berubah**, dan itu bukan kesalahan.

**Yang diajarkan tutor:**
- `let umur = 17` → "`umur` sekarang menunjuk angka 17"
- `umur = 18` → nama yang sama, menunjuk nilai **berbeda**
- Kenapa "menunjuk" lebih akurat daripada "berisi"

**Latihan inspeksi:**
1. Beri kode 4 baris. Pembelajar tulis tebakan output di `prediksi.md`.
2. Jalankan. Bandingkan.
3. **LACAK:** buat tabel `baris | nama | nilai` di `hasil.md`.
4. **UBAH:** ubah satu nilai. Prediksi lagi.

**Kriteria lulus:** bisa menuliskan nilai tiap nama di setiap baris, benar, untuk kode
4–6 baris yang belum pernah dilihat.

**Sumber:** MDN JavaScript Guide §Grammar and types · PRIMM §Predict, §Run

**Miskonsepsi yang paling sering muncul:**
- Menganggap `umur` = 17 (bukan "menunjuk 17")
- Mengira `umur = 18` menimpa **nilai** — padahal yang berubah adalah **apa yang ditunjuk nama**
- Membaca `console.log` sebagai "mencetak nama variabel", bukan nilainya

---

## Unit 2 — Jenis nilai

**Konsep:** nilai punya **jenis**, dan jenis menentukan apa yang terjadi saat dioperasikan.
`17` bukan `"17"`.

**Yang diajarkan tutor:**
- Angka · teks (string) · benar/salah (boolean) · kosong (`null`/`undefined`)
- Tanda kutip adalah pembedanya, bukan hiasan
- `+` menyambung teks **atau** menjumlah angka — tergantung jenis
- **`===` (sama jenis dan nilai) vs `==` (dikonversi dulu)** — ini yang paling sering
  membuat "hampir benar" di kode AI
- **Desimal tidak eksak:** `0.1 + 0.2 !== 0.3`. Untuk uang, jangan bandingkan langsung
- `Math.round` / `Math.floor` / `Math.ceil` · `%` (sisa bagi) · `**` (pangkat)
- **Konversi teks → angka:** `parseInt(x, 10)` · `parseFloat(x)` · `Number(x)` · `isNaN(x)`
  ⚠️ `parseFloat("1.500,25")` → `1.5` — **bug uang** kalau data ber-koma Indonesia

**Sintaks yang dikenali:** `` `teks ${nilai}` `` (template literal) · `===` `!==` `==` `!=`
· `+` `-` `*` `/` `%` `**` · `+=` · `!` · `typeof`

**Latihan inspeksi:**
1. Prediksi: apa hasil `"2" + 2`? Tulis di `prediksi.md` **sebelum** menjalankan.
2. Jalankan. (Hasilnya `"22"`, bukan `4`.)
3. **KLAIM:** tutor memberi kode + klaim *"ini menjumlahkan dua angka"* → pembelajar
   menentukan apakah klaimnya benar.
4. **KLAIM (konversi):** *"kode ini membaca `"1.500,25"` sebagai seribu lima ratus"* →
   verifikasi. (`parseFloat` memberi `1.5`.)

**Kriteria lulus:** bisa menebak hasil operasi campuran angka/teks pada 4 dari 5 kasus,
**dan** bisa menyebut kenapa `1 == "1"` bernilai `true` sementara `1 === "1"` bernilai `false`.

**Sumber:** MDN §Grammar and types → Data structures and types · MDN §Expressions and
operators → Equality · MDN §Numbers and strings · ECMA-262 §6.1 (Language Types)

---

## Unit 3 — Urutan: atas ke bawah

**Konsep:** kode berjalan **baris demi baris**, dari atas. Baris yang belum jalan belum
mengubah apa pun.

**Yang diajarkan tutor:**
- Kenapa urutan baris mengubah hasil
- Kenapa memindahkan satu baris bisa merusak semuanya

**Latihan inspeksi:**
1. **LACAK** kode 6 baris: tabel nilai per baris.
2. **SUSUN (Parsons):** tutor mengacak baris-baris itu → pembelajar menyusun ulang.
   ⚠️ Tanpa distractor (Harms et al. 2016: distractor menurunkan efisiensi belajar pemula).
3. Jalankan untuk memverifikasi susunannya.

**Kriteria lulus:** menyusun ulang 6 baris yang diacak dengan benar, dua kali berturut-turut.

**Sumber:** PRIMM §Investigate (tracing, Parson's puzzles) · MDN §Control flow

---

## Unit 4 — Percabangan

**Konsep:** `if` membuat kode punya **cabang**. Hanya satu cabang yang jalan.

**Yang diajarkan tutor:**
- `if` / `else` membaca **kebenaran** sebuah perbandingan
- Cabang yang tidak jalan **tidak dieksekusi sama sekali** — bukan "dijalankan lalu dibatalkan"
- **`?.` (optional chaining)** — berhenti & beri `undefined` kalau bagian sebelumnya kosong
- **`??` vs `||` — pasangan paling berbahaya:**
  `jumlah || 0` vs `jumlah ?? 0`. Yang pertama mengubah `0` yang sah; yang kedua tidak.
  ⚠️ `diskon || 10` pada diskon **0%** → jadi **10%**. Bug yang lolos test.
- Ternary `syarat ? ini : itu` · `&&` · `!`
- **`switch` / `case` / `default`** — dan kenapa `switch` tanpa `break` "jatuh" ke case berikutnya

**Sintaks yang dikenali:** `?.` · `??` · `&&` `||` `!` · `syarat ? a : b` ·
`switch`/`case`/`break`/`default`

**Latihan inspeksi:**
1. Prediksi output untuk **3 nilai input berbeda** — tiga `prediksi.md` terpisah.
2. Jalankan ketiganya.
3. **KLAIM:** *"kode ini menampilkan 'lulus' kalau nilai di atas 70"* → verifikasi.
4. **KLAIM (`??` vs `||`):** *"kode ini memakai diskon 0% kalau diskonnya nol"* →
   verifikasi. (Kalau kodenya `diskon || 10`, klaimnya **salah**.)
5. **UBAH:** ganti `||` jadi `??`. Jalankan. Apa yang berubah?

**Kriteria lulus:** bisa menunjuk cabang mana yang jalan untuk 5 input berbeda, tanpa
menjalankan — **dan** bisa menunjukkan satu tempat di mana `||` seharusnya `??`.

**Sumber:** MDN §Control flow and error handling · MDN §Expressions and operators →
Logical, Optional chaining · PRIMM §Predict

---

## Unit 5 — Perulangan

**Konsep:** `for` mengulang blok kode. Yang berubah tiap putaran adalah **nilai penghitungnya**.

**Yang diajarkan tutor:**
- Tiga bagian `for`: mulai · sampai kapan · perubahan
- Berapa kali jalan = selisih, bukan angka akhir
- Kenapa nilai di dalam loop bisa "tertinggal" (persiapan untuk Unit 9)
- **Bentuk lain:** `while` · `do...while` · **`for...of`** (loop nilai — paling sering di
  kode AI) · `for...in` (loop kunci objek)
- **`break`** (keluar) vs **`continue`** (lewati putaran ini) — dan `break` di dalam `switch`

**Sintaks yang dikenali:** `for` · `while` · `do...while` · `for...of` · `for...in` ·
`break` · `continue` · `i++` · `i--`

**Latihan inspeksi:**
1. **LACAK:** buat tabel `putaran | nilai penghitung | nilai hasil` di `hasil.md`.
2. Prediksi output akhir **sebelum** menjalankan.
3. **UBAH:** ubah batasnya. Berapa putaran sekarang?
4. **UBAH:** ganti `for` jadi `for...of`. Apakah hasilnya sama? Kenapa?

**Kriteria lulus:** bisa menuliskan tabel putaran yang benar untuk loop yang belum pernah
dilihat — dan bisa menyebut bedanya `for`, `for...of`, dan `for...in` dalam satu kalimat.

**Sumber:** MDN §Loops and iteration

---

## Unit 6 — Fungsi: masuk → keluar

**Konsep:** fungsi menerima **masukan** dan menghasilkan **keluaran**. Ia tidak berjalan
sampai dipanggil.

**Yang diajarkan tutor:**
- Mendefinisikan ≠ memanggil
- `return` mengeluarkan nilai; tanpa `return`, hasilnya `undefined`
- Nama parameter vs nilai yang diberikan saat memanggil — **dua hal berbeda**
- **Fungsi panah** `const f = (a) => a * 2` — bentuk yang **paling sering dipakai AI**
  - ⚠️ **Jebakan utama:** `() => { x }` **tidak** mengembalikan `x` — hasilnya `undefined`.
    Yang mengembalikan adalah `() => x`. Kode AI sering "hampir benar" justru di sini.
  - Panah tidak punya `this` sendiri — cukup disebut, tidak perlu didalami
- **Nilai bawaan** `(a = 1) => a` · **rest** `(...sisa) => sisa`
- **Destructuring di parameter:** `({ nama, umur }) => ...`

**Sintaks yang dikenali:** `function f(){}` · `const f = () => {}` · `a => a*2` ·
`(a = 1) =>` · `(...sisa) =>` · `async` (dibahas di Unit 10)

**Latihan inspeksi:**
1. **LACAK** dua pemanggilan berbeda dengan parameter berbeda.
2. Prediksi: apa yang keluar kalau `return` dihapus?
3. **SUSUN:** susun ulang urutan `definisi` lalu `pemanggilan`.
4. **KLAIM (panah):** tutor memberi `const f = () => { "halo" }` + klaim *"fungsi ini
   mengembalikan teks halo"* → verifikasi. (Klaimnya **salah** — hasilnya `undefined`.)
5. **UBAH:** ubah fungsi biasa jadi fungsi panah. Hasilnya sama?

**Kriteria lulus:** bisa menuliskan nilai keluaran dua pemanggilan berbeda, tanpa
menjalankan — **dan** bisa menunjuk satu perbedaan fungsi panah vs fungsi biasa.

**Sumber:** MDN §Functions · MDN §Functions → Arrow functions · MDN §Expressions and
operators → Spread syntax

### → GERBANG 1 setelah Unit 6

Kode 15 baris yang belum pernah dilihat. Lacak, tulis di `prediksi.md`. Akurasi **≥ 50%**
(Lister et al. 2004). Gagal → ulangi Unit 3–6, **bukan** lanjut.

---

# TINGKAT 2 — BISA MENILAI (Unit 7–10)

Yang dilatih: melihat kode dan tahu **apa yang salah, dan kenapa**.

---

## Unit 7 — Kumpulan data

**Konsep:** array dan object menyimpan **banyak nilai** dalam satu nama.

**Yang diajarkan tutor:**
- Array: urutan, indeks mulai dari **0**
- Object: nama kunci, bukan urutan
- Cara membaca satu isi vs seluruh isi
- **Destructuring:** `const { nama } = user` · `const [a, b] = daftar` · ganti nama
  `{ nama: n }` · nilai bawaan `{ qty = 1 }` — **bentuk yang muncul di hampir semua kode AI**
- `Object.keys()` / `.values()` / `.entries()`
- **Method array yang sering dipakai AI:** `.map()` `.filter()` `.find()` `.some()` `.every()`
  ⚠️ `.map(x => { x * 2 })` **tidak** mengembalikan apa pun — harus `x => x * 2`
- `new Map()` / `new Set()` — cukup dikenali (unit ini fokus array & object)
- **JSON sekilas:** JSON adalah bentuk **teks** dari object/array → dibahas penuh di Unit 19

**Sintaks yang dikenali:** `arr[0]` · `obj.kunci` · `obj["kunci"]` · `{ a, b } = obj` ·
`[x, y] = arr` · `Object.keys/values/entries` · `.map()` `.filter()` `.find()` · `in`

**Latihan inspeksi:**
1. Prediksi isi array setelah **3 operasi berturut-turut**.
2. **LACAK:** gambar isi array setelah tiap operasi.
3. **KLAIM:** *"kode ini menampilkan semua nama"* → verifikasi (apakah semua, atau
   mulai dari yang kedua?).
4. **KLAIM (destructuring):** *"kode ini mengambil nama dan umur"* → verifikasi
   (`const { nama, umur } = user` — apakah `umur` benar-benar ada, atau `undefined`?).

**Kriteria lulus:** bisa menuliskan isi array setelah 3 operasi, benar, tanpa menjalankan —
**dan** bisa menyebut nilai setiap nama yang dihasilkan satu baris destructuring.

**Sumber:** MDN §Indexed collections · MDN §Keyed collections · MDN §Working with objects ·
MDN §Expressions and operators → Destructuring · MDN §Array

---

## Unit 8 — Alamat vs isi ⭐

> **Sumber bug JavaScript nomor satu.** Unit paling penting di tingkatan ini.

**Konsep:** nilai sederhana disalin **isinya**; array & object disalin **alamatnya**.
`let b = a` tidak membuat salinan — `a` dan `b` menunjuk **benda yang sama**.

**Yang diajarkan tutor:**
- Kenapa mengubah `b` ikut mengubah `a`
- Kenapa `{...obj}` **tidak cukup** untuk objek bersarang
- Kenapa ini berbahaya justru karena kodenya **terlihat benar**
- **Spread `{...obj}` / `[...arr]` hanya salinan DANGKAL** — satu tingkat saja
- Cara salinan **dalam** yang benar: `structuredClone(obj)`
- **Method yang memutasi** — `.push()` `.pop()` `.shift()` `.sort()` `.splice()` `.reverse()`
  mengubah array **aslinya**. ⚠️ Di React, layar tidak ikut berubah karena alamatnya sama.
- Cara aman: `[...arr].sort()` atau `.toSorted()` / `.toReversed()` (ES2023)

**Sintaks yang dikenali:** `{ ...obj }` · `[...arr]` · `{ ...a, x: 1 }` · `structuredClone()` ·
`.push()` `.sort()` `.splice()` `.toSorted()`

**Latihan inspeksi:**
1. Prediksi: setelah `b.push(...)`, apakah `a` berubah? Tulis **sebelum** menjalankan.
2. Jalankan. (Ya, berubah.)
3. **KLAIM:** *"fungsi ini membuat salinan daftar"* → verifikasi apakah benar-benar salinan.
4. **UBAH:** perbaiki supaya benar-benar jadi salinan. Jalankan lagi.
5. **KLAIM (spread dangkal):** *"`{...user}` membuat salinan penuh, jadi mengubah
   `salinan.alamat.kota` tidak memengaruhi aslinya"* → verifikasi. (Klaimnya **salah** —
   spread hanya satu tingkat.)
6. **UBAH:** ganti `{...user}` jadi `structuredClone(user)`. Jalankan lagi. Sekarang benar?

**Kriteria lulus:** bisa menunjukkan, tanpa menjalankan, **dua tempat** di kode di mana
`a` dan `b` sebenarnya benda yang sama — **dan** bisa menyebut kenapa `{...obj}` tidak
cukup untuk objek bersarang.

**Sumber:** MDN §Working with objects · MDN §Expressions and operators → Spread syntax ·
MDN §Structured data → `structuredClone()` · ECMA-262 §6.1.7 (The Object Type)

---

## Unit 9 — Nama itu dari kapan ⭐

> **Sumber bug React nomor satu** (*stale closure*).

**Konsep:** fungsi "mengingat" nama-nama yang ada saat ia **dibuat** — bukan saat ia
dipanggil. Itu yang disebut **closure**.

**Yang diajarkan tutor:**
- Kenapa nilai di dalam fungsi bisa "ketinggalan"
- Kenapa `var` di dalam loop membuat semua fungsi mencetak angka yang sama
- Kenapa ini muncul di React sebagai data yang "tidak mau berubah"

**Latihan inspeksi:**
1. Prediksi angka yang dicetak **sebelum** menjalankan — jawaban yang salah itu normal.
2. **LACAK:** catat nama mana "diingat" fungsi, dan dari kapan.
3. **KLAIM:** *"semua fungsi mencetak angkanya masing-masing"* → verifikasi.

**Kriteria lulus:** bisa menjelaskan kenapa dua fungsi yang dibuat di loop yang sama
mencetak angka yang sama, dan cara memperbaikinya.

**Sumber:** MDN §Functions → Closures · MDN §Grammar and types → variable scope, hoisting

---

## Unit 10 — Urutan yang tidak seperti ditulis

**Konsep:** kode async tidak berjalan berurutan seperti yang tertulis.

**Yang diajarkan tutor:**
- Kenapa `setTimeout(..., 0)` **tidak** langsung jalan
- Kenapa `forEach` + `async` tidak menunggu
- Kenapa "loading tidak pernah selesai" adalah gejala klasik
- **`async` / `await` — bentuk nyatanya:** `async function` selalu mengembalikan Promise;
  `await` menghentikan fungsi **sampai** hasilnya siap (tapi tidak menghentikan program)
- **`try` / `catch` di sekitar `await`** — cara menangani gagal-jaringan
- **`Promise.all([...])`** — menunggu beberapa sekaligus (bukan satu per satu)
- **`fetch(url)`** — contoh paling nyata: ambil data, `await` hasilnya, `await` lagi
  untuk membacanya sebagai JSON (lihat Unit 19)

**Sintaks yang dikenali:** `async function` · `async () =>` · `await` · `try/catch` ·
`.then()` / `.catch()` (cara lama) · `Promise.all()` · `fetch()`

**Latihan inspeksi:**
1. Prediksi **urutan** output dari 4 baris yang mencampur sync & async.
2. Jalankan. Bandingkan urutannya.
3. **UBAH:** pindahkan satu baris. Apakah urutannya berubah?
4. **KLAIM (await hilang):** *"fungsi ini sudah menunggu datanya selesai diambil"* →
   verifikasi. (Biasanya `await`-nya hilang di satu tempat — `undefined` muncul belakangan.)
5. **UBAH:** tambahkan `try/catch` di sekitar `await fetch(...)`. Apa yang terjadi kalau
   URL-nya salah?

**Kriteria lulus:** bisa menuliskan urutan output yang benar untuk campuran sync/async
sederhana, tanpa menjalankan — **dan** bisa menunjuk satu tempat di mana `await` yang
hilang membuat hasilnya salah.

**Sumber:** MDN §Promises · MDN §Functions → Async functions (`async`/`await`) ·
MDN §Loops and iteration (bagian `for...of` vs `forEach`) ·
ECMA-262 §9 (Executable Code and Execution Contexts)

### → GERBANG 2 setelah Unit 10

Baca satu file JavaScript **hasil AI yang bukan pembelajar tulis**. Jelaskan, tanpa catatan:
(a) apa yang dilakukannya, (b) satu keputusan di dalamnya + kenapa, (c) satu cara itu bisa gagal.

---

# TINGKAT 3 — BISA MEMBONGKAR (Unit 11–14)

Yang dilatih: menemukan masalah pada satu file, **memperbaikinya**, dan — kalau membaca
saja tidak cukup — **menelusurinya sampai ketemu sebabnya**.

---

## Unit 11 — Membaca pesan error

**Konsep:** pesan error bukan hukuman — ia **petunjuk**. Stack trace menunjukkan
**perjalanan** menuju kesalahan.

**Yang diajarkan tutor:**
- Cara membaca stack trace: dari bawah ke atas
- Tiga pesan yang paling sering: `undefined is not a function` · `Cannot read properties
  of undefined` · `is not defined`
- **Nama jenis error adalah petunjuk:**
  `TypeError` (jenisnya salah) · `ReferenceError` (namanya tidak ada) ·
  `RangeError` (di luar batas) · `SyntaxError` (tulisannya salah) · `AggregateError`
- `throw new Error("...")` — melempar error sendiri, dengan pesan yang berguna
- `finally` — blok yang **selalu** jalan, error atau tidak
- `typeof x` saat ragu: kenapa `typeof []` → `"object"` (jebakan klasik)
- Bedanya "salah ketik" vs "salah paham"

**Sintaks yang dikenali:** `try` / `catch` / `finally` · `throw new Error()` · `e.message` ·
`e.stack` · `typeof`

**Latihan inspeksi:**
1. Beri **5 pesan error** + kodenya. Untuk tiap satu: tunjuk **baris** dan **sebab**.
2. Baru jalankan untuk membuktikan.
3. **KLAIM:** *"error ini karena salah ketik nama"* → verifikasi. (`ReferenceError` ya,
   `TypeError` belum tentu.)

**Kriteria lulus:** dari 5 pesan error, menunjuk baris & sebab dengan benar untuk 4 di
antaranya — **dan** bisa menyebut jenis error-nya (bukan hanya "ada error").

**Sumber:** MDN §Control flow and error handling (try/catch, `throw`, `finally`) ·
MDN §Standard built-in objects → Error objects (TypeError, ReferenceError, RangeError) ·
MDN §Expressions and operators → typeof

---

## Unit 12 — Cari bug dengan membaca

**Konsep:** cacat bisa ditemukan **tanpa menjalankan kode sama sekali** — kalau kamu bisa
melacak nilainya di kepala.

**Yang diajarkan tutor:**
- Kenapa "kode berjalan" bukan berarti "kode benar"
- Cara mempersempit dengan membaca: dari kecurigaan → baris → bukti
- Cacat yang disuntik biasanya ada di tempat yang **terlihat wajar**

**Latihan inspeksi:**
1. Beri satu file hasil AI dengan **satu cacat yang disuntik**.
2. **Temukan tanpa menjalankan kode.** Tulis baris + alasannya di `hasil.md`.
3. Baru jalankan untuk membuktikan.
4. **PERBAIKI** (tahap 5 sesi). Jalankan lagi.
5. Jawab: *"apakah perbaikan ini bisa merusak yang lain?"*

**Kriteria lulus:** menemukan cacat dengan membaca saja, memperbaikinya, dan
membuktikan perbaikannya bekerja.

**Sumber:** PRIMM §Investigate (tracing, Parson's puzzles) · MDN §Error handling

---

## Unit 13 — TELUSUR: cari sebab dari hasil yang salah ⭐

> **Unit yang paling dekat dengan pekerjaan nyata.** Kode jalan, tidak error, tapi hasilnya
> salah. Tidak ada pesan error yang menuntun ke mana pun.

**Konsep:** men-debug **bukan** menemukan bug dengan membaca. Debug adalah **memburu** —
membuat dugaan, menguji dugaan, mempersempit, sampai ketemu baris penyebabnya.

**Kenapa ini unit terpisah dari Unit 12?** Unit 12 = **membaca** (satu arah). Unit 13 =
membaca → menduga → menguji → mempersempit (empat arah). Orang bisa jago yang satu tapi
tidak yang lain — dan yang kedua itu yang dibutuhkan saat aplikasi "jalan tapi salah".

**Yang diajarkan tutor:**
- **Gejala ≠ sebab.** *"Totalnya salah"* bukan sebab. *"Baris 14 memakai harga sebelum diskon"* baru sebab.
- Kenapa menabur `console.log` acak-acakan **tidak** menolong — dan kenapa dugaan menolong
- Cara membelah masalah: separuh atas atau separuh bawah?
- Bahwa dugaan yang **salah** tetap kemajuan — ia menyingkirkan separuh kemungkinan

**Latihan inspeksi — protokol 5 langkah (WAJIB urut):**

```
1. KATAKAN   Apa yang DIHARAPKAN vs apa yang TERJADI (dua kalimat). Tulis dulu.
2. DUGA      Di baris mana kira-kira sebabnya, dan KENAPA.
             ← WAJIB ditulis di hasil.md SEBELUM menyentuh kode.
3. UJI       Tambah SATU console.log saja, tepat di titik dugaan itu. Jalankan.
4. SEMPITKAN Dugaan benar? Bagus. Dugaan salah? Justru bagus — sekarang kamu tahu
             di mana BUKAN-nya. Ulangi langkah 2–3 sampai tinggal satu baris.
5. BUKTIKAN  Tunjuk baris penyebabnya. Perbaiki. Jalankan lagi.
             Lalu jawab: "apakah perbaikan ini bisa merusak yang lain?"
```

**Kriteria lulus:** menemukan baris penyebab, **dan** `hasil.md` memuat **minimal dua
dugaan tertulis** — salah satunya **boleh** salah. Kalau semua dugaan langsung benar,
materinya terlalu mudah.

**Miskonsepsi yang paling sering muncul:**
- Langsung menambah `console.log` di mana-mana tanpa menduga apa pun
- Mengira "sudah saya jalankan dan tidak error" berarti "tidak ada masalah"
- Mengubah kode **sambil** menebak — lalu tidak tahu perubahan mana yang berpengaruh

**Sumber:** PRIMM §Investigate (*"put errors into it and do some debugging"*) ·
`korpus-ai.md` §4(d) · `RESOURCES.md` §B — RCT Anthropic: **gap terbesar antara grup AI
dan grup manual ada di soal debugging**

---

## Unit 14 — Bikin satu hal (tahap `Make`)

**Konsep:** semua unit sebelumnya adalah persiapan untuk ini. **Kepemilikan kode berpindah
dari "not mine" ke "mine".**

> PRIMM: *"the transfer of ownership moves from the code being 'not mine' to 'partly mine'
> as students gain confidence."*

**Yang dilakukan:**
- Buat **satu program kecil, tanpa framework** — boleh meminjam potongan dari kode yang
  sudah dibaca sepanjang jalur ini
- Boleh jelek. Yang penting: **pembelajar bisa menjelaskan setiap barisnya.**

**Latihan inspeksi (setelah selesai):**
- Tukar peran: pembelajar menjelaskan kodenya, tutor bertindak sebagai **pemeriksa**
  yang mencari cacat.

**Kriteria lulus:** program jalan **dan** pembelajar bisa menjelaskan setiap baris tanpa
membuka kode. Baris yang tidak bisa dijelaskan = harus dihapus atau dipahami.

**Sumber:** PRIMM §Make

### → GERBANG 3 setelah Unit 14

**Dua bagian, keduanya harus lulus:**

**(a) Temukan & perbaiki** — diberi cacat yang disuntik, temukan **tanpa menjalankan kode**,
perbaiki, buktikan perbaikannya bekerja.

**(b) Telusur** — diberi kode yang **sudah dijalankan** dengan output yang salah.
Pakai protokol 5 langkah (Unit 13) sampai menunjuk baris penyebabnya.
`hasil.md` harus memuat minimal dua dugaan tertulis.

---

# TINGKAT 4 — BISA MEMUTUSKAN (Unit 15–18)

Yang dilatih: menilai kode AI **pada skala nyata** — banyak file, dan keputusan.

---

## Unit 15 — Bagaimana file saling terhubung

**Konsep:** program nyata tidak hidup di satu file. Fungsi dari satu file dipanggil file lain.

**Yang diajarkan tutor:**
- Cara membaca `import` / `require` dan mencari asalnya
- Kenapa pesan error bisa muncul di file A padahal sebabnya di file B
- **Dua bentuk yang berbeda:** `import x from "..."` (ESM) vs `const x = require("...")`
  (CommonJS) — **kode Electron sering memakai `require`**
- `export default` vs `export { nama }` — bedanya saat mengimpor
- **Kode mati:** fungsi yang tidak pernah dipanggil dari mana pun

**Sintaks yang dikenali:** `import x from "..."` · `import { a } from "..."` ·
`export default` · `export { a }` · `require("...")` · `module.exports` · `import()`

**Latihan inspeksi:**
1. Beri proyek **3–6 file** hasil AI.
2. Gambar **peta**: file mana memanggil file mana, fungsi mana dipakai di mana.
3. Cari satu fungsi yang **tidak pernah dipanggil** (kode mati).

**Kriteria lulus:** bisa menggambar peta pemanggilan yang benar untuk proyek 3–6 file —
**dan** bisa menyebut satu fungsi yang tidak pernah dipanggil.

**Sumber:** MDN §JavaScript modules · ECMA-262 §16 (ECMAScript Language: Scripts and Modules)
· MDN §JavaScript modules → Dynamic module loading

---

## Unit 16 — Bug yang lolos dari test

**Konsep:** test hijau **bukan** bukti kode benar. Test hanya memeriksa apa yang ditanyakan.

**Yang diajarkan tutor:**
- Kenapa kode AI sering lulus test tapi tetap salah
- Stack Overflow 2025: **66% developer** frustrasi utamanya *"solutions that are almost
  right, but not quite"*
- Kasus batas: kosong · satu item · sangat banyak · nilai aneh

**Latihan inspeksi:**
1. Beri kode + test yang **semuanya hijau**.
2. Tugas: temukan input yang membuatnya salah.
3. Tulis **satu test baru** yang menangkap cacat itu.

**Kriteria lulus:** menemukan minimal satu input yang memecahkan kode yang test-nya hijau.

**Sumber:** MDN §Control flow and error handling · PRIMM §Investigate

---

## Unit 17 — Review sebagai PR

**Konsep:** inspeksi berujung pada **keputusan**. "Terima" dan "tolak" dua-duanya sah —
yang tidak sah adalah menerima tanpa alasan.

**Yang diajarkan tutor:**
- Bentuk review: klaim → bukti → risiko → keputusan
- Kenapa "semua test hijau" bukan alasan untuk menerima

**Latihan inspeksi:**
1. Beri kode AI + satu kalimat klaim tentang apa yang dilakukannya.
2. Tulis review berisi: (a) apakah klaimnya benar + bukti, (b) satu cacat/risiko,
   (c) **keputusan terima/tolak + alasan**.

**Kriteria lulus:** keputusan beralasan. **Menolak kode yang sebenarnya baik dengan alasan
jelas = LULUS.** Menerima kode buruk tanpa alasan = gagal.

**Sumber:** Addy Osmani — *Agentic Code Review* (*"the hard part of engineering moved from
writing code to deciding whether..."*)

---

## Unit 18 — Perbaiki tanpa merusak

**Konsep:** memperbaiki satu hal sambil **membuktikan** hal lain tidak rusak.

**Yang diajarkan tutor:**
- Kenapa "sudah saya cek, jalan kok" bukan bukti
- Cara memeriksa dampak: apa lagi yang memakai kode ini?
- Regression: kerusakan yang muncul **belakangan**

**Latihan inspeksi:**
1. Beri kode yang perlu diubah (bukan bug — perubahan permintaan).
2. Ubah. Lalu **buktikan** bagian lain tidak rusak — dengan menjalankan, bukan mengklaim.

**Kriteria lulus:** perubahan selesai **dan** ada bukti nyata (output terminal) bahwa
bagian lain masih bekerja. Klaim tanpa bukti = tidak lulus.

**Sumber:** `AGENTS.MD` repo (Iron Law: bukti, bukan klaim) · Bab 12 Sistem Verifikasi

### → GERBANG 4 setelah Unit 18

Proyek kecil hasil AI (3–6 file) + satu kalimat klaim. Tulis review: apakah klaimnya benar ·
satu cacat/risiko · keputusan terima/tolak **beserta alasannya**.

---

# BAGIAN PELENGKAP — Unit 19–20 (tidak bergerbang)

> **Kenapa terpisah:** dua unit ini melayani **data nyata** (JSON, tanggal, rupiah, pola
> teks) — bukan melatih cara berpikir baru. Karena itu ia **tidak bergerbang** dan
> **boleh diajarkan kapan saja setelah Tingkat 2**. Ia tidak mengubah Gerbang 1–4.
>
> **Kenapa ada:** audit cakupan vs MDN (26 Sep 2026) menemukan tiga hal yang **tidak
> diajarkan sama sekali** padahal wajib untuk aplikasi laporan keuangan:
> `JSON.parse` yang melempar error, `parseFloat` pada angka ber-koma Indonesia, dan
> desimal yang tidak eksak. Ketiganya **"hasil salah tanpa error"**. Detail:
> `cakupan-vs-mdn.md`.

---

## Unit 19 — JSON & bentuk data nyata

**Konsep:** data di aplikasi nyata **tidak hidup sebagai object** — ia hidup sebagai
**teks** (JSON). Setiap kali data masuk atau keluar, ia dikonversi. Di situlah error muncul.

**Yang diajarkan tutor:**
- JSON = bentuk teks dari object/array. Terlihat mirip JS, **tapi bukan JS**
  (kunci wajib kutip ganda, tidak ada komentar, tidak ada `undefined`)
- `JSON.stringify(obj)` → teks · `JSON.parse(teks)` → object
- **`JSON.parse` MELEMPAR ERROR** kalau teksnya tidak sesuai dugaan — penyebab crash
  nomor satu di aplikasi nyata. Wajib dibungkus `try/catch`.
- **Yang hilang saat dikonversi:** `undefined` menghilang · `Date` jadi teks ·
  `NaN` jadi `null` · fungsi hilang
- `JSON.stringify(obj, null, 2)` untuk dibaca manusia
- Kenapa aplikasi Electron memakai JSON untuk menyimpan & bertukar data

**Sintaks yang dikenali:** `JSON.parse()` · `JSON.stringify()` · `try/catch` di sekitarnya

**Latihan inspeksi:**
1. **KLAIM:** *"kode ini membaca data dari file, aman"* → verifikasi. Apakah ada `try/catch`?
   Apa yang terjadi kalau filenya kosong?
2. **TELUSUR:** beri kode yang jalan tanpa error tapi **hasilnya kosong** — ternyata
   `JSON.parse` pada string yang salah bentuk, dan errornya ditelan `catch {}` kosong.
3. **KLAIM:** *"setelah `stringify` lalu `parse`, datanya sama persis"* → verifikasi
   (coba dengan object yang punya `undefined` atau `Date`).

**Kriteria lulus:** bisa menunjukkan satu tempat di mana `JSON.parse` bisa melempar error,
dan bisa menyebut satu hal yang hilang saat object dikonversi ke JSON.

**Miskonsepsi yang paling sering muncul:**
- Mengira JSON dan object JavaScript itu sama (bisa langsung ditulis tanpa kutip)
- Mengira `catch {}` kosong itu "aman" — justru menyembunyikan sebab
- Mengira `Date` tetap `Date` setelah lewat JSON

**Sumber:** MDN §Standard built-in objects → Structured data → `JSON` ·
MDN §Control flow and error handling (try/catch)

---

## Unit 20 — Tanggal, angka lokal & pola teks

**Konsep:** aplikasi keuangan berurusan dengan **tanggal**, **rupiah**, dan **teks yang
harus diparsing**. Ketiganya punya jebakan yang **tidak menimbulkan error** — hanya angka
yang salah.

**Yang diajarkan tutor:**
- `new Date()` · `Date.now()` · `getFullYear()` / `getMonth()` / `getDate()`
  ⚠️ **`getMonth()` mulai dari 0** — Januari = `0`. Sumber bug klasik.
- Tanggal tersimpan sebagai **teks** setelah lewat JSON → harus diubah kembali
- **`Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })`** → `Rp1.234.567`
- **`Intl.DateTimeFormat("id-ID")`** → format tanggal Indonesia
- ⚠️ **Desimal tidak eksak:** `0.1 + 0.2 !== 0.3`. Untuk uang: hitung dalam **sen**
  (bilangan bulat) atau bulatkan di akhir — jangan bandingkan `===` pada hasil desimal
- ⚠️ **Koma vs titik:** `parseFloat("1.500,25")` → `1.5`. Data Indonesia memakai koma
  sebagai desimal. Ini **bug uang 1000×**.
- **Regex dasar:** `/pola/` · `\d` (angka) · `+` (satu atau lebih) · `g` (semua) ·
  `.match()` `.replace()` `.split()` `.trim()` `.includes()`
- ⚠️ Regex adalah tempat **paling mudah** membuat kode yang "terlihat benar" — cukup dikenali,
  tidak perlu dikuasai

**Sintaks yang dikenali:** `new Date()` · `Date.now()` · `getFullYear()` · `getMonth()` ·
`Intl.NumberFormat` · `Intl.DateTimeFormat` · `/pola/g` · `.replace()` `.split()` `.trim()`

**Latihan inspeksi:**
1. **KLAIM:** *"kode ini menampilkan bulan laporan yang benar"* → verifikasi.
   (Kalau kodenya `getMonth()`, hasilnya **satu bulan lebih awal**.)
2. **KLAIM (uang):** *"kode ini menghitung total rupiah dengan benar"* → verifikasi
   dengan input `"1.500,25"`.
3. **KLAIM (desimal):** *"`0.1 + 0.2` sama dengan `0.3`"* → jalankan. Apa hasilnya?
4. **UBAH:** ubah perhitungan uang supaya memakai bilangan bulat (sen). Bandingkan hasilnya.

**Kriteria lulus:** bisa menyebut **dua** dari tiga jebakan ini beserta contohnya —
`getMonth()` mulai dari 0 · `parseFloat` pada koma Indonesia · desimal tidak eksak.

**Miskonsepsi yang paling sering muncul:**
- Mengira `getMonth()` mengembalikan 1–12
- Mengira angka bertitik-ribu otomatis terbaca benar
- Mengira `0.1 + 0.2` pasti `0.3`

**Sumber:** MDN §Numbers and dates (`Date`, `Math`, `Number`) ·
MDN §Standard built-in objects → Internationalization (`Intl.NumberFormat`,
`Intl.DateTimeFormat`) · MDN §Regular expressions · MDN §Text processing (`String`)

---

## Setelah Gerbang 4

Yang sudah bisa dilakukan pembelajar:

- Membaca kode AI dan tahu **apa yang dilakukannya**
- Melacak nilai variabel tanpa menjalankan
- Menemukan cacat **dengan membaca** (statis)
- **Menelusuri sebab** saat hasilnya salah, walau tidak ada pesan error (dinamis)
- **Memperbaiki**, dan membuktikan perbaikannya tidak merusak
- Menulis review berisi keputusan yang beralasan
- Mengenali **± 50 bentuk sintaks** yang muncul di kode AI — dan tahu mana yang berbahaya
- Menangani **JSON, tanggal, angka lokal, dan pola teks** tanpa tertipu

**Ini titik "mahir" untuk tujuan MISSION.** Kalau pembelajar ingin lanjut ke arsitektur →
`/teach-system-design` di `belajar-arsitektur/`.

**Yang SENGAJA tidak diajarkan** (dan kenapa) ada di `cakupan-vs-mdn.md` §6 —
Typed arrays, generator, `Proxy`, bitwise, meta-programming. Semuanya karena
**menambah beban tanpa menambah kemampuan** untuk tujuan ini.
