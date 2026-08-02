# Kruzo Document AI Simplification and Google Auth Report

Date: 2026-07-29

## Current follow-up state

This section supersedes older counts and environment notes later in the report.

- The business registry now contains six presets. `certificate` was added for degrees, professional certificates, and licenses.
- Document-type cards now have an 84px minimum height and a compact icon/text row.
- `View Excel columns` remains closed by default and renders numbered bordered cells when opened; dot-separated column prose was removed.
- Home now uses connected bordered groups for the three-step flow and supported document types. It also explains, in business language, that Kruzo can connect email, spreadsheets, accounting tools, and other systems into one workflow.
- Developer now includes API-key management, an integration walkthrough, credit rules, execution-history behavior, and enough useful content to keep the footer at the page end.
- Login uses a compact copyright-only footer and measures exactly one 1440x900 viewport without a vertical scrollbar.
- The standard footer now links to processing, API documentation, API-key management, Contact, and Telegram; it explains the 100 starting credits and uses `© 2026 Kruzo Service`.
- Frontend local API configuration is `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`.

### Certificate (`certificate`, version 1)

Documents:

1. No.
2. Source file
3. Certificate title
4. Certificate number
5. Registration number
6. Recipient full name
7. Date of birth
8. Issuing organization
9. Field of study
10. Qualification
11. Classification
12. Graduation year
13. Issue date
14. Issue place

Certificate and registration numbers are text fields so leading zeros are preserved.

### API keys, credits, and execution history

New backend endpoints:

```text
GET    /api/v1/api-keys
POST   /api/v1/api-keys
DELETE /api/v1/api-keys/{api_key_id}
GET    /api/v1/users/me/credits
POST   /api/v1/ocr/extract
```

`POST /api/v1/ocr/extract` uses only `X-API-Key`; it does not require a Bearer session. Raw keys use a `kda_live_...` prefix, are returned once, and are stored as SHA-256 hashes with a display prefix and last four characters. The Developers page creates, lists, copies once, and revokes keys.

New accounts receive 100 integer document credits. One credit is reserved immediately before the first provider attempt, all retries share that reservation, successful extraction finalizes the debit, and failure refunds it. The existing 300-document monthly allowance remains a separate safety limit.

API-key executions automatically create an extraction batch with `request_source=api_key`, the request schema snapshot, status, and the full structured response or controlled failure. These records use the existing paginated History UI.

Additive migration:

```text
d7a6c2f4e901_add_api_keys_credits_and_api_history.py
```

It adds safe API-key display/usage metadata, integer credit balance, credit ledger, and API execution source/key linkage. The two Python dependency files were consolidated into `requirements.txt`; `requirements-dev.txt` was deleted.

### Google and production boundary

Local Next responses contain:

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

The local backend now has the same Google web client ID expected by the frontend. A browser probe showed that Google Cloud currently rejects `http://localhost:3000` for that client ID. A live TLS inspection also showed:

```text
requested host: api.smartocr.kruzo.tech
certificate CN/SAN: smartocr.kruzo.tech
```

The certificate does not cover the API hostname, and the HTTPS `/health` request reaches a 404 upstream. These are external Google Cloud / DNS / reverse-proxy deployment settings, not a missing frontend or FastAPI route. The local frontend therefore leaves `NEXT_PUBLIC_GOOGLE_CLIENT_ID` blank and hides the Google divider/button instead of presenting a broken control. Production Google sign-in still requires:

