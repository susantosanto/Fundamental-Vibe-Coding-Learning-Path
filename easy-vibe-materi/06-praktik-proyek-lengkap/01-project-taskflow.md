# PRAKTIK PROYEK LENGKAP: BANGUN APLIKASI NYATA DARI NOL

---

## Pengantar

Di bagian ini, kita akan mempraktikkan semua yang sudah dipelajari dengan membangun satu aplikasi lengkap. Kita akan mulai dari ide, lalu ke prototype, development, integrasi AI, hingga siap untuk didemonstrasikan.

**Aplikasi yang akan kita bangun:** "TaskFlow - Aplikasi Manajemen Tugas dengan AI"

---

## Spesifikasi Project

### Deskripsi Aplikasi

**TaskFlow** adalah aplikasi manajemen tugas yang membantu pengguna mengatur dan menyelesaikan tugas sehari-hari dengan bantuan AI untuk memberikan insight dan motivasi.

### Target User

- Profesional yang ingin meningkatkan produktivitas
- Student yang ingin manage tugas sekolah/kuliah
- Freelancer yang perlu track multiple projects

### Fitur Utama (MVP)

1. **Manajemen Tugas**
   - Tambah tugas baru dengan judul, deskripsi, deadline
   - Edit dan hapus tugas
   - Tandai tugas selesai
   - Filter tugas (semua, aktif, selesai)

2. **Kategorisasi**
   - Kategori/label untuk tugas
   - Filter berdasarkan kategori

3. **AI Assistant**
   - Tanya tentang produktivitas
   - Minta saran cara menyelesaikan tugas
   - Generate quote motivasi

4. **Statistik**
   - Jumlah tugas selesai vs total
   - Progress visual

### Tech Stack

- **Frontend:** HTML + CSS + JavaScript (Vanilla)
- **AI:** OpenAI GPT API (atau mock jika tidak ada API key)
- **Storage:** localStorage

---

## Tahap 1: Perencanaan dan Wireframe

### Struktur Halaman

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Logo + Title + AI Chat Toggle            │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────────────┐  │
│  │  SIDEBAR   │  │  MAIN CONTENT                │  │
│  │             │  │                              │  │
│  │ - All       │  │  ┌────────────────────────┐  │  │
│  │ - Active    │  │  │  ADD TASK FORM          │  │  │
│  │ - Completed │  │  └────────────────────────┘  │  │
│  │             │  │                              │  │
│  │ Categories: │  │  ┌────────────────────────┐  │  │
│  │ - Work      │  │  │  TASK LIST             │  │  │
│  │ - Personal  │  │  │  - Task 1              │  │  │
│  │ - Study     │  │  │  - Task 2              │  │  │
│  │             │  │  │  - ...                 │  │  │
│  │             │  │  └────────────────────────┘  │  │
│  │             │  │                              │  │
│  │ Stats:      │  │  ┌────────────────────────┐  │  │
│  │ ████░░ 60%  │  │  │  STATISTICS            │  │  │
│  └─────────────┘  │  └────────────────────────┘  │  │
│                   └─────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  AI CHAT PANEL (Hidden by default, toggleable)     │
└─────────────────────────────────────────────────────┘
```

### Data Structure

```javascript
// Task object
{
    id: "unique-id",
    title: "Judul tugas",
    description: "Deskripsi tugas",
    category: "work",
    deadline: "2024-12-31",
    completed: false,
    createdAt: "timestamp"
}

// Category object
{
    id: "work",
    name: "Work",
    color: "#FF6B6B"
}
```

---

## Tahap 2: Setup Project

### Struktur Folder

```
taskflow/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── assets/
    └── (optional images)
