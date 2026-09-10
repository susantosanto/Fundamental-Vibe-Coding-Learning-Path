# 🤖 Modul 23: Arsitektur Integrasi AI — Menambahkan Fitur Chat AI ke Aplikasi Anda

> **"Chat AI di aplikasi Anda = aplikasi Anda yang memanggil otak AI (LLM) lewat API — dengan arsitektur yang benar."**
> Waktu: ~6-8 jam (bisa dipecah) | Level: 🟡🔴 Intermediate → Advanced | Lanjutan dari: Modul 16 (Networking), 17 (API), 18 (VPS), 22 (Arsitektur Desain Sistem)

---

## 📖 APA YANG AKAN KAMU PELAJARI

```
✅ Arsitektur DASAR integrasi chat AI (alur data, bukan kode!)
✅ Kenapa API key TIDAK BOLEH di frontend (alasan arsitektur)
✅ Streaming: bagaimana jawaban AI datang "mengetik" di layar
✅ RAG: cara aplikasi besar "paham" data milik Anda sendiri
✅ AI Gateway: memakai banyak model (Gemini, Grok, ChatGPT, dll) dari satu pintu
✅ Peta provider: Gemini, ChatGPT, Grok, DeepSeek, FLUX, PuterJS, OpenRouter
✅ Studi kasus nyata: ChatGPT, GitHub Copilot, Perplexity, Notion AI
✅ Keamanan: prompt injection, rate limit, biaya, privasi
✅ Contoh kasus: integrasi chat AI ke aplikasi ReactJS Anda
```

> 🎯 **Penting — beda dengan materi lain:**
> Modul ini **TIDAK** membahas cara menulis kode integrasi.
> Modul ini membahas **ARSITEKTUR dan ALUR DATA** — dari pengguna
> mengetik pesan, sampai jawaban AI muncul di layar. Begitu Anda
> paham alurnya, kode apa pun (Gemini, ChatGPT, DeepSeek, Grok)
> jadi mudah karena polanya SAMA.

---

## 🧠 23.1 MULAI DARI PERTANYAAN BESAR: "AI ITU DI MANA?"

### 23.1.1 Kenapa Ini Pertanyaan Arsitektur, Bukan Soal Kode

Sebelum menulis kode, arsitek bertanya:

```text
"Di mana otak AI berada?"

PILIHAN 1: AI DI LUAR (API)        PILIHAN 2: AI DI SERVER ANDA
┌─────────┐  internet  ┌────────┐  ┌─────────────────────┐
│ Aplikasi│ ─────────▶ │ Gemini │  │ Aplikasi + Ollama   │
│ Anda    │            │ ChatGPT│  │ di VPS (Modul 18.16)│
│         │ ◀───────── │ Grok   │  └─────────────────────┘
└─────────┘            │ DeepSeek│
                       └────────┘
Bayar per token          Model gratis (llama3.2)
Cepat setup, tak perlu    Perlu VPS kuat (RAM besar)
GPU, paling umum          GPU untuk model besar
```

> 🎯 **Jawaban singkat untuk Anda:** untuk fitur chat AI di aplikasi
> ReactJS, pilihan paling umum & praktis = **AI DI LUAR (API)** —
> inilah yang dipakai hampir semua aplikasi besar. Modul ini fokus
> ke sana. (Opsi server sendiri sudah dibahas di Modul 18.16.)

### 23.1.2 Satu Diagram yang Menjelaskan Semuanya (Alur Data Dasar)

```text
INI ADALAH JANTUNG MODUL INI. PAHAMI INI, SEMUA BERES.

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  FRONTEND    │      │   BACKEND ANDA   │      │  LLM PROVIDER    │
│  (ReactJS)   │      │   (Node/Next)    │      │ (Gemini/ChatGPT) │
│              │      │                  │      │                  │
│ 1. User      │  2.  │ 3. Auth cek user │  4.  │ 6. Model         │
│    ketik     │ POST │ 4. Rate limit    │ POST │    membaca pesan │
│    pesan ────┼────▶ │ 5. Simpan history│─────▶│ 7. Buat jawaban  │
│              │      │    + API key     │      │                  │
│ 9. Jawaban   │      │                  │  8.  │ 6. Jawaban       │
│    muncul ───┼◀─────│ relay balik      │◀─────│    (streaming)   │
│    bertahap  │ SSE  │ (streaming)      │ SSE  │                  │
└──────────────┘      └──────────────────┘      └──────────────────┘
```

```text
ALUR ANGKA DEMI ANGKA:
1. User mengetik pesan di React (mis. "Apa syarat pinjam buku?")
2. Frontend mengirim ke BACKEND ANDA (bukan ke Gemini langsung!)
3. Backend cek: user login? boleh pakai fitur ini?
4. Backend cek batas: sudah berapa kali user memakai hari ini?
5. Backend menyusun pesan + menyimpan history percakapan
6. Backend memanggil API provider (Gemini/ChatGPT/dll) — DENGAN API key
7. Provider memproses & mulai mengirim jawaban bertahap (streaming)
8. Backend meneruskan (relay) potongan jawaban ke frontend
9. React menampilkan jawaban sedikit demi sedikit — seperti mengetik!
```

