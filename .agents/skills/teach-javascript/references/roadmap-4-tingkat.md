# Roadmap 4 Tingkatan / 20 Unit — JavaScript Mode Inspeksi

> **Untuk tutor.** File ini adalah detail yang tidak dimuat di `SKILL.md`.
> WAJIB dibaca sebelum menjawab "apa berikutnya untuk saya?"
>
> **Jangan pernah** menyuruh pembelajar membaca file ini (§MODE PENYAMPAIAN).
> Tutor membaca, lalu menjelaskan.
>
> **Dibuat:** 25 September 2026 · **Sumber kerangka:** `00-PANDUAN.md` (workspace pembelajar)

---

## Peta file referensi — jangan tumpang tindih

| File | Isinya | Kapan dipakai |
|---|---|---|
| **`roadmap-4-tingkat.md`** (ini) | Tingkat, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| **`peta-unit.md`** | **Detail per unit**: konsep, sintaks yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| **`korpus-ai.md`** | Cara menyiapkan **korpus kode AI** + 4 jenis latihan inspeksi | Sebelum menyiapkan sesi latihan |
| **`sintaks-modern.md`** | **Kamus ± 50 bentuk sintaks** + tingkat bahaya + unit tempat dilatih | Saat pembelajar bertanya "tanda ini apa?" |
| **`cakupan-vs-mdn.md`** | **Audit cakupan** vs MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

**Aturan anti-drift:** detail satu unit **hanya boleh** hidup di `peta-unit.md`.
Detail korpus **hanya boleh** hidup di `korpus-ai.md`. Kamus sintaks **hanya** di
`sintaks-modern.md`. File ini tidak mengulanginya — ia hanya menunjuk.

---

## 0. Prinsip yang mengikat seluruh roadmap

1. **Korpus wajib kode hasil generate AI.** Bukan kode contoh buatan tutor. Lihat §5.
2. **Satu unit = 1–2 sesi.** Satu sesi = satu konsep, maksimal 1 jam.
3. **Urutan tidak boleh dilompati.** Setiap tingkatan punya gerbang yang bisa diperiksa.
4. **Gerbang gagal = ulangi tingkatan itu**, bukan lanjut.
5. **Setiap sesi wajib punya momen salah prediksi.** Kalau tidak, materinya terlalu mudah.
6. **Semua tebakan ditulis di Zed** (`prediksi.md`), bukan di kertas. Urutan PREDIKSI →
   JALANKAN diperiksa lewat timestamp.
7. **Sintaks asing BUKAN "di luar materi".** Kode AI memakai `const`, `=>`, `?.`, `??`,
   `...`, destructuring sejak baris pertama. Kalau pembelajar bertanya *"tanda ini apa?"* →
   cek `sintaks-modern.md`, jelaskan **satu bentuk** 1–2 kalimat, lanjut. **Jangan** bilang
   "di luar materi", **jangan** menjelaskan lima bentuk sekaligus.

---

## 1. TINGKAT 1 — BISA MEMBACA (Unit 1–6)

**Yang dilatih:** melihat kode dan tahu **apa yang terjadi**.
**Korpus:** potongan **4–8 baris** hasil AI untuk tugas kecil.
**Prasyarat:** tidak ada. Ini titik masuk pemula absolut.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 1 | **Nama menunjuk nilai** | Variabel = label yang menunjuk nilai. `let umur = 17` → "umur sekarang 17". `let` vs `const` | 4–8 baris. Tulis nilai akhir setiap nama | MDN: *Grammar and types* |
| 2 | **Jenis nilai** | Angka, teks, benar/salah, kosong. Bedanya `17` dan `"17"` | Prediksi hasil `"2" + 2` **sebelum** menjalankan | MDN: *Data types*; ECMAScript §6 |
| 3 | **Urutan: atas ke bawah** | Kode jalan baris demi baris, bukan sekaligus. Nilai bisa berubah di tengah | Lacak 6 baris. Tulis nilai tiap langkah | MDN: *Control flow* |
| 4 | **Percabangan** | `if` / `else`. Cabang mana yang jalan? Kenapa? | Prediksi output untuk **3 nilai input berbeda** | MDN: *Control flow and error handling* |
| 5 | **Perulangan** | `for`. Berapa kali? Nilai apa di tiap putaran? | Bikin tabel: putaran ke-berapa → nilai apa | MDN: *Loops and iteration* |
| 6 | **Fungsi: masuk → keluar** | Apa yang masuk (parameter), apa yang keluar (`return`). Kenapa `return` ≠ `console.log` | Lacak **2 pemanggilan fungsi berbeda** | MDN: *Functions* |

