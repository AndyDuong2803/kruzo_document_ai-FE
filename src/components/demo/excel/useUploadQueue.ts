"use client";

import { useEffect, useMemo, useState } from "react";

import { hasConfiguredOcrApi } from "@/features/ocr/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { createBatch, saveCorrection } from "@/features/history/api";
import {
  buildCombinedWorkbookBlob,
  triggerDownload,
  type BatchExportDocument,
} from "@/features/ocr/export";

import { createUploadId, fileKey, getFileRelativePath, isSupportedFile } from "./fileCollection";
import { timeLabel } from "./sessionLabels";
import { processSubmittedUploads } from "./processUploads";
import { useDocumentPreset } from "./useDocumentPreset";
import { useToastMessages } from "./useToastMessages";
import type { CollectedFile, ProcessedUpload, SelectedUpload } from "./types";
import type { DocumentPresetId } from "@/config/document-presets";

export const useUploadQueue = (initialPresetId?: DocumentPresetId) => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedUpload[]>([]);
  const [sessionResults, setSessionResults] = useState<ProcessedUpload[]>([]);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const presetState = useDocumentPreset(initialPresetId);
  const { dismissToast, pushToast, toasts } = useToastMessages();
  const { token, user, credits, refreshCredits } = useAuth();

  const activeProcessingCount = useMemo(
    () => sessionResults.filter((item) => item.status === "queued" || item.status === "processing").length,
    [sessionResults]
  );
  const activeResultFile = activeResultId
    ? sessionResults.find((item) => item.id === activeResultId)
    : undefined;
  const submitLabel = selectedFiles.length === 1
    ? "Extract 1 file"
    : selectedFiles.length > 1
      ? `Extract ${selectedFiles.length} files`
      : "Extract";
  const processingLabel =
    activeProcessingCount > 0
      ? `${activeProcessingCount} ${activeProcessingCount === 1 ? "file is" : "files are"} processing.`
      : "";

  useEffect(() => {
    if (activeProcessingCount === 0) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [activeProcessingCount]);

  const updateSessionItem = (id: string, patch: Partial<ProcessedUpload>) => {
    setSessionResults((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addCollectedFiles = (items: CollectedFile[]) => {
    if (items.length === 0) {
      return;
    }

    const supportedItems = items.filter((item) => isSupportedFile(item.file));
    const validSizeItems = supportedItems.filter((item) => item.file.size > 0 && item.file.size <= 10 * 1024 * 1024);
    const unsupportedCount = items.length - supportedItems.length;
    const invalidSizeCount = supportedItems.length - validSizeItems.length;
    const existingKeys = new Set(selectedFiles.map((item) => fileKey({ file: item.file, relativePath: item.label })));
    const uploadsToAdd: SelectedUpload[] = [];

    validSizeItems.slice(0, Math.max(0, 20 - selectedFiles.length)).forEach((item) => {
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
    }

    if (unsupportedCount > 0) {
      pushToast("Unsupported file ignored. Please use PDF, JPG, PNG, or WEBP.", "warning");
    }
    if (invalidSizeCount > 0) {
      pushToast("Empty files and files larger than 10 MB were ignored.", "warning");
    }
    if (selectedFiles.length + validSizeItems.length > 20) {
      pushToast("Your current account accepts 20 files per run. Contact us if you need a higher limit.", "warning");
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
  };

  const closeResultModal = () => {
    setActiveResultId(null);
  };

  const notifyDownload = (message: string) => pushToast(message, "success");

  const completedExportDocuments = (batchId: string): BatchExportDocument[] =>
    sessionResults
      .filter((item) => item.batchId === batchId && item.status === "done" && item.rawResult)
      .map((item) => ({
        name: item.file.name,
        status: "completed",
        result: item.rawResult || null,
        exportDefinition: item.exportDefinition,
      }));

  const downloadRun = (batchId: string) => {
    const documents = completedExportDocuments(batchId);
    if (!documents.length) return;
    triggerDownload(
      buildCombinedWorkbookBlob(documents),
      `kruzo-document-ai-${batchId.slice(0, 8)}.xlsx`
    );
    notifyDownload("Your download is ready.");
  };

  const processFiles = async (filesToProcess: ProcessedUpload[]) => {
    if (!token) return;
    await processSubmittedUploads({
      filesToProcess,
      pushToast,
      schemaSample: JSON.stringify(filesToProcess[0]?.schemaSnapshot ?? presetState.selectedPreset.schemaSample),
      updateSessionItem,
      accessToken: token,
      presetId: filesToProcess[0].presetId as DocumentPresetId,
    });
    await refreshCredits().catch(() => undefined);
  };

  const submitSelectedFiles = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    if (!hasConfiguredOcrApi) {
      pushToast("OCR API endpoint is not configured.", "error");
      return;
    }
    if (!token || !user) {
      pushToast("Sign in before processing documents.", "warning");
      return;
    }
    if (!credits || credits.balance < selectedFiles.length) {
      pushToast("You do not have enough credits. Contact us on Telegram to add more.", "warning");
      return;
    }

    const submittedAt = new Date();
    const preset = presetState.selectedPreset;
    let batch;
    try {
      batch = await createBatch(token, {
        output_format: "xlsx",
        output_organization: "combined",
        documents: selectedFiles.map((item) => ({
          original_file_name: item.file.name,
          mime_type: item.file.type || "application/octet-stream",
          file_size: item.file.size,
          requested_field_configuration: preset.schemaSample,
          preset_id: preset.id,
          preset_version: preset.version,
          schema_snapshot: preset.schemaSample,
          export_definition_snapshot: preset.exportDefinition,
        })),
      });
    } catch (cause) {
      pushToast(cause instanceof Error ? cause.message : "Could not create the document batch.", "error");
      return;
    }
    const filesToProcess: ProcessedUpload[] = selectedFiles.map((item, index) => ({
      ...item,
      status: "queued",
      message: "Waiting to process...",
      submittedAt: submittedAt.toISOString(),
      submittedAtLabel: timeLabel(submittedAt),
      batchId: batch.id,
      extractionDocumentId: batch.documents[index]?.id,
      presetId: preset.id,
      presetVersion: preset.version,
      schemaSnapshot: preset.schemaSample,
      exportDefinition: preset.exportDefinition,
    }));

    setSelectedFiles([]);
    setSessionResults((current) => [...filesToProcess, ...current]);
    pushToast(`Started extraction for ${filesToProcess.length} ${filesToProcess.length === 1 ? "file" : "files"}.`, "info");

    void processFiles(filesToProcess);
  };

  const retryFailed = (id: string) => {
    const item = sessionResults.find((result) => result.id === id && result.status === "failed");
    if (!item || !token) return;
    updateSessionItem(item.id, { status: "queued", message: "Waiting to retry…" });
    void processFiles([{ ...item, status: "queued" }]);
  };

  const saveCorrectedResult = async (id: string, result: Record<string, unknown>) => {
    const item = sessionResults.find((candidate) => candidate.id === id);
    if (!item?.extractionDocumentId || !token) return;
    await saveCorrection(token, item.extractionDocumentId, result);
    updateSessionItem(id, { rawResult: result });
    pushToast("Corrected result saved.", "success");
  };

  return {
    selectedFiles,
    sessionResults,
    processingLabel,
    submitLabel,
    activeProcessingCount,
    activeResultFile,
    toasts,
    ...presetState,
    token,
    user,
    credits,
    addCollectedFiles,
    showFolderUnsupportedToast,
    removeFile,
    clearFiles,
    submitSelectedFiles,
    selectActiveResult: setActiveResultId,
    closeResultModal,
    downloadRun,
    retryFailed,
    saveCorrectedResult,
    dismissToast,
  };
};
