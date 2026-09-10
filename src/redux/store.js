import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import habitReducer from "./habitSlice";
import habitLogReducer from "./habitLogSlice";
import goalReducer from "./goalSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    habit: habitReducer,
    habitLog: habitLogReducer,
    goal: goalReducer,
  },
});

export default store;
