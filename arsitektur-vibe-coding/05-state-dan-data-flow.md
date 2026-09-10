# 🔄 Modul 5: State & Alur Data

> **State = "ingatan" aplikasi. Alur data = cara data bergerak di dalam aplikasi.**
> Waktu: ~45 menit | Level: 🟢🟡 Pemula → Intermediate | Lanjutan: `prompting-fundamental/fase-06` (state management)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu state (data yang berubah-ubah)
✅ useState: cara simpan & ubah data di komponen
✅ Alur data: props turun, event naik (data flow)
✅ Bedanya data "di browser" vs data "di database"
```

---

## 🧠 5.1 STATE = INGATAN APLIKASI

Ingat di fase-6: *"Data di 1 tempat (sentralisasi)"* — itu konsep state!

```text
STATE = data yang bisa BERUBAH selama aplikasi dipakai

Contoh state di aplikasi belanja:
- Daftar item yang sudah ditambahkan (bertambah saat klik Tambah)
- Total harga (berubah tiap item ditambah/dihapus)
- Teks yang sedang diketik di kolom input

Kebalikannya: data yang TIDAK berubah = bukan state
- Nama aplikasi ("Aplikasi Belanja")
- Daftar harga tetap (kalau memang tetap)
```

### Analogi: Papan Tulis di Kelas

```text
┌────────────────────────────────────────────┐
│  PAPAN TULIS (STATE)                       │
│                                            │
│  Awal:   [kosong]                          │
│  Guru (user) menulis: "Nasi Goreng"        │
│  Papan:  "Nasi Goreng"  ← state berubah!   │
│  Guru menambah: "Es Teh"                   │
│  Papan:  "Nasi Goreng, Es Teh"  ← berubah  │
│                                            │
│  Papan menyimpan "ingatan" kelas hari ini  │
│  Kalau kelas ditutup, papan dihapus        │
│  (state hilang kalau halaman di-refresh)   │
└────────────────────────────────────────────┘
```

> 🎯 **Kenapa ini penting?** Karena kebanyakan bug aplikasi berasal dari
> **state yang tidak sinkron** — tampilan bilang satu hal, data aslinya
> beda. Konsep ini juga yang membuat `fase-1-arsitektur-dasar` (konsistensi
> data, Modul 05) terasa masuk akal nanti.

---

## 🧠 5.2 useState: MENYIMPAN & MENGUBAH DATA

Di React, cara paling umum menyimpan state adalah `useState`:

```tsx
"use client"; // BUTUH interaksi → client component

import { useState } from "react";

