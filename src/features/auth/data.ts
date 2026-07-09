import { sanitizeReturnTo } from "./config";

export const googleLoginUrl = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL ?? "";

export const getGoogleLoginUrl = (returnTo?: string) => {
  if (!googleLoginUrl) {
    return "";
  }

  const safeReturnTo = sanitizeReturnTo(returnTo);
  const loginUrl = new URL(googleLoginUrl, "https://document-ai.kruzo.tech");
  loginUrl.searchParams.set("next", safeReturnTo);

  if (googleLoginUrl.startsWith("/")) {
    return `${loginUrl.pathname}${loginUrl.search}${loginUrl.hash}`;
  }

  return loginUrl.toString();
};

export const authCopy = {
  eyebrow: "Secure access",
  heading: "Sign in to Kruzo",
  description:
    "Use Google to access document extraction workflows, saved history, and API access when account features are connected.",
  googleButton: "Continue with Google",
  unavailable: "Google sign-in is waiting for the backend OAuth route.",
  securityNotes: [
    "No password form is shown on this frontend.",
    "User identity will be handled through Google OAuth.",
    "Document history and API keys should stay tied to the signed-in account.",
  ],
};
