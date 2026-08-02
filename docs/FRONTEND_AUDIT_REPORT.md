# Kruzo Document AI Frontend Audit

> Historical pre-redesign audit. Superseded product decisions and screenshots are retained as evidence; the current implementation is documented in `KDA_BUSINESS_UX_IMPLEMENTATION_REPORT.md`.

Audit date: 2026-07-27  
Scope: current frontend only; no product code was modified  
Runtime audited: `http://127.0.0.1:3100`

## Executive summary

The current application already contains the two useful MVP cores:

1. A no-JSON document extraction workflow with preset and custom fields.
2. A developer playground with file upload, JSON schema input, request examples, and response inspection.

The main issue is not missing capability. It is excessive surface area around those capabilities. The app presents seven top-level destinations, two different header modes, a large repeated footer, a long marketing page, an API key management simulation, consulting-style pricing, two session-history systems, guided-tour UI, many future-state explanations, and repeated documentation/examples.

This makes a relatively simple product feel larger, less certain, and more “AI-generated” than it is. The smallest useful MVP should keep five navigation entries:

- Home
- Extract Document
- API Integration
- Docs
- Login / user menu

`Pricing` and `API Keys` should not appear in primary navigation for now. API key management should be represented by one short, explicit “In development” state inside the developer flow.

## Audit method and evidence

The audit combined:

- Full source inventory of App Router routes, global layout, navigation, auth, extraction, API playground, docs, pricing, and shared UI.
- Local runtime inspection at desktop, laptop, and mobile sizes.
- Playwright interaction with menus, buttons, details panels, docs topics, template select, file inputs, custom field controls, checkbox, JSON textarea, request tabs, history modal, result modal, and auth placeholder toast.
- Empty, selected, loading, success, validation error, API error, and OCR error states.
- One real OCR request only. It returned HTTP `502`.
- Mocked browser responses for the success result modal and API success/error states, specifically to avoid repeated paid/expensive OCR calls.

## Current route map

| Route | Access/rendering | Current purpose | Audit finding |
|---|---|---|---|
| `/` | Public, static | Marketing landing page | Long and repetitive: hero, four explanatory/card sections, FAQ, conversion CTA, then another footer CTA. |
| `/try` | Public, static shell with client workspace | Normal-user extraction demo | Useful core flow, but its page hierarchy and amount of session/history UI are too complex. |
| `/try/api` | Public, static shell with client playground | Developer API testing | Useful core flow, but examples, future options, status panels, and session history compete with the request form. |
| `/docs` | Public, static shell with client topic navigation | API documentation | Covers the right developer information but divides it into 15 topics and duplicates playground content. |
| `/pricing` | Public, static | Workflow audit / pilot / custom workflow offers | Not aligned with the stated no-payment/no-subscription MVP. All CTAs lead to the landing audit section. |
| `/login` | Dynamic, `noindex` | Google-only sign-in | No register route exists. OAuth is not connected, so the button only shows an in-development toast. |
| `/api-keys` | Dynamic, protected by middleware and permission checks, `noindex` | Placeholder API key management | Simulates a mature management surface although key creation is not implemented and the current OCR endpoint requires no key. |
| `/_not-found` | Framework/custom 404 | Recovery links | Simple and appropriate. |
| `/robots.txt` | Generated | SEO | Infrastructure route; no UX concern. |
| `/sitemap.xml` | Generated | SEO | Excludes account routes through SEO configuration. |

There is no `/register`, signup form, account settings page, billing page, or subscription page.

## Current navigation

### Landing header

- How it works
- Use cases
- FAQ
- Free audit
- Theme toggle
- Login
- Try Demo

### Application header

- Extract Document
- API Integration
- API Keys
- Pricing
- Docs
- Login
- Theme toggle
- Homepage

### Footer

The footer repeats:

- A large “Ready to test your document workflow?” CTA block.
- Free Workflow Audit.
- Extract Document.
- Read API Docs.
- Product links to all six application destinations.
- Another “Start Here” link group.

This creates three overlapping navigation systems and changes terminology between “Try Demo,” “Extract Document,” “Homepage,” and “Back to homepage.”

## Component and layout summary

### Global shell

