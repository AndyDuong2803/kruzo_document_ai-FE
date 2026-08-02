# Kruzo Document AI Design System

## Direction

- Serious, task-first document processing for business users.
- Light mode is the default; dark mode is fully supported.
- Normal-user pages use plain language and never expose JSON, model, provider, schema, or orchestration terminology.
- Prefer borders, spacing, and clear typography over decorative surfaces.

## Foundation

- Font: Plus Jakarta Sans with system sans-serif fallbacks; body 16/24.
- Light background `#F7F8FA`, surface `#FFFFFF`, primary text `#111827`, secondary text `#4B5563`, border `#D1D5DB`.
- Light primary `#2563EB`, hover `#1D4ED8`, subtle `#EFF6FF`.
- Light success `#15803D`, warning `#B45309`, error `#B91C1C`.
- Dark background `#0F172A`, surface `#111827`, raised surface `#1F2937`, border `#374151`.
- Dark primary text `#F9FAFB`, secondary text `#CBD5E1`, primary `#60A5FA`.

## Shape and hierarchy

- Inputs and buttons: 4px radius.
- Cards and panels: 6px radius.
- Modals: 8px radius.
- Status badges: 999px radius only for real statuses.
- Header: Home, Process Documents, Developers, Contact; then sign-in/account and theme controls.
- History is available from the authenticated account menu, not the main navigation.
- Process Documents uses three stages and a compact Output panel. Mobile stacks without horizontal overflow at 390px.
- Document-type choices use an 84px minimum height with an icon and one compact text block.
- Excel-column previews use numbered bordered cells, never dot-separated prose.
- Home workflow and supported types use one connected bordered group per concept rather than floating marketing cards.
- Login uses a compact copyright footer so an otherwise short page does not create a meaningless scrollbar.
- The standard footer provides credit usage, API documentation, API-key management, and business-workflow help.

## Interaction and accessibility

- Visible labels, readable body text, AA contrast, 2px focus outlines, and semantic status colors.
- Selected document types use a primary border and subtle primary background.
- Respect `prefers-reduced-motion`.
- Google controls and divider are absent when the public Google client ID is not configured.

## Avoid

- Gradients, glow, neon or lime colors, glass, bento layouts, decorative AI graphics, tinted card stacks, exaggerated shadows, large rounded cards, and floating surfaces without purpose.
- Repeated headings, paragraphs that restate headings, technical internal terminology, oversized empty states, and more than one helper sentence per form section.
