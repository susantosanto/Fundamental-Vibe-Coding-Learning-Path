# 05 — Bangun Satu Hal Kecil

> **Minggu 7** · 5 sesi × 1 jam
> **Sebelum ini:** `05-typescript.md`
> **Setelah ini:** selesai. Lihat checklist di bagian akhir.

---

## Aturan minggu ini

```
1. Sesuatu yang SELESAI dalam 1 minggu. Bukan proyek besar.
2. TANPA framework. JavaScript/TypeScript biasa dulu.
3. Tulis rencananya di kertas sebelum menulis kode.
4. Satu fungsi, uji, baru lanjut.
5. Setiap kali bingung → pakai prosedur dari 03-debugging.md
6. Setiap kali ada bug → tulis hipotesis DULU
```

**Kenapa tanpa framework:** React, Next.js, Vue — semuanya menyembunyikan JavaScript. Minggu ini tujuannya bertemu JavaScript **langsung**, supaya yang Anda pelajari di langkah 1–4 benar-benar terpakai.

Kalau Anda pakai React sekarang, Anda akan sibuk dengan React-nya, bukan dengan JavaScript-nya.

---

## Pilih satu (jangan dua)

### Pilihan A — Daftar tugas

**Fitur minimum:**
```
- Input untuk menambah tugas
- Daftar tugas tampil di halaman
- Tombol centang (selesai / belum)
- Tombol hapus
- Data tersimpan di localStorage (tidak hilang saat refresh)
```

**Yang terpakai dari langkah sebelumnya:**
- Referensi vs nilai → saat menghapus item dari array
- Async → `localStorage` itu sinkron, tapi perhatikan saat memuat data awal
- TypeScript → interface `Tugas`

---

### Pilihan B — Kalkulator dengan riwayat

**Fitur minimum:**
```
- Tombol angka dan operasi
- Tombol sama dengan
- Hasil tampil
- Riwayat perhitungan (5 terakhir)
- Tombol bersihkan
```

**Yang terpakai:**
- Referensi vs nilai → menyimpan riwayat (jangan sampai semua entri menunjuk object yang sama!)
- TypeScript → union type untuk operator

---

### Pilihan C — Pencarian dan filter

**Fitur minimum:**
```
- Daftar statis (10–20 data, tulis manual di kode)
- Kotak pencarian — filter sambil mengetik
- Dropdown filter kategori
- Menampilkan jumlah hasil
- Pesan "tidak ditemukan" kalau kosong
```

**Yang terpakai:**
- Array methods (`filter`, `map`, `includes`)
- Referensi vs nilai → jangan mutasi array asli
- TypeScript → interface untuk data

---

### Pilihan D — Penghitung uang sederhana

**Fitur minimum:**
```
- Form input: keterangan + jumlah + jenis (masuk/keluar)
- Daftar transaksi
- Total saldo terhitung otomatis
- Hapus transaksi
- Data tersimpan di localStorage
```

**Yang terpakai:**
- Referensi vs nilai → **sangat relevan** di sini
- TypeScript → union type `"masuk" | "keluar"`
- Ini paling dekat dengan aplikasi nyata

---

## Bonus: pakai closure di proyek Anda

Closure bukan teori. Ada **satu tempat** di setiap aplikasi di atas di mana closure benar-benar berguna — dan kalau Anda salah, Anda dapat bug yang tidak bersuara.

### Kalau pilih C — debounce pencarian

Masalahnya: setiap ketikan memicu pencarian. Kalau Anda mengetik "budi", itu 4 pencarian. Yang Anda mau: tunggu sampai berhenti mengetik.

```typescript
// Closure dipakai untuk MENGINGAT timer sebelumnya
function buatDebounce(fn: (teks: string) => void, jeda: number) {
  let timer: number | undefined;      // ← variabel ini diingat oleh fungsi di bawah

  return (teks: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(teks), jeda);
  };
}

const cariDenganJeda = buatDebounce(cari, 300);

document.querySelector("#kotakCari")!.addEventListener("input", (e) => {
  cariDenganJeda((e.target as HTMLInputElement).value);
});
```

**Kenapa ini bekerja:** `timer` hidup di dalam `buatDebounce`, dan fungsi yang dikembalikan mengingatnya. Setiap kali Anda mengetik, timer sebelumnya dibatalkan. Itu closure **bekerja untuk Anda**.