- `src/app/layout.tsx`
  - Global metadata and fonts.
  - Theme initialization.
  - Global `Header`.
  - Global `ToastProvider`.
  - Global `Footer`, including on login, docs, extraction, and API pages.
- `src/components/Header.tsx`
  - Contains two distinct desktop/mobile navigation models based on the current pathname.
  - Owns section tracking, scroll state, menu transitions, and active route state.
- `src/components/Footer.tsx`
  - Conversion CTA plus three information/link columns.
- `src/app/globals.css`
  - Light/dark design tokens.
  - Shared card/button/nav styles.
  - Grid and radial-gradient backgrounds.
  - Reveal, float, ambient drift, hover lift, button pop, glow, and guided-tour effects.

### Landing page

- `src/app/page.tsx`
  - `Hero`
  - Problem cards
  - Solution workflow cards
  - Use-case cards
  - “How it works” cards
  - `FAQ`
  - `CTA`
- Content is distributed across `src/data/hero.ts`, `src/data/landing.tsx`, `src/data/faq.ts`, and `src/data/cta.ts`.
- `Reveal` is used repeatedly for viewport-triggered entrance animation.

### Authentication

- `src/app/login/page.tsx`
  - Sanitizes the `next` destination and renders `GoogleLoginPanel`.
- `GoogleLoginPanel`
  - Intro copy.
  - Three security-note cards.
  - Google button.
  - Backend-OAuth-unavailable message.
  - Link back to the demo.
- `src/middleware.ts`
  - Protects `/api-keys` by checking only for a session-cookie value before rendering.
- `RequireAuth` and `PermissionGate`
  - Recheck session and permissions server-side for UI rendering.
- No real OAuth route, register screen, logout control, or signed-in user menu was available.

### Normal-user extraction

- `ExcelDemoWorkspace`
  - Page heading and “Guide me.”
  - Upload area.
  - Selected-file list.
  - Submit panel.
  - Extraction template settings.
  - Processing history.
  - Result modal.
  - Toasts.
  - Six-step guided tour.
- Presets:
  - Invoice
  - Certificate / Diploma
  - Customer form
  - Repair order
  - Custom fields
- Custom fields can be added without JSON.
- Custom mode optionally supports a repeatable table with a table name and columns.
- Each selected file is submitted sequentially to `POST /api/v1/ocr/extract-custom`.
- Results can be viewed in a spreadsheet-like modal and exported as CSV or XLSX.
- Processing history exists only in React state for the current page session.

### Developer API integration

- `ApiPlayground`
  - Request form.
  - JSON schema editor.
  - File input.
  - Two future-feature details panels.
  - Send control and request message.
  - Response/code panel with Request, cURL, JavaScript, Python, and Response tabs.
  - Session history table.
  - History response modal.
- The playground currently has only one active extraction mode, despite internal “mode” naming and a history label of “Custom Mode.”
- API keys are not required by the current endpoint.
- The local runtime displayed:
  - `http://api.smartocr.kruzo.tech/api/v1/ocr/extract-custom`
- The source fallback and docs display:
  - `https://api.smartocr.kruzo.tech/api/v1/ocr/extract-custom`
- This HTTP/HTTPS mismatch must be resolved before public release.

### Docs

The docs shell exposes 15 client-side topics:

- Overview
- Quickstart
- Authentication
- Extract document
- Request parameters
- Response schema
- Confidence & review
- Error codes
- Rate limits
- File limits
- Notes & limitations
- cURL
- JavaScript
- Python
- Sample response

The content is useful, but the topic count and duplication with API Integration are disproportionate for a single-endpoint MVP.

### Pricing

The page presents:

- Free Workflow Audit
- Paid Pilot
- Custom Workflow

This is service/consulting packaging rather than SaaS billing, but it still introduces commercial decision-making that the stated MVP explicitly does not need.

### API keys

The protected page contains:

- Beta access notice.
- API key format.
- Security guidance.
- Placeholder key-management table.
- Placeholder key status.
- Permission-gated write-access request.
- Usage example.
- Links to API Integration and Docs.

This is far more UI than the current state requires. It should be replaced in the visible MVP by a short “API key management — In development” message.

## Current user journeys

### Normal user: current journey

