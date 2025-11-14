import { colors } from "@/constants/theme";
import React, { FC } from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import { styles } from "./styles";

type Props = {
  visible: boolean;
  text?: string;
};

export const Loading: FC<Props> = ({ visible, text = "Загрузка..." }) => {
  if (!visible) return null;

  return (
    <Modal
      style={{ backgroundColor: "red" }}
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};
