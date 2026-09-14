# 02 — Scope & Closure

> **Minggu 2** · 5 sesi × 1 jam
> **Sebelum ini:** `01-referensi-vs-nilai.md`
> **Setelah ini:** `03-debugging.md`

---

## Kenapa ini ada di sini

Di Langkah 1 Anda belajar: **nama variabel menunjuk ke sebuah benda.**

Langkah 2 ini pertanyaan lanjutannya: **kalau nama itu dipakai di dalam fungsi, nama itu menunjuk ke yang mana?**

Ini bukan topik tambahan. Ini **penyebab bug React nomor satu** — namanya *stale closure*. Hampir semua orang yang belajar React tanpa paham ini akan mengalami: data di layar tidak mau berubah, padahal kode terlihat benar.

Bug ini tidak memunculkan error. Sama seperti Langkah 1.

```
Referensi vs nilai  →  "nama ini menunjuk benda yang mana?"
Scope & closure     →  "nama ini menunjuk benda dari KAPAN?"
```

Dua-duanya pertanyaan yang sama: **nama ini sebenarnya apa?**

---

## Coba ini dulu (3 menit)

Sebelum teori. Jalankan di DevTools → Console.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Tulis tebakan Anda: ____**

Jawabannya ada di bawah, tapi tulis dulu.

<details>
<summary><strong>Jawaban</strong></summary>

```
3
3
3
```

Bukan `0, 1, 2`.

**Kenapa:** `var` membuat **satu** variabel `i` untuk seluruh loop. Ketiga fungsi yang dikirim ke `setTimeout` semuanya menunjuk ke variabel `i` **yang sama**. Saat mereka akhirnya dijalankan, loop sudah selesai dan `i` bernilai `3`.

Mereka tidak menyimpan nilai. Mereka menyimpan **alamat variabel.**

Bandingkan:

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0
// 1
// 2
```

**Satu kata berubah (`var` → `let`), hasilnya beda total.** `let` membuat variabel `i` **baru di setiap iterasi**, jadi tiap fungsi punya `i`-nya sendiri.

</details>

**Kalau Anda salah menebak — bagus.** Ini pelajarannya.

---

## Bagian 1 — Scope: sebuah nama hidup di mana?

Nama variabel tidak bisa dipakai di sembarang tempat. Ada **wilayah**-nya.

```javascript
let luar = "bisa dipakai di mana saja";

function contoh() {
  let dalam = "hanya hidup di dalam fungsi ini";
  console.log(luar);    // ✅ bisa
  console.log(dalam);   // ✅ bisa
}

contoh();
console.log(dalam);     // ❌ ReferenceError: dalam is not defined
```

### `var` vs `let` / `const`

| | `var` | `let` / `const` |
|---|---|---|
| Wilayah | Seluruh fungsi | Hanya di dalam `{ }` |
| Di luar blok | Masih hidup | Mati |
| Di loop | **Satu variabel untuk semua iterasi** | **Variabel baru tiap iterasi** |
| Pakai sekarang? | ❌ Jangan | ✅ Ya |

```javascript
if (true) {
  var a = 1;
  let b = 2;
}
console.log(a);   // 1     ← masih hidup (bahaya!)
console.log(b);   // ❌ ReferenceError
```

**Aturan praktis:** pakai `const` sebagai default. Ganti ke `let` hanya kalau nilainya memang berubah. **Jangan pakai `var`.**

Kenapa ini penting untuk debugging: kalau Anda menemukan `var` di kode lama (atau kode yang dihasilkan AI), **curigai bug closure di sekitarnya.**

---

## Bagian 2 — Closure: fungsi mengingat tempat ia dilahirkan

Ini definisinya, dan hanya satu kalimat ini yang perlu Anda ingat:

> **Fungsi mengingat variabel dari tempat ia DIBUAT — bukan dari tempat ia DIPANGGIL.**

Mari lihat.

```javascript
function buatPesan(nama) {
  return () => console.log("Halo, " + nama);
}

const sapaAni  = buatPesan("Ani");
const sapaBudi = buatPesan("Budi");

