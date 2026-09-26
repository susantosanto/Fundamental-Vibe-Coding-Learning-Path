# Kamus Sintaks — bentuk yang muncul di kode hasil AI

> **Untuk siapa:** **tutor**, bukan pembelajar. Tutor membaca ini sendiri, lalu menjelaskan
> (lihat §MODE PENYAMPAIAN di `SKILL.md`).
>
> **Kenapa file ini ada:** kode hasil generate AI memakai sintaks modern **sejak baris
> pertama** — `const`, `=>`, `?.`, `??`, `...`, destructuring. Pembelajar yang belum pernah
> melihatnya akan **macet di baris 1**, bukan karena konsepnya sulit, tapi karena bentuknya
> asing.
>
> **Aturan pakai:** kalau pembelajar bertanya *"tanda ini apa?"*, **jangan bilang "itu di luar
> materi"**. Cek file ini, jelaskan **satu bentuk** dalam 1–2 kalimat, kaitkan ke unit tempat
> ia dilatih, lalu lanjut. **Satu bentuk per kejadian** — jangan menumpuk.

**Tingkat bahaya** = seberapa sering bentuk ini jadi sumber bug yang *tidak terlihat*.
🔴 tinggi · 🟡 sedang · ⚪ rendah (aman, hanya perlu dikenali).

---

## A. Bentuk nilai & fungsi

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `const` | Nama yang **tidak boleh** ditunjuk ulang | `const x = 1` | ⚪ | 1 |
| `let` | Nama yang **boleh** ditunjuk ulang | `let x = 1; x = 2` | ⚪ | 1 |
| `var` | Cara lama; lingkupnya membingungkan | `var i = 0` | 🟡 | 1, 9 |
| `function f() {}` | Fungsi biasa (dideklarasikan) | `function f(a) { return a }` | ⚪ | 6 |
| `const f = () => {}` | **Fungsi panah** — bentuk yang paling sering dipakai AI | `const f = a => a * 2` | 🟡 | 6 |
| `(a, b) => a + b` | Panah tanpa `{}` = nilai di kanan **langsung dikembalikan** | `[1,2].map(n => n*2)` | 🔴 | 6 |
| `(a = 1) => a` | Nilai bawaan kalau argumen tidak diberikan | `f()` → `1` | 🟡 | 6 |
| `(...sisa) => sisa` | **Rest** — kumpulkan sisa argumen jadi array | `f(1,2,3)` → `[1,2,3]` | 🟡 | 6, 7 |
| `` `teks ${x}` `` | **Template literal** — teks yang bisa menyisipkan nilai | `` `Halo ${nama}` `` | ⚪ | 2 |
| `async` / `await` | Fungsi yang menunggu; `await` menghentikan sampai selesai | `await fetch(url)` | 🔴 | 10 |

> **Jebakan panah yang harus disebut:** `() => { x }` **tidak** mengembalikan `x` —
> ia mengembalikan `undefined`. Yang mengembalikan adalah `() => x`. Kode AI sering
> "hampir benar" justru di sini.

---

## B. Operator yang mengubah hasil

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `===` | Sama **jenis dan nilai** — ini yang benar | `1 === "1"` → `false` | ⚪ | 2 |
| `==` | Sama setelah **dikonversi** — sumber bug klasik | `1 == "1"` → `true` | 🔴 | 2 |
| `!==` / `!=` | Kebalikan dari dua di atas | `1 !== "1"` → `true` | 🟡 | 2 |
| `?.` | **Optional chaining** — berhenti & beri `undefined` kalau kosong | `user?.nama` | 🟡 | 4 |
| `??` | Pakai kanan **hanya kalau kiri `null`/`undefined`** | `x ?? 0` | 🔴 | 4 |
| `\|\|` | Pakai kanan kalau kiri **falsy** (`0`, `""`, `false` ikut!) | `x \|\| 0` | 🔴 | 4 |
| `&&` | Jalan ke kanan hanya kalau kiri benar | `aktif && kirim()` | 🟡 | 4 |
| `? :` | **Ternary** — pilih satu dari dua nilai | `x > 0 ? "a" : "b"` | ⚪ | 4 |
| `!` | Membalik benar/salah | `!kosong` | ⚪ | 4 |
| `typeof x` | Nama jenis sebagai teks | `typeof []` → `"object"` | 🟡 | 11 |
| `++` / `--` | Tambah/kurangi 1 | `i++` | ⚪ | 5 |
| `+=` `-=` `*=` | Operasi sambil menimpa | `total += 5` | ⚪ | 1 |
| `**` | Pangkat | `2 ** 3` → `8` | ⚪ | 2 |
| `%` | Sisa bagi | `7 % 2` → `1` | 🟡 | 2 |
| `in` / `instanceof` | Punya properti / turunan dari | `"a" in obj` | ⚪ | 7 |
| `<<` `>>` `&` `\|` `^` `~` | Bitwise — **jarang di kode aplikasi** | `x << 1` | ⚪ | — |

