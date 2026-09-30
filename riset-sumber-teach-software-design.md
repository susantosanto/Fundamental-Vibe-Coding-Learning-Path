# Riset Sumber — Materi `teach-software-design`

> **Tanggal riset:** 28 September 2026
> **Diminta oleh:** xcode
> **Pertanyaan:** Apakah topik SOLID · Multithreading · Immutability · Streaming/messaging ·
> Caching · Idempotency · Security · SSL/JWT/OAuth/payment gateway · Factory/Decorator/
> Singleton/Observer · TDD sudah lengkap di `teach-system-design`?
> **Aturan sumber:** hanya dokumentasi resmi, standar, paper, atau repo proyek.
> Blog pribadi / artikel SEO / konten AI **dilarang**.

---

## 0. Ringkasan jawaban

**TIDAK lengkap.** Dari 10 topik:

| Kelompok | Topik | Bukti |
|---|---|---|
| ✅ **Materi dalam** | Caching · Messaging/queue · Security · TLS/SSL · JWT · OAuth · Idempotency | `17-keamanan-sistem.md` **2.010 baris** (OWASP Top 10 lengkap); `14-cache.md` 1.174 baris; `04-message-queues.md` 1.346 baris |
| ⚠️ **Sebagian** | Streaming | hanya konteks **video streaming** (Fase 10) — bukan streaming sebagai pola data |
| ❌ **Tidak ada** | SOLID · Multithreading · Immutability · Factory/Decorator/Singleton/Observer · TDD · **Payment gateway** | lihat §2 |

**Sebabnya = batas bidang, bukan celah yang bocor.** `teach-system-design` mengajarkan
**arsitektur sistem** (komponen & protokol). SOLID, design patterns, TDD, Immutability
adalah **rekayasa perangkat lunak** — cara menulis dan merawat kode di dalam satu aplikasi.
Multithreading adalah **model eksekusi runtime**. Menambal kelimanya ke `teach-system-design`
akan merusak identitas skill itu.

**Keputusan xcode (28 Sep 2026):**
- 5 topik tanpa rumah → **skill baru `teach-software-design`**
- Payment gateway → **`teach-nodejs`**, bukan skill baru
- Multithreading → **dua-duanya**: di JavaScript **dan** sebagai konsep umum

---

## 1. 🔴 Koreksi penting: "paper SOLID 2000" itu tidak memuat SOLID

Ini temuan riset yang **membatalkan asumsi umum** — dan penting supaya materi tidak salah.

Paper yang jadi rujukan utama adalah:

> **Robert C. Martin (2000). *Design Principles and Design Patterns*.**
> www.objectmentor.com · 34 halaman · `Copyright (c) 2000 by Robert C. Martin`
> URL: `https://staff.cs.utu.fi/~jounsmed/doos_06/material/DesignPrinciplesAndPatterns.pdf`
> **Status: ✅ diunduh & dibaca penuh (34 halaman, 54.810 karakter teks diekstrak)**

**Yang benar-benar ada di paper itu:**

| Prinsip | Ada? | Definisi verbatim di paper |
|---|---|---|
| **OCP** (Open-Closed) | ✅ | *"A module should be open for extension but closed for modification."* |
| **LSP** (Liskov Substitution) | ✅ | *"Subclasses should be substitutable for their base classes."* |
| **ISP** (Interface Segregation) | ✅ | *"Many client specific interfaces are better than one general purpose interface"* |
| **DIP** (Dependency Inversion) | ✅ | *"Depend upon Abstractions. Do not depend upon concretions."* |
| **SRP** (Single Responsibility) | ❌ **TIDAK ADA** | Pencarian `"Single Responsibility"` → **0 hasil**. `"Single"` → **0 hasil** |
| Akronim **"SOLID"** | ❌ **TIDAK ADA** | Tidak muncul sekali pun di 34 halaman |

**Bukti angka:** `OCP` 17× · `LSP` 13× · `DIP` 13× · `ISP` 6× · `SRP` **0×** · `Single` **0×**.

