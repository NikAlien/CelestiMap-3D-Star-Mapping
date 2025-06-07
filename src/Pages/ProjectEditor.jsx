import {useState, useEffect, useRef} from 'react';
// import { v4 as uuidv4 } from 'uuid';
import Scene from "../Components/Scene.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import SaveDialog from "../Components/SaveDialog.jsx";

const LOCAL_STORAGE_KEY = 'starConstellationDataV2';

export default function ProjectEditor() {
    const [nextId, setNextId] = useState(1);
    const [stars, setStars] = useState([]);
    const [connections, setConnections] = useState([]);
    const [form, setForm] = useState({ name: '', x: 0, y: 0, z: 0, color: '#ffffff' });
    const [selectedStar, setSelectedStar] = useState(null);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (saved) {
            setStars(saved.stars || []);
            setConnections(saved.connections || []);
            const maxId = Math.max(...saved.stars.map(star => star.id), 0);
            setNextId(maxId + 1);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ stars, connections }));
    }, [stars, connections]);

    const handleAddStar = () => {
        const newStar = {
            id: nextId,
            name: form.name,
            position: [parseFloat(form.x), parseFloat(form.y), parseFloat(form.z)],
            color: form.color
        };
        setStars([...stars, newStar]);
        setNextId(nextId + 1);
        setForm({ name: '', x: 0, y: 0, z: 0, color: '#ffffff' });
    };

    const handleEditStar = () => {
        setStars(stars.map(s =>
            s.id === selectedStar ? { ...s, ...form, position: [parseFloat(form.x), parseFloat(form.y), parseFloat(form.z)] } : s
        ));
        setSelectedStar(null);
    };

    const handleDeleteStar = (id) => {
        setStars(stars.filter(s => s.id !== id));
        setConnections(connections.filter(pair => !pair.includes(id)));
    };

    const handleAddConnection = (id1, id2) => {
        if (id1 !== id2 && !connections.some(pair =>
            (pair[0] === id1 && pair[1] === id2) ||
            (pair[0] === id2 && pair[1] === id1)
        )) {
            setConnections([...connections, [id1, id2]]);
        }
    };

    const handleSave = (saveData) => {
        const { projectName, format } = saveData;

        if (format === 'json') {
            const data = JSON.stringify({ stars, connections }, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${projectName}.json`;
            link.click();
        }
        else if (format === 'csv') {
            // Generate CSV content
            let csvContent = "Type,Id,Name,X,Y,Z,Color,From,To\n";

            // Stars
            stars.forEach(star => {
                csvContent += `Star,${star.id},${star.name},${star.position[0]},${star.position[1]},${star.position[2]},${star.color},,\n`;
            });

            // Connections
            connections.forEach(conn => {
                csvContent += `Connection,,${conn[0]},${conn[1]},,,,,,\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${projectName}.csv`;
            link.click();
        }
        else if (format === 'online') {
            fetch('http://localhost:8080/api/v1/project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectName,
                    stars: stars.map(star => ({
                        id: star.id,
                        name: star.name,
                        x: star.position[0],
                        y: star.position[1],
                        z: star.position[2],
                        color: star.color
                    })),
                    connections,
                    visibility
                })
            })
                .then(response => {
                    if (response.ok) alert('Saved online successfully!');
                    else alert('Save failed');
                })
                .catch(error => alert('Error: ' + error.message));
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
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar
                stars={stars}
                form={form}
                setForm={setForm}
                handleAddStar={handleAddStar}
                handleEditStar={handleEditStar}
                handleDeleteStar={handleDeleteStar}
                handleAddConnection={handleAddConnection}
                selectedStar={selectedStar}
                setSelectedStar={setSelectedStar}
                onSaveClick={() => setSaveDialogOpen(true)}
                onImportClick={triggerImport}
            />
            <div style={{ flex: 1 }}>
                <Scene stars={stars} connections={connections} />
            </div>
            {saveDialogOpen && (
                <SaveDialog
                    onClose={() => setSaveDialogOpen(false)}
                    onSave={handleSave}
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