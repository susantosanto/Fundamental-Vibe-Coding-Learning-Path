# Roadmap 4 Bagian / 18 Unit — React Mode Inspeksi

> **Untuk tutor.** File ini adalah detail yang tidak dimuat di `SKILL.md`.
> WAJIB dibaca sebelum menjawab "apa berikutnya untuk saya?"
>
> **Jangan pernah** menyuruh pembelajar membaca file ini (§MODE PENYAMPAIAN).
> Tutor membaca, lalu menjelaskan.
>
> **Dibuat:** 26 September 2026 · **Sumber kerangka:** `teach-javascript` (skill sejajar)

---

## Peta file referensi — jangan tumpang tindih

| File | Isinya | Kapan dipakai |
|---|---|---|
| **`roadmap-4-tingkat.md`** (ini) | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| **`peta-unit.md`** | **Detail per unit**: konsep, sintaks yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| **`korpus-ai.md`** | Cara menyiapkan **korpus kode AI** + 4 jenis latihan inspeksi | Sebelum menyiapkan sesi latihan |
| **`sintaks-react.md`** | **Kamus sintaks** HTML/CSS/JSX + tingkat bahaya + unit tempat dilatih | Saat pembelajar bertanya "tanda ini apa?" |
| **`cakupan-vs-dokumen-resmi.md`** | **Audit cakupan** vs react.dev & MDN: apa yang ada, apa yang sengaja dilewati, dan kenapa | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

**Aturan anti-drift:** detail satu unit **hanya boleh** hidup di `peta-unit.md`.
Detail korpus **hanya boleh** hidup di `korpus-ai.md`. Kamus sintaks **hanya** di
`sintaks-react.md`. File ini tidak mengulanginya — ia hanya menunjuk.

---

## 0. Prinsip yang mengikat seluruh roadmap

1. **Bagian 0 (HTML + CSS) adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh dilompati.
   React adalah lapisan di atas HTML/CSS; tanpa lapisan bawahnya, semuanya terasa mustahil.
2. **Korpus wajib kode hasil generate AI.** Bukan kode contoh buatan tutor. Lihat §5.
3. **Satu unit = 1–2 sesi.** Satu sesi = satu konsep, maksimal 1 jam.
4. **Urutan tidak boleh dilompati.** Setiap bagian punya gerbang yang bisa diperiksa.
5. **Gerbang gagal = ulangi bagian itu**, bukan lanjut.
6. **Setiap sesi wajib punya momen salah prediksi.** Kalau tidak, materinya terlalu mudah.
7. **Semua tebakan ditulis di editor** (`prediksi.md`), bukan di kertas. Urutan PREDIKSI →
   JALANKAN diperiksa lewat timestamp.
8. **Sintaks asing BUKAN "di luar materi".** Kode AI memakai `className`, `{}` di JSX,
   `useState`, `map()`, `&&` sejak baris pertama. Kalau pembelajar bertanya *"tanda ini
   apa?"* → cek `sintaks-react.md`, jelaskan **satu bentuk** 1–2 kalimat, lanjut.
   **Jangan** bilang "di luar materi", **jangan** menjelaskan lima bentuk sekaligus.
9. **Prasyarat JavaScript diperiksa lebih dulu.** Kalau JS belum dikuasai (fungsi, array,
   referensi vs nilai, async) → kirim ke `/teach-javascript` dulu. Tanpa Unit 8
   (`referensi vs nilai`), Unit 15 skill ini tidak akan bisa dipahami.

---

## 1. BAGIAN 0 — PRASYARAT: HTML + CSS (Unit 1–6)

