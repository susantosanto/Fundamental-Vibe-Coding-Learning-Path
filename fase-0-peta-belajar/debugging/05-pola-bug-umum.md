# 05 — Pola Bug Umum

> **Level:** Fondasi → Menengah
> **Waktu:** 55 menit
> **Yang Anda dapat:** mengenali bug dari **gejalanya**, sebelum menelusuri kode

---

## 📖 Kenapa pola itu penting

Orang yang berpengalaman tidak lebih cepat karena lebih pintar. Mereka lebih cepat karena **mengenali pola**.

Ketika Anda sudah melihat off-by-one 20 kali, melihat `len()` dipakai sebagai index membuat Anda langsung curiga. Anda tidak perlu menelusuri.

File ini adalah **katalog pola**. Setelah membacanya, setiap bug yang Anda temui akan masuk ke salah satu kategori — dan kategori mempersempit pencarian sebelum Anda menulis satu baris pun.

**Cara memakai file ini:**

1. Saat menghadapi bug, baca kolom **"Gejala"** sampai ada yang cocok dengan situasi Anda.
2. Baca bagian "Cara mengenali" untuk memastikan.
3. **Jangan** langsung pakai "Perbaikan" — pahami dulu **kenapa** pola itu terjadi.

---

## Ringkasan 12 pola

| # | Pola | Gejala khas |
|---|---|---|
| 1 | Off-by-one | Elemen terakhir/pertama hilang, atau `IndexError` |
| 2 | Mutable default | Data "nyangkut" dari pemanggilan sebelumnya |
| 3 | Null/None access | `AttributeError`, `TypeError: Cannot read properties of undefined` |
| 4 | Type coercion | Perbandingan aneh (`"5" > "10"` benar), penjumlahan jadi penggabungan |
| 5 | Race condition | Muncul hanya saat banyak request bersamaan |
| 6 | State bersama | Muncul setelah beberapa operasi sebelumnya |
| 7 | Floating point | Perbandingan `==` gagal pada angka yang "seharusnya sama" |
| 8 | Timezone / tanggal | Hasil beda 1 hari, beda di server vs lokal |
| 9 | Encoding | Teks aneh, karakter rusak, error baca file |
| 10 | Cache basi | Data lama muncul kembali setelah diubah |
| 11 | Resource leak | Melambat setelah beberapa jam, "too many connections" |
| 12 | Async ordering | Kode berjalan sebelum data siap |

---

## 1. Off-by-one

**Gejala:** elemen pertama atau terakhir hilang. Atau `IndexError: list index out of range`.

### Contoh

```python
# ❌ Loop berhenti 1 iterasi terlalu awal
for i in range(len(items) - 1):
    proses(items[i])
# → elemen TERAKHIR tidak pernah diproses

# ❌ Mengakses index yang tidak ada
data = [10, 20, 30]
return data[len(data)]        # IndexError — index valid: 0,1,2. len() = 3
```

### Cara mengenali

- Ada `len()`, `+1`, atau `-1` di dekat pengaksesan index
- `IndexError` atau `IndexOutOfBounds`
- Hasil "kurang satu" dari yang diharapkan
- Ada `<` padahal seharusnya `<=` (atau sebaliknya)

**Tanda paling kuat:** kalau Anda melihat `len()` dipakai sebagai index, itu **hampir selalu** bug. Index yang valid berakhir di `len() - 1`.

### Perbaikan

```python
# ✅ Loop biasa
for item in items:            # paling aman — tidak ada index sama sekali
    proses(item)

# ✅ Kalau butuh index
for i, item in enumerate(items):
    proses(i, item)

# ✅ Elemen terakhir
data[-1]                      # bukan data[len(data)]
```

**Pelajaran umum:** di banyak bahasa, cara paling aman adalah **menghindari index manual** sepenuhnya. Gunakan `for item in items`, `enumerate()`, `[-1]`, atau `slice`. Semakin sedikit index manual, semakin sedikit off-by-one.

---

## 2. Mutable default argument (Python)

**Gejala:** data "nyangkut" dari pemanggilan sebelumnya. Fungsi mengembalikan akumulasi dari panggilan-panggilan sebelumnya, bukan hanya yang sekarang.

### Contoh

