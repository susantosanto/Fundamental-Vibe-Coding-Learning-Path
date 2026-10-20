# Riset — `Cocoon-AI/architecture-diagram-generator`

> **MULAI:** menjawab "apa isi repo ini, dan apakah layak dipakai di setup xcode?"
> **SELESAI:** ada jawaban berbasis bukti + rekomendasi pakai/jangan + daftar jebakan.
> **Tanggal riset:** 7 Okt 2026 · **Metode:** GitHub API + `raw.githubusercontent.com`
> (sesuai `MEMORY.md` §2 — hanya repo/dokumen resmi proyeknya).

---

## 1. Fakta dasar (dari GitHub API, bukan ingatan)

| Item | Nilai |
|---|---|
| Repo | `Cocoon-AI/architecture-diagram-generator` |
| Deskripsi | "Generate beautiful dark-themed system architecture diagrams as standalone HTML/SVG files. Works as a Claude AI skill." |
| Lisensi | **MIT** (`spdx_id: MIT`) |
| Bahasa | HTML |
| Bintang | **7.403** · fork 568 · watcher 20 |
| Dibuat | 22 Des 2025 |
| Push terakhir | 13 Mei 2026 |
| Ukuran | 473 KB · **13 file** |
| Branch | `main` |
| Versi skill | 1.1 |

Organisasi `Cocoon-AI` punya 6 repo. Yang relevan:

- `architecture-diagram-generator` — **7.403 ⭐**, MIT
- `process-flow-diagram-generator` — **102 ⭐**, MIT (skill saudara: alur proses, bahasa desain sama)
- `mcp-perforce`, `bp-analyzer`, `claude-agent-sdk-python`, `.github`

---

## 2. Isi repo — cuma 2 file yang penting

```
architecture-diagram/
├── SKILL.md                  8.383 B  · 177 baris   ← aturan desain
└── resources/template.html  17.492 B  · 434 baris   ← kerangka HTML+SVG
```

Sisanya: `README.md` (9 KB), `architecture-diagram.zip` (8,6 KB, paket siap-upload),
3 contoh HTML, 4 PNG, LICENSE.

**Tidak ada** `package.json`, `node_modules`, skrip build, server, atau API key.
Skill ini murni **teks + template** — agent membacanya, lalu menulis satu file HTML.

---

## 3. Cara kerjanya

`SKILL.md` = *design system* yang harus ditiru agent:

- **Palet semantik per jenis komponen** — Frontend cyan `#22d3ee` · Backend emerald `#34d399` ·
  Database violet `#a78bfa` · Cloud amber `#fbbf24` · Security rose `#fb7185` ·
  Message bus orange `#fb923c` · External slate `#94a3b8`
- **Font** JetBrains Mono dari Google Fonts · latar `#020617` + grid 40px
- **Aturan tata letak yang eksplisit** — tinggi komponen 60px, **celah vertikal minimum 40px**,
  message bus ditaruh *di dalam celah* (bukan menumpuk), legenda **di luar** semua boundary
- **Trik z-order** — panah digambar lebih dulu, lalu ditutup `<rect>` opaque `#0f172a`
  sebelum kotak semi-transparan digambar di atasnya
- **Toolbar ekspor bawaan** — 📋 Copy / 🖼️ PNG / 📄 PDF

`template.html` = kerangka yang disalin lalu diubah. Terverifikasi berisi:

| Marker | Nilai (dibaca dari file) |
|---|---|
| viewBox | `0 0 1000 680` |
| `id="report-container"` | ada |
| html2canvas | `html2canvas@1.4.1` + SRI `sha384-ZZ1pncU3bQ…` |
| jsPDF | `jspdf@2.5.2` + SRI `sha384-en/ztfPSRk…` |
| Google Fonts | `fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700` |

Kedua pustaka itu **dipin + ada Subresource Integrity** — jadi tidak bisa dipakai untuk
menyuntik kode lewat CDN. Ini nilai plus.

**Output:** satu file `.html` mandiri (CSS inline, SVG inline, animasi CSS murni).
Bisa dibuka di browser mana pun, tanpa instalasi apa pun.

---

## 4. Cocok tidak dengan setup xcode?

### Yang cocok ✅

