# For Gi

A responsive, original romantic website for Giovanna. Buildless HTML, CSS, JavaScript, and original SVG illustrations. All published content lives in `dist/`.

## Preview

From this directory, run `python3 -m http.server 4173 --directory dist`, then open `http://localhost:4173`.

## Personalize

- Main copy and the letter: `dist/index.html`
- Rotating notes and date-selection messages: `dist/app.js`
- Palette and layouts: `dist/styles.css`
- Original date illustrations: `dist/assets/`

No tracking, analytics, form submissions, or automatic messaging. Date choices remain in the current page; the visitor can explicitly copy a suggested message. Photos are not included. The layout works without them.

Fonts load from Google Fonts with local fallbacks. Reduced-motion preferences are respected. The letter uses a native modal dialog with keyboard dismissal and focus restoration.

The Site is created with owner-private access. Sharing with Giovanna requires changing access intentionally; a noindex meta tag alone is not access control.
