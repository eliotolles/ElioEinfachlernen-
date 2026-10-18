# Elio Einfach

An integrated, buildless German learning app. HTML, CSS and Vanilla JavaScript; no Node.js installation and no application backend required. Green, white and black visual identity. This extends the existing Tolles Deutsch project on the same origin, keeping its dt: user data.

## Start

Open the hosted app, create/sign in to a local account, and use ✧ AI to configure Gemini and/or Groq. Choose Vietnamese, German or English in the top bar. In Settings choose the AI explanation language separately, light/dark/system appearance, Lexend/Patrick Hand handwriting, green accent or a custom color, and daily XP target. No API keys are embedded in the source.

For the downloaded source use HTTPS static hosting or a local HTTP static server. file:// localStorage behavior differs between browsers. This does not need a build step.

## Modules

- Overview: real XP, daily goal, streak, completed lessons, mastered words, learning activity and weak grammar topics. A new account starts at zero.
- Grammar: 24 authored A1–B2 lessons with explanations in VI/DE/EN and 72 exercises across gap fill, multiple choice and sentence building. Deterministic grading for answer-key exercises; AI suggestions for imported exercises lacking an answer key are labeled AI. Lesson completion and errors are saved.
- Vocabulary: retained Excel/CSV/PDF/Word imports and three game modes. Named collections, generic reviewed imports, due-card SRS with Again/Hard/Good/Easy and independent DE→VI / VI→DE schedules. A simple spaced-repetition scheduler is used, not a claim of FSRS/Anki equivalence.
- Writing: retains 12 Goethe/telc/ÖSD A1–B2 profiles, 23 authored practice tasks, named import folders, separate drafts and part selection, form exercises, AI corrections and models. Four 0–5 metrics remain learning indicators, not an official examiner score. Uploaded task requirements take precedence.
- Speaking: topics A1–B2, separate Goethe/telc B1 part topics, custom imported collections, push-to-talk German recognition, AI replies with browser TTS, speed control, replay, translations, corrections and save-word buttons. Text input is always available. This is turn-based transcript→LLM→TTS, not a realtime audio model with interruption handling. Recognition can use the browser provider's service and may require a supported browser/network. No pronunciation or acoustic-fluency scoring is claimed.
- AI Tutor: German conversation at the selected level, explanations in the chosen language, up to three corrections per turn and vocabulary suggestions. Recent conversations are stored per account and session/topic.
- Mock exams: timed Writing and B1 Speaking practice. Uses existing writing folders or separately imported collections. One task per part is used in a timed attempt. AI partner turns in speaking do not reveal corrections during the exam. Feedback is available after submission/time expiry. Answers and active attempts persist; feedback is a practice estimate. Reading, Listening and Language Elements have since been added; see the complete-format update below.
- Settings: user-specific preferences, backup export/restore, API configuration and source download. Passwords, user hashes and API keys are excluded from exported learning backups. Restore affects the current local account only and asks before replacing matching data.

## Import in all five modules

Writing, Speaking, Vocabulary, Grammar and Mock Exams support named material imports. Supported formats as applicable: PDF, JPG/PNG/WebP, DOCX, XLSX/CSV and JSON. File size limit: 10 MB; PDF page limit: 100, with an explicit error rather than silent truncation. Names and structured previews can be edited before saving. Existing writing imports keep a dedicated task/part preview; other new modules use an editable JSON preview.

PDF processing reads each page, with neighboring pages as context for tasks that continue across pages. Gemini renders pages to read images, scans and layout. Without Gemini, Groq can use a PDF's text layer, and a warning states that image text may be missing. The page report identifies failures; the preview must be checked before saving partial results. DOCX is processed in chunks; check tasks spanning chunk boundaries. AI can still omit content even if its response is valid; page processing is not proof of perfect extraction. Original source files are not stored as base64 in localStorage.

XLSX/CSV vocabulary columns: de, vi, type (example optional). Structured learning imports: title, content, level, teil, skill, exam, minutes, exercises where available. JSON imports accept an array or items/tasks/words wrapper. An imported grammar exercise should use {type, question, answers:[...], explanation}; missing answer keys use AI checking. Preserve source answer keys and distinguish generated suggestions.

## Files

index.html, grammatik.html, wortschatz.html, schreiben.html, sprechen.html, tutor.html, pruefung.html, settings.html and style.css. Shared scripts: auth.js, ai.js, core.js, import-hub.js, pdf-import.js, exams.js, lessons.js. Module scripts: dashboard.js, grammar.js, wortschatz.js, srs.js, schreiben.js, conversation.js, simulator.js and settings.js.

## Data and dependencies

- Existing dt:_users / dt:_current and dt:<username>:wc/drafts/vocab/history/ai remain compatible.
- New per-user keys include settings, materials, lessons, grammarAttempts, events, conversations, srs, activeExam and examAttempts.
- Local-only login is a convenience profile selector, not secure authentication. Anyone with access to the browser can inspect its storage. Do not reuse important passwords. API keys are user-managed and browser-visible.
- Clearing site storage or using another browser/device removes access to local data; use backups. The origin is retained to preserve existing browser data.
- AI uses Gemini then Groq on Gemini 429/503/404 or missing Gemini key for text. Both output limits remain 8000 tokens. Images require Gemini. Network/API quotas, model availability and provider CORS affect operation.
- CDN dependencies: SheetJS 0.18.5, Mammoth 1.8.0, PDF.js 3.11.174, Google Fonts Lexend and Patrick Hand. Imported educational content remains in its original language; interface controls and authored explanations support VI/DE/EN. Some legacy processing/status messages remain Vietnamese.

