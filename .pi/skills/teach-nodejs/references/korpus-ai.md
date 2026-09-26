# Korpus Kode Hasil AI — Node.js (Cara Menyiapkan & Empat Latihan Inspeksi)

> Referensi untuk skill `teach-nodejs`. **Tutor membaca file ini sendiri.**
> Pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 26 September 2026 · **Kerangka asal:** `teach-react/references/korpus-ai.md`

---

## 1. Kenapa korpusnya HARUS kode hasil generate AI

Karena **itu yang akan dihadapi pembelajar setelah lulus.** Bukan kode rapi dari buku,
bukan kode contoh yang ditulis tutor dengan hati-hati — tapi kode yang dihasilkan AI,
yang **terlihat benar** dan **sering hampir benar**.

Alasannya berlapis, dan semuanya dari sumber yang bisa diperiksa:

| Sumber | Temuan | Konsekuensi untuk korpus |
|---|---|---|
| **Stack Overflow Developer Survey 2025** | **66%** developer frustrasi utamanya *"solutions that are almost right, but not quite"*; **45%** bilang men-debug kode AI **lebih memakan waktu** | Korpusnya harus kode yang **hampir** benar — bukan yang jelas salah |
| **RCT Anthropic** (arXiv 2601.20245, Jan 2026) | Gap terbesar AI vs manual justru di **debugging** | Latihan TELUSUR wajib ada, dan porsinya besar |
| **Veracode 2025** (100+ LLM × 80 tugas) | Hanya **55%** menghasilkan kode yang aman | Korpus Node **harus** memuat cacat keamanan (rahasia, injeksi, password polos) |
| **MIT Media Lab** (arXiv 2506.08872) | Pengguna LLM kesulitan mengutip karyanya sendiri | Pembelajar wajib bisa menjelaskan tiap baris kode yang ia terima |

> **Batas kejujuran:** angka-angka di atas berasal dari survei & studi yang berbeda
> populasi. Ia dipakai sebagai **indikasi arah**, bukan sebagai bukti sebab-akibat.
> RCT Anthropic sampelnya kecil (52), satu library, mayoritas junior.

**Yang paling penting:** kode yang **jelas salah** terlalu mudah. Yang melatih adalah kode
yang **tampak benar** — dan di Node, jenis itu justru paling banyak: `await` yang hilang,
`req.body` yang belum di-parse, nama field yang berbeda satu huruf.

---

## 2. Tangga korpus per bagian

| Bagian | Korpus | Ukuran | Contoh konkret |
|---|---|---|---|
| **0** | Potongan Node hasil AI + perintah terminal | **5–15 baris** | Skrip yang membaca `process.argv` dan mencetak sesuatu |
| **1** | Satu file skrip Node hasil AI | **10–30 baris** | Baca file JSON → olah → tulis hasilnya |
| **2** | Satu file server utuh hasil AI (dengan routing) | **30–80 baris** | Express + 3 endpoint + validasi |
| **3** | Proyek fullstack multi-file hasil AI | **3–8 file** | Node + React + database + `.env` |

**Aturan tangga:** jangan naik sebelum korpus di tingkat itu **selesai dibedah**. Kalau
Bagian 1 masih sulit, Bagian 2 akan terasa mustahil — bukan karena materinya, tapi karena
ukuran kodenya melompat.

---

## 3. Cara menyiapkan korpus + cacat khas kode Node hasil AI

### Langkah 1 — Minta AI membuat sesuatu yang kecil dan biasa

Contoh permintaan (boleh dipakai apa adanya):

> *"Buat skrip Node.js yang membaca file `data/siswa.json`, menghitung berapa siswa per
> kelas, lalu mencetak hasilnya ke terminal."*

> *"Buat server Express sederhana dengan endpoint `GET /siswa` yang mengembalikan daftar
> siswa dari variabel, dan `POST /siswa` yang menambahkan siswa baru."*

> *"Buat halaman login sederhana dengan Node + Express: endpoint register dan login,
> password disimpan di database SQLite."*

**Jangan** meminta hal yang rumit. Kode kecil lebih baik: cacatnya lebih terlihat, dan
sesi tetap di bawah satu jam.

