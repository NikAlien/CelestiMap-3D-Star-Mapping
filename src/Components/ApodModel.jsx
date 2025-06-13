import React from 'react';
import '../Styles/ApodModel.css';
import { useState, useEffect } from 'react';
import { subscribeApod, unsubscribeApod, checkSubscribedApod } from '../Context/API.js';
import { useAuth } from '../Context/AuthContext.jsx';

export default function ApodModel({ data, onClose }) {
    const [subscribed, setSubscribed] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            checkSubscribedApod(user.token).then(res => setSubscribed(res.data));
        }
    }, [user]);

    const handleToggle = async () => {
        try {
            if (!subscribed) {
                await subscribeApod(user.token);
                setSubscribed(true);
            } else {
                await unsubscribeApod(user.token);
                setSubscribed(false);
            }
        } catch (err) {
            console.error("Subscription toggle failed", err);
        }
    };

    if (!data) return null;

    return (
        <div className="apod-backdrop">
            <div className="apod-container">
                <button className="apod-close" onClick={onClose}>×</button>
                <h2>{data.title} ({new Date(data.date).toLocaleDateString()})</h2>
                {user && (
                    <button
                        className={`apod-subscribe ${subscribed ? 'subscribed' : ''}`}
                        onClick={handleToggle}
                        title={subscribed ? "Click to unsubscribe from daily emails" : "Click to subscribe to daily emails"}
                    >
                        {subscribed ? "✓ Receiving Daily Facts" : "Notify Me Daily"}
                    </button>
                )}
                <p className="apod-explanation">More Infromation below↓</p>
                <img src={data.hdUrl || data.url} alt={data.title} />
                <p className="apod-explanation">{data.explanation}</p>
            </div>
        </div>
    );
}
