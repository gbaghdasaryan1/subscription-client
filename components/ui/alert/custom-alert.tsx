import { FC } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import { AlertButton, CustomAlertProps } from "./types";

export const CustomAlert: FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
  onDismiss,
}) => {
  console.log("[CustomAlert] Rendered with visible:", visible, "title:", title);

  const handleButtonPress = (button: AlertButton) => {
    console.log("[Alert] Button pressed:", button.text);
    // Execute button action first if exists
    if (button.onPress) {
      console.log("[Alert] Calling button onPress");
      button.onPress();
    } else if (onDismiss) {
      // If no custom action, dismiss the alert
      console.log("[Alert] No onPress, calling onDismiss");
      onDismiss();
    }
  };

  if (!visible) {
    console.log("[CustomAlert] Not visible, returning null");
    return null;
  }

  console.log("[CustomAlert] Rendering modal");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        console.log("[Alert] onRequestClose called");
        if (onDismiss) {
          onDismiss();
        }
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            console.log("[Alert] Backdrop pressed");
            if (onDismiss) {
              onDismiss();
            }
          }}
        />
        <View style={styles.alertContainer}>
          {/* Add error icon for better visibility */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚠️</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === "cancel" && styles.cancelButton,
                  button.style === "destructive" && styles.destructiveButton,
                  buttons.length === 1 && styles.singleButton,
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "cancel" && styles.cancelButtonText,
                    button.style === "destructive" &&
                      styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
