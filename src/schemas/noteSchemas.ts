import { z } from 'zod';

export const LabelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Label name cannot be empty').max(50),
  color: z.string().optional(),
});

export const NoteItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
});

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string().max(200, 'Title must be less than 200 characters'),
  content: z.string().max(10000, 'Content must be less than 10000 characters'),
  items: z.array(NoteItemSchema).optional(),
  color: z.string().default('#FFFFFF'),
  labels: z.array(LabelSchema).default([]),
  type: z.enum(['text', 'list']).default('text'),
  pinned: z.boolean().default(false),
  archived: z.boolean().default(false),
  trashed: z.boolean().default(false),
  image: z.string().optional(),
  reminder: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateNoteSchema = z.object({
  title: z.string().max(200, 'Title must be less than 200 characters').default(''),
  content: z.string().max(10000, 'Content must be less than 10000 characters').default(''),
  items: z.array(NoteItemSchema).optional(),
  color: z.string().default('#FFFFFF'),
  labels: z.array(LabelSchema).default([]),
  type: z.enum(['text', 'list']).default('text'),
  image: z.string().optional(),
  reminder: z.date().optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial().extend({
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
  trashed: z.boolean().optional(),
});

export type Label = z.infer<typeof LabelSchema>;
export type NoteItem = z.infer<typeof NoteItemSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
