# Grammar rewrite after owner review

The owner rejected the newly authored 165-topic / 513-exercise catalogue on
2026-10-27. That pack is withdrawn, including its authoring generator. It must
not be silently restored. Git history preserves the audit trail.

The requested taxonomy remains as a scope reference only. The replacement
library currently contains TWO independently authored, source-reviewed chapters:
Akkusativ and Dativ, each with extensive Vietnamese explanations, inflection
tables, worked German–Vietnamese examples, misconceptions/corrections, and
12 newly authored exercises. The remaining requested topics are NOT completed.
No empty or templated lesson entries are published to conceal that gap.

Authoring files: content/grammar-reviewed/*.vi.md.
Rebuild: python scripts/grammar-authoring/build-reviewed.py.
Published asset: public/js/grammar-atlas-data.js (new elio-reviewed-* IDs).

Reference readings: DeutschAkademie's Akkusativ and Dativ articles, official IDS
grammis explanations of cases and Wechselpräpositionen, Goethe grammar tables,
and LEO's grammar explanations of objects and their order. New text is not a
full translation, scrape or reproduction of the third-party course or quiz bank.
Examples and questions are independently authored. Source links remain visible.
Avoid presenting simplified claims from a source as universal rules, e.g. a
percentage of verbs requiring Akkusativ, or interpreting case signals as a ban
on multiple words carrying endings in one noun phrase.

No account materials, learning history, completions, ownership or private state
are deleted or migrated. Imported earlier material keeps the original IDs and
remains reachable in its source filter. Only the shipped rejected catalogue is
removed. Reader UX and existing grading/sync behavior are retained.

## Review 2026-10-27: complete lesson structure
Both reviewed replacements (Akkusativ, Dativ) now explicitly contain: concept/rule, usage, sentence construction tables, German examples with Vietnamese explanations, step-by-step sentence writing, common errors and cautions, article/pronoun tables, and 12 explained exercises each. Added modal/question/fronted-adverb examples and Dativ mixed pronoun/noun ordering. Review scope is these two static chapters only; account imports have not been audited or rewritten. The full requested A1–C1 taxonomy is still pending. Do not describe two overview chapters as a complete C1 course.
