import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/users", { withCredentials: true })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const login = async (username, password) => {
        const res = await axios.post("http://localhost:8080/api/v1/users/login", { username, password }, { withCredentials: true });
        setUser(res.data);
    };

    const logout = async () => {
        await axios.post("http://localhost:8080/api/v1/users/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;