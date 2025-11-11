import { colors } from "@/constants/theme";
import { FC } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useModalStore } from "../store";

export const OfferModal: FC = () => {
  const { closeModal } = useModalStore();

  return (
    <View style={styles.overlay}>
      <View style={styles.modalWrapper}>
        <Text style={styles.modalTitle}>Условия использования</Text>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
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

        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>Понятно</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalWrapper: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: colors.textSecondary || "#444",
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
