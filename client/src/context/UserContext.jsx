import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchUser = async () => {
        const token = localStorage.getItem('lumi_token');
        if (token) {
            try {
                const res = await authService.getMe();
                if (res.success) setUser(res.user);
            } catch (error) {
                console.error("Lỗi auth context:", error);
                localStorage.removeItem('lumi_token');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('lumi_token');
        setUser(null);
        window.location.href = '/login';
    };

    const updateUser = (newUserData) => {
        setUser(prev => ({ ...prev, ...newUserData }));
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);