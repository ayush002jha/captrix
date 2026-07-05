# Captrix Editor Core Test Plan

Target type: frontend

Run this plan against the deployed Vercel URL.

## Flow 1: Editor Loads

1. Open the Captrix live URL.
2. Verify the main heading contains "Make captions move."
3. Verify `data-testid=project-status` says the app is ready for a clip.
4. Verify `data-testid=video-input`, `data-testid=caption-input`, `data-testid=style-creator`, `data-testid=position-middle`, and `data-testid=export-kit` are visible.

Expected result: The editor is usable without authentication.

## Flow 2: Caption Editing

1. Replace `data-testid=caption-input` with "Launch clips faster with styled captions."
2. Verify `data-testid=caption-overlay` updates with the same text.
3. Click `data-testid=style-karaoke`.
4. Verify the active style metric changes to "Karaoke".
5. Click `data-testid=position-bottom`.
6. Verify the caption remains visible on the video stage.

Expected result: Caption text, style, and position update without a page reload.

## Flow 3: Local Caption AI

1. Click `data-testid=ai-suggest`.
2. Verify the caption textarea changes.
3. Verify a success message mentions the local caption AI suggestion.
4. Verify `data-testid=ai-score` and `data-testid=ai-summary` are visible.

Expected result: The client-side suggestion flow works without a server call.

## Flow 4: Export Guard

1. Click `data-testid=reset-studio`.
2. Click `data-testid=export-kit` without uploading a video.
3. Verify the export status says a valid clip is required before exporting.

Expected result: The app prevents exporting a caption kit without a loaded clip.

## Flow 5: Upload Validation

1. Upload a non-video file if the test runner supports file attachment.
2. Verify Captrix shows a validation error requiring a video file.
3. Upload a short video under 30 seconds if available.
4. Verify Captrix shows a duration validation error.
5. Upload a valid 30 second to 2 minute video if available.
6. Verify the video preview is visible and the status changes to "Clip loaded".

Expected result: File type and duration constraints are enforced locally.