1. Open Home.
2. Interpret two competing CTAs: Try Demo or Free Workflow Audit.
3. Open `/try`.
4. Dismiss or step through the automatically opened six-step guide on the first visit.
5. Upload one or more documents.
6. Review the selected-file card.
7. Notice that the Submit panel appears before template configuration.
8. Scroll down to select a preset or custom fields.
9. Scroll back or continue to Submit.
10. Track the file in Processing history.
11. Filter history if desired.
12. Open a result modal.
13. Choose a result sheet/tab.
14. Export CSV or XLSX.

The actual task is simple, but the presentation makes it feel like a workflow-management product.

### Developer: current journey

1. Open API Integration.
2. Upload a file.
3. Edit or restore `schema_sample`.
4. Read two future-feature accordions.
5. Send the request.
6. Use five tabs to compare request/examples/response.
7. Optionally copy content.
8. Review the same request again in Session history.
9. Open a second modal to see response JSON.
10. Visit Docs for overlapping endpoint, parameter, schema, response, error, and code-example information.
11. Optionally visit a separate API Keys page even though the current endpoint requires no key.

The developer receives most required information, but it is spread across too many panels and pages.

## Major UX problems

### Product-level

1. **The primary navigation is too large.** Six application links plus Homepage and theme control make a small MVP look like an account platform.
2. **The app overstates unfinished account functionality.** Login copy promises saved history and API access while OAuth is not connected; API Keys simulates rows, permissions, and statuses with no backend key creation.
3. **Pricing conflicts with the MVP brief.** It adds service-package decisions before the product demo is focused.
4. **The same concepts appear in multiple places.** API request examples, auth state, API keys, CTAs, navigation, and history are repeated.
5. **The global footer is inappropriate on task screens.** A large marketing CTA and full sitemap appear beneath login, extraction, API, docs, and API keys.

### Normal-user flow

1. The template selector is visually below Upload, Selected documents, and Submit; users should choose or confirm extraction fields before the final action.
2. The guided tour opens automatically and adds an immediate decision before users can try the product.
3. The empty Processing history panel occupies half of the desktop workspace before there is any result.
4. Four history filters are unnecessary for a public demo and a short in-memory list.
5. The selected-file state, submit card, settings card, history card, toast, and modal fragment one task into many containers.
6. On mobile, the entire workflow plus the repeated global footer creates an exceptionally long page.
7. “Processing history” implies persistence, but it is only current component state.
8. The result modal adds spreadsheet row numbers, column letters, status badge, metadata, sheet tabs, and two download actions. Some are useful, but the total is heavier than a quick result view.

### Developer flow

1. Request form, five response/code tabs, two future-feature accordions, status badge, message panel, technical details, session history, and history modal are too much for one endpoint.
2. The Request tab and Docs repeat method, URL, content type, authentication, fields, and examples.
3. The history table repeats the response that is already visible directly above it.
4. “Custom Mode” is confusing because the page only exposes template extraction.
5. “Future options not sent” advertises unsupported API surface rather than helping a developer succeed now.
6. API key content is split among a details panel, Docs authentication topic, and an entire API Keys page.
7. The runtime HTTP endpoint conflicts with the HTTPS endpoint in Docs and source fallback.

### Authentication

1. No register screen or route exists.
2. The single login action does not authenticate because the backend OAuth URL is absent.
3. Three security cards explain implementation choices users do not need.
4. The login page includes the full application navigation and full conversion footer, diluting the sign-in task.
5. Guest access to `/api-keys` redirects to `http://localhost:3100/login?...` even when the app is opened at `127.0.0.1`; this is a local redirect-origin inconsistency.

## Visual consistency problems

1. Corner radii range across small rounded controls, `rounded-xl`, `rounded-2xl`, and fully pill-shaped buttons/badges.
2. Nearly every page repeats a large eyebrow, oversized H1, muted paragraph, grid background, and card collection.
3. Lime is used for primary buttons, selected tabs, chips, badges, glows, borders, and decorative fields, reducing action hierarchy.
4. The same low-contrast card-muted background is used for empty states, code containers, inputs, explanatory panels, and status surfaces.
5. Some statuses use pills while others use bordered message panels or toasts.
6. Typography shifts between very large marketing headings, dense monospace content, tiny uppercase eyebrows, small badges, and standard body text within the same viewport.
7. The desktop extraction layout leaves a large empty right-side area after the short history panel while settings continue down the left column.
8. Mobile pages remain technically responsive with no horizontal document overflow, but they are very long and card-heavy.
9. The mobile menu is visually clean but includes seven destinations plus Back to homepage, covering most of the viewport.
10. The global footer is visually stronger and larger than necessary for utility pages.

