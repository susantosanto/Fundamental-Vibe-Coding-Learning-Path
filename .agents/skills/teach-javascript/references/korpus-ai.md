# Korpus Kode Hasil AI — Cara Menyiapkan & Empat Latihan Inspeksi

> Referensi untuk skill `teach-javascript`. Tutor membacanya sendiri.

---

## 1. Kenapa korpusnya HARUS kode hasil generate AI

Kalau latihannya memakai kode buatan manusia yang rapi, yang dilatih adalah
**"membaca kode yang baik"** — dan itu bukan kemampuan yang dibutuhkan.

Yang dihadapi pembelajar seumur hidup setelah ini adalah **kode hasil AI**. Dan ciri khas
kode AI bukan "jelas salah" — tapi **"hampir benar"**.

Buktinya ada di data, bukan opini:

> Stack Overflow Developer Survey 2025 (~49.000 responden): frustrasi **nomor satu**
> developer terhadap AI adalah *"solutions that are **almost right, but not quite**"*
> — **66%** responden. Frustrasi kedua: *"debugging AI-generated code is more
> time-consuming"* — **45%**.

Dan dari sisi keamanan: Veracode 2025 menguji 100+ LLM pada 80 tugas coding — hanya
**55%** tugas menghasilkan kode yang aman. Artinya **45% terlihat benar tapi tidak.**

**Kesimpulan desain:** korpus latihan harus diisi kode yang **terlihat benar**.
Kode yang jelas rusak tidak melatih apa pun — pembelajar langsung tahu tanpa berpikir.

---

## 2. Tangga korpus per tingkatan

| Tingkat | Bentuk korpus | Ukuran | Yang dilatih |
|---|---|---|---|
| **1** | Potongan kecil | 4–8 baris | Melihat alur baris demi baris |
| **2** | Fungsi utuh | 10–20 baris | Melihat maksud vs kenyataan |
| **3** | Satu file utuh | 30–80 baris | Mencari cacat di tengah kode yang wajar |
| **4** | Proyek multi-file | 3–6 file | Menilai sistem, bukan baris |

**Aturan ukuran (jangan dilanggar):** Tingkat 1–2 **≤ 15 baris** per penjelasan.
Working memory pemula kecil — PRIMM menyebut ini *"learners' working memory is very small,
and we need to stay within it."*

---

## 3. Cara menyiapkan korpus

### Langkah 1 — Minta AI membuat kode untuk tugas kecil

Tugasnya harus **konkret dan biasa**. Contoh yang cocok:

- "fungsi yang menghitung total belanja setelah diskon"
- "fungsi yang mengambil nama depan dari daftar nama lengkap"
- "kode yang menampilkan daftar barang dengan nomor urut"
- "fungsi yang mengecek apakah sebuah kata palindrom"

### Langkah 2 — JANGAN dirapikan

**Ini bagian terpentingnya.** Kode AI yang sudah dibersihkan kehilangan gunanya.
Cacat khas kode AI justru **bahan pelajaran**:

| Cacat khas kode AI | Unit yang melatihnya |
|---|---|
| Kasus batas tidak ditangani (daftar kosong, `null`, satu item) | Unit 16 |
| Salinan dangkal yang dikira salinan penuh (`{...obj}` pada objek bersarang) | Unit 8 |
| `forEach` + `async` yang tidak menunggu | Unit 10 |
| Variabel di closure yang "ketinggalan" | Unit 9 |
| Test yang hanya menguji kasus senang | Unit 16 |
| Error yang ditelan (`catch {}` kosong) | Unit 11, 19 |
| **Hasil salah tapi tidak error** (gejala tanpa pesan) | **Unit 13** |
| Nama fungsi menjanjikan **lebih** daripada yang dilakukan | Unit 17 |
| Perbaikan yang merusak tempat lain | Unit 18 |
| **Fungsi panah `() => { x }` yang lupa `return`** | Unit 6 |
| **`\|\|` dipakai padahal seharusnya `??`** (diskon 0% jadi 10%) | Unit 4, 16 |
| **`==` dipakai padahal seharusnya `===`** | Unit 2 |
| **`switch` tanpa `break`** — "jatuh" ke case berikutnya, tanpa error | Unit 4 |
| **`JSON.parse` tanpa `try/catch`** — melempar error pada data tak terduga | Unit 19 |
| **`parseFloat` pada angka ber-koma Indonesia** (`"1.500,25"` → `1.5`) | Unit 20 |
| **Perhitungan uang dengan desimal** (`0.1 + 0.2 !== 0.3`) | Unit 20 |
| **`getMonth()` dikira 1–12** (padahal mulai dari 0) | Unit 20 |
| **Method yang memutasi** (`push`/`sort`/`splice`) pada data React | Unit 8 |
| **`await` hilang** di satu tempat pada rantai async | Unit 10 |
| Regex yang "terlihat benar" tapi salah menangkap | Unit 20 |

