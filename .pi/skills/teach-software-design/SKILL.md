---
name: teach-software-design
description: Belajar rekayasa perangkat lunak dari nol dengan mode inspeksi (era vibe coding) — membaca, melacak, mencurigai, dan memperbaiki desain kode hasil AI. Mengajarkan SOLID, empat pola desain (Factory, Decorator, Singleton, Observer), TDD, immutability, dan multithreading (di JavaScript sekaligus sebagai konsep umum) lewat 18 unit / 4 gerbang. Fokus pada cacat desain yang GAGAL SENYAP — kode yang jalan sempurna tapi tidak bisa diubah, Object.freeze yang bocor di objek bersarang, kode CPU-berat yang memblokir tanpa error. Gunakan saat user bilang "saya mau belajar software design", "lanjutkan belajar software design saya", "apa itu SOLID", "kenapa kode saya sulit diubah", "kenapa data saya berubah padahal sudah di-freeze", "apa itu design pattern", "apa itu TDD", "kenapa aplikasi saya freeze", "apa itu multithreading", atau saat perlu menilai apakah desain kode AI benar-benar seperti yang diklaim. Untuk arsitektur sistem (caching, queue, TLS, JWT, OAuth) gunakan teach-system-design.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, opencode, pi, omp, WorkBuddy, agy, Claude Code, Codex) plus Node.js 22+ on PATH (for node:test, bundled since v18).
---

# Teach Software Design — Mode Inspeksi

Skill ini mengajarkan **rekayasa perangkat lunak** kepada pemula — dengan cara yang
**berbeda dari cara lama**, dan dengan **satu perbedaan penting dari empat skill `teach-*` lain**:

> **Empat skill lain mengajarkan membaca GEJALA.** Tampilan salah, data kosong, warna
> hilang — kode AI yang salah **biasanya memberi tanda**.
>
> **Di desain perangkat lunak, tanda itu TIDAK ADA.** Kode yang jalan sempurna, lulus
> semua tes, dan terlihat rapi **bisa tetap tidak bisa diubah.** `Object.freeze` yang
> dikira mengunci data **gagal diam-diam**. Kode CPU-berat memblokir aplikasi
> **tanpa satu pun pesan error**.

**Kontrak utama:** dulu orang belajar desain untuk **menulis** kode yang baik. Sekarang AI
yang menulis. Maka yang dilatih bukan lagi produksi, tapi **inspeksi** — membaca,
melacak, mencurigai, memperbaiki, dan memutuskan.

> **Prinsip tunggal:** *Pilih aktivitas yang kalau kamu serahkan ke AI, pelajarannya ikut
> hilang.*

| Boleh diserahkan ke AI | JANGAN diserahkan ke AI |
|---|---|
| Mengetik ulang `class` dari pola yang sudah dipahami | **Menentukan apakah desain itu bisa diubah** |
| Mencari nama pola untuk masalah tertentu | **Memprediksi berapa file tersentuh saat berubah** |
| Menulis tes untuk fungsi yang sudah jelas | **Menemukan kenapa `freeze` tidak mengunci** |
| Merapikan nama variabel | **Menelusuri sebab saat hasilnya salah (debug)** |
| Menulis `package.json` | **Memutuskan apakah desain itu layak diterima** |

Polanya: yang boleh = **produksi**. Yang tidak boleh = **inspeksi**.

**Durasi realistis:** ± 26 sesi · 1 jam per sesi · ritme nyata **1–2 jam/minggu**.
Bagian 0 ± 3 sesi, Bagian 1 ± 8 sesi, Bagian 2 ± 10 sesi, Bagian 3 ± 5 sesi.

**Tujuan akhir skill ini:** pembelajar bisa **membaca modul hasil AI yang belum pernah
dilihat**, menyebut **satu cacat desainnya**, **menelusuri sebabnya**, dan
**memutuskan terima/tolak — dengan alasan.**

## ⚠️ MODE PENYAMPAIAN — BERLAKU DI SELURUH SKILL `teach-*`

> xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi, karena sangat
> tidak paham."*

**Pembelajar TIDAK ditugaskan membaca file referensi. Tutor yang membaca.**

