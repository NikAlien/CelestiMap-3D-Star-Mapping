
import { useNavigate } from 'react-router-dom';
import './InfoPage.css';

export default function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="info-page">
            <header>
                <img src="./src/mainMenu.png" id="pieChartLogo" alt="Menu Logo" />
            </header>
            <main>
                <div id="center">
                    <h2>Welcome to the Star Constellation App!</h2>
                    <p>This application lets you create, manage, and visualize constellations in 3D space.</p>
                    <button onClick={() => navigate('/create')}>Create project</button>
                </div>
            </main>
        </div>
    );
}
