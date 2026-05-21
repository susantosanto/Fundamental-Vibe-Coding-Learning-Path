# 07 — Observability & Monitoring

> **Estimasi:** 2 jam | **Level:** Advanced
> **Referensi:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — bagian Monitoring, Alerting

---

## 📖 TEORI MENDALAM

### Bagian 1: Tiga Pilar Observability

#### 1.1 Apa Itu Observability?

Observability adalah kemampuan untuk **memahami state internal sistem** dari output yang dihasilkannya. Bukan sekadar monitoring — monitoring memberitahu KETIKA ada masalah, observability memberitahu KENAPA ada masalah.

```
┌──────────────────────────────────────────────────────────────┐
│              MONITORING vs OBSERVABILITY                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  MONITORING (Reactive):                                       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  "CPU usage 95%!" — tapi kenapa?                     │     │
│  │  "Error rate naik!" — error apa? dari mana?          │     │
│  │  "Response time lambat!" — service mana yang lambat? │     │
│  │                                                       │     │
│  │  → Tahu ADA masalah, tapi tidak tahu KENAPA           │     │
│  │  → Perlu login ke server, grep logs, debug manual     │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  OBSERVABILITY (Proactive + Diagnostic):                      │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  "Error rate naik karena PaymentService timeout      │     │
│  │   saat query ke database replica-3 yang lag 5 detik. │     │
│  │   Trace ID: abc-123, affected 15% requests."         │     │
│  │                                                       │     │
│  │  → Tahu ADA masalah + KENAPA + DI MANA + SEBERAPA    │     │
│  │  → Bisa debug tanpa login ke server                   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 1.2 Tiga Pilar Observability

```
┌──────────────────────────────────────────────────────────────┐
│                   3 PILAR OBSERVABILITY                      │
│                                                               │
│         ┌─────────────┐                                      │
│         │   METRICS   │  ← "Apa yang terjadi?"               │
│         │  (Angka)    │     CPU 95%, RPS 1000, Error 2%      │
│         └──────┬──────┘                                      │
│                │                                              │
│    ┌───────────┼───────────┐                                  │
│    ▼                       ▼                                  │
│ ┌──────────┐         ┌──────────┐                             │
│ │  LOGS    │         │  TRACES  │                             │
│ │ (Detail) │         │ (Alur)   │                             │
│ │          │         │          │                             │
│ │ "Error:  │         │ Request  │                             │
│ │  timeout │         │ → A → B  │                             │
│ │  at      │         │   → C    │                             │
│ │  line 42"│         │ total:   │                             │
│ │          │         │ 250ms    │                             │
│ └──────────┘         └──────────┘                             │
│                                                               │
│  METRICS = WHAT (apa yang terjadi, tren, alert)               │
│  LOGS    = WHY  (detail error, debug, audit trail)            │
│  TRACES  = WHERE (alur request, bottleneck, dependency)       │
│                                                               │
│  Ketiganya saling melengkapi!                                 │
│  Metrics → alert ada masalah                                  │
│  Traces  → tahu service mana yang bermasalah                  │
│  Logs    → tahu kenapa service bermasalah                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 2: Metrics — Prometheus & Grafana

#### 2.1 Types of Metrics

