# Peta Unit — Detail per Unit (Software Design Mode Inspeksi)

> Referensi untuk skill `teach-software-design`. **Tutor membaca file ini sendiri** —
> pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **18 unit · 4 bagian · 4 gerbang.** Bagian 0 = **prasyarat** (kenapa desain penting).
> Bagian 3 = **opsional**, hanya setelah Bagian 0–2 lulus.
> Setiap unit: **konsep · kode yang dikenali · yang diajarkan · latihan inspeksi ·
> miskonsepsi · kriteria lulus · sumber.**
> Satu unit = 1–2 sesi × maks 1 jam.
>
> **Kamus istilah lengkap ada di `sintaks-javascript.md`.** Baris *"Kode yang dikenali"*
> di tiap unit hanya menyebut yang paling sering muncul.
>
> **Bidang skill ini: rekayasa perangkat lunak** — cara menulis & merawat kode.
> Bukan arsitektur sistem (lihat `roadmap-4-tingkat.md` §10).

---

## Aturan umum semua unit

| | |
|---|---|
| Bentuk sesi | 6 tahap: PREDIKSI → JALANKAN → BEDAH → UBAH → [PERBAIKI] → CATAT |
| Alat | Terminal + Node.js (v22+). Bagian 2+: `node:test` (bawaan, tanpa instalasi) |
| Korpus | **Kode hasil generate AI** (lihat `korpus-ai.md`) |
| Ukuran kode | Bagian 0: 20–40 baris. Bagian 1: 40–80. Bagian 2: 2–4 file. Bagian 3: 3–5 file. |
| Aturan mutlak | `prediksi.md` ditulis & disimpan **sebelum** kode dijalankan |
| Sumber sitasi | `Martin (2000)` · `GoF (1994)` · `MDN: <topik>` · `Node.js docs: <modul>` · `Python docs: <entri>` |
| **Istilah asing** | **JANGAN bilang "di luar materi"** → cek `sintaks-javascript.md`, jelaskan **satu istilah**, lanjut |
| **Tahap PERBAIKI** | **TDD: tes GAGAL dulu**, baru kode diperbaiki. Urutan tidak boleh dibalik |

**Cara menyiapkan terminal (dilakukan tutor sekali, sebelum Unit 1):**

```
mkdir PRAKTIK/sesi-001 && cd PRAKTIK/sesi-001
node --version        # pastikan v22+ (untuk node:test)
```

Sebutkan ke pembelajar **apa yang baru saja terjadi** — tapi **jangan jadikan sesi
sendiri**. Itu produksi, bukan inspeksi.

---

# BAGIAN 0 — PRASYARAT: KENAPA DESAIN PENTING (Unit 1–3)

> **Ini bukan pemanasan.** SOLID tanpa bagian ini = lima huruf yang dihafal.
> Pembelajar harus **kenal gejalanya dulu**, baru diberi nama obatnya.
>
> **Belum ada `class`.** Belum ada pola. Belum ada tes. Hanya file `.js` yang dijalankan
> dengan `node`. Itu disengaja: satu hal pada satu waktu.
>
> ⚠️ **Prasyarat:** `teach-javascript` Unit 1–8 (fungsi, objek, array).

---

## Unit 1 — Kode yang jalan ≠ kode yang bisa diubah

**Konsep.** Dua program bisa **sama-sama menghasilkan keluaran yang benar**, tapi sangat
berbeda saat **diubah**. Yang menentukan bukan keluarannya, tapi **biaya perubahan
berikutnya**.

**Kode yang dikenali:**
```javascript
function hitungGaji(karyawan) {
  if (karyawan.tipe === 'tetap')      { /* ... 15 baris ... */ }
  else if (karyawan.tipe === 'kontrak'){ /* ... 15 baris ... */ }
  else if (karyawan.tipe === 'magang') { /* ... 15 baris ... */ }
  return total;
}
```

**Yang diajarkan.** Paper Martin (2000) menyebut **empat gejala** desain yang membusuk —
dan keempatnya **bisa dirasakan sebelum tahu nama prinsipnya**:

> *"There are four primary symptoms that tell us that our designs are rotting. They are
> not orthogonal, but are related to each other... they are: rigidity, fragility,
> immobility, and viscosity."*

| Gejala | Definisi verbatim | Bahasa sehari-hari |
|---|---|---|
| **Rigidity** | *"the tendency for software to be difficult to change, even in simple ways. Every change causes a cascade of subsequent changes in dependent modules."* | Ubah satu hal → lima file ikut berubah |
| **Fragility** | *"the tendency of the software to break in many places every time it is changed. Often the breakage occurs in areas that have no conceptual relationship with the area that was changed."* | Rusak di tempat yang tidak ada hubungannya |
| **Immobility** | *"the inability to reuse software from other projects or from parts of the same project."* | Tidak bisa dipakai ulang di proyek lain |
| **Viscosity** | *"When the design preserving methods are harder to employ than the hacks, then the viscosity of the design is high. It is easy to do the wrong thing, but hard to do the right thing."* | Jalan pintas lebih mudah dari jalan benar |

**Latihan inspeksi (LACAK).** Diberi file 30 baris. **Sebut gejala mana** yang muncul
kalau satu persyaratan diubah. **Belum minta solusi.**

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Kalau keluarannya benar, kodenya benar."* | Keluaran benar hanya satu syarat. Syarat kedua: **bisa diubah**. |
| *"Kode yang panjang pasti lebih buruk."* | Panjang bukan masalahnya. **Jumlah tempat yang harus disentuh saat berubah** — itu masalahnya. |
| *"Ini cuma teori akademik."* | Empat gejala ini **bisa diperiksa**: hitung berapa tempat yang harus diedit. |

**Kriteria lulus.** Menyebut **≥ 2 dari 4 gejala** dengan benar, dan **membenarkan**
pilihan gejalanya dengan menunjuk barisnya.