### Langkah 2 — JANGAN dirapikan

Ini bagian yang paling sering dilanggar tutor. **Pakai kode AI apa adanya.** Jangan:
- mengganti nama variabel agar konsisten,
- menambahkan `await` yang hilang,
- memperbaiki indentasi,
- menambahkan komentar penjelas,
- memperbaiki jalur file yang salah.

**Kalau tutor merapikan kode, ia menghapus pelajarannya.**

### Cacat khas kode Node hasil AI — daftar periksa

Tabel ini adalah **inti** dari file ini. Saat menyiapkan korpus, tutor memeriksa kode AI
terhadap daftar ini — **bukan untuk memperbaikinya**, tapi untuk **tahu apa yang ada di
dalamnya**, supaya bisa mengarahkan latihan.

| # | Cacat | Gejala | Unit |
|---|---|---|---|
| 1 | **`await` hilang** | `Promise { <pending> }`, `[object Promise]`, data kosong | **6, 15** |
| 2 | `require` dicampur `import` (atau sebaliknya) | `require is not defined` / `Cannot use import statement outside a module` | 4 |
| 3 | Jalur file dirangkai dengan `"/"` | gagal di Windows, atau `\` dan `/` bercampur | 5 |
| 4 | `readFileSync` di dalam handler | server membeku saat ada permintaan | 5, 10 |
| 5 | `array.forEach(async ...)` | tidak menunggu apa pun; hasil tidak lengkap | **6** |
| 6 | `res.end()` hilang di satu cabang | browser memuat terus tanpa hasil | 10 |
| 7 | `express.json()` tidak dipasang (atau dipasang setelah route) | `req.body` = `undefined` | **11, 15** |
| 8 | Validasi tanpa `return` | error dikirim, lalu kode berlanjut → *"headers already sent"* | 12 |
| 9 | `500` dipakai untuk input salah | React menampilkan "server error" padahal pengguna cuma salah isi | 12 |
| 10 | CORS tidak diaktifkan | API jalan di `curl`, gagal di React | **13** |
| 11 | Query dirangkai dari string | injeksi; input bisa mengubah perintah | **14** |
| 12 | Nama field tidak cocok (kirim `kelas`, baca `class`) | `undefined`, daftar kosong | **15** |
| 13 | Rahasia ditulis langsung di kode, atau `.env` tidak ada di `.gitignore` | rahasia bocor | **16** |
| 14 | `console.log(token)` / `console.log(req.body)` berisi password | rahasia masuk log | 16 |
| 15 | Password disimpan polos | kebocoran total saat database dibaca | **17** |
| 16 | `hash === hash` untuk membandingkan password | waktu eksekusi bisa membocorkan informasi | 17 |
| 17 | Salt dibuat ulang saat membandingkan | login selalu gagal | 17 |
| 18 | Jalur API masih `http://localhost:3000` setelah build | halaman putih / "Cannot GET" di produksi | **18** |
| 19 | `process.env.PORT` dipakai tanpa `Number(...)` | port jadi string; perilaku tak terduga | 16, 18 |
| 20 | `err.stack` dikirim ke pengguna | membocorkan struktur folder | 8, 12 |

**Cara memakai tabel ini:** pilih **satu** cacat per sesi. Satu. Kalau kode AI punya lima
cacat, ambil **satu** untuk sesi ini, sisanya untuk sesi lain. **Jangan** menumpuk.

### Langkah 3 — Potong sesuai bagian

Kode AI sering lebih panjang dari yang dibutuhkan. Potong — tapi **potong dari ujung**,
jangan dari tengah, supaya strukturnya tetap masuk akal.

- Bagian 0: ambil **5–15 baris** yang bisa dijalankan sendiri
- Bagian 1: ambil **satu file** utuh
- Bagian 2: ambil **satu file server**, hapus endpoint yang tidak dibutuhkan
- Bagian 3: ambil **3–8 file**, sertakan `package.json`

### Langkah 4 — Simpan di `PRAKTIK/`

