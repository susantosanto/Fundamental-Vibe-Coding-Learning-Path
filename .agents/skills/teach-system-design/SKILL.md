---
name: teach-system-design
description: Router dan roadmap induk untuk belajar arsitektur desain sistem aplikasi dari nol sampai mahir. Menilai posisi pembelajar di roadmap 4 level / 12 fase (durasi realistis 12-18 bulan, 1 jam per hari), membuat workspace belajar stateful (MISSION.md, RESOURCES.md, LEARNING-RECORDS/), dan mengarahkan ke skill teach-clarifier, teach-build-coach, teach-case-study, atau teach-test-ladder sesuai kebutuhan. Gunakan saat user bilang "saya mau belajar system design / arsitektur aplikasi", "lanjutkan belajar saya", "saya harus belajar apa berikutnya", atau saat perlu memilih jalur belajar yang tepat.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, zcode).
---

# Teach System Design — Router & Roadmap Induk

Skill ini adalah **pintu masuk** belajar arsitektur desain sistem aplikasi.
Ia tidak mengajar sendiri — ia mengukur posisi kamu di roadmap, menjaga
workspace belajar tetap hidup antar-sesi, lalu menyerahkan pengajaran ke skill
yang tepat.

**Kontrak utama:** pemahaman arsitektur dibangun dalam 4 level / 12 fase.
Durasi realistis **12–18 bulan** dengan ritme 1 jam per hari. Ini MARATHON,
bukan sprint. Skill ini dirancang untuk bertahan sepanjang perjalanan itu.

## ⚠️ MODE PENYAMPAIAN — BERLAKU DI SELURUH SKILL `teach-*` (ditetapkan 24 Sep 2026)

> xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi, karena sangat
> tidak paham."* Terbukti pada sesi CAP theorem: materi yang sama gagal dipahami dari file,
> tetapi berhasil setelah dijelaskan tutor.

**Pembelajar TIDAK ditugaskan membaca file referensi.** Tutor yang membaca.

| | Aturan |
|---|---|
| Siapa membaca `fase-1`…`fase-4` | **Tutor**, sendiri, boleh tanpa izin khusus |
| Apa yang diterima pembelajar | **Penjelasan langsung** — detail, dari nol, pakai contoh |
| Aturan anti-halusinasi | **TETAP BERLAKU PENUH.** Setiap klaim tetap menyebut sumber (`fase-1/04` baris 98). Yang berubah hanya siapa yang membaca |
| 🔎 Research sumber luar | **DIIZINKAN** (24 Sep 2026) — dokumentasi resmi, standar, paper peer-reviewed, repo populer. Syarat ketat; lihat §IZIN RESEARCH di bawah |
| Rujukan baris/heading | Untuk tutor sendiri — **jangan pernah** ditulis sebagai instruksi ("baca baris 9–60") ke pembelajar |
| Panjang penjelasan | Boleh detail/panjang — **tetap satu konsep per sesi** |
| Konsekuensi | Lebih lambat dari 12 fase biasa; sudah disetujui pembelajar |

Ini **mengalahkan** instruksi "pembelajar membaca rentang baris" di bagian mana pun skill
ini dan skill `teach-*` lainnya. Sumber preferensi: `NOTES.md` di workspace pembelajar.

### 🔎 IZIN RESEARCH — sumber resmi di luar folder materi (24 Sep 2026)

Tutor **boleh mencari sumber baru** (web, repo, dokumentasi resmi) — tidak terbatas pada
folder materi lokal dan `RESOURCES.md`. Syaratnya **keempat wajib**:

1. **Resmi/otoritatif** — dokumentasi resmi vendor, standar (RFC/ISO/W3C), paper
   peer-reviewed, atau repo proyeknya sendiri. **Bukan** blog pribadi / artikel SEO /
   konten hasil AI.
2. **Populer & teruji** — dipakai luas di industri nyata; riwayat rilis & kontributor jadi bukti.
3. **Bisa dipertanggungjawabkan** — jelas penulis/lembaga, ada tanggal, ada versi.
4. **Terverifikasi langsung** — tutor membuka sendiri sumbernya, lalu mencatat **apa yang
   TIDAK diverifikasi**.

**JANGAN menjanjikan "akurat 100%".** Yang dijanjikan sebagai gantinya:

- sumbernya **nyata dan sudah dibuka sendiri** (bukan dari ingatan),
- sumber disebut **lengkap** (URL + judul + tanggal akses) supaya pembelajar bisa memeriksa
  sendiri tanpa harus percaya pada tutor,
- **batasnya diakui jujur** — klaim satu sumber dikatakan sebagai klaim satu sumber,
- kalau sumber layak **tidak ditemukan → bilang tidak ada**, jangan menutupi dengan sumber lemah.

**Prinsipnya: *bukti bisa diperiksa* lebih berharga daripada *janji akurasi*.**

**Wajib dicatat:** setiap sumber baru masuk `RESOURCES.md` pembelajar (§A/§E) dengan tanggal
verifikasi. Sumber yang dipakai tapi belum terdaftar = pelanggaran aturan folder.

Versi lengkap: `teach-build-coach/MODE-PENYAMPAIAN.md`.

## Sebelum Mulai: Asesmen Posisi (WAJIB, tidak boleh dilewati)

`teach` (mattpocock) punya cacat terdokumentasi (issue #725): ia menebak level
pembelajar dan memakai jargon yang tak pernah didefinisikan. Jangan ulangi itu.
Sebelum lesson/materi pertama, jalankan asesmen **5 pertanyaan** lewat protokol
teach-clarifier (satu pertanyaan sekaligus, masing-masing dengan konteks 4 blok):

```
A1. Pernah membuat aplikasi lengkap (bukan sekadar tutorial) yang di-deploy
    atau dipakai orang? Apa saja? (stack-nya apa?)
A2. Pernah mendengar / pakai: Load Balancer, Cache (Redis), Message Queue?
    Jelaskan dengan kata-kata sendiri apa yang kamu tahu — jawab yang
    tahu saja, lewati yang belum.
A3. Pernah menjelaskan KENAPA sebuah fitur lambat atau down? Ceritakan
    satu kejadian nyata kalau ada.
A4. Sedang belajar untuk apa? (pindah kerja / interview system design /
    naik jabatan / membangun produk sendiri / rasa penasaran)
A5. Berapa jam PER MINGGU yang realistis kamu bisa dedikasikan?
    (jujur saja — 1 jam/hari dan 1 jam/minggu menghasilkan rencana yang
    sangat berbeda)
```

Dari jawaban A1–A5, tentukan **level awal** di roadmap (lihat
`references/roadmap-12-fase.md`) dan tulis ke `MISSION.md`.

## Langkah 1 — Kenali Workspace Belajar

Belajar arsitektur adalah proyek jangka panjang → butuh tempat yang stateful.
Modelnya diambil dari skill `teach` (mattpocock, repo ±170k★): *folder adalah
kontinuitas, bukan chat history* — persis Pilar #3 metode Architect-Builder
(Bab 6.2 materi ini).

Workspace belajar **WAJIB terpisah dari repo proyek apa pun**. Rekomendasi:
folder/repo sendiri bernama `belajar-arsitektur/`. Struktur:

```
belajar-arsitektur/
├── MISSION.md            ← kenapa belajar (dari A4) + level awal + target
├── RESOURCES.md          ← sumber terverifikasi (DILARANG mengajar dari ingatan)
├── NOTES.md              ← preferensi belajar (analogi? kode dulu/teori dulu?)
├── LEARNING-RECORDS/     ← catatan ADR-style: LR-0001-*.md per sesi
└── PRAKTIK/              ← proyek latihan mini (jalur Simulasi)
```

**RESOURCES.md = anti-halusinasi.** Pengetahuan model dianggap UNTRUSTED.
Setiap klaim di setiap sesi belajar wajib punya sumber dari RESOURCES.md.
Sumber default yang disetujui (tambahkan saat pertama kali membuat file):

- `donnemartin/system-design-primer` (±290k★) — dasar semua konsep
- `ashishps1/awesome-system-design-resources` — ringkasan + diagram
- `krahets/hello-algo` (±200k★, CC BY-NC-SA) — materi DSA (struktur data &
  algoritma) animasi + kode 12 bahasa; `neetcode.io/roadmap` — latihan soal
  DSA bertingkat (dipakai oleh `/teach-dsa`)
- Dokumen resmi Grafana k6 — untuk semua materi performance testing
- Folder `fase-1-arsitektur-dasar/` … `fase-4-deep-system-design/` di repo ini —
  materi bahasa Indonesia yang sudah diadaptasi dari sumber di atas
- `architecture-planner/MATERI-PECAHAN/` — metode Architect-Builder (Bab 1–27)

Aturan sitasi: setiap konsep yang diajarkan → sebut sumbernya
(`system-design-primer §Caching`, `fase-1/14-cache.md`, `Bab 20.3`, dst.).
Lesson tanpa sitasi = skill mengajar dari ingatan = RED FLAG (verifikasi murah,
jangan hilang).

## Langkah 2 — Pahami Roadmap (ringkas di sini, detail di references)

| Level | Fase | Nama | Durasi tipikal | Kata kunci lulus |
|---|---|---|---|---|
| **1 — Fondasi** | 1–2 | Konsep inti + komunikasi | 6–8 minggu | Jelaskan scalability, latency, CAP, DNS, CDN, LB, SQL vs NoSQL dengan kata sendiri |
| **2 — Komponen** | 3–6 | Blok bangunan + trade-off | 3–4 bulan | Pilih cache strategy, queue, sharding, replication DENGAN alasan trade-off |
| **3 — Rancang** | 7–9 | Simulasi build + arsitektur nyata | 4–6 bulan | Rancang URL shortener → chat app → news feed end-to-end, lengkap perhitungan back-of-envelope |
| **4 — Mahir** | 10–12 | Skala besar + produksi + interview | 4–6 bulan | Rancang YouTube/Netflix/WhatsApp-scale, jelaskan failure modes, operasikan tangga tes |

Detail lengkap per fase (materi, praktik, kriteria lulus, file rujukan repo):
**WAJIB baca `references/roadmap-12-fase.md`** sebelum menjawab "apa
berikutnya untuk saya?"

**Jalur paralel DSA (Level 1–3):** arsitektur berdiri di atas intuisi struktur
data & algoritma — cache adalah hash map, index database adalah B-tree, message
queue adalah queue. Karena itu jalankan `/teach-dsa` (10 minggu) BERSAMAAN
dengan fase: minggu 1–4 saat Fase 1–2, minggu 5–8 saat Fase 3–6, minggu 9–10
saat Fase 7. Setelah itu DSA menjadi bahasa sehari-hari: setiap ADR desain
wajib menyebut struktur data utama + Big-O operasi terpanas.

Ritme yang benar (dari prinsip *storage strength* vs *fluency*) — **versi 24 Sep 2026:
pembelajar tidak membaca file; tutor yang membaca lalu menjelaskan**:

```
1 sesi = 1 konsep kecil (max 1 jam):
  tutor baca sumber → tutor jelaskan (analogi → istilah → diagram → latihan)
  → pembelajar jelaskan balik dengan kata sendiri → praktik mini → catat LR
Setiap minggu: 1 review 15 menit (buka LEARNING-RECORDS, coba ingat tanpa membaca)
Setiap fase: 1 checkpoint lulus (lihat roadmap-12-fase.md §checkpoint)
JANGAN lanjut fase sebelum checkpoint lulus — ini gerbang, bukan formalitas.
  (quiz teach adalah gate, bukan formality — dan jawaban benar jangan selalu
   opsi pertama; acak posisinya — issue #335 repo teach)
```

## Langkah 3 — Delegasikan ke Skill yang Tepat

Skill ini adalah router. Setelah tahu posisi + kebutuhan pembelajar:

| Situasi | Serahkan ke |
|---|---|
| Menetapkan tujuan, menjernihkan apa yang mau dipelajari, asesmen level | `/teach-clarifier` (interview interaktif) |
| Memulai materi konsep baru di fase mana pun | `/teach-build-coach` mode LEARN (lesson terpandu + latihan) |
| Latihan memutuskan arsitektur dengan pipeline Architect-Builder | `/teach-build-coach` mode BUILD-SIM (simulasi Tahap 2–6 Bab 27) |
| Menganalisis arsitektur aplikasi nyata (Twitter, Netflix, WhatsApp) | `/teach-case-study` |
| Belajar performance & stress testing (tangga tes 6 tingkat) | `/teach-test-ladder` |
| Memulai/meneruskan jalur DSA — struktur data & algoritma sebagai fondasi arsitektur | `/teach-dsa` |
| Review kode latihan dengan lensa DSA (pembelajar, pertanyaan terpandu) | `/dsa-review` |

Aturan chaining: **maksimal 1 skill aktif per sesi**. Selesaikan satu tujuan
sesi → tulis LR → tutup. Konteks bersih > konteks penuh (Bab 14.3).

## Langkah 4 — Tutup Setiap Sesi dengan LEARNING-RECORD

Setiap sesi WAJIB diakhiri: buat `LEARNING-RECORDS/LR-NNNN-<topik>.md` berisi:

```markdown
# LR-NNNN — <topik> (<tanggal>)
Level/Fase: L<x>-F<y> · Sesi ke: <n> · Durasi: <±jam>
## Yang dipelajari hari ini (3 poin max, kata-kata pembelajar)
## Miskonsepsi yang terkoreksi (jika ada)
## Bukti paham: <hasil latihan / jawaban quiz / diagram yang dibuat>
## Sumber: <dari RESOURCES.md, dengan bagian spesifik>
## Selanjutnya: <1 langkah konkret + skill pemiliknya>
```

LR = memori jangka panjang. Sesi berikutnya: baca MISSION + LR terakhir dulu —
*jangan pernah* mengulang materi yang sudah terbukti (lihat LR), *jangan pernah*
melanjutkan dari ingatan chat lama.

## Cek Tanda Berhasil (It's working if)

- Membuka folder workspace + MISSION.md cukup untuk melanjutkan — tanpa chat lama
- RESOURCES.md bertambah setiap level, dan setiap lesson punya sitasi
- LEARNING-RECORDS tumbuh 3–5 file per minggu
- Pembelajar bisa MENJELASKAN balik konsep minggu lalu tanpa membaca
- Checkpoint fase dijalankan jujur; gagal = mengulang sebagian, bukan lanjut

## Anti-Pattern (JANGAN)

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Menyuruh pembelajar "baca file X baris 9–60" | **JANGAN.** Tutor baca file itu sendiri, lalu jelaskan isinya (§MODE PENYAMPAIAN) |
| Pembelajar minta "cepat, langsung level 4" | Tegur ramah: maraton 12–18 bulan, sinyal di A5. Tawarkan jalur cepat JUJUR (roadmap §jalur-ringkas) dengan konsekuensinya |
| Mengajar dari ingatan karena "ini konsep umum" | Cari sumber di RESOURCES.md dulu; belum ada? Tambahkan dengan verifikasi, baru ajarkan |
| Satu sesi membahas 3 konsep sekaligus | Satu sesi satu konsep; sisanya masuk jadwal |
| Chat lama dilanjutkan lintas minggu | Tutup chat, mulai baru, baca MISSION + LR (folder = source of truth) |
| Memberi jawaban saat pembelajar stuck | Itu ranah `/gentle-teaching` (metode Socratic repo ini) — delegasikan atau terapkan |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Rancang arsitektur proyek NYATA produksi | Pakai skill ini | Itu pipeline Bab 27 (`/scaffolder`, `/idea-clarifier`, dst.) — skill belajar hanya untuk latihan |
| Membuat tutorial/konten untuk orang lain | Pakai skill ini | Itu skill `tutorial-engineer` (untuk pembuat konten, bukan pembelajar) |
| Menjawab satu pertanyaan lewat di tengah kerja | Buka asesmen lengkap | Jawab langsung dengan sitasi; sarankan `/teach-system-design` kalau mau belajar serius |
| Debugging kode proyek pembelajar | Pakai skill ini | `/gentle-teaching` atau `/coding-tutor` |

## Next Step

Setelah workspace + MISSION + level awal siap:
→ `/teach-clarifier` untuk menetapkan target sesi pertama
→ lalu skill pemilik fase (lihat tabel delegasi)

## Materi Reference (WAJIB)

Sebelum menjawab pertanyaan materi atau menetapkan roadmap, baca sumbernya
lewat `/materi-reference` — folder materi adalah sumber kebenaran, ingatan
model bukan:

- Path materi metode: `architecture-planner/MATERI-PECAHAN/`
  - Bab 20 (System Design & Architecture), Bab 22 (Standar Production-Ready),
    Bab 25–27 (skill workflow + panduan end-to-end + Bab 28 Mode Belajar)
- Path fase pembelajaran: `fase-0-peta-belajar/` sampai `fase-4-deep-system-design/`
- Sumber eksternal resmi: lihat daftar RESOURCES.md di Langkah 1

Kutip aturan verbatim + sebut nomor sumbernya. Jika ragu: baca dulu, baru
bertindak. Jangan mengarang dari ingatan.
