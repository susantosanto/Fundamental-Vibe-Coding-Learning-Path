# B2: Refactoring & Testing dengan AI — Panduan Lengkap

> **Identifikasi code smell, refactor aman, generate test, modernisasi legacy code**

**Estimasi**: 30 menit belajar + 50 menit praktik | **Level**: Intermediate-Advanced

---

## 🎯 Outcome Pembelajaran

Setelah menyelesaikan modul ini, Anda akan mampu:

- **Mengidentifikasi code smell** dengan AI — long methods, large classes, duplicated code, magic numbers, god objects
- **Menerapkan safe refactoring patterns** — extract method, rename, move method, replace conditional with polymorphism
- **Menulis test sebelum refactoring** — verify behavior preserved, regression prevention
- **Melakukan incremental refactoring** — small steps, commit frequently, verify at each step
- **Memodernisasi legacy code** — adding tests, dependency injection, breaking circular dependencies
- **Menerapkan SOLID principles** — setiap prinsip dengan contoh before/after
- **Melakukan database refactoring** — schema migration, data migration, backward compatibility
- **Melakukan API refactoring** — versioning, deprecation strategy, backward-compatible changes
- **Menggunakan refactoring checklist** — pre-refactoring, during, post-refactoring
- **Merefaktor aplikasi administrasi sekolah** — real-world scenario lengkap

---

## 🔑 Konsep Inti

### Filosofi Refactoring dengan AI

```
Manual:     Baca kode → Pahami → Tulis ulang → Test manual → Hope it works
AI-Assisted: AI identifikasi smell → AI suggest pattern → AI generate test → AI refactor → Verify
```

### Refactoring ≠ Rewriting

| Refactoring | Rewriting |
|-------------|-----------|
| Ubah struktur internal, behavior tetap | Tulis ulang dari nol |
| Small steps, verify setiap langkah | Big bang, test di akhir |
| Low risk | High risk |
| Behavior preserved | Behavior mungkin berubah |
| Commit sering | Satu commit besar |

### Prinsip Utama

1. **Test First** — Jangan refactor tanpa test pelindung
2. **Small Steps** — Satu perubahan per commit, verify sebelum lanjut
3. **Behavior Preserved** — Output harus sama sebelum dan sesudah
4. **AI sebagai Assistant** — AI suggest dan generate, human review dan approve
5. **Document Why** — Commit message harus jelaskan ALASAN refactor, bukan APA yang diubah

---

## 📋 Masalah yang Diselesaikan

| Masalah | Sebelum AI | Setelah AI |
|---------|------------|------------|
| Kode berantakan tapi takut diubah | Leave it broken, technical debt menumpuk | AI identifikasi smell, suggest safe steps |
| Tidak ada test untuk legacy code | Refactor = gambling | AI generate test suite dulu |
| Refactor bikin bug baru | Debug berhari-hari | Test suite catch regression instant |
| Sulit identifikasi code smell | Code review manual, bias | AI scan otomatis, comprehensive |
| Refactor terlalu besar | Merge conflict, broken main | Incremental, small PRs, safe |
| SOLID principles teori doang | Tidak tahu cara apply | AI show before/after konkret |
| Database migration takut data hilang | Manual migration, risky | AI generate migration script + rollback |
| API breaking changes | Client broken, complaint | AI suggest versioning + deprecation plan |

---

## 📖 Bagian 1: Code Smell Identification

### 1.1 Jenis-Jenis Code Smell

#### Long Method (Fungsi Terlalu Panjang)
```typescript
// ❌ BAD: Fungsi 80 baris, terlalu banyak tanggung jawab
function processStudentData(rawData: any[]) {
    // Validasi input (15 baris)
    if (!rawData || rawData.length === 0) {
        throw new Error("Data kosong");
    }
    const validated: any[] = [];
    for (const row of rawData) {
        if (!row.nisn || !row.nama) {
            console.warn(`Baris tidak valid: ${JSON.stringify(row)}`);
            continue;
        }
        if (row.nisn.length !== 10) {
            console.warn(`NISN tidak 10 digit: ${row.nisn}`);
            continue;
        }
        validated.push(row);
    }
    
    // Transformasi data (25 baris)
    const transformed = validated.map(row => {
        const nama = row.nama.trim().toLowerCase();
        const capitalized = nama.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const ttl = row.tanggalLahir ? new Date(row.tanggalLahir) : null;
        const formattedTTL = ttl ? `${ttl.getDate()}/${ttl.getMonth() + 1}/${ttl.getFullYear()}` : '';
        const jenisKelamin = row.jenisKelamin === 'L' ? 'Laki-laki' : row.jenisKelamin === 'P' ? 'Perempuan' : 'Unknown';
        const kelas = row.kelas ? row.kelas.toUpperCase() : 'Unassigned';
        return {
            nisn: row.nisn,
            nama: capitalized,
            ttl: formattedTTL,
            jenisKelamin,
            kelas,
            alamat: row.alamat || '-',
            namaAyah: row.namaAyah || '-',
            namaIbu: row.namaIbu || '-',
        };
    });
    
    // Sorting dan deduplikasi (20 baris)
    transformed.sort((a, b) => a.nama.localeCompare(b.nama));
    const unique: any[] = [];
    const seen = new Set<string>();
    for (const student of transformed) {
        if (!seen.has(student.nisn)) {
            seen.add(student.nisn);
            unique.push(student);
        }
    }
    
    // Generate report (20 baris)
    const report = {
        totalInput: rawData.length,
        validCount: validated.length,
        invalidCount: rawData.length - validated.length,
        uniqueCount: unique.length,
        duplicateCount: validated.length - unique.length,
        students: unique,
        generatedAt: new Date().toISOString(),
    };
    
    console.log(`Processing complete: ${report.uniqueCount} students`);
    return report;
}
```

#### Large Class (Kelas Terlalu Besar)
```typescript
// ❌ BAD: God class yang melakukan semuanya
class SchoolAdminSystem {
    // 50+ methods: student CRUD, teacher CRUD, finance, reports,
    // email notifications, file uploads, authentication, logging, etc.
    // Responsibility: 15+ different concerns
}
```

#### Duplicated Code
```typescript
// ❌ BAD: Logic yang sama di-ulang 3 kali
function exportStudentToPDF(students: Student[]) {
    const header = "NISN\tNama\tKelas\n";
    const body = students.map(s => `${s.nisn}\t${s.nama}\t${s.kelas}`).join('\n');
    const footer = `\nTotal: ${students.length}`;
    return header + body + footer;
}

function exportTeacherToPDF(teachers: Teacher[]) {
    const header = "NIP\tNama\tMata Pelajaran\n";
    const body = teachers.map(t => `${t.nip}\t${t.nama}\t${t.mapel}`).join('\n');
    const footer = `\nTotal: ${teachers.length}`;
    return header + body + footer;
}

function exportFinanceToPDF(transactions: Transaction[]) {
    const header = "Tanggal\tUraian\tJumlah\n";
    const body = transactions.map(t => `${t.tanggal}\t${t.uraian}\t${t.jumlah}`).join('\n');
    const footer = `\nTotal: ${transactions.length}`;
    return header + body + footer;
}
```