sapaAni();    // Halo, Ani
sapaBudi();   // Halo, Budi
```

Perhatikan: `buatPesan` sudah **selesai** dijalankan. Variabel `nama` seharusnya sudah hilang. Tapi fungsi yang dikembalikan masih bisa membacanya.

**Itu closure.** Fungsi "menutup" (closing over) variabel di sekitarnya, dan membawanya pergi.

Setiap pemanggilan `buatPesan` membuat **variabel `nama` yang baru**. Karena itu `sapaAni` dan `sapaBudi` tidak saling mengganggu.

### Yang paling penting: closure mengikat VARIABEL, bukan NILAI

Ini bagian yang menjebak. Baca dua contoh ini pelan-pelan.

**Contoh A — mengikat variabel (ikut berubah):**

```javascript
let nama = "Ani";
const sapa = () => console.log("Halo, " + nama);   // membaca VARIABEL nama

nama = "Budi";
sapa();   // Halo, Budi     ← ikut berubah
```

**Contoh B — nilai disalin dulu (jadi basi):**

```javascript
let nama = "Ani";
const namaTersalin = nama;                          // ← NILAI disalin di sini
const sapa = () => console.log("Halo, " + namaTersalin);

nama = "Budi";
sapa();   // Halo, Ani      ← BASI (stale)
```

**Bedanya:** Contoh A membaca variabelnya secara langsung, jadi selalu dapat nilai terbaru. Contoh B menyalin nilainya di awal, jadi terkunci di nilai lama.

**Contoh B inilah yang disebut *stale closure*.**

---

## Bagian 3 — Stale closure: bug yang tidak bersuara

Sekarang bentuk yang paling sering terjadi di kode nyata.

```javascript
function buatPemantau() {
  let jumlah = 0;

  // Fungsi ini dibuat SEKALI. Ia mengingat `jumlah` milik pemanggilan ini.
  const lapor = () => console.log("jumlah =", jumlah);

  const tambah = () => { jumlah = jumlah + 1; };

  return { tambah, lapor };
}

const { tambah, lapor } = buatPemantau();

tambah();
tambah();
lapor();   // jumlah = 2     ← ✅ benar, mereka berbagi variabel yang sama
```

Ini **benar**, karena `lapor` membaca variabel `jumlah` secara langsung (seperti Contoh A).

Stale terjadi kalau **nilainya disalin**:

```javascript
function buatPemantau() {
  let jumlah = 0;
  const laporanPertama = jumlah;          // ← 0, disalin SEKARANG

  const tambah = () => { jumlah = jumlah + 1; };
  const lapor = () => console.log("laporan =", laporanPertama);

  return { tambah, lapor };
}

const { tambah, lapor } = buatPemantau();
tambah();
tambah();
lapor();   // laporan = 0     ← ❌ BASI. jumlah sebenarnya 2.
```

Tidak ada error. Tidak ada peringatan. Hanya hasil yang salah.

### 🎯 Di React, bentuknya begini

Ini **pola yang persis sama**, hanya ditulis dengan React:

```jsx
// ❌ STALE CLOSURE
function Pemantau() {
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(jumlah);     // ← mengingat `jumlah` dari render PERTAMA, selamanya
    }, 1000);
    return () => clearInterval(id);
  }, []);                      // ← deps kosong = "jangan pernah buat ulang fungsi ini"

  return <button onClick={() => setJumlah(jumlah + 1)}>+1</button>;
}
```

Tekan tombol 5 kali → console tetap mencetak `0`.

**Kenapa:** fungsi di dalam `useEffect` dibuat **sekali** (karena deps `[]`). Ia mengikat `jumlah` dari render pertama. Render berikutnya membuat fungsi **baru** dengan `jumlah` yang baru — tapi React tidak memakai yang baru, karena Anda bilang "jangan pernah buat ulang".

**Dependency array itu artinya:** *"buat ulang fungsi ini kalau nilai-nilai ini berubah."* Bukan sekadar formalitas.

Dua perbaikan:

```jsx
// ✅ Cara 1 — pakai functional update (tidak butuh nilai dari luar)
useEffect(() => {
  const id = setInterval(() => {
    setJumlah(j => j + 1);     // ← `j` selalu nilai terbaru, bukan dari closure
  }, 1000);
  return () => clearInterval(id);
}, []);                         // deps kosong jadi aman, karena tidak ada yang di-capture

