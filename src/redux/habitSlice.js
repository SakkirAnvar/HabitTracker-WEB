import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getHabits,
  createHabit,
  updateHabit,
  toggleHabit,
  getHabitOptions,
  deleteHabit,
  getArchivedHabits,
  getTodayHabits,
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

export const fetchHabitOptions = createAsyncThunk(
  "habits/fetchHabitOptions",
  async (_, { rejectWithValue }) => {
    try {
      return await getHabitOptions();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habit options",
      );
    }
  },
);

export const fetchTodayHabits = createAsyncThunk(
  "habits/fetchTodayHabits",
  async ({ date, page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      return await getTodayHabits({
        date,
        page,
        limit,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch today's habits",
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
  status: "idle",
  error: null,

  habitOptions: [],
  habitOptionsStatus: "idle",
  habitOptionsError: null,

  currentPage: 1,
  totalPages: 1,
  totalHabits: 0,
  limit: 6,
  hasNextPage: false,
  hasPreviousPage: false,

  todayHabits: [],
  todayStatus: "idle",
  todayError: null,

  todayCurrentPage: 1,
  todayTotalPages: 1,
  todayTotalHabits: 0,
  todayHasNextPage: false,
  todayHasPreviousPage: false,

  todaySummary: {
    expected: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
  },

  archivedHabits: [],
  archivedStatus: "idle",
  archivedError: null,

  archivedCurrentPage: 1,
  archivedTotalPages: 1,
  archivedTotalHabits: 0,
  archivedHasNextPage: false,
  archivedHasPreviousPage: false,
};

const habitSlice = createSlice({
  name: "habits",

  initialState,

  reducers: {
    clearHabitError: (state) => {
      state.error = null;
    },

    clearTodayHabitError: (state) => {
      state.todayError = null;
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

      .addCase(fetchTodayHabits.pending, (state) => {
        state.todayStatus = "loading";
        state.todayError = null;
      })

      .addCase(fetchTodayHabits.fulfilled, (state, action) => {
        state.todayStatus = "succeeded";

        state.todayHabits = action.payload.data || [];

        const pagination = action.payload.pagination || {};
        const summary = action.payload.summary || {};

        state.todayCurrentPage = pagination.currentPage || 1;
        state.todayTotalPages = pagination.totalPages || 1;
        state.todayTotalHabits = pagination.totalHabits || 0;

        state.todayHasNextPage = pagination.hasNextPage || false;
        state.todayHasPreviousPage = pagination.hasPreviousPage || false;

        state.todaySummary = {
          expected: Number(summary.expected) || 0,
          completed: Number(summary.completed) || 0,
          remaining: Number(summary.remaining) || 0,
          percentage: Number(summary.percentage) || 0,
        };
      })

      .addCase(fetchTodayHabits.rejected, (state, action) => {
        state.todayStatus = "failed";
        state.todayError = action.payload;
      })

      .addCase(fetchHabitOptions.pending, (state) => {
        state.habitOptionsStatus = "loading";
        state.habitOptionsError = null;
      })

      .addCase(fetchHabitOptions.fulfilled, (state, action) => {
        state.habitOptionsStatus = "succeeded";
        state.habitOptions = action.payload.data || [];
      })

      .addCase(fetchHabitOptions.rejected, (state, action) => {
        state.habitOptionsStatus = "failed";
        state.habitOptionsError = action.payload;
      })

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

          state.archivedHasPreviousPage = pagination.hasPreviousPage || false;
        }
      })

      .addCase(fetchArchivedHabits.rejected, (state, action) => {
        state.archivedStatus = "failed";
        state.archivedError = action.payload;
      })

      .addCase(addHabit.fulfilled, (state) => {
        state.error = null;
      })

      .addCase(addHabit.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(editHabit.fulfilled, (state, action) => {
        const updatedHabit = action.payload.data;

        /* Update paginated habit list */

        const activeIndex = state.habits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (activeIndex !== -1) {
          state.habits[activeIndex] = updatedHabit;
        }

        const todayIndex = state.todayHabits.findIndex(
          (habit) => habit._id === updatedHabit._id,
        );

        if (todayIndex !== -1) {
          state.todayHabits[todayIndex] = {
            ...state.todayHabits[todayIndex],
            ...updatedHabit,
          };
        }
      })

      .addCase(editHabit.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(toggleHabitStatus.fulfilled, (state, action) => {
        const updatedHabit = action.payload.data;

        if (updatedHabit.active === false) {
          const activeIndex = state.habits.findIndex(
            (habit) => habit._id === updatedHabit._id,
          );

          if (activeIndex !== -1) {
            state.habits.splice(activeIndex, 1);

            state.totalHabits = Math.max(0, state.totalHabits - 1);
          }

          state.todayHabits = state.todayHabits.filter(
            (habit) => habit._id !== updatedHabit._id,
          );

          const archivedIndex = state.archivedHabits.findIndex(
            (habit) => habit._id === updatedHabit._id,
          );

          if (archivedIndex === -1) {
            state.archivedHabits.push(updatedHabit);
          }
        } else {
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

      .addCase(removeHabit.fulfilled, (state, action) => {
        const id = action.payload;

        state.habits = state.habits.filter((habit) => habit._id !== id);

        state.todayHabits = state.todayHabits.filter(
          (habit) => habit._id !== id,
        );

        state.archivedHabits = state.archivedHabits.filter(
          (habit) => habit._id !== id,
        );

        state.totalHabits = Math.max(0, state.totalHabits - 1);

        state.archivedTotalHabits = Math.max(0, state.archivedTotalHabits - 1);
      })

      .addCase(removeHabit.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearHabitError, clearTodayHabitError } = habitSlice.actions;

export default habitSlice.reducer;
