# 🐍 Tutorial: Membuat Game Snake dengan AI — Coding Hanya dengan Bicara

> **Durasi:** ~2 jam
> **Tingkat:** Pemula mutlak (tidak perlu bisa coding)
> **Output:** 1 game Snake interaktif yang bisa dimainkan di browser

---

## Pengantar

Selamat datang di pengalaman vibe coding pertama Anda! Di tutorial ini, Anda akan membuat game Snake yang bisa dimainkan — **tanpa menulis satu baris kode pun sendiri**.

Anda hanya perlu:
1. Buka browser
2. Bicara ke AI
3. Lihat AI menulis kode untuk Anda

Mari kita buktikan bahwa di era AI, **jika Anda bisa bicara, Anda bisa coding**.

---

## Bagian 1: Persiapan — Buka Platform AI Coding

### Langkah 1: Buka z.ai

Buka [chat.z.ai](https://chat.z.ai/) di browser Anda. `z.ai` adalah platform AI dari Zhipu AI yang mendukung full-stack development — AI bisa langsung membuat website yang bisa dijalankan.

### Langkah 2: Pilih Mode Development

Cari opsi yang memungkinkan Anda membuat aplikasi/web. Biasanya ada tombol atau menu untuk "Create App" atau "Development."

### Langkah 3: Siapkan Prompt Anda

Ini adalah bagian terpenting — Anda akan **berbicara ke AI** dan AI akan menulis kodenya.

---

## Bagian 2: Prompt Pertama — Buat Game Snake

### Prompt Dasar

Salin dan tempel prompt ini ke AI:

```
Buat game Snake (ular) yang bisa dimainkan di browser dengan ketentuan:

1. Ular bergerak dengan tombol panah (↑↓←→)
2. Ada makanan yang muncul random di layar
3. Setiap kali ular makan, panjangnya bertambah
4. Skor ditampilkan di atas layar
5. Game over jika ular menabrak dinding atau dirinya sendiri
6. Ada tombol restart setelah game over
7. Tampilkan skor tertinggi (high score)
8. Desainnya menarik, warna-warni, dan modern
```

AI akan mulai menulis kode HTML + CSS + JavaScript. Tunggu beberapa detik sampai selesai.

### Jika Ada Error

Jika AI menghasilkan error, jangan panik. Cukup screenshot errornya dan tanya AI:

```
Ada error seperti ini [screenshot]. Tolong perbaiki.
```

---

## Bagian 3: Kustomisasi — Bikin Snake Anda Unik

Setelah game dasar berfungsi, Anda bisa minta AI menambahkan fitur keren:

### Level 1: Tambah Fitur Dasar

```
Tambah fitur ini ke game Snake saya:
1. Ular bisa menembus dinding (muncul dari sisi lain)
2. Ada power-up yang muncul kadang-kadang
3. Power-up bikin ular jadi lebih cepat atau lebih panjang
4. Animasi yang halus dan keren
```

### Level 2: Tambah Tema

```
Tambah pilihan tema warna ke game Snake saya:
1. Tema Classic (hijau)
2. Tema Neon (warna-warna terang)
3. Tema Dark (gelap dengan aksen biru)
Buat selector tema di pojok kanan atas
```

### Level 3: Multiplayer Sederhana

```
Bisa tambah mode 2 pemain?
1. Pemain 1 pakai WASD
2. Pemain 2 pakai arrow keys
3. Siapa yang bertahan lebih lama menang
```

---

## Bagian 4: Debugging — Yang Harus Dilakukan Saat Error

### Error Umum dan Solusinya

| Error | Penyebab | Solusi |
|-------|----------|--------|
| Layar putih/blank | Kode error | Screenshot, minta AI perbaiki |
| Ular tidak bergerak | Event handler salah | "Tombol panah tidak berfungsi, tolong cek" |
| Skor tidak bertambah | Logic error | "Skor tidak bertambah saat ular makan" |
| Game over terus | Collision detection | "Ular mati padahal tidak nabrak apa-apa" |

### Prinsip Debugging

```
LIHAT ERROR → SCREENSHOT → TANYA AI → IKUTI SARAN AI
```

Jangan coba-coba memperbaiki sendiri. AI bisa debug jauh lebih cepat dari Anda!

---

## Bagian 5: Eksplorasi — Buat Game Lain

Setelah berhasil membuat Snake, coba game lain:

### Game 1: Flappy Bird

```
Buat game Flappy Bird:
1. Burung terbang dengan klik/spasi
2. Ada pipa yang datang dari kanan
3. Burung harus lewat di antara pipa
4. Skor bertambah setiap lewat pipa
5. Game over jika nabrak pipa atau jatuh
6. Desain yang lucu dan colorful
```

### Game 2: Tic-Tac-Toe

```
Buat game Tic-Tac-Toe (X dan O):
1. Bisa main 2 pemain
2. Ada indikator giliran
3. Tampilkan siapa yang menang
4. Tombol restart
5. Opsi main lawan AI (komputer)
```

### Game 3: Space Shooter

```
Buat game Space Shooter:
1. Pesawat pemain di bawah
2. Musuh datang dari atas
3. Tembak musuh dengan spasi
4. Skor bertambah setiap bunuh musuh
5. Ada nyawa (3 lives)
6. Efek ledakan yang keren
```

---

## Ringkasan

Di tutorial ini, Anda telah belajar:

1. ✅ **Buka platform AI coding** — z.ai atau sejenis
2. ✅ **Buat prompt yang jelas** — jelaskan apa yang Anda mau
3. ✅ **Iterasi dengan AI** — minta tambah fitur, perbaiki error
4. ✅ **Buat game sendiri** — tanpa nulis kode manual

**Pesan penting:** Ini baru permulaan. Jika Anda bisa membuat game dengan bicara, Anda bisa membuat aplikasi produktif dengan cara yang sama.

> 🎯 **Next step:** Lanjut ke [Bab 2: Alat AI IDE](../../02-alat-ai-ide/01-pengenalan-ai-ide.md) untuk belajar memindahkan development ke komputer lokal dengan alat yang lebih powerful.

---

*Lanjut ke: [02-Membangun-Website-dengan-AI-Agents.md](./02-membangun-website-dengan-ai-agents.md)*
