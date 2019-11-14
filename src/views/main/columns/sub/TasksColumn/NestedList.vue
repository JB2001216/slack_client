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
        :class="{
          active: t.id === activeTaskId,
          dropHover: dropHover && dropHover.position === 'child' && dropHover.task === t,
        }"
        @click.stop="onItemClick($event, t)"
        @dragenter.stop.prevent="onItemDragEnter($event, t)"
        @dragleave.stop.prevent="onItemDragLeave($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDrop($event, t)"
      >
        <div class="task_item_accordionIcon">
          <template v-if="t.hasChilds">
            <img v-if="t.childs && t.childs.length" src="~@/assets/images/icn/accordion-expand.svg" @click.stop="onContractChilds(t)">
            <img v-else src="~@/assets/images/icn/accordion-collapse.svg" @click.stop="onExpandChilds(t)">
          </template>
        </div>
        <my-space-user v-slot="{user}" tag="div" class="task_item_image" :user-id="t.batonUser">
          <my-space-user-avatar :user="user" :size="24" shape="circle" />
        </my-space-user>
        <template v-if="!editingTask || editingTask.id !== t.id">
          <div class="task_item_name" @dblclick="onInlineTaskEditStart(t)">
            {{ t.subject }}
          </div>
          <a v-if="taskAddable" class="task_item_add" href="#" @click.stop.prevent="onInlineTaskAddStart(t)">
            <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 13h-19.99999v-2h19.99999z" /><path d="m11 22v-20.00003h2v20.00003z" /></svg>
          </a>
          <my-date-range-input
            :value="t.limitedAt ? {start: t.startedAt, end: t.limitedAt} : null"
            :disabled="!getTaskUpdatable(t)"
            class="task_item_date"
            @input="onDateRangeChange(t, $event)"
          />
          <my-project-status :option="getStatusOption(t.status)" />
        </template>
        <template v-else>
          <input
            ref="editingTaskSubjectInputs"
            v-model="editingTaskSubject"
            class="task_edit_input"
            type="text"
            @keydown.esc="editingTask = null"
            @blur="onInlineTaskEditEnd()"
            @change="$event.target.blur()"
          >
        </template>
      </div>
      <div v-if="taskAddable && addingParentTask && addingParentTask.id === t.id" class="nestedList_add_item">
        <input
          ref="addingTaskSubjectInputs"
          v-model="addingTaskSubject"
          type="text"
          @keydown.esc="addingParentTask = null"
          @blur="onInlineTaskAddEnd()"
          @change="$event.target.blur()"
        >
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
        :drop-hover="dropHover"
        :added-child-task="addedChildTask"
        @drag-data-change="emitDragDataChange($event)"
        @drop-hover-change="emitDropHoverChange($event)"
        @drop-task="emitDropTask($event)"
        @item-click="onItemClick"
      />
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../../stylus/_settings'

