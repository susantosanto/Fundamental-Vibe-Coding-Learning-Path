# 06 — Debugging Kode Buatan AI

> **Level:** Menengah — ini file terpenting di folder ini untuk konteks Anda
> **Waktu:** 60 menit
> **Yang Anda dapat:** cara menyelidiki kode yang tidak Anda tulis — keterampilan inti vibe coding

---

## 📖 Kenapa file ini ada

Di folder lain, debugging diasumsikan seperti ini:

> "Anda menulis kode, ada yang salah, Anda cari tahu."

Dalam vibe coding, kenyataannya berbeda:

> **"AI menulis 200 baris. Anda tidak menulisnya. 3 di antaranya salah. Cari tahu yang mana."**

Itu tugas yang secara fundamental berbeda, dan lebih sulit. Ketika Anda menulis kode sendiri, Anda punya **model mental** yang terbentuk saat menulis — Anda tahu apa yang Anda maksud. Ketika AI menulisnya, model mental itu tidak ada. Anda hanya punya kode yang **kelihatan benar**.

File `01` mengatakan: debugging adalah mencari selisih antara model mental dan kenyataan. Kalau model mentalnya tidak ada, Anda harus **membangunnya dulu** — dan itu pekerjaan tambahan yang tidak ada dalam debugging biasa.

---

## Masalah inti: kode AI itu plausible, bukan benar

Ini perbedaan yang paling penting untuk dipahami:

> **Model bahasa menghasilkan kode yang paling MUNGKIN benar secara statistik — bukan kode yang benar.**
>
> Kode itu dirancang untuk terlihat seperti jawaban yang tepat. Kelihatannya benar,
> strukturnya rapi, komentarnya meyakinkan, penamaannya bagus. Dan kadang salah.

Akibatnya, **mata Anda tidak bisa dipercaya**. Kode yang salah tidak terlihat salah. Anda membaca dan berpikir "oh, ini masuk akal" — dan itu justru jebakannya, karena "masuk akal" adalah persis apa yang dioptimalkan model.

**Konsekuensi untuk debugging:** Anda tidak bisa mengandalkan "kelihatannya benar". Anda harus **memverifikasi**, dan verifikasi butuh cara yang berbeda dari membaca.

---

## Delapan mode kegagalan khas kode AI

Kenali delapan ini. Masing-masing punya **tanda pengenal** dan **cara memeriksanya**.

### 1. API yang tidak ada (halusinasi)

**Apa:** AI memanggil fungsi, method, atau parameter yang **tidak ada**. Terkadang namanya sangat mirip dengan yang asli.

```python
# AI menghasilkan ini:
import pandas as pd
df = pd.read_csv("data.csv")
df.drop_duplicates(subset="nisn", keep_first=True)     # ← parameternya "keep", bukan "keep_first"
df.to_excel("out.xlsx", auto_width=True)               # ← tidak ada parameter "auto_width"
```

```javascript
// AI menghasilkan ini:
const data = await fetch("/api/siswa").json();         // ← fetch() tidak punya .json() langsung
// harusnya:
const response = await fetch("/api/siswa");
const data = await response.json();
```

**Tanda pengenal:**
- `TypeError: got an unexpected keyword argument 'X'`
- `AttributeError: 'X' object has no attribute 'Y'`
- `is not a function`
- Kode "kelihatannya masuk akal" tapi library-nya tidak punya fitur itu

**Cara memeriksa:** **buka dokumentasi resmi.** Jangan percaya kode, jangan percaya AI. Untuk setiap pemanggilan API yang tidak Anda kenal hafal, cek dokumentasinya. Ini memakan 30 detik dan menghemat 2 jam.

**Catatan penting:** ini adalah **mode kegagalan nomor satu** kode AI, dan yang paling sulit dideteksi karena kodenya sangat meyakinkan.

---

### 2. Logika yang plausible tapi salah

**Apa:** Kodenya jalan tanpa error. Tapi logikanya tidak sesuai maksud Anda.

