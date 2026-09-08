import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createHabitLog,
  getAllHabitLogs,
  getHabitLogsByDate,
  updateHabitLog,
} from "../api/habitLogApi";

export const addHabitLog = createAsyncThunk(
  "habitLogs/addHabitLog",
  async ({ habitId, data }, { rejectWithValue }) => {
    try {
      return await createHabitLog(habitId, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save habit progress",
      );
    }
  },
);

export const fetchHabitLogs = createAsyncThunk(
  "habitLogs/fetchHabitLogs",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllHabitLogs();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habit logs",
      );
    }
  },
);

export const fetchHabitLogsByDate = createAsyncThunk(
  "habitLogs/fetchHabitLogsByDate",
  async (date, { rejectWithValue }) => {
    try {
      return await getHabitLogsByDate(date);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habit logs",
      );
    }
  },
);

export const editHabitLog = createAsyncThunk(
  "habitsLogs/editHabitLog",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateHabitLog(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update log",
      );
    }
  },
);

const initialState = {
  logs: [],
  status: "idle",
  error: null,
};

const habitLogSlice = createSlice({
  name: "habitLogs",
  initialState,
  reducers: {
    clearHabitLogError: (state) => {
      state.error = null;
    },
    clearHabitLogs: (state) => {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder

      //addLog
      .addCase(addHabitLog.pending, (state) => {
        state.error = null;
      })

      .addCase(addHabitLog.fulfilled, (state, action) => {
        const newLog = action.payload.data;

        if (!newLog) return;

        const existingIndex = state.logs.findIndex(
          (log) => log._id === newLog._id,
        );

        if (existingIndex !== -1) {
          state.logs[existingIndex] = newLog;
        } else {
          state.logs.push(newLog);
        }
      })

      .addCase(addHabitLog.rejected, (state, action) => {
        state.error = action.payload;
      })

      //Fetch all logs
      .addCase(fetchHabitLogs.pending, (state) => {
        ((state.status = "loading"), (state.error = null));
      })

      .addCase(fetchHabitLogs.fulfilled, (state, action) => {
        ((state.status = "succeeded"),
          (state.logs = action.payload.data || []));
      })

      .addCase(fetchHabitLogs.rejected, (state, action) => {
        ((state.status = "failed"), (state.error = action.payload));
      })

      //fetch logs by date
      .addCase(fetchHabitLogsByDate.pending, (state) => {
        ((state.status = "loading"), (state.error = null));
      })

      .addCase(fetchHabitLogsByDate.fulfilled, (state, action) => {
        ((state.status = "succeeded"),
          (state.logs = action.payload.data || []));
      })

      .addCase(fetchHabitLogsByDate.rejected, (state, action) => {
        ((state.status = "failed"), (state.error = action.payload));
      })

      //update log
      .addCase(editHabitLog.fulfilled, (state, action) => {
        const updatedLog = action.payload.data;
        if (!updatedLog) return;

        const index = state.logs.findIndex((log) => log._id === updatedLog._id);

        if (index !== -1) {
          state.logs[index] = updatedLog;
        }
      })

      .addCase(editHabitLog.rejected, (state, action) => {
        ((state.status = "failed"), (state.error = action.payload));
      });
  },
});

export const { clearHabitLogError, clearHabitLogs } = habitLogSlice.actions;

export default habitLogSlice.reducer;