> ⚠️ **TITIK PALING PENTING: langkah 2 → 5 (lewat backend).**
> Frontend TIDAK PERNAH memanggil Gemini/ChatGPT langsung.
> Inilah keputusan arsitektur #1 yang membedakan aplikasi serius
> dari aplikasi belajar. Kenapa? Baca 23.2.

---

## 🧠 23.2 KEPUTUSAN ARSITEKTUR #1: API KEY HARUS DI BACKEND

### 23.2.1 Kenapa Tidak Boleh di Frontend?

```text
FRONTEND (browser) = kode yang DIBUKA oleh pengguna.

Siapa pun bisa buka Developer Tools (F12) dan melihat
SEMUA yang ada di JavaScript aplikasi Anda — termasuk
API key kalau terlanjur ditaruh di sana!

❌ SALAH (jangan ditiru):
API key di frontend → siapa pun mencurinya → mereka memakai
kuota AI Anda → tagihan membengkak → key dicabut.

✅ BENAR:
API key hanya di backend → pengguna tidak pernah melihatnya.
```

| Lokasi API Key | Risiko | Dipakai Aplikasi Besar? |
|----------------|--------|--------------------------|
| Frontend (browser) | ❌ Bocor, disalahgunakan, tagihan membengkak | Tidak pernah |
| Backend Anda (server) | ✅ Aman — user tidak bisa lihat | ✅ Selalu |

> 🎯 **Analoginya:** API key = kunci rumah. Anda tidak menggantung
> kunci rumah di pintu depan (frontend) — Anda simpan di dalam
> (backend), dan tamu (user) meminta Anda untuk membukakan pintu.

### 23.2.2 Backend Sebagai "Pintu Terjaga" (Proksi)

```text
BACKEND ANDA BUKAN SEKADAR PENYAMBUNG — ini PINTU TERJAGA yang:

1. AUTH      → user ini siapa? login belum? (Modul 17: JWT)
2. OTORISASI → user ini BOLEH pakai fitur AI? (free? premium?)
3. RATE LIMIT→ batasi pemakaian (mis. 20 pesan/hari/user)
4. BIAYA     → catat token & biaya per user
5. PRIVASI   → saring data sensitif (NIK, password) sebelum dikirim
6. MODERASI  → cek konten tidak pantas sebelum masuk ke AI
7. LOGGING   → simpan riwayat untuk debugging & audit
```

> 🤖 **Prompt AI untuk merancang lapisan ini:**
> ```text
> Saya mau menambahkan fitur chat AI ke aplikasi [ReactJS/Next.js] saya.
> JANGAN menulis kode. Rancang arsitektur lapisan backend-nya:
> 1. Endpoint apa saja yang perlu ada (method, path, apa yang diterima)
> 2. Di titik mana auth, rate limit, dan logging harus dipasang
> 3. Bagaimana API key disimpan dan dipakai (tanpa bocor ke frontend)
> 4. Format JSON yang dikirim frontend → backend, dan backend → frontend
> Jelaskan alur datanya dengan diagram. Saya pemula.
> ```

---

## 🧠 23.3 ARSITEKTUR STREAMING: KENAPA JAWABAN AI "MENGETIK"?

### 23.3.1 Masalahnya: AI Butuh Waktu

```text
AI menghasilkan jawaban KATA DEMI KATA, butuh 2-10 detik.

❌ TANPA STREAMING (tunggu selesai dulu):
User kirim pesan → diam 10 detik → jawaban muncul SEMUA sekali.
   → User mengira aplikasi rusak / hang!

✅ DENGAN STREAMING (dikirim bertahap):
User kirim pesan → kata pertama muncul dalam 0,5 detik
   → teks terus bertambah → terasa "mengetik" seperti ChatGPT.
   → User merasa cepat & hidup!
```

### 23.3.2 Dua Cara Streaming (dan Kenapa Chat AI Pakai SSE)

| Aspek | SSE (Server-Sent Events) ⭐ | WebSocket |
|-------|------------------------------|-----------|
| Arah aliran | Server → klien (satu arah) | Dua arah (klien ⇄ server) |
| Basis | HTTP biasa | Koneksi TCP khusus |
| Auto-reconnect | ✅ Bawaan | ❌ Harus buat sendiri |
| Kompatibilitas CDN/proksi | ✅ Bagus | ⚠️ Perlu konfigurasi khusus |
| Dipakai untuk | **Chat AI, notifikasi, update berita** | Game real-time, chat antar-user, kolaborasi |
| Beda paling penting | Satu arah — pas untuk jawaban AI | Dua arah — pas untuk saling kirim |

```text
ALUR SSE DI CHAT AI:
1. Frontend mengirim pesan (POST biasa)
2. Backend memanggil provider dengan stream: true
3. Provider mengirim potongan jawaban bertahap:
   data: "Selamat"    → frontend tampilkan "Selamat"
   data: " datang,"   → frontend tambah → "Selamat datang,"
   data: " bagaimana" → frontend tambah → "Selamat datang, bagaimana"
   ...
   data: [DONE]       → frontend tahu selesai
4. Browser menampilkan teks yang terus bertambah
```

