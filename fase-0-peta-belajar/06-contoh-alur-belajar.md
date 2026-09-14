# 06 — Contoh Alur Belajar

> **Fungsi:** contoh konkret. Bukan teori lagi — ini langkah-langkah yang bisa Anda ikuti hari ini.
>
> **Waktu baca:** 25 menit

---

## Alur intinya cuma 4 langkah

Semua contoh di file ini adalah variasi dari satu putaran:

```
1. PREDIKSI    → tulis tebakan Anda sebelum menjalankan apa pun
2. JALANKAN    → jalankan, lihat hasil sebenarnya
3. BANDINGKAN  → di mana tebakan Anda meleset? itu pelajarannya
4. CATAT       → satu baris. apa yang dipahami, apa yang masih bingung
```

Lalu kembali ke langkah 1 untuk materi berikutnya.

**Kalau Anda lupa semua isi folder ini, ingat 4 langkah ini saja.** Sisanya cuma cara menerapkannya dalam berbagai situasi.

**Aturan tunggal:** kalau dalam satu sesi Anda **tidak pernah salah**, Anda tidak sedang belajar — Anda sedang mengulang yang sudah dikuasai. Naikkan kesulitannya.

---

## Contoh 1 — Satu sesi 60 menit (menit per menit)

Ini yang paling konkret. Ikuti persis, ganti materinya saja.

**Sasaran sesi:** memahami off-by-one (materi: `debugging/05-pola-bug-umum.md`, pola 1)
**Waktu:** 60 menit
**Yang Anda butuhkan:** laptop, editor, kertas

---

### Menit 0–5 · Siapkan

Buka dua hal:

```
1. File: fase-0-peta-belajar/debugging/05-pola-bug-umum.md
2. File baru: latihan.py (kosong)
```

Buka log belajar Anda (`log-belajar.md`). Kalau belum ada, buat sekarang:

```markdown
# Log Belajar

| Tanggal | File | Yang dipelajari | Durasi | Masih bingung |
|---|---|---|---|---|
```

**Jangan buka file lain.** Satu sesi = satu materi. Kalau Anda buka 3 tab materi, Anda akan menghabiskan 60 menit untuk berpindah-pindah dan tidak menyelesaikan apa pun.

---

### Menit 5–12 · Baca HANYA bagian "Gejala"

Ini bagian terpenting dari alur ini.

Buka `debugging/05`, cari **pola 1 (Off-by-one)**. Baca **hanya**:

- Baris judul
- Baris "Gejala"
- Baris "Cara mengenali"

**JANGAN baca bagian "Perbaikan" dulu.** Tutup kalau perlu.

Yang Anda dapat setelah 7 menit:

```
Gejala:          elemen pertama/terakhir hilang, atau IndexError
Cara mengenali:  ada len() dipakai sebagai index
```

Itu saja. Sekarang berhenti membaca.

**Kenapa:** kalau Anda membaca perbaikannya sekarang, Anda akan merasa paham — dan rasa paham itu palsu. Anda baru tahu **apa** jawabannya, bukan **kenapa**.

---

### Menit 12–17 · PREDIKSI (langkah 1)

Ini bagian yang membedakan belajar dari membaca. Tulis di kertas, **bukan di kepala**.

Tulis tiga hal:

```markdown
## Prediksi saya

Saya akan menulis kode yang salah dengan cara ini:

    data = [10, 20, 30]
    return data[len(data)]     # saya tebak ini error

Hasil yang saya tebak:
  → IndexError, karena index 3 tidak ada (valid: 0,1,2)

Dan saya tebak yang ini TIDAK error tapi salah:

    for i in range(len(data) - 1):
        proses(data[i])
  → elemen terakhir tidak diproses
```

**Tulis tebakan yang spesifik.** Bukan "kayaknya error". Tulis: error apa, di baris mana, pesan apa.

---

### Menit 17–32 · JALANKAN (langkah 2)

