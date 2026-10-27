# Full grammar rewrite — 2026-10-27

The owner rejected the earlier generated 165-topic / 513-question pack. That
content and its build-atlas.py generator remain withdrawn. Do not restore it.

The replacement covers every supplied topic label: 165 unique topic entries,
385 level memberships after de-duplication within each level. The long-form
teaching consists of 42 related units: 40 new Vietnamese/German explanations and
the two reviewed Akkusativ/Dativ chapters, whose IDs/content/questions are kept.
Topic entries deliberately share the longer relevant unit; this is clearly
labelled in the reader. Do NOT describe this as 165 independent long-form lessons.
Each new topic has a distinct focus and explicit answered practice question,
plus related revision practice. There are 223 unique questions (including the
24 existing case questions), reused where related topics share a teaching unit.

New authoring: content/grammar-rewrite/01-*.md through 40-*.md,
practice.tsv, unit-practice.tsv; reviewed cases: content/grammar-reviewed/.
Topic/level source: scripts/grammar-authoring/requested-topics.json.
Explicit grouping: scripts/grammar-authoring/rewrite-map.py.
Rebuild: python scripts/grammar-authoring/build-reviewed.py.
Build-full-rewrite.py compiles normalized unit/question references to avoid
shipping repeated copies of each teaching unit. Runtime entry content retains
compatibility with the existing reader/search/exercise engine.

Coverage: docs/GRAMMAR-REWRITE-COVERAGE.md. Every unit has rules/usage,
construction/tables, worked German/Vietnamese examples, sentence-writing
instructions and cautions/errors. Explanations and questions are independently
authored, not a translation/reproduction of an external course or quiz bank.
Official reference links are for checking rules, not an endorsement/certification.
Automated checks validate coverage, tables, offline keys, rendering and read-only
boundaries; they do not certify pedagogy. Cases and advanced subjects are linked
to their primary grammar references for further checking.

No DB access/migration, no deletion of imported/account material, study progress,
ownership or history. Existing imported lessons remain reachable through their
source filter, with original edit permissions. The static library remains
read-only. Opening a lesson may update the current-lesson bookmark through the
existing engine; grading/history is written only through the existing actions.
