export const OCR_API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

export const OCR_EXTRACT_PATH = "/api/v1/ocr/extract-custom";
export const API_KEY_OCR_EXTRACT_PATH = "/api/v1/ocr/extract";

export const hasConfiguredOcrApi = OCR_API_BASE_URL.length > 0;

export const buildOcrApiUrl = (path = OCR_EXTRACT_PATH, baseUrl = OCR_API_BASE_URL) => {
  if (!baseUrl) {
    return "";
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildPublicOcrApiUrl = (path = OCR_EXTRACT_PATH) =>
  buildOcrApiUrl(path, OCR_API_BASE_URL);

export const displayOcrEndpoint = (path = OCR_EXTRACT_PATH) =>
  buildOcrApiUrl(path) || buildPublicOcrApiUrl(path);
