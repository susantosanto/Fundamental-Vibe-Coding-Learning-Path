#!/usr/bin/env python
"""sync-skill-workflow.py — sinkronkan 24 skill WORKFLOW APP ke 11 lokasi agen.

Aturan: satu skill workflow = satu versi. Ubah skill di SATU tempat (biasanya
repo `skills/<nama>/`), lalu jalankan skrip ini. Semua lokasi memakai isi yang
sama; lokasi yang belum punya akan ditambahi.

Pemakaian:
    python tools/sync-skill-workflow.py            # backup + salin + verifikasi
    python tools/sync-skill-workflow.py --check    # verifikasi saja (read-only)
    python tools/sync-skill-workflow.py --prune    # + hapus file sisa versi lama

Sumber per skill: repo `skills/<nama>/` kalau ada, kalau tidak `~/.agents/skills/`.
Skill teach-* / dsa-review / latihan-* SENGAJA tidak termasuk (di luar alur app).
"""

from __future__ import annotations

import hashlib
import os
import shutil
import subprocess
import sys
import time

HOME = os.path.expanduser("~")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS = os.path.join(HOME, ".agents", "skills")
JUNC = os.path.join(HOME, ".gemini", "config", "skills")

SKILLS = [
    "scaffolder", "idea-clarifier", "prd-generator", "tech-stack-advisor",
    "entity-modeler", "module-planner", "sprint-planner", "ai-coding-coach",
    "acceptance-runner", "security-dependency-auditor", "deploy-production-gate",
    "state-keeper", "constitution",
    "pen-design", "stitch", "design-taste-frontend", "birdview", "impeccable",
    "browser-skill",
    "observability-and-instrumentation", "debugging-and-error-recovery",
    "systematic-debugging", "constraint-driven-development", "materi-reference",
]

LOCS = [
    AGENTS,
    os.path.join(HOME, ".claude", "skills"),
    os.path.join(HOME, ".codex", "skills"),
    os.path.join(HOME, ".config", "opencode", "skills"),
    os.path.join(HOME, ".omp", "agent", "skills"),
    os.path.join(HOME, ".pi", "agent", "skills"),
    os.path.join(HOME, ".workbuddy-ai", "skills"),
    os.path.join(HOME, ".zcode", "skills"),
    os.path.join(HOME, ".cline", "skills"),
    os.path.join(HOME, "skills"),
]

# Satu skill, dua nama folder: nama skill `design-taste-frontend`,
# folder sumber di .agents bernama `taste-skill`.
ALIAS = {"design-taste-frontend": "taste-skill"}


def src_of(skill: str) -> str | None:
    for cand in (os.path.join(REPO, "skills", skill),
                 os.path.join(AGENTS, skill),
                 os.path.join(AGENTS, ALIAS.get(skill, skill))):
        if os.path.isdir(cand):
            return cand
    return None


def dst_name(loc: str, skill: str) -> str:
    if os.path.isdir(os.path.join(loc, skill)):
        return skill
    alias = ALIAS.get(skill)
    if alias and os.path.isdir(os.path.join(loc, alias)):
        return alias
    return skill


def md5_norm(path: str) -> str:
    with open(path, "rb") as f:
        return hashlib.md5(f.read().replace(b"\r\n", b"\n").replace(b"\r", b"\n")).hexdigest()


def check() -> int:
    bad = 0
    for s in SKILLS:
        src = src_of(s)
        if not src:
            print(f"SUMBER HILANG: {s}")
            bad += 1
            continue
        ref = md5_norm(os.path.join(src, "SKILL.md"))
        for loc in LOCS + [JUNC]:
            name = s if loc == JUNC else dst_name(loc, s)
            f = os.path.join(loc, name, "SKILL.md")
            if not os.path.isfile(f):
                print(f"HILANG  {s:34} -> {loc}")
                bad += 1
            elif md5_norm(f) != ref:
                print(f"BEDA    {s:34} -> {loc}")
                bad += 1
    if bad == 0:
        print(f"OK: {len(SKILLS)} skill workflow identik di {len(LOCS) + 1} lokasi.")
    else:
        print(f"\nTOTAL masalah: {bad}")
    return 0 if bad == 0 else 1


def copy_over(src: str, dst: str) -> list[str]:
    """Salin src ke dst dengan menimpa file. TIDAK menghapus apa pun.

    Mengembalikan daftar file yang ada di dst tapi tidak ada di src (sisa versi
    lama) — dilaporkan, tidak dihapus, supaya tidak memicu guard hapus massal.
    """
    os.makedirs(dst, exist_ok=True)
    for root, _dirs, files in os.walk(src):
        rel = os.path.relpath(root, src)
        target = dst if rel == "." else os.path.join(dst, rel)
        os.makedirs(target, exist_ok=True)
        for f in files:
            s, d = os.path.join(root, f), os.path.join(target, f)
            if os.path.isfile(d) and md5_norm(s) == md5_norm(d):
                continue
            shutil.copy2(s, d)

    extras: list[str] = []
    for root, _dirs, files in os.walk(dst):
        rel = os.path.relpath(root, dst)
        src_root = src if rel == "." else os.path.join(src, rel)
        for f in files:
            if not os.path.exists(os.path.join(src_root, f)):
                extras.append(os.path.relpath(os.path.join(root, f), dst))
    return extras