Sekarang buktikan tebakan Anda. Tulis kode di `latihan.py`:

```python
# Percobaan 1: index melebihi batas
data = [10, 20, 30]
print("panjang:", len(data))
print("data[len(data)]:", data[len(data)])
```

Jalankan:

```bash
python latihan.py
```

Lihat hasilnya. **Jangan buru-buru memperbaiki.** Baca pesan errornya sampai habis.

Lalu percobaan kedua:

```python
# Percobaan 2: loop yang melewatkan elemen terakhir
data = [3, 5, 9]

def cari_tertinggi(nilai):
    tertinggi = nilai[0]
    for i in range(len(nilai) - 1):
        if nilai[i] > tertinggi:
            tertinggi = nilai[i]
    return tertinggi

print("tertinggi:", cari_tertinggi(data))
print("max sebenarnya:", max(data))
```

Jalankan lagi.

**Sekarang Anda punya dua hasil nyata di layar.** Itu jauh lebih berharga daripada dua paragraf penjelasan.

---

### Menit 32–42 · BANDINGKAN (langkah 3)

Tulis perbandingannya. Ini inti sesinya.

```markdown
## Perbandingan

Percobaan 1:
  Tebakan saya: IndexError
  Kenyataan:    IndexError ✅ tebakan tepat
  → saya sudah paham bagian ini

Percobaan 2:
  Tebakan saya: 9 (kalau saya tidak hati-hati)
  Kenyataan:    5, sedangkan max = 9
  → MELESET. Dan ini yang menarik:
    tidak ada error sama sekali. Kode "jalan normal"
    dan mengembalikan angka yang salah.

## Yang baru saya sadari
Off-by-one punya DUA bentuk:
  1. Yang berisik  → IndexError. Mudah ditemukan.
  2. Yang senyap   → hasil salah, tanpa error. BERBAHAYA.

Bentuk kedua hanya ketahuan kalau saya menguji dengan data
yang jawabannya sudah saya tahu di kepala.
```

Perhatikan: **penemuan itu muncul dari perbandingan, bukan dari bacaan.** Kalau Anda langsung baca bagian "Perbaikan" di menit ke-12, Anda akan tahu jawabannya tapi tidak akan menemukan pelajaran tentang "dua bentuk off-by-one".

---

### Menit 42–52 · Uji pemahaman dengan AI

Sekarang **baru** boleh pakai AI — dan dengan cara yang benar.

Tempel prompt ini:

```
Saya baru belajar off-by-one. Saya akan menjelaskan pemahaman saya,
lalu tolong temukan di mana penjelasan saya SALAH atau kabur.

Penjelasan saya:
"Off-by-one terjadi ketika batas loop atau index salah satu.
 Ada dua bentuk: yang memunculkan IndexError, dan yang senyap
 (hasil salah tanpa error). Yang senyap lebih berbahaya karena
 tidak ada yang memberi tahu kita."

Tolong:
1. Sebutkan bagian yang kabur atau salah dari penjelasan saya
2. Beri saya satu kasus yang TIDAK bisa dijelaskan oleh pemahaman saya
3. Jangan puji. Jangan ringkas ulang. Langsung ke kelemahannya.
```

AI akan memberi Anda kasus yang tidak Anda pikirkan — misalnya off-by-one pada `<=` vs `<`, atau pada slice (`data[1:3]` vs `data[1:4]`).

**Sekarang Anda punya lubang baru untuk dipelajari.** Itu hasil sesi yang bagus.

---

### Menit 52–60 · CATAT (langkah 4)

Tulis satu baris di log:

```markdown
| 2026-09-14 | debugging/05 pola 1 | off-by-one punya bentuk senyap | 60mnt | slice: data[1:3] vs data[1:4] belum jelas |
```

**Kolom terakhir wajib diisi.** Itu bahan sesi berikutnya.

Tutup laptop. Selesai.

---

### Ringkasan sesi tadi

