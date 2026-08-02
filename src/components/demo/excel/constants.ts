import type { FileStatus } from "./types";

export const supportedTypesLabel = "PDF, JPG, PNG, WEBP";
export const maxFileListHeightClass = "max-h-[220px]";
export const fileInputAccept = ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

export const supportedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
export const supportedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

export const statusLabels: Record<FileStatus, string> = {
  ready: "Selected",
  processing: "Processing",
  done: "Completed",
  failed: "Failed",
};
