# Rock and Mineral Specimens

Spin 40 rock and mineral specimens in 3D and check the identification properties for the NYS Earth Science Regents. The whole app is one file, `index.html`, styled with the topo design system (`topo-design.css`, embedded verbatim).

## Cloudflare (connected to this repo)

Create a Workers project from Git (Workers & Pages → Create → Import a repository) and use:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Pages-style projects: build command `npm run build`, output directory `public`.

`npm run build` copies `index.html` and `static/` (headers, robots, 404) into `public/`. `wrangler.jsonc` serves that folder as static assets.

Local: `npm install`, then `npm run dev`.

## Editing

- Specimen data lives in the `specimen-data` script tag in `index.html`. The in-app Editor (Study → Editor) can copy updated JSON to paste back in.
- Card images are pre-rendered posters in `static/posters/<id>.webp`. After adding a specimen, run `node scripts-posters.mjs <id>` then `python3 scripts-normalize-posters.py` (needs Playwright and Pillow). A card without a poster falls back to a live 3D model.
- Mineral properties follow the NYS Earth Science Reference Tables: luster, Mohs hardness range, density, streak, breakage (cleavage or fracture), color, composition, distinguishing features and uses.
- Models load from `https://models.mikesammartano.com/` (`MODEL_BASE` in `index.html`).
- `topo-design.css` is the reference copy of the stylesheet; the same text sits at the top of the `<style>` block in `index.html`.
- Feedback posts to `/api/feedback` and falls back to a mail link when that route doesn't exist, so no Worker is needed.