| Menit | Yang dilakukan | Kenapa |
|---|---|---|
| 0–5 | Siapkan, buka 1 materi saja | Fokus |
| 5–12 | Baca gejala saja | Jangan curi jawabannya |
| 12–17 | Tulis prediksi spesifik | Menciptakan ketidakcocokan yang harus dijelaskan |
| 17–32 | Jalankan, lihat hasil nyata | Hasil eksekusi tidak bisa menipu |
| 32–42 | Bandingkan tebakan vs kenyataan | **Di sini pelajarannya** |
| 42–52 | Uji pemahaman ke AI | Menemukan lubang yang tidak Anda sadari |
| 52–60 | Catat satu baris | Membuat kemajuan terlihat |

**Kalau Anda hanya bisa melakukan satu hal dari tabel ini: lakukan menit 12–17 dan 32–42.** Itu inti dari segalanya.

---

## Contoh 2 — Satu minggu (7 hari, 1 jam/hari)

Sesi di atas adalah satu hari. Ini contoh satu minggu penuh — minggu pertama **Jalur B** dari `02-diagnostik-dan-jalur.md`.

| Hari | Materi | Yang dilakukan | Hasil yang diharapkan |
|---|---|---|---|
| **1** | `03-cara-belajar-fondasi.md` | Baca, lalu **uji sendiri**: tulis 1 kalimat penjelasan loop Prediksi→Jalankan→Bandingkan | Tahu **cara** belajar, bukan hanya apa |
| **2** | `debugging/01-mental-model` | Baca, lalu ambil 1 bug yang pernah Anda alami. Tulis: apa model mental Anda saat itu, apa kenyataannya | Sadar bahwa bug = selisih model |
| **3** | `debugging/02-membaca-error` | Baca. Lalu buka 3 pesan error lama Anda (dari log/chat). Baca ulang dengan 4 komponen | Bisa mengambil 80% info dari error |
| **4** | `debugging/03-metode-ilmiah` | Baca REDUCE. Lalu jalankan 1 bug di kode Anda sendiri pakai 6 langkahnya | Punya prosedur yang bisa diulang |
| **5** | `debugging/04-taktik` | Baca. Lalu pasang **log terstruktur** di 1 fungsi proyek Anda | Punya alat, bukan hanya teori |
| **6** | `debugging/07-latihan` no. 1–4 | Kerjakan 4 latihan pertama. **Tulis hipotesis sebelum menjalankan** | Pengalaman pertama loop lengkap |
| **7** | Kosong / ulangi | Baca ulang log minggu ini. Materi mana yang masih "bingung"? | Tahu prioritas minggu depan |

**Perhatikan pola harinya:** setiap hari = **baca sedikit + lakukan sesuatu**. Tidak ada hari yang hanya membaca.

**Hari ke-7 sengaja kosong.** Kalau Anda mengisi 7 hari penuh, Anda akan tertinggal di minggu ke-3 dan berhenti.

### Hasil akhir minggu 1

Kalau alurnya jalan, di akhir minggu Anda punya:

```
✅ 1 log belajar berisi 6 baris
✅ 1 bug nyata yang Anda selesaikan dengan prosedur (bukan menebak)
✅ 1 fungsi proyek Anda yang punya log terstruktur
✅ 1 daftar "masih bingung" yang berisi 2–4 topik
```

Daftar "masih bingung" itu **kurikulum minggu depan Anda**. Bukan silabus orang lain — daftar yang dibentuk oleh kesulitan nyata Anda sendiri.

---

## Contoh 3 — Tiga orang, tiga alur

Alur yang sama, diterapkan berbeda. Pilih yang paling mirip dengan Anda.

---

### 🅰️ "Saya belum bisa coding, tapi ingin bikin aplikasi absensi sekolah"

**Titik mulai:** Jalur A (`02-diagnostik`, skor 0–6)
**Asumsi:** 1 jam/hari, 5 hari/minggu

**Bulan 1 — belajar membaca kode, bukan menulis**

