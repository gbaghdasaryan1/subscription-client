import api from "./axios-instance";

export const login = async (emailOrPhone: string, password: string) => {
  try {
    const res = await api.post("/auth/login", { emailOrPhone, password });
    return res.data;
  } catch (err: any) {
    console.error("Login error:", err?.response?.data);
  }
};

export const changePassword = async () => {
  console.log("change password service");
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
    const res = await api.post("/auth/register", registerDto);
    return res.data;
  } catch (err: any) {
    console.error("Registration error:", err.response?.data);
    throw err;
  }
};

export const getVerificationCode = async (
  emailOrPhone: string,
  method: "sms" | "mail",
) => {
  try {
    const res = await api.post("/auth/verification-otp", {
      emailOrPhone,
      method,
    });
    return res.data;
  } catch (err: any) {
    console.error("Verification code error:", err.response?.data);
  }
};

export const verifyOtp = async (target: string, otp: string) => {
  try {
    const res = await api.post("/auth/verify-otp", { target, otp });
    return res.data;
  } catch (err: any) {
    console.error("OTP verification error:", err.response?.data);
    throw err;
  }
};