### → GERBANG 1 — Lacak kode (ambang 50%)

Kode **15 baris yang belum pernah dilihat**. Pembelajar menulis di `prediksi.md`, langkah
per langkah, nilai setiap variabel. Lalu dijalankan / dibuka di debugger. Hitung akurasi.

**Lulus kalau ≥ 50%.**

> **Dasar ambang:** *"novices require a 50% tracing code accuracy before they can
> independently write code with confidence"* — Lister et al. (2004), ACM SIGCSE Bulletin
> 36(4), 119–150. Dikutip lewat NCCA Pedagogy Quick Read #11.
>
> **Batas kejujuran:** studi 2004, konteks kurikulum universitas. Dipakai sebagai ambang
> kasar, bukan hukum.

**Di bawah 50%?** Bukan gagal permanen — ulangi Unit 1–6 dengan kode yang lebih pendek
(4 baris, bukan 8). Jangan naikkan kesulitan; turunkan ukuran.

---

## 2. TINGKAT 2 — BISA MENILAI (Unit 7–10)

**Yang dilatih:** melihat kode dan tahu **apa yang salah, dan kenapa**.
**Korpus:** **fungsi utuh** hasil AI — termasuk salinan dari proyek di `MISSION.md`.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 7 | **Kumpulan data** | Array & object. Isinya apa, berapa banyak, berubah bagaimana | Tulis isi array **setelah 3 operasi berturut-turut** | MDN: *Indexed collections*, *Working with objects* |
| 8 | **Alamat vs isi** | `let b = a` pada array/object **tidak** menyalin — ia menunjuk alamat yang sama. Ini **sumber bug JS nomor satu** | Prediksi apa yang berubah **sebelum** menjalankan | MDN: *Equality comparisons*; ECMAScript §7 |
| 9 | **Nama itu dari kapan** | Scope & closure. Kenapa fungsi "ingat" nilai dari tempat ia dibuat, bukan dari tempat ia dipanggil. Ini **sumber bug React nomor satu** (*stale closure*) | Prediksi angka yang dicetak di dalam fungsi | MDN: *Closures* |
| 10 | **Urutan yang tidak seperti ditulis** | Async. Kenapa `setTimeout(..., 0)` tidak langsung jalan. Event loop | Prediksi **urutan** output (bukan hanya isinya) | MDN: *Asynchronous JavaScript*; Node.js Docs: *Event loop* |

> **Kenapa Unit 8 dan 9 tidak boleh dilewati?** Unit 8 = sumber bug JavaScript nomor satu.
> Unit 9 = sumber bug React nomor satu. Kalau pembelajar mengenali keduanya di JavaScript,
> ia mengenalinya di React dalam 10 detik. Inilah jembatan ke `MISSION.md` §A4 kalau
> tujuannya React.

### → GERBANG 2 — Inspeksi kode orang lain

Baca satu file JavaScript **hasil AI yang bukan pembelajar tulis**. Jelaskan **tanpa
membuka catatan**:

1. Apa yang dilakukannya
2. **Satu** keputusan di dalamnya — dan kenapa itu dipilih
3. **Satu** cara kode itu bisa gagal

**Lulus kalau ketiganya terjawab** dan poin 3 masuk akal (bukan "kalau internet mati").

---

## 3. TINGKAT 3 — BISA MEMBONGKAR (Unit 11–14)

