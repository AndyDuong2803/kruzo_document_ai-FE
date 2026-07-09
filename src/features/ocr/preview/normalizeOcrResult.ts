import type { ApiEnvelope, OcrData } from "@/features/ocr/api";

import { flattenBusinessFields, isUserFacingPreviewRow, normalizeFields } from "./fieldNormalizer";
import { extractArrayTables, normalizeTables, workbookSheetsFromTables } from "./tableNormalizer";
import { extractExplicitRawText, extractRawText } from "./rawText";
import { fieldsSheetFromRows } from "./sheets";
import { hasStableContractShape, isRecord, stringifyValue } from "./utils";
import type { OcrPreview } from "./types";

const unwrapEnvelope = (payload: unknown) => {
  if (isRecord(payload) && "success" in payload && "data" in payload) {
    return payload.data;
  }

  return payload;
};

const getFieldContainers = (data: OcrData) => {
  const result = isRecord(data.result) ? data.result : undefined;
  const extraction = isRecord(data.extraction) ? data.extraction : undefined;

  return [
    data.fields,
    data.extracted_fields,
    data.extractedFields,
    data.structured_fields,
    data.structuredFields,
    data.entities,
    result?.fields,
    extraction?.fields,
  ];
};

const failurePreview = (
  payload: unknown,
  rawJson: string,
  rawText: string,
  message?: string
): OcrPreview => ({
  rows: [],
  tables: [],
  sheets: [],
  rawJson,
  rawText,
  debug: payload,
  hasUsableData: false,
  usedFallback: true,
  message,
});

export const normalizeOcrResult = (payload: ApiEnvelope<OcrData> | OcrData | unknown): OcrPreview => {
  const rawJson = JSON.stringify(payload, null, 2);
  const envelopeData = unwrapEnvelope(payload);
  const rawText = hasStableContractShape(envelopeData)
    ? extractExplicitRawText(payload)
    : extractRawText(payload);

  if (isRecord(payload) && payload.success === false) {
    return failurePreview(payload, rawJson, rawText, stringifyValue(payload.message));
  }

  if (!isRecord(envelopeData)) {
    return failurePreview(payload, rawJson, rawText);
  }

  const data = envelopeData as OcrData;
  const prefersStableContract = hasStableContractShape(data);
  const fieldRows = getFieldContainers(data)
    .map((fields) => normalizeFields(fields, prefersStableContract))
    .find((rows) => rows.length > 0) ?? [];
  const rows = fieldRows.length > 0 ? fieldRows : prefersStableContract ? [] : flattenBusinessFields(data);
  const tables = prefersStableContract
    ? normalizeTables(data.tables)
    : [...normalizeTables(data.tables), ...extractArrayTables(data)];
  const userRows = rows.filter(isUserFacingPreviewRow);
  const sheets = [fieldsSheetFromRows(userRows), ...workbookSheetsFromTables(tables)];
  const hasUsableData = sheets.some((sheet) => sheet.rows.length > 0);

  return {
    rows: userRows,
    tables,
    sheets,
    rawJson,
    rawText,
    debug: hasUsableData ? undefined : payload,
    hasUsableData,
    usedFallback: !hasUsableData,
  };
};
