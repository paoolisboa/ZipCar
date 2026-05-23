// The store is the global memory of your app.
// Store = giant JS object shared across the app

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;