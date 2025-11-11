import { colors } from "@/constants/theme";
import { RegistrationForm } from "@/screens/RegistrationScreen";
import { registration, verifyOtp } from "@/services";
import { navigate } from "expo-router/build/global-state/routing";
import { FC, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useModalStore } from "../store";

export const OtpModal: FC = () => {
  const { meta, closeModal } = useModalStore();
  const [otp, setOtp] = useState<string>("");

  const { form } = meta as {
    form: RegistrationForm;
  };

  const handleVerifyOtp = async () => {
    const target = form.email || form.phone;

    try {
      const verified = await verifyOtp(target, otp);

      if (verified) {
        await registration(form);
        Alert.alert("Успех", "Регистрация завершена успешно!");
        navigate("/login");
      } else {
        Alert.alert("Ошибка", "Неверный код подтверждения");
      }
    } catch (error: any) {
      console.log(error?.response);
      Alert.alert("Ошибка", "Не удалось подтвердить код");
    } finally {
      closeModal();
    }
  };

  return (
    <Modal animationType="fade" transparent visible>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          <Text style={styles.title}>Подтверждение кода</Text>
          <Text style={styles.subtitle}>
            Введите код, отправленный на{" "}
            <Text style={styles.boldText}>{form.email || form.phone}</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Введите код"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            placeholderTextColor="#888"
            maxLength={6}
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleVerifyOtp}
          >
            <Text style={styles.buttonText}>Подтвердить</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.closeText}>Отменить</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 25,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  closeText: {
    color: "#888",
    textAlign: "center",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
