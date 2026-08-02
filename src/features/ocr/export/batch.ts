import JSZip from "jszip";
import * as XLSX from "xlsx";

import type {
  ExportColumn,
  ExportDefinition,
  PresetValueType,
} from "@/config/document-presets";
import { buildCsvFromSheet } from "./csv";

export type ExportSheet = {
  name: string;
  columns: string[];
  rows: unknown[][];
  columnDefinitions?: ExportColumn[];
};

export type BatchExportDocument = {
  name: string;
  status: string;
  result: Record<string, unknown> | null;
  exportDefinition?: ExportDefinition | null;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const humanize = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const legacyDefinition = (document: BatchExportDocument): ExportDefinition => {
  const result = document.result ?? {};
  const fields: ExportColumn[] = [];
  const tables: ExportDefinition["tables"] = [];
  Object.entries(result).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const sample = value.find(isObject);
      const columns = sample
        ? Object.keys(sample).map((columnKey) => ({
            key: columnKey,
            label: humanize(columnKey),
            type: "text" as const,
          }))
        : [{ key: "value", label: "Value", type: "text" as const }];
      tables.push({
        key,
        name: humanize(key),
        columns: [
          { key: "__number", label: "No.", type: "number" },
          { key: "__source_file", label: "Source file", type: "text" },
          ...columns,
        ],
      });
    } else if (!isObject(value)) {
      fields.push({ key, label: humanize(key), type: "text" });
    }
  });
  return {
    documentsSheet: {
      name: "Documents",
      columns: [
        { key: "__number", label: "No.", type: "number" },
        { key: "__source_file", label: "Source file", type: "text" },
        ...fields,
      ],
    },
    tables,
  };
};

const definitionFor = (documents: BatchExportDocument[]) =>
  documents.find((document) => document.exportDefinition)?.exportDefinition ??
  legacyDefinition(documents[0]);

const valueForColumn = (
  column: ExportColumn,
  result: Record<string, unknown>,
  sourceFile: string,
  rowNumber: number
) => {
  if (column.key === "__number") return rowNumber;
  if (column.key === "__source_file") return sourceFile;
  const value = result[column.key];
  if (value == null || Array.isArray(value) || isObject(value)) return "";
  return String(value);
};

const documentSheet = (
  documents: BatchExportDocument[],
  definition: ExportDefinition
): ExportSheet => ({
  name: definition.documentsSheet.name,
  columns: definition.documentsSheet.columns.map((column) => column.label),
  columnDefinitions: definition.documentsSheet.columns,
  rows: documents.map((document, index) =>
    definition.documentsSheet.columns.map((column) =>
      valueForColumn(column, document.result ?? {}, document.name, index + 1)
    )
  ),
});

const tableSheets = (
  documents: BatchExportDocument[],
  definition: ExportDefinition
): ExportSheet[] =>
  definition.tables.map((table) => {
    let rowNumber = 0;
    const rows = documents.flatMap((document) => {
      const rawRows = document.result?.[table.key];
      if (!Array.isArray(rawRows)) return [];
      return rawRows.map((rawRow) => {
        rowNumber += 1;
        const result = isObject(rawRow) ? rawRow : { value: rawRow };
        return table.columns.map((column) =>
          valueForColumn(column, result, document.name, rowNumber)
        );
      });
    });
    return {
      name: table.name,
      columns: table.columns.map((column) => column.label),
      columnDefinitions: table.columns,
      rows,
    };
  });

export const buildCombinedSheets = (documents: BatchExportDocument[]): ExportSheet[] => {
  if (!documents.length) return [];
  const definition = definitionFor(documents);
  return [documentSheet(documents, definition), ...tableSheets(documents, definition)];
};

const safeSheetName = (name: string, index: number, used: Set<string>) => {
  const base = (name.replace(/[\\/?*\[\]:]/g, " ").replace(/\s+/g, " ").trim() || `Sheet ${index + 1}`).slice(0, 31);
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    const label = ` ${suffix++}`;
    candidate = `${base.slice(0, 31 - label.length)}${label}`;
  }
  used.add(candidate);
  return candidate;
};

const defaultWidth = (type: PresetValueType) => type === "date" ? 14 : type === "number" ? 14 : 20;

export const buildWorkbook = (sheets: ExportSheet[]) => {
  const workbook = XLSX.utils.book_new();
  const used = new Set<string>();
  sheets.forEach((sheet, index) => {
    const worksheet = XLSX.utils.aoa_to_sheet([sheet.columns, ...sheet.rows], { cellDates: false });
    worksheet["!cols"] = sheet.columns.map((column, columnIndex) => {
      const configured = sheet.columnDefinitions?.[columnIndex];
      return {
        wch: configured?.width ?? Math.min(
          42,
          Math.max(
            defaultWidth(configured?.type ?? "text"),
            column.length + 2,
            ...sheet.rows.map((row) => String(row[columnIndex] ?? "").length + 2)
          )
        ),
      };
    });
    worksheet["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" };
    if (sheet.columns.length > 0) worksheet["!autofilter"] = { ref: worksheet["!ref"] || "A1:A1" };
    sheet.columnDefinitions?.forEach((column, columnIndex) => {
      if (!column.wrap) return;
      for (let rowIndex = 1; rowIndex <= sheet.rows.length; rowIndex += 1) {
        const address = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
        if (worksheet[address]) {
          worksheet[address].s = { alignment: { wrapText: true, vertical: "top" } };
        }
      }
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName(sheet.name, index, used));
  });
  return workbook;
};

export const buildWorkbookArray = (sheets: ExportSheet[]) =>
  XLSX.write(buildWorkbook(sheets), { bookType: "xlsx", type: "array", cellDates: false }) as ArrayBuffer;

export const buildCombinedWorkbookBlob = (documents: BatchExportDocument[]) =>
  new Blob([buildWorkbookArray(buildCombinedSheets(documents))], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

const safeFileBase = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "document";

export const buildCsvDownload = async (documents: BatchExportDocument[]) => {
  const sheets = buildCombinedSheets(documents);
  if (documents.length === 1 && sheets.length === 1) {
    return {
      blob: new Blob([buildCsvFromSheet(sheets[0])], { type: "text/csv;charset=utf-8" }),
      filename: `${safeFileBase(documents[0].name)}.csv`,
    };
  }
  const zip = new JSZip();
  sheets.forEach((sheet, index) => {
    zip.file(index === 0 ? "documents.csv" : `${safeFileBase(sheet.name)}.csv`, buildCsvFromSheet(sheet));
  });
  return {
    blob: await zip.generateAsync({ type: "blob" }),
    filename: "kruzo-document-ai-csv.zip",
  };
};

export const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
