# C2: Pengolahan Data dengan AI

> **Analisis CSV/Excel/JSON dengan Python (pandas) dan AI, auto-generate laporan, visualisasi, dan database query**

**Estimasi**: 40 menit belajar + 60 menit praktik | **Level**: Pemula-Menengah

## 🎯 Outcome

Setelah modul ini, kamu bisa:
- Membaca, menulis, dan memproses file CSV/Excel/JSON dengan Python pandas
- Membersihkan data kotor: missing values, duplikat, outlier, format tidak konsisten
- Transformasi data: pivot, melt, merge, join, concat
- Analisis statistik deskriptif, korelasi, tren, dan deteksi anomali
- Generate laporan otomatis dengan tabel, chart, dan executive summary
- Visualisasi data dengan matplotlib, seaborn, dan plotly
- Membuat dan mengoptimasi SQL query dengan bantuan AI
- Membangun ETL pipeline sederhana untuk pengolahan data sekolah
- Validasi data dengan schema dan business rules
- Memproses dataset besar dengan chunking dan batch processing

## 🤔 Masalah yang Diselesaikan

| Masalah | Solusi AI |
|---------|-----------|
| Rumus Excel terlalu rumit untuk analisis kompleks | AI generate script pandas yang otomatis |
| Data kotor, banyak nilai kosong dan duplikat | AI detect dan clean otomatis |
| Butuh laporan tapi formatting makan waktu berjam-jam | AI generate laporan + chart dalam hitungan menit |
| Tidak tahu cara join tabel dari sumber berbeda | AI tulis query SQL/pandas merge yang benar |
| Data terlalu besar untuk dibuka di Excel | AI proses dengan chunking dan memory optimization |
| Tidak tahu chart mana yang tepat untuk data tertentu | AI rekomendasikan visualisasi berdasarkan tipe data |

## 🔑 Konsep Inti

### Alur Pengolahan Data Lengkap

```
1. Ingest (Baca Data)
   ↓
2. Profile (Pahami Struktur)
   ↓
3. Clean (Bersihkan)
   ↓
4. Transform (Ubah Bentuk)
   ↓
5. Analyze (Analisis)
   ↓
6. Visualize (Visualisasi)
   ↓
7. Report (Generate Laporan)
   ↓
8. Store (Simpan/Export)
```

### Tools Python untuk Pengolahan Data

| Library | Fungsi Utama | Contoh Penggunaan |
|---------|-------------|-------------------|
| `pandas` | Data manipulation & analysis | Baca CSV, filter, groupby, merge |
| `numpy` | Numerical computing | Array operations, matematika |
| `matplotlib` | Static visualization | Line chart, bar chart, scatter plot |
| `seaborn` | Statistical visualization | Heatmap, pairplot, distribution |
| `plotly` | Interactive visualization | Dashboard, hover info, zoom |
| `openpyxl` | Excel file handling | Baca/tulis file .xlsx |
| `sqlite3` | Database queries | SQL query, table management |
| `sqlalchemy` | Database ORM | Koneksi database, query builder |

### Prompt Template untuk Pengolahan Data

```
Template 1 - Analisis Data:
"@data.csv Analisis data ini:
1. Struktur (kolom, tipe data, ukuran)
2. Statistik deskriptif per kolom numerik
3. Missing values dan duplikat
4. Insight atau pola menarik
5. Rekomendasi analisis lebih lanjut"

Template 2 - Cleaning:
"@data.csv Bersihkan data ini:
1. Handle missing values (isi dengan median/mean/mode)
2. Hapus duplikat
3. Standarisasi format (tanggal, angka, teks)
4. Konversi tipe data yang salah
5. Simpan hasil ke data_clean.csv"

Template 3 - Laporan:
"@data_clean.csv Buatkan laporan analisis:
1. Ringkasan eksekutif (3-5 poin utama)
2. Statistik kunci dalam tabel Markdown
3. Visualisasi rekomendasi (jenis chart + alasan)
4. Tren dan pola yang terdeteksi
5. Simpan sebagai Laporan.md"
```

## 🚀 Praktik Lengkap

### Bagian 1: Membaca dan Memahami Data

#### Step 1.1: Baca File CSV dengan AI

```
@data_siswa.csv Pahami struktur file ini:
1. Berapa baris dan kolom?
2. Apa saja nama kolom dan tipe datanya?
3. Apakah ada kolom yang seharusnya numerik tapi terbaca string?
4. Apakah ada nilai yang aneh atau tidak konsisten?
5. Berikan ringkasan 3 kalimat tentang data ini
```

#### Step 1.2: Profile Data dengan Python Script

Minta AI buatkan script profiling:

```python
# scripts/profile_data.py
import pandas as pd
import numpy as np

def profile_data(filepath):
    """Profil lengkap dataset."""
    df = pd.read_csv(filepath)

    print(f"=== PROFIL DATA: {filepath} ===")
    print(f"Jumlah baris: {len(df):,}")
    print(f"Jumlah kolom: {len(df.columns)}")
    print(f"Memori digunakan: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
    print()

    # Info tipe data
    print("=== TIPE DATA ===")
    print(df.dtypes)
    print()

    # Missing values
    print("=== MISSING VALUES ===")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    missing_df = pd.DataFrame({
        'Missing': missing,
        'Persentase': missing_pct
    })
    print(missing_df[missing_df['Missing'] > 0])
    print()

    # Statistik numerik
    print("=== STATISTIK NUMERIK ===")
    print(df.describe().round(2))
    print()

    # Statistik kategorikal
    print("=== STATISTIK KATEGORIKAL ===")
    for col in df.select_dtypes(include=['object']).columns:
        print(f"\n{col}:")
        print(f"  Unique values: {df[col].nunique()}")
        print(f"  Top 5: {df[col].value_counts().head().to_dict()}")

    # Duplikat
    print(f"\n=== DUPLIKAT ===")
    print(f"Baris duplikat: {df.duplicated().sum()}")

    return df

if __name__ == "__main__":
    profile_data("data_siswa.csv")
```

Jalankan:
```bash
python scripts/profile_data.py
```

### Bagian 2: Data Cleaning (Pembersihan Data)

#### Step 2.1: Handling Missing Values