**Kalau Anda salah menaruh `timer`** — misalnya di dalam fungsi yang dikembalikan — maka setiap ketikan membuat timer baru, dan tidak ada yang dibatalkan. Hasilnya: pencarian tetap dijalankan 4 kali. Tidak ada error.

### Kalau pilih A atau D — simpan ke localStorage

```typescript
function buatPenyimpan(kunci: string) {
  let versiTerakhir = 0;               // diingat oleh closure

  return (data: unknown) => {
    versiTerakhir = versiTerakhir + 1;
    localStorage.setItem(kunci, JSON.stringify({ versi: versiTerakhir, data }));
    console.log(`[${kunci}] disimpan, versi ${versiTerakhir}`);
  };
}

const simpanTugas = buatPenyimpan("daftarTugas");
```

`simpanTugas` mengingat `versiTerakhir` dan `kunci` — tanpa perlu variabel global.

### Yang harus Anda tanyakan setiap kali memakai closure

```
1. Variabel ini harus diingat, atau dibuat baru setiap kali?
2. Kalau diingat — apakah nilainya harus yang TERBARU saat dipanggil?
   (kalau ya: baca variabelnya, jangan salin nilainya)
3. Kalau ada useEffect: apakah dependency array-nya sudah lengkap?
```

**Bukti Anda paham Langkah 2:** Anda bisa menunjukkan satu tempat di proyek Anda di mana closure dipakai dengan sengaja, dan menjelaskan kenapa `timer` diletakkan di situ.

---

## Cara mengerjakan (5 sesi)

### Sesi 1 — Rencana di kertas (jangan sentuh komputer)

```
Tulis:
1. Data apa yang saya butuhkan?
   contoh: tugas = { id, teks, selesai }

2. Fungsi apa saja yang saya butuhkan?
   contoh: tambahTugas(), hapusTugas(), toggleSelesai(), simpan(), muat()

3. Tampilan: apa yang muncul di halaman?
   contoh: input + tombol, daftar, pesan kosong

4. Apa yang terjadi saat tombol diklik?
   contoh: klik tambah → ambil teks → buat object → push ke array → render ulang
```

**Jangan menulis kode di sesi ini.** Kalau rencananya belum jelas di kertas, kodenya juga tidak akan jelas.

### Sesi 2 — Fungsi inti saja

```
- Tulis satu fungsi
- Uji dengan console.log (belum ada tampilan)
- Baru lanjut ke fungsi berikutnya
```

Contoh untuk Pilihan A:

```typescript
interface Tugas {
  id: number;
  teks: string;
  selesai: boolean;
}

let daftarTugas: Tugas[] = [];

function tambahTugas(teks: string): void {
  const tugas: Tugas = {
    id: Date.now(),
    teks: teks,
    selesai: false
  };
  daftarTugas = [...daftarTugas, tugas];    // ← salinan baru, bukan push
}

function hapusTugas(id: number): void {
  daftarTugas = daftarTugas.filter(t => t.id !== id);   // ← array baru
}

function toggleSelesai(id: number): void {
  daftarTugas = daftarTugas.map(t =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
}

// Uji dulu di console sebelum bikin tampilan
tambahTugas("Belajar referensi vs nilai");
console.log(daftarTugas);
```

**Perhatikan:** semua fungsi di atas **mengembalikan array baru**, bukan mengubah yang lama. Itu pelajaran dari `01-referensi-vs-nilai.md`.

### Sesi 3 — Tampilan

```
- Ambil elemen dengan document.querySelector
- Buat fungsi render() yang menggambar ulang daftar
- Panggil render() setiap kali data berubah
```

```typescript
function render(): void {
  const wadah = document.querySelector("#daftar")!;
  wadah.innerHTML = "";

  if (daftarTugas.length === 0) {
    wadah.innerHTML = "<p>Belum ada tugas</p>";
    return;
  }

  for (const tugas of daftarTugas) {
    const baris = document.createElement("div");
    baris.textContent = tugas.teks;
    if (tugas.selesai) baris.style.textDecoration = "line-through";
    wadah.appendChild(baris);
  }
}
```

### Sesi 4 — Interaksi

```
- Pasang addEventListener untuk setiap tombol
- Setiap handler: ubah data → panggil render()
```

