import { isLargeTextBlob, isRawTextKey, isRecord, sanitizeRawText } from "./utils";

const collectRawText = (
  payload: unknown,
  parentKey: string,
  collected: string[],
  explicitOnly: boolean
) => {
  if (typeof payload === "string") {
    if (isRawTextKey(parentKey) || (!explicitOnly && isLargeTextBlob(payload))) {
      collected.push(payload);
    }

    return collected;
  }

  if (Array.isArray(payload)) {
    payload.forEach((entry) => collectRawText(entry, parentKey, collected, explicitOnly));
    return collected;
  }

  if (isRecord(payload)) {
    Object.entries(payload).forEach(([key, value]) => {
      collectRawText(value, key, collected, explicitOnly);
    });
  }

  return collected;
};

export const extractRawText = (payload: unknown) =>
  sanitizeRawText(collectRawText(payload, "", [], false).join("\n\n"));

export const extractExplicitRawText = (payload: unknown) =>
  sanitizeRawText(collectRawText(payload, "", [], true).join("\n\n"));
