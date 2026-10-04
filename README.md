# Calendar Validation

A responsive, standalone browser app with Calendar Import, Manual Events, and Validation tabs. It accepts CSV/JSON calendar exports and manual entries; compares date and title to pair events, then start/end time and owner/team; and reports matched, mismatched, missing-in-calendar, missing-in-manual, duplicate records, and an accuracy percentage.

## Live app and source

- [Open the Calendar Validation app](https://wfmlean.github.io/calendar-validation-app/)
- [GitHub repository](https://github.com/WFMLean/calendar-validation-app)
- [Google Sheet](https://docs.google.com/spreadsheets/d/1xyWWzannTSba1nYfaETe41ECARlMd-9vxWI5oM3JY6c/edit)
- Apps Script project: **Calendar Validation Sheets Backend**
- Web app endpoint: `https://script.google.com/macros/s/AKfycbyS4M2tUtGHQcfG9pjxgmfx4wLNPPWSucMKNJa3JL7eutNF_mng39eeMEsttZq5pLMj/exec`

## Google Sheet tabs

- `Calendar Events`
- `Manual Events`
- `Validation Results`

## Backend access

The Apps Script web app is deployed to execute as the user accessing it, with **Only myself** selected for access. It checks the active Google account against the `ALLOWED_EMAIL` Script Property and fails closed if the account is unavailable or differs. The deployment is restricted to the spreadsheet owner; it is not anonymous or shared publicly. The HTML contains the endpoint URL only, no credential or shared secret.

Google authorization is still required on the first call. In the Apps Script authorization screen, review and approve the project’s Google Sheets access for the signed-in owner account. The deployed app pre-fills this owner-only endpoint; use **Load from Sheets** or **Save to Sheets** after authorization.

## Files

- `index.html` — complete client app; no libraries, credentials, or build step.
- `Code.gs` — Apps Script backend source.
- `README.md` — setup and access details.
