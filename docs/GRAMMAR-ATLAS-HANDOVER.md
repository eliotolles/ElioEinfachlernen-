# Grammatik A1–C1 · catalogue and reader

Base: `ee027a25d18e549ba38d72f197713c60794fa297` on `migrate/vercel`.

## Requested scope

The user's replacement topic list is recorded verbatim by level in
`scripts/grammar-authoring/requested-topics.json` (the accidental `svg` suffixes
in C1 links are excluded). Exact duplicate `im Dativ` entries in A2/B1 are
collapsed within that level. All cross-level occurrences remain available:
A1 70, A2 109, B1 118, B2 70, C1 18; 165 unique titles / 385 level entries.
Fragments such as `im Dativ`, `mit bestimmtem Artikel`, `mit was und wo`
receive explicit scope subtitles, rather than a claim about the unseen source
site's parent heading. Levels are the user's requested learning routes, not a
claim of official CEFR exclusivity.

## Authoring

`python scripts/grammar-authoring/build-atlas.py` regenerates
`public/js/grammar-atlas-data.js`. It contains original concise Vietnamese
explanations, German examples/translations, focused traps and corrections,
and 513 authored exercises. Every topic has a fill, a multiple-choice question
with distractor explanations and a fixed-model reconstruction; each C1 topic
also has advanced analysis and a further targeted fill task. Reconstruction
explicitly requests the supplied model, rather than claiming other valid
paraphrases are linguistically wrong.

Extended reading reuses Elio's existing authored grammar-book guides in a
collapsed section. Guides are stored once and shared by reference, avoiding
repeating their full text per topic. Original topic images from the earlier
paused 23-topic C1 draft are not used or published by this change.

Reference checks included the official IDS grammis explanations of information
structure, modal verbs, passive, cases and nominal attributes; Goethe grammar
resources; and the user's DeutschAkademie pages for Gerundiv, modal Perfekt,
subjective modality and es. New prose and exercises are independently authored;
this is not a scrape or copy of the linked website's articles or quiz bank.

## State and access

The new catalogue is additive, read-only shipped content. It does not write,
replace or migrate `materials`, `lessons`, `grammarSession`, `grammarAttempts`
or other account records during installation. Existing lessons keep their IDs,
contents, ownership and access rules. They remain in the imported/earlier-book
source filter. Existing saved sessions resume their original IDs. New catalogue
lessons use stable IDs derived from the exact topic title, shared across levels
so revisiting the same topic does not create conflicting copies of progress.

The existing exercise, explanation, scoring and persistence engine is retained.
Static catalogue entries do not pretend to be editable database records; existing
editable imports still use their original controls. To revise shipped authored
content, change the authoring source and regenerate the catalogue.

## Reader

A four-part index, accent-insensitive German/Vietnamese search, A1–C1 level
selector, source selector, actual completion counts, next-chapter controls and
existing-session resume. Mobile catalogue collapses after selecting a lesson
but can always be reopened; the old outer configuration fold stays open on the
grammar page to avoid hiding the new catalogue. Existing exercises/editors remain
mounted and use the previous handlers. Other modules keep their fold behavior.

## Validation

- Build succeeds: 101 assets / 11 images.
- 22 grammar catalogue/engine/content tests pass; client bootstrap and saved
  correction/draft resume also pass.
- Full suite: 304 tests, 298 pass, 5 known database-fixture failures (`app_users`
  missing in four admin-delete tests and one Gmail test), 1 optional skip.
- No database credentials, paid services, migrations or new dependencies.
- A signed-in Elio browser session is still required for visual acceptance;
  build success and deployed assets do not establish authenticated visual QA.
