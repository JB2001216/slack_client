<template>
  <sub-column-layout active-tab="task">
    <div class="tab_task">
      <div class="task_menu">
        <div class="task_menu_left">
          <a class="task_menu_favorite" href="#" :class="{active: isFavorite}" @click.prevent="favorite(!isFavorite)">
            <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 1.5 2.3574 7.25532h7.6287l-6.1718 4.48408 2.3574 7.2553-6.1717-4.4841-6.17175 4.4841 2.3574-7.2553-6.17174-4.48408h7.62869z" />
            </svg>
          </a>
        </div>
        <div class="task_menu_right">
          <a ref="filterButton" class="task_menu_search" :class="{active: activeFilter}" href="#" @click.prevent="showedFilter = !showedFilter">
            <span class="t-caption">{{$t('views.tasksColumn.filter')}}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m2.8442 3.00008c-.1103-.00153-.2198.0185-.32215.05893-.10236.04043-.19551.10045-.27406.17658-.07855.07612-.14092.16684-.18349.26686-.04258.10003-.0645.20738-.0645.31581s.02192.21578.0645.31581c.04257.10002.10494.19074.18349.26686.07855.07613.1717.13615.27406.17658.10235.04043.21185.06046.32215.05893h.66653l5.99223 7.36356h4.99404l5.9923-7.36356h.6665c.1103.00153.2198-.0185.3222-.05893.1023-.04043.1955-.10045.274-.17658.0786-.07612.1409-.16684.1835-.26686.0426-.10003.0645-.20738.0645-.31581s-.0219-.21578-.0645-.31581c-.0426-.10002-.1049-.19074-.1835-.26686-.0785-.07613-.1717-.13615-.274-.17658-.1024-.04043-.2119-.06046-.3222-.05893zm6.65876 10.63632v7.3636l4.99404-1.6364v-5.7272z" />
            </svg>
          </a>
          <my-simple-menu>
            <template v-slot="{open, close, opened}">
              <a class="task_menu_sort" href="#" @click.stop.prevent="opened ? close() : open()">
                <span class="t-caption">{{$t(`views.tasksColumn.ordering.${currentSort.i18nKey}`)}}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m12 20-8.66025-13.5h17.32055z" />
                </svg>
              </a>
            </template>
            <template v-slot:items>
              <li v-for="s in sorts" :key="`${s.field}_${s.type}`" @click="onCurrentSortChange(s)">
                <span >
                  <template v-if="s === currentSort">→</template>
                  {{$t(`views.tasksColumn.ordering.${s.i18nKey}`)}}
                </span>
              </li>
            </template>
          </my-simple-menu>
        </div>
      </div>
      <div class="task_list">
        <template v-if="taskAddable">
          <a v-if="!adding" class="task_add" @click.prevent="onInlineTaskAddStart()">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m22 13h-19.99999v-2h19.99999z" />
              <path d="m11 22v-20.00003h2v20.00003z" />
            </svg>
            {{$t('views.tasksColumn.addANewTask')}}
          </a>
          <div v-if="adding" class="task_add adding">
            <input
              ref="addingTaskSubjectInput"
              class="task_add_input"
              type="text"
              v-model="addingTaskSubject"
              @keydown.esc="adding = false"
              @blur="onInlineTaskAddEnd()"
              @change="$event.target.blur()">
          </div>
        </template>
        <div
          class="taskListContainer"
          :class="{dropHoverRoot: !currentSort.droppableBetween && dragData && dropHover && dropHover.position !== 'child'}"
          ref="taskListContainer"
        >
          <nested-list
            :tasks="tasks"
            :status-options="statusOptions"
            :fetch-tasks="fetchTasks"
            :item-droppable-between="currentSort.droppableBetween"
            :drag-data="dragData"
            @drag-data-change="dragData = $event"
            :drop-hover="dropHover"
            @drop-hover-change="dropHover = $event"
            @drop-task="onDropTask"
            @item-click="onTaskItemClick" />
          <infinite-loading :identifier="infiniteId" @infinite="onInfinite" />
        </div>
      </div>
      <transition name="slide-right">
        <filter-form v-if="showedFilter" ref="filterForm" :value="filter" @input="onFilterInput" :status-options="statusOptions" />
      </transition>
    </div>
  </sub-column-layout>
