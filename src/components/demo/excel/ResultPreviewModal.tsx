"use client";

import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

import type { ProcessedUpload } from "./types";

type ResultPreviewModalProps = {
  result?: ProcessedUpload;
  onClose: () => void;
  onSave: (id: string, result: Record<string, unknown>) => Promise<void>;
  onRetry: (id: string) => void;
};

const ResultPreviewModal: React.FC<ResultPreviewModalProps> = ({
  result,
  onClose,
  onSave,
  onRetry,
}) => {
  const preview = result?.status === "done" ? result.preview : undefined;
  const [editedResult, setEditedResult] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditedResult(result?.rawResult ? structuredClone(result.rawResult) : {});
  }, [result]);

  const editableFields = useMemo(() => {
    const fields: { path: string[]; label: string; value: string }[] = [];
    const walk = (value: unknown, path: string[] = []) => {
      if (Array.isArray(value)) {
        value.forEach((child, index) => {
          const next = [...path, String(index)];
          if (child && typeof child === "object") walk(child, next);
          else fields.push({
            path: next,
            label: next
              .map((part) => /^\d+$/.test(part)
                ? `Item ${Number(part) + 1}`
                : part.replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase()))
              .join(" - "),
            value: String(child ?? ""),
          });
        });
        return;
      }
      if (!value || typeof value !== "object") return;
      Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
        const next = [...path, key];
        if (child && typeof child === "object") walk(child, next);
        else fields.push({
          path: next,
          label: next
            .map((part) => /^\d+$/.test(part)
              ? `Item ${Number(part) + 1}`
              : part.replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase()))
            .join(" - "),
          value: String(child ?? ""),
        });
      });
    };
    walk(editedResult);
    return fields;
  }, [editedResult]);

  const updateValue = (path: string[], value: string) => {
    setEditedResult((current) => {
      const copy = structuredClone(current);
      let target: Record<string, unknown> = copy;
      path.slice(0, -1).forEach((part) => {
        target = target[part] as Record<string, unknown>;
      });
      target[path[path.length - 1]] = value;
      return copy;
    });
  };

  useEffect(() => {
    if (!result) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, result]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-5">
      <div role="dialog" aria-modal="true" aria-labelledby="result-preview-title" className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card">
        <header className="flex shrink-0 flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-secondary">Result review</p>
            <h2 id="result-preview-title" className="mt-1 truncate text-xl font-semibold">{result.file.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="brand-button brand-button-secondary gap-2 px-3 py-2 text-sm" onClick={onClose}><FiX /> Close</button>
          </div>
        </header>

        <div className="min-h-0 overflow-y-auto p-5 md:p-6">
          {result.status === "failed" ? (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100">
              <h3 className="font-semibold">This document could not be processed</h3>
              <p className="mt-1 text-sm">{result.message || "Try another file or run this document again."}</p>
              <button type="button" className="brand-button brand-button-secondary mt-4 px-4 py-2 text-sm" onClick={() => { onRetry(result.id); onClose(); }}>Retry document</button>
            </div>
          ) : result.status === "queued" || result.status === "processing" ? (
            <div className="rounded-lg border border-border p-4">
              <span className={result.status === "processing" ? "status-processing" : "status-ready"}>{result.status === "processing" ? "Processing" : "Waiting"}</span>
              <p className="mt-3 text-sm text-muted">{result.message || "The result is not ready yet."}</p>
            </div>
          ) : !preview?.hasUsableData ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted">No requested information was found in this document.</div>
          ) : (
            <div className="grid gap-7">
              {editableFields.length > 0 && (
                <section aria-labelledby="extracted-fields-title">
                  <h3 id="extracted-fields-title" className="text-lg font-semibold">Information</h3>
                  <p className="mt-1 text-sm text-muted">Check each value and correct it before downloading if needed.</p>
                  <div className="mt-3 overflow-hidden rounded-lg border border-border">
                    <dl className="divide-y divide-border">
                      {editableFields.map((field) => (
                        <div key={field.path.join(".")} className="grid gap-2 px-4 py-3 sm:grid-cols-[0.7fr_1.3fr]">
                          <dt className="text-sm font-semibold">{field.label}</dt>
                          <dd><input className="form-control !min-h-10 py-2 text-sm" value={field.value} onChange={(event) => updateValue(field.path, event.target.value)} /></dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <button type="button" disabled={saving} className="brand-button brand-button-secondary mt-4 px-4 py-2 text-sm" onClick={() => { setSaving(true); void onSave(result.id, editedResult).finally(() => setSaving(false)); }}>
                    {saving ? "Saving…" : "Save corrected result"}
                  </button>
                </section>
              )}

              {preview.tables.map((table) => (
                <section key={table.name}>
                  <h3 className="text-lg font-semibold">{table.name}</h3>
                  <div className="mt-3 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="bg-card-muted"><tr>{table.columns.map((column) => <th key={column} className="border-b border-border px-4 py-3 font-semibold">{column}</th>)}</tr></thead>
                      <tbody className="divide-y divide-border">{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{table.columns.map((column, columnIndex) => <td key={`${column}-${columnIndex}`} className="px-4 py-3">{row[columnIndex] || "—"}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPreviewModal;
