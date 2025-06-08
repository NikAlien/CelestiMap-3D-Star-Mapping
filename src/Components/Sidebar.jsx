import {useAuth} from "../Context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

export default function Sidebar({ stars, form, setForm, handleAddStar, handleEditStar, handleDeleteStar, handleAddConnection, selectedStar, setSelectedStar, onSaveClick, onImportClick }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div style={{ width: '300px', padding: '1rem', background: '#1a1a1a', color: 'white', overflowY: 'auto' }}>
            <button className="exit-btn" onClick={() => {
                if(window.confirm('All unsaved changes will be lost. Continue?')) {
                    navigate(user ? '/myProjects' : '/');
                }}}>
                Exit Project
            </button>
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
            <h3>Stars</h3>
            {stars.map(s => (
                <div key={s.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>{s.name}</strong> ({s.position.join(', ')})
                    <div>
                        <button onClick={() => {
                            setSelectedStar(s.id);
                            setForm({ name: s.name, x: s.position[0], y: s.position[1], z: s.position[2], color: s.color, additionalInfo: s.additionalInfo });
                        }}>Edit</button>
                        <button onClick={() => handleDeleteStar(s.id)}>Delete</button>
                        <select onChange={e => handleAddConnection(s.id, e.target.value)} defaultValue="">
                            <option value="">Connect to...</option>
                            {stars.filter(o => o.id !== s.id).map(o => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <hr />
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button onClick={onImportClick} style={{ marginTop: '1rem', padding: '0.5rem' }}> Import</button>
                <button onClick={onSaveClick} style={{ marginTop: '1rem', padding: '0.5rem' }}> Save Project</button>
            </div>
        </div>
    );
}