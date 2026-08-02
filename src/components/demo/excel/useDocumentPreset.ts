"use client";

import { useMemo, useState } from "react";

import {
  defaultDocumentPresetId,
  getDocumentPreset,
  serializePresetSchema,
  type DocumentPresetId,
} from "@/config/document-presets";

export const useDocumentPreset = (initialPresetId: DocumentPresetId = defaultDocumentPresetId) => {
  const [selectedPresetId, setSelectedPresetId] = useState<DocumentPresetId>(initialPresetId);
  const selectedPreset = useMemo(() => getDocumentPreset(selectedPresetId), [selectedPresetId]);

  return {
    selectedPreset,
    selectedPresetId,
    setSelectedPresetId,
    schemaSample: serializePresetSchema(selectedPreset),
  };
};