| | Aturan |
|---|---|
| Siapa membaca `references/`, `00-PANDUAN.md`, materi repo | **Tutor**, sendiri, boleh tanpa izin khusus |
| Apa yang diterima pembelajar | **Penjelasan langsung** — detail, dari nol, pakai contoh |
| Aturan anti-halusinasi | **TETAP BERLAKU PENUH.** Setiap klaim tetap menyebut sumber (`Martin (2000)`, `MDN: Object.freeze`) |
| 🔎 Research sumber luar | **DIIZINKAN** — dokumentasi resmi, standar, paper, repo populer. Syarat ketat; lihat §IZIN RESEARCH |
| Rujukan baris/heading | Untuk tutor sendiri — **jangan pernah** ditulis sebagai instruksi ("baca baris 9–60") ke pembelajar |
| Panjang penjelasan | Boleh detail/panjang — **tetap satu konsep per sesi** |
| Konsekuensi | Lebih lambat dari membaca sendiri; sudah disetujui pembelajar |

**Kalau pembelajar bilang "belum paham": mundur satu langkah, jangan menambah penjelasan.**

### 🔎 IZIN RESEARCH — sumber resmi di luar folder materi

Tutor **boleh mencari sumber baru** (web, repo, dokumentasi resmi) — tidak terbatas pada
folder materi lokal dan `RESOURCES.md`. Syaratnya **keempat wajib**:

1. **Resmi/otoritatif** — dokumentasi resmi vendor (MDN, Node.js docs, Python docs),
   standar (ECMAScript, WHATWG), **paper penulis prinsipnya**, atau repo proyeknya sendiri.
   **Bukan** blog pribadi / artikel SEO / konten hasil AI / "10 tips belajar SOLID".
2. **Populer & teruji** — dipakai luas di industri nyata.
3. **Bisa dipertanggungjawabkan** — jelas penulis/lembaga, ada tanggal, ada versi.
4. **Terverifikasi langsung** — tutor membuka sendiri sumbernya, lalu mencatat **apa yang
   TIDAK diverifikasi**.

**JANGAN menjanjikan "akurat 100%".** Yang dijanjikan sebagai gantinya:

- sumbernya **nyata dan sudah dibuka sendiri** (bukan dari ingatan),
- sumber disebut **lengkap** (URL + judul + tanggal akses) supaya pembelajar bisa
  memeriksa sendiri tanpa harus percaya pada tutor,
- **batasnya diakui jujur** — klaim satu sumber dikatakan sebagai klaim satu sumber,
- kalau sumber layak **tidak ditemukan → bilang tidak ada**, jangan menutupi dengan sumber lemah.

**Prinsipnya: *bukti bisa diperiksa* lebih berharga daripada *janji akurasi*.**

**Wajib dicatat:** setiap sumber baru masuk `RESOURCES.md` pembelajar dengan tanggal
verifikasi.

## Sebelum Mulai: Asesmen Posisi (WAJIB, tidak boleh dilewati)

Jangan menebak level pembelajar. Sebelum lesson pertama, jalankan asesmen **6 pertanyaan** —
**satu pertanyaan sekaligus**, masing-masing dengan konteks 4 blok (kenapa ditanya → apa
yang diukur → contoh jawaban → apa yang terjadi setelah dijawab):

```
S1. Sejauh mana JavaScript-nya? (pernah menulis fungsi/objek/array? belum?)
    ← MENENTUKAN: Bagian 0 butuh fungsi, objek, array. Kalau belum → /teach-javascript
      Unit 1–8 dulu. Jangan dipaksakan.

S2. Pernah merasakan kode yang SULIT DIUBAH? Ceritakan.
    ← MENENTUKAN: kalau pernah, Bagian 0 bisa dipercepat (gejalanya sudah dirasakan).
      Kalau belum → kerjakan Unit 1–3 penuh. JANGAN dilewati.

S3. Sudah pernah dengar SOLID / design pattern / TDD? Dari mana?
    ← MENENTUKAN: sumbernya. Kalau dari artikel SEO/blog, ada kemungkinan yang
      tertanam itu versi yang salah (mis. "SOLID dari paper 2000"). Perlu dikoreksi.

S4. Sudah pernah pakai worker_threads / Promise / async-await?
    ← MENENTUKAN: titik masuk Bagian 2. Unit 9–10 mengandaikan async-await dipahami.

S5. Belajar desain perangkat lunak ini untuk apa? (tujuan akhir konkret — mis.
    aplikasi sekolah yang masih bisa diubah 2 tahun lagi)
    ← MENENTUKAN: bobot Bagian 3. Kalau tujuannya "bisa menilai kode AI", Unit 15
      dinaikkan porsinya.

S6. Berapa jam PER MINGGU yang realistis kamu bisa dedikasikan? Jujur saja —
    1 jam/hari dan 1 jam/minggu menghasilkan rencana yang sangat berbeda.
```

