import { colors } from "@/constants/theme";
import { changePassword } from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<{
    fullName: string;
    email: string;
    phone: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
  });

  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await SecureStorageService.getUserData();
      if (storedUser) setUser(storedUser);
    };
    void loadUser();
  }, []);

  const handleChangePassword = async () => {
    if (!form.oldPassword || !form.newPassword) {
      Alert.alert("Ошибка", "Пожалуйста, заполните все поля");
      return;
    }
    try {
      await changePassword();
      Alert.alert("Успех", "Пароль успешно изменён");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      Alert.alert("Ошибка", err.message || "Что-то пошло не так");
    }
  };

  const handleLogout = async () => {
    await SecureStorageService.removeAuthToken();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Text style={styles.title}>Профиль пользователя</Text>

        {/* User Info */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Имя</Text>
          <Text style={styles.value}>{user.fullName}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Телефон</Text>
          <Text style={styles.value}>{user.phone}</Text>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Изменить пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Старый пароль"
            secureTextEntry
            value={form.oldPassword}
            onChangeText={(oldPassword) =>
              setForm((prev) => ({ ...prev, oldPassword }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Новый пароль"
            secureTextEntry
            value={form.newPassword}
            onChangeText={(newPassword) =>
              setForm((prev) => ({ ...prev, newPassword }))
            }
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.primaryText}>Сменить пароль</Text>
          </TouchableOpacity>
        </View>

        {/* Other Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Действия</Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/subscriptions")}
          >
            <Text style={styles.secondaryText}>Мои подписки</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogout}
          >
            <Text style={styles.secondaryText}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
