import { useState } from 'react';

export default function SaveDialog({ onClose, onSave, projectNameUpdate, isAuthenticated }) {
    const [projectName, setProjectName] = useState(projectNameUpdate);
    const [format, setFormat] = useState('json');
    const [visibility, setVisibility] = useState('private');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ projectName, format, visibility });
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Save Project</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Project Name:
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Format:
                        <select value={format} onChange={e => setFormat(e.target.value)}>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            {isAuthenticated && <option value="online">Online</option>}
                        </select>
                    </label>

                    {format === 'online' && (
                        <label>
                            Visibility:
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}>
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </label>
                    )}

                    <div className="button-group">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}