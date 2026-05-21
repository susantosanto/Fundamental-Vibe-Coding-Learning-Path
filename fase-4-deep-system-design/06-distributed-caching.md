# 06 — Distributed Caching

> **Estimasi:** 2 jam | **Level:** Advanced
> **Referensi:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — bagian Caching, Consistent Hashing, Redis

---

## 📖 TEORI MENDALAM

### Bagian 1: Mengapa Distributed Cache?

#### 1.1 Masalah yang Dipecahkan

Dalam sistem yang scale, database menjadi bottleneck karena:

```
┌──────────────────────────────────────────────────────────────┐
│                  TANPA CACHE (Masalah)                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [10,000 users] ──→ [App Server] ──→ [Database]              │
│                                                               │
│  Setiap request:                                              │
│  1. User buka halaman profil                                  │
│  2. App server query: SELECT * FROM users WHERE id = 123      │
│  3. Database scan index, fetch data dari disk                 │
│  4. Return data ke app server                                 │
│  5. App server render HTML, return ke user                    │
│                                                               │
│  Latency per request: ~50-200ms (database query)              │
│  Database connections: 10,000 concurrent                      │
│  Database CPU: 95%+ (overload!)                               │
│  Disk I/O: Maxed out                                          │
│                                                               │
│  → Database jadi bottleneck                                   │
│  → Response time melambat                                     │
│  → User experience buruk                                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  DENGAN CACHE (Solusi)                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [10,000 users] ──→ [App Server] ──→ [Redis Cache]           │
│                                        │                     │
│                                        │ (miss)              │
│                                        ▼                     │
│                                   [Database]                 │
│                                                               │
│  Request pertama (cache miss):                                │
│  1. Query ke Redis → MISS                                     │
│  2. Query ke Database → hit (50ms)                            │
│  3. Simpan ke Redis (TTL 1 jam)                               │
│  4. Return ke user                                            │
│                                                               │
│  Request selanjutnya (cache hit):                             │
│  1. Query ke Redis → HIT (0.5ms!)                             │
│  2. Return ke user                                            │
│                                                               │
│  Cache hit ratio: 95%+                                        │
│  Database load: turun 95%                                     │
│  Response time: 0.5ms (cache) vs 50ms (DB)                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 1.2 Kapan Pakai Distributed Cache?

| Skenario | Kenapa Cache? |
|----------|---------------|
| **Read-heavy workload** | 90%+ read, data jarang berubah |
| **Expensive queries** | Query kompleks, agregasi, join banyak tabel |
| **Session storage** | User session perlu diakses cepat |
| **Rate limiting** | Counter perlu fast increment |
| **Real-time data** | Leaderboard, live stats |
| **API response caching** | Response yang sama untuk banyak user |

#### 1.3 Single Node vs Distributed Cache

```
┌──────────────────────────────────────────────────────────────┐
│               SINGLE NODE CACHE (Terbatas)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [App Servers] ──→ [Single Redis Node]                       │
│                      Memory: 64GB                             │
│                      Max keys: ~10 juta                       │
│                      Max QPS: ~100,000                        │
│                                                               │
│  Masalah:                                                     │
│  - Single point of failure                                    │
│  - Memory terbatas                                            │
│  - Network bandwidth terbatas                                 │
│  - Tidak bisa scale horizontal                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│             DISTRIBUTED CACHE (Scalable)                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [App Servers] ──→ [Redis Node 1] [Redis Node 2] [Node 3]    │
│                    Memory: 64GB   64GB        64GB           │
│                    Total: 192GB memory                        │
│                    Total: ~30 juta keys                       │
│                    Total: ~300,000 QPS                        │
│                                                               │
│  Keuntungan:                                                  │
│  - Scale horizontal (tambah node = tambah capacity)           │
│  - High availability (node down ≠ cache down)                 │
│  - Memory pool besar                                          │
│  - Throughput lebih tinggi                                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 2: Consistent Hashing

