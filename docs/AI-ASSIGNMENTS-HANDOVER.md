# AI assignments — Lernen — 2026-11-03

Repository: eliotolles/ElioEinfachlernen-. Base: ded290ad0413820a26fa6562897d8f93f3c15feb. This update also fixes the requested sidebar auto-collapse/auto-close behavior.

## Working implementation

- Eight groups map to the 20 existing backend AI_FEATURES. Each actual task has its own primary configuration ID and ordered fallback IDs. No task, score, provider answer or saved-success result is simulated in production code.
- New API configurations are saved as `unassigned`; they are excluded from normal task routing. Saving a key opens suggestions for exactly that saved configuration. Closing/defer does not assign it.
- Model suggestions use live server-side provider catalogues. Gemini uses models.list, Groq uses /openai/v1/models, OpenRouter uses /api/v1/models with the existing price-zero/JSON restrictions. No dated model list remains in ai-models.js.
- A model being listed is distinct from verified input capabilities. Gemini generateContent alone does not verify image/audio/PDF/video. Groq's list does not establish input modalities. OpenRouter's input_modalities are used when present. An explicit image probe requires reading a known test image correctly (a generic {ok:true} response is rejected), and records image input evidence, not OCR accuracy, PDF or pronunciation ability.
- Native dialogs are appended to document.body, with scrollable body and accessible header/footer, focus trapping, Escape/defer, focus restoration, background scroll lock, disabled duplicate submission and no preselected task checkboxes.
- A proposed primary preserves the old primary in the fallback chain. Adding a fallback deduplicates IDs. Explicit list editing shows before/after and supports reordering/removing only after confirmation. Limits are enforced server-side.

## Server contract and storage

Admin routes (existing super_admin guard and origin/session checks):

- GET /api/admin/ai/assignments — supported tasks, safe config fields/capabilities, explicit routes, inherited routes, version and limits.
- PUT /api/admin/ai/assignments — version + selected changes + baseline signatures. Single compare-and-swap write; conflicts/invalid selections cause no partial assignment write.
- POST /api/admin/ai/catalog — provider or saved configuration ID. Keys stay decrypted only on the server while calling the provider.
- POST /api/admin/ai/test — existing endpoint; optional kind text/image for targeted probes. A real provider response is required before recording evidence; image evidence additionally requires the correct text from the test image.

No schema migration. Global administration scope matches the existing app_ai configuration. app_config keys aiFeatureRoutesV1 and aiEvidence:<configuration-id> contain routes/capability evidence, never API keys. Existing encrypted app_ai secrets remain in place and are not included in assignment responses.

Explicit feature routes execute the saved primary followed by up to three fallback configurations, 25 seconds/model and one attempt per model per server request, with a 110-second overall bound. No extra model rotation, raced support or demo answer is inserted in this explicit chain. The existing client retains its bounded retry/continuation policy. Features not explicitly configured retain existing legacy routing and grader prompts.

Model signatures prevent a changed model under the same configuration ID from silently becoming assigned. Deleted/disabled/changed configurations are flagged and skipped; the backend reports failure if no confirmed compatible configuration remains. Legacy configurations without a job are included in baseline preservation when they are actually eligible.

## Deliberate capability limits

- The admin page does not yet provide native audio/video/PDF capability probes. Their capabilities remain “Chưa xác minh” unless a verified provider catalogue supplies them. New suggestions cannot assign these input-dependent tasks without verified compatible capabilities. Existing legacy assignments are not reset.
- TTS remains in the existing separate speech configuration. Text dialogue is not STT, TTS or pronunciation assessment.
- Metadata and input probes do not prove pedagogical quality, free quota or exam accuracy.
- No live provider keys were tested or changed by this implementation session. Browser QA used explicitly labelled local in-memory fixture configurations; fixtures are excluded from release.

## Validation and files

65 targeted tests passed, including seven new backend assignment tests: admin denial/key privacy; no auto-assignment; OCR exclusion; selective atomic save/version conflicts; preservation/deduplication; configured fallback order/provider errors; actual timeout advancement; concurrent-writer CAS; image evidence scope. Existing AI routing/continuation, admin, navigation, planner, import and vocabulary checks also passed. The existing admin-delete test fixture was corrected to explicitly initialize its isolated database before seeding; product deletion logic was not changed.

Both build:vercel and build:cloudflare passed. Browser QA covered suggestions before key entry (apply disabled), saving API opens correct model (still unassigned), one checked task applies exactly one task, no checked boxes by default, unknown-image OCR disabled, desktop/mobile popup bounds and dark mode. Mobile measured 375 CSS-pixel document width equal to viewport, dialog top 12 and bottom 832 in an 844-pixel viewport. Sidebar measured 76px at 1024px, and closed after selecting a route on mobile.

Changed application files: worker/index.js; public/admin.html; public/admin.css; public/js/admin.js; public/js/ai-models.js; public/js/ai-assignments.js; public/js/editorial-ui.js. Tests: tests/ai-assignments.test.mjs and the admin-delete fixture initialization. Temporary QA server/dev script must never ship.

## Official metadata references

- https://ai.google.dev/api/models
- https://console.groq.com/docs/models
- https://openrouter.ai/docs/api/api-reference/models/get-models

## Deployment

The existing production application is https://eliolernen1.vercel.app/. Release through the existing GitHub integration on main; preserve the existing environment variables and Turso database. Verify deployment status against the exact release commit. The old elio-einfach Vercel project remains account-blocked and must not be used as a substitute. No paid resource or new environment variable is needed.
