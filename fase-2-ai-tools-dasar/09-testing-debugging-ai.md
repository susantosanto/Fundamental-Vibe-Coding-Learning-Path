# 09 — Testing & Debugging dengan AI

> **Estimasi:** 1.5 jam | **Level:** Pemula → Menengah
> **Sumber:** [`awattar/claude-code-best-practices — Testing`](https://github.com/awattar/claude-code-best-practices#-code-analysis--testing), [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings)

---

## 📖 TEORI

### Mengapa Testing dan Debugging Penting dalam Vibe Coding?

Dalam paradigma **vibe coding** — di mana AI menulis sebagian besar kode — testing dan debugging menjadi **lebih penting**, bukan kurang. Alasannya sederhana:

1. **AI bisa membuat kesalahan halus** — kode terlihat benar tapi punya bug edge case
2. **AI tidak tahu konteks bisnis Anda** — ia tidak tahu bahwa "siswa tidak boleh absen di hari libur"
3. **AI bisa hallucinate** — menggunakan API yang sudah deprecated atau library yang tidak ada
4. **AI tidak bisa guarantee correctness** — ia menghasilkan kode yang *mungkin* benar, bukan *pasti* benar

Testing adalah **safety net** yang memastikan kode yang AI tulis benar-benar berfungsi sesuai harapan. Debugging adalah **proses investigasi** ketika sesuatu tidak berjalan semestinya.

---

## 🧪 BAGIAN 1: AI-Assisted Testing

### 1.1 Jenis-Jenis Testing dalam Software Development

Sebelum masuk ke AI-assisted testing, penting memahami **testing pyramid** — hierarki jenis test dari yang paling cepat dan murah hingga yang paling lambat dan mahal:

```
                    /\
                   /  \
                  / E2E \          ← Paling lambat, paling mahal
                 / Test  \           (Playwright, Cypress)
                /---------\
               /           \
              / Integration  \      ← Medium speed, medium cost
             /     Test       \       (pytest + HTTPX, supertest)
            /------------------\
           /                    \
          /     Unit Test        \  ← Paling cepat, paling murah
         /                        \   (pytest, Jest, unittest)
        /__________________________\
```

**Unit Test** — Menguji satu fungsi/method secara terisolasi. Cepat (milidetik), murah, dan memberikan feedback instan.

**Integration Test** — Menguji interaksi antara beberapa komponen. Misalnya, apakah endpoint API bisa berkomunikasi dengan database dengan benar?

**E2E (End-to-End) Test** — Menguji seluruh alur dari perspektif user. Misalnya, apakah user bisa login → input absensi → lihat rekap?

**Manual Test** — Testing oleh manusia. Tetap diperlukan untuk UX, visual, dan edge case yang sulit diotomatisasi.

### 1.2 Unit Test Generation dengan AI

Salah satu penggunaan AI yang paling powerful adalah **generate unit test secara otomatis**. AI bisa:

- Membaca source code dan memahami apa yang dilakukan setiap fungsi
- Mengidentifikasi edge cases yang mungkin terlewat
- Menulis test cases yang komprehensif
- Menjaga konsistensi style testing di seluruh proyek

#### Contoh: Generate Unit Test untuk Fungsi Python

Misalkan kita punya fungsi sederhana di `src/absensi.py`:

```python
def hitung_hari_kerja(tanggal_mulai: str, tanggal_selesai: str) -> int:
    """Hitung jumlah hari kerja antara dua tanggal (exclude weekend)."""
    from datetime import datetime, timedelta

    mulai = datetime.strptime(tanggal_mulai, "%Y-%m-%d")
    selesai = datetime.strptime(tanggal_selesai, "%Y-%m-%d")

    if mulai > selesai:
        raise ValueError("Tanggal mulai harus sebelum tanggal selesai")

    hari_kerja = 0
    current = mulai
    while current <= selesai:
        if current.weekday() < 5:  # 0-4 = Senin-Jumat
            hari_kerja += 1
        current += timedelta(days=1)

    return hari_kerja
```

**Prompt untuk AI:**

```
Buatkan unit test komprehensif untuk fungsi hitung_hari_kerja.
Sertakan test cases untuk:
1. Normal case — rentang tanggal biasa
2. Edge case — tanggal yang sama
3. Edge case —跨越 weekend
4. Edge case — seluruhnya weekend
5. Error case — tanggal mulai > selesai
6. Error case — format tanggal salah
Gunakan pytest, simpan di tests/test_absensi.py
```

**Output yang AI hasilkan:**

```python
import pytest
from datetime import datetime
from src.absensi import hitung_hari_kerja


class TestHitungHariKerja:
    """Test suite untuk fungsi hitung_hari_kerja."""

    def test_hari_kerja_normal(self):
        """Senin-Jumat, 1 minggu penuh = 5 hari kerja."""
        result = hitung_hari_kerja("2026-05-18", "2026-05-22")
        assert result == 5

    def test_hari_kerja_dua_minggu(self):
        """2 minggu penuh = 10 hari kerja."""
        result = hitung_hari_kerja("2026-05-18", "2026-05-29")
        assert result == 10

    def test_tanggal_sama(self):
        """Tanggal yang sama = 1 hari kerja (jika weekday)."""
        # 2026-05-18 adalah Senin
        result = hitung_hari_kerja("2026-05-18", "2026-05-18")
        assert result == 1

    def test_tanggal_sama_weekend(self):
        """Tanggal yang sama di weekend = 0 hari kerja."""
        # 2026-05-23 adalah Sabtu
        result = hitung_hari_kerja("2026-05-23", "2026-05-23")
        assert result == 0

    def test_cross_weekend(self):
        """Jumat ke Senin = 2 hari kerja (Jumat + Senin)."""
        result = hitung_hari_kerja("2026-05-22", "2026-05-25")
        assert result == 2

    def test_full_weekend(self):
        """Sabtu ke Minggu = 0 hari kerja."""
        result = hitung_hari_kerja("2026-05-23", "2026-05-24")
        assert result == 0

    def test_tanggal_mulai_setelah_selesai(self):
        """Tanggal mulai > selesai harus raise ValueError."""
        with pytest.raises(ValueError, match="Tanggal mulai harus sebelum"):
            hitung_hari_kerja("2026-05-25", "2026-05-18")

    def test_format_tanggal_salah(self):
        """Format tanggal salah harus raise error."""
        with pytest.raises(ValueError):
            hitung_hari_kerja("18-05-2026", "2026-05-22")

    def test_hari_kerja_dengan_libur_nasional(self):
        """Catatan: fungsi ini belum handle libur nasional.
        Ini adalah test untuk menunjukkan limitation."""
        # 2026-05-01 adalah Hari Buruh (Jumat)
        # Fungsi akan menghitungnya sebagai hari kerja
        result = hitung_hari_kerja("2026-05-01", "2026-05-01")
        assert result == 1  # Ini benar secara teknis, tapi mungkin tidak sesuai bisnis
```

**Mengapa AI bagus untuk generate test:**

1. **Konsistensi** — AI menggunakan pattern testing yang sama di semua file
2. **Coverage** — AI cenderung mengidentifikasi lebih banyak edge cases
3. **Kecepatan** — Generate 20 test cases dalam detik, bukan jam
4. **Best practices** — AI tahu pattern AAA (Arrange-Act-Assert), fixture, parametrization

### 1.3 Test-Driven Development (TDD) dengan AI

**TDD (Test-Driven Development)** adalah metodologi di mana Anda menulis test **sebelum** menulis kode implementasi. Siklus TDD dikenal sebagai **Red-Green-Refactor**:

```
┌─────────────────────────────────────────────────┐
│              TDD CYCLE                           │
│                                                  │
│  1. RED — Tulis test yang FAIL                   │
│     (karena kode belum ada)                      │
│     ↓                                            │
│  2. GREEN — Tulis kode MINIMAL agar test PASS    │
│     (belum perlu perfect, yang penting pass)     │
│     ↓                                            │
│  3. REFACTOR — Perbaiki kode tanpa mengubah      │
│     behavior (test tetap pass)                   │
│     ↓                                            │
│  [Ulangi untuk fitur berikutnya]                 │
└─────────────────────────────────────────────────┘
```

#### TDD dengan AI — Workflow Lengkap

**Langkah 1: Deskripsikan Fitur**

```
Saya ingin membuat fungsi validasi NISN (Nomor Induk Siswa Nasional).
Aturan:
- Harus 10 digit angka
- Tidak boleh dimulai dengan 0
- Harus unik (akan dicek di database nanti)
- Hanya angka, tidak boleh huruf atau simbol

Gunakan pendekatan TDD: buat test dulu, baru implementasi.
```

**Langkah 2: AI Generate Test (RED Phase)**

```python
# tests/test_validasi.py
import pytest
from src.validasi import validasi_nisn


class TestValidasiNISN:
    """Test suite untuk validasi NISN."""

    def test_nisn_valid(self):
        """NISN 10 digit yang valid."""
        assert validasi_nisn("1234567890") is True

    def test_nisn_terlalu_pendek(self):
        """NISN kurang dari 10 digit."""
        assert validasi_nisn("123456789") is False

    def test_nisn_terlalu_panjang(self):
        """NISN lebih dari 10 digit."""
        assert validasi_nisn("12345678901") is False

    def test_nisn_dimulai_nol(self):
        """NISN tidak boleh dimulai dengan 0."""
        assert validasi_nisn("0123456789") is False

    def test_nisn_berisi_huruf(self):
        """NISN hanya boleh angka."""
        assert validasi_nisn("123456789a") is False

    def test_nisn_berisi_simbol(self):
        """NISN tidak boleh ada simbol."""
        assert validasi_nisn("123-456789") is False

    def test_nisn_kosong(self):
        """NISN kosong tidak valid."""
        assert validasi_nisn("") is False

    def test_nisn_none(self):
        """NISN None harus raise TypeError."""
        with pytest.raises(TypeError):
            validasi_nisn(None)
```

**Langkah 3: Jalankan Test — Harus FAIL (RED)**

```bash
$ pytest tests/test_validasi.py
===== FAILURES =====
ImportError: cannot import name 'validasi_nisn' from 'src.validasi'
```

Test gagal karena fungsi belum ada. Ini **expected** — kita di fase RED.

**Langkah 4: AI Generate Implementasi (GREEN Phase)**

```
Test sudah dibuat dan fail seperti yang diharapkan.
Sekarang implementasi fungsi validasi_nisn agar semua test pass.
```

```python
# src/validasi.py

def validasi_nisn(nisn: str) -> bool:
    """Validasi NISN (Nomor Induk Siswa Nasional).

    Args:
        nisn: String NISN yang akan divalidasi

    Returns:
        True jika NISN valid, False jika tidak

    Raises:
        TypeError: Jika input bukan string
    """
    if not isinstance(nisn, str):
        raise TypeError("NISN harus berupa string")

    if len(nisn) != 10:
        return False

    if not nisn.isdigit():
        return False

    if nisn[0] == "0":
        return False

    return True
```

**Langkah 5: Jalankan Test — Harus PASS (GREEN)**

```bash
$ pytest tests/test_validasi.py -v
===== 8 passed in 0.03s =====
```

Semua test pass! Kita di fase GREEN.

**Langkah 6: Refactor (jika perlu)**

```
Kode sudah pass semua test. Apakah ada yang bisa di-refactor
tanpa mengubah behavior?
```

AI mungkin menyarankan:

```python
# Refactored version — lebih clean
def validasi_nisn(nisn: str) -> bool:
    """Validasi NISN (Nomor Induk Siswa Nasional)."""
    if not isinstance(nisn, str):
        raise TypeError("NISN harus berupa string")

    return (
        len(nisn) == 10
        and nisn.isdigit()
        and nisn[0] != "0"
    )
```

Jalankan test lagi — masih pass. Refactor berhasil!

### 1.4 Integration Testing dengan AI

Integration test menguji apakah **beberapa komponen bekerja bersama dengan benar**. Ini lebih kompleks dari unit test karena melibatkan:

- Database connections
- API endpoints
- External services
- File I/O

#### Contoh: Integration Test untuk API Absensi

```python
# tests/integration/test_api_absensi.py
import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app


@pytest.fixture
async def client():
    """Fixture untuk HTTP client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture
async def db_session():
    """Fixture untuk database session (test database)."""
    # Setup test database
    from src.database import get_test_session
    async with get_test_session() as session:
        yield session
        # Cleanup setelah test
        await session.rollback()


class TestAPIAbsensi:
    """Integration test untuk API absensi."""

    async def test_input_absensi_berhasil(self, client, db_session):
        """POST /api/absensi dengan data valid."""
        response = await client.post(
            "/api/absensi",
            json={
                "siswa_id": 1,
                "tanggal": "2026-05-18",
                "status": "hadir",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "success"
        assert data["data"]["siswa_id"] == 1

    async def test_input_absensi_siswa_tidak_ditemukan(self, client):
        """POST /api/absensi dengan siswa_id yang tidak ada."""
        response = await client.post(
            "/api/absensi",
            json={
                "siswa_id": 99999,
                "tanggal": "2026-05-18",
                "status": "hadir",
            },
        )
        assert response.status_code == 404
        data = response.json()
        assert "tidak ditemukan" in data["message"]

    async def test_input_absensi_data_kosong(self, client):
        """POST /api/absensi tanpa body."""
        response = await client.post("/api/absensi")
        assert response.status_code == 422  # Unprocessable Entity

    async def test_input_absensi_status_invalid(self, client):
        """POST /api/absensi dengan status yang tidak valid."""
        response = await client.post(
            "/api/absensi",
            json={
                "siswa_id": 1,
                "tanggal": "2026-05-18",
                "status": "liburan",  # Invalid status
            },
        )
        assert response.status_code == 422

    async def test_get_rekap_absensi(self, client, db_session):
        """GET /api/absensi/rekap?bulan=5&tahun=2026."""
        # Insert test data dulu
        from src.models import Absensi
        db_session.add(Absensi(
            siswa_id=1,
            tanggal="2026-05-18",
            status="hadir",
        ))
        await db_session.commit()

        response = await client.get(
            "/api/absensi/rekap",
            params={"bulan": 5, "tahun": 2026},
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) >= 1
```

**Prompt untuk AI generate integration test:**

```
Buatkan integration test untuk API CRUD data guru.
Endpoint:
- GET /api/guru — list semua guru
- POST /api/guru — tambah guru baru
- GET /api/guru/{id} — detail guru
- PUT /api/guru/{id} — update guru
- DELETE /api/guru/{id} — hapus guru

Test cases yang diperlukan:
1. CRUD lengkap dengan data valid
2. GET guru yang tidak ada → 404
3. POST dengan data tidak lengkap → 422
4. PUT guru yang tidak ada → 404
5. DELETE guru yang tidak ada → 404
6. Duplicate NIP → 409 Conflict
Gunakan pytest + httpx async client, test database SQLite
```

### 1.5 Test Coverage Improvement dengan AI

**Test coverage** mengukur persentase kode yang "disentuh" oleh test. AI bisa membantu meningkatkan coverage secara signifikan:

#### Langkah 1: Cek Coverage Saat Ini

```bash
$ pytest tests/ --cov=src --cov-report=term-missing
Name                    Stmts   Miss  Cover   Missing
-----------------------------------------------------
src/absensi.py             45     12    73%   23-28, 45-50
src/validasi.py            18      3    83%   12-14
src/laporan.py             67     34    49%   15-25, 40-55, 70-85
src/export.py              32     20    38%   10-25, 30-40
-----------------------------------------------------
TOTAL                     162     69    57%
```

Coverage 57% — masih rendah. Target minimal 80%.

#### Langkah 2: Minta AI Generate Test untuk Code yang Belum Ter-cover

```
Berikut adalah coverage report. Fungsi di src/laporan.py baris 15-25,
40-55, dan 70-85 belum ter-test. Juga src/export.py baris 10-25 dan
30-40 belum ter-test.

Buatkan unit test untuk menutupi baris-baris tersebut.
Fokus pada edge cases dan error handling.
```

#### Langkah 3: AI Generate Test dan Jalankan Ulang

```bash
$ pytest tests/ --cov=src --cov-report=term-missing
Name                    Stmts   Miss  Cover   Missing
-----------------------------------------------------
src/absensi.py             45      5    89%   23-27
src/validasi.py            18      0   100%
src/laporan.py             67      8    88%   42-45
src/export.py              32      4    88%   35-38
-----------------------------------------------------
TOTAL                     162     17    90%
```

Coverage naik dari 57% ke 90%!

### 1.6 Test-Driven Refactoring dengan AI

**Refactoring** adalah mengubah struktur kode tanpa mengubah behavior. Dengan TDD, kita bisa refactor dengan **confidence** karena test akan catch jika ada yang berubah:

```
User: "Refactor fungsi generate_laporan_bulanan di src/laporan.py.
Fungsi ini terlalu panjang (80 baris) dan sulit dibaca.
Pecah menjadi fungsi-fungsi kecil yang lebih fokus.

Pastikan semua test tetap pass setelah refactoring."
```

AI akan:
1. Membaca fungsi yang ada
2. Mengidentifikasi logical sections
3. Memecah menjadi fungsi-fungsi kecil
4. Menjalankan test untuk verifikasi
5. Jika test fail, AI akan fix dan retry

```python
# BEFORE — 80 baris, satu fungsi besar
def generate_laporan_bulanan(tahun: int, bulan: int) -> dict:
    # ... 80 baris kode yang melakukan banyak hal sekaligus ...
    # 1. Query database
    # 2. Hitung statistik
    # 3. Format data
    # 4. Generate summary
    # 5. Export ke format yang diminta

# AFTER — 5 fungsi kecil, masing-masing 15-20 baris
def generate_laporan_bulanan(tahun: int, bulan: int) -> dict:
    data = _query_data_absensi(tahun, bulan)
    stats = _hitung_statistik(data)
    formatted = _format_laporan(stats)
    summary = _generate_summary(formatted)
    return {"data": formatted, "summary": summary}

def _query_data_absensi(tahun: int, bulan: int) -> list:
    """Query data absensi dari database."""
    # ... 15 baris ...

def _hitung_statistik(data: list) -> dict:
    """Hitung statistik kehadiran."""
    # ... 15 baris ...

def _format_laporan(stats: dict) -> list:
    """Format data untuk laporan."""
    # ... 15 baris ...

def _generate_summary(formatted: list) -> dict:
    """Generate ringkasan laporan."""
    # ... 10 baris ...
```

Test tetap pass karena behavior tidak berubah — hanya struktur yang berbeda.

---

## 🐛 BAGIAN 2: Debugging dengan AI

### 2.1 Error Analysis — Analisis Error dengan AI

Ketika error terjadi, AI bisa membantu menganalisis dan menemukan root cause dengan cepat.

#### Contoh 1: Python Traceback Analysis

```
Error: KeyError: 'siswa_id' saat POST /api/absensi

Traceback (most recent call last):
  File "app.py", line 45, in input_absensi
    siswa_id = data['siswa_id']
               ~~~~^^^^^^^^^^^^
KeyError: 'siswa_id'

Bantu debug error ini.
```

**AI akan menganalisis:**

```
ANALISIS ERROR:

1. Jenis Error: KeyError — key 'siswa_id' tidak ada di dictionary 'data'

2. Lokasi: app.py, baris 45, fungsi input_absensi

3. Penyebab Kemungkinan:
   a. Client mengirim JSON tanpa field 'siswa_id'
   b. Field bernama berbeda (misal: 'id_siswa' bukan 'siswa_id')
   c. Data tidak di-parse dengan benar (masih string, bukan dict)
   d. Content-Type header tidak diset ke 'application/json'

4. Solusi yang Disarankan:

   Solusi A — Defensive programming (recommended):
   ```python
   siswa_id = data.get('siswa_id')
   if siswa_id is None:
       return {"error": "Field 'siswa_id' wajib diisi"}, 400
   ```

   Solusi B — Pydantic validation (best practice):
   ```python
   from pydantic import BaseModel

   class AbsensiRequest(BaseModel):
       siswa_id: int
       tanggal: str
       status: str

   # Di endpoint:
   body = AbsensiRequest(**data)  # Auto-validation
   siswa_id = body.siswa_id
   ```

   Solusi C — Explicit check:
   ```python
   if 'siswa_id' not in data:
       raise ValueError("Field 'siswa_id' tidak ditemukan dalam request")
   siswa_id = data['siswa_id']
   ```

5. Rekomendasi: Gunakan Solusi B (Pydantic) karena:
   - Auto-validation untuk semua field
   - Error message yang jelas
   - Type safety
   - Dokumentasi otomatis
```

#### Contoh 2: JavaScript/TypeScript Error

```
Error: TypeError: Cannot read properties of undefined (reading 'map')
    at renderTabelSiswa (TabelSiswa.tsx:34:21)
    at HalamanAbsensi (HalamanAbsensi.tsx:56:12)

Bantu debug error ini.
```

**AI akan menganalisis:**

```
ANALISIS ERROR:

1. Jenis Error: TypeError — mencoba akses property 'map' pada undefined

2. Lokasi: TabelSiswa.tsx, baris 34

3. Penyebab: Variabel yang di-.map() adalah undefined, bukan array

4. Kode Bermasalah (kemungkinan):
   ```tsx
   {siswaList.map(siswa => (
     <tr key={siswa.id}>...</tr>
   ))}
   ```

5. Solusi:

   Solusi A — Optional chaining (paling aman):
   ```tsx
   {siswaList?.map(siswa => (
     <tr key={siswa.id}>...</tr>
   ))}
   ```

   Solusi B — Default value:
   ```tsx
   {(siswaList || []).map(siswa => (
     <tr key={siswa.id}>...</tr>
   ))}
   ```

   Solusi C — Conditional rendering (paling clean):
   ```tsx
   {siswaList && siswaList.length > 0 ? (
     siswaList.map(siswa => <tr key={siswa.id}>...</tr>)
   ) : (
     <tr><td colSpan={5}>Tidak ada data siswa</td></tr>
   )}
   ```

6. Root Cause Kemungkinan:
   - Data dari API belum selesai loading saat component render
   - State initialization salah (undefined bukan [])
   - API response format berubah
```

### 2.2 Stack Trace Interpretation

Stack trace adalah **jejak panggilan fungsi** yang menunjukkan jalur eksekusi sebelum error terjadi. AI bisa membantu membaca stack trace yang kompleks:

```
Traceback (most recent call last):
  File "/app/src/main.py", line 12, in <module>
    app.run()
  File "/app/src/app.py", line 45, in run
    self.process_request(request)
  File "/app/src/app.py", line 78, in process_request
    result = self.handler.handle(request)
  File "/app/src/handlers/absensi_handler.py", line 23, in handle
    return self.input_absensi(request.data)
  File "/app/src/handlers/absensi_handler.py", line 56, in input_absensi
    siswa = self.repo.get_by_id(data['siswa_id'])
  File "/app/src/repositories/siswa_repo.py", line 34, in get_by_id
    return self.session.query(Siswa).filter_by(id=siswa_id).one()
  File "/usr/lib/python3.12/site-packages/sqlalchemy/orm/query.py", line 2759, in one
    raise exc.NoResultFound("No row was found for one()")
sqlalchemy.exc.NoResultFound: No row was found for one()
```

**AI membaca dari bawah ke atas:**

```
STACK TRACE ANALYSIS:

Error Chain (dari bawah ke atas):

1. ROOT CAUSE: sqlalchemy.exc.NoResultFound
   → Query database tidak menemukan row dengan ID tersebut
   → Lokasi: siswa_repo.py:34

2. Pemanggil: absensi_handler.py:56
   → input_absensi() memanggil repo.get_by_id() dengan siswa_id dari request
   → siswa_id tidak ada di database

3. Pemanggil: absensi_handler.py:23
   → handler.handle() memanggil input_absensi()

4. Pemanggil: app.py:78 → app.py:45 → main.py:12
   → Chain pemanggilan dari entry point

DIAGNOSIS:
- Siswa dengan ID tertentu tidak ditemukan di database
- Kemungkinan: ID salah, siswa sudah dihapus, atau data belum disinkronisasi

SOLUSI:
```python
# Di siswa_repo.py:34 — ganti .one() dengan .first() dan handle None
def get_by_id(self, siswa_id: int) -> Siswa | None:
    return self.session.query(Siswa).filter_by(id=siswa_id).first()

# Di absensi_handler.py:56 — handle kasus siswa tidak ditemukan
siswa = self.repo.get_by_id(data['siswa_id'])
if siswa is None:
    return {"error": f"Siswa dengan ID {data['siswa_id']} tidak ditemukan"}, 404
```
```

### 2.3 Root Cause Finding dengan AI

AI tidak hanya menunjukkan **di mana** error terjadi, tapi juga **mengapa** error terjadi dan **bagaimana** mencegahnya di masa depan.

#### Pola Root Cause Common:

| Pola Error | Root Cause Umum | Solusi |
|---|---|---|
| `KeyError` / `AttributeError` | Data tidak sesuai ekspektasi | Validasi input, defensive programming |
| `NoResultFound` / `NoneType` | Record tidak ada di database | Handle None case, gunakan `.first()` bukan `.one()` |
| `ConnectionError` | Database/server tidak reachable | Retry logic, connection pooling, health check |
| `TimeoutError` | Operasi terlalu lama | Timeout setting, async processing, pagination |
| `ValidationError` | Data tidak sesuai schema | Pydantic/Zod validation di entry point |
| `PermissionError` | Akses ditolak | Check permission sebelum operasi |
| `MemoryError` | Data terlalu besar | Pagination, streaming, chunking |

### 2.4 Debugging Strategies dengan AI

#### Strategi 1: Binary Search Debugging

Ketika bug ada di antara banyak baris kode, gunakan **binary search** untuk mengisolasi:

```
User: "Ada bug di fungsi process_data yang 200 baris.
Hasil output salah tapi tidak ada error.
Bantu temukan di mana bugnya."

AI: "Saya akan gunakan binary search debugging.
Mari kita tambahkan print statement di tengah fungsi (baris 100)
untuk cek apakah data di titik itu sudah benar atau belum."

# Step 1: Cek di tengah
print(f"DEBUG baris 100: data = {data}")

# Jika data di baris 100 SALAH → bug ada di baris 1-100
# Jika data di baris 100 BENAR → bug ada di baris 100-200

# Step 2: Cek di tengah range yang tersisa
# Ulangi sampai bug terisolasi
```

#### Strategi 2: Rubber Duck Debugging dengan AI

**Rubber duck debugging** adalah teknik di mana Anda menjelaskan kode baris per baris kepada sesuatu (tradisionalnya karet bebek). Proses menjelaskan sering kali membuat Anda menemukan bug sendiri.

Dengan AI, ini lebih efektif karena AI bisa **bertanya balik** dan **memberikan insight**:

```
User: "Saya akan jelaskan fungsi ini baris per baris.
Tolong tanya jika ada yang aneh."

def hitung_total_biaya(transaksi_list):
    total = 0
    for t in transaksi_list:
        if t.jenis == "pengeluaran":
            total += t.jumlah
        elif t.jenis == "pemasukan":
            total -= t.jumlah  # ← AI akan notice ini
    return total

AI: "Saya notice sesuatu yang aneh di baris 'total -= t.jumlah'.
Jika ini menghitung TOTAL BIAYA, seharusnya pemasukan TIDAK
mengurangi total biaya. Mungkin yang Anda maksud:
- total biaya = jumlah semua pengeluaran (abaikan pemasukan)
- ATAU ini seharusnya menghitung SALDO (pemasukan - pengeluaran)

Mana yang benar?"
```

#### Strategi 3: Logging dengan AI

AI bisa membantu setup logging yang proper:

```
User: "Tambahkan logging yang proper ke fungsi ini.
Saya butuh tahu:
1. Input apa yang masuk
2. Berapa lama prosesnya
3. Apakah ada error
4. Berapa hasil outputnya"

AI akan menambahkan:

import logging
import time

logger = logging.getLogger(__name__)

def hitung_total_biaya(transaksi_list):
    start_time = time.time()
    logger.info(f"Mulai hitung_total_biaya, {len(transaksi_list)} transaksi")

    try:
        total = 0
        for t in transaksi_list:
            if t.jenis == "pengeluaran":
                total += t.jumlah
            elif t.jenis == "pemasukan":
                total -= t.jumlah

        elapsed = time.time() - start_time
        logger.info(f"Selesai hitung_total_biaya, total={total}, waktu={elapsed:.3f}s")
        return total

    except Exception as e:
        elapsed = time.time() - start_time
        logger.error(f"Error di hitung_total_biaya: {e}, waktu={elapsed:.3f}s")
        raise
```

### 2.5 Common Debugging Patterns

Berikut adalah pola-pola debugging yang sering muncul dan cara AI membantu menyelesaikannya:

#### Pattern 1: Off-by-One Error

```python
# BUG: Loop berhenti 1 iterasi terlalu awal
for i in range(len(items) - 1):  # Seharusnya range(len(items))
    process(items[i])

# AI fix:
for i in range(len(items)):
    process(items[i])
# ATAU lebih Pythonic:
for item in items:
    process(item)
```

#### Pattern 2: Mutable Default Argument

```python
# BUG: Default argument mutable — shared across calls
def tambah_siswa(nama, siswa_list=[]):  # Seharusnya None
    siswa_list.append(nama)
    return siswa_list

# AI fix:
def tambah_siswa(nama, siswa_list=None):
    if siswa_list is None:
        siswa_list = []
    siswa_list.append(nama)
    return siswa_list
```

#### Pattern 3: Race Condition

```python
# BUG: Check-then-act race condition
if file_exists(path):          # Check
    with open(path) as f:      # Act — file bisa dihapus antara check dan act
        data = f.read()

# AI fix:
try:
    with open(path) as f:      # Langsung act, handle error
        data = f.read()
except FileNotFoundError:
    logger.warning(f"File tidak ditemukan: {path}")
    data = None
```

#### Pattern 4: SQL Injection

```python
# BUG: String concatenation di SQL query
query = f"SELECT * FROM siswa WHERE nama = '{nama}'"  # INJEKSI!

# AI fix:
query = "SELECT * FROM siswa WHERE nama = ?"
cursor.execute(query, (nama,))  # Parameterized query
```

#### Pattern 5: Floating Point Comparison

```python
# BUG: Floating point comparison dengan ==
if total == 100.0:  # Bisa fail karena floating point precision

# AI fix:
import math
if math.isclose(total, 100.0, abs_tol=1e-9):
    # Floating point comparison yang aman
```

---

## 🔧 BAGIAN 3: Test Automation Setup

### 3.1 Setup Testing Framework dengan AI

#### Python + pytest

```bash
# Install
pip install pytest pytest-cov pytest-asyncio httpx

# Buat struktur folder
mkdir tests tests/unit tests/integration
touch tests/__init__.py tests/conftest.py
```

**conftest.py — Shared Fixtures:**

```python
# tests/conftest.py
import pytest
import asyncio


@pytest.fixture
def sample_siswa():
    """Fixture data siswa untuk testing."""
    return {
        "nisn": "1234567890",
        "nama": "Ahmad Fauzi",
        "kelas": "6A",
        "tanggal_lahir": "2014-03-15",
    }


@pytest.fixture
def sample_guru():
    """Fixture data guru untuk testing."""
    return {
        "nip": "198501012010011001",
        "nama": "Siti Nurhaliza, S.Pd",
        "mata_pelajaran": "Matematika",
    }


@pytest.fixture(scope="session")
def event_loop():
    """Fixture untuk async test."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
```

**pytest.ini / pyproject.toml — Konfigurasi:**

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --tb=short --cov=src --cov-report=term-missing"
markers = [
    "slow: marks tests as slow (deselect with '-m \"not slow\"')",
    "integration: marks tests as integration tests",
]
```

#### JavaScript/TypeScript + Jest

```bash
# Install
npm install --save-dev jest @types/jest ts-jest

# Setup
npx ts-jest config:init
```

**jest.config.js:**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 3.2 CI Testing dengan AI

**Continuous Integration (CI)** memastikan test dijalankan otomatis setiap kali ada perubahan kode. AI bisa membantu setup CI/CD pipeline:

#### GitHub Actions — Python

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run linter
        run: |
          ruff check src/ tests/
          black --check src/ tests/

      - name: Run tests with coverage
        run: |
          pytest tests/ -v --cov=src --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage.xml
```

**Prompt untuk AI generate CI config:**

```
Buatkan GitHub Actions workflow untuk proyek Python FastAPI.
Requirements:
- Test di Python 3.11 dan 3.12
- Run linter (ruff + black)
- Run test dengan coverage
- Upload coverage ke Codecov
- Fail jika coverage di bawah 80%
- Run di setiap push ke main/develop dan setiap PR
```

#### GitHub Actions — JavaScript/TypeScript

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

### 3.3 AI-Assisted Test Maintenance

Test juga perlu di-maintain. AI bisa membantu:

**1. Update Test Ketika Kode Berubah:**

```
Saya refactor fungsi hitung_pajak — sekarang menerima parameter
baru 'kategori' dengan default 'reguler'. Update semua test
yang menggunakan fungsi ini.
```

**2. Hapus Test yang Tidak Relevan:**

```
Cek test di tests/test_legacy.py — apakah masih relevan dengan
kodebase saat ini? Hapus yang sudah tidak terpakai.
```

**3. Merge Duplicate Tests:**

```
Cek apakah ada test yang duplicate atau overlap di test suite.
Sarankan yang bisa di-merge atau dihapus.
```

**4. Generate Test dari Bug Report:**

```
Bug: Sistem menghitung pajak ganda untuk transaksi di atas 1 juta.
Fix sudah diterapkan. Buatkan regression test untuk memastikan
bug ini tidak muncul lagi.
```

---

## 📋 BEST PRACTICES: Testing & Debugging dengan AI

### Testing Best Practices

| Praktik | Penjelasan | Contoh |
|---|---|---|
| **Test First** | Tulis test sebelum implementasi | TDD dengan AI |
| **AAA Pattern** | Arrange-Act-Assert di setiap test | Setup → Call → Verify |
| **One Assertion Per Concept** | Satu test = satu konsep yang diuji | Bukan 10 assertion acak |
| **Descriptive Names** | Nama test menjelaskan apa yang diuji | `test_nisn_dimulai_nol_tidak_valid` |
| **Isolated Tests** | Test tidak depend pada test lain | Fresh fixture setiap test |
| **Fast Tests** | Unit test harus < 1 detik | Mock external services |
| **Coverage Target** | Minimal 80% coverage | `pytest --cov=src --cov-report=html` |
| **Test Edge Cases** | Bukan hanya happy path | Empty input, null, boundary values |

### Debugging Best Practices

| Praktik | Penjelasan | Contoh |
|---|---|---|
| **Reproduce First** | Pastikan bug bisa di-reproduce | "Bug terjadi saat X, Y, Z" |
| **Isolate Root Cause** | Temukan penyebab, bukan gejala | Stack trace analysis |
| **Fix + Test** | Setiap fix harus ada test baru | Regression test |
| **Don't Guess** | Gunakan data, bukan asumsi | Logging, debugging tools |
| **Document Bugs** | Catat bug dan solusinya | Issue tracker, wiki |
| **Pair Debug dengan AI** | Jelaskan kode ke AI, minta feedback | Rubber duck debugging |

### Referensi dari Sumber

Dari [`awattar/claude-code-best-practices`](https://github.com/awattar/claude-code-best-practices#-code-analysis--testing):

> **Code Analysis & Testing:**
> - Use `/test` command to run tests, analyze failures, and suggest fixes
> - Generate test cases before implementing features (test-first approach)
> - Use AI to identify edge cases you might have missed
> - Leverage AI for code review — ask it to find potential bugs
> - Use AI to explain complex error messages and stack traces

Dari [`feiskyer/claude-code-settings`](https://github.com/feiskyer/claude-code-settings):

> **Testing Configuration:**
> - Configure pytest/jest in project settings for consistent test runs
> - Use hooks to auto-run tests after code changes
> - Set up coverage thresholds to maintain quality
> - Use spec-kit-skill for test-driven spec development

---

## 🏫 CONTOH NYATA: Testing & Debugging untuk Administrasi Sekolah

### Contoh 1: Test Script Rekap Absensi

```python
# tests/test_rekap_absensi.py
import pytest
from datetime import datetime
from src.rekap_absensi import RekapAbsensi


class TestRekapAbsensi:
    """Test untuk script rekap absensi guru."""

    def test_rekap_hadir_semua(self):
        """Semua guru hadir = 100% kehadiran."""
        data = [
            {"nama": "Guru A", "status": "hadir"},
            {"nama": "Guru B", "status": "hadir"},
            {"nama": "Guru C", "status": "hadir"},
        ]
        rekap = RekapAbsensi(data)
        assert rekap.persentase_kehadiran == 100.0

    def test_rekap_sebagian_hadir(self):
        """2 dari 3 guru hadir = 66.67%."""
        data = [
            {"nama": "Guru A", "status": "hadir"},
            {"nama": "Guru B", "status": "sakit"},
            {"nama": "Guru C", "status": "hadir"},
        ]
        rekap = RekapAbsensi(data)
        assert pytest.approx(rekap.persentase_kehadiran, 0.01) == 66.67

    def test_rekap_data_kosong(self):
        """Data kosong = 0% kehadiran."""
        rekap = RekapAbsensi([])
        assert rekap.persentase_kehadiran == 0.0

    def test_export_excel(self, tmp_path):
        """Export rekap ke file Excel."""
        data = [
            {"nama": "Guru A", "status": "hadir"},
        ]
        rekap = RekapAbsensi(data)
        output_path = tmp_path / "rekap.xlsx"
        rekap.export_excel(str(output_path))
        assert output_path.exists()
```

### Contoh 2: Debug Script Download Dapodik

```
Error saat download data Dapodik:

requests.exceptions.ConnectionError: HTTPSConnectionPool(host='data.dapodik.kemdikbud.go.id', port=443):
Max retries exceeded with url: /api/v1/peserta_didik

Bantu debug error ini.

AI akan menganalisis:

1. Jenis Error: ConnectionError — tidak bisa connect ke server Dapodik
2. Penyebab: Server down, network issue, atau rate limiting
3. Solusi:
   - Tambahkan retry logic dengan backoff
   - Tambahkan timeout yang reasonable
   - Handle error dengan graceful fallback
   - Log error untuk troubleshooting

```python
import requests
from tenacity import retry, stop_after_attempt, wait_exponential
import logging

logger = logging.getLogger(__name__)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    reraise=True,
)
def download_data_dapodik(token: str, npsn: str) -> dict:
    """Download data dari Dapodik dengan retry logic."""
    url = f"https://data.dapodik.kemdikbud.go.id/api/v1/peserta_didik"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = requests.get(
            url,
            headers=headers,
            params={"npsn": npsn},
            timeout=30,  # 30 detik timeout
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        logger.error(f"Timeout saat download data Dapodik (NPSN: {npsn})")
        raise
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error saat download data Dapodik: {e}")
        raise
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error saat download data Dapodik: {e}")
        raise
```

---

## ✅ CHECKLIST

### Testing
- [ ] Paham testing pyramid (unit → integration → E2E)
- [ ] Bisa generate unit test dengan AI
- [ ] Paham dan bisa menerapkan TDD dengan AI (Red-Green-Refactor)
- [ ] Bisa setup integration test untuk API
- [ ] Tahu cara meningkatkan test coverage dengan AI
- [ ] Bisa melakukan test-driven refactoring
- [ ] Paham cara setup testing framework (pytest/Jest)
- [ ] Bisa setup CI testing dengan GitHub Actions

### Debugging
- [ ] Bisa menganalisis error message dengan AI
- [ ] Paham cara membaca dan interpret stack trace
- [ ] Bisa menemukan root cause dengan bantuan AI
- [ ] Tahu debugging strategies (binary search, rubber duck, logging)
- [ ] Mengenal common debugging patterns (off-by-one, mutable default, race condition, SQL injection, floating point)
- [ ] Bisa setup logging yang proper dengan AI

### Best Practices
- [ ] Selalu test-first sebelum implementasi
- [ ] Setiap fix bug → tambah regression test
- [ ] Target minimal 80% test coverage
- [ ] Gunakan AI untuk code review dan find potential bugs
- [ ] Dokumentasikan bug dan solusinya

---

## 📚 REFERENSI DAN SUMBER BELAJAR

### Dokumentasi Testing
- [pytest Documentation](https://docs.pytest.org/) — Testing framework Python
- [Jest Documentation](https://jestjs.io/) — Testing framework JavaScript
- [Playwright Documentation](https://playwright.dev/) — E2E testing
- [GitHub Actions](https://docs.github.com/en/actions) — CI/CD

### Referensi AI Testing
- [`awattar/claude-code-best-practices — Testing`](https://github.com/awattar/claude-code-best-practices#-code-analysis--testing)
- [`feiskyer/claude-code-settings — Scripts`](https://github.com/feiskyer/claude-code-settings#scripts)

### Debugging Resources
- [The Art of Debugging](https://www.jetbrains.com/guide/techniques/debugging/) — JetBrains guide
- [Rubber Duck Debugging](https://rubberduckdebugging.com/) — Teknik debugging klasik

---

> **Lanjut ke:** [`10-ringkasan-fase-2.md`](./10-ringkasan-fase-2.md)
