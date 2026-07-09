const maxPreviewValueLength = 180;
const maxRawTextLength = 6000;

const hiddenFieldKeys = new Set([
  "completion",
  "confidence",
  "confidencelevel",
  "content",
  "debug",
  "documenttype",
  "error",
  "errorcode",
  "exception",
  "json",
  "language",
  "markdown",
  "message",
  "metadata",
  "needsreview",
  "position",
  "positions",
  "prompt",
  "provider",
  "providername",
  "raw",
  "rawcontent",
  "rawjson",
  "rawmarkdown",
  "rawoutput",
  "rawresponse",
  "rawtext",
  "requestid",
  "response",
  "review",
  "stack",
  "status",
  "success",
  "text",
  "trace",
  "traceid",
  "usage",
]);

const hiddenFieldFragments = [
  "coordinate",
  "debug",
  "metadata",
  "openrouter",
  "provider",
  "requestid",
  "traceid",
  "rawtext",
  "rawjson",
  "prompt",
  "position",
  "tokenusage",
  "stacktrace",
];

const rawTextKeys = new Set([
  "fulltext",
  "markdown",
  "ocrtext",
  "plaintext",
  "rawmarkdown",
  "rawtext",
  "text",
]);

export const normalizeKeyForMatch = (value: string) => value.replace(/[^a-z0-9]/gi, "").toLowerCase();

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

export const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
};

export const shouldHideFieldKey = (key: string) => {
  const normalized = normalizeKeyForMatch(key);

  return (
    hiddenFieldKeys.has(normalized) ||
    hiddenFieldFragments.some((fragment) => normalized.includes(fragment))
  );
};

export const isRawTextKey = (key: string) => rawTextKeys.has(normalizeKeyForMatch(key));

export const hasStableContractShape = (value: unknown) =>
  isRecord(value) && (
    isRecord(value.fields) ||
    Array.isArray(value.tables) ||
    isRecord(value.review)
  );

export const humanizeFieldName = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\./g, " / ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase())
    .replace(/\bId\b/g, "ID")
    .replace(/\bUrl\b/g, "URL")
    .replace(/\bApi\b/g, "API")
    .replace(/\bPdf\b/g, "PDF")
    .replace(/\bSku\b/g, "SKU");

export const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

export const isLargeTextBlob = (value: string) => {
  const trimmed = value.trim();
  const lineBreaks = (trimmed.match(/\n/g) ?? []).length;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  return trimmed.length > 280 && (lineBreaks >= 3 || wordCount >= 45);
};

const clampValue = (value: string, maxLength = maxPreviewValueLength) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
};

export const sanitizePreviewValue = (value: unknown) => {
  const text = normalizeWhitespace(stringifyValue(value));

  if (!text || text === "null" || text === "undefined") {
    return "";
  }

  return clampValue(text);
};

export const sanitizeRawText = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length <= maxRawTextLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxRawTextLength).trimEnd()}\n\n[Raw text truncated for preview.]`;
};

export const sheetIdFromName = (value: string, index: number) => {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized ? `${normalized}-${index}` : `sheet-${index}`;
};