```
┌──────────────────────────────────────────────────────────────┐
│                  METRIC TYPES (Prometheus)                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. COUNTER — Angka yang HANYA naik (tidak pernah turun)     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Contoh: total_requests, total_errors, bytes_sent     │     │
│  │                                                       │     │
│  │  # Prometheus metric definition                       │     │
│  │  http_requests_total{method="GET", status="200"} 1523 │     │
│  │  http_requests_total{method="GET", status="500"} 42   │     │
│  │                                                       │     │
│  │  # Query: rate per detik                              │     │
│  │  rate(http_requests_total[5m])                        │     │
│  │  → 150 requests/detik                                 │     │
│  │                                                       │     │
│  │  # Query: error rate                                  │     │
│  │  rate(http_requests_total{status="500"}[5m])          │     │
│  │  /                                                    │     │
│  │  rate(http_requests_total[5m])                        │     │
│  │  → 0.02 (2% error rate)                               │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  2. GAUGE — Angka yang bisa naik DAN turun                   │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Contoh: cpu_usage, memory_usage, active_connections  │     │
│  │                                                       │     │
│  │  node_cpu_usage_percent{host="web-1"} 75.3            │     │
│  │  node_memory_usage_bytes{host="web-1"} 6442450944     │     │
│  │  db_active_connections{db="postgres"} 45              │     │
│  │                                                       │     │
│  │  # Query: rata-rata CPU 1 jam terakhir                │     │
│  │  avg_over_time(node_cpu_usage_percent[1h])            │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  3. HISTOGRAM — Distribusi nilai (untuk latency, size)       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Contoh: request_duration, response_size              │     │
│  │                                                       │     │
│  │  # Bucket counts                                      │     │
│  │  http_request_duration_seconds_bucket{le="0.1"} 500   │     │
│  │  http_request_duration_seconds_bucket{le="0.25"} 800  │     │
│  │  http_request_duration_seconds_bucket{le="0.5"} 950   │     │
│  │  http_request_duration_seconds_bucket{le="1.0"} 990   │     │
│  │  http_request_duration_seconds_bucket{le="+Inf"} 1000 │     │
│  │                                                       │     │
│  │  # Query: p99 latency                                 │     │
│  │  histogram_quantile(0.99,                             │     │
│  │    rate(http_request_duration_seconds_bucket[5m]))    │     │
│  │  → 0.45s (99% requests selesai dalam 450ms)           │     │
│  │                                                       │     │
│  │  # Query: p50 (median)                                │     │
│  │  histogram_quantile(0.50,                             │     │
│  │    rate(http_request_duration_seconds_bucket[5m]))    │     │
│  │  → 0.08s (median request 80ms)                        │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  4. SUMMARY — Mirip histogram, tapi quantile dihitung client │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  http_request_duration_seconds{quantile="0.5"} 0.08   │     │
│  │  http_request_duration_seconds{quantile="0.9"} 0.25   │     │
│  │  http_request_duration_seconds{quantile="0.99"} 0.45  │     │
│  │  http_request_duration_seconds_sum 125.3              │     │
│  │  http_request_duration_seconds_count 1000             │     │
│  │                                                       │     │
│  │  Bedanya dengan histogram:                            │     │
│  │  - Histogram: aggregatable (bisa gabung dari banyak   │     │
│  │    instance), quantile dihitung di query time         │     │
│  │  - Summary: quantile lebih akurat, tapi tidak bisa    │     │
│  │    di-aggregate across instances                      │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2.2 Prometheus Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                PROMETHEUS ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              [Application Servers]                   │     │
│  │                                                       │     │
│  │  App Server 1 ──→ /metrics endpoint                  │     │
│  │  App Server 2 ──→ /metrics endpoint                  │     │
│  │  App Server 3 ──→ /metrics endpoint                  │     │
│  │                                                       │     │
│  │  Setiap app expose metrics di HTTP endpoint:          │     │
│  │  GET http://app-server:8080/metrics                   │     │
│  │                                                       │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                    PULL (scrape)                              │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  Prometheus Server                   │     │
│  │                                                       │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │     │
│  │  │  Scrape      │  │  TSDB        │  │  PromQL    │ │     │
│  │  │  Manager     │→ │  (Time       │→ │  Query     │ │     │
│  │  │              │  │  Series DB)  │  │  Engine    │ │     │
│  │  │  - Discover  │  │              │  │            │ │     │
│  │  │  - Fetch     │  │  - Local     │  │  - rate()  │ │     │
│  │  │  - Parse     │  │    storage   │  │  - sum()   │ │     │
│  │  │  - Store     │  │  - WAL       │  │  - avg()   │ │     │
│  │  └──────────────┘  └──────────────┘  └──────┬─────┘ │     │
│  │                                              │       │     │
│  └──────────────────────────────────────────────┼───────┘     │
│                                                 │             │
│                                                 ▼             │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  Alertmanager                        │     │
│  │                                                       │     │
│  │  - Terima alert dari Prometheus                      │     │
│  │  - Deduplicate, group, route                         │     │
│  │  - Kirim ke: PagerDuty, Slack, Email, Webhook        │     │
│  │  - Silencing, inhibition rules                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                    Grafana                           │     │
│  │                                                       │     │
│  │  - Dashboard visualisasi                             │     │
│  │  - Query Prometheus via PromQL                       │     │
│  │  - Alert rules (bisa juga dari Grafana)              │     │
│  │  - Multi-source: Prometheus, Loki, Elasticsearch     │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2.3 Instrumentasi Aplikasi

```python
# Python — menggunakan prometheus_client
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time
import requests

# Define metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

ACTIVE_REQUESTS = Gauge(
    'http_active_requests',
    'Currently active HTTP requests',
    ['method', 'endpoint']
)

DB_QUERY_DURATION = Histogram(
    'db_query_duration_seconds',
    'Database query duration',
    ['table', 'operation'],
    buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0]
)

CACHE_HIT_TOTAL = Counter(
    'cache_hits_total',
    'Total cache hits',
    ['cache_name']
)

CACHE_MISS_TOTAL = Counter(
    'cache_misses_total',
    'Total cache misses',
    ['cache_name']
)

# Middleware untuk instrumentasi
def metrics_middleware(request):
    """Middleware yang mencatat metrics untuk setiap request"""
    method = request.method
    endpoint = request.url.path

    ACTIVE_REQUESTS.labels(method, endpoint).inc()

    start_time = time.time()
    try:
        response = process_request(request)
        status = response.status_code
        REQUEST_COUNT.labels(method, endpoint, status).inc()
        return response
    except Exception as e:
        REQUEST_COUNT.labels(method, endpoint, '500').inc()
        raise
    finally:
        duration = time.time() - start_time
        REQUEST_DURATION.labels(method, endpoint).observe(duration)
        ACTIVE_REQUESTS.labels(method, endpoint).dec()

# Start metrics server
start_http_server(8080)  # /metrics endpoint di port 8080
```

#### 2.4 PromQL Queries untuk Monitoring

```promql
# ============================================================
# GOLDEN SIGNALS — Four Golden Signals of Monitoring
# ============================================================

# 1. LATENCY — Waktu untuk serve request
# P99 latency dalam 5 menit terakhir
histogram_quantile(0.99,
  rate(http_request_duration_seconds_bucket[5m]))

