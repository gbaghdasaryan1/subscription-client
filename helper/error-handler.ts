import { Alert } from "@/components/ui/alert/alert";
import { AxiosError } from "axios";

export enum ErrorType {
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  SERVER = "SERVER",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN",
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
  fields?: Record<string, string[]>; // For validation errors
}

export class ErrorHandler {
  /**
   * Parse and categorize errors from various sources
   */
  static parseError(error: any): AppError {
    // Axios error
    if (this.isAxiosError(error)) {
      return this.parseAxiosError(error);
    }

    // Native error
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message || "Произошла неизвестная ошибка",
        originalError: error,
      };
    }

    // String error
    if (typeof error === "string") {
      return {
        type: ErrorType.UNKNOWN,
        message: error,
        originalError: error,
      };
    }

    // Unknown error type
    return {
      type: ErrorType.UNKNOWN,
      message: "Произошла неизвестная ошибка",
      originalError: error,
    };
  }

  /**
   * Parse Axios errors specifically
   */
  private static parseAxiosError(error: AxiosError): AppError {
    const response = error.response;
    const request = error.request;

    // No response - network error
    if (!response && request) {
      return {
        type: ErrorType.NETWORK,
        message: "Нет соединения с сервером. Проверьте интернет-соединение.",
        originalError: error,
      };
    }

    // Timeout
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return {
        type: ErrorType.TIMEOUT,
        message: "Превышено время ожидания. Попробуйте снова.",
        originalError: error,
        statusCode: 0,
      };
    }

    // Response error
    if (response) {
      const status = response.status;
      const data: any = response.data;

      // Extract backend error message if available
      const backendMessage =
        data?.message || data?.error || data?.detail || data?.msg;

      // Authentication errors
      if (status === 401 || status === 403) {
        return {
          type: ErrorType.AUTHENTICATION,
          message: backendMessage || "Ошибка авторизации. Войдите снова.",
          originalError: error,
          statusCode: status,
        };
      }

      // Validation errors
      if (status === 400 || status === 422) {
        // If we have field-specific errors, format them
        const fieldErrors = data?.errors || data?.fields;
        let message =
          backendMessage || "Проверьте правильность введенных данных";

        // Append field-specific errors if available
        if (fieldErrors && typeof fieldErrors === "object") {
          const formattedErrors = this.formatValidationErrors(fieldErrors);
          if (formattedErrors) {
            message = backendMessage
              ? `${backendMessage}\n\n${formattedErrors}`
              : formattedErrors;
          }
        }

        return {
          type: ErrorType.VALIDATION,
          message,
          originalError: error,
          statusCode: status,
          fields: fieldErrors,
        };
      }

      // Server errors
      if (status >= 500) {
        return {
          type: ErrorType.SERVER,
          message: backendMessage || "Ошибка сервера. Попробуйте позже.",
          originalError: error,
          statusCode: status,
        };
      }

      // Other HTTP errors - prioritize backend message
      return {
        type: ErrorType.UNKNOWN,
        message: backendMessage || `Ошибка: ${status}`,
        originalError: error,
        statusCode: status,
      };
    }

    // Fallback
    return {
      type: ErrorType.NETWORK,
      message: error.message || "Ошибка сети",
      originalError: error,
    };
  }

  /**
   * Type guard for Axios errors
   */
  private static isAxiosError(error: any): error is AxiosError {
    return error?.isAxiosError === true;
  }

  /**
   * Handle error and show alert to user
   */
  static handle(error: any, customTitle?: string): AppError {
    const appError = this.parseError(error);

    // Log to console for debugging
    console.error("[ErrorHandler]", {
      type: appError.type,
      message: appError.message,
      statusCode: appError.statusCode,
      originalError: appError.originalError,
    });

    // Show alert to user
    const title = customTitle || this.getDefaultTitle(appError.type);
    Alert.alert(title, appError.message);

    return appError;
  }

  /**
   * Handle error silently (no alert, just logging)
   */
  static handleSilent(error: any): AppError {
    const appError = this.parseError(error);

    console.error("[ErrorHandler Silent]", {
      type: appError.type,
      message: appError.message,
      statusCode: appError.statusCode,
      originalError: appError.originalError,
    });

    return appError;
  }

  /**
   * Handle error with custom callback
   */
  static handleWithCallback(
    error: any,
    callback: (appError: AppError) => void,
  ): AppError {
    const appError = this.parseError(error);

    console.error("[ErrorHandler Callback]", {
      type: appError.type,
      message: appError.message,
      statusCode: appError.statusCode,
    });

    callback(appError);
    return appError;
  }

  /**
   * Get default alert title based on error type
   */
  private static getDefaultTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return "Ошибка сети";
      case ErrorType.AUTHENTICATION:
        return "Ошибка авторизации";
      case ErrorType.VALIDATION:
        return "Ошибка валидации";
      case ErrorType.SERVER:
        return "Ошибка сервера";
      case ErrorType.TIMEOUT:
        return "Время истекло";
      default:
        return "Ошибка";
    }
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(fields?: Record<string, string[]>): string {
    if (!fields) return "";

    return Object.entries(fields)
      .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
      .join("\n");
  }
}

// Export convenience functions
export const handleError = (error: any, customTitle?: string) =>
  ErrorHandler.handle(error, customTitle);

export const handleErrorSilent = (error: any) =>
  ErrorHandler.handleSilent(error);

export const parseError = (error: any) => ErrorHandler.parseError(error);
