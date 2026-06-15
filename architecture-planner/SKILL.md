---
name: architecture-planner
description: Membimbing merencanakan, membentuk, dan membuat arsitektur aplikasi secara bertahap — dari konsep ke implementasi
---

# Architecture Planner — Merencanakan, Membentuk, & Membangun Arsitektur Aplikasi

## 📋 Filosofi
Skill ini adalah panduan lengkap untuk **merencanakan, membentuk, dan membuat arsitektur sebuah aplikasi**. Bukan sekedar teori — Anda akan **langsung praktek** dengan studi kasus nyata, dari aplikasi sederhana sampai sistem skala besar.

## 🗺️ Learning Path: Arsitektur dari Nol

### Fase 1: MERENCANAKAN (Planning)
*"Kegagalan dalam perencanaan adalah perencanaan untuk kegagalan"*

#### 1.1 Requirement Gathering
```
📋 TEMPLATE PERENCANAAN:

FUNCTIONAL REQUIREMENTS:
- "Apa yang HARUS bisa dilakukan aplikasi ini?"
- "Siapa user-nya?"
- "Apa use case utamanya?"

NON-FUNCTIONAL REQUIREMENTS:
- "Berapa banyak user?"
- "Seberapa cepat harus respons?"
- "Seberapa aman?"
- "Berapa budget infrastructure?"

CONSTRAINTS:
- "Apa batasan teknologi?"
- "Tim size?"
- "Timeline?"
```

**Latihan:** Ambil aplikasi sederhana (To-Do List). Tulis requirement-nya.

#### 1.2 System Context & Scope
- Gambar **System Context Diagram** (siapa yang terlibat)
- Tentukan **scope**: apa yang IN dan OUT
- Identifikasi **external dependencies**

#### 1.3 Capacity Estimation
```
TRAFFIC ESTIMATION:
- Daily Active Users (DAU): ____
- Requests per second (RPS): ____
- Data storage per year: ____
- Bandwidth needed: ____
```

#### 1.4 Technology Selection
```
DATABASE: SQL vs NoSQL? Kenapa?
CACHE: Redis? Memcached? Kenapa?
QUEUE: RabbitMQ? Kafka? Kenapa?
STORAGE: S3? Local? CDN?
API: REST? GraphQL? gRPC?
```

### Fase 2: MEMBENTUK (Design & Architecture)
*"Membentuk blueprint sebelum mulai coding"*

#### 2.1 High-Level Architecture
```
GAMBARKAN:
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Client  │───→│ Load    │───→│ API     │
│         │    │ Balancer│    │ Server  │
└─────────┘    └─────────┘    └────┬────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌─────────┐   ┌─────────┐   ┌─────────┐
              │ Cache   │   │ Database│   │ Queue   │
              └─────────┘   └─────────┘   └─────────┘
```

#### 2.2 Component Breakdown
Untuk setiap komponen:
- **Responsibilities**: Apa tanggung jawabnya?
- **Interfaces**: API contract dengan komponen lain
- **Data Flow**: Data masuk, diproses, keluar
- **Failure Mode**: Apa yang terjadi kalau komponen ini mati?

#### 2.3 Data Model Design
```
ERD / SCHEMA DESIGN:

Entitas: User, Product, Order, Payment
Relasi: 
  User 1──N Order
  Product N──M Order
  Order 1──1 Payment

Pertimbangan:
- Normalization vs Denormalization
- Index strategy
- Partition key
```

#### 2.4 API Design
```
RESTful API Contract:

GET    /api/v1/users        → List users
POST   /api/v1/users        → Create user
GET    /api/v1/users/:id    → Get user detail
PUT    /api/v1/users/:id    → Update user
DELETE /api/v1/users/:id    → Delete user

Pertimbangan:
- Pagination
- Rate limiting
- Authentication
- Error response format
```

#### 2.5 Security Architecture
```
SECURITY CHECKLIST:
✅ Authentication (JWT/OAuth2/Session)
✅ Authorization (RBAC/ABAC)
✅ Input validation & sanitization
✅ SQL injection prevention
✅ XSS protection
✅ CSRF protection
✅ Rate limiting
✅ HTTPS everywhere
✅ Data encryption at rest & in transit
```

