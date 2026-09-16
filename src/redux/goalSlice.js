import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  addHabitToGoal,
  removeHabitFromGoal,
  getGoalProgress,
} from "../api/goalApi";

// ==============================
// Fetch goals with pagination
// ==============================

export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      return await getGoals({ page, limit });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch goals",
      );
    }
  },
);

// ==============================
// Create goal
// ==============================

export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async (data, { rejectWithValue }) => {
    try {
      return await createGoal(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create goal",
      );
    }
  },
);

// ==============================
// Get single goal
// ==============================

export const fetchGoal = createAsyncThunk(
  "goals/fetchGoal",
  async (id, { rejectWithValue }) => {
    try {
      return await getGoal(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch goal",
      );
    }
  },
);

// ==============================
// Update goal
// ==============================

export const editGoal = createAsyncThunk(
  "goals/editGoal",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateGoal(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update goal",
      );
    }
  },
);

// ==============================
// Delete goal
// ==============================

export const removeGoal = createAsyncThunk(
  "goals/removeGoal",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGoal(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete goal",
      );
    }
  },
);

// ==============================
// Add habit to goal
// ==============================

export const attachHabitToGoal = createAsyncThunk(
  "goals/attachHabitToGoal",
  async ({ goalId, habitId }, { rejectWithValue }) => {
    try {
      return await addHabitToGoal(goalId, habitId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add habit to goal",
      );
    }
  },
);

// ==============================
// Remove habit from goal
// ==============================

export const detachHabitFromGoal = createAsyncThunk(
  "goals/detachHabitFromGoal",
  async ({ goalId, habitId }, { rejectWithValue }) => {
    try {
      return await removeHabitFromGoal(goalId, habitId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove habit from goal",
      );
    }
  },
);

// ==============================
// Get goal progress
// ==============================

export const fetchGoalProgress = createAsyncThunk(
  "goals/fetchGoalProgress",
  async (goalId, { rejectWithValue }) => {
    try {
      return await getGoalProgress(goalId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch goal progress",
      );
    }
  },
);

// ==============================
// Initial state
// ==============================

const initialState = {
  goals: [],
  selectedGoal: null,
  progress: null,

  status: "idle",
  progressStatus: "idle",

  error: null,
  progressError: null,

  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalGoals: 0,
  limit: 6,
  hasNextPage: false,
  hasPreviousPage: false,
};

// ==============================
// Slice
// ==============================

const goalSlice = createSlice({
  name: "goals",

  initialState,

  reducers: {
    clearGoalError: (state) => {
      state.error = null;
    },

    clearGoalProgress: (state) => {
      state.progress = null;
      state.progressError = null;
    },

    clearSelectedGoal: (state) => {
      state.selectedGoal = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // FETCH ALL GOALS
      // ==========================================

      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.goals = action.payload.data || [];

        // Pagination
        const pagination = action.payload.pagination || {};

        state.currentPage = pagination.currentPage || 1;
        state.totalPages = pagination.totalPages || 1;
        state.totalGoals = pagination.totalGoals || 0;
        state.limit = pagination.limit || 6;
        state.hasNextPage = pagination.hasNextPage || false;
        state.hasPreviousPage = pagination.hasPreviousPage || false;
      })

      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ==========================================
      // CREATE GOAL
      // ==========================================

      .addCase(addGoal.pending, (state) => {
        state.error = null;
      })

      .addCase(addGoal.fulfilled, (state) => {
        // Do not push here when using server-side pagination.
        // Refetch the goals from the current UI.
        state.error = null;
      })

      .addCase(addGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==========================================
      // FETCH SINGLE GOAL
      // ==========================================

      .addCase(fetchGoal.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchGoal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedGoal = action.payload.data;
      })

      .addCase(fetchGoal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ==========================================
      // UPDATE GOAL
      // ==========================================

      .addCase(editGoal.fulfilled, (state, action) => {
        const updatedGoal = action.payload.data;

        if (!updatedGoal) return;

        const index = state.goals.findIndex(
          (goal) => goal._id === updatedGoal._id,
        );

        if (index !== -1) {
          state.goals[index] = updatedGoal;
        }

        if (state.selectedGoal?._id === updatedGoal._id) {
          state.selectedGoal = updatedGoal;
        }
      })

      .addCase(editGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==========================================
      // DELETE GOAL
      // ==========================================

      .addCase(removeGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal._id !== action.payload);

        state.totalGoals = Math.max(0, state.totalGoals - 1);

        if (state.selectedGoal?._id === action.payload) {
          state.selectedGoal = null;
        }
      })

      .addCase(removeGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==========================================
      // ADD HABIT TO GOAL
      // ==========================================

      .addCase(attachHabitToGoal.fulfilled, (state, action) => {
        const updatedGoal = action.payload.data;

        if (!updatedGoal) return;

        const index = state.goals.findIndex(
          (goal) => goal._id === updatedGoal._id,
        );

        if (index !== -1) {
          state.goals[index] = updatedGoal;
        }

        if (state.selectedGoal?._id === updatedGoal._id) {
          state.selectedGoal = updatedGoal;
        }
      })

      .addCase(attachHabitToGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==========================================
      // REMOVE HABIT FROM GOAL
      // ==========================================

      .addCase(detachHabitFromGoal.fulfilled, (state, action) => {
        const updatedGoal = action.payload.data;

        if (!updatedGoal) return;

        const index = state.goals.findIndex(
          (goal) => goal._id === updatedGoal._id,
        );

        if (index !== -1) {
          state.goals[index] = updatedGoal;
        }

        if (state.selectedGoal?._id === updatedGoal._id) {
          state.selectedGoal = updatedGoal;
        }
      })

      .addCase(detachHabitFromGoal.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ==========================================
      // GOAL PROGRESS
      // ==========================================

      .addCase(fetchGoalProgress.pending, (state) => {
        state.progressStatus = "loading";
        state.progressError = null;
      })

      .addCase(fetchGoalProgress.fulfilled, (state, action) => {
        state.progressStatus = "succeeded";
        state.progress = action.payload.data;
      })

      .addCase(fetchGoalProgress.rejected, (state, action) => {
        state.progressStatus = "failed";
        state.progressError = action.payload;
      });
  },
});

export const { clearGoalError, clearGoalProgress, clearSelectedGoal } =
  goalSlice.actions;

export default goalSlice.reducer;