```python
# Maksud Anda: hitung total pengeluaran saja
def hitung_total_biaya(transaksi_list):
    total = 0
    for t in transaksi_list:
        if t.jenis == "pengeluaran":
            total += t.jumlah
        elif t.jenis == "pemasukan":
            total -= t.jumlah        # ← AI "membantu" menghitung saldo
    return total
```

AI menambahkan pengurangan pemasukan karena **secara umum** itu yang sering dimaksud. Tapi maksud **Anda** adalah total pengeluaran. Kodenya masuk akal — hanya bukan yang Anda minta.

**Tanda pengenal:**
- Tidak ada error sama sekali
- Hasilnya "hampir benar" atau "benar untuk sebagian kasus"
- Angkanya tidak sesuai ekspektasi bisnis
- Perilakunya berbeda dari yang Anda bayangkan saat menulis prompt

**Cara memeriksa:** **uji dengan angka yang Anda tahu jawabannya.** Jangan uji dengan data asli — uji dengan 3 kasus yang jawabannya jelas di kepala Anda.

```
Input:  [pengeluaran 100, pemasukan 50]
Harapan: 100        (total pengeluaran)
Hasil:   50         ← SALAH. Bug terdeteksi dalam 5 detik.
```

**Ini juga alasan test sangat penting di vibe coding.** Test adalah cara Anda mengubah "kelihatannya benar" menjadi "terbukti benar". Lihat `fase-2-ai-tools-dasar/09-testing-debugging-ai.md`.

---

### 3. Fallback senyap (silent fallback)

**Apa:** AI membungkus semuanya dengan `try/except` yang menelan error, atau menambahkan nilai default, sehingga kegagalan **tidak terlihat**.

```python
# AI menghasilkan ini karena prompt Anda menyebut "harus tidak crash":
def ambil_siswa(siswa_id):
    try:
        return db.query(Siswa).get(siswa_id)
    except Exception:
        return None          # ← SEMUA error hilang, tidak ada log, tidak ada jejak
```

Kodenya "tidak crash". Tapi sekarang Anda kehilangan semua informasi tentang apa yang salah. Bug akan muncul jauh dari sini, dengan gejala yang tidak berhubungan.

**Tanda pengenal:**
- `except Exception: pass` atau `except: return None`
- Error yang muncul jauh dari sumber masalahnya
- `AttributeError: 'NoneType' object has no attribute ...` di tempat yang tidak masuk akal
- "Kok tiba-tiba data kosong?"
- Aplikasi "jalan terus" padahal ada masalah

**Cara memeriksa:** cari semua `except` di kode AI, dan periksa: apakah ia **mencatat** error, atau **menelannya**?

```python
# ✅ Kalau memang harus ditangani:
except Exception as e:
    logger.exception("[ambil_siswa] gagal untuk siswa_id=%s", siswa_id)
    raise                       # ← teruskan, atau tangani dengan spesifik
```

**Ini mode kegagalan yang paling berbahaya**, karena ia tidak hanya menyembunyikan bug — ia menghancurkan bukti yang Anda butuhkan untuk menemukannya.

---

### 4. Test yang kosong (vacuous tests)

**Apa:** AI menghasilkan test yang **lulus tanpa benar-benar menguji apa pun**. Test hijau memberi rasa aman yang palsu — lebih buruk daripada tidak ada test.

```python
# AI menghasilkan ini:
def test_validasi_nisn():
    hasil = validasi_nisn("1234567890")
    assert hasil is not None            # ← hampir selalu True. Tidak menguji apa pun.

def test_hitung_total():
    total = hitung_total([1, 2, 3])
    assert total                          # ← 6 truthy, tapi 0 juga... dan -1 juga truthy
```

```python
# Test yang lebih jahat: menguji implementasi, bukan perilaku
def test_hitung_hari_kerja():
    hasil = hitung_hari_kerja("2026-05-18", "2026-05-22")
    assert hasil == 5
    assert isinstance(hasil, int)          # ← tidak berguna
```

