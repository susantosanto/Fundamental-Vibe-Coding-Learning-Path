---
name: teach-test-ladder
description: Mengajarkan performance testing sebagai tangga 6 tingkat (smoke, average-load, stress, spike, breakpoint, soak) berbasis dokumen resmi Grafana k6, dengan urutan aman (dilarang naik tingkat sebelum bawah hijau), pertanyaan pra-tes, bimbingan membaca hasil (p99 bukan average), dan latihan mengubah keputusan arsitektur berbasis angka. Gunakan saat pembelajar mau belajar stress/load testing, saat proyek latihan SIM-6/11 teach-build-coach butuh pengujian beban, atau saat pembelajar bilang "app-nya lambat, kenapa?".
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, zcode).
---

# Teach Test Ladder — Tangga Tes Performa untuk Pembelajar

Workflow Bab 27 tidak punya performance testing — skill ini menambalnya di
sisi belajar, memakai standar de facto industri: **Grafana k6** dan 6 tipe
load test dari dokumen resminya ("Types of load testing", Grafana Labs).

## Konsep Induk: Tangga 6 Tingkat (dengan analogi)

Analogi pembuka yang selalu dipakai: **uji kelayakan warung makan**.

| # | Tipe | Warung-nya seperti apa | Angka kasar | Durasi | Kapan dipakai |
|---|---|---|---|---|---|
| 1 | **Smoke** | Buka pintu, 3 pembeli masuk — pesanan jalan? | 1–5 VU, 1–3 menit | detik–menit | Setiap kali kode berubah; cek skrip & baseline |
| 2 | **Average-load** | Rush hour biasa, hari normal | beban rata-rata produksi | 5–60 menit | Sering — jaga performa di beban sehari-hari |
| 3 | **Stress** | Hari gajian, penuh terus di atas normal | 50–100%+ di atas rata-rata | 5–60 menit | Sebelum event/beban tinggi yang terjadwal |
| 4 | **Spike** | Selebgram posting warungmu — antrean melonjak dadakan | sangat tinggi, ramp-up nyaris instan | menit | Sebelum flash sale / rilis fitur viral |
| 5 | **Breakpoint** | Uji sampai dapur menyerah — di mana batasnya? | naik terus sampai gagal | sesuai kebutuhan | Beberapa kali, untuk tahu batas & remediasi |
| 6 | **Soak** | Warung buka 3 hari nonstop — tetap rapi? | beban rata-rata | jam–hari | Cek kebocoran memori, degradasi jangka panjang |

VU = virtual user. Sumber tabel: dokumen resmi Grafana "Types of load testing"
(6 tipe + rekomendasi durasi) — kutip file ini saat mengajar tabel.

## Aturan Aman Tangga (dari best practices resmi k6)

```
1. DILARANG naik tingkat sebelum tingkat bawah HIJAU.
   (resmi: "Only run stress tests after running average-load tests" —
   dan sebelum itu, smoke dulu)
2. Satu sesi = satu tingkat. Naik 2 tingkat = tidak tahu apa yang rusak.
3. Pola beban sederhana: ramp-up → plateau → ramp-down.
   DILARANG pola rollercoaster (resmi: membuat hasil sulit diinterpretasi).
4. Reuse skrip: tingkat naik = parameter naik, BUKAN skrip baru.
5. Hasil tanpa perbandingan (dengan run sebelumnya) = hasil setengah matang.
```

## Protokol Mengajar per Tingkat (pola 4 blok + praktik)

Tiap tingkat diajarkan dengan struktur yang sama (konsisten protokol
`/teach-clarifier` — pembelajar selalu tahu di mana dirinya):

```
❓ PRA-TES (kenapa + ekspektasi)
   "Sebelum jalan: menurutmu berapa QPS yang masih aman? Angka mana yang
    akan kamu lihat lebih dulu untuk tahu hasilnya bagus/buruk?"
   ← menulis EKSPEKTASI dulu; tes tanpa ekspektasi = basa-basi

🛠️ PRAKTIK (skrip k6 minimal — templates di references/k6-scenarios.md)
   Jalankan di proyek latihan PRAKTIK/ (Bab 27.9: larangan kontaminasi).
   K6 diinstal lokal; target = localhost — DILARANG menembak sistem
   yang bukan milik pembelajar.

📊 BACA HASIL (disiplin p99, bukan average)
   Urutan membaca: error rate → p95/p99 → throughput → lalu baru rata-rata.
   "Average menyembunyikan pengalaman terburuk; p99 menceritakan 1% user
   yang paling tersiksa — mereka juga pelanggan."

🧠 KEPUTUSAN (mengubah arsitektur dengan angka)
   "Hasil tadi: bottleneck di mana? Keputusan apa yang berubah karena
    ANGKA ini (bukan perasaan)? Tulis di DECISIONS.md sebagai ADR."
   ← inilah tujuan akhir: tes yang tidak mengubah keputusan = hiburan
```

