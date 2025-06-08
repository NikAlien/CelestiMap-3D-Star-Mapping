export default function StarInfoPanel({ star, onClose }) {
    if (!star) return null;

    return (
        <div className="star-info-panel">
            <button className="close-btn" onClick={onClose}>×</button>
            <h3>{star.name}</h3>
            <div className="info-grid">
                <div>Position:</div>
                <div>{star.position.join(', ')}</div>
                <div>Color:</div>
                <div>
                    <span className="color-box" style={{ backgroundColor: star.color }} />
                    {star.color}
                </div>
                <div>Additional Info:</div>
                <div className="additional-info">
                    {star.additionalInfo || 'No additional info'}
                    {star.additionalInfo?.length > 100 && (
                        <a className="more-link">More info</a>
                    )}
                </div>
            </div>
        </div>
    );
}