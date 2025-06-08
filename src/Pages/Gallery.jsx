import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../Styles/Gallery.css';
import Navbar from "../Components/Navbar.jsx";
import {addFavorite, fetchPublicProjects} from "../Context/API.js";
import usePagination from '../Hooks/Pagination.js';

const Gallery = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('createdAt,desc');
    const [pagination, handlePageChange, updateMeta] = usePagination();
    const { user } = useAuth();
    const navigate = useNavigate();

    const loadProjects = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                size: pagination.size,
                sort: sortOption,
                ...(searchTerm && { search: searchTerm })
            };

            const response = await fetchPublicProjects(params);
            const data = response.data;
            setProjects(data.content);
            updateMeta(data.totalPages, data.totalElements);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [pagination.page, sortOption]);

    const handleSearch = (e) => {
        e.preventDefault();
        handlePageChange(0)
        loadProjects();
    };

    const handleAddFavorite = async (projectId) => {
        try {
            await addFavorite(user.token, projectId);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="gallery-container">
            <Navbar/>
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
                                key={project.id}
                                className="project-card"
                                onClick={() => navigate(`/project/${project.id}`)}
                            >
                                <div className="card-header">
                                    <h3>{project.name}</h3>
                                    {project.isPublic && <span className="public-badge">Public</span>}
                                </div>
                                <div className="card-meta">
                                    <span className="creator">By: {project.userName ?? 'Unknown'}</span>
                                    <span className="date">{formatDate(project.createdAT)}</span>
                                </div>
                                <div className="card-stats">
                                    <span>{project.stars?.length ?? 0} stars</span>
                                    <span>{project.constellationLines?.length ?? 0} connections</span>
                                </div>
                                {user && (
                                    <button className="favorite-btn" onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddFavorite(project.id);}}>
                                        ♡ Favorite
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pagination-controls">
                        <button disabled={pagination.page === 0} onClick={() => handlePageChange(pagination.page - 1)}>Previous</button>
                        <span className="no-wrap">Page {pagination.page + 1} of {pagination.totalPages}</span>
                        <button disabled={pagination.page >= pagination.totalPages - 1} onClick={() => handlePageChange(pagination.page + 1)}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Gallery;
