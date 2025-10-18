import { ModalType, useModalStore } from "@/components/modal/store";
import { colors } from "@/constants/theme";
import { getVerificationCode } from "@/services";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
export type RegistrationForm = {
  fullName: string;
  phone: string;
  email: string;
  gender: "male" | "female";
  password: string;
  code: string;
  acceptTerms: boolean;
};

export const RegistrationScreen = () => {
  const [form, setForm] = useState<RegistrationForm>({
    fullName: "",
    phone: "",
    email: "",
    gender: "male",
    password: "",
    code: "",
    acceptTerms: false,
  });
  const { openModal } = useModalStore();


  const handleVerifyEmailOrPhone = async () => {
    openModal(ModalType.OTP_MODAL, {
      form,
      setCode: (otp: string) => setForm((prev) => ({ ...prev, code: otp })),
    });
    try {
      if(form.password && form.fullName){
        if (form.email) {
        await getVerificationCode(form.email, "mail");
      } else {
        await getVerificationCode(form.phone, "sms");
      }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.screenTitle}> Регистрация</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full name *"
              value={form.fullName}
              placeholderTextColor="#888"
              onChangeText={(fullName) => setForm({ ...form, fullName })}
            />

            <TextInput
              style={styles.input}
              placeholder="Телефон *"
              value={form.phone}
              onChangeText={(phone) => setForm({ ...form, phone })}
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />

            <TextInput
              style={styles.input}
              placeholder="Password *"
              value={form.password}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholderTextColor="#888"
            />

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Пол:</Text>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  form.gender === "male" && styles.genderButtonActive,
                ]}
                onPress={() => setForm({ ...form, gender: "male" })}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    form.gender === "male" && styles.genderButtonTextActive,
                  ]}
                >
                  Мужской
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  form.gender === "female" && styles.genderButtonActive,
                ]}
                onPress={() => setForm({ ...form, gender: "female" })}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    form.gender === "female" && styles.genderButtonTextActive,
                  ]}
                >
                  Женский
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <Switch
                value={form.acceptTerms}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, acceptTerms: value }))
                }
              />
              <TouchableOpacity>
                <Text style={styles.termsText}>
                  Согласен с условиями использования и политикой
                  конфиденциальности
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleVerifyEmailOrPhone}
            >
              <Text style={styles.buttonText}>Зарегистрироваться</Text>
            </TouchableOpacity>

            <Link href="/login" style={styles.haveAccount}>
              Already have account <Text>Login</Text>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  verificationBlock: {
    position: "absolute",
    left: 0,
    top: 0,
    height: height,
    width,
    backgroundColor: "rgba(0,0,0,0.1)", // semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // make sure it’s above other content
  },
  verificationWrapper: {
    gap: 12,
    padding: 30,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  verificationInput: {
    width: 200,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderColor: colors.textSecondary,
    backgroundColor: colors.white,
  },
  scrollContainer: {},
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: colors.text,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: colors.textSecondary,
    backgroundColor: colors.white,
  },

  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  genderLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 15,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: "red",
  },

  genderButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  genderButtonTextActive: {
    color: colors.white,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  haveAccount: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
