import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  provider: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload.provider;
      state.token = action.payload.token;

      // Persist token to localStorage
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.provider = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearProvider: (state) => {
      state.provider = null;
    },
  },
});

export const { setProvider, logout, clearProvider } = authSlice.actions;
export default authSlice.reducer;
