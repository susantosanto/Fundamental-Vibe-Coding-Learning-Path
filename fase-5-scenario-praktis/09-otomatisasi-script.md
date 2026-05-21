# C4: Otomatisasi Script dengan AI

> **Buat command, script Python, shell automation, web scraping, API integration, scheduled tasks, dan monitoring untuk tugas berulang**

**Estimasi**: 40 menit belajar + 60 menit praktik | **Level**: Pemula-Menengah

## 🎯 Outcome

Setelah modul ini, kamu bisa:
- Menulis shell script (bash/PowerShell) untuk otomatisasi tugas sistem
- Membuat script Python untuk file operations, web scraping, dan API integration
- Mengotomatisasi file management: batch rename, organize, search, cleanup
- Melakukan web scraping yang etis dengan requests dan BeautifulSoup
- Mengintegrasikan REST API dengan authentication dan error handling
- Menjadwalkan tugas dengan cron, Task Scheduler, dan Python schedulers
- Menangani error dengan try/catch, retry logic, dan fallback
- Implementasi structured logging dengan log rotation
- Membuat monitoring script untuk system health dan alerting
- Membangun backup script dengan incremental backup dan verification
- Mengirim notifikasi via email, Telegram, dan Slack
- Membuat otomatisasi lengkap untuk administrasi sekolah

## 🤔 Masalah yang Diselesaikan

| Masalah | Solusi Otomatisasi |
|---------|-------------------|
| Setiap hari rename 50+ file | Script batch rename otomatis |
| Backup database manual | Scheduled backup + verification |
| Cek data Dapodik satu per satu | Web scraping otomatis |
| Kirim laporan via email manual | Auto-generate + auto-send |
| Monitor server/aplikasi | Health check + alert otomatis |
| Arsip file berantakan | Auto-organize by type/date |
| Input data ke banyak sistem | API integration + sync script |
| Lupa tugas rutin | Scheduler + notification reminder |

## 🔑 Konsep Inti

### Tanda Tugas Bisa Diotomatisasi

| Ciri | Contoh di Sekolah |
|------|-------------------|
| Diulang terus | Laporan kehadiran harian |
| Aturan jelas | Arsip invoice per bulan |
| Lama tapi gampang | Batch rename file foto kegiatan |
| Rawan salah | Copy-paste data ke Excel |
| Waktu tertentu | Backup database setiap Jumat |
| Multi-step | Generate laporan → email → arsip |

### Level Otomatisasi

```
Manual → Script sekali jalan → Scheduled script → Monitoring + Alerting → Full pipeline
```

### Tools untuk Otomatisasi

| Tool | Fungsi | Platform |
|------|--------|----------|
| Bash/PowerShell | System automation, file ops | Linux/Windows |
| Python | General purpose automation | Cross-platform |
| `requests` | HTTP/API calls | Python |
| `BeautifulSoup` | HTML parsing/scraping | Python |
| `Selenium` | Browser automation | Python |
| `schedule` | Task scheduling | Python |
| `smtplib` | Email sending | Python |
| `logging` | Structured logging | Python |
| `cron` | Linux scheduler | Linux/macOS |
| Task Scheduler | Windows scheduler | Windows |

### Prompt Template untuk Otomatisasi

```
Template 1 - Script Dasar:
"Buatkan script Python untuk:
1. [deskripsikan tugas]
2. Input: [sumber data/file]
3. Output: [hasil yang diharapkan]
4. Error handling: [cara handle error]
5. Logging: [apa yang perlu di-log]"

Template 2 - Web Scraping:
"Buatkan script scraping untuk:
1. URL: [target website]
2. Data yang diambil: [elemen/konten]
3. Simpan ke: [format output]
4. Handle pagination: [cara]
5. Rate limiting: [delay antar request]"

Template 3 - API Integration:
"Buatkan script untuk integrasi API:
1. Endpoint: [URL API]
2. Authentication: [API key/OAuth]
3. Method: [GET/POST/PUT]
4. Data yang dikirim/diterima
5. Retry logic dan error handling"

Template 4 - Scheduled Task:
"Buatkan script yang dijadwalkan untuk:
1. Tugas: [apa yang dilakukan]
2. Frekuensi: [setiap hari/jam/minggu]
3. Notification: [email/Telegram jika selesai/error]
4. Logging: [simpan log ke file]
5. Setup instruction: [cara schedule di OS]"
```

## 🚀 Praktik Lengkap

### Bagian 1: Shell Scripting

#### Step 1.1: PowerShell Basics (Windows)

```powershell
# scripts/backup_harian.ps1
# Backup harian data sekolah

# Variables
$sourceDir = "C:\Users\USER\Documents\Sekolah"
$backupDir = "C:\Backup\Sekolah"
$date = Get-Date -Format "yyyy-MM-dd"
$backupName = "backup_$date.zip"
$logFile = "C:\Backup\backup_log.txt"

# Function untuk logging
function Write-Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Add-Content -Path $logFile
    Write-Host "$timestamp - $message"
}

# Mulai backup
Write-Log "=== Mulai Backup Harian ==="

# Cek source ada
if (-not (Test-Path $sourceDir)) {
    Write-Log "ERROR: Source directory tidak ditemukan: $sourceDir"
    exit 1
}

# Buat folder backup kalau belum ada
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
    Write-Log "Folder backup dibuat: $backupDir"
}

# Hapus backup lama (>30 hari)
$cutoff = (Get-Date).AddDays(-30)
Get-ChildItem -Path $backupDir -Filter "backup_*.zip" |
    Where-Object { $_.LastWriteTime -lt $cutoff } |
    Remove-Item -Force
Write-Log "Backup lama (>30 hari) dihapus"

# Compress
$backupPath = Join-Path $backupDir $backupName
Compress-Archive -Path "$sourceDir\*" -DestinationPath $backupPath -Force
Write-Log "Backup selesai: $backupPath"

# Verifikasi
if (Test-Path $backupPath) {
    $size = (Get-Item $backupPath).Length / 1MB
    Write-Log "Backup verified. Size: $([math]::Round($size, 2)) MB"
} else {
    Write-Log "ERROR: Backup file tidak ditemukan!"
    exit 1
}

Write-Log "=== Backup Selesai ==="
```

