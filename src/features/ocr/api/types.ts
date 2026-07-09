export type ApiEnvelope<TData = unknown> = {
  success: boolean;
  error_code: string | null;
  message: string;
  data: TData | null;
};

export type OcrPrimitive = string | number | boolean | null;

export type OcrFieldValue = {
  value?: OcrPrimitive;
  extracted_value?: OcrPrimitive;
  raw_value?: OcrPrimitive;
  text?: OcrPrimitive;
  confidence?: number | string;
  score?: number | string;
  confidence_level?: number | string;
  review_required?: boolean;
  needs_review?: boolean;
  [key: string]: unknown;
};

export type OcrFieldMap = Record<string, OcrPrimitive | OcrFieldValue>;

export type OcrFieldArrayItem = OcrFieldValue & {
  field?: string;
  name?: string;
  key?: string;
  label?: string;
};

export type OcrFields = OcrFieldMap | OcrFieldArrayItem[];

export type OcrTableRow = Record<string, OcrPrimitive | unknown> | OcrPrimitive[];

export type OcrTable = {
  name?: string;
  columns?: string[];
  rows?: OcrTableRow[];
  data?: OcrTableRow[];
  items?: OcrTableRow[];
  [key: string]: unknown;
};

export type OcrReview = {
  status?: string;
  reason?: string;
  [key: string]: unknown;
};

export type OcrData = {
  fields?: OcrFields;
  extracted_fields?: OcrFields;
  extractedFields?: OcrFields;
  structured_fields?: OcrFields;
  structuredFields?: OcrFields;
  entities?: OcrFields;
  tables?: OcrTable[];
  review?: OcrReview;
  result?: {
    fields?: OcrFields;
    tables?: OcrTable[];
    review?: OcrReview;
    [key: string]: unknown;
  };
  extraction?: {
    fields?: OcrFields;
    tables?: OcrTable[];
    review?: OcrReview;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type OcrExtractResponse = ApiEnvelope<OcrData>;
