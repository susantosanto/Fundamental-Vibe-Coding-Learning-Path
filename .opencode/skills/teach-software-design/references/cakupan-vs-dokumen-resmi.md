# Cakupan vs Sumber Resmi — apakah materi ini selengkap sumber aslinya?

> Referensi untuk skill `teach-software-design`. **Tutor membaca file ini sendiri.**
>
> **Dibuat:** 28 September 2026 · **Audit dilakukan:** 28 September 2026
> **Kerangka asal:** `teach-tailwindcss/references/cakupan-vs-dokumen-resmi.md`

---

## 1. Kenapa "selengkap sumber resmi" bukan target yang benar

Pertanyaan yang wajar: *"apakah materinya sudah selengkap buku/paper/dokumentasi aslinya?"*

Jawabannya: **tidak, dan memang tidak boleh.**

| | Sumber resmi | Kurikulum (skill ini) |
|---|---|---|
| Tujuan | **Referensi** — untuk dipakai saat sudah tahu apa yang dicari | **Kurikulum** — berurutan, untuk orang yang belum tahu apa pun |
| Ukuran | GoF: **23 pola**. Martin 2000: **34 halaman**. MDN: **ribuan halaman** | 18 unit, 4 gerbang |
| Bentuk | Katalog / rujukan lengkap | **Urutan kemampuan**, bukan urutan topik |
| Kalau tidak lengkap | **Cacat** — ada yang tidak bisa ditemukan | **Bukan cacat** — ia sengaja memilih |
| Yang penting | Kelengkapan | **Bisa dipakai** |

Kurikulum yang "lengkap" adalah kurikulum yang **tidak selesai dibaca**. Ini pengalaman
langsung di repo ini: `fase-0-peta-belajar/` pernah dibangun **19 file** dengan router,
diagnostik, dan empat jalur — dan hasilnya **tidak bisa dipakai**.

> **Prinsipnya:** kelengkapan bukan pengganti kejelasan.

Maka file ini melakukan tiga hal:

1. **Mengaudit** — memeriksa sumber resminya **satu per satu**, bukan dari ingatan
2. **Menyebut celah nyata** — dan **menambalnya**, bukan hanya melaporkannya
3. **Menyatakan apa yang sengaja dilewati** — beserta alasannya, supaya keputusan itu
   bisa dibantah

---

## 2. Audit 1 — Martin (2000), *Design Principles and Design Patterns*

**Status: ✅ diunduh & dibaca penuh.**

| | |
|---|---|
| Judul | *Design Principles and Design Patterns* |
| Penulis | Robert C. Martin |
| Tahun | 2000 |
| Halaman | **34** |
| Teks diekstrak | 54.810 karakter |
| URL | `staff.cs.utu.fi/~jounsmed/doos_06/material/DesignPrinciplesAndPatterns.pdf` |
| Hak cipta di dokumen | `Copyright (c) 2000 by Robert C. Martin` |

### 🔴 Temuan yang membatalkan asumsi umum

**Paper ini TIDAK memuat SRP, dan TIDAK memuat akronim "SOLID".**

| Prinsip | Kemunculan | Definisi verbatim di paper |
|---|---|---|
| **OCP** | **17×** | *"A module should be open for extension but closed for modification."* |
| **LSP** | **13×** | *"Subclasses should be substitutable for their base classes."* |
| **DIP** | **13×** | *"Depend upon Abstractions. Do not depend upon concretions."* |
| **ISP** | **6×** | *"Many client specific interfaces are better than one general purpose interface"* |
| **SRP** | **0×** | pencarian `"Single Responsibility"` → **0 hasil** |
| **`"Single"`** | **0×** | **0 hasil** |
| **akronim `"SOLID"`** | **0×** | tidak muncul sekali pun di 34 halaman |

**Urutan sejarah yang benar (jangan dibalik):**

