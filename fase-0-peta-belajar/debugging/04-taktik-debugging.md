# 04 — Taktik Debugging

> **Level:** Fondasi → Menengah
> **Waktu:** 50 menit
> **Yang Anda dapat:** 7 alat konkret, dan tahu kapan memakai yang mana

---

## 📖 Cara memakai file ini

File `03` memberi Anda **prosedur** (REDUCE). File ini memberi Anda **alat** untuk menjalankan prosedur itu.

Alat yang salah membuat bug sederhana terasa mustahil. Contoh: mencoba men-debug race condition dengan `print()` di dalam loop akan gagal, sementara debugging nilai yang salah dengan debugger juga bisa lebih lambat daripada satu log.

**Aturan:** kenali semua 7, tapi kuasai 3: **log terstruktur**, **bisection**, dan **reproduksi minimal**. Tiga itu menangani ~90% kasus.

---

## Tabel keputusan: taktik mana untuk masalah apa

| Situasi Anda | Taktik | Kenapa |
|---|---|---|
| Tidak tahu kode sampai mana yang jalan | **1. Log terstruktur** | Menunjukkan alur + nilai sekaligus |
| Nilai variabel tidak seperti yang saya kira | **2. Breakpoint** | Bisa memeriksa seluruh state saat berhenti |
| Alur logika terasa aneh tapi tidak jelas di mana | **3. Rubber duck** | Memaksa Anda melacak baris per baris |
| Bug ada di antara banyak baris/commit | **4. Bisection** | O(log n), bukan O(n) |
| Tidak ada error, tapi hasil salah | **5. Diferensial** | Bandingkan kasus benar vs salah |
| Bug sulit direproduksi / terlalu kompleks | **6. Reproduksi minimal** | Perkecil sampai hanya tersisa bug-nya |
| Ingin bug gagal lebih awal & lebih jelas | **7. Assert & timeout** | Ubah bug senyap menjadi error yang jelas |
| Bug hanya di server | **1 + 5** | Log + bandingkan dengan lokal |

---

## Taktik 1 — Log terstruktur

**Untuk:** mencari tahu alur eksekusi dan nilai di titik-titik kunci.

### Cara yang salah

```python
print("here")                      # ← memberi tahu Anda kode sampai di sini. Itu saja.
print(x)                           # ← "5"? "None"? tipe apa? tidak jelas.
print("error")                     # ← error apa?
```

Log seperti ini memaksa Anda menebak. Anda akan menambahkan log baru, menjalankan lagi, dan mengulang.

### Cara yang benar

**Sertakan tiga hal:** konteks (fungsi mana), nilai **dan** tipe, dan penanda agar mudah dicari.

```python
import logging
logger = logging.getLogger(__name__)

def proses_absensi(data):
    logger.debug("[proses_absensi] INPUT: %r (tipe: %s)", data, type(data).__name__)

    siswa = ambil_siswa(data.get("siswa_id"))
    logger.debug("[proses_absensi] siswa=%r", siswa)

    if siswa is None:
        logger.warning("[proses_absensi] siswa tidak ditemukan: siswa_id=%r", data.get("siswa_id"))
        return None

    hasil = simpan(siswa, data.get("status"))
    logger.debug("[proses_absensi] OUTPUT: %r", hasil)
    return hasil
```

Perhatikan bedanya: sekarang satu kali jalankan memberi Anda **alur lengkap** dengan nilai di setiap titik. Anda tidak perlu menambah log berulang kali.

### Kuncinya: log masukan dan keluaran setiap fungsi

Ini teknik yang paling banyak memberi hasil per usaha:

```
Untuk setiap fungsi di jalur yang dicurigai:
  log INPUT  → nilai + tipe semua argumen
  log OUTPUT → nilai + tipe yang dikembalikan

Lalu jalankan sekali. Anda akan melihat PERSIS di mana nilai
berubah dari benar menjadi salah.
```

Itu pada dasarnya bisection otomatis — Anda tidak perlu memilih titik tengah secara manual.

### Teknik lanjutan: log pembanding

Untuk bug intermiten, log **saat berhasil dan saat gagal**, lalu bandingkan:

```python
def simpan_absensi(data):
    hasil = proses(data)
    logger.info("[ABSENSI] %s | input=%r | hasil=%r",
                "GAGAL" if hasil is None else "OK", data, hasil)
```

