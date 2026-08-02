import { KeyboardEvent } from "react";
import clsx from "clsx";
import { FiCheckCircle, FiCode, FiRefreshCw } from "react-icons/fi";

import type { JsonValidation } from "./formatJson";

type JsonSchemaEditorProps = {
  value: string;
  validation: JsonValidation;
  onChange: (value: string) => void;
  onFormat: () => void;
  onRestore: () => void;
};

const JsonSchemaEditor: React.FC<JsonSchemaEditorProps> = ({ value, validation, onChange, onFormat, onRestore }) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    onChange(`${value.slice(0, start)}  ${value.slice(end)}`);
    window.requestAnimationFrame(() => {
      target.selectionStart = start + 2;
      target.selectionEnd = start + 2;
    });
  };

  return (
    <div className="grid min-w-0 gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-semibold" htmlFor="schema-sample">JSON template</label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="brand-button brand-button-secondary gap-2 px-3 py-1.5 text-xs" onClick={onFormat}>
            <FiCode aria-hidden="true" /> Format JSON
          </button>
          <button type="button" className="brand-button brand-button-secondary gap-2 px-3 py-1.5 text-xs" onClick={onRestore}>
            <FiRefreshCw aria-hidden="true" /> Restore sample
          </button>
        </div>
      </div>
      <textarea
        id="schema-sample"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={9}
        spellCheck={false}
        className={clsx(
          "h-[220px] min-h-[180px] w-full min-w-0 max-w-full resize-y rounded-md border bg-card-muted px-4 py-3 font-mono text-sm leading-relaxed outline-none",
          validation.valid ? "border-border focus:border-[var(--accent-border)]" : "border-red-500"
        )}
        aria-invalid={!validation.valid}
        aria-describedby="schema-sample-validation"
      />
      <p id="schema-sample-validation" className={clsx("flex items-center gap-2 text-sm", validation.valid ? "text-secondary" : "text-red-700 dark:text-red-300")}>
        {validation.valid && <FiCheckCircle aria-hidden="true" />}
        {validation.message}
      </p>
    </div>
  );
};

export default JsonSchemaEditor;
