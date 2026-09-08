import api from "../utils/axios";

const baseURL = import.meta.env.VITE_API_URL

export const signupApi = async (userData) => {
  const response = await api.post(baseURL+"/auth/signup", userData);

  return response.data;
};

export const loginApi = async (userData) => {
  const response = await api.post(baseURL+"/auth/login", userData);

  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUserApi = async () =>{
    const response = await api.get("/auth/me")
    return response.data
}

export const updateProfileApi = async (userData) => {
    const response = await api.patch("/auth/profile", userData)
    return response.data
} 

export const changePasswordApi = async (data) => {
    const response = await api.patch("/auth/changePassword", data)

    return response.data
}
