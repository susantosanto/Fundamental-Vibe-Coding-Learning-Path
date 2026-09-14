# 04 — TypeScript

> **Minggu 6** · 5 sesi × 1 jam
> **Sebelum ini:** `04-async-event-loop.md`
> **Setelah ini:** `06-bangun-satu-hal.md`

---

## Kenapa TypeScript ada di rencana ini

TypeScript bukan bahasa baru. Ia **JavaScript + pemeriksa tipe** yang bekerja **sebelum** kode dijalankan.

Kenapa itu penting untuk Anda yang mau paham fondasi:

```typescript
function tambah(a: number, b: number): number {
  return a + b;
}

tambah("1", "2");
//     ~~~~~~~~~ Error SEBELUM dijalankan:
//     Argument of type 'string' is not assignable to parameter of type 'number'
```

Di JavaScript biasa:

```javascript
function tambah(a, b) { return a + b; }
tambah("1", "2");     // → "12"   jalan, tanpa error, hasilnya SALAH
```

Anda baru sadar berjam-jam kemudian — dan mungkin sudah telanjur dipakai.

**TypeScript mengoreksi Anda lebih cepat.** Itu kenapa ia bagus untuk belajar: umpan baliknya instan, dan Anda tidak bisa "tidak sadar".

---

## Bagian 1 — Setup (10 menit)

```bash
# Di folder proyek Anda
npm init -y
npm install --save-dev typescript
npx tsc --init
```

Buat file `coba.ts`:

```typescript
function sapa(nama: string): string {
  return "Halo, " + nama;
}

console.log(sapa("Ani"));
```

Jalankan:

```bash
npx tsc coba.ts        # mengubah jadi coba.js
node coba.js
```

**Cara lebih nyaman:** pakai VS Code. Ia memeriksa tipe Anda **sambil Anda mengetik** — garis merah muncul sebelum Anda menjalankan apa pun. Itu pengalaman yang mengubah cara belajar.

---

## Bagian 2 — Tujuh hal yang perlu Anda kuasai

**Jangan pelajari semua fitur TypeScript.** 80% kode nyata cuma butuh 7 hal ini.

### 1. Tipe dasar

```typescript
let nama: string = "Ani";
let umur: number = 12;
let aktif: boolean = true;
let kosong: null = null;
let belumDiisi: undefined = undefined;
```

### 2. Array dan object

```typescript
let daftarNama: string[] = ["Ani", "Budi"];
let nilai: number[] = [80, 90, 100];

let siswa: { nama: string; kelas: string } = {
  nama: "Ani",
  kelas: "6A"
};
```

**Perhatikan:** di dalam tipe object, pemisahnya **titik koma** (`;`), bukan koma. Ini sering bikin pemula bingung.

### 3. Function

```typescript
function hitungRataRata(nilai: number[]): number {
  const total = nilai.reduce((a, b) => a + b, 0);
  return total / nilai.length;
}

// Arrow function
const hitungTotal = (nilai: number[]): number => {
  return nilai.reduce((a, b) => a + b, 0);
};
```

### 4. Interface dan type alias

```typescript
interface Siswa {
  nama: string;
  kelas: string;
  nisn: string;
}

// atau pakai type
type Siswa = {
  nama: string;
  kelas: string;
  nisn: string;
};

function tampilkan(siswa: Siswa): string {
  return `${siswa.nama} - ${siswa.kelas}`;
}
```

**Interface vs type:** untuk pemula, keduanya hampir sama. Pakai `interface` untuk object, `type` untuk yang lain (union, gabungan). Jangan pusing soal ini dulu.

### 5. Union type ← **yang paling berguna**

```typescript
type StatusAbsensi = "hadir" | "sakit" | "izin" | "alpa";

function simpanAbsensi(status: StatusAbsensi) {
  // ...
}

simpanAbsensi("hadir");      // ✅
simpanAbsensi("libur");      // ❌ Error — "libur" bukan salah satu pilihan
```

**Kenapa ini bagus:** Anda tidak perlu mengingat pilihan yang valid. Editor memberi tahu. Dan kalau Anda salah ketik, langsung ketahuan.

Ini pengganti yang jauh lebih baik daripada string bebas.

### 6. Optional property

