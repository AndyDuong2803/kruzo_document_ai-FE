export type ToastTone = "info" | "success" | "warning" | "error";

export type ToastInput = {
  title: string;
  message?: string;
  tone?: ToastTone;
  durationMs?: number;
};

export type ToastMessage = Required<Omit<ToastInput, "durationMs">> & {
  id: string;
};
