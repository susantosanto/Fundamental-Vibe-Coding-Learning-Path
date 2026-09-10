# 🏠 Modul 1: Arsitektur Itu Gampang

> **Arsitektur bukan matematika. Arsitektur itu "denah".**
> Waktu: ~30 menit | Level: 🟢 Pemula | Lanjutan dari: `prompting-fundamental/fase-04`

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu arsitektur aplikasi (dengan analogi rumah & restoran)
✅ Kenapa AI butuh denah sebelum menulis kode
✅ 3 pertanyaan ajaib untuk mendesain aplikasi apa pun
✅ Template prompt arsitektur yang langsung dipakai
```

---

## 🧠 1.1 ARSITEKTUR = DENAH

### Analogi: Membangun Rumah

Coba ingat materi `prompting-fundamental/fase-04`:

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│  TANPA DENAH:                                          │
│  "Bangunkan saya rumah!"                               │
│  → Tukang bingung: ukuran berapa? kamar berapa?        │
│  → Hasilnya: rumah asal-asalan, tembok di tengah pintu  │
│                                                        │
│  DENGAN DENAH:                                         │
│  "Ini denahnya: 3 kamar, 2 kamar mandi, dapur di       │
│   belakang, garasi di samping."                        │
│  → Tukang langsung kerja, hasilnya sesuai              │
│                                                        │
│  ARSITEKTUR APLIKASI = DENAH RUMAH                     │
│  AI = TUKANG                                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Analogi Kedua: Restoran

Bayangkan Anda mau buka **restoran**. Sebelum masak, Anda harus tahu:

| Pertanyaan | Jawaban Restoran | Jawaban Aplikasi |
|-----------|------------------|------------------|
| **Untuk siapa?** | Mahasiswa? Keluarga? | Siapa penggunanya? |
| **Menu apa?** | Nasi goreng? Sushi? | Fitur apa saja? |
| **Bahan apa?** | Beras, ayam, bumbu | Data apa yang disimpan? |
| **Alurnya?** | Pelanggan pesan → dapur masak → disajikan | User input → diproses → ditampilkan |

**Arsitektur = jawaban atas pertanyaan-pertanyaan itu SEBELUM mulai coding.**

---

## 🧠 1.2 KENAPA AI JUGA BUTUH DENAH?

Di materi prompting, Anda belajar:

> *"AI seperti asisten yang sangat pintar tapi tidak bisa membaca pikiran."*

Kalau Anda bilang ke AI: *"Buatkan aplikasi catatan!"* — AI akan **menebak**:

```text
❌ PROMPT TANPA ARSITEKTUR:
"Buatkan aplikasi catatan."

AI berpikir:
- Catatan apa? To-do? Diary? Belanja?
- Disimpan di mana? Browser? Server?
- Bisa dihapus? Bisa diedit? Ada akun?
→ AI MENCOBA MENGAWUR, hasilnya berantakan

✅ PROMPT DENGAN ARSITEKTUR:
"Saya mau aplikasi catatan belanja:
- Pengguna: saya sendiri
- Fitur: tambah item (nama + harga), hapus item, lihat total
- Data: item belanja (nama, harga)
- Alur: ketik nama & harga → klik tambah → muncul di daftar

Pertama jelaskan denah aplikasinya dulu, jangan langsung kode."

→ AI paham persis, hasilnya rapi
```

> 🎯 **Prinsip inti vibe coding:**
> **Anda yang arsitek, AI yang tukang.** Semakin jelas denah Anda,
> semakin bagus bangunan yang AI buat.

---

## 🧠 1.3 TIGA PERTANYAAN AJAIB

Tidak perlu belajar puluhan istilah rumit. Untuk aplikasi semi-kompleks,
cukup jawab **3 pertanyaan** ini:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PERTANYAAN 1: FUNGSI                                   │
│  "Aplikasi ini buat APA? Fitur apa saja?"               │
│  → Tulis 3-7 fitur utama                                │
│                                                         │
│  PERTANYAAN 2: DATA                                    │
│  "Data APA saja yang perlu disimpan?"                   │
│  → Sebutkan "benda" (entitas): mis. Item, Pengguna      │
│                                                         │
│  PERTANYAAN 3: ALUR                                    │
│  "Bagaimana data MENGALIR dari awal sampai akhir?"      │
│  → Ingat pola: Input → Proses → Output (fase-4)        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Contoh: Aplikasi Catatan Belanja

```text
FUNGSI:
1. Tambah item belanja (nama + harga)
2. Lihat daftar belanja
3. Hapus item
4. Lihat total harga

DATA:
- Item belanja → punya: nama, harga
- (belum perlu simpan pengguna, karena dipakai sendiri)

