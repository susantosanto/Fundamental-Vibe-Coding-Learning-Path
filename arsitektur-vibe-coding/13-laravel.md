# 🐘 Modul 13: Laravel — PHP Framework untuk Aplikasi Web

> **Laravel = framework PHP paling populer. Banyak dipakai untuk sistem sekolah & instansi.**
> Waktu: ~5-6 jam | Level: 🟡 Intermediate | Prasyarat: paham konsep CRUD & MVC

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Dasar PHP: bahasa di balik Laravel (cepat!)
✅ Apa itu Laravel & MVC
✅ Instalasi & struktur folder Laravel
✅ Routing, Controller, Blade (tampilan)
✅ Eloquent ORM (database tanpa SQL manual)
✅ Artisan: "asisten" Laravel
```

---

## 🧠 13.1 DASAR PHP (PEMANASAN 30 MENIT)

PHP = bahasa server-side yang sudah ada sejak 1995. Laravel dibangun di atasnya.

### Sintaks Paling Penting (untuk bisa "baca" Laravel)

```php
<?php
// 1. Variable — mulai dengan $
$nama = "Budi";
$umur = 25;

// 2. Array (seperti di JS)
$siswa = ["Budi", "Siti", "Andi"];
$profil = ["nama" => "Budi", "umur" => 25];

// 3. Condition
if ($umur >= 17) {
    echo "$nama sudah dewasa";
} else {
    echo "$nama masih di bawah umur";
}

// 4. Loop
foreach ($siswa as $s) {
    echo $s . "\n";
}

// 5. Function
function sapa($nama) {
    return "Halo, $nama!";
}
echo sapa("Siti");
?>
```

### Perbedaan PHP vs JavaScript (yang perlu Anda tahu)

| Aspek | JavaScript | PHP |
|-------|-----------|-----|
| Variabel | `let nama` | `$nama` |
| String gabung | `"a" + "b"` | `"a" . "b"` (titik!) |
| Array | `[1,2,3]` | `[1,2,3]` (mirip) |
| Object | `{a:1}` | `["a" => 1]` (panah) |
| Function | `function a() {}` | `function a() {}` (mirip) |

> 💡 **Tips:** Jangan pelajari PHP dalam-dalam dulu! Cukup bisa
> "membaca" sintaksnya. Laravel menyembunyikan banyak detail PHP.

---

## 🧠 13.2 APA ITU LARAVEL & MVC?

**Laravel** = framework PHP yang menyediakan "kerangka restoran" lengkap.
Pola arsitekturnya disebut **MVC**:

```text
MVC = Model - View - Controller

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ROUTE      │────▶│  CONTROLLER │────▶│  MODEL      │
│  (peta      │     │  (dapur:    │     │  (gudang:   │
│   alamat)   │     │   logika)   │     │   database) │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  VIEW       │
                    │  (ruang     │
                    │   makan:    │
                    │   tampilan) │
                    └─────────────┘
```

| Bagian | Peran | Analogi |
|--------|-------|---------|
| **Route** | Memetakan URL ke controller | Daftar meja restoran |
| **Controller** | Logika bisnis | Dapur (masak) |
| **Model** | Bicara dengan database | Gudang bahan |
| **View (Blade)** | Tampilan HTML | Sajian di piring |

> 🎯 **Bandingkan:** MVC Laravel ≈ arsitektur yang sudah Anda pelajari!
> Route = App Router, Controller = route handler, Model = Prisma,
> View = komponen tampilan.

---

## 🧠 13.3 INSTALASI LARAVEL

### Prasyarat

```text
1. PHP ≥ 8.2 terpasang (cek: php --version)
   → Laravel 11 & 12 MEWAJIBKAN PHP 8.2+ (dokumentasi resmi laravel.com)
2. Composer terpasang (pengelola paket PHP — seperti npm)
   (cek: composer --version)
