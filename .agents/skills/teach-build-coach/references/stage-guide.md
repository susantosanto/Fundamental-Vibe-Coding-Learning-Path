# Stage Guide — teach-build-coach

## Bagian A — Detail Tahap SIM-1 … SIM-7 (Mode BUILD-SIM)

Setiap tahap: tujuannya, file yang dihasilkan, contoh baik vs buruk.
Prinsip umum: **file kecil yang benar > dokumen besar yang menghibur.**

### SIM-1 CLARIFY → `BRIEF.md`
Isi minimal (5 baris): masalah, siapa pemakainya, 3 perilaku wajib,
1 angka sukses ("dipakai 50 user/dalam sehari"), batasan ("satu malam latihan").
- **Baik:** "URL shortener untuk latihan; 3 perilaku: pendekkan, redirect,
  hitung klik per link; sukses: 50 link/hari; batasan: tanpa login."
- **Buruk:** "Membangun platform manajemen link terintegrasi dengan analytics
  real-time multi-tenant" ← scope gajah; latihan harus semut.

### SIM-2 VISUALIZE → `MOCKUP.md` (ASCII ok)
Gambar 1–2 layar utama. Aturan dari Bab 27.3 #5: setuju gambar dulu, baru kode.
- **Baik:** 2 layar: form pendekkan + halaman redirect (tautan, hitungan).
- **Buruk:** 7 layar termasuk halaman admin, dark mode, i18n.

### SIM-3 DESIGN → `DECISIONS.md` (ADR mini)
Tabel ADR: keputusan / alasan / dampak / alternatif yang ditolak.
WAJIB ada minimal: (1) penyimpanan, (2) algoritma key, (3) satu keputusan
yang memakai ANGKA back-of-envelope (berapa row, berapa QPS kasar), dan
(4) baris "struktur data & algoritma utama + Big-O operasi terpanas"
(pola langkah 4 dari `/teach-dsa`; contoh: "lookup key = hash map O(1);
hitung klik per link = counter increment O(1); daftar terbaru = tail
append O(1)").
- **Baik:** "Key = base62 dari counter, 7 char → 62^7 ≈ 3,5 triliun kombinasi,
  cukup 10 tahun pada 50 link/hari. Ditolak: hash acak (butuh cek bentrok)."
- **Buruk:** "Pakai MongoDB karena modern." ← tanpa alasan = ADR palsu.

### SIM-4 PLAN → `BLUEPRINT.md`
3–6 task; tiap task: nama, file yang disentuh, mini-DoD (command yang membuktikan
selesai — pola Task Gate 27.4c versi ringan: `npm test` / `curl -I /health`).
- **Baik:** task 2: "endpoint redirect — uji: `curl -s localhost:3000/abc |
  grep 302` keluar kode redirect."
- **Buruk:** task: "implementasi backend lengkap" ← tak ada DoD, tak bisa diverifikasi.

### SIM-5 BUILD → kode + BUKTI
Satu task per putaran. Bukti = output nyata ditempel (Bab 12, Iron Law).
Setelah task 1: WAJIB commit kecil (pola commit-as-save-point).
- **Buruk yang khas:** "Selesai, semua jalan." → tanya balik: "Tempelkan output
  command DoD-nya." Kalau tidak ada = belum selesai.

### SIM-6 VERIFY → `ACCEPTANCE.md`
Checklist ringan: semua mini-DoD hijau? screenshot UI? error state dicoba?
Baru setelah ini boleh sentuh performa → `/teach-test-ladder` (mulai smoke).

### SIM-7 RETROSPEKTIF → LR
Pertanyaan wajib: "tahap mana yang kalau dilewati tadi bikin masalah nyata?"
Contoh jawaban yang diharapkan: "Waktu SIM-3 saya asal pilih penyimpanan,
SIM-5 jadi blokir saat cari klik per link" → kaitkan ke Bab 7 (kontrak file) +
ADR (Bab 7.4). Retrospektif tanpa kaitan materi = refleksi kosong.

### Checklist ringan pengganti security/deploy gate (versi latihan)
Skill produksi (`/security-dependency-auditor`, `/deploy-production-gate`)
TIDAK dipakai penuh di simulasi. Penggantinya, cek singkat di SIM-6:
```
□ Tidak ada secret/API key di kode (polos: cari "sk_live", "password =")
□ Input user tervalidasi di 1 endpoint utama (contoh: URL di-shorten valid)
□ .env ada di .gitignore
□ Aplikasi bisa dijalankan dari nol dengan SATU blok perintah (bootstrap mini,
  pola 27.4c ATURAN 2)
```
Cukup untuk membangun kebiasaan — bukan pengganti audit produksi.

---

## Bagian B — Daftar Konsep per Fase (Mode LEARN)

Urutan dalam fase = urutan mengajar yang disarankan. Satu konsep per sesi.

| Fase | Konsep (urut) | Analogi andalan |
|---|---|---|
| 1 | client-server; HTTP; DNS; latency vs throughput; scalability; CAP; SQL vs NoSQL; LB; CDN; cache dasar; queue dasar | kantor pos, buku telepon, kasir warung, etalase, antrean bank |
| 2 | TCP/UDP; REST; keamanan dasar; membaca studi kasus | telepon vs pos; menu restoran; kunci rumah |
| 3 | cache-aside vs write-through; TTL; LRU; invalidation; indexing; replication; read replica | etalase & kedaluwarsa; daftar isi buku; karyawan cabang |
| 4 | queue vs pub/sub; at-least-once; backpressure; dead letter | antrean tiket; pengeras suara; surat gagal kirim |
| 5 | bounded context; service decomposition; biaya microservices; monolith modular | departemen toko; satu bisnis vs franchise |
| 6 | structured log; RED metrics; tracing; retry; timeout; circuit breaker; bulkhead | CCTV; detak jantung; jejak paket; sekring; sekat kapal |
| 7 | 7-langkah desain; back-of-envelope; ADR | rencana bangunan; estimasi kasir; buku keputusan |
| 8 | WebSocket vs polling vs SSE; presence; urutan pesan; offline queue | telepon vs surat; lampu "sedang online"; nomor antrean |
| 9 | fan-out write vs read; ranking; timeline cache | sebar brosur vs tanya satpam; majalah personal |
| 10 | transcoding; CDN; rekomendasi; sharding video | studio film; gudang wilayah; rak per genre |
| 11 | tangga tes (6 tipe); SLO; capacity planning | uji beban jembatan; batas lift |
| 12 | format interview; menyusun narasi desain | presentasi ke investor |

Aturan analogi: analogi adalah JEMBATAN, bukan definisi. Selalu tutup dengan
"di mana analogi ini berhenti cocok?" — (etalase warung tidak punya TTL otomatis,
misalnya). Itu latihan abstraksi Level 2.

---

## Bagian C — Bukti yang Diterima / Ditolak (mode apa pun)

| Bukti | Status |
|---|---|
| Output command test/run yang ditempel | ✅ diterima |
| Screenshot halaman/state | ✅ diterima |
| Diagram yang digambar pembelajar (foto/ASCII) | ✅ diterima |
| "Sudah jalan kok" / "selesai" | ❌ ditolak — minta bukti |
| Log error + 4 pertanyaan gentle-teaching dijawab | ✅ diterima (gagal yang jujur = bukti belajar) |
| LR ditulis dengan kata-kata pembelajar sendiri | ✅ wajib penutup sesi |
