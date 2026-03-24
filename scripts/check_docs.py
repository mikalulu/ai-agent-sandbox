#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
REQUIRED_META = {
    "description",
    "theme-color",
    "twitter:card",
    "twitter:title",
    "twitter:description",
}
REQUIRED_OG = {
    "og:type",
    "og:title",
    "og:description",
    "og:url",
}


class DocParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.links: list[dict[str, str]] = []
        self.metas: dict[str, str] = {}
        self.ogs: dict[str, str] = {}
        self.canonicals: list[str] = []
        self.has_main = False
        self.has_skip_link = False
        self.has_nav = False
        self.nav_has_label = False
        self.has_toc = False
        self.toc_has_label = False

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = {k: (v or "") for k, v in attrs_list}
        if "id" in attrs:
            self.ids.add(attrs["id"])

        if tag == "main" and attrs.get("id") == "main-content":
            self.has_main = True

        if tag == "a":
            href = attrs.get("href", "")
            self.links.append(attrs)
            if href == "#main-content" and "skip-link" in attrs.get("class", ""):
                self.has_skip_link = True

        if tag == "nav":
            classes = attrs.get("class", "")
            label = attrs.get("aria-label", "")
            if "nav" in classes and label == "サイト案内":
                self.has_nav = True
                self.nav_has_label = True
            elif "nav" in classes:
                self.has_nav = True
            if "toc" in classes and label == "ページ内目次":
                self.has_toc = True
                self.toc_has_label = True
            elif "toc" in classes:
                self.has_toc = True

        if tag == "meta":
            if "name" in attrs:
                self.metas[attrs["name"]] = attrs.get("content", "")
            if "property" in attrs:
                self.ogs[attrs["property"]] = attrs.get("content", "")

        if tag == "link":
            if attrs.get("rel") == "canonical":
                self.canonicals.append(attrs.get("href", ""))


def is_external(href: str) -> bool:
    return href.startswith("http://") or href.startswith("https://")


def validate_html(path: Path) -> list[str]:
    parser = DocParser()
    parser.feed(path.read_text())

    errors: list[str] = []

    for name in REQUIRED_META:
        if name not in parser.metas:
            errors.append(f"{path.name}: missing meta {name}")
    for name in REQUIRED_OG:
        if name not in parser.ogs:
            errors.append(f"{path.name}: missing meta {name}")
    if not parser.canonicals:
        errors.append(f"{path.name}: missing canonical link")
    if not parser.has_main:
        errors.append(f"{path.name}: missing <main id=\"main-content\">")
    if not parser.has_skip_link:
        errors.append(f"{path.name}: missing skip link")
    if parser.has_nav and not parser.nav_has_label:
        errors.append(f"{path.name}: nav aria-label is missing")
    if parser.has_toc and not parser.toc_has_label:
        errors.append(f"{path.name}: toc aria-label is missing")

    for attrs in parser.links:
        href = attrs.get("href", "")
        if not href or href.startswith("mailto:") or href.startswith("javascript:"):
            continue

        if attrs.get("target") == "_blank":
            rel = set(attrs.get("rel", "").split())
            if not {"noopener", "noreferrer"}.issubset(rel):
                errors.append(f"{path.name}: target=_blank link is missing rel noopener noreferrer ({href})")

        if href.startswith("#"):
            if href[1:] not in parser.ids:
                errors.append(f"{path.name}: missing anchor target {href}")
            continue

        if is_external(href):
            parsed = urlparse(href)
            if not parsed.scheme or not parsed.netloc:
                errors.append(f"{path.name}: invalid external URL {href}")
            continue

        rel_path = href.split("#", 1)[0]
        if not rel_path:
            continue
        target = (path.parent / rel_path).resolve()
        if not target.exists():
            errors.append(f"{path.name}: missing local target {href}")

    return errors


def main() -> int:
    failures: list[str] = []
    for html in HTML_FILES:
        failures.extend(validate_html(html))

    if failures:
        print("\n".join(failures))
        return 1

    print(f"checked {len(HTML_FILES)} html files: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
