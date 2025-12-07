import React from 'react';
import { Pin, Archive, Trash2, RotateCcw } from 'lucide-react';
import './NoteCard.css';

export interface Note {
    id: string;
    title: string;
    content: string;
    color?: string;
    pinned?: boolean;
    labels?: string[];
    image?: string;
    type?: 'text' | 'list';
    items?: { id: string; text: string; checked: boolean }[];
    archived?: boolean;
    trashed?: boolean;
    reminder?: string; // ISO 8601 Date String
}

import type { Label } from './EditLabelsModal';

interface NoteCardProps {
    note: Note;
    onPin?: (id: string) => void;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
    onRestore?: (id: string) => void;
    labels?: Label[];
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPin, onArchive, onDelete, onRestore, labels = [] }) => {
    const noteLabels = labels.filter(l => note.labels?.includes(l.id));

    return (
        <div className="note-card" style={{ backgroundColor: note.color || 'var(--color-surface)' }}>
            {note.image && (
                <div className="note-card__image-container">
                    <img src={note.image} alt="Note attachment" className="note-card__image" />
                </div>
            )}
            {onPin && (
                <button
                    className={`pin-btn ${note.pinned ? 'pinned' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
                    title={note.pinned ? "Unpin note" : "Pin note"}
                >
                    <Pin size={18} />
                </button>
            )}
            {note.title && <h3 className="note-card__title">{note.title}</h3>}
            {note.type === 'list' && note.items ? (
                <div className="note-card__list">
                    {note.items.slice(0, 8).map(item => (
                        <div key={item.id} className="note-card__list-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            {item.checked ? <div className="checkbox checked">☑</div> : <div className="checkbox">☐</div>}
                            <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--color-on-surface-variant)' : 'inherit' }}>{item.text}</span>
                        </div>
                    ))}
                    {note.items.length > 8 && <div style={{ color: 'var(--color-on-surface-variant)', fontSize: '12px', marginTop: '4px' }}>+ {note.items.length - 8} more items</div>}
                </div>
            ) : (
                <div className="note-card__content">{note.content}</div>
            )}
            {noteLabels.length > 0 && (
                <div className="note-card__labels">
                    {noteLabels.map(label => (
                        <span key={label.id} className="note-label">
                            {label.name}
                        </span>
                    ))}
                </div>
            )}
            <div className="note-card__actions">
                {note.trashed ? (
                    <>
                        {onRestore && (
                            <button
                                className="action-btn"
                                onClick={(e) => { e.stopPropagation(); onRestore(note.id); }}
                                title="Restore"
                            >
                                <RotateCcw size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="action-btn"
                                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                                title="Delete forever"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {onArchive && (
                            <button
                                className="action-btn"
                                onClick={(e) => { e.stopPropagation(); onArchive(note.id); }}
                                title={note.archived ? "Unarchive" : "Archive"}
                            >
                                <Archive size={18} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="action-btn"
                                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
