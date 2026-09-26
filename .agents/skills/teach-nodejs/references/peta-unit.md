# Peta Unit — Detail per Unit (Node.js Mode Inspeksi)

> Referensi untuk skill `teach-nodejs`. **Tutor membaca file ini sendiri** — pembelajar
> tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **18 unit · 4 bagian · 4 gerbang.** Bagian 0 = **prasyarat** terminal + runtime.
> Setiap unit: **konsep · sintaks yang dikenali · yang diajarkan · latihan inspeksi ·
> kriteria lulus · sumber.**
> Satu unit = 1–2 sesi × maks 1 jam.
>
> **Kamus sintaks lengkap ada di `sintaks-node.md`.** Baris *"Sintaks yang dikenali"* di
> tiap unit hanya menyebut yang paling sering muncul.

---

## Aturan umum semua unit

| | |
|---|---|
| Bentuk sesi | 6 tahap: PREDIKSI → JALANKAN → BEDAH → UBAH → [PERBAIKI] → CATAT |
| Alat | Terminal + editor · Bagian 0–1: `node file.js` · Bagian 2–3: `node server.js` + `curl`/browser |
| Korpus | **Kode hasil generate AI** (lihat `korpus-ai.md`) |
| Ukuran kode | Bagian 0: 5–15 baris. Bagian 1: 10–30 baris. Bagian 2: 30–80 baris. Bagian 3: 3–8 file. |
| Aturan mutlak | `prediksi.md` ditulis & disimpan **sebelum** kode dijalankan |
| Sumber sitasi | `nodejs.org/api/<modul>` · `MDN: <topik>` · `RFC 9110` · `expressjs.com` · `PRIMM §<tahap>` |
| **Sintaks asing** | **JANGAN bilang "di luar materi"** → cek `sintaks-node.md`, jelaskan **satu bentuk**, lanjut |
| **Rahasia** | API key/password/token di korpus **diganti nilai palsu** sebelum disimpan |

**Cara memulai proyek (dilakukan tutor sekali, sebelum Bagian 2):**

```
mkdir proyek-fullstack && cd proyek-fullstack
npm init -y
```

Sebutkan ke pembelajar **apa yang baru saja terjadi** (`package.json` = kontrak proyek) —
tapi **jangan jadikan sesi sendiri**. Itu produksi, bukan inspeksi.

**Cek versi Node lebih dulu** (Unit 14 bergantung padanya):

```
node --version
```

---

# BAGIAN 0 — PRASYARAT: TERMINAL & RUNTIME (Unit 1–4)

> **Ini bukan pemanasan.** Node.js **hidup di terminal** — ia tidak punya jendela sendiri.
> Tanpa Bagian 0, setiap "kok tidak jalan" akan terasa seperti sihir.
> **Belum ada server, belum ada framework** — hanya file `.js` yang dijalankan dan
> teksnya muncul di terminal. Itu disengaja: satu hal pada satu waktu.

---

## Unit 1 — Terminal dan baris perintah

**Konsep:** Terminal adalah tempat kamu **memberi perintah ke komputer**, bukan tempat
menulis kode. Ia punya tiga pertanyaan dasar: *saya di mana*, *apa yang ada di sini*,
*apa yang bisa dijalankan*.

**Yang diajarkan tutor:**
- `pwd` (di mana saya), `ls` (apa yang ada di sini), `cd` (pindah folder)
- Menjalankan sesuatu: `node nama-file.js`
- **Exit code:** `0` = berhasil, **bukan-0 = gagal**. Cara melihatnya: `echo $?`
- Pesan error **bukan hukuman** — ia memberi tahu baris dan sebabnya
- Jalur relatif (`./data.json`) vs jalur absolut (`D:/proyek/data.json`)

**Sintaks yang dikenali:** `pwd` · `ls` · `ls -l` · `cd <folder>` · `cd ..` · `node <file>` ·
`echo $?` · `mkdir` · `cat <file>` · `npm <perintah>`

**Latihan inspeksi:**
1. Beri urutan 4 perintah. **LACAK:** prediksi output tiap baris **sebelum** dijalankan.
2. **TELUSUR:** perintah gagal dengan `ENOENT: no such file or directory` — cari sebabnya
   (salah folder? salah nama? ekstensi hilang?).
3. **KLAIM:** *"perintah ini akan berhasil"* → verifikasi lewat exit code.

**Kriteria lulus:** bisa menjalankan satu file `.js` dari folder yang benar, dan membaca
exit code untuk memastikan berhasil.

