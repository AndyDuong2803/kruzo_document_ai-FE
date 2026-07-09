import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FiLock, FiShield } from "react-icons/fi";

import ComingSoonButton from "@/components/toast/ComingSoonButton";

import { authCopy, getGoogleLoginUrl } from "../data";

type GoogleLoginPanelProps = {
  returnTo?: string;
};

const GoogleLoginPanel: React.FC<GoogleLoginPanelProps> = ({ returnTo }) => {
  const googleLoginUrl = getGoogleLoginUrl(returnTo);
  const canLoginWithGoogle = Boolean(googleLoginUrl);

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 md:pt-32">
      <div className="brand-hero-grid absolute inset-0 -z-10 opacity-70"></div>

      <div className="mx-auto grid min-h-[calc(100vh-10rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{authCopy.eyebrow}</p>
          <h1 className="mt-3 max-w-xl text-3xl font-bold text-foreground md:text-5xl">{authCopy.heading}</h1>
          <p className="mt-4 max-w-xl text-muted">{authCopy.description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:max-w-2xl">
            {authCopy.securityNotes.map((note) => (
              <div key={note} className="brand-card-muted rounded-xl p-4 text-sm text-muted">
                <FiShield className="mb-3 text-secondary" aria-hidden="true" />
                {note}
              </div>
            ))}
          </div>
        </div>

        <div className="brand-card mx-auto w-full max-w-md rounded-2xl p-5 md:p-7">
          <div className="brand-icon mb-5 flex h-12 w-12 items-center justify-center rounded-full">
            <FiLock size={22} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Account login</h2>
          <p className="mt-2 text-sm text-muted">
            Continue with the Google account that will own your documents, extraction history, and API keys.
          </p>

          {canLoginWithGoogle ? (
            <Link
              href={googleLoginUrl}
              className="brand-button brand-button-secondary button-pop mt-6 w-full gap-3 px-5 py-3 text-base"
            >
              <FcGoogle size={22} aria-hidden="true" />
              {authCopy.googleButton}
            </Link>
          ) : (
            <ComingSoonButton
              featureName="Google sign-in"
              message="The frontend is ready, but the backend OAuth endpoint has not been connected yet."
              className="brand-button brand-button-secondary button-pop mt-6 w-full gap-3 px-5 py-3 text-base"
            >
              <FcGoogle size={22} aria-hidden="true" />
              {authCopy.googleButton}
            </ComingSoonButton>
          )}

          {!canLoginWithGoogle && (
            <p className="mt-3 rounded-xl border border-border bg-card-muted p-3 text-sm text-muted">
              {authCopy.unavailable}
            </p>
          )}

          <div className="mt-6 border-t border-border pt-5 text-sm text-muted">
            Need to test extraction first?{" "}
            <Link href="/try" className="nav-link inline-flex font-semibold">
              Open the demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleLoginPanel;
