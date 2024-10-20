import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productSlice from "./productSlice";
import personSlice from "./personSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productSlice,
        person: personSlice,
    },
});

export default store;

