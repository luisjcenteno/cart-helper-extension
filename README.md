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
