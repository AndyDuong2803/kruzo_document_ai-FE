import type { PreviewRow, WorkbookSheet } from "./types";

export const fieldsSheetFromRows = (rows: PreviewRow[]): WorkbookSheet => ({
  id: "extracted-fields",
  name: "Extracted fields",
  columns: ["Field", "Extracted value", "Review"],
  rows: rows.map((row) => [row.field, row.value, row.review]),
});