**Yang dilatih:** menemukan masalah pada **satu file**, **memperbaikinya**, dan — kalau
membaca saja tidak cukup — **menelusurinya sampai ketemu sebabnya**.
**Korpus:** **satu file utuh** hasil AI (30–80 baris).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 11 | **Membaca pesan error** | Stack trace: dari pesan → baris → sebab. Membaca `undefined.map is not a function` | Dari **5 pesan error**, tunjuk baris & sebabnya | Node.js Docs: *Errors*; MDN: *Error* |
| 12 | **Cari bug dengan membaca** | Satu file hasil AI dengan **satu cacat**. Cari dengan membaca, bukan menebak | Temukan **tanpa menjalankan kode**, lalu **perbaiki** | `00-PANDUAN.md` §6 Gerbang 3 |
| 13 | **TELUSUR: cari sebab dari hasil yang salah** ⭐ | Kode jalan, **tidak error**, tapi hasilnya salah. Debug = memburu: dugaan → uji → persempit | Protokol **5 langkah**. Minimal **dua dugaan tertulis** sebelum ketemu | `korpus-ai.md` §4(d); `RESOURCES.md` §B |
| 14 | **Bikin satu hal** | Satu program kecil, **tanpa framework**. Inilah tahap *Make* dari PRIMM | Pembelajar merancang dan membangun sendiri | MDN: *JavaScript Guide* |

> **Unit 12 dan Unit 13 berbeda jenis, jangan digabung.**
> Unit 12 = **membaca** (satu arah) — temukan cacat tanpa menjalankan.
> Unit 13 = **memburu** (empat arah) — baca → duga → uji → persempit → buktikan.
> Orang bisa jago yang satu tapi tidak yang lain. Yang kedua itu yang dipakai saat aplikasi
> *"jalan tapi salah"* — dan menurut RCT Anthropic, **di situlah gap terbesar** antara yang
> memakai AI dan yang mengerjakan sendiri.

### → GERBANG 3 — Temukan, telusuri, perbaiki

**Dua bagian, keduanya harus lulus:**

**(a) Temukan & perbaiki (statis).** Diberi kode dengan **satu cacat yang disuntik**
(tutor tahu di mana).
1. Temukan **tanpa menjalankan kode** — hanya dengan membaca
2. **Perbaiki** — lalu jalankan untuk **membuktikan** perbaikannya bekerja
3. Jawab: apa yang mungkin rusak akibat perbaikan ini?

**(b) Telusuri (dinamis).** Diberi kode yang **sudah dijalankan** dengan output yang salah —
**tanpa pesan error**, tanpa petunjuk lokasi.
1. Pakai protokol 5 langkah Unit 13 sampai menunjuk baris penyebabnya
2. `hasil.md` harus memuat **minimal dua dugaan tertulis** — salah satunya boleh salah
3. Perbaiki, jalankan lagi, jawab pertanyaan dampaknya

Kalau di bagian (a) harus menjalankan dulu untuk menemukan: itu sah, tapi tandai dan
ulangi latihannya. **Menemukan tanpa memperbaiki = belum lulus.**

---

## 4. TINGKAT 4 — BISA MEMUTUSKAN (Unit 15–18)

**Yang dilatih:** menilai kode AI **pada skala nyata** — banyak file, dan keputusan.
**Korpus:** **proyek multi-file** hasil AI (3–6 file).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 15 | **Bagaimana file saling terhubung** | `import` / `export`, satu fungsi dipakai di banyak tempat. Membaca proyek, bukan file | Gambar **peta**: file mana memanggil file mana, fungsi apa dipakai di mana | MDN: *JavaScript modules* |
| 16 | **Bug yang lolos dari test** | Kode yang test-nya **hijau** tapi tetap salah. Test menguji apa yang ditulis, bukan apa yang dibutuhkan | Temukan cacat yang **tidak tertangkap** test | `RESOURCES.md` §B (Qodo, Stack Overflow 2025) |
| 17 | **Review sebagai PR** | Kode AI + klaimnya. Baca, kritik, bantah — seperti PR dari junior | Putuskan: **terima atau tolak**. Tulis alasannya | `00-PANDUAN.md` §7 |
| 18 | **Perbaiki tanpa merusak** | Perubahan pada satu file bisa memutus file lain | Perbaiki, lalu **buktikan yang lain tidak rusak** | `AUDIT-CAKUPAN.md` §4 |

