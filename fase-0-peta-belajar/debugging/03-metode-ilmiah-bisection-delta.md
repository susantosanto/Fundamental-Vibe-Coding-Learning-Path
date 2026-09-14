# 03 — Metode Ilmiah: Bisection & Delta Debugging

> **Level:** Fondasi → Menengah
> **Waktu:** 60 menit
> **Yang Anda dapat:** satu prosedur yang berlaku untuk **semua** bug, di bahasa apa pun

---

## 📖 Kenapa butuh prosedur

Kalau Anda hanya membaca satu file di folder ini, baca yang ini.

Alasannya: tanpa prosedur, setiap bug adalah petualangan baru. Anda mengandalkan intuisi, dan intuisi hanya bekerja untuk bug yang **sudah pernah Anda temui**. Untuk sisanya, Anda menebak.

Dengan prosedur, Anda punya jalan yang bisa diikuti bahkan ketika Anda tidak punya ide sama sekali. Itu perbedaan antara "saya tidak tahu harus mulai dari mana" dan "saya sedang di langkah 3".

---

## REDUCE Framework

Enam langkah. Berlaku untuk bug apa pun, dari typo sampai race condition.

```
R  →  Reproduce       Reproduksi bug secara konsisten
E  →  Establish       Tetapkan perilaku yang seharusnya
D  →  Divide          Bagi dua ruang pencarian
U  →  Understand      Pahami sebelum memperbaiki
C  →  Confirm         Konfirmasi akar masalahnya
E  →  Eliminate       Hilangkan, lalu verifikasi
```

**Aturan pemakaian:** jangan melompati langkah. Setiap langkah yang dilewati hampir selalu harus Anda ulangi nanti, dengan biaya lebih besar.

Kalau Anda macet di tengah, kembali ke langkah **R**. Penyebab paling umum dari "macet" adalah langkah R yang belum benar-benar selesai.

---

## R — Reproduce: buat bug-nya muncul

> **Anda tidak bisa men-debug apa yang tidak bisa Anda munculkan.**

Ini langkah yang paling sering dilewati, dan penyebab kegagalan paling umum.

### Buat reproduksi yang minimal

Reproduksi minimal = **langkah paling sedikit** yang masih memunculkan bug.

```
❌ Bukan minimal                     ✅ Minimal
─────────────────────────────        ────────────────────────────
Seluruh aplikasi                     Satu endpoint atau satu fungsi
Database produksi                    Dataset terkecil yang gagal
Alur user lengkap                    Klik paling sedikit yang memicu
```

Kenapa penting: setiap langkah yang Anda buang mempersempit ruang pencarian. Reproduksi minimal mengubah bug "di suatu tempat dalam 5000 baris" menjadi "di dalam 20 baris ini".

### Cara meminimalkan secara sistematis

```
1. Mulai dari langkah yang Anda punya (mungkin panjang).
2. Buang satu langkah. Apakah bug masih muncul?
   - Masih → langkah itu tidak perlu. Buang permanen.
   - Tidak  → langkah itu penting. Kembalikan.
3. Ulangi sampai tidak ada satu langkah pun yang bisa dibuang.
```

Ini **delta debugging** yang diterapkan pada langkah reproduksi — versi manual dari teknik di langkah D nanti.

### Tulis langkahnya seperti untuk orang asing

```
## Langkah reproduksi
1. Reset database: `npm run db:reset`
2. Buat user dengan email "test@example.com"
3. Login sebagai user itu
4. Buka /absensi
5. Pilih kelas "6A", klik Simpan
6. ERROR: siswa tersimpan di kelas "6B"
```

Kenapa harus eksplisit: **proses menuliskannya sering kali mengungkap bug-nya sendiri.** Anda akan menyadari "oh, ternyata harus pilih kelas dulu, kalau tidak default-nya nyangkut dari sesi sebelumnya" — dan itu sudah setengah jawabannya.

### Bug intermiten (muncul-hilang)

Ini kasus khusus yang butuh penanganan berbeda. Bug yang tidak konsisten hampir selalu salah satu dari empat hal:

| Penyebab | Ciri | Cara memastikan |
|---|---|---|
| **Race condition** | Muncul saat request/thread bersamaan | Jalankan N request paralel. Kalau frekuensi bug naik dengan N → race. |
| **State bersama** | Muncul setelah beberapa operasi sebelumnya | Jalankan urutan berbeda. Kalau hasilnya berubah → state. |
| **Data tertentu** | Muncul hanya untuk input tertentu | Jalankan dengan banyak variasi data. Catat mana yang gagal. |
| **Waktu / timezone / urutan** | Muncul pada jam/tanggal tertentu | Bandingkan log sukses vs gagal. Cari pola waktu. |

**Prosedur untuk bug intermiten:**

```
1. PERBESAR SAMPEL
   Jalankan skenario 100×, catat berapa yang gagal.
   "7 dari 100" jauh lebih berguna daripada "kadang gagal".

2. VARIASIKAN KONDISI
   Ubah satu variabel pada satu waktu: jumlah request, ukuran data,
   kecepatan, urutan operasi. Lihat mana yang mengubah frekuensi.

3. CATAT SAAT BERHASIL DAN SAAT GAGAL
   Ini kuncinya. Kebanyakan orang hanya mencatat saat gagal.
   Perbandingan antara keduanya yang mengungkap penyebabnya.

4. CARI POLA
   Semua gagal di menit ke-?: jam tertentu? user tertentu?
   data dengan karakteristik tertentu? → itu petunjuk terkuat Anda.
```

**Prinsip penting:** kalau bug-nya intermiten, **tugas pertama Anda bukan memperbaiki — tapi membuatnya konsisten.** Selama ia muncul-hilang, setiap "perbaikan" hanya tebakan yang tidak bisa diverifikasi.

---

## E — Establish: tetapkan apa yang seharusnya terjadi

Anda butuh target yang jelas. Tanpa itu, Anda tidak tahu kapan sudah selesai.

### Definisikan "benar" secara presisi

```
❌ Kabur: "Halaman absensi harus jalan."
✅ Presisi: "Klik Simpan dengan kelas 6A harus menyimpan siswa ke kelas 6A,
            dan menampilkan 'Tersimpan' dalam 2 detik."
```

Kalau Anda tidak bisa menuliskan versi presisi, **Anda belum tahu apa bug-nya.** Anda hanya tahu ada yang tidak enak dilihat.

### Periksa spesifikasi sebelum menuduh kode

Sebelum menganggap kode salah, periksa:

- Apa yang dikatakan dokumentasi?
- Apa yang diharapkan test?
- Apa yang diminta tiket/tugas aslinya?
- Apa yang dilakukan fitur serupa di tempat lain?

**Kadang "bug" itu bekerja sesuai desain** — hanya desainnya yang keliru. Kalau begitu, masalahnya bukan di kode, tapi di keputusan desain. Itu perbedaan penting: memperbaiki kode yang benar akan menghasilkan kekacauan.

### Tulis test yang gagal

Ini langkah yang mengubah debugging dari "kelihatannya sudah beres" menjadi "terbukti sudah beres".

```python
def test_siswa_tersimpan_di_kelas_yang_dipilih():
    simpan_siswa(nama="Ani", kelas="6A")
    siswa = ambil_siswa(nama="Ani")
    assert siswa.kelas == "6A"      # ← ini akan GAGAL sekarang
```

Test ini punya tiga fungsi sekaligus:
1. **Kriteria sukses** — Anda tahu kapan selesai
2. **Bukti reproduksi** — bug-nya sekarang terdokumentasi
3. **Pengunci regresi** — setelah diperbaiki, bug ini tidak bisa kembali

---

## D — Divide: bagi dua ruang pencarian

Ini inti kecepatan debugging. Debugging bukan pemindaian linear — **debugging adalah binary search.**

Perbedaan matematisnya besar:

```
Linear scan:  O(n)   — 1000 baris → sampai 1000 pemeriksaan
Binary search: O(log n) — 1000 baris → 10 pemeriksaan
```

Sepuluh pemeriksaan, bukan seribu. Itu sebabnya orang yang memakai bisection menyelesaikan bug berkali-kali lebih cepat.

### Metode belah dua (half-split)

