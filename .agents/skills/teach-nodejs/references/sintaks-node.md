# Kamus Sintaks — Terminal, Node.js & JavaScript Sisi Server

> Referensi untuk skill `teach-nodejs`. **Tutor membaca file ini sendiri** dan
> menjelaskannya **satu bentuk per kejadian** (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 26 September 2026 · **Kerangka asal:** `teach-react/references/sintaks-react.md`
>
> **Aturan pemakaian (penting):**
> - Pembelajar **bertanya** *"perintah/tanda ini apa?"* → jawab **satu bentuk**, 1–2 kalimat,
>   kaitkan ke unit, lalu **lanjut**.
> - **JANGAN** menjelaskan lima bentuk sekaligus. Menumpuk = menenggelamkan.
> - **JANGAN** menyuruh pembelajar membaca file ini sendiri.
> - **JANGAN** bilang *"itu di luar materi"*. Kode AI memakai semua ini sejak baris pertama.
>
> **Tingkat bahaya:**
> - 🔴 **Berbahaya** — sering jadi sumber bug nyata, atau masalah keamanan
> - 🟡 **Perlu hati-hati** — benar kalau dipakai tepat, salah kalau tidak
> - ⚪ **Aman** — cukup dikenali
>
> **Batas kejujuran:** tingkat bahaya di sini adalah **penilaian**, bukan hasil riset.

---

## A. Terminal — perintah dasar

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `pwd` | *print working directory* — saya sedang di folder mana | ⚪ | 1 |
| `ls` / `ls -l` | daftar isi folder (yang kedua dengan detail) | ⚪ | 1 |
| `cd <folder>` | pindah folder · `cd ..` naik satu tingkat | ⚪ | 1 |
| `mkdir <nama>` | membuat folder | ⚪ | 1 |
| `node <file.js>` | menjalankan file dengan Node | ⚪ | 1 |
| `node --version` | versi Node yang terpasang | ⚪ | 1, 14 |
| `echo $?` | **exit code** perintah terakhir — `0` berhasil, selain itu gagal | 🟡 | 1 |
| `cat <file>` | menampilkan isi file di terminal | ⚪ | 1 |
| `npm install` | memasang **semua** paket dari `package.json` | 🟡 | 3 |
| `npm install <paket>` | memasang satu paket | ⚪ | 3 |
| `npm install --save-dev <paket>` | memasang paket hanya untuk pengembangan | 🟡 | 3 |
| `npm run <script>` | menjalankan script dari `package.json` | ⚪ | 3 |
| `npm start` | pintasan untuk `npm run start` | ⚪ | 3 |
| `npx <paket>` | menjalankan paket tanpa memasangnya permanen | ⚪ | 3 |
| `node --env-file=.env server.js` | menjalankan sambil memuat variabel lingkungan | 🟡 | 16 |
| `Ctrl + C` | menghentikan proses yang sedang berjalan | ⚪ | 1, 10 |

> **Yang paling sering ditanya:** *"kenapa terminal saya tidak kembali?"* → prosesnya
> masih berjalan (server, `setInterval`, atau pekerjaan async yang belum selesai).
> Itu **normal**. Hentikan dengan `Ctrl + C`. (Unit 7)

---

## B. Node — runtime (beda dari browser)

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `console.log(x)` | mencetak ke **terminal** (bukan DevTools browser) | ⚪ | 2 |
| `process.argv` | argumen dari terminal. `[0]`=node, `[1]`=file, `[2]`=argumen pertama | 🟡 | 2 |
| `process.env.NAMA` | variabel lingkungan — **selalu string**, bisa `undefined` | 🔴 | 2, 16 |
| `process.exit(1)` | menghentikan program dengan kode gagal | 🟡 | 2, 8 |
| `globalThis` | objek global — ada di Node **dan** browser | ⚪ | 2 |
| `window` / `document` | **TIDAK ADA di Node** → `ReferenceError` | ⚪ | 2 |
| `__dirname` / `__filename` | folder & jalur file ini — **hanya di CommonJS** | 🟡 | 4, 5 |
| `import.meta.url` | pengganti `__dirname` di ESM | 🟡 | 4 |
| `setTimeout(fn, 0)` | menjalankan `fn` **setelah** baris sinkron selesai — bukan "sekarang" | 🔴 | 7 |
| `setInterval(fn, ms)` | menjalankan berulang → **membuat proses tidak berhenti** | 🟡 | 7 |
| `fetch(url)` | tersedia di Node 18+ | ⚪ | 9 |

> **Kalau pembelajar bertanya "kenapa `document is not defined`?"** → jelaskan:
> Node tidak punya halaman web. Tidak ada `document`, tidak ada `window`. Yang ada
> `process` dan `console`. **Satu kalimat. Lanjut.** (Unit 2)

---

## C. Modul — ESM vs CommonJS

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `import x from "y"` | ESM: ambil nilai default | ⚪ | 4 |
| `import { a, b } from "y"` | ESM: ambil yang bernama | ⚪ | 4 |
| `export default x` | ESM: kirim satu nilai utama | 🟡 | 4 |
| `export const a = ...` | ESM: kirim nilai bernama | ⚪ | 4 |
| `const x = require("y")` | CommonJS: ambil modul | ⚪ | 4 |
| `module.exports = { ... }` | CommonJS: kirim nilai | ⚪ | 4 |
| `"type": "module"` di `package.json` | seluruh folder jadi ESM | 🟡 | 4 |
| `require is not defined` | file ESM mencoba memakai `require` | 🔴 | 4 |
| `Cannot use import statement outside a module` | file CJS memakai `import` | 🔴 | 4 |

> **Aturan satu kalimat:** dalam satu file, **pilih satu** — `import` atau `require`.
> Mencampur keduanya = error. Yang menentukan bukan ekstensi, tapi `"type"` di
> `package.json`. (Unit 4)

---

## D. Async — bentuk yang paling sering muncul

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `async function f() {}` | fungsi yang **selalu** mengembalikan `Promise` | 🟡 | 6 |
| `await g()` | menunggu hasil di **titik itu** saja | ⚪ | 6 |
| `f().then(x => ...)` | gaya lama; sama artinya dengan `await` | 🟡 | 6 |
| `Promise.all([...])` | menjalankan beberapa sekaligus | 🟡 | 6 |
| `Promise { <pending> }` | **tanda `await` hilang** — nilai belum ditepati | 🔴 | **6, 15** |
| `[object Promise]` | sama — nilai di-`await` tapi dicetak sebagai teks | 🔴 | **6, 15** |
| `for (const x of arr) await f(x)` | menunggu satu per satu (lambat, tapi benar) | 🟡 | 6 |
| `arr.forEach(async x => ...)` | **tidak menunggu apa pun** — kesalahan klasik AI | 🔴 | **6** |
| `new Promise((resolve, reject) => ...)` | membuat janji sendiri | 🟡 | 6 |
| `queueMicrotask(fn)` | menjalankan sebelum timer | ⚪ | 7 |

> **Cara mengenali `await` yang hilang tanpa menjalankan:** kalau sebuah fungsi `async`
> dipanggil **tanpa** `await` dan hasilnya dipakai langsung, nilainya adalah `Promise`.
> (Unit 6 — unit terpenting Bagian 1)

---

## E. File & jalur — `fs`, `path`, `JSON`

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `fs.promises.readFile(p, "utf8")` | baca file (async) — **wajib `await`** | 🟡 | 5 |
| `fs.readFileSync(p, "utf8")` | baca file (memblokir) — **server membeku** | 🔴 | 5 |
| `await fs.promises.writeFile(p, isi)` | tulis file | 🟡 | 5 |
| `fs.existsSync(p)` | apakah file/folder ada | ⚪ | 5 |
| `path.join(a, b)` | **cara benar** menggabung jalur (Windows/POSIX) | ⚪ | 5 |
| `a + "/" + b` | 🔴 cara salah — Windows memakai `\` | 🔴 | 5 |
| `path.resolve(p)` | jadikan jalur absolut | 🟡 | 5 |
| `JSON.parse(teks)` | teks → objek. **Melempar error** kalau bukan JSON | 🔴 | 5 |
| `JSON.stringify(x, null, 2)` | objek → teks (rapi) | ⚪ | 5 |
| `__dirname + "/data"` | 🟡 berbahaya di Windows — pakai `path.join` | 🟡 | 5 |

---

## F. Server — `node:http` & Express

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `http.createServer((req, res) => {})` | server tanpa framework | ⚪ | 10 |
| `res.writeHead(200, {...})` | kirim status + header | 🟡 | 10 |
| `res.end(...)` | **akhiri jawaban** — tanpa ini browser menunggu selamanya | 🔴 | **10** |
| `server.listen(3000, cb)` | mulai menunggu di port 3000 | ⚪ | 10 |
| `EADDRINUSE` | port sudah dipakai proses lain | 🟡 | 10 |
| `express()` | membuat aplikasi Express | ⚪ | 11 |
| `app.use(express.json())` | **wajib** agar `req.body` terisi | 🔴 | **11, 15** |
| `app.get/post/put/delete(path, handler)` | routing | ⚪ | 11 |
| `req.params.id` | nilai dari pola jalur (`/siswa/:id`) | ⚪ | 11 |
| `req.query.kelas` | nilai dari `?kelas=6A` | 🟡 | 11 |
| `req.body` | isi POST — `undefined` kalau `express.json()` belum dipasang | 🔴 | **11, 15** |
| `res.json(x)` | kirim JSON (sekaligus menutup jawaban) | ⚪ | 11 |
| `res.status(400).json({...})` | kirim status + isi | ⚪ | 12 |
| `next()` | lanjut ke middleware berikutnya — **tanpa ini, permintaan menggantung** | 🔴 | **11** |
| `(err, req, res, next) => {}` | middleware error — **wajib 4 argumen** | 🟡 | 11 |
| `if (!x) return res.status(400)...` | validasi — **`return` wajib** | 🔴 | **12** |
| `headers already sent` | kode mengirim jawaban dua kali | 🔴 | 12 |
| `app.listen(3000)` | mulai server Express | ⚪ | 11 |

---

## G. HTTP — method, status, header

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `GET` | mengambil data | ⚪ | 9 |
| `POST` | membuat data baru | ⚪ | 9 |
| `PUT` / `PATCH` | mengubah data | ⚪ | 9 |
| `DELETE` | menghapus data | ⚪ | 9 |
| `200` | berhasil | ⚪ | 9 |
| `201` | berhasil **membuat** sesuatu | ⚪ | 9 |
| `400` | **input salah** (salah pengguna) | 🟡 | 12 |
| `401` | belum login | 🟡 | 17 |
| `403` | sudah login, **tidak boleh** | 🟡 | 17 |
| `404` | tidak ditemukan | ⚪ | 9 |
| `500` | **bug server** — bukan untuk input salah | 🔴 | 12 |
| `Content-Type: application/json` | tanpa ini, klien menerima teks, bukan objek | 🔴 | 9 |
| `Access-Control-Allow-Origin` | izin lintas asal — **dikirim server** | 🟡 | 13 |
| `OPTIONS` | preflight CORS | 🟡 | 13 |
| `res.ok` | di `fetch`: `true` kalau status 200–299 | 🟡 | 9 |
| `fetch` tidak melempar error pada `404` | harus cek `res.ok` sendiri | 🔴 | 9 |

---

## H. Database & SQL dasar

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `new DatabaseSync("data.db")` | buka database SQLite berbasis file (`node:sqlite`, Node 26+) | 🟡 | 14 |
| `db.exec("CREATE TABLE ...")` | perintah tanpa parameter | ⚪ | 14 |
| `db.prepare("SELECT ... WHERE x = ?")` | siapkan query dengan **penanda nilai** | ⚪ | 14 |
| `.all(...)` / `.get(...)` / `.run(...)` | ambil semua / satu / jalankan perubahan | ⚪ | 14 |
| `"SELECT * FROM s WHERE k = '" + input + "'"` | 🔴 **injeksi** — input bisa mengubah perintah | 🔴 | **14** |
| `SELECT` yang tidak cocok → `[]` | **array kosong itu sah**, bukan error | 🔴 | **14, 15** |

> **Aturan satu kalimat:** nilai dari pengguna **selalu** lewat `?`, **tidak pernah**
> dirangkai ke dalam teks query. (Unit 14 — dasar keamanan)

---

## I. Keamanan & konfigurasi

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `process.env.API_KEY` | rahasia dari variabel lingkungan | 🟡 | 16 |
| `.env` | file berisi rahasia — **tidak boleh di-commit** | 🔴 | 16 |
| `.env.example` | contoh berisi **nama** variabel tanpa nilai — ini yang di-commit | ⚪ | 16 |
| `.gitignore` | daftar yang tidak dikirim ke git — **wajib** memuat `node_modules/` dan `.env` | 🔴 | 3, 16 |
| `console.log(token)` | 🔴 rahasia masuk log | 🔴 | 16 |
| `crypto.scryptSync(pw, salt, 64)` | hash password | ⚪ | 17 |
| `crypto.randomBytes(16)` | membuat salt acak | ⚪ | 17 |
| `crypto.timingSafeEqual(a, b)` | bandingkan rahasia dengan waktu tetap | 🟡 | 17 |
| `hash === hash` | 🔴 waktu eksekusi bisa membocorkan informasi | 🔴 | 17 |
| `err.stack` dikirim ke pengguna | 🔴 membocorkan struktur folder | 🔴 | 8, 12 |
| `try { } catch (err) { }` | menangani error — **tidak menangkap error di callback async** | 🟡 | 8 |

---

## J. Build & deploy

| Bentuk | Artinya | Bahaya | Unit |
|---|---|---|---|
| `npm run build` | mengubah React menjadi file statis di `dist/` | ⚪ | 18 |
| `express.static("dist")` | melayani file statis dari Node | ⚪ | 18 |
| `app.get("*", ...)` | fallback agar rute React tetap bekerja | 🟡 | 18 |
| `process.env.NODE_ENV` | `"production"` mengubah perilaku banyak paket | 🟡 | 18 |
| `process.env.PORT` | **string**, bukan angka → `Number(...)` | 🟡 | 16, 18 |
| `http://localhost:3000` di kode frontend | 🔴 akan gagal setelah build | 🔴 | **18** |
| `Cannot GET /siswa` | rute tidak dilayani di produksi | 🟡 | 18 |

---

## K. Yang SENGAJA tidak diajarkan — dan kenapa

| Topik | Kenapa tidak |
|---|---|
| **Docker / Kubernetes** | Bukan prasyarat untuk **membaca & menilai** kode Node satu aplikasi |
| **Microservices** | Skala masalah yang belum dihadapi pembelajar; mengaburkan dasar |
| **GraphQL** | Alternatif REST; satu gaya saja dulu, supaya tidak bercabang |
| **WebSocket / realtime** | Bukan sumber bug utama, dan butuh pemahaman HTTP yang sudah matang |
| **TypeScript sebagai wajib** | Berguna, tapi menambah satu lapisan sebelum dasarnya kuat. Cukup **dikenali** |
| **ORM (Prisma/Sequelize)** | Menyembunyikan SQL — padahal SQL-nya yang jadi sumber bug & injeksi |
| **Testing framework (Jest/Vitest)** | Penting untuk produksi, tapi bukan cara belajar **inspeksi** |
| **PostgreSQL/MySQL** | Butuh server terpisah → dua masalah sekaligus untuk pemula. Dipakai `node:sqlite` |
| **JWT secara mendalam** | Session vs token cukup **dikenali**; memilih salah satu bukan urusan unit ini |
| **Deploy ke layanan tertentu (Vercel/Railway/VPS)** | Berubah cepat dan spesifik vendor. Yang diajarkan **konsepnya**, bukan tombolnya |
| **`cluster`, `worker_threads`, `child_process`** | Skala lanjutan; cukup dikenali |
| **Streaming & `Buffer`** | Bukan sumber bug di aplikasi CRUD biasa |
| **`npm audit` & pemindaian kerentanan** | Berguna; ada skill terpisah untuk itu |

> **Kalau pembelajar menemui salah satu topik ini di kode nyata dan tersandung** — itu
> **tanda daftar ini perlu ditinjau**, bukan tanda pembelajar kurang. Catat, lalu tambahkan
> dengan sumber yang diverifikasi.

---

## Cara memakai file ini (untuk tutor)

1. **Pembelajar bertanya** → cari bentuknya di sini → jelaskan **satu bentuk**, 1–2 kalimat
   → sebut unit tempat ia dilatih → **lanjut**. Jangan menawarkan bentuk lain.
2. **Tidak ada di sini?** → itu **celah**. Buka sumber resmi (nodejs.org/MDN), tambahkan
   barisnya, lalu jawab. Catat di `RESOURCES.md`.
3. **Bahaya 🔴** → boleh disebut singkat ("ini sering jadi sumber bug"), tapi **tetap satu
   bentuk**. Penjelasan mendalam menunggu unitnya.
4. **Jangan pernah** menyerahkan file ini ke pembelajar untuk dibaca sendiri.

**Aturan tunggal:** satu pertanyaan → satu bentuk → satu kalimat → lanjut.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `peta-unit.md` · `korpus-ai.md` · `teach-react/references/sintaks-react.md`