#### 2.1 Masalah Hashing Biasa

Hashing biasa (`hash(key) % N`) punya masalah besar saat node ditambah/dikurangi:

```
┌──────────────────────────────────────────────────────────────┐
│             MASALAH TRADITIONAL HASHING                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  3 Nodes: hash(key) % 3                                       │
│  "user:1"   → hash("user:1") % 3 = 2 → Node 2                │
│  "user:2"   → hash("user:2") % 3 = 0 → Node 0                │
│  "user:3"   → hash("user:3") % 3 = 1 → Node 1                │
│  "user:4"   → hash("user:4") % 3 = 2 → Node 2                │
│                                                               │
│  Tambah Node ke-4: hash(key) % 4                              │
│  "user:1"   → hash("user:1") % 4 = 2 → Node 2 (sama) ✅      │
│  "user:2"   → hash("user:2") % 4 = 0 → Node 0 (sama) ✅      │
│  "user:3"   → hash("user:3") % 4 = 3 → Node 3 (BERPINDAH!) ❌│
│  "user:4"   → hash("user:4") % 4 = 1 → Node 1 (BERPINDAH!) ❌│
│                                                               │
│  → 50% keys harus dipindah!                                   │
│  → Cache miss massal                                          │
│  → Database overload saat rehash                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2.2 Consistent Hashing — Solusi

Consistent hashing memetakan keys dan nodes ke **hash ring** (lingkaran 0 sampai 2^32 - 1).

```
┌──────────────────────────────────────────────────────────────┐
│                  CONSISTENT HASH RING                        │
│                                                               │
│                     (hash space: 0..2^32-1)                  │
│                                                               │
│                          0° / 2^32                            │
│                            │                                  │
│                    ┌───────┴───────┐                          │
│                    │               │                          │
│              Node A │               │ Node B                   │
│           (hash:100)│               │(hash:800)                │
│                    │               │                          │
│                    │               │                          │
│         key:"x"    │               │    key:"y"               │
│        (hash:50)   │               │   (hash:500)             │
│          ↓         │               │      ↓                   │
│          └─────────┼───────────────┼──────┘                   │
│                    │               │                          │
│                    │               │                          │
│              Node D │               │ Node C                   │
│          (hash:1200)│               │(hash:1500)               │
│                    │               │                          │
│                    └───────┬───────┘                          │
│                            │                                  │
│                        1800°                                   │
│                                                               │
│  Aturan: key pergi ke node PERTAMA searah jarum jam           │
│                                                               │
│  key:"x" (hash:50)   → Node A (hash:100)  ← terdekat CW      │
│  key:"y" (hash:500)  → Node B (hash:800)  ← terdekat CW      │
│  key:"z" (hash:900)  → Node C (hash:1500) ← terdekat CW      │
│  key:"w" (hash:1300) → Node C (hash:1500) ← terdekat CW      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Saat Node Ditambah:**