1. a certificate covering `api.smartocr.kruzo.tech` (or a production API URL matching the certificate)
2. deployment of the current backend and migration head
3. authorized Google origins for local and production frontend URLs
4. matching `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Current validation

```text
Frontend lint     -> passed
Frontend tests    -> 5 files, 17 tests passed
Frontend build    -> passed, 16 routes generated
Backend compile   -> passed
Backend tests     -> 27 passed
Alembic head      -> d7a6c2f4e901
Local OpenAPI     -> Google, API key, credit, and API-key OCR routes present
```

One manual, non-automated provider call was made through the real Process Documents UI using `temp/graduated.jpg`:

- HTTP 200 and normal project response envelope
- 12 certificate fields returned
- credit balance changed from 100 to 99
- History stored the successful response
- downloaded workbook contained one `Documents` row
- `Certificate number` remained `0042708`
- `Registration number` remained `00092/2026/KSCQ.CTU`
- no browser console or network error occurred during the processing request

Automated tests continue to mock the provider and do not make paid/model calls.

## Scope

- Frontend: `D:\Project\PersonalProject\SmartOCR\kruzo-service`
- Backend: `D:\Project\PersonalProject\SmartOCR\smartocr_backend`
- This pass simplified the business-facing product, preserved the generic developer schema workflow, completed the frontend/backend Google login contract, added reliable preset/export snapshots, and later made one manual certificate-processing call outside automated tests.

## Google login root cause

The current backend checkout already contained and included `POST /api/v1/auth/google`. Development OpenAPI also contained the route before this pass, so the source-level cause was not a missing router.

The active frontend `.env` contained two `NEXT_PUBLIC_API_BASE_URL` entries:

```text
http://localhost:8000
http://api.smartocr.kruzo.tech
```

The final HTTP value won and sent Google credentials to an obsolete/inconsistent endpoint. A live, non-credential probe confirmed:

- `POST http://api.smartocr.kruzo.tech/api/v1/auth/google` returned `404`.
- HTTPS requests to `https://api.smartocr.kruzo.tech` failed certificate hostname validation (`SEC_E_WRONG_PRINCIPAL`) from this machine.

The frontend `.env` now has one value:

```text
NEXT_PUBLIC_API_BASE_URL=https://api.smartocr.kruzo.tech
```

This fixes the frontend scheme/path selection in the workspace. It does **not** fix the live certificate or deploy the current backend. The production API still requires a valid TLS certificate for the hostname and deployment of the current route/migrations before real Google login can be claimed working on the VPS.

## Backend Google route contract

```http
POST /api/v1/auth/google
Content-Type: application/json
```

```json
{
  "id_token": "<google-id-token>"
}
```

Success uses the normal response envelope and the same token body as password login:

```json
{
  "success": true,
  "error_code": null,
  "message": "Google login successful.",
  "data": {
    "access_token": "<kruzo-jwt>",
    "token_type": "bearer"
  }
}
```

The backend uses `google-auth` and `google.oauth2.id_token.verify_oauth2_token`. The package verifies the signed token, certificate, audience, issuer, and expiry. Application validation additionally requires:

- issuer `accounts.google.com` or `https://accounts.google.com`
- nonblank `sub`
- valid email
- `email_verified === true`

`sub` is the stable account identifier. Existing `google_sub` users sign in. New users receive normalized lowercase email, `google_sub`, optional name/avatar, nullable password hash, and active status. No fake password or Google client secret is used. A matching email without safe account linking returns controlled conflict `ERR_AUTH_BIZ_1009`.

Email/password registration and login remain unchanged and tested.

## Environment and popup headers

Backend:

```text
GOOGLE_CLIENT_ID=
```

Frontend:

```text
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_API_BASE_URL=https://api.smartocr.kruzo.tech
```

`next.config.mjs` now returns:

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

for the Next.js app. Other security headers were not weakened.

The Google UI:

- is completely absent, including the divider, when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is blank
- loads Google Identity Services when configured
- guards initialization and credential handling so one credential is submitted once
- posts `{ "id_token": credential }` to the environment-based API URL
- stores the returned Kruzo JWT through `AuthProvider`
- loads `/users/me` and `/users/me/ocr-quota`
- redirects to `/upload`
- shows no configuration instructions to users

The mocked browser flow confirmed one callback/request, stored session hydration, loaded the user and remaining allowance, and redirected to Process Documents.

## Navigation, account, Contact, and History

Guest navigation:

- Home
- Process Documents
- Developers
- Contact
- Sign in
- theme control

Authenticated navigation replaces Sign in with an avatar/account button. The account menu contains the name/email, monthly remaining documents, History, and Sign out. History continues to use `/results`; it is not a full-width primary navigation link.

