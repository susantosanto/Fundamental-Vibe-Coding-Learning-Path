# 01 — Referensi vs Nilai

> **Minggu 1** · 5 sesi × 1 jam
> **Sebelum ini:** baca `00-RENCANA.md`
> **Setelah ini:** `02-scope-dan-closure.md`

---

## Coba ini dulu (2 menit)

Sebelum teori apa pun. Buka DevTools (F12) → tab **Console**. Tempel ini:

```javascript
let punyaAni = ["buku", "pulpen"];
let punyaBudi = punyaAni;        // Budi "mendapat" barang Ani

punyaBudi.push("penghapus");

console.log(punyaAni);
```

**Tulis tebakan Anda di kertas: ____**

<details>
<summary><strong>Jawaban</strong></summary>

```
["buku", "pulpen", "penghapus"]
```

**Ani ikut dapat penghapus.** Padahal Anda cuma mengubah barang Budi.

Kalau itu mengejutkan Anda — bagus. Itu inti dari seluruh halaman ini.

</details>

---

## Kenapa ini langkah pertama

Ini akar dari kebanyakan bug JavaScript. Kalau Anda hanya punya waktu untuk satu topik di seluruh folder ini, **ambil yang ini**.

Bug ini tidak memunculkan error. Kode jalan normal, hasilnya salah. Dan Anda akan mencarinya berjam-jam kalau tidak tahu.

---

## Konsepnya

```javascript
// NILAI — disalin
let a = 1;
let b = a;
b = 2;
console.log(a);   // 1   ← a tidak berubah

// REFERENSI — alamatnya yang disalin, bukan isinya
let arr1 = [1, 2, 3];
let arr2 = arr1;      // arr2 menunjuk ke array YANG SAMA
arr2.push(4);
console.log(arr1);    // [1, 2, 3, 4]   ← arr1 ikut berubah!
```

Object dan array disimpan sebagai **referensi** (alamat), bukan nilai.

Jadi `let arr2 = arr1` **tidak membuat salinan.** Ia membuat **nama kedua untuk benda yang sama**. Seperti memberi nama panggilan pada teman Anda — dua nama, satu orang.

```
let arr1 = [1,2,3]        arr1 ──┐
                                 ├──→ [1, 2, 3]
let arr2 = arr1           arr2 ──┘
```

Ubah lewat `arr2` → `arr1` juga berubah, karena keduanya menunjuk benda yang sama.

---

## Cara membuat salinan yang benar

```javascript
let arr1 = [1, 2, 3];

// ✅ Salinan dangkal (shallow copy)
let arr2 = [...arr1];          // array
let obj2 = { ...obj1 };        // object
let arr3 = arr1.slice();       // cara lain
let arr4 = Array.from(arr1);   // cara lain
let arr5 = structuredClone(arr1);  // salinan dalam (deep), untuk nested

arr2.push(4);
console.log(arr1);   // [1, 2, 3]   ← aman, tidak ikut berubah
```

**Ingat:** `...` (tiga titik, disebut *spread*) = salinan. Tanpa `...` = nama kedua.

---

## ⚠️ Jebakan: salinan dangkal bukan salinan penuh

Ini yang menjebak banyak orang. Perhatikan baik-baik:

```javascript
let kelas1 = {
  nama: "6A",
  siswa: ["Ani", "Budi"]      // ← array di dalam object
};

let kelas2 = { ...kelas1 };   // salinan dangkal
kelas2.nama = "6B";
console.log(kelas1.nama);     // "6A"  ✅ aman

kelas2.siswa.push("Cici");    // ← tapi ini...
console.log(kelas1.siswa);    // ["Ani", "Budi", "Cici"]  ❌ IKUT BERUBAH!
```

**Kenapa:** `{ ...kelas1 }` hanya menyalin **lapisan luar**. Properti `nama` disalin (aman), tapi properti `siswa` masih **menunjuk array yang sama** karena array itu referensi.

```
kelas1 ──→ { nama: "6A",  siswa: ──┐
                                    ├──→ ["Ani", "Budi"]
kelas2 ──→ { nama: "6B",  siswa: ──┘
             ↑             ↑
        disalin baru   MASIH SAMA
```

**Solusinya** kalau ada object bersarang:

```javascript
let kelas2 = structuredClone(kelas1);   // salinan dalam, benar-benar terpisah
```

---

## ⚠️ Jebakan kedua: sebagian method merusak, sebagian tidak

Ini masih satu keluarga dengan halaman ini. Kalau Anda tidak tahu mana yang mana, Anda akan merusak data tanpa sadar.

```javascript
const angka = [3, 1, 2];

const hasil = angka.sort();     // ← sort MENGUBAH array aslinya!
console.log(angka);             // [1, 2, 3]   ← angka asli sudah berubah
console.log(hasil);             // [1, 2, 3]   ← dan `hasil` menunjuk array YANG SAMA
```

`sort()` tidak membuat array baru. Ia mengubah di tempat.

### Daftar yang harus Anda hafal

| **MENGUBAH array asli** ❌ | **MEMBUAT array baru** ✅ |
|---|---|
| `push()` — tambah di akhir | `map()` — ubah tiap item |
| `pop()` — buang dari akhir | `filter()` — saring |
| `shift()` — buang dari awal | `slice()` — potong salinan |
| `unshift()` — tambah di awal | `concat()` — gabung |
| `splice()` — potong di tempat | `flat()` — ratakan |
| `sort()` — urutkan di tempat | `[...arr]` — salinan |
| `reverse()` — balik di tempat | `reduce()` — jadi satu nilai |

**Cara mengingat:** kalau namanya **benda yang Anda lakukan pada array** (dorong, potong, urutkan) → mengubah. Kalau namanya **hasil yang Anda inginkan** (peta, saring, potongan) → array baru.

**Aman dari jebakan `sort()`:**

```javascript
const hasil = [...angka].sort();   // salin dulu, baru urutkan
```

### Kenapa ini penting sekali untuk React

React menentukan "perlu render ulang atau tidak" dengan membandingkan **alamat** array, bukan isinya.

```javascript
// ❌ React tidak tahu ada perubahan → layar tidak ikut berubah
daftar.push(item);
setDaftar(daftar);

// ✅ Alamat baru → React tahu → layar berubah
setDaftar([...daftar, item]);
```

Gejalanya di React: *"kok datanya berubah tapi layarnya tidak?"* Penyebabnya `push`. Bukan React-nya yang salah.

---

## Latihan

**Kerjakan di kertas dulu. Tulis tebakan Anda sebelum menjalankan.** Ini bagian yang membuatnya menempel.

Buat file `latihan.js`, lalu tulis ini satu per satu.

### Latihan 1

```javascript
let siswa1 = { nama: "Ani", kelas: "6A" };
let siswa2 = siswa1;
siswa2.kelas = "6B";
console.log(siswa1.kelas);
```

Tebakan Anda: ____

### Latihan 2

```javascript
let daftar1 = [1, 2, 3];
let daftar2 = [...daftar1];
daftar2.push(4);
console.log(daftar1);
```

Tebakan Anda: ____

### Latihan 3

```javascript
function ubah(data) {
  data.nama = "BERUBAH";
}
let siswa3 = { nama: "Budi" };
ubah(siswa3);
console.log(siswa3.nama);
```

Tebakan Anda: ____

### Latihan 4

```javascript
let a = [1, 2, 3];
let b = a.slice();
let c = a;
b.push(4);
c.push(5);
console.log(a);
console.log(b);
```

Tebakan Anda untuk `a`: ____
Tebakan Anda untuk `b`: ____

### Latihan 5 (yang paling menjebak)

```javascript
let asli = { nama: "6A", siswa: ["Ani"] };
let salinan = { ...asli };
salinan.siswa.push("Budi");
console.log(asli.siswa);
```

Tebakan Anda: ____

### Latihan 6 — method yang merusak

```javascript
const nilai = [80, 100, 60];
const nilaiUrut = nilai.sort();
const nilaiTerbaik = nilaiUrut.slice(0, 1);
console.log(nilai);
```

Tebakan Anda untuk `nilai`: ____

---

<details>
<summary><strong>Jawaban dan penjelasan</strong></summary>

**1.** `"6B"` — `siswa2` dan `siswa1` adalah benda yang sama. Mengubah lewat `siswa2` mengubah `siswa1`.

**2.** `[1, 2, 3]` — `[...daftar1]` membuat salinan baru, jadi `push` tidak memengaruhi `daftar1`.

