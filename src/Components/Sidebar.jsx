import {useAuth} from "../Context/AuthContext.jsx";
import { useNavigate} from "react-router-dom";
import {useEffect} from "react";
import '../Styles/SideBar.css'

export default function Sidebar({ stars, connections, form, setForm, handleAddStar, handleEditStar, handleDeleteStar, handleAddConnection,
                                    handleRemoveConnection, selectedStar, setSelectedStar, onSaveClick, onImportClick }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            if (window.confirm('All unsaved changes will be lost. Continue?')) {
                navigate(user ? '/myProjects' : '/');
            } else {
                window.history.pushState(null, "", window.location.href);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate, user]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleExit = () => {
        if (window.confirm('All unsaved changes will be lost. Continue?')) {
            navigate(user ? '/myProjects' : '/');
        }
    };

    return (
        <div className="sidebar">
            <button className="exit-btn" onClick={handleExit}>
                Exit Project
            </button>
            <div className="sidebar-actions">
                <button className="import-btn" onClick={onImportClick}>Import Project</button>
                <button className="save-btn" onClick={onSaveClick}>Save Project</button>
            </div>
            <hr/>
            <h2>{selectedStar ? 'Edit Star' : 'Add Star'}</h2>
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input type="number" placeholder="X" value={form.x} onChange={e => setForm({ ...form, x: e.target.value })} />
            <input type="number" placeholder="Y" value={form.y} onChange={e => setForm({ ...form, y: e.target.value })} />
            <input type="number" placeholder="Z" value={form.z} onChange={e => setForm({ ...form, z: e.target.value })} />
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
            <textarea
                placeholder="Additional Info"
                value={form.additionalInfo}
                onChange={e => setForm({ ...form, additionalInfo: e.target.value })}
            />
            {selectedStar ? (
                <button onClick={handleEditStar}>Save Star</button>
            ) : (
                <button onClick={handleAddStar}>Add Star</button>
            )}
            <hr />
            <h3 className="sidebar-title">Stars</h3>
            {stars.map(s => {
                const linkedStars = connections
                    .filter(([a, b]) => a === s.id || b === s.id)
                    .map(([a, b]) => (a === s.id ? b : a));
                return (
                    <div key={s.id} className="star-item">
                        <div className="star-header">
                            <strong>{s.name}</strong>
                            <div>
                                <button className="edit-btn-side" onClick={() => {
                                    setSelectedStar(s.id);
                                    setForm({ name: s.name, x: s.position[0], y: s.position[1], z: s.position[2], color: s.color, additionalInfo: s.additionalInfo });
                                }}
                                >Edit</button>
                                <button className="delete-star-btn" onClick={() => handleDeleteStar(s.id)}>Delete</button>
                            </div>
                        </div>
                        <div className="star-details">
                            <p><b>Coords:</b> {s.x} </p>
                            <p><b>Color:</b> <span style={{ color: s.color }}>{s.color}</span></p>
                        </div>
                        <div className="connections-list">
                            {linkedStars.map(cid => {
                                const other = stars.find(x => x.id === cid);
                                return (
                                    <span key={cid} className="connection-item">
                                        {other?.name}
                                        <button className="connection-delete-btn" onClick={() => handleRemoveConnection(s.id, cid)}>×</button>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="connect-controls">
                            <select
                                onChange={e => handleAddConnection(s.id, e.target.value)}
                                defaultValue=""
                            >
                                <option value="">Connect to...</option>
                                {stars
                                    .filter(x => x.id !== s.id && !linkedStars.includes(x.id))
                                    .map(x => (
                                        <option key={x.id} value={x.id}>{x.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}