## Validation

All local JS files pass node syntax checks. HTML files were checked for balanced structure, duplicate IDs and local asset references. VM-based mocked tests cover all eight page bootstraps, user-specific language/theme/progress, XP deduplication, grammar checking, collection separation, legacy drafts, SRS schedules, Gemini/Groq fallback/token limits, AI conversation persistence, timed Goethe B1 Writing parts and saved exam feedback. PDF tests cover complete page iteration, page failure reports, neighboring context, cancellation on account switch and document disposal.

Browser UI, live AI APIs and real microphones/TTS have not been tested in this environment. Functional tests use mocks; no claim of a live voice or API validation.

Official format references are linked from the writing profiles. Speaking B1 distinguishes Goethe: planning/presentation/feedback, from telc: getting acquainted/topic discussion/planning. Tasks and lessons in this app are independently authored practice content, not official exam papers.

## Speaking selection update

Separate Exam and Part/Topic selectors. Goethe/telc topics are filtered before part selection; A1/A2/B2 general speaking topics appear under everyday conversation. Imported mixed collections are grouped using exam metadata or an identifiable exam name in the title, and filtered by level when provided. Topic IDs and conversation keys are preserved. Interface labels are available in VI/DE/EN.

## Writing import part assignment

Before uploading select “Import into which part?”: automatic heading/metadata detection, or a specific part for all extracted tasks. The extraction retains source part information; explicit target assignment takes priority in the preview. Unknown or invalid automatic classifications remain unassigned and must be selected before saving. Each task can still be reassigned in the preview. Part choices follow the current exam and level. Labels support VI/DE/EN.

## Complete examination-format update · 18.10.2026

New exam-formats.js contains 12 standard adult/general examination profiles (Goethe, telc, ÖSD × A1–B2), with all 50 skills/subtests, part descriptions, verified counts where available, module times, shared-time blocks, speaking preparation and official source links. ÖSD B1 is ZB1, not ZDÖ B1. telc profiles are Start Deutsch 1/2 and Deutsch B1/B2 Allgemein, not DTZ, A2·B1, Beruf, Pflege or Schule. Goethe B2 uses the current modular format, including two Speaking parts.

The simulator supports three modes: a complete examination, a complete skill/shared time block, or custom single-part practice. Shared telc reading/writing (A1/A2) and reading/language-elements (B1/B2) clocks run once for the combined block. Preparation is a separate phase. ÖSD B2 includes the minimum 15-minute break after Listening specified in the linked implementation rules. B2 speaking uses the pair-exam training duration; the overview also states individual/pair ranges.

All profiles offer Reading, Listening, Writing and Speaking. telc B1/B2 additionally offer Language Elements. Authored practice tasks are kept separate from official format metadata and explicitly labeled; they are NOT official papers or evidence of equivalent difficulty. Some objective examples simplify presentation and exercise mechanics. Import your model papers to reproduce their exact content. Known objective item counts are checked before complete-subtest/full attempts; unspecified counts are not invented as official facts. Coverage checks report missing parts, questions, listening material or required photos rather than silently skipping them.

New exam-bank.js supplies authored practice content; exam-media.js stores user-added audio/photos as Blobs in IndexedDB with user/profile/collection/task keys. File limit: 20 MB. Speaking photo tasks require a photo or suitable source image before a full attempt can start. Audio may come from imported HTTPS media, a local uploaded file, or a clearly marked browser-generated voice reading a supplied transcript. Machine voice is not an official recording. Known replay limits are applied; source transcripts stay hidden until submission. Objective questions are checked against supplied keys only. Missing keys stay ungraded; AI never fills in official objective keys. Writing and Speaking receive practice AI feedback, not certificate scores or pronunciation scoring from text.

Import preview JSON for an exam item: {id,title,content,exam,level,skill,teil,questions:[{id,prompt,options,answer,answerSource}],transcript,audioUrl,imageUrl,requiresImage}. skill uses reading/listening/grammar/writing/speaking; original German names are normalized. Unknown keys may be null. Media files are stored locally in IndexedDB and are not included in JSON learning-data backups; reattach them after moving devices.

Research sources: official Goethe accessible model tests at bfu.goethe.de for Start Deutsch 1, A2, B1 and modular B2; official telc examination pages and linked model materials; official ÖSD ZA1/ZA2/ZB1/ZB2 pages and linked model PDFs; ÖSD ZB2 Durchführungsbestimmungen October 2023, as linked from the current ZB2 page. Each skill's official source is linked in the UI.

Additional mocked validation: all 12 profiles/50 subtests, complete skill coverage and item-count checks, joint telc clocks without double-counting, missing-section detection, null keys remaining ungraded, and migration of older active examination attempts. Browser rendering, live AI, real audio playback and IndexedDB media persistence remain unverified in a real browser environment.
