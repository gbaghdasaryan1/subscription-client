import { StyleSheet, Text, View } from "react-native";

export const  LoginScreen = () => {

 

    return <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        {/* <TextInput style={styles.input} placeholder="Email or Phone" value={emailOrPhone} onChangeText={setEmailOrPhone}/> */}
        {/* <TextInput style={styles.input} placeholder="Password" value={password}  onChangeText={setPassword}/> */}

        {/* <Button title="Login" onPress={handleLogin}/> */}
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