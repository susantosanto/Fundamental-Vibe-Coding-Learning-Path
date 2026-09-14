# 05 — Jalur Debugging & Fix Error

> **Fungsi:** index jalur debugging. Menjelaskan apa yang sudah ada, apa yang baru, dan urutan membacanya.
>
> **Waktu baca file ini:** 12 menit

---

## Kenapa debugging butuh jalurnya sendiri

Debugging adalah **kemampuan yang paling sering dilewati** dalam belajar pemrograman mandiri, dan yang paling mahal akibatnya.

Alasannya masuk akal: debugging tidak nyaman. Materi lain bisa dibaca sambil santai; debugging menuntut Anda menghadapi sesuatu yang tidak Anda pahami, sambil mungkin merasa bodoh. Jadi orang menundanya — dan menunda lagi — sampai akhirnya menghadapi bug nyata tanpa satu pun prosedur.

Dalam **vibe coding**, ketidaknyamanan ini justru paling berbahaya:

> Anda menulis lebih sedikit kode, tapi **mempertanggungjawabkan lebih banyak kode**.
>
> Kalau AI menghasilkan 200 baris dan 3 di antaranya salah, Anda tidak bisa mengandalkan "saya yang tulis, jadi saya tahu". Anda harus bisa **menyelidiki kode yang tidak Anda tulis**.

Dan ada masalah kedua yang khas: **AI bisa "memperbaiki" bug dengan cara yang membuat masalahnya hilang dari pandangan** — menghapus test yang gagal, membungkus semuanya dengan `try/except`, atau melonggarkan assertion. Kode jadi hijau; bug-nya pindah ke produksi.

Karena itu jalur ini tidak hanya mengajarkan cara debug, tapi juga **cara debug kode yang dihasilkan AI**.

---

## Apa yang sudah ada (dan kelemahannya)

Repo ini punya 12 file yang menyentuh debugging. Yang bagus: cakupannya luas. Yang bermasalah: **tidak berjenjang dan tidak menyentuh fondasinya.**

| File | Isi | Kelemahan |
|---|---|---|
| `fase-2-ai-tools-dasar/09-testing-debugging-ai.md` | Testing pyramid, TDD, generate test, analisis error, stack trace, 5 pola bug, CI | Berorientasi **"cara minta AI"** — bukan cara **Anda** menyelidiki. Bagus sebagai pendamping, lemah sebagai fondasi. |
| `fase-3-advanced-workflows/04-testing-debugging-lanjut.md` | Testing & debugging tingkat lanjut | Belum diverifikasi isinya |
| `fase-6-advanced-opencode/22-debugging-tools.md` | Tool debugging di OpenCode | Spesifik tool, bukan teknik |
| `fase-5-scenario-praktis/04-refactoring-testing.md` | Refactoring & testing harian | Skenario, bukan fondasi |
| `vibecoding/03-panduan-quality-assurance.md` | QA dalam alur vibe coding | Proses, bukan teknik |
| `vibecoding/11-panduan-runbook.md` | Runbook operasional | Operasional, bukan debugging |
| `vibecoding/12-panduan-respons-insiden.md` | Respons insiden | Setelah aplikasi live |
| `vibecoding/14-panduan-prosedur-pemulihan.md` | Prosedur pemulihan | Setelah aplikasi live |
| `fase-4-deep-system-design/07-observability-monitoring.md` | Observability skala sistem | Level lanjut |
| `skills-vendor/systematic-debugging/` | Skill debugging sistematis | **Format skill agent** — ditulis untuk agent, bukan untuk dibaca manusia sebagai materi |
| `skills-vendor/debugging-and-error-recovery/` | Skill pemulihan error | Sama |
| `skills-vendor/observability-and-instrumentation/` | Instrumentasi | Sama |

**Diagnosis:** semua materi ini menjawab *"bagaimana AI membantu saya debug"* atau *"apa yang dilakukan saat server mati"*. Yang **tidak ada**:

- Tidak ada **model mental** tentang apa itu debugging sebenarnya
- Tidak ada **prosedur** yang bisa diulang untuk bug apa pun
- Tidak ada **latihan berjenjang** untuk melatih kemampuan prosedural
- Tidak ada materi tentang **debugging kode yang tidak Anda tulis** — padahal itu inti vibe coding

