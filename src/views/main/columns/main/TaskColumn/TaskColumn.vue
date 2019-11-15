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
          <my-svg-icon class="mainColumn_head_toolbar_item" name="link" @click="copyLink()" />
          <my-svg-icon class="mainColumn_head_toolbar_item" name="clip" />
          <my-svg-icon v-if="deletable" class="mainColumn_head_toolbar_item" name="trash" @click="deleteConfirming = true" />
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
          <dl class="dashboardWrap_tag">
            <dd v-for="(t,i) in task.tags" :key="t.name">
              <span>{{ t.name }}</span>
              <div v-if="updatable" class="dashboardWrap_tag_destroy" @click="deleteTag(i)" />
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
          <hr>
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

    <my-modal
      v-model="deleteConfirming"
      class="modalDialog"
      content-class="modalDialog_content"
    >
      <div class="modalDialog_content_title">
        {{ $t('views.taskColumn.deleteConfirmDialog.title') }}
      </div>
      <div class="modalDialog_content_description">
        {{ $t('views.taskColumn.deleteConfirmDialog.description') }}
      </div>
      <div class="modalDialog_content_footerButtons">
        <button class="modalDialog_content_footerButtons_button basicButtonDanger" @click="destroy()">
          {{ $t('common.yes') }}
        </button>
        <button class="modalDialog_content_footerButtons_button basicButtonNormal" @click="deleteConfirming = false">
          {{ $t('common.no') }}
        </button>
      </div>
    </my-modal>
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
import { clipboard } from 'electron';
import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import * as api from '@/lib/api';
import { getTaskOpenUrl } from '@/lib/web-router';
import store from '@/store';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';
import MyMarkdownEditor from '@/components/MyMarkdownEditor';
import TaskComment from './TaskComment.vue';
import { MyChargerInputChangeEvent } from '@/components/MyChargerInput/types';
import ConfirmChangeDiscardMixin from '@/mixins/ConfirmChangeDiscardMixin';
import EventsSub from '@/events-subscription';

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
  deleteConfirming = false;

  isDebug: boolean = true;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get activeProjectId() {
    return this.$store.getters.activeUser.activeProjectId!;
  }

  get api() {
    return api.apiRegistry.load(api.TasksApi, this.myUser.token);
  }

  get myPerms() {
    return this.$store.getters.activeUser.activeProjectMyPerms!;
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

  created() {
    EventsSub.source.addEventListener('updateTask', this.updateTask);
  }

  updateTask(e: any): void {

    if (!this.task) return;

    const data = JSON.parse(e.data);
    const updatedTaskId = data.params.taskId;

    if (updatedTaskId !== this.task.id) return;

    this.api.tasksTaskIdGet({
      spaceId: data.spaceId,
      projectId: data.params.projectId,
      taskId: updatedTaskId,
    }).then((task: api.Task) => {

      this.task = Object.assign(this.task, task);

      if (this.isDebug) { console.log('updateTask(task): ' + task.subject); }

    }).catch((err) => {
      this.$appEmit('error', { err });
    });

  }

  async save(data: api.TasksTaskIdPatchRequestBody): Promise<boolean> {

    if (this.saving) return false;

    this.saving = true;

    let isResultCorrect: boolean = false;

    await this.api.tasksTaskIdPatch({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId,
      taskId: parseInt(this.$route.params.taskId),
      tasksTaskIdPatchRequestBody: data,
    }).then(() => {
      isResultCorrect = true;
    }).catch((err) => {
      this.$appEmit('error', { err });
    }).finally(() => {
      this.saving = false;
    });

    return isResultCorrect;

  }

  destroy(): void {

    if (this.saving) return;

    this.saving = true;

    this.api.tasksTaskIdDelete({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId,
      taskId: parseInt(this.$route.params.taskId),
    }).catch((err) => {
      this.$appEmit('error', { err });
    }).finally(() => {
      this.saving = false;
      this.deleteConfirming = false;
    });

  }

  favorite(value: boolean): void {

    if (this.saving) return;

    this.saving = true;

    this.api.tasksTaskIdFavoritePost({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId,
      taskId: parseInt(this.$route.params.taskId),
      tasksTaskIdFavoritePostRequestBody: { value },
    }).then((res) => {
      this.isFavorite = res.value;
    }).catch((err) => {
      this.$appEmit('error', { err });
    }).finally(() => {
      this.saving = false;
    });

  }

  addTags(): void {

    const newTagText = this.$refs.tagInput.value;
    this.$refs.tagInput.value = '';
    const newTagNames = newTagText.split(/[,、\s]/).map((s) => s.trim());
    const newTags = Array.from(new Set(newTagNames))
      .filter((s) => s.length > 0 && !this.task!.tags!.find((t) => t.name === s))
      .map((s) => ({ name: s }));

    if (newTags.length) {
      this.save({ tags: this.task!.tags!.concat(newTags) });
    }

  }

  deleteTag(index: number): void {
    this.task!.tags.splice(index, 1);
    this.save({ tags: this.task!.tags });
  }

  copyLink() {
    if (!this.task) return;
    const url = getTaskOpenUrl({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId!,
      taskId: this.task.id,
    });
    clipboard.writeText(url);
    this.$flash(this.$t('common.copied').toString(), 'success');
  }

  onDateRangeChange(range: {start: Date; end: Date} | null): void {
    this.save({
      startedAt: range ? range.start : (null as any),
      limitedAt: range ? range.end : (null as any),
    });
  }

  async onSubjectChange(ev: Event): Promise<void> {
    const subject = (ev.target as HTMLInputElement).value.trim();
    if (subject !== '') {
      await this.save({ subject });
      (ev.target as HTMLInputElement).blur();
    }
  }

  onStatusChange(status: number): void {
    this.save({ status });
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

  startEditDetail(): void {
    this.editDetail = {
      subject: this.task!.subject,
      body: this.task!.body || '',
    };
    this.editedDetailBody = false;
    this.$store.mutations.setFullMainColumn(true);
  }

  async endEditDetail(save = false): Promise<void> {
    if (save && this.editDetail) {
      await this.$refs.markdownEditor.compileValue();
      await this.save(this.editDetail);
    }
    this.editDetail = null;
    this.editedDetailBody = false;
    this.$store.mutations.setFullMainColumn(false);
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

  destroyed() {
    EventsSub.source.removeEventListener('updateTask', this.updateTask);
  }

  beforeRouteLeave(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    store.mutations.setFullMainColumn(false);
    next();
  }
}
</script>
