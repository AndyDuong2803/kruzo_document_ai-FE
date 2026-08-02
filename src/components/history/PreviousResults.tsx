"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";

import Container from "@/components/Container";
import {
  documentPresets,
  type DocumentPresetId,
} from "@/config/document-presets";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  listBatchDocuments,
  listBatches,
  type HistoryBatch,
  type HistoryDocument,
  type HistoryDocumentPage,
  type HistoryPage,
} from "@/features/history/api";
import { buildCombinedWorkbookBlob, triggerDownload } from "@/features/ocr/export";
import { normalizePresetResult } from "@/features/ocr/normalizePresetResult";

const RUN_PAGE_SIZE = 10;
const FILE_PAGE_SIZE = 8;

const statusLabel = (status: string) =>
  status === "check_needed"
    ? "Needs review"
    : status.replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());

const friendlyDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const statusClass = (status: string) => {
  if (status === "completed") return "status-completed";
  if (status === "failed") return "status-failed";
  if (status === "check_needed") return "status-review";
  return "status-processing";
};

const readableKey = (key: string) =>
  key.replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());

const detailRows = (value: Record<string, unknown>) => {
  const rows: { key: string; value: string }[] = [];
  const walk = (child: unknown, path: string[] = []) => {
    if (Array.isArray(child)) {
      if (!child.length) rows.push({ key: path.map(readableKey).join(" · "), value: "" });
      child.forEach((item, index) => walk(item, [...path, `Item ${index + 1}`]));
      return;
    }
    if (child && typeof child === "object") {
      Object.entries(child as Record<string, unknown>).forEach(([key, item]) =>
        walk(item, [...path, key])
      );
      return;
    }
    rows.push({
      key: path.map(readableKey).join(" · "),
      value: String(child ?? ""),
    });
  };
  walk(value);
  return rows;
};

const presetLabel = (batch: HistoryBatch) =>
  documentPresets.find((preset) => preset.id === batch.preset_id)?.label ||
  (batch.request_source === "api_key" ? "Custom API" : "Custom document");

