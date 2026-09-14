# 03 — Async & Event Loop

> **Minggu 4–5** · 10 sesi × 1 jam (dua minggu, karena butuh waktu untuk "masuk")
> **Sebelum ini:** `03-debugging.md`
> **Setelah ini:** `05-typescript.md`

---

## Kenapa dua minggu

Ini bagian JavaScript yang paling sering **dihafal tanpa dipahami**. Orang tahu harus menulis `await`, tapi tidak tahu kenapa. Akibatnya saat ada bug async, mereka menebak.

Dua minggu karena konsepnya butuh waktu untuk mengendap. Jangan dipaksa selesai dalam 3 hari.

> **Hubungan dengan Langkah 2:** Anda sudah tahu bahwa fungsi mengingat variabel dari tempat ia dibuat. Di Langkah 4 ini, closure bertemu antrean — dan hasilnya adalah bug async yang paling membingungkan. Kalau bagian ini terasa sulit, buka lagi `02-scope-dan-closure.md`.

---

## Bagian 1 — JavaScript hanya punya satu pekerja

Ini kunci untuk memahami semuanya.

JavaScript menjalankan **satu baris pada satu waktu**. Ia tidak bisa mengerjakan dua hal bersamaan. Namanya *single-threaded*.

Pertanyaannya: kalau begitu, bagaimana ia bisa menunggu data dari internet tanpa membeku? Kalau ia benar-benar berhenti menunggu, halaman Anda akan nge-freeze setiap kali ada request.

**Jawabannya: ia tidak menunggu.**

```
Anda:  "Ambil data dari server ini."
JS:    "Oke, saya titipkan. Nanti kalau sudah siap, kasih tahu saya."
       → lalu LANJUT ke baris berikutnya
```

JS menitipkan pekerjaan yang butuh waktu (request, timer, baca file) ke luar dirinya. Ia lanjut mengerjakan baris berikutnya. Nanti, saat pekerjaan itu selesai, hasilnya dimasukkan ke **antrean** dan dikerjakan ketika JS sudah tidak sibuk.

---

## Bagian 2 — Latihan inti (paling penting di file ini)

**Tulis tebakan Anda di kertas dulu.** Jangan langsung jalankan. Ini latihan yang membuat konsepnya menempel.

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);                    // perhatikan: 0 milidetik

console.log("3");

Promise.resolve().then(() => {
  console.log("4");
});

console.log("5");
```

**Tebakan Anda:** ____

Jalankan di DevTools → tab Console (bukan di Node, supaya hasilnya sama).

<details>
<summary><strong>Jawaban dan kenapa</strong></summary>

**Output: `1, 3, 5, 4, 2`**

Bukan `1, 2, 3, 4, 5`. Ini yang mengejutkan hampir semua orang.

**Kenapa:**

**Langkah 1 — kode biasa dijalankan berurutan**

```
console.log("1")   → cetak 1
setTimeout(...)    → TITIPKAN ke luar, jangan tunggu
console.log("3")   → cetak 3
Promise.then(...)  → TITIPKAN juga
console.log("5")   → cetak 5
```

Jadi `1, 3, 5` keluar duluan. JS tidak menunggu apa pun.

**Langkah 2 — sekarang JS kosong, baru kerjakan antrean**

Ada dua antrean, dan **urutannya penting**:

| Antrean | Isi | Prioritas |
|---|---|---|
| **Microtask** | `Promise.then` | Lebih tinggi — dikerjakan duluan |
| **Macrotask** | `setTimeout` | Lebih rendah — dikerjakan belakangan |

Karena `4` ada di microtask dan `2` ada di macrotask, `4` keluar lebih dulu.

**Hasil akhir: `1, 3, 5, 4, 2`**

</details>

### Yang harus Anda ingat dari latihan ini

1. **`setTimeout(..., 0)` bukan berarti "sekarang".** Artinya: "kerjakan setelah semua kode saat ini selesai."
2. **`Promise` punya antrean sendiri** yang lebih diprioritaskan daripada `setTimeout`.
3. **JS tidak pernah menunggu.** Ia selalu lanjut, dan mengerjakan hasilnya nanti.
4. **Antrean + closure = sumber bug async.** Saat fungsi Anda dijalankan "nanti", ia membaca variabel dari tempat ia dibuat. Kalau variabel itu sudah berubah — atau sudah mati — Anda dapat hasil yang salah. Lihat Latihan 4 di bawah.

---

### Latihan penghubung — closure bertemu antrean

Ini gabungan Langkah 2 dan Langkah 4. **Tulis tebakan dulu.**

```javascript
let total = 0;

