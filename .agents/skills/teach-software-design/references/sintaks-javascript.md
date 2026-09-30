# Kamus Istilah & Pola — Software Design → JavaScript

> Referensi untuk skill `teach-software-design`. **Tutor membaca file ini sendiri** dan
> **menjelaskan satu istilah per kejadian** (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 28 September 2026 · **Kerangka asal:** `teach-tailwindcss/references/sintaks-tailwind.md`
>
> **Aturan pemakaian (penting):**
> - Pembelajar **bertanya** *"ini maksudnya apa?"* → jawab **satu istilah**, 1–2 kalimat,
>   **sebut padanan JavaScript-nya**, kaitkan ke unit, lalu **lanjut**.
> - **JANGAN** menjelaskan lima istilah sekaligus. Menumpuk = menenggelamkan.
> - **JANGAN** menyuruh pembelajar membaca file ini sendiri.
> - **JANGAN** bilang *"itu di luar materi"*. Kode AI memakai semua ini sejak baris pertama.
>
> **Tingkat bahaya:**
> - 🔴 **Berbahaya** — sering jadi sumber masalah nyata, dan **gagal senyap**
> - 🟡 **Perlu hati-hati** — benar kalau dipakai tepat
> - ⚪ **Aman** — cukup dikenali
>
> **Batas kejujuran:** tingkat bahaya di sini adalah **penilaian**, bukan hasil riset.
> Kutipan bersumber disebutkan di tiap barisnya.

---

## A. Istilah desain ↔ padanannya di JavaScript

Ini bagian yang paling sering dibutuhkan. **Istilah desain terasa asing, padahal
bentuk JavaScript-nya sudah dikenal pembelajar.**

| Istilah desain | Di JavaScript | Contoh |
|---|---|---|
| **Modul** | satu file `.js` | `laporan.js` |
| **Antarmuka (interface)** | **tidak ada kata kuncinya** — yang ada *bentuk* objeknya | `{ kirim(pesan) { … } }` |
| **Abstraksi** | fungsi/objek yang **menyembunyikan** cara kerjanya | `kirimNotifikasi(pesan, pengirim)` |
| **Konkret** | `class` atau objek tertentu yang bisa `new` | `new PengirimEmail()` |
| **Injeksi ketergantungan** | kirim sebagai **parameter**, jangan buat di dalam | `kirim(pesan, pengirim)` vs `new PengirimEmail()` |
| **Polimorfisme** | objek berbeda, **method sama** | `pengirim.kirim()` untuk Email & WhatsApp |
| **Pewarisan** | `extends` | `class A extends B` |
| **Enkapsulasi** | `#field` (private) atau closure | `class X { #rahasia = 1 }` |
| **Komposisi** | taruh objek **di dalam** objek lain | `{ pengirim, pencatat }` |

> **Cara menjelaskan yang berhasil:** jangan definisikan istilahnya. Tunjukkan **dua baris
> kode** yang berbeda, lalu bilang: *"yang ini 'abstraksi', yang ini 'konkret' — bedanya
> di sini."*

---

## B. Pola kode yang sering muncul di kode AI

### B1. `if` berantai yang tersebar 🟡

```javascript
if (tipe === 'tetap')   { /* 15 baris */ }
else if (tipe === 'kontrak') { /* 15 baris */ }
else if (tipe === 'magang')  { /* 15 baris */ }
```
**Artinya:** memilih perilaku berdasarkan satu nilai.
**Masalahnya (Unit 2):** kalau pola yang **sama** muncul di 5 file, setiap tipe baru
menyentuh 5 tempat.
**Aman kalau:** hanya muncul **sekali**, dan jenisnya **jarang bertambah**.
**Berbahaya kalau:** muncul di beberapa file, atau jenisnya bertambah terus.

---

### B2. Objek peta sebagai pengganti `if` ⚪

```javascript
const pencetak = {
  pdf:   () => { /* ... */ },
  excel: () => { /* … */ },
};
return pencetak[jenis]();
```
**Artinya:** sama dengan `if` berantai, tapi **daftarnya ada di satu tempat**.
**Ini OCP dalam bentuk paling sederhana** (Unit 5) — menambah jenis = menambah satu entri,
**fungsi pemanggil tidak disentuh**.
**Aman kalau:** nilai yang dipetakan memang **data**, bukan logika bercabang.
**⚠️ Perhatikan:** `pencetak[jenis]` saat `jenis` tidak dikenal → `undefined` →
**"is not a function"**. Itu **error yang muncul**, jadi mudah ditemukan.

---

### B3. `class` dengan banyak tanggung jawab 🔴

```javascript
class LaporanSiswa {
  hitungNilai()      { /* ... */ }   // ← guru
  formatTampilan()   { /* ... */ }   // ← UI
  simpanKeDatabase() { /* ... */ }   // ← DBA
  kirimEmail()       { /* ... */ }   // ← admin
}
```
**Artinya:** satu wadah untuk beberapa hal.
**Masalahnya (Unit 4):** **empat orang berbeda** punya alasan meminta perubahan yang sama.
**Tidak ada error.** Ia jalan sempurna — sampai perubahan pertama datang.
**Cara memeriksa:** tanya *"siapa yang akan minta ini diubah?"* untuk tiap method.
Kalau jawabannya **orang berbeda** → kandidat pelanggaran SRP.

---

### B4. `new` di dalam fungsi 🟡

```javascript
function kirimNotifikasi(pesan) {
  const pengirim = new PengirimEmail();     // ← terkunci di dalam
  pengirim.kirim(pesan);
}
```
**Artinya:** fungsi **membuat sendiri** apa yang ia butuhkan.
**Masalahnya (Unit 6 — DIP):**
1. **Tidak bisa diuji** tanpa benar-benar mengirim email.
2. **Tidak bisa diganti** ke WhatsApp tanpa mengedit fungsi ini.
**Tidak ada error.** Ia jalan.
**Pengecualian yang sah:** `new` di **titik masuk aplikasi** (tempat merangkai semuanya) —
di situ memang tempatnya.

---

### B5. Factory — fungsi yang memilih 🟡

```javascript
function buatPengirim(jenis) {
  if (jenis === 'email') return new PengirimEmail();
  if (jenis === 'wa')    return new PengirimWhatsApp();
  throw new Error('jenis tidak dikenal');
}
```
**Artinya:** satu pintu masuk untuk membuat objek; **daftar konkretnya ada di dalam**.
**Bedanya dengan B4:** di B4 fungsi **memakai** objek konkret; di sini fungsi **membuat
sesuai permintaan** — pemanggil tidak tahu kelasnya.
**Aman kalau:** pemanggil memang tidak perlu tahu jenisnya.
**⚠️ Berbahaya kalau:** hanya pernah punya **satu** cabang selamanya — itu lapisan tanpa
manfaat (Unit 8).

---

### B6. Decorator — membungkus, bukan mewarisi 🟡

```javascript
function denganLog(pengirim) {
  return {
    kirim(pesan) {
      console.log('mengirim:', pesan);
      return pengirim.kirim(pesan);       // ← memanggil yang dibungkus
    },
  };
}
const pengirim = denganLog(new PengirimEmail());
```
**Artinya:** membungkus objek dengan perilaku tambahan, **tanpa** mengubah objeknya.
**Masalah yang dipecahkan (verbatim):** *"a combinatorial explosion of subclasses"* —
karena *"Inheritance is static"*.
**Angka konkretnya:** 3 jenis notifikasi × 3 cara mencatat log = **9 kelas** kalau pakai
`extends`. Dengan penghias: **3 + 3**.
**Aman kalau:** kamu butuh **menyusun** perilaku saat jalan.
**⚠️ Berbahaya kalau:** tumpukannya dalam — pembungkus di dalam pembungkus sulit dibaca
di stack trace.

---

### B7. Singleton — state global yang tidak kelihatan 🔴

```javascript
let instance = null;
export function getConfig() {
  if (!instance) instance = { /* ... */ };
  return instance;
}
```
**Artinya:** satu objek yang dipakai bersama semua bagian aplikasi.
**Masalahnya (Unit 12) — dari katalog polanya sendiri, verbatim:**
> *"Violates the Single Responsibility Principle. The pattern solves two problems at the
> time."*
> *"requires special treatment in a multithreaded environment so that multiple threads
> won't create a singleton object several times"*
> *"Or just don't write the tests. Or don't use the Singleton pattern."*
**Tidak ada error.** Dua bagian aplikasi saling mengganggu **kadang-kadang** — dan itu
jenis bug yang paling sulit dicari.
**Cara memeriksa:** cari **siapa saja** yang memanggil `getConfig()`.

---

### B8. Listener tanpa pelepasan 🔴

```javascript
window.addEventListener('resize', tanganiResize);   // ← tidak pernah dilepas
setInterval(perbarui, 1000);                        // ← tidak pernah dihentikan
socket.on('data', prosesData);                      // ← tidak pernah di-`off`
```
**Artinya:** mendaftarkan sesuatu yang akan dipanggil lagi nanti.
**Masalahnya (Unit 13):** ia **terus berjalan** setelah pemiliknya hilang.
**Tidak ada error.** Hanya memori yang tumbuh dan pekerjaan yang berulang tanpa guna.
**Cara memeriksa:** setiap `addEventListener` cari pasangannya (`removeEventListener`),
setiap `setInterval` cari `clearInterval`.

---

### B9. `Object.freeze` pada objek bersarang 🔴🔴 **yang paling berbahaya**

```javascript
const pengaturan = { nama: 'Sekolah', db: { host: 'localhost' } };
Object.freeze(pengaturan);
pengaturan.db.host = 'server-lain';    // ← BERHASIL! nested tidak beku
```
**Artinya:** mengunci objek supaya isinya tidak berubah (dikira).
**Masalahnya (Unit 11) — verbatim MDN:**
> *"The result of calling `Object.freeze(object)` only applies to the immediate properties
> of `object` itself... If the value of those properties are objects themselves, those
> objects are not frozen"*
**Hasil nyata (Node v22.22.2, saya jalankan):**
```
pengaturan.nama      → tidak berubah, TANPA error   ← gagal senyap
pengaturan.db.host   → BERUBAH jadi 'server-lain'   ← berhasil!
Object.isFrozen(pengaturan)     : true
Object.isFrozen(pengaturan.db)  : false
```
**🔴 DUA kegagalan berbeda di satu konsep:**
1. Perubahan yang **ditolak diam-diam** — nilai tidak berubah, **tanpa error**
2. Perubahan yang **berhasil padahal dikira terkunci** — objek bersarang

**Cara memeriksa:** `Object.isFrozen(obj)` untuk **setiap** lapisan yang kamu kira terkunci.
**Untuk benar-benar beku:** telusuri seluruh rantai referensinya, atau pakai
pustaka yang memang dirancang untuk itu.

---

### B10. `const` dianggap sudah beku 🟡

```javascript
const data = { nilai: 1 };
data.nilai = 2;              // ← BERHASIL. `const` tidak mengunci isinya.
data = { nilai: 3 };         // ← ini yang error (TypeError)
```
**Artinya:** `const` mengunci **nama variabelnya**, bukan **isi objeknya**.
**Beda dengan B9:** `freeze` mengunci **isi** (tapi hanya lapisan pertama).
**Keduanya sering tertukar.** Periksa dengan pertanyaan: *"yang mana yang saya kira
terkunci — namanya, atau isinya?"*

---

## C. Multithreading — istilah & padanannya

### C1. Model "satu pernyataan pada satu waktu" ⚪

```javascript
console.log('mulai');
prosesBerat();               // ← tidak ada yang lain bisa jalan sampai ini selesai
console.log('selesai');
```
**Kalimat resminya (MDN, verbatim):**
> *"An agent is a thread, which means the interpreter can only process one statement at
> a time."*
> *"Each job is processed completely before any other job is processed... whenever a
> function runs, it cannot be preempted and will run entirely before any other code runs"*

**🔴 Yang dimaksud bukan "single-threaded".**
Dokumentasi Node.js **tidak memuat** pernyataan *"Node.js is single-threaded"*, dan MDN
**tidak memuat** *"JavaScript is single-threaded"* sebagai kalimat berdiri sendiri.
**Sebut yang akurat:** *"interpreter memproses satu pernyataan pada satu waktu."*

**Sisi buruknya (verbatim MDN):**
> *"A downside of this model is that if a job takes too long to complete, the web
> application is unable to process user interactions like click or scroll."*
> *"A good practice to follow is to make job processing short and, if possible, cut down
> one job into several jobs."*

---

### C2. Kode CPU-berat yang memblokir 🔴

```javascript
for (let i = 2; i < 5_000_000; i++) {
  let prima = true;
  for (let j = 2; j * j <= i; j++) if (i % j === 0) { prima = false; break; }
  if (prima) jumlah++;
}
```
**Artinya:** loop berat yang berjalan sampai selesai sebelum apa pun yang lain.
**Hasil nyata (Node v22.22.2):**
```
mulai
jumlah prima: 348513      ← proses berat, TIDAK ADA peringatan
selesai
```
**🔴 Justru tidak adanya error itu masalahnya.** Aplikasi hanya "diam" beberapa detik.
Tidak ada pesan merah. Tidak ada stack trace.

**Cara memeriksa:** ukur **berapa lama** satu fungsi berjalan. Kalau ada fungsi yang
berjalan lebih dari ~50ms di jalur permintaan, itu kandidat.

---

### C3. `worker_threads` ⚪

```javascript
const { Worker } = require('node:worker_threads');
const worker = new Worker('./berat.js');
```
**Arti resminya (verbatim Node.js docs):**
> *"The `node:worker_threads` module enables the use of threads that execute JavaScript in
> parallel."*
> *"Unlike `child_process` or `cluster`, `worker_threads` can share memory. They do so by
> transferring `ArrayBuffer` instances or sharing `SharedArrayBuffer` instances."*

**🔴 Batas yang paling sering disalahpahami (verbatim):**
> *"Workers (threads) are useful for performing CPU-intensive JavaScript operations.
> **They do not help much with I/O-intensive work. The Node.js built-in asynchronous I/O
> operations are more efficient than Workers can be.**"*
> *"In practice, use a pool of Workers for these kinds of tasks. Otherwise, the overhead
> of creating Workers would likely exceed their benefit."*

**Aman kalau:** bebannya **CPU-berat** (hitung, kompresi, parsing besar), dan tugasnya
**berulang** (pakai *pool*, bukan buat Worker per tugas).
**Berbahaya kalau:** bebannya **I/O-berat** (baca file, panggil API) — async bawaan
**lebih efisien**.
**Berbahaya kalau:** Worker dibuat **di dalam loop** — biaya pembuatannya melebihi manfaatnya.

---

### C4. `Promise` & `await` — bukan paralel ⚠️

```javascript
// INI TIDAK PARALEL — berurutan:
for (const id of ids) {
  const data = await ambilData(id);     // ← menunggu satu per satu
}

// INI PARALEL:
const semua = await Promise.all(ids.map(id => ambilData(id)));
```
**Artinya:** `await` **melepas kendali** saat menunggu I/O.
**🔴 Kesalahpahaman paling sering:** `await` **tidak** memindahkan beban CPU ke inti lain.
Ia hanya membuat interpreter bisa mengerjakan hal lain **sambil menunggu**.
**Tidak ada error.** Yang kedua hanya **lebih lambat** — dan itu mudah terlewat.

**Cara membedakan yang cepat:** tanya *"yang ditunggu itu CPU, atau I/O?"*
I/O → `await`/`Promise.all` menjawabnya. CPU → butuh `worker_threads`.

---

### C5. GIL — istilah Python yang menjelaskan JavaScript ⚪

**Definisi (verbatim, Python docs):**
> *"The mechanism used by the CPython interpreter to assure that **only one thread
> executes Python bytecode at a time**."*

**🔴 Kenapa ini diajarkan di skill JavaScript** — dua bahasa, **model mental SAMA**:

| | JavaScript (MDN) | Python (docs resmi) |
|---|---|---|
| Kalimatnya | *"the interpreter can only process **one statement at a time**"* | *"only **one thread** executes Python bytecode **at a time**"* |
| **Gagasannya** | **"satu per satu pada satu waktu"** | **sama** |

**Jadi:** pembelajar yang paham JavaScript **sudah tahu** gagasan GIL — belum tahu
**namanya**. Itu sebabnya Unit 10 terasa mudah, bukan menakutkan.

**Pelepasan GIL saat I/O (verbatim):**
> *"**Also, the GIL is always released when doing I/O.**"*
→ Itu sebabnya `await` bekerja untuk I/O tapi tidak untuk CPU. **Gagasan yang sama.**

**Perkembangan terbaru (verbatim):**
> *"As of Python 3.13, the GIL can be disabled using the `--disable-gil` build
> configuration."*
> *"In free-threaded Python, multiple Python threads can run Python code simultaneously
> on different cores."*
⚠️ **Bisa dimatikan**, bukan **sudah dimatikan**. Build biasa tetap memakai GIL.

---

## D. Alat & cara memeriksa

| Alat | Untuk apa | Unit | Catatan |
|---|---|---|---|
| `console.log` | melihat nilai sebenarnya | semua | **Satu per dugaan.** Menyebar 10 sekaligus = tidak memburu |
| `node file.js` | menjalankan | semua | Pastikan v22+ |
| `node --test` | menjalankan tes bawaan | **11** | Tanpa `npm install` |
| `Object.isFrozen(x)` | memeriksa **satu lapisan** | **11** | Harus dipanggil **per lapisan** |
| `performance.now()` | mengukur lama fungsi | 9 | Untuk menemukan CPU-berat |
| `process.memoryUsage()` | melihat memori | 14 | Untuk melihat pertumbuhan |
| `git log` / `git diff` | melihat **berapa file** tersentuh | 2, 4 | Bukti "perubahan menyebar" |

### Prasyarat Node — **terverifikasi**

```
$ node --version
v22.22.2

$ node -e "const t=require('node:test'); console.log(Object.keys(t).slice(0,12).join(', '))"
node:test tersedia di v22.22.2
exports: skip, todo, only, after, afterEach, before, beforeEach, describe, it, run, suite, test
```
**`node:test` sudah bawaan — tidak perlu `npm install`.**

---

## E. Tanda bahaya di kode yang harus dicurigai

| Yang terlihat | Kecurigaan | Unit |
|---|---|---|
| Nama fungsi mengandung "dan" (`hitungDanSimpan`) | Dua tanggung jawab | 4 |
| `new` di tengah logika | DIP dilanggar | 6 |
| `Object.freeze(` | **Periksa apakah ada objek bersarang** | **11** |
| `getSomething()` yang mengembalikan objek sama | Singleton tersembunyi | 12 |
| `addEventListener` tanpa pasangan | Listener bocor | 13 |
| `await` di dalam `for` | Berurutan, bukan paralel | 9 |
| `new Worker` di dalam `for` | Tanpa *pool* | 9 |
| Komentar "aman", "thread-safe", "sudah dioptimalkan" | **Klaim tanpa verifikasi** | 6, 12, 15 |
| Komentar "untuk sementara" | Utang yang jadi permanen | 15 |
| `try { } catch { }` yang kosong | Kegagalan disembunyikan | semua |

> **Perhatikan polanya:** hampir semua tanda bahaya di atas adalah **tanda yang tenang.**
> Tidak ada yang berteriak "di sini ada masalah".

---

**📅 Dibuat:** 28 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `korpus-ai.md` ·
`cakupan-vs-dokumen-resmi.md`
