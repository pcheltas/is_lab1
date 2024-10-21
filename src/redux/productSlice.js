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

export const addProduct = createAsyncThunk('products/addProduct', async (args) => {
    const getHeaders = {
        headers: {
            'Authorization': 'Bearer ' + args[1],
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.post(`${API_URL}/products`, args[0], getHeaders);
    if (response.status !== 201) {
        throw new Error('Failed to add product');
    }
    return await response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (updatedProduct, token) => {
    const response = await fetch(`${API_URL}/products/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + token,
        },
        body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
        throw new Error('Failed to update product');
    }
    return await response.json();
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, token) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete product');
    }
    return id; // Возвращаем ID удаленного продукта
});

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [  ],
        unitOfMeasure: [ ],
        requestParams: ""
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
                console.log(action.payload)
                console.log(action.error.message)
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
            });
    },
});

export const { setRequestParams } = productSlice.actions;
export default productSlice.reducer;