**Sumber.** Martin, R.C. (2000). *Design Principles and Design Patterns*, §*Symptoms of
Rotting Design*. www.objectmentor.com · 34 hal.

---

## Unit 2 — Perubahan yang menyebar

**Konsep.** **Ukuran** desain yang paling konkret: **berapa tempat harus disentuh**
kalau satu persyaratan berubah. Bukan perasaan — **hitung**.

**Kode yang dikenali:**
```javascript
// file 1: validasi
if (tipe === 'tetap') { /* ... */ }
// file 2: perhitungan
if (tipe === 'tetap') { /* ... */ }
// file 3: tampilan
if (tipe === 'tetap') { /* ... */ }
// file 4: laporan
if (tipe === 'tetap') { /* ... */ }
// file 5: ekspor
if (tipe === 'tetap') { /* ... */ }
```

**Yang diajarkan.** Kenapa **lima `if` yang sama** adalah masalah meski **kodenya jalan**.
Setiap tipe baru = **lima file disentuh**. Dan risiko terbesarnya: **satu di antaranya
terlupa** — dan itu **tidak akan error** saat dijalankan.

**Latihan inspeksi (TELUSUR ringan).** Tambah tipe baru. **Prediksi dulu**: berapa tempat
yang harus diedit? Baru hitung sungguhan. **Di mana tebakannya meleset?**

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Saya pakai `switch` saja, biar rapi."* | `switch` yang muncul di lima file tetap lima tempat. Masalahnya **tempatnya**, bukan bentuknya. |
| *"Copy-paste lebih cepat."* | Lebih cepat **sekarang**. Bayarnya **di perubahan berikutnya** — dan itu berulang. |
| *"Ini cuma 5 file, masih kecil."* | Kalimat yang sama diucapkan di 50 file. Yang dilatih: **mengenali polanya sekarang**. |

**Kriteria lulus.** Menyebut **jumlah tempat** dengan benar, dan **menyebutkan tempatnya**
(bukan sekadar angkanya).

**Sumber.** Martin (2000) — *rigidity*.

---

## Unit 3 — Kenapa ini penting untuk KAMU

**Konsep.** Kode AI **selalu jalan** dan **sering terlihat rapi**. Kode contoh di tutorial
juga rapi. **Rapinya adalah masalahnya** — karena kerapian itu **menyembunyikan** gejala
desain buruk.

**Yang diajarkan.**
- Angka yang bisa dirujuk: **66% developer** frustrasi utamanya *"solutions that are
  almost right, but not quite"* — Stack Overflow Developer Survey 2025.
- **45%** bilang men-debug kode AI **lebih memakan waktu** dari menulisnya sendiri.
- Kode AI punya **ciri khas cacatnya sendiri** — daftar lengkapnya di `korpus-ai.md` §3.

**Latihan inspeksi (KLAIM).** Dua versi kode yang **sama-sama jalan**. Tentukan mana yang
lebih mudah diubah — **dan sebut alasannya**. Klaim yang diuji: *"versi kedua lebih mudah
dirawat."*

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"AI sudah menulisnya, pasti sudah memikirkan desainnya."* | AI mengoptimalkan **kode yang jalan sekarang**. Desain jangka panjang bukan target utamanya. |
| *"Kalau nanti bermasalah, tinggal minta AI memperbaiki."* | Setiap perbaikan pada desain yang buruk **menambah** kekusutan. Titik di mana AI tidak bisa lagi membantu datang lebih cepat dari yang diduga. |

**Kriteria lulus.** Menunjuk **satu perbedaan konkret** antara dua versi, dan mengaitkannya
ke **biaya perubahan** — bukan ke selera (*"yang ini lebih modern"*).

**Sumber.** Stack Overflow Developer Survey 2025; MIT Media Lab (arXiv 2506.08872).

> **→ GERBANG 1** (lihat `roadmap-4-tingkat.md` §1)

---

# BAGIAN 1 — PRINSIP: KODE YANG BISA DIUBAH (Unit 4–7)

> 🔴 **KOREKSI WAJIB SEBELUM MENGAJAR.**
> Paper **Martin (2000)** memuat **4 prinsip**: **OCP · LSP · ISP · DIP**.
> Paper itu **TIDAK memuat SRP** (`"Single Responsibility"` → **0 hasil**), dan
> **TIDAK memuat akronim "SOLID"** (**0 hasil** di 34 halaman).
> Urutan benar: **2000 = 4 prinsip** → **SRP menyusul** (akhir 1990-an) → akronim
> **SOLID** diusulkan **Michael Feathers** ⚠️ (sumber sekunder).
> **JANGAN mengajarkan "SOLID diperkenalkan Martin 2000".**

---

## Unit 4 — Tanggung jawab tunggal (SRP)

**Konsep.** Definisi resminya (dari penulisnya sendiri):
> *"The Single Responsibility Principle (SRP) states that each software module should
> have one and only one reason to change."*
> *"This principle is about people."*
> *"Gather together the things that change for the same reasons. Separate those things
> that change for different reasons."*
> — Martin (2014), blog resmi

**Kunci pemahamannya:** *"reason to change"* itu **orang**, bukan **hal**. "Satu hal"
terlalu kabur; yang jelas adalah **siapa yang bisa meminta perubahan**.

**Kode yang dikenali:**
```javascript
class LaporanSiswa {
  hitungNilai()        { /* ... */ }   // ← guru
  formatTampilan()     { /* ... */ }   // ← desainer/UI
  simpanKeDatabase()   { /* ... */ }   // ← DBA
  kirimEmail()         { /* ... */ }   // ← admin
}
```

**Yang diajarkan.** Empat fungsi di atas **jalan semua**. Yang jadi masalah: **empat
orang berbeda** punya alasan untuk meminta perubahannya. Permintaan dari salah satu
menyentuh file yang sama.

