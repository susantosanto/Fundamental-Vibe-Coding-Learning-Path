## 14. MANAJEMEN SESSION AI

### 14.1 Prinsip Dasar

> **💡 Kutipan dari Anthropic:**
> *"Conversations are persistent and reversible. Use this to your advantage!"*

### 14.2 Strategi Manajemen Session

```
MANAJEMEN SESSION:
═══════════════════════════════════════════════════

1. NAMA SETIAP SESSION
   ├── Sprint 001 - Discovery
   ├── Sprint 002 - Sample Bundle
   ├── Sprint 003 - Executive Output
   └── etc.

2. RESET ANTAR TASK
   ├── /clear (Claude Code)
   ├── New chat (Codex)
   └── Alasan: Konteks yang bersih > Konteks yang penuh

3. GUNAKAN CHECKPOINT
   ├── Claude Code: Esc + Esc → Rewind
   ├── Codex: Undo/Redo
   └── Alasan: Bisa coba sesuatu yang berisiko, lalu rollback

4. RESUME CONVERSATION
   ├── claude --continue (session terakhir)
   ├── claude --resume (pilih dari list)
   └── Alasan: Task bisa dilanjutkan di lain waktu

═══════════════════════════════════════════════════
```

### 14.3 Kapan Harus Mulai Chat Baru?

```
MULAI CHAT BARU KETIKA:
✅ Berganti sprint
✅ Topik yang dibahas sudah tidak relevan
✅ Sudah mengoreksi AI lebih dari 2 kali untuk hal sama
✅ Context sudah penuh (AI mulai "lupa")
✅ Ingin fokus pada task baru yang berbeda

JANGAN MULAI CHAT BARU KETIKA:
❌ Masih dalam sprint yang sama
❌ Butuh konteks dari percakapan sebelumnya
❌ Sedang dalam flow yang baik
```

### 14.4 Tanda-tanda Context Problems

```
TANDA CONTEXT PROBLEMS:
═══════════════════════════════════════════════════

⚠️ AI mulai mengulang pertanyaan yang sudah dijawab
⚠️ AI melupakan instruksi yang diberikan di awal
⚠️ AI membuat kesalahan yang sama berulang kali
⚠️ AI mengubah kode yang seharusnya tidak diubah
⚠️ AI menggunakan dependensi yang sudah usang
⚠️ AI memberikan jawaban yang tidak relevan

SOLUSI:
→ /clear dan mulai dengan prompt baru yang lebih spesifik
→ atau Mulai chat baru dengan context yang lebih fokus

═══════════════════════════════════════════════════
```

---

