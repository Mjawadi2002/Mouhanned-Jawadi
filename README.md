# MOUHANNED.OS

Interactive portfolio of Mouhanned Jawadi. A boot screen, a scroll-driven dive through a 3D world, and a working terminal.

## Run

```
npm install
npm start        # dev server
npm run build    # production build into build/
```

## How it is built

- React 18 (Create React App), three.js for the 3D tunnel, GSAP ScrollTrigger for scroll and reveals.
- `src/data.js` is the single source of truth. Edit resume content there.
- `src/components/World3D.js` is the 3D world, `Terminal.js` the command line, `Zones.js` the page sections.
- Project screenshots live in `src/assets/shots/<project-id>.jpg`. A project without a file falls back to a typographic panel.
- Resume download: `public/Mouhanned_Jawadi_Resume.pdf`. Replace the file to update it.

## Controls

- `` ` `` or `Ctrl+K` opens the terminal. Try `help`, `projects`, `open rankode`, `neofetch`.
- Number keys `1` to `7` jump between zones.
- Respects `prefers-reduced-motion`. Sound is off by default.
