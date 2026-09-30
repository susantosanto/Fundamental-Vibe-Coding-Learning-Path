# Korpus Kode Hasil AI — Software Design (Cara Menyiapkan & Empat Latihan Inspeksi)

> Referensi untuk skill `teach-software-design`. **Tutor membaca file ini sendiri.**
> Pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 28 September 2026 · **Kerangka asal:** `teach-tailwindcss/references/korpus-ai.md`

---

## 1. Kenapa korpusnya HARUS kode hasil generate AI

Karena **itu yang akan dihadapi pembelajar setelah lulus.** Bukan kode rapi dari tutorial,
bukan contoh yang ditulis tutor dengan hati-hati — tapi kode yang dihasilkan AI, yang
**terlihat benar** dan **sering hampir benar**.

| Sumber | Temuan | Konsekuensi untuk korpus |
|---|---|---|
| **Stack Overflow Developer Survey 2025** | **66%** developer frustrasi utamanya *"solutions that are almost right, but not quite"*; **45%** bilang men-debug kode AI **lebih memakan waktu** | Korpusnya harus kode yang **hampir** benar — bukan yang jelas salah |
| **RCT Anthropic** (arXiv 2601.20245, Jan 2026) | Gap terbesar AI vs manual justru di **debugging** | Latihan TELUSUR wajib ada, dan porsinya besar |
| **MIT Media Lab** (arXiv 2506.08872) | Pengguna LLM kesulitan mengutip karyanya sendiri | Pembelajar wajib bisa **menjelaskan alur** tiap fungsi yang ia terima |
| **Veracode 2025** | Hanya **55%** kode AI aman | Cacat keamanan juga masuk korpus, bukan hanya cacat desain |

> **Batas kejujuran:** angka-angka di atas berasal dari survei & studi dengan populasi
> berbeda. Ia dipakai sebagai **indikasi arah**, bukan bukti sebab-akibat. RCT Anthropic
> sampelnya kecil (52), satu library, mayoritas junior.

### 🔴 Yang paling penting untuk BIDANG INI

Cacat desain di sini **hampir selalu tidak menghasilkan error.**

| Cacat | Apa yang terlihat | Error? |
|---|---|---|
| `Object.freeze` pada objek bersarang | Data berubah padahal dikira terkunci | ❌ **tidak ada** |
| CPU-berat di jalur utama | Aplikasi "diam" beberapa detik | ❌ **tidak ada** |
| Singleton sebagai state global | Dua bagian saling mengganggu — **kadang** | ❌ sering tidak |
| Listener tidak dilepas | Memori tumbuh, pekerjaan berulang | ❌ **tidak ada** |
| Lima `if` yang sama di lima file | Jalan sempurna | ❌ **tidak ada** |
| Tes yang ditulis setelah kode | Semua hijau | ❌ **tidak ada** |

**Dan satu hal khusus bidang ini:** cacatnya **tidak terlihat oleh mata yang tidak
mencarinya.** Kode yang "jalan dan rapi" **adalah** yang paling berbahaya — karena tidak
ada dorongan untuk memeriksanya.

> **Inilah alasan `teach-software-design` ada.** Empat skill `teach-*` lain mengajarkan
> membaca **gejala** (tampilan salah, data kosong, warna hilang). Skill ini mengajarkan
> membaca **ketiadaan gejala** — kode yang jalan sempurna dan tetap salah.

---

## 2. Tangga korpus per bagian

| Bagian | Korpus | Ukuran | Contoh konkret |
|---|---|---|---|
| **0** | Satu file JS "jalan tapi kaku" | **20–40 baris** | `hitungGaji` dengan 3 cabang tipe karyawan, di 5 tempat |
| **1** | Satu modul dengan `class`/pabrik | **40–80 baris** | `class LaporanSiswa` dengan 4 tanggung jawab · `new PengirimEmail()` di tengah logika |
| **2** | Satu folder | **2–4 file, 80–150 baris** | Folder `pengirim/` dengan Factory + Decorator · worker yang salah tempat · objek `freeze` bersarang |
| **3** | Satu modul lebih besar | **150–300 baris, 3–5 file** | Aplikasi kecil dengan Singleton, Observer, dan jalur data tanpa streaming |

