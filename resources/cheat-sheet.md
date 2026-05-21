# ⚡ Cheat Sheet — Ringkasan Cepat

## Konsep Kunci

| Konsep | 1 Kalimat |
|---|---|
| **Performance vs Scalability** | Performance = cepat untuk 1 user. Scalability = tetap cepat untuk banyak user |
| **Latency vs Throughput** | Latency = waktu/request. Throughput = request/detik |
| **CAP Theorem** | Pilih Consistency ATAU Availability, Partition Tolerance wajib |
| **Horizontal vs Vertical** | Vertical = upgrade 1 server. Horizontal = tambah banyak server |
| **SQL vs NoSQL** | SQL = data terstruktur, NoSQL = data fleksibel & scale horizontal |

## Load Balancer Algorithms

| Algoritma | Kapan |
|---|---|
| Round Robin | Server spec sama, traffic merata |
| Weighted RR | Server spec berbeda |
| Least Connections | Request durasi bervariasi |
| IP Hash | Butuh session persistence |

## Cache Update Strategies

| Strategy | Write | Read | Kapan |
|---|---|---|---|
| Cache-aside | Invalidate cache | Cache miss → DB → cache | Paling umum |
| Write-through | Cache + DB | Dari cache | Konsistensi penting |
| Write-behind | Cache dulu | Dari cache | Write super cepat |

## Database Scaling

| Teknik | Cara |
|---|---|
| Master-Slave | Write ke master, read dari slave |
| Federation | Pisah DB berdasarkan fungsi |
| Sharding | Pisah DB berdasarkan key |

## Pola Prompt Efektif

```
"Buat [fitur] dengan [tech stack]:
- Input: [spesifik]
- Output: [spesifik]
- Validasi: [aturan]
- Test: [jenis test]
- Edge cases: [situasi khusus]"
```

## Checklist Vibe Coding Aman

- [ ] Start Small — 1 function dulu, validate, baru scale
- [ ] Context is King — Update CLAUDE.md
- [ ] Human-in-the-Loop — Review diff sebelum commit
- [ ] Test First — Minta AI generate test cases dulu
- [ ] Version Control — Commit per logical change

## AWS Quick Reference

| Component | AWS Service |
|---|---|
| Compute | EC2, Lambda |
| Database | RDS, Aurora, DynamoDB |
| Cache | ElastiCache (Redis) |
| CDN | CloudFront |
| Load Balancer | ALB, NLB |
| Queue | SQS |
| Storage | S3 |
| DNS | Route 53 |
| Monitoring | CloudWatch |
