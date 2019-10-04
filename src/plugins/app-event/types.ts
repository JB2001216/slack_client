import * as api from '@/lib/api';
import VueFlashMessage from 'vue-flash-message';

export interface AppEventMap {
  'flash': { message: string; name: VueFlashMessage.MessageType; options?: VueFlashMessage.MessageOptions };
  'error': { err: any; flash?: boolean; options?: { firstMessageOnValidationError?: boolean } };
  'my-user-edited': { myUser: api.MyUser };
  'space-user-edited': { spaceUser: api.SpaceUser };
  'task-added': { task: api.Task };
  'task-edited': { task: api.Task };
  'task-deleted': { taskId: number };
  'note-added': { note: api.Note };
  'note-edited': { note: api.Note };
  'note-deleted': { noteId: number };
}

export interface AppEventBus {
  on<K extends keyof AppEventMap>(type: K, callback: (ev: AppEventMap[K]) => any): void;
  off<K extends keyof AppEventMap>(type: K, callback: (ev: AppEventMap[K]) => any): void;
  emit<K extends keyof AppEventMap>(type: K, ev: AppEventMap[K]): void;
}
