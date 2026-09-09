import api from "../utils/axios";

export const createGoal = async (data) => {
  const response = await api.post("/goals", data);
  return response.data;
};

export const getAllGoal = async () => {
  const response = await api.get("/goals");
  return response.data;
};

export const getSingleGoal = async (id) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

export const updateGoal = async (id, data) => {
  const response = await api.patch(`/goals/${id}`, data);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);

  return response.data;
};

export const addHabitToGoal = async (goalId, habitId) => {
  const response = await api.post(`/goals/${goalId}/habits/${habitId}`);
  return response.data;
};

export const removeHabitFromGoal = async (goalId, habitId) => {
  const response = await api.delete(`/goals/${goalId}/habits/${habitId}`);
  return response.data;
};

export const getGoalProgress = async (goalId) => {
  const response = await api.get(`/goals/${goalId}/progress`);
  return response.data;
};
