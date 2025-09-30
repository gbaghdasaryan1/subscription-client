import { colors } from "@/constants/theme";
import { FC } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { useModalStore } from "../store";



export const OfferModal:FC= () => {
  const { closeModal } = useModalStore();

  return (
      <ScrollView style={styles.modalContainer}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Условия использования</Text>
          <Text style={styles.modalText}>
            1. Настоящее соглашение регулирует использование мобильного
            приложения.{"\n\n"}
            2. Подписка активируется на следующий день в 00:01.{"\n\n"}
            3. Количество чеков ограничено согласно выбранному тарифу.{"\n\n"}
            4. QR-код генерируется ежедневно и предназначен только для личного
            использования.{"\n\n"}
            5. Передача QR-кода третьим лицам запрещена.{"\n\n"}
            6. Компания оставляет за собой право изменять условия.{"\n\n"}
            7. При нарушении условий подписка может быть аннулирована.
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
          <Text style={styles.buttonText}>Закрыть</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    margin: 20,
  },
});
