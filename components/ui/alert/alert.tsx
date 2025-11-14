import { alertManager } from "./alert-manager";
import { AlertButton } from "./types";

// Global Alert Provider Component

// Convenience function to match React Native Alert API
export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean },
  ) => {
    alertManager.show(title, message, buttons, options);
  },
};
