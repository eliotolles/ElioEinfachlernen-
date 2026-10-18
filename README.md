> **Chuyển hosting độc lập:** xem [CLOUDFLARE-DEPLOY.md](CLOUDFLARE-DEPLOY.md). Cấu hình Cloudflare Workers nằm trong `wrangler.jsonc`; mẫu secrets: `.env.cloudflare.example`.

# Elio Einfach

German learning application with Vietnamese, German and English UI. Green/white/black styling, Lexend/handwriting; grammar imports, vocabulary/SRS, writing, speaking and exam practice.

## Cloud backend

A dependency-free Cloudflare Worker serves `public/` and `/api/*`, with Turso accessed by its HTTPS Hrana API. Build: `node scripts/build.mjs`. Validate: `node scripts/validate-artifact.mjs`. Test: `node --test tests/*.test.mjs`.

Configure `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `AI_ENCRYPTION_KEY`, and `ADMIN_INITIAL_PASSWORD` as server-only Sites secrets. Do not commit secrets or put them in frontend JavaScript. The database schema initializes idempotently. The three owner-approved admin email addresses are pre-provisioned when their initial password secret is set; public registration cannot claim these reserved addresses. Each email has independent personal progress. Existing admins are never reset by bootstrap. Ordinary email signup currently does not send verification or password-reset email; adding a mail service is needed for those workflows. No claim of email verification is made by the app.

Auth uses salted PBKDF2-SHA256, HttpOnly/Secure/SameSite cookies, server authorization, login throttling and a 90-day password lifetime (7-day warning). Password changes revoke existing sessions. Roles are not supplied by clients. Sites audience restrictions are preserved; sharing this app with other people still requires the owner to change Sites access separately.

## Data

User data is stored per immutable account ID: imported materials, drafts, writing feedback and history, vocab/SRS, quiz/exam attempts, transcripts, progress and settings. Owner-imported materials/writing tasks/vocabulary are shared by default; users' imports remain private. Shared materials and personal materials display together. Only admins may update shared records. No original PDF/audio/image files are uploaded to the database. Original attached exam media remains local to its device.

Writes queue in IndexedDB (localStorage fallback) and retry; per-record version checks reject conflicting edits, with explicit local/remote choice in Settings and a local conflict backup. Data is synchronized in bucket-sized JSON records (currently 1.5 MB per bucket, not per document): very large accounts must be split into finer records in a later migration; the app reports failures and preserves queued data rather than silently dropping it. Offline access supports previously visited cached pages and a previously authenticated profile; fresh sign-in and AI calls require connectivity. Manual legacy migration in Settings verifies the old local password and imports only empty online buckets; it never sends old hashes/API keys or overwrites remote buckets. Browser private mode/cleared storage can remove unsynchronized data.

## AI administration

Super Admin can add Gemini/Groq/OpenAI configurations, encrypted with AES-GCM using `AI_ENCRYPTION_KEY`; plaintext keys are never returned. Routing uses priority, cooldown, temporary failure fallback and vision-capable models for images. Provider quota rules still apply; multiple keys can share quota. Up to four configurations are attempted per request. Actual provider calls require configured keys. Admin also manages common content JSON, theme/name/logo/homepage text and blocking regular users. New app logic/layout changes still require code deployment.

## Verification and limits

Automated checks cover account roles, private/shared data, version conflicts, password expiry and session revocation, key encryption and temporary AI fallback; client bootstrap for every page, pending writes, conflicts, offline retention, grammar draft/result resume and quiz response history. See AUDIT.md for the requirement-by-requirement status and current limitations. No browser UI QA or real AI provider acceptance test yet. Do not claim full cross-device/production verification until the deployed database connection has been tested. Free-provider quotas and durability/backup policies are external constraints.

## OpenRouter Free (2026-10-18)

OpenAI trực tiếp đã được thay bằng OpenRouter trong Admin. Chỉ `openrouter/free` hoặc mã `:free` được chấp nhận; model cụ thể được đối chiếu catalog giá 0 và hỗ trợ JSON, request đặt trần giá 0, không bật plugin tính phí. Cấu hình OpenAI cũ không được gọi; giữ bản mã để chủ tài khoản tự quản lý.
API key OpenAI không dùng được với OpenRouter. Thêm API key OpenRouter mới trong Admin, không lưu vào repo hoặc biến build.
Model ảnh được kiểm tra khả năng; PDF gốc vẫn dùng Gemini. Free vẫn có quota/khả năng quá tải, không bảo đảm không giới hạn hoặc nhanh hơn.
Nguồn: https://openrouter.ai/docs/guides/routing/routers/free-router và https://openrouter.ai/api/v1/models


### Detailed examiner feedback and continuation
Writing, speaking analysis and exam open responses share evidence-based strict practice grading (four criteria, 0–5 each), task/format checklists, priorities, sentence-level colored feedback, error explanations and prevention, writing plan, corrected response and model response. This is not an official certificate score. Background themes are unchanged.

When a provider reports MAX_TOKENS/length, the browser keeps received JSON fragments under a user-prefixed local continuation checkpoint, counts down 30 seconds and requests the remaining characters using the original prompt and accumulated response. Up to 8 requests per action; repeat the same action to resume a retained checkpoint after failure. No original attachment is saved in that checkpoint (only a fingerprint). Closing the page pauses the operation; this is not a background server job or cross-device partial-response sync. Complete feedback continues to sync normally. Model compliance and provider availability can still prevent valid completion; invalid JSON is reported, never silently graded. The 30-second delay does not reset provider quotas.


### Import multiple tests once across practice modules
The import panel in Writing, Speaking and Exam Simulator extracts all skills and records each explicit parent test heading as `setName`. Preview lets users include/exclude tasks and edit the test name, exam, level, skill, Teil, title and content before confirming the page report. Unknown skill/part must be resolved before saving. A canonical `materials` collection of type `exam` is saved for each name/exam/level group; Writing and Speaking read filtered views with the same stable task IDs. No task copies are written to `wc`. Admin collections use the existing shared-materials rules; user imports remain private. Rename/delete updates the canonical collection across views, without deleting completed attempts. Existing separate imports remain available and are not automatically regrouped.

Extraction is model-dependent: documents without clear test headings may need manual grouping in preview, unreadable pages need re-importing, and image/audio references cannot replace missing media. Page report and manual confirmation are mandatory before saving. This update has automated mock-PDF coverage but has not been checked with a user-supplied real multi-test PDF.


### Multilingual vocabulary and local PDF splitting
Vocabulary imports preserve source English and Vietnamese meanings and fill missing `vi`, `en`, and `meaningDe` (simple German definitions) in batches of 10 via the configured AI. The preview is editable before saving. Vocabulary lists, game answers and SRS show the saved meaning matching the interface language; changing language makes no AI call. Old entries fall back to existing meanings until their owner or Admin uses the enrichment button. Existing English/translated source values are not overwritten. The selected-game answer language is stored with the session; SRS scheduling IDs stay unchanged.

The **Chia nhỏ PDF** tool runs locally using pinned pdf-lib 1.17.1 loaded on demand. It accepts source PDFs up to 200 MB, checks complete page coverage, optionally overlaps pages, and copies pages without modifying the source. Each planned range is at most 100 pages; output ranges recursively subdivide when above 10 MB. A single page exceeding 10 MB is flagged and cannot be imported directly; it must be compressed separately. Results can be downloaded or passed to an import input individually. Results/files are temporary browser memory, never database records. Password-protected files and interactive form/signature documents are not supported; document-level bookmarks/links are not guaranteed to survive splitting. Full browser interaction and real-user PDFs remain to be checked.

Tests include pure coverage/gap/overlap checks, recursive-size splitting, multilingual field preservation and all vocabulary views. Optional real pdf-lib fixture test: `ELIO_PDF_LIB_TEST_PATH=/absolute/path/to/pdf-lib.cjs npm test`. This test checks copied pages/images/source preservation and writes temporary PDFs under `/tmp/elio-pdf-tools-qa`; use `pdftotext` to verify all output text in sequence.


### Collapsible navigation and vocabulary expansion
The header hamburger toggles desktop rail/full sidebar and a mobile drawer. Open/closed state is remembered on the device, `aria-expanded` updates, closed mobile navigation is inert, and Escape/backdrop closes the drawer. EINFACH in the header is muted when open and bold when closed; the expanded sidebar wordmark is muted as requested.

Vocabulary extraction/completion also provides up to three context-appropriate `synonyms` and `phrases` with German examples and Vietnamese/English/simple-German meanings. Native expandable sections in the word list, flashcards and SRS use the saved translations without AI calls when opening/changing language. Empty lists are valid when no appropriate entry is found; AI output still needs user review. Existing words can be enriched with the same ownership restrictions as before.


### Imported document layout and removal of generated grammar filler
Grammar, writing, speaking and mock-exam instructions use a shared restricted Markdown renderer. Existing stored pipe tables are rendered as real semantic tables immediately; headings, numbered/bulleted lists, emphasis and examples are laid out clearly. Wide tables scroll horizontally on mobile. HTML in imported documents is escaped, never executed. New extraction prompts ask AI to keep all source cells in Markdown tables instead of flattening them. This preserves readable content structure, not the original PDF's exact typography or page layout, and cannot recover text omitted by an earlier extraction.

The grammar practice view excludes exercises marked `origin=ai` or `answerSource=ai`, including legacy filler such as “Das ist ____”. Original document exercises remain available, and stored attempts/data are not deleted. Placeholder additions like “Leave empty.” are hidden. Imports no longer auto-generate practice exercises; AI may supplement only sparse theory, using structured Markdown. The manual enrichment button now adds explanations only. Resume checks use exercise identity so an old AI exercise's feedback is not reused for a different source question.


### Grammar reading layout and multiline table recovery
Grammar now has a compact topic navigation column, a typographic article header/body, and a generated in-page outline on wide screens (a collapsible outline on smaller screens). Heading sizes/weights, muted source-page labels/translations, rule emphasis, examples, notes and table cells have separate visual treatments. Existing short colon-terminated section labels and bold-only headings are conservatively recognized as headings; plain source text remains available without AI calls. New extraction prompts explicitly request hierarchical Markdown headings, emphasized rule labels, note blocks and single-line table rows with cell line breaks.

The renderer also joins broken physical lines inside an unclosed pipe-table row, keeping German examples and their Vietnamese translations inside the same cell. No PDF is reparsed or account data overwritten to apply these visual changes. This is a readable lesson layout, not exact PDF facsimile preservation.
