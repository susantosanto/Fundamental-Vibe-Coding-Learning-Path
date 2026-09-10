# Prompt Engineering untuk Generasi Kode: Memimpin Simfoni AI 🎭

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/prompt-engineering-guide.md

Sebagai *vibe coder*, kita paham bahwa lanskap coding modern sudah berubah total. Kita tidak lagi menulis setiap baris kode sendiri — kita jadi **konduktor** yang mengarahkan AI untuk menerjemahkan visi kreatif menjadi kode yang berfungsi. Panduan ini membahas seni *prompt engineering* khusus untuk generasi kode: cara menyampaikan niat estetika dan fungsionalmu kepada AI.

> 📌 **Buat yang masih baru:** *Prompt* adalah teks instruksi yang kamu ketik ke AI. *Prompt engineering* adalah keterampilan menyusun instruksi itu supaya AI paham persis apa yang kamu mau — mirip memberi brief ke desainer atau kontraktor, bukan sekadar "tolong bikin aplikasi".

## Pola Pikir Konduktor 🧠

Prompt engineering yang efektif dimulai dari kerangka mental yang benar:

- **Pemegang Visi**: Kamu memegang gambaran lengkap tentang apa yang sedang dibuat.
- **Komunikator Niat**: Kamu menerjemahkan konsep abstrak menjadi arah yang jelas.
- **Penjaga Kualitas**: Kamu mengevaluasi dan menyempurnakan hasil terhadap visimu.
- **Penyedia Konteks**: Kamu memasok latar belakang yang dibutuhkan AI untuk sukses.
- **Penyempurna Iteratif**: Kamu memandu perbaikan kode secara bertahap.

> 💡 **Tips vibe:** Kamu tidak perlu tahu cara menulis setiap baris kode — tapi kamu HARUS tahu apa yang mau dicapai kode itu dan bagaimana seharusnya rasanya.

## Struktur Prompt untuk Generasi Kode 📝

### Anatomi Prompt Kode yang Efektif
- **Penetapan Konteks**: Informasi latar yang perlu dipahami AI.
- **Pernyataan Tujuan**: Deskripsi jelas tentang apa yang mau kamu buat.
- **Arahan Vibe**: Suasana, gaya, dan estetika yang ingin dicapai.
- **Parameter Teknis**: Bahasa, kerangka kerja, atau batasan yang perlu dipertimbangkan.
- **Panduan Visual**: Referensi, contoh, atau sumber inspirasi.
- **Ekspektasi Kualitas**: Standar kode yang ingin kamu ikuti.

> 💡 **Tips vibe:** Susun prompt seperti *creative brief*, bukan spesifikasi teknis yang kaku.

### Contoh Templat Prompt

```
Konteks:
Saya sedang membuat [jenis aplikasi] yang [tujuan/fungsi]. Ini bagian dari proyek yang lebih besar dengan [estetika/vibe yang relevan].
Tujuan:
Buat kode untuk [komponen/fitur spesifik] yang akan [fungsi yang diinginkan].
Arahan Vibe:
Kodenya harus terasa [kualitas estetika] dan memberi pengalaman pengguna yang [respons emosional]. Bayangkan [titik referensi atau inspirasi].
Parameter Teknis:
- Pakai [bahasa pemrograman/kerangka kerja]
- Harus bisa bekerja dengan [sistem/dependensi yang ada]
- Pertimbangkan [performa/aksesibilitas/persyaratan lain]
- Ikuti [gaya kode/pola]
Referensi Visual:
[Deskripsi elemen visual, link inspirasi, atau deskripsi nuansa UI/UX]
Contoh:
[Kode serupa atau fungsionalitas yang tersedia, kalau ada]
Catatan Tambahan:
[Informasi lain yang relevan, kasus tepi (edge case), atau kekhawatiran spesifik]
```

## Contoh Prompt Siap Pakai 🧪

### Contoh 1: Form Login Vaporwave

