# 11 — Application Layer & Microservices

> **Estimasi:** 2.5 jam | **Level:** Menengah

---

## 📖 TEORI

### Apa itu Application Layer?

Application layer adalah **dimana logika bisnis** dari aplikasi Anda berada. Ini adalah lapisan yang memproses request dari user, berinteraksi dengan database, menjalankan business rules, dan mengembalikan response.

Dalam konteks sistem desain (donnemartin/system-design-primer), application layer adalah komponen yang berada di antara client/presentation layer dan data layer. Ini adalah "otak" dari aplikasi Anda.

```
┌─────────────────────────────────────────────────────────────┐
│                    TIGA LAPISAN APLIKASI                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Client] ←── Browser, Mobile App, Desktop App               │
│     ↕                                                        │
│  ┌──────────────────────────────────────┐                    │
│  │  PRESENTATION LAYER (UI/Frontend)    │                    │
│  │  - HTML/CSS/JavaScript               │                    │
│  │  - React, Vue, Angular               │                    │
│  │  - Mobile UI (Flutter, React Native) │                    │
│  │  - Menampilkan data ke user          │                    │
│  └──────────────────┬───────────────────┘                    │
│                     ↕                                        │
│  ┌──────────────────────────────────────┐                    │
│  │  APPLICATION LAYER (Logic/Backend)   │ ← KITA FOKUS DI SINI
│  │  - Business logic                    │                    │
│  │  - Authentication & Authorization    │                    │
│  │  - Data processing                   │                    │
│  │  - API endpoints                     │                    │
│  │  - Node.js, Python, PHP, Java, Go    │                    │
│  └──────────────────┬───────────────────┘                    │
│                     ↕                                        │
│  ┌──────────────────────────────────────┐                    │
│  │  DATA LAYER (Database/Storage)       │                    │
│  │  - MySQL, PostgreSQL, MongoDB        │                    │
│  │  - Redis, Elasticsearch              │                    │
│  │  - File storage (S3, GCS)            │                    │
│  └──────────────────────────────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

Application layer menerima request HTTP, memprosesnya (validasi, business logic, database query), dan mengembalikan response. Desain application layer yang baik menentukan skalabilitas, maintainability, dan performa aplikasi Anda.

---

### Application Layer Patterns

Ada beberapa pola (pattern) dalam mendesain application layer. Pemilihan pattern tergantung pada kompleksitas aplikasi, ukuran tim, dan kebutuhan skalabilitas.

#### 1. Monolith (Monolithic Architecture)

**Satu aplikasi besar** yang menangani semua fungsionalitas dalam satu codebase, satu deployable unit, dan biasanya satu database.

```
┌──────────────────────────────────────────────────────────┐
│                    MONOLITH ARCHITECTURE                   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              SATU APLIKASI (Monolith)                │ │
│  │                                                      │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │ │
│  │  │  Auth  │ │  User  │ │ Order  │ │ Produk │       │ │
│  │  │ Module │ │ Module │ │ Module │ │ Module │       │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │ │
│  │  │Payment │ │ Report │ │ Notif  │ │ Admin  │       │ │
│  │  │ Module │ │ Module │ │ Module │ │ Module │       │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │ │
│  │                                                      │ │
│  │  Semua module:                                       │ │
│  │  - Satu codebase (satu repository)                   │ │
│  │  - Satu bahasa pemrograman                           │ │
│  │  - Satu proses yang berjalan                         │ │
│  │  - Satu database (shared)                            │ │
│  │  - Satu deployment                                   │ │
│  └──────────────────────┬───────────────────────────────┘ │
│                         ↕                                 │
│              ┌──────────────────────┐                     │
│              │   Satu Database      │                     │
│              │   (MySQL/PostgreSQL) │                     │
│              └──────────────────────┘                     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Kelebihan Monolith:**
- **Sederhana**: Satu codebase, mudah dipahami developer baru
- **Mudah di-deploy**: Satu artifact, satu proses deployment
- **Performa baik**: Function call langsung, tidak ada network overhead
- **Testing mudah**: Integration testing straightforward
- **Transaction mudah**: Satu database = ACID transaction mudah
- **Development cepat**: Tidak perlu setup infrastruktur kompleks

**Kekurangan Monolith:**
- **Semakin besar semakin kompleks**: Codebase bisa mencapai jutaan baris
- **Deploy risiko tinggi**: Satu bug = semua fitur terpengaruh
- **Sulit scale**: Harus scale semua, tidak bisa scale bagian tertentu
- **Tech stack terikat**: Sulit pakai bahasa/framework berbeda
- **Onboarding lambat**: Developer baru harus pahami seluruh codebase
- **Single point of failure**: Satu error bisa matikan semua fitur

**Kapan Pakai Monolith:**
- Startup / MVP (butuh cepat launch)
- Tim kecil (< 5 developer)
- Aplikasi dengan fitur terbatas
- Traffic belum tinggi
- Budget infrastruktur terbatas

#### 2. MVC (Model-View-Controller)

MVC adalah pattern paling populer untuk aplikasi web. Memisahkan aplikasi menjadi tiga komponen:

```
┌─────────────────────────────────────────────────────────────┐
│                    MVC PATTERN                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [User]                                                      │
│     │                                                        │
│     ▼                                                        │
│  ┌──────────────────────┐                                    │
│  │     CONTROLLER       │ ← Menerima request dari user       │
│  │  (Router/Handler)    │   Memproses input, panggil model   │
│  │                      │   Pilih view yang sesuai           │
│  └──────┬───────┬───────┘                                    │
│         │       │                                            │
│    ┌────┘       └────┐                                       │
│    ▼                 ▼                                       │
│  ┌────────┐    ┌────────────┐                                │
│  │ MODEL  │    │   VIEW     │                                │
│  │        │    │            │                                │
│  │ - Data │    │ - HTML     │                                │
│  │ - Logic│    │ - Template │                                │
│  │ - DB   │    │ - UI       │                                │
│  │ - Rules│    │ - Render   │                                │
│  └────┬───┘    └─────┬──────┘                                │
│       │              │                                       │
│       ▼              ▼                                       │
│  ┌──────────────────────┐                                    │
│  │    DATABASE          │                                    │
│  └──────────────────────┘                                    │
│                                                              │
│  FLOW:                                                       │
│  1. User klik "Lihat Profil"                                 │
│  2. Request → Controller (ProfileController)                 │
│  3. Controller panggil Model (UserModel)                     │
│  4. Model query database, return data                        │
│  5. Controller kirim data ke View (profile.blade.php)        │
│  6. View render HTML, kirim ke user                          │
│                                                              │
│  CONTOH FRAMEWORK MVC:                                       │
│  - Laravel (PHP)                                             │
│  - Ruby on Rails (Ruby)                                      │
│  - Django (Python) - mirip MTV (Model-Template-View)         │
│  - ASP.NET MVC (C#)                                          │
│  - Spring MVC (Java)                                         │
│  - Express.js + struktur MVC (Node.js)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Contoh MVC di Laravel:**

```php
// Controller: app/Http/Controllers/SiswaController.php
class SiswaController extends Controller
{
    public function index()
    {
        // Panggil Model
        $siswa = Siswa::with('kelas', 'orangTua')
            ->orderBy('nama')
            ->paginate(20);

        // Kirim ke View
        return view('siswa.index', compact('siswa'));
    }

    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'nisn' => 'required|unique:siswa',
            'nama' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'kelas_id' => 'required|exists:kelas,id',
        ]);

        // Simpan via Model
        $siswa = Siswa::create($validated);

        return redirect()->route('siswa.show', $siswa);
    }
}

// Model: app/Models/Siswa.php
class Siswa extends Model
{
    protected $fillable = ['nisn', 'nama', 'tanggal_lahir', 'kelas_id'];

