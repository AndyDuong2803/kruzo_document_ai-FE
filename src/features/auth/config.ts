export const loginPath = "/login";
export const defaultAuthenticatedPath = "/upload";

export const sanitizeReturnTo = (value?: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return defaultAuthenticatedPath;
  }

  return value;
};