```
Minggu 1  →  fase-0/03 (cara belajar)
             fase-0/debugging/01, 02
             Kerjakan latihan 1, 2, 5 dari debugging/07
             (sengaja yang mudah — tujuannya membangun rasa percaya)

Minggu 2  →  learning-python/SKILL.md (atau learning-javascript)
             Pilih SATU. Jangan dua-duanya.
             Target: bisa menulis fungsi, list, dict, if, for

Minggu 3  →  debugging/03, 04
             Kerjakan latihan 3, 4, 6, 7 dari debugging/07

Minggu 4  →  debugging/05, 07 (latihan 8–11)
             Tulis log belajar setiap sesi
```

**Bulan 2 — mulai pakai AI untuk membangun**

```
Minggu 5  →  architecture-planner/MATERI-PECAHAN 01, 02, 03
             (kenapa vibe coding gagal — penting sebelum mulai)

Minggu 6  →  fase-2-ai-tools-dasar 01, 02, 03 (setup + CLAUDE.md)

Minggu 7  →  fase-0/arsitektur/01, 02
             fase-1-arsitektur-dasar 01, 02, 04

Minggu 8  →  fase-0/arsitektur/03 (metode 8 langkah)
             Rancang aplikasi absensi Anda DI KERTAS dulu
             Belum menulis kode
```

**Bulan 3 — bangun, dengan debugging sebagai pendamping**

```
Minggu 9–12 →  Bangun versi paling sederhana (target: 1 fitur)
               Setiap kali error → debugging/01–04
               Setiap kali kode AI aneh → debugging/06
```

**Yang sengaja dilewati:** fase 4, fase 6, `book-resource/`, `easy-vibe-materi/`.
**Yang paling menentukan di jalur ini:** `debugging/06` — karena Anda akan banyak menerima kode yang tidak Anda tulis, dan kemampuan memverifikasinya adalah yang menjaga proyek Anda tetap benar.

---

### 🅱️ "Saya bisa coding, tapi selalu menebak-nebak saat error"

**Titik mulai:** Jalur B (`02-diagnostik`, skor 7–13) — **paling umum**
**Asumsi:** 1 jam/hari, 5 hari/minggu

**Bulan 1 — pasang proses**

```
Minggu 1  →  fase-0/debugging/01 → 03 (berurutan, jangan dilompati)
Minggu 2  →  fase-0/debugging/04, 05
             Kerjakan latihan 1–8 dari debugging/07
Minggu 3  →  fase-0/debugging/06 (kode buatan AI)
             Kerjakan latihan 9–12
Minggu 4  →  architecture-planner/MATERI-PECAHAN 01 → 08
             (ini yang mengubah "saya pakai AI" → "saya mengarahkan AI")
```

**Bulan 2 — bangun sistem kerja**

```
Minggu 5–6  →  fase-2-ai-tools-dasar (11 file, lengkap)
Minggu 7–8  →  fase-0/arsitektur/01 → 03
               Tulis ADR untuk 1 keputusan nyata di proyek Anda
```

**Bulan 3 — perdalam**

```
Minggu 9–12 →  fase-1-arsitektur-dasar (22 file, berurutan)
```

**Kebiasaan yang harus dipasang:** setiap kali menghadapi bug, **tulis hipotesis dulu sebelum mengubah kode apa pun.** Satu baris. Kalau tidak bisa menuliskan hipotesisnya, berarti Anda belum paham masalahnya — dan mengubah kode saat itu adalah judi.

**Ukuran keberhasilan:** di akhir bulan 1, Anda bisa menyelesaikan bug yang belum pernah Anda temui **tanpa menebak**, dan bisa menjelaskan **kenapa** perbaikannya benar (bukan cuma "sudah jalan").

---

### 🅲 "Saya developer 3 tahun, mau naik ke level arsitek"

**Titik mulai:** Jalur C (`02-diagnostik`, skor 14–19)
**Asumsi:** 1 jam/hari, 5 hari/minggu

