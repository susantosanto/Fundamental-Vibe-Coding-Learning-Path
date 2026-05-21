# 04 — Testing & Debugging Lanjutan

> **Estimasi:** 2.5 jam | **Level:** Menengah-Lanjut
> **Referensi:** [awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Testing and Debugging

---

## 📖 TEORI

### 1. Property-Based Testing

Property-based testing berbeda dari example-based testing. Alih-alih menulis test case satu per satu, Anda mendefinisikan **properti** yang harus selalu benar, lalu framework generate ratusan input otomatis.

#### Konsep Dasar

```
Example-based testing (yang biasa kita lakukan):
assert hitung_rata_rata([80, 90, 100]) == 90
assert hitung_rata_rata([50]) == 50

Property-based testing (yang AI bisa bantu generate):
"Untuk SEMUA list angka positif, rata-rata harus:
 1. Selalu >= nilai minimum
 2. Selalu <= nilai maksimum
 3. Selalu berada di antara min dan max"
```

#### Implementasi dengan Hypothesis (Python)

```python
# test_absensi.py
from hypothesis import given, strategies as st
from datetime import date

# Property 1: Rata-rata selalu di antara min dan max
@given(st.lists(st.integers(min_value=0, max_value=100), min_size=1))
def test_rata_rata_antara_min_max(nilai_list):
    rata_rata = sum(nilai_list) / len(nilai_list)
    assert min(nilai_list) <= rata_rata <= max(nilai_list)

# Property 2: Rata-rata list dengan semua nilai sama = nilai tersebut
@given(st.integers(min_value=0, max_value=100), st.integers(min_value=1, max_value=50))
def test_rata_rata_nilai_seragam(nilai, jumlah):
    nilai_list = [nilai] * jumlah
    rata_rata = sum(nilai_list) / len(nilai_list)
    assert rata_rata == nilai

# Property 3: Menambah nilai di atas rata-rata → rata-rata naik
@given(st.lists(st.integers(min_value=0, max_value=100), min_size=1),
       st.integers(min_value=0, max_value=100))
def test_tambah_nilai_tinggi_naikkan_rata_rata(nilai_list, nilai_baru):
    rata_lama = sum(nilai_list) / len(nilai_list)
    nilai_baru_list = nilai_list + [nilai_baru]
    rata_baru = sum(nilai_baru_list) / len(nilai_baru_list)
    if nilai_baru > rata_lama:
        assert rata_baru > rata_lama

# Property 4: Status absensi valid
@given(st.text(min_size=1, max_size=1))
def test_status_absensi_valid(status):
    valid_statuses = {'H', 'S', 'I', 'A'}
    is_valid = status in valid_statuses
    # Fungsi validasi harus konsisten dengan set valid
    from absensi import is_status_valid
    assert is_status_valid(status) == is_valid
```

#### Property-Based Testing untuk API

```python
# test_api_properties.py
from hypothesis import given, settings
from hypothesis import strategies as st
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Property: POST absensi selalu return success atau error yang jelas
@given(
    st.dates(min_value=date(2026, 1, 1), max_value=date(2026, 12, 31)),
    st.text(min_size=1, max_size=10),
    st.lists(
        st.dictionaries(
            keys=st.sampled_from(['nisn', 'status']),
            values=st.text(min_size=1, max_size=20)
        ),
        min_size=1,
        max_size=50
    )
)
@settings(max_examples=100)
def test_post_absensi_response_consistent(tanggal, kelas, data):
    response = client.post("/api/absensi", json={
        "tanggal": str(tanggal),
        "kelas": kelas,
        "data": data
    })
    # Property: Response selalu punya field 'success' (boolean)
    assert "success" in response.json()
    assert isinstance(response.json()["success"], bool)
    # Property: Jika success=False, harus ada field 'error'
    if not response.json()["success"]:
        assert "error" in response.json()
```

#### Kapan Pakai Property-Based Testing?

```
✅ Gunakan property-based testing untuk:
- Fungsi matematika/kalkulasi (rata-rata, total, persentase)
- Validasi input (format email, NISN, tanggal)
- Fungsi transformasi data (sort, filter, map)
- Fungsi yang harus konsisten (encode → decode = original)
- API response structure (selalu punya field tertentu)

❌ Jangan pakai untuk:
- UI testing (visual, layout)
- Integration testing dengan external service
- Testing yang butuh setup kompleks per test case
```

#### AI Prompt untuk Generate Property Tests

```
Prompt:

"Saya punya fungsi berikut:

def hitung_persentase_kehadiran(hadir: int, total_hari: int) -> float:
    '''Hitung persentase kehadiran siswa.'''
    if total_hari <= 0:
        raise ValueError('Total hari harus > 0')
    if hadir < 0 or hadir > total_hari:
        raise ValueError('Jumlah hadir tidak valid')
    return (hadir / total_hari) * 100

Buat property-based tests dengan Hypothesis. Identifikasi properties:
1. Invariants (yang selalu benar)
2. Edge cases yang harus di-handle
3. Boundary conditions
4. Error conditions

Untuk setiap property, jelaskan MENGAPA property itu harus benar."
```

---

### 2. Mutation Testing

Mutation testing menguji **kualitas test Anda sendiri**. Caranya: buat perubahan kecil (mutasi) di kode produksi, lalu cek apakah test Anda gagal. Jika test TIDAK gagal, berarti test Anda tidak cukup baik.

#### Konsep

```
Kode asli:
def lulus(nilai):
    return nilai >= 75

Test biasa:
assert lulus(80) == True   # ✅ Pass
assert lulus(70) == False  # ✅ Pass

Mutasi 1: Ubah >= menjadi >
def lulus(nilai):
    return nilai > 75  # ← Mutasi!

Test biasa:
assert lulus(80) == True   # ✅ Masih pass (test tidak catch mutasi!)
assert lulus(70) == False  # ✅ Masih pass

→ Mutasi SURVIVE = test tidak cukup baik!
→ Perlu test: assert lulus(75) == True (boundary test)
```

#### Implementasi dengan Cosmic Ray (Python)

```bash
# Install
pip install cosmic-ray

# Jalankan mutation testing
cosmic-ray init config.toml
cosmic-ray exec config.toml
cosmic-ray report config.toml
```

```toml
# config.toml
[cosmic-ray]
module-path = "src/absensi.py"
test-runner = "pytest tests/"
excluded-modules = ["tests/*"]
timeout = 10.0
```

#### Implementasi dengan Mutmut (Python)

```bash
pip install mutmut

# Jalankan
mutmut run --paths-to-mutate src/absensi.py

# Lihat mutants yang survive (test tidak catch)
mutmut results

# Generate test untuk mutant yang survive
mutmut apply 1  # Apply mutant #1 untuk lihat apa yang berubah
```

#### Contoh Output Mutmut

```
mutmut results

To apply a mutant on disk:
    mutmut apply <id>

Survived 🧬 (3):
  src/absensi.py:15  (changed >= to >)
  src/absensi.py:22  (changed + to -)
  src/absensi.py:30  (changed and to or)

Killed ✅ (15):
  src/absensi.py:5   (changed == to !=)
  src/absensi.py:8   (changed < to <=)
  ...

Mutation Score: 83% (15/18 mutants killed)
```

#### AI Prompt untuk Fix Surviving Mutants

```
Prompt:

"Mutation testing menemukan 3 surviving mutants:

1. src/absensi.py:15 — Mutasi: >= menjadi >
   Kode asli: if nilai >= 75: return True
   Mutan:     if nilai > 75: return True
   Test saat ini tidak fail karena tidak ada test untuk nilai=75

2. src/absensi.py:22 — Mutasi: + menjadi -
   Kode asli: total = hadir + sakit
   Mutan:     total = hadir - sakit

3. src/absensi.py:30 — Mutasi: and menjadi or
   Kode asli: if valid_format and valid_range:
   Mutan:     if valid_format or valid_range:

Buat test cases yang bisa kill semua surviving mutants ini."
```

---

### 3. Performance Testing

Performance testing mengukur kecepatan, resource usage, dan scalability aplikasi.

#### Load Testing dengan Locust

```python
# locustfile.py — Load test untuk API absensi
from locust import HttpUser, task, between
import random

class AbsensiUser(HttpUser):
    wait_time = between(1, 3)  # Tunggu 1-3 detik antar request

    @task(3)  # 3x lebih sering daripada task lain
    def get_rekap(self):
        kelas = random.choice(["6A", "6B", "5A", "5B", "4A"])
        bulan = random.randint(1, 12)
        tahun = 2026
        self.client.get(
            f"/api/absensi/rekap?kelas={kelas}&bulan={bulan}&tahun={tahun}"
        )

    @task(1)
    def post_absensi(self):
        data = {
            "tanggal": "2026-05-21",
            "kelas": "6A",
            "data": [
                {"nisn": f"00{i:08d}", "status": random.choice(["H", "S", "I", "A"])}
                for i in range(1, 31)
            ]
        }
        self.client.post("/api/absensi", json=data)

    @task(1)
    def get_siswa(self):
        kelas = random.choice(["6A", "6B", "5A"])
        self.client.get(f"/api/siswa?kelas={kelas}")
```

```bash
# Jalankan Locust
locust -f locustfile.py --host=http://localhost:8000

# Web UI: http://localhost:8089
# Set: 50 users, spawn rate 5 users/sec

# Headless mode (untuk CI/CD)
locust -f locustfile.py --headless -u 100 -r 10 --run-time 5m --host=http://localhost:8000
```

#### Performance Testing dengan pytest-benchmark

```python
# test_performance.py
import pytest
from absensi import hitung_rekap_kehadiran, generate_laporan

def test_benchmark_hitung_rekap(benchmark):
    # Simulasi data 200 siswa x 20 hari
    data = {
        f"siswa_{i}": {
            f"2026-05-{j:02d}": "H" if j % 3 != 0 else "A"
            for j in range(1, 21)
        }
        for i in range(200)
    }

    result = benchmark(hitung_rekap_kehadiran, data)

    # Assert hasil benar
    assert len(result) == 200
    # Benchmark otomatis ukur: min, max, mean, median, stddev

def test_benchmark_generate_laporan(benchmark):
    data_rekap = {
        "siswa": [{"nama": f"Siswa {i}", "hadir": 18, "alpha": 2} for i in range(200)],
        "total_hari": 20
    }

    result = benchmark(generate_laporan, data_rekap)

    assert "tabel" in result
    assert len(result["tabel"]) == 200
```

```bash
# Jalankan benchmark
pytest test_performance.py --benchmark-only --benchmark-save=absensi

# Bandingkan dengan hasil sebelumnya
pytest test_performance.py --benchmark-compare=absensi
```

#### AI Prompt untuk Performance Testing

```
Prompt:

"Saya punya API endpoint GET /api/absensi/rekap yang query database SQLite
dengan 200 siswa dan 20 hari data absensi.

Buat performance test plan yang mencakup:
1. Baseline: Response time untuk 1 user
2. Load test: Response time untuk 10, 50, 100 concurrent users
3. Stress test: Titik di mana response time > 1 detik
4. Endurance test: Jalankan 100 users selama 30 menit, cek memory leak

Untuk setiap test, tentukan:
- Tool yang dipakai
- Metric yang diukur
- Acceptance criteria
- Cara interpretasi hasil"
```

---

### 4. Load Testing dengan AI

AI bisa membantu merancang, menjalankan, dan menganalisis load test.

#### AI-Generated Load Test Script

```
Prompt:

"Buat load test script untuk sistem absensi sekolah dengan skenario:

Konteks:
- 15 guru akan input absensi bersamaan jam 7:00-7:30 pagi
- Setiap guru input 30 siswa (1 kelas)
- Target: Semua request selesai dalam < 2 detik
- Database: SQLite di Railway free tier

Buat script k6 (JavaScript) yang:
1. Simulasi 15 virtual users
2. Setiap user: login → pilih kelas → input absensi → logout
3. Ramp up: 5 users per detik
4. Duration: 10 menit
5. Collect metrics: response time, error rate, throughput

Sertakan juga threshold yang harus dipenuhi."
```

#### k6 Load Test Script (AI Generated)

```javascript
// load_test_absensi.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 5 },   // Ramp up ke 5 users
    { duration: '1m', target: 15 },   // Ramp up ke 15 users (simulasi guru)
    { duration: '3m', target: 15 },   // Hold di 15 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% request < 2 detik
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
    errors: ['rate<0.05'],              // Custom error rate < 5%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

const kelas_list = ['6A', '6B', '5A', '5B', '4A', '4B', '3A', '3B', '2A', '2B', '1A', '1B'];

export default function () {
  // 1. Login
  const loginRes = http.post(`${BASE_URL}/api/login`, {
    username: `guru${__VU}`,
    password: 'password123',
  });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login has token': (r) => JSON.parse(r.body).token !== undefined,
  }) || errorRate.add(1);

  const token = JSON.parse(loginRes.body).token;
  const headers = { Authorization: `Bearer ${token}` };

  sleep(1);

  // 2. Pilih kelas (round-robin berdasarkan VU)
  const kelas = kelas_list[(__VU - 1) % kelas_list.length];

  // 3. Get daftar siswa
  const siswaRes = http.get(`${BASE_URL}/api/siswa?kelas=${kelas}`, { headers });

  check(siswaRes, {
    'get siswa status 200': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(1);

  // 4. Input absensi
  const absensiData = JSON.parse(siswaRes.body).siswa.map(s => ({
    nisn: s.nisn,
    status: ['H', 'H', 'H', 'S', 'I'][Math.floor(Math.random() * 5)],
  }));

  const absensiRes = http.post(`${BASE_URL}/api/absensi`, {
    tanggal: '2026-05-21',
    kelas: kelas,
    data: absensiData,
  }, { headers });

  check(absensiRes, {
    'post absensi status 200': (r) => r.status === 200,
    'absensi success': (r) => JSON.parse(r.body).success === true,
  }) || errorRate.add(1);

  sleep(2);
}
```

```bash
# Jalankan k6
k6 run load_test_absensi.js

# Dengan cloud reporting
k6 run --out cloud load_test_absensi.js
```

#### AI Analysis Load Test Results

```
Prompt:

"Berikut hasil load test k6 untuk API absensi:

     █ login
       ✓ login status 200

     █ get siswa
       ✓ get siswa status 200

     █ post absensi
       ✓ post absensi status 200
       ✗ absensi success        ✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓  94%

     checks.....................: 94.66%  ✓ 3486       ✗ 198
     data_received..............: 2.1 MB  35 kB/s
     data_sent..................: 1.8 MB  30 kB/s
     http_req_duration..........: avg=1.2s   min=200ms  med=800ms  p(90)=2.1s  p(95)=2.8s
     http_req_failed............: 5.33%   ✓ 198        ✗ 3516
     iterations.................: 1200    20/s
     vus........................: 15      min=15       max=15

     ✗ http_req_duration........: p(95)=2800ms threshold violated (target: <2000ms)

Analisis:
1. Apa bottleneck-nya?
2. Apa yang harus dioptimasi dulu?
3. Berapa estimasi improvement setelah optimasi?
4. Apakah perlu scale up server atau optimasi kode?"
```

---

### 5. Security Testing

Security testing untuk memastikan aplikasi aman dari vulnerability umum.

#### OWASP Top 10 Testing Checklist

```markdown
## Security Testing Checklist — Aplikasi Sekolah

### 1. Injection (SQL, Command)
- [ ] Semua query pakai parameterized query (bukan string concatenation)
- [ ] Input user di-sanitize sebelum diproses
- [ ] Tidak ada os.system() atau eval() dengan input user

### 2. Broken Authentication
- [ ] Password di-hash dengan bcrypt/argon2 (bukan MD5/SHA1)
- [ ] Session timeout setelah 30 menit inactivity
- [ ] Brute force protection (max 5 percobaan login)

### 3. Sensitive Data Exposure
- [ ] Tidak ada password/API key di source code
- [ ] Database file tidak accessible dari web
- [ ] HTTPS enforced di production

### 4. XML External Entities (XXE)
- [ ] Tidak parse XML dari user input (atau disable external entities)

### 5. Broken Access Control
- [ ] Guru hanya bisa akses kelas sendiri
- [ ] Operator bisa akses semua kelas
- [ ] IDOR prevention (tidak bisa akses data orang lain via ID manipulation)

### 6. Security Misconfiguration
- [ ] Debug mode OFF di production
- [ ] Default password sudah diganti
- [ ] HTTP headers security sudah di-set

### 7. Cross-Site Scripting (XSS)
- [ ] Output di-escape di template
- [ ] Content-Security-Policy header
- [ ] Input validation untuk semua form

### 8. Insecure Deserialization
- [ ] Tidak deserialize data dari user tanpa validation

### 9. Using Components with Known Vulnerabilities
- [ ] Dependencies sudah di-update
- [ ] Security audit dengan `pip audit` atau `npm audit`

### 10. Insufficient Logging & Monitoring
- [ ] Login attempt di-log (sukses dan gagal)
- [ ] Data modification di-log
- [ ] Alert untuk suspicious activity
```

#### Automated Security Testing dengan Bandit (Python)

```bash
# Install
pip install bandit

# Scan seluruh project
bandit -r src/ -f html -o security_report.html

# Scan dengan severity filter
bandit -r src/ -ll  # High severity only

# CI/CD integration
bandit -r src/ --exit-zero  # Jangan fail CI, tapi report
```

#### Automated Security Testing dengan ZAP

```bash
# OWASP ZAP - DAST (Dynamic Application Security Testing)
# Install ZAP
# https://www.zaproxy.org/download/

# Automated scan
zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://localhost:8000

# Full scan
zap-cli open-url http://localhost:8000
zap-cli spider http://localhost:8000
zap-cli active-scan http://localhost:8000
zap-cli report -o zap_report.html -f html
```

#### AI Prompt untuk Security Review

```
Prompt:

"Review kode berikut dari perspektif security. Identifikasi:
1. Vulnerability (SQL injection, XSS, CSRF, dll)
2. Severity (Critical/High/Medium/Low)
3. Cara exploit (jika applicable)
4. Fix yang disarankan

Kode:
[paste kode]

Konteks:
- Aplikasi absensi sekolah
- User: guru dan operator
- Database: SQLite
- Deployment: Railway"
```

---

### 6. Accessibility Testing

Accessibility testing memastikan aplikasi bisa digunakan oleh semua orang, termasuk pengguna dengan disabilitas.

#### WCAG 2.1 Checklist

```markdown
## Accessibility Checklist — Aplikasi Sekolah

### Perceivable (Bisa Dirasakan)
- [ ] Semua gambar punya alt text
- [ ] Warna kontras cukup (ratio 4.5:1 untuk text normal)
- [ ] Informasi tidak hanya disampaikan dengan warna
- [ ] Form punya label yang jelas

### Operable (Bisa Dioperasikan)
- [ ] Semua fungsi bisa diakses dengan keyboard
- [ ] Tidak ada keyboard trap
- [ ] Waktu cukup untuk membaca dan berinteraksi
- [ ] Tidak ada konten yang menyebabkan seizure (flashing)

### Understandable (Bisa Dipahami)
- [ ] Bahasa halaman sudah di-set (lang="id")
- [ ] Navigasi konsisten di semua halaman
- [ ] Error message jelas dan helpful
- [ ] Input format dijelaskan (contoh: "Format: DD/MM/YYYY")

### Robust (Kuat)
- [ ] HTML valid (no syntax errors)
- [ ] ARIA attributes digunakan dengan benar
- [ ] Bekerja di berbagai browser dan assistive technology
```

#### Automated Accessibility Testing dengan axe-core

```javascript
// test_accessibility.js — Dengan Playwright
const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y } = require('axe-playwright');

test('Halaman absensi accessible', async ({ page }) => {
  await page.goto('/absensi/6A');

  // Inject axe-core
  await injectAxe(page);

  // Check accessibility
  const violations = await checkA11y(page, null, {
    detailedReport: true,
  });

  // Tidak boleh ada violation critical/serious
  expect(violations.violations.length).toBe(0);
});
```

```bash
# Install
npm install axe-playwright @playwright/test

# Jalankan
npx playwright test test_accessibility.js
```

#### Manual Accessibility Testing

```markdown
## Manual Testing Steps

### Keyboard Navigation
1. Tekan TAB — fokus berpindah ke elemen berikutnya
2. Tekan SHIFT+TAB — fokus berpindah ke elemen sebelumnya
3. Tekan ENTER/SPACE — aktivasi elemen yang difokus
4. Tekan ESC — tutup modal/dropdown

### Screen Reader Testing
1. Install NVDA (Windows, gratis) atau VoiceOver (Mac, built-in)
2. Navigasi halaman dengan screen reader
3. Verifikasi:
   - Semua elemen dibaca dengan benar
   - Urutan baca logis
   - Form label terbaca
   - Error message terbaca

### Color Contrast
1. Gunakan WebAIM Contrast Checker
2. Cek semua kombinasi text/background
3. Minimum ratio: 4.5:1 (normal text), 3:1 (large text)

### Zoom Testing
1. Zoom browser ke 200%
2. Verifikasi:
   - Semua konten masih readable
   - Tidak ada horizontal scroll
   - Layout tidak broken
```

---

### 7. E2E Testing Strategies

End-to-end testing mensimulasikan user journey lengkap dari awal sampai akhir.

#### E2E Test Scenarios untuk Sistem Absensi

```python
# test_e2e_absensi.py — Dengan Playwright
import pytest
from playwright.sync_api import Page, expect

@pytest.fixture(autouse=True)
def setup_db():
    """Reset database sebelum setiap test."""
    import sqlite3
    conn = sqlite3.connect('test_absensi.db')
    conn.execute('DELETE FROM absensi')
    conn.execute('DELETE FROM siswa')
    # Seed test data
    conn.executemany(
        'INSERT INTO siswa (nisn, nama, kelas) VALUES (?, ?, ?)',
        [(f'00{i:08d}', f'Siswa {i}', '6A') for i in range(1, 31)]
    )
    conn.commit()
    conn.close()

def test_guru_input_absensi(page: Page):
    """Scenario: Guru login → input absensi → verifikasi tersimpan."""
    # 1. Login
    page.goto('http://localhost:8000/login')
    page.fill('input[name="username"]', 'guru1')
    page.fill('input[name="password"]', 'password123')
    page.click('button[type="submit"]')

    # Verifikasi login berhasil
    expect(page.locator('h1')).to_contain_text('Absensi Kelas')

    # 2. Pilih kelas
    page.select_option('select[name="kelas"]', '6A')
    page.click('button:has-text("Tampilkan")')

    # 3. Verifikasi daftar siswa muncul
    siswa_rows = page.locator('table tbody tr')
    expect(siswa_rows).to_have_count(30)

    # 4. Input absensi
    # Set semua siswa Hadir kecuali 2
    for i in range(1, 31):
        radio = page.locator(f'tr:has-text("Siswa {i}") input[value="H"]')
        radio.check()

    # Set 2 siswa Sakit
    page.locator('tr:has-text("Siswa 5") input[value="S"]').check()
    page.locator('tr:has-text("Siswa 12") input[value="S"]').check()

    # 5. Simpan
    page.click('button:has-text("Simpan")')

    # 6. Verifikasi success message
    expect(page.locator('.alert-success')).to_be_visible()
    expect(page.locator('.alert-success')).to_contain_text('Absensi berhasil disimpan')

    # 7. Verifikasi data tersimpan
    page.goto('http://localhost:8000/api/absensi/rekap?kelas=6A&bulan=5&tahun=2026')
    import json
    data = json.loads(page.locator('pre').text_content())
    assert data['total_siswa'] == 30
    # Cek siswa 5 dan 12 statusnya Sakit
    siswa_5 = next(s for s in data['siswa'] if s['nama'] == 'Siswa 5')
    assert siswa_5['sakit'] == 1

def test_operator_lihat_rekap(page: Page):
    """Scenario: Operator login → lihat rekap → export Excel."""
    # 1. Login sebagai operator
    page.goto('http://localhost:8000/login')
    page.fill('input[name="username"]', 'operator1')
    page.fill('input[name="password"]', 'password123')
    page.click('button[type="submit"]')

    # 2. Navigasi ke rekap
    page.click('a:has-text("Rekap Bulanan")')

    # 3. Filter per kelas dan bulan
    page.select_option('select[name="kelas"]', '6A')
    page.select_option('select[name="bulan"]', '5')
    page.click('button:has-text("Tampilkan")')

    # 4. Verifikasi tabel rekap
    table = page.locator('#rekap-table')
    expect(table).to_be_visible()

    # 5. Export Excel
    with page.expect_download() as download_info:
        page.click('button:has-text("Export Excel")')
    download = download_info.value
    assert download.suggested_filename.endswith('.xlsx')

def test_invalid_login(page: Page):
    """Scenario: Login dengan password salah → error message."""
    page.goto('http://localhost:8000/login')
    page.fill('input[name="username"]', 'guru1')
    page.fill('input[name="password"]', 'wrong_password')
    page.click('button[type="submit"]')

    # Verifikasi error message
    expect(page.locator('.alert-danger')).to_be_visible()
    expect(page.locator('.alert-danger')).to_contain_text('Username atau password salah')

    # Verifikasi tetap di halaman login
    expect(page).to_have_url('http://localhost:8000/login')
```

#### E2E Testing dengan AI — Self-Healing Tests

```
Prompt:

"Saya punya E2E test yang fail karena selector berubah:

Error:
Error: locator.click: Target closed
  - waiting for locator('button.btn-primary')

Konteks:
- Test: input absensi
- Halaman: /absensi/6A
- Yang berubah: Class button dari 'btn-primary' jadi 'btn-save'

Update test untuk menggunakan selector yang lebih robust.
Sarankan strategi selector yang tidak mudah break saat UI berubah."
```

#### Strategi Selector yang Robust

```python
# ❌ Fragile — bergantung pada class CSS
page.click('button.btn-primary')

# ✅ Robust — bergantung pada role dan accessible name
page.click('button[name="Simpan Absensi"]')

# ✅ Robust — bergantung pada data-testid
page.click('[data-testid="submit-absensi"]')

# ✅ Robust — bergantung pada text content
page.click('button:has-text("Simpan")')

# ✅ Robust — bergantung pada label form
page.fill('input[aria-label="NISN Siswa"]', '0012345678')
```

---

### 8. Test Data Management

Mengelola data test yang konsisten, realistis, dan terisolasi.

#### Factory Pattern untuk Test Data

```python
# test_factories.py
from datetime import date, timedelta
import random

class SiswaFactory:
    """Generate data siswa untuk testing."""

    _counter = 0

    @classmethod
    def create(cls, kelas="6A", **overrides):
        cls._counter += 1
        defaults = {
            "nisn": f"00{cls._counter:08d}",
            "nama": f"Siswa Test {cls._counter}",
            "kelas": kelas,
            "ttl": "2014-05-15",
            "jenis_kelamin": random.choice(["L", "P"]),
        }
        return {**defaults, **overrides}

    @classmethod
    def create_batch(cls, count, kelas="6A", **overrides):
        return [cls.create(kelas=kelas, **overrides) for _ in range(count)]


class AbsensiFactory:
    """Generate data absensi untuk testing."""

    @classmethod
    def create(cls, siswa_nisn, tanggal, status="H"):
        return {
            "nisn": siswa_nisn,
            "tanggal": tanggal,
            "status": status,
        }

    @classmethod
    def create_monthly(cls, siswa_nisn, bulan=5, tahun=2026, absence_rate=0.1):
        """Generate absensi 1 bulan untuk 1 siswa."""
        import calendar
        days_in_month = calendar.monthrange(tahun, bulan)[1]
        absensi = []
        for day in range(1, days_in_month + 1):
            tgl = date(tahun, bulan, day)
            # Skip weekend
            if tgl.weekday() >= 5:
                continue
            # Random absence
            if random.random() < absence_rate:
                status = random.choice(["S", "I", "A"])
            else:
                status = "H"
            absensi.append(cls.create(siswa_nisn, str(tgl), status))
        return absensi
```

#### Database Fixture untuk Testing

```python
# conftest.py
import pytest
import sqlite3
import os

@pytest.fixture(scope="function")
def db_connection():
    """Fresh database untuk setiap test function."""
    db_path = "test_absensi.db"

    # Hapus database lama jika ada
    if os.path.exists(db_path):
        os.remove(db_path)

    # Buat database baru
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")

    # Buat tabel
    conn.executescript("""
        CREATE TABLE siswa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nisn TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            kelas TEXT NOT NULL
        );
        CREATE TABLE absensi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            siswa_id INTEGER REFERENCES siswa(id),
            tanggal DATE NOT NULL,
            status TEXT CHECK(status IN ('H', 'S', 'I', 'A')),
            UNIQUE(siswa_id, tanggal)
        );
    """)

    yield conn

    # Cleanup
    conn.close()
    if os.path.exists(db_path):
        os.remove(db_path)


@pytest.fixture(scope="function")
def seeded_db(db_connection):
    """Database dengan data seed untuk testing."""
    from test_factories import SiswaFactory, AbsensiFactory

    # Seed 30 siswa kelas 6A
    siswa_list = SiswaFactory.create_batch(30, kelas="6A")
    for s in siswa_list:
        db_connection.execute(
            "INSERT INTO siswa (nisn, nama, kelas) VALUES (?, ?, ?)",
            (s["nisn"], s["nama"], s["kelas"])
        )

    # Seed absensi bulan Mei 2026
    for s in siswa_list:
        absensi = AbsensiFactory.create_monthly(s["nisn"], bulan=5, tahun=2026)
        for a in absensi:
            cursor = db_connection.execute(
                "SELECT id FROM siswa WHERE nisn = ?", (a["nisn"],)
            )
            siswa_id = cursor.fetchone()[0]
            db_connection.execute(
                "INSERT INTO absensi (siswa_id, tanggal, status) VALUES (?, ?, ?)",
                (siswa_id, a["tanggal"], a["status"])
            )

    db_connection.commit()
    yield db_connection
```

#### Test Data Strategy

```markdown
## Test Data Strategy

### Prinsip
1. **Isolated**: Setiap test punya data sendiri, tidak share
2. **Deterministic**: Hasil test sama setiap kali dijalankan
3. **Realistic**: Data mirip data produksi (format, distribusi)
4. **Minimal**: Hanya data yang diperlukan untuk test tersebut

### Sumber Data
| Tipe | Sumber | Kapan Pakai |
|------|--------|-------------|
| Unit test | Factory pattern | Selalu |
| Integration test | Seeded database | Functional testing |
| E2E test | Fresh database + seed | Full workflow testing |
| Performance test | Generated data (1000+ records) | Load/stress testing |
| Security test | Malicious input data | Vulnerability testing |

### Data Generation Rules
- NISN: Format 10 digit numerik
- Nama: Format "Nama Test {N}" (jangan pakai nama asli)
- Tanggal: Dalam range tahun ajaran aktif
- Status: Distribusi realistis (80% H, 10% S, 5% I, 5% A)
```

---

### 9. Mocking dan Stubbing — Advanced Patterns

#### Mocking External Services

```python
# test_external_api.py
from unittest.mock import patch, MagicMock
import requests

# Pattern 1: Mock response dari external API
@patch('requests.get')
def test_dapodik_sync(mock_get):
    """Test sinkronisasi data dari Dapodik Web Service."""
    # Setup mock response
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "siswa": [
            {"nisn": "0012345678", "nama": "Ahmad", "kelas": "6A"},
            {"nisn": "0012345679", "nama": "Siti", "kelas": "6A"},
        ]
    }
    mock_get.return_value = mock_response

    # Execute
    from sync import sync_dapodik
    result = sync_dapodik("https://dapodik.kemdikbud.go.id/api/siswa")

    # Assert
    assert len(result) == 2
    assert result[0]["nisn"] == "0012345678"
    mock_get.assert_called_once_with(
        "https://dapodik.kemdikbud.go.id/api/siswa",
        headers={"Authorization": "Bearer TOKEN"}
    )

# Pattern 2: Mock dengan side_effect untuk test error handling
@patch('requests.get')
def test_dapodik_sync_timeout(mock_get):
    """Test handling timeout dari Dapodik."""
    mock_get.side_effect = requests.exceptions.Timeout("Connection timed out")

    from sync import sync_dapodik
    result = sync_dapodik("https://dapodik.kemdikbud.go.id/api/siswa")

    assert result is None  # Atau raise exception, tergantung implementasi

# Pattern 3: Mock dengan context manager
def test_dapodik_sync_multiple_calls():
    """Test retry logic saat Dapodik down."""
    with patch('requests.get') as mock_get:
        # Call 1 & 2: fail, Call 3: success
        mock_get.side_effect = [
            requests.exceptions.ConnectionError(),
            requests.exceptions.ConnectionError(),
            MagicMock(status_code=200, json=lambda: {"siswa": []}),
        ]

        from sync import sync_dapodik_with_retry
        result = sync_dapodik_with_retry("https://dapodik.kemdikbud.go.id/api/siswa")

        assert mock_get.call_count == 3  # Retry 2 kali
```

#### Advanced Mocking dengan pytest-mock

```python
# test_advanced_mocking.py
import pytest
from datetime import datetime

def test_mock_datetime(mocker):
    """Mock datetime.now() untuk test yang time-dependent."""
    # Fixed time untuk test
    fixed_time = datetime(2026, 5, 21, 7, 30, 0)
    mocker.patch('absensi.datetime', now=lambda: fixed_time)

    from absensi import get_current_semester
    semester = get_current_semester()

    assert semester == "Genap 2025/2026"

def test_mock_database(mocker):
    """Mock database connection untuk test tanpa DB nyata."""
    mock_conn = mocker.patch('absensi.get_db_connection')
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, "Ahmad", "6A"),
        (2, "Siti", "6A"),
    ]
    mock_conn.return_value.cursor.return_value = mock_cursor

    from absensi import get_siswa_by_kelas
    siswa = get_siswa_by_kelas("6A")

    assert len(siswa) == 2
    assert siswa[0]["nama"] == "Ahmad"

def test_mock_file_system(mocker):
    """Mock file operations untuk test export Excel."""
    mock_open = mocker.patch('builtins.open', mocker.mock_open())
    mock_path = mocker.patch('os.path.exists', return_value=True)

    from export import export_to_excel
    export_to_excel("rekap.xlsx", data=[{"nama": "Ahmad", "hadir": 20}])

    mock_open.assert_called_once()
```

#### Mock Server untuk Integration Testing

```python
# test_with_mock_server.py
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import json
import pytest

class MockDapodikHandler(BaseHTTPRequestHandler):
    """HTTP server mock untuk simulasi Dapodik Web Service."""

    def do_GET(self):
        if self.path == "/api/siswa":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {
                "siswa": [
                    {"nisn": "0012345678", "nama": "Ahmad", "kelas": "6A"},
                ]
            }
            self.wfile.write(json.dumps(response).encode())
        elif self.path == "/api/guru":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {
                "guru": [
                    {"nip": "198001012005011001", "nama": "Pak Budi"},
                ]
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # Suppress log output

@pytest.fixture(scope="module")
def mock_dapodik_server():
    """Start mock server untuk test module."""
    server = HTTPServer(("localhost", 9999), MockDapodikHandler)
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()

    yield "http://localhost:9999"

    server.shutdown()

def test_sync_siswa(mock_dapodik_server):
    """Test sync dengan mock server."""
    from sync import sync_dapodik
    result = sync_dapodik(f"{mock_dapodik_server}/api/siswa")

    assert len(result) == 1
    assert result[0]["nama"] == "Ahmad"
```

---

### 10. Debugging Production Issues

Debugging di lingkungan produksi membutuhkan pendekatan berbeda dari debugging development.

#### Structured Logging untuk Production

```python
# logging_config.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Log format JSON untuk mudah parsing di production."""

    def format(self, record):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Tambahkan extra data jika ada
        if hasattr(record, "user_id"):
            log_entry["user_id"] = record.user_id
        if hasattr(record, "request_id"):
            log_entry["request_id"] = record.request_id
        if hasattr(record, "duration_ms"):
            log_entry["duration_ms"] = record.duration_ms

        # Tambahkan exception info jika ada
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_entry)

# Setup logger
logger = logging.getLogger("absensi")
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
```

```python
# main.py — Usage
from logging_config import logger
import uuid

@app.middleware("http")
async def add_request_id(request, call_next):
    """Tambah request ID ke setiap request untuk tracing."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    start_time = time.time()
    response = await call_next(request)
    duration = (time.time() - start_time) * 1000

    logger.info(
        f"{request.method} {request.url.path} {response.status_code}",
        extra={
            "request_id": request_id,
            "duration_ms": round(duration, 2),
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
        }
    )

    return response

@app.post("/api/absensi")
async def input_absensi(data: AbsensiRequest, request: Request):
    request_id = request.state.request_id

    logger.info(
        "Processing absensi input",
        extra={
            "request_id": request_id,
            "user_id": data.user_id,
            "kelas": data.kelas,
            "count": len(data.data),
        }
    )

    try:
        result = await save_absensi(data)
        logger.info(
            "Absensi saved successfully",
            extra={"request_id": request_id, "count": result.count}
        )
        return {"success": True, "count": result.count}
    except Exception as e:
        logger.error(
            f"Failed to save absensi: {e}",
            extra={"request_id": request_id},
            exc_info=True
        )
        raise
```

#### Debugging Checklist untuk Production Issues

```markdown
## Production Debugging Checklist

### Step 1: Identify the Problem
- [ ] Error message apa yang muncul?
- [ ] Kapan pertama kali terjadi?
- [ ] Seberapa sering terjadi?
- [ ] User mana yang terpengaruh?

### Step 2: Gather Evidence
- [ ] Check logs (search by request_id, user_id, timestamp)
- [ ] Check metrics (response time, error rate, throughput)
- [ ] Check database (query yang lambat, lock, deadlock)
- [ ] Check server (CPU, memory, disk usage)

### Step 3: Reproduce
- [ ] Bisa reproduce di development?
- [ ] Apa perbedaan environment production vs development?
- [ ] Apa data spesifik yang trigger error?

### Step 4: Isolate
- [ ] Apakah ini masalah kode, konfigurasi, atau infrastruktur?
- [ ] Apakah ini masalah baru atau sudah ada sejak lama?
- [ ] Apakah ada perubahan recent (deploy, config, data)?

### Step 5: Fix & Verify
- [ ] Fix di development
- [ ] Test fix dengan data yang sama
- [ ] Deploy fix
- [ ] Verify di production (monitoring, logs)

### Step 6: Prevent Recurrence
- [ ] Tambah test case untuk scenario ini
- [ ] Tambah monitoring/alerting untuk detect lebih awal
- [ ] Update runbook untuk issue serupa
```

#### AI Prompt untuk Debug Production Issues

```
Prompt:

"Production issue: API /api/absensi/rekap response time > 10 detik
(seharusnya < 500ms). Issue mulai terjadi setelah jumlah siswa bertambah
dari 100 ke 200.

Log excerpt:
2026-05-21T07:15:32Z INFO Processing rekap request request_id=abc-123 kelas=6A
2026-05-21T07:15:42Z INFO Rekap completed request_id=abc-123 duration_ms=10234

Database info:
- SQLite database size: 15MB
- Tabel absensi: 50,000 rows
- Tabel siswa: 200 rows
- No indexes on absensi table

Query yang dijalankan:
SELECT s.nama, a.status, a.tanggal
FROM siswa s
JOIN absensi a ON s.id = a.siswa_id
WHERE s.kelas = '6A' AND a.tanggal BETWEEN '2026-05-01' AND '2026-05-31'

Analisis:
1. Apa root cause-nya?
2. Apa fix-nya?
3. Bagaimana prevent issue serupa di masa depan?"
```

---

### 11. Distributed System Debugging

Untuk sistem yang terdiri dari multiple services, debugging lebih kompleks.

#### Distributed Tracing dengan OpenTelemetry

```python
# tracing.py
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Setup tracer
trace.set_tracer_provider(TracerProvider())
jaeger_exporter = JaegerExporter(
    agent_host_name="localhost",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

# Instrument FastAPI
FastAPIInstrumentor.instrument_app(app)

# Manual tracing di business logic
tracer = trace.get_tracer("absensi")

@app.post("/api/absensi")
async def input_absensi(data: AbsensiRequest):
    with tracer.start_as_current_span("input_absensi") as span:
        span.set_attribute("kelas", data.kelas)
        span.set_attribute("count", len(data.data))

        with tracer.start_as_current_span("validate_absensi"):
            validate(data)

        with tracer.start_as_current_span("save_absensi"):
            result = save(data)
            span.set_attribute("saved_count", result.count)

        return {"success": True, "count": result.count}
```

#### Correlation ID untuk Request Tracing

```python
# correlation.py
import uuid
from contextvars import ContextVar

# Context variable untuk correlation ID
correlation_id: ContextVar[str] = ContextVar("correlation_id", default="")

@app.middleware("http")
async def correlation_middleware(request, call_next):
    # Generate atau ambil correlation ID dari header
    corr_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
    correlation_id.set(corr_id)

    response = await call_next(request)
    response.headers["X-Correlation-ID"] = corr_id

    return response

def get_correlation_id() -> str:
    return correlation_id.get()

# Usage di logging
logger.info(
    "Processing request",
    extra={"correlation_id": get_correlation_id()}
)
```

---

### 12. Performance Profiling dengan AI

AI bisa membantu menganalisis profiling data dan mengidentifikasi bottleneck.

#### Profiling dengan cProfile

```python
# profile_absensi.py
import cProfile
import pstats
import io
from absensi import hitung_rekap_kehadiran, generate_laporan

def profile_rekap():
    """Profile fungsi hitung_rekap_kehadiran."""
    # Generate test data
    data = {
        f"siswa_{i}": {
            f"2026-05-{j:02d}": "H" if j % 3 != 0 else "A"
            for j in range(1, 21)
        }
        for i in range(200)
    }

    # Profile
    profiler = cProfile.Profile()
    profiler.enable()

    for _ in range(100):
        hitung_rekap_kehadiran(data)

    profiler.disable()

    # Print stats
    stream = io.StringIO()
    stats = pstats.Stats(profiler, stream=stream)
    stats.sort_stats("cumulative")
    stats.print_stats(20)  # Top 20 functions

    return stream.getvalue()

if __name__ == "__main__":
    result = profile_rekap()
    print(result)
```

#### AI Prompt untuk Analisis Profiling

```
Prompt:

"Berikut hasil profiling dari fungsi hitung_rekap_kehadiran:

         500000 function calls in 2.345 seconds

   Ordered by: cumulative time
   List reduced from 50 to 20 due to restriction <20>

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
      100    0.001    0.000    2.345    0.023 absensi.py:15(hitung_rekap_kehadiran)
   200000    0.500    0.000    1.200    0.000 absensi.py:45(calculate_percentage)
   100000    0.800    0.000    0.800    0.000 {built-in method sum}
   100000    0.300    0.000    0.300    0.000 {built-in method len}
   100000    0.200    0.000    0.200    0.000 absensi.py:50(validate_status)
    50000    0.100    0.000    0.100    0.000 {method 'items' of 'dict' objects}

Analisis:
1. Fungsi mana yang paling boros waktu?
2. Apa optimasi yang bisa dilakukan?
3. Berapa estimasi improvement?
4. Apakah perlu restructuring atau cukup micro-optimization?"
```

---

## ✅ CHECKLIST

- [ ] Paham property-based testing dan bisa implement dengan Hypothesis
- [ ] Tahu mutation testing dan cara meningkatkan kualitas test
- [ ] Bisa setup performance testing dengan Locust dan pytest-benchmark
- [ ] Bisa merancang load test scenario yang realistis
- [ ] Paham OWASP Top 10 dan cara test security
- [ ] Bisa melakukan accessibility testing (automated + manual)
- [ ] Bisa menulis E2E test dengan Playwright
- [ ] Tahu test data management best practices (factory, fixture, seeding)
- [ ] Paham advanced mocking patterns (external services, datetime, filesystem)
- [ ] Bisa debug production issues dengan structured logging
- [ ] Paham distributed tracing untuk multi-service debugging
- [ ] Bisa profile performance dan analisis hasil profiling dengan AI
- [ ] Memahami prinsip dari awesome-vibe-coding-guide: run and test frequently, let AI fix errors, iterate and refine

---

## 📚 REFERENSI

- [awesome-vibe-coding-guide](https://github.com/analyticalrohit/awesome-vibe-coding-guide) — Testing and Debugging
- [Hypothesis — Property-based testing](https://hypothesis.readthedocs.io/)
- [Locust — Load testing](https://locust.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Playwright — E2E testing](https://playwright.dev/)
- [OpenTelemetry — Distributed tracing](https://opentelemetry.io/)

---

> **Lanjut ke:** [`05-version-control-deploy.md`](./05-version-control-deploy.md)
