import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Filters from "./Filters";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteProduct,
    fetchImportHistory,
    fetchProducts,
    fetchUnitOfMeasure,
    updateProduct
} from "../redux/productSlice";
import {fetchColors, fetchCountries, fetchPersons} from "../redux/personSlice";
import {fetchManufacturers} from "../redux/manufacturerSlice";
import {fetchCoordinates} from "../redux/coordinatesSlice";
import {fetchUsers} from "../redux/userSlice";
import {fetchAddresses} from "../redux/addressSlice";
import SuggestObject from "./SuggestObjects";
import {validateProduct} from "./validateProduct";

const ProductTable = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const requestParams = useSelector(state => state.product.requestParams);
    const products = useSelector(state => state.product.products || [])
    const color = useSelector(state => state.person.color || [])
    const country = useSelector(state => state.person.country || [])
    const unitOfMeasure = useSelector(state => state.product.unitOfMeasure)
    const owners = useSelector(state => state.person.persons)
    const officialAddresses = useSelector(state => state.address.addresses)
    const manufacturers = useSelector(state => state.manufacturer.manufacturers)
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([

                dispatch(fetchColors(token)),
                dispatch(fetchCountries(token)),
                dispatch(fetchUnitOfMeasure(token)),
                dispatch(fetchManufacturers(token)),
                dispatch(fetchPersons(token)),
                dispatch(fetchCoordinates(token)),
                dispatch(fetchUsers(token)),
                dispatch(fetchAddresses(token)),
                dispatch(fetchProducts([token, requestParams])),
                dispatch(fetchImportHistory(token))
            ]);
        };
        loadData();
        const interval = setInterval(() => {
            loadData();
        }, 5000);
        return () => clearInterval(interval);
    }, [dispatch, token, requestParams]);
    const handleRowClick = (id) => {
        setSelectedProductId(prevSelectedId => (prevSelectedId === id ? null : id));
        if (selectedProductId !== id) {
            setIsEditing(false);
        }
    };

    const handleButtonClick = async (id) => {
        await dispatch(deleteProduct([id, token]))
        await dispatch(fetchProducts([token, requestParams]))
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setEditProduct(product);
    };

    const handleChoice = () => {

    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        if (name.startsWith('coordinates.')) {
            const coordKey = name.split('.')[1];
            setEditProduct(prev => ({
                ...prev,
                coordinates: {
                    ...prev.coordinates,
                    [coordKey]: value
                }
            }));
        } else if (name.startsWith('manufacturer.officialAddress.town.')) {
            const townKey = name.split('.')[3];
            setEditProduct(prev => ({
                ...prev,
                manufacturer: {
                    ...prev.manufacturer,
                    officialAddress: {
                        ...prev.manufacturer.officialAddress,
                        town: {
                            ...prev.manufacturer.officialAddress.town,
                            [townKey]: value
                        }
                    }
                }
            }));
        } else if (name.startsWith('manufacturer.officialAddress.')) {
            const index = name.split('.')[2];
            setEditProduct(prev => ({
                ...prev,
                manufacturer: {
                    ...prev.manufacturer,
                    officialAddress: {
                        ...prev.manufacturer.officialAddress,
                        [index]: value
                    }
                }
            }));
        } else if (name.startsWith('manufacturer.')) {
            const field = name.split('.')[1];
            setEditProduct(prev => ({
                ...prev,
                manufacturer: {
                    ...prev.manufacturer,
                    [field]: value
                }
            }));
        } else if (name.startsWith('owner.location.')) {
            const locationKey = name.split('.')[2];
            setEditProduct(prev => ({
                ...prev,
                owner: {
                    ...prev.owner,
                    location: {
                        ...prev.owner.location,
                        [locationKey]: value
                    }
                }
            }));
        } else if (name.startsWith('owner.')) {
            const personKey = name.split('.')[1];
            setEditProduct(prev => ({
                ...prev,
                owner: {
                    ...prev.owner,
                    [personKey]: value
                }
            }));
        } else {
            setEditProduct(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validate = () => {
        const newErrors = validateProduct(editProduct)
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Возвращаем true, если нет ошибок
    };

    const handleConfirmClick = async () => {
        if (validate()) {
            console.log('Updating product', JSON.stringify(editProduct));
            await dispatch(updateProduct([editProduct, token]))
            await dispatch(fetchProducts([token, requestParams]))
            setIsEditing(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchProducts([token, requestParams]));
            await dispatch(fetchImportHistory(token))
            setLoading(false);
        };
        loadData();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>; // Можно отобразить индикатор загрузки
    }

    return (
        <div>
            <Filters/>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Координаты</th>
                    <th>Дата</th>
                    <th>Измерение</th>
                    <th>Производитель</th>
                    <th>Стоимость</th>
                    <th>Себестоимость</th>
                    <th>Рейтинг</th>
                    <th>Владелец</th>
                    <th>Создатель</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {products.length > 0 ? (
                    products.map(product => (
                        <React.Fragment key={product.id}>
                            <tr className="productTableBody" onClick={() => handleRowClick(product.id)}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{`(${product.coordinates.x}, ${product.coordinates.y})`}</td>
                                <td>{product.creationDate}</td>
                                <td>{product.unitOfMeasure}</td>
                                <td>{product.manufacturer.name}</td>
                                <td>{product.price}</td>
                                <td>{product.manufactureCost}</td>
                                <td>{product.rating}</td>
                                <td>{product.owner.name}</td>
                                <td>{product.user.login}</td>
                                <td>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleButtonClick(product.id);
                                    }}
                                            className="icon-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                             fill="currentColor"
                                             className="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0
                                            2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3
                                            4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1
                                            .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0
                                            1 1 0"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            {selectedProductId === product.id && (
                                <tr>
                                    <td colSpan="12">
                                        <h4>Детальная информация о продукте</h4>
                                        {!isEditing ? (<div>
                                            <div className="creation-box max-width">
                                                <div className="item-box flex-row">
                                                    <div>
                                                        <span>Название</span>
                                                        <p>{product.name}</p>
                                                        <p>
                                                            <span>Единица измерения</span>
                                                            <p> {product.unitOfMeasure}</p>
                                                        </p>
                                                        <p>
                                                            <span>Стоимость</span>
                                                            <p>{product.price}</p>
                                                        </p>
                                                        <p>
                                                            <span>Себестоимость</span>
                                                            <p>{product.manufactureCost}</p>
                                                        </p>
                                                        <p>
                                                            <span>Рейтинг</span>
                                                            <p>{product.rating}</p>
                                                        </p>
                                                        <div className="item-box">
                                                            <h2>Координаты</h2>
                                                            <p>
                                                                <span>X</span>
                                                                <p>{product.coordinates.x}</p>
                                                            </p>
                                                            <p>
                                                                <span>Y</span>
                                                                <p>{product.coordinates.y}</p>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="item-box flex-row">
                                                        <div>
                                                            <h2>Владелец</h2>
                                                            <p>
                                                                <span>Имя</span>
                                                                <p>{product.owner.name}</p>
                                                            </p>
                                                            <p>
                                                                <span>Цвет глаз</span>
                                                                <p>{product.owner.eyeColor}</p>
                                                            </p>
                                                            <p>
                                                                <span>Цвет волос</span>
                                                                <p>{product.owner.hairColor}</p>
                                                            </p>
                                                            <p>
                                                                <span>Рост</span>
                                                                <p>{product.owner.height}</p>
                                                            </p>
                                                            <p>
                                                                <span>Национальность</span>
                                                                <p>{product.owner.nationality}</p>
                                                            </p>
                                                            <div className="item-box">
                                                                <h2>Город</h2>
                                                                <p>
                                                                    <span>X</span>
                                                                    <p>{product.owner.location.x}</p>
                                                                </p>
                                                                <p>
                                                                    <span>Y</span>
                                                                    <p>{product.owner.location.y}</p>
                                                                </p>
                                                                <p>
                                                                    <span>Z</span>
                                                                    <p>{product.owner.location.z}</p>
                                                                </p>
                                                                <p>
                                                                    <span>Название</span>
                                                                    <p>{product.owner.location.name}</p>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="item-box flex-row">
                                                        <div>
                                                            <h2>Производитель</h2>
                                                            <p>
                                                                <span>Название</span>
                                                                <p>{product.manufacturer.name}</p>
                                                            </p>
                                                            <p>
                                                                <span>Ежегодный оборот</span>
                                                                <p>{product.manufacturer.annualTurnover}</p>
                                                            </p>
                                                            <p>
                                                                <span>Количество работников</span>
                                                                <p>{product.manufacturer.employeesCount}</p>
                                                            </p>
                                                            <p>
                                                                <span>Полное название</span>
                                                                <p>{product.manufacturer.fullName}</p>
                                                            </p>
                                                            <p>
                                                                <span>Рейтинг</span>
                                                                <p>{product.manufacturer.rating}</p>
                                                            </p>

                                                            <div className="item-box flex-row">
                                                                <div>
                                                                    <h2>Официальный адрес </h2>
                                                                    <p>
                                                                        <span>Индекс</span>
                                                                        <p>{product.manufacturer.officialAddress.zipCode}</p>
                                                                    </p>
                                                                    <div className="item-box">
                                                                        <h2>Город</h2>
                                                                        <p>
                                                                            <span>X</span>
                                                                            <p>{product.manufacturer.officialAddress.town.x}</p>
                                                                        </p>
                                                                        <p>
                                                                            <span>Y</span>
                                                                            <p>{product.manufacturer.officialAddress.town.y}</p>
                                                                        </p>
                                                                        <p>
                                                                            <span>Z</span>
                                                                            <p>{product.manufacturer.officialAddress.town.z}</p>
                                                                        </p>
                                                                        <p>
                                                                            <span>Название</span>
                                                                            <p>{product.manufacturer.officialAddress.town.name}</p>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary"
                                                    onClick={() => handleEditClick(product)}>Изменить
                                            </button>
                                        </div>) : (
                                            <div>
                                                <div className="creation-box">
                                                    <div className="item-box flex-row">
                                                        <div>
                                                            <span>Название</span>
                                                            <input name="name" value={editProduct.name}
                                                                   onChange={handleInputChange}/>
                                                            {errors.name &&
                                                                <p className="error-popup">{errors.name}</p>}
                                                            <p>
                                                                <span>Единица измерения</span>
                                                                <select
                                                                    name="unitOfMeasure"
                                                                    value={editProduct.unitOfMeasure}
                                                                    onChange={handleInputChange}
                                                                >
                                                                    <option value=""
                                                                            disabled={editProduct.unitOfMeasure}
                                                                            selected={true}>
                                                                        Выберите единицу измерения
                                                                    </option>
                                                                    {unitOfMeasure.map((option) => (
                                                                        <option key={option} value={option}>
                                                                            {option}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {errors.unitOfMeasure &&
                                                                    <p className="error-popup">{errors.unitOfMeasure}</p>}
                                                            </p>
                                                            <p>
                                                                <span>Стоимость</span>
                                                                <input name="price"
                                                                       value={editProduct.price}
                                                                       onChange={handleInputChange}/>
                                                                {errors.price &&
                                                                    <p className="error-popup">{errors.price}</p>}
                                                            </p>
                                                            <p>
                                                                <span>Себестоимость</span>
                                                                <input name="manufactureCost"
                                                                       value={editProduct.manufactureCost}
                                                                       onChange={handleInputChange}/>
                                                                {errors.manufactureCost &&
                                                                    <p className="error-popup">{errors.manufactureCost}</p>}
                                                            </p>
                                                            <p>
                                                                <span>Рейтинг</span>
                                                                <input name="rating"
                                                                       value={editProduct.rating}
                                                                       onChange={handleInputChange}/>
                                                                {errors.rating &&
                                                                    <p className="error-popup">{errors.rating}</p>}
                                                            </p>


                                                            <div className="item-box">
                                                                <h2>Координаты</h2>
                                                                <p>
                                                                    <span>X</span>
                                                                    <input name="coordinates.x"
                                                                           value={editProduct.coordinates.x}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.coordinatesX &&
                                                                        <p className="error-popup">{errors.coordinatesX}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Y</span>
                                                                    <input name="coordinates.y"
                                                                           value={editProduct.coordinates.y}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.coordinatesY &&
                                                                        <p className="error-popup">{errors.coordinatesY}</p>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="item-box flex-row">
                                                            <div>
                                                                <h2>Владелец</h2>
                                                                <p>
                                                                    <span>Имя</span>
                                                                    <input name="owner.name"
                                                                           value={editProduct.owner.name}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.ownerName &&
                                                                        <p className="error-popup">{errors.ownerName}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Цвет глаз</span>
                                                                    <select name="owner.eyeColor"
                                                                            value={editProduct.owner.eyeColor}
                                                                            onChange={handleInputChange}>
                                                                        <option value=""
                                                                                disabled={editProduct.owner.eyeColor}
                                                                                selected={true}>
                                                                            Выберите цвет
                                                                        </option>
                                                                        {color.map((option) => (
                                                                            <option key={option}
                                                                                    value={option}>{option}</option>
                                                                        ))}
                                                                    </select>
                                                                    {errors.ownerEyeColor &&
                                                                        <p className="error-popup">{errors.ownerEyeColor}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Цвет волос</span>
                                                                    <select name="owner.hairColor"
                                                                            value={editProduct.owner.hairColor}
                                                                            onChange={handleInputChange}>
                                                                        <option value=""
                                                                                disabled={editProduct.owner.hairColor}
                                                                                selected={true}>
                                                                            Выберите цвет
                                                                        </option>
                                                                        {color.map((option) => (
                                                                            <option key={option}
                                                                                    value={option}>{option}</option>
                                                                        ))}
                                                                    </select>
                                                                    {errors.ownerHairColor &&
                                                                        <p className="error-popup">{errors.ownerHairColor}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Рост</span>
                                                                    <input name="owner.height"
                                                                           value={editProduct.owner.height}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.ownerHeight &&
                                                                        <p className="error-popup">{errors.ownerHeight}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Национальность</span>
                                                                    <select name="owner.nationality"
                                                                            value={editProduct.owner.nationality}
                                                                            onChange={handleInputChange}>
                                                                        <option value=""
                                                                                disabled={editProduct.owner.nationality}
                                                                                selected={true}>
                                                                            Выберите национальность
                                                                        </option>
                                                                        {country.map((option) => (
                                                                            <option key={option}
                                                                                    value={option}>{option}</option>
                                                                        ))}
                                                                    </select>
                                                                    {errors.ownerNationality &&
                                                                        <p className="error-popup">{errors.ownerNationality}</p>}
                                                                </p>
                                                                <div className="item-box">
                                                                    <h2>Город</h2>
                                                                    <p>
                                                                        <span>X</span>
                                                                        <input name="owner.location.x"
                                                                               value={editProduct.owner.location.x}
                                                                               onChange={handleInputChange}/>
                                                                        {errors.ownerLocationX &&
                                                                            <p className="error-popup">{errors.ownerLocationX}</p>}
                                                                    </p>
                                                                    <p>
                                                                        <span>Y</span>
                                                                        <input name="owner.location.y"
                                                                               value={editProduct.owner.location.y}
                                                                               onChange={handleInputChange}/>
                                                                        {errors.ownerLocationY &&
                                                                            <p className="error-popup">{errors.ownerLocationY}</p>}
                                                                    </p>
                                                                    <p>
                                                                        <span>Z</span>
                                                                        <input name="owner.location.z"
                                                                               value={editProduct.owner.location.z}
                                                                               onChange={handleInputChange}/>
                                                                        {errors.ownerLocationZ &&
                                                                            <p className="error-popup">{errors.ownerLocationZ}</p>}
                                                                    </p>
                                                                    <p>
                                                                        <span>Название</span>
                                                                        <input name="owner.location.name"
                                                                               value={editProduct.owner.location.name}
                                                                               onChange={handleInputChange}/>
                                                                        {errors.ownerLocationName &&
                                                                            <p className="error-popup">{errors.ownerLocationName}</p>}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <SuggestObject mass={owners} name="owner"
                                                                           handleChoice={handleChoice}
                                                                           amountOfLabels={1}
                                                                           labelKey="name"/>


                                                        </div>

                                                        <div className="item-box flex-row">
                                                            <div>
                                                                <h2>Производитель</h2>
                                                                <p>
                                                                    <span>Название</span>
                                                                    <input name="manufacturer.name"
                                                                           value={editProduct.manufacturer.name}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.manufacturerName &&
                                                                        <p className="error-popup">{errors.manufacturerName}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Ежегодный оборот</span>
                                                                    <input name="manufacturer.annualTurnover"
                                                                           value={editProduct.manufacturer.annualTurnover}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.annualTurnover &&
                                                                        <p className="error-popup">{errors.annualTurnover}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Количество работников</span>
                                                                    <input name="manufacturer.employeesCount"
                                                                           value={editProduct.manufacturer.employeesCount}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.employeesCount &&
                                                                        <p className="error-popup">{errors.employeesCount}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Полное название</span>
                                                                    <input name="manufacturer.fullName"
                                                                           value={editProduct.manufacturer.fullName}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.fullName &&
                                                                        <p className="error-popup">{errors.fullName}</p>}
                                                                </p>
                                                                <p>
                                                                    <span>Рейтинг</span>
                                                                    <input name="manufacturer.rating"
                                                                           value={editProduct.manufacturer.rating}
                                                                           onChange={handleInputChange}/>
                                                                    {errors.manufacturerRating &&
                                                                        <p className="error-popup">{errors.manufacturerRating}</p>}
                                                                </p>

                                                                <div className="item-box flex-row">
                                                                    <div>
                                                                        <h2>Официальный адрес </h2>
                                                                        <p>
                                                                            <span>Индекс</span>
                                                                            <input
                                                                                name="manufacturer.officialAddress.zipCode"
                                                                                value={editProduct.manufacturer.officialAddress.zipCode}
                                                                                onChange={handleInputChange}/>
                                                                            {errors.zipCode &&
                                                                                <p className="error-popup">{errors.zipCode}</p>}
                                                                        </p>
                                                                        <div className="item-box">
                                                                            <h2>Город</h2>
                                                                            <p>
                                                                                <span>X</span>
                                                                                <input
                                                                                    name="manufacturer.officialAddress.town.x"
                                                                                    value={editProduct.manufacturer.officialAddress.town.x}
                                                                                    onChange={handleInputChange}/>
                                                                                {errors.townX &&
                                                                                    <p className="error-popup">{errors.townX}</p>}
                                                                            </p>
                                                                            <p>
                                                                                <span>Y</span>
                                                                                <input
                                                                                    name="manufacturer.officialAddress.town.y"
                                                                                    value={editProduct.manufacturer.officialAddress.town.y}
                                                                                    onChange={handleInputChange}/>
                                                                                {errors.townY &&
                                                                                    <p className="error-popup">{errors.townY}</p>}
                                                                            </p>
                                                                            <p>
                                                                                <span>Z</span>
                                                                                <input
                                                                                    name="manufacturer.officialAddress.town.z"
                                                                                    value={editProduct.manufacturer.officialAddress.town.z}
                                                                                    onChange={handleInputChange}/>
                                                                                {errors.townZ &&
                                                                                    <p className="error-popup">{errors.townZ}</p>}
                                                                            </p>
                                                                            <p>
                                                                                <span>Название</span>
                                                                                <input
                                                                                    name="manufacturer.officialAddress.town.name"
                                                                                    value={editProduct.manufacturer.officialAddress.town.name}
                                                                                    onChange={handleInputChange}/>
                                                                                {errors.townName &&
                                                                                    <p className="error-popup">{errors.townName}</p>}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <SuggestObject mass={officialAddresses}
                                                                                   name="manufacturer.officialAddress"
                                                                                   handleChoice={handleChoice}
                                                                                   amountOfLabels={1}
                                                                                   labelKey="zipCode"/>
                                                                </div>
                                                            </div>
                                                            <SuggestObject mass={manufacturers} name="manufacturer"
                                                                           handleChoice={handleChoice}
                                                                           amountOfLabels={1} labelKey="name"/>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-success"
                                                            onClick={handleConfirmClick}>Подтвердить
                                                    </button>
                                                </div>
                                            </div>)}

                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan="11" className="align-center">Нет доступных продуктов</td>
                    </tr>
                )}

                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;