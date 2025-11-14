import { Modal } from "@/components/modal/modal";
import { AlertProvider } from "@/components/ui/alert/alert-provider";
import { FloatingProfileButton } from "@/components/ui/floating-profile-button/floating-profile-button";
import { SecureStorageService } from "@/services/secure-storage-service";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const segments = useSegments();
  // const router = useRouter();

  // Check auth on mount and when route changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await SecureStorageService.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []); // Re-check when segments change (e.g., after logout redirect)

  return (
    <AlertProvider>
      {isAuthenticated && <FloatingProfileButton />}

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="registration" />
        <Stack.Screen name="qr" />
        <Stack.Screen name="subscriptions" />
        <Stack.Screen name="profile" />
      </Stack>
      <Modal />
    </AlertProvider>
  );
}
