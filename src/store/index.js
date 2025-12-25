import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ticketReducer from './ticketSlice'; // 1. ייבוא הרדוסר החדש

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer, // 2. חיבור הרדוסר ל-Store הגלובלי
  },
});