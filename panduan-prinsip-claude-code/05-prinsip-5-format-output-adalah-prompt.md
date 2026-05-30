# Prinsip 5: Format Output Adalah Prompt

> **"The Output Format Is the Prompt"**
> Gunakan HTML untuk rencana dan spesifikasi. Berhenti menulis 1000 baris markdown yang tidak dibaca siapa pun.

---

## 📖 Ringkasan Prinsip

Kebanyakan orang meminta Claude untuk menulis rencana, spesifikasi, PRD (Product Requirements Document) dalam format markdown. **Thariq Shihipar** dari tim Claude Code mengatakan bahwa **sekarang itu adalah kesalahan.**

---

## 🧠 Masalah dengan Markdown untuk Rencana

Thariq mengakui:

> *"The plans are so long, I honestly have stopped reading them. And this was honestly a mistake. You still need to be really in the loop."*
>
> "Rencananya sangat panjang, saya jujur sudah berhenti membacanya. Dan ini sejujurnya adalah kesalahan. Kamu tetap harus benar-benar terlibat dalam prosesnya."

**— Thariq Shihipar, Anthropic**

### Kenapa Markdown Gagal untuk Rencana?

| Masalah | Penjelasan |
|---------|-----------|
| **Terlalu panjang** | Rencana markdown bisa 1000+ baris — siapa yang punya waktu baca? |
| **Membosankan** | Hanya dinding teks tanpa visual — otak cepat lelah |
| **Mudah di-skip** | Kamu scroll, scroll, scroll, dan akhirnya tidak baca |
| **Kurang kaya** | Tidak bisa menampilkan kode dengan syntax highlighting, UI mockup, tabel keputusan |
| **Tidak interaktif** | Tidak bisa diedit langsung, tidak bisa dieksplorasi |

---

## 💡 Solusi: Gunakan HTML untuk Rencana

> *"In HTML it doesn't need to try nearly as hard. It can actually draw things you can look at. It's just a richer communication medium between you and Claude."*
>
> "Dalam HTML, Claude tidak perlu berusaha keras. Dia bisa benar-benar menggambar hal-hal yang bisa kamu lihat. Ini adalah media komunikasi yang lebih kaya antara kamu dan Claude."

**— Thariq Shihipar, Anthropic**

### 🎯 Apa yang Bisa Kamu Dapatkan dengan HTML Plan:

```
Dalam HTML plan, kamu bisa melihat:
┌────────────────────────────────────────────────┐
│                                                │
│  📝 Code excerpts dengan syntax highlighting   │
│     (kode berwarna, mudah dibaca)              │
│                                                │
│  🎨 Mock-up tampilan UI                        │
│     (lihat bagaimana UI akan terlihat)         │
│                                                │
│  📊 Decision tables (tabel keputusan)          │
│     (bandingkan opsi dengan jelas)             │
│                                                │
│  ⚠️ Failure mode tables (tabel mode kegagalan) │
│     (antisipasi apa yang bisa salah)           │
│                                                │
│  📦 Sample output panels                       │
│     (lihat contoh hasil akhir)                 │
│                                                │
└────────────────────────────────────────────────┘
```

**Hasilnya:**
- ✅ Kamu **benar-benar membuka file** HTML
- ✅ Kamu **benar-benar membacanya**
- ✅ Rencana tetap menjadi **artefat nyata**, bukan dinding teks yang kamu scroll lewat

---

## 💰 Framing yang Mengubah Cara Pandang

> *"When you say Claude can run for 8 hours, what you're really saying is Claude can spend like 500 bucks. All of us are becoming these compute allocators."*
>
> "Ketika kamu bilang Claude bisa jalan selama 8 jam, yang sebenarnya kamu katakan adalah Claude bisa menghabiskan sekitar 500 dolar. Kita semua menjadi pengalokasi komputasi."

**— Thariq Shihipar, Anthropic**

### 🧠 Artinya:

**$500 per run.** Kamu tidak mampu untuk hanya membaca sekilas outputnya. Kamu harus benar-benar membaca dan memahami apa yang direncanakan Claude.

Bayangkan kamu membayar $500 untuk sebuah laporan konsultan. Apakah kamu hanya akan:
- ❌ Scroll cepat dan bilang "oke, bagus"?
- ✅ Atau membaca dengan teliti, memeriksa setiap detail, memberi feedback?

**Dengan membuat output yang benar-benar ingin kamu baca, kamu memastikan bahwa investasi $500 ($/run) tidak sia-sia.**

---

## 📝 Exact Prompt untuk Dicuri

Prompt ini bisa langsung kamu gunakan:

```
"Create an HTML file as a plan that helps me visualize 
what the implementation plan is. Include excerpts, mock-ups, 
code, whatever is needed to give me maximum context."
```

**Terjemahan:**
> "Buat file HTML sebagai rencana yang membantu saya memvisualisasikan rencana implementasi. Sertakan cuplikan kode, mock-up, kode, apa pun yang diperlukan untuk memberikan saya konteks maksimal."

### Kapan Menggunakan Prompt Ini:

- ✅ Untuk apa pun yang **lebih besar dari satu skill**
- ✅ Merencanakan **publish workflow**
- ✅ Merencanakan **refactor besar**
- ✅ Merencanakan **tool baru**
- ✅ Kolaborasi kompleks dengan Claude

