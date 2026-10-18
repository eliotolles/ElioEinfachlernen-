# Elio Einfach — audit against owner requirements

## Implemented and checked

| Requirement | Evidence / status |
|---|---|
| Email/password login and registration | `/api/auth/register`, `/api/auth/login`; live login verified, signup/validation covered in tests |
| Three owner-approved Super Admin emails, regular new users | Reserved emails configured only as server secrets; live database has 3 admin accounts; role escalation rejected in tests |
| Password lifetime 90 days, warning at 7 days | Server session checks enforce expiry; change requires current password and different new password; existing sessions revoked; automated tests pass |
| Turso account-owned records | Live write and second independent login read verified; anonymous reads rejected |
| Private/shared materials together | Shared store + per-account records, merged in normal learning views; user cannot update shared endpoint or alter shared items through private records; tests pass |
| Shared deletion/edit restricted to admins | Server authorization + guarded × buttons; admin JSON content editor for imported materials/writing tasks/vocabulary |
| Personal drafts, answers, corrections, progress, settings | Online records include writing feedback/history, exams, grammar drafts/results, quiz sessions/results, speaking transcripts/analysis/drafts, SRS state/review history, XP/streak events and settings |
| Study history visible | New paginated history page for writing, exams, grammar, quizzes, conversations and SRS reviews |
| Offline queue and conflicts | IndexedDB cache/pending/conflicts (localStorage fallback); optimistic versions; local/remote conflict choice with local backup; live stale-write rejection tested |
| Legacy migration / backup | Old local password checked; only empty online buckets imported; export/restore include new record types; secrets excluded |
| AI configuration admin-only | Keys encrypted AES-GCM at rest, metadata-only list, add/toggle/test/delete, editable priority; no keys returned to users |
| AI fallback | Priority, temporary cooldown, timeout/HTTP failure fallback; tests simulate Gemini 429 -> Groq; real provider calls not yet verified |
| Voice/image task capability | Browser speech recognition/TTS remains; vision routing restricts providers and checks capability flag; full provider/image testing requires keys |
| Theme / name / font / logo / homepage text | Admin config API and UI; learner customization retained |
| Turso Free | Existing Free organization retained, no paid resource or plan enabled |

## Partial or not yet implemented — do not describe as complete

- Email verification and password-reset email delivery: no mail provider configured. Owner admins are pre-provisioned; reserved addresses cannot be claimed by signup. Ordinary email ownership is not verified.
- Full arbitrary page/layout editor: not implemented. Admin edits configured branding and imported content through forms/JSON; hard-coded authored exam templates and new app behavior still require source edits/redeployment.
- UI localization: learner/account language support remains VI/DE/EN, but some new admin, history and sync labels are Vietnamese/bilingual rather than fully translated.
- Per-bucket online JSON limit remains 1.5 MB. This is an application write limit, not the Turso database quota. Oversized writes stay pending and show an error; no silent deletion. Large-scale data needs a future finer-grained record migration.
- Original PDF/image/audio files are not cloud stored. Local attached original exam media does not follow another device.
- Auto-marking quality, speech support, scanned PDFs and quota behavior with real AI keys are unverified. Admin must add compatible model keys.
- Browser UI QA across real laptop/mobile hardware has not been performed. Automated client boot and API tests are not equivalent to complete browser testing.
- Sites owner-private audience is unchanged. Other people need access granted through Sites before they can reach the app's own registration page.
- The old app did not save every older correction/transcript. Migration can transfer only data that actually exists locally; it cannot recover previously unsaved feedback.

## Source and deployment

Source is maintained in the GitHub repository and the canonical Sites repository. Server secrets (Turso token, key encryption secret, admin bootstrap password/email list) are intentionally outside Git. Tests: `npm test`; build: `node scripts/build.mjs`; artifact validation: `node scripts/validate-artifact.mjs`.
