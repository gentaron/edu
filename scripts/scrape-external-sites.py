#!/usr/bin/env python3
"""
External Site Data Sync — Scrapling-based scraper
Syncs character/story data from 11 external sites (Lovable/Netlify deployments).

Usage:
    python scripts/scrape-external-sites.py [--output-dir output] [--max-retries 3]

Output:
    scripts/scrape-output/external-sync-{timestamp}.json

Requires:
    pip install scrapling
"""

import json
import os
import sys
import time
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# External sites hosting E16 character/story content
EXTERNAL_SITES = [
    {
        "id": "auralis-main",
        "name": "AURALIS Main",
        "url": "https://auralis-gentaron.netlify.app",
        "type": "character",
        "category": "organizations",
        "fetch_keys": ["name", "description", "members"],
    },
    {
        "id": "iris-page",
        "name": "Iris Character Page",
        "url": "https://iris-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["abilities", "relations", "backstory"],
    },
    {
        "id": "mina-profile",
        "name": "Mina Eureka Ernst",
        "url": "https://mina-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["skills", "timeline"],
    },
    {
        "id": "layla-nova",
        "name": "Layla Virel Nova",
        "url": "https://layla-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["battle_records", "story"],
    },
    {
        "id": "gentaro-world",
        "name": "Gentaro's World",
        "url": "https://gentaro-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["world_view", "philosophy"],
    },
    {
        "id": "nebura-celia",
        "name": "Alpha Cain & Celia",
        "url": "https://nebura-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["relationship", "history"],
    },
    {
        "id": "jen-episodes",
        "name": "Jen's Episodes",
        "url": "https://jen-edu.lovable.app",
        "type": "story",
        "category": "stories",
        "fetch_keys": ["episodes", "character_development"],
    },
    {
        "id": "gue-story",
        "name": "Gue's Story",
        "url": "https://gue-edu.lovable.app",
        "type": "story",
        "category": "stories",
        "fetch_keys": ["plot", "conflict"],
    },
    {
        "id": "casteria-page",
        "name": "Casteria Grenvelt",
        "url": "https://casteria-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["abilities", "personality"],
    },
    {
        "id": "sitra-celes",
        "name": "Sitra Celes",
        "url": "https://sitra-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["magic", "relationships"],
    },
    {
        "id": "myu-adventure",
        "name": "Myu's Adventure",
        "url": "https://myu-edu.lovable.app",
        "type": "character",
        "category": "characters",
        "fetch_keys": ["adventures", "growth"],
    },
]


def fetch_with_retry(url: str, max_retries: int = 3, timeout: int = 30) -> str | None:
    """Fetch a URL with retry logic. Tries to use scrapling, falls back to urllib."""
    for attempt in range(max_retries):
        try:
            # Try scrapling first
            try:
                from scrapling import Fetcher
                fetcher = Fetcher()
                response = fetcher.get(url)
                if response and response.status == 200:
                    return response.text
            except ImportError:
                pass
            
            # Fallback to urllib
            import urllib.request
            import urllib.error
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "EduSyncBot/1.0 (gentaron/edu external sync)"},
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read().decode("utf-8")
                
        except Exception as e:
            print(f"  Attempt {attempt + 1}/{max_retries} failed for {url}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
    
    return None


def extract_text_content(html: str) -> str:
    """Extract meaningful text content from HTML."""
    try:
        from scrapling import Parser
        parser = Parser(html)
        # Get main content text
        text = parser.get_text(strip=True, separator="\n")
        return text
    except ImportError:
        # Simple regex-based extraction
        import re
        text = re.sub(r"<[^>]+>", " ", html)
        text = re.sub(r"\s+", " ", text).strip()
        return text


def compute_content_hash(content: str) -> str:
    """Compute SHA-256 hash of content for change detection."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()[:16]


def scrape_site(site: dict) -> dict[str, Any]:
    """Scrape a single external site and return result."""
    site_id = site["id"]
    url = site["url"]
    print(f"Scraping: {site['name']} ({url})...")
    
    html = fetch_with_retry(url)
    
    if html is None:
        return {
            "site_id": site_id,
            "name": site["name"],
            "url": url,
            "status": "error",
            "error": "All retry attempts failed",
            "scraped_at": datetime.now(timezone.utc).isoformat(),
        }
    
    text_content = extract_text_content(html)
    content_hash = compute_content_hash(text_content)
    
    return {
        "site_id": site_id,
        "name": site["name"],
        "url": url,
        "status": "success",
        "content_hash": content_hash,
        "content_length": len(text_content),
        "content_preview": text_content[:500] if text_content else "",
        "type": site["type"],
        "category": site["category"],
        "fetch_keys": site["fetch_keys"],
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def detect_changes(new_results: list[dict], prev_hash_file: str) -> list[dict]:
    """Compare new scrape results with previous hash file to detect changes."""
    changes = []
    
    prev_hashes = {}
    if os.path.exists(prev_hash_file):
        with open(prev_hash_file, "r") as f:
            prev_hashes = json.load(f)
    
    for result in new_results:
        if result["status"] != "success":
            continue
        site_id = result["site_id"]
        prev_hash = prev_hashes.get(site_id, {}).get("content_hash")
        if prev_hash and prev_hash != result["content_hash"]:
            changes.append({
                "site_id": site_id,
                "name": result["name"],
                "type": "change_detected",
                "prev_hash": prev_hash,
                "new_hash": result["content_hash"],
            })
    
    return changes


def main() -> None:
    output_dir = Path(os.environ.get("OUTPUT_DIR", "scripts/scrape-output"))
    output_dir.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    output_file = output_dir / f"external-sync-{timestamp}.json"
    hash_file = output_dir / "latest-hashes.json"
    
    print(f"Edu External Site Sync — {timestamp}")
    print(f"=" * 50)
    print(f"Scanning {len(EXTERNAL_SITES)} external sites...")
    print()
    
    results = []
    for i, site in enumerate(EXTERNAL_SITES):
        print(f"[{i + 1}/{len(EXTERNAL_SITES)}]", end=" ")
        result = scrape_site(site)
        results.append(result)
        print(f"  -> {result['status']} (hash: {result.get('content_hash', 'N/A')})")
        time.sleep(1)  # Rate limit: 1 request per second
    
    # Detect changes
    changes = detect_changes(results, str(hash_file))
    
    # Save results
    output_data = {
        "timestamp": timestamp,
        "total_sites": len(EXTERNAL_SITES),
        "successful": sum(1 for r in results if r["status"] == "success"),
        "failed": sum(1 for r in results if r["status"] == "error"),
        "changes_detected": len(changes),
        "changes": changes,
        "results": results,
    }
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    # Update latest hashes
    latest_hashes = {}
    for r in results:
        if r["status"] == "success":
            latest_hashes[r["site_id"]] = {
                "content_hash": r["content_hash"],
                "scraped_at": r["scraped_at"],
            }
    with open(hash_file, "w", encoding="utf-8") as f:
        json.dump(latest_hashes, f, indent=2)
    
    print()
    print(f"Results saved to: {output_file}")
    print(f"Hash cache saved to: {hash_file}")
    
    if changes:
        print(f"\n⚠ Changes detected in {len(changes)} site(s):")
        for change in changes:
            print(f"  - {change['name']} (hash: {change['prev_hash']} -> {change['new_hash']})")
        sys.exit(1)  # Exit with error to signal CI that PR should be created
    else:
        print("\n✓ No changes detected. No PR needed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
