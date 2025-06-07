import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../Styles/Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-logo">CelestiMap</div>
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
                            <button className="nav-button" onClick={() => navigate('/gallery')}>
                                Gallery
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div className="dashboard-hero">
                <h1>Discover the Galaxy!</h1>
                <p>Create and explore constellations in an interactive 3D universe</p>

                <div className="dashboard-actions">
                    {user ? (
                        <button className="dashboard-button" onClick={() => navigate('/create')}>
                            Create New Project
                        </button>
                    ) : (
                        <button className="dashboard-button" onClick={() => navigate('/create')}>
                            Start Your Journey
                        </button>
                    )}
                </div>
            </div>

            <div className="dashboard-features">
                <div className="feature-card">
                    <h3>3D Star Visualization</h3>
                    <p>Navigate space with zoom, pan and rotation controls</p>
                </div>
                <div className="feature-card">
                    <h3>Create & Share</h3>
                    <p>Build constellations and share with the community</p>
                </div>
                <div className="feature-card">
                    <h3>Explore Galaxies</h3>
                    <p>Discover public projects from other astronomers</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;