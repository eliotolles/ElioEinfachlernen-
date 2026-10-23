# Verification — 23 October 2026

Base: `5afca95180d64c5f41708b34b785e37dae317e16`.

## Fixed behavior

A completed CC or AI transcript whose save failed was no longer eligible for
the transcript queue. Retrying could silently skip synchronization. A CC save
error was also caught as though CC retrieval had failed, hiding the write error.
The queue now tracks unsuccessful saves, reports the error and retries the
write before requesting any more captions or AI transcription. Completed text
is retained. Account ownership checks and version conflicts remain enforced by
the existing save callback; no automatic conflict override was added.

Both failures were reproduced with new regression tests before fixing the
queue. They now pass for CC and AI transcripts.

## Automated test repairs

- Direct YouTube parser tests explicitly mock the optional transcript service
  as unavailable, keeping their exact URL, redirect and request-count assertions.
- A separate service integration test uses the real Worker API with an isolated
  in-memory database. It covers timestamp preservation, caching, wrong-language
  and malformed responses, oversized responses, transport failures and quota
  fallback. All external requests are mocked.
- AI transcription tests require rejection of out-of-range timestamps instead
  of accepting an incomplete filtered transcript. Absolute timestamp strings
  on a resumed interval are tested through the real API as well.
- The client bootstrap fixture supports DOM remove, text nodes and children.
- The incremental translation performance test evaluates the translation block
  without accidentally initializing unrelated speech services.

## Results

- `npm test`: 209 tests; 208 pass; 0 fail; 1 skip.
- The pre-existing optional real-PDF test requires `ELIO_PDF_LIB_TEST_PATH` and
  remains skipped in this environment. It was not removed or marked passing.
- `npm run build:cloudflare`: pass, 82 text assets and 10 image assets.
- `git diff --check`: pass.

No production deployment, database mutation, user-role change or UI redesign
was performed. Live authenticated YouTube playback and cross-device behavior
still require verification in a working browser session. These results do not
confirm that the two B1 vocabulary decks have been completed in the database.