**Yang dilatih:** melihat halaman dan tahu **dari mana bentuknya datang**.
**Korpus:** potongan **5–15 baris** HTML/CSS hasil AI.
**Prasyarat:** tidak ada. Ini titik masuk pemula absolut.
**Alat:** browser + DevTools (Inspector). Belum ada React, belum ada build tool.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 1 | **Struktur halaman** | HTML itu **pohon elemen**, bukan teks berurutan. Tag, elemen, atribut, induk–anak | Dari satu potongan HTML, gambar pohonnya. Sebut elemen mana di dalam elemen mana | MDN: *HTML basics*; WHATWG HTML |
| 2 | **Selektor & gaya** | CSS **memilih** elemen. Tag vs kelas vs id. Kenapa gaya tidak "kena" | Dari satu potongan CSS, sebut elemen mana yang terkena dan mana yang tidak | MDN: *CSS first steps* |
| 3 | **Kotak** | Box model: content → padding → border → margin. `box-sizing` | Prediksi lebar total sebuah kotak **sebelum** diperiksa di DevTools | MDN: *The box model* |
| 4 | **Susunan: flexbox** | Baris/kolom, `justify-content`, `align-items`, `gap`. Kenapa elemen "menumpuk ke bawah" | Prediksi di mana tiap kotak berakhir, sebelum dilihat | MDN: *Flexbox* |
| 5 | **Susunan: grid & responsif** | Kolom, `@media`, satuan relatif (`rem`, `%`, `vw`) | Ubah lebar jendela — bagian mana yang berubah, dan kenapa | MDN: *CSS Grid*, *Media queries* |
| 6 | **Bentuk & keadaan** | `form`, `input`, `label`, tombol. `:hover`, `:focus`, `:disabled` | KLAIM: *"tombol ini tidak bisa diklik"* → verifikasi lewat DevTools | MDN: *Web forms* |

### → GERBANG 1 — Baca satu halaman, sebut dari mana bentuknya datang

Diberi satu halaman HTML + CSS hasil AI (± 40 baris) yang belum pernah dilihat.

**Tanpa membuka DevTools**, tuliskan:

1. Pohon elemennya (siapa di dalam siapa)
2. Elemen mana yang menghasilkan **kotak** yang terlihat di mana
3. Satu baris CSS yang, kalau dihapus, **paling merusak** tampilan — dan kenapa

Lalu buka DevTools untuk memverifikasi. **Lulus kalau poin 1 dan 3 benar.**

> **Kenapa gerbang ini ada:** tanpa kemampuan ini, React akan terasa seperti sihir.
> Semua "kok tampilannya aneh" di React bermuara ke HTML/CSS.

**Gagal?** Ulangi Unit 1–6 dengan halaman yang lebih pendek (15 baris, bukan 40).

---

## 2. BAGIAN 1 — REACT DASAR (Unit 7–10)

**Yang dilatih:** melihat komponen dan tahu **apa yang terjadi tiap render**.
**Korpus:** **satu komponen** hasil AI (10–30 baris).
**Alat:** proyek Vite yang sudah disiapkan tutor (`npm run dev`), browser, React DevTools.

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 7 | **Komponen & JSX** | Komponen = **fungsi yang mengembalikan tampilan**. JSX bukan HTML: `className`, `{}`, satu elemen induk | Lacak: fungsi mana yang dipanggil, apa yang dikembalikan | react.dev: *Describing the UI* |
| 8 | **Props** | Data masuk dari luar, **satu arah**. Komponen tidak mengubah props-nya | Lacak nilai tiap prop untuk **dua pemakaian berbeda** | react.dev: *Passing Props to a Component* |
| 9 | **State** | `useState`. Mengubah state = **menggambar ulang**. State ≠ variabel biasa — ia **potret**, bukan variabel hidup. Kenapa dua kali `setN(n+1)` cuma nambah 1 | Lacak nilai state tiap render. Prediksi berapa kali render. Bandingkan `setN(n+1)` vs `setN(n => n+1)` | react.dev: *Adding Interactivity* (*State as a Snapshot*, *Queueing a Series of State Updates*) |
| 10 | **Daftar & key** | `.map()` di JSX. `key` punya **dua** fungsi: mengenali item **dan mereset state**. Kenapa indeks berbahaya | KLAIM: *"daftar ini akan tampil benar setelah diurutkan ulang"* → verifikasi | react.dev: *Rendering Lists*, *Preserving and Resetting State* |

### → GERBANG 2 — Lacak state (ambang 50%)

Komponen **± 30 baris** yang belum pernah dilihat, dengan **dua state** dan satu `.map()`.

