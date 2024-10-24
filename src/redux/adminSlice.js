import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import {API_URL} from "./store";

// const API_URL = 'http://localhost:8080';

export const fetchPotentialAdmins = createAsyncThunk('admin/fetchPotentialAdmins', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const response = await axios.get(`${API_URL}/admin`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch potential admins');
    }
    return response.data;
});

export const acceptAdminRequest = createAsyncThunk('admin/acceptAdminRequest', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1]
        }
    };
    const response = await axios.put(`${API_URL}/admin/${args[0]}:admin`, {}, getHeaders);
    console.log(response)
    return response.data;
});

export const declineAdminRequest = createAsyncThunk('admin/declineAdminRequest', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1]
        }
    };
    const response = await axios.put(`${API_URL}/admin/${args[0]}:user`, {}, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to decline potential admin');
    }
    return response.data;
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        potentialAdmins: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPotentialAdmins.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPotentialAdmins.fulfilled, (state, action) => {
                state.loading = false;
                state.potentialAdmins = action.payload;
            })
            .addCase(fetchPotentialAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(acceptAdminRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(acceptAdminRequest.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(acceptAdminRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(declineAdminRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(declineAdminRequest.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(declineAdminRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default adminSlice.reducer;