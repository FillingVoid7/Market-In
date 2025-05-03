import { configureStore } from '@reduxjs/toolkit';
import userPortfolioReducer from './userPortfolios/userPortfolioSlice';

export const store = configureStore({
  reducer: {
    userPortfolio: userPortfolioReducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;