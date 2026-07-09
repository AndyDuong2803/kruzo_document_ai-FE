import { ApiError, extractCustomOcr } from "@/features/ocr/api";
import { normalizeOcrResult } from "@/features/ocr/preview";

import { noResultPreviewMessage } from "./constants";
import { timeLabel } from "./historyLabels";
import type { ProcessedUpload, ToastTone } from "./types";

type ProcessUploadsOptions = {
  filesToProcess: ProcessedUpload[];
  schemaSample: string;
  updateHistoryItem: (id: string, patch: Partial<ProcessedUpload>) => void;
  pushToast: (message: string, tone?: ToastTone) => void;
  setPreviewMessage: (message: string) => void;
};

export const processSubmittedUploads = async ({
  filesToProcess,
  schemaSample,
  updateHistoryItem,
  pushToast,
  setPreviewMessage,
}: ProcessUploadsOptions) => {
  let structuredSuccessCount = 0;
  let unstructuredSuccessCount = 0;
  let failedCount = 0;

  for (const item of filesToProcess) {
    updateHistoryItem(item.id, { status: "processing", message: "Extracting document..." });

    try {
      const result = await extractCustomOcr(item.file, schemaSample);
      const preview = normalizeOcrResult(result);
      const hasStructuredData = preview.hasUsableData;
      const now = new Date();

      updateHistoryItem(item.id, {
        status: "done",
        message: hasStructuredData
          ? "Structured fields extracted."
          : "Kruzo could not find structured fields in this document.",
        preview,
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

      updateHistoryItem(item.id, {
        status: "failed",
        message: friendlyMessage,
        debugDetails,
        processedAt: now.toISOString(),
        processedAtLabel: timeLabel(now),
      });

      failedCount += 1;
    }
  }

  const completedCount = structuredSuccessCount + unstructuredSuccessCount;

  if (completedCount > 0 && failedCount > 0) {
    pushToast(`${completedCount} ${completedCount === 1 ? "file" : "files"} completed, ${failedCount} failed.`, "warning");
    setPreviewMessage("Some documents need attention. Review file messages in history.");
    return;
  }

  if (completedCount > 0) {
    pushToast(`${completedCount} ${completedCount === 1 ? "file" : "files"} completed.`, "success");
    setPreviewMessage("Finished processing. Open results from Processing history.");
    return;
  }

  pushToast(`${failedCount} ${failedCount === 1 ? "file" : "files"} failed.`, "error");
  setPreviewMessage(noResultPreviewMessage);
};
