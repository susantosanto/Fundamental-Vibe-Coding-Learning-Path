# Roadmap 12 Fase — Belajar Arsitektur Desain Sistem Aplikasi

> Total durasi realistis: **12–18 bulan** dengan 1 jam per hari (±6–8 jam/minggu).
> Kepemilikan materi repo: fase-0 … fase-4 (+ fase-5/6 untuk tooling).
> Sumber resmi: `donnemartin/system-design-primer`, `ashishps1/awesome-system-design-resources`,
> dokumen resmi Grafana k6.

**Aturan gerbang:** fase berikutnya dibuka HANYA setelah checkpoint fase aktif
lulus (dijalankan `/teach-clarifier` Jenis C). Gagal checkpoint = jadwal ulang
sebagian materi, BUKAN lanjut. Quiz/checkpoint adalah gerbang, bukan formalitas.

---

## LEVEL 1 — FONDASI (Fase 1–2) · 6–8 minggu

> Target level: bisa MENJELASKAN konsep inti dengan kata sendiri.
> Kegagalan umum level ini: hafal istilah tapi tidak bisa ceritakan alurnya.

### Fase 1 — Konsep Inti & Komponen Dasar (±4 minggu)

| Minggu | Materi | File rujukan repo |
|---|---|---|
| 1 | Apa itu system design; scalability vs performance; latency vs throughput | `fase-1-arsitektur-dasar/01…03` |
| 2 | Availability vs consistency (CAP); pola konsistensi data | `fase-1/04–05` |
| 3 | DNS, CDN, Load Balancer, Reverse Proxy | `fase-1/07–10` |
| 4 | SQL vs NoSQL; cache; asynchronism (queue) | `fase-1/12–15` |

**Praktik fase:** gambar ulang alur `ketik URL → halaman muncul` dari ingatan,
lengkap komponen; tulis 5 kalimat "kenapa" untuk tiap komponen.
**Checkpoint lulus:** jelaskan 3 dari 4 topik berikut TANPA membaca, dengan
analogi sendiri: CAP, load balancer, cache hit/miss, SQL vs NoSQL.

### Fase 2 — Komunikasi, Keamanan, Studi Kasus Mini (±3 minggu)

| Minggu | Materi | File rujukan repo |
|---|---|---|
| 5 | Protokol komunikasi (TCP/UDP, RPC, REST); keamanan dasar | `fase-1/16–17` |
| 6 | Studi kasus: URL shortener (Pastebin/Bit.ly) + Twitter timeline | `fase-1/18–19` |
| 7 | Review + latihan final | `fase-1/21` |

**Praktik fase:** rancang URL shortener di kertas: estimasi data, endpoint,
model data, alur redirect. Tidak perlu kode.
**Checkpoint lulus:** back-of-envelope sederhana (berapa row/tahun, berapa
QPS baca kasar) + bisa membenarkan kenapa hash pendek dan bukan UUID panjang.

---

## LEVEL 2 — KOMPONEN & TRADE-OFF (Fase 3–6) · 3–4 bulan

> Target level: setiap pilihan komponen DISERTAI trade-off dan kondisi kapan
> pilihan itu salah. Jawaban tanpa trade-off = belum lulus.

### Fase 3 — Caching & Database Lanjut (±4 minggu)

Cache strategy (LRU, TTL, cache invalidation), indexing, replication,
read replicas. Rujukan: `fase-1/14`, `fase-4/03, 06` + system-design-primer.
**Praktik:** beri tanda di sebuah aplikasi nyata: query mana layak cache,
mana TIDAK layak, dan kenapa.
**Checkpoint:** soal C-F3 (question-bank) + pilih cache-aside vs write-through
untuk 2 skenario berbeda dengan alasan.

### Fase 4 — Message Queue & Async Pattern (±3 minggu)

Queue vs pub/sub, at-least-once vs exactly-once, backpressure, dead letter.
Rujukan: `fase-1/15`, `fase-4/04` + primer.
**Praktik:** gambar alur checkout e-commerce: mana yang harus synchronous,
mana boleh antre, apa yang terjadi kalau consumer mati.
**Checkpoint:** jelaskan kenapa "kirim email saat checkout" wajib lewat queue,
dan apa risiko duplicate delivery + solusinya.

### Fase 5 — Monolith vs Microservices (±4 minggu)

Service decomposition, bounded context, kapan microservices JUSTRU bikin susah.
Rujukan: `fase-4/01–02`, `fase-1/11`.
**Praktik:** pecah satu aplikasi fiktif 3-modul menjadi layanan; lalu TULIS
kenapa untuk 3 orang tim, monolith modular sering lebih benar.
**Checkpoint:** soal C-F5 + sebut 3 biaya tersembunyi microservices.

### Fase 6 — Observability & Resilience Dasar (±3 minggu)

Structured logging, metrics (RED), tracing dasar; retry, timeout, circuit
breaker, bulkhead. Rujukan: `fase-4/07`, Bab 22 + skill observability
(`skills-vendor/observability-and-instrumentation/SKILL.md` — baca untuk pola,
bukan untuk dipasang di latihan).
**Praktik:** tulis "pertanyaan on-call" untuk 3 fitur fiktif; tentukan alert
symptom-based-nya.
**Checkpoint:** dari 3 gejala (lambat, error 500, data hilang), tentukan
log/metric/trace mana yang kamu buka lebih dulu dan kenapa.

---

## LEVEL 3 — RANCANG END-TO-END (Fase 7–9) · 4–6 bulan

> Target level: bisa menghasilkan desain lengkap dari brief kosong —
> requirement → estimasi → high-level → deep dive → trade-off — lalu MENEGERIMYA
> dengan pipeline Architect-Builder (Bab 27) di proyek latihan.

