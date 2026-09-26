# Roadmap 4 Bagian / 18 Unit — Node.js Mode Inspeksi

> **Untuk tutor.** File ini adalah detail yang tidak dimuat di `SKILL.md`.
> WAJIB dibaca sebelum menjawab "apa berikutnya untuk saya?"
>
> **Jangan pernah** menyuruh pembelajar membaca file ini (§MODE PENYAMPAIAN).
> Tutor membaca, lalu menjelaskan.
>
> **Dibuat:** 26 September 2026 · **Sumber kerangka:** `teach-react` & `teach-javascript`
> (skill sejajar) · **Tujuan akhir:** aplikasi **fullstack JavaScript** (Node + React)

---

## Peta file referensi — jangan tumpang tindih

| File | Isinya | Kapan dipakai |
|---|---|---|
| **`roadmap-4-tingkat.md`** (ini) | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| **`peta-unit.md`** | **Detail per unit**: konsep, sintaks yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| **`korpus-ai.md`** | Cara menyiapkan **korpus kode AI** + 4 jenis latihan inspeksi | Sebelum menyiapkan sesi latihan |
| **`sintaks-node.md`** | **Kamus sintaks** terminal/Node/JS-server + tingkat bahaya + unit tempat dilatih | Saat pembelajar bertanya "perintah/tanda ini apa?" |
| **`cakupan-vs-dokumen-resmi.md`** | **Audit cakupan** vs nodejs.org & MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

**Aturan anti-drift:** detail satu unit **hanya boleh** hidup di `peta-unit.md`.
Detail korpus **hanya boleh** hidup di `korpus-ai.md`. Kamus sintaks **hanya** di
`sintaks-node.md`. File ini tidak mengulanginya — ia hanya menunjuk.

---

## 0. Prinsip yang mengikat seluruh roadmap

1. **Bagian 0 (terminal + runtime) adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh
   dilompati. Node.js hidup di terminal; tanpa terminal, semuanya terasa mustahil.
2. **Korpus wajib kode hasil generate AI.** Bukan kode contoh buatan tutor. Lihat §5.
3. **Satu unit = 1–2 sesi.** Satu sesi = satu konsep, maksimal 1 jam.
4. **Urutan tidak boleh dilompati.** Setiap bagian punya gerbang yang bisa diperiksa.
5. **Gerbang gagal = ulangi bagian itu**, bukan lanjut.
6. **Setiap sesi wajib punya momen salah prediksi.** Kalau tidak, materinya terlalu mudah.
7. **Semua tebakan ditulis di editor** (`prediksi.md`), bukan di kertas. Urutan PREDIKSI →
   JALANKAN diperiksa lewat timestamp.
8. **Sintaks asing BUKAN "di luar materi".** Kode AI memakai `import`, `async`/`await`,
   `process.env`, `req`/`res`, `?.` sejak baris pertama. Kalau pembelajar bertanya
   *"perintah ini apa?"* → cek `sintaks-node.md`, jelaskan **satu bentuk** 1–2 kalimat,
   lanjut. **Jangan** bilang "di luar materi", **jangan** menjelaskan lima bentuk sekaligus.
9. **Prasyarat JavaScript diperiksa lebih dulu.** Kalau JS belum dikuasai (fungsi, array,
   referensi vs nilai, async, try/catch) → kirim ke `/teach-javascript` dulu. Tanpa
   `async`/`await`, Unit 6 dan Unit 15 skill ini tidak akan bisa dipahami.
10. **Node tidak punya layar.** "Melihat" berarti **menuliskan output yang diduga** lalu
    membandingkannya dengan output asli. Ini pengganti browser di `teach-react`.
11. **Rahasia tidak pernah masuk korpus.** Kalau kode AI memuat API key/password, ganti
    dulu dengan nilai palsu. Unit 16 melatih ini — tapi korpusnya harus aman sejak awal.

---

## 1. BAGIAN 0 — PRASYARAT: TERMINAL & RUNTIME (Unit 1–4)

