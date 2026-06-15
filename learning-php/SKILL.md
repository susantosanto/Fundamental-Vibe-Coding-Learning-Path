---
name: learning-php
description: Learning workflow PHP dari fundamental ke advanced — step-by-step untuk web development
---

# Learning PHP — Dari Fundamental ke Web Development

## 📋 Overview
Skill ini adalah learning workflow komprehensif untuk PHP. Mulai dari **nol absolut** sampai **bisa bikin web app dengan database**.

## 🗺️ Learning Path

### Fase 1: Fondasi PHP (Minggu 1)
**Target:** Bisa menulis script PHP dasar

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Apa itu PHP?** | Setup XAMPP/Laragon, run PHP file, `<?php ?>` |
| 2 | **Variables & Types** | `$var`, string, int, float, bool, array, null |
| 3 | **Strings & Concatenation** | `.` operator, `""` vs `''`, `echo`, `print` |
| 4 | **Arrays** | Indexed, associative, multidimensional |
| 5 | **Operators** | Aritmatika, perbandingan, logika, `===` vs `==` |
| 6 | **Conditionals** | `if/elseif/else`, `switch`, ternary |
| 7 | **Loops** | `for`, `foreach`, `while` |
| 8 | **Functions** | `function`, parameters, return, scope, `global` |

**🚀 Mini Project:** Form calculator, Simple counter

### Fase 2: Web Dasar (Minggu 2-3)
**Target:** Bisa bikin web dinamis sederhana

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Superglobals** | `$_GET`, `$_POST`, `$_SERVER`, `$_SESSION` |
| 2 | **Form Handling** | Method GET/POST, validation, sanitization |
| 3 | **Include & Require** | Modular code, `include_once`, `require_once` |
| 4 | **Sessions & Cookies** | `session_start()`, set/get/destroy session |
| 5 | **File Handling** | `fopen`, `fwrite`, `fread`, `file_get_contents` |
| 6 | **Date & Time** | `date()`, `time()`, `strtotime()` |

**🚀 Mini Project:** Contact form, Simple login system

### Fase 3: Database (Minggu 3-4)
**Target:** Bisa bikin CRUD app dengan database

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **MySQL Dasar** | CREATE TABLE, INSERT, SELECT, UPDATE, DELETE |
| 2 | **PDO (PHP Data Objects)** | Connect, prepared statements, fetch |
| 3 | **CRUD Operations** | Create Read Update Delete dengan database |
| 4 | **Relationships** | Foreign keys, JOINs (INNER, LEFT) |
| 5 | **Search & Pagination** | `LIKE`, `LIMIT`, `OFFSET` |
| 6 | **File Upload** | `$_FILES`, validation, move_uploaded_file |

**🚀 Mini Project:** Blog sederhana, Data siswa CRUD

### Fase 4: Advanced & MVC (Minggu 5-6)
**Target:** Paham arsitektur web modern

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **OOP di PHP** | Class, inheritance, interface, namespace |
| 2 | **MVC Pattern** | Model-View-Controller konsep |
| 3 | **Error & Exception Handling** | `try/catch`, custom exceptions, error logging |
| 4 | **Security** | SQL injection prevention, XSS, CSRF, password hashing |
| 5 | **Composer & Autoloading** | Package management, PSR-4 autoloading |
| 6 | **API Development** | REST API, JSON response, JWT auth |

**🚀 Final Project:** E-commerce sederhana, REST API

### Fase 5: Framework (Minggu 7+)
**Optional:** Laravel atau CodeIgniter

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Laravel Basics** | Routing, Blade templating, Eloquent ORM |
| 2 | **Artisan CLI** | Migrations, seeders, generators |
| 3 | **Authentication** | Laravel Breeze/Jetstream, gates, policies |
| 4 | **Testing** | PHPUnit, feature tests, unit tests |

## 🧠 Problem Solving untuk PHP Developer

```
1. "Apakah ini masalah logic atau data?"
   → Logic: cek algoritma
   → Data: cek query database

2. "Apa yang ditampilkan error message?"
   → Enable error_reporting(E_ALL) saat development

3. "Coba var_dump() di titik kritis"
   → Debug dengan melihat isi variabel step-by-step

4. "Apakah sudah menggunakan prepared statement?"
   → Keamanan dari SQL injection

5. "Test dengan berbagai input"
   → Edge cases, empty values, special characters
```

## 🔄 Integrasi dengan Skill Lain

| Situasi | Skill |
|---------|-------|
| Belajar dari nol | `/teach` |
| Butuh bimbingan | `/gentle-teaching` |
| Latihan soal | `/learning-opportunities` |
| Paham kode orang | `/code-documentation-code-explain` |

## 💡 Cara Menggunakan

1. `/teach "Saya ingin belajar PHP dari nol untuk web development"`
2. Saat stuck dengan kode: `/gentle-teaching`
3. Review kode yang sudah jadi: `/code-documentation-code-explain`
4. Latihan penguatan: `/learning-opportunities`
