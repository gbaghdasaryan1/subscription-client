import { Alert } from "@/components/ui/alert/alert";
import { Loading } from "@/components/ui/loading/loading";
import { colors } from "@/constants/theme";
import { handleError } from "@/helper/error-handler";
import { changePassword, deleteAccount } from "@/services";
import {
  SecureStorageService,
  UserDataType,
} from "@/services/secure-storage-service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<UserDataType | null>(null);

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
      Alert.alert("Ошибка валидации", "Пожалуйста, заполните все поля");
      return;
    }

    if (form.newPassword.length < 6) {
      Alert.alert(
        "Ошибка валидации",
        "Новый пароль должен быть не менее 6 символов",
      );
      return;
    }

    setLoading(true);
    try {
      await changePassword();
      Alert.alert("Успех", "Пароль успешно изменён");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err: any) {
      handleError(err, "Ошибка смены пароля");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (userId: string) => {
    Alert.alert(
      "Подтверждение",
      "Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount(userId);
              await SecureStorageService.clearAll();
              router.replace("/registration");
              Alert.alert("Успех", "Ваш аккаунт был удалён.");
            } catch (error) {
              handleError(error, "Ошибка удаления аккаунта");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await SecureStorageService.clearAll();
      router.replace("/login");
    } catch (error) {
      handleError(error, "Ошибка выхода");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Loading visible={loading} text="Обработка..." />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
          <Text style={styles.title}>{user?.fullName || "Пользователь"}</Text>
          <Text style={styles.subtitle}>Управление профилем</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Личная информация</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📧</Text>
              <View style={styles.infoContent}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user?.email || "Не указан"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📱</Text>
              <View style={styles.infoContent}>
                <Text style={styles.label}>Телефон</Text>
                <Text style={styles.value}>{user?.phone || "Не указан"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👥</Text>
              <View style={styles.infoContent}>
                <Text style={styles.label}>Пол</Text>
                <Text style={styles.value}>
                  {user?.gender === "male"
                    ? "Мужской"
                    : user?.gender === "female"
                      ? "Женский"
                      : "Не указан"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Быстрые действия</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/")}
            >
              <Text style={styles.actionIcon}>🏠</Text>
              <Text style={styles.actionText}>Главная</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/subscriptions")}
            >
              <Text style={styles.actionIcon}>💳</Text>
              <Text style={styles.actionText}>Подписки</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/qr")}
            >
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionText}>QR-код</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Change Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Безопасность</Text>
          <View style={styles.passwordCard}>
            <Text style={styles.passwordTitle}>Сменить пароль</Text>
            <TextInput
              style={styles.input}
              placeholder="Старый пароль"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={form.oldPassword}
              autoFocus={false}
              onChangeText={(oldPassword) =>
                setForm((prev) => ({ ...prev, oldPassword }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Новый пароль (мин. 6 символов)"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoFocus={false}
              value={form.newPassword}
              onChangeText={(newPassword) =>
                setForm((prev) => ({ ...prev, newPassword }))
              }
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.primaryButtonText}>Изменить пароль</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Управление аккаунтом</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Выйти из аккаунта</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAccount(user?.id as string)}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
            <Text style={styles.deleteText}>Удалить аккаунт</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Версия приложения 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
