import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../Styles/Dashboard.css';
import Navbar from "../Components/Navbar.jsx";
import {fetchApod} from "../Context/API.js";
import ApodModel from "../Components/ApodModel.jsx";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [apodData, setApodData] = useState(null);

    const handleShowApod = async () => {
        try {
            const resp = await fetchApod();
            setApodData(resp.data);
        } catch (e) {
            console.error("Failed to load APOD", e);
        }
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-hero">
                <h1>Discover the Galaxy!</h1>
                <p>Create and explore constellations in an interactive 3D universe</p>

                <div className="dashboard-actions">
                    {user ? (
                        <>
                            <button className="dashboard-button" onClick={() => navigate('/create')}>
                                Create New Project
                            </button>
                            <button className="dashboard-button" onClick={handleShowApod}>
                                APOD
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="dashboard-button" onClick={() => navigate('/create')}>
                                Start Your Journey
                            </button>
                            <button className="dashboard-button" onClick={handleShowApod}>
                                APOD
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="dashboard-features">
                <div className="feature-card">
                    <h3>3D Star Visualization</h3>
                    <p>Navigate space with zoom, pan and rotation controls</p>
                </div>
                <div className="feature-card">
                    <h3>Create & Share</h3>
                    <p>Build constellations and share with the community</p>
                </div>
                <div className="feature-card">
                    <h3>Explore Galaxies</h3>
                    <p>Discover public projects from other astronomers</p>
                </div>
            </div>
            <ApodModel data={apodData} onClose={() => setApodData(null)} />
        </div>
    );
};

export default Dashboard;