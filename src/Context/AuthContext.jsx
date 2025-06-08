import React, { createContext, useState, useEffect, useContext } from 'react';
import {getUserInfo} from "./API.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (token) => {
        localStorage.setItem('accessToken', token);
        fetchUserData(token);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    const fetchUserData = async (token) => {
        try {
            const response = await getUserInfo(token);

            if (response.ok) {
                const userData = await response.json();
                setUser({
                    userId: userData.userId,
                    userName: userData.userName,
                    token
                });
            }
        } catch (error) {
            console.error('Failed to fetch user data', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUserData(token);
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};