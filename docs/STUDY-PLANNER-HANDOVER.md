# Personal exam study planner — 30 October 2026

Base: production source commit 668e196b8fe2da3391fe3364bd1162bc73d35e79. Target branch: cloudflare-return in ElioEinfachlernen-. No changes to the separate ElioEinfach repository.

The signed-in index page loads a six-step native modal after the existing book shell. It collects exam, self-reported current/target level, exam date, minutes and weekdays, and weak skills. No-date plans cover 12 weeks. It renders daily tasks, dated weekly sessions and four-week phases. Existing destinations are linked at module level; no lesson IDs, official exam scores or missing materials are fabricated. The supplied boy mascot is embedded in CSS and handled by existing image extraction.

A new private studyPlan record uses the existing Account queue, version checks, conflict UI and backup whitelist. Editing and AI generation refresh the latest record before committing and reject changed snapshots. No existing vocab/materials/progress records are replaced. Marks are explicitly self-reported activity completion and do not award XP or imply passing.

After saving, existing App.evaluate is called with feature study.plan. Existing provider fallback and grading code remain authoritative. AI supplies every week's topic and checkable goal; incomplete responses are rejected and the basic plan retained. Evidence sent: limited aggregate grammar outcomes, recent writing criterion scores and completion count; no essays or emails are included. Existing plans are reviewed after seven days on next home visit, once per browser session/day; manual review remains available. This does not run when the site is closed. No scheduled background service or paid provider is added.

Limitations: current level and weak skills are self-report until supported by actual exercises. There is no new validated placement test or automatic pass prediction. Resources open existing modules and require selecting suitable level/task there. Review currently uses grammar and writing scores plus self-reported completion; it does not infer listening/speaking proficiency without evidence. UI copy in this new feature is Vietnamese. Full cross-device/live AI acceptance needs the new Vercel project's environment and authenticated session. No direct database SQL updates or secret exports were performed.

Validation: planner calendar/budget/validation/incomplete-AI tests; existing bootstrap, atlas, session error and persistent navigation checks; Vercel build.