**Aturan tangga:** jangan melompat. Bagian 0 dengan kode 150 baris akan **menenggelamkan**.

---

## 3. Cacat khas kode AI di bidang desain perangkat lunak

Daftar ini yang dicari tutor saat menyiapkan korpus. **Sengaja tidak diurutkan berdasarkan
seberapa sering** — urutannya berdasarkan **bagian tempat ia dilatih**.

### Bagian 0–1 — gejala dan prinsip

| # | Cacat | Bentuk khasnya | Unit | Error? |
|---|---|---|---|---|
| 1 | **`if` berantai yang tersebar** | `if (tipe === 'A') … else if …` yang sama di **5 file** | 2 | ❌ |
| 2 | **Kelas yang menanggung 4 tanggung jawab** | Satu `class` menangani hitung, format, simpan, kirim | 4 | ❌ |
| 3 | **`switch` yang tumbuh terus** | Setiap jenis baru = satu `case` baru di tempat yang sama | 5 | ❌ |
| 4 | **`new` di tengah logika** | `const x = new PengirimEmail()` di dalam fungsi bisnis | 6 | ❌ |
| 5 | **Antarmuka serba-bisa** | Satu objek layanan dengan 8 method, semua pemanggil "melihat" semuanya | 7 | ❌ |
| 6 | **Abstraksi berlebihan** | 6 file untuk satu fungsi 10 baris, semuanya saling menunjuk | 7 | ❌ |

### Bagian 2 — pola dan data aman

| # | Cacat | Bentuk khasnya | Unit | Error? |
|---|---|---|---|---|
| 7 | **Pola dipakai tanpa masalah** | Factory yang hanya pernah punya **satu** cabang | 8 | ❌ |
| 8 | **CPU-berat di jalur utama** | Loop besar / parsing berat di fungsi yang dipanggil saat request | **9** ⭐ | ❌ |
| 9 | **Worker untuk beban I/O** | `new Worker` untuk membaca file atau memanggil API | **9** ⭐ | ❌ |
| 10 | **Worker dibuat per tugas** | `new Worker` di dalam loop — tanpa *pool* | 9 | ❌ |
| 11 | **`await` dianggap paralel** | Berharap loop `await` berjalan bersamaan | 9 | ❌ |
| 12 | **"Node itu single-threaded"** | Klaim di komentar — **bukan** kalimat dokumentasi resmi | 9 | ❌ |
| 13 | **`freeze` pada objek bersarang** ⭐⭐ | `Object.freeze(config)` padahal ada `config.db.host` | **11** ⭐ | ❌ |
| 14 | **Mengira perubahan yang gagal = error** | Tidak memeriksa hasil; mode non-strict **diam** | 11 | ❌ |
| 15 | **`const` dianggap sudah beku** | `const data = {...}` lalu isinya diubah **dengan sengaja** | 11 | ❌ |
| 16 | **Tes ditulis setelah kode** | Semua tes hijau sejak awal | **11** ⭐ | ❌ |
| 17 | **Langkah refactor dilupakan** | Red → Green → selesai (Fowler: *"the most common way to screw up TDD"*) | 11 | ❌ |

### Bagian 3 — menilai dan memutuskan

| # | Cacat | Bentuk khasnya | Unit | Error? |
|---|---|---|---|---|
| 18 | **Singleton sebagai jalan pintas** | State bersama lewat `getConfig()` yang mengembalikan objek yang sama | **12** | ❌ |
| 19 | **Komentar "thread-safe"** | Klaim di kode yang tidak diverifikasi | 12 | ❌ |
| 20 | **Listener tanpa pelepasan** | `addEventListener`/`setInterval`/`socket.on` tanpa pasangan | 13 | ❌ |
| 21 | **Semua data ditampung dulu** | `await res.json()` untuk data besar, baru diproses | 14 | ⚠️ kadang |
| 22 | **SSE dianggap dua arah** | Diharapkan klien bisa mengirim lewat SSE | 14 | ❌ |
| 23 | **Klaim tanpa bukti** | Komentar/nama fungsi menjanjikan hal yang tidak diperiksa | 15 | ❌ |

