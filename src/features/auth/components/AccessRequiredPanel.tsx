import Link from "next/link";
import { FiLock, FiShield } from "react-icons/fi";

import { getLoginRedirectUrl } from "../config";

type AccessRequiredPanelProps = {
  returnTo: string;
  title?: string;
  message?: string;
};

const AccessRequiredPanel: React.FC<AccessRequiredPanelProps> = ({
  returnTo,
  title = "Sign in required",
  message = "This area belongs to an account workspace. Sign in before viewing or changing protected data.",
}) => {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 md:pt-32">
      <div className="brand-hero-grid absolute inset-0 -z-10 opacity-70"></div>
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-3xl items-center">
        <div className="brand-card w-full rounded-2xl p-6 md:p-8">
          <div className="brand-icon mb-5 flex h-12 w-12 items-center justify-center rounded-full">
            <FiLock size={22} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Protected workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
          <p className="mt-3 text-muted">{message}</p>

          <div className="mt-6 rounded-xl border border-border bg-card-muted p-4 text-sm text-muted">
            <div className="flex gap-3">
              <FiShield className="mt-0.5 flex-shrink-0 text-secondary" aria-hidden="true" />
              <p>
                The frontend checks the session cookie before rendering this page. Backend APIs must still enforce
                the same session and permission checks before returning private data.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={getLoginRedirectUrl(returnTo)} className="brand-button brand-button-primary button-pop px-5 py-2.5">
              Sign in with Google
            </Link>
            <Link href="/try" className="brand-button brand-button-secondary button-pop px-5 py-2.5">
              Open public demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessRequiredPanel;
