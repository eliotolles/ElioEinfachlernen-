# Vercel migration

Prepared from origin/main d1d8e38 on branch migrate/vercel. Cloudflare deployment is unchanged.

Import this branch in Vercel using the Other framework preset. vercel.json sets build:vercel, vercel-public, and the Node.js API handler. Use Hobby with Fluid Compute. Static resources bypass the API; home, the authenticated listening page, robots, sitemap and APIs retain the existing Worker Fetch handler.

Configure server-only environment variables: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, AI_ENCRYPTION_KEY (the original value), ADMIN_EMAILS. Preserve the same Turso database. Do not set ADMIN_INITIAL_PASSWORD unless deliberately bootstrapping a missing administrator. Optional integrations: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, YOUTUBE_API_KEY, TRANSCRIPT_API_KEY, PUBLIC_APP_URL, GMAIL_SENDER_EMAIL, RESEND_API_KEY, WELCOME_EMAIL_FROM.

After obtaining the production hostname, add its /api/auth/google/callback URL to the existing Google OAuth client. Check PUBLIC_APP_URL against the new hostname. Existing browser cookies and local storage do not migrate between origins; users sign in again and cloud records remain in Turso.

Known limit: Vercel Functions cap non-streamed request/response bodies at 4.5 MB. Existing large vocabulary/attachment endpoints accept larger payloads; these require chunked or direct storage transfer before feature parity can be claimed. Validate large imports separately. No live deployment or production data writes have been performed by this migration.

Validation: build:vercel passed; 29 backend tests passed; adapter smoke checks cover dynamic routes, home origin substitution and exclusion of the protected listening page from public static output. Vercel-hosted routing and live integrations still require deployment validation.