**Jadi urutan sejarahnya begini (jangan dibalik):**

1. **2000** — Martin menulis paper berisi **4 prinsip** (OCP, LSP, ISP, DIP). Belum ada SRP, belum ada nama "SOLID".
2. **Akhir 1990-an** — Martin menyusun SRP. Dalam blog resminya ia menulis:
   > *"In the late 1990s I tried to consolidate these notions into a principle, which I called: The Single Responsibility Principle. (I have this vague feeling that I stole the name of this principle from Bertrand Meyer, but I have not been able to confirm that.)"*
   > — `https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html` ✅ dibaca
3. **Setelahnya** — **Michael Feathers** yang mengusulkan akronim **SOLID** (dikonfirmasi beberapa sumber sekunder; **belum saya verifikasi ke sumber primer Feathers** → ditandai ⚠️).

**Definisi SRP verbatim dari sumber primernya:**
> *"The Single Responsibility Principle (SRP) states that each software module should have one and only one reason to change."*
> *"This principle is about people."*
> *"Gather together the things that change for the same reasons. Separate those things that change for different reasons."*

> **Konsekuensi untuk materi:** jangan menulis "SOLID diperkenalkan Martin 2000" — itu **salah**.
> Yang benar: **"Empat prinsip dari paper 2000; SRP menyusul; akronim SOLID bukan dari Martin."**

**Halaman arsip resmi Martin (untuk rujukan lanjut):** `https://blog.cleancoder.com/` ✅

---

## 2. Sumber per topik

### 2.1 SOLID design principles

| Sumber | Jenis | Status |
|---|---|---|
| Martin, R.C. (2000) *Design Principles and Design Patterns* | paper penulis prinsip | ✅ dibaca penuh, 34 hal |
| Martin, R.C. (2014) *The Single Responsibility Principle*, blog resmi | tulisan penulis SRP | ✅ dibaca |
| **Bukan sumber:** artikel SEO, "SOLID explained", konten AI | — | ❌ dilarang |

**Temuan yang layak jadi bahan ajar — "4 gejala desain membusuk"** (verbatim dari paper 2000,
§*Symptoms of Rotting Design*). Ini cara masuk yang bagus karena berbicara **gejala**, bukan teori:

> *"There are four primary symptoms that tell us that our designs are rotting. They are not orthogonal, but are related to each other... they are: rigidity, fragility, immobility, and viscosity."*

| Gejala | Definisi verbatim |
|---|---|
| **Rigidity** | *"the tendency for software to be difficult to change, even in simple ways. Every change causes a cascade of subsequent changes in dependent modules."* |
| **Fragility** | *"the tendency of the software to break in many places every time it is changed. Often the breakage occurs in areas that have no conceptual relationship with the area that was changed."* |
| **Immobility** | *"the inability to reuse software from other projects or from parts of the same project."* |
| **Viscosity** | *"When the design preserving methods are harder to employ than the hacks, then the viscosity of the design is high. It is easy to do the wrong thing, but hard to do the right thing."* |

> **Kenapa ini penting untuk Mode Inspeksi:** keempatnya adalah **gejala yang bisa dikenali
> dari kode AI** — tanpa perlu tahu nama prinsipnya. Rigidity = satu perubahan menyebar ke
> banyak file. Viscosity = AI memilih jalan pintas padahal ada jalan yang benar.

### 2.2 Factory · Decorator · Singleton · Observer (design patterns)

| Sumber | Jenis | Status |
|---|---|---|
| Gamma, Helm, Johnson, Vlissides (1994) *Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley · ISBN 0201633612 | **sumber primer (GoF)** | ✅ terverifikasi ada — 23 pola, terbit 31 Okt 1994 |
| `refactoring.guru/design-patterns/*` | katalog + penjelasan modern | ✅ dibaca per pola |