`/contact` is a compact page with the requested title, description, three prompts, and exact Telegram URL:

```text
https://t.me/AndyDuong2803?text=Hi%20Kruzo%2C%20I%20would%20like%20help%20processing%20documents%20for%20my%20business.
```

History keeps server pagination and compact cards. Dates omit seconds. Its empty state is `No processed documents yet.` Repeated storage explanations were removed.

## Process Documents simplification

The business page now uses:

```text
Process documents
Choose a document type, add your files, and download the results in Excel.
```

Stage headings:

```text
Step 1 · Choose document type
Step 2 · Add files
Step 3 · Review and download
```

The empty selected-file card was removed. After selection, the compact section is `Selected files (N)`. User-visible states use Selected, Processing, Completed, Needs review, and Failed.

The right panel is now `Output` and contains only selected count, monthly remaining documents, output organization when applicable, file type, process/download action, and custom-setup link.

Removed business-facing terms and UI include:

- queue, pipeline, batch orchestration, provider, and schema
- repeated generic-document descriptions
- template dropdown and repeated preview card
- Add field, Add table, required checkboxes, type selectors, and reorder controls
- the entire public Custom fields/general-purpose builder

Developer API users still have the JSON template playground and the backend remains schema-driven.

## Preset registry

All normal-user document types live in:

```text
src/config/document-presets.ts
```

Each typed `DocumentPreset` contains ID, version, label, icon name, ordered fields, optional tables, generated schema sample, and export definition. Upload, backend batch creation, result export, and history re-download consume this definition. Adding a future business type requires one registry entry and tests; it does not require changing queueing, OCR orchestration, review, export, or history.

### Invoice (`invoice`, version 1)

Documents:

1. No.
2. Source file
3. Invoice number
4. Issue date
5. Due date
6. Seller name
7. Seller tax ID
8. Buyer name
9. Buyer tax ID
10. Currency
11. Subtotal
12. Tax
13. Discount
14. Total amount
15. Payment terms
16. Purchase order number

Line items:

1. No.
2. Source file
3. Line number
4. Description
5. Quantity
6. Unit
7. Unit price
8. Tax
9. Amount

### Receipt (`receipt`, version 1)

Documents:

1. No.
2. Source file
3. Receipt number
4. Merchant name
5. Merchant address
6. Transaction date
7. Transaction time
8. Currency
9. Subtotal
10. Tax
11. Total amount
12. Payment method
13. Card last four digits

Items:

1. No.
2. Source file
3. Line number
4. Description
5. Quantity
6. Unit price
7. Amount

### Identity document (`identity_document`, version 1)

Documents:

1. No.
2. Source file
3. Document type
4. Document number
5. Full name
6. Date of birth
7. Sex
8. Nationality
9. Place of origin
10. Address
11. Issue date
12. Expiry date
13. Issuing authority

Identification numbers are configured as text. No biometric recognition or face comparison was added.

### Bank statement (`bank_statement`, version 1)

Documents:

1. No.
2. Source file
3. Bank name
4. Account holder
5. Account number
6. Statement start date
7. Statement end date
8. Currency
9. Opening balance
10. Total credits
11. Total debits
12. Closing balance

Transactions:

1. No.
2. Source file
3. Transaction number
4. Date
5. Description
6. Reference
7. Debit
8. Credit
9. Balance

### Purchase order (`purchase_order`, version 1)

Documents:

1. No.
2. Source file
3. Purchase order number
4. Order date
5. Buyer name
6. Supplier name
7. Delivery date
8. Delivery address
9. Currency
10. Subtotal
11. Tax
12. Total amount
13. Payment terms
14. Shipping terms

Items:

1. No.
2. Source file
3. Line number
4. Item code
5. Description
6. Quantity
7. Unit
8. Unit price
9. Amount

## Persistence and migrations

New additive migration:

```text
c31f6e9a4b72_add_preset_export_snapshots.py
```

It follows the existing `a91d4e7c2f10` head and adds nullable/backfilled fields without editing an applied migration:

- `preset_id`
- `preset_version`
- `schema_snapshot`
- `export_definition_snapshot`

