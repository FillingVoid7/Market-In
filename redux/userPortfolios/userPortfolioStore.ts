import { configureStore } from '@reduxjs/toolkit';
import userPortfolioReducer from './userPortfolioSlice';

export const store = configureStore({
  reducer: {
    userPortfolio: userPortfolioReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;