    // Business logic di Model
    public function getStatusAttribute()
    {
        return $this->is_active ? 'Aktif' : 'Tidak Aktif';
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function orangTua()
    {
        return $this->hasMany(OrangTua::class);
    }
}

// View: resources/views/siswa/index.blade.php
@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Data Siswa</h1>
    <table>
        @foreach($siswa as $s)
        <tr>
            <td>{{ $s->nisn }}</td>
            <td>{{ $s->nama }}</td>
            <td>{{ $s->kelas->nama }}</td>
            <td>{{ $s->status }}</td>
        </tr>
        @endforeach
    </table>
    {{ $siswa->links() }}
</div>
@endsection
```

#### 3. MVP (Model-View-Presenter)

MVP adalah evolusi dari MVC, dimana Presenter bertindak sebagai mediator antara Model dan View. View lebih "pasif" — hanya menampilkan apa yang diberikan Presenter.

```
┌─────────────────────────────────────────────────────────────┐
│                    MVP PATTERN                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [User]                                                      │
│     │                                                        │
│     ▼                                                        │
│  ┌──────────────────────┐                                    │
│  │       VIEW           │ ← Hanya UI, tidak ada logic        │
│  │  (Passive View)      │   Menerima data dari Presenter     │
│  │                      │   Forward user action ke Presenter │
│  └──────┬───────┬───────┘                                    │
│         │       │                                            │
│    ┌────┘       └────┐                                       │
│    ▼                 ▼                                       │
│  ┌────────┐    ┌────────────┐                                │
│  │PRESENTER│   │   MODEL    │                                │
│  │        │    │            │                                │
│  │ - Logic│    │ - Data     │                                │
│  │ - Format│   │ - Business │                                │
│  │ - Update│   │ - Rules    │                                │
│  │   View │    │ - DB       │                                │
│  └────┬───┘    └─────┬──────┘                                │
│       │              │                                       │
│       └──────┬───────┘                                       │
│              ↕                                                │
│  Presenter mengupdate View berdasarkan data dari Model        │
│                                                              │
│  PERBEDAAN MVC vs MVP:                                       │
│  - MVC: View bisa akses Model langsung                       │
│  - MVP: View TIDAK bisa akses Model, harus lewat Presenter   │
│  - MVP lebih testable (Presenter bisa di-unit test)          │
│  - MVP lebih cocok untuk aplikasi dengan UI kompleks         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4. MVVM (Model-View-ViewModel)

MVVM populer di frontend framework modern. ViewModel adalah abstraction dari View yang berisi state dan logic untuk UI.

```
┌─────────────────────────────────────────────────────────────┐
│                    MVVM PATTERN                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [User]                                                      │
│     │                                                        │
│     ▼                                                        │
│  ┌──────────────────────┐                                    │
│  │       VIEW           │ ← UI template (HTML/JSX)           │
│  │  (Declarative UI)    │   Data-binding ke ViewModel        │
│  │                      │   Auto-update saat data berubah    │
│  └──────┬───────────────┘                                    │
│         │ Data Binding (two-way)                             │
│         ▼                                                    │
│  ┌──────────────────────┐                                    │
│  │    VIEWMODEL         │ ← State + logic untuk UI           │
│  │                      │   Expose data yang View butuhkan   │
│  │  - UI State          │   Handle user interaction          │
│  │  - Computed values   │   Komunikasi dengan Model          │
│  │  - Commands          │                                    │
│  └──────┬───────────────┘                                    │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────┐                                    │
│  │       MODEL          │ ← Data + business logic            │
│  │                      │   API calls, database              │
│  │  - Data entities     │   Business rules                   │
│  │  - Repositories      │                                    │
│  └──────────────────────┘                                    │
│                                                              │
│  CONTOH FRAMEWORK MVVM:                                      │
│  - Vue.js (ViewModel = Vue instance)                         │
│  - Angular (ViewModel = Component class)                     │
│  - React (mirip MVVM dengan hooks)                           │
│  - Knockout.js                                               │
│  - WPF/XAML (C#)                                             │
│                                                              │
│  CONTOH VUE.JS (MVVM):                                       │
│                                                              │
│  <template>  <!-- VIEW -->                                   │
│    <div>                                                     │
│      <h1>{{ siswaCount }} Siswa</h1>                         │
│      <input v-model="searchQuery" placeholder="Cari...">     │
│      <ul>                                                    │
│        <li v-for="siswa in filteredSiswa" :key="siswa.id">   │
│          {{ siswa.nama }} - {{ siswa.kelas }}                │
│        </li>                                                 │
│      </ul>                                                   │
│    </div>                                                    │
│  </template>                                                 │
│                                                              │
│  <script>  <!-- VIEWMODEL -->                                │
│  export default {                                            │
│    data() {                                                  │
│      return {                                                │
│        siswa: [],         // Model data                      │
│        searchQuery: ''    // UI state                        │
│      }                                                       │
│    },                                                        │
│    computed: {          // Computed values                   │
│      siswaCount() { return this.siswa.length; },             │
│      filteredSiswa() {                                       │
│        return this.siswa.filter(s =>                         │
│          s.nama.toLowerCase().includes(this.searchQuery)     │
│        );                                                    │
│      }                                                       │
│    },                                                        │
│    async mounted() {  // Commands                            │
│      this.siswa = await fetchSiswaFromAPI();                 │
│    }                                                         │
│  }                                                           │
│  </script>                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 5. Microservices Architecture

Aplikasi dipecah menjadi **service-service kecil** yang independen, masing-masing memiliki tanggung jawab spesifik, database sendiri, dan bisa di-deploy secara terpisah.

```
┌─────────────────────────────────────────────────────────────┐
│                    MICROSERVICES ARCHITECTURE                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌─────────────┐                           │
│                    │   CLIENTS   │                           │
│                    │ Web/Mobile  │                           │
│                    └──────┬──────┘                           │
│                           │                                  │
│                    ┌──────▼──────┐                           │
│                    │ API Gateway │ ← Single entry point       │
│                    │  (Kong/     │   Routing, auth, rate      │
│                    │   Nginx)    │   limiting                 │
│                    └──────┬──────┘                           │
│                           │                                  │
│          ┌────────────────┼────────────────┐                 │
│          │                │                │                 │
│     ┌────▼────┐     ┌────▼────┐     ┌────▼────┐             │
│     │  Auth   │     │  User   │     │  Order  │             │
│     │ Service │     │ Service │     │ Service │             │
│     │ :8001   │     │ :8002   │     │ :8003   │             │
│     └────┬────┘     └────┬────┘     └────┬────┘             │
│          │               │               │                   │
│     ┌────▼────┐     ┌────▼────┐     ┌────▼────┐             │
│     │ Auth DB │     │ User DB │     │Order DB │             │
│     │(MySQL)  │     │(MySQL)  │     │(Postgres)│            │
│     └─────────┘     └─────────┘     └─────────┘             │
│                                                              │
│     ┌──────────┐     ┌──────────┐     ┌──────────┐          │
│     │  Produk  │     │ Payment  │     │  Notif   │          │
│     │ Service  │     │ Service  │     │ Service  │          │
│     │ :8004    │     │ :8005    │     │ :8006    │          │
│     └────┬─────┘     └────┬─────┘     └────┬─────┘          │
│          │               │                │                  │
│     ┌────▼─────┐     ┌───▼──────┐    ┌────▼─────┐          │
│     │Produk DB │     │Payment DB│    │  Redis   │          │
│     │(MongoDB) │     │(MySQL)   │    │ (Queue)  │          │
│     └──────────┘     └──────────┘    └──────────┘          │
│                                                              │
│  Setiap Service:                                             │
│  - Codebase sendiri (bisa bahasa berbeda)                    │
│  - Database sendiri (bisa tipe berbeda)                      │
│  - Deploy independen                                         │
│  - Scale independen                                          │
│  - Tim sendiri (2-pizza rule)                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Kelebihan Microservices:**
- **Scale independen**: Service yang sibuk saja yang di-scale
- **Deploy independen**: Update satu service tidak affect yang lain
- **Tech stack bebas**: Setiap service bisa pakai bahasa/framework berbeda
- **Tim paralel**: Tim berbeda bisa kerja di service berbeda
- **Isolasi failure**: Satu service down tidak matikan semua
- **Organizational alignment**: Tim sesuai dengan business domain

**Kekurangan Microservices:**
- **Kompleksitas tinggi**: Distributed system jauh lebih kompleks
- **Network latency**: Komunikasi antar service via network
- **Data consistency**: Tidak ada ACID transaction antar service
- **Debugging sulit**: Trace request yang melewati banyak service
- **Infrastruktur berat**: Butuh service discovery, API Gateway, monitoring
- **Operational overhead**: Deploy, monitor, maintain banyak service

**Kapan Pakai Microservices:**
- Perusahaan besar dengan banyak tim
- Aplikasi kompleks dengan domain berbeda
- Butuh scale bagian tertentu secara independen
- Tim sudah berpengalaman dengan distributed systems
- Budget infrastruktur memadai

#### 6. Serverless Architecture

Serverless adalah pendekatan dimana Anda tidak manage server sama sekali. Code Anda berjalan di response to events, dan Anda hanya bayar saat code berjalan.

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVERLESS ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Trigger] → [Function] → [Response]                        │
│                                                              │
│  Trigger bisa berupa:                                        │
│  - HTTP Request (API Gateway)                                │
│  - File upload (S3 event)                                    │
│  - Database change (DynamoDB stream)                         │
│  - Message queue (SQS, Kafka)                                │
│  - Schedule/Cron (EventBridge)                               │
│  - Email received (SES)                                      │
│                                                              │
│  Contoh AWS Lambda:                                          │
│                                                              │
│  [HTTP Request] → [API Gateway] → [Lambda Function]          │
│                                          ↓                   │
│                                   [DynamoDB]                 │
│                                   [S3]                       │
│                                   [SNS]                      │
│                                                              │
│  KEUNTUNGAN:                                                 │
│  - Tidak perlu manage server                                 │
│  - Auto scaling (dari 0 ke ribuan instance)                  │
│  - Pay per use (hanya bayar saat function jalan)             │
│  - Deployment cepat (upload code saja)                       │
│                                                              │
│  KEKURANGAN:                                                 │
│  - Cold start latency (function pertama kali dipanggil)      │
│  - Time limit (max 15 menit di AWS Lambda)                   │
│  - Memory limit (max 10GB di AWS Lambda)                     │
│  - Vendor lock-in (terikat ke cloud provider)                │
│  - Debugging lebih sulit                                     │
│  - Testing lokal lebih kompleks                              │
│                                                              │
│  CONTOH SERVERLESS PLATFORM:                                 │
│  - AWS Lambda                                                │
│  - Google Cloud Functions                                    │
│  - Azure Functions                                           │
│  - Vercel Serverless Functions                               │
│  - Cloudflare Workers                                        │
│  - Netlify Functions                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Contoh AWS Lambda Function (Node.js):**

