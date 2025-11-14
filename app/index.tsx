import { colors } from "@/constants/theme";
import { SecureStorageService } from "@/services/secure-storage-service";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface QuickActionCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  color: string;
}

export const HomeScreen = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const quickActions: QuickActionCard[] = [
    {
      id: "1",
      title: "QR Код",
      icon: "📱",
      description: "Мой QR код для скидок",
      route: "/qr",
      color: colors.primary,
    },
    {
      id: "2",
      title: "Подписки",
      icon: "💳",
      description: "Управление подпиской",
      route: "/subscriptions",
      color: "#34C759",
    },
    {
      id: "3",
      title: "Профиль",
      icon: "👤",
      description: "Личные данные",
      route: "/profile",
      color: "#FF9500",
    },
  ];

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
  }, []);

  const renderQuickAction = (action: QuickActionCard) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={() => router.push(action.route as any)}
    >
      <View
        style={[styles.actionIconContainer, { backgroundColor: action.color }]}
      >
        <Text style={styles.actionIcon}>{action.icon}</Text>
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionDescription}>{action.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3063/3063828.png",
              }}
              style={styles.image}
            />
          </View>

          <Text style={styles.title}>Добро пожаловать!</Text>
          <Text style={styles.subtitle}>
            Получайте эксклюзивные предложения, скидки и привилегии с нашей
            подпиской.
          </Text>
        </View>

        {/* Quick Actions - Only for authenticated users */}
        {isAuthenticated && (
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Быстрый доступ</Text>
            <View style={styles.actionsList}>
              {quickActions.map((action) => renderQuickAction(action))}
            </View>
          </View>
        )}

        {/* Features Card */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Почему стоит выбрать нас</Text>
          <View style={styles.card}>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>🎁</Text>
              <Text style={styles.featureText}>
                Ежедневные уникальные купоны
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>⭐</Text>
              <Text style={styles.featureText}>
                Доступ к специальным предложениям
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={styles.featureText}>
                Экономия до 40% на покупках
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={styles.featureText}>
                Поддержка 24/7 и гарантия возврата
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttons}>
          {!isAuthenticated ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/registration")}
              >
                <Text style={styles.primaryText}>Создать аккаунт</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.secondaryText}>Войти</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => router.push("/subscriptions")}
            >
              <Text style={styles.subscribeText}>
                💎 Оформить подписку сейчас
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 50,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || "#666",
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 15,
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.textSecondary || "#666",
  },
  chevron: {
    fontSize: 28,
    color: colors.textSecondary || "#666",
    fontWeight: "300",
  },
  featuresSection: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  buttons: {
    width: "100%",
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "600",
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subscribeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default HomeScreen;
