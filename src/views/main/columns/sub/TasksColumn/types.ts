import { Task } from '@/lib/api';

export interface TaskWithChilds extends Task {
  childs?: TaskWithChilds[];
}

export type DropItemPosition = 'before' | 'after' | 'child';

export interface DropItemHover {
  task: TaskWithChilds;
  position: DropItemPosition;
}

export interface DropTaskEvent {
  dragTask: TaskWithChilds;
  dropTask: TaskWithChilds;
  position: DropItemPosition;
}
