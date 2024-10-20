import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Header = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        // Логика выхода из аккаунта
        console.log('Выход из аккаунта');
    };

    const handleSwitchAccount = () => {
        // Логика смены аккаунта
        console.log('Смена аккаунта');
    };

    return (
        <header>
            <h1>Система управления товарами</h1>
            {isAuthenticated ?
            <div className="user-dropdown">
                <span onClick={toggleDropdown} className="icon">👤</span>
                {isOpen && (
                    <div className="dropdown-menu">
                        <button onClick={handleSwitchAccount}>Сменить аккаунт</button>
                        <button onClick={handleLogout}>Выйти из аккаунта</button>
                    </div>
                )}
            </div>
            : <></>}
        </header>
    );
};

export default Header;