- **Format skill standar.** Frontmatter `name` + `description` biasa. `description` 168
  karakter (batas validator pi/omp 1.024) · `SKILL.md` 177 baris (batas 500). **Lolos.**
- **Nol dependensi runtime.** Tidak perlu `npm install`, tidak perlu jaringan saat generate.
- **MIT.** Bebas dipakai, diubah, disebar.
- **Satu file keluaran.** Mudah disimpan di `PRAKTIK/sesi-NNN/`.

### Yang tidak cocok ⚠️

- **Bahasa Inggris.** Semua skill `teach-*` xcode berbahasa Indonesia. Kalau dipakai apa adanya,
  ada dua bahasa dalam satu repo.
- **Struktur folder beda.** xcode pakai `references/` (5 file wajib); ini pakai `resources/`
  (1 file). Kalau mau seragam, isinya harus dipecah jadi 5 file.
- **Butuh internet** untuk Google Fonts + 2 CDN. Offline → diagram tetap tampil, tapi
  tombol PNG/PDF mati dan font jatuh ke monospace sistem.
- **Bukan alat belajar.** Lihat §5.

---

## 5. 🔴 Relevansi ke MISSION — ini bagian terpenting

Repo `fundamental-vibe-coding` memakai **Mode Inspeksi** (`MEMORY.md` §3).
Batasnya jelas: *"memutuskan trade-off"* dan *"menjelaskan kenapa"* **tidak** boleh
diserahkan ke AI. **Menggambar diagram arsitektur dari deskripsi = persis aktivitas itu.**

Kalau pelajar bilang *"buatkan diagram arsitektur sistem saya"*, yang hilang adalah
**model mentalnya sendiri** — bagian yang justru jadi tujuan belajar.

**Tapi ada dua pemakaian yang sah:**

**A. Alat visualisasi setelah rancangan selesai.**
Pelajar merancang dulu (menggambar sendiri, di kertas atau Excalidraw), *baru* minta
versi rapi untuk dokumentasi. Urutan ini tidak menghapus pelajaran.

**B. Bahan latihan "klaim vs kenyataan" — justru sangat cocok.**
`MEMORY.md` §3 mensyaratkan korpus TELUSUR **wajib hasil generate AI**, dan
latihan intinya **"klaim vs kenyataan"**. Skill ini memproduksi diagram yang
**terlihat sangat kredibel** — rapi, berwarna, profesional — dari deskripsi yang
mungkin **salah atau tidak lengkap**. Itu korpus ideal:

> Deskripsi sistem yang sengaja diberi 3 kesalahan → minta AI gambar → pelajar
> memeriksa diagram dan menemukan bahwa **tampilan meyakinkan bukan bukti kebenaran**.

Ini satu-satunya pemakaian yang saya nilai **menambah** nilai belajar, bukan menguranginya.

---

## 6. Rekomendasi

**Jangan pasang apa adanya.** Tiga alasan:

1. Bahasa dan struktur folder tidak sesuai konvensi repo.
2. Tidak melayani MISSION secara langsung (§5).
3. Belum ada kebutuhan nyata yang belum terlayani — repo sudah punya skill
   `architecture-planner` dan kemampuan menggambar SVG inline.

**Kalau xcode mau memakainya, dua jalur:**

- **Jalur ringan** — pakai `template.html` sebagai *referensi gaya* saja (palet + trik
  z-order + toolbar ekspor). Tidak dipasang sebagai skill, cukup disalin ke
  `belajar-arsitektur/` sebagai contoh. Tidak menambah skill baru.
- **Jalur penuh** — tulis ulang jadi skill `teach-arsitektur-visual` berbahasa Indonesia,
  pecah `SKILL.md` jadi 6 file (`references/` 5 file), lalu sebarkan ke 11 lokasi.
  **Ini pekerjaan besar dan sebaiknya tidak dimulai tanpa tujuan akhir yang jelas.**

**Rekomendasi saya: jalur ringan dulu.** Kalau setelah dipakai ternyata berguna,
baru pertimbangkan jalur penuh.

⚠️ **Belum ada yang dipasang.** Ini riset, bukan pemasangan. Menunggu keputusan xcode.

---

## 7. Posisi di workflow Bab 27 — jawaban pertanyaan xcode (7 Okt 2026)

**Pertanyaan:** kalau skill ini dimasukkan ke alur workflow yang sudah dibentuk
(`27-Panduan-EndToEnd-Semua-Skill.md`), taruh di mana?

