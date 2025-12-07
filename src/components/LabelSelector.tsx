import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { Label } from './EditLabelsModal';
import './LabelSelector.css';

interface LabelSelectorProps {
    labels: Label[];
    selectedLabelIds: string[];
    onToggleLabel: (id: string) => void;
    onCreateLabel?: (name: string) => void;
}

export const LabelSelector: React.FC<LabelSelectorProps> = ({
    labels,
    selectedLabelIds,
    onToggleLabel,
    onCreateLabel
}) => {
    const [search, setSearch] = useState('');

    const filteredLabels = labels.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = () => {
        if (onCreateLabel && search.trim()) {
            onCreateLabel(search.trim());
            setSearch('');
        }
    };

    return (
        <div className="label-selector" onClick={(e) => e.stopPropagation()}>
            <div className="label-selector__header">
                <div className="label-selector__search">
                    <input
                        type="text"
                        placeholder="Enter label name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                    <Search size={16} className="search-icon" />
                </div>
            </div>
            <div className="label-selector__list">
                {filteredLabels.map(label => (
                    <div
                        key={label.id}
                        className="label-selector__item"
                        onClick={() => onToggleLabel(label.id)}
                    >
                        <input
                            type="checkbox"
                            checked={selectedLabelIds.includes(label.id)}
                            onChange={() => { }} // Handled by parent div click
                        />
                        <span className="label-name">{label.name}</span>
                    </div>
                ))}
                {onCreateLabel && search.trim() && !filteredLabels.find(l => l.name.toLowerCase() === search.toLowerCase()) && (
                    <div className="label-selector__create" onClick={handleCreate}>
                        <span className="create-icon">+</span>
                        <span className="create-text">Create "{search}"</span>
                    </div>
                )}
            </div>
        </div>
    );
};