> **Unit 16 adalah inti dari seluruh roadmap ini.** Musuh sebenarnya bukan kode yang jelas
> salah — melainkan kode yang **terlihat benar**. Stack Overflow 2025: **66% developer**
> frustrasi utamanya adalah *"solutions that are almost right, but not quite"*.

### → GERBANG 4 — Review & keputusan

Diberi satu **proyek kecil hasil AI (3–6 file)** dengan satu kalimat klaim tentang apa yang
dilakukannya. Tulis **review** berisi:

1. Apakah klaimnya benar? (ya/tidak **+ bukti**)
2. Satu cacat atau risiko yang ditemukan
3. **Keputusan: terima atau tolak** — beserta alasannya

**Lulus kalau keputusannya beralasan**, bukan kalau keputusannya "benar".

- Menolak kode yang sebenarnya baik **dengan alasan jelas** = **lulus**
- Menerima kode yang buruk **tanpa alasan** = **gagal**
- Menerima karena "test-nya hijau" = **gagal** (lihat Unit 16)

---

## 4b. BAGIAN PELENGKAP — Unit 19–20 (tidak bergerbang)

**Yang dilatih:** menangani **data nyata** — JSON, tanggal, angka lokal, pola teks.
**Korpus:** potongan hasil AI yang **menyentuh data** (baca file, parse, format).
**Prasyarat:** **Tingkat 2 sudah lewat** (butuh Unit 7 dulu).

| # | Unit | Yang diajarkan | Latihan inspeksi |
|---|---|---|---|
| 19 | **JSON & bentuk data nyata** | Data nyata hidup sebagai **teks**. `JSON.parse` / `stringify`. **`JSON.parse` melempar error** kalau bentuknya tidak sesuai dugaan — wajib `try/catch`. Yang hilang saat dikonversi: `undefined`, `Date`, fungsi | TELUSUR: kode jalan tanpa error tapi hasilnya kosong — sebabnya `catch {}` kosong yang menelan error `JSON.parse` |
| 20 | **Tanggal, angka lokal & pola teks** | `Date` (⚠️ `getMonth()` mulai dari **0**) · `Intl.NumberFormat` → rupiah · ⚠️ `parseFloat("1.500,25")` → `1.5` · ⚠️ `0.1 + 0.2 !== 0.3` · regex dasar | KLAIM: *"kode ini menghitung total rupiah dengan benar"* → verifikasi dengan input ber-koma |

> **Kenapa dua unit ini tidak bergerbang?**
> Karena ia melayani **data**, bukan melatih cara berpikir baru. Menaruhnya sebagai Tingkat 5
> akan salah — pembelajar tidak perlu "lulus" apa pun untuk memakainya. Ia bisa diajarkan
> **kapan saja setelah Tingkat 2**, dan **tidak mengubah Gerbang 1–4**.
>
> **Kenapa ada:** audit cakupan vs MDN (26 Sep 2026, lihat `cakupan-vs-mdn.md`) menemukan
> tiga hal yang **tidak diajarkan sama sekali** padahal wajib untuk aplikasi laporan keuangan.
> Ketiganya **"hasil salah tanpa error"**:
>
> | Bug | Contoh | Akibat |
> |---|---|---|
> | Desimal tidak eksak | `0.1 + 0.2 !== 0.3` | Total tidak pernah cocok |
> | Koma vs titik | `parseFloat("1.500,25")` → `1.5` | Nilai rupiah salah **1000×** |
> | `\|\|` vs `??` | `diskon \|\| 10` pada diskon `0` | Diskon 0% jadi 10% |

