<template>
  <div class="nestedList" :list="tasks" :group="{ name: 'nestedList' }">
    <div class="task_itemContaner" v-for="t in tasks" :key="t.id" @click.stop="onItemClick($event, t)">
      <div class="task_item">
        <template v-if="t.hasChilds">
          <span v-if="childs[t.id]" @click.stop="onContractChilds(t)">▼</span>
          <span v-else @click.stop="onExpandChilds(t)">＞</span>
        </template>
        <div class="task_item_image">
          <img src="@/assets/images/user/user_1.png" alt="">
        </div>
        <template v-if="!editingTask || editingTask.id !== t.id">
          <div class="task_item_name" @dblclick="onInlineTaskEditStart(t)">{{t.subject}}</div>
          <a class="task_item_add" href="#" @click.stop.prevent="onInlineTaskAddStart(t)" />
          <my-date-range-input
            :value="t.limitedAt ? {start: t.startedAt, end: t.limitedAt} : null"
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
      <div v-if="addingParentTask && addingParentTask.id === t.id" class="nestedList_add_item">
        <input
          ref="addingTaskSubjectInputs"
          type="text"
          v-model="addingTaskSubject"
          @keydown.esc="addingParentTask = null"
          @blur="onInlineTaskAddEnd()"
          @change="$event.target.blur()">
      </div>
      <nested-list
        v-if="t.hasChilds && childs[t.id]"
        :tasks="childs[t.id]"
        :status-options="statusOptions"
        :fetch-tasks="fetchTasks"
        @item-click="onNestedItemClick" />
    </div>
  </div>
</template>


<style lang="stylus">
.nestedList
  .task_item
    cursor: pointer
    padding-left: 5px
    &:not(:hover)
      .task_item_date
        .myDateRangeInput_view_icon
          opacity: 0
    .task_edit_input
      padding: 5px
      width: calc(100% - 30px)
      box-sizing: border-box
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
import { ProjectStatusCategory } from '@/consts';

@Component({
  name: 'nested-list',
})
export default class NestedList extends Vue {
  $refs!: {
    addingTaskSubjectInputs: HTMLInputElement[];
    editingTaskSubjectInputs: HTMLInputElement[];
  };

  @Prop({ required: true })
  tasks!: Task[];

  @Prop({ required: true })
  statusOptions!: TaskStatus[];

  @Prop({ required: true })
  fetchTasks!: (options: { parent?: number; limit?: number; page?: number }) => Promise<TasksGetResponse>;

  saving = false;
  addingParentTask: Task | null = null;
  addingTaskSubject = '';
  editingTask: Task | null = null;
  editingTaskSubject = '';
  childs: {[id: number]: Task[]} = {};

  getStatusOption(optionId: number | null) {
    if (!optionId || !this.statusOptions) {
      return null;
    }
    return this.statusOptions.find((o) => o.id === optionId) || null;
  }

  async addTask(requestBody: TasksPostRequestBody) {
    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectId = this.$store.state.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, loginUser.token);
    return tasksApi.tasksPost({
      spaceId: loginUser.space.id,
      projectId,
      tasksPostRequestBody: requestBody,
    });
  }

  async patchTask(taskId: number, requestBody: TasksTaskIdPatchRequestBody) {
    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectId = this.$store.state.activeUser.activeProjectId!;
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
        if (!this.childs[this.addingParentTask.id]) {
          await this.onExpandChilds(this.addingParentTask);
        }

      } catch (err) {
        this.$showAppError(this, err);
        return;
      } finally {
        this.saving = false;
      }
    }

    this.addingParentTask = null;
  }

  async onInlineTaskEditStart(task: Task) {
    if (this.editingTask || this.saving) return;
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
        this.$showAppError(this, err);
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
      this.$showAppError(this, err);
    }
    this.saving = false;
  }

  async onExpandChilds(task: Task) {
    try {
      const res = await this.fetchTasks({ parent: task.id, limit: 500 });
      if (res.count <= 0) {
        this.$appEmit('task-edited', { task: Object.assign(task, { hasChilds: false }) });
        return;
      } else if (!task.hasChilds) {
        this.$appEmit('task-edited', { task: Object.assign(task, { hasChilds: true }) });
      }
      this.$set(this.childs, task.id, res.results);
    } catch (err) {
      this.$showAppError(this, err);
    }
  }

  async onContractChilds(task: Task) {
    this.$delete(this.childs, task.id);
  }

  onItemClick(ev: MouseEvent, task: Task) {
    this.$emit('item-click', ev, task);
  }

  onNestedItemClick(ev: MouseEvent, task: Task) {
    this.$emit('item-click', ev, task);
  }

  onTaskAdded(ev: { task: Task }) {
    if (!ev.task.parent) return;

    const tasks = this.childs[ev.task.parent];
    if (!tasks) return;

    if (!tasks.find((t) => t.id === ev.task.id)) {
      tasks.unshift(ev.task);
    }
  }

  onTaskEdited(ev: { task: Task }) {
    if (!ev.task.parent) return;

    const tasks = this.childs[ev.task.parent];
    if (!tasks) return;

    const index = tasks.findIndex((t) => t.id === ev.task.id);
    if (index >= 0) {
      tasks.splice(index, 1, ev.task);
    }
  }

  onTaskDeleted(ev: { taskId: number }) {
    for (let [k, tasks] of Object.entries(this.childs)) {
      const index = tasks.findIndex((t) => t.id === ev.taskId);
      tasks.splice(index, 1);
      if (!tasks.length) {
        this.$delete(this.childs, k);
        const parentId = parseInt(k);
        const parent = this.tasks.find((t) => t.id === parentId);
        if (parent) {
          this.$appEmit('task-edited', { task: Object.assign(parent, { hasChilds: false }) });
        }
      }
    }
    if (this.childs[ev.taskId]) {
      this.$delete(this.childs, ev.taskId);
    }
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
