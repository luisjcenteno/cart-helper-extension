#!/usr/bin/env bash
set -euo pipefail

# package.sh - Create a production ZIP archive for the Chrome extension.
# Usage: ./scripts/package.sh [--version <override>] [--out-dir <dir>]
# Output: <name>-<version>.zip placed into the out directory (default: dist/)

RED="\033[0;31m"; GREEN="\033[0;32m"; YELLOW="\033[1;33m"; NC="\033[0m"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/dist"
VERSION_OVERRIDE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      VERSION_OVERRIDE="$2"; shift 2;;
    --out-dir)
      OUT_DIR="$2"; shift 2;;
    -h|--help)
      echo "Usage: $0 [--version <override>] [--out-dir <dir>]"; exit 0;;
    *) echo -e "${RED}Unknown arg: $1${NC}"; exit 1;;
  esac
done

mkdir -p "$OUT_DIR"

MANIFEST_VERSION=$(node -p "require('$ROOT_DIR/manifest.json').version")
VERSION=${VERSION_OVERRIDE:-$MANIFEST_VERSION}

NAME=$(node -p "require('$ROOT_DIR/manifest.json').name" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
ARCHIVE_NAME="${NAME}-${VERSION}.zip"
ARCHIVE_PATH="$OUT_DIR/$ARCHIVE_NAME"

echo -e "${YELLOW}Building production archive: $ARCHIVE_NAME${NC}";

# Create a temporary staging directory
STAGE_DIR=$(mktemp -d)
trap 'rm -rf "$STAGE_DIR"' EXIT

copy() { cp -R "$@" "$STAGE_DIR"; }

copy "$ROOT_DIR/manifest.json"
copy "$ROOT_DIR/popup.html"
copy "$ROOT_DIR/popup.js"
copy "$ROOT_DIR/popup.css"
if [[ -d "$ROOT_DIR/assets" ]]; then copy "$ROOT_DIR/assets"; fi
if [[ -d "$ROOT_DIR/icons" ]]; then copy "$ROOT_DIR/icons"; fi

# Remove any source maps or debug-only files (none currently but placeholder)
find "$STAGE_DIR" -type f -name '*.map' -delete || true

pushd "$STAGE_DIR" >/dev/null
zip -r "$ARCHIVE_PATH" . >/dev/null
popd >/dev/null

echo -e "${GREEN}Created $ARCHIVE_PATH${NC}";
echo "Attach ZIP to internal GitHub Release for distribution."