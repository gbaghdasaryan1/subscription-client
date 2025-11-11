import { FloatingProfileButton } from "@/components/floating-profile-button";
import { colors } from "@/constants/theme";

import { SecureStorageService } from "@/services/secure-storage-service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Subscription {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxUsagesPerDay?: number;
}

interface QRData {
  qrCode: string;
  generatedAt: string;
  expiresAt: string;
  subscriptionId: string;
}

interface UsageStats {
  totalUsages: number;
  usagesToday: number;
  usagesThisWeek: number;
  usagesThisMonth: number;
  maxUsagesPerDay: number;
  history: {
    usedAt: string;
    location?: string;
  }[];
}

export default function QRScreen() {
  const router = useRouter();

  // Состояния
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState("");
  const [daysLeft, setDaysLeft] = useState(0);
  const [qrError, setQrError] = useState<string | null>(null);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadInitialData();
  }, []);

  // Обновление таймера до окончания подписки
  useEffect(() => {
    if (subscription) {
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // Обновляем каждую минуту
      return () => clearInterval(interval);
    }
  }, [subscription]);

  // Автоматическое обновление QR каждые 24 часа
  useEffect(() => {
    if (qrData) {
      const checkExpiry = setInterval(() => {
        const now = new Date();
        const expiry = new Date(qrData.expiresAt);

        if (now >= expiry) {
          generateQRCode();
        }
      }, 60000); // Проверяем каждую минуту

      return () => clearInterval(checkExpiry);
    }
  }, [qrData]);

  // Загрузка всех данных
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setQrError(null);

      // Проверяем авторизацию
      const isAuth = await SecureStorageService.getAuthToken();
      console.log(isAuth, "is auth");

      if (!isAuth) {
        router.replace("/login");
        return;
      }

      // Загружаем подписку
      const subscriptionData = await SecureStorageService.getSubscription();

      if (!subscriptionData || !subscriptionData.id) {
        Alert.alert(
          "Подписка не найдена",
          "Оформите подписку для доступа к QR-коду",
          [
            {
              text: "Оформить подписку",
              onPress: () => router.push("/profile"),
            },
          ],
        );
        return;
      }

      // Проверяем активность подписки
      const isActive = checkSubscriptionActive(subscriptionData);
      if (!isActive) {
        Alert.alert(
          "Подписка истекла",
          "Продлите подписку для продолжения использования",
          [
            {
              text: "Продлить",
              onPress: () => router.push("/profile"),
            },
          ],
        );
        return;
      }

      setSubscription(subscriptionData);

      // Генерируем QR-код
      await generateQRCode(subscriptionData.id);

      // Загружаем статистику
      await loadUsageStats(subscriptionData.id);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setQrError("Не удалось загрузить данные");
      Alert.alert("Ошибка", "Не удалось загрузить данные. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Проверка активности подписки
  const checkSubscriptionActive = (sub: Subscription): boolean => {
    const now = new Date();
    const startDate = new Date(sub.startDate);
    const endDate = new Date(sub.endDate);

    return now >= startDate && now <= endDate;
  };

  // Генерация QR-кода
  const generateQRCode = async (subscriptionId?: string) => {
    try {
      const subId = subscriptionId || subscription?.id;
      if (!subId) return;

      const token = await SecureStorageService.getAuthToken();
      console.log(token);

      // const response = await fetch(
      //   `https://your-api.com/qr/generate/${subId}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   },
      // );

      // if (!response.ok) {
      //   throw new Error("Не удалось сгенерировать QR-код");
      // }

      // const data = await response.json();
      // setQrData(data);
      setQrError(null);
    } catch (error) {
      console.error("Ошибка генерации QR:", error);
      setQrError("Не удалось сгенерировать QR-код");

      // Генерируем локальный QR-код как запасной вариант
      generateLocalQR(subscriptionId || subscription?.id);
    }
  };

  // Генерация локального QR-кода (запасной вариант)
  const generateLocalQR = (subscriptionId?: string) => {
    const subId = subscriptionId || subscription?.id;
    if (!subId) return;

    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 часа
    const randomSalt = Math.random().toString(36).substring(7);

    setQrData({
      qrCode: `${subId}_${now.toDateString()}_${randomSalt}`,
      generatedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      subscriptionId: subId,
    });
  };

  // Загрузка статистики использования
  const loadUsageStats = async (subscriptionId: string) => {
    try {
      const token = await SecureStorageService.getAuthToken();
      const response = await fetch(
        `https://your-api.com/qr/usages/${subscriptionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUsageStats(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
      // Используем локальные данные
      setUsageStats({
        totalUsages: 0,
        usagesToday: 0,
        usagesThisWeek: 0,
        usagesThisMonth: 0,
        maxUsagesPerDay: subscription?.maxUsagesPerDay || 5,
        history: [],
      });
    }
  };

  // Обновление оставшегося времени
  const updateTimeLeft = () => {
    if (!subscription) return;

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysLeft(days);

    if (days <= 0) {
      setTimeUntilExpiry("Подписка истекла");
    } else if (days === 1) {
      setTimeUntilExpiry("Истекает сегодня");
    } else if (days <= 3) {
      setTimeUntilExpiry(`${days} дня`);
    } else if (days <= 7) {
      setTimeUntilExpiry(`${days} дней`);
    } else {
      setTimeUntilExpiry(`${days} дней`);
    }
  };

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, []);

  // Ручное обновление QR
  const handleRefreshQR = async () => {
    if (!subscription?.id) return;

    Alert.alert("Обновить QR-код?", "Текущий QR-код станет недействительным", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Обновить",
        onPress: async () => {
          setLoading(true);
          await generateQRCode(subscription.id);
          setLoading(false);
          Alert.alert("Готово", "QR-код обновлен");
        },
      },
    ]);
  };

  // Получение цвета статуса
  const getStatusColor = () => {
    if (daysLeft <= 0) return colors.error;
    if (daysLeft <= 3) return colors.warning;
    return colors.success;
  };

  // Проверка лимита использований
  const isUsageLimitReached = () => {
    if (!usageStats) return false;
    return usageStats.usagesToday >= usageStats.maxUsagesPerDay;
  };

  if (loading && !subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Загрузка QR-кода...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FloatingProfileButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Мой QR-код</Text>
          <Text style={styles.headerSubtitle}>
            {subscription?.planName || "Подписка"}
          </Text>
        </View>

        {/* Статус подписки */}
        <View
          style={[styles.statusCard, { borderLeftColor: getStatusColor() }]}
        >
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Статус:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {daysLeft > 0 ? "Активна" : "Истекла"}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Осталось:</Text>
            <Text style={[styles.statusValue, { color: getStatusColor() }]}>
              {timeUntilExpiry}
            </Text>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Начало</Text>
              <Text style={styles.dateValue}>
                {new Date(subscription?.startDate || "").toLocaleDateString(
                  "ru-RU",
                )}
              </Text>
            </View>
            <View style={styles.dateSeparator} />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Окончание</Text>
              <Text style={styles.dateValue}>
                {new Date(subscription?.endDate || "").toLocaleDateString(
                  "ru-RU",
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* QR-код */}
        {qrData && !qrError ? (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Покажите QR-код на кассе</Text>

            <LinearGradient
              colors={[colors.primary + "20", colors.secondary + "20"]}
              style={styles.qrGradientWrapper}
            >
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrData.qrCode}
                  size={SCREEN_WIDTH * 0.6}
                  backgroundColor="white"
                  color={colors.primary}
                />
              </View>
            </LinearGradient>

            <View style={styles.qrInfo}>
              <Text style={styles.qrInfoText}>
                ⚠️ Не передавайте код третьим лицам
              </Text>
              <Text style={styles.qrExpiry}>
                Действителен до:{" "}
                {new Date(qrData.expiresAt).toLocaleString("ru-RU")}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefreshQR}
              disabled={loading}
            >
              <Text style={styles.refreshButtonText}>🔄 Обновить QR-код</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>❌ {qrError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => generateQRCode(subscription?.id)}
            >
              <Text style={styles.retryButtonText}>Попробовать снова</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Статистика использования */}
        {usageStats && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Использование сегодня</Text>

            <View style={styles.usageProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (usageStats.usagesToday / usageStats.maxUsagesPerDay) *
                        100
                      }%`,
                      backgroundColor: isUsageLimitReached()
                        ? colors.error
                        : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.usageText}>
                {usageStats.usagesToday} из {usageStats.maxUsagesPerDay}
              </Text>
            </View>

            {isUsageLimitReached() && (
              <View style={styles.limitWarning}>
                <Text style={styles.limitWarningText}>
                  ⚠️ Дневной лимит исчерпан
                </Text>
              </View>
            )}

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {usageStats.usagesThisWeek}
                </Text>
                <Text style={styles.statLabel}>На этой неделе</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {usageStats.usagesThisMonth}
                </Text>
                <Text style={styles.statLabel}>В этом месяце</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{usageStats.totalUsages}</Text>
                <Text style={styles.statLabel}>Всего</Text>
              </View>
            </View>

            {/* История использования */}
            {usageStats.history && usageStats.history.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>
                  📝 Последние использования
                </Text>
                {usageStats.history.slice(0, 5).map((item, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyDate}>
                      {new Date(item.usedAt).toLocaleString("ru-RU")}
                    </Text>
                    {item.location && (
                      <Text style={styles.historyLocation}>
                        📍 {item.location}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Кнопка продления */}
        {daysLeft <= 7 && (
          <TouchableOpacity
            style={styles.renewButton}
            onPress={() => router.push("/subscriptions")}
          >
            <Text style={styles.renewButtonText}>⭐ Продлить подписку</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dateItem: {
    flex: 1,
  },
  dateSeparator: {
    width: 1,
    height: 40,
    backgroundColor: colors.background,
    marginHorizontal: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  qrGradientWrapper: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  qrWrapper: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  qrInfo: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  qrInfoText: {
    fontSize: 14,
    color: colors.warning,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  qrExpiry: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  errorCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  usageProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  usageText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
  },
  limitWarning: {
    backgroundColor: colors.error + "20",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  limitWarningText: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  historySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    marginBottom: 4,
  },
  historyLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  renewButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  renewButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
