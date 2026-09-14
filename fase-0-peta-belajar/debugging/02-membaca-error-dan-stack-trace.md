# 02 — Membaca Error & Stack Trace

> **Level:** Fondasi
> **Waktu:** 45 menit
> **Yang Anda dapat:** bisa mengambil 80% informasi dari error tanpa menjalankan apa pun lagi

---

## 📖 Kenapa ini kemampuan pertama

Pesan error adalah **sumber informasi gratis** yang paling sering dibuang.

Statistiknya kasar tapi konsisten di banyak survei developer: **sebagian besar bug diselesaikan lebih cepat oleh orang yang membaca pesan errornya sampai habis**, dan sebagian besar waktu debugging terbuang karena orang melompat ke kode sebelum selesai membaca.

Pola yang paling umum:

```
❌ Terima error → lihat 3 kata pertama → langsung buka kode → cari-cari
✅ Terima error → baca SEMUA barisnya → catat 3 informasi → baru buka kode
```

Selisihnya bukan 10%. Dalam kasus yang umum, yang kedua bisa 3–5× lebih cepat.

**Aturan pertama folder ini:**

> **Baca pesan error sampai habis. Baris terakhir biasanya baris terpenting.**

---

## Anatomi pesan error

Pesan error selalu punya **empat komponen**. Kalau Anda tahu mencari apa, setiap error jadi bisa dibaca.

```
┌──────────────────────────────────────────────────────────────────┐
│  ① JENIS ERROR                                                   │
│     KeyError, TypeError, ValueError, NoResultFound, ENOENT …      │
│     → memberi tahu KATEGORI masalah                              │
│                                                                  │
│  ② PESAN                                                         │
│     "No row was found for one()"                                 │
│     → sering berisi petunjuk spesifik, sering diabaikan          │
│                                                                  │
│  ③ LOKASI                                                        │
│     File "siswa_repo.py", line 34, in get_by_id                  │
│     → DI MANA error terdeteksi (bukan selalu di mana penyebabnya)│
│                                                                  │
│  ④ JEJAK (stack trace)                                           │
│     Rantai pemanggilan fungsi dari entry point sampai lokasi     │
│     → memberi tahu BAGAIMANA kode sampai ke titik itu            │
└──────────────────────────────────────────────────────────────────┘
```

Kebanyakan orang hanya membaca ① dan ③, lalu melewatkan ② dan ④. Padahal **② dan ④ yang paling sering berisi jawabannya**.

---

## Membaca stack trace: dari bawah ke atas

Ini bagian yang paling sering salah. Stack trace **dibaca dari bawah ke atas**, bukan atas ke bawah.

### Kenapa dari bawah

Stack trace adalah **tumpukan pemanggilan**. Entry point (paling awal dijalankan) ada di **atas**, dan titik di mana error terjadi ada di **bawah** — karena tumpukan bertambah saat fungsi memanggil fungsi.

```
Traceback (most recent call last):        ← perhatikan: "most recent call LAST"
  File "/app/src/main.py", line 12, in <module>
    app.run()                              ← paling awal dijalankan
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
sqlalchemy.exc.NoResultFound: No row was found for one()   ← paling akhir
```

**Cara membacanya:**

| Urutan | Yang dilihat | Yang Anda pelajari |
|---|---|---|
| 1️⃣ | Baris **paling bawah**: `NoResultFound: No row was found for one()` | Ini jenis + pesannya. Query tidak menemukan data. |
| 2️⃣ | Naik satu tingkat: `query.py:2759` di `site-packages/` | Ini **library**, bukan kode Anda. Lewati. |
| 3️⃣ | Naik lagi: `siswa_repo.py:34` | **Baris pertama milik kode Anda** dari bawah. ← ini titik perhatian |
| 4️⃣ | Naik terus: `absensi_handler.py:56` | Pemanggil. Memberi tahu **konteks**: dipanggil dengan `siswa_id` dari request. |
| 5️⃣ | Sampai atas: `main.py:12` | Alur lengkapnya. Biasanya tidak perlu dibaca detail. |

