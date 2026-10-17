# SHOXa portfolio

A static HTML/CSS/JavaScript portfolio restored from the owner's archive and
redesigned around a dark space theme. No installation or build is required.

## Run locally

Use the existing checkout; cloud tasks are already isolated. Do not create a Git
worktree unless the user explicitly requests one.

```sh
cd /workspace/partfolio-site
python3 -m http.server 8000 --bind 0.0.0.0
```

Live server processes need to restart in later cloud tasks. The original
package.json describes the bundled particles.js library. Its original README is
preserved under vendor/particles/. The npm test command is a failing placeholder,
not an application test suite.

## Files

- index.html: page content, skill estimates, archive project cards and image dialog.
- css/main.css: layout, unified palette, waves, reveal and hover motion.
- js/main.js: mobile menu, typewriter, skill animation, particle lifecycle and dialogs.
- img/deep-space.png: space artwork generated specifically for this portfolio.
- vendor/: retained local font and icon files, with their licenses.

The main page loads every resource locally. Historical library demos, old assets,
and original license files remain available in the repository.

## Validation

Use a browser at 1440, 768, 390 and 320 pixels wide. Verify:

- No failed requests, JavaScript errors, broken images or horizontal overflow.
- Navigation reaches the intended sections. The mobile menu handles anchor
  selection, Escape, focus trapping and returning focus to its toggle.
- Skills remain at zero before entering view, grow with synchronized counters,
  finish at 89/79/47/70/30, and do not restart when scrolling back.
- Each archive snapshot opens at full size and closes via Escape or its buttons;
  keyboard focus returns to the project button.
- Wave motion, sparse particles, section reveals and subtle pointer tilt work.
  Particle rendering pauses offscreen and in a hidden browser tab.
- With reduced motion, all content and final skill levels are visible immediately;
  particles and decorative animations are disabled. Also verify a live preference
  change. With JavaScript disabled, the text and final skill levels remain visible.

The archive screenshots are interface studies, not links to deployed projects.
Skill values are the owner's self-assessments. No client/project totals or
availability claims are invented. The contact destination is the known GitHub
profile; there is no form that pretends to send a message.
