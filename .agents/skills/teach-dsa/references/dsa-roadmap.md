# DSA Roadmap — Jalur 10 Minggu untuk Calon Arsitek

> Terhubung ke roadmap 12 fase `teach-system-design`. Minggu 1–4 paralel dengan
> Level 1 (Fase 1–2), minggu 5–8 paralel Level 2 (Fase 3–6), minggu 9–10
> paralel awal Level 3 (Fase 7).
> Ritme: 2 sesi DSA per minggu (masing-masing ≤ 1 jam), sisanya tetap fase
> utama. Sumber materi: hello-algo (bab per minggu) + soal NeetCode (urutan
> roadmap resmi). Kode boleh bahasa apa pun yang dikuasai pembelajar
> (hello-algo menyediakan Python/Java/C++/JS/Go/dll).

---

## Minggu 0 — Asesmen & Dinding Kesalahpahaman (1 sesi)

```
1. Bahas 2 dinding kesalahpahaman (SKILL §Dua Dinding) — tanya reaksi pembelajar
2. Asesmen mini (3 soal percakapan, tanpa kode):
   a. "Cari 1 nama di 1 juta nama — berapa kali cek kalau dicari satu-satu?
      Kalau daftarnya terurut dan kamu bisa lompat?" → intuisi O(n) vs O(log n)
   b. "Kamu simpan harga barang dan sering dicari. Struktur apa yang membuat
      pencariannya instan?" → intuisi hash map
   c. "Antrean cetak dan tumpukan piring — apa bedanya?" → FIFO vs LIFO
3. Tentukan bahasa latihan + target mingguan (2 sesi)
4. Tulis ke MISSION.md: "Jalur DSA dimulai <tanggal>, target 10 minggu"
```
Lulus minggu 0 = ketiga intuisi dijawab (boleh dengan bantuan) + jadwal disepakati.

## Minggu 1 — Kompleksitas & Array/Hashing

- **Materi** (hello-algo): chapter_complexity (iterasi/rekursi, waktu vs ruang),
  chapter_array_and_linkedlist §array, hashing dasar
- **Soal** (NeetCode: Arrays & Hashing, level mudah): Two Sum, Contains Duplicate
- **Fokus 7 langkah**: langkah 3–4 — dari O(n²) naik ke O(n) dengan hash map
- **Checkpoint lulus**: 2 soal lulus + bisa menghitung ulang O dari definisi
  loop + bisa menjawab "kenapa lookup hash map O(1) rata-rata?"
- **Sambungan arsitektur**: cache = hash map (Redis) → ceritakan Fase 1/3

## Minggu 2 — Two Pointers, Sliding Window, Prefix Sum

- **Materi** (hello-algo): chapter_array_and_linkedlist; pola window dari
  NeetCode (Two Pointers, Sliding Window)
- **Soal**: Valid Palindrome, Longest Substring Without Repeating Characters
- **Fokus**: langkah 4 — "kenapa window menghapus nested loop"
- **Checkpoint**: 2 soal + jelaskan kapan sliding window TIDAK berlaku
  (data tidak berurutan / jendela tidak monoton)
- **Sambungan**: rate limiter sliding window, streaming metrics (Fase 6, 9)

## Minggu 3 — Stack & Queue

- **Materi** (hello-algo): chapter_stack_and_queue (+ deque)
- **Soal**: Valid Parentheses, Min Stack; bonus: Implement Queue using Stacks
- **Checkpoint**: 2 soal + jelaskan FIFO vs LIFO dengan 2 contoh sistem nyata
- **Sambungan**: message queue (Fase 4), undo/redo, DFS crawler (Fase 1 §20)

## Minggu 4 — Linked List + LRU (proyek mini pertama)

- **Materi** (hello-algo): chapter_array_and_linkedlist §linked list; hash map
  + doubly linked list = LRU
- **Soal**: Reverse Linked List, Linked List Cycle, LRU Cache (Soal Proyek)
- **Proyek mini**: tulis LRU cache sendiri (tanpa library) — 2 struktur data
  dipakai bersama
- **Checkpoint**: LRU lulus + "operasi apa yang dipertahankan O(1) dan bagaimana"
- **Sambungan**: cache eviction di Redis/memcached (Fase 3)

**Gerbang Level 1 DSA selesai** → checkpoint digabung dengan checkpoint Fase 2
(`/teach-clarifier` Jenis C). Gagal = ulang minggu terlemah, bukan lanjut.

## Minggu 5 — Binary Search & Tree Dasar

- **Materi** (hello-algo): chapter_tree (BST, traversal), binary search pola
- **Soal**: Binary Search, Search in Rotated Sorted Array, Level Order Traversal
- **Checkpoint**: 2 soal + "kenapa BST/B-tree O(log n) dan apa yang terjadi
  kalau tree tidak seimbang"
- **Sambungan**: database index = B-tree (Fase 3) — tampilkan kaitannya

## Minggu 6 — Heap / Priority Queue

- **Materi** (hello-algo): chapter_heap
- **Soal**: Kth Largest Element, Top K Frequent Elements, Last Stone Weight
- **Checkpoint**: 2 soal + "kapan heap lebih tepat daripada sort penuh"
- **Sambungan**: priority job queue, top-K trending, alarm prioritized (Fase 9)

## Minggu 7 — Graph: BFS & DFS

