# 01 — Mental Model Debugging

> **Level:** Fondasi — baca ini dulu sebelum file lain di folder ini
> **Waktu:** 40 menit
> **Yang Anda dapat:** kerangka berpikir yang membuat semua teknik di file berikutnya masuk akal

---

## 📖 Apa debugging sebenarnya

Kebanyakan orang mengira debugging adalah **kegiatan memperbaiki kode**. Itu keliru.

Debugging adalah **kegiatan mencari selisih antara apa yang Anda pikirkan tentang kode dan apa yang sebenarnya dilakukan kode.**

Perhatikan perbedaannya. Memperbaiki kode itu bagian yang mudah — biasanya cuma beberapa baris. Yang sulit, dan yang memakan 90% waktu, adalah menemukan **di mana** pikiran Anda dan kenyataan berbeda.

### Bug = selisih model mental

Setiap kali Anda menulis kode, Anda punya **model mental** tentang cara kerjanya: "baris ini mengambil data siswa, lalu menyimpannya ke database."

Kode yang sebenarnya berjalan punya **perilaku nyata**.

```
   Model mental Anda              Perilaku nyata kode
   ┌──────────────┐               ┌──────────────┐
   │ Ambil siswa  │               │ Ambil siswa  │
   │ Simpan ke DB │               │ Simpan ke DB │
   └──────────────┘               └──────────────┘
          │                               │
          └───────────┬───────────────────┘
                      │
                 SELISIH DI SINI
                 ─────────────────
                 Inilah bug-nya.

   Kalau tidak ada selisih → tidak ada bug.
   Kalau selisihnya besar → bug-nya jelas, mudah ditemukan.
   Kalau selisihnya kecil → bug-nya halus, paling sulit.
```

**Konsekuensi penting:** kalau model mental Anda kabur, debugging menjadi mustahil. Anda tidak bisa mencari selisih dari sesuatu yang tidak ada.

Itu sebabnya orang yang "tidak paham kodenya" (misalnya kode yang seluruhnya dibuat AI) kesulitan debug — bukan karena kurang pintar, tapi karena **tidak punya model mental untuk dibandingkan**. File `06-debugging-kode-buatan-ai.md` membahas ini secara khusus.

---

## ❌ Cara yang salah: "ubah kode sampai jalan"

Ini yang dilakukan hampir semua pemula. Kelihatannya produktif. Sebenarnya judi.

```
Ubah baris 45 → jalankan → masih error
Ubah baris 52 → jalankan → masih error
Ubah baris 45 lagi, dan 60 → jalankan → JALAN!
"Ah, akhirnya."
```

**Apa yang sebenarnya terjadi:**

1. **Anda tidak tahu mana yang memperbaiki.** Baris 45? 60? Kombinasinya? Kalau salah satu dari perubahan itu sebenarnya tidak perlu, Anda menambah kode mati.
2. **Anda mungkin menambah bug baru.** Perubahan yang membuat error hilang bisa jadi menyembunyikan masalah, bukan menyelesaikannya.
3. **Anda tidak belajar apa-apa.** Model mental Anda masih sama salahnya seperti sebelumnya. Bug serupa akan muncul lagi minggu depan, dan Anda akan mengulang proses yang sama.
4. **Waktunya jauh lebih lama.** Orang yang menebak butuh rata-rata 3× lebih lama daripada orang yang berhipotesis — dan hasilnya kurang dapat diandalkan.

### Kenapa orang tetap melakukannya

Karena menebak **terasa** seperti maju. Ada gerakan, ada aksi. Sedangkan berhenti dan berpikir terasa seperti diam.

Kenyataannya sebaliknya:

> **5 menit berpikir terstruktur menghemat 3 jam perubahan acak.**

---

## ✅ Cara yang benar: hipotesis lalu uji

