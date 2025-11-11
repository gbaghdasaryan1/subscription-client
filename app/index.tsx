import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Product Illustration */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3063/3063828.png",
          }}
          style={styles.image}
        />
      </View>

      {/* Title and Description */}
      <Text style={styles.title}>Добро пожаловать!</Text>
      <Text style={styles.subtitle}>
        Получайте эксклюзивные предложения, скидки и привилегии с нашей
        подпиской.
      </Text>

      {/* Product Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Почему стоит выбрать нас:</Text>
        <Text style={styles.cardText}>• Ежедневные уникальные купоны</Text>
        <Text style={styles.cardText}>• Доступ к специальным предложениям</Text>
        <Text style={styles.cardText}>• Экономия до 40% на покупках</Text>
        <Text style={styles.cardText}>
          • Поддержка 24/7 и гарантия возврата
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.buttons}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || "#666",
    textAlign: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  cardText: {
    fontSize: 15,
    color: colors.textSecondary || "#666",
    marginBottom: 4,
  },
  buttons: {
    width: "100%",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
