# Case Studies — Rencana Sesi & Bank Pertanyaan

Setiap studi kasus: pertanyaan pembuka (B-1), poin retak umum desain pembelajar,
dan pertanyaan gali (B-3). Angka = orde besaran dari file rujukan repo; selalu
kutip file sumber saat menyebutnya di sesi.

---

## CS-1 URL Shortener (Fase 2 & 7) — `fase-1/18`

**B-1:** "Bangun bit.ly untuk 100 juta link, 90% trafik baca, 10% tulis."
**Retak umum:** hash acak tanpa penanganan bentrok; tidak ada cache pada
redirect (path terpanas di dunia ini); lupa angka expiry link.
**Gali:** kenapa baca >> tulis mengubah desain penyimpanan? Kenapa redirect
harus <50ms? Apa yang dicache dan TTL-nya berapa — kenapa?

## CS-2 Twitter Timeline (Fase 3 & 9) — `fase-1/19`

**B-1:** "Timeline untuk 1 juta user; ada user dengan 10 juta follower."
**Retak umum:** fan-out on write untuk SEMUA user (mahal untuk celebs);
tidak ada pembatasan timeline (asumsi feed tak terbatas); lupa read replica.
**Gali:** fan-out write vs read — titik baliknya di mana? Kenapa gabungan
(hybrid) dipakai sistem nyata? Skema cache timeline seperti apa?

## CS-3 YouTube/Netflix (Fase 10) — `fase-4/08–09`

**B-1:** "Upload video + tonton mulus untuk kualitas jaringan apa pun."
**Retak umum:** lupa transcoding pipeline (upload ≠ langsung tonton); tidak
ada multi-bitrate; anggapan CDN opsional; rekomendasi dianggap satu query DB.
**Gali:** kenapa upload cepat tapi video baru "siap" setelah beberapa menit
(async pipeline)? Bagaimana satu video disajikan ke jaringan 3G dan wifi
dengan pengalaman setara (adaptif)? Mana yang dilindungi duluan saat
bandwidth terbatas?

## CS-4 Chat/WhatsApp (Fase 8) — RESOURCES.md (sumber eksternal; repo belum punya file khusus)

**B-1:** "Chat 1-on-1 + grup kecil, pesan harus urut, user sering offline."
**Retak umum:** polling (boros) atau WebSocket tanpa reconnection; urutan
pesan mengandalkan waktu klien; offline message hilang; grup = fan-out
dilupakan.
**Gali:** kenapa waktu SERVER yang jadi urutan, bukan klien? Apa yang
terjadi di device saat tunnel koneksi putus-nyambung? Bedakan transport
untuk chat vs untuk typing indicator (kenapa beda boleh?).

## CS-5 Ride-Sharing (Fase 12) — RESOURCES.md (primer/awesome)

**B-1:** "Cocokkan penumpang dengan driver terdekat, 10 ribu kota aktif."
**Retak umum:** mencari "terdekat" dengan query jarak ke SEMUA driver
(garis lurus ≠ jarak jalan); update lokasi tiap detik ke DB utama (banjir
tulis); tidak ada pembagian wilayah.
**Gali:** kenapa geohash/grid lebih cepat daripada hitung semua jarak?
Data lokasi di-memory vs di-disk — trade-off akurasinya? Apa yang boleh
sedikit salah (matching) dan apa yang tidak boleh (pembayaran)?

---

## Rubrik Penilaian PEWAWANCARA (3 sumbu)

Nilai tiap sumbu 1–5 + satu kalimat bukti. Nama tool maksimal bonus kecil.

| Sumbu | 1 | 5 |
|---|---|---|
| (a) Mempersempit soal | langsung gambar tanpa tanya | klarifikasi user + angka + prioritas sebelum desain |
| (b) Kualitas trade-off | pilih tool tanpa alasan | setiap pilihan menyebut kondisi kapan pilihan itu salah |
| (c) Reaksi gempa | panik / mengganti semua | tunjuk komponen yang retak + mitigasi bertahap |

Rekap akhir selalu: 1 kekuatan, 1 kelemahan terbesar, konsep tepat untuk
dipelajari ulang (pemiliknya `/teach-build-coach` mode LEARN).

## Pertanyaan Gempa Standar (B-4, siap pakai)

```
G1  User 10x (seragam) → komponen mana yang retak lebih dulu?
G2  Traffic 90% dari 1 kota → apa yang berubah (cache? region?)
G3  Mode baca-dominan jadi tulis-dominan → desain mana yang diganti?
G4  Budget server separuh → apa yang dipangkas duluan, apa yang TIDAK boleh?
G5  Fitur baru: "semua harus real-time" → bagian mana yang menolak,
    dan kenapa boleh menolaknya?
```
