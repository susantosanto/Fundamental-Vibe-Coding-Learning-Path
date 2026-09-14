# 08 — Debugging Produksi & Postmortem

> **Level:** Menengah → Lanjut
> **Waktu:** 50 menit
> **Yang Anda dapat:** menangani masalah di sistem yang sedang dipakai orang, dan mencegahnya terulang

---

## 📖 Kenapa konteks ini berbeda

Semua yang Anda pelajari di file 01–07 berlaku di produksi. Tapi ada tiga hal yang berubah:

| Di lokal | Di produksi |
|---|---|
| Anda bisa menghentikan program | **Pengguna sedang memakainya.** Tidak bisa berhenti. |
| Anda bisa menambahkan `print()` dan menjalankan lagi | Setiap perubahan butuh deploy, dan deploy bisa memperburuk |
| Data uji | **Data nyata.** Salah menangani bisa merusak data pengguna |
| Tanpa tekanan | Tekanan nyata, dan orang menunggu jawaban |

Konsekuensinya: **urutan prioritasnya berbeda.** Di lokal, prioritasnya "temukan akarnya". Di produksi, prioritasnya:

```
1. HENTIKAN DAMPAK     → pengguna tidak boleh terus dirugikan
2. KEMBALIKAN LAYANAN  → sistem harus jalan lagi
3. BARU cari akarnya   → setelah tenang
```

Memperbaiki akar sebelum menghentikan dampak adalah kesalahan yang sangat umum — dan sangat mahal.

---

## Prinsip 1: Rollback dulu, debug kemudian

> **Kalau perubahan terakhir menyebabkan masalah, kembalikan perubahan itu. Jangan dulu menyelidiki.**

Ini terasa salah bagi developer — Anda ingin **tahu apa yang salah**. Tapi saat pengguna sedang dirugikan, rasa ingin tahu bukan prioritas.

```bash
# Kalau deploy terakhir penyebabnya
git revert HEAD
git push                    # deploy ulang

# Atau kembali ke tag/commit yang diketahui baik
git checkout v2.3.0
```

### Kenapa rollback dulu

| Alasan | Penjelasan |
|---|---|
| **Menghentikan dampak segera** | Debugging bisa berjam-jam. Pengguna tidak boleh menunggu. |
| **Memulihkan lingkungan yang diketahui baik** | Anda punya titik referensi untuk membandingkan |
| **Menghilangkan tekanan** | Debugging dengan tenang jauh lebih efektif |
| **Membuat debugging bisa dilakukan di lokal** | Kode versi lama bisa Anda jalankan di laptop |

**Yang penting:** setelah rollback, Anda masih **punya bug-nya** — di branch, di log, di data. Rollback tidak menghapus masalah; ia hanya menghentikan kerusakannya. Lalu Anda debug dengan tenang.

### Kapan rollback BUKAN jawabannya

- Masalahnya bukan dari deploy (misalnya: database penuh, sertifikat kedaluwarsa, API pihak ketiga mati)
- Rollback akan merusak data (misalnya migrasi skema yang sudah jalan)
- Tidak ada versi sebelumnya yang baik

Kalau migrasi database sudah dijalankan, rollback kode bisa **lebih buruk** — kode lama tidak mengenali skema baru. Ini alasan migrasi harus selalu **backward-compatible** minimal satu versi.

---

## Prinsip 2: Tanya "apa yang berubah?"

Ini pertanyaan tunggal yang paling berguna di produksi.

```
Apa yang berubah dalam 24 jam terakhir?

[ ] Deploy kode
[ ] Migrasi database
[ ] Perubahan konfigurasi / environment variable
[ ] Perubahan pada layanan pihak ketiga (API, CDN, DNS)
[ ] Naiknya trafik / beban
[ ] Perubahan data (impor massal, batch job)
[ ] Perubahan infrastruktur (server, sertifikat, DNS)
[ ] Tidak ada yang berubah ← ini juga informasi penting
```

**Kalau tidak ada yang berubah dan masalahnya muncul:** curigai hal yang **bertambah seiring waktu**:

