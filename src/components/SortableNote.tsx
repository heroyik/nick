import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NoteCard } from './NoteCard';
import type { Note } from './NoteCard';

import type { Label } from './EditLabelsModal';

interface SortableNoteProps {
    note: Note;
    onPin: (id: string) => void;
    onArchive: (id: string) => void;
    onDelete?: (id: string) => void;
    onRestore?: (id: string) => void;
    onDeleteForever?: (id: string) => void;
    onReminder?: (id: string, date: string | undefined) => void;
    onClick: (note: Note) => void;
    labels: Label[];
}

export const SortableNote: React.FC<SortableNoteProps> = ({ note, onPin, onArchive, onDelete, onRestore, onDeleteForever, onClick, labels }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: note.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(note)}
        >
            <NoteCard
                note={note}
                onPin={onPin}
                onArchive={onArchive}
                onDelete={note.trashed && onDeleteForever ? onDeleteForever : onDelete}
                onRestore={onRestore}

                labels={labels}
            />
        </div>
    );
};
