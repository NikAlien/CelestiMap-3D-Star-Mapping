import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PublicGallery = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/vi/project/public')
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Public Projects</h2>
            <ul>
                {projects.map(p => (
                    <li key={p.id}>
                        <Link to={`/project/${p.id}`}>{p.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PublicGallery;
