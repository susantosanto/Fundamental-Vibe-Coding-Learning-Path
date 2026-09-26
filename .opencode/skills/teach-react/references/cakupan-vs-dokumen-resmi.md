# Cakupan vs Dokumen Resmi — apakah materi ini selengkap react.dev & MDN?

> **Pertanyaan yang diaudit** (xcode, 26 Sep 2026):
> *"apakah materi yang akan di ajarkan sudah lengkap selengkap materi dari dokumen resmi
> javascript, mdn, dll ? jika belum lengkap tolong tambahkan"*
>
> **Jawaban singkat: TIDAK — dan tidak seharusnya. Tapi ada 4 celah nyata. Sudah ditambal.**
>
> **Diaudit:** 26 September 2026 · **Sumber dibuka langsung:** react.dev §Learn,
> react.dev §Reference: Hooks, MDN §Learn web development / Core
> · **Status:** celah nyata ditambal, sisanya sengaja dilewati

---

## 1. Kenapa "selengkap react.dev" bukan target yang benar

react.dev dan materi ini adalah **dua benda yang berbeda jenis**:

| | react.dev / MDN | Materi ini |
|---|---|---|
| Jenis | **Referensi + tutorial** | **Kurikulum** |
| Susunan | Per bab, bisa dibaca dari mana saja | **Berurutan, ada gerbang** |
| Tujuan | "Apa saja yang bisa dilakukan React" | "Apa yang harus bisa kamu lakukan" |
| Kelengkapan | **Syarat** — kalau tidak lengkap, ia gagal | **Musuh** — makin lengkap, makin bercabang |
| Kalau ada 1 topik baru | Ditambahkan | Ditimbang dulu: melayani tujuan atau tidak |
| Cara pakai | Dicari saat butuh | Dijalani dari awal ke akhir |

Ada **satu perbedaan mendasar** yang lebih penting dari daftar bab mana pun:

> **react.dev mengajarkan cara MENULIS React. Skill ini mengajarkan cara MEMERIKSA React
> yang ditulis AI.**

react.dev tidak punya satu halaman pun tentang "kode yang terlihat benar tapi salah",
`key={index}`, atau "state dimutasi sehingga layar tidak berubah" — karena react.dev
mengasumsikan **penulisnya manusia yang belajar dengan benar**. Yang dihadapi pembelajar
di sini adalah **keluaran AI**, dan itu masalah yang berbeda.

Ditambah lagi: react.dev **tidak mengajarkan HTML dan CSS**. Ia mengasumsikannya sudah
dikuasai. Untuk pembelajar yang menjawab *"belum sama sekali"* — itu celah terbesar, dan
itulah alasan **Bagian 0** ada.

Karena itu pertanyaan yang benar bukan *"apakah selengkap react.dev?"*, tapi:

> **"Apakah ada yang HILANG padahal dibutuhkan untuk membaca & menilai kode React hasil AI
> — khususnya untuk aplikasi laporan keuangan sekolah?"**

Itu yang diaudit di bawah.

---

## 2. Audit 1 — react.dev §Learn (4 grup, 31 bab)

Sumber: `react.dev/learn` → empat grup: *Describing the UI*, *Adding Interactivity*,
*Managing State*, *Escape Hatches* (daftar bab diambil dari halaman indeks tiap grup).

### Describing the UI (9 bab)

| # | Bab react.dev | Status | Di mana / kenapa |
|---|---|---|---|
| 1 | Your First Component | ✅ ADA | Unit 7 |
| 2 | Importing and Exporting Components | ✅ ADA | Unit 14 (struktur file) |
| 3 | Writing Markup with JSX | ✅ ADA | Unit 7 — **ditambal**: `className`, `htmlFor`, elemen harus tertutup |
| 4 | JavaScript in JSX with Curly Braces | ✅ ADA | Unit 7 — **ditambal**: `style={{ }}` butuh dua kurung |
| 5 | Passing Props to a Component | ✅ ADA | Unit 8 |
| 6 | Conditional Rendering | ⚠️ **ditambal** | Unit 10 (`&&`, ternary) — **kurang**: jebakan `{0 && <X/>}` → §5 |
| 7 | Rendering Lists | ✅ ADA | Unit 10 — **ditambal**: kenapa `key={index}` berbahaya |
| 8 | Keeping Components Pure | ⚠️ **ditambal** | Unit 15 mengajarkan **bentuk praktisnya** (jangan mutasi) — tapi tidak menamai "pure function" secara eksplisit → §5 |
| 9 | Your UI as a Tree | ✅ ADA | Unit 14 (peta komponen) |