**Latihan inspeksi (LACAK).** Sebut **berapa orang/divisi** yang bisa meminta perubahan
pada satu file, **dan bagian mana** masing-masing.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Satu file satu fungsi."* | Bukan soal jumlah. **Satu alasan untuk berubah** — itu kriterianya. |
| *"Satu class harus menangani satu hal."* | Sama seperti di atas. `class` dengan 10 fungsi yang semua melayani **satu** pemangku kepentingan = **lulus SRP**. |
| *"SRP itu bagian dari paper SOLID 2000."* 🔴 | **Bukan.** Paper 2000 **tidak memuat SRP** — saya cari `"Single Responsibility"`, hasilnya **0**. SRP disusun **setelah** paper itu. |
| *"Pecah semuanya jadi file kecil."* | Itu **melewati** batas. Unit 7 mengajarkan kapan berhenti. |

**Kriteria lulus.** Menyebut pemangku kepentingan yang berbeda untuk setiap bagian yang
dianggap perlu dipecah — **dan bisa membenarkan** kenapa bagian yang **tidak** dipecah
memang tidak perlu.

**Sumber.** Martin, R.C. (2014). *The Single Responsibility Principle*.
`blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html`

---

## Unit 5 — Terbuka–tertutup (OCP)

**Konsep.** Definisi verbatim dari paper 2000:
> *"A module should be open for extension but closed for modification."*

Menambah kemampuan **tanpa mengedit** kode yang **sudah lulus uji**.

**Kode yang dikenali — dua versi:**

```javascript
// VERSI A — tertutup untuk perpanjangan
function cetak(laporan) {
  if (laporan.jenis === 'pdf')  { /* ... */ }
  else if (laporan.jenis === 'excel') { /* ... */ }
  // menambah jenis baru = EDIT fungsi ini
}
```
```javascript
// VERSI B — terbuka untuk perpanjangan
const pencetak = {
  pdf:   () => { /* ... */ },
  excel: () => { /* ... */ },
};
function cetak(laporan) {
  return pencetak[laporan.jenis]();
  // menambah jenis baru = TAMBAH satu entri, fungsi ini tidak disentuh
}
```

**Yang diajarkan.** **Perhatikan bedanya:** keduanya jalan. Yang berbeda: **apakah
`cetak()` perlu diedit** saat jenis baru datang? Versi B: tidak. **Itu inti OCP.**
Dan **hubungan ke Unit 4:** versi A menanggung dua tanggung jawab — memilih **dan**
melaksanakan.

**Latihan inspeksi (KLAIM).** Klaim: *"menambah jenis laporan baru tidak perlu mengubah
file lama."* **Verifikasi klaim itu.**

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"OCP berarti tidak boleh mengedit kode sama sekali."* | Bukan. Yang dimaksud: **menambah kemampuan** tidak perlu mengedit. Bug tetap diperbaiki dengan mengedit. |
| *"Semua `if` harus diganti objek peta."* | Tidak. **Dua cabang yang jarang berubah** = `if` sudah cukup. Objek peta untuk yang **sering bertambah**. |
| *"Ini sama dengan polimorfisme."* | Polimorfisme (`class` + `extends`) adalah **salah satu** caranya. Objek peta **juga** cara sah. |

**Kriteria lulus.** Menunjuk **fungsi mana** yang tidak perlu diedit di versi B, **dan**
kenapa. Tidak cukup bilang "versi B lebih bagus".

**Sumber.** Martin (2000) — OCP.

---

## Unit 6 — Substitusi & ketergantungan (LSP · DIP)

**Konsep.** Dua prinsip, satu tema: **siapa bergantung pada siapa.**

> **LSP:** *"Subclasses should be substitutable for their base classes."*
> **DIP:** *"Depend upon Abstractions. Do not depend upon concretions."*
> — Martin (2000)

**Kode yang dikenali:**
```javascript
// Melanggar DIP — pemanggil tahu kelas konkretnya
function kirimNotifikasi(pesan) {
  const pengirim = new PengirimEmail();   // ← konkret, dikunci di dalam
  pengirim.kirim(pesan);
}
```
```javascript
// Menaati DIP — pemanggil hanya tahu "sesuatu yang bisa mengirim"
function kirimNotifikasi(pesan, pengirim) {  // ← disuntik dari luar
  pengirim.kirim(pesan);
}
kirimNotifikasi('Halo', new PengirimWhatsApp());  // ← bisa diganti tanpa edit
```

**Yang diajarkan.** **`new` di dalam fungsi = kunci.** Fungsi itu **tidak bisa** diuji
tanpa benar-benar mengirim email, dan **tidak bisa** diganti ke WhatsApp tanpa diedit.

**LSP dalam praktik:** kalau `PengirimWhatsApp` perlu parameter tambahan yang tidak ada di
`PengirimEmail`, ia **tidak bisa** menggantikannya. Itu pelanggaran LSP — dan ia muncul
sebagai **error saat dijalankan**, bukan saat ditulis.

**Latihan inspeksi (LACAK + KLAIM).** Ganti satu implementasi **tanpa** menyentuh
pemanggilnya — prediksi apakah mungkin, lalu buktikan.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"DIP = pakai `interface`."* | JavaScript tidak punya `interface`. DIP soal **arah ketergantungan**, bukan kata kuncinya. |
| *"LSP soal pewarisan saja."* | LSP soal **janji yang bisa ditepati**. Kalau penggantinya butuh syarat tambahan, janjinya tidak ditepati. |
| *"Semua `new` harus dihapus."* | Tidak. `new` di **titik masuk** (composition root) itu **benar** — di situ memang tempatnya merangkai. Yang salah: `new` **di tengah logika**. |

**Kriteria lulus.** Menunjuk **satu `new`** yang mengunci, **dan** menjelaskan kenapa
memindahkannya membuat fungsi itu bisa diuji.

**Sumber.** Martin (2000) — LSP, DIP.

---

## Unit 7 — Pemisahan antarmuka (ISP) + **kapan berhenti**

**Konsep.** Definisi verbatim:
> *"Many client specific interfaces are better than one general purpose interface"*
> — Martin (2000)

