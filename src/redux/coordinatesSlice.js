import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const API_URL = 'http://localhost:8080';

export const fetchCoordinates = createAsyncThunk('coordinates/fetchCoordinates', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const response = await axios.get(`${API_URL}/coordinates`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch manufacturers');
    }
    return response.data;
});

const coordinateSlice = createSlice({
    name: 'coordinate',
    initialState: {
        coordinates: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoordinates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCoordinates.fulfilled, (state, action) => {
                state.loading = false;
                state.coordinates = action.payload;
            })
            .addCase(fetchCoordinates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default coordinateSlice.reducer;