import api from "../utils/axios";

const baseURL = import.meta.env.VITE_API_URL;

export const signupApi = async (userData) => {
  const response = await api.post(baseURL + "/auth/signup", userData);

  return response.data;
};

export const loginApi = async (userData) => {
  const response = await api.post(baseURL + "/auth/login", userData);

  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfileApi = async (userData) => {
  const response = await api.patch("/auth/profile", userData);
  return response.data;
};

export const changePasswordApi = async (data) => {
  const response = await api.patch("/auth/changePassword", data);

  return response.data;
};

export const updateTheme = async (theme) => {
  const response = await api.patch("/auth/profile", {
    theme,
  });

  return response.data;
};

export const sendPasswordResetOtp = async ({ emailId }) => {
  return api.post("/auth/forgot-password/send-otp", {
    emailId,
  });
};

export const verifyPasswordResetOtp = async ({ emailId, otp }) => {
  const response = await api.post("/auth/forgot-password/verify-otp", {
    emailId,
    otp,
  });

  return response.data;
};

export const resetPassword = async ({ resetToken, newPassword }) => {
  const response = await api.patch("/auth/forgot-password/reset", {
    resetToken,
    newPassword,
  });

  return response.data;
};