**Dan bagian yang jarang diajarkan:** prinsip ini **bisa disalahgunakan**. Kalau setiap
pemanggil punya "antarmuka sendiri", hasilnya **puluhan file kecil** yang saling
menunjuk — dan itu **lebih sulit** dirawat daripada satu file yang jelas.

**Kode yang dikenali:**
```javascript
// ISP dilanggar: semua pemanggil dipaksa tahu 8 method
const layanan = {
  hitungNilai, kirimEmail, cetakPdf, eksporExcel,
  simpanDb,  hapusDb,   backup,   auditLog,
};
// pemanggil yang cuma butuh hitungNilai tetap "melihat" 7 sisanya
```

**Yang diajarkan.** **Ini unit tentang batas, bukan tentang teknik.** Setelah tiga unit
berisi prinsip "pisahkan, pisahkan, pisahkan", pembelajar **butuh** satu unit yang bilang:
**berhenti**. Kriterianya bukan "seberapa murni", tapi **"apakah ini lebih mudah dirawat?"**

**Latihan inspeksi (KLAIM).** Dua struktur: **satu file besar** vs **lima file kecil**.
Tentukan mana yang lebih mudah dirawat **di sini**, dan sebut alasannya. Klaim yang diuji:
*"memecah jadi lima file selalu lebih baik."*

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Lebih banyak file = desain lebih baik."* | Kedua arah bisa salah. Yang dinilai: **biaya perubahan**. |
| *"Prinsip itu aturan yang harus dipatuhi."* | Prinsip adalah **alat menilai**. Kadang mematuhinya **merugikan**. |
| *"Kalau saya tidak mematuhi SOLID, desain saya buruk."* | **Tidak ada namanya "mematuhi SOLID".** Yang ada: memutuskan trade-off, dan bisa menjelaskan pilihanmu. |

> **Unit ini adalah sikap.** Kalau dilewati, pembelajar akan **memecah segalanya** dan
> menyebutnya "SOLID". Kejujuran soal biaya adalah bagian dari kompetensinya.

**Kriteria lulus.** Menyebut **biaya** dari pilihan yang diambil, bukan hanya manfaatnya.
Jawaban yang mengaku "lebih baik di segala hal" = **belum lulus**.

**Sumber.** Martin (2000) — ISP. Martin (2000) — *viscosity* (biaya jalan benar).

> **→ GERBANG 2** (lihat `roadmap-4-tingkat.md` §2)

---

# BAGIAN 2 — POLA & DATA AMAN (Unit 8–11)

> **Bagian ini memuat tiga unit yang gagal SENYAP** — Unit 9, 10, dan 11.
> Ketiganya **tidak menghasilkan error**. Hanya hasil yang salah.
> Itu sebabnya ketiganya masuk daftar TELUSUR di `korpus-ai.md` §4(d).

---

## Unit 8 — Pola pabrik & dekorator

**Konsep.** **Pola desain** = solusi yang sudah terbukti untuk masalah yang sudah
berulang. Bukan aturan; **kosakata**.

**Empat pola yang diajarkan di skill ini** + klasifikasinya (verbatim intent):

| Pola | Klasifikasi | Intent |
|---|---|---|
| **Factory Method** | **Creational** | *"provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created."* |
| **Decorator** | **Structural** | *"lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors."* |
| **Singleton** | **Creational** | *"lets you ensure that a class has only one instance, while providing a global access point to this instance."* (→ **Unit 12**) |
| **Observer** | **Behavioral** | *"lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing."* (→ **Unit 13**) |

**Factory — kode yang dikenali:**
```javascript
function buatPengirim(jenis) {
  if (jenis === 'email') return new PengirimEmail();
  if (jenis === 'wa')    return new PengirimWhatsApp();
}
```
Perhatikan: **Factory menjawab "yang mana"**, pabriknya yang tahu daftar konkretnya.

**Decorator — masalah yang dipecahkan (verbatim):** *"a combinatorial explosion of
subclasses"* — karena *"Inheritance is static"*. Kalau kamu punya 3 jenis notifikasi dan
3 cara mencatat log, pewarisan butuh **9 kelas**. Penghias butuh **3 + 3**.

**Latihan inspeksi (SUSUN).** Baris diacak dari implementasi Factory → susun ulang.
**Tanpa distractor** (lihat `roadmap-4-tingkat.md` §6).

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Pola desain harus dipakai kalau ada kesempatan."* | Pola **menambah** lapisan. Pakai kalau masalahnya **sudah ada**, bukan kalau mungkin akan datang. |
| *"Factory cuma `new` yang dibungkus fungsi."* | Sering memang begitu — dan itu **cukup**. Kekuatannya: daftar konkretnya **ada di satu tempat**. |
| *"Decorator sama dengan `extends`."* | `extends` **mengunci di waktu tulis kode**. Decorator **menyusun di waktu jalan**. |

**Kriteria lulus.** Menyebut **pola apa**, **klasifikasinya**, dan **satu kelemahannya**.

**Sumber.** Gamma, Helm, Johnson, Vlissides (1994). *Design Patterns: Elements of
Reusable Object-Oriented Software*. Addison-Wesley · ISBN 0201633612.
⚠️ **Buku ini tidak dibaca isinya** — hanya diverifikasi keberadaan, penerbit, ISBN,
tanggal terbit (31 Okt 1994). Intent di atas dari katalog pola yang merujuk padanya.

---

## Unit 9 — Multithreading di JavaScript ⭐

**Konsep.** JavaScript memproses **satu pernyataan pada satu waktu**:

> *"An agent is a thread, which means the interpreter can only process one statement
> at a time."*
> *"Each job is processed completely before any other job is processed. This offers some
> nice properties when reasoning about your program, including the fact that whenever a
> function runs, it cannot be preempted and will run entirely before any other code runs..."*
> — MDN, *JavaScript execution model*

