# 🖥️ Modul 18: VPS Server — Naikkan Aplikasi Anda ke Internet

> **VPS = "rumah permanen" aplikasi Anda di internet. Di sinilah aplikasi yang selama ini cuma di localhost bisa diakses siapa saja.**
> Waktu: ~8-10 jam (bisa dipecah) | Level: 🟡🔴 Intermediate → Advanced | Lanjutan dari: Modul 16 (Networking), 17 (API)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ PONDASI DARI NOL (lengkap & ramah pemula): komputer, sistem operasi
   Linux, internet secara fisik, IP/port/domain, server, hosting, VPS,
   terminal & SSH — semuanya dari angka nol
✅ Jenis-jenis hosting: gratis vs berbayar (hasil riset lengkap)
✅ Apa itu VPS & bedanya dengan shared hosting
✅ SSH: cara "masuk" ke server dari jauh
✅ Nginx: gerbang depan aplikasi (reverse proxy)
✅ PM2: penjaga aplikasi Node.js tetap hidup
✅ SSL/HTTPS dengan Let's Encrypt (gratis!)
✅ Firewall UFW: mengunci pintu server
✅ BONUS: memasang AI model (LLM) di VPS dengan Ollama
✅ Development vs Production mode
```

> 🎯 **Kenapa Anda butuh ini?**
> Selama ini aplikasi Anda jalan di `localhost` — hanya komputer
> Anda yang bisa akses. VPS membuat aplikasi Anda **online 24 jam**
> dan bisa diakses dari mana saja di dunia.

---

## 🧠 18.1 PONDASI DARI NOL: APA ITU SERVER, VPS & HOSTING

> **Bagian ini ditulis khusus untuk Anda yang sama sekali belum pernah
> bersentuhan dengan server, VPS, atau hosting — benar-benar dari nol.**
> Baca pelan-pelan, ikuti analoginya, dan jangan takut ada istilah asing:
> setiap istilah dijelaskan di sini (atau dirujuk ke Modul 16).

### 18.1.1 Mulai dari Hal yang Paling Sederhana: Komputer & Isinya

Semua server — termasuk VPS — pada dasarnya adalah **komputer biasa**.
Jadi sebelum bicara server, kita pastikan dulu paham komputer:

```text
KOMPUTER = alat yang bisa MENERIMA perintah, MENGOLAH data,
           dan MENYIMPAN data.

Monitor & keyboard yang Anda lihat hanya "kulit"-nya.
Yang penting adalah bagian di dalamnya:
```

| Bagian | Namanya | Fungsinya | Analogi dapur restoran |
|--------|---------|-----------|------------------------|
| Otak penghitung | **CPU** (prosesor) | Menjalankan perhitungan & logika | Koki utama |
| Memori kerja | **RAM** | Tempat kerja sementara saat komputer menyala | Meja kerja dapur |
| Penyimpanan | **Disk / SSD / HDD** | Menyimpan data selamanya (walau dimatikan) | Kulkas & gudang |
| Jaringan | **NIC / kabel / Wi-Fi** | Menghubungkan ke internet | Pintu pengiriman |

> 💡 **Perbedaan PENTING RAM vs Disk (sering bikin bingung):**
> - RAM = meja kerja. CEPAT, tapi isinya **HILANG** saat listrik mati.
> - Disk = gudang. Lambat, tapi isinya **TETAP ADA** selamanya.
> - Saat komputer menyala, data diambil dari gudang (disk) ke meja (RAM)
>   supaya cepat diolah. Saat mati, meja dikosongkan.

**Lalu apa itu "sistem operasi"?** Komputer cuma benda mati tanpa
"supir" yang mengatur semuanya — itu dibahas di 18.1.2.

---

### 18.1.2 Sistem Operasi: "Supir" Komputer (Windows vs Linux)

```text
SISTEM OPERASI (OS) = program utama yang menjalankan seluruh komputer.
Tanpa OS, komputer hanyalah logam & plastik yang tidak bisa apa-apa.

Contoh OS yang sudah Anda kenal:
  Windows (laptop), macOS (Mac), Android/iOS (HP).
```

**Server umumnya memakai OS bernama LINUX** (bukan Windows). Kenapa?

```text
✅ GRATIS     →  tidak bayar lisensi (Windows server berbayar)
✅ STABIL     →  bisa hidup berbulan-bulan tanpa restart
✅ RINGAN     →  tidak boros RAM (RAM server dipakai aplikasi, bukan OS)
✅ DOMINAN    →  ±95% server dunia pakai Linux; tutorial & alat
                 (Nginx, PM2, Docker) dibuat untuk Linux lebih dulu
✅ AMAN       →  open source, diperiksa jutaan orang di dunia
```

**Ubuntu** = salah satu "rasa" Linux yang paling ramah pemula (istilah
teknisnya: *distro* — distribusi Linux). Karena itu hampir semua
langkah di modul ini memakai Ubuntu:

```text
UBUNTU LTS = versi Ubuntu yang didukung jangka panjang (Long Term
             Support) — pembaruan keamanan gratis selama 5 tahun.
             LTS = pilihan paling aman untuk server.
```

> 🎯 **Tenang, Anda TIDAK perlu jago Linux dulu.** Anda belajar sambil
> jalan: cukup kenal beberapa perintah terminal (18.1.12), sisanya
> minta AI memandu. Semua orang yang bisa VPS juga pernah mulai dari nol.

---

### 18.1.3 Internet Itu Apa, Fisiknya? (Dari Nol Sampai Tuntas)

Sebelum bicara "server di internet", kita harus tahu internet itu
sebenarnya apa. Bukan awan ajaib — ini benda fisik yang nyata:

```text
INTERNET = jaringan komputer RAKSASA yang saling terhubung
           di seluruh dunia, lewat kabel & sinyal.

Rumah Anda ──▶ router Wi-Fi ──▶ kabel ke ISP ──▶ internet besar
                                            (kabel fiber, kabel laut,
                                             gedung data center)
```

Perjalanan data Anda saat membuka website:

```text
1. HP/laptop Anda mengirim data lewat Wi-Fi rumah
2. Router meneruskan ke ISP (IndiHome, Biznet, MyRepublic, dll)
   → ISP = "perusahaan jalan tol internet" untuk rumah Anda
3. Data melintasi kabel serat optik — termasuk kabel BAWAH LAUT
4. Sampai di data center (gedung berisi server) tempat website itu
5. Server mengirim balasan → lewat jalur yang sama kembali ke Anda
```

> 🏠 **Analoginya:** internet = jaringan jalan raya dunia. ISP = jalan tol
> lokal. Data center = kawasan industri tempat pabrik (server) berdiri.
> Paket data = truk pengiriman.

> 💡 **Kenapa Anda perlu tahu ini?** Karena "server" itu NYATA — berupa
> komputer yang hidup di salah satu gedung itu. Bukan benda abstrak.
> Semua yang Anda pelajari di modul ini terjadi di gedung-gedung tersebut.

---

### 18.1.4 Alamat di Internet: IP, Port, Domain & DNS (Dari Nol)

Supaya data sampai ke server yang tepat, internet memakai "alamat"
bertingkat. Ada 3 lapis yang harus Anda kenal:

```text
1. IP ADDRESS  → alamat komputer          (mis. 103.28.12.5)
2. PORT        → nomor ruangan di dalamnya (mis. 443)
3. DOMAIN      → nama yang mudah diingat   (mis. sekolahku.com)
```

**IP Address (alamat rumah):** setiap komputer di internet punya nomor
unik. Ada dua jenis:

| Jenis | Dipakai untuk | Contoh |
|-------|---------------|--------|
| IP privat | Di dalam jaringan rumah/kantor (tidak bisa diakses dari luar) | 192.168.1.5 |
| IP publik | Di internet — bisa diakses siapa saja | 103.28.12.5 |

> 🏠 **Analoginya:** IP = alamat rumah. IP privat = alamat di dalam
> kompleks perumahan. IP publik = alamat yang tertera di peta umum.
> **VPS Anda butuh IP publik** supaya bisa diakses dari mana saja.

**Port (nomor ruangan):** satu komputer (satu IP) bisa melayani BANYAK
layanan sekaligus — dibedakan lewat port:

| Port | Layanan |
|------|---------|
| 22 | SSH (masuk ke server — dibahas di 18.5) |
| 80 | HTTP (website biasa) |
| 443 | HTTPS (website aman) |
| 3000 | Aplikasi Next.js/Node Anda (default) |

**Domain & DNS (buku telepon):** manusia susah menghafal angka, jadi
internet punya nama yang mudah diingat:

```text
sekolahku.com  ──DNS──▶  103.28.12.5
   (nama)        (buku telepon internet menerjemahkan)

