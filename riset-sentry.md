# Riset — Sentry (`getsentry/sentry`)

> **MULAI:** apa fungsi dan kegunaan `getsentry/sentry`, dan bisakah xcode memakainya gratis?
> **SELESAI:** penjelasan bahasa sederhana + fakta terverifikasi + relevansi ke repo ini.
> **Tanggal riset:** 9 Okt 2026 · **Metode:** GitHub API (`gh api`) + `raw.githubusercontent.com`
> + `sentry.io/pricing/` dibaca langsung (sesuai `MEMORY.md` §2 — hanya repo/dokumen resmi).
>
> **Catatan:** berkas ini semula bernama `riset-icode-dan-sentry.md` dan memuat riset dua repo
> sekaligus. Bagian iCode dihapus atas permintaan xcode (9 Okt 2026); salinan lengkap sebelum
> penghapusan ada di `_backup/riset-icode-dan-sentry-20261009/`.

---

## 1. Sentry — `getsentry/sentry`

### 1.1 Fakta terverifikasi

| Item | Nilai |
|---|---|
| Deskripsi resmi | *"Developer-first error tracking and performance monitoring"* |
| Situs | `sentry.io` |
| Dibuat | **30 Agu 2010** |
| Bintang / fork | **45.520** / 4.916 |
| Lisensi | **FSL-1.1-Apache-2.0** (Functional Source License) |
| Rilis terakhir | **26.9.0** (15 Sep 2026) — penomoran CalVer `tahun.bulan` |
| Topics | `apm`, `error-logging`, `error-monitoring`, `crash-reporting`, `monitoring`, `devops` |
| Issue terbuka | 2.274 |

### 1.2 Apa ini sebenarnya

**Sentry = sistem alarm untuk aplikasi yang sudah dipakai orang.**

Bayangkan aplikasi sekolah yang sudah dipakai guru. Tanpa Sentry, cara tahu ada yang rusak
adalah **menunggu ada yang mengeluh**. Dengan Sentry, kamu tahu **lebih dulu** — lengkap
dengan baris kode mana yang meledak, siapa yang kena, dan sejak versi berapa.

Repo `getsentry/sentry` ini adalah **servernya** (bisa dipasang sendiri / *self-host*).
Ada juga versi awan berbayar di `sentry.io` — dan versi gratis untuk skala kecil.

### 1.3 Tiga hal yang dikerjakan

| Kemampuan | Artinya dalam bahasa manusia |
|---|---|
| **Error tracking** | Menangkap semua error yang terjadi di aplikasi nyata, mengelompokkannya, dan menunjukkan baris kode penyebabnya |
| **Performance monitoring (APM)** | Melacak mana yang lambat — query database, API call, render halaman — lewat *trace* |
| **Session replay** | Merekam ulang sesi pengguna, seperti video, supaya bisa melihat apa yang sebenarnya dia lakukan sebelum error |
| ➕ | Juga ada **logs**, **uptime** (pemantauan situs mati), **CSP report**, dan **Seer** (bantuan debug berbasis AI) |

### 1.4 Cara pakai: SDK, bukan aplikasi

Sentry **tidak** dipakai dengan membuka aplikasinya. Kamu memasang **SDK** di dalam kode
aplikasimu — sekitar 3 baris — lalu ia melapor otomatis ke server.

SDK resmi tersedia untuk **±20 bahasa/platform**:
JavaScript · Electron · React Native · Python · Ruby · PHP · Laravel · Go · Rust ·
Java/Kotlin · Swift/Objective-C · C#/F# · C/C++ · Dart/Flutter · Perl · Clojure ·
Elixir · Unity · Unreal Engine · Godot · PowerShell

### 1.5 🔴 Lisensi — ini penting dan sering salah dipahami

Sentry **BUKAN open source** dalam arti standar OSI. Lisensinya
**FSL-1.1-Apache-2.0** (*Functional Source License*) — disebut *"fair source"*.

| | Boleh | Tidak boleh |
|---|---|---|
| Pemakaian internal | ✅ | |
| Pendidikan non-komersial | ✅ | |
| Riset non-komersial | ✅ | |
| **Competing Use** — menyediakan produk/jasa komersial yang menggantikan Sentry | | ❌ |

