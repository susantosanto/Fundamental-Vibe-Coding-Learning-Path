# Review Checklist — Pola DSA + Pertanyaan Terpandu Siap Pakai

> Dipakai saat deteksi (langkah 15–40' alur sesi). Setiap pola: cara
> mengenalinya, contoh sebelum/sesudah, dan pertanyaan terpandu yang sudah
> diformat protokol 4 blok — tinggal disesuaikan dengan kode nyata.

## Cara Menentukan Hot Path (pertanyaan konteks pembuka)

```
K1. "Fungsi/fitur mana yang paling sering dipanggil user?" (hot path)
K2. "Perkiraan jumlah data yang diproses: 100? 10.000? 1 juta?"
K3. "Adakah bagian yang sudah kamu ragukan sendiri?"
K4. "Kalau fitur ini dipakai 10x lipat, bagian mana yang kamu KIRIM
    akan bermasalah lebih dulu?" ← pertanyaan intensi (dari interview-me)
```
Urutan review: hot path dari K1 → bagian dari K3 → sisanya sekilas.

---

## Pola 1 — Linear Search di Dalam Loop ⭐ paling umum

**Kenali:** loop atau iterasi per item yang di dalamnya memanggil
`array.includes()/find()/filter()` atau scan list lain.

```javascript
// SEBELUM — 🟠 risiko skala: O(n×m)
for (const item of cart.items) {
  const product = allProducts.find(p => p.id === item.productId); // scan!
  total += product.price * item.qty;
}

// SESUDAH — hash map di luar loop: O(n+m)
const byId = new Map(allProducts.map(p => [p.id, p]));
for (const item of cart.items) {
  total += byId.get(item.productId).price * item.qty;
}
```

**Temuan 4 blok (template):**
```
🔍 TEMUAN 1 — linear-search-in-loop [severity: 🟠]

📄 DI KODE-MU: <file>::<fungsi>() — find() di dalam for-loop

💡 KENAPA INI PENTING
   Dengan 100 produk & 10 item = ±1.000 perbandingan — terasa cepat.
   Dengan 10.000 produk & 100 item = ±1 juta perbandingan per request —
   dan ini hot path (dipanggil tiap kali keranjang dibuka).

🌤️ ANALOGI SEDERHANA
   Seperti mencari harga tiap barang dengan membaca seluruh katalog
   dari awal, untuk setiap barang di keranjang.

❓ PERTANYAAN TERPANDU
   Operasi apa yang kamu ulangi paling banyak di fungsi ini — dan
   struktur data apa yang membuat operasi "mencari barang" jadi murah?
```

## Pola 2 — N+1 Query (di kode yang menyentuh database/API)

**Kenali:** fetch list → loop → fetch per item (DB/API/file).

```
❓ PERTANYAAN TERPANDU
   Hitung berapa kali kamu "menyentuh" database untuk 100 item.
   Bisakah kamu membawa semuanya dalam SATU trip — atau menaruh
   pencarian ke satu struktur yang dibuat SEBELUM loop?
```
(Analogi: belanja 1 keranjang sekaligus vs pulang-pergi toko 100×.)
Severity: 🟠 biasanya; 🔴 kalau di endpoint utama.

## Pola 3 — Nested Loop Pairing

**Kenali:** dua loop bersarang membandingkan semua pasangan.

```
❓ PERTANYAAN TERPANDU
   Kalau loop luarmu n dan loop dalamnya n lagi — berapa total langkah?
   Operasi "apakah sudah pernah terlihat" bisa disimpan di struktur apa,
   supaya loop dalamnya tidak perlu ada?
```
Severity: 🟡 kecil; 🟠 kalau datanya tumbuh; 🔴 kalau tanpa batas input.

## Pola 4 — Struktur Data Salah untuk Pola Akses

**Kenali:** gejala-gejala berikut:

| Gejala di kode | Pola akses sebenarnya | Struktur yang tepat |
|---|---|---|
| `array.unshift()` berulang di loop | tambah-depan cepat | deque / linked list |
| sort() ulang hanya untuk ambil terbesar | top-1/top-K berkali-kali | heap |
| array untuk cek keanggotaan berulang | lookup berulang | hash map / set |
| Object sebagai queue (shift di tengah) | FIFO | queue |
| recompute total/agg di setiap event | incremental update | running aggregate |

```
❓ PERTANYAAN TERPANDU (template umum)
   Operasi yang paling sering terjadi di sini adalah ___; struktur data
   yang kamu pakai memberi biaya ___ untuk operasi itu. Struktur apa
   yang memberi biaya lebih murah untuk operasi yang sama?
```

## Pola 5 — Recompute di Dalam Loop Panas

**Kenali:** perhitungan yang hasilnya tidak berubah dipanggil berulang
di dalam loop (subtotal, konstanta, panjang "statis", konfigurasi).

```
❓ PERTANYAAN TERPANDU
   Nilai yang dihitung di dalam loop ini — berubah tidak antar
   iterasi? Kalau tidak, kapan seharusnya dihitung, dan berapa kali?
```
Severity: 🟡; sambungkan ke memoization (Fase 3 cache / minggu 9 DP).

## Pola 6 — Rekursi Tanpa Dasar Bermemo / Eksponensial

**Kenali:** fungsi memanggil dirinya >1 kali per level (fibonacci-style).

```
❓ PERTANYAAN TERPANDU
   Gambar pohon pemanggilan untuk input kecil (n=5). Ada nilai yang
   dihitung berulang? Di mana hasil itu bisa disimpan?
```
Severity: 🟠 (bisa meledak cepat). Sambungan: DP minggu 9 dsa-roadmap.

## Pola 7 — Unbounded Growth

**Kenali:** struktur data yang hanya bertambah, tidak pernah dibersihkan
(cache tanpa batas, log array di memori, sesi yang menumpuk).

```
❓ PERTANYAAN TERPANDU
   Struktur ini bertambah setiap request. Kapan ia menyusut? Kalau
   tidak pernah — berapa ukurannya setelah 1 minggu jalan?
```
Severity: 🔴 selalu, dibahas paling awal. Sambungan: TTL/eviction (Fase 3).

---

## Bank Pertanyaan Sintesis (penutup sesi)

```
S1. "Pola temuan hari ini — akan muncul lagi di fitur mana berikutnya?"
S2. "Satu kebiasaan kecil apa yang akan kamu bawa ke kode berikutnya?"
S3. (kalau ada ⭐) "Keputusanmu yang ini — bagaimana kamu tahu itu tepat?"
```

## Template REVIEW-NOTES.md (versi ringkas siap tempel)

```markdown
# Review DSA — <tanggal> (sesi ke-N)
Proyek: <nama> · Hot path: <fungsi/fitur> · Skala asumsi: <angka K2>
## Yang sudah bagus (⭐)
- <keputusan + implikasi Big-O>
## Temuan
| # | Pola | Lokasi | Severity | Perbaikan | Dipahami via |
|---|------|--------|----------|-----------|--------------|
| 1 | <pola> | <file>::<fn> | 🟠 | <satu kalimat> | L<1-4> |
## Pola berulang (≥2 sesi) → lesson /teach-dsa
- <pola>
## Untuk sesi berikutnya
- <temuan yang belum dibahas>
```

## Pedoman Menahan Jawaban (untuk skill, bukan pembelajar)

```
- Jangan sebut nama pola SEBELUM pembelajar menggambarkan perilakunya
  (nama pola adalah hadiah setelah penemuan, bukan jalan pintas).
- Kalau pembelajar menjawab benar: minta dia menghitung ulang Big-O
  sebelum konfirmasi — konfirmasi tanpa hitungan = belum kokoh.
- Kalau meleset: L1 "apa yang kamu harapkan terjadi?" → L2 prinsip
  ("loop dalam loop mengalikan biaya") → L3 tunjuk baris + hitung ulang →
  L4 tunjukkan perbaikan (catat "dipahami via L4" di tabel — sinyal
  lesson /teach-dsa diperlukan).
- Kalau kode pembelajar ternyata sudah 🟢: jangan mengarang temuan.
  Katakan jujur, beri ⭐ kalau ada yang istimewa, lanjut ke sintesis.
```
