import clsx from "clsx";
import { FiCheckCircle, FiCopy } from "react-icons/fi";

import { codeExampleOptions } from "./constants";
import type { CodeExampleTab } from "./types";

type ApiExamplesProps = {
  activeTab: CodeExampleTab;
  content: string;
  copied: boolean;
  onChange: (tab: CodeExampleTab) => void;
  onCopy: () => void;
};

const ApiExamples: React.FC<ApiExamplesProps> = ({ activeTab, content, copied, onChange, onCopy }) => (
  <details open className="mt-5 overflow-hidden rounded-md border border-border bg-card" aria-labelledby="api-examples-title">
    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">View code examples</summary>
    <header className="flex flex-col gap-3 border-y border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-secondary">Examples</p>
        <h2 id="api-examples-title" className="mt-1 text-lg font-semibold">Use the same request in code</h2>
        <p className="mt-1 text-xs text-muted">X-API-Key is required. Enter it above to populate the empty header value.</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {codeExampleOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={clsx("rounded-md px-3 py-2 text-sm font-semibold", activeTab === option.id ? "bg-[var(--accent-soft)] text-foreground" : "text-muted hover:bg-card-muted hover:text-foreground")}
            aria-pressed={activeTab === option.id}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </header>
    <div className="flex justify-end border-b border-border px-4 py-2">
      <button type="button" className="brand-button brand-button-secondary gap-2 px-3 py-1.5 text-xs" onClick={onCopy}>
        {copied ? <FiCheckCircle aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
        {copied ? "Copied" : "Copy example"}
      </button>
    </div>
    <pre className="max-h-[240px] overflow-auto p-4 text-sm leading-relaxed"><code>{content}</code></pre>
  </details>
);

export default ApiExamples;
