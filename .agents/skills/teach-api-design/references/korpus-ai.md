# Korpus Kode Hasil AI — API Design (Cara Menyiapkan & Empat Latihan Inspeksi)

> Referensi untuk skill **`teach-api-design`**. **Tutor membaca file ini sendiri.**
> Pembelajar tidak diarahkan membukanya (§MODE PENYAMPAIAN di `SKILL.md`).
>
> **Dibuat:** 29 September 2026 · **Kerangka asal:** `teach-software-design/references/korpus-ai.md`

---

## 1. Kenapa korpusnya HARUS kode hasil generate AI

Karena **itu yang akan dihadapi pembelajar setelah lulus.** Bukan contoh rapi dari tutorial,
bukan kode yang ditulis tutor dengan hati-hati — tapi kode yang dihasilkan AI, yang
**terlihat benar** dan **sering hampir benar**.

| Sumber | Temuan | Konsekuensi untuk korpus |
|---|---|---|
| **Stack Overflow Developer Survey 2025** | **66%** developer frustrasi utamanya *"solutions that are almost right, but not quite"*; **45%** bilang men-debug kode AI **lebih memakan waktu** | Korpusnya harus kode yang **hampir** benar — bukan yang jelas salah |
| **RCT Anthropic** (arXiv 2601.20245, Jan 2026) | Gap terbesar AI vs manual justru di **debugging** | Latihan TELUSUR wajib ada, dan porsinya besar |
| **MIT Media Lab** (arXiv 2506.08872) | Pengguna LLM kesulitan mengutip karyanya sendiri | Pembelajar wajib bisa **menjelaskan** tiap keputusan kontrak yang ia terima |
| **Veracode 2025** | Hanya **55%** kode AI aman | Cacat kontrak yang berdampak keamanan (cache data pribadi, tanpa `no-store`) masuk korpus |

> **Batas kejujuran:** angka-angka di atas berasal dari survei & studi dengan populasi
> berbeda. Ia dipakai sebagai **indikasi arah**, bukan bukti sebab-akibat. RCT Anthropic
> sampelnya kecil (52), satu library, mayoritas junior. **Belum ada studi khusus
> API design** yang mengukur hal ini.

### 🔴 Yang paling penting untuk BIDANG INI

Cacat kontrak **hampir selalu tidak menghasilkan error.**

| Cacat | Apa yang terlihat | Error? |
|---|---|---|
| Pagination offset | Baris terlewat & ganda saat ada data baru | ❌ **tidak ada** |
| `POST` tanpa idempotency | Pesanan/pembayaran ganda saat timeout | ❌ **tidak ada** |
| Cache tanpa `no-store` pada data pribadi | Klien melihat data lama | ❌ **tidak ada** |
| Cache tanpa `private` | Data pribadi tersimpan di cache bersama | ❌ **tidak ada** |
| `GET` yang mengubah data | Kunjungan tercatat, penghitung naik | ❌ **tidak ada** |
| Error `500` untuk semua kegagalan | Klien tidak bisa membedakan sebab | ❌ **tidak ada** |
| `200` dengan `{error: …}` | Klien menganggap semuanya berhasil | ❌ **tidak ada** |
| Nama parameter diganti | Klien lama berhenti bekerja | ✅ **ada** — tapi di **komputer klien**, bukan di sini |
| Versi dihapus tanpa `Sunset` | Klien mati mendadak | ✅ **ada** — tapi **belakangan** |

**Konsekuensinya:** korpus API design harus berisi cacat yang **tidak terlihat dari membaca**.
Kode harus **jalan, lulus tes, terlihat rapi.** Kalau cacatnya kelihatan sekilas, itu bukan latihan.

**Dan satu hal khusus bidang ini:** cacatnya sering **baru muncul pada pemanggilan kedua,
ketiga, ke-sepuluh** — bukan pada yang pertama. Itu sebabnya korpusnya harus
**dijalankan berulang**, bukan sekali.

---

## 2. Dari mana korpusnya diambil

**Aturan: korpus dihasilkan AI, lalu dipakai APA ADANYA.**

