# Captrix Editor Core Test Plan

Target type: frontend

Run this plan against the deployed Vercel URL.

## Flow 1: Editor Loads

1. Open the Captrix live URL.
2. Verify the page shows "Captrix AI".
3. Verify `data-testid=project-status`, `data-testid=video-stage`, `data-testid=video-input`, `data-testid=generate-captions`, `data-testid=caption-size`, `data-testid=caption-timeline-scroll`, and `data-testid=export-kit` are visible.

Expected result: The editor shell loads without authentication.

## Flow 2: Preset Rail

1. Click `data-testid=studio-preset-hook`.
2. Verify the page shows "Shorts", "Meme Stack", "Middle", and "22px".

Expected result: A left-rail preset applies a platform, style, position, and caption size together.

## Flow 3: Platform Switching

1. Click `data-testid=platform-youtube-video`.
2. Verify the page shows "YouTube" and "1920 x 1080".
3. Click `data-testid=platform-instagram-reels`.
4. Verify `data-testid=video-stage` remains visible.

Expected result: Platform changes do not reload or break the editor.

## Flow 4: AI Guard

1. Click `data-testid=generate-captions` without uploading a video.
2. Verify the page says a loaded clip is needed.

Expected result: Caption generation is guarded before upload.

## Flow 5: Export Guard

1. Click `data-testid=reset-studio`.
2. Click `data-testid=export-kit`.
3. Verify the page says a valid clip is required before exporting.

Expected result: Export is blocked until a valid clip is loaded.
