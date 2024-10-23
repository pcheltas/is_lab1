import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {fetchUserRole, logout, requestAdminRole} from "../redux/authSlice";

const Header = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const login = useSelector(state => state.auth.login);
    const role = useSelector(state => state.auth.role);
    const token = useSelector(state => state.auth.token)
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);


    const toggleDropdown = async () => {
        if (!isOpen) {
            await dispatch(fetchUserRole([role, token]));
        }
        setIsOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        toggleDropdown();
        dispatch(logout());
    };

    const handleAdminSubmit = () => {
        dispatch(requestAdminRole(token))
        dispatch(fetchUserRole([role, token]))
    }

    return (
        <header>
            <h1>Система управления товарами</h1>
            {isAuthenticated ?
            <div className="user-dropdown">
                <span onClick={toggleDropdown} className="icon">👤</span>
                {isOpen && (
                    <div className="dropdown-menu">
                        <span>{login}: {role}</span>
                        {role === "USER" ?
                            <button onClick={handleAdminSubmit}>Стать админом</button>
                            : null
                        }
                        <button onClick={handleLogout}>Выйти из аккаунта</button>
                    </div>
                )}
            </div>
            : <></>}
        </header>
    );
};

export default Header;