```
1. Identifikasi JALUR dari input sampai bug.
   Contoh: Request → Controller → Service → Repository → Database

2. Pilih TITIK TENGAH.

3. Periksa: apakah data BENAR di titik tengah itu?
   - Benar   → bug ada di paruh KEDUA (setelah titik tengah)
   - Salah   → bug ada di paruh PERTAMA (sebelum titik tengah)

4. Ulangi pada paruh yang tersisa.
```

**Contoh nyata:**

```
Masalah: API mengembalikan data guru yang salah.

Jalur: Request → Controller → Service → Repository → Database
                        ↑
                  mulai dari sini (titik tengah)

Periksa di Service: apakah data sudah salah di sini?
  ├─ YA  → bug di Repository atau Database (paruh pertama)
  │        → periksa di Repository
  │           ├─ data salah di sini → bug di query atau database
  │           └─ data benar di sini → bug di Service
  └─ TIDAK → bug di Controller atau serialisasi (paruh kedua)

Satu pemeriksaan → separuh kode tereliminasi.
```

**Cara memeriksa di titik tengah:** tambahkan log, atau gunakan debugger untuk melihat nilai variabel di titik itu.

```python
def get_guru(self, guru_id):
    data = self.repo.find(guru_id)
    logger.debug("get_guru: data dari repo = %r", data)   # ← titik pemeriksaan
    return self.format(data)
```

### Belah dua di dalam satu fungsi

Bug di fungsi 200 baris? Sama:

```
1. Tambahkan log di baris 100.
2. Nilai di baris 100 benar? → bug di baris 100–200
3. Nilai di baris 100 salah? → bug di baris 1–100
4. Ulangi.
```

Sepuluh iterasi menyelesaikan 1000 baris.

### Belah dua lintas waktu: `git bisect`

Kalau bug **muncul setelah perubahan** (dan Anda tidak tahu perubahan mana), jangan telusuri kode — telusuri **commit**.

```bash
git bisect start
git bisect bad HEAD              # commit sekarang rusak
git bisect good v2.3.0           # tag/commit yang diketahui baik

# Git akan checkout commit tengah. Uji, lalu tandai:
git bisect good                  # kalau commit ini baik
git bisect bad                   # kalau commit ini rusak

# Ulangi sampai git menunjuk SATU commit penyebabnya.
git bisect reset                 # kembali ke keadaan semula
```

**Versi otomatis** — kalau Anda punya test yang gagal:

```bash
git bisect start
git bisect bad HEAD
git bisect good v2.3.0
git bisect run python -m pytest tests/test_absensi.py -x
# Git menjalankan test di setiap commit secara otomatis,
# lalu memberi tahu commit mana yang pertama merusak.
```

Untuk 1000 commit, ini butuh ~10 langkah. Manual, bisa berhari-hari.

**Kapan `git bisect` adalah alat yang tepat:**
- "Dulu jalan, sekarang tidak" dan Anda tidak tahu sejak kapan
- Bug yang tidak jelas berasal dari kode mana
- Setelah merge besar, pull, atau upgrade dependency

### Belah dua pada perubahan: delta debugging

Bug muncul setelah Anda mengubah 100 baris? Jangan telusuri satu per satu. **Kembalikan separuhnya.**

```
1. Kembalikan 50 baris pertama. Bug masih ada?
   - Masih  → penyebabnya di 50 baris KEDUA. Buang 50 baris pertama dari kecurigaan.
   - Hilang → penyebabnya di 50 baris PERTAMA.
2. Ulangi pada 50 baris yang tersisa.
3. ~7 langkah untuk menemukan 1 baris dari 100.
```

Ini juga berlaku untuk konfigurasi: kalau Anda mengubah 20 setting dan sesuatu rusak, kembalikan separuhnya, lalu separuhnya lagi.

### Sumbu pembagian lain

Belah dua tidak selalu soal posisi di kode. Anda juga bisa membelah berdasarkan:

| Sumbu | Pertanyaan | Cara membelah |
|---|---|---|
| **Kode** | Di mana dalam alur eksekusi? | Log di titik tengah |
| **Data** | Input mana yang gagal? | Bagi dataset, uji separuhnya |
| **Waktu** | Sejak kapan? | `git bisect` |
| **Lingkungan** | Lokal vs server? | Jalankan di kedua tempat |
| **Pengguna** | Semua atau sebagian? | Bandingkan user yang gagal vs berhasil |
| **Beban** | Bergantung pada jumlah? | Naikkan/turunkan trafik |