```python
# scripts/clean_missing.py
import pandas as pd
import numpy as np

def handle_missing_values(df):
    """Handle missing values dengan strategi berbeda per kolom."""

    # Strategi 1: Drop baris dengan missing values di kolom kritis
    critical_cols = ['nisn', 'nama_lengkap', 'kelas']
    df = df.dropna(subset=critical_cols)
    print(f"Setelah drop missing di kolom kritis: {len(df)} baris")

    # Strategi 2: Isi numerik dengan median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        median_val = df[col].median()
        df[col] = df[col].fillna(median_val)
        print(f"  {col}: diisi median = {median_val}")

    # Strategi 3: Isi kategorikal dengan mode
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        mode_val = df[col].mode()
        if len(mode_val) > 0:
            df[col] = df[col].fillna(mode_val[0])
            print(f"  {col}: diisi mode = {mode_val[0]}")

    # Strategi 4: Forward fill untuk time series
    # df['nilai'] = df['nilai'].fillna(method='ffill')

    # Verifikasi
    print(f"\nMissing values tersisa: {df.isnull().sum().sum()}")
    return df

df = pd.read_csv("data_siswa_raw.csv")
df_clean = handle_missing_values(df)
df_clean.to_csv("data_siswa_clean.csv", index=False)
```

#### Step 2.2: Handling Duplikat

```python
# scripts/remove_duplicates.py
import pandas as pd

def remove_duplicates_smart(df):
    """Hapus duplikat dengan strategi cerdas."""

    print(f"Data sebelum: {len(df)} baris")

    # Cek duplikat penuh
    full_dups = df.duplicated().sum()
    print(f"Duplikat penuh: {full_dups}")

    # Cek duplikat berdasarkan kolom kunci
    key_dups = df.duplicated(subset=['nisn']).sum()
    print(f"Duplikat berdasarkan NISN: {key_dups}")

    if key_dups > 0:
        # Simpan yang paling lengkap (paling banyak non-null)
        df['completeness'] = df.notna().sum(axis=1)
        df = df.sort_values('completeness', ascending=False)
        df = df.drop_duplicates(subset=['nisn'], keep='first')
        df = df.drop(columns=['completeness'])
        print(f"Setelah hapus duplikat NISN: {len(df)} baris")

    # Hapus duplikat penuh
    df = df.drop_duplicates()
    print(f"Setelah hapus duplikat penuh: {len(df)} baris")

    return df

df = pd.read_csv("data_siswa_clean.csv")
df_clean = remove_duplicates_smart(df)
df_clean.to_csv("data_siswa_nodup.csv", index=False)
```

#### Step 2.3: Handling Outlier

```python
# scripts/detect_outliers.py
import pandas as pd
import numpy as np

def detect_and_handle_outliers(df, columns, method='iqr'):
    """Deteksi dan handle outlier."""

    for col in columns:
        if method == 'iqr':
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 1.5 * IQR
            upper = Q3 + 1.5 * IQR

            outliers = df[(df[col] < lower) | (df[col] > upper)]
            print(f"\n{col}:")
            print(f"  IQR bounds: [{lower:.2f}, {upper:.2f}]")
            print(f"  Outlier count: {len(outliers)}")

            # Handle: cap ke batas IQR
            df[col] = df[col].clip(lower, upper)

        elif method == 'zscore':
            z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
            outliers = df[z_scores > 3]
            print(f"\n{col}:")
            print(f"  Outlier (|z| > 3): {len(outliers)}")

            # Handle: ganti dengan median
            median_val = df[col].median()
            df.loc[z_scores > 3, col] = median_val

    return df

df = pd.read_csv("data_siswa_nodup.csv")
numeric_cols = ['nilai_mtk', 'nilai_bhs', 'nilai_ipa', 'hadir']
df_clean = detect_and_handle_outliers(df, numeric_cols, method='iqr')
df_clean.to_csv("data_siswa_final.csv", index=False)
```

#### Step 2.4: Standarisasi Format

```python
# scripts/standardize_format.py
import pandas as pd
import re

def standardize_formats(df):
    """Standarisasi format data."""

    # 1. Format tanggal
    if 'tanggal_lahir' in df.columns:
        df['tanggal_lahir'] = pd.to_datetime(df['tanggal_lahir'], errors='coerce')
        df['tanggal_lahir'] = df['tanggal_lahir'].dt.strftime('%Y-%m-%d')

    # 2. Format NISN (harus 10 digit)
    if 'nisn' in df.columns:
        df['nisn'] = df['nisn'].astype(str).str.zfill(10)
        df['nisn'] = df['nisn'].str.replace(r'\D', '', regex=True)

    # 3. Format nama (Title Case)
    if 'nama_lengkap' in df.columns:
        df['nama_lengkap'] = df['nama_lengkap'].str.title()
        df['nama_lengkap'] = df['nama_lengkap'].str.replace(r'\s+', ' ', regex=True)

    # 4. Format nomor telepon
    if 'no_telp' in df.columns:
        df['no_telp'] = df['no_telp'].astype(str)
        df['no_telp'] = df['no_telp'].str.replace(r'[^\d+]', '', regex=True)
        df['no_telp'] = df['no_telp'].apply(
            lambda x: '0' + x if x.startswith('62') else x
        )

    # 5. Format angka (hapus koma, ganti titik)
    for col in df.select_dtypes(include=['object']).columns:
        if df[col].str.match(r'^[\d\.,]+$', na=False).mean() > 0.8:
            df[col] = df[col].str.replace(',', '.', regex=False)
            df[col] = pd.to_numeric(df[col], errors='ignore')

    return df

df = pd.read_csv("data_siswa_final.csv")
df_std = standardize_formats(df)
df_std.to_csv("data_siswa_std.csv", index=False)
```

### Bagian 3: Data Transformation

#### Step 3.1: Pivot dan Melt

```python
# scripts/pivot_melt.py
import pandas as pd

def pivot_data(df):
    """Pivot data dari long ke wide format."""

    # Contoh: nilai siswa per mata pelajaran
    # Format long: nisn | nama | mapel | nilai
    # Format wide: nisn | nama | mtk | bhs | ipa

    pivot_df = df.pivot_table(
        index=['nisn', 'nama_lengkap'],
        columns='mata_pelajaran',
        values='nilai',
        aggfunc='mean'
    ).reset_index()

    # Flatten column names
    pivot_df.columns.name = None
    pivot_df.columns = [
        'nisn' if c == 'nisn' else
        'nama_lengkap' if c == 'nama_lengkap' else
        f'nilai_{c.lower()}' for c in pivot_df.columns
    ]

    return pivot_df

def melt_data(df):
    """Melt data dari wide ke long format."""

    # Format wide: nisn | nama | nilai_mtk | nilai_bhs | nilai_ipa
    # Format long: nisn | nama | mata_pelajaran | nilai

    melted_df = pd.melt(
        df,
        id_vars=['nisn', 'nama_lengkap'],
        value_vars=['nilai_mtk', 'nilai_bhs', 'nilai_ipa'],
        var_name='mata_pelajaran',
        value_name='nilai'
    )

    # Bersihkan nama mapel
    melted_df['mata_pelajaran'] = melted_df['mata_pelajaran'].str.replace('nilai_', '')

    return melted_df

df = pd.read_csv("data_nilai_long.csv")
df_wide = pivot_data(df)
df_wide.to_csv("data_nilai_wide.csv", index=False)

df_wide = pd.read_csv("data_nilai_wide.csv")
df_long = melt_data(df_wide)
df_long.to_csv("data_nilai_long_back.csv", index=False)
```