> **Coba sekali saja, dan kamu tidak akan pernah kembali ke markdown.**

---

## 🏆 Pro Move: Throwaway Software Interface

Untuk bagian rencana yang ingin kamu edit, minta Claude untuk **membangun interface HTML kustom** hanya untuk keputusan itu.

### Cara Kerjanya:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. Minta Claude buat HTML interface            │
│     untuk satu keputusan spesifik               │
│             │                                   │
│             ▼                                   │
│  2. Edit langsung di UI (bukan di markdown)     │
│             │                                   │
│             ▼                                   │
│  3. Copy hasilnya kembali ke Claude             │
│             │                                   │
│             ▼                                   │
│  4. Buang interfacenya (throwaway!)             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Contoh:

**Daripada:** Menulis 50 baris markdown untuk mengkonfigurasi workflow publish...

**Minta Claude:**
> "Buat HTML interface dengan drag-and-drop untuk mengatur urutan step di workflow publish saya. Step yang tersedia: validate, build, test, deploy, notify. Saya ingin bisa mengatur urutannya dan mengklik toggle untuk mengaktifkan/nonaktifkan setiap step."

**Hasil:**
- Kamu mendapatkan **interface visual** untuk ngatur workflow
- Kamu tinggal **drag-and-drop** step ke urutan yang diinginkan
- Kamu **klik tombol** untuk mengaktifkan/nonaktifkan
- Kamu **copy hasil konfigurasi** kembali ke Claude
- Interface bisa **dibuang** setelah selesai

Inilah yang disebut **"throwaway software"** dari Prinsip 3 — dibangun untuk satu keputusan, digunakan, lalu dibuang.

---

## 📊 Perbandingan: Markdown Plan vs HTML Plan

| Aspek | Markdown Plan | HTML Plan |
|-------|--------------|-----------|
| **Keterbacaan** | Dinding teks 👎 | Visual, terstruktur 👍 |
| **Syntax highlighting** | ❌ Tidak ada | ✅ Ada, otomatis |
| **UI Mockup** | ❌ Tidak bisa | ✅ Bisa dengan HTML/CSS |
| **Interaktivitas** | ❌ Statis | ✅ Bisa interaktif |
| **Kemauan baca** | Rendah — orang cenderung skip | Tinggi — orang benar-benar baca |
| **Kemudahan edit** | Perlu edit teks mentah | Bisa dengan UI (throwaway) |
| **Biaya pembuatan** | Murah (markdown sederhana) | Sedikit lebih mahal (HTML) |
| **Kapan pakai** | Catatan cepat, tugas kecil | Rencana besar, proyek kompleks |

---

## 📋 Contoh: Seperti Apa HTML Plan

Berikut adalah gambaran seperti apa HTML plan yang baik:

### 1️⃣ Cuplikan Kode dengan Syntax Highlighting

HTML plan bisa menampilkan kode dengan warna-warna yang memudahkan pembacaan:

```html
<pre><code class="language-typescript">
<span class="hljs-keyword">interface</span> <span class="hljs-title">User</span> {
  <span class="hljs-attr">id</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">name</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">email</span>: <span class="hljs-built_in">string</span>;
  <span class="hljs-attr">role</span>: <span class="hljs-string">'admin'</span> | <span class="hljs-string">'user'</span>;
}
</code></pre>
```

### 2️⃣ Tabel Keputusan

Bisa menampilkan perbandingan opsi secara visual:

| Opsi | Kelebihan | Kekurangan | Rekomendasi |
|------|-----------|------------|-------------|
| **Microservices** | Scalable, independent deploy | Complex infrastructure | ✅ Untuk tim besar |
| **Monolith** | Simple, cepat develop | Sulit scale | ✅ Untuk MVP |
| **Serverless** | No ops, auto-scale | Cold start, vendor lock-in | ✅ Untuk event-driven |

### 3️⃣ Mockup UI

HTML plan bisa menampilkan simulasi tampilan UI:

```html
<div class="mockup-card">
  <div class="mockup-header">Login Form</div>
  <div class="mockup-body">
    <input type="email" placeholder="Email" disabled>
    <input type="password" placeholder="Password" disabled>
    <button disabled>Sign In</button>
    <p class="mockup-link">Forgot password?</p>
  </div>
</div>
```

---

## ✅ Intisari Prinsip 5

> **Format output adalah bagian dari prompt. Berhenti menulis rencana markdown 1000 baris yang tidak dibaca siapa pun.**

### 🎯 Action Items untuk Kamu:

1. ✅ Untuk rencana > 1 skill, minta Claude buat **HTML plan**
2. ✅ Gunakan prompt "Create an HTML file as a plan..."
3. ✅ **Benar-benar buka dan baca** file HTML yang dibuat Claude
4. ✅ Untuk keputusan kompleks, minta Claude buat **throwaway HTML interface**
5. ✅ Ingat: $500/run — kamu harus membaca outputnya dengan teliti

### 📝 Aturan Praktis:

> **Jika rencana bisa dijelaskan dalam 1-2 paragraf → markdown cukup.**
> **Jika rencana membutuhkan lebih dari itu → HTML plan.**

---

**👉 Lanjut ke [Cheat Sheet & Ringkasan](./06-cheat-sheet-dan-ringkasan.md)**  
**👈 [Kembali ke Daftar Isi](./README.md)**
