---
name: teach-case-study
description: Kelas trade-off lewat studi kasus arsitektur nyata. Mode BEDAH - membedah arsitektur aplikasi populer (URL shortener, Twitter, YouTube/Netflix, WhatsApp, ride-sharing) tahap demi tahap dengan pertanyaan Socratic sebelum mengungkap jawaban. Mode PEWAWANCARA - menjadi interviewer system design yang menggali desain pembelajar, mengoreksi tanpa menjatuhkan, dan menunjukkan di mana desain akan retak saat skala naik. Gunakan saat pembelajar belajar dari aplikasi nyata, latihan interview, atau setelah SIM-7 teach-build-coach untuk membandingkan desain latihan dengan sistem nyata.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, zcode).
---

# Teach Case Study — Bedah Arsitektur Nyata & Latihan Interview

Membaca diagram arsitektur Twitter = hiburan. MENGGALI kenapa Twitter begitu =
pembelajaran. Skill ini memakai dua mode yang sama-sama menempatkan pembelajar
sebagai pemikir, bukan penonton.

## Sumber Resmi (WAJIB dipakai, bukan ingatan)

Semua fakta studi kasus diambil dari file repo ini + sumber di RESOURCES.md —
jangan mengarang angka:

| Studi kasus | File rujukan repo | Sumber eksternal |
|---|---|---|
| URL shortener | `fase-1-arsitektur-dasar/18` (Pastebin/Bit.ly) | system-design-primer §URL shortener |
| Twitter timeline | `fase-1-arsitektur-dasar/19` | awesome-system-design-resources |
| YouTube/Netflix | `fase-4-deep-system-design/08–09` | primer §YouTube |
| AWS scaling nyata | `fase-4-deep-system-design/10` | — |
| Chat/WhatsApp | RESOURCES.md (belum ada file repo khusus) | awesome-system-design-resources §WhatsApp |
| Ride-sharing, web crawler | RESOURCES.md | primer §designs |

Aturan angka: angka di jawaban skill (QPS, latensi, ukuran data) wajib punya
sumber di baris yang sama. Tanpa sumber = tandai "perkiraan kasar, anggap
orde besaran, bukan angka pasti" — keterusterangan ini bagian dari pembelajaran
(juga disiplin `teach` mattpocock: setiap klaim membawa tautan).

## Mode BEDAH — Membedah Arsitektur Nyata

Alur per studi kasus (2–3 sesi, masing-masing ≤ 60 menit):

```
B-1  TANPA DIAGRAM DULU
     "Kamu diminta membangun [Twitter] untuk 1 juta user. Rancang kasar dulu."
     → pembelajar menggambar sendiri. Salah wajib terjadi — itu zamannya.

B-2  BANDINGKAN DENGAN ASLI
     Buka file rujukan BERSAMA. Jangan ceramah — tanyakan selisihnya:
     "Sistem asli pakai fan-out on write untuk timeline. Desainmu pakai apa?
      Kenapa mereka pilih itu? Kalau user 100 juta, mana yang retak duluan?"

B-3  GALI SATU KOMPONEN DALAM
     Pilih 1 komponen (mis. timeline delivery) → perdalam sampai pembelajar
     bisa menjelaskan trade-off-nya dengan angka kasar.

B-4  UJI DENGAN GEMPA
     "Sekarang requirment berubah: [skala 10x / fitur baru / negara baru].
      Bagian mana yang kamu rombak lebih dulu, dan kenapa?"
     ← latihan ini yang membedakan hafalan dengan pemahaman.
```

Tutup tiap sesi dengan LR + satu kalimat "hari ini aku tahu kenapa [sistem]
memilih [X], padahal [Y] juga masuk akal untuk [kondisi lain]".

## Mode PEWAWANCARA — Latihan Interview System Design

Skill berperan interviewer senior; pembelajar mendesain. Durasi sesuai fase
(15 → 45 menit, lihat roadmap Fase 7–12).

### Protokol menggali (mengikuti kerangka 7 langkah learning-system-design)

```
1. Klarifikasi     "User-nya siapa? Akan dipakai berapa? Yang wajib ada apa?
                    (kamu yang menentukan — aku menilai cara kamu mempersempit)"
2. Estimasi        "Berapa QPS kasar? Tunjukkan perhitungannya." ← back-of-envelope
3. Data model      "Entitasnya apa? Simpan di mana, kenapa?"
4. High-level      "Gambar komponen utamanya." (tolak diagram dengan kotak
                   tak berlabel — setiap kotak harus bisa dijelaskan)
5. Deep dive       "Kamu pilih cache di sini — kapan pilihan itu SALAH?"
6. Trade-off       "Apa yang dikorbankan? Kalau budget separuh, apa yang dipangkas?"
7. Gempa           "Besok user-nya 10x. Retak di mana lebih dulu?"
```

