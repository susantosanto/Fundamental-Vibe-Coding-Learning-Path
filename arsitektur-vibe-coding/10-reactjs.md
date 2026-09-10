# ⚛️ Modul 10: ReactJS — Frontend Library Terpopuler

> **React adalah "mesin lego" yang membuat komponen UI. Ini fondasi Next.js.**
> Waktu: ~3-4 jam | Level: 🟡 Intermediate | Lanjutan dari: Modul 4-5 (komponen & state)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu React & kenapa dipakai di mana-mana
✅ JSX: cara React menulis HTML di dalam JavaScript
✅ Hooks penting: useState, useEffect
✅ Event, form, conditional rendering, list
✅ Fetch data dari API + loading/error state
```

---

## 🧠 10.1 APA ITU REACT?

React = **library JavaScript untuk membangun antarmuka (UI)**.
Dibuat oleh Facebook (Meta). Dipakai oleh: Instagram, WhatsApp Web,
dan jutaan aplikasi lain.

```text
KENAPA REACT POPULER?

1. KOMPONEN (Anda sudah belajar di Modul 4!)
   → UI dipecah jadi lego yang dipakai ulang

2. DEKLARATIF
   → Anda bilang "MAU apa", React yang urus "BAGAIMANA"
   → "Kalau tombol diklik, tampilkan daftar" — React urus sisanya

3. VIRTUAL DOM (versi cepat dari DOM)
   → DOM = struktur halaman di browser
   → React menyimpan "fotokopi" DOM dan hanya update bagian yang berubah
   → Aplikasi tetap cepat walau banyak data

4. EKOSISTEM RAKSASA
   → Ribuan library siap pakai (router, form, chart, dll)
   → Banyak lowongan kerja
```

### React vs HTML/CSS/JS Biasa (yang Anda pelajari di prompting-fundamental)

```text
HTML/CSS/JS BIASA (fase-5/6):       REACT:
┌──────────────────────────┐        ┌──────────────────────────┐
│ index.html (statis)      │        │ app.jsx (dinamis)        │
│ + style.css              │        │ function App() {         │
│ + app.js (manual DOM)    │        │   return <Tombol/>       │
│                          │        │ }                        │
│ Ubah 1 tempat → cari     │        │ Ubah komponen →          │
│ manual di banyak file    │        │ semua tempat ikut        │
└──────────────────────────┘        └──────────────────────────┘
```

> 🎯 **Posisi React di roadmap Anda:**
> React = frontend saja. NodeJS = backend. NextJS = keduanya.
> Laravel = alternatif full-stack (PHP). Semua akan Anda pelajari!

---

## 🧠 10.2 MEMBUAT PROYEK REACT PERTAMA

Ada 2 cara umum: **Vite** (modern, cepat — disarankan) atau **Create React App** (mulai ditinggalkan).

### Cara Setup (boleh minta AI)

```text
Buat proyek React baru dengan Vite bernama [nama-proyek]:
1. npm create vite@latest [nama-proyek] -- --template react
2. cd [nama-proyek] && npm install
3. npm run dev
4. Jelaskan struktur folder yang dibuat & cara membukanya di browser.
Saya pemula, pandu langkah demi langkah.
```

**Struktur folder Vite + React:**

```text
nama-proyek/
├── src/                    ← SEMUA kode React
│   ├── main.jsx            ← Titik masuk (render App ke halaman)
│   ├── App.jsx             ← Komponen utama
│   ├── index.css           ← Styling global
│   └── components/         ← Komponen lego (buat manual)
├── index.html              ← Kerangka HTML (jangan banyak diubah)
├── package.json            ← Daftar bahan
└── vite.config.js          ← Pengaturan Vite
```

> 💡 **Bedakan:** di Vite, kode React ada di `src/`.
> Di Next.js (Modul 12), kode ada di `app/` + `components/`.

---

## 🧠 10.3 JSX: HTML DI DALAM JAVASCRIPT

**JSX** = sintaks yang membiarkan Anda menulis HTML langsung di JavaScript.

```jsx
// File: src/App.jsx
function App() {
  const nama = "Budi";

  // JSX: campuran HTML + JavaScript (pakai {kurung kurawal})
  return (
    <div>
      <h1>Halo, {nama}!</h1>       {/* {nama} = sisipkan variable JS */}
      <p>Selamat belajar React.</p>
    </div>
  );
}

export default App;
```

> 💡 **Catatan akurasi (verifikasi dari react.dev):**
> - React dibuat & dikembangkan oleh **Meta (sebelumnya Facebook)** dan
>   dipakai Instagram, WhatsApp Web, dll.
> - **Create React App (CRA) sudah tidak disarankan** oleh tim React.
>   Gunakan Vite (seperti modul ini) atau framework (Next.js, Remix).
> - Istilah "Virtual DOM" sudah jarang dipakai dokumentasi React modern
>   (react.dev lebih suka menjelaskan render/commit phase). Konsepnya tetap
>   sama untuk pemula: React hanya memperbarui bagian yang berubah.

### Aturan JSX yang Perlu Anda Tahu

```jsx
// 1. Satu komponen return SATU elemen pembungkus
return (
  <div>
    <h1>Judul</h1>
    <p>Isi</p>
  </div>
);
// atau pakai fragment: <> ... </>

