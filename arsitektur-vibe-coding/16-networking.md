# 🌐 Modul 16: Networking — Bagaimana Data "Bepergian" di Internet

> **Networking = ilmu "jalan raya" internet. Tanpa ini, Anda tidak paham kenapa aplikasi bisa diakses dari mana saja.**
> Waktu: ~3 jam | Level: 🟢🟡 | Lanjutan dari: Modul 15 (PostgreSQL)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Apa itu IP address & localhost (127.0.0.1)
✅ Apa itu port & port-port penting (80, 443, 5432, 22)
✅ DNS: "buku telepon" internet
✅ HTTP vs HTTPS & status code (200, 404, 500, dll)
✅ localhost vs 0.0.0.0 vs 127.0.0.1
✅ Kenapa networking penting untuk deploy (Modul 18)
```

> 🎯 **Kenapa Anda butuh ini sekarang?**
> Selama ini Anda buka `http://localhost:3000`. Setelah modul ini,
> Anda paham apa artinya "localhost", apa artinya "3000",
> dan apa yang terjadi saat browser Anda mengirim permintaan.

---

## 🧠 16.1 IP ADDRESS: ALAMAT RUMAH DI INTERNET

### Analogi: Alamat Rumah

```text
Setiap rumah punya ALAMAT agar paket bisa dikirim.
Setiap komputer di internet punya IP ADDRESS (alamat).

Saat Anda buka website → browser butuh alamat server-nya
→ alamat itu = IP address.
```

### Dua Jenis IP yang Perlu Anda Tahu

```text
┌──────────────────────┬──────────────────────────────┐
│  IP PRIVAT (pribadi) │  IP PUBLIK (publik)          │
├──────────────────────┼──────────────────────────────┤
│ Alamat di dalam      │ Alamat di internet           │
│ jaringan lokal       │ (bisa diakses siapa saja)    │
│ Contoh: 192.168.1.5  │ Contoh: 103.28.12.5          │
│ Dipakai di rumah,    │ Dipakai server, VPS, website │
│ kantor, sekolah      │                              │
│ TIDAK bisa diakses   │ BISA diakses dari mana saja  │
│ dari luar jaringan   │                              │
└──────────────────────┴──────────────────────────────┘
```

**Rentang IP privat standar (RFC 1918 — sumber: Cloudflare/IETF):**

| Rentang | Dipakai untuk |
|---------|---------------|
| `10.0.0.0 – 10.255.255.255` | Jaringan besar (perusahaan) |
| `172.16.0.0 – 172.31.255.255` | Jaringan sedang |
| `192.168.0.0 – 192.168.255.255` | Rumah/kantor kecil (paling umum) |

> 💡 **Router rumah Anda** (biasanya `192.168.1.1`) memberi IP privat
> ke semua perangkat di rumah. Saat perangkat itu keluar internet,
> router "menerjemahkan" IP privat → IP publik (NAT).

### IPv4 vs IPv6

```text
IPv4 = versi lama, format: 192.168.1.1 (4 angka, tiap angka 0-255)
       → Jumlahnya terbatas (±4,3 miliar) — sudah hampir habis!

IPv6 = versi baru, format: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
       → Jumlahnya RAKSASA (cukup untuk semua perangkat di dunia)
```

> 🎯 **Untuk belajar sekarang:** cukup paham IPv4. IPv6 tinggal
> "ada" — otomatis dipakai sistem modern.

---

## 🧠 16.2 LOCALHOST & 127.0.0.1: "RUMAH SENDIRI"

```text
localhost = nama yang menunjuk ke KOMPUTER ANDA SENDIRI
127.0.0.1 = alamat loopback (alamat "kembali ke diri sendiri")

localhost → otomatis di-resolve ke → 127.0.0.1 (atau ::1 untuk IPv6)
```

**Kenapa penting untuk Anda?**

