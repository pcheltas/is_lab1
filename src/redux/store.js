import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productSlice from "./productSlice";
import personSlice from "./personSlice";
import manufacturerSlice from "./manufacturerSlice";
import coordinateSlice from "./coordinatesSlice";
import userSlice from "./userSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productSlice,
        person: personSlice,
        manufacturer: manufacturerSlice,
        coordinate: coordinateSlice,
        user: userSlice
    },
});

export default store;

