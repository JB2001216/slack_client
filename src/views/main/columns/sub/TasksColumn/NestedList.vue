<template>
  <div class="nestedList">
    <div
      v-for="(t,i) in tasks"
      :key="t.id"
      class="task_itemContaner"
      :class="{
        dragging: dragData,
        dragCurrent: dragData && dragData.task === t,
      }"
      :draggable="allTaskUpdatable"
      @dragstart.stop="onItemDragStart($event, t)"
      @dragend.stop.prevent="onItemDragEnd($event, t)"
    >
      <div
        v-if="dragData && t !== dragData.task && (i<=0 || (i>0 && tasks[i-1] !== dragData.task))"
        class="task_item_top"
        :class="{
          dropHover: dropHover && dropHover.position === 'before' && dropHover.task === t,
          between: itemDroppableBetween,
        }"
        @dragenter.stop.prevent="onItemDragEnterTop($event, t)"
        @dragleave.stop.prevent="onItemDragLeaveTop($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDropTop($event, t)"
      >
        <div class="task_item_top_line" />
      </div>
      <div
        v-if="dragData && t !== dragData.task && i === tasks.length - 1"
        class="task_item_bottom"
        :class="{
          dropHover: dropHover && dropHover.position === 'after' && dropHover.task === t,
          between: itemDroppableBetween,
        }"
        @dragenter.stop.prevent="onItemDragEnterBottom($event, t)"
        @dragleave.stop.prevent="onItemDragLeaveBottom($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDropBottom($event, t)"
      >
        <div class="task_item_bottom_line" />
      </div>
      <div
        class="task_item"
        :class="{dropHover: dropHover && dropHover.position === 'child' && dropHover.task === t}"
        @click.stop="onItemClick($event, t)"
        @dragenter.stop.prevent="onItemDragEnter($event, t)"
        @dragleave.stop.prevent="onItemDragLeave($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDrop($event, t)"
      >
        <template v-if="t.hasChilds">
          <span v-if="t.childs && t.childs.length" @click.stop="onContractChilds(t)">▼</span>
          <span v-else @click.stop="onExpandChilds(t)">＞</span>
        </template>
        <div class="task_item_image">
          <img src="@/assets/images/user/user_1.png" alt="">
        </div>
        <template v-if="!editingTask || editingTask.id !== t.id">
          <div class="task_item_name" @dblclick="onInlineTaskEditStart(t)">{{t.subject}}</div>
          <a v-if="taskAddable" class="task_item_add" href="#" @click.stop.prevent="onInlineTaskAddStart(t)" />
          <my-date-range-input
            :value="t.limitedAt ? {start: t.startedAt, end: t.limitedAt} : null"
            :disabled="!getTaskUpdatable(t)"
            @input="onDateRangeChange(t, $event)"
            class="task_item_date" />
          <my-project-status class="task_item_status" :option="getStatusOption(t.status)" />
        </template>
        <template v-else>
          <input
            ref="editingTaskSubjectInputs"
            class="task_edit_input"
            type="text"
            v-model="editingTaskSubject"
            @keydown.esc="editingTask = null"
            @blur="onInlineTaskEditEnd()"
            @change="$event.target.blur()">
        </template>
      </div>
      <div v-if="taskAddable && addingParentTask && addingParentTask.id === t.id" class="nestedList_add_item">
        <input
          ref="addingTaskSubjectInputs"
          type="text"
          v-model="addingTaskSubject"
          @keydown.esc="addingParentTask = null"
          @blur="onInlineTaskAddEnd()"
          @change="$event.target.blur()">
      </div>
      <nested-list
        v-if="t.hasChilds && t.childs && t.childs.length"
        :parent-task="t"
        :tasks="t.childs"
        :status-options="statusOptions"
        :fetch-tasks="fetchTasks"
        :item-draggable="itemDraggable"
        :item-droppable-between="itemDroppableBetween"
        :drag-data="dragData"
        @drag-data-change="emitDragDataChange($event)"
        :drop-hover="dropHover"
        @drop-hover-change="emitDropHoverChange($event)"
        @drop-task="emitDropTask($event)"
        @item-click="onItemClick"
      />
    </div>
  </div>