Tulis di `prediksi.md`: nilai setiap state dan prop **pada setiap render**, berurutan.
Lalu jalankan dan bandingkan.

**Lulus kalau ≥ 50% benar.**

> **Dasar ambang:** *"novices require a 50% tracing code accuracy before they can
> independently write code with confidence"* — Lister et al. (2004), ACM SIGCSE Bulletin
> 36(4), 119–150. Ambang yang sama dipakai `teach-javascript` Gerbang 1, supaya
> konsisten. **Batas kejujuran:** studi 2004, konteks kurikulum universitas.

**Di bawah 50%?** Ulangi Unit 7–10 dengan komponen yang lebih pendek (10 baris, satu state).

---

## 3. BAGIAN 2 — REACT MENENGAH (Unit 11–14)

**Yang dilatih:** melihat komponen dan tahu **apa yang salah, dan kenapa**.
**Korpus:** **satu file komponen utuh** hasil AI dengan hook (30–80 baris).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 11 | **Efek samping** | `useEffect`: kapan jalan, dependency array, cleanup. Kenapa ia bisa jalan **terlalu sering** | Prediksi berapa kali efek jalan untuk 3 variasi dependency | react.dev: *Synchronizing with Effects* |
| 12 | **Mengambil data** | `fetch` di dalam komponen. Empat keadaan: loading · error · kosong · ada isi | KLAIM: *"loading akan berhenti setelah data datang"* → verifikasi (biasanya `await` hilang) | react.dev: *You Might Not Need an Effect* |
| 13 | **Form terkendali** | `value` + `onChange`. Kenapa `value` tanpa `onChange` = kotak yang **beku** | KLAIM: *"input ini bisa diketik"* → verifikasi | react.dev: *Reacting to Input with State* |
| 14 | **Menyusun aplikasi** | Memecah komponen, satu tanggung jawab, di mana state harus tinggal. **State dipertahankan/direset berdasarkan POSISI**, bukan nama | Gambar **peta**: komponen mana merender komponen mana, state ada di mana | react.dev: *Managing State*, *Preserving and Resetting State* |

> **Unit 12 adalah jembatan ke MISSION.** Aplikasi laporan keuangan akan mengambil data
> dari file/Excel/PDF. Kalau keempat keadaan (loading/error/kosong/isi) tidak dibedakan,
> aplikasi akan "jalan" tapi menampilkan layar kosong tanpa penjelasan.

### → GERBANG 3 — Inspeksi komponen orang lain

Baca satu **file komponen React hasil AI yang bukan pembelajar tulis**. Jelaskan **tanpa
membuka catatan**:

1. Apa yang dilakukannya
2. **Satu** keputusan di dalamnya (kenapa `useState` di situ, kenapa `useEffect` di situ)
3. **Satu** cara komponen itu bisa gagal

**Lulus kalau ketiganya terjawab** dan poin 3 masuk akal (bukan "kalau internet mati").

---

## 4. BAGIAN 3 — MEMBONGKAR REACT (Unit 15–18)

**Yang dilatih:** menemukan masalah pada komponen, **menelusuri sebabnya**, dan
**memperbaikinya tanpa merusak**.
**Korpus:** **proyek React multi-file** hasil AI (3–8 file).

| # | Unit | Yang diajarkan | Latihan inspeksi | Sumber |
|---|---|---|---|---|
| 15 | **Kenapa layar tidak berubah** ⭐ | State **dimutasi** (`.push`, `.sort`) → alamatnya sama → React tidak tahu ada perubahan. Ini **penyebab #1** | Prediksi: setelah `arr.push(...)`, apakah layar berubah? | react.dev: *Updating Objects in State*, *Updating Arrays in State* |
| 16 | **Render berlebih & ketergantungan** | Dependency array salah → infinite loop · efek jalan terus · **stale closure** | **TELUSUR:** aplikasi jalan, tampilannya salah, tidak ada error | react.dev: *Removing Effect Dependencies*; `teach-javascript` Unit 9 |
| 17 | **Review sebagai PR** | Bentuk review: klaim → bukti → risiko → keputusan. Kenapa "jalan kok" bukan alasan | Putuskan: **terima atau tolak**. Tulis alasannya | Addy Osmani — *Agentic Code Review* |
| 18 | **Perbaiki tanpa merusak** | Satu komponen diperbaiki → komponen lain rusak. Regression | Perbaiki, lalu **buktikan yang lain tidak rusak** | `AGENTS.MD` repo (bukti, bukan klaim) |

