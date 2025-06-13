import React from 'react';
import '../Styles/ApodModel.css';

export default function ApodModel({ data, onClose }) {
    if (!data) return null;

    return (
        <div className="apod-backdrop">
            <div className="apod-container">
                <button className="apod-close" onClick={onClose}>×</button>
                <h2>{data.title} ({new Date(data.date).toLocaleDateString()})</h2>
                <p className="apod-explanation">More Infromation ↓</p>
                <img src={data.hdUrl || data.url} alt={data.title} />
                <p className="apod-explanation">{data.explanation}</p>
            </div>
        </div>
    );
}
