# k6 Scenarios — Skrip Siap Pakai per Tingkat Tangga

Semua skrip: JavaScript, jalan dengan `k6 run <file>`. Target contoh
`http://localhost:3000` — GANTI dengan endpoint proyek latihan sendiri.

**Instal k6 (dokumen resmi grafana.com/docs/k6):**
```bash
# Windows: choco install k6   |   macOS: brew install k6
# Linux (deb): sudo apt install k6  (repo grafana) — lihat docs untuk detail
```

**Struktur folder proyek latihan:**
```
PRAKTIK/<proyek>/tests/k6/
├── smoke.js  load.js  stress.js  spike.js  breakpoint.js  soak.js
└── HASIL.md  ← catat tiap run: tanggal, konfig, p95/p99, error, keputusan
```

---

## 1 — Smoke (`smoke.js`)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2,              // sangat kecil — ini bukan tes beban
  duration: '30s',
  thresholds: {        // gerbang gagal/lulus otomatis
    http_req_failed: ['rate<0.01'],       // error < 1%
    http_req_duration: ['p(95)<800'],     // p95 < 800ms
  },
};

export default function () {
  const res = http.get('http://localhost:3000/health');
  check(res, { 'health ok': (r) => r.status === 200 });
  sleep(1);
}
```
**Pelajaran:** thresholds = definisi "hijau" yang tertulis — pola yang sama
dengan Task Gate 27.4c (command membuktikan, bukan klaim).

## 2 — Average-load (`load.js`)

```javascript
export const options = {
  stages: [
    { duration: '2m',  target: 20 },  // ramp-up
    { duration: '10m', target: 20 },  // plateau — di sinilah data bagus
    { duration: '1m',  target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_failed:    ['rate<0.01'],
    http_req_duration:  ['p(95)<800'],
  },
};
// default function sama seperti smoke — GANTI skripnya, JANGAN pola skripnya
```
**Pelajaran:** 20 VU ≈ beban sehari-hari proyek latihan (sesuaikan dengan
back-of-envelope SIM-3). Pola wajib: ramp-up → plateau → ramp-down (resmi k6).

## 3 — Stress (`stress.js`)

```javascript
export const options = {
  stages: [
    { duration: '2m',  target: 40 },  // ~2x rata-rata
    { duration: '8m',  target: 40 },  // tahan di atas normal
    { duration: '1m',  target: 0 },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.05'],  // toleransi lebih longgar TERTULIS
    http_req_duration: ['p(95)<1500'],
  },
};
```
**Pelajaran:** stress = beban di atas rata-rata (resmi: 50–100%+, sesuai
pola risiko sistemmu). Yang dinilai: berapa degradasinya & apakah pulih.

## 4 — Spike (`spike.js`)

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 100 }, // lonjakan NYARIS instan
    { duration: '2m',  target: 100 },
    { duration: '10s', target: 20 },  // balik turun cepat juga
    { duration: '2m',  target: 20 },
  ],
};
```
**Pelajaran:** flash sale = ramp-up nyaris 0 detik. Yang diuji: sistem
SELAMAT & pulih, bukan tetap cepat (degradasi boleh, mati tidak).

## 5 — Breakpoint (`breakpoint.js`)

```javascript
import { Counter } from 'k6/metrics';
const failures = new Counter('failures');

export const options = {
  executor: 'ramping-arrival-rate',   // naikkan TINGKAT REQUEST, bukan VU
  startRate: 10,
  timeUnit: '1s',
  preAllocatedVUs: 50,
  maxVUs: 200,
  stages: [
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 400 },  // terus naik sampai thresholds gagal
  ],
  thresholds: { http_req_failed: [{ threshold: 'rate<0.1', abortOnFail: true }] },
};
```
**Pelajaran:** breakpoint = tahu BATAS (resmi: capacity/limit testing).
Output penting: angka QPS terakhir yang masih hijau → tulis di HASIL.md
("sistem aman sampai ±X QPS karena Y").

## 6 — Soak (`soak.js`)

```javascript
export const options = {
  vus: 15,
  duration: '30m',   // di dunia nyata: 4–24 jam; latihan cukup 30–60 menit
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};
```
**Pelajaran:** beban rata-rata × durasi panjang. Yang diburu: kebocoran
memori (mem naik terus), koneksi yang tidak pulih, degradasi p99 seiring
waktu. Matikan dengan aman (Ctrl+C) kalau mesin latihan tertekan.

---

## Checklist Membaca Hasil (urutan wajib)

```
□ 1. error rate — di bawah threshold?
□ 2. p95 & p99 — lihat ECODING ekor: p99 << p95? ekor panjang = ada yang asing
□ 3. throughput (req/s) — sesuai ekspektasi pra-tes?
□ 4. baru lihat average (dan mengapa ia paling jarang menceritakan masalah)
□ 5. bandingkan dengan run sebelumnya di HASIL.md — naik/turun berapa?
□ 6. satu keputusan (ADR) berubah atau dipertahankan — tertulis?
```

## Template HASIL.md (isi tiap run)

```markdown
## Run #<n> — <tingkat tangga> — <tanggal>
Konfig: <VU/stages> · Skrip: <nama file>
Ekspektasi pra-tes: <angka yang kira-kira aman>
Hasil: error <x%> · p95 <ms> · p99 <ms> · throughput <rps>
Banding run sebelumnya: <sama lebih cepat/lambat, delta>
Keputusan (ADR): <dipertahankan / berubah: kenapa — rujuk DECISIONS.md>
```

## Angka Panduan Awal (orde besaran, bukan hukum)

| Konteks | p95 "enak" |
|---|---|
| Endpoint internal/dev | < 500 ms |
| Halaman utama user-facing | < 1 s |
| API dengan dependency eksternal | < 1.5 s |
| Redirect URL shortener | < 50 ms (CS-1) |

Sumber belajar resmi: grafana.com/load-testing/types-of-load-testing (tabel
6 tipe + durasi) dan grafana.com/docs/k6 (sintaks executor & thresholds).
Angka panduan = heuristik umum industri; yang benar = SLO yang KAMU tulis
untuk proyekmu sendiri (Fase 11).
