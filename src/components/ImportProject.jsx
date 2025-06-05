import React, { useState } from 'react';
import axios from 'axios';

const ImportProject = () => {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post('http://localhost:8080/api/projects/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponse(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Import Project</h2>
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
    );
};

export default ImportProject;