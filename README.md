# Calendar Validation

A responsive, standalone browser app with Calendar Import, Manual Events, and Validation tabs. It accepts CSV/JSON calendar exports and manual entries; compares date and title to pair events, then start/end time and owner/team; and reports matched, mismatched, missing-in-calendar, missing-in-manual, duplicate records, and an accuracy percentage.

## Files

- `index.html` — complete client app; no libraries, credentials, or build step.
- `Code.gs` — Google Apps Script backend for the Google Sheet linked below.
- `README.md` — setup and security notes.

## Google Sheet

[Calendar Validation Data](https://docs.google.com/spreadsheets/d/1xyWWzannTSba1nYfaETe41ECARlMd-9vxWI5oM3JY6c/edit)

Tabs: `Calendar Events`, `Manual Events`, and `Validation Results`.

## Secure backend setup

1. Open the sheet and choose **Extensions → Apps Script**.
2. Replace the editor contents with `Code.gs`.
3. In **Project Settings → Script Properties**, add `ALLOWED_EMAIL` with the exact Google account email that owns/uses the sheet.
4. Deploy as a web app that **executes as the user accessing it** and requires Google sign-in. Do not select anonymous access. The script checks the active Google identity against `ALLOWED_EMAIL` and fails closed if the email is unavailable.
5. Store the deployment URL in the app's backend field.

The static app intentionally contains no Google credential, API key, or shared backend token. Google Apps Script's web app CORS/authentication behavior can differ by account and deployment policy; confirm the signed-in account is returned by `Session.getActiveUser()` and that requests are allowed from the Pages origin before relying on browser sync. The local app remains usable without sync. Do not weaken the endpoint to anonymous access to work around a CORS or sign-in error.