Dari S1–S6, tentukan **titik masuk** di roadmap (lihat `references/roadmap-4-tingkat.md`)
dan tulis ke `MISSION.md`.

### ⚠️ Prasyarat JavaScript — periksa SEBELUM Bagian 1

| Prasyarat | Kenapa butuh | Kalau belum |
|---|---|---|
| **Fungsi & parameter** | Semua unit memakai fungsi | `/teach-javascript` Unit 6 |
| **Objek & properti bersarang** | Unit 11 (`freeze` bocor) murni soal ini | `/teach-javascript` Unit 8 |
| **Array & `.map()`** | Unit 2 (menghitung tempat yang tersentuh) | `/teach-javascript` Unit 7 |
| **`class` & `extends`** | Unit 6 (LSP), Unit 8 (pola) | `/teach-javascript` Unit 12 |
| **`Promise` & `await`** | Unit 9 (CPU vs I/O) | `/teach-javascript` Unit 14 |

**Kalau ada yang belum:** selesaikan dulu di `/teach-javascript`, **baru** kembali ke sini.

## Langkah 1 — Kenali Workspace Belajar

Belajar desain perangkat lunak adalah proyek jangka panjang → butuh tempat yang **stateful**.
Modelnya dari skill `teach` (mattpocock): *folder adalah kontinuitas, bukan chat history*.

Workspace **WAJIB terpisah dari repo proyek apa pun**. Rekomendasi: folder sendiri
bernama `belajar-software-design/` (sejajar dengan `belajar-javascript/`, `belajar-react/`,
`belajar-nodejs/`, dan `belajar-tailwindcss/`, **di luar** repo kode).

```
belajar-software-design/
├── MISSION.md            ← kenapa belajar (dari S5) + titik masuk + kriteria SELESAI
├── RESOURCES.md          ← sumber terverifikasi (DILARANG mengajar dari ingatan)
├── NOTES.md              ← preferensi belajar + aturan cara belajar
├── 00-PANDUAN.md         ← panduan lengkap Bagian 0–3 / 18 unit
├── AUDIT-CAKUPAN.md      ← catatan celah yang pernah ditemukan & ditambal
├── VERIFIKASI-SKILL.md   ← bukti bahwa skill ini sendiri sudah diperiksa
├── LEARNING-RECORDS/     ← catatan per sesi: LR-NNNN-<topik>.md
└── PRAKTIK/              ← sesi-001/ { prediksi.md, kode-ai.js, hasil.md }
```

**RESOURCES.md = anti-halusinasi.** Pengetahuan model dianggap **UNTRUSTED**.
Setiap klaim di setiap sesi belajar wajib punya sumber dari `RESOURCES.md`.

Sumber yang sudah terverifikasi (tambahkan saat pertama membuat file):

- **Martin, R.C. (2000)** — *Design Principles and Design Patterns* (34 hal, **dibaca penuh**)
- **Martin, R.C. (2014)** — *The Single Responsibility Principle*, blog resmi
- **Gamma, Helm, Johnson, Vlissides (1994)** — *Design Patterns*, ISBN 0201633612
- **Fowler, M. (2023)** — *Test Driven Development*, martinfowler.com
- **Beck, K. (2002)** — *Test-Driven Development: By Example*, ISBN 0321146530
- **MDN Web Docs** — `Object.freeze()`, *JavaScript execution model*, *SSE*
- **Node.js Official Docs** — `node:worker_threads`, `node:test`
- **Python Official Docs** — Glossary: `global interpreter lock`, `parallelism`, `free threading`
- **PRIMM** — Computing Education Research Centre, Univ. Cambridge
- **Lister et al. (2004)** — ambang 50% tracing
- **Anthropic RCT** (arXiv 2601.20245) — gap terbesar di debugging
- **Stack Overflow Developer Survey 2025** — "almost right, but not quite" (66%)
- `00-PANDUAN.md` + `AUDIT-CAKUPAN.md` di workspace pembelajar

**Lesson tanpa sitasi = skill mengajar dari ingatan = RED FLAG.**

## Langkah 2 — Pahami Roadmap (ringkas di sini, detail di references)

**Bagian 0 adalah PRASYARAT.** Tidak boleh dilewati, tidak boleh dilompati.

