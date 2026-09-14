# 07 — Latihan Bertahap Debugging

> **Level:** Fondasi → Menengah
> **Waktu:** 6–8 jam total (12 latihan × ~30 menit)
> **Yang Anda dapat:** kemampuan debugging yang terbentuk dari pengalaman, bukan bacaan

---

## 📖 Cara memakai file ini

Debugging adalah kemampuan **prosedural**. Membacanya tidak cukup — sama seperti membaca tentang berenang tidak membuat Anda bisa berenang.

12 latihan di bawah berjenjang dari sangat mudah sampai sulit. Semuanya **self-contained**: kodenya sudah disediakan, Anda tinggal salin dan jalankan.

### Aturan mengerjakan (jangan dilanggar)

```
1. Baca GEJALA-nya saja. Jangan baca "pelajaran"-nya dulu.
2. Sebelum menyentuh kode:
   a. Tulis HIPOTESIS Anda: "saya tebak ini terjadi karena ___"
   b. Tulis PREDIKSI: "kalau benar, maka ___ harus ___"
3. Baru jalankan dan selidiki, pakai prosedur REDUCE dari file 03.
4. Setelah ketemu: tulis apa hipotesis pertama Anda, dan apa yang sebenarnya.
5. Baru buka bagian "Pembahasan".
```

**Langkah 2 dan 4 itu inti latihannya.** Kalau Anda melompatinya, Anda hanya menyelesaikan teka-teki — bukan melatih kemampuan.

### Cara mengerjakan

Salin kode setiap latihan ke satu file (misalnya `latihan_debug.py`), jalankan, lalu debug.

```bash
python latihan_debug.py
```

---

## Peta latihan

| # | Level | Topik | Apakah muncul error? |
|---|---|---|---|
| 1 | ⚪ Warmup | Typo / nama salah | Ya, jelas |
| 2 | ⚪ Warmup | Off-by-one | **Tidak** — hasil salah |
| 3 | 🟢 Mudah | Mutable default | **Tidak** — data nyangkut |
| 4 | 🟢 Mudah | Type coercion | **Tidak** — hasil salah |
| 5 | 🟢 Mudah | None access | Ya |
| 6 | 🟡 Sedang | Floating point | **Tidak** — perbandingan gagal |
| 7 | 🟡 Sedang | Logika bisnis | **Tidak** — hasil salah |
| 8 | 🟡 Sedang | Error ditelan | Ya, tapi **jauh dari sumbernya** |
| 9 | 🟠 Sulit | Timezone | **Tidak** — salah 1 hari |
| 10 | 🟠 Sulit | Cache basi | **Tidak** — data lama |
| 11 | 🔴 Lanjut | State bersama | **Tidak** — bocor antar objek |
| 12 | 🔴 Lanjut | Review kode AI | Campuran — 4 bug |

Perhatikan: **7 dari 12 tidak memunculkan error sama sekali.** Itu realitas debugging yang sebenarnya — dan alasannya file `05-pola-bug-umum.md` menekankan pengenalan **gejala**, bukan pesan error.

---

## Latihan 1 — Warmup: typo

**Gejala:** `NameError` saat menjalankan.

```python
def hitung_rata_rata(nilai_list):
    total = sum(nilai_list)
    return total / len(nilai_lis)

print(hitung_rata_rata([80, 90, 100]))
```

<details>
<summary>Pembahasan</summary>

**Jenis:** error runtime, keluarga paling mudah.

**Yang terjadi:** `nilai_lis` (tanpa `t`) tidak pernah didefinisikan.

**Pelajaran:** baca pesan error sampai habis. `NameError: name 'nilai_lis' is not defined` memberi tahu Anda **persis** nama yang salah. Ini latihan untuk membiasakan diri membaca, bukan menebak.

**Perbaikan:** `len(nilai_list)`.

**Catatan:** IDE modern akan menandai ini sebelum Anda menjalankan. Biasakan memperhatikan garis bawah merah di editor — itu debugging gratis.
</details>

---

## Latihan 2 — Off-by-one

**Gejala:** fungsi mencari nilai tertinggi, tapi **kadang** mengembalikan nilai yang salah. Tidak ada error.

```python
def cari_tertinggi(nilai_list):
    """Cari nilai tertinggi dalam daftar."""
    tertinggi = nilai_list[0]
    for i in range(len(nilai_list) - 1):
        if nilai_list[i] > tertinggi:
            tertinggi = nilai_list[i]
    return tertinggi

print(cari_tertinggi([3, 5, 9]))    # Harapan: 9
```

