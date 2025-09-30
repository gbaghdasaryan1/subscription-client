import { StyleSheet, View } from "react-native";
// import QRCode from 'react-native-qrcode-svg';


export const QrScreen = () => {

    return <View style={styles.container}>
        {/* <QRCode value={qrData} size={250}/> */}
    </View>
};

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: "center", justifyContent: "center"},
    title: {fontSize: 20, marginBottom: 20}
})