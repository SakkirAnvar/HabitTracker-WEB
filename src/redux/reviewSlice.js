import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createReview,
  getReviewByDate,
  getReviews,
  updateReview,
} from "../api/reviewApi";

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async (
    { page = 1, limit = 6, search = "", sort = "newest" } = {},
    { rejectWithValue },
  ) => {
    try {
      return await getReviews({
        page,
        limit,
        search,
        sort,
      });
    } catch (error) {
      return rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Failed to fetch reviews",
        data: error.response?.data?.data || [],
        pagination: error.response?.data?.pagination || null,
      });
    }
  },
);

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

const reviewSlice = createSlice({
  name: "review",

  initialState: {
    reviews: [],

    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 6,
    hasNextPage: false,
    hasPreviousPage: false,

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

      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.reviews = action.payload?.data || [];

        const pagination = action.payload?.pagination;

        if (pagination) {
          state.currentPage = pagination.currentPage ?? 1;
          state.totalPages = pagination.totalPages ?? 1;
          state.totalReviews = pagination.totalReviews ?? 0;
          state.limit = pagination.limit ?? 6;
          state.hasNextPage = pagination.hasNextPage ?? false;
          state.hasPreviousPage = pagination.hasPreviousPage ?? false;
        } else {
          state.currentPage = 1;
          state.totalPages = 1;
          state.totalReviews = state.reviews.length;
          state.limit = 6;
          state.hasNextPage = false;
          state.hasPreviousPage = false;
        }
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";

        if (action.payload?.status === 404) {
          state.reviews = [];

          state.currentPage = action.payload?.pagination?.currentPage ?? 1;

          state.totalPages = action.payload?.pagination?.totalPages ?? 0;

          state.totalReviews = action.payload?.pagination?.totalReviews ?? 0;

          state.limit = action.payload?.pagination?.limit ?? 6;

          state.hasNextPage = action.payload?.pagination?.hasNextPage ?? false;

          state.hasPreviousPage =
            action.payload?.pagination?.hasPreviousPage ?? false;

          state.status = "succeeded";
          state.error = null;

          return;
        }

        state.error = action.payload;
      })

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
      .addCase(addReview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(addReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const review = action.payload?.data;

        if (!review) return;

        state.selectedReview = review;
      })

      .addCase(addReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(editReview.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(editReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const review = action.payload?.data;

        if (!review) return;

        state.selectedReview = review;
      })

      .addCase(editReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedReview } = reviewSlice.actions;

export default reviewSlice.reducer;