**Total 23 cacat.** Tiga di antaranya **⭐⭐** (Unit 11 memuat dua) dan **dua ⭐** (Unit 9).

---

## 4. Empat latihan inspeksi

### (a) LACAK — melacak nilai & alur

**Tujuan:** menguji *notional machine* — apakah pembelajar bisa menelusuri apa yang
sebenarnya terjadi.

**Bentuk:** diberi kode, telusuri **nilai tiap variabel** baris per baris **di atas
kertas/editor**, tanpa menjalankan.

**Contoh untuk Unit 11 (freeze):**
```javascript
const asli = { nama: 'Budi', alamat: { kota: 'Bandung' } };
Object.freeze(asli);
asli.nama = 'Andi';
asli.alamat.kota = 'Jakarta';
```
**Pertanyaan LACAK:** *"Sebutkan nilai `asli.nama` dan `asli.alamat.kota` setelah tiga
baris itu. Lalu sebut nilai `Object.isFrozen(asli)` dan `Object.isFrozen(asli.alamat)`."*

**Jawaban yang benar:** `'Budi'` · `'Jakarta'` · `true` · `false`.
**Yang ditandai salah:** menjawab `'Andi'` (mengira freeze gagal menahan) **atau**
`'Bandung'` (mengira freeze ikut dalam).

**Unit yang cocok:** 1–3, 9, 10.

---

### (b) SUSUN — Parsons Problem

**Tujuan:** melatih **struktur** tanpa beban menulis dari nol.

**Bentuk:** baris kode **diacak**, pembelajar menyusun ulang sesuai tujuan.