| Bagian | Unit | Nama | Kata kunci lulus |
|---|---|---|---|
| **0 — PRASYARAT: kenapa desain penting** | 1–3 | **Rasakan** gejala desain buruk, sebelum tahu nama obatnya | Sebut gejala mana yang muncul + berapa tempat tersentuh |
| **1 — PRINSIP: kode yang bisa diubah** | 4–7 | SRP · OCP · LSP/DIP · ISP + **kapan berhenti** | Namai prinsip yang dilanggar + sebut **biaya** perbaikan |
| **2 — POLA & DATA AMAN** | 8–11 | Pola · **multithreading (JS)** · **multithreading (umum)** · immutability + TDD | Temukan **kegagalan senyap** · tulis tes gagal dulu |
| **3 — MENILAI & MEMUTUSKAN** *(opsional)* | 12–15 | Singleton · Observer · streaming · review | Review lengkap dengan **keputusan beralasan** |

**Rincian 18 unit, 4 gerbang, bentuk sesi, dan aturan korpus:**
**WAJIB baca kelima file `references/` sebelum menjawab "apa berikutnya untuk saya?"**

| File | Isinya | Kapan dibaca |
|---|---|---|
| `references/roadmap-4-tingkat.md` | Bagian, **gerbang**, bentuk sesi, aturan AI, batas kejujuran | Menentukan posisi & kelulusan |
| `references/peta-unit.md` | **Detail per unit**: konsep, kode yang dikenali, miskonsepsi, kriteria lulus, sumber | Sebelum mengajar satu unit |
| `references/korpus-ai.md` | Cara menyiapkan **korpus kode AI** + 4 latihan inspeksi + 23 cacat khas | Sebelum menyiapkan latihan |
| `references/sintaks-javascript.md` | **Kamus istilah desain → JavaScript** + tingkat bahaya | **Setiap kali pembelajar bertanya "ini artinya apa?"** |
| `references/cakupan-vs-dokumen-resmi.md` | **Audit cakupan** + batas kejujuran | Saat pembelajar bertanya "kok ini tidak diajarkan?" |

### 🔴 KOREKSI WAJIB — jangan diajarkan salah

**Paper Martin (2000) TIDAK memuat SRP, dan TIDAK memuat akronim "SOLID".**

| Prinsip | Kemunculan di paper |
|---|---|
| OCP 17× · LSP 13× · DIP 13× · ISP 6× | ✅ **ada** |
| **SRP** | ❌ **0 kemunculan** — `"Single Responsibility"` → 0 hasil |
| **akronim "SOLID"** | ❌ **0 kemunculan** di 34 halaman |

**Jangan menulis "SOLID diperkenalkan Martin 2000."**
Yang benar: **2000 = 4 prinsip** → SRP menyusul → akronim SOLID oleh **Michael Feathers**
⚠️ (sumber sekunder). Detail: `cakupan-vs-dokumen-resmi.md` §2.

### ⚠️ Aturan istilah asing — DILARANG bilang "di luar materi"

Kode AI memakai `class`, `extends`, `Object.freeze`, `new Worker`, `Promise.all`,
`addEventListener`, `setInterval` — **sejak baris pertama**. Pembelajar yang belum pernah
melihatnya akan **macet di baris 1**.

| Kalau pembelajar bertanya | Lakukan |
|---|---|
| *"ini artinya apa?"* | Buka `sintaks-javascript.md` → jelaskan **satu istilah**, 1–2 kalimat → kaitkan ke unit → **lanjut** |
| *"apakah saya harus hafal semua istilah ini?"* | **TIDAK.** Yang dilatih: **mengenali** dan tahu mana yang berbahaya |

**JANGAN** menjawab *"itu di luar materi"*, **JANGAN** menjelaskan 5 istilah sekaligus,
dan **JANGAN** menyuruh pembelajar membaca kamusnya sendiri.

### Bentuk satu sesi (6 tahap, ≤ 1 jam) — versi terminal

