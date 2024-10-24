import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import {API_URL} from "./store";
// const API_URL = 'http://localhost:8080';

export const fetchAddresses = createAsyncThunk('address/fetchAddresses', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const response = await axios.get(`${API_URL}/addresses`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch addresses');
    }
    return response.data;
});

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default addressSlice.reducer;