# 📋 Cheat Sheet & Ringkasan 5 Prinsip

> Lembar referensi cepat — semua 5 prinsip dalam satu halaman.

---

## 🎯 Ringkasan Satu Kalimat per Prinsip

| # | Prinsip | Inti Satu Kalimat |
|---|---------|-------------------|
| 1 | **Prompt Skills, Bukan Claude** | Jika kamu mengetik prompt yang sama dua kali, buat skill |
| 2 | **Skills Lebih dari Sekadar Prompt** | Habiskan lebih banyak waktu pada tools, bukan pada prompt |
| 3 | **Composable untuk Berulang, Throwaway untuk Sekali** | Skill kecil yang dirantai mengalahkan satu skill raksasa |
| 4 | **Skills Semakin Pintar Setiap Sesi** | Setelah output tidak sempurna, update skill — jangan cuma move on |
| 5 | **Format Output Adalah Prompt** | Gunakan HTML untuk rencana, bukan markdown 1000 baris |

---

## 📊 Tabel Cepat 5 Prinsip

| # | Prinsip | Discovery Prompt | Action Utama |
|---|---------|-----------------|--------------|
| 1 | Prompt Skills, Bukan Claude | "Berdasarkan sesi terbaru, tugas apa yang saya lakukan berulang yang harus jadi skills?" | 📁 Buat folder skill untuk tugas berulang |
| 2 | Skills Lebih dari Sekadar Prompt | "Temukan tugas di mana saya melakukan pengecekan manual setelah AI memberi output." | 🛠️ Investasi di tools, bukan prompt indah |
| 3 | Composable untuk Berulang, Throwaway untuk Sekali | "Audit Skills Claude saya untuk: visibilitas, deterministik, composability." | 🔗 Pecah skill besar, simpan script, kunci yang berisiko |
| 4 | Skills Semakin Pintar Setiap Sesi | "Review percakapan setelah menggunakan skill. Bisakah skill ditingkatkan?" | 📈 Update skill setelah setiap output tidak sempurna |
| 5 | Format Output Adalah Prompt | "Buat file HTML sebagai rencana untuk memvisualisasikan implementasi." | 🖼️ Minta HTML plan untuk proyek besar |

---

## 🏗️ Tiga Lapisan Skill (Prinsip 2)

| Lapisan | Fungsi | Tips |
|---------|--------|------|
| 📝 **Deskripsi** | Memberi tahu Claude KAPAN menggunakan skill | Jangan terlalu samar — spesifik tentang trigger |
| 📋 **Instruksi** | Panduan langkah-demi-langkah | Jangan over-engineered — cukup jelas dan ringkas |
| 🔧 **Tools** | Script, API, file referensi | **Ini yang paling penting!** Dokumentasi tools dengan baik |

---

## ⚙️ Flag Frontmatter untuk SKILL.md (Prinsip 3)

```yaml
# Hanya KAMU yang bisa memicu skill (untuk operasi berisiko)
disable-model-invocation: true

# Hanya CLAUDE yang bisa memicu (sembunyi dari menu slash)
user-invocable: false
```

### Kapan Pakai:

| Flag | Use Case |
|------|----------|
| `disable-model-invocation: true` | Publish, deploy, kirim email, hapus data |
| `user-invocable: false` | Helper skill, validasi internal, preprocessing |

---

## 🔄 Siklus Perbaikan Skill (Prinsip 4)

```
Output tidak sempurna
       │
       ▼
One-time fix? → Perbaiki manual, move on
       ATAU
Forever? → Update SKILL.md → Commit → Next session smarter
```

---

## 📍 Lokasi Folder Skills

```
Global skills (semua proyek):
  ~/.claude/skills/

Project skills (satu proyek):
  .claude/skills/
```

**Progressive disclosure:** Hanya nama + deskripsi yang dimuat di awal (~70-150 token/skill). Isi lengkap hanya dimuat saat skill dipanggil.

---

## 📝 Aturan Praktis Cepat