Jalankan sampai Anda punya beberapa baris GAGAL dan beberapa baris OK. Bandingkan kolomnya. Perbedaannya adalah petunjuknya.

### Praktik yang baik

| Praktik | Kenapa |
|---|---|
| Pakai level (`debug`/`info`/`warning`/`error`) | Bisa dinyalakan/dimatikan tanpa mengubah kode |
| Sertakan nama fungsi di setiap log | Anda tahu dari mana asalnya saat log bercampur |
| Pakai `%r` atau `repr()`, bukan `str()` | `None` vs `"None"`, `"5"` vs `5` terlihat jelas |
| Log nilai **dan** tipe | Banyak bug adalah soal tipe, bukan nilai |
| Hapus log debug sebelum commit | Kecuali yang memang berguna di produksi |
| Pakai struktur (JSON) untuk aplikasi serius | Bisa dicari & difilter |

---

## Taktik 2 — Breakpoint & step-through

**Untuk:** saat Anda butuh memeriksa **seluruh state** pada satu titik, bukan satu nilai.

### Cara kerja

Berbeda dengan log yang hanya menunjukkan apa yang Anda minta, debugger menghentikan program dan membiarkan Anda **menjelajah**.

```
- BREAKPOINT   → hentikan eksekusi di baris tertentu
- STEP OVER    → jalankan baris ini, berhenti di baris berikutnya
- STEP INTO    → masuk ke dalam fungsi yang dipanggil
- STEP OUT     → keluar dari fungsi saat ini
- INSPECT      → lihat nilai semua variabel yang terlihat
- WATCH        → pantau satu ekspresi terus-menerus
- EVALUATE     → jalankan kode di konteks saat ini untuk menguji teori
```

### Kapan lebih baik daripada log

| Pakai debugger kalau… | Pakai log kalau… |
|---|---|
| Anda tidak tahu variabel mana yang penting | Anda tahu nilai apa yang dicari |
| Bug melibatkan state kompleks (objek bersarang) | Bug sederhana & terisolasi |
| Anda perlu menjelajah beberapa frame | Bug ada di lingkungan tanpa debugger (server) |
| Anda ingin mencoba "bagaimana kalau" | Anda ingin membandingkan banyak eksekusi |

### Teknik paling berguna: conditional breakpoint

Alih-alih berhenti di setiap iterasi loop 10.000 kali, berhenti hanya saat kondisinya menarik:

```
Breakpoint dengan kondisi: siswa_id == 999
```

Sekarang Anda berhenti **tepat** di kasus yang gagal, bukan 9.999 kali sebelum itu.

### Teknik kedua: breakpoint saat exception

Di banyak IDE/debugger, Anda bisa menyetel debugger untuk **berhenti saat exception dilempar**, sebelum ditangkap. Ini sangat berguna untuk menelusuri error yang ditelan `try/except` (lihat `02`, Pola 2).

```bash
# Python
python -m pdb script.py
# lalu: b script.py:34   (set breakpoint)
#       c                (continue)
#       n                (next)
#       p variabel       (print)
#       q                (quit)
```

### Kelemahan

Debugger **menghentikan** program. Untuk bug yang bergantung pada timing atau konkurensi, berhenti di breakpoint justru **menghilangkan bug-nya**. Kalau bug hilang saat Anda pakai debugger, itu sendiri informasi: bug-nya soal timing.

---

## Taktik 3 — Rubber duck

**Untuk:** saat alur logika terasa aneh tapi Anda tidak bisa menunjuk di mana.

### Cara kerja

Jelaskan kode Anda baris per baris, **dengan suara atau tulisan**, seolah kepada orang yang tidak tahu sistem Anda. Sering kali bug-nya muncul di tengah penjelasan.

Kenapa bekerja: menjelaskan memaksa Anda memproses logika secara berurutan, bukan melompat-lompat dengan intuisi. Intuisi melewatkan hal yang "sudah jelas" — dan di situlah bug biasanya bersembunyi.

### Cara melakukannya dengan benar

```
1. Identifikasi jalur dari input ke kegagalan.
2. Untuk SETIAP baris, ucapkan/tuliskan:
   "Baris ini menerima ___, dan menghasilkan ___."
3. Di setiap langkah, tanya: "kalau X benar di sini, maka Y harus ___."
4. Ketika ada ketidakcocokan antara "seharusnya" dan "ternyata" →
   itu bug-nya.
```

