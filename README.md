# Send to nvALT

A browser extension that sends the current page, the selection, or chosen
blocks to nvALT as Markdown.

## Build

```bash
npm run build
```

This writes `dist/chrome` and `dist/firefox` (plus zip files in `dist/`).

## Test

```bash
npm test
```

This runs the Node tests.

## Chrome

1. Run `npm run build`.
2. Open `chrome://extensions` and turn on Developer mode.
3. Choose Load unpacked and select `dist/chrome`.

## Firefox

1. Run `npm run build`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Choose Load Temporary Add-on and select `dist/firefox/manifest.json`.

## Safari

The Safari extension is embedded in nvALT. Turn it on in Safari Settings,
under Extensions.