---

## Apa yang baru (8 file)

`fase-0-peta-belajar/debugging/` — ini yang menambal empat celah di atas.

| File | Isi | Celah yang ditambal |
|---|---|---|
| `01-mental-model-debugging.md` | Bug = selisih antara model mental dan kenyataan. 3 mode gagal pemula. Siklus debugging. Kenapa "mengubah kode sampai jalan" itu judi. | Tidak ada fondasi |
| `02-membaca-error-dan-stack-trace.md` | Anatomi pesan error, membaca stack trace **dari bawah**, taksonomi error (syntax/runtime/logika/lingkungan), error yang menyesatkan | Sudah ada tapi dangkal |
| `03-metode-ilmiah-bisection-delta.md` | **REDUCE framework** (6 langkah), hipotesis-uji, binary search, `git bisect`, delta debugging, menangani bug intermiten | **Tidak ada sama sekali** |
| `04-taktik-debugging.md` | 7 taktik konkret: log terstruktur, breakpoint, rubber duck, bisection, debugging diferensial, reproduksi minimal, assert & timeout | Tersebar, tidak sistematis |
| `05-pola-bug-umum.md` | 12 pola bug dengan contoh Indonesia + **cara mengenali gejalanya** | Ada 5, tanpa kedalaman |
| `06-debugging-kode-buatan-ai.md` | Profil bug khas kode AI, cara debug kode yang tidak Anda tulis, anti-pola "biar AI yang betulkan" | **Tidak ada sama sekali** |
| `07-latihan-bertahap-debugging.md` | 12 latihan berjenjang dari trivial → sulit, **self-contained** (kode rusaknya sudah disediakan) | **Tidak ada sama sekali** |
| `08-debugging-produksi-dan-postmortem.md` | Debug tanpa bisa reproduksi lokal, rollback-first, `git bisect` pada deploy, postmortem blameless | Ada di `vibecoding/`, tapi tidak terhubung ke debugging |

---

## Urutan membaca

### Kalau Anda sedang macet SEKARANG

Jangan baca berurutan. Lompat ke yang paling dekat dengan masalah Anda:

| Gejala | Baca |
|---|---|
| "Saya tidak paham pesan errornya" | `02-membaca-error-dan-stack-trace.md` |
| "Saya tidak tahu harus mulai dari mana" | `03-metode-ilmiah-bisection-delta.md` → REDUCE framework |
| "Errornya muncul-hilang, tidak konsisten" | `03` → bagian bug intermiten |
| "Errornya di kode yang AI tulis" | `06-debugging-kode-buatan-ai.md` |
| "Error hanya di server, tidak di laptop saya" | `08-debugging-produksi-dan-postmortem.md` |
| "Saya tidak tahu ini bug jenis apa" | `05-pola-bug-umum.md` |

**Kalau panik dan hanya punya 10 menit:** `03-metode-ilmiah-bisection-delta.md`, bagian *REDUCE Framework*. Enam langkah, berlaku untuk semua bug, semua bahasa.

### Kalau Anda mau membangun kemampuan dari nol

Baca **berurutan 01 → 08**. Alasannya:

```
01 (model mental)  →  tanpa ini, semua teknik di bawah terasa seperti hafalan
02 (baca error)    →  sumber informasi pertama, dan paling sering diabaikan
03 (metode)        →  prosedur inti. ini tulang punggungnya.
04 (taktik)        →  alat-alat konkret untuk menjalankan prosedur di 03
05 (pola bug)      →  pengenalan pola; mempercepat hipotesis
06 (kode AI)       →  penerapan semuanya pada konteks Anda yang sebenarnya
07 (latihan)       →  tempat kemampuan prosedural benar-benar terbentuk
08 (produksi)      →  konteks di mana taruhannya tinggi
```

**Estimasi:** 8 file × 45 menit baca = ~6 jam. Plus 12 latihan di `07` × 30 menit = ~6 jam. **Total ~12 jam** untuk fondasi debugging yang berlaku seumur karier. Ini rasio manfaat/usaha terbaik di seluruh repo ini.

---

## Cara melatih (bagian yang tidak bisa dilewati)

