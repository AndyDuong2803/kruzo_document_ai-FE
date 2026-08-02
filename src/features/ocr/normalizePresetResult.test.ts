import { describe, expect, it } from "vitest";

import { formatDateValue, normalizePresetResult } from "./normalizePresetResult";

describe("preset result normalization", () => {
  it("formats common document dates as yyyy/mm/dd", () => {
    expect(formatDateValue("28 March 2003")).toBe("2003/03/28");
    expect(formatDateValue("05/02/2026")).toBe("2026/02/05");
    expect(formatDateValue("2026-07-09")).toBe("2026/07/09");
  });

  it("keeps every extracted scalar as a string", () => {
    expect(normalizePresetResult("invoice", {
      issue_date: "2026-07-09",
      subtotal: 100,
      tax: null,
      line_items: [{ quantity: 2, amount: 100 }],
    })).toEqual({
      issue_date: "2026/07/09",
      subtotal: "100",
      tax: "",
      line_items: [{ quantity: "2", amount: "100" }],
    });
  });
});
