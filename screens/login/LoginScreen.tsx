import { Alert } from "@/components/ui/alert/alert";
import { Loading } from "@/components/ui/loading/loading";
import { login } from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

export const LoginScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<{
    isError: boolean;
    msg: string;
  } | null>(null);
  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!form.emailOrPhone.trim() || !form.password.trim()) {
      Alert.alert("Ошибка валидации", "Заполните все поля");
      return;
    }

    setLoading(true);
    try {
      const res = await login(
        form.emailOrPhone.toLocaleLowerCase().trim(),
        form.password,
      );

      if (!res?.access_token) {
        setLoading(false);
        Alert.alert("Ошибка", "Неверный формат ответа от сервера");
        return;
      }

      await SecureStorageService.saveAuthToken(res.access_token);
      if (res.user) {
        await SecureStorageService.saveUserData(res.user);
      }

      router.replace("/");
    } catch (error: any) {
      setHasError({
        isError: true,
        msg: error?.response.data.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Loading visible={loading} text="Вход в систему..." />
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

          <Text
            style={{
              color: "tomato",
              marginBottom: 10,
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {hasError?.msg}
          </Text>

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