<details>
<summary>Pembahasan</summary>

**Output:** `5`, bukan `9`.

**Kenapa:** `range(len(nilai_list) - 1)` untuk `[3, 5, 9]` menghasilkan `range(2)` → `i` = `0, 1`. Index `2` (nilai `9`) **tidak pernah diperiksa**.

**Pelajaran paling penting:** off-by-one **sering tidak memunculkan error**. Ia hanya menghasilkan jawaban yang salah. Karena itu bug jenis ini paling berbahaya — Anda hanya menemukannya kalau menguji dengan data yang jawabannya Anda tahu.

Perhatikan juga: `cari_tertinggi([3, 5])` akan **benar** (index 0,1 diperiksa, tapi loop cuma sampai 0... tunggu). Mari periksa: `len=2` → `range(1)` → `i=0`. Jadi `tertinggi=3`, dan `5` tidak diperiksa. Hasil `3`. **Salah juga.** Bagus — berarti bug ini muncul untuk hampir semua input, tapi Anda tidak sadar karena tidak mengujinya.

**Perbaikan:**

```python
def cari_tertinggi(nilai_list):
    tertinggi = nilai_list[0]
    for nilai in nilai_list:              # ← tidak ada index manual sama sekali
        if nilai > tertinggi:
            tertinggi = nilai
    return tertinggi
```

Atau paling sederhana: `max(nilai_list)`.

**Tanda pengenal untuk diingat:** kalau Anda melihat `len()` dikombinasikan dengan `-1` atau `+1` di dekat loop atau index, periksa batasnya.
</details>

---

## Latihan 3 — Mutable default

**Gejala:** data "nyangkut" dari pemanggilan sebelumnya. Tidak ada error.

```python
def tambah_mapel(mapel, daftar_mapel=[]):
    daftar_mapel.append(mapel)
    return daftar_mapel

print(tambah_mapel("Matematika"))   # Harapan: ['Matematika']
print(tambah_mapel("IPA"))          # Harapan: ['IPA']
print(tambah_mapel("IPS"))          # Harapan: ['IPS']
```

<details>
<summary>Pembahasan</summary>

**Output:**
```
['Matematika']
['Matematika', 'IPA']              ← harusnya ['IPA']
['Matematika', 'IPA', 'IPS']       ← harusnya ['IPS']
```

**Kenapa:** di Python, default argument dievaluasi **satu kali** saat fungsi didefinisikan, bukan setiap pemanggilan. Jadi `[]` itu **satu list yang sama**, dipakai bersama selamanya.

**Pelajaran:** ini pola paling berbahaya di katalog, karena di aplikasi web ia bisa membuat **data satu pengguna terlihat oleh pengguna lain**. Bukan hanya bug — ini masalah keamanan.

**Perbaikan:**

```python
def tambah_mapel(mapel, daftar_mapel=None):
    if daftar_mapel is None:
        daftar_mapel = []
    daftar_mapel.append(mapel)
    return daftar_mapel
```

**Verifikasi pemahaman:** kenapa `daftar_mapel=None` lalu dibuat di dalam berhasil, sedangkan `daftar_mapel=[]` tidak? Karena `None` itu **immutable** — ia tidak bisa berubah, jadi tidak ada state yang bisa nyangkut. List baru dibuat setiap pemanggilan.

**Tanda pengenal:** default parameter berupa `[]`, `{}`, `set()`, atau objek mutable apa pun. Cari ini dulu setiap kali Anda me-review kode AI.
</details>

---

## Latihan 4 — Type coercion

**Gejala:** mencari harga termahal, tapi hasilnya bukan yang termahal. Tidak ada error.

```python
def cari_termahal(daftar_harga):
    """Cari harga termahal dari daftar harga."""
    termahal = daftar_harga[0]
    for harga in daftar_harga:
        if harga > termahal:
            termahal = harga
    return termahal

# Data dari form/CSV — semuanya string
harga = ["15000", "20000", "5000", "100000"]
print(cari_termahal(harga))    # Harapan: "100000"
```

<details>
<summary>Pembahasan</summary>

**Output:** `"5000"` — dan itu **bukan** yang termahal.

**Kenapa:** semua nilainya string, jadi perbandingan `>` memakai urutan **leksikografis** (seperti urutan kamus), bukan numerik.

```
"5000" > "20000"  →  True   karena '5' > '2' sebagai karakter
"15000" > "20000" →  False  karena '1' < '2'
```

Jadi program menyimpulkan `"5000"` adalah yang terbesar. Logikanya benar; **tipe datanya salah**.

