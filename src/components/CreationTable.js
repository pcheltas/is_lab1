import React, {useState} from 'react';
import '../creationTable.css'
import {useDispatch, useSelector} from "react-redux";
import '../error.css'
import {addProduct} from "../redux/productSlice";
import '../creationTable.css'
import {validateProduct} from "./validateProduct";
import SuggestObject from "./SuggestObjects";

const CreationTable = ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const owners = useSelector(state => state.person.persons)
    const officialAddresses = useSelector(state => state.address.addresses)
    const manufacturers = useSelector(state => state.manufacturer.manufacturers)
    // const [product, setProduct] = useState({
    //     name: '',
    //     coordinates: {
    //         x: '',
    //         y: '',
    //     },
    //     creationDate: '',
    //     unitOfMeasure: '',
    //     manufacturer: {
    //         name: '',
    //         officialAddress: {
    //             zipcode: '',
    //             town: {
    //                 x: '',
    //                 y: '',
    //                 z: '',
    //                 name: '',
    //             }
    //         },
    //         annualTurnover: '',
    //         employeesCount: '',
    //         fullName: '',
    //         rating: '',
    //     },
    //     price: '',
    //     manufactureCost: '',
    //     rating: '',
    //     owner: {
    //         name: '',
    //         eyeColor: '',
    //         hairColor: '',
    //         location: {
    //             x: '',
    //             y: '',
    //             z: '',
    //             name: '',
    //         },
    //         height: '',
    //         nationality: '',
    //     }
    // });

    const [product, setProduct] = useState({
            "name": "product",
            "coordinates": {
                "x": 1,
                "y": 2.0
            },
            "creationDate": "2024-10-09",
            "unitOfMeasure": "CENTIMETERS",
            "manufacturer": {
                "name": "org",
                "officialAddress": {
                    "town": {
                        "x": 1,
                        "y": 2.0,
                        "z": 3,
                        "name": "town"
                    },
                    "zipCode": "eklvmqekfrv",
                },
                "annualTurnover": 1,
                "employeesCount": 100,
                "fullName": "organization",
                "rating": 1
            },
            "price": 500,
            "manufactureCost": 1111,
            "rating": 1.0,
            "owner": {
                "name": "Mike",
                "eyeColor": "BLUE",
                "hairColor": "WHITE",
                "location": {
                    "x": 5,
                    "y": 6.0,
                    "z": 7,
                    "name": "home"
                },
                "height": 183,
                "nationality": "UNITED_KINGDOM"
            }
        }
    )
    const [errors, setErrors] = useState({});
    const color = useSelector(state => state.person.color || [])
    const country = useSelector(state => state.person.country || [])
    const unitOfMeasure = useSelector(state => state.product.unitOfMeasure)

    const handleChoice = (item, name) => {
        const updatedProduct = {...product};

        switch (name) {
            case "manufacturer":
                updatedProduct.manufacturer = {...item};
                break;
            case "manufacturer.officialAddress":
                updatedProduct.manufacturer.officialAddress = {...item};
                break;
            case "owner":
                updatedProduct.owner = {...item};
                break;
            default:
                return;
        }

        // console.log(name)
        // console.log(JSON.stringify(item))
        // console.log('product: ' + JSON.stringify(product))
        setProduct(updatedProduct);
        // console.log('updated product: ' + JSON.stringify(updatedProduct))
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        if (name.startsWith('coordinates.')) {
            const coordKey = name.split('.')[1];
            setProduct(prev => ({
                ...prev,
                coordinates: {
                    ...prev.coordinates,
                    [coordKey]: value
                }
            }));
        } else if (name.startsWith('manufacturer.officialAddress.town.')) {
            const townKey = name.split('.')[3];
            setProduct(prev => ({
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
            setProduct(prev => ({
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
            setProduct(prev => ({
                ...prev,
                manufacturer: {
                    ...prev.manufacturer,
                    [field]: value
                }
            }));
        } else if (name.startsWith('owner.location.')) {
            const locationKey = name.split('.')[2];
            setProduct(prev => ({
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
            setProduct(prev => ({
                ...prev,
                owner: {
                    ...prev.owner,
                    [personKey]: value
                }
            }));
        } else {
            setProduct(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const validate = () => {
        const newErrors = validateProduct(product)
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Возвращаем true, если нет ошибок
    };

    const handleConfirmClick = (e) => {
        e.preventDefault();
        if (validate()) {
            dispatch(addProduct([JSON.stringify(product), token]))
            onClose()
        }
    };

    return (
        // <div className="modal-overlay">
        //     <div className="modal-content">
        //         <div className="button-container">
        //             <button className="close-button" onClick={onClose}>&times;</button>
        //         </div>
        <div>
            <div className="creation-box">
                <div className="item-box flex-row">
                    <div>
                        <span>Название</span>
                        <input name="name" value={product.name}
                               onChange={handleInputChange}/>
                        {errors.name && <p className="error-popup">{errors.name}</p>}
                        <p>
                            <span>Единица измерения</span>
                            <select
                                name="unitOfMeasure"
                                value={product.unitOfMeasure}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled={product.unitOfMeasure} selected={true}>
                                    Выберите единицу измерения
                                </option>
                                {unitOfMeasure.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {errors.unitOfMeasure && <p className="error-popup">{errors.unitOfMeasure}</p>}
                        </p>
                        <p>
                            <span>Стоимость</span>
                            <input name="price"
                                   value={product.price}
                                   onChange={handleInputChange}/>
                            {errors.price && <p className="error-popup">{errors.price}</p>}
                        </p>
                        <p>
                            <span>Себестоимость</span>
                            <input name="manufactureCost"
                                   value={product.manufactureCost}
                                   onChange={handleInputChange}/>
                            {errors.manufactureCost && <p className="error-popup">{errors.manufactureCost}</p>}
                        </p>
                        <p>
                            <span>Рейтинг</span>
                            <input name="rating"
                                   value={product.rating}
                                   onChange={handleInputChange}/>
                            {errors.rating && <p className="error-popup">{errors.rating}</p>}
                        </p>


                        <div className="item-box">
                            <h2>Координаты</h2>
                            <p>
                                <span>X</span>
                                <input name="coordinates.x" value={product.coordinates.x}
                                       onChange={handleInputChange}/>
                                {errors.coordinatesX && <p className="error-popup">{errors.coordinatesX}</p>}
                            </p>
                            <p>
                                <span>Y</span>
                                <input name="coordinates.y" value={product.coordinates.y}
                                       onChange={handleInputChange}/>
                                {errors.coordinatesY && <p className="error-popup">{errors.coordinatesY}</p>}
                            </p>
                        </div>
                    </div>
                    <div className="item-box flex-row">
                        <div>
                            <h2>Владелец</h2>
                            <p>
                                <span>Имя</span>
                                <input name="owner.name"
                                       value={product.owner.name}
                                       onChange={handleInputChange}/>
                                {errors.ownerName && <p className="error-popup">{errors.ownerName}</p>}
                            </p>
                            <p>
                                <span>Цвет глаз</span>
                                <select name="owner.eyeColor" value={product.owner.eyeColor}
                                        onChange={handleInputChange}>
                                    <option value="" disabled={product.owner.eyeColor} selected={true}>
                                        Выберите цвет
                                    </option>
                                    {color.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {errors.ownerEyeColor && <p className="error-popup">{errors.ownerEyeColor}</p>}
                            </p>
                            <p>
                                <span>Цвет волос</span>
                                <select name="owner.hairColor"
                                        value={product.owner.hairColor}
                                        onChange={handleInputChange}>
                                    <option value="" disabled={product.owner.hairColor} selected={true}>
                                        Выберите цвет
                                    </option>
                                    {color.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {errors.ownerHairColor && <p className="error-popup">{errors.ownerHairColor}</p>}
                            </p>
                            <p>
                                <span>Рост</span>
                                <input name="owner.height"
                                       value={product.owner.height}
                                       onChange={handleInputChange}/>
                                {errors.ownerHeight && <p className="error-popup">{errors.ownerHeight}</p>}
                            </p>
                            <p>
                                <span>Национальность</span>
                                <select name="owner.nationality"
                                        value={product.owner.nationality}
                                        onChange={handleInputChange}>
                                    <option value="" disabled={product.owner.nationality} selected={true}>
                                        Выберите национальность
                                    </option>
                                    {country.map((option) => (
                                        <option key={option} value={option}>{option}</option>
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
                                           value={product.owner.location.x}
                                           onChange={handleInputChange}/>
                                    {errors.ownerLocationX &&
                                        <p className="error-popup">{errors.ownerLocationX}</p>}
                                </p>
                                <p>
                                    <span>Y</span>
                                    <input name="owner.location.y"
                                           value={product.owner.location.y}
                                           onChange={handleInputChange}/>
                                    {errors.ownerLocationY &&
                                        <p className="error-popup">{errors.ownerLocationY}</p>}
                                </p>
                                <p>
                                    <span>Z</span>
                                    <input name="owner.location.z"
                                           value={product.owner.location.z}
                                           onChange={handleInputChange}/>
                                    {errors.ownerLocationZ &&
                                        <p className="error-popup">{errors.ownerLocationZ}</p>}
                                </p>
                                <p>
                                    <span>Название</span>
                                    <input name="owner.location.name"
                                           value={product.owner.location.name}
                                           onChange={handleInputChange}/>
                                    {errors.ownerLocationName &&
                                        <p className="error-popup">{errors.ownerLocationName}</p>}
                                </p>
                            </div>
                        </div>
                        <SuggestObject mass={owners} name="owner" handleChoice={handleChoice} amountOfLabels={1}
                                       labelKey="name"/>


                    </div>

                    <div className="item-box flex-row">
                        <div>
                            <h2>Производитель</h2>
                            <p>
                                <span>Название</span>
                                <input name="manufacturer.name"
                                       value={product.manufacturer.name}
                                       onChange={handleInputChange}/>
                                {errors.manufacturerName &&
                                    <p className="error-popup">{errors.manufacturerName}</p>}
                            </p>
                            <p>
                                <span>Ежегодный оборот</span>
                                <input name="manufacturer.annualTurnover"
                                       value={product.manufacturer.annualTurnover}
                                       onChange={handleInputChange}/>
                                {errors.annualTurnover && <p className="error-popup">{errors.annualTurnover}</p>}
                            </p>
                            <p>
                                <span>Количество работников</span>
                                <input name="manufacturer.employeesCount"
                                       value={product.manufacturer.employeesCount}
                                       onChange={handleInputChange}/>
                                {errors.employeesCount && <p className="error-popup">{errors.employeesCount}</p>}
                            </p>
                            <p>
                                <span>Полное название</span>
                                <input name="manufacturer.fullName"
                                       value={product.manufacturer.fullName}
                                       onChange={handleInputChange}/>
                                {errors.fullName && <p className="error-popup">{errors.fullName}</p>}
                            </p>
                            <p>
                                <span>Рейтинг</span>
                                <input name="manufacturer.rating"
                                       value={product.manufacturer.rating}
                                       onChange={handleInputChange}/>
                                {errors.manufacturerRating &&
                                    <p className="error-popup">{errors.manufacturerRating}</p>}
                            </p>

                            <div className="item-box flex-row">
                                <div>
                                    <h2>Официальный адрес </h2>
                                    <p>
                                        <span>Индекс</span>
                                        <input name="manufacturer.officialAddress.zipCode"
                                               value={product.manufacturer.officialAddress.zipCode}
                                               onChange={handleInputChange}/>
                                        {errors.zipCode &&
                                            <p className="error-popup">{errors.zipCode}</p>}
                                    </p>
                                    <div className="item-box">
                                        <h2>Город</h2>
                                        <p>
                                            <span>X</span>
                                            <input name="manufacturer.officialAddress.town.x"
                                                   value={product.manufacturer.officialAddress.town.x}
                                                   onChange={handleInputChange}/>
                                            {errors.townX &&
                                                <p className="error-popup">{errors.townX}</p>}
                                        </p>
                                        <p>
                                            <span>Y</span>
                                            <input name="manufacturer.officialAddress.town.y"
                                                   value={product.manufacturer.officialAddress.town.y}
                                                   onChange={handleInputChange}/>
                                            {errors.townY &&
                                                <p className="error-popup">{errors.townY}</p>}
                                        </p>
                                        <p>
                                            <span>Z</span>
                                            <input name="manufacturer.officialAddress.town.z"
                                                   value={product.manufacturer.officialAddress.town.z}
                                                   onChange={handleInputChange}/>
                                            {errors.townZ &&
                                                <p className="error-popup">{errors.townZ}</p>}
                                        </p>
                                        <p>
                                            <span>Название</span>
                                            <input name="manufacturer.officialAddress.town.name"
                                                   value={product.manufacturer.officialAddress.town.name}
                                                   onChange={handleInputChange}/>
                                            {errors.townName &&
                                                <p className="error-popup">{errors.townName}</p>}
                                        </p>
                                    </div>
                                </div>
                                <SuggestObject mass={officialAddresses} name="manufacturer.officialAddress"
                                               handleChoice={handleChoice} amountOfLabels={1}
                                               labelKey="zipCode"/>
                            </div>
                        </div>
                        <SuggestObject mass={manufacturers} name="manufacturer" handleChoice={handleChoice}
                                       amountOfLabels={1} labelKey="name"/>
                    </div>
                </div>
            </div>
            <p>
                <button className="btn btn-success"
                        onClick={handleConfirmClick}>Добавить
                </button>
            </p>

        </div>
    );
};

export default CreationTable;