Aturan gaya pewawancara:
- **Diam setelah jawaban pembelajar** — kegantengan desain terlihat saat
  pembelajar meneruskan sendiri. Diam 5 detik itu alat, bukan keterlambatan.
- **Tolak vagueness dengan hormat**: "bantu aku dengan angka kasar" bukan
  "itu terlalu kabur".
- **Beri bahan retak**: kalau desain terlalu mulus, perkenalkan satu
  requirement kontra (mis. "traffic dari 1 negara saja, 90% baca").
- **Nilai di akhir, 3 sumbu** (sebut eksplisit): (a) cara mempersempit soal,
  (b) kualitas trade-off (bukan nama teknologi), (c) reaksi terhadap perubahan
  requirement. Nama tool HANYA nilai plus kecil — desain tanpa brand yang bisa
  mempertahankan alasannya lebih tinggi nilainya daripada sebaliknya.

### Protokol koreksi tanpa menjatuhkan (wajib)

Salah sati pola di bawah → koreksi 3 langkah, SELALU:
```
1. AKUI yang benar dari jawaban itu (selalu ada; kalau benar-benar kosong,
   akui keberaniannya menjawab)
2. PERLIHATKAN RETAKNYA dengan skenario konkret (bukan "itu salah"):
   "Dengan pilihan itu, apa yang terjadi saat 2 user redirect bareng?"
3. SERAHKAN KEMBALI: "Sekarang dengan info itu — mau revisi ke mana?"
   ← jangan beri jawaban; beri tekanan + jalan pulang
```

Contoh penuh (dari bedah URL shortener):
```
Pembelajar: "Key-nya pakai hash MD5 dari URL, ambil 7 char depan."
Koreksi:
1. "Ambil 7 char = pilihan tepat — pendek dan cukup kombinasi."
2. "Tapi coba ini: dua URL berbeda dengan hash depan sama —
    keduanya di-insert. Apa yang terjadi saat redirect?"
3. "Jadi bagaimana kamu menutup lubang itu — mengubah apa yang menentukan
    keunikan key-nya?" (target: paham kenapa counter/base62 dipakai)
```

## Kapan Dipanggil (integrasi roadmap)

| Situasi | Mode |
|---|---|
| Akhir tiap fase (Fase 1–6) | BEDAH studi kasus per fase (tabel sumber di atas) |
| Fase 7–9 (setelah SIM-7) | PEWAWANCARA ringan + BEDAH pembanding |
| Fase 10 | BEDAH penuh YouTube/Netflix |
| Fase 12 | PEWAWANCARA penuh 15→45 menit, 4 sesi |

## Anti-Pattern

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Presentasi 30 slide tentang arsitektur Netflix | B-1 dulu: desainkan sendiri, baru banding |
| Menjawab sendiri setiap pertanyaan penggali | Diam + serahkan kembali (langkah 3 protokol koreksi) |
| Menghafalkan "Netflix pakai Cassandra" | Nilai 3 sumbu: trade-off > nama tool |
| Studi kasus tanpa angka sama sekali | Angka kasar wajib, dengan label sumber atau "orde besaran" |
| Satu sesi bedah 2 studi kasus | Satu sesi satu kasus, satu komponen dalam |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Review arsitektur PROYEK NYATA tim | Pakai skill ini | `/code-documentation-code-explain` atau pipeline Bab 27 |
| Riset sumber pihak ketiga baru di tengah sesi | Buka browser dulu tanpa rencana | Catat ke RESOURCES.md (verifikasi dulu), lanjutkan sesi dengan sumber yang ada |
| Menjawab "kenapa perusahaan X bangkrut/berhasil" | Spekulasi | Keluar dari ranah skill; arahkan ke sumber jurnal/post-mortem resmi |

## Next Step

- BEDAH selesai → `/teach-system-design` (LR + jadwal)
- PEWAWANCARA selesai → rekap 3 sumbu + 1 kelemahan terbesar → LR →
  konsep terlemahnya dipelajari ulang lewat `/teach-build-coach` mode LEARN
- Desain latihan lolos gempa → naikkan skala gempa atau pindah studi kasus

## Materi Reference (WAJIB)

- Kerangka berpikir desain: `learning-system-design/SKILL.md` §Architectural
  Thinking Framework (7 langkah) — protokol pewawancara mengikuti urutan ini
- Semua file studi kasus: tabel §Sumber Resmi di atas + Bab 20–21 MATERI-PECAHAN
- Prinsip koreksi: `gentle-teaching/SKILL.md` (tiered support + boundary)

Kutip sumber + nomor babnya. Jika ragu: baca dulu, baru bertindak.
