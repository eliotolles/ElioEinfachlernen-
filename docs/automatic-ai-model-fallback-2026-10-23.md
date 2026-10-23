# Automatic AI model fallback

Base main: 6884864c1179254eded7f8ffb8839e82eadddcdc.

The backend already routed work by feature, retried configured providers and
used a general helper on failure. It now also builds bounded model alternatives
without changing saved configuration or exposing API keys.

- Existing enabled configurations retain their order. If none answers, try at
  most two alternate approved model IDs per credential, within the same provider
  and task scope, respecting image/PDF/video/audio compatibility.
- Gemini/Groq alternatives come only from already-enabled compatible models in
  that scope. No catalogue listing is assumed to certify a free pricing tier.
- OpenRouter can fall back from a named free model to `openrouter/free`.
  Requests retain zero-price constraints, structured-output requirements and
  no plugins. No paid model or `openrouter/auto` is added.
- A bounded isolate-local health map temporarily skips failed model/credential
  pairs. Replacing the encrypted credential does not inherit old health entries.
  Existing persistent configuration cooldowns and disabled-key flags still apply.
- HTTP 401/403 blocks further model attempts using that configuration in the
  current request. It is not treated as a model quota failure.
- Admin single-configuration tests remain exact, without automatic rotation.
- Continuation text, attachments and feature/language rules are unchanged on
  alternate attempts. The response includes the selected model and whether it
  was an automatic alternative. Existing client continuation and retry limits
  still apply; no unlimited polling/background execution is introduced.

TTS retains its existing separately managed voice fallback. This change does
not discover arbitrary speech models or enable paid services. If no compatible
configured option remains, the request fails explicitly and the client retains
work for retry; it cannot manufacture capacity after every free quota expires.

Validation: 254 tests, 253 pass, 0 fail, 1 optional real-PDF test skipped.
Cloudflare build and git diff --check pass. Added real-backend tests cover
approved Gemini rotation with an unchanged continuation, invalid credentials,
and free-router fallback with zero-price constraints. No production AI calls,
configuration/database changes or deployment were performed for this change.
The owner handles Cloudflare deployment and live verification.

Reference: https://openrouter.ai/openrouter/free/