```
Konteks:
Saya sedang membuat platform penemuan musik dengan estetika vaporwave. Aplikasinya web, dibangun dengan React dan styled-components.
Tujuan:
Buat kode untuk komponen form login yang menangani autentikasi email/password.
Arahan Vibe:
Formnya harus terasa seperti mimpi dan nostalgia dengan sentuhan digital. Interaksinya terasa seperti melayang di dalam matahari terbenam digital. Bayangkan estetika komputasi era 80-an/90-an bertemu prinsip desain modern.
Parameter Teknis:
- Pakai React dengan TypeScript dan styled-components
- Sertakan validasi form dengan pesan error yang bermakna
- Dukung navigasi keyboard dan aksesibilitas
- Implementasikan transisi halus antar state
Referensi Visual:
Warna pakai gradien dari ungu tua ke biru listrik dengan aksen pink. Tipografi memadukan sans-serif modern untuk input dan font komputer retro untuk judul.
Catatan Tambahan:
Sertakan opsi "lupa password" dan tampilkan umpan balik validasi saat pengguna mengetik, bukan cuma saat submit.
```

### Contoh 2: Visualisasi Data Cyberpunk

```
Konteks:
Saya sedang membangun dashboard untuk alat pemantauan jaringan bertema cyberpunk menggunakan D3.js dan React.
Tujuan:
Buat komponen visualisasi grafik koneksi real-time yang menampilkan node (perangkat) dan edge (koneksi) dengan indikator aktivitas.
Arahan Vibe:
Visualisasinya harus terasa seperti antarmuka dystopian berteknologi tinggi — latar gelap dengan sorotan neon terang, tepi tajam, dan efek glitch digital. Interaksinya responsif dan sedikit "berlistrik".
Parameter Teknis:
- Pakai D3.js untuk visualisasi di dalam komponen React
- Dukung zoom dan pan untuk menjelajahi jaringan
- Animasikan transisi saat data berubah
- Optimalkan rendering untuk banyak node (100+)
Referensi Visual:
Estetikanya menyerupai antarmuka dari Blade Runner 2049 atau Cyberpunk 2077 — latar gelap dengan sorotan cyan/magenta terang, scanline atau pola grid halus, dan elemen berpendar.
Contoh:
Mirip force-directed graph, tapi dengan nuansa lebih bersudut dan digital, bukan organik.
Catatan Tambahan:
Node harus berdenyut saat mengirim data, dan koneksi harus menunjukkan arah aliran dengan jalur beranimasi.
```

### Contoh 3: Aplikasi Todo Lo-Fi

```
Konteks:
Saya sedang membuat aplikasi todo minimal dengan estetika lo-fi yang tenang, membantu pengguna fokus tanpa gangguan.
Tujuan:
Buat kode untuk komponen daftar todo yang mendukung menambah, menyelesaikan, dan menyaring tugas.
Arahan Vibe:
Aplikasinya harus terasa hangat, sedikit tidak sempurna, dan sengaja dibuat sederhana — seperti buku catatan fisik atau daftar di kertas. Interaksinya lembut dan bisa diprediksi, menciptakan rasa produktivitas yang tenang.
Parameter Teknis:
- Pakai JavaScript vanilla, HTML dan CSS (tanpa framework)
- Dukung local storage untuk penyimpanan
- Pastikan jalan baik di desktop dan mobile
- Jaga performa tetap ringan dan cepat
Referensi Visual:
Gunakan tekstur latar seperti kertas, warna tanah yang kalem, dan font bergaya tulisan tangan. Elemen boleh sedikit asimetris atau tidak sempurna supaya terasa buatan manusia, bukan digital.
Catatan Tambahan:
Hindari warna terang, transisi tajam, atau suara notifikasi yang mengganggu rasa tenang. Animasi minimal dan halus saja.
```

### Contoh 4: Menu Game Retro