**Bulan 1 — celah keputusan**

```
Minggu 1  →  fase-0/arsitektur/01, 02
             Fokus di 02 (trade-off & ADR) — ini celah utama
Minggu 2  →  fase-0/arsitektur/03, 04
             Kerjakan latihan 3 (absensi sekolah) — perhatikan
             jebakan "data historis"
Minggu 3  →  fase-0/debugging/03, 05, 06, 08
             (lewati 01, 02 kalau sudah kuat. 06 dan 08 wajib.)
Minggu 4  →  Tulis ADR untuk 1 keputusan nyata di proyek kerja Anda
             Syarat: sebutkan minimal 2 alternatif yang Anda tolak
```

**Bulan 2 — skala & kegagalan**

```
Minggu 5–8  →  fase-4-deep-system-design (12 file, berurutan)
```

**Bulan 3 — operasional**

```
Minggu 9–12 →  vibecoding/09, 10, 11, 12, 13, 14
               (dokumentasi arsitektur, infrastruktur, runbook,
                respons insiden, change log, prosedur pemulihan)
```

**Pertanyaan yang harus Anda kuasai:** bukan "bagaimana sistem ini bekerja", tapi **"bagaimana sistem ini gagal, dan apa yang terjadi setelahnya"**. Untuk setiap komponen: apa yang terjadi kalau **mati**? **lambat**? **mengembalikan data salah**?

**Ukuran keberhasilan:** ada dokumen tertulis (ADR) yang menjelaskan keputusan arsitektur proyek Anda, dan Anda bisa mempertahankannya saat ditantang.

---

## Contoh 4 — Versi 30 menit (kalau waktu mepet)

Jangan lewati hari. Perkecil sesinya.

```
0–3   Baca HANYA bagian "Gejala" dari satu pola/materi
3–8   Tulis prediksi Anda (spesifik: hasil apa, error apa)
8–20  Jalankan. Lihat hasil nyata.
20–26 Bandingkan. Tulis di mana tebakan meleset.
26–30 Catat satu baris di log
```

Yang dipotong: langkah "uji ke AI". Itu boleh dipotong. **Menit 3–8 dan 20–26 tidak boleh dipotong** — itu inti dari segalanya.

---

## Contoh 5 — "Saya sedang macet error SEKARANG" (5 menit)

Kalau Anda datang ke folder ini karena sedang panik, jangan baca berurutan. Lakukan ini:

```
Menit 0–1
  Tulis masalahnya dalam SATU kalimat.
  Kalau tidak bisa → itu penyebabnya. Masalahnya belum jelas.

Menit 1–2
  Tulis apa yang Anda KETAHUI PASTI (bukan tebak).
  Biasanya lebih sedikit dari yang Anda kira.

Menit 2–3
  Tulis hipotesis Anda: "saya tebak ini terjadi karena ___."
  Tulis prediksi: "kalau benar, maka ___ harus ___."

Menit 3–5
  Buka fase-0/debugging/03 → bagian "REDUCE Framework".
  Ikuti langkah R (Reproduce) dan D (Divide).
```

**Lalu berhenti menebak.** Kalau setelah 30 menit tidak ada kemajuan, buka `debugging/01` bagian **"Aturan 30 menit"**.

---

## Prompt siap tempel

Empat prompt ini yang akan paling sering Anda pakai. Simpan di suatu tempat.

### 1. Saat macet, tapi tidak mau jawaban langsung

```
Saya macet di [masalah]. Yang sudah saya coba: [daftar].
Hipotesis saya: [hipotesis].

Jangan beri jawaban. Beri saya SATU eksperimen berikutnya yang paling
banyak mempersempit pencarian, dan sebutkan hasil seperti apa yang akan
membuat hipotesis saya SALAH.
```

### 2. Saat AI memberi kode yang tidak Anda pahami