Setiap sumbu adalah kesempatan untuk membelah. Kalau satu sumbu tidak menghasilkan, coba sumbu lain.

**Prinsip kunci:** setiap langkah belah dua harus berupa uji yang **jelas lulus/gagal**. Hasil yang ambigu berarti uji Anda belum cukup terisolasi — perbaiki ujinya dulu, jangan lanjut.

---

## U — Understand: pahami sebelum memperbaiki

> **Ini langkah yang paling sering dilanggar.**

Dorongan untuk segera menempelkan perbaikan sangat kuat. Tahan.

### Baca kodenya sungguh-sungguh

Bukan skimming. Baca dan lacak eksekusinya:

```
- Baris ini MENERIMA apa?
- Baris ini MENGHASILKAN apa?
- Kalau inputnya X, maka outputnya harus Y. Apakah begitu?
- Kondisi apa yang harus benar agar baris ini jalan?
```

**Pertanyaan paling berguna:** *"apa yang harus benar agar baris ini bekerja?"* — lalu periksa apakah itu memang benar.

### Jangan menyentuh kode sebelum bisa menjelaskan

Uji: jelaskan bug-nya kepada seseorang (atau kertas, atau AI) dalam 3 kalimat:

```
1. Apa gejalanya
2. Kenapa itu terjadi (mekanismenya)
3. Kenapa itu menyebabkan gejala tersebut
```

Kalau Anda tidak bisa menyelesaikan kalimat ke-2, Anda belum paham. Mengubah kode saat itu adalah judi.

### Jangan refactor saat debugging

Selama sesi debugging, **hanya perbaiki bug-nya**. Perbaikan kode yang tidak berhubungan akan:

- Membuat Anda tidak tahu perubahan mana yang berpengaruh
- Menambah variabel baru ke dalam masalah
- Menyulitkan pengembalian kalau perbaikan Anda salah

Simpan refactoring untuk sesi terpisah, setelah bug selesai.

---

## C — Confirm: konfirmasi akar masalahnya

Anda punya hipotesis. Sekarang **buktikan**, sebelum memperbaiki.

### Cara mengonfirmasi

Hipotesis: *"`siswa_id` yang dikirim frontend salah karena dropdown memakai index array, bukan ID."*

**Uji:** ubah sementara frontend untuk mengirim ID hardcoded yang benar. Apakah bug hilang?

```
Hilang    → hipotesis terkonfirmasi ✅
Tidak     → hipotesis salah. Bagus — Anda baru saja mengeliminasi satu kemungkinan.
```

### Tanya "kenapa" sampai akarnya

```
Crash saat siswa tidak ditemukan
  └─ Kenapa? → kode mengakses siswa.nama padahal siswa None
      └─ Kenapa? → query tidak menemukan record
          └─ Kenapa? → ID yang dikirim salah
              └─ Kenapa? → dropdown memakai index array, bukan ID
                  └─ Kenapa? → kode aslinya ditulis untuk data statis
                      └─ AKAR: asumsi data statis masih tertinggal di kode dinamis
```

Berhenti ketika jawaban "kenapa" berikutnya sudah bukan lagi tentang kode Anda (misalnya "karena saya tidak teliti" — itu bukan akar teknis).

### Bedakan akar dari gejala

| Gejala | Akar |
|---|---|
| Aplikasi crash saat siswa tidak ada | Tidak ada penanganan untuk record yang tidak ditemukan |
| Total biaya lebih kecil dari seharusnya | Pemasukan dikurangkan dari total pengeluaran |
| Data tersimpan di kelas yang salah | Dropdown memakai index, bukan ID |

**Uji cepat:** kalau perbaikan Anda berupa `try/except`, `if x is None: return`, atau nilai default — **kemungkinan besar Anda memperbaiki gejala.** Bukan selalu salah, tapi selalu patut dipertanyakan.

---

## E — Eliminate: hilangkan dan verifikasi

### Terapkan perubahan minimal

Perubahan terkecil yang mengatasi **akar**, bukan gejala.

