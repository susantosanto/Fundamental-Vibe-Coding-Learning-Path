# 04 — Availability vs Consistency (CAP Theorem & Beyond)

> **Estimasi:** 2 jam | **Level:** Pemula → Menengah

---

## 📖 TEORI

### CAP Theorem: Fondasi Sistem Terdistribusi

CAP Theorem adalah salah satu konsep **paling penting** dalam system design. Diformulasikan oleh Eric Brewer pada tahun 2000 dan dibuktikan secara formal oleh Gilbert dan Lynch pada tahun 2002.

Teorem ini menyatakan bahwa dalam sistem terdistribusi, Anda hanya bisa memilih **2 dari 3** jaminan berikut:

```
                    SEGITIGA CAP

              Consistency (C)
                 /    \
                /      \
               /        \
              /          \
             /            \
            /              \
    Availability (A) ─── Partition Tolerance (P)

    Pilihan yang mungkin:
    ┌──────────┬──────────────────────────────────────┐
    │ Pilihan  │ Karakteristik                        │
    ├──────────┼──────────────────────────────────────┤
    │ CA       │ Konsisten + Tersedia, tapi gagal     │
    │          │ saat ada partition (tidak realistis) │
    ├──────────┼──────────────────────────────────────┤
    │ CP       │ Konsisten + Toleran partition,       │
    │          │ tapi tidak tersedia saat partition   │
    ├──────────┼──────────────────────────────────────┤
    │ AP       │ Tersedia + Toleran partition,        │
    │          │ tapi data mungkin tidak terbaru      │
    └──────────┴──────────────────────────────────────┘
```

### Penjelasan Mendalam 3 Komponen

#### C — Consistency (Konsistensi Linearizable)

**Definisi formal:** Setiap read menerima write terbaru atau error. Semua node melihat data yang sama pada waktu yang sama.

```
                    KONSISTENSI DALAM AKSI

    Skenario: 2 server, 1 data item (saldo = Rp 100.000)

    Waktu  T0:  Saldo = Rp 100.000 (di kedua server)

    Server A              Server B
    ┌──────────┐          ┌──────────┐
    │ Saldo:   │          │ Saldo:   │
    │ 100.000  │          │ 100.000  │
    └────┬─────┘          └────┬─────┘
         │                     │

    T1:  User X menulis: Saldo = 50.000 (di Server A)

    Server A              Server B
    ┌──────────┐          ┌──────────┐
    │ Saldo:   │  ─sync─→ │ Saldo:   │
    │ 50.000   │          │ 100.000  │  ← belum update!
    └──────────┘          └──────────┘

    T2:  User Y baca dari Server B

    KONSISTEN (Strong):
    User Y harus menunggu sampai sync selesai,
    baru dapat nilai 50.000.

    TIDAK KONSISTEN (Eventual):
    User Y dapat 100.000 (data lama) — ini stale read.
    Nanti akan konsisten setelah sync selesai.
```

**Analogi:** Papan pengumuman sekolah. Jika kepala sekolah tempel pengumuman baru, semua orang yang melihat papan harus melihat pengumuman yang SAMA pada waktu yang SAMA.

```
Contoh KONSISTEN:
User A update saldo: Rp 100.000 → Rp 50.000
User B baca saldo: Rp 50.000 ✅ (data terbaru)
User C baca saldo: Rp 50.000 ✅ (data terbaru)

Contoh TIDAK KONSISTEN:
User A update saldo: Rp 100.000 → Rp 50.000
User B baca saldo: Rp 100.000 ❌ (data lama — stale read)
User C baca saldo: Rp 50.000  ✅ (data terbaru)
→ User B dan C melihat data berbeda pada waktu yang sama!
```

#### A — Availability (Ketersediaan)

**Definisi formal:** Setiap request menerima respons (non-error), tanpa jaminan bahwa itu adalah write terbaru.

```
                    AVAILABILITY DALAM AKSI

    Skenario: 3 server, 1 mati

    Server A     Server B     Server C
    ┌──────┐     ┌──────┐     ┌──────┐
    │  ✅   │     │  ❌   │     │  ✅   │
    │ UP   │     │ DOWN │     │ UP   │
    └──────┘     └──────┘     └──────┘

    HIGH AVAILABILITY:
    Request otomatis diarahkan ke Server A atau C.
    User tidak merasakan gangguan.

    LOW AVAILABILITY:
    Request gagal karena Server B down.
    User mendapat error.
```

**Analogi:** Kasir yang selalu ada di meja. Meskipun kasir belum tahu harga terbaru, dia tetap melayani dan memberikan jawaban (meskipun mungkin tidak akurat).

#### P — Partition Tolerance (Toleransi Partisi)

**Definisi formal:** Sistem tetap berjalan meskipun ada kegagalan komunikasi antar node (network partition).

```
                    NETWORK PARTITION

    Sebelum partition:
    Server Jakarta ←────── OK ──────→ Server Bandung
         ↓                                ↓
      Bisa sync                        Bisa sync

    Saat partition (jaringan putus):
    Server Jakarta ←─── ╳ PUTUS ╳ ───→ Server Bandung
         ↓                                ↓
      Tidak bisa                       Tidak bisa
      komunikasi                       komunikasi

    Sistem harus memilih:
    1. Tolak request (pilih C) → Sacrifice Availability
    2. Terima request (pilih A) → Sacrifice Consistency
```

