export type TemplateId = "invoice" | "certificate" | "customer_form" | "repair_order" | "custom_fields";

export type TemplateField = {
  id: string;
  label: string;
  key: string;
};

export type TemplateTable = {
  name: string;
  label: string;
  columns: TemplateField[];
};

export type ExtractionTemplate = {
  id: TemplateId;
  label: string;
  description: string;
  fields: TemplateField[];
  tables?: TemplateTable[];
};

const field = (key: string, label: string): TemplateField => ({ id: key, key, label });

export const extractionTemplates: ExtractionTemplate[] = [
  {
    id: "invoice",
    label: "Invoice",
    description: "Invoice header fields and line items.",
    fields: [
      field("vendor_name", "Vendor name"),
      field("customer_name", "Customer name"),
      field("invoice_number", "Invoice number"),
      field("invoice_date", "Invoice date"),
      field("total_amount", "Total amount"),
    ],
    tables: [
      {
        name: "line_items",
        label: "Line items",
        columns: [
          field("item", "Item"),
          field("qty", "Qty"),
          field("amount", "Amount"),
        ],
      },
    ],
  },
  {
    id: "certificate",
    label: "Certificate / Diploma",
    description: "Names, credential details, institution, and issue dates.",
    fields: [
      field("full_name", "Full name"),
      field("institution_name", "Institution name"),
      field("certificate_name", "Certificate name"),
      field("major_or_program", "Major or program"),
      field("issue_date", "Issue date"),
    ],
  },
  {
    id: "customer_form",
    label: "Customer form",
    description: "Contact and intake fields from service/customer forms.",
    fields: [
      field("customer_name", "Customer name"),
      field("phone_number", "Phone number"),
      field("email", "Email"),
      field("address", "Address"),
      field("request_summary", "Request summary"),
    ],
  },
  {
    id: "repair_order",
    label: "Repair order",
    description: "Repair ticket details, customer, asset, services, and totals.",
    fields: [
      field("customer_name", "Customer name"),
      field("repair_order_number", "Repair order number"),
      field("service_date", "Service date"),
      field("asset_or_vehicle", "Asset or vehicle"),
      field("total_amount", "Total amount"),
    ],
    tables: [
      {
        name: "service_items",
        label: "Service items",
        columns: [
          field("service", "Service"),
          field("qty", "Qty"),
          field("amount", "Amount"),
        ],
      },
    ],
  },
  {
    id: "custom_fields",
    label: "Custom fields",
    description: "Create your own field list without writing JSON.",
    fields: [],
  },
];

export const defaultTemplateId: TemplateId = "invoice";

export const defaultCustomFields: TemplateField[] = [
  field("full_name", "Full name"),
  field("document_number", "Document number"),
];

export const defaultCustomTableColumns: TemplateField[] = [
  field("description", "Description"),
  field("amount", "Amount"),
];

export const templateOptions = extractionTemplates.map((template) => ({
  value: template.id,
  label: template.label,
}));

export const slugFromLabel = (value: string) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "field";
};

const uniqueKey = (baseKey: string, existingKeys: string[]) => {
  let candidate = slugFromLabel(baseKey);
  let suffix = 2;

  while (existingKeys.includes(candidate)) {
    candidate = `${slugFromLabel(baseKey)}_${suffix}`;
    suffix += 1;
  }

  return candidate;
};

export const createTemplateField = (label: string, existingKeys: string[] = []): TemplateField => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  label,
  key: uniqueKey(label, existingKeys),
});

export const getTemplateById = (id: TemplateId) =>
  extractionTemplates.find((template) => template.id === id) ?? extractionTemplates[0];

export const buildTemplateSchemaSample = (
  templateId: TemplateId,
  customFields: TemplateField[],
  customTableEnabled: boolean,
  customTableName: string,
  customTableColumns: TemplateField[]
) => {
  const template = getTemplateById(templateId);
  const fields = templateId === "custom_fields" ? customFields : template.fields;
  const tables = templateId === "custom_fields"
    ? customTableEnabled
      ? [{ name: slugFromLabel(customTableName || "items"), label: customTableName || "Items", columns: customTableColumns }]
      : []
    : template.tables ?? [];
  const properties: Record<string, unknown> = {};

  fields
    .filter((item) => item.label.trim() && item.key.trim())
    .forEach((item) => {
      properties[slugFromLabel(item.key)] = { type: "string" };
    });

  tables.forEach((table) => {
    const columnProperties: Record<string, unknown> = {};

    table.columns
      .filter((item) => item.label.trim() && item.key.trim())
      .forEach((item) => {
        columnProperties[slugFromLabel(item.key)] = { type: "string" };
      });

    if (Object.keys(columnProperties).length > 0) {
      properties[slugFromLabel(table.name)] = {
        type: "array",
        items: {
          type: "object",
          properties: columnProperties,
        },
      };
    }
  });

  return JSON.stringify(
    {
      type: "object",
      properties,
    },
    null,
    2
  );
};

export const hasTemplateTargets = (
  templateId: TemplateId,
  customFields: TemplateField[],
  customTableEnabled: boolean,
  customTableColumns: TemplateField[]
) => {
  if (templateId !== "custom_fields") {
    return true;
  }

  const hasFields = customFields.some((item) => item.label.trim() && item.key.trim());
  const hasTableColumns = customTableEnabled && customTableColumns.some((item) => item.label.trim() && item.key.trim());

  return hasFields || hasTableColumns;
};
