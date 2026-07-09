import clsx from "clsx";
import { FiCheckCircle, FiCopy } from "react-icons/fi";

export const Topic: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <div>
    <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
    <div className="mt-5 grid gap-5 text-muted">{children}</div>
  </div>
);

type DefinitionGridProps = {
  items: string[][];
};

export const DefinitionGrid: React.FC<DefinitionGridProps> = ({ items }) => (
  <div className="grid gap-3">
    {items.map(([label, value]) => (
      <div key={label} className="rounded-xl border border-border bg-card-muted p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</p>
        <p className="mt-1 break-words font-mono text-sm text-foreground">{value}</p>
      </div>
    ))}
  </div>
);

type DataTableProps = {
  headers: string[];
  rows: string[][];
};

export const DataTable: React.FC<DataTableProps> = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full min-w-[680px] text-left text-sm">
      <thead className="bg-card-muted text-muted">
        <tr>
          {headers.map((header) => (
            <th key={header} className="border-b border-border px-4 py-3 font-semibold">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")} className="border-b border-border last:border-b-0">
            {row.map((cell, index) => (
              <td key={cell} className={clsx("px-4 py-3", index === 1 ? "font-semibold text-foreground" : "text-muted")}>
                {cell}
              </td>
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
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-border bg-card-muted px-4 py-3">
      <p className="text-sm font-semibold text-secondary">{label}</p>
      <button
        type="button"
        className="brand-button brand-button-secondary button-pop gap-2 px-3 py-1.5 text-sm"
        onClick={() => onCopy(label, code)}
      >
        {copied ? <FiCheckCircle aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
    <pre className="max-h-[520px] overflow-auto p-4 text-sm leading-relaxed text-foreground">
      <code>{code}</code>
    </pre>
  </div>
);
