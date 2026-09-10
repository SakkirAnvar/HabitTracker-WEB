import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getCalendarAnalytics,
  getHabitStreak,
} from "../api/analyticsApi";

export const fetchDailyAnalytics = createAsyncThunk(
  "analytics/fetchDaily",
  async (_, { rejectWithValue }) => {
    try {
      return await getDailyAnalytics();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch daily analytics",
      );
    }
  },
);

export const fetchWeeklyAnalytics = createAsyncThunk(
  "analytics/fetchWeekly",
  async (_, { rejectWithValue }) => {
    try {
      return await getWeeklyAnalytics();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch weekly analytics",
      );
    }
  },
);

export const fetchMonthlyAnalytics = createAsyncThunk(
  "analytics/fetchMonthly",
  async (_, { rejectWithValue }) => {
    try {
      return await getMonthlyAnalytics();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch monthly analytics",
      );
    }
  },
);

export const fetchCalendarAnalytics = createAsyncThunk(
  "analytics/fetchCalendar",
  async (_, { rejectWithValue }) => {
    try {
      return await getCalendarAnalytics();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch calendar analytics",
      );
    }
  },
);

export const fetchHabitStreak = createAsyncThunk(
  "analytics/fetchStreak",
  async (habitId, { rejectWithValue }) => {
    try {
      return await getHabitStreak(habitId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habit streak",
      );
    }
  },
);

const analyticsSlice = createSlice({
  name: "analytics",

  initialState: {
    daily: null,
    weekly: null,
    monthly: null,
    calendar: null,
    streak: null,

    dailyStatus: "idle",
    weeklyStatus: "idle",
    monthlyStatus: "idle",
    calendarStatus: "idle",
    streakStatus: "idle",

    dailyError: null,
    weeklyError: null,
    monthlyError: null,
    calendarError: null,
    streakError: null,
  },

  reducers: {
    clearStreak: (state) => {
      state.streak = null;
      state.streakStatus = "idle";
      state.streakError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Daily
      .addCase(fetchDailyAnalytics.pending, (state) => {
        state.dailyStatus = "loading";
        state.dailyError = null;
      })

      .addCase(fetchDailyAnalytics.fulfilled, (state, action) => {
        state.dailyStatus = "succeeded";
        state.daily = action.payload?.data || null;
      })

      .addCase(fetchDailyAnalytics.rejected, (state, action) => {
        state.dailyStatus = "failed";
        state.dailyError = action.payload;
      })

      // Weekly
      .addCase(fetchWeeklyAnalytics.pending, (state) => {
        state.weeklyStatus = "loading";
        state.weeklyError = null;
      })

      .addCase(fetchWeeklyAnalytics.fulfilled, (state, action) => {
        state.weeklyStatus = "succeeded";
        state.weekly = action.payload?.data || null;
      })

      .addCase(fetchWeeklyAnalytics.rejected, (state, action) => {
        state.weeklyStatus = "failed";
        state.weeklyError = action.payload;
      })

      // Monthly
      .addCase(fetchMonthlyAnalytics.pending, (state) => {
        state.monthlyStatus = "loading";
        state.monthlyError = null;
      })

      .addCase(fetchMonthlyAnalytics.fulfilled, (state, action) => {
        state.monthlyStatus = "succeeded";
        state.monthly = action.payload?.data || null;
      })

      .addCase(fetchMonthlyAnalytics.rejected, (state, action) => {
        state.monthlyStatus = "failed";
        state.monthlyError = action.payload;
      })

      // Calendar
      .addCase(fetchCalendarAnalytics.pending, (state) => {
        state.calendarStatus = "loading";
        state.calendarError = null;
      })

      .addCase(fetchCalendarAnalytics.fulfilled, (state, action) => {
        state.calendarStatus = "succeeded";
        state.calendar = action.payload?.data || null;
      })

      .addCase(fetchCalendarAnalytics.rejected, (state, action) => {
        state.calendarStatus = "failed";
        state.calendarError = action.payload;
      })

      // Streak
      .addCase(fetchHabitStreak.pending, (state) => {
        state.streakStatus = "loading";
        state.streakError = null;
      })

      .addCase(fetchHabitStreak.fulfilled, (state, action) => {
        state.streakStatus = "succeeded";
        state.streak = action.payload?.data || null;
      })

      .addCase(fetchHabitStreak.rejected, (state, action) => {
        state.streakStatus = "failed";
        state.streakError = action.payload;
      });
  },
});

export const { clearStreak } = analyticsSlice.actions;

export default analyticsSlice.reducer;
