type RequestSnippetOptions = {
  apiKey: string;
  compactSchemaSample: string;
  endpoint: string;
  filePart: string;
  schemaSampleForExamples: string;
};

const apiKeyHeader = (apiKey: string) =>
  apiKey ? `X-API-Key: ${apiKey}` : "";

export const buildCurlCommand = ({
  apiKey,
  compactSchemaSample,
  endpoint,
  filePart,
}: RequestSnippetOptions) => {
  const header = apiKeyHeader(apiKey);
  return `curl -X POST "${endpoint}" \\
  ${header ? `-H "${header}" \\` : ""}
  -F "file=@${filePart}" \\
  -F 'schema_sample=${compactSchemaSample}'`;
};

export const buildFetchExample = ({
  apiKey,
  endpoint,
  schemaSampleForExamples,
}: RequestSnippetOptions) => {
  const headers = apiKey
    ? `\n  headers: { "X-API-Key": "${apiKey}" },`
    : "";
  return `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("schema_sample", ${JSON.stringify(schemaSampleForExamples)});

const response = await fetch("${endpoint}", {
  method: "POST",${headers}
  body: formData,
});

const result = await response.json();`;
};

export const buildPythonExample = ({
  apiKey,
  endpoint,
  schemaSampleForExamples,
}: RequestSnippetOptions) => {
  const headers = apiKey
    ? `\n        headers={"X-API-Key": "${apiKey}"},`
    : "";
  return `import requests

schema_sample = """${schemaSampleForExamples}"""

with open("document.pdf", "rb") as file:
    response = requests.post(
        "${endpoint}",${headers}
        files={"file": file},
        data={"schema_sample": schema_sample},
    )

result = response.json()`;
};