Ini bentuk dasarnya. Semua teknik di file berikutnya hanyalah variasi dari ini.

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  1. AMATI                                                  │
│     Apa gejalanya? Apa yang seharusnya terjadi?            │
│     (kalau Anda tidak tahu "seharusnya", berhenti di sini) │
│                          ↓                                 │
│  2. HIPOTESIS                                              │
│     "Saya tebak ini terjadi karena ___."                   │
│     Satu hipotesis. Spesifik. Bisa salah.                  │
│                          ↓                                 │
│  3. PREDIKSI                                               │
│     "Kalau hipotesis saya benar, maka ___ harus ___."      │
│     Ini yang membuatnya ilmiah, bukan tebakan.             │
│                          ↓                                 │
│  4. UJI                                                    │
│     Lakukan SATU hal untuk menguji. Amati hasilnya.        │
│                          ↓                                 │
│  5. PUTUSKAN                                               │
│     Hipotesis benar → perbaiki akarnya.                    │
│     Hipotesis salah → itu kemajuan! Anda baru saja         │
│                       mempersempit ruang pencarian.        │
│                                                             │
└─────────────────────────┬──────────────────────────────────┘
                          │ ulangi
```

### Contoh nyata

**Gejala:** form absensi kadang menyimpan siswa ke kelas yang salah.

**❌ Cara menebak:**
> "Mungkin validasi kelasnya salah." → ubah validasi → masih salah.
> "Mungkin query database-nya salah." → ubah query → masih salah.
> "Mungkin frontend yang kirim ID salah." → ubah frontend → masih salah.
> (2 jam kemudian, belum ketemu.)

**✅ Cara berhipotesis:**

```
AMATI
  Gejala: siswa kadang masuk kelas yang salah. "Kadang" = tidak selalu.
  Seharusnya: kelas selalu sesuai pilihan di form.

HIPOTESIS
  Karena kata "kadang", saya tebak ini masalah timing atau data bersama,
  bukan logika. Kandidat: (a) ID kelas dari form tertukar,
  (b) ada variabel yang dipakai bersama antar-request,
  (c) data di database memang sudah salah sebelumnya.

PREDIKSI
  Kalau (b) benar, maka bug ini akan lebih sering muncul saat banyak
  request bersamaan, dan TIDAK muncul saat saya uji satu-satu.
  → ini prediksi yang bisa diuji!

UJI
  Jalankan 20 request absensi bersamaan, lihat berapa yang salah kelas.
  Hasil: 7 dari 20 salah. → pola "banyak request" terkonfirmasi.
  → hipotesis (b) sangat mungkin benar.
```

Perhatikan: pada langkah 4, saya **belum memperbaiki apa pun**. Tapi saya sudah mempersempit dari "entah di mana" menjadi "masalah state bersama antar-request" — dan itu kemajuan besar.

Perhatikan juga: kata **"kadang"** di langkah 1 adalah petunjuk terbesar. Bug yang intermiten hampir selalu soal *timing*, *state bersama*, atau *data tertentu* — bukan soal logika murni. Kalau logikanya salah, bug akan muncul **selalu**, bukan kadang.

---

## Tiga mode gagal pemula

Kenali mana yang sedang Anda alami.

### Mode 1 — Menebak tanpa hipotesis

**Gejala:** Anda mengubah kode secara acak, berharap salah satu berhasil. Tidak bisa menjawab "kenapa saya mengubah baris ini?" selain "coba-coba".

**Kenapa terjadi:** berpikir terasa lebih lambat daripada mengetik.

**Obat:** **aturan satu kalimat.** Sebelum mengubah apa pun, tulis satu kalimat: *"Saya mengubah ini karena saya tebak ___."* Kalau Anda tidak bisa menyelesaikannya, Anda belum siap mengubah.

### Mode 2 — Memperbaiki gejala, bukan akar

**Gejala:** Bug hilang, lalu kembali dalam bentuk lain. Atau: Anda menambahkan `try/except` yang menelan error, atau `if data is None: return` yang menyembunyikan masalah.

**Contoh:**

```python
# Gejala: aplikasi crash saat siswa tidak ditemukan
# ❌ Perbaikan gejala:
try:
    siswa = repo.get_by_id(siswa_id)
except Exception:
    pass   # ← error hilang, tapi sekarang data siswa jadi None
           #   dan crash muncul lagi 20 baris kemudian, lebih sulit dilacak

# ✅ Perbaikan akar:
siswa = repo.get_by_id(siswa_id)
if siswa is None:
    return {"error": f"Siswa {siswa_id} tidak ditemukan"}, 404
