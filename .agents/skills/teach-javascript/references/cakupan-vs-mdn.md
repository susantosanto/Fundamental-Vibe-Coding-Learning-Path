# Cakupan vs MDN — apakah materi ini selengkap dokumen resmi?

> **Pertanyaan yang diaudit** (xcode, 26 Sep 2026):
> *"apakah materi yang akan di ajarkan sudah lengkap selengkap materi dari dokumen resmi
> javascript, mdn, dll ? jika belum lengkap tolong tambahkan"*
>
> **Jawaban singkat: TIDAK — dan tidak seharusnya. Tapi ada 3 celah nyata. Sudah ditambal.**
>
> **Diaudit:** 26 September 2026 · **Status:** celah nyata ditambal, sisanya sengaja dilewati

---

## 1. Kenapa "selengkap MDN" bukan target yang benar

MDN dan materi ini adalah **dua benda yang berbeda jenis**:

| | MDN / ECMAScript | Materi ini |
|---|---|---|
| Jenis | **Referensi** | **Kurikulum** |
| Susunan | Alfabetis / per bab | **Berurutan, ada gerbang** |
| Tujuan | "Apa saja yang ada di bahasa ini" | "Apa yang harus bisa kamu lakukan" |
| Kelengkapan | **Syarat** — kalau tidak lengkap, ia gagal | **Musuh** — makin lengkap, makin bercabang |
| Kalau ada 1 topik baru | Ditambahkan | Ditimbang dulu: melayani tujuan atau tidak |
| Cara pakai | Dicari saat butuh | Dijalani dari awal ke akhir |

**Kalau materi ini dibuat selengkap MDN, ia berhenti jadi kurikulum.** Ini bukan pendapat —
sudah pernah terjadi di repo ini: pada 14 Sep 2026 xcode mengeluh karena dibuatkan 19 file
dengan router, diagnostik, dan 4 jalur:

> *"haduhhhh saya tidak paham dengan alur belajar anda"*

Karena itu, pertanyaan yang benar bukan *"apakah selengkap MDN?"*, tapi:

> **"Apakah ada yang HILANG padahal dibutuhkan untuk membaca & menilai kode AI —
> khususnya untuk aplikasi laporan keuangan sekolah?"**

Itu yang diaudit di bawah.

---

## 2. Audit 1 — MDN JavaScript Guide (20 bab)

Sumber: `developer.mozilla.org/en-US/docs/Web/JavaScript/Guide`

| # | Bab MDN | Status | Di mana / kenapa |
|---|---|---|---|
| 1 | Introduction | — | Bukan kemampuan, hanya latar |
| 2 | Grammar and types | ⚠️ **ditambal** | Unit 1, 2, 9 — **kurang**: `===` vs `==`, template literal, presisi float → §3 |
| 3 | Control flow and error handling | ⚠️ **ditambal** | Unit 4 (`if/else`), Unit 11 (`try/catch`) — **kurang**: `switch`, `throw`, `finally` → §3 |
| 4 | Loops and iteration | ⚠️ **ditambal** | Unit 5 (`for`) — **kurang**: `while`, `for...of`, `for...in`, `break`, `continue` → §3 |
| 5 | Functions | ⚠️ **ditambal** | Unit 6, 9 — **kurang**: **arrow function**, default param, rest → §3 |
| 6 | Expressions and operators | ⚠️ **ditambal** | Unit 2 (`+` saja) — **kurang**: `?.`, `??`, `&&`, `\|\|`, ternary → §3 |
| 7 | Numbers and strings | ⚠️ **ditambal** | Unit 2 — **kurang**: `Math`, method string, `parseInt`/`parseFloat` → §3 |
| 8 | Dates and times | ❌ **DITAMBAH** | **Unit 20 baru** — tanggal penting untuk periode laporan |
| 9 | Regular expressions | ❌ **DITAMBAH** | **Unit 20 baru** — pola teks penting untuk parsing dokumen |
| 10 | Indexed collections | ✅ ADA | Unit 7 |
| 11 | Keyed collections (`Map`/`Set`) | ⚠️ **ditambal** | Kamus sintaks §E — cukup dikenali, tidak perlu unit |
| 12 | Working with objects | ⚠️ **ditambal** | Unit 7, 8 — **kurang**: **destructuring**, `Object.keys/values/entries` → §3 |
| 13 | Using classes | ⚠️ **ditambal** | Kamus sintaks §E — untuk inspeksi cukup dikenali |
| 14 | Promises | ⚠️ **ditambal** | Unit 10 — **kurang**: **`async`/`await` eksplisit**, `try/catch` + await, `Promise.all` → §3 |
| 15 | Typed arrays | ⛔ sengaja | Pemrosesan biner. Bukan ranah aplikasi ini |
| 16 | Iterators and generators | ⛔ sengaja | Sangat jarang di kode aplikasi hasil AI |
| 17 | Resource management (`using`) | ⛔ sengaja | Fitur ES2025, belum lazim |
| 18 | Internationalization | ❌ **DITAMBAH** | **Unit 20 baru** — `Intl.NumberFormat` untuk rupiah |
| 19 | JavaScript modules | ✅ ADA | Unit 15 — **ditambal**: `require()` (CommonJS, masih banyak di Electron) |
| 20 | Advanced topics | ⚠️ sebagian | Unit 8, 9. Prototipe & meta-programming sengaja dilewati |