const RunDetails: React.FC<{
  token: string;
  batch: HistoryBatch;
  onError: (message: string) => void;
}> = ({ token, batch, onError }) => {
  const [data, setData] = useState<HistoryDocumentPage | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [activeDocument, setActiveDocument] = useState<HistoryDocument | null>(null);
  const [busy, setBusy] = useState(true);
  const pageCount = Math.max(1, Math.ceil((data?.total || 0) / FILE_PAGE_SIZE));

  useEffect(() => {
    setBusy(true);
    listBatchDocuments(token, batch.id, page, FILE_PAGE_SIZE, filter || undefined)
      .then((result) => {
        setData(result);
        setActiveDocument((current) =>
          current && result.items.some((item) => item.id === current.id) ? current : null
        );
      })
      .catch((cause) => onError(cause instanceof Error ? cause.message : "Could not load files."))
      .finally(() => setBusy(false));
  }, [batch.id, filter, onError, page, token]);

  const downloadRun = async () => {
    try {
      const documents: HistoryDocument[] = [];
      let nextPage = 1;
      let total = 0;
      do {
        const result = await listBatchDocuments(token, batch.id, nextPage, 100, "completed");
        documents.push(...result.items);
        total = result.total;
        nextPage += 1;
      } while (documents.length < total);

      const exportDocuments = documents
        .filter((item) => item.user_corrected_result || item.extracted_result)
        .map((item) => {
          const rawResult = item.user_corrected_result || item.extracted_result || {};
          const result = batch.preset_id
            ? normalizePresetResult(batch.preset_id as DocumentPresetId, rawResult)
            : rawResult;
          return {
            name: item.original_file_name,
            status: item.status,
            result,
            exportDefinition: item.export_definition_snapshot,
          };
        });
      if (!exportDocuments.length) return;
      triggerDownload(
        buildCombinedWorkbookBlob(exportDocuments),
        `kruzo-document-ai-${batch.id.slice(0, 8)}.xlsx`
      );
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Could not prepare this Excel file.");
    }
  };

  const selectedResult = activeDocument
    ? activeDocument.user_corrected_result || activeDocument.extracted_result
    : null;
  const normalizedSelectedResult =
    selectedResult && batch.preset_id
      ? normalizePresetResult(batch.preset_id as DocumentPresetId, selectedResult)
      : selectedResult;

  return (
    <div className="mt-5 border-t border-border pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Filter files">
          {[
            ["", "All"],
            ["completed", "Completed"],
            ["failed", "Failed"],
            ["processing", "Processing"],
            ["waiting", "Waiting"],
          ].map(([value, label]) => (
            <button
              key={value || "all"}
              type="button"
              className={`brand-button px-3 py-1.5 text-xs ${filter === value ? "brand-button-primary" : "brand-button-secondary"}`}
              onClick={() => { setFilter(value); setPage(1); }}
            >
              {label}
            </button>
          ))}
        </div>
        {batch.completed_count > 0 && (
          <button type="button" className="brand-button brand-button-primary gap-2 px-4 py-2" onClick={() => void downloadRun()}>
            <FiDownload aria-hidden="true" />
            Download Excel
          </button>
        )}
      </div>

      {busy ? (
        <p className="mt-4 text-sm text-muted">Loading files…</p>
      ) : !data?.items.length ? (
        <p className="mt-4 text-sm text-muted">No files match this filter.</p>
      ) : (
        <div className="mt-4 divide-y divide-border border-y border-border">
          {data.items.map((document) => (
            <div key={document.id} className="py-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{document.original_file_name}</p>
                  <p className="mt-1 text-xs text-muted">
                    <span className={statusClass(document.status)}>{statusLabel(document.status)}</span>
                    {document.error_message ? ` · ${document.error_message}` : ""}
                  </p>
                </div>
                {document.status === "completed" && (
                  <button
                    type="button"
                    className="brand-button brand-button-secondary px-3 py-2 text-sm"
                    onClick={() => setActiveDocument((current) => current?.id === document.id ? null : document)}
                  >
                    {activeDocument?.id === document.id ? "Hide details" : "View details"}
                  </button>
                )}
              </div>
              {activeDocument?.id === document.id && normalizedSelectedResult && (
                <div className="mt-3 overflow-hidden rounded-md border border-border">
                  <table className="w-full table-fixed text-left text-sm">
                    <thead className="bg-card-muted">
                      <tr>
                        <th className="w-[42%] border-b border-border px-3 py-2 font-semibold">Field</th>
                        <th className="border-b border-border px-3 py-2 font-semibold">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {detailRows(normalizedSelectedResult).map((row, index) => (
                        <tr key={`${row.key}-${index}`}>
                          <th className="break-words px-3 py-2 align-top font-medium">{row.key}</th>
                          <td className="whitespace-pre-wrap break-words px-3 py-2 align-top text-muted">{row.value || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="mt-4 flex items-center justify-end gap-2" aria-label="Files pagination">
          <button type="button" disabled={page <= 1} className="brand-button brand-button-secondary px-3 py-1.5 text-xs" onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-xs text-muted">Page {page} of {pageCount}</span>
          <button type="button" disabled={page >= pageCount} className="brand-button brand-button-secondary px-3 py-1.5 text-xs" onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      )}
    </div>
  );
};

const PreviousResults: React.FC = () => {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const { token, user, loading } = useAuth();
  const [data, setData] = useState<HistoryPage | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!token) {
      setBusy(false);
      return;
    }
    setBusy(true);
    setError("");
    listBatches(token, page, RUN_PAGE_SIZE)
      .then(setData)
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load history."))
      .finally(() => setBusy(false));
  }, [page, token]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil((data?.total || 0) / RUN_PAGE_SIZE)),
    [data]
  );

  if (!loading && !user) {
    return (
      <section className="px-5 pb-16 pt-28">
        <Container>
          <div className="brand-card mx-auto max-w-xl rounded-md p-8 text-center">
            <h1 className="text-3xl font-semibold">History</h1>
            <p className="mt-3 text-muted">Sign in to see your processing runs.</p>
            <Link href="/login?next=/results" className="brand-button brand-button-primary mt-6 px-5 py-3">Sign in</Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="px-5 pb-16 pt-28">
      <Container>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold md:text-4xl">History</h1>
          {error && <p role="alert" className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100">{error}</p>}

          {busy ? (
            <p className="mt-8 text-muted">Loading history…</p>
          ) : !data?.items.length ? (
            <div className="brand-card mt-8 rounded-md p-8 text-center">
              <FiFileText className="mx-auto h-8 w-8 text-secondary" />
              <h2 className="mt-4 text-xl font-semibold">No processed documents yet.</h2>
              <Link href="/upload" className="brand-button brand-button-primary mt-5 px-5 py-3">Process documents</Link>
            </div>
          ) : (
            <>
              <div className="mt-7 grid gap-3">
                {data.items.map((batch) => (
                  <article key={batch.id} className="brand-card rounded-md p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{presetLabel(batch)}</p>
                          <span className={statusClass(batch.status)}>{statusLabel(batch.status)}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          Run {batch.id.slice(0, 8)} · {friendlyDate(batch.created_at)}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {batch.document_count} {batch.document_count === 1 ? "file" : "files"} · {batch.completed_count} completed · {batch.failed_count} failed · {batch.credits_used} {batch.credits_used === 1 ? "credit" : "credits"} used
                        </p>
                      </div>
                      <button
                        type="button"
                        className="brand-button brand-button-secondary px-4 py-2"
                        onClick={() => setExpandedId((current) => current === batch.id ? null : batch.id)}
                      >
                        {expandedId === batch.id ? "Close files" : "View files"}
                      </button>
                    </div>
                    {expandedId === batch.id && token && (
                      <RunDetails token={token} batch={batch} onError={setError} />
                    )}
                  </article>
                ))}
              </div>
              <nav className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label="History pagination">
                <Link aria-disabled={page <= 1} className={`brand-button brand-button-secondary px-3 py-2 text-sm ${page <= 1 ? "pointer-events-none opacity-50" : ""}`} href={`/results?page=${page - 1}`}>Previous</Link>
                <span className="text-sm text-muted">Page {page} of {pageCount}</span>
                <Link aria-disabled={page >= pageCount} className={`brand-button brand-button-secondary px-3 py-2 text-sm ${page >= pageCount ? "pointer-events-none opacity-50" : ""}`} href={`/results?page=${page + 1}`}>Next</Link>
              </nav>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default PreviousResults;