Jalankan:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/backup_harian.ps1
```

#### Step 1.2: Bash Scripting (Linux/Git Bash)

```bash
#!/bin/bash
# scripts/organize_files.sh
# Organize files di folder Downloads berdasarkan tipe

SOURCE_DIR="$HOME/Downloads"
LOG_FILE="$HOME/Downloads/organize.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log "=== Mulai organize files ==="

# Buat folder kategori
mkdir -p "$SOURCE_DIR/Documents"
mkdir -p "$SOURCE_DIR/Images"
mkdir -p "$SOURCE_DIR/Videos"
mkdir -p "$SOURCE_DIR/Archives"
mkdir -p "$SOURCE_DIR/Other"

# Counter
moved=0
errors=0

# Process files
for file in "$SOURCE_DIR"/*; do
    # Skip directories
    [ -d "$file" ] && continue

    filename=$(basename "$file")
    extension="${filename##*.}"
    extension=$(echo "$extension" | tr '[:upper:]' '[:lower:]')

    # Tentukan kategori
    case "$extension" in
        pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|md)
            dest="$SOURCE_DIR/Documents"
            ;;
        jpg|jpeg|png|gif|bmp|svg|webp)
            dest="$SOURCE_DIR/Images"
            ;;
        mp4|avi|mkv|mov|wmv)
            dest="$SOURCE_DIR/Videos"
            ;;
        zip|rar|7z|tar|gz)
            dest="$SOURCE_DIR/Archives"
            ;;
        *)
            dest="$SOURCE_DIR/Other"
            ;;
    esac

    # Move file
    if mv "$file" "$dest/" 2>/dev/null; then
        log "Moved: $filename -> $dest/"
        ((moved++))
    else
        log "ERROR: Gagal move $filename"
        ((errors++))
    fi
done

log "Selesai. Moved: $moved files, Errors: $errors"
```

Buat executable dan jalankan:
```bash
chmod +x scripts/organize_files.sh
bash scripts/organize_files.sh
```

#### Step 1.3: PowerShell Advanced - File Organizer

```powershell
# scripts/advanced_organize.ps1
# Organize files berdasarkan tipe, tanggal, dan ukuran

param(
    [string]$SourcePath = "C:\Users\USER\Downloads",
    [string]$Mode = "type",  # type, date, size
    [switch]$DryRun
)

function Organize-ByType {
    param([string]$path, [bool]$dryRun)

    $categories = @{
        "Documents" = @("pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv")
        "Images" = @("jpg", "jpeg", "png", "gif", "bmp", "svg", "webp")
        "Videos" = @("mp4", "avi", "mkv", "mov", "wmv", "flv")
        "Audio" = @("mp3", "wav", "flac", "aac", "ogg")
        "Archives" = @("zip", "rar", "7z", "tar", "gz", "bz2")
        "Code" = @("py", "js", "html", "css", "json", "xml", "sql")
    }

    # Buat folder
    foreach ($cat in $categories.Keys) {
        $folder = Join-Path $path $cat
        if (-not (Test-Path $folder)) {
            if (-not $dryRun) { New-Item -ItemType Directory -Path $folder -Force }
            Write-Host "[INFO] Folder dibuat: $cat"
        }
    }

    # Process files
    Get-ChildItem -Path $path -File | ForEach-Object {
        $ext = $_.Extension.TrimStart('.').ToLower()
        $targetCat = "Other"

        foreach ($cat in $categories.Keys) {
            if ($categories[$cat] -contains $ext) {
                $targetCat = $cat
                break
            }
        }

        $dest = Join-Path $path $targetCat
        $destPath = Join-Path $dest $_.Name

        if ($dryRun) {
            Write-Host "[DRY RUN] $($_.Name) -> $targetCat/"
        } else {
            # Handle nama bentrok
            if (Test-Path $destPath) {
                $base = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
                $ext2 = $_.Extension
                $counter = 1
                while (Test-Path $destPath) {
                    $destPath = Join-Path $dest "${base}_$counter$ext2"
                    $counter++
                }
            }
            Move-Item -Path $_.FullName -Destination $destPath -Force
            Write-Host "[MOVED] $($_.Name) -> $targetCat/"
        }
    }
}

function Organize-ByDate {
    param([string]$path, [bool]$dryRun)

    Get-ChildItem -Path $path -File | ForEach-Object {
        $year = $_.CreationTime.Year
        $month = $_.CreationTime.ToString("MM")
        $folderName = "$year-$month"
        $dest = Join-Path $path $folderName

        if (-not $dryRun -and -not (Test-Path $dest)) {
            New-Item -ItemType Directory -Path $dest -Force
        }

        $destPath = Join-Path $dest $_.Name
        if ($dryRun) {
            Write-Host "[DRY RUN] $($_.Name) -> $folderName/"
        } else {
            Move-Item -Path $_.FullName -Destination $destPath -Force
        }
    }
}

# Main
Write-Host "=== File Organizer ==="
Write-Host "Source: $SourcePath"
Write-Host "Mode: $Mode"
Write-Host "Dry Run: $DryRun"
Write-Host ""

switch ($Mode) {
    "type" { Organize-ByType -path $SourcePath -dryRun $DryRun }
    "date" { Organize-ByDate -path $SourcePath -dryRun $DryRun }
    default { Write-Host "Mode tidak valid. Gunakan: type, date, size" }
}
```

### Bagian 2: Python Automation - File Operations

#### Step 2.1: Batch File Operations

```python
# scripts/file_operations.py
"""
Operasi file batch untuk administrasi sekolah.
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
import logging
import hashlib

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('file_ops.log'),
        logging.StreamHandler()
    ]
)

class FileManager:
    """Manajemen file batch."""

    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)

    def batch_rename(self, pattern, new_format, dry_run=False):
        """Batch rename file dengan pattern.

        Args:
            pattern: glob pattern (e.g., "*.jpg")
            new_format: format string (e.g., "foto_{counter:03d}.jpg")
            dry_run: preview tanpa eksekusi
        """
        files = list(self.base_dir.glob(pattern))
        logging.info(f"Ditemukan {len(files)} file matching '{pattern}'")

        counter = 1
        for file in sorted(files):
            new_name = new_format.format(
                counter=counter,
                date=datetime.now().strftime('%Y%m%d'),
                original=file.stem,
                ext=file.suffix
            )
            new_path = file.parent / new_name

            if dry_run:
                logging.info(f"  [PREVIEW] {file.name} -> {new_name}")
            else:
                if new_path.exists():
                    logging.warning(f"  Skip: {new_name} sudah ada")
                else:
                    file.rename(new_path)
                    logging.info(f"  Renamed: {file.name} -> {new_name}")
            counter += 1

    def organize_by_extension(self, dry_run=False):
        """Organize file berdasarkan ekstensi."""
        files = [f for f in self.base_dir.iterdir() if f.is_file()]

        for file in files:
            ext = file.suffix.lower().lstrip('.')
            if not ext:
                continue

            dest_dir = self.base_dir / ext.upper()
            if not dry_run:
                dest_dir.mkdir(exist_ok=True)

            dest_path = dest_dir / file.name
            if dry_run:
                logging.info(f"  [PREVIEW] {file.name} -> {ext.upper()}/")
            else:
                shutil.move(str(file), str(dest_path))
                logging.info(f"  Moved: {file.name} -> {ext.upper()}/")

    def find_duplicates(self):
        """Cari file duplikat berdasarkan hash."""
        logging.info("Mencari file duplikat...")
        hashes = {}
        duplicates = []

        for file in self.base_dir.rglob('*'):
            if not file.is_file():
                continue

            file_hash = hashlib.md5(file.read_bytes()).hexdigest()
            if file_hash in hashes:
                duplicates.append((file, hashes[file_hash]))
            else:
                hashes[file_hash] = file

        if duplicates:
            logging.info(f"Ditemukan {len(duplicates)} file duplikat:")
            for dup, original in duplicates:
                logging.info(f"  {dup.name} (duplikat dari {original.name})")
        else:
            logging.info("Tidak ada file duplikat.")

        return duplicates

    def cleanup_temp_files(self, days_old=7, dry_run=False):
        """Hapus file temporary yang sudah lama."""
        cutoff = datetime.now() - timedelta(days=days_old)
        temp_patterns = ['*.tmp', '*.temp', '*.bak', '*.swp', '~*']

        for pattern in temp_patterns:
            for file in self.base_dir.rglob(pattern):
                if file.stat().st_mtime < cutoff.timestamp():
                    if dry_run:
                        logging.info(f"  [PREVIEW DELETE] {file}")
                    else:
                        file.unlink()
                        logging.info(f"  Deleted: {file}")

    def search_files(self, name_pattern=None, min_size=None, max_size=None,
                     modified_after=None, modified_before=None):
        """Search file dengan berbagai filter."""
        results = []

        for file in self.base_dir.rglob('*'):
            if not file.is_file():
                continue

            # Filter by name
            if name_pattern and name_pattern.lower() not in file.name.lower():
                continue

            # Filter by size
            size = file.stat().st_size
            if min_size and size < min_size:
                continue
            if max_size and size > max_size:
                continue

            # Filter by modification date
            mtime = datetime.fromtimestamp(file.stat().st_mtime)
            if modified_after and mtime < modified_after:
                continue
            if modified_before and mtime > modified_before:
                continue

            results.append({
                'path': str(file),
                'name': file.name,
                'size': size,
                'modified': mtime
            })

        logging.info(f"Ditemukan {len(results)} file")
        return results

# Contoh penggunaan
fm = FileManager("C:/Users/USER/Documents/Sekolah")

# Preview rename
fm.batch_rename("foto_*.jpg", "kegiatan_{date}_{counter:03d}.jpg", dry_run=True)

# Organize
fm.organize_by_extension(dry_run=True)

# Cari duplikat
fm.find_duplicates()

# Search file besar
large_files = fm.search_files(min_size=10*1024*1024)  # >10MB
```

### Bagian 3: Web Scraping

#### Step 3.1: Scraping Dasar dengan requests + BeautifulSoup

```python
# scripts/web_scraper.py
"""
Web scraping etis untuk data publik.
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import logging
from urllib.parse import urljoin, urlparse

logging.basicConfig(level=logging.INFO)

class EthicalScraper:
    """Web scraper dengan etika dan rate limiting."""

    def __init__(self, base_url, delay=2):
        self.base_url = base_url
        self.delay = delay  # Delay antar request (detik)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Educational Research Bot)',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'id-ID,id;q=0.9'
        })

    def respect_robots(self):
        """Cek robots.txt sebelum scraping."""
        robots_url = urljoin(self.base_url, '/robots.txt')
        try:
            resp = self.session.get(robots_url, timeout=5)
            if resp.status_code == 200:
                logging.info("robots.txt ditemukan. Pastikan scraping diperbolehkan.")
                logging.info(resp.text[:500])
        except:
            logging.warning("Tidak bisa akses robots.txt")

    def fetch_page(self, url):
        """Fetch halaman dengan rate limiting."""
        time.sleep(self.delay)  # Rate limiting

        try:
            resp = self.session.get(url, timeout=30)
            resp.raise_for_status()
            return resp.text
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching {url}: {e}")
            return None

    def extract_table(self, url, table_index=0):
        """Extract tabel dari halaman web."""
        html = self.fetch_page(url)
        if not html:
            return None

        soup = BeautifulSoup(html, 'html.parser')
        tables = soup.find_all('table')

        if table_index >= len(tables):
            logging.error(f"Tabel index {table_index} tidak ditemukan")
            return None

        table = tables[table_index]
        rows = table.find_all('tr')

        data = []
        for row in rows:
            cells = row.find_all(['th', 'td'])
            data.append([cell.get_text(strip=True) for cell in cells])

        if data:
            df = pd.DataFrame(data[1:], columns=data[0])
            logging.info(f"Extracted {len(df)} rows from table")
            return df
        return None

    def extract_links(self, url):
        """Extract semua link dari halaman."""
        html = self.fetch_page(url)
        if not html:
            return []

        soup = BeautifulSoup(html, 'html.parser')
        links = []

        for a in soup.find_all('a', href=True):
            full_url = urljoin(url, a['href'])
            links.append({
                'url': full_url,
                'text': a.get_text(strip=True),
                'domain': urlparse(full_url).netloc
            })

        logging.info(f"Found {len(links)} links")
        return links

    def extract_content(self, url, selectors):
        """Extract konten berdasarkan CSS selector."""
        html = self.fetch_page(url)
        if not html:
            return None

        soup = BeautifulSoup(html, 'html.parser')
        results = {}

        for key, selector in selectors.items():
            elements = soup.select(selector)
            if elements:
                results[key] = [el.get_text(strip=True) for el in elements]

        return results

# Contoh: Scraping data publik pendidikan
scraper = EthicalScraper('https://example.com', delay=3)
scraper.respect_robots()

# Extract tabel
df = scraper.extract_table('https://example.com/data', table_index=0)
if df is not None:
    df.to_csv('scraped_data.csv', index=False)

# Extract konten spesifik
content = scraper.extract_content('https://example.com/article', {
    'title': 'h1',
    'author': '.author-name',
    'date': '.publish-date',
    'body': '.article-body p'
})
```

#### Step 3.2: Scraping dengan Pagination

```python
# scripts/scraper_pagination.py
"""
Web scraping dengan handling pagination.
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import logging

logging.basicConfig(level=logging.INFO)

def scrape_with_pagination(base_url, max_pages=10, delay=2):
    """Scrape multiple halaman dengan pagination."""

    all_data = []
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Educational Bot)'
    })

    current_url = base_url
    page = 1

    while page <= max_pages:
        logging.info(f"Scraping halaman {page}: {current_url}")

        try:
            resp = session.get(current_url, timeout=30)
            resp.raise_for_status()
        except requests.exceptions.RequestException as e:
            logging.error(f"Error: {e}")
            break

        soup = BeautifulSoup(resp.text, 'html.parser')

        # Extract data dari halaman ini
        items = soup.select('.data-item')  # Sesuaikan selector
        for item in items:
            data = {
                'title': item.select_one('.title').get_text(strip=True) if item.select_one('.title') else '',
                'value': item.select_one('.value').get_text(strip=True) if item.select_one('.value') else '',
                'page': page
            }
            all_data.append(data)

        logging.info(f"  Ditemukan {len(items)} items di halaman {page}")

        # Cari link halaman berikutnya
        next_link = soup.select_one('a.next, a[rel="next"], .pagination .next a')
        if next_link and next_link.get('href'):
            current_url = next_link['href']
            if not current_url.startswith('http'):
                from urllib.parse import urljoin
                current_url = urljoin(base_url, current_url)
        else:
            logging.info("Tidak ada halaman berikutnya")
            break

        page += 1
        time.sleep(delay)  # Rate limiting

    df = pd.DataFrame(all_data)
    logging.info(f"Total: {len(df)} items dari {page-1} halaman")
    return df

# Jalankan
df = scrape_with_pagination('https://example.com/data?page=1', max_pages=5)
df.to_csv('scraped_all_pages.csv', index=False)
```

### Bagian 4: API Integration

#### Step 4.1: REST API dengan Authentication

```python
# scripts/api_client.py
"""
API client dengan authentication, retry, dan error handling.
"""

import requests
import time
import logging
from typing import Optional, Dict, Any

logging.basicConfig(level=logging.INFO)

class APIClient:
    """REST API client dengan fitur lengkap."""

    def __init__(self, base_url, api_key=None, token=None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()

        if api_key:
            self.session.headers.update({'Authorization': f'Bearer {api_key}'})
        if token:
            self.session.headers.update({'X-API-Token': token})

        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

    def _request(self, method, endpoint, max_retries=3, **kwargs):
        """Request dengan retry logic."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        for attempt in range(max_retries):
            try:
                resp = self.session.request(method, url, timeout=30, **kwargs)

                # Rate limiting - cek header
                if 'Retry-After' in resp.headers:
                    wait = int(resp.headers['Retry-After'])
                    logging.warning(f"Rate limited. Waiting {wait} seconds...")
                    time.sleep(wait)
                    continue

                resp.raise_for_status()
                return resp.json() if resp.content else None

            except requests.exceptions.HTTPError as e:
                if resp.status_code == 429:  # Too Many Requests
                    wait = 2 ** attempt  # Exponential backoff
                    logging.warning(f"Rate limited. Retry {attempt+1}/{max_retries} in {wait}s")
                    time.sleep(wait)
                elif resp.status_code >= 500:  # Server error
                    wait = 2 ** attempt
                    logging.warning(f"Server error. Retry {attempt+1}/{max_retries} in {wait}s")
                    time.sleep(wait)
                else:
                    logging.error(f"HTTP Error {resp.status_code}: {e}")
                    raise

            except requests.exceptions.RequestException as e:
                if attempt < max_retries - 1:
                    wait = 2 ** attempt
                    logging.warning(f"Request failed. Retry {attempt+1}/{max_retries} in {wait}s")
                    time.sleep(wait)
                else:
                    logging.error(f"Request failed after {max_retries} attempts: {e}")
                    raise

        return None

    def get(self, endpoint, params=None):
        """GET request."""
        return self._request('GET', endpoint, params=params)

    def post(self, endpoint, data=None, json=None):
        """POST request."""
        return self._request('POST', endpoint, json=json, data=data)

    def put(self, endpoint, data=None, json=None):
        """PUT request."""
        return self._request('PUT', endpoint, json=json, data=data)

    def delete(self, endpoint):
        """DELETE request."""
        return self._request('DELETE', endpoint)

    def get_all_pages(self, endpoint, params=None):
        """GET semua halaman (auto-pagination)."""
        all_results = []
        page = 1

        while True:
            p = {**(params or {}), 'page': page, 'per_page': 100}
            result = self.get(endpoint, params=p)

            if not result or len(result) == 0:
                break

            all_results.extend(result)
            logging.info(f"  Page {page}: {len(result)} items (total: {len(all_results)})")

            if len(result) < 100:  # Last page
                break
            page += 1
            time.sleep(1)  # Rate limiting

        return all_results

# Contoh penggunaan
client = APIClient(
    base_url='https://api.example.com/v1',
    api_key='your-api-key-here'
)

# GET data
data = client.get('/students', params={'kelas': '6'})

# POST data
new_student = client.post('/students', json={
    'nisn': '0012345678',
    'nama': 'Ahmad Fauzi',
    'kelas': '6A'
})

# GET semua halaman
all_students = client.get_all_pages('/students')
```

### Bagian 5: Scheduled Tasks

#### Step 5.1: Python Scheduler

```python
# scripts/scheduler.py
"""
Task scheduler dengan Python.
"""

import schedule
import time
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler.log'),
        logging.StreamHandler()
    ]
)

def backup_database():
    """Task: Backup database."""
    logging.info("Starting database backup...")
    # Logika backup di sini
    logging.info("Database backup completed")

def send_daily_report():
    """Task: Kirim laporan harian."""
    logging.info("Generating daily report...")
    # Logika report di sini
    logging.info("Daily report sent")

def check_system_health():
    """Task: Cek kesehatan sistem."""
    logging.info("Checking system health...")
    # Logika health check di sini
    logging.info("System health check completed")

def cleanup_temp_files():
    """Task: Bersihkan file temporary."""
    logging.info("Cleaning up temp files...")
    # Logika cleanup di sini
    logging.info("Temp files cleaned")

# Setup jadwal
schedule.every().day.at("02:00").do(backup_database)
schedule.every().day.at("08:00").do(send_daily_report)
schedule.every().hour.do(check_system_health)
schedule.every().day.at("23:00").do(cleanup_temp_files)

# Weekly tasks
schedule.every().monday.at("09:00").do(lambda: logging.info("Weekly report generated"))
schedule.every().friday.at("16:00").do(lambda: logging.info("Weekly backup completed"))

# Run scheduler
logging.info("Scheduler started. Press Ctrl+C to stop.")
try:
    while True:
        schedule.run_pending()
        time.sleep(60)  # Cek setiap menit
except KeyboardInterrupt:
    logging.info("Scheduler stopped")
```

#### Step 5.2: Windows Task Scheduler Setup

```python
# scripts/setup_windows_task.py
"""
Setup Windows Task Scheduler untuk script Python.
"""

import subprocess
import os

def create_scheduled_task(task_name, script_path, schedule_type="daily",
                          time="02:00", user=None, run_level="HIGHEST"):
    """Buat scheduled task di Windows."""

    # Convert script path ke absolute
    script_path = os.path.abspath(script_path)
    python_path = "python"  # Atau path lengkap ke python.exe

    # Build command
    cmd = [
        'schtasks', '/Create',
        '/TN', task_name,
        '/TR', f'"{python_path}" "{script_path}"',
        '/SC', schedule_type.upper(),
        '/ST', time,
        '/RL', run_level,
        '/F'  # Force overwrite
    ]

    if user:
        cmd.extend(['/RU', user])

    # Execute
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        print(f"Task '{task_name}' berhasil dibuat")
    else:
        print(f"Error: {result.stderr}")

    return result.returncode == 0

# Contoh: Buat task backup harian
create_scheduled_task(
    task_name="Sekolah_Daily_Backup",
    script_path="scripts/backup_harian.py",
    schedule_type="daily",
    time="02:00"
)

# Contoh: Buat task report mingguan
create_scheduled_task(
    task_name="Sekolah_Weekly_Report",
    script_path="scripts/laporan_mingguan.py",
    schedule_type="weekly",
    time="08:00"
)
```

### Bagian 6: Error Handling dan Logging

#### Step 6.1: Error Handling Patterns

```python
# scripts/error_handling.py
"""
Pattern error handling untuk automation script.
"""

import time
import logging
from functools import wraps

logging.basicConfig(level=logging.INFO)

def retry(max_attempts=3, delay=1, backoff=2, exceptions=(Exception,)):
    """Decorator untuk retry dengan exponential backoff."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_delay = delay
            last_exception = None

            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    logging.warning(
                        f"Attempt {attempt+1}/{max_attempts} failed: {e}"
                    )
                    if attempt < max_attempts - 1:
                        logging.info(f"  Retrying in {current_delay}s...")
                        time.sleep(current_delay)
                        current_delay *= backoff

            raise last_exception
        return wrapper
    return decorator

# Contoh penggunaan
@retry(max_attempts=3, delay=2, backoff=2, exceptions=(ConnectionError, TimeoutError))
def fetch_data(url):
    """Fetch data dengan auto-retry."""
    import requests
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()

def safe_execute(func, fallback=None, *args, **kwargs):
    """Execute function dengan fallback."""
    try:
        return func(*args, **kwargs)
    except Exception as e:
        logging.error(f"Error executing {func.__name__}: {e}")
        if fallback:
            logging.info(f"  Using fallback value")
            return fallback
        raise

# Circuit breaker pattern
class CircuitBreaker:
    """Circuit breaker untuk mencegah cascade failure."""

    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'closed'  # closed, open, half-open

    def call(self, func, *args, **kwargs):
        if self.state == 'open':
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = 'half-open'
            else:
                raise Exception("Circuit breaker is open")

        try:
            result = func(*args, **kwargs)
            if self.state == 'half-open':
                self.state = 'closed'
                self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = 'open'
                logging.error(f"Circuit breaker opened after {self.failure_count} failures")

            raise

# Contoh circuit breaker
breaker = CircuitBreaker(failure_threshold=3, recovery_timeout=30)

def call_api():
    return fetch_data("https://api.example.com/data")

try:
    result = breaker.call(call_api)
except Exception as e:
    logging.error(f"API call failed: {e}")
```

#### Step 6.2: Structured Logging

```python
# scripts/logging_setup.py
"""
Structured logging untuk automation script.
"""

import logging
import logging.handlers
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    """Formatter untuk structured JSON logging."""

    def format(self, record):
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }

        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)

        if hasattr(record, 'extra_data'):
            log_entry['data'] = record.extra_data

        return json.dumps(log_entry, ensure_ascii=False)

def setup_logging(log_file='automation.log', max_bytes=10*1024*1024,
                  backup_count=5, level=logging.INFO):
    """Setup logging dengan rotation."""

    logger = logging.getLogger()
    logger.setLevel(level)

    # File handler dengan rotation
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=max_bytes,  # 10MB
        backupCount=backup_count,
        encoding='utf-8'
    )
    file_handler.setFormatter(JSONFormatter())
    logger.addHandler(file_handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    ))
    logger.addHandler(console_handler)

    return logger

# Contoh penggunaan
logger = setup_logging()

logger.info("Script dimulai", extra={'extra_data': {'version': '1.0'}})

try:
    # Some operation
    result = 10 / 0
except Exception as e:
    logger.error(f"Error dalam operasi: {e}", exc_info=True)

logger.info("Script selesai")
```

### Bagian 7: Monitoring Scripts

#### Step 7.1: System Health Check

```python
# scripts/health_check.py
"""
System health check dan monitoring.
"""

import psutil
import logging
import json
from datetime import datetime
from pathlib import Path

logging.basicConfig(level=logging.INFO)

class SystemMonitor:
    """Monitor kesehatan sistem."""

    def __init__(self, thresholds=None):
        self.thresholds = thresholds or {
            'cpu_percent': 80,
            'memory_percent': 85,
            'disk_percent': 90,
            'response_time': 5  # detik
        }

    def check_cpu(self):
        """Cek CPU usage."""
        percent = psutil.cpu_percent(interval=1)
        status = 'WARNING' if percent > self.thresholds['cpu_percent'] else 'OK'
        return {'metric': 'cpu', 'value': percent, 'status': status}

    def check_memory(self):
        """Cek memory usage."""
        mem = psutil.virtual_memory()
        status = 'WARNING' if mem.percent > self.thresholds['memory_percent'] else 'OK'
        return {
            'metric': 'memory',
            'value': mem.percent,
            'total_gb': round(mem.total / 1024**3, 2),
            'available_gb': round(mem.available / 1024**3, 2),
            'status': status
        }

    def check_disk(self, path='/'):
        """Cek disk usage."""
        disk = psutil.disk_usage(path)
        status = 'WARNING' if disk.percent > self.thresholds['disk_percent'] else 'OK'
        return {
            'metric': 'disk',
            'path': path,
            'value': disk.percent,
            'total_gb': round(disk.total / 1024**3, 2),
            'free_gb': round(disk.free / 1024**3, 2),
            'status': status
        }

    def check_process(self, process_name):
        """Cek apakah process berjalan."""
        for proc in psutil.process_iter(['name', 'status']):
            if process_name.lower() in proc.info['name'].lower():
                return {
                    'metric': 'process',
                    'name': process_name,
                    'status': 'RUNNING',
                    'pid': proc.pid
                }
        return {'metric': 'process', 'name': process_name, 'status': 'NOT_RUNNING'}

    def check_service(self, url, timeout=5):
        """Cek apakah service responding."""
        import requests
        start = datetime.now()
        try:
            resp = requests.get(url, timeout=timeout)
            elapsed = (datetime.now() - start).total_seconds()
            status = 'OK' if resp.status_code == 200 else 'ERROR'
            return {
                'metric': 'service',
                'url': url,
                'status': status,
                'response_time': round(elapsed, 2),
                'status_code': resp.status_code
            }
        except Exception as e:
            return {
                'metric': 'service',
                'url': url,
                'status': 'ERROR',
                'error': str(e)
            }

    def run_all_checks(self):
        """Jalankan semua check."""
        results = []

        results.append(self.check_cpu())
        results.append(self.check_memory())
        results.append(self.check_disk('C:\\'))
        results.append(self.check_process('python'))

        # Cek service penting
        services = [
            'http://localhost:5774',  # Dapodik
        ]
        for url in services:
            results.append(self.check_service(url))

        # Summary
        warnings = [r for r in results if r.get('status') == 'WARNING']
        errors = [r for r in results if r.get('status') == 'ERROR']

        summary = {
            'timestamp': datetime.now().isoformat(),
            'total_checks': len(results),
            'warnings': len(warnings),
            'errors': len(errors),
            'results': results
        }

        # Log warnings dan errors
        for r in warnings:
            logging.warning(f"WARNING: {r['metric']} = {r.get('value', 'N/A')}")
        for r in errors:
            logging.error(f"ERROR: {r['metric']} - {r.get('error', r.get('status'))}")

        return summary

# Jalankan
monitor = SystemMonitor()
results = monitor.run_all_checks()

# Simpan hasil
with open('health_check.json', 'w') as f:
    json.dump(results, f, indent=2)
```

### Bagian 8: Backup Scripts

#### Step 8.1: Database Backup dengan Verification

```python
# scripts/backup_database.py
"""
Backup database dengan incremental backup dan verification.
"""

import subprocess
import shutil
import hashlib
import logging
from datetime import datetime, timedelta
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class DatabaseBackup:
    """Backup database SQLite dengan verification."""

    def __init__(self, db_path, backup_dir, retention_days=30):
        self.db_path = Path(db_path)
        self.backup_dir = Path(backup_dir)
        self.retention_days = retention_days
        self.backup_dir.mkdir(parents=True, exist_ok=True)

    def full_backup(self):
        """Full backup database."""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f"sekolah_full_{timestamp}.db"
        backup_path = self.backup_dir / backup_name

        logging.info(f"Starting full backup: {backup_name}")

        # Copy database
        shutil.copy2(self.db_path, backup_path)

        # Verify
        if self.verify_backup(backup_path):
            # Generate checksum
            checksum = self.generate_checksum(backup_path)
            checksum_path = backup_path.with_suffix('.db.sha256')
            checksum_path.write_text(checksum)

            logging.info(f"Backup verified. Checksum: {checksum[:16]}...")
            return str(backup_path)
        else:
            logging.error("Backup verification failed!")
            return None

    def incremental_backup(self, last_backup_path=None):
        """Incremental backup (hanya perubahan sejak backup terakhir)."""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f"sekolah_incr_{timestamp}.db"
        backup_path = self.backup_dir / backup_name

        logging.info(f"Starting incremental backup: {backup_name}")

        # SQLite: dump changes
        try:
            result = subprocess.run(
                ['sqlite3', str(self.db_path), f'.dump'],
                capture_output=True, text=True, timeout=60
            )

            if result.returncode == 0:
                backup_path.with_suffix('.sql').write_text(result.stdout)
                logging.info(f"Incremental backup selesai: {backup_path.with_suffix('.sql')}")
                return str(backup_path.with_suffix('.sql'))
            else:
                logging.error(f"SQLite dump error: {result.stderr}")
                return None
        except Exception as e:
            logging.error(f"Error: {e}")
            return None

    def verify_backup(self, backup_path):
        """Verifikasi backup file valid."""
        try:
            # Cek file ada dan tidak kosong
            if not backup_path.exists():
                return False
            if backup_path.stat().st_size == 0:
                return False

            # Cek SQLite integrity
            result = subprocess.run(
                ['sqlite3', str(backup_path), 'PRAGMA integrity_check;'],
                capture_output=True, text=True, timeout=30
            )

            return result.stdout.strip() == 'ok'
        except:
            return False

    def generate_checksum(self, file_path):
        """Generate SHA-256 checksum."""
        sha256 = hashlib.sha256()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b''):
                sha256.update(chunk)
        return sha256.hexdigest()

    def cleanup_old_backups(self):
        """Hapus backup yang sudah melewati retention period."""
        cutoff = datetime.now() - timedelta(days=self.retention_days)
        deleted = 0

        for backup in self.backup_dir.glob('sekolah_*.db'):
            if backup.stat().st_mtime < cutoff.timestamp():
                backup.unlink()
                # Hapus juga checksum file
                checksum = backup.with_suffix('.db.sha256')
                if checksum.exists():
                    checksum.unlink()
                deleted += 1
                logging.info(f"Deleted old backup: {backup.name}")

        logging.info(f"Cleanup: {deleted} old backups deleted")

    def run(self, backup_type='full'):
        """Jalankan backup."""
        logging.info(f"=== {backup_type.upper()} BACKUP ===")

        if backup_type == 'full':
            result = self.full_backup()
        else:
            result = self.incremental_backup()

        if result:
            self.cleanup_old_backups()
            logging.info("Backup selesai dengan sukses")
        else:
            logging.error("Backup gagal!")

        return result

# Jalankan
backup = DatabaseBackup(
    db_path="data/sekolah.db",
    backup_dir="backups/database",
    retention_days=30
)
backup.run('full')
```

### Bagian 9: Notification Scripts

#### Step 9.1: Email Notification

```python
# scripts/notifications.py
"""
Notifikasi via Email, Telegram, dan Slack.
"""

import smtplib
import requests
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path

logging.basicConfig(level=logging.INFO)

class Notifier:
    """Multi-channel notification."""

    def __init__(self, config):
        self.config = config

    def send_email(self, to, subject, body, attachments=None):
        """Kirim email notification."""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.config['email']['from']
            msg['To'] = to
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'html'))

            # Attachments
            if attachments:
                for filepath in attachments:
                    filepath = Path(filepath)
                    if filepath.exists():
                        with open(filepath, 'rb') as f:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(f.read())
                            encoders.encode_base64(part)
                            part.add_header(
                                'Content-Disposition',
                                f'attachment; filename="{filepath.name}"'
                            )
                            msg.attach(part)

            # Send
            server = smtplib.SMTP(
                self.config['email']['smtp_server'],
                self.config['email']['smtp_port']
            )
            server.starttls()
            server.login(
                self.config['email']['username'],
                self.config['email']['password']
            )
            server.send_message(msg)
            server.quit()

            logging.info(f"Email sent to {to}: {subject}")
            return True

        except Exception as e:
            logging.error(f"Email error: {e}")
            return False

    def send_telegram(self, chat_id, message, parse_mode='HTML'):
        """Kirim notifikasi Telegram."""
        try:
            url = f"https://api.telegram.org/bot{self.config['telegram']['bot_token']}/sendMessage"
            payload = {
                'chat_id': chat_id,
                'text': message,
                'parse_mode': parse_mode
            }

            resp = requests.post(url, json=payload, timeout=10)
            resp.raise_for_status()

            logging.info(f"Telegram sent to {chat_id}")
            return True

        except Exception as e:
            logging.error(f"Telegram error: {e}")
            return False

    def send_slack(self, webhook_url, message, blocks=None):
        """Kirim notifikasi Slack."""
        try:
            payload = {'text': message}
            if blocks:
                payload['blocks'] = blocks

            resp = requests.post(webhook_url, json=payload, timeout=10)
            resp.raise_for_status()

            logging.info(f"Slack notification sent")
            return True

        except Exception as e:
            logging.error(f"Slack error: {e}")
            return False

# Config
config = {
    'email': {
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'username': 'sekolah@gmail.com',
        'password': 'app-password-here',
        'from': 'SD Negeri Pasirhalang <sekolah@gmail.com>'
    },
    'telegram': {
        'bot_token': 'your-bot-token-here'
    }
}

notifier = Notifier(config)

# Kirim email laporan
notifier.send_email(
    to='kepala.sekolah@gmail.com',
    subject='Laporan Harian - SD Negeri Pasirhalang',
    body='<h2>Laporan Harian</h2><p>Semua sistem berjalan normal.</p>',
    attachments=['output/laporan_harian.pdf']
)

# Kirim Telegram
notifier.send_telegram(
    chat_id='123456789',
    message='<b>Backup Selesai</b>\nDatabase berhasil di-backup pada 02:00 WIB'
)
```

### Bagian 10: Real-World Scenario - School Automation

#### Step 10.1: Daily Attendance Report Automation

```python
# scripts/daily_attendance.py
"""
Otomatisasi laporan kehadiran harian SD Negeri Pasirhalang.
Menggabungkan: data processing, email, logging, error handling.
"""

import pandas as pd
import logging
from datetime import datetime
from notifications import Notifier

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('daily_attendance.log'),
        logging.StreamHandler()
    ]
)

class DailyAttendanceReport:
    """Generate dan kirim laporan kehadiran harian."""

    def __init__(self, data_path, notifier):
        self.data_path = data_path
        self.notifier = notifier
        self.today = datetime.now().strftime('%Y-%m-%d')

    def generate_report(self):
        """Generate laporan kehadiran."""
        logging.info("Generating daily attendance report...")

        try:
            # Baca data kehadiran hari ini
            df = pd.read_csv(self.data_path)
            today_data = df[df['tanggal'] == self.today]

            if today_data.empty:
                logging.warning(f"Tidak ada data kehadiran untuk {self.today}")
                return None

            # Statistik
            total_siswa = len(today_data)
            hadir = len(today_data[today_data['status'] == 'H'])
            sakit = len(today_data[today_data['status'] == 'S'])
            izin = len(today_data[today_data['status'] == 'I'])
            alpha = len(today_data[today_data['status'] == 'A'])

            persen_hadir = (hadir / total_siswa * 100) if total_siswa > 0 else 0

            # Per kelas
            kelas_stats = today_data.groupby('kelas').agg({
                'status': lambda x: (x == 'H').sum()
            }).reset_index()
            kelas_stats.columns = ['kelas', 'hadir']
            kelas_stats['total'] = today_data.groupby('kelas').size().values
            kelas_stats['persen'] = (kelas_stats['hadir'] / kelas_stats['total'] * 100).round(1)

            # Build report
            report = f"""
<b>Laporan Kehadiran Harian</b>
📅 Tanggal: {self.today}
🏫 SD Negeri Pasirhalang

<b>Ringkasan:</b>
👥 Total Siswa: {total_siswa}
✅ Hadir: {hadir} ({persen_hadir:.1f}%)
🤒 Sakit: {sakit}
📝 Izin: {izin}
❌ Alpha: {alpha}

<b>Per Kelas:</b>
"""
            for _, row in kelas_stats.iterrows():
                report += f"  Kelas {row['kelas']}: {row['hadir']}/{row['total']} ({row['persen']}%)\n"

            # Alert jika kehadiran rendah
            if persen_hadir < 80:
                report += f"\n⚠️ <b>PERHATIAN:</b> Kehadiran di bawah 80%!"

            return report

        except Exception as e:
            logging.error(f"Error generating report: {e}")
            return None

    def send_report(self):
        """Generate dan kirim laporan."""
        report = self.generate_report()

        if report:
            # Kirim ke Telegram
            self.notifier.send_telegram(
                chat_id='123456789',
                message=report
            )

            # Kirim email ke kepala sekolah
            self.notifier.send_email(
                to='kepala.sekolah@gmail.com',
                subject=f'Laporan Kehadiran - {self.today}',
                body=report.replace('<b>', '').replace('</b>', '')
            )

            logging.info("Report sent successfully")
        else:
            logging.error("Failed to generate report")

# Jalankan
config = {
    'telegram': {'bot_token': 'your-bot-token'},
    'email': {
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'username': 'sekolah@gmail.com',
        'password': 'app-password',
        'from': 'SD Pasirhalang <sekolah@gmail.com>'
    }
}
notifier = Notifier(config)
report = DailyAttendanceReport('data/kehadiran.csv', notifier)
report.send_report()
```

## 💡 Tips Praktis

### Prompt Template untuk Berbagai Skenario

```
1. "Buatkan script Python untuk otomatisasi:
   - Tugas: [deskripsikan]
   - Input: [sumber]
   - Output: [hasil]
   - Schedule: [frekuensi]
   - Notification: [cara notify jika selesai/error]"

2. "Buatkan web scraper untuk:
   - Target: [URL]
   - Data: [yang diambil]
   - Pagination: [ya/tidak]
   - Rate limit: [delay]
   - Output: [format]"

3. "Buatkan API integration script:
   - Endpoint: [URL]
   - Auth: [API key/OAuth]
   - Method: [GET/POST]
   - Retry: [jumlah retry]
   - Error handling: [cara handle]"

4. "Buatkan backup script:
   - Source: [database/file]
   - Destination: [lokasi backup]
   - Schedule: [frekuensi]
   - Retention: [berapa lama simpan]
   - Verification: [cara cek backup valid]"
```

### Error Handling Checklist

- [ ] Try/catch di semua operasi I/O
- [ ] Retry dengan exponential backoff
- [ ] Timeout di semua network call
- [ ] Logging di setiap error
- [ ] Fallback value jika operasi gagal
- [ ] Notification jika error critical

### Security Best Practices

1. **Jangan hardcode** password/API key - pakai environment variable
2. **Validate input** sebelum proses
3. **Rate limiting** untuk web scraping
4. **Respect robots.txt** saat scraping
5. **Encrypt** sensitive data di log
6. **Backup** sebelum operasi destruktif

## ✅ Checklist

- [ ] Bisa menulis PowerShell/Bash script dasar
- [ ] Bisa otomatisasi file operations (rename, move, organize)
- [ ] Bisa web scraping dengan requests + BeautifulSoup
- [ ] Bisa handle pagination dan anti-bot
- [ ] Bisa integrasi REST API dengan authentication
- [ ] Bisa setup scheduled tasks (cron/Task Scheduler)
- [ ] Bisa implementasi retry logic dan error handling
- [ ] Bisa setup structured logging dengan rotation
- [ ] Bisa buat monitoring dan health check script
- [ ] Bisa buat backup script dengan verification
- [ ] Bisa kirim notifikasi via email/Telegram/Slack
- [ ] Bisa buat automation pipeline lengkap untuk sekolah

## ⚠️ Pitfalls

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Script gagal di production | Path hardcoded | Pakai relative path atau config file |
| API rate limited | Terlalu banyak request | Tambah delay, gunakan exponential backoff |
| Scraping blocked | User-Agent terdeteksi bot | Rotasi User-Agent, respect robots.txt |
| Memory leak | File tidak ditutup | Pakai context manager (with statement) |
| Scheduled task tidak jalan | Permission issue | Run as administrator, cek execution policy |
| Email tidak terkirim | SMTP auth gagal | Gunakan app password, bukan password biasa |
| Backup corrupt | Database locked saat backup | Quiesce database sebelum backup |

## 📝 Ringkasan

1. **Identifikasi** tugas berulang yang bisa diotomatisasi
2. **Pilih tool** yang tepat: shell script, Python, atau kombinasi
3. **Buat script** dengan error handling dan logging
4. **Test** dengan dry run sebelum eksekusi
5. **Schedule** untuk tugas rutin
6. **Monitor** dengan health check dan alerting
7. **Backup** data penting secara otomatis
8. **Notify** via email/Telegram saat selesai atau error
9. **Dokumentasi** semua script dan setup
10. **Review** dan improve secara berkala