```
┌──────────────────────────────────────────────────────────────┐
│           CONSISTENT HASHING — ADD NODE                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Sebelum (3 nodes):                                           │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Node A (100) → Node B (800) → Node C (1500)        │     │
│  │                                                       │     │
│  │  Range A: 1501..100   (handles keys hash 1501-100)   │     │
│  │  Range B: 101..800    (handles keys hash 101-800)    │     │
│  │  Range C: 801..1500   (handles keys hash 801-1500)   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Tambah Node D (hash: 1200):                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Node A (100) → Node B (800) → Node D (1200)        │     │
│  │                          → Node C (1500)             │     │
│  │                                                       │     │
│  │  Range A: 1501..100   (TIDAK BERUBAH) ✅             │     │
│  │  Range B: 101..800    (TIDAK BERUBAH) ✅             │     │
│  │  Range D: 801..1200   (BARU — ambil dari C)          │     │
│  │  Range C: 1201..1500  (MENYUSUT — hanya 300)         │     │
│  │                                                       │     │
│  │  → Hanya keys di range 801-1200 yang berpindah!      │     │
│  │  → ~17% keys affected, bukan 75%                     │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2.3 Virtual Nodes

Masalah: Dengan sedikit node, distribusi tidak merata. Solusi: **Virtual Nodes**.

```
┌──────────────────────────────────────────────────────────────┐
│                    VIRTUAL NODES                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Tanpa Virtual Nodes (3 physical nodes):                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Node A (100) ──────→ Node B (800) ──→ Node C (1500)│     │
│  │                                                       │     │
│  │  Range A: 1600 keys  (53%)                           │     │
│  │  Range B: 700 keys   (23%)  ← tidak merata!          │     │
│  │  Range C: 700 keys   (23%)                           │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Dengan Virtual Nodes (3 physical × 100 virtual = 300):      │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  A-1, A-2, A-3, ..., A-100                          │     │
│  │  B-1, B-2, B-3, ..., B-100                          │     │
│  │  C-1, C-2, C-3, ..., C-100                          │     │
│  │                                                       │     │
│  │  Setiap physical node punya 100 virtual nodes        │     │
│  │  yang tersebar di hash ring                          │     │
│  │                                                       │     │
│  │  Range A: ~1000 keys (33%)  ← merata! ✅             │     │
│  │  Range B: ~1000 keys (33%)                           │     │
│  │  Range C: ~1000 keys (33%)                           │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Kode Implementasi:                                           │
│                                                               │
│  class ConsistentHash:                                        │
│      def __init__(self, nodes, virtual_nodes=150):            │
│          self.ring = SortedDict()                             │
│          self.node_map = {}                                   │
│                                                               │
│          for node in nodes:                                   │
│              for i in range(virtual_nodes):                   │
│                  # Hash virtual node ke ring                  │
│                  vnode_hash = hash(f"{node}-{i}")             │
│                  self.ring[vnode_hash] = node                 │
│                  self.node_map[vnode_hash] = node             │
│                                                               │
│      def get_node(self, key):                                 │
│          key_hash = hash(key)                                 │
│          # Cari node pertama searah jarum jam                 │
│          idx = self.ring.bisect_right(key_hash)               │
│          if idx == len(self.ring):                            │
│              idx = 0  # Wrap around                           │
│          return self.ring[self.ring.keys()[idx]]              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 3: Cache Clustering dan Replication

#### 3.1 Redis Cluster Architecture

Redis Cluster menggunakan **hash slots** (bukan consistent hashing murni).

```
┌──────────────────────────────────────────────────────────────┐
│                   REDIS CLUSTER                              │
│              16384 Hash Slots (0-16383)                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  Master Nodes                         │     │
│  │                                                       │     │
│  │  Node A (Master)  → Slots 0-5460                      │     │
│  │  Node B (Master)  → Slots 5461-10922                  │     │
│  │  Node C (Master)  → Slots 10923-16383                 │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  Replica Nodes                        │     │
│  │                                                       │     │
│  │  Node A' (Replica of A) → Slots 0-5460               │     │
│  │  Node B' (Replica of B) → Slots 5461-10922           │     │
│  │  Node C' (Replica of C) → Slots 10923-16383          │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Key Distribution:                                            │
│  hash_slot = CRC16(key) % 16384                               │
│                                                               │
│  "user:123" → CRC16("user:123") % 16384 = 3421 → Node A      │
│  "order:456" → CRC16("order:456") % 16384 = 8923 → Node B    │
│  "product:789" → CRC16("product:789") % 16384 = 12000 → C    │
│                                                               │
│  Failover:                                                    │
│  Node A down → Node A' otomatis jadi master                   │
│  Cluster tetap beroperasi (no single point of failure)        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3.2 Redis Cluster — Hash Slot Migration

Saat menambah node, hash slots dipindah secara incremental:

```
┌──────────────────────────────────────────────────────────────┐
│            RESHARDING — TAMBAH NODE D                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Sebelum:                                                     │
│  A: 0-5460 (5461 slots)                                       │
│  B: 5461-10922 (5462 slots)                                   │
│  C: 10923-16383 (5461 slots)                                  │
│                                                               │
│  Tambah Node D: ambil ~4096 slots dari masing-masing         │
│                                                               │
│  Sesudah:                                                     │
│  A: 0-4095 (4096 slots)    [-1365 slots]                      │
│  B: 5461-9556 (4096 slots) [-1366 slots]                      │
│  C: 10923-15018 (4096 slots)[-1365 slots]                     │
│  D: 4096-5460, 9557-10922, 15019-16383 (4096 slots)          │
│                                                               │
│  Migrasi dilakukan per-slot, tidak sekaligus:                 │
│  1. Ambil slot 4096 dari A                                    │
│  2. Copy semua keys di slot 4096 ke D                         │
│  3. Update cluster config: slot 4096 → D                      │
│  4. Ulangi untuk slot berikutnya                              │
│  5. Selama migrasi, slot tetap accessible                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3.3 Cache Replication Patterns

