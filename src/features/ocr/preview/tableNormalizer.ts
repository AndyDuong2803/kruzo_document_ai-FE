import { looksLikeExtractedField } from "./fieldNormalizer";
import {
  humanizeFieldName,
  isLargeTextBlob,
  isRecord,
  sanitizePreviewValue,
  sheetIdFromName,
  shouldHideFieldKey,
  stringifyValue,
} from "./utils";
import type { DetectedTable, WorkbookSheet } from "./types";

const normalizeRows = (rows: unknown): { columns: string[]; rows: string[][] } => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { columns: [], rows: [] };
  }

  const firstRow = rows[0];

  if (Array.isArray(firstRow)) {
    const width = Math.max(...rows.map((row) => (Array.isArray(row) ? row.length : 0)));
    const columns = Array.from({ length: width }, (_, index) => `Column ${index + 1}`);

    return {
      columns,
      rows: rows.map((row) =>
        Array.isArray(row)
          ? row.map((cell) => sanitizePreviewValue(cell))
          : [sanitizePreviewValue(row)]
      ),
    };
  }

  if (isRecord(firstRow)) {
    const rawColumns = Array.from(
      new Set(rows.flatMap((row) => (isRecord(row) ? Object.keys(row) : [])))
    ).filter((column) => !shouldHideFieldKey(column));

    const columns = rawColumns.filter((column) =>
      rows.some((row) => {
        if (!isRecord(row)) {
          return false;
        }

        const value = row[column];
        const text = stringifyValue(value);
        return !Array.isArray(value) && !isRecord(value) && sanitizePreviewValue(value).length > 0 && !isLargeTextBlob(text);
      })
    );

    return {
      columns: columns.map(humanizeFieldName),
      rows: rows
        .map((row) => {
          if (!isRecord(row)) {
            return columns.map(() => "");
          }

          return columns.map((column) => {
            const value = row[column];

            if (Array.isArray(value) || isRecord(value)) {
              return "";
            }

            return sanitizePreviewValue(value);
          });
        })
        .filter((row) => row.some(Boolean)),
    };
  }

  return {
    columns: ["Index", "Value"],
    rows: rows
      .map((row, index) => [String(index + 1), sanitizePreviewValue(row)])
      .filter((row) => row.some(Boolean)),
  };
};

export const normalizeTables = (tables: unknown): DetectedTable[] => {
  if (!Array.isArray(tables)) {
    return [];
  }

  return tables
    .map((table, index) => {
      if (isRecord(table)) {
        const rowPayload = table.rows ?? table.data ?? table.items ?? [];
        const normalized = normalizeRows(rowPayload);
        const providedColumns = Array.isArray(table.columns)
          ? table.columns
              .map(stringifyValue)
              .filter((column) => column && !shouldHideFieldKey(column))
              .map(humanizeFieldName)
          : [];
        const columns = providedColumns.length > 0 ? providedColumns : normalized.columns;

        return {
          name: shouldHideFieldKey(stringifyValue(table.name)) ? `Table ${index + 1}` : stringifyValue(table.name ?? `Table ${index + 1}`),
          columns,
          rows: normalized.rows,
        };
      }

      const normalized = normalizeRows(table);

      return {
        name: `Table ${index + 1}`,
        columns: normalized.columns,
        rows: normalized.rows,
      };
    })
    .filter((table) => table.rows.length > 0 && table.columns.length > 0);
};

export const extractArrayTables = (
  payload: Record<string, unknown>,
  prefix = "",
  tables: DetectedTable[] = []
) => {
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "tables" || key === "fields" || shouldHideFieldKey(key)) {
      return;
    }

    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      const normalized = normalizeRows(value);

      if (normalized.columns.length > 0 && normalized.rows.length > 0) {
        tables.push({
          name: humanizeFieldName(path),
          columns: normalized.columns,
          rows: normalized.rows,
        });
      }

      value.forEach((entry) => {
        if (isRecord(entry)) {
          extractArrayTables(entry, path, tables);
        }
      });
      return;
    }

    if (isRecord(value) && !looksLikeExtractedField(value)) {
      extractArrayTables(value, path, tables);
    }
  });

  return tables;
};

export const workbookSheetsFromTables = (tables: DetectedTable[]): WorkbookSheet[] =>
  tables.map((table, index) => ({
    id: sheetIdFromName(table.name || `Table ${index + 1}`, index + 2),
    name: table.name || `Table ${index + 1}`,
    columns: table.columns,
    rows: table.rows,
  }));
