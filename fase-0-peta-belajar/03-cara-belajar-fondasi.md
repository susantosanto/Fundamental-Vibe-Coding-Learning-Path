# 03 — Cara Belajar Fondasi

> **Fungsi:** menentukan **cara** Anda belajar. Isi materi ada di folder lain; file ini soal metodenya.
>
> **Waktu:** 20 menit baca, lalu dirujuk terus.

---

## Masalah yang file ini pecahkan

Anda punya 244 file materi. Kalau Anda membacanya berurutan seperti novel, Anda akan selesai dalam beberapa bulan dan **tidak bisa apa-apa**.

Ini bukan dugaan. Ini pola yang paling sering terjadi pada orang yang belajar pemrograman mandiri, dan penyebabnya bukan kurang materi — penyebabnya adalah **membaca dianggap sebagai belajar**.

Membaca tentang debugging tidak membuat Anda bisa debug. Sama seperti membaca tentang berenang tidak membuat Anda bisa berenang. Membaca berguna **hanya kalau** ia mendahului percobaan, bukan menggantikannya.

**Aturan tunggal file ini:**

> **Setiap konsep yang Anda baca harus diikuti satu percobaan di mana Anda bisa salah.**
>
> Kalau Anda tidak bisa salah, Anda tidak sedang belajar.

---

## 1. Loop inti: Prediksi → Jalankan → Bandingkan

Ini satu-satunya teknik yang benar-benar menaikkan kemampuan. Semua teknik lain di file ini adalah variasi darinya.

```
   ┌──────────────────────────────────────────────────────┐
   │                                                      │
   │   1. PREDIKSI                                        │
   │      Sebelum menjalankan kode / membaca jawaban,     │
   │      tulis apa yang Anda tebak akan terjadi.         │
   │      Spesifik. Bukan "kayaknya jalan".               │
   │                     ↓                                │
   │   2. JALANKAN                                        │
   │      Jalankan. Baca pesan errornya sampai habis.     │
   │      Jangan buru-buru memperbaiki.                   │
   │                     ↓                                │
   │   3. BANDINGKAN                                      │
   │      Di mana tebakan Anda meleset? Itu pelajarannya. │
   │      Kalau tebakan Anda tepat: naikkan kesulitannya. │
   │                                                      │
   └──────────────────────┬───────────────────────────────┘
                          │
                    ulangi, lebih sulit
```

### Kenapa ini bekerja

Otak menyimpan informasi sebagai **koreksi terhadap kesalahan**, bukan sebagai penambahan pasif. Saat Anda menebak lalu salah, ada ketidakcocokan yang harus dijelaskan — dan penjelasan itu yang menempel. Membaca tanpa menebak tidak menghasilkan ketidakcocokan, jadi tidak ada yang menempel.

### Contoh nyata

Anda membaca tentang **mutable default argument** di Python:

```python
def tambah_siswa(nama, siswa_list=[]):
    siswa_list.append(nama)
    return siswa_list
```

**❌ Cara belajar pasif:** Anda membaca "default argument yang mutable itu bahaya, karena dibuat sekali dan dipakai bersama". Anda mengangguk, lanjut ke materi berikutnya. Tiga minggu kemudian Anda menulis bug ini di proyek nyata.

**✅ Cara belajar aktif:**

1. **Prediksi.** Tulis di kertas, sebelum menjalankan:
   ```
   tambah_siswa("Ani")   → saya tebak: ["Ani"]
   tambah_siswa("Budi")  → saya tebak: ["Budi"]
   tambah_siswa("Cici")  → saya tebak: ["Cici"]
   ```
2. **Jalankan.**
   ```
   tambah_siswa("Ani")   → ['Ani']
   tambah_siswa("Budi")  → ['Ani', 'Budi']      ← meleset!
   tambah_siswa("Cici")  → ['Ani', 'Budi', 'Cici']  ← meleset!
   ```
3. **Bandingkan.** Tebakan Anda salah di dua baris. Sekarang Anda punya pertanyaan yang benar: *kenapa list-nya tidak dibuat ulang?* Jawabannya akan Anda ingat seumur hidup, karena Anda sudah merasakan salahnya.

Bedanya bukan "Anda jadi tahu" — bedanya **Anda tidak akan lupa**.

### Variasi: prediksi kode yang belum Anda tulis

Saat AI menghasilkan kode untuk Anda, **jangan langsung jalankan**. Berhenti dan tebak:

- Apa outputnya untuk input normal?
- Bagian mana yang paling mungkin salah?
- Apa yang terjadi kalau input-nya kosong / null / sangat besar?