**Analogi:** Dua cabang sekolah yang tidak bisa berkomunikasi karena telepon putus. Masing-masing cabang tetap beroperasi sendiri, tapi data mungkin berbeda.

### Kenapa P Harus Selalu Dipilih?

Ini adalah poin yang sering disalahpahami. Dalam sistem terdistribusi **modern**, P bukan pilihan — ini **keharusan**.

```
                    REALITA JARINGAN

    ┌──────────────────────────────────────────────────┐
    │  "Jaringan tidak pernah 100% reliable"           │
    │                                                  │
    │  Penyebab partition:                             │
    │  • Switch/router failure                         │
    │  • Kabel fiber terputus                          │
    │  • DNS failure                                   │
    │  • Network congestion                            │
    │  • Software bug di network stack                 │
    │  • Maintenance yang tidak terkoordinasi          │
    │  • Serangan DDoS                                 │
    │  • Bencana alam (gempa, banjir)                  │
    │                                                  │
    │  Bahkan Google, AWS, dan cloud provider terbesar │
    │  mengalami partition secara berkala.             │
    │                                                  │
    │  Kesimpulan: P bukan pilihan, tapi realita.      │
    │  Pilihan sebenarnya: C atau A saat partition.    │
    └──────────────────────────────────────────────────┘
```

### Bukti Formal CAP Theorem (Intuisi)

Gilbert dan Lynch (2002) membuktikan CAP theorem dengan argumen berikut:

```
                    BUKTI INTUITIF CAP

    Asumsi: Sistem terdistribusi dengan 2 node (A dan B)

    Skenario:
    1. Client menulis data X = 1 ke node A
    2. Terjadi network partition antara A dan B
    3. Client membaca data X dari node B

    Pertanyaan: Apa yang node B kembalikan?

    OPSI 1: Node B mengembalikan X = 1
    → Ini membutuhkan data dari A sudah sampai ke B
    → Tapi ada partition! Data tidak bisa sampai.
    → Node B harus menunggu (tidak available) → Sacrifice A
    → Hasil: CP system

    OPSI 2: Node B mengembalikan nilai lama (misal X = 0)
    → Node B tetap merespons (available)
    → Tapi data tidak konsisten dengan write terbaru
    → Sacrifice C
    → Hasil: AP system

    OPSI 3: Node B mengembalikan error
    → Data konsisten (tidak memberikan data salah)
    → Tapi tidak available (menolak request)
    → Sacrifice A
    → Hasil: CP system

    KESIMPULAN: Tidak mungkin mendapatkan C dan A
    secara bersamaan saat ada partition.
    Q.E.D.
```

---

## 📊 PACELC THEOREM: CAP YANG LEBIH LENGKAP

CAP theorem hanya membahas perilaku saat partition. Tapi bagaimana saat **tidak ada partition**?

**PACELC** (diusulkan oleh Daniel Abadi, 2010) memperluas CAP:

```
                    PACELC THEOREM

    If Partition (P) → Else (E)
    Choose:             Choose:
    A or C              L or C

    P  = Partition terjadi
    A  = Availability
    C  = Consistency
    E  = Else (tidak ada partition)
    L  = Latency

    4 kemungkinan kombinasi:
    ┌──────────┬──────────────────┬─────────────────────┐
    │ Tipe     │ Saat Partition   │ Saat Normal (Else)  │
    ├──────────┼──────────────────┼─────────────────────┤
    │ PA/EL    │ Pilih Available  │ Pilih Latency       │
    │          │ (data mungkin    │ (respons cepat,     │
    │          │ stale)           │ data mungkin stale) │
    ├──────────┼──────────────────┼─────────────────────┤
    │ PA/EC    │ Pilih Available  │ Pilih Consistency   │
    │          │ (data mungkin    │ (data selalu        │
    │          │ stale)           │ terbaru)            │
    ├──────────┼──────────────────┼─────────────────────┤
    │ PC/EL    │ Pilih Consistent │ Pilih Latency       │
    │          │ (tolak request)  │ (respons cepat)     │
    ├──────────┼──────────────────┼─────────────────────┤
    │ PC/EC    │ Pilih Consistent │ Pilih Consistency   │
    │          │ (tolak request)  │ (data selalu        │
    │          │                  │ terbaru)            │
    └──────────┴──────────────────┴─────────────────────┘
```

### PACELC dalam Praktik

```
                    PACELC CLASSIFICATION DB

    Database          │ PACELC │ Keterangan
    ──────────────────┼────────┼──────────────────────────
    MongoDB           │ PA/EL  │ Default: AP, latency opt
    Cassandra         │ PA/EL  │ Tunable consistency
    DynamoDB          │ PA/EL  │ Eventual consistency
    HBase             │ PC/EC  │ Strong consistency
    PostgreSQL        │ PC/EC  │ ACID, strong consistency
    MySQL (primary)   │ PC/EC  │ ACID, strong consistency
    BigTable          │ PC/EC  │ Strong consistency
    CouchDB           │ PA/EL  │ Eventual consistency
    Voldemort         │ PA/EL  │ Eventual consistency
    PNUTS (Yahoo)     │ PA/EC  │ AP saat partition, C saat normal
```

---

## 📐 CONSISTENCY MODELS

Ada beberapa tingkatan konsistensi, dari yang paling ketat hingga paling longgar:

