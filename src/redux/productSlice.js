import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {useSelector} from "react-redux";


const API_URL = 'http://localhost:8080';
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return await response.json();
});

export const fetchUnitOfMeasure = createAsyncThunk('products/fetchUnitOfMeasure', async () => {
    const response = await fetch(`${API_URL}/measures`);
    if (!response.ok) {
        throw new Error('Failed to fetch units of measure');
    }
    return await response.json();
});

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct, token) => {
    const response = await fetch(`${API_URL}/products`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
    });
    if (!response.ok) {
        throw new Error('Failed to add product');
    }
    return await response.json();
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (updatedProduct, token) => {
    const response = await fetch(`${API_URL}/products/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
    },
    reducers: {},
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

export default productSlice.reducer;