import api from "../utils/axios";

export const getDailyAnalytics = async (params = {}) => {
  const response = await api.get("/analytics/daily", {
    params,
  });

  return response.data;
};

export const getWeeklyAnalytics = async ({ date } = {}) => {
  const response = await api.get("/analytics/weekly", {
    params: {
      date,
    },
  });

  return response.data;
};

export const getMonthlyAnalytics = async ({ date } = {}) => {
  const response = await api.get("/analytics/monthly", {
    params: {
      date,
    },
  });

  return response.data;
};

export const getCalendarAnalytics = async ({ year, month } = {}) => {
  const response = await api.get("/analytics/calendar", {
    params: {
      year,
      month,
    },
  });

  return response.data;
};

export const getHabitStreak = async (habitId) => {
  const response = await api.get(`/analytics/habits/${habitId}/streak`);

  return response.data;
};
