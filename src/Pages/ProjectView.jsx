import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scene from "../Components/Scene.jsx";
import StarInfoPanel from "../Components/StarInfo.jsx";
import { getProjectView } from "../Context/API.js";
import { useAuth } from "../Context/AuthContext.jsx";

const ProjectViewer = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stars, setStars] = useState([]);
    const [connections, setConnections] = useState([]);
    const [hoveredStar, setHoveredStar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                const token = user?.token || null;
                const response = await getProjectView(token, projectId);
                const projectData = response.data;

                setProject(projectData);
                setStars(projectData.stars.map(star => ({
                    id: star.id,
                    name: star.name,
                    position: [star.x, star.y, star.z],
                    color: star.color,
                    additionalInfo: star.additionalInfo
                })));
                setConnections(projectData.connections.map(conn => [conn.startId, conn.endId]));
            } catch (error) {
                console.error('Error loading project:', error);
                alert('Failed to load project');
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [projectId, user, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Loading project...</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: '#1f1f1f',
                color: 'white',
                borderBottom: '1px solid #444'
            }}>
                <button
                    onClick={handleBack}
                    style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '0.5rem 0.6rem',
                        fontSize: '0.9rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        maxWidth: '10%'
                    }}
                >
                    ← Back
                </button>

                <div>
                    <h2 style={{ margin: 0 }}>{project?.name || 'Unnamed Project'}</h2>
                    {project?.userName && (
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
                            Created by: {project.userName}
                        </p>
                    )}
                </div>
                <div style={{ width: '5rem' }} /> {/* spacer to match button width */}
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <Scene
                    stars={stars}
                    connections={connections}
                    onStarHover={setHoveredStar}
                />
                {hoveredStar && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        zIndex: 10,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        borderRadius: '8px',
                        padding: '1rem',
                        maxWidth: '300px'
                    }}>
                        <StarInfoPanel star={hoveredStar} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectViewer;
