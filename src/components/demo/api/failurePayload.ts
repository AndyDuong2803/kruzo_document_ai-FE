import { ApiError } from "@/features/ocr/api";

export const stringifyJson = (value: unknown) => JSON.stringify(value, null, 2);

export const createFailurePayload = (error: unknown) => {
  if (error instanceof ApiError) {
    return {
      success: false,
      status: error.status ?? null,
      error_code: error.errorCode ?? null,
      message: error.friendlyMessage,
      details: error.details ?? null,
    };
  }

  return {
    success: false,
    message: "Something went wrong while processing the document.",
    details: error instanceof Error ? { message: error.message } : error,
  };
};
