import React, { useState } from 'react';
import { PixelCard } from './PixelCard';

export const LoginScreen = ({ onStart }) => {
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!id.trim()) return;
        setLoading(true);
        // Simulate a tiny delay for effect
        setTimeout(() => {
            onStart(id);
        }, 500);
    };

    return (
        <div className="login-screen">
            <h1 className="floating" style={{ color: 'var(--color-primary-light)', textShadow: '4px 4px #000' }}>
                PIXEL QUEST
            </h1>
            <PixelCard title="INSERT COIN (ID)">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="ENTER PLAYER ID"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontFamily: 'var(--font-pixel)',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: '4px solid var(--color-accent)',
                                outline: 'none',
                                textAlign: 'center',
                                fontSize: '14px'
                            }}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="pixel-btn" disabled={loading}>
                        {loading ? 'LOADING...' : 'START GAME'}
                    </button>
                </form>
            </PixelCard>
            <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '20px' }}>
                PRESS START BUTTON
            </div>
        </div>
    );
};
