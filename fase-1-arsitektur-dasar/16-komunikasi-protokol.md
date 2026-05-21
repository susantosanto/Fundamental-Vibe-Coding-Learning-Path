# 16 — Komunikasi & Protokol

> **Estimasi:** 3 jam | **Level:** Menengah
> **Referensi:** [donnemartin/system-design-primer — Communication](https://github.com/donnemartin/system-design-primer#communication)

---

## 📖 TEORI

### Gambaran Umum Protokol Komunikasi

Protokol komunikasi adalah **aturan dan standar** yang mengatur bagaimana komputer, server, dan layanan saling bertukar data. Tanpa protokol yang sama, dua sistem tidak bisa berkomunikasi — seperti dua orang yang berbicara dalam bahasa berbeda.

```
┌──────────────────────────────────────────────────────────────┐
│                    OSI MODEL (7 LAYER)                       │
├──────────────────────────────────────────────────────────────┤
│  Layer 7: Application   → HTTP, GraphQL, gRPC, WebSocket     │
│  Layer 6: Presentation  → SSL/TLS, JSON, XML, Protocol Buff  │
│  Layer 5: Session       → Session management, auth tokens    │
│  Layer 4: Transport     → TCP, UDP                           │
│  Layer 3: Network       → IP, ICMP                           │
│  Layer 2: Data Link     → Ethernet, WiFi                     │
│  Layer 1: Physical      → Kabel, Sinyal Radio                │
└──────────────────────────────────────────────────────────────┘
```

Dalam system design, kita paling sering berurusan dengan **Layer 4 (Transport)** dan **Layer 7 (Application)**.

---

## 1. TCP vs UDP — Fondasi Transport Layer

### TCP (Transmission Control Protocol)

TCP adalah protokol **connection-oriented** yang menjamin pengiriman data secara reliable.

#### Three-Way Handshake

Sebelum data dikirim, TCP melakukan "jabat tangan" 3 langkah:

```
Client                          Server
  │                                │
  │────── SYN (seq=100) ──────────▶│  "Saya mau koneksi"
  │                                │
  │◀───── SYN-ACK (seq=300,        │  "Oke, saya siap. seq saya 300"
  │       ack=101) ────────────────│
  │                                │
  │────── ACK (ack=301) ──────────▶│  "Siap, mulai kirim!"
  │                                │
  │        == DATA TRANSFER ==     │
  │                                │
  │────── FIN ────────────────────▶│  "Saya selesai"
  │◀───── FIN-ACK ────────────────│  "Oke, koneksi ditutup"
```

#### Karakteristik TCP

| Fitur | Penjelasan |
|---|---|
| **Connection-oriented** | Harus handshake dulu sebelum transfer data |
| **Reliable delivery** | Data dijamin sampai, ada retry otomatis |
| **Ordered delivery** | Data diterima sesuai urutan pengiriman |
| **Flow control** | Mengatur kecepatan agar receiver tidak overflow |
| **Congestion control** | Mengurangi kecepatan jika jaringan padat |
| **Error checking** | Checksum untuk deteksi korupsi data |
| **Overhead tinggi** | Header 20 bytes + handshake + acknowledgments |

#### TCP Header (Simplified)

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
┌─────────────────────────────────────────────────────────────────┐
│     Source Port         │     Destination Port                  │
├─────────────────────────────────────────────────────────────────┤
│                    Sequence Number                              │
├─────────────────────────────────────────────────────────────────┤
│                  Acknowledgment Number                          │
├───────┬───────┬───────┬───────┬─────────────────────────────────┤
│Offset │Reserved│ Flags │       Window Size                      │
├───────┴───────┴───────┴───────┴─────────────────────────────────┤
│       Checksum          │    Urgent Pointer                     │
└─────────────────────────────────────────────────────────────────┘
```

**Cocok untuk:**
- Web browsing (HTTP/HTTPS)
- Email (SMTP, IMAP, POP3)
- File transfer (FTP, SFTP)
- Database connections
- API calls (REST, GraphQL, gRPC)
- Semua yang butuh data lengkap dan benar

### UDP (User Datagram Protocol)

UDP adalah protokol **connectionless** yang mengutamakan kecepatan daripada keandalan.

```
UDP: "Kirim! 🚀" (langsung, tanpa nunggu konfirmasi)

Client                          Server
  │                                │
  │────── DATAGRAM ──────────────▶│  "Ini data, terima atau tidak, terserah"
  │────── DATAGRAM ──────────────▶│  "Data berikutnya"
  │────── DATAGRAM ──────────────▶│  "Lagi..."
  │                                │  (tidak ada ACK, tidak ada retry)
```

#### Karakteristik UDP

| Fitur | Penjelasan |
|---|---|
| **Connectionless** | Tidak ada handshake, kirim langsung |
| **Unreliable** | Data bisa hilang, tidak ada retry |
| **Unordered** | Data bisa sampai tidak berurutan |
| **No flow control** | Kirim secepat mungkin |
| **No congestion control** | Tidak peduli jaringan padat atau tidak |
| **Overhead rendah** | Header hanya 8 bytes |
| **Sangat cepat** | Latensi minimal |

#### UDP Header

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
┌─────────────────────────────────────────────────────────────────┐
│     Source Port         │     Destination Port                  │
├─────────────────────────────────────────────────────────────────┤
│         Length          │          Checksum                     │
└─────────────────────────────────────────────────────────────────┘
```

**Cocok untuk:**
- Live streaming video/audio (kehilangan beberapa frame tidak masalah)
- VoIP / Video call (lebih penting latency rendah daripada sempurna)
- Online gaming real-time (posisi player harus update cepat)
- DNS queries (satu request kecil, cepat)
- Broadcast/multicast (kirim ke banyak penerima sekaligus)
- IoT sensor data (data baru terus datang, yang lama tidak penting)

### Perbandingan TCP vs UDP

```
┌─────────────────────────────────────────────────────────────────┐
│                    TCP vs UDP COMPARISON                        │
├──────────────────────┬──────────────────────┬───────────────────┤
│ Aspek                │ TCP                  │ UDP               │
├──────────────────────┼──────────────────────┼───────────────────┤
│ Koneksi              │ Connection-oriented  │ Connectionless    │
│ Reliability          │ Guaranteed delivery  │ Best effort       │
│ Urutan data          │ Terjamin             │ Tidak terjamin    │
│ Kecepatan            │ Lebih lambat         │ Sangat cepat      │
│ Overhead             │ Tinggi (20B+ header) │ Rendah (8B header)│
│ Flow control         │ Ya                   │ Tidak             │
│ Congestion control   │ Ya                   │ Tidak             │
│ Retransmission       │ Otomatis             │ Tidak ada         │
│ Use case             │ Web, email, file     │ Streaming, gaming │
└──────────────────────┴──────────────────────┴───────────────────┘
```

---

## 2. HTTP/1.1 vs HTTP/2 vs HTTP/3

### HTTP/1.1 (1997)

Versi HTTP yang paling lama digunakan dan masih menjadi fallback universal.

#### Karakteristik HTTP/1.1

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP/1.1 REQUEST                             │
├─────────────────────────────────────────────────────────────────┤
│ GET /api/siswa/123 HTTP/1.1                                     │
│ Host: sekolah.example.com                                       │
│ User-Agent: Mozilla/5.0                                         │
│ Accept: application/json                                        │
│ Authorization: Bearer eyJhbGci...                               │
│ Connection: keep-alive                                          │
│                                                                 │
│ (empty line = end of headers)                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Masalah HTTP/1.1:**
- **Head-of-line blocking**: Request diproses satu per satu per koneksi
- **Multiple connections**: Browser buka 6+ koneksi paralel untuk workaround
- **Text-based**: Header tidak dikompresi, boros bandwidth
- **No server push**: Server tidak bisa kirim resource sebelum diminta

```
HTTP/1.1 Connection:
  [Req1] ──── wait ──── [Resp1]
  [Req2] ──── wait ──── [Resp2]    ← Sequential, blocking!
  [Req3] ──── wait ──── [Resp3]
```

### HTTP/2 (2015)

Revolusi HTTP dengan multiplexing dan binary framing.

#### Fitur Utama HTTP/2

**1. Multiplexing** — Banyak request/response dalam satu koneksi secara paralel:

```
HTTP/2 Connection (Single TCP Connection):
  Stream 1: [Req1] ────────── [Resp1]
  Stream 3:       [Req3] ────────── [Resp3]
  Stream 5:             [Req5] ────────── [Resp5]
  Stream 7:                   [Req7] ────────── [Resp7]
  ───────────────────────────────────────────────▶ Time
  (Semua berjalan paralel dalam 1 koneksi!)
```

**2. Binary Framing** — Data dikirim dalam frame biner, bukan teks:

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP/2 FRAME STRUCTURE                       │
├─────────────────────────────────────────────────────────────────┤
│  Length (24 bits) │ Type (8 bits) │ Flags (8 bits) │ Stream ID │
├─────────────────────────────────────────────────────────────────┤
│                    Frame Payload (variable)                     │
└─────────────────────────────────────────────────────────────────┘

Frame Types:
  DATA      → Body content
  HEADERS   → HTTP headers
  RST_STREAM→ Cancel stream
  SETTINGS  → Connection config
  PING      → Keep-alive check
  GOAWAY    → Graceful shutdown
```

**3. Header Compression (HPACK)** — Header dikompresi, hemat bandwidth:

```
HTTP/1.1: "content-type: application/json" = 30 bytes (setiap request!)
HTTP/2:  Header dikompresi dengan HPACK → ~5 bytes setelah request pertama
```

**4. Server Push** — Server bisa kirim resource proaktif:

```
Client: GET /index.html
Server: Kirim index.html + push style.css + push app.js + push logo.png
        (Client belum minta, tapi server tahu akan dibutuhkan)
```

**5. Stream Prioritization** — Client bisa atur prioritas resource:

```
Priority:
  1. Critical CSS (render blocking) → Priority 1 (highest)
  2. HTML content                   → Priority 2
  3. Images below fold              → Priority 5
  4. Analytics beacon               → Priority 7 (lowest)
```

### HTTP/3 (2022)

HTTP/3 mengganti TCP dengan **QUIC** (Quick UDP Internet Connections) di atas UDP.

#### Mengapa HTTP/3 Dibutuhkan?

```
┌─────────────────────────────────────────────────────────────────┐
│              PROBLEM: TCP HEAD-OF-LINE BLOCKING                 │
│              (Masih ada di HTTP/2!)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HTTP/2 over TCP:                                               │
│  Stream 1: [Packet A] [Packet B] [Packet C]                    │
│  Stream 3: [Packet D] [Packet E] [Packet F]                    │
│                                                                 │
│  Jika Packet B hilang → TCP tunggu retransmit → SEMUA stream   │
│  terhenti! Termasuk Stream 3 yang tidak ada masalah.            │
│                                                                 │
│  HTTP/3 over QUIC (UDP):                                        │
│  Stream 1: [Packet A] [Packet B❌] [Packet C]                  │
│  Stream 3: [Packet D] [Packet E] [Packet F] ← TIDAK TERGANGGU! │
│                                                                 │
│  Setiap stream independen. Kehilangan di satu stream tidak      │
│  mempengaruhi stream lain.                                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Fitur HTTP/3/QUIC

- **0-RTT Connection** — Koneksi ulang instan (resumption)
- **No head-of-line blocking** — Setiap stream independen
- **Built-in TLS 1.3** — Enkripsi selalu aktif
- **Connection migration** — Pindah jaringan (WiFi → 4G) tanpa putus
- **Better congestion control** — Lebih adaptif

### Perbandingan HTTP Versions

```
┌─────────────────────────────────────────────────────────────────┐
│                  HTTP VERSION COMPARISON                        │
├──────────────────────┬──────────┬──────────┬────────────────────┤
│ Fitur                │ HTTP/1.1 │ HTTP/2   │ HTTP/3             │
├──────────────────────┼──────────┼──────────┼────────────────────┤
│ Transport            │ TCP      │ TCP      │ QUIC (UDP)         │
│ Multiplexing         │ Tidak    │ Ya       │ Ya                 │
│ Head-of-line block   │ Ya       │ Ya (TCP) │ Tidak              │
│ Header compression   │ Tidak    │ HPACK    │ QPACK              │
│ Server push          │ Tidak    │ Ya       │ Deprecated         │
│ Connection setup     │ 1 RTT    │ 1-2 RTT  │ 0-1 RTT            │
│ Encryption           │ Opsional │ Opsional │ Wajib (TLS 1.3)    │
│ Connection migration │ Tidak    │ Tidak    │ Ya                 │
│ Browser support      │ 100%     │ 97%      │ 80%+               │
│ Use when             │ Fallback │ Default  │ High latency/net   │
└──────────────────────┴──────────┴──────────┴────────────────────┘
```

---

## 3. REST API — Design Principles Mendalam

### Apa Itu REST?

REST (Representational State Transfer) adalah **arsitektural style** untuk mendesain API, bukan protokol. REST memanfaatkan HTTP secara maksimal.

### 6 Constraints REST

```
┌─────────────────────────────────────────────────────────────────┐
│                    6 CONSTRAINTS REST                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Client-Server                                               │
│     → Pemisahan concern: UI terpisah dari data storage          │
│                                                                 │
│  2. Stateless                                                   │
│     → Setiap request harus berisi semua info yang dibutuhkan    │
│     → Server tidak simpan state antar request                   │
│                                                                 │
│  3. Cacheable                                                   │
│     → Response harus bisa di-cache untuk performa               │
│     → Gunakan Cache-Control header                              │
│                                                                 │
│  4. Uniform Interface                                           │
│     → Resource identification (URI)                             │
│     → Resource manipulation melalui representation              │
│     → Self-descriptive messages                                 │
│     → HATEOAS (Hypermedia as the Engine of Application State)   │
│                                                                 │
│  5. Layered System                                              │
│     → Client tidak tahu apakah terhubung langsung ke server     │
│     → Bisa ada load balancer, proxy, gateway di antaranya       │
│                                                                 │
│  6. Code on Demand (opsional)                                   │
│     → Server bisa kirim executable code ke client               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### REST API Design Best Practices

#### 1. Resource Naming

```
✅ BENAR (noun, plural, lowercase):
  GET    /api/siswa              → Koleksi siswa
  GET    /api/siswa/123          → Satu siswa
  GET    /api/siswa/123/nilai    → Nilai siswa tertentu
  GET    /api/siswa/123/absensi  → Absensi siswa tertentu
  GET    /api/guru/456/mengajar  → Kelas yang diajar guru

❌ SALAH (verb, singular, mixed case):
  GET    /api/getSiswa           → Jangan pakai verb di URL
  GET    /api/Siswa/123          → Inconsistent casing
  GET    /api/siswaData          → Tidak RESTful
```

#### 2. HTTP Methods dan Status Codes

```
┌─────────────────────────────────────────────────────────────────┐
│              HTTP METHODS & STATUS CODES                        │
├──────────────┬──────────────────────────────────────────────────┤
│ Method       │ Use Case                                         │
├──────────────┼──────────────────────────────────────────────────┤
│ GET          │ Read resource (safe, idempotent, cacheable)      │
│ POST         │ Create resource (not idempotent)                 │
│ PUT          │ Update/replace resource (idempotent)             │
│ PATCH        │ Partial update resource (not always idempotent)  │
│ DELETE       │ Delete resource (idempotent)                     │
│ OPTIONS      │ CORS preflight, discover capabilities            │
│ HEAD         │ Same as GET but no body (check existence)        │
├──────────────┴──────────────────────────────────────────────────┤
│ Status Codes:                                                   │
│ 200 OK              → Success (GET, PUT, PATCH)                 │
│ 201 Created         → Resource berhasil dibuat (POST)           │
│ 204 No Content      → Success, no body (DELETE)                 │
│ 400 Bad Request     → Input tidak valid                         │
│ 401 Unauthorized    → Belum login / token invalid               │
│ 403 Forbidden       → Login tapi tidak punya akses              │
│ 404 Not Found       → Resource tidak ada                        │
│ 409 Conflict        → Resource conflict (duplikat)              │
│ 429 Too Many Requests → Rate limit exceeded                     │
│ 500 Internal Server Error → Server error                        │
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Filtering, Sorting, Pagination

```
# Filtering
GET /api/siswa?kelas=6A&status=aktif
GET /api/siswa?nilai_gte=80&nilai_lte=100

# Sorting
GET /api/siswa?sort=nama&order=asc
GET /api/siswa?sort=created_at&order=desc

# Pagination (Offset-based)
GET /api/siswa?page=2&limit=20
Response:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": true
  }
}

# Pagination (Cursor-based — lebih baik untuk data besar)
GET /api/siswa?limit=20&cursor=eyJpZCI6MTIzfQ==
Response:
{
  "data": [...],
  "next_cursor": "eyJpZCI6MTQzfQ==",
  "has_more": true
}

# Field selection
GET /api/siswa?fields=id,nama,kelas
→ Hanya return field yang diminta
```

#### 4. Versioning API

```
# URL versioning (paling umum)
GET /api/v1/siswa
GET /api/v2/siswa

# Header versioning
GET /api/siswa
Header: API-Version: 2024-01-15

# Query parameter versioning
GET /api/siswa?version=2
```

#### 5. Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input tidak valid",
    "details": [
      {
        "field": "email",
        "message": "Format email tidak valid"
      },
      {
        "field": "umur",
        "message": "Umur harus antara 6-18"
      }
    ],
    "request_id": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Contoh REST API Lengkap — Sistem Sekolah

```
┌─────────────────────────────────────────────────────────────────┐
│              REST API — SISTEM SEKOLAH                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SISWA:                                                         │
│  GET    /api/v1/siswa                    → List semua siswa     │
│  GET    /api/v1/siswa/:id               → Detail siswa          │
│  POST   /api/v1/siswa                    → Buat siswa baru       │
│  PUT    /api/v1/siswa/:id               → Update siswa          │
│  PATCH  /api/v1/siswa/:id/alamat        → Update alamat saja    │
│  DELETE /api/v1/siswa/:id               → Hapus siswa           │
│                                                                 │
│  GURU:                                                          │
│  GET    /api/v1/guru                     → List semua guru       │
│  GET    /api/v1/guru/:id                → Detail guru           │
│  GET    /api/v1/guru/:id/jadwal         → Jadwal mengajar       │
│  POST   /api/v1/guru                     → Tambah guru           │
│                                                                 │
│  NILAI:                                                         │
│  GET    /api/v1/siswa/:id/nilai         → Nilai seorang siswa   │
│  POST   /api/v1/guru/:id/nilai          → Input nilai (guru)    │
│  GET    /api/v1/kelas/:id/nilai/rata-rata → Rata-rata kelas     │
│                                                                 │
│  ABSENSI:                                                       │
│  GET    /api/v1/siswa/:id/absensi       → History absensi       │
│  POST   /api/v1/absensi                 → Input absensi hari ini│
│  GET    /api/v1/absensi/rekap?bulan=01  → Rekap bulanan         │
│                                                                 │
│  LAPORAN:                                                       │
│  GET    /api/v1/laporan/kehadiran        → Laporan kehadiran    │
│  GET    /api/v1/laporan/keuangan         → Laporan BOS          │
│  POST   /api/v1/laporan/ekspor           → Export ke PDF/Excel  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. GraphQL — Query Language untuk API

### Apa Itu GraphQL?

GraphQL adalah **query language** dan runtime untuk API yang dikembangkan Facebook. Client bisa meminta data spesifik yang dibutuhkan — tidak lebih, tidak kurang.

### GraphQL vs REST

```
┌─────────────────────────────────────────────────────────────────┐
│                    REST vs GraphQL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  REST — Multiple endpoints:                                     │
│  GET /api/siswa/123          → {id, nama, kelas_id, ...}        │
│  GET /api/kelas/6A           → {id, nama, wali_kelas_id, ...}   │
│  GET /api/guru/456           → {id, nama, ...}                  │
│  → 3 requests untuk data lengkap!                               │
│                                                                 │
│  GraphQL — Single endpoint, satu query:                         │
│  POST /graphql                                                    │
│  {                                                                │
│    siswa(id: 123) {                                               │
│      nama                                                         │
│      kelas {                                                      │
│        nama                                                       │
│        waliKelas {                                                │
│          nama                                                     │
│        }                                                          │
│      }                                                            │
│    }                                                              │
│  }                                                                │
│  → 1 request, data lengkap sesuai kebutuhan!                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### GraphQL Schema

Schema adalah **kontrak** antara client dan server. Mendefinisikan tipe data dan operasi yang tersedia.

```graphql
# Type definitions
type Siswa {
  id: ID!
  nisn: String!
  nama: String!
  ttl: TanggalLahir
  kelas: Kelas
  orangTua: OrangTua
  nilai: [Nilai!]
  absensi: [Absensi!]
  createdAt: String!
}

type Kelas {
  id: ID!
  nama: String!
  waliKelas: Guru
  jumlahSiswa: Int
}

type Guru {
  id: ID!
  nip: String!
  nama: String!
  mataPelajaran: String
  kelasDiajar: [Kelas!]
}

type TanggalLahir {
  tanggal: Int!
  bulan: Int!
  tahun: Int!
}

type Nilai {
  id: ID!
  mapel: String!
  nilai: Float!
  semester: Int!
}

type Absensi {
  id: ID!
  tanggal: String!
  status: StatusAbsensi!
  keterangan: String
}

enum StatusAbsensi {
  HADIR
  SAKIT
  IZIN
  ALPHA
}

# Query (Read operations)
type Query {
  siswa(id: ID!): Siswa
  siswaByKelas(kelasId: ID!): [Siswa!]
  semuaSiswa(page: Int, limit: Int): [Siswa!]
  guru(id: ID!): Guru
  semuaGuru: [Guru!]
  kelas(id: ID!): Kelas
  semuaKelas: [Kelas!]
}

# Mutation (Write operations)
type Mutation {
  buatSiswa(input: SiswaInput!): Siswa!
  updateSiswa(id: ID!, input: SiswaInput!): Siswa!
  hapusSiswa(id: ID!): Boolean!
  inputNilai(input: NilaiInput!): Nilai!
  inputAbsensi(input: AbsensiInput!): Absensi!
}

# Subscription (Real-time)
type Subscription {
  absensiBaru(siswaId: ID): Absensi!
  nilaiBaru(siswaId: ID): Nilai!
}

# Input types
input SiswaInput {
  nisn: String!
  nama: String!
  ttl: TanggalLahirInput!
  kelasId: ID!
  alamat: String
}

input TanggalLahirInput {
  tanggal: Int!
  bulan: Int!
  tahun: Int!
}
```

### GraphQL Queries

```graphql
# Query sederhana
query GetSiswa {
  siswa(id: "123") {
    nama
    nisn
  }
}

# Query dengan nested data
query GetSiswaDetail {
  siswa(id: "123") {
    nama
    kelas {
      nama
      waliKelas {
        nama
        mataPelajaran
      }
    }
    nilai(semester: 1) {
      mapel
      nilai
    }
  }
}

# Query dengan variabel
query GetSiswaByKelas($kelasId: ID!) {
  siswaByKelas(kelasId: $kelasId) {
    id
    nama
    nisn
  }
}
# Variables: { "kelasId": "6A" }

# Multiple queries dalam satu request
query DashboardData {
  totalSiswa: semuaSiswa { id }
  totalGuru: semuaGuru { id }
  semuaKelas {
    id
    nama
    jumlahSiswa
  }
}
```

### GraphQL Mutations

```graphql
# Create siswa
mutation BuatSiswaBaru {
  buatSiswa(input: {
    nisn: "0012345678"
    nama: "Ahmad Fauzi"
    ttl: { tanggal: 15, bulan: 3, tahun: 2012 }
    kelasId: "6A"
    alamat: "Jl. Mandalamukti No. 10"
  }) {
    id
    nama
    nisn
  }
}

# Update siswa
mutation UpdateSiswa {
  updateSiswa(id: "123", input: {
    nama: "Ahmad Fauzi Rahman"
    alamat: "Jl. Mandalamukti No. 15"
  }) {
    id
    nama
    alamat
  }
}

# Input nilai
mutation InputNilai {
  inputNilai(input: {
    siswaId: "123"
    mapel: "Matematika"
    nilai: 85.5
    semester: 1
  }) {
    id
    mapel
    nilai
  }
}
```

### GraphQL Subscriptions

```graphql
# Real-time subscription
subscription OnAbsensiBaru {
  absensiBaru {
    siswa {
      nama
      kelas { nama }
    }
    tanggal
    status
  }
}

# Server push ke client saat ada absensi baru:
{
  "data": {
    "absensiBaru": {
      "siswa": { "nama": "Ahmad Fauzi", "kelas": { "nama": "6A" } },
      "tanggal": "2024-01-15",
      "status": "HADIR"
    }
  }
}
```

### Kapan Pakai GraphQL?

```
✅ PAKAI GraphQL JIKA:
   → Multiple client (web, mobile, tablet) dengan kebutuhan data berbeda
   → Client butuh fleksibilitas query data
   → Ada masalah over-fetching atau under-fetching di REST
   → Frontend berkembang cepat, butuh iterasi tanpa ubah backend
   → Kompleks relasi data (nested, connected)

❌ JANGAN PAKAI GraphQL JIKA:
   → API sederhana, 2-3 endpoint saja
   → Butuh caching sederhana (HTTP cache tidak jalan di GraphQL)
   → File upload/download besar
   → Tim belum familiar dengan GraphQL
   → Butuh rate limiting per endpoint (lebih kompleks di GraphQL)
```

---

## 5. gRPC — High-Performance RPC Framework

### Apa Itu gRPC?

gRPC (gRPC Remote Procedure Calls) adalah framework RPC open-source dari Google yang menggunakan **Protocol Buffers** sebagai interface definition language.

### Protocol Buffers (Protobuf)

Protocol Buffers adalah format **serialisasi data biner** yang lebih kecil dan lebih cepat dari JSON/XML.

```protobuf
// user.proto
syntax = "proto3";

package sekolah;

// Service definition
service SiswaService {
  // Unary RPC — satu request, satu response
  rpc GetSiswa (GetSiswaRequest) returns (Siswa);

  // Server streaming — satu request, banyak response
  rpc StreamSiswaByKelas (KelasRequest) returns (stream Siswa);

  // Client streaming — banyak request, satu response
  rpc BatchCreateSiswa (stream Siswa) returns (BatchResponse);

  // Bidirectional streaming — banyak request, banyak response
  rpc ChatAbsensi (stream AbsensiMessage) returns (stream AbsensiResponse);
}

// Message definitions
message Siswa {
  string id = 1;
  string nisn = 2;
  string nama = 3;
  int32 umur = 4;
  string kelas = 5;
  repeated string hobi = 6;
  StatusAbsensi status = 7;
}

message GetSiswaRequest {
  string id = 1;
}

message KelasRequest {
  string kelas_nama = 1;
}

message BatchResponse {
  int32 success_count = 1;
  int32 failed_count = 2;
  repeated string errors = 3;
}

enum StatusAbsensi {
  STATUS_TIDAK_DIKETAHUI = 0;
  HADIR = 1;
  SAKIT = 2;
  IZIN = 3;
  ALPHA = 4;
}

message AbsensiMessage {
  string siswa_id = 1;
  string tanggal = 2;
  StatusAbsensi status = 3;
}

message AbsensiResponse {
  bool success = 1;
  string message = 2;
}
```

### gRPC Code Generation

Dari file `.proto`, gRPC generate kode untuk berbagai bahasa:

```bash
# Generate Go code
protoc --go_out=. --go-grpc_out=. user.proto

# Generate Python code
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. user.proto

# Generate TypeScript code
protoc --ts_out=. --grpc-web_out=. user.proto
```

### gRPC Streaming Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    gRPC STREAMING TYPES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. UNARY (Request-Response)                                    │
│     Client ────[Request]───▶ Server                             │
│     Client ◀───[Response]─── Server                             │
│     Contoh: GetSiswa(id) → Siswa                                │
│                                                                 │
│  2. SERVER STREAMING                                            │
│     Client ────[Request]───▶ Server                             │
│     Client ◀───[Stream 1]─── Server                             │
│     Client ◀───[Stream 2]─── Server                             │
│     Client ◀───[Stream 3]─── Server                             │
│     Contoh: StreamSiswaByKelas("6A") → stream semua siswa       │
│                                                                 │
│  3. CLIENT STREAMING                                            │
│     Client ────[Msg 1]───▶ Server                               │
│     Client ────[Msg 2]───▶ Server                               │
│     Client ────[Msg 3]───▶ Server                               │
│     Client ◀───[Response]─── Server                             │
│     Contoh: BatchCreateSiswa(stream data) → result              │
│                                                                 │
│  4. BIDIRECTIONAL STREAMING                                     │
│     Client ──[Msg1]─▶ Server ──[Resp1]─▶ Client                 │
│     Client ──[Msg2]─▶ Server ──[Resp2]─▶ Client                 │
│     Client ──[Msg3]─▶ Server ──[Resp3]─▶ Client                 │
│     Contoh: Real-time chat, live collaboration                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### gRPC vs REST Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    gRPC vs REST                                 │
├──────────────────────┬──────────────────────┬───────────────────┤
│ Aspek                │ REST                 │ gRPC              │
├──────────────────────┼──────────────────────┼───────────────────┤
│ Protocol             │ HTTP/1.1 or HTTP/2   │ HTTP/2            │
│ Data format          │ JSON/XML             │ Protocol Buffers  │
│ Payload size         │ Besar (text)         │ Kecil (binary)    │
│ Kecepatan            │ Standar              │ 7-10x lebih cepat │
│ Code generation      │ Manual/Swagger       │ Otomatis (.proto) │
│ Browser support      │ Native               │ Perlu gRPC-Web    │
│ Streaming            │ Limited (SSE)        │ Native support    │
│ API contract         │ OpenAPI/Swagger      │ .proto files      │
│ Debugging            │ Mudah (baca JSON)    │ Perlu tool khusus │
│ Use case             │ Public API, Web      │ Internal services │
└──────────────────────┴──────────────────────┴───────────────────┘
```

### Kapan Pakai gRPC?

```
✅ PAKAI gRPC JIKA:
   → Microservices communication (service-to-service)
   → Butuh performa tinggi (low latency, high throughput)
   → Streaming data real-time
   → Polyglot environment (banyak bahasa pemrograman)
   → Contract-first development (proto sebagai kontrak)

❌ JANGAN PAKAI gRPC JIKA:
   → Public API untuk browser (butuh gRPC-Web proxy)
   → Butuh debugging mudah oleh manusia
   → Integrasi dengan sistem legacy yang hanya support REST
   → Tim belum familiar dengan Protocol Buffers
```

---

## 6. WebSocket — Komunikasi Real-Time Dua Arah

### Apa Itu WebSocket?

WebSocket adalah protokol yang menyediakan **full-duplex communication** (dua arah simultan) melalui satu koneksi TCP yang persistent.

### WebSocket Handshake

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEBSOCKET HANDSHAKE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Client mengirim HTTP Upgrade request:                       │
│  ─────────────────────────────────────────────────────────────  │
│  GET /ws HTTP/1.1                                               │
│  Host: sekolah.example.com                                      │
│  Upgrade: websocket                                             │
│  Connection: Upgrade                                            │
│  Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==                    │
│  Sec-WebSocket-Version: 13                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  2. Server merespon dengan upgrade confirmation:                │
│  ─────────────────────────────────────────────────────────────  │
│  HTTP/1.1 101 Switching Protocols                               │
│  Upgrade: websocket                                             │
│  Connection: Upgrade                                            │
│  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  3. Koneksi WebSocket terbentuk!                                │
│     Client ↔ Server (full-duplex, persistent)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### WebSocket Frame Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEBSOCKET FRAME                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  0                   1                   2                   3  │
│  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0│
│ ├─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┤
│ │F│   Opcode    │M│ Payload len │    Extended payload length    │
│ │I│            │A│    (7/23/71)│                               │
│ │N│            │S│             │                               │
│ ├─┴────────────┴─┴─────────────┴───────────────────────────────┤
│ │                    Masking-key (if set)                       │
│ ├───────────────────────────────────────────────────────────────┤
│ │                     Payload Data                              │
│ └───────────────────────────────────────────────────────────────┘
│                                                                 │
│  FIN: Final frame flag                                          │
│  Opcode: 0x1=Text, 0x2=Binary, 0x8=Close, 0x9=Ping, 0xA=Pong   │
│  MASK: Client→Server frames harus di-mask                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### WebSocket Use Cases

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEBSOCKET USE CASES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CHAT APPLICATION                                            │
│     Guru ↔ Server ↔ Orang Tua                                   │
│     Pesan real-time tanpa polling                               │
│                                                                 │
│  2. LIVE NOTIFICATIONS                                          │
│     Server push notifikasi ke browser                           │
│     "Absensi baru dicatat", "Nilai sudah diinput"               │
│                                                                 │
│  3. COLLABORATIVE EDITING                                       │
│     Multiple guru edit dokumen bersamaan                        │
│     Google Docs-style collaboration                             │
│                                                                 │
│  4. LIVE DASHBOARD                                              │
│     Monitoring kehadiran real-time                              │
│     Grafik update otomatis                                      │
│                                                                 │
│  5. ONLINE TESTING/EXAM                                         │
│     Soal dikirim real-time                                      │
│     Proctoring live monitoring                                  │
│                                                                 │
│  6. MULTIPLAYER GAME EDUKASI                                    │
│     Kuis antar kelas real-time                                  │
│     Leaderboard live update                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### WebSocket vs Alternatif

```
┌─────────────────────────────────────────────────────────────────┐
│              REAL-TIME COMPARISON                               │
├──────────────────────┬──────────────┬──────────────┬────────────┤
│ Fitur                │ WebSocket    │ Server-Sent  │ Long       │
│                      │              │ Events (SSE) │ Polling    │
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ Komunikasi           │ Full-duplex  │ Server→Only  │ Request→   │
│                      │ (dua arah)   │              │ Response   │
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ Protocol             │ ws:// wss:// │ http://      │ http://    │
│ Koneksi              │ Persistent   │ Persistent   │ Per request│
│ Reconnect            │ Manual       │ Otomatis     │ Per loop   │
│ Browser support      │ 97%+         │ 97%+         │ 100%       │
│ Complexity           │ Medium       │ Simple       │ Simple     │
│ Use when             │ Chat, collab │ Notifications│ Fallback   │
└──────────────────────┴──────────────┴──────────────┴────────────┘
```

---

## 7. Message Protocols — AMQP, MQTT, STOMP

### AMQP (Advanced Message Queuing Protocol)

Protokol messaging untuk **message queue** dan **message broker**.

```
┌─────────────────────────────────────────────────────────────────┐
│                    AMQP ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Publisher ──▶ Exchange ──▶ Queue ──▶ Consumer                  │
│                      │                                          │
│                      ├──▶ Queue A (routing key: "siswa.*")      │
│                      ├──▶ Queue B (routing key: "nilai.*")      │
│                      └──▶ Queue C (routing key: "#")            │
│                                                                 │
│  Exchange Types:                                                │
│  - Direct:   Routing key exact match                            │
│  - Fanout:   Broadcast ke semua queue                           │
│  - Topic:    Pattern matching (siswa.6A, siswa.6B)              │
│  - Headers:  Match berdasarkan header attributes                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**AMQP Use Cases:**
- Task queue (background jobs)
- Event-driven architecture
- Order processing
- Email notification queue

**Broker populer:** RabbitMQ, Apache Qpid

### MQTT (Message Queuing Telemetry Transport)

Protokol messaging **ringan** untuk IoT dan koneksi bandwidth rendah.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MQTT ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Publisher ──▶ Broker ──▶ Subscriber                            │
│                                                                 │
│  Topic Hierarchy:                                               │
│  sekolah/sd-pasirhalang/absensi/hadir                           │
│  sekolah/sd-pasirhalang/sensor/suhu                             │
│  sekolah/sd-pasirhalang/perangkat/printer/status                │
│                                                                 │
│  QoS Levels:                                                    │
│  QoS 0: At most once  (fire and forget)                         │
│  QoS 1: At least once (confirmed delivery)                      │
│  QoS 2: Exactly once  (guaranteed, no duplicate)                │
│                                                                 │
│  Fitur:                                                         │
│  - Last Will & Testament (LWT) — pesan saat client disconnect   │
│  - Retained messages — pesan terakhir disimpan broker           │
│  - Persistent session — reconnect tanpa lose subscription       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**MQTT Use Cases:**
- IoT sensor (suhu, kelembaban, CCTV)
- Smart school devices
- Mobile push notifications
- Low-bandwidth environments

**Broker populer:** Mosquitto, EMQX, AWS IoT Core

### STOMP (Simple Text Oriented Messaging Protocol)

Protokol messaging **berbasis teks** yang sederhana.

```
# STOMP Frame Format
SEND
destination:/topic/absensi
content-type:application/json

{"siswa_id": "123", "status": "HADIR", "waktu": "07:30"}

^@
```

**STOMP Use Cases:**
- Simple message broker integration
- Web messaging (browser support via WebSocket)
- Quick prototyping

---

## 8. Protocol Selection Guide

### Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│              PROTOKOL SELECTION DECISION TREE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mulai: Apa kebutuhan komunikasi?                               │
│  │                                                              │
│  ├── Public API untuk web/mobile?                               │
│  │   ├── Perlu fleksibilitas query? → GraphQL                   │
│  │   ├── CRUD sederhana? → REST                                 │
│  │   └── File upload besar? → REST + multipart                  │
│  │                                                              │
│  ├── Service-to-service internal?                               │
│  │   ├── Butuh performa tinggi? → gRPC                          │
│  │   ├── Butuh simplicity? → REST                               │
│  │   └── Event-driven? → AMQP (RabbitMQ)                        │
│  │                                                              │
│  ├── Real-time dua arah?                                        │
│  │   ├── Chat/collaboration? → WebSocket                        │
│  │   ├── Server push only? → SSE                                │
│  │   └── Fallback needed? → Long Polling                        │
│  │                                                              │
│  ├── IoT/Sensor data?                                           │
│  │   ├── Low bandwidth? → MQTT                                  │
│  │   └── Reliable delivery? → MQTT QoS 1/2                      │
│  │                                                              │
│  ├── Live streaming video?                                      │
│  │   ├── Low latency? → WebRTC (UDP-based)                      │
│  │   └── Standard streaming? → HLS/DASH over HTTP               │
│  │                                                              │
│  └── Background processing?                                     │
│      ├── Task queue? → AMQP                                     │
│      └── Event streaming? → Kafka                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Real-World Protocol Selection

```
┌─────────────────────────────────────────────────────────────────┐
│              REAL-WORLD SCENARIOS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Scenario 1: Aplikasi Absensi Sekolah                           │
│  ─────────────────────────────────────────                      │
│  • Mobile app guru input absensi → REST API                     │
│  • Dashboard admin real-time update → WebSocket                 │
│  • Notifikasi ke orang tua → MQTT push                          │
│  • Sync data antar server → gRPC                                │
│  • Backup data ke cloud → REST (batch)                          │
│                                                                 │
│  Scenario 2: Sistem Ujian Online                                │
│  ─────────────────────────────────────────                      │
│  • Download soal → REST (cacheable)                             │
│  • Timer countdown → WebSocket                                  │
│  • Auto-save jawaban → REST (periodic)                          │
│  • Proctoring video stream → WebRTC                             │
│  • Submit jawaban → REST (reliable)                             │
│                                                                 │
│  Scenario 3: IoT Smart School                                   │
│  ─────────────────────────────────────────                      │
│  • Sensor suhu/kelembaban → MQTT (QoS 1)                        │
│  • CCTV monitoring → RTSP/WebRTC                                │
│  • Kontrol AC/Lampu → MQTT                                      │
│  • Dashboard monitoring → WebSocket + REST                      │
│  • Alert system → MQTT + AMQP                                   │
│                                                                 │
│  Scenario 4: Microservices Architecture                         │
│  ─────────────────────────────────────────                      │
│  • API Gateway → REST (external) / gRPC (internal)              │
│  • User service → gRPC                                          │
│  • Notification service → AMQP (async)                          │
│  • Analytics service → Kafka (event streaming)                  │
│  • Cache layer → Redis protocol                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Protocol Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│              QUICK REFERENCE TABLE                              │
├──────────────────────┬──────────────┬──────────────┬────────────┤
│ Protokol             │ Layer        │ Kecepatan    │ Reliability│
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ TCP                  │ Transport    │ Medium       │ ★★★★★     │
│ UDP                  │ Transport    │ Tinggi       │ ★☆☆☆☆     │
│ HTTP/1.1             │ Application  │ Medium       │ ★★★★★     │
│ HTTP/2               │ Application  │ Tinggi       │ ★★★★★     │
│ HTTP/3 (QUIC)        │ Application  │ Sangat Tinggi│ ★★★★★     │
│ REST (over HTTP)     │ Application  │ Medium       │ ★★★★★     │
│ GraphQL (over HTTP)  │ Application  │ Medium       │ ★★★★★     │
│ gRPC                 │ Application  │ Sangat Tinggi│ ★★★★★     │
│ WebSocket            │ Application  │ Tinggi       │ ★★★★☆     │
│ AMQP                 │ Application  │ Medium       │ ★★★★★     │
│ MQTT                 │ Application  │ Tinggi       │ ★★★★☆     │
│ STOMP                │ Application  │ Medium       │ ★★★★☆     │
└──────────────────────┴──────────────┴──────────────┴────────────┘
```

---

## 🎯 CONTOH NYATA

### Contoh 1: Aplikasi Sekolah — REST API

```
GET    /api/v1/guru          → Daftar guru
POST   /api/v1/absensi       → Input absensi
GET    /api/v1/laporan/nilai → Nilai siswa
PUT    /api/v1/siswa/123     → Update data siswa
```

**Kenapa REST:** Sederhana, universal, mudah di-debug, caching HTTP native.

### Contoh 2: Chat Sekolah — WebSocket

```
[Guru] ──WebSocket──▶ [Server] ──WebSocket──▶ [Orang Tua]
[Pesan]              [Route]                 [Deliver]
```

Pesan sampai real-time tanpa perlu refresh halaman.

### Contoh 3: Microservices Internal — gRPC

```
┌──────────┐     gRPC      ┌──────────┐     gRPC      ┌──────────┐
│ API      │ ────────────▶ │ Siswa    │ ────────────▶ │ Nilai    │
│ Gateway  │ ◀──────────── │ Service  │ ◀──────────── │ Service  │
└──────────┘   Protobuf    └──────────┘   Protobuf    └──────────┘
     │
     │ REST (JSON)
     ▼
  [Client]
```

**Kenapa gRPC:** Internal communication, butuh performa tinggi, contract-first dengan .proto.

### Contoh 4: Kapan Pakai Apa?

| Kebutuhan | Protokol | Alasan |
|---|---|---|
| API publik untuk mobile/web | REST | Universal, mudah diintegrasikan |
| Service-to-service internal | gRPC | Performa tinggi, typed contract |
| Real-time chat/notifikasi | WebSocket | Full-duplex, persistent connection |
| Client mau milih field spesifik | GraphQL | No over/under-fetching |
| Live streaming video | UDP + HLS | Low latency, tolerant to loss |
| File upload/download | HTTP/TCP | Reliable, resumable |
| IoT sensor data | MQTT | Lightweight, low bandwidth |
| Background job queue | AMQP | Reliable delivery, routing |
| Browser server-push only | SSE | Simple, auto-reconnect |

---

## 💡 PRAKTIK

### Latihan 1: Pilih Protokol

Tentukan protokol yang cocok:

1. Aplikasi chat antara guru dan orang tua
2. API untuk mobile app absensi
3. Streaming video upacara bendera
4. Dashboard real-time kehadiran guru
5. API laporan keuangan BOS
6. Sensor suhu ruang kelas IoT
7. Background job kirim email rapor
8. Collaborative editing dokumen kurikulum

**Jawaban:**
1. WebSocket (real-time dua arah)
2. REST (CRUD sederhana, universal)
3. UDP + HLS/DASH (streaming, toleran loss)
4. WebSocket (live update) atau SSE (server push only)
5. REST (reliable, cacheable)
6. MQTT (lightweight, IoT)
7. AMQP (message queue, reliable delivery)
8. WebSocket (bidirectional editing)

### Latihan 2: Desain REST API

Desain REST API untuk aplikasi perpustakaan sekolah:
- Lihat daftar buku
- Cari buku
- Pinjam buku
- Kembalikan buku
- Lihat history peminjaman

Buat endpoint, method, dan response JSON untuk setiap fitur.

### Latihan 3: Desain GraphQL Schema

Buat GraphQL schema untuk sistem sekolah dengan:
- Siswa, Guru, Kelas, Nilai, Absensi
- Query: detail siswa dengan nested data
- Mutation: input absensi
- Subscription: notifikasi nilai baru

---

## ✅ CHECKLIST

- [ ] Bisa jelaskan perbedaan TCP vs UDP dengan contoh
- [ ] Paham perbedaan HTTP/1.1, HTTP/2, HTTP/3
- [ ] Paham prinsip REST API dan best practices
- [ ] Bisa mendesain REST API dengan proper naming
- [ ] Paham kelebihan dan kekurangan GraphQL
- [ ] Bisa menulis GraphQL query, mutation, subscription
- [ ] Paham gRPC dan Protocol Buffers
- [ ] Bisa jelaskan 4 tipe streaming di gRPC
- [ ] Paham WebSocket handshake dan use cases
- [ ] Paham perbedaan AMQP, MQTT, STOMP
- [ ] Bisa memilih protokol yang tepat untuk skenario tertentu
- [ ] Paham tradeoff antara berbagai protokol

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Communication](https://github.com/donnemartin/system-design-primer#communication)
- **HTTP/2:** [RFC 7540](https://httpwg.org/specs/rfc7540.html)
- **HTTP/3:** [RFC 9114](https://httpwg.org/specs/rfc9114.html)
- **REST API Design:** [REST API Tutorial](https://restfulapi.net/)
- **GraphQL:** [graphql.org/learn](https://graphql.org/learn/)
- **gRPC:** [grpc.io/docs](https://grpc.io/docs/)
- **WebSocket:** [RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)
- **MQTT:** [mqtt.org/documentation](https://mqtt.org/documentation/)
- **AMQP:** [rabbitmq.com/tutorials](https://www.rabbitmq.com/tutorials)

---

> **Lanjut ke:** [`17-keamanan-sistem.md`](./17-keamanan-sistem.md)