**Jangan** hanya membaca dalam hati. Membaca dalam hati melewati langkah-langkah "yang jelas" — dan justru itu masalahnya. Mengucapkan memaksa setiap langkah keluar.

### Versi dengan AI

AI sangat efektif untuk ini karena ia bisa **bertanya balik**:

```
Prompt:
"Saya akan menjelaskan fungsi ini baris per baris. Tugas Anda:
setiap kali ada asumsi yang saya lewati atau lompati, TANYA.
Jangan simpulkan. Jangan beri solusi. Hanya tanya."

def hitung_total_biaya(transaksi_list):
    total = 0
    for t in transaksi_list:
        if t.jenis == "pengeluaran":
            total += t.jumlah
        elif t.jenis == "pemasukan":
            total -= t.jumlah       # ← AI: "Kenapa pemasukan MENGURANGI total biaya?"
    return total
```

AI akan menangkap lompatan logika yang Anda lakukan tanpa sadar. Itu bentuk rubber duck yang paling efisien.

### Kapan tidak bekerja

Sistem dengan banyak interaksi asinkron. Di situ, urutan eksekusinya tidak bisa dilacak linear — pakai log ber-timestamp atau trace, bukan walkthrough.

---

## Taktik 4 — Bisection

**Untuk:** mempersempit ruang pencarian secara eksponensial.

Sudah dibahas lengkap di `03-metode-ilmiah-bisection-delta.md`, bagian **D — Divide**. Ringkasnya:

| Jenis | Alat | Kapan |
|---|---|---|
| Belah kode | Log/breakpoint di titik tengah alur | Bug di antara banyak baris |
| Belah waktu | `git bisect` | "Dulu jalan, sekarang tidak" |
| Belah perubahan | Kembalikan separuh perubahan | Bug setelah edit besar |
| Belah data | Uji separuh dataset | Hanya sebagian input yang gagal |
| Belah beban | Naikkan/turunkan trafik | Bug bergantung jumlah |

**Yang paling sering dilupakan orang:** belah **waktu** dengan `git bisect`. Ini alat yang menyelamatkan berhari-hari kerja, dan banyak developer belum pernah memakainya.

---

## Taktik 5 — Debugging diferensial

**Untuk:** **error logika** — tidak ada pesan error, tapi hasilnya salah.

Ini taktik yang paling kurang dikenal dan paling berguna untuk kasus "tidak ada error tapi salah".

### Prinsipnya

Kalau Anda punya kasus yang **berhasil** dan kasus yang **gagal**, perbedaannya adalah petunjuknya.

```
1. Cari (atau buat) kasus yang BERHASIL dengan input mirip.
2. Jalankan keduanya.
3. Bandingkan di setiap titik: nilai apa yang berbeda?
4. Perbedaan pertama = tempat bug-nya.
```

### Contoh nyata

**Masalah:** laporan absensi benar untuk bulan Mei, salah untuk bulan Juni.

```python
# Jalankan kedua kasus, catat nilai di setiap titik

print("=== MEI (benar) ===")
data_mei = ambil_data(tahun=2026, bulan=5)
print("jumlah record:", len(data_mei))
print("contoh record:", data_mei[0])
print("total hari kerja:", hitung_hari_kerja(data_mei))

print("=== JUNI (salah) ===")
data_juni = ambil_data(tahun=2026, bulan=6)
print("jumlah record:", len(data_juni))
print("contoh record:", data_juni[0])
print("total hari kerja:", hitung_hari_kerja(data_juni))
```

Output:

```
=== MEI (benar) ===
jumlah record: 22
contoh record: {'tanggal': '2026-05-01', 'status': 'hadir'}
total hari kerja: 22

=== JUNI (salah) ===
jumlah record: 20
contoh record: {'tanggal': '2026-06-01', 'status': 'hadir'}
total hari kerja: 30        ← 30? padahal record-nya cuma 20
```

**Perbedaan pertama muncul di titik terakhir.** Jumlah record berbeda (wajar, Juni lebih pendek), tapi `total hari kerja` melompat ke 30 — lebih besar dari jumlah record. Itu tidak mungkin. Bug-nya di `hitung_hari_kerja`.