1. **2000** — Martin menulis paper berisi **4 prinsip** (OCP, LSP, ISP, DIP).
2. **Akhir 1990-an** — Martin menyusun SRP. Dalam blog resminya:
   > *"In the late 1990s I tried to consolidate these notions into a principle, which I
   > called: The Single Responsibility Principle. (I have this vague feeling that I stole
   > the name of this principle from Bertrand Meyer, but I have not been able to confirm
   > that.)"*
   > — `blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html` ✅ dibaca
3. **Setelahnya** — **Michael Feathers** mengusulkan akronim **SOLID**
   ⚠️ **sumber sekunder, belum diverifikasi ke primer.**

> **Konsekuensi:** skill ini **tidak** menulis "SOLID diperkenalkan Martin 2000".
> Yang benar: **"empat prinsip dari paper 2000; SRP menyusul; akronim SOLID bukan dari
> Martin."** Lihat `peta-unit.md` Bagian 1 (peringatan sebelum Unit 4).

### Yang diambil dari paper ini

| Diambil | Unit |
|---|---|
| **4 gejala desain membusuk** — rigidity · fragility · immobility · viscosity | **1, 2, 15** |
| OCP | 5 |
| LSP · DIP | 6 |
| ISP | 7 |
| *viscosity* sebagai dasar "kenapa *jalan kok* bukan alasan" | 15 |

---

## 3. Audit 2 — Katalog pola desain

**Status: ✅ dibaca per halaman · ⚠️ buku GoF-nya TIDAK dibaca.**