```text
Selama ini Anda menjalankan:
- npm run dev → buka http://localhost:3000
- php artisan serve → buka http://127.0.0.1:8000

Artinya: aplikasi Anda JALAN di komputer sendiri, dan hanya
komputer ini yang bisa mengaksesnya (karena IP privat lokal).

Kalau mau diakses orang lain → butuh VPS (Modul 18)!
```

### localhost vs 0.0.0.0 (Sumber: Cloudflare)

| Nilai | Arti |
|-------|------|
| `127.0.0.1` | Khusus komputer sendiri (loopback) |
| `localhost` | Nama yang menunjuk ke 127.0.0.1 |
| `0.0.0.0` | "Dengarkan di SEMUA antarmuka" — termasuk IP LAN & publik |

> 💡 **Contoh nyata:** kalau Anda jalankan server dengan
> `php artisan serve --host=0.0.0.0`, server mendengarkan di semua
> antarmuka — bisa diakses lewat IP LAN komputer Anda.

---

## 🧠 16.3 PORT: "NOMOR RUANGAN" DI SEBUAH ALAMAT

### Analogi: Gedung & Ruangan

```text
IP ADDRESS = alamat gedung (mis. Jl. Sudirman No. 1)
PORT       = nomor ruangan di dalam gedung (mis. Ruang 3000)

Server punya SATU IP, tapi bisa melayani BANYAK layanan
lewat port yang berbeda.
```

### Port Penting yang Harus Anda Hafal (Sumber: IANA)

| Port | Layanan | Kenapa Penting |
|------|---------|----------------|
| **22** | SSH | Remote ke server (Modul 18) |
| **80** | HTTP | Website biasa (tanpa kunci) |
| **443** | HTTPS | Website aman (dengan kunci SSL) |
| **3000** | Next.js / React dev | Default `npm run dev` |
| **3306** | MySQL | Database |
| **5432** | PostgreSQL | Database (Modul 15) |
| **8000** | Laravel dev | Default `php artisan serve` |

**Aturan IANA:** port `0–1023` = *well-known ports* (dipakai
layanan standar). Port di atasnya bebas dipakai aplikasi Anda.

### Contoh URL dengan Port

```text
http://localhost:3000
└────┘ └───────┘ └──┘
protokol  alamat   port
           (host)

Kalau port tidak ditulis → browser anggap default:
- http  → port 80
- https → port 443
```

> 🎯 **Kenapa "3000" atau "8000"?** Karena `create-next-app` dan
> `php artisan serve` memilih port tersebut secara default. Anda
> bisa ganti (mis. `-p 5000`) kalau bentrok.

---

## 🧠 16.4 DNS: "BUKU TELEPON" INTERNET

### Masalahnya

```text
Komputer butuh IP untuk terhubung (mis. 103.28.12.5).
Tapi manusia susah menghafal angka!

Solusi: nama domain — https://sekolahku.com
```

### Cara Kerja DNS (Sederhana)

```text
Anda ketik: sekolahku.com
        │
        ▼
  DNS QUERY → "sekolahku.com alamatnya berapa?"
        │
        ▼
  DNS Server (mis. 1.1.1.1 Cloudflare / 8.8.8.8 Google)
  membalas: "103.28.12.5"
        │
        ▼
  Browser terhubung ke 103.28.12.5 → website tampil
```

**DNS = seperti buku telepon** (Cloudflare Learning Center):
menerjemahkan nama yang mudah diingat menjadi IP numerik.

> 💡 **Anda akan memakai ini di Modul 18:** saat membeli domain
> dan mengarahkannya (DNS record) ke IP VPS Anda.

### Istilah DNS yang Perlu Anda Tahu

| Istilah | Arti |
|---------|------|
| **Domain** | Nama website (sekolahku.com) |
| **A Record** | Menunjuk domain → IP address |
| **CNAME** | Menunjuk domain → domain lain |
| **Subdomain** | Bagian depan (app.sekolahku.com) |

---

## 🧠 16.5 HTTP vs HTTPS: JALAN RAYA BIASA vs JALAN TOLL AMAN

### Perbedaan Inti