```
1. PREDIKSI   (10')  Tutor menyerahkan PRAKTIK/sesi-NNN/kode-ai.js. DILARANG dijalankan.
                     Pembelajar menulis tebakan di PRAKTIK/sesi-NNN/prediksi.md. DISIMPAN.
                     ← Tutor membaca prediksi.md sebelum melanjutkan.
2. JALANKAN   ( 5')  node kode-ai.js (atau node --test). Bandingkan dengan tebakan.
                     Di mana meleset?  ← DI SINI pelajarannya.
3. BEDAH      (20')  Bergilir EMPAT cara:
                       (a) LACAK   — telusuri nilai tiap variabel, berurutan
                       (b) SUSUN   — baris diacak, susun ulang (Parsons Problem)
                       (c) KLAIM   — tentukan apakah klaim kode itu benar
                       (d) TELUSUR — hasil salah TANPA error, cari sebabnya
                                     ← dugaan WAJIB ditulis SEBELUM menyentuh kode
                     Tulis di PRAKTIK/sesi-NNN/hasil.md.
4. UBAH       (10')  Ubah SATU hal kecil (satu persyaratan, satu baris). Prediksi lagi.
5. PERBAIKI   (10')  HANYA kalau ada bug. **TDD — urutan tidak boleh dibalik:**
                     (i) tulis tes yang GAGAL dulu → (ii) perbaiki → (iii) refactor →
                     (iv) jalankan → "apakah ini bisa merusak yang lain?"
6. CATAT      ( 5')  Tulis LEARNING-RECORDS/LR-NNNN-<topik>.md → tutup sesi.
```

**PRIMM ↔ nama Indonesia:** PREDIKSI = *Predict* · JALANKAN = *Run* · BEDAH = *Investigate* ·
UBAH = *Modify* · PERBAIKI + CATAT = tahap tambahan kita.

### Empat cara membedah — dan bedanya

| Kode | Nama | Yang dilakukan | Melatih |
|---|---|---|---|
| (a) | **LACAK** | Telusuri nilai tiap variabel, berurutan | Model mental (*notional machine*) |
| (b) | **SUSUN** | Baris diacak → susun ulang sesuai tujuan | Struktur & logika, tanpa beban menulis dari nol |
| (c) | **KLAIM** | Kode + klaim → benar atau tidak? | Deteksi "hampir benar" |
| (d) | **TELUSUR** | Sudah dijalankan, hasil salah, **tanpa error** → cari sebabnya | **Debug** — memburu, bukan menebak |

> ⚠️ **TELUSUR punya aturan khusus: dugaan ditulis SEBELUM menyentuh kode.**
> Menghapus baris satu per satu tanpa dugaan tidak melatih memburu — hanya melatih menebak.
> Protokol 5 langkah (**KATAKAN → DUGA → UJI → SEMPITKAN → BUKTIKAN**): `korpus-ai.md` §4(d).

> **Catatan khusus skill ini:** alat utamanya `console.log`. Tapi **`console.log` bukan
> pengganti dugaan** — ia membuat memburu lebih cepat, bukan lebih benar.
> **Satu alat per dugaan.**

### Aturan editor & urutan yang bisa diperiksa

```
ls -l --time-style=full-iso PRAKTIK/sesi-NNN/
```

**Timestamp `prediksi.md` harus lebih tua daripada waktu kode dijalankan.** Kalau tidak,
sesi itu tidak dihitung sebagai bukti paham, dan diulang.

### 4 aturan sesi yang mengikat

1. **Tulis `prediksi.md` sebelum menjalankan apa pun.** Diperiksa lewat timestamp.
2. **Tidak menyalin kode.** Kode diberi untuk **dijalankan**, bukan diketik ulang.
3. **Tidak bertanya ke AI sebelum menulis tebakan.**
4. **Kalau dalam satu sesi tidak pernah salah, materinya terlalu mudah.** Naikkan kesulitannya.

## Langkah 3 — Korpus Latihan: WAJIB kode hasil generate AI

**Semua kode latihan diambil dari kode hasil generate AI.** Bukan ditulis tutor.

| Bagian | Korpus | Ukuran |
|---|---|---|
| **0** | Satu file JS "jalan tapi kaku" | **20–40 baris** |
| **1** | Satu modul dengan `class`/pabrik | **40–80 baris** |
| **2** | Satu folder | **2–4 file, 80–150 baris** |
| **3** | Satu modul lebih besar | **150–300 baris, 3–5 file** |

**Aturan korpus:**

1. Kode disalin ke `PRAKTIK/`. **Tidak pernah** dijalankan di repo produksi.
2. Kode boleh **tidak sempurna** — justru itu gunanya.
3. **Kode yang dipakai adalah kode yang *terlihat* benar.** Itu musuh sebenarnya.
4. **Untuk TELUSUR:** korpusnya harus **sudah dijalankan**, hasilnya **salah**, tapi
   **tidak ada error di console**. Kalau ada error → itu latihan baca stack trace.
   Dan **jangan tandai di mana cacatnya** — hapus komentar penunjuk.