```
Konteks:
Saya sedang mengembangkan game platformer browser bergaya retro menggunakan Phaser.js.
Tujuan:
Buat layar menu utama dengan opsi "Mulai Game", "Opsi", dan "Skor Tertinggi".
Arahan Vibe:
Menunya harus terasa seperti game era 16-bit tahun 90-an, dengan gaya pixel art dan efek ala chiptune. Harus membangkitkan nostalgia tapi tetap bersih dan mudah digunakan.
Parameter Teknis:
- Pakai framework Phaser.js
- Implementasikan navigasi keyboard dan mouse/touch
- Sertakan efek suara untuk pemilihan dan konfirmasi
- Jaga menu responsif di berbagai ukuran layar
Referensi Visual:
Inspirasi dari menu game SNES dan Sega Genesis — gaya pixel art, palet warna terbatas, dan animasi sederhana untuk item yang dipilih.
Catatan Tambahan:
Tambahkan animasi latar halus seperti awan melayang atau karakter yang idle supaya menu terasa hidup. Sertakan efek suara retro untuk navigasi.
```

## Jenis Prompt untuk Berbagai Tugas Coding 🧩

### Prompt Arsitektur ⚙️ (untuk merancang struktur sistem)
- Tekankan hubungan antar komponen.
- Definisikan batas dan antarmuka yang jelas.
- Tentukan batasan teknis dan ekspektasi performa.
- Sertakan pertimbangan skalabilitas dan pemeliharaan.
- Rujuk arsitektur atau pola yang serupa.

**Contoh:** "Rancang arsitektur sistem untuk aplikasi visualisasi musik ala vaporwave yang memproses audio real-time dan menghasilkan efek visual responsif. Arsitekturnya harus menekankan transisi halus, berkualitas seperti mimpi, dan mendukung kustomisasi tema visual oleh pengguna. Pakai React untuk frontend dan Web Audio API untuk pemrosesan suara."

### Prompt Komponen 🔩 (untuk membangun fitur spesifik)
- Jelaskan tujuan dan perilaku komponen.
- Tentukan input, output, dan manajemen state.
- Rinci interaksi dengan komponen lain.
- Sertakan penanganan error dan kasus tepi.
- Deskripsikan pengalaman pengguna dari komponen itu.

**Contoh:** "Buat komponen dropdown menu bergaya neon di React yang beranimasi halus saat hover dan dipilih. Harus berpendar dengan estetika cyberpunk, menghasilkan suara elektronik halus saat interaksi, dan mendukung item menu bertingkat. Sertakan navigasi keyboard dan kompatibilitas screen reader yang benar."

### Prompt Styling 🎨 (untuk implementasi visual)
- Berikan palet warna dan preferensi tipografi.
- Deskripsikan animasi dan transisi.
- Tentukan perilaku responsif di berbagai perangkat.
- Rujuk inspirasi visual atau sistem desain yang ada.
- Rinci respons emosional yang ingin dibangkitkan.

**Contoh:** "Buat CSS untuk komponen kartu retro-futuristik dengan latar gradien yang bertransisi antara ungu tua dan biru listrik. Kartunya harus punya animasi hover halus yang menunjukkan kedalaman holografik, dengan tipografi yang terasa seperti visi tahun 1980-an tentang masa depan. Sertakan efek glow yang berdenyut pelan untuk menciptakan rasa teknologi yang hidup."

### Prompt Debugging 🐛 (untuk memperbaiki masalah)
- Deskripsikan perilaku yang diharapkan.
- Rinci perilaku bermasalah saat ini.
- Sertakan pesan error dan kode yang relevan.
- Tentukan konteks dan lingkungan.
- Minta penjelasan di samping perbaikan.

**Contoh:** "Animasi latar partikel saya bermasalah di perangkat mobile, frame rate-nya turun. Efeknya pakai Three.js dengan sekitar 5000 partikel yang merespons gerakan mouse/touch. Saya butuh optimasi yang menjaga estetika yang mengalir dan seperti mimpi sambil meningkatkan performa di ponsel kelas menengah. Ini implementasi saat ini: [kode]"

