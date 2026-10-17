# Portfolio development

This is a static HTML/CSS/JavaScript site restored from the supplied archive.
No npm install or build step is needed. The original package.json and README.md
belong to the bundled particles.js library, not the portfolio application.

From /workspace/partfolio-site, run:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Check the page with a browser and verify the introduction, particles, skill bars,
card tilt, and mobile menu. There is no existing automated application test suite.
The original npm test is a placeholder that intentionally fails.

Font Awesome 6.1.1 and Orbitron (Fontsource 5.2.8) are bundled in vendor/ with
their licenses so the main page does not require third-party CDNs.

Content still needs the owner's input: repeated facts, project details,
and any additional custom interactions. Existing statistics are original content,
not newly verified claims.