3. Node.js (untuk asset) — sudah punya
```

> 💡 **Kalau `php --version` masih menampilkan versi lama (mis. 8.1):**
> Laravel 11/12 tidak akan jalan. Install PHP 8.2+ dulu (minta AI
> pandu sesuai OS Anda), lalu ulangi cek.

Kalau belum ada → minta AI pandu install.

### Membuat Proyek Laravel

```bash
composer create-project laravel/laravel nama-proyek
cd nama-proyek
php artisan serve
# buka http://localhost:8000 (port default Laravel dev server)
```

> 💡 **Port default `php artisan serve` = 8000** (bukan 3000 seperti
> Next.js). Kalau bentrok, ganti dengan: `php artisan serve --port=9000`
> atau `--host=0.0.0.0` untuk bisa diakses dari perangkat lain.

### Struktur Folder Penting

```text
nama-proyek/
├── routes/
│   └── web.php              ← Daftar route (peta alamat)
├── app/
│   ├── Http/Controllers/    ← Controller (dapur)
│   ├── Models/              ← Model (gudang database)
│   └── ...
├── database/
│   ├── migrations/          ← "Cetak biru" tabel database
│   └── seeders/             ← Data contoh
├── resources/
│   └── views/               ← View Blade (tampilan)
├── public/                  ← File yang bisa diakses publik
└── .env                     ← Konfigurasi & rahasia
```

> 💡 **artisan = "asisten" Laravel.** Perintah penting:
> ```bash
> php artisan serve         # jalankan server
> php artisan make:controller NamaController
> php artisan make:model Buku -m
> php artisan migrate       # buat tabel database
> php artisan list          # lihat semua perintah
> ```

---

## 🧠 13.4 ROUTE & CONTROLLER

### Route (di routes/web.php)

```php
<?php
use App\Http\Controllers\BukuController;
use Illuminate\Support\Facades\Route;

// Halaman utama
Route::get('/', function () {
    return view('welcome');
});

// CRUD buku — "resource" = otomatis buat 7 route standar!
Route::resource('buku', BukuController::class);
```

Perintah `Route::resource` membuat otomatis:

```text
GET    /buku          → index   (daftar semua)
GET    /buku/create   → create  (form tambah)
POST   /buku          → store   (simpan baru)
GET    /buku/{id}     → show    (detail 1)
GET    /buku/{id}/edit→ edit    (form ubah)
PUT    /buku/{id}     → update  (simpan ubah)
DELETE /buku/{id}     → destroy (hapus)
```

### Controller

```bash
php artisan make:controller BukuController --resource
```

```php
<?php
namespace App\Http\Controllers;

use App\Models\Buku;
use Illuminate\Http\Request;

class BukuController extends Controller
{
    // index: ambil semua buku
    public function index()
    {
        $buku = Buku::all(); // Model = bicara ke database
        return view('buku.index', compact('buku'));
    }

    // store: simpan buku baru
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
        ]);

        Buku::create($request->all());
        return redirect()->route('buku.index');
    }
}
```

---

## 🧠 13.5 BLADE: TEMPLATE TAMPILAN LARAVEL

**Blade** = mesin template Laravel. Tampilan = file `.blade.php` yang
bisa mencampur HTML + PHP.

```blade
{{-- resources/views/buku/index.blade.php --}}
@extends('layouts.app')

@section('konten')
<h1>Daftar Buku</h1>

<ul>
    @foreach ($buku as $b)
        <li>{{ $b->judul }} — {{ $b->penulis }}</li>
    @endforeach
</ul>

@if (count($buku) === 0)
    <p>Belum ada buku.</p>