URL lengkap:  https://sekolahku.com:443/halaman-utama
              └─┘    └────────┘      └──┘   └─────────┘
            protokol    domain      port      path/jalur
```

> 📚 **Semua ini dibahas jauh lebih dalam di Modul 16 (Networking).**
> Di sini cukup paham konsepnya: IP = alamat, port = ruangan,
> DNS = buku telepon. Anda akan memakai ketiganya terus di modul ini.

---

### 18.1.5 Model Klien-Server: Siapa yang Minta, Siapa yang Melayani

Sekarang kita tahu ada komputer yang menyimpan website (server) dan
komputer yang melihatnya (Anda). Pola hubungannya disebut **model
klien-server** — pola paling dasar di seluruh internet:

```text
KLIEN (client) = yang MEMINTA   → contoh: browser di laptop/HP Anda
SERVER         = yang MELAYANI  → contoh: komputer di data center

KLIEN ── permintaan (request) ──▶ SERVER
KLIEN ◀── jawaban (response) ──── SERVER
```

> 🏠 **Analoginya — restoran:** klien = pelanggan yang memesan (browser),
> server = dapur & pelayan yang memasak & mengantar (komputer di data
> center + program di dalamnya). "Permintaan" = pesanan. "Jawaban" =
> makanan yang diantar.

**Poin penting untuk modul ini:** browser Anda (klien) tidak pernah
"masuk" ke server. Ia hanya mengirim permintaan lewat internet dan
menerima jawaban. Kalau server mati → tidak ada yang menjawab →
website error (koneksi ditolak / 502 Bad Gateway). Persis restoran tutup.

---

### 18.1.6 Apa Itu "Server"? (Kata Ini Punya 2 Arti — Wajib Tahu!)

Kata "server" dipakai untuk 2 hal yang berbeda. Kalau tidak tahu ini,
Anda akan bingung terus menerus:

```text
ARTI 1 — SERVER (MESIN):   komputer yang melayani permintaan, hidup
                           24 jam, di data center.
                           → yang Anda SEWA saat membeli VPS.

ARTI 2 — SERVER (PROGRAM): software yang melayani permintaan.
                           Contoh: Nginx, Apache, atau kode
                           Node.js/Laravel Anda sendiri.
                           → yang Anda INSTALL di mesin itu.
```

Bingung? Ini analoginya:

```text
RESTORAN = server (mesin)     → bangunan/tempatnya
KOKI     = server (program)   → yang benar-benar memasak

Anda menyewa gedung (mesin), lalu merekrut koki (program)
untuk melayani pelanggan (pengunjung website).
```

Di modul ini:
- **Mesinnya** = VPS (yang Anda sewa — Modul 18.4)
- **Programnya** = aplikasi Node/Next/Laravel Anda + Nginx (Modul 18.7-18.9)

> 💡 **Kalau ada orang bilang "server saya down", tanyakan dalam hati:
> maksudnya mesinnya mati, atau programnya crash?** Keduanya beda cara
> mengatasinya — dan keduanya Anda pelajari di modul ini.

---

### 18.1.7 Komputer Server vs Laptop Anda (Perbandingan)

| | Komputer Anda (laptop) | Server |
|---|---|---|
| Waktu hidup | Dimatikan setiap malam | **24 jam / 7 hari** |
| Posisi | Di meja Anda | Di **data center** (gedung khusus) |
| Koneksi | Wi-Fi rumah | **Internet cepat & stabil** (beberapa jalur) |
| Siapa yang akses | Hanya Anda | **Semua orang** (lewat internet) |
| Spesifikasi | Standar | Bisa kecil (VPS 1GB) atau raksasa |
| Peran | Alat kerja harian | Melayani permintaan orang lain |

> 🏠 **Analoginya:** komputer Anda = motor pribadi (kadang dipakai,
> kadang parkir di garasi). Server = **toko yang buka 24 jam** — semua
> orang bisa datang kapan saja, dan toko tidak boleh pernah tutup.

---

### 18.1.8 Apa Itu Hosting? (Menyewa "Rumah" di Internet)

Sekarang bagian yang paling sering membingungkan pemula: **hosting**.

```text
HOSTING = tindakan MENYIMPAN website/aplikasi di server orang lain
          supaya bisa diakses dari internet.

Anda tidak perlu membangun server sendiri di garasi.
Anda SEWA sebagian (atau seluruh) komputer yang sudah hidup
24 jam di data center milik perusahaan hosting.
```

> 🏠 **Analoginya:** hosting = menyewa toko di sebuah mal.
> - Anda tidak membangun gedungnya (itu = membangun data center sendiri)
> - Anda menyewa unit toko (itu = hosting)
> - Barang dagangan Anda (kode aplikasi) ditaruh di toko itu
> - Pembeli (pengunjung website) bisa datang kapan saja, karena malnya
>   buka 24 jam (server hidup terus)

Perusahaan yang menyewakan server disebut **provider hosting**:

```text
JENIS PERUSAHAAN                      CONTOH
─────────────────────────────────────────────────
Provider hosting tradisional  →  Niagahoster, IDCloudHost, Hostinger
Cloud provider besar         →  AWS, Google Cloud, Azure, DigitalOcean,
                                Vultr, Hetzner, Linode, Oracle Cloud
PaaS (paling mudah)          →  Vercel, Render, Railway, Netlify
```

> ⚠️ **Hosting ≠ Domain — dua hal yang BEDA (sering tertukar!):**
> - **Domain** = NAMA (sekolahku.com) — Anda BELI, bayar per tahun
> - **Hosting** = TEMPAT (server) — Anda SEWA, bayar per bulan
> Analogi: domain = nama toko di papan; hosting = bangunan tokonya.
> Website butuh KEDUANYA. (Domain dibahas di 18.10.)

> 🎯 **Yang perlu Anda ingat:** pilihan provider itu BANYAK, tapi konsepnya
> semua sama — Anda menyewa komputer di internet. Bedanya cuma harga,
> lokasi, dan tingkat kemudahan. Perbandingan lengkapnya ada di 18.2.

---

### 18.1.9 Perjalanan Satu Website: Dari Kode di Laptop ke Seluruh Dunia

Sekarang mari rangkai semuanya. Ini alur lengkap — dari kode di laptop
Anda sampai dilihat orang di belahan dunia lain:

```text
TAHAP 1 — DI KOMPUTER ANDA:
  Anda menulis kode aplikasi (Next.js, Laravel, dll)
  → cek di localhost (hanya Anda yang bisa lihat)

TAHAP 2 — DEKLARASI ONLINE:
  Anda "menyewa rumah": beli VPS (dapat IP publik) + beli domain
  → upload/kloning kode ke VPS → jalankan aplikasi di sana

TAHAP 3 — SETIAP HARI, ORANG MEMBUKA WEBSITE ANDA:
  1. Pengguna mengetik  sekolahku.com  di browser
  2. DNS menerjemahkan → IP VPS Anda (mis. 103.28.12.5)
  3. Browser mengirim permintaan ke IP itu (port 443)
  4. Nginx (gerbang depan) menerima → meneruskan ke aplikasi
  5. Aplikasi memproses (baca database, susun halaman)
  6. Hasil dikirim balik ke browser pengguna
  7. Website tampil! 🎉
```

```text
┌──────────┐  1. ketik domain      ┌──────────────────┐
│  Browser │ ───────────────────▶  │  NGINX           │
│ Pengguna │   2. DNS → IP         │  (gerbang depan) │
│          │                       │  port 80 / 443   │
└──────────┘ ◀───────────────────  └────────┬─────────┘
         6. terima hasil                  │ 4. teruskan
                                           ▼
                                   ┌──────────────────┐
                                   │  APLIKASI        │
                                   │ (Node/Laravel)   │
                                   │ port 3000        │
                                   └────────┬─────────┘
                                            │ 5. baca data
                                            ▼
                                   ┌──────────────────┐
                                   │  DATABASE        │
                                   └──────────────────┘