Debugging adalah kemampuan **prosedural**. Membacanya tidak cukup — sama seperti membaca tentang berenang.

```
BACA (6 jam)  →  memberi Anda kosakata dan prosedur
LATIHAN (6 jam) →  mengubahnya jadi kemampuan
```

Kalau Anda hanya punya waktu untuk satu: **lakukan latihannya.** `07-latihan-bertahap-debugging.md` punya 12 latihan dengan kode rusak yang sudah disiapkan. Setiap latihan menyebutkan **gejala** yang akan Anda lihat, tapi tidak menyebutkan penyebabnya.

### Pola latihan yang benar

```
1. Baca gejalanya.
2. Sebelum menyentuh kode: TULIS hipotesis Anda.
   "Saya tebak ini terjadi karena ___."
3. Tulis juga: "Kalau hipotesis saya benar, maka ___ harus ___."
   (prediksi yang bisa salah)
4. Baru jalankan dan selidiki, pakai prosedur dari 03.
5. Setelah ketemu: tulis apa hipotesis pertama Anda, dan apa yang sebenarnya.
6. Bandingkan. Di mana model mental Anda meleset?
```

Langkah 6 itu yang membangun kemampuan. Bug yang Anda temukan dalam 30 detik tapi tidak Anda pahami **tidak mengajarkan apa-apa**. Bug yang Anda butuhkan 40 menit tapi akhirnya Anda pahami — itulah pelajarannya.

### Setelah 12 latihan

Buat latihan Anda sendiri, pakai pola **build-break-fix** (dijelaskan di `03-cara-belajar-fondasi.md`):

```
1. Ambil proyek kecil Anda sendiri yang sudah jalan.
2. Minta AI menyisipkan satu bug — TANPA memberi tahu Anda di mana.
   Prompt: "Sisipkan satu bug halus di proyek ini yang bisa dideteksi lewat
            perilaku yang salah (bukan crash). Jangan beri tahu saya letaknya.
            Beri tahu saya hanya gejalanya."
3. Tunggu 1–2 hari (supaya Anda lupa).
4. Debug dengan prosedur. Catat waktu yang dibutuhkan.
5. Ulangi. Waktu Anda harus turun.
```

---

## Menghubungkan ke materi lama

Setelah fondasi 8 file selesai, materi lama jadi jauh lebih berguna — Anda punya kerangka untuk menempatkannya.

| Setelah baca | Lanjut ke | Yang Anda dapat |
|---|---|---|
| `01`, `02` | `fase-2-ai-tools-dasar/09-testing-debugging-ai.md` | Cara memakai AI untuk mempercepat, dengan pemahaman fondasi |
| `03`, `04` | `fase-2/09` bagian TDD + coverage | Membuktikan perbaikan Anda benar |
| `05` | `skills-vendor/systematic-debugging/` | Versi skill — sekarang bisa Anda baca sebagai ringkasan, bukan sebagai instruksi |
| `06` | `fase-3-advanced-workflows/04-testing-debugging-lanjut.md` | Pendalaman |
| `08` | `vibecoding/11-runbook`, `12-respons-insiden`, `14-pemulihan` | Konteks operasional: apa yang dilakukan saat sistem live bermasalah |
| `08` | `fase-4-deep-system-design/07-observability-monitoring.md` | Debugging sistem terdistribusi |

---

## Tabel: masalah → teknik → file

Ini tabel rujukan cepat. Kalau Anda menghadapi situasi di kolom kiri, lompat langsung.

| Situasi | Teknik utama | File |
|---|---|---|
| Tidak paham pesan error | Baca lengkap + cari baris pertama yang milik kode Anda | `02` |
| Crash dengan stack trace panjang | Baca **dari bawah ke atas** | `02` |
| Tidak ada error, tapi output salah | Debugging diferensial (bandingkan dengan kasus yang benar) | `04` |
| Bug di antara 200 baris | Binary search | `03` |
| Bug muncul setelah pull/merge | `git bisect` | `03` |
| Bug hanya muncul kadang-kadang | Perbesar sampel, cari pola waktu/data/beban | `03` |
| Tidak bisa reproduksi lokal | Observability + rollback-first | `08` |
| Kode AI jalan tapi hasilnya aneh | Cek hallucinated API, fallback senyap, test yang kosong | `06` |
| Test hijau tapi bug ada di produksi | Cek apakah test-nya benar-benar menguji, atau hanya tidak gagal | `06` |
| Sudah 30 menit dan tidak maju | Berhenti, tulis ulang masalahnya dalam satu kalimat, minta bantuan | `01` |
| Perbaikannya jalan tapi tidak paham kenapa | Anda mungkin memperbaiki gejala, bukan akar | `01`, `03` |