```javascript
// handler.js
exports.handler = async (event) => {
    // Parse input dari API Gateway
    const { nisn } = JSON.parse(event.body);

    // Query database
    const siswa = await getSiswaByNISN(nisn);

    if (!siswa) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Siswa tidak ditemukan' })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            nisn: siswa.nisn,
            nama: siswa.nama,
            kelas: siswa.kelas
        })
    };
};
```

---

### Service Decomposition Strategies — Memecah Monolith ke Microservices

Ketika aplikasi monolith sudah terlalu besar, Anda perlu memecahnya menjadi microservices. Ada beberapa strategi untuk melakukan decomposition:

#### 1. Decompose by Business Capability

Memecah berdasarkan kemampuan bisnis (what the business does).

```
┌─────────────────────────────────────────────────────────────┐
│              DECOMPOSE BY BUSINESS CAPABILITY                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Sebuah E-commerce memiliki business capabilities:           │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Order   │ │ Customer │ │  Product │ │ Payment  │       │
│  │Management│ │Management│ │Management│ │Management│       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│       ▼            ▼            ▼            ▼              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Order   │ │ Customer │ │  Product │ │ Payment  │       │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  Setiap service = satu business capability                   │
│  Setiap service punya tim sendiri                            │
│  Setiap service punya database sendiri                       │
│                                                              │
│  CONTOH SD Negeri Pasirhalang:                               │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Siswa   │ │   Guru   │ │ Keuangan │ │  Laporan │       │
│  │Management│ │Management│ │  (BOS)   │ │Management│       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│       ▼            ▼            ▼            ▼              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Siswa   │ │   Guru   │ │ Keuangan │ │  Laporan │       │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Decompose by Subdomain (Domain-Driven Design)

Memecah berdasarkan subdomain dari Domain-Driven Design (DDD).

```
┌─────────────────────────────────────────────────────────────┐
│              DECOMPOSE BY SUBDOMAIN (DDD)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Domain-Driven Design membagi domain menjadi:                │
│                                                              │
│  1. CORE DOMAIN (paling penting, competitive advantage)      │
│     - Ini yang membedakan bisnis Anda                       │
│     - Invest paling banyak resource di sini                 │
│                                                              │
│  2. SUPPORTING SUBDOMAIN (penting tapi bukan core)           │
│     - Mendukung core domain                                 │
│     - Bisa build sendiri atau beli                          │
│                                                              │
│  3. GENERIC SUBDOMAIN (umum, bisa pakai solusi existing)     │
│     - Authentication, email, payment gateway                │
│     - Lebih baik pakai solusi yang sudah ada                │
│                                                              │
│  CONTOH E-commerce:                                          │
│                                                              │
│  CORE DOMAIN:                                                │
│  - Product Catalog (katalog produk yang unik)                │
│  - Recommendation Engine (AI recommendation)                 │
│                                                              │
│  SUPPORTING SUBDOMAIN:                                       │
│  - Order Management                                          │
│  - Inventory Management                                      │
│  - Shipping                                                  │
│                                                              │
│  GENERIC SUBDOMAIN:                                          │
│  - Authentication (pakai Auth0/Cognito)                      │
│  - Payment (pakai Stripe/Midtrans)                           │
│  - Email (pakai SendGrid/Mailgun)                            │
│                                                              │
│  CONTOH SD Negeri Pasirhalang:                               │
│                                                              │
│  CORE DOMAIN:                                                │
│  - Manajemen Data Siswa (data siswa adalah inti)             │
│  - Sistem Penilaian (cara penilaian yang khas)               │
│                                                              │
│  SUPPORTING SUBDOMAIN:                                       │
│  - Absensi                                                   │
│  - Keuangan BOS                                              │
│  - Inventaris Sarpras                                        │
│                                                              │
│  GENERIC SUBDOMAIN:                                          │
│  - Authentication (pakai Firebase Auth)                      │
│  - Reporting (pakai library reporting)                       │
│  - Notification (pakai WhatsApp API)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Decompose by Data (Database per Service)

Memecah berdasarkan ownership data. Setiap service memiliki dan mengelola datanya sendiri.

