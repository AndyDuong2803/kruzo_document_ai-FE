import {
  getDocumentPreset,
  type DocumentPresetId,
  type PresetField,
} from "@/config/document-presets";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const twoDigits = (value: number) => String(value).padStart(2, "0");

export const formatDateValue = (value: string): string => {
  const input = value.trim();
  if (!input) return "";

  const numeric = input.match(/^(\d{1,4})[./-](\d{1,2})[./-](\d{1,4})$/);
  if (numeric) {
    const [, first, second, third] = numeric;
    const yearFirst = first.length === 4;
    const year = Number(yearFirst ? first : third);
    const month = Number(second);
    const day = Number(yearFirst ? third : first);
    if (
      year >= 1000 &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return `${year}/${twoDigits(month)}/${twoDigits(day)}`;
    }
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  return `${parsed.getFullYear()}/${twoDigits(parsed.getMonth() + 1)}/${twoDigits(parsed.getDate())}`;
};

const scalarToString = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value).trim();
};

const normalizeObject = (
  value: Record<string, unknown>,
  fields: PresetField[]
): Record<string, unknown> => {
  const fieldByKey = new Map(fields.map((field) => [field.key, field]));
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => {
      if (Array.isArray(child)) {
        return [key, child.map((item) => (
          isRecord(item)
            ? Object.fromEntries(Object.entries(item).map(([itemKey, itemValue]) => [
                itemKey,
                scalarToString(itemValue),
              ]))
            : scalarToString(item)
        ))];
      }
      if (isRecord(child)) return [key, normalizeObject(child, fields)];
      const stringValue = scalarToString(child);
      return [key, fieldByKey.get(key)?.type === "date" ? formatDateValue(stringValue) : stringValue];
    })
  );
};

export const normalizePresetResult = (
  presetId: DocumentPresetId,
  result: Record<string, unknown>
): Record<string, unknown> => {
  const preset = getDocumentPreset(presetId);
  const normalized = normalizeObject(result, preset.fields);

  preset.tables.forEach((table) => {
    const rows = normalized[table.key];
    if (!Array.isArray(rows)) return;
    normalized[table.key] = rows.map((row) =>
      isRecord(row) ? normalizeObject(row, table.columns) : scalarToString(row)
    );
  });

  return normalized;
};
