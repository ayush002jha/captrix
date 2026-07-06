# Captrix

Captrix is a browser-based caption studio for short creator videos. Users upload a 30 second to 2 minute clip, generate editable captions from speech, tune platform-ready styles, and export a captioned video.

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
- Tailwind CSS studio UI with componentized editor panels.
- Video upload with file type and duration validation.
- Caption preview overlay.
- AI caption generation with editable timeline segments.
- Platform presets for Instagram Reels, TikTok, YouTube Shorts, Instagram Feed, YouTube long-form, Facebook video, and square posts.
- Device-aware preview frames for mobile, desktop, and square formats.
- Caption style and position controls.
- Timeline-based caption editing with double-click segment updates.
- Client-side video export with rendered caption overlays, progress feedback, filename control, and WebM/MP4 options.
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

## Optional Speech Caption Endpoint

Captrix can connect to a custom speech caption endpoint for faster caption generation. If that endpoint is unavailable, the app still attempts an in-browser captioning path.

Set this in Vercel only after a custom hosted ASR endpoint is available:

```txt
NEXT_PUBLIC_CAPTRIX_TRANSCRIBE_ENDPOINT=https://your-free-asr-endpoint.example/transcribe
```

Expected endpoint contract:

- Request: `POST multipart/form-data` with `file` and `duration`.
- Response: JSON with `segments`, `chunks`, or `text`.
- Segment shape: `{ "text": "...", "start": 0, "end": 3.2 }`.

## Verification

```bash
npm run typecheck
npm run build
```

`npm run build` may need normal process-spawn permissions because Tailwind/PostCSS uses a worker during production CSS compilation.

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

Create focused frontend tests for stronger hackathon loop evidence:

```bash
testsprite test create --plan-from testsprite/plans/editor-load.plan.json --run --wait --output json
testsprite test create --plan-from testsprite/plans/platform-formats.plan.json --run --wait --output json
testsprite test create --plan-from testsprite/plans/caption-controls.plan.json --run --wait --output json
testsprite test create --plan-from testsprite/plans/ai-caption-generation.plan.json --run --wait --output json
testsprite test create --plan-from testsprite/plans/export-guards.plan.json --run --wait --output json
```

The GitHub Actions workflow uses these repository secrets:

- `TESTSPRITE_API_KEY`
- `TESTSPRITE_PROJECT_ID`
- `TESTSPRITE_TEST_ID`
