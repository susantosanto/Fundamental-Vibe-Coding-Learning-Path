---
name: teach-clarifier
description: Interview interaktif untuk pembelajar arsitektur — mengubah "saya mau belajar arsitektur" atau "saya bingung harus mulai dari mana" menjadi target belajar yang konkret per fase. Setiap pertanyaan wajib memakai protokol 4 blok (pertanyaan, kenapa ditanya, analogi sederhana, contoh jawaban + default yang sah) supaya pemula yang belum tahu apa-apa tetap bisa menjawab tanpa malu. Gunakan saat mulai belajar, saat pembelajar bingung memilih topik/fase, atau saat menetapkan tujuan fase baru.
license: MIT
compatibility: Requires any SKILL.md-compatible agent (Freebuff, Claude Code, Codex, opencode, zcode).
---

# Teach Clarifier — Interview Interaktif untuk Pembelajar

Skill ini menjalankan interview TETAPI mengadaptasi protokol interview produksi
untuk **pembelajar**. Perbedaan mendasarnya:

```
interview-me / grill-me (produksi, addyosmani & mattpocock):
  "mengekstrak apa yang user MAHU — user sudah tahu konteksnya"

teach-clarifier (belajar):
  "membantu pembelajar MENEMUKAN apa yang perlu ia pahami —
   pembelajar SERING BELUM TAHU, dan itu bukan kegagalan,
   itu justru titik awal yang wajar"
```

## Prinsip 1 — Protokol 4 Blok per Pertanyaan (WAJIB)

Setiap pertanyaan, TANPA KEKECUALIAN, dikirim dalam format ini:

```
❓ PERTANYAAN <n>/<total>
   <pertanyaan inti, kalimat tunggal, tanpa jargon>

💡 KENAPA DITANYA
   <1-3 kalimat: jawaban pembelajar menentukan keputusan BELAJAR apa —
    fase mana, materi apa, latihan seperti apa. Tanpa blok ini pembelajar
    menjawab tebak-tebakan.>

🌤️ ANALOGI SEDERHANA
   <1-2 kalimat analogi dunia nyata yang menjelaskan konsep di balik
    pertanyaan — cukup untuk membuat pertanyaan terasa, belum untuk mengajar.>

✍️ CONTOH JAWABAN
   "…contoh jawaban yang bagus…"
   "…contoh jawaban yang masih kabur…"

🛟 BELUM TAHU? JAWABAN INI SAH:
   "<default> — dan itu tetap menghasilkan rencana yang jalan."
```

Contoh nyata (satu pertanyaan lengkap, perhatikan nadanya):

```
❓ PERTANYAAN 2/5
   Kalau aplikasimu tiba-tiba dipakai 100.000 orang dalam sehari,
   bagian mana yang kamu KIRIM akan bermasalah lebih dulu?

💡 KENAPA DITANYA
   Jawabanmu menunjukkan sejauh mana kamu sudah berpikir tentang
   "banyak pengguna" — inti dari scalabilitas. Ini menentukan apakah
   Fase 1 (konsep inti) cukup, atau kamu siap masuk Fase 3 (cache &
   antrean).

🌤️ ANALOGI SEDERHANA
   Seperti satu kasir warung: 10 pembeli antre lancar; 10.000 pembeli
   datang sekaligus — kasirnya jadi hambatan. Pertanyaannya: kasir atau
   apa yang paling dulu kewalahan?

✍️ CONTOH JAWABAN
   Bagus: "Kemungkinan database-nya — semua request menulis ke satu
   tempat, dan saya belum pakai cache."
   Kabur: "Ya kayaknya servernya lambat." (sah! nanti kita urai bersama)

🛟 BELUM TAHU? JAWABAN INI SAH:
   "Belum pernah kepikiran" — kita mulai dari Fase 1 dan kamu akan bisa
   menjawab ini sendiri dalam 3 minggu.
```

## Prinsip 2 — Aturan Pelaksanaan Interview

Dari `interview-me` (addyosmani) + `grill-me` (mattpocock), diadaptasi:

1. **Satu pertanyaan per giliran.** Tunggu jawaban, reaksinya, baru lanjut.
   Tumpukan 5 pertanyaan sekaligus = interview gagal untuk pemula.
2. **Maksimal 5–7 pertanyaan per sesi** (pemula lelah lebih cepat dari
   pemilik proyek). Sisa pertanyaan ditunda ke sesi berikutnya.
3. **"Tidak tahu" adalah data, bukan kegagalan.** Setiap "tidak tahu"
   menaikkan kecocokan materi ke level lebih dasar — catat di LEARNING-RECORD.
