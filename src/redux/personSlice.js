import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const API_URL = 'http://localhost:8080';
export const fetchPersons = createAsyncThunk('person/fetchPersons', async () => {
    const response = await fetch(`${API_URL}/persons`);
    if (!response.ok) {
        throw new Error('Failed to fetch persons');
    }
    return response.json();
});

export const fetchColors = createAsyncThunk('person/fetchColors', async () => {
    const response = await fetch(`${API_URL}/colors`);
    if (!response.ok) {
        throw new Error('Failed to fetch colors');
    }
    return response.json();
})

export const fetchCountries = createAsyncThunk('person/fetchCountries', async () => {
    const response = await fetch(`${API_URL}/countries`);
    if (!response.ok) {
        throw new Error('Failed to fetch countries');
    }
    return response.json();
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
