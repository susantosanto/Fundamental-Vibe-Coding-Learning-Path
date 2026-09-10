# 🏗️ PANDUAN ULTRA-DETAIL: Metode Architect-Builder
## Cara Membangun Perangkat Lunak dengan AI secara Terstruktur — Tanpa Vibe Coding

**Sumber Utama:**
- 📹 [120x.ai — How I Use ChatGPT and Codex to Build Software Without Vibe Coding](https://christitus.com/my-ai-workflow/) (transkrip asli)
- 📝 [Chris Titus Tech — My AI Coding Workflow That Actually Works](https://christitus.com/my-ai-workflow/)
- 📘 [Anthropic — Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- 📘 [Anthropic — Prompting Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)

**Target Pembaca:** Pemula absolut hingga menengah — pemilik bisnis, konsultan, eksekutif, web developer fullstack, software engineer global, siapa saja  
**Bahasa:** Indonesia  

**📚 Sumber Tambahan (Riset 2026):**
- [Augment Code — Agentic Design Patterns Catalog 2026](https://www.augmentcode.com/guides/agentic-design-patterns)
- [Augment Code — Vibe Coding vs Spec-Driven Development 2026](https://www.augmentcode.com/guides/vibe-coding-vs-spec-driven-development)
- [Addy Osmani — Vibe Coding is Not AI-Assisted Engineering](https://medium.com/@addyosmani/vibe-coding-is-not-the-same-as-ai-assisted-engineering-3f81088d5b98)
- [LangChain — Agentic Engineering: How Swarms of AI Agents Are Redefining Software](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [Anthropic — Building Effective AI Agents (Dec 2024)](https://www.anthropic.com/engineering/building-effective-agents)
- [arXiv — Practical Guide for Designing & Deploying Agentic AI Systems](https://arxiv.org/html/2512.08769)
- [System Design Codex — Essential Components of Production-Ready Web Apps](https://newsletter.systemdesigncodex.com/p/essential-components-of-a-production)

---

## 📑 DAFTAR ISI

1. [MENGAPA VIBE CODING GAGAL](#1-mengapa-vibe-coding-gagal)
2. [KONSEP INTI: ARCHITECT-BUILDER METHOD](#2-konsep-inti-architect-builder-method)
3. [TIGA PILAR METODE INI](#3-tiga-pilar-metode-ini)
4. [ANALOGI MEMBANGUN RUMAH](#4-analogi-membangun-rumah)
5. [PERSIAPAN SEBELUM MEMULAI](#5-persiapan-sebelum-memulai)
6. [STRUKTUR FOLDER PROYEK (SCAFFOLD)](#6-struktur-folder-proyek-scaffold)
7. [PENJELASAN DETAIL SETIAP FILE](#7-penjelasan-detail-setiap-file)
8. [WORKFLOW LENGKAP 6 TAHAP](#8-workflow-lengkap-6-tahap)
9. [CONTEXT ENGINEERING: RAHASIA TERBESAR](#9-context-engineering-rahasia-terbesar)
10. [SPRINT-BASED DEVELOPMENT](#10-sprint-based-development)
11. [CARA MENULIS PROMPT YANG BENAR](#11-cara-menulis-prompt-yang-benar)
12. [SISTEM VERIFIKASI & REVIEW](#12-sistem-verifikasi--review)
13. [KEAMANAN & DEPENDENCY CHECK](#13-keamanan--dependency-check)
14. [MANAJEMEN SESSION AI](#14-manajemen-session-ai)
15. [TOOLS & TEKNOLOGI YANG DIGUNAKAN](#15-tools--teknologi-yang-digunakan)
16. [TIPS PRAKTIS & BEST PRACTICES](#16-tips-praktis-dan-best-practices)
17. [KESALAHAN UMUM & CARA MENGHINDARINYA](#17-kesalahan-umum--cara-menghindarinya)
18. [CONTOH KASUS NYATA](#18-contoh-kasus-nyata)
19. [GLOSARIUM LENGKAP](#19-glosarium-lengkap)
20. [SYSTEM DESIGN ARCHITECTURE UNTUK FULLSTACK WEB DEVELOPER](#20-system-design-architecture-untuk-fullstack-web-developer)
21. [AGENTIC PATTERNS & AI AGENT WORKFLOW](#21-agentic-patterns--ai-agent-workflow)
22. [STANDAR PRODUCTION-READY & DEPLOYMENT](#22-standar-production-ready--deployment)
23. [VIBE ENGINEERING: EVOLUSI DARI VIBE CODING](#23-vibe-engineering-evolusi-dari-vibe-coding)
24. [REFERENSI & SUMBER](#24-referensi--sumber)

---