# Median latency
histogram_quantile(0.50,
  rate(http_request_duration_seconds_bucket[5m]))

# 2. TRAFFIC — Berapa banyak request
# Requests per second
rate(http_requests_total[5m])

# Requests per second per endpoint
sum by (endpoint) (rate(http_requests_total[5m]))

# 3. ERRORS — Berapa banyak request gagal
# Error rate (5xx responses)
rate(http_requests_total{status=~"5.."}[5m])
/
rate(http_requests_total[5m])
* 100

# Error rate per endpoint
sum by (endpoint) (rate(http_requests_total{status=~"5.."}[5m]))
/
sum by (endpoint) (rate(http_requests_total[5m]))
* 100

# 4. SATURATION — Seberapa penuh resource
# CPU usage
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100

# ============================================================
# BUSINESS METRICS
# ============================================================

# Orders per minute
rate(orders_created_total[1m]) * 60

# Revenue per hour
rate(revenue_total[1h]) * 3600

# Active users (dari cache metrics)
cache_hits_total{cache_name="user_session"}
+
cache_misses_total{cache_name="user_session"}

# Cache hit ratio
cache_hits_total{cache_name="product"}
/
(cache_hits_total{cache_name="product"} + cache_misses_total{cache_name="product"})
* 100

# ============================================================
# DATABASE METRICS
# ============================================================

# Query per second
rate(db_query_duration_seconds_count[5m])

# Slow queries (> 1 second)
rate(db_query_duration_seconds_bucket{le="1.0"}[5m])
/
rate(db_query_duration_seconds_count[5m])
* 100

# Connection pool usage
db_active_connections / db_max_connections * 100
```

---

### Bagian 3: Logging — ELK Stack & Grafana Loki

#### 3.1 Structured Logging

```
┌──────────────────────────────────────────────────────────────┐
│               STRUCTURED LOGGING (JSON)                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  JANGAN pakai log seperti ini (unstructured):                │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  2026-05-21 10:00:00 INFO User Budi login berhasil   │     │
│  │  2026-05-21 10:00:01 ERROR Database connection fail  │     │
│  │  2026-05-21 10:00:02 WARN Cache miss for key user:1  │     │
│  │                                                       │     │
│  │  → Sulit query, parse, filter                         │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  PAKAI structured logging (JSON):                            │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  {                                                   │     │
│  │    "timestamp": "2026-05-21T10:00:00Z",              │     │
│  │    "level": "INFO",                                  │     │
│  │    "service": "auth-service",                        │     │
│  │    "message": "User login successful",               │     │
│  │    "user_id": "usr-123",                             │     │
│  │    "user_email": "budi@email.com",                   │     │
│  │    "ip_address": "192.168.1.100",                    │     │
│  │    "trace_id": "abc-123-def",                        │     │
│  │    "span_id": "span-456",                            │     │
│  │    "duration_ms": 45                                 │     │
│  │  }                                                   │     │
│  │                                                       │     │
│  │  → Mudah query, filter, aggregate                     │     │
│  │  → Bisa search: level=ERROR AND service=auth-service  │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3.2 ELK Stack Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  ELK STACK ARCHITECTURE                      │
│              (Elasticsearch, Logstash, Kibana)               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              [Application Servers]                   │     │
│  │                                                       │     │
│  │  App 1 ──→ JSON logs ──→ stdout/file                 │     │
│  │  App 2 ──→ JSON logs ──→ stdout/file                 │     │
│  │  App 3 ──→ JSON logs ──→ stdout/file                 │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              Filebeat / Fluentd                      │     │
│  │         (Log Shipper / Log Collector)                │     │
│  │                                                       │     │
│  │  - Tail log files                                     │     │
│  │  - Parse JSON                                         │     │
│  │  - Add metadata (hostname, service name)              │     │
│  │  - Buffer & retry                                     │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  Logstash (Optional)                 │     │
│  │              (Log Processor)                         │     │
│  │                                                       │     │
│  │  Input → Filter → Output                            │     │
│  │                                                       │     │
│  │  filter {                                             │     │
│  │    grok { match => { "message" => "%{IP:client}" }}  │     │
│  │    date { match => { "timestamp" => "ISO8601" }}     │     │
│  │    mutate { remove_field => ["host"] }               │     │
│  │  }                                                    │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │               Elasticsearch                          │     │
│  │         (Search & Analytics Engine)                  │     │
│  │                                                       │     │
│  │  - Store logs sebagai documents                       │     │
│  │  - Full-text search                                   │     │
│  │  - Aggregations                                       │     │
│  │  - Index per hari: logs-2026.05.21                    │     │
│  │  - Retention: 30 hari (auto delete old indices)       │     │
│  └──────────────────────┬──────────────────────────────┘     │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  Kibana                              │     │
│  │           (Visualization Dashboard)                  │     │
│  │                                                       │     │
│  │  - Search logs                                        │     │
│  │  - Filter by level, service, trace_id                 │     │
│  │  - Dashboard: error rate, log volume                  │     │
│  │  - Alerting (Watch)                                   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3.3 Grafana Loki — Lightweight Alternative