## What feels overly complex

- Two header information architectures.
- Seven visible top-level destinations.
- Six-step guided tour for a three-action task.
- Separate upload, selected list, submit, settings, history, toast, and modal containers.
- Four extraction-history filters.
- Two export formats in both history rows and result modal.
- Five API response/code tabs.
- API request session history and a second response modal.
- Fifteen Docs topics for one endpoint.
- A full API key management mock.
- Three pricing/consulting packages.
- Repeated free-audit conversion surfaces.
- Theme switching on every page at this MVP stage.
- Permission-gated UI for features that do not yet exist.

## What feels AI-generated

The “AI-generated” feeling comes from accumulation rather than any single component:

- Repeated eyebrow + oversized heading + explanatory sentence composition on every route.
- Repeated icon circles, card grids, pill badges, and soft lime panels.
- Decorative grid/radial backgrounds on marketing and utility pages alike.
- Many generic explanatory cards that say similar things in different words.
- Excessive future-state copy, beta notes, security notes, metadata, helper text, and status labels.
- Reveal, floating, ambient, hover-lift, button-pop, glow, and menu-transition effects layered onto a simple tool.
- Multiple “professional SaaS” conventions included without a current product need: pricing packages, API key management, permissions, histories, filters, badges, and large conversion footers.
- Decorative spreadsheet row/column chrome in the result modal.

The source search found 199 uses of rounded, gradient/glow, reveal, hover-lift, button-pop, or related decorative patterns across app/components/data files. This is not automatically wrong, but it confirms that decoration is systemic rather than isolated.

## Elements to remove instead of redesign

- Pricing from primary navigation and the public MVP path.
- API Keys from primary navigation.
- Placeholder key table, fake key row, fake key status, and write-permission request.
- “Future options not sent.”
- API request Session history and its modal.
- Extraction guided tour auto-open; preferably remove the tour entirely.
- Extraction history filters for the public demo.
- Login security-note cards.
- Full global conversion footer on login and application/tool pages.
- Duplicate footer “Start Here” links.
- One of the repeated Home workflow/how-it-works sections.
- Repeated Free Workflow Audit CTAs if the MVP goal is a public product demo rather than consulting lead generation.
- Most status/metadata badges that do not change the next action.

## Keep / Simplify / Merge / Hide / Remove

