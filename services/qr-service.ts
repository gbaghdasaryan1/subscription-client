import { api } from "./api";

export const generateQr = async (subscriptionId: string) => {
    try {
        const res = await api.get(`/qr/generate/${subscriptionId}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getQr = async (subscriptionId: string) => {
    try {
        const res = await api.get(`/qr/use/${subscriptionId}`);
            return res.data;
    } catch (error) {
        console.log(error);
    }
};
