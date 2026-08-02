import { ChangeEvent } from "react";
import { FiChevronDown, FiSend } from "react-icons/fi";

import JsonSchemaEditor from "./JsonSchemaEditor";
import type { JsonValidation } from "./formatJson";
import type { SchemaTemplate, SchemaTemplateId, SendState } from "./types";

type ApiRequestFormProps = {
  apiKey: string;
  canSend: boolean;
  endpoint: string;
  file: File | null;
  schemaSample: string;
  schemaTemplates: SchemaTemplate[];
  schemaTemplateId: SchemaTemplateId;
  schemaValidation: JsonValidation;
  sendDisabledReason: string;
  sendState: SendState;
  onApiKeyChange: (value: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFormatSchema: () => void;
  onSchemaSampleChange: (value: string) => void;
  onSchemaTemplateChange: (value: SchemaTemplateId) => void;
  onSubmit: () => void;
  onRestoreSample: () => void;
};

const ApiRequestForm: React.FC<ApiRequestFormProps> = ({
  apiKey,
  canSend,
  endpoint,
  file,
  schemaSample,
  schemaTemplates,
  schemaTemplateId,
  schemaValidation,
  sendDisabledReason,
  sendState,
  onApiKeyChange,
  onFileChange,
  onFormatSchema,
  onSchemaSampleChange,
  onSchemaTemplateChange,
  onSubmit,
  onRestoreSample,
}) => (
  <section className="brand-card min-w-0 rounded-xl p-5 md:p-6" aria-labelledby="api-request-title">
    <div className="mb-5">
      <p className="text-sm font-semibold text-secondary">Request</p>
      <h2 id="api-request-title" className="mt-1 text-xl font-semibold">Build the multipart request</h2>
      <div className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card-muted px-3 py-2 font-mono text-xs">
        <span className="shrink-0 font-bold text-secondary">POST</span>
        <span className="min-w-0 break-all">{endpoint}</span>
      </div>
    </div>

    <div className="grid min-w-0 gap-5">
      <label className="grid min-w-0 gap-2 text-sm font-semibold">
        <span>API key</span>
        <input
          type="password"
          autoComplete="off"
          value={apiKey}
          onChange={(event) => onApiKeyChange(event.target.value)}
          placeholder="kda_live_..."
          className="w-full min-w-0 max-w-full rounded-lg border border-border bg-card px-3 py-2.5 outline-none focus:border-[var(--accent-border)]"
        />
        <span className="font-normal text-muted">Create and revoke keys from the Developers page.</span>
      </label>

      <label className="grid min-w-0 gap-2 text-sm font-semibold">
        <span>Preset JSON template</span>
        <span className="relative block min-w-0">
          <select
            value={schemaTemplateId}
            onChange={(event) => onSchemaTemplateChange(event.target.value as SchemaTemplateId)}
            className="w-full min-w-0 max-w-full appearance-none rounded-md border border-border bg-card py-2.5 pl-3 pr-12 outline-none focus:border-[var(--accent-border)]"
          >
            {schemaTemplates.map((template) => (
              <option key={template.id} value={template.id}>{template.label}</option>
            ))}
          </select>
          <FiChevronDown
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </span>
      </label>

      <JsonSchemaEditor
        value={schemaSample}
        validation={schemaValidation}
        onChange={onSchemaSampleChange}
        onFormat={onFormatSchema}
        onRestore={onRestoreSample}
      />

      <label className="grid min-w-0 gap-2 text-sm font-semibold">
        <span>Document file</span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          className="w-full min-w-0 max-w-full rounded-lg border border-border bg-card-muted px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:font-semibold"
        />
        <span className="font-normal text-muted">{file?.name || "PDF, JPG, PNG, or WEBP"}</span>
      </label>

      <button type="button" className="brand-button brand-button-primary gap-2 px-5 py-2.5" onClick={onSubmit} disabled={!canSend} title={!canSend ? sendDisabledReason : undefined}>
        {sendState === "loading" && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" aria-hidden="true" />}
        {sendState === "loading" ? "Testing..." : "Test API"}
        <FiSend aria-hidden="true" />
      </button>
      {sendDisabledReason && sendState !== "loading" && <p className="text-sm text-muted">{sendDisabledReason}</p>}
    </div>
  </section>
);

export default ApiRequestForm;