```
PRAKTIK/
└── sesi-007/
    ├── prediksi.md       ← tebakan pembelajar (DITULIS LEBIH DULU)
    ├── kode-ai.js        ← kode AI, apa adanya
    ├── output-asli.txt   ← output nyata setelah dijalankan
    └── hasil.md          ← hasil BEDAH (LACAK/SUSUN/KLAIM/TELUSUR)
```

**Jangan pernah** menjalankan korpus di repo produksi. Selalu di `PRAKTIK/`.

### ⛔ Aturan keamanan — tidak bisa ditawar

Kode AI **sering** memuat nilai yang seharusnya rahasia: API key, password database,
token. **Sebelum menyimpan korpus:**

1. **Ganti semua nilai rahasia dengan nilai palsu yang jelas palsu**
   (`API_KEY=palsu-untuk-latihan`, `password: "rahasia123"`).
2. **Jangan pernah** menjalankan korpus yang menghubungi layanan nyata.
3. **Jangan pernah** menempelkan `.env` asli pembelajar ke AI — untuk alasan apa pun.
4. Kalau korpus perlu database, pakai **file SQLite lokal** di folder `PRAKTIK/`.

Alasannya bukan formalitas: rahasia yang **pernah** dikirim ke mana pun harus dianggap
sudah bocor (Unit 16). Tutor **tidak boleh** menciptakan kebocoran saat menyiapkan latihan.

---

## 4. Empat jenis latihan inspeksi (tahap BEDAH)

### (a) LACAK — melacak nilai, dan kapan ia berubah

**Yang diuji:** *notional machine* — model mental tentang apa yang dilakukan komputer.

**Bentuk:** diberi kode, pembelajar menulis **nilai setiap variabel** pada setiap langkah.
Di Node, **tambahan wajib**: **urutan** waktunya.

```
## LACAK — sesi-007
Baris 3:  nama = "Budi"          (belum berubah)
Baris 5:  data = ???              ← sebelum await: Promise
Baris 6:  data = ???              ← sesudah await: array berisi 3 siswa
Baris 8:  tercetak: "Ditemukan 3 siswa"
```

**Untuk Node, LACAK wajib menyertakan kolom "sebelum / sesudah `await`".** Itulah yang
membedakan LACAK Node dari LACAK biasa.

**Contoh soal (Bagian 1):**

```js
async function hitung() {
  const teks = fs.promises.readFile("data/siswa.json", "utf8");
  console.log("Tipe:", typeof teks);
  const isi = JSON.parse(teks);
  console.log("Jumlah:", isi.length);
}
hitung();
```

Pertanyaan: apa yang tercetak? **Jawaban benar:** `Tipe: object` (karena `Promise` adalah
objek), lalu **error** — karena `JSON.parse` menerima `Promise`, bukan string.
**Ini latihan yang bagus** karena jawabannya tidak jelas dari sekilas baca.

---

### (b) SUSUN — Parsons Problem

**Yang diuji:** struktur & logika, tanpa beban mengetik.

**Bentuk:** baris kode diacak; pembelajar menyusun ulang menjadi program yang benar.

**Cara menulis Parsons Problem yang benar:**

1. **Satu jawaban benar.** Kalau ada dua cara yang sama-sama benar, sebutkan aturannya
   ("pakai `await`, bukan `.then()`").
2. **Pakai baris kode asli** dari korpus AI — bukan baris yang ditulis ulang tutor.
3. **Sertakan deskripsi tujuan** di atas soal:

```
## SUSUN — sesi-011
Tujuan: server yang mengembalikan daftar siswa, dan 400 kalau ?kelas kosong.

[ ] const express = require("express");
[ ] const app = express();
[ ] app.use(express.json());
[ ] app.get("/siswa", (req, res) => {
[ ]   const kelas = req.query.kelas;
[ ]   if (!kelas) return res.status(400).json({ error: "kelas wajib" });
[ ]   res.json(daftar.filter(s => s.kelas === kelas));
[ ] });
[ ] app.listen(3000);
```

> ⚠️ **Jangan pakai baris pengecoh (*distractor*) di Bagian 0.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan pengecoh **menurunkan efisiensi
> belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.