```

### File: index.html

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow - Manajemen Tugas Cerdas</title>
    <link rel="stylesheet" href="css/style.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Font Awesome untuk icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="app-header">
            <div class="logo">
                <i class="fas fa-brain"></i>
                <span>TaskFlow</span>
            </div>
            <div class="header-actions">
                <button id="aiToggleBtn" class="ai-btn">
                    <i class="fas fa-robot"></i>
                    <span>AI Assistant</span>
                </button>
            </div>
        </header>

        <div class="main-layout">
            <!-- Sidebar -->
            <aside class="sidebar">
                <nav class="filter-nav">
                    <button class="filter-btn active" data-filter="all">
                        <i class="fas fa-list"></i>
                        Semua Tugas
                    </button>
                    <button class="filter-btn" data-filter="active">
                        <i class="fas fa-spinner"></i>
                        Aktif
                    </button>
                    <button class="filter-btn" data-filter="completed">
                        <i class="fas fa-check-circle"></i>
                        Selesai
                    </button>
                </nav>

                <div class="categories">
                    <h3>Kategori</h3>
                    <div class="category-list">
                        <button class="category-btn active" data-category="all">
                            <span class="color-dot" style="background: #6c757d"></span>
                            Semua
                        </button>
                        <button class="category-btn" data-category="work">
                            <span class="color-dot" style="background: #FF6B6B"></span>
                            Work
                        </button>
                        <button class="category-btn" data-category="personal">
                            <span class="color-dot" style="background: #4ECDC4"></span>
                            Personal
                        </button>
                        <button class="category-btn" data-category="study">
                            <span class="color-dot" style="background: #45B7D1"></span>
                            Study
                        </button>
                    </div>
                </div>

                <div class="stats-section">
                    <h3>Progress</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <p class="progress-text" id="progressText">0% selesai</p>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Add Task Form -->
                <div class="add-task-section">
                    <form id="taskForm" class="task-form">
                        <div class="form-row">
                            <input type="text" id="taskTitle" placeholder="Apa yang perlu dilakukan?" required>
                            <select id="taskCategory">
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="study">Study</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <input type="text" id="taskDescription" placeholder="Deskripsi (opsional)">
                            <input type="date" id="taskDeadline">
                            <button type="submit" class="add-btn">
                                <i class="fas fa-plus"></i>
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Task List -->
                <div class="task-list" id="taskList">
                    <!-- Tasks akan di-render di sini -->
                </div>

                <!-- Empty State -->
                <div class="empty-state" id="emptyState">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Belum ada tugas</h3>
                    <p>Tambahkan tugas pertama Anda!</p>
                </div>
            </main>
        </div>

        <!-- AI Chat Panel -->
        <div class="ai-panel" id="aiPanel">
            <div class="ai-header">
                <h3><i class="fas fa-robot"></i> AI Assistant</h3>
                <button id="closeAiBtn" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="ai-messages" id="aiMessages">
                <div class="ai-message">
                    <div class="ai-avatar">🤖</div>
                    <div class="ai-content">
                        Halo! Saya AI Assistant Anda. Saya bisa membantu:
                        <ul>
                            <li>Saran cara menyelesaikan tugas</li>
                            <li>Tips produktivitas</li>
                            <li>Quote motivasi</li>
                            <li>Jawab pertanyaan tentang manajemen tugas</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="ai-input">
                <input type="text" id="aiInput" placeholder="Tanya sesuatu...">
                <button id="aiSendBtn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>
```

---

## Tahap 3: Styling (CSS)

### File: css/style.css

