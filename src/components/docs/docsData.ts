import { API_KEY_OCR_EXTRACT_PATH, buildPublicOcrApiUrl } from "@/features/ocr/api";

export const publicEndpoint = buildPublicOcrApiUrl(API_KEY_OCR_EXTRACT_PATH);

export const docsSections = [
  { id: "quickstart", label: "Quickstart" },
  { id: "request", label: "Request and template" },
  { id: "response", label: "Response" },
  { id: "errors", label: "Errors and limits" },
  { id: "examples", label: "Examples" },
];

export const requestParameters = [
  ["file", "Required", "PDF, JPG, PNG, or WEBP document file."],
  ["schema_sample", "Required", "JSON schema string defining requested fields and tables."],
  ["X-API-Key", "Required", "API key created from the signed-in developer area."],
];

export const errorCodes = [
  ["422", "ERR_OCR_BIZ_2000", "Invalid input, including an invalid schema_sample."],
  ["400", "WAR_OCR_BIZ_2001", "File size exceeds the backend limit."],
  ["415", "WAR_OCR_BIZ_2002", "Unsupported file format."],
  ["400", "WAR_OCR_BIZ_2003", "File is empty."],
  ["413", "WAR_OCR_BIZ_2004", "Schema sample exceeds the token limit."],
  ["502", "ERR_OCR_EXT_3000", "Provider timeout or upstream failure."],
  ["502", "ERR_OCR_EXT_3001", "Provider returned invalid JSON."],
];

export const sampleSchema = `{
  "customer_name": "",
  "total_amount": "",
  "items": [{ "description": "", "quantity": "" }]
}`;

export const sampleResponse = `{
  "success": true,
  "error_code": null,
  "message": "Data extracted successfully.",
  "data": {
    "customer_name": "Maria Nguyen",
    "total_amount": "428.60",
    "items": [{ "description": "Application fee", "quantity": "1" }]
  }
}`;

export const curlExample = `curl -X POST "${publicEndpoint}" \\
  -H "X-API-Key: kda_live_your_key" \\
  -F "file=@document.pdf" \\
  -F 'schema_sample=${sampleSchema.replace(/\s+/g, " ")}'`;

export const javascriptExample = `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("schema_sample", JSON.stringify(template));

const response = await fetch("${publicEndpoint}", {
  method: "POST",
  headers: { "X-API-Key": "kda_live_your_key" },
  body: formData,
});

const result = await response.json();`;

export const pythonExample = `import requests

with open("document.pdf", "rb") as file:
    response = requests.post(
        "${publicEndpoint}",
        headers={"X-API-Key": "kda_live_your_key"},
        files={"file": file},
        data={"schema_sample": schema_sample},
    )

result = response.json()`;
