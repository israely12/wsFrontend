import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/userSlice";
import attackReducer from "./features/attackSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    attacks: attackReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
