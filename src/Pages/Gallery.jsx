import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../Styles/Gallery.css';

const Gallery = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('createdAt,desc');
    const [pagination, setPagination] = useState({
        page: 0,
        size: 12,
        totalPages: 0,
        totalElements: 0
    });
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page,
                size: pagination.size,
                sort: sortOption,
                ...(searchTerm && { search: searchTerm })
            }).toString();

            const response = await fetch(`http://localhost:8080/api/v1/project/public?${params}`);
            if (!response.ok) throw new Error('Failed to fetch');

            const data = await response.json();
            setProjects(data.content);
            setPagination(prev => ({
                ...prev,
                totalPages: data.totalPages,
                totalElements: data.totalElements
            }));
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [pagination.page, sortOption]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 0 }));
        fetchProjects(); // Trigger manual fetch
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const addFavorite = async (projectId) => {
        try {
            await fetch(`http://localhost:8080/api/v1/project/${projectId}/favorite`,
                {
                    method: 'POST',
                    headers: {'Authorization': `Bearer ${user.token}`}
                }
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="gallery-container">
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
                            <button className="nav-button" onClick={() => navigate('/')}>Dashboard</button>
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
                            <button className="nav-button" onClick={() => navigate('/')}>Dashboard</button>
                        </>
                    )}
                </div>
            </nav>

            <div className="gallery-header">
                <h1>Public Projects Gallery</h1>
                <p>Explore constellations created by our community</p>
            </div>

            <div className="gallery-controls">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search projects or creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>

                <div className="sort-controls">
                    <div className="sort-inline">
                        <label className="no-wrap">Sort by:</label>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="createdAt,desc">Newest First</option>
                            <option value="createdAt,asc">Oldest First</option>
                            <option value="name,asc">Name (A-Z)</option>
                            <option value="name,desc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className="no-results">
                    <h3>No projects found</h3>
                    <p>Try adjusting your search filters</p>
                </div>
            ) : (
                <>
                    <div className="project-grid">
                        {projects.map(project => (
                            <div
                                key={project.projectId}
                                className="project-card"
                                onClick={() => navigate(`/project/${project.projectId}`)}
                            >
                                <div className="card-header">
                                    <h3>{project.name}</h3>
                                    {project.isPublic && <span className="public-badge">Public</span>}
                                </div>
                                <div className="card-meta">
                                    <span className="creator">By: {project.user?.userName ?? 'Unknown'}</span>
                                    <span className="date">{formatDate(project.createdAt)}</span>
                                </div>
                                <div className="card-stats">
                                    <span>{project.stars?.length ?? 0} stars</span>
                                    <span>{project.constellationLines?.length ?? 0} connections</span>
                                </div>
                                {user && (
                                    <button className="favorite-btn" onClick={(e) => {
                                        e.stopPropagation();
                                        addFavorite(project.projectId);}}>
                                        ♡ Favorite
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pagination-controls">
                        <button
                            disabled={pagination.page === 0}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            Previous
                        </button>

                        <span className="no-wrap">
                            Page {pagination.page + 1} of {pagination.totalPages}
                        </span>

                        <button
                            disabled={pagination.page >= pagination.totalPages - 1}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Gallery;
