import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");

  const handleSubscribe = () => {
    Alert.alert("Подписка", `Вы выбрали план: ${selectedPlan}`);
    // TODO: integrate payment logic (СБП, ЮKassa, Тинькофф, etc.)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Подписка</Text>
      <Text style={styles.subtitle}>
        Выберите подходящий план, чтобы получать доступ к покупкам.
      </Text>

      {/* Subscription Plans */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            <Text
              style={[
                styles.planName,
                selectedPlan === plan.id && styles.selectedText,
              ]}
            >
              {plan.name}
            </Text>
            <Text
              style={[
                styles.planPrice,
                selectedPlan === plan.id && styles.selectedText,
              ]}
            >
              {plan.price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subscribe Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Оформить подписку</Text>
      </TouchableOpacity>

      {/* Info Section */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Детали подписки</Text>
        <Text style={styles.infoText}>
          • Начало: на следующие сутки в 00:01
        </Text>
        <Text style={styles.infoText}>
          • Окончание: по выбранному плану (7 / 30 / 365 дней)
        </Text>
        <Text style={styles.infoText}>
          • Уведомления: за 3 дня и за неделю до окончания
        </Text>
      </View>
    </SafeAreaView>
  );
};

const plans = [
  { id: "weekly", name: "Еженедельная", price: "199₽ / неделя" },
  { id: "monthly", name: "Месячная", price: "599₽ / месяц" },
  { id: "yearly", name: "Годовая", price: "4999₽ / год" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginVertical: 10,
  },
  plansContainer: {
    marginTop: 20,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  planCardSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
  },
  planPrice: {
    fontSize: 15,
    color: "#555",
  },
  selectedText: {
    color: "#fff",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  infoBox: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
});

export default SubscriptionScreen;