**Pelajaran:** data dari form, query string, CSV, dan JSON sering berupa string meskipun terlihat seperti angka. **Konversi di batas sistem**, saat data masuk — bukan di tengah logika.

**Perbaikan:**

```python
# ✅ Konversi di batas sistem
def cari_termahal(daftar_harga):
    termahal = float(daftar_harga[0])
    for harga in daftar_harga:
        nilai = float(harga)           # atau konversi sekali di awal
        if nilai > termahal:
            termahal = nilai
    return termahal
```

**Lebih baik lagi:** konversi sekali saat data masuk, lalu seluruh kode boleh mengasumsikan tipenya sudah benar.

**Tanda pengenal:** angka yang datang dari luar sistem (form, file, API) — **selalu** curigai tipenya. Cara cepat memeriksa: `print(type(x), repr(x))`.
</details>

---

## Latihan 5 — None access

**Gejala:** crash saat menampilkan profil siswa tertentu.

```python
DATABASE = {
    1: {"nama": "Ani", "kelas": "6A"},
    2: {"nama": "Budi", "kelas": "6B"},
}

def tampilkan_profil(siswa_id):
    siswa = DATABASE.get(siswa_id)
    return f"{siswa['nama']} - Kelas {siswa['kelas']}"

print(tampilkan_profil(1))     # OK
print(tampilkan_profil(99))    # ← ?
```

<details>
<summary>Pembahasan</summary>

**Error:** `TypeError: 'NoneType' object is not subscriptable`

**Kenapa:** `DATABASE.get(99)` mengembalikan `None` (bukan error), lalu `siswa['nama']` mencoba mengakses key pada `None`.

**Pelajaran:** `.get()` mengembalikan `None` untuk key yang tidak ada. Itu **desain yang benar** — tapi Anda harus menanganinya.

**Perbaikan — dan ini bagian yang lebih penting daripada perbaikannya:**

```python
def tampilkan_profil(siswa_id):
    siswa = DATABASE.get(siswa_id)
    if siswa is None:
        return f"Siswa dengan ID {siswa_id} tidak ditemukan"
    return f"{siswa['nama']} - Kelas {siswa['kelas']}"
```

**Pertanyaan yang harus Anda ajukan:** *"apakah `None` di sini wajar?"*

```
Wajar  (siswa_id memang bisa tidak ada) → tangani dengan pesan yang jelas ✅
Tidak wajar (siswa harusnya selalu ada) → jangan tangani; cari kenapa None
```

Kalau `siswa_id` datang dari halaman detail yang seharusnya selalu valid, dan tiba-tiba `None` — itu bug di tempat lain. Menambahkan `if siswa is None: return "tidak ditemukan"` hanya akan **menyembunyikan** bug itu.

**Ini bedanya "memperbaiki gejala" dan "memperbaiki akar"** (lihat file `01`).
</details>

---

## Latihan 6 — Floating point

**Gejala:** pembayaran yang seharusnya lunas dianggap belum lunas. Tidak ada error.

```python
def apakah_lunas(cicilan_list, total_tagihan):
    total_dibayar = sum(cicilan_list)
    return total_dibayar == total_tagihan

print(apakah_lunas([0.1, 0.1, 0.1], 0.3))    # Harapan: True
```

<details>
<summary>Pembahasan</summary>

**Output:** `False`.

**Kenapa:**

```python
>>> 0.1 + 0.1 + 0.1
0.30000000000000004
>>> 0.30000000000000004 == 0.3
False
```

Bilangan pecahan disimpan dalam biner. `0.1` tidak bisa direpresentasikan persis — sama seperti `1/3` tidak bisa ditulis persis dalam desimal.

**Pelajaran:** **jangan pernah** memakai `==` untuk bilangan pecahan. Dan lebih penting: **jangan pernah memakai float untuk uang.**

**Perbaikan — dua tingkat:**

```python
# Tingkat 1: perbandingan dengan toleransi (cukup untuk perhitungan ilmiah)
import math
def apakah_lunas(cicilan_list, total_tagihan):
    return math.isclose(sum(cicilan_list), total_tagihan, abs_tol=1e-9)
```

```python
# Tingkat 2: ✅✅ untuk UANG — pakai integer (satuan terkecil)
def apakah_lunas(cicilan_sen, total_sen):
    """Semua nilai dalam satuan sen."""
    return sum(cicilan_sen) == total_sen

# Rp 33.333,33 → 3333333 sen
print(apakah_lunas([3333333, 3333333, 3333334], 10000000))   # True
```

