import { Alert } from "@/components/ui/alert/alert";
import { Loading } from "@/components/ui/loading/loading";
import { RegistrationForm } from "@/screens/registration/RegistrationScreen";
import { registration, verifyOtp } from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import { useRouter } from "expo-router";
import { FC, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useModalStore } from "../../store";
import { styles } from "./styles";

export const OtpModal: FC = () => {
  const router = useRouter();

  const { meta, closeModal } = useModalStore();
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { form } = meta as {
    form: RegistrationForm;
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert("Ошибка валидации", "Введите код подтверждения");
      return;
    }

    const target = form.email || form.phone;
    setLoading(true);

    try {
      const verified = await verifyOtp(target, otp);

      if (verified) {
        const res = await registration(form);

        await SecureStorageService.saveAuthToken(res.access_token);
        if (res.user) {
          await SecureStorageService.saveUserData(res.user);
        }
        setLoading(false);
        router.replace("/profile");
      } else {
        setLoading(false);
        Alert.alert("Ошибка", "Неверный код подтверждения");
      }
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <Modal animationType="fade" transparent visible>
      <Loading visible={loading} text="Проверка кода..." />
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