#### Magic Numbers
```typescript
// ❌ BAD: Angka tanpa konteks
function calculateBOSAllocation(totalStudents: number, category: string): number {
    if (category === 'operasional') {
        return totalStudents * 300000 * 0.4;  // Apa artinya 300000 dan 0.4?
    }
    if (category === 'pengembangan') {
        return totalStudents * 300000 * 0.3;
    }
    return totalStudents * 300000 * 0.3;
}
```

#### God Object
```typescript
// ❌ BAD: Satu object yang tahu dan lakukan semuanya
const app = {
    students: [],
    teachers: [],
    finances: [],
    loadStudents() { /* ... */ },
    saveStudents() { /* ... */ },
    loadTeachers() { /* ... */ },
    saveTeachers() { /* ... */ },
    calculateBudget() { /* ... */ },
    generateReport() { /* ... */ },
    sendEmail() { /* ... */ },
    uploadFile() { /* ... */ },
    authenticate() { /* ... */ },
    // ... 30+ methods lainnya
};
```

### 1.2 Prompt Identifikasi Code Smell

```
## Role
Kamu adalah senior developer dengan 15+ tahun pengalaman code review.

## Task
Analisis kode dan identifikasi semua code smell.

## Input
- File: @src/utils/data.ts
- Bahasa: TypeScript

## Analysis Dimensions
1. **Long Method** — Fungsi > 20 baris, terlalu banyak tanggung jawab
2. **Large Class** — Class > 300 baris, terlalu banyak responsibility
3. **Duplicated Code** — Logic yang sama diulang di multiple tempat
4. **Magic Numbers** — Angka literal tanpa penjelasan
5. **God Object** — Satu class/object yang melakukan semuanya
6. **Feature Envy** — Method yang lebih tertarik pada class lain
7. **Data Clumps** — Parameter yang selalu muncul bersama
8. **Primitive Obsession** — Menggunakan primitive untuk domain concept
9. **Switch Statements** — Long switch/if-else yang bisa di-polymorphism
10. **Comments** — Komentar yang menjelaskan "apa" bukan "kenapa"

## Output Format
Untuk setiap smell:
| # | Smell Type | Location | Severity | Description | Suggestion |

Severity: 🔴 Critical | 🟡 Warning | 🟢 Info

## Priority Order
Urutkan berdasarkan:
1. Impact terhadap maintainability
2. Risk jika tidak diperbaiki
3. Effort untuk memperbaiki
```

### 1.3 Contoh Analisis AI

```
@src/services/studentService.ts

Analisis code smell file ini. Berikan:
1. List semua smell dengan severity
2. Estimasi effort perbaikan (S/M/L)
3. Urutan prioritas perbaikan
4. Risk assessment: apa yang bisa break jika direfactor
```

---

## 📖 Bagian 2: Safe Refactoring Patterns

### 2.1 Extract Method

#### Before
```typescript
function processRegistration(formData: any) {
    // Validasi (15 baris)
    if (!formData.name) throw new Error("Nama wajib");
    if (!formData.nisn) throw new Error("NISN wajib");
    if (formData.nisn.length !== 10) throw new Error("NISN harus 10 digit");
    if (!formData.birthDate) throw new Error("Tanggal lahir wajib");
    if (!['L', 'P'].includes(formData.gender)) throw new Error("Gender tidak valid");
    if (!formData.parentName) throw new Error("Nama orang tua wajib");
    if (!formData.address) throw new Error("Alamat wajib");
    
    // Transformasi (10 baris)
    const student = {
        nisn: formData.nisn.trim(),
        name: formData.name.trim().replace(/\s+/g, ' '),
        birthDate: new Date(formData.birthDate),
        gender: formData.gender,
        address: formData.address.trim(),
        parentName: formData.parentName.trim(),
        registeredAt: new Date(),
        status: 'pending',
    };
    
    // Simpan (5 baris)
    const db = getDatabase();
    db.students.insert(student);
    db.commit();
    
    // Notifikasi (5 baris)
    sendEmail(formData.parentEmail, 'Pendaftaran Berhasil', `...`);
    sendWhatsApp(formData.parentPhone, `Pendaftaran ${student.name} berhasil`);
    
    return student;
}
```

#### After — Extract Method
```typescript
function processRegistration(formData: any) {
    const validatedData = validateRegistrationForm(formData);
    const student = transformToStudent(validatedData);
    saveStudent(student);
    notifyParent(formData, student);
    return student;
}

function validateRegistrationForm(formData: any) {
    const required = ['name', 'nisn', 'birthDate', 'gender', 'parentName', 'address'];
    for (const field of required) {
        if (!formData[field]) throw new Error(`${field} wajib diisi`);
    }
    if (formData.nisn.length !== 10) throw new Error("NISN harus 10 digit");
    if (!['L', 'P'].includes(formData.gender)) throw new Error("Gender tidak valid");
    return formData;
}

function transformToStudent(data: any) {
    return {
        nisn: data.nisn.trim(),
        name: data.name.trim().replace(/\s+/g, ' '),
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        address: data.address.trim(),
        parentName: data.parentName.trim(),
        registeredAt: new Date(),
        status: 'pending',
    };
}

function saveStudent(student: Student) {
    const db = getDatabase();
    db.students.insert(student);
    db.commit();
}

function notifyParent(formData: any, student: Student) {
    sendEmail(formData.parentEmail, 'Pendaftaran Berhasil', `...`);
    sendWhatsApp(formData.parentPhone, `Pendaftaran ${student.name} berhasil`);
}
```

#### Prompt Extract Method
```
@src/services/studentService.ts

Refactor fungsi processRegistration dengan Extract Method pattern:

1. Identifikasi logical blocks dalam fungsi
2. Extract setiap block jadi fungsi terpisah
3. Beri nama yang deskriptif (verb + noun)
4. Pastikan setiap fungsi punya single responsibility
5. Interface luar (processRegistration) tetap sama
6. Generate test untuk setiap extracted function
```

### 2.2 Rename

#### Before
```typescript
function proc(d: any) {
    const x = d.n;
    const y = d.a;
    return x + y;
}
```

#### After
```typescript
function calculateTotalScore(student: StudentRecord): number {
    const academicScore = student.academicScore;
    const attendanceScore = student.attendanceScore;
    return academicScore + attendanceScore;
}
```

#### Prompt Rename
```
@src/utils/calculations.ts

Rename semua identifier yang tidak deskriptif:

Rules:
1. Fungsi: verb + noun (calculateTotal, validateForm, generateReport)
2. Variabel: noun yang jelas (studentCount, not x)
3. Parameter: deskriptif (formData, not d)
4. Class: noun (StudentService, not Svc)
5. Constant: UPPER_SNAKE_CASE (MAX_STUDENTS, not max)

Jangan ubah behavior, hanya rename.
Generate test dulu untuk verify behavior preserved.
```

