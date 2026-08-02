export type SendState = "idle" | "loading" | "success" | "error";
export type CodeExampleTab = "curl" | "javascript" | "python";
export type SchemaTemplateId = "general" | "business_form" | "table_document";

export type CodeExampleOption = {
  id: CodeExampleTab;
  label: string;
};

export type SchemaTemplate = {
  id: SchemaTemplateId;
  label: string;
  value: string;
};