1. **Kode > Token** — Jika bisa pakai script, jangan pakai AI
2. **Tools > Prompts** — Habiskan energi pada tools, bukan prompt indah
3. **Kecil > Besar** — Satu skill = satu tanggung jawab
4. **Iterasi > Sempurna** — Mulai sederhana, perbaiki terus
5. **HTML > Markdown** — Untuk rencana besar, minta HTML

---

## 💬 Template Prompt Siap Pakai

### Untuk Menemukan Skill Pertama:
```
"Berdasarkan sesi terbaru saya, tugas apa yang saya lakukan 
berulang yang harus menjadi skills?"
```

### Untuk Menemukan Tools yang Kurang:
```
"Temukan tugas di mana saya melakukan pengecekan manual 
setelah AI memberi output."
```

### Untuk Audit Skill:
```
"Audit skill Claude saya untuk: visibilitas, deterministik 
vs non-deterministik, composability."
```

### Untuk Memperbaiki Skill:
```
"Review percakapan setelah menggunakan skill ini. Bisakah 
kita tingkatkan skill ini agar ditangani otomatis?"
```

### Untuk Rencana Besar:
```
"Buat file HTML sebagai rencana yang membantu saya 
memvisualisasikan implementasi. Sertakan cuplikan kode, 
mock-up, tabel, dll."
```

---

## 🔗 Hierarki Pembelajaran

```
Mulai dari sini
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  PRINSIP 1: Prompt Skills, Bukan Claude                  │
│  Pahami konsep dasar: apa itu skill dan folder           │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  PRINSIP 2: Skills Lebih dari Sekadar Prompt             │
│  Kuasai 3 lapisan: Deskripsi, Instruksi, Tools           │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  PRINSIP 3: Composable & Throwaway                       │
│  Pelajari pola: skill kecil, script, flag keamanan       │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  PRINSIP 4: Skills Semakin Pintar                        │
│  Praktikkan siklus: use → review → update → commit       │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  PRINSIP 5: Format Output Adalah Prompt                  │
│  Tingkatkan: minta HTML plan untuk proyek besar          │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  🏆 MASTERY: Kombinasikan semua prinsip                 │
│  Skills composable + Tools powerful + Iterasi terus      │
└──────────────────────────────────────────────────────────┘
```

---

## 💡 Kutipan Penting dari Anthropic Engineer

1. **Barry Zhang:** *"Skills are folders. This simplicity is deliberate."*
2. **Erik Schluntz:** *"Beautiful prompts. Bare-bones tools. That's the most common mistake."*
3. **Thariq Shihipar:** *"The plans are so long, I honestly have stopped reading them."*
4. **Chuma Kabaghe:** *"Claude Code feels like having this superpower — send off a sidekick, go figure it out, come back."*
5. **Thariq Shihipar:** *"All of us are becoming these compute allocators."*

---

## 🎯 Checklist Pemula

- [ ] Saya sudah membaca Prinsip 1 — Prompt Skills, Bukan Claude
- [ ] Saya sudah membuat 1 skill sederhana (folder + SKILL.md)
- [ ] Saya sudah membaca Prinsip 2 — Skills Lebih dari Sekadar Prompt
- [ ] Saya sudah mengidentifikasi tools yang bisa saya buat
- [ ] Saya sudah membaca Prinsip 3 — Composable & Throwaway
- [ ] Saya sudah memecah skill besar menjadi skill kecil
- [ ] Saya sudah membaca Prinsip 4 — Skills Semakin Pintar
- [ ] Saya sudah mengupdate skill setelah output tidak sempurna
- [ ] Saya sudah membaca Prinsip 5 — Format Output Adalah Prompt
- [ ] Saya sudah mencoba minta HTML plan untuk proyek berikutnya

---

**👉 Lanjut ke [Panduan Memulai untuk Pemula](./07-panduan-memulai-untuk-pemula.md)**  
**👈 [Kembali ke Daftar Isi](./README.md)**