Old rows receive `schema_snapshot = requested_field_configuration`. Preset and export snapshots remain nullable for historical records created before presets existed. New business batches send all four values. No second Python preset registry was created.

## Excel behavior

Combined output:

- one source document becomes one row in `Documents`
- `No.` starts at 1
- `Source file` links each row to its upload
- remaining columns follow the preset order exactly
- absent values remain blank
- arrays receive one separately named sheet in configured order
- table rows have their own `No.` and `Source file` parent relationship

Separate output:

- every workbook has the same one-row `Documents` sheet
- arrays remain separate sheets
- multiple workbooks are downloaded in one ZIP

Exports preserve strings such as leading-zero identity/tax/account numbers, Vietnamese Unicode, configured widths, wrapped long-field widths, frozen-header metadata, filters, and consistent date/number column definitions. Legacy history without export snapshots has a compatibility fallback; all new known-preset history uses the saved stable definition.

## Home, login, and footer

Home now contains only:

- concise hero and one product preview
- Three steps
- the same five supported document types
- custom-setup Contact us section
- one compact developer link
- three FAQs

Repeated benefit, examples, current-tools, raw developer explanation, and repeated CTA sections were removed.

Login now contains only the logo, account mode title, email, password, primary action, account-mode switch, show/hide password, and optional Google control. Configuration, retention, allowance-explanation, and bottom upload copy were removed.

The footer now contains only product name, Process Documents, Developers, Contact, Telegram, and copyright. The retention sentence and tagline were removed.

## Visual system

`design-system/MASTER.md` and `src/app/globals.css` now define a restrained blue/neutral system.

Light:

- primary `#2563EB`, hover `#1D4ED8`, subtle `#EFF6FF`
- text `#111827` / `#4B5563`
- background `#F7F8FA`, surface `#FFFFFF`, border `#D1D5DB`
- success `#15803D`, warning `#B45309`, error `#B91C1C`

Dark:

- background `#0F172A`
- surface `#111827`, raised `#1F2937`, border `#374151`
- text `#F9FAFB` / `#CBD5E1`
- primary `#60A5FA`

Controls use 4px radii, panels 6px, modals 8px, and only status/account circles use full rounding. No gradients, glow, neon/lime, glass, decorative AI graphics, or exaggerated shadows remain in active public UI.

## Files

Added:

- `src/config/document-presets.ts`
- `src/config/document-presets.test.ts`
- `src/components/demo/excel/useDocumentPreset.ts`
- `src/app/contact/page.tsx`
- `src/features/auth/api.test.ts`
- `src/product-contract.test.ts`
- `docs/KDA_SIMPLIFICATION_AND_GOOGLE_AUTH_REPORT.md`
- `docs/kda-simplification-screenshots/*.png`
- backend `migrations/versions/c31f6e9a4b72_add_preset_export_snapshots.py`

Modified:

- frontend `.env`, `next.config.mjs`, `design-system/MASTER.md`
- frontend app shell, Home, login, upload, History, developers metadata, manifest, sitemap/SEO, palette, Header, Footer, FAQ, Contact data
- frontend auth API/UI, upload state, file list, processing/result UI, history API, preset workbook/ZIP/CSV export, and tests
- backend extraction model, extraction request/response schemas, extraction history service, and auth/HTTP contract tests

Deleted:

- `src/components/demo/excel/templates.ts`
- `src/components/demo/excel/useExtractionTemplate.ts`
- `src/components/CTA.tsx`
- `src/data/hero.ts`
- `src/data/landing.tsx`

No temporary upload fixture files or paid-provider mock data were retained.

## Automated validation

Frontend:

```text
npm run lint   -> passed, no warnings or errors
npm test       -> 5 files, 15 tests passed
npm run build  -> passed, 16 pages generated
```

Frontend tests cover:

- exact HTTPS Google endpoint and `{ id_token }` payload
- session setup and `/upload` redirect contract
- guest primary navigation without History
- authenticated History and Sign out controls
- absence of public Custom fields
- all five presets and stable invoice columns
- identity number text type
- one-row-per-document combined output
- separate array sheets and separate-workbook `Documents` sheet
- UTF-8/ZIP export behavior
- empty selected-file section condition
- removed Home/footer copy
- exact Telegram URL
- two-request processing concurrency

