# Deploying this Vite React app (3 easy options)

## Option A — Vercel (no local build)
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/import and import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
4. Vercel will give you a free **.vercel.app** domain.
   SPA fallback is configured in `vercel.json`.

## Option B — Cloudflare Pages (no local build)
1. Push to GitHub.
2. Go to https://dash.cloudflare.com > Workers & Pages > Create.
3. Connect repo. Build command: `npm run build`. Output: `dist`.
4. Free **.pages.dev** domain.

## Option C — Netlify (drag & drop or Git)
- Drag & drop: On your PC, run `npm install` then `npm run build`. Drag the `dist` folder to https://app.netlify.com/drop.
- Or connect your GitHub repo at https://app.netlify.com. Build command: `npm run build`. Publish dir: `dist`.
- SPA fallback is configured via `_redirects` and `netlify.toml`.
