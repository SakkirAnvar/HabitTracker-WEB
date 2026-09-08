import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import habitReducer from "./habitSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    habit:habitReducer
  },
});

export default store;
