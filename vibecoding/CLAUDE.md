# CLAUDE.md — Panduan Agen AI (Terjemahan)

> **Sumber asli:** https://github.com/cpjet64/vibecoding/blob/main/CLAUDE.md

> 📌 **CLAUDE.md itu apa?** Di repositori asli, file ini dipakai sebagai "instruksi kerja" untuk asisten AI (misalnya Claude Code) yang membantu mengurus repositori. Isinya memberi tahu AI: adakah perintah build/test di sini, gaya penulisan apa yang harus diikuti, dan bagaimana struktur repositorinya. Karena repositori ini murni dokumentasi, isinya juga murni soal cara menulis dokumentasi yang baik.

## Perintah Build & Test

- Tidak ada perintah build/test/lint yang teridentifikasi di repositori dokumentasi ini.
- Kontennya fokus pada panduan tertulis, bukan kode yang bisa dijalankan.

> 💡 **Buat yang masih baru:** *Build* = proses mengubah kode jadi aplikasi yang bisa dijalankan. *Test* = menjalankan program untuk memastikan semuanya berfungsi. *Lint* = pemeriksaan otomatis untuk menemukan kesalahan gaya atau kesalahan kecil dalam kode. Repo ini tidak punya ketiganya karena isinya cuma file markdown (dokumen).

## Gaya Kode & Pedoman Kontribusi

- Fork repositori: `git checkout -b fitur/nama`
- Commit perubahan: `git commit -m "Deskripsi"`
- Push branch: `git push origin fitur/nama`
- Buka Pull Request

> 💡 **Buat yang masih baru:** Ini alur kontribusi standar GitHub. *Fork* = menyalin repositori orang lain ke akunmu. *Branch* = cabang kerja terpisah supaya perubahanmu tidak langsung mengganggu kode utama. *Commit* = menyimpan "titik waktu" perubahan beserta pesan penjelas. *Pull Request* = meminta pemilik repo asli menggabungkan perubahanmu.

## Struktur Repositori

- Berisi panduan tentang praktik coding dan dokumentasi sistem.
- Fokus pada **sisi manusiawi pemrograman** (keadaan *flow*, desain lingkungan kerja, psikologi).
- Semua file berformat Markdown (.md).

> 💡 **Buat yang masih baru:** *Markdown* adalah format teks sederhana yang bisa diubah jadi dokumen berformat (judul, tebal, daftar, tabel) hanya dengan simbol ringan seperti `#`, `**`, `-`. Ini format standar untuk dokumentasi di GitHub.

## Pedoman Konten

- Tulis dengan nada yang suportif dan konstruktif.
- Sertakan contoh praktis dan penerapan di dunia nyata.
- Jaga konsistensi format markdown di semua dokumen.
- Fokus pada akurasi teknis DAN sisi manusiawi dari coding.
- Ikuti struktur dokumen yang sudah ada (header, bagian).
- Hubungkan konten baru dengan filosofi "VibeCoding".

---

## Intinya buat pemula

File ini memberi tahu AI (atau kontributor manusia) tiga hal:

1. **Jangan cari perintah build** — repo ini cuma berisi tulisan, bukan kode.
2. **Ikuti alur kontribusi GitHub standar** (fork → branch → commit → push → PR).
3. **Ikuti gaya penulisan VibeCoding** — nada suportif, banyak contoh, dan selalu hubungkan dengan filosofi "vibe".
