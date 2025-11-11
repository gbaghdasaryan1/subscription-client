import { colors } from "@/constants/theme";
import { login } from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import { Link } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const LoginScreen = () => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await SecureStorageService.isAuthenticated();
        if (isAuthenticated) {
          navigate("/qr");
        }
      } catch (err: any) {
        console.debug("Auth check error:", err);
      }
    };

    void checkAuth();
  }, []);

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await login(form.emailOrPhone, form.password);

      await SecureStorageService.saveAuthToken(res?.access_token);
      await SecureStorageService.saveUserData(res?.user);
      navigate("/qr");
    } catch (error: any) {
      console.log("Error response:", error.response?.data);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Добро пожаловать</Text>
          <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>

          <TextInput
            style={styles.input}
            placeholder="Email или телефон"
            placeholderTextColor="#999"
            value={form.emailOrPhone}
            keyboardType="email-address"
            onChangeText={(emailOrPhone) =>
              setForm((prev) => ({
                ...prev,
                emailOrPhone: emailOrPhone.toLowerCase(),
              }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#999"
            secureTextEntry
            value={form.password}
            onChangeText={(password) =>
              setForm((prev) => ({ ...prev, password }))
            }
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>

          <Link href={"/registration"} style={styles.link}>
            <Text style={styles.linkText}>Создать аккаунт</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.9)", // slightly transparent for background image
    margin: 20,
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  link: {
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
});
