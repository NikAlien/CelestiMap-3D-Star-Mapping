import React, { useRef } from "react";
import axios from "axios";

function ProjectEditor({ projectId }) {
    const fileInputRef = useRef();

    const handleImport = async () => {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);
        await axios.post("/api/projects/import", formData, { withCredentials: true });
        alert("Imported successfully!");
    };

    const handleExport = async () => {
        const res = await axios.get(`/api/projects/export/csv/${projectId}`, {
            responseType: "blob",
            withCredentials: true,
        });
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "project.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="p-4">
            <input type="file" ref={fileInputRef} accept=".csv" />
            <button onClick={handleImport} className="btn">Import CSV</button>
            <button onClick={handleExport} className="btn">Export CSV</button>
        </div>
    );
}

export default ProjectEditor;
