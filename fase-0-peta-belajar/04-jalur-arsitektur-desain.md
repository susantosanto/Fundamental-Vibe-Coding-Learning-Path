# 04 — Jalur Arsitektur Desain Sistem

> **Fungsi:** jalur lengkap untuk belajar arsitektur — memakai materi yang **sudah ada** di repo ini,
> ditambah **satu lapisan yang belum ada**: cara mengambil keputusan arsitektur.
>
> **Waktu baca file ini:** 15 menit

---

## Masalah yang jalur ini pecahkan

Repo ini sudah punya banyak materi arsitektur:

- `fase-1-arsitektur-dasar/` — 22 file, konsep system design
- `fase-4-deep-system-design/` — 12 file, arsitektur terdistribusi
- `arsitektur-vibe-coding/` — 24 file, arsitektur terapan per-stack
- `architecture-planner/MATERI-PECAHAN/20` — system design & architecture (versi metode)

Yang **tidak** ada di mana pun:

> **Bagaimana cara memilih?** Semua materi mengajarkan *apa* komponennya (cache, queue, sharding, CDN). Tidak ada yang mengajarkan *kapan* memakai yang mana, *bagaimana* menimbang dua pilihan yang sama-sama masuk akal, atau *bagaimana* mempertanggungjawabkan keputusan itu enam bulan kemudian.

Akibatnya: orang yang selesai membaca fase 1 dan 4 bisa **menjelaskan** arsitektur Twitter, tapi tidak bisa **merancang** aplikasi absensi sekolah dengan alasan yang bisa dipertahankan. Ia tahu istilahnya, tidak punya penilaiannya.

Folder `arsitektur/` menambal itu — 4 file, semuanya soal **keputusan**, bukan komponen.

---

## Struktur jalur

```
TAHAP 1 — KONSEP (materi lama)
   fase-1-arsitektur-dasar/ 01–17
   ↓
TAHAP 2 — KEPUTUSAN (materi baru) ← celah yang ditambal
   arsitektur/01-berpikir-arsitektur.md
   arsitektur/02-trade-off-dan-adr.md
   arsitektur/03-dari-kebutuhan-ke-desain.md
   ↓
TAHAP 3 — PRAKTIK (materi lama + baru)
   fase-1-arsitektur-dasar/ 18–21  (studi kasus)
   arsitektur/04-review-dan-latihan-arsitektur.md
   ↓
TAHAP 4 — TERAPAN (materi lama)
   arsitektur-vibe-coding/ 03, 06, 07, 14, 22
   ↓
TAHAP 5 — SKALA (materi lama, opsional)
   fase-4-deep-system-design/ 01–11
```

**Kalau Anda hanya punya waktu untuk satu tahap:** lakukan Tahap 2. Konsep bisa dicari saat dibutuhkan; cara berpikir tidak.

---

## TAHAP 1 — Konsep dasar (materi lama)

**Sumber:** `fase-1-arsitektur-dasar/` — 22 file, ~6 minggu @ 1 jam/hari.

**Urutan yang benar (jangan acak):**

| Minggu | File | Yang sebenarnya Anda pelajari |
|---|---|---|
| 1 | 01–05 | Cara berpikir tentang **skala**: performance vs scalability, latency vs throughput, CAP, konsistensi |
| 2 | 06–10 | Bagaimana permintaan **sampai** ke aplikasi: availability, DNS, CDN, load balancer, reverse proxy |
| 3 | 11–14 | Di mana **data** disimpan: application layer, RDBMS, NoSQL, cache |
| 4 | 15–17 | Bagaimana komponen **berbicara**: asynchronism, protokol, keamanan |
| 5 | 18–20 | **Studi kasus** — ini bagian terpenting, jangan dilewati |
| 6 | 21 | Ringkasan + latihan final |

### Cara membaca blok ini dengan benar

Ini blok yang **paling sering dibaca dengan salah.** Kesalahannya: membaca sebagai daftar istilah untuk dihafal.

**Yang harus Anda lakukan untuk setiap file:**

1. Setelah baca teori, **tutup filenya**.
2. Tulis satu kalimat: "Konsep ini berguna ketika ____."
3. Tulis satu kalimat: "Konsep ini **merugikan** ketika ____." ← ini yang paling sering dilewatkan. Setiap teknik arsitektur punya harga. Cache menambah kompleksitas invalidasi. Sharding mempersulit query lintas-shard. Microservice menambah biaya operasional.
4. Cari satu contoh di aplikasi yang Anda pakai sehari-hari.

**Contoh untuk file 14 (Cache):**
```
Berguna ketika: data dibaca jauh lebih sering daripada ditulis, dan sedikit keterlambatan
                tidak masalah (daftar produk, profil pengguna).
Merugikan ketika: data harus selalu akurat (saldo rekening), atau pola tulisnya sering.
Contoh nyata: WhatsApp menyimpan daftar chat di perangkat — karena itu kadang ada
              chat yang belum muncul sampai aplikasi di-refresh.
```

Kalau Anda hanya bisa mengisi baris pertama dan tidak baris kedua, Anda belum paham konsepnya — Anda baru menghafalnya.

