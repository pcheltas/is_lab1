import React, {useState} from 'react';
import '../Actions.css';
import {useDispatch, useSelector} from "react-redux";
import {
    deleteProductByRating,
    fetchBySubstring,
    fetchProducts,
    lowerPriceByPercent,
    sumRating
} from "../redux/productSlice"; // Импортируем файл стилей

const Actions = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token)
    const requestParams = useSelector(state => state.product.requestParams)
    const sumRat = useSelector(state => state.product.sumRating)
    const substringProducts = useSelector(state => state.product.substringProducts)
    const [activeAction, setActiveAction] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [percentage, setPercentage] = useState(0);
    const [subString, setSubString] = useState('');
    const [showSubsring, setShowSubstring] = useState(false)

    const handleActionClick = (action) => {
        setActiveAction(activeAction === action ? null : action);
    };

    const handleShowSubString = () => {
        setShowSubstring(!showSubsring)
    }


    const handleApply = async () => {
        // alert(`Применено действие: ${activeAction} с параметрами: ${inputValue || percentage}`);
        switch (activeAction) {
            case 'Удалить один объект с заданным рейтингом':
                if (inputValue && inputValue.trim() !== '') {
                    await dispatch(deleteProductByRating([inputValue, token]));
                    await dispatch(fetchProducts([token, requestParams]))
                }
                break;
            // case 'Рассчитать сумму рейтингов всех продуктов':
            case 'Рассчитать сумму рейтингов всех продуктов':
                dispatch(sumRating(token))
                break;
            case 'Снизить цену всей продукции на заданный процент':
                if (!isNaN(percentage) && percentage >= 0) {
                    await dispatch(lowerPriceByPercent([percentage, token]));
                    await dispatch(fetchProducts([token, requestParams]))
                }
                break;
            case 'Показать все продукты с заданной подстрокой':
                if (subString && subString.trim() !== '') {
                    dispatch(fetchBySubstring([subString, token]));
                }
                handleShowSubString();
                break;
            default:
                break;
        }
        setSubString('');
        setInputValue('');
        setPercentage(0);

    };
    const renderActionFields = () => {
        switch (activeAction) {
            case 'Удалить один объект с заданным рейтингом':
                return (
                    <div>
                        <input
                            type="number"
                            placeholder="Введите rating"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                );
            case 'Рассчитать сумму рейтингов всех продуктов':
                return sumRat >= 0 ? <div>{sumRat}</div> : null;
            case 'Снизить цену всей продукции на заданный процент':
                return (
                    <div>
                        <input
                            type="number"
                            placeholder="Введите процент"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                        />
                    </div>
                );
            case 'Показать все продукты с заданной подстрокой':
                return (
                    <div>
                        <input
                            type="text"
                            placeholder="Введите подстроку"
                            value={subString}
                            onChange={(e) => setSubString(e.target.value)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="actions-container">
            <h3>Действия</h3>
            {['Удалить один объект с заданным рейтингом', 'Рассчитать сумму рейтингов всех продуктов',
                'Снизить цену всей продукции на заданный процент', 'Показать все продукты с заданной подстрокой'].map((action) => (
                <div key={action} className="action-item">
                    <div className="action-title" onClick={() => handleActionClick(action)}>
                        {action}
                    </div>
                    {activeAction === action && (
                        <div className="action-details">
                            {renderActionFields()}
                            <button className="apply-button" onClick={handleApply}>
                                Применить
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {showSubsring ?
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="button-container subString-container">
                            <button className="close-button" onClick={handleShowSubString}>&times;</button>
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
                                </tr>
                                </thead>
                                <tbody>
                                {substringProducts.length > 0 ? (
                                    substringProducts.map(product => (
                                        <tr className="productTableBody" key={product.id}>
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11">Продуктов с такой подстрокой нет</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                : null}
        </div>
    );
};

export default Actions;