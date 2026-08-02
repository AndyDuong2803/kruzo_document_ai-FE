import type { OcrPreview, WorkbookSheet } from "@/features/ocr/preview";
import type { ExportDefinition } from "@/config/document-presets";

export type FileStatus = "ready" | "processing" | "done" | "failed";
export type SessionStatus = "queued" | "processing" | "done" | "failed" | "cancelled";

export type SelectedUpload = {
  id: string;
  file: File;
  label: string;
  status: FileStatus;
  message?: string;
  debugDetails?: string;
  preview?: OcrPreview;
  rawResult?: Record<string, unknown>;
};

export type ProcessedUpload = Omit<SelectedUpload, "status"> & {
  status: SessionStatus;
  submittedAt: string;
  submittedAtLabel: string;
  processedAt?: string;
  processedAtLabel?: string;
  batchId?: string;
  extractionDocumentId?: string;
  presetId: string;
  presetVersion: number;
  schemaSnapshot: Record<string, unknown>;
  exportDefinition: ExportDefinition;
};

export type CollectedFile = {
  file: File;
  relativePath?: string;
};

export type DataTransferItemWithEntry = DataTransferItem & {
  webkitGetAsEntry?: () => { isDirectory?: boolean; isFile?: boolean } | null;
};

export type DroppedFilesResult = {
  files: CollectedFile[];
  folderDropped: boolean;
};

export type ToastTone = "info" | "success" | "warning" | "error";

export type ToastMessage = {
  id: string;
  message: string;
  tone: ToastTone;
};

export type DemoOption = {
  value: string;
  label: string;
};

export type { WorkbookSheet };
