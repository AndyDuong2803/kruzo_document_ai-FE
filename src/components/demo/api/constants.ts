import type { ExtractModeOption, PlaygroundTabOption } from "./types";

export const tabs: PlaygroundTabOption[] = [
  { id: "request", label: "Request" },
  { id: "curl", label: "cURL" },
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "response", label: "Response" },
];

export const modeOptions: ExtractModeOption[] = [
  {
    id: "custom",
    label: "Template extract",
    description: "Send the document file plus a JSON schema_sample.",
  },
];

export const defaultSchemaSample = `{
  "type": "object",
  "properties": {
    "customer_name": { "type": "string" },
    "invoice_total": { "type": "string" },
    "service_date": { "type": "string" }
  },
  "required": ["customer_name"]
}`;
