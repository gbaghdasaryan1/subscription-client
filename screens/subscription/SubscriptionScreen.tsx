import { Alert } from "@/components/ui/alert/alert";
import { Loading } from "@/components/ui/loading/loading";
import { colors } from "@/constants/theme";
import { handleError } from "@/helper/error-handler";
import {
  createSubscription,
  getSubscriptionPlan,
  SubscriptionType,
} from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

const SubscriptionScreen = () => {
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [plan, setPlan] = useState<SubscriptionType | null>(null);

  useEffect(() => {
    loadSubscriptionPlan();
  }, []);

  const loadSubscriptionPlan = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionPlan();
      setPlan(data);
    } catch (error) {
      handleError(error, "Ошибка загрузки плана подписки");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!plan) return;

    Alert.alert(
      "Оформить подписку",
      `Подтвердите оформление подписки "${plan.name}" за ${plan.price} ₽`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Оформить",
          onPress: async () => {
            try {
              setSubscribing(true);
              const userData = await SecureStorageService.getUserData();

              if (!userData?.id) {
                Alert.alert(
                  "Ошибка",
                  "Не удалось получить данные пользователя",
                );
                return;
              }

              await createSubscription(plan.id, userData.id);
              Alert.alert("Успех", "Подписка успешно оформлена!");
              // TODO: integrate payment logic (СБП, ЮKassa, Тинькофф, etc.)
            } catch (error) {
              handleError(error, "Ошибка оформления подписки");
            } finally {
              setSubscribing(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>План подписки не найден</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadSubscriptionPlan}
          >
            <Text style={styles.retryButtonText}>Попробовать снова</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loading visible={subscribing} text="Оформление подписки..." />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{plan.name}</Text>
          <Text style={styles.subtitle}>{plan.description}</Text>
        </View>

        {/* Main Subscription Card */}
        <View style={styles.mainCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>₽</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>/{plan.durationDays} дней</Text>
          </View>

          {plan.discount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔥 Скидка {plan.discount}%</Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔥 Популярный выбор</Text>
            </View>
          )}

          {/* Subscription Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Длительность</Text>
                <Text style={styles.detailValue}>{plan.durationDays} дней</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🔄</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  Лимит использований в день
                </Text>
                <Text style={styles.detailValue}>
                  {plan.maxUsagesPerDay === -1
                    ? "Неограниченно"
                    : `${plan.maxUsagesPerDay} раз`}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Стоимость</Text>
                <Text style={styles.detailValue}>{plan.price} ₽</Text>
              </View>
            </View>
          </View>

          {/* Features List */}
          {plan.features && plan.features.length > 0 && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Что входит:</Text>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.button, !plan.isActive && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={!plan.isActive || subscribing}
          >
            <Text style={styles.buttonText}>
              {plan.isActive ? "Оформить подписку" : "Недоступно"}
            </Text>
          </TouchableOpacity>

          {!plan.isActive && (
            <Text style={styles.inactiveText}>
              Данный план временно недоступен
            </Text>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 Как это работает</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                Оформите подписку и произведите оплату
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                Подписка активируется на следующие сутки в 00:01
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                Используйте QR-код для покупок в течение {plan.durationDays}{" "}
                дней
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>4</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoText}>
                Получайте уведомления за 7 и 3 дня до окончания
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            💡 Подписка автоматически не продлевается. Вы можете продлить её в
            любое время.
          </Text>
        </View>

        {/* Creation Date */}
        <Text style={styles.createdText}>
          План создан:{" "}
          {new Date(plan.createdAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
