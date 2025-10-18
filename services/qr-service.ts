import api from "./axios-instance";

export interface QRGenerateResponse {
  qrCode: string;
  generatedAt: string;
  expiresAt: string;
  subscriptionId: string;
}

export const generateQR = async (
  subscriptionId: string,
): Promise<QRGenerateResponse> => {
  try {
    const response = await api(`/qr/generate/${subscriptionId}`);

    return response.data;
  } catch (error) {
    console.error("Ошибка generateQR:", error);
    throw error;
  }
};

export const getQr = async (subscriptionId: string) => {
  try {
    const res = await api.get(`/qr/use/${subscriptionId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const markQrUsage = async (subscriptionId: string) => {
  try {
    const res = await api.get(`/qr/use/${subscriptionId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
