import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import habitReducer from "./habitSlice";
import habitLogReducer from "./habitLogSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    habit: habitReducer,
    habitLog: habitLogReducer,
  },
});

export default store;