**Temuan pertama — 18 dari 19 skill workflow sudah ada di semua agen.** Diverifikasi langsung:

```
ADA: scaffolder · idea-clarifier · prd-generator · tech-stack-advisor ·
     entity-modeler · module-planner · sprint-planner · ai-coding-coach ·
     acceptance-runner · security-dependency-auditor · deploy-production-gate ·
     state-keeper · pen-design · birdview · impeccable · browser-skill ·
     materi-reference · constitution
TIDAK: taste
```

Jadi jalur distribusinya sudah terbukti jalan — pertanyaannya murni **penempatan**.

### 7.1 🔴 Tabrakan: slot ini SUDAH diisi `/birdview`

Ini temuan yang mengubah jawabannya. `/birdview` sudah menempati posisi
"visualisasi arsitektur" di Tahap 3.5 (langkah 12b) dan Tahap 4 (langkah 15b).
Bedanya penting:

| | `/birdview` (sudah ada) | Cocoon `architecture-diagram` |
|---|---|---|
| Sumber data | `architecture.json` dari `module-planner` — **terstruktur** | **deskripsi teks bebas** yang ditafsirkan LLM |
| Validasi | `validate.mjs --authoring`, module ID stabil, revisi terikat | **tidak ada** |
| Isi | tab Architecture / Constraints / Verification | satu gambar statis |
| Jejak audit | ya — `activity.jsonl`, "hanya check tercatat yang berlaku" | tidak ada |
| Ganti/ulang | reuse peta, `render.mjs` deterministik | tiap kali LLM menggambar ulang |
| Fungsi | **alat kerja** — konfirmasi scope sebelum build | **alat presentasi** — poster |

**Kesimpulan: jangan taruh di Tahap 3.5 sebagai pengganti birdview.** Birdview lebih kuat
justru karena bisa ditelusuri ke sumber. Diagram dari prosa tidak bisa.

### 7.2 Di mana ia BISA masuk (3 slot, urut dari terkuat)

**Slot 1 — 27.8 Jalur Adopsi, langkah 3c. Ini yang paling kuat.**
Alasan: proyek existing **belum punya `architecture.json`**, jadi birdview belum bisa
render apa pun. Cocoon hanya butuh deskripsi — dan proyek lama justru yang paling butuh
dokumentasi arsitektur "as adopted" (27.8.2 langkah 3b menyebut ADR "as adopted").

**Slot 2 — Tahap 3.6 (tahap baru, setelah birdview langkah 12b).**
Diagram presentasi untuk lampiran BLUEPRINT / komunikasi ke stakeholder non-teknis.
Birdview tidak nyaman dibaca orang luar (tab, JSON, istilah scope) — diagram ya.

**Slot 3 — Tahap 6 langkah 22 (`/deploy-production-gate`).**
Diagram final untuk `README.md` / dokumentasi rilis. Artefak dokumentasi, bukan artefak gate.

### 7.3 Rancangan aturan (gaya 27.4, kalau xcode setuju)

```
/arch-diagram  (nama kerja — belum diputuskan)
KAPAN  : (a) 27.8 Jalur A langkah 3c — diagram "as adopted" proyek existing;
         (b) Tahap 3.6 — diagram presentasi SETELAH birdview (bukan pengganti);
         (c) Tahap 6 langkah 22 — diagram untuk dokumentasi rilis
BUTUH  : deskripsi arsitektur dari DOMAIN.MD / BLUEPRINT / module-planner
OUTPUT : SATU file HTML mandiri → docs/architecture/diagram-<tanggal>.html
         (+ ekspor PNG/PDF sebagai lampiran)
ATURAN : 🔴 Diagram adalah ILUSTRASI, BUKAN sumber kebenaran.
         Sumber kebenaran tetap architecture.json + BLUEPRINT + CONSTRAINTS.md.
         Kalau diagram berbeda dari architecture.json → YANG SALAH DIAGRAMNYA.
         Dilarang menjadikan diagram lampiran ACCEPTANCE (bukan bukti).
         Dilarang mengganti birdview dengan diagram.
BATAL  : proyek dengan module map yang sudah jelas (birdview cukup);
         skrip sekali pakai / throwaway; backend-only tanpa kebutuhan presentasi
```