**Kenapa tingkat 2 lebih baik:** dengan integer, tidak ada pembulatan sama sekali. Ini bukan soal presisi akademis — ini soal uang yang tidak cocok.

**Tanda pengenal:** setiap kali Anda melihat `float`, `==`, dan uang/total dalam satu fungsi — curigai.
</details>

---

## Latihan 7 — Logika bisnis

**Gejala:** laporan keuangan menunjukkan total biaya yang lebih kecil dari seharusnya. Tidak ada error.

```python
def hitung_total_biaya(transaksi_list):
    """Hitung total BIAYA (semua pengeluaran)."""
    total = 0
    for t in transaksi_list:
        if t["jenis"] == "pengeluaran":
            total += t["jumlah"]
        elif t["jenis"] == "pemasukan":
            total -= t["jumlah"]        # ← perhatikan baris ini
    return total

transaksi = [
    {"jenis": "pengeluaran", "jumlah": 100000},
    {"jenis": "pemasukan",   "jumlah": 50000},
    {"jenis": "pengeluaran", "jumlah": 30000},
]
print(hitung_total_biaya(transaksi))    # Harapan: 130000 (total biaya)
```

<details>
<summary>Pembahasan</summary>

**Output:** `80000` (100000 − 50000 + 30000), bukan `130000`.

**Kenapa:** kode menghitung **saldo** (pemasukan − pengeluaran), padahal nama dan docstring-nya bilang **total biaya**. Fungsi mengerjakan hal yang berbeda dari yang diklaimnya.

**Pelajaran:** ini contoh paling murni dari **mode kegagalan "plausible tapi salah"** kode AI (lihat file `06`). Mengurangkan pemasukan itu masuk akal **secara umum** — tapi bukan yang diminta di sini.

Kode seperti ini adalah alasan mengapa **docstring dan nama fungsi harus diperiksa terhadap isinya**, bukan dipercaya begitu saja.

**Perbaikan:**

```python
def hitung_total_biaya(transaksi_list):
    """Hitung total BIAYA (semua pengeluaran)."""
    return sum(
        t["jumlah"] for t in transaksi_list
        if t["jenis"] == "pengeluaran"
    )
```

**Bagaimana menemukannya lebih cepat:** uji dengan data yang jawabannya jelas di kepala Anda.

```
Input:  [pengeluaran 100, pemasukan 50]
Harapan: 100
Hasil:   50      ← salah. Ketahuan dalam 5 detik.
```

Ini alasan `06` menekankan: **jalankan dulu dengan angka yang Anda tahu, baca kodenya kemudian.**
</details>

---

## Latihan 8 — Error yang ditelan

**Gejala:** aplikasi tidak crash, tapi kadang menghasilkan `None` — dan crash terjadi **jauh** dari sumber masalahnya.

```python
KONFIG = {
    "nama_sekolah": "SD Negeri Pasirhalang",
    "tahun_ajaran": "2026/2027",
}

def ambil_setting(nama):
    try:
        return KONFIG[nama]
    except:
        return None

def buat_header():
    nama = ambil_setting("nama_sekolah")
    tahun = ambil_setting("tahun_ajran")        # ← typo: "ajran"
    return f"{nama.upper()} — TA {tahun.strip()}"

print(buat_header())
```

<details>
<summary>Pembahasan</summary>

**Error:** `AttributeError: 'NoneType' object has no attribute 'strip'` — di baris `tahun.strip()`.

**Tapi akar masalahnya:** typo `"tahun_ajran"` di baris sebelumnya. Error hanya **menunjuk ke tempat crash**, bukan ke tempat penyebabnya.

**Kenapa sulit ditemukan:** `except:` yang telanjang menelan `KeyError` asli — yang seharusnya langsung memberi tahu `KeyError: 'tahun_ajran'`. Tanpa itu, Anda harus melacak balik sendiri kenapa `tahun` menjadi `None`.

**Pelajaran — tiga hal:**

1. **`except:` tanpa tipe menangkap SEMUA error**, termasuk yang tidak Anda duga (bahkan `KeyboardInterrupt`). Ini hampir selalu salah.
2. **Menelan error menghancurkan bukti.** Anda tidak kehilangan bug-nya saja — Anda kehilangan **informasi** yang dibutuhkan untuk menemukannya.
3. **Gejala muncul jauh dari penyebabnya.** Ini pola paling menyiksa dalam debugging.

**Perbaikan:**

```python
def ambil_setting(nama):
    if nama not in KONFIG:
        raise KeyError(
            f"Setting '{nama}' tidak ada. "
            f"Yang tersedia: {list(KONFIG.keys())}"
        )
    return KONFIG[nama]
```