⚠️ **Catatan kejujuran:** buku GoF sendiri **belum saya baca** (berhak cipta, tidak ada versi
daring resmi). Yang saya verifikasi adalah **keberadaannya** dan definisi pola dari
`refactoring.guru` — yang menyebut 23 pola GoF. Kalau materi mengutip GoF, sebut **buku**-nya,
jangan mengaku mengutip halaman tertentu.

**Definisi verbatim `refactoring.guru` (semua ✅ dibaca):**

| Pola | Klasifikasi | Intent (verbatim) | Juga dikenal |
|---|---|---|---|
| **Factory Method** | **Creational** | *"provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created."* | Virtual Constructor |
| **Decorator** | **Structural** | *"lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors."* | Wrapper |
| **Singleton** | **Creational** | *"lets you ensure that a class has only one instance, while providing a global access point to this instance."* | — |
| **Observer** | **Behavioral** | *"lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing."* | Event-Subscriber, Listener |

**Bahan ajar paling berharga — Singleton itu pola yang DIKRITIK.** Verbatim dari sumber yang sama:
> *"Violates the Single Responsibility Principle. The pattern solves two problems at the time."*
> *"The pattern requires special treatment in a multithreaded environment so that multiple threads won't create a singleton object several times."*
> *"It may be difficult to unit test the client code of the Singleton... Or just don't write the tests. Or don't use the Singleton pattern."*

> **Untuk Mode Inspeksi:** Singleton adalah pola favorit kode AI **dan** pola yang paling
> sering salah. Kalimat "atau jangan pakai Singleton" dari katalognya sendiri adalah bahan
> latihan KLAIM yang kuat.

Decorator — masalah yang dipecahkan (verbatim): *"a combinatorial explosion of subclasses"*,
karena *"Inheritance is static"*.

### 2.3 TDD (Test-Driven Development)

| Sumber | Jenis | Status |
|---|---|---|
| Beck, K. (2002) *Test-Driven Development: By Example*, Addison-Wesley · ISBN 0321146530 | **sumber primer (penemu TDD)** | ✅ terverifikasi terbit 8 Nov 2002 |
| Fowler, M. (11 Des 2023) *Test Driven Development*, martinfowler.com | penjelasan + atribusi ke Beck | ✅ dibaca |
| `node:test` — dokumentasi resmi Node.js | **alat praktik** | ✅ **diuji jalan di runtime** |

**Tiga langkah verbatim (Fowler):**
> *"Write a test for the next bit of functionality you want to add."*
> *"Write the functional code until the test passes."*
> *"Refactor both new and old code to make it well structured."*

> *"Although these three steps, often summarized as **Red - Green - Refactor**, are the heart of the process, there's also a vital initial step where we write out a list of test cases first."*

**Atribusi & tahun:**
> *"Test-Driven Development (TDD) is a technique for building software that guides software development by writing tests. It was developed by **Kent Beck** in the late 1990's as part of **Extreme Programming**."*

**Kegagalan paling sering (verbatim) — ini inti latihan:**
> *"The most common way that I hear to screw up TDD is neglecting the third step. Refactoring the code to keep it clean is a key part of the process, otherwise we just end up with a messy aggregation of code fragments."*

**Manfaat menulis tes dulu (verbatim):**
> *"thinking about the test first forces us to think about the interface to the code first. This focus on interface and how you use a class helps us separate interface from implementation, a key element of good design that many programmers struggle with."*

**Alat praktik — terverifikasi jalan:**
```
$ node -e "const t=require('node:test'); console.log(Object.keys(t).slice(0,12).join(', '))"
node:test tersedia di v22.22.2
exports: skip, todo, only, after, afterEach, before, beforeEach, describe, it, run, suite, test
```
**Penting:** `node:test` sudah **bawaan** — tidak perlu `npm install`. Ini cocok dengan
batasan proyek (tanpa instalasi, model gratis).

### 2.4 Immutability

| Sumber | Jenis | Status |
|---|---|---|
| MDN — `Object.freeze()` | dokumentasi resmi standar web | ✅ dibaca |
| Redux — *Immutable Update Patterns* | dokumentasi repo populer | ✅ dibaca |
| ECMAScript® 2027 Language Specification §`sec-object.freeze` | **standar** | ✅ dikutip MDN sebagai spesifikasi |

