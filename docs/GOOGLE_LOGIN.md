# Google login and welcome emails

The features remain disabled until their server credentials are configured. Existing email/password login continues to work. No credentials belong in public JavaScript or GitHub.

## Google

1. Create an OAuth web application in Google Cloud / Google Auth Platform. Configure the consent screen for your intended users and publish it when ready; testing mode only allows configured test users.
2. Add this exact authorized redirect URI:
   `https://elio-einfach.dat-nguyenviet-1999.workers.dev/api/auth/google/callback`
3. In the existing Cloudflare Worker, set `GOOGLE_CLIENT_ID` and the secret `GOOGLE_CLIENT_SECRET`.
4. The Google option then appears on login and registration. New Google users get a new user account. Returning Google users keep their user ID and progress.
5. Existing password users must first sign in with their password, then open Settings and choose **Liên kết tài khoản Google**, selecting the same email. Linking preserves the password, role, user ID and learning data; it does not merge accounts. Blocked accounts stay blocked.

OAuth uses PKCE, a short-lived HttpOnly state cookie, a single-use database flow, nonce validation and Google's RS256 signing keys. Google access tokens are not stored. Password expiry does not apply to accounts created with Google; existing password accounts retain their password policy.

## Welcome email

1. Verify a sender domain you own in Resend and configure the required DNS records.
2. In the existing Worker, set secret `RESEND_API_KEY` and `WELCOME_EMAIL_FROM`, e.g. `Elio Einfach <hello@your-domain.com>`.
3. Keep the provider on its free plan. This code never upgrades the account or enables paid overages.

Only newly created accounts attempt one welcome email. The backend atomically reserves at most **100 sends per UTC day** and **3,000 per UTC month**, across Worker instances. Failed sends still consume their slot; there is no retry, queue, refund or next-day catch-up. Accounts created when sending is disabled or capped still work normally. UTC day resets at 07:00 Vietnam time. These caps cover this feature, not unrelated sending through the same provider account.

Until credentials and sender verification are configured, no real Google login or welcome delivery has been verified. Test with a new account, then a returning account and a linked existing account after deployment.

Validation: `node --test tests/google-auth.test.mjs` (Node 24 with built-in SQLite); `npm run build:cloudflare`.