- Data yang menumpuk (tabel membesar, log memenuhi disk)
- Sumber daya yang habis (koneksi, file handle, memori)
- Sertifikat/token yang kedaluwarsa
- Batas kuota yang tercapai
- Cache yang mulai basi

Ini kategori "tidak ada yang berubah tapi rusak" — dan penyebabnya hampir selalu sesuatu yang **bertambah terus sampai melewati batas**.

---

## Prinsip 3: Observability — debugging tanpa bisa menyentuh

Di lokal Anda bisa menambahkan `print()`. Di produksi Anda tidak bisa (harus deploy). Jadi Anda **harus sudah** punya instrumennya sebelum masalah terjadi.

### Tiga pilar

| Pilar | Menjawab | Alat umum |
|---|---|---|
| **Logs** | Apa yang terjadi pada satu kejadian? | File log, Loki, CloudWatch |
| **Metrics** | Bagaimana keadaan sistem secara keseluruhan? | Prometheus, Grafana, Datadog |
| **Traces** | Bagaimana satu permintaan melewati banyak service? | OpenTelemetry, Jaeger |

### Yang harus ada di log produksi

Log debugging lokal dan log produksi berbeda tujuannya. Log produksi harus bisa menjawab pertanyaan **tanpa Anda mengubah kode**:

```python
# ❌ Log lokal — tidak berguna di produksi
print("error")

# ✅ Log produksi
logger.error(
    "[simpan_absensi] gagal",
    extra={
        "request_id": request_id,        # ← untuk melacak satu permintaan
        "siswa_id": siswa_id,            # ← konteks bisnis
        "npsn": npsn,
        "user_id": user_id,
        "error_type": type(e).__name__,
    },
    exc_info=True,                       # ← stack trace lengkap
)
```

**`request_id` adalah yang paling penting.** Ia memungkinkan Anda mengambil **semua** log dari satu permintaan yang gagal — bahkan kalau permintaan itu melewati 5 service.

### Yang paling sering dilewatkan: log saat berhasil

Kebanyakan orang hanya log saat gagal. Padahal untuk debugging produksi, Anda butuh **pembanding**.

```
Tanpa log sukses:
  "Ada 3 error. Kenapa? Tidak tahu."

Dengan log sukses:
  "Ada 3 error dari 1000 permintaan. Bandingkan dengan 997 yang berhasil:
   yang gagal semua punya npsn=12345, yang berhasil npsn berbeda."
  → langsung menunjuk ke penyebabnya
```

Ini **debugging diferensial** (file `04`) yang diterapkan di produksi.

### Metric yang layak dipasang sejak awal

```
- Tingkat error (per endpoint, per menit)
- Latensi p50 / p95 / p99    ← p99 yang mengungkap masalah, bukan rata-rata
- Jumlah permintaan
- Penggunaan CPU / memori
- Jumlah koneksi database (aktif vs maksimum)   ← resource leak muncul di sini
- Ukuran antrean (kalau ada queue)
```

**Catatan tentang p99:** rata-rata menyembunyikan masalah. Kalau 99 pengguna mendapat respons 100ms dan 1 pengguna menunggu 30 detik, rata-ratanya terlihat bagus. **p99 yang menunjukkan masalahnya.**

---

## Prinsip 4: `git bisect` pada deploy

Kalau masalah mulai muncul "suatu waktu" dan Anda tidak tahu sejak kapan:

```bash
# Cari commit yang menyebabkan masalah
git bisect start
git bisect bad HEAD
git bisect good v2.3.0
git bisect run ./jalankan_test_yang_gagal.sh
```

Untuk masalah produksi, Anda bisa membisect **deploy history**:

```bash
# Kalau Anda punya daftar deploy
# Uji deploy ke-N: apakah masalahnya ada?
# Bisect secara manual: deploy 5 (ada) vs deploy 2 (tidak) → cek deploy 3
```

**Kalau tidak ada test yang bisa mengotomatiskan ini**, lakukan manual:

```
Deploy 1  ✅ baik
Deploy 2  ✅ baik
Deploy 3  ?          ← uji ini dulu (titik tengah)
Deploy 4  ❌ rusak
Deploy 5  ❌ rusak (sekarang)
```