```

**Obat:** **tanya "kenapa" sampai 5 kali.**

```
Crash saat siswa tidak ada.
  Kenapa? → karena kode mengakses siswa.nama padahal siswa None.
    Kenapa siswa None? → karena query tidak menemukan record.
      Kenapa query tidak menemukan? → karena ID yang dikirim dari frontend salah.
        Kenapa ID-nya salah? → karena dropdown kelas memakai index array, bukan ID.
          Kenapa? → karena kode aslinya ditulis untuk data statis.

→ AKARNYA: dropdown memakai index, bukan ID. Crash hanyalah gejalanya.
  Memperbaiki crash (try/except) akan menyembunyikan bug yang sebenarnya.
```

**Aturan praktis:** kalau perbaikan Anda membuat error **hilang** tanpa Anda bisa menjelaskan **kenapa error itu muncul**, Anda memperbaiki gejala.

### Mode 3 — Mengubah terlalu banyak sekaligus

**Gejala:** Anda mengubah 3 hal, bug hilang, lalu Anda tidak tahu yang mana yang bekerja. Atau: bug hilang tapi muncul bug baru, dan Anda tidak tahu dari mana.

**Kenapa berbahaya:** kalau bug kembali, Anda tidak tahu perubahan mana yang harus dipertahankan.

**Obat:** **satu perubahan, satu uji.** Setiap perubahan harus menguji tepat satu hipotesis.

```
❌ Ubah validasi + ubah query + ubah frontend → jalankan → jalan?
   → tidak tahu yang mana, dan mungkin 2 dari 3 perubahan itu tidak perlu

✅ Ubah validasi → jalankan → masih error
   ✅ Ubah query → jalankan → jalan!
   → sekarang jelas: query-nya yang salah. Dan Anda bisa mengembalikan
     perubahan validasi (atau memeriksa apakah masih perlu)
```

Kalau Anda **terpaksa** mengubah beberapa hal sekaligus (misalnya karena perubahan saling bergantung), catat ketiganya, dan setelah berhasil **kembalikan satu per satu** untuk memastikan mana yang benar-benar diperlukan.

---

## Prinsip mindset

Empat prinsip ini yang membedakan orang yang cepat pulih dari bug dengan yang tidak.

### 1. Bug adalah informasi, bukan hinaan

Bug berarti sistem sedang memberi tahu Anda tentang selisih antara model dan kenyataan. Itu **umpan balik**, bukan penilaian tentang kemampuan Anda.

Frustrasi itu normal — tapi tidak produktif. Kalau Anda merasa marah, itu tanda Anda perlu berhenti 5 menit. Debugging dengan kepala panas hampir selalu menghasilkan tebakan, bukan hipotesis.

### 2. Pelan dulu, baru cepat

Dorongan untuk langsung "coba-coba" terasa produktif dan hampir selalu membuang waktu. Lima menit menuliskan apa yang Anda ketahui, apa yang Anda tebak, dan apa yang belum Anda periksa, menghemat berjam-jam.

### 3. Satu perubahan, satu uji

Sudah dibahas di Mode 3. Ini prinsip yang paling sering dilanggar dan paling mahal akibatnya.

### 4. Tuliskan

Debugging membebani memori kerja. Anda akan melupakan apa yang sudah Anda coba 20 menit lalu, dan mengulanginya.

**Selalu buka catatan sebelum debug.** Format minimal:

```markdown
## Bug: kelas siswa kadang salah

**Gejala:** dari 20 request bersamaan, 7 masuk kelas yang salah. Satu-satu: benar.
**Seharusnya:** kelas selalu sesuai pilihan form.

**Sudah dicoba:**
- [x] Ubah validasi kelas → tidak berubah. Bukan di situ.
- [x] Cek data di database → data yang salah memang tersimpan. Jadi bug di saat SIMPAN, bukan saat baca.
- [ ] Cek apakah ada state bersama antar-request

**Hipotesis saat ini:** ada variabel yang dipakai bersama antar-request.
**Prediksi:** kalau benar, bug makin sering saat request makin banyak. ✅ terkonfirmasi (7/20)
**Berikutnya:** cari variabel yang tidak di-scope dengan benar.
```

Catatan ini bukan formalitas. Ia **menggandakan kecepatan** Anda, karena Anda berhenti memakai 30% otak untuk mengingat apa yang sudah dicoba.

---

## Aturan 30 menit

Kalau Anda sudah 30 menit dan **tidak ada kemajuan** (belum mempersempit ruang pencarian sama sekali), berhenti. Lakukan ini:

```
1. Tulis ulang masalahnya dalam SATU kalimat.
   Kalau tidak bisa → masalahnya belum jelas. Itu penyebabnya.

