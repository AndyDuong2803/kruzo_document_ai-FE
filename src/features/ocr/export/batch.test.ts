import JSZip from "jszip";
import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";

import { getDocumentPreset } from "@/config/document-presets";
import {
  buildCombinedSheets,
  buildCsvDownload,
  buildWorkbookArray,
  type BatchExportDocument,
} from "./batch";

const invoice = getDocumentPreset("invoice");
const documents: BatchExportDocument[] = [
  {
    name: "hóa-đơn-001.pdf",
    status: "completed",
    exportDefinition: invoice.exportDefinition,
    result: {
      invoice_number: "000123",
      issue_date: "2026/07/01",
      seller_name: "Công ty Việt",
      total_amount: "125000",
      line_items: [
        {
          line_number: "1",
          description: "Dịch vụ",
          quantity: "2",
          unit: "giờ",
          unit_price: "50000",
          tax: "25000",
          amount: "125000",
        },
      ],
    },
  },
  {
    name: "invoice-002.png",
    status: "completed",
    exportDefinition: invoice.exportDefinition,
    result: { invoice_number: "000124", total_amount: "90000", line_items: [] },
  },
];

describe("preset-based business exports", () => {
  it("uses stable horizontal columns and one row per source document", () => {
    const sheets = buildCombinedSheets(documents);
    expect(sheets[0].name).toBe("Documents");
    expect(sheets[0].columns).toEqual(
      invoice.exportDefinition.documentsSheet.columns.map((column) => column.label)
    );
    expect(sheets[0].rows).toHaveLength(2);
    expect(sheets[0].rows[0][0]).toBe(1);
    expect(sheets[0].rows[0][1]).toBe("hóa-đơn-001.pdf");
    expect(sheets[0].rows[0][2]).toBe("000123");
    expect(sheets[0].rows[0][4]).toBe("");
  });

  it("puts configured arrays in their own stable sheet", () => {
    const sheets = buildCombinedSheets(documents);
    expect(sheets.map((sheet) => sheet.name)).toEqual(["Documents", "Line items"]);
    expect(sheets[1].columns).toEqual(
      invoice.exportDefinition.tables[0].columns.map((column) => column.label)
    );
    expect(sheets[1].rows).toHaveLength(1);
    expect(sheets[1].rows[0].slice(0, 4)).toEqual([
      1,
      "hóa-đơn-001.pdf",
      "1",
      "Dịch vụ",
    ]);
  });

  it("uses the same horizontal Documents sheet for one document", () => {
    const sheets = buildCombinedSheets([documents[0]]);
    expect(sheets[0].rows).toHaveLength(1);
    const workbook = XLSX.read(buildWorkbookArray(sheets), { type: "array" });
    expect(workbook.SheetNames).toEqual(["Documents", "Line items"]);
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets.Documents, {
      header: 1,
      raw: true,
    });
    expect(rows.flat()).toContain("Công ty Việt");
    expect(rows.flat()).toContain("000123");
  });

  it("creates UTF-8 BOM CSV tables in a ZIP", async () => {
    const output = await buildCsvDownload(documents);
    const zip = await JSZip.loadAsync(await output.blob.arrayBuffer());
    const csv = await zip.file("documents.csv")!.async("string");
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toContain("Công ty Việt");
  });
});