### Adding Interactivity (7 bab)

| # | Bab react.dev | Status | Di mana / kenapa |
|---|---|---|---|
| 1 | Responding to Events | ✅ ADA | Unit 9 (`onClick`) |
| 2 | State: A Component's Memory | ✅ ADA | Unit 9 |
| 3 | Render and Commit | ⚠️ **ditambal** | Unit 9 — "menetapkan state = minta render ulang", tapi dua fase render/commit tidak dinamai |
| 4 | State as a Snapshot | ❌ **DITAMBAH** | **Unit 9 diperluas** — "kenapa nilai state tidak berubah di baris berikutnya" → §5 Celah 1 |
| 5 | Queueing a Series of State Updates | ❌ **DITAMBAH** | **Unit 9 diperluas** — "kenapa dua kali `setN(n+1)` hanya menambah 1" → §5 Celah 1 |
| 6 | Updating Objects in State | ✅ ADA | Unit 15 |
| 7 | Updating Arrays in State | ✅ ADA | Unit 15 ⭐ (unit terpenting) |

### Managing State (7 bab)

| # | Bab react.dev | Status | Di mana / kenapa |
|---|---|---|---|
| 1 | Reacting to Input with State | ✅ ADA | Unit 13 |
| 2 | Choosing the State Structure | ⚠️ **ditambal** | Unit 14 (sebagian) — **kurang**: state berlebih/bertentangan → §5 |
| 3 | Sharing State Between Components | ✅ ADA | Unit 14 ("state naik") |
| 4 | Preserving and Resetting State | ❌ **DITAMBAH** | **Unit 14 diperluas** — "kenapa state saya hilang / tidak mau hilang" → §5 Celah 2 |
| 5 | Extracting State Logic into a Reducer | ⛔ sengaja | `useReducer` cukup dikenali (`sintaks-react.md` §E) |
| 6 | Passing Data Deeply with Context | ⛔ sengaja | `useContext` cukup dikenali. "State naik" (Unit 14) lebih dasar |
| 7 | Scaling Up with Reducer and Context | ⛔ sengaja | Pola lanjutan; bukan sumber bug yang dihadapi sekarang |

### Escape Hatches (8 bab)

| # | Bab react.dev | Status | Di mana / kenapa |
|---|---|---|---|
| 1 | Referencing Values with Refs | ⚠️ **ditambal** | `useRef` di `sintaks-react.md` §E — cukup dikenali |
| 2 | Manipulating the DOM with Refs | ⛔ sengaja | Kebutuhan penulis library, bukan pembaca kode aplikasi |
| 3 | Synchronizing with Effects | ✅ ADA | Unit 11 |
| 4 | You Might Not Need an Effect | ✅ ADA | Unit 11 (disebut eksplisit) |
| 5 | Lifecycle of Reactive Effects | ⚠️ **ditambal** | Unit 11 (cleanup) — **kurang**: istilah "re-sync" tidak dipakai; konsepnya ada |
| 6 | Separating Events from Effects | ⛔ sengaja | `useEffectEvent` — fitur baru, belum lazim |
| 7 | Removing Effect Dependencies | ✅ ADA | Unit 11, 16 — **ditambal**: "menghapus dependency bukan solusi" |
| 8 | Reusing Logic with Custom Hooks | ⛔ sengaja | Membuat hook = **produksi**, bukan inspeksi |

**Ringkas: 17 bab ✅ · 8 bab ⚠️ ditambal · 2 bab ❌ ditambah · 12 bab ⛔ sengaja dilewati.**

---

## 3. Audit 2 — react.dev §Reference: Hooks (17 hook)

Sumber: `react.dev/reference/react/hooks` — enam kategori.

