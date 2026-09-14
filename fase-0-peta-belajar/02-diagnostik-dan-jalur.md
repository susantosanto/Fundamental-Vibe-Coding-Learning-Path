# 02 — Diagnostik & Jalur Belajar

> **Fungsi:** mengubah 244 file menjadi **satu** jadwal yang cocok untuk Anda.
>
> **Waktu:** 15 menit mengisi + 10 menit membaca hasil.

---

## Cara pakai

Isi 12 pertanyaan di bawah dengan jujur. **Jangan menilai diri terlalu tinggi** — tujuan diagnostik ini adalah menemukan celah, bukan mendapat nilai bagus.

Skala tiap jawaban: **0** = tidak bisa · **1** = bisa dengan melihat contoh · **2** = bisa sendiri tanpa melihat apa pun

> **Sudah punya jalur, tapi bingung menerapkannya sehari-hari?**
> Lihat [`06-contoh-alur-belajar.md`](./06-contoh-alur-belajar.md) — contoh konkret menit per menit,
> dan tiga alur berbeda untuk tiga tipe orang.

---

## Bagian 1 — Pemrograman dasar (4 pertanyaan)

| # | Pertanyaan | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | Saya bisa menulis fungsi yang menerima parameter dan mengembalikan nilai, di satu bahasa, tanpa mencari sintaksnya | ☐ | ☐ | ☐ |
| 2 | Saya paham perbedaan array/list, object/dict, dan kapan memakai masing-masing | ☐ | ☐ | ☐ |
| 3 | Saya bisa membaca kode orang lain dan menjelaskan **apa** yang dilakukannya, baris per baris | ☐ | ☐ | ☐ |
| 4 | Saya paham apa itu function scope, dan kenapa variabel di dalam fungsi tidak terlihat di luar | ☐ | ☐ | ☐ |

**Subtotal Bagian 1: ___ / 8**

---

## Bagian 2 — AI tooling (3 pertanyaan)

| # | Pertanyaan | 0 | 1 | 2 |
|---|---|---|---|---|
| 5 | Saya tahu apa fungsi file konteks proyek (`CLAUDE.md` / `AGENTS.MD`) dan pernah menulisnya | ☐ | ☐ | ☐ |
| 6 | Saya bisa membuat skill atau slash command sendiri, bukan cuma memakai yang sudah ada | ☐ | ☐ | ☐ |
| 7 | Saya paham kenapa AI kadang menghasilkan kode yang salah, dan bisa menebak penyebabnya dari bentuk prompt saya | ☐ | ☐ | ☐ |

**Subtotal Bagian 2: ___ / 6**

---

## Bagian 3 — Arsitektur (3 pertanyaan)

| # | Pertanyaan | 0 | 1 | 2 |
|---|---|---|---|---|
| 8 | Saya bisa menjelaskan kenapa aplikasi saya memakai database tertentu, dan apa konsekuensinya kalau diganti | ☐ | ☐ | ☐ |
| 9 | Saya bisa menggambar alur data aplikasi saya dari user klik sampai database tersimpan | ☐ | ☐ | ☐ |
| 10 | Saya pernah **menolak** satu keputusan teknis karena alasan trade-off, bukan karena "kurang familiar" | ☐ | ☐ | ☐ |

**Subtotal Bagian 3: ___ / 6**

---

## Bagian 4 — Debugging (2 pertanyaan)

| # | Pertanyaan | 0 | 1 | 2 |
|---|---|---|---|---|
| 11 | Saat error muncul, saya punya **prosedur** — bukan menebak-nebak dan mengubah kode sampai jalan | ☐ | ☐ | ☐ |
| 12 | Saya bisa membaca stack trace dan menunjuk baris mana yang **akar** masalah, bukan baris terakhir yang muncul | ☐ | ☐ | ☐ |

**Subtotal Bagian 4: ___ / 4**

---

## Membaca hasil

| Total | Diagnosis | Mulai dari |
|---|---|---|
| **0–6** | Fondasi pemrograman belum cukup. Materi arsitektur akan terasa seperti hafalan tanpa makna. | **Jalur A** |
| **7–13** | Bisa menulis kode, tapi belum punya proses. Kemampuan akan mandek di "bisa bikin, tidak paham". | **Jalur B** |
| **14–19** | Sudah produktif, tapi rapuh — tidak tahu cara membuktikan kode Anda benar, dan tidak bisa membela keputusan desain. | **Jalur C** |
| **20–24** | Solid. Yang tersisa adalah kedalaman: skala, kegagalan, dan operasional. | **Jalur D** |

