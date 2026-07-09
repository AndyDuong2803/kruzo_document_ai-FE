"use client";

import { useState } from "react";

import { createUploadId } from "./fileCollection";
import type { ToastMessage, ToastTone } from "./types";

export const useToastMessages = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (message: string, tone: ToastTone = "info") => {
    const id = createUploadId();

    setToasts((current) => [...current, { id, message, tone }]);

    if (typeof window !== "undefined") {
      window.setTimeout(() => dismissToast(id), 4200);
    }
  };

  return {
    dismissToast,
    pushToast,
    toasts,
  };
};
