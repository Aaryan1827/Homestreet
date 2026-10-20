#!/usr/bin/env python3
"""
Homestreet image fetcher.

Scans src/cities/*.js for image paths like /images/pune/places/kayani-bakery.jpg,
finds the ones missing from /public, searches Wikimedia Commons for each,
downloads a freely licensed photo (about 1200px wide, under ~300KB), and
records credits. Writes scripts/review.html so you can check every photo.

Run from the project root (the folder with package.json):
    python scripts/fetch_images.py --dry-run     # see what it would search
    python scripts/fetch_images.py               # download everything missing
    python scripts/fetch_images.py --only kayani # just filenames containing "kayani"
    python scripts/fetch_images.py --force       # re-download existing files

Optional: pip install pillow   (enables resizing and compression)
Optional: scripts/image_queries.json to override searches, for example
    { "kayani-bakery": "Kayani Bakery Camp Pune", "misal-pav": "Misal pav dish" }
"""
import argparse
import html
import http.client
import io
import json
import re
import sys
import time
from pathlib import Path
from urllib import error, parse, request

API = "https://commons.wikimedia.org/w/api.php"
UA = "HomestreetImageFetcher/1.0 (student hackathon project; contact: your-email@example.com)"
IMG_RE = re.compile(r"/images/[\w-]+/(?:places|dishes)/[\w.-]+?\.(?:jpg|jpeg|png|webp)", re.I)
STOP = {"pune", "the", "of", "and", "in", "a", "dish", "food"}
BAD_TITLE = re.compile(r"\b(map|logo|flag|coat of arms|diagram|plan|poster|stamp|icon)\b", re.I)
BAD_LICENSE = re.compile(r"-NC|-ND|NonCommercial|NoDerivs|fair use|all rights", re.I)
GOOD_LICENSE = re.compile(r"CC BY|CC0|public domain|\bPD\b|GFDL|FAL", re.I)

try:
    from PIL import Image
except ImportError:
    Image = None

try:
    import requests
except ImportError:
    requests = None


def http_get(url, tries=5):
    """GET with exponential backoff. Uses `requests` if installed, else urllib."""
    for attempt in range(tries):
        try:
            if requests is not None:
                r = requests.get(url, headers={"User-Agent": UA}, timeout=30)
                if r.status_code in (429, 500, 502, 503, 504):
                    raise OSError(f"HTTP {r.status_code}")
                r.raise_for_status()
                return r.content
            req = request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
            with request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < tries - 1:
                time.sleep(5 * (attempt + 1))
                continue
            raise
        except Exception as e:
            if attempt < tries - 1:
                time.sleep(3 * (2 ** attempt))  # 3s, 6s, 12s, 24s
                continue
            raise


def strip_html(text):
    return html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()


def tokens(query):
    return [t for t in re.findall(r"[a-z0-9]+", query.lower()) if t not in STOP]


def search_commons(query, width):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"{query} filetype:bitmap",
        "gsrnamespace": "6",
        "gsrlimit": "10",
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": str(width),
    }
    data = json.loads(http_get(f"{API}?{parse.urlencode(params)}"))
    return list(data.get("query", {}).get("pages", {}).values())


def pick_best(pages, query):
    want = tokens(query)
    best, best_score = None, 0
    for page in pages:
        info = (page.get("imageinfo") or [None])[0]
        if not info or info.get("mime") not in ("image/jpeg", "image/png"):
            continue
        title = page.get("title", "")
        meta = info.get("extmetadata", {})
        lic = meta.get("LicenseShortName", {}).get("value", "")
        if BAD_TITLE.search(title) or BAD_LICENSE.search(lic) or not GOOD_LICENSE.search(lic):
            continue
        w, h = info.get("width", 0), info.get("height", 0)
        if w < 800 or w < h:  # want decent landscape photos
            continue
        hay = (title + " " + strip_html(meta.get("ImageDescription", {}).get("value", ""))).lower()
        hits = sum(1 for t in want if t in hay)
        if want and hits == 0:  # must actually mention the subject
            continue
        score = hits * 10 + min(w, 2400) / 240
        if score > best_score:
            best, best_score = (page, info, lic), score
    return best


