# GEMINI.md

This file provides instructional context for Gemini CLI when working in this repository.

## Project Overview

This is a **static documentation site** providing setup guides for isolating AI agents (Claude Code, Windsurf, Gemini CLI, etc.) from the host environment using containerization (Podman/Docker) and virtualization (WSL2, Lima).

- **Purpose:** Securely host AI agents with isolated file systems, displays, and networks.
- **Target Platforms:** Linux (Podman + Xephyr), macOS (Lima + XQuartz), and Windows (WSL2 + Podman + WSLg).
- **Published Site:** [https://mikalulu.github.io/ai-agent-sandbox/](https://mikalulu.github.io/ai-agent-sandbox/)

## Core Technologies

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (minimal).
- **Tooling:** Python 3 (for documentation validation).
- **Sandbox:** Podman/Docker, NVIDIA CDI (for GPU passthrough), Tini (init process).

## Building and Running

### Documentation Maintenance
- **Validate HTML:** `python3 scripts/check_docs.py` (checks for accessibility, SEO, and broken internal links).
- **Local Preview:** Any static file server (e.g., `python3 -m http.server`).

### Sandbox Operations
- **Build Sandbox Image:** `podman build -t agent-sandbox:latest ./examples`
- **Start Sandbox:** `podman-compose up -d` (requires `compose.yml` configuration).
- **Access Sandbox:** `podman exec -it agent-sandbox bash`
- **Stop Sandbox:** `podman-compose down`

## Development Conventions

### Documentation Structure
Each platform guide (`linux.html`, `mac.html`, `windows.html`) must follow this structure:
1.  **Architecture Diagram:** Visual representation of the isolation layers.
2.  **Host Preparation:** Prerequisites, drivers, and dependency installation.
3.  **Dockerfile Specification:** The container definition.
4.  **Entrypoint Scripts:** Initial setup inside the container.
5.  **Volume Creation:** Persistent storage for workspaces and model caches.
6.  **Build and Run Commands:** CLI instructions for the user.
7.  **Verification:** Steps to ensure isolation and GPU access are working.

### HTML/CSS Standards
- **Accessibility:** Must include `<main id="main-content">`, skip links, and ARIA labels for `<nav>` elements.
- **SEO:** Metadata (description, OG tags, Twitter cards) and canonical links are required for every page.
- **Styling:** Use CSS custom properties for theme consistency. Dark mode is the primary focus for AI agent documentation.
- **Fonts:** 
    - `Nunito`: Primary body text and code blocks.
    - `Klee One`: Headings and decorative text.

### Testing/Validation
- Always run `scripts/check_docs.py` before finalizing changes to HTML files.
- The documentation is generated/assisted by AI and should be treated as reference material that requires manual verification in the respective environments.

## File Organization

- `/*.html`: Platform guides and landing pages.
- `/assets/`: Global CSS and JS.
- `/examples/`: Reference `Dockerfile` and `entrypoint.sh` for the sandbox.
- `/scripts/`: Maintenance scripts (validation, etc.).
- `compose.yml`: Template for local container orchestration.
