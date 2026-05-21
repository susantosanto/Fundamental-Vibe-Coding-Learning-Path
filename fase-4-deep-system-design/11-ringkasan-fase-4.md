# 11 — Ringkasan Final Fase 4: Deep System Design

> **Estimasi:** 1-2 jam | **Level:** Semua
> **Sumber:** Kompilasi dari 11 modul Fase 4 + [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)

---

## DAFTAR ISI

1. [Journey Map: 11 Modul Fase 4](#journey-map-11-modul-fase-4)
2. [Per-Module Recap](#per-module-recap)
3. [Interconnected Knowledge Map](#interconnected-knowledge-map)
4. [Architecture Decision Framework](#architecture-decision-framework)
5. [Self-Assessment Quiz (25+ Questions)](#self-assessment-quiz-25-questions)
6. [Fase 5 Readiness Checklist](#fase-5-readiness-checklist)
7. [Recommended Further Reading](#recommended-further-reading)
8. [Practical Project Ideas](#practical-project-ideas)
9. [Glossary of Advanced Terms](#glossary-of-advanced-terms)

---

## 1. JOURNEY MAP: 11 MODUL FASE 4

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 4: DEEP SYSTEM DESIGN                        │
│                        Learning Journey Map                          │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  MINGGU 1: Foundation of Distributed Systems                │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  01 — Microservices Deep Dive                        │  │    │
│  │  │  • Monolith vs Microservices                         │  │    │
│  │  │  • Database per Service Pattern                      │  │    │
│  │  │  • API Gateway, Circuit Breaker, Saga Pattern        │  │    │
│  │  │  • CQRS, Event Sourcing, Sidecar/Ambassador          │  │    │
│  │  │  • Service Communication (REST, gRPC, Async)         │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  02 — Service Discovery & API Gateway                │  │    │
│  │  │  • Client-Side vs Server-Side Discovery              │  │    │
│  │  │  • Consul, Eureka, etcd                              │  │    │
│  │  │  • Health Checking Patterns                          │  │    │
│  │  │  • API Gateway vs Service Mesh                       │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  03 — Database Sharding                              │  │    │
│  │  │  • Range, Hash, Directory, Geo Sharding              │  │    │
│  │  │  • Shard Key Selection                               │  │    │
│  │  │  • Consistent Hashing & Virtual Nodes                │  │    │
│  │  │  • Cross-Shard Queries & Rebalancing                 │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  MINGGU 2: Data Flow & Caching                              │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  04 — Message Queues & Event-Driven Architecture     │  │    │
│  │  │  • RabbitMQ (Exchange Types, Clustering)             │  │    │
│  │  │  • Kafka (Partitions, Consumer Groups, ISR)          │  │    │
│  │  │  • Delivery Semantics (At-Least-Once, Exactly-Once)  │  │    │
│  │  │  • Dead Letter Queues & Error Handling               │  │    │
│  │  │  • Pub/Sub, Work Queues, Request-Reply Patterns      │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  05 — Event Sourcing & CQRS                          │  │    │
│  │  │  • Event Store Design & Schema Versioning            │  │    │
│  │  │  • Event Replay & Snapshotting                       │  │    │
│  │  │  • Projections (Read Models)                         │  │    │
│  │  │  • CQRS: Command vs Query Separation                 │  │    │
│  │  │  • Outbox Pattern & Idempotent Handlers              │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  06 — Distributed Caching                            │  │    │
│  │  │  • Consistent Hashing & Virtual Nodes                │  │    │
│  │  │  • Redis Cluster (16384 Hash Slots)                  │  │    │
│  │  │  • Cache Invalidation Patterns                       │  │    │
│  │  │  • Thundering Herd Solutions                         │  │    │
│  │  │  • Cache Warming Strategies                          │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  MINGGU 3-4: Real-World Architectures & Cloud               │    │
│  │                                                              │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  07 — Observability & Monitoring                     │  │    │
│  │  │  • 3 Pilar: Metrics, Logs, Traces                    │  │    │
│  │  │  • Prometheus & Grafana (PromQL)                     │  │    │
│  │  │  • ELK Stack & Grafana Loki                          │  │    │
│  │  │  • Distributed Tracing (Jaeger, OpenTelemetry)       │  │    │
│  │  │  • SLO/SLI/SLA & Error Budget                        │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  08 — Arsitektur Twitter Scale                       │  │    │
│  │  │  • Fan-out Strategy (Push vs Pull vs Hybrid)         │  │    │
│  │  │  • Timeline Generation                               │  │    │
│  │  │  • Social Graph Storage                              │  │    │
│  │  │  • Scale: 500M users, 500M tweets/hari               │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  09 — Arsitektur YouTube/Netflix                     │  │    │
│  │  │  • Video Transcoding Pipeline                        │  │    │
│  │  │  • Adaptive Bitrate Streaming (ABR)                  │  │    │
│  │  │  • CDN Strategy untuk Video                          │  │    │
│  │  │  • Recommendation System                             │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  10 — AWS Architecture: Scaling to Millions          │  │    │
│  │  │  • VPC Design, Auto Scaling, Load Balancers          │  │    │
│  │  │  • RDS Scaling, ElastiCache, SQS/SNS                 │  │    │
│  │  │  • DynamoDB, Lambda, S3 Patterns                     │  │    │
│  │  │  • Cost Optimization & 3-Tier Reference Architecture │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  │                          │                                  │    │
│  │                          ▼                                  │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  11 — Ringkasan Final (File Ini)                     │  │    │
│  │  │  • Journey map, knowledge map, decision framework    │  │    │
│  │  │  • Self-assessment quiz, glossary, project ideas     │  │    │
│  │  └──────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. PER-MODULE RECAP

### Modul 01: Microservices Deep Dive

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  MICROSERVICES ARCHITECTURE                                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │  Order   │  │ Payment  │  │Inventory │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  │ [User DB]│  │[Order DB]│  │[Paym DB] │  │[Inv DB]  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └──────────────┴─────┬───────┴─────────────┘         │
│                            │                               │
│                   ┌────────┴────────┐                      │
│                   │   API Gateway   │                      │
│                   └────────┬────────┘                      │
│                            │                               │
│                    ┌───────┴───────┐                       │
│                    │    Client     │                       │
│                    └───────────────┘                       │
└─────────────────────────────────────────────────────────────┘

Key Patterns:
├── Database per Service (no shared DB)
├── API Gateway (single entry point)
├── Circuit Breaker (prevent cascading failure)
├── Saga Pattern (distributed transactions)
│   ├── Choreography (event-based)
│   └── Orchestration (coordinator-based)
├── CQRS (separate read/write models)
├── Event Sourcing (store events, not state)
├── Sidecar Pattern (helper container)
├── Ambassador Pattern (proxy for external)
└── Anti-Corruption Layer (legacy isolation)
```

**Takeaway:** Microservices bukan silver bullet. Mulai dengan monolith, split saat terasa pain. Setiap service harus punya database sendiri, deploy independen, dan fault isolation.

### Modul 02: Service Discovery & API Gateway

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  SERVICE DISCOVERY                                           │
│                                                              │
│  Client-Side: Eureka + Ribbon, Consul                       │
│  ┌──────────┐  query  ┌──────────┐  response  ┌──────────┐ │
│  │ Service  │ ──────▶ │ Registry │ ──────────▶│ Service  │ │
│  │   A      │         │          │  [IP list] │   B      │ │
│  └────┬─────┘         └──────────┘            └──────────┘ │
│       │                                                      │
│       ▼ direct connection                                    │
│  ┌──────────┐                                                │
│  │ Service  │                                                │
│  │   B      │                                                │
│  └──────────┘                                                │
│                                                              │
│  Server-Side: Kubernetes, AWS ALB                           │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐    │
│  │ Service  │ ──────▶ │    LB    │ ──────▶ │ Service  │    │
│  │   A      │ request │          │forward  │   B      │    │
│  └──────────┘         └──────────┘         └──────────┘    │
└─────────────────────────────────────────────────────────────┘

Registry Comparison:
├── Consul: Raft consensus, DNS+HTTP, multi-DC, service mesh
├── Eureka: AP model, self-preservation, Java-first
└── etcd: Raft consensus, strong consistency, Kubernetes backbone
```

**Takeaway:** Service discovery adalah "buku telepon" microservices. Pilih client-side untuk kontrol penuh, server-side untuk simplicity. Health checking WAJIB untuk mencegah routing ke instance down.

### Modul 03: Database Sharding

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  SHARDING STRATEGIES                                         │
│                                                              │
│  Range-Based:    Hash-Based:      Directory-Based:           │
│  Shard 1: 1-1M   hash(key)%N      Lookup Table               │
│  Shard 2: 1M-2M  → even dist      → flexible mapping         │
│  Shard 3: 2M-3M  → no range q     → SPOF risk               │
│                                                              │
│  Consistent Hashing:                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Node A                                       │   │
│  │     (hash:100)                                       │   │
│  │          │                                           │   │
│  │   key:x  │        Node B                             │   │
│  │  (hash:50)│    (hash:800)                            │   │
│  │      ↓   │        ↓                                  │   │
│  │      └───┼────────┘                                  │   │
│  │          │        Node C                             │   │
│  │          │    (hash:1500)                            │   │
│  │          │        ↓                                  │   │
│  │          └────────┘                                  │   │
│  │                                                      │   │
│  │  Rule: key → first node clockwise                    │   │
│  │  Add node → only ~1/N keys move (not all!)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Sharding = horizontal scaling untuk database. Shard key selection adalah keputusan paling penting. Consistent hashing meminimalkan data movement saat rebalancing. Kombinasi sharding + replication = production-ready.

### Modul 04: Message Queues & Event-Driven Architecture

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  KAFKA vs RABBITMQ                                           │
│                                                              │
│  Kafka: Distributed event streaming                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Topic: "orders" (partitions: 0, 1, 2)               │   │
│  │  Partition 0: [msg1][msg4][msg7] → Consumer A        │   │
│  │  Partition 1: [msg2][msg5][msg8] → Consumer B        │   │
│  │  Partition 2: [msg3][msg6][msg9] → Consumer C        │   │
│  │                                                       │   │
│  │  Immutable log, offset-based replay                   │   │
│  │  Throughput: 1M+ msg/s                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  RabbitMQ: Smart message broker                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Exchange → Binding → Queue → Consumer               │   │
│  │  Exchange types: Direct, Fanout, Topic, Headers      │   │
│  │  Smart routing, priority queues, delayed messages    │   │
│  │  Throughput: 10K-100K msg/s                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Delivery Semantics:                                         │
│  At-Most-Once  → Fast, bisa hilang                          │
│  At-Least-Once → Reliable, bisa duplikat (butuh idempotent) │
│  Exactly-Once  → Paling reliable, overhead tinggi           │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Message queue = decoupling + async + buffering. Kafka untuk event streaming high-throughput, RabbitMQ untuk complex routing. DLQ WAJIB untuk production. Consumer harus idempotent.

### Modul 05: Event Sourcing & CQRS

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  CQRS + EVENT SOURCING                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  COMMAND SIDE (Write)                                │    │
│  │  Command → Handler → Aggregate → Events → EventStore│    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │ Events                            │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  EVENT BUS (Kafka/RabbitMQ)                         │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                    ┌────┴────┐                              │
│                    ▼         ▼                              │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │  QUERY SIDE          │  │  QUERY SIDE          │        │
│  │  Projection 1        │  │  Projection 2        │        │
│  │  (PostgreSQL)        │  │  (Elasticsearch)     │        │
│  │  - GetOrderById      │  │  - SearchOrders      │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                              │
│  Event Store: Append-only log                               │
│  Event 1: AccountOpened {id: 1, owner: "Budi"}             │
│  Event 2: MoneyDeposited {id: 1, amount: 100000}           │
│  Event 3: MoneyWithdrawn {id: 1, amount: 50000}            │
│  State = replay semua events                                │
│                                                              │
│  Snapshot: Save state setiap N events untuk performance     │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Event sourcing = audit trail + temporal query + event replay. CQRS = scale read/write independently. Kombinasi keduanya powerful tapi kompleks. Jangan pakai untuk CRUD sederhana.

### Modul 06: Distributed Caching

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  REDIS CLUSTER ARCHITECTURE                                  │
│                                                              │
│  16384 Hash Slots distributed across nodes:                 │
│  Node A: Slots 0-5460     (Master + Replica)                │
│  Node B: Slots 5461-10922 (Master + Replica)                │
│  Node C: Slots 10923-16383 (Master + Replica)               │
│                                                              │
│  Cache Invalidation Patterns:                               │
│  ├── Cache-Aside (Lazy Loading) — PALING UMUM              │
│  ├── Write-Through — cache selalu fresh                    │
│  ├── Write-Behind — write cepat, async flush               │
│  └── Refresh-Ahead — pre-refresh sebelum expire            │
│                                                              │
│  Thundering Herd Solutions:                                 │
│  ├── Locking (Single Flight)                                │
│  ├── Probabilistic Early Expiration                         │
│  └── Stale-While-Revalidate                                 │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Distributed cache = 95%+ database load reduction. Consistent hashing untuk distribusi merata. Cache-aside pattern paling umum. Selalu handle thundering herd.

### Modul 07: Observability & Monitoring

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  3 PILAR OBSERVABILITY                                       │
│                                                              │
│  METRICS (WHAT)    LOGS (WHY)        TRACES (WHERE)         │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐            │
│  │ CPU 95%  │     │ "Error:  │     │ Request  │            │
│  │ RPS 1000 │     │  timeout │     │ → A → B  │            │
│  │ Error 2% │     │  at line │     │   → C    │            │
│  │          │     │  42"     │     │ 250ms    │            │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘            │
│       │                │                │                   │
│       └────────────────┼────────────────┘                   │
│                        ▼                                    │
│              ┌──────────────────┐                           │
│              │  FULL DIAGNOSIS  │                           │
│              │  "PaymentService │                           │
│              │   timeout karena │                           │
│              │   DB replica-3   │                           │
│              │   lag 5 detik"   │                           │
│              └──────────────────┘                           │
│                                                              │
│  Golden Signals: Latency, Traffic, Errors, Saturation       │
│  SLO/SLI/SLA: Target → Metric → Contract                    │
│  Error Budget: 100% - SLO = budget untuk deploy/experiment  │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Monitoring = tahu ADA masalah. Observability = tahu KENAPA. 3 pilar saling melengkapi. SLO lebih ketat dari SLA untuk error budget buffer.

### Modul 08: Arsitektur Twitter Scale

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  TWITTER FAN-OUT STRATEGY                                    │
│                                                              │
│  User biasa (< 1000 follower):                              │
│  Tweet → Push ke timeline SEMUA follower (pre-compute)      │
│  Read = langsung dari cache (cepat!)                        │
│                                                              │
│  Celebrity (> 1000 follower):                               │
│  Tweet → Simpan di celebrity cache (TIDAK push)             │
│  Read = Pull dari celebrity cache + merge timeline normal   │
│                                                              │
│  Hybrid = best of both worlds                               │
│  - User biasa: write-heavy, read-light                      │
│  - Celebrity: write-light, read-heavy                       │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Twitter scale = hybrid fan-out. Push untuk user biasa, pull untuk celebrity. Trade-off: write vs read complexity.

### Modul 09: Arsitektur YouTube/Netflix

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  VIDEO STREAMING PIPELINE                                    │
│                                                              │
│  [Upload] → [Transcoding] → [CDN] ← [Streaming]             │
│               │                                              │
│         ┌─────┴─────┐                                       │
│         ▼           ▼                                       │
│    [4K] [1080p] [720p] [480p] [360p] [240p]                │
│         │           │                                       │
│    Adaptive Bitrate Streaming (ABR):                        │
│    - Video dipecah chunks (2-10 detik)                      │
│    - Setiap chunk ada di multiple quality                   │
│    - Player otomatis pilih quality terbaik                  │
│    - Berdasarkan: bandwidth, CPU, buffer                    │
│                                                              │
│  CDN Strategy:                                              │
│  - Video populer → cache di edge (dekat user)               │
│  - Video jarang → origin server saja                        │
│  - YouTube: ~1% video di-cache di CDN                       │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** Video streaming = transcoding + ABR + CDN. ABR chunks memungkinkan adaptasi real-time ke kondisi network. CDN caching hanya untuk konten populer.

### Modul 10: AWS Architecture

**Konsep Kunci:**

```
┌─────────────────────────────────────────────────────────────┐
│  AWS EVOLUTION                                               │
│                                                              │
│  Fase 1: Single Server → Fase 2: Separated Components      │
│  Fase 3: Auto Scaling + MQ → Fase 4: Multi-Region Global   │
│                                                              │
│  Core Services:                                              │
│  ├── Compute: EC2, Lambda, ECS/EKS                          │
│  ├── Database: RDS, Aurora, DynamoDB                        │
│  ├── Cache: ElastiCache (Redis/Memcached)                   │
│  ├── Queue: SQS, SNS                                        │
│  ├── Storage: S3, EBS                                       │
│  ├── Network: VPC, ALB, NLB, CloudFront, Route 53          │
│  └── Monitoring: CloudWatch, X-Ray                          │
│                                                              │
│  Cost Optimization:                                          │
│  ├── Reserved Instances (30-72% discount)                   │
│  ├── Spot Instances (60-90% discount)                       │
│  ├── Right-sizing (monitor & adjust)                        │
│  ├── S3 lifecycle policies                                  │
│  └── Cost Explorer + Budgets                                │
└─────────────────────────────────────────────────────────────┘
```

**Takeaway:** AWS scaling = start simple, add complexity as needed. VPC design is foundation. Auto scaling + load balancing + multi-AZ = high availability.

---

## 3. INTERCONNECTED KNOWLEDGE MAP

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE MAP — FASE 4                            │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    MICROSERVICES (01)                        │    │
│  │  ┌──────────────────────────────────────────────────────┐  │    │
│  │  │  Database per Service ──┐                            │  │    │
│  │  │  API Gateway ───────────┼──▶ Service Discovery (02)  │  │    │
│  │  │  Circuit Breaker ───────┤                            │  │    │
│  │  │  Saga Pattern ──────────┼──▶ Message Queues (04)     │  │    │
│  │  │  CQRS ──────────────────┼──▶ Event Sourcing (05)     │  │    │
│  │  │  Sidecar ───────────────┘                            │  │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              DATA LAYER                                      │    │
│  │                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │    │
│  │  │  Sharding    │  │  Caching     │  │  Message     │      │    │
│  │  │  (03)        │  │  (06)        │  │  Queues      │      │    │
│  │  │              │  │              │  │  (04)        │      │    │
│  │  │  Consistent  │  │  Consistent  │  │  Kafka       │      │    │
│  │  │  Hashing ◀───┼──┤  Hashing     │  │  RabbitMQ    │      │    │
│  │  │  Shard Key   │  │  Redis       │  │  SQS/SNS     │      │    │
│  │  │  Rebalancing │  │  Cluster     │  │  DLQ         │      │    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │    │
│  │         │                 │                 │               │    │
│  │         └─────────────────┼─────────────────┘               │    │
│  │                           ▼                                 │    │
│  │              ┌────────────────────────┐                     │    │
│  │              │  Event Sourcing & CQRS │                     │    │
│  │              │  (05)                  │                     │    │
│  │              │  Event Store → Projections                   │    │
│  │              │  Outbox Pattern → Idempotent                 │    │
│  │              └────────────┬───────────┘                     │    │
│  └───────────────────────────┼─────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              OBSERVABILITY (07)                              │    │
│  │                                                              │    │
│  │  Metrics ←→ Logs ←→ Traces                                  │    │
│  │  Prometheus + Grafana + ELK/Loki + Jaeger                   │    │
│  │  SLO/SLI/SLA + Error Budget                                 │    │
│  │                                                              │    │
│  │  ▲                                                          │    │
│  │  │  (monitor semua layer di atas)                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              REAL-WORLD CASE STUDIES                         │    │
│  │                                                              │    │
│  │  Twitter (08): Hybrid fan-out, timeline generation          │    │
│  │  YouTube/Netflix (09): ABR, CDN, transcoding                │    │
│  │  AWS (10): VPC, Auto Scaling, RDS, DynamoDB, Lambda, S3     │    │
│  │                                                              │    │
│  │  Semua case studies menggabungkan konsep dari modul 01-07   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Hubungan Antar Konsep

| Dari | Ke | Hubungan |
|---|---|---|
| **Microservices** | **Service Discovery** | Service perlu menemukan lokasi service lain |
| **Microservices** | **Message Queues** | Async communication antar service |
| **Microservices** | **CQRS/Event Sourcing** | Data consistency tanpa distributed transactions |
| **Message Queues** | **Event Sourcing** | Events di-publish via message broker |
| **Sharding** | **Consistent Hashing** | Distribusi data merata saat rebalancing |
| **Caching** | **Consistent Hashing** | Key distribution di Redis Cluster |
| **Caching** | **Microservices** | Cache-aside pattern di setiap service |
| **Observability** | **Semua** | Monitor health, performance, errors di semua layer |
| **AWS** | **Semua** | Implementasi semua pattern menggunakan AWS services |

---

## 4. ARCHITECTURE DECISION FRAMEWORK

### Kapan Pakai Pattern Apa?

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE DECISION TREE                        │
│                                                                      │
│  Q1: Berapa user/traffic?                                           │
│  ├── < 10K user → Monolith + single DB                              │
│  ├── 10K-100K user → Monolith modular + read replica + cache        │
│  ├── 100K-1M user → Microservices + load balancer + auto scaling    │
│  └── > 1M user → Full distributed + sharding + multi-region         │
│                                                                      │
│  Q2: Read-heavy atau write-heavy?                                   │
│  ├── Read-heavy (100:1) → CQRS + cache + read replicas              │
│  ├── Write-heavy → Message queue + async processing                 │
│  └── Balanced → Standard 3-tier architecture                        │
│                                                                      │
│  Q3: Butuh strong consistency?                                      │
│  ├── Ya (financial) → ACID database, Saga pattern, no eventual      │
│  ├── Tidak (social media) → Eventual consistency OK                 │
│  └── Tergantung → CQRS (strong write, eventual read)               │
│                                                                      │
│  Q4: Butuh audit trail lengkap?                                     │
│  ├── Ya (banking, healthcare) → Event Sourcing                      │
│  └── Tidak → Standard CRUD                                          │
│                                                                      │
│  Q5: Service perlu komunikasi real-time?                            │
│  ├── Ya, synchronous → REST atau gRPC                               │
│  ├── Ya, asynchronous → Message Queue (Kafka/RabbitMQ/SQS)          │
│  └── Broadcast ke banyak service → SNS/SQS fan-out                  │
│                                                                      │
│  Q6: Data terlalu besar untuk 1 database?                           │
│  ├── Ya → Sharding (range, hash, directory, geo)                    │
│  └── Tidak → Read replicas + caching cukup                          │
│                                                                      │
│  Q7: Butuh global low latency?                                      │
│  ├── Ya → Multi-region + CDN + global database (Aurora Global)      │
│  └── Tidak → Single region + Multi-AZ sudah cukup                   │
│                                                                      │
│  Q8: Budget terbatas?                                               │
│  ├── Ya → On-demand + right-sizing + S3 lifecycle                   │
│  ├── Medium → Savings Plans + managed services                      │
│  └── Tidak → Reserved + full HA + multi-region                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Database Selection Matrix

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE SELECTION MATRIX                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Requirement              │ Database           │ AWS Service │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │  ACID transactions        │ PostgreSQL         │ RDS/Aurora  │   │
│  │  High read throughput     │ MySQL              │ RDS         │   │
│  │  Flexible schema          │ MongoDB            │ DocumentDB  │   │
│  │  Key-value, session       │ Redis              │ ElastiCache │   │
│  │  Full-text search         │ Elasticsearch      │ OpenSearch  │   │
│  │  Time-series data         │ InfluxDB           │ Timestream  │   │
│  │  Graph relationships      │ Neo4j              │ Neptune     │   │
│  │  Serverless, auto-scale   │ DynamoDB           │ DynamoDB    │   │
│  │  Data warehouse           │ ClickHouse         │ Redshift    │   │
│  │  Wide-column              │ Cassandra          │ Keyspaces   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. SELF-ASSESSMENT QUIZ (25+ QUESTIONS)

### Level: Basic (1-10)

**Q1:** Apa perbedaan utama antara monolith dan microservices?
<details>
<summary>Jawaban</summary>
Monolith = satu codebase, satu proses, satu database. Microservices = banyak service kecil, deploy independen, database per service, komunikasi via network.
</details>

**Q2:** Apa itu API Gateway dan mengapa diperlukan di microservices?
<details>
<summary>Jawaban</summary>
API Gateway adalah single entry point untuk semua client request. Ia handle routing, authentication, rate limiting, load balancing, dan response aggregation. Tanpa gateway, client perlu tahu lokasi setiap service.
</details>

**Q3:** Jelaskan Circuit Breaker pattern dan 3 statenya.
<details>
<summary>Jawaban</summary>
Circuit Breaker mencegah cascading failure. 3 state: CLOSED (normal, request mengalir), OPEN (request ditolak, service down), HALF-OPEN (test recovery dengan beberapa request).
</details>

**Q4:** Apa perbedaan Client-Side dan Server-Side Service Discovery?
<details>
<summary>Jawaban</summary>
Client-Side: client query registry langsung dan pilih instance (lebih cepat, lebih kompleks). Server-Side: client kirim ke load balancer, LB yang handle discovery (lebih sederhana, extra hop).
</details>

**Q5:** Apa itu sharding dan mengapa diperlukan?
<details>
<summary>Jawaban</summary>
Sharding = memecah database besar menjadi beberapa database kecil (shard) di server terpisah. Diperlukan saat vertical scaling sudah tidak cukup — CPU, memory, atau storage bottleneck.
</details>

**Q6:** Apa itu consistent hashing dan mengapa lebih baik dari hashing biasa?
<details>
<summary>Jawaban</summary>
Consistent hashing memetakan keys dan nodes ke hash ring. Saat node ditambah/dikurang, hanya ~1/N keys yang berpindah (vs hampir semua keys di hashing biasa).
</details>

**Q7:** Apa perbedaan Kafka dan RabbitMQ?
<details>
<summary>Jawaban</summary>
Kafka = distributed event streaming platform, immutable log, high throughput (1M+ msg/s), offset-based replay. RabbitMQ = smart message broker, complex routing (exchange types), lower throughput, pesan dihapus setelah consumed.
</details>

**Q8:** Apa itu Event Sourcing?
<details>
<summary>Jawaban</summary>
Event Sourcing = menyimpan state sebagai sequence of events, bukan snapshot terkini. State saat ini dihitung dengan replay semua events. Memberikan audit trail lengkap dan kemampuan temporal query.
</details>

**Q9:** Apa itu CQRS?
<details>
<summary>Jawaban</summary>
CQRS (Command Query Responsibility Segregation) = memisahkan operasi write (command) dan read (query) ke model yang berbeda. Write model normalized untuk consistency, read model denormalized untuk performance.
</details>

**Q10:** Apa 3 pilar observability?
<details>
<summary>Jawaban</summary>
Metrics (angka: CPU, RPS, error rate), Logs (detail: error message, stack trace), Traces (alur: request flow across services). Ketiganya saling melengkapi untuk full diagnosis.
</details>

### Level: Intermediate (11-18)

**Q11:** Kapan sebaiknya TIDAK menggunakan microservices?
<details>
<summary>Jawaban</summary>
Tim kecil (< 10 developer), startup early stage, aplikasi sederhana CRUD, time-to-market kritis, budget terbatas, domain belum jelas bounded context-nya. Monolith-first approach direkomendasikan.
</details>

**Q12:** Jelaskan Saga pattern dan perbedaan choreography vs orchestration.
<details>
<summary>Jawaban</summary>
Saga = distributed transaction pattern dengan compensating transactions. Choreography: setiap service publish event, service lain subscribe (low coupling, hard to track). Orchestration: coordinator service mengatur semua steps (easier to track, medium coupling).
</details>

**Q13:** Apa masalah "thundering herd" di caching dan bagaimana solusinya?
<details>
<summary>Jawaban</summary>
Thundering herd = banyak request bersamaan saat cache key expire, semua query database → overload. Solusi: (1) Locking/single flight — hanya 1 request yang load dari DB, (2) Probabilistic early expiration — stagger expiration, (3) Stale-while-revalidate — return stale data + background refresh.
</details>

**Q14:** Bagaimana cara memilih shard key yang baik?
<details>
<summary>Jawaban</summary>
Kriteria: (1) High cardinality (banyak nilai unik), (2) Even distribution (data merata), (3) Query pattern compatible (sering dipakai di WHERE), (4) Immutable (tidak berubah), (5) Low cross-shard query (query umum tidak perlu akses multiple shard).
</details>

**Q15:** Apa itu delivery semantics di message queue? Jelaskan 3 tipe.
<details>
<summary>Jawaban</summary>
At-Most-Once: pesan bisa hilang, tidak pernah duplikat (fire-and-forget). At-Least-Once: pesan tidak hilang, bisa duplikat (manual ack, butuh idempotent consumer). Exactly-Once: tidak hilang, tidak duplikat (idempotent producer + transactions, overhead tinggi).
</details>

**Q16:** Apa itu Outbox Pattern dan mengapa diperlukan?
<details>
<summary>Jawaban</summary>
Outbox Pattern = simpan events ke outbox table dalam transaction yang sama dengan business data, lalu publish ke event bus secara async. Mencegah data inconsistency jika save ke DB berhasil tapi publish ke bus gagal.
</details>

**Q17:** Jelaskan perbedaan SLO, SLI, dan SLA.
<details>
<summary>Jawaban</summary>
SLI = metric yang diukur (actual performance). SLO = target yang ditetapkan (goal). SLA = kontrak dengan customer (janji + konsekuensi). Hubungan: SLA >= SLO >= SLI. SLO lebih ketat dari SLA untuk error budget buffer.
</details>

**Q18:** Bagaimana Twitter menangani scale untuk celebrity dengan jutaan follower?
<details>
<summary>Jawaban</summary>
Hybrid fan-out: user biasa (< 1000 follower) = push model (pre-compute timeline). Celebrity (> 1000 follower) = pull model (simpan di celebrity cache, merge saat read). Ini menghindari write amplification untuk celebrity.
</details>

### Level: Advanced (19-25)

**Q19:** Bagaimana cara melakukan zero-downtime database migration di microservices?
<details>
<summary>Jawaban</summary>
Strangler Fig Pattern: (1) Buat service baru di samping monolith, (2) Route traffic perlahan ke service baru, (3) Dual-write ke old dan new database, (4) Verify consistency, (5) Switch read ke new DB, (6) Switch write ke new DB, (7) Remove old code. Lakukan incremental, bukan big bang.
</details>

**Q20:** Bagaimana menangani cross-shard join query?
<details>
<summary>Jawaban</summary>
Strategi: (1) Denormalization — duplikasi data yang sering di-join ke shard yang sama, (2) Application-level join — query multiple shard lalu join di application layer, (3) Materialized view — pre-compute join result, (4) Redesign shard key — pastikan related data di shard yang sama, (5) Use document database untuk nested data.
</details>

**Q21:** Bagaimana cara design DynamoDB untuk use case dengan write-heavy workload?
<details>
<summary>Jawaban</summary>
Write sharding: gunakan suffix pada partition key ("product:123#0" sampai "product:123#9") untuk spread writes ke multiple partitions. Gunakan on-demand capacity mode untuk handle spike. Enable DAX untuk read caching. Gunakan DynamoDB Streams untuk async processing. Hindari hot partitions dengan composite keys.
</details>

**Q22:** Bagaimana mengoptimasi Lambda cold start untuk latency-critical API?
<details>
<summary>Jawaban</summary>
(1) Provisioned Concurrency — pre-warm instances, (2) Minimize package size — hanya include yang diperlukan, (3) Use ARM64 (Graviton2) — 20% faster, (4) Initialize SDK/connections outside handler, (5) Use lighter runtime (Node.js/Python vs Java), (6) Increase memory (more CPU = faster init), (7) Use Lambda Layers untuk shared dependencies.
</details>

**Q23:** Bagaimana design sistem yang bisa handle 10x traffic spike saat flash sale?
<details>
<summary>Jawaban</summary>
(1) Auto Scaling dengan scheduled scaling (scale up sebelum flash sale), (2) CDN cache semua static assets, (3) Queue semua write operations (SQS) untuk async processing, (4) Rate limiting di API Gateway, (5) ElastiCache untuk product catalog, (6) Read replicas untuk query-heavy operations, (7) Feature flags untuk disable non-critical features, (8) Spot Instances untuk worker nodes.
</details>

**Q24:** Bagaimana memastikan data consistency di event-driven architecture?
<details>
<summary>Jawaban</summary>
(1) Idempotent consumers — proses event yang sama berkali-kali = hasil sama, (2) Outbox pattern — guarantee event publication, (3) Saga pattern — compensating transactions untuk rollback, (4) Event versioning — handle schema evolution, (5) DLQ — isolate failed events untuk investigasi, (6) Monitoring consumer lag — detect processing delays.
</details>

**Q25:** Bagaimana design multi-region disaster recovery dengan RPO < 1 detik dan RTO < 1 menit?
<details>
<summary>Jawaban</summary>
(1) Aurora Global Database — cross-region replication < 1 detik (RPO), (2) Route 53 health checks + failover — DNS redirect < 1 menit (RTO), (3) S3 Cross-Region Replication — data redundancy, (4) DynamoDB Global Tables — multi-region active-active, (5) Multi-region ALB + ASG — compute redundancy, (6) Regular DR drills — test failover procedure.
</details>

---

## 6. FASE 5 READINESS CHECKLIST

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 5 READINESS CHECKLIST                        │
│                                                                      │
│  ARSITEKTUR:                                                         │
│  [ ] Bisa menjelaskan perbedaan monolith vs microservices           │
│  [ ] Paham kapan pakai microservices dan kapan tidak                │
│  [ ] Bisa mendesain API Gateway dengan routing dan auth             │
│  [ ] Paham Circuit Breaker dan Saga pattern                         │
│  [ ] Bisa menjelaskan CQRS dan Event Sourcing                       │
│                                                                      │
│  DATA:                                                               │
│  [ ] Paham sharding strategies dan shard key selection              │
│  [ ] Bisa implementasi consistent hashing                           │
│  [ ] Paham perbedaan Kafka vs RabbitMQ vs SQS                       │
│  [ ] Bisa design message queue dengan DLQ                           │
│  [ ] Paham cache invalidation patterns                              │
│  [ ] Bisa setup Redis Cluster                                       │
│                                                                      │
│  INFRASTRUCTURE:                                                     │
│  [ ] Paham VPC design (public/private subnet, NAT, route tables)    │
│  [ ] Bisa setup Auto Scaling dengan scaling policies                │
│  [ ] Paham ALB vs NLB                                               │
│  [ ] Bisa setup RDS Multi-AZ + read replicas                        │
│  [ ] Paham DynamoDB partitioning dan GSI                            │
│  [ ] Bisa optimize Lambda cold start                                │
│                                                                      │
│  OBSERVABILITY:                                                      │
│  [ ] Paham 3 pilar observability                                    │
│  [ ] Bisa setup Prometheus + Grafana                                │
│  [ ] Paham distributed tracing                                      │
│  [ ] Bisa define SLO/SLI/SLA                                        │
│                                                                      │
│  REAL-WORLD:                                                         │
│  [ ] Paham arsitektur Twitter (hybrid fan-out)                      │
│  [ ] Paham arsitektur YouTube/Netflix (ABR, CDN)                    │
│  [ ] Bisa design 3-tier web app di AWS                              │
│  [ ] Paham cost optimization strategies                             │
│                                                                      │
│  SOFT SKILLS:                                                        │
│  [ ] Bisa jelaskan tradeoff dari setiap design decision             │
│  [ ] Bisa buat architecture diagram yang jelas                      │
│  [ ] Paham CAP theorem dan eventual consistency                     │
│  [ ] Bisa estimate scale (QPS, storage, bandwidth)                  │
│                                                                      │
│  Jika semua checklist tercentang → SIAP untuk FASE 5!               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. RECOMMENDED FURTHER READING

### Books

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RECOMMENDED BOOKS                                 │
│                                                                      │
│  1. "Designing Data-Intensive Applications" — Martin Kleppmann      │
│     → THE book untuk distributed systems. Wajib baca.               │
│     → Covers: replication, partitioning, transactions, consistency  │
│                                                                      │
│  2. "Building Microservices" (2nd Ed) — Sam Newman                  │
│     → Comprehensive guide to microservices architecture             │
│     → Covers: decomposition, integration, testing, deployment       │
│                                                                      │
│  3. "System Design Interview" — Alex Xu (Vol 1 & 2)                 │
│     → Practical system design problems dengan solutions             │
│     → Covers: URL shortener, chat system, search autocomplete, dll  │
│                                                                      │
│  4. "Microservices Patterns" — Chris Richardson                       │
│     → Deep dive ke microservices patterns                           │
│     → Covers: Saga, CQRS, Event Sourcing, API composition           │
│                                                                      │
│  5. "Site Reliability Engineering" — Google                         │
│     → SRE practices dari Google                                     │
│     → Covers: SLO, error budget, monitoring, incident response      │
│                                                                      │
│  6. "The Art of Scalability" — Abbott & Fisher                      │
│     → Scalability cube (X, Y, Z axis scaling)                       │
│     → Covers: organizational dan technical scaling                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Online Resources

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ONLINE RESOURCES                                  │
│                                                                      │
│  Repositori:                                                         │
│  ✅ donnemartin/system-design-primer (⭐349k)                       │
│     → Sumber utama learning path ini                                │
│                                                                      │
│  ✅ ashishps1/awesome-system-design-resources                       │
│     → Kurasi lengkap resources system design                        │
│                                                                      │
│  ✅ danielmiessler/fabric (AI prompt patterns)                       │
│     → Prompt engineering untuk system design                        │
│                                                                      │
│  Blog/Articles:                                                      │
│  ✅ High Scalability (highscalability.com)                           │
│     → Real-world architecture case studies                          │
│                                                                      │
│  ✅ Martin Fowler's Blog (martinfowler.com)                          │
│     → Microservices, CQRS, Event Sourcing                           │
│                                                                      │
│  ✅ Netflix Tech Blog (netflixtechblog.com)                          │
│     → Real-world distributed systems di scale                       │
│                                                                      │
│  ✅ AWS Architecture Blog (aws.amazon.com/blogs/architecture)        │
│     → AWS-specific architecture patterns                            │
│                                                                      │
│  Courses:                                                            │
│  ✅ Grokking the System Design Interview (Educative)                │
│  ✅ System Design Primer (free, GitHub)                             │
│  ✅ AWS Solutions Architect Associate/Professional                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. PRACTICAL PROJECT IDEAS

### Project 1: URL Shortener Service

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROJECT 1: URL SHORTENER                                            │
│                                                                      │
│  Requirements:                                                       │
│  - Shorten long URL ke 6-character code                             │
│  - Redirect short URL ke original                                   │
│  - Track click analytics                                            │
│  - Handle 10M URLs, 100M redirects/bulan                            │
│                                                                      │
│  Konsep Fase 4 yang dipakai:                                         │
│  ├── Base62 encoding (algorithm)                                    │
│  ├── DynamoDB untuk URL mapping (NoSQL)                             │
│  ├── ElastiCache untuk redirect caching                             │
│  ├── CloudFront untuk global low latency                            │
│  ├── SQS untuk async analytics processing                           │
│  └── Lambda untuk redirect handler (serverless)                     │
│                                                                      │
│  Scale:                                                              │
│  - Read:Write ratio = 100:1 → cache-heavy                           │
│  - Hot URLs → cache di CloudFront                                   │
│  - Cold URLs → DynamoDB lookup                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Project 2: Real-Time Chat Application

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROJECT 2: REAL-TIME CHAT APPLICATION                               │
│                                                                      │
│  Requirements:                                                       │
│  - 1-on-1 dan group chat                                            │
│  - Real-time message delivery                                       │
│  - Message history (infinite scroll)                                │
│  - Online status, typing indicator                                  │
│  - 1M concurrent users                                              │
│                                                                      │
│  Konsep Fase 4 yang dipakai:                                         │
│  ├── WebSocket connections (persistent)                             │
│  ├── Kafka untuk message streaming                                  │
│  ├── Redis untuk online status + pub/sub                            │
│  ├── DynamoDB untuk message history                                 │
│  ├── API Gateway (WebSocket API)                                    │
│  └── Lambda untuk message processing                                │
│                                                                      │
│  Scale:                                                              │
│  - Message ordering per chat room (Kafka partition by room_id)      │
│  - Fan-out untuk group chat (SNS/SQS)                               │
│  - Presence service di Redis                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Project 3: E-Commerce Platform

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROJECT 3: E-COMMERCE PLATFORM                                      │
│                                                                      │
│  Requirements:                                                       │
│  - Product catalog (search, filter, sort)                           │
│  - Shopping cart, checkout, payment                                 │
│  - Order management, inventory tracking                             │
│  - Recommendation system                                            │
│  - Handle flash sale (10x traffic spike)                            │
│                                                                      │
│  Konsep Fase 4 yang dipakai:                                         │
│  ├── Microservices (Product, Order, Payment, Inventory, User)       │
│  ├── API Gateway + Service Discovery                                │
│  ├── Saga pattern untuk checkout (distributed transaction)          │
│  ├── ElastiCache untuk product catalog                              │
│  ├── OpenSearch untuk product search                                │
│  ├── SQS untuk order processing queue                               │
│  ├── RDS Aurora untuk transactional data                            │
│  └── S3 untuk product images + CloudFront                           │
│                                                                      │
│  Scale:                                                              │
│  - Flash sale: scheduled auto scaling + queue all writes            │
│  - Product search: OpenSearch dengan faceted search                 │
│  - Recommendation: DynamoDB Streams → Lambda → ML model             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Project 4: Social Media Feed

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROJECT 4: SOCIAL MEDIA FEED (Twitter-like)                         │
│                                                                      │
│  Requirements:                                                       │
│  - Post text, images, videos                                        │
│  - Follow/unfollow users                                            │
│  - Timeline (home feed)                                             │
│  - Like, comment, share                                             │
│  - 500K users, 1M posts/hari                                        │
│                                                                      │
│  Konsep Fase 4 yang dipakai:                                         │
│  ├── Hybrid fan-out (push untuk user biasa, pull untuk celebrity)   │
│  ├── Redis untuk timeline cache                                     │
│  ├── DynamoDB untuk posts dan social graph                          │
│  ├── S3 + CloudFront untuk media                                    │
│  ├── SNS untuk notification fan-out                                 │
│  └── ElastiCache untuk feed generation                              │
│                                                                      │
│  Scale:                                                              │
│  - Celebrity detection: auto-switch ke pull model saat > 1000 follower│
│  - Feed generation: async worker (Lambda + SQS)                     │
│  - Social graph: adjacency list di DynamoDB                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Project 5: Video Streaming Platform

```
┌─────────────────────────────────────────────────────────────────────┐
│  PROJECT 5: VIDEO STREAMING PLATFORM (YouTube-like)                  │
│                                                                      │
│  Requirements:                                                       │
│  - Upload video (max 10 GB)                                         │
│  - Transcoding ke multiple resolutions                              │
│  - Adaptive bitrate streaming                                       │
│  - View count, comments, likes                                      │
│  - Recommendation based on watch history                            │
│                                                                      │
│  Konsep Fase 4 yang dipakai:                                         │
│  ├── S3 untuk video storage + lifecycle policies                    │
│  ├── Lambda/SQS untuk transcoding pipeline                          │
│  ├── CloudFront untuk video delivery                                │
│  ├── DynamoDB untuk metadata (video info, comments)                 │
│  ├── ElastiCache untuk trending videos                              │
│  └── RDS untuk user data dan watch history                          │
│                                                                      │
│  Scale:                                                              │
│  - Transcoding: ECS/EKS workers (parallel processing)               │
│  - ABR: HLS/DASH format, multiple bitrate chunks                    │
│  - CDN: popular videos cached di edge, cold videos dari origin      │
│  - Recommendation: watch history → DynamoDB Streams → ML pipeline   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. GLOSSARY OF ADVANCED TERMS

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GLOSSARY — FASE 4 TERMS                           │
│                                                                      │
│  A                                                                   │
│  ├── ACID: Atomicity, Consistency, Isolation, Durability            │
│  ├── ABR: Adaptive Bitrate Streaming                                │
│  ├── ACL: Anti-Corruption Layer                                     │
│  ├── ASG: Auto Scaling Group                                        │
│  ├── AZ: Availability Zone                                          │
│  └── API: Application Programming Interface                         │
│                                                                      │
│  B                                                                   │
│  ├── BASE: Basically Available, Soft state, Eventually consistent   │
│  ├── BFF: Backend for Frontend                                      │
│  └── Broker: Message broker (RabbitMQ, Kafka)                       │
│                                                                      │
│  C                                                                   │
│  ├── CAP Theorem: Consistency, Availability, Partition tolerance    │
│  ├── CDN: Content Delivery Network                                  │
│  ├── CDC: Change Data Capture                                       │
│  ├── CQRS: Command Query Responsibility Segregation                 │
│  ├── CRDT: Conflict-free Replicated Data Type                       │
│  └── CIDR: Classless Inter-Domain Routing                           │
│                                                                      │
│  D                                                                   │
│  ├── DLQ: Dead Letter Queue                                         │
│  ├── DNS: Domain Name System                                        │
│  ├── DAX: DynamoDB Accelerator                                      │
│  └── DDoS: Distributed Denial of Service                            │
│                                                                      │
│  E                                                                   │
│  ├── EDA: Event-Driven Architecture                                 │
│  ├── EBS: Elastic Block Store                                       │
│  ├── EC2: Elastic Compute Cloud                                     │
│  ├── ELB: Elastic Load Balancer                                     │
│  └── ETL: Extract, Transform, Load                                  │
│                                                                      │
│  F                                                                   │
│  ├── Fan-out: Distribute message ke multiple consumers              │
│  ├── FIFO: First In, First Out                                      │
│  └── FaaS: Function as a Service (Lambda)                           │
│                                                                      │
│  G                                                                   │
│  ├── GSI: Global Secondary Index                                    │
│  ├── gRPC: Google Remote Procedure Call                             │
│  └── GDPR: General Data Protection Regulation                       │
│                                                                      │
│  H                                                                   │
│  ├── HA: High Availability                                          │
│  ├── HTTP: Hypertext Transfer Protocol                              │
│  └── Hash Ring: Consistent hashing circular space                   │
│                                                                      │
│  I                                                                   │
│  ├── IAM: Identity and Access Management                            │
│  ├── ISR: In-Sync Replicas (Kafka)                                  │
│  └── IOPS: Input/Output Operations Per Second                       │
│                                                                      │
│  K                                                                   │
│  ├── KMS: Key Management Service                                    │
│  └── KPI: Key Performance Indicator                                 │
│                                                                      │
│  L                                                                   │
│  ├── LB: Load Balancer                                              │
│  ├── LSI: Local Secondary Index                                     │
│  └── Latency: Waktu response dari request ke response               │
│                                                                      │
│  M                                                                   │
│  ├── Multi-AZ: Multiple Availability Zones                          │
│  ├── MQ: Message Queue                                              │
│  └── MTTR: Mean Time To Recovery                                    │
│                                                                      │
│  N                                                                   │
│  ├── NACL: Network Access Control List                              │
│  ├── NAT: Network Address Translation                               │
│  └── NoSQL: Not Only SQL                                            │
│                                                                      │
│  O                                                                   │
│  ├── OAC: Origin Access Control                                     │
│  ├── OLTP: Online Transaction Processing                            │
│  ├── OLAP: Online Analytical Processing                             │
│  └── Outbox Pattern: Guarantee event publication                    │
│                                                                      │
│  P                                                                   │
│  ├── PACELC: Partition, Availability, Consistency + Latency,        │
│  │         Consistency (extended CAP theorem)                       │
│  ├── Pub/Sub: Publish/Subscribe pattern                             │
│  └── Partition: Sub-bagian dari topic (Kafka) atau shard (DB)       │
│                                                                      │
│  Q                                                                   │
│  ├── QPS: Queries Per Second                                        │
│  ├── Queue: FIFO buffer untuk messages                              │
│  └── Quorum: Majority consensus (N/2 + 1 nodes)                     │
│                                                                      │
│  R                                                                   │
│  ├── RDS: Relational Database Service                               │
│  ├── RCU: Read Capacity Unit (DynamoDB)                             │
│  ├── RPO: Recovery Point Objective                                  │
│  ├── RTO: Recovery Time Objective                                   │
│  ├── RR: Read Replica                                               │
│  └── RPC: Remote Procedure Call                                     │
│                                                                      │
│  S                                                                   │
│  ├── S3: Simple Storage Service                                     │
│  ├── SAGA: Distributed transaction pattern                          │
│  ├── SLA: Service Level Agreement                                   │
│  ├── SLO: Service Level Objective                                   │
│  ├── SLI: Service Level Indicator                                   │
│  ├── SNS: Simple Notification Service                               │
│  ├── SQS: Simple Queue Service                                      │
│  ├── SSRF: Server-Side Request Forgery                              │
│  └── Shard: Subset data di server terpisah                          │
│                                                                      │
│  T                                                                   │
│  ├── TTL: Time-To-Live                                              │
│  ├── TPS: Transactions Per Second                                   │
│  ├── TLS: Transport Layer Security                                  │
│  └── Throughput: Jumlah data diproses per waktu                     │
│                                                                      │
│  V                                                                   │
│  ├── VPC: Virtual Private Cloud                                     │
│  ├── VPC Peering: Direct connection antar VPC                       │
│  └── Virtual Nodes: Consistent hashing replicas untuk distribusi    │
│                                                                      │
│  W                                                                   │
│  ├── WAF: Web Application Firewall                                  │
│  ├── WCU: Write Capacity Unit (DynamoDB)                            │
│  └── Write Sharding: Spread writes ke multiple partitions           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎉 SELAMAT!

Anda telah menyelesaikan **Fase 4: Deep System Design**. Anda sekarang memiliki pemahaman mendalam tentang:

- ✅ Microservices architecture dan design patterns
- ✅ Service discovery dan API gateway
- ✅ Database sharding dan consistent hashing
- ✅ Message queues dan event-driven architecture
- ✅ Event sourcing dan CQRS
- ✅ Distributed caching dan Redis cluster
- ✅ Observability: metrics, logs, traces
- ✅ Real-world architectures (Twitter, YouTube, Netflix)
- ✅ AWS scaling patterns dan cost optimization

### Next Steps

1. **Bangun project nyata** — Pilih salah satu dari 5 project ideas di atas
2. **Review donnemartin/system-design-primer** — Baca repo asli untuk referensi lengkap
3. **Practice system design interviews** — Gunakan buku Alex Xu untuk latihan
4. **Lanjut ke Fase 5** — Implementasi dan deployment

---

> **Kembali ke:** [`00-panduan-fase.md`](./00-panduan-fase.md)
> **Lanjut ke:** Fase 5 (coming soon)