for (var i = 1; i <= 3; i++) {
  setTimeout(() => {
    total = total + i;
    console.log("i =", i, "| total =", total);
  }, 0);
}

console.log("setelah loop, total =", total);
```

**Dua pertanyaan:**
1. Apa yang dicetak oleh `console.log` di luar loop?
2. Berapa nilai `total` di akhir?

<details>
<summary><strong>Jawaban</strong></summary>

**1.** `setelah loop, total = 0`

`console.log` di luar loop jalan **lebih dulu** — karena `setTimeout` hanya menitipkan pekerjaannya ke antrean. Saat baris ini jalan, belum ada satu pun callback yang dijalankan.

**2.** Output lengkapnya:

```
setelah loop, total = 0
i = 4 | total = 4
i = 4 | total = 8
i = 4 | total = 12
```

Perhatikan: **`i = 4` tiga kali.** Ini persis jebakan `var` dari `02-scope-dan-closure.md`:

- `var` membuat **satu** variabel `i`. Ketiga callback menutup variabel yang sama.
- Loop selesai dengan `i = 4`, jadi ketiganya membaca `4`.
- `total` berakhir di `12` (`4 + 4 + 4`), padahal Anda mungkin mengharapkan `1 + 2 + 3 = 6`.

**Perbaikan:** ganti `var` dengan `let`.

```javascript
for (let i = 1; i <= 3; i++) {   // ← variabel i baru tiap iterasi
  setTimeout(() => {
    total = total + i;
    console.log("i =", i, "| total =", total);
  }, 0);
}
// i = 1 | total = 1
// i = 2 | total = 3
// i = 3 | total = 6
```

**Kenapa latihan ini penting:** di sini Anda melihat bahwa **bug async bukan selalu soal `await`.** Kadang akarnya closure. Kalau Anda hanya belajar `await`, bug ini akan sulit Anda temukan.

</details>


---

## Bagian 3 — Dari callback ke async/await

### Cara lama: callback

```javascript
ambilSiswa(id, function(siswa) {
  ambilKelas(siswa.kelasId, function(kelas) {
    ambilGuru(kelas.guruId, function(guru) {
      console.log(guru.nama);
      // makin dalam, makin susah dibaca
    });
  });
});
```

Ini disebut **callback hell**. Bekerja, tapi susah dibaca dan susah menangani error.

### Cara sekarang: async/await

```javascript
async function tampilkan() {
  const siswa = await ambilSiswa(id);
  const kelas = await ambilKelas(siswa.kelasId);
  const guru = await ambilGuru(kelas.guruId);
  console.log(guru.nama);
}
```

Dibaca seperti kalimat biasa. Ini cara yang Anda pakai sekarang.

**Arti `await`:** "tunggu hasilnya di sini, **tapi JS boleh mengerjakan hal lain sementara itu**."

`await` **tidak** membekukan halaman. Ia hanya menandai: "sisanya dari fungsi ini, kerjakan nanti setelah hasilnya siap."

### Aturan sederhana

```
- Fungsi yang memakai await HARUS ditandai async
- await hanya boleh dipakai di dalam fungsi async
- Fungsi async SELALU mengembalikan Promise
```

---

## Bagian 4 — Tiga kesalahan async paling umum

### Kesalahan 1 — Lupa `await`

```javascript
// ❌
async function ambilData() {
  const data = fetch("/api/siswa").json();
  return data;        // mengembalikan Promise, bukan data
}

// ✅
async function ambilData() {
  const response = await fetch("/api/siswa");
  return await response.json();
}
```

**Kenapa berbahaya:** tidak memunculkan error. Anda hanya mendapat `Promise { <pending> }` di tempat yang seharusnya ada data, dan bug muncul jauh dari sini.

**Cara mengenali:** kalau Anda melihat `Promise { <pending> }` di console, hampir pasti ada `await` yang hilang.

---

### Kesalahan 2 — `forEach` tidak menunggu

```javascript
// ❌
async function simpanSemua(daftar) {
  daftar.forEach(async (item) => {
    await simpan(item);
  });
  console.log("selesai");     // ← jalan SEBELUM semua simpan selesai
}
```

`forEach` tidak peduli callback-nya async. Ia menjalankan semuanya lalu lanjut — tanpa menunggu.

```javascript
// ✅ Kalau URUTAN penting — pakai for...of
async function simpanSemua(daftar) {
  for (const item of daftar) {
    await simpan(item);       // benar-benar menunggu satu per satu
  }
  console.log("selesai");     // benar
}

