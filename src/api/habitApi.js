import api from "../utils/axios";

export const createHabit = async (data) => {
  const response = await api.post("/habits", data);
  return response.data;
};

export const getHabits = async () => {
  const response = await api.get("/habits");
  return response.data;
};

export const getHabit = async (id) => {
  const response = await api.get(`/habits/${id}`);
  return response.data;
};

export const updateHabit = async (id, data) => {
  const response = await api.patch(`/habits/${id}`, data);
  return response.data;
};

export const toggleHabit = async (id) => {
  const response = await api.patch(`/habits/${id}/toggle`);
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await api.delete(`/habits/${id}`);
  return response.data;
};
