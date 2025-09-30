import { ModalType, useModalStore } from "@/components/modal/store";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { openModal } = useModalStore();

  const handleOpenModal = () => {
    openModal(ModalType.OFFER_MODAL)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Добро пожаловать!</Text>
        <Text style={styles.welcomeSubtitle}>
          Оформите подписку и получайте эксклюзивные предложения каждый день
        </Text>
        <Link href={"/registration"} style={styles.primaryButton}>
          <Text style={styles.buttonText}>Начать регистрацию</Text>
        </Link>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenModal}>
          <Text style={styles.secondaryButtonText}>Условия использования</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  primaryButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
