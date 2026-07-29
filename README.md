# Post Composer — Experiment 1.1.1

A multi-platform post composer built with React. Users can write a post,
select one or more target platforms (Twitter/X, Instagram, LinkedIn,
Facebook), attach media, and get real-time validation against each
platform's constraints (character limit, hashtag limit, media limit/type,
required media).

## Project structure

```
post-composer/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx                # Root component
    ├── platformConfig.js      # Platform constraint definitions (data-driven)
    ├── validation.js          # Pure validation logic (no React)
    └── components/
        ├── PostComposer.jsx    # Main composer, wires everything together
        ├── PostComposer.css    # Styles (responsive)
        ├── PlatformSelector.jsx
        ├── CharacterCounter.jsx
        ├── MediaUploader.jsx
        └── ValidationPanel.jsx
```

## How it works

1. **`platformConfig.js`** holds each platform's rules (char limit, max
   hashtags, max media, allowed media types). Add a new platform here and
   the rest of the app picks it up automatically — this is what makes the
   system modular/extensible.
2. **`validation.js`** contains pure functions (`validateForPlatform`,
   `validateAll`) that take the current text/media and a platform, and
   return errors/warnings. No UI code here, so it's easy to unit test.
3. **`PostComposer.jsx`** holds the state (text, media, selected
   platforms) and recomputes validation on every change with `useMemo`,
   so feedback is instant as the user types.
4. Sub-components (`PlatformSelector`, `MediaUploader`,
   `CharacterCounter`, `ValidationPanel`) are each responsible for one
   piece of UI and receive data/callbacks as props — reusable and easy to
   test in isolation.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Extending it

- **Add a platform**: add an entry to `PLATFORMS` in `platformConfig.js`.
- **Change validation rules**: edit `validateForPlatform` in
  `validation.js`.
- **Wire up real publishing**: replace the `handleSubmit` body in
  `PostComposer.jsx` with an API call.