| Langkah | Yang dilakukan | Yang TIDAK dilakukan |
|---|---|---|
| 1 | Minta AI membuat spesifikasi/server/proyek kecil dengan permintaan **wajar** | ❌ Jangan minta "buat yang ada bugnya" |
| 2 | **Simpan apa adanya** — termasuk gaya penamaan & komentarnya | ❌ Jangan rapikan |
| 3 | Jalankan. Pastikan **jalan tanpa error** | ❌ Jangan perbaiki dulu |
| 4 | Periksa: apakah cacatnya **tidak kentara**? | Kalau kentara → minta AI lagi, variasi lain |
| 5 | Tulis **1 paragraf** apa yang AI klaim bisa dilakukan kode itu | Ini yang jadi bahan "klaim vs kenyataan" |

> **Penting:** langkah 5 adalah inti latihan. AI **selalu** mengklaim kodenya benar.
> Klaim itu disimpan **tertulis**, supaya bisa dibandingkan dengan kenyataan.

### Contoh permintaan yang menghasilkan cacat senyap (tanpa menyebut bug)

- *"Buat endpoint daftar pembayaran siswa dengan pagination, siap pakai untuk laporan sekolah."*
  → biasanya menghasilkan **offset pagination** (Unit 10)
- *"Buat endpoint untuk menyimpan pembayaran SPP baru."*
  → biasanya **`POST` tanpa idempotency** (Unit 11)
- *"Buat endpoint daftar siswa yang cepat, pakai caching."*
  → biasanya **`max-age` besar tanpa `private`/`no-store`** (Unit 12)
- *"Buat API untuk login dan lihat profil sendiri."*
  → biasanya **`GET` yang mencatat kunjungan** (Unit 4)
- *"Tangani error dengan rapi di seluruh API ini."*
  → biasanya **`500` untuk semua**, atau `200` + `{error}` (Unit 5, 9)

**Semua permintaan di atas wajar.** Tidak ada yang meminta bug. Itu justru maksudnya:
cacatnya lahir dari **cara AI menyelesaikan masalah yang wajar**.

---

## 3. Ukuran korpus per bagian

| Bagian | Korpus | Ukuran | Cacat yang dicari |
|---|---|---|---|
| 0 | Satu file spesifikasi API (Markdown/JSON) | 20–40 baris | Endpoint menamai aksi; hal yang tidak bisa diketahui pembaca |
| 1 | Satu file server dengan routing | 30–80 baris | `GET` yang mengubah data; status salah; `Content-Type` hilang |
| 2 | Satu proyek kecil (3–5 file) | 150–250 baris | Pagination offset; `POST` tanpa kunci; cache salah; `429` tanpa `Retry-After` |
| 3 | Satu spesifikasi + dokumentasi | 250–400 baris | Spec tidak sinkron dengan kode; versi tanpa deprecation |

**Aturan ukuran:** kalau korpus lebih besar dari ini, pembelajar kehabisan waktu **membaca**
dan tidak sempat **membedah**. Lebih kecil lebih baik.

---

## 4. Empat jenis latihan inspeksi

Semua latihan di `peta-unit.md` memakai salah satu dari empat bentuk ini.
**Bedanya cuma satu: apa yang diminta di akhir.**

| Jenis | Yang diminta | Yang dilatih | Contoh unit |
|---|---|---|---|
| **LACAK** | *"Apa yang terjadi?"* | Model mental — menelusuri alur | 1, 3 |
| **SUSUN** | *"Urutkan/bentuk ulang ini"* | Struktur (Parsons) | 3, 16 |
| **KLAIM** | *"Benar atau tidak? Buktikan."* | Deteksi "hampir benar" | 2, 6, 8, 14, 15, 18 |
| **TELUSUR** | *"Kenapa hasilnya salah, padahal tidak ada error?"* | Debug tanpa jejak | 4, 9, 10, 11, 12, 13, 16 |

> **Aturan tak boleh dilanggar:** tebakan ditulis di `prediksi.md` **SEBELUM** kode
> dijalankan. Diperiksa lewat timestamp (§7 di `roadmap-4-tingkat.md`).

---

## 5. Jenis TELUSUR — protokol 5 langkah (yang paling penting)

TELUSUR adalah inti skill ini, karena **seluruh cacat Bagian 2 gagal senyap**.

```
KATAKAN → DUGA → UJI → SEMPITKAN → BUKTIKAN
```

