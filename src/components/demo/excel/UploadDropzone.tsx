"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import clsx from "clsx";
import { FiUploadCloud } from "react-icons/fi";

import { fileInputAccept, supportedTypesLabel } from "./constants";
import { collectDroppedFiles, mapInputFiles } from "./fileCollection";
import type { CollectedFile } from "./types";

type UploadDropzoneProps = {
  selectedCount: number;
  onAddFiles: (items: CollectedFile[]) => void;
  onFolderDropped: () => void;
};

const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  selectedCount,
  onAddFiles,
  onFolderDropped,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const isCompact = selectedCount > 0;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = mapInputFiles(event.target.files);
    if (files.length > 0) onAddFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const result = collectDroppedFiles(event.dataTransfer);
    if (result.folderDropped) onFolderDropped();
    if (result.files.length > 0) onAddFiles(result.files);
  };

  return (
    <section className="border-t border-border p-5 md:p-6">
      <h2 className="mb-3 text-lg font-semibold">Step 2 · Add files</h2>
      <div
        className={clsx(
          "rounded border border-dashed bg-card-muted",
          isCompact ? "p-3 md:p-4" : "p-5 text-center md:p-6",
          isDragActive ? "border-primary bg-[var(--primary-subtle)]" : "border-border"
        )}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
      >
        <div className={clsx("flex gap-3", isCompact ? "items-center justify-between" : "flex-col items-center")}>
          <div className={clsx("min-w-0", isCompact && "flex items-center gap-3")}>
            <div className={clsx("brand-icon shrink-0 items-center justify-center rounded", isCompact ? "hidden h-10 w-10 sm:flex" : "mx-auto flex h-12 w-12")}>
              <FiUploadCloud size={22} aria-hidden="true" />
            </div>
            <div>
              <p className={clsx("font-semibold", isCompact ? "text-base" : "mt-4 text-xl")}>
                {isCompact ? "Add more files" : "Drop files here"}
              </p>
              {!isCompact && <p className="mt-2 text-sm text-muted">PDF or image files</p>}
            </div>
          </div>
          <div className={isCompact ? "shrink-0" : "mt-4"}>
            <input id="demo-file" type="file" multiple accept={fileInputAccept} className="sr-only" onChange={handleInputChange} />
            <label htmlFor="demo-file" className="brand-button brand-button-primary cursor-pointer whitespace-nowrap px-4 py-2 text-sm">
              Add files
            </label>
          </div>
        </div>
        <p className={clsx("text-xs text-muted", isCompact ? "mt-3" : "mt-4")}>
          {selectedCount > 0 ? `${selectedCount} of 20 files · ` : ""}{supportedTypesLabel} · 10 MB each
        </p>
      </div>
    </section>
  );
};

export default UploadDropzone;