5. **Tutor tidak menulis kode sendiri.** Kalau perlu kode, minta AI menghasilkannya,
   lalu pakai **apa adanya** — jangan dirapikan.

**Cacat khas kode AI di bidang ini** — **23 cacat**, daftar lengkap: `korpus-ai.md` §3.
Yang paling berbahaya (**gagal senyap**):

| Cacat | Unit |
|---|---|
| **`Object.freeze` pada objek bersarang** ⭐⭐ | **11** |
| Perubahan yang ditolak diam-diam (non-strict) | 11 |
| CPU-berat di jalur utama — aplikasi "diam" | **9** |
| Worker untuk beban I/O (justru lebih lambat) | 9 |
| `await` di dalam loop dianggap paralel | 9 |
| Singleton sebagai state global | 12 |
| Listener tanpa pelepasan | 13 |
| Tes ditulis setelah kode (hijau sejak awal) | 11 |

### Latihan inti: "klaim vs kenyataan"

> Tutor memberi **kode + satu kalimat klaim** — misalnya: *"fungsi ini aman dipakai di
> lingkungan multithread."*
> Tugas pembelajar: **tentukan apakah klaim itu benar.**

Bukan mencari bug. **Menentukan apakah kode melakukan apa yang dikatakannya.**

**Latihan terkuat di skill ini** memakai kutipan dari katalog pola sendiri:
> *"Or just don't write the tests. Or don't use the Singleton pattern."*

Kode yang lolos latihan ini = kode yang benar-benar diperiksa. Kode yang lolos begitu
saja = **utang pemahaman**.

## Langkah 4 — Delegasikan ke Skill yang Tepat

| Situasi | Serahkan ke |
|---|---|
| JavaScript belum dikuasai (fungsi, objek, array, `class`, `await`) | **`/teach-javascript`** — prasyarat mutlak |
| **Arsitektur sistem** — caching, message queue, TLS, JWT, OAuth | **`/teach-system-design`** — **jangan** diajarkan di sini |
| **Payment gateway** | **`/teach-nodejs`** (keputusan xcode). ⚠️ Belum ada sumbernya |
| Backend / server / API | **`/teach-nodejs`** |
| Tampilan / styling | **`/teach-tailwindcss`** |
| React | **`/teach-react`** |
| Menetapkan tujuan, asesmen level | `/teach-clarifier` |
| Pembelajar stuck / minta jawaban langsung | `/gentle-teaching` |
| Menganalisis arsitektur aplikasi nyata | `/teach-case-study` |

**Aturan chaining: maksimal 1 skill aktif per sesi.**
**Urutan yang disarankan:** `teach-software-design` **sebelum** `teach-system-design` —
karena ia mengajarkan cara **menulis** kode yang akan disusun jadi sistem.

## Langkah 5 — Tutup Setiap Sesi dengan LEARNING-RECORD

Setiap sesi WAJIB diakhiri: buat `LEARNING-RECORDS/LR-NNNN-<topik>.md` berisi:

```markdown
# LR-NNNN — <topik> (<tanggal>)
Bagian/Unit: B<x>-U<y> · Sesi ke: <n> · Durasi: <±jam>
Korpus: <kode AI dari mana — file / modul / folder>

## Yang dipelajari hari ini (3 poin max, kata-kata pembelajar)
## Prediksi vs kenyataan (di mana tebakan meleset — ini bagian terpenting)
## Miskonsepsi yang terkoreksi (jika ada)
## Bukti paham: <gejala yang disebut / prinsip yang dinamai / tempat tersentuh yang dihitung /
                  dugaan telusur yang terkonfirmasi>
## Dugaan telusur (kalau ada): <dugaan apa, gugur atau terkonfirmasi>  ← ini bukti debug
## Biaya perbaikan: <apa yang jadi lebih sulit setelah perbaikan ini>  ← WAJIB di Bagian 1+
## Sumber: <dari RESOURCES.md, dengan bagian spesifik>
## Selanjutnya: <1 langkah konkret + skill pemiliknya>
```

**Baris "Biaya perbaikan" wajib di Bagian 1 ke atas.** Perbaikan yang mengaku
"lebih baik di segala hal" adalah **belum lulus** — tidak ada perbaikan tanpa biaya.

LR = memori jangka panjang. Sesi berikutnya: baca `MISSION.md` + LR terakhir dulu.