**Yang melegakan:** setiap versi **otomatis berubah jadi Apache-2.0 pada ulang tahunnya
yang kedua**. Jadi kode lama Sentry benar-benar bebas; kode baru belum.

⚠️ Untuk aplikasi sekolah (internal, non-komersial) → **boleh dipakai**. Tapi jangan
dijadikan dasar membuat layanan monitoring berbayar.

---

## 2. ✅ BISAKAH DIPAKAI GRATIS? — YA

Ditambahkan 9 Okt 2026, atas pertanyaan xcode. Sumber: `sentry.io/pricing/` (dibaca langsung)
+ `getsentry/sentry-docs` (`docs/pricing/quotas/index.mdx`,
`docs/security-legal-pii/security/data-retention-periods.mdx`).

### Jawaban singkat

**Ya. Paket `Developer` = $0, tanpa batas waktu, tanpa kartu kredit.**

Kalimat resmi di halaman harga: *"Start free on the Developer plan **forever**."*

### Isi paket Developer (gratis)

| Kategori | Kuota |
|---|---|
| Pengguna | **1** |
| Proyek | Tak terbatas |
| **Error** | **5.000 / bulan** |
| Tracing (spans) | 5 juta |
| Logs | 5 GB |
| Application Metrics | 5 GB |
| Session Replay | 50 rekaman |
| Uptime monitor | 1 |
| Cron monitor | 1 |
| Metric monitor | 20 |
| Attachments | 1 GB |
| Size Analysis | 100 build |
| Release Health | 10 |
| Dashboard kustom | 10 |
| Alert | via **email** |
| **MCP access** | ✅ **termasuk** |
| Retensi data | **30 hari** (semua jenis data) |

⚠️ **"1 pengguna" ≠ "1 orang pakai aplikasimu".** Yang dibatasi adalah **siapa yang bisa
membuka dashboard Sentry** — yaitu xcode sendiri. Aplikasi sekolah tetap bisa dipakai
berapa pun guru. Ini yang paling sering disalahpahami.

⚠️ **Retensi 30 hari** — error yang lebih tua dari 30 hari **hilang**. Untuk debugging
mingguan tidak masalah; untuk audit jangka panjang, tidak cukup.

### 🔴 Yang paling penting: kuota lewat = data dibuang, BUKAN ditagih

Kalimat verbatim dari dokumentasi resmi:

> *"Events and attachments that exceed your quota **will not be accepted**, so you may want
> to increase your quota."*

Artinya: **tidak ada tagihan kejutan.** Kehabisan kuota → error baru berhenti dicatat
sampai bulan berikutnya. Paket gratis **tidak bisa** diam-diam berubah jadi berbayar.

### Paket berbayar (untuk perbandingan)

| Paket | Harga | Bedanya |
|---|---|---|
| Developer | **$0** | 1 pengguna · 5k error · retensi 30 hari |
| Team | $26/bln | Pengguna tak terbatas · 50k error · retensi 90 hari |
| Business | $80/bln | + manajemen kuota lanjutan · SAML/SCIM |
| Enterprise | Custom | + account manager |
| **Seer** (debug AI) | **$40/kontributor aktif/bln** | Add-on, **tidak** ada di paket gratis |

➕ **Promo:** pengguna baru dapat **5.000 session replay gratis** selama 3 bulan pertama
(di atas 50 yang biasa).

### Alternatif: self-hosted — gratis juga, tapi berat

Repo `getsentry/self-hosted` (9.601 ⭐) membungkus Sentry penuh untuk dijalankan sendiri.
Gratis, tanpa batas kuota. **Tapi syarat perangkat kerasnya nyata:**

| Kebutuhan | Nilai |
|---|---|
| Docker | 19.03.6+ · Compose 2.32.2+ |
| CPU | **4 core** |
| RAM | **16 GB + 16 GB swap** (disarankan 32 GB) |
| Disk | **20 GB** |
| Port default | 9000 |

Kalimat resmi: *"This version comes with **no guarantees or dedicated support**."*
Dokumentasinya sendiri menyebutnya untuk *"low-volume deployments and proofs-of-concept"*.

