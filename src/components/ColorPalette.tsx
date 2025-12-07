import React from 'react';
import { Check } from 'lucide-react';
import './ColorPalette.css';

export const NOTE_COLORS = [
    { id: 'default', color: 'var(--color-surface)', label: 'Default' },
    { id: 'red', color: '#faafa8', label: 'Red' },
    { id: 'orange', color: '#f39f76', label: 'Orange' },
    { id: 'yellow', color: '#fff8b8', label: 'Yellow' },
    { id: 'green', color: '#e2f6d3', label: 'Green' },
    { id: 'teal', color: '#b4ddd3', label: 'Teal' },
    { id: 'blue', color: '#d4e4ed', label: 'Blue' },
    { id: 'darkblue', color: '#aeccdc', label: 'Dark Blue' },
    { id: 'purple', color: '#d3bfdb', label: 'Purple' },
    { id: 'pink', color: '#f6e2dd', label: 'Pink' },
    { id: 'brown', color: '#e9e3d4', label: 'Brown' },
    { id: 'gray', color: '#efeff1', label: 'Gray' },
];

interface ColorPaletteProps {
    selectedColor?: string;
    onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
    return (
        <div className="color-palette">
            {NOTE_COLORS.map((c) => (
                <button
                    key={c.id}
                    className={`color-btn ${selectedColor === c.color ? 'selected' : ''}`}
                    style={{ backgroundColor: c.color }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectColor(c.color);
                    }}
                    title={c.label}
                    aria-label={c.label}
                >
                    {selectedColor === c.color && <Check size={16} className="check-icon" />}
                </button>
            ))}
        </div>
    );
};