**Tanda pengenal:**
- Assertion yang selalu benar (`is not None`, `is not False`, `assert x`)
- Tidak ada assertion sama sekali
- Test tidak akan gagal kalau kodenya dirusak ← **cara memeriksa paling andal**
- Test menguji nama fungsi, bukan perilaku

**Cara memeriksa — tes mutasi manual:**

```
1. Ambil test yang AI tulis.
2. Rusak kodenya dengan sengaja (ubah + menjadi -, atau kembalikan nilai salah).
3. Jalankan test.
   - Test GAGAL → test itu benar-benar menguji. Bagus.
   - Test LULUS → test itu kosong. Perbaiki atau hapus.
```

Ini cara tercepat memverifikasi kualitas test. Lakukan untuk setiap test yang AI tulis, minimal sampai Anda percaya dengan gaya penulisannya.

---

### 5. Pengetahuan yang kedaluwarsa

**Apa:** AI memakai API, pola, atau versi library yang sudah usang. Ia tahu banyak, tapi tidak tahu versi yang Anda pakai.

```javascript
// AI menghasilkan ini (pola lama React):
class KomponenSiswa extends React.Component {
  componentWillMount() { ... }        // ← sudah deprecated, bahkan dihapus di React 18
}

// Pola yang benar sekarang:
function KomponenSiswa() {
  useEffect(() => { ... }, []);
}
```

```python
# AI menghasilkan ini (pola lama SQLAlchemy):
session.query(Siswa).filter(Siswa.id == id).one()      # masih jalan, tapi bukan gaya 2.0
# SQLAlchemy 2.0:
session.execute(select(Siswa).where(Siswa.id == id)).scalar_one()
```

**Tanda pengenal:**
- Warning deprecation
- Kode jalan, tapi berbeda gaya dari dokumentasi terbaru
- Library versi baru menolak pola lama
- "Dulu ini jalan" setelah upgrade

**Cara memeriksa:**
- Cek versi library yang Anda pakai: `pip show pandas`, `npm list react`
- Sebutkan versinya **di prompt** saat minta AI menulis kode
- Untuk API yang tidak Anda kenal, cek dokumentasi versi Anda

---

### 6. Buta konteks bisnis

**Apa:** AI tidak tahu aturan domain Anda. Ia menulis kode yang **secara teknis benar** tapi **salah menurut bisnis Anda**.

```python
# AI menulis:
def hitung_hari_kerja(mulai, selesai):
    """Hitung hari kerja, exclude weekend."""
    # ... hanya exclude Sabtu & Minggu
```

**Yang AI tidak tahu:** di sekolah Anda, hari Sabtu adalah hari kerja (minggu ke-2 dan ke-4), dan ada libur nasional, dan ada hari khusus sekolah.

**Tanda pengenal:**
- Kode "benar" tapi hasilnya tidak cocok dengan kenyataan
- Perilaku yang benar untuk kasus umum, salah untuk kasus khusus
- Komentar AI yang mengasumsikan hal yang tidak berlaku di sistem Anda

**Cara memeriksa:** **tulis aturan bisnis Anda di konteks proyek** (`CLAUDE.md` / `AGENTS.MD`), lalu minta AI menulis test dari aturan itu — bukan dari kodenya.

```markdown
<!-- Di CLAUDE.md -->
## Aturan bisnis absensi
- Hari kerja: Senin–Jumat, ditambah Sabtu minggu ke-2 dan ke-4
- Libur nasional dari tabel `hari_libur` → tidak dihitung hari kerja
- Siswa tidak boleh absen di hari libur (validasi wajib)
```

Ini juga inti dari `architecture-planner/MATERI-PECAHAN` — konteks eksplisit adalah yang membedakan kode AI yang berguna dari yang berbahaya.

---

### 7. Komentar yang meyakinkan tapi salah

**Apa:** AI menulis komentar yang menjelaskan kode dengan yakin — dan komentarnya salah. Ini sangat menipu, karena Anda cenderung mempercayai komentar.

