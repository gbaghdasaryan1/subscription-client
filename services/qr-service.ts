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
  const response = await api(`/qr/generate/${subscriptionId}`);
  return response.data;
};

export const getQr = async (subscriptionId: string) => {
  const res = await api.get(`/qr/use/${subscriptionId}`);
  return res.data;
};

export const markQrUsage = async (subscriptionId: string) => {
  const res = await api.get(`/qr/use/${subscriptionId}`);
  return res.data;
};
