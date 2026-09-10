## 1. MENGAPA VIBE CODING GAGAL

### 1.1 Apa Itu Vibe Coding?

**Vibe Coding** adalah pendekatan di mana seseorang langsung membuka tool AI coding dan mengatakan: *"Buatkan saya aplikasi!"* tanpa perencanaan apapun.

Istilah ini dipopulerkan oleh **Andrej Karpathy** (co-founder OpenAI) pada awal 2025. Ia mendeskripsikan pendekatan "sepenuhnya vibes" di mana Anda *"lupa bahwa kode itu bahkan ada"* — AI yang menulis semua kode berdasarkan deskripsi kasar.

### 1.2 Mengapa Vibe Coding Gagal untuk Perangkat Lunak Serius?

#### ❌ Masalah #1: AI Harus Menebak Aturan Bisnis

Saat Anda memberikan ide yang samar-samar ke AI, AI harus **menebak** semua hal ini:

```
Anda: "Buatkan aplikasi manajemen inventaris"

AI harus menebak:
├── Aturan bisnis apa yang berlaku?
├── Siapa yang boleh akses data apa?
├── Workflow approval seperti apa?
├── Bagaimana dengan kasus edge (situasi tak terduga)?
├── Apa definisi "selesai" dari fitur ini?
├── Bagaimana dengan error handling?
├── Format output seperti apa yang diinginkan?
└── Siapa pengguna akhirnya?
```

> **💡 Kutipan dari 120x.ai:**
> *"I don't want Codex or Claude Code guessing at my business model. I don't want these tools inventing permissions, and I don't want these tools deciding what done looks like."*

#### ❌ Masalah #2: Konteks yang Tersebar dan Berantakan

Dalam vibe coding, pengetahuan proyek tersebar di sepanjang chat history:

```
Chat History (berantakan):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Message #3:  "Tambahkan approval step" ← Keputusan penting!
Message #12: "Eh, yang tadi salah" ← Koreksi dari 3 hari lalu
Message #18: "Kolom X di spreadsheet selalu bermasalah" ← Fakta kritis
Message #27: "Kecualikan data lama" ← Pengecualian tersembunyi
Message #34: "User admin boleh edit, viewer tidak boleh" ← Aturan akses
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Masalah: Tidak ada yang mencatat! Semua terkubur di chat.
```

#### ❌ Masalah #3: AI Improvisasi Tanpa Batas

Saat tidak ada instruksi yang jelas, AI akan mulai **mengarang**:

| AI Menebak... | Akibatnya... |
|---------------|-------------|
| Membuat izin sendiri | User yang tidak seharusnya bisa akses data sensitif |
| Menentukan workflow sendiri | Proses bisnis menjadi tidak sesuai kebutuhan |
| Menciptakan fitur yang tidak diminta | Codebase menjadi kompleks dan sulit dipelihara |
| Memilih dependensi sendiri | Menggunakan library yang sudah usang atau tidak cocok |
| Menentukan format output | Output tidak sesuai kebutuhan bisnis |

#### ❌ Masalah #4: Tidak Ada Skala untuk Proyek Besar

Vibe coding mungkin berhasil untuk **MVP sederhana** atau **demo**, tapi gagal saat:
- Proyek memiliki 10+ fitur
- Ada banyak pengguna dengan role berbeda
- Perlu integrasi dengan sistem lain
- Butuh maintenance jangka panjang
- Tim lebih dari 1 orang

> **💡 Kutipan dari Chris Titus Tech:**
> *"One giant prompt that loops until an agent declares victory may produce a demo, but it is not how I build software I plan to maintain."*

### 1.3 Perbandingan: Vibe Coding vs Structured Development

```
╔══════════════════════╦══════════════════════╦══════════════════════╗
║       Aspek          ║    VIBE CODING       ║  STRUCTURED METHOD   ║
╠══════════════════════╬══════════════════════╬══════════════════════╣
║ Perencanaan          ║ Tidak ada            ║ Sangat detail        ║
║ Konteks              ║ Berantakan di chat   ║ Terstruktur di folder║
║ Aturan Bisnis        ║ AI menebak           ║ Dokumentasi jelas    ║
║ Risiko               ║ Tinggi (banyak error)║ Rendah (terkontrol)  ║
║ Review               ║ Tidak systematic     ║ Setiap sprint di-    ║
║                      ║                      ║ review               ║
║ Dokumentasi          ║ Tidak ada            ║ Selalu diperbarui    ║
║ Skalabilitas         ║ Hanya untuk kecil    ║ Sangat scalable      ║
║ Maintenance          ║ Sulit                ║ Mudah                ║
║ Hasil                ║ MVP yang messy       ║ Perangkat lunak      ║
║                      ║                      ║ yang solid           ║
║ Waktu awal           ║ Cepat                ║ Lebih lama           ║
║ Waktu total          ║ Lama (banyak fix)    ║ Lebih cepat overall  ║
╚══════════════════════╩══════════════════════╩══════════════════════╝
```

---

