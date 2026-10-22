# Admin playlist import

Open Hören & Diktat → Nhập playlist YouTube · Admin → Cấu hình YouTube Data API key.
Create a Google Cloud project, enable YouTube Data API v3, and create an API key restricted to that API. Enter it in the app's administrator-only configuration. Do not restrict a backend key to browser HTTP referrers. The encrypted key stays in app_config.youtubeSecret and is never returned by state or key-status endpoints. An optional YOUTUBE_API_KEY Worker secret can be used instead; deleting the database key does not remove that environment secret.

Paste a public playlist URL, load the list, select videos, and choose the existing collection name, level and scope above the playlist form. Import appends in playlist order, retaining existing records and skipping matching YouTube IDs in the same collection, level and scope. It does not fetch subtitles or invoke AI in bulk. Existing per-video caption and study controls remain available.

The backend exposes one 50-item page per request; the client follows nextPageToken until finished. Failed loads discard the preview without importing partial results. Private/deleted entries are skipped. Playlists over 5,000 readable videos are rejected explicitly. Imported metadata does not guarantee embedding or subtitle availability. Only a Super Admin sees the UI or can call its endpoints.

References: https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list and https://developers.google.com/youtube/v3/getting-started

Validation: node --test tests/backend.test.mjs tests/listening-title.test.mjs; node scripts/build-cloudflare.mjs. Tests mock YouTube; live configuration and Cloudflare deployment must be verified separately.
