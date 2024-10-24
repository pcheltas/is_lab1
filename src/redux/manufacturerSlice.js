import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import {API_URL} from "./store";

// const API_URL = 'http://localhost:8080';

// Асинхронный запрос для получения производителей
export const fetchManufacturers = createAsyncThunk('manufacturer/fetchManufacturers', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const response = await axios.get(`${API_URL}/organizations`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch manufacturers');
    }
    return response.data;
});

const manufacturerSlice = createSlice({
    name: 'manufacturer',
    initialState: {
        manufacturers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchManufacturers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchManufacturers.fulfilled, (state, action) => {
                state.loading = false;
                state.manufacturers = action.payload;
            })
            .addCase(fetchManufacturers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default manufacturerSlice.reducer;