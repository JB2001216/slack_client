<template>
  <div v-if="task && activeProjectId" class="mainColumn taskColumn" :class="{fullMainColumn, updatable, editDetail}">
    <template v-if="editDetail">
      <div class="mainColumn_head columnTitle">
        <h2>
          <my-input
            v-model="editDetail.subject"
            type="text"
            class="basicInput borderless"
            placeholder="No Title"
            auto-resize
            @change="$event.target.blur()"
          />
        </h2>
      </div>
      <div class="mainColumn_body">
        <div class="dashboardWrap">
          <div class="dashboardWrap_detail">
            <my-markdown-editor
              ref="markdownEditor"
              v-model="editDetail.body"
              class="noteEditWrap_post"
              editor-class="noteEditWrap_post_edit"
              :editor-placeholder="$t('views.taskColumn.enterDetails')"
              preview-class="noteEditWrap_post_view"
              :preview-placeholder="$t('views.taskColumn.detailsAreEmpty')"
              @change="editedDetailBody = true"
            />
          </div>
          <div class="dashboardWrap_footer">
            <button class="formFooterButtonPrimary wide dashboardWrap_footer_button" @click="endEditDetail(true)">
              {{ $t('common.finishEditing') }}
            </button>
            <!--button class="formFooterButtonSecondary wide dashboardWrap_footer_button" @click="endEditDetail()">
              {{ $t('common.cancel') }}
            </button-->
            <button class="formFooterButtonLight dashboardWrap_footer_mdHelpButton">
              <my-svg-icon class="dashboardWrap_footer_mdHelpButton_icon" name="question" />
              <span>{{ $t('common.markdownHelp') }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="editTags">
      <tag-column
        :tags="task.tags"
        @end-edit-tags="endEditTags()"
      />
    </template>

    <template v-else>
      <div class="mainColumn_head columnTitle">
        <h2>
          <my-input
            v-if="updatable"
            v-model="task.subject"
            type="text"
            class="basicInput borderless"
            placeholder="No Title"
            auto-resize
            @change="onSubjectChange"
          />
          <span v-else>{{ task.subject }}</span>
        </h2>
        <div class="mainColumn_head_toolbar">
          <my-date-range-input
            class="mainColumn_head_toolbar_item"
            :value="task.limitedAt ? {start: task.startedAt, end: task.limitedAt} : null"
            :disabled="!updatable"
            @input="onDateRangeChange($event)"
          />
          <my-svg-icon class="mainColumn_head_toolbar_item favoriteIcon" :class="{active: isFavorite}" name="bookmark" @click="favorite(!isFavorite)" />
          <my-svg-icon class="mainColumn_head_toolbar_item" name="link" />
          <my-svg-icon class="mainColumn_head_toolbar_item" name="clip" />
          <my-svg-icon v-if="deletable" class="mainColumn_head_toolbar_item" name="trash" @click="destroy()" />
        </div>
      </div>
      <div class="mainColumn_body">
        <div class="dashboardWrap">
          <div class="dashboardWrap_list">
            <my-charger-input
              :value="{batonUser: task.batonUser, chargeUsers: task.chargeUsers}"
              :disabled="!updatable"
              :my-user="myUser"
              :project-id-exact="activeProjectId"
              :dialog-title="$t('views.taskColumn.chargerDialogTitle')"
              @change="onChargerChange"
            />
          </div>
          <my-project-status-input
            :value="task.status"
            :options="statusOptions"
            :disabled="!updatable"
            @input="onStatusChange($event)"
          />
          <div class="dashboardWrap_bar">
            <span class="dashboardWrap_bar_item" @click="startEditTags()">
              <my-svg-icon class="dashboardWrap_bar_item_icon" name="tag" />
              <span>{{ $t('views.taskColumn.tags.tags') + ': ' + task.tags.length.toString() }}</span>
            </span>
          </div>
          <!-- <dl class="dashboardWrap_tag">
            <dd v-for="(t,i) in task.tags" :key="t.name">
              <span>{{ t.name }}</span>
              <div v-if="updatable" class="dashboardWrap_tag_destroy" @click="task.tags.splice(i, 1)" />
            </dd>
            <form @submit.prevent="addTags()">
              <input
                v-if="updatable"
                ref="tagInput"
                class="dashboardWrap_tag_input"
                :placeholder="$t('views.taskColumn.addTags')"
                @blur="addTags()"
              >
            </form>
          </dl>
          <hr> -->
          <div class="dashboardWrap_task">
            <button v-if="updatable" class="dashboardWrap_task_editButton" @click="startEditDetail()">
              <my-svg-icon name="pen" class="dashboardWrap_task_editButton_icon" />Edit
            </button>
            <my-markdown-editor
              v-model="task.body"
              class="noteEditWrap_post"
              editor-class="noteEditWrap_post_edit"
              :editor-placeholder="$t('views.taskColumn.enterDetails')"
              preview-class="noteEditWrap_post_view"
              :preview-placeholder="$t('views.taskColumn.detailsAreEmpty')"
              :hide-editor="true"
            />
          </div>
          <task-comment :task="task" />
        </div>
      </div>
    </template>

    <my-confirm-change-discard-dialog
      :changes="changes"
      :next="nextRouteForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscard"
    />
  </div>
</template>

<style lang="stylus">
@import '../../../../../stylus/_settings'

.taskColumn
  .favoriteIcon
    &.active
      --mySvgIconColor: $colors.primaryBlue
    &.active:hover
      --mySvgIconColor: $colors.primaryBlueDarken1
  .dashboardWrap_task
    position: relative
    &_editButton
      position: absolute
      right: 0
      top: 0
      background: $colors.whiteDarken1
      color: $colors.primaryBlack
      cursor: pointer
      font-size: 12px
      border: none
      border-radius: 20px
      height: 26px
      padding: 0 12px
      display: flex
      align-items: center
      &_icon
        --mySvgIconSize: 14px
        --mySvgIconColor: $colors.primaryBlack
        margin-right: 4px
      &:hover
        background: $colors.whiteDarken2
        color: $colors.primaryBlackDarken5
        .dashboardWrap_note_editButton_icon
          --mySvgIconColor: $colors.primaryBlackDarken5
    .noteEditWrap_post
      margin-top: 0
      &_view,
      &_edit
        height: auto
      &.hideEditor
        height: 210px
        overflow-y: scroll
        .noteEditWrap_post_view
          padding: 0 18px 18px
  .dashboardWrap_bar
    align-items: center
    display: flex
    padding: 5px
    margin: 5px 0px
    background-color: #f0f0f0
    &_item
      cursor: pointer
      align-items: center
      display: flex
      &_icon
        --mySvgIconSize: 19px
        --mySvgIconColor: $themeColors.icon
        &:hover
          --mySvgIconColor: $themeColors.iconDarken1
        &:not(:first-child)
          margin-left: 16px
  .dashboardWrap_tag
    form
      margin-bottom: 5px
    dd
      cursor: default
      margin-bottom: 5px
  &:not(.updatable)
    .dashboardWrap_tag
      dd
        background-image: none
        padding-right: 12px
  &.updatable
    .dashboardWrap_tag
      dd
        position: relative
      &_destroy
        cursor: pointer
        position: absolute
        width: 18px
        height: 80%
        right: 4px
        top: 10%
      &_input
        line-height: 28px
        font-size: 12px
        padding: 0
        border: none
  .dashboardWrap_footer
    display: block
    width: 100%
    padding: 16px 20px
    background: #fff
    position: absolute
    bottom: 0
    left: 0
    text-align: center
    &_mdHelpButton
      position: absolute
      right: 20px
      &_icon
        --mySvgIconColor: $colors.primaryBlack
        --mySvgIconSize: 16px
        vertical-align: middle
        margin-right: 6px
        margin-bottom: 3px
      &:hover
        .dashboardWrap_footer_mdHelpButton_icon
          --mySvgIconColor: $colors.primaryBlackDarken5
  &.editDetail
    .columnTitle
      h2
        width: 100%
    .noteEditWrap_post
      border-top: 1px solid $colors.lightGrayLighten2
      border-bottom: 1px solid $colors.lightGrayLighten2
      margin-top: 0
      height: calc(100vh - 144px)
</style>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import * as api from '@/lib/api';
import store from '@/store';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';
import MyMarkdownEditor from '@/components/MyMarkdownEditor';
import TagColumn from './TagColumn.vue';
import TaskComment from './TaskComment.vue';
import { MyChargerInputChangeEvent } from '@/components/MyChargerInput/types';
import ConfirmChangeDiscardMixin from '@/mixins/ConfirmChangeDiscardMixin';


async function initData(to: Route): Promise<Partial<Pick<TaskColumn, 'isFavorite' | 'editDetail' | 'editedDetailBody' | 'task'>>> {
  const loginUser = store.state.activeUser.myUser!;
  const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);
  const spaceId = loginUser.space.id;
  const projectId = store.getters.activeUser.activeProjectId;

  const [_, task, resFavorite] = await Promise.all([
    store.actions.activeUser.fetchTaskStatus(),
    tasksApi.tasksTaskIdGet({
      spaceId: store.state.activeUser.myUser!.space.id,
      projectId: store.getters.activeUser.activeProjectId!,
      taskId: parseInt(to.params.taskId),
    }),
    tasksApi.tasksTaskIdFavoriteGet({
      spaceId: store.state.activeUser.myUser!.space.id,
      projectId: store.getters.activeUser.activeProjectId!,
      taskId: parseInt(to.params.taskId),
    }),
  ]);
  task.tags = task.tags || [];
  return {
    isFavorite: resFavorite.value,
    editDetail: null,
    editedDetailBody: true,
    task,
  };
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
@Component({
  components: {
    MyProjectStatusInput,
    TagColumn,
    TaskComment,
  },
})
export default class TaskColumn extends Mixins(ConfirmChangeDiscardMixin) {
  $refs!: {
    tagInput: HTMLInputElement;
    markdownEditor: MyMarkdownEditor;
  };

  task: api.Task | null = null;
  isFavorite = false;
  editDetail: Pick<api.Task, 'subject' | 'body'> | null = null;
  editedDetailBody = false;
  saving = false;
  editTags = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }
  get myPerms() {
    return this.$store.getters.activeUser.activeProjectMyPerms!;
  }
  get activeProjectId() {
    return this.$store.getters.activeUser.activeProjectId;
  }

  get statusOptions() {
    return this.$store.state.activeUser.taskStatusList;
  }

  get updatable() {
    if (!this.task) return false;
    return this.$store.getters.activeUser.taskUpdatable(this.task);
  }

  get deletable() {
    if (!this.task) return false;
    return this.$store.getters.activeUser.taskDeletable(this.task);
  }

  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  get changes() {
    return !!this.task && !!this.editDetail && (
      this.task.subject !== this.editDetail.subject ||
      this.editedDetailBody
    );
  }

  async addTags() {
    const newTagText = this.$refs.tagInput.value;
    this.$refs.tagInput.value = '';
    const newTagNames = newTagText.split(/[,、\s]/).map((s) => s.trim());
    const newTags = Array.from(new Set(newTagNames))
      .filter((s) => s.length > 0 && !this.task!.tags!.find((t) => t.name === s))
      .map((s) => ({ name: s }));
    if (newTags.length) {
      await this.save({
        tags: this.task!.tags!.concat(newTags),
      });
    }
  }

  async save(data: api.TasksTaskIdPatchRequestBody) {
    if (this.saving) {
      return false;
    }
    const loginUser = store.state.activeUser.myUser!;
    const projectId = store.getters.activeUser.activeProjectId!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);
    try {
      this.saving = true;
      const task = await tasksApi.tasksTaskIdPatch({
        spaceId: loginUser.space.id,
        projectId,
        taskId: parseInt(this.$route.params.taskId),
        tasksTaskIdPatchRequestBody: data,
      });
      this.$appEmit('task-edited', { task });
      return true;

    } catch (err) {
      this.$appEmit('error', { err });
      throw err;

    } finally {
      this.saving = false;
    }
  }

  async destroy() {
    if (this.saving) {
      return;
    }
    const loginUser = store.state.activeUser.myUser!;
    const projectId = store.getters.activeUser.activeProjectId!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);

    try {
      this.saving = true;
      await tasksApi.tasksTaskIdDelete({
        spaceId: loginUser.space.id,
        projectId,
        taskId: parseInt(this.$route.params.taskId),
      });
      this.$appEmit('task-deleted', { taskId: parseInt(this.$route.params.taskId) });
      this.$flash(this.$t('common.deleted').toString(), 'success');

    } catch (err) {
      this.$appEmit('error', { err });
    }

    this.saving = false;
  }

  async favorite(value: boolean) {
    if (this.saving) {
      return;
    }

    const loginUser = store.state.activeUser.myUser!;
    const projectId = store.getters.activeUser.activeProjectId!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);
    try {
      this.saving = true;
      const res = await tasksApi.tasksTaskIdFavoritePost({
        spaceId: loginUser.space.id,
        projectId: projectId,
        taskId: parseInt(this.$route.params.taskId),
        tasksTaskIdFavoritePostRequestBody: { value },
      });
      this.isFavorite = res.value;

    } catch (err) {
      this.$appEmit('error', { err });
    }

    this.saving = false;
  }

  async onDateRangeChange(range: {start: Date; end: Date} | null) {
    await this.save({
      startedAt: range ? range.start : (null as any),
      limitedAt: range ? range.end : (null as any),
    });
  }

  async onSubjectChange(ev: Event) {
    const subject = (ev.target as HTMLInputElement).value.trim();
    if (subject !== '') {
      await this.save({ subject });
      (ev.target as HTMLInputElement).blur();
    }
  }

  async onStatusChange(status: number) {
    await this.save({
      status,
    });
  }

  async onChargerChange(ev: MyChargerInputChangeEvent) {
    if (!ev.value) return;
    const targetUser = ev.target && ev.target.from === 'dialog' ? (await this.$store.actions.activeUser.getSpaceUser(ev.target.id)) : null;
    const result = await this.save({
      batonUser: ev.value.batonUser,
      chargeUsers: ev.value.chargeUsers,
    });
    if (result && targetUser) {
      if (ev.target!.action === 'add') {
        this.$flash(this.$t('views.taskColumn.addedChargeUser', { name: targetUser.displayName || targetUser.account }).toString(), 'success');
      } else if (ev.target!.action === 'delete') {
        this.$flash(this.$t('views.taskColumn.deletedChargeUser', { name: targetUser.displayName || targetUser.account }).toString(), 'success');
      }
    }
  }

  startEditTags() {
    this.editTags = true;
    this.$store.mutations.setFullMainColumn(true);
  }

  endEditTags() {
    this.editTags = false;
    this.$store.mutations.setFullMainColumn(false);
  }


  startEditDetail() {
    this.editDetail = {
      subject: this.task!.subject,
      body: this.task!.body || '',
    };
    this.editedDetailBody = false;
    this.$store.mutations.setFullMainColumn(true);
  }

  async endEditDetail(save = false) {
    if (save && this.editDetail) {
      await this.$refs.markdownEditor.compileValue();
      await this.save(this.editDetail);
    }
    this.editDetail = null;
    this.editedDetailBody = false;
    this.$store.mutations.setFullMainColumn(false);
  }

  onTaskEdited(ev: { task: api.Task }) {
    if (this.task && this.task.id === ev.task.id) {
      this.task = Object.assign({}, ev.task);
    }
  }

  onTaskDeleted(ev: { taskId: number }) {
    if (this.task && this.task.id === ev.taskId) {
      this.task = null;
    }
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    const options = await initData(to);
    store.mutations.setFullMainColumn(false);
    next((vm) => {
      (Object.keys(options) as (keyof typeof options)[]).forEach((k) => {
        (vm as any)[k] = options[k]!;
      });
    });
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    const options = await initData(to);
    store.mutations.setFullMainColumn(false);
    (Object.keys(options) as (keyof typeof options)[]).forEach((k) => {
      (this as any)[k] = options[k]!;
    });
    this.saving = false;
    next();
  }

  beforeRouteLeave(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    store.mutations.setFullMainColumn(false);
    next();
  }

  beforeMount() {
    this.$appOn('task-edited', this.onTaskEdited);
    this.$appOn('task-deleted', this.onTaskDeleted);
  }

  beforeDestroy() {
    this.$appOff('task-edited', this.onTaskEdited);
    this.$appOff('task-deleted', this.onTaskDeleted);
  }
}
</script>