Ternyata fungsi itu menghitung hari dalam **rentang tanggal**, bukan dari record — dan rentangnya salah dihitung untuk Juni (30 hari vs 20 hari kerja). Bug ditemukan dalam satu kali jalankan, tanpa menebak.

### Cara lain: bandingkan dengan versi yang bekerja

```bash
git diff v2.3.0 HEAD -- src/laporan.py
```

Kalau kode ini dulu bekerja, **perbedaannya** adalah tersangka utama. Ini debugging diferensial pada level kode.

### Cara lain: bandingkan lingkungan

```
Jalan di lokal, gagal di server?
→ Bandingkan: versi Python/Node, versi library, environment variable,
  path file, izin, zona waktu, dan data.
```

### Kapan taktik ini paling berguna

- Bug tanpa pesan error
- Bug yang "hanya kadang"
- Bug yang muncul di satu lingkungan tapi tidak di lingkungan lain
- Setelah upgrade (dependency, runtime, OS)

---

## Taktik 6 — Reproduksi minimal

**Untuk:** bug yang terlalu kompleks untuk dipahami dalam bentuk aslinya.

Sudah disinggung di `03`, tapi layak diperlakukan sebagai taktik tersendiri karena dampaknya besar.

### Prinsipnya

> **Setiap langkah yang Anda buang dari reproduksi adalah separuh ruang pencarian yang hilang.**

### Prosedur

```
1. Tulis langkah reproduksi lengkap (mungkin panjang).
2. Buang satu langkah. Masih muncul?
   - Masih → buang permanen. Ruang pencarian menyusut.
   - Hilang → langkah itu penting. Kembalikan, dan catat kenapa penting.
3. Ulangi sampai tidak ada yang bisa dibuang.
4. Buang satu baris kode. Masih muncul?
   Ulangi — ini mengubah "bug di 500 baris" jadi "bug di 5 baris".
```

### Kenapa ini mengubah segalanya

Bug yang tidak bisa Anda pahami dalam konteks penuh sering jadi **jelas sekali** dalam konteks minimal. Kompleksitas menyembunyikan penyebab.

Contoh: bug di aplikasi web 10.000 baris, setelah diperkecil, ternyata:

```python
# Bug ini menjelaskan semuanya
def bagi(a, b):
    return a / b if b else 0     # ← mengembalikan 0, bukan error

hasil = bagi(total_hadir, total_siswa)   # kalau total_siswa = 0 → 0, bukan error
# lalu di tempat lain: persentase = hasil * 100 → 0, padahal harusnya "tidak ada data"
```

Lima baris. Tidak akan pernah terlihat dalam konteks penuh.

### Bonus: reproduksi minimal = regression test

Setelah diperkecil, jadikan ia test:

```python
def test_bagi_dengan_nol():
    """Regression: pembagian dengan nol dulu mengembalikan 0, menyembunyikan error."""
    with pytest.raises(ZeroDivisionError):
        bagi(10, 0)
```

---

## Taktik 7 — Assert & timeout

**Untuk:** mengubah bug **senyap** menjadi bug yang **gagal keras dan jelas**.

Ini taktik yang paling jarang dipakai pemula, padahal paling mudah dan berdampak besar.

### Masalahnya

Bug yang paling sulit adalah yang **tidak berbunyi**. Program jalan sampai selesai, tapi datanya salah. Anda baru sadar berminggu-minggu kemudian.

### Solusinya: `assert` di titik-titik kunci

```python
def hitung_persentase_kehadiran(total_hadir, total_siswa):
    assert total_siswa >= 0, f"total_siswa negatif: {total_siswa}"
    assert total_hadir <= total_siswa, \
        f"hadir ({total_hadir}) > total ({total_siswa}) — data tidak konsisten"

    if total_siswa == 0:
        return None      # ← "tidak ada data", bukan 0%
    return (total_hadir / total_siswa) * 100
```

Sekarang, alih-alih mendapat persentase yang salah dan baru sadar berminggu-minggu kemudian, program **berhenti di titik masalahnya** dengan pesan yang jelas.

### Assert sebagai dokumentasi asumsi

Setiap `assert` adalah asumsi yang Anda tuliskan secara eksplisit:

```python
def proses_pembayaran(jumlah, saldo):
    assert jumlah > 0, "jumlah pembayaran harus positif"
    assert saldo >= 0, "saldo tidak boleh negatif"
    # kalau kedua baris di atas lolos, saya tahu dua hal ini benar
    # untuk seluruh sisa fungsi ini
```

Manfaatnya: Anda berhenti memikirkan kemungkinan yang sudah Anda singkirkan. Ruang berpikir Anda menyusut.

### Timeout untuk operasi yang bisa menggantung

```python
import requests

# ❌ Tanpa timeout: bisa menggantung selamanya
response = requests.get(url)

# ✅ Dengan timeout: gagal dengan jelas dalam batas waktu
response = requests.get(url, timeout=30)
```

Timeout mengubah "aplikasi saya menggantung" — gejala yang hampir mustahil di-debug — menjadi `TimeoutError` dengan lokasi yang jelas.

```python
# Untuk operasi async
import asyncio
hasil = await asyncio.wait_for(operasi_lama(), timeout=10.0)
```

### Fail fast vs fail safe

| Pendekatan | Kapan tepat |
|---|---|
| **Fail fast** (`assert`, `raise`) | Saat data tidak konsisten = bug, dan Anda ingin tahu **sekarang** |
| **Fail safe** (default value, `try/except`) | Saat kegagalan itu wajar (network, file user) dan ada perilaku yang masuk akal |

**Kesalahan umum:** memakai *fail safe* untuk bug pemrograman. Itu yang membuat bug senyap. Kalau kondisinya **tidak mungkin terjadi** kalau kode Anda benar — pakai `assert`, jangan `return None`.

### Catatan produksi

`assert` di Python hilang saat dijalankan dengan `-O` (optimized). Untuk validasi yang harus tetap ada di produksi, pakai `raise` eksplisit:

```python
if total_siswa < 0:
    raise ValueError(f"total_siswa tidak boleh negatif: {total_siswa}")
```

---

## Kombinasi yang kuat

Beberapa taktik bekerja jauh lebih baik digabung.

### Kombinasi 1: Reproduksi minimal + Bisection

```
Perkecil bug sampai 5 baris → lalu bisection tidak perlu,
karena 5 baris sudah bisa dibaca langsung.
```

Banyak kasus, taktik 6 saja sudah menyelesaikan masalahnya. Itu kenapa ia sering disebut "taktik nomor satu".

### Kombinasi 2: Log pembanding + Diferensial

```
Log saat OK dan saat GAGAL → bandingkan → perbedaan pertama = bug
```

Ini kombinasi terbaik untuk bug intermiten.

### Kombinasi 3: Assert + Diferensial

```
Tambahkan assert di titik-titik kunci → jalankan kasus yang gagal →
assert akan berhenti TEPAT di titik pertama yang tidak konsisten.
```

Anda tidak perlu menebak titik tengah lagi — `assert` menemukannya untuk Anda.

### Kombinasi 4: `git bisect` + test yang gagal

```bash
git bisect run pytest tests/test_absensi.py -x
```

Kalau Anda punya test yang gagal, `git bisect` bisa menemukan commit penyebabnya **tanpa Anda perlu menyentuh apa pun**. Ini otomatisasi debugging yang paling ampuh dan paling diabaikan.

---

## Ringkasan

| Taktik | Untuk | Kuasai? |
|---|---|---|
| 1. Log terstruktur | Alur + nilai, di mana saja | ✅ **Wajib** |
| 2. Breakpoint | State kompleks, eksplorasi | 🟠 Disarankan |
| 3. Rubber duck | Logika yang tidak jelas | 🟠 Disarankan |
| 4. Bisection | Ruang pencarian besar | ✅ **Wajib** |
| 5. Diferensial | Error logika, bug intermiten | ✅ **Wajib** |
| 6. Reproduksi minimal | Semua bug kompleks | ✅ **Wajib** |
| 7. Assert & timeout | Bug senyap | 🟠 Disarankan |

Kalau Anda hanya punya waktu mempelajari tiga: **log terstruktur, bisection, diferensial**. Ketiganya menangani hampir semua yang akan Anda temui.

---

> **Lanjut ke:** [`05-pola-bug-umum.md`](./05-pola-bug-umum.md) — kenali pola, percepat hipotesis.
