import React, { useState } from 'react';
import '../Actions.css'; // Импортируем файл стилей

const Actions = () => {
    const [activeAction, setActiveAction] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [percentage, setPercentage] = useState(0);

    const handleActionClick = (action) => {
        setActiveAction(activeAction === action ? null : action); // Закрываем, если снова кликнули
    };

    const handleApply = () => {
        // Логика применения действия
        alert(`Применено действие: ${activeAction} с параметрами: ${inputValue || percentage}`);
        // Сброс состояния после применения
        setActiveAction(null);
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
                return null; // Для этого действия нет дополнительных полей
            case 'Вернуть массив объектов с заданной подстрокой имени':
                return (
                    <div>
                        <input
                            type="text"
                            placeholder="Введите подстроку для поиска"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                );
            case 'Выбрать всю продукцию заданного производителя':
                return (
                    <div>
                        <input
                            type="text"
                            placeholder="Введите производителя"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                );
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
            default:
                return null;
        }
    };

    return (
        <div className="actions-container">
            <h3>Действия</h3>
            {['Удалить один объект с заданным рейтингом', 'Рассчитать сумму рейтингов всех продуктов',
                'Вернуть массив объектов с заданной подстрокой имени', 'Выбрать всю продукцию заданного производителя',
                'Снизить цену всей продукции на заданный процент'].map((action) => (
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
        </div>
    );
};

export default Actions;