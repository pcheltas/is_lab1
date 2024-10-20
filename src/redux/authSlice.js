import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080';
const initialState = {
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
};

export const register = createAsyncThunk('auth/register', async (userDto) => {
    console.log('reg')
    const response = await axios.post(`${API_URL}/register`, userDto, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    });

    if (response.status !== 201) {
        throw new Error(`Ошибка при регистрации: ${response.status}`);
    }
    return response.data;
});

export const login = createAsyncThunk('auth/login', async (authDto) => {
    const response = await axios.post(`${API_URL}/login`, authDto, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    });

    if (response.status !== 200) {
        throw new Error(`Ошибка при логине: ${response.status}`);
    }
    return response.data; // Предполагается, что данные пользователя приходят в response.data
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.log(action.error)
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;