import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("simplified public product contract", () => {
  it("keeps History in the account menu, not primary navigation", () => {
    const header = source("src/components/Header.tsx");
    const navigationBlock = header.slice(header.indexOf("const navigation"), header.indexOf("const AccountMenu"));
    expect(navigationBlock).not.toContain("History");
    expect(header).toContain('href="/results"');
    expect(header).toContain("Sign out");
  });

  it("removes custom fields and hides selected files while empty", () => {
    expect(source("src/components/demo/excel/ExtractionSettings.tsx")).not.toContain("Custom fields");
    expect(source("src/components/demo/ExcelDemoWorkspace.tsx")).toContain("queue.selectedFiles.length > 0");
  });

  it("removes repeated Home and retention copy", () => {
    const home = source("src/app/page.tsx");
    const footer = source("src/components/Footer.tsx");
    expect(home).not.toMatch(/Built for everyday document work|Common document examples|Fits your current way of working/);
    expect(footer).not.toContain("Result history stores");
    expect(footer).toContain("Kruzo Service");
  });

  it("keeps developer examples collapsed and documents API key authentication", () => {
    expect(source("src/components/docs/DocsShell.tsx")).toContain("<details");
    expect(source("src/components/docs/docsData.ts")).toContain("X-API-Key");
    expect(source("src/components/docs/docsData.ts")).not.toContain("Authorization: Bearer");
  });

  it("uses the exact Telegram contact link", () => {
    expect(source("src/data/product.ts")).toContain(
      "https://t.me/AndyDuong2803?text=Hi%20Kruzo%2C%20I%20would%20like%20help%20processing%20documents%20for%20my%20business."
    );
  });

  it("redirects completed sign-ins to document processing", () => {
    const login = source("src/features/auth/components/GoogleLoginPanel.tsx");
    expect(login).toContain('router.replace(returnTo || "/upload")');
    expect(login).toContain("await setSession(accessToken)");
  });

  it("keeps API examples open on cURL and limits upload-page history", () => {
    expect(source("src/components/demo/api/ApiExamples.tsx")).toContain("<details open");
    expect(source("src/components/demo/api/useApiPlayground.ts")).toContain(
      'useState<CodeExampleTab>("curl")'
    );
    expect(source("src/components/demo/excel/SessionResults.tsx")).toContain(
      ".slice(0, 3)"
    );
    expect(source("src/components/demo/excel/SessionResults.tsx")).toContain(
      'href="/results"'
    );
  });
});
