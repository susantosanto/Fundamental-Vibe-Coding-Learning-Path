---
name: teach-build-coach
description: Mesin pengajaran inti untuk belajar arsitektur dengan dua mode. Mode LEARN - lesson konsep terpandu (analogi dunia nyata, penjelasan bertingkat, latihan mini, catat LEARNING-RECORD). Mode BUILD-SIM - mensimulasikan pipeline Architect-Builder Bab 27 (Tahap 2-6) di proyek latihan ringan supaya pembelajar MERASAKAN kenapa setiap tahap ada, bukan sekadar membacanya. Gunakan saat pembelajar mau belajar satu konsep baru, mulai proyek latihan, atau saat pembelajar meminta "ajari saya X" atau "kita build latihan ke-N".
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, zcode).
---

# Teach Build Coach — Lesson Terpandu & Simulasi Pipeline

Skill ini adalah tempat pembelajaran terjadi. Ia punya dua mode:

```
MODE LEARN     → belajar SATU konsep (cache, queue, LB, CAP, …)
MODE BUILD-SIM → latihan MEMBANGUN proyek mini sambil menjalankan
                 tahapan pipeline Bab 27 versi ringan
```

Kedua mode memakai **protokol penjelasan bertingkat** yang sama.

## ⚠️ MODE PENYAMPAIAN: TUTOR YANG MEMBACA, BUKAN PEMBELAJAR (berlaku sejak 24 Sep 2026)

> Ditetapkan oleh xcode: *"Saya belajar dari anda, tidak membaca dari teori di referensi,
> karena sangat tidak paham."* Terbukti pada sesi CAP theorem — materi yang sama gagal
> dipahami dari file, tetapi berhasil setelah dijelaskan tutor.

Default skill ini **berubah**: pembelajar **TIDAK** ditugaskan membaca file referensi.

```
BUKAN begini:  "Baca file X bagian Y, lalu jawab pertanyaan"
BEGITI begini:  Tutor membaca file X → tutor menjelaskan konsepnya
                → pembelajar menjelaskan balik → pembelajar berlatih
```

**Aturan:**

1. **Tutor membaca file referensi sendiri** (boleh tanpa izin, di workspace belajar xcode).
   Pembelajar tidak diarahkan membuka file materi.
2. **Setiap penjelasan tetap wajib menyebut sumbernya** (`fase-1/02` baris 91, dst.). Aturan
   anti-halusinasi `teach-system-design` tidak dilonggarkan — yang berubah hanya **siapa yang
   membaca**.
3. **Rujukan baris/heading hanya untuk tutor sendiri**, bukan instruksi ke pembelajar.
   Jangan pernah menulis "baca baris 9–60" kepada pembelajar.
4. **Penjelasan boleh detail dan panjang** (pembelajar meminta "sangat detail"), ASAL tetap
   **satu konsep per sesi**. Detail ≠ bercabang.
