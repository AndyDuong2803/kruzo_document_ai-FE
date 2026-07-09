"use client";

import clsx from "clsx";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";

import type { ToastInput, ToastMessage, ToastTone } from "./types";

type ToastContextValue = {
  dismissToast: (id: string) => void;
  pushToast: (toast: ToastInput) => void;
  showComingSoon: (featureName: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClassName: Record<ToastTone, string> = {
  info: "border-border bg-card text-foreground",
  success: "border-[var(--accent-border)] bg-[var(--accent-soft)] text-foreground",
  warning: "border-amber-300/70 bg-amber-100 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100",
  error: "border-red-300/70 bg-red-100 text-red-900 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-100",
};

const toneIcon = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiXCircle,
};

const createToastId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast: ToastInput) => {
    const id = createToastId();
    const nextToast: ToastMessage = {
      id,
      title: toast.title,
      message: toast.message ?? "",
      tone: toast.tone ?? "info",
    };

    setToasts((current) => [...current.slice(-3), nextToast]);

    window.setTimeout(() => dismissToast(id), toast.durationMs ?? 4600);
  }, [dismissToast]);

  const showComingSoon = useCallback(
    (featureName: string, message?: string) => {
      pushToast({
        title: `${featureName} is in development`,
        message: message ?? "This control is visible for product planning, but the backend workflow is not enabled yet.",
        tone: "info",
      });
    },
    [pushToast],
  );

  const value = useMemo(
    () => ({
      dismissToast,
      pushToast,
      showComingSoon,
    }),
    [dismissToast, pushToast, showComingSoon],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] grid w-[min(24rem,calc(100vw-2.5rem))] gap-2" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = toneIcon[toast.tone];

          return (
            <div
              key={toast.id}
              className={clsx("rounded-xl border px-4 py-3 shadow-lg backdrop-blur", toneClassName[toast.tone])}
              role="status"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.message && <p className="mt-1 text-sm opacity-80">{toast.message}</p>}
                </div>
                <button
                  type="button"
                  className="rounded-full p-1 opacity-70 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Dismiss notification"
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