Backend:

```text
python -m compileall -q main.py app migrations -> passed
pytest -q                                      -> 25 passed, 5 dependency warnings
alembic heads                                  -> c31f6e9a4b72 (head)
alembic upgrade head --sql                     -> passed
```

Development OpenAPI:

```text
/api/v1/auth/google -> present
GoogleLoginRequest  -> required id_token only
client_secret       -> absent
```

Backend tests cover mocked Google verification, new/existing Google users, invalid token, unverified email/required subject, duplicate-email conflict, no password for Google users, normal response envelope, OpenAPI route, no client secret field, and unchanged password login.

The five backend warnings are existing PyMuPDF/SWIG deprecation warnings.

## Browser validation and screenshots

The local Next.js app was checked at 1440×900 and 390×844 with mocked account, quota, history, batch, correction, Google, and OCR endpoints. No request reached a model provider.

Confirmed:

- Google credential callback sent one backend request
- returned JWT hydrated current user and quota and redirected to `/upload`
- COOP response header is `same-origin-allow-popups`
- all five preset states render
- empty selected section is absent
- 13 selected files render compactly
- completed results remain understandable
- avatar menu contains allowance, History, and Sign out
- History pagination surface remains
- no horizontal overflow on checked desktop/mobile pages
- no sticky-header overlap
- mobile menu height was approximately 270px
- no computed gradient backgrounds
- no lime/neon remnants
- no JSON, schema, provider, pipeline, or public Custom fields on Process Documents
- compact mobile footer has no technical/tagline orphan

Screenshots are stored in `docs/kda-simplification-screenshots/`:

1. Home desktop
2. Login with Google configured
3. Process Documents empty
4. Invoice selected
5. Receipt selected
6. Identity document selected
7. Bank statement selected
8. Purchase order selected
9. 13 selected files
10. Processed result
11. Avatar menu
12. History desktop
13. Contact desktop
14. Dark mode
15. Home mobile
16. Process Documents mobile
17. Contact mobile
18. History mobile
19. Mobile navigation
20. Mobile footer

A development-only hot-reload fetch fallback appeared once while browser routes were being reconfigured; checked pages still rendered and behaved correctly.

## Mocked and still requiring real deployment

Mocked:

- Google ID-token response
- current user and quota
- batch/history/correction APIs
- OCR success data

Not verified with real credentials or production deployment:

- real Google popup credential issuance for the production OAuth client
- deployed backend route/version
- production database migration
- production TLS certificate and HTTPS reachability
- real OCR/model extraction

Before production sign-off:

1. install a valid TLS certificate covering `api.smartocr.kruzo.tech`
2. deploy the current backend and run `alembic upgrade head`
3. set matching backend/frontend Google client IDs
4. set the frontend production `NEXT_PUBLIC_API_BASE_URL=https://api.smartocr.kruzo.tech`
5. include the production frontend origin in the Google OAuth client and backend CORS list
6. perform one real Google sign-in and verify `/users/me`, quota, and `/upload` redirect

## 2026-07-29 service-layer and execution-history follow-up

This section supersedes earlier quota and output-organization notes in this report.

### Backend controller cleanup

The OCR route no longer contains `_process_ocr_request` and no longer receives
quota, credit, history, usage-log, and provider services as separate endpoint
dependencies. Each OCR endpoint now receives one `OcrExecutionService`.

`OcrExecutionService` owns uploaded-file validation, history resolution,
one-credit reservation immediately before the first provider attempt, failure
refunds, attempt metadata, usage logging, and success/failure persistence.

The monthly quota service remains only as a legacy compatibility surface. It is
not part of document execution. Credits are now the only enforced processing
balance.

Authentication routes now call one service method:

```text
password login -> AuthService.login(...)
Google login   -> AuthService.login_with_google(...)
```

