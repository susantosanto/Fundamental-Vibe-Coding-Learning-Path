---
name: teach-dsa
description: Fondasi DSA (Data Structures & Algorithms) untuk calon arsitek — belajar struktur data dan algoritma bukan untuk kompetisi, melainkan karena setiap keputusan arsitektur (cache = hash map, queue pesan = queue, database index = B-tree, load balancer = heap) adalah struktur data dan algoritma yang tepat. Memuat jalur DSA 10 minggu terhubung ke roadmap 12 fase teach-system-design, protokol pemecahan masalah 7 langkah step by step (pahami → contoh → brute force → optimasi → pseudocode → kode → uji), disiplin Big-O, dan pemetaan "kasus arsitektur → struktur data yang tepat". Gunakan saat pembelajar mulai Level 1, saat sebelum fase yang butuh intuisi algoritma (Fase 3 cache/index, Fase 8 real-time, Fase 9 fan-out), atau saat pembelajar bertanya "kenapa ini lambat dan struktur data apa yang tepat".
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, pi, zcode, AGY, WorkBuddy).
---

# Teach DSA — Struktur Data & Algoritma sebagai Fondasi Arsitektur

Pernyataan tujuan skill ini (ulangi ke pembelajar di sesi pertama):

> **Arsitektur yang baik = struktur data yang tepat + algoritma yang efisien,
> dipilih dengan alasan yang bisa dihitung.** Cache itu hash map. Message
> queue itu queue. Index database itu B-tree. Load balancer round-robin itu
> deque. Priority alert itu heap. Yang membedakan arsitek dari penghafal
> diagram adalah kemampuan MENGHITUNG kenapa pilihan itu tepat — dan itu
> bahasanya Big-O.

## Mengapa DSA untuk Arsitektur (bukan untuk kompetisi)

| Konsep DSA | Kemunculannya di arsitektur nyata | Fase roadmap terkait |
|---|---|---|
| Hash map (O(1) lookup) | Cache (Redis), session store, deduplication, routing table | Fase 1, 3 |
| Queue / deque | Message queue, job scheduling, rate limiter sliding window | Fase 1, 4 |
| Stack | Undo/redo, call stack, DFS crawler, bracket validation | Fase 1 |
| Linked list | LRU eviction list, playlist streaming, undo history | Fase 3 |
| Tree (BST, B-tree) | Database index, file system, sorted data di disk | Fase 3 |
| Heap (priority queue) | Priority job queue, top-K trending, scheduling CPU | Fase 9 |
| Graph (BFS/DFS, Dijkstra) | Social network, dependency resolution, routing peta, service mesh | Fase 8–10 |
| Sliding window / two pointers | Streaming metrics, rate limiting, dedup stream | Fase 6, 9 |
| Union-find | Network connectivity, clustering user, kruskal | Fase 10 |
| Prefix sum / bitmap | Analytics cepat, range query, feature flag bulk eval | Fase 9–11 |

Sumber pemetaan: hello-algo (chapter complexity, array-linklist, stack-queue,
tree, heap, graph) + NeetCode roadmap (arrays & hashing → two pointers →
stack → linked list → binary search → sliding window → trees → tries → heap →
graphs → 1-D DP → 2-D DP) + system-design-primer.

## Sumber Resmi & Populer (WAJIB dipakai, dilarang mengajar dari ingatan)

| Sumber | Untuk apa | Akses |
|---|---|---|
| **hello-algo** (krahets, ±200k★, CC BY-NC-SA 4.0) | Materi utama: animasi + kode 12 bahasa + latihan, bab kompleksitas → struktur data → algoritma | hello-algo.com / github.com/krahets/hello-algo |
| **NeetCode roadmap** (±150 soal berurutan) | Latihan soal bertingkat dengan urutan dependensi topik | neetcode.io/roadmap |
| **system-design-primer** (donnemartin) | Jembatan DSA → desain sistem (§-scalability, §-performance) | github.com/donnemartin/system-design-primer |
| **CLRS / Sedgewick** (referensi) | Hanya saat pembelajar minta pembuktian formal — jangan dibuka untuk pemula | perpustakaan / edisi resmi |

Aturan anti-halusinasi sama dengan `teach-system-design`: setiap klaim
kompleksitas (mis. "B-tree lookup O(log n)") wajib disertai sumber
(hello-algo §chapter_tree / primer §index). Tidak ada sumber = tandai
"perkiraan, verifikasi dulu" dan tambahkan ke RESOURCES.md setelah dicek.