> **Parsons Problem adalah bentuk asli dari riset:** Denny, Luxton-Reilly & Simon
> (2008, ICER '08). Ia dipakai di sini **karena bukti**, bukan karena kebiasaan.

---

### (c) KLAIM — menentukan apakah kode melakukan apa yang dikatakannya

**Yang diuji:** deteksi "hampir benar" — kemampuan yang paling dibutuhkan di era AI.

**Bentuk:** tutor memberi **kode + satu kalimat klaim**. Pembelajar menentukan apakah
klaim itu **benar**.

```
## KLAIM — sesi-012

Kode: (file server 25 baris)

Klaim: "Endpoint POST /siswa mengembalikan 400 kalau field nama tidak diisi."

## Verdict: BENAR / TIDAK / SEBAGIAN
## Bukti
  (tunjuk baris yang mendukung atau membantah)
## Kalau tidak benar — apa yang sebenarnya dilakukan?
  (jelaskan perilaku nyatanya, bukan hanya "salah")
```

**Contoh klaim yang bagus untuk Node** (semuanya **hampir** benar):

| Klaim | Kenyataan | Unit |
|---|---|---|
| *"Data siswa akan muncul di layar"* | `await` hilang → `Promise` | 6 |
| *"React sudah bisa memanggil API ini"* | CORS belum diaktifkan | 13 |
| *"Endpoint ini mengembalikan 400 kalau kelas kosong"* | Tidak ada `return`, atau `express.json()` belum dipasang | 12 |
| *"Password disimpan dengan aman"* | Disimpan polos, atau dibandingkan dengan `===` | 17 |
| *"Proyek ini siap dijalankan dengan `npm start`"* | Tidak ada script `start` | 3 |
| *"File ini aman di-commit"* | `.env` ada isinya dan tidak ada di `.gitignore` | 16 |

> **Ini latihan inti seluruh skill.** Bukan mencari bug — **menentukan apakah kode
> melakukan apa yang dikatakannya.** Kode yang lolos latihan ini = kode yang benar-benar
> diperiksa. Kode yang lolos begitu saja = **utang pemahaman**.

---

### (d) TELUSUR — memburu sebab saat hasilnya salah ⭐

**Yang diuji:** **debugging.** Menurut RCT Anthropic (2026), inilah **gap terbesar**
antara orang yang memakai AI dan yang tidak. Karena itu latihan ini **wajib** — dan
protokolnya ketat.

#### Aturan keras

> **Dugaan ditulis SEBELUM menyentuh kode.**
> Menabur `console.log` tanpa dugaan **tidak** melatih memburu — hanya melatih menebak.
> **Satu alat per dugaan.**

#### Protokol 5 langkah

```
1. KATAKAN   — apa yang diharapkan, dan apa yang sebenarnya terjadi?
               (tulis di hasil.md, jangan di kepala)
2. DUGA      — satu dugaan: "saya kira masalahnya di baris ___, karena ___"
               ← WAJIB ditulis sebelum menjalankan/mengubah apa pun
3. UJI       — satu alat saja untuk menguji dugaan itu.
               (satu console.log berlabel, ATAU satu pesan error, bukan lima)
4. SEMPITKAN — dugaan gugur? tulis kenapa, lalu buat dugaan baru. Ulangi.
5. BUKTIKAN  — setelah menemukan, tunjuk barisnya, dan jelaskan kenapa baris itu
               menghasilkan gejala itu.
```

#### Format `hasil.md` untuk TELUSUR

```
## Yang diharapkan vs yang terjadi
  Harapan: daftar berisi 5 siswa
  Kenyataan: daftar kosong, tidak ada error di terminal

## Dugaan 1 — baris 12
  "Saya kira query-nya salah."
  Alat: console.log(hasil) setelah query
  Hasil: hasil = [] ← query jalan, tapi kosong. Dugaan GUGUR.

## Dugaan 2 — baris 8
  "Kalau query benar tapi kosong, mungkin nilainya tidak sampai ke query."
  Alat: console.log(req.query)
  Hasil: req.query = {} ← kelas tidak terbaca. DUGAAN TERKONFIRMASI.

## Baris penyebab: 6
  Klien mengirim POST body, tapi kode membaca req.query — dan `express.json()`
  belum dipasang, jadi req.body juga undefined.
```

> **Perhatikan:** `hasil.md` memuat **dugaan yang gugur**. Itu bukan kegagalan — itu
> **bukti** bahwa pembelajar benar-benar memburu, bukan menebak lalu kebetulan benar.

#### Korpus untuk TELUSUR

Wajib memenuhi **tiga** syarat:

1. **Sudah dijalankan** — tutor sudah memastikan hasilnya salah.
2. **Tidak ada pesan error** — baik di terminal maupun di console browser.
   Kalau ada error, itu ranah Unit 8 (baca stack trace), **bukan** TELUSUR.
3. **Tidak ada petunjuk lokasi** — tidak ada komentar "bug di sini", tidak ada penanda.

#### Prioritas TELUSUR per unit

| Prioritas | Unit | Gejala yang dicari |
|---|---|---|
| ⭐ tertinggi | **15** | Daftar kosong, tidak error, sebabnya salah satu dari empat |
| ⭐ tinggi | **13** | Jalan di `curl`, gagal di React |
| ⭐ tinggi | **18** | Jalan di lokal, gagal setelah build |
| Tinggi | 6 | Data berbentuk `Promise`, bukan nilai |
| Tinggi | 17 | Login selalu gagal walau password benar |
| Sedang | 5, 7, 8, 10, 11, 12, 14 | Jalur salah, urutan salah, route tertelan, `res.end()` hilang |
| Sedang | 16 | Aplikasi gagal start karena variabel lingkungan hilang |

> **Petunjuk untuk tutor:** saat pembelajar macet, **jangan** menyebut lokasinya.
> Beri **satu** pertanyaan yang mempersempit ("apa yang kamu harapkan terjadi di baris
> itu?"). Membiarkan pembelajar menemukannya sendiri adalah **seluruh gunanya** latihan ini.

---

## 5. Checklist korpus yang baik

Sebelum menyerahkan korpus ke pembelajar, tutor memeriksa:

- [ ] Kode **dari AI**, bukan ditulis tutor
- [ ] **Tidak dirapikan** — cacatnya masih ada
- [ ] Ukurannya sesuai bagian (5–15 / 10–30 / 30–80 baris / 3–8 file)
- [ ] **Satu** cacat utama untuk sesi ini (bukan lima)
- [ ] Rahasia sudah diganti nilai palsu
- [ ] Tidak menghubungi layanan jaringan nyata
- [ ] Untuk TELUSUR: sudah dijalankan, hasilnya salah, **tidak ada error**
- [ ] Untuk TELUSUR: **tidak ada** petunjuk lokasi cacat
- [ ] Disimpan di `PRAKTIK/sesi-NNN/`
- [ ] `prediksi.md` **belum** dibuat (pembelajar yang menulis, lebih dulu)

---

## 6. Yang sering salah dilakukan tutor

| Kesalahan | Kenapa itu masalah | Lakukan sebaliknya |
|---|---|---|
| Merapikan kode AI sebelum diberikan | Menghapus pelajarannya | Pakai apa adanya |
| Menulis kode contoh sendiri karena "lebih rapi" | Kode tutor tidak punya cacat khas AI | Minta AI, pakai hasilnya |
| Memberi 5 cacat sekaligus | Pembelajar tenggelam; tidak ada yang diingat | Satu cacat per sesi |
| Menunjuk lokasi cacat saat pembelajar macet | Mengubah TELUSUR jadi latihan membaca | Beri satu pertanyaan yang mempersempit |
| Membiarkan `console.log` ditabur tanpa dugaan | Itu menebak, bukan memburu | Dugaan dulu, lalu satu alat |
| Menjalankan korpus yang menyentuh rahasia nyata | Menciptakan kebocoran saat mengajar keamanan | Ganti nilai palsu lebih dulu |
| Menaikkan ukuran kode karena pembelajar "cepat" | Kecepatan ≠ pemahaman; ukuran besar menyembunyikan cacat | Naikkan **kesulitan cacat**, bukan ukuran |
| Memberi korpus yang jelas salah | Terlalu mudah; tidak melatih deteksi "hampir benar" | Pilih kode yang **tampak** benar |

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `teach-react/references/korpus-ai.md`
