# 🧩 Modul 4: Komponen & Props (Lego AI)

> **React dibangun dari "lego": komponen kecil yang bisa disusun jadi aplikasi besar.**
> Waktu: ~40 menit | Level: 🟢🟡 Pemula → Intermediate | Lanjutan: `prompting-fundamental/fase-06` (komponen)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu komponen React (dengan analogi lego & ruangan)
✅ Apa itu props = cara "mengirim pesan" antar komponen
✅ Satu komponen satu tugas (lanjutan prinsip fase-4)
✅ Client vs Server component (kapan butuh interaksi)
```

---

## 🧠 4.1 KOMPONEN = LEGO

Ingat di `prompting-fundamental/fase-04`: *"Function = unit kerja kecil,
satu function satu tugas."* Di React, konsep yang sama naik level:

```text
DI HTML/JS biasa (fase-4):
function tambahItem(nama, harga) { ... }   ← function

DI REACT (Next.js):
function KartuItem({ nama, harga }) {      ← KOMPONEN
  return <div>...</div>;                    ← punya tampilan (UI)
}
```

**Komponen = function + tampilan.** Ini seperti lego:

```text
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  LEGO DASAR:                                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ Tombol  │  │  Kartu  │  │  Input  │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                         │
│  DISUSUN JADI APLIKASI:                                 │
│  ┌─────────────────────────────────────────┐           │
│  │  Halaman Belanja                        │           │
│  │  ┌───────────────────────────────────┐  │           │
│  │  │ InputItem   [nama][harga][Tambah] │  │           │
│  │  └───────────────────────────────────┘  │           │
│  │  ┌──────────────┐ ┌──────────────┐     │           │
│  │  │ KartuItem    │ │ KartuItem    │     │           │
│  │  │ Nasi - Rp5rb │ │ Teh - Rp3rb  │     │           │
│  │  └──────────────┘ └──────────────┘     │           │
│  │  Total: Rp8.000                        │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  SETIAP LAGO BISA DIPAKAI ULANG DI BANYAK TEMPAT       │
└─────────────────────────────────────────────────────────┘
```

### Kenapa Komponen Itu Penting?

| Tanpa Komponen | Dengan Komponen |
|---------------|-----------------|
| Semua kode numpuk di 1 file besar | Kode terpisah per bagian |
| Ubah 1 tombol = harus cari di mana-mana | Ubah 1 komponen = semua tempat ikut berubah |
| AI susah memahami kode panjang | AI mudah baca file kecil yang jelas |

> 🎯 **Prinsip: "Satu komponen, satu tugas"** — persis seperti
> "satu function satu tugas" yang sudah Anda pelajari.

---

## 🧠 4.2 PROPS = MENGIRIM PESAN ANTAR LEGO

**Props** (kependekan dari *properties*) = **data yang dikirim dari
komponen induk ke komponen anak**.

```text
Analogi: Orang tua kasih "bekal" ke anak sebelum berangkat sekolah.

<Induk>                           <Anak>
┌──────────────────┐    bekal    ┌──────────────┐
│  HalamanBelanja  │ ─────────▶ │  KartuItem   │
│  punya data:     │  nama=harga│  terima data │
│  item = "Nasi"   │            │  & tampilkan │
└──────────────────┘            └──────────────┘
```

### Contoh Kode Sederhana

```tsx
// components/features/KartuItem.tsx
// KartuItem "menerima bekal" berupa nama dan harga
export default function KartuItem({
  nama,
  harga,
}: {
  nama: string;
  harga: number;
}) {
  return (
    <div className="border rounded p-4">
      <p className="font-bold">{nama}</p>
      <p>Rp {harga.toLocaleString("id-ID")}</p>
    </div>
  );
}
```

```tsx
// app/page.tsx
// HalamanBelanja "memberi bekal" ke KartuItem
import KartuItem from "../components/features/KartuItem";

export default function HalamanBelanja() {
  return (
    <div>
      <KartuItem nama="Nasi Goreng" harga={5000} />
      <KartuItem nama="Es Teh" harga={3000} />
    </div>
  );
}
```

**Lihat polanya?** Komponen yang sama (`KartuItem`) dipakai 2 kali
dengan data berbeda. Itu kekuatan props: **satu komponen, banyak pemakaian.**

> 💡 **Kamu tidak perlu hafal kodenya!** Yang penting paham konsep:
> **Induk memberi props, anak menerima props.** AI yang menulis kodenya.

---

## 🧠 4.3 CLIENT vs SERVER COMPONENT

Ini konsep khusus Next.js yang perlu Anda tahu karena sering bikin bingung:

```text
SERVER COMPONENT (default)          CLIENT COMPONENT
┌──────────────────────────┐        ┌──────────────────────────┐
│  DIPROSES DI SERVER      │        │  BISA INTERAKTIF         │
│  (dapur restoran)        │        │  (di ruang makan)        │
│                          │        │                          │
│  ✅ Membaca database     │        │  ✅ Klik tombol          │
│  ✅ Kecepatan tinggi     │        │  ✅ useState (data)      │
│  ❌ TIDAK bisa onClick   │        │  ✅ Form, input          │
│  ❌ TIDAK bisa useState  │        │                          │
│                          │        │  CARA: taruh di paling   │
│                          │        │  atas file:              │
│                          │        │  "use client"            │
└──────────────────────────┘        └──────────────────────────┘
```

### Aturan Ibu Jari

```text
❓ Komponen yang HANYA menampilkan data (daftar, kartu, teks)?
   → SERVER component (default, tidak usah apa-apa)

