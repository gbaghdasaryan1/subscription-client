import { login } from "@/services/api";
import { navigate } from "expo-router/build/global-state/routing";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export const  LoginScreen = () => {
const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
});

const handleLogin = async () =>  {
    try {
        const res = await login(form.emailOrPhone, form.password);
        console.log(res?.data);
        navigate("/qr")
    } catch (error) {
        console.log(error);
    }
}
 

    return <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput style={styles.input} placeholder="Email or Phone" value={form.emailOrPhone} onChangeText={(emailOrPhone) => setForm((prev) => ({...prev, emailOrPhone})) }/>
        <TextInput style={styles.input} placeholder="Password" value={form.password}  onChangeText={(password) => setForm((prev) => ({...prev, password})) }/>

        <Button title="Login" onPress={handleLogin}/>
    </View>
};

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: "center", padding: 20},
    title: {fontSize: 24, marginBottom: 20, textAlign: "center"},
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        padding: 10,
        borderRadius: 5
    }
});