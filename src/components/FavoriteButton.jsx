import React, { useState, useEffect } from "react";
import axios from "axios";

function FavoriteButton({ projectId }) {
    const [favorited, setFavorited] = useState(false);

    useEffect(() => {
        axios.get("/api/projects/favorites", { withCredentials: true }).then(res => {
            setFavorited(res.data.some(p => p.id === projectId));
        });
    }, [projectId]);

    const toggleFavorite = async () => {
        await axios.post(`/api/projects/favorite/${projectId}`, {}, { withCredentials: true });
        setFavorited(true);
    };

    return (
        <button onClick={toggleFavorite} className="btn">
            {favorited ? "★ Favorited" : "☆ Add to Favorites"}
        </button>
    );
}

export default FavoriteButton;
