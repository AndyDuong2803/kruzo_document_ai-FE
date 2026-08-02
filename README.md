# Kruzo Document AI Web

Business-first Next.js frontend for turning PDFs and images into organized Excel or CSV files.

## Product routes

- `/` — product overview
- `/upload` — authenticated multi-document workspace
- `/results` — paginated previous batches and re-downloads
- `/developers` — quieter developer entry point
- `/try/api` — authenticated API playground
- `/docs` — developer documentation
- `/login` — email/password registration and login plus Google ID-token login

API URLs remain environment-driven. Normal-user pages send Bearer JWT authentication and never expose JSON templates, API keys, model details, or raw responses.

## Development

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

See `design-system/MASTER.md` for the visual source of truth.
