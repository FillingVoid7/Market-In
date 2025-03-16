import { configureStore } from "@reduxjs/toolkit";
import freePreviewReducer from "./freePreviewSlice";

const store = configureStore({
  reducer: {
    freePreview: freePreviewReducer, 
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
