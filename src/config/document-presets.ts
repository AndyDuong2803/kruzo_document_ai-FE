export type PresetValueType = "text" | "date" | "number";

export type PresetField = {
  key: string;
  label: string;
  type: PresetValueType;
  width?: number;
  wrap?: boolean;
};

export type PresetTable = {
  key: string;
  label: string;
  columns: PresetField[];
};

export type ExportColumn = PresetField | {
  key: "__number" | "__source_file";
  label: "No." | "Source file";
  type: "number" | "text";
  width?: number;
  wrap?: boolean;
};

export type ExportDefinition = {
  documentsSheet: {
    name: "Documents";
    columns: ExportColumn[];
  };
  tables: {
    key: string;
    name: string;
    columns: ExportColumn[];
  }[];
};

export type DocumentPreset = {
  id: "invoice" | "receipt" | "identity_document" | "bank_statement" | "purchase_order" | "certificate";
  version: number;
  label: string;
  icon: string;
  description?: string;
  fields: PresetField[];
  tables: PresetTable[];
  schemaSample: Record<string, unknown>;
  exportDefinition: ExportDefinition;
};

const text = (key: string, label: string, options: Pick<PresetField, "width" | "wrap"> = {}): PresetField => ({
  key,
  label,
  type: "text",
  ...options,
});

const date = (key: string, label: string): PresetField => ({ key, label, type: "date", width: 14 });
const number = (key: string, label: string): PresetField => ({ key, label, type: "number", width: 14 });

const automaticColumns: ExportColumn[] = [
  { key: "__number", label: "No.", type: "number", width: 8 },
  { key: "__source_file", label: "Source file", type: "text", width: 28 },
];

const sampleValue = () => "";

const createPreset = (
  definition: Omit<DocumentPreset, "schemaSample" | "exportDefinition">
): DocumentPreset => ({
  ...definition,
  schemaSample: {
    ...Object.fromEntries(definition.fields.map((field) => [field.key, sampleValue()])),
    ...Object.fromEntries(
      definition.tables.map((table) => [
        table.key,
        [Object.fromEntries(table.columns.map((field) => [field.key, sampleValue()]))],
      ])
    ),
  },
  exportDefinition: {
    documentsSheet: {
      name: "Documents",
      columns: [...automaticColumns, ...definition.fields],
    },
    tables: definition.tables.map((table) => ({
      key: table.key,
      name: table.label,
      columns: [...automaticColumns, ...table.columns],
    })),
  },
});

