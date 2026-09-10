# ⚡ Cheat-Sheet: Template Prompt Vibe Coding (CLI)

> **Kumpulan prompt siap pakai untuk Claude Code / OpenCode.**
> Copy-paste, isi bagian `[kurung siku]`, jalankan di CLI.

---

## 📋 DAFTAR ISI CEPAT

| # | Kebutuhan | Pergi ke |
|---|-----------|----------|
| 1 | Buat denah aplikasi | Bagian A |
| 2 | Setup proyek Next.js | Bagian B |
| 3 | Struktur folder | Bagian C |
| 4 | Buat komponen | Bagian D |
| 5 | State & alur data | Bagian E |
| 6 | Database + API CRUD | Bagian F |
| 7 | Evaluasi trade-off | Bagian G |
| 8 | Review kode | Bagian H |
| 9 | Belajar dari AI | Bagian I |
| 10 | Loop engineering penuh (brainstorm→PRD→UI→kode→tes) | Bagian J |
| 11 | Prompting engineering (teknik dasar) | Bagian K |
| 12 | Deploy ke VPS | Bagian L |

---

## 🎯 RITUAL PENTING SEBELUM SEMUA PROMPT

```text
Kamu adalah arsitek Next.js senior dan mentor pemula yang sabar.
Saya sedang belajar vibe coding. 

SEBELUM menulis kode apa pun, SELALU:
1. Jelaskan rencanamu singkat
2. Minta persetujuan saya
3. Baru tulis kode

Bahasa: Indonesia. Gaya: sederhana, analogi, tidak menggurui.
```

> Tempel "ritual" ini di awal sesi — sekali saja cukup, AI akan
> mengikutinya sepanjang sesi.

---

## A. BUAT DENAH APLIKASI

```text
Saya mau membuat aplikasi [NAMA].

<kebutuhan>
FUNGSI:
[Fitur 1]
[Fitur 2]
[Fitur 3]

DATA:
[Entitas 1: sifat-sifatnya]
[Entitas 2: sifat-sifatnya]

ALUR:
INPUT: [apa yang user lakukan]
PROSES: [apa yang terjadi]
OUTPUT: [apa yang user lihat]
</kebutuhan>

JANGAN langsung menulis kode. Buat denah dulu:
1. Komponen aplikasi yang dibutuhkan
2. Struktur folder
3. Tabel data
4. Alur data

Mintalah persetujuan saya sebelum lanjut.
```

---

## B. SETUP PROYEK NEXT.JS

```text
Buat proyek Next.js baru bernama [nama-proyek] di folder ini:
- TypeScript: YA | App Router: YA | ESLint: YA
- Tailwind CSS: YA | src directory: TIDAK

Setelah jadi, jelaskan satu per satu folder & file yang dibuat
dengan analogi sederhana. Lalu jalankan npm run dev dan beri tahu
cara membukanya di browser.

Pandu langkah demi langkah, saya pemula.
```

---

## C. RAPIKAN / JELASKAN STRUKTUR FOLDER

```text
Baca struktur folder proyek ini (jangan ubah apa pun).

1. Gambarkan pohon folder lengkap
2. Jelaskan fungsi tiap folder penting + analogi sederhana
3. Buatkan folder yang belum ada: components/ui/, components/features/, lib/
4. Buat 1 file contoh isi di masing-masing (dengan komentar)
```

---

## D. BUAT KOMPONEN

```text
Buat komponen [NamaKomponen] di components/[ui|features]/.

SPESIFIKASI:
- Fungsi: [apa yang dilakukan]
- Props: [nama data] (tipe: [string|number|boolean|array])
- Tampilan: [deskripsi]
- Style: Tailwind, bersih, modern
- TypeScript

CONTOH PENGGUNAAN:
<NamaKomponen [prop1]="..." [prop2]={...} />

- Tambahkan "use client" HANYA jika butuh interaksi
- Satu komponen satu tugas
- Beri komentar singkat untuk saya belajar
```

---

## E. STATE & ALUR DATA

```text
Buat fitur [fitur] di komponen [nama] menggunakan useState.

SPESIFIKASI:
- State yang dibutuhkan: [daftar state + tipe + nilai awal]
- Alur: INPUT: [...] PROSES: [...] OUTPUT: [...]
- State di komponen INDUK
- Data turun via props, event naik via function props

Setelah selesai, jelaskan dengan diagram teks siapa pegang state.
```

---

## F. DATABASE + API CRUD

```text
Setup SQLite + Prisma di proyek ini untuk entitas [entitas]:

1. Install prisma & @prisma/client, init prisma
2. Di schema.prisma atur datasource: provider = "sqlite", url = "file:./dev.db"
3. Buat model di schema.prisma:
   [tulis struktur data di sini — contoh:]
   model Item {
     id     Int    @id @default(autoincrement())
     nama   String
     harga  Int
   }
4. Jalankan migrasi (npx prisma migrate dev)
5. Buat lib/db.ts

Lalu buat API CRUD:
- app/api/items/route.ts      → GET (semua) & POST (tambah)
- app/api/items/[id]/route.ts → PATCH (ubah) & DELETE (hapus)
  (folder [id] = rute dinamis: berisi nomor id item)

Balikan JSON: { sukses: true, data: ... } / { sukses: false, pesan: "..." }
Setelah selesai beri 3 contoh uji curl.
```