Pesan errornya sekarang menyebutkan **setting yang dicari** dan **daftar yang tersedia**. Perbandingan visual langsung mengungkap typo-nya:

```
Setting 'tahun_ajran' tidak ada. Yang tersedia: ['nama_sekolah', 'tahun_ajaran']
```

**Kalau Anda memang perlu menangani error:**

```python
except KeyError as e:
    logger.warning("Setting tidak ditemukan: %s", e)
    return None
```

Bedanya: **errornya dicatat**, jadi Anda punya jejak.

**Tanda pengenal:** `except:` telanjang, `except Exception: pass`, atau `except Exception: return None`. Cari ini **pertama** setiap kali Anda me-review kode AI — file `06` menyebutnya mode kegagalan #3, dan ini yang paling berbahaya.
</details>

---

## Latihan 9 — Timezone

**Gejala:** laporan bulanan salah. Beberapa transaksi akhir Desember muncul di laporan Januari. Tidak ada error.

```python
from datetime import datetime

def catat_transaksi(waktu_dari_server, daftar):
    """Server mengirim waktu dalam UTC. Kita simpan tanggalnya."""
    waktu = datetime.strptime(waktu_dari_server, "%Y-%m-%d %H:%M")
    daftar.append({
        "tanggal": waktu.strftime("%Y-%m-%d"),
        "keterangan": "pembayaran",
    })
    return daftar

transaksi = []
catat_transaksi("2025-12-31 17:30", transaksi)   # 17:30 UTC = 00:30 WIB, 1 Januari
print(transaksi)
# Server di UTC. Pengguna di WIB (UTC+7).
```

<details>
<summary>Pembahasan</summary>

**Output:** `[{'tanggal': '2025-12-31', 'keterangan': 'pembayaran'}]`

**Masalahnya:** transaksi itu terjadi pada **1 Januari 2026, 00:30 WIB**. Tapi tercatat sebagai **31 Desember 2025**. Jadi masuk ke laporan tahun yang salah.

**Kenapa:** waktu UTC disimpan apa adanya, tanpa konversi ke zona waktu pengguna.

**Pelajaran — tiga aturan:**

```
1. SIMPAN dalam UTC          ← selalu, tanpa pengecualian
2. KONVERSI saat menampilkan ← atau saat membandingkan dengan tanggal lokal
3. SELALU sertakan zona waktu secara eksplisit — jangan pernah "waktu polos"
```

Perhatikan juga: **Indonesia punya tiga zona** — WIB (UTC+7), WITA (UTC+8), WIT (UTC+9). Jadi "zona waktu pengguna" bukan satu nilai tetap.

**Perbaikan:**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

WIB = ZoneInfo("Asia/Jakarta")

def catat_transaksi(waktu_dari_server, daftar):
    """Server mengirim UTC. Simpan sebagai UTC, tampilkan sebagai WIB."""
    waktu_utc = datetime.strptime(waktu_dari_server, "%Y-%m-%d %H:%M").replace(
        tzinfo=timezone.utc
    )
    waktu_lokal = waktu_utc.astimezone(WIB)

    daftar.append({
        "waktu_utc": waktu_utc.isoformat(),        # ← simpan UTC
        "tanggal_lokal": waktu_lokal.strftime("%Y-%m-%d"),   # ← untuk tampilan
        "keterangan": "pembayaran",
    })
    return daftar
```

**Kasus khusus:** untuk **tanggal saja** tanpa jam — seperti tanggal lahir atau tanggal absensi — simpan sebagai tipe `DATE` murni, bukan `TIMESTAMP`. Tanggal lahir tidak punya zona waktu.

**Tanda pengenal:** hasil beda 1 hari, atau beda antara lokal dan server. Zona waktu adalah penyebab paling umum dari "kok laporannya beda sehari?".
</details>

---

## Latihan 10 — Cache basi

**Gejala:** setelah mengubah data, pembacaan masih mengembalikan data **lama**. Tidak ada error. Perubahan baru terlihat setelah aplikasi di-restart.

```python
from functools import lru_cache

DATABASE = {1: {"nama": "Ani", "kelas": "6A"}}

@lru_cache(maxsize=None)
def get_siswa(siswa_id):
    print(f"  [query database untuk {siswa_id}]")
    return DATABASE.get(siswa_id)

def update_siswa(siswa_id, data):
    DATABASE[siswa_id].update(data)