Uji deploy 3. Kalau rusak → penyebabnya di 1–3. Kalau baik → penyebabnya di 4. Sepuluh deploy selesai dalam 3–4 langkah.

---

## Prinsip 5: Isolasi dengan feature flag

Kalau Anda tidak bisa rollback seluruhnya (misalnya karena ada perbaikan penting di deploy yang sama), **matikan fiturnya**, bukan seluruh deploy.

```python
if feature_flags.aktif("absensi_baru"):
    return alur_baru(data)
else:
    return alur_lama(data)
```

Ini mengubah "rollback seluruh deploy" menjadi "matikan satu fitur" — jauh lebih kecil risikonya, dan **seketika** (tanpa deploy ulang).

**Untuk debugging:** matikan separuh fitur, lihat apakah masalah hilang. Itu bisection pada level fitur.

---

## Checklist respons produksi

Urutannya penting. Jangan melompat.

```
MENIT 0–5: HENTIKAN DAMPAK
[ ] Bisa rollback? → rollback sekarang, jangan dulu menyelidiki
[ ] Kalau tidak bisa rollback → matikan fitur bermasalah
[ ] Kalau tidak bisa keduanya → masuk mode pemeliharaan / tampilkan pesan
[ ] Beri tahu pengguna (kalau dampaknya terlihat)

MENIT 5–15: UKUR DAMPAKNYA
[ ] Berapa pengguna terpengaruh?
[ ] Data apa yang mungkin rusak atau hilang?
[ ] Apakah ada masalah keamanan? ← kalau ya, prioritasnya naik drastis
[ ] Apakah masalahnya masih berlangsung, atau sudah berhenti sendiri?

MENIT 15–60: SELIDIKI
[ ] Apa yang berubah dalam 24 jam terakhir? (checklist di atas)
[ ] Baca log: cari request_id dari satu kejadian gagal
[ ] Bandingkan log GAGAL vs BERHASIL ← ini yang paling sering mengungkap
[ ] Lihat metric: kapan mulai? apa yang naik/turun bersamaan?
[ ] Uji hipotesis di lokal dengan data/kondisi yang sama

SETELAH PULIH: CEGAH TERULANG
[ ] Tulis postmortem (template di bawah)
[ ] Tambahkan test yang menangkap masalah ini
[ ] Tambahkan alert supaya Anda tahu lebih awal
[ ] Perbaiki akarnya di kode
```

### Yang JANGAN dilakukan saat produksi bermasalah

| Jangan | Kenapa |
|---|---|
| Deploy perbaikan "cepat" tanpa diuji | Anda bisa membuatnya lebih buruk, dan sekarang ada dua masalah |
| Debug langsung di produksi (mengubah kode/koneksi) | Anda kehilangan bukti, dan bisa merusak data |
| Menghapus log / merestart "untuk membersihkan" | **Bukti hilang.** Ini kesalahan yang paling mahal. |
| Menyalahkan seseorang | Anda kehilangan informasi — orang akan menyembunyikan detail |
| Melanjutkan tanpa menulis catatan | Masalah yang sama akan terulang, dan Anda mulai dari nol |

**Yang paling penting:** **jangan hapus log dan jangan restart** sebelum Anda mengambil semua yang Anda butuhkan. Log adalah satu-satunya saksi.

---

## Postmortem blameless

Setelah sistem pulih, tulis postmortem. Bukan untuk mencari siapa yang salah — untuk **memperbaiki sistemnya**.

### Prinsip blameless

> **Kalau satu orang bisa merusak sistem dengan satu kesalahan, itu masalah sistem, bukan masalah orangnya.**
>
> Orang yang takut disalahkan akan menyembunyikan informasi — dan informasi
> itulah yang Anda butuhkan untuk mencegah pengulangan.

Postmortem yang menyalahkan menghasilkan: orang berhenti melaporkan masalah, dan masalah menjadi lebih besar sebelum terlihat.

### Template postmortem

