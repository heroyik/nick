import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Archive, Palette, Tag, Image as ImageIcon, X, Plus, RotateCcw, Bell, Clock } from 'lucide-react';
import { ColorPalette } from './ColorPalette';
import { ReminderSelector } from './ReminderSelector';
import { LabelSelector } from './LabelSelector';
import type { Label } from './EditLabelsModal';
import type { Note } from './NoteCard';
import './EditNoteModal.css';

interface EditNoteModalProps {
    note: Note;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedNote: Note) => void;
    onDelete: (id: string) => void;
    onArchive: (id: string) => void;
    onRestore?: (id: string) => void;
    onDeleteForever?: (id: string) => void;
    labels?: Label[];
    onAddLabel?: (name: string) => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
    note,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    onArchive,
    onRestore,
    onDeleteForever,
    labels = [],
    onAddLabel
}) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [color, setColor] = useState(note.color);
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(note.labels || []);
    const [image, setImage] = useState<string | undefined>(note.image);
    const [type, setType] = useState<'text' | 'list'>(note.type || 'text');
    const [listItems, setListItems] = useState<{ id: string; text: string; checked: boolean }[]>(note.items || []);
    const [reminder, setReminder] = useState<string | undefined>(note.reminder);
    const [newItemText, setNewItemText] = useState('');

    const [showPalette, setShowPalette] = useState(false);
    const [showLabelSelector, setShowLabelSelector] = useState(false);
    const [showReminderSelector, setShowReminderSelector] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setColor(note.color);
        setSelectedLabelIds(note.labels || []);
        setImage(note.image);
        setType(note.type || 'text');
        setListItems(note.items || []);
        setReminder(note.reminder);
    }, [note]);

    if (!isOpen) return null;

    const handleClose = () => {
        onUpdate({
            ...note,
            title,
            content: type === 'text' ? content : '',
            color,
            labels: selectedLabelIds,
            image,
            type,
            items: type === 'list' ? listItems : undefined,
            reminder
        });

        onClose();
    };

    const handleDelete = () => {
        onDelete(note.id);
        onClose();
    };

    const handleArchive = () => {
        onArchive(note.id);
        onClose();
    };

    const handleRestore = () => {
        if (onRestore) {
            onRestore(note.id);
            onClose();
        }
    };

    const handlePermanentDelete = () => {
        if (onDeleteForever) {
            onDeleteForever(note.id);
            onClose();
        }
    };

    const toggleLabel = (id: string) => {
        setSelectedLabelIds(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addListItem = () => {
        if (newItemText.trim()) {
            setListItems([...listItems, { id: Date.now().toString(), text: newItemText, checked: false }]);
            setNewItemText('');
        }
    };

    const toggleListItem = (id: string) => {
        setListItems(listItems.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const removeListItem = (id: string) => {
        setListItems(listItems.filter(item => item.id !== id));
    };

    const updateListItemText = (id: string, text: string) => {
        setListItems(listItems.map(item =>
            item.id === id ? { ...item, text } : item
        ));
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
            />
            <div
                className="modal-content"
                onClick={(e) => { e.stopPropagation(); setShowPalette(false); setShowLabelSelector(false); }}
                style={{ backgroundColor: color || 'var(--color-surface)' }}
            >
                {image && (
                    <div className="edit-note__image-preview">
                        <img src={image} alt="Note attachment" />
                        <button
                            className="remove-image-btn"
                            onClick={(e) => { e.stopPropagation(); setImage(undefined); }}
                            style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <input
                    type="text"
                    className="modal-title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ backgroundColor: 'transparent' }}
                />

                {type === 'text' ? (
                    <textarea
                        ref={(textarea: HTMLTextAreaElement | null) => {
                            if (textarea) {
                                textarea.style.height = 'auto';
                                textarea.style.height = textarea.scrollHeight + 'px';
                            }
                        }}
                        className="modal-body"
                        placeholder="Note"
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setContent(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        style={{ backgroundColor: 'transparent' }}
                    />
                ) : (
                    <div className="create-note__list" style={{ marginBottom: '16px' }}>
                        {listItems.map(item => (
                            <div key={item.id} className="list-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <div
                                    className="checkbox"
                                    onClick={() => toggleListItem(item.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.checked ? '☑' : '☐'}
                                </div>
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => updateListItemText(item.id, e.target.value)}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        background: 'transparent',
                                        textDecoration: item.checked ? 'line-through' : 'none',
                                        color: item.checked ? 'var(--color-on-surface-variant)' : 'inherit',
                                        fontSize: '14px',
                                        padding: '4px 0'
                                    }}
                                />
                                <button className="icon-btn" onClick={() => removeListItem(item.id)}>
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <div className="list-item-input" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--color-outline-variant)', paddingTop: '8px', marginTop: '8px' }}>
                            <Plus size={16} />
                            <input
                                type="text"
                                placeholder="List item"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addListItem();
                                    }
                                }}
                                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                )}

                {(selectedLabelIds.length > 0 || reminder) && (
                    <div className="modal-labels" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '0 16px 12px' }}>
                        {reminder && (
                            <span className="note-tag reminder-tag" onClick={(e) => { e.stopPropagation(); setShowReminderSelector(!showReminderSelector); }}>
                                <Clock size={12} />
                                {(() => {
                                    const dateStr = reminder;
                                    const date = new Date(dateStr);
                                    const now = new Date();
                                    const isToday = date.toDateString() === now.toDateString();
                                    const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === date.toDateString();
                                    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' });
                                    if (isToday) return `Today, ${time}`;
                                    if (isTomorrow) return `Tomorrow, ${time}`;
                                    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
                                })()}
                                <button
                                    className="remove-tag-btn"
                                    onClick={(e) => { e.stopPropagation(); setReminder(undefined); }}
                                >
                                    <X size={12} />
                                </button>
                                {showReminderSelector && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10 }}>
                                        <ReminderSelector
                                            onSelectReminder={(date) => setReminder(date)}
                                            onClose={() => setShowReminderSelector(false)}
                                        />
                                    </div>
                                )}
                            </span>
                        )}
                        {labels.filter(l => selectedLabelIds.includes(l.id)).map(label => (
                            <span key={label.id} className="note-label">
                                {label.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="modal-footer">
                    <div className="modal-actions">
                        {note.trashed ? (
                            <>
                                <button className="icon-btn" onClick={handleRestore} title="Restore">
                                    <RotateCcw size={20} />
                                </button>
                                <button className="icon-btn" onClick={handlePermanentDelete} title="Delete forever">
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="icon-btn"
                                        onClick={(e) => { e.stopPropagation(); setShowPalette(!showPalette); setShowLabelSelector(false); setShowReminderSelector(false); }}
                                        title="Background options"
                                    >
                                        <Palette size={20} />
                                    </button>
                                    {showPalette && (
                                        <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '8px', zIndex: 10 }}>
                                            <ColorPalette
                                                selectedColor={color}
                                                onSelectColor={(c) => setColor(c)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="icon-btn"
                                    title="Add image"
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                >
                                    <ImageIcon size={20} />
                                </button>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="icon-btn"
                                        title="Remind me"
                                        onClick={(e) => { e.stopPropagation(); setShowReminderSelector(!showReminderSelector); setShowPalette(false); setShowLabelSelector(false); }}
                                    >
                                        <Bell size={20} />
                                    </button>
                                    {showReminderSelector && !reminder && (
                                        <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '8px', zIndex: 10 }}>
                                            <ReminderSelector
                                                onSelectReminder={(date) => setReminder(date)}
                                                onClose={() => setShowReminderSelector(false)}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="icon-btn"
                                        title="Add label"
                                        onClick={(e) => { e.stopPropagation(); setShowLabelSelector(!showLabelSelector); setShowPalette(false); }}
                                    >
                                        <Tag size={20} />
                                    </button>
                                    {showLabelSelector && (
                                        <div style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '8px', zIndex: 10 }}>
                                            <LabelSelector
                                                labels={labels}
                                                selectedLabelIds={selectedLabelIds}
                                                onToggleLabel={toggleLabel}
                                                onCreateLabel={onAddLabel}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button className="icon-btn" onClick={handleArchive} title="Archive">
                                    <Archive size={20} />
                                </button>
                                <button className="icon-btn" onClick={handleDelete} title="Delete">
                                    <Trash2 size={20} />
                                </button>
                            </>
                        )}
                    </div>
                    <button className="close-btn" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
};
