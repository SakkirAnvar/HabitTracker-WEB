import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getHabits,
  createHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
} from "../api/habitApi";

export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      return await getHabits({ page, limit });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habits",
      );
    }
  },
);

export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (data, { rejectWithValue }) => {
    try {
      return await createHabit(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create habit",
      );
    }
  },
);

export const editHabit = createAsyncThunk(
  "habits/editHabit",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateHabit(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update habit",
      );
    }
  },
);

export const toggleHabitStatus = createAsyncThunk(
  "habits/toggleHabit",
  async (id, { rejectWithValue }) => {
    try {
      return await toggleHabit(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle habit",
      );
    }
  },
);

export const removeHabit = createAsyncThunk(
  "habits/removeHabit",
  async (id, { rejectWithValue }) => {
    try {
      await deleteHabit(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete habit",
      );
    }
  },
);

const initialState = {
  habits: [],

  status: "idle",
  error: null,

  currentPage: 1,
  totalPages: 1,
  totalHabits: 0,
  limit: 6,

  hasNextPage: false,
  hasPreviousPage: false,
};

const habitSlice = createSlice({
  name: "habits",

  initialState,

  reducers: {
    clearHabitError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.habits = action.payload.data || [];

        // Pagination
        const pagination = action.payload.pagination;

        if (pagination) {
          state.currentPage = pagination.currentPage || 1;

          state.totalPages = pagination.totalPages || 1;

          state.totalHabits = pagination.totalHabits || 0;

          state.limit = pagination.limit || 6;

          state.hasNextPage = pagination.hasNextPage || false;

          state.hasPreviousPage = pagination.hasPreviousPage || false;
        }
      })

      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(addHabit.fulfilled, (state, action) => {
        state.error = null;
      })

      .addCase(addHabit.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(editHabit.fulfilled, (state, action) => {
        const updatedHabit = action.payload.data;

        const index = state.habits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (index !== -1) {
          state.habits[index] = updatedHabit;
        }
      })

      .addCase(editHabit.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(toggleHabitStatus.fulfilled, (state, action) => {
        const updatedHabit = action.payload.data;

        const index = state.habits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (index !== -1) {
          state.habits[index] = {
            ...state.habits[index],
            ...updatedHabit,
          };
        }
      })

      .addCase(toggleHabitStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeHabit.fulfilled, (state, action) => {
        state.habits = state.habits.filter(
          (habit) => habit._id !== action.payload,
        );

        state.totalHabits = Math.max(0, state.totalHabits - 1);
      })

      .addCase(removeHabit.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearHabitError } = habitSlice.actions;

export default habitSlice.reducer;
