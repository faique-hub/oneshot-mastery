from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content"
OUT = ROOT / "js" / "content.js"

CATEGORIES = {
    "notes": "note",
    "mindmaps": "mind",
    "short-notes": "short",
    "pyqs": "pyq",
}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
IGNORE = {".DS_Store", "Thumbs.db", "desktop.ini"}

def pretty(stem: str) -> str:
    stem = re.sub(r"[_-]+", " ", stem).strip()
    stem = re.sub(r"\s+", " ", stem)
    return stem[:1].upper() + stem[1:] if stem else "Untitled"

entries = []
subjects = []
seen_subjects = set()

for folder, item_type in CATEGORIES.items():
    base = CONTENT / folder
    if not base.exists():
        continue
    for subject_dir in sorted([p for p in base.iterdir() if p.is_dir()], key=lambda p: p.name.lower()):
        subject = subject_dir.name
        if subject not in seen_subjects:
            seen_subjects.add(subject)
            subjects.append(subject)
        for f in sorted(subject_dir.rglob("*"), key=lambda p: str(p).lower()):
            if not f.is_file() or f.name in IGNORE or f.name.startswith('.'):
                continue
            if item_type == "mind" and f.suffix.lower() not in IMAGE_EXTS:
                print(f"Skipped non-image mind map: {f.relative_to(ROOT)}")
                continue
            rel = f.relative_to(ROOT).as_posix()
            entries.append({
                "type": item_type,
                "subject": subject,
                "title": pretty(f.stem),
                "filename": f.name,
                "ext": f.suffix.lower().lstrip('.'),
                "path": rel,
            })

js = "window.REVISE_SUBJECTS = " + json.dumps(subjects, ensure_ascii=False, indent=2) + ";\n"
js += "window.REVISE_CONTENT = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n"
OUT.write_text(js, encoding="utf-8")
print(f"Done: {len(entries)} files indexed across {len(subjects)} subjects.")
print("Now open index.html, or publish the whole project folder.")
