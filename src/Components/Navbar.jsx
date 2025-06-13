import React from "react";
import '../Styles/Navbar.css';
import {useAuth} from "../Context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

export default function Navbar({}) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    return (
        <nav className="dashboard-nav">
            <div className="nav-logo" onClick={() => navigate('/')}>CelestiMap</div>
            <div className="nav-links">
                {user ? (
                    <>
                        <span className="nav-user">Welcome, {user.userName}</span>
                        <button className="nav-button" onClick={() => navigate('/create')}>
                            Create
                        </button>
                        <button className="nav-button" onClick={() => navigate('/myProjects')}>
                            <span className="no-wrap">My Projects</span>
                        </button>
                        <button className="nav-button" onClick={() => navigate('/favorites')}>
                            Favorites
                        </button>
                        <button className="nav-button" onClick={() => navigate('/neos')}>
                            NEO
                        </button>
                        <button className="nav-button" onClick={() => navigate('/gallery')}>
                            Gallery
                        </button>
                        <button className="nav-button" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button className="nav-button" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="nav-button" onClick={() => navigate('/register')}>
                            Register
                        </button>
                        <button className="nav-button" onClick={() => navigate('/neos')}>
                            NEO
                        </button>
                        <button className="nav-button" onClick={() => navigate('/gallery')}>
                            Gallery
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}