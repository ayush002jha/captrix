# Captrix

Captrix is a browser-based caption studio for short creator videos. Users upload a 30 second to 2 minute clip, add editable captions, preview animated caption styles, get a local AI caption score, and export a caption kit.

Live URL: _add Vercel URL after first deployment_

## Hackathon Loop Strategy

Captrix will be built in small increments:

1. Codex builds one user-facing feature slice.
2. We commit that increment.
3. The app is deployed to Vercel.
4. TestSprite CLI runs tests against the live Vercel URL.
5. Codex fixes failures and reruns TestSprite.
6. `LOOP.md` records the actual maker/checker/fix iteration.

## Current Increment

Increment 01 includes:

- Next.js App Router setup.
- Video upload with file type and duration validation.
- Caption preview overlay.
- Caption style and position controls.
- Local browser-only caption coach.
- Export guard and caption kit JSON export.
- Stable `data-testid` hooks for TestSprite.

## Local Development

```bash
npm install
npm run dev
```

Then visit:

```txt
http://localhost:3000
```

## Verification

```bash
npm run typecheck
npm run build
```

## TestSprite

Test plans live in `testsprite/plans/`.

After the first Vercel deployment:

```bash
testsprite project create --type frontend --name "Captrix" --url https://your-vercel-url.vercel.app
testsprite test run --all --project "$TESTSPRITE_PROJECT_ID" --wait --output json
```

The GitHub Actions workflow uses `TESTSPRITE_API_KEY` and `TESTSPRITE_PROJECT_ID` repository secrets.