---

## Tiga prinsip yang mengikat seluruh jalur ini

**1. Bug adalah informasi, bukan kesalahan Anda.**
Bug berarti ada selisih antara apa yang Anda pikirkan tentang kode dan apa yang sebenarnya dilakukan kode. Menemukan selisih itu adalah pekerjaannya. Marah pada diri sendiri hanya memperlambat.

**2. Perbaikan yang tidak Anda pahami adalah bug berikutnya.**
Kalau Anda mengubah sesuatu dan errornya hilang, tapi Anda tidak tahu kenapa — Anda tidak memperbaiki apa pun. Anda menunda. Bug itu akan kembali, dalam bentuk yang lebih sulit dikenali.

**3. Reproduksi dulu, perbaiki kemudian.**
Anda tidak bisa memverifikasi perbaikan yang tidak bisa Anda reproduksi. Kalau bug-nya muncul-hilang, tugas pertama Anda bukan memperbaiki — tapi membuatnya **muncul secara konsisten**. Tanpa itu, setiap "perbaikan" hanyalah tebakan.

---

## Kesalahan umum saat belajar debugging

| Kesalahan | Kenapa salah | Perbaikan |
|---|---|---|
| Mengubah kode acak sampai jalan | Anda tidak belajar; dan Anda mungkin menambah bug baru | Tulis hipotesis dulu, selalu |
| Mengubah 3 hal sekaligus | Kalau berhasil, Anda tidak tahu yang mana yang bekerja | Satu perubahan, satu uji |
| Menganggap "tidak ada error" = benar | Banyak bug tidak memunculkan error, hanya output salah | Verifikasi nilai, bukan hanya absennya crash |
| Percaya pesan error apa adanya | Pesan error menunjukkan **di mana** gagal, bukan selalu **kenapa** | Selalu tanya "kenapa nilai ini sampai di sini?" |
| Menerima "perbaikan" AI yang menghapus test | Itu bukan perbaikan; itu menyembunyikan masalah | Lihat `06`, bagian anti-pola |
| Debug sendirian lebih dari 30 menit tanpa kemajuan | Anda sedang menebak, bukan menyelidiki | Minta satu eksperimen berikutnya, bukan jawabannya |
| Tidak mencatat bug yang sudah dipecahkan | Bug yang sama akan kembali, dan Anda mulai dari nol | Simpan catatan: gejala → akar → perbaikan |

---

## Kriteria "fondasi debugging saya sudah ada"

- [ ] Saya punya prosedur yang saya jalankan setiap kali menghadapi bug (bukan improvisasi)
- [ ] Saya menulis hipotesis **sebelum** mengubah kode
- [ ] Saya bisa membaca stack trace dan menunjuk baris **akar**, bukan baris terakhir
- [ ] Saya tahu apa itu binary search debugging dan pernah memakainya
- [ ] Saya tahu apa itu `git bisect` dan kapan memakainya
- [ ] Saya bisa menyebutkan 5+ pola bug umum dan gejalanya
- [ ] Saya bisa memeriksa kode buatan AI dan menemukan kelemahannya
- [ ] Saya selalu menambahkan test setelah memperbaiki bug
- [ ] Saya menyimpan catatan bug yang sudah dipecahkan
- [ ] Saya bisa menjelaskan **kenapa** setiap perbaikan saya benar — bukan hanya "sudah jalan"

---

> **Mulai dari sini:** [`debugging/01-mental-model-debugging.md`](./debugging/01-mental-model-debugging.md)
>
> **Sedang macet sekarang?** Lompat ke [`debugging/03-metode-ilmiah-bisection-delta.md`](./debugging/03-metode-ilmiah-bisection-delta.md)
