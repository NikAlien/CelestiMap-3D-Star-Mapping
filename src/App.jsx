import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from "./Context/AuthContext.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/LogIn.jsx";
import Register from "./Pages/Register.jsx";
import ProjectEditor from "./Pages/ProjectEditor.jsx";
import Gallery from "./Pages/Gallery.jsx";
import FavoriteList from "./Pages/FavoriteList.jsx";
import MyProjects from "./Pages/MyProjects.jsx";
import ProjectViewer from "./Pages/ProjectView.jsx";
import NeoPage from "./Pages/NeoPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/favorites" element={<FavoriteList />} />
                <Route path="/myProjects" element={<MyProjects />} />
                <Route path="/create" element={<ProjectEditor />} />
                <Route path="/neos" element={<NeoPage />} />
                <Route path="/project/:projectId" element={<ProjectViewer />} />
            </Routes>
        </Router>
    );
}

export default App;