```
┌──────────────────────────────────────────────────────────────┐
│              REPLICATION PATTERNS                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. MASTER-REPLICA (Redis default)                           │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  [Master] ──async──→ [Replica 1]                     │     │
│  │     │                    │                            │     │
│  │     └──────async──────→ [Replica 2]                  │     │
│  │                                                       │     │
│  │  Write → Master only                                  │     │
│  │  Read  → Master atau Replica                          │     │
│  │  Repl lag: ~1-10ms (async)                            │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  2. SYNC REPLICATION (stronger consistency)                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  [Client] → [Coordinator] ──→ [Node A]               │     │
│  │                        ──→ [Node B]                  │     │
│  │                        ──→ [Node C]                  │     │
│  │                                                       │     │
│  │  Write: tunggu majority (2/3) acknowledge             │     │
│  │  Read: bisa dari node mana saja                       │     │
│  │  Consistency: lebih kuat, tapi latency lebih tinggi   │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  3. MULTI-MASTER (Memcached auto-discovery)                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  [Node A] ←──sync──→ [Node B]                        │     │
│  │     ↑                      ↑                         │     │
│  │     │                      │                         │     │
│  │     └──────sync──────→ [Node C]                      │     │
│  │                                                       │     │
│  │  Write → Node mana saja                               │     │
│  │  Sync → eventual consistency antar node               │     │
│  │  Conflict resolution: last-write-wins                 │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 4: Cache Partitioning

#### 4.1 Strategi Partitioning

```
┌──────────────────────────────────────────────────────────────┐
│              CACHE PARTITIONING STRATEGIES                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. HASH-BASED PARTITIONING (Redis Cluster)                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  hash_slot = CRC16(key) % 16384                     │     │
│  │                                                       │     │
│  │  Keuntungan:                                          │     │
│  │  - Distribusi merata                                  │     │
│  │  - Lookup O(1)                                        │     │
│  │  - Auto-rebalancing                                   │     │
│  │                                                       │     │
│  │  Kerugian:                                            │     │
│  │  - Multi-key ops sulit (keys beda slot)               │     │
│  │  - Hash tags diperlukan untuk co-locate keys          │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  2. RANGE-BASED PARTITIONING                                 │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Node A: keys "a" - "f"                             │     │
│  │  Node B: keys "g" - "m"                             │     │
│  │  Node C: keys "n" - "z"                             │     │
│  │                                                       │     │
│  │  Keuntungan:                                          │     │
│  │  - Range queries mudah                                │     │
│  │  - SCAN by prefix efisien                             │     │
│  │                                                       │     │
│  │  Kerugian:                                            │     │
│  │  - Hot spot jika data tidak merata                    │     │
│  │  - Rebalancing kompleks                               │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  3. DIRECTORY-BASED PARTITIONING                             │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  [Lookup Service]                                   │     │
│  │     │                                               │     │
│  │     ├── "user:123" → Node A                         │     │
│  │     ├── "user:456" → Node B                         │     │
│  │     ├── "order:789" → Node C                        │     │
│  │                                                       │     │
│  │  Keuntungan:                                          │     │
│  │  - Fleksibel, bisa arbitrary mapping                  │     │
│  │  - Mudah rebalance                                    │     │
│  │                                                       │     │
│  │  Kerugian:                                            │     │
│  │  - Single point of failure (lookup service)           │     │
│  │  - Extra hop untuk lookup                             │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 4.2 Hash Tags di Redis