```typescript
document.querySelector("#tombolTambah")!.addEventListener("click", () => {
  const input = document.querySelector("#inputTugas") as HTMLInputElement;
  if (!input.value.trim()) return;          // ← jangan tambah yang kosong
  tambahTugas(input.value);
  input.value = "";
  render();
});
```

### Sesi 5 — Simpan data + rapikan

```typescript
function simpan(): void {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muat(): void {
  const tersimpan = localStorage.getItem("daftarTugas");
  daftarTugas = tersimpan ? JSON.parse(tersimpan) : [];
}

// Panggil muat() saat aplikasi mulai
muat();
render();
```

**Catatan:** `JSON.parse` mengembalikan tipe `any`. Di TypeScript, beri tipe:

```typescript
daftarTugas = tersimpan ? (JSON.parse(tersimpan) as Tugas[]) : [];
```

---

## Latihan bonus: rusak lalu perbaiki

Setelah aplikasi Anda jalan, lakukan ini. Ini latihan yang paling mendekati debugging nyata.

```
1. Minta AI menyisipkan bug. Prompt:

   "Sisipkan SATU bug halus di file ini. Syaratnya:
    - Bisa dideteksi lewat perilaku yang salah (bukan crash)
    - Termasuk salah satu pola: referensi vs nilai, closure basi,
      off-by-one, await yang hilang, atau tipe yang salah
    - JANGAN beri tahu saya letaknya
    - Beri tahu saya HANYA gejalanya (apa yang akan terlihat salah)
    - JANGAN perbaiki apa pun"

2. Tunggu 1 hari supaya Anda lupa.
3. Debug pakai prosedur dari 03-debugging.md.
4. Catat: berapa lama, hipotesis pertama Anda benar atau tidak.
```

**Lakukan minimal 2 kali**, dengan pola bug yang berbeda. Kalau yang pertama "referensi vs nilai", minta yang kedua "closure basi".

Kenapa menunggu 1 hari: kalau langsung dikerjakan, Anda masih ingat di mana bug-nya disisipkan — dan itu bukan latihan.

---

## Selesai Langkah 6 kalau

- [ ] Aplikasi Anda **jalan** dan bisa dipakai
- [ ] Anda bisa menjelaskan setiap fungsi, tanpa melihat kode
- [ ] Tidak ada framework yang dipakai
- [ ] Anda menemukan dan memperbaiki minimal 1 bug sendiri
- [ ] Anda bisa menunjukkan **satu tempat** di kode Anda di mana referensi vs nilai penting
- [ ] Anda bisa menunjukkan **satu tempat** di kode Anda di mana closure dipakai dengan sengaja

---

# ✅ Ujian akhir — apakah Anda sudah paham fondasi?

Ini kriteria "selesai" dari `00-RENCANA.md`. Jawab **tanpa membuka catatan.**

1. Kenapa `let b = a` berbahaya kalau `a` itu array?
2. Kenapa `var i` di dalam loop membuat semua fungsi mencetak angka yang sama?
3. Kenapa data di React bisa "tidak mau berubah" walau kodenya terlihat benar?
4. Kenapa `setTimeout(..., 0)` tidak langsung jalan?
5. Apa bedanya `for...of` dan `forEach` untuk kode async?
6. Kalau ada bug, apa langkah pertama saya?

<details>
<summary><strong>Kunci jawaban</strong></summary>

**1.** Karena array itu **referensi** (alamat), bukan nilai. `let b = a` tidak menyalin array — ia membuat nama kedua untuk array yang sama. Mengubah lewat `b` mengubah `a` juga. Untuk menyalin, pakai `[...a]` atau `structuredClone(a)`.

**2.** Karena `var` membuat **satu** variabel untuk seluruh loop, sedangkan `let` membuat variabel baru setiap iterasi. Ketiga fungsi menutup variabel `i` yang sama, jadi saat dipanggil semuanya membaca nilai terakhir. Ganti ke `let` untuk memperbaikinya.

**3.** Karena **stale closure**. Fungsi di dalam `useEffect` dibuat sekali dan mengingat nilai dari render pertama. Kalau dependency array-nya kosong (`[]`), React tidak pernah membuat ulang fungsi itu — jadi ia terus membaca nilai lama. Perbaikan: lengkapi dependency array, atau pakai functional update (`setX(n => n + 1)`).

