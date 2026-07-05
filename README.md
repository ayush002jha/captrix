# Captrix

Captrix is a browser-based caption studio for short creator videos. Users upload a 30 second to 2 minute clip, add editable captions, preview animated caption styles, get a local AI caption score, and export a caption kit.

Live URL: https://captrix-ai.vercel.app/

TestSprite project: `c91f693d-84bd-4ea7-8178-35352c93e8dc`

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

## Sample Videos For Manual Testing

- Deterministic 30 second MP4 files: https://file-examples.com/index.php/sample-video-files/sample-mp4-files/
- General MP4 samples: https://samplelib.com/sample-mp4.html
- Creator-style stock clips: https://www.pexels.com/search/videos/creator/
- Royalty-free creator clips: https://pixabay.com/videos/search/creator/

## TestSprite

Test plans live in `testsprite/plans/`.

Create and run the core frontend test:

```bash
testsprite test create --plan-from testsprite/plans/editor-core.plan.json --run --wait --output json
```

The GitHub Actions workflow uses these repository secrets:

- `TESTSPRITE_API_KEY`
- `TESTSPRITE_PROJECT_ID`
- `TESTSPRITE_TEST_ID`