```
                    SPECTRUM CONSISTENSI

    Strongest ────────────────────────────────── Weakest

    Linearizable → Sequential → Causal → Read-Your-Writes → Eventual

    ┌───────────────────────────────────────────────────────────────┐
    │ 1. LINEARIZABLE (Strong Consistency)                         │
    │                                                               │
    │    "Setiap read melihat write terbaru"                        │
    │                                                               │
    │    Waktu global tunggal: semua operasi terlihat seolah-olah   │
    │    terjadi dalam urutan yang sama di semua node.              │
    │                                                               │
    │    Contoh: Database relasional (PostgreSQL, MySQL)            │
    │    dengan single primary.                                     │
    │                                                               │
    │    ┌──────┐    write(x=1)    ┌──────┐                        │
    │    │Client│ ──────────────→ │Node A│                         │
    │    │  1   │                 └──┬───┘                        │
    │    └──────┘                    │ sync (harus selesai)        │
    │                                ▼                             │
    │                           ┌──────┐                           │
    │                           │Node B│                           │
    │                           └──────┘                           │
    │                                                               │
    │    Client 2 baru bisa read setelah sync selesai.              │
    └───────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │ 2. SEQUENTIAL CONSISTENCY                                    │
    │                                                               │
    │    "Semua proses melihat operasi dalam urutan yang sama"      │
    │                                                               │
    │    Mirip linearizable, tapi tidak memerlukan waktu global.    │
    │    Urutan operasi sama di semua node, tapi tidak harus        │
    │    sesuai dengan waktu real-world.                            │
    │                                                               │
    │    Contoh: Memori shared dalam multiprocessor.                │
    └───────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │ 3. CAUSAL CONSISTENCY                                        │
    │                                                               │
    │    "Operasi yang berkaitan secara kausal terlihat berurutan"  │
    │                                                               │
    │    Jika write B bergantung pada write A, maka semua node      │
    │    akan melihat A sebelum B. Tapi write yang tidak berkaitan  │
    │    bisa terlihat dalam urutan berbeda di node berbeda.        │
    │                                                               │
    │    Contoh: Thread reply di forum — reply harus muncul         │
    │    setelah post asli, tapi 2 post berbeda bisa muncul         │
    │    dalam urutan berbeda di user berbeda.                      │
    │                                                               │
    │    ┌──────────────────────────────────────────────┐           │
    │    │  User A post: "Hari ini hujan"               │           │
    │    │       ↓ (causal dependency)                  │           │
    │    │  User B reply: "Iya, bawa payung!"           │           │
    │    │                                              │           │
    │    │  Semua user harus lihat post A sebelum B.    │           │
    │    │  Tapi post C dari User D bisa muncul di mana │           │
    │    │  saja karena tidak berkaitan.                │           │
    │    └──────────────────────────────────────────────┘           │
    └───────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │ 4. READ-YOUR-WRITES CONSISTENCY                              │
    │                                                               │
    │    "Setelah kamu menulis, kamu selalu bisa baca tulisanmu"    │
    │                                                               │
    │    Garansi hanya untuk client yang sama. Client lain mungkin  │
    │    masih melihat data lama.                                   │
    │                                                               │
    │    Contoh: Setelah kamu update profil di Facebook, kamu       │
    │    selalu melihat profil terbaru. Tapi temanmu mungkin        │
    │    masih melihat profil lama selama beberapa menit.           │
    │                                                               │
    │    ┌──────────────────────────────────────────────┐           │
    │    │  User A: write(name = "Budi")                │           │
    │    │  User A: read(name) → "Budi" ✅              │           │
    │    │                                              │           │
    │    │  User B: read(name) → "Andi" ❌ (stale)      │           │
    │    │  User B: read(name) → "Budi" ✅ (setelah sync)│          │
    │    └──────────────────────────────────────────────┘           │
    └───────────────────────────────────────────────────────────────┘

    ┌───────────────────────────────────────────────────────────────┐
    │ 5. EVENTUAL CONSISTENCY                                      │
    │                                                               │
    │    "Jika tidak ada update baru, akhirnya semua read akan      │
    │    mengembalikan nilai yang sama"                             │
    │                                                               │
    │    Tidak ada garansi waktu. Bisa beberapa milidetik, bisa     │
    │    beberapa menit. Yang penting: eventually konsisten.        │
    │                                                               │
    │    Contoh: DNS propagation, WhatsApp message delivery,        │
    │    Instagram like count.                                      │
    │                                                               │
    │    ┌──────────────────────────────────────────────┐           │
    │    │  T0: Write X = 1 di Node A                   │           │
    │    │  T1: Read X dari Node B → 0 (stale)          │           │
    │    │  T2: Read X dari Node B → 0 (stale)          │           │
    │    │  T3: Read X dari Node B → 0 (stale)          │           │
    │    │  ...                                         │           │
    │    │  Tn: Read X dari Node B → 1 ✅ (finally!)    │           │
    │    │                                              │           │
    │    │  Tidak ada garansi kapan Tn terjadi.         │           │
    │    └──────────────────────────────────────────────┘           │
    └───────────────────────────────────────────────────────────────┘
```

### Perbandingan Consistency Models

