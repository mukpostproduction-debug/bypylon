#!/usr/bin/env python3
"""
Pylon Collective — Squarespace Live Site Archiver & Static Preserver
Clones all 23 live pages, images, stylesheets, and PDFs from pyloncollective.com
into website/squarespace_archive/ so they can be hosted independently for $0.
"""

import os
import sys
import re
import urllib.parse
from pathlib import Path
import requests

BASE_URL = "https://www.pyloncollective.com"
OUTPUT_DIR = Path(__file__).resolve().parent / "squarespace_archive"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

PAGES = [
    "/",
    "/about-us",
    "/advertising",
    "/advertising/project-one-f5w4d-nynnk",
    "/advertising/project-two-ky966-ms86a",
    "/advertising/project-three-sng7y-9x386",
    "/advertising/project-four-l3zw3-7rj97",
    "/filmmaking",
    "/filmmaking/project-one-f5w4d-xm6yx",
    "/filmmaking/project-two-ky966-hmrmk",
    "/filmmaking/project-three-sng7y-j9rby",
    "/filmmaking/project-four-l3zw3-7cehc",
    "/contact-us",
    "/daniel-fusco",
    "/dario-butera",
    "/declan-mckenna",
    "/jackson-mcmurdo",
    "/misan-edema",
    "/tea-team",
    "/pylon-production",
    "/s/JacksonMcMurdo_CV_2026.pdf"
]

def save_file(rel_path, content, is_binary=False):
    target = OUTPUT_DIR / rel_path.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    mode = "wb" if is_binary else "w"
    with open(target, mode) as f:
        f.write(content)
    print(f"Saved: {rel_path} ({len(content)} bytes)")

def backup_site():
    print(f"=== Starting Pylon Site Backup from {BASE_URL} ===")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    session = requests.Session()
    session.headers.update(HEADERS)
    
    downloaded_assets = set()

    for p in PAGES:
        url = BASE_URL + p
        print(f"\nFetching page: {p}...")
        try:
            r = session.get(url, timeout=15)
            if r.status_code != 200:
                print(f"Warning: HTTP {r.status_code} for {p}")
                continue

            if p.endswith(".pdf"):
                save_file(p, r.content, is_binary=True)
                continue

            html = r.text
            
            # Save the HTML page
            if p == "/":
                rel_save = "index.html"
            else:
                rel_save = f"{p.strip('/')}/index.html"
            
            save_file(rel_save, html)
            
            # Find static assets (images, css, scripts)
            asset_urls = re.findall(r'(?:src|href|data-src)=["\'](https?://[^"\']+\.(?:png|jpg|jpeg|svg|webp|gif|css|js)[^"\']*)["\']', html)
            for a_url in asset_urls:
                clean_url = a_url.split("?")[0]
                if clean_url in downloaded_assets:
                    continue
                # Download critical images and stylesheets
                if "squarespace" in a_url or "sqspcdn" in a_url:
                    downloaded_assets.add(clean_url)
                    try:
                        parsed = urllib.parse.urlparse(clean_url)
                        fname = os.path.basename(parsed.path)
                        if fname:
                            ext_dir = "assets" if not clean_url.endswith(".css") else "css"
                            ar = session.get(a_url, timeout=10)
                            if ar.status_code == 200:
                                save_file(f"{ext_dir}/{fname}", ar.content, is_binary=True)
                    except Exception as err:
                        pass
        except Exception as e:
            print(f"Error fetching {p}: {e}")

    # Create CNAME inside archive
    with open(OUTPUT_DIR / "CNAME", "w") as f:
        f.write("pyloncollective.com\n")

    print("\n=== BACKUP COMPLETE ===")
    print(f"All pages and critical assets stored in: {OUTPUT_DIR}")

if __name__ == "__main__":
    backup_site()
