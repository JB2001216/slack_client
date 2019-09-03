import { Task } from '@/lib/api';

export interface TaskWithChilds extends Task {
  childs?: TaskWithChilds[];
}

export type DropItemPosition = 'before' | 'after' | 'child';

export interface DragTaskData {
  task: TaskWithChilds;
  taskParent: TaskWithChilds | null;
}

export interface DropTaskData {
  task: TaskWithChilds;
  taskParent: TaskWithChilds | null;
  position: DropItemPosition;
}

export interface DropTaskEvent {
  dragData: DragTaskData;
  dropData: DropTaskData;
}