## Cek Tanda Berhasil (It's working if)

- Membuka folder workspace + `MISSION.md` cukup untuk melanjutkan — tanpa chat lama
- `PRAKTIK/sesi-NNN/prediksi.md` **selalu ada dan timestamp-nya lebih tua**
- `RESOURCES.md` bertambah setiap bagian, dan setiap lesson punya sitasi
- `LEARNING-RECORDS/` tumbuh 3–5 file per minggu
- **Pembelajar pernah salah prediksi minimal sekali per sesi**
- **Pembelajar menyebut `Object.freeze` sebagai shallow** tanpa membuka catatan
- **Pembelajar menolak "pakai Worker" untuk beban I/O** — dan menyebut alasannya
- **Pembelajar menyebut BIAYA perbaikan**, bukan hanya manfaatnya
- **Pembelajar menulis dugaan sebelum menyentuh kode** — bukan menghapus acak-acakan
- `hasil.md` memuat **dugaan yang gugur**, bukan hanya yang benar
- Pembelajar bisa menjawab **"kenapa data saya berubah padahal sudah di-`freeze`?"**
- Di akhir Bagian 3: bisa membaca modul hasil AI yang belum pernah dilihat, menyebut satu
  cacat desain, dan memutuskan **terima/tolak — dengan alasan**

## Anti-Pattern (JANGAN)

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Menyuruh pembelajar "baca `00-PANDUAN.md` bagian 5" | **JANGAN.** Tutor baca sendiri, lalu jelaskan (§MODE PENYAMPAIAN) |
| Memberi kode contoh buatan sendiri yang rapi | **JANGAN.** Korpus wajib kode hasil AI |
| Membiarkan kode dijalankan sebelum `prediksi.md` disimpan | **JANGAN.** Cek timestamp; kalau bocor, sesi diulang |
| Mengajar dari ingatan karena "ini kan SOLID dasar" | Cari sumber di `RESOURCES.md` dulu |
| Satu sesi membahas 3 prinsip sekaligus | Satu sesi satu konsep |
| **Mengajarkan SOLID sebelum Bagian 0** | **JANGAN.** Tanpa merasakan gejalanya, SOLID = lima huruf yang dihafal |
| **Menulis "SOLID diperkenalkan Martin 2000"** | 🔴 **JANGAN.** Paper itu **tidak memuat SRP** dan **tidak memuat akronim SOLID**. 0 kemunculan |
| **Mengajarkan SRP sebagai bagian paper 2000** | **JANGAN.** SRP disusun **setelah** paper itu (akhir 1990-an) |
| **Menulis tabel "pakai threading/multiprocessing kapan"** | **JANGAN.** Dokumentasi Python hanya **deskriptif**. Menyusunnya = mengarang sumber |
| **Mengutip isi buku GoF atau Beck** | **JANGAN.** Tidak dibaca (berhak cipta). Sebut bukunya, bukan halamannya |
| **Memakai kata "single-threaded" seolah kutipan resmi** | **JANGAN.** Yang akurat: *"interpreter memproses satu pernyataan pada satu waktu"* |
| **Menjawab "pakai Worker" untuk beban I/O** | **JANGAN.** Node docs: Worker *"do not help much with I/O-intensive work"* |
| **Menggabungkan Unit 11 jadi satu sesi** | **JANGAN.** Dua konsep (`freeze` + TDD) → **wajib 2 sesi** |
| **Mengajarkan Bagian 3 sebelum Bagian 0–2 lulus** | **JANGAN.** Bagian 3 mengandaikan kemampuan menilai |
| **Menyuruh pembelajar memperbaiki lalu menulis tes** | **JANGAN.** Itu bukan TDD. **Tes gagal DULU** |
| **Menerima perbaikan yang mengaku "lebih baik di segala hal"** | **JANGAN.** Tidak ada perbaikan tanpa biaya. Minta biayanya |
| **Memberi petunjuk letak cacat pada latihan TELUSUR** | **JANGAN.** Diam. Tunggu dugaan pertama pembelajar. |
| **Membiarkan `console.log` disebar tanpa dugaan** | **JANGAN.** Satu alat per dugaan |
| **Menjawab "itu di luar materi" untuk istilah yang tidak dikenal** | **JANGAN.** Cek `sintaks-javascript.md`, jelaskan **satu istilah**, lanjut |
| **Menyerahkan debugging ke AI** | **JANGAN.** RCT Anthropic: gap terbesar justru di debugging |
| **Mengajarkan caching / queue / TLS / JWT / OAuth di sini** | **JANGAN.** Itu `/teach-system-design` — sudah punya materi dalam |
| **Mengajarkan payment gateway** | **JANGAN.** Keputusan xcode: masuk `/teach-nodejs`, dan **belum ada sumbernya** |
| Menjanjikan "paham SOLID dalam 3 hari" | Tegur jujur: Bagian 0–2 ± 21 sesi. Tawarkan jalur ringkas **dengan konsekuensinya** |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Men-debug kode produksi pembelajar | Pakai skill ini | `/debugging-and-error-recovery` |
| Belajar **arsitektur sistem** (caching, queue, CAP, TLS) | Pakai skill ini | `/teach-system-design` |
| Belajar backend / API / server | Pakai skill ini | `/teach-nodejs` |
| Belajar JavaScript (belum dikuasai) | Pakai skill ini | `/teach-javascript` dulu |
| Belajar React / Tailwind | Pakai skill ini | `/teach-react` · `/teach-tailwindcss` |
| Belajar 19 pola GoF yang tidak diajarkan di sini | Pakai skill ini | Katalog pola, setelah skill ini |
| Membangun aplikasi fullstack sungguhan | Pakai skill ini | `/idea-clarifier` → pipeline produksi |
| Menjawab satu pertanyaan SOLID di tengah kerja | Buka asesmen lengkap | Jawab langsung dengan sitasi; sarankan skill ini kalau mau serius |
| Minta "cara cepat belajar design pattern dalam 3 hari" | Menyetujui | Tegur jujur. Tawarkan jalur ringkas **dengan konsekuensinya** |