| Model | Kekuatan | Performa | Use Case |
|---|---|---|---|
| **Linearizable** | Tertinggi | Terendah | Banking, inventory, voting |
| **Sequential** | Tinggi | Rendah | Shared memory, compiler |
| **Causal** | Sedang | Sedang | Forum, collaborative editing |
| **Read-Your-Writes** | Rendah | Tinggi | Social media profile |
| **Eventual** | Terendah | Tertinggi | News feed, analytics, cache |

---

## 📊 AVAILABILITY NUMBERS

### Menghitung Availability

Availability diukur sebagai persentase waktu sistem beroperasi dengan benar:

```
                    AVAILABILITY FORMULA

    Availability = Uptime / (Uptime + Downtime) × 100%

    Atau:
    Availability = MTBF / (MTBF + MTTR) × 100%

    MTBF = Mean Time Between Failure (rata-rata waktu antar failure)
    MTTR = Mean Time To Recovery (rata-rata waktu untuk recover)
```

### Availability SLA dan Downtime

```
                    AVAILABILITY TIERS

    ┌──────────────┬─────────────────────┬─────────────────────────┐
    │ SLA          │ Downtime per Tahun  │ Downtime per Bulan      │
    ├──────────────┼─────────────────────┼─────────────────────────┤
    │ 99%          │ 3.65 hari           │ 7.31 jam                │
    │ 99.5%        │ 1.83 hari           │ 3.65 jam                │
    │ 99.9%        │ 8.76 jam            │ 43.8 menit              │
    │ 99.95%       │ 4.38 jam            │ 21.9 menit              │
    │ 99.99%       │ 52.6 menit          │ 4.38 menit              │
    │ 99.999%      │ 5.26 menit          │ 26.3 detik              │
    │ 99.9999%     │ 31.5 detik          │ 2.63 detik              │
    └──────────────┴─────────────────────┴─────────────────────────┘

    Visualisasi:
    99%     ████████████████████████████████████████████░ (1 hari down)
    99.9%   ████████████████████████████████████████████░ (8.7 jam down)
    99.99%  ████████████████████████████████████████████░ (52 menit down)
    99.999% ████████████████████████████████████████████░ (5 menit down)
```

### Cara Menghitung Availability dari Komponen

```
                    SERIES vs PARALLEL AVAILABILITY

    Komponen dalam SERIES (semua harus hidup):
    Availability_total = A1 × A2 × A3 × ... × An

    Contoh: Web app dengan 3 komponen:
    - Load Balancer: 99.9%
    - App Server:    99.9%
    - Database:      99.9%

    Availability = 0.999 × 0.999 × 0.999 = 0.997 = 99.7%
    Downtime = 0.3% × 365 hari = 1.1 hari/tahun

    Komponen dalam PARALLEL (salah satu cukup):
    Availability_total = 1 - (1-A1) × (1-A2) × ... × (1-An)

    Contoh: 2 database server (active-passive):
    - Database 1: 99.9%
    - Database 2: 99.9%

    Availability = 1 - (0.001 × 0.001) = 1 - 0.000001 = 99.9999%
    Downtime = 0.0001% × 365 hari = 31.5 detik/tahun
```

### Contoh Kalkulasi Availability

```python
def calculate_series_availability(components):
    """
    Hitung availability untuk komponen dalam series.
    Semua komponen harus hidup agar sistem berfungsi.

    Args:
        components: List of availability percentages (0-100)

    Returns:
        Total availability percentage
    """
    total = 1.0
    for availability in components:
        total *= (availability / 100)
    return total * 100

def calculate_parallel_availability(components):
    """
    Hitung availability untuk komponen dalam parallel.
    Minimal 1 komponen harus hidup agar sistem berfungsi.

    Args:
        components: List of availability percentages (0-100)

    Returns:
        Total availability percentage
    """
    failure_prob = 1.0
    for availability in components:
        failure_prob *= (1 - availability / 100)
    return (1 - failure_prob) * 100

def availability_to_downtime(availability_percent):
    """
    Konversi availability percentage ke downtime per tahun/bulan/hari.

    Args:
        availability_percent: Availability dalam persen (misal 99.9)

    Returns:
        Dict dengan downtime per tahun, bulan, hari dalam menit
    """
    downtime_fraction = 1 - (availability_percent / 100)
    minutes_per_year = 365 * 24 * 60  # 525.600 menit

    return {
        "per_tahun_menit": round(downtime_fraction * minutes_per_year, 2),
        "per_tahun_jam": round(downtime_fraction * minutes_per_year / 60, 2),
        "per_bulan_menit": round(downtime_fraction * minutes_per_year / 12, 2),
        "per_hari_detik": round(downtime_fraction * minutes_per_year / 365 * 60, 2),
    }

# Contoh: SD Negeri Pasirhalang - Sistem Informasi Sekolah
# Arsitektur: Load Balancer → 2 App Server (parallel) → Database (primary + replica)

lb_avail = 99.9
app_avail = 99.5  # per server
db_avail = 99.9   # primary

# App servers dalam parallel (active-active)
app_total = calculate_parallel_availability([app_avail, app_avail])
print(f"App Server availability: {app_total:.4f}%")
# Output: 99.9975%

# Database: primary + read replica (parallel untuk read)
db_total = calculate_parallel_availability([db_avail, db_avail])
print(f"Database availability: {db_total:.4f}%")
# Output: 99.9999%

# Total system (series: LB → App → DB)
total = calculate_series_availability([lb_avail, app_total, db_total])
print(f"Total system availability: {total:.4f}%")
# Output: ~99.8975%

downtime = availability_to_downtime(total)
print(f"\nDowntime:")
print(f"  Per tahun: {downtime['per_tahun_jam']} jam")
print(f"  Per bulan: {downtime['per_bulan_menit']} menit")
print(f"  Per hari:  {downtime['per_hari_detik']} detik")
```