### 7.4 🔴 Satu aturan yang tidak boleh dilanggar

Hukum inti workflow ini — *"Bukti, bukan klaim"* dan *"folder = source of truth"* —
**langsung bertabrakan** dengan sifat skill ini. Diagram Cocoon dibuat dari **kalimat yang
diketik seseorang**, tanpa validasi apa pun.

`/birdview` sendiri sudah jujur soal batasnya: *"v0.1 records are agent-declared snapshots…
no automatic observation… A completed event does not prove checks passed."*
Cocoon **lebih lemah lagi** — ia tidak punya kaitan ke sumber sama sekali.

**Konsekuensinya:** kalau diagram disimpan di folder proyek tanpa label, enam bulan lagi
seseorang akan mempercayainya sebagai kebenaran arsitektur. Maka wajib ada penanda di dalam
file HTML-nya sendiri: *"ILUSTRASI — bukan sumber kebenaran. Sumber: architecture.json
revisi <hash>."* Tanpa itu, **jangan dipasang**.

### 7.5 Catatan untuk Mode Belajar (Bab 28)

Di Bab 27 (proyek produksi), agent yang menggambar diagram itu **sah** — agent memang
mengerjakan pekerjaannya. Yang berbeda adalah **Bab 28 / skill `teach-*`**: di sana
`MEMORY.md` §3 (Mode Inspeksi) melarangnya, karena menggambar arsitektur dari deskripsi
mengambil alih pekerjaan berpikir yang justru jadi tujuan belajar.

**Pengecualian yang justru berguna di Bab 28:** sebagai **korpus latihan "klaim vs kenyataan"** —
diagram yang terlihat sangat kredibel dari deskripsi yang sengaja dibuat salah. Ini sesuai
syarat §3 bahwa korpus TELUSUR wajib hasil generate AI. Framing-nya: bahan yang **diperiksa**
pelajar, bukan alat yang mengerjakan.

### 7.6 Rekomendasi akhir

**Jangan dipasang dulu sebagai skill.** Urutannya:

1. **Kalau ada proyek existing yang mau diadopsi (27.8)** — pakai Cocoon manual sekali
   (tanpa skill, cukup minta agent pakai `template.html`). Lihat apakah hasilnya berguna.
2. Berguna? → baru bentuk skill `/arch-diagram` dengan aturan §7.3 + penanda §7.4,
   lalu sebar ke 11 lokasi lewat prosedur `distribusi-skill-agen`.
3. Tidak berguna? → tidak ada yang hilang; `template.html` tetap bisa dipakai sebagai
   referensi gaya kapan saja.

⚠️ **Belum ada yang dipasang.** Menunggu keputusan xcode (§1.1 `MEMORY.md`).

---

## 8. Jebakan yang sudah ditemukan

| Jebakan | Akibat |
|---|---|
| Google Fonts + 2 CDN | Offline → font & tombol ekspor mati (diagram tetap tampil) |
| `html2canvas` tidak paham SVG `<foreignObject>` | Jangan pakai `<foreignObject>`; pakai `<svg>` + `<text>` biasa |
| Clipboard API butuh HTTPS/file/localhost + gestur pengguna | Buka via `file://` aman, via `http://` biasa tidak |
| SRI hash harus dihitung ulang kalau versi CDN di-naikkan | Ganti versi tanpa ganti hash → skrip tidak jalan |
| `SKILL.md` melarang `<foreignObject>` dan mewajibkan `id="report-container"` | Kalau diubah sembarangan, tombol ekspor rusak **tanpa error** |

---

## 9. Sumber

1. `https://api.github.com/repos/Cocoon-AI/architecture-diagram-generator` — metadata, lisensi, bintang
2. `https://api.github.com/repos/Cocoon-AI/architecture-diagram-generator/git/trees/main?recursive=1` — daftar file + ukuran
3. `https://raw.githubusercontent.com/Cocoon-AI/architecture-diagram-generator/main/README.md`
4. `.../main/architecture-diagram/SKILL.md`
5. `.../main/architecture-diagram/resources/template.html`
6. `https://api.github.com/orgs/Cocoon-AI/repos?per_page=100` — repo lain di organisasi yang sama

Semua diambil **7 Okt 2026**. Tidak ada blog, artikel SEO, atau konten AI yang dipakai.
