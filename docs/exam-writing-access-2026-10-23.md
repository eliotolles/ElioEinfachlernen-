# Writing access from imported exam collections

Verified in live Turso materials version 91: 17 of 18 collections in group
`Bộ đề Ả Rập` contain one writing task each. All 17 have nonempty content
(1,102–2,203 characters). ANDREAS2 has no writing task in current data.

The screenshot showed a Lesen + Sprachbausteine module. Skill tabs only enabled
items in that attempt's current stage; Schreiben appeared disabled even though
its source collection had a writing task. No writing content was deleted.

Add a direct “Luyện Viết” action beside each imported collection containing a
writing task. A module/part attempt also exposes other available source skills
as separate-practice links, marked with an arrow and tooltip. Those links use
the original guarded start handler, including confirmation before replacing an
unfinished attempt. Cancelling preserves its answers and timer. The new helper
does not directly change the attempt. Full timed mock exams retain stage locks;
this feature does not permit skipping ahead to a future timed stage.

Source availability uses filtered metadata only, restricted by collection,
exam and level. Missing skills are never invented. IDs, source content,
permissions, grading and production records are unchanged.

Validation: 251 tests, 250 pass, 0 fail, 1 optional real-PDF test skipped;
Cloudflare build and git diff --check pass. Updated code must deploy through the
existing Cloudflare setup before the new links appear. Live deployed visual
verification remains outstanding; the owner handles Cloudflare deployment.