```
┌──────────────────────────────────────────────────────────────┐
│                  GRAFANA LOKI                                │
│              ("Like Prometheus, but for logs")               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Perbedaan ELK vs Loki:                                       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  ELK (Elasticsearch):                                 │     │
│  │  - Index SEMUA field → full-text search               │     │
│  │  - Resource-heavy (CPU, memory, disk)                 │     │
│  │  - Cocok untuk log yang perlu search kompleks         │     │
│  │                                                       │     │
│  │  Loki:                                                │     │
│  │  - Index HANYA labels (service, level, host)          │     │
│  │  - Content tidak di-index, hanya compressed           │     │
│  │  - Resource ringan (mirip Prometheus)                 │     │
│  │  - Cocok untuk log volume besar, query via LogQL      │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Loki Architecture:                                           │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  [Apps] ──→ [Promtail] ──→ [Loki] ──→ [Grafana]      │     │
│  │               (agent)       (store)    (dashboard)     │     │
│  │                                                       │     │
│  │  Promtail:                                            │     │
│  │  - Tail log files                                     │     │
│  │  - Add labels: {service="auth", env="production"}     │     │
│  │  - Push batch ke Loki                                 │     │
│  │                                                       │     │
│  │  Loki:                                                │     │
│  │  - Store chunks di object storage (S3, GCS)           │     │
│  │  - Index labels di boltdb                             │     │
│  │  - Query via LogQL                                    │     │
│  │                                                       │     │
│  │  LogQL Queries:                                       │     │
│  │  {service="auth"} |= "error"                          │     │
│  │  {service="api"} |~ "timeout|connection refused"      │     │
│  │  {service="api"} |= "error" | json | duration_ms > 500│     │
│  │  rate({service="api"} |= "error"[5m])                 │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 4: Distributed Tracing — Jaeger & Zipkin

#### 4.1 Konsep Tracing

```
┌──────────────────────────────────────────────────────────────┐
│                 DISTRIBUTED TRACING                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Trace = Satu request end-to-end melewati banyak services     │
│  Span  = Satu operasi dalam trace (satu service call)         │
│                                                               │
│  Trace: "GET /api/orders/123"                                 │
│  ├── Span 1: API Gateway (0-5ms)                             │
│  │   ├── Span 2: Auth Service (5-15ms)                       │
│  │   │   └── Span 3: JWT Validation (5-10ms)                 │
│  │   └── Span 4: Order Service (15-65ms)                     │
│  │       ├── Span 5: Database Query (20-40ms)                │
│  │       └── Span 6: Cache Lookup (40-45ms)                  │
│  └── Span 7: Response (65-70ms)                              │
│                                                               │
│  Trace ID: abc-123-def (sama untuk semua spans)               │
│  Span ID: unique per span                                     │
│  Parent Span ID: link ke parent span                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 4.2 Trace Visualization (Jaeger UI)

```
┌──────────────────────────────────────────────────────────────┐
│                    JAEGER TRACE VIEW                         │
│                                                               │
│  Trace: abc-123-def  |  Service: api-gateway  |  Duration: 82ms
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  API Gateway          ████████████████████  5ms       │     │
│  │  ├─ Auth Service      ████████████████  10ms          │     │
│  │  │  └─ JWT Validate   ████████  5ms                  │     │
│  │  └─ Order Service     ████████████████████████████ 50ms│    │
│  │     ├─ DB Query       ████████████████  20ms          │     │
│  │     └─ Cache Lookup   ████  5ms                      │     │
│  │                                                       │     │
│  │  ┌─────────────────────────────────────────────┐      │     │
│  │  │ Span Details: Order Service                  │      │     │
│  │  │ Operation: GET /orders/123                   │      │     │
│  │  │ Duration: 50ms                               │      │     │
│  │  │ Status: OK                                   │      │     │
│  │  │ Tags:                                        │      │     │
│  │  │   http.method = GET                          │      │     │
│  │  │   http.url = /api/orders/123                 │      │     │
│  │  │   db.statement = SELECT * FROM orders...     │      │     │
│  │  │   db.duration = 20ms                         │      │     │
│  │  │ Logs:                                        │      │     │
│  │  │   [20ms] Cache miss, querying database       │      │     │
│  │  │   [40ms] Found order #123                    │      │     │
│  │  └─────────────────────────────────────────────┘      │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 4.3 Implementasi Tracing di Aplikasi

```python
# Python — menggunakan OpenTelemetry
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from flask import Flask, request
import requests as http_requests

# Setup tracer
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Export traces ke Jaeger
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger-agent",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

app = Flask(__name__)

# Auto-instrument Flask
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

@app.route("/api/orders/<order_id>")
def get_order(order_id):
    # Manual span untuk business logic
    with tracer.start_as_current_span("get_order_business_logic") as span:
        span.set_attribute("order.id", order_id)

        # 1. Validate user (auto-traced by FlaskInstrumentor)
        user = validate_user(request.headers)

        # 2. Get order from cache
        with tracer.start_as_current_span("cache_lookup") as cache_span:
            cache_span.set_attribute("cache.key", f"order:{order_id}")
            order = cache.get(f"order:{order_id}")

            if order:
                cache_span.set_attribute("cache.hit", True)
                return order

            cache_span.set_attribute("cache.hit", False)

        # 3. Query database
        with tracer.start_as_current_span("db_query") as db_span:
            db_span.set_attribute("db.statement", f"SELECT * FROM orders WHERE id = {order_id}")
            order = db.query(f"SELECT * FROM orders WHERE id = '{order_id}'")
            db_span.set_attribute("db.rows_returned", 1 if order else 0)

        # 4. Cache result
        if order:
            cache.set(f"order:{order_id}", order, ttl=300)

        return order

