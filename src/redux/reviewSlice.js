import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createReview,
  getReviewByDate,
  getReviews,
  updateReview,
} from "../api/reviewApi";

/* ================= FETCH REVIEWS ================= */

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      return await getReviews();
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Failed to fetch reviews",
      });
    }
  },
);

/* ================= FETCH REVIEW BY DATE ================= */

export const fetchReviewByDate = createAsyncThunk(
  "review/fetchReviewByDate",
  async (date, { rejectWithValue }) => {
    try {
      return await getReviewByDate(date);
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Failed to fetch review",
      });
    }
  },
);

/* ================= ADD REVIEW ================= */

export const addReview = createAsyncThunk(
  "review/addReview",
  async (data, { rejectWithValue }) => {
    try {
      return await createReview(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create review",
      );
    }
  },
);

/* ================= EDIT REVIEW ================= */

export const editReview = createAsyncThunk(
  "review/editReview",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateReview(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update review",
      );
    }
  },
);

/* ================= SLICE ================= */

const reviewSlice = createSlice({
  name: "review",

  initialState: {
    reviews: [],
    selectedReview: null,

    status: "idle",
    selectedStatus: "idle",

    error: null,
    selectedError: null,
  },

  reducers: {
    clearSelectedReview: (state) => {
      state.selectedReview = null;
      state.selectedError = null;
      state.selectedStatus = "idle";
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH REVIEWS ================= */

      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.reviews = action.payload?.data || [];
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";

        if (action.payload?.status === 404) {
          state.reviews = [];
          state.status = "succeeded";
          state.error = null;
          return;
        }

        state.error = action.payload;
      })

      /* ================= FETCH REVIEW BY DATE ================= */

      .addCase(fetchReviewByDate.pending, (state) => {
        state.selectedStatus = "loading";
        state.selectedError = null;
      })

      .addCase(fetchReviewByDate.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";

        state.selectedReview = action.payload?.data || null;
      })

      .addCase(fetchReviewByDate.rejected, (state, action) => {
        state.selectedStatus = "failed";

        state.selectedError = action.payload;
        state.selectedReview = null;
      })

      /* ================= ADD REVIEW ================= */

      .addCase(addReview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "succeeded";

        const review = action.payload?.data;

        if (!review) return;

        state.selectedReview = review;

        const existingIndex = state.reviews.findIndex(
          (item) => item._id === review._id,
        );

        if (existingIndex !== -1) {
          state.reviews[existingIndex] = review;
        } else {
          state.reviews.unshift(review);
        }
      })

      .addCase(addReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ================= EDIT REVIEW ================= */

      .addCase(editReview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(editReview.fulfilled, (state, action) => {
        state.status = "succeeded";

        const review = action.payload?.data;

        if (!review) return;

        state.selectedReview = review;

        const index = state.reviews.findIndex(
          (item) => item._id === review._id,
        );

        if (index !== -1) {
          state.reviews[index] = review;
        }
      })

      .addCase(editReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedReview } = reviewSlice.actions;

export default reviewSlice.reducer;
