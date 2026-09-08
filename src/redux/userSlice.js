import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  changePasswordApi,
  getCurrentUserApi,
  loginApi,
  logoutApi,
  signupApi,
  updateProfileApi,
} from "../api/authApi";
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserApi();

      if (!response.status) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed",
      );
    }
  },
);

export const signup = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await signupApi(userData);
      if (!response.status) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup Failed");
    }
  },
);

export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginApi(userData);
      if (!response.status) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login Failed");
    }
  },
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();

      if (!response.status) {
        return rejectWithValue(response.message);
      }

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await updateProfileApi(userData);
      if (!response.status) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update Profile",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await changePasswordApi(data);
      if (!response.status) {
        return rejectWithValue(response.message);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password",
      );
    }
  },
);

const initialState = {
  user: null,
  status: "loading",
  initialized: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //Check Auth
      .addCase(checkAuth.pending, (state) => {
        if (state.status !== "authenticated") {
          state.status = "loading";
        }
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.initialized = true;
        state.error = null;
      })

      .addCase(checkAuth.rejected, (state) => {
        if (state.status !== "authenticated") {
          state.user = null;
          state.status = "unauthenticated";
        }

        state.initialized = true;
        state.error = null;
      })

      //Signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.initialized = true;
        state.error = null;
      })

      .addCase(signup.rejected, (state, action) => {
        state.status = "anauthorized";
        state.error = action.payload;
      })

      //login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "authenticated";
        state.initialized = true;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "unauthenticated";
        state.error = action.payload;
      })

      //logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
        state.error = null;
      })

      //update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