</template>


<style lang="stylus">
.tab_task
  .task_menu_search.active
    color: #2f80ed
    svg
      fill: #2f80ed
  .taskListContainer
    max-height: calc(100vh - 225px)
    overflow-y: scroll
    padding-top: 4px
    position: relative
    &.dropHoverRoot
      outline: solid 3px rgba(125,200,255,0.8)
      outline-offset: -3px
  a.task_add
    cursor: pointer
  .task_add.adding
    padding: 0 20px;
    .task_add_input
      margin: 7px 0
      padding: 5px
      width: 100%
      box-sizing: border-box
  .nestedList
    .nestedList
      padding-left: 20px
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import { StateChanger } from 'vue-infinite-loading';
import SubColumnLayout from '../SubColumnLayout.vue';
import FilterForm from './FilterForm.vue';
import NestedList from './NestedList.vue';
import { MyUser, Project, Task, TaskStatus, TasksApi, apiRegistry, TasksGetRequest, TasksTaskIdPriorityPostRequestBody } from '@/lib/api';
import { BasicError } from '@/lib/errors';
import { ProjectStatusCategory } from '@/consts';
import { toSnakeCase } from '@/lib/utils/string-util';
import { TaskWithChilds, DragTaskData, DropTaskData, DropTaskEvent, DropItemPosition, FilterFormValue } from './types';
import { Perm } from '@/lib/permissions';

type SearchScrollType = 'next' | 'prev';
type SearchOrderField = 'priority' | 'limitedAt' | 'status';
type SearchOrderType = 'asc' | 'desc';

interface TasksGetConditions {
  filter: Pick<TasksGetRequest, 'subject' | 'batonUser' | 'writeUser' | 'favorite'>;
  order: {
    field: SearchOrderField;
    type: SearchOrderType;
  };
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
]);
@Component({
  components: {
    SubColumnLayout,
    FilterForm,
    NestedList,
  },
})
export default class TasksColumn extends Vue {
  $refs!: {
    addingTaskSubjectInput: HTMLInputElement;
    taskListContainer: HTMLDivElement;
    filterForm: FilterForm;
    filterButton: HTMLAnchorElement;
  };

  sorts: {field: SearchOrderField; type: SearchOrderType; i18nKey: string; droppableBetween: boolean}[] = [
    { field: 'priority', type: 'desc', i18nKey: 'priorityOrder', droppableBetween: true },
    { field: 'limitedAt', type: 'asc', i18nKey: 'deadlineOrder', droppableBetween: false },
    { field: 'status', type: 'asc', i18nKey: 'statusOrder', droppableBetween: false },
  ];

  initialConditions: TasksGetConditions = {
    'filter': {},
    'order': {
      field: this.sorts[0].field,
      type: this.sorts[0].type,
    },
  };

  showedFilter = false;
  filter: FilterFormValue = {};

  conditions = Object.assign({}, this.initialConditions);

  tasks: TaskWithChilds[] = [];
  page = 1;
  limit = 30;
  infiniteId = +new Date();

  initialized = false;
  saving = false;
  adding = false;
  addingTaskSubject = '';

  dragData: DragTaskData | null = null;
  dropHover: DropTaskData | null = null;

  get isFavorite() {
    return this.conditions.filter &&
      this.conditions.filter.favorite;
  }

  get currentSort() {
    return this.sorts.find((s) => s.field === this.conditions.order.field && s.type === this.conditions.order.type)!;
  }

  get activeFilter() {
    return !!Object.keys(this.filter).length;
  }