```
┌─────────────────────────────────────────────────────────────┐
│              DECOMPOSE BY DATA                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRINSIP:                                                    │
│  - Setiap service punya database sendiri                     │
│  - Service lain TIDAK BOLEH akses database service lain      │
│  - Data sharing hanya via API                                │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ User Service │    │ Order Service│    │ Product Svc  │   │
│  │              │    │              │    │              │   │
│  │ ┌──────────┐ │    │ ┌──────────┐ │    │ ┌──────────┐ │   │
│  │ │ users    │ │    │ │ orders   │ │    │ │ products │ │   │
│  │ │ profiles │ │    │ │ items    │ │    │ │ categories│ │   │
│  │ │ sessions │ │    │ │ payments │ │    │ │ inventory│ │   │
│  │ └──────────┘ │    │ └──────────┘ │    │ └──────────┘ │   │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘   │
│         │                   │                   │           │
│    ┌────▼────┐         ┌────▼────┐         ┌────▼────┐      │
│    │ MySQL   │         │PostgreSQL│         │ MongoDB │      │
│    │         │         │          │         │         │      │
│    └─────────┘         └──────────┘         └─────────┘      │
│                                                              │
│  DATA SHARING:                                               │
│  - Order Service butuh data User? → Panggil User Service API │
│  - Order Service butuh data Product? → Panggil Product API   │
│  - TIDAK BOLEH: Order Service query User DB langsung         │
│                                                              │
│  KEUNTUNGAN:                                                 │
│  - Loose coupling (service independen)                       │
│  - Setiap service bisa pilih database yang cocok             │
│  - Schema evolution tidak affect service lain                │
│                                                              │
│  TANTANGAN:                                                  │
│  - Data consistency (tidak ada cross-service transaction)    │
│  - Perlu saga pattern untuk distributed transaction          │
│  - Data duplication mungkin diperlukan untuk performa        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### API Design — Mendesain Interface antar Service

API (Application Programming Interface) adalah cara service berkomunikasi satu sama lain. Ada beberapa paradigma API yang umum digunakan:

#### 1. REST (Representational State Transfer)

REST adalah paradigma API paling populer. Menggunakan HTTP methods dan resource-based URLs.

```
┌─────────────────────────────────────────────────────────────┐
│                    REST API DESIGN                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRINSIP REST:                                               │
│  - Resource-based (noun, bukan verb)                         │
│  - HTTP methods untuk operasi                                │
│  - Stateless (setiap request independen)                     │
│  - Uniform interface                                         │
│                                                              │
│  HTTP Methods:                                               │
│  ┌──────────┬─────────────────────────────────────────────┐ │
│  │ Method   │ Deskripsi                                   │ │
│  ├──────────┼─────────────────────────────────────────────┤ │
│  │ GET      │ Read data (safe, idempotent)                │ │
│  │ POST     │ Create data (tidak idempotent)              │ │
│  │ PUT      │ Update/replace data (idempotent)            │ │
│  │ PATCH    │ Partial update (tidak selalu idempotent)    │ │
│  │ DELETE   │ Delete data (idempotent)                    │ │
│  └──────────┴─────────────────────────────────────────────┘ │
│                                                              │
│  CONTOH REST API untuk SD Negeri Pasirhalang:                │
│                                                              │
│  Resource: Siswa                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Method │ URL                        │ Deskripsi         ││
│  ├────────┼────────────────────────────┼───────────────────┤│
│  │ GET    │ /api/v1/siswa              │ List semua siswa  ││
│  │ GET    │ /api/v1/siswa/{id}         │ Detail satu siswa ││
│  │ POST   │ /api/v1/siswa              │ Buat siswa baru   ││
│  │ PUT    │ /api/v1/siswa/{id}         │ Update siswa      ││
│  │ PATCH  │ /api/v1/siswa/{id}/kelas   │ Pindah kelas      ││
│  │ DELETE │ /api/v1/siswa/{id}         │ Hapus siswa       ││
│  └────────┴────────────────────────────┴───────────────────┘│
│                                                              │
│  Resource: Nilai                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Method │ URL                        │ Deskripsi         ││
│  ├────────┼────────────────────────────┼───────────────────┤│
│  │ GET    │ /api/v1/siswa/{id}/nilai   │ Nilai siswa X     ││
│  │ POST   │ /api/v1/siswa/{id}/nilai   │ Input nilai baru  ││
│  │ PUT    │ /api/v1/nilai/{id}         │ Update nilai      ││
│  └────────┴────────────────────────────┴───────────────────┘│
│                                                              │
│  RESPONSE FORMAT:                                            │
│  GET /api/v1/siswa/1                                         │
│                                                              │
│  Response 200 OK:                                            │
│  {                                                           │
│    "data": {                                                 │
│      "id": 1,                                                │
│      "nisn": "0012345678",                                   │
│      "nama": "Ahmad Fauzi",                                  │
│      "tanggal_lahir": "2014-05-15",                          │
│      "kelas": {                                              │
│        "id": 5,                                              │
│        "nama": "Kelas 5A"                                    │
│      },                                                      │
│      "orang_tua": {                                          │
│        "nama_ayah": "Budi Santoso",                          │
│        "nama_ibu": "Siti Aminah",                            │
│        "no_telepon": "081234567890"                          │
│      }                                                       │
│    }                                                         │
│  }                                                           │
│                                                              │
│  Response 404 Not Found:                                     │
│  {                                                           │
│    "error": {                                                │
│      "code": "SISWA_NOT_FOUND",                              │
│      "message": "Siswa dengan ID 1 tidak ditemukan"          │
│    }                                                         │
│  }                                                           │
│                                                              │
│  KEUNTUNGAN REST:                                            │
│  - Sederhana, mudah dipahami                                 │
│  - Browser support native                                    │
│  - Caching built-in (HTTP caching)                           │
│  - Tooling melimpah                                          │
│                                                              │
│  KEKURANGAN REST:                                            │
│  - Over-fetching (dapat data lebih dari yang dibutuhkan)     │
│  - Under-fetching (butuh multiple request)                   │
│  - Versioning bisa merepotkan                                │
│  - Tidak real-time (butuh polling untuk update)              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 2. GraphQL

GraphQL adalah query language untuk API yang memungkinkan client meminta data yang spesifik mereka butuhkan.

```
┌─────────────────────────────────────────────────────────────┐
│                    GRAPHQL API                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PERBEDAAN REST vs GraphQL:                                  │
│                                                              │
│  REST:                                                       │
│  GET /api/siswa/1        → dapat SEMUA field siswa          │
│  GET /api/siswa/1/kelas  → perlu request terpisah untuk kelas│
│  GET /api/siswa/1/nilai  → perlu request terpisah untuk nilai│
│  (3 requests, over-fetching di request pertama)              │
│                                                              │
│  GraphQL:                                                    │
│  POST /graphql dengan query:                                 │
│  query {                                                     │
│    siswa(id: 1) {                                            │
│      nama                                                    │
│      kelas { nama }                                          │
│      nilai(mapel: "Matematika") {                            │
│        angka                                                 │
│        huruf                                                 │
│      }                                                       │
│    }                                                         │
│  }                                                           │
│  (1 request, hanya data yang dibutuhkan)                     │
│                                                              │
│  GraphQL Schema:                                             │
│  type Siswa {                                                │
│    id: ID!                                                   │
│    nisn: String!                                             │
│    nama: String!                                             │
│    tanggalLahir: Date!                                       │
│    kelas: Kelas!                                             │
│    nilai(mapel: String): [Nilai!]                            │
│    orangTua: OrangTua                                        │
│  }                                                           │
│                                                              │
│  type Kelas {                                                │
│    id: ID!                                                   │
│    nama: String!                                             │
│    waliKelas: Guru                                           │
│    jumlahSiswa: Int                                          │
│  }                                                           │
│                                                              │
│  type Query {                                                │
│    siswa(id: ID!): Siswa                                     │
│    siswaByKelas(kelasId: ID!): [Siswa!]                      │
│    semuaSiswa(page: Int, limit: Int): [Siswa!]               │
│  }                                                           │
│                                                              │
│  type Mutation {                                             │
│    createSiswa(input: SiswaInput!): Siswa                    │
│    updateSiswa(id: ID!, input: SiswaInput!): Siswa           │
│    inputNilai(input: NilaiInput!): Nilai                     │
│  }                                                           │
│                                                              │
│  KEUNTUNGAN GraphQL:                                         │
│  - No over-fetching (dapat hanya yang dibutuhkan)            │
│  - No under-fetching (satu query untuk semua data)           │
│  - Strongly typed schema                                     │
│  - Self-documenting (introspection)                          │
│  - Evolusi API tanpa versioning                              │
│                                                              │
│  KEKURANGAN GraphQL:                                         │
│  - Kompleksitas (belajar query language baru)                │
│  - Caching lebih sulit (tidak pakai HTTP caching)            │
│  - N+1 query problem (perlu DataLoader)                      │
│  - Rate limiting lebih sulit                                 │
│  - Overkill untuk API sederhana                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3. gRPC (Google Remote Procedure Call)

gRPC adalah framework RPC high-performance yang menggunakan Protocol Buffers. Cocok untuk komunikasi antar microservices.

```
┌─────────────────────────────────────────────────────────────┐
│                    gRPC API                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  gRPC menggunakan:                                           │
│  - Protocol Buffers (protobuf) untuk definisi service        │
│  - HTTP/2 untuk transport                                    │
│  - Binary serialization (lebih kecil & cepat dari JSON)      │
│                                                              │
│  .proto file (definisi service):                             │
│  syntax = "proto3";                                          │
│                                                              │
│  service SiswaService {                                      │
│    rpc GetSiswa (SiswaRequest) returns (SiswaResponse);      │
│    rpc ListSiswa (ListRequest) returns (ListSiswaResponse);  │
│    rpc CreateSiswa (CreateSiswaRequest) returns (Siswa);     │
│    rpc StreamNilai (NilaiRequest) returns (stream Nilai);    │
│  }                                                           │
│                                                              │
│  message SiswaRequest {                                      │
│    int64 id = 1;                                             │
│  }                                                           │
│                                                              │
│  message Siswa {                                             │
│    int64 id = 1;                                             │
│    string nisn = 2;                                          │
│    string nama = 3;                                          │
│    string tanggal_lahir = 4;                                 │
│    string kelas = 5;                                         │
│  }                                                           │
│                                                              │
│  message SiswaResponse {                                     │
│    Siswa siswa = 1;                                          │
│  }                                                           │
│                                                              │
│  Client code (Python):                                       │
│  channel = grpc.insecure_channel('siswa-service:50051')      │
│  stub = SiswaServiceStub(channel)                            │
│  response = stub.GetSiswa(SiswaRequest(id=1))                │
│  print(response.siswa.nama)                                  │
│                                                              │
│  PERBANDINGAN API TYPES:                                     │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │ Aspek    │ REST     │ GraphQL  │ gRPC     │WebSocket │   │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤   │
│  │ Format   │ JSON/XML │ JSON     │ Protobuf │ JSON/Text│   │
│  │ Protocol │ HTTP/1-2 │ HTTP     │ HTTP/2   │ WS       │   │
│  │ Performa │ Sedang   │ Sedang   │ Tinggi   │ Tinggi   │   │
│  │ Tipe     │ External │ External │ Internal │ Realtime │   │
│  │ Learning │ Mudah    │ Sedang   │ Sedang   │ Mudah    │   │
│  │ Caching  │ Mudah    │ Sulit    │ Sulit    │ N/A      │   │
│  │ Browser  │ Native   │ Native   │ Perlu lib│ Native   │   │
│  │ Support  │          │          │          │          │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│                                                              │
│  KAPAN PAKAI APA:                                            │
│  - REST: Public API, browser client, simple CRUD             │
│  - GraphQL: Mobile app, complex data needs, flexible queries │
│  - gRPC: Internal microservices, high performance, streaming │
│  - WebSocket: Real-time features, chat, live updates         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 4. WebSocket — Real-Time Communication

