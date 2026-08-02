import clsx from "clsx";
import { FiFileText, FiTrash2 } from "react-icons/fi";

import { maxFileListHeightClass, statusLabels } from "./constants";
import { formatFileSize } from "./fileCollection";
import type { SelectedUpload } from "./types";

type SelectedFilesListProps = {
  selectedFiles: SelectedUpload[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

const SelectedFilesList: React.FC<SelectedFilesListProps> = ({
  selectedFiles,
  onRemove,
  onClear,
}) => (
  <section className="border-t border-border p-5 md:p-6">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">Selected files ({selectedFiles.length})</h2>
      <button type="button" className="nav-link text-sm" onClick={onClear}>Clear all</button>
    </div>

    <div className={clsx("overflow-y-auto pr-1", maxFileListHeightClass)}>
      <div className="grid gap-2">
        {selectedFiles.map((item) => (
          <div key={item.id} className="rounded border border-border p-3">
            <div className="flex items-start gap-3">
              <div className="brand-icon flex h-9 w-9 shrink-0 items-center justify-center rounded">
                <FiFileText aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold" title={item.label}>{item.label}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{formatFileSize(item.file.size)}</span>
                  <span>{statusLabels[item.status]}</span>
                </div>
              </div>
              <button type="button" className="rounded p-2 text-muted hover:bg-card-muted hover:text-foreground" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.label}`}>
                <FiTrash2 aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SelectedFilesList;
