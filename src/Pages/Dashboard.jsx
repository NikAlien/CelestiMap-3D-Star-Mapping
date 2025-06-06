// Pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            {user ? (
                <>
                    <h1>Hi {user.userName}!</h1>
                    <p>Welcome to your dashboard</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <h1>Hello, stranger!</h1>
                    <p>Continue as guest or login to save your work</p>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </>
            )}
        </div>
    );
};

export default Dashboard;