| Langkah | Yang dilakukan | Ditulis di mana |
|---|---|---|
| **1. KATAKAN** | Tulis apa yang **kamu lihat**, tanpa menafsirkan. *"Klien mengambil 3 halaman. Item H, I, J tidak muncul."* | `prediksi.md` |
| **2. DUGA** | Tulis **minimal dua** dugaan penyebab — **salah satunya boleh salah** | `prediksi.md` |
| **3. UJI** | Jalankan, tambahkan cetakan (`console.log`) **di titik dugaan** — bukan di mana-mana | `hasil.md` |
| **4. SEMPITKAN** | Buang dugaan yang **tidak** cocok. Sebut **apa yang membuktikannya salah** | `hasil.md` |
| **5. BUKTIKAN** | Tunjukkan **satu baris output** yang menunjuk penyebabnya | `hasil.md` |

**Aturan penting:**

- **Dugaan ditulis SEBELUM menyentuh kode.** Kalau tidak, itu bukan TELUSUR — itu membaca.
- **Langkah 2 wajib ≥ 2 dugaan.** Satu dugaan = menebak; dua dugaan = **menyempitkan**.
  Kalau dugaan pertama langsung benar, langkah 4 jadi kosong — dan kosong berarti
  pembelajar **tidak belajar membedakan**.
- **Langkah 5 wajib satu baris output.** Kalau jawabannya *"sepertinya karena offset"*,
  itu belum lulus. Yang lulus: *"baris `hal 2: B,C,D` membuktikan posisinya bergeser."*

**Korpus untuk TELUSUR:** kode yang **sudah dijalankan**, hasilnya **salah**, tapi
**TIDAK error**. Kalau kodenya error → itu latihan **membaca stack trace**, bukan TELUSUR.
Dua hal berbeda; jangan dicampur.

---

## 6. Hasil verifikasi empiris — pakai ini, jangan hitung ulang

Kelima skenario di bawah **sudah dijalankan** (Node v22.22.2, 29 Sep 2026).
Pakai output ini **verbatim** di sesi. Kalau mau dijalankan ulang untuk pembelajar, jalankan —
tapi hasilnya harus sama.

### 6.1 Unit 4 — `GET` yang mengubah data

```
GET dipanggil 3x untuk pengguna yang sama.
Catatan kunjungan : ["budi","budi","budi"]
Panjang catatan   : 3 (seharusnya 0 — GET tidak boleh mengubah apa pun)
Error yang muncul : TIDAK ADA
```

### 6.2 Unit 10 — Pagination offset

```
hal 1: A,B,C | offset berikutnya = 3
   (2 data baru masuk di depan)
hal 2: B,C,D | offset berikutnya = 6
hal 3: E,F,G

Yang terkumpul klien   : A,B,C,B,C,D,E,F,G
Item asli yang TERLEWAT: H,I,J
Item yang GANDA        : B,C
Error yang muncul      : TIDAK ADA
```

> **Yang paling penting dari output ini:** `H,I,J` hilang **tanpa error**, dan `B,C`
> muncul **dua kali**. Klien **tidak punya cara tahu** ada yang salah.

### 6.3 Unit 11 — `POST` + retry

```
Jumlah pesanan di database : 2
Isi                        : [{"id":1,"item":"Buku Laporan"},{"id":2,"item":"Buku Laporan"}]
Error yang muncul          : TIDAK ADA
→ Klien melihat 1 pesanan. Database berisi 2.
```

### 6.4 Unit 12 — Cache data pribadi

```
Permintaan 1 (umur 0s)   → dari database: {"nilai":70}
   (guru mengubah nilai 70 → 95 di database)
Permintaan 2 (umur 30s)  → dari cache: {"nilai":70}
Nilai sebenarnya di database : 95
Error yang muncul            : TIDAK ADA
→ Siswa melihat nilai LAMA. Tidak ada error, tidak ada peringatan.
```

### 6.5 Unit 13 — `429` tanpa `Retry-After` yang dipatuhi

```
0s: 200
0.1s: 200
0.2s: 200
0.3s: 200
0.4s: 200
0.5s: 429 (Retry-After: 30)
0.6s: 429 (Retry-After: 30)
0.7s: 429 (Retry-After: 30)
Jumlah 429 diterima : 3
Error yang muncul   : TIDAK ADA (hanya 429 berulang)
→ Makin sering mencoba, makin sering ditolak. Kuota tidak pulih.
```