**Dan sisi buruknya (verbatim, MDN):**
> *"A downside of this model is that if a job takes too long to complete, the web
> application is unable to process user interactions like click or scroll."*
> *"A good practice to follow is to make job processing short and, if possible, cut down
> one job into several jobs."*

**Kode yang dikenali — kode AI yang memblokir (fails silently):**
```javascript
console.log('mulai');
let jumlah = 0;
for (let i = 2; i < 5_000_000; i++) {      // ← CPU-berat di jalur utama
  let prima = true;
  for (let j = 2; j * j <= i; j++) if (i % j === 0) { prima = false; break; }
  if (prima) jumlah++;
}
console.log('jumlah prima:', jumlah);
console.log('selesai');
```
**Hasil nyata** (dijalankan Node v22.22.2):
```
mulai
jumlah prima: 348513      ← proses berat, TIDAK ADA peringatan
selesai
```
> **Justru tidak adanya error itu masalahnya.** Aplikasi hanya "diam" beberapa detik.
> Tidak ada pesan merah. Tidak ada stack trace.

**Jawabannya — `worker_threads`:**
> *"The `node:worker_threads` module enables the use of threads that execute JavaScript
> in parallel."*
> *"Unlike `child_process` or `cluster`, `worker_threads` can share memory. They do so by
> transferring `ArrayBuffer` instances or sharing `SharedArrayBuffer` instances."*
> — Node.js docs

**🔴 Dan batasnya — ini yang paling sering disalahpahami (verbatim):**
> *"Workers (threads) are useful for performing CPU-intensive JavaScript operations.
> **They do not help much with I/O-intensive work. The Node.js built-in asynchronous I/O
> operations are more efficient than Workers can be.**"*
> *"In practice, use a pool of Workers for these kinds of tasks. Otherwise, the overhead
> of creating Workers would likely exceed their benefit."*
> — Node.js docs

**Latihan inspeksi (TELUSUR).** Aplikasi "menggantung" saat memproses data besar —
**tidak ada error di console**. Cari sebabnya. Dugaan ditulis **sebelum** menyentuh kode.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Node.js itu single-threaded."* ⚠️ | Dokumentasi Node.js **tidak memuat** kalimat ini. Yang akurat: **"interpreter memproses satu pernyataan pada satu waktu"** (MDN). Sebut yang akurat, jangan yang populer. |
| *"`await` membuat kode berjalan paralel."* | `await` **melepas** kendali saat menunggu I/O. Ia **tidak** memindahkan beban CPU ke inti lain. |
| *"Kalau butuh cepat, pakai Worker."* | **Bergantung beban.** I/O-berat: Worker **lebih lambat** — async bawaan lebih efisien. |
| *"Worker selalu lebih cepat karena pakai banyak inti."* | Ada **biaya membuat** Worker. Untuk tugas kecil, biayanya **melebihi** manfaatnya. |
| *"Kalau berat tapi tidak error, berarti aman."* | Justru itu **unit ini**: berat **tanpa error** adalah masalah tersembunyi. |

**Kriteria lulus.** Menunjuk **baris mana** yang memblokir, **dan** memutuskan apakah
Worker memang perlu **untuk kasus itu** — dengan alasan.
Menjawab "pakai Worker" untuk beban I/O = **belum lulus**.

**Sumber.** Node.js Official Docs — `node:worker_threads`. MDN — *JavaScript execution
model*. ✅ **Empat verifikasi empiris dijalankan di Node v22.22.2** (lihat
`cakupan-vs-dokumen-resmi.md` §6).

---

## Unit 10 — Multithreading sebagai konsep umum

**Konsep.** Model **"satu per satu"** muncul di **banyak bahasa** — bukan kekhasan
JavaScript. Pembelajar yang paham JavaScript akan **langsung mengenali** bentuk yang sama
di bahasa lain. **Ini jembatannya.**

> **Keputusan xcode (28 Sep 2026):** multithreading diajarkan **dua-duanya** — di
> JavaScript (Unit 9) **dan** sebagai konsep umum (Unit 10).

**Definisi GIL Python (verbatim, docs resmi):**
> *"The mechanism used by the CPython interpreter to assure that **only one thread
> executes Python bytecode at a time**."*
> *"This simplifies the CPython implementation by making the object model (including
> critical built-in types such as `dict`) implicitly safe against concurrent access."*
> *"Locking the entire interpreter makes it easier for the interpreter to be
> multi-threaded, at the expense of much of the parallelism afforded by multi-processor
> machines."*

**🔴 Temuan yang membuat unit ini layak diajarkan — dua bahasa, model mental SAMA:**

| | JavaScript (MDN) | Python (docs resmi) |
|---|---|---|
| Kalimatnya | *"the interpreter can only process **one statement at a time**"* | *"only **one thread** executes Python bytecode **at a time**"* |
| Istananya | satu pernyataan | satu bytecode |
| **Gagasannya** | **"satu per satu pada satu waktu"** | **sama** |

**Yang diajarkan ke pembelajar:** *"Kamu sudah tahu ini dari JavaScript. Python cuma
memberinya nama: GIL."* **Bukan konsep baru — hanya nama baru.**

**Paralelisme & multi-core (verbatim):**
> *"In Python builds with the global interpreter lock (GIL), only one thread runs Python
> bytecode at a time, so taking advantage of multiple CPU cores typically involves
> multiple processes (e.g. `multiprocessing`) or native extensions that release the GIL."*

**Pelepasan GIL saat I/O (verbatim) — jembatan ke istilah CPU-bound / I/O-bound:**
> *"some extension modules... are designed so as to release the GIL when doing
> computationally intensive tasks such as compression or hashing. **Also, the GIL is
> always released when doing I/O.**"*

**Perkembangan terbaru yang wajib disebut (verbatim):**
> *"As of Python 3.13, the GIL can be disabled using the `--disable-gil` build
> configuration."*
> *"In free-threaded Python, multiple Python threads can run Python code simultaneously
> on different cores."*