**Ringkas: 5 bab ✅ · 10 bab ⚠️ ditambal · 3 bab ❌ ditambah · 3 bab ⛔ sengaja dilewati.**

---

## 3. Audit 2 — Objek bawaan standar (13 kategori)

Sumber: `developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects`

| Kategori | Yang dipakai untuk tujuan ini | Status |
|---|---|---|
| Value properties (`NaN`, `undefined`, `Infinity`) | `undefined` — muncul terus | ✅ Unit 2, 6 |
| Function properties (`parseInt`, `parseFloat`, `isNaN`) | Konversi teks→angka | ❌ **DITAMBAH** ke Unit 2 |
| Fundamental (`Object`, `Function`, `Boolean`, `Symbol`) | `Object.keys/values/entries` | ⚠️ **ditambal** ke Unit 7 |
| Error objects (`TypeError`, `ReferenceError`, `RangeError`) | **Nama error = petunjuk** | ❌ **DITAMBAH** ke Unit 11 |
| Numbers & dates (`Number`, `Math`, `Date`, `BigInt`) | `Math`, `Date`, presisi float | ❌ **DITAMBAH** ke Unit 2 & 20 |
| Text processing (`String`, `RegExp`) | Method teks, regex | ❌ **DITAMBAH** ke Unit 2 & 20 |
| Indexed collections (`Array`) | `map`/`filter`/`reduce`/`find` | ⚠️ **ditambal** ke Unit 7 |
| Keyed collections (`Map`, `Set`) | Cukup dikenali | ⚠️ kamus §E |
| **Structured data (`JSON`)** | **Krusial** — data aplikasi nyata berbentuk JSON | ❌ **UNIT 19 BARU** |
| Managing memory (`WeakRef`) | Tidak perlu | ⛔ sengaja |
| Control abstraction (`Promise`, `async`, `Iterator`) | `Promise`, `async`/`await` | ⚠️ **ditambal** ke Unit 10 |
| Reflection (`Proxy`, `Reflect`) | Cukup dikenali | ⛔ sengaja |
| Internationalization (`Intl.*`) | `Intl.NumberFormat` → **rupiah** | ❌ **DITAMBAH** ke Unit 20 |

---

## 4. Audit 3 — Operator (15 kategori)

Sumber: `developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators`

Materi awal hanya mengajarkan **satu** operator: `+` (Unit 2). Padahal kode AI memakai
sekitar 20 operator sejak baris pertama.

