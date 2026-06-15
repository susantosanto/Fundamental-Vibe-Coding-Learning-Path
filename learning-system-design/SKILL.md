---
name: learning-system-design
description: Learning workflow System Design & Software Architecture dari fundamental — membangun nalar arsitek
---

# Learning System Design & Software Architecture

## 📋 Overview
Skill ini membimbing Anda untuk berpikir seperti **System Architect**. Bukan sekedar coding — tapi **merancang sistem** yang scalable, maintainable, dan reliable.

## 🗺️ Learning Path

### Fase 1: Fundamental Concept (Minggu 1-2)
**Target:** Paham vocabulary dan prinsip dasar arsitektur

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Apa itu System Design?** | Mengapa penting, perbedaan architect vs developer |
| 2 | **Client-Server Model** | Request-response, HTTP, TCP/IP dasar |
| 3 | **Latency vs Throughput** | Definisi, cara ukur, trade-offs |
| 4 | **Performance vs Scalability** | Vertical vs horizontal scaling |
| 5 | **Availability vs Consistency** | CAP Theorem, PACELC |
| 6 | **DNS & CDN** | Cara kerja, caching, latency optimization |
| 7 | **Load Balancer** | Round-robin, least connections, health checks |
| 8 | **Database Fundamentals** | RDBMS vs NoSQL, kapan pakai yang mana |

**🔬 Latihan:** Diagram arsitektur aplikasi sederhana

### Fase 2: Building Blocks (Minggu 3-4)
**Target:** Paham komponen-komponen arsitektur

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Caching** | Redis/Memcached, cache strategies (LRU, TTL) |
| 2 | **Message Queues** | RabbitMQ, Kafka, pub/sub pattern |
| 3 | **Database Sharding** | Horizontal partitioning, consistent hashing |
| 4 | **Replication** | Master-slave, multi-master, read replicas |
| 5 | **Reverse Proxy** | Nginx, API Gateway, rate limiting |
| 6 | **Microservices** | Monolith vs microservices, service decomposition |
| 7 | **API Design** | RESTful, GraphQL, versioning, documentation |
| 8 | **Authentication & Authorization** | JWT, OAuth2, SSO, session management |

**🔬 Latihan:** Design API untuk e-commerce

### Fase 3: Advanced Patterns (Minggu 5-6)
**Target:** Bisa merancang arsitektur kompleks

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Event Sourcing & CQRS** | Write vs read models, event store |
| 2 | **Distributed Systems** | Consensus algorithms, distributed transactions |
| 3 | **Observability** | Logging, metrics, tracing (ELK, Prometheus, Grafana) |
| 4 | **Circuit Breaker** | Resilience patterns, bulkhead, retry |
| 5 | **Database Indexing** | B-tree, composite index, query optimization |
| 6 | **System Security** | HTTPS, encryption, DDoS protection, WAF |

**🔬 Latihan:** Design Twitter/X sederhana

### Fase 4: Real-World Architecture (Minggu 7-8)
**Target:** Bisa merancang sistem skala besar

| # | Topik | Target Penguasaan |
|---|-------|-------------------|
| 1 | **Design YouTube/Netflix** | Video upload, transcoding, CDN, recommendations |
| 2 | **Design WhatsApp** | Chat, real-time messaging, presence, media sharing |
| 3 | **Design URL Shortener** | Key generation, redirect, analytics, rate limiting |
| 4 | **Design Web Crawler** | BFS, deduplication, politeness, prioritization |
| 5 | **Design E-commerce** | Product catalog, cart, inventory, order system |
| 6 | **Design Ride-Sharing** | Location-based, matching, routing, payments |

**🔬 Latihan:** Presentasi arsitektur di depan tim

## 🧠 Architectural Thinking Framework

```
SETIAP KEPUTUSAN ARSITEKTUR, TANYAKAN:

1. FUNCTIONAL REQUIREMENTS
   "Apa yang HARUS dilakukan sistem ini?"
   
2. NON-FUNCTIONAL REQUIREMENTS
   "Seberapa scalable? Seberapa cepat? Seberapa aman?"
   
3. ESTIMATE
   "Berapa banyak user? Berapa banyak data? Berapa bandwidth?"
   
4. DATA MODEL
   "Apa entitasnya? Bagaimana relasinya?"
   
5. HIGH-LEVEL DESIGN
   "Komponen apa saja yang dibutuhkan?"
   
6. DEEP DIVE
   "Bagaimana komponen ini bekerja secara detail?"
   
7. TRADE-OFFS
   "Apa kelebihan dan kekurangan dari desain ini?"
   "Apa alternatifnya?"
```

## 🔄 Integrasi dengan Skill Lain

| Situasi | Skill |
|---------|-------|
| Belajar konsep arsitektur baru | `/teach` |
| Analisis keputusan desain | `/gentle-teaching` |
| Review arsitektur existing | `/code-documentation-code-explain` |

## 💡 Cara Menggunakan

1. `/teach "Saya ingin belajar System Design dari fundamental"`
2. Untuk setiap studi kasus: `/gentle-teaching "Analisis trade-off arsitektur ini"`
3. Review desain: `/code-documentation-code-explain`

> 🎯 **Ingat:** Arsitektur yang baik adalah yang membuat trade-off yang tepat, bukan yang paling sempurna!
