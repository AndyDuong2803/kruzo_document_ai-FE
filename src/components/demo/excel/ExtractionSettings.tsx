import clsx from "clsx";
import { FiChevronDown, FiPlus, FiTrash2 } from "react-icons/fi";

import {
  extractionTemplates,
  templateOptions,
  type TemplateField,
  type TemplateId,
} from "./templates";

type ExtractionSettingsProps = {
  customFields: TemplateField[];
  customTableColumns: TemplateField[];
  customTableEnabled: boolean;
  customTableName: string;
  highlighted?: boolean;
  selectedTemplateId: TemplateId;
  onAddCustomField: () => void;
  onAddCustomTableColumn: () => void;
  onCustomTableEnabledChange: (enabled: boolean) => void;
  onCustomTableNameChange: (value: string) => void;
  onRemoveCustomField: (id: string) => void;
  onRemoveCustomTableColumn: (id: string) => void;
  onTemplateChange: (value: TemplateId) => void;
  onUpdateCustomField: (id: string, patch: Partial<TemplateField>) => void;
  onUpdateCustomTableColumn: (id: string, patch: Partial<TemplateField>) => void;
};

const inputClassName =
  "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground outline-none transition focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-soft)]";

const selectClassName = clsx(inputClassName, "appearance-none pr-11");

const TemplateFieldRows: React.FC<{
  fields: TemplateField[];
  emptyLabel: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<TemplateField>) => void;
}> = ({ fields, emptyLabel, onAdd, onRemove, onUpdate }) => (
  <div className="grid gap-3">
    {fields.length === 0 ? (
      <p className="rounded-xl border border-dashed border-border bg-card-muted p-3 text-sm text-muted">{emptyLabel}</p>
    ) : (
      fields.map((field) => (
        <div key={field.id} className="rounded-xl border border-border bg-card-muted p-3">
          <div className="flex gap-2">
            <label className="min-w-0 flex-1 text-sm font-semibold text-foreground">
              <span className="mb-1 block">Field label</span>
              <input
                value={field.label}
                className={inputClassName}
                onChange={(event) => onUpdate(field.id, { label: event.target.value })}
              />
            </label>
            <button
              type="button"
              className="mt-6 rounded-full p-2 text-muted transition-colors hover:bg-card hover:text-foreground"
              aria-label={`Remove ${field.label || "field"}`}
              onClick={() => onRemove(field.id)}
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-muted">Advanced key</summary>
            <input
              value={field.key}
              className={clsx(inputClassName, "mt-2 font-mono")}
              onChange={(event) => onUpdate(field.id, { key: event.target.value })}
            />
          </details>
        </div>
      ))
    )}

    <button
      type="button"
      className="brand-button brand-button-secondary button-pop w-fit gap-2 px-4 py-2 text-sm"
      onClick={onAdd}
    >
      <FiPlus aria-hidden="true" />
      Add field
    </button>
  </div>
);

const ExtractionSettings: React.FC<ExtractionSettingsProps> = ({
  customFields,
  customTableColumns,
  customTableEnabled,
  customTableName,
  highlighted = false,
  selectedTemplateId,
  onAddCustomField,
  onAddCustomTableColumn,
  onCustomTableEnabledChange,
  onCustomTableNameChange,
  onRemoveCustomField,
  onRemoveCustomTableColumn,
  onTemplateChange,
  onUpdateCustomField,
  onUpdateCustomTableColumn,
}) => {
  const selectedTemplate = extractionTemplates.find((template) => template.id === selectedTemplateId) ?? extractionTemplates[0];
  const isCustom = selectedTemplateId === "custom_fields";

  return (
    <div
      data-tour-target="settings"
      className={clsx("brand-card rounded-2xl p-5", highlighted && "guided-target-active")}
    >
      <div className="mb-4">
        <p className="text-sm font-semibold text-secondary">Extraction template</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground md:text-xl">Choose what Kruzo should extract</h2>
        <p className="mt-1 text-sm text-muted">Kruzo only extracts fields requested by this template.</p>
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-foreground">
          <span>Template</span>
          <span className="relative">
            <select
              value={selectedTemplateId}
              className={selectClassName}
              onChange={(event) => onTemplateChange(event.target.value as TemplateId)}
            >
              {templateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FiChevronDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
          </span>
        </label>

        {!isCustom ? (
          <div className="rounded-xl border border-border bg-card-muted p-4">
            <p className="text-sm font-semibold text-foreground">{selectedTemplate.label}</p>
            <p className="mt-1 text-sm text-muted">{selectedTemplate.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedTemplate.fields.map((field) => (
                <span key={field.key} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
                  {field.label}
                </span>
              ))}
              {selectedTemplate.tables?.map((table) => (
                <span key={table.name} className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-secondary">
                  {table.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            <TemplateFieldRows
              fields={customFields}
              emptyLabel="Add at least one field or a table column before submitting."
              onAdd={onAddCustomField}
              onRemove={onRemoveCustomField}
              onUpdate={onUpdateCustomField}
            />

            <div className="rounded-xl border border-border bg-card-muted p-4">
              <label className="flex items-start gap-3 text-sm font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={customTableEnabled}
                  className="mt-1 h-4 w-4 accent-[var(--secondary)]"
                  onChange={(event) => onCustomTableEnabledChange(event.target.checked)}
                />
                <span>
                  <span className="block">Include a table</span>
                  <span className="mt-1 block font-normal text-muted">Use this for line items, service rows, or repeated entries.</span>
                </span>
              </label>

              {customTableEnabled && (
                <div className="mt-4 grid gap-3">
                  <label className="grid gap-2 text-sm font-semibold text-foreground">
                    <span>Table name</span>
                    <input value={customTableName} className={inputClassName} onChange={(event) => onCustomTableNameChange(event.target.value)} />
                  </label>

                  <TemplateFieldRows
                    fields={customTableColumns}
                    emptyLabel="Add table columns to extract repeated rows."
                    onAdd={onAddCustomTableColumn}
                    onRemove={onRemoveCustomTableColumn}
                    onUpdate={onUpdateCustomTableColumn}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractionSettings;