#### Step 3.2: Merge dan Join

```python
# scripts/merge_data.py
import pandas as pd

def merge_school_data():
    """Merge berbagai sumber data sekolah."""

    # Baca semua sumber data
    siswa = pd.read_csv("data_siswa_std.csv")
    nilai = pd.read_csv("data_nilai_wide.csv")
    kehadiran = pd.read_csv("data_kehadiran.csv")
    keuangan = pd.read_csv("data_pembayaran.csv")

    # 1. Inner join: hanya siswa yang punya data nilai
    siswa_nilai = pd.merge(
        siswa, nilai,
        on=['nisn', 'nama_lengkap'],
        how='inner'
    )
    print(f"Siswa dengan nilai: {len(siswa_nilai)}")

    # 2. Left join: semua siswa + kehadiran (kalau ada)
    siswa_lengkap = pd.merge(
        siswa_nilai, kehadiran,
        on=['nisn', 'nama_lengkap'],
        how='left'
    )
    print(f"Siswa lengkap: {len(siswa_lengkap)}")

    # 3. Merge dengan keuangan
    siswa_full = pd.merge(
        siswa_lengkap, keuangan,
        on=['nisn'],
        how='left',
        suffixes=('_siswa', '_keuangan')
    )

    # 4. Merge berdasarkan multiple keys dengan indikator
    merged_with_indicator = pd.merge(
        siswa, nilai,
        on=['nisn', 'nama_lengkap'],
        how='outer',
        indicator=True
    )
    # Cek yang tidak match
    only_siswa = merged_with_indicator[merged_with_indicator['_merge'] == 'left_only']
    only_nilai = merged_with_indicator[merged_with_indicator['_merge'] == 'right_only']
    print(f"Hanya di data siswa: {len(only_siswa)}")
    print(f"Hanya di data nilai: {len(only_nilai)}")

    return siswa_full

df_full = merge_school_data()
df_full.to_csv("data_sekolah_merged.csv", index=False)
```

#### Step 3.3: Concat dan Append

```python
# scripts/concat_data.py
import pandas as pd
import glob

def concat_multiple_files(pattern):
    """Gabung multiple file dengan struktur sama."""

    # Cari semua file yang match pattern
    files = glob.glob(pattern)
    print(f"Ditemukan {len(files)} file")

    dfs = []
    for f in files:
        df = pd.read_csv(f)
        df['sumber_file'] = f  # Track sumber
        dfs.append(df)
        print(f"  {f}: {len(df)} baris")

    # Gabung semua
    combined = pd.concat(dfs, ignore_index=True)
    print(f"Total setelah concat: {len(combined)} baris")

    # Cek duplikat antar file
    dupes = combined.duplicated(subset=['nisn'], keep=False)
    print(f"Potensi duplikat antar file: {dupes.sum()}")

    return combined

# Gabung data per kelas
df_all = concat_multiple_files("data_kelas_*.csv")
df_all.to_csv("data_semua_kelas.csv", index=False)
```

### Bagian 4: Data Analysis

#### Step 4.1: Statistik Deskriptif

```python
# scripts/descriptive_stats.py
import pandas as pd
import numpy as np

def descriptive_analysis(df):
    """Analisis statistik deskriptif lengkap."""

    print("=== STATISTIK DESKRIPTIF ===")

    # Ringkasan umum
    print(f"\nJumlah siswa: {len(df):,}")
    print(f"Jumlah kelas: {df['kelas'].nunique()}")

    # Statistik numerik detail
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        print(f"\n--- {col} ---")
        print(f"  Mean:   {df[col].mean():.2f}")
        print(f"  Median: {df[col].median():.2f}")
        print(f"  Std:    {df[col].std():.2f}")
        print(f"  Min:    {df[col].min():.2f}")
        print(f"  Max:    {df[col].max():.2f}")
        print(f"  Q1:     {df[col].quantile(0.25):.2f}")
        print(f"  Q3:     {df[col].quantile(0.75):.2f}")
        print(f"  Skew:   {df[col].skew():.2f}")

    # Distribusi kategorikal
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        print(f"\n--- {col} ---")
        print(df[col].value_counts().head(10))

    # Analisis per grup
    if 'kelas' in df.columns and 'nilai_rata' in df.columns:
        print("\n=== RATA-RATA NILAI PER KELAS ===")
        kelas_stats = df.groupby('kelas')['nilai_rata'].agg([
            'mean', 'median', 'std', 'count'
        ]).round(2)
        print(kelas_stats)

    # Korelasi
    print("\n=== KORELASI ANTAR KOLOM NUMERIK ===")
    corr = df[numeric_cols].corr().round(3)
    print(corr)

    return df

df = pd.read_csv("data_sekolah_merged.csv")
descriptive_analysis(df)
```

#### Step 4.2: Analisis Tren

```python
# scripts/trend_analysis.py
import pandas as pd
import numpy as np

def trend_analysis(df, date_col, value_col):
    """Analisis tren time series."""

    # Konversi tanggal
    df[date_col] = pd.to_datetime(df[date_col])
    df = df.sort_values(date_col)

    # Agregasi per bulan
    df['bulan'] = df[date_col].dt.to_period('M')
    monthly = df.groupby('bulan')[value_col].agg([
        'sum', 'mean', 'count'
    ]).reset_index()
    monthly['bulan'] = monthly['bulan'].astype(str)

    # Hitung growth rate
    monthly['growth_pct'] = monthly['sum'].pct_change() * 100

    # Moving average
    monthly['ma_3'] = monthly['sum'].rolling(window=3).mean()
    monthly['ma_6'] = monthly['sum'].rolling(window=6).mean()

    print("=== TREN BULANAN ===")
    print(monthly.tail(12).to_string(index=False))

    # Deteksi seasonality
    df['bulan_num'] = df[date_col].dt.month
    seasonal = df.groupby('bulan_num')[value_col].mean()
    print("\n=== RATA-RATA PER BULAN (Seasonality) ===")
    print(seasonal)

    return monthly

# Contoh: tren kehadiran siswa
df = pd.read_csv("data_kehadiran.csv")
trend_analysis(df, 'tanggal', 'jumlah_hadir')
```

#### Step 4.3: Deteksi Anomali

