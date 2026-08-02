import { ApiEnvelope, OcrData } from "@/features/ocr/api";

export const sampleOcrData: OcrData = {
  fields: {
    organization: { value: "Northline Services", review_required: false },
    reference_number: { value: "001048", review_required: false },
    submitted_date: { value: "2026-07-18", review_required: false },
    notes: { value: "Supporting page is not fully clear", review_required: true },
  },
  tables: [
    {
      name: "items",
      rows: [
        { description: "Application form", quantity: 1 },
        { description: "Supporting record", quantity: 2 },
      ],
    },
  ],
  review: { status: "needs_review", reason: "One value needs checking." },
};

export const sampleOcrResponse: ApiEnvelope<OcrData> = {
  success: true,
  error_code: null,
  message: "Data extracted successfully.",
  data: sampleOcrData,
};