```python
# Cache hasil query untuk mengurangi beban database
@lru_cache(maxsize=128)
def get_siswa(siswa_id):
    return db.query(Siswa).get(siswa_id)
# ↑ Komentar bilang "mengurangi beban database" — benar.
#   Tapi ada masalah yang TIDAK disebutkan: kalau data siswa diubah,
#   fungsi ini masih mengembalikan data lama selamanya. Ini bug.
```

```python
# Validasi NISN: 10 digit, tidak boleh dimulai 0
def validasi_nisn(nisn):
    return len(nisn) == 10 and nisn[0] != "0"
# ↑ Komentar bilang "validasi NISN" — tapi ini juga menerima "abcdefghij"!
#   Komentar menciptakan rasa aman yang salah.
```

**Tanda pengenal:**
- Komentar menjelaskan **apa** yang dilakukan, tapi tidak **keterbatasannya**
- Komentar lebih yakin daripada kodenya
- Ada kondisi yang tidak disebutkan komentar

**Cara memeriksa:** **perlakukan komentar sebagai klaim, bukan fakta.** Untuk setiap komentar yang menyatakan sesuatu tentang perilaku, cek apakah kodenya benar-benar melakukan itu. Khususnya: cari kondisi yang **tidak** ditangani.

---

### 8. Perubahan yang tidak diminta

**Apa:** Anda minta perbaikan kecil, AI mengubah hal lain juga. Atau Anda minta fitur baru, AI memfaktorkan ulang tiga file.

**Tanda pengenal:**
- `git diff` jauh lebih besar dari yang Anda minta
- Ada perubahan di file yang tidak Anda sebut
- Perilaku yang tadinya bekerja sekarang berubah
- Bug baru muncul setelah perubahan yang "tidak berhubungan"

**Cara memeriksa:**

```bash
git diff                     # SEBELUM menerima perubahan AI, selalu lihat ini
git diff --stat              # ringkasan: file mana saja yang berubah
```

**Aturan:** kalau AI mengubah file yang tidak Anda minta, **tanyakan kenapa** sebelum menerima. Kadang ada alasan bagus; sering kali tidak.

---

## Protokol membaca kode AI

Karena mata Anda tidak bisa dipercaya untuk kode AI, Anda butuh protokol. Ini yang saya sarankan, berurutan.

### Langkah 1 — Jalankan dulu, jangan baca dulu

Banyak orang langsung membaca. Itu salah untuk kode AI — karena "kelihatannya benar" akan menipu Anda.

```
1. Jalankan dengan 3 input yang jawabannya Anda tahu.
2. Bandingkan hasil dengan harapan Anda.
3. Kalau hasilnya benar → baru baca untuk memverifikasi (Langkah 3).
4. Kalau hasilnya salah → Anda sudah punya bug konkret untuk diselidiki.
```

**Kenapa urutannya begitu:** hasil eksekusi tidak bisa menipu. Bacaan bisa.

### Langkah 2 — Uji batasnya, bukan hanya jalur utamanya

```
- Input kosong / None
- Input sangat besar
- Input dengan karakter khusus (emoji, aksen, tanda kutip)
- Dijalankan dua kali berturut-turut
- Dijalankan bersamaan
```

Kode AI paling sering gagal di **tepi**, bukan di tengah. Jalur utamanya biasanya benar — karena itu yang paling banyak ada di data latihnya.

### Langkah 3 — Baca dengan pertanyaan, bukan dengan mata

Jangan membaca berurutan. Baca dengan **daftar pertanyaan**:

```
Untuk setiap fungsi di kode AI:

1. Apa yang fungsi ini KLAIM lakukan? (dari nama + komentar)
2. Apa yang SEBENARNYA dilakukan? (baca kodenya)
3. Apakah 1 dan 2 sama?  ← di sini bug biasanya

4. Apa yang terjadi kalau inputnya kosong / None?
5. Apa yang terjadi kalau ada error di tengah?
6. Apakah ada `except` yang menelan error?
7. Apakah ada nilai default yang menyembunyikan masalah?
8. Apakah semua pemanggilan API ini benar-benar ada? (cek dokumentasi)

Kalau ada loop:
9. Apakah batasnya benar? (off-by-one)
10. Apakah ada index manual? (bisa dihindari?)
```

