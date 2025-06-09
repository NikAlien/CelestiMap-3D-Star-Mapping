import {useState, useEffect, useRef} from 'react';
import Scene from "../Components/Scene.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import SaveDialog from "../Components/SaveDialog.jsx";
import {useAuth} from "../Context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import StarInfoPanel from "../Components/StarInfo.jsx";
import { getProject, saveProject, updateProject } from '../Context/API.js';

const LOCAL_STORAGE_KEY = 'starConstellationDataV2';

export default function ProjectEditor() {
    const [nextId, setNextId] = useState(-1);
    const [stars, setStars] = useState([]);
    const [connections, setConnections] = useState([]);
    const [form, setForm] = useState({ name: '', x: 0, y: 0, z: 0, color: '#ffffff', additionalInfo: '' });
    const [selectedStar, setSelectedStar] = useState(null);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hoveredStar, setHoveredStar] = useState(null);
    const [projectNameUpdate, setProjectName] = useState("MyConstellation");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (saved) {
            setStars(saved.stars || []);
            setConnections(saved.connections || []);
            const minId = Math.min(...saved.stars.map(star => star.id), 0);
            setNextId(minId - 1);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ stars, connections }));
    }, [stars, connections]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('edit');

        if (projectId && user) {
            const loadProject = async () => {
                try {
                    const response = await getProject(user.token, projectId);
                    const project = response.data;

                    setStars(project.stars.map(star => ({
                        id: star.id,
                        name: star.name,
                        position: [star.x, star.y, star.z],
                        color: star.color,
                        additionalInfo: star.additionalInfo
                    })));

                    setConnections(project.connections.map(conn => [conn.startId, conn.endId]));

                    setCurrentProjectId(project.id);
                    setProjectName(project.name);
                } catch (error) {
                    console.error('Error loading project:', error);
                }
            };

            loadProject();
        }
    }, [user]);

    const handleAddStar = () => {
        const newStar = {
            id: nextId,
            name: form.name,
            position: [parseFloat(form.x), parseFloat(form.y), parseFloat(form.z)],
            color: form.color,
            additionalInfo: form.additionalInfo
        };
        setStars([...stars, newStar]);
        setNextId(nextId - 1);
        setForm({ name: '', x: 0, y: 0, z: 0, color: '#ffffff', additionalInfo: '' });
    };

    const handleEditStar = () => {
        setStars(stars.map(s =>
            s.id === selectedStar
                ? { ...s, name: form.name, position: [parseFloat(form.x), parseFloat(form.y), parseFloat(form.z)], color: form.color, additionalInfo: form.additionalInfo }
                : s
        ));
        setSelectedStar(null);
        setForm({ name: '', x: 0, y: 0, z: 0, color: '#ffffff', additionalInfo: '' });
    };

    useEffect(() => {
        console.log("Updated stars list:", stars);
    }, [stars]);

    useEffect(() => {
        console.log("Updated connections list:", connections);
    }, [connections]);


    const handleDeleteStar = (id) => {
        // Remove the star
        setStars(prev => prev.filter(s => s.id !== id));
        // Remove all connections involving this star
        setConnections(prev => prev.filter(([a, b]) => a !== id && b !== id));
        // Clear selection if needed
        if (selectedStar === id) {
            setSelectedStar(null);
            setForm({ name: '', x: 0, y: 0, z: 0, color: '#ffffff', additionalInfo: '' });
        }
    };

    const handleAddConnection = (fromId, toId) => {
        const a = Number(fromId);
        const b = Number(toId);
        if (a !== b && !connections.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) {
            setConnections(prev => [...prev, [a, b]]);
        }
    };

    const handleRemoveConnection = (fromId, toId) => {
        const a = Number(fromId);
        const b = Number(toId);
        setConnections(prev => prev.filter(([x, y]) => !( (x === a && y === b) || (x === b && y === a) )));
    };

    const handleSave = async ({ projectName, format, visibility }) => {
        const invalidConnections = connections.filter(([fromId, toId]) => {
            return !stars.some(s => s.id === fromId) || !stars.some(s => s.id === toId);
        });

        if (invalidConnections.length > 0) {
            alert(`Error: ${invalidConnections.length} connections reference deleted stars.`);
            return;
        }

        const projectData = {
            id: currentProjectId || null,
            name: projectName,
            isPublic: (visibility === 'public'),
            createdAt: new Date().toISOString(),
            stars: stars.map(star => ({
                id: star.id || null,
                name: star.name,
                x: star.position[0],
                y: star.position[1],
                z: star.position[2],
                color: star.color,
                additionalInfo: star.additionalInfo || ""
            })),
            connections: connections.map(([fromId, toId]) => {
                // Find the actual star objects (using temp IDs)
                const fromStar = stars.find(s => s.id === fromId);
                const toStar = stars.find(s => s.id === toId);

                return {
                    id: null,
                    startId: fromStar?.id, // Use persistent backend ID
                    endId: toStar?.id
                };
            }).filter(conn => conn.startId && conn.endId)
        };

        try {
            if (format === 'online') {
                if (currentProjectId) {
                    await updateProject(user.token, projectData);
                } else {
                    const newId = await saveProject(user.token, projectData);
                    setCurrentProjectId(newId);
                }
                navigate('/myProjects');
            } else if (format === 'json') {
                const dataStr = JSON.stringify({ stars, connections }, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${projectName}.json`;
                link.click();
                URL.revokeObjectURL(url);
            } else if (format === 'csv') {
                const csv = stars.map(s => `${s.name},${s.position[0]},${s.position[1]},${s.position[2]},${s.color},"${s.additionalInfo || ''}"`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${projectName}.csv`;
                link.click();
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Save failed:', err);
            alert('Save failed: ' + (err.message || 'Unknown error'));
        }
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let importedStars = [];
                let importedConnections = [];

                if (file.name.toLowerCase().endsWith('.json')) {
                    const data = JSON.parse(content);
                    importedStars = data.stars || [];
                    importedConnections = data.connections || [];
                } else if (file.name.toLowerCase().endsWith('.csv')) {
                    const lines = content.split('\n').filter(line => line.trim());

                    // Skip header
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',');

                        if (values[0] === 'Star') {
                            importedStars.push({
                                id: parseInt(values[1]),
                                name: values[2],
                                position: [
                                    parseFloat(values[3]),
                                    parseFloat(values[4]),
                                    parseFloat(values[5])
                                ],
                                color: values[6]
                            });
                        } else if (values[0] === 'Connection') {
                            // Extract connection IDs from correct positions
                            const fromId = parseInt(values[3]);
                            const toId = parseInt(values[4]);

                            if (!isNaN(fromId) && !isNaN(toId)) {
                                importedConnections.push([fromId, toId]);
                            }
                        }
                    }
                } else {
                    throw new Error('Unsupported file format');
                }

                // Validate imported data
                if (!Array.isArray(importedStars) || !Array.isArray(importedConnections)) {
                    throw new Error('Invalid file structure');
                }

                // Find max ID for nextId
                const maxId = Math.max(0, ...importedStars.map(star => star.id));
                setNextId(maxId + 1);

                setStars(importedStars);
                setConnections(importedConnections);
                alert('Project imported successfully!');
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to import file: ' + error.message);
            }
        };

        reader.readAsText(file);
        event.target.value = null; // Reset input
    };

    const triggerImport = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
            <Sidebar
                stars={stars}
                connections={connections}
                form={form}
                setForm={setForm}
                handleAddStar={handleAddStar}
                handleEditStar={handleEditStar}
                handleDeleteStar={handleDeleteStar}
                handleAddConnection={handleAddConnection}
                handleRemoveConnection={handleRemoveConnection}
                selectedStar={selectedStar}
                setSelectedStar={setSelectedStar}
                onSaveClick={() => setSaveDialogOpen(true)}
                onImportClick={triggerImport}
            />
            <div style={{ flex: 1 }}>
                <Scene
                    stars={stars}
                    connections={connections}
                    onStarHover={setHoveredStar}
                />
            </div>
            {hoveredStar && (
                <StarInfoPanel star={hoveredStar} />
            )}
            {saveDialogOpen && (
                <SaveDialog
                    onClose={() => setSaveDialogOpen(false)}
                    onSave={handleSave}
                    projectNameUpdate={projectNameUpdate}
                    isAuthenticated={!!user}
                />
            )}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json,.csv"
                onChange={handleImport}
            />
        </div>
    );
}