| Kategori | Hook | Status |
|---|---|---|
| **State** | `useState` | ✅ Unit 9 |
| | `useReducer` | ⚠️ dikenali (`sintaks-react.md` §E) |
| **Context** | `useContext` | ⚠️ dikenali |
| **Ref** | `useRef` | ⚠️ dikenali — **penting** untuk memahami "nilai yang tidak memicu render" |
| | `useImperativeHandle` | ⛔ sengaja |
| **Effect** | `useEffect` | ✅ Unit 11, 16 |
| | `useLayoutEffect` | ⛔ sengaja |
| | `useInsertionEffect` | ⛔ sengaja |
| | `useEffectEvent` | ⛔ sengaja (fitur baru) |
| **Performance** | `useMemo` | ⚠️ **cukup dikenali** — Unit 16 eksplisit: *bukan optimasi wajib* |
| | `useCallback` | ⚠️ cukup dikenali |
| | `useTransition` | ⛔ sengaja |
| | `useDeferredValue` | ⛔ sengaja |
| **Other** | `useDebugValue` | ⛔ sengaja (untuk penulis library) |
| | `useId` | ⛔ sengaja |
| | `useSyncExternalStore` | ⛔ sengaja (untuk penulis library) |
| | `useActionState` | ⛔ sengaja (berkaitan Server Actions) |

**Yang penting untuk tujuan ini hanya 4: `useState`, `useEffect`, `useRef`, dan
`useMemo`/`useCallback` (sebagai "cukup dikenali").** Sisanya ada untuk kelengkapan
referensi, bukan untuk inspeksi kode aplikasi.

> **Catatan tambahan:** `memo()` dan `<StrictMode>` **bukan** hook, tapi dua bentuk yang
> sering muncul dan sering disalahpahami. Keduanya ada di `sintaks-react.md` §E —
> `<StrictMode>` ditandai 🔴 karena **menjalankan komponen dua kali di mode dev**, yang
> mudah dikira bug.

---

## 4. Audit 3 — MDN HTML & CSS (prasyarat Bagian 0)

Sumber: `developer.mozilla.org/en-US/docs/Learn_web_development/Core`

Bagian 0 adalah **tambahan yang tidak ada di react.dev sama sekali**. Isinya diaudit
terhadap modul Core MDN.

| Modul MDN Core | Status | Di mana / kenapa |
|---|---|---|
| **Structuring content with HTML** | ✅ ADA | Unit 1 — **ditambal**: elemen kosong (`<input>`, `<img>`) tidak punya penutup |
| **CSS styling basics** | ✅ ADA | Unit 2 — selektor, spesifisitas, `!important` sebagai tanda masalah |
| CSS text styling | ⚠️ **ditambal** | Unit 2 (font, warna) — **kurang**: `text-align`, `line-height` → `sintaks-react.md` §B |
| **CSS layout** | ⚠️ **ditambal** | Unit 4 (flexbox) · Unit 5 (grid, `@media`, satuan) — **kurang**: `position`/`z-index`/`overflow` → dikenali di `sintaks-react.md` §B, tanpa unit |
| Dynamic scripting with JavaScript | ✅ **didelegasikan** | `/teach-javascript` — dan diperiksa sebagai prasyarat di `SKILL.md` §Prasyarat JS |
| JavaScript frameworks and libraries | ✅ ADA | **Ini skill-nya** |
| **Accessibility** | ❌ **DITAMBAH** | **Kriteria review Unit 17** + 3 baris cacat di `korpus-ai.md` → §5 Celah 3 |
| Design for developers | ⛔ sengaja | Teori desain, bukan kemampuan inspeksi kode |
| Version control (Git) | ⛔ sengaja | Bukan React. Ada di jalur lain |

**Yang sengaja tidak diambil dari MDN Core:** animasi CSS, custom fonts, floats,
`box-shadow` mendalam, dan seluruh modul JavaScript (sudah punya skill sendiri).

---

## 5. Yang benar-benar hilang — dan sudah ditambal

### Celah 1 — Dua pertanyaan state yang paling sering ditanyakan

react.dev punya **dua bab** khusus untuk ini (`State as a Snapshot`, `Queueing a Series of
State Updates`). Materi awal hanya mengajarkan **bentuk** `setN(n => n + 1)` tanpa
mengajarkan **kenapa** bentuk itu ada.

Akibatnya dua pertanyaan ini tidak bisa dijawab:

| Pertanyaan pembelajar | Jawaban yang benar |
|---|---|
| *"Saya panggil `setN(n+1)` lalu `console.log(n)`, kok masih nilai lama?"* | State itu **snapshot** — nilai `n` di baris itu milik render saat ini, bukan nilai baru |
| *"Saya panggil `setN(n+1)` dua kali, kok cuma nambah 1?"* | React **mengantre** pembaruan. Dua kali dengan nilai yang sama = satu pembaruan. Yang benar: `setN(n => n+1)` dua kali |

**Tambalan:** Unit 9 diperluas dengan dua blok baru —
**"⭐ Dua model mental yang WAJIB dinamai"** (potret/snapshot + dua fase render→commit)
dan **"⭐ Pertanyaan ketiga — mengantre"** (kenapa dua kali `setN(n+1)` hanya menambah 1,
dan kenapa bentuk fungsi `setN(n => n+1)` memperbaikinya) — plus satu latihan **LACAK
wajib** yang membandingkan bentuk nilai vs bentuk fungsi.

### Celah 2 — Kapan state dipertahankan, kapan direset

react.dev punya bab khusus `Preserving and Resetting State`. Materi awal tidak
menyentuhnya — padahal ini sumber keluhan nyata:

- *"State saya hilang saat pindah tab."*
- *"State tidak mau hilang padahal datanya sudah ganti."*
- *"Saya hapus satu baris, tapi nilai di baris berikutnya ikut pindah."*

Ketiganya satu sebab: **identitas komponen**. React menyimpan state berdasarkan **posisi &
`key`** di pohon, bukan berdasarkan nama variabel. Ini juga **menjelaskan kenapa
`key={index}` berbahaya** (Unit 10) — jadi ia menyambung dua unit yang tadinya terpisah.

**Tambalan — dua tempat, karena ada dua sebab yang berbeda:**

1. **Unit 10 diperluas** — `key` diberi **fungsi kedua**: selain "mengenali item mana yang
   mana", mengganti `key` juga **mereset state** komponen itu. Ditambah cacat AI
   `key={Math.random()}` (mereset terus) dan `key={item.nama}` (reset saat nama berubah),
   plus latihan TELUSUR "isian hilang sendiri saat data diperbarui".
2. **Unit 14 diperluas** — blok **"Kapan state dipertahankan, kapan direset"** untuk
   sub-kasus **posisi**: komponen yang disembunyikan (`{tampil && <Form />}`) kehilangan
   statenya; komponen yang ditukar urutannya bisa tertukar statenya. Ditambah satu
   latihan TELUSUR + satu miskonsepsi ("state mengikuti **nama** komponen" — padahal
   **posisi**).

### Celah 3 — Aksesibilitas: cacat yang paling sering dihasilkan AI

MDN menaruh Accessibility sebagai modul Core. Materi awal tidak menyentuhnya sama sekali.
Padahal ini justru **cacat khas kode AI** yang tidak menimbulkan error apa pun:

| Cacat | Kenapa salah |
|---|---|
| `<div onClick={...}>` sebagai tombol | Tidak bisa diakses lewat keyboard, tidak dikenal pembaca layar |
| `<img>` tanpa `alt` | Pembaca layar tidak tahu isinya |
| `<label>` tanpa `htmlFor` | Klik teks tidak memfokuskan input; pembaca layar tidak tahu pasangannya |
| `<div>` untuk judul, bukan `<h2>` | Struktur halaman tidak terbaca |

**Tambalan:** tiga baris baru di `korpus-ai.md` §3 (cacat khas AI: `<div onClick>` alih-alih
`<button>`, `<img>` tanpa `alt`, `<div>` untuk judul) + dua baris baru di
`sintaks-react.md` §D, dan aksesibilitas masuk sebagai **kriteria "satu risiko"** di
review Unit 17 (ditambah latihan "temukan cacat yang hanya terlihat dengan keyboard").
**Bukan unit baru** — supaya jumlah unit tidak bertambah.

### Celah 4 — JSX yang "terlihat benar" tapi salah

Bukan dari daftar bab mana pun, tapi dari pola kode AI nyata:

| Bentuk | Yang terjadi |
|---|---|
| `{0 && <X />}` | Menampilkan angka `0` di layar (karena `0` falsy tapi tetap dicetak) |
| `style={{ fontSize: 14 }}` | Butuh **dua** kurung; nama properti **camelCase** |
| `class` alih-alih `className` | Atribut **diabaikan diam-diam**, gaya hilang |

