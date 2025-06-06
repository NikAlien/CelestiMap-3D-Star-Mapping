import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from "./Context/AuthContext.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/LogIn.jsx";
import Register from "./Pages/Register.jsx";

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;