---

## 5. Aturan Korpus — kode hasil generate AI

| Tingkat | Korpus | Ukuran |
|---|---|---|
| 1 | Potongan hasil AI untuk tugas kecil | 4–8 baris |
| 2 | Fungsi utuh hasil AI (boleh dari proyek §A4) | 10–20 baris |
| 3 | Satu file utuh hasil AI | 30–80 baris |
| 4 | Proyek multi-file hasil AI | 3–6 file |

**Yang perlu tutor ingat di sini (detail lengkap di `korpus-ai.md`):**

1. Tutor **tidak menulis kode sendiri** untuk latihan. Kalau perlu kode, minta AI
   menghasilkannya, lalu pakai hasilnya **apa adanya** — jangan dirapikan.
2. **Yang dicari adalah kode yang *terlihat* benar.** Kode yang jelas salah terlalu mudah.
3. Kode disalin ke `PRAKTIK/sesi-NNN/`. **Tidak pernah** dijalankan di repo produksi.
4. Sampai Tingkat 3, korpus dibatasi kode yang **murni berhitung & mencetak ke layar** —
   tidak menyentuh jaringan, file, atau database.

→ **Cara menyiapkan korpus, daftar cacat khas AI, dan empat jenis latihan inspeksi
(LACAK · SUSUN · KLAIM · TELUSUR): baca `korpus-ai.md`.**

---

## 6. Bentuk Sesi (6 tahap, ≤ 1 jam) — versi Zed

```
1. PREDIKSI   (10')  Tutor serahkan PRAKTIK/sesi-NNN/kode.js. Terminal DITUTUP.
                     Pembelajar tulis tebakan → PRAKTIK/sesi-NNN/prediksi.md (SIMPAN).
                     ← Tutor baca prediksi.md SEBELUM melanjutkan.
2. JALANKAN   ( 5')  node kode.js. Bandingkan dengan tebakan. Di mana meleset?
3. BEDAH      (20')  (a) LACAK / (b) SUSUN / (c) KLAIM / (d) TELUSUR → tulis hasil.md
4. UBAH       (10')  Ubah SATU hal. Prediksi lagi. Jalankan lagi.
5. PERBAIKI   (10')  Kalau ada bug: perbaiki → jalankan → "apakah ini bisa merusak yang lain?"
6. CATAT      ( 5')  LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi
```

**Verifikasi urutan (bisa diperiksa):**

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

Timestamp `prediksi.md` **harus lebih tua** daripada waktu kode dijalankan.
Kalau tidak → sesi diulang.

### Empat bentuk tahap BEDAH — ringkas

| Kode | Nama | Kapan dipakai | Unit |
|---|---|---|---|
| **(a)** | **LACAK** — nilai tiap variabel di tiap langkah | Menguji *notional machine* | 1–3, 7–10 |
| **(b)** | **SUSUN** — baris diacak, susun ulang (*Parsons*) | Melatih struktur tanpa beban sintaks | 3–6, 11 |
| **(c)** | **KLAIM** — tentukan apakah klaim kode itu benar | Melatih deteksi "hampir benar" | 2, 4, 7–9, 12, 16, 17 |
| **(d)** | **TELUSUR** — hasil salah, cari baris penyebabnya | **Melatih memburu sebab (debug)** | **13**, 18 |

> ⚠️ **Parsons Problem: jangan pakai distractor di Tingkat 1.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan baris pengecoh **menurunkan
> efisiensi belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.
>
> Cara menulis Parsons Problem yang benar (satu jawaban benar, pakai baris kode asli,
> sertakan deskripsi): **`korpus-ai.md` §4(b)**.

