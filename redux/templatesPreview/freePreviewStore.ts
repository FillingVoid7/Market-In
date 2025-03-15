import { configureStore } from "@reduxjs/toolkit";
import freePreviewReducer from "./freePreviewSlice";

const store = configureStore({
  reducer: {
    freePreview: freePreviewReducer, 
  },
});

export default store;