```

> 🎯 **Ringkasan satu kalimat:**
> **Hosting = menyewa "rumah" di internet untuk aplikasi Anda.**
> Server = rumahnya. Anda (aplikasi) = penghuninya. Domain = alamat
> rumahnya. Nginx = satpam gerbangnya. (Nginx dibahas di 18.9.)

---

### 18.1.10 Komponen Server: Isi Dalam "Rumah" Tersebut

Server punya 4 komponen penting. Paham ini = paham kenapa suatu VPS
harganya beda-beda:

| Komponen | Apa itu (sederhana) | Analogi Dapur Restoran |
|----------|---------------------|-------------------------|
| **CPU** (prosesor) | Otak yang menghitung | Koki utama |
| **RAM** | Memori kerja sementara | Meja kerja dapur |
| **Disk** (SSD/HDD) | Tempat menyimpan file selamanya | Kulkas & gudang |
| **Bandwidth** | Kuota data yang bisa keluar-masuk | Pintu pengiriman |

**Kenapa spesifikasi ini menentukan HARGA & KEKUATAN server?**

```text
CPU lebih banyak   →  lebih banyak "koki" → bisa proses lebih banyak
                      permintaan sekaligus
RAM lebih besar    →  meja kerja lebih luas → aplikasi berat (database,
                      AI model) tidak cepat penuh & lemot
Disk lebih besar   →  gudang lebih besar → muat lebih banyak file
Bandwidth besar    →  pintu lebih lebar → banyak pengunjung tidak macet
```

> ⚠️ **Yang paling sering jadi "tukang lemot": RAM.** Kalau RAM penuh,
> server memakai disk sebagai "RAM cadangan" (disebut *swap*) — dan ini
> SANGAT lambat. Aplikasi terasa berat → solusinya naikkan RAM VPS.

```text
CONTOH SPESIFIKASI VPS TERMURAH (banyak provider):
┌──────────────────────────────────────┐
│  1 vCPU  (1 koki)                    │
│  1 GB RAM (meja kerja kecil)         │
│  25 GB SSD (gudang cukup)            │
│  1 TB bandwidth / bulan              │
│  Sistem operasi: Ubuntu (gratis)     │
└──────────────────────────────────────┘
→ Cukup untuk website kecil & belajar.
→ Kalau pengunjung makin banyak, "upgrade": tambah RAM/CPU.
```

> 🎯 **Konsep kunci: sumber daya.** Semakin besar CPU/RAM/disk, semakin
> mahal, tapi semakin kuat server melayani banyak pengunjung sekaligus.

---

### 18.1.11 Kenapa Server Harus di Data Center? (Bukan di Kamar)

Server tidak ditaruh di rumah/kamar karena butuh:

```text
✅ Listrik cadangan (UPS + genset)  →  tidak mati saat mati lampu
✅ Internet ganda (2+ koneksi)      →  tidak putus saat kabel rusak
✅ Pendingin ruangan (AC khusus)    →  komputer panas, harus dingin
✅ Keamanan fisik (ruang terkunci)  →  tidak dicuri / rusak
✅ Teknisi siaga 24 jam            →  kalau ada apa-apa, langsung ditangani
```

> 🏠 **Analoginya:** data center = gedung apartemen mewah yang aman,
> ada genset, satpam, dan AC sentral. Anda cukup menyewa 1 unit (1 VPS).

---

### 18.1.12 Apa Itu VPS? (Virtualisasi Dijelaskan dari Nol)

Sekarang konsep yang paling ditunggu: **VPS**.

```text
VPS = Virtual Private Server
    = Server VIRTUAL yang menjadi milik Anda sendiri,
      dibuat dengan cara MEMBAGI satu server fisik yang besar.
```

Cara kerjanya — ini inti pemahamannya:

```text
Satu server FISIK (komputer besar di data center)
┌────────────────────────────────────────────────────┐
│  HYPERVISOR (program pembagi — "pengelola gedung") │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │ VPS Anda   │  │ VPS orang  │  │ VPS orang  │    │
│  │ (Ubuntu)   │  │ lain       │  │ lain       │    │
│  │ CPU 1 core │  │ CPU 1 core │  │ CPU 1 core │    │
│  │ RAM 1 GB   │  │ RAM 1 GB   │  │ RAM 1 GB   │    │
│  │ Disk 25 GB │  │ Disk 25 GB │  │ Disk 25 GB │    │
│  │ IP publik  │  │ IP lain    │  │ IP lain    │    │
│  └────────────┘  └────────────┘  └────────────┘    │
└────────────────────────────────────────────────────┘
```

**Hypervisor** = program (contoh: KVM, Xen, Proxmox) yang membagi satu
komputer fisik menjadi banyak komputer virtual yang terpisah rapat.

> 🏠 **Analoginya — gedung apartemen:**
> - Server fisik = gedung apartemen
> - Hypervisor = pengelola gedung yang membagi lantai jadi unit-unit
> - VPS Anda = SATU unit apartemen: pintu sendiri, kunci sendiri,
>   bebas mengatur isi unit sendiri
> - Tetangga (VPS orang lain) tidak bisa masuk ke unit Anda, dan
>   (biasanya) tidak mengganggu kinerja Anda

**Penting:** "virtual" BUKAN berarti palsu. Sumber daya VPS (CPU/RAM/
disk) itu NYATA — cuma dibagi-bagi oleh hypervisor. Anda punya jatah
sendiri yang TIDAK dipakai bersama orang lain (beda dengan shared
hosting — lihat 18.3).

```text
ISTILAH SEJAWAT "VPS" DI TIAP PROVIDER:
DigitalOcean → Droplet        Vultr → Cloud Compute
AWS          → EC2 instance   Google Cloud → Compute Engine
Oracle Cloud → VM instance    Hetzner → Cloud Server

Semuanya = VPS. Konsepnya sama, cuma namanya beda.
```

> ✅ **Sekarang Anda paham tiga definisi kunci modul ini:**
> - **Server** = komputer yang melayani permintaan (mesin)
> - **Hosting** = menyewa tempat di server untuk online-kan aplikasi
> - **VPS** = SATU bagian virtual dari server fisik, milik Anda sendiri,
>   dengan akses penuh (root) — bahan utama modul ini
>
> ➡️ **Langkah praktis berikutnya:** cara membeli & membuat VPS pertama
> Anda dijelaskan pelan-pelan di **18.4**. Baca dulu setelah ini kalau
> sudah tidak sabar mencoba!

---

### 18.1.13 Terminal & SSH: Cara "Berbicara" dengan Server

Server tidak punya monitor, keyboard, atau mouse di depan Anda — ia
berada di gedung yang mungkin beda pulau. Lalu bagaimana cara mengaturnya?

**Lewat TERMINAL (baris perintah / command line):**

```text
TERMINAL = program yang menerima perintah TERTULIS dan menjalankannya.
           (Di Windows: CMD / PowerShell / Git Bash.
            Di server Linux: disebut "shell".)

Beda dengan klik-klik di layar → di server, Anda KETIK perintah:
    ls            → lihat daftar file
    cd folder     → pindah ke folder
    whoami        → siapa user saya
    free -h       → lihat pemakaian RAM
    df -h         → lihat isi disk
```

**SSH (Secure Shell)** = protokol untuk masuk ke server dari jauh lewat
terminal, dengan koneksi terenkripsi:

```bash
# Di terminal KOMPUTER Anda:
ssh root@103.28.12.5
#    ↑user   ↑IP VPS Anda

# Kalau pakai file kunci (lebih aman):
ssh -i ~/.ssh/id_rsa root@103.28.12.5
```

```text
Sebelum:   PS C:\Users\Anda>          ← komputer Anda
Sesudah:   root@vps-anda:~#           ← SERVER VPS (dari jauh!)

Semua perintah yang Anda ketik sekarang dijalankan DI SERVER.
```

> 🏠 **Analoginya:** SSH = punya kunci (SSH key) ke rumah (server) di
> luar kota. Setiap mau masuk, pakai kunci itu. Tidak perlu datang
> langsung. Pintunya bernomor 22 (port 22).

**Apa itu "root" dan "sudo"?**

```text
root   = user ADMIN tertinggi di server (bisa melakukan apa saja)
sudo   = perintah "jalankan ini sebagai admin" (Super User DO)
         → hampir semua perintah setup dimulai dengan sudo