**Miskonsepsi yang paling sering muncul:**
- Mengira terminal dan editor itu sama (editor untuk **menulis**, terminal untuk **menjalankan**)
- Mengira "tidak ada output" berarti gagal (bisa jadi berhasil tapi memang tidak mencetak apa pun)
- Mengira jalur file boleh ditulis dengan gaya mana saja (Windows memakai `\`, POSIX memakai `/`)

**Sumber:** MDN: *Command line crash course* · nodejs.org/api/cli

---

## Unit 2 — Node = JavaScript di luar browser

**Konsep:** JavaScript yang sama, tapi **tempatnya berbeda**. Browser punya `window` dan
`document`; Node **tidak punya keduanya**. Sebagai gantinya Node punya `process` (info
tentang program yang sedang jalan) dan `console` (untuk mencetak).

**Yang diajarkan tutor:**
- Kenapa `document is not defined` dan `window is not defined` muncul di Node — dan itu **normal**
- `process.argv` (argumen dari terminal), `process.env` (variabel lingkungan), `process.exit()`
- `console.log` di Node **keluar ke terminal**, bukan ke console browser
- `globalThis` — nama netral untuk "objek global", yang ada di keduanya
- Kenapa `fetch` sekarang ada di Node (Node 18+) — dulu tidak

**Sintaks yang dikenali:** `console.log(...)` · `process.argv` · `process.env.NAMA` ·
`process.exit(1)` · `globalThis` · `setTimeout` · `__dirname` (⚠️ hanya di CommonJS)

**Latihan inspeksi:**
1. Beri 8 baris campuran. **LACAK:** baris mana yang **error di Node** kalau dijalankan,
   dan baris mana yang aman.
2. **SUSUN:** baris diacak → susun ulang jadi skrip yang mencetak satu kalimat dari argumen.
3. **KLAIM:** *"skrip ini membaca nama dari terminal"* → verifikasi (apakah benar `argv[2]`,
   bukan `argv[1]`?).

**Kriteria lulus:** dari 10 baris, bisa menandai mana yang khusus browser dan mana yang
khusus Node — tanpa menjalankan.

**Miskonsepsi yang paling sering muncul:**
- Mengira Node itu "browser tanpa tampilan" (bukan — ia runtime yang berbeda)
- Mengira `console.log` di Node bisa dilihat lewat DevTools browser
- Mengira `process.argv[1]` adalah argumen pertama (itu nama file; argumen mulai dari `[2]`)

**Sumber:** nodejs.org/api/globals · nodejs.org/api/process · MDN: *JavaScript*

---

## Unit 3 — npm & `package.json`

**Konsep:** `package.json` adalah **kontrak proyek**. Ia menyebut nama proyek, paket apa
yang dipakai, dan **perintah apa yang bisa dijalankan**. `node_modules` hanyalah hasil
pemasangan — ia bisa dibuang dan dipasang ulang kapan saja.

**Yang diajarkan tutor:**
- `npm install` vs `npm install <paket>` vs `npm install --save-dev <paket>`
- `dependencies` (dibutuhkan saat aplikasi jalan) vs `devDependencies` (hanya saat
  mengembangkan) — kenapa AI sering menaruh semuanya di tempat yang salah
- `package-lock.json` mengunci versi; **jangan diedit tangan**
- `npm run <script>` — dan kenapa `npm start` itu pintasan untuk `npm run start`
- **`.gitignore` wajib memuat `node_modules/`** — kalau tidak, ribuan file masuk git

**Sintaks yang dikenali:** `"scripts": { "start": "node index.js" }` · `"type": "module"` ·
`"main"` · `^1.2.3` vs `~1.2.3` vs `1.2.3` · `npm ci` · `npx`

**Latihan inspeksi:**
1. Beri satu `package.json` 15 baris hasil AI. **LACAK:** sebut **semua** perintah yang
   tersedia, dan paket apa yang dipasang.
2. **KLAIM:** *"untuk menjalankan proyek ini, cukup `node index.js`"* → verifikasi
   (mungkin sebenarnya `npm start`, dan `main` menunjuk file lain).
3. **TELUSUR:** `npm start` gagal dengan *"Missing script: start"* — cari sebabnya.

**Kriteria lulus:** dari satu `package.json` yang belum pernah dilihat, bisa menyebut
perintah yang benar untuk menjalankan proyek itu, dan file mana yang dijalankan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `node_modules` perlu dikirim/di-commit (tidak — cukup `package.json` + lock)
- Mengira `^` dan `~` itu sama
- Mengira `npm install` tanpa nama paket memasang **satu** paket (ia memasang **semua**)
- Mengira `devDependencies` tidak akan pernah dipakai saat aplikasi jalan

**Sumber:** nodejs.org/api/packages · npm docs: *package.json*, *npm-install*

---

## Unit 4 — Modul: ESM vs CommonJS

**Konsep:** Ada **dua sistem modul** di Node, dan keduanya **tidak boleh dicampur** dalam
satu file. ESM memakai `import`/`export`; CommonJS memakai `require`/`module.exports`.
Yang menentukan adalah `"type"` di `package.json` — atau ekstensi file.

**Yang diajarkan tutor:**
- ESM: `import x from "y"` · `export default` · `export { a, b }`
- CJS: `const x = require("y")` · `module.exports = { ... }`
- `"type": "module"` di `package.json` → seluruh folder jadi ESM
- Kenapa `require is not defined` muncul (file ESM mencoba `require`)
- Kenapa `Cannot use import statement outside a module` muncul (kebalikannya)
- **`__dirname` tidak ada di ESM** — penggantinya `import.meta.url`

**Sintaks yang dikenali:** `import ... from "..."` · `import { a } from "..."` ·
`export default` · `export const` · `require("...")` · `module.exports` ·
`import.meta.url` · `__dirname` · `__filename`

**Latihan inspeksi:**
1. Beri 10 baris campuran `import` dan `require`. **LACAK:** file ini ESM atau CJS —
   dan apa yang gagal saat dijalankan.
2. **SUSUN:** baris diacak → susun ulang jadi file ESM yang valid.
3. **KLAIM:** *"file ini bisa dijalankan apa adanya"* → verifikasi (cek `"type"` di
   `package.json` dulu).

**Kriteria lulus:** dari satu file + satu `package.json`, bisa memutuskan apakah file itu
akan jalan — **tanpa menjalankan**.

**Miskonsepsi yang paling sering muncul:**
- Mengira `import` dan `require` bisa dicampur bebas dalam satu file
- Mengira ekstensi `.js` menentukan ESM/CJS (yang menentukan `package.json`, kecuali `.mjs`/`.cjs`)
- Mengira `export default` dan `export` itu sama (yang pertama satu nilai, yang kedua bernama)
- Mengira `require` "lebih lama jadi lebih aman" (keduanya setara; yang salah adalah mencampur)

**Sumber:** nodejs.org/api/esm · nodejs.org/api/modules

---

### → GERBANG 1 setelah Unit 4

**Jalankan proyek Node hasil AI dari nol.** Detail: `roadmap-4-tingkat.md` §1.

---

# BAGIAN 1 — NODE DASAR (Unit 5–8)

> **Yang dilatih:** melihat skrip dan tahu **apa yang terjadi, dan kapan**.
> Ini bagian yang paling tidak bisa ditebak: **urutan waktu**. Node menjalankan baris
> async **tidak** dalam urutan tulisannya — dan itulah sumber bug yang paling sering
> tidak terlihat.

---

## Unit 5 — Modul bawaan: `fs`, `path`, `os`

**Konsep:** Node bisa membaca dan menulis file **tanpa browser**. Tapi jalur file bukan
teks biasa — ia **bergantung sistem operasi**. Windows memakai `\`, Linux/macOS memakai `/`.
`path.join` menyelesaikannya; merangkai `"/"` sendiri tidak.

**Yang diajarkan tutor:**
- `fs.readFile` (async, callback) · `fs.promises.readFile` (async, await) ·
  `fs.readFileSync` (**memblokir** — kenapa berbahaya di dalam server)
- `fs.writeFile`, `fs.existsSync`, `fs.mkdir` (dengan `{ recursive: true }`)
- **`path.join(__dirname, "data", "siswa.json")`** vs `__dirname + "/data/siswa.json"`
- `path.resolve` vs `path.join` (yang pertama jadi absolut)
- `os.platform()`, `os.homedir()` — saat skrip perlu tahu di mana ia berjalan
- **Format file:** `JSON.parse` / `JSON.stringify` — dan kenapa `JSON.parse` **melempar
  error** kalau isinya bukan JSON (harus di dalam `try`)

**Sintaks yang dikenali:** `fs.promises.readFile(p, "utf8")` · `fs.readFileSync` ·
`await fs.promises.writeFile(...)` · `path.join(a, b)` · `path.resolve` · `path.basename` ·
`JSON.parse` · `JSON.stringify(x, null, 2)` · `{ recursive: true }`

**Latihan inspeksi:**
1. **LACAK:** diberi urutan tulis → baca, prediksi **isi file** setelah tiap langkah.
2. **KLAIM:** *"skrip ini jalan di Windows dan Linux"* → verifikasi (apakah ada `+ "/"`?).
3. **TELUSUR:** file "tidak ditemukan" padahal ada — cari sebabnya (jalur relatif
   dihitung dari **folder tempat perintah dijalankan**, bukan folder file).

**Kriteria lulus:** bisa menyebut **satu baris** yang akan gagal di Windows, dan
menggantinya dengan versi yang benar.

**Miskonsepsi yang paling sering muncul:**
- Mengira `__dirname + "/data"` aman (di Windows hasilnya bisa `\` + `/` bercampur)
- Mengira jalur relatif dihitung dari lokasi **file** (dihitung dari lokasi **proses dijalankan**)
- Mengira `readFileSync` sama saja dengan `readFile` (yang pertama **menghentikan seluruh server**)
- Mengira `JSON.parse` selalu berhasil

**Sumber:** nodejs.org/api/fs · nodejs.org/api/path · nodejs.org/api/os

---

## Unit 6 — Async: callback → promise → `async`/`await` ⭐

**Konsep:** **`await` yang hilang tidak menghasilkan error.** Ia menghasilkan `Promise`
— sebuah "janji" yang belum ditepati. Ini **penyebab #1** data kosong di aplikasi Node,
dan ia **diam**. Tidak ada pesan merah. Hanya nilai yang salah.

**Yang diajarkan tutor:**
- Tiga generasi: callback (`(err, data) => {}`) → promise (`.then()`) → `async`/`await`
- **Aturan inti:** `await` hanya boleh dipakai di dalam fungsi `async`
- Kenapa `async function` **selalu** mengembalikan `Promise` — bahkan kalau isinya `return 5`
- **`await` hanya "menunggu" di titik itu.** Kode setelahnya pindah ke antrean — tidak
  langsung jalan
- `Promise.all([...])` — menjalankan beberapa sekaligus; kenapa `for` + `await` itu lambat
- Kenapa `array.forEach(async ...)` **tidak** menunggu apa pun — kesalahan yang paling
  sering dihasilkan AI

**Sintaks yang dikenali:** `async function f() {}` · `await g()` · `f().then(x => ...)` ·
`Promise.all([...])` · `new Promise((resolve, reject) => ...)` · `=> Promise<...>` (tanda
bahwa nilai belum di-`await`) · `forEach(async ...)` (🔴 tanda bahaya)

**Latihan inspeksi:**
1. **LACAK (wajib):** diberi kode yang membaca file lalu mencetak isinya — **tanpa
   `await`**. Prediksi apa yang tercetak: isi file, atau `Promise { <pending> }`?
2. **KLAIM:** *"fungsi ini mengembalikan daftar siswa"* → verifikasi (mungkin ia
   mengembalikan `Promise`).
3. **SUSUN:** baris diacak → susun ulang jadi fungsi async yang benar (dengan `await` di
   tempat yang tepat).
4. **TELUSUR:** daftar kosong padahal file ada dan ada isinya — cari baris penyebabnya.

**Kriteria lulus:** dari 3 fungsi, bisa menunjuk **mana yang mengembalikan nilai** dan
**mana yang mengembalikan `Promise`** — tanpa menjalankan.

**Miskonsepsi yang paling sering muncul:**
- Mengira `await` yang hilang akan error (tidak — ia **diam**)
- Mengira `async function` yang `return 5` mengembalikan `5` (mengembalikan `Promise<5>`)
- Mengira `forEach` + `async` akan menunggu (tidak menunggu sama sekali)
- Mengira `await` "membekukan" seluruh program (hanya fungsi itu yang menunggu)
- Mengira urutan `console.log` mengikuti urutan tulisan begitu ada `await`

**Sumber:** MDN: *async function*, *await*, *Promise* · nodejs.org/learn/asynchronous-work

---

## Unit 7 — Event loop & kenapa Node tidak berhenti

**Konsep:** Node **tidak** menjalankan baris secara berurutan begitu ada pekerjaan yang
lambat. Ia menaruh pekerjaan itu ke antrean, melanjutkan baris berikutnya, lalu kembali
saat hasilnya siap. Karena itu **urutan output bisa berbeda dari urutan tulisan**.

**Yang diajarkan tutor:**
- Satu "benang" (*thread*): kenapa Node bisa melayani banyak permintaan walau hanya satu
- Antrean: `setTimeout(fn, 0)` **tidak** berarti "sekarang" — ia masuk antrean
- `Promise`/`await` diproses **lebih dulu** daripada `setTimeout` (microtask vs macrotask)
- Kenapa proses **menggantung** (*hang*): ada pekerjaan yang belum selesai, jadi Node
  menunggu — bukan bug, tapi konsekuensi desain
- Kenapa `process.exit()` "memotong" pekerjaan yang belum selesai

**Sintaks yang dikenali:** `setTimeout(fn, 0)` · `setInterval` · `clearTimeout` ·
`queueMicrotask` · `process.exit(0)` · `await` (microtask) · `(err) => {}` callback

**Latihan inspeksi:**
1. **LACAK (wajib):** diberi campuran `console.log("A")`, `setTimeout(() => console.log("B"), 0)`,
   dan `await` — **prediksi urutan lengkap outputnya**, lalu jalankan.
2. **TELUSUR:** skrip tidak pernah selesai (terminal tidak kembali) — cari sebabnya.
3. **KLAIM:** *"`setTimeout(..., 0)` menjalankan kode sebelum baris berikutnya"* → verifikasi.

**Kriteria lulus:** dari satu skrip campuran, prediksi urutan output dengan benar
(minimal 70% — unit ini hanya punya satu pola).

**Miskonsepsi yang paling sering muncul:**
- Mengira `setTimeout(fn, 0)` jalan "langsung" (jalan **setelah** baris sinkron selesai)
- Mengira `await` dan `setTimeout` masuk antrean yang sama (tidak — `await` lebih dulu)
- Mengira program yang tidak berhenti itu "hang" (bisa jadi memang sedang menunggu)
- Mengira Node memakai banyak benang untuk kode JavaScript biasa (satu, kecuali worker threads)

**Sumber:** nodejs.org/learn/asynchronous-work · nodejs.org/api/timers

---

## Unit 8 — Error: `try`/`catch`, exit code, stack trace

**Konsep:** Di Node, **satu error tanpa penanganan bisa mematikan seluruh proses**.
Itu berbeda dari browser, di mana error hanya menghentikan satu skrip. Stack trace Node
**menyebut file, baris, dan jenis error** — ia bukan hiasan, ia peta.

**Yang diajarkan tutor:**
- `try { } catch (err) { }` dan `finally`
- **Error async tetap harus di-`catch`** — `try`/`catch` tidak menangkap error di dalam
  callback yang belum selesai
- `err.message` vs `err.stack` — dan kenapa `err.stack` **jangan** dikirim ke pengguna
- Jenis error yang sering: `ENOENT`, `EADDRINUSE`, `ERR_MODULE_NOT_FOUND`,
  `TypeError: Cannot read properties of undefined`
- `throw` vs `console.error` — yang pertama **menghentikan**, yang kedua **melanjutkan**
- **Exit code:** `process.exit(1)` saat gagal. Skrip otomasi bergantung padanya

**Sintaks yang dikenali:** `try { } catch (err) { }` · `finally` · `throw new Error("...")` ·
`err.message` · `err.stack` · `process.exit(1)` · `EADDRINUSE` · `ENOENT` · `?.` (opsional
chaining untuk menghindari `undefined`) · `??` (nullish)

**Latihan inspeksi:**
1. **LACAK:** diberi stack trace asli, sebut **file + baris + jenis error** tanpa
   menjalankan ulang.
2. **KLAIM:** *"error ini sudah ditangani"* → verifikasi (apakah `try`/`catch` benar-benar
   membungkus baris async-nya?).
3. **TELUSUR:** proses mati padahal tidak ada `throw` yang terlihat — cari sumbernya
   (error di dalam callback async yang tidak di-`await`).
4. **SUSUN:** susun ulang blok `try`/`catch`/`finally` yang diacak.

**Kriteria lulus:** dari satu stack trace, bisa menunjuk baris penyebabnya dalam
**satu** percobaan, tanpa menjalankan ulang.

**Miskonsepsi yang paling sering muncul:**
- Mengira `try`/`catch` menangkap error di dalam callback async
- Mengira `console.error` sama dengan `throw` (yang pertama tidak menghentikan)
- Mengira exit code tidak penting untuk skrip
- Mengira `err.stack` aman ditampilkan ke pengguna (bisa membocorkan struktur folder)

**Sumber:** nodejs.org/api/errors · MDN: *try...catch*, *Error*

---

### → GERBANG 2 setelah Unit 8

**Lacak alur async (ambang 50%).** Detail: `roadmap-4-tingkat.md` §2.

---

# BAGIAN 2 — MEMBANGUN SERVER (Unit 9–13)

> **Yang dilatih:** melihat file server dan tahu **apa yang salah, dan kenapa**.
> Urutannya disengaja: **HTTP mentah dulu**, baru Express. Framework menyembunyikan hal
> yang justru menjadi sumber bug — kalau tidak tahu apa yang disembunyikan, tidak bisa
> menilainya.

---

## Unit 9 — HTTP dasar

**Konsep:** Server adalah program yang **menunggu permintaan** lalu **mengirim jawaban**.
Permintaan dan jawaban punya bentuk yang sama setiap kali: method, jalur, header, body.
Status code adalah **cara server memberi tahu apa yang terjadi** — dan salah memilih
status code membuat React menangani hasilnya dengan keliru.

**Yang diajarkan tutor:**
- Bentuk request: `GET /siswa?kelas=6A HTTP/1.1` + header
- Bentuk response: status + header + body
- Method: `GET` (ambil), `POST` (buat), `PUT`/`PATCH` (ubah), `DELETE` (hapus)
- Status yang wajib dikenali: `200` `201` `204` `400` `401` `403` `404` `500`
- **`Content-Type: application/json`** — tanpa ini, React menerima teks, bukan objek
- Kenapa `fetch` di React **tidak** otomatis gagal pada `404` (harus dicek `res.ok`)

**Sintaks yang dikenali:** `GET`/`POST`/... · `200`/`201`/`400`/`401`/`403`/`404`/`500` ·
`Content-Type: application/json` · `req.method` · `req.url` · `req.headers` ·
`res.ok` · `res.status` · `res.json()`

**Latihan inspeksi:**
1. **LACAK:** diberi satu respons mentah, sebut: status berapa, berhasil atau tidak,
   dan apakah body-nya bisa di-`JSON.parse`.
2. **KLAIM:** *"endpoint ini memberitahu React kalau data tidak ditemukan"* → verifikasi
   (mungkin ia mengembalikan `200` dengan body kosong — itu **tidak** memberi tahu apa pun).
3. **SUSUN:** susun ulang urutan baris request HTTP.

**Kriteria lulus:** dari 5 respons, bisa menyebut mana yang **berhasil**, mana yang
**input salah**, dan mana yang **bug server** — tanpa melihat kodenya.

**Miskonsepsi yang paling sering muncul:**
- Mengira `200` selalu berarti "berhasil" (bisa `200` dengan body berisi error)
- Mengira `404` otomatis membuat `fetch` melempar error (tidak — harus cek `res.ok`)
- Mengira `500` cocok untuk input salah (itu `400`)
- Mengira `401` dan `403` itu sama (yang pertama "belum login", yang kedua "sudah login tapi tidak boleh")

**Sumber:** RFC 9110: *HTTP Semantics* · MDN: *HTTP*, *Status*

---

## Unit 10 — Server pertama: `node:http` mentah

**Konsep:** Sebelum framework, pahami **apa yang sebenarnya terjadi**. Server Node
hanyalah satu fungsi yang dipanggil **setiap kali** ada permintaan — dan fungsi itu harus
**mengakhiri** jawabannya sendiri.

**Yang diajarkan tutor:**
- `http.createServer((req, res) => { ... })` · `server.listen(3000)`
- Kenapa **`res.end()` wajib** — tanpa itu, browser menunggu selamanya
- `res.writeHead(200, { "Content-Type": "application/json" })`
- **Manual routing:** `if (req.url === "/siswa") { ... }` — dan kenapa ini cepat berantakan
- `EADDRINUSE` — port sudah dipakai; cara mengenali & mengatasinya
- Apa yang Express nanti sembunyikan: parsing body, routing, middleware, error handling

**Sintaks yang dikenali:** `http.createServer` · `req` · `res` · `res.writeHead` ·
`res.end(...)` · `server.listen(3000, cb)` · `req.url` · `req.method` · `EADDRINUSE`

**Latihan inspeksi:**
1. **LACAK:** diberi server 15 baris, prediksi respons untuk **tiga** URL berbeda.
2. **TELUSUR:** browser "memuat terus" tanpa hasil — cari baris penyebabnya (biasanya
   `res.end()` hilang di satu cabang `if`).
3. **KLAIM:** *"server ini melayani dua endpoint"* → verifikasi (apakah ada cabang `if`
   yang tidak pernah tercapai?).

**Kriteria lulus:** bisa menjalankan server, memanggilnya dari browser, dan menjelaskan
kenapa halaman itu muncul — **tanpa** framework.

**Miskonsepsi yang paling sering muncul:**
- Mengira `res.end()` opsional
- Mengira `req.url` sudah bersih (ia memuat query string: `/siswa?kelas=6A`)
- Mengira server berhenti sendiri setelah satu permintaan (ia terus berjalan)
- Mengira "port sudah dipakai" itu bug kode (bukan — ada proses lain yang menempatinya)

**Sumber:** nodejs.org/api/http

---

## Unit 11 — Express: routing & middleware

**Konsep:** Express mengubah `if (req.url === ...)` menjadi **routing** yang rapi, dan
menambahkan **middleware** — fungsi yang dijalankan **berurutan** untuk setiap permintaan.
Urutan middleware menentukan hasilnya. Yang **terakhir cocok** menang.

**Yang diajarkan tutor:**
- `app.get("/siswa", handler)` · `app.post(...)` · `app.use(...)`
- `req.params` (dari pola URL), `req.query` (dari `?`), `req.body` (dari POST)
- **`express.json()` wajib** untuk membaca body JSON — tanpa itu `req.body` = `undefined`
- Middleware berurutan; `next()` melanjutkan, tidak memanggil `next()` = berhenti di situ
- Middleware error: `(err, req, res, next)` — **empat** argumen, dan urutannya penting
- Kenapa route yang diletakkan setelah `app.use(...)` bisa "tertelan"

**Sintaks yang dikenali:** `express()` · `app.use(express.json())` · `app.get/post/put/delete` ·
`req.params.id` · `req.query.kelas` · `req.body` · `res.json(...)` · `res.status(404).json(...)` ·
`next()` · `(err, req, res, next) => {}` (4 argumen) · `app.listen(3000)`

**Latihan inspeksi:**
1. **LACAK (wajib):** diberi 5 middleware + 2 route, sebut **urutan** yang dijalankan
   untuk satu permintaan, dan apakah permintaan itu selesai atau berhenti di tengah.
2. **KLAIM:** *"`req.body` berisi data yang dikirim React"* → verifikasi (apakah
   `express.json()` dipasang **sebelum** route-nya?).
3. **TELUSUR:** satu endpoint selalu balas `404` padahal route-nya ada — cari sebabnya
   (urutan? metode salah? jalur beda satu huruf?).
4. **SUSUN:** susun ulang urutan middleware.

**Kriteria lulus:** dari satu file Express, bisa menggambar **urutan** yang dijalankan
untuk satu permintaan tertentu.

**Miskonsepsi yang paling sering muncul:**
- Mengira `req.body` selalu ada (hanya kalau `express.json()` dipasang lebih dulu)
- Mengira urutan middleware tidak penting
- Mengira middleware error punya **tiga** argumen (harus empat)
- Mengira `next()` opsional (tanpa itu, permintaan menggantung)
- Mengira `app.listen()` "mengembalikan" server yang bisa di-`await`

**Sumber:** expressjs.com: *Routing*, *Using middleware*, *Error handling*

---

## Unit 12 — Menerima data & memvalidasi

**Konsep:** Server tidak boleh mempercayai apa pun yang datang dari luar. **Input salah
harus dijawab `400`** — bukan `500`. `500` berarti "server saya yang salah"; memakai
`500` untuk input salah membuat React menampilkan pesan yang menyesatkan.

**Yang diajarkan tutor:**
- Tiga sumber data: `req.params` (dari jalur), `req.query` (dari `?`), `req.body` (dari POST)
- **Validasi wajib sebelum dipakai:** `if (!kelas) return res.status(400).json({...})`
- Kenapa validasi harus **sebelum** menyentuh database
- Kenapa `return` penting di dalam handler (tanpa itu, kode berlanjut setelah error dikirim)
- **Jangan pernah merangkai query dari input pengguna** (Unit 14/15 melanjutkan ini)
- Bentuk jawaban error yang konsisten: `{ error: "..." }` — supaya React bisa membacanya

**Sintaks yang dikenali:** `req.body.nama` · `req.query.kelas` · `req.params.id` ·
`res.status(400).json({ error: "..." })` · `if (!x) return ...` · `Number(x)` ·
`Array.isArray(x)` · `x?.trim()`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"endpoint ini mengembalikan 400 kalau `kelas` kosong"* → verifikasi
   (apakah `return` ada? apakah dicek `undefined` **dan** string kosong?).
2. **LACAK:** diberi 3 permintaan berbeda, prediksi status code untuk masing-masing.
3. **TELUSUR:** React menampilkan "server error" padahal pengguna hanya salah mengisi —
   cari sebabnya (status code tertukar).
4. **SUSUN:** susun ulang urutan validasi.

**Kriteria lulus:** dari satu handler, bisa menyebut **satu input** yang akan lolos
validasi padahal seharusnya tidak.

**Miskonsepsi yang paling sering muncul:**
- Mengira `400` dan `500` bisa dipakai bergantian
- Mengira validasi "sudah ada" karena ada `if` — padahal tanpa `return`
- Mengira `req.body.x` aman kalau `req.body` sendiri `undefined`
- Mengira data dari React otomatis benar karena "kita yang menulis React-nya"

**Sumber:** expressjs.com: *Routing* · RFC 9110 §15

---

## Unit 13 — CORS & menyambung ke React ⭐

**Konsep:** React berjalan di `http://localhost:5173`, API di `http://localhost:3000`.
Bagi **browser**, itu **dua asal yang berbeda** — dan browser **menolak** permintaan
lintas asal kecuali server **mengizinkan** secara eksplisit. Ini **bukan** bug di kode
React, dan bukan bug di kode Node. Ini aturan keamanan browser.

**Yang diajarkan tutor:**
- Apa itu "asal" (*origin*): protokol + host + port — **ketiganya** harus sama
- Kenapa `localhost:5173` → `localhost:3000` dianggap lintas asal (port berbeda)
- Header `Access-Control-Allow-Origin` — dikirim **server**, bukan browser
- **Preflight:** browser mengirim `OPTIONS` lebih dulu untuk permintaan tertentu
- Dua solusi: (a) `cors()` di Express, (b) **proxy** di Vite (dev) — dan kapan pakai yang mana
- Pesan error CORS **tidak muncul di terminal Node** — ia muncul di **console browser**.
  Ini sebab paling sering orang "mencari bug di tempat yang salah"
- Di produksi, satu origin (Node melayani React) **menghapus** masalah CORS

**Sintaks yang dikenali:** `Access-Control-Allow-Origin` · `cors()` · `app.use(cors())` ·
`OPTIONS` · `origin: "http://localhost:5173"` · `credentials: true` · Vite
`server.proxy` · `fetch("http://localhost:3000/...")`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"React sudah bisa memanggil API ini"* → verifikasi di **console
   browser** (bukan terminal).
2. **TELUSUR:** API berfungsi di `curl`/browser langsung, tapi gagal dari React — cari
   sebabnya. (Petunjuk yang benar untuk tutor: **jangan** tunjuk CORS; biarkan pembelajar
   menemukan bahwa tempat mencari errornya berbeda.)
3. **LACAK:** prediksi header apa yang dikirim server untuk permintaan dari React vs `curl`.
4. **SUSUN:** susun urutan preflight `OPTIONS` → permintaan asli.

**Kriteria lulus:** bisa menjelaskan **kenapa** `curl` berhasil tapi React gagal, dan
menyebut **dua** cara memperbaikinya.

**Miskonsepsi yang paling sering muncul:**
- Mengira CORS itu bug (ia **perlindungan**)
- Mengira CORS bisa "dimatikan" dari sisi React
- Mengira error CORS muncul di terminal Node (muncul di console browser)
- Mengira `localhost:5173` dan `localhost:3000` itu asal yang sama
- Mengira `cors()` tanpa konfigurasi selalu aman untuk produksi (tidak — ia mengizinkan semua)

**Sumber:** MDN: *CORS*, *Same-origin policy* · expressjs.com: *CORS* · Vite Docs: *Server Options*

---

### → GERBANG 3 setelah Unit 13

**Inspeksi file server orang lain.** Detail: `roadmap-4-tingkat.md` §3.

---

# BAGIAN 3 — DATA, AMAN, DEPLOY (Unit 14–18)

> **Yang dilatih:** menemukan masalah pada server, **menelusuri sebabnya**, dan
> **memutuskan apakah aman dijalankan**.
> Unit 15 dan 16 adalah **inti seluruh roadmap**: keduanya **tidak menimbulkan error**.
> Hanya data yang kosong, atau rahasia yang bocor tanpa ada yang tahu.

---

## Unit 14 — Menyimpan data: database & SQL dasar

**Konsep:** Data di dalam variabel **hilang** saat program berhenti. Database menyimpan
data **di luar** program. Ia bekerja seperti tabel: kolom, baris, dan pertanyaan (*query*)
untuk mengambilnya.

> **Node 26 punya `node:sqlite` bawaan** — database berbasis file, tanpa server terpisah.
> Ini dipilih supaya pembelajar **tidak tersandung dua masalah sekaligus**. Untuk
> produksi, PostgreSQL/MySQL lebih lazim — dan itu sengaja tidak diajarkan di sini
> (`cakupan-vs-dokumen-resmi.md` §6). **Cek `node --version` dulu.**

**Yang diajarkan tutor:**
- Kenapa data harus keluar dari memori (restart = hilang)
- Tabel, kolom, baris; tipe sederhana (`TEXT`, `INTEGER`)
- Empat query yang cukup: `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`
- **`?` sebagai penanda nilai** (`db.run("INSERT ... VALUES (?)", [nama])`) — dan kenapa
  ini **wajib** (Unit 15 melanjutkan: kalau tidak, ada injeksi)
- `SELECT` mengembalikan **array** — array kosong itu **sah**, bukan error
- Kenapa "query benar tapi hasil kosong" adalah pertanyaan yang berbeda dari "query error"

**Sintaks yang dikenali:** `new DatabaseSync("data.db")` · `db.exec(...)` · `db.prepare(...)` ·
`.run(...)` · `.get(...)` · `.all(...)` · `SELECT * FROM ...` · `INSERT INTO ... VALUES (?)` ·
`WHERE kelas = ?` · `[nilai]` (parameter)

**Latihan inspeksi:**
1. **LACAK:** diberi satu query, sebut: tabel apa, kolom apa, dan **bentuk** hasilnya
   (array? satu baris? angka?).
2. **KLAIM:** *"query ini mengembalikan siswa kelas 6A"* → verifikasi.
3. **TELUSUR:** daftar kosong padahal tabel ada dan kodenya tidak error — cari sebabnya
   (tabel kosong? nama kolom beda? nilai `WHERE` beda huruf besar/kecil?).

**Kriteria lulus:** dari satu query, bisa menyebut apakah hasilnya **array kosong** atau
**error** — dan kenapa.

**Miskonsepsi yang paling sering muncul:**
- Mengira "hasil kosong" itu error (bukan — `SELECT` yang tidak cocok mengembalikan `[]`)
- Mengira `INSERT` mengembalikan barisnya (ia mengembalikan info perubahan)
- Mengira nama tabel/kolom bisa ditulis bebas (harus persis)
- Mengira database otomatis "ada" (file-nya dibuat saat pertama dipakai — atau tidak)

**Sumber:** nodejs.org/api/sqlite · nodejs.org/api/cli (untuk cek versi)

---

## Unit 15 — Kenapa data saya kosong ⭐

**Konsep:** Ini unit **terpenting** di seluruh roadmap. Ada **empat sebab** data kosong,
dan **keempatnya tidak menimbulkan error**:

| # | Sebab | Gejala | Perbaikan |
|---|---|---|---|
| a | **`await` hilang** | Tercetak `Promise { <pending> }` atau `[object Promise]` | Tambahkan `await` |
| b | **`req.body` belum di-parse** | `req.body` = `undefined`, lalu error "cannot read" | Pasang `express.json()` **sebelum** route |
| c | **Nama field beda** | Kirim `kelas`, baca `class` → `undefined` | Samakan nama; validasi wajib |
| d | **Query benar, tabel kosong** | Tidak error, hasil `[]` | Cek datanya benar-benar ada |

Semuanya **diam**. Tidak ada pesan merah. Hanya daftar yang kosong.

**Yang diajarkan tutor:**
- Cara **membedakan** empat sebab ini — dan urutan memeriksanya
- Teknik **mempersempit**: cetak **satu** nilai, bukan lima
- Kenapa "cetak semuanya" membuat masalah **lebih sulit** dilihat, bukan lebih mudah
- Perbedaan `undefined` · `null` · `[]` · `""` — dan mana yang artinya apa
- Kembalinya ke Unit 6: `await` yang hilang **tidak** error

**Sintaks yang dikenali:** `Promise { <pending> }` · `[object Promise]` · `undefined` ·
`null` · `[]` · `Object.keys(x)` · `console.log({ x })` (cetak berlabel) ·
`JSON.stringify(x, null, 2)`

**Latihan inspeksi:**
1. **TELUSUR (wajib, dua kali):**
   - **(i)** Server jalan, endpoint membalas `200`, tapi `data` kosong. Tidak ada error
     di terminal. Cari baris penyebabnya. **Dugaan ditulis sebelum menyentuh kode.**
   - **(ii)** Sama, tapi kali ini sebabnya nama field berbeda. Pembelajar harus
     menemukan bahwa masalahnya ada di **dua tempat** (yang mengirim dan yang membaca).
2. **KLAIM:** *"endpoint ini mengembalikan daftar siswa"* → verifikasi: apakah
   mengembalikan array, `Promise`, atau `undefined`?
3. **LACAK:** prediksi isi variabel **sebelum** dan **sesudah** `await`.

**Kriteria lulus:** dari satu proyek yang daftarnya kosong, bisa menunjuk baris penyebab
**dan** menyebut **yang mana dari empat sebab** itu — dalam dua dugaan atau kurang.

**Miskonsepsi yang paling sering muncul:**
- Mengira data kosong berarti query-nya salah (bisa jadi `await`-nya yang hilang)
- Mengira tidak ada error berarti tidak ada masalah
- Mengira `console.log` semua variabel = debugging (itu **menebak**, bukan memburu)
- Mengira `[]` dan `undefined` itu sama (yang pertama "ada tapi kosong", yang kedua "tidak ada")

**Sumber:** nodejs.org/api/ · expressjs.com · `korpus-ai.md` §4(d) (protokol TELUSUR)

---

## Unit 16 — Rahasia & konfigurasi

**Konsep:** API key, password database, dan token **bukan** bagian dari kode. Ia hidup di
**variabel lingkungan**. Dan begitu rahasia **pernah** masuk ke git, ia harus dianggap
**sudah bocor** — menghapusnya di commit berikutnya **tidak** menghapusnya dari riwayat.

**Yang diajarkan tutor:**
- `.env` untuk menyimpan rahasia; `.gitignore` untuk **tidak** mengirimnya
- Node 20.6+ bisa memuatnya sendiri: `node --env-file=.env server.js` (tidak perlu paket)
- `process.env.NAMA` — dan kenapa nilainya `undefined` kalau file belum dimuat
- **`.env.example`** — file yang di-commit, berisi **nama** variabel tanpa nilainya
- Kenapa rahasia yang pernah ter-commit harus **diganti**, bukan hanya dihapus
- **Jangan `console.log` token** — log sering dikirim ke tempat yang bisa dibaca orang lain
- Kenapa jangan menempelkan `.env` ke AI

**Sintaks yang dikenali:** `process.env.NAMA` · `node --env-file=.env` · `.env` ·
`.env.example` · `.gitignore` · `PORT=3000` · `?? "3000"` (nilai cadangan) · `dotenv`
(paket lama — masih banyak di kode AI)

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"file ini aman di-commit"* → verifikasi (apakah ada nilai
   rahasia? apakah `.env` ada di `.gitignore`?).
2. **TELUSUR:** aplikasi gagal start dengan *"missing required environment variable"* —
   cari sebabnya.
3. **LACAK:** prediksi `process.env.PORT` untuk tiga situasi: file ada, file tidak ada,
   dan variabel ada tapi kosong.

**Kriteria lulus:** dari satu daftar file, bisa menyebut **mana yang tidak boleh
di-commit**, dan kenapa.

**Miskonsepsi yang paling sering muncul:**
- Mengira `.env` aman selama tidak ada yang membukanya
- Mengira menghapus rahasia di commit baru = sudah aman (riwayat git masih menyimpannya)
- Mengira `process.env.X` selalu berisi string (bisa `undefined`)
- Mengira `process.env.PORT` berupa angka (selalu **string** — perlu `Number(...)`)
- Mengira `.env` boleh dikirim ke AI untuk "diperiksa"

**Sumber:** nodejs.org/api/environment_variables · nodejs.org/api/cli (`--env-file`)

---

## Unit 17 — Login & sesi

**Konsep:** Password **tidak pernah** disimpan apa adanya. Yang disimpan adalah **hasil
acak** (*hash*) — dan hasil itu tidak bisa dikembalikan menjadi password. Saat pengguna
login, password yang diketik di-hash lagi, lalu **hasilnya** dibandingkan.

**Yang diajarkan tutor:**
- Hashing vs enkripsi — yang pertama **satu arah**, yang kedua bisa dibalik
- `node:crypto` — `scryptSync` (atau `bcrypt` bila pakai paket)
- **Salt:** kenapa dua password yang sama harus menghasilkan hash berbeda
- **Perbandingan waktu-tetap** (`crypto.timingSafeEqual`) — dan kenapa `===` berbahaya
  untuk rahasia
- Session (cookie, disimpan server) vs token (dikirim di header) — cukup dikenali, tidak
  perlu dipilih salah satu
- `401` (belum login) vs `403` (sudah login, tidak boleh)
- **Jangan pernah** mengirim password/hash ke React

**Sintaks yang dikenali:** `crypto.scryptSync` · `crypto.randomBytes` · `crypto.timingSafeEqual` ·
`hash === hash` (🔴 tanda bahaya) · `bcrypt.hash` · `bcrypt.compare` · `res.cookie(...)` ·
`Authorization: Bearer <token>` · `401` · `403`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"login ini aman"* → verifikasi (apakah password disimpan polos?
   apakah perbandingannya waktu-tetap?).
2. **TELUSUR:** login selalu gagal walau password benar — cari sebabnya (hash disimpan
   tapi dibandingkan dengan password asli, atau salt dibuat ulang setiap kali).
3. **LACAK:** prediksi isi database setelah dua pengguna mendaftar dengan password sama.

**Kriteria lulus:** dari satu file login, bisa menyebut **satu cacat keamanan** dan
menjelaskan akibatnya.

**Miskonsepsi yang paling sering muncul:**
- Mengira hashing bisa dibalik
- Mengira `===` cukup untuk membandingkan hash
- Mengira salt itu "bumbu tambahan" yang opsional
- Mengira password yang dikirim lewat HTTPS aman untuk **disimpan** polos
- Mengira `401` dan `403` bisa dipakai bergantian

**Sumber:** nodejs.org/api/crypto · MDN: *HTTP authentication*

---

## Unit 18 — Menyatukan fullstack & deploy

**Konsep:** Aplikasi fullstack **bukan** dua aplikasi yang saling memanggil selamanya.
Pada akhirnya, React di-**build** menjadi file statis, lalu **Node yang melayaninya** —
sehingga semuanya berada di **satu asal**, dan masalah CORS **hilang dengan sendirinya**.

**Yang diajarkan tutor:**
- `npm run build` → folder `dist/` berisi HTML/CSS/JS statis
- `express.static(...)` untuk melayani folder itu dari Node
- Kenapa **satu origin** lebih sederhana (dan lebih aman) daripada dua origin + CORS
- **Jalur di produksi berbeda:** `/api/siswa` vs `http://localhost:3000/siswa`
- `NODE_ENV=production` dan kenapa ia mengubah perilaku
- Apa yang **tidak** boleh ikut ke produksi: `.env` asli, `node_modules` dari mesin lain,
  `console.log` berisi rahasia
- **HTTPS** di produksi — dan kenapa password tidak boleh lewat HTTP biasa
- Menyatakan **keputusan**: *"ini layak deploy atau tidak"*, dengan alasan

**Sintaks yang dikenali:** `npm run build` · `dist/` · `express.static("dist")` ·
`app.get("*", ...)` (fallback SPA) · `NODE_ENV` · `process.env.NODE_ENV` · `PORT` ·
`app.listen(process.env.PORT)`

**Latihan inspeksi:**
1. **KLAIM (wajib):** *"aplikasi ini siap deploy"* → verifikasi (cek `.gitignore`,
   `.env`, `console.log`, jalur API, port).
2. **TELUSUR (wajib):** di lokal semua jalan; setelah di-build, halaman putih atau
   "Cannot GET /siswa". Cari sebabnya (jalur API masih menunjuk `localhost:3000`, atau
   `express.static` dipasang setelah route).
3. **SUSUN:** susun urutan yang benar: `express.json()` → route API → `express.static` →
   fallback SPA → `app.listen`.
4. **KEPUTUSAN:** tulis review akhir — terima atau tolak, dengan alasan.

**Kriteria lulus:** bisa menyebut **dua hal** yang berbeda antara menjalankan di lokal
dan menjalankan di produksi — dan kenapa keduanya penting.

**Miskonsepsi yang paling sering muncul:**
- Mengira "jalan di laptop saya" berarti "siap deploy"
- Mengira `node_modules` perlu di-upload (cukup `package.json` + `npm install`)
- Mengira React dan Node harus selalu di dua server berbeda
- Mengira `NODE_ENV` sekadar label (ia mengubah perilaku)
- Mengira halaman putih itu "bug React" (bisa jadi jalur API yang salah setelah build)

**Sumber:** Vite Docs: *Building for Production* · expressjs.com: *Serving static files* ·
nodejs.org/api/cli

---

### → GERBANG 4 setelah Unit 18

**Temukan, telusuri, putuskan.** Detail: `roadmap-4-tingkat.md` §4.

---

## Setelah Gerbang 4

Roadmap ini berhenti di **"bisa menilai kode backend dan memutuskan layak-tidaknya"** —
bukan di "bisa membangun aplikasi produksi". Itu **disengaja**: menilai lebih dulu,
membangun kemudian.

Yang **belum** diajarkan di sini (dan di mana melanjutkannya):

| Mau ke mana | Ke mana |
|---|---|
| Arsitektur aplikasi nyata (skala, batas modul) | `/teach-system-design` |
| Performance & stress testing | `/teach-test-ladder` |
| Analisis arsitektur aplikasi nyata | `/teach-case-study` |
| Tampilan frontend (CSS/Tailwind) | `/teach-tailwindcss` |
| React lebih dalam | `/teach-react` |
| Menganalisis kode (struktur data & algoritma) | `/teach-dsa` |
| Membangun aplikasi sungguhan dari nol | `/idea-clarifier` → pipeline produksi (Bab 27) |

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `teach-react/references/peta-unit.md`
