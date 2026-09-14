# MEMORY.md — Catatan Proyek Jangka Panjang

> Konvensi dan preferensi yang berlaku untuk proyek `fundamental-vibe-coding`.

---

## Aturan kerja dengan user (WAJIB)

### 1. TANYA DULU sebelum membangun materi belajar

**Koreksi user, 14 Sep 2026** (setelah saya membuat 19 file tanpa bertanya):

> *"haduhhhh saya tidak paham dengan alur belajar anda, dan kenapa anda tidak bertanya dulu
> bahasa pemograman apa yang saya mau pelajari !!!!"*

**Yang saya lakukan salah:** membangun folder `fase-0-peta-belajar/` lengkap (19 file, 8.441 baris)
— termasuk jalur belajar, diagnostik, tiga persona — **tanpa pernah menanyakan**:

- bahasa pemrograman apa yang mau dipelajari
- level user saat ini
- tujuan akhirnya apa

Akibatnya: jalur yang saya tulis menyuruh "pilih Python **atau** JavaScript" padahal saya tidak
tahu mana yang user mau. Seluruh struktur jadi tidak bisa dipakai.

**Aturan yang harus dipatuhi mulai sekarang:**

1. **Sebelum membuat materi belajar / kurikulum / jalur belajar — TANYA dulu minimal 3 hal:**
   bahasa pemrograman, level saat ini, tujuan akhir.
2. **Jangan membuat struktur besar sebelum tahu konteksnya.** Kalau user belum menjawab,
   jangan menebak lalu membangun.
3. **Sederhana dulu.** User mengeluh alurnya tidak dipahami — 19 file dengan router 3 pertanyaan,
   diagnostik 12 soal, dan 4 jalur (A/B/C/D) itu **terlalu banyak**. Mulai dari SATU halaman
   sederhana, baru tambah kalau diminta.
4. **Jangan menambah struktur yang tidak diminta.** Saya menambah progress tracker, persona,
   tabel menit-per-menit — tidak ada yang meminta.

**Pelajaran umumnya:** kelengkapan bukan pengganti kejelasan. Materi yang bisa dipakai lebih
berharga daripada materi yang lengkap.

### 5. Selalu sebutkan MULAI dan SELESAI secara eksplisit

**Koreksi user, 14 Sep 2026** (setelah saya memberi `MULAI-JS.md`):

> *"jadi dari mana ke mana hingga mana yang harus saya pahami !!!!! saya mulai bingung!!"*

Meskipun rencananya sudah 5 langkah berurutan, user masih bingung karena saya **tidak pernah
menyebutkan dengan tegas: mulai di sini, selesai di sini.** User harus menyimpulkan sendiri
titik awal dan akhirnya.

**Aturan:**

- Setiap kali memberi rencana/kurikulum, awali dengan **"MULAI: ___"** dan **"SELESAI: ___"**.
- Definisikan "selesai" sebagai **kriteria yang bisa diperiksa**, bukan tanggal. Contoh:
  "selesai kalau bisa menjawab 5 pertanyaan ini tanpa membuka catatan".
- Kalau user bertanya lagi "dari mana ke mana" → jawabannya bukan menambah penjelasan,
  tapi **memperpendek**. Respons yang lebih panjang akan memperburuk kebingungan.

### 6. Audit materi terhadap TUJUAN AKHIR, bukan hanya terhadap topiknya

**Koreksi user, 14 Sep 2026** (setelah `belajar-javascript/` selesai):

> *"pastikan materi fundamental javascript tersebut ... menjadikan modal untuk saya debuging
> di setiap project react ... research mendalam dan cek kembali oleh anda"*

Saat diaudit, `belajar-javascript/` **tidak mengajarkan closure sama sekali** — padahal itu
akar dari *stale closure*, bug React nomor satu, dan konsep #10 di daftar prasyarat React.
Materinya rapi, tapi tidak cukup untuk tujuan yang user sebutkan.

**Aturan:**

1. Sebelum menyatakan materi "selesai", tulis dulu **daftar konsep yang dibutuhkan untuk
   mencapai tujuan akhir user** — diambil dari riset, bukan dari ingatan model.
2. Cocokkan daftar itu dengan isi materi. **Celah yang ketemu harus ditambal**, bukan
   hanya dilaporkan.
3. Materi yang "lengkap secara topik" tapi tidak bisa dipakai untuk tujuan user tetap
   dianggap belum selesai.

**Celah yang sudah terbukti penting untuk React** (jangan hilang lagi):

| Konsep | Kenapa | Ada di |
|---|---|---|
| Referensi vs nilai | React deteksi perubahan lewat alamat, bukan isi | `01` |
| Method yang memutasi (`push`/`sort`/`splice`) | Layar tidak render ulang walau data berubah | `01` |
| **Closure / stale closure** | Nilai di layar ketinggalan, polling selalu data lama | `02` |
| Baca stack trace | `undefined.map is not a function` | `03` |
| `forEach` + async, `await` hilang | Loading tidak pernah selesai | `04` |

---

## Konvensi proyek

- Semua materi ditulis dalam **Bahasa Indonesia**.
- Struktur file fase: `NN-nama-file.md` dengan `00-panduan-fase.md` sebagai pembuka.
- Struktur isi materi: `📖 TEORI → 🎯 CONTOH NYATA → 💡 PRAKTIK → ✅ CHECKLIST → 🔗 REFERENSI`.
- Materi di `architecture-planner/MATERI-PECAHAN/` adalah **metode inti** repo ini
  (Architect-Builder Method) — jangan diduplikasi di tempat lain.
- `skills-vendor/` disimpan **verbatim** (aturan 27.4b). Override dicatat di
  `skills-vendor/OVERRIDES.md`, bukan dengan mengedit file vendor.

## Preferensi user

- Memakai **model gratis dari beberapa provider** — tidak ada jaminan akses model tier atas.
  Agent **DILARANG memilih model sendiri**; manusia yang menentukan (lihat `MODEL-POLICY.md`).
- Tidak suka fallback/default otomatis untuk nilai yang seharusnya ditentukan manusia.
  Kalau nilai belum ada → STOP dan tanya.