**Definisi verbatim MDN:**
> *"The `Object.freeze()` static method freezes an object. Freezing an object prevents extensions and makes existing properties non-writable and non-configurable. A frozen object can no longer be changed..."*
> *"Any attempt to do so will fail, either silently or by throwing a TypeError exception (most commonly, but not exclusively, when in strict mode)."*

**🔴 Sumber bug paling penting — `freeze` itu SHALLOW (verbatim MDN):**
> *"The result of calling `Object.freeze(object)` only applies to the immediate properties of `object` itself... If the value of those properties are objects themselves, those objects are not frozen and may be the target of property addition, removal or value re-assignment operations."*
> *"A frozen object is immutable. However, it is not necessarily constant. ... (freeze is shallow)"*
> *"To be a constant object, the entire reference graph (direct and indirect references to other objects) must reference only immutable frozen objects."*

**✅ Diverifikasi empiris di runtime Node v22.22.2 (saya jalankan sendiri):**
```javascript
const asli = { nama: 'Budi', alamat: { kota: 'Bandung' } };
Object.freeze(asli);
asli.nama = 'Andi';           // → gagal SENYAP (tidak error!)
asli.alamat.kota = 'Jakarta'; // → BERHASIL (nested tidak beku!)

// Hasil nyata:
// nama setelah coba ubah : Budi      ← tidak berubah, tapi TIDAK ADA error
// kota setelah coba ubah : Jakarta   ← berubah juga!
// Object.isFrozen(asli)          : true
// Object.isFrozen(asli.alamat)   : false
```
> **Ini unit ⭐ yang sempurna** — persis pola yang sama dengan Unit 12 `teach-tailwindcss`
> dan Unit 15 `teach-react`: **kegagalan senyap**. Kode tidak error, tapi nilainya tidak berubah.
> Dan perubahan pada objek bersarang **berhasil** — jadi ada dua kegagalan berbeda di satu konsep.

**Redux — mengapa immutability dipedulikan (verbatim):**
> *"The key to updating nested data is that every level of nesting must be copied and updated appropriately. This is often a difficult concept for those learning Redux, and there are some specific problems that frequently occur when trying to update nested objects. These lead to accidental direct mutation, and should be avoided."*

Kesalahan umum #1 (verbatim, langsung relevan untuk membaca kode AI):
> *"Defining a new variable does not create a new actual object - it only creates another reference to the same object."*

> **Kaitan ke `teach-react` Unit 15 ⭐:** React membandingkan **alamat**, bukan isi. Redux di
> sini menjelaskan **mengapa** itu penting di level state. Dua skill saling menguatkan.

### 2.5 Multithreading — JavaScript **dan** konsep umum

Diminta xcode: **dua-duanya**. Jadi ada dua jalur sumber.

**Jalur A — JavaScript / Node.js**

| Sumber | Jenis | Status |
|---|---|---|
| Node.js Official Docs — `node:worker_threads` | dokumentasi resmi runtime | ✅ dibaca |
| MDN — *JavaScript execution model / Event loop* | dokumentasi resmi standar web | ✅ dibaca |

**Fakta verbatim Node.js:**
> *"The `node:worker_threads` module enables the use of threads that execute JavaScript in parallel."*
> *"Unlike `child_process` or `cluster`, `worker_threads` can share memory. They do so by transferring `ArrayBuffer` instances or sharing `SharedArrayBuffer` instances."*
> *"The `Worker` class represents an independent JavaScript execution thread."*

**🔴 Kapan JANGAN pakai worker (verbatim — ini yang paling sering disalahpahami):**
> *"Workers (threads) are useful for performing CPU-intensive JavaScript operations. **They do not help much with I/O-intensive work. The Node.js built-in asynchronous I/O operations are more efficient than Workers can be.**"*
> *"In practice, use a pool of Workers for these kinds of tasks. Otherwise, the overhead of creating Workers would likely exceed their benefit."*