# Propagasi trace context ke service lain
def call_payment_service(order_id, amount):
    # Trace context otomatis di-propagate oleh RequestsInstrumentor
    # Header yang ditambahkan:
    #   traceparent: 00-abc123-def456-01
    #   tracestate: vendor-specific data
    response = http_requests.post(
        f"http://payment-service/api/charge",
        json={"order_id": order_id, "amount": amount}
    )
    return response.json()
```

---

### Bagian 5: SLO/SLI/SLA Design

#### 5.1 Definisi

```
┌──────────────────────────────────────────────────────────────┐
│                  SLI / SLO / SLA                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  SLI (Service Level Indicator):                               │
│  → METRIK yang diukur                                         │
│  → Contoh: "99.5% requests berhasil dalam 200ms"             │
│  → Ini adalah ANGKA yang sebenarnya                           │
│                                                               │
│  SLO (Service Level Objective):                               │
│  → TARGET yang ditetapkan                                     │
│  → Contoh: "99.9% requests harus berhasil dalam 200ms"       │
│  → Ini adalah GOAL                                            │
│                                                               │
│  SLA (Service Level Agreement):                               │
│  → KONTRAK dengan user/customer                               │
│  → Contoh: "Jika SLI < 99.5%, kami kasih kredit 10%"         │
│  → Ini adalah JANJI + KONSEKUENSI                             │
│                                                               │
│  Hubungan:                                                    │
│  SLA >= SLO >= SLI (actual)                                   │
│                                                               │
│  Contoh:                                                      │
│  SLA: 99.5% uptime (kontrak dengan customer)                  │
│  SLO: 99.9% uptime (target internal, lebih ketat)             │
│  SLI: 99.95% uptime (yang sebenarnya terukur)                 │
│                                                               │
│  Kenapa SLO > SLA?                                            │
│  → Buffer untuk error budget                                  │
│  → Kalau SLO = SLA, sedikit fl langsung breach SLA            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 5.2 Error Budget

```
┌──────────────────────────────────────────────────────────────┐
│                    ERROR BUDGET                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Error Budget = 100% - SLO                                    │
│                                                               │
│  Contoh: SLO = 99.9% availability                             │
│  Error Budget = 0.1% = 43.2 menit downtime per bulan          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Budget tersisa: 30 menit                             │     │
│  │  ├── Deploy baru: pakai 5 menit budget                │     │
│  │  ├── Bug fix: pakai 2 menit budget                    │     │
│  │  └── Sisa: 23 menit                                   │     │
│  │                                                       │     │
│  │  Budget habis: 0 menit                                │     │
│  │  ├── STOP deploy baru                                 │     │
│  │  ├── Fokus reliability                                │     │
│  │  ├── Fix technical debt                               │     │
│  │  └── Baru deploy lagi setelah budget reset (bulan depan)│   │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Error Budget Policy:                                         │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  > 50% budget tersisa: Deploy normal                 │     │
│  │  10-50% budget tersisa: Deploy dengan review ekstra  │     │
│  │  < 10% budget tersisa: Hanya deploy critical fix     │     │
│  │  0% budget: Freeze deploy, fokus reliability         │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 5.3 Contoh SLO untuk Berbagai Service

```yaml
# SLO Configuration (contoh format)
services:
  api-gateway:
    slos:
      - name: "Availability"
        sli: "rate(http_requests_total{status!~'5..'}[5m]) / rate(http_requests_total[5m])"
        target: 99.95%
        window: 30d

      - name: "Latency"
        sli: "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket{route='/api/*'}[5m]))"
        target: "< 500ms"
        window: 30d

  payment-service:
    slos:
      - name: "Availability"
        target: 99.99%  # Lebih ketat — financial service
        window: 30d

      - name: "Latency"
        target: "< 200ms"  # Payment harus cepat
        window: 30d

      - name: "Correctness"
        sli: "rate(payment_correct_total[5m]) / rate(payment_total[5m])"
        target: 99.999%  # Hampir sempurna
        window: 30d

  search-service:
    slos:
      - name: "Availability"
        target: 99.9%  # Bisa lebih toleran
        window: 30d

      - name: "Latency"
        target: "< 1000ms"  # Search bisa lebih lambat
        window: 30d

      - name: "Freshness"
        sli: "time() - last_index_update_timestamp"
        target: "< 60s"  # Index tidak boleh lebih dari 60 detik
        window: 30d
