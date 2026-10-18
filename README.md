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