Pertanyaan 1 vs 2 adalah yang paling sering mengungkap bug.

### Langkah 4 — Cari jejak delapan mode kegagalan

Pindai kode dengan delapan mode di atas sebagai daftar periksa:

```
[ ] Ada pemanggilan API yang tidak saya kenal? → cek dokumentasi (mode 1)
[ ] Ada `except` yang tidak mencatat error? → mode 3
[ ] Ada test? Apakah test-nya benar-benar menguji? → mode 4
[ ] Apakah library-nya versi yang saya pakai? → mode 5
[ ] Apakah kode ini tahu aturan bisnis saya? → mode 6
[ ] Apakah komentarnya sesuai kode? → mode 7
[ ] Apakah ada perubahan yang tidak saya minta? (`git diff`) → mode 8
[ ] Apakah logikanya sesuai MAKSUD saya, bukan maksud umum? → mode 2
```

---

## Anti-pola paling berbahaya: "biar AI yang betulkan"

Ini pola yang menghancurkan lebih banyak proyek daripada bug mana pun.

### Bentuknya

```
Test gagal.
  ↓
Anda: "Test-nya gagal, betulkan."
  ↓
AI: *menghapus test, atau melonggarkan assertion, atau menambahkan try/except*
  ↓
Test hijau. ✅
  ↓
Bug tetap ada. Sekarang tersembunyi. 🚨
```

### Kenapa AI melakukannya

Bukan karena jahat. Karena Anda bilang "test-nya gagal" — dan secara literal, cara paling langsung membuat test tidak gagal adalah mengubah test-nya. AI mengoptimalkan apa yang Anda minta.

### Tiga bentuk paling umum

```python
# ❌ Bentuk 1: melonggarkan assertion
assert hasil == 5           →   assert hasil is not None

# ❌ Bentuk 2: menghapus / men-skip test
def test_hitung_total():    →   @pytest.mark.skip(reason="perlu diperbaiki")
    ...

# ❌ Bentuk 3: menelan error agar tidak crash
hasil = proses(data)        →   try:
                                    hasil = proses(data)
                                except Exception:
                                    hasil = None
```

**Ketiganya membuat masalah tidak terlihat, bukan selesai.**

### Cara melindungi diri

**1. Bedakan "test gagal" dari "kode salah" di prompt Anda.**

```
❌ "Test ini gagal, betulkan."
   → AI bisa memilih memperbaiki test ATAU kode. Tidak terkendali.

✅ "Test ini gagal. Saya yakin TEST-nya benar dan KODE-nya salah
    (alasan: [alasan]). Cari masalahnya di kode, JANGAN ubah test-nya."
   → AI tahu batasnya.
```

**2. Tanyakan dulu, jangan langsung menyuruh memperbaiki.**

```
"Ini test yang gagal dan kode yang diuji. JANGAN ubah apa pun dulu.
 Jawab dulu: menurut Anda, yang salah itu test-nya atau kodenya?
 Sebutkan alasannya. Kalau ada ketidakjelasan, sebutkan apa yang
 belum jelas dan tanyakan ke saya."
```

Sekarang **Anda** yang memutuskan, dan AI memberi analisis.

**3. Periksa `git diff` setiap kali.**

```bash
git diff tests/          # apakah AI menyentuh test?
```

Kalau AI mengubah test padahal Anda bilang jangan — kembalikan, dan ulangi dengan prompt yang lebih tegas.

**4. Ini yang paling penting: periksa apakah test-nya benar-benar menguji.**

Kalau test hijau, **rusak kodenya dengan sengaja**. Kalau test tetap hijau, test itu tidak menguji apa pun. (Lihat mode kegagalan 4.)

### Hubungannya dengan harness engineering

Kalau Anda mengikuti pembahasan harness engineering di `architecture-planner/MATERI-PECAHAN/RISET-Harness-Engineering-dan-Audit-Bab-27.md`, masalah ini punya nama:

> Sensor yang **bisa dimatikan oleh objek yang diawasi** bukan sensor yang bisa dipercaya.

