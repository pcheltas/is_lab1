import React, {useEffect} from 'react';
import {Provider, useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import store from './redux/store'
import Header from './components/Header';
import Auth from './components/Auth';
import ProductTable from './components/ProductTable';
import './index.css';
import Actions from "./components/Actions";
import CreateProduct from "./components/CreateProduct";
import {fetchColors, fetchCountries} from "./redux/personSlice";
import {fetchUnitOfMeasure} from "./redux/productSlice"; // Импортируем стили

const AppContent = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();


    return (
        <div className="container">
            <div className="header">
                <Header />
            </div>
            <div className="mainPage">
                {isAuthenticated ?
                    <div className="columns">
                        <div className="products">
                            <ProductTable/>
                        </div>
                        <div className="actions">
                            <CreateProduct/>
                            <Actions/>
                        </div>
                    </div>
                        : <Auth />}



            </div>
        </div>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
};

export default App;