WebSocket memungkinkan komunikasi dua arah (bidirectional) antara client dan server secara real-time.

```
┌─────────────────────────────────────────────────────────────┐
│                    WEBSOCKET                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  REST/HTTP:                                                  │
│  [Client] → Request → [Server] → Response                   │
│  [Client] → Request → [Server] → Response                   │
│  (Client harus selalu initiate, server tidak bisa push)      │
│                                                              │
│  WebSocket:                                                  │
│  [Client] ←──→ [Server]  (persistent connection)            │
│  (Kedua belah pihak bisa kirim kapan saja)                   │
│                                                              │
│  CONNECTION FLOW:                                            │
│  1. Client kirim HTTP request dengan Upgrade header          │
│     GET /ws HTTP/1.1                                         │
│     Upgrade: websocket                                       │
│     Connection: Upgrade                                      │
│     Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==             │
│                                                              │
│  2. Server respond dengan 101 Switching Protocols            │
│     HTTP/1.1 101 Switching Protocols                         │
│     Upgrade: websocket                                       │
│     Connection: Upgrade                                      │
│     Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=       │
│                                                              │
│  3. Connection upgrade ke WebSocket, bidirectional           │
│     Client → Server: {"type": "subscribe", "channel": "nilai"}│
│     Server → Client: {"type": "update", "data": {...}}       │
│     Server → Client: {"type": "update", "data": {...}}       │
│                                                              │
│  USE CASES:                                                  │
│  - Chat application                                          │
│  - Live notification (nilai baru diinput)                    │
│  - Real-time dashboard (monitoring)                          │
│  - Collaborative editing                                     │
│  - Live score/leaderboard                                    │
│  - Multiplayer game                                          │
│                                                              │
│  CONTOH (Node.js + ws library):                              │
│                                                              │
│  // Server                                                   │
│  const WebSocket = require('ws');                            │
│  const wss = new WebSocket.Server({ port: 8080 });           │
│                                                              │
│  wss.on('connection', (ws) => {                              │
│    ws.on('message', (message) => {                           │
│      const data = JSON.parse(message);                       │
│      // Broadcast ke semua client                            │
│      wss.clients.forEach((client) => {                       │
│        if (client.readyState === WebSocket.OPEN) {           │
│          client.send(JSON.stringify(data));                  │
│        }                                                     │
│      });                                                     │
│    });                                                       │
│  });                                                         │
│                                                              │
│  // Client (JavaScript)                                      │
│  const ws = new WebSocket('ws://localhost:8080');            │
│  ws.onmessage = (event) => {                                 │
│    const data = JSON.parse(event.data);                      │
│    console.log('Received:', data);                           │
│  };                                                          │
│  ws.send(JSON.stringify({ type: 'hello', message: 'Hi!' })); │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### API Versioning Strategies

Ketika API berkembang, Anda perlu melakukan perubahan yang mungkin breaking. API versioning memungkinkan Anda memperkenalkan perubahan tanpa merusak client yang sudah ada.

#### 1. URL Versioning (Paling Umum)

Versi API ada di URL path.

```
# Versi 1
GET /api/v1/siswa/
GET /api/v1/siswa/1

# Versi 2 (breaking change: field nama jadi nama_lengkap)
GET /api/v2/siswa/
GET /api/v2/siswa/1

# KEUNTUNGAN:
# - Mudah dilihat dan dipahami
# - Mudah di-cache (URL berbeda = cache berbeda)
# - Browser bisa akses langsung
# - Dokumentasi jelas

# KEKURANGAN:
# - URL tidak "clean"
# - Client harus update URL untuk upgrade versi
```

#### 2. Header Versioning

Versi API dikirim via custom header.

```
# Request
GET /api/siswa/
Accept: application/vnd.sekolah.v1+json

# atau
GET /api/siswa/
X-API-Version: 2

# KEUNTUNGAN:
# - URL tetap clean (/api/siswa/)
# - Versi tidak terlihat di URL
# - RESTful (URL merepresentasikan resource)

# KEKURANGAN:
# - Tidak bisa test langsung di browser
# - Caching lebih sulit
# - Client harus set header
```

#### 3. Query Parameter Versioning

Versi API dikirim sebagai query parameter.

```
GET /api/siswa/?version=1
GET /api/siswa/?version=2

# KEUNTUNGAN:
# - Mudah diimplementasi
# - Bisa test di browser
# - Flexible

# KEKURANGAN:
# - Query parameter seharusnya untuk filtering, bukan versioning
# - Bisa konflik dengan parameter lain
# - Tidak semantik
```

#### 4. Content Negotiation (Accept Header)

Menggunakan standard HTTP Accept header.

```
GET /api/siswa/
Accept: application/json; version=1

# atau
GET /api/siswa/
Accept: application/vnd.sekolah.v2+json

# KEUNTUNGAN:
# - Standard HTTP way
# - Clean URL
# - RESTful

# KEKURANGAN:
# - Kompleks untuk client
# - Tidak semua tooling support
```

#### Rekomendasi Versioning

```
┌─────────────────────────────────────────────────────────────┐
│                    REKOMENDASI VERSIONING                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Untuk Public API: URL Versioning (/api/v1/, /api/v2/)       │
│  - Paling mudah dipahami developer                           │
│  - Mudah dokumentasi                                         │
│  - Browser-friendly                                          │
│                                                              │
│  Untuk Internal API: Header Versioning                       │
│  - URL tetap clean                                           │
│  - Client internal bisa handle header                        │
│                                                              │
│  BEST PRACTICES:                                             │
│  1. Selalu support minimal 2 versi (current + previous)      │
│  2. Deprecate versi lama dengan notice (6-12 bulan)          │
│  3. Dokumentasikan breaking changes dengan jelas             │
│  4. Gunakan semantic versioning untuk API                    │
│  5. Non-breaking changes tidak perlu versi baru              │
│     - Tambah field baru = tidak breaking                     │
│     - Hapus field = breaking                                 │
│     - Ubah tipe data = breaking                              │
│                                                              │
│  CONTOH DEPRECATION FLOW:                                    │
│                                                              │
│  1. Release v2 (Januari 2026)                                │
│  2. v1 masih berfungsi, tambah deprecation header:           │
│     Deprecation: true                                        │
│     Sunset: Sat, 01 Jul 2026 00:00:00 GMT                   │
│     Link: </api/v2/siswa/>; rel="successor-version"          │
│  3. Notify semua client tentang deprecation                  │
│  4. Sunset v1 (Juli 2026) — return 410 Gone                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### API Documentation — OpenAPI/Swagger

