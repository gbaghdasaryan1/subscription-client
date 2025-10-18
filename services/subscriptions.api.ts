import api from "./axios-instance";

export const getSubscriptions = async (userId: string) => {
  try {
    const res = await api.get(`/subscriptions/${userId}`);
    return res.data;
  } catch (err: any) {
    console.error("Get subscriptions error:", err.response?.data);
    throw err;
  }
};