```css
/* Reset dan Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #667eea;
    --primary-dark: #5568d3;
    --secondary: #764ba2;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-500: #6b7280;
    --gray-700: #374151;
    --gray-900: #111827;
    --white: #ffffff;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--gray-100);
    color: var(--gray-900);
    line-height: 1.6;
}

/* App Container */
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* Header */
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: var(--white);
    box-shadow: var(--shadow);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 700;
}

.logo i {
    font-size: 28px;
}

.ai-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    color: var(--white);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.ai-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

/* Main Layout */
.main-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Sidebar */
.sidebar {
    width: 280px;
    background: var(--white);
    padding: 24px;
    border-right: 1px solid var(--gray-200);
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
}

.filter-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.filter-btn, .category-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border: none;
    background: transparent;
    border-radius: 10px;
    color: var(--gray-700);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
}

.filter-btn:hover, .category-btn:hover {
    background: var(--gray-100);
}

.filter-btn.active, .category-btn.active {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: var(--white);
}

.filter-btn i, .category-btn i {
    width: 20px;
}

.categories h3, .stats-section h3 {
    font-size: 12px;
    text-transform: uppercase;
    color: var(--gray-500);
    margin-bottom: 12px;
    letter-spacing: 0.5px;
}

.category-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

/* Stats */
.stats-section {
    margin-top: auto;
    padding-top: 24px;
    border-top: 1px solid var(--gray-200);
}

.progress-bar {
    height: 8px;
    background: var(--gray-200);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--success) 0%, var(--primary) 100%);
    border-radius: 4px;
    transition: width 0.5s ease;
}

.progress-text {
    font-size: 14px;
    color: var(--gray-500);
    text-align: center;
}

/* Main Content */
.main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

/* Add Task Form */
.add-task-section {
    background: var(--white);
    padding: 20px;
    border-radius: 16px;
    box-shadow: var(--shadow);
    margin-bottom: 24px;
}

.task-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-row {
    display: flex;
    gap: 12px;
}

.task-form input, .task-form select {
    padding: 12px 16px;
    border: 2px solid var(--gray-200);
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s;
}

.task-form input:focus, .task-form select:focus {
    border-color: var(--primary);
}

#taskTitle {
    flex: 2;
}

#taskCategory {
    flex: 1;
    max-width: 150px;
}

#taskDescription {
    flex: 2;
}

#taskDeadline {
    flex: 1;
    max-width: 180px;
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    border: none;
    border-radius: 10px;
    color: var(--white);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

/* Task List */
.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow);
    transition: all 0.3s;
}

.task-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.task-item.completed {
    opacity: 0.7;
}

.task-item.completed .task-title {
    text-decoration: line-through;
    color: var(--gray-500);
}

.task-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid var(--gray-300);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.task-checkbox:hover {
    border-color: var(--primary);
}

.task-checkbox.checked {
    background: var(--success);
    border-color: var(--success);
    color: var(--white);
}

.task-info {
    flex: 1;
}

.task-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 4px;
}

.task-meta {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--gray-500);
}

.task-category {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.task-category.work {
    background: #FEE2E2;
    color: #991B1B;
}

.task-category.personal {
    background: #D1FAE5;
    color: #065F46;
}

.task-category.study {
    background: #DBEAFE;
    color: #1E40AF;
}

.task-actions {
    display: flex;
    gap: 8px;
}

.task-actions button {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-btn {
    background: var(--gray-100);
    color: var(--gray-700);
}

.edit-btn:hover {
    background: var(--gray-200);
}

.delete-btn {
    background: #FEE2E2;
    color: #991B1B;
}

.delete-btn:hover {
    background: #FECACA;
}

/* Empty State */
.empty-state {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
}

.empty-state.visible {
    display: flex;
}

.empty-state i {
    font-size: 64px;
    color: var(--gray-300);
    margin-bottom: 16px;
}

.empty-state h3 {
    font-size: 20px;
    color: var(--gray-700);
    margin-bottom: 8px;
}

.empty-state p {
    color: var(--gray-500);
}

/* AI Panel */
.ai-panel {
    position: fixed;
    right: -400px;
    top: 0;
    width: 400px;
    height: 100vh;
    background: var(--white);
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    transition: right 0.3s ease;
    z-index: 1000;
}

.ai-panel.open {
    right: 0;
}

.ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: var(--white);
}

.ai-header h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
}

.close-btn {
    background: none;
    border: none;
    color: var(--white);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
}

.ai-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ai-message {
    display: flex;
    gap: 12px;
}

.ai-avatar {
    width: 36px;
    height: 36px;
    background: var(--gray-100);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.ai-content {
    background: var(--gray-100);
    padding: 12px 16px;
    border-radius: 12px;
    border-top-left-radius: 4px;
    font-size: 14px;
    line-height: 1.6;
}

.ai-content ul {
    margin: 8px 0 0 16px;
}

.ai-content li {
    margin-bottom: 4px;
}

.user-message {
    flex-direction: row-reverse;
}

.user-message .ai-content {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: var(--white);
    border-top-left-radius: 12px;
    border-top-right-radius: 4px;
}

.ai-input {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid var(--gray-200);
}

.ai-input input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid var(--gray-200);
    border-radius: 25px;
    outline: none;
    font-size: 14px;
}

.ai-input input:focus {
    border-color: var(--primary);
}

.ai-input button {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: var(--white);
    cursor: pointer;
    transition: all 0.3s;
}

.ai-input button:hover {
    transform: scale(1.1);
}

/* Loading Animation */
.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
    background: var(--gray-100);
    border-radius: 12px;
    border-top-left-radius: 4px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--gray-500);
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-5px);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        display: none;
    }
    
    .ai-panel {
        width: 100%;
        right: -100%;
    }
    
    .form-row {
        flex-direction: column;
    }
    
    #taskCategory, #taskDeadline {
        max-width: none;
    }
}
```

---

## Tahap 4: JavaScript Logic

### File: js/app.js