Google verification, account lookup/creation, and Kruzo JWT creation all happen
inside `auth_service.py`.

Generic module filenames were removed:

```text
auth/service.py              -> auth/auth_service.py
api_keys/service.py          -> api_keys/api_key_service.py
credits/service.py           -> credits/credit_service.py
extractions/service.py       -> extractions/extraction_history_service.py
ocr/service.py               -> ocr/ocr_extraction_service.py
ocr/usage.py                 -> ocr/ocr_usage_log_service.py
ocr/quota.py                 -> ocr/ocr_monthly_quota_service.py
users/service.py             -> users/user_service.py
```

The former OCR `constants.py` was split into `document_file_types.py` and
`extraction_limits.py`.

### String-only extraction values and dates

The provider JSON Schema now requires every leaf to be a JSON string. Developer
templates containing number, boolean, or null samples are canonicalized to
string samples before the provider prompt is built. Provider values are also
normalized after parsing:

```text
123   -> "123"
true  -> "true"
null  -> ""
```

The frontend preset registry uses string samples for dates and amounts. Known
preset date fields are normalized after extraction to `yyyy/mm/dd`. Ambiguous
numeric dates are treated as day/month/year. Unknown date text is preserved
instead of guessed.

### Execution grouping and pagination

Migration `e84b7c5a2d19` adds `preset_id` and `preset_version` to extraction
batches. The local database was upgraded from `d7a6c2f4e901` to
`e84b7c5a2d19`.

One web execution accepts exactly one preset/version pair. A batch ID is the
stable execution/run ID. Paginated contracts are:

```http
GET /api/v1/extraction-batches?page=1&page_size=10&status=completed
GET /api/v1/extraction-batches/{batch_id}/documents?page=1&page_size=10&status=failed
GET /api/v1/api-keys?page=1&page_size=20
```

History now renders execution cards. Expanding one execution loads a paginated
file list. Expanding one file renders a two-column `Field` / `Value` table
inline; the old wide history modal was removed.

Step 3 groups files by batch, shows the document type and short run ID, supports
All, Completed, Failed, Processing, and Needs review filters, and paginates five
files per page.

### Excel and credit behavior

The business UI now exports exactly one selected execution to one `.xlsx`
workbook. Every successful source document becomes one horizontal `Documents`
row, including single-document executions. Configured arrays remain on separate
stable sheets.

Per-file XLSX/CSV actions and separate-workbook ZIP behavior were removed from
the business flow. Extracted amounts and identifiers are written as text;
automatic `No.` remains an Excel row number.

The Output panel contains selected files, credits, and `Excel (.xlsx)`.
Monthly remaining and Output organization were removed. Telegram actions cover
buying credits and requesting a higher per-run file limit. Generic public
`up to 20 files` copy was removed; the normal-account guard remains and points
the user to contact when exceeded.

### Google login diagnostics

Google is re-enabled in the local frontend environment and the frontend API
base remains:

```text
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Local browser verification confirmed the Google button renders, COOP is
`same-origin-allow-popups`, the backend route is present, and an invalid token
returns controlled `401 ERR_AUTH_BIZ_1008`.

Credential issuance is currently blocked outside this codebase by Google:

```text
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

Both `http://127.0.0.1:3000` and `http://localhost:3000` reproduced the error.
Add the exact local origin used for development to the OAuth Web client
`Authorized JavaScript origins`.

The production API domain still fails TLS hostname validation:

```text
api.smartocr.kruzo.tech certificate subject: CN=smartocr.kruzo.tech
curl result: SEC_E_WRONG_PRINCIPAL
```

An insecure probe reached the host but `/health` returned `404`. Production
Google login cannot be claimed working until a certificate includes
`api.smartocr.kruzo.tech`, the current backend is deployed, and the route is
tested without disabling TLS verification.

### Follow-up validation

Important follow-up file changes:

- added backend `ocr_execution_service.py`, `document_file_types.py`,
  `extraction_limits.py`, and migration `e84b7c5a2d19`