Baru jalankan. Ini mengubah setiap interaksi dengan AI menjadi sesi latihan, bukan sekadar penyerahan pekerjaan.

---

## 2. Tiga mode gagal (dan obatnya)

Kenali mana yang sedang Anda alami.

### Mode 1 — Tutorial hell

**Gejala:** Anda menonton/membaca tutorial tanpa henti, selalu merasa "belum siap" untuk proyek nyata, dan setiap proyek baru selalu dimulai dari tutorial baru.

**Penyebab:** tutorial memberi rasa maju tanpa risiko gagal. Rasa maju itu palsu.

**Obat:** **tutup tutorialnya, lalu bangun versi Anda sendiri dari nol** — tanpa melihat. Kalau macet, buka lagi **hanya bagian yang macet itu**, tutup lagi. Ulangi. Anda akan macet 5 kali dalam 30 menit pertama. Itu tandanya belajar sedang terjadi.

**Latihan konkret:** setelah menyelesaikan satu file materi, tutup filenya dan tulis ulang contoh di dalamnya **dari ingatan**, dengan nama variabel dan data yang berbeda. Perbedaan antara hasil Anda dan aslinya adalah peta celah Anda.

---

### Mode 2 — Copy-paste tanpa pemahaman

**Gejala:** kode jalan, tapi kalau ada yang bertanya "kenapa baris ini ada?", Anda tidak bisa menjawab.

**Penyebab:** AI (dan Stack Overflow) membuat kode yang benar terasa murah. Tidak ada biaya untuk mendapatkan jawaban, jadi tidak ada usaha untuk memahami.

**Obat:** **aturan satu kalimat.** Setiap kali Anda menempelkan kode yang tidak Anda tulis, tulis satu kalimat di atasnya:

```python
# [Kenapa] Filter ini pakai `.first()` bukan `.one()` karena siswa mungkin
# tidak ada, dan kita ingin mengembalikan 404, bukan crash 500.
siswa = self.session.query(Siswa).filter_by(id=siswa_id).first()
```

Kalau Anda tidak bisa menulis kalimat itu, **Anda belum boleh menempelkan kodenya**. Tanya AI: *"jelaskan baris ini dalam satu kalimat, dan sebutkan satu alternatif yang saya tolak"* — lalu tulis sendiri kalimatnya.

---

### Mode 3 — Kolektor materi

**Gejala:** Anda menyimpan bookmark, mengunduh PDF, meng-clone repo — dan tidak pernah membukanya. Jumlah materi yang dikumpulkan naik; kemampuan tidak.

**Penyebab:** mengumpulkan memberi rasa aman yang sama dengan belajar, tapi tanpa biaya kognitif.

**Obat:** **satu materi, sampai selesai, baru tambah.** Untuk repo ini secara spesifik: **jangan membaca `01-peta-materi-lengkap.md` dan langsung mengumpulkan 20 file**. Pilih jalur dari `02-diagnostik-dan-jalur.md`, lalu **abaikan 200 file sisanya** sampai jalur itu selesai.

**Aturan praktis:** kalau Anda punya lebih dari 3 materi "sedang berjalan", Anda sedang tidak mengerjakan apa pun.

---

## 3. Cara memakai AI sebagai tutor, bukan mesin jawaban

Anda punya AI agent di repo ini. Ini aset besar — **kalau dipakai dengan benar**. Dipakai dengan salah, ia justru memperlambat Anda bertahun-tahun, karena ia menghilangkan tepatnya bagian yang membuat Anda belajar: kesulitan.

### Pola yang salah

> **"Ini error saya. Betulkan."**

Anda dapat kode yang jalan. Anda belajar **nol**. Dan bug yang sama akan kembali minggu depan dalam bentuk yang tidak Anda kenali, karena Anda tidak pernah memahami akar masalahnya.

### Pola yang benar

> **"Ini error saya dan yang sudah saya coba: [daftar eksperimen].**
> **Hipotesis saya: [hipotesis].**
> **Jangan beri saya jawabannya. Beri tahu saya SATU eksperimen berikutnya yang paling**
> **banyak mempersempit pencarian, dan apa yang harus saya perhatikan dari hasilnya."**

Perhatikan apa yang berubah: AI berhenti menjadi tukang, mulai menjadi instruktur.

### Empat template prompt untuk belajar

**A. Saat macet dan tidak mau jawaban langsung**
```
Saya macet di [masalah]. Yang sudah saya coba: [daftar].
Hipotesis saya: [hipotesis].
Jangan beri jawaban. Beri saya satu pertanyaan yang harus saya jawab
untuk menguji hipotesis ini, dan sebutkan hasil seperti apa yang akan
membuat hipotesis saya SALAH.
```

