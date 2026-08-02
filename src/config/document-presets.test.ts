import { describe, expect, it } from "vitest";

import { documentPresets, getDocumentPreset } from "./document-presets";

describe("document preset registry", () => {
  it("exposes all six business presets in one registry", () => {
    expect(documentPresets.map((preset) => preset.id)).toEqual([
      "invoice",
      "receipt",
      "identity_document",
      "bank_statement",
      "purchase_order",
      "certificate",
    ]);
  });

  it("keeps invoice columns in their stable order", () => {
    expect(getDocumentPreset("invoice").exportDefinition.documentsSheet.columns.map((column) => column.label)).toEqual([
      "No.",
      "Source file",
      "Invoice number",
      "Issue date",
      "Due date",
      "Seller name",
      "Seller tax ID",
      "Buyer name",
      "Buyer tax ID",
      "Currency",
      "Subtotal",
      "Tax",
      "Discount",
      "Total amount",
      "Payment terms",
      "Purchase order number",
    ]);
  });

  it("treats identity numbers as text", () => {
    const identity = getDocumentPreset("identity_document");
    expect(identity.fields.find((field) => field.key === "document_number")?.type).toBe("text");
  });

  it("keeps certificate identifiers as text", () => {
    const certificate = getDocumentPreset("certificate");
    expect(certificate.fields.find((field) => field.key === "certificate_number")?.type).toBe("text");
    expect(certificate.fields.find((field) => field.key === "registration_number")?.type).toBe("text");
  });

  it("uses string samples for every AI-returned leaf", () => {
    const invoice = getDocumentPreset("invoice");
    expect(invoice.schemaSample.subtotal).toBe("");
    expect(invoice.schemaSample.issue_date).toBe("");
    expect(invoice.schemaSample.line_items).toEqual([
      expect.objectContaining({ quantity: "", unit_price: "", amount: "" }),
    ]);
  });
});
