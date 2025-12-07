import React, { useState, useRef, useEffect } from 'react';
import { CheckSquare, Brush, Image as ImageIcon, Palette, Tag, X, Plus, Archive, Bell, Clock } from 'lucide-react';
import { ColorPalette } from './ColorPalette';
import { ReminderSelector } from './ReminderSelector';
import { LabelSelector } from './LabelSelector';
import type { Label } from './EditLabelsModal';
import './CreateNoteInput.css';

interface CreateNoteInputProps {
    onCreateNote: (note: { title: string; content: string; color?: string; labels?: string[]; image?: string; type?: 'text' | 'list'; items?: { id: string; text: string; checked: boolean }[]; reminder?: string }) => void;
    labels?: Label[];
    onAddLabel?: (name: string) => void;
}

export const CreateNoteInput: React.FC<CreateNoteInputProps> = ({ onCreateNote, labels = [], onAddLabel }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState<string | undefined>(undefined);
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState<'text' | 'list'>('text');
    const [listItems, setListItems] = useState<{ id: string; text: string; checked: boolean }[]>([]);
    const [newItemText, setNewItemText] = useState('');
    const [reminder, setReminder] = useState<string | undefined>(undefined);

    const [showPalette, setShowPalette] = useState(false);
    const [showLabelSelector, setShowLabelSelector] = useState(false);
    const [showReminderSelector, setShowReminderSelector] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        if (title.trim() || content.trim() || image || listItems.length > 0) {
            onCreateNote({
                title,
                content,
                color,
                labels: selectedLabelIds,
                image: image || undefined,
                type,
                items: listItems,
                reminder
            });
            setTitle('');
            setContent('');
            setColor(undefined);
            setSelectedLabelIds([]);
            setImage(null);
            setType('text');
            setListItems([]);
            setNewItemText('');
            setReminder(undefined);
        }
        setIsExpanded(false);
        setShowPalette(false);
        setShowLabelSelector(false);
        setShowReminderSelector(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setIsExpanded(true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [title, content, color, selectedLabelIds, image, listItems, newItemText, reminder]); // Updated changes

    const toggleLabel = (id: string) => {
        setSelectedLabelIds(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    return (
        <div className="create-note-wrapper">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
            />
            <div
                className={`create-note ${isExpanded ? 'expanded' : ''}`}
                ref={containerRef}
                onClick={() => !isExpanded && setIsExpanded(true)}
                style={{ backgroundColor: color || 'var(--color-surface)' }}
            >
                {!isExpanded ? (
                    <div className="create-note__collapsed">
                        <input type="text" placeholder="Take a note..." readOnly />
                        <div className="create-note__actions">
                            <button
                                className="icon-btn"
                                title="New list"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setType('list');
                                    setIsExpanded(true);
                                }}
                            >
                                <CheckSquare size={20} />
                            </button>
                            <button className="icon-btn" title="New note with drawing"><Brush size={20} /></button>
                            <button
                                className="icon-btn"
                                title="New note with image"
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            >
                                <ImageIcon size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="create-note__expanded">
                        {image && (
                            <div className="create-note__image-preview">
                                <img src={image} alt="Preview" />
                                <button
                                    className="remove-image-btn"
                                    onClick={(e) => { e.stopPropagation(); setImage(null); }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Title"
                            className="create-note__title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ backgroundColor: 'transparent' }}
                        />

                        {type === 'text' ? (
                            <textarea
                                placeholder="Take a note..."
                                className="create-note__content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                autoFocus={!image}
                                style={{ backgroundColor: 'transparent' }}
                            />
                        ) : (
                            <div className="create-note__list">
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
                                                color: item.checked ? 'var(--color-on-surface-variant)' : 'inherit'
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
                                        autoFocus
                                        style={{ flex: 1, border: 'none', background: 'transparent' }}
                                    />
                                </div>
                            </div>
                        )}

                        {(selectedLabelIds.length > 0 || reminder) && (
                            <div className="create-note__labels">
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

                        <div className="create-note__footer">
                            <div className="create-note__tools">
                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="icon-btn"
                                        title="Remind me"
                                        onClick={(e) => { e.stopPropagation(); setShowReminderSelector(!showReminderSelector); setShowPalette(false); setShowLabelSelector(false); }}
                                    >
                                        <Bell size={18} />
                                    </button>
                                    {showReminderSelector && !reminder && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 10 }}>
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
                                        title="Background options"
                                        onClick={(e) => { e.stopPropagation(); setShowPalette(!showPalette); setShowLabelSelector(false); setShowReminderSelector(false); }}
                                    >
                                        <Palette size={18} />
                                    </button>
                                    {showPalette && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 10 }}>
                                            <ColorPalette
                                                selectedColor={color}
                                                onSelectColor={(c) => { setColor(c); setShowPalette(false); }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="icon-btn"
                                    title="Add image"
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                >
                                    <ImageIcon size={18} />
                                </button>
                                <button className="icon-btn" title="Archive"><Archive size={18} /></button>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        className="icon-btn"
                                        title="Add label"
                                        onClick={(e) => { e.stopPropagation(); setShowLabelSelector(!showLabelSelector); setShowPalette(false); setShowReminderSelector(false); }}
                                    >
                                        <Tag size={18} />
                                    </button>
                                    {showLabelSelector && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 10 }}>
                                            <LabelSelector
                                                labels={labels}
                                                selectedLabelIds={selectedLabelIds}
                                                onToggleLabel={toggleLabel}
                                                onCreateLabel={onAddLabel}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="close-btn" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