```python
# scripts/anomaly_detection.py
import pandas as pd
import numpy as np

def detect_anomalies(df, columns, method='zscore', threshold=3):
    """Deteksi anomali dalam data."""

    anomalies = pd.DataFrame()

    for col in columns:
        if method == 'zscore':
            z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
            col_anomalies = df[z_scores > threshold].copy()
            col_anomalies['z_score'] = z_scores[z_scores > threshold]
            col_anomalies['anomali_kolom'] = col

        elif method == 'iqr':
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - 3 * IQR
            upper = Q3 + 3 * IQR
            col_anomalies = df[(df[col] < lower) | (df[col] > upper)].copy()
            col_anomalies['anomali_kolom'] = col

        anomalies = pd.concat([anomalies, col_anomalies])

    print(f"Total anomali terdeteksi: {len(anomalies)}")
    if len(anomalies) > 0:
        print(anomalies[['nisn', 'nama_lengkap', 'anomali_kolom']].head(20))

    return anomalies

df = pd.read_csv("data_sekolah_merged.csv")
numeric_cols = ['nilai_mtk', 'nilai_bhs', 'nilai_ipa', 'hadir']
anomalies = detect_anomalies(df, numeric_cols, method='zscore')
anomalies.to_csv("data_anomalies.csv", index=False)
```

### Bagian 5: Data Visualization

#### Step 5.1: Memilih Chart yang Tepat

| Tipe Data | Chart yang Tepat | Kapan Pakai |
|-----------|-----------------|-------------|
| Tren waktu | Line chart | Perkembangan nilai per bulan |
| Perbandingan kategori | Bar chart | Rata-rata nilai per kelas |
| Distribusi | Histogram, Box plot | Sebaran nilai siswa |
| Komposisi | Pie chart, Stacked bar | Persentase kehadiran |
| Korelasi | Scatter plot | Hubungan hadir vs nilai |
| Geografis | Map chart | Sebaran siswa per desa |
| Hierarki | Treemap | Anggaran per kategori |

#### Step 5.2: Visualisasi dengan Matplotlib dan Seaborn

```python
# scripts/visualize_data.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Setup style
sns.set_theme(style="whitegrid", font="sans-serif")
plt.rcParams['figure.figsize'] = (12, 6)

def create_school_dashboard(df):
    """Buat dashboard visualisasi data sekolah."""

    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    fig.suptitle('Dashboard Data SD Negeri Pasirhalang', fontsize=16, fontweight='bold')

    # 1. Distribusi nilai
    sns.histplot(data=df, x='nilai_rata', bins=20, kde=True, ax=axes[0, 0], color='steelblue')
    axes[0, 0].set_title('Distribusi Nilai Rata-rata Siswa')
    axes[0, 0].axvline(df['nilai_rata'].mean(), color='red', linestyle='--', label=f'Mean: {df["nilai_rata"].mean():.1f}')
    axes[0, 0].legend()

    # 2. Nilai per kelas
    kelas_order = sorted(df['kelas'].unique())
    sns.boxplot(data=df, x='kelas', y='nilai_rata', order=kelas_order, ax=axes[0, 1], palette='Set2')
    axes[0, 1].set_title('Distribusi Nilai per Kelas')
    axes[0, 1].tick_params(axis='x', rotation=45)

    # 3. Korelasi hadir vs nilai
    sns.scatterplot(data=df, x='hadir', y='nilai_rata', hue='kelas', ax=axes[0, 2], palette='Set2')
    axes[0, 2].set_title('Kehadiran vs Nilai Rata-rata')

    # 4. Komposisi jenis kelamin
    gender_counts = df['jenis_kelamin'].value_counts()
    axes[1, 0].pie(gender_counts.values, labels=gender_counts.index, autopct='%1.1f%%', colors=['#66b3ff', '#ff9999'])
    axes[1, 0].set_title('Komposisi Jenis Kelamin')

    # 5. Heatmap korelasi
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    corr = df[numeric_cols].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, ax=axes[1, 1], fmt='.2f')
    axes[1, 1].set_title('Korelasi Antar Variabel')

    # 6. Tren kehadiran bulanan
    df['bulan'] = pd.to_datetime(df['tanggal']).dt.month
    monthly = df.groupby('bulan')['hadir'].mean()
    axes[1, 2].plot(monthly.index, monthly.values, marker='o', linewidth=2, color='green')
    axes[1, 2].set_title('Tren Kehadiran Rata-rata per Bulan')
    axes[1, 2].set_xlabel('Bulan')
    axes[1, 2].set_ylabel('% Kehadiran')

    plt.tight_layout()
    plt.savefig('dashboard_sekolah.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("Dashboard disimpan sebagai dashboard_sekolah.png")

df = pd.read_csv("data_sekolah_merged.csv")
create_school_dashboard(df)
```

#### Step 5.3: Visualisasi Interaktif dengan Plotly

```python
# scripts/interactive_viz.py
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def interactive_dashboard(df):
    """Buat dashboard interaktif dengan Plotly."""

    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=(
            'Nilai per Kelas (Box Plot)',
            'Kehadiran vs Nilai (Scatter)',
            'Distribusi Nilai (Histogram)',
            'Tren Kehadiran Bulanan'
        ),
        specs=[[{"secondary_y": False}, {"secondary_y": False}],
               [{"secondary_y": False}, {"secondary_y": False}]]
    )

    # 1. Box plot per kelas
    for kelas in sorted(df['kelas'].unique()):
        subset = df[df['kelas'] == kelas]
        fig.add_trace(
            go.Box(y=subset['nilai_rata'], name=kelas, showlegend=False),
            row=1, col=1
        )

    # 2. Scatter plot
    fig.add_trace(
        go.Scatter(
            x=df['hadir'], y=df['nilai_rata'],
            mode='markers',
            marker=dict(size=8, color=df['kelas'].astype('category').cat.codes,
                       colorscale='Viridis', showscale=True),
            text=df['nama_lengkap'],
            name='Siswa'
        ),
        row=1, col=2
    )

    # 3. Histogram
    fig.add_trace(
        go.Histogram(x=df['nilai_rata'], nbinsx=20, marker_color='steelblue'),
        row=2, col=1
    )

    # 4. Line chart tren
    df['bulan'] = pd.to_datetime(df['tanggal']).dt.to_period('M').astype(str)
    monthly = df.groupby('bulan')['hadir'].mean().reset_index()
    fig.add_trace(
        go.Scatter(x=monthly['bulan'], y=monthly['hadir'],
                  mode='lines+markers', line=dict(color='green', width=3)),
        row=2, col=2
    )

    fig.update_layout(
        title='Dashboard Interaktif SD Negeri Pasirhalang',
        height=800,
        showlegend=False,
        template='plotly_white'
    )

    fig.update_xaxes(title_text='Kelas', row=1, col=1)
    fig.update_yaxes(title_text='Nilai Rata-rata', row=1, col=1)
    fig.update_xaxes(title_text='% Kehadiran', row=1, col=2)
    fig.update_yaxes(title_text='Nilai Rata-rata', row=1, col=2)
    fig.update_xaxes(title_text='Nilai', row=2, col=1)
    fig.update_yaxes(title_text='Jumlah Siswa', row=2, col=1)
    fig.update_xaxes(title_text='Bulan', row=2, col=2)
    fig.update_yaxes(title_text='% Kehadiran', row=2, col=2)

    fig.write_html('dashboard_interaktif.html')
    print("Dashboard interaktif disimpan sebagai dashboard_interaktif.html")

df = pd.read_csv("data_sekolah_merged.csv")
interactive_dashboard(df)
```

