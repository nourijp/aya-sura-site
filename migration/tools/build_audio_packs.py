#!/usr/bin/env python3
"""Builds the downloadable audio packs in public/downloads/ from src/data/legacy-audio.json.
Re-run after changing any audio file:  python3 migration/tools/build_audio_packs.py
"""
import json, re, zipfile, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
data = json.loads((ROOT / "src/data/legacy-audio.json").read_text(encoding="utf-8"))
OUT = ROOT / "public/downloads"; OUT.mkdir(parents=True, exist_ok=True)

def safe(s):
    s = unicodedata.normalize("NFC", s)
    return re.sub(r'[\\/:*?"<>|]+', "", s).strip().replace(" ", "-")

README = """Aya & Sura — {title} audio
{rule}

{n} recordings of the words from Volume 1 of the Aya & Sura flashcards, pronounced
slowly by a native speaker.

{numbering}
Keep in mind that the way an Arabic word is pronounced in isolation will vary from the
way it is pronounced in an ayah of the Holy Quran, because there are various rules about
how to connect the words together.

More: https://ayasura.com/qr/
Questions: support@ayasura.com
(c) Aya & Sura, LLC. For personal and family use.
"""

def build(zipname, title, files, numbering):
    z = OUT / zipname
    with zipfile.ZipFile(z, "w", zipfile.ZIP_STORED) as zf:   # mp3 is already compressed
        zf.writestr("README.txt", README.format(title=title, rule="=" * (len(title) + 16), n=len(files), numbering=numbering))
        for name, rel in files:
            zf.write(ROOT / "public" / rel.lstrip("/"), arcname=name)
    print(f"{z.name}: {len(files)} recordings, {z.stat().st_size/1048576:.1f} MB")

qe = [(f"{c['code']}_{safe(c['label'])}.mp3", c["path"]) for c in data["qe1"]]
build("Aya-and-Sura-Quran-Edition-Vol1-Audio.zip", "Quran Edition (Volume 1)", qe,
      "Files are named with the card number printed at the bottom-left of each card (QE1-01 … QE1-50).\n")

seen = {}
se = []
for c in data["se1"]:
    base = safe(c["label"]) or "word"; seen[base] = seen.get(base, 0) + 1
    se.append((f"{base}.mp3" if seen[base] == 1 else f"{base}-{seen[base]}.mp3", c["path"]))
build("Aya-and-Sura-Surah-Edition-Vol1-Audio.zip", "Surah Edition (Volume 1)", se,
      "Files are named by word.\n")