```python
# ❌ Default argument mutable — dibuat SEKALI, dipakai bersama selamanya
def tambah_siswa(nama, siswa_list=[]):
    siswa_list.append(nama)
    return siswa_list

tambah_siswa("Ani")     # ['Ani']
tambah_siswa("Budi")    # ['Ani', 'Budi']  ← BUKAN ['Budi']
tambah_siswa("Cici")    # ['Ani', 'Budi', 'Cici']
```

### Kenapa terjadi

Default argument di Python dievaluasi **satu kali** saat fungsi didefinisikan, bukan setiap kali dipanggil. Jadi `[]` itu satu list yang sama, dipakai bersama oleh semua pemanggilan.

### Cara mengenali

- Fungsi mengembalikan data yang "seharusnya kosong" tapi tidak
- Hasil bertambah setiap kali fungsi dipanggil
- Data dari request/user A muncul di request/user B ← **ini serius, bisa jadi kebocoran data**
- Default parameter berupa `[]`, `{}`, atau `set()`

**Ini pola paling berbahaya di daftar ini** karena di aplikasi web, ia bisa membuat data satu pengguna terlihat oleh pengguna lain.

### Perbaikan

```python
# ✅ Pakai None sebagai sentinel
def tambah_siswa(nama, siswa_list=None):
    if siswa_list is None:
        siswa_list = []
    siswa_list.append(nama)
    return siswa_list
```

**Pola yang sama di bahasa lain:**

| Bahasa | Padanan |
|---|---|
| JavaScript | Default parameter objek: `function f(opts = {})` — objek dibuat ulang tiap panggilan, jadi **aman**. Tapi kalau Anda memodifikasi objek yang di-pass, itu masalah lain (lihat pola 6). |
| PHP | Default array di parameter juga dibuat ulang — aman. Tapi `static` variabel di dalam fungsi **tidak** aman. |
| Java | Field `static` yang mutable punya masalah serupa. |

---

## 3. Null / None access

**Gejala:** `AttributeError: 'NoneType' object has no attribute 'x'`, `TypeError: Cannot read properties of undefined`, `NoResultFound`.

### Contoh

```python
# ❌ Mengasumsikan data selalu ada
siswa = repo.get_by_id(siswa_id)
print(siswa.nama)                    # AttributeError kalau siswa = None
```

```javascript
// ❌ Sama di JavaScript
{siswaList.map(s => <tr>{s.nama}</tr>)}   // TypeError kalau siswaList undefined
```

### Cara mengenali

- `None` / `undefined` / `null` di pesan error
- `NoResultFound` / `404` yang tidak tertangani
- Muncul **hanya** untuk data tertentu (yang tidak ada)
- Muncul saat data belum selesai dimuat

### Perbaikan

```python
# ✅ Periksa eksplisit, dan putuskan apa yang harus terjadi
siswa = repo.get_by_id(siswa_id)
if siswa is None:
    return {"error": f"Siswa {siswa_id} tidak ditemukan"}, 404
print(siswa.nama)
```

```javascript
// ✅ Optional chaining (aman, tapi menyembunyikan masalah)
{siswaList?.map(s => <tr>{s.nama}</tr>)}

// ✅✅ Lebih baik: tangani keadaannya secara eksplisit
{siswaList && siswaList.length > 0
  ? siswaList.map(s => <tr>{s.nama}</tr>)
  : <tr><td>Tidak ada data siswa</td></tr>}
```

### Yang lebih penting daripada perbaikannya

Pertanyaan sebenarnya bukan "bagaimana menghindari crash", tapi **"kenapa `None` di sini, dan apakah itu wajar?"**

```
Wajar (data memang bisa tidak ada)  → tangani dengan pesan yang jelas
Tidak wajar (bug di tempat lain)    → jangan tangani; cari sumbernya
```

Kalau `siswa` seharusnya **selalu** ada, dan kadang `None` — itu bug di tempat lain, dan `if siswa is None: return` hanya akan menyembunyikannya.

**Di mana mencari:** `.one()` vs `.first()` (SQLAlchemy), `findOne` vs `find` (MongoDB), `get()` vs `[]` (dict). Method yang "menjamin ada" akan melempar error; method yang tidak, mengembalikan kosong. Pastikan Anda memilih yang sesuai maksud Anda.

---

## 4. Type coercion

**Gejala:** perbandingan yang hasilnya aneh. `"5" > "10"` mengembalikan `true`. Penjumlahan yang malah menggabungkan teks.

### Contoh

```python
# ❌ Input dari form selalu string
jumlah = input("Jumlah: ")         # "5"
total = jumlah + 10                # TypeError, atau "510" kalau tidak sengaja
```

