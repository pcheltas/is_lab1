import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import coordinatesSlice from "../redux/coordinatesSlice";
import {fetchProducts, setRequestParams} from "../redux/productSlice";
import ReactPaginate from "react-paginate";
import '../pagination.css'

const Filters = () => {
    const manufacturers = useSelector(state => state.manufacturer.manufacturers)
    const persons = useSelector(state => state.person.persons)
    const users = useSelector(state => state.user.users)
    const coordinates = useSelector(state => state.coordinate.coordinates)
    const token = useSelector(state => state.auth.token)
    const requestParams = useSelector(state => state.product.requestParams)
    // const pageCount = useSelector(state => state.product.products[0].totalPages)
    const pageCount = useSelector(state => {
        return state.product.products.length > 0
            ? state.product.products[0].totalPages || 0
            : 0;
    });
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedAsc, setSelectedAsc] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const initialState = {
        name: '',
        coordinates: '',
        createdAt: '',
        unitOfMeasure: '',
        manufacturer: '',
        price: '',
        manufactureCost: '',
        rating: '',
        owner: '',
        login: '',

    }
    const filterOptions = [
        { label: 'Название', name: 'name', type: 'text' },
        { label: 'Координаты', name: 'coordinates', type: 'text' },
        { label: 'Дата', name: 'createdAt', type: 'date' },
        { label: 'Название производителя', name: 'manufacturer', type: 'text' },
        { label: 'Стоимость', name: 'price', type: 'number' },
        { label: 'Себестоимость', name: 'manufactureCost', type: 'number' },
        { label: 'Рейтинг', name: 'rating', type: 'number' },
        { label: 'Владелец', name: 'owner', type: 'text' },
        { label: 'Создатель', name: 'login', type: 'text' },
    ];

    const sortOptions = [
        { label: 'Название', value: 'name' },
        { label: 'Координаты', value: 'coordinates' },
        { label: 'Дата создания', value: 'createdAt' },
        { label: 'Единица измерения', value: 'unitOfMeasure' },
        { label: 'Производитель', value: 'manufacturer' },
        { label: 'Стоимость', value: 'price' },
        { label: 'Себестоимость', value: 'manufactureCost' },
        { label: 'Рейтинг', value: 'rating' },
        { label: 'Владелец', value: 'owner' },
        { label: 'Создатель', value: 'login' },
    ];
    const [filters, setFilters] = useState(initialState);
    const unitOfMeasure = useSelector(state => state.product.unitOfMeasure)

    const searchManufacturerByName = (name) => {
        const man = manufacturers.find(manufacturer => manufacturer.name === name);
        return man ? man.id : '';
    };

    const searchOwnerByName = (name) => {
        const pers = persons.find(person => person.name === name);
        return pers ? pers.id : '';
    };

    const searchUserByLogin = (login) => {
        const us = users.find(person => person.name === login);
        return us ? us.id : '';
    };

    const searchCoordinateByXY = (XY) => {
        console.log(filters)

        // console.log(if(XY))
        if (XY && XY.trim() !== '') {
            const [x, y] = XY.split(" ").map(Number);
            const index = coordinates.find(coord => coord.x === x && coord.y === y);
            return index !== -1 ? index.id : null;
        }
        return '';
    };

    const clearFields = () => {
        setFilters(initialState);
        setSelectedSort('')
        setSelectedAsc('')
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSortChange = (event) => {
        setSelectedSort(event.target.value);
    };

    const handleAscChange = (event) => {
        setSelectedAsc(event.target.value);
    };

    const formRequest = (page) => {
        const queryParams = [];
        console.log("formRequest: " + page)
        for (const [key, value] of Object.entries(filters)) {
            if (value) { // Проверяем, что значение не пустое
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }

        if (selectedSort) {
            queryParams.push(`sortBy=${encodeURIComponent(selectedSort)}`);
        }
        if (selectedAsc) {
            queryParams.push(`ascending=${encodeURIComponent(selectedAsc)}`);
        }
        if (page >= 0) {
            queryParams.push(`page=${encodeURIComponent(page)}`);
        }
        if (limit >= 0) {
            queryParams.push(`limit=${encodeURIComponent(limit)}`);
        }

        return `?${queryParams.join('&')}`;

    }

    const handlePageClick = (event) => {
        setPage(event.selected)
        if (!requestParams.includes('?')) {
            return `?page=${event.selected}`;
        }
        const [base, params] = requestParams.split('?');
        const newParams = `page=${event.selected}&${params}`;
        const newRequest = `${base}?${newParams}`; // Склеиваем обратно
        dispatch(setRequestParams(newRequest))
        dispatch(fetchProducts([token, newRequest]))
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value)
        if (!requestParams.includes('?')) {
            return `?limit=${event.target.value}`;
        }
        const [base, params] = requestParams.split('?');
        const newParams = `limit=${event.target.value}&${params}`;
        const newRequest = `${base}?${newParams}`; // Склеиваем обратно
        dispatch(setRequestParams(newRequest))
        dispatch(fetchProducts([token, newRequest]))
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        console.log(name, value)
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        filters.manufacturer = searchManufacturerByName(filters.manufacturer)
        filters.owner = searchOwnerByName(filters.owner)
        filters.coordinates = searchCoordinateByXY(filters.coordinates)
        filters.login = searchUserByLogin(filters.login)
        console.log('Применение фильтров:', JSON.stringify(filters));
        console.log('Сортировать по колонке ' + selectedSort)
        console.log('Сортировать по ' + selectedAsc)
        console.log(selectedAsc)
        const request = formRequest()
        console.log(request)
        dispatch(setRequestParams(request))
        dispatch(fetchProducts([token, request]))
        setIsOpen(false);
        clearFields();
    };

    return (
        <div className="filter-component">
            <button onClick={toggleDropdown} className="filter-button">
                Фильтр
            </button>
            {isOpen && (
                <div className="filter-dropdown-overlay" onClick={() => setIsOpen(false)}>
                    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                        {filterOptions.map(({ label, name, type }) => (
                            <div className="filter-option" key={name}>
                                <span>{label}</span>
                                <input
                                    type={type}
                                    name={name}
                                    value={filters[name] || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                        <span>Единица измерения</span>
                        <select
                            name="unitOfMeasure"
                            value={filters.unitOfMeasure || ''}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Выберите единицу измерения</option>
                            {unitOfMeasure.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <h2>Сортировка</h2>
                        {sortOptions.map(({ label, value }) => (
                            <div key={value}>
                                <label>
                                    <input
                                        type="radio"
                                        value={value}
                                        checked={selectedSort === value}
                                        onChange={handleSortChange}
                                    />
                                    {label}
                                </label>
                            </div>
                        ))}
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="true"
                                    checked={selectedAsc === 'true'}
                                    onChange={handleAscChange}
                                />
                                По убыванию
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="false"
                                    checked={selectedAsc === 'false'}
                                    onChange={handleAscChange}
                                />
                                По возрастанию
                            </label>
                        </div>
                        <div>
                            <button onClick={applyFilters} className="apply-button">
                                Применить
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div id="container">
                {pageCount > 0 && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={2}
                        pageCount={Math.ceil(pageCount)}
                        // pageCount={Math.ceil(10)}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        breakClassName={'break-me'}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                )}
                <div>
                    <label htmlFor="options">Количество продуктов на странице</label>
                    <select id="options" value={limit} onChange={handleLimitChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Filters;