import * as api from '@/lib/api';

export interface AppEventMap {
  'task-added': { task: api.Task };
  'task-edited': { task: api.Task };
  'task-deleted': { taskId: number };
}

export interface AppEventBus {
  on<K extends keyof AppEventMap>(type: K, callback: (ev: AppEventMap[K]) => any): void;
  off<K extends keyof AppEventMap>(type: K, callback: (ev: AppEventMap[K]) => any): void;
  emit<K extends keyof AppEventMap>(type: K, ev: AppEventMap[K]): void;
}