> 🔴 **`??` vs `\|\|` — pasangan paling berbahaya di daftar ini.**
> `jumlah \|\| 0` akan mengubah `0` yang sah menjadi `0` (kelihatan benar), tapi
> `diskon \|\| 10` mengubah diskon `0%` menjadi `10%`. **Ini bug yang lolos test.**
> Ajarkan di Unit 4, uji di Unit 16.

---

## C. Membongkar & menggabung data

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `const { a, b } = obj` | **Destructuring objek** — ambil properti jadi nama | `const { nama } = user` | 🟡 | 7 |
| `const [x, y] = arr` | **Destructuring array** — ambil berdasarkan urutan | `const [a, b] = [1,2]` | 🟡 | 7 |
| `{ a = 1 } = obj` | Destructuring dengan nilai bawaan | `const { qty = 1 } = item` | 🟡 | 7 |
| `{ a: alias } = obj` | Ganti nama saat membongkar | `const { nama: n } = user` | ⚪ | 7 |
| `{ ...obj }` | **Spread** — salinan **dangkal** | `const b = { ...a }` | 🔴 | 8 |
| `[...arr]` | Salinan array **dangkal** | `const b = [...a]` | 🔴 | 8 |
| `{ ...a, x: 1 }` | Gabung / timpa properti | `{ ...default, ...input }` | 🟡 | 8 |
| `Object.keys(o)` | Daftar nama kunci | `Object.keys(u)` → `["a"]` | ⚪ | 7 |
| `Object.values(o)` | Daftar nilai | `Object.values(u)` | ⚪ | 7 |
| `Object.entries(o)` | Pasangan `[kunci, nilai]` | `Object.entries(u)` | ⚪ | 7 |
| `structuredClone(o)` | Salinan **dalam** — cara benar | `structuredClone(a)` | ⚪ | 8 |
| `.map()` `.filter()` `.reduce()` | Ubah / saring / rangkum array | `arr.map(x => x*2)` | 🟡 | 7 |
| `.find()` `.some()` `.every()` | Cari satu / ada yang / semua | `arr.find(x => x.id === 1)` | ⚪ | 7 |
| `.push()` `.sort()` `.splice()` | **Memutasi** — layar React tidak ikut berubah | `arr.sort()` | 🔴 | 8 |

> 🔴 **Tiga yang paling mahal:** `{...obj}` (hanya dangkal), method yang memutasi
> (`push`/`sort`/`splice`), dan `.map` yang lupa `return` saat pakai `{}`.

---

## D. Percabangan & perulangan bentuk lain

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `switch` / `case` / `default` | Pilih satu dari banyak cabang | `switch (kode) { case "A": ... }` | 🟡 | 4 |
| `break` | Keluar dari loop / `switch` | `if (x) break` | 🟡 | 5 |
| `continue` | Lewati putaran ini, lanjut berikutnya | `if (x) continue` | 🟡 | 5 |
| `while` | Ulang selama syarat benar | `while (i < 3) {}` | 🟡 | 5 |
| `do...while` | Ulang **minimal sekali** | `do {} while (x)` | ⚪ | 5 |
| `for...of` | Loop **nilai** array/iterable — paling sering di kode AI | `for (const n of arr)` | ⚪ | 5 |
| `for...in` | Loop **kunci** objek (⚠️ termasuk warisan) | `for (const k in obj)` | 🟡 | 5 |
| `try` / `catch` / `finally` | Tangkap error | `try { f() } catch (e) {}` | 🟡 | 11 |
| `throw new Error("...")` | Lemparkan error sendiri | `throw new Error("kosong")` | ⚪ | 11 |

> 🟡 **`switch` tanpa `break` "jatuh" ke case berikutnya.** Kode AI sering lupa.
> Ini cacat yang **tidak menimbulkan error** — hanya hasil yang salah.

---

## E. Data nyata: JSON & bentuk di luar bahasa

