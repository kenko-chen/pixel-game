import React from 'react';

export const PixelCard = ({ children, className = '', title }) => {
    return (
        <div className={`pixel-box ${className}`}>
            {title && (
                <h2 style={{
                    marginTop: '-40px',
                    marginBottom: '20px',
                    background: 'var(--color-bg)',
                    display: 'inline-block',
                    padding: '0 10px',
                    color: 'var(--color-accent)'
                }}>
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};