---

## ⚖️ TRADE-OFF ANALYSIS

### Framework Memilih antara C dan A

```
                    DECISION TREE: C vs A

    Mulai: "Apakah data yang salah lebih buruk daripada sistem down?"
    │
    ├── YA → Pilih CP (Consistency)
    │   │
    │   ├── "Apakah user bisa menerima error/timeout?"
    │   │   ├── YA → CP dengan error response
    │   │   └── TIDAK → CP dengan retry mechanism
    │   │
    │   Contoh: Banking, inventory, voting, reservasi
    │
    └── TIDAK → Pilih AP (Availability)
        │
        ├── "Berapa lama data bisa tidak konsisten?"
        │   ├── Detik → AP dengan fast sync
        │   ├── Menit → AP dengan eventual consistency
        │   └── Jam → AP dengan batch sync
        │
        Contoh: Social media, news feed, analytics, cache
```

### Matrix Trade-off

```
                    TRADE-OFF MATRIX

    Dampak data salah
    Tinggi │  CP          │  CP
           │  Banking     │  Inventory
           │  Voting      │  Reservasi
           │              │
    ───────┼──────────────┼──────────────
           │  AP          │  AP
           │  Collaborative│  Social Media
           │  Editing     │  News Feed
           │              │
    Rendah └──────────────┴──────────────
          Rendah         Tinggi
          Dampak sistem down
```

### Analisis Trade-off untuk Konteks Sekolah

```
                    ANALISIS TRADE-OFF SEKOLAH

    ┌─────────────────────┬────────┬────────────────────────────────┐
    │ Fitur               │ C / A  │ Alasan                         │
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Data nilai siswa    │ CP     │ Nilai tidak boleh salah/hilang │
    │                     │        │ Lebih baik error daripada data │
    │                     │        │ salah di rapor                 │
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Pengumuman sekolah  │ AP     │ Pengumuman bisa delay beberapa │
    │                     │        │ menit, yang penting sampai     │
    │                     │        │ ke semua orang                 │
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Data kehadiran guru │ AP     │ Kehadiran bisa input offline,  │
    │                     │        │ sync nanti. Lebih penting bisa │
    │                     │        │ input daripada real-time       │
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Galeri foto         │ AP     │ Foto bisa upload async, tidak  │
    │                     │        │ perlu real-time consistency    │
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Data keuangan BOS   │ CP     │ Keuangan harus akurat. Tidak   │
    │                     │        │ boleh ada selisih哪怕是1 rupiah│
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Jadwal pelajaran    │ CP     │ Jadwal tidak boleh conflict.   │
    │                     │        │ 2 kelas tidak bisa di ruang    │
    │                     │        │ yang sama pada waktu sama      │
    ├─────────────────────┼────────┼────────────────────────────────┤
    │ Chat internal       │ AP     │ Pesan bisa delay, yang penting │
    │                     │        │ terkirim. Eventual consistency │
    │                     │        │ sudah cukup                    │
    └─────────────────────┴────────┴────────────────────────────────┘
```

---

## 🏗️ REAL-WORLD EXAMPLES

### Contoh 1: Sistem Perbankan (CP) — Deep Dive

```
                    BANKING SYSTEM: CP DESIGN

    Skenario: Transfer Rp 500.000 dari Rekening A ke Rekening B

    ┌────────────────────────────────────────────────────────────┐
    │  Step 1: BEGIN TRANSACTION                                 │
    │  Step 2: LOCK Rekening A (prevent concurrent access)       │
    │  Step 3: READ saldo A = Rp 1.000.000                       │
    │  Step 4: CHECK saldo A >= 500.000 ✅                       │
    │  Step 5: WRITE saldo A = Rp 500.000                        │
    │  Step 6: WRITE saldo B = Rp 2.500.000 (asumsi awal 2jt)   │
    │  Step 7: LOG transaksi ke audit trail                      │
    │  Step 8: COMMIT (release lock)                             │
    │                                                            │
    │  Jika step manapun gagal → ROLLBACK (semua dibatalkan)    │
    │                                                            │
    │  Properti ACID:                                            │
    │  - Atomicity: Semua step berhasil atau semua gagal         │
    │  - Consistency: Saldo selalu valid (tidak negatif)         │
    │  - Isolation: Transaksi lain tidak lihat data intermediate │
    │  - Durability: Setelah commit, data tersimpan permanen     │
    └────────────────────────────────────────────────────────────┘

    Saat partition terjadi:
    ┌────────────────────────────────────────────────────────────┐
    │  Server A (Jakarta)     Server B (Bandung)                 │
    │  ┌─────────────┐        ┌─────────────┐                    │
    │  │ Rekening A  │   ╳    │ Rekening B  │                    │
    │  │ Rp 1.000.000│        │ Rp 2.000.000│                    │
    │  └─────────────┘        └─────────────┘                    │
    │                                                            │
    │  User di Jakarta mau transfer ke Bandung:                  │
    │  → Server A tidak bisa konfirmasi ke Server B              │
    │  → Server A MENOLAK transaksi (return error)               │
    │  → User dapat pesan: "Sibuk, coba lagi nanti"              │
    │                                                            │
    │  Ini CP: Consistency dijaga, Availability dikorbankan.    │
    └────────────────────────────────────────────────────────────┘
```