---

## TAHAP 2 — Keputusan arsitektur (materi baru) ← **inti jalur ini**

**Sumber:** `fase-0-peta-belajar/arsitektur/` — 4 file.

| File | Yang Anda dapat | Prasyarat |
|---|---|---|
| `01-berpikir-arsitektur.md` | Arsitektur = pengambilan keputusan, bukan menggambar. 4 pertanyaan pembuka, fitness function, cara menghindari resume-driven development | Fase 1 selesai |
| `02-trade-off-dan-adr.md` | Cara menimbang pilihan secara sistematis, template ADR, quality attribute scenario, aturan "minimal 3 opsi" | Setelah 01 |
| `03-dari-kebutuhan-ke-desain.md` | Metode lengkap: kebutuhan → atribut kualitas → komponen → alur data → mode gagal → kapasitas. Contoh lengkap | Setelah 02 |
| `04-review-dan-latihan-arsitektur.md` | Checklist review, cara mereview arsitektur buatan AI, 6 latihan desain + rubrik penilaian | Setelah 03 |

**Baca berurutan 01 → 04.** Tidak bisa dilompati: 03 memakai kosakata dari 02, dan 04 menguji semuanya.

### Kenapa 4 file ini yang paling menentukan

Ada fenomena yang sangat umum di kalangan developer yang belajar mandiri:

> Bisa menjelaskan apa itu message queue, tapi tidak bisa menjawab
> "kenapa aplikasi saya **tidak** memakai message queue?"

Pertanyaan kedua itu pertanyaan arsitektur yang sebenarnya. Dan jawabannya tidak ada di daftar komponen mana pun — ia ada di **analisis trade-off**.

File `02-trade-off-dan-adr.md` mengajarkan satu kebiasaan yang mengubah kualitas keputusan Anda secara permanen:

> **Sebelum memutuskan, tulis minimal 3 opsi — termasuk "tidak melakukan apa-apa".**
>
> Kalau Anda hanya punya satu opsi, itu bukan keputusan. Itu kebiasaan.

---

## TAHAP 3 — Praktik: studi kasus & latihan

### 3a. Studi kasus (materi lama)

`fase-1-arsitektur-dasar/18, 19, 20` — Pastebin, Twitter, Web Crawler.

**Baca ini dengan cara berbeda:** jangan membaca sebagai penjelasan. Baca sebagai **latihan prediksi**.

```
1. Baca judul & persyaratan kasusnya saja (misal: "desain Pastebin").
2. TUTUP filenya.
3. Rancang sendiri di kertas: komponen apa, data disimpan di mana, apa bottleneck-nya.
   Tulis juga: keputusan mana yang Anda ragu, dan kenapa.
4. Baru buka filenya. Bandingkan.
5. Yang paling penting: di mana Anda berbeda, dan apakah perbedaan itu karena
   Anda salah, atau karena pilihan trade-off yang berbeda dan sama-sama sah?
```

Langkah 5 adalah yang membangun penilaian arsitektur. Sering kali jawaban Anda **tidak salah** — hanya mengoptimalkan hal yang berbeda (biaya vs kecepatan, kesederhanaan vs skala).

### 3b. Latihan terstruktur (materi baru)

`arsitektur/04-review-dan-latihan-arsitektur.md` — 6 latihan dengan rubrik.

Latihan-latihannya sengaja kecil dan **berbasis aplikasi yang Anda kenal** (absensi sekolah, kasir, portal informasi) supaya Anda bisa memverifikasi sendiri apakah desain Anda masuk akal.

**Aturan penting untuk latihan ini:** nilai diri Anda dengan rubrik, dan **catat keputusan yang Anda ragu**. Kumpulan keraguan itu adalah daftar materi yang perlu Anda baca berikutnya — jauh lebih akurat daripada silabus.

---

## TAHAP 4 — Terapan: dari desain ke proyek nyata

**Sumber:** `arsitektur-vibe-coding/`

| File | Isi | Kapan |
|---|---|---|
| 07 | Trade-off untuk pemula | **Sebelum** 08 — ini jembatan dari konsep ke praktik |
| 03 | Struktur folder Next.js | Saat mulai membangun |
| 05 | State & data flow | Saat alur data jadi rumit |
| 06 | API & database | Saat menghubungkan backend |
| 14 | SQLite | Prototipe & proyek skala kecil |
| 15 | PostgreSQL | Saat butuh konkurensi & query kompleks |
| 22 | Arsitektur desain sistem | Rangkuman terapan |
| 20 | Proyek akhir | Ujian praktik |

**Perbedaan Tahap 4 dengan Tahap 1–3:** di sini keputusan sudah punya **konsekuensi nyata**. Salah pilih database di Tahap 1 cuma salah di kertas; di Tahap 4 Anda harus migrasi data.

**Karena itu:** setiap keputusan teknis di tahap ini layak ditulis sebagai ADR (lihat `arsitektur/02`). Bahkan satu paragraf. Tujuannya bukan dokumentasi untuk orang lain — tujuannya memaksa Anda berpikir sebelum menulis kode.

---

