import { ChangeEvent, useMemo, useState } from "react";

import { API_KEY_OCR_EXTRACT_PATH, ApiError, displayOcrEndpoint, extractWithApiKey, hasConfiguredOcrApi } from "@/features/ocr/api";
import { defaultSchemaSample, defaultSchemaTemplate, schemaTemplates } from "./constants";
import { createFailurePayload, stringifyJson } from "./failurePayload";
import { formatJson, validateJson } from "./formatJson";
import { buildCurlCommand, buildFetchExample, buildPythonExample } from "./snippets";
import type { CodeExampleTab, SchemaTemplateId, SendState } from "./types";
import { useClipboardCopy } from "./useClipboardCopy";

const stringSampleValues = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stringSampleValues);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, child]) => [
        key,
        stringSampleValues(child),
      ])
    );
  }
  if (value == null) return "";
  return String(value);
};

export const useApiPlayground = () => {
  const [apiKey, setApiKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [schemaTemplateId, setSchemaTemplateId] = useState<SchemaTemplateId>(defaultSchemaTemplate.id);
  const [schemaSample, setSchemaSample] = useState(defaultSchemaSample);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [message, setMessage] = useState("");
  const [responsePreview, setResponsePreview] = useState<unknown | null>(null);
  const [activeExampleTab, setActiveExampleTab] = useState<CodeExampleTab>("curl");
  const { copiedLabel, copyText } = useClipboardCopy(() => setMessage("Copy failed. Select the text manually."));

  const endpointPath = API_KEY_OCR_EXTRACT_PATH;
  const endpoint = displayOcrEndpoint(endpointPath);
  const schemaValidation = useMemo(() => validateJson(schemaSample), [schemaSample]);
  const sampleResponse = useMemo(() => {
    let data: unknown = {};
    if (schemaValidation.valid) {
      data = stringSampleValues(JSON.parse(schemaSample));
    }
    return {
      success: true,
      error_code: null,
      message: file ? `Sample response for ${file.name}.` : "Sample response.",
      data,
    };
  }, [file, schemaSample, schemaValidation.valid]);
  const loadingResponse = useMemo(() => ({
    status: "waiting_for_response",
    endpoint: endpointPath,
    filename: file?.name ?? null,
  }), [endpointPath, file?.name]);

  const responseContent = useMemo(() => {
    if (sendState === "loading") return stringifyJson(loadingResponse);
    return stringifyJson(responsePreview ?? sampleResponse);
  }, [loadingResponse, responsePreview, sampleResponse, sendState]);

  const snippetOptions = useMemo(() => ({
    apiKey,
    compactSchemaSample: (schemaSample.trim() || defaultSchemaSample).replace(/\s+/g, " "),
    endpoint,
    filePart: file?.name || "document.pdf",
    schemaSampleForExamples: schemaSample.trim() || defaultSchemaSample,
  }), [apiKey, endpoint, file?.name, schemaSample]);

  const exampleContent = {
    curl: buildCurlCommand(snippetOptions),
    javascript: buildFetchExample(snippetOptions),
    python: buildPythonExample(snippetOptions),
  }[activeExampleTab];

  const sendDisabledReason = !hasConfiguredOcrApi
    ? "OCR API endpoint is not configured."
    : !apiKey.trim()
      ? "Enter an API key."
    : !file
      ? "Choose a file before testing."
      : !schemaValidation.valid
        ? schemaValidation.message
        : "";
  const canSend = sendState !== "loading" && !sendDisabledReason;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setSendState("idle");
    setResponsePreview(null);
    setMessage("");
  };

  const handleSchemaSampleChange = (value: string) => {
    setSchemaSample(value);
    setSendState("idle");
    setResponsePreview(null);
    setMessage("");
  };

  const selectSchemaTemplate = (id: SchemaTemplateId) => {
    const template = schemaTemplates.find((item) => item.id === id) ?? defaultSchemaTemplate;
    setSchemaTemplateId(template.id);
    setSchemaSample(template.value);
    setSendState("idle");
    setResponsePreview(null);
    setMessage("");
  };

  const restoreSchema = () => {
    const template = schemaTemplates.find((item) => item.id === schemaTemplateId) ?? defaultSchemaTemplate;
    setSchemaSample(template.value);
    setSendState("idle");
    setResponsePreview(null);
    setMessage("");
  };

  const formatSchema = () => {
    const validation = validateJson(schemaSample);
    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }
    setSchemaSample(formatJson(schemaSample));
    setSendState("idle");
    setResponsePreview(null);
    setMessage("");
  };

  const sendRequest = async () => {
    if (sendState === "loading") return;
    if (sendDisabledReason) {
      setSendState("error");
      setResponsePreview(createFailurePayload(new Error(sendDisabledReason)));
      setMessage(sendDisabledReason);
      return;
    }

    setResponsePreview(null);
    setSendState("loading");
    setMessage("Sending request to the OCR API...");

    try {
      const result = await extractWithApiKey(file as File, schemaSample, apiKey);
      setResponsePreview(result);
      setSendState("success");
      setMessage("Real API response loaded.");
    } catch (error) {
      setResponsePreview(createFailurePayload(error));
      setSendState("error");
      setMessage(error instanceof ApiError ? error.friendlyMessage : "Something went wrong while processing the document.");
    }
  };

  return {
    activeExampleTab,
    apiKey,
    canSend,
    copiedLabel,
    endpoint,
    exampleContent,
    file,
    message,
    responseContent,
    schemaSample,
    schemaTemplateId,
    schemaTemplates,
    schemaValidation,
    sendDisabledReason,
    sendState,
    copyExample: () => copyText(exampleContent, `example-${activeExampleTab}`),
    copyResponse: () => copyText(responseContent, "response"),
    formatSchema,
    handleFileChange,
    restoreSchema,
    selectSchemaTemplate,
    sendRequest,
    setActiveExampleTab,
    setApiKey,
    setSchemaSample: handleSchemaSampleChange,
  };
};