### Contoh 2: WhatsApp (AP) — Deep Dive

```
                    WHATSAPP: AP DESIGN

    Skenario: Kirim pesan "Halo!" ke teman

    ┌────────────────────────────────────────────────────────────┐
    │  Step 1: User ketik "Halo!" dan klik kirim                 │
    │  Step 2: Pesan disimpan di device lokal (pending)          │
    │  Step 3: Pesan dikirim ke WhatsApp server                  │
    │  Step 4: Server terima dan simpan (acknowledged)           │
    │  Step 5: Server forward ke device penerima                 │
    │  Step 6: Penerima buka dan baca (read receipt)             │
    │                                                            │
    │  Status pesan:                                             │
    │  ⏳ = Sending (di device lokal)                             │
    │  ✓  = Sent (sampai ke server)                              │
    │  ✓✓ = Delivered (sampai ke device penerima)                │
    │  ✓✓ biru = Read (penerima sudah baca)                      │
    └────────────────────────────────────────────────────────────┘

    Saat partition terjadi:
    ┌────────────────────────────────────────────────────────────┐
    │  User A (no signal)          WhatsApp Server               │
    │  ┌─────────────┐              ┌─────────────┐              │
    │  │ Pesan:      │       ╳      │ Queue:      │              │
    │  │ "Halo!"     │              │ [pending]   │              │
    │  │ Status: ⏳   │              │             │              │
    │  └─────────────┘              └─────────────┘              │
    │                                                            │
    │  User A tetap bisa:                                        │
    │  - Ketik pesan baru                                        │
    │  - Baca pesan lama (dari cache lokal)                      │
    │  - Lihat kontak dan info profil                            │
    │                                                            │
    │  Pesan akan otomatis terkirim saat koneksi pulih.          │
    │                                                            │
    │  Ini AP: Availability dijaga, Consistency dikorbankan.    │
    │  (Eventual consistency — pesan akhirnya sampai)           │
    └────────────────────────────────────────────────────────────┘
```

### Contoh 3: DNS System (AP) — Deep Dive

```
                    DNS: AP DENGAN EVENTUAL CONSISTENCY

    Skenario: Update DNS record sdnpasirhalang.sch.id

    ┌────────────────────────────────────────────────────────────┐
    │  T0: Admin update IP: 192.168.1.1 → 192.168.1.100         │
    │  T1: DNS primary server update record                      │
    │  T2: DNS secondary server belum update (TTL belum expire)  │
    │  T3: User 1 query DNS → dapat 192.168.1.1 (stale)         │
    │  T4: User 2 query DNS → dapat 192.168.1.100 (fresh)       │
    │  ...                                                       │
    │  Tn: Semua DNS server sudah update (setelah TTL expire)    │
    │                                                            │
    │  TTL (Time To Live) menentukan berapa lama eventual        │
    │  consistency berlangsung.                                  │
    │  - TTL 1 jam = inconsistency max 1 jam                    │
    │  - TTL 24 jam = inconsistency max 24 jam                  │
    └────────────────────────────────────────────────────────────┘
```

### Contoh 4: Google Docs (CP dengan Conflict Resolution)

```
                    GOOGLE DOCS: CP DENGAN OT (OPERATIONAL TRANSFORM)

    Skenario: 2 user edit dokumen yang sama bersamaan

    ┌────────────────────────────────────────────────────────────┐
    │  Dokumen awal: "Hello World"                               │
    │                                                            │
    │  User A: insert "Beautiful " setelah "Hello"              │
    │  User B: insert "Amazing " setelah "Hello"                │
    │                                                            │
    │  Tanpa conflict resolution:                                │
    │  User A lihat: "Hello Beautiful World"                     │
    │  User B lihat: "Hello Amazing World"                       │
    │  → INCONSISTENT!                                           │
    │                                                            │
    │  Dengan Operational Transform:                             │
    │  Server transform operasi B berdasarkan operasi A:         │
    │  - Insert B digeser +10 karakter (panjang "Beautiful ")   │
    │  Hasil akhir di semua client:                              │
    │  "Hello Beautiful Amazing World"                           │
    │  → CONSISTENT!                                             │
    │                                                            │
    │  Google Docs memilih CP:                                   │
    │  - Semua user melihat dokumen yang sama                    │
    │  - Jika koneksi putus, edit disimpan lokal dan sync nanti  │
    │  - Conflict resolution otomatis oleh server                │
    └────────────────────────────────────────────────────────────┘
```

---

## 💡 PRAKTIK

### Latihan 1: Tentukan CP atau AP

Tentukan apakah sistem berikut lebih cocok **CP** atau **AP** dan jelaskan alasannya:

1. Sistem voting pemilu
2. Instagram likes
3. Sistem reservasi hotel
4. Twitter timeline
5. Sistem e-voting RUPS perusahaan
6. Komentar di blog
7. Sistem parkir mall (hitung slot tersedia)
8. Leaderboard game online
9. Sistem antrian rumah sakit
10. Kalender shared tim

