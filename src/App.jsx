// in App.jsx or wherever you define routes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from "./Pages/MainPage.jsx";
import ProjectEditor from "./Pages/ProjectEditor.jsx";
import ProjectsPage from "./Pages/ProjectsPage.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/create" element={<ProjectEditor />} />
                <Route path="/list" element={<ProjectsPage />} />
            </Routes>
        </Router>
    );
}