export default function FormTambahItem() {
  // state "items": mulai dari daftar kosong
  const [items, setItems] = useState<string[]>([]);
  // state "namaBaru": teks yang sedang diketik
  const [namaBaru, setNamaBaru] = useState("");

  function tambahItem() {
    // SALIN daftar lama + tambah item baru
    setItems([...items, namaBaru]);
    setNamaBaru(""); // kosongkan input
  }

  return (
    <div>
      <input
        value={namaBaru}
        onChange={(e) => setNamaBaru(e.target.value)}
        placeholder="Nama barang"
      />
      <button onClick={tambahItem}>Tambah</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Pola yang Harus Anda Pahami (bukan hafal)

```text
1. const [nilai, setNilai] = useState(awal)
   → nilai  = data sekarang
   → setNilai = function untuk MENGUBAH data

2. JANGAN langsung ubah:  items.push(...)      ❌
   → SELALU pakai setter: setItems([...])      ✅
   (Ini membuat React tahu "ada yang berubah, render ulang")

3. Setiap setNilai dipanggil → tampilan otomatis ter-update
```

> 💡 **Penting:** Jangan khawatir menghafal sintaks. AI yang menulis.
> Anda cukup tahu **pola pikirnya**: data disimpan di state, diubah
> lewat setter, tampilan mengikuti state.

---

## 🧠 5.3 ALUR DATA: PROPS TURUN, EVENT NAIK

Ini salah satu konsep paling penting di React — dan paling sering
membingungkan. Ingat baik-baik:

```text
┌───────────────────────────────────────────────────┐
│                                                   │
│   DATA MENGALIR KE BAWAH (props)                  │
│   ┌──────────────┐                                │
│   │    INDUK     │  (punya state)                 │
│   │  Halaman     │                                │
│   └──────┬───────┘                                │
│          │  props (data) turun                    │
│          ▼                                        │
│   ┌──────────────┐                                │
│   │    ANAK      │  (terima props, tampilkan)     │
│   │  KartuItem   │                                │
│   └──────┬───────┘                                │
│          │                                        │
│          │  event naik (klik, ketik)              │
│          ▼                                        │
│   INDUK mengubah state → render ulang             │
│                                                   │
│   PELAYAN: "User klik di ruang makan (anak),      │
│   dapur (induk) yang masak & update menu"         │
└───────────────────────────────────────────────────┘
```

### Kenapa Ini Penting untuk Vibe Coding?

```text
❌ KESALAHAN UMUM (biarkan AI hindari):
   - Anak punya state sendiri padahal induk juga butuh data itu
   → Data jadi dobel, tidak sinkron (bug!)

✅ POLA YANG BENAR:
   - State "tinggal" di komponen INDUK (satu tempat — ingat fase-6)
   - Anak hanya menerima props & memberi tahu induk lewat function
   - "Data naik" = anak panggil function kiriman induk
```

> 🎯 **Prinsip sentralisasi data** (dari fase-6) berlaku di sini:
> **state di satu tempat (komponen induk), bukan tersebar di mana-mana.**

---

## 🧠 5.4 DATA BROWSER vs DATA DATABASE

Saat aplikasi makin besar, muncul pertanyaan: **state simpan di mana?**

```text
┌─────────────────────────┬─────────────────────────┐
│  STATE DI BROWSER       │  DATA DI DATABASE       │
│  (localStorage, state)  │  (server)               │
├─────────────────────────┼─────────────────────────┤
│ ✅ Cepat, offline       │ ✅ Aman, permanen       │
│ ✅ Untuk 1 pengguna     │ ✅ Semua pengguna lihat  │
│ ❌ Hilang/ganti device  │ ❌ Butuh internet        │
│ ❌ Hanya untuk yang punya│ ❌ Sedikit lebih lambat  │
│   browser itu           │                         │
└─────────────────────────┴─────────────────────────┘

ATURAN IBU JARI:
- Data pribadi 1 user, sesi singkat → state browser (OK)
- Data penting / dibagi antar user → DATABASE (Modul 6!)
```

Contoh: aplikasi belanja pribadi di fase-6 pakai `localStorage`
(browser). Tapi kalau 30 guru mau lihat data yang sama → harus database.

---

## 🤖 5.5 TEMPLATE PROMPT: STATE & ALUR DATA

### Prompt 1: Bangun Fitur dengan State

```text
Buat fitur [fitur] di komponen [nama] menggunakan useState.

SPESIFIKASI:
- State yang dibutuhkan: [daftar state + tipe + nilai awal]
- Alur:
  INPUT:  [apa yang user lakukan]
  PROSES: [state mana yang berubah]
  OUTPUT: [apa yang tampil ulang]
- Tempatkan state di komponen yang paling atas yang butuh data ini
- Data dikirim ke anak lewat props
- Anak memberi tahu induk lewat function props (pola: props turun, event naik)

Setelah menulis kode, jelaskan dengan diagram teks:
siapa pegang state, siapa menerima props.
```

### Prompt 2: Perbaiki State yang Berantakan

```text
Baca file [nama-file].tsx.

Saya curiga state-nya berantakan (data dobel / tidak sinkron).
Analisis:
1. State apa saja yang ada di file ini?
2. Apakah ada state yang seharusnya berada di komponen induk?
3. Apakah ada data yang disimpan di 2 tempat (tidak sinkron)?
4. Beri saran perbaikan dengan pola:
   - state di induk
   - props turun, event naik

Jangan langsung ubah kode. Jelaskan rencanamu dulu, saya setujui dulu.
```

---

## 🏗️ 5.6 PRAKTIK

### Latihan 1: Aplikasi Belanja Sederhana (30 menit)

```text
Di proyek Next.js Anda, bangun aplikasi belanja sederhana:

FITUR:
1. Input nama barang + harga → klik "Tambah"
2. Daftar item muncul dengan tombol "Hapus" per item
3. Total harga otomatis ter-update

STRUKTUR:
- app/page.tsx → induk: pegang state items (array)
- components/features/FormTambahItem.tsx → input + tombol
- components/features/DaftarItem.tsx → daftar + tombol hapus
- components/features/TotalHarga.tsx → total

POLA: state di induk, props turun, event naik.
Gunakan TypeScript dan Tailwind. Ajak saya belajar: beri komentar
penjelasan di setiap bagian penting.
```

### Latihan 2: Uji Pemahaman (10 menit)

```text
1. Apa bedanya state dengan props?
2. Kenapa state "tinggal" di komponen induk, bukan di anak?
3. Apa yang terjadi kalau kita ubah state langsung (items.push)
   tanpa setter?
4. Data apa yang sebaiknya pindah ke database kalau aplikasi
   dipakai 30 guru sekaligus?
```

<details>
<summary>🔍 Petunjuk jawaban</summary>

1. State = data yang dimiliki & bisa diubah komponen itu sendiri.
   Props = data yang DITERIMA dari induk (tidak bisa diubah anak).
2. Agar datanya satu sumber kebenaran (tidak dobel & tidak sinkron).
   Anak cukup terima props & lapor lewat event.
3. React tidak tahu ada perubahan → tampilan tidak ter-update.
   Selalu pakai setter.
4. Data yang perlu dilihat / diubah bersama banyak pengguna
   (mis. daftar belanja bersama, laporan).

</details>

---

## ✅ CHECKLIST MODUL 5

```
☐ Paham state = ingatan aplikasi (data yang berubah)
☐ Paham useState & pola "selalu pakai setter"
☐ Paham "props turun, event naik"
☐ Paham kapan data di browser vs di database
☐ Aplikasi belanja sederhana sudah jalan (tambah, hapus, total)
☐ AI sudah jelaskan diagram siapa pegang state
```

**🎯 Target:** Anda paham bagaimana data bergerak dalam aplikasi dan
di mana state seharusnya "tinggal".

Jika sudah paham → **Buka `06-api-dan-database.md`**
