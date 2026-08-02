# Kruzo Document AI Business UX Implementation Report

Date: 2026-07-28

## Scope and repositories

- Frontend: `D:\Project\PersonalProject\SmartOCR\kruzo-service`
- Backend: `D:\Project\PersonalProject\SmartOCR\smartocr_backend`
- Production API URLs remain environment-driven. Existing repository names and `api.smartocr.kruzo.tech` were not renamed.
- The implementation did not delete, recreate, or migrate a live database.

## Delivered product

The public product name is now **Kruzo Document AI**. Browser metadata, manifest, logo, header, login, footer, frontend README, backend application name, OpenAPI information, backend README, and current report headings use the new name.

The normal-user experience is positioned around turning business PDFs and images into Excel without manual entry. Automotive repair, repair-order, Ford, Mazda, generic developer-dashboard positioning, intrusive chat UI, fake pricing/proof, raw JSON, model names, and invented confidence values were removed from active business-facing code. Historical audit text is retained only inside clearly marked superseded audit artifacts.

`design-system/MASTER.md` is the concise visual source of truth: light mode by default, warm neutral backgrounds, solid surfaces, restrained lime actions, compact radii and shadows, visible focus, dark mode, reduced motion, and responsive 390px layouts.

## Information architecture

Primary navigation:

- Home
- Upload Documents
- Previous Results

Secondary navigation:

- For Developers
- Contact
- Sign in/account action
- Theme switcher

Contact links open the requested Telegram URL directly. The developer page provides quieter access to API Playground and Documentation. `/try` redirects to `/upload`; `/pricing` and `/api-keys` remain removed.

The home page now contains the requested headline and supporting copy, a many-documents-to-Excel preview, business benefits, three steps, broad document examples, current-tools positioning, a small developer section, FAQ, custom-output CTA, and grouped professional footer.

## Upload and processing UX

`/upload` is organized as:

1. Choose information
2. Add documents
3. Review and download

Desktop uses a main workspace plus sticky batch summary; mobile stacks the same areas. Business users see presets for General document, Business form, Report or checklist, Document with a table, and Custom. Custom mode supports friendly Text, Number, Date, Yes/No, List, and Table fields; users can rename, require, reorder, remove, and add table columns. Technical keys and the generated backend template stay internal.

The centrally configured initial limit is 20 documents, 10 MB each, with PDF/JPG/PNG/WebP validation, duplicate detection, add-more, remove, clear-all, count, and selected-file metadata. Processing is disabled for missing authentication, files, configured information, allowance, or an active run. A before-unload warning is active during processing.

The frontend creates the history batch first and then sends each document to the existing authenticated single-document endpoint. `runWithConcurrency(..., 2, ...)` enforces at most two concurrent document requests. Each item keeps its own waiting/processing/completed/failed state. One failure does not remove successful results, and only failed current-session documents expose Retry.

Result review uses readable labels rather than JSON. Scalar values, nested values, and values inside arrays can be corrected and persisted. Tables remain visible in a readable grid. Only explicit backend review flags create a warning state; no confidence value is manufactured.

## Previous Results and persistence

`/results` is authenticated, newest-first, and server-paginated at 10 batches per page. It includes loading, empty, error, previous/next, and practical page-number states. Batch cards show processing time, document/completed/attention counts, status, and output organization.

Batch details show document names, statuses, safe errors, saved extracted or user-corrected values, nested/array sheets, and re-download. The UI states accurately that original uploaded files are not retained. Historical failed documents cannot be retried without re-selecting the original file; no fake file preview or unusable Retry is shown.

Backend additions:

- `ExtractionBatch`: account owner, output format/organization, status, counts, created/completed timestamps.
- `ExtractionDocument`: batch, original file metadata, status, requested configuration snapshot, extracted result, corrected result, safe error, timestamps.
- No raw file bytes, Base64 image, raw provider response, or provider exception body is stored.

Authenticated envelope endpoints:

```text
POST  /api/v1/extraction-batches
GET   /api/v1/extraction-batches?page=1&page_size=10
GET   /api/v1/extraction-batches/{batch_id}
PATCH /api/v1/extraction-documents/{document_id}/result
```

The existing `POST /api/v1/ocr/extract-custom` accepts optional `batch_id` and `extraction_document_id` form fields. Ownership is checked before association. Success and safe failure update the document and aggregate batch counts.

Migration `a91d4e7c2f10` is additive, follows `f8c1a6d7b2e3`, creates `extraction_batches` and `extraction_documents`, adds account/batch foreign keys and status/owner indexes, and is the single Alembic head.

## Export behavior

Excel is the default.

Combined workbook:

- `Documents`: Document, Status, then stable readable scalar columns; nested scalar labels use `Parent - Child`.
- One sheet per array path.
- Object arrays begin with Document and Item #.
- Primitive arrays add Value.
- Nested arrays add Parent item # to preserve relationships.

Separate workbooks:

- Each document has a `Summary` sheet plus one sheet per array.
- One document downloads one XLSX.
- Multiple documents download one sanitized ZIP containing one XLSX per document.

CSV:

- One flat document downloads one CSV.
- Multiple documents or any arrays download one ZIP containing `documents.csv` plus array CSVs.
- CSV uses UTF-8 BOM for Excel compatibility.

Exports provide stable ordering, readable widths, wrapped content, frozen/filterable headers, safe 31-character unique sheet names, Vietnamese Unicode, and preservation of leading-zero IDs as text. Browser checks confirmed the combined XLSX, separate-workbook ZIP, CSV ZIP, and history re-download filenames.