## Siklus Prompt Iteratif 🔄

Kode hebat jarang lahir dari satu prompt. Anggap prompt engineering sebagai percakapan:

### 1. Arah Awal 🏹
- Mulai luas tapi jelas.
- Tetapkan persyaratan fundamental.
- Arahkan estetika.
- Minta implementasi dasar.

> **Kondisi vibe:** Kejelasan yang eksploratif.

### 2. Dialog Penyempurnaan 🔍
- Beri umpan balik pada kode yang dihasilkan.
- Ajukan pertanyaan spesifik tentang pilihan implementasi.
- Minta penyesuaian supaya lebih sesuai visi.
- Minta penjelasan untuk hal yang tidak kamu pahami.

> **Kondisi vibe:** Evolusi yang kolaboratif.

### 3. Peningkatan Detail 💎
- Fokus pada kasus tepi dan kondisi khusus.
- Sempurnakan performa dan pengalaman pengguna.
- Tangani aksesibilitas dan kompatibilitas.
- Sempurnakan detail estetika.

> **Kondisi vibe:** Harmoni yang teliti.

### 4. Panduan Integrasi 🧩
- Diskusikan bagaimana kode masuk ke sistem yang lebih besar.
- Tangani potensi konflik dengan kode yang ada.
- Pastikan konsistensi dengan komponen lain.
- Verifikasi semua persyaratan terpenuhi.

> **Kondisi vibe:** Penyelesaian yang utuh.

## Contoh Percakapan Dunia Nyata 🗣️

Berikut contoh percakapan iteratif antara vibe coder dan AI:

```
MANUSIA: Saya perlu membuat komponen kartu profil pengguna untuk aplikasi media sosial bertema cyberpunk. Kartunya harus menampilkan avatar, nama, status, dan statistik utama pengguna (pengikut, postingan, dll). Aplikasinya dibangun dengan React dan Tailwind CSS.

AI: Saya akan membuat komponen kartu profil pengguna bertema cyberpunk menggunakan React dan Tailwind CSS. Ini implementasinya:
[AI menghasilkan komponen dengan latar gelap, aksen cyan, garis grid, font monospace, indikator status berdenyut, tombol CONNECT, dan level pengguna]

AI menjelaskan fiturnya:
- Latar gelap dengan aksen cyan ala cyberpunk
- Overlay garis grid untuk nuansa "antarmuka digital"
- Font monospace untuk estetika teknologi
- Elemen bercahaya menggunakan warna Tailwind
- Animasi halus pada interaksi
- Indikator status yang berdenyut saat online

Untuk menggunakannya, kamu perlu mengoper objek user dengan properti yang diperlukan.
```

> 💡 **Pelajaran dari contoh:** Perhatikan bahwa AI di sini tidak cuma memberi kode, tapi juga **menjelaskan pilihannya** dan **cara pakainya**. Kalau AI tidak menjelaskan, kamu bisa minta: "Jelaskan keputusan desainmu dan cara menggunakannya."

## Intinya buat pemula

- **Pola pikir**: Kamu konduktor — tahu "apa" dan "bagaimana rasanya", bukan selalu "bagaimana kodenya".
- **Anatomi prompt**: Konteks + Tujuan + Vibe + Parameter Teknis + Referensi Visual + Ekspektasi. Lengkapi keenamnya untuk hasil terbaik.
- **Gunakan templat**: Salin templat di atas, isi bagian dalam kurung siku [ ].
- **Bersikap iteratif**: Satu prompt tidak cukup. Rencanakan 4 ronde: arah awal → penyempurnaan → detail → integrasi.
- **Contoh itu emas**: "Seperti [sesuatu yang dikenal]" jauh lebih kuat daripada "buat yang bagus".
- **Minta penjelasan**: Jangan ragu bertanya "kenapa begini?" — itu juga cara kamu belajar.
