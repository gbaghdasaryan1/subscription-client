import { SecureStorageService } from "@/services/secure-storage-service";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    setTimeout(async () => {
      const token = await SecureStorageService.getAuthToken();
      navigation.replace(token ? "Главная" : "Login");
    }, 1000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
