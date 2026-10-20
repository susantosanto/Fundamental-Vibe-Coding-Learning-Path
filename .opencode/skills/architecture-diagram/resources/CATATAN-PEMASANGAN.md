# Catatan Pemasangan — `architecture-diagram`

> Berkas ini **bukan** bagian dari skill asli. Ditambahkan saat pemasangan.

## Asal

| | |
|---|---|
| Repo | `https://github.com/Cocoon-AI/architecture-diagram-generator` |
| Versi | 1.1 |
| Lisensi | **MIT** — bebas dipakai, diubah, disebar (lihat `../LICENSE`) |
| Diambil | **7 Okt 2026** dari branch `main` |
| Penulis | Cocoon AI · hello@cocoon-ai.com |

## Yang diubah

**Tidak ada.** Kedua berkas disalin **verbatim**:

| Berkas | Baris | Byte | md5 |
|---|---|---|---|
| `../SKILL.md` | 177 | 8.383 | `c35024154ce83a9da1ebb9eec0cf1bbb` |
| `template.html` | 434 | 17.492 | `98a585ac84e7acddcc48fd621eda149d` |

Kalau mau memperbarui dari upstream, unduh ulang lalu bandingkan md5 di atas.
Jangan edit `SKILL.md` — kalau perlu perubahan perilaku, catat di sini dulu.

## Status: DI LUAR workflow Bab 27

Skill ini dipasang **berdiri sendiri**, **bukan** bagian dari pipeline
`scaffolder → … → state-keeper` (Bab 27). Tidak ada tahap yang memanggilnya otomatis.

**Kenapa tidak masuk workflow:** slot visualisasi arsitektur di Tahap 3.5 dan Tahap 4
**sudah diisi `/birdview`**, dan birdview lebih kuat — ia *evidence-linked*
(`architecture.json` dari `module-planner`, divalidasi `validate.mjs`, revisi terikat).
Skill ini menggambar dari **prosa**, tanpa validasi dan tanpa kaitan ke sumber.
Alasan lengkap: `riset-skill-diagram-arsitektur.md` §7 di root repo.

## 🔴 Satu aturan yang wajib dipegang

**Diagram yang dihasilkan adalah ILUSTRASI, bukan sumber kebenaran.**

- Sumber kebenaran tetap `architecture.json`, `BLUEPRINT.md`, `CONSTRAINTS.md`.
- Kalau diagram berbeda dari `architecture.json` → **yang salah diagramnya**.
- **Jangan** jadikan diagram sebagai lampiran `ACCEPTANCE` atau bukti verifikasi.
- **Jangan** ganti `/birdview` dengan diagram ini.
- Kalau disimpan di folder proyek, **beri label** di dalam HTML-nya bahwa itu ilustrasi.

Tanpa aturan ini, diagram yang rapi dan berwarna akan dipercaya sebagai kebenaran
arsitektur beberapa bulan kemudian — padahal ia hanya menafsirkan kalimat.

## Di mana berguna

1. **27.8 Jalur Adopsi langkah 3c** — proyek existing belum punya `architecture.json`,
   jadi birdview belum bisa render. Skill ini hanya butuh deskripsi.
2. **Dokumentasi rilis / `README.md`** — gambar arsitektur untuk orang luar.
3. **Presentasi ke stakeholder non-teknis.**
4. **Bab 28 / Mode Belajar** — sebagai **korpus latihan "klaim vs kenyataan"**: diagram
   yang terlihat sangat kredibel dari deskripsi yang sengaja dibuat salah. Bahan yang
   **diperiksa** pelajar, bukan alat yang mengerjakan.

## Catatan teknis

- Butuh internet: Google Fonts + 2 CDN (`html2canvas@1.4.1`, `jspdf@2.5.2`) — keduanya
  **dipin dengan SRI**. Offline: diagram tetap tampil, tombol ekspor mati.
- Jangan pakai SVG `<foreignObject>` — `html2canvas` merendernya tidak konsisten.
- Wajib pertahankan `id="report-container"` di `<div class="container">` — itu yang
  ditangkap saat ekspor. Kalau dihapus, tombol ekspor rusak **tanpa error**.
