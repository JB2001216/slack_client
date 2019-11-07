<template>
  <sub-column-layout active-tab="task">
    <div class="tab_task">
      <div class="task_menu">
        <div class="task_menu_left">
          <my-svg-icon name="bookmark" class="task_menu_favorite" :class="{active: isFavorite}" @click.prevent="favorite(!isFavorite)" />
        </div>
        <div class="task_menu_right">
          <a
            ref="filterButton"
            class="task_menu_search"
            :class="{active: activeFilter}"
            href="#"
            @click.prevent="showedFilter = !showedFilter"
          >
            <my-svg-icon name="filter" />
            <span class="t-caption">{{ $t('views.tasksColumn.filter') }}</span>
          </a>
          <my-simple-menu>
            <template v-slot="{open, close, opened}">
              <a class="task_menu_sort" href="#" @click.stop.prevent="opened ? close() : open()">
                <span class="t-caption">{{ $t(`views.tasksColumn.ordering.${currentSort.i18nKey}`) }}</span>
                <my-svg-icon name="pulldown" />
              </a>
            </template>
            <template v-slot:items>
              <li v-for="s in sorts" :key="`${s.field}_${s.type}`" @click="onCurrentSortChange(s)">
                <span>
                  <template v-if="s === currentSort">→</template>
                  {{ $t(`views.tasksColumn.ordering.${s.i18nKey}`) }}
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
            {{ $t('views.tasksColumn.addANewTask') }}
          </a>
          <div v-if="adding" class="task_add adding">
            <input
              ref="addingTaskSubjectInput"
              v-model="addingTaskSubject"
              class="task_add_input"
              type="text"
              @keydown.esc="adding = false"
              @blur="onInlineTaskAddEnd()"
              @change="$event.target.blur()"
            >
          </div>
        </template>
        <div class="infiniteLoadContainer">
          <infinite-loading v-if="tasksInit" :identifier="infiniteId" @infinite="onInfinite" />
        </div>
        <div
          ref="taskListContainer"
          class="taskListContainer"
          :class="{dropHoverRoot: !currentSort.droppableBetween && dragData && dropHover && dropHover.position !== 'child'}"
        >
          <nested-list
            :tasks="tasks"
            :status-options="statusOptions"
            :fetch-tasks="fetchTasks"
            :item-droppable-between="currentSort.droppableBetween"
            :drag-data="dragData"
            :drop-hover="dropHover"
            @drag-data-change="dragData = $event"
            @drop-hover-change="dropHover = $event"
            @drop-task="onDropTask"
            @item-click="onTaskItemClick"
          />
        </div>
      </div>
      <transition name="slide-right">
        <filter-form
          v-if="showedFilter"
          ref="filterForm"
          :value="filter"
          :status-options="statusOptions"
          @input="onFilterInput"
        />
      </transition>
    </div>
  </sub-column-layout>
</template>


<style lang="stylus">
@import '../../../../../stylus/_settings'

.tab_task
  .task_menu
    &_search
      --mySvgIconColor: $themeColors.icon
      --mySvgIconSize: 16px
      &:hover
        color: $themeColors.iconDarken1
        --mySvgIconColor: $themeColors.iconDarken1
      &.active
        color: $colors.primaryBlue
        --mySvgIconColor: $colors.primaryBlue
      &.active:hover
        color: $colors.primaryBlueDarken1
        --mySvgIconColor: $colors.primaryBlueDarken1
      .mySvgIcon
        margin-right: 6px
    &_sort
      --mySvgIconColor: $themeColors.icon
      --mySvgIconSize: 9px
      &:hover
        color: $themeColors.iconDarken1
        --mySvgIconColor: $themeColors.iconDarken1
      .mySvgIcon
        margin-left: 6px
        vertical-align: middle

  .taskListContainer
    max-height: calc(100vh - 225px)
    overflow-y: scroll
    position: relative
    &.dropHoverRoot
      outline: solid 3px rgba(125,200,255,0.8)
      outline-offset: -3px
  a.task_add
    cursor: pointer
    position: relative
    z-index: 1
  .task_add.adding
    padding: 0 20px;
    .task_add_input
      margin: 6px 0
      padding: 5px
      width: 100%
      box-sizing: border-box
  .nestedList
    .nestedList
      padding-left: 20px

