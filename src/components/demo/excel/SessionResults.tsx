"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";

import { documentPresets } from "@/config/document-presets";
import type { ProcessedUpload } from "./types";

type SessionResultsProps = {
  items: ProcessedUpload[];
  activeResultId?: string;
  onViewResult: (id: string) => void;
  onDownloadRun: (batchId: string) => void;
  onRetry: (id: string) => void;
};

type ResultFilter = "all" | "completed" | "failed" | "processing" | "review";

const PAGE_SIZE = 5;

const hasReviewItems = (item: ProcessedUpload) =>
  item.status === "done" && Boolean(item.preview?.rows.some((row) => row.review === "Needs review"));

const filterFor = (item: ProcessedUpload): Exclude<ResultFilter, "all"> => {
  if (item.status === "failed") return "failed";
  if (item.status === "queued" || item.status === "processing") return "processing";
  if (hasReviewItems(item)) return "review";
  return "completed";
};

const statusMeta = (item: ProcessedUpload) => {
  const status = filterFor(item);
  if (status === "failed") return { label: "Failed", className: "status-failed" };
  if (status === "processing") return { label: "Processing", className: "status-processing" };
  if (status === "review") return { label: "Needs review", className: "status-review" };
  return { label: "Completed", className: "status-completed" };
};

const resultSummary = (item: ProcessedUpload) => {
  if (item.status === "failed") return item.message || "Processing failed.";
  if (item.status === "queued" || item.status === "processing") return item.message || "Waiting for result.";
  const fieldCount = item.preview?.rows.length ?? 0;
  const tableRowCount = item.preview?.tables.reduce((total, table) => total + table.rows.length, 0) ?? 0;
  if (fieldCount === 0 && tableRowCount === 0) return "No requested information found.";
  return `${fieldCount} fields${tableRowCount ? ` · ${tableRowCount} table rows` : ""}`;
};

const RunResults: React.FC<{
  batchId: string;
  items: ProcessedUpload[];
  activeResultId?: string;
  onViewResult: (id: string) => void;
  onDownloadRun: (batchId: string) => void;
  onRetry: (id: string) => void;
}> = ({ batchId, items, activeResultId, onViewResult, onDownloadRun, onRetry }) => {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<ResultFilter>("all");
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () => filter === "all" ? items : items.filter((item) => filterFor(item) === filter),
    [filter, items]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const completedCount = items.filter((item) => item.status === "done").length;
  const failedCount = items.filter((item) => item.status === "failed").length;
  const preset = documentPresets.find((item) => item.id === items[0]?.presetId);

  const changeFilter = (next: ResultFilter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <article className="brand-card rounded-md p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{preset?.label || "Custom document"}</p>
          <h3 className="mt-1 text-lg font-semibold">Run {batchId.slice(0, 8)}</h3>
          <p className="mt-1 text-sm text-muted">
            {items.length} {items.length === 1 ? "file" : "files"} · {completedCount} completed · {failedCount} failed · {completedCount} {completedCount === 1 ? "credit" : "credits"} used
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="brand-button brand-button-secondary px-4 py-2.5"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
          >
            {expanded ? "Hide files" : "View files"}
          </button>
          {completedCount > 0 && (
            <button
              type="button"
              className="brand-button brand-button-primary gap-2 px-4 py-2.5"
              onClick={() => onDownloadRun(batchId)}
            >
              <FiDownload aria-hidden="true" />
              Download Excel
            </button>
          )}
        </div>
      </div>

      {expanded && <>
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter run results">
        {([
          ["all", "All"],
          ["completed", "Completed"],
          ["failed", "Failed"],
          ["processing", "Processing"],
          ["review", "Needs review"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={clsx(
              "brand-button px-3 py-1.5 text-xs",
              filter === value ? "brand-button-primary" : "brand-button-secondary"
            )}
            onClick={() => changeFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 divide-y divide-border border-y border-border">
        {visible.length === 0 ? (
          <p className="py-5 text-sm text-muted">No files match this filter.</p>
        ) : visible.map((item) => {
          const status = statusMeta(item);
          return (
            <div
              key={item.id}
              className={clsx(
                "flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between",
                activeResultId === item.id && "bg-card-muted"
              )}
            >
              <div className="flex min-w-0 gap-3">
                <FiFileText className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" title={item.file.name}>{item.file.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className={status.className}>{status.label}</span>
                    <span>{resultSummary(item)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="brand-button brand-button-secondary px-3 py-2 text-sm" onClick={() => onViewResult(item.id)}>
                  {item.status === "done" ? "View result" : "View status"}
                </button>
                {item.status === "failed" && (
                  <button type="button" className="brand-button brand-button-secondary px-3 py-2 text-sm" onClick={() => onRetry(item.id)}>Retry</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pageCount > 1 && (
        <nav className="mt-4 flex items-center justify-end gap-2" aria-label={`Run ${batchId.slice(0, 8)} pagination`}>
          <button type="button" disabled={safePage === 1} className="brand-button brand-button-secondary px-3 py-1.5 text-xs" onClick={() => setPage(safePage - 1)}>Previous</button>
          <span className="text-xs text-muted">Page {safePage} of {pageCount}</span>
          <button type="button" disabled={safePage === pageCount} className="brand-button brand-button-secondary px-3 py-1.5 text-xs" onClick={() => setPage(safePage + 1)}>Next</button>
        </nav>
      )}
      </>}
    </article>
  );
};

const SessionResults: React.FC<SessionResultsProps> = ({
  items,
  activeResultId,
  onViewResult,
  onDownloadRun,
  onRetry,
}) => {
  const runs = useMemo(() => {
    const grouped = new Map<string, ProcessedUpload[]>();
    items.forEach((item) => {
      const batchId = item.batchId || "current";
      grouped.set(batchId, [...(grouped.get(batchId) || []), item]);
    });
    return Array.from(grouped.entries()).slice(0, 3);
  }, [items]);

  return (
    <section className="mt-7" aria-labelledby="session-results-title">
      <h2 id="session-results-title" className="text-xl font-semibold">Step 3 · Review and download</h2>
      <div className="mt-4 grid gap-4">
        {runs.map(([batchId, runItems]) => (
          <RunResults
            key={batchId}
            batchId={batchId}
            items={runItems}
            activeResultId={activeResultId}
            onViewResult={onViewResult}
            onDownloadRun={onDownloadRun}
            onRetry={onRetry}
          />
        ))}
      </div>
      <div className="mt-5 text-right">
        <Link href="/results" className="nav-link text-sm font-semibold">View all history</Link>
      </div>
    </section>
  );
};

export default SessionResults;