**Aturan praktis:** dari bawah, cari **baris pertama yang bukan milik library**. Itu titik di mana kode Anda mulai berinteraksi dengan hal yang gagal.

### Kesalahan paling umum saat membaca stack trace

| Kesalahan | Kenapa salah |
|---|---|
| Membaca dari atas ke bawah | Anda mulai dari entry point, yang hampir selalu tidak relevan |
| Berhenti di baris milik library | Library jarang salah; biasanya kode Anda yang memakainya dengan salah |
| Menganggap lokasi = penyebab | `siswa_repo.py:34` menunjukkan **di mana** gagal, bukan **kenapa** `siswa_id` salah |
| Mengabaikan baris-baris di tengah | Baris pemanggil memberi tahu **argumen apa** yang dikirim — sering di situ masalahnya |

### Kasus khusus: error di dalam library

Kadang baris pertama milik kode Anda **memang** di dalam library (misalnya Anda memakai framework). Polanya:

```
Kalau semua baris di bawah "baris kode Anda" milik library:
  → library gagal karena INPUT yang Anda berikan salah
  → periksa argumen yang Anda kirim di baris kode Anda itu

Kalau ada baris kode Anda yang muncul DI DALAM library (callback, hook):
  → kode Anda dipanggil balik oleh library
  → periksa logika di baris itu, dan kondisi yang memanggilnya
```

---

## Taksonomi error

Ada empat keluarga error, dan masing-masing butuh pendekatan berbeda. Mengenali keluarganya mempersempit pencarian seketika.

### 1. Error sintaks — kode tidak bisa dijalankan sama sekali

**Ciri:** muncul sebelum program jalan. Biasanya jelas.

```
SyntaxError: unexpected EOF while parsing
IndentationError: expected an indented block
```

**Penyebab umum:** tanda kurung tidak seimbang, indentasi salah, tanda kutip tidak ditutup, koma hilang.

**Cara menangani:** baca nomor barisnya, tapi **periksa juga baris SEBELUMNYA**. Error sintaks sering dilaporkan di tempat yang salah — parser baru sadar ada masalah ketika sudah terlalu jauh.

```python
# Error dilaporkan di baris 5, padahal masalahnya di baris 3
data = {
    "nama": "Ani",        # ← koma hilang di sini (baris 3)
    "kelas": "6A"
}                          # baris 5
```

### 2. Error runtime — kode jalan, lalu gagal di tengah

**Ciri:** program mulai jalan, lalu berhenti. Ada stack trace.

```
TypeError, KeyError, AttributeError, IndexError, ZeroDivisionError,
FileNotFoundError, ConnectionError, ValueError
```

**Penyebab umum:** data tidak sesuai ekspektasi, file/network tidak tersedia, operasi pada nilai kosong.

**Cara menangani:** ini keluarga terbesar. Pakai stack trace dari bawah, lalu tanya: *"nilai apa yang sebenarnya ada di sini, dan kenapa berbeda dari yang saya kira?"*

### 3. Error logika — tidak ada error sama sekali, tapi hasilnya salah

**Ciri:** **tidak ada pesan error.** Program jalan sampai selesai. Outputnya salah, atau datanya salah tersimpan.

**Ini jenis yang paling sulit** — karena tidak ada yang memberi tahu Anda di mana masalahnya.

**Contoh:**

```python
def hitung_total_biaya(transaksi_list):
    total = 0
    for t in transaksi_list:
        if t.jenis == "pengeluaran":
            total += t.jumlah
        elif t.jenis == "pemasukan":
            total -= t.jumlah      # ← logika salah? tergantung maksudnya
    return total
```

