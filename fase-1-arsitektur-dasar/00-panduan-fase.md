# Fase 1: Arsitektur & Desain Aplikasi — Panduan Fase

> **Durasi:** ~6 minggu (1 jam/hari)
> **Target:** Memahami cara mendesain aplikasi yang baik dari nol
> **Sumber:** `donnemartin/system-design-primer` + `ashishps1/awesome-system-design-resources`

---

## 🎯 Tujuan Fase Ini

Di akhir fase ini, Anda akan mampu:

1. **Memahami konsep dasar arsitektur software** — scalability, performance, availability
2. **Mengenali komponen sistem** — DNS, CDN, Load Balancer, Database, Cache, dll
3. **Membuat desain high-level** untuk aplikasi sederhana
4. **Memahami trade-off** setiap keputusan arsitektur
5. **Membaca dan memahami** arsitektur aplikasi yang sudah ada

---

## 📚 Urutan Belajar

| Minggu | File | Topik | Estimasi |
| --- | --- | --- | --- |
| **1** | 01 | Apa itu System Design? | 1 jam |
|  | 02 | Performance vs Scalability | 1 jam |
|  | 03 | Latency vs Throughput | 1 jam |
|  | 04 | Availability vs Consistency (CAP Theorem) | 1.5 jam |
|  | 05 | Pola Konsistensi Data | 1 jam |
| **2** | 06 | Availability Patterns (Fail-over, Replication) | 1.5 jam |
|  | 07 | DNS (Domain Name System) | 1 jam |
|  | 08 | CDN (Content Delivery Network) | 1 jam |
|  | 09 | Load Balancer | 1.5 jam |
|  | 10 | Reverse Proxy | 1 jam |
| **3** | 11 | Application Layer & Microservices | 1.5 jam |
|  | 12 | Database RDBMS | 2 jam |
|  | 13 | Database NoSQL | 1.5 jam |
|  | 14 | Cache | 2 jam |
| **4** | 15 | Asynchronism (Message Queues, Task Queues) | 1.5 jam |
|  | 16 | Komunikasi Protokol (TCP, UDP, RPC, REST) | 1.5 jam |
|  | 17 | Keamanan Sistem | 1 jam |
| **5** | 18 | Studi Kasus: Pastebin/Bit.ly | 2 jam |
|  | 19 | Studi Kasus: Twitter Timeline | 2 jam |
|  | 20 | Studi Kasus: Web Crawler | 2 jam |
| **6** | 21 | Ringkasan Fase 1 + Latihan Final | 2 jam |

---

## 🧠 Cara Belajar Efektif

### Setiap File Memiliki Struktur:

```
📖 TEORI
   Penjelasan konsep dengan bahasa Indonesia yang mudah dipahami
   + analogi dari kehidupan sehari-hari

🎯 CONTOH NYATA
   Bagaimana konsep ini dipakai di aplikasi yang Anda kenal
   (WhatsApp, Gojek, Tokopedia, dll)

💡 PRAKTIK
   Latihan yang bisa dilakukan untuk memahami konsep

✅ CHECKLIST
   Poin yang HARUS dipahami sebelum lanjut ke file berikutnya

🔗 REFERENSI
   Link ke repo asli untuk eksplorasi lebih lanjut
```

### Tips Belajar:

1. **Baca pelan-pelan** — Arsitektur bukan hafalan, tapi pemahaman
2. **Gambar diagram** — Setiap konsep, coba gambar sendiri di kertas
3. **Hubungkan dengan pengalaman** — "Oh, jadi ini kenapa WhatsApp kadang lambat!"
4. **Jangan skip studi kasus** — Ini bagian paling penting untuk memahami penerapan
5. **Tanya AI** — Setelah Fase 2, Anda bisa minta AI jelaskan konsep yang sulit

---

## 📝 Latihan Fase 1

Di akhir fase, Anda akan diminta mendesain:

1. **Aplikasi Absensi Sekolah** — Sistem absensi untuk SD Negeri Pasirhalang
2. **Aplikasi Keuangan BOS Sederhana** — Tracking pemasukan dan pengeluaran
3. **Aplikasi Portal Informasi Sekolah** — Website informasi untuk orang tua siswa

Ini bukan coding — ini **desain arsitektur**. Anda akan menggambar:
- Komponen apa saja yang dibutuhkan
- Bagaimana data mengalir
- Database apa yang cocok
- Bagaimana sistem handle banyak pengguna

---

## ✅ Kapan Siap Lanjut ke Fase 2?

Anda siap lanjut jika bisa menjawab YA untuk semua pertanyaan ini:

- [ ] Bisa jelaskan perbedaan performance vs scalability
- [ ] Bisa jelaskan CAP theorem dengan contoh nyata
- [ ] Bisa jelaskan fungsi Load Balancer, CDN, Cache
- [ ] Bisa pilih antara SQL dan NoSQL untuk kasus tertentu
- [ ] Bisa gambar high-level design aplikasi sederhana
- [ ] Paham konsep horizontal vs vertical scaling

---

> **Selamat belajar!** Buka file `01-apa-itu-system-design.md` untuk memulai.
