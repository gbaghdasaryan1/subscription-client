import { Alert } from "@/components/ui/alert/alert";
import { colors } from "@/constants/theme";
import { handleError } from "@/helper/error-handler";
import { SecureStorageService } from "@/services/secure-storage-service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

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

  // Проверка активности подписки
  const checkSubscriptionActive = (sub: Subscription): boolean => {
    const now = new Date();
    const startDate = new Date(sub.startDate);
    const endDate = new Date(sub.endDate);

    return now >= startDate && now <= endDate;
  };

  // Обновление оставшегося времени
  const updateTimeLeft = useCallback(() => {
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
  }, [subscription]);

  // Генерация локального QR-кода (запасной вариант)
  const generateLocalQR = useCallback(
    (subscriptionId?: string) => {
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
    },
    [subscription?.id],
  );

  // Генерация QR-кода
  const generateQRCode = useCallback(
    async (subscriptionId?: string) => {
      try {
        const subId = subscriptionId || subscription?.id;
        if (!subId) return;
        setQrError(null);
      } catch (error) {
        handleError(error, "Ошибка генерации QR");
        setQrError("Не удалось сгенерировать QR-код");

        // Генерируем локальный QR-код как запасной вариант
        generateLocalQR(subscriptionId || subscription?.id);
      }
    },
    [subscription?.id, generateLocalQR],
  );

  // Загрузка статистики использования
  const loadUsageStats = useCallback(
    async (subscriptionId: string) => {
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
      } catch {
        // Используем локальные данные при ошибке
        setUsageStats({
          totalUsages: 0,
          usagesToday: 0,
          usagesThisWeek: 0,
          usagesThisMonth: 0,
          maxUsagesPerDay: subscription?.maxUsagesPerDay || 5,
          history: [],
        });
      }
    },
    [subscription?.maxUsagesPerDay],
  );

  // Загрузка всех данных
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setQrError(null);

      // Проверяем авторизацию
      const isAuth = await SecureStorageService.getAuthToken();

      if (!isAuth) {
        router.replace("/login");
        return;
      }

      // Загружаем подписку
      const subscriptionData = await SecureStorageService.getSubscription();

      if (!subscriptionData || !subscriptionData.id) {
        // Don't show alert, just set loading to false and show default QR
        setLoading(false);
        return;
      }

      // Проверяем активность подписки
      const isActive = checkSubscriptionActive(subscriptionData);
      if (!isActive) {
        // Subscription expired, still show the screen but with expired status
        setSubscription(subscriptionData);
        setLoading(false);
        return;
      }

      setSubscription(subscriptionData);

      // Генерируем QR-код
      await generateQRCode(subscriptionData.id);

      // Загружаем статистику
      await loadUsageStats(subscriptionData.id);
    } catch (error) {
      handleError(error, "Ошибка загрузки данных");
      setQrError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, [router, generateQRCode, loadUsageStats]);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Обновление таймера до окончания подписки
  useEffect(() => {
    if (subscription) {
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000); // Обновляем каждую минуту
      return () => clearInterval(interval);
    }
  }, [subscription, updateTimeLeft]);

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
  }, [qrData, generateQRCode]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [loadInitialData]);

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

  // if (loading && !subscription) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.centerContainer}>
  //         <ActivityIndicator size="large" color={colors.primary} />
  //         <Text style={styles.loadingText}>Загрузка QR-кода...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📱 Мой QR-код</Text>
          {subscription ? (
            <Text style={styles.headerSubtitle}>{subscription.planName}</Text>
          ) : (
            <Text style={styles.headerSubtitle}>
              Оформите подписку для доступа
            </Text>
          )}
        </View>

        {/* No Subscription State */}
        {!subscription ? (
          <View style={styles.noSubscriptionContainer}>
            <View style={styles.qrPlaceholderCard}>
              <View style={styles.qrImageWrapper}>
                <Image
                  source={require("../../assets/images/qr_test.png")}
                  style={styles.qrPlaceholderImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.placeholderTitle}>
                Пример QR-кода подписки
              </Text>
              <Text style={styles.placeholderText}>
                Оформите подписку, чтобы получить персональный QR-код для
                использования в магазинах-партнерах
              </Text>
            </View>

            <View style={styles.featuresCard}>
              <Text style={styles.featuresTitle}>✨ Что вы получите:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  Персональный QR-код для покупок
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>
                  Доступ ко всем магазинам-партнерам
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Статистика использования</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Безопасные транзакции</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => router.push("/subscriptions")}
            >
              <Text style={styles.subscribeButtonText}>
                🎯 Оформить подписку
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Статус подписки */}
            <View
              style={[styles.statusCard, { borderLeftColor: getStatusColor() }]}
            >
              <View style={styles.statusRow}>
                <View style={styles.statusLabelContainer}>
                  <Text style={styles.statusIcon}>
                    {daysLeft > 0 ? "✅" : "⏰"}
                  </Text>
                  <Text style={styles.statusLabel}>Статус:</Text>
                </View>
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
                <View style={styles.statusLabelContainer}>
                  <Text style={styles.statusIcon}>📅</Text>
                  <Text style={styles.statusLabel}>Осталось:</Text>
                </View>
                <Text style={[styles.statusValue, { color: getStatusColor() }]}>
                  {timeUntilExpiry}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Начало</Text>
                  <Text style={styles.dateValue}>
                    {new Date(subscription.startDate).toLocaleDateString(
                      "ru-RU",
                    )}
                  </Text>
                </View>
                <View style={styles.dateSeparator} />
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>Окончание</Text>
                  <Text style={styles.dateValue}>
                    {new Date(subscription.endDate).toLocaleDateString("ru-RU")}
                  </Text>
                </View>
              </View>
            </View>

            {/* QR-код */}
            <View style={styles.qrCard}>
              <Text style={styles.qrTitle}>
                {daysLeft > 0
                  ? "🎫 Покажите QR-код на кассе"
                  : "⚠️ Подписка истекла"}
              </Text>

              <LinearGradient
                colors={[colors.primary + "20", colors.secondary + "20"]}
                style={styles.qrGradientWrapper}
              >
                <View style={styles.qrWrapper}>
                  <Image
                    source={require("../../assets/images/qr_test.png")}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                </View>
              </LinearGradient>

              {daysLeft > 0 ? (
                <>
                  <View style={styles.qrInfo}>
                    <Text style={styles.qrInfoText}>
                      🔒 Не передавайте код третьим лицам
                    </Text>
                    {qrData && (
                      <Text style={styles.qrExpiry}>
                        Действителен до:{" "}
                        {new Date(qrData.expiresAt).toLocaleString("ru-RU")}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={handleRefreshQR}
                    disabled={loading}
                  >
                    <Text style={styles.refreshButtonText}>
                      🔄 Обновить QR-код
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.renewButtonInline}
                  onPress={() => router.push("/subscriptions")}
                >
                  <Text style={styles.renewButtonText}>
                    ⭐ Продлить подписку
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
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
