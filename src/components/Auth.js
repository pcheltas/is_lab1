import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../authStyle.css';
import { register, login } from '../redux/authSlice'; // Импортируйте ваши действия для регистрации и логина

const Auth = () => {
    const dispatch = useDispatch();
    const [isRegisterMode, setRegisterMode] = useState(false);
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        role: 'USER',
    });
    const [errors, setErrors] = useState({ person: {} });

    const validateForm = () => {
        const newErrors = {};
        if (!formData.login) newErrors.login = 'Логин обязателен';
        if (!formData.password) newErrors.password = 'Пароль обязателен';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            if (isRegisterMode) {
                dispatch(register(JSON.stringify(formData)));
            } else {
                dispatch(login(JSON.stringify({ login: formData.login, password: formData.password })));
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h2>{isRegisterMode ? 'Зарегистрироваться' : 'Войти'}</h2>

                    <input type="text" name="login" placeholder="Логин" className={styles.mb3} value={formData.login} onChange={handleChange} required />
                    {errors.login && <span className="error">{errors.login}</span>}

                    <input type="password" name="password" placeholder="Пароль" className={styles.mb3} value={formData.password} onChange={handleChange} required />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <button type="submit">
                        {isRegisterMode ? 'Зарегистрироваться' : 'Войти'}
                    </button>

                    <p className="forgot-password text-right">
                        {isRegisterMode ? (
                            <span>
                                Уже есть аккаунт? <button onClick={() => setRegisterMode(false)}>Войти</button>
                            </span>
                        ) : (
                            <span>
                                Еще нет аккаунта? <button onClick={() => setRegisterMode(true)}>Зарегистрироваться</button>
                            </span>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Auth;