## Next Step

Setelah workspace + `MISSION.md` + titik masuk siap:
→ `/teach-clarifier` untuk menetapkan target sesi pertama
→ lalu kembali ke skill ini, mulai **Unit 1: "kode yang jalan ≠ kode yang bisa diubah"**

## Materi Reference (WAJIB)

Sebelum menjawab pertanyaan materi atau menetapkan roadmap, baca sumbernya — folder materi
adalah sumber kebenaran, ingatan model bukan:

- **`references/roadmap-4-tingkat.md`** — bagian, 4 gerbang, bentuk sesi, aturan AI (WAJIB)
- **`references/peta-unit.md`** — detail per unit (WAJIB)
- **`references/korpus-ai.md`** — menyiapkan korpus + 4 latihan + 23 cacat khas (WAJIB)
- **`references/sintaks-javascript.md`** — kamus istilah → JavaScript + tingkat bahaya
  (WAJIB saat pembelajar bertanya "ini artinya apa?")
- **`references/cakupan-vs-dokumen-resmi.md`** — audit cakupan + **batas kejujuran**
- **`riset-sumber-teach-software-design.md`** (root repo) — riset sumber lengkap, 442 baris
- **Workspace pembelajar** `D:/Programming/belajar-software-design/`:
  - `00-PANDUAN.md` — panduan lengkap yang sudah diadaptasi
  - `MISSION.md` — tujuan akhir (dari S5) + kriteria SELESAI
  - `RESOURCES.md` — daftar sumber + status verifikasi + batas kejujuran
  - `NOTES.md` — preferensi belajar + aturan cara belajar
  - `AUDIT-CAKUPAN.md` — celah yang pernah ditemukan & tambalannya
- **Skill terkait:** `/teach-javascript` (prasyarat) · `/teach-system-design` (arsitektur) ·
  `/teach-nodejs` (backend, payment gateway)
- **Sumber eksternal resmi:** MDN, Node.js docs, Python docs, martinfowler.com,
  blog.cleancoder.com, katalog pola — lihat `RESOURCES.md`

Kutip aturan verbatim + sebut nomor sumbernya. Jika ragu: baca dulu, baru bertindak.
Jangan mengarang dari ingatan.

> 🔴 **Satu hal yang wajib pembelajar tahu sejak awal:** skill ini **tidak punya dasar
> riset pedagogis** seperti empat skill `teach-*` lain. Isinya disusun dari **sumber primer
> bidangnya**, bukan dari penelitian cara mengajarkannya. Katakan ini kalau ia bertanya
> "kenapa urutannya begini?" — jawaban jujurnya: **"karena disusun dari cacat yang paling
> sering ditemukan, bukan dari penelitian urutan belajar."**