**Peta tiga model (dari sumber, bukan opini):**

| Bahasa | Mekanisme paralel | Batasnya menurut dokumentasi resmi |
|---|---|---|
| JavaScript (Node) | `worker_threads` | *"do not help much with I/O-intensive work"* |
| JavaScript (web) | Web Worker (`agent`) | agen berbagi memori lewat `SharedArrayBuffer` + `Atomics` |
| Python | `multiprocessing` | GIL: *"only one thread executes Python bytecode at a time"* |
| Python (3.13+) | free-threading (`--disable-gil`) | *"multiple Python threads can run Python code simultaneously"* |

**Latihan inspeksi (LACAK).** Diberi tiga skenario. Tentukan: **paralel benar-benar perlu,
atau tidak?** Sebut alasannya. Satu skenario **sengaja I/O-berat** — jawaban "pakai
Worker" di situ salah.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Ini cuma soal Python."* | Ini soal **model eksekusi**. Python dipakai sebagai **contoh kedua** supaya polanya kelihatan. |
| *"GIL itu bug Python."* | Ia **pilihan desain**: *"simplifies the CPython implementation by making the object model... implicitly safe against concurrent access."* |
| *"Python 3.13+ sudah tidak ada GIL."* | **Bisa dimatikan** (`--disable-gil`), **bukan** dimatikan. Build biasa tetap pakai GIL. |
| *"Multithreading selalu mempercepat."* | **Bergantung beban.** CPU-berat vs I/O-berat → jawabannya berbeda. |

**⚠️ Batas jujur yang WAJIB disampaikan.** Dokumentasi Python **tidak memuat** panduan
preskriptif *"pakai threading kapan, multiprocessing kapan"*. Yang ada hanya pernyataan
**deskriptif**. Maka **jangan menyusun tabel "pakai X kalau Y"** seolah-olah dari
dokumentasi resmi. Yang boleh: **menyimpulkan bersama pembelajar** dari pernyataan yang
ada, dan menyebutnya sebagai **kesimpulan**, bukan kutipan.

**Kriteria lulus.** Untuk ketiga skenario: keputusan **benar** + alasan menyebut
**jenis bebannya** (CPU-berat atau I/O-berat).

**Sumber.** Python Official Docs — Glossary: `global interpreter lock`, `concurrency`,
`parallelism`, `free threading`. MDN — *JavaScript execution model*.

---

## Unit 11 — Immutability & TDD ⭐⭐ · **WAJIB DIPECAH 2 SESI**

> ⚠️ **Dua konsep berbeda. Jangan digabung satu sesi.**
> Sesi A: `Object.freeze` (kegagalan senyap). Sesi B: TDD (Red-Green-Refactor).

### Sesi A — Immutability

**Konsep.** Membekukan objek **terlihat mudah** dan **sering gagal senyap**.

**Definisi verbatim (MDN):**
> *"The `Object.freeze()` static method freezes an object. Freezing an object prevents
> extensions and makes existing properties non-writable and non-configurable. A frozen
> object can no longer be changed..."*
> *"Any attempt to do so will fail, either silently or by throwing a TypeError exception
> (most commonly, but not exclusively, when in strict mode)."*

**🔴 Sumber bug paling penting — `freeze` itu SHALLOW (verbatim MDN):**
> *"The result of calling `Object.freeze(object)` only applies to the immediate properties
> of `object` itself... If the value of those properties are objects themselves, those
> objects are not frozen and may be the target of property addition, removal or value
> re-assignment operations."*
> *"A frozen object is immutable. However, it is not necessarily constant. ... (freeze is
> shallow)"*
> *"To be a constant object, the entire reference graph (direct and indirect references to
> other objects) must reference only immutable frozen objects."*

**✅ Diverifikasi empiris (Node v22.22.2) — hasil nyata:**
```javascript
const asli = { nama: 'Budi', alamat: { kota: 'Bandung' } };
Object.freeze(asli);

asli.nama = 'Andi';            // → gagal SENYAP (tidak error!)
asli.alamat.kota = 'Jakarta';  // → BERHASIL (nested tidak beku!)

// Hasil:
// nama setelah coba ubah : Budi      ← tidak berubah, tapi TIDAK ADA error
// kota setelah coba ubah : Jakarta   ← berubah juga!
// Object.isFrozen(asli)          : true
// Object.isFrozen(asli.alamat)   : false
```

> **Ada DUA kegagalan berbeda di satu konsep:**
> (1) perubahan yang **ditolak diam-diam** — nilai tidak berubah, tanpa error;
> (2) perubahan yang **berhasil padahal dikira sudah dikunci** — objek bersarang.
> Keduanya **tidak menghasilkan error.**

**Latihan inspeksi (TELUSUR).** *"Kenapa data saya tetap berubah padahal sudah saya
`freeze`?"* — tanpa error. Dugaan ditulis **sebelum** menyentuh kode.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"`freeze` membuat objek tidak bisa diubah."* | Hanya **lapisan pertama**. MDN: *"only applies to the immediate properties"*. |
| *"Kalau berubah, pasti ada error."* | Justru **tidak**. *"will fail, either silently or by throwing"* — dan mode non-strict **diam**. |
| *"`const` sama dengan `freeze`."* | `const` mengunci **nama** variabelnya. `freeze` mengunci **isi** objeknya. |
| *"`freeze` membuat objeknya konstan."* | MDN: *"it is not necessarily constant"*. Butuh seluruh rantai referensi beku. |

**Kriteria lulus.** Menunjuk **kenapa** objek bersarang masih berubah, dan **tanpa**
menyalahkan "bug Node".

