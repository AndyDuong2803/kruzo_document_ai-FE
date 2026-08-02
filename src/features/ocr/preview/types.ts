export type ReviewState = "Approved" | "Needs review" | "Unknown";

export type PreviewRow = {
  field: string;
  value: string;
  review: ReviewState;
};

export type DetectedTable = {
  name: string;
  columns: string[];
  rows: string[][];
};

export type WorkbookSheet = {
  id: string;
  name: string;
  columns: string[];
  rows: string[][];
};

export type OcrPreview = {
  rows: PreviewRow[];
  tables: DetectedTable[];
  sheets: WorkbookSheet[];
  rawJson: string;
  rawText: string;
  debug?: unknown;
  hasUsableData: boolean;
  isSample?: boolean;
  usedFallback: boolean;
  message?: string;
};
