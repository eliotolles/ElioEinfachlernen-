# Direct grammar lesson import

A button beside the existing grammar file uploader opens a native modal with topic title, CEFR target level, Markdown content and optional exercise JSON. Preview uses the existing escaped LearningContent renderer; pipe tables and German/Vietnamese text are preserved. No AI request or automatic enrichment occurs.

Source questions use existing fill/quiz/build types. Missing type is inferred from options or defaults to fill. Every supplied exercise needs source answers and explanation. Theory-only lessons are allowed. IDs are always newly generated; same-title/same-level lessons are blocked rather than overwritten.

Before append the latest materials record is refreshed. Existing Account private/shared routing, version checks, pending queue and conflict controls remain authoritative. Super Admin imports to the shared library; ordinary users import privately. Existing content, ownership, exercise attempts and study progress are unchanged. The UI reports local/pending versus synced saves and prevents repeat submission of a queued import.

Validation: manual import parser, existing Markdown rendering, grammar picker, flat imports and C1 checks; Vercel build. Live new-account Vercel deployment is not accessible through the current connector and has not been browser verified.
