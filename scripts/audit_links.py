"""Extract every href/src from index.html and pricing.html for manual review against the spec's link table."""
import re
import pathlib

ATTR_RE = re.compile(r'(?:href|src)="([^"]+)"')

for filename in ("index.html", "pricing.html"):
    path = pathlib.Path(__file__).parent.parent / filename
    text = path.read_text(encoding="utf-8")
    links = ATTR_RE.findall(text)
    print(f"\n{filename} ({len(links)} links):")
    for link in links:
        print(f"  {link}")