// 2. Class HTML → className (karena class = kata kunci JS)
<div className="kartu">...</div>

// 3. Event → onClick, onChange (camelCase)
<button onClick={handleKlik}>Klik</button>

// 4. Menampilkan data → pakai { }
<h2>{totalHarga}</h2>
```

---

## 🧠 10.4 HOOKS: useState & useEffect

**Hooks** = function khusus React yang "menempelkan" fitur ke komponen.
Dua yang paling penting:

### useState — Menyimpan Data yang Berubah (sudah di Modul 5)

```jsx
import { useState } from "react";

function Counter() {
  const [jumlah, setJumlah] = useState(0); // state awal: 0

  return (
    <div>
      <p>Jumlah: {jumlah}</p>
      <button onClick={() => setJumlah(jumlah + 1)}>Tambah</button>
    </div>
  );
}
```

### useEffect — Menjalankan Sesuatu Saat Komponen "Hidup"

```jsx
import { useState, useEffect } from "react";

function DataKelas() {
  const [data, setData] = useState([]);

  // useEffect: jalankan sekali saat komponen pertama kali tampil
  useEffect(() => {
    fetch("https://api.contoh.com/siswa")
      .then((res) => res.json())
      .then((hasil) => setData(hasil));
  }, []); // [] = jalankan SEKALI saja saat komponen dimuat

  return <ul>{data.map((d) => <li key={d.id}>{d.nama}</li>)}</ul>;
}
```

### Analogi Hooks

```text
useState   = PAPAN TULIS di kelas
             (simpan & ubah "ingatan" komponen)

useEffect  = PENGUMUMAN saat kelas dimulai
             (jalankan tugas saat komponen muncul/muncul kembali)

props      = BEKAL dari induk (sudah dipelajari Modul 4)
```

---

## 🧠 10.5 EVENT, FORM, CONDITIONAL, LIST

### Event & Form (paling sering dipakai)

```jsx
import { useState } from "react";

function FormSiswa() {
  const [nama, setNama] = useState("");
  const [terkirim, setTerkirim] = useState(false);

  function handleSubmit(e) {
    e.preventDefault(); // cegah halaman reload
    setTerkirim(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Nama siswa"
      />
      <button type="submit">Simpan</button>

      {/* CONDITIONAL: tampil hanya jika terkirim */}
      {terkirim && <p>✅ Data {nama} terkirim!</p>}
    </form>
  );
}
```

### List (daftar data)

```jsx
function DaftarSiswa() {
  const siswa = [
    { id: 1, nama: "Budi" },
    { id: 2, nama: "Siti" },
    { id: 3, nama: "Andi" },
  ];

  return (
    <ul>
      {siswa.map((s) => (
        <li key={s.id}>{s.nama}</li>  // key = wajib untuk daftar
      ))}
    </ul>
  );
}
```

> 💡 **Kenapa `key` wajib? (sumber: react.dev/learn/rendering-lists)**
> `key` membantu React mengidentifikasi item mana yang berubah,
> ditambah, atau dihapus saat daftar di-render ulang. Tanpa `key`,
> React bisa salah menampilkan state saat urutan data berubah.
>
> **Controlled components:** pada form React, nilai input disimpan di
> state (via `value` + `onChange`) — state menjadi "sumber kebenaran"
> tunggal untuk form.

---

## 🧠 10.6 FETCH DATA + LOADING + ERROR (Pola Penting)

Aplikasi nyata selalu butuh pola ini. **Hafalkan pola pikirnya:**

```jsx
import { useState, useEffect } from "react";

function DataDariApi() {
  const [data, setData] = useState(null);   // data kosong dulu
  const [memuat, setMemuat] = useState(true); // mulai = memuat
  const [error, setError] = useState(null);   // error kosong

  useEffect(() => {
    fetch("/api/siswa")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data");
        return res.json();
      })
      .then((hasil) => {
        setData(hasil);
        setMemuat(false);
      })
      .catch((err) => {
        setError(err.message);
        setMemuat(false);
      });
  }, []);

  // TIGA KONDISI: memuat / error / sukses
  if (memuat) return <p>⏳ Memuat...</p>;
  if (error) return <p>❌ Error: {error}</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

> 🎯 **Ini pola yang sama yang Anda lihat di Modul 5-6 — sekarang versi
> React murni.** Di Next.js (Modul 12), sebagian jadi lebih mudah
> karena server component.

---

## 🤖 10.7 TEMPLATE PROMPT REACT

### Prompt 1: Buat Komponen + Ajarkan