> **Unit 15 dan Unit 16 adalah inti dari seluruh roadmap ini.**
> Keduanya adalah **alasan nomor satu** orang bilang *"React-nya tidak jalan"* — dan
> keduanya **tidak menimbulkan error**. Tidak ada pesan merah. Hanya layar yang salah.
>
> Keduanya juga bersandar pada **satu konsep dari `teach-javascript` Unit 8**
> (*referensi vs nilai*). Itulah kenapa skill itu prasyaratnya, bukan pelengkap.

### → GERBANG 4 — Temukan, telusuri, perbaiki, putuskan

**Tiga bagian, semuanya harus lulus:**

**(a) Statis.** Diberi komponen dengan **satu cacat yang disuntik** (tutor tahu di mana).
Temukan **tanpa menjalankan**, lalu **perbaiki** dan jalankan untuk membuktikan.

**(b) Dinamis (TELUSUR).** Diberi proyek React yang **sudah dijalankan** dengan tampilan
yang salah — **tanpa pesan error di console**, tanpa petunjuk lokasi.
Pakai protokol 5 langkah sampai menunjuk baris penyebabnya.
`hasil.md` harus memuat **minimal dua dugaan tertulis** — salah satunya boleh salah.

**(c) Review.** Tulis review berisi: apakah klaimnya benar + bukti · satu cacat/risiko ·
**keputusan terima/tolak + alasan**.

**Lulus kalau keputusannya beralasan**, bukan kalau keputusannya "benar".

- Menolak komponen yang sebenarnya baik **dengan alasan jelas** = **lulus**
- Menerima komponen buruk **tanpa alasan** = **gagal**
- Menerima karena "sudah saya jalankan dan jalan kok" = **gagal** (lihat Unit 18)

---

## 5. Aturan Korpus — kode hasil generate AI

| Bagian | Korpus | Ukuran |
|---|---|---|
| 0 | Potongan HTML/CSS hasil AI | 5–15 baris |
| 1 | Satu komponen hasil AI | 10–30 baris |
| 2 | Satu file komponen utuh hasil AI (dengan hook) | 30–80 baris |
| 3 | Proyek React multi-file hasil AI | 3–8 file |

**Yang perlu tutor ingat di sini (detail lengkap di `korpus-ai.md`):**

1. Tutor **tidak menulis kode sendiri** untuk latihan. Kalau perlu kode, minta AI
   menghasilkannya, lalu pakai hasilnya **apa adanya** — jangan dirapikan.
2. **Yang dicari adalah kode yang *terlihat* benar.** Kode yang jelas salah terlalu mudah.
3. Kode disalin ke `PRAKTIK/sesi-NNN/`. **Tidak pernah** dijalankan di repo produksi.
4. Sampai Bagian 2, korpus dibatasi komponen yang **tidak menyentuh jaringan nyata** —
   pakai data palsu lokal, kecuali untuk Unit 12 yang memang melatih `fetch`.

→ **Cara menyiapkan korpus, daftar cacat khas AI React, dan empat jenis latihan inspeksi
(LACAK · SUSUN · KLAIM · TELUSUR): baca `korpus-ai.md`.**

---

## 6. Bentuk Sesi (6 tahap, ≤ 1 jam) — versi editor + browser

