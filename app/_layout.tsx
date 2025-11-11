import { Modal } from "@/components/modal/modal";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="subscriptions" />
        <Stack.Screen name="qr" />
        <Stack.Screen name="login" />
        <Stack.Screen name="registration" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="index" />
      </Stack>
      <Modal />
    </>
  );
}