export const documentPresets: DocumentPreset[] = [
  createPreset({
    id: "invoice",
    version: 1,
    label: "Invoice",
    icon: "file-text",
    fields: [
      text("invoice_number", "Invoice number"),
      date("issue_date", "Issue date"),
      date("due_date", "Due date"),
      text("seller_name", "Seller name"),
      text("seller_tax_id", "Seller tax ID"),
      text("buyer_name", "Buyer name"),
      text("buyer_tax_id", "Buyer tax ID"),
      text("currency", "Currency", { width: 12 }),
      number("subtotal", "Subtotal"),
      number("tax", "Tax"),
      number("discount", "Discount"),
      number("total_amount", "Total amount"),
      text("payment_terms", "Payment terms", { width: 24, wrap: true }),
      text("purchase_order_number", "Purchase order number"),
    ],
    tables: [{
      key: "line_items",
      label: "Line items",
      columns: [
        number("line_number", "Line number"),
        text("description", "Description", { width: 36, wrap: true }),
        number("quantity", "Quantity"),
        text("unit", "Unit", { width: 12 }),
        number("unit_price", "Unit price"),
        number("tax", "Tax"),
        number("amount", "Amount"),
      ],
    }],
  }),
  createPreset({
    id: "receipt",
    version: 1,
    label: "Receipt",
    icon: "receipt",
    fields: [
      text("receipt_number", "Receipt number"),
      text("merchant_name", "Merchant name"),
      text("merchant_address", "Merchant address", { width: 36, wrap: true }),
      date("transaction_date", "Transaction date"),
      text("transaction_time", "Transaction time", { width: 14 }),
      text("currency", "Currency", { width: 12 }),
      number("subtotal", "Subtotal"),
      number("tax", "Tax"),
      number("total_amount", "Total amount"),
      text("payment_method", "Payment method"),
      text("card_last_four_digits", "Card last four digits"),
    ],
    tables: [{
      key: "items",
      label: "Items",
      columns: [
        number("line_number", "Line number"),
        text("description", "Description", { width: 36, wrap: true }),
        number("quantity", "Quantity"),
        number("unit_price", "Unit price"),
        number("amount", "Amount"),
      ],
    }],
  }),
  createPreset({
    id: "identity_document",
    version: 1,
    label: "Identity document",
    icon: "id-card",
    description: "Identity cards and passports",
    fields: [
      text("document_type", "Document type"),
      text("document_number", "Document number"),
      text("full_name", "Full name"),
      date("date_of_birth", "Date of birth"),
      text("sex", "Sex", { width: 12 }),
      text("nationality", "Nationality"),
      text("place_of_origin", "Place of origin", { width: 28, wrap: true }),
      text("address", "Address", { width: 40, wrap: true }),
      date("issue_date", "Issue date"),
      date("expiry_date", "Expiry date"),
      text("issuing_authority", "Issuing authority", { width: 28, wrap: true }),
    ],
    tables: [],
  }),
  createPreset({
    id: "bank_statement",
    version: 1,
    label: "Bank statement",
    icon: "bank",
    fields: [
      text("bank_name", "Bank name"),
      text("account_holder", "Account holder"),
      text("account_number", "Account number"),
      date("statement_start_date", "Statement start date"),
      date("statement_end_date", "Statement end date"),
      text("currency", "Currency", { width: 12 }),
      number("opening_balance", "Opening balance"),
      number("total_credits", "Total credits"),
      number("total_debits", "Total debits"),
      number("closing_balance", "Closing balance"),
    ],
    tables: [{
      key: "transactions",
      label: "Transactions",
      columns: [
        number("transaction_number", "Transaction number"),
        date("date", "Date"),
        text("description", "Description", { width: 40, wrap: true }),
        text("reference", "Reference"),
        number("debit", "Debit"),
        number("credit", "Credit"),
        number("balance", "Balance"),
      ],
    }],
  }),
  createPreset({
    id: "purchase_order",
    version: 1,
    label: "Purchase order",
    icon: "clipboard",
    fields: [
      text("purchase_order_number", "Purchase order number"),
      date("order_date", "Order date"),
      text("buyer_name", "Buyer name"),
      text("supplier_name", "Supplier name"),
      date("delivery_date", "Delivery date"),
      text("delivery_address", "Delivery address", { width: 40, wrap: true }),
      text("currency", "Currency", { width: 12 }),
      number("subtotal", "Subtotal"),
      number("tax", "Tax"),
      number("total_amount", "Total amount"),
      text("payment_terms", "Payment terms", { width: 24, wrap: true }),
      text("shipping_terms", "Shipping terms", { width: 24, wrap: true }),
    ],
    tables: [{
      key: "items",
      label: "Items",
      columns: [
        number("line_number", "Line number"),
        text("item_code", "Item code"),
        text("description", "Description", { width: 36, wrap: true }),
        number("quantity", "Quantity"),
        text("unit", "Unit", { width: 12 }),
        number("unit_price", "Unit price"),
        number("amount", "Amount"),
      ],
    }],
  }),
  createPreset({
    id: "certificate",
    version: 1,
    label: "Certificate",
    icon: "award",
    description: "Degrees, licenses, and certificates",
    fields: [
      text("certificate_title", "Certificate title", { width: 28, wrap: true }),
      text("certificate_number", "Certificate number"),
      text("registration_number", "Registration number"),
      text("recipient_full_name", "Recipient full name"),
      date("date_of_birth", "Date of birth"),
      text("issuing_organization", "Issuing organization", { width: 32, wrap: true }),
      text("field_of_study", "Field of study", { width: 28, wrap: true }),
      text("qualification", "Qualification", { width: 24, wrap: true }),
      text("classification", "Classification"),
      text("graduation_year", "Graduation year"),
      date("issue_date", "Issue date"),
      text("issue_place", "Issue place"),
    ],
    tables: [],
  }),
];

export type DocumentPresetId = DocumentPreset["id"];

export const defaultDocumentPresetId: DocumentPresetId = "invoice";

export const getDocumentPreset = (id: DocumentPresetId) =>
  documentPresets.find((preset) => preset.id === id) ?? documentPresets[0];

export const serializePresetSchema = (preset: DocumentPreset) =>
  JSON.stringify(preset.schemaSample, null, 2);