// ✅ Cara 2 — masukkan ke dependency array
useEffect(() => {
  const id = setInterval(() => {
    console.log(jumlah);
  }, 1000);
  return () => clearInterval(id);
}, [jumlah]);                   // ← fungsi dibuat ulang setiap `jumlah` berubah
```

**Inilah kenapa Langkah 2 ini ada sebelum Anda belajar React.** Kalau Anda tahu polanya di JavaScript biasa, Anda akan mengenalinya dalam 10 detik saat muncul di React — bukan berjam-jam.

### Pola nyata yang sering Anda temui

Polling yang selalu menampilkan data lama:

```jsx
// ❌ filter selalu bernilai dari render pertama — hasilnya selalu sama
useEffect(() => {
  const id = setInterval(() => {
    ambilData(filter);          // ← `filter` basi
  }, 5000);
  return () => clearInterval(id);
}, []);                          // ← lupa [filter]
```

Gejalanya: *"kok datanya tidak ikut berubah waktu saya ganti filter?"* Penyebabnya bukan API, bukan state — tapi closure.

> ### ⚠️ Jangan buka React dulu
>
> Dua contoh di atas ditulis dengan React supaya Anda **melihat bahwa polanya sama**. Anda belum perlu bisa menulisnya, dan Anda **tidak** boleh mulai belajar React sekarang.
>
> Alasannya: kalau Anda belajar React bersamaan dengan closure, Anda akan bingung mana yang salah — React-nya atau JavaScript-nya. Selesaikan dulu 6 langkah di folder ini. Baru setelah itu React akan terasa mudah, bukan membingungkan.

---

## Bagian 4 — `this` dan arrow function (singkat)
Ada satu perbedaan lagi antara fungsi biasa dan arrow function.

```javascript
const orang = {
  nama: "Ani",
  sapaBiasa: function() {
    console.log("Halo, " + this.nama);      // `this` = orang
  },
  sapaArrow: () => {
    console.log("Halo, " + this.nama);      // `this` BUKAN orang
  }
};

orang.sapaBiasa();   // Halo, Ani
orang.sapaArrow();   // Halo, undefined
```

| | `function() {}` | `() => {}` |
|---|---|---|
| `this` ditentukan | Saat **dipanggil** | Saat **dibuat** |
| Cocok untuk | Method object, class | Callback, event handler |

**Untuk keperluan Anda sekarang, satu aturan saja:**

> Pakai **arrow function** untuk semua callback dan event handler. Pakai `function` hanya kalau Anda memang butuh `this` yang berubah.

Alasannya: arrow function mengambil `this` dari tempat ia dibuat — jadi ia **tidak pernah "kehilangan" `this`** saat dikirim sebagai callback.

```javascript
// ❌ this hilang saat method dikirim sebagai callback
const tombol = document.querySelector("#tombol");
tombol.addEventListener("click", orang.sapaBiasa);   // Halo, undefined

// ✅ arrow function menyelamatkan
tombol.addEventListener("click", () => orang.sapaBiasa());   // Halo, Ani
```

---

## Latihan

**Kerjakan di kertas dulu. Tulis tebakan sebelum menjalankan.**

### Latihan 1 — `var` di dalam loop

```javascript
const fungsiList = [];

for (var i = 0; i < 3; i++) {
  fungsiList.push(() => console.log(i));
}

fungsiList[0]();
fungsiList[1]();
fungsiList[2]();
```

Tebakan Anda: ____

### Latihan 2 — versi `let`

```javascript
const fungsiList = [];

for (let i = 0; i < 3; i++) {
  fungsiList.push(() => console.log(i));
}

fungsiList[0]();
fungsiList[1]();
fungsiList[2]();
```

Tebakan Anda: ____

### Latihan 3 — variabel atau nilai?

```javascript
let pesan = "awal";
const tampilkan = () => console.log(pesan);
pesan = "berubah";
tampilkan();
```

Tebakan Anda: ____

### Latihan 4 — yang ini basi

```javascript
let pesan = "awal";
const salinan = pesan;
const tampilkan = () => console.log(salinan);
pesan = "berubah";
tampilkan();
```

Tebakan Anda: ____

### Latihan 5 — dua counter

```javascript
function buatCounter() {
  let hitungan = 0;
  return () => {
    hitungan = hitungan + 1;
    return hitungan;
  };
}

const counterA = buatCounter();
const counterB = buatCounter();

console.log(counterA());   // ?
console.log(counterA());   // ?
console.log(counterB());   // ?
console.log(counterA());   // ?
```

Tebakan Anda: ____

### Latihan 6 — perbaiki stale closure

```javascript
function buatLaporan() {
  let transaksi = [];

  const tambah = (jumlah) => {
    transaksi = [...transaksi, jumlah];       // ingat Langkah 1: array baru
  };

  const totalSaatDibuat = transaksi.length;   // ← ada yang salah di sini

  const lapor = () => console.log("jumlah transaksi:", totalSaatDibuat);

  return { tambah, lapor };
}