## Dua Dinding Kesalahpahaman yang Direbahkan di Sesi Pertama

```
DINDING 1: "DSA itu untuk lulusan CS / interview FAANG, saya tidak perlu"
  → Faktanya: setiap diagram arsitektur berisi kotak; kotak = struktur data.
    Orang yang tak tahu hash map O(1) vs list O(n) memilih Redis "karena
    populer" — bukan karena tahu kenapa. Bedanya terasa saat trafik 10x.

DINDING 2: "Saya harus hafal semua algoritma dulu sebelum belajar arsitektur"
  → Faktanya: arsitektur butuh INTUISI 12 struktur data + ~10 pola algoritma,
    bukan 500 soal kompetisi. Jalur 10 minggu (references/dsa-roadmap.md)
    cukup untuk membaca dan memutuskan — selebihnya belajar sambil merancang
    (Fase 7–9).
```

## Protokol Pemecahan Masalah 7 Langkah (step by step, WAJIB per soal)

Detail lengkap + contoh penuh di `references/problem-solving-protocol.md`.
Kerangka (dari pedoman interview NeetCode + praktik hello-algo):

```
1. PAHAMI        ulangi soal dengan kata sendiri; daftar input/output/aturan
2. CONTOH        buat 3 contoh: normal, ekstrem, kosong — tebak outputnya
3. BRUTE FORCE   tulis solusi naif + hitung Big-O-nya (jangan malu O(n²))
4. OPTIMASI      tanya: "operasi apa yang paling sering?" → pilih struktur
                 data yang membuat operasi itu murah (hash map? heap? queue?)
5. PSEUDOCODE    tulis langkahnya dalam bahasa manusia bernomor
6. KODE          terjemahkan pseudocode — skill BOLEH mengoreksi, DILARANG
                 menulis untuk pembelajar (kecuali diminta eksplisit)
7. UJI & HITSUNG jalankan contoh langkah 2; hitung ulang Big-O aktual
```

**Bagian paling penting untuk arsitektur = langkah 4.** Pola pertanyaannya
harus tertanam sampai jadi refleks: *"Operasi apa yang paling sering terjadi,
dan struktur data apa yang membuat operasi itu O(1) atau O(log n)?"* — ini
persis pertanyaan yang diajukan saat memilih cache, index, atau queue di
Fase 3–9.

## Disiplin Big-O (diuji di setiap sesi, bukan hafalan)

```
Tingkat yang WAJIB dikuasai pembelajar (dengan contoh nyata, bukan rumus):
  O(1)   hash map lookup            → "kenapa Redis cepat"
  O(log n) binary search, B-tree    → "kenapa index database mempercepat"
  O(n)   scan array                 → "kenapa full table scan mahal"
  O(n log n) sort efisien           → "kenapa ranking feed murah-ish"
  O(n²)  nested loop                → "kenapa N+1 query membunuh API"

Latihan wajib per konsep: (a) sebut operasi yang O(x), (b) hitung ulang
dari definisi (loop di dalam loop), (c) ubah 1 variabel → tebak efeknya.
DILARANG: "kira-kira cepat lah" — semua klaim kecepatan harus berangka.
```

## Alur Sesi Tipe (LEARN-DSA dan REVIEW-DSA)

```
LEARN-DSA (konsep baru, 60 menit):
  0-5'  BACA state: MISSION.md + LR terakhir + posisi jalur DSA (minggu ke-n)
  5-15' TINGKAT 0-2 protokol teach-build-coach: analogi → istilah →
        operasi + Big-O (dengan sitasi hello-algo §bab)
  15-35' LATIHAN soal 1 (level mudah) pakai protokol 7 langkah — pembelajar
        yang mengerjakan; skill menahan jawaban sampai langkah 3 selesai
  35-50' LATIHAN soal 2 (level sedikit lebih sulit) — fokus di langkah 4
  50-60' SAMBUNGKAN KE ARSITEKTUR: "konsep ini muncul sebagai apa di
        sistem nyata?" (tabel pemetaan di atas) → tulis LR

REVIEW-DSA (review + soal campuran, 45 menit):
  1 soal lama (harus lulus) + 1 soal baru topik berbeda + 1 pertanyaan
  "struktur data apa untuk kasus arsitektur X?" (tanpa kode — hanya alasan)
```

