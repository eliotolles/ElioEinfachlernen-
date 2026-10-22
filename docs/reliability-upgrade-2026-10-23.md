# Elio Einfach — reliability upgrade

Date: 23 October 2026 (UTC+7). Base main: `5afca95180d64c5f41708b34b785e37dae317e16`.

## Behavior

### Synchronization

- Concurrent callers of `Account.flush()` wait for the running save, instead
  of receiving an early successful return while data is still pending.
- Edits made during an in-flight save retain their own queued value and adopt
  only the acknowledged base version for the next compare-and-swap write.
- Late save, refresh and unauthorized responses from another account cannot
  modify the newly active account or log it out. Requests identify their expected
  account; the backend rejects a cookie switched to another account before any
  protected read/write or logout. Existing clients remain compatible.
- Refresh responses apply independently per key in request order. Older data
  cannot regress versions, resurrect a newer deletion or remove a record saved
  while the refresh was in flight.
- Pending/conflict snapshots and refresh snapshots have ordered storage writes.
- Network calls have deadlines: 30 seconds for normal requests, 180 seconds
  for AI/listening requests. Timeouts retain drafts and expose retry metadata.

No automatic overwrite resolution, database migration or permission change
was introduced. Existing server version checks still decide every write.

### AI jobs

- Identical simultaneous work in one page shares one running request.
- Continuation checkpoints are keyed by account, prompt, attachment signature,
  feature, task and explanation language. Separate jobs no longer replace
  one another's partial output.
- The existing legacy checkpoint can still resume, including attachments.
- Results arriving after an account change are rejected before returning or
  storing output. Retry counts and continuation limits remain bounded.
- The existing progress element displays the active jobs; completing one does
  not hide the progress of another. No visual redesign was introduced.

Checkpoints remain on the current device. This change does not claim to run a
browser task after the browser closes or move an active AI task between devices.

### Listening and backup

- Includes the previously verified CC/AI failed-save retry repair and transcript
  service regression coverage described in `fix-verification-2026-10-23.md`.
- Export schema 4 includes the new listening library, personal listening state,
  drafts, progress and unsynchronized changes. Private and shared records retain
  separate scopes and recorded versions. Backend configuration is excluded.
- Schema 4 restoration checks the account, role, outstanding edits and source
  conflicts, refreshes server versions and saves a before-restore snapshot.
  Private admin vocabulary is never promoted to shared data.
- Restore uses current server versions, never the old versions in the backup.
  A later server edit still raises the existing version conflict.
- Schema 3 imports are converted to scoped restore plans against current shared
  IDs. Unknown IDs stay private, even for admins; shared items absent from an
  old mixed backup are retained. New exports use schema 4.
- Backup import size limit is 128 MiB to accommodate expanded vocabulary and
  listening data. This does not change server record limits.

Original uploaded media files, server configuration and encrypted provider
credentials are not included in these study backups.

## Validation

`npm test`: 232 tests; 231 pass; 0 failures; 1 pre-existing optional PDF test
skipped because `ELIO_PDF_LIB_TEST_PATH` is not configured.

`npm run build:cloudflare`: passes (82 text assets, 10 image assets).
`git diff --check`: passes.

Tests cover delayed/out-of-order responses, account switches, edits during a
save, queued storage writes, AI job concurrency, independent continuation
recovery, ownership-preserving restore and network deadlines. The original sync
and AI continuation suites remain in place.

## Deployment and remaining verification

Changes are saved for review, not deployed. No production database writes,
UI redesign, account role changes, new service or paid dependency were used.
Cloudflare is not connected through an available connector in this session;
the existing cloud-browser runtime had been blocked by credential-state recovery.

Before production release: verify authenticated desktop/mobile saves and
subtitle playback with a working browser session, review the diff and deploy
through the existing Cloudflare project. Do not replace the database or restore
an old full backup as part of deployment. The two B1 deck contents still need
their separate database audit; this code upgrade does not complete those rows.