**Yang dilatih:** menjalankan sesuatu dan tahu **kenapa ia gagal**.
**Korpus:** potongan **5–15 baris** Node hasil AI + perintah terminalnya.
**Prasyarat:** tidak ada. Ini titik masuk pemula absolut.
**Alat:** terminal (Git Bash / PowerShell / cmd), editor (Zed), Node.js terpasang.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 1 | **Terminal dan baris perintah** | Di mana saya berada (`pwd`), apa yang ada di sini (`ls`), pindah (`cd`), menjalankan sesuatu (`node file.js`). **Exit code**: 0 = berhasil, bukan-0 = gagal | Diberi urutan perintah, prediksi output tiap baris **sebelum** dijalankan | MDN: *Command line crash course* |
| 2 | **Node = JavaScript di luar browser** | Tidak ada `window`, tidak ada `document`. Yang ada: `process`, `console`, `globalThis`, `require`/`import`. Kenapa `document is not defined` | Prediksi: baris mana yang error kalau dijalankan di Node | nodejs.org/api/globals |
| 3 | **npm & `package.json`** | `package.json` = kontrak proyek. `dependencies` vs `devDependencies`. `node_modules` bisa dibuang & dipasang ulang. `package-lock.json` mengunci versi. `npm run <script>` | Baca satu `package.json` hasil AI: sebut perintah apa saja yang tersedia, dan paket apa yang dipasang | nodejs.org/api/packages; npm docs |
| 4 | **Modul: ESM vs CommonJS** | `import`/`export` (ESM) vs `require`/`module.exports` (CJS). `"type": "module"` di `package.json`. Kenapa `require is not defined` | Prediksi: file ini ESM atau CJS — dan apa yang gagal kalau keduanya dicampur | nodejs.org/api/esm; nodejs.org/api/modules |

### → GERBANG 1 — Jalankan proyek Node hasil AI dari nol

Diberi **folder proyek Node hasil AI** (3–5 file) yang belum pernah dilihat.

**Tanpa bantuan tutor**, lakukan:

1. Sebut **perintah apa** yang harus dijalankan lebih dulu, dan kenapa
2. Jalankan. Kalau gagal — **sebut penyebabnya** (bukan menebak, tapi membaca pesannya)
3. Sebut **file mana** yang menjadi titik masuk (`main` / `start` / `node x.js`)

**Lulus kalau poin 1 dan 3 benar, dan poin 2 dijawab dengan membaca pesan error.**

> **Kenapa gerbang ini ada:** 90% "Node saya tidak jalan" bukan soal kode, tapi soal
> **urutan perintah** — dependensi belum dipasang, salah folder, salah script.

**Gagal?** Ulangi Unit 1–4 dengan proyek yang lebih kecil (1 file, tanpa dependensi).

---

## 2. BAGIAN 1 — NODE DASAR (Unit 5–8)