**Aturan penting:** kalau salah satu bagian bernilai **≤ 2 dari maksimal**, jalur Anda harus memuat blok itu lebih dulu, apa pun total skor Anda. Skor tinggi di satu area tidak menutupi lubang di area lain — khususnya **Bagian 4 (debugging)**. Debugging adalah kemampuan yang paling sering dilewati dan paling mahal akibatnya.

---

## Jalur A — "Fondasi dulu" (skor 0–6)

**Masalah inti:** Anda belum bisa membaca kode dengan nyaman. Materi system design akan terasa seperti menghafal istilah asing.

**Prinsip:** jangan sentuh arsitektur atau AI tooling dulu. Bangun dulu kemampuan membaca.

```
Minggu 1–4   → learning-python/SKILL.md  atau  learning-javascript/SKILL.md
               (pilih SATU. jangan dua-duanya.)
Minggu 5–6   → fase-0/debugging/01, 02, 04
               (baca ini SEKARANG, bukan nanti — debugging adalah cara tercepat
                membangun model mental tentang cara program bekerja)
Minggu 7–8   → fase-0/03-cara-belajar-fondasi.md + 07-latihan-bertahap-debugging.md
               (kerjakan 12 latihan. ini kurikulum tersembunyi Anda.)
Minggu 9–10  → fase-2-ai-tools-dasar 01–04
Minggu 11–12 → fase-1-arsitektur-dasar 01–06 (hanya 6 file pertama)
```

**Yang sengaja dilewati:** fase 4, fase 6, `book-resource/`, `easy-vibe-materi/`.

**Cara tahu Anda siap naik ke Jalur B:** Anda bisa membaca file Python/JS yang belum pernah Anda lihat, dan menjelaskan apa yang dilakukannya tanpa menjalankannya.

---

## Jalur B — "Bangun proses" (skor 7–13) ← **paling umum**

**Masalah inti:** Anda bisa membuat aplikasi jalan, tapi dengan menebak-nebak. Tidak ada proses yang bisa diulang.

**Prinsip:** Anda butuh **dua** hal yang tidak Anda miliki: prosedur debugging, dan cara mengendalikan AI alih-alih disetir AI.

```
Minggu 1     → fase-0/03-cara-belajar-fondasi.md
Minggu 1–3   → fase-0/debugging/01 → 08 (BERURUTAN)
               ← ini blok terpenting untuk Anda. jangan dilewati.
Minggu 3–5   → architecture-planner/MATERI-PECAHAN 01 → 08
               ← ini yang mengubah "saya pakai AI" jadi "saya mengarahkan AI"
Minggu 5–7   → fase-2-ai-tools-dasar (11 file, lengkap)
Minggu 7–9   → fase-0/arsitektur/01 → 03
Minggu 9–12  → fase-1-arsitektur-dasar (22 file, berurutan)
Minggu 12+   → pilih: fase-3 (kalau mau lebih dalam ke AI) atau
                      arsitektur-vibe-coding (kalau mau bangun proyek nyata)
```

**Kebiasaan yang harus dipasang di jalur ini:** setiap kali menghadapi bug, **tulis dulu** hipotesis Anda sebelum mengubah kode apa pun. Satu baris. Kalau Anda tidak bisa menuliskan hipotesisnya, berarti Anda belum paham masalahnya — dan mengubah kode saat itu adalah judi.

**Cara tahu Anda siap naik ke Jalur C:** Anda bisa menyelesaikan bug yang belum pernah Anda temui, tanpa menebak, dan bisa menjelaskan **kenapa** perbaikannya benar (bukan sekadar "sudah jalan").

---

## Jalur C — "Kedalaman & pembuktian" (skor 14–19)

**Masalah inti:** Anda produktif, tapi tidak bisa **membuktikan** bahwa kode Anda benar. Dan keputusan desain Anda sulit dipertahankan saat ditanya "kenapa begitu?".

```
Minggu 1–2   → fase-0/arsitektur/01 → 04
               ← fokus di 02 (trade-off & ADR). ini celah utama Anda.
Minggu 2–4   → fase-0/debugging/03, 05, 06, 08
               ← lewati 01 dan 02 kalau sudah kuat. 06 wajib (kode buatan AI).
Minggu 4–8   → fase-4-deep-system-design (12 file, berurutan)
Minggu 8–10  → fase-1-arsitektur-dasar 18, 19, 20 (studi kasus saja)
Minggu 10–13 → fase-3-advanced-workflows (10 file)
Minggu 13–16 → vibecoding/09, 10, 11, 12, 13, 14
               ← dokumentasi arsitektur, infrastruktur, runbook, insiden, change log, pemulihan
```