**B. Saat AI memberi kode yang tidak Anda pahami**
```
Jelaskan kode ini baris per baris, tapi jangan ringkas.
Untuk setiap baris yang "aneh" (yang tidak akan saya tulis sendiri),
jelaskan: kenapa harus begitu, dan apa yang rusak kalau dihilangkan.
Lalu beri saya satu input di mana kode ini gagal.
```

**C. Saat Anda pikir sudah paham (uji diri)**
```
Saya pikir saya paham [konsep]. Saya akan menjelaskannya:
[penjelasan Anda].
Temukan di mana penjelasan saya SALAH atau kabur. Jangan pujian.
Sebutkan satu kasus yang tidak bisa dijelaskan oleh pemahaman saya saat ini.
```

**D. Saat mau latihan, bukan materi**
```
Beri saya 3 potongan kode Python yang mengandung bug, dari yang paling
mudah ke paling sulit. Jangan beri tahu bug-nya. Untuk setiap potongan,
sebutkan gejala yang akan saya lihat (pesan error atau output salah),
tapi bukan penyebabnya.
```

Template **C** dan **D** adalah yang paling jarang dipakai dan paling berdampak. Kebanyakan orang memakai AI untuk mendapatkan jawaban; cara terbaik memakai AI untuk belajar adalah memintanya **mencari kelemahan Anda**.

---

## 4. Membangun lebih baik daripada membaca

Materi arsitektur dan debugging di repo ini punya urutan yang saya sarankan: **baca sedikit, bangun banyak.**

### Pola "build-break-fix"

Ini latihan inti yang melatih debugging dan arsitektur sekaligus:

```
1. BANGUN   Ambil aplikasi kecil yang sudah jalan (10–50 baris).
2. RUSAK    Sengaja masukkan bug. Tapi JANGAN ingat di mana.
            Cara paling baik: tunggu 2 hari, baru kerjakan.
            Cara kedua: minta AI menyisipkan bug tanpa memberi tahu Anda letaknya.
3. DEBUG    Temukan dan perbaiki, pakai prosedur dari fase-0/debugging/.
4. CATAT    Tulis: apa gejalanya, apa hipotesis pertama saya, apa yang
            sebenarnya, berapa lama saya butuh.
```

Kenapa ini efektif: Anda berlatih debugging **tanpa risiko**, dalam kondisi di mana Anda **tidak tahu jawabannya**. Itu persis kondisi debugging nyata — tapi tanpa tekanan produksi.

Ladder lengkapnya ada di `debugging/07-latihan-bertahap-debugging.md`.

### Untuk arsitektur: pola "desain ulang yang sudah ada"

Jangan mulai dari "desain sistem absensi dari nol" — itu terlalu terbuka, dan Anda tidak punya cara menilai hasilnya.

Mulai dari yang **sudah ada**:

```
1. Ambil aplikasi yang Anda pakai sehari-hari (aplikasi absensi sekolah,
   kasir toko, atau aplikasi yang Anda bangun sendiri).
2. Gambar ulang arsitekturnya di kertas, dari yang Anda pahami.
3. Tandai: di mana data disimpan? apa yang terjadi kalau bagian ini mati?
4. Baru cek asumsinya (buka dokumentasi, tanya AI, atau lihat log).
```

Yang ketiga itu kuncinya. "Apa yang terjadi kalau bagian ini mati?" adalah pertanyaan arsitektur yang sebenarnya — jauh lebih berguna daripada menggambar kotak-kotak yang rapi.

Latihan lengkapnya di `arsitektur/04-review-dan-latihan-arsitektur.md`.

---

## 5. Konsep perlu diulang, bukan cuma dipahami sekali

Ada dua jenis pengetahuan, dan keduanya butuh penanganan berbeda.

| Jenis | Contoh | Cara belajar |
|---|---|---|
| **Prosedural** | Cara debug, cara menulis ADR, cara git bisect | **Latihan berulang sampai otomatis.** Sekali paham tidak cukup. |
| **Deklaratif** | CAP theorem, apa itu CDN, apa itu sharding | **Penjelasan + koneksi ke pengalaman.** Cukup dipahami, lalu dihubungkan. |

**Kesalahan umum:** memperlakukan keduanya sama. Orang membaca tentang debugging sekali (deklaratif) dan mengira bisa debug (prosedural). Tidak bisa — kemampuan prosedural hanya lahir dari pengulangan.

### Jadwal ulang yang praktis

