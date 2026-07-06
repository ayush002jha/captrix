# Captrix Editor Core Test Plan

Target type: frontend

Run this plan against the deployed Vercel URL.

## Flow 1: Editor Loads

1. Open the Captrix live URL.
2. Verify the main heading contains "Make captions move."
3. Verify `data-testid=project-status` says the app is ready for a clip.
4. Verify `data-testid=platform-instagram-reels`, `data-testid=platform-youtube-video`, `data-testid=video-input`, `data-testid=generate-captions`, `data-testid=transcription-status`, `data-testid=caption-segment-manual`, `data-testid=caption-size`, `data-testid=style-creator`, `data-testid=position-bottom`, and `data-testid=export-kit` are visible.

Expected result: The editor is usable without authentication.

## Flow 2: Caption Editing

1. Double-click `data-testid=caption-segment-manual`.
2. Replace `data-testid=caption-input` with "Launch clips faster with styled captions."
3. Verify `data-testid=caption-overlay` updates with the same text.
4. Click `data-testid=style-karaoke`.
5. Verify the active style metric changes to "Karaoke".
6. Move `data-testid=caption-size` to a larger value.
7. Click `data-testid=position-bottom`.
8. Verify the caption remains visible on the video stage.

Expected result: Caption text, style, size, and position update without a page reload.

## Flow 2B: Platform Format Switching

1. Click `data-testid=platform-youtube-video`.
2. Verify the format metric or platform guidance updates to YouTube.
3. Click `data-testid=platform-instagram-reels`.
4. Verify the format metric or platform guidance updates back to Reels.

Expected result: Platform presets change the preview format without losing the current caption.

## Flow 2C: Client-Side Caption Generation Surface

1. Verify `data-testid=generate-captions` is visible.
2. Verify `data-testid=transcription-status` invites the user to generate editable captions.

Expected result: The editor exposes AI caption generation without exposing implementation details to the user.

## Flow 3: Timeline Editing

1. Verify the timeline contains `data-testid=caption-segment-manual`.
2. Double-click `data-testid=caption-segment-manual`.
3. Verify `data-testid=caption-input` is visible inside the caption timeline.

Expected result: Caption editing lives in the timeline instead of the right inspector panel.

## Flow 4: Export Guard

1. Click `data-testid=reset-studio`.
2. Click `data-testid=export-kit` without uploading a video.
3. Verify the export status says a valid clip is required before exporting.

Expected result: The app prevents exporting a video without a loaded clip.

## Flow 5: Upload Validation

1. Upload a non-video file if the test runner supports file attachment.
2. Verify Captrix shows a validation error requiring a video file.
3. Upload a short video under 30 seconds if available.
4. Verify Captrix shows a duration validation error.
5. Upload a valid 30 second to 2 minute video if available.
6. Verify the video preview is visible and the status changes to "Clip loaded".

Expected result: File type and duration constraints are enforced before editing.
