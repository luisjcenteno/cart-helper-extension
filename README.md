# Saatva Helper Extension

Simple internal Chrome extension that surfaces the `cartId` cookie on `*.tsc-starts-coding.com` domains and provides quick links (QA, Stage, local, dev-branch) that preserve the current cart.

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

Automated GitHub Actions workflow (`.github/workflows/release.yml`). Tag a commit with the semantic version (e.g. `1.2.3`) matching `manifest.json` `version`. The workflow validates the match, builds a deterministic ZIP via `scripts/package.sh`, and attaches it to the GitHub Release. Manual runs (workflow dispatch) will build artifacts without publishing a release. Pull requests to `main` run validation only.
