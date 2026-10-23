# Vercel migration

Prepared from origin/main d1d8e38 on branch migrate/vercel. Cloudflare deployment is unchanged.

Import this branch in Vercel using the Other framework preset. vercel.json sets build:vercel, vercel-public, and the Node.js API handler. Use Hobby with Fluid Compute. Static resources bypass the API; home, the authenticated listening page, robots, sitemap and APIs retain the existing Worker Fetch handler.

Configure server-only environment variables: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, AI_ENCRYPTION_KEY (the original value), ADMIN_EMAILS. Preserve the same Turso database. Do not set ADMIN_INITIAL_PASSWORD unless deliberately bootstrapping a missing administrator. Optional integrations: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, YOUTUBE_API_KEY, TRANSCRIPT_API_KEY, PUBLIC_APP_URL, GMAIL_SENDER_EMAIL, RESEND_API_KEY, WELCOME_EMAIL_FROM.

After obtaining the production hostname, add its /api/auth/google/callback URL to the existing Google OAuth client. Check PUBLIC_APP_URL against the new hostname. Existing browser cookies and local storage do not migrate between origins; users sign in again and cloud records remain in Turso.

Known limit: Vercel Functions cap non-streamed request/response bodies at 4.5 MB. Existing large vocabulary/attachment endpoints accept larger payloads; these require chunked or direct storage transfer before feature parity can be claimed. Validate large imports separately. No live deployment or production data writes have been performed by this migration.

Validation: build:vercel passed; 29 backend tests passed; adapter smoke checks cover dynamic routes, home origin substitution and exclusion of the protected listening page from public static output. Vercel-hosted routing and live integrations still require deployment validation.

## Large payload transport (Vercel only)

The Vercel build injects `vercel/client.js` ahead of application scripts. JSON requests above 3,000,000 bytes on state/shared, AI and listening shadow endpoints are split into 750,000-byte chunks. Each HTTP chunk request stays below 1.1 MB including base64/JSON. The server authenticates every request, enforces Origin and X-Elio-User, binds transfers to the account, permits only these four original routes, and re-enters the original Worker handler after exact byte reconstruction. Original size limits, permissions and version-conflict handling remain authoritative. No content is truncated. Other hosting builds are unaffected.

Temporary base64 chunks use a new `app_vercel_transfers` table in the existing Turso database; no existing tables or records are modified by the transport itself. At most two active uploads per account; transfers expire after ten minutes. Successful transfers and best-effort cancellations remove chunks immediately. Expired chunks are removed on the next transfer request (not by a scheduled background job). A database failure can delay cleanup. This adds database traffic/storage, so monitor Turso usage after launch. A single-use atomic claim prevents duplicate commits; if the response is lost, normal record version checks still protect retrying saves. AI requests retain the application's existing retry semantics.

All adapter response bodies use explicit ReadableStream forwarding, without Content-Length, so large state responses use Vercel's documented streaming support. This needs confirmation on the deployed Vercel runtime. Upload timeouts are extended to three minutes only for large data in the generated Vercel session asset. No production secret has been added to source.

Local validation on 2026-10-23: build passed (86 assets/10 images); complete test suite: 255 passed, 1 skipped. Transport tests cover UTF-8 payload above 4.5 MB, account isolation, incomplete/invalid chunks, Origin/account mismatch, route allowlist, concurrent commits, cleanup, response forwarding and browser chunk reconstruction. Live routing, payload streaming, OAuth and production integrations remain unverified until deployment.
