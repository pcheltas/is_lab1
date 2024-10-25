import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productSlice from "./productSlice";
import personSlice from "./personSlice";
import manufacturerSlice from "./manufacturerSlice";
import coordinateSlice from "./coordinatesSlice";
import userSlice from "./userSlice";
import storage from 'redux-persist/lib/storage';
import {persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,} from "redux-persist";
import addressSlice from "./addressSlice";
import adminSlice from "./adminSlice";
import errorMiddleware from "./errorMiddleware"; // по умолчанию использует localStorage

export const API_URL = 'http://localhost:6128';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // указываем только те редюсеры, которые хотим сохранять
};

const rootReducer = combineReducers({
    auth: authReducer,
    product: productSlice,
    person: personSlice,
    manufacturer: manufacturerSlice,
    coordinate: coordinateSlice,
    user: userSlice,
    address: addressSlice,
    admin: adminSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: {
    //             ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    //         },
    //     }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(errorMiddleware),
})

export const persistor = persistStore(store)
export default store