### Fase 3: MEMBUAT (Implementation)
*"Mewujudkan blueprint menjadi kode nyata"*

#### 3.1 Project Structure
```
project/
├── src/
│   ├── api/           # API layer
│   ├── domain/        # Business logic
│   ├── infrastructure/ # Database, cache, queue
│   └── shared/        # Utils, types, constants
├── tests/
├── docs/
└── deploy/
```

#### 3.2 Skeleton Implementation
1. Buat interface/type definitions DULU
2. Implementasi API layer
3. Implementasi domain logic
4. Implementasi infrastructure
5. Hubungkan semua layer

#### 3.3 Testing Architecture
```
TEST STRATEGY:
✅ Unit tests (setiap komponen)
✅ Integration tests (antar komponen)
✅ API tests (end-to-end)
✅ Load tests (performance)
```

### Fase 4: REVIEW & ITERASI
*"Arsitektur yang baik lahir dari iterasi"*

#### 4.1 Architecture Review Checklist
```
REVIEW CHECKLIST:

DESIGN:
[ ] Apakah setiap komponen punya single responsibility?
[ ] Apakah interfaces sudah clean?
[ ] Apakah data flow jelas?
[ ] Apakah security sudah dipertimbangkan?

SCALABILITY:
[ ] Bagaimana sistem akan scale?
[ ] Apa bottleneck-nya?
[ ] Apakah ada single point of failure?

MAINTAINABILITY:
[ ] Apakah kode mudah dibaca?
[ ] Apakah documentation cukup?
[ ] Apakah testing coverage memadai?
```

## 🧠 Architecture Decision Framework

```
SETIAP KEPUTUSAN ARSITEKTUR:
┌─────────────────────────────────────┐
│ KEPUTUSAN: [nama keputusan]         │
├─────────────────────────────────────┤
│ KONTEKS:                            │
│ Kenapa kita perlu membuat keputusan  │
│ ini? Apa yang mendorongnya?          │
├─────────────────────────────────────┤
│ OPSI YANG DIPERTIMBANGKAN:          │
│ 1. [Opsi A] — kelebihan/kekurangan  │
│ 2. [Opsi B] — kelebihan/kekurangan  │
│ 3. [Opsi C] — kelebihan/kekurangan  │
├─────────────────────────────────────┤
│ KEPUTUSAN: [opsi terpilih]          │
├─────────────────────────────────────┤
│ KONSEKUENSI:                        │
│ Positif: ...                         │
│ Negatif: ...                         │
└─────────────────────────────────────┘
```

## 💡 Studi Kasus Praktik

### 🏗️ Latihan 1: Aplikasi Sederhana (Minggu 1)
Buat arsitektur untuk **URL Shortener** (seperti bit.ly)

### 🏗️ Latihan 2: Aplikasi Menengah (Minggu 2)
Buat arsitektur untuk **E-commerce Platform**

### 🏗️ Latihan 3: Sistem Skala Besar (Minggu 3)
Buat arsitektur untuk **Sistem Chat Real-time** (seperti WhatsApp)

## 🔄 Workflow Harian Arsitektur

```
1. PAGI (15 menit): Planning
   /architecture-planner "rencanakan arsitektur [aplikasi]"

2. SIANG (30 menit): Design
   Gambar diagram, tulis ADR, desain schema

3. SORE (30 menit): Implementasi
   /design-architecture-loop (implementasi skeleton)

4. MALAM (15 menit): Review
   Review checklist + /code-documentation-code-explain
```

## 🔗 Integrasi dengan Skill Lain

| Situasi | Skill |
|---------|-------|
| Mulai perencanaan arsitektur | `/architecture-planner` |
| Implementasi iteratif | `/design-architecture-loop` |
| Review & iterasi | `/implement-review-loop` |
| Belajar fundamental arsitektur | `/learning-system-design` |
| Dokumentasi keputusan | `/teach` (ADR) |
