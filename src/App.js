import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import store from './redux/store'
import Header from './components/Header';
import Auth from './components/Auth';
import ProductTable from './components/ProductTable';
import './index.css';
import Actions from "./components/Actions";
import CreateProduct from "./components/CreateProduct";
import {fetchColors, fetchCountries} from "./redux/personSlice";
import {fetchUnitOfMeasure} from "./redux/productSlice";
import {PersistGate} from "redux-persist/integration/react";
import {persistor} from "./redux/store";
import Administration from "./components/Administration"; // Импортируем стили
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();


    return (
        <div className="container">
            <div className="background overlay">
                <div >
                    <ToastContainer
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar={true}
                    />
                    <div className="header">
                        <Header/>
                    </div>
                    <div className="mainPage">
                        {isAuthenticated ?
                            <div className="columns">
                                <div className="products">
                                    <ProductTable/>
                                </div>
                                <div className="actions">
                                    <Administration/>
                                    <CreateProduct/>
                                    <Actions/>
                                </div>
                            </div>
                            : <Auth/>}


                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppContent/>
            </PersistGate>
        </Provider>
    );
};

export default App;