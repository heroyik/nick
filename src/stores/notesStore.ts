import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Label {
  id: string;
  name: string;
  color?: string;
}

export interface NoteItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  items?: NoteItem[];
  color: string;
  labels: Label[];
  type: 'text' | 'list';
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  image?: string;
  reminder?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotesStore {
  notes: Note[];
  labels: Label[];
  currentView: 'notes' | 'reminders' | 'archive' | 'trash';
  editingNoteId: string | null;

  // Note operations
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  deleteNoteForever: (id: string) => void;
  emptyTrash: () => void;
  togglePin: (id: string) => void;
  archiveNote: (id: string) => void;
  moveToTrash: (id: string) => void;

  // Label operations
  addLabel: (name: string, color?: string) => void;
  updateLabel: (id: string, name: string, color?: string) => void;
  deleteLabel: (id: string) => void;

  // View operations
  setCurrentView: (view: 'notes' | 'reminders' | 'archive' | 'trash') => void;
  setEditingNoteId: (id: string | null) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: [],
      labels: [],
      currentView: 'notes',
      editingNoteId: null,

      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              ...note,
              id: `note-${Date.now()}`,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            ...state.notes,
          ],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, trashed: true } : note
          ),
        })),

      restoreNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, trashed: false } : note
          ),
        })),

      deleteNoteForever: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),

      emptyTrash: () =>
        set((state) => ({
          notes: state.notes.filter((note) => !note.trashed),
        })),

      togglePin: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
          ),
        })),

      archiveNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, archived: !note.archived } : note
          ),
        })),

      moveToTrash: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, trashed: true } : note
          ),
        })),

      addLabel: (name, color) =>
        set((state) => ({
          labels: [
            ...state.labels,
            {
              id: `label-${Date.now()}`,
              name,
              color: color || '#FFC300',
            },
          ],
        })),

      updateLabel: (id, name, color) =>
        set((state) => ({
          labels: state.labels.map((label) =>
            label.id === id ? { ...label, name, color } : label
          ),
        })),

      deleteLabel: (id) =>
        set((state) => ({
          labels: state.labels.filter((label) => label.id !== id),
          notes: state.notes.map((note) => ({
            ...note,
            labels: note.labels.filter((l) => l.id !== id),
          })),
        })),

      setCurrentView: (view) => set({ currentView: view }),
      setEditingNoteId: (id) => set({ editingNoteId: id }),
    }),
    {
      name: 'notes-storage',
      version: 1,
    }
  )
);