@endif
@endsection
```

### Sintaks Blade Cepat

| Blade | Arti |
|-------|------|
| `{{ $nama }}` | Tampilkan variable (otomatis aman dari XSS) |
| `@if ... @endif` | Condition |
| `@foreach ... @endforeach` | Loop |
| `@extends` / `@section` | Layout bersama |
| `@csrf` | Token keamanan form (wajib di form!) |

---

## 🧠 13.6 ELOQUENT ORM: DATABASE TANPA SQL MANUAL

**Eloquent** = cara Laravel bicara dengan database, tanpa menulis SQL.

### Model + Migration

```bash
php artisan make:model Buku -m
# -m = sekaligus buat migration (cetak biru tabel)
```

```php
// app/Models/Buku.php
class Buku extends Model
{
    // field yang boleh diisi (whitelist)
    protected $fillable = ['judul', 'penulis', 'kategori', 'stok'];
}
```

```php
// database/migrations/xxxx_create_bukus_table.php
Schema::create('bukus', function (Blueprint $table) {
    $table->id();
    $table->string('judul');
    $table->string('penulis');
    $table->string('kategori');
    $table->integer('stok')->default(1);
    $table->timestamps(); // created_at & updated_at otomatis
});
```

```bash
php artisan migrate   # jalankan cetak biru → tabel dibuat
```

### Operasi CRUD dengan Eloquent

```php
// CREATE
Buku::create(['judul' => 'Laskar Pelangi', 'penulis' => 'Andrea Hirata']);

// READ (semua)
$buku = Buku::all();

// READ (cari)
$buku = Buku::where('kategori', 'Novel')->get();
$satu = Buku::find(1);

// UPDATE
$buku = Buku::find(1);
$buku->update(['stok' => 5]);

// DELETE
$buku->delete();
```

> 🎯 **Bandingkan dengan Prisma (Modul 6):** `Buku::all()` ≈
> `prisma.buku.findMany()` — keduanya ORM, menyembunyikan SQL.

---

## 🧠 13.7 AUTHENTICATION LARAVEL (Breeze)

Laravel punya paket auth siap pakai:

```bash
composer require laravel/breeze --dev
php artisan breeze:install
php artisan migrate
npm install && npm run build
```

Hasilnya: halaman login, register, logout, dan protected routes
langsung jadi. (Ini yang di Modul 8 "ditunda" — sekarang bisa!)

---

## 🤖 13.8 TEMPLATE PROMPT LARAVEL

### Prompt 1: CRUD Lengkap

```text
Di proyek Laravel saya, buat CRUD untuk entitas [entitas]
(misal: Buku dengan field judul, penulis, kategori, stok).

LANGKAH:
1. php artisan make:model [Entitas] -m (model + migration)
2. Isi migration dengan field yang tepat
3. php artisan make:controller [Entitas]Controller --resource
4. Isi controller: index, create, store, show, edit, update, destroy
5. Route::resource('[entitas]', ...) di routes/web.php
6. Buat view Blade di resources/views/[entitas]/:
   - index.blade.php (daftar + tombol aksi)
   - create.blade.php (form tambah)
   - edit.blade.php (form ubah)
7. Validasi field wajib di store & update
8. Gunakan @csrf di semua form

Jelaskan setiap langkah sebelum menjalankan. Saya pemula Laravel.
```

### Prompt 2: Ajarkan Perbedaan dengan NextJS

```text
Saya sudah belajar Next.js (App Router + route handler + Prisma).
Sekarang belajar Laravel. Jelaskan perbandingannya:

| Konsep | Next.js | Laravel |
|--------|---------|---------|
| Halaman | app/page.tsx | resources/views/...blade.php |
| API | app/api/...route.ts | routes/api.php + controller |
| Database | Prisma | Eloquent |
| Migrasi | prisma migrate | php artisan migrate |
| Auth | (belum) | Breeze |

Beri juga 3 contoh langsung: buat halaman daftar buku di kedua
framework (kode perbandingan).
```

### Prompt 3: Debug Laravel

```text
Saya mendapat error di Laravel:

[tempel error]

File terkait: [path]
Perintah yang saya jalankan: [perintah]

Jelaskan arti error dengan bahasa sederhana + solusi langkah demi
langkah. (Catatan umum: jalankan php artisan config:clear jika
perubahan .env tidak terbaca.)
```

---

## 🏗️ 13.9 PRAKTIK

### Latihan 1: Setup + Hello World (30 menit)

```text
1. Buat proyek Laravel (php artisan serve berjalan)
2. Ubah halaman utama menjadi "Aplikasi Perpustakaan Sekolah"
3. Coba beberapa route: /, /about, /halaman-acak (404)
```

### Latihan 2: CRUD Buku Lengkap (90 menit)

```text
Gunakan Prompt 1 (13.8) untuk membuat CRUD Buku:
1. Model Buku + migration (judul, penulis, kategori, stok)
2. Controller resource lengkap
3. View Blade: index (daftar), create, edit
4. Validasi & @csrf di form

