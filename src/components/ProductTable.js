import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Filters from "./Filters";
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts, fetchUnitOfMeasure} from "../redux/productSlice";
import {fetchColors, fetchCountries, fetchPersons} from "../redux/personSlice";
import {fetchManufacturers} from "../redux/manufacturerSlice";
import {fetchCoordinates} from "../redux/coordinatesSlice";
import {fetchUsers} from "../redux/userSlice";

const ProductTable = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const requestParams = useSelector(state => state.product.requestParams);
    const products = useSelector(state => state.product.products || [])
    const color = useSelector(state => state.person.color || [])
    const country = useSelector(state => state.person.country || [])
    const unitOfMeasure = useSelector(state => state.product.unitOfMeasure)
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editProduct, setEditProduct] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                dispatch(fetchColors(token)),
                dispatch(fetchCountries(token)),
                dispatch(fetchUnitOfMeasure(token)),
                dispatch(fetchManufacturers(token)),
                dispatch(fetchPersons(token)),
                dispatch(fetchCoordinates(token)),
                dispatch(fetchUsers(token))
                // dispatch(fetchProducts())
            ]);
        };
        loadData(); // Вызываем асинхронную функцию
    }, [dispatch]);
    const handleRowClick = (id) => {
        setSelectedProductId(prevSelectedId => (prevSelectedId === id ? null : id));
        if (selectedProductId !== id) {
            setIsEditing(false);
        }
    };

    const handleButtonClick = () => {
        console.log("bin");
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setEditProduct(product);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditProduct(prev => ({...prev, [name]: value}));
    };

    const handleConfirmClick = () => {
        console.log('Updating product', JSON.stringify(editProduct));
        setIsEditing(false);
    };

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchProducts([token, requestParams]));
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
                                            handleButtonClick();
                                        }}
                                                className="icon-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
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
                                        <td colSpan="11">
                                            <div>
                                                <h4>Детальная информация о продукте</h4>
                                                {!isEditing ? (
                                                        <div className="border p-3 mt-3">
                                                            <p><strong>ID:</strong> {product.id}</p>
                                                            <p><strong>Название:</strong> {product.name}</p>

                                                            <p><strong>Координаты:</strong></p>
                                                            <p style={{marginLeft: '20px'}}>X: {product.coordinates.x}</p>
                                                            <p style={{marginLeft: '20px'}}>Y: {product.coordinates.y}</p>

                                                            <p><strong>Дата создания:</strong> {product.creationDate}</p>

                                                            <p><strong>Единица измерения:</strong> {product.unitOfMeasure}</p>

                                                            <p><strong>Производитель:</strong></p>
                                                            <p style={{marginLeft: '20px'}}>ID: {product.manufacturer.id}</p>
                                                            <p style={{marginLeft: '20px'}}>Название: {product.manufacturer.name}</p>
                                                            <p style={{marginLeft: '20px'}}><strong>Официальный адрес:</strong></p>
                                                            <p style={{marginLeft: '40px'}}>Индекс: {product.manufacturer.officialAddress.zipcode}
                                                            </p>
                                                            <p style={{marginLeft: '40px'}}><strong>Город:</strong></p>
                                                            <p style={{marginLeft: '60px'}}>X: {product.manufacturer.officialAddress.town.x}
                                                            </p>
                                                            <p style={{marginLeft: '60px'}}>Y: {product.manufacturer.officialAddress.town.y}
                                                            </p>
                                                            <p style={{marginLeft: '60px'}}>Z: {product.manufacturer.officialAddress.town.z}
                                                            </p>
                                                            <p style={{marginLeft: '60px'}}>Название: {product.manufacturer.officialAddress.town.name}
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Ежегодный оборот: {product.manufacturer.annualTurnover}</p>
                                                            <p style={{marginLeft: '20px'}}>Количество сотрудников: {product.manufacturer.employeesCount}</p>
                                                            <p style={{marginLeft: '20px'}}>Полное название: {product.manufacturer.fullName}</p>
                                                            <p style={{marginLeft: '20px'}}>Рейтинг: {product.manufacturer.rating}</p>

                                                            <p><strong>Цена:</strong> {product.price}</p>
                                                            <p><strong>Себестоимость:</strong> {product.manufactureCost}</p>
                                                            <p><strong>Рейтинг:</strong> {product.rating}</p>

                                                            <p><strong>Владелец:</strong></p>
                                                            <p style={{marginLeft: '20px'}}>Имя: {product.owner.name}</p>
                                                            <p style={{marginLeft: '20px'}}>Цвет глаз: {product.owner.eyeColor}</p>
                                                            <p style={{marginLeft: '20px'}}>Цвет волос: {product.owner.hairColor}</p>
                                                            <p style={{marginLeft: '20px'}}><strong>Город:</strong></p>
                                                            <p style={{marginLeft: '40px'}}>X: {product.owner.location.x}</p>
                                                            <p style={{marginLeft: '40px'}}>Y: {product.owner.location.y}</p>
                                                            <p style={{marginLeft: '40px'}}>Z: {product.owner.location.z}</p>
                                                            <p style={{marginLeft: '40px'}}>Название: {product.owner.location.name}</p>
                                                            <p style={{marginLeft: '20px'}}>
                                                                <strong>Рост:</strong> {product.owner.height}</p>
                                                            <p style={{marginLeft: '20px'}}>
                                                                <strong>Национальность:</strong> {product.owner.nationality}</p>
                                                            <button className="btn btn-primary"
                                                                    onClick={() => handleEditClick(product)}>Изменить
                                                            </button>
                                                        </div>
                                                    )
                                                    : (
                                                        <div className="border p-3 mt-3">
                                                            <p><strong>ID:</strong> {product.id}</p>
                                                            <p><strong>Название:</strong>
                                                                <input className="form-control" name="name" value={editProduct.name}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p><strong>Координаты:</strong></p>
                                                            <p style={{marginLeft: '20px'}}>X:
                                                                <input name="coordinates.x" value={editProduct.coordinates.x}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Y:
                                                                <input name="coordinates.y" value={editProduct.coordinates.y}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p><strong>Дата создания:</strong>
                                                                {product.creationDate}
                                                            </p>
                                                            <p><strong>Единица измерения:</strong>
                                                                <select name="unitOfMeasure" value={editProduct.unitOfMeasure}
                                                                        onChange={handleInputChange}>
                                                                    {unitOfMeasure.map((option) => (
                                                                        <option key={option} value={option}>{option}</option>
                                                                    ))}
                                                                </select>
                                                            </p>
                                                            <p><strong>Производитель:</strong></p>
                                                            <p style={{marginLeft: '20px'}}>id:
                                                                <input name="manufacturer.id"
                                                                       value={editProduct.manufacturer.id}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Название:
                                                                <input name="manufacturer.name"
                                                                       value={editProduct.manufacturer.name}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}><strong>Официальный адрес: </strong>
                                                            </p>
                                                            <p style={{marginLeft: '40px'}}>Индекс:
                                                                <input name="manufacturer.officialAddress.zipcode"
                                                                       value={editProduct.manufacturer.officialAddress.zipcode}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '40px'}}><strong>Город: </strong></p>
                                                            <p style={{marginLeft: '60px'}}>X
                                                                <input name="manufacturer.officialAddress.town.x"
                                                                       value={editProduct.manufacturer.officialAddress.town.x}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '60px'}}>Y
                                                                <input name="manufacturer.officialAddress.town.y"
                                                                       value={editProduct.manufacturer.officialAddress.town.y}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '60px'}}>Z
                                                                <input name="manufacturer.officialAddress.town.z"
                                                                       value={editProduct.manufacturer.officialAddress.town.z}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '60px'}}>Название:
                                                                <input name="manufacturer.officialAddress.town.name"
                                                                       value={editProduct.manufacturer.officialAddress.town.name}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Ежегодный оборот:
                                                                <input name="manufacturer.annualTurnover"
                                                                       value={editProduct.manufacturer.annualTurnover}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Количество работников:
                                                                <input name="manufacturer.employeesCount"
                                                                       value={editProduct.manufacturer.employeesCount}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Полное название:
                                                                <input name="manufacturer.fullName"
                                                                       value={editProduct.manufacturer.fullName}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}>Рейтинг:
                                                                <input name="manufacturer.rating"
                                                                       value={editProduct.manufacturer.rating}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p><strong>Стоимость:</strong>
                                                                <input name="price" value={editProduct.price}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p><strong>Себестоимость:</strong>
                                                                <input name="manufactureCost"
                                                                       value={editProduct.manufactureCost}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p><strong>Рейтинг:</strong>
                                                                <input name="rating" value={editProduct.rating}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p><strong>Владелец:</strong></p>
                                                            <p style={{marginLeft: '20px'}}>Имя:
                                                                <input name="owner.name"
                                                                       value={editProduct.owner.name}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}> Цвет глаз:
                                                                <select name="owner.eyeColor" value={editProduct.owner.eyeColor}
                                                                        onChange={handleInputChange}>
                                                                    {color.map((option) => (
                                                                        <option key={option} value={option}>{option}</option>
                                                                    ))}
                                                                </select>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}> Цвет волос:
                                                                <select name="owner.hairColor"
                                                                        value={editProduct.owner.hairColor}
                                                                        onChange={handleInputChange}>
                                                                    {color.map((option) => (
                                                                        <option key={option} value={option}>{option}</option>
                                                                    ))}
                                                                </select>
                                                            </p>
                                                            <p style={{marginLeft: '20px'}}><strong>Город: </strong></p>
                                                            <p style={{marginLeft: '40px'}}>X
                                                                <input name="manufacturer.officialAddress.town.x"
                                                                       value={editProduct.manufacturer.officialAddress.town.x}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '40px'}}>Y
                                                                <input name="manufacturer.officialAddress.town.y"
                                                                       value={editProduct.manufacturer.officialAddress.town.y}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '40px'}}>Z
                                                                <input name="manufacturer.officialAddress.town.z"
                                                                       value={editProduct.manufacturer.officialAddress.town.z}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p style={{marginLeft: '40px'}}>Название:
                                                                <input name="manufacturer.officialAddress.town.name"
                                                                       value={editProduct.manufacturer.officialAddress.town.name}
                                                                       onChange={handleInputChange}/>
                                                            </p>
                                                            <p>
                                                                <button className="btn btn-success"
                                                                        onClick={handleConfirmClick}>Подтвердить
                                                                </button>
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
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