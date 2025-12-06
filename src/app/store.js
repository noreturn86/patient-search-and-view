import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import patientsReducer from '../features/patients/patientsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
  },
});

export default store;