print("Baca pertama:", get_siswa(1))
update_siswa(1, {"kelas": "6B"})
print("Setelah update:", get_siswa(1))     # Harapan: kelas 6B
print("Isi database asli:", DATABASE[1])
```

<details>
<summary>Pembahasan</summary>

**Output:**
```
  [query database untuk 1]
Baca pertama: {'nama': 'Ani', 'kelas': '6A'}
Setelah update: {'nama': 'Ani', 'kelas': '6A'}      ← MASIH 6A
Isi database asli: {'nama': 'Ani', 'kelas': '6B'}   ← database sudah benar
```

Perhatikan baris `[query database untuk 1]` hanya muncul **sekali**. Itu petunjuknya: pembacaan kedua tidak menyentuh database — ia mengambil dari cache.

**Kenapa:** `@lru_cache` menyimpan hasil. Saat data berubah, cache tidak tahu — jadi ia masih mengembalikan nilai lama.

**Pelajaran:**

> Cache adalah **sumber kebenaran kedua**. Setiap sumber kebenaran tambahan adalah tempat bug bersembunyi.

**Perbaikan:**

```python
def update_siswa(siswa_id, data):
    DATABASE[siswa_id].update(data)
    get_siswa.cache_clear()          # ← invalidasi setelah perubahan
```

Atau lebih presisi:

```python
def update_siswa(siswa_id, data):
    DATABASE[siswa_id].update(data)
    get_siswa.cache_clear()   # lru_cache tidak mendukung hapus per-key
```

Untuk cache yang lebih canggih, pakai `cachetools` dengan `TTLCache`, atau Redis dengan TTL + invalidasi eksplisit.

**Saran praktis:** **mulai tanpa cache.** Tambahkan cache hanya ketika Anda sudah **mengukur** bahwa ada masalah kecepatan. Cache prematur menambah bug yang jauh lebih sulit dilacak daripada masalah kecepatan yang ia selesaikan.

**Tanda pengenal:** data lama muncul kembali; perubahan hanya terlihat setelah restart; beda perilaku antara "pertama kali" dan "kedua kali". Kalau Anda melihat baris log yang **tidak muncul** padahal seharusnya muncul — curigai cache.
</details>

---

## Latihan 11 — State bersama

**Gejala:** dua objek yang seharusnya independen saling mempengaruhi. Tidak ada error.

```python
class Keranjang:
    items = []                          # ← perhatikan: di level class, bukan __init__

    def tambah(self, item):
        self.items.append(item)
        return self.items

    def isi(self):
        return self.items

keranjang_ani = Keranjang()
keranjang_budi = Keranjang()

keranjang_ani.tambah("buku")
print("Ani:", keranjang_ani.isi())      # Harapan: ['buku']
print("Budi:", keranjang_budi.isi())    # Harapan: [] — keranjang Budi kosong
```

<details>
<summary>Pembahasan</summary>

**Output:**
```
Ani: ['buku']
Budi: ['buku']      ← BUDI TIDAK PERNAH MENAMBAH APA PUN
```

**Kenapa:** `items = []` didefinisikan di **level class**, bukan di dalam `__init__`. Di Python, atribut level class **dibagi** oleh semua instance.

`keranjang_ani.tambah("buku")` memodifikasi list yang **sama** dengan yang dipakai `keranjang_budi`.

**Perhatikan:** ini **mekanisme yang identik** dengan Latihan 3 (mutable default). Dua bug berbeda, satu akar: **state mutable yang dibagi tanpa disadari.**

Kalau Anda menyelesaikan Latihan 3 dan langsung mengenali Latihan 11, Anda baru saja mengalami nilai dari pengenalan pola.

**Perbaikan:**

```python
class Keranjang:
    def __init__(self):
        self.items = []             # ← per-instance, bukan per-class

    def tambah(self, item):
        self.items.append(item)
        return self.items
```

**Konsekuensi nyata:** di aplikasi web, bug ini bisa membuat **keranjang belanja satu pengguna muncul di keranjang pengguna lain**. Bukan hanya bug — ini kebocoran data.

**Tanda pengenal:**
- Data "bocor" antar objek/user/request ← **selalu periksa ini dulu**
- Bug hilang setelah restart (state-nya ada di memori)
- Muncul lebih sering saat trafik naik
- Ada atribut mutable yang didefinisikan di level class/modul (bukan di `__init__`)

**Cara cepat memeriksa:** cari variabel mutable (`[]`, `{}`, `set()`) yang didefinisikan **di luar** fungsi atau `__init__`. Kalau ada, curigai.
</details>

---

## Latihan 12 — Capstone: review kode buatan AI

**Gejala:** fungsi ini "kadang mengembalikan `None`, kadang crash, dan persentasenya sering salah."

Kode ini **dihasilkan AI**. Ada **4 bug**. Tugas Anda: temukan semuanya.

```python
import requests
from datetime import datetime

