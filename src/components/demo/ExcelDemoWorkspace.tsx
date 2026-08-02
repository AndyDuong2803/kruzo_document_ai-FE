"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import Container from "@/components/Container";
import type { DocumentPresetId } from "@/config/document-presets";
import {
  contactPath,
  telegramCreditsUrl,
  telegramHigherLimitUrl,
} from "@/data/product";
import ExtractionSettings from "./excel/ExtractionSettings";
import ResultPreviewModal from "./excel/ResultPreviewModal";
import SelectedFilesList from "./excel/SelectedFilesList";
import SessionResults from "./excel/SessionResults";
import Toast from "./excel/Toast";
import UploadDropzone from "./excel/UploadDropzone";
import { useUploadQueue } from "./excel/useUploadQueue";

type ExcelDemoWorkspaceProps = {
  initialPresetId?: DocumentPresetId;
};

const ExcelDemoWorkspace: React.FC<ExcelDemoWorkspaceProps> = ({ initialPresetId }) => {
  const queue = useUploadQueue(initialPresetId);
  const canSubmit =
    queue.selectedFiles.length > 0 &&
    Boolean(queue.token) &&
    Boolean(queue.credits && queue.credits.balance >= queue.selectedFiles.length) &&
    queue.activeProcessingCount === 0;

  return (
    <section className="px-5 pb-14 pt-24 md:pt-28">
      <Container>
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold md:text-4xl">Process documents</h1>
            <p className="mt-3 max-w-2xl text-muted">
              Choose a document type, add your files, and download the results in Excel.
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="brand-card overflow-hidden rounded-md">
              <ExtractionSettings
                selectedPresetId={queue.selectedPresetId}
                onPresetChange={queue.setSelectedPresetId}
              />
              <UploadDropzone
                selectedCount={queue.selectedFiles.length}
                onAddFiles={queue.addCollectedFiles}
                onFolderDropped={queue.showFolderUnsupportedToast}
              />
              {queue.selectedFiles.length > 0 && (
                <SelectedFilesList
                  selectedFiles={queue.selectedFiles}
                  onRemove={queue.removeFile}
                  onClear={queue.clearFiles}
                />
              )}
            </div>

            <aside className="brand-card rounded-md p-5 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold">Output</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Selected files</dt>
                  <dd className="font-semibold">{queue.selectedFiles.length}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Credits</dt>
                  <dd className="font-semibold">{queue.credits ? queue.credits.balance : "Sign in to view"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">File type</dt>
                  <dd className="font-semibold">Excel (.xlsx)</dd>
                </div>
              </dl>

              {!queue.user && (
                <Link href="/login?next=/upload" className="brand-button brand-button-secondary mt-5 w-full px-4 py-2.5">
                  Sign in to process
                </Link>
              )}
              <button
                type="button"
                className="brand-button brand-button-primary mt-3 w-full gap-2 px-4 py-3"
                onClick={() => void queue.submitSelectedFiles()}
                disabled={!canSubmit}
              >
                {queue.selectedFiles.length
                  ? `Process ${queue.selectedFiles.length} document${queue.selectedFiles.length === 1 ? "" : "s"}`
                  : "Process documents"}
                <FiArrowRight aria-hidden="true" />
              </button>
              {queue.processingLabel && (
                <p className="mt-2 text-xs leading-5 text-muted" aria-live="polite">{queue.processingLabel}</p>
              )}
              <div className="mt-4 grid gap-2 border-t border-border pt-4 text-sm">
                <a href={telegramCreditsUrl} target="_blank" rel="noreferrer" className="nav-link">Buy more credits</a>
                <a href={telegramHigherLimitUrl} target="_blank" rel="noreferrer" className="nav-link">Need to process more files?</a>
                <Link href={contactPath} className="nav-link">Custom setup</Link>
              </div>
            </aside>
          </div>

          {queue.sessionResults.length > 0 && (
            <SessionResults
              items={queue.sessionResults}
              activeResultId={queue.activeResultFile?.id}
              onViewResult={queue.selectActiveResult}
              onDownloadRun={queue.downloadRun}
              onRetry={queue.retryFailed}
            />
          )}
        </div>
      </Container>

      <ResultPreviewModal
        result={queue.activeResultFile}
        onClose={queue.closeResultModal}
        onSave={queue.saveCorrectedResult}
        onRetry={queue.retryFailed}
      />
      <Toast toasts={queue.toasts} onDismiss={queue.dismissToast} />
    </section>
  );
};

export default ExcelDemoWorkspace;
