# ⚖️ Modul 7: Trade-off Pemula (Kapan Butuh Apa?)

> **Tidak ada arsitektur yang "paling benar" — yang ada adalah yang PALING COCOK.**
> Waktu: ~30 menit | Level: 🟢🟡 | Kaitan: `fase-1-arsitektur-dasar` file `02`-`04` (performa, trade-off)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Prinsip "everything is a trade-off" dalam bahasa sederhana
✅ 3 keputusan penting: database vs localStorage, server vs client, library vs bikin sendiri
✅ Seni menunda: fitur apa yang BISA ditunda (anti over-engineer)
✅ Cara minta AI mengevaluasi keputusan arsitektur
```

---

## 🧠 7.1 EVERYTHING IS A TRADE-OFF

Di `fase-1-arsitektur-dasar` Anda akan sering mendengar frasa ini
(dari file 01 dan seterusnya):

> *"Setiap keputusan punya kelebihan dan kekurangan. Pilih yang paling
> cocok, bukan yang paling canggih."*

**Arti sederhananya:**

```text
MEMILIH = MENUKAR

Setiap pilihan arsitektur menukar satu keuntungan dengan satu kerugian:

PILIHAN                 MENANG                     KALAH
─────────────────────────────────────────────────────────────
localStorage            ✅ Simpel, cepat          ❌ Data 1 user saja
Database                ✅ Aman, bisa dibagi     ❌ Lebih ribet setup
Server component        ✅ Cepat, aman           ❌ Tidak bisa interaktif
Client component        ✅ Interaktif            ❌ JS lebih berat
Bikin sendiri           ✅ Paham & fleksibel     ❌ Butuh waktu lama
Pakai library           ✅ Cepat jadi            ❌ Tergantung pihak lain
```

> 🎯 **Tidak ada jawaban salah mutlak.** Yang ada: *"Apakah ini cocok
> dengan kebutuhan saya SEKARANG?"*

---

## 🧠 7.2 KEPUTUSAN 1: localStorage vs Database

Ini keputusan paling sering dihadapi pemula:

```text
PERTANYAAN: "Data saya simpan di browser (localStorage) atau database?"

JAWAB DENGAN 3 PERTANYAAN:
1. Data ini perlu dilihat orang LAIN?      → YA → database
2. Data ini perlu aman dari hilang?        → YA → database
3. Data ini perlu dipakai di banyak device?→ YA → database

Kalau SEMUA TIDAK (data pribadi, sesi pendek) → localStorage OK
Kalau ada SATU YA → database
```

**Contoh:**
- Daftar belanja pribadi saya → localStorage cukup
- Absensi siswa yang dilihat guru & kepala sekolah → database

> 💡 **Rekomendasi untuk belajar:** mulai dengan yang sederhana
> (localStorage), lalu pindah ke database saat butuh. Itu pola
> pengembangan yang sehat — **"bikin dulu, upgrade saat perlu".**

---

## 🧠 7.3 KEPUTUSAN 2: Server vs Client Component

Anda sudah belajar di Modul 4. Sekarang kenapa ini "trade-off":

```text
SERVER COMPONENT (default)          CLIENT COMPONENT ("use client")
✅ Cepat (diproses server)          ✅ Interaktif (klik, ketik)
✅ Aman (logika di server)          ✅ State & form
✅ Ringan (JS sedikit di browser)   ✅ Pengalaman user hidup
❌ Tidak bisa interaktif            ❌ JS lebih berat
❌ Tidak bisa pakai useState        ❌ Kode logika terlihat user

ATURAN IBU JARI:
- Bisa server? → SERVER (lebih baik)
- Butuh interaksi? → CLIENT (terpaksa)
- "Client component HANYA kalau perlu"
```

---

## 🧠 7.4 KEPUTUSAN 3: Library vs Bikin Sendiri

```text
PERTANYAAN: "Fitur X: pakai library (bahan jadi) atau bikin sendiri?"

PERTIMBANGKAN dulu:

PAKAI LIBRARY kalau:
- Fiturnya umum (chart, date picker, form)
- Library populer & terawat (banyak user, update rutin)
- Anda tidak ingin belajar detailnya SEKARANG

BIKIN SENDIRI kalau:
- Fiturnya sangat spesifik untuk aplikasi Anda
- Anda ingin MEMAHAMI cara kerjanya (belajar!)
- Library-nya berat / tidak terawat

⚠️ JANGAN: instal library untuk hal yang 10 baris bisa selesai.
   (Ini "over-engineering" — musuh pemula!)