```javascript
// ❌ JavaScript lebih berbahaya — tidak error, tapi hasilnya salah
"5" + 3        // "53"     ← penggabungan
"5" - 3        // 2        ← pengurangan (string dikonversi otomatis!)
"5" > "10"     // true     ← perbandingan teks, bukan angka
[] + {}        // "[object Object]"
```

### Cara mengenali

- Input dari form/query string/`request.args` — **selalu string**
- Perbandingan angka yang hasilnya tidak masuk akal
- Penjumlahan yang menghasilkan penggabungan teks
- `NaN` muncul di perhitungan
- Urutan "alfabetis" pada angka (1, 10, 100, 2, 20)

### Perbaikan

```python
# ✅ Konversi eksplisit di batas sistem
try:
    jumlah = int(request.args["jumlah"])
except (KeyError, ValueError):
    return {"error": "jumlah harus berupa angka"}, 400
```

```javascript
// ✅ Konversi + validasi
const jumlah = Number(req.query.jumlah);
if (Number.isNaN(jumlah)) {
  return res.status(400).json({ error: "jumlah harus berupa angka" });
}
```

**Prinsip:** konversi **di batas sistem** (saat data masuk), bukan di tengah logika. Setelah lewat batas, Anda boleh mengasumsikan tipenya benar.

**Cara terbaik:** pakai validasi skema (Pydantic, Zod, class-validator). Ia mengubah tipe **dan** memvalidasi sekaligus, di satu tempat.

---

## 5. Race condition

**Gejala:** bug muncul **hanya** saat banyak operasi bersamaan. Hilang saat diuji satu-satu. Sering hilang juga saat Anda memakai debugger (karena debugger memperlambat eksekusi).

### Contoh

```python
# ❌ Check-then-act: kondisi bisa berubah antara "check" dan "act"
if stok_barang > 0:
    # ← proses lain bisa mengurangi stok di sini
    kurangi_stok(1)
# → stok bisa jadi negatif
```

```python
# ❌ Dua request menambah counter secara bersamaan
counter = ambil_counter()      # request A: 5, request B: 5
counter += 1                   # A: 6, B: 6
simpan_counter(counter)        # hasil akhir: 6, padahal harusnya 7
```

### Cara mengenali

- Muncul hanya saat bersamaan / dengan beban
- **Hilang saat di-debug** ← ciri paling khas
- Tidak bisa direproduksi satu-satu
- Data yang tidak konsisten (stok negatif, counter salah)

### Perbaikan

**Tiga tingkat, dari paling mudah ke paling benar:**

```python
# Tingkat 1: kunci di level aplikasi (hanya untuk satu proses)
import threading
lock = threading.Lock()

with lock:
    if stok_barang > 0:
        kurangi_stok(1)
```

```sql
-- Tingkat 2: operasi atomik di database ← INI YANG PALING BENAR
UPDATE barang SET stok = stok - 1 WHERE id = 1 AND stok > 0;
-- Kalau 0 baris terpengaruh → stok tidak cukup, tangani itu
```

```python
# Tingkat 3: transaction + row lock
with db.transaction():
    barang = db.query(Barang).filter_by(id=1).with_for_update().first()
    if barang.stok > 0:
        barang.stok -= 1
```

**Prinsip umum:** jangan pernah "check-then-act" pada data yang bisa diubah proses lain. Gabungkan check dan act menjadi **satu operasi atomik**.

---

## 6. State bersama (shared mutable state)

**Gejala:** muncul setelah beberapa operasi sebelumnya. Data dari satu request/user muncul di request/user lain.

### Contoh

```python
# ❌ Variabel di level modul — dipakai bersama semua request
current_user = None

def set_user(user):
    global current_user
    current_user = user       # request A menimpa request B

def get_current_user():
    return current_user       # ← bisa mengembalikan user yang salah
```

### Cara mengenali

- Data "bocor" antar request/user ← **ini masalah keamanan, bukan hanya bug**
- Hasil bergantung pada urutan pemanggilan sebelumnya
- Bug hilang setelah restart
- Muncul lebih sering saat trafik naik

### Perbaikan

```python
# ✅ Simpan state per-request, bukan global
from flask import g

def set_user(user):
    g.current_user = user     # terikat pada request saat ini

def get_current_user():
    return g.current_user
```

