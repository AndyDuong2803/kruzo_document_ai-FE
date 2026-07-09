import { OCR_EXTRACT_PATH, buildPublicOcrApiUrl } from "@/features/ocr/api";

export type DocsTopicId =
  | "overview"
  | "quickstart"
  | "authentication"
  | "extract-document"
  | "request-parameters"
  | "response-schema"
  | "confidence-review"
  | "error-codes"
  | "rate-limits"
  | "file-limits"
  | "notes-limitations"
  | "curl"
  | "javascript"
  | "python"
  | "sample-response";

export type DocsTopic = {
  id: DocsTopicId;
  label: string;
  group: string;
};

export const publicEndpoint = buildPublicOcrApiUrl(OCR_EXTRACT_PATH);

export const docsTopics: DocsTopic[] = [
  { group: "Get started", id: "overview", label: "Overview" },
  { group: "Get started", id: "quickstart", label: "Quickstart" },
  { group: "Get started", id: "authentication", label: "Authentication" },
  { group: "API reference", id: "extract-document", label: "Extract document" },
  { group: "API reference", id: "request-parameters", label: "Request parameters" },
  { group: "API reference", id: "response-schema", label: "Response schema" },
  { group: "API reference", id: "confidence-review", label: "Confidence & review" },
  { group: "Operations", id: "error-codes", label: "Error codes" },
  { group: "Operations", id: "rate-limits", label: "Rate limits" },
  { group: "Operations", id: "file-limits", label: "File limits" },
  { group: "Operations", id: "notes-limitations", label: "Notes & limitations" },
  { group: "Examples", id: "curl", label: "cURL" },
  { group: "Examples", id: "javascript", label: "JavaScript" },
  { group: "Examples", id: "python", label: "Python" },
  { group: "Examples", id: "sample-response", label: "Sample response" },
];

export const groupedTopics = docsTopics.reduce<Record<string, DocsTopic[]>>((groups, topic) => {
  groups[topic.group] = [...(groups[topic.group] ?? []), topic];
  return groups;
}, {});

export const requestParameters = [
  ["file", "required", OCR_EXTRACT_PATH, "PDF, JPG, PNG, or WEBP document file."],
  ["schema_sample", "required", OCR_EXTRACT_PATH, "JSON schema string that defines requested fields and tables."],
];

export const errorCodes = [
  ["422", "ERR_OCR_BIZ_2000", "Invalid input data, including invalid schema_sample JSON."],
  ["400", "WAR_OCR_BIZ_2001", "File size exceeds limit."],
  ["415", "WAR_OCR_BIZ_2002", "Unsupported file format."],
  ["400", "WAR_OCR_BIZ_2003", "File is empty."],
  ["413", "WAR_OCR_BIZ_2004", "Schema sample exceeds token limit."],
  ["502", "ERR_OCR_EXT_3000", "AI provider timeout or upstream failure."],
  ["502", "ERR_OCR_EXT_3001", "AI provider returned invalid JSON."],
];

export const sampleResponse = `{
  "success": true,
  "error_code": null,
  "message": "Data extracted successfully.",
  "data": {
    "fields": {
      "customer_name": {
        "value": "Maria Nguyen",
        "confidence": 0.96,
        "review_required": false
      },
      "total_amount": {
        "value": "428.60",
        "confidence": 0.91,
        "review_required": false
      }
    },
    "tables": [
      {
        "name": "line_items",
        "rows": [
          {
            "item": "Oil change",
            "qty": 1,
            "amount": "89.00"
          }
        ]
      }
    ],
    "review": {
      "status": "needs_review",
      "reason": "Some fields have lower confidence."
    }
  }
}`;

export const sampleSchema = `{"type":"object","properties":{"customer_name":{"type":"string"},"total_amount":{"type":"string"}}}`;

export const curlExample = `curl -X POST "${publicEndpoint}" \\
  -F "file=@repair-order.pdf" \\
  -F 'schema_sample=${sampleSchema}'`;

export const javascriptExample = `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("schema_sample", ${JSON.stringify(sampleSchema)});

const response = await fetch("${publicEndpoint}", {
  method: "POST",
  body: formData,
});

const result = await response.json();`;

export const pythonExample = `import requests

schema_sample = """${sampleSchema}"""

with open("repair-order.pdf", "rb") as file:
    response = requests.post(
        "${publicEndpoint}",
        files={"file": file},
        data={"schema_sample": schema_sample},
    )

result = response.json()`;

export const getTopicById = (id: string): DocsTopic =>
  docsTopics.find((topic) => topic.id === id) ?? docsTopics[0];
