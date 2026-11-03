# Admin workspace UI — Lernen — 2026-11-03

Base: 21a7e7492ae84885146b2b69ddf495eabe41980f, repository eliotolles/ElioEinfachlernen-. Scope is frontend and existing admin integration only. No worker/backend/schema/provider configuration/production-data changes.

## Navigation and display

Local admin hash routes: overview, content, detail, imports, ai, users, status, appearance. Common application header/sidebar remain unchanged. Existing persistent app routing remains in use. Lists retain search/filter/page state and scroll position when returning from details.

- Overview derives counts from loaded shared content records and AI configuration responses. Loading is shown until a fresh state read completes. Counts are explicitly source-record counts, not invented unique-lesson or pipeline totals. Missing dates/statuses/import authors are labelled unavailable, never inferred as published/completed.
- Content module tabs and filters use actual materials, wc, vocab and listeningLibraryV2 records. Scope is shared content or the current account's own materials/vocabulary, never other students' drafts, conversations or learning history. Desktop uses a table; mobile uses labelled cards and collapsible filters.
- Vocabulary words are grouped by their existing deck ID without changing or duplicating stored words. Detail links expose the original word records. Listening collections link to their actual collectionId children. Exam/source previews retain skill/Teil, questions/options and existing nested items. Markdown uses the existing escaped LearningContent renderer, including tables.
- Source previews are distinct from a full learner/media player. Actual learner module links use existing routes, with known deck/video/collection IDs where supported. Structured content with no renderer is displayed as source data rather than fabricating a mindmap.

## Editing and confirmations

Shared materials/wc entries can be edited in a labelled source JSON form. The existing module editors remain the correct editing route for vocab, listening/media and personal records. This is not a new rich-text or universal media editor.

The editor preserves IDs, ownership, scope, type/kind, progress and child-array structure. It reads the latest server record before saving, compares the selected entry with its original snapshot, replaces only that entry in the latest array, and calls the existing versioned /api/shared endpoint through Account.request. It updates only the shared client cache, avoiding the legacy merged-store setter that can repartition personal records. Existing server version checking remains authoritative. Pending/conflicted records block an overwrite. No delete/recreate operation is used. Failed saves retain the form; successful status is shown only after the server returns the acknowledged new version.

The retained bulk JSON tool is lazy-loaded when opened, not serialized on page load. It adds identity/array preservation, baseline comparison and an explicit shared-content-impact confirmation before using the same existing shared-record API.

User management retains the original backend-approved lock/delete/role handlers. Search and role/status filtering use only fields returned by the users endpoint (which is capped at 500). There are only Super Admin and User roles. Details show email, role, blocked status and created_at; no passwords, keys or private student work. Delete confirmation still requires the exact email. Role and delete confirmations are portal-style native dialogs; backend authorization and protected-admin checks are unchanged.

Native dialogs are appended to document.body, constrain height to the dynamic viewport, keep header/footer accessible, trap focus natively, restore focus, lock background scrolling and block repeated saves. Internal dialog links close before the persistent router handles navigation, preventing a stale top-layer modal from covering the destination module.

Signed-in users opening admin.html receive an explicit permission-denied view before admin scripts initialize. Signed-out/password-expired redirects remain unchanged. This is presentation only; existing backend admin checks still reject unauthorized requests.

## Import and unsupported capabilities

The backend has no centralized import-job list, job lifecycle/cancel/retry API, multi-file administrative upload transaction or administrative audit-log endpoint. Accordingly:

- Import page shows actual saved source documents, not fabricated upload tasks or progress percentages.
- Import dialog selects a destination and opens that module's existing real importer. File/URL/text choices, scope and preview are handled by the original module. It does not pretend to upload files centrally.
- No fake pending/processing/confirmation/completed/error rows, cancel or retry controls are created.
- Reading is managed through the existing exam/Lesen structure; there is no standalone reading-management API.
- Status page shows current-account pending/conflict metadata and an explicit absence of administrative logs. It does not invent uptime, recent activities, actors or provider health.
- The AI assignment/catalog/configuration implementation is retained. Only its already-returned safe configuration summary is reused on Overview; no new provider calls or automatic assignments are added.

## Validation

72 targeted tests passed: seven admin-workspace tests plus existing admin authorization/deletion, AI assignment/routing/continuation, navigation, planner, versioned response, grammar import and vocabulary checks. Both build:vercel and build:cloudflare passed.

Browser QA used a disposable local SQLite backend with clearly named QA documents/accounts, not production data. Verified: overview/list/detail routes; module/search filters retained on back; source Markdown preview; ID-change rejection with form retained; successful original-ID content update acknowledged by the test server (the final persistence helper additionally has a regression check proving personal records and pending personal changes remain byte-for-byte unchanged); import link closing its popup before module routing; explicit User-denied view; mobile cards, dark mode and no horizontal overflow (375px client width = 375px scroll width); mobile edit dialog header/footer within an 844px viewport. Temporary QA server and package dev override are excluded from release.

No actual role changes, deletions, imports, API-key changes or production content edits were performed by the agent. Deployment updates UI source only.

## Changed files

- public/js/admin-workspace-core.js — source inventory, grouping/filtering and edit validation.
- public/js/admin-workspace.js — local navigation, overview, content/source views, import handoff, user filters/details, dialogs and status.
- public/js/admin.js — retain handlers; publish safe UI summaries, defer bulk JSON serialization, delegate confirmations and replace the old flat local navigation.
- public/admin.html; public/admin.css — workspace integration and responsive local styles.
- public/js/guard.js; public/js/loader.js — explicit admin-denied presentation without initializing administrative scripts.
- tests/admin-workspace.test.mjs — identity/privacy/filtering/permission-presentation coverage.

Existing production target: https://eliolernen1.vercel.app/. Use the existing GitHub integration; preserve all environment variables and the Turso database. Verify the release commit's deployment status before claiming it is live.