| Current page or feature | Decision | Recommendation |
|---|---|---|
| Home route | Simplify | Keep one clear value proposition, one product screenshot/demo preview, three steps, a compact trust/limitations note, and one primary CTA. |
| Hero | Keep | Keep the headline, one short sentence, and one primary “Extract a document” CTA. Make any secondary developer CTA quiet. |
| Problem cards | Merge | Merge useful content into one short “What it does” section. |
| Solution workflow | Merge | Merge with “How it works” into three steps. |
| Use-case card grid | Simplify | Keep at most three representative document types as plain examples. |
| How-it-works card grid | Merge | Use the same three-step section; do not keep two workflow explanations. |
| FAQ | Simplify | Keep 3–4 operational questions only. |
| Free Workflow Audit CTA | Hide for now | Not core to the public product-demo MVP. Reintroduce later if lead generation becomes a confirmed goal. |
| Global marketing footer CTA | Remove | It duplicates page CTAs and makes task pages feel like landing pages. |
| Footer link groups | Simplify | Logo, Docs, privacy/contact if available, and copyright are enough. |
| Extract Document route | Keep | This is the primary normal-user MVP. |
| Guided tour | Remove | The workflow should explain itself; use one short inline hint if needed. |
| Upload dropzone | Keep | Keep one clear drop/select action. |
| Selected-file list | Simplify | Keep file name, size, remove, and total count. |
| Preset templates | Keep | Keep the preset select and one-line field preview. |
| Custom fields UI | Keep | This satisfies the no-JSON normal-user requirement. Hide advanced keys by default. |
| Optional custom table | Simplify | Keep behind a single “Add a table” action; avoid always-visible advanced configuration. |
| Separate submit card | Merge | Put the primary Extract button at the end of the upload/template form. |
| Processing history panel | Merge | Show current request progress/result inline; add true history only after authenticated backend persistence exists. |
| History filters | Remove | Unnecessary for a public session demo. |
| Result modal | Simplify | Keep fields/table switch, review status, CSV/XLSX export, and close. Remove spreadsheet decoration and excess metadata. |
| API Integration route | Keep | This is the primary developer MVP. |
| API request form | Simplify | Endpoint/method, optional blank API key, JSON template, file, Test API. |
| JSON validation/format | Keep | Directly useful to developers. |
| Future API key details | Merge | Replace with one line beside an optional API key input: “API key management: In development.” |
| Future options details | Remove | Do not advertise unsupported parameters. |
| Request/code/response tabs | Simplify | Show response by default; keep compact cURL/JavaScript/Python examples below or in Docs. |
| API Session history | Remove | Duplicates the current response and has no persistence. |
| API history modal | Remove | Becomes unnecessary with history removal. |
| Docs route | Keep | Required for developer success. |
| Fifteen Docs topics | Merge | Reduce to Quickstart, Request, Response, Errors/limits, and Examples. |
| API Keys route | Hide for now | Leave route/code untouched during the future cleanup if desired, but remove from navigation and display “In development” in developer surfaces. |
| Pricing route | Hide for now | Remove from navigation and sitemap later; do not expose it during MVP validation. |
| Login route | Keep | Required by the goal, but only when OAuth is connected. |
| Login security cards | Remove | Keep logo/heading, Google action, concise privacy note, and link back to demo. |
| Register | Hide for now | It does not exist. Do not invent it unless the auth product decision requires non-Google signup. |
| Theme toggle | Simplify | Keep only if dark mode is a confirmed requirement; otherwise hide it for MVP focus. |
| Custom 404 | Keep | Appropriate and lightweight. |

## Proposed simplified MVP information architecture

### Primary navigation

1. Home
2. Extract Document
3. API Integration
4. Docs
5. Login, replaced by a user menu after authentication

Use one header model across all pages. The logo links Home. Do not add a separate Homepage button.

### Hidden from primary navigation

- API Keys
- Pricing
- Free Workflow Audit

### Page responsibilities

#### Home

- What Kruzo does.
- One screenshot or compact interactive preview.
- Three-step workflow.
- Supported documents/limitations.
- CTA to Extract Document.
- Quiet link to API Integration for developers.

#### Extract Document

- Preset or Custom Fields.
- File upload.
- Selected files.
- Extract button.
- Inline processing state.
- Result review and export.

#### API Integration

- Endpoint and method.
- Optional API key field, blank by default.
- “API key management: In development.”
- JSON template editor.
- File upload.
- Test API.
- Response.
- Compact links/examples.

#### Docs

- Quickstart.
- Request format.
- JSON schema/template.
- Response.
- Errors and limits.
- cURL, JavaScript, Python examples.

#### Login / user menu

- Google login only if that is the chosen auth model.
- Short honest in-development state until OAuth works.
- After login: user name/email and logout only for MVP.

## Proposed normal-user flow

1. Open Extract Document.
2. Choose a preset. Defaulting to Invoice is acceptable only if clearly visible.
3. Or choose Custom Fields and add friendly field labels without seeing JSON keys.
4. Upload or drop a document.
5. Confirm the file and selected fields in one compact summary.
6. Click Extract.
7. See one clear inline loading state.
8. Review extracted fields and any “Needs review” items.
9. Export CSV or XLSX.

Target: one page, one primary action, no tour, no empty history dashboard, and no more than one result overlay or result section.

## Proposed developer flow

1. Open API Integration.
2. See `POST /api/v1/ocr/extract-custom` and `multipart/form-data`.
3. Optionally leave API key blank; show “API key management: In development.”
4. Paste or edit the JSON schema/template.
5. Upload a file.
6. Click Test API.
7. See status and response JSON in the same view.
8. Copy the request/response or open one concise language example.
9. Use Docs for the full contract, limits, errors, and examples.

Target: no history table, no second modal, no unsupported-options accordion, and no separate API Keys detour.

## Recommended visual direction