**Jawaban dengan penjelasan:**
1. **CP** — Vote harus akurat, tidak boleh hilang/double. Konsistensi > availability.
2. **AP** — Like bisa delay, yang penting bisa di-like. Eventual consistency cukup.
3. **CP** — Tidak boleh double booking kamar. Consistency critical.
4. **AP** — Timeline bisa tidak real-time. User lebih peduli bisa akses daripada data terbaru.
5. **CP** — Voting perusahaan harus akurat dan auditable.
6. **AP** — Komentar bisa delay sinkronisasi. Tidak ada dampak kritis.
7. **CP** — Slot parkir harus akurat. Double booking = masalah.
8. **AP** — Leaderboard bisa delay update. Yang penting bisa diakses.
9. **CP** — Antrian harus akurat. Tidak boleh ada pasien yang dilewatkan.
10. **CP** — Kalender shared harus konsisten. Meeting double = masalah besar.

### Latihan 2: Hitung Availability

Hitung availability dan downtime untuk skenario berikut:

1. Sistem dengan 4 komponen series, masing-masing 99.9%
2. Sistem dengan 3 komponen parallel, masing-masing 99%
3. Sistem hybrid: LB (99.9%) → 2 App Server parallel (99.5% each) → DB primary+replica (99.9% each)

**Jawaban:**
```
1. Series: 0.999^4 = 0.996 = 99.6%
   Downtime: 0.4% × 365 × 24 = 35 jam/tahun

2. Parallel: 1 - (0.01^3) = 1 - 0.000001 = 99.9999%
   Downtime: 0.0001% × 365 × 24 × 60 = 31.5 detik/tahun

3. Hybrid:
   App parallel: 1 - (0.005^2) = 99.9975%
   DB parallel: 1 - (0.001^2) = 99.9999%
   Total series: 0.999 × 0.999975 × 0.999999 = 99.8974%
   Downtime: 0.1026% × 365 × 24 = 8.99 jam/tahun
```

### Latihan 3: Desain untuk SD Negeri Pasirhalang

Anda mendesain sistem informasi sekolah. Tentukan CP atau AP dan consistency model untuk setiap fitur:

1. Data nilai siswa
2. Pengumuman sekolah
3. Data kehadiran guru
4. Galeri foto kegiatan
5. Data keuangan BOS
6. Chat internal antar guru
7. Jadwal pelajaran
8. Perpustakaan (pinjam/kembali buku)

**Template jawaban:**
```
| Fitur | CP/AP | Consistency Model | Alasan |
|-------|-------|-------------------|--------|
| Data nilai | CP | Linearizable | Nilai harus akurat, tidak boleh ada versi berbeda |
| Pengumuman | AP | Eventual | Bisa delay beberapa menit, tidak kritis |
| ... | ... | ... | ... |
```

### Latihan 4: Analisis Failure Scenario

Sistem Anda memiliki arsitektur:
- 3 web server (active-active)
- 1 database primary
- 2 database replica (async replication, lag ~5 detik)

Pertanyaan:
a. Jika database primary down, apa yang terjadi?
b. Jika 1 web server down, apa yang terjadi?
c. Jika network partition antara primary dan semua replica, apa yang terjadi?
d. Berapa availability sistem jika setiap komponen 99.9%?

**Jawaban:**
```
a. DB primary down:
   - Replica tidak bisa promote otomatis (async, ada data loss risk)
   - Aplikasi read-only bisa pakai replica
   - Write harus ditunggu sampai primary recovery
   → Partial availability (read OK, write down)

b. 1 web server down:
   - Load balancer redirect ke 2 server lainnya
   - User tidak merasakan gangguan
   → Full availability maintained

c. Network partition primary ↔ replicas:
   - Primary tetap terima write (CP mode)
   - Replica stale (data lama)
   - Saat partition selesai, replica catch up
   → Eventual consistency setelah partition resolved

d. Availability:
   Web parallel: 1 - (0.001^3) = 99.9999999%
   DB primary: 99.9%
   Total series: 0.999999999 × 0.999 = 99.8999%
   → Downtime ~8.76 jam/tahun (determined by DB)
```

### Latihan 5: Trade-off Decision

Anda harus memilih database untuk sistem baru. Pilihan:
- **PostgreSQL**: CP, strong consistency, 99.9% availability (single node)
- **Cassandra**: AP, eventual consistency, 99.99% availability (cluster)

Skenario:
a. Sistem inventory toko online
b. Sistem logging dan analytics
c. Sistem user profile dan preferences
d. Sistem payment gateway

**Jawaban:**
```
a. Inventory → PostgreSQL (CP)
   Alasan: Stok harus akurat. Overselling = customer complaint.

b. Logging/Analytics → Cassandra (AP)
   Alasan: Log bisa eventual consistency. Availability lebih penting.
   Kehilangan beberapa log tidak kritis.

c. User Profile → PostgreSQL (CP) atau Cassandra (AP) tergantung kasus
   Jika profile sering diupdate dan harus konsisten → PostgreSQL
   Jika profile jarang update dan eventual OK → Cassandra

d. Payment → PostgreSQL (CP)
   Alasan: Payment harus akurat. Tidak boleh ada uang hilang/double.
   Strong consistency mandatory.
```

---

## 🧪 LATIHAN LANJUTAN

### Studi Kasus: Migrasi dari Monolith ke Microservices

SD Negeri Pasirhalang punya sistem monolith yang berjalan baik. Sekarang ingin migrasi ke microservices.