```

---

## 🧠 7.5 SENI MENUNDA (ANTI OVER-ENGINEERING)

Ini skill paling berharga untuk vibe coder pemula:

```text
❌ YANG SERING TERJADI:
"Kayaknya saya perlu: login, role admin, cache, export PDF,
   notifikasi, dark mode, ..."  → SEMUA SEKALIGUS?
→ Proyek tidak pernah selesai, burnout!

✅ POLA YANG BENAR (incremental):
1. Buat versi paling sederhana yang JALAN
2. Tambah fitur SATU PER SATU saat benar-benar dibutuhkan
3. Tunda fitur "bagus kalau ada" (nice-to-have)
4. Baru pikirkan scaling kalau memang sudah ramai user
```

### Cara Minta AI Bantu Menunda

```text
Saya punya daftar fitur ini: [daftar fitur].

Klasifikasikan ke 3 kategori:
1. MUST HAVE  → wajib untuk aplikasi jalan
2. SHOULD HAVE → penting tapi bisa menyusul
3. NICE TO HAVE → bagus kalau ada, tapi bisa ditunda

Beri alasan singkat untuk tiap fitur, dan usulkan urutan
pengerjaan yang paling sederhana dulu.
```

---

## 🤖 7.6 TEMPLATE PROMPT: EVALUASI KEPUTUSAN

### Prompt 1: Evaluasi Arsitektur Aplikasi

```text
Baca proyek saya (app/, components/, lib/).

Evaluasi keputusan arsitektur dengan jujur:
1. Apakah ada bagian yang OVER-ENGINEERED?
   (fitur/komponen yang tidak perlu untuk kebutuhan saat ini)
2. Apakah ada bagian yang UNDER-ENGINEERED?
   (yang seharusnya sudah pakai database/validasi tapi belum)
3. Untuk tiap temuan: jelaskan trade-off-nya
   (apa yang menang, apa yang kalah)

Prioritaskan: MUST FIX → SHOULD FIX → NICE TO HAVE.
JANGAN langsung mengubah kode. Lapor dulu, saya putuskan.
```

### Prompt 2: Bantu Pilih Teknologi

```text
Saya harus memilih antara [opsi A] dan [opsi B] untuk [kebutuhan].

Bandingkan dengan tabel:
| Aspek | Opsi A | Opsi B |
|--------|--------|--------|
| Kesulitan belajar | ... | ... |
| Cocok untuk proyek kecil | ... | ... |
| Cocok untuk skala besar | ... | ... |
| Biaya | ... | ... |

Lalu beri rekomendasi untuk situasi saya:
[deskripsi aplikasi & skala saat ini]
Ingat: rekomendasikan yang SESEDERHANA yang cukup, jangan yang
paling canggih.
```

---

## 🏗️ 7.7 PRAKTIK

### Latihan 1: Keputusan untuk Aplikasi Anda (15 menit)

```text
Untuk aplikasi yang sedang Anda bangun, jawab:

1. Data apa yang dipakai? Perlu dilihat orang lain / multi-device?
   → localStorage atau database?
2. Komponen mana yang butuh interaksi (klik, ketik)?
   → tandai yang perlu "use client"
3. Fitur apa yang Anda INGINKAN tapi bisa DITUNDA?
   → buat daftar MUST/SHOULD/NICE
4. Ada library yang terasa perlu? Coba tanya AI dulu:
   "Apakah saya perlu [nama library] untuk [fitur], atau cukup
   kode sederhana saja?"
```

### Latihan 2: Review Trade-off (15 menit)

```text
Jalankan Prompt 1 (evaluasi arsitektur) di proyek Anda.
Baca hasilnya, lalu:
1. Pilih 1 rekomendasi MUST/SHOULD yang masuk akal
2. Setujui perbaikannya ke AI
3. Ulangi sampai checklist Modul 6 tetap jalan (jangan rusak!)
```

### Latihan 3: Refleksi (5 menit)

```text
1. Keputusan arsitektur apa yang sudah Anda buat minggu ini?
2. Apa yang Anda MENANG dan apa yang Anda KALAH dari keputusan itu?
3. Kalau mengulang, apa yang akan Anda ubah?
```

---

## ✅ CHECKLIST MODUL 7

```
☐ Paham "everything is a trade-off" dalam bahasa sederhana
☐ Bisa memutuskan localStorage vs database dengan 3 pertanyaan
☐ Tahu kapan pakai server vs client component
☐ Tahu kapan pakai library vs bikin sendiri
☐ Paham seni menunda (MUST / SHOULD / NICE)
☐ AI sudah mengevaluasi arsitektur proyek Anda
```

**🎯 Target:** Anda bisa membuat keputusan arsitektur dengan sadar
— dan tahu kapan harus BERPURA-PURA tidak tahu (menunda).

Jika sudah paham → **Buka `08-proyek-semi-kompleks.md`** 🏗️