```

---

### Bagian 6: Alerting Strategy

#### 6.1 Alert Fatigue Prevention

```
┌──────────────────────────────────────────────────────────────┐
│              ALERT FATIGUE & PREVENTION                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Masalah Alert Fatigue:                                       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Developer dapat 100+ alert per hari.                │     │
│  │  95% alert tidak actionable (false positive).        │     │
│  │  Developer mulai ignore SEMUA alert.                 │     │
│  │  Alert yang PENTING terlewat → incident.             │     │
│  │                                                       │     │
│  │  "Alert fatigue is when you get so many alerts       │     │
│  │   that you stop paying attention to any of them."    │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Prinsip Alert yang Baik:                                     │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  1. ACTIONABLE — Harus ada yang bisa dilakukan        │     │
│  │     ❌ "CPU 85%" — so what?                          │     │
│  │     ✅ "CPU 95% selama 10 menit — scale up now"      │     │
│  │                                                       │     │
│  │  2. URGENT — Harus butuh respon segera                │     │
│  │     ❌ "Disk 60% full" — masih ada waktu              │     │
│  │     ✅ "Disk 90% full — 2 hari lagi penuh!"           │     │
│  │                                                       │     │
│  │  3. REAL — Bukan false positive                       │     │
│  │     ❌ Alert setiap spike singkat                      │     │
│  │     ✅ Alert hanya jika sustained (5+ menit)           │     │
│  │                                                       │     │
│  │  4. SPECIFIC — Jelas apa masalahnya                    │     │
│  │     ❌ "Something is wrong"                           │     │
│  │     ✅ "PaymentService error rate 5% — DB replica-3   │     │
│  │          down, failover in progress"                   │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 6.2 Alert Routing dan Escalation

```
┌──────────────────────────────────────────────────────────────┐
│              ALERT ROUTING (PagerDuty)                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Alert Severity Levels:                                       │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  P1 — CRITICAL (Page immediately, 24/7)               │     │
│  │  - Service down                                       │     │
│  │  - Data loss detected                                 │     │
│  │  - Security breach                                    │     │
│  │  - Response time: < 5 menit                           │     │
│  │                                                       │     │
│  │  P2 — HIGH (Page during business hours)               │     │
│  │  - Error rate > 5%                                    │     │
│  │  - Latency p99 > 2s                                   │     │
│  │  - Response time: < 30 menit                          │     │
│  │                                                       │     │
│  │  P3 — MEDIUM (Ticket, next business day)              │     │
│  │  - Disk usage > 80%                                   │     │
│  │  - Certificate expiring in 7 hari                     │     │
│  │  - Response time: < 4 jam                             │     │
│  │                                                       │     │
│  │  P4 — LOW (Backlog, no urgency)                       │     │
│  │  - Trend analysis (CPU naik 1% per minggu)            │     │
│  │  - Optimization suggestions                           │     │
│  │  - Response time: < 1 minggu                          │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Escalation Policy:                                           │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  P1 Alert fired:                                      │     │
│  │  0 min  → Page On-Call Engineer (Slack + Phone)       │     │
│  │  5 min  → Jika belum acknowledge, page lagi           │     │
│  │  15 min → Escalate ke Team Lead                       │     │
│  │  30 min → Escalate ke Engineering Manager             │     │
│  │  60 min → Escalate ke VP Engineering                  │     │
│  │                                                       │     │
│  │  Auto-escalation memastikan alert tidak terlewat       │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Alert Routing Rules:                                         │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  if service == "payment" AND severity == "P1":        │     │
│  │      route → payment-oncall-team                      │     │
│  │                                                       │     │
│  │  if service == "auth" AND severity == "P1":           │     │
│  │      route → security-team                            │     │
│  │                                                       │     │
│  │  if error_rate > 10%:                                 │     │
│  │      route → sre-team                                 │     │
│  │                                                       │     │
│  │  if disk_usage > 90%:                                 │     │
│  │      route → infra-team                               │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 6.3 Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'

route:
  group_by: ['alertname', 'service']
  group_wait: 30s      # Tunggu 30s sebelum kirim alert pertama
  group_interval: 5m   # Tunggu 5m sebelum kirim alert berikutnya di group yang sama
  repeat_interval: 4h  # Ulangi alert setiap 4 jam jika belum resolved
  receiver: 'default-receiver'

  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true

    - match:
        severity: warning
      receiver: 'slack-warnings'

    - match_re:
        service: 'payment|order'
      receiver: 'business-critical-team'

receivers:
  - name: 'default-receiver'
    slack_configs:
      - channel: '#monitoring'
        send_resolved: true

  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: 'PAGERDUTY_SERVICE_KEY'
        severity: 'critical'

  - name: 'slack-warnings'
    slack_configs:
      - channel: '#alerts-warning'
        send_resolved: true
        text: "{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}"

  - name: 'business-critical-team'
    pagerduty_configs:
      - service_key: 'BUSINESS_CRITICAL_KEY'
    slack_configs:
      - channel: '#business-critical-alerts'

inhibit_rules:
  # Jika service DOWN, jangan alert untuk latency tinggi
  - source_match:
      severity: 'critical'
      alertname: 'ServiceDown'
    target_match:
      alertname: 'HighLatency'
    equal: ['service']
```

---

### Bagian 7: Dashboard Design

#### 7.1 Dashboard Layers

