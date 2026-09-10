## 17. KESALAHAN UMUM & CARA MENGHINDARINYA

### 17.1 Daftar Kesalahan Umum

> **💡 Kutipan dari Anthropic:**
> *"These are common mistakes. Recognizing them early saves time."*

```
KESALAHAN UMUM:
═══════════════════════════════════════════════════

1. 🚨 THE KITCHEN SINK SESSION
   Masalah: Mulai dengan 1 task, lalu tiba-tiba pindah ke 
            task lain yang tidak relevan. Context penuh 
            dengan informasi yang tidak berguna.
   
   Solusi: /clear antar task yang tidak berhubungan.

2. 🚨 CORRECTING OVER AND OVER
   Masalah: AI melakukan kesalahan, Anda koreksi, masih 
            salah, koreksi lagi. Context terpolusi dengan 
            pendekatan yang gagal.
   
   Solusi: Setelah 2 koreksi gagal, /clear dan buat 
           prompt baru yang lebih spesifik.

3. 🚨 OVER-SPECIFIED CLAUDE.MD
   Masalah: CLAUDE.MD terlalu panjang, AI mengabaikan 
            setengah isinya karena aturan penting tenggelam.
   
   Solusi: Prune secara agresif. Jika AI sudah bisa 
           melakukan sesuatu tanpa instruksi, hapus.

4. 🚨 THE TRUST-THEN-VERIFY GAP
   Masalah: AI menghasilkan implementasi yang terlihat 
            meyakinkan tapi tidak handle edge cases.
   
   Solusi: Selalu sediakan verifikasi (tests, scripts, 
           screenshots). Jika tidak bisa verifikasi, 
           jangan deploy.

5. 🚨 JUMPING STRAIGHT TO CODE
   Masalah: Langsung minta AI coding tanpa plan mode.
            Menghasilkan kode yang menyelesaikan masalah 
            yang salah.
   
   Solusi: Explore → Plan → Implement. Pisahkan 
           riset dari implementasi.

6. 🚨 ONE GIANT PROMPT
   Masalah: Satu prompt besar yang loop sampai AI 
            "declare victory". Menghasilkan demo, 
            bukan perangkat lunak yang maintainable.
   
   Solusi: Break menjadi sprint-sprint kecil dengan 
           architect pack masing-masing.

═══════════════════════════════════════════════════
```

### 17.2 Troubleshooting Guide

```
MASALAH: AI menghasilkan kode yang berbeda dari yang diharapkan
─────────────────────────────────────────────────────────────
Kemungkinan penyebab:
├── Prompt terlalu samar
├── Context tidak cukup
├── Requirements tidak jelas
└── AI menggunakan asumsi yang salah

Solusi:
├── Berikan prompt yang lebih spesifik
├── Refer file spesifik dengan @
├── Berikan contoh (few-shot prompting)
└── Gunakan plan mode dulu

MASALAH: AI mengubah kode yang seharusnya tidak diubah
─────────────────────────────────────────────────────────────
Kemungkinan penyebab:
├── Scope creep
├── AI terlalu agresif
└── Tidak ada batasan yang jelas

Solusi:
├── Batasi scope di prompt
├── Gunakan --allowedTools
├── Set batasan di AGENTS.MD
└── Review diff sebelum commit

MASALAH: AI menggunakan dependensi yang salah
─────────────────────────────────────────────────────────────
Kemungkinan penyebab:
├── AI mengingat versi lama dari training data
├── Tidak ada pinning versi
└── Tidak ada dependency review

Solusi:
├── Pin versi di specification
├── Verifikasi current versions
├── Gunakan Dependabot
└── CI dependency review

═══════════════════════════════════════════════════
```

---