```text
Di proyek React (Vite) saya, buat komponen [nama] di src/components/.

SPESIFIKASI:
- Fungsi: [deskripsi]
- Props: [daftar]
- State yang dipakai (jika ada): [daftar + nilai awal]
- Data dari API (jika ada): [endpoint]

TAMPILAN:
[deskripsi tampilan — modern, bersih]

ATURAN:
- Gunakan komponen kecil, satu tugas
- Pola loading/error/sukses untuk data dari API
- Beri komentar singkat untuk saya belajar

SETELAH kode jadi, jelaskan:
1. Hook apa yang dipakai dan kenapa
2. Diagram alur data (props turun, event naik)
```

### Prompt 2: Refactor Halaman Jadi Komponen

```text
Baca src/App.jsx (dan file lain di src/). Halaman ini terlalu besar.

Pecah menjadi komponen-komponen di src/components/:
1. Satu komponen satu tugas
2. Komponen umum → src/components/ui/
3. Komponen khusus → src/components/features/
4. Data dikirim lewat props, event naik ke induk

Jelaskan rencanamu dulu (daftar komponen + props), saya setujui dulu.
```

### Prompt 3: Debug React

```text
Saya punya komponen React yang bermasalah:
- File: [path]
- Gejala: [apa yang terjadi / tidak terjadi]
- Sudah dicoba: [langkah yang sudah dicoba]

Tempelkan kode jika perlu, analisis, dan perbaiki.
Jelaskan penyebabnya dengan bahasa sederhana.
```

---

## 🏗️ 10.8 PRAKTIK

### Latihan 1: Komponen Counter + Form (30 menit)

```text
Buat di src/App.jsx (pecah jadi komponen):
1. Counter — tombol + / - / reset
2. FormSiswa — input nama, submit, tampilkan pesan sukses
3. DaftarSiswa — daftar statis pakai .map()
```

### Latihan 2: Ambil Data dari API Dummy (45 menit)

```text
Buat komponen yang mengambil data dari API publik:
https://jsonplaceholder.typicode.com/users

1. Tampilkan daftar nama user (loading state dulu)
2. Klik nama → tampilkan detail (email, telepon)
3. Kalau API gagal → tampilkan pesan error

Pakai pola: memuat / error / sukses.
```

### Latihan 3: Aplikasi Mini — Daftar Tugas (60 menit)

```text
Bangun aplikasi to-do list dengan React murni:

FITUR:
1. Tambah tugas (input + tombol)
2. Tandai selesai (centang → coret)
3. Hapus tugas
4. Hitung jumlah tugas tersisa

STRUKTUR:
- src/components/TodoApp.jsx (induk, pegang state)
- src/components/TodoForm.jsx (input + tambah)
- src/components/TodoList.jsx (daftar)
- src/components/TodoItem.jsx (1 tugas + aksi)

POLA: state di induk, props turun, event naik.
```

---

## 🧠 10.9 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **React** | Library UI berbasis komponen |
| **JSX** | HTML di dalam JavaScript |
| **useState** | Simpan & ubah "ingatan" komponen |
| **useEffect** | Jalankan tugas saat komponen hidup |
| **Event & Form** | onClick, onChange, onSubmit |
| **Conditional & List** | {kondisi && ...}, array.map() |
| **Fetch** | Pola memuat / error / sukses |

### Checklist

```
☐ Proyek React (Vite) jalan di browser
☐ Bisa menulis komponen dengan JSX
☐ Paham useState & useEffect
☐ Bisa buat form + event handling
☐ Bisa render daftar dengan .map()
☐ Bisa fetch data dengan loading/error
☐ To-do list mini selesai & jalan
```

### Ketika Bingung

```text
❓ Error "Cannot read properties of undefined"
   → data belum datang saat render. Cek pola loading/error.

❓ Tombol tidak bereaksi
   → cek: sudah pakai onClick? state diubah dengan setter?

❓ Komponen tidak tampil
   → cek: sudah di-import & dipakai di App.jsx?

❓ Stuck? Tempel error ke AI dengan prompt debugging (10.7)
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **NodeJS** jika sudah bisa:

```
☐ Membuat komponen React dengan props & state
☐ Form + event handling
☐ Fetch data + pola loading/error
☐ Aplikasi to-do list mini jalan
```

> **Ingat:** React di sini = frontend. Sekarang kita belajar bagian
> belakangnya (backend) di **Modul 11: NodeJS**!

---

## 📚 SUMBER & REFERENSI RESMI (modul 10)

| Topik | Dokumentasi resmi |
|-------|-------------------|
| Mulai proyek React | https://react.dev/learn/start-a-new-project |
| Rendering lists & key | https://react.dev/learn/rendering-lists |
| Conditional rendering | https://react.dev/learn/conditional-rendering |
| Responding to events | https://react.dev/learn/responding-to-events |
| useState & useEffect | https://react.dev/reference/react/useState , https://react.dev/reference/react/useEffect |
| You Might Not Need an Effect | https://react.dev/learn/you-might-not-need-an-effect |
| Vite | https://vitejs.dev/guide/ |

---

**📂 Lanjut ke: `11-nodejs.md`**
