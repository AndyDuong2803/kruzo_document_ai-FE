import { ChangeEvent, useMemo, useState } from "react";

import {
  displayOcrEndpoint,
  hasConfiguredOcrApi,
  OCR_EXTRACT_PATH,
  ApiError,
  extractCustomOcr,
} from "@/features/ocr/api";
import { sampleOcrResponse } from "@/features/ocr/preview";
import { defaultSchemaSample } from "./constants";
import { createFailurePayload, stringifyJson } from "./failurePayload";
import { formatJson, validateJson } from "./formatJson";
import {
  buildCurlCommand,
  buildFetchExample,
  buildPythonExample,
  buildRequestSummary,
} from "./snippets";
import { useApiHistory } from "./useApiHistory";
import { useClipboardCopy } from "./useClipboardCopy";
import type { ApiHistoryItem, ExtractMode, PlaygroundTab, SendState } from "./types";

export const useApiPlayground = () => {
  const [file, setFile] = useState<File | null>(null);
  const [schemaSample, setSchemaSample] = useState(defaultSchemaSample);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [message, setMessage] = useState("Sample response is shown until you send a real request.");
  const [responsePreview, setResponsePreview] = useState<unknown | null>(null);
  const [debugDetails, setDebugDetails] = useState("");
  const [activeTab, setActiveTab] = useState<PlaygroundTab>("request");
  const apiHistory = useApiHistory();
  const { copiedLabel, copyText } = useClipboardCopy(() => {
    setMessage("Copy failed in this browser. You can still select the text manually.");
  });
  const mode: ExtractMode = "custom";

  const endpointPath = OCR_EXTRACT_PATH;
  const endpoint = displayOcrEndpoint(endpointPath);
  const filePart = file?.name || "repair-order.pdf";
  const schemaValidation = useMemo(() => validateJson(schemaSample), [schemaSample]);
  const schemaIsValidForMode = schemaValidation.valid;
  const schemaSampleForExamples = schemaSample.trim() || defaultSchemaSample;
  const compactSchemaSample = schemaSampleForExamples.replace(/\s+/g, " ");

  const sampleResponse = useMemo(
    () => ({
      ...sampleOcrResponse,
      message: "Data extracted successfully.",
    }),
    []
  );

  const loadingResponse = useMemo(
    () => ({
      status: "waiting_for_response",
      endpoint: endpointPath,
      filename: file?.name ?? null,
      mode,
    }),
    [endpointPath, file?.name, mode]
  );

  const responseContent = useMemo(() => {
    if (sendState === "loading") {
      return stringifyJson(loadingResponse);
    }

    if (responsePreview) {
      return stringifyJson(responsePreview);
    }

    return stringifyJson(sampleResponse);
  }, [loadingResponse, responsePreview, sampleResponse, sendState]);

  const snippetOptions = useMemo(
    () => ({ compactSchemaSample, endpoint, filePart, schemaSampleForExamples }),
    [compactSchemaSample, endpoint, filePart, schemaSampleForExamples]
  );
  const requestSummary = useMemo(() => buildRequestSummary(snippetOptions), [snippetOptions]);
  const curlCommand = useMemo(() => buildCurlCommand(snippetOptions), [snippetOptions]);
  const fetchExample = useMemo(() => buildFetchExample(snippetOptions), [snippetOptions]);
  const pythonExample = useMemo(() => buildPythonExample(snippetOptions), [snippetOptions]);

  const activeContent = {
    request: requestSummary,
    curl: curlCommand,
    javascript: fetchExample,
    python: pythonExample,
    response: responseContent,
  }[activeTab];

  const sendDisabledReason = !hasConfiguredOcrApi
    ? "OCR API endpoint is not configured."
    : !file
      ? "Choose a file before sending."
      : !schemaIsValidForMode
        ? schemaValidation.message
        : "";

  const canSend = sendState !== "loading" && !sendDisabledReason;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setMessage(
      selectedFile
        ? `${selectedFile.name} selected.`
        : "Sample response is shown until you send a real request."
    );
  };

  const handleModeChange = (nextMode: ExtractMode) => {
    setSendState("idle");
    setResponsePreview(null);
    setDebugDetails("");
    setMessage(`${nextMode === "custom" ? "Template" : "Selected"} mode sends the file plus schema_sample.`);
  };

  const copyActiveTab = () => copyText(activeContent, activeTab);

  const copyHistoryResponse = (item: ApiHistoryItem) =>
    copyText(item.responseJson, `history-${item.id}`);

  const formatSchema = () => {
    const validation = validateJson(schemaSample);

    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }

    setSchemaSample(formatJson(schemaSample));
    setMessage("schema_sample formatted.");
  };

  const useSampleSchema = () => {
    setSchemaSample(defaultSchemaSample);
    setMessage("Sample schema restored.");
  };

  const sendRequest = async () => {
    if (sendState === "loading") {
      return;
    }

    setActiveTab("response");

    if (sendDisabledReason) {
      setSendState("error");
      setResponsePreview(null);
      setDebugDetails("");
      setMessage(sendDisabledReason);
      return;
    }

    setResponsePreview(null);
    setDebugDetails("");
    setSendState("loading");
    setMessage("Sending request to the OCR API...");

    try {
      const result = await extractCustomOcr(file as File, schemaSample);
      const responseJson = stringifyJson(result);

      setResponsePreview(result);
      setSendState("success");
      setMessage("Real API response loaded.");
      apiHistory.pushHistory({
        endpointPath,
        filename: (file as File).name,
        mode,
        requestSummary,
        responseJson,
        status: "success",
        message: "Real API response loaded.",
      });
    } catch (error) {
      const failurePayload = createFailurePayload(error);
      const responseJson = stringifyJson(failurePayload);
      const friendlyMessage =
        error instanceof ApiError
          ? error.friendlyMessage
          : "Something went wrong while processing the document.";

      setResponsePreview(failurePayload);
      setSendState("error");
      setMessage(friendlyMessage);
      setDebugDetails(responseJson);
      apiHistory.pushHistory({
        endpointPath,
        filename: (file as File).name,
        mode,
        requestSummary,
        responseJson,
        status: "error",
        message: friendlyMessage,
      });
    }
  };

  return {
    activeContent,
    activeHistoryItem: apiHistory.activeHistoryItem,
    activeTab,
    boundedHistoryPage: apiHistory.boundedHistoryPage,
    canSend,
    copiedLabel,
    debugDetails,
    endpoint,
    endpointPath,
    file,
    handleFileChange,
    handleModeChange,
    history: apiHistory.history,
    historyPageItems: apiHistory.historyPageItems,
    historyTotalPages: apiHistory.historyTotalPages,
    message,
    mode,
    schemaSample,
    schemaValidation,
    sendDisabledReason,
    sendRequest,
    sendState,
    setActiveHistoryId: apiHistory.setActiveHistoryId,
    setActiveTab,
    setHistoryPage: apiHistory.setHistoryPage,
    setSchemaSample,
    copyActiveTab,
    copyHistoryResponse,
    formatSchema,
    useSampleSchema,
  };
};
