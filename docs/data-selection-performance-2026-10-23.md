# Data selection latency — 23 October 2026

Base main: `1f61751d421d88d4d41a71f3d2d6083956eea34d`.

## Cause and changes

The exam collection renderer called `Auth.get('materials')` inside its folder
loop, and again for edit controls and group actions. That API deep-clones the
entire shared/personal JSON, including original page images and vocabulary.
Thus browsing 18 exam folders could copy the complete materials record dozens
of times. Setup previews also normalized source OCR choices unnecessarily.

- Add an internal account projection that preserves shared/personal precedence,
  pending/conflict selection and duplicate IDs, then clones only its result.
  Existing `get` and all write/version/permission checks are unchanged.
- Build one metadata map per exam catalog render. Setup selectors use lightweight
  task summaries; opening an exam reads only the selected collection.
- Vocabulary catalog and Quiz/SRS level controls read vocabulary collection
  headers, excluding nested word data and unrelated exam content/images.
- Hash navigation within the active root document only dispatches hashchange;
  it no longer sends synthetic cloud/resume events that rebuild hidden modules.
  Browser back/forward still dispatches the route change.

This updates data access code, not production learning records. No content,
IDs, names, ownership, progress or database versions are rewritten.

## Verification

248 tests: 247 pass, zero failures, one existing optional real-PDF test skipped.
The complete suite was run with `--test-concurrency=1`.
Cloudflare build and `git diff --check` pass.

New tests check scope precedence, isolation from returned-object mutation,
account changes, exclusion of nested payloads, selected-collection reads and
root-document detail navigation. Existing exam editing, import, vocabulary,
Quiz, sync and version-conflict tests remain passing.

A synthetic 8.28 MB / 36-folder read benchmark in Node measured 236 ms for
repeated full-record reads versus 0.48 ms for one projected metadata map.
This is a reproducible example of the removed work, not a phone/browser speed
claim. A live telc B1 click timed out in the cloud browser before this change;
after-deployment device measurements remain outstanding.

Update main only; the owner handles Cloudflare deployment and live verification.
Existing database content enrichment and OCR correction remain separate tasks.
