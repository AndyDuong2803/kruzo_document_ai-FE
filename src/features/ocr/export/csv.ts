import type { PreviewRow } from "@/features/ocr/preview";
import { fieldsSheetFromRows } from "@/features/ocr/preview/sheets";
import { isUserFacingPreviewRow } from "@/features/ocr/preview";

const csvBom = "\uFEFF";

const escapeCsvCell = (cell: unknown) => `"${String(cell ?? "").replace(/"/g, '""')}"`;

export const buildCsvFromSheet = (sheet: { columns: string[]; rows: unknown[][] }) => {
  const csvRows = [sheet.columns, ...sheet.rows].map((row) => row.map(escapeCsvCell).join(","));

  return `${csvBom}${csvRows.join("\n")}`;
};

export const buildCsvFromPreviewRows = (rows: PreviewRow[]) => {
  const visibleRows = rows.filter(isUserFacingPreviewRow);

  return buildCsvFromSheet(fieldsSheetFromRows(visibleRows));
};