const { tambah, lapor } = buatLaporan();
tambah(100);
tambah(200);
lapor();
```

Ada **satu** bug. Temukan dan perbaiki.

---

<details>
<summary><strong>Jawaban dan penjelasan</strong></summary>

**1.** `3`, `3`, `3`

`var` membuat satu variabel `i` untuk seluruh loop. Ketiga fungsi menunjuk variabel yang sama. Saat dipanggil, loop sudah selesai → `i` bernilai `3`.

**2.** `0`, `1`, `2`

`let` membuat variabel `i` **baru di setiap iterasi**. Setiap fungsi menutup `i` miliknya sendiri.

**3.** `"berubah"`

Fungsi membaca **variabel** `pesan` secara langsung. Jadi selalu dapat nilai terbaru. Ini **bukan** stale.

**4.** `"awal"`

Nilai disalin ke `salinan` **sebelum** `pesan` diubah. Fungsi mengikat `salinan`, yang terkunci di `"awal"`. Ini **stale**.

**5.** `1`, `2`, `1`, `3`

`counterA` dan `counterB` punya variabel `hitungan` **masing-masing**, karena setiap pemanggilan `buatCounter()` membuat variabel baru. `counterA` jalan sendiri, `counterB` mulai dari nol lagi.

Ini contoh closure yang **bekerja untuk Anda**, bukan melawan Anda.

**6.** Bug: `totalSaatDibuat` **menyalin nilai** (`transaksi.length` = `0`) pada saat fungsi dibuat. Setelah `tambah` dipanggil dua kali, `lapor` tetap mencetak `0`.

```javascript
// ❌
const totalSaatDibuat = transaksi.length;
const lapor = () => console.log("jumlah transaksi:", totalSaatDibuat);

// ✅ Baca nilainya saat dipanggil, bukan disalin saat dibuat
const lapor = () => console.log("jumlah transaksi:", transaksi.length);
```

**Pelajaran dari keenam latihan:**

| Latihan | Hasil | Kenapa |
|---|---|---|
| 1 | `3,3,3` | `var` = satu variabel untuk semua iterasi |
| 2 | `0,1,2` | `let` = variabel baru tiap iterasi |
| 3 | nilai baru | Membaca **variabel** → selalu terbaru |
| 4 | nilai lama | **Nilai disalin** → basi |
| 5 | terpisah | Tiap pemanggilan = variabel baru |
| 6 | nilai lama | Bug nyata: disalin saat dibuat |

**Kalau Anda bisa membedakan Latihan 3 dan 4 tanpa ragu, Anda sudah paham closure.**

</details>

---

## Latihan tambahan — cari di kode nyata

```
1. Buka kode JavaScript/React Anda (atau minta AI menulis).
2. Cari semua tempat yang:
   - memakai `var` di dalam loop
   - punya useEffect dengan dependency array
   - menyimpan nilai ke variabel di luar fungsi, lalu memakainya di dalam fungsi
3. Tanya untuk masing-masing: "nilai ini dibaca saat dipanggil, atau
   disalin saat dibuat?"
4. Kalau ragu, uji: ubah nilainya setelah fungsi dibuat, lalu panggil fungsinya.
```

Kalau Anda menemukan **satu** `useEffect` dengan dependency array yang tidak lengkap — Langkah 2 sudah berhasil.

---

## Selesai Langkah 2 kalau Anda bisa

- [ ] Menjelaskan kenapa `var` dan `let` berbeda di dalam loop
- [ ] Menjelaskan apa artinya "fungsi mengingat tempat ia dilahirkan"
- [ ] Membedakan **mengikat variabel** (live) dan **menyalin nilai** (basi)
- [ ] Menjelaskan kenapa dependency array `useEffect` itu ada
- [ ] Menyebutkan satu cara memperbaiki stale closure di React
- [ ] Menjawab keenam latihan dengan benar **sebelum** melihat jawabannya

---

## Kalau masih bingung

Fokus ke **Latihan 1, 2, 3, dan 4.** Empat itu sudah memuat seluruh konsepnya. Latihan 5 dan 6 hanya variasi.

Kalau masih belum jelas, tempel ini ke AI:

```
Saya sedang belajar closure di JavaScript.
Penjelasan saya: [tulis pemahaman Anda]

Temukan di mana penjelasan saya SALAH atau kabur.
Beri saya satu contoh di mana pemahaman saya menghasilkan kesimpulan yang salah.
Jangan puji, langsung ke kelemahannya.
```

---

> **Lanjut ke:** [`03-debugging.md`](./03-debugging.md)