## Authentication integration

The login page supports the existing email/password registration and login contracts plus Google Identity Services ID-token UI when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is configured. Successful mocked auth loads current user and monthly allowance, redirects to Upload Documents, and stores the access token for the current browser.

OCR and history requests attach:

```http
Authorization: Bearer <access-token>
```

The developer playground may additionally send a nonblank `X-API-Key`. It never uses that preview key as a Bearer replacement.

## Files

Important additions:

- Frontend routes: `src/app/upload`, `src/app/results`, `src/app/developers`, `src/app/manifest.ts`
- Frontend account/history: `src/features/auth/AuthProvider.tsx`, `src/features/auth/api.ts`, `src/features/history/api.ts`, `src/components/history/PreviousResults.tsx`
- Frontend batch/export: `src/features/ocr/export/batch.ts`, `src/features/ocr/export/batch.test.ts`, `src/components/demo/excel/processUploads.test.ts`, `vitest.config.ts`
- Frontend product/screenshots: `src/data/product.ts`, `docs/kda-business-ux-screenshots/*`
- Backend history: `app/db/models/extraction.py`, `app/modules/extractions/*`, `app/api/v1/extractions.py`
- Backend migration: `migrations/versions/a91d4e7c2f10_add_extraction_batch_history.py`

Important modified groups:

- Frontend shell, landing, login, upload workspace, API playground/docs, auth headers, exports, preview normalization, SEO, README, environment example, package manifest/lock, and visual system.
- Backend app configuration, OpenAPI, model registration/relationships, dependencies, OCR request/route association, error catalog, README, environment example, tests, and MVP/audit report headings.

Deleted obsolete frontend groups:

- Pricing/API-key routes and pricing UI.
- Duplicate marketing, statistics, testimonial, reveal, and section components.
- Obsolete auth placeholders/middleware.
- Old guided-tour, local-history, duplicate API history, confidence calculation, and redundant preview/submit components.

Temporary browser fixture files were removed after screenshot capture. Existing older audit screenshot artifacts were not deleted.

## Automated validation

Final frontend commands:

```text
npm run lint   -> passed, no warnings or errors
npm test       -> 2 files, 5 tests passed
npm run build  -> passed, 15 static/dynamic pages generated
```

Export tests cover nested scalar objects, object arrays, primitive/nested arrays, multiple documents, combined/separate workbook layout, duplicate sheet names, ZIP creation, Vietnamese text, and leading-zero IDs. The queue test proves the maximum active document jobs is exactly two.

Final backend commands:

```text
python -m compileall -q main.py app migrations -> passed
pytest -q                                      -> 21 passed, 5 dependency warnings
alembic heads                                  -> a91d4e7c2f10 (head)
alembic upgrade head --sql                     -> passed
```

Development OpenAPI inspection confirmed:

- Title: `Kruzo Document AI`
- Required auth, user, allowance, OCR, batch-list/detail, and correction paths exist.
- OCR and history operations require `BearerAuth`.
- OCR multipart fields are `file`, `schema_sample`, `batch_id`, and `extraction_document_id`.
- Batch list default `page_size` is 10.

Tests mock Google verification and the model provider. No real Google sign-in, paid/free OpenRouter request, or provider token spend occurred.

## Playwright findings

The configured in-app browser bridge rejected setup with `missing field sandboxPolicy`, so the actual Next.js site was tested through direct Playwright browser automation instead. Controlled route mocks were used for account, allowance, OCR, correction, and history APIs.

Verified:

- Light default and working dark theme.
- Desktop and mobile header/navigation.
- Home, login, upload, previous results, developer page, docs, footer, and exact Telegram links.
- Mocked registration/login redirect and Google login control presence.
- Twelve-file selection, add-more, duplicate/invalid rejection, 20-file limit messaging, and insufficient-allowance disablement.
- Partial failure preserves completed results; retry remains available.
- Result editing invokes the correction endpoint.
- Combined XLSX, separate XLSX ZIP, CSV ZIP, nested/primitive array exports, pagination, batch detail, and history re-download.
- Normal-user upload pages contain no visible JSON or confidence.
- No horizontal overflow at 1440x900 or 390x844 in checked views.

Screenshots:

1. `01-home-desktop-1440x900.png`
2. `02-home-dark-desktop-1440x900.png`
3. `03-home-mobile-390x844.png`
4. `04-mobile-navigation-390x844.png`
5. `05-login-desktop-1440x900.png`
6. `06-upload-guest-desktop-1440x900.png`
7. `07-upload-13-documents-desktop-1440x900.png`
8. `08-upload-partial-failure-desktop-1440x900.png`
9. `09-upload-results-mobile-390x844.png`
10. `10-previous-results-desktop-1440x900.png`
11. `11-previous-results-mobile-390x844.png`
12. `12-for-developers-desktop-1440x900.png`

## Remaining risks and unverified behavior

- Real Google credential/certificate exchange and real provider extraction were intentionally not exercised; production success depends on valid environment configuration and outbound access.
- Historical retry requires re-selecting the original document because file bytes are deliberately not retained.
- Table rows are shown in review while individual nested values are editable through the readable information list; a spreadsheet-style inline table editor is not implemented.
- Access tokens use browser local storage and the existing 60-minute backend expiry; no refresh-token flow was introduced.
- The installed dependency tree currently reports 21 npm audit findings (6 moderate, 13 high, 2 critical). No potentially breaking automatic audit fix was applied.
- The five backend warnings come from existing PyMuPDF/SWIG dependency deprecations.