| Sumber | Jenis | Status |
|---|---|---|
| Gamma, Helm, Johnson, Vlissides (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley · ISBN 0201633612 | **sumber primer (GoF)** | ✅ **keberadaan terverifikasi** — 23 pola, terbit 31 Okt 1994 · ⚠️ **isi buku tidak dibaca** |
| `refactoring.guru/design-patterns/*` | katalog + penjelasan modern | ✅ dibaca per pola |

### Intent verbatim dari katalog

| Pola | Klasifikasi | Intent | Juga dikenal |
|---|---|---|---|
| **Factory Method** | **Creational** | *"provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created."* | Virtual Constructor |
| **Decorator** | **Structural** | *"lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors."* | Wrapper |
| **Singleton** | **Creational** | *"lets you ensure that a class has only one instance, while providing a global access point to this instance."* | — |
| **Observer** | **Behavioral** | *"lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing."* | Event-Subscriber, Listener |

### Kritik Singleton — bahan ajar terbaik yang ditemukan

Verbatim dari katalog yang sama:
> *"Violates the Single Responsibility Principle. The pattern solves two problems at the
> time."*
> *"The pattern requires special treatment in a multithreaded environment so that multiple
> threads won't create a singleton object several times."*
> *"It may be difficult to unit test the client code of the Singleton... Or just don't
> write the tests. Or don't use the Singleton pattern."*

> **Kenapa ini berharga:** kalimat *"atau jangan pakai Singleton"* datang dari
> **katalognya sendiri**. Pembelajar mengira katalog pola = rekomendasi. Bahan ini
> membuktikan sebaliknya tanpa perlu berdebat.

### ⚠️ Batas kejujuran GoF

Buku GoF **tidak bisa saya baca** (berhak cipta, tidak ada versi daring resmi).
Yang saya verifikasi: **keberadaan, penerbit, ISBN, tanggal terbit, jumlah pola (23)**.
**Bukan isinya.**

**Aturan untuk materi:** kalau mengutip GoF, sebut **buku**-nya — **jangan** mengaku
mengutip halaman tertentu.

### Sengaja dilewati dari 23 pola GoF

**19 dari 23 pola tidak diajarkan.** Yang diambil hanya **4**:

| Diambil | Kenapa |
|---|---|
| Factory Method | Muncul paling sering di kode AI; menghubungkan langsung ke OCP (Unit 5) |
| Decorator | Memperlihatkan batas `extends` — penghubung ke komposisi |
| Singleton | **Pola favorit AI** dan **paling sering salah** — pelajaran terbaik |
| Observer | Sumber bug "listener bocor" yang nyata di kode AI |

**Yang dilewati** (Abstract Factory, Builder, Prototype, Adapter, Bridge, Composite,
Facade, Flyweight, Proxy, Chain of Responsibility, Command, Interpreter, Iterator,
Mediator, Memento, State, Strategy, Template Method, Visitor).

**Kenapa dilewati:** 4 pola yang diambil sudah cukup untuk melatih **cara membaca pola**.
Menambah 19 lagi = **menghafal katalog**, bukan belajar menilai desain. Kalau pembelajar
butuh pola lain nanti, ia sudah punya **kemampuan membacanya** — itu yang diajarkan.

---

## 4. Audit 3 — MDN, Node.js docs, Python docs

**Status: ✅ dibaca.**

### MDN

| Halaman | Dipakai di | Status |
|---|---|---|
| *JavaScript execution model* | Unit 9, 10 | ✅ dibaca |
| `Object.freeze()` | Unit 11 | ✅ dibaca |
| *Using server-sent events* | Unit 14 | ✅ dibaca |
| *WebSockets API* | Unit 14 | ⏳ **belum dibaca** |

**Verbatim yang dipakai** — semua sudah dikutip di `peta-unit.md`.

**⚠️ Celah: WebSocket belum diambil.** Perbandingan SSE vs WebSocket **masih satu sisi**.
Unit 14 mengajarkan SSE dengan batasnya, tapi tidak bisa membandingkan secara utuh.

### Node.js Official Docs

| Halaman | Dipakai di | Status |
|---|---|---|
| `node:worker_threads` | Unit 9 | ✅ dibaca |
| `node:test` | Unit 11 | ✅ dibaca **+ diuji jalan** |

**⚠️ Temuan penting:** dokumentasi Node.js **tidak memuat** pernyataan
*"Node.js is single-threaded"* — dan MDN juga **tidak** memuat *"JavaScript is
single-threaded"* sebagai kalimat berdiri sendiri. Yang ada (verbatim MDN):
> *"the queue (of jobs): this is known in HTML (and also commonly) as the event loop which
> enables asynchronous programming in JavaScript while being single-threaded."*
> *"An agent is a thread, which means the interpreter can only process one statement at a
> time."*

**Konsekuensi:** skill ini **tidak mengutip** "JavaScript single-threaded" seolah kalimat
resmi. Yang dipakai: **"interpreter memproses satu pernyataan pada satu waktu."**

### Python Official Docs

| Entri | Dipakai di | Status |
|---|---|---|
| Glossary `global interpreter lock` | Unit 10 | ✅ dibaca |
| Glossary `concurrency` | Unit 10 | ✅ dibaca |
| Glossary `parallelism` | Unit 10 | ✅ dibaca |
| Glossary `free threading` | Unit 10 | ✅ dibaca |
| Modul `threading` | — | ⏳ **belum diambil** |
| Modul `multiprocessing` | — | ⏳ **belum diambil** |
| Modul `asyncio` | — | ⏳ **belum diambil** |

**⚠️ Celah nyata:** dokumentasi Python yang ada hanya **deskriptif** — **tidak memuat**
panduan preskriptif *"pakai threading kapan, multiprocessing kapan"*. Maka Unit 10
**tidak menyusun tabel "pakai X kalau Y"** seolah dari dokumentasi resmi. Yang dilakukan:
**menyimpulkan bersama pembelajar** dari pernyataan yang ada, dan menyebutnya sebagai
**kesimpulan**, bukan kutipan.

---

## 5. Audit 4 — Fowler & Beck (TDD)

| Sumber | Jenis | Status |
|---|---|---|
| Fowler, M. (11 Des 2023). *Test Driven Development*. martinfowler.com | penjelasan + atribusi | ✅ dibaca |
| Beck, K. (2002). *Test-Driven Development: By Example*. Addison-Wesley · ISBN 0321146530 | **sumber primer (penemu TDD)** | ✅ terverifikasi terbit 8 Nov 2002 · ⚠️ **isi buku tidak dibaca** |

**Semua kutipan TDD di `peta-unit.md` Unit 11 datang dari Fowler** — bukan dari buku Beck.
Buku Beck hanya dipakai untuk **atribusi** (siapa penemunya, kapan).

**Aturan untuk materi:** sebut Fowler kalau mengutip kalimat; sebut Beck kalau menyebut
sejarah penemuan. **Jangan** mengaku mengutip halaman buku Beck.

---

## 6. Audit 5 — Verifikasi empiris (dijalankan sendiri)

Bukan pembacaan — **dijalankan**. Semua di **Node v22.22.2**.

| # | Yang diuji | Hasil | Unit |
|---|---|---|---|
| 1 | `Object.freeze` pada objek bersarang | `asli.nama='Andi'` → tetap `Budi`, **tanpa error** · `asli.alamat.kota='Jakarta'` → **BERHASIL** · `isFrozen(asli)=true` · `isFrozen(asli.alamat)=false` | **11** |
| 2 | Kode CPU-berat | `mulai` → hitung prima → `jumlah prima: 348513` → `selesai`. **Tidak ada peringatan apa pun** | **9** |
| 3 | `node:test` tersedia | `exports: skip, todo, only, after, afterEach, before, beforeEach, describe, it, run, suite, test` — **bawaan, tanpa `npm install`** | **11** |
| 4 | Versi runtime | `node --version` → `v22.22.2` | semua |

**Kenapa ini penting:** keempatnya **bisa direproduksi pembelajar**. Ia tidak perlu percaya
pada tutor — cukup jalankan sendiri.

**Cara mereproduksi:**
```bash
node --version
node -e "const t=require('node:test'); console.log(Object.keys(t).slice(0,12).join(', '))"
```

---

## 7. Repo populer yang diperiksa

| Repo / sumber | Relevansi | Status |
|---|---|---|
| `refactoring.guru` | katalog 22 pola + 8 prinsip, 11 bahasa | ✅ dibaca per halaman |
| Redux / Redux Toolkit docs — *Immutable Update Patterns* | immutable update patterns | ✅ dibaca |
| MDN Web Docs | `Object.freeze`, execution model | ✅ dibaca |
| Node.js Official Docs | `worker_threads`, `node:test` | ✅ dibaca **+ diuji** |
| `donnemartin/system-design-primer` | sumber `teach-system-design` | ✅ (sudah dipakai di sana) |
| `ashishps1/awesome-system-design-resources` | sumber `teach-system-design` | ✅ (sudah dipakai di sana) |

**⚠️ Keterbatasan yang diakui:** `refactoring.guru` **bukan dokumentasi resmi bahasa atau
standar**. Ia katalog pihak ketiga yang **populer dan bisa diperiksa**. Untuk definisi
pola, ia **merujuk** ke GoF. Ini keterbatasan yang **diakui**, bukan diabaikan.

---

## 8. Yang SENGAJA tidak diajarkan

| Topik | Kenapa dilewati | Di mana ia seharusnya dipelajari |
|---|---|---|
| **Caching · message queue · TLS · JWT · OAuth** | **Sudah punya materi dalam** di `teach-system-design` (`14-cache.md` 1.174 baris · `04-message-queues.md` 1.346 baris · `17-keamanan-sistem.md` 2.010 baris) | `/teach-system-design` |
| **19 dari 23 pola GoF** | 4 pola cukup untuk melatih **cara membaca pola** (§3) | Katalog pola, setelah punya kemampuannya |
| **Payment gateway** | **Keputusan xcode:** masuk `teach-nodejs`. Dan **belum punya sumber** — menyentuh uang nyata | `/teach-nodejs` (setelah riset provider) |
| **DDD (Domain-Driven Design)** | Butuh konteks aplikasi nyata yang belum dimiliki pembelajar | Nanti, setelah Unit 15 |
| **Microservices, event sourcing, CQRS** | Itu **arsitektur sistem**, bukan rekayasa perangkat lunak | `/teach-system-design` |
| **Refactoring besar-besaran (katalog Fowler)** | Butuh kode yang lebih besar dari korpus skill ini | Setelah Unit 15, dengan kode nyata |
| **Debugger (bukan `console.log`)** | Menambah alat sebelum **cara berpikirnya** ada. `console.log` cukup untuk 18 unit | Setelah skill ini |
| **Buku asli GoF & Beck** | Berhak cipta; tidak ada versi daring resmi (§3, §5) | Buku fisik, setelah skill ini |
| **Panduan "pakai threading kapan"** | **Belum ada sumbernya** (§4) | Setelah halaman modul Python diambil |

---

## 9. 🔴 Batas kejujuran — bagian terpenting file ini

### 9.1 Skill ini TIDAK punya dasar riset pedagogis

`teach-javascript`, `teach-react`, `teach-nodejs`, dan `teach-tailwindcss` semuanya
bersandar pada **PRIMM**, **Parsons Problems**, dan **ambang tracing 50%**.

**Untuk desain perangkat lunak, dasar itu belum terkumpul.**

| Pertanyaan | Jawaban jujur |
|---|---|
| Adakah penelitian tentang urutan mengajarkan SOLID? | **Tidak saya temukan.** |
| Adakah ambang terukur untuk "paham desain"? | **Tidak ada.** Ambang 50% (Lister 2004) mengukur **melacak kode**, bukan menilai desain. |
| Adakah studi bahwa Parsons Problem cocok untuk materi desain? | Riset Denny (2008) & Harms (2016) meneliti **pemula pemrograman**, bukan desain. |
| Adakah bukti urutan 18 unit ini benar? | **Tidak ada.** Ia disusun dari **masalah yang paling sering muncul di kode AI**. |

**Ini keterbatasan yang diakui, bukan diabaikan.** Kalau pembelajar bertanya
*"kenapa urutannya begini?"* — jawaban jujurnya: *"karena disusun dari cacat yang paling
sering ditemukan, bukan dari penelitian urutan belajar."*

### 9.2 Hal-hal lain yang tidak diverifikasi

- **Akronim SOLID oleh Michael Feathers** → **sumber sekunder**. Belum diverifikasi ke
  sumber primer. Ditandai ⚠️, **tidak boleh** ditulis sebagai fakta pasti.
- **Buku GoF (1994) & Beck (2002) isinya tidak dibaca.** Hanya keberadaan/ISBN/tanggal.
- **`refactoring.guru` bukan dokumentasi resmi** — katalog pihak ketiga yang bisa diperiksa.
- **Bagian 3 (Unit 12–15) sengaja opsional** — dan pembagian itu **penilaian**, bukan hasil
  penelitian.
- **Tingkat bahaya di `sintaks-javascript.md` adalah penilaian**, bukan hasil riset.
- **Daftar 23 cacat di `korpus-ai.md` §3 belum diuji** sebagai daftar yang lengkap.
- **Protokol 5 langkah TELUSUR belum diuji sebagai metode.**
- **Korpus Bagian 3 belum pernah dibuat** — masih berupa usulan.
- **Sumber berubah.** Audit ini memakai sumber yang dibuka **28 Sep 2026**. Kalau
  dokumentasi resmi berubah, audit perlu diulang.
- **Artikel web "cara belajar SOLID 2026" tidak dipakai** — aturan sumber repo ini
  melarang blog pribadi/SEO/konten AI.

### 9.3 Yang saya TOLAK menulis

| Topik | Alasan penolakan |
|---|---|
| **Tabel "pakai threading / multiprocessing / asyncio kapan"** | Dokumentasi Python hanya **deskriptif**. Menulis tabel preskriptif = **mengarang sumber**. |
| **"SOLID diperkenalkan Martin 2000"** | **Terbukti salah** — 0 kemunculan di papernya (§2). |
| **Mengutip isi buku GoF / Beck** | Tidak bisa saya baca. Mengutipnya = **mengarang**. |
| **Payment gateway** | Belum ada sumber; **menyentuh uang nyata**. |

---

**📅 Dibuat:** 28 September 2026
**📚 Terkait:** `SKILL.md` · `roadmap-4-tingkat.md` · `peta-unit.md` · `korpus-ai.md` ·
`sintaks-javascript.md`