**Cara menangani:** tidak bisa pakai stack trace. Harus pakai **debugging diferensial** (lihat `04-taktik-debugging.md`) dan **verifikasi nilai di titik-titik kunci**:

```
1. Tentukan titik-titik kunci di alur (input → proses → output)
2. Di setiap titik, tuliskan nilai yang SEHARUSNYA
3. Bandingkan dengan nilai sebenarnya
4. Titik pertama di mana nilainya berbeda = tempat bug-nya
```

**Cara mengenali cepat:** kalau bug-nya error logika, "gejala"-nya bukan pesan error tapi **perilaku salah**. Contoh: "total biaya kok lebih kecil dari yang seharusnya".

### 4. Error lingkungan / konfigurasi — kode benar, lingkungannya salah

**Ciri:** kode yang sama jalan di satu tempat, gagal di tempat lain.

```
ModuleNotFoundError: No module named 'pandas'
PermissionError: [Errno 13] Permission denied
Connection refused / ECONNREFUSED
Environment variable X is not set
ENOENT: no such file or directory
```

**Penyebab umum:** versi library berbeda, environment variable tidak di-set, izin file, port sudah dipakai, path relatif vs absolut, perbedaan OS (Windows vs Linux).

**Cara menangani:** jangan langsung curiga ke kode. Tanya dulu:

```
- Apakah ini jalan di tempat lain? (kalau ya → hampir pasti lingkungan)
- Apa yang berbeda: versi library? path? env var? izin? OS?
- Apakah error menyebut file/variabel/port tertentu? → periksa itu lebih dulu
```

**Kesalahan klasik:** menghabiskan 2 jam menelusuri kode, padahal masalahnya `.env` tidak ter-load.

---

## Error yang menyesatkan

Ini yang membuat debugging jadi sulit. Empat pola yang paling sering menipu.

### Pola 1 — Lokasi error bukan penyebab error

```python
siswa = repo.get_by_id(siswa_id)      # baris 34 — DI SINI error muncul
print(siswa.nama)                      # tapi penyebabnya di sini
```

**Kalau `siswa_id` salah sejak awal**, error muncul di baris 34, tapi yang salah adalah **kode yang menghasilkan `siswa_id`** — mungkin 50 baris sebelumnya, mungkin di file lain, mungkin dari request frontend.

**Pertanyaan yang benar:** bukan "kenapa baris 34 gagal?" tapi **"kenapa nilai yang masuk ke baris 34 salah?"**

### Pola 2 — Error hilang karena ditelan

```python
try:
    hasil = proses(data)
except Exception:
    hasil = None      # ← error asli hilang di sini
```

Lalu crash muncul di tempat lain, dengan error yang **sama sekali tidak berhubungan** dengan penyebab aslinya. Ini pola paling menyiksa: Anda mengejar error di tempat yang salah, karena error aslinya sudah dibungkam.

**Cara mengenali:** error yang muncul tidak masuk akal dengan konteksnya. Kalau Anda melihat `AttributeError: 'NoneType' object has no attribute 'x'` di tempat yang tidak seharusnya `None`, curigai ada `except` yang menelan error di atasnya.

**Cara menangani:** cari `except` yang tidak melakukan apa-apa (`pass`, atau mengembalikan `None`), dan tambahkan log:

```python
except Exception as e:
    logger.exception("proses() gagal")   # ← catat error asli, jangan telan
    raise                                 # ← teruskan, jangan sembunyikan
```

### Pola 3 — Error yang menunjuk tempat yang benar tapi dengan alasan yang salah

```
KeyError: 'siswa_id'
```

Terlihat seperti "field `siswa_id` tidak ada di request". Tapi bisa juga:

- Nama field-nya beda (`id_siswa` bukan `siswa_id`)
- Datanya masih berupa string JSON, bukan dict (belum di-parse)
- Ada typo di tempat lain yang membuat dict-nya kosong