```javascript
// ==================== STATE MANAGEMENT ====================
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentCategory = 'all';

// ==================== DOM ELEMENTS ====================
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// AI Elements
const aiToggleBtn = document.getElementById('aiToggleBtn');
const aiPanel = document.getElementById('aiPanel');
const closeAiBtn = document.getElementById('closeAiBtn');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiMessages = document.getElementById('aiMessages');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateStats();
    setupEventListeners();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Task Form
    taskForm.addEventListener('submit', handleAddTask);
    
    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn, 'filter'));
    });
    
    // Category Buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn, 'category'));
    });
    
    // AI Panel
    aiToggleBtn.addEventListener('click', toggleAI);
    closeAiBtn.addEventListener('click', toggleAI);
    aiSendBtn.addEventListener('click', sendToAI);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendToAI();
    });
}

// ==================== TASK MANAGEMENT ====================
function handleAddTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const category = document.getElementById('taskCategory').value;
    const deadline = document.getElementById('taskDeadline').value;
    
    if (!title) return;
    
    const task = {
        id: Date.now().toString(),
        title,
        description,
        category,
        deadline,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Reset form
    taskForm.reset();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function deleteTask(taskId) {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ==================== RENDERING ====================
function renderTasks() {
    const filteredTasks = tasks.filter(task => {
        const filterMatch = currentFilter === 'all' || 
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);
        
        const categoryMatch = currentCategory === 'all' || 
            task.category === currentCategory;
        
        return filterMatch && categoryMatch;
    });
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.classList.add('visible');
    } else {
        emptyState.classList.remove('visible');
        taskList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
    }
}

function createTaskHTML(task) {
    const categoryColors = {
        work: { bg: '#FEE2E2', text: '#991B1B' },
        personal: { bg: '#D1FAE5', text: '#065F46' },
        study: { bg: '#DBEAFE', text: '#1E40AF' }
    };
    
    const colors = categoryColors[task.category] || categoryColors.work;
    
    return `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask('${task.id}')">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="task-info">
                <div class="task-title">${escapeHTML(task.title)}</div>
                <div class="task-meta">
                    <span class="task-category ${task.category}" style="background: ${colors.bg}; color: ${colors.text}">
                        ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                    ${task.deadline ? `<span><i class="far fa-calendar"></i> ${formatDate(task.deadline)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% selesai (${completed}/${total})`;
}

// ==================== FILTER HANDLING ====================
function handleFilterChange(btn, type) {
    if (type === 'filter') {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        currentFilter = btn.dataset.filter;
    } else {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        currentCategory = btn.dataset.category;
    }
    
    btn.classList.add('active');
    renderTasks();
}

// ==================== AI CHAT FUNCTIONALITY ====================
function toggleAI() {
    aiPanel.classList.toggle('open');
}

async function sendToAI() {
    const message = aiInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    aiInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    try {
        // Get AI response (using mock if no API key)
        const response = await getAIResponse(message);
        removeTyping();
        addMessage(response, 'bot');
    } catch (error) {
        removeTyping();
        addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', 'bot');
        console.error(error);
    }
}

async function getAIResponse(message) {
    // Check for API key
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (apiKey) {
        // Use real API
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'Anda adalah asisten AI yang helpful untuk manajemen tugas dan produktivitas. Jawab dalam bahasa Indonesia dengan ramah dan helpful.'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 500
                })
            });
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API Error:', error);
        }
    }
    
    // Fallback to mock responses
    return getMockResponse(message);
}

function getMockResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Motivational quotes
    if (lowerMessage.includes('motivasi') || lowerMessage.includes('quote') || lowerMessage.includes('inspirasi')) {
        const quotes = [
            "✨ \"Kesuksesan tidak selalu tentang menjadi yang terbaik. Ini tentang terus mencoba dan tidak pernah menyerah.\"",
            "🌟 \"Langkah kecil setiap hari akan membawa Anda ke tempat yang besar.\"",
            "💪 \"Fokus pada tujuan, bukan hambatan.\"",
            "🚀 \"Hari ini adalah kesempatan untuk menjadi lebih baik dari kemarin.\"",
            "🌈 \"Setiap akhir adalah awal dari sesuatu yang baru.\""
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    // Tips produktivitas
    if (lowerMessage.includes('produktivitas') || lowerMessage.includes('tips') || lowerMessage.includes('cara')) {
        return `Berikut beberapa tips produktivitas yang bisa Anda coba:

1. **Metode Eisenhower Matrix** - Prioritaskan tugas berdasarkan urgensi dan importance
2. **Pomodoro Technique** - Kerja 25 menit, istirahat 5 menit
3. **Time Blocking** - Alokasikan waktu spesifik untuk setiap tugas
4. **One Thing at a Time** - Fokus pada satu tugas sekaligus
5. **Review Harian** - Evaluasi apa yang sudah dicapai setiap hari

Apakah Anda ingin saya jelaskan lebih detail tentang salah satu tips di atas?`;
    }
    
    // Help with tasks
    if (lowerMessage.includes('tugas') || lowerMessage.includes('kerja')) {
        return `Saya bisa membantu Anda dengan tugas-tugas Anda! Berikut yang bisa saya lakukan:

- Memberikan saran cara menyelesaikan tugas yang sulit
- Membantu memprioritaskan tugas Anda
- Memberikan tips manajemen waktu
- Memberikan motivasi untuk tetap produktif

Coba ceritakan tugas apa yang ingin Anda diskusikan!`;
    }
    
    // Default response
    return `Terima kasih sudah chatting dengan saya! Saya adalah AI Assistant di TaskFlow.

Saya bisa membantu Anda dengan:
- 💡 Tips produktivitas dan manajemen waktu
- ✨ Quote motivasi untuk menjaga semangat
- 📝 Saran cara menyelesaikan tugas
- ❓ Jawaban pertanyaan tentang produktivitas

Ada yang bisa saya bantu hari ini?`;
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender === 'user' ? 'user-message' : ''}`;
    
    messageDiv.innerHTML = `
        <div class="ai-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
        <div class="ai-content">${text}</div>
    `;
    
    aiMessages.appendChild(messageDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="ai-avatar">🤖</div>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    aiMessages.appendChild(typingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) {
        typing.remove();
    }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Make functions available globally for onclick handlers
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
```

---

## Tahap 5: Testing dan Debugging

### Checklist Testing

| Komponen | Test Case | Status |
|----------|-----------|--------|
| **Add Task** | Isi form, submit, cek muncul di list | ⬜ |
| **Complete Task** | Klik checkbox, cek berubah style | ⬜ |
| **Delete Task** | Klik hapus, cek hilang dari list | ⬜ |
| **Filter** | Klik filter berbeda, cek task berubah | ⬜ |
| **Category** | Pilih category, cek task tersaring | ⬜ |
| **Stats** | Tambah/selesaikan task, cek % berubah | ⬜ |
| **AI Panel** | Buka/tutup panel, cek animasi | ⬜ |
| **AI Chat** | Kirim pesan, cek respons muncul | ⬜ |
| **LocalStorage** | Refresh page, cek data tetap ada | ⬜ |
| **Responsive** | Buka di mobile, cek layout baik | ⬜ |

---

## Tahap 6: Cara Menggunakan AI untuk Membantu

### Prompt untuk Generate Fitur Baru

```
Saya ingin menambahkan fitur [fitur] ke aplikasi TaskFlow.
Tolong buatkan:
1. Penjelasan fitur
2. Perubahan di HTML yang diperlukan
3. Perubahan di CSS yang diperlukan
4. Perubahan di JavaScript yang diperlukan
```

### Prompt untuk Debugging

```
Saya mendapat error berikut di aplikasi TaskFlow:
[Tempel error message]

Tolong找出问题 dan berikan solusi yang bisa langsung dicoba.
```

### Prompt untuk Improvement

```
Bagaimana cara meningkatkan:
1. UI/UX aplikasi TaskFlow
2. User experience
3. Performa aplikasi

Berikan saran konkret yang bisa diimplementasikan.
```

---

## Cara Deploy ke Internet

### Opsi 1: GitHub Pages (Gratis)

1. Buat repository di GitHub
2. Upload semua file project
3. Pergi ke Settings → Pages
4. Pilih branch "main" dan folder "root"
5. Simpan, tunggu beberapa menit
6. Aplikasi akan tersedia di `username.github.io/repository-name`

### Opsi 2: Netlify (Gratis)

1. Daftar di https://netlify.com
2. Drag & drop folder project ke Netlify
3. Otomatis deploy
4. Dapat custom domain gratis

### Opsi 3: Vercel (Gratis)

1. Daftar di https://vercel.com
2. Import dari GitHub
3. Deploy otomatis
4. SSL gratis

---

## Kesimpulan

Selamat! Anda telah berhasil membangun aplikasi lengkap "TaskFlow" dengan fitur:

1. ✅ Manajemen tugas (tambah, selesai, hapus)
2. ✅ Kategorisasi tugas
3. ✅ Filter dan pencarian
4. ✅ Statistik progress
5. ✅ AI Assistant untuk chat dan motivasi
6. ✅ Penyimpanan data lokal (localStorage)
7. ✅ Design responsif

Aplikasi ini bisa dikembangkan lebih lanjut dengan:
- Integrasi API AI yang sebenarnya
- Database cloud (Supabase, Firebase)
- User authentication
- Real-time sync
- Mobile app (React Native)

Ingat: Pembelajaran terbaik adalah dengan langsung praktik. Jangan takut untuk eksperimen dan membuat project Anda sendiri!