Contoh:  sudo apt install nginx
         → "install nginx, dengan kuasa admin"
```

> 🎯 **Latihan pertama di server:** ketik `whoami` (siapa saya),
> `ls` (lihat file), `pwd` (di mana saya). Persis seperti terminal biasa
> — tapi ini terminal server! Jangan takut salah: mempelajari server
> itu aman, asal jangan menghapus data penting tanpa backup.
>
> ➡️ **Pembahasan SSH yang lebih dalam** (SSH key, koneksi pertama,
> cara aman dari password) ada di **18.5**.

---

### 18.1.14 Istilah Penting yang Harus Dikenal (Glosarium Mini)

| Istilah | Arti sederhana |
|---------|----------------|
| **Hosting** | Menyimpan aplikasi/website di server agar online |
| **Server** | Komputer yang melayani permintaan, hidup 24 jam |
| **VPS** | Bagian virtual dari server fisik, milik Anda sendiri, akses penuh |
| **Data center** | Gedung berisi ribuan server |
| **Provider** | Perusahaan yang menyewakan server |
| **IP publik** | Alamat unik server di internet |
| **Port** | "Nomor ruangan" layanan di dalam server (22, 80, 443) |
| **Domain** | Nama website yang mudah diingat (sekolahku.com) |
| **DNS** | Buku telepon: domain → IP |
| **Hypervisor** | Program pembagi server fisik menjadi banyak VPS |
| **SSH** | Cara aman masuk ke server dari jauh (port 22) |
| **Terminal / shell** | Tempat mengetik perintah ke server |
| **root / sudo** | User admin / perintah berkuasa admin |
| **Uptime** | Persentase waktu server hidup (99.9% = hampir tidak pernah mati) |
| **Droplet / instance / node** | Nama lain "VPS" di tiap provider |

---

### 18.1.15 Mitos yang Sering Bikin Pemula Bingung

| ❌ Mitos | ✅ Faktanya |
|----------|-------------|
| "Server itu ruangan raksasa penuh komputer — bukan untuk saya" | Anda tidak membeli ruangannya. Anda SEWA satu bagian kecil (VPS) — seperti menyewa 1 unit di gedung apartemen raksasa |
| "Hosting = domain" | Beda! Hosting = tempat (sewa bulanan). Domain = nama (beli tahunan) |
| "VPS = server fisik yang saya beli" | Bukan. VPS = virtual — dibagi dari 1 server fisik oleh hypervisor |
| "Harus bisa Linux dulu baru boleh beli VPS" | Tidak. Beli VPS murah, belajar sambil jalan, minta AI pandu |
| "Kalau VPS mati, data saya hilang" | Data di disk tetap ada (kecuali disk rusak). Yang mati biasanya cuma layanan — bisa dinyalakan lagi |
| "VPS itu lemah / lambat" | Untuk website & belajar, VPS 1-2GB RAM cukup. Kuatnya tergantung spesifikasi yang Anda pilih |
| "Website = server" | Website = hasilnya. Server = yang menjalankannya. Satu server bisa jalankan banyak website |
| "Aplikasi di localhost sudah bisa diakses teman" | Tidak. localhost = hanya komputer Anda. Perlu server + IP publik (isi modul ini) |

---

> ✅ **Cek pemahaman sebelum lanjut (jawab tanpa melihat ke atas):**
> 1. Apa bedanya laptop Anda dengan server? (jawaban: peran & hidup 24 jam)
> 2. Sebutkan 4 komponen utama server + analoginya di dapur!
> 3. Apa beda RAM dan disk? Kenapa RAM sering bikin server lemot?
> 4. Apa itu hypervisor? (pembagi server fisik jadi banyak VPS)
> 5. Bedakan dalam satu kalimat: hosting vs domain vs VPS!
> 6. Kenapa aplikasi di localhost tidak bisa diakses orang lain?
> 7. Kata "server" punya 2 arti. Apa saja? (mesin & program)
> 8. Apa fungsi Nginx dalam diagram alur website? (gerbang depan)

---

## 🧠 18.2 JENIS-JENIS HOSTING + GRATIS vs BERBAYAR (HASIL RISET)

> Ini hasil riset terkini (2025-2026). Jangan hafal harganya — harga bisa
> berubah. Yang penting: **paham jenisnya dulu**, lalu pilih sesuai kebutuhan.

### 18.2.1 Empat Jenis Hosting Utama (Dari Paling Murah ke Paling Kuat)

```text
 1. SHARED HOSTING      2. VPS               3. DEDICATED         4. CLOUD
 ┌───────────────┐     ┌──────────────┐    ┌──────────────┐    ┌──────────┐
 │ Banyak website│     │ 1 server     │    │ 1 server     │    │ Banyak   │
 │ berbagi SATU  │     │ virtual      │    │ FISIK khusus │    │ server   │
 │ server        │     │ milik Anda   │    │ untuk Anda   │    │ bekerja  │
 │ (kos-kosan)   │     │ (apartemen)  │    │ (rumah pribadi)│  │ bersama  │
 └───────────────┘     └──────────────┘    └──────────────┘    └──────────┘
   Termurah              Sedang               Mahal               Fleksibel
   (Rp10-30rb/bln)       ($4-6/bln)           ($50+/bln)          (bayar pakai)
```

| Jenis | Analogi | Cocok untuk | Kelebihan | Kekurangan |
|-------|---------|-------------|-----------|------------|
| **Shared** | Kos-kosan (kamar berbagi) | Blog, website statis | Murah, mudah | Sumber daya berbagi, sering lemot |
| **VPS** ⭐ | Apartemen (1 unit sendiri) | Aplikasi Node/Next/Laravel | Akses penuh, stabil | Perlu belajar Linux |
| **Dedicated** | Rumah sendiri | Aplikasi besar | Semua untuk Anda | Sangat mahal |
| **Cloud** | Sewa taksi (bayar per km) | Aplikasi yang naik-turun | Skala fleksibel | Bisa mahal jika lupa |

> 💡 **Juga ada jenis kelima: PaaS** (Platform as a Service) seperti Vercel,
> Render, Railway. Ini "hosting yang sudah jadi" — Anda tinggal upload kode,
> sisanya diurus. Paling mudah, tapi kontrolnya terbatas dan untuk belajar
> server tidak membantu. VPS tetap penting dipelajari! (detail di 18.2.4)

---

### 18.2.2 VPS HOSTING GRATIS (Riset: yang benar-benar ada)

> ⚠️ **Penting:** "gratis" di sini ada syaratnya. Bacalah kolom
> "Syarat" dengan teliti supaya tidak kaget kena tagihan.

| Layanan | Dapat apa | Syarat / Kartu Kredit | Berlaku | Cocok untuk |
|---------|-----------|------------------------|---------|-------------|
| **Oracle Cloud**
(Always Free) | VPS ARM 2 OCPU + 12GB RAM ATAU 2x AMD 1GB RAM + 200GB disk | **Wajib kartu kredit** | **Selamanya** (selama aktif) | Belajar VPS sungguhan, RAM besar |
| **Google Cloud**
(Always Free) | 1 VPS `e2-micro` (1GB RAM) + 30GB disk + bonus $300/90 hari | **Wajib kartu kredit** | **Selamanya** (jika di region US: us-west1/us-central1/us-east1) | Belajar Linux & Nginx stabil |
| **AWS** (Free Tier) | 750 jam/bln instance `t2.micro`/`t3.micro` (1GB RAM) | **Wajib kartu kredit** | **Hanya 12 bulan** pertama | Belajar standar industri |
| **Azure** (Free) | 750 jam/bln VM `B1s` (1GB RAM) + kredit $200 | **Wajib kartu kredit** | **12 bulan** pertama | Belajar cloud Microsoft |
| **Render** (PaaS) | Web service kecil + DB Postgres 1GB | **Tidak perlu kartu** | **DB gratis hangus 30 hari**; web *sleep* 15 menit tanpa trafik | Deploy instan dari GitHub |
| **Railway** (PaaS) | Kredit $5 trial, lalu $1/bln | **Wajib kartu kredit** | Trial 30 hari | Deploy cepat |
| **Fly.io** (PaaS) | Free tier baru: trial singkat (2 jam runtime / 7 hari) | Ya | Trial singkat | Uji coba global |
| **Replit / Glitch** | Ruang kecil di cloud | Tidak | Selama kuota | Prototype cepat, bukan VPS |

**Rekomendasi riset untuk pemula (tanpa bayar):**

```text
🏆 PILIHAN TERBAIK BELAJAR VPS MURNI:
   Google Cloud e2-micro (selalu gratis, stabil, tanpa batas 12 bulan)
   → kalau punya kartu kredit.

