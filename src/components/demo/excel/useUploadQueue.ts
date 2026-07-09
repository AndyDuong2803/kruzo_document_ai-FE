"use client";

import { useMemo, useState } from "react";

import { hasConfiguredOcrApi } from "@/features/ocr/api";
import type { WorkbookSheet } from "@/features/ocr/preview";

import {
  defaultPreviewMessage,
  reviewPreviewMessage,
} from "./constants";
import { createUploadId, fileKey, getFileRelativePath, isSupportedFile } from "./fileCollection";
import { downloadSheetCsv, downloadWorkbook } from "./downloadResults";
import { pluralFile, timeLabel } from "./historyLabels";
import { processSubmittedUploads } from "./processUploads";
import { useExtractionTemplate } from "./useExtractionTemplate";
import { useToastMessages } from "./useToastMessages";
import type { CollectedFile, ProcessedUpload, SelectedUpload } from "./types";

export const useUploadQueue = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedUpload[]>([]);
  const [processingHistory, setProcessingHistory] = useState<ProcessedUpload[]>([]);
  const [previewMessage, setPreviewMessage] = useState(defaultPreviewMessage);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const template = useExtractionTemplate();
  const { dismissToast, pushToast, toasts } = useToastMessages();

  const completedFiles = useMemo(
    () => processingHistory.filter((item) => item.status === "done" && item.preview),
    [processingHistory]
  );
  const activeProcessingCount = useMemo(
    () => processingHistory.filter((item) => item.status === "queued" || item.status === "processing").length,
    [processingHistory]
  );
  const failedFileCount = useMemo(
    () => processingHistory.filter((item) => item.status === "failed").length,
    [processingHistory]
  );
  const activeResultFile = activeResultId
    ? processingHistory.find((item) => item.id === activeResultId)
    : undefined;
  const isResultModalOpen = Boolean(activeResultFile);
  const submitLabel = selectedFiles.length === 1
    ? "Submit 1 file"
    : selectedFiles.length > 1
      ? `Submit ${selectedFiles.length} files`
      : "Submit";
  const processingLabel =
    activeProcessingCount > 0
      ? `${activeProcessingCount} ${activeProcessingCount === 1 ? "file is" : "files are"} processing in history.`
      : "";

  const updateHistoryItem = (id: string, patch: Partial<ProcessedUpload>) => {
    setProcessingHistory((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addCollectedFiles = (items: CollectedFile[]) => {
    if (items.length === 0) {
      return;
    }

    const supportedItems = items.filter((item) => isSupportedFile(item.file));
    const unsupportedCount = items.length - supportedItems.length;
    const existingKeys = new Set(selectedFiles.map((item) => fileKey({ file: item.file, relativePath: item.label })));
    const uploadsToAdd: SelectedUpload[] = [];

    supportedItems.forEach((item) => {
      const key = fileKey(item);

      if (existingKeys.has(key)) {
        return;
      }

      existingKeys.add(key);
      uploadsToAdd.push({
        id: createUploadId(),
        file: item.file,
        label: item.relativePath || getFileRelativePath(item.file),
        status: "ready",
      });
    });

    if (uploadsToAdd.length > 0) {
      setSelectedFiles((current) => [...current, ...uploadsToAdd]);
      setPreviewMessage(reviewPreviewMessage);
    }

    if (unsupportedCount > 0) {
      pushToast("Unsupported file ignored. Please use PDF, JPG, PNG, or WEBP.", "warning");
    }
  };

  const showFolderUnsupportedToast = () => {
    pushToast("Folder upload is not supported yet. Please choose files instead.", "warning");
  };

  const removeFile = (id: string) => {
    setSelectedFiles((current) => current.filter((item) => item.id !== id));
  };

  const clearFiles = () => {
    setSelectedFiles([]);

    if (processingHistory.length === 0) {
      setHasSubmitted(false);
      setPreviewMessage(defaultPreviewMessage);
    }
  };

  const closeResultModal = () => {
    setActiveResultId(null);
  };

  const notifyDownload = (message: string) => pushToast(message, "success");

  const downloadHistoryCsv = (id: string) => {
    const historyItem = processingHistory.find((item) => item.id === id);

    if (!historyItem || historyItem.status !== "done" || !historyItem.preview?.hasUsableData) {
      return;
    }

    downloadSheetCsv(historyItem.preview.sheets.find((sheet) => sheet.rows.length > 0), historyItem.file.name, notifyDownload);
  };

  const downloadHistoryWorkbook = (id: string) => {
    const historyItem = processingHistory.find((item) => item.id === id);

    if (!historyItem || historyItem.status !== "done" || !historyItem.preview?.hasUsableData) {
      return;
    }

    downloadWorkbook(historyItem.preview.sheets, historyItem.file.name, notifyDownload);
  };

  const downloadActiveCsv = (sheet?: WorkbookSheet) => {
    if (!activeResultFile || activeResultFile.status !== "done" || !activeResultFile.preview?.hasUsableData) {
      return;
    }

    downloadSheetCsv(sheet ?? activeResultFile.preview.sheets[0], activeResultFile.file.name, notifyDownload);
  };

  const downloadActiveWorkbook = () => {
    if (!activeResultFile || activeResultFile.status !== "done" || !activeResultFile.preview?.hasUsableData) {
      return;
    }

    downloadWorkbook(activeResultFile.preview.sheets, activeResultFile.file.name, notifyDownload);
  };

  const submitSelectedFiles = () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setHasSubmitted(true);

    if (!hasConfiguredOcrApi) {
      pushToast("OCR API endpoint is not configured.", "error");
      setPreviewMessage("OCR API endpoint is not configured. No extraction preview is available.");
      return;
    }

    if (!template.templateReady) {
      pushToast("Add at least one custom field or table column before submitting.", "warning");
      setPreviewMessage("Choose a template or add custom fields before submitting.");
      return;
    }

    const submittedAt = new Date();
    const filesToProcess: ProcessedUpload[] = selectedFiles.map((item) => ({
      ...item,
      status: "queued",
      message: "Waiting to process...",
      submittedAt: submittedAt.toISOString(),
      submittedAtLabel: timeLabel(submittedAt),
    }));

    setSelectedFiles([]);
    setProcessingHistory((current) => [...filesToProcess, ...current]);
    setPreviewMessage(`${pluralFile(filesToProcess.length)} submitted. Track progress in Processing history.`);
    pushToast(`Submitted ${filesToProcess.length} ${filesToProcess.length === 1 ? "file" : "files"} for extraction.`, "info");

    void processSubmittedUploads({
      filesToProcess,
      pushToast,
      schemaSample: template.schemaSample,
      setPreviewMessage,
      updateHistoryItem,
    });
  };

  return {
    selectedFiles,
    processingHistory,
    previewMessage,
    processingLabel,
    submitLabel,
    hasSubmitted,
    completedFiles,
    failedFileCount,
    activeProcessingCount,
    activeResultFile,
    isResultModalOpen,
    toasts,
    ...template,
    addCollectedFiles,
    showFolderUnsupportedToast,
    removeFile,
    clearFiles,
    submitSelectedFiles,
    selectActiveResult: setActiveResultId,
    closeResultModal,
    downloadActiveCsv,
    downloadActiveWorkbook,
    downloadHistoryCsv,
    downloadHistoryWorkbook,
    dismissToast,
  };
};