.infiniteLoadContainer
  margin-top: -10px
  margin-bottom: -10px
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
import EventsSub from '@/events-subscription';
import { getProjectLastLocation } from '@/router';

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

  tasksInit: boolean = true;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get activeProjectId() {
    return this.$store.getters.activeUser.activeProjectId!;
  }

  get api() {
    return apiRegistry.load(TasksApi, this.myUser.token);
  }

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
    return this.$store.state.activeUser.taskStatusList;
  }

  created() {
    EventsSub.source.addEventListener('createTask', this.createTask);
    EventsSub.source.addEventListener('deleteTask', this.deleteTask);
    EventsSub.source.addEventListener('updateTask', this.updateTask);
  }

  createTask(e: any): void {

    const data = JSON.parse(e.data);
    const isFireUser = data.userId === this.myUser.id;

    this.tasksInit = false;
    setTimeout(() => {

      this.tasksInit = true;

      if (isFireUser) { this.$flash(this.$t('views.tasksColumn.createNotify', { taskName: this.addingTaskSubject }).toString(), 'success'); }

    }, 100);

  }

  deleteTask(e: any): void {

    const data = JSON.parse(e.data);
    const isFireUser = data.userId === this.myUser.id;

    const index = this.tasks.findIndex((t) => t.id === data.params.taskId);

    if (index >= 0) {

      const taskName = this.tasks[index].subject;
      const isActiveTask = this.tasks[index].id === +this.$route.params['taskId'];

      this.tasks.splice(index, 1);

      if (isFireUser || isActiveTask) {
        this.$router.push({
          name: 'project',
          params: {
            userId: this.myUser.id + '',
            projectId: this.activeProjectId + '',
          },
        });
      }

      if (isFireUser) {
        this.$flash(this.$t('views.tasksColumn.deleteNotify', { taskName }).toString(), 'success');
      } else if (isActiveTask) {
        this.$flash(this.$t('views.tasksColumn.noLongerNotify', { taskName }).toString(), 'success');
      }

    }

  }

  updateTask(e: any): void {

    const data = JSON.parse(e.data);

    this.api.tasksTaskIdGet({
      spaceId: data.spaceId,
      projectId: data.params.projectId,
      taskId: data.params.taskId,
    }).then((res) => {
      const index = this.tasks.findIndex((t) => t.id === res.id);
      this.tasks.splice(index, 1, res);
    });

  }

  async fetchTasks(options: { parent?: number; limit?: number; page?: number } = {}) {

    const cond = this.conditions;

    const req: TasksGetRequest = Object.assign({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId,
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

    return this.api.tasksGet(req);

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
        this.tasks.unshift(...addTasks);
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

      const statusOptions = this.statusOptions!
        .filter((o) => o.category === ProjectStatusCategory.Progress)
        .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);

      try {

        this.saving = true;

        await this.api.tasksPost({
          spaceId: this.myUser.space.id,
          projectId: this.activeProjectId,
          tasksPostRequestBody: {
            subject: this.addingTaskSubject.trim(),
            status: statusOptions[0].id,
            chargeUsers: [],
            tags: [],
          },
        });

      } catch (err) {
        this.$appEmit('error', { err });
      } finally {
        this.saving = false;
      }

    }

    this.adding = false;

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

      await this.api.tasksTaskIdPriorityPost({
        spaceId: this.myUser.space.id,
        projectId: this.activeProjectId,
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
    window.addEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  beforeDestroy() {
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

  destroyed() {
    EventsSub.source.removeEventListener('createTask', this.createTask);
    EventsSub.source.removeEventListener('deleteTask', this.deleteTask);
    EventsSub.source.removeEventListener('updateTask', this.updateTask);
  }

}
</script>