| Kategori | Status | Catatan |
|---|---|---|
| Primary (`this`, literal, template, class, regex) | ⚠️ ditambal | Template literal → Unit 2 |
| Left-hand-side (`.`, `[]`, `?.`, `new`, `super`, `import()`) | ⚠️ ditambal | **`?.` → Unit 4** (sering muncul) |
| Increment/decrement (`++`, `--`) | ⚠️ ditambal | Kamus §B |
| Unary (`!`, `typeof`, `delete`, `void`, `await`) | ⚠️ ditambal | `typeof` → Unit 11 (saat debug) |
| Arithmetic (`+ - * / % **`) | ⚠️ ditambal | `%`, `**` → Unit 2 |
| Relational (`< > <= >= instanceof in`) | ⚠️ ditambal | Unit 4, 7 |
| **Equality (`==`, `===`, `!=`, `!==`)** | ❌ **DITAMBAH** | **Unit 2 — paling penting untuk inspeksi** |
| Bitwise (`& \| ^ ~ << >>`) | ⛔ sengaja | Tidak dipakai di aplikasi biasa |
| **Logical (`&&`, `\|\|`, `??`)** | ❌ **DITAMBAH** | **Unit 4 — `??` vs `\|\|` sumber bug senyap** |
| Ternary (`? :`) | ❌ **DITAMBAH** | Unit 4 |
| Assignment (`= += -= ... ??= &&=`) | ⚠️ ditambal | Kamus §B |
| Yield / generator | ⛔ sengaja | — |
| **Spread (`...`)** | ❌ **DITAMBAH** | **Unit 8 — salinan dangkal** |
| Comma operator | ⛔ sengaja | — |
| **Destructuring** | ❌ **DITAMBAH** | **Unit 7** |

---

## 5. Yang benar-benar hilang — dan sudah ditambal

### Celah 1 — Sintaks modern (paling parah)

Kode AI memakai `const`, `=>`, `?.`, `??`, `...`, destructuring **sejak baris pertama**.
Materi awal mengajarkannya **nol**. Akibatnya pembelajar macet di baris 1 — bukan karena
konsepnya sulit, tapi karena bentuknya asing.

**Tambalan:**
- File baru **`references/sintaks-modern.md`** — kamus **± 50 bentuk**, tiap baris:
  bentuk · arti · contoh · **tingkat bahaya** · unit tempat dilatih
- Setiap unit di `peta-unit.md` dapat baris **"Sintaks yang dikenali"**
- Aturan baru di `SKILL.md`: **dilarang bilang "itu di luar materi"** — cek kamus, jelaskan
  satu bentuk, lanjut

### Celah 2 — `async`/`await` tidak eksplisit

Unit 10 mengajarkan **kenapa urutan async aneh**, tapi tidak mengajarkan bentuk
`async`/`await` itu sendiri — padahal itu bentuk yang paling sering muncul di kode AI.

**Tambalan:** Unit 10 diperluas — `async`, `await`, `try/catch` di sekitar `await`,
`Promise.all`, `fetch`.

### Celah 3 — Data & format lokal tidak ada sama sekali

Aplikasi laporan keuangan sekolah berurusan dengan: **JSON** (bentuk data yang mengalir),
**tanggal** (periode laporan), **rupiah** (`Intl.NumberFormat`), dan **pola teks** (parsing
BKU dari Excel/PDF). Tidak satu pun diajarkan.

**Tambalan — dua unit pelengkap baru:**

| Unit | Isi | Kenapa penting |
|---|---|---|
| **Unit 19 — JSON & bentuk data nyata** | `JSON.parse`/`stringify`, jebakannya, kenapa data aplikasi berbentuk teks | **`JSON.parse` melempar error** kalau bentuknya tidak sesuai dugaan — penyebab crash nomor satu di aplikasi nyata |
| **Unit 20 — Tanggal, angka lokal & pola teks** | `Date`, `Intl.NumberFormat` (rupiah), `Intl.DateTimeFormat`, regex dasar | `parseFloat("1.500,25")` → `1.5`. **Untuk aplikasi keuangan, ini bug uang** |

**Keduanya TIDAK bergerbang** — boleh diajarkan kapan saja setelah Tingkat 2, tidak
mengubah Gerbang 1–4. Karena itu ia diletakkan di **Bagian Pelengkap**, bukan sebagai
Tingkat 5.

### Celah 4 — Tiga bug uang yang harus masuk materi

Sekaligus ditambahkan sebagai penekanan, karena semuanya **"hasil salah tanpa error"**:

| Bug | Contoh | Akibat di aplikasi keuangan |
|---|---|---|
| Desimal tidak eksak | `0.1 + 0.2 !== 0.3` | Total tidak pernah cocok |
| Koma vs titik | `parseFloat("1.500,25")` → `1.5` | Nilai rupiah salah 1000× |
| `\|\|` vs `??` | `diskon \|\| 10` pada diskon `0` | Diskon 0% jadi 10% |

---

## 6. Yang SENGAJA tidak ditambahkan

Bukan karena tidak lengkap — tapi karena **menambah beban tanpa menambah kemampuan**.

| Topik | Alasan |
|---|---|
| Typed arrays, `ArrayBuffer` | Pemrosesan biner/grafis. Tidak muncul di aplikasi ini |
| Generator, `yield`, iterator | Sangat jarang di kode aplikasi hasil AI |
| `Proxy`, `Reflect`, `Symbol`, meta-programming | Cukup dikenali; bukan kebutuhan inspeksi |
| `using` / `DisposableStack` (ES2025) | Belum lazim dipakai |
| Bitwise & shift | Hampir tidak pernah di kode aplikasi biasa |
| Rantai prototipe secara dalam | Cukup "objek bisa mewarisi" (Unit 7–8) |
| Menghafal seluruh method `String`/`Array` | Bisa dicari; AI sudah tahu |
| `eval`, `with`, `void`, comma operator | Berbahaya atau tidak berguna |
| DOM, `fetch` detail, framework | **Bukan JavaScript** — itu Web API / framework. Di luar lingkup |
| Seluruh isi ECMA-262 (spesifikasi) | Referensi normatif, bukan bahan ajar. Dipakai saat MDN kurang tegas |

**Prinsipnya:** kamus sintaks untuk **mengenali**, bukan menghafal. Kalau sebuah bentuk
muncul dan pembelajar bisa menjawab *"ini apa, dan apa risikonya"* — itu sudah cukup.

---

## 7. Bentuk akhir materi

```
SEBELUM AUDIT 3 :  18 unit · 4 gerbang · 3 latihan inspeksi · 4 file skill
SESUDAH AUDIT 3 :  20 unit · 4 gerbang · 4 latihan inspeksi · 6 file skill
                   + Bagian Pelengkap (Unit 19–20, tidak bergerbang)
                   + kamus ± 50 bentuk sintaks
```

| File skill | Baris | Isi |
|---|---|---|
| `SKILL.md` | — | Router, mode penyampaian, izin research, asesmen, aturan Zed, anti-pattern |
| `references/roadmap-4-tingkat.md` | — | Tingkat, 4 gerbang, bentuk sesi, batas kejujuran |
| `references/peta-unit.md` | — | **20 unit**: konsep, sintaks yang dikenali, latihan, kriteria lulus |
| `references/korpus-ai.md` | — | Korpus kode AI + 4 latihan inspeksi |
| **`references/sintaks-modern.md`** | **baru** | **Kamus ± 50 bentuk sintaks + tingkat bahaya** |
| **`references/cakupan-vs-mdn.md`** | **baru** | **File ini — audit cakupan terhadap MDN** |

---

## 8. Batas kejujuran

- **Yang diaudit adalah KELENGKAPAN, bukan EFEKTIVITAS.** Apakah materi ini benar-benar
  membuat xcode mahir — hanya bisa dibuktikan dengan menjalankannya.
- **Tingkat bahaya (🔴🟡⚪) adalah penilaian, bukan hasil riset.** Dasarnya: frekuensi
  kemunculan di kode hasil AI + apakah bugnya menimbulkan error atau tidak. **Belum diukur.**
- **Urutan unit 19–20 belum diuji.** Alasan memilih "setelah Tingkat 2" masuk akal
  (butuh Unit 7 dulu), tapi belum ada bukti bahwa itu titik terbaik.
- **Daftar "sengaja dilewati" bisa salah.** Kalau di proyek nyata xcode menemui salah satu
  topik itu dan tersandung, itu tanda daftar ini perlu ditinjau — bukan tanda xcode
  yang kurang.
- **MDN berubah.** Audit ini memakai MDN pada **26 Sep 2026**. Bab/objek baru bisa muncul.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `sintaks-modern.md` · `peta-unit.md` · `belajar-javascript/AUDIT-CAKUPAN.md`