### Bagian 6: Database Queries dengan AI

#### Step 6.1: SQL Query Generation

```
Prompt untuk AI:
"Saya punya tabel siswa (nisn, nama, kelas, ttl) dan tabel nilai (id, nisn, mapel, nilai).
Buatkan query SQL untuk:
1. Rata-rata nilai per siswa
2. TOP 10 siswa dengan nilai tertinggi
3. Siswa yang belum punya data nilai
4. Rata-rata nilai per mata pelajaran per kelas
5. Siswa dengan nilai di bawah KKM (75) di lebih dari 2 mapel"
```

AI akan generate:

```sql
-- 1. Rata-rata nilai per siswa
SELECT s.nisn, s.nama, s.kelas, AVG(n.nilai) as rata_rata
FROM siswa s
LEFT JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.nisn, s.nama, s.kelas
ORDER BY rata_rata DESC;

-- 2. TOP 10 siswa nilai tertinggi
SELECT s.nisn, s.nama, s.kelas, AVG(n.nilai) as rata_rata
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.nisn, s.nama, s.kelas
ORDER BY rata_rata DESC
LIMIT 10;

-- 3. Siswa tanpa data nilai
SELECT s.*
FROM siswa s
LEFT JOIN nilai n ON s.nisn = n.nisn
WHERE n.id IS NULL;

-- 4. Rata-rata per mapel per kelas
SELECT s.kelas, n.mapel, AVG(n.nilai) as rata_rata, COUNT(*) as jumlah
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.kelas, n.mapel
ORDER BY s.kelas, rata_rata DESC;

-- 5. Siswa nilai di bawah KKM di >2 mapel
SELECT s.nisn, s.nama, s.kelas,
       COUNT(CASE WHEN n.nilai < 75 THEN 1 END) as mapel_dibawah_kkm
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
GROUP BY s.nisn, s.nama, s.kelas
HAVING mapel_dibawah_kkm > 2;
```

#### Step 6.2: Query Optimization dengan AI

```
Prompt untuk AI:
"Query ini lambat (5 detik untuk 100K baris):
SELECT s.*, AVG(n.nilai) as rata_rata
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
WHERE s.kelas LIKE '%6%'
GROUP BY s.nisn, s.nama, s.kelas, s.ttl
ORDER BY rata_rata DESC;

Bagaimana cara optimasi?
1. Index apa yang perlu dibuat?
2. Apakah query bisa ditulis ulang lebih efisien?
3. Apakah ada subquery yang lebih baik?"
```

AI akan memberikan:

```sql
-- Optimasi 1: Buat index
CREATE INDEX idx_nilai_nisn ON nilai(nisn);
CREATE INDEX idx_siswa_kelas ON siswa(kelas);

-- Optimasi 2: Rewrite query
SELECT s.nisn, s.nama, s.kelas, s.ttl, nv.rata_rata
FROM siswa s
JOIN (
    SELECT nisn, AVG(nilai) as rata_rata
    FROM nilai
    GROUP BY nisn
) nv ON s.nisn = nv.nisn
WHERE s.kelas LIKE '%6%'
ORDER BY nv.rata_rata DESC;

-- Optimasi 3: Pakai window function
SELECT DISTINCT s.nisn, s.nama, s.kelas, s.ttl,
       AVG(n.nilai) OVER (PARTITION BY s.nisn) as rata_rata
FROM siswa s
JOIN nilai n ON s.nisn = n.nisn
WHERE s.kelas LIKE '%6%'
ORDER BY rata_rata DESC;
```

#### Step 6.3: Window Functions

```sql
-- Ranking siswa per kelas
SELECT nisn, nama, kelas, nilai_rata,
       RANK() OVER (PARTITION BY kelas ORDER BY nilai_rata DESC) as ranking_kelas,
       ROW_NUMBER() OVER (ORDER BY nilai_rata DESC) as ranking_sekolah
FROM (
    SELECT s.nisn, s.nama, s.kelas, AVG(n.nilai) as nilai_rata
    FROM siswa s
    JOIN nilai n ON s.nisn = n.nisn
    GROUP BY s.nisn, s.nama, s.kelas
) ranked;

-- Moving average kehadiran 7 hari
SELECT tanggal, jumlah_hadir,
       AVG(jumlah_hadir) OVER (
           ORDER BY tanggal
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) as moving_avg_7hari
FROM kehadiran
ORDER BY tanggal;

-- Persentase perubahan bulan ke bulan
SELECT bulan, total_siswa,
       LAG(total_siswa) OVER (ORDER BY bulan) as bulan_sebelumnya,
       ROUND(
           (total_siswa - LAG(total_siswa) OVER (ORDER BY bulan)) * 100.0
           / LAG(total_siswa) OVER (ORDER BY bulan), 2
       ) as persen_perubahan
FROM statistik_bulanan;
```

### Bagian 7: ETL Pipeline

#### Step 7.1: ETL Sederhana untuk Data Sekolah