Dokumentasi API yang baik sangat penting, terutama untuk microservices dimana banyak tim menggunakan API yang sama.

```
┌─────────────────────────────────────────────────────────────┐
│                    OPENAPI / SWAGGER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  OpenAPI Specification (OAS) adalah standard untuk           │
│  mendeskripsikan REST API dalam format machine-readable.     │
│                                                              │
│  CONTOH OpenAPI 3.0 (YAML):                                  │
│                                                              │
│  openapi: 3.0.3                                              │
│  info:                                                       │
│    title: SD Negeri Pasirhalang API                          │
│    description: API untuk manajemen data sekolah             │
│    version: 1.0.0                                            │
│    contact:                                                  │
│      name: Tim IT SD Negeri Pasirhalang                      │
│      email: it@sdnegeripasirhalang.sch.id                    │
│                                                              │
│  servers:                                                    │
│    - url: https://api.sekolah.sch.id/v1                      │
│      description: Production server                          │
│    - url: http://localhost:8080/v1                           │
│      description: Development server                         │
│                                                              │
│  paths:                                                      │
│    /siswa:                                                   │
│      get:                                                    │
│        summary: List semua siswa                             │
│        tags: [Siswa]                                         │
│        parameters:                                           │
│          - name: page                                        │
│            in: query                                         │
│            schema: { type: integer, default: 1 }             │
│          - name: limit                                       │
│            in: query                                         │
│            schema: { type: integer, default: 20, max: 100 }  │
│          - name: kelas_id                                    │
│            in: query                                         │
│            schema: { type: integer }                         │
│        responses:                                            │
│          '200':                                              │
│            description: List siswa berhasil                  │
│            content:                                          │
│              application/json:                               │
│                schema:                                       │
│                  type: object                                │
│                  properties:                                 │
│                    data:                                     │
│                      type: array                             │
│                      items:                                  │
│                        $ref: '#/components/schemas/Siswa'    │
│                    meta:                                     │
│                      $ref: '#/components/schemas/Pagination' │
│          '401':                                              │
│            description: Unauthorized                         │
│        security:                                             │
│          - bearerAuth: []                                    │
│                                                              │
│      post:                                                   │
│        summary: Buat siswa baru                              │
│        tags: [Siswa]                                         │
│        requestBody:                                          │
│          required: true                                      │
│          content:                                            │
│            application/json:                                 │
│              schema:                                         │
│                $ref: '#/components/schemas/CreateSiswaInput' │
│        responses:                                            │
│          '201':                                              │
│            description: Siswa berhasil dibuat                │
│            content:                                          │
│              application/json:                               │
│                schema:                                       │
│                  $ref: '#/components/schemas/Siswa'          │
│                                                              │
│    /siswa/{id}:                                              │
│      get:                                                    │
│        summary: Detail satu siswa                            │
│        tags: [Siswa]                                         │
│        parameters:                                           │
│          - name: id                                          │
│            in: path                                          │
│            required: true                                    │
│            schema: { type: integer }                         │
│        responses:                                            │
│          '200':                                              │
│            description: Detail siswa                         │
│            content:                                          │
│              application/json:                               │
│                schema:                                       │
│                  $ref: '#/components/schemas/SiswaDetail'    │
│          '404':                                              │
│            description: Siswa tidak ditemukan                │
│                                                              │
│  components:                                                 │
│    schemas:                                                  │
│      Siswa:                                                  │
│        type: object                                          │
│        required: [id, nisn, nama]                            │
│        properties:                                           │
│          id:                                                 │
│            type: integer                                     │
│          nisn:                                               │
│            type: string                                      │
│            pattern: '^[0-9]{10}$'                            │
│          nama:                                               │
│            type: string                                      │
│            maxLength: 100                                    │
│          tanggal_lahir:                                      │
│            type: string                                      │
│            format: date                                      │
│          kelas_id:                                           │
│            type: integer                                     │
│                                                              │
│      SiswaDetail:                                            │
│        allOf:                                                │
│          - $ref: '#/components/schemas/Siswa'                │
│          - type: object                                      │
│            properties:                                       │
│              kelas:                                          │
│                $ref: '#/components/schemas/Kelas'            │
│              orang_tua:                                      │
│                $ref: '#/components/schemas/OrangTua'         │
│              nilai:                                          │
│                type: array                                   │
│                items:                                        │
│                  $ref: '#/components/schemas/Nilai'          │
│                                                              │
│      Pagination:                                             │
│        type: object                                          │
│        properties:                                           │
│          current_page: { type: integer }                     │
│          per_page: { type: integer }                         │
│          total: { type: integer }                            │
│          last_page: { type: integer }                        │
│                                                              │
│    securitySchemes:                                          │
│      bearerAuth:                                             │
│        type: http                                            │
│        scheme: bearer                                        │
│        bearerFormat: JWT                                     │
│                                                              │
│  TOOLS:                                                      │
│  - Swagger UI: Generate interactive API docs dari OpenAPI    │
│  - Redoc: Alternative API documentation renderer             │
│  - Stoplight: Visual API design tool                         │
│  - Postman: Import OpenAPI untuk testing                     │
│  - Insomnia: Import OpenAPI untuk testing                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Service Orchestration vs Choreography

Dalam microservices, ada dua pola untuk mengkoordinasikan workflow antar service:

#### 1. Orchestration (Sentralisasi)

Sebuah **orchestrator** (central coordinator) mengontrol alur workflow dan memberi tahu setiap service apa yang harus dilakukan.

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌──────────────┐                          │
│                    │ ORCHESTRATOR │                          │
│                    │ (Saga Manager│                          │
│                    │  / Workflow  │                          │
│                    │  Engine)     │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│              ┌────────────┼────────────┐                     │
│              │            │            │                     │
│              ▼            ▼            ▼                     │
│        ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│        │  Order   │ │ Payment  │ │ Notif    │               │
│        │ Service  │ │ Service  │ │ Service  │               │
│        └──────────┘ └──────────┘ └──────────┘               │
│                                                              │
│  FLOW:                                                       │
│  1. Orchestrator terima request "Buat Order"                 │
│  2. Orchestrator panggil Order Service → buat order          │
│  3. Orchestrator panggil Payment Service → proses pembayaran │
│  4. Jika payment gagal → Orchestrator panggil Order Service  │
│     untuk cancel order (compensating transaction)            │
│  5. Jika payment sukses → Orchestrator panggil Notif Service │
│     untuk kirim notifikasi                                   │
│                                                              │
│  KEUNTUNGAN:                                                 │
│  - Alur workflow jelas (ada di satu tempat)                  │
│  - Mudah debugging (lihat log orchestrator)                  │
│  - Error handling terpusat                                   │
│  - Mudah monitoring progress workflow                        │
│                                                              │
│  KEKURANGAN:                                                 │
│  - Single point of failure (orchestrator down = semua stop)  │
│  - Orchestrator jadi kompleks (tahu semua service)           │
│  - Tight coupling antara orchestrator dan services           │
│                                                              │
│  TOOLS:                                                      │
│  - Temporal.io                                               │
│  - AWS Step Functions                                        │
│  - Camunda                                                   │
│  - Netflix Conductor                                         │
│  - Apache Airflow                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Choreography (Desentralisasi)

Setiap service berkomunikasi secara langsung melalui events. Tidak ada central coordinator — setiap service bereaksi terhadap events dari service lain.

```
┌─────────────────────────────────────────────────────────────┐
│                    CHOREOGRAPHY                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌──────────────┐                          │
│                    │  EVENT BUS   │                          │
│                    │  (Kafka/     │                          │
│                    │   RabbitMQ)  │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│              ┌────────────┼────────────┐                     │
│              │            │            │                     │
│              ▼            ▼            ▼                     │
│        ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│        │  Order   │ │ Payment  │ │ Notif    │               │
│        │ Service  │ │ Service  │ │ Service  │               │
│        └────┬─────┘ └────┬─────┘ └────┬─────┘               │
│             │            │            │                      │
│             └────────────┼────────────┘                      │
│                          │                                   │
│                   Publish Events                             │
│                                                              │
│  FLOW:                                                       │
│  1. Order Service buat order, publish event "OrderCreated"   │
│  2. Payment Service subscribe "OrderCreated", proses payment │
│     publish event "PaymentProcessed" atau "PaymentFailed"    │
│  3. Notif Service subscribe "PaymentProcessed", kirim notif  │
│  4. Order Service subscribe "PaymentFailed", cancel order    │
│                                                              │
│  KEUNTUNGAN:                                                 │
│  - Loose coupling (service tidak tahu service lain)          │
│  - Mudah tambah service baru (cukup subscribe event)         │
│  - Tidak ada single point of failure                         │
│  - Scalable (setiap service independen)                      │
│                                                              │
│  KEKURANGAN:                                                 │
│  - Alur workflow tersebar (sulit dipahami keseluruhan)       │
│  - Debugging sulit (trace event across services)             │
│  - Risk of event storm (circular events)                     │
│  - Error handling kompleks (saga pattern manual)             │
│                                                              │
│  TOOLS:                                                      │
│  - Apache Kafka                                              │
│  - RabbitMQ                                                  │
│  - AWS EventBridge                                           │
│  - Google Pub/Sub                                            │
│  - Redis Streams                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Kapan Pakai Orchestration vs Choreography?

