import { AlertButton, AlertState } from "./types";

export class AlertManager {
  private static instance: AlertManager;
  private listeners: ((state: AlertState) => void)[] = [];
  private currentAlert: AlertState = { visible: false, title: "", message: "" };

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  subscribe(listener: (state: AlertState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  show(
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: { cancelable?: boolean },
  ) {
    console.log("[AlertManager] show() called:", { title, message, buttons });
    // Auto-add onPress to dismiss if not provided
    const processedButtons = (
      buttons || [{ text: "OK", style: "default" }]
    ).map((button) => {
      // If button already has onPress, use it, otherwise add hide
      if (button.onPress) {
        return button;
      }
      const buttonWithDismiss = {
        ...button,
        onPress: () => {
          console.log("[AlertManager] Button hide() called");
          this.hide();
        },
      };
      console.log("[AlertManager] Added auto-dismiss to button:", button.text);
      return buttonWithDismiss;
    });

    this.currentAlert = {
      visible: true,
      title,
      message,
      buttons: processedButtons,
      cancelable: options?.cancelable !== false,
    };
    console.log("[AlertManager] Current alert state:", this.currentAlert);
    this.notify();
  }

  hide() {
    console.log("[AlertManager] hide() called");
    this.currentAlert = { ...this.currentAlert, visible: false };
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentAlert));
  }

  getState() {
    return this.currentAlert;
  }
}

export const alertManager = AlertManager.getInstance();
