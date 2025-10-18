import { login } from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import { navigate } from "expo-router/build/global-state/routing";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export const LoginScreen = () => {
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await login(form.emailOrPhone, form.password);
      await SecureStorageService.saveAuthToken(res?.data.auth);
      await SecureStorageService.saveUserData(res?.data.user);
      navigate("/qr");
    } catch (error: any) {
      console.log("Error response:", error.response?.data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Phone"
        value={form.emailOrPhone}
        keyboardType="email-address"
        onChangeText={(emailOrPhone) =>
          setForm((prev) => ({ ...prev, emailOrPhone }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={(password) => setForm((prev) => ({ ...prev, password }))}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});
