import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Scene from './components/Scene';
import Sidebar from './components/Sidebar';

const LOCAL_STORAGE_KEY = 'starConstellationData';

export default function App() {
    const [stars, setStars] = useState([]);
    const [connections, setConnections] = useState([]);
    const [form, setForm] = useState({ name: '', x: 0, y: 0, z: 0, color: '#ffffff' });
    const [selectedStar, setSelectedStar] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (saved) {
            setStars(saved.stars || []);
            setConnections(saved.connections || []);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ stars, connections }));
    }, [stars, connections]);

    const handleAddStar = () => {
        const newStar = {
            id: uuidv4(),
            name: form.name,
            position: [parseFloat(form.x), parseFloat(form.y), parseFloat(form.z)],
            color: form.color
        };
        setStars([...stars, newStar]);
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
            />
            <div style={{ flex: 1 }}>
                <Scene stars={stars} connections={connections} />
            </div>
        </div>
    );
}