import { API_KEY_OCR_EXTRACT_PATH, OCR_EXTRACT_PATH } from "./config";
import { postMultipart } from "./http";
import { OcrData, OcrExtractResponse } from "./types";

export const extractCustomOcr = async (
  file: File,
  schemaSample: string,
  apiKey = "",
  accessToken = "",
  batchId?: string,
  extractionDocumentId?: string
): Promise<OcrExtractResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("schema_sample", schemaSample);
  if (batchId) formData.append("batch_id", batchId);
  if (extractionDocumentId) formData.append("extraction_document_id", extractionDocumentId);

  return postMultipart<OcrData>(OCR_EXTRACT_PATH, formData, apiKey, accessToken);
};

export const extractWithApiKey = async (
  file: File,
  schemaSample: string,
  apiKey: string
): Promise<OcrExtractResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("schema_sample", schemaSample);
  return postMultipart<OcrData>(API_KEY_OCR_EXTRACT_PATH, formData, apiKey);
};