**Pesan error memberi tahu apa yang gagal, bukan kenapa.** Selalu tanya satu tingkat lebih dalam.

### Pola 4 — Error yang baru muncul setelah error lain diperbaiki

Sangat umum. Anda memperbaiki error A, dan error B muncul — yang tadinya tersembunyi di belakang A.

**Ini bukan kemunduran.** Ini kemajuan: Anda sedang mengupas lapisan. Catat supaya Anda tidak panik dan mengira perbaikan Anda merusak sesuatu.

```
Error 1: ImportError: cannot import name 'validasi_nisn'
  → perbaiki: buat fungsinya
Error 2: TypeError: validasi_nisn() missing 1 required positional argument
  → perbaiki: kirim argumennya
Error 3: AssertionError: assert False is True
  → perbaiki: logika validasinya
```

Tiga error berurutan di sini bukan tiga kegagalan. Itu **satu** perjalanan yang sedang berjalan.

---

## Latihan membaca error

Sebelum lanjut, uji kemampuan Anda. Untuk setiap error di bawah, **jangan cari jawabannya** — tulis dulu: (a) keluarga error apa, (b) informasi apa yang Anda punya, (c) pertanyaan pertama yang akan Anda ajukan.

---

**Latihan 1**

```
TypeError: unsupported operand type(s) for +: 'int' and 'str'
  File "hitung.py", line 12, in hitung_total
    total = jumlah_siswa + ", siswa terdaftar"
```

<details>
<summary>Pembahasan</summary>

**Keluarga:** runtime.
**Informasi:** baris 12 menggabungkan `int` dan `str` dengan `+`. Python tidak mengizinkannya.
**Pertanyaan pertama:** apa tipe `jumlah_siswa` sebenarnya, dan kenapa? Apakah dari input user (yang selalu string)? Apakah dari database?
**Perbaikan:** konversi eksplisit — `f"{jumlah_siswa} siswa terdaftar"`. Tapi **lebih penting**: cari kenapa `jumlah_siswa` bukan angka sejak awal.
</details>

---

**Latihan 2**

```
IndexError: list index out of range
  File "laporan.py", line 45, in ambil_bulan_terakhir
    return data_bulanan[len(data_bulanan)]
```

<details>
<summary>Pembahasan</summary>

**Keluarga:** runtime.
**Informasi:** mengakses index yang tidak ada. Perhatikan `len(data_bulanan)` — index valid adalah `0` sampai `len-1`. Jadi ini **off-by-one klasik**.
**Pertanyaan pertama:** kenapa ditulis `len()` dan bukan `len()-1`? Atau lebih tepat: apa yang sebenarnya mau diambil — elemen terakhir (`[-1]`) atau sesuatu yang lain?
**Pelajaran:** kalau Anda lihat `len()` dipakai sebagai index, itu hampir selalu bug.
</details>

---

**Latihan 3**

```
requests.exceptions.ConnectionError:
  HTTPSConnectionPool(host='api.sekolah.id', port=443):
  Max retries exceeded with url: /api/siswa
```

<details>
<summary>Pembahasan</summary>

**Keluarga:** lingkungan.
**Informasi:** tidak bisa terhubung ke host. **Perhatikan: tidak ada stack trace panjang** — ini ciri error jaringan/lingkungan.
**Pertanyaan pertama:** apakah ini jalan di tempat lain? Apakah host-nya bisa di-ping? Apakah kredensial/API key sudah di-set? Apakah API-nya memang sedang hidup?
**Jangan** langsung menelusuri kode Anda. Kode Anda benar — yang salah adalah kondisi di luarnya.
</details>

---

**Latihan 4**

```
Traceback (most recent call last):
  File "app.py", line 20, in <module>
    main()
  File "app.py", line 15, in main
    proses_semua()
  File "app.py", line 8, in proses_semua
    hasil.append(proses(d))
  File "app.py", line 4, in proses
    return d["nilai"] * 2
KeyError: 'nilai'
```