- Use a mostly solid neutral background. Reserve the grid pattern for the Home hero, if it is kept at all.
- Use one accent color for primary action and selected state, not every badge/icon/panel.
- Use sharper, consistent corners:
  - 6–8 px controls.
  - 8–12 px cards/modals.
  - Avoid full pills except true tags/statuses.
- Remove primary-button gradients. Use a flat fill with a clear hover/focus state.
- Reduce shadows to one subtle elevation level.
- Remove ambient drift, floating decoration, glow, hover lift, and most entrance reveals.
- Use a compact typography system:
  - Page title.
  - Section title.
  - Body.
  - Caption/code.
- Use a consistent 8 px spacing scale and reduce vertical page length.
- Prefer borders and whitespace over nested tinted containers.
- Keep status colors semantic:
  - Green: success.
  - Amber: review/warning.
  - Red: failure.
  - Neutral: idle/in development.
- Keep utility pages visually quieter than the Home page.
- Do not place the full marketing footer below login, extraction, API, or docs workspaces.

## Screenshot index

All screenshots are in `docs/frontend-audit-screenshots/`.

### Home and navigation

| File | State |
|---|---|
| `01-home-desktop-1440x900.png` | Desktop landing before scroll-triggered reveals. |
| `02-home-laptop-1280x800.png` | Laptop landing before scroll-triggered reveals. |
| `03-home-mobile-390x844.png` | Mobile landing before scroll-triggered reveals. |
| `04-home-mobile-navigation-390x844.png` | Landing mobile navigation open. |
| `26-app-mobile-navigation-390x844.png` | Application mobile navigation open. |
| `37-home-all-sections-after-scroll-desktop-1440x900.png` | Canonical full landing page after all reveal sections were scrolled into view. |
| `38-home-faq-expanded-desktop-1440x900.png` | FAQ expanded state. |

### Authentication

| File | State |
|---|---|
| `05-login-desktop-1440x900.png` | Desktop login. |
| `06-login-in-development-toast-1440x900.png` | Google login in-development toast. |
| `07-login-mobile-390x844.png` | Mobile login. |

### Normal-user extraction

| File | State |
|---|---|
| `08-extract-guided-tour-desktop-1440x900.png` | First-visit guided-tour overlay. |
| `09-extract-empty-desktop-1440x900.png` | Empty extraction workspace. |
| `10-extract-file-template-selected-desktop-1440x900.png` | File selected with Repair order preset. |
| `11-extract-file-template-selected-mobile-390x844.png` | Same selected state on mobile. |
| `12-extract-custom-fields-configured-laptop-1280x800.png` | Custom fields with an added field and enabled table. |
| `13-extract-processing-loading-desktop-1440x900.png` | Real request processing state. |
| `14-extract-after-single-request-desktop-1440x900.png` | Real request failure after one OCR call returned 502. |
| `15-extract-success-history-mocked-desktop-1440x900.png` | Browser-mocked success history state. |
| `16-extraction-result-modal-mocked-desktop-1440x900.png` | Browser-mocked successful result modal. |
| `17-extraction-result-modal-mocked-mobile-390x844.png` | Browser-mocked result modal on mobile. |

### Developer API integration

| File | State |
|---|---|
| `18-api-integration-empty-desktop-1440x900.png` | Empty API Integration page. |
| `19-api-file-schema-selected-laptop-1280x800.png` | File and valid sample schema selected; API key details open. |
| `20-api-invalid-json-error-laptop-1280x800.png` | Invalid JSON validation state. |
| `21-api-request-loading-mocked-desktop-1440x900.png` | Browser-mocked loading state. |
| `22-api-success-response-mocked-desktop-1440x900.png` | Browser-mocked successful API response. |
| `23-api-curl-example-desktop-1440x900.png` | cURL tab. |
| `24-api-history-response-modal-desktop-1440x900.png` | API history response modal. |
| `25-api-integration-mobile-390x844.png` | Mobile API Integration page. |
| `36-api-error-response-mocked-laptop-1280x800.png` | Browser-mocked 422 API error state. |

### API keys

| File | State |
|---|---|
| `27-api-keys-guest-redirect-login-desktop-1440x900.png` | Guest redirected to login. |
| `28-api-keys-user-desktop-1440x900.png` | User-session API Keys page. |
| `29-api-keys-in-development-toast-desktop-1440x900.png` | Write-access in-development toast. |
| `30-api-keys-user-mobile-390x844.png` | User-session API Keys page on mobile. |

