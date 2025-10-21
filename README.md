# Saatva Helper Extension

A Chrome extension that retrieves and displays the `cartId` cookie from `*.tsc-starts-coding.com` domains.

## Features

- Domain validation for `*.tsc-starts-coding.com`
- Cookie access and retrieval
- Cart ID display with clean UI
- Error handling for invalid domains
- Success/error message system

## Functionality

1. **Automatic Loading**: Cookie check runs automatically when popup opens
2. **Domain Check**: Validates that the current tab is on a `*.tsc-starts-coding.com` subdomain
3. **Cookie Retrieval**: Searches for the `cartId` cookie on the domain
4. **Display Results**: Shows the cart ID value if found, or displays appropriate error messages
5. **Manual Refresh**: Click the "Refresh" button to check for updated cookie values

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this project folder
4. The extension icon should appear in your browser toolbar

## Development

### Project Structure

```
saatva-helper-ext/
├── manifest.json          # Extension configuration
├── popup.html            # Popup HTML structure
├── popup.css             # Popup styling
├── popup.js              # Popup JavaScript functionality
├── icons/                # Extension icons (add your own)
└── README.md             # This file
```

### Customization

- **Button Text**: Modify the button text in `popup.html`
- **Styling**: Update colors and layout in `popup.css`
- **Domain Pattern**: Change the domain matching logic in `popup.js`
- **Cookie Name**: Update the cookie name to search for in `popup.js`
- **Permissions**: Update `manifest.json` for additional Chrome APIs

### Adding Icons

Add icon files to the `icons/` directory:
- `icon16.png` (16x16px)
- `icon32.png` (32x32px)
- `icon48.png` (48x48px)
- `icon128.png` (128x128px)

**Icon Attribution**: <a href="https://www.flaticon.com/free-icons/maintenance" title="maintenance icons">Maintenance icons created by kerismaker - Flaticon</a>

### Next Steps

1. Replace placeholder icons with your own
2. Implement actual functionality in `popup.js`
3. Add content scripts if you need to interact with web pages
4. Update permissions in `manifest.json` as needed

## License

MIT License

## Production Distribution

You can distribute this extension in two common ways:

### 1. GitHub Release (Direct Download)

Users can download a ZIP archive and load it unpacked.

Steps:
1. Run the packaging script:
	```bash
	./scripts/package.sh
	```
2. The ZIP is created under `dist/` (e.g. `saatva-helper-extension-v1.0.0.zip`).
3. Create a new GitHub Release and attach the ZIP file.
4. Users download the ZIP, extract it, then follow the Installation steps (Load unpacked).

### 2. Chrome Web Store

To publish to the Chrome Web Store:
1. Sign in to the Chrome Web Store Developer Dashboard.
2. Click "Add New Item" and upload the generated ZIP from `dist/`.
3. Provide screenshots, a detailed description, and categorized metadata.
4. Submit for review. Future updates will require incrementing the `version` in `manifest.json`.

### Versioning Workflow

1. Update `manifest.json` version (e.g. `1.0.1`).
2. Commit changes: `git commit -am "chore: bump version to 1.0.1"`.
3. Tag the release: `git tag v1.0.1 && git push --tags`.
4. Run `./scripts/package.sh --version 1.0.1` (optional override if not yet committed).
5. Attach the ZIP to the GitHub Release or upload to the Chrome Web Store.

### Packaging Script Details

The script `scripts/package.sh`:
- Reads `manifest.json` for name and version
- Stages only necessary files (html, css, js, icons, assets, manifest)
- Produces a deterministic ZIP archive in `dist/`

If you add new required files (e.g. content scripts, background service workers), update the copy list in the script accordingly.

### Security / Privacy Considerations

- Limit permissions in `manifest.json` to only what you need.
- Review any host permissions before publishing.
- Consider adding a privacy policy link in the Web Store listing if you access cookies or user data.

### Troubleshooting

| Issue | Fix |
|-------|-----|
| ZIP rejected (missing manifest) | Ensure `manifest.json` is at root of archive |
| Icons not displaying | Verify all icon sizes exist and paths match `manifest.json` |
| Version conflict | Increment `version` field before uploading new build |
| Permission warning | Remove unused permissions and host patterns |

## CI / Automated Build & Release

GitHub Actions workflow (`.github/workflows/release.yml`) automates packaging:

### Triggers
- `pull_request` to `main`: Runs validation (builds ZIP, ensures script works). No release created.
- `push` tag matching `v*` (e.g. `v1.0.0`): Validates, builds, and publishes a GitHub Release with the ZIP attached.
- Manual Run: Via "Run workflow" button (will build artifact if not a PR).

### Tag & Version Sync
Tag must be `v<version>` matching the `version` in `manifest.json`. Mismatch causes workflow failure.

### Release Steps
1. Bump version in `manifest.json`.
2. Commit & tag:
	```bash
	git commit -am "chore: bump version to 1.1.0"
	git tag v1.1.0
	git push origin main --tags
	```
3. Workflow builds ZIP and attaches to Release automatically.

### Manual Dispatch
From Actions tab: select workflow, "Run workflow" → choose branch → Run. Produces artifact (`extension-zip`).

### Adjusting Workflow
Edit `.github/workflows/release.yml` to:
- Change trigger branches
- Add lint / tests before packaging
- Upload to additional storage (e.g. S3) by adding a step.

### Future Enhancement Ideas
- Add checksum generation (SHA256) and publish alongside artifact.
- Add a matrix for multiple browsers (Chrome/Firefox) if a WebExtension migration occurs.
- Include automated screenshot capture using Puppeteer.

