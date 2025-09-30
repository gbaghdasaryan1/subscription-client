import { colors } from "@/constants/theme";
import { RegistrationForm } from "@/screens/RegistrationScreen";
import { registration, verifyOtp } from "@/services/api";
import { FC } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useModalStore } from "../store";

export const OtpModal: FC = () => {
  const { meta, closeModal } = useModalStore();

  const { setCode, form } = meta as {
    setCode: (otp: string) => void;
    form: RegistrationForm;
  };

  const handleVerifyOtp = async () => {
    const target = form.email || form.phone;

    try {
      const verified = await verifyOtp(target, form.code);
      if (verified) {
        await registration(form);
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }finally{
      closeModal()
    }
  };

  return (
    <ScrollView style={styles.modalContainer}>
      <View style={styles.verificationWrapper}>
        <Text>Напишите коде </Text>
        <TextInput
          style={styles.verificationInput}
          placeholder="Напишите коде "
          onChangeText={(otp) => setCode(otp)}
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleVerifyOtp}
        >
          <Text style={styles.buttonText}>
            Send
          </Text>
        </TouchableOpacity>

        <Button title="Close modal" onPress={closeModal}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  verificationBlock: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, 
  },
  verificationWrapper: {
    gap: 12,
    padding: 30,
    backgroundColor: colors.white,
  },
  verificationInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderColor: colors.textSecondary,
    backgroundColor: colors.white,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
});
