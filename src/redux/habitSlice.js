import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getHabits,
  createHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
  getArchivedHabits,
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

export const fetchArchivedHabits = createAsyncThunk(
  "habits/fetchArchivedHabits",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      return await getArchivedHabits({ page, limit });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch archived habits",
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
        error.response?.data?.message || "Failed to update habit status",
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
  archivedHabits: [],

  status: "idle",
  archivedStatus: "idle",

  error: null,
  archivedError: null,

  currentPage: 1,
  totalPages: 1,
  totalHabits: 0,
  limit: 6,

  archivedCurrentPage: 1,
  archivedTotalPages: 1,
  archivedTotalHabits: 0,
  archivedHasNextPage: false,
  archivedHasPreviousPage: false,

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

    // =========================
    // Active Habits
    // =========================

    .addCase(fetchHabits.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })

    .addCase(fetchHabits.fulfilled, (state, action) => {
      state.status = "succeeded";

      state.habits = action.payload.data || [];

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

    // =========================
    // Archived Habits
    // =========================

    .addCase(fetchArchivedHabits.pending, (state) => {
      state.archivedStatus = "loading";
      state.archivedError = null;
    })

    .addCase(fetchArchivedHabits.fulfilled, (state, action) => {
      state.archivedStatus = "succeeded";

      state.archivedHabits = action.payload.data || [];

      const pagination = action.payload.pagination;

      if (pagination) {
        state.archivedCurrentPage = pagination.currentPage || 1;
        state.archivedTotalPages = pagination.totalPages || 1;
        state.archivedTotalHabits = pagination.totalHabits || 0;
        state.archivedHasNextPage = pagination.hasNextPage || false;
        state.archivedHasPreviousPage =
          pagination.hasPreviousPage || false;
      }
    })

    .addCase(fetchArchivedHabits.rejected, (state, action) => {
      state.archivedStatus = "failed";
      state.archivedError = action.payload;
    })

    // =========================
    // Create
    // =========================

    .addCase(addHabit.fulfilled, (state) => {
      state.error = null;
    })

    .addCase(addHabit.rejected, (state, action) => {
      state.error = action.payload;
    })

    // =========================
    // Edit
    // =========================

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

    // =========================
    // Archive / Restore
    // =========================

    .addCase(toggleHabitStatus.fulfilled, (state, action) => {
      const updatedHabit = action.payload.data;

      // Archiving an active habit
      const activeIndex = state.habits.findIndex(
        (habit) => habit._id === updatedHabit._id,
      );

      if (updatedHabit.active === false) {
        if (activeIndex !== -1) {
          state.habits.splice(activeIndex, 1);
          state.totalHabits = Math.max(0, state.totalHabits - 1);
        }

        // Add it to archived state
        const archivedIndex = state.archivedHabits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (archivedIndex === -1) {
          state.archivedHabits.push(updatedHabit);
        }
      }

      // Restoring an archived habit
      else {
        const archivedIndex = state.archivedHabits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (archivedIndex !== -1) {
          state.archivedHabits.splice(archivedIndex, 1);
          state.archivedTotalHabits = Math.max(
            0,
            state.archivedTotalHabits - 1,
          );
        }

        const activeIndex = state.habits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (activeIndex === -1) {
          state.habits.unshift(updatedHabit);
          state.totalHabits += 1;
        } else {
          state.habits[activeIndex] = updatedHabit;
        }
      }
    })

    .addCase(toggleHabitStatus.rejected, (state, action) => {
      state.error = action.payload;
    })

    // =========================
    // Delete
    // =========================

    .addCase(removeHabit.fulfilled, (state, action) => {
      const id = action.payload;

      state.habits = state.habits.filter(
        (habit) => habit._id !== id,
      );

      state.archivedHabits = state.archivedHabits.filter(
        (habit) => habit._id !== id,
      );

      state.totalHabits = Math.max(0, state.totalHabits - 1);
      state.archivedTotalHabits = Math.max(
        0,
        state.archivedTotalHabits - 1,
      );
    })

    .addCase(removeHabit.rejected, (state, action) => {
      state.error = action.payload;
    });
}
});

export const { clearHabitError } = habitSlice.actions;

export default habitSlice.reducer;