### 2.3 Move Method

#### Before
```typescript
class Student {
    name: string;
    grades: Grade[];
    
    // Method ini seharusnya di GradeCalculator
    calculateGPA(): number {
        const total = this.grades.reduce((sum, g) => sum + g.score, 0);
        return total / this.grades.length;
    }
    
    getHighestGrade(): number {
        return Math.max(...this.grades.map(g => g.score));
    }
    
    getLowestGrade(): number {
        return Math.min(...this.grades.map(g => g.score));
    }
}
```

#### After
```typescript
class Student {
    name: string;
    grades: Grade[];
    
    get gpa(): number {
        return GradeCalculator.calculateGPA(this.grades);
    }
}

class GradeCalculator {
    static calculateGPA(grades: Grade[]): number {
        if (grades.length === 0) return 0;
        const total = grades.reduce((sum, g) => sum + g.score, 0);
        return total / grades.length;
    }
    
    static getHighest(grades: Grade[]): number {
        return Math.max(...grades.map(g => g.score));
    }
    
    static getLowest(grades: Grade[]): number {
        return Math.min(...grades.map(g => g.score));
    }
}
```

### 2.4 Replace Conditional with Polymorphism

#### Before
```typescript
function calculateFee(studentType: string, months: number): number {
    switch (studentType) {
        case 'regular':
            return 500000 * months;
        case 'full_scholarship':
            return 0;
        case 'partial_scholarship':
            return 250000 * months;
        case 'transfer':
            return 750000 * months;
        default:
            throw new Error(`Unknown student type: ${studentType}`);
    }
}

function getDiscount(studentType: string): number {
    switch (studentType) {
        case 'regular': return 0;
        case 'full_scholarship': return 100;
        case 'partial_scholarship': return 50;
        case 'transfer': return 0;
        default: return 0;
    }
}

function getLabel(studentType: string): string {
    switch (studentType) {
        case 'regular': return 'Reguler';
        case 'full_scholarship': return 'Beasiswa Penuh';
        case 'partial_scholarship': return 'Beasiswa Sebagian';
        case 'transfer': return 'Pindahan';
        default: return 'Unknown';
    }
}
```

#### After
```typescript
interface StudentType {
    calculateFee(months: number): number;
    getDiscount(): number;
    getLabel(): string;
}

class RegularStudent implements StudentType {
    calculateFee(months: number): number { return 500000 * months; }
    getDiscount(): number { return 0; }
    getLabel(): string { return 'Reguler'; }
}

class FullScholarshipStudent implements StudentType {
    calculateFee(months: number): number { return 0; }
    getDiscount(): number { return 100; }
    getLabel(): string { return 'Beasiswa Penuh'; }
}

class PartialScholarshipStudent implements StudentType {
    calculateFee(months: number): number { return 250000 * months; }
    getDiscount(): number { return 50; }
    getLabel(): string { return 'Beasiswa Sebagian'; }
}

class TransferStudent implements StudentType {
    calculateFee(months: number): number { return 750000 * months; }
    getDiscount(): number { return 0; }
    getLabel(): string { return 'Pindahan'; }
}

// Factory
function createStudentType(type: string): StudentType {
    const types: Record<string, StudentType> = {
        regular: new RegularStudent(),
        full_scholarship: new FullScholarshipStudent(),
        partial_scholarship: new PartialScholarshipStudent(),
        transfer: new TransferStudent(),
    };
    return types[type] ?? throw new Error(`Unknown type: ${type}`);
}
```

#### Prompt Replace Conditional
```
@src/services/feeCalculator.ts

Refactor switch statements dengan Polymorphism pattern:

1. Identifikasi semua switch/if-else yang check type yang sama
2. Buat interface dengan methods yang dibutuhkan
3. Buat concrete class untuk setiap type
4. Implementasi factory untuk create instance
5. Replace switch calls dengan polymorphic calls
6. Generate test untuk verify behavior sama

Constraint: Jangan ubah public API, hanya internal implementation.
```

---

## 📖 Bagian 3: Test-First Refactoring

### 3.1 Golden Master Technique

Untuk legacy code tanpa test, gunakan Golden Master: capture current behavior sebagai baseline.

```
## Role
Kamu adalah QA engineer spesialis legacy code.

## Task
Buat "Golden Master" test untuk fungsi legacy.

## Input
- File: @src/legacy/gradeCalculator.ts
- Fungsi: calculateFinalGrade()

## Approach
1. Jalankan fungsi dengan berbagai input
2. Capture output saat ini (ini adalah "expected" behavior)
3. Buat test yang assert output == captured output
4. Test ini jadi safety net untuk refactoring

## Output
File: src/legacy/gradeCalculator.golden.test.ts

Test cases:
- Happy path (input normal)
- Edge cases (boundary values)
- Error cases (invalid input)
- Real-world data (sample dari production)

Setiap test:
- Nama deskriptif
- Input yang digunakan
- Expected output (captured dari current behavior)
- Komentar: "Golden Master — DO NOT change expected value"
```

### 3.2 Contoh Golden Master Test

```typescript
// src/legacy/gradeCalculator.golden.test.ts
import { calculateFinalGrade } from './gradeCalculator';

describe('calculateFinalGrade — Golden Master', () => {
    // GOLDEN MASTER: Expected values captured from current implementation
    // DO NOT change these values unless intentionally changing behavior
    
    test('normal student with all grades', () => {
        const input = {
            daily: [80, 85, 90],
            uts: 88,
            uas: 92,
            attendance: 95,
        };
        const result = calculateFinalGrade(input);
        // Captured: 2026-05-20 from production
        expect(result).toBe(87.4);
    });
    
    test('student with missing daily grades', () => {
        const input = {
            daily: [],
            uts: 75,
            uas: 80,
            attendance: 90,
        };
        const result = calculateFinalGrade(input);
        // Captured: 2026-05-20
        expect(result).toBe(76.5);
    });
    
    test('student with zero attendance', () => {
        const input = {
            daily: [90, 95],
            uts: 88,
            uas: 92,
            attendance: 0,
        };
        const result = calculateFinalGrade(input);
        // Captured: 2026-05-20
        expect(result).toBe(0); // Attendance 0 = automatic fail
    });
    
    test('perfect scores', () => {
        const input = {
            daily: [100, 100, 100],
            uts: 100,
            uas: 100,
            attendance: 100,
        };
        const result = calculateFinalGrade(input);
        expect(result).toBe(100);
    });
    
    test('all zeros', () => {
        const input = {
            daily: [0, 0, 0],
            uts: 0,
            uas: 0,
            attendance: 0,
        };
        const result = calculateFinalGrade(input);
        expect(result).toBe(0);
    });
});
```

