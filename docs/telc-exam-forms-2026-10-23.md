# telc exam forms and handover

## Scope

Continue the existing app; do not rebuild or replace the database. Apply the
same telc presentation contract to existing collections and future imports.
The reference images show Lesen 1–3 and Sprachbausteine 1–2. The last two are
grammar, not Hören. Preserve the source language and actual audio references.

## Implementation

- `public/js/telc-exam.js` provides nonmutating normalization, labelled source
  banks, original numbering, conservative recovery of complete a/b/c choices,
  source-page rendering, import checks and Teil navigation.
- Existing IDs, stored radio values, answer keys, grading and source content
  remain intact. Unreadable or interleaved OCR raises a warning; no answer or
  synonym is fabricated.
- Desktop uses separate source/question columns; mobile stacks both. Existing
  theme, colors and fonts remain. Changing Teil retains answers and timer.
- Every shared import entry point loads the contract. Continuation pages join
  only an explicitly identified parent test/Teil, preserving page references.
  This assembly applies to new imports, not in-place migration of saved IDs.

## Verified

`npm test`: 244 tests, 243 pass, 0 failures, 1 optional real-PDF test skipped.
`npm run build:cloudflare`: passes, 84 text assets and 10 cached images.
`git diff --check`: passes.

Actual rendered PETRA source text was inspected before this checkpoint. All
five Lesen Teil 2 questions can recover their original complete a/b/c choices
without changing stored choice values. The interleaved Sprachbausteine table
requires visual comparison with its original PDF page; automatic guessing is
deliberately rejected. Local tests do not constitute deployed visual QA.

## Production data checkpoint

On 23 October 2026 the authenticated Turso UI confirmed workspace `eliotolles`
(Free), database `elio-einfach`. Shared `materials` version 91 contains 18
collections with exact groupName `Bộ đề Ả Rập`, comprising 106 items. PETRA and
EVA1 are among the confirmed names. The complete materials JSON is about 8 MB;
an earlier full app-state request hit Cloudflare error 1102.

Backup `_telc_material_backup_20261023` was verified: source version 91,
18 collections, 106 items and 18/18 JSON values exactly equal to the live source;
the live version was still 91. It is keyed by source version and material ID.
Recheck the live version before any later mutation.
Do not export account/session/provider tables. No production content repair or
deployment is claimed by this document. Future writes must compare the latest
materials version and preserve all unrelated material/progress records.

The two B1 vocabulary decks remain a separate unfinished task; this form
upgrade does not populate their eight missing vocabulary fields.
