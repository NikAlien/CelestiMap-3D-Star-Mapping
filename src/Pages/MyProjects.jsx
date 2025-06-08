import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../Styles/Favorite.css';
import Navbar from "../Components/Navbar.jsx";

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchMyProjects = async () => {
            if (!user || !user.token) {
                console.error("User or token missing.");
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/v1/project/myProjects', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyProjects();
    }, [user, navigate]);

    const removeMyProjects = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/project/delete/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                setProjects(projects.filter(fav => fav.projectId !== projectId));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="favorites-container">
            <Navbar/>
            <div className="favorites-header">
                <h1>Your Favorite Projects</h1>
                <p>All the constellations you've marked as favorites</p>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading favorites...</div>
            ) : projects.length === 0 ? (
                <div className="no-results">
                    <h3>No favorites yet</h3>
                    <p>Explore the gallery and add projects to your favorites!</p>
                </div>
            ) : (
                <div className="favorites-grid">
                    {projects.map(favorite => (
                        <div
                            key={favorite.projectId}
                            className="favorite-card"
                            onClick={() => navigate(`/project/${favorite.projectId}`)}
                        >
                            <div className="card-header">
                                <h3>{favorite.name}</h3>
                                {favorite.isPublic && <span className="public-badge">Public</span>}
                            </div>
                            <div className="card-meta">
                                <span className="date">
                                    {new Date(favorite.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button className="remove-btn" onClick={(e) => {
                                e.stopPropagation();
                                removeMyProjects(favorite.projectId);}}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProjects;