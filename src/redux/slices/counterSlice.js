// A slice is a section of the global state.
// Example: counterSlice, userSlice, cartSlice, authSlice...
// Each slice manages: its own state, its own reducers, its own actions

import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',

  initialState: {
    value: 0,
  },

  // Reducers change state.
  // Important:
  // reducers are the ONLY place where Redux state changes
  // never modify Redux state directly outside reducers
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

export const { increment } = counterSlice.actions;

export default counterSlice.reducer;