import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectsPage.css'; // We'll create this CSS file

export default function ProjectsPage() {
    const navigate = useNavigate();
    const LOCAL_STORAGE_KEY = 'starConstellationDataProjects';
    // const token = localStorage.getItem('accessToken');

    // if (!token) {
    //     window.location.href = "http://localhost:4200/login";
    //     return null;
    // }

    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "Orion Constellation",
            description: "The famous hunter constellation with bright stars",
            createdDate: "2023-05-15",
            modifiedDate: "2023-05-20",
            stars: 8,
            connections: 7
        },
        {
            id: 2,
            name: "Ursa Major",
            description: "The Great Bear constellation, contains the Big Dipper",
            createdDate: "2023-04-22",
            modifiedDate: "2023-05-18",
            stars: 7,
            connections: 6
        },
        {
            id: 3,
            name: "Cassiopeia",
            description: "W-shaped constellation representing a vain queen",
            createdDate: "2023-06-01",
            modifiedDate: "2023-06-05",
            stars: 5,
            connections: 4
        }
    ]);

    const handleCreateNew = () => {
        navigate('/create');
    };

    const handleOpenProject = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteProject = (id, e) => {
        e.stopPropagation();
        setProjects(projects.filter(project => project.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = "http://localhost:4200/login";
    };

    return (
        <div className="projects-page">
            <div className="projects-header">
                <h1>My Constellation Projects</h1>
                <button className="create-button" onClick={handleCreateNew}>
                    Create New Project
                </button>
                <button onClick={handleLogout} className="logout-button"> Logout </button>
            </div>

            <div className="projects-grid">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => handleOpenProject(project.id)}
                    >
                        <div className="project-card-header">
                            <h3>{project.name}</h3>
                            <button
                                className="delete-button"
                                onClick={(e) => handleDeleteProject(project.id, e)}
                            >
                                ×
                            </button>
                        </div>
                        <p className="project-description">{project.description}</p>
                        <div className="project-stats">
                            <span>⭐ {project.stars} stars</span>
                            <span>🔗 {project.connections} connections</span>
                        </div>
                        <div className="project-dates">
                            <span>Created: {project.createdDate}</span>
                            <span>Modified: {project.modifiedDate}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}