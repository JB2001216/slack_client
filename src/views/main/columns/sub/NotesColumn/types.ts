import { Note } from '@/lib/api';

export interface NoteWithChilds extends Note {
  childs?: NoteWithChilds[];
}

export type DropItemPosition = 'before' | 'after' | 'child';

export interface DragNoteData {
  note: NoteWithChilds;
  noteParent: NoteWithChilds | null;
}

export interface DropNoteData {
  note: NoteWithChilds;
  noteParent: NoteWithChilds | null;
  position: DropItemPosition;
}

export interface DropNoteEvent {
  dragData: DragNoteData;
  dropData: DropNoteData;
}

export interface FilterFormValue {
  status?: number[];
  chargeUsers?: number[];
  batonUser?: number[];
}
