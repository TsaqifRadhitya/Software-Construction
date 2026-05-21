import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // auth_service me endpoint
                const res = await api.get('/users/me');
                setUser(res.data.data);
            } catch (err) {
                console.error("Token invalid", err);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const token = res.data.data.token;
            localStorage.setItem('token', token);
            await checkAuth();
            return true;
        } catch (err) {
            console.error("Login failed", err);
            return false;
        }
    };

    const register = async (nama, email, password) => {
        try {
            const res = await api.post('/auth/register', { nama, email, password });
            const token = res.data.data.token;
            localStorage.setItem('token', token);
            await checkAuth();
            return true;
        } catch (err) {
            console.error("Registration failed", err);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