### 3.3 Refactoring Loop dengan Test

```
Workflow Test-First Refactoring:

1. 🔴 RED — Write failing test (atau capture golden master)
2. 🟢 GREEN — Make test pass (jangan refactor dulu)
3. 🔵 REFACTOR — Clean up code, test tetap hijau
4. 🔄 REPEAT — Small steps, commit setiap cycle

Commit message format:
refactor: extract validation from processRegistration

- Extract validateRegistrationForm() from processRegistration()
- No behavior change, verified by existing tests
- Improves readability and testability
```

#### Prompt Refactoring Loop
```
@src/services/studentService.ts
@src/services/studentService.test.ts

Lakukan refactoring dengan test-first approach:

Target: Extract method processRegistration jadi 4 fungsi terpisah

Langkah:
1. ✅ Test sudah ada dan passing (verify dulu)
2. Extract validateRegistrationForm()
3. Jalankan test → harus masih hijau
4. Extract transformToStudent()
5. Jalankan test → harus masih hijau
6. Extract saveStudent()
7. Jalankan test → harus masih hijau
8. Extract notifyParent()
9. Jalankan test → harus masih hijau
10. Commit dengan message yang deskriptif

Jika test merah di langkah manapun:
- STOP
- Debug kenapa
- Fix tanpa mengubah behavior
- Baru lanjut ke langkah berikutnya
```

---

## 📖 Bagian 4: Incremental Refactoring

### 4.1 Strategi Small Steps

```
Incremental Refactoring Strategy:

Session 1 (30 menit):
├── Identify code smells
├── Write golden master tests
├── Fix 1-2 critical smells
└── Commit + verify

Session 2 (30 menit):
├── Review test coverage
├── Add missing edge case tests
├── Fix 2-3 warning smells
└── Commit + verify

Session 3 (30 menit):
├── Apply SOLID principles
├── Extract interfaces where needed
├── Fix remaining info smells
└── Commit + verify

Session 4 (30 menit):
├── Final review
├── Run full test suite
├── Performance check
└── Merge to main
```

### 4.2 Commit Strategy

```
Commit Frequently — Setiap Perubahan Kecil

✅ Good commits:
refactor: extract validation logic
refactor: rename proc to processStudentData
refactor: replace magic number with constant
refactor: move grade calculation to dedicated class
test: add golden master for calculateFinalGrade
refactor: replace switch with polymorphism

❌ Bad commit:
refactor: clean up code
fix: stuff
update files
```

#### Prompt Commit Message Generator
```
## Role
Kamu adalah expert dalam conventional commits.

## Task
Generate commit message untuk perubahan refactoring.

## Input
- Changes: [deskripsi perubahan]
- Files: [daftar file yang diubah]
- Reason: [kenapa refactor ini diperlukan]

## Output Format
type: short description (≤50 chars)

Detailed explanation of WHAT changed and WHY.
- Bullet points for each significant change
- Reference to tests that verify the change
- Any breaking changes or migration notes

Type options:
- refactor: code change that neither fixes a bug nor adds a feature
- test: adding missing tests or correcting existing tests
- perf: code change that improves performance
- style: code style changes (formatting, semi-colons, etc)
```

---

## 📖 Bagian 5: Legacy Code Modernization

### 5.1 Adding Tests to Untested Code

#### Skenario: Legacy School Admin App
```typescript
// src/legacy/admin.js — No tests, no types, no modules
const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_admin'
});

app.post('/api/students', (req, res) => {
    const { nisn, nama, kelas, ttl, alamat } = req.body;
    const query = `INSERT INTO students (nisn, nama, kelas, ttl, alamat) 
                   VALUES ('${nisn}', '${nama}', '${kelas}', '${ttl}', '${alamat}')`;
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, message: 'Student added' });
        }
    });
});

// ... 500+ lines of similar code
```

#### Step 1: Wrap dengan Test Harness
```
## Role
Kamu adalah legacy code modernization specialist.

## Task
Tambahkan test ke legacy code tanpa mengubah behavior.

## Input
- File: @src/legacy/admin.js
- Framework: Jest + Supertest

## Strategy
1. Start server in test mode (test database)
2. Write integration tests untuk setiap endpoint
3. Capture current behavior (golden master)
4. Test HTTP requests/responses, bukan internal implementation

## Output
File: src/legacy/admin.test.js

Test setiap endpoint:
- POST /api/students — happy path, error cases
- GET /api/students — with filters, pagination
- PUT /api/students/:id — update, not found
- DELETE /api/students/:id — delete, not found

Use test database, cleanup after each test.
```

### 5.2 Dependency Injection

#### Before — Hardcoded Dependencies
```typescript
class StudentService {
    private db = new MySQLDatabase();  // Hardcoded
    private email = new EmailService(); // Hardcoded
    private logger = new FileLogger();  // Hardcoded
    
    async registerStudent(data: StudentData) {
        this.logger.info('Registering student');
        const student = await this.db.insert('students', data);
        this.email.send(data.parentEmail, 'Welcome', '...');
        return student;
    }
}
```

#### After — Dependency Injection
```typescript
interface Database {
    insert(table: string, data: any): Promise<any>;
    query(sql: string, params?: any[]): Promise<any[]>;
}

interface EmailSender {
    send(to: string, subject: string, body: string): Promise<void>;
}

interface Logger {
    info(message: string): void;
    error(message: string, error?: Error): void;
}

class StudentService {
    constructor(
        private db: Database,
        private email: EmailSender,
        private logger: Logger
    ) {}
    
    async registerStudent(data: StudentData) {
        this.logger.info('Registering student');
        const student = await this.db.insert('students', data);
        await this.email.send(data.parentEmail, 'Welcome', '...');
        return student;
    }
}

// Production
const service = new StudentService(
    new MySQLDatabase(config),
    new EmailService(smtpConfig),
    new FileLogger('app.log')
);

// Testing
const mockDb = { insert: jest.fn(), query: jest.fn() };
const mockEmail = { send: jest.fn() };
const mockLogger = { info: jest.fn(), error: jest.fn() };
const service = new StudentService(mockDb, mockEmail, mockLogger);
```

#### Prompt Dependency Injection
```
@src/services/studentService.ts

Refactor StudentService untuk menggunakan Dependency Injection:

1. Identifikasi semua hardcoded dependencies
2. Buat interface untuk setiap dependency
3. Ubah constructor untuk menerima dependencies sebagai parameter
4. Update production code untuk inject real implementations
5. Update test code untuk inject mocks
6. Generate tests yang verify DI bekerja dengan benar

Benefits yang harus tercapai:
- Testable tanpa database/email real
- Swappable implementations (MySQL → PostgreSQL)
- Clear dependencies (easy to understand)
```

### 5.3 Breaking Circular Dependencies

