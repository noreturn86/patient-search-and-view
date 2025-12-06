import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import patientsReducer from '../features/patients/patientsSlice.js';
import tabsReducer from '../features/tabs/tabsSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    tabs: tabsReducer,
  },
});

export default store;