🏆 SPESIFIKASI TERBESAR GRATIS:
   Oracle Cloud ARM (12GB RAM!) — tapi pendaftarannya sering ditolak
   otomatis dan VPS bisa dihapus kalau tidak dipakai (idle).

🏆 TANPA KARTU KREDIT (paling mudah untuk mulai):
   Render — deploy dari GitHub tanpa kartu. Cocok untuk lihat hasil
   online cepat. Tapi ingat database gratisnya hangus 30 hari.
```

> ⚠️ **Peringatan anti-tagihan (penting untuk pemula):**
> 1. AWS/Azure gratis **12 bulan** — set waktu pengingat, matikan VM
>    sebelum tahun pertama habis.
> 2. Google Cloud wajib bikin instance di region `us-west1`/`us-central1`/
>    `us-east1` — di region lain (mis. Jakarta) langsung ditagih.
> 3. Selalu cek halaman "Billing" setiap bulan. Matikan yang tidak dipakai.

---

### 18.2.3 VPS HOSTING BERBAYAR (Riset: harga termurah per 2025-2026)

| Provider | Harga mulai | Spesifikasi dasar | Lokasi data center | Pembayaran | Kemudahan pemula |
|----------|-------------|-------------------|--------------------|------------|------------------|
| **DigitalOcean** | $4-6/bln | 512MB-1GB RAM, 1 vCPU, 10-25GB disk | AS, Eropa, Singapura | Kartu/PayPal/Google Pay | ⭐⭐⭐⭐⭐ (paling ramah, dokumentasi lengkap) |
| **Vultr** | $2.50-6/bln | 512MB-1GB RAM, 1 vCPU | Global luas | Kartu/PayPal/Crypto | ⭐⭐⭐⭐⭐ (mirip DO) |
| **Hetzner Cloud** | ±€4.49-5.49/bln | **2 vCPU, 4GB RAM** (paling banyak RAM!), 40GB | Jerman, Finlandia, AS, Singapura | Kartu/PayPal (KYC ketat) | ⭐⭐⭐ (verifikasi akun ketat) |
| **Linode (Akamai)** | $5/bln | 1GB RAM, 1 vCPU, 25GB | AS, Eropa, Asia | Kartu/PayPal | ⭐⭐⭐⭐⭐ |
| **Contabo** | ±€4.40-5.50/bln | **4 vCPU, 8GB RAM**, 100GB (paling besar!) | Jerman, AS, Singapura | Kartu/PayPal | ⭐⭐⭐ (performa I/O kadang naik-turun) |
| **Kamatera** | $4/bln | 1 vCPU, 1GB RAM, 20GB NVMe | Banyak negara | Kartu/PayPal | ⭐⭐⭐⭐ (ada trial $100) |

**Kesimpulan riset — pilih yang mana?**

```text
💰 VALUE TERBAIK (RAM paling banyak per dolar):
   Hetzner (4GB RAM) → pas untuk Next.js build + database.

👍 TERMUDAH UNTUK PEMULA:
   DigitalOcean atau Linode → tutorial & komunitas paling lengkap.

📦 KALAU BUTUH RAM BESAR DENGAN BUDGET KECIL:
   Contabo (8GB RAM) → tapi siapkan mental untuk I/O kadang lambat.

🌏 KALAU MAU LOKASI DEKAT (Indonesia, latency rendah):
   DigitalOcean / Vultr / Linode (Singapura).
   Beberapa provider lokal: IDCloudHost, Biznet Gio (cocok untuk belajar).
```

> 💡 **Untuk belajar, rekomendasi paling seimbang:**
> mulai dari **gratis (Google Cloud e2-micro / Oracle ARM)** dulu untuk
> paham konsep, lalu upgrade ke **Hetzner atau DigitalOcean $5-6/bln**
> saat siap bayar. Jangan langsung beli yang mahal!

---

### 18.2.4 PaaS: Alternatif "Tanpa Pusing Server"

```text
PaaS (Platform as a Service) = hosting yang sudah jadi.

VERCEL        → deploy Next.js/React: tinggal hubungkan GitHub.
RENDER        → Node.js, Python, PHP, + PostgreSQL (gratis 30 hari).
RAILWAY       → banyak template, UI bagus.
NETLIFY       → website statis & fungsi serverless.

Kelebihan:  tanpa kartu kredit (beberapa), 5 menit online.
Kekurangan: kontrol terbatas, tidak belajar Linux/SSH/Nginx,
            biaya membengkak kalau ramai.
```

> 🎯 **Kapan pakai PaaS vs VPS?**
> - Mau hasil CEPAT & tidak mau ribet server → PaaS (Vercel/Render).
> - Mau BELAJAR & kontrol penuh → VPS. Inilah fokus modul ini.
> - Di dunia kerja, VPS/cloud tetap jadi andalan → wajib paham.

---

## 🧠 18.3 VPS vs SHARED HOSTING

### Perbedaan Inti (sumber: DigitalOcean)

```text
SHARED HOSTING:                     VPS:
┌──────────────────────┐            ┌──────────────────────┐
│ Banyak website       │            │ SATU server virtual  │
│ di SATU server       │            │ milik Anda sendiri   │
│                      │            │                      │
│ ❌ Berbagi CPU/RAM   │            │ ✅ Sumber daya khusus │
│ ❌ Tidak ada akses   │            │ ✅ Akses root penuh   │
│    root              │            │    (bebas install    │
│ ❌ Terbatas konfig   │            │    apa saja)          │
└──────────────────────┘            └──────────────────────┘
```

| Aspek | Shared Hosting | VPS |
|-------|---------------|-----|
| Sumber daya | Berbagi (bisa melambat) | Khusus (stabil) |
| Akses root | ❌ Tidak | ✅ Penuh |
| Bebas install software | ❌ Terbatas | ✅ Bebas |
| Cocok untuk | Website statis, blog | Aplikasi Node/Next/Laravel |

> 💡 **VPS sering disebut "Droplet" (DigitalOcean), "Vultr",
> "Hetzner", atau "Linode".** Semuanya konsep yang sama:
> server virtual dengan akses penuh.

### Bagaimana VPS Bekerja?

```text
Server FISIK (di pusat data)
┌────────────────────────────────────────────┐
│  Hypervisor (pembagi)                      │
│  ┌────────────┐  ┌────────────┐           │
│  │ VPS Anda   │  │ VPS orang  │           │
│  │ (Ubuntu)   │  │ lain       │           │
│  │ CPU 1 core │  │ CPU 1 core │           │
│  │ RAM 1 GB   │  │ RAM 1 GB   │           │
│  │ Disk 25 GB │  │ Disk 25 GB │           │
│  │ IP publik  │  │ IP lain    │           │
│  └────────────┘  └────────────┘           │
└────────────────────────────────────────────┘

Setiap VPS: sistem operasi sendiri, bebas install apa saja,
punya IP publik sendiri → bisa diakses dari internet.
```

---

## 🧠 18.4 MEMBUAT VPS PERTAMA (GAMBARAN)

> ⚠️ **PENTING:** Langkah ini butuh uang (bisa mulai dari
> ±$4-6/bulan) dan kartu pembayaran. Kalau belum siap, Anda
> tetap bisa BELAJAR konsepnya dulu — minta AI menjelaskan
> sambil menonton. Untuk latihan, bisa juga pakai layanan
> gratis seperti Oracle Cloud Free Tier atau Railway/Render.

### Alur Membuat VPS

```text
1. PILIH PROVIDER: DigitalOcean / Vultr / Hetzner / dll
2. PILIH SISTEM OPERASI: Ubuntu LTS (paling umum untuk belajar)
3. PILIH SPESIFIKASI: mulai dari yang paling kecil (1 CPU, 1GB RAM)
4. BUAT SSH KEY: kunci keamanan untuk masuk ke server
   (atau pakai password — kurang aman tapi untuk belajar boleh)
