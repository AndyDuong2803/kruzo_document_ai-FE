import clsx from "clsx";
import { FiAlertCircle, FiCheckCircle, FiClock, FiCopy, FiInfo } from "react-icons/fi";

import type { SendState } from "./types";

type ApiResponsePanelProps = {
  content: string;
  copied: boolean;
  message: string;
  sendState: SendState;
  onCopy: () => void;
};

const ApiResponsePanel: React.FC<ApiResponsePanelProps> = ({ content, copied, message, sendState, onCopy }) => {
  const status = {
    idle: { label: "Sample response", helper: "Updates as you change the file or template.", icon: FiInfo, className: "status-ready" },
    loading: { label: "Loading", helper: "Waiting for the OCR API.", icon: FiClock, className: "status-processing" },
    success: { label: "Real response", helper: "Returned by the OCR API.", icon: FiCheckCircle, className: "status-completed" },
    error: { label: "Real error", helper: "Returned after the test request failed.", icon: FiAlertCircle, className: "status-failed" },
  }[sendState];
  const StatusIcon = status.icon;

  return (
    <section className="brand-card flex min-w-0 flex-col overflow-hidden rounded-xl" aria-labelledby="api-response-title">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-secondary">Response</p>
          <h2 id="api-response-title" className="mt-1 text-xl font-semibold">Raw JSON</h2>
          <p className="mt-1 text-xs text-muted">{status.helper}</p>
        </div>
        <span className={clsx(status.className, "gap-1.5")}><StatusIcon aria-hidden="true" /> {status.label}</span>
      </header>
      {message && (
        <div className={clsx(
          "border-b border-border px-5 py-3 text-sm",
          sendState === "error" ? "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-100" : "bg-card-muted text-muted"
        )} aria-live="polite">
          {message}
        </div>
      )}
      <div className="flex items-center justify-end border-b border-border px-4 py-2">
        <button type="button" className="brand-button brand-button-secondary gap-2 px-3 py-1.5 text-xs" onClick={onCopy}>
          {copied ? <FiCheckCircle aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
          {copied ? "Copied" : "Copy response"}
        </button>
      </div>
      <div className="p-4">
        <textarea
          aria-label="Raw JSON response"
          readOnly
          spellCheck={false}
          value={content}
          rows={12}
          className="h-[300px] min-h-[220px] w-full resize-y overflow-auto rounded-md border border-border bg-card-muted px-4 py-3 font-mono text-sm leading-relaxed outline-none"
        />
      </div>
    </section>
  );
};

export default ApiResponsePanel;