**4.** Karena `setTimeout` **menitipkan** pekerjaannya ke antrean macrotask. Angka `0` bukan berarti "sekarang", tapi "setelah semua kode saat ini selesai". JavaScript tidak pernah menunggu — ia lanjut ke baris berikutnya.

**5.** `forEach` **tidak menunggu** callback async — ia menjalankan semuanya lalu lanjut. `for...of` benar-benar menunggu satu per satu. Kalau urutan penting, pakai `for...of`. Kalau tidak, `Promise.all(arr.map(...))` lebih cepat.

**6.** Tulis dulu: (a) apa yang **seharusnya** terjadi, (b) hipotesis kenapa tidak terjadi. **Sebelum** mengubah kode apa pun. Lalu uji hipotesis dengan satu perubahan. Kalau tidak bisa menuliskan hipotesisnya, Anda belum paham masalahnya.

</details>

### Hasilnya

| Benar | Artinya |
|---|---|
| **6** | Anda sudah paham fondasi. Lanjut ke framework (React/Next.js) akan terasa jauh lebih mudah. |
| **4–5** | Bagus. Ulangi file yang jawabannya Anda lewatkan, lalu coba lagi minggu depan. |
| **0–3** | Belum. Ulangi langkah 1, 2, dan 3 dengan **latihannya**, bukan hanya membacanya. |

**Ingat:** kalau Anda bisa membaca jawaban di atas dan merasa "oh iya, saya tahu itu" — itu belum cukup. Yang diuji adalah bisa menjawab **tanpa** melihat. Rasa paham itu berbeda dari paham.

---

## Jembatan ke React — ini yang Anda cari

Sekarang Anda punya modalnya. Ini tabel yang menghubungkan **gejala di React** dengan **akar di JavaScript** yang sudah Anda pelajari:

| Gejala di React | Akar masalahnya di JavaScript | Langkah |
|---|---|---|
| "Data sudah berubah tapi layar tidak ikut berubah" | Mutasi array/object (`push`, `sort`, `splice`) — alamat tidak berubah | 01 |
| "Nilai di layar ketinggalan satu langkah" | Stale closure — state dibaca dari render lama | 02 |
| "Nilai di interval/polling selalu nilai pertama" | Stale closure + dependency array kosong | 02 |
| "`Cannot read properties of undefined (reading 'map')`" | Data belum ada / bentuknya tidak sesuai dugaan | 03, 05 |
| "Loading tidak pernah selesai, data kosong" | `await` hilang, atau `forEach` dengan callback async | 04 |
| "Fungsi async saya jalan tapi hasilnya kosong" | `forEach` tidak menunggu | 04 |
| "Error baru ketahuan setelah dipakai pengguna" | Tipe tidak diperiksa sebelum jalan | 05 |
| "Kenapa hasilnya `"12"` bukan `12`?" | `"5"` (string) vs `5` (number) — cek `typeof` | 03 |

**Cara memakainya saat Anda debugging React nanti:**

```
1. Lihat gejalanya
2. Cari baris yang cocok di tabel ini
3. Buka Langkah yang tertulis
4. Cek apakah kode Anda punya pola itu
```

Kalau gejalanya tidak ada di tabel — berarti Anda menemukan sesuatu yang baru. Itu bagus: catat, lalu tambahkan sendiri ke tabel ini.

---

## Setelah ini

Anda sudah punya fondasi. Langkah berikutnya yang masuk akal:

| Mau ke mana | Mulai dari |
|---|---|
| **Bikin tampilan web** | React, lalu Next.js — `arsitektur-vibe-coding/10-reactjs.md`, `12-nextjs.md` |
| **Bikin backend/API** | Node.js — `arsitektur-vibe-coding/11-nodejs.md` |
| **Pakai AI untuk membangun** | `architecture-planner/MATERI-PECAHAN/01` → `08` (metode kerja dengan AI) |
| **Perdalam debugging** | `fase-0-peta-belajar/debugging/03` → `08` |
| **Belajar arsitektur** | `fase-0-peta-belajar/arsitektur/01` → `04` |

**Saran:** jangan lompat ke framework langsung. Bangun **satu lagi** aplikasi kecil dengan JavaScript biasa. Dua proyek kecil mengajarkan lebih banyak daripada satu proyek yang dibantu framework.

---

> **Kembali ke:** [`00-RENCANA.md`](./00-RENCANA.md)
