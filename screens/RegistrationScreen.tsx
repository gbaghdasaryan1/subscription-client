import { ModalType, useModalStore } from "@/components/modal/store";
import { colors } from "@/constants/theme";
import { getVerificationCode } from "@/services";
import { SecureStorageService } from "@/services/secure-storage-service";
import { Link } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await SecureStorageService.isAuthenticated();
        if (isAuthenticated) {
          navigate("/qr");
        }
      } catch (err: any) {
        console.debug("Auth check error:", err);
      }
    };

    void checkAuth();
  }, []);

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
      if (form.password && form.fullName) {
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.background}>
          {/* <ScrollView style={styles.scrollContainer}> */}
          <View style={styles.container}>
            <Text style={styles.title}> Регистрация</Text>
            <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>

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
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  setForm((prev) => ({
                    ...prev,
                    acceptTerms: !prev.acceptTerms,
                  }))
                }
              >
                <Text style={styles.termsText}>
                  Согласен с условиями использования и политикой
                  конфиденциальности
                </Text>
              </TouchableOpacity>
              <Switch
                value={form.acceptTerms}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, acceptTerms: value }))
                }
              />
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
        </View>

        {/* </ScrollView> */}
      </KeyboardAvoidingView>
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
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.9)", // slightly transparent for background image
    margin: 20,
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
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
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
    width: "100%",
  },
  termsText: {
    flex: 1,
    flexShrink: 1, // prevents overflow on smaller screens
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