- **Prosedural** (debugging, arsitektur): ulangi lewat **latihan**, bukan baca ulang. Minimal 5 kali sebelum terasa otomatis.
- **Deklaratif** (konsep): ulangi lewat **menjelaskan ke orang lain** atau **menghubungkan ke sistem yang Anda kenal**. Contoh: "CAP theorem itu kayak kenapa WhatsApp masih bisa kirim pesan saat sinyal jelek" — koneksi seperti ini yang menahan konsep di kepala.

### Uji "satu kalimat"

Setelah membaca apa pun, tutup filenya dan tulis **satu kalimat** yang menjelaskannya, dalam bahasa Anda sendiri, tanpa istilah dari file itu.

- Bisa → lanjut.
- Tidak bisa → Anda belum paham. Anda baru selesai membaca.

Kalau tidak bisa setelah 2 percobaan, jangan lanjut. Balik ke `debugging/01-mental-model-debugging.md` atau cari padanan konsep itu di folder lain — kadang yang salah bukan Anda, tapi penjelasan di satu file tidak cocok dengan cara Anda berpikir.

---

## 6. Plateau: kenapa kemajuan berhenti, dan apa yang salah

Kemajuan belajar pemrograman tidak naik lurus. Ia naik cepat, lalu datar berminggu-minggu, lalu naik lagi.

**Plateau hampir selalu berarti salah satu dari tiga hal** — bukan berarti Anda tidak berbakat:

| Gejala plateau | Kemungkinan penyebab | Yang dilakukan |
|---|---|---|
| Bisa mengerjakan yang sudah dikuasai, tidak bisa yang baru | **Tidak ada tantangan.** Anda mengulang zona nyaman. | Naikkan kesulitan. Ambil satu bug yang belum pernah Anda temui jenisnya. |
| Bisa mengikuti materi, tapi tidak bisa mulai sendiri | **Terlalu banyak konsumsi, terlalu sedikit produksi.** | Tutup semua materi. Bangun sesuatu yang kecil, sendiri, tanpa panduan. |
| Merasa tidak maju padahal berlatih | **Tidak ada umpan balik.** Anda tidak tahu di mana salahnya. | Minta review. Tulis kode Anda, minta AI atau orang lain mencari kelemahannya — bukan memuji. |

**Yang tidak boleh dilakukan saat plateau:** mengganti bahasa/framework. Itu memberi rasa maju (karena semuanya baru lagi) tanpa memperbaiki akar masalahnya. Plateau karena tidak ada tantangan akan kembali dalam 3 minggu di bahasa baru.

---

## 7. Aturan-aturan ringkas

Kalau Anda lupa semuanya, ingat ini:

1. **Prediksi sebelum menjalankan.** Selalu. Tanpa kecuali.
2. **Satu materi sampai selesai, baru tambah.** Jangan koleksi.
3. **Tulis satu kalimat alasan** untuk setiap kode yang tidak Anda tulis sendiri.
4. **Jangan minta jawaban; minta eksperimen berikutnya.**
5. **Latih prosedural dengan mengulang, bukan membaca.**
6. **Rusak kode sendiri untuk berlatih debug.** Lebih baik salah di latihan.
7. **Kalau tidak bisa menjelaskan dalam satu kalimat, Anda belum paham.**
8. **Satu jam sehari > empat jam sekali seminggu.**
9. **Kalau plateau, naikkan kesulitan — jangan ganti bahasa.**
10. **Setiap sesi belajar harus ada momen Anda salah.** Kalau tidak ada, Anda sedang mengulang, bukan belajar.

---

## Cek cepat: apakah sesi belajar Anda benar?

Setelah satu sesi, jawab ini:

- [ ] Apakah saya **memprediksi** sesuatu hari ini? (kalau tidak → sesi ini konsumsi, bukan belajar)
- [ ] Apakah saya **salah** hari ini? (kalau tidak → materinya terlalu mudah)
- [ ] Apakah saya bisa **menjelaskan** yang saya pelajari dalam satu kalimat? (kalau tidak → ulangi besok)
- [ ] Apakah saya menulis **satu baris** di log belajar? (kalau tidak → kemajuannya tidak akan terlihat)

Empat kotak terisi = sesi yang baik. Dua atau kurang = ulangi dengan cara berbeda.

---

> **Lanjut ke:** pilih jalur Anda.
> Arsitektur → [`04-jalur-arsitektur-desain.md`](./04-jalur-arsitektur-desain.md)
> Debugging → [`05-jalur-debugging-dan-fix-error.md`](./05-jalur-debugging-dan-fix-error.md)
