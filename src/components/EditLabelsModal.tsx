import React, { useState } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import './EditLabelsModal.css';

export interface Label {
    id: string;
    name: string;
}

interface EditLabelsModalProps {
    isOpen: boolean;
    onClose: () => void;
    labels: Label[];
    onAddLabel: (name: string) => void;
    onUpdateLabel: (id: string, name: string) => void;
    onDeleteLabel: (id: string) => void;
}

export const EditLabelsModal: React.FC<EditLabelsModalProps> = ({
    isOpen,
    onClose,
    labels,
    onAddLabel,
    onUpdateLabel,
    onDeleteLabel,
}) => {
    const [newLabelName, setNewLabelName] = useState('');
    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newLabelName.trim()) {
            onAddLabel(newLabelName.trim());
            setNewLabelName('');
        }
    };

    const handleUpdate = (id: string) => {
        if (editName.trim()) {
            onUpdateLabel(id, editName.trim());
            setEditingLabelId(null);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-labels-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Edit labels</h3>
                </div>

                <div className="modal-body">
                    <div className="create-label-row">
                        <div className="icon-btn" onClick={() => setNewLabelName('')}>
                            <X size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Create new label"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <div className="icon-btn" onClick={handleAdd}>
                            <Check size={20} />
                        </div>
                    </div>

                    <div className="labels-list">
                        {labels.map(label => (
                            <div key={label.id} className="label-row">
                                {editingLabelId === label.id ? (
                                    <>
                                        <div className="icon-btn" onClick={() => setEditingLabelId(null)}>
                                            <Trash2 size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(label.id)}
                                            autoFocus
                                        />
                                        <div className="icon-btn" onClick={() => handleUpdate(label.id)}>
                                            <Check size={20} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="icon-btn" onClick={() => onDeleteLabel(label.id)}>
                                            <Trash2 size={20} />
                                        </div>
                                        <span className="label-name" onClick={() => {
                                            setEditingLabelId(label.id);
                                            setEditName(label.name);
                                        }}>
                                            {label.name}
                                        </span>
                                        <div className="icon-btn" onClick={() => {
                                            setEditingLabelId(label.id);
                                            setEditName(label.name);
                                        }}>
                                            <Edit2 size={20} />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="done-btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};