### Fase 7 — Metode Desain + Proyek Latihan Pertama (±6 minggu)

Kerangka 7 langkah (functional req → NFR → estimasi → data model → high-level
→ deep dive → trade-off) dari `learning-system-design/SKILL.md` §Framework.
**Praktik utama:** proyek latihan PERTAMA dengan `/teach-build-coach` mode
BUILD-SIM: rancang + bangun **URL shortener dengan analytics** end-to-end —
jalankan Tahap 2–6 Bab 27 di workspace PRAKTIK/ (disederhanakan, tetap
berbukti: test output + screenshot).
**Checkpoint:** pack ringkas (goal, blueprint, 3 acceptance) + desain lolos
kritik trade-off dari `/teach-case-study` (sesi koreksi).

### Fase 8 — Proyek Latihan Kedua: Sistem Chat (±6 minggu)

Real-time (WebSocket vs polling vs SSE), presence, pesan offline, media,
enkripsi. Rujukan: `fase-4/08` (Twitter-scale sebagai pembanding) + sumber
chat/WhatsApp di RESOURCES.md (repo belum punya file khusus chat).
**Praktik:** BUILD-SIM kedua — chat app mini (1 room, offline queue, unread).
**Checkpoint:** jelaskan pilihan transport + cara menjamin urutan pesan +
apa yang rusak saat 10.000 user satu room (dan mitigasinya).

### Fase 9 — Proyek Latihan Ketiga: News Feed (±6 minggu)

Fan-out on write vs on read, ranking sederhana, cache timeline.
Rujukan: `fase-1/19`, `fase-4/08`, awesome-system-design-resources.
**Praktik:** BUILD-SIM ketiga — feed sederhana + tepi performa diuji dengan
`/teach-test-ladder` (smoke + load).
**Checkpoint:** bandingkan fan-out write vs read untuk 1.000 follower vs
1.000.000 follower, lengkap perhitungan kasar.

---

## LEVEL 4 — MAHIR (Fase 10–12) · 4–6 bulan

> Target level: arsitektur skala besar, kegagalan sistem, produksi, dan
> siap interview system design.

### Fase 10 — Skala Besar: Video & Streaming (±6 minggu)

Upload/transcode/CDN, rekomendasi, arsitektur YouTube/Netflix.
Rujukan: `fase-4/08–09`.
**Praktik:** desain penuh "YouTube mini" di kertas — TANPA build; fokus di
deep-dive 2 komponen pilihan sendiri.
**Checkpoint:** pertahankan desain melawan 5 pertanyaan penggali
(`/teach-case-study` mode ganda-penyengat).

### Fase 11 — Produksi & Kapasitas (±5 minggu)

Tangga tes penuh (`/teach-test-ladder`): smoke → load → stress → spike →
breakpoint → soak; capacity planning, cost thinking, SLO/SLA.
Rujukan: dokumen resmi k6 + `fase-4/10`, Bab 22.
**Praktik:** jalankan tangga tes nyata pada proyek Fase 9; tulis kesimpulan
kapasitas ("sistem ini aman sampai X QPS, karena Y").
**Checkpoint:** hasil tangga tes + 1 keputusan arsitektur yang BERUBAH
karena angka tes (bukan perasaan).

### Fase 12 — Interview Simulasi & Sintesis (±5 minggu)

Format interview system design (45 menit: klarifikasi → desain → deep dive →
trade-off); menggabungkan semua level. Rujukan: awesome-system-design-resources
§interview; `fase-4/11` (ringkasan).
**Praktik:** 4 sesi simulasi: URL shortener (15 menit), chat (30), feed (40),
ride-sharing (45) — didampingi `/teach-case-study` sebagai pewawancara.
**Checkpoint akhir:** pembelajar memimpin sendiri satu sesi desain untuk
teman/audiens nyata; LR penutup + peta perjalanan 12 fase yang sudah ditempuh.

---

## Jalur Ringkas (untuk kondisi waktu terbatas — JUJUR soal konsekuensi)

Untuk pembelajar dengan < 3 jam/minggu, JANGAN jalankan 12 fase penuh —
pakai jalur ringkas dan katakan terus terang apa yang dikorbankan:

```
Jalur ringkas (±4 bulan):
  Fase 1 (minggu 1–3 saja) → Fase 2 studi kasus URL shortener →
  Fase 3 cache → Fase 5 monolith vs microservices → Fase 7 (metode +
  desain kertas saja, tanpa build) → Fase 12 (format interview 30 menit)
Korban yang jujur: tidak ada praktik build nyata, observability dangkal,
  tangga tes hanya teori → cukup untuk literasi & interview dasar,
  TIDAK cukup untuk merancang sistem produksi sendiri.
```

Pembelajar WAJIB diberi tahu korban ini SEBELUM memilih jalur ringkas.

---

## Checkpoint vs Sesi: yang mana kapan

| Kegiatan | Frekuensi | Pemilik skill |
|---|---|---|
| Sesi konsep (baca → jelaskan balik → latihan mini → LR) | 1 jam × 5–6×/minggu | `/teach-build-coach` mode LEARN |
| Review mingguan tanpa membaca (retrieval) | 15 menit × 1×/minggu | `/teach-system-design` |
| Checkpoint fase | akhir tiap fase | `/teach-clarifier` Jenis C |
| Studi kasus arsitektur nyata | 1× per fase (di atas) | `/teach-case-study` |
| Tangga tes | Fase 9 (parsial) + Fase 11 (penuh) | `/teach-test-ladder` |