.nestedList
  .task_itemContaner
    position: relative
    padding-top: 1px
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
    padding-left: 4px
    background: transparent
    &_accordionIcon
      width: 10px
      text-align: center
      margin-left: 1px
      margin-right: 5px
    .task_item_date
      .myDateRangeInput_view_value
        font-size: 12px
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  MyUser, Project, Task, TaskStatus, TasksApi, apiRegistry,
  TasksGetResponse, TasksPostRequestBody, TasksTaskIdPatchRequestBody,
} from '@/lib/api';
import { TaskWithChilds, DragTaskData, DropTaskData, DropTaskEvent } from './types';
import { ProjectStatusCategory } from '@/consts';
import { Perm } from '@/lib/permissions';
import EventsSub from '@/events-subscription';

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

  @Prop({ default: null })
  addedChildTask!: Task | null;

  saving = false;
  addingParentTask: TaskWithChilds | null = null;
  addingTaskSubject = '';
  editingTask: TaskWithChilds | null = null;
  editingTaskSubject = '';

  isDebug: boolean = true;

  addedChildTaskId: number | null = null;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get activeProjectId() {
    return this.$store.getters.activeUser.activeProjectId!;
  }

  get api() {
    return apiRegistry.load(TasksApi, this.myUser.token);
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

  get activeTaskId() {
    if (this.$route.name === 'task') {
      return parseInt(this.$route.params.taskId);
    }
    return null;
  }

  created(): void {
    EventsSub.source.addEventListener('updateTask', this.updateTask);
    EventsSub.source.addEventListener('deleteTask', this.deleteTask);
  }

  @Watch('addedChildTask')
  onAddChildTask(task: this['addedChildTask']): void {

    if (!task) { return; }

    const childTask = this.tasks.find((t) => t.parent === task.parent);
    if (childTask) { this.tasks.unshift(task!); }

    const parentTask = this.tasks.find((t) => t.id === task.parent);
    if (parentTask) {
      parentTask.hasChilds = true;
      if (task.id === this.activeTaskId) {
        this.onExpandChilds(parentTask);
      }
    }

  }

  updateTask(e: any): void {

    const data = JSON.parse(e.data);
    const index = this.tasks.findIndex((t) => t.id === data.params.taskId);

    if (index >= 0) {

      this.getTask(data)
        .then((task: Task) => {

          this.tasks[index] = Object.assign(this.tasks[index], task);

          if (this.isDebug) { console.log('updateTask(column): ' + task.subject); }

        }).catch((err) => {
          this.$appEmit('error', { err });
        });

    }

  }

  async deleteTask(e: any): Promise<void> {

    const data = JSON.parse(e.data);
    const index = this.tasks.findIndex((t) => t.id === data.params.taskId);

    if (index >= 0) {

      const isFireUser = data.userId === this.myUser.id;
      const task = this.tasks[index];
      const isActiveTask = task.id === this.activeTaskId;
      let isActiveTree = false;

      if (!isFireUser && !isActiveTask && (this.activeTaskId || this.activeTaskId === 0)) {
        await this.getTask({
          spaceId: this.myUser.space.id,
          params: { projectId: this.activeProjectId, taskId: this.activeTaskId },
        }).catch((err) => {
          if (err.status === 404) { isActiveTree = true; }
        });
      }

      this.tasks.splice(index, 1);

      if (this.isDebug) { console.log('deleteTask: ' + task.subject); }

      if (!this.tasks.length && this.parentTask) { this.parentTask.hasChilds = false; }

      if (isFireUser || isActiveTask || isActiveTree) {

        if (this.tasks.length || this.parentTask) {

          const taskId: number = this.tasks.length ? this.tasks[index ? (index - 1) : 0].id : this.parentTask!.id;

          this.$router.push({
            name: 'task',
            params: { projectId: this.activeProjectId + '', userId: this.myUser.id + '', taskId: taskId + '' },
          });

        } else {
          this.$router.push({
            name: 'project',
            params: { projectId: this.activeProjectId + '', userId: this.myUser.id + '' },
          });
        }

      }

      if (isFireUser) {
        this.$flash(this.$t('notifications.task.deleted', { taskName: task.subject }).toString(), 'success');
      } else if (isActiveTask || isActiveTree) {
        this.$flash(this.$t('notifications.task.noLongerAvailable', { taskName: task.subject }).toString(), 'success');
      }

    }

  }

  getTask(data: any): Promise<Task> {
    return this.api.tasksTaskIdGet({
      spaceId: data.spaceId,
      projectId: data.params.projectId,
      taskId: data.params.taskId,
    });
  }

  getTaskUpdatable(task: Task): boolean {
    return this.$store.getters.activeUser.taskUpdatable(task);
  }

  getStatusOption(optionId: number | null): TaskStatus | null {
    if (!optionId || !this.statusOptions) {
      return null;
    }
    return this.statusOptions.find((o) => o.id === optionId) || null;
  }

  patchTask(taskId: number, requestBody: TasksTaskIdPatchRequestBody): Promise<Task> {
    return this.api.tasksTaskIdPatch({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId,
      taskId,
      tasksTaskIdPatchRequestBody: requestBody,
    });
  }

  async onInlineTaskAddStart(parent: Task): Promise<void> {
    if (this.addingParentTask || this.saving) return;
    this.addingParentTask = parent;
    this.addingTaskSubject = '';
    await this.$nextTick();
    this.$refs.addingTaskSubjectInputs[0].focus();
  }

  onInlineTaskAddEnd(): void {

    if (!this.addingParentTask || this.saving) return;

    if (this.addingTaskSubject.trim() !== '') {

      this.saving = true;

      const statusOptions = this.statusOptions!
        .filter((o) => o.category === ProjectStatusCategory.Progress)
        .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);

      this.api.tasksPost({
        spaceId: this.myUser.space.id,
        projectId: this.activeProjectId,
        tasksPostRequestBody: {
          parent: this.addingParentTask.id,
          subject: this.addingTaskSubject.trim(),
          status: statusOptions[0].id,
          tags: [],
          chargeUsers: [],
        },
      }).catch((err) => {
        this.$appEmit('error', { err });
      }).finally(() => {
        this.saving = false;
      });

    }

    this.addingParentTask = null;

  }

  async onInlineTaskEditStart(task: Task): Promise<void> {
    if (!this.getTaskUpdatable(task) || this.editingTask || this.saving) return;
    this.editingTask = task;
    this.editingTaskSubject = task.subject;
    await this.$nextTick();
    this.$refs.editingTaskSubjectInputs[0].focus();
  }

  onInlineTaskEditEnd(): void {

    if (!this.editingTask || this.saving) return;

    if (this.editingTaskSubject.trim() !== '') {

      this.saving = true;

      this.patchTask(this.editingTask.id, {
        subject: this.editingTaskSubject.trim(),
      }).catch((err) => {
        this.$appEmit('error', { err });
      }).finally(() => {
        this.saving = false;
      });

    }

    this.editingTask = null;

  }

  onDateRangeChange(task: Task, range: {start: Date; end: Date} | null): void {

    if (this.saving) return;

    this.saving = true;

    this.patchTask(task.id, {
      startedAt: range ? range.start : (null as any),
      limitedAt: range ? range.end : (null as any),
    }).catch((err) => {
      this.$appEmit('error', { err });
    }).finally(() => {
      this.saving = false;
    });

  }

  async onExpandChilds(task: TaskWithChilds): Promise<void> {
    try {
      const res = await this.fetchTasks({ parent: task.id, limit: 500 });
      if (res.count <= 0) {
        task.hasChilds = false;
      } else if (!task.hasChilds) {
        task.hasChilds = true;
      }
      this.$set(task, 'childs', res.results);
    } catch (err) {
      this.$appEmit('error', { err });
    }
  }

  async onContractChilds(task: TaskWithChilds): Promise<void> {
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

  destroyed() {
    EventsSub.source.removeEventListener('updateTask', this.updateTask);
    EventsSub.source.removeEventListener('deleteTask', this.deleteTask);
  }

}
</script>
