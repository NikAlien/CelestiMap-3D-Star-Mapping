import React, { useEffect, useState } from 'react';
import { fetchUpcomingNeos } from "../Context/API.js";
import NeoVisualization from "../Components/NeoVisulizer.jsx";
import '../Styles/NeoPage.css';
import {useNavigate} from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";

export default function NeoPage() {
    const [neos, setNeos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNeo, setSelectedNeo] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchUpcomingNeos(startDate || undefined, endDate || undefined)
            .then(response => {
                setNeos(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch NEOs', err);
                setError('Failed to fetch NEO data');
                setLoading(false);
            });
    }, [startDate, endDate]);

    return (
        <div className="neo-page-container">
            <Navbar/>
            <header className="neo-page-header">
                <h1>Upcoming Near-Earth Objects</h1>
                <p>Select an object below to view an interactive 3D visualization.</p>
            </header>

            {loading && <p className="neo-loading">Loading...</p>}
            {error && <p className="neo-error">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="neo-select-container">
                        <label>
                            Select NEO:
                            <select
                                value={selectedNeo ? selectedNeo.id : ''}
                                onChange={e => {
                                    const id = e.target.value;
                                    const neo = neos.find(n => n.id === id);
                                    setSelectedNeo(neo || null);
                                }}
                            >
                                <option value="">-- choose --</option>
                                {neos.map(n => (
                                    <option key={n.id} value={n.id}>
                                        {n.name} (Close: {n.closeApproachDate}, Miss: {Math.round(n.missDistanceKm).toLocaleString()} km)
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {selectedNeo && (
                        <div className="neo-viz-wrapper">
                            <NeoVisualization neo={selectedNeo} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