def make_junction(link: str, target: str) -> None:
    if os.path.islink(link) or os.path.exists(link):
        if os.path.islink(link):
            os.unlink(link)
        else:
            shutil.rmtree(link)
    try:
        os.symlink(target, link, target_is_directory=True)
        return
    except (OSError, NotImplementedError):
        pass
    subprocess.run(
        ["cmd", "/c", "mklink", "/J", link.replace("/", "\\"), target.replace("/", "\\")],
        check=True, capture_output=True,
    )


def prune_extras() -> int:
    """Hapus file di lokasi yang tidak ada di sumber, lalu folder yang jadi kosong.

    Hanya menyentuh 24 skill workflow. Jalankan setelah sync; backup sudah dibuat
    oleh sync(), jadi penghapusan masih bisa dipulihkan.
    """
    removed = 0
    for loc in LOCS:
        for s in SKILLS:
            src = src_of(s)
            if not src:
                continue
            dst = os.path.join(loc, dst_name(loc, s))
            if not os.path.isdir(dst) or os.path.abspath(src) == os.path.abspath(dst):
                continue
            ref = set()
            for root, _d, files in os.walk(src):
                for f in files:
                    ref.add(os.path.relpath(os.path.join(root, f), src))
            for root, _d, files in os.walk(dst):
                for f in files:
                    rel = os.path.relpath(os.path.join(root, f), dst)
                    if rel not in ref:
                        os.remove(os.path.join(root, f))
                        removed += 1
            for root, _d, _f in sorted(
                ((r, d, f) for r, d, f in os.walk(dst)), key=lambda t: -len(t[0])
            ):
                if os.path.abspath(root) != os.path.abspath(dst) and not os.listdir(root):
                    os.rmdir(root)
    return removed


def sync() -> int:
    stamp = time.strftime("%Y%m%d-%H%M%S")
    backup = os.path.join(REPO, "_backup", f"sync-skills-{stamp}")
    os.makedirs(backup, exist_ok=True)

    print(f"== 1/4 BACKUP -> {backup}")
    n = 0
    for loc in LOCS + [JUNC]:
        tag = loc.replace(HOME, "").strip("/\\").replace("/", "_").replace("\\", "_")
        for s in SKILLS:
            name = s if loc == JUNC else dst_name(loc, s)
            d = os.path.join(loc, name)
            if not os.path.isdir(d):
                continue
            dst = os.path.join(backup, tag, name)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copytree(d, dst, symlinks=True)
            n += 1
    print(f"   {n} folder skill dibackup")

    print("== 2/4 SALIN ke 10 lokasi (menimpa, tanpa hapus)")
    n = 0
    extras_all: list[str] = []
    for loc in LOCS:
        os.makedirs(loc, exist_ok=True)
        for s in SKILLS:
            src = src_of(s)
            if not src:
                print(f"   LEWATI (sumber tidak ada): {s}")
                continue
            dst = os.path.join(loc, dst_name(loc, s))
            if os.path.abspath(src) == os.path.abspath(dst):
                continue
            for e in copy_over(src, dst):
                extras_all.append(os.path.join(os.path.basename(loc.rstrip("/\\")), dst_name(loc, s), e))
            n += 1
    print(f"   {n} folder skill disalin")
    if extras_all:
        print(f"   SISA VERSI LAMA (tidak dihapus, {len(extras_all)} file):")
        for e in extras_all[:12]:
            print(f"     - {e}")
        if len(extras_all) > 12:
            print(f"     ... dan {len(extras_all) - 12} file lain")

    print("== 3/4 JUNCTION gemini (per skill -> .agents)")
    os.makedirs(JUNC, exist_ok=True)
    n = 0
    for s in SKILLS:
        target = os.path.join(AGENTS, s)
        if not os.path.isdir(target):
            target = os.path.join(AGENTS, ALIAS.get(s, s))
        if not os.path.isdir(target):
            print(f"   LEWATI (tidak ada di .agents): {s}")
            continue
        link = os.path.join(JUNC, s)
        if os.path.islink(link) and os.path.realpath(link) == os.path.realpath(target):
            n += 1
            continue
        make_junction(link, target)
        n += 1
    print(f"   {n} junction siap")

    print("== 4/4 VERIFIKASI")
    return check()


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--check" in args:
        sys.exit(check())
    if "--prune" in args:
        code = sync()
        print(f"== PRUNE: {prune_extras()} file sisa versi lama dihapus")
        sys.exit(code)
    sys.exit(sync())