| Kriteria | Orchestration | Choreography |
|---|---|---|
| **Kompleksitas workflow** | Tinggi (banyak langkah) | Rendah-sedang |
| **Jumlah service** | Sedikit | Banyak |
| **Error handling** | Butuh compensating transaction | Event-driven recovery |
| **Debugging** | Penting (butuh visibility) | Bisa sacrifice |
| **Tim structure** | Centralized team | Decentralized teams |
| **Change frequency** | Workflow sering berubah | Workflow stabil |

---

### Application Layer Scaling — Scaling Application Layer

Ketika traffic meningkat, application layer perlu di-scale. Ada beberapa strategi:

#### 1. Stateless Design

Aplikasi stateless tidak menyimpan state di server. Setiap request independen dan mengandung semua informasi yang dibutuhkan.

```
┌─────────────────────────────────────────────────────────────┐
│                    STATELESS DESIGN                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATEFUL (tidak ideal untuk scaling):                       │
│  [Client] → [Server A] → Session disimpan di Server A        │
│  [Client] → [Server B] → ❌ Session tidak ada di Server B!   │
│                                                              │
│  STATELESS (ideal untuk scaling):                            │
│  [Client] → [Server A] → Session di Redis (shared)           │
│  [Client] → [Server B] → Session di Redis (shared) ✅        │
│  [Client] → [Server C] → Session di Redis (shared) ✅        │
│                                                              │
│  CARA MEMBUAT STATELESS:                                     │
│  1. Simpan session di external store (Redis, Memcached)      │
│  2. Gunakan JWT (JSON Web Token) untuk authentication        │
│  3. Jangan simpan state di memory server                    │
│  4. Semua data yang dibutuhkan disertakan di request         │
│                                                              │
│  CONTOH JWT (stateless authentication):                      │
│                                                              │
│  // Login → server return JWT                                │
│  POST /api/login                                             │
│  { "username": "admin", "password": "secret" }               │
│                                                              │
│  Response:                                                   │
│  {                                                           │
│    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",      │
│    "expires_in": 3600                                        │
│  }                                                           │
│                                                              │
│  // Request berikutnya → client kirim JWT di header          │
│  GET /api/siswa                                              │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  │
│                                                              │
│  // Server verify JWT (tidak perlu query database)           │
│  - Decode JWT                                                │
│  - Verify signature                                          │
│  - Extract user info dari payload                            │
│  - Process request                                           │
│                                                              │
│  KEUNTUNGAN STATELESS:                                       │
│  - Mudah scale horizontal (tambah server kapan saja)         │
│  - Tidak ada session affinity/sticky session needed          │
│  - Server bisa restart tanpa kehilangan session              │
│  - Load balancing lebih sederhana                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Session Management

Jika Anda harus menyimpan session, ada beberapa pendekatan:

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION MANAGEMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  OPSI 1: Session di Redis/Memcached (Recommended)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Server A │  │ Server B │  │ Server C │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       │             │             │                          │
│       └─────────────┼─────────────┘                          │
│                     ▼                                        │
│              ┌──────────────┐                                │
│              │    Redis     │ ← Session disimpan di sini     │
│              │  (shared)    │   Semua server bisa akses      │
│              └──────────────┘                                │
│                                                              │
│  OPSI 2: Sticky Session (Session Affinity)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Server A │  │ Server B │  │ Server C │                  │
│  │ Session: │  │ Session: │  │ Session: │                  │
│  │ User 1,3 │  │ User 2,4 │  │ User 5,6 │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│       ↑             ↑             ↑                          │
│       │             │             │                          │
│  Load Balancer dengan sticky session (IP hash / cookie)      │
│  User 1 selalu ke Server A                                   │
│  User 2 selalu ke Server B                                   │
│                                                              │
│  OPSI 3: JWT (Stateless, No Session Storage)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Server A │  │ Server B │  │ Server C │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│       │             │             │                          │
│       └─────────────┼─────────────┘                          │
│                     │                                        │
│              Session ada di JWT token (client side)          │
│              Server hanya verify signature                   │
│                                                              │
│  PERBANDINGAN:                                               │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │ Aspek    │ Redis    │ Sticky   │ JWT      │              │
│  ├──────────┼──────────┼──────────┼──────────┤              │
│  │ Scalability│ Tinggi │ Sedang   │ Tinggi   │              │
│  │ Complexity│ Sedang  │ Rendah   │ Rendah   │              │
│  │ Failover  │ Perlu HA│ Sulit    │ Mudah    │              │
│  │ Revocation│ Mudah   │ Mudah    │ Sulit    │              │
│  │ Storage   │ External│ In-memory│ Client   │              │
│  │ Size limit│ Besar   │ Besar    │ Kecil    │              │
│  └──────────┴──────────┴──────────┴──────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Horizontal Scaling

Menambah jumlah server (scale out) daripada meningkatkan spesifikasi satu server (scale up).

```
┌─────────────────────────────────────────────────────────────┐
│                    HORIZONTAL SCALING                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SCALE UP (Vertical):                                        │
│  [1 Server: 4 CPU, 16GB RAM] → [1 Server: 16 CPU, 64GB RAM] │
│  - Lebih mahal                                               │
│  - Ada batas maksimal hardware                               │
│  - Single point of failure                                   │
│  - Downtime saat upgrade                                     │
│                                                              │
│  SCALE OUT (Horizontal):                                     │
│  [1 Server] → [2 Server] → [4 Server] → [8 Server]          │
│  - Lebih murah (commodity hardware)                          │
│  - Tidak ada batas teoritis                                  │
│  - High availability (redundancy)                            │
│  - Zero downtime scaling                                     │
│                                                              │
│  ARSITEKTUR HORIZONTAL SCALING:                              │
│                                                              │
│                    ┌──────────────┐                          │
│                    │  Load Balancer│                          │
│                    │  (Nginx/ALB)  │                          │
│                    └──────┬───────┘                          │
│                           │                                  │
│     ┌─────────────┬───────┼───────┬─────────────┐            │
│     ▼             ▼       ▼       ▼             ▼            │
│  ┌─────┐      ┌─────┐ ┌─────┐ ┌─────┐      ┌─────┐         │
│  │App-1│      │App-2│ │App-3│ │App-4│ ...  │App-N│         │
│  └──┬──┘      └──┬──┘ └──┬──┘ └──┬──┘      └──┬──┘         │
│     │            │       │       │            │              │
│     └────────────┼───────┼───────┼────────────┘              │
│                  ▼       ▼       ▼                           │
│           ┌─────────────────────────────┐                    │
│           │    Shared Resources         │                    │
│           │  - Database (RDS/Cloud SQL) │                    │
│           │  - Redis (ElastiCache)      │                    │
│           │  - File Storage (S3)        │                    │
│           └─────────────────────────────┘                    │
│                                                              │
│  AUTO SCALING (Cloud):                                       │
│  - AWS Auto Scaling Group                                    │
│  - Google Cloud Instance Groups                              │
│  - Azure Virtual Machine Scale Sets                          │
│  - Kubernetes Horizontal Pod Autoscaler (HPA)                │
│                                                              │
│  Auto Scaling berdasarkan:                                   │
│  - CPU utilization (> 70% → tambah instance)                 │
│  - Memory usage (> 80% → tambah instance)                    │
│  - Request count per target                                  │
│  - Custom metrics (queue length, response time)              │
│  - Schedule (tambah instance jam sibuk)                      │
│                                                              │
│  CONTOH Kubernetes HPA:                                      │
│                                                              │
│  apiVersion: autoscaling/v2                                  │
│  kind: HorizontalPodAutoscaler                               │
│  metadata:                                                   │
│    name: siswa-service-hpa                                   │
│  spec:                                                       │
│    scaleTargetRef:                                           │
│      apiVersion: apps/v1                                     │
│      kind: Deployment                                        │
│      name: siswa-service                                     │
│    minReplicas: 2                                            │
│    maxReplicas: 10                                           │
│    metrics:                                                  │
│    - type: Resource                                          │
│      resource:                                               │
│        name: cpu                                             │
│        target:                                               │
│          type: Utilization                                   │
│          averageUtilization: 70                              │
│    - type: Resource                                          │
│      resource:                                               │
│        name: memory                                          │
│        target:                                               │
│          type: Utilization                                   │
│          averageUtilization: 80                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 CONTOH NYATA

