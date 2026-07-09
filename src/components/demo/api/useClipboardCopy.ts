"use client";

import { useState } from "react";

export const useClipboardCopy = (onError: () => void) => {
  const [copiedLabel, setCopiedLabel] = useState("");

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(""), 1400);
    } catch {
      onError();
    }
  };

  return {
    copiedLabel,
    copyText,
  };
};