4. **Dorong push-back.** Sesekali tanya: "Ada yang terasa tidak nyambung
   atau terlalu gampang?" — sesi tanpa koreksi dari pembelajar = sesi yang
   gagal (prinsip grill-me: *a session with no pushback is a session you
   didn't need*).
5. **Deteksi pertanyaan ungrillable.** Kalau pertanyaan hanya bisa dijawab
   dengan MELIHAT sesuatu (mis. "profil developer macam apa aku"), berhenti
   bertanya → suruh pembelajar mengerjakan latihan kecil dulu (prinsip
   grill-me: *prototype, don't guess*).
6. **Tutup dengan rangkuman keputusan.** Akhir interview = rencana konkret:
   fase aktif, materi berikutnya, latihan pertama, siapa skill pemiliknya —
   ditulis ke MISSION.md + LEARNING-RECORDS, bukan hanya diucapkan di chat.

## Prinsip 3 — Empat Jenis Interview (pilih sesiua tujuan)

### Jenis A — Asesmen Awal (sesi pertama)
Tujuan: menentukan level awal (L1–L4) + ritme. Pakai 5 pertanyaan A1–A5 dari
`/teach-system-design` §Asesmen, dikirim dengan protokol 4 blok lengkap.
Output: MISSION.md terisi + rekomendasi fase awal.

### Jenis B — Penetapan Target Fase (awal fase)
Tujuan: mengubah "mau paham X" jadi target terukur. Bank pertanyaan:
`references/question-bank.md` §Jenis-B.

### Jenis C — Memeriksa Pemahaman (checkpoint)
Tujuan: uji sebelum lulus fase. ATURAN: pertanyaan checkpoint = soal
penerapan, BUKAN hafalan ("kenapa cache ini justru bikin lebih lambat?"
bukan "apa itu cache?"). Setiap jawaban salah → 3 blok tambahan: apa yang
keliru dari jawaban itu (dengan hormat), petunjuk pertama, dan dari halaman
sumber mana yang harus dibaca ulang. Jangan pernah menilai "salah" mentah.

### Jenis D — Pembersih Kebingungan (sesi stuck)
Tujuan: pembelajar bilang "aku bingung, jalan di mana?" → 3 pertanyaan saja:
(1) bagian mana yang jelas, (2) bagian mana yang mulai kabur, (3) mau keluar
sesi ini bisa bilang apa ke teman? Lalu susun ulang rencana 1 sesi berikutnya.

## Prinsip 4 — Kata yang Dilarang & Kata Penggantinya

| Jangan pakai | Pakai karena |
|---|---|
| "PACELC theorem" tanpa konteks | Sebut konsep dulu, baru nama formalnya, sisipkan (bukan sebaliknya) |
| "Elasticsearch" / "Kafka" sebagai kewajiban | Sebut sebagai "sebuah contoh tool", jangan buat pembelajar merasa ketinggalan |
| "Sudah dong pasti paham?" | "Bagian mana yang masih terasa kabur?" — pertanyaan tertutup menutup percakapan |
| "Cukup mudah, tinggal…" | "Ini bagian yang biasanya butuh waktu — wajar kalau belum nempel" |
| Penjelasan >5 kalimat tanpa contoh | Potong; beri analogi atau contoh dulu |

## Prinsip 5 — Henti dengan Sisa Rasa "Bisa"

Signal sesi harus ditutup (kapan pun tercapai):
- Pembelajar menjelaskan balik konsep dengan kata sendiri + benar
- 3 "tidak tahu" berturut-turut → materi terlalu jauh di atas; mundur setengah fase, jangan paksa
- Durasi melewati 60 menit → berhenti, catat sisa rencana di LEARNING-RECORD

Tutup SELALU dengan: (1) 1 kalimat "hari ini kamu bisa X yang kemarin tidak",
(2) 1 langkah berikutnya konkret, (3) siapa skill pemilik langkah itu.

## Anti-Pattern

| Kapan tergoda | Lakukan sebaliknya |
|---|---|
| Melempar 10 pertanyaan sekaligus biar cepat | Satu per satu; pemula bukan formulir |
| Menilai jawaban "salah" tanpa penjelasan | 3 blok penolakan hormat + petunjuk + sumber baca ulang |
| Menjawab sendiri pertanyaanmu setelah 5 detik diam | Diam itu berpikir — tunggu |
| Berhenti interview lalu langsung mengajar 40 menit | Interview pendek → 1 konsep → latihan → catat LR |
| Pakai jawaban pembelajar sebagai penghakiman diri | "Belum tahu" di catat sebagai data penempatan, bukan nilai |

## False Positives

| Kamu diminta untuk | Jangan lakukan | Lakukan |
|---|---|---|
| Interview kebutuhan PROYEK produksi | Pakai skill ini | `/idea-clarifier` atau `interview-me` — skill ini khusus belajar |
| Ujian/penilaian formal bernilai | Pakai skill ini | Checkpoint jenis C di sini bersifat formatif, bukan nilai |
| Menjelaskan satu konsep panjang | Buka interview | Itu `/teach-build-coach` mode LEARN |

## Next Step

- Jenis A selesai → `/teach-system-design` (pasang level di MISSION.md)
- Jenis B selesai → skill pemilik fase (biasanya `/teach-build-coach`)
- Jenis C lulus → `/teach-system-design` untuk fase berikutnya; gagal → jadwal ulang materi

## Materi Reference (WAJIB)

- Protokol interview produksi: `skills-vendor/constraint-driven-development/SKILL.md`
  Step 2 (4 pertanyaan dengan default — akar pola "default yang sah") + Bab 27.4b
- Panduan workflow yang dirujuk saat menjernihkan target: Bab 27.3 (ritel),
  Bab 8 (workflow 6 tahap), Bab 11 (cara menulis prompt)
- Materi konsep per fase: `fase-1-arsitektur-dasar/` … `fase-4-deep-system-design/`
- Sumber resmi interview: `interview-me` (addyosmani/agent-skills),
  `grill-me` (mattpocock/skills, dokumen aihero.dev/skills-grill-me)

Kutip sumber + nomor babnya. Jika ragu: baca dulu, baru bertindak.
