# 02 — Debugging

> **Minggu 3** · 5 sesi × 1 jam
> **Sebelum ini:** `02-scope-dan-closure.md`
> **Setelah ini:** `04-async-event-loop.md`

---

## Kenapa ini Langkah 3, bukan Langkah 6

Debugging bukan topik terpisah. Ini **cara Anda belajar.**

Setelah minggu ini, setiap kali Anda bingung, Anda punya prosedur. Tanpa ini, Langkah 4 (async) dan Langkah 5 (TypeScript) akan terasa seperti hafalan lagi — Anda baca, merasa paham, lalu lupa.

Anda sekarang sudah punya dua topik yang bisa di-debug: **referensi vs nilai** dan **closure**. Dua-duanya menghasilkan bug yang tidak memunculkan error — dan justru itulah jenis bug yang butuh prosedur ini.

**Ini langkah yang mengubah Anda dari "bisa menulis kode" jadi "bisa mencari tahu sendiri".**

---

## Bagian 1 — Console yang berguna

Kebanyakan orang memakai `console.log` dengan cara yang tidak berguna:

```javascript
// ❌ Tidak berguna — tidak memberi tahu apa pun
console.log("here");
console.log("masuk sini");
console.log(x);

// ✅ Berguna — ada label, tipe, dan nilai
console.log("[hitungTotal] x =", x, "tipe:", typeof x);
```

**Kenapa label penting:** setelah 20 log bercampur, Anda tidak tahu mana dari mana.

**Kenapa `typeof` penting:** banyak bug JS adalah soal tipe. `"5"` dan `5` terlihat sama di `console.log`, tapi berbeda total.

```javascript
console.log(5);        // 5
console.log("5");      // 5        ← terlihat sama!
console.log(typeof 5); // number   ← bedanya di sini
```

### Cara-cara yang lebih baik

```javascript
// Untuk object bersarang — biar terbaca
console.log(JSON.stringify(data, null, 2));

// Untuk array of object — tampil sebagai tabel
console.table(daftarSiswa);

// Mengelompokkan
console.group("Proses absensi");
console.log("input:", data);
console.log("hasil:", hasil);
console.groupEnd();

// Menghitung berapa kali dipanggil
console.count("fungsi ini dipanggil");

// Melihat nilai dari awal sampai akhir
console.log("[loop] i =", i, "nilai =", nilai[i]);
```

---

## Bagian 2 — Breakpoint (yang paling mengubah cara kerja)

`console.log` itu alat darurat. Alat utama adalah **breakpoint**.

### Cara pakai

```
1. Buka halaman di browser
2. Tekan F12 (atau Ctrl+Shift+I) → DevTools terbuka
3. Buka tab "Sources"
4. Cari file JavaScript Anda di panel kiri
5. Klik NOMOR BARIS tempat Anda mau berhenti → muncul tanda biru
6. Jalankan ulang halaman (F5) → kode BERHENTI di baris itu
```

Sekarang Anda bisa melihat **semua** variabel sekaligus di panel kanan (bagian "Scope"). Bukan satu per satu seperti `console.log`.

### Tombol-tombolnya

| Tombol | Artinya |
|---|---|
| **Step over** (F10) | Jalankan baris ini, berhenti di baris berikutnya |
| **Step into** (F11) | Masuk ke dalam fungsi yang dipanggil |
| **Step out** (Shift+F11) | Keluar dari fungsi saat ini |
| **Resume** (F8) | Lanjut jalan sampai breakpoint berikutnya |
| **Pause** | Hentikan kode yang sedang jalan |

### Yang paling berguna: Conditional breakpoint

Kalau loop Anda 1000 kali dan bug hanya di iterasi ke-847, jangan berhenti 1000 kali.

```
Klik kanan pada nomor baris → "Add conditional breakpoint"
Tulis: siswa.id === 847
```

Sekarang kode berhenti **hanya** di kasus yang Anda cari.

### Coba ini

```javascript
function hitungTotal(daftarHarga) {
  let total = 0;
  for (let i = 0; i < daftarHarga.length; i++) {
    total = total + daftarHarga[i];     // ← pasang breakpoint di sini
  }
  return total;
}

console.log(hitungTotal([10000, 25000, 5000]));
```

Pasang breakpoint di baris `total = total + ...`. Jalankan. Tekan Step over 3 kali, perhatikan `total` berubah setiap kali. **Itu cara melihat kode bekerja**, bukan hanya menebak.

---

## Bagian 3 — Membaca error JavaScript

```
TypeError: Cannot read properties of undefined (reading 'map')
    at renderTabelSiswa (TabelSiswa.js:34)
    at HalamanAbsensi (HalamanAbsensi.js:56)
```

### Anatomi