## TAHAP 5 — Skala & kegagalan (opsional, level lanjut)

**Sumber:** `fase-4-deep-system-design/` — 12 file.

Baru masuk sini kalau aplikasi Anda **benar-benar** menghadapi masalah skala, atau kalau tujuan Anda karier di level arsitek. Jangan masuk lebih awal — konsep seperti sharding dan event sourcing tanpa masalah nyata akan terasa seperti hafalan, dan Anda akan menggunakannya di tempat yang salah.

| File | Topik | Relevan kalau… |
|---|---|---|
| 01 | Microservices deep dive | Satu aplikasi sudah terlalu besar untuk satu tim |
| 02 | Service discovery & API gateway | Ada >3 service yang saling memanggil |
| 03 | Database sharding | Satu database tidak lagi cukup |
| 04 | Message queues | Ada pekerjaan yang tidak harus selesai seketika |
| 05 | Event sourcing & CQRS | Butuh jejak audit lengkap atau pola baca/tulis sangat berbeda |
| 06 | Distributed caching | Cache lokal tidak konsisten antar-server |
| 07 | Observability | Tidak bisa tahu apa yang terjadi di produksi |
| 08–10 | Studi kasus skala besar | Belajar dari sistem yang sudah melewatinya |
| 11 | Ringkasan | Konsolidasi |

**Pertanyaan yang harus bisa Anda jawab setelah tahap ini:** untuk setiap komponen di arsitektur Anda — apa yang terjadi kalau komponen ini **mati**, **lambat**, atau **mengembalikan data salah**?

---

## Ringkasan jalur (satu tabel)

| Tahap | Sumber | File | Estimasi | Prioritas |
|---|---|---|---|---|
| 1. Konsep | `fase-1-arsitektur-dasar/` | 22 | 6 minggu | 🔴 Wajib |
| 2. Keputusan | `fase-0/arsitektur/` | 4 | 2 minggu | 🔴 **Wajib — ini celahnya** |
| 3. Praktik | `fase-1/18–20` + `fase-0/arsitektur/04` | 4 | 2 minggu | 🔴 Wajib |
| 4. Terapan | `arsitektur-vibe-coding/` | 5–8 | 2 minggu | 🟠 Sangat disarankan |
| 5. Skala | `fase-4-deep-system-design/` | 12 | 4 minggu | 🟡 Sesuai kebutuhan |

**Total jalur wajib (Tahap 1–3): ~10 minggu.** Itu cukup untuk bisa merancang aplikasi skala kecil–menengah dengan alasan yang bisa Anda pertahankan.

---

## Kesalahan yang paling sering terjadi di jalur ini

| Kesalahan | Kenapa salah | Perbaikan |
|---|---|---|
| Menghafal komponen tanpa tahu harganya | Anda akan memakainya di tempat yang salah | Untuk setiap teknik, tulis "merugikan ketika ___" |
| Melompat ke Tahap 5 | Sharding & event sourcing tanpa masalah nyata = hafalan | Tunggu sampai masalahnya muncul |
| Belajar arsitektur tanpa membangun | Arsitektur tanpa konsekuensi = menggambar, bukan merancang | Setiap tahap harus ada latihan yang Anda bangun |
| Membaca studi kasus sebagai penjelasan | Anda tahu jawaban orang lain, bukan punya penilaian sendiri | Prediksi dulu, baru bandingkan |
| Tidak mencatat keputusan | 6 bulan lagi Anda lupa kenapa memilih itu, dan akan mengubahnya tanpa alasan | Tulis ADR, minimal satu paragraf |
| Menerima arsitektur buatan AI apa adanya | AI menghasilkan arsitektur yang **plausibel**, bukan yang **cocok** | Lihat `arsitektur/04` bagian review |

---

## Kriteria "saya sudah bisa"

Anda bisa menganggap jalur ini selesai kalau bisa menjawab **ya** untuk semua:

- [ ] Untuk aplikasi terakhir yang saya bangun, saya bisa menggambar alur data dari klik user sampai database
- [ ] Saya bisa menjelaskan **dua** alternatif yang saya tolak untuk setiap keputusan teknis utama, beserta alasannya
- [ ] Saya bisa menyebutkan, untuk setiap komponen, apa yang terjadi kalau ia mati
- [ ] Saya bisa memperkirakan kapan sistem saya akan mulai lambat, dan tahu apa yang akan saya lakukan
- [ ] Saya punya dokumen keputusan (ADR) tertulis untuk proyek saya
- [ ] Saya bisa membaca arsitektur orang lain dan menemukan **satu** hal yang akan saya ubah, dengan alasan

Kalau semua tercentang, lanjutkan ke Tahap 4–5 dan mulai tulis ADR untuk proyek nyata.

---

> **File terkait:**
> - [`arsitektur/01-berpikir-arsitektur.md`](./arsitektur/01-berpikir-arsitektur.md) — mulai di sini
> - [`arsitektur/02-trade-off-dan-adr.md`](./arsitektur/02-trade-off-dan-adr.md)
> - [`05-jalur-debugging-dan-fix-error.md`](./05-jalur-debugging-dan-fix-error.md) — jalur pasangannya