⚠️ **Temuan penting soal kata "single-threaded":** dokumentasi Node.js **tidak memuat**
pernyataan "Node.js is single-threaded". MDN juga **tidak** memuat kalimat "JavaScript is
single-threaded" sebagai pernyataan berdiri sendiri. Yang ada:
> *"the queue (of jobs): this is known in HTML (and also commonly) as the event loop which enables asynchronous programming in JavaScript while being single-threaded."*
> *"An agent is a thread, which means the interpreter can only process one statement at a time."*

> **Konsekuensi untuk materi:** jangan mengutip "JavaScript single-threaded" seolah kalimat
> resmi. Yang akurat: **"interpreter memproses satu pernyataan pada satu waktu."**

**Run-to-completion (verbatim MDN) — ini akar "kenapa aplikasi freeze":**
> *"Each job is processed completely before any other job is processed. This offers some nice properties when reasoning about your program, including the fact that whenever a function runs, it cannot be preempted and will run entirely before any other code runs..."*
> *"A downside of this model is that if a job takes too long to complete, the web application is unable to process user interactions like click or scroll."*
> *"A good practice to follow is to make job processing short and, if possible, cut down one job into several jobs."*

**Paralelisme di web — lewat `SharedArrayBuffer` + `Atomics` (verbatim):**
> *"To share memory, one must post a `SharedArrayBuffer` object, which can be simultaneously accessed by multiple agents. Once two agents share access to the same memory via a `SharedArrayBuffer`, they can synchronize executions via the `Atomics` object."*
> *"In Node.js, a similar concept called worker threads is available."*

**✅ Diverifikasi empiris:** kode CPU-berat memblokir **tanpa error apa pun** (gagal senyap):
```
mulai
jumlah prima: 348513      ← proses berat, tidak ada peringatan
selesai
```
> Justru **tidak adanya error** itulah masalahnya. Ini lagi-lagi pola **kegagalan senyap**.

**Jalur B — konsep umum (bahasa apa pun)** · ✅ **SUDAH ADA SUMBER**

| Sumber | Jenis | Status |
|---|---|---|
| Python Official Docs — Glossary `global interpreter lock`, `concurrency`, `parallelism`, `free threading` | dokumentasi resmi | ✅ dibaca |
| Paper Parnas (1972) & Dijkstra (EWD447) — dikutip Martin | sumber primer klasik | ⚠️ dikutip sekunder |
| Dokumentasi resmi Java `java.util.concurrent` (Oracle) | dokumentasi resmi | ⏳ belum diambil |

**Definisi GIL verbatim (Python docs):**
> *"The mechanism used by the CPython interpreter to assure that **only one thread executes Python bytecode at a time**."*
> *"This simplifies the CPython implementation by making the object model (including critical built-in types such as `dict`) implicitly safe against concurrent access."*
> *"Locking the entire interpreter makes it easier for the interpreter to be multi-threaded, at the expense of much of the parallelism afforded by multi-processor machines."*

**🔴 Temuan yang membuat Jalur B layak diajarkan** — dua bahasa berbeda, **model mental yang
sama persis**:

| | JavaScript (MDN) | Python (docs resmi) |
|---|---|---|
| Kalimatnya | *"the interpreter can only process **one statement at a time**"* | *"only **one thread** executes Python bytecode **at a time**"* |

Keduanya memakai gagasan **"satu per satu pada satu waktu"**. Jadi pembelajar yang paham
JavaScript akan **langsung mengenali** GIL Python — itu bukan konsep baru, hanya nama baru.

**Paralelisme & multi-core (verbatim, entri `parallelism`):**
> *"In Python builds with the global interpreter lock (GIL), only one thread runs Python bytecode at a time, so taking advantage of multiple CPU cores typically involves multiple processes (e.g. `multiprocessing`) or native extensions that release the GIL."*