```
┌──────────────────────────────────────────────────────────────┐
│                  DASHBOARD LAYERS                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Executive Dashboard (Untuk Management)             │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  - Overall system health (green/yellow/red)           │     │
│  │  - SLA compliance (99.95% vs target 99.9%)            │     │
│  │  - Business metrics (orders/hour, revenue/day)        │     │
│  │  - Error budget status (30% remaining)                │     │
│  │  - Top incidents this week                            │     │
│  │                                                       │     │
│  │  Update: Real-time, tapi high-level                   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 2: Service Dashboard (Untuk Engineering Team)         │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Per service:                                         │     │
│  │  - Request rate (RPS)                                 │     │
│  │  - Error rate (%)                                     │     │
│  │  - Latency (p50, p95, p99)                           │     │
│  │  - Saturation (CPU, memory, disk, connections)        │     │
│  │  - Dependencies status                                │     │
│  │  - Cache hit ratio                                    │     │
│  │  - Database query performance                         │     │
│  │                                                       │     │
│  │  Update: Real-time (15s refresh)                      │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 3: Debug Dashboard (Untuk Incident Response)          │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                                                       │     │
│  │  Saat incident:                                       │     │
│  │  - Trace view (Jaeger) — alur request yang gagal      │     │
│  │  - Log view (Loki/Kibana) — error logs detail         │     │
│  │  - Resource usage per instance                        │     │
│  │  - Network I/O                                        │     │
│  │  - Database slow queries                              │     │
│  │  - Recent deployments                                 │     │
│  │                                                       │     │
│  │  Update: Real-time, drill-down capability             │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

### Bagian 8: Incident Response

#### 8.1 Incident Response Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                 INCIDENT RESPONSE WORKFLOW                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Phase 1: DETECTION                                          │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  - Alert firing dari Prometheus/Alertmanager          │     │
│  │  - User report (support ticket)                       │     │
│  │  - Automated health check failure                     │     │
│  │                                                       │     │
│  │  Output: Incident created, on-call notified           │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Phase 2: TRIAGE                                             │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  1. Assess severity (P1-P4)                          │     │
│  │  2. Identify affected services/users                 │     │
│  │  3. Check recent changes (deployments, config)       │     │
│  │  4. Declare incident (jika P1/P2)                    │     │
│  │                                                       │     │
│  │  Output: Incident severity, scope, incident commander │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Phase 3: INVESTIGATION                                      │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  1. Check dashboards (metrics)                       │     │
│  │  2. Check traces (Jaeger) — identify bottleneck      │     │
│  │  3. Check logs (Loki/Kibana) — find error details    │     │
│  │  4. Check recent deployments                         │     │
│  │  5. Check infrastructure (cloud provider status)     │     │
│  │                                                       │     │
│  │  Output: Root cause identified                        │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Phase 4: MITIGATION                                         │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  1. Apply fix (rollback, restart, scale up)          │     │
│  │  2. Verify fix (check metrics, test functionality)   │     │
│  │  3. Communicate status (status page, stakeholders)   │     │
│  │                                                       │     │
│  │  Output: Service restored, incident resolved          │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Phase 5: POST-MORTEM                                        │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  1. Timeline: apa yang terjadi, kapan                │     │
│  │  2. Root cause analysis (5 Whys)                     │     │
│  │  3. Impact: berapa user affected, berapa lama        │     │
│  │  4. Action items: prevent recurrence                 │     │
│  │  5. Blameless: fokus pada sistem, bukan orang        │     │
│  │                                                       │     │
│  │  Output: Post-mortem document, action items tracked   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 8.2 Blameless Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

## Summary
- **Date:** 2026-05-21
- **Duration:** 45 minutes (10:00 - 10:45 UTC)
- **Severity:** P1
- **Impact:** 15% of users unable to checkout
- **Services affected:** PaymentService, OrderService

## Timeline
| Time (UTC) | Event |
|------------|-------|
| 10:00 | Database replica-3 starts lagging |
| 10:05 | PaymentService timeout errors begin |
| 10:07 | Alert fired: PaymentService error rate > 5% |
| 10:10 | On-call engineer acknowledges |
| 10:15 | Root cause identified: replica-3 disk I/O bottleneck |
| 10:20 | Failover to replica-4 initiated |
| 10:25 | Failover complete, errors stop |
| 10:30 | All systems verified healthy |
| 10:45 | Incident closed |

## Root Cause
Database replica-3 experienced disk I/O saturation due to a long-running
analytics query that was not properly rate-limited. This caused replication
lag of 5+ seconds, which triggered timeout errors in PaymentService.

## Impact
- 15% of checkout requests failed
- ~500 affected transactions
- No data loss (all failed transactions were retried successfully)

## Action Items
| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| Add query timeout to analytics queries | DBA Team | P1 | 2026-05-28 |
| Implement circuit breaker in PaymentService | Backend Team | P1 | 2026-06-01 |
| Add disk I/O monitoring alert | SRE Team | P2 | 2026-06-07 |
| Review replica capacity planning | Infra Team | P2 | 2026-06-14 |

## Lessons Learned
- What went well: Alert fired quickly, on-call responded within 3 minutes
- What went wrong: No circuit breaker, analytics queries not rate-limited
- Where we got lucky: Failover worked on first try, no data corruption
```

---

### Bagian 9: Real-World Observability Stack

#### 9.1 Complete Stack Example