**Latihan wajib jalur ini:** ambil satu keputusan teknis yang sudah Anda buat di proyek nyata, dan tulis ADR untuknya (template di `arsitektur/02`). Kalau Anda tidak bisa menuliskan **dua alternatif** yang Anda tolak beserta alasannya, keputusan itu belum matang — ia kebetulan.

**Cara tahu Anda siap naik ke Jalur D:** ada dokumen tertulis yang menjelaskan keputusan arsitektur proyek Anda, dan Anda bisa mempertahankannya saat ditantang.

---

## Jalur D — "Skala & kegagalan" (skor 20–24)

**Masalah inti:** Kemampuan teknis sudah kuat. Yang belum: berpikir dalam mode **kegagalan**.

```
Minggu 1–2   → fase-0/arsitektur/02, 04
Minggu 2–5   → fase-4-deep-system-design (lengkap)
Minggu 5–7   → architecture-planner/MATERI-PECAHAN 20, 21, 22, 23
Minggu 7–9   → vibecoding/09, 10, 11, 12, 13, 14, 15
Minggu 9–12  → book-resource/ai-engineering-indonesia (kalau arahnya produk AI)
Minggu 12+   → fase-6-advanced-opencode + tulis skill Anda sendiri di skills/
```

**Pertanyaan yang harus Anda kuasai di jalur ini:** bukan "bagaimana sistem ini bekerja", tapi "**bagaimana sistem ini gagal**, dan apa yang terjadi setelahnya". Untuk setiap komponen di arsitektur Anda: apa yang terjadi kalau komponen ini mati? kalau lambat? kalau mengembalikan data salah? kalau dua kali lebih banyak trafik?

---

## Template jadwal 8 minggu

Isi ini setelah Anda memilih jalur. Cetak atau tempel di dekat meja.

```
JALUR SAYA: ______        TANGGAL MULAI: ______
TARGET SELESAI: ______    JAM PER HARI: ______

Minggu 1  | _____________________________ | target: ______________
Minggu 2  | _____________________________ | target: ______________
Minggu 3  | _____________________________ | target: ______________
Minggu 4  | _____________________________ | target: ______________
          | ── cek tengah: apakah masih sesuai jalur? ──
Minggu 5  | _____________________________ | target: ______________
Minggu 6  | _____________________________ | target: ______________
Minggu 7  | _____________________________ | target: ______________
Minggu 8  | _____________________________ | target: ______________
          | ── tinjau ulang: isi diagnostik lagi ──
```

**Aturan jadwal:**
- **Satu jam sehari yang konsisten > empat jam sekali seminggu.** Materi arsitektur butuh jeda antar sesi untuk "mengendap".
- **Sisipkan satu hari kosong** per minggu. Kalau tidak, Anda akan tertinggal dan berhenti.
- Kalau tertinggal lebih dari satu minggu, **jangan** mengejar dengan menggandakan jam. Potong lingkupnya, bukan kualitasnya.

---

## Template log belajar

Buat file `log-belajar.md` di folder ini (atau di mana pun Anda suka). Satu baris per sesi:

```
TANGGAL    | FILE                          | YANG DIPELAJARI         | DURASI | YANG MASIH BINGUNG
2026-09-14 | debugging/03-metode-ilmiah    | REDUCE framework        | 45mnt  | delta debugging belum kebayang
2026-09-15 | fase-1/04-cap-theorem         | CAP bukan pilih 2 dari 3| 60mnt  | belum paham "P" praktisnya
```

**Kenapa kolom terakhir wajib:** setelah 20 baris, kolom "yang masih bingung" akan menunjukkan pola. Biasanya 3–4 topik yang berulang. Itu daftar prioritas belajar Anda yang sebenarnya — jauh lebih akurat daripada silabus mana pun.

**Aturan log:** jangan menulis "selesai" atau "sudah paham". Tulis **apa** yang Anda pahami, dalam kalimat Anda sendiri. Kalau Anda tidak bisa menuliskan satu kalimat, Anda belum paham — Anda baru membaca.

---

## Kapan mengulang diagnostik

Isi ulang 12 pertanyaan ini:

- Setelah **8 minggu**
- Setelah menyelesaikan **satu fase penuh**
- Kapan pun Anda merasa "kok rasanya tidak maju" — kadang jawabannya adalah jalur yang salah, kadang memang sedang plateau dan jawabannya adalah bertahan

Kalau skor Anda **tidak naik** setelah 8 minggu mengikuti jalur dengan disiplin, itu sinyal penting: masalahnya bukan materi, tapi **metode belajar**. Baca `03-cara-belajar-fondasi.md` dan periksa apakah Anda hanya membaca tanpa pernah memprediksi, mencoba, dan gagal.

---

> **Lanjut ke:** [`03-cara-belajar-fondasi.md`](./03-cara-belajar-fondasi.md)
