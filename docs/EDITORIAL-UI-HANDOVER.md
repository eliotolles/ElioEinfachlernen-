# Lernen editorial UI handover — 2026-11-03

## Source and scope

Repository: eliotolles/ElioEinfachlernen-. Base: cloudflare-return at bd5179107363ebcc19764454b08d7c94acd1a289. This is the running Lernen application, not a new backend or database.

The shell now loads editorial-ui.js and editorial.css instead of book-ui/book-atlas. Legacy book files are retained as historical source but are not loaded. Existing module DOM nodes are moved, not recreated. The persistent module navigation remains unchanged so drafts, exercise handlers and media state are kept when switching modules.

## Changed files

- public/style.css: shared editorial controls, typography, panels, tables, feedback and dark palette.
- public/editorial.css; public/js/editorial-ui.js: desktop sidebar, mobile drawer, account controls, real-stat overview, module navigation and plan route.
- public/home.html; login.html; register.html; editorial-public.css; js/editorial-public.js: public cover and account forms. Existing form IDs and account-page handlers retained.
- public/js/account-page.js: account-neutral sign-in wording and per-user onboarding defer reset after successful email sign-in.
- public/js/auth.js: language/text-size presentation available to learners; AI configuration and administrative permissions unchanged.
- public/js/loader.js and module HTML files: select new shell/styles; stop loading book artwork/styles.
- public/js/vocab-catalog-ui.js: six navigation entries mapped to the existing catalog and dictionary/daily-situation modules; no deck or import transformation changed.
- public/js/public-home.js: range label A1–C2.
- public/js/study-planner.js; public/study-planner.css: accessible five-step dialog, draft restore, date distinction, per-user defer and actual save status.

## Existing integration contracts

Account.authenticate / Account.ready / Account.logout retain authentication. App.saveSettings retains account-specific preferences and studyOnboardingDraft. Account.get/set('studyPlan'), refresh and flush retain the existing private record and version/conflict checks. The existing study.plan AI task and StudyPlannerCore are retained; no provider/key/model configuration changed.

The survey writes through existing Account callbacks only. A native dialog is appended to document.body, traps focus natively, closes through defer on Escape and restores focus. A per-user sessionStorage defer key prevents reopening on ordinary navigation; a saved survey draft belongs to account settings. Onboarding does not run on login/register pages or a cached child module.

No new AI output, exam score, passing forecast, saved-success status or learning material is fabricated. Preview shows an empty state until a real plan exists. Readiness links to actual saved evidence rather than manufacturing a readiness score.

No database tables, account roles, ownership, IDs, progress, grading prompts, AI fallback logic, import permissions or deployment environment variables were changed. No data migration or rollback performed.

## Validation

28 existing targeted tests passed: study planner, grammar manual import, learning content/Markdown tables, persistent navigation, session response and vocabulary catalog. npm run build:vercel passed (108 assets, 11 images final build).

Browser QA used an isolated in-memory account fixture, never production data: cover, sign-in fields/conditional Google button, authenticated overview, real grammar renderer with Markdown table, catalog, writing form, persistent module navigation (writing draft retained after leaving and returning), mobile drawer, dark/light, five survey steps, TestDaF B2/C1 filter, draft restoration, defer and focus restoration. Mobile layout checked in a 390 × 844 iframe viewport; measured document width did not overflow (375 CSS pixels including scrollbar). This is layout testing, not a real mobile device or production authentication test.

QA server and temporary package dev script are excluded from the release. No fake authentication or fixture data ships.

## Hosting verification

GitHub statuses on the base commit showed successful Vercel builds for eliolernen1 and eliolernen in team elionv260399-9535. The old elio-einfach team has an account-blocked deployment. The connected Vercel app does not yet have access to team_WXLhoVqP0n1GHUywXYBsfQrE (403); production promotion may require granting that team to the existing connection. Do not deploy into the old blocked project or claim production success from a local build. Verify the released commit status and live domain after push.