#### Before — Circular Dependency
```typescript
// studentService.ts
import { gradeService } from './gradeService';

export const studentService = {
    getStudentWithGrades(id: number) {
        const student = this.getStudent(id);
        const grades = gradeService.getGradesForStudent(id);
        return { ...student, grades };
    }
};

// gradeService.ts
import { studentService } from './studentService';  // CIRCULAR!

export const gradeService = {
    getGradesForStudent(studentId: number) {
        const student = studentService.getStudent(studentId);
        if (!student) throw new Error('Student not found');
        return db.query('SELECT * FROM grades WHERE student_id = ?', [studentId]);
    }
};
```

#### After — Extract Shared Interface
```typescript
// types.ts
export interface StudentRepository {
    getStudent(id: number): Promise<Student>;
}

export interface GradeRepository {
    getGradesForStudent(studentId: number): Promise<Grade[]>;
}

// studentService.ts
import { GradeRepository } from './types';

export function createStudentService(gradeRepo: GradeRepository) {
    return {
        async getStudentWithGrades(id: number) {
            const student = await this.getStudent(id);
            const grades = await gradeRepo.getGradesForStudent(id);
            return { ...student, grades };
        }
    };
}

// gradeService.ts
import { StudentRepository } from './types';

export function createGradeService(studentRepo: StudentRepository) {
    return {
        async getGradesForStudent(studentId: number) {
            const student = await studentRepo.getStudent(studentId);
            if (!student) throw new Error('Student not found');
            return db.query('SELECT * FROM grades WHERE student_id = ?', [studentId]);
        }
    };
}

// app.ts
const studentRepo = createStudentRepository(db);
const gradeRepo = createGradeRepository(db);
const studentService = createStudentService(gradeRepo);
const gradeService = createGradeService(studentRepo);
```

---

## 📖 Bagian 6: SOLID Principles

### 6.1 Single Responsibility Principle (SRP)

**A class should have only one reason to change.**

#### Before — Violates SRP
```typescript
class StudentReport {
    constructor(private student: Student) {}
    
    // Responsibility 1: Data calculation
    calculateGPA(): number { /* ... */ }
    calculateAttendance(): number { /* ... */ }
    
    // Responsibility 2: Formatting
    toPDF(): Buffer { /* ... */ }
    toHTML(): string { /* ... */ }
    toCSV(): string { /* ... */ }
    
    // Responsibility 3: Persistence
    saveToDatabase(): void { /* ... */ }
    sendToEmail(email: string): void { /* ... */ }
}
```

#### After — SRP Applied
```typescript
// Responsibility 1: Calculation
class StudentGradeCalculator {
    constructor(private student: Student) {}
    calculateGPA(): number { /* ... */ }
    calculateAttendance(): number { /* ... */ }
}

// Responsibility 2: Formatting
interface ReportFormatter {
    format(data: ReportData): string | Buffer;
}

class PDFReportFormatter implements ReportFormatter { /* ... */ }
class HTMLReportFormatter implements ReportFormatter { /* ... */ }
class CSVReportFormatter implements ReportFormatter { /* ... */ }

// Responsibility 3: Persistence
class ReportRepository {
    save(report: Report): void { /* ... */ }
}

class ReportNotifier {
    send(report: Report, email: string): void { /* ... */ }
}

// Usage
const calculator = new StudentGradeCalculator(student);
const gpa = calculator.calculateGPA();

const formatter = new PDFReportFormatter();
const pdf = formatter.format({ gpa, attendance });

const repo = new ReportRepository();
repo.save(new Report(student.id, pdf));
```

### 6.2 Open/Closed Principle (OCP)

**Open for extension, closed for modification.**

#### Before — Violates OCP
```typescript
function calculateDiscount(studentType: string, amount: number): number {
    if (studentType === 'regular') return amount * 0.95;
    if (studentType === 'scholarship') return amount * 0.80;
    if (studentType === 'athlete') return amount * 0.90;
    // Need to MODIFY this function for every new type
    throw new Error('Unknown type');
}
```

#### After — OCP Applied
```typescript
interface DiscountStrategy {
    apply(amount: number): number;
}

class RegularDiscount implements DiscountStrategy {
    apply(amount: number): number { return amount * 0.95; }
}

class ScholarshipDiscount implements DiscountStrategy {
    apply(amount: number): number { return amount * 0.80; }
}

class AthleteDiscount implements DiscountStrategy {
    apply(amount: number): number { return amount * 0.90; }
}

// EXTENSION: Add new type without modifying existing code
class ArtistDiscount implements DiscountStrategy {
    apply(amount: number): number { return amount * 0.85; }
}

class DiscountCalculator {
    private strategies: Map<string, DiscountStrategy> = new Map();
    
    register(type: string, strategy: DiscountStrategy): void {
        this.strategies.set(type, strategy);
    }
    
    calculate(type: string, amount: number): number {
        const strategy = this.strategies.get(type);
        if (!strategy) throw new Error(`Unknown type: ${type}`);
        return strategy.apply(amount);
    }
}
```

### 6.3 Liskov Substitution Principle (LSP)

**Subtypes must be substitutable for their base types.**

#### Before — Violates LSP
```typescript
class Student {
    attendClass(): void { console.log('Attending class'); }
    takeExam(): void { console.log('Taking exam'); }
}

class OnlineStudent extends Student {
    attendClass(): void { 
        throw new Error('Online students cannot attend physical class'); 
    }
    takeExam(): void { console.log('Taking online exam'); }
}

// This breaks because OnlineStudent throws on attendClass()
function processStudent(student: Student) {
    student.attendClass();  // 💥 Throws for OnlineStudent
    student.takeExam();
}
```

#### After — LSP Applied
```typescript
interface ClassAttendee {
    attendClass(): void;
}

interface ExamTaker {
    takeExam(): void;
}

class PhysicalStudent implements ClassAttendee, ExamTaker {
    attendClass(): void { console.log('Attending physical class'); }
    takeExam(): void { console.log('Taking physical exam'); }
}

class OnlineStudent implements ExamTaker {
    attendClass(): void { console.log('Attending virtual class'); }
    takeExam(): void { console.log('Taking online exam'); }
}

// Now each function only requires what it needs
function handleAttendance(student: ClassAttendee) {
    student.attendClass();  // ✅ Works for all ClassAttendee
}

function handleExam(student: ExamTaker) {
    student.takeExam();  // ✅ Works for all ExamTaker
}
```

### 6.4 Interface Segregation Principle (ISP)

**Many client-specific interfaces are better than one general-purpose interface.**

#### Before — Violates ISP
```typescript
interface SchoolWorker {
    teach(): void;
    gradePapers(): void;
    attendMeeting(): void;
    manageBudget(): void;
    cleanClassroom(): void;
}

class Teacher implements SchoolWorker {
    teach() { /* yes */ }
    gradePapers() { /* yes */ }
    attendMeeting() { /* yes */ }
    manageBudget() { throw new Error('Not my job'); }  // 💥
    cleanClassroom() { throw new Error('Not my job'); }  // 💥
}
```