```
① JENIS ERROR
   TypeError  → tipe data salah

② PESAN
   Cannot read properties of undefined (reading 'map')
   → Anda memanggil .map() pada sesuatu yang undefined

③ LOKASI (baris paling atas)
   TabelSiswa.js:34  ← baris pertama milik kode ANDA
   → ini tempat kejadiannya

④ JEJAK
   HalamanAbsensi.js:56 → siapa yang memanggil renderTabelSiswa
```

### Baca dari baris paling atas dulu

**Baris paling atas** = tempat error terjadi, di kode Anda.

Baris di bawahnya = pemanggilnya. Berguna untuk tahu **konteks**, tapi bukan tempat kejadiannya.

### Jenis error yang paling sering Anda temui

| Error | Artinya | Biasanya karena |
|---|---|---|
| `TypeError: Cannot read properties of undefined` | Akses properti pada `undefined` | Data belum selesai dimuat, atau nama properti salah |
| `TypeError: x is not a function` | Memanggil sesuatu yang bukan fungsi | Typo nama method, atau API yang tidak ada |
| `ReferenceError: x is not defined` | Variabel tidak ada | Typo, atau lupa deklarasi |
| `SyntaxError: Unexpected token` | Kode tidak bisa dibaca | Kurung/kutip tidak ditutup, koma berlebih |
| `Uncaught (in promise)` | Error di dalam async | Lupa `try/catch` di fungsi async |

---

## Bagian 4 — Prosedur saat menghadapi bug

Ini yang membuat Anda tidak menebak-nebak.

```
1. BACA error sampai habis
   Baris paling atas = tempat kejadian di kode Anda

2. TULIS apa yang seharusnya terjadi
   "Fungsi ini seharusnya mengembalikan daftar siswa"

3. TULIS hipotesis
   "Saya tebak siswaList undefined karena data belum selesai dimuat"

4. UJI hipotesis dengan SATU perubahan
   console.log("[render] siswaList =", siswaList, typeof siswaList);

5. Baru perbaiki
   Satu perubahan. Satu uji. Jangan ubah 3 hal sekaligus.

6. Kalau sudah jalan, tanya:
   Apakah saya bisa menjelaskan KENAPA perbaikan ini benar?
   Kalau tidak → Anda memperbaiki gejala, bukan akarnya.
```

**Langkah 2 dan 3 tidak boleh dilewati.** Tanpa itu, Anda menebak.

---

## Latihan minggu ini

### Latihan 1 — console yang berguna

Ambil kode Anda sendiri. Ganti semua `console.log("here")` dengan log yang punya label + tipe.

### Latihan 2 — breakpoint

Ambil satu fungsi di kode Anda. Pasang breakpoint. Jalankan. **Sebelum** menekan Step, tulis di kertas nilai yang Anda tebak untuk setiap variabel. Baru tekan Step. Bandingkan.

### Latihan 3 — baca stack trace

Cari 3 error lama Anda (di chat dengan AI, atau di log). Baca ulang dengan anatomi di atas. Untuk masing-masing, tulis: (a) jenis, (b) pesan, (c) baris kejadian, (d) siapa pemanggilnya.

### Latihan 4 — bug yang sengaja dibuat

Ini yang paling berguna:

```javascript
// Simpan sebagai latihan.js. Ada 3 bug di sini.
// Jalankan, temukan, dan perbaiki. Jangan lihat jawaban dulu.

function hitungRataRata(nilaiList) {
  let total = 0;
  for (let i = 0; i <= nilaiList.length; i++) {
    total = total + nilaiList[i];
  }
  return total / nilaiList.length;
}

function cariSiswa(daftar, nama) {
  const siswa = daftar.find(s => s.nama = nama);
  return siswa.nama.toUpperCase();
}

console.log(hitungRataRata([80, 90, 100]));
console.log(cariSiswa([{nama: "Ani"}, {nama: "Budi"}], "Budi"));
```

**Tulis hipotesis Anda sebelum mengubah apa pun.**

<details>
<summary><strong>Jawaban</strong></summary>

**Bug 1 — off-by-one**

```javascript
for (let i = 0; i <= nilaiList.length; i++)
//              ↑ seharusnya <
```

Dengan `<=`, loop jalan sampai `i = 3` padahal index valid hanya 0,1,2. `nilaiList[3]` = `undefined`, dan `total + undefined` = `NaN`. Hasilnya `NaN`.

Perbaikan: `i < nilaiList.length`

**Bug 2 — assignment, bukan perbandingan**

```javascript
daftar.find(s => s.nama = nama)
//                    ↑ seharusnya ===
```

Satu tanda `=` berarti **menugaskan**, bukan **membandingkan**. Akibatnya: setiap siswa diubah namanya jadi "Budi", dan `find` mengembalikan elemen pertama (Ani, yang sekarang bernama Budi). Tidak error — tapi data Anda rusak.

Perbaikan: `s.nama === nama`

**Bug 3 — tidak ada penanganan kalau tidak ditemukan**