5. VPS JADI → dapat IP publik (mis. 103.28.12.5)
6. MASUK ke server via SSH
```

> 💡 **Pesan penting untuk pemula:** jangan khawatir memilih
> provider. Konsepnya SAMA di semua provider. Bedanya cuma
> tombol di website mereka.

---

## 🧠 18.5 SSH: KUNCI MASUK SERVER

### Apa Itu SSH?

```text
SSH (Secure Shell) = cara AMAN untuk mengakses terminal server
dari komputer Anda, melalui internet.

Port SSH default: 22 (standar IANA)
```

### Koneksi Pertama

```bash
# Di terminal komputer Anda:
ssh root@103.28.12.5
#    ↑user  ↑IP VPS Anda

# Kalau pakai file kunci:
ssh -i ~/.ssh/id_rsa root@103.28.12.5
```

### Yang Terjadi Setelah Masuk

```text
Sebelum:   PS C:\Users\Anda>          ← komputer Anda
Sesudah:   root@vps-anda:~#           ← SERVER VPS (dari jauh!)

Semua perintah yang Anda ketik sekarang dijalankan DI SERVER.
```

### Analogi

```text
SSH = punya kunci (SSH key) ke rumah (server) di luar kota.
Setiap mau masuk, pakai kunci itu. Tidak perlu datang langsung.
```

> 🎯 **Latihan pertama di server:** ketik `whoami` (siapa saya),
> `ls` (lihat file), `pwd` (di mana saya). Persis seperti terminal
> biasa — tapi ini terminal server!

---

## 🧠 18.6 FIREWALL UFW: MENGUNCI PINTU

### Kenapa Perlu?

```text
Server Anda sekarang "telanjang" di internet — SEMUA orang
bisa mencoba masuk. Firewall = penjaga pintu yang hanya
membiarkan orang yang berhak masuk.

UFW (Uncomplicated Firewall) = firewall bawaan Ubuntu yang mudah.
```

### Aturan Dasar (sumber: DigitalOcean)

```bash
sudo ufw allow 22        # izinkan SSH (wajib! jangan sampai terkunci)
sudo ufw allow 80        # izinkan HTTP (website)
sudo ufw allow 443       # izinkan HTTPS (website aman)
sudo ufw enable          # aktifkan firewall
sudo ufw status          # lihat aturan yang aktif
```

```text
HASIL:
22/tcp   ALLOW
80/tcp   ALLOW
443/tcp  ALLOW
```

> ⚠️ **JANGAN LUPA port 22!** Kalau firewall mengaktifkan tanpa
> mengizinkan SSH, Anda terkunci di luar server sendiri!

---

## 🧠 18.7 MENYIAPKAN APLIKASI DI SERVER

### Langkah 1: Install Kebutuhan

```bash
# Node.js (untuk aplikasi Next/React/Node):
# cara termudah: pakai NodeSource atau nvm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # cek: muncul v22.x

# Atau untuk Laravel (PHP + Composer):
sudo apt install -y php-cli php-mbstring composer
php --version    # cek: PHP 8.2+
```

> 💡 **Jangan hafal perintah ini.** Minta AI yang menjalankan
> sesuai sistem operasi server Anda (cek dulu `cat /etc/os-release`).

### Langkah 2: Upload Kode ke Server

Ada 3 cara umum:

```text
CARA 1 — Git (paling profesional):
  Di komputer:  git push ke GitHub
  Di server:    git clone https://github.com/anda/proyek.git

CARA 2 — SCP (untuk file kecil):
  Di komputer:  scp -r proyek root@103.28.12.5:/var/www/

CARA 3 — Zip/Upload via panel (untuk pemula):
  Upload file zip → unzip di server
```

> 🎯 **Rekomendasi:** mulai dengan **Git + GitHub**. Anda akan
> memakainya terus di dunia kerja. Minta AI pandu setup Git.

### Langkah 3: Install Dependencies & Build

```bash
# Next.js / Node:
cd proyek
npm install
npm run build        # buat versi produksi

# Laravel:
composer install
cp .env.example .env # buat konfigurasi
php artisan key:generate
php artisan migrate  # siapkan database
```

---

## 🧠 18.8 PM2: PENJAGA APLIKASI NODE.JS

### Masalahnya

```text
Kalau Anda jalankan `npm run start` lalu TUTUP terminal:
→ aplikasi ikut mati!

Kalau server reboot:
→ aplikasi tidak otomatis menyala lagi.

Solusi: PM2 — process manager yang menjaga aplikasi tetap hidup.
```

### Perintah PM2 Dasar (sumber: PM2 docs)

```bash
npm install -g pm2                  # install PM2

pm2 start "npm run start" --name proyek-anda   # jalankan app
# bentuk alternatif yang juga umum:
# pm2 start npm --name proyek-anda -- run start
pm2 start app.js --name api-anda               # jalankan file JS
pm2 status          # lihat status semua aplikasi
pm2 logs            # lihat log real-time
pm2 restart proyek-anda   # restart aplikasi
pm2 stop proyek-anda      # stop aplikasi

# Penting! Agar aplikasi tetap hidup setelah server reboot:
pm2 startup         # jalankan sekali, ikuti instruksinya
pm2 save            # simpan daftar aplikasi
```

```text
┌───────────────────────────────┐
│  pm2 status                   │
│  ┌──────────┬────────┬───────┐ │
│  │ name     │ status │ uptime│ │
│  ├──────────┼────────┼───────┤ │
│  │ proyek   │ online │ 3d    │ │
│  │ api-anda │ online │ 12h   │ │
│  └──────────┴────────┴───────┘ │
└───────────────────────────────┘

"online" = aplikasi hidup. PM2 akan restart otomatis kalau crash.
```

> 💡 **Laravel tidak butuh PM2** (dia jalan lewat PHP-FPM),
> tapi Anda bisa pakai PM2 untuk worker queue-nya nanti.

---

## 🧠 18.9 NGINX: GERBANG DEPAN APLIKASI

### Kenapa Butuh Nginx?

```text
Aplikasi Anda jalan di port internal (3000, 8000).
Tapi pengguna mengetik http://domain-anda.com (port 80).

Nginx = penjaga gerbang yang:
1. Menerima permintaan di port 80/443
2. Meneruskannya ke aplikasi di port 3000/8000
3. Mengembalikan respons ke pengguna
   → disebut REVERSE PROXY (sumber: Nginx docs)
```

```text
PENGGUNA                    NGINX                   APLIKASI
┌────────┐   port 80/443   ┌────────────┐  localhost  ┌────────┐
│ Browser │ ─────────────▶ │ :80 / :443 │ ──:3000──▶  │ Node   │
│         │                │ (depan)    │ ◀──balikan──│ (belakang)
└────────┘ ◀─────────────  └────────────┘             └────────┘
```

### Install Nginx

```bash
sudo apt update
sudo apt install nginx
sudo systemctl status nginx   # cek: aktif?
```

### Konfigurasi Server Block (sumber: Nginx docs)

```bash
sudo nano /etc/nginx/sites-available/proyek-anda
```

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;    # arahkan ke aplikasi
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Aktifkan konfigurasi:
sudo ln -s /etc/nginx/sites-available/proyek-anda /etc/nginx/sites-enabled/
sudo nginx -t          # tes konfigurasi (harus: syntax is ok)
sudo systemctl reload nginx   # terapkan
```

> 🎯 **Analoginya:** Nginx = resepsionis gedung. Pengunjung
> datang ke resepsionis (port 80), resepsionis mengantar ke
> ruangan aplikasi Anda (port 3000), lalu membawa hasilnya
> kembali ke pengunjung.

---

## 🧠 18.10 DOMAIN & DNS (Hubungkan ke Modul 16)

```text
1. BELI DOMAIN: niagahoster / domainesia / namecheap / cloudflare
   (contoh: sekolahku.com) — ±Rp100-200rb/tahun

2. ARAHKAN ke IP VPS (A Record):
   Di panel DNS domain Anda:
   Type: A | Host: @ | Value: 103.28.12.5 (IP VPS Anda)
   Type: A | Host: www | Value: 103.28.12.5

3. TUNGGU propagasi: 10 menit - 24 jam (DNS menyebar)

4. TES: buka http://domain-anda.com → aplikasi Anda tampil! 🎉
```