> 🎯 **Analogi SSE:** menonton pertandingan sepak bola via radio —
> penyiar (server) mengirim komentar bertahap, Anda (klien) hanya
> mendengarkan. WebSocket = telepon dua arah (Anda bisa bicara balik).

### 23.3.3 Kapan Pakai Yang Mana? (Keputusan Praktis)

```text
✅ SSE — chat AI, pemberitahuan, feed yang update sendiri
   → karena chat AI: user kirim sekali, jawaban panjang mengalir.

✅ WebSocket — chat antar MANUSIA real-time, game, kolaborasi
   → karena dua arah terus-menerus.

Chat AI dengan fitur "tool approval" (AI minta izin user)
bisa butuh WebSocket. Tapi untuk 95% chat AI → SSE cukup.
```

> 💡 **Fakta arsitektur:** ChatGPT, Claude, dan hampir semua chatbot
> besar memakai SSE untuk streaming jawaban. WebSocket bukan pilihan
> pertama untuk kasus ini.

---

## 🧠 23.4 POLA RAG: MEMBUAT AI "PAHAM" DATA ANDA

### 23.4.1 Masalah Dasar: AI Tidak Tahu Data Anda

```text
Model AI dilatih dengan data publik sampai titik waktu tertentu.
Dia TIDAK TAHU:
- isi database perpustakaan sekolah Anda
- dokumen kebijakan internal Anda
- data user yang baru saja masuk hari ini

Kalau Anda tanya langsung: "Berapa stok buku Laskar Pelangi?"
→ AI tidak tahu → mengarang (halusinasi) atau bilang tidak tahu.
```

### 23.4.2 Solusinya: RAG (Retrieval-Augmented Generation)

```text
RAG = beri AI "catatan tempel" yang relevan sebelum dia menjawab.

RAG = AMBIL data yang relevan → TEMPEL ke prompt → BARU minta AI jawab.
```

**Dua tahap RAG (sumber: buku AI Engineering, bab 6):**

```text
TAHAP A — INDEXING (sekali saja, saat data masuk):
┌──────────┐   ┌───────────────┐   ┌───────────────┐   ┌──────────────┐
│ Dokumen  │──▶│ Chunking      │──▶│ Embedding     │──▶│ Vector DB    │
│ (buku,   │   │ (pecah jadi   │   │ (ubah teks jadi│   │ (simpan      │
│ kebijakan)│   │  potongan)   │   │  vektor angka) │   │  vektor)     │
└──────────┘   └───────────────┘   └───────────────┘   └──────────────┘

TAHAP B — QUERY (setiap kali user bertanya):
┌──────────────┐   ┌───────────────┐   ┌───────────────┐
│ User bertanya │──▶│ Embedding     │──▶│ Vector DB     │
│ "stok buku X?"│   │ pertanyaan    │   │ cari vektor   │
└──────────────┘   └───────────────┘   │ terdekat      │
                                      └───────┬───────┘
                                             │ ambil 3-5 potongan
                                             ▼
┌──────────────────────────────────────────────────────────┐
│ PROMPT AKHIR (dibangun backend):                          │
│ "Jawab berdasarkan informasi ini: [potongan 1] [2] [3]   │
│  Pertanyaan user: stok buku X?                            │
│  Jawab dengan data di atas — kalau tidak ada, katakan    │
│  tidak tahu, jangan mengarang."                           │
└──────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                                     LLM (Gemini/dll)
                                             │
                                             ▼
                                   Jawaban BERDASAR data Anda ✅
```

### 23.4.3 Istilah yang Wajib Dikenal

| Istilah | Arti sederhana | Analogi |
|---------|----------------|---------|
| **Chunking** | Pecah dokumen jadi potongan kecil | Memotong buku jadi bagian-bagian |
| **Embedding** | Ubah teks jadi deretan angka yang "mengerti makna" | Memberi setiap kalimat "sidik jari makna" |
| **Vector DB** | Database khusus menyimpan embedding | Lemari arsip yang bisa dicari "berdasarkan makna" |
| **Vector search** | Cari potongan yang maknanya paling dekat | "Kalimat mana yang maknanya mirip pertanyaan?" |
| **Context** | Potongan relevan yang ditempel ke prompt | Catatan tempel untuk AI |

### 23.4.4 Vector Database Populer (pilihan nyata di industri)

| Vector DB | Kelebihan | Kapan dipakai |
|-----------|-----------|---------------|
| **pgvector** (ekstensi PostgreSQL) ⭐ | Pakai database yang SUDAH Anda punya (Modul 15!) | Aplikasi kecil-menengah, tidak mau tambah layanan |
| **Pinecone** | Terkelola penuh, tinggal pakai | Tim yang mau cepat tanpa urus server |
| **Weaviate / Qdrant** | Open source, fitur kaya | Perlu kontrol penuh |
| **Chroma** | Ringan, cocok belajar | Prototype & belajar RAG |