```
┌──────────────────────────────────────────────────────────────┐
│            REAL-WORLD OBSERVABILITY STACK                    │
│              (Production-Grade Setup)                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              APPLICATION LAYER                       │     │
│  │                                                       │     │
│  │  Apps instrumented with OpenTelemetry SDK:            │     │
│  │  - Auto-instrumentation (Flask, Django, Express)      │     │
│  │  - Manual spans untuk business logic                  │     │
│  │  - Prometheus metrics endpoint (/metrics)             │     │
│  │  - Structured JSON logging (stdout)                   │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              METRICS PIPELINE                        │     │
│  │                                                       │     │
│  │  Prometheus (scrape apps every 15s)                   │     │
│  │  ├── TSDB (local storage, 30 days retention)          │     │
│  │  ├── Thanos/Cortex (long-term storage, S3)            │     │
│  │  └── Alertmanager (routing to PagerDuty/Slack)        │     │
│  │                                                       │     │
│  │  Grafana:                                             │     │
│  │  ├── Executive dashboard                              │     │
│  │  ├── Service dashboards (per team)                    │     │
│  │  └── Debug dashboards (incident response)             │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              LOGGING PIPELINE                        │     │
│  │                                                       │     │
│  │  Option A: ELK Stack                                  │     │
│  │  Filebeat → Logstash → Elasticsearch → Kibana         │     │
│  │                                                       │     │
│  │  Option B: Grafana Loki (lighter)                     │     │
│  │  Promtail → Loki → Grafana                            │     │
│  │                                                       │     │
│  │  Retention: 30 hari hot, 90 hari cold (S3)            │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              TRACING PIPELINE                        │     │
│  │                                                       │     │
│  │  Jaeger:                                              │     │
│  │  ├── Jaeger Agent (sidecar per pod)                   │     │
│  │  ├── Jaeger Collector (batch process spans)           │     │
│  │  ├── Jaeger Query (UI for trace search)               │     │
│  │  └── Elasticsearch/Cassandra (span storage)           │     │
│  │                                                       │     │
│  │  Sampling:                                            │     │
│  │  - 100% sampling untuk error traces                   │     │
│  │  - 10% sampling untuk success traces                  │     │
│  │  - Adaptive sampling (increase rate for slow traces)  │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              ALERTING & INCIDENT                     │     │
│  │                                                       │     │
│  │  PagerDuty:                                           │     │
│  │  ├── On-call schedules (rotation)                     │     │
│  │  ├── Escalation policies                              │     │
│  │  ├── Incident management                              │     │
│  │  └── Post-mortem tracking                             │     │
│  │                                                       │     │
│  │  Slack:                                               │     │
│  │  ├── #alerts-critical (P1, page)                      │     │
│  │  ├── #alerts-warning (P2-P3, notify)                  │     │
│  │  ├── #incident-response (active incidents)            │     │
│  │  └── #post-mortems (completed reviews)                │     │
│  │                                                       │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 9.2 OpenTelemetry Collector Configuration

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

  prometheus:
    config:
      scrape_configs:
        - job_name: 'apps'
          scrape_interval: 15s
          static_configs:
            - targets: ['app-1:8080', 'app-2:8080', 'app-3:8080']

processors:
  batch:
    timeout: 10s
    send_batch_size: 1000

  # Filter: drop health check spans
  filter:
    spans:
      exclude:
        match_type: strict
        services: ['health-check']
        span_names: ['GET /health', 'GET /ready']

  # Add resource attributes
  resource:
    attributes:
      - key: deployment.environment
        value: production
        action: upsert
      - key: service.version
        value: ${SERVICE_VERSION}
        action: upsert

exporters:
  # Traces → Jaeger
  jaeger:
    endpoint: jaeger-collector:14250
    tls:
      insecure: true

  # Metrics → Prometheus (via remote write)
  prometheusremotewrite:
    endpoint: http://prometheus:9090/api/v1/write

  # Logs → Loki
  loki:
    endpoint: http://loki:3100/loki/api/v1/push

  # Also export to file for debugging
  file:
    path: /tmp/otel-debug.json

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch, filter, resource]
      exporters: [jaeger]

    metrics:
      receivers: [otlp, prometheus]
      processors: [batch, resource]
      exporters: [prometheusremotewrite]

    logs:
      receivers: [otlp]
      processors: [batch, resource]
      exporters: [loki, file]
```

---

## ✅ CHECKLIST PEMAHAMAN

- [ ] Paham perbedaan monitoring vs observability
- [ ] Paham 3 pilar: metrics, logs, traces
- [ ] Paham metric types: counter, gauge, histogram, summary
- [ ] Paham Prometheus architecture dan PromQL
- [ ] Paham structured logging dan ELK Stack
- [ ] Paham Grafana Loki sebagai alternatif ringan
- [ ] Paham distributed tracing concepts (trace, span, context propagation)
- [ ] Bisa implementasi OpenTelemetry di aplikasi
- [ ] Paham SLI, SLO, SLA dan perbedaannya
- [ ] Paham error budget dan policy
- [ ] Paham alert fatigue prevention
- [ ] Bisa design alert routing dan escalation
- [ ] Paham dashboard layers (executive, service, debug)
- [ ] Paham incident response workflow
- [ ] Bisa menulis blameless post-mortem
- [ ] Paham complete observability stack production-grade

---

## 📚 REFERENSI

- [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) — Monitoring, Alerting
- [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Book — SLOs and Error Budgets](https://sre.google/sre-book/service-level-objectives/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Loki Documentation](https://grafana.com/docs/loki/)
- [Jaeger Documentation](https://www.jaegertracing.io/docs/)
- [PagerDuty Incident Response](https://response.pagerduty.com/)

---

> **Lanjut ke:** [`08-arsitektur-twitter-scale.md`](./08-arsitektur-twitter-scale.md)
