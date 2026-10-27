#!/usr/bin/env python3
"""
One-off extractor used to migrate the legacy WordPress /qr/ pages into this
repo. Reads saved copies of the live pages (see migration/README.md) and writes:

  src/content/legacy/<name>.html   sanitized body content (no WPBakery markup)
  src/data/legacy-audio.json       QE1 + SE1 audio manifests

It exists for provenance/reproducibility only; the legacy site is the source of
truth until cutover. Usage:  extract_legacy_qr.py <dir-with-saved-html>
"""
import json, re, sys, html, unicodedata, urllib.parse
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

SRC = Path(sys.argv[1])
ROOT = Path(__file__).resolve().parents[2]
OUT_HTML = ROOT / "src/content/legacy"
OUT_DATA = ROOT / "src/data/legacy-audio.json"
HOSTS = re.compile(r"^https?://(www\.)?ayasura\.com", re.I)
KEEP = {"h1","h2","h3","h4","h5","h6","p","ul","ol","li","table","thead","tbody","tr","th","td",
        "mark","strong","b","em","i","br","a","img","section","blockquote"}
UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-", re.I)

def clean_url(u):
    u = HOSTS.sub("", u or "")
    return u or "/"

def sanitize(node, soup):
    """Return a list of new nodes for `node`'s subtree."""
    if isinstance(node, NavigableString):
        return [NavigableString(str(node))] if str(node).strip() or str(node) else []
    if not isinstance(node, Tag):
        return []
    name = node.name
    cls = " ".join(node.get("class", []))
    if name in ("script","style","noscript","button","iframe","form","svg","audio"):
        return []
    if name == "i" and re.search(r"\bfa[srlb]?\b|fa-", cls):   # icon font glyph
        return []
    kids = []
    for c in node.children:
        kids += sanitize(c, soup)
    # WPBakery "button" links -> plain link with just the label text
    if name == "a" and "w-btn" in cls:
        label = node.get_text(" ", strip=True)
        a = soup.new_tag("a", href=clean_url(node.get("href")))
        a["class"] = "legacy-btn"
        a.string = label
        return [a]
    if name == "img":
        src = clean_url(node.get("src") or node.get("data-src"))
        if re.search(r"(aya-?and-?sura-logo|ayasura-logo)", src, re.I):
            return []                                          # site header supplies the logo
        img = soup.new_tag("img", src=src, alt=node.get("alt", ""), loading="lazy")
        return [img]
    if name not in KEEP:                                       # unwrap div/span/etc.
        return kids
    el = soup.new_tag(name)
    if name == "a":
        el["href"] = clean_url(node.get("href"))
    if name == "mark":
        el["class"] = "hl"
    nid = node.get("id")
    if nid and not UUID.match(nid) and re.match(r"^[A-Za-z][\w-]*$|^\d+$", nid) and name in ("section","h1","h2","h3","h4","p","table"):
        el["id"] = nid
    if name == "section":
        # keep a section only if it carries an anchor id; otherwise unwrap
        if not el.get("id"):
            sid = None
            for d in node.find_all(True, id=True):
                if d["id"] and not UUID.match(d["id"]) and d.name in ("section","div") and re.match(r"^[A-Za-z][\w-]*$|^\d+$", d["id"]):
                    sid = d["id"]; break
            if sid: el["id"] = sid
            else: return kids
    for k in kids: el.append(k)
    return [el]

def body_of(fname):
    s = (SRC / fname).read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(s, "lxml")
    main = soup.find("main", id="page-content")
    out = BeautifulSoup("", "lxml")
    frag = out.new_tag("div")
    for n in sanitize(main, out):
        frag.append(n)
    h = frag.decode_contents()
    h = re.sub(r"<(p|h[1-6]|li|a|span|strong|em)[^>]*>\s*</\1>", "", h)   # empties
    h = re.sub(r"\n\s*\n+", "\n", h).strip()
    return h

PAGES = {"games":"qr_games.html","pronounciation":"qr_pronounciation.html","disclaimer":"qr_cards-disclaimer.html"}
for name, f in PAGES.items():
    h = body_of(f)
    # the legacy pages open with a repeated "Back to main" nav that we re-render; keep as-is for fidelity
    (OUT_HTML / f"{name}.html").write_text(h + "\n", encoding="utf-8")
    print(f"{name}: {len(h):,} chars, tables={h.count('<table')}, imgs={h.count('<img')}")

# ---------------- audio manifests ----------------
def playlist(f):
    s = (SRC / f).read_text(encoding="utf-8", errors="ignore")
    return [(html.unescape(l), u) for u, l in re.findall(r"<li><a href='([^']+\.mp3)'>(.*?)</a></li>", s)]

def path_of(u):
    p = urllib.parse.unquote(urllib.parse.urlsplit(u).path)
    return unicodedata.normalize("NFC", p)

qe1 = []
for title, u in playlist("qr_audio_qe1-audio.html"):
    p = path_of(u); m = re.search(r"Card-(\d+)-(.+)\.mp3$", p)
    n = int(m.group(1)); label = re.sub(r"^Card\s*#\s*\d+\s*\((.*)\)\s*$", r"\1", title)
    qe1.append({"n": n, "code": f"QE1-{n:02d}", "label": label, "path": p})
qe1.sort(key=lambda x: x["n"])
assert [c["n"] for c in qe1] == list(range(1, 51)), "QE1 numbering must be 1..50"

se1 = [{"label": t, "path": path_of(u)} for t, u in playlist("qr_audio_se1.html")]
data = {"qe1": qe1, "se1": se1}
OUT_DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"audio: qe1={len(qe1)} se1={len(se1)}")