**Arsitektur lama (monolith):**
```
┌─────────────────────────────────────┐
│         Monolith Application         │
│  ┌─────┐ ┌──────┐ ┌───────┐        │
│  │Absen│ │Nilai │ │Keuangan│        │
│  └──┬──┘ └──┬───┘ └───┬───┘        │
│     └───────┼─────────┘             │
│             ▼                        │
│  ┌─────────────────────┐            │
│  │   Single Database   │            │
│  │   (PostgreSQL)      │            │
│  └─────────────────────┘            │
└─────────────────────────────────────┘

Availability: 99.9% (sederhana, single point of failure)
Consistency: Strong (ACID transactions)
```

**Arsitektur baru (microservices):**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Absensi  │  │  Nilai   │  │ Keuangan │
│ Service  │  │ Service  │  │ Service  │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│  MongoDB│  │PostgreSQL│  │PostgreSQL│
│  (AP)   │  │  (CP)   │  │  (CP)   │
└─────────┘  └─────────┘  └─────────┘

Absensi: AP (eventual consistency, high availability)
Nilai:   CP (strong consistency, data accuracy)
Keuangan: CP (strong consistency, audit trail)
```

**Pertanyaan:**
1. Mengapa absensi dipilih AP sementara nilai dan keuangan CP?
2. Apa tantangan baru yang muncul dengan arsitektur microservices?
3. Bagaimana menangani transaksi yang melibatkan multiple services?
4. Apakah availability total meningkat atau menurun?

**Jawaban:**
```
1. Absensi AP karena:
   - Data absensi bisa input offline, sync nanti
   - Tidak ada dampak kritis jika data delay beberapa menit
   - Lebih penting guru bisa absen daripada data real-time

   Nilai & Keuangan CP karena:
   - Nilai harus akurat di rapor
   - Keuangan harus balance, tidak boleh ada selisih
   - Audit trail harus lengkap dan konsisten

2. Tantangan baru:
   - Network latency antar services
   - Distributed transactions (tidak ada ACID cross-service)
   - Data consistency antar services
   - Monitoring dan debugging lebih kompleks
   - Deployment lebih kompleks

3. Transaksi multi-service:
   - Saga pattern: kompensasi jika step gagal
   - Event sourcing: store events, rebuild state
   - Two-phase commit (2PC): kuat tapi lambat
   - Outbox pattern: reliable event publishing

4. Availability:
   Monolith: 99.9% (single point of failure)
   Microservices: Bergantung pada setiap service
   - Jika semua service 99.9% dan series: 99.7%
   - Tapi bisa lebih tinggi jika ada redundancy
   - Kunci: isolasi failure (1 service down ≠ semua down)
```

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan CAP theorem dengan bahasa sendiri dan bukti intuitif
- [ ] Paham arti Consistency, Availability, dan Partition Tolerance secara mendalam
- [ ] Mengerti kenapa P harus selalu dipilih dalam sistem terdistribusi modern
- [ ] Bisa menjelaskan perbedaan CP dan AP dengan contoh konkret
- [ ] Paham PACELC theorem dan perbedaannya dengan CAP
- [ ] Bisa menjelaskan 5 consistency models: linearizable, sequential, causal, RYW, eventual
- [ ] Mengerti availability numbers (99.9% = 8.76 jam, 99.99% = 52.6 menit)
- [ ] Bisa menghitung availability dari komponen series dan parallel
- [ ] Bisa menentukan CP atau AP untuk kasus tertentu dengan alasan yang solid
- [ ] Paham trade-off analysis framework untuk memilih C vs A
- [ ] Bisa menganalisis failure scenario dan dampaknya pada sistem
- [ ] Paham real-world examples: banking (CP), WhatsApp (AP), DNS (AP), Google Docs (CP+OT)

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — CAP Theorem](https://github.com/donnemartin/system-design-primer#cap-theorem)
- **Paper:** [Brewer's CAP Theorem — Eric Brewer (2000)](https://www.cs.berkeley.edu/~brewer/cs262b-2004/PODC-keynote.pdf)
- **Paper:** [Brewer's Conjecture and the Feasibility of Consistent, Available Partition-Tolerant Web Services — Gilbert & Lynch (2002)](https://lamport.azurewebsites.net/pubs/lamport-2002.pdf)
- **Artikel:** [PACELC Theorem — Daniel Abadi (2010)](https://db.cs.yale.edu/papers/abadi-pacelc.pdf)
- **Artikel:** [CAP Theorem Revisited — Robert Greiner](https://robertgreiner.com/cap-theorem-revisited/)
- **Artikel:** [A Plain English Introduction to CAP Theorem](http://ksat.me/a-plain-english-introduction-to-cap-theorem)
- **Artikel:** [Consistency Models — Jepsen](https://jepsen.io/consistency)
- **Artikel:** [Availability Numbers and SLAs](https://en.wikipedia.org/wiki/High_availability#Percentage_calculation)
- **Video:** [The CAP Theorem — YouTube](https://www.youtube.com/watch?v=k-Yaq8AHlFA)
- **Video:** [System Design: CAP Theorem — Gaurav Sen](https://www.youtube.com/watch?v=k-Yaq8AHlFA)

---

> **Lanjut ke:** [`05-konsistensi-data.md`](./05-konsistensi-data.md)
