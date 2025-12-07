import React from 'react';
import './MasonryGrid.css';

interface MasonryGridProps {
    children: React.ReactNode;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ children }) => {
    return (
        <div className="masonry-grid">
            {children}
        </div>
    );
};