  get taskAddable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.ADD_TASK);
  }

  get statusOptions() {
    console.log(this.$store.state.activeUser.taskStatusList);
    return this.$store.state.activeUser.taskStatusList;
  }

  async fetchTasks(options: { parent?: number; limit?: number; page?: number } = {}) {
    const cond = this.conditions;
    const user = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, user.token);
    const req: TasksGetRequest = Object.assign({
      spaceId: user.space.id,
      projectId: projectId,
      parent: options.parent ? options.parent! : undefined,
      root: options.parent ? undefined : true,
    }, cond.filter);
    req.ordering = [toSnakeCase(cond.order.field), 'id']
      .map((f) => cond.order.type === 'asc' ? f : `-${f}`)
      .join(',');
    if (options.limit) {
      req.limit = options.limit;
    }
    if (options.page) {
      req.page = options.page;
    }

    return tasksApi.tasksGet(req);
  }

  async onInfinite($state: StateChanger) {
    try {
      if (this.$refs.taskListContainer) {
        this.$refs.taskListContainer.scrollTop = 0;
      }

      const res = await this.fetchTasks({
        page: this.page,
        limit: this.limit,
      });
      const addTasks = res.results.filter((r) => !this.tasks.find((t) => t.id === r.id));
      if (addTasks.length) {
        this.tasks.push(...addTasks);
      }

      if (res.next) {
        this.page += 1;
        $state.loaded();
      } else {
        $state.complete();
      }

    } catch (err) {
      this.$appEmit('error', { err });
    }
  }

  changeCondition(cond: TasksGetConditions) {
    this.conditions = cond;
    this.page = 1;
    this.tasks = [];
    this.infiniteId += 1;
  }

  getTaskAddTo(): Location {
    return {
      name: 'task-add',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
      },
    };
  }

  getTaskTo(taskId: number): Location {
    return {
      name: 'task',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
        taskId: taskId.toString(),
      },
    };
  }

  async favorite(favorite: boolean) {
    this.changeCondition({
      filter: Object.assign({}, this.conditions.filter, { favorite }),
      order: this.conditions.order,
    });
  }

  async onCurrentSortChange(order: this['conditions']['order']) {
    this.changeCondition(Object.assign(this.conditions, { order }));
  }

  onTaskItemClick(ev: MouseEvent, task: Task) {
    if (this.$route.name !== 'task' || this.$route.params['taskId'] !== task.id.toString()) {
      this.$router.push(this.getTaskTo(task.id));
    }
  }

  async onInlineTaskAddStart() {
    if (this.adding || this.saving) return;
    this.addingTaskSubject = '';
    this.adding = true;
    await this.$nextTick();
    this.$refs.addingTaskSubjectInput.focus();
  }

  async onInlineTaskAddEnd() {
    if (!this.adding || this.saving) return;
    if (this.addingTaskSubject.trim() !== '') {
      const myUser = this.$store.state.activeUser.myUser!;
      const projectId = this.$store.getters.activeUser.activeProjectId!;
      const tasksApi = apiRegistry.load(TasksApi, myUser.token);
      const statusOptions = this.statusOptions!
        .filter((o) => o.category === ProjectStatusCategory.Progress)
        .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
      try {
        this.saving = true;
        const updatedTask = await tasksApi.tasksPost({
          spaceId: myUser.space.id,
          projectId,
          tasksPostRequestBody: {
            subject: this.addingTaskSubject.trim(),
            status: statusOptions[0].id,
            chargeUsers: [],
            tags: [],
          },
        });
        this.$appEmit('task-added', { task: updatedTask });
      } catch (err) {
        this.$appEmit('error', { err });
        return;
      } finally {
        this.saving = false;
      }
    }
    this.adding = false;
  }

  onTaskAdded(ev: { task: Task }) {
    if (!this.tasks || ev.task.parent) return;
    if (!this.tasks.find((t) => t.id === ev.task.id)) {
      this.tasks.unshift(ev.task);
    }
  }

  onTaskEdited(ev: { task: Task }) {
    if (!this.tasks) return;
    const index = this.tasks.findIndex((t) => t.id === ev.task.id);
    if (index >= 0) {
      this.tasks.splice(index, 1, ev.task);
    }
  }

  onTaskDeleted(ev: { taskId: number }) {
    if (!this.tasks) return;
    const index = this.tasks.findIndex((t) => t.id === ev.taskId);
    if (index >= 0) {
      this.tasks.splice(index, 1);
    }
  }


  async onDropTask(ev: DropTaskEvent) {
    if (this.saving) return;

    // 循環参照によるPropの直接変更対策
    this.dragData = null;
    this.dropHover = null;
    await this.$nextTick();

    const dragData = ev.dragData;
    let dropData: {
      task: TaskWithChilds | null;
      taskParent: TaskWithChilds | null;
      position: DropItemPosition;
    } = ev.dropData;
    if (!this.currentSort.droppableBetween && dropData.position !== 'child') {
      dropData = {
        task: null,
        taskParent: null,
        position: 'child',
      };
    }

    if (dragData.task === dropData.task) {
      return;
    }
    if (dropData.position === 'child') {
      if ((dropData.task && dragData.taskParent === dropData.task) ||
          (!dropData.task && !dragData.taskParent)
      ) {
        return;
      }
    }

    // 現在の親グループから脱退
    if (dragData.taskParent) {
      dragData.taskParent.childs!.splice(dragData.taskParent.childs!.indexOf(dragData.task), 1);
      if (!dragData.taskParent.childs!.length) {
        this.$delete(dragData.taskParent, 'childs');
        dragData.taskParent.hasChilds = false;
      }
    } else {
      this.tasks!.splice(this.tasks!.indexOf(dragData.task), 1);
    }

    const myUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, myUser.token);
    const body: TasksTaskIdPriorityPostRequestBody = {};

    // 指定の親グループに加入
    if (dropData.position === 'child') {
      if (dropData.task) {
        if (dropData.task.childs) {
          dropData.task.childs.push(dragData.task);
        } else if (!dropData.task.hasChilds) {
          dropData.task.hasChilds = true;
        }
        body.parent = dropData.task.id;
      } else {
        this.tasks.push(dragData.task);
        body.parent = null;
      }

    } else if (dropData.position === 'before') {
      const targetTasks = dropData.taskParent ? dropData.taskParent.childs! : this.tasks;
      targetTasks.splice(targetTasks.indexOf(dropData.task!), 0, dragData.task);
      body.parent = dropData.task!.parent;
      body.nextHighestTask = dropData.task!.id;

    } else if (dropData.position === 'after') {
      const targetTasks = dropData.taskParent ? dropData.taskParent.childs! : this.tasks;
      targetTasks.push(dragData.task);
      body.parent = dropData.task!.parent;
      body.nextHighestTask = null;
    }

    try {
      this.saving = true;
      await tasksApi.tasksTaskIdPriorityPost({
        spaceId: myUser.space.id,
        projectId,
        taskId: dragData.task.id,
        tasksTaskIdPriorityPostRequestBody: body,
      });
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  async init(to: Route, from: Route) {
    if (to.name === 'tasks' || !from || from.params.projectId !== to.params.projectId) {
      await this.$store.actions.activeUser.fetchTaskStatus();
      if (this.initialized) {
        this.changeCondition(this.initialConditions);
      } else {
        this.initialized = true;
      }
    }
  }

  async onFilterInput(filter: this['filter']) {
    this.filter = filter;
    this.changeCondition({
      filter: Object.assign({ favorite: this.isFavorite }, this.filter),
      order: this.conditions.order,
    });
  }

  onWindowMouseDownUseCapture(ev: MouseEvent) {
    if (this.showedFilter) {
      if (
        this.$refs.filterForm.$el !== ev.target &&
        !this.$refs.filterForm.$el.contains(ev.target as Element) &&
        this.$refs.filterButton !== ev.target &&
        !this.$refs.filterButton.contains(ev.target as Element)
      ) {
        this.showedFilter = false;
      }
    }
  }

  beforeMount() {
    this.$appOn('task-added', this.onTaskAdded);
    this.$appOn('task-edited', this.onTaskEdited);
    this.$appOn('task-deleted', this.onTaskDeleted);
    window.addEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  beforeDestroy() {
    this.$appOff('task-added', this.onTaskAdded);
    this.$appOff('task-edited', this.onTaskEdited);
    this.$appOff('task-deleted', this.onTaskDeleted);
    window.removeEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    next(async(vm) => {
      await (vm as this).init(to, from);
    });
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    next();
    await this.init(to, from);
  }
}
</script>