### Contoh 1: Gojek — Dari Monolith ke Microservices

**Awal (2015): Monolith**
- Satu aplikasi untuk semua layanan (ojek, food, payment)
- Satu codebase, satu database, satu deploy

**Masalah yang Muncul:**
- Deploy fitur ojek harus update semua fitur lain
- Bagian payment error → semua fitur error
- Tidak bisa scale hanya bagian yang sibuk (GoFood saat jam makan)
- Tim besar (100+ developer) sulit kerja di satu codebase

**Solusi: Microservices (sekarang 100+ services)**
```
┌─────────────────────────────────────────────────────────────┐
│                    GOJEK MICROSERVICES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [User App] → [API Gateway] → [GoRide Service]               │
│                            → [GoFood Service]                │
│                            → [GoPay Service]                 │
│                            → [GoSend Service]                │
│                            → [GoMart Service]                │
│                            → [Notification Service]          │
│                            → [Search Service]                │
│                            → [Recommendation Service]        │
│                            → [100+ services lainnya]         │
│                                                              │
│  Setiap service:                                             │
│  - Tim dedicated (2-pizza rule)                              │
│  - Tech stack sesuai kebutuhan                               │
│  - Database sendiri                                          │
│  - Deploy independen (beberapa kali sehari)                  │
│  - Scale independen (GoFood scale saat jam makan)            │
│                                                              │
│  Infrastruktur:                                              │
│  - Kubernetes untuk orchestration                            │
│  - Kafka untuk event streaming                               │
│  - Redis untuk caching                                       │
│  - PostgreSQL & MongoDB untuk database                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Contoh 2: Tokopedia — Evolusi Application Layer

**Fase 1: Monolith (PHP)**
- Satu aplikasi PHP besar
- Database MySQL shared
- Tim kecil, fitur sederhana

**Fase 2: Service-Oriented (PHP + Java)**
- Mulai pecah berdasarkan domain
- User service, Product service, Order service
- Tapi masih shared database

**Fase 3: Microservices (Go, Java, Node.js)**
- Setiap service punya database sendiri
- Polyglot (Go untuk high-throughput, Java untuk enterprise, Node.js untuk BFF)
- Kubernetes untuk orchestration
- Event-driven dengan Kafka

### Contoh 3: Aplikasi Sekolah — Tetap Monolith (Untuk Sekarang)

**Kenapa Monolith:**
- Developer: 1-2 orang (Anda sendiri)
- Fitur: absensi, nilai, laporan, BOS — relatif sederhana
- Scale: maksimal 1000 pengguna
- Budget: terbatas
- Waktu: lebih cepat bangun monolith

**Struktur Monolith yang Baik:**
```
sdnegeri-app/
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication & Authorization
│   │   ├── siswa/          # Manajemen Data Siswa
│   │   ├── guru/           # Manajemen Data Guru
│   │   ├── kelas/          # Manajemen Rombel/Kelas
│   │   ├── absensi/        # Absensi Harian
│   │   ├── nilai/          # Input & Laporan Nilai
│   │   ├── keuangan-bos/   # Perencanaan & Realisasi BOS
│   │   ├── sarpras/        # Sarana & Prasarana
│   │   └── laporan/        # Generate Laporan
│   ├── shared/             # Shared utilities
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── helpers/
│   └── app.js
├── database/
│   ├── migrations/
│   └── seeders/
├── tests/
├── public/                 # Static files
└── config/
```

**Kapan Migrasi ke Microservices?**
- Ketika tim sudah > 10 developer
- Ketika traffic > 10.000 concurrent users
- Ketika deploy monolith sudah > 30 menit
- Ketika fitur sudah sangat kompleks

---

## 💡 PRAKTIK

### Latihan 1: Desain Application Layer

Desain application layer untuk aplikasi perpustakaan sekolah dengan fitur:
- Manajemen buku (CRUD, kategori, stok)
- Peminjaman & pengembalian
- Denda keterlambatan
- Laporan bulanan
- Notifikasi via WhatsApp

Tentukan:
1. Pattern apa yang digunakan (MVC/MVP/MVVM)?
2. Monolith atau microservices?
3. API design (REST/GraphQL)?
4. Session management approach?
5. Bagaimana scaling strategy?

### Latihan 2: Decompose Monolith

Anda punya monolith e-commerce dengan module:
- User management
- Product catalog
- Shopping cart
- Order processing
- Payment
- Shipping
- Review & rating
- Admin dashboard
- Reporting

Decompose menjadi microservices menggunakan:
1. Business capability approach
2. Subdomain approach (DDD)
3. Data ownership approach

### Latihan 3: API Design

Buat OpenAPI specification untuk:
- API manajemen siswa (CRUD)
- API input nilai
- API laporan BOS

Include: request/response schema, error handling, authentication, pagination.

### Latihan 4: Pilih Orchestration vs Choreography

Untuk workflow "Pendaftaran Siswa Baru":
1. Validasi data → 2. Buat akun → 3. Assign kelas → 4. Kirim welcome email → 5. Generate kartu siswa

Pilih orchestration atau choreography? Jelaskan alasan dan desain flow-nya.

---

## ✅ CHECKLIST

- [ ] Bisa menjelaskan apa itu application layer dan posisinya dalam arsitektur
- [ ] Paham 6 application layer patterns (Monolith, MVC, MVP, MVVM, Microservices, Serverless)
- [ ] Bisa menentukan kapan pakai monolith vs microservices
- [ ] Paham service decomposition strategies (by capability, by subdomain, by data)
- [ ] Bisa mendesain REST API yang baik (resource-based, HTTP methods, response format)
- [ ] Paham perbedaan REST, GraphQL, gRPC, dan WebSocket
- [ ] Bisa memilih API type yang tepat untuk use case tertentu
- [ ] Paham API versioning strategies dan best practices
- [ ] Bisa menulis OpenAPI/Swagger specification
- [ ] Paham perbedaan orchestration vs choreography
- [ ] Bisa menentukan kapan pakai orchestration vs choreography
- [ ] Paham stateless design dan keuntungannya untuk scaling
- [ ] Bisa memilih session management approach yang tepat
- [ ] Paham horizontal scaling dan auto scaling
- [ ] Paham bahwa monolith bukan "jahat" — tergantung konteks dan kebutuhan

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Application Layer](https://github.com/donnemartin/system-design-primer#application-layer)
- **Martin Fowler — Microservices:** [https://martinfowler.com/microservices/](https://martinfowler.com/microservices/)
- **Microservices.io Patterns:** [https://microservices.io/patterns/index.html](https://microservices.io/patterns/index.html)
- **OpenAPI Specification:** [https://swagger.io/specification/](https://swagger.io/specification/)
- **GraphQL Documentation:** [https://graphql.org/learn/](https://graphql.org/learn/)
- **gRPC Documentation:** [https://grpc.io/docs/](https://grpc.io/docs/)
- **Domain-Driven Design:** [https://martinfowler.com/bliki/DomainDrivenDesign.html](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- **12 Factor App:** [https://12factor.net/](https://12factor.net/)

---

> **Lanjut ke:** [`12-database-rdbms.md`](./12-database-rdbms.md)
