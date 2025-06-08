import React from 'react';
import '../Styles/Scene.css'

export default function StarInfoPanel({ star }) {
    if (!star) return null;

    return (
        <div className="star-info-panel">
            <h3>{star.name}</h3>
            <div className="info-grid">
                <div>Position:</div>
                <div>{Array.isArray(star.position) ? star.position.join(', ') : 'N/A'}</div>
                <div>Color:</div>
                <div>
                    <span className="color-box" style={{ backgroundColor: star.color }} />
                    {star.color}
                </div>
                {star.additionalInfo && (
                    <>
                        <div>Info:</div>
                        <div className="additional-info">
                            {star.additionalInfo}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}