```python
# scripts/etl_pipeline.py
import pandas as pd
import sqlite3
import logging
from datetime import datetime
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('etl_pipeline.log'),
        logging.StreamHandler()
    ]
)

class SchoolDataETL:
    """ETL Pipeline untuk data sekolah."""

    def __init__(self, source_dir, db_path):
        self.source_dir = Path(source_dir)
        self.db_path = db_path
        self.stats = {'extracted': 0, 'transformed': 0, 'loaded': 0, 'errors': 0}

    def extract(self):
        """Extract: Baca semua file sumber."""
        logging.info("=== EXTRACT PHASE ===")
        data = {}

        # Baca CSV files
        for csv_file in self.source_dir.glob("*.csv"):
            try:
                df = pd.read_csv(csv_file)
                data[csv_file.stem] = df
                self.stats['extracted'] += len(df)
                logging.info(f"  Extracted {csv_file.name}: {len(df)} baris")
            except Exception as e:
                self.stats['errors'] += 1
                logging.error(f"  Error reading {csv_file.name}: {e}")

        # Baca Excel files
        for xlsx_file in self.source_dir.glob("*.xlsx"):
            try:
                df = pd.read_excel(xlsx_file)
                data[xlsx_file.stem] = df
                self.stats['extracted'] += len(df)
                logging.info(f"  Extracted {xlsx_file.name}: {len(df)} baris")
            except Exception as e:
                self.stats['errors'] += 1
                logging.error(f"  Error reading {xlsx_file.name}: {e}")

        return data

    def transform(self, data):
        """Transform: Bersihkan dan transform data."""
        logging.info("=== TRANSFORM PHASE ===")
        transformed = {}

        # Transform data siswa
        if 'data_siswa' in data:
            df = data['data_siswa'].copy()

            # Clean NISN
            df['nisn'] = df['nisn'].astype(str).str.zfill(10)

            # Clean nama
            df['nama'] = df['nama'].str.title().str.strip()

            # Parse tanggal
            if 'tanggal_lahir' in df.columns:
                df['tanggal_lahir'] = pd.to_datetime(df['tanggal_lahir'], errors='coerce')

            # Hitung umur
            if 'tanggal_lahir' in df.columns:
                df['umur'] = (datetime.now() - df['tanggal_lahir']).dt.days // 365

            # Drop duplikat
            df = df.drop_duplicates(subset=['nisn'])

            transformed['siswa'] = df
            self.stats['transformed'] += len(df)
            logging.info(f"  Transformed siswa: {len(df)} baris")

        # Transform data nilai
        if 'data_nilai' in data:
            df = data['data_nilai'].copy()

            # Pivot nilai
            if 'mapel' in df.columns and 'nilai' in df.columns:
                df_pivot = df.pivot_table(
                    index='nisn', columns='mapel', values='nilai', aggfunc='mean'
                ).reset_index()
                df_pivot.columns.name = None
                df_pivot.columns = ['nisn'] + [f'nilai_{c}' for c in df_pivot.columns[1:]]

                # Hitung rata-rata
                nilai_cols = [c for c in df_pivot.columns if c.startswith('nilai_')]
                df_pivot['nilai_rata'] = df_pivot[valori_cols].mean(axis=1, skipna=True)

                transformed['nilai'] = df_pivot
                self.stats['transformed'] += len(df_pivot)
                logging.info(f"  Transformed nilai: {len(df_pivot)} baris")

        return transformed

    def load(self, transformed):
        """Load: Simpan ke database SQLite."""
        logging.info("=== LOAD PHASE ===")

        conn = sqlite3.connect(self.db_path)

        for table_name, df in transformed.items():
            try:
                df.to_sql(table_name, conn, if_exists='replace', index=False)
                self.stats['loaded'] += len(df)
                logging.info(f"  Loaded {table_name}: {len(df)} baris")

                # Create indexes
                if 'nisn' in df.columns:
                    conn.execute(f"CREATE INDEX idx_{table_name}_nisn ON {table_name}(nisn)")
            except Exception as e:
                self.stats['errors'] += 1
                logging.error(f"  Error loading {table_name}: {e}")

        conn.close()

    def run(self):
        """Jalankan full ETL pipeline."""
        logging.info("Starting ETL Pipeline...")
        start_time = datetime.now()

        data = self.extract()
        transformed = self.transform(data)
        self.load(transformed)

        elapsed = (datetime.now() - start_time).total_seconds()
        logging.info(f"ETL Pipeline selesai dalam {elapsed:.2f} detik")
        logging.info(f"Stats: {self.stats}")

        return self.stats

# Jalankan pipeline
etl = SchoolDataETL(source_dir="data/sumber", db_path="data/sekolah.db")
stats = etl.run()
```

### Bagian 8: Data Validation

#### Step 8.1: Schema Validation

```python
# scripts/validate_data.py
import pandas as pd
import json
from typing import Dict, List

def validate_schema(df, schema: Dict) -> List[str]:
    """Validasi data terhadap schema."""
    errors = []

    # Cek kolom wajib
    for col in schema.get('required_columns', []):
        if col not in df.columns:
            errors.append(f"Kolom wajib '{col}' tidak ditemukan")

    # Cek tipe data
    for col, expected_type in schema.get('column_types', {}).items():
        if col in df.columns:
            if expected_type == 'numeric':
                if not pd.api.types.is_numeric_dtype(df[col]):
                    errors.append(f"Kolom '{col}' seharusnya numerik, tipe: {df[col].dtype}")
            elif expected_type == 'string':
                if not pd.api.types.is_string_dtype(df[col]):
                    errors.append(f"Kolom '{col}' seharusnya string")
            elif expected_type == 'date':
                try:
                    pd.to_datetime(df[col])
                except:
                    errors.append(f"Kolom '{col}' tidak bisa diparse sebagai tanggal")

    # Cek nilai unik
    for col, unique in schema.get('unique_columns', {}).items():
        if col in df.columns:
            dupes = df[col].duplicated().sum()
            if dupes > 0:
                errors.append(f"Kolom '{col}' memiliki {dupes} duplikat (harus unik)")

    # Cek range nilai
    for col, range_val in schema.get('value_ranges', {}).items():
        if col in df.columns:
            min_val, max_val = range_val
            out_of_range = df[(df[col] < min_val) | (df[col] > max_val)]
            if len(out_of_range) > 0:
                errors.append(f"Kolom '{col}' memiliki {len(out_of_range)} nilai di luar range [{min_val}, {max_val}]")

    # Cek nilai yang diperbolehkan
    for col, allowed in schema.get('allowed_values', {}).items():
        if col in df.columns:
            invalid = df[~df[col].isin(allowed)]
            if len(invalid) > 0:
                errors.append(f"Kolom '{col}' memiliki {len(invalid)} nilai tidak valid: {invalid[col].unique()[:5]}")

    return errors

# Schema untuk data siswa
siswa_schema = {
    'required_columns': ['nisn', 'nama', 'kelas', 'jenis_kelamin'],
    'column_types': {
        'nisn': 'string',
        'nama': 'string',
        'kelas': 'string',
        'tanggal_lahir': 'date',
        'nilai': 'numeric'
    },
    'unique_columns': {
        'nisn': True
    },
    'value_ranges': {
        'nilai': [0, 100],
        'hadir': [0, 100]
    },
    'allowed_values': {
        'jenis_kelamin': ['L', 'P'],
        'kelas': ['1', '2', '3', '4', '5', '6']
    }
}

df = pd.read_csv("data_siswa_std.csv")
errors = validate_schema(df, siswa_schema)

if errors:
    print("VALIDATION ERRORS:")
    for e in errors:
        print(f"  - {e}")
else:
    print("Data valid! Tidak ada error.")
```

