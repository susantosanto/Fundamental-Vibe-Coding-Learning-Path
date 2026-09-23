# Bank Pertanyaan teach-clarifier

Setiap pertanyaan di bawah SUDAH dalam format 4 blok — salin, sesuaikan angka
atau konteks, kirim SATU per giliran. Jangan kirim lebih dari satu pertanyaan
sekaligus. `🛟 default` selalu sah dan tetap menghasilkan rencana.

---

## Jenis B — Penetapan Target Fase

### B-1 (untuk fase apa pun)

```
❓ PERTANYAAN 1/3
   Setelah fase ini selesai, kamu mau bisa MEMBUAT apa yang sekarang
   tidak bisa kamu buat?

💡 KENAPA DITANYA
   Target yang bisa dilihat ("bisa gambar diagram X dari ingatan")
   3x lebih mudah dicapai daripada target rasa ("paham caching").
   Jawabanmu jadi kriteria lulus checkpoint fase ini.

🌤️ ANALOGI SEDERHANA
   Seperti latihan gym: "mau sehat" terlalu kabur; "naik 10 tangga tanpa
   terengah" bisa diuji — dan kamu tahu kapan sudah sampai.

✍️ CONTOH JAWABAN
   Bagus: "Bisa menjelaskan kenapa tokoku lambat kalau diskon, dan
   menggambar skema cache + queue-nya."
   Kabur: "Paham soal scale-up." (kita pertajam bersama jadi yang di atas)

🛟 BELUM TAHU? JAWABAN INI SAH:
   "Belum tahu apa yang wajar bisa dilakukan setelah fase ini" —
   maka kita pakai kriteria bawaan fase (roadmap-12-fase.md §checkpoint).
```

### B-2 — Fase 1–2 (konsep inti & komunikasi)

```
❓ PERTANYAAN 2/3
   Coba ceritakan alur apa yang terjadi dari kamu mengetik
   google.com sampai halamannya muncul — sedetail yang kamu bisa.

💡 KENAPA DITANYA
   Ini "deteksi DNS". Jawabanmu memetakan konsep mana yang sudah
   tertanam (DNS, HTTP, server, render) dan mana yang bolong —
   menentukan mulai minggu ke berapa di Fase 1.

🌤️ ANALOGI SEDERHANA
   Seperti mengirim surat: alamatnya bagaimana diterjemahkan, siapa
   yang mengantar, siapa yang menerimanya. Sistem web sama persis —
   hanya namanya DNS, jaringan, dan server.

✍️ CONTOH JAWABAN
   Bagus: "Browser nanya ke DNS → dapat IP → buka koneksi TCP/TLS →
   kirim HTTP request → server balas HTML → browser render."
   Kabur: "Ya servernya proses terus balikin web-nya."

🛟 BELUM TAHU? JAWABAN INI SAH:
   "Baru tahu garis besarnya" — Fase 1 minggu 1–2 dibuat persis untuk
   mengisi rantai ini konsep demi konsep.
```

### B-3 — Fase 3–6 (komponen & trade-off)

```
❓ PERTANYAAN 3/3
   Kalau datamu sekarang 100x lipat dari hari ini, keputusan apa
   yang kamu ambil lebih dulu?

💡 KENAPA DITANYA
   100x memaksa keluar dari "tinggal upgrade server" (scaling vertikal)
   menuju keputusan arsitektur (cache? sharding? replica?). Jawabanmu
   menunjukkan trade-off mana yang sudah kamu miliki — inti Level 2.

🌤️ ANALOGI SEDERHANA
   Toko kelontong yang jadi supermarket: tidak cukup ganti rak lebih
   besar — harus pikir gudang (database terpisah), etalase favorit
   di depan (cache), dan antrean kasir tambahan (queue).

✍️ CONTOH JAWABAN
   Bagus: "Cek dulu query terberat → pasang cache untuk yang paling
   sering dibaca → baru pikir pecah database kalau tulisannya numpuk."
   Kabur: "Beli server lebih gede." (sah — itu jawaban Level 1,
   dan Fase 3+ ada untuk menambah pilihan lain)

🛟 BELUM TAHU? JAWABAN INI SAH:
   "Baru sadar ada banyak pilihan" — bagus, kesadaran itu kemajuan;
   Fase 3–6 memberimu masing-masing pilihan + kapan pakainya.
```

---

## Jenis C — Checkpoint (uji penerapan, bukan hafalan)

Aturan umum: soal = situasi nyata, jawab = keputusan + ALASAN. Salah →
3 blok penghormatan: (1) apa yang masuk akal dari jawaban itu, (2) petunjuk
pertama, (3) halaman sumber untuk baca ulang. Contoh siap pakai:

### C-F1 — CAP & konsistensi (Fase 1)

```
Soal: Aplikasi rekening bank kehilangan jaringan antar datacenter.
Tampilan mana yang kamu pilih: saldo lama tapi aplikasi tetap jalan,
atau aplikasi error sampai koneksi pulih? Kenapa?

Penghormatan saat salah:
  ✔ masuk akal: "yang penting jalan" — itu pilihan availability.
  🔍 petunjuk: pertanyaan baliknya — kalau dua karyawan melihat saldo
    berbeda di saat yang sama dan keduanya menarik uang, siapa yang
    menanggung selisihnya?
  📖 baca ulang: fase-1/04-availability-vs-consistency.md §CAP
```

### C-F3 — Cache strategy (Fase 3)

```
Soal: Dashboard harga crypto di-refresh setiap 1 detik oleh 50.000 user.
Harga berubah tiap detik juga. Pasang cache entah bagaimana malah
membuat data basi. Apa keputusanmu?

Penghormatan saat salah:
  ✔ masuk akal: "cache = selalu cepat" — itu aturan umumnya.
  🔍 petunjuk: ada data yang TIDAK pantas di-cache. Ciri-cirinya apa?
  📖 baca ulang: fase-1/14-cache.md §kapan-cache-justru-menyulitkan
```

### C-F5 — Microservices (Fase 5)

```
Soal: Temanmu mau langsung microservices untuk aplikasi warung online
baru (3 orang tim, 200 user/hari). Setuju atau tidak? Sebut 2 alasan.

Penghormatan saat salah:
  ✔ masuk akal: "Netflix pakai itu, berikutnya pasti benar."
  🔍 petunjuk: microservices = biaya operasional baru (deploy, monitoring,
    network calls). Bandingkan dengan kebutuhan nyata 200 user/hari.
  📖 baca ulang: fase-1/11-application-layer.md §monolith-dulu
```

---

## Jenis D — Pembersih Kebingungan (maks 3 pertanyaan)

```
❓ D-1: Bagian yang sudah jelas di kepalamu — sebutkan 1–3 hal.
❓ D-2: Titik mulai kaburnya di mana — "sejak bagian X jadi tidak nyambung".
❓ D-3: Kalau besok ada teman tanya, kalimat penutupmu hari ini apa?
```

Setelah D-3, susun ulang: satu konsep untuk sesi berikutnya, sumbernya,
dan latihan minimalnya. Tulis ke LEARNING-RECORDS.