> 💡 **Ingat Modul 16?** DNS = buku telepon yang menerjemahkan
> `domain-anda.com` → IP VPS Anda. Sekarang Anda mempraktikkannya!

---

## 🧠 18.11 SSL/HTTPS GRATIS DENGAN LET'S ENCRYPT

### Kenapa HTTPS Wajib?

```text
HTTPS = HTTP + enkripsi TLS (Modul 16).
Di browser, tanpa HTTPS:  "Tidak Aman" ⚠️
Dengan HTTPS:             🔒 Aman

Password & data pengguna HARUS lewat HTTPS!
```

### Certbot: Pemasang SSL Otomatis (sumber: Let's Encrypt / DigitalOcean)

```bash
sudo apt install certbot python3-certbot-nginx

# Minta sertifikat + konfigurasi otomatis:
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com

# Tes perpanjangan otomatis (sertifikat berlaku 90 hari):
sudo certbot renew --dry-run
```

```text
HASILNYA:
- Sertifikat SSL terpasang
- Nginx otomatis diarahkan ke HTTPS
- Perpanjangan otomatis setiap 90 hari (gratis!)
```

> 🎯 **Setelah ini:** buka `https://domain-anda.com` →
> ikon gembok 🔒 muncul. Aplikasi Anda kini AMAN & PRODUKSI!

---

## 🧠 18.12 DEVELOPMENT vs PRODUCTION

| Aspek | Development (lokal) | Production (VPS) |
|-------|---------------------|------------------|
| Tujuan | Debug & belajar | Stabil & cepat |
| Error | Detail (stack trace) | Sembunyi (aman) |
| Auto-restart | Nodemon | PM2 |
| URL | localhost:3000 | domain-anda.com |
| Mode | NODE_ENV=development | **NODE_ENV=production** |
| Build | Live reload | `npm run build` sekali |
| HTTPS | Tidak wajib | **WAJIB** |

```text
Kenapa NODE_ENV penting? (sumber: Node.js docs)
→ Banyak library membaca variabel ini untuk mengoptimalkan
  performa & keamanan. Set di server:
  NODE_ENV=production
```

---

## 🤖 18.13 TEMPLATE PROMPT VPS

### Prompt 1: Setup VPS Lengkap

```text
Saya baru membeli VPS (Ubuntu LTS, IP: [IP Anda]).
Bantu saya setup dari nol:

1. SSH: pastikan koneksi aman (cek apakah sudah pakai SSH key)
2. Firewall UFW: buka port 22, 80, 443 lalu aktifkan
3. Install kebutuhan untuk aplikasi saya: [Node.js / PHP+Laravel]
4. Clone kode dari GitHub: [URL repo]
5. Install dependencies & build
6. Jalankan dengan PM2 (jika Node/Next)
7. Install & konfigurasi Nginx untuk domain [domain]
8. Pasang SSL dengan Certbot

JANGAN jalankan semua sekaligus. Pandu langkah demi langkah,
jelaskan tiap perintah singkat. Saya pemula server.
```

### Prompt 2: Debug Masalah di Server

```text
Aplikasi saya di VPS bermasalah:
- Domain: [domain]
- Error/gejala: [tempel error atau yang terjadi]
- Setup: [Next.js/Node/Laravel] + [Nginx/PM2]

Cek kemungkinan ini satu per satu:
1. Aplikasi hidup? (pm2 status / systemctl)
2. Nginx meneruskan dengan benar? (curl localhost:3000 di server)
3. Firewall membuka port 80/443?
4. DNS sudah mengarah ke IP VPS?
5. SSL valid?

Beri langkah diagnosa & perbaikan langkah demi langkah.
```

### Prompt 3: Deploy Ulang Setelah Perubahan

```text
Saya sudah mengubah kode aplikasi saya dan sudah push ke GitHub.
Pandu saya deploy ulang ke VPS:

1. Pull kode terbaru di server (git pull)
2. Install dependency baru kalau ada
3. Build ulang (npm run build / composer install)
4. Restart PM2 (pm2 restart [nama])
5. Tes: curl -I https://domain-anda.com → harus 200

Jelaskan tiap langkah singkat.
```

---

## 🏗️ 18.14 PRAKTIK

### Latihan 1: Kenali Server (30 menit)

```text
Masuk ke VPS Anda via SSH, lalu jalankan:
1. whoami          → siapa user Anda (root?)
2. cat /etc/os-release → OS apa
3. free -h         → berapa RAM
4. df -h           → berapa disk
5. ip addr         → IP server

Minta AI jelaskan arti setiap output.
```

### Latihan 2: Aplikasi Online (2-3 jam)

```text
Gunakan Prompt 1 (18.13) untuk deploy salah satu aplikasi
yang sudah Anda buat (proyek perpustakaan / to-do list).

Target:
☐ Aplikasi online di http://[IP-VPS]:3000 (tanpa Nginx dulu)
☐ Nginx terpasang & mengarah ke aplikasi
☐ Domain terhubung (A Record)
☐ HTTPS aktif (gembok 🔒)
☐ Aplikasi tetap hidup setelah server reboot (PM2)
```

### Latihan 3: Rollback & Troubleshoot (30 menit)

```text
1. Hentikan aplikasi: pm2 stop [nama]
   → cek di browser: apa yang muncul? (jawaban: connection refused)
2. Nyalakan lagi: pm2 start [nama]
3. Hapus akses port 3000 dari firewall
   → apakah website tetap jalan? (jawaban: ya, karena lewat Nginx 80/443)
4. Jelaskan mengapa port 3000 tidak perlu dibuka ke publik
   (Nginx yang melayani di 80/443, aplikasi cukup di internal)
```

---

## 🧠 18.15 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **Server** | Komputer hidup 24 jam di data center |
| **Hosting** | Menyewa "rumah" internet untuk aplikasi |
| **Jenis hosting** | Shared (kos) → VPS (apartemen) → Dedicated (rumah) → Cloud |
| **Hosting gratis** | Oracle (12GB RAM!), Google e2-micro, AWS/Azure (12 bln) |
| **Hosting berbayar** | Hetzner (value terbaik), DO/Linode (mudah), Contabo (RAM besar) |
| **VPS** | Server virtual milik sendiri dengan akses root |
| **SSH** | Masuk ke server dari jauh (port 22) |
| **UFW** | Firewall: buka 22, 80, 443 |
| **PM2** | Menjaga Node app tetap hidup & auto-restart |
| **Nginx** | Reverse proxy: 80/443 → aplikasi internal |
| **DNS A Record** | Domain → IP VPS |
| **Let's Encrypt** | SSL gratis + perpanjangan otomatis |
| **AI model (Ollama)** | LLM open source jalan di VPS sendiri, API port 11434 |

### Checklist

```
☐ Paham apa itu server, hosting, data center (18.1)
☐ Bisa bedakan shared / VPS / dedicated / cloud (18.2)
☐ Tahu pilihan hosting gratis & berbayar + syaratnya (18.2)
☐ VPS dibuat & bisa masuk via SSH
☐ Firewall UFW aktif (22, 80, 443)
☐ Aplikasi jalan di server (PM2 / artisan serve)
☐ Nginx mengarah ke aplikasi
☐ Domain terhubung ke IP VPS
☐ HTTPS aktif (Let's Encrypt)
☐ Aplikasi tetap hidup setelah reboot
☐ (Opsional) Ollama jalan & aplikasi bisa memanggilnya
☐ Paham beda development vs production
```

### Ketika Bingung