**Pelepasan GIL saat I/O (verbatim) — ini jembatan ke istilah CPU-bound / I/O-bound:**
> *"some extension modules... are designed so as to release the GIL when doing computationally intensive tasks such as compression or hashing. **Also, the GIL is always released when doing I/O.**"*

**Python bebas-GIL (verbatim) — perkembangan terbaru yang wajib disebut:**
> *"As of Python 3.13, the GIL can be disabled using the `--disable-gil` build configuration."*
> *"In free-threaded Python, multiple Python threads can run Python code simultaneously on different cores."*

⚠️ **Batas jujur:** dokumentasi Python **tidak memuat istilah "CPU-bound"/"IO-bound"** dan
**tidak memuat panduan preskriptif** "pakai threading kapan, multiprocessing kapan".
Yang ada hanya pernyataan deskriptif. **Kalau materi ingin panduan "pilih yang mana",
sumbernya harus diambil dari halaman modul `threading`/`multiprocessing`/`asyncio` —
belum saya ambil.** Jadi jangan menulis tabel "pakai X kalau Y" seolah-olah dari docs.

**Paralelisme di Node.js (verbatim, untuk perbandingan lintas bahasa):**
> *"Unlike `child_process` or `cluster`, `worker_threads` can share memory."* — Node.js docs

**Peta tiga model (dari sumber, bukan opini):**

| Bahasa | Mekanisme paralel | Batasnya menurut dokumentasi resmi |
|---|---|---|
| JavaScript (Node) | `worker_threads` | *"do not help much with I/O-intensive work"* |
| JavaScript (web) | Web Worker (`agent`) | agen berbagi memori lewat `SharedArrayBuffer` + `Atomics` |
| Python | `multiprocessing` | GIL: *"only one thread executes Python bytecode at a time"* |
| Python (3.13+) | free-threading (`--disable-gil`) | *"multiple Python threads can run Python code simultaneously"* |

### 2.6 Payment gateway → `teach-nodejs` (keputusan xcode)

⚠️ **Temuan riset: di seluruh repo ini, "payment gateway" TIDAK PERNAH diajarkan.**
Grep di `fase-1` + `fase-4`: `payment` hanya muncul sebagai **nama di daftar**; `midtrans`,
`xendit`, `stripe` → **0 kemunculan yang merupakan materi**.

| Sumber | Jenis | Status |
|---|---|---|
| Dokumentasi resmi Midtrans | dokumentasi vendor | ⏳ **belum diambil** |
| Dokumentasi resmi Xendit | dokumentasi vendor | ⏳ **belum diambil** |
| Dokumentasi resmi Stripe | dokumentasi vendor | ⏳ **belum diambil** |
| PCI DSS (standar keamanan kartu) | **standar** | ⏳ **belum diambil** |
| OWASP — panduan pembayaran/transaksi | standar keamanan | ⏳ **belum diambil** |

> **🔴 Rekomendasi saya: payment gateway JANGAN ditulis tanpa riset sumber resmi per provider.**
> Ini topik yang menyentuh **uang nyata**, dan tiap provider punya aturan berbeda
> (signature, webhook, idempotency key, sandbox). Menulis dari ingatan = risiko nyata.
> Untuk konteks xcode (aplikasi sekolah), yang paling relevan adalah provider **Indonesia**
> (Midtrans/Xendit) beserta aturan webhook-nya.
>
> **Titik sambungnya justru bagus:** idempotency key di webhook pembayaran adalah penerapan
> Idempotency (§2.7) yang sudah ada materi di `fase-4`. Jadi topik ini menguatkan, bukan
> menggantung.

### 2.7 Topik yang sudah punya materi (tidak perlu dibangun baru)

Terverifikasi via **26 file fase, 6.734 baris** yang saya baca:

| Topik | File & ukuran | Isi yang terverifikasi |
|---|---|---|
| **Caching** | `fase-1/14-cache.md` **1.174 baris** · `fase-4/06-distributed-caching.md` **886 baris** | Cache hit ratio, strategi update, eviction, Redis deep dive, invalidation, **penetration/breakdown/avalanche**, consistent hashing, cache coherence |
| **Messaging / queue** | `fase-4/04-message-queues.md` **1.346 baris** (13 sub-bab) | RabbitMQ, Kafka, delivery semantics, ordering/partitioning, **DLQ**, EDA, scaling, monitoring |
| **Security** | `fase-1/17-keamanan-sistem.md` **2.010 baris** | **OWASP Top 10 lengkap** (A01–A10), authn, authz (RBAC/ABAC/PBAC), enkripsi, headers, API security, network |
| **SSL/TLS** | §1218 `TLS/SSL — Secure Communication` | simetris/asimetris, TLS handshake, hashing |
| **JWT** | §602 `JWT (JSON Web Token) Authentication` | + tabel banding **Session · JWT · OAuth · SAML** |
| **OAuth** | §723 `OAuth 2.0 — Delegated Authorization` | Authorization Code Flow, Grant Types, §795 OIDC, §822 SAML |
| **Idempotency** | `fase-1/11-application-layer.md` + `15-asynchronism.md` | tabel HTTP method (`GET idempotent`, `POST tidak idempotent`), pola consumer + `# Cek idempotency (hindari proses duplikat)` |
| **Streaming (sebagian)** | `fase-4/09-arsitektur-youtube-netflix.md` | **video streaming** + Kafka sebagai *"distributed event streaming platform"* |

**Perbandingan DB & integritas:** `05-event-sourcing-cqrs.md` (Event Sourcing + CQRS) juga sudah ada.

### 2.8 Streaming — celah yang nyata

⚠️ Yang **tidak** ada di repo: streaming sebagai **pola data** — SSE, WebSocket, backpressure,
event stream sebagai API. Yang ada hanya streaming **video**. Fase 8 `teach-system-design`
menyebut SSE tapi **belum ada filenya**.

✅ **Sumber sudah ditemukan (dokumentasi resmi):**

| Sumber | Jenis | Status |
|---|---|---|
| MDN — *Using server-sent events* | dokumentasi resmi standar web | ✅ dibaca |
| WHATWG HTML Standard §`dispatchMessage` | **standar** (dikutip MDN untuk format pesan) | ✅ dirujuk |
| MDN — *WebSockets API* | dokumentasi resmi | ⏳ belum dibaca |

**Definisi & perbedaan dengan WebSocket (verbatim MDN):**
> *"You'll need a bit of code on the server to stream events to the front-end, but the client-side code works almost identically to websockets in part of handling incoming events. **This is a one-way connection, so you can't send events from a client to a server.**"*

**⚠️ Batasan nyata SSE (verbatim — bagus untuk latihan KLAIM):**
> *"When not used over HTTP/2, SSE suffers from a limitation to the maximum number of open connections, which can be especially painful when opening multiple tabs, as the limit is per browser and is set to a very low number (6). The issue has been marked as 'Won't fix' in Chrome and in Firefox."*

**Format (verbatim):** *"the server-side script that sends events needs to respond using the MIME type `text/event-stream`."*
Field: `event` · `data` · `id` · `retry`. Reconnect otomatis: *"By default, if the connection between the client and server closes, the connection is restarted."*

> **Titik sambung ke materi yang sudah ada:** SSE adalah **streaming satu arah**, sedangkan
> `04-message-queues.md` (1.346 baris) mengajarkan **event streaming** di sisi server
> (*"Apache Kafka adalah distributed event streaming platform"*). Jadi pola streaming
> **sudah setengah ada** — yang kurang hanya sisi **protokol web**-nya (SSE/WebSocket).

---

## 3. Repo populer yang diperiksa