> ⚠️ **TELUSUR: dugaan WAJIB ditulis sebelum menyentuh kode.**
> Menabur `console.log` tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> Satu `console.log` per dugaan. Protokol lengkap: **`korpus-ai.md` §4(d)**.

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
| **Kalau AI memberi kode, pembelajar wajib bisa menjelaskan tiap barisnya.** Kalau tidak bisa → jangan pakai | MIT Media Lab: pengguna LLM kesulitan mengutip karyanya sendiri |
| **Perlakukan hasil AI seperti PR dari junior.** Baca, kritik, bantah | *"Would you merge it just because the tests passed?"* |
| **Sesekali, tulis ulang dari nol** kode yang AI tulis. Ukur berapa yang hilang | Mengukur *cognitive debt* |
| **Tutup sesi dengan satu pertanyaan:** hari ini saya belajar, atau cuma menutup tugas? | Mengirim dan belajar itu dua hal berbeda |

---

## 8. Kalau Berhenti di Tengah

Normal. Yang **tidak** boleh: mengulang dari Unit 1.

```
Berhenti di Unit 1–6    → ulangi latihan unit terakhir, lanjut
Berhenti di Unit 7–14   → langsung lanjut, tidak perlu mengulang
Berhenti di Unit 15–18  → selesaikan Unit 18 walau hasilnya jelek
Unit 19–20 (pelengkap)  → tidak bergerbang; ambil kapan saja, atau lewati kalau tidak perlu
```

**Potong lingkupnya, jangan gandakan jamnya.** Satu jam yang konsisten mengalahkan
empat jam setiap Sabtu. Sisipkan 1 hari kosong per minggu.

---

## 9. Batas Kejujuran

- **PRIMM** dirancang untuk sekolah (usia 11–14), bukan orang dewasa. Adaptasi ini masuk
  akal, **belum teruji** untuk kasus ini.
- **Ambang 50%** dari studi 2004 — konteks kurikulum universitas 20 tahun lalu.
- **MIT Media Lab** meneliti **penulisan esai**, bukan coding. Indikasi arah, bukan bukti langsung.
- **RCT Anthropic:** sampel kecil (52), satu library, mayoritas junior.
- **Skala korpus Tingkat 4** ("3–6 file") dipilih sebagai titik masuk yang masuk akal.
  Belum ada dasar riset yang menetapkan angka ini.
- **Protokol 5 langkah TELUSUR (Unit 13) bukan dari satu sumber tunggal.** Ia disusun dari
  praktik debug yang lazim (hipotesis → uji → persempit) dan diselaraskan dengan temuan
  RCT Anthropic bahwa debugging adalah titik terlemah. **Belum diuji sebagai metode.**
  Kalau ternyata terlalu kaku untuk pemula absolut, sederhanakan — jangan dipaksakan.
- **Pemisahan Unit 12 (statis) dan Unit 13 (dinamis)** masuk akal secara desain, tapi
  **belum ada riset** yang mengukur bahwa memisahkannya lebih baik daripada menggabungkannya.
- **Urutan Unit 19–20 ("setelah Tingkat 2") belum diuji.** Alasan memilih titik itu masuk akal
  (butuh Unit 7 dulu), tapi belum ada bukti bahwa itu titik terbaik. Kalau ternyata lebih baik
  di akhir, pindahkan.
- **Tingkat bahaya sintaks (🔴🟡⚪ di `sintaks-modern.md`) adalah penilaian, bukan hasil riset.**
  Dasarnya: frekuensi kemunculan di kode hasil AI + apakah bugnya menimbulkan error atau tidak.
- **Daftar "sengaja dilewati" bisa salah.** Kalau di proyek nyata pembelajar menemui salah satu
  topik itu dan tersandung, itu tanda daftar perlu ditinjau — bukan tanda pembelajar kurang.
- **MDN berubah.** Audit cakupan memakai MDN pada **26 Sep 2026**. Bab/objek baru bisa muncul.
- Artikel "cara belajar coding 2026" di web **tidak dipakai** — aturan sumber repo ini
  melarang blog pribadi/SEO/konten AI.

---

**📅 Dibuat:** 25 September 2026
**📚 Terkait:** `SKILL.md` · workspace `D:/Programming/belajar-javascript/00-PANDUAN.md`
