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
    REGISTER,} from "redux-persist"; // по умолчанию использует localStorage

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
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store)
export default store

// const store = configureStore({
//     reducer: {
//         auth: persistedReducer,
//         product: productSlice,
//         person: personSlice,
//         manufacturer: manufacturerSlice,
//         coordinate: coordinateSlice,
//         user: userSlice
//     },
// });
// export default store; // Используем экспорт по умолчанию
// export const persistor = persistStore(store); // Остальные экспорты могут быть именованными
// const persistor = persistStore(store);
// export { store, persistor };
// // export default store;
// // export default () => {
// //     let persistor = persistStore(store)
// //     return { store, persistor }
// }