- renamed every generic module `service.py` to a domain-specific service filename
- deleted backend `ocr/constants.py`
- added frontend `normalizePresetResult.ts` and tests
- replaced `SessionResults.tsx` with run grouping, filters, and pagination
- replaced the History modal in `PreviousResults.tsx` with inline paginated detail
- deleted obsolete per-file `downloadResults.ts`
- updated auth, history, preset, export, Header, Output, Contact, Footer, and tests

Backend:

```text
python -m compileall -q main.py app migrations -> passed
pytest -q                                      -> 29 passed
alembic heads/current                          -> e84b7c5a2d19
development OpenAPI                            -> required routes present
```

Frontend:

```text
npm run lint  -> passed
npm test      -> 19 passed
npm run build -> passed
```

All OCR/browser processing checks in this follow-up used mocked HTTP responses.
No paid model call was made.

New screenshots:

- `login-google-reenabled-1440x900.png`
- `process-credits-horizontal-runs-1440x900.png`
- `execution-group-certificate-1440x900.png`
- `certificate-normalized-date-1440x900.png`
- `history-inline-key-value-1440x900.png`
- `history-inline-key-value-390x844.png`

## 2026-07-30 account-linking and run-history refinement

### Google account linking

The local `409` root cause was the same-email branch in
`AuthService.authenticate_google`: every existing email without the same
`google_sub` was rejected with `ERR_AUTH_BIZ_1009`.

The rule is now intentionally one-way:

- a verified Google identity may link to an active password account with the
  same normalized email;
- linking stores `google_sub` and fills a missing name/avatar without replacing
  the existing password;
- an existing Google-only account still cannot register the same email;
- an account without a password still cannot use change-password;
- a different Google subject cannot replace an existing `google_sub`.

The frontend continues to send the Google credential once as `id_token` to
`POST /api/v1/auth/google`. Local responses include:

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

The Edge COOP diagnostic can still be printed by Google Identity Services, but
the reported network trace proves that the credential callback ran and reached
the backend. The actionable failure in that trace was the old backend `409`,
which is now covered by the linking tests above. No security header was
weakened.

### Credits per execution

Migration `f92d3a6b4c11` adds `extraction_batches.credits_used`, backfills it from
`completed_count`, and is the current local Alembic head. A successful file
uses one credit; failed files are refunded, so batch credit use follows the
successful document count.

Both History and the current-session result cards show credit use. History
continues to paginate executions and loads a paginated file list only when the
user expands one execution. Process Documents now keeps only the three most
recent in-memory executions, keeps them collapsed by default, and links to the
full History page.

### API playground

- `View code examples` opens by default with cURL selected.
- The JSON-template editor and read-only response area are shorter.
- The response preview updates from the edited template and selected filename.
- Sample leaf values are strings.
- `JSON template formatted.` was removed.
- Code and response areas scroll internally.
- The preset select uses an inset custom chevron.
- An API key entered by the user remains visible in generated examples; stored
  raw keys are still returned only once when created.

### Logo locations

The header/footer brand mark is currently inline SVG in
`src/components/KruzoLogo.tsx`, not an image reference. The installable-app icon
is `public/kruzo-mark.svg`, and the browser-tab icon is
`src/app/favicon.ico`.

### Validation

Backend:

```text
python -m compileall -q main.py app migrations -> passed (Python 3.11 venv)
pytest -q                                      -> 31 passed
alembic heads/current                          -> f92d3a6b4c11
development OpenAPI                            -> /api/v1/auth/google present
```

Frontend:

```text
npm run lint  -> passed
npm test      -> 20 passed
npm run build -> passed
```

Browser checks used `graduated.jpg` with mocked OCR/history HTTP responses.
Four mock executions produced exactly three visible recent-run cards, History
expanded one execution into its file list, cURL opened by default, the response
was read-only, COOP was correct, and no page had horizontal overflow. No paid
model call was made.

New screenshots:

- `api-playground-refined.png`
- `upload-three-recent-runs.png`
- `history-grouped-credits.png`

Real Google credential issuance still requires the configured Google OAuth
client and an interactive user sign-in. Production remains unverified until
the current backend is deployed and the production TLS hostname mismatch
documented above is corrected.