**Prinsip:** state yang terkait satu permintaan harus **terikat pada permintaan itu**, bukan pada modul. Di aplikasi web, ini bukan sekadar soal kebenaran — ini soal isolasi data antar pengguna.

**Cara mengenali cepat:** cari variabel yang didefinisikan di level modul dan **diubah** (bukan hanya dibaca). Kalau ada, curigai.

---

## 7. Floating point

**Gejala:** perbandingan `==` gagal pada angka yang "seharusnya sama". Hasil penjumlahan punya ekor aneh.

### Contoh

```python
0.1 + 0.2 == 0.3            # False!
0.1 + 0.2                   # 0.30000000000000004

# ❌ Perbandingan langsung
if total == 100.0:          # bisa gagal meskipun "seharusnya" 100
    kirim_notifikasi()
```

### Kenapa terjadi

Bilangan pecahan disimpan dalam biner. Banyak angka desimal tidak bisa direpresentasikan persis — sama seperti `1/3` tidak bisa ditulis persis dalam desimal.

### Cara mengenali

- Perbandingan `==` pada bilangan pecahan
- Hasil perhitungan uang dengan ekor aneh (`1234.5600000000002`)
- Total yang tidak sama dengan jumlah komponennya

### Perbaikan

```python
import math

# ✅ Perbandingan dengan toleransi
if math.isclose(total, 100.0, abs_tol=1e-9):
    kirim_notifikasi()

# ✅✅ Untuk UANG: pakai integer (satuan terkecil), jangan float
harga_sen = 1500000        # Rp 15.000,00 dalam satuan sen
total_sen = harga_sen * 3
print(f"Rp {total_sen / 100:,.2f}")

# ✅ Atau pakai Decimal
from decimal import Decimal
harga = Decimal("15000.00")
```

**Aturan praktis:** **jangan pernah** memakai float untuk uang. Pakai integer (satuan terkecil) atau `Decimal`. Ini bukan soal presisi — ini soal uang yang tidak cocok.

---

## 8. Timezone & tanggal

**Gejala:** hasil beda 1 hari. Beda antara lokal dan server. Laporan bulanan salah di batas bulan.

### Contoh

```python
# ❌ Tanggal tanpa zona waktu
from datetime import datetime
sekarang = datetime.now()          # waktu lokal server — mana?
# Server di UTC, user di WIB (UTC+7):
# 1 Januari 00:30 WIB = 31 Desember 17:30 UTC
# → transaksi tercatat di bulan yang salah
```

```javascript
// ❌ JavaScript
new Date("2026-01-01")             // ditafsirkan sebagai UTC
new Date("2026-01-01T00:00")       // ditafsirkan sebagai waktu lokal
// ← dua hal berbeda, dari string yang mirip
```

### Cara mengenali

- Hasil beda 1 hari
- Beda antara lokal dan server
- Laporan bulanan/tahunan salah di batas periode
- Muncul pada jam-jam tertentu saja (tengah malam)
- Zona waktu Indonesia: **WIB (UTC+7), WITA (UTC+8), WIT (UTC+9)** — tiga zona berbeda!

### Perbaikan

```python
# ✅ Simpan dalam UTC, konversi saat menampilkan
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

sekarang_utc = datetime.now(timezone.utc)              # simpan ini
waktu_wib = sekarang_utc.astimezone(ZoneInfo("Asia/Jakarta"))   # tampilkan ini
```

```javascript
// ✅ JavaScript
const sekarang = new Date();          // selalu UTC di dalam
const waktuLokal = sekarang.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
```

**Tiga aturan:**
1. **Simpan** dalam UTC
2. **Konversi** hanya saat menampilkan atau saat membandingkan dengan tanggal lokal
3. **Selalu** sertakan zona waktu secara eksplisit — jangan pernah "tanggal polos"

**Untuk tanggal saja (tanpa jam)** — seperti tanggal lahir atau tanggal absensi — simpan sebagai tanggal murni (`DATE`, bukan `TIMESTAMP`). Tanggal lahir tidak punya zona waktu.

---

## 9. Encoding

**Gejala:** teks aneh (`Ã©`, `â€œ`). Error saat membaca file. Karakter hilang.

### Contoh

```python
# ❌ Membaca file tanpa menentukan encoding
with open("data.csv") as f:        # di Windows default-nya cp1252, bukan UTF-8
    data = f.read()
# → UnicodeDecodeError, atau karakter rusak
```

### Cara mengenali

