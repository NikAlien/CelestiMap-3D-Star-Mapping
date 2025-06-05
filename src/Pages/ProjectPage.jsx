import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../components/Sidebar.jsx";

const ProjectPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/vi/project/${id}`)
            .then(res => setProject(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!project) return <p>Loading project...</p>;

    return (
        <div>
            <Sidebar/>
            <h2>{project.name}</h2>
            <pre>{project.dataJson}</pre>
        </div>
    );
};

export default ProjectPage;

