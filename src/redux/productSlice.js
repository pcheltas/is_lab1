import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";


const API_URL = 'http://localhost:8080';
// export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
//     const response = await fetch(`${API_URL}/products`);
//     if (!response.ok) {
//         console.log(response)
//         throw new Error('Failed to fetch products');
//     }
//     return await response.json();
// });

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (args) => {

    console.log(fetch)// const axiosInstance = axios.create({
    //     baseURL: 'http://localhost:8080/',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // })
    //
    // axiosInstance.interceptors.request.use(
    //     (config) => {
    //         if (token) {
    //             config.headers['Authorization'] = `Bearer ${token}`;
    //         }
    //         return config;
    //     },
    //     (error) => {
    //         return Promise.reject(error);
    //     }
    // );

    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[0]
        }
    }
    console.log(getHeaders)
    const response = await axios.get(`${API_URL}/products${args[1]}`, getHeaders);
    console.log(response.status)
    if (response.status !== 200) {
        console.log(response)
        throw new Error('Failed to fetch products');
    }
    return await response.data;
});

export const fetchUnitOfMeasure = createAsyncThunk('products/fetchUnitOfMeasure', async (token) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await axios.get(`${API_URL}/measures`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch units of measure');
    }
    console.log(response.data)
    return await response.data;
});

export const addProduct = createAsyncThunk('products/addProduct', async (args, {rejectWithValue}) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        const response = await axios.post(`${API_URL}/products`, args[0], getHeaders);
        return await response.data;
    } catch (error) {
        const regex = /model\.(\w+)/;
        const match = error.response.data.match(regex);
        if (error.response.status === 500 && error.response.data.includes("null id") && match && match[1]) {
            const modelName = match[1]
            return rejectWithValue(`Продукт с таким ${modelName} уже существует. Невозможно создать`);
        }
        throw rejectWithValue(error.response?.data?.message || error.message || 'Произошла ошибка');
    }



});

export const updateProduct = createAsyncThunk('products/updateProduct', async (args, {rejectWithValue}) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try {
        const response = await axios.put(`${API_URL}/products`, args[0], getHeaders);
        return await response.data;

    } catch (error) {
        if (error.response.status === 403) {
            return rejectWithValue(`Продукт вам не принадлежит. Невозможно изменить`);
        }
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (args, {rejectWithValue}) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    try{
        const response = await axios.delete(`${API_URL}/products/${args[0]}`, getHeaders);
        return await response.data;
    } catch (error) {
        if (error.response.status === 403) {
            return rejectWithValue(`Продукт вам не принадлежит. Невозможно удалить`);
        }
    }


});

export const deleteProductByRating = createAsyncThunk('products/deleteProduct/rating', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.delete(`${API_URL}/products/rating/${args[0]}`, getHeaders);
    console.log(response.status)
    if (response.status !== 204) {
        throw new Error('Failed to delete product');
    }
    return await response.data;
});

export const sumRating = createAsyncThunk('products/sumRating', async (token) => {
    console.log(sumRating)
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.get(`${API_URL}/products/rating`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch sum rating');
    }
    return await response.data;
});

export const lowerPriceByPercent = createAsyncThunk('products/lowerPrice', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.put(`${API_URL}/products/price:decrease/${args[0]}`, {}, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to update price');
    }
    return await response.data;
});

export const fetchBySubstring = createAsyncThunk('products/fetchBySubstring', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.get(`${API_URL}/products/substring/${args[0]}?limit=100`, getHeaders);
    if (response.status !== 200) {
        throw new Error('Failed to fetch products by substring');
    }
    return await response.data;
});


const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        unitOfMeasure: [],
        requestParams: "",
        sumRating: ""
    },
    reducers: {
        setRequestParams(state, action) {
            state.requestParams = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnitOfMeasure.pending, (state) => {
                state.loading = true; // Устанавливаем статус загрузки
                state.error = null;   // Очищаем ошибки
            })
            .addCase(fetchUnitOfMeasure.fulfilled, (state, action) => {
                state.loading = false;               // Загружено
                state.unitOfMeasure = action.payload; // Сохраняем единицы измерения
            })
            .addCase(fetchUnitOfMeasure.rejected, (state, action) => {
                state.loading = false; // Загружено
                state.error = action.error.message; // Сохраняем сообщение об ошибке
            })
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchBySubstring.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBySubstring.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchBySubstring.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(sumRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sumRating.fulfilled, (state, action) => {
                state.loading = false;
                state.sumRating = action.payload;
            })
            .addCase(sumRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(lowerPriceByPercent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(lowerPriceByPercent.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(lowerPriceByPercent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(product => product.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload; // Обновляем продукт в массиве
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteProductByRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductByRating.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product.id !== action.payload);
            })
            .addCase(deleteProductByRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {setRequestParams} = productSlice.actions;
export default productSlice.reducer;