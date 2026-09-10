# ▲ Modul 12: NextJS — Full-Stack Framework dari React

> **NextJS menggabungkan React (frontend) + NodeJS (backend) dalam SATU framework.**
> Waktu: ~3-4 jam | Level: 🟡 Intermediate | Lanjutan dari: Modul 3, 6, 10, 11

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu NextJS & kenapa "full-stack"
✅ App Router dalam: page, layout, route handler
✅ Server Component vs Client Component (mendalam)
✅ Data fetching: fetch di server, revalidation
✅ Kenapa NextJS "restoran satu atap"
```

---

## 🧠 12.1 APA ITU NEXTJS?

**NextJS** = framework yang dibangun DI ATAS React, menambahkan fitur
yang React tidak punya:

```text
REACT (Modul 10):               NEXTJS (Modul ini):
┌──────────────────────┐        ┌──────────────────────────┐
│ Frontend SAJA        │        │ Full-stack               │
│ Butuh server terpisah│        │ Frontend + Backend +     │
│ untuk API (Express)  │        │ Routing + Deploy mudah    │
└──────────────────────┘        └──────────────────────────┘
```

### Fitur Andalan NextJS

| Fitur | Manfaat |
|-------|---------|
| **App Router** | File = halaman (folder `app/` = URL) |
| **Server Components** | Data diambil di server → cepat & aman |
| **Route Handlers** | API bawaan (`app/api/...`) — tidak perlu Express |
| **Optimasi gambar/font** | Performa otomatis |
| **Deploy mudah** | Vercel: satu klik |

> 🎯 **Posisi di roadmap:** Anda sudah belajar React (10) dan NodeJS (11).
> NextJS = keduanya digabung + banyak fitur ekstra. Ini framework
> utama yang akan Anda pakai untuk proyek akhir.

---

## 🧠 12.2 MEMBUAT PROYEK NEXTJS (revisi Modul 3)

```text
Buat proyek Next.js baru dengan:
npx create-next-app@latest nama-proyek

Pilihan: TypeScript YA | App Router YA | Tailwind YA
```

**Struktur inti (Anda sudah lihat di Modul 3, sekarang lebih dalam):**

```text
nama-proyek/
├── app/
│   ├── layout.tsx          ← Kerangka SEMUA halaman
│   ├── page.tsx            ← Halaman utama (/)
│   ├── globals.css         ← Styling global
│   ├── about/page.tsx      ← Halaman /about (folder = URL)
│   └── api/
│       ├── items/route.ts  ← API /api/items
│       └── items/[id]/route.ts ← API /api/items/123
├── components/             ← Komponen lego (buat manual)
├── lib/                    ← Helper & database
└── public/                 ← Gambar statis
```

**Aturan emas App Router:**

```text
SETIAP FOLDER di dalam app/ = SATU ALAMAT URL

app/page.tsx          →  /
app/about/page.tsx    →  /about
app/api/items/route.ts→  /api/items
```

---

## 🧠 12.3 SERVER vs CLIENT COMPONENT (MENDALAM)

Anda sudah lihat ini di Modul 4. Sekarang kita dalami KENAPA dan KAPAN:

```text
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  SERVER COMPONENT (default) │  │  CLIENT COMPONENT           │
├─────────────────────────────┤  ├─────────────────────────────┤
│ ✅ Diproses di SERVER       │  │ ✅ Berjalan di BROWSER       │
│ ✅ Bisa baca database       │  │ ✅ Bisa onClick/useState     │
│ ✅ API key AMAN (di server) │  │ ✅ Form interaktif           │
│ ✅ JS lebih sedikit → cepat │  │                              │
│ ❌ Tidak bisa onClick       │  │ ⚠️ Kode sampai ke browser    │
│ ❌ Tidak bisa useState      │  │ ⚠️ Jangan taruh API key di sini│
└─────────────────────────────┘  └─────────────────────────────┘
```

### Aturan Praktis

```text
1. Data fetching / baca database  → SERVER component (default) ✅
2. Butuh interaksi (klik, ketik)  → CLIENT component ("use client")
3. Kalau bisa, gunakan SERVER — lebih cepat & aman
```

### Contoh: Server Component Membaca Database

```tsx
// app/page.tsx — SERVER component (default, tanpa "use client")
import { prisma } from "@/lib/db"; // koneksi database

