# 10 — AWS Architecture: Scaling to Millions

> **Estimasi:** 2-3 jam | **Level:** Advanced
> **Sumber:** [donnemartin/system-design-primer — AWS Scaling](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/scaling_aws)

---

## DAFTAR ISI

1. [Evolusi Scaling di AWS](#evolusi-scaling-di-aws)
2. [VPC Design Deep Dive](#vpc-design-deep-dive)
3. [Auto Scaling Deep Dive](#auto-scaling-deep-dive)
4. [Load Balancers Deep Dive](#load-balancers-deep-dive)
5. [RDS Scaling Deep Dive](#rds-scaling-deep-dive)
6. [ElastiCache on AWS](#elasticache-on-aws)
7. [SQS/SNS Messaging](#sqssns-messaging)
8. [DynamoDB Deep Dive](#dynamodb-deep-dive)
9. [AWS Lambda](#aws-lambda)
10. [S3 Storage Patterns](#s3-storage-patterns)
11. [Cost Optimization](#cost-optimization)
12. [Reference Architecture: 3-Tier Web App](#reference-architecture-3-tier-web-app)

---

## 1. EVOLUSI SCALING DI AWS

### Fase 1: Single Server (1-100 User)

Arsitektur paling sederhana — semua komponen dalam satu EC2 instance.

```
┌─────────────────────────────────────────────────────────────┐
│                    SINGLE SERVER                             │
│                                                              │
│  [User] ──HTTPS──▶ [EC2 t2.micro]                           │
│                      │                                       │
│                      ├── Nginx (Web Server)                  │
│                      ├── Node.js (App)                       │
│                      ├── PostgreSQL (Local DB)               │
│                      └── /var/www (Static Files)             │
│                                                              │
│  Spesifikasi:                                                │
│  - 1 vCPU, 1 GB RAM, 8 GB EBS                                │
│  - Semua dalam 1 Availability Zone                           │
│  - Backup: EBS snapshot harian                               │
│  - Cost: ~$10/bulan                                          │
│                                                              │
│  Masalah saat scale:                                         │
│  ❌ Single point of failure                                  │
│  ❌ Tidak bisa handle traffic spike                          │
│  ❌ Database dan app berebut resource                        │
│  ❌ Deploy = downtime                                        │
└─────────────────────────────────────────────────────────────┘
```

### Fase 2: Separated Components (100-10.000 User)

Pisahkan database, tambahkan load balancer, dan CDN.

```
┌─────────────────────────────────────────────────────────────┐
│                    SEPARATED COMPONENTS                      │
│                                                              │
│  [User] ──▶ [CloudFront CDN]                                 │
│                  │                                           │
│                  ▼                                           │
│             [Route 53] (DNS)                                 │
│                  │                                           │
│                  ▼                                           │
│             [ALB] (Application Load Balancer)                │
│            ┌─────┴─────┐                                     │
│            ▼           ▼                                     │
│       [EC2 Web 1]  [EC2 Web 2]                               │
│       (App Server) (App Server)                              │
│            │           │                                     │
│            └─────┬─────┘                                     │
│                  │                                           │
│            ┌─────┴─────┐                                     │
│            ▼           ▼                                     │
│      [RDS Master]  [ElastiCache]                             │
│      (PostgreSQL)  (Redis)                                   │
│            │                                                 │
│            ▼                                                 │
│      [RDS Read Replica]                                      │
│                                                              │
│  Keuntungan:                                                 │
│  ✅ Database terpisah dari app                               │
│  ✅ Load balancing antar web server                          │
│  ✅ Static files di CDN (cepat)                              │
│  ✅ Read replica untuk query berat                           │
│  ✅ Cache untuk query sering                                 │
│                                                              │
│  Cost: ~$100-300/bulan                                       │
└─────────────────────────────────────────────────────────────┘
```

### Fase 3: Auto Scaling + Message Queue (10.000-100.000 User)

Tambahkan auto scaling, message queue, dan worker nodes.

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTO SCALING ARCHITECTURE                  │
│                                                              │
│  [User] ──▶ [CloudFront] ──▶ [Route 53] ──▶ [ALB]           │
│                                                    │         │
│                                         ┌──────────┴──────┐  │
│                                         ▼                 ▼  │
│                                  [ASG Web Servers]   [ASG Workers]
│                                  (2-20 instances)    (1-10 instances)
│                                         │                 │  │
│                                   ┌─────┴─────┐           │  │
│                                   ▼           ▼           │  │
│                            [ElastiCache]   [SQS Queue] ◀──┘  │
│                            (Redis Cluster)                    │
│                                   │                           │
│                            ┌──────┴──────┐                    │
│                            ▼             ▼                    │
│                     [RDS Aurora]     [S3 Bucket]              │
│                  (Multi-AZ + 3 RR)   (Static Assets)          │
│                                                              │
│  Fitur baru:                                                 │
│  ✅ Auto scaling berdasarkan CPU/memory                      │
│  ✅ Async processing via SQS                                 │
│  ✅ Worker nodes untuk background job                        │
│  ✅ Aurora untuk high performance                            │
│                                                              │
│  Cost: ~$500-2000/bulan                                      │
└─────────────────────────────────────────────────────────────┘
```

### Fase 4: Global Scale (100.000+ User)

Multi-region, global database, dan edge computing.

```
┌─────────────────────────────────────────────────────────────┐
│                    MULTI-REGION ARCHITECTURE                  │
│                                                              │
│                    [Route 53]                                │
│              (Latency-based Routing)                         │
│                  │          │                                │
│           ┌──────┘          └──────┐                         │
│           ▼                        ▼                         │
│    ┌──────────────┐        ┌──────────────┐                  │
│    │  Region:     │        │  Region:     │                  │
│    │  us-east-1   │        │  ap-southeast│                  │
│    │  (Virginia)  │        │  (Singapore) │                  │
│    │              │        │              │                  │
│    │  [ALB]       │        │  [ALB]       │                  │
│    │  [ASG]       │        │  [ASG]       │                  │
│    │  [Aurora]    │◀──────▶│  [Aurora]    │                  │
│    │  [ElastiCache│  Cross │  [ElastiCache│                  │
│    │  [SQS]       │ Region │  [SQS]       │                  │
│    │  [Lambda@Edge│  Repl  │  [Lambda]    │                  │
│    └──────────────┘        └──────────────┘                  │
│           │                        │                         │
│           └──────────┬─────────────┘                         │
│                      ▼                                       │
│              [S3 Cross-Region Replication]                   │
│              [DynamoDB Global Tables]                        │
│              [CloudFront (200+ Edge Locations)]              │
│                                                              │
│  Fitur:                                                      │
│  ✅ Multi-region untuk disaster recovery                     │
│  ✅ Low latency untuk user global                            │
│  ✅ Data replication otomatis                                │
│  ✅ Edge computing untuk personalization                     │
│                                                              │
│  Cost: ~$2000-10000+/bulan                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. VPC DESIGN DEEP DIVE

### Apa Itu VPC?

**Virtual Private Cloud (VPC)** adalah jaringan virtual terisolasi di AWS. Ini adalah fondasi dari semua arsitektur AWS — setiap resource harus berada dalam VPC.

```
┌─────────────────────────────────────────────────────────────┐
│                    VPC OVERVIEW                               │
│                                                              │
│  VPC: 10.0.0.0/16 (65.536 IP addresses)                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Public Subnet (10.0.1.0/24)                        │    │
│  │  - Availability Zone: us-east-1a                    │    │
│  │  - Route: 0.0.0.0/0 → Internet Gateway              │    │
│  │  - Resources: ALB, NAT Gateway, Bastion Host        │    │
│  │  - Auto-assign Public IP: Yes                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Private Subnet App (10.0.2.0/24)                   │    │
│  │  - Availability Zone: us-east-1a                    │    │
│  │  - Route: 0.0.0.0/0 → NAT Gateway                   │    │
│  │  - Resources: EC2 App Servers, ECS Tasks            │    │
│  │  - Auto-assign Public IP: No                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Private Subnet Data (10.0.3.0/24)                  │    │
│  │  - Availability Zone: us-east-1a                    │    │
│  │  - Route: NO internet route (isolated)              │    │
│  │  - Resources: RDS, ElastiCache, Elasticache         │    │
│  │  - Auto-assign Public IP: No                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Public Subnet AZ-B (10.0.11.0/24)                  │    │
│  │  Private Subnet App AZ-B (10.0.12.0/24)             │    │
│  │  Private Subnet Data AZ-B (10.0.13.0/24)            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Subnet Design: Public vs Private

**Public Subnet** — resource yang perlu akses langsung dari internet.

| Resource | Kenapa Public? |
|---|---|
| **ALB/NLB** | Harus menerima traffic dari internet |
| **NAT Gateway** | Harus punya public IP untuk outbound |
| **Bastion Host** | Admin SSH access dari internet |
| **CloudFront Origin** | Jika tidak pakai OAC |

**Private Subnet** — resource yang TIDAK perlu akses langsung dari internet.

| Resource | Kenapa Private? |
|---|---|
| **EC2 App Servers** | Hanya menerima traffic dari ALB |
| **RDS/Aurora** | Hanya diakses dari app servers |
| **ElastiCache** | Hanya diakses dari app servers |
| **ECS Tasks** | Hanya menerima traffic dari ALB |

### Route Tables

Route table menentukan kemana traffic network diarahkan.

```
┌─────────────────────────────────────────────────────────────┐
│              ROUTE TABLES                                   │
│                                                              │
│  Public Route Table:                                        │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Destination        │  Target                     │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  10.0.0.0/16        │  Local (VPC internal)       │       │
│  │  0.0.0.0/0          │  igw-xxxxxxxx (Internet GW) │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Private Route Table:                                       │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Destination        │  Target                     │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  10.0.0.0/16        │  Local (VPC internal)       │       │
│  │  0.0.0.0/0          │  nat-xxxxxxxx (NAT Gateway) │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Isolated Route Table (Data Subnet):                        │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Destination        │  Target                     │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  10.0.0.0/16        │  Local (VPC internal)       │       │
│  │  (NO internet route!)                            │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### NAT Gateway vs NAT Instance

```
┌─────────────────────────────────────────────────────────────┐
│              NAT GATEWAY vs NAT INSTANCE                    │
│                                                              │
│  NAT Gateway (Recommended):                                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Managed by AWS (no maintenance)                │       │
│  │  - High availability (auto redundant dalam AZ)   │       │
│  │  - Bandwidth: hingga 100 Gbps                     │       │
│  │  - Cost: $0.045/jam + $0.045/GB data processed   │       │
│  │  - Satu per AZ (butuh 2 NAT GW untuk HA)         │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  NAT Instance (Legacy):                                     │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - EC2 instance yang kamu manage sendiri          │       │
│  │  - Harus setup iptables, disable source/dest check│      │
│  │  - Bandwidth: terbatas instance type             │       │
│  │  - Cost: hanya cost EC2 instance                 │       │
│  │  - Single point of failure (kecuali setup sendiri)│      │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  REKOMENDASI: Selalu pakai NAT Gateway untuk production.    │
│  NAT Instance hanya untuk testing atau cost sangat ketat.   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Security Groups vs NACLs

Dua layer keamanan network di VPC:

```
┌─────────────────────────────────────────────────────────────┐
│              SECURITY GROUPS vs NACLs                       │
│                                                              │
│  SECURITY GROUPS (Stateful Firewall — Level Instance):      │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Stateful: return traffic otomatis allowed      │       │
│  │  - ALLOW rules only (tidak ada DENY)              │       │
│  │  - Applied ke ENI (Elastic Network Interface)     │       │
│  │  - Evaluate semua rules sebelum decide            │       │
│  │  - Default: DENY all inbound, ALLOW all outbound  │       │
│  │                                                   │       │
│  │  Contoh Inbound Rule:                             │       │
│  │  ┌────────────────────────────────────────────┐  │       │
│  │  │ Type      │ Protocol │ Port  │ Source     │  │       │
│  │  ├────────────────────────────────────────────┤  │       │
│  │  │ HTTP      │ TCP      │ 80    │ 0.0.0.0/0  │  │       │
│  │  │ HTTPS     │ TCP      │ 443   │ 0.0.0.0/0  │  │       │
│  │  │ SSH       │ TCP      │ 22    │ 10.0.0.0/16│  │       │
│  │  │ Custom TCP│ TCP      │ 3000  │ sg-alb-xxx │  │       │
│  │  └────────────────────────────────────────────┘  │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  NACLs (Stateless Firewall — Level Subnet):                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Stateless: harus allow inbound DAN outbound    │       │
│  │  - ALLOW dan DENY rules                           │       │
│  │  - Applied ke subnet (semua resource di subnet)   │       │
│  │  - Evaluate rules secara berurutan (rule number)  │       │
│  │  - Default: ALLOW all inbound, ALLOW all outbound │       │
│  │                                                   │       │
│  │  Contoh Inbound Rules:                            │       │
│  │  ┌────────────────────────────────────────────┐  │       │
│  │  │ Rule# │ Type   │ Protocol │ Port │ Source  │  │       │
│  │  ├────────────────────────────────────────────┤  │       │
│  │  │ 100   │ HTTP   │ TCP      │ 80   │ 0.0.0.0 │  │       │
│  │  │ 200   │ HTTPS  │ TCP      │ 443  │ 0.0.0.0 │  │       │
│  │  │ *     │ ALL    │ ALL      │ ALL  │ 0.0.0.0 │DENY│       │
│  │  └────────────────────────────────────────────┘  │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  BEST PRACTICE:                                              │
│  - Security Groups: primary defense (fine-grained)          │
│  - NACLs: secondary defense (coarse, untuk IP blocking)     │
│  - Jangan overlap rules yang conflicting                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### VPC Peering dan Transit Gateway

**VPC Peering** — koneksi langsung antara dua VPC.

```
┌─────────────────────────────────────────────────────────────┐
│                    VPC PEERING                               │
│                                                              │
│  VPC A (10.0.0.0/16) ◀──── peering ────▶ VPC B (10.1.0.0/16)│
│  - App Servers                           - Database VPC      │
│  - Web Servers                           - RDS, ElastiCache  │
│                                                              │
│  Karakteristik:                                              │
│  - Tidak transitive (A↔B, B↔C ≠ A↔C)                       │
│  - Tidak support overlapping CIDR                           │
│  - Bandwidth: non-overlapping instance limit                │
│  - Cost: FREE (data transfer dalam region)                  │
│  - Max peering connections: tidak ada limit hard            │
│                                                              │
│  Use Case:                                                   │
│  - Pisahkan production dan staging                          │
│  - Shared services VPC (monitoring, logging)                │
│  - Multi-account architecture                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Transit Gateway** — hub централизован untuk banyak VPC.

```
┌─────────────────────────────────────────────────────────────┐
│                    TRANSIT GATEWAY                           │
│                                                              │
│                    ┌─────────────┐                           │
│                    │  Transit    │                           │
│                    │  Gateway    │                           │
│                    │  (Hub)      │                           │
│                    └──────┬──────┘                           │
│              ┌────────────┼────────────┐                     │
│              │            │            │                     │
│       ┌──────┴──┐   ┌────┴────┐  ┌────┴─────┐              │
│       │  VPC A  │   │  VPC B  │  │  VPC C   │              │
│       │ (Prod)  │   │(Staging)│  │ (Shared) │              │
│       └─────────┘   └─────────┘  └──────────┘              │
│              │            │            │                     │
│       ┌──────┴──┐   ┌────┴────┐  ┌────┴─────┐              │
│       │  VPC D  │   │  On-Prem│  │  Direct  │              │
│       │(Dev/Test│   │ (VPN)   │  │ Connect  │              │
│       └─────────┘   └─────────┘  └──────────┘              │
│                                                              │
│  Keuntungan vs VPC Peering:                                  │
│  ✅ Transitive routing (semua VPC bisa komunikasi)          │
│  ✅ Hub-and-spoke model (mudah manage)                      │
│  ✅ Support VPN dan Direct Connect                          │
│  ✅ Route table per attachment                              │
│  ✅ Multicast support                                       │
│                                                              │
│  Cost: $0.05/jam + $0.02/GB data processed                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. AUTO SCALING DEEP DIVE

### Launch Template vs Launch Configuration

**Launch Template** (recommended, lebih baru):

```json
{
  "LaunchTemplateName": "web-server-template",
  "VersionDescription": "v3 - Node.js 20 + Nginx",
  "LaunchTemplateData": {
    "ImageId": "ami-0c55b159cbfafe1f0",
    "InstanceType": "t3.medium",
    "KeyName": "prod-keypair",
    "SecurityGroupIds": ["sg-0123456789abcdef0"],
    "UserData": "#!/bin/bash\napt-get update && apt-get install -y nginx",
    "IamInstanceProfile": {
      "Name": "ec2-app-role"
    },
    "BlockDeviceMappings": [
      {
        "DeviceName": "/dev/xvda",
        "Ebs": {
          "VolumeSize": 30,
          "VolumeType": "gp3",
          "Encrypted": true,
          "DeleteOnTermination": true
        }
      }
    ],
    "Monitoring": { "Enabled": true },
    "TagSpecifications": [
      {
        "ResourceType": "instance",
        "Tags": [
          { "Key": "Environment", "Value": "production" },
          { "Key": "Service", "Value": "web-app" }
        ]
      }
    ]
  }
}
```

### Scaling Policies

**1. Target Tracking** (paling umum):

```
┌─────────────────────────────────────────────────────────────┐
│              TARGET TRACKING POLICY                          │
│                                                              │
│  Target: Average CPU utilization = 60%                      │
│                                                              │
│  Scenario:                                                  │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Waktu  │ CPU Avg │ Instances │ Action           │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  10:00  │  45%    │    2      │  No action       │       │
│  │  10:05  │  62%    │    2      │  Scale out → 3   │       │
│  │  10:10  │  70%    │    3      │  Scale out → 4   │       │
│  │  10:15  │  55%    │    4      │  No action       │       │
│  │  10:30  │  35%    │    4      │  Scale in → 3    │       │
│  │  10:45  │  40%    │    3      │  No action       │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  AWS menggunakan PID controller untuk scaling halus.        │
│  Tidak scale up/down terlalu agresif.                       │
│                                                              │
│  Terraform:                                                  │
│  resource "aws_autoscaling_policy" "target_cpu" {           │
│    name                   = "target-cpu-60"                 │
│    autoscaling_group_name = aws_autoscaling_group.web.name  │
│    policy_type            = "TargetTrackingScaling"         │
│    estimated_instance_warmup = 300                          │
│    target_tracking_configuration {                          │
│      predefined_metric_specification {                      │
│        predefined_metric_type = "ASGAverageCPUUtilization"  │
│      }                                                      │
│      target_value = 60.0                                    │
│    }                                                        │
│  }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**2. Step Scaling** (lebih granular):

```
┌─────────────────────────────────────────────────────────────┐
│              STEP SCALING POLICY                             │
│                                                              │
│  Scale Out (Alarm: CPU > threshold):                        │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Metric Value         │  Scaling Adjustment       │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  70% <= CPU < 80%     │  +1 instance              │       │
│  │  80% <= CPU < 90%     │  +2 instances             │       │
│  │  CPU >= 90%           │  +4 instances             │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Scale In (Alarm: CPU < threshold):                         │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Metric Value         │  Scaling Adjustment       │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  CPU < 30%            │  -1 instance              │       │
│  │  CPU < 20%            │  -2 instances             │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Use case: Traffic spike yang predictable (flash sale)      │
│  dimana kamu butuh scaling agresif.                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**3. Scheduled Scaling** (predictable pattern):

```
# Scale up sebelum jam kerja, scale down setelah jam kerja
aws autoscaling put-scheduled-update-group-action \
  --auto-scaling-group-name web-asg \
  --scheduled-action-name "scale-up-morning" \
  --recurrence "0 7 * * 1-5" \
  --min-size 5 --max-size 20 --desired-capacity 10

aws autoscaling put-scheduled-update-group-action \
  --auto-scaling-group-name web-asg \
  --scheduled-action-name "scale-down-evening" \
  --recurrence "0 20 * * 1-5" \
  --min-size 2 --max-size 20 --desired-capacity 3
```

### Health Checks

```
┌─────────────────────────────────────────────────────────────┐
│              ASG HEALTH CHECKS                               │
│                                                              │
│  Tipe Health Check:                                         │
│                                                              │
│  1. EC2 Health Check (default)                              │
│     - AWS cek apakah instance running                        │
│     - Jika instance status "impaired" → terminate + replace  │
│     - Tidak cek apakah aplikasi sebenarnya healthy           │
│                                                              │
│  2. ELB Health Check (recommended)                          │
│     - ALB/NLB cek health check endpoint                      │
│     - GET /health → 200 OK = healthy                        │
│     - Jika 3x gagal → mark unhealthy → ASG terminate         │
│     - Lebih akurat karena cek aplikasi level                 │
│                                                              │
│  3. Custom Health Check (via API)                           │
│     - Aplikasi sendiri yang report healthy/unhealthy         │
│     - SetInstanceHealth API call                             │
│     - Untuk advanced use case                                │
│                                                              │
│  Health Check Endpoint Example:                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │  GET /health                                      │       │
│  │                                                   │       │
│  │  Response 200:                                    │       │
│  │  {                                                │       │
│  │    "status": "healthy",                           │       │
│  │    "database": "connected",                       │       │
│  │    "cache": "connected",                          │       │
│  │    "uptime_seconds": 3600                         │       │
│  │  }                                                │       │
│  │                                                   │       │
│  │  Response 503:                                    │       │
│  │  {                                                │       │
│  │    "status": "unhealthy",                         │       │
│  │    "database": "connection_failed"                │       │
│  │  }                                                │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Lifecycle Hooks

Lifecycle hooks memungkinkan kamu menjalankan custom action sebelum instance launch atau terminate.

```
┌─────────────────────────────────────────────────────────────┐
│              LIFECYCLE HOOKS                                 │
│                                                              │
│  Launch Lifecycle Hook:                                     │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Instance launching → Pending:Wait                │       │
│       │                                              │       │
│       ├──▶ Run bootstrap script                      │       │
│       ├──▶ Download latest config from S3            │       │
│       ├──▶ Register ke service discovery (Consul)    │       │
│       ├──▶ Warm up cache                             │       │
│       ├──▶ Run health check                          │       │
│       │                                              │       │
│       ▼                                              │       │
│  Complete → Instance:InService                       │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Terminate Lifecycle Hook:                                  │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Instance terminating → Terminating:Wait          │       │
│       │                                              │       │
│       ├──▶ Deregister dari ALB (drain connections)   │       │
│       ├──▶ Deregister dari service discovery         │       │
│       ├──▶ Flush pending jobs ke SQS                 │       │
│       ├──▶ Upload logs ke CloudWatch/S3              │       │
│       │                                              │       │
│       ▼                                              │       │
│  Complete → Instance terminated                      │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Timeout: Default 3600 detik (1 jam), bisa custom           │
│  Heartbeat: Extend timeout dengan RecordLifecycleActionHeartbeat│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. LOAD BALANCERS DEEP DIVE

### ALB vs NLB vs CLB

```
┌─────────────────────────────────────────────────────────────┐
│              LOAD BALANCER COMPARISON                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Feature           │ ALB (L7)   │ NLB (L4) │ CLB     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Layer             │ Application│ Network  │ Classic │   │
│  │  Protocol          │ HTTP/HTTPS │ TCP/TLS  │ HTTP/TCP│   │
│  │  Routing           │ Path/Host  │ IP/Port  │ Basic   │   │
│  │  WebSocket         │ ✅ Yes     │ ✅ Yes   │ ❌ No   │   │
│  │  HTTP/2            │ ✅ Yes     │ ❌ No    │ ❌ No   │   │
│  │  gRPC              │ ✅ Yes     │ ❌ No    │ ❌ No   │   │
│  │  SSL Termination   │ ✅ Yes     │ ✅ Yes   │ ✅ Yes  │   │
│  │  Sticky Sessions   │ ✅ App-based│ ✅ Source│ ✅ Yes  │   │
│  │  Fixed IP          │ ❌ No      │ ✅ Yes   │ ❌ No   │   │
│  │  Performance       │ ~1M RPS    │ ~25M RPS │ ~100K   │   │
│  │  Latency           │ ~5ms       │ ~2ms     │ ~10ms   │   │
│  │  Cost              │ $0.0225/hr │ $0.0225/hr│$0.025/hr│   │
│  │  + per LCPU-hour   │ $0.008     │ N/A      │ N/A     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  REKOMENDASI:                                                │
│  - Web app (HTTP/HTTPS): ALB                                 │
│  - TCP/TLS traffic, gaming, IoT: NLB                         │
│  - CLB: LEGACY, jangan pakai untuk project baru              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### ALB Routing Rules

```
┌─────────────────────────────────────────────────────────────┐
│              ALB ROUTING RULES                               │
│                                                              │
│  Listener: HTTPS:443                                        │
│                                                              │
│  Rule Priority  Routing                         Target Group │
│  ─────────────  ──────────────────────────────  ─────────── │
│  1              Host: api.example.com            tg-api     │
│  2              Host: admin.example.com          tg-admin   │
│  3              Path: /static/*                  tg-static  │
│  4              Path: /api/v2/*                  tg-api-v2  │
│  5              Path: /api/*                     tg-api     │
│  * (default)    Everything else                  tg-web     │
│                                                              │
│  Target Group Configuration:                                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Target Group: tg-api                             │       │
│  │  Protocol: HTTP                                   │       │
│  │  Port: 3000                                       │       │
│  │  Health check: GET /health                        │       │
│  │  Healthy threshold: 3                             │       │
│  │  Unhealthy threshold: 2                           │       │
│  │  Interval: 30 seconds                             │       │
│  │  Timeout: 5 seconds                               │       │
│  │  Targets:                                         │       │
│  │    - 10.0.2.10:3000 (healthy)                     │       │
│  │    - 10.0.2.11:3000 (healthy)                     │       │
│  │    - 10.0.2.12:3000 (draining)                    │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### SSL Termination

```
┌─────────────────────────────────────────────────────────────┐
│              SSL TERMINATION AT ALB                          │
│                                                              │
│  [User] ──HTTPS (encrypted)──▶ [ALB] ──HTTP (plain)──▶ [EC2]│
│                                                              │
│  Flow:                                                      │
│  1. User connect ke ALB via HTTPS (port 443)                │
│  2. ALB decrypt SSL menggunakan certificate                 │
│  3. ALB forward request ke target group via HTTP (port 80)  │
│  4. EC2 process request, return response ke ALB             │
│  5. ALB encrypt response, kirim ke user                     │
│                                                              │
│  Keuntungan:                                                 │
│  - EC2 tidak perlu handle SSL (CPU saving)                  │
│  - Certificate management di satu tempat (ALB/ACM)          │
│  - Bisa inspect traffic untuk routing                       │
│                                                              │
│  Kerugian:                                                   │
│  - Traffic antara ALB dan EC2 tidak terenkripsi             │
│  - Solusi: VPC internal traffic sudah isolated              │
│                                                              │
│  Certificate Management:                                     │
│  - AWS Certificate Manager (ACM) — FREE, auto-renew         │
│  - Upload custom certificate                                │
│  - ACM hanya support ALB/NLB/CloudFront                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Sticky Sessions

```
┌─────────────────────────────────────────────────────────────┐
│              STICKY SESSIONS (Session Affinity)              │
│                                                              │
│  Tanpa Sticky Session (default):                            │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Request 1 → EC2-A                                │       │
│  │  Request 2 → EC2-B  ← session hilang!            │       │
│  │  Request 3 → EC2-C  ← user harus login ulang     │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Dengan Sticky Session:                                     │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Request 1 → EC2-A  (ALB set cookie: AWSALB=...) │       │
│  │  Request 2 → EC2-A  (cookie match → same target) │       │
│  │  Request 3 → EC2-A  (cookie match → same target) │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ALB Sticky Session Types:                                  │
│  1. Duration-based: cookie expire setelah N detik           │
│  2. App-based: aplikasi sendiri yang set cookie             │
│                                                              │
│  WARNING: Sticky sessions mengurangi load balancing         │
│  efektivitas. Gunakan stateless session (Redis) jika bisa.  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. RDS SCALING DEEP DIVE

### Multi-AZ Deployment

```
┌─────────────────────────────────────────────────────────────┐
│              RDS MULTI-AZ                                    │
│                                                              │
│  Availability Zone A              Availability Zone B        │
│  ┌─────────────────────┐          ┌─────────────────────┐   │
│  │  Primary (Master)   │ ──sync──▶│  Standby (Replica)  │   │
│  │                     │  repl    │                     │   │
│  │  - Read/Write       │          │  - Read only        │   │
│  │  - Accept traffic   │          │  - No traffic       │   │
│  │  - Active           │          │  - Passive          │   │
│  └─────────────────────┘          └─────────────────────┘   │
│                                                              │
│  Failover (otomatis, 60-120 detik):                         │
│  1. Primary down (AZ failure, hardware issue)               │
│  2. DNS record di-update ke standby                         │
│  3. Standby promote jadi primary                            │
│  4. New standby dibuat di AZ lain                           │
│  5. Aplikasi reconnect (tidak perlu ubah endpoint)          │
│                                                              │
│  Cost: 2x harga single instance                             │
│  REKOMENDASI: WAJIB untuk production                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Read Replicas

```
┌─────────────────────────────────────────────────────────────┐
│              RDS READ REPLICAS (Up to 15)                    │
│                                                              │
│                    ┌──────────────┐                          │
│                    │   Primary    │                          │
│                    │   (Master)   │                          │
│                    │   Read/Write │                          │
│                    └──────┬───────┘                          │
│              ┌────────────┼────────────┐                     │
│              │            │            │                     │
│       ┌──────┴──┐   ┌────┴────┐  ┌────┴─────┐              │
│       │  RR-1   │   │  RR-2   │  │  RR-3    │              │
│       │ (AZ-a)  │   │ (AZ-b)  │  │ (AZ-c)   │              │
│       │ Read    │   │ Read    │  │ Read     │              │
│       └─────────┘   └─────────┘  └──────────┘              │
│                                                              │
│  Async replication (biasanya < 1 detik lag)                 │
│                                                              │
│  Use Case:                                                   │
│  - Offload read queries dari primary                        │
│  - Analytics/reporting queries                              │
│  - Geographic read scaling                                  │
│  - Backup tanpa impact primary                              │
│                                                              │
│  Connection Routing (Application Level):                    │
│  ┌──────────────────────────────────────────────────┐       │
│  │  // Write queries → primary                       │       │
│  │  db.write("INSERT INTO orders ...")               │       │
│  │                                                   │       │
│  │  // Read queries → round-robin ke replicas        │       │
│  │  db.read("SELECT * FROM products WHERE ...")      │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Aurora Global Database

```
┌─────────────────────────────────────────────────────────────┐
│              AURORA GLOBAL DATABASE                          │
│                                                              │
│  Primary Region (us-east-1)          Secondary Region       │
│  ┌─────────────────────────────┐     (ap-southeast-1)       │
│  │  Primary Cluster            │     ┌──────────────────┐   │
│  │  ┌──────────┐               │     │  Secondary Cluster│   │
│  │  │ Writer   │ ◀──1s repl──▶ │     │  ┌────────────┐  │   │
│  │  │ (R/W)    │               │     │  │ Reader Only│  │   │
│  │  └──────────┘               │     │  │ (Read)     │  │   │
│  │  ┌──────────┐               │     │  └────────────┘  │   │
│  │  │ Reader 1 │               │     │  ┌────────────┐  │   │
│  │  │ (Read)   │               │     │  │ Reader Only│  │   │
│  │  └──────────┘               │     │  └────────────┘  │   │
│  └─────────────────────────────┘     └──────────────────┘   │
│                                                              │
│  Karakteristik:                                              │
│  - Cross-region replication < 1 detik                       │
│  - Secondary region bisa promote jadi primary (DR)          │
│  - Read latency rendah untuk user global                    │
│  - Support hingga 5 secondary region                        │
│                                                              │
│  RPO (Recovery Point Objective): ~1 detik                   │
│  RTO (Recovery Time Objective): ~1 menit                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### RDS Proxy (Connection Pooling)

```
┌─────────────────────────────────────────────────────────────┐
│              RDS PROXY — CONNECTION POOLING                  │
│                                                              │
│  TANPA RDS Proxy (masalah):                                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  [1000 Lambda] ──▶ [RDS: max_connections=500]    │       │
│  │                                                   │       │
│  │  Setiap Lambda invocation = 1 koneksi baru        │       │
│  │  1000 concurrent Lambda = 1000 koneksi            │       │
│  │  RDS max_connections = 500 → ERROR!               │       │
│  │                                                   │       │
│  │  Masalah:                                          │       │
│  │  - Connection overhead (TCP handshake, auth)      │       │
│  │  - Memory per koneksi di RDS                      │       │
│  │  - Connection storm saat cold start               │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  DENGAN RDS Proxy (solusi):                                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  [1000 Lambda] ──▶ [RDS Proxy] ──▶ [RDS]         │       │
│  │                    (pool: 50 conn)   (50 conn)    │       │
│  │                                                   │       │
│  │  1000 Lambda share 50 koneksi pooled              │       │
│  │  RDS hanya lihat 50 koneksi                       │       │
│  │  Connection reuse, tidak perlu handshake ulang    │       │
│  │                                                   │       │
│  │  Keuntungan:                                       │       │
│  │  - Hingga 3x lebih banyak concurrent function     │       │
│  │  - Connection reuse (latency turun 30-50%)        │       │
│  │  - Automatic failover handling                    │       │
│  │  - IAM authentication support                     │       │
│  │  - No code changes required                       │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Cost: $0.015 per ACU-hour (1 ACU = ~2GB memory)            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. ELASTICACHE ON AWS

### Redis vs Memcached di AWS

```
┌─────────────────────────────────────────────────────────────┐
│              ELASTICACHE: REDIS vs MEMCACHED                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Feature              │ Redis      │ Memcached        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Data Structures      │ String,    │ String only      │   │
│  │                       │ List, Set, │                  │   │
│  │                       │ Hash, ZSet │                  │   │
│  │  Replication          │ ✅ Yes     │ ❌ No            │   │
│  │  Multi-AZ             │ ✅ Yes     │ ❌ No            │   │
│  │  Persistence          │ ✅ RDB/AOF │ ❌ No            │   │
│  │  Pub/Sub              │ ✅ Yes     │ ❌ No            │   │
│  │  Transactions         │ ✅ Yes     │ ❌ No            │   │
│  │  Lua Scripting        │ ✅ Yes     │ ❌ No            │   │
│  │  Cluster Mode         │ ✅ Yes     │ ❌ No            │   │
│  │  Auto-failover        │ ✅ Yes     │ ❌ No            │   │
│  │  Backup/Restore       │ ✅ Yes     │ ❌ No            │   │
│  │  Thread Model         │ Single     │ Multi-threaded   │   │
│  │                       │ threaded   │                  │   │
│  │  Best For             │ Complex    │ Simple caching   │   │
│  │                       │ caching,   │ with high        │   │
│  │                       │ session,   │ throughput       │   │
│  │                       │ queue      │                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  REKOMENDASI: Redis untuk hampir semua use case.            │
│  Memcached hanya jika butuh simple caching multi-threaded.  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Redis Cluster Mode

```
┌─────────────────────────────────────────────────────────────┐
│              REDIS CLUSTER MODE ENABLED                      │
│                                                              │
│  16384 hash slots didistribusi ke shard:                    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Shard 1 (Slots 0-5460)     Shard 2 (Slots 5461-10922)│
│  │  ┌──────────┐               ┌──────────┐            │    │
│  │  │ Primary  │               │ Primary  │            │    │
│  │  │ :6379    │               │ :6380    │            │    │
│  │  └────┬─────┘               └────┬─────┘            │    │
│  │       │ replica                  │ replica           │    │
│  │  ┌────┴─────┐               ┌────┴─────┐            │    │
│  │  │ Replica  │               │ Replica  │            │    │
│  │  │ :6381    │               │ :6382    │            │    │
│  │  └──────────┘               └──────────┘            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Shard 3 (Slots 10923-16383)                                │
│  ┌──────────┐                                               │
│  │ Primary  │                                               │
│  │ :6383    │                                               │
│  └────┬─────┘                                               │
│       │ replica                                              │
│  ┌────┴─────┐                                               │
│  │ Replica  │                                               │
│  │ :6384    │                                               │
│  └──────────┘                                               │
│                                                              │
│  Key routing:                                                │
│  hash_slot = CRC16(key) % 16384                             │
│  Client otomatis route ke shard yang benar.                 │
│                                                              │
│  Max shards: 500 (Redis 7.0+)                               │
│  Max nodes: 500 primary + 500 replica                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Backup dan Replication

```
┌─────────────────────────────────────────────────────────────┐
│              ELASTICACHE BACKUP & REPLICATION                │
│                                                              │
│  Automatic Backup:                                           │
│  - Snapshot harian (configurable window)                    │
│  - Retention: 1-35 hari                                     │
│  - Stored di S3 (managed)                                   │
│  - Bisa restore ke cluster baru                             │
│                                                              │
│  Manual Backup (On-Demand):                                 │
│  - Trigger kapan saja                                       │
│  - Untuk pre-deployment safety                              │
│  - Retention: tidak expire (manual delete)                  │
│                                                              │
│  Replication:                                                │
│  - Async replication dari primary ke replica                │
│  - Read dari replica untuk offload primary                  │
│  - Auto-failover jika primary down                          │
│  - Multi-AZ untuk HA                                        │
│                                                              │
│  Monitoring Metrics:                                         │
│  - CacheHits, CacheMisses                                   │
│  - CurrConnections, Evictions                               │
│  - CPUUtilization, NetworkBytesIn/Out                       │
│  - ReplicationLag (untuk replica)                           │
│  - EngineCPUUtilization                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. SQS/SNS MESSAGING

### SQS — Simple Queue Service

```
┌─────────────────────────────────────────────────────────────┐
│              SQS QUEUE TYPES                                 │
│                                                              │
│  Standard Queue:                                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Best-effort ordering (tidak guarantee)         │       │
│  │  - At-least-once delivery (bisa duplikat)         │       │
│  │  - Nearly unlimited throughput                   │       │
│  │  - Visibility timeout: 30 detik (default)         │       │
│  │                                                   │       │
│  │  Use case:                                       │       │
│  │  - Image processing, email sending               │       │
│  │  - Background jobs yang idempotent               │       │
│  │  - Decoupling microservices                      │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  FIFO Queue:                                                 │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Strict ordering (FIFO guarantee)               │       │
│  │  - Exactly-once processing                        │       │
│  │  - Throughput: 300 msg/s (tanpa batching)         │       │
│  │             3000 msg/s (dengan batching)          │       │
│  │  - Message group ID untuk parallel processing     │       │
│  │                                                   │       │
│  │  Use case:                                       │       │
│  │  - Financial transactions                         │       │
│  │  - Order processing (harus urut)                  │       │
│  │  - User activity sequencing                       │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dead Letter Queue (DLQ)

```
┌─────────────────────────────────────────────────────────────┐
│              SQS DEAD LETTER QUEUE                           │
│                                                              │
│  [Producer] ──▶ [Main Queue] ──▶ [Consumer]                 │
│                       │                    │                 │
│                       │  maxReceiveCount=3 │                 │
│                       │                    │                 │
│                       ▼                    ▼                 │
│                 [DLQ Queue]          (gagal 3x)              │
│                 (failed messages)                            │
│                                                              │
│  Flow:                                                      │
│  1. Consumer receive message dari main queue                │
│  2. Visibility timeout mulai (30 detik default)             │
│  3. Consumer gagal process → message tidak di-delete        │
│  4. Setelah visibility timeout → message kembali ke queue   │
│  5. ApproximateReceiveCount increment                       │
│  6. Setelah 3x gagal → message pindah ke DLQ                │
│  7. DLQ message perlu investigasi manual                    │
│                                                              │
│  Redrive Policy (JSON):                                     │
│  {                                                          │
│    "deadLetterTargetArn": "arn:aws:sqs:us-east-1:123:dlq",  │
│    "maxReceiveCount": 3                                     │
│  }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### SNS — Simple Notification Service (Pub/Sub)

```
┌─────────────────────────────────────────────────────────────┐
│              SNS FAN-OUT PATTERN                             │
│                                                              │
│                    ┌─────────────┐                           │
│                    │   SNS       │                           │
│                    │   Topic     │                           │
│                    │ "orders"    │                           │
│                    └──────┬──────┘                           │
│              ┌────────────┼────────────┐                     │
│              │            │            │                     │
│       ┌──────┴──┐   ┌────┴────┐  ┌────┴─────┐              │
│       │  SQS    │   │  SQS    │  │  Lambda  │              │
│       │ "email" │   │"analytics"│ │"realtime"│              │
│       └────┬────┘   └────┬────┘  └────┬─────┘              │
│            │             │            │                     │
│       ┌────┴────┐  ┌────┴────┐  ┌────┴─────┐              │
│       │ Email   │  │  Data   │  │  Web     │              │
│       │ Service │  │ Warehouse│ │ Socket   │              │
│       └─────────┘  └─────────┘  └──────────┘              │
│                                                              │
│  Satu publish ke SNS topic → semua subscriber menerima.     │
│  Cocok untuk: event broadcasting, notification fan-out.     │
│                                                              │
│  SNS + SQS Fan-Out:                                         │
│  - Setiap subscriber punya SQS queue sendiri                │
│  - SQS buffer pesan, consumer process sesuai kemampuan      │
│  - Retry dan DLQ built-in                                   │
│  - Decoupled: subscriber bisa down tanpa affect yang lain   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. DYNAMODB DEEP DIVE

### Partition Key Design

```
┌─────────────────────────────────────────────────────────────┐
│              DYNAMODB PARTITIONING                           │
│                                                              │
│  DynamoDB membagi data ke partitions berdasarkan:           │
│  1. Partition Key (hash)                                    │
│  2. Partition Key + Sort Key (hash + range)                 │
│                                                              │
│  Setiap partition:                                          │
│  - Max 10 GB data                                           │
│  - Max 3000 RCU (read capacity units)                       │
│  - Max 1000 WCU (write capacity units)                      │
│                                                              │
│  Partition Key Design Patterns:                             │
│                                                              │
│  ❌ BURUK: user_id (hot partition)                          │
│     Celebrity dengan jutaan follower → 1 partition overload │
│                                                              │
│  ✅ BAIK: user_id + timestamp (spread)                      │
│     "user:123#2026-05-01" → spread ke banyak partition      │
│                                                              │
│  ✅ BAIK: composite key (tenant + entity)                   │
│     "tenant:acme#order:123" → multi-tenant isolation        │
│                                                              │
│  ✅ BAIK: write sharding (suffix)                           │
│     "product:123#0", "product:123#1", ... "product:123#9"   │
│     → 10x write throughput                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### GSI dan LSI

```
┌─────────────────────────────────────────────────────────────┐
│              GSI vs LSI                                      │
│                                                              │
│  GSI (Global Secondary Index):                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Partition key BISA berbeda dari table utama    │       │
│  │  - Bisa dibuat/dihapus setelah table dibuat       │       │
│  │  - Max 20 GSI per table                           │       │
│  │  - Eventually consistent atau strong consistent   │       │
│  │  - Provisioned throughput terpisah                │       │
│  │                                                   │       │
│  │  Contoh:                                          │       │
│  │  Table: Orders (PK: order_id, SK: customer_id)   │       │
│  │  GSI-1: PK: customer_id, SK: order_date          │       │
│  │    → Query: "semua order customer X"              │       │
│  │  GSI-2: PK: status, SK: order_date               │       │
│  │    → Query: "semua order PENDING"                 │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  LSI (Local Secondary Index):                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │  - Partition key SAMA dengan table utama          │       │
│  │  - Sort key BERBEDA dari table utama              │       │
│  │  - HARUS dibuat saat table dibuat (tidak bisa add │       │
│  │    setelahnya)                                    │       │
│  │  - Max 5 LSI per table                            │       │
│  │  - Strong consistent read support                 │       │
│  │  - Share throughput dengan table utama            │       │
│  │                                                   │       │
│  │  Contoh:                                          │       │
│  │  Table: Orders (PK: customer_id, SK: order_id)   │       │
│  │  LSI-1: PK: customer_id, SK: order_date          │       │
│  │    → Query: "order customer X, sorted by date"    │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### DAX Caching

```
┌─────────────────────────────────────────────────────────────┐
│              DYNAMODB ACCELERATOR (DAX)                      │
│                                                              │
│  [App] ──▶ [DAX Cluster] ──▶ [DynamoDB]                     │
│              (in-memory)      (persistent)                   │
│                                                              │
│  DAX adalah in-memory cache khusus untuk DynamoDB:          │
│  - Read latency: microseconds (vs milliseconds di DDB)      │
│  - Drop-in replacement (tidak perlu ubah code)              │
│  - Write-through caching                                    │
│  - Cluster: 1 primary + hingga 10 read replicas             │
│                                                              │
│  Use Case:                                                   │
│  - Read-heavy workload (100:1 read:write ratio)             │
│  - Session data, product catalog                            │
│  - Gaming leaderboards                                      │
│  - Real-time analytics                                      │
│                                                              │
│  Cost: ~$0.17/jam per node (dax.r6g.large)                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### DynamoDB Streams

```
┌─────────────────────────────────────────────────────────────┐
│              DYNAMODB STREAMS                                │
│                                                              │
│  Setiap create/update/delete di DynamoDB → event di stream: │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  DynamoDB Table          DynamoDB Stream             │    │
│  │  ┌──────────────┐        ┌──────────────────────┐   │    │
│  │  │  PUT item    │ ──────▶│ {                    │   │    │
│  │  │  UPDATE item │ ──────▶│   "eventName":       │   │    │
│  │  │  DELETE item │ ──────▶│    "INSERT",         │   │    │
│  │  └──────────────┘        │   "dynamodb": {      │   │    │
│  │                          │     "Keys": {...},   │   │    │
│  │                          │     "NewImage": {...}│   │    │
│  │                          │   }                  │   │    │
│  │                          │ }                    │   │    │
│  │                          └──────────┬───────────┘   │    │
│  └─────────────────────────────────────┼───────────────┘    │
│                                        │                     │
│                                 ┌──────┴──────┐             │
│                                 ▼             ▼             │
│                           [Lambda]       [Kinesis]          │
│                           (trigger)      (stream)           │
│                                                              │
│  Use Case:                                                   │
│  - Real-time analytics                                      │
│  - Cross-region replication                                 │
│  - Event-driven architecture                                │
│  - Audit logging                                            │
│  - Cache invalidation                                       │
│                                                              │
│  Stream retention: 24 jam (default) atau 7 hari             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. AWS LAMBDA

### Cold Start Optimization

```
┌─────────────────────────────────────────────────────────────┐
│              LAMBDA COLD START                               │
│                                                              │
│  Cold Start Timeline:                                       │
│  ┌──────────────────────────────────────────────────┐       │
│  │  1. Init Phase (100-3000ms)                      │       │
│  │     - Download code dari S3                      │       │
│  │     - Extract layer                              │       │
│  │     - Setup execution environment                │       │
│  │     - Run initialization code                    │       │
│  │                                                   │       │
│  │  2. Invoke Phase (1-100ms)                       │       │
│  │     - Run handler function                       │       │
│  │     - Return response                            │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Faktor yang mempengaruhi cold start:                       │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Faktor           │ Impact       │ Optimization   │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  Runtime          │ Java > Python│ Pilih runtime  │       │
│  │                   │ > Node.js    │ yang ringan    │       │
│  │  Memory           │ Lebih besar  │ 1024MB+ untuk  │       │
│  │                   │ = lebih cepat│ lebih CPU      │       │
│  │  Package size     │ Lebih kecil  │ Hanya include  │       │
│  │                   │ = lebih cepat│ yang diperlukan│       │
│  │  VPC attachment   │ +50-200ms    │ Gunakan VPC    │       │
│  │                   │              │ endpoints      │       │
│  │  Initialization   │ Heavy init   │ Lazy init,     │       │
│  │                   │ = lebih lama │ defer loading  │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Optimization Strategies:                                   │
│  1. Provisioned Concurrency (eliminate cold start)          │
│  2. Keep warm dengan periodic invocation                    │
│  3. Minimize deployment package size                        │
│  4. Use Lambda Layers untuk shared dependencies             │
│  5. Initialize SDK/connections outside handler              │
│  6. Use ARM64 (Graviton2) — 20% faster, 20% cheaper        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Provisioned Concurrency

```
┌─────────────────────────────────────────────────────────────┐
│              PROVISIONED CONCURRENCY                         │
│                                                              │
│  Tanpa Provisioned Concurrency:                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Request 1 → Cold Start (2s) → Process (100ms)   │       │
│  │  Request 2 → Cold Start (2s) → Process (100ms)   │       │
│  │  Request 3 → Warm (100ms) → Process (100ms)      │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Dengan Provisioned Concurrency (10 instances):             │
│  ┌──────────────────────────────────────────────────┐       │
│  │  10 instances selalu siap (pre-initialized)       │       │
│  │  Request 1 → Warm (100ms) → Process (100ms)      │       │
│  │  Request 2 → Warm (100ms) → Process (100ms)      │       │
│  │  Request 3 → Warm (100ms) → Process (100ms)      │       │
│  │  ...                                              │       │
│  │  Request 11 → Cold Start (jika > 10 concurrent)  │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Cost: $0.015 per GB-second (provisioned)                   │
│       + $0.0000166667 per GB-second (invocation)            │
│                                                              │
│  Use when:                                                   │
│  - API dengan strict latency requirement                    │
│  - Predictable traffic pattern                              │
│  - User-facing application                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Lambda Limits

```
┌─────────────────────────────────────────────────────────────┐
│              LAMBDA LIMITS (2026)                            │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Limit                        │ Value            │       │
│  ├──────────────────────────────────────────────────┤       │
│  │  Deployment package (zip)     │ 250 MB (unzipped │       │
│  │                               │ + 50 MB zip)     │       │
│  │  /tmp storage                 │ 10 GB            │       │
│  │  Memory                       │ 128 MB - 10 GB   │       │
│  │  Timeout                      │ 15 menit         │       │
│  │  Concurrent executions        │ 1000 (default,   │       │
│  │                               │ bisa request increase)│  │
│  │  Environment variables        │ 4 KB             │       │
│  │  Ephemeral storage            │ 512 MB - 10 GB   │       │
│  │  Payload (sync invoke)        │ 6 MB             │       │
│  │  Payload (async invoke)       │ 256 KB           │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. S3 STORAGE PATTERNS

### Lifecycle Policies

```
┌─────────────────────────────────────────────────────────────┐
│              S3 LIFECYCLE POLICIES                           │
│                                                              │
│  Automatic transition antar storage class:                  │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Hari 0-30:    S3 Standard (frequent access)     │       │
│  │                Cost: $0.023/GB                    │       │
│  │                                                   │       │
│  │  Hari 30-90:   S3 Standard-IA (infrequent)       │       │
│  │                Cost: $0.0125/GB                   │       │
│  │                Retrieval: $0.01/GB                │       │
│  │                                                   │       │
│  │  Hari 90-180:  S3 One Zone-IA                    │       │
│  │                Cost: $0.01/GB                     │       │
│  │                (single AZ, tidak redundant)       │       │
│  │                                                   │       │
│  │  Hari 180-365: S3 Glacier Instant Retrieval      │       │
│  │                Cost: $0.004/GB                    │       │
│  │                Retrieval: milliseconds            │       │
│  │                                                   │       │
│  │  Hari 365+:    S3 Glacier Deep Archive            │       │
│  │                Cost: $0.00099/GB                  │       │
│  │                Retrieval: 12 jam                  │       │
│  │                                                   │       │
│  │  Hari 3650+:   Expire (delete)                    │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  Savings: Hingga 95% untuk data yang jarang diakses         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Intelligent Tiering

```
┌─────────────────────────────────────────────────────────────┐
│              S3 INTELLIGENT TIERING                          │
│                                                              │
│  Otomatis pindahkan data berdasarkan access pattern:        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Frequent Access Tier     → S3 Standard price    │       │
│  │  Infrequent Access Tier   → S3 Standard-IA price │       │
│  │  Archive Access Tier      → Glacier price        │       │
│  │  Deep Archive Tier        → Deep Archive price   │       │
│  │                                                   │       │
│  │  Monitoring & Automation Fee: $0.0025/1000 objects│      │
│  │                                                   │       │
│  │  Keuntungan:                                      │       │
│  │  - Tidak perlu setup lifecycle policy             │       │
│  │  - Otomatis adaptasi ke access pattern            │       │
│  │  - No retrieval fee (untuk frequent/infrequent)   │       │
│  │  - Cocok untuk data dengan access pattern         │       │
│  │    tidak predictable                              │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cross-Region Replication (CRR)

```
┌─────────────────────────────────────────────────────────────┐
│              S3 CROSS-REGION REPLICATION                     │
│                                                              │
│  Source Bucket (us-east-1)          Destination Bucket      │
│  ┌─────────────────────────┐        (eu-west-1)             │
│  │  Upload object          │        ┌──────────────────┐   │
│  │  (versioning REQUIRED)  │ ────▶  │  Auto-replicated │   │
│  │                         │  async │  object          │   │
│  │  Replication Rules:     │        │                  │   │
│  │  - Prefix-based         │        │  Use Case:       │   │
│  │  - Tag-based            │        │  - Compliance    │   │
│  │  - All objects          │        │  - DR            │   │
│  │                         │        │  - Low latency   │   │
│  └─────────────────────────┘        │    access EU     │   │
│                                     └──────────────────┘   │
│                                                              │
│  Karakteristik:                                              │
│  - Async replication (biasanya < 15 menit)                  │
│  - Versioning harus enabled di kedua bucket                 │
│  - Replicate: objects, metadata, ACLs                       │
│  - Bisa filter by prefix/tag                                │
│  - Same-region replication juga support (SRR)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### CloudFront + S3 Integration

```
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFRONT + S3                                 │
│                                                              │
│  [User] ──▶ [CloudFront Edge] ──▶ [S3 Origin]               │
│               (cache)             (origin)                   │
│                                                              │
│  Flow:                                                      │
│  1. User request file dari CloudFront edge (terdekat)       │
│  2. Edge cek cache:                                         │
│     - HIT → return dari cache (latency < 50ms)              │
│     - MISS → fetch dari S3 origin, cache di edge            │
│  3. TTL menentukan berapa lama file di-cache                │
│                                                              │
│  CloudFront + S3 Best Practices:                            │
│  - Gunakan OAC (Origin Access Control) untuk security       │
│  - S3 bucket policy: hanya CloudFront yang bisa access      │
│  - Enable compression (gzip/brotli) di CloudFront           │
│  - Set Cache-Control header di S3 object metadata           │
│  - Gunakan Lambda@Edge untuk custom logic di edge           │
│                                                              │
│  Cache-Control Examples:                                    │
│  - "public, max-age=31536000" → cache 1 tahun (static)      │
│  - "public, max-age=3600" → cache 1 jam                     │
│  - "no-cache" → selalu cek origin (ETag validation)         │
│  - "no-store" → tidak cache sama sekali                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. COST OPTIMIZATION

### Reserved Instances vs Spot Instances

```
┌─────────────────────────────────────────────────────────────┐
│              COST OPTIMIZATION STRATEGIES                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Strategy          │ Discount │ Commitment │ Risk   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  On-Demand         │ 0%       │ None       │ None   │   │
│  │  Savings Plans     │ 17-66%   │ 1-3 tahun  │ Low    │   │
│  │  Reserved Instance │ 30-72%   │ 1-3 tahun  │ Low    │   │
│  │  Spot Instance     │ 60-90%   │ None       │ High   │   │
│  │  Dedicated Host    │ 70%+     │ 1-3 tahun  │ Low    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  REKOMENDASI MIX:                                            │
│  - Baseline workload (70%): Reserved/Savings Plans          │
│  - Variable workload (20%): On-Demand                       │
│  - Fault-tolerant workload (10%): Spot Instances            │
│                                                              │
│  Spot Instance Strategy:                                     │
│  - Gunakan untuk batch processing, CI/CD, ML training       │
│  - Selalu punya fallback ke On-Demand                       │
│  - Gunakan Spot Fleet untuk diversifikasi instance type     │
│  - Monitor Spot price history untuk pilih instance type     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Right-Sizing

```
┌─────────────────────────────────────────────────────────────┐
│              RIGHT-SIZING                                    │
│                                                              │
│  Langkah:                                                    │
│  1. Monitor CloudWatch metrics 2-4 minggu                   │
│  2. Identifikasi underutilized resources:                   │
│     - CPU avg < 20% → downgrade instance type               │
│     - Memory avg < 30% → kurangi memory                     │
│     - EBS IOPS < 10% → downgrade volume type                │
│  3. Identifikasi overutilized resources:                    │
│     - CPU avg > 80% → upgrade instance type                 │
│     - Memory > 90% → tambah memory                          │
│     - Network throttled → upgrade network bandwidth         │
│  4. Implementasi perubahan (rolling update)                 │
│  5. Monitor lagi 1-2 minggu, iterate                        │
│                                                              │
│  Tools:                                                      │
│  - AWS Compute Optimizer (AI-powered recommendations)       │
│  - AWS Cost Explorer (cost analysis)                        │
│  - AWS Trusted Advisor (best practices)                     │
│  - Third-party: CloudHealth, Cloudability                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cost Explorer dan Monitoring

```
┌─────────────────────────────────────────────────────────────┐
│              COST MONITORING                                 │
│                                                              │
│  AWS Cost Explorer:                                         │
│  - Filter by service, tag, region, account                  │
│  - Forecast biaya 3 bulan ke depan                          │
│  - Identify cost drivers                                    │
│  - Compare month-over-month                                 │
│                                                              │
│  AWS Budgets:                                               │
│  - Set budget per service/project                           │
│  - Alert saat 80%, 100% budget tercapai                     │
│  - Auto-action: stop instance, notify team                  │
│                                                              │
│  Tagging Strategy (WAJIB untuk cost tracking):              │
│  - Environment: production, staging, development            │
│  - Team/Owner: engineering, data, marketing                 │
│  - Project/Cost Center: project-alpha, project-beta         │
│  - Application: web-app, api, worker                        │
│                                                              │
│  Cost Allocation Tags:                                      │
│  - Aktifkan di AWS Billing Console                          │
│  - Semua resource harus punya tag                           │
│  - Enforce via SCP (Service Control Policy)                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. REFERENCE ARCHITECTURE: 3-TIER WEB APPLICATION

### Full Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    3-TIER WEB APPLICATION ON AWS                     │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      PRESENTATION TIER                       │    │
│  │                                                              │    │
│  │  [Users] ──HTTPS──▶ [Route 53] ──▶ [CloudFront CDN]         │    │
│  │                                      │                       │    │
│  │                                      ▼                       │    │
│  │                            [WAF + ALB]                       │    │
│  │                            (Application Load Balancer)       │    │
│  │                            - SSL Termination                 │    │
│  │                            - Path-based routing              │    │
│  │                            - Health checks                   │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
│                             │                                        │
│  ┌──────────────────────────┴──────────────────────────────────┐    │
│  │                      APPLICATION TIER                        │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  Auto Scaling Group (Web/App Servers)               │    │    │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐           │    │    │
│  │  │  │  EC2-1   │ │  EC2-2   │ │  EC2-3   │  ...      │    │    │
│  │  │  │ (AZ-a)   │ │ (AZ-b)   │ │ (AZ-c)   │           │    │    │
│  │  │  └────┬─────┘ └────┬─────┘ └────┬─────┘           │    │    │
│  │  │       │            │            │                   │    │    │
│  │  │       └────────────┼────────────┘                   │    │    │
│  │  │                    │                                │    │    │
│  │  │  ┌─────────────────┴─────────────────┐             │    │    │
│  │  │  │  NAT Gateway (per AZ)             │             │    │    │
│  │  │  │  - Outbound internet access       │             │    │    │
│  │  │  │  - For software updates, API calls│             │    │    │
│  │  │  └───────────────────────────────────┘             │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  SQS Queue (Async Processing)                       │    │    │
│  │  │  ┌──────────────────────────────────────────────┐   │    │    │
│  │  │  │  ASG Workers (Background Jobs)               │   │    │    │
│  │  │  │  - Image processing                          │   │    │    │
│  │  │  │  - Email sending                             │   │    │    │
│  │  │  │  - Report generation                         │   │    │    │
│  │  │  └──────────────────────────────────────────────┘   │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
│                             │                                        │
│  ┌──────────────────────────┴──────────────────────────────────┐    │
│  │                        DATA TIER                             │    │
│  │                                                              │    │
│  │  ┌──────────────────┐  ┌──────────────────┐                │    │
│  │  │  RDS Aurora      │  │  ElastiCache     │                │    │
│  │  │  (Multi-AZ)      │  │  (Redis Cluster) │                │    │
│  │  │  ┌────────────┐  │  │  ┌────────────┐  │                │    │
│  │  │  │  Writer    │  │  │  │  Primary   │  │                │    │
│  │  │  │  (AZ-a)    │  │  │  │  (AZ-a)    │  │                │    │
│  │  │  └─────┬──────┘  │  │  └─────┬──────┘  │                │    │
│  │  │        │ sync    │  │        │ repl     │                │    │
│  │  │  ┌─────┴──────┐  │  │  ┌─────┴──────┐  │                │    │
│  │  │  │  Reader 1  │  │  │  │  Replica 1 │  │                │    │
│  │  │  │  (AZ-b)    │  │  │  │  (AZ-b)    │  │                │    │
│  │  │  └────────────┘  │  │  └────────────┘  │                │    │
│  │  │  ┌────────────┐  │  │  ┌────────────┐  │                │    │
│  │  │  │  Reader 2  │  │  │  │  Replica 2 │  │                │    │
│  │  │  │  (AZ-c)    │  │  │  │  (AZ-c)    │  │                │    │
│  │  │  └────────────┘  │  │  └────────────┘  │                │    │
│  │  └──────────────────┘  └──────────────────┘                │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  S3 Buckets                                          │    │    │
│  │  │  - app-uploads/ (user files)                         │    │    │
│  │  │  - static-assets/ (CloudFront origin)                │    │    │
│  │  │  - backups/ (automated DB backups)                   │    │    │
│  │  │  - logs/ (application logs)                          │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    CROSS-CUTTING SERVICES                    │    │
│  │                                                              │    │
│  │  [CloudWatch]    [AWS WAF]     [Secrets Manager]            │    │
│  │  - Metrics       - SQL injection - DB credentials           │    │
│  │  - Logs          - XSS protection - API keys               │    │
│  │  - Alarms        - Rate limiting - Auto-rotation           │    │
│  │  - Dashboards    - IP blocking                              │    │
│  │                                                              │    │
│  │  [CloudTrail]    [Config]      [Systems Manager]            │    │
│  │  - API audit     - Compliance   - Patch management          │    │
│  │  - User activity - Config rules - Session manager           │    │
│  │  - File integrity - Drift detect - Automation               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Security Best Practices

```
┌─────────────────────────────────────────────────────────────┐
│              SECURITY BEST PRACTICES                         │
│                                                              │
│  Network Security:                                           │
│  ✅ VPC dengan public/private subnet                        │
│  ✅ Security Groups (least privilege)                       │
│  ✅ NACLs sebagai secondary defense                         │
│  ✅ VPC Endpoints untuk AWS services (S3, DynamoDB)         │
│  ✅ NAT Gateway untuk outbound dari private subnet          │
│                                                              │
│  Data Security:                                              │
│  ✅ Encryption at rest (RDS, EBS, S3)                       │
│  ✅ Encryption in transit (TLS 1.2+)                        │
│  ✅ Secrets Manager untuk credentials                       │
│  ✅ KMS untuk key management                                │
│  ✅ S3 bucket policy (deny public access)                   │
│                                                              │
│  Access Control:                                             │
│  ✅ IAM roles (bukan access keys)                           │
│  ✅ Least privilege principle                               │
│  ✅ MFA untuk root dan admin                                │
│  ✅ CloudTrail untuk audit                                  │
│  ✅ Regular IAM access review                               │
│                                                              │
│  Application Security:                                       │
│  ✅ AWS WAF untuk web protection                            │
│  ✅ Shield untuk DDoS protection                            │
│  ✅ Input validation di semua layer                         │
│  ✅ Regular security scanning                               │
│  ✅ Patch management via Systems Manager                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### High Availability Checklist

```
┌─────────────────────────────────────────────────────────────┐
│              HIGH AVAILABILITY CHECKLIST                     │
│                                                              │
│  Compute:                                                    │
│  [ ] Multi-AZ deployment (minimum 2 AZ)                     │
│  [ ] Auto Scaling Group dengan min 2 instances              │
│  [ ] Launch Template dengan latest AMI                      │
│  [ ] Health checks enabled (ELB health check)               │
│  [ ] Lifecycle hooks untuk graceful shutdown                │
│                                                              │
│  Database:                                                   │
│  [ ] RDS Multi-AZ enabled                                   │
│  [ ] Read replicas untuk read scaling                       │
│  [ ] Automated backups enabled                              │
│  [ ] RDS Proxy untuk connection pooling                     │
│  [ ] Cross-region read replica (untuk DR)                   │
│                                                              │
│  Cache:                                                      │
│  [ ] ElastiCache Multi-AZ                                   │
│  [ ] Cluster mode enabled                                   │
│  [ ] Automatic failover enabled                             │
│  [ ] Backup enabled                                         │
│                                                              │
│  Storage:                                                    │
│  [ ] S3 versioning enabled                                  │
│  [ ] Cross-region replication (untuk critical data)         │
│  [ ] Lifecycle policies configured                          │
│  [ ] MFA delete enabled (untuk critical buckets)            │
│                                                              │
│  Network:                                                    │
│  [ ] Multi-AZ load balancer                                 │
│  [ ] Route 53 health checks + failover                      │
│  [ ] CloudFront untuk global distribution                   │
│  [ ] VPC endpoints untuk internal AWS traffic               │
│                                                              │
│  Monitoring:                                                 │
│  [ ] CloudWatch alarms untuk critical metrics               │
│  [ ] SNS notifications untuk alerts                         │
│  [ ] CloudTrail enabled                                     │
│  [ ] Custom dashboards                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST PEMAHAMAN

- [ ] Paham evolusi scaling di AWS dari single server ke multi-region
- [ ] Bisa mendesain VPC dengan public/private subnet, NAT, route tables
- [ ] Paham perbedaan Security Groups dan NACLs
- [ ] Paham VPC Peering vs Transit Gateway
- [ ] Bisa setup Auto Scaling dengan launch template dan scaling policies
- [ ] Paham lifecycle hooks dan health checks
- [ ] Bisa memilih load balancer yang tepat (ALB vs NLB vs CLB)
- [ ] Paham SSL termination dan sticky sessions
- [ ] Bisa setup RDS Multi-AZ, read replicas, dan Aurora global database
- [ ] Paham RDS Proxy untuk connection pooling
- [ ] Bisa memilih ElastiCache engine (Redis vs Memcached)
- [ ] Paham Redis cluster mode dan replication
- [ ] Bisa setup SQS standard dan FIFO queues dengan DLQ
- [ ] Paham SNS fan-out pattern
- [ ] Bisa design DynamoDB partition key, GSI, LSI
- [ ] Paham DAX caching dan DynamoDB Streams
- [ ] Bisa optimize Lambda cold start dan setup provisioned concurrency
- [ ] Paham S3 lifecycle policies, intelligent tiering, dan CRR
- [ ] Bisa setup CloudFront + S3 integration
- [ ] Paham cost optimization: reserved instances, spot, right-sizing
- [ ] Bisa mendesain 3-tier web application di AWS
- [ ] Paham security best practices di AWS
- [ ] Tahu high availability checklist

---

## 📚 REFERENSI

- [donnemartin/system-design-primer — Scaling AWS](https://github.com/donnemartin/system-design-primer/tree/master/solutions/system_design/scaling_aws)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [AWS VPC Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-best-practices.html)
- [AWS Auto Scaling Best Practices](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-best-practices.html)
- [AWS Cost Optimization Pillar](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html)

---

> **Lanjut ke:** [`11-ringkasan-fase-4.md`](./11-ringkasan-fase-4.md)