Test yang bisa dihapus oleh agent yang sedang diuji bukan test — itu saran. Solusinya adalah bagian dari **guides (feedforward)**: aturan eksplisit di `AGENTS.MD` / konteks proyek yang melarang agent mengubah test agar lulus, dan **sensors (feedback)** yang memeriksa apakah test masih menguji (misalnya memeriksa jumlah test, atau menjalankan tes mutasi).

Kalau ini terasa relevan, itu karena memang — ini persis celah yang dibahas di dokumen rencana penutupan gap.

---

## Prompt yang bekerja untuk debugging kode AI

Tiga pola, dari yang paling aman.

### Pola 1 — Diagnosis dulu, tanpa perbaikan

```
Kode ini dihasilkan AI dan hasilnya salah.
Gejala: [gejala persis]
Yang saya harapkan: [perilaku yang benar]

JANGAN ubah kode apa pun dulu. Jawab ini saja:
1. Menurut Anda, apakah kode ini sesuai dengan yang saya harapkan?
2. Kalau tidak, di baris mana perbedaannya?
3. Apa yang sebenarnya dilakukan baris itu?
4. Adakah asumsi dalam kode ini yang mungkin tidak berlaku di sistem saya?
```

### Pola 2 — Cari delapan mode kegagalan

```
Periksa kode ini terhadap daftar masalah umum kode AI:
1. Pemanggilan API yang tidak ada atau parameternya salah
2. Logika yang masuk akal tapi tidak sesuai maksud saya
3. `except` yang menelan error tanpa mencatat
4. Test yang lulus tanpa benar-benar menguji
5. API yang sudah deprecated di versi [versi saya]
6. Asumsi tentang aturan bisnis yang mungkin salah
7. Komentar yang tidak sesuai kode
8. Perubahan yang tidak diminta

Untuk setiap yang Anda temukan: sebutkan barisnya, dan jelaskan
kenapa itu masalah. Kalau tidak ada, katakan tidak ada — jangan mengarang.
```

### Pola 3 — Verifikasi, bukan perbaikan

```
Saya sudah memperbaiki bug ini. Perbaikan saya: [diff atau deskripsi].
Bug aslinya: [gejala]

JANGAN menyarankan perbaikan lain dulu. Jawab ini:
1. Apakah perbaikan ini mengatasi AKAR masalahnya, atau hanya gejalanya?
2. Kasus apa lagi yang mungkin terkena bug yang sama tapi belum saya perbaiki?
3. Test apa yang seharusnya saya tulis untuk mengunci perbaikan ini?
4. Kalau saya mengembalikan satu baris dari perbaikan saya, apakah bug muncul lagi?
```

**Pola 3 adalah yang paling berharga.** Kebanyakan orang memakai AI untuk *menemukan* bug; memakainya untuk **memverifikasi perbaikan** jauh lebih berdampak, karena di situlah kesalahan paling mahal terjadi.

---

## Utang verifikasi (verification debt)

Konsep yang perlu Anda kenali:

> **Setiap baris kode AI yang Anda terima tanpa memverifikasi adalah utang.**
>
> Utangnya kecil sendirian. Tapi ia menumpuk — dan bunganya dibayar dalam bentuk
> bug yang sulit dilacak, karena Anda tidak punya model mental untuk kode itu.

Kode yang Anda tulis sendiri: Anda punya model mental, jadi debugging cepat.
Kode AI yang Anda terima tanpa memeriksa: tidak ada model mental, jadi debugging **lambat dan menebak-nebak**.

**Cara mengelola utang ini:**

| Praktik | Efek |
|---|---|
| Minta AI menjelaskan kode yang tidak Anda pahami, **sebelum** menerima | Membangun model mental |
| Uji dengan 3 input yang jawabannya Anda tahu | Menangkap mode 2 dan 6 |
| Cek dokumentasi untuk API yang tidak Anda kenal | Menangkap mode 1 dan 5 |
| Baca `git diff` sebelum menerima | Menangkap mode 8 |
| Untuk setiap `except`, tanya "apakah ini menelan error?" | Menangkap mode 3 |
| Untuk setiap test, rusak kodenya — apakah test gagal? | Menangkap mode 4 |
| Tulis satu kalimat alasan untuk setiap blok yang tidak Anda tulis | Membangun model mental |