**3.** `"BERUBAH"` — object yang dikirim ke fungsi juga referensi, bukan salinan. Fungsi menerima "alamat", bukan "isinya".

**4.** `a` = `[1, 2, 3, 5]` dan `b` = `[1, 2, 3, 4]`
- `b` adalah salinan (`slice()`), jadi `b.push(4)` hanya mengubah `b`
- `c` **adalah** `a` (tanpa salinan), jadi `c.push(5)` mengubah `a` juga

**5.** `["Ani", "Budi"]` — **ini jebakannya.** `{ ...asli }` hanya menyalin lapisan luar. Properti `siswa` masih menunjuk array yang sama. Untuk benar-benar terpisah, pakai `structuredClone(asli)`.

**6.** `[60, 80, 100]` — **`sort()` mengubah array asli.** `nilaiUrut` bukan array baru; ia **menunjuk array yang sama** dengan `nilai`. Jadi saat `nilaiUrut` diurutkan, `nilai` juga ikut terurut.

Perhatikan juga: `slice()` di baris berikutnya **memang** membuat array baru — jadi `nilaiTerbaik` aman. Dalam tiga baris ada satu yang merusak dan satu yang tidak.

</details>

---

## Latihan tambahan (kerjakan di kode Anda sendiri)

Ini yang membuat pemahaman menempel — menemukannya di kode nyata:

```
1. Buka salah satu file JavaScript yang pernah Anda tulis (atau minta AI menulis).
2. Cari semua tempat yang:
   - menugaskan array/object ke variabel lain (let x = y)
   - mengirim array/object ke fungsi
   - memakai push/splice/obj.prop = ... pada data yang datang dari luar
3. Tanya untuk masing-masing: "apakah ini harus salinan, atau memang
   saya mau mengubah yang asli?"
4. Kalau ragu, uji: ubah lewat satu variabel, lihat apakah yang lain ikut berubah.
```

Kalau Anda menemukan minimal **satu** tempat yang bug karena ini, Langkah 1 sudah berhasil.

---

## Selesai Langkah 1 kalau Anda bisa

- [ ] Menjelaskan bedanya `let b = a` untuk angka vs untuk array
- [ ] Menjelaskan kenapa `[...arr]` berbeda dari `arr`
- [ ] Menjelaskan kenapa `{ ...obj }` **tidak** cukup untuk object bersarang
- [ ] Menyebutkan 3 method yang **mengubah** array dan 3 yang **membuat baru**
- [ ] Menjelaskan kenapa `daftar.push(item)` membuat React tidak render ulang
- [ ] Menemukan minimal 1 tempat di kode Anda sendiri yang punya bug ini
- [ ] Menjawab 6 latihan di atas dengan benar **sebelum** melihat jawabannya

---

## Kalau masih bingung

Ulangi Latihan 1 dan 5. Dua itu yang paling penting. Yang lain hanya variasi.

Kalau masih belum jelas, tempel ini ke AI:

```
Saya sedang belajar referensi vs nilai di JavaScript.
Penjelasan saya: [tulis pemahaman Anda]

Temukan di mana penjelasan saya SALAH atau kabur.
Beri saya satu contoh di mana pemahaman saya menghasilkan kesimpulan yang salah.
Jangan puji, langsung ke kelemahannya.
```

---

## Catatan: kenapa ini penting untuk kode buatan AI

AI sering menulis kode seperti ini:

```javascript
function tambahSiswa(daftar, nama) {
  daftar.push(nama);      // ← mengubah array milik pemanggil
  return daftar;
}
```

Kalau Anda mengirim array Anda, array Anda **ikut berubah**. Itu kadang memang yang Anda mau, kadang tidak. Bedanya hanya Anda yang tahu.

Versi yang tidak mengubah aslinya:

```javascript
function tambahSiswa(daftar, nama) {
  return [...daftar, nama];    // ← mengembalikan array baru
}
```

Ini juga alasan React dan framework modern menekankan **immutability** (tidak mengubah data asli). Bukan gaya-gayaan — itu menghindari tepatnya bug yang Anda pelajari di halaman ini.

---

> **Lanjut ke:** [`02-scope-dan-closure.md`](./02-scope-dan-closure.md)