```python
# ❌ Terlalu banyak — memperbaiki gejala + refactor + fitur baru
def simpan_absensi(data):
    try:
        siswa = get_siswa(data["id"])
        if siswa:
            # ... 30 baris baru ...
    except Exception:
        pass

# ✅ Minimal — hanya akarnya
def simpan_absensi(data):
    siswa = get_siswa(data["siswa_id"])   # ← pakai ID, bukan index
    if siswa is None:
        return error_404("Siswa tidak ditemukan")
    simpan(siswa, data["status"])
```

### Jalankan seluruh test suite

Perbaikan yang tidak merusak apa pun itu wajib, bukan opsional. Bug yang "diperbaiki" tapi merusak fitur lain bukan perbaikan.

```bash
pytest tests/ -v
```

### Tambahkan regression test

Test yang gagal sebelum perbaikan, dan lulus sesudahnya. Ini mengunci perbaikannya:

```python
def test_siswa_tersimpan_di_kelas_yang_dipilih():
    """Regression: dropdown dulu memakai index, bukan ID (bug #42)."""
    simpan_siswa(nama="Ani", kelas="6A")
    assert ambil_siswa("Ani").kelas == "6A"
```

### Uji perkecil perbaikan Anda

Ini langkah yang paling sering dilewatkan, dan paling berharga:

```
Kembalikan SATU baris dari perbaikan Anda.
Apakah bug muncul lagi?
  Ya  → baris itu memang diperlukan. Kembalikan perbaikannya.
  Tidak → baris itu TIDAK diperlukan. Anda baru saja menemukan
          sesuatu yang tidak Anda pahami dalam perbaikan Anda sendiri.
```

### Verifikasi edge case

Bug asli sudah hilang. Sekarang uji sekitarnya:

- [ ] Input kosong
- [ ] Input `null` / `None`
- [ ] Nilai batas (0, negatif, maksimum)
- [ ] Data sangat besar
- [ ] Karakter khusus / unicode / emoji
- [ ] Dijalankan dua kali berturut-turut
- [ ] Dijalankan bersamaan (jika relevan)

Bug yang Anda perbaiki sering punya **saudara** di kondisi yang berdekatan.

---

## Jurnal debugging

Simpan ini. Setelah 20 catatan, Anda akan mulai mengenali pola — dan debugging berubah dari investigasi menjadi pengenalan.

```markdown
## Bug #__: <judul singkat>
**Tanggal:** ____  **Durasi:** ____  **File:** ____

### Gejala
<apa yang terlihat salah>

### Perilaku yang seharusnya
<versi presisinya>

### Reproduksi
1. ...
2. ...

### Yang dieliminasi
- [x] <hipotesis> → <hasil uji>
- [x] <hipotesis> → <hasil uji>

### Akar masalah
<mekanisme, bukan gejala>

### Perbaikan
<apa yang diubah, kenapa>

### Pelajaran
<kalau bug ini muncul lagi, apa tanda pertama yang harus saya periksa?>
```

Kolom **Pelajaran** yang paling berharga. Isinya bukan "hati-hati dengan off-by-one" (terlalu umum), tapi **tanda pengenal spesifik**: "kalau `len()` muncul sebagai index, periksa off-by-one".

---

## Ringkasan prosedur

```
R  REPRODUCE   → Buat bug muncul, sesedikit mungkin langkah. Intermiten? Buat konsisten dulu.
E  ESTABLISH   → Tetapkan "benar" secara presisi. Tulis test yang gagal.
D  DIVIDE      → Belah dua: kode, data, waktu (git bisect), lingkungan, beban.
U  UNDERSTAND  → Baca kode sungguh-sungguh. Jelaskan dalam 3 kalimat sebelum mengubah.
C  CONFIRM     → Buktikan hipotesis. Tanya "kenapa" sampai akarnya.
E  ELIMINATE   → Perubahan minimal. Test suite. Regression test. Uji perkecil. Edge case.
```

**Kalau macet:** kembali ke **R**. Penyebab paling umum dari macet adalah reproduksi yang belum benar-benar selesai.

**Kalau bug-nya intermiten:** jangan lanjut ke D sebelum R menghasilkan reproduksi yang konsisten.

---

> **Lanjut ke:** [`04-taktik-debugging.md`](./04-taktik-debugging.md) — alat konkret untuk menjalankan prosedur ini.