#### After — ISP Applied
```typescript
interface Teacher {
    teach(): void;
    gradePapers(): void;
    attendMeeting(): void;
}

interface Administrator {
    manageBudget(): void;
    attendMeeting(): void;
}

interface Janitor {
    cleanClassroom(): void;
}

class FullTimeTeacher implements Teacher {
    teach() { /* ... */ }
    gradePapers() { /* ... */ }
    attendMeeting() { /* ... */ }
}

class HeadTeacher implements Teacher, Administrator {
    teach() { /* ... */ }
    gradePapers() { /* ... */ }
    attendMeeting() { /* ... */ }
    manageBudget() { /* ... */ }
}
```

### 6.5 Dependency Inversion Principle (DIP)

**Depend on abstractions, not concretions.**

#### Before — Violates DIP
```typescript
class StudentService {
    private mysqlDB = new MySQLConnection();  // Concrete dependency
    
    getStudent(id: number) {
        return this.mysqlDB.query('SELECT * FROM students WHERE id = ?', [id]);
    }
}
```

#### After — DIP Applied
```typescript
interface DatabaseConnection {
    query(sql: string, params?: any[]): Promise<any[]>;
}

class StudentService {
    constructor(private db: DatabaseConnection) {}  // Abstract dependency
    
    getStudent(id: number) {
        return this.db.query('SELECT * FROM students WHERE id = ?', [id]);
    }
}

// Production
const service = new StudentService(new MySQLConnection(config));

// Testing
const service = new StudentService(new MockDatabase());

// Future: switch to PostgreSQL without changing StudentService
const service = new StudentService(new PostgreSQLConnection(config));
```

---

## 📖 Bagian 7: Database Refactoring

### 7.1 Schema Migration

#### Skenario: Normalisasi Tabel Siswa
```sql
-- BEFORE: Denormalized table
CREATE TABLE students (
    id INT PRIMARY KEY,
    nisn VARCHAR(10),
    nama VARCHAR(100),
    ttl VARCHAR(100),
    alamat TEXT,
    nama_ayah VARCHAR(100),
    pekerjaan_ayah VARCHAR(50),
    nama_ibu VARCHAR(100),
    pekerjaan_ibu VARCHAR(50),
    telepon_ortu VARCHAR(20),
    kelas VARCHAR(10),
    nama_wali VARCHAR(100),  -- Sometimes filled, sometimes not
    -- ... 30+ more columns mixing student, parent, and class data
);

-- AFTER: Normalized tables
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nisn VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    relation ENUM('father', 'mother', 'guardian'),
    nama VARCHAR(100) NOT NULL,
    pekerjaan VARCHAR(50),
    telepon VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE class_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    academic_year VARCHAR(9),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);
```

#### Migration Script
```sql
-- Migration: 001_normalize_student_tables.sql

-- Step 1: Create new tables
CREATE TABLE parents LIKE ...;
CREATE TABLE class_enrollments LIKE ...;

-- Step 2: Migrate data
INSERT INTO parents (student_id, relation, nama, pekerjaan, telepon)
SELECT id, 'father', nama_ayah, pekerjaan_ayah, telepon_ortu
FROM students WHERE nama_ayah IS NOT NULL;

INSERT INTO parents (student_id, relation, nama, pekerjaan, telepon)
SELECT id, 'mother', nama_ibu, pekerjaan_ibu, telepon_ortu
FROM students WHERE nama_ibu IS NOT NULL;

INSERT INTO class_enrollments (student_id, class_id, academic_year)
SELECT id, (SELECT id FROM classes WHERE name = students.kelas), '2025/2026'
FROM students WHERE kelas IS NOT NULL;

-- Step 3: Verify data integrity
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM parents;
SELECT COUNT(*) FROM class_enrollments;

-- Step 4: Drop old columns (after verification)
ALTER TABLE students 
    DROP COLUMN nama_ayah,
    DROP COLUMN pekerjaan_ayah,
    DROP COLUMN nama_ibu,
    DROP COLUMN pekerjaan_ibu,
    DROP COLUMN telepon_ortu,
    DROP COLUMN nama_wali,
    DROP COLUMN kelas;
```

#### Prompt Database Migration
```
## Role
Kamu adalah database migration specialist.

## Task
Buat migration script untuk normalisasi database.

## Input
- Current schema: @schema/current.sql
- Target schema: @schema/target.sql
- Data volume: ~5000 students, ~15000 parent records

## Output
1. Migration script (SQL) dengan steps:
   a. Create new tables
   b. Migrate data
   c. Verify integrity
   d. Drop old columns
2. Rollback script (jika migration gagal)
3. Data verification queries
4. Estimated downtime
5. Backward compatibility plan (selama migration)
```

### 7.2 Backward Compatibility

```
Strategi Backward Compatibility saat Database Migration:

Phase 1 — Dual Write (Week 1-2):
├── New code writes to BOTH old and new tables
├── Old code still reads from old tables
├── Monitor: data consistency check setiap hari
└── Rollback: matikan dual write, kembali ke old only

Phase 2 — Read from New (Week 3-4):
├── New code reads from new tables
├── Old code still reads from old tables (dual write masih jalan)
├── Monitor: compare results dari old vs new
└── Rollback: switch new code back to old tables

Phase 3 — Deprecate Old (Week 5-6):
├── Old code deprecated, warning logs
├── All traffic ke new tables
├── Monitor: error rate, performance
└── Rollback: re-enable old code temporarily

Phase 4 — Cleanup (Week 7):
├── Drop old tables
├── Remove dual write code
├── Remove old code paths
└── Commit: "chore: remove deprecated student tables"
```

---

## 📖 Bagian 8: API Refactoring

### 8.1 API Versioning

#### Before — Breaking Change
```typescript
// v1: Returns flat object
app.get('/api/students/:id', (req, res) => {
    const student = db.getStudent(req.params.id);
    res.json({
        id: student.id,
        name: student.nama,
        class: student.kelas,
        grade: student.nilai,  // Single number
    });
});

// Breaking change: mengubah struktur response
app.get('/api/students/:id', (req, res) => {
    const student = db.getStudent(req.params.id);
    res.json({
        id: student.id,
        fullName: student.nama,  // Changed field name
        className: student.kelas,  // Changed field name
        grades: {  // Changed from number to object
            daily: student.nilaiHarian,
            uts: student.uts,
            uas: student.uas,
        },
    });
});
```

