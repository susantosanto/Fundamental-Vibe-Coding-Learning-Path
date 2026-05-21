# 01 — Microservices Deep Dive

> **Estimasi:** 4-6 jam | **Level:** Advanced
> **Sumber:**
> - [donnemartin/system-design-primer — Application Layer](https://github.com/donnemartin/system-design-primer#application-layer)
> - [microservices.io](https://microservices.io)
> - [Martin Fowler — Microservices](https://martinfowler.com/articles/microservices.html)
> - [Chris Richardson — Microservices Patterns](https://www.manning.com/books/microservices-patterns)

---

## 📖 TEORI

### 1. Apa Itu Microservices?

Microservices adalah **arsitektur perangkat lunak** yang menyusun aplikasi sebagai **kumpulan service kecil** yang:

- **Independen** — setiap service bisa di-deploy, di-scale, dan di-maintain secara terpisah
- **Bisnis-oriented** — setiap service bertanggung jawab atas satu kemampuan bisnis (business capability)
- **Otonom** — setiap service memiliki database sendiri dan tidak berbagi database dengan service lain
- **Terdistribusi** — service berkomunikasi melalui network (HTTP/REST, gRPC, message queue)
- **Decentralized Governance** — setiap tim bisa memilih tech stack yang paling cocok untuk service mereka
- **Resilient** — kegagalan satu service tidak menyebabkan kegagalan seluruh sistem
- **Evolvable** — service bisa di-refactor atau diganti tanpa mempengaruhi service lain

**Sejarah Singkat:**

Istilah "microservices" pertama kali dipopulerkan oleh **Martin Fowler** dan **James Lewis** dalam artikel seminal mereka tahun 2014. Konsep ini lahir dari kebutuhan perusahaan besar (Netflix, Amazon, eBay) yang tidak bisa lagi mengelola monolith raksasa mereka. Netflix mengalami outage besar tahun 2008 karena database corruption di monolith mereka, yang memicu migrasi total ke microservices di AWS.

**Prinsip Utama Microservices:**

1. **Single Responsibility Principle** — setiap service melakukan SATU hal dan melakukannya dengan baik
2. **Bounded Context** (Domain-Driven Design) — batas service mengikuti batas domain bisnis
3. **Database per Service** — tidak ada shared database antar service
4. **Smart Endpoints, Dumb Pipes** — logika bisnis ada di service, bukan di message bus
5. **Decentralized Data Management** — setiap service mengelola datanya sendiri
6. **Infrastructure Automation** — CI/CD, containerization, orchestration adalah keharusan
7. **Design for Failure** — asumsikan network akan gagal, service akan down, dan latensi akan tinggi

```
┌─────────────────────────────────────────────────────────────┐
│                    MONOLITH ARCHITECTURE                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Single Application (WAR/JAR)            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │   User   │ │  Order   │ │ Payment  │ │Inventory│ │   │
│  │  │  Module  │ │  Module  │ │  Module  │ │ Module  │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  │                                                     │   │
│  │              ┌──────────────────┐                   │   │
│  │              │  Single Database │                   │   │
│  │              └──────────────────┘                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Scale: Clone seluruh aplikasi (scale as a unit)           │
│  Deploy: Semua module deploy bersamaan                      │
│  Tech Stack: Harus seragam                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  MICROSERVICES ARCHITECTURE                  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │  Order   │  │ Payment  │  │Inventory │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  │          │  │          │  │          │  │          │   │
│  │ [User DB]│  │[Order DB]│  │[Paym DB] │  │[Inv DB]  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │              │             │             │         │
│       └──────────────┴─────┬───────┴─────────────┘         │
│                            │                               │
│                   ┌────────┴────────┐                      │
│                   │   API Gateway   │                      │
│                   └────────┬────────┘                      │
│                            │                               │
│                    ┌───────┴───────┐                       │
│                    │    Client     │                       │
│                    └───────────────┘                       │
│                                                             │
│  Scale: Scale per service sesuai kebutuhan                 │
│  Deploy: Deploy independen, tidak mengganggu service lain  │
│  Tech Stack: Setiap service bisa pakai tech berbeda        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Monolith vs Microservices — Perbandingan Mendalam

#### 2.1 Definisi Monolith

**Monolithic architecture** adalah pendekatan tradisional di mana seluruh aplikasi dibangun sebagai **satu unit tunggal**. Semua modul (user, order, payment, inventory) ada dalam satu codebase, satu proses, satu database.

#### 2.2 Kapan Memilih Monolith?

Monolith BUKAN pilihan yang salah. Monolith tepat ketika:

- **Tim kecil** (< 10 developer) — komunikasi mudah, koordinasi sederhana
- **Startup early stage** — perlu validasi produk cepat, belum tahu scale pattern
- **Aplikasi sederhana** — CRUD basic, tidak ada kompleksitas domain
- **Time-to-market kritis** — perlu launch dalam minggu, bukan bulan
- **Budget terbatas** — tidak ada resource untuk infrastruktur distributed
- **Domain belum jelas** — belum tahu bounded context yang tepat

**Contoh nyata:** Banyak startup sukses dimulai dengan monolith. Instagram berjalan dengan Django monolith selama bertahun-tahun sebelum mencapai ratusan juta user. Twitter juga dimulai dengan Ruby on Rails monolith.

#### 2.3 Kapan Memilih Microservices?

Microservices tepat ketika:

- **Tim besar** (> 20 developer) — monolith menjadi bottleneck development
- **Multiple teams** — setiap tim butuh deploy independen
- **Complex domain** — banyak bounded context yang jelas
- **Different scaling needs** — beberapa bagian butuh scale lebih dari yang lain
- **Polyglot requirement** — bagian berbeda butuh tech stack berbeda
- **High availability** — fault isolation menjadi kritikal
- **Organizational maturity** — sudah punya DevOps culture dan automation

#### 2.4 Perbandingan Detail

| Aspek | Monolith | Microservices |
|---|---|---|
| **Codebase** | Satu codebase besar | Banyak codebase kecil |
| **Deployment** | Satu deploy untuk semua | Deploy independen per service |
| **Scalability** | Scale seluruh aplikasi | Scale per service sesuai kebutuhan |
| **Tech Stack** | Harus seragam | Polyglot — setiap service bisa beda tech |
| **Database** | Single shared database | Database per service |
| **Development Speed** | Cepat di awal, melambat seiring waktu | Konsisten, tapi butuh setup awal |
| **Complexity** | Simple di awal, kompleks saat grow | Kompleks dari awal, manageable saat grow |
| **Fault Isolation** | Satu bug bisa crash seluruh app | Satu service down, yang lain tetap jalan |
| **Testing** | Testing lebih mudah (in-process) | Testing lebih kompleks (distributed) |
| **Debugging** | Mudah (single process, single log) | Sulit (distributed tracing needed) |
| **Team Structure** | Satu tim besar | Multiple tim kecil (2-pizza rule) |
| **Data Consistency** | ACID transactions (mudah) | Eventual consistency (kompleks) |
| **Network** | In-process calls (cepat) | Network calls (latency, failure possible) |
| **Operational Overhead** | Rendah | Tinggi (orchestration, monitoring) |
| **CI/CD** | Pipeline sederhana | Pipeline per service, lebih kompleks |
| **Memory Usage** | Shared memory, efisien | Setiap service punya overhead sendiri |
| **Startup Time** | Sekali startup | Banyak service, startup lebih lama total |

#### 2.5 The Monolith-First Approach

**Martin Fowler** dan banyak praktisi merekomendasikan **"monolith first"**:

> "Don't start with microservices. Start with a monolith, keep it modular, and split when you feel the pain."

Alasannya:
1. **Bounded context belum jelas** di awal — salah split = distributed monolith (worst of both worlds)
2. **Infrastructure overhead** microservices signifikan — butuh container orchestration, service mesh, monitoring
3. **Organizational readiness** — tim perlu maturity dalam DevOps, automation, dan distributed systems

#### 2.6 Migration Strategy: Monolith → Microservices

Migrasi dari monolith ke microservices adalah proses **incremental**, bukan big bang. Berikut strategi step-by-step:

**Step 1: Identifikasi Bounded Context**
- Analisis domain bisnis
- Identifikasi modul yang loosely coupled
- Tentukan boundary yang natural

```
Monolith Saat Ini:
┌──────────────────────────────────────────────┐
│                 MONOLITH                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │
│  │  User   │ │  Order  │ │    Payment      │ │
│  │ Module  │ │ Module  │ │    Module       │ │
│  └─────────┘ └─────────┘ └─────────────────┘ │
│         │           │              │          │
│         └───────────┴──────────────┘          │
│                    │                          │
│           ┌────────┴────────┐                 │
│           │  Shared Database │                 │
│           └─────────────────┘                 │
└──────────────────────────────────────────────┘
```

**Step 2: Strangler Fig Pattern**
- Buat service baru di samping monolith
- Route traffic perlahan ke service baru
- Hapus modul lama dari monolith secara bertahap

```
Strangler Fig Pattern:
                    ┌──────────┐
                    │  Client  │
                    └────┬─────┘
                         │
                    ┌────┴─────┐
                    │  Proxy   │  ← API Gateway / Load Balancer
                    │ /Router  │
                    └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
              ▼          ▼          ▼
        ┌──────────┐ ┌────────┐ ┌──────────┐
        │ Monolith │ │  New   │ │   New    │
        │ (sisa)   │ │ Service│ │  Service │
        │          │ │   A    │ │    B     │
        └──────────┘ └────────┘ └──────────┘
```

**Step 3: Extract Database**
- Duplikasi data dari shared database ke database service baru
- Implementasi dual-write atau CDC (Change Data Capture)
- Verifikasi konsistensi data
- Switch read ke database baru, lalu switch write

**Step 4: Extract Service**
- Pindahkan logic dari monolith ke service baru
- Implementasi API contract
- Test thoroughly
- Switch traffic secara bertahap (canary deployment)

**Step 5: Repeat**
- Ulangi proses untuk modul berikutnya
- Prioritaskan modul yang paling sering berubah atau butuh scale berbeda

**Timeline Realistis:**
- Fase 1 (bulan 1-3): Setup infrastructure, extract 1-2 service paling sederhana
- Fase 2 (bulan 4-6): Extract 3-5 service, setup monitoring dan observability
- Fase 3 (bulan 7-12): Extract service kompleks, optimize communication patterns
- Fase 4 (bulan 12+): Refine, optimize, handle edge cases

---

### 3. Microservices Design Patterns

#### 3.1 Database per Service Pattern

**Masalah:** Di monolith, semua modul berbagi satu database. Di microservices, ini menciptakan tight coupling.

**Solusi:** Setiap service memiliki database sendiri yang tidak bisa diakses langsung oleh service lain.

```
Database per Service:

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  User Service │     │ Order Service │     │ Pay Service  │
  │              │     │              │     │              │
  │  ┌────────┐  │     │  ┌────────┐  │     │  ┌────────┐  │
  │  │  API   │  │     │  │  API   │  │     │  │  API   │  │
  │  └───┬────┘  │     │  └───┬────┘  │     │  └───┬────┘  │
  │      │       │     │      │       │     │      │       │
  │  ┌───┴────┐  │     │  ┌───┴────┐  │     │  ┌───┴────┐  │
  │  │ User DB│  │     │  │Order DB│  │     │  │ Pay DB │  │
  │  │(Postgre│  │     │  │ (Mongo)│  │     │  │(MySQL) │  │
  │  │   s)   │  │     │  │        │  │     │  │        │  │
  │  └────────┘  │     │  └────────┘  │     │  └────────┘  │
  └──────────────┘     └──────────────┘     └──────────────┘
```

**Keuntungan:**
- Loose coupling — perubahan schema tidak mempengaruhi service lain
- Polyglot persistence — pilih database yang cocok untuk setiap use case
- Independent scaling — database bisa di-scale sesuai kebutuhan service

**Kerugian:**
- Distributed transactions menjadi kompleks
- Data duplication mungkin diperlukan
- Query lintas service membutuhkan API composition atau CQRS

**Kapan Pakai:**
- SELALU di microservices — ini adalah pattern fundamental
- Pilih database berdasarkan access pattern: relational untuk transaksi, document untuk flexible schema, graph untuk relationship-heavy, time-series untuk metrics

#### 3.2 API Gateway Pattern

**Masalah:** Client perlu berkomunikasi dengan banyak service secara langsung. Ini menciptakan coupling dan complexity di client side.

**Solusi:** API Gateway menjadi single entry point untuk semua client request.

```
API Gateway Pattern:

         ┌─────────────────────────────────────────────┐
         │                  CLIENTS                     │
         │   Web App    │   Mobile App   │   Partner   │
         └──────┬───────┴───────┬────────┴──────┬──────┘
                │               │               │
                └───────┬───────┴───────┬───────┘
                        │               │
                   ┌────┴───────────────┴────┐
                   │      API GATEWAY         │
                   │                          │
                   │  • Authentication        │
                   │  • Rate Limiting         │
                   │  • Load Balancing        │
                   │  • Request Routing       │
                   │  • Response Aggregation  │
                   │  • SSL Termination       │
                   │  • CORS Handling         │
                   └────┬──────┬──────┬───────┘
                        │      │      │
              ┌─────────┘      │      └─────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │   User   │    │  Order   │    │ Payment  │
        │ Service  │    │ Service  │    │ Service  │
        └──────────┘    └──────────┘    └──────────┘
```

**Tanggung Jawab API Gateway:**
1. **Routing** — mengarahkan request ke service yang tepat
2. **Authentication & Authorization** — validasi token sebelum forward ke service
3. **Rate Limiting** — mencegah abuse dan overload
4. **Load Balancing** — distribusikan traffic ke multiple instance
5. **Response Aggregation** — gabungkan response dari multiple service
6. **Protocol Translation** — convert HTTP ke gRPC, GraphQL, dll
7. **Caching** — cache response yang sering diminta
8. **Circuit Breaking** — prevent cascading failure

**Backend for Frontend (BFF) Pattern:**
Variasi dari API Gateway di mana setiap client type punya gateway sendiri:

```
BFF Pattern:

  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │  Web    │     │ Mobile  │     │  IoT    │
  │ Client  │     │ Client  │     │ Client  │
  └────┬────┘     └────┬────┘     └────┬────┘
       │               │               │
  ┌────┴────┐     ┌────┴────┐     ┌────┴────┐
  │ Web BFF │     │Mob BFF  │     │ IoT BFF │
  └────┬────┘     └────┬────┘     └────┬────┘
       │               │               │
       └───────┬───────┴───────┬───────┘
               │               │
        ┌──────┴──────┐ ┌──────┴──────┐
        │   User Svc  │ │  Order Svc  │
        └─────────────┘ └─────────────┘
```

**Tools Populer:**
- **Kong** — API gateway berbasis Nginx, plugin ecosystem
- **Envoy** — High-performance proxy, basis dari Istio service mesh
- **AWS API Gateway** — Managed service di AWS
- **Traefik** — Cloud-native edge router
- **Zuul** — Netflix's API gateway (legacy, sekarang pakai Envoy)

#### 3.3 Circuit Breaker Pattern

**Masalah:** Ketika service A memanggil service B yang down, request akan timeout dan menumpuk. Ini bisa menyebabkan cascading failure ke seluruh sistem.

**Solusi:** Circuit Breaker memutus koneksi ke service yang gagal, memberikan waktu untuk recovery.

```
Circuit Breaker State Machine:

                    ┌──────────────┐
                    │              │
                    │   FAILURE    │
                    │   THRESHOLD  │
                    │              │
                    ▼              │
        ┌──────────────┐     ┌──────────────┐
        │              │     │              │
        │   CLOSED     │────▶│    OPEN      │
        │  (Normal)    │     │ (Failing)    │
        │              │     │              │
        └──────────────┘     └──────┬───────┘
               ▲                    │
               │                    │ TIMEOUT
               │          ┌─────────▼─────────┐
               │          │                   │
               │          │   HALF-OPEN       │
               │          │ (Testing Recovery)│
               │          │                   │
               │          └─────────┬─────────┘
               │                    │
               │   SUCCESS          │ FAILURE
               │   THRESHOLD        │ THRESHOLD
               │                    ▼
               │            ┌──────────────┐
               └────────────│    OPEN      │
                            └──────────────┘
```

**Tiga State Circuit Breaker:**

1. **CLOSED** — Normal operation. Request mengalir ke service target. Circuit breaker menghitung jumlah failure. Jika melebihi threshold, circuit breaker berpindah ke OPEN.

2. **OPEN** — Request langsung ditolak tanpa memanggil service target. Circuit breaker menunggu timeout period. Setelah timeout, berpindah ke HALF-OPEN.

3. **HALF-OPEN** — Membolehkan beberapa request test. Jika sukses, circuit breaker kembali ke CLOSED. Jika gagal, kembali ke OPEN.

**Implementasi Circuit Breaker (JavaScript/TypeScript):**

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 60 detik
    this.halfOpenMaxRequests = options.halfOpenMaxRequests || 3;

    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
    this.halfOpenRequests = 0;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF-OPEN';
      this.halfOpenRequests = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF-OPEN') {
      this.successCount++;
      if (this.successCount >= this.halfOpenMaxRequests) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  onFailure() {
    this.failureCount++;
    if (this.state === 'HALF-OPEN') {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      return;
    }
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }

  getState() {
    if (this.state === 'OPEN' && Date.now() >= this.nextAttempt) {
      this.state = 'HALF-OPEN';
      this.halfOpenRequests = 0;
    }
    return this.state;
  }
}

// Usage example:
const paymentBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000,
  halfOpenMaxRequests: 2,
});

async function processPayment(order) {
  return await paymentBreaker.execute(async () => {
    const response = await fetch('http://payment-service/api/pay', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Payment failed');
    return response.json();
  });
}
```

**Fallback Strategy:**
Ketika circuit breaker OPEN, implementasi fallback:
- Return cached response
- Return default value
- Queue request untuk diproses nanti
- Return graceful degradation

**Libraries:**
- **resilience4j** (Java) — paling populer di ecosystem Java
- **Polly** (C#) — .NET resilience library
- **go-breaker** (Go) — circuit breaker untuk Go
- **Opossum** (Node.js) — circuit breaker untuk JavaScript

#### 3.4 Saga Pattern

**Masalah:** Di microservices, kita tidak bisa menggunakan distributed transaction (2PC) karena performance dan availability issue. Bagaimana menjaga konsistensi data lintas service?

**Solusi:** Saga pattern memecah transaksi besar menjadi serangkaian transaksi lokal, masing-masing dengan compensating transaction untuk rollback.

**Dua Implementasi Saga:**

**A. Choreography-based Saga:**
Setiap service mempublish event dan service lain subscribe untuk mengambil tindakan.

```
Choreography-based Saga — Order Creation:

  Order Service          Payment Service         Inventory Service
       │                        │                        │
       │  1. Create Order       │                        │
       │  (PENDING)             │                        │
       │                        │                        │
       │───2. OrderCreated─────▶│                        │
       │      (event)           │                        │
       │                        │                        │
       │                        │  3. Reserve Payment    │
       │                        │                        │
       │                        │───4. PaymentReserved──▶│
       │                        │      (event)           │
       │                        │                        │
       │                        │                        │  5. Reserve Stock
       │                        │                        │
       │                        │───6. StockReserved─────▶│
       │                        │      (event)           │
       │                        │                        │
       │◀──7. OrderConfirmed────│                        │
       │                        │                        │
```

**Compensating Transaction (Rollback):**

```
Choreography-based Saga — Compensation:

  Order Service          Payment Service         Inventory Service
       │                        │                        │
       │                        │                        │  1. Reserve Stock
       │                        │                        │     FAILS!
       │                        │                        │
       │                        │───2. StockReserveFailed▶│
       │                        │      (event)           │
       │                        │                        │
       │                        │  3. Cancel Payment     │
       │                        │   (compensating)       │
       │                        │                        │
       │───4. PaymentCancelled──│                        │
       │      (event)           │                        │
       │                        │                        │
       │  5. Cancel Order       │                        │
       │   (compensating)       │                        │
       │                        │                        │
```

**B. Orchestration-based Saga:**
Sebuah orchestrator service mengkoordinasi semua langkah saga.

```
Orchestration-based Saga:

                    ┌──────────────────┐
                    │   Saga           │
                    │   Orchestrator   │
                    │                  │
                    │  1. Send Create  │
                    │     Order cmd    │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Order   │  │ Payment  │  │Inventory │
        │ Service  │  │ Service  │  │ Service  │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │              │              │
             │  Reply       │  Reply       │  Reply
             │  Created     │  Reserved    │  Reserved
             │              │              │
             └──────────────┼──────────────┘
                            │
                    ┌───────┴───────┐
                    │   Saga        │
                    │   Orchestrator│
                    │               │
                    │  2. Send      │
                    │     Confirm   │
                    │     Order cmd │
                    └───────────────┘
```

**Implementasi Saga Pattern (TypeScript):**

```typescript
// Saga Orchestrator Implementation
interface SagaStep {
  name: string;
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

class SagaOrchestrator {
  private steps: SagaStep[];
  private executedSteps: number[] = [];

  constructor(steps: SagaStep[]) {
    this.steps = steps;
  }

  async execute(): Promise<void> {
    for (let i = 0; i < this.steps.length; i++) {
      try {
        console.log(`Executing step: ${this.steps[i].name}`);
        await this.steps[i].execute();
        this.executedSteps.push(i);
      } catch (error) {
        console.error(`Step ${this.steps[i].name} failed: ${error}`);
        await this.compensate();
        throw error;
      }
    }
    console.log('Saga completed successfully');
  }

  private async compensate(): Promise<void> {
    // Compensate in reverse order
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      const stepIndex = this.executedSteps[i];
      try {
        console.log(`Compensating step: ${this.steps[stepIndex].name}`);
        await this.steps[stepIndex].compensate();
      } catch (error) {
        console.error(`Compensation failed for ${this.steps[stepIndex].name}: ${error}`);
        // Log and continue — compensation should be idempotent
      }
    }
  }
}

// Usage: Create Order Saga
const createOrderSaga = new SagaOrchestrator([
  {
    name: 'CreateOrder',
    execute: async () => {
      await orderService.createOrder({ id: 'ORD-123', status: 'PENDING' });
    },
    compensate: async () => {
      await orderService.cancelOrder('ORD-123');
    },
  },
  {
    name: 'ReservePayment',
    execute: async () => {
      await paymentService.reservePayment({ orderId: 'ORD-123', amount: 100 });
    },
    compensate: async () => {
      await paymentService.cancelPayment('ORD-123');
    },
  },
  {
    name: 'ReserveInventory',
    execute: async () => {
      await inventoryService.reserveStock({ orderId: 'ORD-123', items: [...] });
    },
    compensate: async () => {
      await inventoryService.releaseStock('ORD-123');
    },
  },
]);

await createOrderSaga.execute();
```

**Kapan Pakai Choreography vs Orchestration:**

| Aspek | Choreography | Orchestration |
|---|---|---|
| **Coupling** | Low — service tidak tahu tentang saga | Medium — orchestrator tahu semua service |
| **Complexity** | Simple untuk 2-3 service | Better untuk saga kompleks (5+ steps) |
| **Visibility** | Sulit track status saga | Mudah — orchestrator punya state |
| **Circular Dependency** | Risk — event bisa circular | No risk — orchestrator controls flow |
| **Testing** | Sulit — perlu mock multiple services | Lebih mudah — test orchestrator saja |

**Best Practices Saga:**
1. **Idempotent** — setiap step dan compensating transaction harus idempotent
2. **Compensating transaction tidak selalu bisa undo** — contoh: email sudah terkirim tidak bisa "unsend"
3. **Semantic lock** — gunakan status "pending" untuk prevent concurrent modification
4. **Timeout handling** — setiap step harus punya timeout

#### 3.5 CQRS (Command Query Responsibility Segregation)

**Masalah:** Di banyak aplikasi, read dan write memiliki requirement yang sangat berbeda. Write butuh consistency dan validation. Read butuh performance dan flexibility.

**Solusi:** Pisahkan model untuk read dan write operation.

```
CQRS Pattern:

  ┌─────────────────────────────────────────────────────┐
  │                      CLIENT                          │
  └──────────┬──────────────────────┬───────────────────┘
             │                      │
             │ Write (Command)      │ Read (Query)
             ▼                      ▼
  ┌──────────────────┐   ┌──────────────────┐
  │  Command Service │   │   Query Service  │
  │                  │   │                  │
  │  • Validate      │   │  • Denormalized  │
  │  • Business Logic│   │  • Optimized     │
  │  • Emit Events   │   │  • Fast Read     │
  └────────┬─────────┘   └────────┬─────────┘
           │                      │
           ▼                      ▼
  ┌──────────────────┐   ┌──────────────────┐
  │   Write Model    │   │    Read Model    │
  │   (Normalized)   │   │  (Denormalized)  │
  │                  │   │                  │
  │  ┌────────────┐  │   │  ┌────────────┐ │
  │  │  Order DB  │  │   │  │OrderView DB│ │
  │  │ (Postgres) │  │   │  │(Elastic)   │ │
  │  └────────────┘  │   │  └────────────┘ │
  └────────┬─────────┘   └──────────────────┘
           │
           │ Domain Events
           ▼
  ┌──────────────────┐
  │  Event Handler   │
  │  (Updates Read   │
  │   Model async)   │
  └──────────────────┘
```

**Keuntungan CQRS:**
- Read dan write bisa di-scale secara independen
- Read model bisa di-optimize untuk specific query pattern
- Write model tetap normalized untuk consistency
- Flexibility dalam memilih database untuk masing-masing model

**Kerugian CQRS:**
- Eventual consistency — read model mungkin tidak up-to-date
- Complexity — dua model untuk maintain
- Code duplication — beberapa logic mungkin duplikat

**Kapan Pakai CQRS:**
- Read dan write workload sangat berbeda (misal: 100:1 ratio)
- Query kompleks yang butuh denormalized data
- Multiple read representation dari data yang sama
- Team yang berbeda handle read dan write

#### 3.6 Event Sourcing

**Masalah:** Bagaimana kita track semua perubahan state dan bisa reconstruct state di waktu manapun?

**Solusi:** Alih-alih menyimpan state terkini, simpan semua events yang mengubah state. State saat ini dihitung dengan replay semua events.

```
Event Sourcing:

  Event Store (Append-Only Log):
  ┌──────────────────────────────────────────────────────┐
  │  Event 1: OrderCreated {id: "ORD-1", total: 100}     │
  │  Event 2: PaymentReceived {orderId: "ORD-1", amt:100}│
  │  Event 3: ItemShipped {orderId: "ORD-1", carrier:..} │
  │  Event 4: ItemDelivered {orderId: "ORD-1", date: ...}│
  └──────────────────────────────────────────────────────┘

  Current State (computed by replaying events):
  ┌──────────────────────────────────────────────────────┐
  │  Order {                                             │
  │    id: "ORD-1",                                      │
  │    status: "DELIVERED",                              │
  │    total: 100,                                       │
  │    paymentStatus: "PAID",                            │
  │    shippingStatus: "DELIVERED"                       │
  │  }                                                   │
  └──────────────────────────────────────────────────────┘

  State at Time T2 (replay Event 1 + Event 2):
  ┌──────────────────────────────────────────────────────┐
  │  Order {                                             │
  │    id: "ORD-1",                                      │
  │    status: "PAID",                                   │
  │    total: 100,                                       │
  │    paymentStatus: "PAID"                             │
  │  }                                                   │
  └──────────────────────────────────────────────────────┘
```

**Keuntungan Event Sourcing:**
- Complete audit trail — semua perubahan tercatat
- Time travel — bisa reconstruct state di waktu manapun
- Event replay — bisa buat projection baru dari events yang ada
- Debugging — mudah trace kenapa state jadi begini

**Kerugian Event Sourcing:**
- Complexity — perlu manage event versioning dan migration
- Performance — replay banyak events lambat (butuh snapshot)
- Eventual consistency — projection update secara async
- Learning curve — developer perlu paham paradigma baru

**Snapshot Optimization:**
```
Snapshot + Events:

  Snapshot (state at T100):
  ┌─────────────────────────────────────────┐
  │  Order { status: "SHIPPED", total: 100 }│
  └─────────────────────────────────────────┘

  Events after snapshot:
  ┌─────────────────────────────────────────┐
  │  Event 101: ItemDelivered {...}         │
  │  Event 102: ReviewSubmitted {...}       │
  └─────────────────────────────────────────┘

  Current state = Snapshot + replay(Event 101, Event 102)
```

#### 3.7 Sidecar Pattern

**Masalah:** Service butuh functionality tambahan (logging, monitoring, config, proxy) tapi kita tidak mau mencampur logic ini dengan business logic.

**Solusi:** Deploy helper container (sidecar) bersama main container. Sidecar berbagi network dan storage dengan main container.

```
Sidecar Pattern:

  ┌─────────────────────────────────────────────┐
  │                  Pod/Host                    │
  │                                              │
  │  ┌──────────────────┐  ┌──────────────────┐ │
  │  │   Main Container │  │  Sidecar         │ │
  │  │   (Application)  │  │  (Helper)        │ │
  │  │                  │  │                  │ │
  │  │  • Business      │  │  • Logging       │ │
  │  │    Logic         │  │  • Monitoring    │ │
  │  │  • API           │  │  • Config Sync   │ │
  │  │                  │  │  • Proxy         │ │
  │  │  ◄────localhost──┼──┼──►               │ │
  │  └──────────────────┘  └──────────────────┘ │
  │                                              │
  │  Shared: Network namespace, Volume storage   │
  └─────────────────────────────────────────────┘
```

**Use Cases Sidecar:**
- **Logging agent** — Fluentd, Logstash collect log dari main container
- **Monitoring agent** — Prometheus exporter expose metrics
- **Config sync** — Sync config dari config server ke local file
- **Proxy** — Envoy proxy handle mTLS, retry, circuit breaking
- **Service mesh proxy** — Istio sidecar handle traffic management

#### 3.8 Ambassador Pattern

**Masalah:** Service perlu berkomunikasi dengan external service tapi butuh functionality tambahan (retry, circuit breaking, metrics).

**Solusi:** Deploy proxy sebagai sidecar yang handle semua komunikasi ke external service.

```
Ambassador Pattern:

  ┌─────────────────────────────────────────────┐
  │                  Host                        │
  │                                              │
  │  ┌──────────────┐     ┌──────────────────┐  │
  │  │   Main App   │────▶│   Ambassador     │  │
  │  │              │     │   (Proxy)        │  │
  │  │              │     │                  │  │
  │  │              │     │  • Retry         │  │
  │  │              │     │  • Circuit       │  │
  │  │              │     │    Breaking      │  │
  │  │              │     │  • Metrics       │  │
  │  │              │     │  • Rate Limit    │  │
  │  └──────────────┘     └────────┬─────────┘  │
  └────────────────────────────────┼────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  External       │
                          │  Service        │
                          └─────────────────┘
```

**Perbedaan Sidecar vs Ambassador:**
- **Sidecar** — helper untuk functionality umum (logging, monitoring)
- **Ambassador** — proxy khusus untuk komunikasi ke external service

#### 3.9 Anti-Corruption Layer (ACL)

**Masalah:** Service baru perlu integrasi dengan legacy system yang punya model data dan API yang buruk. Kita tidak mau "terkontaminasi" oleh design yang buruk.

**Solusi:** Buat layer translasi antara service baru dan legacy system.

```
Anti-Corruption Layer:

  ┌──────────────┐     ┌──────────────────────┐     ┌──────────────┐
  │   New        │     │   Anti-Corruption    │     │   Legacy     │
  │   Service    │────▶│   Layer              │────▶│   System     │
  │              │     │                      │     │              │
  │  • Clean     │     │  • Adapter           │     │  • Complex   │
  │    Domain    │     │  • Translator        │     │    API       │
  │    Model     │     │  • Data Mapper       │     │  • Bad       │
  │              │     │  • Facade            │     │    Schema    │
  └──────────────┘     └──────────────────────┘     └──────────────┘
```

**ACL melakukan:**
1. **Adaptasi** — convert API legacy ke interface yang clean
2. **Translasi** — map data model legacy ke domain model baru
3. **Isolasi** — perubahan di legacy tidak mempengaruhi service baru

---

### 4. Service Communication

#### 4.1 Synchronous Communication

**REST (HTTP/JSON):**

Paling umum, mudah dipahami, language-agnostic.

```
REST Communication:

  Client                    API Gateway              Services
    │                           │                        │
    │  GET /api/orders/123      │                        │
    │──────────────────────────▶│                        │
    │                           │  GET /orders/123        │
    │                           │───────────────────────▶│
    │                           │                        │
    │                           │  200 OK {order data}    │
    │                           │◀───────────────────────│
    │  200 OK {order data}      │                        │
    │◀──────────────────────────│                        │
    │                           │                        │
```

**Kelebihan REST:**
- Simple, well-understood
- Language-agnostic
- Easy debugging (browser, curl, Postman)
- Caching built-in (HTTP cache headers)

**Kekurangan REST:**
- Verbose (JSON overhead)
- Multiple round trips untuk related data (N+1 problem)
- No built-in streaming
- Schema evolution butuh versioning

**gRPC (HTTP/2 + Protocol Buffers):**

High-performance RPC framework dari Google.

```
gRPC Communication:

  Client                    gRPC Server
    │                           │
    │  .proto file               │
    │  (contract definition)     │
    │◀──────────────────────────▶│
    │                           │
    │  Unary RPC                 │
    │  SayHello({name: "World"}) │
    │──────────────────────────▶│
    │                           │
    │  HelloResponse{msg: "..."} │
    │◀───────────────────────────│
    │                           │
    │  Server Streaming          │
    │  SubscribeToOrders()       │
    │──────────────────────────▶│
    │  OrderEvent #1             │
    │◀───────────────────────────│
    │  OrderEvent #2             │
    │◀───────────────────────────│
    │  OrderEvent #3             │
    │◀───────────────────────────│
```

**Kelebihan gRPC:**
- Binary protocol (Protocol Buffers) — lebih kecil dan cepat dari JSON
- HTTP/2 — multiplexing, header compression, server push
- Strong typing — contract-first development dengan .proto
- Built-in streaming — unary, server streaming, client streaming, bidirectional
- Code generation — client dan server stub auto-generated

**Kekurangan gRPC:**
- Tidak browser-friendly (butuh grpc-web proxy)
- Less human-readable (binary)
- Steeper learning curve
- Tooling kurang mature dibanding REST

**Kapan Pakai REST vs gRPC:**

| Kriteria | REST | gRPC |
|---|---|---|
| **Public API** | ✅ Ideal | ❌ Kurang cocok |
| **Internal Service-to-Service** | ✅ OK | ✅ Ideal |
| **Browser Client** | ✅ Native | ❌ Butuh grpc-web |
| **Performance** | Medium | High |
| **Streaming** | ❌ Limited | ✅ Native |
| **Developer Experience** | Easy | Moderate |

#### 4.2 Asynchronous Communication

**Message Queue (RabbitMQ, AWS SQS):**

Point-to-point communication. Message dikirim ke queue, satu consumer mengambil.

```
Message Queue Pattern:

  Producer              Message Queue              Consumer
     │                      │                          │
     │  Publish message     │                          │
     │─────────────────────▶│                          │
     │                      │  ┌──────────────────┐    │
     │                      │  │     Queue        │    │
     │                      │  │  ┌────────────┐  │    │
     │                      │  │  │ Message 1  │  │    │
     │                      │  │  │ Message 2  │  │    │
     │                      │  │  │ Message 3  │  │    │
     │                      │  │  └────────────┘  │    │
     │                      │  └──────────────────┘    │
     │                      │                          │
     │                      │  Consume message         │
     │                      │─────────────────────────▶│
     │                      │                          │
     │                      │  Acknowledge             │
     │                      │◀─────────────────────────│
```

**Pub/Sub (Kafka, AWS SNS, Google Pub/Sub):**

Publish message ke topic, semua subscriber menerima.

```
Pub/Sub Pattern:

  Publisher               Topic/Broker              Subscribers
     │                        │                          │
     │  Publish event         │                          │
     │  "OrderCreated"        │                          │
     │───────────────────────▶│                          │
     │                        │  ┌──────────────────┐    │
     │                        │  │     Topic        │    │
     │                        │  │  "order-events"  │    │
     │                        │  └────────┬─────────┘    │
     │                        │           │              │
     │                        │  ┌────────┼─────────┐    │
     │                        │  ▼        ▼         ▼    │
     │                        │  │        │         │    │
     │                        │  ▼        ▼         ▼    │
     │                        │  Svc A    Svc B    Svc C  │
     │                        │  (Email)  (Inv)    (Analytics)
```

**Event-Driven Architecture:**

Service berkomunikasi melalui events, bukan direct calls.

```
Event-Driven Architecture:

  ┌──────────────┐
  │ Order Service │
  │              │
  │  Create Order │
  └──────┬───────┘
         │
         │ OrderCreated Event
         ▼
  ┌─────────────────────────────────────────────┐
  │              Event Bus (Kafka)               │
  │                                              │
  │  Topic: order-events                         │
  │  ┌──────────────────────────────────────┐   │
  │  │ OrderCreated {id, userId, total, ...}│   │
  │  │ OrderUpdated {id, status, ...}       │   │
  │  │ OrderCancelled {id, reason, ...}     │   │
  │  └──────────────────────────────────────┘   │
  └───┬──────────┬──────────┬───────────────────┘
      │          │          │
      ▼          ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐
  │Payment │ │Inventory│ │ Email  │
  │ Service│ │ Service │ │ Service│
  └────────┘ └────────┘ └────────┘
```

**Keuntungan Event-Driven:**
- Loose coupling — publisher tidak tahu tentang subscriber
- Scalability — subscriber bisa scale independen
- Resilience — event bisa di-replay jika subscriber down
- Extensibility — tambah subscriber baru tanpa ubah publisher

**Kekurangan Event-Driven:**
- Eventual consistency — subscriber mungkin tidak up-to-date
- Debugging sulit — trace event flow kompleks
- Message ordering — perlu careful design
- Duplicate events — subscriber harus idempotent

**Pemilihan Message Broker:**

| Broker | Use Case | Throughput | Durability | Ordering |
|---|---|---|---|---|
| **RabbitMQ** | Complex routing, RPC | Medium | High | Per-queue |
| **Apache Kafka** | Event streaming, replay | Very High | High | Per-partition |
| **AWS SQS** | Simple queue, serverless | High | High | FIFO option |
| **Redis Streams** | Lightweight, fast | Very High | Medium | Per-stream |
| **Google Pub/Sub** | GCP ecosystem, global | Very High | High | Per-partition |

---

### 5. Data Management in Microservices

#### 5.1 Distributed Transactions

Di monolith, kita pakai ACID transactions. Di microservices, data tersebar di multiple database.

**Two-Phase Commit (2PC) — TIDAK DIREKOMENDASIKAN:**

```
Two-Phase Commit:

  Coordinator          Service A          Service B
       │                    │                  │
       │  1. PREPARE        │                  │
       │───────────────────▶│                  │
       │  2. PREPARE        │                  │
       │──────────────────────────────────────▶│
       │                    │                  │
       │  3. VOTE_COMMIT    │                  │
       │◀───────────────────│                  │
       │  4. VOTE_COMMIT    │                  │
       │◀──────────────────────────────────────│
       │                    │                  │
       │  5. COMMIT         │                  │
       │───────────────────▶│                  │
       │  6. COMMIT         │                  │
       │──────────────────────────────────────▶│
       │                    │                  │
       │  7. ACK            │                  │
       │◀───────────────────│                  │
       │  8. ACK            │                  │
       │◀──────────────────────────────────────│
```

**Mengapa 2PC buruk di microservices:**
- Blocking — semua participant harus available
- Performance — multiple round trips
- Single point of failure — coordinator
- Lock resource untuk duration transaksi
- Tidak cocok untuk high-availability systems

**Solusi: Saga Pattern** (sudah dibahas di section 3.4)

#### 5.2 Eventual Consistency

Di microservices, kita trade strong consistency untuk availability dan partition tolerance (CAP theorem).

```
Eventual Consistency Timeline:

  Time    User Service          Order Service         Notification Service
  ─────────────────────────────────────────────────────────────────────────
  T1      Update user email     ─                     ─
            (john@new.com)
  T2      ─                     Query user email      ─
            (still john@old.com) ← STALE DATA
  T3      Publish UserUpdated   ─                     ─
            event
  T4      ─                     Receive event,        ─
            update local copy
  T5      ─                     ─                     Send notification
                                                      to john@new.com
  T6      ─                     Query user email      ─
            (now john@new.com) ← CONSISTENT
```

**Strategi menangani eventual consistency:**
1. **Idempotent operations** — safe untuk retry
2. **Compensating actions** — undo jika sesuatu salah
3. **User-friendly UI** — show "processing" state, bukan error
4. **Conflict resolution** — last-write-wins, vector clocks, CRDTs

#### 5.3 Data Duplication

Di microservices, data duplication bukan anti-pattern — ini sering diperlukan untuk decoupling.

```
Data Duplication Pattern:

  ┌──────────────────┐
  │   User Service   │
  │                  │
  │  Source of Truth │
  │  for User Data   │
  │                  │
  │  id: 1           │
  │  name: "John"    │
  │  email: "j@x.com"│
  └────────┬─────────┘
           │
           │ UserCreated / UserUpdated events
           ▼
  ┌──────────────────┐     ┌──────────────────┐
  │  Order Service   │     │  Review Service  │
  │                  │     │                  │
  │  Order {         │     │  Review {        │
  │    id: 100       │     │    id: 500       │
  │    userId: 1     │     │    userId: 1     │
  │    userName:     │     │    userName:     │
  │      "John"  ◀───┼─────┼── "John"     ◀───┤
  │    userEmail:    │     │    userEmail:    │
  │      "j@x.com"◀──┼─────┼── "j@x.com"  ◀───┤
  │  }               │     │  }               │
  └──────────────────┘     └──────────────────┘

  Data diduplikasi untuk menghindari cross-service calls
  saat menampilkan order atau review.
```

**Kapan Duplikasi Data:**
- Data sering dibaca tapi jarang berubah (user name, email)
- Menghindari chatty API calls
- Performance optimization
- Service autonomy

**Tantangan:**
- Data bisa stale — perlu event untuk sync
- Storage cost — data disimpan di multiple tempat
- Consistency window — ada delay antara update dan propagation

#### 5.4 CQRS untuk Data Management

CQRS (sudah dibahas di section 3.5) sangat powerful untuk data management di microservices.

**CQRS + Event Sourcing Combination:**

```
CQRS + Event Sourcing:

  ┌─────────────────────────────────────────────────────────────┐
  │                         CLIENT                               │
  └──────────┬──────────────────────────────┬───────────────────┘
             │ Command                      │ Query
             ▼                              ▼
  ┌──────────────────┐           ┌──────────────────┐
  │  Command Handler │           │   Query Handler  │
  │                  │           │                  │
  │  1. Validate     │           │  Read from       │
  │  2. Apply to     │           │  Read Model      │
  │     Aggregate    │           │  (denormalized)  │
  │  3. Save Event   │           │                  │
  │     to Store     │           │                  │
  │  4. Publish      │           │                  │
  │     Event        │           │                  │
  └────────┬─────────┘           └──────────────────┘
           │
           │ Event
           ▼
  ┌──────────────────┐
  │   Event Store    │
  │  (append-only)   │
  └────────┬─────────┘
           │
           │ Subscribe to events
           ▼
  ┌──────────────────┐
  │  Event Handler   │
  │  (updates Read   │
  │   Model)         │
  └──────────────────┘
```

---

### 6. Deployment Patterns

#### 6.1 Containerization (Docker)

Container adalah unit deployment standar untuk microservices.

```
Docker Container Architecture:

  ┌─────────────────────────────────────────────┐
  │                  Host OS                     │
  │  (Linux / Windows / macOS)                   │
  │                                              │
  │  ┌────────────────────────────────────────┐ │
  │  │         Docker Engine / Runtime        │ │
  │  └────────────────────────────────────────┘ │
  │                                              │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
  │  │Container │ │Container │ │Container │    │
  │  │  A       │ │  B       │ │  C       │    │
  │  │          │ │          │ │          │    │
  │  │ App +    │ │ App +    │ │ App +    │    │
  │  │ Deps +   │ │ Deps +   │ │ Deps +   │    │
  │  │ Libs     │ │ Libs     │ │ Libs     │    │
  │  └──────────┘ └──────────┘ └──────────┘    │
  │                                              │
  │  Shared: OS kernel, but isolated:            │
  │  • File system                               │
  │  • Network stack                             │
  │  • Process tree                              │
  └─────────────────────────────────────────────┘
```

**Dockerfile Example:**

```dockerfile
# Multi-stage build untuk optimal image size
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Non-root user untuk security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "dist/main.js"]
```

**Best Practices Docker:**
- Multi-stage build — kecilkan final image
- Non-root user — security
- .dockerignore — exclude unnecessary files
- Health check — enable orchestration health monitoring
- Pin base image version — reproducibility
- One process per container — single responsibility

#### 6.2 Kubernetes Orchestration

Kubernetes mengelola deployment, scaling, dan operation dari containerized applications.

```
Kubernetes Architecture:

  ┌─────────────────────────────────────────────────────┐
  │                   Control Plane                     │
  │                                                     │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
  │  │ API      │ │Scheduler │ │Controller│ │ etcd   │ │
  │  │ Server   │ │          │ │ Manager  │ │ (store)│ │
  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
  └─────────────────────────────────────────────────────┘
                          │
  ┌───────────────────────┼───────────────────────┐
  │                       │                       │
  ▼                       ▼                       ▼
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Node 1  │          │  Node 2  │          │  Node 3  │
│          │          │          │          │          │
│ ┌──────┐ │          │ ┌──────┐ │          │ ┌──────┐ │
│ │kubelet│ │          │ │kubelet│ │          │ │kubelet│ │
│ └──────┘ │          │ └──────┘ │          │ └──────┘ │
│ ┌──────┐ │          │ ┌──────┐ │          │ ┌──────┐ │
│ │Pod A │ │          │ │Pod B │ │          │ │Pod C │ │
│ │Pod A │ │          │ │Pod B │ │          │ │Pod C │ │
│ │(rep) │ │          │ │(rep) │ │          │ │(rep) │ │
│ └──────┘ │          │ └──────┘ │          │ └──────┘ │
│ ┌──────┐ │          │ ┌──────┐ │          │ ┌──────┐ │
│ │Proxy │ │          │ │Proxy │ │          │ │Proxy │ │
│ └──────┘ │          │ └──────┘ │          │ └──────┘ │
└──────────┘          └──────────┘          └──────────┘
```

**Kubernetes Key Concepts:**

| Concept | Description |
|---|---|
| **Pod** | Smallest deployable unit, satu atau lebih container |
| **Deployment** | Manage replica dan update strategy |
| **Service** | Stable network endpoint untuk sekumpulan Pod |
| **Ingress** | HTTP routing dari luar cluster ke services |
| **ConfigMap** | Configuration data untuk applications |
| **Secret** | Sensitive data (passwords, tokens) |
| **Namespace** | Logical isolation dalam cluster |
| **HPA** | Horizontal Pod Autoscaler — auto scale berdasarkan metrics |

**Deployment YAML Example:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: order-service
    spec:
      containers:
        - name: order-service
          image: registry.example.com/order-service:v2.1.0
          ports:
            - containerPort: 3000
          env:
            - name: DB_HOST
              valueFrom:
                configMapKeyRef:
                  name: order-config
                  key: db-host
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

#### 6.3 Service Mesh (Istio, Linkerd)

Service mesh menambahkan layer komunikasi antar service tanpa mengubah application code.

```
Service Mesh Architecture:

  ┌─────────────────────────────────────────────────────┐
  │                   Data Plane                        │
  │                                                     │
  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
  │  │   Service A  │  │   Service B  │  │  Service C │ │
  │  │              │  │              │  │            │ │
  │  │  ┌────────┐  │  │  ┌────────┐  │  │ ┌───────┐ │ │
  │  │  │App     │  │  │  │App     │  │  │ │App    │ │ │
  │  │  └───┬────┘  │  │  └───┬────┘  │  │ └──┬────┘ │ │
  │  │  ┌───┴────┐  │  │  ┌───┴────┐  │  │ ┌──┴────┐ │ │
  │  │  │Sidecar │  │  │  │Sidecar │  │  │ │Sidecar│ │ │
  │  │  │(Envoy) │  │  │  │(Envoy) │  │  │ │(Envoy)│ │ │
  │  │  └────────┘  │  │  └────────┘  │  │ └───────┘ │ │
  │  └──────────────┘  └──────────────┘  └────────────┘ │
  │         │                 │                 │       │
  └─────────┼─────────────────┼─────────────────┼───────┘
            │                 │                 │
  ┌─────────┼─────────────────┼─────────────────┼───────┐
  │         ▼                 ▼                 ▼       │
  │              Control Plane (Istiod)                 │
  │                                                     │
  │  • Traffic management (routing, load balancing)     │
  │  • Security (mTLS, authorization)                   │
  │  • Observability (metrics, tracing, logging)        │
  │  • Policy enforcement                               │
  └─────────────────────────────────────────────────────┘
```

**Service Mesh Features:**
- **mTLS** — mutual TLS antar service secara otomatis
- **Traffic splitting** — canary deployment, A/B testing
- **Retry & timeout** — konfigurasi tanpa code change
- **Circuit breaking** — prevent cascading failure
- **Rate limiting** — kontrol traffic per service
- **Observability** — metrics, tracing, logging built-in

**Kapan Pakai Service Mesh:**
- 10+ microservices — complexity mulai justify overhead
- Butuh mTLS antar service — security requirement
- Butuh advanced traffic management — canary, blue-green
- Butuh observability terpusat — tracing, metrics
- Team tidak mau embed logic ini di application code

**Kapan TIDAK Pakai Service Mesh:**
- < 5 services — overhead tidak worth it
- Resource-constrained — sidecar pakai memory dan CPU
- Simple use case — tidak butuh advanced features

#### 6.4 Deployment Strategies

**Blue-Green Deployment:**

Dua environment identik (blue dan green). Satu live, satu idle. Deploy ke idle, test, switch traffic.

```
Blue-Green Deployment:

  Before Switch:                    After Switch:

  ┌──────────┐  ┌──────────┐       ┌──────────┐  ┌──────────┐
  │  Blue    │  │  Green   │       │  Blue    │  │  Green   │
  │  v1.0    │  │  v2.0    │       │  v1.0    │  │  v2.0    │
  │  LIVE    │  │  IDLE    │       │  IDLE    │  │  LIVE    │
  │  (prod)  │  │  (test)  │       │  (keep)  │  │  (prod)  │
  └────┬─────┘  └──────────┘       └──────────┘  └────┬─────┘
       │                                               │
       ▼                                               ▼
  ┌──────────┐                                    ┌──────────┐
  │  Router  │                                    │  Router  │
  │  ┌────┐  │                                    │  ┌────┐  │
  │  │100%│──┼──▶ Blue                           │  │100%│──┼──▶ Green
  │  └────┘  │                                    │  └────┘  │
  └──────────┘                                    └──────────┘
```

**Keuntungan:** Zero downtime, instant rollback (switch balik ke blue).
**Kerugian:** Butuh 2x resource, database migration tricky.

**Canary Deployment:**

Deploy versi baru ke sebagian kecil traffic, monitor, lalu perlahan tingkatkan.

```
Canary Deployment:

  Phase 1 (5%):              Phase 2 (25%):           Phase 3 (100%):

  ┌──────────┐               ┌──────────┐             ┌──────────┐
  │  v1.0    │               │  v1.0    │             │          │
  │  95%     │               │  75%     │             │          │
  └────┬─────┘               └────┬─────┘             │          │
       │                          │                   │          │
  ┌────┴─────┐               ┌────┴─────┐             │ Router   │
  │  Router  │               │  Router  │             │  100%    │
  │  ┌──┐┌──┐│               │  ┌──┐┌──┐│             └────┬─────┘
  │  │95││5 ││               │  │75││25││                  │
  │  └──┘└──┘│               │  └──┘└──┘│             ┌────┴─────┐
  └────┬─────┘               └────┬─────┘             │  v2.0    │
       │                          │                   │  100%    │
  ┌────┴─────┐               ┌────┴─────┐             └──────────┘
  │  v2.0    │               │  v2.0    │
  │  5%      │               │  25%     │
  └──────────┘               └──────────┘
```

**Keuntungan:** Low risk, real user testing, gradual rollout.
**Kerugian:** Kompleks routing, monitoring harus robust, lebih lama.

**Rolling Update (Kubernetes default):**

Ganti pod satu per satu, tidak ada downtime.

```
Rolling Update (3 replicas):

  Step 1:                    Step 2:                    Step 3:
  ┌─────┐ ┌─────┐ ┌─────┐   ┌─────┐ ┌─────┐ ┌─────┐   ┌─────┐ ┌─────┐ ┌─────┐
  │v1.0 │ │v1.0 │ │v1.0 │   │v1.0 │ │v1.0 │ │v2.0 │   │v2.0 │ │v2.0 │ │v2.0 │
  │ ✅  │ │ ✅  │ │ ✅  │   │ ✅  │ │ ✅  │ │ ✅  │   │ ✅  │ │ ✅  │ │ ✅  │
  └─────┘ └─────┘ └─────┘   └─────┘ └─────┘ └─────┘   └─────┘ └─────┘ └─────┘
  3x v1.0                    2x v1.0 + 1x v2.0         3x v2.0
```

---

### 7. Observability

Observability adalah kemampuan untuk memahami internal state sistem dari external output. Tiga pilar: **Metrics, Logs, Traces**.

#### 7.1 Distributed Tracing

Trace request dari awal sampai akhir melintasi multiple service.

```
Distributed Trace — Order Creation:

  Trace ID: abc-123-def
  │
  ├─ Span 1: API Gateway (0-50ms)
  │   ├─ Span 2: Auth Service (5-20ms)
  │   │   └─ Validate JWT token
  │   │
  │   ├─ Span 3: Order Service (25-200ms)
  │   │   ├─ Span 4: Payment Service (50-150ms)
  │   │   │   └─ Process payment via Stripe
  │   │   │
  │   │   └─ Span 5: Inventory Service (100-180ms)
  │   │       └─ Reserve stock items
  │   │
  │   └─ Span 6: Notification Service (180-250ms)
  │       └─ Send order confirmation email
  │
  └─ Total: 250ms
```

**Trace Context Propagation:**

```
Request Flow dengan Trace Context:

  Client ──▶ API Gateway ──▶ Order Service ──▶ Payment Service
  │            │                │                  │
  │  X-Trace   │  X-Trace       │  X-Trace         │  X-Trace
  │  ID: abc   │  ID: abc       │  ID: abc         │  ID: abc
  │  Span: 0   │  Span: 1       │  Span: 2         │  Span: 3
  │            │                │                  │
  │            │                │  Parent: 2        │  Parent: 2
```

**Tools:**
- **Jaeger** — open source, CNCF project
- **Zipkin** — Twitter's distributed tracing system
- **AWS X-Ray** — managed service di AWS
- **OpenTelemetry** — standard untuk telemetry data (traces, metrics, logs)

#### 7.2 Centralized Logging

Aggregate logs dari semua service ke satu tempat.

```
Centralized Logging Architecture:

  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Service A│  │ Service B│  │ Service C│
  │          │  │          │  │          │
  │ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │
  │ │App   │ │  │ │App   │ │  │ │App   │ │
  │ │Logs  │ │  │ │Logs  │ │  │ │Logs  │ │
  │ └──┬───┘ │  │ └──┬───┘ │  │ └──┬───┘ │
  └────┼─────┘  └────┼─────┘  └────┼─────┘
       │              │              │
       ▼              ▼              ▼
  ┌─────────────────────────────────────────┐
  │         Log Collector (Fluentd)          │
  │  • Collect dari semua containers         │
  │  • Parse dan enrich log entries          │
  │  • Forward ke storage                    │
  └────────────────────┬────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────┐
  │         Log Storage (Elasticsearch)      │
  │  • Index dan search                      │
  │  • Retention policy                      │
  └────────────────────┬────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────┐
  │         Visualization (Kibana)           │
  │  • Dashboard dan query                   │
  │  • Alerting                              │
  └─────────────────────────────────────────┘
```

**Structured Logging Best Practices:**

```json
// GOOD — structured log
{
  "timestamp": "2026-05-21T10:30:00Z",
  "level": "ERROR",
  "service": "order-service",
  "traceId": "abc-123-def",
  "spanId": "span-456",
  "message": "Payment processing failed",
  "orderId": "ORD-789",
  "error": "timeout connecting to payment-service",
  "duration_ms": 5000
}

// BAD — unstructured log
"2026-05-21 10:30:00 ERROR Payment failed for order ORD-789"
```

#### 7.3 Metrics

Quantitative data tentang performa dan health sistem.

**Four Golden Signals (Google SRE):**

1. **Latency** — waktu untuk serve request
   - P50, P95, P99 percentile
   - Target: P99 < 500ms untuk API

2. **Traffic** — berapa banyak request
   - Requests per second (RPS)
   - Concurrent connections

3. **Errors** — berapa banyak request gagal
   - Error rate (5xx responses)
   - Error budget (SLO compliance)

4. **Saturation** — seberapa penuh resource
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network bandwidth

**RED Method (untuk services):**

1. **Rate** — requests per second
2. **Errors** — failed requests per second
3. **Duration** — response time distribution

**USE Method (untuk infrastructure):**

1. **Utilization** — average time resource busy
2. **Saturation** — queue length, how much work is queued
3. **Errors** — error count

**Metrics Pipeline:**

```
Metrics Pipeline:

  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Service A│  │ Service B│  │ Service C│
  │          │  │          │  │          │
  │ /metrics │  │ /metrics │  │ /metrics │
  │ endpoint │  │ endpoint │  │ endpoint │
  └────┬─────┘  └────┬─────┘  └────┬─────┘
       │              │              │
       │ scrape       │ scrape       │ scrape
       ▼              ▼              ▼
  ┌─────────────────────────────────────────┐
  │         Prometheus                       │
  │  • Time-series database                  │
  │  • Pull-based scraping                   │
  │  • PromQL query language                 │
  └────────────────────┬────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────┐
  │         Grafana                          │
  │  • Dashboard dan visualization           │
  │  • Alerting rules                        │
  │  • Multi-data source                     │
  └─────────────────────────────────────────┘
```

#### 7.4 Health Checks

Endpoint untuk monitor status service.

```
Health Check Types:

  1. Liveness Probe (Kubernetes)
     GET /health/live
     → 200 OK: Service process is running
     → 503: Restart container

  2. Readiness Probe (Kubernetes)
     GET /health/ready
     → 200 OK: Service can accept traffic
     → 503: Remove from load balancer

  3. Startup Probe (Kubernetes)
     GET /health/startup
     → 200 OK: Service has started
     → 503: Keep checking (longer timeout)

  4. Deep Health Check
     GET /health/deep
     → Check database connection
     → Check message queue connection
     → Check external service connectivity
     → Return aggregated status
```

**Health Check Response:**

```json
{
  "status": "healthy",
  "version": "2.1.0",
  "uptime": "3d 14h 22m",
  "checks": {
    "database": { "status": "up", "latency_ms": 5 },
    "cache": { "status": "up", "latency_ms": 1 },
    "messageQueue": { "status": "up", "latency_ms": 3 }
  }
}
```

---

### 8. Testing Microservices

Testing di microservices lebih kompleks karena distributed nature. Kita perlu testing strategy berlapis.

```
Testing Pyramid for Microservices:

                    ┌─────────┐
                   /           \
                  /  E2E Tests  \    ← Few (slow, expensive, brittle)
                 /               \
                /─────────────────\
               / Integration Tests \
              /  (Contract, API)    \  ← Some
             /───────────────────────\
            /    Unit Tests           \ ← Many (fast, cheap, reliable)
           /───────────────────────────\
```

#### 8.1 Unit Testing

Test individual function/class dalam isolation.

```typescript
// Unit test untuk OrderService
describe('OrderService', () => {
  it('should create order with valid input', async () => {
    const mockRepo = {
      create: jest.fn().mockResolvedValue({ id: 'ORD-1', status: 'PENDING' }),
    };
    const service = new OrderService(mockRepo);

    const order = await service.createOrder({
      userId: 'USER-1',
      items: [{ productId: 'PROD-1', quantity: 2 }],
    });

    expect(order.id).toBe('ORD-1');
    expect(order.status).toBe('PENDING');
    expect(mockRepo.create).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should reject order with empty items', async () => {
    const service = new OrderService(mockRepo);

    await expect(
      service.createOrder({ userId: 'USER-1', items: [] })
    ).rejects.toThrow('Order must have at least one item');
  });
});
```

#### 8.2 Integration Testing

Test interaction antara service dengan real dependencies (database, message queue).

```typescript
// Integration test dengan Testcontainers
describe('OrderService Integration', () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let orderService: OrderService;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer()
      .withDatabase('test_db')
      .start();

    const db = new Database(postgresContainer.getConnectionUri());
    await db.migrate();
    orderService = new OrderService(db);
  });

  afterAll(async () => {
    await postgresContainer.stop();
  });

  it('should persist order to database', async () => {
    const order = await orderService.createOrder({
      userId: 'USER-1',
      items: [{ productId: 'PROD-1', quantity: 1 }],
    });

    const saved = await orderService.getOrder(order.id);
    expect(saved).toBeDefined();
    expect(saved.userId).toBe('USER-1');
  });
});
```

#### 8.3 Contract Testing

Memastikan API contract antara provider dan consumer tidak break.

```
Contract Testing:

  ┌──────────────┐              ┌──────────────┐
  │   Consumer   │              │   Provider   │
  │ (Order Svc)  │              │ (Payment Svc)│
  │              │              │              │
  │  Defines     │              │  Verifies    │
  │  expected    │              │  response    │
  │  request/    │              │  matches     │
  │  response    │              │  contract    │
  └──────┬───────┘              └──────┬───────┘
         │                             │
         │         Contract            │
         │      (Pact file)            │
         └──────────┬──────────────────┘
                    │
              ┌─────┴─────┐
              │  Pact     │
              │  Broker   │
              │           │
              │  • Store  │
              │  contracts│
              │  • Verify │
              │  compat.  │
              └───────────┘
```

**Pact Contract Example:**

```typescript
// Consumer-side contract definition
const provider = new Pact({
  consumer: 'OrderService',
  provider: 'PaymentService',
});

describe('Payment API', () => {
  it('should accept a valid payment request', () => {
    return provider
      .given('payment method exists')
      .uponReceiving('a valid payment request')
      .withRequest({
        method: 'POST',
        path: '/api/payments',
        body: { orderId: 'ORD-1', amount: 100 },
      })
      .willRespondWith({
        status: 200,
        body: { paymentId: like('PAY-123'), status: 'SUCCESS' },
      })
      .executeTest((mockserver) => {
        // Test consumer code against mock server
      });
  });
});
```

#### 8.4 End-to-End Testing

Test entire flow dari client ke backend dan kembali.

```
E2E Test Flow:

  Test Runner
     │
     │  1. POST /api/orders (create order)
     ▼
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │ API      │────▶│ Order    │────▶│ Payment  │
  │ Gateway  │     │ Service  │     │ Service  │
  └──────────┘     └──────────┘     └──────────┘
                        │                  │
                        ▼                  ▼
                  ┌──────────┐       ┌──────────┐
                  │ Order DB │       │ Payment  │
                  │          │       │ Gateway  │
                  └──────────┘       └──────────┘
     ▲
     │  2. Assert: 201 Created, order ID returned
     │  3. GET /api/orders/{id} — verify order exists
     │  4. Assert: order status = "CONFIRMED"
```

**E2E Testing Tools:**
- **Testcontainers** — spin up real dependencies (DB, Kafka) untuk testing
- **WireMock** — mock external services
- **Playwright/Cypress** — browser-based E2E testing
- **k6** — load testing untuk verify performance under load

#### 8.5 Chaos Engineering

Sengaja inject failure untuk test resilience sistem.

```
Chaos Engineering Experiments:

  Experiment 1: Kill random service instance
  ├─ Hypothesis: System remains available
  ├─ Action: Kill 1 of 3 Order Service pods
  ├─ Expected: Load balancer routes to remaining pods
  └─ Verify: Error rate < 1%, latency P99 < 1s

  Experiment 2: Network latency injection
  ├─ Hypothesis: Circuit breaker prevents cascading failure
  ├─ Action: Add 5s latency to Payment Service
  ├─ Expected: Circuit breaker opens after threshold
  └─ Verify: Fallback response returned, no cascade

  Experiment 3: Database connection failure
  ├─ Hypothesis: Service handles DB failure gracefully
  ├─ Action: Block DB connection for Order Service
  ├─ Expected: Health check fails, service returns 503
  └─ Verify: No data corruption, recovery after DB restore
```

**Chaos Engineering Tools:**
- **Chaos Monkey** (Netflix) — random instance termination
- **Litmus** — Kubernetes-native chaos engineering
- **Gremlin** — commercial chaos engineering platform
- **toxiproxy** — network condition simulation (latency, drop, throttle)

**Prinsip Chaos Engineering:**
1. **Start small** — satu failure pada satu waktu
2. **Production-like environment** — staging tidak cukup realistis
3. **Minimize blast radius** — bisa stop experiment kapan saja
4. **Measure everything** — baseline metrics sebelum experiment
5. **Automate** — run experiments regularly, bukan one-off

---

### 9. Organizational Aspects

#### 9.1 Conway's Law

> "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."
> — Melvin Conway, 1967

**Implikasi untuk Microservices:**

```
Conway's Law in Action:

  Team Structure:                    System Architecture:

  ┌─────────────┐                    ┌─────────────┐
  │  Team A     │                    │  Service A  │
  │  (User)     │────communicates────│  (User)     │
  └─────────────┘                    └─────────────┘

  ┌─────────────┐                    ┌─────────────┐
  │  Team B     │────communicates────│  Service B  │
  │  (Order)    │                    │  (Order)    │
  └─────────────┘                    └─────────────┘

  ┌─────────────┐                    ┌─────────────┐
  │  Team C     │────communicates────│  Service C  │
  │  (Payment)  │                    │  (Payment)  │
  └─────────────┘                    └─────────────┘

  "Reverse Conway Maneuver":
  Design team structure to match desired architecture,
  bukan sebaliknya.
```

**Reverse Conway Maneuver:**
Jika kita ingin architecture tertentu, design team structure yang sesuai DULU, baru build system.

#### 9.2 Team Structure — Two Pizza Rule

Amazon's rule: tim harus bisa diberi makan dengan 2 pizza (~6-10 orang).

```
Two-Pizza Team Structure:

  ┌─────────────────────────────────────────────┐
  │           Two-Pizza Team                     │
  │                                              │
  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
  │  │ Dev │ │ Dev │ │ Dev │ │ Dev │ │ Dev │   │
  │  │  1  │ │  2  │ │  3  │ │  4  │ │  5  │   │
  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   │
  │  ┌─────┐ ┌─────┐ ┌─────┐                    │
  │  │ QA  │ │ DevOps│ │ PM  │                    │
  │  │     │ │     │ │     │                    │
  │  └─────┘ └─────┘ └─────┘                    │
  │                                              │
  │  Owns: 1-3 microservices end-to-end          │
  │  • Development                               │
  │  • Testing                                   │
  │  • Deployment                                │
  │  • Operations                                │
  │  • On-call                                   │
  └─────────────────────────────────────────────┘
```

**Team Topologies (modern approach):**

1. **Stream-Aligned Team** — aligned dengan business stream (Order team, Payment team)
2. **Platform Team** — build internal platform untuk stream-aligned teams
3. **Enabling Team** — help stream-aligned teams adopt new technology
4. **Complicated-Subsystem Team** — handle complex subsystems (ML, cryptography)

#### 9.3 DevOps Culture

**You Build It, You Run It** — Amazon's philosophy.

```
DevOps Culture Principles:

  Traditional (Silo):              DevOps (Integrated):

  ┌─────────┐                      ┌─────────────────┐
  │  Dev    │──throw over wall──▶ │    Ops          │
  │  Team   │                      │    Team         │
  └─────────┘                      └─────────────────┘
  "Not my problem"                  Shared ownership

  DevOps Practices:
  ┌─────────────────────────────────────────────┐
  │  • CI/CD Pipeline (automated)               │
  │  • Infrastructure as Code (Terraform)       │
  │  • Monitoring & Alerting (on-call rotation) │
  │  • Blameless Post-Mortem                    │
  │  • ChatOps (Slack integration)              │
  │  • GitOps (declarative infrastructure)      │
  │  • Feature Flags (safe deployment)          │
  │  • Trunk-Based Development                  │
  └─────────────────────────────────────────────┘
```

**DORA Metrics (DevOps Research & Assessment):**

| Metric | Elite | High | Medium | Low |
|---|---|---|---|---|
| **Deployment Frequency** | On-demand | Weekly | Monthly | 1-6 months |
| **Lead Time for Changes** | < 1 hour | < 1 day | 1 week | 1-6 months |
| **MTTR (Mean Time to Recovery)** | < 1 hour | < 1 day | < 1 week | > 1 month |
| **Change Failure Rate** | 0-15% | 16-30% | 16-30% | 46-60% |

---

### 10. Real-World Case Studies

#### 10.1 Netflix — Pioneer Microservices

**Journey:**
- **2008:** Database corruption di monolith menyebabkan 3 hari outage
- **2009:** Mulai migrasi ke AWS dan microservices
- **2012:** 100% di AWS, 200+ microservices
- **2016:** 600+ microservices, 500M+ API calls per hari
- **2024:** 1000+ microservices, 1T+ API calls per hari

**Key Decisions:**
- **API Gateway** — Zuul (sekarang Envoy-based)
- **Service Discovery** — Eureka (sekarang Consul)
- **Circuit Breaker** — Hystrix (sekarang Resilience4j)
- **Configuration** — Archaius (sekarang Spring Cloud Config)
- **Monitoring** — Atlas (metrics), Mantis (stream processing)

**Lessons Learned:**
1. **Embrace failure** — Chaos Monkey sengaja kill instances di production
2. **Automate everything** — manual operation tidak scale
3. **Observability first** — tidak bisa manage apa yang tidak bisa diukur
4. **Decentralize** — setiap tim own their services end-to-end

```
Netflix Architecture (simplified):

  ┌─────────────────────────────────────────────────────┐
  │                    Netflix Client                    │
  │  (Web, Mobile, Smart TV, Game Console)               │
  └────────────────────────┬────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │   Zuul /    │
                    │   API GW    │
                    └──────┬──────┘
                           │
     ┌──────────────┬──────┼──────┬──────────────┐
     │              │      │      │              │
     ▼              ▼      ▼      ▼              ▼
  ┌──────┐  ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────┐
  │User  │  │Recommend │ │Search│ │Playback│ │Billing│
  │Svc   │  │Engine    │ │Svc   │ │Svc     │ │Svc   │
  └──┬───┘  └────┬─────┘ └──┬───┘ └───┬────┘ └──┬───┘
     │           │           │         │          │
     ▼           ▼           ▼         ▼          ▼
  ┌──────┐  ┌──────────┐ ┌──────┐ ┌────────┐ ┌──────┐
  │Cass. │  │Cass. +   │ │Elast.│ │Cass.   │ │MySQL │
  │      │  │EvCache   │ │Search│ │        │ │      │
  └──────┘  └──────────┘ └──────┘ └────────┘ └──────┘
```

#### 10.2 Amazon — The Original Microservices Company

**Journey:**
- **2002:** Jeff Bezos mandate — semua team expose data dan functionality via API
- **2002-2006:** Migrasi dari monolith ke service-oriented architecture
- **2006:** AWS launch — internal infrastructure jadi product
- **2024:** 100,000+ services (internal estimate)

**Famous Bezos Memo (2002):**
> 1. All teams will henceforth expose their data and functionality through service interfaces.
> 2. Teams must communicate with each other through these interfaces.
> 3. There will be no other form of inter-process communication allowed.
> 4. All service interfaces must be designed to be externalizable.

**Key Architecture:**
- **API Gateway** — AWS API Gateway
- **Service Mesh** — App Mesh (Envoy-based)
- **Event-Driven** — EventBridge, SNS, SQS, Kinesis
- **Serverless** — Lambda, Fargate
- **Data** — DynamoDB, Aurora, S3

**Lessons Learned:**
1. **API-first mindset** — semua functionality via API
2. **Two-pizza teams** — small, autonomous teams
3. **You build it, you run it** — full ownership
4. **Platform as product** — AWS lahir dari internal tools

#### 10.3 Uber — Microservices at Scale

**Journey:**
- **2009-2014:** Monolith (Python/Tornado) — "baseapp"
- **2014-2016:** SOA transition — 2,200+ services
- **2016-2018:** Microservices maturity — 4,000+ services
- **2024:** 5,000+ services, 100M+ requests per second

**Architecture Evolution:**

```
Uber Architecture Evolution:

  Phase 1 (2009-2014): Monolith
  ┌──────────────────────────────────────┐
  │           baseapp (Python)            │
  │  ┌────────┐ ┌──────┐ ┌────────────┐ │
  │  │Dispatch│ │Billing│ │Notification│ │
  │  │        │ │       │ │            │ │
  │  └────────┘ └───────┘ └────────────┘ │
  │                                      │
  │         Single PostgreSQL            │
  └──────────────────────────────────────┘

  Phase 2 (2014-2016): SOA
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │Disp. │ │Bill. │ │Notif.│ │ Map  │
  │Svc   │ │Svc   │ │Svc   │ │Svc   │
  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
     │        │        │        │
     ▼        ▼        ▼        ▼
  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │  DB  │ │  DB  │ │  DB  │ │  DB  │
  └──────┘ └──────┘ └──────┘ └──────┘

  Phase 3 (2016+): Microservices + Event-Driven
  ┌─────────────────────────────────────────┐
  │              API Gateway                 │
  └──────────────────┬──────────────────────┘
                     │
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
  ┌──────┐      ┌──────────┐    ┌──────────┐
  │Disp. │      │  Event   │    │  Map     │
  │Svc   │─────▶│  Bus     │◀───│  Service │
  └──┬───┘      │ (Kafka)  │    └──────────┘
     │          └────┬─────┘
     ▼               ▼
  ┌──────┐      ┌──────────┐
  │  DB  │      │  Billing │
  └──────┘      │  Service │
                └────┬─────┘
                     ▼
                ┌──────────┐
                │  DB      │
                └──────────┘
```

**Key Technologies:**
- **RPC Framework** — YarPC (Go, Python, Node.js, Java)
- **Service Discovery** — VIPs (Virtual IPs)
- **Message Queue** — Apache Kafka (millions of messages/sec)
- **Database** — MySQL (sharded), Cassandra, Redis, Elasticsearch
- **Observability** — Jaeger (distributed tracing, open-sourced by Uber)

**Lessons Learned:**
1. **Start simple** — monolith first, split when needed
2. **Standardize communication** — one RPC framework untuk semua
3. **Event-driven at scale** — Kafka backbone untuk async communication
4. **Invest in observability** — Jaeger lahir dari kebutuhan trace di production
5. **Platform team is critical** — developer experience matters

---

### 11. Common Pitfalls and Anti-Patterns

#### 11.1 Distributed Monolith

Microservices yang tightly coupled — worst of both worlds.

```
Distributed Monolith (Anti-Pattern):

  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Service A│──▶│ Service B│──▶│ Service C│
  │          │◀──│          │◀──│          │
  └──────────┘  └──────────┘  └──────────┘
       │              │              │
       └──────────────┼──────────────┘
                      │
               ┌──────┴──────┐
               │ Shared DB   │  ← Still sharing database!
               └─────────────┘

  Symptoms:
  • Deploy semua service bersamaan
  • Satu service down = semua down
  • Database schema change butuh coordination
  • Network latency membuat system lambat
```

**How to Avoid:**
- Database per service — NO shared database
- Async communication — hindari synchronous call chains
- Independent deployment — setiap service deploy sendiri
- Clear API contracts — versioning, backward compatibility

#### 11.2 Other Anti-Patterns

| Anti-Pattern | Description | Solution |
|---|---|---|
| **Shared Database** | Multiple services access same DB | Database per service |
| **Synchronous Chain** | A→B→C→D synchronous calls | Async events, circuit breaker |
| **God Service** | Satu service terlalu besar | Split by bounded context |
| **Distributed Monolith** | Tight coupling across services | Loose coupling, clear contracts |
| **Premature Microservices** | Split before domain is clear | Monolith first, split later |
| **No Observability** | Blind to system state | Metrics, logs, tracing |
| **Manual Deployment** | Slow, error-prone releases | CI/CD automation |
| **Ignoring Network** | Assuming network is reliable | Design for failure |

---

### 12. Decision Framework

**Apakah saya perlu microservices?**

```
Decision Tree:

  Start: "Do I need microservices?"
           │
           ▼
  ┌─────────────────────┐
  │ Team size > 20?     │──NO──▶ Stay with monolith
  └────────┬────────────┘
           YES
           ▼
  ┌─────────────────────┐
  │ Multiple teams      │──NO──▶ Stay with monolith
  │ need independent    │
  │ deployment?         │
  └────────┬────────────┘
           YES
           ▼
  ┌─────────────────────┐
  │ Different parts     │──NO──▶ Stay with monolith
  │ need different      │
  │ scaling?            │
  └────────┬────────────┘
           YES
           ▼
  ┌─────────────────────┐
  │ Bounded contexts    │──NO──▶ Modular monolith
  │ clearly defined?    │
  └────────┬────────────┘
           YES
           ▼
  ┌─────────────────────┐
  │ Team has DevOps     │──NO──▶ Build DevOps capability first
  │ maturity?           │
  └────────┬────────────┘
           YES
           ▼
  ┌─────────────────────┐
  │ ✅ Microservices    │
  │    are appropriate  │
  └─────────────────────┘
```

---

## 📝 RANGKUMAN

**Microservices adalah trade-off, bukan silver bullet:**

| Keuntungan | Kerugian |
|---|---|
| Independent deployment | Operational complexity |
| Independent scaling | Distributed system complexity |
| Fault isolation | Network latency dan failure |
| Technology diversity | Data consistency challenges |
| Team autonomy | Testing complexity |
| Organizational alignment | Higher infrastructure cost |

**Golden Rules:**
1. **Monolith first** — jangan mulai dengan microservices
2. **Bounded context** — split berdasarkan domain bisnis, bukan technical layer
3. **Database per service** — no shared database
4. **Design for failure** — asumsikan network akan gagal
5. **Observability first** — metrics, logging, tracing dari hari pertama
6. **Automate everything** — CI/CD, infrastructure as code
7. **Start small** — extract satu service, pelajari, lalu scale pattern

---

## 🎯 LATIHAN

### Latihan 1: Design Microservices Architecture
Design arsitektur microservices untuk e-commerce platform dengan service: User, Product, Order, Payment, Inventory, Notification, Recommendation.

**Deliverables:**
- ASCII architecture diagram
- Database choice untuk setiap service
- Communication pattern (sync vs async)
- Deployment strategy

### Latihan 2: Implement Circuit Breaker
Implement circuit breaker pattern dalam bahasa pilihanmu. Include:
- Three states (CLOSED, OPEN, HALF-OPEN)
- Configurable threshold dan timeout
- Fallback mechanism
- Unit tests

### Latihan 3: Saga Pattern Design
Design saga untuk "Place Order" flow:
1. Create order (PENDING)
2. Reserve inventory
3. Process payment
4. Confirm order

Include compensating transactions untuk setiap step.

### Latihan 4: Migration Plan
Buat migration plan dari monolith ke microservices untuk aplikasi existing:
- Identifikasi bounded context
- Strangler fig pattern implementation
- Timeline dan milestones
- Risk mitigation

---

## 📚 REFERENSI LANJUTAN

1. **[donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)** — Comprehensive system design interview prep
2. **[microservices.io](https://microservices.io)** — Chris Richardson's microservices pattern catalog
3. **[Martin Fowler — Microservices](https://martinfowler.com/articles/microservices.html)** — Seminal article on microservices
4. **[Chris Richardson — Microservices Patterns](https://www.manning.com/books/microservices-patterns)** — Book dengan pattern implementations
5. **[Sam Newman — Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/)** — Book on microservices design
6. **[Netflix Tech Blog](https://netflixtechblog.com/)** — Real-world microservices insights
7. **[Uber Engineering Blog](https://www.uber.com/blog/engineering/)** — Scale microservices lessons
8. **[Conway's Law](https://www.melconway.com/Home/Committees_Paper.html)** — Original paper
9. **[Team Topologies](https://teamtopologies.com/)** — Modern team organization patterns
10. **[Google SRE Book](https://sre.google/sre-book/table-of-contents/)** — Site Reliability Engineering practices