```typescript
interface Siswa {
  nama: string;
  kelas: string;
  telepon?: string;        // ← tanda tanya = boleh tidak ada
}

const siswa1: Siswa = { nama: "Ani", kelas: "6A" };              // ✅
const siswa2: Siswa = { nama: "Budi", kelas: "6B", telepon: "0812" };  // ✅
```

### 7. Type inference — kapan harus menulis, kapan tidak

```typescript
// ❌ Berlebihan — TypeScript sudah tahu
let nama: string = "Ani";
let umur: number = 12;

// ✅ Biarkan TypeScript menyimpulkan
let nama = "Ani";        // sudah tahu: string
let umur = 12;           // sudah tahu: number

// ✅ Tulis tipe saat TypeScript TIDAK bisa menyimpulkan
function hitungTotal(nilai: number[]): number {   // ← parameter harus ditulis
  return nilai.reduce((a, b) => a + b, 0);
}

// ✅ Tulis tipe untuk data dari luar (API, form)
const data: Siswa = await response.json();
```

**Aturan praktis:** tulis tipe untuk **parameter fungsi** dan **data dari luar**. Biarkan sisanya disimpulkan.

---

## Bagian 3 — TypeScript sebagai alat belajar

Ini bagian yang paling berguna untuk tujuan Anda.

TypeScript memberi tahu Anda **kesalahan berpikir**, bukan hanya kesalahan ketik.

### Contoh 1 — Data yang mungkin tidak ada

```typescript
interface Siswa {
  nama: string;
  kelas?: string;
}

function tampilkanKelas(siswa: Siswa): string {
  return siswa.kelas.toUpperCase();
  //     ~~~~~~~~~~~~ Error: 'siswa.kelas' is possibly 'undefined'
}
```

TypeScript memaksa Anda menghadapi kenyataan yang sering dilupakan: **`kelas` mungkin tidak ada.** Anda harus memutuskan:

```typescript
// Opsi 1: beri nilai default
return (siswa.kelas ?? "belum ditentukan").toUpperCase();

// Opsi 2: tolak lebih awal
if (!siswa.kelas) return "Kelas belum diisi";
return siswa.kelas.toUpperCase();
```

Di JavaScript biasa, Anda baru sadar saat ada siswa yang `kelas`-nya kosong — dan itu mungkin baru ketahuan di produksi.

### Contoh 2 — Return yang tidak konsisten

```typescript
function cariSiswa(nama: string): Siswa {
  const siswa = daftar.find(s => s.nama === nama);
  return siswa;
  //     ~~~~~~ Error: Type 'Siswa | undefined' is not assignable to type 'Siswa'
}
```

Ini **persis** Bug 3 dari Latihan 4 di `03-debugging.md`. Di JavaScript, Anda baru tahu saat crash. Di TypeScript, Anda tahu sebelum menjalankan.

### Contoh 3 — Lupa `await`

```typescript
async function ambilData(): Promise<Siswa> {
  const data = fetch("/api/siswa");     // ← lupa await
  return data;
  //     ~~~~ Error: Type 'Promise<Response>' is not assignable to 'Promise<Siswa>'
}
```

Ini Kesalahan 1 dari `04-async-event-loop.md`. TypeScript menangkapnya untuk Anda.

**Perhatikan polanya:** ketiga contoh di atas adalah bug JavaScript yang sudah Anda pelajari di langkah 1–4. TypeScript menangkap **ketiganya** sebelum kode jalan.

**Tapi perhatikan juga yang TIDAK bisa ditangkap TypeScript:**

```typescript
// Tidak ada error di sini — tapi ini bug
const daftar: number[] = [3, 1, 2];
daftar.sort();                    // ← mengubah array asli (Langkah 1)
```

```typescript
// Tidak ada error di sini — tapi ini stale closure (Langkah 2)
useEffect(() => {
  const id = setInterval(() => console.log(jumlah), 1000);
  return () => clearInterval(id);
}, []);                           // ← deps kosong, `jumlah` terkunci
```

**TypeScript bukan pengganti pemahaman.** Ia menangkap kesalahan **tipe**, bukan kesalahan **berpikir**. Referensi vs nilai dan closure tetap harus Anda pahami sendiri — itulah kenapa Langkah 1 dan 2 ada sebelum langkah ini, bukan sebaliknya.

Itu kenapa TS ada di rencana ini. Ia bukan topik baru — ia **jaring pengaman** untuk apa yang sudah Anda pelajari.

---

## Latihan minggu ini