def ambil_data_absensi(npsn, tanggal_mulai, tanggal_selesai):
    """Ambil data absensi dari API sekolah dan hitung rekapnya.

    Args:
        npsn: Nomor Pokok Sekolah Nasional
        tanggal_mulai: tanggal awal (YYYY-MM-DD)
        tanggal_selesai: tanggal akhir (YYYY-MM-DD)

    Returns:
        dict berisi total_hadir dan persentase
    """
    try:
        response = requests.get(
            "https://api.sekolah.id/v1/absensi",
            params={"npsn": npsn, "from": tanggal_mulai, "to": tanggal_selesai},
            timeout=30,
        )
        data = response.json(strict=True)

        total_hadir = 0
        for record in data["records"]:
            if record["status"] == "hadir":
                total_hadir += 1

        jumlah_hari = len(data["records"])
        persentase = (total_hadir / jumlah_hari) * 100

        return {
            "total_hadir": total_hadir,
            "persentase": round(persentase, 2),
        }

    except Exception:
        return None
```

<details>
<summary>Pembahasan — 4 bug</summary>

### Bug 1 — Parameter API yang tidak ada (mode kegagalan #1)

```python
data = response.json(strict=True)
```

`requests.Response.json()` **tidak punya parameter `strict`**. Ini halusinasi API — nama yang terdengar masuk akal tapi tidak ada.

**Efek:** `TypeError: json() got an unexpected keyword argument 'strict'` — **setiap kali** fungsi dipanggil.

**Perbaikan:** `data = response.json()`

**Cara menemukannya:** cek dokumentasi `requests` untuk `.json()`. Aturan dari file `06`: **setiap pemanggilan API yang tidak Anda kenal hafal → cek dokumentasi.**

---

### Bug 2 — Tidak ada `raise_for_status()`

```python
response = requests.get(...)
data = response.json()          # ← apa yang terjadi kalau response-nya 500?
```

`requests` **tidak** melempar error untuk HTTP status 4xx/5xx. Kalau server mengembalikan `500` dengan halaman HTML error, `response.json()` akan gagal dengan pesan yang **menyesatkan** (JSON decode error), bukan "server error 500".

**Perbaikan:**

```python
response = requests.get(...)
response.raise_for_status()     # ← melempar HTTPError untuk 4xx/5xx
data = response.json()
```

**Pelajaran:** selalu panggil `raise_for_status()`. Ini mengubah "JSON aneh" menjadi "HTTP 500" — informasi yang jauh lebih berguna.

---

### Bug 3 — `ZeroDivisionError`

```python
jumlah_hari = len(data["records"])
persentase = (total_hadir / jumlah_hari) * 100
```

Kalau `data["records"]` **kosong** (tidak ada absensi pada rentang itu), `jumlah_hari = 0` → pembagian dengan nol.

**Perbaikan:**

```python
if jumlah_hari == 0:
    return {"total_hadir": 0, "persentase": None, "catatan": "tidak ada data"}
persentase = (total_hadir / jumlah_hari) * 100
```

**Pertanyaan desain yang lebih penting:** apa arti "0% kehadiran" saat tidak ada data? Itu **berbeda** dari "tidak ada data". Mengembalikan `0.0` akan menyesatkan pengguna laporan.

---

### Bug 4 — `except` yang menelan semuanya (mode kegagalan #3)

```python
except Exception:
    return None
```

Ini **penyebab langsung** gejala "kadang mengembalikan `None`". Ketiga bug di atas semuanya **tertutup** oleh ini — Anda tidak melihat error apa pun, hanya `None`.

**Ini bug yang paling berbahaya dari keempatnya**, karena ia menyembunyikan tiga yang lain.

**Perbaikan:**

```python
except requests.HTTPError as e:
    logger.error("[ambil_data_absensi] HTTP error npsn=%s: %s", npsn, e)
    raise
except requests.RequestException as e:
    logger.error("[ambil_data_absensi] gagal koneksi npsn=%s: %s", npsn, e)
    raise
except (KeyError, ValueError) as e:
    logger.exception("[ambil_data_absensi] format respons tidak sesuai npsn=%s", npsn)
    raise
```

Atau, minimal:

```python
except Exception:
    logger.exception("[ambil_data_absensi] gagal npsn=%s", npsn)
    raise