```
Jelaskan kode ini baris per baris, jangan ringkas.
Untuk setiap baris yang "aneh" (yang tidak akan saya tulis sendiri):
- kenapa harus begitu
- apa yang rusak kalau dihilangkan
Lalu beri saya satu input di mana kode ini gagal.
```

### 3. Saat Anda pikir sudah paham (uji diri)

```
Saya pikir saya paham [konsep]. Saya akan menjelaskannya:
[penjelasan Anda]

Temukan di mana penjelasan saya SALAH atau kabur. Jangan pujian.
Sebutkan satu kasus yang tidak bisa dijelaskan oleh pemahaman saya saat ini.
```

### 4. Saat mau latihan, bukan materi

```
Beri saya 3 potongan kode Python yang mengandung bug, dari yang paling
mudah ke paling sulit. Jangan beri tahu bug-nya. Untuk setiap potongan,
sebutkan HANYA gejala yang akan saya lihat (pesan error atau output salah),
tapi bukan penyebabnya.
```

**Prompt 3 dan 4 yang paling jarang dipakai dan paling berdampak.** Kebanyakan orang memakai AI untuk mendapat jawaban; cara terbaik memakai AI untuk belajar adalah memintanya **mencari kelemahan Anda**.

---

## Tanda alur Anda sudah jalan

Periksa ini setiap akhir minggu.

```
[ ] Saya punya log belajar dengan minimal 5 baris minggu ini
[ ] Setiap sesi, saya MENULIS sesuatu sebelum menjalankan kode
[ ] Setiap sesi, saya MENEMUKAN sesuatu yang tidak saya duga
[ ] Kolom "masih bingung" saya terisi (bukan kosong)
[ ] Saya bisa menyebutkan satu hal yang saya pahami lebih baik minggu ini
[ ] Saya tidak membuka lebih dari satu materi dalam satu sesi
[ ] Saya belum mengubah bahasa/framework minggu ini (kecuali memang jalurnya)
```

**Kalau "menemukan sesuatu yang tidak saya duga" tidak tercentang:** materi Anda terlalu mudah, atau Anda membaca tanpa memprediksi. Naikkan kesulitannya, atau kembali ke langkah PREDIKSI.

**Kalau kolom "masih bingung" kosong:** Anda tidak jujur pada diri sendiri, atau Anda hanya membaca tanpa mencoba. Keduanya menghambat.

---

## Tiga kesalahan yang paling sering terjadi

| Kesalahan | Kenapa merugikan | Perbaikan |
|---|---|---|
| Membaca dulu, mencoba nanti | Rasa paham yang palsu — Anda tahu **apa**, bukan **kenapa** | Baca gejala saja, lalu coba, baru baca perbaikannya |
| Tidak menulis apa pun sebelum menjalankan | Tidak ada ketidakcocokan → tidak ada yang menempel | Tulis prediksi spesifik. Kertas, bukan kepala. |
| Mengerjakan 5 materi sekaligus | Tidak ada yang selesai, dan tidak ada yang menempel | Satu sesi = satu materi |

---

## Ringkasan

```
Setiap sesi, tanpa kecuali:

  1. Buka SATU materi
  2. Baca gejala / pertanyaannya saja
  3. TULIS prediksi spesifik Anda
  4. Jalankan / kerjakan
  5. BANDINGKAN — di mana meleset?   ← pelajarannya di sini
  6. Uji pemahaman ke AI (minta cari kelemahan)
  7. CATAT satu baris
  8. Tutup. Besok materi berikutnya.

Kalau tidak ada momen Anda salah hari ini,
materinya terlalu mudah.
```

---

> **Kembali ke:** [`00-MULAI-DARI-SINI.md`](./00-MULAI-DARI-SINI.md)
> **Alur per orang:** [`02-diagnostik-dan-jalur.md`](./02-diagnostik-dan-jalur.md)
> **Kenapa alurnya begitu:** [`03-cara-belajar-fondasi.md`](./03-cara-belajar-fondasi.md)
