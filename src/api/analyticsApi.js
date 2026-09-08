import api from "../utils/axios";

export const getDailyAnalytics = async () => {
  const response = await api.get("/analytics/daily");
  return response.data;
};

export const getWeeklyAnalytics = async () => {
  const response = await api.get("/analytics/weekly");
  return response.data;
};

export const getMonthlyAnalytics = async () => {
  const response = await api.get("/analytics/monthly");
  return response.data;
};

export const getCalendarAnalytics = async () => {
  const response = await api.get("/analytics/calendar");
  return response.data;
};

export const getHabitStreak = async (habitId) => {
  const response = await api.get(`/analytics/habits/${habitId}/streak`);
  return response.data;
};
