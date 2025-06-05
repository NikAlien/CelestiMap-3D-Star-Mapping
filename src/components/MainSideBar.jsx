import React from 'react';
import { Link } from 'react-router-dom';

const MainSidebar = () => {
    return (
        <div className="sidebar">
            <h3>Menu</h3>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/gallery">Browse Public Projects</Link></li>
                <li><Link to="/import">Import Project (CSV)</Link></li>
            </ul>
        </div>
    );
};

export default MainSidebar;