---

## G. EVALUASI TRADE-OFF

```text
Saya harus memilih antara [opsi A] dan [opsi B] untuk [kebutuhan].

Bandingkan: kesulitan belajar, cocok untuk proyek kecil, cocok untuk
skala besar, biaya. Lalu rekomendasi untuk situasi saya:
[deskripsi aplikasi & skala].

INGAT: rekomendasikan yang SESEDERHANA yang cukup, bukan yang
paling canggih.
```

---

## H. REVIEW KODE

```text
Review proyek saya (app/, components/, lib/).

1. Arsitektur: apa yang rapi, apa yang bisa diperbaiki?
2. Bug potensial: validasi, state, error handling
3. UX: apa yang bikin bingung pengguna?
4. Prioritaskan: MUST FIX → SHOULD FIX → NICE TO HAVE

JANGAN langsung perbaiki. Lapor dulu, saya pilih.
```

---

## I. BELAJAR DARI AI (pemula)

```text
Saya pemula. Baca file [nama-file].

Jelaskan dengan bahasa sederhana:
1. Apa fungsi file ini secara keseluruhan?
2. Konsep apa yang ada di dalamnya (komponen, state, API)?
3. Gambarkan diagram teks alurnya
4. Istilah apa yang harus saya pelajari lebih dalam?
```

---

## J. LOOP ENGINEERING PENUH (Modul 19)

```text
Kita akan membangun [nama aplikasi] dengan loop engineering.

FASE 1 — Brainstorming: usulkan 10 ide → bantu saya pilih 1
FASE 2 — Planning: task list MUST/SHOULD/NICE + urutan kerja
FASE 3 — PRD: latar belakang, pengguna, fitur, data, alur,
         out of scope
FASE 4 — Desain UI: wireframe ASCII + deskripsi visual
FASE 5 — Implementasi: SATU task → tes → persetujuan → lanjut
FASE 6 — Testing: checklist manual + perbaikan bug

SETIAP FASE: jelaskan ringkas → tanya persetujuan → lanjut.
JANGAN menulis kode sebelum Fase 4 disetujui.
```

---

## K. PROMPTING ENGINEERING (Modul 21)

```text
[KONTEKS]
Saya [siapa], sedang [situasi], sudah paham [pengetahuan].

[TUGAS]
Tolong [apa yang harus dilakukan] dengan [kriteria].

[FORMAT]
Berikan dalam bentuk [tabel/JSON/list/langkah demi langkah].

[BATASAN]
Jangan [hal yang dihindari].

[ALASAN - opsional]
Saya butuh ini karena [alasan].
```

```xml
<persona>Kamu adalah [peran] yang [karakter].</persona>
<instructions>[Tugas utama]</instructions>
<reasoning>Sebelum menjawab, jelaskan langkah demi langkah.</reasoning>
<examples><example><input>...</input><output>...</output></example></examples>
<input>[Data yang mau diproses]</input>
<output_format>[Format output]</output_format>
<verification>Periksa kembali jawabanmu sebelum mengirim.</verification>
```

> 💡 Teknik lengkap (persona, CoT, few-shot, self-correction,
> chaining): buka `21-prompting-engineering.md`

---

## L. DEPLOY KE VPS (Modul 18)

```text
Saya mau deploy aplikasi [nama] ke VPS (Ubuntu, IP: [IP]).

Pandu langkah demi langkah:
1. Firewall UFW: buka 22, 80, 443 → aktifkan
2. Install kebutuhan: [Node.js / PHP 8.2 + Composer]
3. Clone dari GitHub: [URL repo]
4. Install deps + build
5. Jalankan dengan [PM2 / php artisan serve]
6. Konfigurasi Nginx (reverse proxy → port internal)
7. Pasang SSL gratis: sudo certbot --nginx

Jelaskan tiap perintah singkat. Jangan jalankan semua sekaligus.
```

---

## 💡 TIPS PENUTUP

```text
1. Selalu mulai sesi dengan "ritual" (Bagian atas cheat-sheet)
2. Denah dulu → setujui → kode → tes → lanjut
3. Pecah tugas besar jadi langkah kecil
4. Tempel error ke AI: "Saya dapat error ini: [tempel]"
5. Minta penjelasan setelah kode jadi — jangan cuma copas
6. Simpan prompt yang sering dipakai → jadikan skill (lihat
   panduan-prinsip-claude-code/01-prinsip-1-prompt-skills-bukan-claude.md)
```

---

---

**📂 Kembali ke: `00-panduan-fase.md` | Modul baru: `16-networking.md`, `17-api.md`, `18-vps-server.md`, `19-loop-engineering.md`, `20-proyek-akhir.md`, `21-prompting-engineering.md`, `22-arsitektur-desain-sistem.md`, `23-arsitektur-integrasi-ai.md`**
