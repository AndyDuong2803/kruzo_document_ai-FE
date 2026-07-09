import Link from "next/link";

import { OCR_EXTRACT_PATH } from "@/features/ocr/api";

import {
  curlExample,
  errorCodes,
  javascriptExample,
  publicEndpoint,
  pythonExample,
  requestParameters,
  sampleResponse,
  type DocsTopic,
} from "./docsData";
import { CodeBlock, DataTable, DefinitionGrid, Topic } from "./DocsPrimitives";

type DocsTopicContentProps = {
  topic: DocsTopic;
  copiedLabel: string;
  onCopy: (label: string, value: string) => void;
};

const notes = [
  "Do not upload highly sensitive documents during beta.",
  "Results may require human review.",
  "Very low-quality scans may reduce extraction quality.",
  "API keys page is a placeholder; current OCR endpoint does not require API keys.",
  "Custom output uses schema_sample on the extraction endpoint.",
  "document_type, output_format, and language are future options unless backend support is added.",
  "The CSV export in the Excel demo is a frontend sample, not a final template export.",
];

const confidenceNotes = [
  "Confidence is a signal, not a guarantee.",
  "Low-confidence fields should be reviewed by staff.",
  "Kruzo should not be treated as 100% accurate automation.",
];

const DocsTopicContent: React.FC<DocsTopicContentProps> = ({ topic, copiedLabel, onCopy }) => {
  switch (topic.id) {
    case "overview":
      return (
        <Topic title="Overview">
          <p>
            Kruzo Document AI extracts requested fields, tables, confidence signals, and review hints from service-business documents.
          </p>
          <DefinitionGrid items={[
            ["Public endpoint", publicEndpoint],
            ["Extraction endpoint", `POST ${OCR_EXTRACT_PATH}`],
            ["Content type", "multipart/form-data"],
            ["Current authentication", "No API key required for the current beta endpoint"],
          ]} />
        </Topic>
      );
    case "quickstart":
      return (
        <Topic title="Quickstart">
          <p>Send a multipart form request with a document file and schema_sample. Kruzo only extracts fields requested by the template.</p>
          <CodeBlock label="Quickstart cURL" code={curlExample} copied={copiedLabel === "Quickstart cURL"} onCopy={onCopy} />
        </Topic>
      );
    case "authentication":
      return (
        <Topic title="Authentication">
          <p>The current OCR endpoint does not require an API key. API keys are planned for controlled beta access.</p>
          <Link href="/api-keys" className="nav-link mt-5 inline-flex text-sm font-semibold">
            View API keys placeholder
          </Link>
        </Topic>
      );
    case "extract-document":
      return (
        <Topic title="Extract document">
          <DefinitionGrid items={[
            ["Method", "POST"],
            ["Path", OCR_EXTRACT_PATH],
            ["Content type", "multipart/form-data"],
            ["Required fields", "file, schema_sample"],
          ]} />
        </Topic>
      );
    case "request-parameters":
      return (
        <Topic title="Request parameters">
          <DataTable headers={["Parameter", "Required", "Applies to", "Description"]} rows={requestParameters} />
        </Topic>
      );
    case "response-schema":
      return (
        <Topic title="Response schema">
          <p>Every backend response should use the shared response envelope.</p>
          <DefinitionGrid items={[
            ["success", "Boolean request status."],
            ["error_code", "Backend error code, or null on success."],
            ["message", "Human-readable backend message."],
            ["data", "Extracted JSON object returned by the OCR model."],
            ["data.fields", "Optional extracted key-value fields with confidence."],
            ["data.tables", "Optional structured tabular data when available."],
          ]} />
        </Topic>
      );
    case "confidence-review":
      return (
        <Topic title="Confidence & review">
          <div className="grid gap-3 md:grid-cols-3">
            {confidenceNotes.map((item) => (
              <div key={item} className="brand-card-muted rounded-xl p-4 text-sm text-muted">{item}</div>
            ))}
          </div>
        </Topic>
      );
    case "error-codes":
      return (
        <Topic title="Error codes">
          <DataTable headers={["Status", "Code", "Meaning"]} rows={errorCodes} />
        </Topic>
      );
    case "rate-limits":
      return (
        <Topic title="Rate limits">
          <DefinitionGrid items={[["Rate limit", "Depends on beta access"]]} />
        </Topic>
      );
    case "file-limits":
      return (
        <Topic title="File limits">
          <DefinitionGrid items={[
            ["Max file size", "10 MB backend default"],
            ["Supported files", "PDF, JPG, PNG, WEBP"],
          ]} />
        </Topic>
      );
    case "notes-limitations":
      return (
        <Topic title="Notes & limitations">
          <ul className="grid gap-3 text-muted">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Topic>
      );
    case "curl":
      return <Topic title="cURL"><CodeBlock label="cURL" code={curlExample} copied={copiedLabel === "cURL"} onCopy={onCopy} /></Topic>;
    case "javascript":
      return <Topic title="JavaScript"><CodeBlock label="JavaScript" code={javascriptExample} copied={copiedLabel === "JavaScript"} onCopy={onCopy} /></Topic>;
    case "python":
      return <Topic title="Python"><CodeBlock label="Python" code={pythonExample} copied={copiedLabel === "Python"} onCopy={onCopy} /></Topic>;
    case "sample-response":
      return <Topic title="Sample response"><CodeBlock label="Sample response" code={sampleResponse} copied={copiedLabel === "Sample response"} onCopy={onCopy} /></Topic>;
  }
};

export default DocsTopicContent;