```markdown
# Postmortem: <judul singkat>

**Tanggal:** ____
**Durasi:** mulai ____ selesai ____ (total ____ menit)
**Dampak:** ____ pengguna, ____ fitur, ____ data
**Tingkat keparahan:** Ringan / Sedang / Berat / Kritis

---

## 1. Ringkasan
<Satu paragraf. Kalau seseorang hanya membaca ini, apa yang harus ia tahu?>

## 2. Garis waktu
| Waktu | Kejadian |
|---|---|
| 14:02 | Deploy v2.4.1 |
| 14:15 | Pengguna pertama melaporkan error |
| 14:22 | Alert "error rate > 5%" menyala |
| 14:25 | Mulai investigasi |
| 14:38 | Rollback ke v2.4.0 |
| 14:40 | Layanan pulih |
| 15:30 | Akar masalah teridentifikasi |

**Perhatikan dua hal:**
- Waktu antara 14:02 dan 14:22 → **20 menit sebelum alert.** Kenapa?
- Waktu antara 14:25 dan 14:38 → **13 menit untuk memutuskan rollback.** Bisa lebih cepat?

## 3. Akar masalah
<Mekanisme, bukan gejala. Tanya "kenapa" sampai akarnya.>

## 4. Apa yang bekerja baik
<Ini bagian yang paling sering dilewatkan dan paling berguna.
 Rollback berjalan? Alert menyala? Log cukup untuk melacak?>

## 5. Apa yang tidak bekerja baik
<Tanpa menyalahkan orang. "Alert terlambat 20 menit" bukan
 "Andi lupa menyalakan alert".>

## 6. Tindakan pencegahan
| Tindakan | Jenis | Penanggung jawab | Tenggat |
|---|---|---|---|
| Tambah alert untuk error rate di endpoint absensi | Deteksi | ____ | ____ |
| Tambah test untuk kasus data kosong | Pencegahan | ____ | ____ |
| Dokumentasikan prosedur rollback | Respons | ____ | ____ |

## 7. Pelajaran
<Kalau masalah serupa muncul lagi, apa tanda pertama yang harus diperiksa?>
```

### Contoh pengisian bagian 3 (akar masalah)

```
Gejala:  laporan absensi bulanan kosong untuk sebagian sekolah
  └─ Kenapa? → API mengembalikan array kosong untuk sekolah itu
      └─ Kenapa? → query menyaring dengan tanggal di zona waktu yang salah
          └─ Kenapa? → kode baru memakai datetime.now() (waktu server UTC)
                       bukan tanggal lokal sekolah
              └─ AKAR: kode baru mengabaikan zona waktu WIB
```

Perhatikan: berhenti di **mekanisme teknis**, bukan di "kurang teliti". "Kurang teliti" bukan akar — itu bukan sesuatu yang bisa Anda perbaiki. "Kode baru mengabaikan zona waktu" adalah akar, karena bisa diperbaiki (tambahkan test untuk kasus batas bulan, tambahkan lint, dan sebagainya).

### Tiga jenis tindakan pencegahan

Ini penting untuk dipahami — kebanyakan tim hanya melakukan jenis pertama, padahal yang kedua dan ketiga yang lebih efektif:

| Jenis | Contoh | Kapan efektif |
|---|---|---|
| **Pencegahan** | Tambah test, perbaiki kode | Mencegah **masalah yang sama** terulang |
| **Deteksi** | Tambah alert, tambah metric | Membuat Anda tahu **lebih awal** saat masalah lain muncul |
| **Respons** | Runbook, prosedur rollback, dokumentasi | Membuat pemulihan **lebih cepat** |

**Yang paling sering dilewatkan: Deteksi.** Menambahkan test mencegah bug **itu** kembali, tapi tidak membantu Anda saat bug **berbeda** muncul. Alert yang lebih baik membantu Anda di **setiap** insiden berikutnya.

Kalau Anda hanya punya waktu untuk satu jenis tindakan, pilih **deteksi**. Ia memberi hasil berulang.

---

## Menghubungkan ke materi lain di repo ini

Repo ini sudah punya materi operasional yang bagus di `vibecoding/`. File ini melengkapinya dengan sisi **debugging**-nya:

| File | Isi | Kaitannya dengan debugging |
|---|---|---|
| `vibecoding/11-panduan-runbook.md` | Prosedur operasional | **Tulis runbook sebelum insiden pertama.** Saat panik, Anda tidak bisa berpikir jernih — ikuti dokumen. |
| `vibecoding/12-panduan-respons-insiden.md` | Prosedur respons insiden | Melengkapi checklist di file ini dengan konteks tim |
| `vibecoding/13-panduan-change-log.md` | Catatan perubahan | Sumber utama untuk menjawab "apa yang berubah?" |
| `vibecoding/14-panduan-prosedur-pemulihan.md` | Prosedur pemulihan | Rollback, restore database, failover |
| `vibecoding/15-panduan-kontak-vendor.md` | Kontak pihak ketiga | Saat masalahnya di layanan eksternal |
| `fase-4-deep-system-design/07-observability-monitoring.md` | Observability skala sistem | Pendalaman tiga pilar |
| `skills-vendor/observability-and-instrumentation/` | Skill instrumentasi | Versi agent dari konsep ini |

**Urutan yang saya sarankan:** baca `vibecoding/11-runbook` **sekarang**, sebelum Anda membutuhkannya. Menulis runbook saat insiden sudah terjadi terlalu lambat.

---

## Yang harus disiapkan SEBELUM insiden pertama

Ini daftar yang paling tinggi rasio manfaat/usaha-nya. Lakukan semuanya **sebelum** ada masalah.

```
[ ] Prosedur rollback yang TERTULIS dan SUDAH PERNAH DICOBA
    (prosedur yang belum pernah diuji bukan prosedur — itu harapan)

[ ] Alert untuk: error rate, latensi p99, koneksi database, disk
    (minimal 4 ini)

[ ] request_id di semua log, dan bisa dicari

[ ] Log GAGAL dan BERHASIL untuk operasi penting
    (tanpa ini, Anda tidak punya pembanding saat insiden)

[ ] Backup database yang DIUJI RESTORE-nya
    (backup yang tidak pernah diuji restore bukan backup)

[ ] Daftar "apa yang berubah" yang bisa diakses cepat
    (git log + change log + riwayat deploy)

[ ] Satu orang yang tahu harus menelepon siapa

[ ] Postmortem terakhir dibaca ulang
    (pelajaran yang tidak dibaca ulang akan terulang)
```

**Yang paling sering dilewatkan dan paling penting:** **menguji prosedur rollback.** Tim yang belum pernah mencoba rollback akan menemukan bahwa rollback-nya tidak bekerja tepat saat mereka paling membutuhkannya.

---

## Ringkasan

| Prinsip | Isinya |
|---|---|
| **Rollback dulu** | Hentikan dampak sebelum menyelidiki. Debugging bisa menunggu. |
| **Apa yang berubah?** | Pertanyaan tunggal paling berguna di produksi |
| **Observability sebelum insiden** | Anda tidak bisa menambahkan `print()` di produksi |
| **Log GAGAL dan BERHASIL** | Pembanding yang mengungkap penyebab |
| **`git bisect` pada deploy** | 10 deploy selesai dalam 3–4 langkah |
| **Feature flag** | Matikan fitur, bukan seluruh deploy |
| **Jangan hapus log, jangan restart** | Itu satu-satunya saksi |
| **Blameless postmortem** | Salah menyalahkan orang → informasi disembunyikan |
| **Prioritaskan deteksi** | Alert membantu di **setiap** insiden, bukan hanya yang ini |

---

## Kriteria "saya siap menghadapi insiden"

- [ ] Saya tahu prosedur rollback saya, dan pernah mencobanya
- [ ] Saya punya minimal 4 alert: error rate, latensi, koneksi, disk
- [ ] Semua log saya punya `request_id` yang bisa dicari
- [ ] Operasi penting saya mencatat keberhasilan **dan** kegagalan
- [ ] Backup saya sudah pernah diuji restore
- [ ] Saya punya runbook tertulis
- [ ] Saya tahu siapa yang harus dihubungi
- [ ] Saya pernah menulis satu postmortem, meskipun untuk masalah kecil

---

> **Kembali ke:** [`../05-jalur-debugging-dan-fix-error.md`](../05-jalur-debugging-dan-fix-error.md) — jalur lengkap debugging
> **Lanjut ke:** [`../arsitektur/01-berpikir-arsitektur.md`](../arsitektur/01-berpikir-arsitektur.md) — jalur pasangannya
