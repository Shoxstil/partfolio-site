# SHOXa — Code. Create. Explore.

Shokhrukh Shavkatov's personal portfolio. A minimalist technology-inspired site
with a deep-space atmosphere, animated waves, interactive skill meters and a
small archive of early web experiments.

## Run

No installation or build step is needed. All fonts, artwork and scripts load
locally.

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

The entry point is `index.html`. See [DEVELOPMENT.md](DEVELOPMENT.md) for source
files and browser validation notes. The original `package.json` belongs to the
bundled particles.js library; its `npm test` is not an application test suite.

## Features

- Responsive layout with a restrained mint, white and near-black palette.
- Original generated space artwork and layered animated waves.
- Scroll-triggered skill bars with synchronized percentage counters.
- JavaScript, Python and GDScript technology cards with subtle pointer tilt.
- Accessible mobile navigation and archive screenshot dialogs.
- Reduced-motion support, visible static content without JavaScript, and particle
  rendering that pauses when the hero leaves the viewport.

Project cards show screenshots from the original archive. They are interface
studies rather than links to deployed products. Skill levels are personal
estimates.

## Credits

Space artwork was generated specifically for this portfolio. Orbitron and
third-party library licenses are retained. Historical image credits are available
in the site's footer. The original particles.js documentation is preserved at
[vendor/particles/README.md](vendor/particles/README.md).