**Tambalan:** ketiganya masuk `sintaks-react.md` §D dengan tanda 🔴.

---

## 6. Yang SENGAJA tidak ditambahkan

Bukan karena tidak lengkap — tapi karena **menambah beban tanpa menambah kemampuan**.

| Topik | Alasan |
|---|---|
| **Next.js, Remix, TanStack Start** | Bukan React — framework di atasnya (routing, server, build). Materi tersendiri |
| **React Server Components, Server Actions, directives** | Butuh pemahaman server. Bukan sumber bug yang dihadapi pembelajar sekarang |
| **Redux, Zustand, Jotai, MobX** | Bukan prasyarat untuk **membaca** kode React. Menambah lapisan konsep baru |
| **React Router** | Topik routing, bukan inspeksi komponen |
| **TanStack Query, SWR, Apollo** | Library pengambilan data. Unit 12 sudah mengajarkan polanya |
| **`useMemo`/`useCallback`/`memo` sebagai optimasi** | Bukan sumber bug utama (Unit 16). Cukup dikenali |
| **React Compiler** | Alat build-time. Kalau sudah dipakai, sebagian besar kode `useMemo` hilang sendiri |
| **Testing (RTL, Vitest, Playwright)** | Menulis test = **produksi**, bukan inspeksi |
| **Suspense, `lazy`, Error Boundary, Portals** | Fitur lanjutan; jarang jadi sumber kebingungan awal |
| **`useReducer` + Context secara mendalam** | Pola skala besar. Cukup dikenali |
| **TypeScript** | Bahasa lain. Bisa ditambahkan setelah dasar ini kokoh |
| **TailwindCSS** | Materi tersendiri (direncanakan). Bagian 0 mengajarkan CSS dulu — tanpa itu Tailwind cuma hafalan kelas |
| **CSS-in-JS (styled-components, emotion)** | Pilihan gaya, bukan konsep React |
| **Animasi (framer-motion, GSAP)** | Pustaka pihak ketiga |
| **Modul MDN: Design for developers, Version control** | Bukan kemampuan inspeksi kode React |
| **Seluruh halaman MDN CSS/HTML** | Referensi lengkap. Dipakai saat MDN kurang tegas, bukan dihafal |

**Prinsipnya:** kamus sintaks untuk **mengenali**, bukan menghafal. Kalau sebuah bentuk
muncul dan pembelajar bisa menjawab *"ini apa, dan apa risikonya"* — itu sudah cukup.

---

## 7. Bentuk akhir materi

```
SEBELUM AUDIT :  18 unit · 4 bagian · 4 gerbang · 5 file skill
SESUDAH AUDIT :  18 unit · 4 bagian · 4 gerbang · 6 file skill
                 (jumlah unit TIDAK bertambah — celah ditambal ke unit yang ada)
                 + Bagian 0 (prasyarat HTML/CSS) — tidak ada di react.dev
                 + kamus ± 90 bentuk HTML/CSS/JSX
```

| File skill | Isi |
|---|---|
| `SKILL.md` | Router, mode penyampaian, izin research, asesmen 6 pertanyaan, prasyarat JS, anti-pattern |
| `references/roadmap-4-tingkat.md` | Bagian, 4 gerbang, bentuk sesi, aturan AI, batas kejujuran |
| `references/peta-unit.md` | **18 unit**: konsep, sintaks yang dikenali, latihan inspeksi, kriteria lulus |
| `references/korpus-ai.md` | Korpus kode AI + 4 latihan inspeksi (LACAK · SUSUN · KLAIM · TELUSUR) |
| **`references/sintaks-react.md`** | **Kamus HTML/CSS/JSX + tingkat bahaya** |
| **`references/cakupan-vs-dokumen-resmi.md`** | **File ini — audit cakupan** |

**Yang membedakan dari react.dev (dan bukan celah):**

| | react.dev | Skill ini |
|---|---|---|
| Prasyarat HTML/CSS | Diasumsikan sudah bisa | **Bagian 0 — wajib, 6 unit** |
| Asal kode latihan | Contoh buatan penulis | **Kode hasil generate AI** |
| Tujuan | Bisa **menulis** React | Bisa **memeriksa** React |
| Bentuk latihan | Latihan menulis | LACAK · SUSUN · KLAIM · **TELUSUR** |
| Gerbang | Tidak ada | **4 gerbang** dengan kriteria terukur |