### Bagian 9: Batch Processing

#### Step 9.1: Processing Dataset Besar dengan Chunking

```python
# scripts/batch_processing.py
import pandas as pd
import numpy as np
from pathlib import Path

def process_large_csv(filepath, chunk_size=10000):
    """Proses file CSV besar dengan chunking."""

    print(f"Memproses {filepath}...")

    # Hitung total baris dulu
    total_rows = sum(1 for _ in open(filepath, 'r')) - 1  # minus header
    print(f"Total baris: {total_rows:,}")

    results = []
    processed = 0

    # Baca per chunk
    for chunk in pd.read_csv(filepath, chunksize=chunk_size):
        # Proses setiap chunk
        chunk['kategori_nilai'] = pd.cut(
            chunk['nilai_rata'],
            bins=[0, 60, 70, 80, 90, 100],
            labels=['E', 'D', 'C', 'B', 'A']
        )

        # Agregasi per chunk
        summary = chunk.groupby('kelas').agg({
            'nilai_rata': ['mean', 'count'],
            'hadir': 'mean'
        }).reset_index()
        summary.columns = ['kelas', 'rata_nilai', 'jumlah', 'rata_hadir']

        results.append(summary)
        processed += len(chunk)
        print(f"  Processed {processed:,}/{total_rows:,} baris")

    # Gabung hasil semua chunk
    combined = pd.concat(results)
    final = combined.groupby('kelas').agg({
        'rata_nilai': 'mean',
        'jumlah': 'sum',
        'rata_hadir': 'mean'
    }).reset_index()

    print(f"\nHasil akhir:")
    print(final)
    return final

# Jalankan
process_large_csv("data_besar.csv", chunk_size=50000)
```

### Bagian 10: Real-World Scenario - Pengolahan Data Sekolah

#### Step 10.1: Skenario Lengkap - Laporan Semester

```python
# scripts/laporan_semester.py
"""
Script lengkap untuk generate laporan semester SD Negeri Pasirhalang.
Menggabungkan: ETL, cleaning, analysis, visualization, reporting.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
from pathlib import Path
import json

class LaporanSemester:
    """Generate laporan semester otomatis."""

    def __init__(self, data_dir, output_dir):
        self.data_dir = Path(data_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def load_and_clean(self):
        """Load dan bersihkan semua data."""
        print("Loading data...")

        # Load data
        self.siswa = pd.read_csv(self.data_dir / "siswa.csv")
        self.nilai = pd.read_csv(self.data_dir / "nilai.csv")
        self.kehadiran = pd.read_csv(self.data_dir / "kehadiran.csv")

        # Clean
        self.siswa['nisn'] = self.siswa['nisn'].astype(str).str.zfill(10)
        self.nilai['nisn'] = self.nilai['nisn'].astype(str).str.zfill(10)
        self.kehadiran['nisn'] = self.kehadiran['nisn'].astype(str).str.zfill(10)

        # Drop duplikat
        self.siswa = self.siswa.drop_duplicates(subset=['nisn'])
        self.nilai = self.nilai.drop_duplicates(subset=['nisn', 'mapel', 'semester'])

        # Handle missing
        self.nilai['nilai'] = self.nilai['nilai'].fillna(self.nilai['nilai'].median())
        self.kehadiran['status'] = self.kehadiran['status'].fillna('H')

        print(f"  Siswa: {len(self.siswa)}")
        print(f"  Nilai: {len(self.nilai)}")
        print(f"  Kehadiran: {len(self.kehadiran)}")

    def analyze(self):
        """Analisis data."""
        print("Analyzing...")

        # Rata-rata nilai per siswa
        self.rata_siswa = self.nilai.groupby(['nisn', 'semester'])['nilai'].mean().reset_index()
        self.rata_siswa.columns = ['nisn', 'semester', 'rata_rata']

        # Merge dengan data siswa
        self.lengkap = pd.merge(
            self.siswa, self.rata_siswa,
            on='nisn', how='left'
        )

        # Statistik per kelas
        self.stats_kelas = self.lengkap.groupby('kelas').agg({
            'rata_rata': ['mean', 'median', 'std', 'count'],
            'nama': 'count'
        }).round(2)

        # Kehadiran
        self.kehadiran['bulan'] = pd.to_datetime(self.kehadiran['tanggal']).dt.month
        self.stats_hadir = self.kehadiran.groupby(['kelas', 'bulan']).agg({
            'status': lambda x: (x == 'H').mean() * 100
        }).round(2).reset_index()
        self.stats_hadir.columns = ['kelas', 'bulan', 'persen_hadir']

    def generate_report(self):
        """Generate laporan Markdown."""
        print("Generating report...")

        semester = self.nilai['semester'].iloc[0]
        tahun_ajaran = "2025/2026"

        report = f"""# Laporan Akademik Semester {semester}

**SD Negeri Pasirhalang** - Tahun Ajaran {tahun_ajaran}
**Tanggal Generate**: {datetime.now().strftime('%d %B %Y')}

---

## Ringkasan Eksekutif

- **Total Siswa**: {len(self.siswa):,} siswa
- **Rata-rata Nilai Sekolah**: {self.lengkap['rata_rata'].mean():.2f}
- **Rata-rata Kehadiran**: {self.stats_hadir['persen_hadir'].mean():.1f}%
- **Kelas dengan Nilai Tertinggi**: {self.stats_kelas[('rata_rata', 'mean')].idxmax()}
- **Kelas dengan Kehadiran Tertinggi**: {self.stats_hadir.groupby('kelas')['persen_hadir'].mean().idxmax()}

---

## Statistik per Kelas

| Kelas | Rata-rata | Median | Std Dev | Jumlah Siswa |
|-------|-----------|--------|---------|--------------|
"""
        for kelas, row in self.stats_kelas.iterrows():
            report += f"| {kelas} | {row[('rata_rata', 'mean')]:.2f} | {row[('rata_rata', 'median')]:.2f} | {row[('rata_rata', 'std')]:.2f} | {int(row[('nama', 'count')])} |\n"

        report += f"""
---

## Distribusi Nilai

| Kategori | Jumlah | Persentase |
|----------|--------|------------|
"""
        bins = [0, 60, 70, 80, 90, 100]
        labels = ['E (<60)', 'D (60-69)', 'C (70-79)', 'B (80-89)', 'A (90-100)']
        self.lengkap['kategori'] = pd.cut(self.lengkap['rata_rata'], bins=bins, labels=labels)
        dist = self.lengkap['kategori'].value_counts().sort_index()

        for kat, count in dist.items():
            pct = count / len(self.lengkap) * 100
            report += f"| {kat} | {count} | {pct:.1f}% |\n"

        report += f"""
---

## Rekomendasi

1. **Siswa perlu perhatian**: {len(self.lengkap[self.lengkap['rata_rata'] < 70])} siswa dengan nilai di bawah KKM
2. **Kelas perlu intervensi**: Kelas dengan rata-rata terendah perlu program remedial
3. **Kehadiran**: Kelas dengan kehadiran di bawah 85% perlu monitoring lebih ketat

---

*Laporan ini digenerate otomatis oleh script Python*
"""

        output_path = self.output_dir / f"Laporan_Semester_{semester}.md"
        output_path.write_text(report, encoding='utf-8')
        print(f"  Laporan disimpan: {output_path}")

    def generate_charts(self):
        """Generate chart untuk laporan."""
        print("Generating charts...")

        # Chart 1: Distribusi nilai
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.histplot(data=self.lengkap, x='rata_rata', bins=20, kde=True, ax=ax, color='steelblue')
        ax.axvline(70, color='red', linestyle='--', label='KKM (70)')
        ax.set_title('Distribusi Nilai Rata-rata Siswa')
        ax.set_xlabel('Nilai Rata-rata')
        ax.set_ylabel('Jumlah Siswa')
        ax.legend()
        plt.savefig(self.output_dir / 'chart_distribusi.png', dpi=150, bbox_inches='tight')
        plt.close()

        # Chart 2: Perbandingan kelas
        fig, ax = plt.subplots(figsize=(10, 6))
        kelas_stats = self.lengkap.groupby('kelas')['rata_rata'].mean().reset_index()
        sns.barplot(data=kelas_stats, x='kelas', y='rata_rata', ax=ax, palette='Set2')
        ax.axhline(70, color='red', linestyle='--', label='KKM')
        ax.set_title('Rata-rata Nilai per Kelas')
        ax.legend()
        plt.savefig(self.output_dir / 'chart_kelas.png', dpi=150, bbox_inches='tight')
        plt.close()

        print("  Charts disimpan di folder output")

    def run(self):
        """Jalankan full pipeline."""
        print("=" * 50)
        print("LAPORAN SEMESTER - SD NEGERI PASIRHALANG")
        print("=" * 50)

        self.load_and_clean()
        self.analyze()
        self.generate_report()
        self.generate_charts()

        print("\nSelesai! Cek folder output untuk hasil.")

# Jalankan
laporan = LaporanSemester(data_dir="data", output_dir="output/laporan")
laporan.run()
```