**⚠️ Aturan Parsons yang benar:**
1. **Satu jawaban benar saja** — kalau ada dua susunan yang jalan, soal itu cacat.
2. Pakai **kode asli** dari korpus — jangan kode yang ditulis khusus untuk soal.
3. Sertakan **deskripsi tujuan** di atas soal.
4. **Jangan pakai baris pengecoh (distractor) di Bagian 0.** Harms, Chen & Kelleher
   (2016, ICER '16) menemukan pengecoh **menurunkan efisiensi belajar pemula**.
   Tambahkan hanya setelah pembelajar nyaman.

**Contoh untuk Unit 8 (Factory):**
```
Tujuan: fungsi ini mengembalikan objek pengirim sesuai jenisnya.

[dipotong & diacak]
  return new PengirimEmail();
  }
  function buatPengirim(jenis) {
  if (jenis === 'wa') return new PengirimWhatsApp();
  { if (jenis === 'email')
```

**Unit yang cocok:** 5, 8, 12, 14.

---

### (c) KLAIM — deteksi "hampir benar"

**Tujuan:** melatih deteksi **kode yang terlihat benar**. Ini musuh sebenarnya
(66% developer, Stack Overflow 2025).

**Bentuk:** diberi **kode + satu kalimat klaim**. Tentukan: **benar atau tidak?**
**Bukan mencari bug** — menentukan apakah kode melakukan **apa yang dikatakannya**.

**Contoh untuk Unit 12 (Singleton):**
```
KODE:   let instance = null;
        export function getConfig() { if (!instance) instance = {...}; return instance; }

KLAIM:  "Fungsi ini aman dipakai di lingkungan multithread."
```
**Jawaban yang benar: TIDAK.** Katalog polanya sendiri: *"requires special treatment in a
multithreaded environment so that multiple threads won't create a singleton object
several times."*

**Contoh untuk Unit 11 (TDD):**
```
KLAIM:  "Tes ini membuktikan bahwa fungsi saya benar."
KODE:   function tambah(a,b) { return a+b; }
        test('tambah', () => { expect(tambah(1,2)).toBe(3); });
        // ditulis SETELAH fungsi di atas selesai dan sudah dijalankan
```
**Jawaban yang benar: TIDAK.** Tes yang hijau sejak awal **tidak membuktikan** apa pun —
ia hanya mencatat perilaku yang sudah ada.

**Unit yang cocok:** 5, 6, 8, 13, dan **setiap** Unit di Bagian 3.

---

### (d) TELUSUR — debug tanpa error ⭐ **inti skill ini**

**Tujuan:** melatih **memburu sebab**, bukan menebak. RCT Anthropic: **gap terbesar**
AI vs manual ada di debugging.

**Bentuk:** diberi kode yang **sudah dijalankan**, **hasilnya salah**, tapi
**TIDAK ADA error di console**. Cari penyebabnya.

> 🔴 **ATURAN KORPUS TELUSUR — tiga syarat wajib:**
> 1. Kode **sudah dijalankan** (bukan kode mati di atas kertas)
> 2. Hasilnya **salah**
> 3. **Tidak ada error** — tidak ada pesan merah, tidak ada stack trace
>
> **Kalau ada error → itu latihan membaca stack trace, bukan TELUSUR.**
> Dan: **jangan tandai di mana cacatnya.** Kalau ada komentar penunjuk, soal itu hangus.

#### Protokol 5 langkah — WAJIB berurutan

```
1. KATAKAN  Apa yang seharusnya terjadi? (tulis di hasil.md, sebelum menyentuh kode)
2. DUGA     Tulis HIPOTESIS SPESIFIK: "saya duga penyebabnya adalah ___"
            ← Satu dugaan. Bukan "mungkin A, mungkin B, mungkin C."
3. UJI      Buktikan dugaan itu dengan SATU alat saja. Lalu catat hasilnya.
4. SEMPITKAN Kalau dugaan gugur, tulis dugaan BARU yang lebih sempit.
            "Bukan X di baris 5, tapi mungkin Y di baris 12."
5. BUKTIKAN Tunjukkan bahwa kamu sudah menemukan sebabnya — bukan sekadar
            menghilangkan gejalanya.
```

> ⚠️ **Dugaan ditulis SEBELUM menyentuh kode.**
> Menghapus baris satu per satu tanpa dugaan **tidak melatih memburu** — hanya melatih
> menebak. Dan menebak sudah cukup mudah; yang sulit adalah **memburu**.

> ⚠️ **`console.log` bukan pengganti dugaan.**
> Ia membuat memburu lebih cepat, bukan lebih benar.
> **Satu alat per dugaan.** Kalau pembelajar menyebar `console.log` di 10 tempat
> sekaligus, tegur — itu TELUSUR yang tidak dijalankan.

**Contoh TELUSUR Unit 11 — `freeze` yang bocor:**
```javascript
// kode-ai.js — SUDAH dijalankan, hasil salah, TIDAK ADA error
const pengaturan = { nama: 'Aplikasi Sekolah', db: { host: 'localhost', port: 5432 } };
Object.freeze(pengaturan);

pengaturan.db.host = 'server-lain';      // baris 5
console.log('host:', pengaturan.db.host);
```
**Hasil nyata:**
```
host: server-lain        ← berubah! padahal sudah di-freeze
```
**Tidak ada error.** Tidak ada peringatan. Kalau pembelajar mengharapkan
`'localhost'`, ia akan bingung.

**Dugaan yang baik:** *"Saya duga `freeze` tidak berlaku untuk properti yang berupa
objek — ia hanya membekukan `pengaturan` sendiri, bukan `pengaturan.db`."*
**Cara menguji (satu alat):** `console.log(Object.isFrozen(pengaturan.db))` → `false`.
**Dugaan terkonfirmasi.**

**Dugaan yang buruk:** *"Mungkin Node-nya bug."* — tidak spesifik, tidak bisa diuji.

**Unit yang cocok:** **9, 11, 12** (wajib) · juga 1, 10, 13, 14.

---

## 5. Alur menyiapkan satu korpus — langkah praktis

```
1. PILIH UNIT       → buka peta-unit.md, tentukan cacat mana yang dilatih
2. MINTA KE AI      → minta AI menghasilkan kode untuk kasus itu
                      (JANGAN tulis sendiri — kode buatan tutor terlalu rapi)
3. PERIKSA CACATNYA → cocokkan dengan daftar §3. Ada cacat yang dicari?
4. JALANKAN         → pastikan: hasilnya salah, dan TIDAK ADA error
                      ← untuk TELUSUR, langkah ini WAJIB
5. SIMPAN           → PRAKTIK/sesi-NNN/kode-ai.js
6. BERSIHKAN        → hapus semua komentar/penanda yang menunjuk letak cacatnya
7. TULIS SOALNYA    → pertanyaan + bentuk latihan (LACAK/SUSUN/KLAIM/TELUSUR)
8. SERAHKAN         → pembelajar menulis prediksi.md DULU
```

**Langkah 6 paling sering dilupakan.** AI sering menambahkan komentar seperti
`// Perhatikan: objek ini tidak dibekukan sepenuhnya` — komentar itu **membocorkan
jawabannya**. Hapus.

---

## 6. Yang TIDAK boleh masuk korpus

| Jangan | Kenapa |
|---|---|
| **Kode contoh dari tutorial** | Terlalu rapi dan lengkap. Itu bukan yang dihadapi pembelajar. |
| **Kode yang jelas salah** | Terlalu mudah. Yang dicari: kode yang **terlihat benar**. |
| **Kode dengan komentar penunjuk** | Membocorkan jawaban. Hapus dulu (§5 langkah 6). |
| **Kode dari repo produksi pembelajar** | Bisa merusak. Selalu salin ke `PRAKTIK/`. |
| **Kode dengan error yang muncul** | Untuk TELUSUR, ini **menggugurkan** latihannya (jadi baca stack trace, bukan memburu). |
| **Kode hasil tulis tutor sendiri** | Tutor cenderung menulis kode yang **bersih** — dan itu menghapus pelajarannya. |
| **Kode yang belum pernah berjalan** | TELUSUR butuh bukti bahwa kodenya **benar-benar** berjalan dan salah. |

---

## 7. Batas kejujuran

- **Daftar 23 cacat disusun dari pola yang paling sering muncul di kode AI** dan dari
  sumber primer bidangnya. Ia **bukan** hasil studi sistematis tentang cacat kode AI
  di bidang desain perangkat lunak. **Belum diuji.**
- **Protokol 5 langkah TELUSUR bukan dari satu sumber tunggal.** Ia disusun dari praktik
  debug yang lazim (hipotesis → uji → persempit) dan diselaraskan dengan temuan RCT
  Anthropic bahwa debugging adalah titik terlemah. **Belum diuji sebagai metode.**
- **Angka industri** (66%, 45%, 55%, >65%/<40%) berasal dari populasi berbeda →
  **indikasi arah**, bukan bukti sebab-akibat.
- **Parsons Problem di konteks ini belum teruji.** Riset Denny (2008) dan Harms (2016)
  meneliti **pemula pemrograman**, bukan pembelajar desain perangkat lunak. Adaptasi
  "SUSUN" ke materi desain **belum divalidasi**.
- **Korpus untuk Bagian 3 (Unit 12–15) belum pernah dibuat.** Contoh-contoh di file ini
  untuk Bagian 0–2 sudah punya bentuk yang jelas; Bagian 3 masih berupa **usulan**.
- **Sumber AI yang dipakai untuk menghasilkan korpus akan berubah.** Kode AI di 2027
  mungkin punya cacat khas yang berbeda. Daftar §3 perlu **ditinjau ulang**.

---

**📅 Dibuat:** 28 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` ·
`sintaks-javascript.md` · `cakupan-vs-dokumen-resmi.md`
