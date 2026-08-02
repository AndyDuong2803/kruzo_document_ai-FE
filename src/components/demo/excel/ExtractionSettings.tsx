import clsx from "clsx";
import {
  FiClipboard,
  FiCreditCard,
  FiFileText,
  FiHome,
  FiShoppingBag,
  FiAward,
} from "react-icons/fi";

import {
  documentPresets,
  getDocumentPreset,
  type DocumentPresetId,
} from "@/config/document-presets";
import { contactPath } from "@/data/product";
import Link from "next/link";

type ExtractionSettingsProps = {
  selectedPresetId: DocumentPresetId;
  onPresetChange: (value: DocumentPresetId) => void;
};

const icons = {
  "file-text": FiFileText,
  receipt: FiShoppingBag,
  "id-card": FiCreditCard,
  bank: FiHome,
  clipboard: FiClipboard,
  award: FiAward,
};

const ExtractionSettings: React.FC<ExtractionSettingsProps> = ({
  selectedPresetId,
  onPresetChange,
}) => {
  const selectedPreset = getDocumentPreset(selectedPresetId);

  return (
    <section className="p-5 md:p-6">
      <h2 className="text-lg font-semibold">Step 1 · Choose document type</h2>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {documentPresets.map((preset) => {
          const Icon = icons[preset.icon as keyof typeof icons] ?? FiFileText;
          const selected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={selected}
              className={clsx(
                "document-type-card text-left",
                selected && "is-selected"
              )}
              onClick={() => onPresetChange(preset.id)}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-semibold">{preset.label}</span>
                {preset.description && (
                  <span className="mt-0.5 block text-xs text-muted">{preset.description}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <details className="mt-4 border-t border-border pt-4">
        <summary className="w-fit cursor-pointer text-sm font-semibold text-primary">
          View Excel columns
        </summary>
        <div className="mt-3 grid gap-3 text-sm">
          <div className="rounded-md border border-border bg-card-muted p-3">
            <p className="font-semibold">Documents</p>
            <ol className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {selectedPreset.exportDefinition.documentsSheet.columns.map((column, index) => (
                <li key={column.key} className="flex min-w-0 items-center gap-2 rounded border border-border bg-card px-2.5 py-2">
                  <span className="text-xs tabular-nums text-muted">{index + 1}</span>
                  <span className="truncate font-medium">{column.label}</span>
                </li>
              ))}
            </ol>
          </div>
          {selectedPreset.exportDefinition.tables.map((table) => (
            <div key={table.key} className="rounded-md border border-border bg-card-muted p-3">
              <p className="font-semibold">{table.name}</p>
              <ol className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {table.columns.map((column, index) => (
                  <li key={column.key} className="flex min-w-0 items-center gap-2 rounded border border-border bg-card px-2.5 py-2">
                    <span className="text-xs tabular-nums text-muted">{index + 1}</span>
                    <span className="truncate font-medium">{column.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </details>

      <div className="mt-5 border-t border-border pt-4">
        <p className="font-semibold">Need another document type?</p>
        <p className="mt-1 text-sm text-muted">
          Send us a sample and we can prepare the fields and Excel layout for you.
        </p>
        <Link href={contactPath} className="nav-link mt-2 text-sm text-primary">
          Contact us
        </Link>
      </div>
    </section>
  );
};

export default ExtractionSettings;
