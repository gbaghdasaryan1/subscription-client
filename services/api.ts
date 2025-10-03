import axios from "axios";

const API_BASE = "http://172.20.10.6:5050";

const api = axios.create({
  baseURL: API_BASE, // replace with backend URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // Example: attach JWT token if exists
    // const token = await SecureStore.getItemAsync("token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const login = async (emailOrPhone: string, password: string) => {
  try {
    const res = await axios.post("http://localhost:5050/auth/login", {
      emailOrPhone,
      password,
    });
    return res;
  } catch (err:any) {
    console.log("Error response:", err.response?.data);
  }
};

export type RegisterDto = {
  fullName: string;
  phone: string;
  email: string;
  gender: "male" | "female";
  password: string;
  acceptTerms: boolean;
  code?: string;
};

export const registration = async (registerDto: RegisterDto) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/register`, registerDto);
    console.log(res);

    return res.data;
  } catch (err: any) {
    console.log("Error response:", err.response?.data);
  }
};

export const getVerificationCode = async (
  emailOrPhone: string,
  method: "sms" | "mail",
) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/verification-otp`, {
      emailOrPhone,
      method,
    });
    return res.data;
  } catch (err: any) {
    console.log("Error response:", err.response?.data);
  }
};

export const verifyOtp = async (target: string, otp: string) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/verify-otp`, {
      target,
      otp,
    });
    return res.data;
  } catch (err: any) {
    console.log("Error response:", err.response?.data);
  }
};

export const getSubscriptions = async (userId: string) => {
  try {
    const res = await axios.get(
      `http://localhost:5050/subscriptions/${userId}`,
    );
    return res.data;
  } catch (err: any) {
    console.log("Error response:", err.response?.data);
  }
};