- `UnicodeDecodeError` / `UnicodeEncodeError`
- Karakter aneh seperti `Ã©`, `â€™`, `Ã¢â‚¬â„¢`
- Muncul di Windows tapi tidak di Linux (atau sebaliknya) ← **ciri paling khas**
- Karakter khusus (emoji, aksen, huruf non-Latin) rusak

### Perbaikan

```python
# ✅ Selalu tentukan encoding secara eksplisit
with open("data.csv", encoding="utf-8") as f:
    data = f.read()

with open("output.csv", "w", encoding="utf-8") as f:
    f.write(data)
```

**Aturan:** **selalu** tulis `encoding="utf-8"` saat membuka file. Tidak ada pengecualian. Default platform berbeda-beda (Windows vs Linux), dan itu sumber bug yang sulit dilacak karena hanya muncul di satu lingkungan.

---

## 10. Cache basi

**Gejala:** data lama muncul kembali setelah diubah. Perubahan tidak terlihat sampai restart atau tunggu beberapa saat.

### Contoh

```python
# ❌ Cache tidak dihapus saat data berubah
@cache
def get_profil(siswa_id):
    return db.query(Siswa).get(siswa_id)

def update_profil(siswa_id, data):
    db.update(siswa_id, data)
    # ← cache lama masih ada! get_profil() masih mengembalikan data lama
```

```javascript
// ❌ Sama di frontend
const [siswa, setSiswa] = useState(dataAwal);
// update di server, tapi state lokal tidak di-refresh
```

### Cara mengenali

- Data lama muncul kembali
- Perubahan baru terlihat setelah restart / tunggu
- Beda antara hasil "pertama kali" dan "kedua kali"
- Muncul di lingkungan dengan cache (produksi) tapi tidak di lokal

### Perbaikan

```python
# ✅ Hapus cache saat data berubah
def update_profil(siswa_id, data):
    db.update(siswa_id, data)
    get_profil.cache_clear()        # atau invalidate key spesifik
```

**Kebijaksanaan umum:**

> Ada dua hal sulit dalam ilmu komputer: **invalidasi cache** dan **memberi nama**.
> — atribut klasik di komunitas pemrograman

**Saran praktis:** mulailah **tanpa** cache. Tambahkan cache hanya ketika Anda sudah mengukur bahwa ada masalah kecepatan. Cache menambah satu sumber kebenaran baru, dan setiap sumber kebenaran tambahan adalah tempat bug bersembunyi.

---

## 11. Resource leak

**Gejala:** aplikasi melambat setelah beberapa jam. `Too many connections`. `Too many open files`.

### Contoh

```python
# ❌ Koneksi tidak ditutup kalau terjadi error
def ambil_data():
    conn = buka_koneksi()
    hasil = conn.query("SELECT ...")    # ← kalau ini error, conn tidak pernah ditutup
    conn.close()
    return hasil
```

### Cara mengenali

- Melambat seiring waktu (bukan langsung)
- `Too many connections` / `Too many open files`
- Bug hilang setelah restart
- Muncul setelah berjalan berjam-jam/hari

### Perbaikan

```python
# ✅ Context manager — selalu menutup, bahkan saat error
def ambil_data():
    with buka_koneksi() as conn:
        return conn.query("SELECT ...")

# ✅ Untuk file
with open("data.txt") as f:
    data = f.read()
```

```javascript
// ✅ try/finally kalau tidak ada context manager
try {
  const conn = await pool.getConnection();
  return await conn.query("SELECT ...");
} finally {
  conn.release();          // ← selalu jalan, bahkan saat error
}
```

**Aturan:** setiap resource yang dibuka harus ditutup di `finally` (atau `with`/`defer`). Tidak boleh ada jalan keluar yang melewatinya.

---

## 12. Async ordering

**Gejala:** kode berjalan sebelum data siap. Nilai `undefined`/`None` padahal data seharusnya ada.

### Contoh

```javascript
// ❌ Lupa await
async function ambilSiswa() {
  const response = fetch("/api/siswa");     // ← tidak ada await!
  const data = response.json();             // response masih Promise
  return data;                              // Promise, bukan data
}
```

```javascript
// ❌ Lupa menunggu di dalam loop
siswaList.forEach(async (s) => {
  await simpan(s);          // forEach tidak menunggu async callback
});
console.log("selesai");     // ← jalan SEBELUM semua simpan selesai
```

### Cara mengenali

