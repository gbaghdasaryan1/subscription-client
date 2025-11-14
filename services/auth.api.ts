import api from "./axios-instance";
import { UserDataType } from "./secure-storage-service";

export type LoginResponse = {
  access_token: string;
  user: UserDataType;
};

export type RegistrationResponse = {
  access_token: string;
  user: UserDataType;
};

export const login = async (emailOrPhone: string, password: string) => {
  const res = await api.post<LoginResponse>("/auth/login", {
    emailOrPhone,
    password,
  });
  return res.data;
};

export const registration = async (registerDto: RegisterDto) => {
  const res = await api.post<RegistrationResponse>(
    "/auth/register",
    registerDto,
  );
  return res.data;
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

export const deleteAccount = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const getVerificationCode = async (
  emailOrPhone: string,
  method: "sms" | "mail",
) => {
  const res = await api.post("/auth/verification-otp", {
    emailOrPhone,
    method,
  });
  return res.data;
};

export const verifyOtp = async (target: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { target, otp });
  return res.data;
};