```text
HTTP  = data dikirim POLOS (teks biasa) — bisa disadap orang
HTTPS = data dikirim TERENKRIPSI (TLS/SSL) — aman dari penyadap

HTTPS = HTTP + enkripsi TLS (penerus SSL)
```

### Analogi

```text
HTTP  = kirim surat pos terbuka → petugas pos bisa baca isinya
HTTPS = kirim surat dalam brankas terkunci → hanya penerima
        yang punya kuncinya yang bisa baca
```

> 🎯 **Aturan emas:** JANGAN pernah kirim password/rahasia lewat
> HTTP biasa. Selalu HTTPS di produksi (Modul 18: SSL dengan
> Let's Encrypt).

### Tanda HTTPS di Browser

```text
https://sekolahku.com  🔒  = aman (ada sertifikat SSL)
http://sekolahku.com   ⚠️   = tidak aman (browser akan menandai)
```

---

## 🧠 16.6 STATUS CODE HTTP: "KODE BALASAN" SERVER

Setiap kali browser minta data, server selalu membalas dengan
**status code** — kode 3 digit yang memberi tahu apa yang terjadi.
(Sumber: MDN Web Docs / RFC 9110)

### Kode yang Paling Sering Anda Jumpai

| Kode | Arti | Contoh |
|------|------|--------|
| **200** | OK — berhasil | Halaman tampil normal |
| **201** | Created — berhasil buat data baru | POST API berhasil |
| **301** | Moved Permanently — pindah selamanya | Domain ganti |
| **302** | Found — pindah sementara | Redirect sementara |
| **400** | Bad Request — permintaan salah | Input tidak valid |
| **401** | Unauthorized — belum login | Perlu token/akun |
| **403** | Forbidden — tidak punya izin | Login tapi dilarang |
| **404** | Not Found — tidak ada | Halaman tidak ada |
| **429** | Too Many Requests — kebanyakan minta | Rate limit |
| **500** | Internal Server Error — error di server | Bug aplikasi |

### Cara Melihat Status Code

```text
Cara 1: Browser → F12 → tab Network → klik permintaan → lihat Status
Cara 2: Terminal → curl -I https://sekolahku.com
```

> 🎯 **Ini penting di coding:** saat Anda membuat API (Modul 17),
> Anda HARUS membalas dengan status code yang benar —
> 200 sukses, 201 created, 400 input salah, 404 tidak ada, 500 error.

---

## 🤖 16.7 TEMPLATE PROMPT NETWORKING

### Prompt 1: Ajarkan Networking dari Proyek Anda

```text
Saya sedang belajar networking sambil membangun aplikasi.

Jelaskan dengan analogi sederhana:
1. Apa yang terjadi di jaringan saat saya buka http://localhost:3000?
   (lacak langkah demi langkah: browser → DNS → port → server)
2. Bedakan: localhost, 127.0.0.1, 0.0.0.0, dan IP LAN saya
3. Kenapa aplikasi saya tidak bisa diakses orang lain padahal
   server saya jalan?

Gunakan bahasa sederhana, saya pemula.
```

### Prompt 2: Diagnosa Masalah Koneksi

```text
Saya punya masalah koneksi:
- Yang saya coba: [perintah/URL]
- Gejala: [error yang muncul / halaman tidak terbuka]
- Sudah dicoba: [langkah yang sudah dicoba]

Bantu saya diagnosa apakah ini masalah:
1. Port (salah port / port terbuka di firewall?)
2. IP (salah alamat / localhost?)
3. DNS (domain belum terhubung?)
4. HTTPS/SSL (sertifikat bermasalah?)

Beri langkah perbaikan satu per satu.
```

### Prompt 3: Cek Status Code

```text
Saya mau belajar membaca status code HTTP.

1. Jelaskan arti tiap kode ini dengan contoh nyata:
   200, 201, 301, 302, 400, 401, 403, 404, 429, 500
2. Tunjukkan 3 contoh URL publik yang kemungkinan besar
   membalas 404 dan 200
3. Jelaskan cara melihat status code di DevTools browser

Gaya: sederhana, tabel, analogi.
```

---

## 🏗️ 16.8 PRAKTIK

### Latihan 1: Eksplorasi Port & IP (30 menit)

```text
1. Buka terminal, jalankan:  ipconfig        (Windows)
   → cari IPv4 Address (ini IP LAN komputer Anda)
2. Jalankan aplikasi Next.js Anda (npm run dev)
3. Buka di browser:  http://localhost:3000  → jalan?
4. Coba akses pakai IP LAN Anda:  http://[IP-LAN-ANDA]:3000
   → kalau bisa, berarti server mendengarkan di semua antarmuka
5. Minta AI jelaskan kenapa hasil langkah 3 & 4 bisa sama/beda
```

### Latihan 2: Pahami Status Code (30 menit)

```text
1. Buka https://jsonplaceholder.typicode.com/users di browser
   → lihat di DevTools (F12 → Network) status code-nya
2. Buka URL yang tidak ada: https://jsonplaceholder.typicode.com/xyz
   → status code berapa? (jawaban: 404)
3. Buka website favorit Anda → cek status code halaman utamanya
4. Catat 3 status code berbeda yang Anda temukan hari ini
```

### Latihan 3: DNS (20 menit)

```text
1. Di terminal jalankan:  nslookup google.com
   → lihat: Address = IP publik google.com
2. Bandingkan dengan:    nslookup sekolahku.com
3. Minta AI:
   "Jelaskan apa yang saya lihat dari hasil nslookup ini:
    [tempel hasilnya]"
```

---

## 🧠 16.9 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya |
|--------|---------|
| **IP address** | Alamat komputer di jaringan (privat vs publik) |
| **localhost / 127.0.0.1** | Alamat komputer sendiri |
| **0.0.0.0** | Dengarkan di semua antarmuka |
| **Port** | "Nomor ruangan" — 22 SSH, 80 HTTP, 443 HTTPS, 5432 PG |
| **DNS** | Buku telepon: domain → IP |
| **HTTP vs HTTPS** | Polos vs terenkripsi (TLS/SSL) |
| **Status code** | 200 OK, 201 Created, 400, 401, 403, 404, 500 |

### Checklist

```
☐ Bisa jelaskan IP privat vs IP publik (RFC 1918)
☐ Bisa jelaskan localhost vs 0.0.0.0 vs 127.0.0.1
☐ Hafal port: 22, 80, 443, 3000, 3306, 5432, 8000
☐ Paham cara kerja DNS sederhana
☐ Bisa bedakan HTTP dan HTTPS
☐ Hafal status code: 200, 201, 400, 401, 403, 404, 500
☐ Sudah cek status code di DevTools browser
☐ Sudah cek IP LAN sendiri dengan ipconfig
```

### Ketika Bingung

```text
❓ "localhost menolak koneksi" (connection refused)
   → server belum jalan, atau salah port. Cek terminal.

❓ "Address already in use"
   → port sudah dipakai program lain. Ganti port atau
     matikan program lain.

❓ Halaman "tidak aman" (https hilang)
   → belum pasang SSL. Di produksi pakai Let's Encrypt (Modul 18).

❓ Website bisa diakses saya tapi tidak orang lain
   → normal! Server lokal. Deploy ke VPS (Modul 18).

❓ Stuck? Tempel error ke AI + konteks (Prompt 16.7 bagian 2)
```

---

## 🎯 KAPAN LANJUT?

Anda siap lanjut ke **API** jika sudah bisa:

```
☐ Menjelaskan IP privat vs publik dengan contoh
☐ Hafal port-port penting
☐ Paham HTTP vs HTTPS & status code dasar
☐ Bisa menjelaskan apa yang terjadi saat membuka localhost:3000
```

> **Ingat:** Networking = jalan raya. Sekarang kita belajar
> aturan lalu lintasnya: **Modul 17: API**!

---

**📂 Lanjut ke: `17-api.md`**