def find_openverse(query):
    """Search Openverse (CC / public-domain images from Flickr, Wikimedia and others)."""
    params = {
        "q": query,
        "license": "by,by-sa,cc0,pdm",
        "extension": "jpg",
        "aspect_ratio": "wide",
        "page_size": "20",
    }
    data = json.loads(http_get(f"https://api.openverse.org/v1/images/?{parse.urlencode(params)}"))
    want = tokens(query)
    best, best_score = None, 0
    for r in data.get("results", []):
        w, h = r.get("width") or 0, r.get("height") or 0
        title = r.get("title") or ""
        if w < 800 or w < h or BAD_TITLE.search(title):
            continue
        hay = (title + " " + " ".join(t.get("name", "") for t in (r.get("tags") or []))).lower()
        hits = sum(1 for t in want if t in hay)
        if want and hits == 0:
            continue
        score = hits * 10 + min(w, 2400) / 240
        if score > best_score:
            best, best_score = r, score
    if not best:
        return None
    lic = f"CC {best.get('license', '').upper()} {best.get('license_version') or ''}".strip()
    page = {"title": best.get("title") or "Untitled"}
    info = {
        "url": best.get("url"),
        "thumburl": best.get("url"),
        "descriptionurl": best.get("foreign_landing_url", ""),
        "extmetadata": {"Artist": {"value": best.get("creator") or "Unknown"}},
    }
    return page, info, lic


def find_image(query, args):
    if args.source == "openverse":
        return find_openverse(query)
    return pick_best(search_commons(query, args.width), query)


def save_image(raw, dest, width, max_kb):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if Image is None:
        dest.write_bytes(raw)
        return len(raw) // 1024
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    if img.width > width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    for quality in (85, 78, 70, 62, 55, 48):
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=quality, optimize=True)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    dest.write_bytes(buf.getvalue())
    return len(buf.getvalue()) // 1024


def collect_targets(root, overrides):
    found = set()
    for f in (root / "src" / "cities").glob("*.js"):
        found.update(IMG_RE.findall(f.read_text(encoding="utf-8", errors="ignore")))
    targets = []
    for rel in sorted(found):
        stem = Path(rel).stem
        folder = rel.split("/")[3]  # places or dishes
        words = re.sub(r"[-_]+", " ", stem).strip()
        suffix = " Pune" if folder == "places" else ""
        query = overrides.get(rel) or overrides.get(stem) or (words + suffix)
        targets.append((rel, query))
    return targets


def write_review(root, rows):
    out = root / "scripts" / "review.html"
    cards = []
    for r in rows:
        cards.append(
            f"<div style='width:280px;font:13px sans-serif'>"
            f"<img src='../public{r['file']}' style='width:100%;height:180px;object-fit:cover;border-radius:12px'>"
            f"<b>{html.escape(r['file'])}</b><br>Query: {html.escape(r['query'])}<br>"
            f"Matched: {html.escape(r['title'])}<br>{html.escape(r['license'])} · "
            f"<a href='{r['source']}' target='_blank'>source</a></div>"
        )
    out.write_text(
        "<body style='background:#fff4e0;padding:20px'><h2>Check every photo. Delete wrong ones, "
        "then fix the query in image_queries.json and rerun.</h2>"
        "<div style='display:flex;flex-wrap:wrap;gap:20px'>" + "".join(cards) + "</div></body>",
        encoding="utf-8",
    )
    return out