### Latihan 1 — Ubah kode Anda jadi TypeScript

Ambil satu file JavaScript yang pernah Anda tulis. Ganti namanya jadi `.ts`. Lihat error apa yang muncul.

**Jangan langsung perbaiki semuanya.** Baca satu per satu, dan tanya: *"apakah TypeScript menemukan bug nyata, atau hanya perlu tipe yang lebih jelas?"*

### Latihan 2 — Tulis interface untuk data Anda

Ambil satu struktur data yang Anda pakai (dari API, atau dari database). Tulis interface-nya.

```typescript
interface Absensi {
  siswaId: number;
  tanggal: string;
  status: StatusAbsensi;
}
```

### Latihan 3 — Pakai union type

Ganti semua string bebas yang punya pilihan terbatas dengan union type.

```typescript
// Sebelum
function simpan(status: string) { }

// Sesudah
type StatusAbsensi = "hadir" | "sakit" | "izin" | "alpa";
function simpan(status: StatusAbsensi) { }
```

Ini satu perubahan kecil yang mencegah banyak bug.

### Latihan 4 — Perbaiki tiga error ini

```typescript
interface Barang {
  nama: string;
  harga: number;
  diskon?: number;
}

function hitungHargaAkhir(barang: Barang): number {
  return barang.harga - (barang.harga * barang.diskon / 100);
}

function cariBarang(daftar: Barang[], nama: string): Barang {
  return daftar.find(b => b.nama === nama);
}

async function ambilBarang(id: number): Promise<Barang> {
  const data = fetch(`/api/barang/${id}`);
  return data.json();
}
```

Tiga error, dan ketiganya adalah pola yang sudah Anda pelajari.

<details>
<summary><strong>Jawaban</strong></summary>

**Error 1 — `diskon` mungkin undefined**

```typescript
// ❌ barang.diskon bisa undefined → hasilnya NaN
return barang.harga - (barang.harga * barang.diskon / 100);

// ✅
const diskon = barang.diskon ?? 0;
return barang.harga - (barang.harga * diskon / 100);
```

**Error 2 — `find` bisa mengembalikan undefined**

```typescript
// ❌ return type bilang "selalu Barang", padahal bisa undefined
function cariBarang(daftar: Barang[], nama: string): Barang {
  return daftar.find(b => b.nama === nama);
}

// ✅ Ubah return type untuk mengakui kenyataan
function cariBarang(daftar: Barang[], nama: string): Barang | undefined {
  return daftar.find(b => b.nama === nama);
}
```

**Ini pelajaran desain yang penting:** jangan memaksa tipe agar "terlihat benar". Akui kenyataan bahwa hasilnya mungkin tidak ada, lalu tangani di pemanggil.

**Error 3 — lupa `await`**

```typescript
// ❌
const data = fetch(`/api/barang/${id}`);
return data.json();

// ✅
const response = await fetch(`/api/barang/${id}`);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return await response.json();
```

</details>

---

## Selesai Langkah 5 kalau Anda bisa

- [ ] Menulis interface untuk data yang Anda pakai
- [ ] Memakai union type untuk nilai yang terbatas pilihannya
- [ ] Menjelaskan kenapa `siswa.kelas?.` dan `siswa.kelas!` berbeda
- [ ] Memahami error TS tanpa mencari di Google
- [ ] Menjelaskan kenapa TS menangkap bug yang sudah Anda pelajari di langkah 1–4
- [ ] Menyebutkan satu bug yang **tidak** bisa ditangkap TypeScript

---

## Yang TIDAK perlu Anda pelajari sekarang

```
❌ Generics tingkat lanjut (<T extends ...>)
❌ Conditional types, mapped types
❌ Utility types lengkap (Pick, Omit, Record, Partial, ...)
❌ Decorators
❌ Declaration files (.d.ts)
❌ Konfigurasi tsconfig yang rumit
```

Semua itu berguna nanti. Tapi untuk sekarang, 7 hal di Bagian 2 sudah cukup — dan itu sudah menangkap sebagian besar bug nyata.

**Kalau Anda mulai tersesat di fitur TypeScript, ingat:** tujuan minggu ini adalah **paham fondasi**, bukan menguasai TypeScript sepenuhnya.

---

> **Lanjut ke:** [`06-bangun-satu-hal.md`](./06-bangun-satu-hal.md)
