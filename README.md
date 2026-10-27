# For Gi

A responsive, original romantic website for Giovanna. Buildless HTML, CSS, JavaScript, and original SVG illustrations. All published content lives in `dist/`.

## Preview

From this directory, run `python3 -m http.server 4173 --directory dist`, then open `http://localhost:4173`.

## Personalize

- Main copy and the letter: `dist/index.html`
- Rotating notes and date-selection messages: `dist/app.js`
- Palette and layouts: `dist/styles.css`
- Candy-pink and cherry-red theme: `dist/cutesy.css`
- Animated origami ducks and paper unfolding: `dist/ducks.css`; inline SVG template and both notes in `dist/index.html`
- Larger text and phone layout adjustments: `dist/readability.css`
- Continuous floating-heart background: `dist/background.css`; decorative hearts are initialized in `dist/app.js`
- Original date illustrations: `dist/assets/`

No tracking, analytics, form submissions, or automatic messaging. Date choices remain in the current page; the visitor can explicitly copy a suggested message. Photos are not included. The layout works without them.

Fonts load from Google Fonts with local fallbacks. Reduced-motion preferences show letters immediately without unfolding or floating animations. The header also has a decorative-motion pause button. Both ducks are keyboard-accessible buttons; their paper folds open into different notes. Native modal dialogs support keyboard dismissal and focus restoration, and Escape can cancel an unfolding animation before the letter opens.

The heart background loops continuously behind the content and never intercepts taps. It uses CSS transform animations, fewer hearts on phones, and the same pause and reduced-motion controls as the ducks.

## Hosting

Every push to `main` runs `.github/workflows/pages.yml`, which publishes `dist/` to GitHub Pages. The repository is private, but the published site is viewable by anyone who has the URL; the `noindex` meta tag only keeps search engines away. Share the link intentionally.
