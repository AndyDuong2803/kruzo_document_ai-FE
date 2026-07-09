type RequestSnippetOptions = {
  compactSchemaSample: string;
  endpoint: string;
  filePart: string;
  schemaSampleForExamples: string;
};

export const buildRequestSummary = ({ endpoint, filePart }: RequestSnippetOptions) => `Method: POST
URL: ${endpoint}
Content-Type: multipart/form-data
Authentication: Not required for current OCR endpoint

Fields:
  file: ${filePart}
  schema_sample: JSON schema string`;

export const buildCurlCommand = ({
  compactSchemaSample,
  endpoint,
  filePart,
}: RequestSnippetOptions) => `curl -X POST "${endpoint}" \\
  -F "file=@${filePart}" \\
  -F 'schema_sample=${compactSchemaSample}'`;

export const buildFetchExample = ({
  endpoint,
  schemaSampleForExamples,
}: RequestSnippetOptions) => `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("schema_sample", ${JSON.stringify(schemaSampleForExamples)});

const response = await fetch("${endpoint}", {
  method: "POST",
  body: formData,
});

const result = await response.json();`;

export const buildPythonExample = ({
  endpoint,
  schemaSampleForExamples,
}: RequestSnippetOptions) => `import requests

schema_sample = """${schemaSampleForExamples}"""

with open("repair-order.pdf", "rb") as file:
    response = requests.post(
        "${endpoint}",
        files={"file": file},
        data={"schema_sample": schema_sample},
    )

result = response.json()`;