| Bentuk | Arti | Contoh | Bahaya | Unit |
|---|---|---|---|---|
| `JSON.parse(teks)` | Teks → objek. **Melempar error kalau teksnya rusak** | `JSON.parse('{"a":1}')` | 🔴 | 19 |
| `JSON.stringify(obj)` | Objek → teks | `JSON.stringify({a:1})` | 🟡 | 19 |
| `JSON.stringify(o, null, 2)` | Dengan indentasi (untuk dibaca) | — | ⚪ | 19 |
| `parseInt(x, 10)` | Teks → angka bulat | `parseInt("12px")` → `12` | 🟡 | 2 |
| `parseFloat(x)` | Teks → angka desimal | `parseFloat("1,5")` → `1` | 🔴 | 2 |
| `Number(x)` | Teks → angka (ketat) | `Number("12")` → `12` | 🟡 | 2 |
| `isNaN(x)` / `Number.isNaN(x)` | Cek "bukan angka" | `isNaN("a")` → `true` | 🟡 | 2 |
| `Math.round` `.floor` `.ceil` `.abs` `.max` `.min` | Pembulatan & batas | `Math.round(1.5)` | 🟡 | 2 |
| `0.1 + 0.2` | **≠ `0.3`** — angka desimal tidak eksak | → `0.30000000000000004` | 🔴 | 2 |
| `new Date()` / `Date.now()` | Tanggal & waktu | `new Date().getFullYear()` | 🟡 | 20 |
| `Intl.NumberFormat("id-ID", {...})` | Format angka lokal (rupiah) | `Rp1.234.567` | 🟡 | 20 |
| `Intl.DateTimeFormat("id-ID")` | Format tanggal lokal | `26/09/2026` | ⚪ | 20 |
| `/pola/g` | **Regex** — pencocokan pola teks | `/\d+/g` | 🔴 | 20 |
| `.replace()` `.split()` `.trim()` `.includes()` `.slice()` | Operasi teks yang sering dipakai | `s.split(",")` | ⚪ | 2 |
| `new Map()` / `new Set()` | Koleksi berkunci / tanpa duplikat | `new Set([1,1,2])` → `{1,2}` | ⚪ | 7 |
| `class` / `extends` / `new` | Cara lama membuat objek berperilaku | `class A {}` | 🟡 | 20 |
| `import` / `export` | Menghubungkan antar-file | `export default f` | 🟡 | 15 |
| `require(...)` | Cara lama (CommonJS) — masih banyak di Electron | `const fs = require("fs")` | 🟡 | 15 |

> 🔴 **Tiga yang paling sering menghasilkan "hasil salah tanpa error":**
> `JSON.parse` pada data yang tidak sesuai dugaan, `parseFloat` pada angka ber-koma
> Indonesia (`"1.500,25"` → `1.5`), dan `0.1 + 0.2` pada perhitungan uang.
> **Untuk aplikasi keuangan, ketiganya wajib dibahas.**

---

## F. Yang SENGAJA tidak diajarkan — dan kenapa

Bukan karena sulit, tapi karena **tidak melayani tujuan** (membaca & menilai kode AI),
atau karena menambah beban tanpa menambah kemampuan.

| Topik | Kenapa dilewati |
|---|---|
| Typed arrays (`Uint8Array`, `ArrayBuffer`) | Hanya muncul di pemrosesan biner/grafis. Bukan ranah aplikasi ini |
| Generator (`function*`, `yield`) | Sangat jarang di kode aplikasi hasil AI |
| `Proxy`, `Reflect`, `Symbol` | Meta-programming. Kalau muncul, cukup dikenali |
| `using` / `DisposableStack` | Fitur baru (ES2025); belum lazim |
| Bitwise (`&`, `\|`, `^`, `<<`) | Hampir tidak pernah di kode aplikasi biasa |
| Rantai prototipe secara dalam | Cukup tahu "objek bisa mewarisi" (Unit 7–8) |
| `eval` | Berbahaya, hampir tidak pernah dipakai |
| `WeakMap` / `WeakRef` / memori | Topik lanjutan, bukan kebutuhan inspeksi |
| Menghafal seluruh method `String`/`Array` | Bisa dicari; AI sudah tahu. Yang dilatih: **mengenali & mencurigai** |

**Prinsipnya:** kamus ini untuk **mengenali**, bukan menghafal. Kalau sebuah bentuk muncul
dan pembelajar bisa menjawab *"ini apa, dan apa risikonya"* — itu sudah cukup.

---

## Cara memakai file ini (untuk tutor)

```
1. Pembelajar bertanya "tanda ini apa?"
   → cari di tabel, jelaskan SATU bentuk, 1–2 kalimat, kaitkan ke unit.

2. Kamu mau menyiapkan korpus latihan
   → pilih 1 bentuk 🔴 dari tabel, sisipkan ke kode latihan
     (lihat korpus-ai.md §Cacat yang biasa muncul di kode AI).

3. Pembelajar bertanya "apakah saya harus hafal semua ini?"
   → TIDAK. Yang perlu: mengenali bentuk, dan tahu mana yang berbahaya.
     Menghafal sintaks bukan tujuan — mencurigainya yang tujuan.
```

**Referensi:** MDN §Expressions and operators · MDN §Standard built-in objects ·
`cakupan-vs-mdn.md` (audit lengkap cakupan materi).
