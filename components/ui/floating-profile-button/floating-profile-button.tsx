import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export const FloatingProfileButton = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => router.push("/profile")}
      >
        <Ionicons name="person-circle-outline" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};