**Yang hilang di self-hosted:** billing, spike protection, spend allocation,
**Seer + semua fitur AI/ML (closed source)**, pilihan lokasi penyimpanan data.
Tapi: *"consider self-hosted as the **Business plan** without any software limitations
and no paid tier."*

### Kesimpulan untuk xcode

**Pakai SaaS paket Developer (gratis).** Self-hosted butuh server 16 GB RAM — untuk
belajar dan aplikasi sekolah, itu berlebihan dan menambah beban operasional yang tidak
melayani tujuan.

5.000 error/bulan sangat longgar untuk aplikasi sekolah. Yang perlu diwaspadai bukan
jumlahnya, tapi **pola berulang**: satu bug yang menyala di setiap pemuatan halaman bisa
menghabiskan kuota dalam hitungan jam. Penangkalnya: aktifkan **spike protection**
(otomatis di SaaS) dan pakai `beforeSend` / rate limit di SDK.

➕ **Bonus yang relevan:** paket gratis sudah termasuk **MCP access** — Sentry bisa
disambungkan sebagai MCP server, sejalan dengan setup xcode yang sudah memakai MCP.

---

## 3. Relevansi ke repo ini

Repo ini adalah **repo materi pembelajaran**, bukan aplikasi produksi. Sentry tidak
punya tempat di sini sekarang.

Tapi ia **relevan untuk tujuan akhir xcode**: *laporan sekolah* (administrasi, keuangan).
Begitu aplikasi sekolah itu benar-benar dipakai guru, "kenapa layar ini kosong?" akan jadi
pertanyaan harian — dan Sentry-lah jawabannya. Catat sebagai **bahan nanti**, bukan sekarang.

➡️ **Sejak 9 Okt 2026** rencana itu sudah punya rumah: **Bab 29**
(`architecture-planner/MATERI-PECAHAN/29-Sentry-Logging-Error-Produksi.md`) — langkah
pemasangan, integrasi MCP untuk agent, dan 4 titik sambung ke workflow Bab 27.

---

## 4. Jebakan & catatan

| Jebakan | Keterangan |
|---|---|
| **Sentry berlisensi FSL** | Bukan OSI. Batas *Competing Use* nyata. Baru jadi Apache-2.0 setelah 2 tahun |
| **Repo Sentry = server, bukan SDK** | SDK-nya repo terpisah (`sentry-python`, `sentry-javascript`, dst.) |
| **Sentry SaaS ≠ Sentry self-host** | Fitur bisa berbeda; self-host punya beban operasional sendiri |
| **Kuota lewat ≠ ditagih** | Data **dibuang**, bukan ditagih — jangan takut paket gratis "bocor" jadi berbayar |
| **"1 pengguna" menyesatkan** | Itu batas **akses dashboard**, bukan batas pengguna aplikasi |
| **Retensi 30 hari** | Error lebih tua dari 30 hari hilang — bukan arsip audit |

---

## 5. Sumber

1. `https://api.github.com/repos/getsentry/sentry` — metadata, topics
2. `https://raw.githubusercontent.com/getsentry/sentry/master/README.md` — daftar SDK
3. `.../master/LICENSE.md` — FSL-1.1-Apache-2.0, syarat *Competing Use*, ulang tahun ke-2
4. `https://sentry.io/pricing/` — paket Developer/Team/Business/Enterprise, kuota lengkap,
   harga Seer, promo replay (dibaca 9 Okt 2026)
5. `getsentry/sentry-docs` → `docs/pricing/quotas/index.mdx` — kalimat *"will not be accepted"*
6. `getsentry/sentry-docs` → `docs/security-legal-pii/security/data-retention-periods.mdx`
   — tabel retensi per paket (Developer 30 hari)
7. `getsentry/sentry-docs` → `develop-docs/self-hosted/index.mdx` — kebutuhan minimum
   (4 core · 16 GB RAM · 20 GB disk), daftar fitur yang hilang di self-hosted
8. `https://api.github.com/repos/getsentry/self-hosted` — 9.601 ⭐, masih aktif

⚠️ `docs.sentry.io` adalah **SPA** — halaman kosong saat dibaca statis. Isi aslinya diambil
dari repo `getsentry/sentry-docs` (pola yang sama seperti kasus Stitch, `MEMORY.md` §1.7).
