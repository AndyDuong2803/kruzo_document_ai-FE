import { ApiEnvelope, OcrData } from "@/features/ocr/api";

import type { PreviewRow } from "./types";

export const samplePreviewRows: PreviewRow[] = [
  { field: "Customer name", value: "Maria Nguyen", confidence: "High", review: "Approved" },
  { field: "Invoice number", value: "INV-1048", confidence: "High", review: "Approved" },
  { field: "Total amount", value: "$428.60", confidence: "High", review: "Approved" },
  { field: "Service notes", value: "Brake inspection and oil change", confidence: "Medium", review: "Needs review" },
];

export const sampleOcrData: OcrData = {
  fields: {
    customer_name: {
      value: "Maria Nguyen",
      confidence: 0.96,
      review_required: false,
    },
    invoice_number: {
      value: "INV-1048",
      confidence: 0.94,
      review_required: false,
    },
    total_amount: {
      value: "428.60",
      confidence: 0.91,
      review_required: false,
    },
    service_notes: {
      value: "Brake inspection and oil change",
      confidence: 0.72,
      review_required: true,
    },
  },
  tables: [
    {
      name: "line_items",
      rows: [
        { item: "Oil change", qty: 1, amount: "89.00" },
        { item: "Brake inspection", qty: 1, amount: "120.00" },
      ],
    },
  ],
  review: {
    status: "needs_review",
    reason: "Some service notes have lower confidence.",
  },
};

export const sampleOcrResponse: ApiEnvelope<OcrData> = {
  success: true,
  error_code: null,
  message: "Data extracted successfully.",
  data: sampleOcrData,
};