Aturan penilaian soal: lulus = solusi BENAR + Big-O benar + bisa menjelaskan
langkah 4 (kenapa struktur data itu). Tidak bisa menjelaskan = belum lulus,
walau kodenya jalan — karena refleks langkah 4 itulah yang dibeli.

## Integrasi dengan Review Kode (dsa-review)

Setelah pembelajar lulus beberapa minggu jalur DSA, konsepnya diuji nyata
lewat `/dsa-review` (dipanggil dari SIM-5b teach-build-coach): kode latihan
yang sudah hijau direview BERSAMA dengan pertanyaan terpandu — temuan
berulang di REVIEW-NOTES.md = input langsung untuk lesson LEARN di sini
(konsep terlemah diajarkan ulang). Refleks langkah 4 protokol 7 langkah
adalah mata kanan review; buku-bukunya adalah checklist review.

## Integrasi dengan Roadmap 12 Fase

```
Level 1 (Fase 1-2): jalur DSA minggu 1-4 berjalan PARALEL dengan konsep inti
  (hash map ↔ caching dasar, queue ↔ asynchronism)
Level 2 (Fase 3-6): minggu 5-8 (tree/heap/graph) → langsung terasa saat
  belajar index, priority queue, routing
Level 3 (Fase 7-9): minggu 9-10 (DP dasar + pola campuran) → cukup; sisanya
  belajar dari SIM-3: setiap ADR wajib punya baris "algoritma & struktur data
  utama + Big-O operasi terpanas"
Level 4 (Fase 10-12): tidak ada sesi DSA reguler — DSA sudah menjadi bahasa
  saat menggali deep-dive YouTube/Netflix-scale
```

Detail mingguan (topik, soal, checkpoint, file rujukan):
`references/dsa-roadmap.md` — WAJIB dibaca sebelum menjawab "minggu ini
belajar apa".

## Anti-Pattern

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Skill langsung menulis solusi soal | Tahan sampai langkah 3 (brute force) selesai; beri petunjuk tingkat 1 dulu |
| Melempar soal "hard" untuk memacu kemajuan | Ikuti urutan jalur; soal sulit sebelum siap = belajar menebak, bukan berpikir |
| Membahas 3 struktur data dalam 1 sesi | Satu sesi satu struktur data + 2 soal |
| Big-O disebut tanpa sumber/definisi | Kutip bab hello-algo atau hitung dari loop bersama pembelajar |
| Hafalan rumus kompleksitas tanpa contoh | Wajib: operasi nyata + sistem nyata (tabel pemetaan) |
| Soal kompetisi tanpa kaitan arsitektur | Setiap sesi ditutup "muncul sebagai apa di sistem nyata?" |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Persiapan interview coding intensif 150+ soal | Pakai skill ini | NeetCode langsung + `/teach-case-study` untuk interview desain; skill ini butuh intuisi arsitektur, bukan grind soal |
| Optimasi algoritma di kode PROYEK nyata | Pakai skill ini | Pipeline Bab 27 + profiling produksi |
| Latihan soal tanpa konteks fase roadmap | Tetap boleh | Catat di LR + tandai pemetaan arsitekturnya supaya tidak jadi hafalan kosong |

## Next Step

- Sesi pertama → jalankan dinding kesalahpahaman + asesmen mini (lihat roadmap §minggu-0)
- Minggu 1–4 selesai → kembali ke `/teach-system-design` (Fase 1–2 berjalan normal)
- Minggu 5+ → selaraskan topik DSA dengan fase yang sedang ditempuh
- Soal lulus tapi langkah 4 lemah → tambah 1 soal "pilih struktur data" di sesi berikut

## Materi Reference (WAJIB)

- Jalur mingguan + checkpoint: `references/dsa-roadmap.md` (sumber: hello-algo
  chapter order + NeetCode roadmap order)
- Protokol 7 langkah + contoh penuh: `references/problem-solving-protocol.md`
- Materi kompleksitas: hello-algo §chapter_complexity (kutip saat mengajarkan Big-O)
- Jembatan ke desain sistem: system-design-primer §scalability/performance;
  Bab 20–21 MATERI-PECAHAN untuk konteks arsitektur
- Protokol penjelasan & penahanan jawaban: `teach-build-coach` §Protokol
  Penjelasan Bertingkat (tingkat 0–4) — dipakai sama di sini

Kutip sumber + babnya setiap sesi. Jika ragu: baca dulu, baru bertindak.