| Repo / sumber | Relevansi | Status |
|---|---|---|
| `refactoring.guru` | katalog 22 pola + 8 prinsip, 11 bahasa | ✅ dibaca per halaman |
| Redux / Redux Toolkit docs | immutable update patterns | ✅ dibaca |
| MDN Web Docs | `Object.freeze`, execution model | ✅ dibaca |
| Node.js Official Docs | `worker_threads`, `node:test` | ✅ dibaca + diuji |
| `donnemartin/system-design-primer` | sudah jadi sumber `teach-system-design` | ✅ (sudah dipakai) |
| `ashishps1/awesome-system-design-resources` | sudah jadi sumber | ✅ (sudah dipakai) |
| Gamma dkk. (1994) GoF | **sumber primer pola** | ✅ keberadaan terverifikasi; isi ⚠️ belum dibaca |

---

## 4. Batas kejujuran riset ini

1. **Buku berhak cipta tidak bisa saya baca penuh** — GoF (1994) dan Kent Beck (2002) saya
   verifikasi **keberadaan, penerbit, ISBN, tanggal terbit**, tapi **bukan isinya**.
   Kalau materi mengutipnya, sebut bukunya — jangan mengaku mengutip halaman tertentu.
2. **Akronim SOLID oleh Michael Feathers** → hanya sumber sekunder. **Belum diverifikasi
   ke sumber primer.** Ditandai ⚠️ dan tidak boleh ditulis sebagai fakta pasti.
3. **Panduan "pilih threading / multiprocessing / asyncio" belum ada sumbernya.** Dokumentasi
   Python hanya **deskriptif**. Halaman modul `threading`/`multiprocessing`/`asyncio`
   **belum diambil** → jangan tulis tabel "pakai X kalau Y".
4. **Payment gateway belum punya sumber sama sekali.** Dokumentasi Midtrans/Xendit/Stripe
   dan PCI DSS **belum diambil**. Materi ini **belum boleh ditulis.**
5. **WebSocket belum dibaca** (baru SSE). Perbandingan SSE vs WebSocket masih satu sisi.
6. **Model thread Java (`java.util.concurrent`) belum diambil.** Jalur B cukup kuat dengan
   Python + JavaScript, tapi belum tiga bahasa.
7. **`refactoring.guru` bukan dokumentasi resmi bahasa/standar** — ia katalog pihak ketiga
   yang populer dan bisa diperiksa. Untuk definisi pola, ia **merujuk** ke GoF. Ini
   **keterbatasan yang diakui**, bukan diabaikan.
8. **Empat verifikasi empiris** (§2.4 dan §2.5) saya jalankan sendiri di Node v22.22.2 —
   hasilnya ada di file ini, bisa direproduksi xcode.

---

## 5. Yang BELUM dikerjakan — menunggu

| # | Pekerjaan | Kenapa ditahan |
|---|---|---|
| 1 | Sumber payment gateway (Midtrans/Xendit/Stripe/PCI DSS) | **menyentuh uang nyata** — tidak boleh dari ingatan |
| 2 | Panduan pilih model konkurensi (halaman modul Python) | supaya tidak menulis tabel panduan tanpa dasar |
| 3 | WebSocket + `java.util.concurrent` | melengkapi perbandingan, bukan wajib |
| 4 | **Membangun skill `teach-software-design`** (5 file references) | **menunggu xcode menyetujui struktur** |

### Yang SUDAH selesai di sesi ini

| ✅ | Hasil |
|---|---|
| Sumber SOLID | paper 2000 **dibaca penuh** + koreksi penting (§1) |
| Sumber 4 design patterns | definisi verbatim + klasifikasi |
| Sumber TDD | Fowler + Beck + `node:test` **diuji jalan** |
| Sumber Immutability | MDN + Redux + **diverifikasi empiris** (freeze shallow) |
| Sumber Multithreading | Node + MDN + **Python docs** (Jalur B tertutup) |
| Sumber streaming | MDN SSE + batasan 6 koneksi |
| Audit 26 file fase | 6.734 baris — memisahkan "ada materi" dari "nama saja" |

**Tidak ada file skill yang dibuat di sesi ini.** Sesi ini **riset**, bukan pembangunan.
Melengkapi `references/` adalah langkah **berikutnya**, dan menunggu persetujuan xcode.