**Kenyataan praktis:** Anda **tidak bisa** memverifikasi semuanya. Itu tidak realistis. Jadi prioritaskan:

```
🔴 WAJIB verifikasi:
   - Kode yang menangani uang
   - Kode yang menangani data pribadi
   - Kode yang menangani autentikasi/izin
   - Kode yang menyimpan atau menghapus data
   - Kode yang Anda tidak paham sama sekali

🟠 Sebaiknya verifikasi:
   - Kode yang sulit diubah nanti (skema database, API publik)
   - Kode di jalur kritis

🟡 Boleh diterima dengan risiko:
   - Kode tampilan/UI
   - Skrip sekali pakai
   - Prototipe yang akan dibuang
```

Utang verifikasi di kategori kuning itu normal dan sehat. Utang di kategori merah adalah cara proyek gagal.

---

## Checklist sebelum menerima kode AI

```
SEBELUM menjalankan:
[ ] Saya tahu apa yang kode ini SEHARUSNYA lakukan (bisa saya tulis 1 kalimat)
[ ] Saya punya 3 input dengan jawaban yang saya tahu
[ ] Saya sudah lihat `git diff` — perubahan sesuai yang saya minta

SETELAH menjalankan:
[ ] Hasilnya sesuai harapan untuk 3 input itu
[ ] Saya sudah uji batasnya: kosong, None, sangat besar, karakter khusus
[ ] Saya sudah jalankan dua kali berturut-turut

MEMBACA KODE:
[ ] Setiap pemanggilan API yang tidak saya kenal → sudah dicek di dokumentasi
[ ] Setiap `except` → apakah mencatat error, atau menelan?
[ ] Tidak ada nilai default yang menyembunyikan masalah
[ ] Komentar sesuai dengan kode
[ ] Loop: batasnya benar, tidak ada index manual yang bisa dihindari

TEST (kalau ada):
[ ] Saya sudah RUSAK kodenya dengan sengaja — apakah test gagal?
      (kalau test tetap hijau, test itu tidak menguji apa pun)

MODEL MENTAL:
[ ] Saya bisa menjelaskan apa yang dilakukan kode ini, dalam 2–3 kalimat
[ ] Kalau tidak bisa → saya sudah minta AI menjelaskan, dan saya tulis ulang
```

Kalau ada yang gagal di kategori 🔴 (uang, data pribadi, auth, simpan/hapus data) — jangan terima kodenya sampai beres.

---

## Ringkasan

| Aspek | Kode yang Anda tulis | Kode buatan AI |
|---|---|---|
| Model mental | Terbentuk saat menulis | **Tidak ada — harus dibangun dulu** |
| Bisa dipercaya mata? | Cukup | **Tidak — kode dirancang agar terlihat benar** |
| Cara memverifikasi | Baca + jalankan | **Jalankan dulu, baca kemudian** |
| Mode kegagalan utama | Logika sendiri | **Halusinasi API, fallback senyap, test kosong** |
| Bahaya terbesar | Bug yang Anda buat | **Bug yang Anda terima tanpa sadar** |
| Waktu debugging | Cepat (model mental ada) | **Lambat (model mental harus dibangun)** |

**Tiga aturan yang paling penting:**

1. **Jalankan dulu, baca kemudian.** Hasil eksekusi tidak bisa menipu; bacaan bisa.
2. **Untuk setiap test, rusak kodenya.** Kalau test tetap hijau, test itu kosong.
3. **Jangan pernah menyuruh AI "betulkan test yang gagal" tanpa memutuskan dulu siapa yang salah.** Itu cara bug bersembunyi.

---

> **Lanjut ke:** [`07-latihan-bertahap-debugging.md`](./07-latihan-bertahap-debugging.md) — ubah pemahaman jadi kemampuan.
