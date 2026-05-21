# 09 — Arsitektur YouTube & Netflix: Video Streaming Scale

> **Estimasi:** 2-3 jam | **Level:** Advanced
> **Sumber:** [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)
> **Referensi:** [YouTube Engineering](https://blog.youtube/tech/), [Netflix Tech Blog](https://netflixtechblog.com/), [High Scalability YouTube](http://highscalability.com/youtube-architecture)

---

## 📋 DAFTAR ISI

### Bagian A: YouTube Architecture
1. [Requirements & Capacity](#1-requirements--capacity)
2. [Video Upload Pipeline](#2-video-upload-pipeline)
3. [Transcoding System](#3-transcoding-system)
4. [CDN Distribution & Adaptive Streaming](#4-cdn-distribution--adaptive-streaming)
5. [View Counting System](#5-view-counting-system)
6. [Recommendation System](#6-recommendation-system)
7. [Comment System](#7-comment-system)
8. [Live Streaming](#8-live-streaming)

### Bagian B: Netflix Architecture
9. [Open Connect CDN](#9-open-connect-cdn)
10. [Microservices Architecture](#10-microservices-architecture)
11. [Recommendation Engine](#11-recommendation-engine)
12. [Chaos Engineering](#12-chaos-engineering)
13. [Data Platform](#13-data-platform)

---

# BAGIAN A: YOUTUBE ARCHITECTURE

---

## 1. REQUIREMENTS & CAPACITY

### 1.1 Functional Requirements

| Fitur | Deskripsi | Priority |
|-------|-----------|----------|
| **Video Upload** | User upload video (hingga 256GB, 12 jam) | Core |
| **Video Playback** | Streaming video dengan adaptive quality | Core |
| **Video Processing** | Transcoding ke multiple resolutions | Core |
| **Search** | Cari video berdasarkan title, description, tags | High |
| **Comments** | Komentar pada video (nested/threaded) | High |
| **Like/Dislike** | User engagement | High |
| **Subscriptions** | Subscribe channel, notification | High |
| **Recommendations** | Video suggestions | High |
| **Live Streaming** | Real-time video broadcast | Medium |
| **Shorts** | Short-form vertical video | Medium |
| **Playlists** | Kumpulan video | Medium |
| **Analytics** | Creator dashboard, view stats | Medium |

### 1.2 Non-Functional Requirements

| Requirement | Target | Alasan |
|-------------|--------|--------|
| **Video Start Latency** | < 2 detik | User experience, bounce rate |
| **Buffer Ratio** | < 1% | Smooth playback |
| **Upload Reliability** | 99.9% | Creator trust |
| **Availability** | 99.99% | Platform global |
| **Video Durability** | 99.999999999% (11 nines) | Video tidak boleh hilang |
| **Scalability** | Horizontal | Handle growth tanpa downtime |

### 1.3 Capacity Estimation

```
┌─────────────────────────────────────────────────────────────────────┐
│                    YOUTUBE SCALE (2026)                              │
├─────────────────────────────────────────────────────────────────────┤
│ Monthly Active Users     │ 2.5+ miliar                               │
│ Video uploads per minute │ 500+ hours                                │
│ Video views per day      │ 5+ miliar                                 │
│ Watch hours per day      │ 1+ miliar jam                             │
│ Total videos             │ 800+ juta                                 │
│ Total storage            │ Exabytes (1 EB = 1,000 PB)               │
│ Peak bandwidth           │ 100+ Tbps                                 │
│ CDN edge locations       │ 1,000+ globally                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.4 Back-of-the-Envelope Calculations

**Upload Volume per Hari:**
```
500 hours/minute × 60 × 24 = 720,000 hours/hari

Average video size (1080p, 10 menit) ≈ 500 MB
Videos per hari ≈ 720,000 × 6 = 4,320,000 videos/hari

Daily upload storage:
4,320,000 × 500 MB = 2,160,000,000 MB ≈ 2.16 PB/hari

Yearly upload storage:
2.16 PB × 365 ≈ 788 PB/tahun (hanya original upload!)
```

**Transcoded Storage (per video):**
```
1 video original → 8 transcoded versions:
  144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p (4K)

Average transcoded sizes:
  144p:  10 MB
  240p:  25 MB
  360p:  50 MB
  480p:  100 MB
  720p:  250 MB
  1080p: 500 MB
  1440p: 1 GB
  2160p: 2 GB
  Total: ~3.9 GB per video

Daily transcoded storage:
4,320,000 × 3.9 GB ≈ 16.8 PB/hari

Total storage per tahun (upload + transcoded):
(2.16 + 16.8) PB × 365 ≈ 6.9 EB/tahun
```

**View Bandwidth per Hari:**
```
5 miliar views/hari
Average view duration: 5 menit
Average bitrate: 2.5 Mbps (720p)

Data per view: 2.5 Mbps × 300 detik / 8 = 93.75 MB

Daily bandwidth:
5,000,000,000 × 93.75 MB = 468,750,000,000 MB ≈ 468.75 PB/hari

Peak bandwidth (evening hours, 4x average):
≈ 1.875 PB/jam ≈ 4.2 Tbps
```

**QPS Estimation:**
```
Video views: 5 miliar / 86,400 ≈ 57,870 views/detik
API requests (10x views): ≈ 578,700 QPS
Search queries: ≈ 50,000 QPS
Upload requests: ≈ 50 QPS
Comment operations: ≈ 10,000 QPS
```

---

## 2. VIDEO UPLOAD PIPELINE

### 2.1 Chunked Upload Architecture

**Kenapa chunked upload?**
- Video bisa sangat besar (hingga 256GB)
- Koneksi internet tidak stabil
- Perlu resume capability
- Parallel upload untuk speed

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHUNKED UPLOAD FLOW                               │
│                                                                      │
│  Client (Browser/App):                                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Split video file into chunks (default: 10MB per chunk)    │  │
│  │  2. Calculate MD5/SHA256 hash per chunk (integrity check)    │  │
│  │  3. Send INIT request to get upload session ID                │  │
│  │  4. Upload chunks in parallel (configurable concurrency)      │  │
│  │  5. Send COMPLETE request                                   │  │
│  │  6. Server assembles chunks → triggers processing pipeline   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Server:                                                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  INIT:                                                        │  │
│  │    POST /upload/init {filename, size, mime_type, chunk_size}  │  │
│  │    → Returns: {upload_id, chunk_size, total_chunks}           │  │
│  │                                                              │  │
│  │  UPLOAD CHUNK:                                                │  │
│  │    PUT /upload/{upload_id}/chunk/{index}                      │  │
│  │    Headers: Content-MD5, Content-Range                        │  │
│  │    → Returns: {chunk_index, status: "received"}               │  │
│  │                                                              │  │
│  │  COMPLETE:                                                    │  │
│  │    POST /upload/{upload_id}/complete                          │  │
│  │    → Returns: {video_id, status: "processing"}                │  │
│  │                                                              │  │
│  │  RESUME:                                                      │  │
│  │    GET /upload/{upload_id}/status                             │  │
│  │    → Returns: {received_chunks: [0,1,2,4,5], missing: [3]}   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Upload Service Implementation

```python
class VideoUploadService:
    CHUNK_SIZE = 10 * 1024 * 1024  # 10MB
    MAX_CONCURRENT_UPLOADS = 4
    MAX_VIDEO_SIZE = 256 * 1024 * 1024 * 1024  # 256GB
    SESSION_TTL = 86400  # 24 hours

    def initiate_upload(self, user_id: str, metadata: UploadMetadata) -> UploadSession:
        """Step 1: Create upload session"""
        if metadata.file_size > self.MAX_VIDEO_SIZE:
            raise FileTooLargeError(f"Max size: {self.MAX_VIDEO_SIZE}")

        upload_id = generate_uuid()
        total_chunks = math.ceil(metadata.file_size / self.CHUNK_SIZE)

        session = UploadSession(
            upload_id=upload_id,
            user_id=user_id,
            filename=metadata.filename,
            file_size=metadata.file_size,
            mime_type=metadata.mime_type,
            total_chunks=total_chunks,
            received_chunks=set(),
            status="initiated",
            created_at=datetime.utcnow()
        )

        # Store session in Redis for fast access
        self.redis.set(
            f"upload:{upload_id}",
            session.to_json(),
            ex=self.SESSION_TTL
        )

        # Reserve storage quota
        self.quota_service.reserve(user_id, metadata.file_size)

        return session

    def upload_chunk(self, upload_id: str, chunk_index: int, data: bytes,
                     content_md5: str) -> ChunkStatus:
        """Step 2: Upload individual chunk"""
        session = self._get_session(upload_id)
        if not session:
            raise SessionNotFoundError()

        if chunk_index >= session.total_chunks:
            raise InvalidChunkError()

        # Verify integrity
        if hashlib.md5(data).hexdigest() != content_md5:
            raise IntegrityError("Chunk MD5 mismatch")

        # Store chunk in temporary object storage
        chunk_key = f"temp/{upload_id}/{chunk_index:06d}"
        self.object_storage.put(chunk_key, data)

        # Track received chunk
        session.received_chunks.add(chunk_index)
        self._update_session(session)

        return ChunkStatus(chunk_index=chunk_index, status="received")

    def complete_upload(self, upload_id: str) -> VideoProcessingJob:
        """Step 3: Finalize and start processing"""
        session = self._get_session(upload_id)

        # Verify all chunks received
        if len(session.received_chunks) != session.total_chunks:
            missing = set(range(session.total_chunks)) - session.received_chunks
            raise IncompleteUploadError(f"Missing chunks: {missing}")

        # Assemble final file
        final_key = f"uploads/{session.user_id}/{upload_id}/original"
        self._assemble_chunks(upload_id, session.total_chunks, final_key)

        # Create video record in database
        video = Video(
            id=generate_video_id(),
            user_id=session.user_id,
            title=session.filename,
            original_key=final_key,
            file_size=session.file_size,
            status="processing",
            created_at=datetime.utcnow()
        )
        self.video_db.save(video)

        # Trigger processing pipeline
        processing_job = VideoProcessingJob(
            video_id=video.id,
            source_key=final_key,
            status="queued"
        )
        self.kafka.publish("video.uploaded", processing_job.to_dict())

        # Cleanup temp files
        self._cleanup_temp(upload_id)

        return processing_job

    def get_upload_status(self, upload_id: str) -> UploadStatus:
        """Resume support: check which chunks are received"""
        session = self._get_session(upload_id)
        if not session:
            raise SessionNotFoundError()

        return UploadStatus(
            upload_id=upload_id,
            total_chunks=session.total_chunks,
            received_chunks=list(session.received_chunks),
            missing_chunks=list(
                set(range(session.total_chunks)) - session.received_chunks
            ),
            progress=len(session.received_chunks) / session.total_chunks * 100
        )
```

### 2.3 Upload Validation

```python
class UploadValidator:
    ALLOWED_MIME_TYPES = {
        "video/mp4", "video/webm", "video/quicktime",
        "video/x-msvideo", "video/x-matroska",
        "video/avi", "video/mpeg"
    }

    MAX_DURATION = 12 * 3600  # 12 hours
    MIN_DURATION = 1  # 1 second

    def validate(self, file_path: str) -> ValidationResult:
        """Validate uploaded video file"""
        probe = self._probe_video(file_path)

        # Check format
        if probe.mime_type not in self.ALLOWED_MIME_TYPES:
            return ValidationResult(
                valid=False,
                error=f"Unsupported format: {probe.mime_type}"
            )

        # Check duration
        if probe.duration < self.MIN_DURATION:
            return ValidationResult(valid=False, error="Video too short")
        if probe.duration > self.MAX_DURATION:
            return ValidationResult(valid=False, error="Video too long")

        # Check resolution
        if probe.width > 8192 or probe.height > 4320:
            return ValidationResult(valid=False, error="Resolution too high (max 8K)")

        # Check codec
        if probe.video_codec not in ["h264", "vp8", "vp9", "av1", "hevc"]:
            return ValidationResult(valid=False, error="Unsupported video codec")

        # Check audio
        if probe.has_audio and probe.audio_codec not in ["aac", "opus", "mp3"]:
            return ValidationResult(valid=False, error="Unsupported audio codec")

        return ValidationResult(valid=True, metadata=probe)
```

---

## 3. TRANSCODING SYSTEM

### 3.1 Why Transcoding?

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WHY TRANSCODING?                                  │
│                                                                      │
│  Problem:                                                           │
│  - Users have different devices (HP, tablet, laptop, TV)            │
│  - Users have different network speeds (3G, 4G, WiFi, fiber)       │
│  - Original video format mungkin tidak support di semua device     │
│                                                                      │
│  Solution:                                                          │
│  - Convert video ke multiple resolutions                            │
│  - Convert ke multiple codecs                                       │
│  - Generate different bitrates untuk adaptive streaming             │
│                                                                      │
│  Input: 1 video original (misal: 1080p, H.264, 500MB)               │
│  Output: 8+ transcoded versions (~4GB total)                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Transcoding Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TRANSCODING PIPELINE                              │
│                                                                      │
│  Original Video                                                      │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  STAGE 1: ANALYSIS                                           │   │
│  │  • Detect resolution, codec, bitrate, framerate              │   │
│  │  • Analyze content complexity (motion, detail)               │   │
│  │  • Detect scenes (for keyframe placement)                    │   │
│  │  • Generate thumbnails (3-5 keyframes)                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  STAGE 2: TRANSCODING (PARALLEL)                             │   │
│  │                                                              │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │ 144p    │ │ 360p    │ │ 720p    │ │ 1080p   │           │   │
│  │  │ 30fps   │ │ 30fps   │ │ 30/60   │ │ 30/60   │           │   │
│  │  │ 80kbps  │ │ 400kbps │ │ 1.5Mbps │ │ 3Mbps   │           │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │ 240p    │ │ 480p    │ │ 1440p   │ │ 2160p   │           │   │
│  │  │ 30fps   │ │ 30fps   │ │ 30/60   │ │ 30/60   │           │   │
│  │  │ 150kbps │ │ 800kbps │ │ 6Mbps   │ │ 12Mbps  │           │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │   │
│  │                                                              │   │
│  │  Each resolution → multiple codecs:                         │   │
│  │  • H.264/AVC (universal compatibility)                      │   │
│  │  • VP9 (better compression, YouTube default)                │   │
│  │  • AV1 (best compression, newer devices)                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  STAGE 3: SEGMENTATION (for DASH/HLS)                        │   │
│  │  • Split each version into 2-10 second chunks                │   │
│  │  • Generate manifest files (.mpd for DASH, .m3u8 for HLS)   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  STAGE 4: DISTRIBUTION                                       │   │
│  │  • Push to CDN edge servers                                  │   │
│  │  • Update video metadata (available qualities)               │   │
│  │  • Notify user "processing complete"                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Codec Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CODEC COMPARISON                                  │
├──────────────┬───────────┬───────────┬───────────┬──────────────────┤
│ Aspect       │ H.264/AVC │ VP9       │ AV1       │ H.265/HEVC       │
├──────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ Compression  │ Baseline  │ 30% better│ 50% better│ 40% better       │
│              │           │ than H.264│ than H.264│ than H.264       │
├──────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ Encoding     │ Fast      │ Slow      │ Very Slow │ Medium           │
│ Speed        │           │           │           │                  │
├──────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ Decoding     │ Universal │ Good      │ Growing   │ Limited          │
│ Support      │           │           │           │ (licensing)      │
├──────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ License      │ Patent    │ Royalty   │ Royalty   │ Patent           │
│              │ (paid)    │ free      │ free      │ (paid)           │
├──────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ YouTube Use  │ Fallback  │ Default   │ Premium   │ Limited          │
├──────────────┼───────────┼───────────┼───────────┼──────────────────┤
│ Bandwidth    │ 1080p:    │ 1080p:    │ 1080p:    │ 1080p:           │
│ (1080p)      │ 3 Mbps    │ 2 Mbps    │ 1.5 Mbps  │ 1.8 Mbps         │
└──────────────┴───────────┴───────────┴───────────┴──────────────────┘
```

**YouTube Codec Strategy:**
```
┌─────────────────────────────────────────────────────────────┐
│              YOUTUBE CODEC STRATEGY                          │
│                                                             │
│  Tier 1 (All videos):                                       │
│  └→ H.264 + VP9 (maximum compatibility)                    │
│                                                             │
│  Tier 2 (Popular videos, > 10K views):                      │
│  └→ H.264 + VP9 + AV1 (best compression for popular)       │
│                                                             │
│  Tier 3 (Trending, > 1M views):                             │
│  └→ All codecs + all resolutions (full coverage)            │
│                                                             │
│  Rationale:                                                 │
│  - AV1 encoding sangat lambat → hanya untuk video populer  │
│  - VP9 encoding medium → untuk semua video                  │
│  - H.264 encoding cepat → fallback untuk device lama       │
│  - Hemat bandwidth: AV1 50% lebih kecil dari H.264         │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Parallel Transcoding Architecture

```python
class TranscodingOrchestrator:
    def __init__(self):
        self.worker_pool = WorkerPool(min_workers=100, max_workers=1000)
        self.task_queue = KafkaConsumer("video.transcode.tasks")
        self.result_queue = KafkaProducer("video.transcode.results")

    def process_video(self, video_id: str, source_key: str):
        """Orchestrate parallel transcoding"""
        # 1. Download original
        original_path = self.storage.download(source_key)

        # 2. Analyze video
        analysis = self.analyzer.analyze(original_path)

        # 3. Create transcoding tasks for each resolution+codec combo
        tasks = []
        for resolution in self._get_resolutions(analysis):
            for codec in self._get_codecs(video_id):
                task = TranscodeTask(
                    video_id=video_id,
                    source_path=original_path,
                    resolution=resolution,
                    codec=codec,
                    bitrate=self._calculate_bitrate(resolution, analysis),
                    framerate=self._calculate_framerate(analysis)
                )
                tasks.append(task)

        # 4. Submit tasks to worker pool (parallel)
        futures = []
        for task in tasks:
            future = self.worker_pool.submit(self._transcode, task)
            futures.append(future)

        # 5. Wait for all tasks to complete
        results = []
        for future in as_completed(futures):
            result = future.result()
            results.append(result)

            # Upload result to storage
            self.storage.upload(result.output_path, result.cdn_key)

        # 6. Generate manifests (DASH + HLS)
        self.manifest_generator.create_dash_manifest(video_id, results)
        self.manifest_generator.create_hls_manifest(video_id, results)

        # 7. Generate thumbnails
        thumbnails = self.thumbnail_generator.generate(original_path)
        for thumb in thumbnails:
            self.storage.upload(thumb.path, thumb.cdn_key)

        # 8. Update video status
        self.video_db.update_status(video_id, "ready")

        # 9. Push to CDN
        self.cdn_invalidator.purge(video_id)

        # 10. Notify user
        self.notification_service.send(video_id, "processing_complete")
```

### 3.5 FFmpeg Transcoding Command

```bash
# Example: Transcode to 1080p H.264
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -f mp4 \
  output_1080p.mp4

# Example: Transcode to 720p VP9
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -b:v 1500k \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease" \
  -c:a libopus \
  -b:a 96k \
  -f webm \
  output_720p_vp9.webm

# Example: Generate DASH segments
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -b:v 1500k \
  -c:a libopus \
  -b:a 96k \
  -f dash \
  -seg_duration 4 \
  -window_size 5 \
  -adaptation_sets "id=0,streams=v id=1,streams=a" \
  output.mpd
```

---

## 4. CDN DISTRIBUTION & ADAPTIVE STREAMING

### 4.1 CDN Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CDN ARCHITECTURE                                  │
│                                                                      │
│  Origin Storage (Google Cloud Storage)                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  /videos/                                                     │  │
│  │    /2026/01/15/                                               │  │
│  │      /video_abc123/                                           │  │
│  │        /original.mp4                                          │  │
│  │        /144p_h264/                                            │  │
│  │        /360p_h264/                                            │  │
│  │        /720p_h264/                                            │  │
│  │        /1080p_h264/                                           │  │
│  │        /720p_vp9/                                             │  │
│  │        /1080p_vp9/                                            │  │
│  │        /720p_av1/                                             │  │
│  │        /manifests/                                            │  │
│  │          /dash.mpd                                            │  │
│  │          /hls.m3u8                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              CDN EDGE SERVERS (1,000+ locations)              │   │
│  │                                                              │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐               │   │
│  │  │ US-East    │ │ EU-West    │ │ Asia-Tokyo │               │   │
│  │  │ 50 servers │ │ 40 servers │ │ 60 servers │               │   │
│  │  └────────────┘ └────────────┘ └────────────┘               │   │
│  │                                                              │   │
│  │  Cache Strategy:                                             │   │
│  │  • Popular videos (top 1%) → cached at ALL edge servers     │   │
│  │  • Moderate videos (top 10%) → cached at regional edges     │   │
│  │  • Long-tail videos (rest) → fetched from origin on demand  │   │
│  │                                                              │   │
│  │  Cache Eviction: LRU with popularity weighting               │   │
│  │  TTL: 24 hours for popular, 1 hour for long-tail            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│                        End User Device                               │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Adaptive Bitrate Streaming (ABR)

**Konsep:** Video dipecah menjadi chunks kecil, setiap chunk tersedia dalam multiple quality. Player otomatis pilih quality terbaik berdasarkan koneksi.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ADAPTIVE BITRATE STREAMING                        │
│                                                                      │
│  Video: "Tutorial System Design" (10 menit = 600 detik)             │
│  Chunk duration: 4 detik                                            │
│  Total chunks: 600 / 4 = 150 chunks                                 │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Chunk 1 (0-4s):                                              │  │
│  │    ├── 144p_h264   (80 kbps)   → chunk_001_144p.ts           │  │
│  │    ├── 360p_h264   (400 kbps)  → chunk_001_360p.ts           │  │
│  │    ├── 480p_h264   (800 kbps)  → chunk_001_480p.ts           │  │
│  │    ├── 720p_h264   (1.5 Mbps)  → chunk_001_720p.ts           │  │
│  │    ├── 1080p_h264  (3 Mbps)    → chunk_001_1080p.ts          │  │
│  │    ├── 720p_vp9    (1 Mbps)    → chunk_001_720p_vp9.webm     │  │
│  │    └── 1080p_vp9   (2 Mbps)    → chunk_001_1080p_vp9.webm    │  │
│  │                                                               │  │
│  │  Chunk 2 (4-8s):                                              │  │
│  │    ├── 144p_h264   (80 kbps)   → chunk_002_144p.ts           │  │
│  │    ├── 360p_h264   (400 kbps)  → chunk_002_360p.ts           │  │
│  │    │   ... (same structure)                                   │  │
│  │                                                               │  │
│  │  ... (150 chunks total)                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  DASH Manifest (.mpd):                                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  <?xml version="1.0"?>                                        │  │
│  │  <MPD>                                                        │  │
│  │    <Period>                                                   │  │
│  │      <AdaptationSet mimeType="video/mp4">                     │  │
│  │        <Representation id="144p" bandwidth="80000"            │  │
│  │          width="256" height="144">                            │  │
│  │          <SegmentURL media="chunk_001_144p.ts"/>              │  │
│  │          <SegmentURL media="chunk_002_144p.ts"/>              │  │
│  │          ...                                                  │  │
│  │        </Representation>                                      │  │
│  │        <Representation id="720p" bandwidth="1500000"          │  │
│  │          width="1280" height="720">                           │  │
│  │          <SegmentURL media="chunk_001_720p.ts"/>              │  │
│  │          ...                                                  │  │
│  │        </Representation>                                      │  │
│  │      </AdaptationSet>                                         │  │
│  │    </Period>                                                  │  │
│  │  </MPD>                                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Player ABR Algorithm

```python
class ABRPlayer:
    """Client-side adaptive bitrate algorithm"""

    def __init__(self):
        self.buffer_health = 0  # seconds of buffered content
        self.throughput_history = []  # recent download speeds
        self.current_quality = "480p"
        self.target_buffer = 30  # target 30 seconds buffer

    def select_next_chunk_quality(self) -> str:
        """Decide quality for next chunk based on conditions"""
        estimated_throughput = self._estimate_throughput()

        # Buffer-based logic
        if self.buffer_health < 5:
            # Buffer almost empty → drop quality aggressively
            return self._get_lowest_quality()
        elif self.buffer_health < 15:
            # Buffer low → conservative quality
            return self._get_safe_quality(estimated_throughput * 0.7)
        elif self.buffer_health > 45:
            # Buffer healthy → can try higher quality
            return self._get_aggressive_quality(estimated_throughput * 1.1)
        else:
            # Normal → match throughput
            return self._get_matching_quality(estimated_throughput)

    def _estimate_throughput(self) -> float:
        """Estimate available bandwidth from recent downloads"""
        if not self.throughput_history:
            return 500_000  # default 500 kbps

        # Use harmonic mean (more conservative than arithmetic)
        recent = self.throughput_history[-10:]  # last 10 chunks
        return len(recent) / sum(1/t for t in recent)
```

### 4.4 DASH vs HLS Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASH vs HLS                                       │
├──────────────────┬──────────────────────┬───────────────────────────┤
│ Aspect           │ DASH (MPEG-DASH)     │ HLS (Apple)               │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Standard         │ ISO/IEC standard     │ Apple proprietary         │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Manifest Format  │ .mpd (XML)           │ .m3u8 (text)              │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Segment Format   │ .mp4, .webm, .ts     │ .ts (MPEG-TS), .fMP4     │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Codec Support    │ Any                  │ H.264/H.265 (Apple)       │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Browser Support  │ Most (via MSE)       │ Safari (native), others   │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ YouTube Use      │ Primary (web)        │ Primary (iOS/Safari)      │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Latency          │ 2-10 seconds         │ 2-10 seconds              │
│ (standard)       │                      │                           │
└──────────────────┴──────────────────────┴───────────────────────────┘
```

---

## 5. VIEW COUNTING SYSTEM

### 5.1 The View Count Problem

**Masalah:** View count harus akurat tapi juga real-time. 5 miliar views/hari = tidak bisa increment database setiap view.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VIEW COUNT CHALLENGES                             │
│                                                                      │
│  Requirement:                                                       │
│  • Tampilkan view count real-time (atau near real-time)             │
│  • Deduplicate views dari user yang sama                            │
│  • Anti-fraud: prevent bot views, refresh spam                      │
│  • Scale: handle 57,870 views/detik (rata-rata)                    │
│                                                                      │
│  Naive approach (TIDAK WORK):                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  UPDATE videos SET view_count = view_count + 1               │  │
│  │  WHERE id = 'video_abc';                                     │  │
│  │                                                              │  │
│  │  Problem:                                                    │  │
│  │  • Hot row: 57K updates/detik pada 1 row = DB bottleneck    │  │
│  │  • Lock contention: concurrent updates block each other     │  │
│  │  • No deduplication: refresh = new view                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 View Counting Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VIEW COUNTING SYSTEM                              │
│                                                                      │
│  Client:                                                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. User starts watching video                                │  │
│  │  2. After 30 seconds, send "view ping" ke server             │  │
│  │  3. Send ping setiap 10 detik selama masih watch             │  │
│  │  4. If user stops/pauses, stop sending pings                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  VIEW INGESTION SERVICE                                       │   │
│  │                                                              │   │
│  │  1. Validate ping (user agent, IP, session)                 │   │
│  │  2. Check deduplication (has this user watched recently?)   │   │
│  │  3. Check fraud signals (bot detection, velocity check)     │   │
│  │  4. If valid → publish to Kafka                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  KAFKA: "video.views" topic                                  │   │
│  │  {video_id, user_id, timestamp, watch_duration, ip, ua}     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│              ┌───────────────┼───────────────┐                      │
│              ▼               ▼               ▼                      │
│  ┌──────────────────┐┌──────────────┐┌──────────────┐              │
│  │ Redis Counter    ││ Analytics    ││ Fraud        │              │
│  │ (real-time)      ││ Pipeline     ││ Detection    │              │
│  │                  ││              ││              │              │
│  │ INCR video:views ││ Batch process││ ML model     │              │
│  │ :{video_id}      ││ → BigQuery   ││ → flag       │              │
│  │ TTL: 24 hours    ││              ││ suspicious   │              │
│  └────────┬─────────┘└──────────────┘└──────────────┘              │
│           │                                                         │
│           ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  AGGREGATION (every 5 minutes)                                │   │
│  │                                                              │   │
│  │  1. Read Redis counter for each video                       │   │
│  │  2. Apply fraud filter (remove flagged views)               │   │
│  │  3. Update database:                                        │   │
│  │     UPDATE videos SET view_count = view_count + delta       │   │
│  │  4. Reset Redis counter                                     │   │
│  │                                                              │   │
│  │  Result: DB only updated every 5 min, not per view!         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Deduplication Logic

```python
class ViewDeduplicator:
    VIEW_WINDOW = 86400  # 24 hours - same user = 1 view per day

    def __init__(self):
        self.redis = RedisCluster()

    def is_valid_view(self, video_id: str, user_id: str) -> bool:
        """Check if this view should be counted"""
        key = f"viewed:{video_id}:{user_id}"

        # Check if user already watched this video recently
        if self.redis.exists(key):
            return False  # Already counted today

        # Mark as viewed
        self.redis.set(key, "1", ex=self.VIEW_WINDOW)
        return True

    def is_fraud(self, video_id: str, user_id: str, ip: str,
                 user_agent: str) -> bool:
        """Detect fraudulent views"""
        # Velocity check: too many views from same IP
        ip_key = f"view_rate:{ip}"
        ip_count = self.redis.incr(ip_key)
        self.redis.expire(ip_key, 60)  # 1 minute window

        if ip_count > 100:  # More than 100 views/minute from same IP
            return True

        # User agent check: known bot signatures
        if self._is_bot_ua(user_agent):
            return True

        # Session check: no valid session token
        if not self._has_valid_session(user_id):
            return True

        return False
```

---

## 6. RECOMMENDATION SYSTEM

### 6.1 Recommendation Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RECOMMENDATION SYSTEM                             │
│                                                                      │
│  Goal: "What should the user watch next?"                           │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CANDIDATE GENERATION (retrieve ~1000 candidates)             │  │
│  │                                                              │  │
│  │  Sources:                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │ 1. Collaborative Filtering:                             │ │  │
│  │  │    "Users who watched X also watched Y"                 │ │  │
│  │  │    → Matrix factorization, item-to-item similarity      │ │  │
│  │  ├─────────────────────────────────────────────────────────┤ │  │
│  │  │ 2. Content-Based:                                       │ │  │
│  │  │    "Videos similar to what you watched"                 │ │  │
│  │  │    → Tags, categories, title similarity, embeddings     │ │  │
│  │  ├─────────────────────────────────────────────────────────┤ │  │
│  │  │ 3. Trending/Popular:                                    │ │  │
│  │  │    "What's trending right now"                          │ │  │
│  │  │    → Global/regional trending videos                    │ │  │
│  │  ├─────────────────────────────────────────────────────────┤ │  │
│  │  │ 4. Subscription:                                        │ │  │
│  │  │    "New videos from channels you subscribe to"          │ │  │
│  │  │    → Recent uploads from subscribed channels            │ │  │
│  │  ├─────────────────────────────────────────────────────────┤ │  │
│  │  │ 5. Watch History:                                       │ │  │
│  │  │    "Continue watching" / "Because you watched X"        │ │  │
│  │  │    → Recently watched, partially watched                │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  RANKING (score and rank ~1000 candidates)                   │   │
│  │                                                              │   │
│  │  Deep Neural Network (YouTube DNN):                          │   │
│  │  ┌───────────────────────────────────────────────────────┐  │   │
│  │  │  Input Features:                                      │  │   │
│  │  │  • User features: age, location, language, device     │  │   │
│  │  │  • Video features: category, duration, quality, tags  │  │   │
│  │  │  • Context: time of day, session length, position     │  │   │
│  │  │  • Interaction: watch history, search history         │  │   │
│  │  │                                                       │  │   │
│  │  │  Output: P(watch | user, video, context)              │  │   │
│  │  │                                                       │  │   │
│  │  │  Model: Multi-layer DNN with embedding layers         │  │   │
│  │  │  Training: Billions of watch events                   │  │   │
│  │  │  Update: Continuous (online learning)                 │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  RE-RANKING (apply business rules)                           │   │
│  │                                                              │   │
│  │  • Diversity: Don't show 10 videos from same channel        │   │
│  │  • Freshness: Boost new videos                              │   │
│  │  • Fairness: Ensure creator diversity                       │   │
│  │  • Safety: Filter age-inappropriate content                 │   │
│  │  • A/B Testing: Experiment with ranking weights             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  Return top 20-50 recommended videos to user                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Collaborative Filtering

```python
class CollaborativeFiltering:
    def __init__(self):
        # User-Video interaction matrix
        # Rows: users, Columns: videos, Values: watch time
        self.interaction_matrix = None
        self.user_embeddings = None
        self.video_embeddings = None

    def train(self, interactions: List[UserVideoInteraction]):
        """Train matrix factorization model"""
        # Build sparse matrix
        matrix = self._build_matrix(interactions)

        # Matrix factorization (ALS - Alternating Least Squares)
        self.user_embeddings, self.video_embeddings = als_matrix_factorization(
            matrix,
            n_factors=128,  # embedding dimension
            n_iterations=20,
            regularization=0.1
        )

    def get_similar_videos(self, video_id: str, top_k: int = 20) -> List[str]:
        """Find videos similar to given video"""
        video_embedding = self.video_embeddings[video_id]

        # Cosine similarity with all videos
        similarities = cosine_similarity(
            video_embedding.reshape(1, -1),
            self.video_embeddings
        )

        # Return top K most similar
        top_indices = similarities.argsort()[0][-top_k:][::-1]
        return [self.video_id_map[i] for i in top_indices]

    def recommend_for_user(self, user_id: str, top_k: int = 50) -> List[str]:
        """Recommend videos for a user"""
        user_embedding = self.user_embeddings[user_id]

        # Score all videos
        scores = self.video_embeddings @ user_embedding

        # Filter already watched
        watched = self._get_watched_videos(user_id)
        scores[watched] = -np.inf  # Exclude watched

        # Return top K
        top_indices = scores.argsort()[-top_k:][::-1]
        return [self.video_id_map[i] for i in top_indices]
```

---

## 7. COMMENT SYSTEM

### 7.1 Nested Comment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NESTED COMMENT SYSTEM                             │
│                                                                      │
│  Comment Structure:                                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Video: "System Design Tutorial"                              │  │
│  │                                                              │  │
│  │  ├── [User A] "Great video! Very helpful." (1.2K likes)      │  │
│  │  │   └── [User B] "Agree, especially the CDN section" (45)   │  │
│  │  │       └── [User A] "Thanks! More coming soon" (12)        │  │
│  │  │   └── [User C] "Can you make one about Netflix?" (89)     │  │
│  │  │       └── [Creator] "Already in progress! Stay tuned"     │  │
│  │  │           └── [User C] "Can't wait!" (5)                  │  │
│  │  ├── [User D] "Timestamp please?" (234 likes)                │  │
│  │  │   └── [User E] "0:00 Intro, 2:30 CDN, 5:00 Database"      │  │
│  │  └── [User F] "Subscribed! 🔔" (567 likes)                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Database Schema:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  comments table:                                              │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐ │  │
│  │  │ comment_ │ video_id │ parent_  │ user_id  │ text         │ │  │
│  │  │ id       │          │ id       │          │              │ │  │
│  │  ├──────────┼──────────┼──────────┼──────────┼──────────────┤ │  │
│  │  │ c1       │ v1       │ NULL     │ u1       │ "Great..."   │ │  │
│  │  │ c2       │ v1       │ c1       │ u2       │ "Agree..."   │ │  │
│  │  │ c3       │ v1       │ c2       │ u1       │ "Thanks..."  │ │  │
│  │  │ c4       │ v1       │ c1       │ u3       │ "Can you..." │ │  │
│  │  │ c5       │ v1       │ NULL     │ u4       │ "Timestamp"  │ │  │
│  │  └──────────┴──────────┴──────────┴──────────┴──────────────┘ │  │
│  │                                                              │  │
│  │  Query top-level comments:                                    │  │
│  │  SELECT * FROM comments                                     │  │
│  │  WHERE video_id = 'v1' AND parent_id IS NULL                │  │
│  │  ORDER BY like_count DESC                                   │  │
│  │  LIMIT 20;                                                  │  │
│  │                                                              │  │
│  │  Query replies:                                             │  │
│  │  SELECT * FROM comments                                     │  │
│  │  WHERE parent_id = 'c1'                                     │  │
│  │  ORDER BY like_count DESC                                   │  │
│  │  LIMIT 10;                                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Comment Moderation

```python
class CommentModeration:
    def __init__(self):
        self.toxicity_model = self._load_toxicity_model()
        self.spam_model = self._load_spam_model()

    def moderate(self, comment: Comment) -> ModerationResult:
        """Auto-moderate comment before publishing"""
        # 1. Toxicity check
        toxicity_score = self.toxicity_model.predict(comment.text)
        if toxicity_score > 0.9:
            return ModerationResult(
                status="blocked",
                reason="high_toxicity",
                score=toxicity_score
            )

        # 2. Spam check
        spam_score = self.spam_model.predict({
            "text": comment.text,
            "user_history": self._get_user_comment_history(comment.user_id),
            "velocity": self._get_user_comment_velocity(comment.user_id)
        })
        if spam_score > 0.8:
            return ModerationResult(
                status="held_for_review",
                reason="suspected_spam",
                score=spam_score
            )

        # 3. Profanity filter
        if self._contains_profanity(comment.text):
            return ModerationResult(
                status="filtered",
                reason="profanity",
                filtered_text=self._censor_profanity(comment.text)
            )

        # 4. Link check
        if self._contains_links(comment.text):
            return ModerationResult(
                status="held_for_review",
                reason="contains_links"
            )

        return ModerationResult(status="approved")
```

---

## 8. LIVE STREAMING

### 8.1 Live Streaming Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LIVE STREAMING PIPELINE                           │
│                                                                      │
│  Streamer (OBS/Streamlabs):                                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Capture screen/camera                                     │  │
│  │  2. Encode to RTMP (H.264 + AAC)                             │  │
│  │  3. Send RTMP stream to ingest server                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼ (RTMP)                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  RTMP INGEST SERVER                                          │   │
│  │  • Receive RTMP stream from streamer                         │   │
│  │  • Validate stream key                                       │   │
│  │  • Forward to transcoder                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  REAL-TIME TRANSCODER                                        │   │
│  │  • Transcode to multiple qualities (720p, 480p, 360p)       │   │
│  │  • Generate chunks (HLS/DASH) in real-time                  │   │
│  │  • Latency target: 2-5 seconds from capture to viewer       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  LIVE CDN                                                    │   │
│  │  • Distribute chunks to edge servers                         │   │
│  │  • Only cache the latest N chunks (sliding window)          │   │
│  │  • Viewers fetch chunks from nearest edge                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              ▼                                       │
│  Viewers:                                                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  1. Load live stream page                                    │   │
│  │  2. Fetch manifest (updated every chunk)                    │   │
│  │  3. Download chunks sequentially                             │   │
│  │  4. Play with 2-5 second delay from live                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Low-Latency Live Streaming

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LOW-LATENCY LIVE STREAMING                        │
│                                                                      │
│  Standard HLS Latency: 15-30 seconds (too slow for interactive)     │
│  Low-Latency HLS (LL-HLS): 2-5 seconds                             │
│                                                                      │
│  Techniques:                                                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 1. Shorter chunks: 1 second instead of 4-6 seconds           │  │
│  │ 2. Chunked transfer: start sending chunk before it's done    │  │
│  │ 3. Preload hints: tell player what chunks are coming next    │  │
│  │ 4. Blocking playlist reload: wait for new chunk before       │  │
│  │    responding to manifest request                            │  │
│  │ 5. HTTP/2 or HTTP/3: multiplexed connections                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  LL-HLS Manifest Example:                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  #EXTM3U                                                     │  │
│  │  #EXT-X-TARGETDURATION:4                                     │  │
│  │  #EXT-X-SERVER-CONTROL:CAN-BLOCK-RELOAD=YES                  │  │
│  │  #EXT-X-PART-INF:PART-TARGET=1.0                             │  │
│  │                                                              │  │
│  │  #EXTINF:4.0                                                 │  │
│  │  chunk_001.ts                                                │  │
│  │  #EXTINF:4.0                                                 │  │
│  │  chunk_002.ts                                                │  │
│  │  #EXT-X-PART:DURATION=1.0,URI="chunk_003_part1.ts"           │  │
│  │  #EXT-X-PART:DURATION=1.0,URI="chunk_003_part2.ts"           │  │
│  │  #EXT-X-PRELOAD-HINT:TYPE=PART,URI="chunk_003_part3.ts"      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

# BAGIAN B: NETFLIX ARCHITECTURE

---

## 9. OPEN CONNECT CDN

### 9.1 What is Open Connect?

Netflix membangun CDN sendiri bernama **Open Connect** — bukan pakai CDN komersial seperti Akamai atau CloudFlare.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NETFLIX OPEN CONNECT CDN                          │
│                                                                      │
│  Kenapa build CDN sendiri?                                          │
│  • 75%+ internet traffic malam hari = Netflix                      │
│  • CDN komersial terlalu mahal untuk volume ini                    │
│  • Kontrol penuh atas quality of experience                        │
│  • Optimasi khusus untuk video streaming                           │
│                                                                      │
│  Open Connect Appliances (OCA):                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  • Custom server hardware (FreeBSD-based)                     │  │
│  │  • 288 TB storage per appliance                               │  │
│  │  • 100 Gbps network interface                                 │  │
│  │  • Ditempatkan DI dalam ISP (Internet Service Provider)       │  │
│  │  • 10,000+ appliances di 1,000+ lokasi global                │  │
│  │  • Mendukung 200+ juta subscribers                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Placement Strategy:                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Tier 1: ISP PoP (Point of Presence)                          │  │
│  │  → Di dalam data center ISP, handle 80% traffic              │  │
│  │                                                              │  │
│  │  Tier 2: Internet Exchange Points (IXP)                       │  │
│  │  → Di IXP, handle 15% traffic                                │  │
│  │                                                              │  │
│  │  Tier 3: AWS (fallback)                                       │  │
│  │  → Untuk content yang tidak ada di OCA, fallback ke AWS      │  │
│  │  → Handle 5% traffic (long-tail content)                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Content Placement Algorithm:                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  1. Predict demand per region (ML model)                      │  │
│  │  2. Pre-position popular content ke OCA terdekat              │  │
│  │  3. Update content placement setiap hari                      │  │
│  │  4. New releases → pushed ke ALL OCA sebelum launch          │  │
│  │  5. Long-tail content → hanya di regional OCA                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 ISP Peering

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ISP PEERING STRATEGY                              │
│                                                                      │
│  Netflix → ISP → User                                               │
│                                                                      │
│  Tanpa Open Connect:                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Netflix AWS → Internet → ISP → User                          │  │
│  │  (mahal, latency tinggi, congestion risk)                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Dengan Open Connect:                                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Netflix OCA (di dalam ISP) → User                            │  │
│  │  (gratis untuk ISP, latency rendah, no congestion)            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Win-Win:                                                           │
│  • Netflix: hemat bandwidth cost, kontrol QoS                      │
│  • ISP: hemat transit cost, user dapat pengalaman lebih baik       │
│  • User: streaming lebih cepat, buffer lebih sedikit               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. MICROSERVICES ARCHITECTURE

### 10.1 Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NETFLIX MICROSERVICES                             │
│                                                                      │
│  1,000+ microservices, 2,000+ engineers                             │
│  Tech stack: Java, Spring Boot, Node.js, Python                     │
│  Infrastructure: AWS (EC2, S3, DynamoDB, etc.)                     │
│                                                                      │
│  Service Categories:                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  User-Facing Services:                                        │  │
│  │  • API Gateway (Zuul)                                         │  │
│  │  • UI Backend (web, mobile, TV apps)                          │  │
│  │  • Search Service                                             │  │
│  │  • Recommendation Service                                     │  │
│  │  • Playback Service                                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Content Services:                                            │  │
│  │  • Content Metadata Service                                   │  │
│  │  • Encoding/Transcoding Service                               │  │
│  │  • Content Ingestion Service                                  │  │
│  │  • Rights Management Service                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Billing & Account:                                           │  │
│  │  • Subscription Service                                       │  │
│  │  • Payment Service                                            │  │
│  │  • Billing Service                                            │  │
│  │  • Entitlement Service                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Platform Services:                                           │  │
│  │  • Service Discovery (Eureka)                                 │  │
│  │  • Configuration Service                                      │  │
│  │  • Monitoring (Atlas)                                         │  │
│  │  • Logging (Mantis)                                           │  │
│  │  • CI/CD (Spinnaker)                                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 API Gateway (Zuul)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (ZUUL)                                │
│                                                                      │
│  Client (Web/Mobile/TV)                                             │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ZUUL API GATEWAY                                            │   │
│  │                                                              │   │
│  │  Responsibilities:                                          │   │
│  │  ┌────────────────────────────────────────────────────────┐ │   │
│  │  │ 1. Routing: Forward request to correct microservice    │ │   │
│  │  │ 2. Authentication: Validate JWT tokens                 │ │   │
│  │  │ 3. Rate Limiting: Prevent abuse                        │ │   │
│  │  │ 4. Load Balancing: distribute across service instances │ │   │
│  │  │ 5. Circuit Breaking: handle service failures           │ │   │
│  │  │ 6. Request/Response transformation                     │ │   │
│  │  │ 7. A/B Testing: route to different service versions    │ │   │
│  │  │ 8. Metrics: collect request metrics                    │ │   │
│  │  └────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
│       │                                                              │
│       ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              MICROSERVICES (1,000+)                          │   │
│  │                                                              │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │ Playback │ │ Search   │ │Recommend │ │ Billing  │       │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │  ...  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.3 Service Discovery (Eureka)

```python
# Netflix Eureka - Service Discovery
# Services register themselves and discover other services dynamically

class ServiceRegistry:
    """Eureka-like service registry"""

    def register(self, service_name: str, instance_id: str,
                 host: str, port: int, metadata: dict):
        """Service registers itself on startup"""
        self.instances[service_name][instance_id] = {
            "host": host,
            "port": port,
            "status": "UP",
            "metadata": metadata,
            "last_heartbeat": time.time()
        }

    def deregister(self, service_name: str, instance_id: str):
        """Service deregisters on shutdown"""
        self.instances[service_name].pop(instance_id, None)

    def heartbeat(self, service_name: str, instance_id: str):
        """Service sends heartbeat every 30 seconds"""
        if instance_id in self.instances.get(service_name, {}):
            self.instances[service_name][instance_id]["last_heartbeat"] = time.time()

    def discover(self, service_name: str) -> List[ServiceInstance]:
        """Client discovers available instances of a service"""
        instances = self.instances.get(service_name, {})

        # Filter healthy instances
        healthy = [
            ServiceInstance(**data)
            for iid, data in instances.items()
            if data["status"] == "UP" and
               time.time() - data["last_heartbeat"] < 90  # 3 missed heartbeats = down
        ]

        return healthy
```

### 10.4 Circuit Breaker (Hystrix)

```python
class HystrixCircuitBreaker:
    """Netflix Hystrix - Circuit Breaker Pattern"""

    def __init__(self, service_name: str,
                 failure_threshold: int = 5,
                 recovery_timeout: int = 30000,
                 window_size: int = 10000):
        self.service_name = service_name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.window_size = window_size
        self.state = "CLOSED"
        self.failure_count = 0
        self.last_failure_time = 0

    def execute(self, func, fallback=None):
        """Execute with circuit breaker protection"""
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                if fallback:
                    return fallback()
                raise CircuitOpenError(f"Service {self.service_name} is down")

        try:
            result = func()
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            if fallback:
                return fallback()
            raise

    def on_success(self):
        self.failure_count = max(0, self.failure_count - 1)
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"

    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
```

---

## 11. RECOMMENDATION ENGINE

### 11.1 Netflix Recommendation Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NETFLIX RECOMMENDATION                            │
│                                                                      │
│  "Because you watched..." — Personalization is Netflix's moat       │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PERSONALIZATION LAYERS                                       │  │
│  │                                                              │  │
│  │  1. ROW SELECTION: Which rows to show?                       │  │
│  │     • "Trending Now"                                         │  │
│  │     • "Because you watched Stranger Things"                   │  │
│  │     • "Top Picks for You"                                    │  │
│  │     • "Continue Watching"                                    │  │
│  │     • "New Releases"                                         │  │
│  │                                                              │  │
│  │  2. ROW ORDERING: Which row first?                           │  │
│  │     • Based on predicted engagement per row type             │  │
│  │     • ML model predicts which row type user will interact    │  │
│  │                                                              │  │
│  │  3. ITEM RANKING: Which items in each row?                   │  │
│  │     • Score each candidate item                              │  │
│  │     • Sort by predicted watch probability                    │  │
│  │                                                              │  │
│  │  4. ARTWORK SELECTION: Which thumbnail?                      │  │
│  │     • Different users see different artwork for same title   │  │
│  │     • ML picks artwork most likely to get user to click      │  │
│  │     • Example:                                              │  │
│  │       - User suka romance → thumbnail dengan couple         │  │
│  │       - User suka action → thumbnail dengan explosion       │  │
│  │       - User suka comedy → thumbnail dengan funny face      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.2 A/B Testing Platform

```
┌─────────────────────────────────────────────────────────────────────┐
│                    A/B TESTING PLATFORM                              │
│                                                                      │
│  Netflix runs 1,000+ A/B tests simultaneously                       │
│                                                                      │
│  Test Example: Recommendation Algorithm V2 vs V1                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Control Group (50%):                                         │  │
│  │  → Current recommendation algorithm                           │  │
│  │                                                              │  │
│  │  Treatment Group (50%):                                       │  │
│  │  → New recommendation algorithm                               │  │
│  │                                                              │  │
│  │  Metrics tracked:                                            │  │
│  │  • Watch time per session                                    │  │
│  │  • Time to first play                                        │  │
│  │  • Completion rate                                           │  │
│  │  • Retention (7-day, 30-day)                                 │  │
│  │  • Churn rate                                                │  │
│  │                                                              │  │
│  │  Statistical significance:                                    │  │
│  │  • Run test until p-value < 0.05                             │  │
│  │  • Minimum sample size: 1M users per group                   │  │
│  │  • Minimum duration: 2 weeks                                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Platform:                                                          │
│  • Experimentation framework internal                               │
│  • Automatic traffic splitting                                      │
│  • Real-time metric dashboard                                       │
│  • Statistical analysis automation                                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. CHAOS ENGINEERING

### 12.1 Chaos Monkey & Family

Netflix pionir dalam **Chaos Engineering** — sengaja merusak production untuk test resilience.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHAOS ENGINEERING AT NETFLIX                      │
│                                                                      │
│  Philosophy: "If you haven't tested failure, you haven't tested"    │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CHAOS MONKEY                                                 │  │
│  │  • Randomly TERMINATES EC2 instances in production            │  │
│  │  • Forces services to be resilient to instance failure        │  │
│  │  • Runs during business hours (weekdays 9am-3pm)             │  │
│  │  • Configurable: probability, affected groups, time windows  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CHAOS GORILLA                                                │  │
│  │  • Takes down entire AVAILABILITY ZONE                        │  │
│  │  • Tests multi-AZ failover                                    │  │
│  │  • Simulates: AZ outage, network partition                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CHAOS KING KONG                                              │  │
│  │  • Takes down entire AWS REGION                               │  │
│  │  • Tests cross-region failover                                │  │
│  │  • Simulates: Complete region outage                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  LATENCY MONKEY                                               │  │
│  │  • Injects artificial LATENCY into service calls              │  │
│  │  • Tests timeout handling, circuit breakers                   │  │
│  │  • Simulates: Slow network, overloaded services               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  JANITOR MONKEY                                               │  │
│  │  • Finds and cleans up unused resources                       │  │
│  │  • Prevents resource waste                                    │  │
│  │  • Simulates: Resource cleanup automation                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  SECURITY MONKEY                                              │  │
│  │  • Finds security vulnerabilities                             │  │
│  │  • Terminates instances with security issues                  │  │
│  │  • Simulates: Security audit automation                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 12.2 Chaos Engineering Principles

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHAOS ENGINEERING PRINCIPLES                      │
│                                                                      │
│  1. Define Steady State:                                            │
│     • What does "normal" look like?                                 │
│     • Metrics: error rate, latency, throughput                      │
│                                                                      │
│  2. Hypothesize:                                                    │
│     • "If instance X dies, service Y should still work"             │
│     • "If AZ us-east-1 goes down, traffic should failover"          │
│                                                                      │
│  3. Experiment:                                                     │
│     • Inject failure (kill instance, add latency, drop packets)     │
│     • Observe system behavior                                       │
│                                                                      │
│  4. Verify:                                                         │
│     • Did steady state hold?                                        │
│     • Did automatic recovery work?                                  │
│     • Were alerts triggered correctly?                              │
│                                                                      │
│  5. Learn & Improve:                                                │
│     • Fix any issues found                                          │
│     • Update runbooks                                               │
│     • Add more chaos tests                                          │
│                                                                      │
│  Blast Radius Control:                                              │
│  • Start small (single instance) → expand (AZ → region)            │
│  • Automated rollback if metrics degrade beyond threshold           │
│  • Run during business hours when engineers are available           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 13. DATA PLATFORM

### 13.1 Netflix Data Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    NETFLIX DATA PLATFORM                             │
│                                                                      │
│  Volume: Petabytes of data processed daily                          │
│  Events: Trillions of events per day                                │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  DATA INGESTION                                               │  │
│  │                                                              │  │
│  │  Sources:                                                    │  │
│  │  • User interactions (play, pause, search, browse)           │  │
│  │  • Playback events (buffering, quality changes, errors)      │  │
│  │  • Device telemetry (startup time, crash reports)            │  │
│  │  • Content metadata (title, genre, cast, artwork)            │  │
│  │  • Business data (subscriptions, payments, regions)          │  │
│  │                                                              │  │
│  │  Pipeline:                                                   │  │
│  │  Client → Kafka → Mantis (stream processing) → Data Lake    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  DATA LAKE (S3)                                               │  │
│  │                                                              │  │
│  │  Structure:                                                  │  │
│  │  s3://netflix-data/                                          │  │
│  │    ├── raw/           (immutable, original events)           │  │
│  │    ├── processed/     (cleaned, transformed)                 │  │
│  │    ├── curated/       (business-ready datasets)              │  │
│  │    └── ml/            (features for ML models)               │  │
│  │                                                              │  │
│  │  Format: Apache Parquet (columnar, compressed)               │  │
│  │  Partitioning: by date, region, event_type                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PROCESSING ENGINES                                           │  │
│  │                                                              │  │
│  │  Batch Processing:                                           │  │
│  │  • Apache Spark (ETL, ML training)                           │  │
│  │  • Presto/Trino (interactive SQL queries)                    │  │
│  │                                                              │  │
│  │  Stream Processing:                                          │  │
│  │  • Apache Flink (real-time analytics)                        │  │
│  │  • Mantis (Netflix internal, reactive stream processing)     │  │
│  │                                                              │  │
│  │  ML Pipeline:                                                │  │
│  │  • Metaflow (Netflix ML workflow framework)                  │  │
│  │  • Feature store (reusable ML features)                      │  │
│  │  • Model registry (versioned ML models)                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  REAL-TIME ANALYTICS                                          │  │
│  │                                                              │  │
│  │  Use Cases:                                                  │  │
│  │  • Real-time view count                                      │  │
│  │  • Trending content detection                                │  │
│  │  • Anomaly detection (outages, fraud)                        │  │
│  │  • Live A/B test monitoring                                  │  │
│  │                                                              │  │
│  │  Stack:                                                      │  │
│  │  • Druid (real-time OLAP)                                    │  │
│  │  • Atlas (metrics & monitoring)                              │  │
│  │  • Grafana (dashboards)                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 Metaflow — ML Workflow Framework

```python
"""
Netflix Metaflow example — ML pipeline for recommendation model
"""
from metaflow import FlowSpec, step, Parameter, card

class RecommendationModelTraining(FlowSpec):
    # Parameters
    model_type = Parameter('model-type', default='dnn')
    training_days = Parameter('training-days', default=30)
    learning_rate = Parameter('learning-rate', default=0.001)

    @step
    def start(self):
        """Start the flow"""
        print(f"Training {self.model_type} model")
        print(f"Using {self.training_days} days of data")
        self.next(self.load_data)

    @step
    def load_data(self):
        """Load training data from data lake"""
        # Load from S3
        self.train_data = self._load_from_s3(
            f"s3://netflix-data/ml/features/"
            f"date_range={self.training_days}d/"
        )
        self.train_labels = self._load_labels(
            f"s3://netflix-data/ml/labels/"
            f"date_range={self.training_days}d/"
        )
        print(f"Loaded {len(self.train_data)} training samples")
        self.next(self.preprocess)

    @step
    def preprocess(self):
        """Preprocess data: normalization, feature engineering"""
        # Feature normalization
        self.scaler = StandardScaler()
        self.X_train = self.scaler.fit_transform(self.train_data)

        # Train/test split
        self.X_train, self.X_val, self.y_train, self.y_val = \
            train_test_split(self.X_train, self.train_labels, test_size=0.2)

        print(f"Train: {len(self.X_train)}, Val: {len(self.X_val)}")
        self.next(self.train_model)

    @step
    def train_model(self):
        """Train the recommendation model"""
        if self.model_type == 'dnn':
            self.model = self._train_dnn(
                self.X_train, self.y_train,
                learning_rate=self.learning_rate
            )
        elif self.model_type == 'matrix_factorization':
            self.model = self._train_mf(
                self.X_train, self.y_train
            )

        self.next(self.evaluate)

    @step
    def evaluate(self):
        """Evaluate model on validation set"""
        predictions = self.model.predict(self.X_val)

        self.metrics = {
            'auc': roc_auc_score(self.y_val, predictions),
            'ndcg': self._calculate_ndcg(self.y_val, predictions),
            'precision_at_10': self._precision_at_k(self.y_val, predictions, 10)
        }

        print(f"AUC: {self.metrics['auc']:.4f}")
        print(f"NDCG: {self.metrics['ndcg']:.4f}")
        self.next(self.end)

    @step
    def end(self):
        """Save model and register"""
        # Save model to registry
        model_version = self._register_model(
            self.model,
            self.model_type,
            self.metrics
        )
        print(f"Model registered: v{model_version}")


if __name__ == '__main__':
    RecommendationModelTraining()
```

---

## 📊 YOUTUBE vs NETFLIX COMPARISON

```
┌─────────────────────────────────────────────────────────────────────┐
│                    YOUTUBE vs NETFLIX                                │
├──────────────────┬──────────────────────┬───────────────────────────┤
│ Aspect           │ YouTube              │ Netflix                   │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Content Model    │ User-generated (UGC) │ Licensed + Original       │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Upload Volume    │ 500 hours/minute     │ ~100 titles/month         │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Video Count      │ 800M+ videos         │ ~15,000 titles            │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ CDN              │ Google Global Cache  │ Open Connect (custom)     │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Transcoding      │ On upload            │ Pre-transcoded            │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Streaming        │ DASH (web), HLS      │ DASH                      │
│                  │ (iOS)                │                           │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Live Streaming   │ Yes (major feature)  │ No (not core business)    │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Comments         │ Yes (core feature)   │ No                        │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Revenue Model    │ Ads + Premium        │ Subscription only         │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Recommendation   │ Watch time opt.      │ Engagement opt.           │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Infrastructure   │ Google Cloud         │ AWS                       │
├──────────────────┼──────────────────────┼───────────────────────────┤
│ Microservices    │ Yes (Borg/K8s)       │ Yes (1,000+ services)     │
└──────────────────┴──────────────────────┴───────────────────────────┘
```

---

## 📚 REFERENSI

- [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer)
- [YouTube Architecture - High Scalability](http://highscalability.com/youtube-architecture)
- [Netflix Tech Blog](https://netflixtechblog.com/)
- [Netflix Open Connect](https://openconnect.netflix.com/)
- [Netflix Chaos Engineering](https://netflix.github.io/chaosmonkey/)
- [YouTube DNN Recommendation Paper](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf)
- [Netflix Metaflow](https://metaflow.org/)
- [InfoQ: Netflix Microservices](https://www.infoq.com/articles/netflix-microservices)

---

## ✅ CHECKLIST PEMAHAMAN

### YouTube
- [ ] Bisa menjelaskan chunked upload + resume mechanism
- [ ] Paham mengapa transcoding perlu multiple resolutions + codecs
- [ ] Bisa menjelaskan adaptive bitrate streaming (DASH/HLS)
- [ ] Paham view counting architecture (Redis + Kafka + batch update)
- [ ] Bisa menjelaskan recommendation system (collaborative filtering + DNN)
- [ ] Paham live streaming pipeline (RTMP → transcode → CDN)
- [ ] Bisa menjelaskan nested comment system

### Netflix
- [ ] Paham Open Connect CDN dan kenapa Netflix build sendiri
- [ ] Bisa menjelaskan microservices architecture (1,000+ services)
- [ ] Paham Chaos Monkey dan chaos engineering principles
- [ ] Bisa menjelaskan recommendation engine (personalization layers)
- [ ] Paham data platform (S3 data lake, Spark, Druid)
- [ ] Bisa menjelaskan A/B testing platform
- [ ] Paham circuit breaker pattern (Hystrix)

---

> **Lanjut ke:** [`10-arsitektur-aws-scaling.md`](./10-arsitektur-aws-scaling.md)