```
# Hash tags memaksa keys ke slot yang sama
# Format: {tag} dalam key

"user:123:profile"     → hash_slot = CRC16("user:123:profile") % 16384
"user:123:orders"      → hash_slot = CRC16("user:123:orders") % 16384
# → Bisa beda slot! Tidak bisa MULTI-KEY transaction

"{user:123}:profile"   → hash_slot = CRC16("user:123") % 16384
"{user:123}:orders"    → hash_slot = CRC16("user:123") % 16384
# → SAMA SLOT! Bisa MULTI-KEY transaction ✅

# Contoh penggunaan:
redis.multi()
    .set("{user:123}:profile", profile_data)
    .set("{user:123}:orders", orders_data)
    .sadd("{user:123}:tags", "premium", "active")
    .exec()
```

---

### Bagian 5: Cache Coherence dan Consistency

#### 5.1 Cache Invalidation Patterns

```
┌──────────────────────────────────────────────────────────────┐
│            CACHE INVALIDATION STRATEGIES                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. CACHE-ASIDE (Lazy Loading) — PALING UMUM                 │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  READ:                                                │     │
│  │  1. Cek cache → jika HIT, return                      │     │
│  │  2. Jika MISS, query database                         │     │
│  │  3. Simpan ke cache dengan TTL                        │     │
│  │  4. Return data                                       │     │
│  │                                                       │     │
│  │  WRITE:                                               │     │
│  │  1. Update database                                   │     │
│  │  2. INVALIDATE cache (hapus key)                      │     │
│  │  3. Next read akan cache miss → load dari DB          │     │
│  │                                                       │     │
│  │  Keuntungan: simple, eventual consistency OK          │     │
│  │  Kerugian: cache miss setelah write                   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  2. WRITE-THROUGH                                            │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  WRITE:                                               │     │
│  │  1. Update cache                                      │     │
│  │  2. Cache同步 update database                         │     │
│  │  3. Return setelah keduanya sukses                    │     │
│  │                                                       │     │
│  │  Keuntungan: cache selalu fresh                       │     │
│  │  Kerugian: write lebih lambat (2 operasi)             │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  3. WRITE-BEHIND (Write-Back)                                │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  WRITE:                                               │     │
│  │  1. Update cache                                      │     │
│  │  2. Return langsung (async flush ke DB)               │     │
│  │  3. Background thread flush ke DB secara batch        │     │
│  │                                                       │     │
│  │  Keuntungan: write sangat cepat                       │     │
│  │  Kerugian: data loss jika cache crash sebelum flush   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  4. REFRESH-AHEAD                                            │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Background thread refresh cache SEBELUM expire       │     │
│  │  (misal: TTL 1 jam, refresh di menit ke-55)           │     │
│  │                                                       │     │
│  │  Keuntungan: user tidak pernah kena cache miss        │     │
│  │  Kerugian: waste resource untuk data tidak diakses    │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 5.2 Cache Consistency Problem — Thundering Herd

```
┌──────────────────────────────────────────────────────────────┐
│              THUNDERING HERD / CACHE STAMPEDE                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Masalah:                                                     │
│  Cache key "user:123" expire. 1000 request bersamaan.         │
│  Semua 1000 request kena cache MISS.                          │
│  Semua 1000 request query database bersamaan.                 │
│  Database overload → crash!                                   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  T0: Cache key "user:123" expire                      │     │
│  │  T1: 1000 requests masuk bersamaan                    │     │
│  │  T2: 1000 cache misses                                │     │
│  │  T3: 1000 queries ke database → BOOM!                 │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Solusi 1: LOCKING (Single Flight)                           │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Request pertama yang kena miss:                      │     │
│  │  1. Ambil lock untuk key "user:123"                   │     │
│  │  2. Query database                                    │     │
│  │  3. Simpan ke cache                                   │     │
│  │  4. Release lock                                      │     │
│  │                                                       │     │
│  │  Request selanjutnya (sambil nunggu lock):            │     │
│  │  1. Cek lock → ada yang sedang load                   │     │
│  │  2. Tunggu (blocking) atau return stale data          │     │
│  │  3. Setelah lock release, cache sudah ada → HIT       │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Solusi 2: PROBABILISTIC EARLY EXPIRATION                    │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  TTL = 1 jam, tapi randomize expiration:              │     │
│  │  actual_ttl = base_ttl + random(0, jitter)            │     │
│  │                                                       │     │
│  │  Atau: early refresh dengan probabilitas              │     │
│  │  if (time_left < 5 menit) and (random() < 0.1):       │     │
│  │      refresh_cache()  # 10% chance refresh early      │     │
│  │                                                       │     │
│  │  → Expiration tersebar, tidak bersamaan               │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Solusi 3: STALE-WHILE-REVALIDATE                            │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Cache key punya 2 TTL:                               │     │
│  │  - fresh_until: 55 menit (data fresh)                 │     │
│  │  - stale_until: 65 menit (data stale tapi usable)     │     │
│  │                                                       │     │
│  │  Saat request di menit 56-65:                         │     │
│  │  1. Return stale data (cepat!)                        │     │
│  │  2. Background refresh cache                          │     │
│  │  3. Next request dapat data fresh                     │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 6: Cache Warming Strategies

