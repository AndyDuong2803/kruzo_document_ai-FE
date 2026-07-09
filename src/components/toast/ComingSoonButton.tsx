"use client";

import type React from "react";

import { useToast } from "./ToastProvider";

type ComingSoonButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  featureName: string;
  message?: string;
};

const ComingSoonButton: React.FC<ComingSoonButtonProps> = ({
  children,
  featureName,
  message,
  onClick,
  type = "button",
  ...buttonProps
}) => {
  const { showComingSoon } = useToast();

  return (
    <button
      {...buttonProps}
      type={type}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          showComingSoon(featureName, message);
        }
      }}
    >
      {children}
    </button>
  );
};

export default ComingSoonButton;