## 💡 Tips Praktis

### Prompt Template untuk Berbagai Skenario

```
1. "Saya punya file @data.csv dengan kolom X, Y, Z. Buatkan script Python untuk:
   - Bersihkan data (missing, duplikat, outlier)
   - Analisis statistik dasar
   - Visualisasi yang tepat
   - Simpan hasil ke file baru"

2. "Bandingkan dua file @file1.csv dan @file2.csv:
   - Apa perbedaannya?
   - Record mana yang hanya ada di salah satu file?
   - Buat file gabungan tanpa duplikat"

3. "Buatkan dashboard interaktif dari @data.csv:
   - Chart yang sesuai untuk setiap kolom
   - Filter berdasarkan kategori
   - Export ke HTML"

4. "Saya punya database SQLite dengan tabel X dan Y.
   Buatkan query untuk: [deskripsikan kebutuhan]
   Optimasi query jika ada performance issue."

5. "Buatkan ETL pipeline untuk data sekolah:
   - Source: CSV dari folder data/
   - Transform: clean, validate, aggregate
   - Load: SQLite database
   - Include logging dan error handling"
```

### Memory Optimization Tips

| Masalah | Solusi |
|---------|--------|
| File terlalu besar untuk RAM | Pakai `chunksize` di `pd.read_csv()` |
| Memory usage tinggi | Gunakan `dtype` yang tepat (int8, float32) |
| String memory besar | Pakai `category` dtype untuk kolom dengan sedikit unique values |
| Banyak file kecil | Gabung dengan `pd.concat()` sekali, bukan loop append |

### Best Practices

1. **Selalu backup** data sebelum transformasi
2. **Validate** setelah setiap tahap ETL
3. **Log** semua operasi untuk audit trail
4. **Test** dengan sample data kecil dulu
5. **Dokumentasi** format dan asumsi data
6. **Gunakan version control** untuk script

## ✅ Checklist

- [ ] Bisa membaca dan memahami struktur CSV/Excel/JSON
- [ ] Bisa membersihkan data (missing, duplikat, outlier, format)
- [ ] Bisa transformasi data (pivot, melt, merge, concat)
- [ ] Bisa analisis statistik deskriptif dan tren
- [ ] Bisa deteksi anomali dalam data
- [ ] Bisa membuat visualisasi dengan matplotlib/seaborn/plotly
- [ ] Bisa membuat dan mengoptimasi SQL query
- [ ] Bisa membangun ETL pipeline sederhana
- [ ] Bisa validasi data dengan schema dan business rules
- [ ] Bisa proses dataset besar dengan chunking

## ⚠️ Pitfalls

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Memory error | File terlalu besar untuk RAM | Gunakan chunking, optimasi dtype |
| Hasil merge tidak sesuai | Key tidak match (spasi, case, tipe) | Bersihkan key sebelum merge |
| Chart tidak muncul | Backend matplotlib tidak tersedia | Gunakan `plt.savefig()` atau install GUI backend |
| Query SQL lambat | Tidak ada index, query tidak efisien | Buat index, rewrite query, gunakan EXPLAIN |
| Data type salah setelah read_csv | pandas auto-detect salah | Specify dtype di read_csv |
| Encoding error | File bukan UTF-8 | Coba encoding='latin-1' atau 'cp1252' |

## 📝 Ringkasan

1. **Pahami struktur data** sebelum melakukan apapun
2. **Bersihkan data** - missing values, duplikat, outlier, format
3. **Transformasi** sesuai kebutuhan analisis (pivot, merge, dll)
4. **Analisis** dengan statistik deskriptif, tren, korelasi
5. **Visualisasikan** dengan chart yang tepat untuk tipe data
6. **Generate laporan** otomatis dengan tabel dan chart
7. **Validasi** data dengan schema dan business rules
8. **ETL pipeline** untuk proses data secara terstruktur
9. **Optimasi** untuk dataset besar (chunking, memory)
10. **Dokumentasi** semua asumsi dan transformasi