> 🎯 **Untuk Anda:** mulai dari **pgvector** — karena Anda sudah belajar
> PostgreSQL di Modul 15, tinggal tambah ekstensi. Tidak perlu layanan baru.

### 23.4.5 Kapan Anda BUTUH RAG? (Jujur)

```text
✅ BUTUH RAG kalau:
   • Chat harus menjawab soal DATA ANDA (stok buku, aturan sekolah,
     dokumen internal, riwayat user)
   • Ingin mengurangi halusinasi dengan data nyata

❌ TIDAK PERLU RAG dulu kalau:
   • Chat cuma "ngobrol umum" (tanya apa saja, jawab pengetahuan umum)
   • Basis pengetahuan kecil (< ~200.000 token / ±500 halaman)
     → cukup tempel semua teks ke prompt, tanpa RAG (saran resmi
       Anthropic). Mulai dari sini!
```

> 💡 **Rekomendasi bertahap:** mulai dari chat biasa (23.3) →
> kalau butuh jawab data sendiri → upgrade ke RAG. Jangan bangun
> RAG sebelum chat biasa jalan.

---

## 🧠 23.5 POLA AI GATEWAY: SATU PINTU UNTUK BANYAK MODEL

### 23.5.1 Masalah: Banyak Model, Banyak API, Banyak Format

```text
Anda ingin bisa pakai: Gemini, ChatGPT, Grok, DeepSeek — beda provider.

TANPA gateway:
- Tiap provider punya endpoint & format sendiri
- Kode berubah tiap ganti model
- Tidak ada cadangan (fallback) jika satu provider error

DENGAN gateway:
- SATU endpoint, SATU format (OpenAI-compatible)
- Ganti model = ganti nama model saja
- Auto fallback jika satu provider down
```

### 23.5.2 Alur Data Melalui Gateway

```text
┌────────────┐   format OpenAI   ┌────────────────┐  terjemahkan  ┌──────────┐
│  BACKEND   │ ────────────────▶ │   AI GATEWAY   │ ────────────▶ │ Provider │
│  Anda      │ ◀──────────────── │  (OpenRouter / │ ◀──────────── │ A (Gemini)│
└────────────┘    satu format    │   LiteLLM /    │               ├──────────┤
                                 │   Vercel AI SDK)               │ Provider │
                                 │                 │               │ B (Grok) │
                                 └────────────────┘               └──────────┘
```

### 23.5.3 Opsi Gateway yang Nyata Dipakai

| Alat | Apa itu | Cocok untuk |
|------|---------|-------------|
| **OpenRouter** | Gateway cloud: SATU key untuk 100+ model (OpenAI, Gemini, Grok, DeepSeek, dll), format OpenAI | Anda yang mau ganti-ganti model tanpa ganti kode; ada model gratis (`:free`) |
| **LiteLLM Proxy** | Proxy yang Anda jalan-kan sendiri (server), membungkus banyak provider dalam format OpenAI | Tim yang mau kontrol penuh & satu pintu internal |
| **Vercel AI SDK** | SDK (React/Next.js) yang mengabstraksi provider + streaming | Anda yang pakai Next.js (Modul 12) — paling mulus |
| **Portkey / Kong AI Gateway** | Gateway enterprise (routing, caching, observability) | Aplikasi besar yang butuh monitoring biaya serius |

> 🎯 **Rekomendasi untuk Anda (pemula yang pakai React/Next):**
> 1. Mulai: pilih SATU provider langsung (mis. Gemini — gratis) — tanpa gateway
> 2. Mau gampang ganti banyak model: **OpenRouter** (1 key, banyak model)
> 3. Pakai Next.js: **Vercel AI SDK** membuat streaming jauh lebih mudah
>
> Jangan pasang gateway sebelum chat biasa jalan. (Ingat prinsip Modul 22:
> evolusi, bukan lompatan!)

---

## 🧠 23.6 PETA PROVIDER AI (Hasil Verifikasi Dokumentasi Resmi)

> Ini peta model yang Anda sebutkan + cara aksesnya. Semua terverifikasi
> dari dokumentasi resmi. Fokus pada ARSITEKTUR (endpoint & alur), bukan kode.

### 23.6.1 Tabel Perbandingan