> **Cara pakai tabel ini:** pilih **satu** cacat 🔴 dari `sintaks-modern.md`, sisipkan ke kode
> latihan (atau temukan pada kode AI nyata), lalu arahkan ke unit yang melatihnya.
> **Jangan menumpuk dua cacat dalam satu sesi** — pembelajar akan berhenti melacak.

### Langkah 3 — Potong sesuai tingkatan

- **Tingkat 1:** ambil 4–8 baris saja. Buang sisanya.
- **Tingkat 2:** ambil satu fungsi utuh, lengkap dengan pemanggilannya.
- **Tingkat 3:** satu file utuh, boleh ada komentar AI yang berlebihan.
- **Tingkat 4:** 3–6 file yang saling memanggil.

### Langkah 4 — Simpan di `PRAKTIK/`

```
PRAKTIK/sesi-NNN/
├── prediksi.md    ← ditulis pembelajar PERTAMA
├── kode.js        ← korpus (hasil AI, disalin ke sini)
└── hasil.md       ← hasil nyata + tebakan yang meleset
```

### ⛔ Aturan keamanan — tidak bisa ditawar

1. **Kode korpus TIDAK PERNAH dijalankan di repo produksi.** Hanya di `PRAKTIK/`.
2. **Jangan ambil kode nyata dari proyek pembelajar** tanpa menyalinnya dulu.
3. **Jangan menjalankan kode AI yang menyentuh jaringan, file, atau database** tanpa
   diperiksa lebih dulu — bahkan di `PRAKTIK/`. Batasi ke kode yang murni berhitung
   dan mencetak ke layar sampai Tingkat 3.
4. **Sumber kode dicatat** di `RESOURCES.md` §E kalau diambil dari luar.

---

## 4. Empat jenis latihan inspeksi (tahap BEDAH)

Bergilir, jangan pakai satu jenis terus. Masing-masing melatih hal berbeda.

| Kode | Nama | Melatih |
|---|---|---|
| (a) | **LACAK** | Model mental — bagaimana program berjalan |
| (b) | **SUSUN** | Struktur & logika, tanpa beban sintaks |
| (c) | **KLAIM** | Deteksi "hampir benar" |
| (d) | **TELUSUR** | **Memburu sebab saat hasilnya salah** |

---

### (a) LACAK — melacak nilai variabel

**Cara:** pembelajar menulis nilai tiap variabel di tiap langkah, **sebelum** menjalankan.

```markdown
- baris 1 →
- baris 2 →
- baris 3 →
```

⚠️ **Jangan pakai tabel markdown untuk isian.** Kolom yang harus sejajar menyiksa untuk diisi
di editor teks — aturan lengkapnya di §Anti-Pattern `SKILL.md`. Kalau butuh nama kolomnya,
**tutor** yang menulis labelnya, pembelajar mengisi di belakang `→`:

```markdown
- baris 1 → saldo = ___ · pengeluaran = ___
- baris 2 →
```

**Yang dilatih:** model mental tentang bagaimana program berjalan — PRIMM menyebutnya
*notional machine*.

