"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
  buildTemplateSchemaSample,
  createTemplateField,
  defaultCustomFields,
  defaultCustomTableColumns,
  defaultTemplateId,
  hasTemplateTargets,
  slugFromLabel,
  type TemplateField,
  type TemplateId,
} from "./templates";

export const useExtractionTemplate = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(defaultTemplateId);
  const [customFields, setCustomFields] = useState<TemplateField[]>(defaultCustomFields);
  const [customTableEnabled, setCustomTableEnabled] = useState(false);
  const [customTableName, setCustomTableName] = useState("Items");
  const [customTableColumns, setCustomTableColumns] = useState<TemplateField[]>(defaultCustomTableColumns);

  const templateReady = hasTemplateTargets(selectedTemplateId, customFields, customTableEnabled, customTableColumns);
  const schemaSample = useMemo(
    () => buildTemplateSchemaSample(
      selectedTemplateId,
      customFields,
      customTableEnabled,
      customTableName,
      customTableColumns
    ),
    [customFields, customTableColumns, customTableEnabled, customTableName, selectedTemplateId]
  );

  const updateFieldList = (
    updater: Dispatch<SetStateAction<TemplateField[]>>,
    id: string,
    patch: Partial<TemplateField>
  ) => {
    updater((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextLabel = patch.label ?? item.label;
        const nextKey = patch.key ?? (patch.label !== undefined ? slugFromLabel(nextLabel) : item.key);

        return { ...item, ...patch, key: nextKey };
      })
    );
  };

  const addCustomField = () => {
    setCustomFields((current) => [...current, createTemplateField("New field", current.map((item) => item.key))]);
  };

  const updateCustomField = (id: string, patch: Partial<TemplateField>) => {
    updateFieldList(setCustomFields, id, patch);
  };

  const removeCustomField = (id: string) => {
    setCustomFields((current) => current.filter((item) => item.id !== id));
  };

  const addCustomTableColumn = () => {
    setCustomTableColumns((current) => [...current, createTemplateField("New column", current.map((item) => item.key))]);
  };

  const updateCustomTableColumn = (id: string, patch: Partial<TemplateField>) => {
    updateFieldList(setCustomTableColumns, id, patch);
  };

  const removeCustomTableColumn = (id: string) => {
    setCustomTableColumns((current) => current.filter((item) => item.id !== id));
  };

  return {
    addCustomField,
    addCustomTableColumn,
    customFields,
    customTableColumns,
    customTableEnabled,
    customTableName,
    removeCustomField,
    removeCustomTableColumn,
    schemaSample,
    selectedTemplateId,
    setCustomTableEnabled,
    setCustomTableName,
    setSelectedTemplateId,
    templateReady,
    updateCustomField,
    updateCustomTableColumn,
  };
};
