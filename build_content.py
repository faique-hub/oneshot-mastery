from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent
CONTENT = ROOT / "content"
OUT = ROOT / "js" / "content.js"

# Folder name -> internal category id
CATEGORIES = {
    "notes": "note",
    "revision-notes": "revision",
    "toppers-notes": "toppers_notes",
    "important-questions": "important",
    "value-based-questions": "value_based",
    "competency-based-questions": "competency",
    "most-repeated-questions": "repeated",
    "case-study-based-questions": "case_study",
    "assertion-reason": "assertion_reason",
    "toppers-answer-sheets": "toppers_answers",
    "mcq-questions": "mcq",
    "sample-papers": "sample",
    "pyqs": "pyq",
    "question-bank": "question_bank",
}

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

    subject_dirs = sorted(
        [p for p in base.iterdir() if p.is_dir()],
        key=lambda p: p.name.lower()
    )

    for subject_dir in subject_dirs:
        subject = subject_dir.name

        if subject not in seen_subjects:
            seen_subjects.add(subject)
            subjects.append(subject)

        for f in sorted(
            subject_dir.rglob("*"),
            key=lambda p: str(p).lower()
        ):
            if not f.is_file():
                continue

            if f.name in IGNORE or f.name.startswith("."):
                continue

            # Only PDF files
            if f.suffix.lower() != ".pdf":
                print(f"Skipped non-PDF file: {f.relative_to(ROOT)}")
                continue

            rel = f.relative_to(ROOT).as_posix()

            entries.append({
                "type": item_type,
                "subject": subject,
                "title": pretty(f.stem),
                "filename": f.name,
                "ext": "pdf",
                "path": rel,
            })

# Preferred subject order
preferred = [
    "English",
    "Hindi",
    "Mathematics",
    "Science",
    "Social Science",
]

ordered_subjects = [
    s for s in preferred
    if s in seen_subjects
]

ordered_subjects += [
    s for s in subjects
    if s not in ordered_subjects
]

js = (
    "window.REVISE_SUBJECTS = "
    + json.dumps(
        ordered_subjects,
        ensure_ascii=False,
        indent=2
    )
    + ";\n"
)

js += (
    "window.REVISE_CONTENT = "
    + json.dumps(
        entries,
        ensure_ascii=False,
        indent=2
    )
    + ";\n"
)

OUT.write_text(js, encoding="utf-8")

print(
    f"Done: {len(entries)} PDFs indexed across "
    f"{len(ordered_subjects)} subjects."
)

print("Now open index.html or push the updated project.")