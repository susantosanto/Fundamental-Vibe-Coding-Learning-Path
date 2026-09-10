# 📚 Modul 9: Ringkasan & Glosarium

> **Perjalanan selesai — sekarang waktunya menguatkan ingatan.**
> Waktu: ~20 menit | Level: Semua

---

## 🧠 9.1 RINGKASAN SEMUA MODUL

```text
MODUL 1: ARSITEKTUR = DENAH
  → Jawab 3 pertanyaan SEBELUM coding: FUNGSI, DATA, ALUR
  → Anda arsitek, AI tukang

MODUL 2: 4 KOMPONEN INTI
  → Frontend (ruang makan) + Backend (dapur)
  → Database (gudang) + API (pelayan)
  → Next.js = restoran satu atap (frontend + backend sekaligus)

MODUL 3: STRUKTUR FOLDER
  → app/ (halaman & API) + components/ (lego UI)
  → lib/ (helper & database) + public/ (gambar)
  → layout.tsx = kerangka, page.tsx = isi halaman

MODUL 4: KOMPONEN & PROPS
  → Komponen = lego (function + tampilan)
  → Props = bekal dari induk ke anak
  → Satu komponen satu tugas
  → Interaksi? → "use client"

MODUL 5: STATE & ALUR DATA
  → State = ingatan aplikasi (data berubah-ubah)
  → useState + setter (jangan ubah langsung!)
  → Data turun (props), event naik
  → State di induk (satu sumber)

MODUL 6: API & DATABASE
  → API = jembatan frontend ↔ backend (route handler)
  → CRUD = Create, Read, Update, Delete (POST, GET, PATCH, DELETE)
  → Database = gudang tabel (baris, kolom, id)
  → SATU SUMBER KEBENARAN di database

MODUL 7: TRADE-OFF
  → Setiap pilihan: MENANG sesuatu, KALAH sesuatu
  → localStorage vs database (3 pertanyaan)
  → Server vs client component
  → Seni menunda (MUST / SHOULD / NICE)
  → Jangan over-engineer!

MODUL 8: PROYEK AKHIR
  → Denah dulu, kode belakangan
  → Langkah kecil, tes tiap langkah
  → Aplikasi perpustakaan semi-kompleks SELESAI ✅
```

---

## 🧠 9.2 PETA KE fase-1-arsitektur-dasar

Sekarang Anda tahu "kenapa", jadi pendalaman jadi mudah:

| Konsep fase-1-arsitektur-dasar | Yang SUDAH Anda Rasakan di Modul Ini |
|-------------------------------|---------------------------------------|
| **System design (file 01)** | Denah sebelum bangun — Anda sudah lakukan! |
| **Application layer (file 11)** | Frontend/backend/API — Modul 2 & 6 |
| **Database RDBMS (file 12)** | Tabel, baris, kolom, id, relasi — Modul 6 |
| **Konsistensi data (file 05)** | "Satu sumber kebenaran" — Modul 6 |
| **Trade-off (file 02-04)** | localStorage vs DB, server vs client — Modul 7 |
| **Cache (file 14)** | (belum) — nanti terasa saat aplikasi lambat |
| **Scaling (file 02)** | (belum) — nanti saat banyak pengguna |
| **Load balancer, CDN (09, 08)** | (belum) — skala raksasa, baca saja dulu |

> 🎯 **Rekomendasi:** Buka `fase-1-arsitektur-dasar/00-panduan-fase.md`
> dan coba baca file 01, 11, 12 dulu. Anda akan terkejut betapa
> mudahnya sekarang!

---

## 📖 9.3 GLOSARIUM ARSITEKTUR (KAMUS PRIBADI ANDA)

