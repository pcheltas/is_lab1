import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {fetchProducts} from "./productSlice";

const API_URL = 'http://localhost:8080';
const initialState = {
    isAuthenticated: false,
    token: null,
    role: null,
    login: null,
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
        throw new Error(`Ошибка при регистрации`);
    }
    return response.data;
});

export const login = createAsyncThunk('auth/login', async (authDto, {rejectWithValue}) => {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8'
    }
    try {
        const response = await axios.post(`${API_URL}/login`, authDto, {headers});
        return response.data;
    } catch (error) {
        console.log("before")
        console.log(error)
        if (error.response.status === 401) {
            return rejectWithValue(`Неверный логин или пароль`);
        } else if (error.response.status !== 200) {
            return rejectWithValue(`Прозошла ошибка при входе`);
        }
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }
});

export const fetchUserRole = createAsyncThunk('auth/getUser', async (args, {rejectWithValue}) => {
    // role token
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1]
        }
    };
    const response = await axios.get(`${API_URL}/role/current`, getHeaders);

    console.log(response.status)
    if (args[0] !== response.data && response.data === "ADMIN"){
        throw rejectWithValue("Вы стали админом. Для активации роли перезайдите в аккаунт")
    }
    if (response.status !== 200) {
        throw new Error(`Failed to fetch current role`);
    } else {
        return response.data;
    }

});

export const requestAdminRole = createAsyncThunk('auth/requestAdminRole', async (token, {rejectWithValue}) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };
    const response = await axios.post(`${API_URL}/request/admin`, {}, getHeaders);

    console.log(response)
    if (response.status === 200) {
        console.log("200" + JSON.stringify(response))
        return rejectWithValue(`Вы стали админом. Для активации роли перезайдите в аккаунт`);
    } else if (response.status === 202){
        console.log("202" + JSON.stringify(response))
        return rejectWithValue(`Заявка на роль админа поставлена в очередь`);
    } else {
        return response.data;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.role = null;
            state.login = null;
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
                state.token = action.payload.token;
                state.role = action.payload.role;
                state.login = action.payload.login
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
                state.role = action.payload.role;
                state.login = action.payload.login
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                console.log('inside addCase' + JSON.stringify(action))
                // state.error = action.error.message;
                state.error = action.payload;
                action.error = action.payload
            })
            .addCase(fetchUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserRole.fulfilled, (state, action) => {
                state.loading = false;
                // if (state.role !== action.payload && action.payload.toString() === "ADMIN") {
                //     logout();
                // }
                state.role = action.payload;
            })
            .addCase(fetchUserRole.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.error.message;
                state.error = action.payload;
            })
            .addCase(requestAdminRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestAdminRole.fulfilled, (state, action) => {
                state.loading = false;
                // state.role = action.payload;
            })
            .addCase(requestAdminRole.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.error.message;
                state.error = action.payload;
            });
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;