def main():
    ap = argparse.ArgumentParser(description="Batch download Homestreet images from Wikimedia Commons")
    ap.add_argument("--root", default=".", help="project root (default: current folder)")
    ap.add_argument("--only", help="only filenames containing this text")
    ap.add_argument("--force", action="store_true", help="re-download existing files")
    ap.add_argument("--dry-run", action="store_true", help="show searches, download nothing")
    ap.add_argument("--width", type=int, default=1200)
    ap.add_argument("--max-kb", type=int, default=300)
    ap.add_argument("--queries", default="scripts/image_queries.json")
    ap.add_argument("--contact", default="", help="your real email, sent in the User-Agent (Wikimedia asks for this)")
    ap.add_argument("--source", choices=["openverse", "wikimedia"], default="openverse", help="where to search (default: openverse)")
    ap.add_argument("--delay", type=float, default=2.0, help="seconds between requests")
    args = ap.parse_args()
    global UA
    if args.contact:
        UA = f"HomestreetImageFetcher/1.0 (student hackathon project; contact: {args.contact})"

    root = Path(args.root).resolve()
    if not (root / "src" / "cities").exists():
        sys.exit("Run this from the project root (folder containing src/cities).")
    qpath = root / args.queries
    overrides = json.loads(qpath.read_text(encoding="utf-8")) if qpath.exists() else {}
    if Image is None:
        print("Note: Pillow not installed, images will not be resized. Run: pip install pillow\n")

    targets = collect_targets(root, overrides)
    if args.only:
        targets = [t for t in targets if args.only.lower() in t[0].lower()]
    credits_path = root / "public" / "images" / "credits.json"
    credits = json.loads(credits_path.read_text(encoding="utf-8")) if credits_path.exists() else {}

    if not args.dry_run:
        try:
            if args.source == "openverse":
                http_get("https://api.openverse.org/v1/images/?q=pune&page_size=1")
            else:
                search_commons("Shaniwar Wada", 400)
            print(f"Connection to {args.source} OK.\n")
        except Exception as e:
            sys.exit(
                f"Cannot reach {args.source} ({e}).\n"
                "Try: 1) phone hotspot instead of college Wi-Fi, 2) turn off VPN/proxy, "
                "3) pause antivirus web shield, 4) pass --contact your@email.com"
            )

    done, missed, rows = 0, [], []
    interrupted = False
    try:
        for rel, query in targets:
            dest = root / "public" / rel.lstrip("/")
            if dest.exists() and not args.force:
                print(f"skip   {rel} (exists)")
                continue
            print(f"search {rel}  <-  '{query}'")
            if args.dry_run:
                continue
            try:
                pick = find_image(query, args)
                if not pick:
                    print("       no suitable free photo found")
                    missed.append((rel, query))
                    continue
                page, info, lic = pick
                raw = http_get(info.get("thumburl") or info["url"])
                kb = save_image(raw, dest, args.width, args.max_kb)
                meta = info.get("extmetadata", {})
                entry = {
                    "file": rel,
                    "title": page["title"].replace("File:", ""),
                    "author": strip_html(meta.get("Artist", {}).get("value", "Unknown")),
                    "license": lic,
                    "source": info.get("descriptionurl", ""),
                    "query": query,
                }
                credits[rel] = entry
                rows.append(entry)
                done += 1
                print(f"       saved {kb}KB  {entry['title']}  ({lic})")
            except Exception as e:  # keep going on any single failure
                print(f"       failed: {e}")
                missed.append((rel, query))
            time.sleep(args.delay)  # be polite to Wikimedia
    except KeyboardInterrupt:
        print("\nStopped by you. Saving what was downloaded so far...")

    if not args.dry_run and (rows or credits):
        credits_path.parent.mkdir(parents=True, exist_ok=True)
        credits_path.write_text(json.dumps(credits, indent=2, ensure_ascii=False), encoding="utf-8")
        if rows:
            print(f"\nReview your photos: {write_review(root, rows)}")
    print(f"\nDownloaded {done}. Still missing {len(missed)}:")
    for rel, q in missed:
        print(f"  {rel}   (tried: {q})")
    if missed:
        print("Add better queries to scripts/image_queries.json and rerun, or add those photos manually.")


if __name__ == "__main__":
    main()
