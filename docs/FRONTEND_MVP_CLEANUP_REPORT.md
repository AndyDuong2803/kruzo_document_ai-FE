# Frontend MVP Cleanup Report

> Historical cleanup report, superseded by `KDA_BUSINESS_UX_IMPLEMENTATION_REPORT.md`.

Date: 2026-07-27  
Scope: Next.js frontend only. No FastAPI source or backend behavior was changed.

## Design system

The visual source of truth is [design-system/MASTER.md](../design-system/MASTER.md).

- Product character: compact, flat B2B document-processing utility.
- Surfaces: neutral solid backgrounds, restrained lime only for primary actions and selected states, 6-8px control radii, 8-12px cards/modals, one subtle shadow.
- Typography: Plus Jakarta Sans, compact page titles, content-first hierarchy.
- Accessibility: semantic status colors exceed WCAG AA in light and dark themes (lowest measured foreground/background ratio: 7.50:1); reduced-motion behavior is respected.

## Delivered product surface

- The current header links to Home, Upload Documents, Previous Results, For Developers, Contact, and account controls.
- Home is reduced to a compact hero, one product preview, three steps, three document examples, compact developer section, four FAQs, and a small CTA.
- `/upload` is a three-stage business workflow with presets, no-code custom fields, batch upload, persisted history, review, and focused CSV/XLSX export. `/try` redirects to it.
- The result modal has one vertical scrolling content region. It shows fields and tables only; it hides raw JSON, provider metadata, spreadsheet chrome, and generic confidence/approval badges. Only explicitly `review_required === true` values are highlighted.
- `/try/api` is a responsive request/response workspace with local-only template edits, JSON validation, a file upload, compact code examples, and sample/loading/real success/real error states.
- Docs are limited to Quickstart, Request and template, Response, Errors and limits, and Examples.
- Login integrates email/password registration and login plus Google ID-token UI without faking successful authentication.

## Authentication and contact decisions

- The optional API-key field now omits the header when blank and otherwise sends the exact value as `X-API-Key`.
- It never sends the demo key through `Authorization`.
- Docs identify `Authorization: Bearer <access-token>` as the required JWT user-auth header, and authenticated frontend requests attach the returned token.
- Business contact links use the configured Kruzo Telegram conversation URL.

## Removed MVP-external features

- Routes: `/pricing` and `/api-keys`.
- Pricing, benefits, statistics, testimonials, repeated landing sections, and motion/reveal code.
- Fake API-key status/permission/table UI.
- Guided extraction tour, history filters/pagination, API session history, API history modal, duplicate API request tab, future-key accordions, and future-option copy.
- Empty history dashboard behavior; only current page-session results render after a request exists.
- Obsolete documentation topic component and redundant auth-only UI.

## Files added

- `design-system/MASTER.md`
- `docs/FRONTEND_MVP_CLEANUP_REPORT.md`
- `docs/frontend-mvp-screenshots/01-home-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/02-home-mobile-390x844.png`
- `docs/frontend-mvp-screenshots/03-mobile-navigation-390x844.png`
- `docs/frontend-mvp-screenshots/04-login-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/05-login-mobile-390x844.png`
- `docs/frontend-mvp-screenshots/06-extract-empty-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/07-extract-file-selected-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/08-extract-file-selected-mobile-390x844.png`
- `docs/frontend-mvp-screenshots/09-extract-custom-fields-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/10-extract-processing-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/11-extract-session-result-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/12-result-modal-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/13-result-modal-mobile-390x844.png`
- `docs/frontend-mvp-screenshots/14-api-empty-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/15-api-empty-mobile-390x844.png`
- `docs/frontend-mvp-screenshots/16-api-invalid-json-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/17-api-success-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/18-docs-desktop-1440x900.png`
- `docs/frontend-mvp-screenshots/19-docs-mobile-390x844.png`
- `src/components/demo/api/ApiExamples.tsx`
- `src/components/demo/excel/SessionResults.tsx`
- `src/components/demo/excel/sessionLabels.ts`

## Files changed