export default async function HalamanUtama() {
  // Langsung baca database — tidak perlu fetch/useEffect!
  const buku = await prisma.buku.findMany();

  return (
    <ul>
      {buku.map((b) => (
        <li key={b.id}>{b.judul}</li>
      ))}
    </ul>
  );
}
```

> 🎯 **Bandingkan dengan React murni (Modul 10):** di React, ambil data
> harus pakai useEffect + loading state. Di NextJS server component,
> tinggal `await` langsung — lebih sederhana!

---

## 🧠 12.4 DATA FETCHING: SERVER vs CLIENT

### Opsi 1: Fetch di Server Component (disarankan)

```tsx
// app/siswa/page.tsx — server component
export default async function HalamanSiswa() {
  const res = await fetch("https://api.sekolah.com/siswa");
  const data = await res.json();

  return <div>{/* render data */}</div>;
}
```

### Opsi 2: Fetch di Client Component (pakai useEffect)

```tsx
"use client"; // butuh interaksi/state

import { useState, useEffect } from "react";

export default function DaftarSiswa() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/siswa").then((r) => r.json()).then(setData);
  }, []);

  return <div>{/* render data */}</div>;
}
```

### Kapan Pilih yang Mana?

```text
SERVER component (fetch langsung):
✅ Halaman yang datanya tidak butuh interaksi user
✅ Halaman publik (profil, berita, daftar)
✅ Lebih cepat (server yang fetch, bukan browser user)

CLIENT component (fetch + state):
✅ Halaman yang butuh input user (form, search, filter)
✅ Data yang berubah sering & interaktif
✅ Perlu loading/error state di UI
```

> 💡 **Pola hibrida (paling umum):** halaman = server component
> (data awal diambil di server), bagian interaktif = client component
> kecil di dalamnya (form, tombol).

---

## 🧠 12.5 ROUTE HANDLER: API DI NEXTJS (revisi Modul 6)

Anda sudah membuat ini di Modul 6. Ringkasnya:

```ts
// app/api/items/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.item.findMany();
  return NextResponse.json({ sukses: true, data: items });
}

export async function POST(request: Request) {
  const body = await request.json();
  // validasi & simpan
  return NextResponse.json({ sukses: true }, { status: 201 });
}
```

```ts
// app/api/items/[id]/route.ts  ← route dinamis
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.item.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ sukses: true });
}
```

---

## 🧠 12.6 LAYOUT, LOADING & NOT-FOUND (Pola UX)

### Layout: kerangka bersama (sudah di Modul 3)

```tsx
// app/layout.tsx — muncul di SEMUA halaman
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <header>Logo & Menu</header>
        <main>{children}</main>  {/* isi halaman berubah-ubah */}
        <footer>Copyright 2026</footer>
      </body>
    </html>
  );
}
```

### Loading & Not Found (otomatis!)

```tsx
// app/loading.tsx — tampil OTOMATIS saat halaman sedang dimuat
export default function Loading() {
  return <p>⏳ Memuat...</p>;
}
```

```tsx
// app/not-found.tsx — tampil OTOMATIS saat halaman tidak ada
export default function NotFound() {
  return <div>404 — Halaman tidak ditemukan</div>;
}
```

> 🎯 **NextJS mengotomatiskan pola loading/error yang di Modul 10
> harus Anda tulis manual dengan useState!**

---

## 🤖 12.7 TEMPLATE PROMPT NEXTJS

### Prompt 1: Buat Halaman + Komponen

```text
Di proyek Next.js saya, buat halaman [nama] di app/[nama]/page.tsx.

SPESIFIKASI:
- Alamat URL: /[nama]
- Data yang ditampilkan: [deskripsi]
- Komponen yang dibutuhkan: [daftar]

ATURAN:
- Halaman = server component (default) — fetch data di server
- Bagian interaktif (form/tombol) = client component di components/features/
- Gunakan komponen ui/ yang sudah ada
- Tambahkan app/[nama]/loading.tsx & not-found.tsx
- Tailwind, rapi, modern

Jelaskan rencanamu dulu, saya setujui dulu, baru tulis kode.
```

### Prompt 2: Pindahkan CRUD dari Express ke NextJS

```text
Saya punya API Express (dari Modul 11) untuk entitas [entitas].
Pindahkan ke Next.js route handler di app/api/[entitas]/route.ts
dan app/api/[entitas]/[id]/route.ts.

Pertahankan:
1. Semua endpoint: GET, POST, PUT, DELETE
2. Validasi input yang sama
3. Format respons yang sama: { sukses, data } / { sukses, pesan }
4. Status code yang sama

Setelah selesai, jelaskan perbedaan cara kerja keduanya.
```

### Prompt 3: Debug NextJS

```text
Saya punya masalah di proyek Next.js:
- Gejala: [apa yang terjadi]
- File: [path]
- Error (jika ada): [tempel]