| Istilah | Arti Sederhana | Modul |
|---------|---------------|-------|
| **Arsitektur** | Denah aplikasi: bagian-bagian & cara terhubung | 1 |
| **Frontend** | Bagian yang dilihat & disentuh user | 2 |
| **Backend** | Bagian yang memproses logika di server | 2 |
| **Database** | Tempat menyimpan data permanen | 2, 6 |
| **API** | Jembatan frontend ↔ backend | 2, 6 |
| **Route handler** | File API di Next.js (`app/api/.../route.ts`) | 6 |
| **CRUD** | 4 operasi dasar data: Create, Read, Update, Delete | 6 |
| **Komponen** | "Lego" UI (function + tampilan) yang dipakai ulang | 4 |
| **Props** | Data yang dikirim induk → anak | 4 |
| **State** | "Ingatan" aplikasi; data yang bisa berubah | 5 |
| **useState** | Alat React untuk menyimpan & mengubah state | 5 |
| **Client component** | Komponen interaktif (`"use client"`) | 4 |
| **Server component** | Komponen yang diproses server (default) | 4 |
| **Layout** | Kerangka yang sama di semua halaman | 3 |
| **Page** | Isi satu halaman tertentu | 3 |
| **Tabel** | Kumpulan data sejenis di database | 6 |
| **Row / Column** | Baris (satu data) / kolom (satu sifat) | 6 |
| **Primary key (id)** | Penanda unik tiap baris data | 6 |
| **Trade-off** | Memilih = menukar keuntungan dengan kerugian | 7 |
| **Over-engineering** | Membuat yang tidak perlu — hindari! | 7 |
| **Right-sizing** | Pakai sesedikit yang cukup untuk kebutuhan | 7 |
| **localStorage** | Penyimpanan di browser (1 user, bisa hilang) | 5, 7 |
| **SQLite** | Database 1 file, mudah untuk belajar | 6 |
| **Prisma** | Alat bantu database yang ramah pemula | 6 |
| **Vibe coding** | Membangun aplikasi dengan bantuan AI | semua |
| **CLI agent** | AI yang bekerja langsung di folder proyek (Claude Code/OpenCode) | semua |

---

## 🧠 9.4 PERTANYAAN REFLEKSI AKHIR

Jawab dengan jujur (boleh tanya AI untuk membantu):

```text
1. Apa konsep yang PALING membuka mata Anda di modul ini?
2. Apa yang masih membingungkan? (tulis, lalu minta AI jelaskan)
3. Aplikasi apa yang ingin Anda bangun BERIKUTNYA?
4. Fitur apa di aplikasi Anda yang sebaiknya DITUNDA?
5. Kapan Anda akan kembali ke fase-1-arsitektur-dasar?
```

> 💡 **Minta AI rangkum pemahaman Anda:**
> ```text
> Saya baru selesai belajar arsitektur vibe coding (denah,
> 4 komponen, folder Next.js, komponen & props, state,
> API & database, trade-off). Uji pemahaman saya dengan
> 5 pertanyaan. Setelah saya jawab, koreksi & jelaskan
> jawaban yang benar.
> ```

---

## ✅ CHECKLIST FINAL MODUL 9

```
☐ Bisa jelaskan semua 8 modul dalam 1 menit (coba!)
☐ Glosarium sudah dibaca — tandai istilah yang masih asing
☐ Sudah tahu file fase-1-arsitektur-dasar mana yang dibaca pertama
☐ Punya rencana aplikasi berikutnya
☐ Pertanyaan refleksi sudah dijawab
```

---

## 🎉 SELAMAT! ANDA LULUS ARSITEKTUR VIBE CODING!

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   PERJALANAN ANDA:                                      │
│                                                         │
│   🟢 Tidak tahu arsitektur sama sekali                  │
│   🟢 Bisa membuat denah (FUNGSI, DATA, ALUR)           │
│   🟢 Paham 4 komponen aplikasi web                      │
│   🟢 Proyek Next.js rapi & terstruktur                  │
│   🟢 Bisa susun komponen & kelola state                 │
│   🟢 API + database dengan CRUD lengkap                 │
│   🟢 Tahu kapan menunda fitur (anti over-engineer)     │
│   🟢 APLIKASI SEMI-KOMPLEKS PERTAMA SELESAI! 🏆        │
│                                                         │
│   INGAT:                                                │
│   🎯 Anda arsiteknya. AI hanya tukangnya.               │
│   🎯 Denah dulu, kode belakangan.                       │
│   🎯 Sederhana dulu, upgrade saat perlu.                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**📂 Lanjut: buka `10-reactjs.md`** untuk mulai Tahap 2 (tech stack),
**atau** buka `cheat-sheet-prompt.md` untuk template prompt siap pakai.
Pendalaman: `fase-1-arsitektur-dasar/`.