- Root/configuration: `.env.example`, `README.md`, `package.json`, `package-lock.json`.
- App shell/routes/SEO: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/page.tsx`, `src/lib/seo.ts`.
- Shared layout/landing: `src/components/CTA.tsx`, `src/components/FAQ.tsx`, `src/components/Footer.tsx`, `src/components/Header.tsx`, `src/components/Hero.tsx`, `src/components/KruzoLogo.tsx`, `src/data/faq.ts`, `src/data/hero.ts`, `src/data/landing.tsx`, `src/data/siteDetails.ts`, `src/types.ts`.
- Normal-user workspace: `src/components/demo/ExcelDemoWorkspace.tsx`, `src/components/demo/excel/ExtractionSettings.tsx`, `src/components/demo/excel/ResultPreviewModal.tsx`, `src/components/demo/excel/SelectedFilesList.tsx`, `src/components/demo/excel/UploadDropzone.tsx`, `src/components/demo/excel/constants.ts`, `src/components/demo/excel/processUploads.ts`, `src/components/demo/excel/types.ts`, `src/components/demo/excel/useUploadQueue.ts`.
- Developer workspace: `src/components/demo/ApiPlayground.tsx`, `src/components/demo/api/ApiRequestForm.tsx`, `src/components/demo/api/ApiResponsePanel.tsx`, `src/components/demo/api/JsonSchemaEditor.tsx`, `src/components/demo/api/constants.ts`, `src/components/demo/api/snippets.ts`, `src/components/demo/api/types.ts`, `src/components/demo/api/useApiPlayground.ts`.
- Docs/auth/OCR: `src/components/docs/DocsPrimitives.tsx`, `src/components/docs/DocsShell.tsx`, `src/components/docs/docsData.ts`, `src/features/auth/components/GoogleLoginPanel.tsx`, `src/features/auth/config.ts`, `src/features/auth/data.ts`, `src/features/ocr/api/client.ts`, `src/features/ocr/api/http.ts`, `src/features/ocr/preview/fieldNormalizer.ts`, `src/features/ocr/preview/sampleData.ts`.

`src/utils.tsx` had a pre-existing user working-tree modification and was deliberately not changed by this cleanup.

## Files deleted

- `src/app/api-keys/page.tsx`, `src/app/pricing/page.tsx`, `src/middleware.ts`.
- `src/components/Benefits/BenefitBullet.tsx`, `src/components/Benefits/BenefitSection.tsx`, `src/components/Benefits/Benefits.tsx`.
- `src/components/Pricing/Pricing.tsx`, `src/components/Pricing/PricingColumn.tsx`.
- `src/components/Reveal.tsx`, `src/components/Section.tsx`, `src/components/SectionTitle.tsx`, `src/components/Stats.tsx`, `src/components/Testimonials.tsx`.
- `src/components/demo/api/ApiCodeTabs.tsx`, `src/components/demo/api/ApiHistory.tsx`, `src/components/demo/api/ApiHistoryModal.tsx`, `src/components/demo/api/useApiHistory.ts`.
- `src/components/demo/excel/ExcelSheetViewer.tsx`, `src/components/demo/excel/ProcessingHistory.tsx`, `src/components/demo/excel/ProcessingHistoryPagination.tsx`, `src/components/demo/excel/SubmitPanel.tsx`, `src/components/demo/excel/historyLabels.ts`, `src/components/demo/excel/tourSteps.ts`, `src/components/demo/excel/useGuidedTour.ts`.
- `src/components/docs/DocsTopicContent.tsx`.
- `src/data/benefits.tsx`, `src/data/cta.ts`, `src/data/footer.ts`, `src/data/menuItems.ts`, `src/data/pricing.ts`, `src/data/stats.tsx`, `src/data/testimonials.ts`.
- `src/features/auth/components/AccessRequiredPanel.tsx`, `src/features/auth/components/PermissionGate.tsx`, `src/features/auth/components/RequireAuth.tsx`, `src/features/auth/session.ts`, `src/features/auth/types.ts`.

## Verification

Playwright used mocked OCR responses to avoid paid OCR calls.

| Check | Result |
| --- | --- |
| Required desktop/mobile captures | 19 screenshots captured at 1440x900 and/or 390x844 |
| Navigation | Same five items at desktop and mobile; logo goes Home |
| Responsive layout | No horizontal overflow on Home, Extract, API, Docs, or Login at 390px |
| `/try` | No JSON visible; all five pre-request workflow steps appear; session results appear only after a request |
| Result modal | One `overflow-y: auto` region; no raw JSON/provider metadata/Approved badge; mobile dialog fits 390px |
| Results/exports | Mock success rendered fields/tables; CSV and XLSX downloads succeeded |
| `/try/api` | No session history or future accordions; invalid JSON blocks Test API; real/sampled responses are labeled |
| API key behavior | Blank: no `X-API-Key` or `Authorization`; value: exact `X-API-Key: WELCOME-TO-KRUZOSERVICE`, no Authorization demo key |
| Local template state | Edited template resets after browser reload |
| Deleted routes/sitemap | `/pricing` and `/api-keys` return 404; sitemap excludes both |
| Production-browser console | No errors on valid routes; expected 404 console entry only while explicitly checking deleted routes |

Commands run:

```text
npm.cmd run lint
npm.cmd run build
```

Both passed. The production build contains only `/`, `/try`, `/try/api`, `/docs`, `/login`, not-found, `robots.txt`, and `sitemap.xml`.

## Remaining backend-dependent items

- OCR requests require a real signed-in JWT. This frontend keeps the login integration point but does not fabricate or store a token.
- The local `.env` runtime API URL was not changed; it must be configured consistently with the deployed HTTPS API by the environment owner.
- The existing dependency audit reports 16 package vulnerabilities. No dependency upgrades were made because they are outside this focused frontend scope.
