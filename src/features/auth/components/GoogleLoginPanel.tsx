"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import KruzoLogo from "@/components/KruzoLogo";
import { useAuth } from "../AuthProvider";
import { loginWithGoogleToken, loginWithPassword, registerWithPassword } from "../api";

type GoogleLoginPanelProps = {
  returnTo?: string;
};

type LegalAcceptanceCheckboxProps = {
  checked: boolean;
  googleContext?: boolean;
  onChange: (checked: boolean) => void;
};

const LegalAcceptanceCheckbox: React.FC<LegalAcceptanceCheckboxProps> = ({ checked, googleContext, onChange }) => (
  <div className="rounded-md border border-border bg-card-muted p-3">
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
      />
      <span>
        I agree to the <Link href="/terms" target="_blank" className="font-semibold text-primary">Terms of Use</Link> and acknowledge the <Link href="/privacy" target="_blank" className="font-semibold text-primary">Privacy Policy</Link>.
      </span>
    </label>
    {googleContext && <p className="ml-7 mt-1 text-xs leading-5 text-muted">Required if this Google sign-in creates an account or the current terms have not yet been accepted.</p>}
  </div>
);

const GoogleLoginPanel: React.FC<GoogleLoginPanelProps> = ({ returnTo }) => {
  const router = useRouter();
  const { setSession } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleInitializedRef = useRef(false);
  const googleCallbackHandledRef = useRef(false);
  const legalAcceptedRef = useRef(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const completeLogin = useCallback(async (accessToken: string) => {
    await setSession(accessToken);
    router.replace(returnTo || "/upload");
  }, [returnTo, router, setSession]);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    const initialize = () => {
      if (googleInitializedRef.current) return;
      const google = (window as typeof window & {
        google?: {
          accounts: {
            id: {
              initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
              renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
            };
          };
        };
      }).google;
      if (!google || !googleButtonRef.current) return;
      googleInitializedRef.current = true;
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          if (googleCallbackHandledRef.current) return;
          googleCallbackHandledRef.current = true;
          setBusy(true);
          setError("");
          loginWithGoogleToken(credential, legalAcceptedRef.current)
            .then((result) => completeLogin(result.access_token))
            .catch((cause) => {
              googleCallbackHandledRef.current = false;
              setError(cause instanceof Error ? cause.message : "Google sign-in failed.");
            })
            .finally(() => setBusy(false));
        },
      });
      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: googleButtonRef.current.clientWidth,
        text: "continue_with",
      });
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-kda-google="true"]');
    if (existing) {
      initialize();
      existing.addEventListener("load", initialize, { once: true });
      return () => existing.removeEventListener("load", initialize);
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.dataset.kdaGoogle = "true";
    script.onload = initialize;
    document.head.appendChild(script);
  }, [completeLogin, googleClientId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "register" && !legalAccepted) {
      setError("Accept the Terms of Use and acknowledge the Privacy Policy to create an account.");
      return;
    }
    setBusy(true);
    try {
      const result = mode === "login"
        ? await loginWithPassword(email, password)
        : await registerWithPassword(email, password, legalAccepted);
      await completeLogin(result.access_token);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex flex-1 items-center px-5 pb-8 pt-24">
      <div className="brand-card mx-auto w-full max-w-md rounded-md p-6 md:p-8">
        <KruzoLogo />
        <h1 className="mt-8 text-3xl font-semibold">{mode === "login" ? "Sign in" : "Create account"}</h1>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <label className="grid gap-1.5 text-sm font-semibold">
            Email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="form-control" />
          </label>
          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} required value={password} onChange={(event) => setPassword(event.target.value)} className="form-control pr-16" />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {mode === "register" && (
            <div className="grid gap-1.5">
              <label htmlFor="confirm-password" className="text-sm font-semibold">Confirm password</label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="form-control pr-16"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}
          {mode === "register" && (
            <LegalAcceptanceCheckbox
              checked={legalAccepted}
              onChange={(checked) => {
                legalAcceptedRef.current = checked;
                setLegalAccepted(checked);
                setError("");
              }}
            />
          )}
          {error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>}
          <button disabled={busy} className="brand-button brand-button-primary w-full px-5 py-3">
            {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button type="button" className="nav-link mt-4" onClick={() => { setMode(mode === "login" ? "register" : "login"); setConfirmPassword(""); setError(""); }}>
          {mode === "login" ? "Create account" : "Already have an account? Sign in"}
        </button>

        {googleClientId && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
            {mode === "login" && (
              <LegalAcceptanceCheckbox
                checked={legalAccepted}
                googleContext
                onChange={(checked) => {
                  legalAcceptedRef.current = checked;
                  setLegalAccepted(checked);
                  setError("");
                }}
              />
            )}
            <div ref={googleButtonRef} className={`${mode === "login" ? "mt-3 " : ""}${busy ? "pointer-events-none opacity-60" : ""}`} />
          </>
        )}
      </div>
    </section>
  );
};

export default GoogleLoginPanel;
