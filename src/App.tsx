import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { MainLayout } from './layouts/MainLayout';
import { Sidebar } from './components/Sidebar';
import { MasonryGrid } from './components/MasonryGrid';
import { CreateNoteInput } from './components/CreateNoteInput';
import { EditNoteModal } from './components/EditNoteModal';
import { EditLabelsModal } from './components/EditLabelsModal';
import type { Label } from './components/EditLabelsModal';
import { SortableNote } from './components/SortableNote';
import type { Note } from './components/NoteCard';

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Project Ideas', content: '1. Google Keep Clone\n2. Weather App\n3. Todo List', color: '#faafa8' },
  { id: '2', title: 'Groceries', content: 'Milk\nEggs\nBread\nButter', color: '#fff8b8' },
  { id: '3', title: '', content: 'Just a quick thought without a title.' },
  { id: '4', title: 'Meeting Notes', content: 'Discuss Q4 goals.\nReview budget.\nTeam building event.', color: '#d4e4ed' },
  { id: '5', title: 'Recipe', content: 'Pancakes:\n- Flour\n- Milk\n- Eggs\n- Sugar\n- Baking powder', color: '#e2f6d3' },
  { id: '6', title: 'To Watch', content: 'Inception\nInterstellar\nThe Matrix', pinned: true },
];

function App() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditLabelsModalOpen, setIsEditLabelsModalOpen] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'notes' | 'reminders' | 'archive' | 'trash'>('notes');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addNote = (newNote: { title: string; content: string; color?: string; labels?: string[]; image?: string; type?: 'text' | 'list'; items?: { id: string; text: string; checked: boolean }[] }) => {
    const note: Note = {
      id: Date.now().toString(),
      items: [],
      type: 'text',
      ...newNote,
      pinned: false,
      archived: false,
    };
    setNotes([note, ...notes]);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, trashed: true, archived: false, pinned: false } : n));
  };

  const restoreNote = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, trashed: false } : n));
  };

  const deleteForever = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const emptyTrash = () => {
    if (window.confirm('Empty trash? All items in Trash will be permanently deleted.')) {
      setNotes(notes.filter(n => !n.trashed));
    }
  };

  const archiveNote = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, archived: !n.archived, pinned: false } : n));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const addLabel = (name: string) => {
    const newLabel: Label = { id: Date.now().toString(), name };
    setLabels([...labels, newLabel]);
  };

  const updateLabel = (id: string, name: string) => {
    setLabels(labels.map(l => l.id === id ? { ...l, name } : l));
  };

  const deleteLabel = (id: string) => {
    setLabels(labels.filter(l => l.id !== id));
    // Also remove this label from all notes
    setNotes(notes.map(n => ({
      ...n,
      labels: n.labels?.filter(lId => lId !== id)
    })));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const filteredNotes = notes.filter(n => {
    if (activeView === 'archive') return n.archived && !n.trashed;
    if (activeView === 'trash') return n.trashed;
    if (activeView === 'reminders') return !!n.reminder && !n.trashed;
    // Default 'notes' view: not archived and not trashed
    if (n.archived || n.trashed) return false;

    if (selectedLabelId) {
      return n.labels?.includes(selectedLabelId);
    }
    return true;
  });

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <MainLayout
      sidebar={
        <Sidebar
          isOpen={true}
          labels={labels}
          selectedLabelId={selectedLabelId}
          onLabelClick={(id) => { setSelectedLabelId(id); if (id) setActiveView('notes'); }}
          onEditLabels={() => setIsEditLabelsModalOpen(true)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      }
    >
      {activeView === 'notes' && !selectedLabelId && (
        <CreateNoteInput
          onCreateNote={addNote}
          labels={labels}
          onAddLabel={addLabel}
        />
      )}

      {activeView === 'archive' && <div style={{ padding: '0 16px', maxWidth: '1200px', margin: '0 auto 16px', fontSize: '12px', fontWeight: 500, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>Archive</div>}

      {activeView === 'trash' && (
        <div className="trash-header" style={{
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontStyle: 'italic',
          color: 'var(--color-text-secondary)',
          marginBottom: '16px'
        }}>
          <span>Notes in Trash are deleted after certain days.</span>
          <button
            onClick={emptyTrash}
            style={{
              marginLeft: '15px',
              background: 'transparent',
              border: 'none',
              color: '#4285f4',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Empty Trash
          </button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {pinnedNotes.length > 0 && (
          <>
            <div style={{ padding: '0 16px', maxWidth: '1200px', margin: '0 auto 8px', fontSize: '12px', fontWeight: 500, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>Pinned</div>
            <MasonryGrid>
              <SortableContext items={pinnedNotes} strategy={rectSortingStrategy}>
                {pinnedNotes.map(note => (
                  <SortableNote
                    key={note.id}
                    note={note}
                    onPin={togglePin}
                    onArchive={archiveNote}
                    onDelete={deleteNote} // This is soft delete
                    onRestore={restoreNote}
                    onDeleteForever={deleteForever}
                    onClick={setSelectedNote}
                    labels={labels}
                  />
                ))}
              </SortableContext>
            </MasonryGrid>
            <div style={{ padding: '0 16px', maxWidth: '1200px', margin: '16px auto 8px', fontSize: '12px', fontWeight: 500, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase' }}>Others</div>
          </>
        )}

        <MasonryGrid>
          <SortableContext items={otherNotes} strategy={rectSortingStrategy}>
            {otherNotes.map(note => (
              <SortableNote
                key={note.id}
                note={note}
                onPin={togglePin}
                onArchive={archiveNote}
                onDelete={deleteNote}
                onRestore={restoreNote}
                onDeleteForever={deleteForever}
                onClick={setSelectedNote}
                labels={labels}
              />
            ))}
          </SortableContext>
        </MasonryGrid>
      </DndContext>

      {
        selectedNote && (
          <EditNoteModal
            note={selectedNote}
            isOpen={!!selectedNote}
            onClose={() => setSelectedNote(null)}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onRestore={restoreNote}
            onDeleteForever={deleteForever}
            onArchive={archiveNote}
            labels={labels}
            onAddLabel={addLabel}
          />
        )
      }

      <EditLabelsModal
        isOpen={isEditLabelsModalOpen}
        onClose={() => setIsEditLabelsModalOpen(false)}
        labels={labels}
        onAddLabel={addLabel}
        onUpdateLabel={updateLabel}
        onDeleteLabel={deleteLabel}
      />
    </MainLayout >
  );
}

export default App;