❓ Komponen yang BUTUH interaksi (tombol, form, data berubah)?
   → CLIENT component → tambahkan:  "use client"  di atas file
```

> 🎯 **Jangan takut istilah ini.** Intinya satu kalimat:
> **Ada interaksi? → "use client". Cuma tampil? → biarkan default.**
> Dan AI yang akan menambahkannya untuk Anda — Anda cukup memahaminya.

---

## 🤖 4.4 TEMPLATE PROMPT: BIKIN KOMPONEN

### Prompt 1: Buat Komponen Baru

```text
Buat komponen [NamaKomponen] di folder components/[ui|features]/.

SPESIFIKASI:
- Fungsi: [apa yang komponen lakukan]
- Props yang diterima: [nama data] (tipe: [string|number|boolean|array])
- Tampilan: [deskripsi tampilan sederhana]
- Style: gunakan Tailwind, bersih dan modern
- Gunakan TypeScript

CONTOH PENGGUNAAN (supaya AI paham):
<NamaKomponen [prop1]="..." [prop2]={...} />

Jangan lupa:
- Tambahkan "use client" HANYA jika butuh interaksi (onClick/useState)
- Satu komponen, satu tugas
- Beri komentar singkat di kode untuk saya belajar
```

### Prompt 2: Pecah Komponen Besar

```text
Baca file [nama-file].tsx di folder [folder].

Komponen ini terlalu besar dan mengerjakan banyak hal.
Pecah menjadi komponen-komponen kecil dengan aturan:
1. Satu komponen, satu tugas
2. Komponen umum → components/ui/
3. Komponen khusus fitur → components/features/
4. Data dikirim antar komponen memakai props

Beri tahu saya dulu daftar komponen yang akan dibuat,
baru setelah saya setujui, tulis kodenya.
```

### Prompt 3: Ajarkan Saya (pemula)

```text
Saya pemula React. Baca file [nama-file].tsx ini.

Jelaskan dengan bahasa sederhana:
1. Komponen apa saja yang ada di file ini?
2. Props apa yang dikirim antar komponen?
3. Bagian mana yang "client" dan mana yang "server"? Kenapa?
4. Gambarkan dengan diagram teks siapa memberi props ke siapa.
```

---

## 🏗️ 4.5 PRAKTIK

### Latihan 1: Buat 3 Komponen Dasar (15 menit)

```text
Di proyek Next.js Anda, buatkan komponen berikut di components/ui/:

1. Tombol — props: teks, warna (biru/merah), fungsi onClick
2. InputText — props: label, value, placeholder
3. Kartu — props: judul, isi (children)

Semua pakai Tailwind. Beri komentar penjelasan di tiap komponen.
```

### Latihan 2: Susun Jadi Halaman (15 menit)

```text
Sekarang gunakan komponen di atas di app/page.tsx:
1. Satu Kartu dengan judul "Daftar Belanja"
2. Di dalamnya: InputText (nama barang) + Tombol "Tambah"
3. Tombol saat diklik → tampilkan alert("Ditambahkan!")

("use client" dibutuhkan karena ada interaksi klik.)
```

### Latihan 3: Identifikasi (10 menit)

```text
Lihat halaman yang sudah jadi. Jawab:

1. Komponen mana yang bisa dipakai ulang di halaman lain?
2. Kalau ingin menambah "harga barang", props apa yang perlu
   ditambahkan ke InputText?
3. Kenapa komponen Tombol butuh "use client" sedangkan Kartu tidak?
```

<details>
<summary>🔍 Petunjuk jawaban</summary>

1. Tombol, InputText, Kartu — semuanya bisa dipakai ulang.
2. Buat komponen baru khusus input harga (mis. `InputHarga`),
   atau gabungkan form nama + harga jadi satu komponen `FormItem`
   yang mengirim data lengkap ke induknya.
3. Karena Tombol punya interaksi klik (onClick) yang butuh
   JavaScript di browser, sedangkan Kartu cuma menampilkan teks.

</details>

---

## ✅ CHECKLIST MODUL 4

```
☐ Paham komponen = lego (function + tampilan)
☐ Paham props = kirim data dari induk ke anak
☐ Paham prinsip "satu komponen satu tugas"
☐ Paham beda server vs client component ("use client")
☐ 3 komponen dasar sudah dibuat di components/ui/
☐ Halaman utama sudah pakai komponen-komponen itu
```

**🎯 Target:** Anda bisa menyusun halaman dari komponen-komponen kecil,
dan tahu kapan sebuah komponen butuh "use client".

Jika sudah paham → **Buka `05-state-dan-data-flow.md`**
