## 4. ANALOGI MEMBANGUN RUMAH

### 4.1 Cara yang Salah (Vibe Coding)

```
Anda: [memberikan sketsa di atas tisu ke tukang]
      "Bangun yang modern, 3 kamar tidur, dapur yang bagus,
       terserah kalian atur."

Tukang: "Oke..." [mulai membangun sesuai tebakan]

Hasil: ❌ Rumah TIDAK sesuai keinginan Anda
       ❌ Kamar terlalu kecil
       ❌ Dapur di tempat yang salah
       ❌ Listrik tidak mencukupi
       ❌ Perlu renovasi besar-besaran (= rewrite kode)
```

### 4.2 Cara yang Benar (Architect-Builder)

```
Anda → Berbicara dengan Arsitek (Architect Layer)
       ↓
Arsitek bertanya banyak hal:
       • Berapa budget?
       • Gaya hidup seperti apa?
       • Berapa banyak anggota keluarga?
       • Butuh ruang kerja?
       • Preferensi material?
       • Apa yang paling penting?
       ↓
Arsitek membuat gambar teknis lengkap:
       • Denah lantai (floor plan)
       • Tampak depan/samping/belakang
       • Detail struktur
       • Spesifikasi material
       • Estimasi biaya
       • Jadwal pengerjaan
       ↓
Gambar teknis diserahkan ke Tukang (Builder Layer)
       ↓
Tukang membangun SESUAI gambar teknis
       ↓
Arsitek melakukan inspeksi berkala
       ↓
Hasil: ✅ Rumah sesuai impian Anda!
       ✅ Sesuai budget
       ✅ Sesuai jadwal
       ✅ Sesuai standar keamanan
```

### 4.3 Peta Perbandingan

| Dunia Konstruksi | Dunia Software |
|------------------|---------------|
| Anda (pemilik rumah) | Anda (pemilik bisnis/ide) |
| Arsitek | ChatGPT/Claude (Architect) |
| Tukang/Bangunan | Codex/Claude Code (Builder) |
| Gambar teknis | Architect Pack (rencana) |
| Material & struktur | Kode sumber (source code) |
| Inspeksi rumah | Testing & validasi |
| IMB (Izin Mendirikan Bangunan) | Code review & approval |
| Kontrak kerja | Acceptance criteria |

---