#### After — Versioned API
```typescript
// v1 — Keep for backward compatibility
app.get('/api/v1/students/:id', (req, res) => {
    const student = db.getStudent(req.params.id);
    res.json({
        id: student.id,
        name: student.nama,
        class: student.kelas,
        grade: student.nilai,
    });
});

// v2 — New structure
app.get('/api/v2/students/:id', (req, res) => {
    const student = db.getStudent(req.params.id);
    res.json({
        id: student.id,
        fullName: student.nama,
        className: student.kelas,
        grades: {
            daily: student.nilaiHarian,
            uts: student.uts,
            uas: student.uas,
        },
        metadata: {
            lastUpdated: student.updatedAt,
            version: '2.0',
        },
    });
});

// Deprecation notice di v1
app.get('/api/v1/students/:id', (req, res) => {
    res.set('Deprecation', '2026-12-31');
    res.set('Sunset', '2027-06-30');
    res.set('Link', '</api/v2/students/:id>; rel="successor-version"');
    
    const student = db.getStudent(req.params.id);
    res.json({ /* v1 response */ });
});
```

### 8.2 Deprecation Strategy

```
API Deprecation Timeline:

Month 1 — Announce:
├── Add deprecation headers to v1
├── Update API documentation
├── Notify all API consumers
└── Provide migration guide

Month 2-3 — Support Both:
├── v1 and v2 both active
├── Monitor v1 usage
├── Help consumers migrate
└── Log deprecation warnings

Month 4-5 — Sunset Warning:
├── Send final warnings to remaining v1 users
├── Sunset date announced
├── Block new v1 integrations
└── v1 returns warning in response body

Month 6 — Sunset:
├── v1 returns 410 Gone
├── Response includes migration guide
├── Monitor for any remaining traffic
└── Remove v1 code from codebase
```

---

## 📖 Bagian 9: Refactoring Checklist

### 9.1 Pre-Refactoring Checklist

```
## Pre-Refactoring Checklist

### Understanding
- [ ] Saya paham apa yang kode ini lakukan
- [ ] Saya tahu siapa yang menggunakan kode ini
- [ ] Saya tahu dependencies-nya apa saja
- [ ] Saya tahu batasan/constraints-nya

### Safety Net
- [ ] Test suite ada dan passing
- [ ] Test coverage > 80% untuk area yang direfactor
- [ ] Golden master test untuk legacy code
- [ ] Integration test untuk verify end-to-end behavior

### Planning
- [ ] Code smell sudah diidentifikasi
- [ ] Refactoring pattern yang akan digunakan sudah dipilih
- [ ] Langkah-langkah sudah direncanakan (small steps)
- [ ] Rollback plan sudah disiapkan
- [ ] Estimasi waktu realistis

### Communication
- [ ] Team sudah di-inform tentang rencana refactor
- [ ] Stakeholder tahu potential impact
- [ ] Documentation update plan sudah ada
```

### 9.2 During Refactoring Checklist

```
## During Refactoring Checklist

### Each Step
- [ ] Satu perubahan per commit
- [ ] Test passing sebelum commit
- [ ] Commit message deskriptif (conventional commits)
- [ ] Code review jika perubahan signifikan

### Quality
- [ ] No new code smells introduced
- [ ] Naming konsisten dan deskriptif
- [ ] Functions < 20 baris (ideal)
- [ ] Classes < 300 baris (ideal)
- [ ] No magic numbers (extract to constants)
- [ ] Error handling adequate

### Verification
- [ ] Unit test passing
- [ ] Integration test passing
- [ ] No regression in behavior
- [ ] Performance tidak menurun
- [ ] Memory usage tidak meningkat
```

### 9.3 Post-Refactoring Checklist

```
## Post-Refactoring Checklist

### Verification
- [ ] Semua test passing (unit + integration + e2e)
- [ ] Code review completed
- [ ] No linting errors
- [ ] Type checking passing (jika TypeScript)

### Documentation
- [ ] README updated (jika API berubah)
- [ ] Changelog entry added
- [ ] Migration guide (jika breaking changes)
- [ ] Inline comments untuk complex logic

### Deployment
- [ ] Deploy to staging
- [ ] Smoke test di staging
- [ ] Monitor error rate setelah deploy
- [ ] Rollback plan ready

### Cleanup
- [ ] Dead code removed
- [ ] Unused dependencies removed
- [ ] TODO/FIXME comments addressed
- [ ] Branch merged dan deleted
```

---

## 📖 Bagian 10: Real-World — Refactoring Aplikasi Administrasi Sekolah

### 10.1 Initial State

```typescript
// src/app.ts — Legacy school admin app, 800+ lines, no tests

const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_db'
});

// 50+ routes all in one file
// Mixed concerns: student CRUD, teacher CRUD, finance, reports, auth
// No error handling middleware
// No input validation
// SQL injection vulnerabilities
// No pagination
// No rate limiting
// Hardcoded constants
// Duplicated logic
```

### 10.2 Refactoring Plan

```
Refactoring Plan: Aplikasi Administrasi Sekolah

Phase 1 — Safety Net (Week 1):
├── Add test framework (Jest + Supertest)
├── Write golden master tests untuk semua endpoint
├── Setup test database
├── Verify all tests passing

Phase 2 — Structure (Week 2):
├── Split routes ke separate files (students, teachers, finance)
├── Extract middleware (auth, error handling, validation)
├── Create service layer (business logic)
├── Create repository layer (database access)

Phase 3 — Quality (Week 3):
├── Fix SQL injection (parameterized queries)
├── Add input validation (Joi/Zod)
├── Add pagination to list endpoints
├── Extract magic numbers to constants
├── Fix duplicated code

Phase 4 — Modernization (Week 4):
├── Add TypeScript types
├── Implement dependency injection
├── Add logging (Winston)
├── Add rate limiting
├── Add API documentation (Swagger)

Phase 5 — Polish (Week 5):
├── Performance optimization
├── Add caching (Redis)
├── API versioning
├── Deploy pipeline
└── Final review
```

### 10.3 Phase 1: Safety Net

```
Prompt untuk AI:

@src/app.ts

Buat test suite untuk legacy app ini:

1. Setup Jest + Supertest
2. Setup test database (SQLite untuk testing)
3. Write integration tests untuk setiap endpoint:
   - GET /api/students — list, filter, pagination
   - POST /api/students — create, validation errors
   - GET /api/students/:id — find, not found
   - PUT /api/students/:id — update, validation
   - DELETE /api/students/:id — delete, not found
   
   - GET /api/teachers — similar pattern
   - POST /api/finance/transactions — create
   - GET /api/reports/financial — generate
   
4. Use test data fixtures
5. Cleanup database after each test
6. Verify all tests passing

File structure:
tests/
├── setup.ts (test database setup)
├── fixtures.ts (test data)
├── students.test.ts
├── teachers.test.ts
├── finance.test.ts
└── reports.test.ts
```

### 10.4 Phase 2: Structure

