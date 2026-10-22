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

## Welcome email through Gmail (no sender domain required)

The configured mailbox is `elio.nv260399@gmail.com`, with display name **Elio Einfach**. The Gmail connection in ChatGPT is separate from this website's authorization.

1. Complete the Google OAuth setup above and enable the **Gmail API** in that Google Cloud project. Include the sensitive scope `https://www.googleapis.com/auth/gmail.send` on the consent screen. Do not request mailbox reading or deletion scopes.
2. Preserve the Worker's existing `AI_ENCRYPTION_KEY`; the app uses it to encrypt the Gmail refresh token in a dedicated database table. Rotating this key requires reconnecting Gmail and existing encrypted AI keys.
3. Sign into the website as a Super Admin, open **Settings → Email chào mừng → Kết nối Gmail gửi thư**, select `elio.nv260399@gmail.com`, and grant sending permission.
4. OAuth requests offline access for the sender connection only. Normal learners are asked only for sign-in permissions. A sender authorization does not change or link the admin's login account.
5. To remove this website's access, choose **Ngắt kết nối trên web**. This deletes its stored refresh token; optionally revoke the app in the sending Google account's security settings as well.

Google's OAuth publishing and verification requirements still apply to Gmail's sensitive send scope. External apps in Testing generally receive Gmail refresh tokens expiring after seven days, so that is suitable for testing rather than unattended production. See Google's [OAuth documentation](https://developers.google.com/identity/protocols/oauth2) and [Gmail scope requirements](https://developers.google.com/workspace/gmail/api/auth/scopes). The admin may need to reconnect if authorization expires or is revoked. A stored connection is not proof a delivery succeeded.

The email contains the professional Vietnamese welcome message and a link back to the app, encoded as UTF-8 plain text. No actual mail is sent by setup or the automated tests. The next newly created account triggers a welcome attempt after authorization is complete.

### Optional Resend alternative

If Gmail is not connected, the existing optional Resend configuration can still be used: verify a sender domain you own and set `RESEND_API_KEY` and `WELCOME_EMAIL_FROM`. A failed Gmail send does not fall back to Resend or retry, avoiding duplicate sends. Disconnecting Gmail re-enables Resend if those credentials are already configured.

Only newly created accounts attempt one welcome email. The backend atomically reserves at most **100 sends per UTC day** and **3,000 per UTC month**, across Worker instances. Failed sends still consume their slot; there is no retry, queue, refund or next-day catch-up. Accounts created when sending is disabled or capped still work normally. UTC day resets at 07:00 Vietnam time. These caps cover this feature, not unrelated sending through the same provider account.

Until OAuth credentials and the Gmail sender authorization (or optional Resend sender verification) are configured, no real Google login or welcome delivery has been verified. Test with a new account, then a returning account and a linked existing account after deployment.

Validation: `node --test tests/google-auth.test.mjs tests/gmail-sender.test.mjs` (Node 24 with built-in SQLite); `npm run build:cloudflare`.