### Docs and pricing

| File | State |
|---|---|
| `31-docs-overview-desktop-1440x900.png` | Docs overview. |
| `32-docs-request-parameters-desktop-1440x900.png` | Request parameters topic. |
| `33-docs-mobile-390x844.png` | Mobile Docs. |
| `34-pricing-desktop-1440x900.png` | Desktop pricing/pilot page. |
| `35-pricing-mobile-390x844.png` | Mobile pricing/pilot page. |

## Runtime and state findings

- All inspected 390 px pages avoided document-level horizontal overflow.
- The Home page reveal effects require scrolling before sections become visible. The first full-page screenshots therefore show blank section space; `37-home-all-sections-after-scroll-desktop-1440x900.png` is the canonical revealed version.
- Extraction Submit is disabled when no file is selected.
- Upload accepts PDF, JPG/JPEG, PNG, and WEBP.
- Preset selection and custom-field/table controls worked.
- Invalid API JSON disables sending and displays a specific parser message.
- Loading, success, error, history, and modal states rendered correctly under browser-controlled responses.
- The single real OCR call returned HTTP 502 and displayed a friendly failure plus a Details affordance.
- Google login displayed an honest in-development toast instead of fake authentication.
- Guest `/api-keys` access redirected to login.
- A temporary audit session cookie exposed the user API Keys state; no product code or persisted account data was changed.

## Risks and missing information

1. **Authentication is incomplete.** No OAuth backend URL, register path, logout, or user-menu state was available.
2. **Real OCR reliability is unconfirmed.** The only real request returned 502. Successful extraction UI was inspected with a browser mock.
3. **Endpoint scheme mismatch.** Runtime uses HTTP while Docs/source fallback use HTTPS.
4. **API key contract is undecided.** The endpoint currently requires no key, but three UI surfaces discuss future keys.
5. **History is not persistent.** Extraction and API histories are in-memory session UI, not account data.
6. **Permission enforcement requires backend verification.** Frontend/middleware checks cannot replace API authorization.
7. **No real account-backed export/history ownership was testable.**
8. **No real API key create/revoke flow exists.**
9. **The UI docs state a 10 MB backend default, but the upload UI does not visibly communicate or prevalidate that limit.**
10. **CSV/XLSX generation exists client-side, but downloaded file contents were not opened during this UI audit.**
11. **Dark mode was present but was not exhaustively audited across all states.**
12. **Keyboard/screen-reader behavior received spot checks through accessible roles, but this was not a full WCAG audit.**
13. **Product decision needed:** should public extraction remain anonymous, or should login be required before extraction/history?
14. **Product decision needed:** is Free Workflow Audit a real MVP conversion goal or legacy consulting positioning?

## Exact frontend files likely involved in future cleanup

### Routes and global shell

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/try/page.tsx`
- `src/app/try/api/page.tsx`
- `src/app/docs/page.tsx`
- `src/app/pricing/page.tsx`
- `src/app/login/page.tsx`
- `src/app/api-keys/page.tsx`
- `src/app/globals.css`
- `src/app/sitemap.ts`
- `src/app/not-found.tsx`
- `src/middleware.ts`

### Navigation, footer, and landing

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/Hero.tsx`
- `src/components/Section.tsx`
- `src/components/SectionTitle.tsx`
- `src/components/Reveal.tsx`
- `src/components/FAQ.tsx`
- `src/components/CTA.tsx`
- `src/components/ThemeToggle.tsx`
- `src/data/menuItems.ts`
- `src/data/footer.ts`
- `src/data/hero.ts`
- `src/data/landing.tsx`
- `src/data/faq.ts`
- `src/data/cta.ts`

### Normal-user extraction