```text
❓ "Permission denied (publickey)" saat SSH
   → SSH key belum terpasang / salah. Minta AI pandu ulang.

❓ Bingung beda hosting gratis & berbayar
   → Baca ulang 18.2.2-18.2.3. Gratis untuk belajar; berbayar
     (Hetzner/DO) untuk aplikasi yang benar-benar dipakai.

❓ Ingin AI di website tapi bingung mulai dari mana
   → Baca 18.16. Mulai dari model llama3.2 3B di VPS 8GB.

❓ Ollama lambat menjawab
   → Model terlalu besar untuk RAM VPS. Ganti ke model 3B,
     atau naikkan RAM VPS, atau pakai VPS GPU (RunPod/Vast).

❓ Website tidak muncul
   → cek urutan: aplikasi hidup? → Nginx OK? → firewall? → DNS?

❓ "502 Bad Gateway" di Nginx
   → Nginx tidak bisa menjangkau aplikasi. Cek: pm2 status
     & proxy_pass benar? Aplikasi mati?

❓ HTTP malah redirect ke HTTPS tapi SSL belum ada
   → Certbot belum selesai. Jalankan ulang certbot.

❓ Server lemot
   → RAM habis (aplikasi berat). Cek: free -h. Minta AI optimasi.

❓ Stuck? Tempel output terminal ke AI (Prompt 18.13 bagian 2)
```

---

## 🤖 18.16 BONUS: MEMASANG AI MODEL (LLM) DI VPS

> **Kenapa bagian ini ada?** Karena setelah aplikasi Anda online, banyak
> yang ingin menambahkan "otak AI" ke dalamnya — misal chatbot untuk
> website, ringkasan otomatis, atau asisten sekolah. Semua itu bisa
> dijalankan DI VPS Anda sendiri, tanpa bayar langganan API (atau dengan
> biaya sangat murah).

### 18.16.1 Dulu: Apa Itu "AI Model" yang Bisa Dipasang?

```text
AI MODEL (LLM) = program "otak" yang bisa baca & tulis teks.

ChatGPT = contoh LLM besar yang di-host OpenAI (bayar langganan).
TAPI: banyak LLM OPEN SOURCE (gratis) yang bisa diunduh & dijalankan
sendiri di VPS, contoh:

  llama3.2 (Meta)      → ringan, cepat (1B & 3B)
  llama3.1 8B (Meta)   → standar, pintar, butuh RAM besar
  mistral (Mistral)    → kuat, bahasa bagus
  qwen2.5 (Alibaba)    → bagus untuk bahasa campuran
  phi (Microsoft)      → super ringan, pintar untuk ukurannya

Cara kerjanya di VPS:
1. Unduh model (file beberapa GB)  →  ollama pull
2. Jalankan sebagai API di VPS     →  ollama run
3. Aplikasi Anda memanggil API itu  →  seperti pakai ChatGPT API!
```

> 💡 **Nama alatnya: Ollama** — software paling mudah untuk menjalankan
> LLM di server sendiri (sumber: docs.ollama.com). Seperti "Docker untuk
> AI model": satu perintah, model langsung jalan.

---

### 18.16.2 Berapa Spesifikasi VPS yang Dibutuhkan?

**Rumus sederhana (hasil riset docs.ollama.com):**

```text
Model 1B-3B   (llama3.2 1B/3B)  →  butuh ±2-4GB RAM  →  VPS murah OK! ✅
Model 7B-8B   (llama3.1 8B, qwen 7B) → butuh ±6-8GB RAM → VPS menengah
Model 70B+    (llama3.1 70B)      →  butuh 40-80GB+   →  wajib VPS GPU (mahal)

CATATAN PENTING:
- Model KECIL (1B-3B) jalan di CPU biasa, tanpa GPU, masih lumayan cepat.
- Model 8B di CPU: bisa jalan tapi lambat (beberapa detik per jawaban).
- Kalau mau cepat seperti ChatGPT asli → butuh VPS dengan GPU NVIDIA
  (RunPod, Vast.ai, Lambda Labs — bayar per jam, mulai ±$0.20/jam).
```

```text
CONTOH PASANGAN YANG COCOK UNTUK PEMULA:
┌────────────────────────────────────────────────┐
│  VPS: Contabo 8GB RAM (±€5/bln) atau           │
│       Hetzner 4GB RAM (±€5/bln)                │
│  Model: llama3.2 3B atau phi3 (ringan & pintar)│
│  Hasil: chatbot pribadi jalan di website Anda!│
└────────────────────────────────────────────────┘
```

> 🎯 **Rekomendasi jujur untuk pemula:** mulai dari model **3B** di VPS
> 8GB. Jangan langsung coba model 70B — itu butuh GPU yang mahal.

---

### 18.16.3 Langkah Instalasi (Ollama di Ubuntu VPS)

```bash
# 1. Masuk ke VPS via SSH (ingat 18.5)
ssh root@IP_VPS_ANDA

# 2. Install Ollama (satu perintah):
curl -fsSL https://ollama.com/install.sh | sh

# 3. Unduh model pertama (contoh: llama3.2 — ringan):
ollama pull llama3.2

# 4. Tes langsung di terminal:
ollama run llama3.2
#   → muncul prompt, ketik "Halo, perkenalkan dirimu"
#   → AI menjawab! (tekan Ctrl+D untuk keluar)

# 5. Cek daftar model yang sudah diunduh:
ollama list
```

> 💡 **Jangan hafal perintah.** Minta AI memandu:
> ```text
> Saya punya VPS Ubuntu 8GB RAM. Pandu saya menginstall Ollama dan
> menjalankan model llama3.2. Tunjukkan perintah lengkap langkah demi
> langkah, jelaskan apa arti setiap perintah. Saya pemula.
> ```

---

### 18.16.4 Menghubungkan AI ke Aplikasi Anda (Integrasi API)

Ollama otomatis menyediakan **API** (sumber: docs.ollama.com). Aplikasi
Anda tinggal memanggilnya — sama seperti memanggil ChatGPT API,
tapi gratis & di server sendiri:

```text
API Ollama di VPS:   http://localhost:11434/v1/chat/completions
URL dari aplikasi:   http://IP_VPS_ANDA:11434/v1/chat/completions
```

Contoh dari aplikasi Node.js (fetch API bawaan):

```javascript
// app/api/chat/route.js (di aplikasi Next.js Anda)
export async function POST(req) {
  const { pesan } = await req.json();

  const jawaban = await fetch("http://localhost:11434/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      messages: [
        { role: "system", content: "Kamu asisten sekolah yang ramah." },
        { role: "user", content: pesan },
      ],
    }),
  }).then((r) => r.json());

  return Response.json({ jawaban: jawaban.choices[0].message.content });
}
```

```text
ALUR LENGKAP:
Pengguna chat → aplikasi Next.js Anda → Ollama di VPS → jawaban → kembali
```

> ⚠️ **Keamanan (penting!):**
> Jangan biarkan API Ollama terbuka ke internet tanpa proteksi — orang
> lain bisa "menyalahgunakan" AI Anda gratis! Solusi:
> 1. Jangan buka port 11434 ke publik (biarkan hanya localhost),
>    aplikasi Anda yang memanggil dari server yang sama. ✅ (paling aman)
> 2. Kalau harus dari luar: pasang Nginx + password (Basic Auth)
>    + HTTPS (ingat 18.9). Minta AI pandu.

---

### 18.16.5 Ringkasan AI Model di VPS

| Pertanyaan | Jawaban Singkat |
|-----------|-----------------|
| Alatnya apa? | **Ollama** (paling mudah) |
| Model pertama yang dicoba? | **llama3.2 3B** |
| Butuh GPU? | Tidak untuk model 3B; iya untuk 70B |
| RAM yang dibutuhkan? | 3B: ±2-4GB • 8B: ±6-8GB |
| Cara aplikasi memanggilnya? | HTTP API di port 11434 (format OpenAI) |
| Biaya? | Gratis (software & model) + biaya VPS saja |
| VPS ber-GPU (RunPod/Vast)? | Untuk model besar & respons cepat |

> 🎯 **Proyek kecil yang bisa Anda coba:** chatbot FAQ sekolah yang
> dijalankan llama3.2 di VPS 8GB — total biaya hanya VPS-nya (±$5/bln).

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **Loop Engineering** jika sudah bisa:

```
☐ SSH ke server sendiri dengan lancar
☐ Aplikasi online & bisa diakses publik
☐ Nginx + PM2 + SSL bekerja
☐ Paham firewall dasar
```

> **SELAMAT!** Anda sekarang punya aplikasi yang HIDUP di
> internet. Tapi bagaimana cara mengelola proyek besarnya
> dengan workflow profesional? Itu **Modul 19: Loop Engineering**!

---

**📂 Lanjut ke: `19-loop-engineering.md`**