## Peta Kapan Tiap Tingkat Dipakai di Workflow Belajar

| Posisi belajar | Tingkat yang wajib |
|---|---|
| Setiap task SIM-5 selesai (teach-build-coach) | Smoke (1 menit) — kebiasaan, bukan projek |
| SIM-6 (verify) di Fase 9 | Smoke + Average-load |
| Fase 11 (capacity) | Semua 6 tingkat, urutan tangga penuh |
| Sebelum demo/submit proyek latihan | Smoke + Spike (kalau demo ada lonjakan) |

## Baca Hasil: Pohon Keputusan Sederhana (mengajarkan diagnosis)

```
Error rate naik saat beban X
├─ error 5xx + log penuh "connection refused"   → kewalahan; naikkan
│   instance? cek saturation (CPU/mem/koneksi DB)
├─ error 5xx + log "timeout"                    → dependency lambat;
│   cek query lambat / API pihak ketiga (timeout & retry dipasang?)
└─ error 4xx naik                               → bukan masalah beban —
    masalah skrip tes / auth — perbaiki tes dulu

P95 bagus, P99 buruk (jejak ekor panjang)
→ biasanya: lock, GC pause, query tanpa index untuk data tertentu,
  cold cache. (Fase 3 & 6 materinya — sambungkan!)
```

Aturan keterhubungan materi: setiap temuan tangga tes WAJIB dikaitkan balik
ke fase materinya (cache → Fase 3; timeout/retry → Fase 6; index → Fase 3;
sharding/breakpoint → Fase 10). Tes = jembatan konsep → kenyataan.

## Batas Etika & Keamanan (keras, tanpa kecuali)

```
- Hanya uji sistem milik sendiri / localhost / lingkungan latihan.
- DILARANG load test API pihak ketiga, prod nyata, atau milik orang lain
  (itu bukan latihan — itu serangan; Bab 13 tentang etika keamanan).
- Jaga sumber daya mesin latihan (VU berlebihan membunuh laptop sendiri).
- Data tes = data palsu; jangan pernah pakai data user sungguhan.
```

## Anti-Pattern

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Langsung stress test karena "seru" | Tangga: smoke dulu; stress sebelum load = hasil tak bisa dipercaya |
| Merayakan average cepat | Cek p99 dulu; ekor panjang = pengalaman buruk nyata |
| Menembak 5000 VU dari laptop kentang | Mulai kecil; tahu batas generator beban sendiri |
| Hasil dianggap "hijau = selesai" | Bandingkan dengan run sebelumnya + catat keputusan/ADR |
| Skrip tes dibuat sekali lalu dikubur | Simpan di `tests/k6/` proyek latihan; jalankan ulang tiap perubahan besar |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Load test sistem PRODUKSI nyata | Pakai skill ini | Pipeline Bab 27 + tooling produksi, dengan izin eksplisit pemilik sistem |
| Profiling kode mendalam (bukan beban) | Pakai skill ini | Materi Fase 3 (index) + tooling profiling framework terkait |
| CI performance gate otomatis | Pakai skill ini | Itu ranah produksi (`ci-cd-and-automation` addyosmani); latihan cukup skrip manual |

## Next Step

- Tingkat 1–2 lulus + keputusan tercatat → lanjut tingkat 3–4 (sesi terpisah)
- Temuan bottleneck konsep baru → `/teach-build-coach` mode LEARN (fase terkait)
- Tangga penuh lulus (Fase 11) → `/teach-case-study` mode PEWAWANCARA (Fase 12)

## Materi Reference (WAJIB)

- Dokumen resmi: Grafana Labs "Types of load testing" (6 tipe, urutan, best
  practices) + dokumentasi k6 `grafana.com/docs/k6/` (opsi skenario)
- Workflow induk: Bab 27.3 Tahap 6, Bab 22 (production-ready), Bab 13 (keamanan)
- Proyek latihan: `references/k6-scenarios.md` (skrip siap pakai per tingkat)

Kutip sumber saat mengajar tabel/aturan. Jika ragu: baca dulu, baru bertindak.
