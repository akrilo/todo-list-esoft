import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login', { username, password });
            if (response.data.success) {
                setError('');
                const currentUser = response.data.currentUser;
                navigate('/tasks', { state: { currentUser } });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                  setError(error.response.data.message);
                } 
                if (error.response.status === 400) {
                    setError(error.response.data.message);
                }
                if (error.response.status === 405) {
                    setError(error.response.data.message);
                }
                else {
                    setError(error.response.data.message);
                }
              } else {
                setError('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
              }
        }
    };

    return (
        <div className='login-container'>
            <h2>Вход</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя:</label>
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
