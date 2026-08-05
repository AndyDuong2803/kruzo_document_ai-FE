import { describe, expect, it } from "vitest";

import { buildCurlCommand, buildFetchExample, buildPythonExample } from "./snippets";

const options = {
  apiKey: "",
  compactSchemaSample: '{ "name": "" }',
  endpoint: "https://api.kruzoservice.com/api/v1/ocr/extract",
  filePart: "document.pdf",
  schemaSampleForExamples: '{\n  "name": ""\n}',
};

describe("API code examples", () => {
  it("keeps the required API-key header visible when the value is blank", () => {
    expect(buildCurlCommand(options)).toContain('-H "X-API-Key: "');
    expect(buildFetchExample(options)).toContain('headers: { "X-API-Key": "" }');
    expect(buildPythonExample(options)).toContain('headers={"X-API-Key": ""}');
  });

  it("fills the visible header when an API key is entered", () => {
    const withKey = { ...options, apiKey: "kda_live_example" };
    expect(buildCurlCommand(withKey)).toContain("X-API-Key: kda_live_example");
    expect(buildFetchExample(withKey)).toContain('"X-API-Key": "kda_live_example"');
    expect(buildPythonExample(withKey)).toContain('"X-API-Key": "kda_live_example"');
  });
});
