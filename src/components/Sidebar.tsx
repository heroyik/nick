import React from 'react';
import { Lightbulb, Bell, Edit2, Archive, Trash2 } from 'lucide-react';
import './Sidebar.css';

import type { Label } from './EditLabelsModal';
import { Tag } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    labels: Label[];
    selectedLabelId: string | null;
    onLabelClick: (labelId: string | null) => void;
    onEditLabels: () => void;
    activeView?: 'notes' | 'reminders' | 'archive' | 'trash';
    onViewChange?: (view: 'notes' | 'reminders' | 'archive' | 'trash') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    labels,
    selectedLabelId,
    onLabelClick,
    onEditLabels,
    activeView = 'notes',
    onViewChange
}) => {
    const navItems = [
        { icon: <Lightbulb size={24} />, label: 'Notes', active: activeView === 'notes' && selectedLabelId === null, onClick: () => { if (onViewChange) onViewChange('notes'); onLabelClick(null); } },
        { icon: <Bell size={24} />, label: 'Reminders', active: activeView === 'reminders', onClick: () => { if (onViewChange) onViewChange('reminders'); onLabelClick(null); } },
    ];

    const bottomItems = [
        { icon: <Edit2 size={24} />, label: 'Edit labels', onClick: onEditLabels },
        { icon: <Archive size={24} />, label: 'Archive', active: activeView === 'archive', onClick: () => { if (onViewChange) onViewChange('archive'); onLabelClick(null); } },
        { icon: <Trash2 size={24} />, label: 'Trash', active: activeView === 'trash', onClick: () => { if (onViewChange) onViewChange('trash'); onLabelClick(null); } },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <nav className="sidebar__nav">
                {navItems.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        className={`sidebar__item ${item.active ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); item.onClick(); }}
                    >
                        <span className="sidebar__icon">{item.icon}</span>
                        <span className="sidebar__label">{item.label}</span>
                    </a>
                ))}

                {labels.map(label => (
                    <a
                        key={label.id}
                        href="#"
                        className={`sidebar__item ${selectedLabelId === label.id ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onLabelClick(label.id); }}
                    >
                        <span className="sidebar__icon"><Tag size={24} /></span>
                        <span className="sidebar__label">{label.name}</span>
                    </a>
                ))}

                {bottomItems.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        className="sidebar__item"
                        onClick={(e) => { e.preventDefault(); item.onClick(); }}
                    >
                        <span className="sidebar__icon">{item.icon}</span>
                        <span className="sidebar__label">{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
};
