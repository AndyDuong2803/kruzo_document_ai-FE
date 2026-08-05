export const CURRENT_TERMS_VERSION = "2026-08-05";
export const CURRENT_PRIVACY_VERSION = "2026-08-05";

export const legalAcceptancePayload = (accepted: boolean) => ({
  accept_legal_terms: accepted,
  terms_version: CURRENT_TERMS_VERSION,
  privacy_version: CURRENT_PRIVACY_VERSION,
});