```

---

### Versi yang diperbaiki

```python
import logging
import requests

logger = logging.getLogger(__name__)


def ambil_data_absensi(npsn, tanggal_mulai, tanggal_selesai):
    """Ambil data absensi dari API sekolah dan hitung rekapnya."""
    try:
        response = requests.get(
            "https://api.sekolah.id/v1/absensi",
            params={"npsn": npsn, "from": tanggal_mulai, "to": tanggal_selesai},
            timeout=30,
        )
        response.raise_for_status()               # ✅ Bug 2
        data = response.json()                    # ✅ Bug 1

        records = data["records"]
        if not records:                           # ✅ Bug 3
            return {"total_hadir": 0, "persentase": None, "catatan": "tidak ada data"}

        total_hadir = sum(1 for r in records if r.get("status") == "hadir")
        persentase = (total_hadir / len(records)) * 100

        return {"total_hadir": total_hadir, "persentase": round(persentase, 2)}

    except requests.HTTPError as e:               # ✅ Bug 4
        logger.error("[ambil_data_absensi] HTTP error npsn=%s: %s", npsn, e)
        raise
    except requests.RequestException as e:
        logger.error("[ambil_data_absensi] gagal koneksi npsn=%s: %s", npsn, e)
        raise
```

### Pelajaran dari latihan ini

Perhatikan **urutan kepentingannya**:

```
Bug 4 (except yang menelan) adalah yang paling merusak,
karena ia menyembunyikan Bug 1, 2, dan 3.

Kalau Anda memperbaiki Bug 4 dulu, Anda akan langsung melihat
tiga bug lainnya dengan jelas.
```

Itu pelajaran debugging yang berlaku umum: **kadang langkah pertama adalah membuat masalahnya terlihat**, bukan memperbaikinya. Kalau sistem Anda menyembunyikan error, pekerjaan pertama Anda adalah mengembalikan visibilitasnya.

### Bagaimana cara memeriksa Anda menemukan semuanya

```
[ ] Bug 1: pemanggilan API yang tidak ada → sudah cek dokumentasi?
[ ] Bug 2: HTTP error tidak ditangani → sudah tambah raise_for_status()?
[ ] Bug 3: pembagian dengan nol → sudah uji dengan data kosong?
[ ] Bug 4: except yang menelan → sudah dicatat + diteruskan?

Dan pertanyaan yang lebih penting:
[ ] Kalau saya RUSAK kode ini dengan sengaja, apakah ada test yang gagal?
    (Kalau tidak → Anda belum punya test, dan bug ini akan kembali.)
```
</details>

---

## Setelah 12 latihan ini

Anda sudah berlatih pola-pola yang paling umum. Sekarang buat latihan Anda sendiri, dengan pola **build-break-fix**:

```
1. Ambil proyek kecil Anda sendiri yang sudah jalan.
2. Minta AI menyisipkan bug, TANPA memberi tahu letaknya:

   "Sisipkan satu bug halus di proyek ini. Syaratnya:
    - Bisa dideteksi lewat perilaku yang salah (bukan crash)
    - Termasuk salah satu pola: off-by-one, type coercion,
      state bersama, cache basi, atau error yang ditelan
    - JANGAN beri tahu saya letaknya
    - Beri tahu saya HANYA gejalanya (apa yang akan terlihat salah)
    - JANGAN perbaiki apa pun"

3. Tunggu 1–2 hari supaya Anda lupa.
4. Debug dengan prosedur REDUCE. CATAT berapa lama.
5. Ulangi. Waktu Anda harus turun setiap kali.
```

**Kenapa menunggu 1–2 hari:** kalau Anda mengerjakannya langsung, Anda masih ingat di mana bug-nya disisipkan — dan itu bukan latihan.

### Ukur kemajuan Anda

Simpan catatan:

```
Latihan | Waktu | Hipotesis pertama benar? | Pola bug | Pelajaran
1       | 3 mnt | Ya                       | typo     | baca error sampai habis
2       | 12mnt | Tidak                    | off-by-one | off-by-one sering tanpa error
...
12      | 35mnt | Sebagian                 | 4 bug     | perbaiki visibilitas dulu
```

Setelah 20+ catatan, Anda akan melihat dua hal: **waktu Anda turun**, dan **hipotesis pertama Anda makin sering benar**. Itu ukuran sebenarnya dari kemampuan debugging.

---

> **Lanjut ke:** [`08-debugging-produksi-dan-postmortem.md`](./08-debugging-produksi-dan-postmortem.md) — konteks dengan taruhan tinggi.