**Yang dilatih:** melihat skrip dan tahu **apa yang terjadi, dan kapan**.
**Korpus:** **satu file skrip** Node hasil AI (10–30 baris).
**Alat:** terminal, editor. Belum ada server, belum ada React.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 5 | **Modul bawaan: `fs`, `path`, `os`** | Membaca & menulis file. `path.join` vs merangkai `"/"` sendiri — **Windows memakai `\`**. `fs.readFile` (async) vs `fs.readFileSync` (memblokir) | Prediksi isi file setelah urutan tulis→baca. Sebut kenapa `"data/" + nama` berbahaya | nodejs.org/api/fs; nodejs.org/api/path |
| 6 | **Async: callback → promise → `async`/`await`** ⭐ | **`await` yang hilang tidak error** — ia memberi `Promise`, bukan nilainya. Ini **penyebab #1** data kosong. Kenapa kode setelah `await` "pindah antrean" | Lacak nilai variabel **sebelum** dan **sesudah** `await`. Prediksi urutan output | nodejs.org/api/; MDN: *async function* |
| 7 | **Event loop & kenapa Node tidak berhenti** | Node tidak menjalankan baris secara berurutan begitu ada I/O. Timer, microtask, macrotask. Kenapa proses "menggantung" (ada yang belum selesai) | Prediksi urutan output dari campuran `console.log`, `setTimeout`, `await` | nodejs.org/learn/asynchronous-work |
| 8 | **Error: `try`/`catch`, exit code, stack trace** | Error Node **menyebut baris dan jenisnya** — bacalah. Error tanpa penanganan bisa **mematikan proses**. `throw` vs `console.error` | Dari stack trace asli, sebut **file + baris + jenis error** tanpa menjalankan ulang | nodejs.org/api/errors |

### → GERBANG 2 — Lacak alur async (ambang 50%)

Satu skrip **± 30 baris** yang belum pernah dilihat, dengan **dua `await`** dan satu
`setTimeout`.

Tulis di `prediksi.md`: **urutan lengkap semua baris output**, berurutan. Lalu jalankan
dan bandingkan.

**Lulus kalau ≥ 50% baris berada di urutan yang benar.**

> **Dasar ambang:** *"novices require a 50% tracing code accuracy before they can
> independently write code with confidence"* — Lister et al. (2004), ACM SIGCSE Bulletin
> 36(4), 119–150. Ambang yang sama dipakai `teach-javascript` Gerbang 1 dan `teach-react`
> Gerbang 2, supaya konsisten. **Batas kejujuran:** studi 2004, konteks kurikulum universitas.

**Di bawah 50%?** Ulangi Unit 6–7 dengan skrip yang lebih pendek (10 baris, satu `await`).

---

## 3. BAGIAN 2 — MEMBANGUN SERVER (Unit 9–13)

**Yang dilatih:** melihat file server dan tahu **apa yang salah, dan kenapa**.
**Korpus:** **satu file server utuh** hasil AI (30–80 baris) dengan routing.
**Alat:** terminal, `curl` atau browser, React DevTools (untuk Unit 13).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 9 | **HTTP dasar** | Request/response. Method (`GET`/`POST`/`PUT`/`DELETE`). Status code (`200`/`201`/`400`/`404`/`500`). Header, body, `Content-Type` | Diberi satu respons, sebut: method apa, status berapa, apakah berhasil | RFC 9110; MDN: *HTTP* |
| 10 | **Server pertama: `node:http` mentah** | Membuat server tanpa framework. Apa yang sebenarnya terjadi di balik Express. Kenapa `res.end()` wajib | Prediksi respons untuk dua URL berbeda | nodejs.org/api/http |
| 11 | **Express: routing & middleware** | `app.get`, `app.use`, urutan middleware, `next()`. Kenapa middleware **berjalan berurutan** dan yang terakhir menang | Lacak: untuk satu request, middleware mana yang jalan, dan urutannya | expressjs.com |
| 12 | **Menerima data & memvalidasi** | `req.body` (butuh `express.json()`), `req.query`, `req.params`. **`400` untuk input salah, `500` untuk bug server** — jangan tertukar | KLAIM: *"endpoint ini mengembalikan 400 kalau `kelas` kosong"* → verifikasi | expressjs.com; RFC 9110 §15 |
| 13 | **CORS & menyambung ke React** ⭐ | Kenapa React di `:5173` **diblokir** memanggil API di `:3000`. Preflight `OPTIONS`. Proxy Vite vs `cors()` | KLAIM: *"React sudah bisa memanggil API ini"* → verifikasi di browser console | MDN: *CORS*; Vite Docs: *Server Options* |

> **Unit 13 adalah jembatan ke MISSION.** Inilah titik di mana dua aplikasi menjadi satu.
> Kalau CORS tidak dipahami, aplikasi fullstack akan tampak "rusak padahal tidak" —
> dan itu penyebab frustrasi yang paling sering dilaporkan.

### → GERBANG 3 — Inspeksi file server orang lain

Baca satu **file server Express hasil AI yang bukan pembelajar tulis**. Jelaskan **tanpa
membuka catatan**:

1. Apa yang dilakukannya (endpoint apa saja yang tersedia)
2. **Satu** keputusan di dalamnya (kenapa middleware ini di urutan ini)
3. **Satu** cara server itu bisa gagal — dan status code apa yang akan keluar

**Lulus kalau ketiganya terjawab** dan poin 3 masuk akal (bukan "kalau internet mati").

---

## 4. BAGIAN 3 — DATA, AMAN, DEPLOY (Unit 14–18)

**Yang dilatih:** menemukan masalah pada server, **menelusuri sebabnya**, dan
**memutuskan apakah aman dijalankan**.
**Korpus:** **proyek fullstack multi-file** hasil AI (Node + React, 3–8 file).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 14 | **Menyimpan data: database & SQL dasar** | Kenapa data tidak boleh hanya di memori. Tabel, kolom, baris. `SELECT`/`INSERT`/`WHERE`. Node 26 punya **`node:sqlite` bawaan** — tidak perlu server database | Baca satu query, sebut: tabel apa, kolom apa, berapa baris yang mungkin keluar | nodejs.org/api/sqlite |
| 15 | **Kenapa data saya kosong** ⭐ | Empat sebab, semuanya **tidak error**: (a) `await` hilang → dapat `Promise`, (b) `req.body` belum di-parse → `undefined`, (c) nama field beda (`kelas` vs `class`), (d) query benar tapi tabelnya kosong | **TELUSUR:** aplikasi jalan, daftar kosong, tidak ada error | nodejs.org/api/; expressjs.com |
| 16 | **Rahasia & konfigurasi** | `.env` + `.gitignore`. Kenapa rahasia yang **pernah** ter-commit harus dianggap bocor. Jangan `console.log` token | KLAIM: *"file ini aman di-commit"* → verifikasi | nodejs.org/api/environment_variables |
| 17 | **Login & sesi** | Password **tidak pernah** disimpan polos — harus di-hash. Session (cookie) vs token. Kenapa perbandingan password harus waktu-tetap | KLAIM: *"login ini aman"* → verifikasi | nodejs.org/api/crypto |
| 18 | **Menyatukan fullstack & deploy** | Build React → file statis → dilayani Node. **Satu origin** menghapus masalah CORS. Apa yang berubah di produksi (port, `NODE_ENV`, HTTPS) | Putuskan: **layak deploy atau tidak**. Tulis alasannya | Vite Docs; nodejs.org/api/cli |

> **Unit 15 dan Unit 16 adalah inti dari seluruh roadmap ini.**
> Keduanya adalah **alasan nomor satu** orang bilang *"backend saya tidak jalan"* — dan
> keduanya **tidak menimbulkan error**. Tidak ada pesan merah. Hanya data yang kosong,
> atau rahasia yang bocor tanpa ada yang tahu.
>
> Keduanya juga bersandar pada **satu konsep dari `teach-javascript` Unit 10**
> (*async/await*) dan **Unit 8** (*referensi vs nilai*). Itulah kenapa skill itu
> prasyaratnya, bukan pelengkap.

### → GERBANG 4 — Temukan, telusuri, putuskan

**Tiga bagian, semuanya harus lulus:**

**(a) Statis.** Diberi file server dengan **satu cacat yang disuntik** (tutor tahu di mana).
Temukan **tanpa menjalankan**, lalu **perbaiki** dan jalankan untuk membuktikan.

**(b) Dinamis (TELUSUR).** Diberi proyek fullstack yang **sudah dijalankan** dengan
**daftar yang kosong** — **tanpa pesan error di terminal maupun console browser**,
tanpa petunjuk lokasi. Pakai protokol 5 langkah sampai menunjuk baris penyebabnya.
`hasil.md` harus memuat **minimal dua dugaan tertulis** — salah satunya boleh salah.

**(c) Review keamanan & keputusan.** Tulis review berisi: apakah klaimnya benar + bukti ·
satu cacat/risiko (boleh cacat keamanan) · **keputusan layak-deploy atau tidak + alasan**.

**Lulus kalau keputusannya beralasan**, bukan kalau keputusannya "benar".

- Menolak server yang sebenarnya baik **dengan alasan jelas** = **lulus**
- Menerima server dengan rahasia ter-commit **tanpa alasan** = **gagal**
- Menerima karena "sudah saya jalankan dan jalan kok" = **gagal** (lihat Unit 18)

---

## 5. Aturan Korpus — kode hasil generate AI

| Bagian | Korpus | Ukuran |
|---|---|---|
| 0 | Potongan Node hasil AI + perintah terminal | 5–15 baris |
| 1 | Satu file skrip Node hasil AI | 10–30 baris |
| 2 | Satu file server utuh hasil AI (dengan routing) | 30–80 baris |
| 3 | Proyek fullstack multi-file hasil AI (Node + React) | 3–8 file |

**Yang perlu tutor ingat di sini (detail lengkap di `korpus-ai.md`):**

1. Tutor **tidak menulis kode sendiri** untuk latihan. Kalau perlu kode, minta AI
   menghasilkannya, lalu pakai hasilnya **apa adanya** — jangan dirapikan.
2. **Yang dicari adalah kode yang *terlihat* benar.** Kode yang jelas salah terlalu mudah.
3. Kode disalin ke `PRAKTIK/sesi-NNN/`. **Tidak pernah** dijalankan di repo produksi.
4. **Rahasia diganti nilai palsu sebelum disimpan.** API key, password, token — semua.
5. Sampai Bagian 2, korpus dibatasi pada skrip yang **tidak menyentuh jaringan nyata** —
   pakai file lokal, kecuali untuk Unit 12–13 yang memang melatih server.

→ **Cara menyiapkan korpus, daftar cacat khas AI Node, dan empat jenis latihan inspeksi
(LACAK · SUSUN · KLAIM · TELUSUR): baca `korpus-ai.md`.**

---

## 6. Bentuk Sesi (6 tahap, ≤ 1 jam) — versi terminal

```
1. PREDIKSI   (10')  Tutor serahkan PRAKTIK/sesi-NNN/kode-ai.js. Terminal DITUTUP.
                     Pembelajar tulis tebakan OUTPUT (termasuk urutannya)
                     → PRAKTIK/sesi-NNN/prediksi.md (SIMPAN).
                     ← Tutor baca prediksi.md SEBELUM melanjutkan.
2. JALANKAN   ( 5')  `node kode-ai.js` → salin output asli ke output-asli.txt.
                     Bandingkan dengan tebakan. Di mana meleset?
3. BEDAH      (20')  (a) LACAK / (b) SUSUN / (c) KLAIM / (d) TELUSUR → tulis hasil.md
4. UBAH       (10')  Ubah SATU hal. Prediksi lagi. Jalankan lagi.
5. PERBAIKI   (10')  Kalau ada bug: perbaiki → jalankan → "apakah ini bisa merusak yang lain?"
6. CATAT      ( 5')  LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi
```

**Verifikasi urutan (bisa diperiksa):**

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

Timestamp `prediksi.md` **harus lebih tua** daripada `output-asli.txt`.
Kalau tidak → sesi diulang.

### Empat bentuk tahap BEDAH — ringkas

| Kode | Nama | Kapan dipakai | Unit |
|---|---|---|---|
| **(a)** | **LACAK** — nilai tiap variabel, dan kapan ia berubah | Menguji *notional machine* | 5–9, 11, 14 |
| **(b)** | **SUSUN** — baris diacak, susun ulang (*Parsons*) | Melatih struktur tanpa beban sintaks | 2, 4–7, 10, 11 |
| **(c)** | **KLAIM** — tentukan apakah klaim kode itu benar | Melatih deteksi "hampir benar" | 3, 6, 9, 12, 13, 16, 17 |
| **(d)** | **TELUSUR** — output salah, cari baris penyebabnya | **Melatih memburu sebab (debug)** | **15, 18**, juga 5, 6, 7, 8, 10, 11, 12, 14 |

> ⚠️ **Parsons Problem: jangan pakai distractor di Bagian 0.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan baris pengecoh **menurunkan
> efisiensi belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.
>
> Cara menulis Parsons Problem yang benar (satu jawaban benar, pakai baris kode asli,
> sertakan deskripsi): **`korpus-ai.md` §4(b)**.

> ⚠️ **TELUSUR: dugaan WAJIB ditulis sebelum menyentuh kode.**
> Menabur `console.log` tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> **Satu alat per dugaan.** Di Node, alatnya boleh `console.log` **atau** pesan error
> bawaan Node — tapi tetap satu per dugaan. Protokol lengkap: **`korpus-ai.md` §4(d)**.

> ⚠️ **Stack trace Node bukan pengganti dugaan.** Ia membuat menebak jadi lebih cepat,
> bukan lebih benar. Kalau pembelajar langsung menyalin error ke AI tanpa menulis dugaan
> dulu, tegur — itu TELUSUR yang tidak dijalankan.

---

## 7. Aturan Memakai AI

Menurut RCT Anthropic (Januari 2026), **cara** memakai AI menentukan hasilnya:

| Cara memakai AI | Skor pemahaman |
|---|---|
| Tanya konsep, kerjakan sendiri | **di atas 65%** |
| Copy-paste kode yang dihasilkan | **di bawah 40%** |
| Rata-rata seluruh grup AI | 50% |
| Kerjakan sendiri tanpa AI | 67% |

Gap terbesar ada di soal **debugging**.

**Aturan yang diturunkan dari ini:**

| Aturan | Kenapa |
|---|---|
| **Tulis tebakan 2–3 kalimat dulu**, baru boleh bertanya ke AI. Pakai jawaban AI untuk **menguji teori**, bukan menggantinya | Pola ini skornya di atas 65% |
| **Minta penjelasan sebelum minta kode.** *"Jelaskan cara kerjanya, alternatifnya, dan trade-off-nya."* | Sama |
| **Kalau AI memberi file server, pembelajar wajib bisa menjelaskan tiap endpoint-nya.** Kalau tidak bisa → jangan pakai | MIT Media Lab: pengguna LLM kesulitan mengutip karyanya sendiri |
| **Perlakukan hasil AI seperti PR dari junior.** Baca, kritik, bantah | *"Would you merge it just because the tests passed?"* |
| **Jangan pernah menempelkan rahasia ke AI.** | Rahasia yang dikirim keluar tidak bisa ditarik kembali |
| **Sesekali, tulis ulang dari nol** endpoint yang AI tulis. Ukur berapa yang hilang | Mengukur *cognitive debt* |
| **Tutup sesi dengan satu pertanyaan:** hari ini saya belajar, atau cuma menutup tugas? | Mengirim dan belajar itu dua hal berbeda |

---

## 8. Kalau Berhenti di Tengah

Normal. Yang **tidak** boleh: mengulang dari Unit 1.

```
Berhenti di Unit 1–4    → ulangi latihan unit terakhir, lanjut
Berhenti di Unit 5–13   → langsung lanjut, tidak perlu mengulang
Berhenti di Unit 14–18  → selesaikan Unit 18 walau hasilnya jelek
```

**Potong lingkupnya, jangan gandakan jamnya.** Satu jam yang konsisten mengalahkan
empat jam setiap Sabtu. Sisipkan 1 hari kosong per minggu.

---

## 9. Batas Kejujuran

- **PRIMM** dirancang untuk sekolah (usia 11–14), bukan orang dewasa. Adaptasi ini masuk
  akal, **belum teruji** untuk kasus ini.
- **Ambang 50%** dari studi 2004 — konteks kurikulum universitas 20 tahun lalu.
  Dipakai sebagai ambang kasar, bukan hukum.
- **MIT Media Lab** meneliti **penulisan esai**, bukan coding. Indikasi arah, bukan bukti langsung.
- **RCT Anthropic:** sampel kecil (52), satu library, mayoritas junior.
- **Protokol 5 langkah TELUSUR bukan dari satu sumber tunggal.** Ia disusun dari praktik
  debug yang lazim (hipotesis → uji → persempit) dan diselaraskan dengan temuan RCT
  Anthropic bahwa debugging adalah titik terlemah. **Belum diuji sebagai metode.**
- **Pemilihan 18 unit untuk Node.js belum diuji.** Ia disusun dari sumber bug yang paling
  sering dilaporkan (await hilang, modul dicampur, rahasia bocor, injeksi) — bukan dari
  studi urutan pembelajaran Node.
- **Bagian 0 (terminal/runtime) 4 unit mungkin terlalu sedikit.** Kalau di praktiknya
  pembelajar masih tersandung terminal, **tambahkan** — jangan paksakan lanjut.
- **Pilihan `node:sqlite` sebagai database pertama adalah keputusan desain**, bukan
  rekomendasi industri. Alasannya: tidak butuh server database terpisah, sehingga
  pembelajar tidak tersandung dua masalah sekaligus. Untuk produksi, PostgreSQL/MySQL
  lebih lazim — dan itu **sengaja tidak** diajarkan di sini.
- **Node.js v26.x punya `node:sqlite` bawaan; versi lama tidak.** Kalau Node pembelajar
  lebih tua, Unit 14 harus memakai paket lain — cek versi dulu.
- **Tingkat bahaya sintaks (🔴🟡⚪ di `sintaks-node.md`) adalah penilaian, bukan hasil riset.**
- **Daftar "sengaja dilewati" bisa salah.** Kalau di proyek nyata pembelajar menemui salah
  satu topik itu dan tersandung, itu tanda daftar perlu ditinjau — bukan tanda pembelajar kurang.
- **nodejs.org dan MDN berubah.** Audit cakupan memakai keduanya pada **26 Sep 2026**.
- Artikel "cara belajar Node.js 2026" di web **tidak dipakai** — aturan sumber repo ini
  melarang blog pribadi/SEO/konten AI.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `teach-react/references/roadmap-4-tingkat.md` (kerangka asal)