**Sumber.** MDN — `Object.freeze()`. Redux — *Immutable Update Patterns*
(*"Defining a new variable does not create a new actual object - it only creates another
reference to the same object."*). ECMAScript® 2027 §`sec-object.freeze`.

### Sesi B — TDD

**Konsep.** Tulis tes **lebih dulu**, biarkan ia **gagal**, baru tulis kode.

**Tiga langkah verbatim (Fowler):**
> *"Write a test for the next bit of functionality you want to add."*
> *"Write the functional code until the test passes."*
> *"Refactor both new and old code to make it well structured."*

> *"Although these three steps, often summarized as **Red - Green - Refactor**, are the
> heart of the process, there's also a vital initial step where we write out a list of
> test cases first."*

**Atribusi:**
> *"Test-Driven Development (TDD) is a technique for building software that guides
> software development by writing tests. It was developed by **Kent Beck** in the late
> 1990's as part of **Extreme Programming**."*
> — Fowler (2023)

**🔴 Kegagalan paling sering (verbatim) — ini inti latihannya:**
> *"The most common way that I hear to screw up TDD is neglecting the third step.
> Refactoring the code to keep it clean is a key part of the process, otherwise we just
> end up with a messy aggregation of code fragments."*

**Kenapa tes dulu berguna (verbatim):**
> *"thinking about the test first forces us to think about the interface to the code
> first. This focus on interface and how you use a class helps us separate interface from
> implementation, a key element of good design that many programmers struggle with."*

**Alat — terverifikasi jalan (Node v22.22.2):**
```
node:test tersedia di v22.22.2
exports: skip, todo, only, after, afterEach, before, beforeEach,
         describe, it, run, suite, test
```
**Sudah bawaan — tidak perlu `npm install`.** Cocok dengan batasan proyek.

**Latihan inspeksi (KLAIM).** Diberi kode + tes yang ditulis **setelah** kode. Tentukan:
apakah tes ini **menguji** atau hanya **mendokumentasikan** kode?

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"TDD = menulis banyak tes."* | Jumlahnya bukan ukurannya. **Urutannya**: tes gagal **dulu**. |
| *"Kalau sudah hijau, selesai."* | **Langkah ketiga yang paling sering dilupakan** — refactor. Fowler menyebutnya langsung sebagai *"the most common way to screw up TDD"*. |
| *"Tes dulu memperlambat."* | Ia memperlambat **di awal**, dan itulah gunanya: memaksa memikirkan **cara pakainya** lebih dulu. |
| *"butuh `jest`/`mocha`."* | `node:test` **sudah bawaan** di Node v22. Tanpa instalasi. |

**Kriteria lulus.** Menulis **satu tes yang gagal dulu** (Red), memperbaiki sampai hijau,
lalu **refactor** dan sebut apa yang dirapikan. Tes yang hijau **sejak awal** = **belum
lulus** (tidak ada yang dibuktikan).

**Sumber.** Fowler, M. (11 Des 2023). *Test Driven Development*. martinfowler.com.
Beck, K. (2002). *Test-Driven Development: By Example*. Addison-Wesley · ISBN 0321146530.
⚠️ Buku Beck **tidak dibaca isinya** — hanya diverifikasi keberadaan/tanggal terbit.
Node.js Official Docs — `node:test`.

> **→ GERBANG 3** (lihat `roadmap-4-tingkat.md` §3)

---

# BAGIAN 3 — MENILAI & MEMUTUSKAN (Unit 12–15)

> ⚠️ **Bagian ini OPSIONAL.** Ia mengandaikan Bagian 0–2 **sudah lulus**.
> Ia **magang**: menilai kode yang lebih besar, bukan belajar konsep baru.

---

## Unit 12 — Singleton: pola favorit AI yang paling sering salah

**Konsep.** Singleton adalah pola yang **paling sering dipakai AI** dan **paling sering
dikritik** — **termasuk oleh katalognya sendiri.**

**Intent (verbatim):**
> *"lets you ensure that a class has only one instance, while providing a global access
> point to this instance."*

**🔴 Kritik dari katalog yang sama (verbatim) — ini bahan ajar terbaiknya:**
> *"Violates the Single Responsibility Principle. The pattern solves two problems at the
> time."*
> *"The pattern requires special treatment in a multithreaded environment so that
> multiple threads won't create a singleton object several times."*
> *"It may be difficult to unit test the client code of the Singleton... Or just don't
> write the tests. Or don't use the Singleton pattern."*

> **Perhatikan tiga hal dari kutipan itu:**
> 1. Ia melanggar **SRP** (Unit 4) — dua masalah sekaligus.
> 2. Ia **bermasalah di lingkungan multithread** (Unit 9 & 10).
> 3. Katalognya sendiri menawarkan **"jangan pakai Singleton"**.
>
> **Kalimat "atau jangan pakai Singleton" dari sumbernya sendiri** adalah latihan KLAIM
> terkuat di skill ini: pembelajar mengira katalog pola pasti merekomendasikannya.

**Kode yang dikenali:**
```javascript
let instance = null;
export function getConfig() {
  if (!instance) instance = { /* ... state bersama ... */ };
  return instance;              // ← state global yang tidak kelihatan
}
```

**Latihan inspeksi (TELUSUR).** Dua bagian aplikasi saling mengganggu lewat state
bersama. Cari penyebabnya — **tanpa menyalahkan "bug"**. Dugaan dulu.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Singleton itu pola yang bagus, ada di buku."* | Ada di buku **dan dikritik** di buku/katalog yang sama. |
| *"Ini contoh resmi dari dokumentasi, pasti benar."* | Pola yang **benar sebagai pola** bisa **salah untuk kasusmu**. |
| *"Kalau ada di katalog, berarti dianjurkan."* | Katalog mendaftar **solusi yang ada**, bukan **solusi yang selalu tepat**. |

**Kriteria lulus.** Menyebut **dua** masalah Singleton dari kutipan di atas, dan
memutuskan apakah ia **perlu** — dengan alasan.

**Sumber.** Katalog pola — Singleton, §*Criticism*. Martin (2000) — SRP.

---

## Unit 13 — Observer & aliran data

**Konsep.** **Intent (verbatim):**
> *"lets you define a subscription mechanism to notify multiple objects about any events
> that happen to the object they're observing."*
> Juga dikenal: **Event-Subscriber**, **Listener**.

**Kode yang dikenali:**
```javascript
window.addEventListener('resize', tanganiResize);
setInterval(perbarui, 1000);
socket.on('data', prosesData);
```
**Tiga baris ini punya kesamaan: ketiganya mendaftarkan sesuatu yang harus dilepas.**

**Yang diajarkan.** Observer **mudah bocor**: kalau listener tidak pernah dilepas, ia
terus berjalan setelah pemiliknya hilang. **Tidak ada error** — hanya memori yang tumbuh
dan pekerjaan yang berulang tanpa guna.

**Latihan inspeksi (KLAIM).** Klaim: *"halaman ini bersih saat ditutup."* Verifikasi —
**cek listener yang tersisa**.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Kalau fungsinya sudah selesai, otomatis berhenti."* | Listener **tidak** berhenti sendiri. Ia menempel sampai dilepas. |
| *"Yang penting jalan."* | Ia jalan — **terus**, termasuk saat sudah tidak seharusnya. |
| *"Bocornya kecil, tidak masalah."* | Satu listener kecil. Yang berulang **setiap kali** komponen dibuat. |

**Kriteria lulus.** Menunjuk **satu listener** yang tidak pernah dilepas, dan akibatnya.

**Sumber.** Katalog pola — Observer.

---

## Unit 14 — Streaming & batas memori

**Konsep.** Perbedaan antara **memproses sambil jalan** dan **menampung semuanya dulu**.
Untuk data besar, yang kedua **kehabisan memori** — dan itu **tidak selalu error**.

**Definisi & perbedaan dengan WebSocket (verbatim MDN):**
> *"You'll need a bit of code on the server to stream events to the front-end, but the
> client-side code works almost identically to websockets in part of handling incoming
> events. **This is a one-way connection, so you can't send events from a client to a
> server.**"*

**Format (verbatim):** *"the server-side script that sends events needs to respond using
the MIME type `text/event-stream`."*
Field: `event` · `data` · `id` · `retry`.
Reconnect otomatis: *"By default, if the connection between the client and server closes,
the connection is restarted."*

**⚠️ Batasan nyata SSE (verbatim — bagus untuk latihan KLAIM):**
> *"When not used over HTTP/2, SSE suffers from a limitation to the maximum number of open
> connections, which can be especially painful when opening multiple tabs, as the limit is
> per browser and is set to a very low number (6). The issue has been marked as 'Won't
> fix' in Chrome and in Firefox."*

**Latihan inspeksi (SUSUN + KLAIM).** Prediksi: pada 1.000 baris data, mana yang lebih
dulu kehabisan memori — **dan kenapa**.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Streaming cuma untuk video."* | Video adalah **salah satu** pemakaiannya. Yang diajarkan di sini: **pola**-nya. |
| *"SSE sama dengan WebSocket."* | MDN: *"This is a one-way connection"* — SSE hanya server → klien. |
| *"SSE bisa dipakai di mana saja."* | Batas **6 koneksi** per browser, dan itu ***"Won't fix"***. |

**Kriteria lulus.** Menunjuk **kapan** data mulai bermasalah, **dan** memilih pendekatan
dengan alasan yang menyebut **memori**.

**Sumber.** MDN — *Using server-sent events*. WHATWG HTML Standard §`dispatchMessage`.
⚠️ **WebSocket belum diambil** — perbandingannya masih timpang (lihat
`cakupan-vs-dokumen-resmi.md` §4).

---

## Unit 15 — Review desain & keputusan

**Konsep.** Menutup lingkaran. Pembelajar kembali ke Unit 1 (gejala desain membusuk) —
tapi sekarang bisa **menamai**, **menemukan**, dan **memutuskan**.

**Bentuk review:** **klaim → bukti → risiko → keputusan.**

| Bagian | Pertanyaannya |
|---|---|
| **Klaim** | Apa yang kode ini *katakan* tentang dirinya? (komentar, nama fungsi, pesan commit) |
| **Bukti** | Apakah klaimnya benar? **Bagaimana kamu memeriksanya?** |
| **Risiko** | Satu masalah desain konkret — sebut **jenisnya**, bukan sekadar "kurang bagus" |
| **Keputusan** | Terima/tolak **+ alasan** |

**Kenapa *"jalan kok"* bukan alasan.** Dari pengalaman langsung: kode yang lulus semua
uji bisa tetap **tidak bisa diubah**. Dan Martin sudah menamai gejalanya di tahun 2000:
**viscosity** — *"It is easy to do the wrong thing, but hard to do the right thing."*

**Latihan inspeksi.** Tulis review lengkap pada modul yang belum pernah dilihat.

**Miskonsepsi yang harus dikoreksi:**

| Salah | Benar |
|---|---|
| *"Kalau tesnya hijau, kodenya bagus."* | Tes membuktikan **perilaku**, bukan **struktur**. Keduanya diperiksa terpisah. |
| *"Menolak kode berarti kodenya buruk."* | Menolak **dengan alasan** sama sahnya dengan menerima. Yang dinilai: **alasannya**. |
| *"Review itu mencari kesalahan."* | Review mencari **kesesuaian antara klaim dan kenyataan**. |

**Kriteria lulus.** Keempat bagian review ada, dan keputusannya **beralasan** — bukan
"benar".

**Sumber.** Martin (2000) — viscosity. Addy Osmani — *Agentic Code Review*.

> **→ GERBANG 4** (lihat `roadmap-4-tingkat.md` §4)

---

**📅 Dibuat:** 28 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `korpus-ai.md` ·
`sintaks-javascript.md` · `cakupan-vs-dokumen-resmi.md`
**🔬 Sumber utama:** Martin (2000) · Martin (2014) · GoF (1994) · Fowler (2023) ·
Beck (2002) · MDN · Node.js docs · Python docs