// ✅ Kalau urutan TIDAK penting — jalankan paralel (lebih cepat)
async function simpanSemua(daftar) {
  await Promise.all(daftar.map(item => simpan(item)));
  console.log("selesai");     // benar
}
```

**Kapan pakai yang mana:**

| | `for...of` | `Promise.all` |
|---|---|---|
| Urutan | Terjamin, satu per satu | Tidak terjamin |
| Kecepatan | Lambat (menunggu satu-satu) | Cepat (bersamaan) |
| Pakai kalau | Urutan penting, atau ada dependensi | Operasi tidak saling bergantung |

---

### Kesalahan 3 — Tidak menangani error

```javascript
// ❌ Kalau fetch gagal, error-nya hilang
async function ambilData() {
  const response = await fetch("/api/siswa");
  return await response.json();
}

// ✅
async function ambilData() {
  try {
    const response = await fetch("/api/siswa");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("[ambilData] gagal:", error);
    throw error;              // teruskan, jangan telan
  }
}
```

**Catatan penting:** `fetch` **tidak** melempar error untuk HTTP 404 atau 500. Ia hanya gagal untuk masalah jaringan. Jadi Anda harus memeriksa `response.ok` sendiri.

---

## Latihan minggu ini

### Latihan 1 — Prediksi urutan (wajib)

Kerjakan latihan di Bagian 2 **tanpa** melihat jawaban. Tulis tebakan, baru jalankan.

Kalau tebakan Anda salah, **ulangi** dengan kode yang lebih rumit:

```javascript
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
  return Promise.resolve();
}).then(() => console.log("D"));

setTimeout(() => console.log("E"), 0);

console.log("F");
```

Tebakan: ____

<details>
<summary><strong>Jawaban</strong></summary>

`A, F, C, D, B, E`

- `A`, `F` — kode biasa, langsung
- `C`, `D` — microtask (Promise), dikerjakan berurutan di antrean microtask
- `B`, `E` — macrotask (setTimeout), dikerjakan setelah semua microtask selesai, sesuai urutan pendaftaran

</details>

### Latihan 2 — Perbaiki kode ini

```javascript
async function hitungTotalBelanja(daftarBarang) {
  let total = 0;

  daftarBarang.forEach(async (barang) => {
    const harga = await ambilHarga(barang.id);
    total = total + harga;
  });

  return total;
}
```

Ada **dua** bug. Temukan dan perbaiki.

<details>
<summary><strong>Jawaban</strong></summary>

**Bug 1:** `forEach` tidak menunggu, jadi `return total` jalan sebelum semua `ambilHarga` selesai. Hasilnya `0` atau angka sebagian.

**Bug 2:** bahkan kalau `forEach` menunggu, `total` dimodifikasi dari beberapa "jalur" sekaligus — ini pola berbahaya.

```javascript
// ✅ Perbaikan
async function hitungTotalBelanja(daftarBarang) {
  const daftarHarga = await Promise.all(
    daftarBarang.map(barang => ambilHarga(barang.id))
  );
  return daftarHarga.reduce((total, harga) => total + harga, 0);
}
```

Atau kalau urutan penting:

```javascript
async function hitungTotalBelanja(daftarBarang) {
  let total = 0;
  for (const barang of daftarBarang) {
    total = total + await ambilHarga(barang.id);
  }
  return total;
}
```

</details>

### Latihan 3 — Di kode Anda sendiri

Cari di kode Anda:
- Semua `forEach` yang callback-nya `async` → curigai bug
- Semua `fetch` tanpa `await` → curigai bug
- Semua `fetch` tanpa pemeriksaan `response.ok` → curigai bug

---

## Selesai Langkah 4 kalau Anda bisa

- [ ] Memprediksi urutan output kode async dengan benar
- [ ] Menjelaskan kenapa `setTimeout(..., 0)` tidak langsung jalan
- [ ] Menjelaskan bedanya microtask dan macrotask
- [ ] Tahu kapan pakai `for...of` vs `Promise.all`
- [ ] Menjelaskan kenapa `var` di dalam loop merusak hasil async
- [ ] Menemukan `await` yang hilang di kode Anda sendiri
- [ ] Menjelaskan kenapa `fetch` tidak melempar error untuk HTTP 500

---

## Kalau masih bingung

Fokus ke **Bagian 2**, **Latihan 1**, dan **Latihan penghubung**. Kerjakan berulang-ulang dengan variasi kode yang Anda buat sendiri. Kuncinya adalah memprediksi urutan — begitu Anda bisa memprediksi dengan benar, konsepnya sudah masuk.

---

> **Lanjut ke:** [`05-typescript.md`](./05-typescript.md)
