# Saatva Cart Helper Extension

Simple Chrome extension that surfaces the `cartId` cookie on `*.tsc-starts-coding.com` domains and provides quick links (QA, Stage, local, dev-branch) that preserve the current cart.

<img width="602" height="578" alt="image" src="https://github.com/user-attachments/assets/7ca27622-3b28-4375-a2ac-cc91acaf58ec" />

## Features

- Detects active tab and validates domain (`*.tsc-starts-coding.com`)
- Reads `cartId` cookie and displays it (with copy button)
- Quick open links: QA, Stage, local Cart & Checkout
- Dev branch launcher (choose page + branch suffix) reusing current cart
- Manual refresh + basic unsupported-domain state

## Install

Internal only (not published).

1. Download latest ZIP from repository Releases
2. Chrome: go to `chrome://extensions/`
3. Enable Developer Mode
4. Drag & drop the ZIP (or Load unpacked if extracted)
5. Pin the extension (optional)

Update: repeat steps with newer ZIP and remove older version if still present.

## Deployment (CI)

Automated via GitHub Actions (`.github/workflows/release.yml`):

- Pull Request to `main`:
    - Runs validation only (version check if tagged, build, packaging script)
    - No release created.
- Tag push (e.g. `1.2.3`):
    - Tag must equal `manifest.json` `version`.
    - Workflow verifies version match.
    - Runs `scripts/package.sh` to build deterministic ZIP in `dist/`.
    - Publishes a GitHub Release attaching the ZIP.
- Manual dispatch (workflow_dispatch):
    - Builds and uploads artifact (no release) — useful for a dry run.
