import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";


const API_URL = 'http://localhost:8080';
export const fetchPersons = createAsyncThunk('person/fetchPersons', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await axios.get(`${API_URL}/persons`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch colors');
    }
    return await response.data;
});

export const fetchColors = createAsyncThunk('person/fetchColors', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await axios.get(`${API_URL}/colors`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch colors');
    }
    return await response.data;
})

export const fetchCountries = createAsyncThunk('person/fetchCountries', async (token) => {
    // const response = await fetch(`${API_URL}/countries`);
    // if (!response.ok) {
    //     throw new Error('Failed to fetch countries');
    // }
    // return response.json();
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await axios.get(`${API_URL}/countries`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch colors');
    }
    return await response.data;
})

const personSlice = createSlice({
    name: 'person',
    initialState: {
        persons: [],
        color: [],
        country: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        const fetchCases = [fetchColors, fetchCountries, fetchPersons];

        fetchCases.forEach((fetchCase) => {
            builder
                .addCase(fetchCase.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchCase.fulfilled, (state, action) => {
                    state.loading = false;

                    // Определяем, какой именно action payload обрабатываем
                    if (fetchCase === fetchColors) {
                        state.color = action.payload;
                    } else if (fetchCase === fetchCountries) {
                        state.country = action.payload;
                    } else if (fetchCase === fetchPersons) {
                        state.persons = action.payload;
                    }
                })
                .addCase(fetchCase.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });
        });
    },
});
export default personSlice.reducer;