> **Cara memakai:** tunjukkan **hanya outputnya** dulu. Tanya: *"apa yang salah di sini?"*
> Pembelajar harus **menebak sebelum** melihat kodenya.

---

## 7. Korpus mana untuk latihan mana

| Unit | Korpus | Cacat yang ditanam |
|---|---|---|
| 1 | Spesifikasi API | Parameter `?nama=` diubah jadi `?q=` di changelog |
| 2 | Spesifikasi API | 6 endpoint, 4 menamai aksi (`/getUsers`, `/createUser`, …) |
| 3 | Spesifikasi API | Field `nm`, `tgl`, `jml`; tanpa contoh respons |
| 4 | Server + routing | `GET /halaman-profil` mencatat kunjungan ke array |
| 5 | Server + routing | `200` + `{error}`; semua gagal → `500` |
| 6 | Server + routing | `res.send(JSON.stringify(data))` tanpa `Content-Type` |
| 7 | Dua respons | Satu array langsung, satu envelope — **dua-duanya sah** |
| 8 | Server + routing | `?sortBy=` yang didokumentasikan `?orderby=` |
| 9 | Proyek kecil | Semua error → `500` `{"error":"failed"}` |
| 10 | Proyek kecil | `?page=` + `?limit=`, `ORDER BY tanggal DESC` |
| 11 | Proyek kecil | `POST /pesanan` tanpa pemeriksaan kunci |
| 12 | Proyek kecil | `Cache-Control: public, max-age=86400` untuk `/nilai-saya` |
| 13 | Proyek kecil | `429` dikirim, `Retry-After` **tidak** |
| 14 | Spesifikasi API | `/v2/` sementara `/v1/` sudah hilang |
| 15 | Spesifikasi API | Endpoint dihapus tanpa `Sunset` |
| 16 | Spec + kode | Spec tidak memuat 2 endpoint yang ada di kode |
| 17 | 3 skenario | Bukan cacat — **pilihan gaya** |
| 18 | Spesifikasi besar | Gabungan — untuk review akhir |

---

## 8. Kesalahan yang paling sering dilakukan tutor

| ❌ Jangan | ✅ Lakukan |
|---|---|
| Memakai kode contoh yang ditulis sendiri | Pakai kode hasil AI **apa adanya** |
| Meminta AI "buat kode yang ada bugnya" | Minta permintaan **wajar**; cacatnya muncul sendiri |
| Menunjukkan kodenya dulu, lalu outputnya | Tunjukkan **outputnya** dulu |
| Menerima jawaban *"sepertinya karena…"* | Minta **satu baris output** sebagai bukti |
| Menjelaskan penyebabnya saat pembelajar ragu | **Diam**, biarkan ia menyempitkan dugaan |
| Merapikan korpus supaya "lebih mudah dibaca" | Biarkan berantakan — **itu materinya** |
| Memakai kode yang **error** untuk TELUSUR | Kode harus **jalan & tidak error**; itu syaratnya |
| Memilih cacat yang kelihatan sekilas | Cacat harus **tersembunyi**; kalau kentara, ganti |

---

## 9. Batas kejujuran

- **Korpus di §6 dijalankan oleh saya (agent), bukan oleh manusia.** Outputnya nyata
  (Node v22.22.2), tapi **belum ada pembelajar** yang mencoba menebaknya.
- **Tingkat kesulitan tiap korpus belum diukur.** Urutan unit 9–14 disusun berdasarkan
  **jenis cacat** (gagal senyap), bukan berdasarkan hasil uji.
- **Angka riset di §1 belum diverifikasi ulang** untuk konteks API design. Ia dipinjam
  dari skill lain di repo ini, dan ditandai di `RESOURCES.md`.
- **Klaim AI di langkah 5 §2 belum pernah dibandingkan secara sistematis.** Yang ada:
  pengalaman sesi 10 (audit 20 konsep) bahwa **16 dari 23 hitungan awal salah** —
  itu bukti bahwa klaim tanpa pemeriksaan memang berbahaya, tapi bukan pengukuran.

---

**📅 Dibuat:** 29 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` ·
`sintaks-http-api.md` · `cakupan-vs-dokumen-resmi.md`