| Model | Endpoint Resmi | OpenAI-compatible? | Cara Dapat Key | Catatan |
|-------|----------------|--------------------|----------------|---------|
| **Gemini** (Google) | `generativelanguage.googleapis.com/v1beta` (+ `/v1beta/openai/` untuk format OpenAI) | ✅ Ya | **Gratis** di [AI Studio](https://aistudio.google.com/) | Free tier harian; model `gemini-2.5-flash` bagus untuk aplikasi Anda |
| **ChatGPT** (OpenAI) | `api.openai.com/v1/chat/completions` | ✅ (aslinya) | [platform.openai.com](https://platform.openai.com) | Standar industri; `stream: true` untuk SSE |
| **Grok** (xAI) | `api.x.ai/v1` | ✅ Ya | [console.x.ai](https://console.x.ai/) | Model `grok-2`/`grok-3`/`grok-4` |
| **DeepSeek** | `api.deepseek.com` | ✅ Ya | [platform.deepseek.com](https://platform.deepseek.com) | **Super murah**; `deepseek-chat` & `deepseek-reasoner` |
| **FLUX** (Black Forest Labs) | `bfl.ai` (docs.bfl.ml) | ⚠️ Bukan chat | Platform BFL / via gateway | ⚠️ **FLUX = GENERASI GAMBAR (text-to-image), BUKAN chat AI!** |
| **PuterJS** (puter.com) | Library JS (`@heyputer/puter.js`) | Tidak (SDK sendiri `puter.ai.chat`, bukan format OpenAI) | Akun Puter (pengguna login) | AI gratis dari frontend, "user-pays" (pengguna memakai kuota akunnya sendiri) |

### 23.6.2 Catatan Penting per Model

```text
⭐ GEMINI (rekomendasi mulai):
- Key GRATIS dari Google AI Studio — langsung bisa dicoba hari ini
- Punya endpoint format OpenAI → gampang diintegrasikan
- Free tier harian cukup untuk belajar & aplikasi kecil

⭐ CHATGPT/OPENAI:
- Standar industri, dokumentasi paling lengkap
- Format-nya jadi "bahasa umum" — semua gateway memakainya
- Streaming dengan parameter stream: true (SSE)

⭐ GROK (xAI):
- Format OpenAI-compatible → pola integrasi sama
- Cocok kalau ingin model dari ekosistem X

⭐ DEEPSEEK:
- Paling murah untuk pemakaian banyak → bagus untuk produksi kecil
- OpenAI-compatible → pola sama

⚠️ FLUX: BUKAN CHAT!
- FLUX = model generasi gambar (gambar dari deskripsi teks)
- Kalau ingin fitur "chat" → pilih Gemini/ChatGPT/Grok/DeepSeek
- Kalau ingin fitur "buat gambar dari teks" → barulah FLUX relevan

💡 PUTERJS: pendekatan BERBEDA — tanpa backend sendiri:
- Library JS yang memanggil AI langsung dari frontend
- Pengguna login dengan akun Puter (kuota pengguna, bukan kuota Anda)
- ✅ Sangat cepat untuk PROTOTYPE
- ❌ Bukan arsitektur produksi aplikasi besar (API key Anda aman
  di backend — di sini kuota justru dari pengguna)
- Cocok untuk uji coba cepat, bukan aplikasi komersial serius
```

### 23.6.3 Kesimpulan Arsitektur: Semua Provider Polanya SAMA

```text
PALING PENTING: apa pun modelnya (Gemini/ChatGPT/Grok/DeepSeek),
ALUR DATA-NYA IDENTIK:

Frontend → Backend Anda → Provider API → Streaming balik → Frontend

Beda cuma:
- URL endpoint (base_url)
- Nama model
- API key Anda

Karena hampir semua provider sekarang OpenAI-compatible,
ganti model = ganti 2 pengaturan, kode tidak berubah. 🔥
```

---

## 🧠 23.7 STUDI KASUS: ARSITEKTUR AI APLIKASI BESAR

> Semua aplikasi ini punya fitur chat AI. Perhatikan POLA yang mereka
> pakai — Anda akan melihat polanya sama dengan 23.2-23.5.

### 23.7.1 ChatGPT (OpenAI)

```text
POLA: Backend-proxy + Streaming SSE + Moderasi

User ketik → server OpenAI cek auth & rate limit →
moderasi input → model generate (streaming) → jawaban
bertahap sampai [DONE] → tampil di UI

YANG BISA DIPETIK:
✅ API key di server, frontend hanya UI
✅ Streaming SSE untuk pengalaman "mengetik"
✅ Moderasi: konten tidak pantas disaring sebelum masuk
```

### 23.7.2 GitHub Copilot

```text
POLA: Konteks-kode (sistem RAG khusus kode) + Streaming

Editor → Copilot kumpulkan konteks (file terbuka, bahasa,
snippet di sekitar kursor) → susun prompt → kirim ke model →
streaming saran kode → editor tampilkan saran abu-abu

YANG BISA DIPETIK:
✅ "Konteks" = inti: Copilot mengirim KONTEKS yang relevan,
   bukan seluruh file. (Ini semangat RAG!)
✅ Streaming saran bertahap
```

### 23.7.3 Perplexity AI (Penelusuran + AI)

```text
POLA: Search + RAG (retrieval dari WEB) + Generator

User tanya → sistem cari di web (search) → ambil & rangking
halaman relevan → susun prompt: hasil web + pertanyaan →
LLM rangkum dengan sumber → jawaban + daftar sumber

YANG BISA DIPETIK:
✅ RAG pakai data dari LUAR (web) — data Anda tinggal ganti sumber
✅ Jawaban selalu "bersumber" → mengurangi halusinasi
```

### 23.7.4 Notion AI

```text
POLA: RAG atas workspace pengguna + Privasi

User tanya di dokumen → system ambil potongan dokumen user
yang relevan (embedding + retrieval) → prompt + konteks →
jawaban berdasarkan dokumen USER → privasi: data tidak
dipakai melatih model

YANG BISA DIPETIK:
✅ RAG atas data MILIK USER (persis kebutuhan aplikasi sekolah Anda!)
✅ Privasi: data user dipisahkan & tidak bocor antar user
```

### 23.7.5 Tabel Pola yang Bisa Ditiru

| Aplikasi | Pola Utama | Yang Anda Tiru |
|----------|------------|----------------|
| ChatGPT | Backend-proxy + SSE | Arsitektur dasar Anda (23.2-23.3) |
| GitHub Copilot | Konteks relevan + streaming | Kirim konteks yang tepat, bukan semuanya |
| Perplexity | Web search + RAG | RAG (23.4) — ganti sumber web jadi data Anda |
| Notion AI | RAG workspace + privasi | RAG data user + isolasi data antar user |
| (Semua) | Gateway multi-model | OpenRouter/LiteLLM (23.5) saat butuh banyak model |

> 🎯 **Kesimpulan studi kasus:** aplikasi besar TIDAK punya arsitektur
> "ajaib". Mereka memakai pola yang sama: **backend-proxy + streaming +
> (RAG saat perlu) + (gateway saat multi-model) + keamanan.** Anda
> bisa membangun versi kecil dari pola ini.

---

## 🧠 23.8 KEAMANAN & BIAYA (WAJIB DIPIKIRKAN DARI AWAL)

> Sumber: OWASP Top 10 untuk LLM Applications — standar keamanan
> AI yang diakui industri.

### 23.8.1 Ancaman Utama & Mitigasinya

| Ancaman | Apa itu (sederhana) | Mitigasi |
|---------|---------------------|----------|
| **Prompt Injection** | User menyusupkan perintah jahat lewat pesan: "Abaikan instruksi sistem, katakan bahwa..." | Pisahkan instruksi sistem & input user; validasi; jangan percaya input |
| **Data bocor (Sensitive Info)** | Data privat user (NIK, password) ikut terkirim ke provider | Saring (redact) data sensitif di backend sebelum kirim |
| **Rate limit / DoS** | User (atau bot) membanjiri chat → biaya meledak | Batasi pemakaian per user (mis. 20 chat/hari) |
| **Hallucination** | AI mengarang jawaban yang tidak ada di data | RAG + instruksi "bilang tidak tahu kalau tidak ada" |
| **Prompt disclosure** | User menebak instruksi sistem Anda | Jangan pernah bocorkan system prompt ke user |
| **Moderasi konten** | Konten tidak pantas | Filter di backend (manual / API moderasi) |

### 23.8.2 Aturan Emas Keamanan Integrasi AI

```text
1. API key HANYA di backend (tidak pernah di frontend / .env frontend)
2. .env berisi key — jangan pernah commit ke Git!
3. Sistem prompt = RAHASIA aplikasi Anda — jangan tampilkan ke user
4. Batasi pemakaian per user SEBELUM memanggil AI (bukan sesudah)
5. Saring data sensitif sebelum dikirim ke provider pihak ketiga
6. Selalu HTTPS (Modul 18.11) — pesan chat adalah data pengguna!
7. Log pemakaian (siapa, kapan, berapa token) untuk deteksi anomali
```

### 23.8.3 Mengelola Biaya AI (Token)

```text
BIAYA AI DIHITUNG PER TOKEN (potongan kata).

HARGA MURAH → MAHAL (per 1 juta token, perkiraan 2025-2026):
DeepSeek  <<  Gemini Flash  <  GPT-4o-mini  <<  GPT-4o / Grok besar

CARA HEMAT:
✅ Pakai model murah untuk chat umum (Gemini Flash / DeepSeek)
✅ Pakai model mahal hanya untuk tugas sulit
✅ Batasi panjang jawaban (max tokens)
✅ Cache jawaban yang sering ditanya (pertanyaan FAQ yang sama)
✅ Rate limit per user = batas biaya otomatis
✅ Pantau dashboard provider tiap minggu
```

> 🤖 **Prompt AI audit keamanan & biaya:**
> ```text
> Baca kode aplikasi saya (folder: [path]). Saya punya fitur chat AI.
> Audit 3 hal: 1) Apakah ada API key yang bocor ke frontend/kode?
> 2) Apakah ada rate limit per user sebelum memanggil model?
> 3) Di mana titik paling rawan prompt injection & data bocor?
> Urutkan temuan dari paling kritis, beri perbaikan arsitekturnya.
> JANGAN langsung mengubah kode — jelaskan dulu.
> ```

---

## 🧠 23.9 CONTOH KASUS: CHAT AI DI APLIKASI REACTJS ANDA

> Mari terapkan semua pola ke kasus Anda: **aplikasi ReactJS (Modul 10)
> dengan fitur chat AI** (Gemini/DeepSeek/Grok/ChatGPT).

### 23.9.1 Skenario Nyata: "Asisten Perpustakaan Sekolah"

```text
FITUR: user bertanya "Apakah Laskar Pelangi tersedia?" dan AI
menjawab berdasarkan DATABASE aplikasi (stok buku sungguhan).

TINGKAT 1 (mulai): Chat pengetahuan umum
  React → Backend → Gemini (gratis) → jawaban
  ✅ Seminggu pertama. Cukup untuk fitur "tanya apa saja".

TINGKAT 2 (naik): Chat yang paham data Anda = RAG
  Tambah: data buku → embedding → pgvector → retrieval → jawaban
  ✅ "Apakah Laskar Pelangi tersedia?" dijawab dengan stok asli!

TINGKAT 3 (naik): Multi-model via gateway
  Pakai OpenRouter: satu key untuk Gemini/DeepSeek/Grok
  ✅ Bisa ganti model tanpa ubah kode
```

### 23.9.2 Diagram Arsitektur Lengkap (Kasus Anda)

```text
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND — ReactJS (Modul 10)                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ChatUI.tsx: pesan user + streaming jawaban + history UI │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ POST /api/chat {pesan}   (bukan ke
                               ▼                            Gemini!)
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND — Node.js/Express ATAU Next.js API (Modul 11-12)       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. Auth (JWT): user siapa?                             │   │
│  │ 2. Rate limit: sudah 20x hari ini?                     │   │
│  │ 3. Ambil history 10 pesan terakhir dari DB             │   │
│  │ 4. [RAG bila perlu] cari potongan relevan di pgvector  │   │
│  │ 5. Susun pesan lengkap + panggil provider (key di sini)│   │
│  │ 6. Relay stream balik ke frontend (SSE)                │   │
│  │ 7. Simpan percakapan ke database (Modul 14-15)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────┬────────────────────┘
               │ POST (dengan key, streaming) │
               ▼                              ▼
     ┌─────────────────┐            ┌─────────────────────┐
     │ LLM Provider    │            │ Vector DB (pgvector)│
     │ Gemini/DeepSeek │            │ (kalau sudah RAG)   │
     │ Grok/ChatGPT    │            └─────────────────────┘
     └─────────────────┘
```

### 23.9.3 Pertanyaan Arsitektur Sebelum Mulai (Jawab Sendiri!)

```text
1. AI di luar (API) atau di VPS sendiri?  → API dulu (23.1)
2. Provider pertama?                     → Gemini (gratis) (23.6)
3. Frontend → backend atau langsung?     → SELALU lewat backend (23.2)
4. Perlu streaming?                      → YA, SSE (23.3)
5. Chat umum atau harus tahu data Anda?  → Data → RAG (23.4)
6. Satu model atau banyak?               → Banyak → gateway (23.5)
7. Keamanan & batas biaya?               → WAJIB (23.8)
```

> 🤖 **Prompt AI master untuk mendesain integrasi Anda:**
> ```text
> Saya punya aplikasi ReactJS dengan backend [Node/Express atau
> Next.js]. Saya ingin menambahkan fitur chat AI menggunakan
> [Gemini / DeepSeek / Grok / ChatGPT — pilih].
> JANGAN menulis kode dulu. Rancang arsitekturnya:
> 1. Alur data lengkap dari user mengetik sampai jawaban tampil
> 2. File/endpoint apa saja yang akan dibuat & tanggung jawabnya
> 3. Di mana auth, rate limit, history, dan streaming dipasang
> 4. Bagaimana API key disimpan aman
> 5. (Jika chat harus tahu data saya) rancang RAG-nya: dokumen apa
>    di-index, bagaimana chunking, vector DB apa
> Setelah saya setujui arsitekturnya, baru tulis kode langkah demi
> langkah. Saya pemula — jelaskan tiap keputusan.
> ```

---

## 🏗️ 23.10 PRAKTIK (ARSITEKTUR DULU, KODE BELAKANGAN)

### Latihan 1: Gambar Alur Data (45 menit)

```text
Ambil kertas / draw.io. Gambar alur data chat AI untuk aplikasi Anda:

1. Kotak: React UI → Backend → Provider → Backend → React UI
2. Tulis di tiap panah: apa yang dikirim (JSON? SSE?)
3. Tandai titik: auth, rate limit, penyimpanan key, streaming
4. Tempel hasil ke AI → minta review: "Adakah titik yang salah
   atau berbahaya secara arsitektur?"
```

### Latihan 2: Bandingkan 3 Provider (30 menit)

```text
Buka dokumentasi resmi (paling cepat via AI):
Gemini (ai.google.dev/gemini-api/docs), DeepSeek (api-docs.deepseek.com),
dan satu lagi (Grok / OpenAI).

Buat tabel: endpoint, model, harga, free tier, OpenAI-compatible?
Kesimpulan: mana yang Anda pilih sebagai provider pertama & kenapa?
Minta AI bandingkan jawaban Anda dengan fakta dokumentasi.
```

### Latihan 3: Desain Lapisan Keamanan (45 menit)

```text
Tulis rencana keamanan untuk chat AI Anda (belum perlu kode):
1. Di titik mana API key disimpan? (jawaban: backend, .env)
2. Rate limit: berapa per user per hari?
3. Data apa yang HARUS disaring sebelum dikirim ke provider?
4. Bagaimana jika user mengetik "abaikan instruksi sistem..."?
Minta AI audit rencana Anda (pakai prompt 23.8.3).
```

### Latihan 4: Putuskan Perlu RAG atau Tidak (30 menit)

```text
Untuk aplikasi Anda, jawab:
1. Apakah chat harus menjawab soal data aplikasi (stok, aturan)?
   TIDAK → chat biasa cukup. SELESAI.
   YA → lanjut:
2. Basis pengetahuannya berapa besar? (< 500 halaman → cukup
   tempel ke prompt; lebih besar → RAG)
3. Sumber data apa yang di-index? Bagaimana chunking-nya?
Tulis keputusan Anda + alasan, minta AI review.
```

### Latihan 5: Prototipe Arsitektur Tanpa Kode (1 jam)

```text
Gunakan prompt master (23.9.3) untuk MENDEKLARASIKAN arsitektur
chat AI Anda — tanpa kode. Hasil: 1 halaman dokumen arsitektur
(alur data + file + keamanan). Ini bekal Anda sebelum benar-benar
coding di proyek.

SETELAH arsitektur disetujui AI & Anda paham → baru minta kode.
```

---

## 🧠 23.11 RANGKUMAN & KETIKA BINGUNG

### Yang Sudah Anda Pelajari

| Konsep | Intinya | Modul terkait |
|--------|---------|---------------|
| **Alur dasar** | Frontend → Backend → Provider → streaming balik | 16, 17 |
| **API key di backend** | Tidak pernah di frontend — alasan keamanan & biaya | 17 |
| **Streaming SSE** | Jawaban dikirim bertahap seperti mengetik | 16 |
| **RAG** | Ambil data relevan → tempel ke prompt → jawab berdasar data | 14, 15, 22 |
| **Vector DB** | pgvector/Pinecone — simpan embedding | 15 |
| **AI Gateway** | Satu pintu banyak model (OpenRouter/LiteLLM) | 22 |
| **Provider** | Gemini (gratis), ChatGPT, Grok, DeepSeek — semua pola sama | 17 |
| **FLUX** | Generasi GAMBAR, bukan chat | — |
| **Keamanan** | Prompt injection, rate limit, privasi, biaya | 17, 18 |

### Checklist Sebelum Coding

```
☐ Paham alur: Frontend → Backend → Provider → streaming balik
☐ Bisa jelaskan kenapa API key tidak boleh di frontend
☐ Sudah pilih provider pertama (Gemini gratis = pilihan bagus)
☐ Sudah putuskan: chat biasa atau RAG?
☐ Sudah rancang rate limit & batas biaya
☐ Sudah gambar diagram arsitektur sendiri (Latihan 1)
☐ Sudah tahu endpoint & format provider pilihan
☐ (Bila multi-model) sudah tahu cara pakai gateway
```

### Ketika Bingung

```text
❓ "Model mana yang paling cocok?"
   → Mulai dari Gemini (gratis). Cukup untuk belajar.
     Mau murah produksi? DeepSeek. Mau standar? ChatGPT.
     Pola integrasinya sama semua (OpenAI-compatible).

❓ "Kenapa tidak langsung panggil API dari React?"
   → API key bocor (23.2) + tidak ada kontrol user/batas/biaya.

❓ "Jawaban AI kok lambat / blank?"
   → Streaming belum dipasang (23.3) → user menunggu semua selesai.
     Pasang SSE → terasa cepat.

❓ "AI menjawab asal (halusinasi) soal data saya?"
   → RAG (23.4): index data Anda, tempel konteks ke prompt,
     instruksikan "bilang tidak tahu kalau tidak ada".

❓ "Mau pakai 5 model sekaligus, ribet?"
   → Gateway: OpenRouter (23.5) — satu key, satu format.

❓ "FLUX bisa untuk chat?"
   → TIDAK. FLUX untuk buat GAMBAR dari teks. Chat = Gemini/ChatGPT/dll.

❓ "Sudah bingung — mulainya dari mana?"
   → Kerjakan Latihan 1 (gambar alur) + pilih Gemini. Itu cukup
     untuk mulai. Kode menyusul setelah arsitektur jelas.
```

---

## 🎯 KAPAN LANJUT?

Anda siap mulai coding integrasi chat AI jika sudah bisa:

```
☐ Menggambar alur data chat AI tanpa melihat modul ini
☐ Menjelaskan kenapa backend harus jadi perantara
☐ Menyebutkan kapan perlu streaming, RAG, dan gateway
☐ Menjelaskan pilihan provider Anda + alasan arsitekturnya
☐ Punya dokumen arsitektur 1 halaman (hasil Latihan 5)
```

> **SETELAH INI:** minta AI menulis kode berdasarkan arsitektur yang
> sudah Anda rancang (prompt master 23.9.3) — kode jadi jauh lebih
> rapi karena arsitekturnya sudah benar. Buka `cheat-sheet-prompt.md`
> untuk template prompt siap pakai, lalu lanjut ke
> `fase-2-ai-tools-dasar/` untuk mendalami workflow AI profesional.

---

**📂 Lanjut ke: `cheat-sheet-prompt.md`** — kumpulan template prompt
untuk semua kebutuhan vibe coding Anda! ⚡