- `src/components/demo/ExcelDemoWorkspace.tsx`
- `src/components/demo/excel/UploadDropzone.tsx`
- `src/components/demo/excel/SelectedFilesList.tsx`
- `src/components/demo/excel/SubmitPanel.tsx`
- `src/components/demo/excel/ExtractionSettings.tsx`
- `src/components/demo/excel/ProcessingHistory.tsx`
- `src/components/demo/excel/ProcessingHistoryPagination.tsx`
- `src/components/demo/excel/ResultPreviewModal.tsx`
- `src/components/demo/excel/ExcelSheetViewer.tsx`
- `src/components/demo/excel/useUploadQueue.ts`
- `src/components/demo/excel/useExtractionTemplate.ts`
- `src/components/demo/excel/useGuidedTour.ts`
- `src/components/demo/excel/tourSteps.ts`
- `src/components/demo/excel/templates.ts`
- `src/components/demo/excel/processUploads.ts`
- `src/components/demo/excel/constants.ts`
- `src/components/demo/excel/downloadResults.ts`

### API integration

- `src/components/demo/ApiPlayground.tsx`
- `src/components/demo/api/ApiRequestForm.tsx`
- `src/components/demo/api/JsonSchemaEditor.tsx`
- `src/components/demo/api/ApiResponsePanel.tsx`
- `src/components/demo/api/ApiCodeTabs.tsx`
- `src/components/demo/api/ApiHistory.tsx`
- `src/components/demo/api/ApiHistoryModal.tsx`
- `src/components/demo/api/useApiPlayground.ts`
- `src/components/demo/api/useApiHistory.ts`
- `src/components/demo/api/constants.ts`
- `src/components/demo/api/snippets.ts`
- `src/components/demo/api/types.ts`
- `src/features/ocr/api/config.ts`
- `src/features/ocr/api/client.ts`
- `src/features/ocr/api/http.ts`

### Docs

- `src/components/docs/DocsShell.tsx`
- `src/components/docs/DocsTopicContent.tsx`
- `src/components/docs/DocsPrimitives.tsx`
- `src/components/docs/docsData.ts`

### Authentication and placeholder states

- `src/features/auth/config.ts`
- `src/features/auth/data.ts`
- `src/features/auth/session.ts`
- `src/features/auth/components/GoogleLoginPanel.tsx`
- `src/features/auth/components/RequireAuth.tsx`
- `src/features/auth/components/PermissionGate.tsx`
- `src/features/auth/components/AccessRequiredPanel.tsx`
- `src/components/toast/ComingSoonButton.tsx`
- `src/components/toast/ToastProvider.tsx`

### Configuration and SEO

- `.env.example`
- `src/lib/seo.ts`
- `src/data/siteDetails.ts`

## Commands used

```powershell
rg --files -g '!node_modules' -g '!.next'
rg -n <targeted route/component/style searches> src
git status --short
npm.cmd run lint
npm.cmd run build
npm.cmd run dev -- --hostname 127.0.0.1 --port 3100
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3100
```

Playwright was used to navigate and interact with the local site, set viewports, upload the repository sample WEBP file, change templates, configure custom fields, validate JSON, send one real request, mock further responses, open menus/modals/details/topics/tabs, and save screenshots.

## Playwright MCP status

- The preferred in-app Browser connection did not initialize because the environment rejected its startup metadata.
- Direct Playwright MCP worked and was used successfully for the complete runtime UI audit.
- It controlled Chromium, used all three required viewport sizes, interacted with real controls, and saved 38 screenshots.

## Pages or states not fully inspected

- Real Google OAuth/login success.
- Registration, because no route or UI exists.
- Logged-in user menu/logout, because neither is implemented.
- Real OCR success, because the one permitted real request returned 502; frontend success was inspected with a browser mock.
- Real API key create/revoke/rotation, because those actions are not implemented.
- Persisted account-backed document/API history, because current histories are client state.
- Downloaded CSV/XLSX file contents.
- Production deployment behavior; this audit used the local development server.

## Lint and build status

- `npm.cmd run lint`: passed with no warnings or errors.
- `npm.cmd run build`: passed.
- Next.js production build compiled, type-checked, and generated all routes successfully.
- `/try` is the largest current route at approximately 206 kB first-load JavaScript.
- `/api-keys` and `/login` are dynamic routes.
- Middleware was included in the build.

## Repository hygiene

- The audit did not modify product code.
- `src/utils.tsx` was already modified before this audit and was left untouched.
- Intended audit outputs are only:
  - `docs/FRONTEND_AUDIT_REPORT.md`
  - `docs/frontend-audit-screenshots/*.png`
