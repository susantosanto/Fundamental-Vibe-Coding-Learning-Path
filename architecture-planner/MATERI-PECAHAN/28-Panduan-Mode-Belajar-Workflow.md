# BAB 28 — PANDUAN MODE BELAJAR: Memakai Workflow Bab 27 untuk Menjadi Arsitek Desain Sistem, dari Dasar sampai Mahir

> **💬 Bayangkan ini:** Bab 25–27 memberi pipeline produksi lengkap — tetapi semuanya ditulis untuk *pemilik proyek*. Bab ini adalah balikannya: **Mode Belajar** — cara memakai filosofi, tahapan, dan disiplin pipeline yang sama sebagai *mesin pembelajaran*. Tujuannya bukan merilis aplikasi, melainkan membentuk **arsitek**: dari nol sampai mahir, lewat roadmap 12 fase yang dirancang untuk perjalanan panjang (12–18 bulan, 1 jam per hari), dengan 5 skill pembelajaran interaktif (`teach-*`) sebagai pemandu.

---

## 28.1 Mengapa Mode Belajar Diperlukan

Bab 27 mengasumsikan pembaca tahu apa yang ia mau: ia menjawab interview
`idea-clarifier`, menyetujui PRD, dan menandatangani gate GO/NO-GO.
**Pembelajar tidak begitu.** Pemula yang ditanya *"berapa QPS targetmu?"*
akan jawab *"tidak tahu"* — dan di pipeline produksi itu jawaban mati.

Riset repo populer menunjukkan pola yang benar untuk pembelajaran:

| Sumber | Yang diambil | Yang dihindari (cacat terdokumentasi) |
|---|---|---|
| `teach` — mattpocock/skills (±170k★) | Workspace stateful (`MISSION.md`, `RESOURCES.md`, `learning-records/`), pengetahuan model = untrusted → wajib sitasi, quiz sebagai gerbang | Tanpa asesmen awal (issue #725); jawaban quiz selalu opsi A (issue #335); tidak tahu kapan berhenti |
| `grill-me` (mattpocock) + `interview-me` (addyosmani/agent-skills, ±94k★) | Satu pertanyaan per giliran, dorong push-back, "ungrillable → prototype, jangan menebak" | Interview produksi mengasumsikan user sudah tahu konteks — pembelajar sering belum |
| `constraint-driven-development` (addyosmani) | **"Tidak tahu" tetap sah**: setiap pertanyaan punya default yang menghasilkan config jalan | — |
| `gentle-teaching` (repo ini) | Jangan panjar jawaban; Socratic; tiered support | — |

**Keputusan desain Bab 28:** interview produksi tetap dipakai polanya
(satu pertanyaan, ber-round), TAPI setiap pertanyaan untuk pembelajar wajib
**protokol 4 blok** (§28.3) — supaya "tidak tahu" menjadi pintu masuk, bukan
jalan buntu.

**Dan satu riset lagi yang menutup gap Bab 27:** workflow produksi bab 27
tidak punya performance testing sama sekali. Standar industri datang dari
**Grafana k6** — 6 tipe load test (smoke, average-load, stress, spike,
breakpoint, soak) dengan urutan aman yang diatur dokumen resminya. Di Mode
Belajar, itu menjadi **Tangga Tes** (§28.5) lewat skill `/teach-test-ladder`.

---

## 28.2 Lima Skill Mode Belajar (keluarga `teach-*`)

```
ROUTER & ROADMAP (pintu masuk, selalu mulai di sini)
═══════════════════════════════════════════════════
/teach-system-design → asesmen posisi (5 pertanyaan A1–A5) → workspace
   belajar → roadmap 4 level / 12 fase (12–18 bulan) → delegasi

SKILL PEMBELAJARAN (dipanggil sesuai kebutuhan)
═══════════════════════════════════════════════
/teach-clarifier    → interview interaktif 4 blok; 4 jenis sesi:
                      asesmen awal / target fase / checkpoint / kebingungan
/teach-build-coach  → mode LEARN (lesson 1 konsep per sesi) dan
                      mode BUILD-SIM (simulasi Tahap 2–6 Bab 27 di
                      proyek latihan: SIM-1..SIM-7)
/teach-case-study   → mode BEDAH (uraikan arsitektur Twitter/Netflix/…)
                      dan mode PEWAWANCARA (latihan interview system design)
/teach-test-ladder  → tangga tes 6 tingkat (k6): smoke → load → stress →
                      spike → breakpoint → soak, urutan aman ditegakkan
/teach-dsa          → fondasi DSA untuk arsitektur: struktur data & algoritma
                      yang tepat (cache = hash map, index = B-tree, queue =
                      queue), protokol pemecahan masalah 7 langkah, disiplin
                      Big-O, jalur 10 minggu paralel dengan roadmap
/dsa-review         → review bersama kode latihan dengan lensa DSA — khusus
                      beginner: protokol temuan 4 blok + pertanyaan terpandu,
                      maks 3 temuan/sesi, REVIEW-NOTES.md (posisi: SIM-5b;
                      detail di Bab 27.9b)
```

**Aturan komposisi:** persis Bab 27.1 — satu router + 4 skill pekerja.
Maksimal **satu skill aktif per sesi**; selesaikan satu tujuan → catat
LEARNING-RECORD (LR) → tutup chat. Folder = kontinuitas, bukan chat (Pilar #3).

| Skill | Dipakai kapan | TIDAK dipakai kapan |
|---|---|---|
| `/teach-system-design` | Sesi pertama; setiap kali lupa posisi; review mingguan | Mengerjakan proyek produksi nyata (→ Bab 27) |
| `/teach-clarifier` | Menetapkan target, checkpoint fase, saat bingung | Interview kebutuhan proyek nyata (→ `/idea-clarifier`) |
| `/teach-build-coach` LEARN | Belajar 1 konsep baru | Latihan jawab interview (→ `/teach-case-study`) |
| `/teach-build-coach` BUILD-SIM | Proyek latihan ke-1/2/3 (Fase 7–9) | Proyek produksi nyata — dilarang kontaminasi (§28.6) |
| `/teach-case-study` | Akhir tiap fase; Fase 10 & 12 | Review arsitektur tim nyata (→ skill produksi) |
| `/teach-test-ladder` | Fase 9 (parsial) & 11 (penuh); tiap task build | Menembak sistem yang bukan milikmu (dilarang keras) |
| `/teach-dsa` | Paralel Level 1–3 (minggu 1–10); sebelum Fase 3/8/9 yang butuh intuisi algoritma | Grind 150+ soal interview (→ NeetCode langsung); optimasi proyek nyata |
| `/dsa-review` | SIM-5b (1x per proyek latihan); saat "kenapa ini lambat?" di kode latihan | Kode proyek produksi nyata (→ review produksi Bab 12/27); profiling (→ teach-test-ladder) |

---

## 28.3 Protokol 4 Blok — Jantung Interaktivitas Mode Belajar

Semua skill `teach-*` memakai satu format pertanyaan yang sama. Ini jawaban
atas kebutuhan inti bab ini: **pemula harus bisa memahami SETIAP pertanyaan
interaktif tanpa malu**.

```
❓ PERTANYAAN <n>/<total>     ← satu kalimat, tanpa jargon
💡 KENAPA DITANYA            ← keputusan belajar apa yang ditentukan jawaban ini
🌤️ ANALOGI SEDERHANA         ← jembatan dunia nyata SEBELUM istilah formal
✍️ CONTOH JAWABAN            ← yang bagus + yang kabur (keduanya sah)
🛟 BELUM TAHU? JAWABAN INI SAH ← default yang tetap menghasilkan rencana
```

Contoh lengkap satu pertanyaan:

```
❓ PERTANYAAN 2/5
   Kalau aplikasimu tiba-tiba dipakai 100.000 orang dalam sehari,
   bagian mana yang kamu KIRIM akan bermasalah lebih dulu?

💡 KENAPA DITANYA
   Jawabanmu menunjukkan sejauh mana kamu berpikir tentang "banyak
   pengguna" — inti scalabilitas. Menentukan Fase 1 cukup atau Fase 3.

🌤️ ANALOGI SEDERHANA
   Satu kasir warung: 10 pembeli lancar; 10.000 sekaligus — kasir jadi
   hambatan. Kasirmu yang mana?

✍️ CONTOH JAWABAN
   Bagus: "Database-nya — semua request menulis ke satu tempat, belum
   ada cache."
   Kabur: "Ya servernya lambat." (sah — nanti diurai bersama)

🛟 BELUM TAHU? JAWABAN INI SAH:
   "Belum pernah kepikiran" — mulai Fase 1; 3 minggu lagi kamu bisa
   menjawab ini sendiri.
```

**Aturan pelaksanaan interview pembelajar** (detail di skill
`/teach-clarifier`): satu pertanyaan per giliran; maks 5–7 per sesi;
"tidak tahu" = data penempatan, bukan nilai; dorong push-back ("ada yang
terasa tidak nyambung?"); pertanyaan yang hanya bisa dijawab dengan MELIHAT
→ suruh praktik dulu, jangan menebak (prinsip grill-me); tutup selalu dengan
rangkuman keputusan yang ditulis ke file, bukan hanya diucapkan.

---

## 28.4 Roadmap 12 Fase (ringkas — detail di skill router)

> Prinsip yang sama dengan sprint Bab 10: pecah perjalanan panjang jadi
> unit kecil yang punya gerbang. **Fase dibuka hanya setelah checkpoint
> lulus.** Gagal checkpoint = ulang sebagian, bukan lanjut.

| Level | Fase | Isi | Durasi | Gerbang (checkpoint) |
|---|---|---|---|---|
| **1 Fondasi** | 1–2 | Konsep inti (CAP, LB, cache, queue), komunikasi, studi kasus mini | 6–8 minggu | Jelaskan konsep inti dengan kata sendiri; desain URL shortener di kertas |
| **2 Komponen** | 3–6 | Cache/database lanjut, queue, monolith vs microservices, observability & resilience | 3–4 bulan | Setiap pilihan disertai trade-off + kapan pilihan itu salah |
| **3 Rancang** | 7–9 | Proyek latihan BUILD-SIM: URL shortener + analytics → chat → news feed | 4–6 bulan | Pack ringkas + bukti + lolos gempa (`/teach-case-study`) |
| **4 Mahir** | 10–12 | Skala besar (YouTube/Netflix), tangga tes penuh, simulasi interview | 4–6 bulan | Desain bertahan 5 pertanyaan penggali; keputusan berubah karena ANGKA tes |

Ritme sesi (dari riset *storage strength* vs *fluency* di dokumen `teach`):

```
1 sesi (≤1 jam) = 1 konsep:
  baca → jelaskan balik dengan kata sendiri → latihan mini → tulis LR
Mingguan : review 15 menit TANPA membaca (retrieval practice)
Per fase : checkpoint lulus → fase berikutnya terbuka
Dilarang : lanjut fase dengan checkpoint gagal — gerbang, bukan formalitas
```

Konsep lengkap per fase (mingguan, file rujukan repo, praktik, kriteria
lulus): baca `skills/teach-system-design/references/roadmap-12-fase.md`.

**Jalur paralel DSA:** arsitektur = struktur data yang tepat + algoritma
efisien yang dihitung. Karena itu `/teach-dsa` berjalan BERSAMAAN roadmap —
minggu 1–4 paralel Fase 1–2 (hash map ↔ cache, queue ↔ asynchronism),
minggu 5–8 paralel Fase 3–6 (tree/heap/graph ↔ index/priority/routing),
minggu 9–10 paralel Fase 7 (DP + sintesis). Sejak Fase 7, setiap ADR wajib
menyebut struktur data utama + Big-O operasi terpanas — DSA sudah menjadi
bahasa desain, bukan lagi mapel terpisah. Format baris DSA yang sama kini
wajib juga di PROYEK PRODUKSI: task hot path di BLUEPRINT (27.4c ATURAN 3
DSA Gate) — belajar di jalur ini = langsung siap untuk gate produksi,
dan sebaliknya, proyek produksi boleh jadi studi kasus belajar lewat
jalur Learn-As-You-Build (maks 2 pertanyaan terpandu per task, 27.4c).

---

## 28.5 Tangga Tes — Bagian yang Hilang dari Bab 27 (untuk pembelajar)

Bab 27 berhenti di acceptance + security audit. Pembelajar arsitektur justru
membutuhkan **performance testing** untuk memahami scalabilitas secara nyata.
Standar resmi yang diadopsi: **Grafana k6** — 6 tipe load test.

| # | Tipe | Analogi warung makan | Angka kasar | Kapan di roadmap |
|---|---|---|---|---|
| 1 | Smoke | Buka pintu, 3 pembeli — jalan? | 1–5 VU, menit | Tiap task selesai (SIM-5) |
| 2 | Average-load | Rush hour biasa | rata-rata produksi, 5–60 menit | Fase 9 & 11 |
| 3 | Stress | Hari gajian, di atas normal | 50–100%+ di atas rata-rata | Fase 11 |
| 4 | Spike | Selebgram posting — antrean meledak | sangat tinggi, instan | Fase 11, pra-demo |
| 5 | Breakpoint | Uji sampai dapur menyerah | naik terus sampai gagal | Fase 11 |
| 6 | Soak | Buka 3 hari nonstop — tetap rapi? | rata-rata, jam–hari | Fase 11 |

**Aturan aman (dari best practices resmi k6):** dilarang naik tingkat sebelum
tingkat bawah hijau; pola beban sederhana (ramp-up → plateau → ramp-down,
tanpa rollercoaster); reuse skrip dengan parameter naik; hasil tanpa
perbandingan run sebelumnya = setengah matang. **Etika keras:** hanya uji
sistem milik sendiri/localhost.

**Tujuan akhirnya bukan angka, tapi keputusan:** setiap run wajib diakhiri
ADR — "keputusan apa yang berubah karena angka ini?" (pola DECISIONS.MD
Bab 7.4). Skrip siap pakai per tingkat: `skills/teach-test-ladder/references/k6-scenarios.md`.

---

## 28.6 Larangan Kontaminasi (Aturan Keras)

> **Mode Belajar boleh gagal dengan murah JUSTRU karena ia tidak pernah
> menyentuh proyek nyata.** Satu kali bocor — kebiasaan disiplin runtuh.

```
✅ BOLEH
 - Workspace belajar terpisah: belajar-arsitektur/ (MISSION.md, RESOURCES.md,
   LEARNING-RECORDS/, PRAKTIK/)
 - Pipeline produksi Bab 27 disimulasikan DI PRAKTIK/ versi ringan (SIM-1..7)
 - Gagal, bolak-balik, mengulang fase — semua boleh, itu zamannya

❌ DILARANG
 - Menjalankan proyek latihan di repo produksi mana pun
 - Memakai skill produksi (/scaffolder, /deploy-production-gate, dst.) untuk
   proyek latihan — versi ringannya sudah disediakan di /teach-build-coach
 - Menjawab interview pembelajar dengan angka produksi yang dikarang —
   angka tanpa sumber ditandai "orde besaran", keterusterangan itu bagian
   dari pembelajaran
 - Load test sistem yang bukan milik pembelajar (lihat 28.5)
```

---

## 28.7 Ritel Harian & Mingguan Mode Belajar

```
HARIAN (≤ 1 jam)
 1. Chat baru di workspace belajar → /teach-system-design
    (router membaca MISSION.md + LR terakhir → arahkan posisi)
 2. Skill pemilik konsep hari ini (biasanya /teach-build-coach LEARN)
 3. Protokol 4 blok + penjelasan bertingkat (analogi → istilah → konkrit → latihan)
 4. LR ditulis → tutup chat

PER PROYEK LATIHAN (setelah task inti hijau — SIM-5b)
 5. /dsa-review (opsional tapi disarankan): maks 3 temuan, protokol 4 blok,
    REVIEW-NOTES.md; pola berulang → lesson /teach-dsa + bahan SIM-7

MINGGUAN (15 menit, chat terpisah)
 5. Review tanpa membaca: "jelaskan konsep minggu ini" → cek LR lama
 6. RESOURCES.md diperbarui bila ada sumber baru terverifikasi

PER FASE
 7. /teach-clarifier Jenis C (checkpoint) → lulus? fase berikutnya terbuka
 8. /teach-case-study (bedah studi kasus fase itu) → LR penutup fase
```

**Sinyal Mode Belajar bekerja (dijalankan jujur di tiap review mingguan):**

| Tanda sehat | Tanda bahaya |
|---|---|
| LR bertambah 3–5/minggu | Chat lama dilanjutkan lintas minggu |
| Pembelajar bisa jelaskan ulang konsep minggu lalu tanpa membaca | Semua sesi = membaca materi, tanpa latihan |
| Setiap lesson menyebut sumber | Ada klaim tanpa sitasi ("katanya sih…") |
| Checkpoint pernah GAGAL lalu diulang | Semua checkpoint hijau instan (mencurigakan) |
| Ada ADR "keputusan berubah karena angka tes" | Tangga tes = koleksi skrip tanpa keputusan |

---

## 28.8 Sumber Riset Bab Ini

- `teach` — mattpocock/skills: dokumen resmi aihero.dev/skills-grill-me &
  docs/productivity/teach.md (workspace, ZPD, storage strength, issue #335/#725)
- `hello-algo` (krahets, ±200k★, CC BY-NC-SA 4.0) + NeetCode roadmap — sumber
  resmi & populer DSA untuk `/teach-dsa` (urutan chapter/topik diadopsi ke
  jalur 10 minggu); `interview-me`/`grill-me` untuk protokol langkah
- `interview-me` & `constraint-driven-development` — addyosmani/agent-skills
  (±94k★): interview 1 pertanyaan + default yang sah untuk "tidak tahu"
- `grill-me` — mattpocock/skills: ber-round, push-back, ungrillable → prototype
- Grafana Labs — *Types of load testing* (resmi): 6 tipe + urutan aman +
  best practices; dokumentasi k6 (skenario & thresholds)
- Anthropic Agent Skills spec + agentskills.io: format SKILL.md (frontmatter,
  progressive disclosure, body < 500 baris) yang diikuti semua skill `teach-*`
- Materi repo: fase-0 … fase-4 (materi belajar), Bab 6–7 (kontrak file),
  Bab 10 (sprint), Bab 12 (verifikasi), Bab 20–22 (system design &
  production-ready), Bab 27 (pipeline produksi yang disimulasikan)

---

**📅 Ditambahkan:** September 2026 (Mode Belajar: skill `teach-*` —
teach-system-design, teach-clarifier, teach-build-coach, teach-case-study,
teach-test-ladder, teach-dsa — roadmap 12 fase / 4 level, protokol 4 blok untuk
pertanyaan interaktif pembelajar, Tangga Tes k6, jalur DSA 10 minggu,
larangan kontaminasi)
**📚 Referensi utama:** Bab 6, 7, 10, 12, 20–22, 27 + skill `teach-*` di
`skills/` + sumber eksternal di 28.8 (termasuk hello-algo & NeetCode untuk DSA)
**🎯 Tujuan:** Mengubah pipeline produksi Bab 27 menjadi mesin pembelajaran
arsitektur: dari pemula absolut sampai mahir lewat roadmap 12 fase (12–18
bulan) yang interaktif, berbukti, dan anti-halusinasi
