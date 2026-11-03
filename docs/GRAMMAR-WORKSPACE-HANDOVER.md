# Grammar workspace UI

## Scope

Presentation and existing-data integration only. No Worker/API, schema, role, AI evaluation prompt, source lesson, lesson ID, ownership or production data changes. Common sidebar/header untouched. Existing import/editor/AI tools remain available under their existing permissions.

## Files

- `public/grammatik.html`: loads read-only workspace projection before the existing lesson engine.
- `public/js/grammar-workspace-core.js`: validated routes, source grouping, actual progress classification and version-key-matching session results.
- `public/js/grammar-atlas-ui.js`: catalogue, filters, lesson routes, three tabs, results view and retry controls.
- `public/grammar-atlas.css`: scoped responsive editorial workspace and mindmap styles.
- `public/js/grammar-mindmap.js`: zoom, pan, center, expand/collapse and full-size list view; all branches derive from saved lesson content.
- `public/js/grammar.js`: no longer writes an empty grammarSession merely because another lecture was opened. Existing grading, history, XP and explicit completion controls remain intact.
- `tests/grammar-workspace.test.mjs`: projection, invalid route, stale feedback and draft-preservation regressions.

## Data and progress

Sources are the existing `grammarItems()` (existing materials imports + existing C1 fallback pack). Group by an existing `group` field, or source collection if no group exists. No new topic classification or missing lesson text is generated.

- Completed: existing `lessons[lessonId]`.
- In progress: an actual answer/built sentence/feedback in `grammarSession`, or existing `grammarAttempts`.
- New: no such evidence. An empty automatically rendered question is not evidence of starting.
- Card counts are actual exercise counts; checked counts only come from matching current-session feedback.
- Results show checked responses from the current lesson session, gated by the existing exercise key. They are not fabricated exam scores or a replacement for account history.
- Retry clears only wrong responses in the current exercise session. Correct responses, attempts/history, XP events and completed lessons are retained. It starts at the first wrong question; the existing question navigator remains available.
- The existing backend stores one current `grammarSession`. This UI does not introduce a multi-lesson draft database or claim historical result coverage beyond available session data.

## Routes and navigation

`grammatik.html#level=B1&q=...&status=active&lesson=<existing-id>&collection=<existing-collection-id>&tab=lecture`

Tabs: `lecture`, `mindmap`, `practice`. `results` is a nested view of Bài tập, not a fourth tab. Filter-only routes open the catalogue. Browser history preserves filters and saved list scroll. Internal TOC links scroll within the lecture without overwriting the lesson route. Module route changes emit the existing hashchange notification for the persistent iframe router. Unknown/deleted lesson links show a real missing-content state.

No global per-account onboarding flags or additional account storage were introduced.

## Content rendering and mindmap

Existing restricted LearningContent Markdown renderer retained. Wide tables remain in their own keyboard-focusable horizontal scroller. Desktop uses article + right TOC; mobile uses a collapsed TOC above the article. Existing source/OCR, additions and explanations remain accessible. Missing lectures/exercises show empty states.

Mindmaps organize existing text only; the UI does not call AI or invent rules. Large diagrams scroll inside a viewport; +/- zoom, selectable zoom, centering and pointer panning are available. Buttons and branch summaries remain keyboard accessible; a readable list view expands branches without shrinking text.

## Validation

- Targeted grammar/import/mindmap/workspace/navigation tests passed (23 tests).
- Vercel and Cloudflare build checks passed.
- Browser QA used a disposable in-memory SQLite database with the real existing Worker API and explicitly synthetic lesson fixtures, not production student records.
- Checked: B1 filtering; correct lesson + three tabs; draft text retained across tab changes; correct/incorrect feedback and explanations; results; retry incorrect responses; TOC/table layout; desktop light/dark; mobile 390×844 iframe viewport (375 CSS px content width equals scroll width); existing mobile drawer/dark preference.
- The QA HTTP-only crypto compatibility shim, seeded accounts, preview server and mobile harness are temporary and excluded from the shipped code.
- Production authentication/provider calls and production account data were not modified as a test.
