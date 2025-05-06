import { configureStore } from "@reduxjs/toolkit";
import basicPreviewReducer from "./basicPreviewSlice";

const store = configureStore({
  reducer: {
    basicPreview: basicPreviewReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