**Dasar riset:** ini latihan paling penting di seluruh jalur. Lister et al. (2004)
menemukan pembelajar butuh **akurasi 50%** dalam melacak kode sebelum bisa menulis kode
mandiri dengan percaya diri. Karena itu **Gerbang 1 mengukur tepat kemampuan ini.**

**Jangan:** mengisi jawabannya untuk pembelajar. Kalau macet, mundur satu baris dan tanya
"baris ini mengubah apa?".

---

### (b) SUSUN — Parsons Problem

**Cara:** beri baris-baris kode yang **diacak**, pembelajar menyusun ulang jadi benar.

**Yang dilatih:** struktur dan logika program — **tanpa beban sintaks.**

> "The main benefit of Parson's Problems is that the learner is focusing on the structure
> and logic of blocks of code, rather than the syntax of individual text elements."
> — NCCA Pedagogy Quick Read #13

**Aturan menulis Parsons Problem** (dari QR #13 dan Denny et al. 2008):

| Aturan | Kenapa |
|---|---|
| **Satu jawaban benar saja** | Kalau ada beberapa urutan yang jalan, tidak ada yang dinilai |
| **Pakai baris kode asli**, bukan huruf/angka | Supaya pembelajar tetap akrab dengan sintaksnya |
| **Sertakan deskripsi jelas** apa yang program harus lakukan | Mengurangi beban kognitif |
| **Sediakan struktur** (kurung, indentasi) di awal | Petunjuk visual membantu pemula |
| **Tanpa distractor** untuk pemula | ⚠️ Harms, Chen & Kelleher (2016, ICER '16): distractor **menurunkan efisiensi belajar** pemula |
| **Beberapa soal serupa sepanjang waktu** | Satu soal bisa dijawab dengan menebak; beberapa soal tidak |

**Distractor** (baris palsu) baru ditambahkan **setelah pembelajar nyaman** — dan tetap
dengan hati-hati.

---

### (c) KLAIM — menentukan apakah kode melakukan apa yang dikatakannya

**Ini latihan yang paling langsung melatih tujuan MISSION.**

**Cara:** tutor memberi kode + **satu kalimat klaim**, lalu berhenti.

> *Klaim: "Fungsi ini menghitung total setelah diskon 10%."*
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

**Variasi Tingkat 4:** klaimnya bukan tentang satu fungsi, tapi tentang **seluruh proyek**.
*"Aplikasi ini menyimpan data pengguna."* → pembelajar memverifikasi apakah benar.

---

### (d) TELUSUR — memburu sebab saat hasilnya salah ⭐

**Ini jenis latihan yang paling dekat dengan pekerjaan nyata — dan yang paling sering hilang
dari rencana belajar.**

**Bedanya dengan KLAIM:** di KLAIM, kode **belum** dijalankan dan tugasnya menilai klaim.
Di TELUSUR, kode **sudah** dijalankan, **hasilnya salah**, dan tidak ada pesan error yang
menuntun. Tugasnya: **cari baris penyebabnya.**

**Cara menyiapkan korpusnya:**

1. Minta AI membuat kode untuk tugas kecil yang **hasilnya bisa diperiksa** —
   mis. "hitung total setelah diskon", "ambil nama depan", "urutkan dari terbesar".
2. Jalankan. **Pastikan hasilnya salah** — tapi **tidak error**.
   Kalau error, itu Unit 11 (baca pesan error), bukan Unit 13.
3. Simpan kode **dan** output salahnya ke `PRAKTIK/sesi-NNN/`.
4. Jangan tandai di mana cacatnya. **Jangan beri petunjuk apa pun.**

**Protokol 5 langkah yang WAJIB dipakai pembelajar:**

```
1. KATAKAN    Apa yang DIHARAPKAN vs apa yang TERJADI (dua kalimat). Tulis di hasil.md.
2. DUGA       Di baris mana kira-kira sebabnya, dan KENAPA.
              ← WAJIB ditulis SEBELUM menyentuh kode. Ini aturan intinya.
3. UJI        Tambah SATU console.log saja, tepat di titik dugaan. Jalankan.
4. SEMPITKAN  Dugaan benar? bagus. Salah? justru bagus — kamu baru menyingkirkan
              separuh kemungkinan. Ulangi 2–3 sampai tinggal satu baris.
5. BUKTIKAN   Tunjuk baris penyebab. Perbaiki. Jalankan lagi.
              Lalu jawab: "apakah perbaikan ini bisa merusak yang lain?"
```

**Kenapa langkah 2 harus SEBELUM menyentuh kode:**

Menabur `console.log` acak-acakan **tidak** mengajarkan apa pun — hasilnya cuma deretan
angka tanpa arah. Yang mengajarkan adalah **dugaan yang diuji**. Bahkan dugaan yang salah
mengajarkan: ia menyingkirkan separuh kemungkinan.

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
| Tidak bisa menyebut dugaan, langsung menebak-nebak | Ulangi Unit 13 dengan kode lebih pendek |
| Ketemu, tapi tidak bisa menjelaskan kenapa | Belum lulus — balik ke Unit 3 (LACAK) |

**Jangan:** memberi petunjuk lokasi cacat, atau membiarkan pembelajar menambah
`console.log` tanpa menulis dugaan lebih dulu.

---

## 5. Checklist korpus yang baik

Sebelum memakai korpus di sesi, periksa:

```
[ ] Diambil dari kode hasil generate AI (bukan ditulis tutor)
[ ] Ukurannya sesuai tingkatan (Tingkat 1–2: ≤ 15 baris)
[ ] TIDAK dirapikan — cacat khas AI dibiarkan
[ ] Ada minimal satu hal yang bisa ditemukan pembelajar
[ ] Tugas yang diminta ke AI jelas dan biasa (bukan soal jebakan)
[ ] Disimpan di PRAKTIK/sesi-NNN/, bukan di repo produksi
[ ] Kode tidak menyentuh jaringan / file / database (sampai Tingkat 3)
[ ] Untuk latihan TELUSUR: hasilnya SALAH tapi TIDAK error — dan tidak diberi petunjuk
```

**Kalau korpusnya "terlalu bersih"** — tidak ada yang bisa ditemukan — tambahkan satu cacat
**yang disengaja** untuk Unit 12. Tapi jangan di Tingkat 1: di sana yang dilatih membaca
alur, bukan mencari cacat.

---

## 6. Yang sering salah dilakukan tutor

| Kesalahan | Kenapa salah | Lakukan sebaliknya |
|---|---|---|
| Merapikan kode AI dulu sebelum dipakai | Menghapus justru bagian yang melatih | Pakai apa adanya |
| Memakai kode yang jelas rusak | Tidak melatih — langsung kelihatan | Pakai kode yang **terlihat** benar |
| Menjelaskan kode sebelum pembelajar menebak | Membatalkan seluruh gunanya | Tunggu `prediksi.md` ada |
| Menambah distractor di Parsons untuk pemula | Terbukti menurunkan efisiensi belajar (Harms et al. 2016) | Tanpa distractor sampai nyaman |
| Memberi korpus 100 baris "biar terasa nyata" | Melewati working memory pemula | Potong. Kecil itu disengaja. |
| Menjawab sendiri latihan KLAIM | Menghapus latihan verifikasi | Tunggu verdict pembelajar, baru bahas |
| Memberi petunjuk di mana cacatnya pada latihan TELUSUR | Menghapus seluruh gunanya | Diam. Tunggu dugaan pertama pembelajar. |
| Membiarkan pembelajar menabur `console.log` tanpa dugaan | Tidak melatih memburu — hanya melatih menebak | **Dugaan dulu, baru uji.** Satu `console.log` per dugaan. |
| Menyerahkan debugging ke AI | RCT Anthropic: **gap terbesar** justru di sini | Ajarkan protokol 5 langkah; AI hanya untuk memeriksa setelah ketemu |
