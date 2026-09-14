# 00 — Rencana

> **Untuk:** Anda. JavaScript/TypeScript. Sudah tahu dasar. Mau paham fondasi.
> **Waktu:** 7 minggu, 1 jam/hari
> **Cara pakai:** kerjakan Langkah 1. Selesai, lanjut Langkah 2. Jangan lompat.

---

## MULAI dan SELESAI

```
MULAI   →  01-referensi-vs-nilai.md        (Minggu 1)
SELESAI →  06-bangun-satu-hal.md           (Minggu 7)
```

---

## Urutan file di folder ini

Kerjakan **berurutan**. Satu file, sampai selesai, baru lanjut.

| # | File | Minggu | Isi |
|---|---|---|---|
| 1 | `01-referensi-vs-nilai.md` | 1 | Kenapa `let b = a` bikin bug. Sumber bug JS nomor satu. |
| 2 | `02-scope-dan-closure.md` | 2 | Kenapa data di React "tidak mau berubah". Sumber bug React nomor satu. |
| 3 | `03-debugging.md` | 3 | Breakpoint, baca stack trace. Ini **metodenya**. |
| 4 | `04-async-event-loop.md` | 4–5 | Kenapa `setTimeout(..., 0)` tidak langsung jalan. |
| 5 | `05-typescript.md` | 6 | Dikoreksi sebelum kode dijalankan. |
| 6 | `06-bangun-satu-hal.md` | 7 | Tanpa framework. Selesai dalam 1 minggu. |

**Itu saja.** Anda tidak perlu membuka folder lain di repo ini. Semua yang Anda butuhkan ada di dalam folder `belajar-javascript/`.

---

## Centang kalau sudah selesai

Ini bukan formalitas. Melihat baris tercentang adalah alasan Anda akan kembali besok.

```
[ ] 01  Referensi vs nilai          → Minggu 1
[ ] 02  Scope & closure             → Minggu 2
[ ] 03  Debugging                   → Minggu 3
[ ] 04  Async & event loop          → Minggu 4
[ ] 04  Async & event loop          → Minggu 5
[ ] 05  TypeScript                  → Minggu 6
[ ] 06  Bangun satu hal             → Minggu 7
[ ] ✅  Ujian akhir (6 pertanyaan)   → lihat 06-bangun-satu-hal.md
```

**Aturan centang:** centang hanya kalau Anda sudah mengerjakan **latihannya**, bukan hanya membacanya. Kalau hanya dibaca, jangan centang.

---

## Kenapa urutannya begini

Anda sudah tahu dasar — variabel, fungsi, array, object — tapi masih melihat contoh.

Artinya: **sintaksnya sudah ada, model mentalnya belum.** Anda bisa menulis kode, tapi saat ada bug Anda menebak.

Jadi rencana ini **tidak mengulang sintaks.** Isinya 5 hal yang membuat orang benar-benar paham JavaScript, lalu 1 minggu untuk mempraktikkannya.

| Langkah | Menjawab pertanyaan |
|---|---|
| 01 | Nama ini menunjuk **benda** yang mana? |
| 02 | Nama ini menunjuk benda **dari kapan**? |
| 03 | Kalau saya salah, bagaimana saya **mencari tahu**? |
| 04 | Kenapa urutannya **tidak seperti yang saya tulis**? |
| 05 | Bagaimana supaya saya **salah lebih cepat**? |

Dua langkah pertama adalah fondasinya. Tiga sisanya adalah alat.

**Kenapa debugging di Langkah 3, bukan di akhir?** Karena debugging adalah cara Anda **memeriksa pemahaman sendiri**. Tanpa itu, Langkah 4 dan 5 akan terasa seperti hafalan lagi.

**Kenapa closure sebelum React?** Karena bug React yang paling sering dialami pemula (*stale closure*) adalah **bug JavaScript biasa** yang muncul di dalam React. Kalau Anda mengenalinya di JavaScript, Anda mengenalinya di React dalam 10 detik.

---

## Cara belajar tiap sesi

Berlaku untuk semua langkah. 5 baris ini yang membuat bedanya.

```
1. Baca sedikit (10 menit) — sampai paham APA yang mau dipelajari
2. TULIS prediksi Anda di kertas SEBELUM menjalankan kode
3. Jalankan. Lihat hasilnya.
4. Bandingkan — di mana tebakan meleset?   ← di sini pelajarannya
5. Catat satu baris: apa yang dipahami, apa yang masih bingung
```

**Aturan tunggal:** kalau dalam satu sesi Anda **tidak pernah salah**, materinya terlalu mudah. Naikkan kesulitannya.

**Kenapa harus salah dulu?** Karena yang membuat ingatan menempel bukan membaca jawaban yang benar — tapi **momen Anda sadar tebakan Anda salah**. Materi ini dirancang supaya Anda salah dulu. Itu disengaja, bukan jebakan.

---

## Kalau Anda berhenti di tengah

Ini normal. Yang **tidak** boleh dilakukan: mengulang dari Langkah 1.

```
Berhenti di Langkah 1–2  → ulangi latihannya, lanjut
Berhenti di Langkah 3–5  → langsung lanjut, tidak perlu mengulang
Berhenti di Langkah 6    → selesaikan proyeknya, walau jelek
```

Kalau tertinggal: **potong lingkupnya, jangan gandakan jamnya.** Satu jam sehari yang konsisten mengalahkan empat jam setiap Sabtu.

---

## Selesai = bisa jawab 6 ini tanpa buka catatan

Kalau keenamnya bisa dijawab, Anda sudah paham fondasi. Selesai.

1. Kenapa `let b = a` berbahaya kalau `a` itu array?
2. Kenapa `var i` di dalam loop membuat semua fungsi mencetak angka yang sama?
3. Kenapa data di React bisa "tidak mau berubah" walau kodenya terlihat benar?
4. Kenapa `setTimeout(..., 0)` tidak langsung jalan?
5. Apa bedanya `for...of` dan `forEach` untuk kode async?
6. Kalau ada bug, apa langkah pertama saya?

Jawaban ada di `06-bangun-satu-hal.md`. Ujiannya di sana.

---

## Aturan yang mengikat

- **Satu file, sampai selesai, baru lanjut.** Jangan buka dua file sekaligus.
- **Tulis tebakan sebelum menjalankan kode.** Kertas, bukan kepala.
- **Jangan pakai framework** sampai Langkah 6 selesai. Framework menyembunyikan JavaScript.
- **Kalau tertinggal, jangan menggandakan jam.** Potong lingkupnya, bukan kualitasnya.
- **Sisipkan 1 hari kosong per minggu.** Kalau tidak, Anda akan tertinggal dan berhenti.
- **Jangan centang kotak kalau belum mengerjakan latihannya.**

---

> **Mulai:** buka [`01-referensi-vs-nilai.md`](./01-referensi-vs-nilai.md)
