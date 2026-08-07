let showToastFn: ((message: string, type?: "success" | "error") => void) | null = null;

export const registerToast = (fn: typeof showToastFn) => {
  showToastFn = fn;
};

export const toastError = (message: string) => {
  if (!showToastFn) {
    console.warn("Toast not initialized yet:", message);
    return;
  }

  showToastFn(message, "error");
};