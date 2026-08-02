import {
  humanizeFieldName,
  isLargeTextBlob,
  isRawTextKey,
  isRecord,
  sanitizePreviewValue,
  shouldHideFieldKey,
  stringifyValue,
} from "./utils";
import type { PreviewRow, ReviewState } from "./types";

const reviewStateFromField = (fieldValue: Record<string, unknown>): ReviewState => {
  if (fieldValue.review_required === true || fieldValue.needs_review === true) {
    return "Needs review";
  }

  if (fieldValue.review_required === false || fieldValue.needs_review === false) {
    return "Approved";
  }

  return "Unknown";
};

export const looksLikeExtractedField = (value: Record<string, unknown>) =>
  "value" in value ||
  "extracted_value" in value ||
  "raw_value" in value ||
  "confidence" in value ||
  "score" in value ||
  "review_required" in value ||
  "needs_review" in value;

const getExtractedFieldValue = (value: Record<string, unknown>) => {
  if ("value" in value) {
    return value.value;
  }

  if ("extracted_value" in value) {
    return value.extracted_value;
  }

  if ("raw_value" in value) {
    return value.raw_value;
  }

  return value.text;
};

const rowFromField = (key: string, value: unknown, includeEmpty = false): PreviewRow | null => {
  if (shouldHideFieldKey(key)) {
    return null;
  }

  if (isRecord(value) && looksLikeExtractedField(value)) {
    const extractedValue = getExtractedFieldValue(value);
    const stringValue = stringifyValue(extractedValue);

    if (isRawTextKey(key) || isLargeTextBlob(stringValue)) {
      return null;
    }

    const sanitizedValue = sanitizePreviewValue(extractedValue);

    if (!sanitizedValue && !includeEmpty) {
      return null;
    }

    return {
      field: humanizeFieldName(key),
      value: sanitizedValue,
      review: reviewStateFromField(value),
    };
  }

  if (Array.isArray(value) || isRecord(value)) {
    return null;
  }

  const stringValue = stringifyValue(value);

  if (isLargeTextBlob(stringValue)) {
    return null;
  }

  const sanitizedValue = sanitizePreviewValue(value);

  if (!sanitizedValue && !includeEmpty) {
    return null;
  }

  return {
    field: humanizeFieldName(key),
    value: sanitizedValue,
    review: "Unknown",
  };
};

export const normalizeFields = (fields: unknown, includeEmpty = false): PreviewRow[] => {
  if (Array.isArray(fields)) {
    return fields
      .map((field, index) => {
        if (!isRecord(field)) {
          return rowFromField(`Field ${index + 1}`, field, includeEmpty);
        }

        const key = stringifyValue(field.field ?? field.name ?? field.key ?? field.label ?? `Field ${index + 1}`);
        return rowFromField(key, field, includeEmpty);
      })
      .filter((row): row is PreviewRow => Boolean(row));
  }

  if (!isRecord(fields)) {
    return [];
  }

  return Object.entries(fields)
    .map(([key, value]) => rowFromField(key, value, includeEmpty))
    .filter((row): row is PreviewRow => Boolean(row));
};

export const flattenBusinessFields = (
  value: Record<string, unknown>,
  prefix = "",
  rows: PreviewRow[] = []
) => {
  Object.entries(value).forEach(([key, entry]) => {
    if (key === "tables" || key === "fields" || shouldHideFieldKey(key)) {
      return;
    }

    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(entry)) {
      return;
    }

    if (isRecord(entry) && !looksLikeExtractedField(entry)) {
      flattenBusinessFields(entry, path, rows);
      return;
    }

    const row = rowFromField(path, entry);

    if (row) {
      rows.push(row);
    }
  });

  return rows;
};

export const isUserFacingPreviewRow = (row: PreviewRow) =>
  Boolean(row.field) && !shouldHideFieldKey(row.field);
