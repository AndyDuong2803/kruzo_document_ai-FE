import type { WorkbookSheet } from "@/features/ocr/preview";
import { buildCsvFromSheet, buildWorkbookBlob } from "@/features/ocr/export";

const filenameBase = (filename: string) =>
  filename.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "kruzo-document";

const sheetFilenamePart = (sheetName: string) =>
  sheetName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sheet";

const downloadBlob = (blob: Blob, filename: string, successMessage: string, notify: (message: string) => void) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
  notify(successMessage);
};

export const downloadSheetCsv = (
  sheet: WorkbookSheet | undefined,
  sourceFilename: string,
  notify: (message: string) => void
) => {
  if (!sheet || sheet.rows.length === 0) {
    return;
  }

  const blob = new Blob([buildCsvFromSheet(sheet)], { type: "text/csv;charset=utf-8" });
  downloadBlob(
    blob,
    `${filenameBase(sourceFilename)}-${sheetFilenamePart(sheet.name)}-kruzo.csv`,
    "CSV downloaded. Excel can open this file.",
    notify
  );
};

export const downloadWorkbook = (
  sheets: WorkbookSheet[] | undefined,
  sourceFilename: string,
  notify: (message: string) => void
) => {
  const usableSheets = sheets?.filter((sheet) => sheet.rows.length > 0) ?? [];

  if (usableSheets.length === 0) {
    return;
  }

  downloadBlob(
    buildWorkbookBlob(usableSheets),
    `${filenameBase(sourceFilename)}-kruzo.xlsx`,
    "XLSX downloaded. Excel can open this workbook.",
    notify
  );
};
