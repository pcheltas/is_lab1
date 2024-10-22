import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {logout} from "../redux/authSlice";

const Header = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        toggleDropdown()
        dispatch(logout())
    };

    return (
        <header>
            <h1>Система управления товарами</h1>
            {isAuthenticated ?
            <div className="user-dropdown">
                <span onClick={toggleDropdown} className="icon">👤</span>
                {isOpen && (
                    <div className="dropdown-menu">
                        <button onClick={handleLogout}>Выйти из аккаунта</button>
                    </div>
                )}
            </div>
            : <></>}
        </header>
    );
};

export default Header;