2. Tulis apa yang Anda KETAHUI pasti (bukan tebak).
   Biasanya lebih sedikit dari yang Anda kira. Area itu yang perlu diperiksa.

3. Tulis hipotesis yang sudah DIELIMINASI.
   Ini kemajuan nyata, meskipun terasa seperti tidak ada.

4. Baru minta bantuan — dan minta dengan bentuk yang benar:
   "Saya macet di [masalah]. Yang sudah saya eliminasi: [daftar].
    Hipotesis saya: [hipotesis]. Jangan beri jawaban; beri saya satu
    eksperimen berikutnya yang paling mempersempit pencarian."
```

**Kenapa 30 menit, bukan 2 jam:** setelah 30 menit tanpa kemajuan, Anda berhenti berpikir dan mulai menebak. Menebak selama 2 jam tidak lebih baik daripada menebak selama 5 menit — hanya lebih melelahkan.

---

## Bagaimana tahu Anda sudah memperbaiki akarnya

Uji lima pertanyaan. Kalau ada yang gagal, Anda belum selesai.

| Pertanyaan | Kalau jawabannya tidak |
|---|---|
| **1.** Apakah saya bisa menjelaskan **kenapa** bug ini terjadi, dalam kalimat sederhana? | Anda memperbaiki gejala |
| **2.** Apakah saya bisa menjelaskan **kenapa** perbaikan ini mengatasinya? | Anda menebak, dan kebetulan berhasil |
| **3.** Apakah saya bisa membuat bug ini **muncul kembali dengan sengaja**? | Anda tidak benar-benar memahaminya |
| **4.** Apakah saya sudah menambahkan **test** yang gagal sebelum perbaikan dan lulus sesudahnya? | Bug akan kembali |
| **5.** Kalau saya **mengembalikan** satu baris dari perbaikan saya, apakah bug muncul lagi? | Perbaikan Anda mungkin tidak berhubungan dengan bug-nya |

**Pertanyaan 3 adalah yang paling berharga.** Kalau Anda bisa memunculkan bug itu sesuka hati, Anda benar-benar paham. Kalau tidak, Anda hanya tahu bahwa ia "sudah tidak muncul" — dan itu berbeda.

**Pertanyaan 5** adalah tes yang paling sering dilewatkan. Kalau Anda mengembalikan satu baris dan bug **tidak** muncul, maka baris itu tidak diperlukan — dan perbaikan Anda mengandung sesuatu yang tidak Anda pahami.

---

## Kapan debugging selesai

Debugging selesai ketika **semua** ini terpenuhi:

- [ ] Bug tidak lagi muncul pada kasus yang dilaporkan
- [ ] Bug tidak muncul pada kasus **di sekitarnya** (edge case: kosong, null, sangat besar, sangat banyak)
- [ ] Anda bisa menjelaskan akarnya, bukan hanya perbaikannya
- [ ] Ada test baru yang mengunci perbaikan ini
- [ ] Test lain masih lulus (perbaikan Anda tidak merusak yang lain)
- [ ] Anda mencatatnya: gejala → akar → perbaikan

Yang terakhir itu paling sering dilewatkan dan paling berguna jangka panjang. Setelah 20 catatan, Anda akan mulai **mengenali pola** — dan debugging berubah dari investigasi menjadi pengenalan.

---

## Ringkasan

| Yang salah | Yang benar |
|---|---|
| Debugging = memperbaiki kode | Debugging = mencari selisih model vs kenyataan |
| Ubah kode sampai jalan | Hipotesis → prediksi → uji → putuskan |
| Perbaiki gejala | Tanya "kenapa" 5 kali |
| Ubah 3 hal sekaligus | Satu perubahan, satu uji |
| Andalkan ingatan | Tulis catatan |
| Debug 2 jam tanpa maju | Berhenti di 30 menit, tulis ulang masalahnya |
| "Sudah tidak muncul" | "Saya bisa memunculkannya lagi kalau mau" |

---

> **Lanjut ke:** [`02-membaca-error-dan-stack-trace.md`](./02-membaca-error-dan-stack-trace.md) — sumber informasi pertama Anda.
