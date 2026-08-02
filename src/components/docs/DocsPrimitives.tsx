import clsx from "clsx";
import { FiCheckCircle, FiCopy } from "react-icons/fi";

type DataTableProps = {
  headers: string[];
  rows: string[][];
};

export const DataTable: React.FC<DataTableProps> = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full min-w-[620px] text-left text-sm">
      <thead className="bg-card-muted">
        <tr>
          {headers.map((header) => (
            <th key={header} className="border-b border-border px-4 py-3 font-semibold">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell, index) => (
              <td key={`${cell}-${index}`} className={clsx("px-4 py-3", index === 1 ? "font-semibold" : "text-muted")}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

type CodeBlockProps = {
  label: string;
  code: string;
  copied: boolean;
  onCopy: (label: string, value: string) => void;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ label, code, copied, onCopy }) => (
  <div className="overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-border bg-card-muted px-4 py-2.5">
      <p className="text-sm font-semibold">{label}</p>
      <button type="button" className="brand-button brand-button-secondary gap-2 px-3 py-1.5 text-xs" onClick={() => onCopy(label, code)}>
        {copied ? <FiCheckCircle aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
    <pre className="max-h-[420px] overflow-auto p-4 text-sm leading-relaxed"><code>{code}</code></pre>
  </div>
);
