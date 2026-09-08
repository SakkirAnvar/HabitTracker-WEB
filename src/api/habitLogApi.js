import api from "../utils/axios";

export const createHabitLog = async (habitId, data) => {
  const response = await api.post(`/habits-log/${habitId}`, data);
  return response.data;
};

export const getAllHabitLogs = async () => {
  const response = await api.get("/habits-log");
  return response.data;
};

export const getHabitLogsByDate = async (date) => {
  const response = await api.get(`/habits-log/${date}`);
  return response.data;
};

export const updateHabitLog = async (id, data) => {
  const response = await api.patch(`/habits-log/${id}`, data);
  return response.data;
};
