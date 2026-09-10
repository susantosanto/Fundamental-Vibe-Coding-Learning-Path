## 16. TIPS PRAKTIS DAN BEST PRACTICES

### 16.1 Yang HARUS Dilakukan

#### ✅ Tips #1: Buat Project di LLM, Bukan Sekadar Chat
```
Di ChatGPT: Buat "Project" baru
Di Claude: Buat "Project" baru
Upload semua file referensi
Set custom instructions
Alasan: Lebih banyak context memory dan bisa set behavior
```

#### ✅ Tips #2: Rename Setiap Chat di Builder
```
Contoh naming:
- Sprint 001 - Discovery & Architecture
- Sprint 002 - Sample Bundle
- Sprint 003 - Executive Output Polish

Alasan: Mudah melacak apa yang dilakukan kapan
```

#### ✅ Tips #3: Selalu Kembali ke Architect untuk Review
```
Setelah builder selesai:
1. Copy hasilnya
2. Kembali ke architect
3. "Builder baru selesai Sprint X. Ini hasilnya. Bagaimana menurut Anda?"

Alasan: Architect melihat big picture dan bisa catch masalah
```

#### ✅ Tips #4: Update STATE.MD Secara Berkala
```
Setelah setiap sprint selesai:
- Update status sprint
- Update apa yang baru saja terjadi
- Update langkah selanjutnya
- Update jika ada blokir
```

#### ✅ Tips #5: Dokumentasikan Setiap Keputusan
```
Setiap kali ada keputusan → Tulis di DECISIONS.MD
Jangan biarkan keputusan "terkubur" di chat history
```

#### ✅ Tips #6: Gunakan Bahasa Bisnis, Bukan Teknis
```
Anda tidak perlu jadi programmer untuk jadi architect.
Gunakan bahasa bisnis Anda sehari-hari.
AI akan mengerti dan menerjemahkan ke bahasa teknis.
```

#### ✅ Tips #7: Buat PR Kecil (dari Chris Titus Tech)
```
> "Small pull requests are critical. They are faster to 
> understand, cheaper to review, and easier to fix or revert."

Praktik:
- 1 sprint = 1 PR (idealnya)
- Jika PR > 200 baris, pertimbangkan untuk split
- Jika review > 20 menit, PR terlalu besar
```

#### ✅ Tips #8: Berikan Bukti, Bukan Klaim (dari Anthropic)
```
> "Have Claude show evidence rather than asserting success."

Contoh:
❌ "Sudah berhasil"
✅ "Test results: 15/15 passing. Build: success. Screenshot: [link]"

Bukti yang bisa diberikan:
- Test output
- Command output
- Screenshot
- Build log
```

### 16.2 Yang TIDAK Boleh Dilakukan

#### ❌ Anti-Tip #1: Jangan Langsung ke Coding
```
❌ "Buatkan saya aplikasi manajemen inventaris"
✅ "Saya ingin membangun aplikasi manajemen inventaris. 
    Mari kita mulai dengan brainstorming requirements-nya."
```

#### ❌ Anti-Tip #2: Jangan Simpan Semua di Satu Chat Panjang
```
❌ Chat dengan 50+ message yang berisi semua keputusan
✅ Chat per sprint, dengan konteks yang segar
```

#### ❌ Anti-Tip #3: Jangan Biarkan AI Menebak Aturan Bisnis
```
❌ Biarkan AI menentukan siapa yang boleh akses apa
✅ Definisikan aturan akses di PERMISSIONS.MD
```

#### ❌ Anti-Tip #4: Jangan Skip Documentation
```
❌ "Nanti aja dokumentasinya"
✅ Update folder system SETELAH setiap sprint selesai
```

#### ❌ Anti-Tip #5: Jangan Trust Builder Tanpa Review
```
❌ Builder selesai → langsung push ke production
✅ Builder selesai → review → architect sanity check → baru lanjut
```

#### ❌ Anti-Tip #6: Jangan Trust AI untuk Security (dari Chris Titus Tech)
```
❌ Biarkan AI memilih semua dependensi
✅ Pin versi di specification, verifikasi manual
✅ Gunakan Dependabot & CodeQL
```

### 16.3 Tips untuk Non-Programmer

```
Anda tidak perlu belajar jadi full-time developer.
Yang Anda butuhkan:
1. Pahami gambaran besar (big picture)
2. Bisa mendefinisikan workflow
3. Bisa mendefinisikan aturan bisnis
4. Bisa mengorganisir informasi
5. Bisa mengevaluasi output

Keterampilan yang sudah Anda miliki:
✅ Menggunakan Excel dan pivot table
✅ Memahami workflow bisnis
✅ Mengetahui input dan output
✅ Memahami aturan dan approval
✅ Mengetahui laporan yang penting
→ Semua ini adalah "bahan mentah" untuk menjadi architect yang baik!
```

---