5. **Peran "BACA STATE" di anatomi sesi** tetap: tutor membaca `MISSION.md` + LR terakhir,
   lalu **merangkum posisinya kepada pembelajar** ("kamu di L1-F1, sesi 6; kemarin kamu
   memutuskan ARKAS = CP").
6. **Lihat `NOTES.md` di workspace pembelajar** — file itu yang menang kalau ada
   pertentangan.

**Konsekuensi yang harus disebut jujur ke pembelajar:** cara ini lebih lambat daripada
membaca sendiri, karena satu sesi dibatasi oleh satu penjelasan tutor.

## Protokol Penjelasan Bertingkat (WAJIB di kedua mode)

Diadaptasi dari `coding-tutor` + `gentle-teaching` (repo ini) — aturan #1:
**jangan panjar jawaban**. Mulai selalu dari level terendah yang belum dipahami:

```
Tingkat 0 — CEK DULU (sebelum mengajar apa pun)
  "Sebelum saya jelaskan — menurutmu apa yang terjadi kalau [situasi
   terkait konsep]?" → dengar dulu, baru naik tingkat.

Tingkat 1 — ANALOGI DUNIA NYATA (selalu pertama)
  Konsep dijelaskan TANPA jargon, tanpa kode, tanpa nama tool.
  Contoh konsep cache: "etalase warung — barang paling sering dibeli
  ditaruh di depan, tidak perlu ke gudang setiap ada pembeli."

Tingkat 2 — PRINSIP + ISTILAH FORMAL
  Baru sekarang kenalkan istilahnya (hit/miss, TTL, LRU) — sambungkan
  ke analogi: "TTL itu masa simpan barang di etalase sebelum
  dikembalikan ke gudang."

Tingkat 3 — KONKRIT + KODE/DIAGRAM KECIL
  Diagram ASCII sederhana ATAU potongan kode <15 baris. Bukan dump kode.
  Selalu sertakan: apa yang terjadi KALAU TANPA komponen ini.

Tingkat 4 — LATIHAN (pembelajar yang bekerja, bukan skill)
  Latihan mini <15 menit. Skill HANYA memeriksa hasil + bertanya balik
  "kenapa kamu pilih X?" — tidak mengerjakan untuk pembelajar.
```

Aturan eskalasi: naik 1 tingkat hanya setelah pembelajar menjawab/mencoba di
tingkat itu. Turun tingkat segera jika miskonsepsi terdeteksi — miskonsepsi
yang dikoreksi = pelajaran paling melekat, catat di LR §"miskonsepsi".

## MODE LEARN — Anatomi Sesi (1 jam, 1 konsep)

```
0-5'   BACA STATE (TUTOR yang membaca): buka MISSION.md + LR terakhir + NOTES.md,
       lalu RANGKUM posisi kepada pembelajar — jangan menyuruhnya membaca file
       ("kamu di L2-F4, minggu ke-2; kemarin kamu bisa jelaskan LRU")
5-15'  TINGKAT 0-2: cek pemahaman → analogi → istilah formal (dengan
       SITASI sumber dari RESOURCES.md — wajib, bukan opsional).
       TUTOR sudah membaca file sumbernya SEBELUM sesi; pembelajar tidak
15-30' TINGKAT 3: diagram/kode kecil + skenario "kalau tanpa ini"
30-45' TINGKAT 4: latihan mini — pembelajar kerjakan sendiri
45-55' PERIKSA + TANYA BALIK: "jelaskan balik dengan kata-mu",
       "kapan konsep ini justru PILIHAN SALAH?" ← trade-off thinking
55-60' TULIS LR: `/teach-system-design` §Langkah 4 — wajib, jangan tunda
```

**Pemilihan konsep:** tutor membaca `references/stage-guide.md` + file materi fase aktif
**sendiri**, lalu mengajar dari situ — jangan mengajar acaran. Konsep di luar fase aktif →
catat ke backlog MISSION.md.

## MODE BUILD-SIM — Simulasi Pipeline Bab 27

**Tujuan:** pembelajar merasakan KENAPA pipeline produksi ada. Karena itu
simulasi ini sengaja menjalankan tahap yang SAMA, versi ringan, dan
**memaksa lewat rasa sakitnya secara aman**: boleh gagal, gagal = materi.

### Aturan kanvas

- Proyek latihan hidup di `<workspace>/PRAKTIK/<nama-proyek>/` — DILARANG
  di repo produksi mana pun (kontaminasi = pelanggaran keras, Bab 27.9).
- Pipeline yang disimulasikan: Tahap 2–6 Bab 27 (27.3), versi ringan.
- Skill produksi yang TIDAK dipakai di simulasi: deploy gate penuh,
  security auditor penuh — versinya diganti checklist ringan di stage-guide.

### Alur mode (mengikuti ritel 27.3, disederhanakan)

```
SIM-1  CLARIFY     → /teach-clarifier Jenis B (3 pertanyaan) → problem brief
                     mini di PRAKTIK/<proyek>/BRIEF.md
SIM-2  VISUALIZE   → gambar layar utama (ASCII atau HTML statis) —
                     setuju desain DULU, baru pikir struktur (Bab 27.3 #5)
SIM-3  DESIGN      → back-of-envelope + data model + pilih stack DENGAN
                     mencatat trade-off di DECISIONS.md (format ADR Bab 7.4:
                     keputusan / alasan / dampak)
                     + WAJIB: baris "struktur data & algoritma utama + Big-O
                     operasi terpanas" (polanya dari /teach-dsa langkah 4)
SIM-4  PLAN        → pecah jadi 3-6 task; tiap task punya "selesai terlihat
                     seperti apa" (mini-DoD) di BLUEPRINT.md
SIM-5  BUILD       → satu task per putaran; bukti wajib: output test/run
                     ditempel, BUKAN klaim "sudah jalan" (Iron Law, Bab 12)
SIM-5b REVIEW-DSA  → disarankan sekali per proyek setelah task inti hijau:
                     `/dsa-review` — review bersama lensa DSA dengan
                     pertanyaan terpandu (maks 3 temuan; hasilnya ke
                     REVIEW-NOTES.md). Opsional, TAPI tersambung ke
                     SIM-7: temuan review jadi bahan retrospektif
SIM-6  VERIFY      → jalankan acceptance ringan: semua mini-DoD hijau?
                     UI-nya? screenshot bukti. Lambat? → `/teach-test-ladder`
SIM-7  RETROSPEKTIF→ "tahap mana yang kalau dilewati bikin masalah nyata
                     barusan?" ← INI tujuan utama simulasi; jawabannya
                     ditulis di LR + dikaitkan ke bab materinya
```

Aturan putaran gagal: maks 3 putaran per task; setelah itu skill wajib
menunjukkan polanya (debugging terpandu — lihat Anti-Pattern) dan mencatat
miskonsepsinya. Gagal di simulasi = murah; itulah gunanya simulasi.

### Kondisi WAJIB berhenti & kembali ke mode LEARN

- Pembelajar tidak bisa menjelaskan istilah yang baru dipakai di SIM-3 →
  berhenti build, jadwalkan lesson konsep itu dulu (konsep > kemajuan proyek)
- Kesalahan yang sama muncul 2× → itu bukan typo, itu gap konsep → mode LEARN

## Periksa Pemahaman Pembelajar (verifikasi, bukan formalitas)

Setiap sesi diakhiri 2 pertanyaan WAJIB (jawab dengan kata sendiri):
1. "Konsep/tool hari ini — kapan ia PILIHAN SALAH?" (trade-off)
2. "Kalau besok beban datanya 10x, bagian mana yang minta perhatian dulu?"
Jawaban kosong/tebakan → tingkat penjelasan turun, LR dicatat "belum nempel",
topik yang sama dijadwal ulang minggu depan.

## Anti-Pattern

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Dump kode 200 baris biar proyek cepat selesai | Kode <15 baris per penjelasan; sisanya dibangun pembelajar per task |
| Mengerjakan task pembelajar karena "sudah malam" | Waktu habis = catat posisi di LR, lanjut sesi berikut — kemajuan bukan milik satu sesi |
| Bilang "ini gampang kok" saat pembelajar stuck | "Ini bagian yang biasanya butuh waktu — mari kita perlambat" |
| Debug dengan langsung kasih fix | Protokol gentle-teaching: (1) apa yang diharapkan, (2) apa yang terjadi, (3) sudah coba apa, (4) mana yang paling dekat berhasil |
| Melanjutkan BUILD-SIM tanpa LR sesi lalu | Baca LR dulu; tanpa LR = mulai ulang penilaian posisi (boros waktu pembelajar) |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Build proyek NYATA produksi | Pakai skill ini | Pipeline Bab 27 penuh (`/scaffolder` → … → `/deploy-production-gate`) |
| Simulasi interview system design | Pakai mode BUILD-SIM | `/teach-case-study` (pewawancara + koreksi desain) |
| Rencanakan sprint proyek belajar jadi 10 task | Pakai skill ini | Simulasi sengaja 3–6 task; lebih besar = pembelajaran tenggelam |

## Next Step

- Sesi LEARN selesai → `/teach-system-design` (LR + jadwal berikutnya)
- SIM-1 selesai → lanjut SIM-2 … SIM-7 dalam sesi-sesi terpisah
- SIM-5 task inti hijau → `/dsa-review` (review bersama, opsional tapi disarankan)
- SIM-6 menemukan masalah performa → `/teach-test-ladder`
- SIM-7 selesai → `/teach-case-study` untuk membandingkan dengan arsitektur nyata

## Materi Reference (WAJIB)

- Ritel pipeline yang disimulasikan: `architecture-planner/MATERI-PECAHAN/27-Panduan-EndToEnd-Semua-Skill.md`
  §27.3 (Tahap 2–6), §27.4c (Task Gate & bootstrap — mini-DoD = versi ringannya)
- Kontrak file: Bab 6–7 (struktur folder, DECISIONS.MD/ADR); verifikasi: Bab 12
- Materi konsep per fase: `fase-1-arsitektur-dasar/` … `fase-4-deep-system-design/`
- Pola penjelasan bertingkat: `coding-tutor/SKILL.md` + `gentle-teaching/SKILL.md` (repo ini)

Kutip sumber + nomor babnya. Jika ragu: baca dulu, baru bertindak.