Periksa: (1) server vs client component yang salah, (2) import yang
salah, (3) masalah async/await, (4) konfigurasi.

Jelaskan penyebab & solusinya dengan bahasa sederhana.
```

---

## 🏗️ 12.8 PRAKTIK

### Latihan 1: Halaman + Route Handler (45 menit)

```text
Di proyek Next.js Anda:
1. Buat route handler /api/items (GET + POST) — data array di memori
2. Buat halaman / yang menampilkan data dari /api/items
   (server component, langsung fetch)
3. Tambahkan app/loading.tsx & app/not-found.tsx
4. Tes di browser: / , /api/items, /halaman-acak (404)
```

### Latihan 2: Ubah to-do list React ke NextJS (60 menit)

```text
Pindahkan to-do list dari Modul 10 (React murni) ke Next.js:

1. app/page.tsx → server component yang ambil data dari /api/tugas
2. components/features/TodoForm.tsx → "use client" (input + tambah)
3. components/features/TodoList.tsx → "use client" (daftar + hapus)
4. app/api/tugas/route.ts → GET + POST
5. app/api/tugas/[id]/route.ts → DELETE

Pola: server untuk data awal, client untuk interaksi.
```

### Latihan 3: Refleksi Perbandingan (15 menit)

```text
Bandingkan 3 cara membuat backend yang sudah Anda pelajari:

| Aspek | Express (11) | NextJS route handler (12) |
|-------|-------------|---------------------------|
| Cara buat route | ... | ... |
| Butuh server terpisah? | ... | ... |
| Hubungan dgn frontend | ... | ... |

Lalu jawab: kapan sebaiknya pakai NextJS murni vs React + Express?
```

---

## 🧠 12.9 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **NextJS** | Full-stack framework dari React |
| **App Router** | Folder = URL, file = halaman |
| **Server Component** | Default — fetch di server |
| **Client Component** | "use client" — interaktif |
| **Route Handler** | API bawaan di app/api/ |
| **layout/loading/not-found** | UX otomatis |

### Checklist

```
☐ Proyek Next.js jalan (sudah sejak Modul 3)
☐ Bisa bedakan server vs client component
☐ Halaman mengambil data di server component
☐ Route handler GET/POST berfungsi
☐ to-do list dipindah ke Next.js & jalan
☐ loading.tsx & not-found.tsx bekerja
```

### Ketika Bingung

```text
❓ "useState" error di server component
   → komponen punya "use client" di paling atas file

❓ Data tidak muncul di halaman
   → cek: apakah server component benar-benar await fetch?

❓ Route /api/items/123 tidak ketemu
   → file harus bernama [id]/route.ts (kurung siku!)

❓ Error "prisma is not defined"
   → lib/db.ts belum dibuat / import salah
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **Laravel** jika sudah bisa:

```
☐ Halaman Next.js dengan data dari route handler
☐ Server & client component dipakai dengan tepat
☐ to-do list full-stack jalan di Next.js
☐ Paham kenapa NextJS "restoran satu atap"
```

> **Ingat:** Anda sekarang menguasai ekosistem JavaScript full-stack.
> Laravel (berikutnya) adalah ekosistem PHP yang kuat di industri —
> bagus untuk proyek sekolah & instansi!

---

## 📚 SUMBER & REFERENSI RESMI (modul 12)

| Topik | Dokumentasi resmi |
|-------|-------------------|
| Install create-next-app | https://nextjs.org/docs/app/api-reference/cli/create-next-app |
| Routing (App Router) | https://nextjs.org/docs/app/building-your-application/routing |
| Server & Client Components | https://nextjs.org/docs/app/building-your-application/rendering/server-components |
| Route Handlers | https://nextjs.org/docs/app/building-your-application/routing/route-handlers |
| Dynamic routes [id] | https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes |
| Layouts & Pages | https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts |

> 💡 **Catatan akurasi (verifikasi dari nextjs.org):**
> - **App Router** sudah menjadi default di Next.js modern (v14/v15+).
> - **Server Components adalah default**; tambahkan `"use client"` di paling
>   atas file hanya jika butuh interaktivitas (useState, useEffect, onClick).
> - Folder `[id]` (kurung siku) = **dynamic route segment** — nilai dari URL
>   otomatis dikirim sebagai `params` ke route handler / page.
> - `app/loading.tsx` berbasis React Suspense — tampil otomatis saat halaman
>   sedang memuat data. `app/not-found.tsx` = tampilan 404 kustom.

---

**📂 Lanjut ke: `13-laravel.md`**
