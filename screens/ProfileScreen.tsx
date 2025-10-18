import React from "react";
import { Button, Text, View } from "react-native";

export default function ProfileScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text >Профиль</Text>
      <Text>ФИО: Иван Иванов</Text>
      <Text>Email: ivan@mail.ru</Text>
      <Text>Телефон: +7 999 999 99 99</Text>
      <Button title="Уведомления"  onPress={() => navigation.navigate("Notifications")} />
        
      <Button title="Выйти"  />
        
    </View>
  );
}
