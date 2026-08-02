import type { CodeExampleOption, SchemaTemplate } from "./types";

const generalTemplate = `{
  "document_title": "",
  "document_number": "",
  "document_date": "",
  "organization": "",
  "summary": ""
}`;

export const schemaTemplates: SchemaTemplate[] = [
  { id: "general", label: "General document", value: generalTemplate },
  {
    id: "business_form",
    label: "Business form",
    value: `{
  "full_name": "",
  "reference_number": "",
  "email": "",
  "phone_number": "",
  "submitted_date": ""
}`,
  },
  {
    id: "table_document",
    label: "Document with a table",
    value: `{
  "document_title": "",
  "document_date": "",
  "items": [
    {
      "description": "",
      "quantity": "",
      "value": ""
    }
  ]
}`,
  },
];

export const defaultSchemaTemplate = schemaTemplates[0];
export const defaultSchemaSample = generalTemplate;

export const codeExampleOptions: CodeExampleOption[] = [
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
];
