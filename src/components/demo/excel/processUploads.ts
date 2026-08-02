import { ApiError, extractCustomOcr } from "@/features/ocr/api";
import { normalizeOcrResult } from "@/features/ocr/preview";
import { normalizePresetResult } from "@/features/ocr/normalizePresetResult";
import type { DocumentPresetId } from "@/config/document-presets";

import { timeLabel } from "./sessionLabels";
import type { ProcessedUpload, ToastTone } from "./types";

type ProcessUploadsOptions = {
  filesToProcess: ProcessedUpload[];
  schemaSample: string;
  updateSessionItem: (id: string, patch: Partial<ProcessedUpload>) => void;
  pushToast: (message: string, tone?: ToastTone) => void;
  accessToken: string;
  presetId: DocumentPresetId;
};

export const runWithConcurrency = async <T>(
  items: T[],
  limit: number,
  work: (item: T) => Promise<void>
) => {
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex++];
      await work(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(Math.max(1, limit), items.length) }, () => worker()));
};

export const processSubmittedUploads = async ({
  filesToProcess,
  schemaSample,
  updateSessionItem,
  pushToast,
  accessToken,
  presetId,
}: ProcessUploadsOptions) => {
  let structuredSuccessCount = 0;
  let unstructuredSuccessCount = 0;
  let failedCount = 0;

  await runWithConcurrency(filesToProcess, 2, async (item) => {
    updateSessionItem(item.id, { status: "processing", message: "Extracting document..." });

    try {
      const result = await extractCustomOcr(
        item.file,
        schemaSample,
        "",
        accessToken,
        item.batchId,
        item.extractionDocumentId
      );
      const normalizedData = normalizePresetResult(
        presetId,
        (result.data || {}) as Record<string, unknown>
      );
      const normalizedResult = { ...result, data: normalizedData };
      const preview = normalizeOcrResult(normalizedResult);
      const hasStructuredData = preview.hasUsableData;
      const now = new Date();

      updateSessionItem(item.id, {
        status: "done",
        message: hasStructuredData
          ? "Structured fields extracted."
          : "Kruzo could not find structured fields in this document.",
        preview,
        rawResult: normalizedData,
        debugDetails: "",
        processedAt: now.toISOString(),
        processedAtLabel: timeLabel(now),
      });

      if (hasStructuredData) {
        structuredSuccessCount += 1;
      } else {
        unstructuredSuccessCount += 1;
      }
    } catch (error) {
      const friendlyMessage =
        error instanceof ApiError ? error.friendlyMessage : "Something went wrong while processing the document.";
      const debugDetails =
        error instanceof ApiError && error.details ? JSON.stringify(error.details, null, 2) : "";
      const now = new Date();

      updateSessionItem(item.id, {
        status: "failed",
        message: friendlyMessage,
        debugDetails,
        processedAt: now.toISOString(),
        processedAtLabel: timeLabel(now),
      });

      failedCount += 1;
    }
  });
  const completedCount = structuredSuccessCount + unstructuredSuccessCount;

  if (completedCount > 0 && failedCount > 0) {
    pushToast(`${completedCount} ${completedCount === 1 ? "file" : "files"} completed, ${failedCount} failed.`, "warning");
    return;
  }

  if (completedCount > 0) {
    pushToast(`${completedCount} ${completedCount === 1 ? "file" : "files"} completed.`, "success");
    return;
  }

  pushToast(`${failedCount} ${failedCount === 1 ? "file" : "files"} failed.`, "error");
};