```javascript
function cariSiswa(daftar, nama) {
  const siswa = daftar.find(s => s.nama === nama);
  return siswa.nama.toUpperCase();     // ← kalau siswa undefined → TypeError
}
```

`find` mengembalikan `undefined` kalau tidak ada. Perbaikan:

```javascript
if (!siswa) return "Siswa tidak ditemukan";
return siswa.nama.toUpperCase();
```

**Pelajaran:** Bug 1 memunculkan error (`NaN`), Bug 2 **senyap** (data rusak tanpa error), Bug 3 baru muncul pada kasus tertentu. Tiga jenis bug yang berbeda — dan hanya satu yang "berisik".

</details>

### Latihan 5 — jenis bug yang tidak memunculkan error

Ini jenis bug yang paling sulit, dan yang paling sering terjadi di React. **Tidak ada error. Tidak ada yang crash.** Hanya hasilnya salah.

```javascript
// Simpan sebagai latihan.js.
// Latihan ini TIDAK punya bug. Tugas Anda: prediksi outputnya,
// lalu jelaskan kenapa `awal` dan `akhir` bisa berbeda.

function buatPenghitung() {
  let hitungan = 0;

  const tambah = () => {
    hitungan = hitungan + 1;
  };

  const jumlahAwal = hitungan;      // ← perhatikan baris ini
  const ringkas = () => `awal: ${jumlahAwal}, akhir: ${hitungan}`;

  return { tambah, ringkas };
}

const { tambah, ringkas } = buatPenghitung();
tambah();
tambah();
tambah();
console.log(ringkas());
```

**Tulis tebakan Anda di kertas.** Lalu tanyakan: *"nilai ini dibaca saat dipanggil, atau disalin saat dibuat?"*

<details>
<summary><strong>Jawaban</strong></summary>

**Output: `awal: 0, akhir: 3`**

Tidak ada bug di sini — tapi perhatikan **kenapa** keduanya berbeda:

| Bagian | Cara akses | Hasil |
|---|---|---|
| `jumlahAwal` | **Nilai disalin** saat fungsi dibuat | `0` — terkunci |
| `hitungan` | **Variabel dibaca** saat fungsi dipanggil | `3` — terbaru |

Dua variabel, di dalam fungsi yang sama, berperilaku berbeda. **Itulah seluruh pelajaran Langkah 2.**

Sekarang versi yang **benar-benar bug** — bedanya cuma satu kata:

```javascript
// ❌ Versi bug — `akhir` juga memakai nilai yang sudah disalin
const jumlahAwal = hitungan;
const ringkas = () => `awal: ${jumlahAwal}, akhir: ${jumlahAwal}`;
//                                                ^^^^^^^^^^^ seharusnya `hitungan`
// → "awal: 0, akhir: 0"   padahal sudah ditambah 3 kali
```

Satu kata yang salah, dan hasilnya salah tanpa satu pun pesan error.

**Kenapa latihan ini penting:** inilah bentuk *stale closure*. Di React, bentuknya:

```jsx
// ❌ count selalu 0 di dalam interval
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []);   // ← deps kosong = nilai dari render pertama, terkunci selamanya
```

**Cara mendeteksi bug jenis ini:**

```
1. Cari semua nilai yang "seharusnya berubah tapi tidak"
2. Lacak: nilai itu disalin ke variabel lain, atau dibaca langsung?
3. Kalau disalin → curigai closure basi
4. Kalau ada useEffect → periksa dependency array-nya
```

**Catatan penting:** DevTools **tidak** akan membantu Anda di sini. Tidak ada error, tidak ada stack trace. Yang Anda butuhkan adalah **membaca kode dan berpikir**, bukan menekan tombol. Itu sebabnya Langkah 3 diajarkan sebelum Langkah 4.

</details>

---

## Selesai Langkah 3 kalau Anda bisa

- [ ] Memakai breakpoint, bukan hanya `console.log`
- [ ] Menulis `console.log` dengan label dan tipe
- [ ] Membaca stack trace dan menunjuk baris kejadiannya
- [ ] Menulis hipotesis **sebelum** mengubah kode
- [ ] Menyelesaikan Latihan 4 (ketiga bug) tanpa melihat jawaban
- [ ] Menjelaskan kenapa Bug 2 tidak memunculkan error
- [ ] Menyelesaikan Latihan 5 (bug tanpa error) dan menjelaskan sebabnya

---

## Kalau masih bingung

Fokus ke **Latihan 4 dan 5**. Kerjakan pelan-pelan, satu bug pada satu waktu. Tulis hipotesis di kertas untuk setiap bug. Dua latihan itu yang paling mendekati debugging nyata — Latihan 4 melatih bug yang "berisik", Latihan 5 melatih bug yang senyap.

---

> **Lanjut ke:** [`04-async-event-loop.md`](./04-async-event-loop.md)