<details>
<summary>Pembahasan</summary>

**Keluarga:** runtime.
**Bacaan dari bawah:** baris milik kode Anda yang pertama dari bawah = `app.py:4` di fungsi `proses`. Di situ `d["nilai"]` gagal.
**Tapi penyebabnya di `app.py:8`:** `proses(d)` dipanggil untuk setiap `d` dalam suatu koleksi. Salah satu `d` tidak punya key `"nilai"`.
**Pertanyaan pertama:** elemen mana yang tidak punya key `"nilai"`? Apakah data sumbernya tidak konsisten, atau ada elemen kosong?
**Perbaikan yang benar** bukan `d.get("nilai", 0)` — itu menutupi masalah. Perbaikan yang benar: cari kenapa ada elemen tanpa `"nilai"`, dan putuskan apakah data itu boleh ada.
</details>

---

**Latihan 5**

```
FAILED tests/test_absensi.py::test_rekap_kosong - AssertionError: assert 100.0 == 0.0
```

<details>
<summary>Pembahasan</summary>

**Keluarga:** ini **test gagal**, bukan error aplikasi. Bedanya penting: test gagal berarti kode Anda **jalan** tapi hasilnya tidak sesuai harapan test.
**Informasi:** `assert 100.0 == 0.0`. Kode mengembalikan 100.0, test mengharapkan 0.0.
**Pertanyaan pertama:** siapa yang benar — kode atau test? Ini pertanyaan yang **wajib** diajukan, dan yang paling sering dilewatkan.
  - Kalau **kode** yang salah → perbaiki kode.
  - Kalau **test** yang salah → perbaiki test.
  - ⚠️ Kalau Anda tidak bisa memutuskan, **jangan** langsung mengubah test agar lulus. Lihat `06-debugging-kode-buatan-ai.md`, bagian anti-pola.
**Kasus ini:** data kosong seharusnya 0%, bukan 100%. Jadi kode-nya yang salah — mungkin `0/0` menghasilkan `100` karena ada pembagian yang dilindungi dengan cara yang salah.
</details>

---

## Checklist: apakah Anda membaca error dengan benar

Sebelum membuka kode, pastikan Anda bisa menjawab:

- [ ] Saya sudah membaca pesan error **sampai baris terakhir**
- [ ] Saya tahu **jenis** errornya (keluarga mana)
- [ ] Saya tahu **lokasi** yang dilaporkan
- [ ] Saya sudah mencari **baris pertama milik kode saya** dari bawah
- [ ] Saya tahu **argumen apa** yang dikirim ke baris itu (dari baris pemanggilnya)
- [ ] Saya bisa membedakan: apakah lokasi error = penyebab error?
- [ ] Saya sudah memeriksa apakah ada `except` yang menelan error di atasnya
- [ ] Saya bisa menuliskan **satu pertanyaan** yang harus dijawab berikutnya

Kalau ada yang belum, jangan buka kode dulu. Informasinya sudah ada di layar.

---

## Ringkasan

| Yang salah | Yang benar |
|---|---|
| Baca 3 kata pertama, langsung ke kode | Baca semua, catat 4 komponen |
| Stack trace dibaca dari atas | Dari bawah, cari baris pertama milik kode Anda |
| Lokasi error = penyebab | Lokasi = tempat terdeteksi, bukan penyebab |
| Library yang salah | Library gagal karena input Anda salah |
| "Tidak ada error berarti benar" | Error logika tidak memunculkan error sama sekali |
| Langsung curiga kode | Kalau jalan di tempat lain, curiga lingkungan dulu |
| Ubah test agar lulus | Putuskan dulu siapa yang benar: kode atau test |

---

> **Lanjut ke:** [`03-metode-ilmiah-bisection-delta.md`](./03-metode-ilmiah-bisection-delta.md) — prosedur lengkap untuk bug apa pun.