- **Materi** (hello-algo): chapter_graph (representasi adjacency, BFS/DFS)
- **Soal**: Number of Islands, Clone Graph, Rotting Oranges (BFS multi-source)
- **Checkpoint**: 2 soal + "kapan BFS vs DFS — dengan alasan struktur antrean"
- **Sambungan**: social graph, dependency build, crawl frontier (Fase 8–10)

## Minggu 8 — Graph Berbobot: Dijkstra + Intro Union-Find

- **Materi** (hello-algo): chapter_graph §shortest path; union-find dari NeetCode
- **Soal**: Network Delay Time (Dijkstra), Graph Valid Tree (union-find)
- **Checkpoint**: 2 soal + "kenapa Dijkstra tanpa priority queue menjadi O(n²)"
- **Sambungan**: routing peta, latency-based routing load balancer (Fase 10)

**Gerbang Level 2 DSA selesai** → gabung dengan checkpoint Fase 6. Pembelajar
kini punya intuisi untuk Fase 3–6 penuh (cache, index, queue, routing).

## Minggu 9 — Dinamic Programming Dasar (1-D)

- **Materi** (hello-algo): chapter_dynamic_programming (karakteristik DP,
  langkah desain: status definisi → transisi → inisialisasi → urutan)
- **Soal**: Climbing Stairs, House Robber, Coin Change
- **Checkpoint**: 2 soal + "kenapa DP menyimpan hasil yang dihitung ulang"
- **Sambungan**: memoization = cache tingkat algoritma (Fase 3 rasa yang sama)

## Minggu 10 — Sintesis: Pilih Struktur Data untuk Arsitektur (tanpa kode)

Sesi khas penutup — semua soal berbentuk kasus arsitektur (bank soal di bawah):

```
10 kasus × 5 menit: kasus → operasi terpanas → struktur data + algoritma +
  Big-O + kapan pilihan itu SALAH. Dinilai dengan rubrik langkah 4.
Lulus = 8/10 benar dengan alasan lengkap.
```

**Gerbang Level 3 DSA selesai.** Sesi DSA reguler berhenti di sini; lanjut ke
Fase 7–9 (BUILD-SIM) dengan aturan baru: setiap ADR SIM-3 wajib baris
"algoritma & struktur data utama + Big-O operasi terpanas" (lihat
teach-build-coach stage-guide §SIM-3).

---

## Tangga Big-O yang WAJIB Teruji (referensi cepat skill)

| Kompleksitas | Contoh operasi | Contoh sistem nyata |
|---|---|---|
| O(1) | hash map get/put | cache hit, rate limit bucket |
| O(log n) | binary search, BST/B-tree | index lookup, dedup di sorted data |
| O(n) | scan, sliding window sekali lewat | full scan tabel kecil, stream metrics |
| O(n log n) | sort, Dijkstra dengan heap | ranking feed, routing global |
| O(n²) | nested loop, brute force pair | N+1 query, perbandingan semua-user |

Aturan pengajaran: setiap baris WAJIB disambungkan ke contoh sistem nyata —
tabel ini bukan hafalan, tapi peta refleks langkah 4.

## Bank Pertanyaan "Kasus Arsitektur" (minggu 10 & review)

```
K1  Fitur auto-complete nama (prefix search, 10 juta user) → trie/BST + ranking
K2  Rate limiter per-user 100 req/menit → hash map + sliding window queue
K3  Top 10 tweet trending per 5 menit → heap + counter hash map
K4  Undo-undo editor kolaboratif → stack + linked list (operasi + timestamp)
K5  Deteksi duplikat file di 1 juta file → hash (fingerprint) + bucketing
K6  Urutan penyelesaian course dengan prasyarat → topological sort (Kahn/DFS)
K7  Teman-teman level-2 di social app → BFS dua langkah + set dedup
K8  Tiket dukungan prioritas VIP dulu → priority queue (heap)
K9  Sisa stok gabungan dari banyak gudang (range sum cepat) → prefix sum/BIT
K10 Grup user yang saling terhubung (klaster) → union-find / BFS komponen
```
Setiap kasus harus dijawab: struktur data, alasan operasi terpanas, Big-O,
dan kondisi kapan pilihan itu salah (rubrik langkah 4 protokol 7 langkah).

## Aturan Tangga (kalau Pembelajar Tertinggal / Melaju)

```
Tertinggal (checkpoint gagal): ulang minggu itu dengan soal level mudah;
  DILARANG menumpuk minggu — DSA bertumpuk seperti domino.
Melaju (checkpoint lulus < 2 sesi): jangan loncat topik; beri soal level
  lebih sulit TOPIK SAMA (NeetCode medium) atau minta jelaskan kompleksitas
  ruang (memory) dari solusinya.
```

## Sumber per Minggu (ringkasan)

| Minggu | hello-algo | NeetCode topic |
|---|---|---|
| 1 | chapter_complexity + array/hash | Arrays & Hashing |
| 2 | array & linked list | Two Pointers, Sliding Window |
| 3 | chapter_stack_and_queue | Stack |
| 4 | array & linked list | Linked List (+ LRU) |
| 5 | chapter_tree | Binary Search, Trees |
| 6 | chapter_heap | Heap / Priority Queue |
| 7 | chapter_graph | Graph (BFS/DFS) |
| 8 | chapter_graph §shortest path | Graph (advanced) + Union-Find |
| 9 | chapter_dynamic_programming | 1-D DP |
| 10 | (sintesis) | (review campuran) |
