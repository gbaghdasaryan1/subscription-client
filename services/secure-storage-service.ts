import * as SecureStore from "expo-secure-store";

export type UserDataType = {
  createdAt: string;
  email: string;
  fullName: string;
  gender: string;
  id: string;
  passwordHash: string;
  phone: string;
  resetOtp: any;
  resetOtpExpires: any;
  resetToken: any;
  resetTokenExpires: any;
  updatedAt: string;
};

export class SecureStorageService {
  // Ключи для хранения
  private static readonly KEYS = {
    AUTH_TOKEN: "auth_token",
    USER_ID: "user_id",
    REFRESH_TOKEN: "refresh_token",
    USER_DATA: "user_data",
    SUBSCRIPTION_DATA: "subscription_data",
    BIOMETRIC_ENABLED: "biometric_enabled",
  };

  // Сохранение токена авторизации
  static async saveAuthToken(token: any): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(
        this.KEYS.AUTH_TOKEN,
        JSON.stringify(token),
      );
      return true;
    } catch (error) {
      console.error("Ошибка сохранения токена:", error);
      return false;
    }
  }

  // Получение токена авторизации
  static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error("Ошибка получения токена:", error);
      return null;
    }
  }

  // Удаление токена (выход из системы)
  static async removeAuthToken(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(this.KEYS.AUTH_TOKEN);
      return true;
    } catch (error) {
      console.error("Ошибка удаления токена:", error);
      return false;
    }
  }

  // Сохранение данных пользователя
  static async saveUserData(userData: UserDataType): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(
        this.KEYS.USER_DATA,
        JSON.stringify(userData),
      );
      return true;
    } catch (error) {
      console.error("Ошибка сохранения данных пользователя:", error);
      return false;
    }
  }

  // Получение данных пользователя
  static async getUserData(): Promise<UserDataType | null> {
    try {
      const data = await SecureStore.getItemAsync(this.KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Ошибка получения данных пользователя:", error);
      return null;
    }
  }

  // Сохранение данных подписки
  static async saveSubscription(subscriptionData: any): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(
        this.KEYS.SUBSCRIPTION_DATA,
        JSON.stringify(subscriptionData),
      );
      return true;
    } catch (error) {
      console.error("Ошибка сохранения подписки:", error);
      return false;
    }
  }

  // Получение данных подписки
  static async getSubscription(): Promise<any | null> {
    try {
      const data = await SecureStore.getItemAsync(this.KEYS.SUBSCRIPTION_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Ошибка получения подписки:", error);
      return null;
    }
  }

  // Проверка авторизации
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return token !== null;
    } catch {
      return false;
    }
  }

  // Полная очистка (выход из аккаунта)
  static async clearAll(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(this.KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(this.KEYS.USER_ID);
      await SecureStore.deleteItemAsync(this.KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(this.KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(this.KEYS.SUBSCRIPTION_DATA);
      return true;
    } catch (error) {
      console.error("Ошибка очистки данных:", error);
      return false;
    }
  }

  // Сохранение с опциями
  static async saveWithOptions(
    key: string,
    value: string,
    options?: SecureStore.SecureStoreOptions,
  ): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, value, options);
      return true;
    } catch (error) {
      console.error("Ошибка сохранения с опциями:", error);
      return false;
    }
  }
}
