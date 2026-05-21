# 02 — Service Discovery & API Gateway

> **Estimasi:** 1,5 jam | **Level:** Advanced | **Prerequisite:** 01-load-balancing-caching.md

---

## DAFTAR ISI

1. [Service Discovery: Konsep Dasar](#service-discovery-konsep-dasar)
2. [Client-Side vs Server-Side Discovery](#client-side-vs-server-side-discovery)
3. [Service Registry: Consul, Eureka, etcd](#service-registry-consul-eureka-etcd)
4. [Health Checking Patterns](#health-checking-patterns)
5. [Service Deregistration](#service-deregistration)
6. [DNS-Based Discovery](#dns-based-discovery)
7. [API Gateway: Fungsi dan Komponen](#api-gateway-fungsi-dan-komponen)
8. [API Gateway Patterns](#api-gateway-patterns)
9. [API Gateway vs Service Mesh](#api-gateway-vs-service-mesh)
10. [Perbandingan: Kong, Apigee, AWS API Gateway](#perbandingan-kong-apigee-aws-api-gateway)
11. [Implementasi Praktis](#implementasi-praktis)
12. [Referensi dari donnemartin/system-design-primer](#referensi-dari-donnemartinsystem-design-primer)

---

## SERVICE DISCOVERY: KONSEP DASAR

### Apa itu Service Discovery?

Dalam arsitektur **monolith**, semua komponen berjalan di satu proses. Komunikasi antar komponen adalah **function call** — cepat, reliable, dan tidak perlu discovery.

```
┌─────────────────────────────────────┐
│          MONOLITH                    │
│                                      │
│  [User Module] ──call──▶ [Order]    │
│  [Order Module] ──call──▶ [Payment] │
│  [Payment Module] ──call──▶ [Email] │
│                                      │
│  Semua dalam SATU proses.            │
│  Tidak perlu discovery.              │
└─────────────────────────────────────┘
```

Dalam arsitektur **microservices**, setiap komponen berjalan di proses terpisah, mungkin di server berbeda, dengan IP address dan port yang bisa berubah kapan saja (scale up/down, crash, deploy).

```
┌──────────┐     ???     ┌──────────┐
│ Service  │ ──────────▶ │ Service  │
│   A      │  IP? Port?  │   B      │
└──────────┘             └──────────┘
```

**Service Discovery** adalah mekanisme yang memungkinkan service menemukan lokasi (IP + port) service lain secara dinamis.

### Mengapa Service Discovery Diperlukan?

```
┌─────────────────────────────────────────────────────────────┐
│                MASALAH TANPA SERVICE DISCOVERY               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. IP Address Berubah                                       │
│     - Auto-scaling: instance baru dapat IP berbeda           │
│     - Crash & restart: IP baru                               │
│     - Deployment: instance lama diganti baru                 │
│                                                              │
│  2. Multiple Instance                                        │
│     - Service B punya 3 instance: mana yang dipilih?         │
│     - Perlu load balancing antar instance                    │
│                                                              │
│  3. Hardcoded IP = Bad Practice                              │
│     - Konfigurasi manual untuk setiap service                │
│     - Tidak scalable                                         │
│     - Single point of failure                                │
│                                                              │
│  SOLUSI: Service Discovery                                   │
│  - Service mendaftar ke registry saat startup                │
│  - Service lain query registry untuk lokasi                  │
│  - Registry update real-time saat instance berubah           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Komponen Service Discovery

```
┌──────────────────────────────────────────────────────────────┐
│              ARSITEKTUR SERVICE DISCOVERY                      │
│                                                               │
│   ┌──────────────┐                                           │
│   │   Service    │                                           │
│   │   Registry   │ ← Database lokasi semua service           │
│   │              │   (IP, port, health status, metadata)     │
│   └──────┬───────┘                                           │
│          │                                                    │
│     ┌────┴────┐                                               │
│     │         │                                               │
│     ▼         ▼                                               │
│  ┌─────┐  ┌─────┐                                            │
│  │Svc A│  │Svc B│  ← Service mendaftar saat startup           │
│  │     │  │     │    Service deregister saat shutdown         │
│  └─────┘  └─────┘    Health check berkala                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Alur Kerja:**
1. **Registration** — Service B startup → daftar ke Registry: "Saya di 10.0.1.5:8080"
2. **Discovery** — Service A butuh Service B → query Registry: "Service B di mana?"
3. **Response** — Registry: "Service B tersedia di: 10.0.1.5:8080, 10.0.1.6:8080, 10.0.1.7:8080"
4. **Connection** — Service A memilih salah satu instance dan connect
5. **Health Check** — Registry cek berkala: apakah Service B masih alive?
6. **Deregistration** — Service B shutdown → hapus dari Registry

---

## CLIENT-SIDE VS SERVER-SIDE DISCOVERY

### Client-Side Discovery

Service client bertanggung jawab untuk query service registry dan memilih instance.

```
┌──────────────────────────────────────────────────────────────┐
│                  CLIENT-SIDE DISCOVERY                        │
│                                                               │
│  ┌──────────┐    1. Query    ┌──────────────────┐            │
│  │ Service  │ ──────────────▶│  Service Registry│            │
│  │   A      │                │  (Consul/Eureka) │            │
│  │ (Client) │ ◀──────────────│                  │            │
│  └────┬─────┘   2. Response  │  Svc B:          │            │
│       │         [IP list]    │  - 10.0.1.5:8080 │            │
│       │                      │  - 10.0.1.6:8080 │            │
│       │  3. Pilih instance   │  - 10.0.1.7:8080 │            │
│       │     (load balancing) └──────────────────┘            │
│       ▼                                                       │
│  ┌──────────┐                                                 │
│  │ Service  │                                                 │
│  │   B      │ ← Direct connection ke instance terpilih        │
│  └──────────┘                                                 │
│                                                               │
│  Client TANGGUNG JAWAB untuk:                                 │
│  - Query registry                                              │
│  - Load balancing (round-robin, random, least-conn)           │
│  - Cache hasil query                                           │
│  - Handle instance yang down                                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- **Lebih sedikit network hop** — Client langsung connect ke service target, tidak melalui load balancer
- **Lebih fleksibel** — Client bisa implementasi load balancing algorithm yang spesifik
- **Lebih sedikit latency** — Tidak ada extra hop melalui proxy/load balancer

**Kekurangan:**
- **Client lebih kompleks** — Setiap service perlu logic untuk discovery dan load balancing
- **Coupling ke registry** — Client perlu tahu cara query registry (library dependency)
- **Harder untuk multiple language** — Setiap bahasa perlu implementasi discovery client

**Tools yang menggunakan Client-Side Discovery:**
- Netflix Eureka + Ribbon
- HashiCorp Consul (dengan consul-template)
- Apache ZooKeeper + Curator

**Contoh Kode — Client-Side Discovery dengan Consul:**
```python
import consul
import requests

class ServiceDiscoveryClient:
    def __init__(self, consul_host='localhost', consul_port=8500):
        self.consul_client = consul.Consul(host=consul_host, port=consul_port)

    def get_service_instances(self, service_name):
        """Query Consul untuk mendapatkan semua instance service."""
        index, services = self.consul_client.catalog.service(service_name)
        instances = []
        for service in services:
            instances.append({
                'address': service['ServiceAddress'],
                'port': service['ServicePort'],
                'tags': service['ServiceTags']
            })
        return instances

    def get_healthy_instance(self, service_name, strategy='round-robin'):
        """Dapatkan satu instance yang healthy."""
        instances = self.get_service_instances(service_name)
        if not instances:
            raise Exception(f"Service {service_name} tidak tersedia")

        # Simple round-robin (dalam produksi, gunakan counter persistent)
        import random
        return random.choice(instances)

    def call_service(self, service_name, endpoint, method='GET', data=None):
        """Call service dengan discovery otomatis."""
        instance = self.get_healthy_instance(service_name)
        url = f"http://{instance['address']}:{instance['port']}{endpoint}"

        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)

        return response.json()

# Penggunaan:
discovery = ServiceDiscoveryClient()
result = discovery.call_service('user-service', '/api/users/123')
```

### Server-Side Discovery

Client mengirim request ke load balancer, dan load balancer yang bertanggung jawab untuk discovery dan routing.

```
┌──────────────────────────────────────────────────────────────┐
│                  SERVER-SIDE DISCOVERY                        │
│                                                               │
│  ┌──────────┐                                                │
│  │ Service  │                                                │
│  │   A      │                                                │
│  │ (Client) │                                                │
│  └────┬─────┘                                                │
│       │                                                       │
│       │ 1. Request ke Load Balancer                           │
│       ▼                                                       │
│  ┌──────────────────────┐    2. Query    ┌──────────────┐    │
│  │  Load Balancer       │ ──────────────▶│   Service    │    │
│  │  (Kubernetes Service,│                │   Registry   │    │
│  │   AWS ALB, Nginx)    │ ◀──────────────│              │    │
│  └────┬─────────────────┘   3. Response  └──────────────┘    │
│       │          [IP list]                                    │
│       │ 4. Pilih instance & forward                           │
│       ▼                                                       │
│  ┌──────────┐                                                 │
│  │ Service  │                                                 │
│  │   B      │ ← LB forward ke instance terpilih               │
│  └──────────┘                                                 │
│                                                               │
│  Client TIDAK perlu tahu tentang service discovery.           │
│  Client hanya tahu alamat Load Balancer.                      │
│  LB yang handle discovery, load balancing, health check.      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- **Client lebih sederhana** — Tidak perlu logic discovery, hanya tahu alamat LB
- **Language agnostic** — Service bisa pakai bahasa apapun, tidak perlu library discovery
- **Centralized management** — Load balancing strategy diatur di satu tempat

**Kekurangan:**
- **Extra network hop** — Request melalui LB dulu, menambah latency
- **LB bisa jadi bottleneck** — Semua traffic melalui LB
- **Single point of failure** — Jika LB down, semua service tidak accessible

**Tools yang menggunakan Server-Side Discovery:**
- Kubernetes Service + kube-proxy
- AWS Application Load Balancer (ALB)
- Nginx / HAProxy dengan service discovery plugin

**Contoh — Kubernetes Service (Server-Side Discovery):**
```yaml
# Service B mendaftarkan diri ke Kubernetes
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP  # Internal only

# Service A memanggil Service B via DNS
# http://user-service/api/users/123
# Kubernetes otomatis resolve ke salah satu pod yang healthy
```

### Perbandingan Head-to-Head

| Aspek | Client-Side | Server-Side |
|-------|-------------|-------------|
| **Kompleksitas Client** | Tinggi (perlu logic discovery) | Rendah (hanya tahu LB) |
| **Latency** | Lebih rendah (direct) | Lebih tinggi (via LB) |
| **Load Balancing** | Fleksibel (client pilih algoritma) | Terpusat (LB atur) |
| **Language Support** | Perlu library per bahasa | Language agnostic |
| **Bottleneck** | Tidak ada | LB bisa jadi bottleneck |
| **Failover** | Client handle | LB handle |
| **Contoh** | Eureka + Ribbon, Consul | Kubernetes, AWS ALB |

**Kapan Pilih Client-Side:**
- Butuh kontrol penuh atas load balancing strategy
- Latency sangat critical
- Tim mampu maintain discovery logic di setiap service

**Kapan Pilih Server-Side:**
- Ingin client sesederhana mungkin
- Multiple bahasa pemrograman
- Sudah pakai Kubernetes atau cloud LB

---

## SERVICE REGISTRY: CONSUL, EUREKA, etcd

### Apa itu Service Registry?

Service Registry adalah **database terdistribusi** yang menyimpan informasi lokasi dan status semua service instance. Ini adalah "buku telepon" dari arsitektur microservices.

```
┌──────────────────────────────────────────────────────────────┐
│                   SERVICE REGISTRY                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Service Registry Database                               │ │
│  │                                                          │ │
│  │  Service: user-service                                   │ │
│  │  ├── Instance 1: 10.0.1.5:8080 [HEALTHY]                │ │
│  │  ├── Instance 2: 10.0.1.6:8080 [HEALTHY]                │ │
│  │  └── Instance 3: 10.0.1.7:8080 [UNHEALTHY]              │ │
│  │                                                          │ │
│  │  Service: order-service                                  │ │
│  │  ├── Instance 1: 10.0.2.5:8081 [HEALTHY]                │ │
│  │  └── Instance 2: 10.0.2.6:8081 [HEALTHY]                │ │
│  │                                                          │ │
│  │  Service: payment-service                                │ │
│  │  └── Instance 1: 10.0.3.5:8082 [HEALTHY]                │ │
│  │                                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Fitur Utama:                                                 │
│  - Registration / Deregistration                              │
│  - Health Checking                                            │
│  - Key-Value Storage (metadata, config)                       │
│  - Distributed & Fault Tolerant                               │
│  - Watch / Notification (real-time update)                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### HashiCorp Consul

**Karakteristik:** Full-featured service networking solution.

```
┌──────────────────────────────────────────────────────────────┐
│                    HASHICORP CONSUL                          │
│                                                               │
│  Fitur:                                                       │
│  ✓ Service Discovery (DNS + HTTP API)                        │
│  ✓ Health Checking (HTTP, TCP, script, TTL)                  │
│  ✓ Key-Value Store                                           │
│  ✓ Multi-Datacenter                                          │
│  ✓ Service Mesh (Connect)                                    │
│  ✓ Intentions (access control antar service)                 │
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  Consul     │    │  Consul     │    │  Consul     │       │
│  │  Server     │◀──▶│  Server     │◀──▶│  Server     │       │
│  │  (Leader)   │    │  (Follower) │    │  (Follower) │       │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘       │
│         │                 │                  │                │
│         └─────────────────┼──────────────────┘                │
│                           ▼                                   │
│                    ┌─────────────┐                            │
│                    │  Consul     │                            │
│                    │  Agent      │ ← Berjalan di setiap node   │
│                    │  (Client)   │   Register service lokal    │
│                    └─────────────┘                            │
│                                                               │
│  Consensus: Raft protocol (seperti etcd)                     │
│  Query: DNS (service-name.service.consul) atau HTTP API       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Contoh Penggunaan Consul:**
```bash
# Register service via HTTP API
curl -X PUT http://localhost:8500/v1/agent/service/register \
  -d '{
    "Name": "user-service",
    "ID": "user-service-1",
    "Address": "10.0.1.5",
    "Port": 8080,
    "Tags": ["v1", "production"],
    "Check": {
      "HTTP": "http://10.0.1.5:8080/health",
      "Interval": "10s",
      "Timeout": "5s"
    }
  }'

# Query service instances
curl http://localhost:8500/v1/catalog/service/user-service

# Query via DNS (jika Consul DNS enabled)
dig @127.0.0.1 -p 8600 user-service.service.consul
```

### Netflix Eureka

**Karakteristik:** Service registry yang fokus pada availability (AP dalam CAP theorem).

```
┌──────────────────────────────────────────────────────────────┐
│                    NETFLIX EUREKA                            │
│                                                               │
│  Fitur:                                                       │
│  ✓ Service Discovery (REST API + Java client)                │
│  ✓ Health Checking (heartbeat/lease renewal)                 │
│  ✓ Self-preservation mode (saat network partition)           │
│  ✓ Region/Zone awareness                                     │
│  ✓ Dashboard untuk monitoring                                │
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  Eureka     │    │  Eureka     │    │  Eureka     │       │
│  │  Server 1   │◀──▶│  Server 2   │◀──▶│  Server 3   │       │
│  │             │    │             │    │             │       │
│  │  ┌───────┐  │    │  ┌───────┐  │    │  ┌───────┐  │       │
│  │  │Svc A  │  │    │  │Svc A  │  │    │  │Svc A  │  │       │
│  │  │Svc B  │  │    │  │Svc B  │  │    │  │Svc B  │  │       │
│  │  └───────┘  │    │  └───────┘  │    │  └───────┘  │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                               │
│  Setiap Eureka Server punya registry lengkap.                 │
│  Peer-to-peer replication antar server.                       │
│                                                               │
│  Self-Preservation Mode:                                      │
│  - Saat >85% heartbeat hilang dalam 15 menit                  │
│  - Eureka berhenti deregister instance                        │
│  - Mencegah deregister massal saat network issue              │
│  - Trade-off: mungkin return instance yang sudah down         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Contoh Penggunaan Eureka (Spring Boot):**
```java
// Service registration (application.yml)
spring:
  application:
    name: user-service

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    registerWithEureka: true
    fetchRegistry: true
  instance:
    leaseRenewalIntervalInSeconds: 30  # Heartbeat setiap 30 detik
    leaseExpirationDurationInSeconds: 90  # Dianggap down jika 90 detik tidak heartbeat

// Service discovery di client
@RestController
public class OrderController {
    @Autowired
    private DiscoveryClient discoveryClient;

    @GetMapping("/orders/{id}")
    public Order getOrder(@PathVariable String id) {
        // Discover user service instances
        List<ServiceInstance> instances =
            discoveryClient.getInstances("user-service");

        // Pilih instance (load balancing)
        ServiceInstance instance = instances.get(0);
        String url = instance.getUri() + "/users/" + id;

        // Call user service
        return restTemplate.getForObject(url, User.class);
    }
}
```

### etcd

**Karakteristik:** Distributed key-value store yang menjadi backbone Kubernetes.

```
┌──────────────────────────────────────────────────────────────┐
│                        etcd                                  │
│                                                               │
│  Fitur:                                                       │
│  ✓ Key-Value Store (hierarkis, seperti filesystem)           │
│  ✓ Watch (notifikasi saat key berubah)                       │
│  ✓ Lease (TTL untuk auto-expire)                             │
│  ✓ Raft Consensus (strong consistency)                       │
│  ✓ gRPC API                                                  │
│                                                               │
│  Struktur Key (hierarkis):                                    │
│  /registry/                                                   │
│  ├── services/                                                │
│  │   ├── user-service/                                        │
│  │   │   ├── instance-1 → {"ip":"10.0.1.5","port":8080}      │
│  │   │   └── instance-2 → {"ip":"10.0.1.6","port":8080}      │
│  │   ├── order-service/                                       │
│  │   │   └── instance-1 → {"ip":"10.0.2.5","port":8081}      │
│  │   └── payment-service/                                     │
│  │       └── instance-1 → {"ip":"10.0.3.5","port":8082}      │
│  └── config/                                                  │
│      └── global → {"timeout":"30s","retries":3}              │
│                                                               │
│  Arsitektur (Raft):                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  etcd       │    │  etcd       │    │  etcd       │       │
│  │  Node 1     │    │  Node 2     │    │  Node 3     │       │
│  │  (Leader)   │◀──▶│  (Follower) │◀──▶│  (Follower) │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                               │
│  Konsistensi: Strong (linearizable reads)                    │
│  Trade-off: Write lebih lambat karena Raft consensus          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Contoh Penggunaan etcd:**
```bash
# Register service dengan lease (TTL 60 detik)
LEASE_ID=$(etcdctl lease grant 60 | cut -d' ' -f3)

# Set key dengan lease
etcdctl put /registry/services/user-service/instance-1 \
  '{"ip":"10.0.1.5","port":8080}' \
  --lease=$LEASE_ID

# Keep lease alive (heartbeat)
etcdctl lease keep-alive $LEASE_ID

# Query service instances
etcdctl get /registry/services/user-service/ --prefix

# Watch untuk perubahan (real-time notification)
etcdctl watch /registry/services/user-service/ --prefix
```

### Perbandingan Service Registry

| Fitur | Consul | Eureka | etcd |
|-------|--------|--------|------|
| **Consensus** | Raft | Peer-to-peer (AP) | Raft |
| **CAP** | CP (tunabel ke AP) | AP | CP |
| **Health Check** | HTTP, TCP, script, TTL | Heartbeat/lease | Lease/TTL |
| **Query Interface** | DNS + HTTP API | REST API + Java | gRPC + HTTP |
| **Key-Value Store** | ✓ | ✗ | ✓ |
| **Multi-Datacenter** | ✓ | ✓ (region/zone) | ✗ |
| **Service Mesh** | ✓ (Connect) | ✗ | ✗ |
| **Bahasa** | Language agnostic | Java-first | Language agnostic |
| **Best Untuk** | Full service networking | Netflix stack, Java | Kubernetes, infra |
| **Konsistensi** | Strong (default) | Eventual | Strong |

---

## HEALTH CHECKING PATTERNS

### Mengapa Health Checking Penting?

Tanpa health checking, service registry tidak tahu apakah instance masih alive atau sudah crash. Result: client dikirim ke instance yang down → error.

```
┌──────────────────────────────────────────────────────────────┐
│              TANPA HEALTH CHECKING = MASALAH                  │
│                                                               │
│  Registry: "Service B ada di 10.0.1.5:8080"                  │
│  Client: Connect ke 10.0.1.5:8080...                         │
│  Result: Connection refused! (Service B sudah crash)          │
│                                                               │
│  DENGAN HEALTH CHECKING:                                      │
│  Registry: Cek 10.0.1.5:8080 → DOWN                          │
│  Registry: Hapus dari registry                                │
│  Client: Query → dapat instance lain yang healthy ✅          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Tipe Health Check

```
┌──────────────────────────────────────────────────────────────┐
│                  TIPE HEALTH CHECK                            │
│                                                               │
│  1. HTTP/TCP Health Check                                     │
│     ┌──────────┐    GET /health    ┌──────────┐              │
│     │ Registry │ ────────────────▶ │ Service  │              │
│     │          │ ◀──────────────── │          │              │
│     │          │   200 OK / 503    │ /health  │              │
│     └──────────┘                   └──────────┘              │
│     Interval: Setiap 10-30 detik                             │
│     Timeout: 5 detik                                         │
│     Unhealthy: 3x gagal berturut-turut                       │
│                                                               │
│  2. TTL (Time-To-Live) Health Check                           │
│     ┌──────────┐    Heartbeat     ┌──────────┐               │
│     │ Registry │ ◀─────────────── │ Service  │               │
│     │          │   Setiap 30 detik│          │               │
│     │          │                  │          │               │
│     │          │   Expired!       │          │               │
│     │          │   → Mark DOWN    │          │               │
│     └──────────┘                  └──────────┘               │
│     Service主动 kirim heartbeat                              │
│     Jika tidak ada heartbeat dalam TTL → dianggap down        │
│                                                               │
│  3. Script Health Check                                       │
│     ┌──────────┐    Run script    ┌──────────┐               │
│     │ Registry │ ───────────────▶ │  Local   │               │
│     │          │   ./check.sh     │  Script  │               │
│     │          │                  │          │               │
│     │          │   Exit code:     │          │               │
│     │          │   0 = healthy    │          │               │
│     │          │   1 = unhealthy  │          │               │
│     └──────────┘                  └──────────┘               │
│     Custom logic: cek disk space, memory, dependency          │
│                                                               │
│  4. Passive Health Check                                      │
│     Client report ke registry saat connection gagal           │
│     Registry mark instance sebagai unhealthy                  │
│     Tidak perlu active probing                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Health Check Implementation (HTTP)

```python
# Endpoint health check di setiap service
from flask import Flask, jsonify
import psycopg2
import redis

app = Flask(__name__)

@app.route('/health')
def health_check():
    """
    Health check yang cek semua dependency.
    Return 200 jika semua OK, 503 jika ada yang down.
    """
    status = {
        'service': 'user-service',
        'status': 'healthy',
        'checks': {}
    }

    # Cek database
    try:
        conn = psycopg2.connect(
            host='db-host', port=5432,
            dbname='users', user='app', password='***'
        )
        conn.close()
        status['checks']['database'] = 'healthy'
    except Exception as e:
        status['checks']['database'] = f'unhealthy: {str(e)}'
        status['status'] = 'unhealthy'

    # Cek Redis cache
    try:
        r = redis.Redis(host='redis-host', port=6379)
        r.ping()
        status['checks']['cache'] = 'healthy'
    except Exception as e:
        status['checks']['cache'] = f'unhealthy: {str(e)}'
        status['status'] = 'unhealthy'

    # Cek disk space
    import shutil
    total, used, free = shutil.disk_usage('/')
    if free < 1_000_000_000:  # < 1GB free
        status['checks']['disk'] = f'unhealthy: {free} bytes free'
        status['status'] = 'unhealthy'
    else:
        status['checks']['disk'] = 'healthy'

    http_status = 200 if status['status'] == 'healthy' else 503
    return jsonify(status), http_status

# Deep health check (untuk debugging, tidak untuk registry)
@app.route('/health/deep')
def deep_health_check():
    """Health check detail untuk debugging."""
    return jsonify({
        'service': 'user-service',
        'version': '1.2.3',
        'uptime': get_uptime(),
        'memory_usage': get_memory_usage(),
        'active_connections': get_active_connections(),
        'request_rate': get_request_rate(),
        'error_rate': get_error_rate(),
    }), 200
```

### Health Check Interval dan Threshold

```
┌──────────────────────────────────────────────────────────────┐
│           HEALTH CHECK INTERVAL & THRESHOLD                   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Parameter          │ Recommended  │ Trade-off      │     │
│  ├─────────────────────────────────────────────────────┤     │
│  │  Interval           │ 10-30 detik  │ Lebih sering   │     │
│  │                     │              │ = lebih cepat  │     │
│  │                     │              │ detect down    │     │
│  │                     │              │ = lebih banyak │     │
│  │                     │              │ overhead       │     │
│  ├─────────────────────────────────────────────────────┤     │
│  │  Timeout            │ 5 detik      │ Lebih pendek   │     │
│  │                     │              │ = lebih cepat  │     │
│  │                     │              │ detect slow    │     │
│  │                     │              │ = false positive│    │
│  ├─────────────────────────────────────────────────────┤     │
│  │  Unhealthy Threshold│ 3x gagal     │ Lebih banyak   │     │
│  │                     │              │ = lebih toleran│     │
│  │                     │              │ = lebih lama   │     │
│  │                     │              │ detect down    │     │
│  ├─────────────────────────────────────────────────────┤     │
│  │  Healthy Threshold  │ 2x sukses    │ Lebih banyak   │     │
│  │                     │              │ = lebih yakin  │     │
│  │                     │              │ service stable │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  Contoh Timeline:                                             │
│  t=0s   : Health check #1 → OK ✅                             │
│  t=10s  : Health check #2 → OK ✅                             │
│  t=20s  : Health check #3 → FAIL ❌ (count: 1)               │
│  t=30s  : Health check #4 → FAIL ❌ (count: 2)               │
│  t=40s  : Health check #5 → FAIL ❌ (count: 3) → MARK DOWN   │
│  t=40s  : Instance dihapus dari registry                      │
│  t=50s  : Health check #6 → OK ✅ (count: 1)                  │
│  t=60s  : Health check #7 → OK ✅ (count: 2) → MARK HEALTHY   │
│  t=60s  : Instance didaftarkan kembali ke registry            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## SERVICE DEREGISTRATION

### Mengapa Deregistration Penting?

Service yang sudah down tapi masih terdaftar di registry akan terus menerima traffic → error untuk client.

### Metode Deregistration

```
┌──────────────────────────────────────────────────────────────┐
│               METODE DEREGISTRATION                           │
│                                                               │
│  1. Graceful Shutdown (Ideal)                                 │
│     ┌──────────┐    1. SIGTERM     ┌──────────┐              │
│     │ Orchestr │ ────────────────▶ │ Service  │              │
│     │ ator     │                   │          │              │
│     │          │   2. Deregister   │          │              │
│     │          │ ◀──────────────── │ (sendiri)│              │
│     │          │                   │          │              │
│     │          │   3. Finish req   │          │              │
│     │          │   4. Exit         │          │              │
│     └──────────┘                   └──────────┘              │
│     Service deregister DIRI SENDIRI sebelum shutdown          │
│     Selesaikan request yang sedang diproses                   │
│                                                               │
│  2. Health Check Timeout (Fallback)                           │
│     Registry detect instance tidak response                   │
│     Setelah Nx gagal → auto deregister                        │
│     Ini adalah safety net jika graceful shutdown gagal        │
│                                                               │
│  3. TTL/Lease Expiry (Automatic)                              │
│     Service register dengan lease (TTL 60 detik)              │
│     Service harus renew lease secara berkala                  │
│     Jika tidak renew → lease expire → auto deregister         │
│     Ini metode paling reliable                                │
│                                                               │
│  4. Force Deregister (Manual/Emergency)                       │
│     Operator manual deregister instance                       │
│     Untuk emergency: instance misbehaving, security issue     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Graceful Shutdown Implementation

```python
import signal
import sys
import time
from flask import Flask

app = Flask(__name__)
is_shutting_down = False

def graceful_shutdown(signum, frame):
    """Handle graceful shutdown."""
    global is_shutting_down
    is_shutting_down = True

    print("Menerima signal shutdown. Deregister dari registry...")

    # 1. Deregister dari service registry
    deregister_from_consul()

    # 2. Tunggu request yang sedang diproses selesai
    print("Menunggu request aktif selesai...")
    wait_for_active_requests(timeout=30)

    # 3. Shutdown
    print("Shutdown complete.")
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGTERM, graceful_shutdown)
signal.signal(signal.SIGINT, graceful_shutdown)

@app.route('/health')
def health():
    """Health check yang return unhealthy saat shutting down."""
    if is_shutting_down:
        return jsonify({'status': 'shutting_down'}), 503
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/users')
def get_users():
    """Endpoint yang respect shutdown signal."""
    if is_shutting_down:
        # Return error agar client tidak retry ke instance ini
        return jsonify({'error': 'Service shutting down'}), 503

    # Process request normally
    users = fetch_users_from_db()
    return jsonify(users), 200

def deregister_from_consul():
    """Deregister service dari Consul."""
    import consul
    c = consul.Consul()
    c.agent.service.deregister('user-service-1')

def wait_for_active_requests(timeout=30):
    """Tunggu active requests selesai (max timeout detik)."""
    start = time.time()
    while get_active_request_count() > 0:
        if time.time() - start > timeout:
            print("Timeout waiting for requests. Force shutdown.")
            break
        time.sleep(0.5)
```

---

## DNS-BASED DISCOVERY

### Konsep DNS-Based Discovery

Service discovery via DNS query — client resolve service name ke IP address(es).

```
┌──────────────────────────────────────────────────────────────┐
│                  DNS-BASED DISCOVERY                          │
│                                                               │
│  ┌──────────┐    DNS Query    ┌──────────────────┐           │
│  │ Service  │ ──────────────▶│  DNS Server       │           │
│  │   A      │  "user-service │  (Consul/CoreDNS) │           │
│  │          │   .service     │                   │           │
│  │          │   .consul"     │                   │           │
│  │          │ ◀──────────────│  Response:        │           │
│  │          │   A records:   │                   │           │
│  │          │   10.0.1.5     │                   │           │
│  │          │   10.0.1.6     │                   │           │
│  │          │   10.0.1.7     │                   │           │
│  └────┬─────┘                └──────────────────┘           │
│       │                                                       │
│       ▼                                                       │
│  ┌──────────┐                                                 │
│  │ Service  │ ← Connect ke salah satu IP                      │
│  │   B      │   (client-side load balancing)                  │
│  └──────────┘                                                 │
│                                                               │
│  Format DNS:                                                  │
│  <service>.service.<datacenter>.consul                        │
│  Contoh: user-service.service.dc1.consul                      │
│                                                               │
│  SRV Record (dengan port):                                    │
│  dig @127.0.0.1 -p 8600 user-service.service.consul SRV      │
│  → user-service.service.consul. 0 IN SRV 1 1 8080 node1       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Implementasi dengan CoreDNS (Kubernetes)

```
┌──────────────────────────────────────────────────────────────┐
│              COREDNS DI KUBERNETES                            │
│                                                               │
│  CoreDNS berjalan sebagai addon di Kubernetes cluster.        │
│  Setiap Service di Kubernetes mendapat DNS entry otomatis.    │
│                                                               │
│  DNS Pattern:                                                 │
│  <service-name>.<namespace>.svc.cluster.local                 │
│                                                               │
│  Contoh:                                                      │
│  user-service.default.svc.cluster.local                       │
│                                                               │
│  Corefile configuration:                                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  .:53 {                                                 │ │
│  │      kubernetes cluster.local in-addr.arpa ip6.arpa {   │ │
│  │          pods insecure                                  │ │
│  │          fallthrough in-addr.arpa ip6.arpa              │ │
│  │      }                                                  │ │
│  │      prometheus :9153                                   │ │
│  │      forward . /etc/resolv.conf                         │ │
│  │      cache 30                                           │ │
│  │      loop                                               │ │
│  │      reload                                             │ │
│  │      loadbalance                                        │ │
│  │  }                                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Saat Service A memanggil http://user-service/api/users:      │
│  1. OS resolver query ke CoreDNS                             │
│  2. CoreDNS resolve ke ClusterIP Service B                   │
│  3. kube-proxy route ke salah satu pod yang healthy           │
│  4. Response kembali ke Service A                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### DNS Caching dan TTL

```
┌──────────────────────────────────────────────────────────────┐
│              DNS CACHING & TTL ISSUE                          │
│                                                               │
│  Masalah: DNS cache di OS/client bisa stale.                  │
│                                                               │
│  Timeline:                                                    │
│  t=0s   : Service A resolve user-service → 10.0.1.5          │
│  t=0s   : OS cache hasil DNS (TTL = 30 detik)                │
│  t=10s  : Instance 10.0.1.5 DOWN                             │
│  t=10s  : Registry update, DNS update → 10.0.1.6             │
│  t=15s  : Service A masih pakai 10.0.1.5 (dari cache!) ❌    │
│  t=30s  : DNS cache expire                                   │
│  t=30s  : Service A resolve lagi → 10.0.1.6 ✅               │
│                                                               │
│  Solusi:                                                      │
│  1. TTL pendek (5-10 detik) → lebih cepat update             │
│  2. Client-side caching dengan TTL sendiri                    │
│  3. Refresh cache secara berkala                              │
│  4. Gunakan service mesh sidecar (handle discovery otomatis)  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## API GATEWAY: FUNGSI DAN KOMPONEN

### Apa itu API Gateway?

API Gateway adalah **single entry point** untuk semua client yang ingin mengakses microservices. Ini seperti resepsionis di gedung perkantoran — semua tamu harus lewat sini dulu.

```
┌──────────────────────────────────────────────────────────────┐
│                    API GATEWAY                                │
│                                                               │
│                       CLIENTS                                 │
│              ┌──────────┬──────────┐                          │
│              │          │          │                          │
│           [Web]      [Mobile]   [Third-party]                │
│              │          │          │                          │
│              └──────────┼──────────┘                          │
│                         ▼                                     │
│              ┌─────────────────────┐                          │
│              │                     │                          │
│              │    API GATEWAY      │                          │
│              │                     │                          │
│              │  1. Routing         │                          │
│              │  2. Authentication  │                          │
│              │  3. Rate Limiting   │                          │
│              │  4. Caching         │                          │
│              │  5. Transformation  │                          │
│              │  6. Logging         │                          │
│              │  7. Load Balancing  │                          │
│              │  8. Circuit Breaker │                          │
│              │                     │                          │
│              └──┬────┬────┬────┬───┘                          │
│                 │    │    │    │                               │
│                 ▼    ▼    ▼    ▼                               │
│              ┌──┐ ┌──┐ ┌──┐ ┌──┐                              │
│              │U │ │O │ │P │ │N │                              │
│              │S │ │R │ │A │ │O │  ← Microservices             │
│              │R │ │D │ │Y │ │T │                              │
│              │  │ │  │ │  │ │  │                              │
│              └──┘ └──┘ └──┘ └──┘                              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Fungsi API Gateway (Detail)

#### 1. Routing

```
┌──────────────────────────────────────────────────────────────┐
│                    ROUTING                                    │
│                                                               │
│  Request masuk → API Gateway match path → forward ke service  │
│                                                               │
│  Routing Rules:                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Path Pattern          │ Target Service              │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  /api/users/*          │ user-service:8080           │    │
│  │  /api/orders/*         │ order-service:8081          │    │
│  │  /api/payments/*       │ payment-service:8082        │    │
│  │  /api/products/*       │ product-service:8083        │    │
│  │  /api/notifications/*  │ notification-service:8084   │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  Contoh:                                                      │
│  GET /api/users/123 → forward ke http://user-service:8080/users/123  │
│  POST /api/orders → forward ke http://order-service:8081/orders    │
│                                                               │
│  Advanced Routing:                                            │
│  - Path-based: /api/v1/* vs /api/v2/* (versioning)           │
│  - Header-based: X-Environment: staging → staging services   │
│  - Weight-based: 90% traffic ke v1, 10% ke v2 (canary)       │
│  - Geo-based: User dari Asia → Asia services                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Authentication & Authorization

```
┌──────────────────────────────────────────────────────────────┐
│              AUTHENTICATION & AUTHORIZATION                   │
│                                                               │
│  API Gateway sebagai single point untuk auth:                 │
│                                                               │
│  Request → Gateway:                                           │
│  1. Extract token dari header (Authorization: Bearer <token>) │
│  2. Validate token (signature, expiry, issuer)               │
│  3. Extract user info dari token (user_id, role, permissions) │
│  4. Check authorization (role/permission untuk endpoint ini)  │
│  5a. Valid → forward ke service dengan user context           │
│  5b. Invalid → return 401 Unauthorized                        │
│                                                               │
│  Keuntungan:                                                  │
│  - Microservices TIDAK perlu implement auth logic             │
│  - Konsisten: semua service pakai auth yang sama              │
│  - Mudah update: ganti auth strategy di satu tempat           │
│  - Gateway inject user context ke header untuk service        │
│    X-User-Id: 123                                             │
│    X-User-Role: admin                                         │
│                                                               │
│  JWT Validation di Gateway:                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  1. Decode JWT header (alg, typ)                        │ │
│  │  2. Verify signature dengan public key                  │ │
│  │  3. Check exp (expiry)                                  │ │
│  │  4. Check iss (issuer)                                  │ │
│  │  5. Check aud (audience)                                │ │
│  │  6. Extract claims (sub, role, permissions)             │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 3. Rate Limiting

```
┌──────────────────────────────────────────────────────────────┐
│                    RATE LIMITING                              │
│                                                               │
│  Batasi jumlah request per user/IP untuk mencegah abuse       │
│  dan melindungi backend services dari overload.               │
│                                                               │
│  Strategi:                                                    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Strategi        │ Cara Kerja          │ Use Case     │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  Fixed Window    │ Count per window    │ Simple       │    │
│  │                  │ (1 menit, 1 jam)    │              │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  Sliding Window  │ Weighted count      │ Smooth       │    │
│  │                  │ across windows      │ limiting     │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  Token Bucket    │ Tokens refill       │ Burst        │    │
│  │                  │ secara berkala      │ allowed      │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  Leaky Bucket    │ Request diproses    │ Steady       │    │
│  │                  │ dengan rate tetap   │ output       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  Token Bucket Example:                                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Bucket capacity: 100 tokens                             │ │
│  │  Refill rate: 10 tokens/detik                            │ │
│  │                                                          │ │
│  │  Request 1: ambil 1 token → OK (99 sisa)                │ │
│  │  Request 2: ambil 1 token → OK (98 sisa)                │ │
│  │  ...                                                     │ │
│  │  Request 100: ambil 1 token → OK (0 sisa)               │ │
│  │  Request 101: tidak ada token → 429 Too Many Requests   │ │
│  │  ...                                                     │ │
│  │  1 detik kemudian: +10 tokens → bucket = 10             │ │
│  │  Request 102: ambil 1 token → OK (9 sisa)               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Implementasi dengan Redis:                                   │
│  Key: rate_limit:{user_id}:{endpoint}                        │
│  Value: counter (increment per request)                       │
│  TTL: window size (60 detik)                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 4. Caching

```
┌──────────────────────────────────────────────────────────────┐
│                    CACHING                                    │
│                                                               │
│  API Gateway bisa cache response untuk endpoint yang:         │
│  - Sering diakses (hot path)                                  │
│  - Data tidak sering berubah                                  │
│  - Read-only (GET requests)                                   │
│                                                               │
│  Flow:                                                        │
│  Request → Gateway:                                           │
│  1. Check cache untuk path ini                                │
│  2a. Cache HIT → return cached response (cepat!)              │
│  2b. Cache MISS → forward ke service, cache response          │
│                                                               │
│  Cache Key: HTTP Method + Path + Query Params                 │
│  Contoh: GET:/api/products?category=electronics               │
│                                                               │
│  Cache TTL:                                                   │
│  - Static data (categories): 1 jam                            │
│  - Semi-static (products): 5 menit                            │
│  - Dynamic (user profile): tidak cache / 10 detik             │
│                                                               │
│  Cache Invalidation:                                          │
│  - TTL expiry (automatic)                                     │
│  - Manual invalidate saat data berubah (POST/PUT/DELETE)      │
│  - Tag-based invalidation (invalidate semua tag "products")   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 5. Request/Response Transformation

```
┌──────────────────────────────────────────────────────────────┐
│              TRANSFORMATION                                   │
│                                                               │
│  API Gateway bisa mengubah request/response sebelum/sesudah   │
│  forward ke backend service.                                  │
│                                                               │
│  Request Transformation:                                      │
│  - Strip prefix: /api/users/123 → /users/123                 │
│  - Add headers: X-Request-Id, X-User-Id                       │
│  - Transform body: XML → JSON                                 │
│  - Validate schema: reject invalid request sebelum ke service │
│                                                               │
│  Response Transformation:                                     │
│  - Add headers: X-Response-Time, X-Cache-Status               │
│  - Filter fields: hapus sensitive data dari response          │
│  - Aggregate: gabung response dari multiple services          │
│  - Format: JSON → XML (untuk legacy client)                   │
│                                                               │
│  Contoh Response Transformation:                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Response dari service:                                  │ │
│  │  {                                                       │ │
│  │    "id": 123,                                            │ │
│  │    "name": "John",                                       │ │
│  │    "email": "john@example.com",                          │ │
│  │    "password_hash": "$2b$12$...",  ← SENSITIVE!          │ │
│  │    "internal_notes": "VIP customer"  ← INTERNAL!         │ │
│  │  }                                                       │ │
│  │                                                          │ │
│  │  Setelah gateway transformation:                         │ │
│  │  {                                                       │ │
│  │    "id": 123,                                            │ │
│  │    "name": "John",                                       │ │
│  │    "email": "john@example.com"                           │ │
│  │  }                                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### 6. Logging & Monitoring

```
┌──────────────────────────────────────────────────────────────┐
│              LOGGING & MONITORING                             │
│                                                               │
│  API Gateway sebagai single point untuk logging semua traffic.│
│                                                               │
│  Data yang di-log:                                            │
│  - Timestamp                                                  │
│  - Client IP                                                  │
│  - HTTP Method + Path                                         │
│  - Response Status Code                                       │
│  - Response Time                                              │
│  - Request/Response Size                                      │
│  - User ID (jika authenticated)                               │
│  - Request ID (untuk tracing)                                 │
│                                                               │
│  Log Format (JSON):                                           │
│  {                                                            │
│    "timestamp": "2026-05-21T10:30:00Z",                       │
│    "request_id": "abc-123-def",                               │
│    "client_ip": "192.168.1.100",                              │
│    "method": "GET",                                           │
│    "path": "/api/users/123",                                  │
│    "status": 200,                                             │
│    "response_time_ms": 45,                                    │
│    "request_size": 0,                                         │
│    "response_size": 256,                                      │
│    "user_id": "user-456"                                      │
│  }                                                            │
│                                                               │
│  Metrics yang dimonitor:                                      │
│  - Request rate (req/s)                                       │
│  - Error rate (% 4xx, % 5xx)                                  │
│  - Response time (p50, p95, p99)                              │
│  - Active connections                                         │
│  - Cache hit rate                                             │
│  - Rate limit hits                                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## API GATEWAY PATTERNS

### 1. Backend for Frontend (BFF) Pattern

```
┌──────────────────────────────────────────────────────────────┐
│              BACKEND FOR FRONTEND (BFF)                       │
│                                                               │
│  Setiap client type punya API Gateway sendiri yang            │
│  dioptimalkan untuk kebutuhan client tersebut.                │
│                                                               │
│  ┌─────────────┐         ┌─────────────┐                     │
│  │  Web App    │ ──────▶ │  Web BFF    │                     │
│  │ (Browser)   │         │ Gateway     │                     │
│  └─────────────┘         └──────┬──────┘                     │
│                                 │                             │
│  ┌─────────────┐         ┌──────┴──────┐                     │
│  │  Mobile App │ ──────▶ │  Mobile BFF │                     │
│  │ (iOS/Android)│        │  Gateway    │                     │
│  └─────────────┘         └──────┬──────┘                     │
│                                 │                             │
│  ┌─────────────┐         ┌──────┴──────┐                     │
│  │  Third Party│ ──────▶ │  Public BFF │                     │
│  │  (API)      │         │  Gateway    │                     │
│  └─────────────┘         └──────┬──────┘                     │
│                                 │                             │
│                    ┌────────────┼────────────┐                │
│                    ▼            ▼            ▼                │
│                 ┌────┐      ┌────┐      ┌────┐               │
│                 │User│      │Order│     │Prod│               │
│                 │Svc │      │Svc  │     │Svc │               │
│                 └────┘      └────┘      └────┘               │
│                                                               │
│  Perbedaan per BFF:                                           │
│  - Web BFF: Response besar, banyak data, HTML-friendly        │
│  - Mobile BFF: Response kecil, optimized untuk network lambat │
│  - Public BFF: Rate limit ketat, field filtering, versioning  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 2. Aggregation Pattern

```
┌──────────────────────────────────────────────────────────────┐
│              AGGREGATION PATTERN                              │
│                                                               │
│  API Gateway menggabungkan response dari multiple services    │
│  menjadi satu response untuk client.                          │
│                                                               │
│  Tanpa Aggregation (Client call multiple services):           │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                     │
│  │Client│─▶│ User │  │Client│─▶│Order │  │Client│─▶│Product│ │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘ │
│  3 network calls, 3x latency                                  │
│                                                               │
│  Dengan Aggregation (Client call Gateway):                    │
│  ┌──────┐     ┌─────────────┐                                │
│  │Client│────▶│   Gateway   │──▶ User Service                │
│  └──────┘     │             │──▶ Order Service               │
│               │             │──▶ Product Service             │
│               │  (Aggregate │                                │
│               │   responses)│                                │
│               └─────────────┘                                │
│  1 network call, parallel backend calls, lower latency        │
│                                                               │
│  Contoh: Dashboard endpoint                                   │
│  GET /api/dashboard → Gateway panggil paralel:               │
│    - /api/users/profile                                       │
│    - /api/orders/recent                                       │
│    - /api/notifications/unread                                │
│    - /api/recommendations                                     │
│  Gabung semua jadi satu response JSON.                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 3. Composition Pattern

```
┌──────────────────────────────────────────────────────────────┐
│              COMPOSITION PATTERN                              │
│                                                               │
│  API Gateway tidak hanya aggregate, tapi juga compose         │
│  business logic dari multiple services.                       │
│                                                               │
│  Contoh: Create Order (melibatkan 3 services)                 │
│                                                               │
│  POST /api/orders                                             │
│  Gateway orchestrate:                                         │
│    1. POST /api/inventory/reserve  → Reserve stock            │
│    2. POST /api/payment/charge     → Process payment          │
│    3. POST /api/orders/create      → Create order record      │
│    4. POST /api/notification/send  → Send confirmation        │
│                                                               │
│  Error handling:                                              │
│    - Jika step 2 gagal → rollback step 1 (compensating)       │
│    - Jika step 3 gagal → refund step 2, release step 1        │
│    - Ini adalah Saga Pattern di level Gateway                 │
│                                                               │
│  ⚠️ Warning:                                                  │
│  Gateway sebaiknya TIDAK terlalu banyak business logic.       │
│  Routing + auth + rate limiting = ideal.                      │
│  Composition yang kompleks = pertimbangkan orchestration      │
│  service terpisah.                                            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## API GATEWAY VS SERVICE MESH

```
┌──────────────────────────────────────────────────────────────┐
│              API GATEWAY VS SERVICE MESH                      │
│                                                               │
│  ┌─────────────────────────┐  ┌────────────────────────────┐ │
│  │     API GATEWAY         │  │      SERVICE MESH          │ │
│  ├─────────────────────────┤  ├────────────────────────────┤ │
│  │ North-South Traffic     │  │ East-West Traffic          │ │
│  │ (Client → Services)     │  │ (Service → Service)        │ │
│  │                         │  │                            │ │
│  │ Single entry point      │  │ Every service punya        │ │
│  │ untuk external client   │  │ sidecar proxy              │ │
│  │                         │  │                            │ │
│  │ Fungsi:                 │  │ Fungsi:                    │ │
│  │ - Routing               │  │ - Service discovery        │ │
│  │ - Auth                  │  │ - mTLS (encryption)        │ │
│  │ - Rate limiting         │  │ - Traffic management       │ │
│  │ - Caching               │  │ - Observability            │ │
│  │ - Load balancing        │  │ - Circuit breaking         │ │
│  │                         │  │ - Retry/timeout            │ │
│  │ Tools:                  │  │                            │ │
│  │ - Kong                  │  │ Tools:                     │ │
│  │ - AWS API Gateway       │  │ - Istio                    │ │
│  │ - Apigee                │  │ - Linkerd                  │ │
│  │ - Nginx                 │  │ - Consul Connect           │ │
│  │ - Traefik               │  │ - Envoy                    │ │
│  └─────────────────────────┘  └────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  KEDUANYA BISA DIGUNAKAN BERSAMA!                        │ │
│  │                                                          │ │
│  │  [External Client]                                       │ │
│  │        │                                                 │ │
│  │        ▼                                                 │ │
│  │  ┌─────────────┐    North-South                         │ │
│  │  │ API Gateway │ ◀──────── traffic                      │ │
│  │  └──────┬──────┘                                        │ │
│  │         │                                                │ │
│  │         ▼                                                │ │
│  │  ┌─────────────────────────────────┐                    │ │
│  │  │       Service Mesh              │  East-West         │ │
│  │  │  ┌─────┐  ┌─────┐  ┌─────┐     │  traffic           │ │
│  │  │  │Svc A│←→│Svc B│←→│Svc C│     │  antar service     │ │
│  │  │  └─────┘  └─────┘  └─────┘     │                    │ │
│  │  └─────────────────────────────────┘                    │ │
│  │                                                          │ │
│  │  API Gateway handle traffic dari luar cluster.           │ │
│  │  Service Mesh handle traffic antar service di dalam.     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Perbandingan Detail

| Aspek | API Gateway | Service Mesh |
|-------|-------------|--------------|
| **Traffic** | North-South (external → internal) | East-West (internal → internal) |
| **Scope** | Perimeter cluster | Dalam cluster |
| **Deployment** | Single instance / HA pair | Sidecar di setiap pod |
| **Service Discovery** | Opsional | Wajib |
| **Encryption** | TLS (external) | mTLS (internal) |
| **Observability** | Request logging, metrics | Distributed tracing, metrics |
| **Traffic Management** | Routing, rate limiting | Canary, A/B testing, retry |
| **Complexity** | Medium | Tinggi (sidecar di setiap service) |
| **Best Untuk** | External API management | Internal service communication |

---

## PERBANDINGAN: KONG, APIGEE, AWS API GATEWAY

### Kong API Gateway

```
┌──────────────────────────────────────────────────────────────┐
│                    KONG API GATEWAY                           │
│                                                               │
│  Tipe: Open-source (Apache 2.0) + Enterprise                  │
│  Basis: Nginx + OpenResty (Lua)                               │
│  Database: PostgreSQL / Cassandra (konfigurasi)               │
│                                                               │
│  Fitur Utama:                                                 │
│  ✓ Routing (path, host, method-based)                        │
│  ✓ Plugin ecosystem (100+ plugins)                           │
│  ✓ Rate limiting (per consumer, per service, per route)       │
│  ✓ Authentication (JWT, OAuth2, Key Auth, LDAP)              │
│  ✓ Logging (file, TCP, UDP, HTTP, syslog)                    │
│  ✓ Transformation (request/response)                         │
│  ✓ CORS handling                                             │
│  ✓ Load balancing (round-robin, least-conn, consistent hash)  │
│  ✓ Circuit breaker                                           │
│  ✓ Service mesh integration (Kong Mesh)                      │
│                                                               │
│  Arsitektur:                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  Kong Node  │    │  Kong Node  │    │  Kong Node  │       │
│  │  (Nginx)    │    │  (Nginx)    │    │  (Nginx)    │       │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘       │
│         │                 │                  │                │
│         └─────────────────┼──────────────────┘                │
│                           ▼                                   │
│                    ┌─────────────┐                            │
│                    │ PostgreSQL  │ ← Shared config database    │
│                    │ / Cassandra │   Routes, plugins, consumers│
│                    └─────────────┘                            │
│                                                               │
│  Plugin Example (rate limiting):                              │
│  curl -X POST http://kong:8001/services/my-service/plugins \  │
│    -d "name=rate-limiting" \                                  │
│    -d "config.second=10" \                                    │
│    -d "config.policy=local"                                   │
│                                                               │
│  Best Untuk:                                                  │
│  - Tim yang butuh kontrol penuh (self-hosted)                │
│  - Custom plugin development (Lua)                            │
│  - High performance (Nginx-based)                             │
│  - Multi-cloud deployment                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Google Apigee

```
┌──────────────────────────────────────────────────────────────┐
│                    GOOGLE APIGEE                              │
│                                                               │
│  Tipe: Cloud-hosted (SaaS) oleh Google Cloud                  │
│  Basis: Proprietary platform                                  │
│                                                               │
│  Fitur Utama:                                                 │
│  ✓ API Design & Development (visual editor)                  │
│  ✓ API Analytics (real-time dashboard)                       │
│  ✓ Monetization (billing, quota, developer portal)           │
│  ✓ Developer Portal (self-service API documentation)          │
│  ✓ Security (OAuth2, SAML, API key, threat protection)       │
│  ✓ Traffic Management (quota, spike arrest, caching)         │
│  ✓ Mediation (transformation, orchestration)                 │
│  ✓ AI-powered anomaly detection                              │
│                                                               │
│  Arsitektur (Managed):                                        │
│  ┌─────────────┐                                              │
│  │  Apigee     │ ← Fully managed oleh Google                  │
│  │  Platform   │   Tidak perlu maintain infrastructure        │
│  └──────┬──────┘                                              │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Runtime    │    │  Analytics  │    │  Developer  │        │
│  │  Processing │    │  Engine     │    │  Portal     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                               │
│  Best Untuk:                                                  │
│  - Enterprise yang mau managed solution                       │
│  - API monetization (jual akses API)                          │
│  - Developer ecosystem (developer portal)                     │
│  - Advanced analytics dan monitoring                          │
│  - Sudah di Google Cloud ecosystem                            │
│                                                               │
│  Pricing: Berbasis API calls (pay-as-you-go)                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### AWS API Gateway

```
┌──────────────────────────────────────────────────────────────┐
│                  AWS API GATEWAY                              │
│                                                               │
│  Tipe: Managed service oleh AWS                               │
│  Basis: AWS proprietary                                       │
│                                                               │
│  Tipe API:                                                    │
│  - REST API: HTTP/JSON, WebSocket, request/response model    │
│  - HTTP API: Lebih murah, lebih cepat, fitur lebih sedikit   │
│  - WebSocket API: Full-duplex communication                  │
│                                                               │
│  Fitur Utama:                                                 │
│  ✓ Routing (path, method, query parameter)                   │
│  ✓ Integration (Lambda, HTTP, AWS services, mock)            │
│  ✓ Authentication (IAM, Cognito, custom authorizer)          │
│  ✓ Throttling (per API key, per method)                      │
│  ✓ Caching (TTL-based response caching)                      │
│  ✓ Request/Response transformation (mapping templates)        │
│  ✓ Stage management (dev, staging, production)               │
│  ✓ Custom domain + SSL                                       │
│  ✓ API versioning                                            │
│  ✓ Usage plans + API keys                                    │
│                                                               │
│  Arsitektur (Serverless):                                     │
│  ┌─────────────┐                                              │
│  │  API        │ ← Fully managed, auto-scaling               │
│  │  Gateway    │   Tidak perlu provision server              │
│  └──────┬──────┘                                              │
│         │                                                      │
│         ▼                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Lambda     │    │  EC2 / ECS  │    │  AWS        │        │
│  │  Functions  │    │  Services   │    │  Services   │        │
│  │  (Serverless│    │  (HTTP)     │    │  (DynamoDB, │        │
│  │   backend)  │    │             │    │   S3, SQS)  │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                               │
│  Best Untuk:                                                  │
│  - Sudah di AWS ecosystem                                     │
│  - Serverless architecture (Lambda integration)               │
│  - Pay-per-use pricing model                                  │
│  - Auto-scaling tanpa konfigurasi                             │
│  - Integrasi dengan AWS services (Cognito, DynamoDB, etc)     │
│                                                               │
│  Pricing: Per API call + data transfer                        │
│  REST API: $3.50/juta call (tier 1)                          │
│  HTTP API: $1.00/juta call (lebih murah)                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Perbandingan Head-to-Head

| Aspek | Kong | Apigee | AWS API Gateway |
|-------|------|--------|-----------------|
| **Tipe** | Open-source + Enterprise | SaaS (Google) | Managed (AWS) |
| **Deployment** | Self-hosted / Cloud | Google Cloud only | AWS only |
| **Pricing** | Free (OSS) / Enterprise | Pay-per-call + platform | Pay-per-call |
| **Performance** | Tinggi (Nginx) | Tinggi | Tinggi |
| **Customization** | Sangat tinggi (Lua plugins) | Medium | Terbatas |
| **Analytics** | Basic (OSS) / Advanced (Ent) | Sangat advanced | Medium (CloudWatch) |
| **Developer Portal** | Via plugin (Kong Dev Portal) | Built-in, powerful | Tidak ada (perlu buat sendiri) |
| **Monetization** | Via plugin | Built-in | Via Usage Plans |
| **Multi-cloud** | ✓ | ✗ (Google only) | ✗ (AWS only) |
| **Learning Curve** | Medium | Tinggi | Rendah (jika sudah AWS) |
| **Best Untuk** | Kontrol penuh, custom | Enterprise, monetization | AWS ecosystem, serverless |

---

## IMPLEMENTASI PRAKTIS

### Setup Kong API Gateway dengan Docker

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: kong
      POSTGRES_DB: kong
      POSTGRES_PASSWORD: kong
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "kong"]
      interval: 5s
      timeout: 5s
      retries: 5

  kong:
    image: kong:3.4
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
    ports:
      - "8000:8000"  # Proxy port (client → services)
      - "8001:8001"  # Admin port (configuration)
    depends_on:
      postgres:
        condition: service_healthy

  konga:
    image: pantsel/konga:latest
    environment:
      NODE_ENV: production
    ports:
      - "1337:1337"  # Konga UI
    depends_on:
      - kong
```

```bash
# Setup database Kong
docker-compose run kong kong migrations bootstrap

# Start semua services
docker-compose up -d

# Verifikasi Kong berjalan
curl http://localhost:8001
```

### Konfigurasi Service dan Route di Kong

```bash
# 1. Register Service (backend yang akan di-proxy)
curl -X POST http://localhost:8001/services \
  --data name=user-service \
  --data url=http://user-service:8080

# 2. Tambahkan Route (path mapping)
curl -X POST http://localhost:8001/services/user-service/routes \
  --data 'paths[]=/api/users' \
  --data strip_path=true

# 3. Tambahkan Rate Limiting Plugin
curl -X POST http://localhost:8001/services/user-service/plugins \
  --data name=rate-limiting \
  --data config.second=10 \
  --data config.policy=local

# 4. Tambahkan JWT Authentication Plugin
curl -X POST http://localhost:8001/services/user-service/plugins \
  --data name=jwt \
  --data config.claims_to_verify=exp

# 5. Buat Consumer (user yang boleh akses API)
curl -X POST http://localhost:8001/consumers \
  --data username=app-client-1

# 6. Generate JWT credential untuk consumer
curl -X POST http://localhost:8001/consumers/app-client-1/jwt

# Test:
# Request tanpa JWT → 401 Unauthorized
# Request dengan JWT valid → 200 OK
# Request > 10 per detik → 429 Too Many Requests
```

### API Gateway dengan Express.js (Simple Implementation)

```javascript
// gateway.js — Simple API Gateway dengan Express
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Service registry (dalam produksi, gunakan Consul/Eureka)
const SERVICES = {
  'user-service': { url: 'http://user-service:8080', path: '/api/users' },
  'order-service': { url: 'http://order-service:8081', path: '/api/orders' },
  'product-service': { url: 'http://product-service:8082', path: '/api/products' },
  'payment-service': { url: 'http://payment-service:8083', path: '/api/payments' },
};

// Middleware: Logging
app.use((req, res, next) => {
  req.startTime = Date.now();
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Middleware: Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 100, // max 100 request per menit per IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware: Authentication (untuk path yang butuh auth)
const AUTH_PATHS = ['/api/orders', '/api/payments'];

function authenticate(req, res, next) {
  const needsAuth = AUTH_PATHS.some(path => req.path.startsWith(path));
  if (!needsAuth) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.use(authenticate);

// Routing: Proxy ke backend services
Object.entries(SERVICES).forEach(([name, config]) => {
  app.use(
    config.path,
    createProxyMiddleware({
      target: config.url,
      changeOrigin: true,
      pathRewrite: {
        [`^${config.path}`]: '', // strip prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        // Inject user context ke header
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.id);
          proxyReq.setHeader('X-User-Role', req.user.role);
        }
        // Inject request ID untuk tracing
        proxyReq.setHeader('X-Request-Id', req.id || generateId());
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add response time header
        const responseTime = Date.now() - req.startTime;
        proxyRes.headers['X-Response-Time'] = `${responseTime}ms`;
      },
      onError: (err, req, res) => {
        console.error(`Proxy error for ${name}:`, err.message);
        res.status(502).json({
          error: 'Service unavailable',
          service: name,
        });
      },
    })
  );
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    services: Object.keys(SERVICES),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

---

## REFERENSI DARI DONNEMARTIN/SYSTEM-DESIGN-PRIMER

Materi di file ini terkait dengan bagian-bagian berikut di [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer):

### Service Discovery
- **System Design Topics → Service Discovery** — Penjelasan konsep service discovery, client-side vs server-side, service registry patterns
- **Microservices → Service Discovery** — Bagaimana microservices menemukan satu sama lain

### API Gateway
- **System Design Topics → API Gateway** — Pattern API Gateway, fungsi, dan implementasi
- **Microservices → API Gateway Pattern** — Bagaimana API Gateway menjadi entry point untuk microservices

### Load Balancing (Related)
- **System Design Topics → Load Balancing** — Horizontal scaling, load balancing algorithms (round-robin, least connections, consistent hashing)
- **Horizontal Scaling → Load Balancers** — Layer 4 vs Layer 7 load balancing

### Additional References
- **Consul Documentation** — https://developer.hashicorp.com/consul
- **Netflix Eureka** — https://github.com/Netflix/eureka
- **etcd Documentation** — https://etcd.io/docs/
- **Kong Documentation** — https://docs.konghq.com/
- **Istio Service Mesh** — https://istio.io/

---

## ✅ CHECKLIST

### Pemahaman Konsep
- [ ] Paham perbedaan client-side vs server-side discovery
- [ ] Paham kapan menggunakan masing-masing approach
- [ ] Paham fungsi dan komponen service registry
- [ ] Bisa membandingkan Consul, Eureka, dan etcd
- [ ] Paham health checking patterns dan implementasinya
- [ ] Paham service deregistration (graceful shutdown)
- [ ] Paham DNS-based discovery dan caching issue

### API Gateway
- [ ] Paham 6 fungsi utama API Gateway (routing, auth, rate limiting, caching, transformation, logging)
- [ ] Paham BFF pattern dan kapan menggunakannya
- [ ] Paham aggregation dan composition patterns
- [ ] Paham perbedaan API Gateway vs Service Mesh
- [ ] Bisa membandingkan Kong, Apigee, dan AWS API Gateway

### Praktis
- [ ] Bisa setup Kong API Gateway dengan Docker
- [ ] Bisa konfigurasi service, route, dan plugin di Kong
- [ ] Bisa membuat simple API Gateway dengan Express.js
- [ ] Paham implementasi rate limiting dan JWT validation

---

> **Lanjut ke:** [`03-database-sharding.md`](./03-database-sharding.md)
>
> **Kembali ke:** [`01-load-balancing-caching.md`](./01-load-balancing-caching.md)
