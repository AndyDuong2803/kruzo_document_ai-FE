import { OCR_EXTRACT_PATH } from "./config";
import { postMultipart } from "./http";
import { OcrData, OcrExtractResponse } from "./types";

export const extractCustomOcr = async (
  file: File,
  schemaSample: string
): Promise<OcrExtractResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("schema_sample", schemaSample);

  return postMultipart<OcrData>(OCR_EXTRACT_PATH, formData);
};
