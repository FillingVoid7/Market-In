"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import freePreviewReducer from "../redux/templatesPreview/freePreviewSlice";

const store = configureStore({
  reducer: {
    freePreview: freePreviewReducer,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  );
}