```
Prompt untuk AI:

@src/app.ts
@tests/*.test.ts

Refactor struktur aplikasi:

1. Split routes:
   src/
   ├── routes/
   │   ├── students.ts
   │   ├── teachers.ts
   │   ├── finance.ts
   │   └── reports.ts
   ├── middleware/
   │   ├── auth.ts
   │   ├── errorHandler.ts
   │   └── validate.ts
   ├── services/
   │   ├── studentService.ts
   │   ├── teacherService.ts
   │   └── financeService.ts
   ├── repositories/
   │   ├── studentRepository.ts
   │   └── teacherRepository.ts
   └── app.ts (entry point, wiring only)

2. Extract middleware:
   - Authentication middleware
   - Error handling middleware (centralized)
   - Input validation middleware

3. Create service layer:
   - Business logic di service
   - Routes hanya handle HTTP concerns

4. Create repository layer:
   - Database access di repository
   - Service tidak tahu tentang SQL

5. Run tests after each step — must stay green
```

### 10.5 Phase 3: Quality

```
Prompt untuk AI:

@src/repositories/studentRepository.ts

Fix security dan quality issues:

1. SQL Injection — Replace string concatenation dengan parameterized queries:
   ❌ db.query(`SELECT * FROM students WHERE name = '${name}'`)
   ✅ db.query('SELECT * FROM students WHERE name = ?', [name])

2. Input Validation — Add Zod schema:
   const studentSchema = z.object({
       nisn: z.string().length(10),
       nama: z.string().min(1).max(100),
       kelas: z.string().regex(/^\d-[IVX]+$/),
   });

3. Pagination — Add to list endpoints:
   GET /api/students?page=1&limit=20&sort=name&order=asc

4. Extract Constants:
   const PAGINATION_DEFAULT_LIMIT = 20;
   const PAGINATION_MAX_LIMIT = 100;
   const NISN_LENGTH = 10;

5. Error Handling — Consistent error responses:
   { error: { code: 'STUDENT_NOT_FOUND', message: '...', details: {} } }

Run tests after each fix.
```

---

## 📋 Magic Prompt Templates

### Template 1: Code Smell Analysis
```
## Role
Senior developer, 15+ tahun code review experience.

## Task
Identify all code smells in the codebase.

## Input
- Files: @file1, @file2, ...
- Language: [language]

## Output
Table: # | Smell Type | Location | Severity | Description | Suggestion
Priority order by impact and effort.
```

### Template 2: Safe Refactoring
```
## Role
Refactoring specialist.

## Task
Refactor code safely with test-first approach.

## Input
- Code: @file
- Target: [what to achieve]
- Pattern: [extract method/rename/etc]

## Output
1. Step-by-step refactoring plan
2. Test to verify each step
3. Commit message for each step
4. Rollback plan
```

### Template 3: SOLID Application
```
## Role
Software architecture expert.

## Task
Apply SOLID principles to code.

## Input
- Code: @file
- Principle: [SRP/OCP/LSP/ISP/DIP]

## Output
1. Before code (violating principle)
2. Analysis of violation
3. After code (applying principle)
4. Benefits achieved
```

### Template 4: Database Migration
```
## Role
Database migration specialist.

## Task
Create migration script.

## Input
- Current schema: @schema.sql
- Target schema: @target.sql

## Output
1. Migration SQL script
2. Rollback script
3. Verification queries
4. Downtime estimate
5. Backward compatibility plan
```

---

## ✅ Checklist Kompetensi

### Code Smell Identification
- [ ] AI scan semua smell types
- [ ] Severity assessment akurat
- [ ] Priority order by impact
- [ ] Effort estimation realistis

### Safe Refactoring Patterns
- [ ] Extract method
- [ ] Rename with confidence
- [ ] Move method/class
- [ ] Replace conditional with polymorphism
- [ ] Introduce parameter object

### Test-First Refactoring
- [ ] Golden master technique
- [ ] AAA pattern tests
- [ ] Boundary coverage
- [ ] Regression prevention

### Incremental Refactoring
- [ ] Small steps (< 30 min each)
- [ ] Commit frequently
- [ ] Test passing always
- [ ] Conventional commits

### Legacy Code Modernization
- [ ] Add tests to untested code
- [ ] Dependency injection
- [ ] Break circular dependencies
- [ ] Module extraction

### SOLID Principles
- [ ] SRP: Single responsibility
- [ ] OCP: Open for extension
- [ ] LSP: Substitutable subtypes
- [ ] ISP: Segregated interfaces
- [ ] DIP: Abstract dependencies

### Database Refactoring
- [ ] Schema migration
- [ ] Data migration
- [ ] Backward compatibility
- [ ] Rollback plan

### API Refactoring
- [ ] API versioning
- [ ] Deprecation strategy
- [ ] Backward-compatible changes
- [ ] Migration guide

### Real-World: School Admin App
- [ ] Safety net (tests)
- [ ] Structure (layers)
- [ ] Quality (security, validation)
- [ ] Modernization (TS, DI, logging)

---

## ⚠️ Pitfalls dan Cara Menghindarinya

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Bug setelah refactor | Tidak ada test pelindung | Golden master test dulu |
| Refactor terlalu besar | Tidak break down | Max 30 min per step |
| Behavior berubah | Tidak verify | Test after EVERY step |
| Team confused | Tidak communicate | Announce plan, document |
| Performance turun | Over-abstraction | Profile before/after |
| Merge conflict | Tidak commit sering | Commit setiap small step |
| Regression | Incomplete test coverage | Add edge case tests |
| Migration gagal | No rollback plan | Always prepare rollback |
| API breaking | No versioning | Version from day one |
| Technical debt tetap | Refactor tidak selesai | Finish one area before moving |

### Pitfall Terbesar: Refactor Tanpa Test

Refactoring tanpa test = bermain api. Selalu:

1. **Test dulu** — Golden master atau proper unit tests
2. **Verify** — Test hijau SEBELUM refactor
3. **Small steps** — Satu perubahan, verify, commit
4. **Never break** — Behavior harus preserved
5. **Document** — Kenapa refactor, bukan apa yang diubah

---

## 📝 Ringkasan

### Workflow Inti

1. **Identify** → AI scan code smells, prioritize
2. **Test** → Golden master or proper tests
3. **Plan** → Small steps, pattern selection
4. **Execute** → One change, verify, commit
5. **Repeat** → Until quality target met
6. **Review** → Final check, documentation

### Prinsip Utama

- **Test first, refactor second** — Never without safety net
- **Small steps** — < 30 min per change, commit often
- **Behavior preserved** — Output must be identical
- **AI assists, human decides** — AI suggests, you approve
- **Document why** — Future you will thank present you

### Pattern Reference

| Pattern | When to Use | Complexity |
|---------|-------------|------------|
| Extract Method | Long function | Low |
| Rename | Unclear names | Low |
| Move Method | Wrong class | Medium |
| Replace Conditional | Switch/if chains | Medium |
| Introduce Interface | Tight coupling | Medium |
| Dependency Injection | Hardcoded deps | Medium |
| Extract Class | God class | High |
| Strategy Pattern | Algorithm variants | High |

---

> **Modul selanjutnya**: [C3: Dokumentasi & Git](./05-dokumentasi-git.md) — Dokumentasi otomatis dan Git workflow dengan AI.