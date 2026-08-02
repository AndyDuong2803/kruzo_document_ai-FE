import { buildOcrApiUrl } from "@/features/ocr/api/config";
import type { ApiEnvelope } from "@/features/ocr/api/types";
import type { ExportDefinition } from "@/config/document-presets";

export type HistoryDocument = {
  id: string;
  batch_id: string;
  original_file_name: string;
  mime_type: string;
  file_size: number;
  status: string;
  requested_field_configuration: Record<string, unknown>;
  preset_id: string | null;
  preset_version: number | null;
  schema_snapshot: Record<string, unknown>;
  export_definition_snapshot: ExportDefinition | null;
  extracted_result: Record<string, unknown> | null;
  user_corrected_result: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type HistoryBatch = {
  id: string;
  request_source: string;
  output_format: "xlsx" | "csv";
  output_organization: "combined" | "separate";
  preset_id: string | null;
  preset_version: number | null;
  status: string;
  document_count: number;
  completed_count: number;
  failed_count: number;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
};

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};
export type HistoryBatchDetail = HistoryBatch & { documents: HistoryDocument[] };
export type HistoryPage = Page<HistoryBatch>;
export type HistoryDocumentPage = Page<HistoryDocument>;

const request = async <T>(path: string, token: string, init?: RequestInit) => {
  const url = buildOcrApiUrl(path);
  if (!url) throw new Error("API endpoint is not configured.");
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init?.body) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers });
  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !payload.success || payload.data == null) {
    throw new Error(payload.message || "Request failed.");
  }
  return payload.data;
};

export const createBatch = (
  token: string,
  payload: {
    output_format: "xlsx" | "csv";
    output_organization: "combined" | "separate";
    documents: {
      original_file_name: string;
      mime_type: string;
      file_size: number;
      requested_field_configuration: Record<string, unknown>;
      preset_id: string;
      preset_version: number;
      schema_snapshot: Record<string, unknown>;
      export_definition_snapshot: ExportDefinition;
    }[];
  }
) =>
  request<HistoryBatchDetail>("/api/v1/extraction-batches", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listBatches = (token: string, page: number, pageSize = 10, status?: string) =>
  request<HistoryPage>(
    `/api/v1/extraction-batches?page=${page}&page_size=${pageSize}${status ? `&status=${encodeURIComponent(status)}` : ""}`,
    token
  );

export const getBatch = (token: string, batchId: string) =>
  request<HistoryBatch>(`/api/v1/extraction-batches/${batchId}`, token);

export const listBatchDocuments = (
  token: string,
  batchId: string,
  page: number,
  pageSize = 10,
  status?: string
) =>
  request<HistoryDocumentPage>(
    `/api/v1/extraction-batches/${batchId}/documents?page=${page}&page_size=${pageSize}${status ? `&status=${encodeURIComponent(status)}` : ""}`,
    token
  );

export const saveCorrection = (
  token: string,
  documentId: string,
  result: Record<string, unknown>
) =>
  request<HistoryDocument>(`/api/v1/extraction-documents/${documentId}/result`, token, {
    method: "PATCH",
    body: JSON.stringify({ result }),
  });
