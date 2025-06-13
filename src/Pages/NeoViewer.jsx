import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NeoList from '../components/NeoList';
import '../Styles/NeoPage.css';
import NeoVisualization from "../Components/NeoVisulizer.jsx";

const NeoPage = () => {
    const [selectedNeo, setSelectedNeo] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="neo-container">
            <div className="neo-sidebar">
                <div className="neo-header">
                    <h2>🪐 Upcoming Asteroids</h2>
                    <button className="back-button" onClick={() => navigate('/')}>
                        ← Back to Dashboard
                    </button>
                </div>
                <NeoList onSelect={setSelectedNeo} />
            </div>
            <div className="neo-visualization">
                {selectedNeo ? (
                    <NeoVisualization neo={selectedNeo} />
                ) : (
                    <div className="neo-placeholder">Select an asteroid to see its 3D approach.</div>
                )}
            </div>
        </div>
    );
};

export default NeoPage;
