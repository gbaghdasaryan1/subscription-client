import { ModalType, useModalStore } from "@/components/modal/store";
import { Alert } from "@/components/ui/alert/alert";
import { Loading } from "@/components/ui/loading/loading";
import { handleError } from "@/helper/error-handler";
import { getVerificationCode } from "@/services";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

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
  const [loading, setLoading] = useState(false);
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
    // Validate required fields first
    if (!form.fullName.trim()) {
      Alert.alert("Ошибка валидации", "Введите полное имя");
      return;
    }

    if (!form.email.trim() && !form.phone.trim()) {
      Alert.alert("Ошибка валидации", "Введите email или телефон");
      return;
    }

    if (!form.password || form.password.length < 6) {
      Alert.alert("Ошибка валидации", "Пароль должен быть не менее 6 символов");
      return;
    }

    if (!form.acceptTerms) {
      Alert.alert("Ошибка", "Примите условия использования");
      return;
    }

    setLoading(true);
    try {
      // Send verification code first
      if (form.email) {
        await getVerificationCode(form.email.toLocaleLowerCase(), "mail");
      } else {
        await getVerificationCode(form.phone, "sms");
      }

      // Only open modal after successful API call
      openModal(ModalType.OTP_MODAL, {
        form,
        setCode: (otp: string) => setForm((prev) => ({ ...prev, code: otp })),
      });
    } catch (error) {
      handleError(error, "Ошибка отправки кода");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loading visible={loading} text="Отправка кода..." />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.background}>
          <View style={styles.container}>
            <Text style={styles.title}> Регистрация</Text>
            <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>

            <TextInput
              style={styles.input}
              placeholder="Full name *"
              value={form.fullName}
              placeholderTextColor="#888"
              onChangeText={(fullName) =>
                setForm({ ...form, fullName: fullName.trim() })
              }
            />

            <View
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 12,
                padding: 10,
                marginBottom: 15,
              }}
            >
              <TextInput
                style={styles.input}
                placeholder="Телефон (+XXX XXX XX XX XXX)"
                value={form.phone}
                onChangeText={(phone) =>
                  setForm({ ...form, phone: phone.trim() })
                }
                keyboardType="phone-pad"
                placeholderTextColor="#888"
              />

              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 10,
                  fontWeight: "500",
                }}
              >
                Или
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email (example@mail.com)"
                value={form.email}
                onChangeText={(email) =>
                  setForm({ ...form, email: email.toLowerCase().trim() })
                }
                keyboardType="email-address"
                placeholderTextColor="#888"
              />
            </View>

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
      </KeyboardAvoidingView>
    </>
  );
};
