import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all patients
export const fetchAllPatients = createAsyncThunk(
    "patients/fetchAll",
    async (token, { rejectWithValue }) => {
        try {
            const res = await axios.get("http://localhost:8080/patients", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data; // array of PatientSummaryDTO
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const patientsSlice = createSlice({
    name: "patients",
    initialState: {
        allPatients: [],
        selectedPatient: null,
        loading: false,
        error: null,
    },
    reducers: {
        setPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.allPatients = action.payload;
            })
            .addCase(fetchAllPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load patients";
            });
    },
});

export const { setPatient } = patientsSlice.actions;
export default patientsSlice.reducer;