#### 6.1 Strategi Warming

```
┌──────────────────────────────────────────────────────────────┐
│                  CACHE WARMING STRATEGIES                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. STARTUP WARMING (Pre-load saat deploy)                   │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Saat deploy baru:                                    │     │
│  │  1. Query data populer dari database                  │     │
│  │     SELECT * FROM products ORDER BY views DESC        │     │
│  │     LIMIT 10000                                       │     │
│  │  2. Simpan ke Redis                                   │     │
│  │     for product in popular_products:                  │     │
│  │         redis.set(f"product:{product.id}",            │     │
│  │                   json.dumps(product), ex=3600)       │     │
│  │  3. Baru start aplikasi                               │     │
│  │                                                       │     │
│  │  → Cache miss ≈ 0 saat user pertama akses             │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  2. TRAFFIC REPLAY WARMING                                   │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  1. Record traffic patterns (access logs)             │     │
│  │  2. Identifikasi keys paling sering diakses           │     │
│  │  3. Pre-load keys tersebut ke cache                   │     │
│  │                                                       │     │
│  │  Tools: tcpcopy, GoReplay, custom log analyzer        │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  3. PREDICTIVE WARMING                                       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Gunakan ML untuk prediksi data yang akan diakses:    │     │
│  │  - Waktu tertentu → data tertentu populer             │     │
│  │    (misal: pagi hari → absensi data)                  │     │
│  │  - Event tertentu → data tertentu naik                │     │
│  │    (misal: flash sale → product data)                 │     │
│  │                                                       │     │
│  │  Schedule warming job sebelum peak hours              │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  4. LAZY WARMING (On-demand)                                 │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Tidak pre-load. Biarkan cache miss pertama           │     │
│  │  load data, lalu cache untuk selanjutnya.             │     │
│  │                                                       │     │
│  │  Cocok untuk:                                         │     │
│  │  - Data yang access pattern tidak predictable         │     │
│  │  - Dataset terlalu besar untuk pre-load               │     │
│  │  - TTL pendek (data cepat berubah)                    │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 7: Real-World — Twitter & Facebook

#### 7.1 Twitter Cache Architecture

```
┌──────────────────────────────────────────────────────────────┐
│            TWITTER — HOW THEY USE CACHING                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Twitter menghadapi masalah unik:                             │
│  - 500+ juta tweets per hari                                  │
│  - Timeline harus real-time                                   │
│  - Read >> Write (baca timeline >> post tweet)                │
│  - Celebrity tweets → jutaan followers                       │
│                                                               │
│  Fan-out on Write (untuk user dengan followers sedikit):      │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  User A (100 followers) post tweet:                   │     │
│  │  1. Simpan tweet ke DB                                │     │
│  │  2. Push tweet ke cache timeline 100 followers        │     │
│  │     for follower in followers:                        │     │
│  │         redis.lpush(f"timeline:{follower.id}",        │     │
│  │                     tweet_id)                         │     │
│  │  3. Timeline follower sudah ready (fast read!)        │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Fan-out on Load (untuk celebrity dengan jutaan followers):   │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Celebrity (10M followers) post tweet:                │     │
│  │  1. Simpan tweet ke DB                                │     │
│  │  2. JANGAN push ke 10M follower (terlalu mahal!)      │     │
│  │  3. Saat follower buka timeline:                      │     │
│  │     a. Load tweets dari cache (fan-out on write)      │     │
│  │     b. Query tweets celebrity dari DB (fan-out load)  │     │
│  │     c. Merge dan sort by time                         │     │
│  │     d. Cache hasil merge                              │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Multi-layer Cache di Twitter:                                │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  L1: Local cache (in-process, per server)             │     │
│  │      - Data yang sangat sering diakses                │     │
│  │      - TTL sangat pendek (detik)                      │     │
│  │      - Latency: < 0.1ms                               │     │
│  │                                                       │     │
│  │  L2: Memcached cluster (distributed)                  │     │
│  │      - Timeline cache                                 │     │
│  │      - User profile cache                             │     │
│  │      - Latency: ~1ms                                  │     │
│  │                                                       │     │
│  │  L3: Database (Manhattan — Twitter's own DB)          │     │
│  │      - Persistent storage                             │     │
│  │      - Latency: ~10-50ms                              │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 7.2 Facebook Cache Architecture

```
┌──────────────────────────────────────────────────────────────┐
│            FACEBOOK — TAO (The Associations and Objects)     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Facebook membuat TAO — distributed data store untuk graph:   │
│                                                               │
│  Objects: User, Post, Photo, Comment, Page                    │
│  Associations: likes, comments, friends, shares               │
│                                                               │
│  TAO Architecture:                                            │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  [App Servers]                                        │     │
│  │       │                                               │     │
│  │       ├──→ [TAO Leader] ──→ [MySQL (persistent)]      │     │
│  │       │       │                                       │     │
│  │       │       └──→ [TAO Followers] (cache)            │     │
│  │       │                                               │     │
│  │       └──→ [Memcached Cluster] (object cache)         │     │
│  │                                                       │     │
│  │  Write path:                                          │     │
│  │  App → TAO Leader → MySQL → invalidate Memcached      │     │
│  │                                                       │     │
│  │  Read path:                                           │     │
│  │  App → Memcached (HIT) → return                       │     │
│  │      → Memcached (MISS) → TAO Follower → MySQL        │     │
│  │                                                       │     │
│  │  Cache coherence:                                     │     │
│  │  - Write invalidate cache entries                     │     │
│  │  - Followers subscribe to Leader updates              │     │
│  │  - Consistency: eventual (read-your-writes guaranteed)│     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Facebook juga pakai:                                         │
│  - McRouter: proxy untuk Memcached, routing requests          │
│  - ZippyDB: distributed key-value store (RocksDB based)       │
│  - CacheBench: benchmarking tool untuk cache strategies       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 8: Redis Data Structures untuk Caching

#### 8.1 Struktur Data dan Use Cases

```
┌──────────────────────────────────────────────────────────────┐
│              REDIS DATA STRUCTURES                           │
├──────────────────┬───────────────────────────────────────────┤
│ Structure        │ Use Case & Contoh                         │
├──────────────────┼───────────────────────────────────────────┤
│ STRING           │ Simple cache, session, counter            │
│                  │ SET user:123 "{json}" EX 3600             │
│                  │ GET user:123                              │
│                  │ INCR page_views:article:456               │
├──────────────────┼───────────────────────────────────────────┤
│ HASH             │ Object caching (lebih efisien)            │
│                  │ HSET user:123 name "Budi" email "b@x.id"  │
│                  │ HGETALL user:123                          │
│                  │ HGET user:123 name                        │
├──────────────────┼───────────────────────────────────────────┤
│ LIST             │ Queue, recent items, timeline             │
│                  │ LPUSH timeline:user:123 tweet:1 tweet:2   │
│                  │ LRANGE timeline:user:123 0 19             │
│                  │ (20 tweet terbaru)                        │
├──────────────────┼───────────────────────────────────────────┤
│ SET              │ Unique items, tags, followers             │
│                  │ SADD tags:article:456 "tech" "ai" "web"   │
│                  │ SMEMBERS tags:article:456                 │
│                  │ SINTER tags:article:456 tags:article:789  │
│                  │ (common tags)                             │
├──────────────────┼───────────────────────────────────────────┤
│ SORTED SET       │ Leaderboard, ranking, priority queue      │
│                  │ ZADD leaderboard 1500 "user:A" 1200 "B"   │
│                  │ ZREVRANGE leaderboard 0 9 WITHSCORES      │
│                  │ (top 10 leaderboard)                      │
├──────────────────┼───────────────────────────────────────────┤
│ BITMAP           │ DAU/MAU, feature flags, presence          │
│                  │ SETBIT dau:2026-05-21 user_id 1           │
│                  │ BITCOUNT dau:2026-05-21                   │
│                  │ (count unique active users)               │
├──────────────────┼───────────────────────────────────────────┤
│ HYPERLOGLOG      │ Cardinality estimation (unique count)     │
│                  │ PFADD unique_visitors user_1 user_2       │
│                  │ PFCOUNT unique_visitors                   │
│                  │ (~unique count, 0.81% error, 12KB max)    │
├──────────────────┼───────────────────────────────────────────┤
│ GEO              │ Location-based queries                    │
│                  │ GEOADD locations 107.6 -6.9 "Bandung"     │
│                  │ GEORADIUS locations 107.6 -6.9 50 km      │
│                  │ (places within 50km)                      │
└──────────────────┴───────────────────────────────────────────┘
```

---

## ✅ CHECKLIST PEMAHAMAN

- [ ] Paham kenapa distributed cache diperlukan
- [ ] Paham consistent hashing dan virtual nodes
- [ ] Paham Redis Cluster dan hash slots
- [ ] Paham cache replication patterns (master-replica, sync, multi-master)
- [ ] Paham cache partitioning strategies
- [ ] Paham cache invalidation patterns (cache-aside, write-through, write-behind)
- [ ] Paham thundering herd dan solusinya
- [ ] Paham cache warming strategies
- [ ] Tahu bagaimana Twitter dan Facebook menggunakan distributed caching
- [ ] Paham Redis data structures dan use cases
- [ ] Bisa memilih cache pattern yang tepat untuk use case tertentu

---

## 📚 REFERENSI

- [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — Caching, Consistent Hashing
- [Redis Cluster Specification](https://redis.io/docs/reference/cluster-spec/)
- [Twitter Engineering — Caching at Twitter](https://blog.twitter.com/engineering)
- [Facebook Engineering — Tao: Distributed Data Store](https://engineering.fb.com/)
- [Martin Kleppmann — Designing Data-Intensive Applications](https://dataintensive.net/) — Chapter 6 (Partitioning)

---

> **Lanjut ke:** [`07-observability-monitoring.md`](./07-observability-monitoring.md)
