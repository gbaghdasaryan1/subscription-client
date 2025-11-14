import { FC } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useModalStore } from "../../store";
import { styles } from "./styles";

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