Tes: tambah 3 buku, edit, hapus — semua harus bekerja.
```

### Latihan 3: Refleksi Ekosistem (15 menit)

```text
Jawab dengan jujur:

1. Apa yang SULIT dari Laravel dibanding Next.js? Kenapa?
2. Apa yang MUDAH/MENYENANGKAN?
3. Kapan menurut Anda sebaiknya pakai Laravel?
   (petunjuk: sistem sekolah, instansi, proyek pemerintah)
4. Kapan sebaiknya pakai Next.js? (petunjuk: startup, SaaS, modern)
```

---

## 🧠 13.10 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **PHP** | Bahasa server-side (baca sintaksnya saja dulu) |
| **Laravel** | Framework PHP dengan pola MVC |
| **Route** | Peta alamat (Route::resource = otomatis CRUD) |
| **Controller** | Logika bisnis |
| **Model** | Bicara ke database (Eloquent ORM) |
| **Blade** | Template tampilan ({{ }}, @if, @foreach) |
| **Migration** | Cetak biru tabel database |
| **Artisan** | Asisten perintah Laravel |

### Checklist

```
☐ PHP & Composer terpasang
☐ Proyek Laravel jalan (php artisan serve)
☐ CRUD Buku lengkap & teruji
☐ Paham MVC (Route → Controller → Model → View)
☐ Bisa "membaca" sintaks PHP
☐ Bisa bandingkan Laravel vs Next.js
```

### Ketika Bingung

```text
❓ Error "Class not found"
   → cek namespace & nama class (huruf besar!)

❓ Form tidak bisa submit (419 error)
   → lupa @csrf di dalam form!

❓ Perubahan .env tidak terbaca
   → php artisan config:clear

❓ Tabel belum ada
   → jalankan php artisan migrate

❓ Stuck? Tempel error ke AI dengan Prompt Debug (13.8)
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **SQLite** jika sudah bisa:

```
☐ CRUD Laravel berfungsi (model, controller, view)
☐ Paham MVC secara umum
☐ Bisa bandingkan Laravel & Next.js
```

> **Ingat:** Anda sekarang punya 2 ekosistem di tangan: JavaScript
> (React/Node/Next) dan PHP (Laravel). Berikutnya kita pelajari
> "gudang" di balik semuanya: **Modul 14: SQLite**!

---

---

## 📚 SUMBER & REFERENSI RESMI (modul 13)

| Topik | Dokumentasi resmi |
|-------|-------------------|
| Instalasi Laravel & persyaratan server (PHP 8.2+) | https://laravel.com/docs/installation |
| Struktur folder | https://laravel.com/docs/structure |
| Routing | https://laravel.com/docs/routing |
| Controllers (resource) | https://laravel.com/docs/controllers#resource-controllers |
| Blade templates | https://laravel.com/docs/blade |
| Eloquent ORM | https://laravel.com/docs/eloquent |
| Migrations | https://laravel.com/docs/migrations |
| Starter kits (Breeze dll.) | https://laravel.com/docs/starter-kits |

> 💡 **Catatan akurasi (verifikasi dari laravel.com):**
> - Laravel 11 & 12 **mewajibkan PHP ≥ 8.2** (bukan 8.1).
> - `php artisan serve` default port **8000**.
> - `Route::resource` membuat otomatis 7 route: index, create, store,
>   show, edit, update, destroy.
> - `{{ }}` di Blade otomatis escape (aman dari XSS); `{!! !!}` = tampil
>   mentah (hati-hati). `@csrf` wajib di form POST untuk proteksi CSRF.
> - `$fillable` = daftar field yang boleh di-mass-assign (pengaman).
> - Auth lengkap (login/register): pakai starter kit **Laravel Breeze**.

**📂 Lanjut ke: `14-sqlite.md`**