```
1. PREDIKSI   (10')  Tutor serahkan PRAKTIK/sesi-NNN/App.jsx. Browser DITUTUP.
                     Pembelajar tulis tebakan → PRAKTIK/sesi-NNN/prediksi.md (SIMPAN).
                     ← Tutor baca prediksi.md SEBELUM melanjutkan.
2. JALANKAN   ( 5')  npm run dev → buka browser. Bandingkan dengan tebakan. Di mana meleset?
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
| **(a)** | **LACAK** — nilai tiap state/prop tiap render | Menguji *notional machine* | 1–3, 7–12 |
| **(b)** | **SUSUN** — baris diacak, susun ulang (*Parsons*) | Melatih struktur tanpa beban sintaks | 3–8, 11, 14 |
| **(c)** | **KLAIM** — tentukan apakah klaim kode itu benar | Melatih deteksi "hampir benar" | 2, 6, 10, 12, 13, 14, 17 |
| **(d)** | **TELUSUR** — tampilan salah, cari baris penyebabnya | **Melatih memburu sebab (debug)** | **15, 16**, 18 · juga 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14 |

> ⚠️ **Parsons Problem: jangan pakai distractor di Bagian 0.**
> Harms, Chen & Kelleher (2016, ICER '16) menemukan baris pengecoh **menurunkan
> efisiensi belajar pemula**. Tambahkan hanya setelah pembelajar nyaman.
>
> Cara menulis Parsons Problem yang benar (satu jawaban benar, pakai baris kode asli,
> sertakan deskripsi): **`korpus-ai.md` §4(b)**.

> ⚠️ **TELUSUR: dugaan WAJIB ditulis sebelum menyentuh kode.**
> Menabur `console.log` tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> **Satu alat per dugaan.** Di React, alatnya boleh `console.log` **atau** React DevTools —
> tapi tetap satu per dugaan. Protokol lengkap: **`korpus-ai.md` §4(d)**.

> ⚠️ **React DevTools bukan pengganti dugaan.** Ia membuat menebak jadi lebih cepat,
> bukan lebih benar. Kalau pembelajar membuka DevTools tanpa menulis dugaan dulu,
> tegur — itu TELUSUR yang tidak dijalankan.

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
| **Kalau AI memberi komponen, pembelajar wajib bisa menjelaskan tiap barisnya.** Kalau tidak bisa → jangan pakai | MIT Media Lab: pengguna LLM kesulitan mengutip karyanya sendiri |
| **Perlakukan hasil AI seperti PR dari junior.** Baca, kritik, bantah | *"Would you merge it just because the tests passed?"* |
| **Sesekali, tulis ulang dari nol** komponen yang AI tulis. Ukur berapa yang hilang | Mengukur *cognitive debt* |
| **Tutup sesi dengan satu pertanyaan:** hari ini saya belajar, atau cuma menutup tugas? | Mengirim dan belajar itu dua hal berbeda |

---

## 8. Kalau Berhenti di Tengah

Normal. Yang **tidak** boleh: mengulang dari Unit 1.

```
Berhenti di Unit 1–6    → ulangi latihan unit terakhir, lanjut
Berhenti di Unit 7–14   → langsung lanjut, tidak perlu mengulang
Berhenti di Unit 15–18  → selesaikan Unit 18 walau hasilnya jelek
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
- **Skala korpus Bagian 3** ("3–8 file") dipilih sebagai titik masuk yang masuk akal.
  Belum ada dasar riset yang menetapkan angka ini.
- **Pemilihan 18 unit untuk React belum diuji.** Ia disusun dari sumber bug yang paling
  sering dilaporkan (state dimutasi, dependency array, key) — bukan dari studi urutan
  pembelajaran React.
- **Bagian 0 (HTML/CSS) 6 unit mungkin terlalu sedikit.** Kalau di praktiknya pembelajar
  masih tersandung CSS, **tambahkan** — jangan paksakan lanjut ke React.
- **Tingkat bahaya sintaks (🔴🟡⚪ di `sintaks-react.md`) adalah penilaian, bukan hasil riset.**
- **Daftar "sengaja dilewati" bisa salah.** Kalau di proyek nyata pembelajar menemui salah
  satu topik itu dan tersandung, itu tanda daftar perlu ditinjau — bukan tanda pembelajar kurang.
- **react.dev dan MDN berubah.** Audit cakupan memakai keduanya pada **26 Sep 2026**.
- Artikel "cara belajar React 2026" di web **tidak dipakai** — aturan sumber repo ini
  melarang blog pribadi/SEO/konten AI.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `SKILL.md` · `teach-javascript/references/roadmap-4-tingkat.md` (kerangka asal)
