import userSlice from "./reducers/userSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    auth: userSlice,
  },
});