- `undefined` / `None` / `Promise { <pending> }` di tempat yang seharusnya ada data
- Kode "selesai" terlalu cepat
- Muncul di JavaScript/TypeScript, atau di kode Python async
- Data muncul di render kedua, tidak di render pertama

### Perbaikan

```javascript
// ✅ await di mana-mana
async function ambilSiswa() {
  const response = await fetch("/api/siswa");
  return await response.json();
}

// ✅ Untuk loop yang perlu menunggu
for (const s of siswaList) {
  await simpan(s);            // for...of menunggu dengan benar
}
// atau paralel:
await Promise.all(siswaList.map(s => simpan(s)));
```

```python
# ✅ Python
hasil = await ambil_data()      # jangan lupa await
```

**Aturan:** kalau fungsinya `async`, dan Anda memanggilnya, **selalu** tanya: "apakah saya perlu `await` di sini?" Lupa `await` tidak menghasilkan error di JavaScript — hanya `Promise` yang tidak diharapkan, dan bug yang muncul jauh dari sumbernya.

---

## Tabel rujukan cepat: gejala → pola

| Gejala | Pola yang dicurigai |
|---|---|
| `IndexError` | 1. Off-by-one |
| Data nyangkut antar pemanggilan | 2. Mutable default |
| Data bocor antar user | 2 atau 6. Mutable default / state bersama |
| `NoneType has no attribute` | 3. Null access |
| Perbandingan angka aneh | 4. Type coercion |
| Hanya saat bersamaan | 5. Race condition |
| Hilang saat di-debug | 5. Race condition |
| Hasil beda 1 hari | 8. Timezone |
| Karakter rusak, beda OS | 9. Encoding |
| Data lama muncul kembali | 10. Cache basi |
| Melambat setelah berjam-jam | 11. Resource leak |
| `Promise { <pending> }` | 12. Async ordering |
| Perbandingan `==` gagal pada angka | 7. Floating point |

---

## Pola yang belum masuk daftar (tapi patut dikenal)

| Pola | Gejala |
|---|---|
| **Shadowing variabel** | Nilai tidak berubah meskipun sudah diubah — ada variabel lokal dengan nama sama yang menutupi |
| **Mutasi array saat iterasi** | Elemen terlewat saat menghapus di dalam loop |
| **`==` vs `is` (Python)** | `is` untuk identitas, `==` untuk nilai. Salah pakai → hasil tak terduga |
| **String vs bytes** | Error `can only concatenate str (not "bytes") to str` |
| **SQL injection** | Bukan "bug" — kerentanan. Selalu pakai parameterized query |
| **Unhandled promise rejection** | Aplikasi diam-diam gagal, tidak ada error yang terlihat |
| **Infinite loop** | Aplikasi hang. Biasanya kondisi loop tidak pernah menjadi false |
| **Rekursi tanpa batas** | `RecursionError` / stack overflow |

---

## Cara memakai katalog ini dengan benar

**Yang salah:**
> Baca daftarnya, hafalkan, lalu saat ada bug coba cocokkan.

**Yang benar:**
> Saat menghadapi bug, tulis gejalanya **dalam kalimat Anda sendiri**. Lalu tanya: "pola mana yang menghasilkan gejala seperti ini?" Buka pola itu, baca **kenapa** ia terjadi — bukan hanya perbaikannya.

Yang benar-benar membangun kemampuan bukan menghafal daftar, tapi **memahami mekanisme**. Kalau Anda paham *kenapa* mutable default itu masalah, Anda akan mengenalinya di bahasa apa pun — bahkan di bahasa yang tidak punya fitur itu, karena masalah sebenarnya adalah "state yang dibagi tanpa disadari".

---

## Setelah katalog ini

Katalog ini punya ~12 pola. Setelah Anda memecahkan ~20 bug nyata dengan jurnal debugging (lihat `03`), Anda akan punya katalog **pribadi** — pola yang spesifik untuk stack dan domain Anda. Itu jauh lebih berharga daripada daftar umum mana pun.

**Mulai sekarang:** setiap kali Anda menemukan bug yang butuh >20 menit, tulis di jurnal: gejala → akar → pelajaran. Setelah 20 catatan, baca ulang semuanya sekaligus. Anda akan menemukan pola yang berulang — dan itu prioritas belajar Anda yang sebenarnya.

---

> **Lanjut ke:** [`06-debugging-kode-buatan-ai.md`](./06-debugging-kode-buatan-ai.md) — konteks Anda yang sebenarnya.