ALUR:
INPUT:  ketik nama + harga → klik "Tambah"
PROSES: simpan item ke daftar → hitung ulang total
OUTPUT: item muncul di daftar + total harga terbaru
```

**Itu sudah jadi denah!** Sekarang prompt AI dengan denah ini.

---

## 🤖 1.4 TEMPLATE PROMPT ARSITEKTUR (untuk CLI)

Prompt ini dirancang untuk **Claude Code / OpenCode**. Agent akan
membaca folder proyek Anda dan bekerja langsung di sana.

### Template 1: Minta AI Membuatkan Denah

```text
Kamu adalah arsitek aplikasi web senior.

Saya mau membuat aplikasi [NAMA APLIKASI].

Ini kebutuhan saya:

<kebutuhan>
FUNGSI:
[Fitur 1]
[Fitur 2]
[Fitur 3]

DATA:
[Entitas 1: sifat-sifatnya]
[Entitas 2: sifat-sifatnya]

ALUR:
INPUT: [apa yang user lakukan]
PROSES: [apa yang terjadi]
OUTPUT: [apa yang user lihat]
</kebutuhan>

TOLONG JANGAN LANGSUNG MENULIS KODE.

Pertama, buatkan denah arsitekturnya dalam format:
1. Komponen aplikasi (frontend, backend, database) apa saja yang dibutuhkan
2. Struktur folder yang disarankan
3. Tabel data yang perlu disimpan
4. Alur data dari user sampai tersimpan

Setelah itu, tanyakan ke saya: "Apakah denah ini sudah sesuai?
Kalau ya, saya lanjut buat struktur project-nya."

Mintalah persetujuan saya sebelum lanjut.
```

### Template 2: Review Denah yang Sudah Ada

```text
Baca isi folder proyek ini (app/, components/, lib/).

Jelaskan dengan diagram sederhana:
1. Bagaimana arsitektur aplikasi ini sekarang?
2. Apa yang rapi dan apa yang bisa diperbaiki?
3. Beri saran 3 perbaikan paling penting saja.

Jangan ubah file apa pun. Cukup analisis dan jelaskan.
```

---

## 🏗️ 1.5 PRAKTIK: DENAH APLIKASI PERTAMAMU

### Latihan 1: Jawab 3 Pertanyaan (10 menit)

Pilih **satu** ide aplikasi sederhana, lalu jawab 3 pertanyaan ajaib:

```text
IDE: Aplikasi [apa?] untuk [siapa?]

FUNGSI:
1. ___
2. ___
3. ___

DATA:
- ___ (punya: ___, ___)

ALUR:
INPUT: ___
PROSES: ___
OUTPUT: ___
```

**Ide yang disarankan (pilih satu):**
- Aplikasi daftar tugas (to-do list)
- Aplikasi catatan pengeluaran harian
- Aplikasi daftar buku perpustakaan sekolah

### Latihan 2: Prompt ke AI (15 menit)

```text
1. Buka terminal di folder proyek kosong
2. Jalankan Claude Code / OpenCode
3. Tempel Template 1 (bagian 1.4) dengan jawaban Latihan 1
4. Baca denah yang AI berikan
5. Kalau ada yang kurang, perbaiki dengan berkata:
   "Tambah fitur ini: ..." atau "Data ini juga perlu disimpan: ..."
6. Setujui denahnya
```

### Latihan 3: Uji Pemahaman (5 menit)

Jawab dengan kata-kata sendiri:

```text
1. Apa persamaan arsitektur aplikasi dan denah rumah?
2. Kenapa AI menghasilkan kode buruk kalau tidak dikasih denah?
3. Sebutkan 3 pertanyaan ajaib.
4. Apa bedanya peran Anda (arsitek) dan peran AI (tukang)?
```

<details>
<summary>🔍 Petunjuk jawaban</summary>

1. Keduanya adalah rencana yang menunjukkan bagian-bagian sistem dan
   bagaimana mereka terhubung, dibuat SEBELUM dibangun.
2. Karena AI menebak kebutuhan Anda kalau tidak dijelaskan —
   dan tebakan jarang tepat.
3. FUNGSI (buat apa), DATA (simpan apa), ALUR (mengalir bagaimana).
4. Anda menentukan apa yang dibangun (desain), AI yang membangunnya (kode).

</details>

---

## ✅ CHECKLIST MODUL 1

```
☐ Paham analogi arsitektur = denah
☐ Paham kenapa AI butuh denah sebelum coding
☐ Hafal 3 pertanyaan ajaib: FUNGSI, DATA, ALUR
☐ Bisa mengisi template denah untuk 1 ide aplikasi
☐ Sudah coba prompt arsitektur ke AI di CLI
☐ AI sudah membuatkan denah dan Anda menyetujuinya
```

**🎯 Target:** Anda bisa menggambar denah aplikasi sebelum AI menulis kode.

Jika sudah paham → **Buka `02-peta-aplikasi-modern.md`**