---

## 8. Batas kejujuran

- **Yang diaudit adalah KELENGKAPAN, bukan EFEKTIVITAS.** Apakah materi ini benar-benar
  membuat xcode bisa memeriksa kode React hasil AI — hanya bisa dibuktikan dengan
  menjalankannya.
- **Tingkat bahaya (🔴🟡⚪) adalah penilaian, bukan hasil riset.** Dasarnya: frekuensi
  kemunculan di kode hasil AI + apakah bugnya menimbulkan error atau tidak. **Belum diukur.**
- **Daftar "cacat khas kode React hasil AI" belum divalidasi.** Ia disusun dari pola yang
  dikenal, bukan dari analisis korpus besar. Kalau di proyek nyata xcode menemukan cacat
  yang tidak ada di daftar → **tambahkan**, itu tanda daftarnya perlu diperbarui.
- **Urutan Bagian 0 → Bagian 1 belum diuji.** Alasannya masuk akal (React adalah lapisan
  di atas HTML/CSS), tapi belum ada bukti bahwa 6 unit itu jumlah yang tepat.
- **Audit ini memakai `react.dev` pada 26 Sep 2026** dengan 4 grup Learn (31 bab) dan 17
  hook. react.dev bisa menambah/mengubah bab — **daftar ini perlu ditinjau ulang** kalau
  pembelajar menemukan istilah yang tidak dikenal di dokumentasi resmi.
- **"Sengaja dilewati" bisa salah.** Kalau pembelajar tersandung pada salah satu topik itu
  di proyek nyata, itu tanda daftar ini perlu ditinjau — bukan tanda pembelajar yang kurang.
- **Bagian 0 tidak menggantikan `/teach-javascript`.** Skill ini hanya memastikan
  **prasyaratnya** (HTML/CSS + 5 konsep JS), bukan mengajarkan JavaScript.

---

**📅 Dibuat:** 26 September 2026
**📚 Terkait:** `sintaks-react.md` · `peta-unit.md` · `korpus-ai.md` ·
`teach-javascript/references/cakupan-vs-mdn.md` (audit versi JavaScript)

**Sumber yang dibuka langsung (26 Sep 2026) — dan apa yang dikonfirmasi:**

| URL | Dikonfirmasi |
|---|---|
| `react.dev/learn/describing-the-ui` | **9 bab** — Your First Component · Importing and Exporting Components · Writing Markup with JSX · JavaScript in JSX with Curly Braces · Passing Props to a Component · Conditional Rendering · Rendering Lists · Keeping Components Pure · Your UI as a Tree |
| `react.dev/learn/adding-interactivity` | **7 bab** — Responding to Events · State: A Component's Memory · Render and Commit · State as a Snapshot · Queueing a Series of State Updates · Updating Objects in State · Updating Arrays in State |
| `react.dev/learn/managing-state` | **7 bab** — Reacting to input with state · Choosing the state structure · Sharing state between components · Preserving and resetting state · Extracting state logic into a reducer · Passing data deeply with context · Scaling up with reducer and context |
| `react.dev/learn/escape-hatches` | **8 bab** — Referencing values with refs · Manipulating the DOM with refs · Synchronizing with Effects · You Might Not Need An Effect · Lifecycle of reactive effects · Separating events from Effects · Removing Effect dependencies · Reusing logic with custom Hooks |
| `react.dev/reference/react/hooks` | **17 hook, 6 kategori** — State (2) · Context (1) · Ref (2) · Effect (4) · Performance (4) · Other (4) |
| `developer.mozilla.org/en-US/docs/Learn_web_development/Core` | Modul HTML, CSS, JavaScript, Frameworks, **Accessibility** |

**Total: 31 bab Learn + 17 hook** — cocok dengan tabel di §2 dan §3 di atas.

> **Batas:** yang diverifikasi adalah **judul bab dan jumlahnya**, bukan setiap kalimat di
> dalamnya. MDN §Core diverifikasi hanya pada tingkat **daftar modul**, bukan isi tiap modul.
