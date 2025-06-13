import React, { useEffect, useState } from 'react';

const NeoList = ({ onSelect }) => {
    const [neos, setNeos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/neos/upcoming')
            .then(res => res.json())
            .then(setNeos)
            .catch(err => console.error('Failed to fetch NEOs:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading asteroids…</p>;

    return (
        <div>
            {neos.map((neo) => (
                <div
                    key={neo.id}
                    onClick={() => onSelect(neo)}
                    style={{
                        border: '1px solid #ccc',
                        marginBottom: '10px',
                        padding: '10px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        color: 'black',
                    }}
                >
                    <strong>{neo.name}</strong><br />
                    📅 {neo.closeApproachDate}<br />
                    ∅ {neo.diameterMinMeters.toFixed(1)}–{neo.diameterMaxMeters.toFixed(1)} m<br />
                    ➖ Miss: {parseInt(neo.missDistanceKm).toLocaleString()} km
                </div>
            ))}
        </div>
    );
};

export default NeoList;