</template>


<style lang="stylus">
.nestedList
  .task_itemContaner
    position: relative
    &.dragging
      .task_item,
      .task_item_top,
      .task_item_bottom
        *
          pointer-events: none
    &.dragCurrent
      .task_item
        background: rgba(0,0,0,0.1)
        opacity: 0.3
  .task_item
    cursor: pointer
    padding-left: 5px
    background: transparent
    .task_item_date.disabled
      display: none
    &:not(:hover)
      .task_item_date
        .myDateRangeInput_view_icon
          opacity: 0
    .task_edit_input
      padding: 5px
      width: calc(100% - 30px)
      box-sizing: border-box
    &.dropHover
      background: rgba(125,200,255,0.5)

  .task_item_top,
  .task_item_bottom
    position: absolute
    z-index: 1
    left: 0
    right: 0
    height: 20px
    &_line
      height: 4px
      width: 100%
    &.dropHover.between
      .task_item_top_line,
      .task_item_bottom_line
        background: rgba(125,200,255,0.5)
  .task_item_top
    top: -7px
    &_line
      margin-top: 5px
  .task_item_bottom
    bottom: -7px
    &_line
      margin-top: 10px

  &_add_item
    padding: 4px 0 4px 20px;
    input
      width: 100%
      padding: 5px
      width: calc(100% - 30px)
      box-sizing: border-box
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  MyUser, Project, Task, TaskStatus, TasksApi, apiRegistry,
  TasksGetResponse, TasksPostRequestBody, TasksTaskIdPatchRequestBody,
} from '@/lib/api';
import { TaskWithChilds, DragTaskData, DropTaskData, DropTaskEvent } from './types';
import { ProjectStatusCategory } from '@/consts';
import { Perm } from '@/lib/permissions';

@Component({
  name: 'nested-list',
})
export default class NestedList extends Vue {
  $refs!: {
    addingTaskSubjectInputs: HTMLInputElement[];
    editingTaskSubjectInputs: HTMLInputElement[];
  };

  @Prop({ default: null })
  parentTask!: TaskWithChilds | null;

  @Prop({ required: true })
  tasks!: TaskWithChilds[];

  @Prop({ required: true })
  statusOptions!: TaskStatus[];

  @Prop({ required: true })
  fetchTasks!: (options: { parent?: number; limit?: number; page?: number }) => Promise<TasksGetResponse>;

  @Prop({ type: Boolean, default: false })
  itemDraggable!: boolean;

  @Prop({ type: Boolean, default: false })
  itemDroppableBetween!: boolean;

  @Prop({ default: null })
  dragData: DragTaskData | null = null;

  @Prop({ default: null })
  dropHover: DropTaskData | null = null;

  saving = false;
  addingParentTask: TaskWithChilds | null = null;
  addingTaskSubject = '';
  editingTask: TaskWithChilds | null = null;
  editingTaskSubject = '';

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }
  get myPerms() {
    return this.$store.getters.activeUser.activeProjectMyPerms!;
  }

  get taskAddable() {
    return this.myPerms.includes(Perm.ADD_TASK);
  }
  get allTaskUpdatable() {
    return this.myPerms.includes(Perm.UPDATE_ALL_TASK);
  }
  getTaskUpdatable(task: Task) {
    return this.myPerms.includes(Perm.UPDATE_ALL_TASK) ||
      (task.writeUser === this.myUser.id && this.myPerms.includes(Perm.UPDATE_MY_TASK));
  }

  getStatusOption(optionId: number | null) {
    if (!optionId || !this.statusOptions) {
      return null;
    }
    return this.statusOptions.find((o) => o.id === optionId) || null;
  }

  async addTask(requestBody: TasksPostRequestBody) {
    const loginUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, loginUser.token);
    return tasksApi.tasksPost({
      spaceId: loginUser.space.id,
      projectId,
      tasksPostRequestBody: requestBody,
    });
  }

  async patchTask(taskId: number, requestBody: TasksTaskIdPatchRequestBody) {
    const loginUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, loginUser.token);
    return tasksApi.tasksTaskIdPatch({
      spaceId: loginUser.space.id,
      projectId,
      taskId,
      tasksTaskIdPatchRequestBody: requestBody,
    });
  }

  async onInlineTaskAddStart(parent: Task) {
    if (this.addingParentTask || this.saving) return;
    this.addingParentTask = parent;
    this.addingTaskSubject = '';
    await this.$nextTick();
    this.$refs.addingTaskSubjectInputs[0].focus();
  }

  async onInlineTaskAddEnd() {
    if (!this.addingParentTask || this.saving) return;
    if (this.addingTaskSubject.trim() !== '') {
      try {
        this.saving = true;
        const statusOptions = this.statusOptions!
          .filter((o) => o.category === ProjectStatusCategory.Progress)
          .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
        const addedTask = await this.addTask({
          parent: this.addingParentTask.id,
          subject: this.addingTaskSubject.trim(),
          status: statusOptions[0].id,
          tags: [],
          chargeUsers: [],
        });
        this.$appEmit('task-added', { task: addedTask });
        if (!this.addingParentTask.childs || !this.addingParentTask.childs.length) {
          await this.onExpandChilds(this.addingParentTask);
        }

      } catch (err) {
        this.$appEmit('error', { err });
        return;
      } finally {
        this.saving = false;
      }
    }

    this.addingParentTask = null;
  }

  async onInlineTaskEditStart(task: Task) {
    if (!this.getTaskUpdatable(task) || this.editingTask || this.saving) return;
    this.editingTask = task;
    this.editingTaskSubject = task.subject;
    await this.$nextTick();
    this.$refs.editingTaskSubjectInputs[0].focus();
  }

  async onInlineTaskEditEnd() {
    if (!this.editingTask || this.saving) return;
    if (this.editingTaskSubject.trim() !== '') {
      try {
        this.saving = true;
        const updatedTask = await this.patchTask(this.editingTask.id, {
          subject: this.editingTaskSubject.trim(),
        });
        this.$appEmit('task-edited', { task: updatedTask });
      } catch (err) {
        this.$appEmit('error', { err });
        return;
      } finally {
        this.saving = false;
      }
    }
    this.editingTask = null;
  }

  async onDateRangeChange(task: Task, range: {start: Date; end: Date} | null) {
    if (this.saving) {
      return;
    }
    try {
      this.saving = true;
      const updatedTask = await this.patchTask(task.id, {
        startedAt: range ? range.start : (null as any),
        limitedAt: range ? range.end : (null as any),
      });
      this.$appEmit('task-edited', { task: updatedTask });
    } catch (err) {
      this.$appEmit('error', { err });
    }
    this.saving = false;
  }

  async onExpandChilds(task: TaskWithChilds) {
    try {
      const res = await this.fetchTasks({ parent: task.id, limit: 500 });
      if (res.count <= 0) {
        task.hasChilds = false;
        return;
      } else if (!task.hasChilds) {
        task.hasChilds = true;
      }
      this.$set(task, 'childs', res.results);
    } catch (err) {
      this.$appEmit('error', { err });
    }
  }

  async onContractChilds(task: TaskWithChilds) {
    this.$delete(task, 'childs');
  }

  onItemClick(ev: MouseEvent, task: TaskWithChilds) {
    this.$emit('item-click', ev, task);
  }

  emitDragDataChange(value: this['dragData']) {
    this.$emit('drag-data-change', value);
  }

  emitDropHoverChange(value: this['dropHover']) {
    this.$emit('drop-hover-change', value);
  }

  emitDropTask(value: DropTaskEvent) {
    this.$emit('drop-task', value);
  }

  onItemDragStart(ev: DragEvent, task: TaskWithChilds) {
    ev.dataTransfer!.effectAllowed = 'move';
    this.emitDragDataChange({
      task,
      taskParent: this.parentTask,
    });
    this.emitDropHoverChange(null);
  }

  onItemDragEnter(ev: DragEvent, task: TaskWithChilds) {
    this.emitDropHoverChange(this.dragData!.task === task ? null : {
      task,
      taskParent: this.parentTask,
      position: 'child',
    });
  }

  onItemDragLeave(ev: DragEvent, task: TaskWithChilds) {
    if (this.dropHover && this.dropHover.position === 'child' && this.dropHover.task === task) {
      this.emitDropHoverChange(null);
    }
  }

  onItemDragEnd(ev: DragEvent, task: TaskWithChilds) {
    this.emitDragDataChange(null);
    this.emitDropHoverChange(null);
  }

  onItemDrop(ev: DragEvent, task: TaskWithChilds) {
    this.emitDropTask({
      dragData: this.dragData!,
      dropData: {
        task,
        taskParent: this.parentTask,
        position: 'child',
      },
    });
  }

  onItemDragEnterTop(ev: DragEvent, task: TaskWithChilds) {
    this.emitDropHoverChange(this.dragData!.task === task ? null : {
      task,
      taskParent: this.parentTask,
      position: 'before',
    });
  }

  onItemDragLeaveTop(ev: DragEvent, task: TaskWithChilds) {
    if (this.dropHover && this.dropHover.position === 'before' && this.dropHover.task === task) {
      this.emitDropHoverChange(null);
    }
  }

  onItemDropTop(ev: DragEvent, task: TaskWithChilds) {
    this.emitDropTask({
      dragData: this.dragData!,
      dropData: {
        task,
        taskParent: this.parentTask,
        position: 'before',
      },
    });
  }

  onItemDragEnterBottom(ev: DragEvent, task: TaskWithChilds) {
    this.emitDropHoverChange(this.dragData!.task === task ? null : {
      task,
      taskParent: this.parentTask,
      position: 'after',
    });
  }

  onItemDragLeaveBottom(ev: DragEvent, task: TaskWithChilds) {
    if (this.dropHover && this.dropHover.position === 'after' && this.dropHover.task === task) {
      this.emitDropHoverChange(null);
    }
  }

  onItemDropBottom(ev: DragEvent, task: TaskWithChilds) {
    this.emitDropTask({
      dragData: this.dragData!,
      dropData: {
        task,
        taskParent: this.parentTask,
        position: 'after',
      },
    });
  }

  onTaskAdded(ev: { task: Task }) {
    if (!ev.task.parent) return;

    const parentTask = this.tasks.find((t) => t.id === ev.task.parent);
    if (!parentTask || !parentTask.childs || !parentTask.childs) return;

    if (!parentTask.childs.find((t) => t.id === ev.task.id)) {
      parentTask.childs.unshift(ev.task);
    }
  }

  onTaskEdited(ev: { task: Task }) {
    if (!ev.task.parent) return;

    const parentTask = this.tasks.find((t) => t.id === ev.task.parent);
    if (!parentTask || !parentTask.childs || !parentTask.childs) return;

    const index = parentTask.childs.findIndex((t) => t.id === ev.task.id);
    if (index >= 0) {
      parentTask.childs.splice(index, 1, ev.task);
    }
  }

  onTaskDeleted(ev: { taskId: number }) {
    this.tasks.forEach((parent) => {
      if (parent.childs) {
        const index = parent.childs.findIndex((t) => t.id === ev.taskId);
        if (index >= 0) {
          parent.childs.splice(index, 1);
          if (!parent.childs.length) {
            this.$delete(parent, 'childs');
            parent.hasChilds = false;
          }
        }
      }
    });
  }

  beforeMount() {
    this.$appOn('task-added', this.onTaskAdded);
    this.$appOn('task-edited', this.onTaskEdited);
    this.$appOn('task-deleted', this.onTaskDeleted);
  }

  beforeDestroy() {
    this.$appOff('task-added', this.onTaskAdded);
    this.$appOff('task-edited', this.onTaskEdited);
    this.$appOff('task-deleted', this.onTaskDeleted);
  }
}
</script>
