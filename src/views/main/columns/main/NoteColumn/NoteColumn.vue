<template>
  <div
    v-if="note && activeProjectId"
    class="mainColumn noteColumn"
    :class="{
      fullMainColumn,
      updatable,
      editDetail,
      viewingRelatedNote :viewingRelatedNoteId,
    }"
  >
    <div class="mainColumn_mainPanel">
      <template v-if="editDetail">
        <div class="mainColumn_head columnTitle">
          <h2>
            <my-input
              v-model="editDetail.subject"
              type="text"
              class="basicInput borderless"
              placeholder="No Title"
              auto-resize
              @change="modified = true; $event.target.blur()"
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
                :editor-placeholder="$t('views.noteColumn.enterDetails')"
                preview-class="noteEditWrap_post_view"
                :preview-placeholder="$t('views.noteColumn.detailsAreEmpty')"
                enabled-note-link
                :my-user="myUser"
                :project-id="activeProjectId"
                @change="modified = true"
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
              v-model="note.subject"
              type="text"
              class="basicInput borderless"
              placeholder="No Title"
              auto-resize
              @change="onSubjectChange"
            />
            <span v-else>{{ note.subject }}</span>
          </h2>
          <div class="mainColumn_head_toolbar">
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
                :value="{batonUser: note.batonUser, chargeUsers: note.chargeUsers}"
                :disabled="!updatable"
                :my-user="myUser"
                :project-id-exact="activeProjectId"
                :dialog-title="$t('views.noteColumn.chargerDialogTitle')"
                @change="onChargerChange"
              />
            </div>
            <my-project-status-input
              :value="note.status"
              :options="statusOptions"
              :disabled="!updatable"
              @input="onStatusChange($event)"
            />
            <div class="dashboardWrap_note">
              <button v-if="updatable" class="dashboardWrap_note_editButton" @click="startEditDetail()">
                <my-svg-icon name="pen" class="dashboardWrap_note_editButton_icon" />Edit
              </button>
              <my-markdown-editor
                v-model="note.body"
                class="noteEditWrap_post"
                preview-class="noteEditWrap_post_view"
                :preview-placeholder="$t('views.noteColumn.detailsAreEmpty')"
                hide-editor
                enabled-note-link
                :my-user="myUser"
                :project-id="activeProjectId"
                @note-link-click="onNoteLinkClick"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="viewingRelatedNoteId" class="mainColumn_subPanel">
      <span class="mainColumn_subPanel_close" @click="onNoteLinkViewerClose">×</span>
      <note-link-viewer
        v-model="viewingRelatedNoteId"
        :status-options="statusOptions"
        :my-user="myUser"
        :project-id="activeProjectId"
        @note-edit="onNoteLinkViewerEdit"
      />
    </div>

    <my-confirm-change-discard-dialog
      :changes="changes"
      :next="!!nextForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscardDialog"
    />
  </div>
</template>

<style lang="stylus">
@import '../../../../../stylus/_settings'

.noteColumn
  .favoriteIcon
    &.active
      --mySvgIconColor: $colors.primaryBlue
    &.active:hover
      --mySvgIconColor: $colors.primaryBlueDarken1
  .columnTitle
    h2
      width: calc(100% - 140px)
  .dashboardWrap_note
    margin-top: 16px;
    zoom: 1;
    position: relative
    &_editButton
      position: absolute
      right: 0
      top: 16px
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
        height: calc(100vh - 180px)
        overflow-y: scroll
        border-top: solid 1px $colors.lightGrayLighten2
        .noteEditWrap_post_view
          padding: 16px
  .dashboardWrap_footer
    display: block
    width: 100%
    min-height: 60px
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
  &.viewingRelatedNote
    display: grid
    grid-template-columns: 50% 1fr
  .mainColumn_subPanel
    position: relative
    box-shadow: 0px 2px 8px 0 rgba(0, 0, 0, 0.16);
    &_close
      position: absolute
      right: 20px
      top: 20px
      cursor: pointer
      color: $themeColors.icon
      font-size: 18px
      font-size: 22px
      line-height: 1
      &:hover
        color: $themeColors.iconDarken1
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import * as api from '@/lib/api';
import store from '@/store';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';
import MyMarkdownEditor from '@/components/MyMarkdownEditor';
import NoteLinkViewer from './NoteLinkViewer.vue';
import { MyChargerInputChangeEvent } from '@/components/MyChargerInput/types';
import ConfirmChangeDiscardMixin from '@/mixins/ConfirmChangeDiscardMixin';


async function initData(to: Route): Promise<Partial<Pick<NoteColumn, 'isFavorite' | 'editDetail' | 'modified' | 'note'>>> {
  const loginUser = store.state.activeUser.myUser!;
  const notesApi = api.apiRegistry.load(api.NotesApi, loginUser.token);
  const spaceId = loginUser.space.id;
  const projectId = store.getters.activeUser.activeProjectId;

  const [_, note, resFavorite] = await Promise.all([
    store.actions.activeUser.fetchNoteStatus(),
    notesApi.notesNoteIdGet({
      spaceId: store.state.activeUser.myUser!.space.id,
      projectId: store.getters.activeUser.activeProjectId!,
      noteId: parseInt(to.params.noteId),
    }),
    notesApi.notesNoteIdFavoriteGet({
      spaceId: store.state.activeUser.myUser!.space.id,
      projectId: store.getters.activeUser.activeProjectId!,
      noteId: parseInt(to.params.noteId),
    }),
  ]);

  return {
    isFavorite: resFavorite.value,
    editDetail: null,
    modified: false,
    note,
  };
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
]);
@Component({
  components: {
    MyProjectStatusInput,
    NoteLinkViewer,
  },
})
export default class NoteColumn extends Mixins(ConfirmChangeDiscardMixin) {
  $refs!: {
    markdownEditor: MyMarkdownEditor;
  };

  note: api.Note | null = null;
  isFavorite = false;
  editDetail: Pick<api.Note, 'subject' | 'body'> | null = null;
  modified = false;
  wideScreen = false;
  saving = false;

  viewingRelatedNoteId: number | null = null;

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
    return this.$store.state.activeUser.noteStatusList;
  }

  get updatable() {
    if (!this.note) return false;
    return this.$store.getters.activeUser.noteUpdatable(this.note);
  }

  get deletable() {
    if (!this.note) return false;
    return this.$store.getters.activeUser.noteDeletable(this.note);
  }

  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  get changes() {
    return this.modified;
  }

  async save(data: api.NotesNoteIdPatchRequestBody) {
    if (this.saving) {
      return false;
    }
    const loginUser = store.state.activeUser.myUser!;
    const projectId = store.getters.activeUser.activeProjectId!;
    const notesApi = api.apiRegistry.load(api.NotesApi, loginUser.token);
    try {
      this.saving = true;
      const note = await notesApi.notesNoteIdPatch({
        spaceId: loginUser.space.id,
        projectId,
        noteId: parseInt(this.$route.params.noteId),
        notesNoteIdPatchRequestBody: data,
      });
      this.$appEmit('note-edited', { note });
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
    const notesApi = api.apiRegistry.load(api.NotesApi, loginUser.token);

    try {
      this.saving = true;
      await notesApi.notesNoteIdDelete({
        spaceId: loginUser.space.id,
        projectId,
        noteId: parseInt(this.$route.params.noteId),
      });
      this.$appEmit('note-deleted', { noteId: parseInt(this.$route.params.noteId) });
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
    const notesApi = api.apiRegistry.load(api.NotesApi, loginUser.token);
    try {
      this.saving = true;
      const res = await notesApi.notesNoteIdFavoritePost({
        spaceId: loginUser.space.id,
        projectId: projectId,
        noteId: parseInt(this.$route.params.noteId),
        notesNoteIdFavoritePostRequestBody: { value },
      });
      this.isFavorite = res.value;

    } catch (err) {
      this.$appEmit('error', { err });
    }

    this.saving = false;
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
        this.$flash(this.$t('views.noteColumn.addedChargeUser', { name: targetUser.displayName || targetUser.account }).toString(), 'success');
      } else if (ev.target!.action === 'delete') {
        this.$flash(this.$t('views.noteColumn.deletedChargeUser', { name: targetUser.displayName || targetUser.account }).toString(), 'success');
      }
    }
  }

  startEditDetail() {
    if (!this.updatable) return;
    this.editDetail = {
      subject: this.note!.subject,
      body: this.note!.body || '',
    };
    this.modified = false;
    this.viewingRelatedNoteId = null;
    this.$store.mutations.setFullMainColumn(true);
  }

  async endEditDetail(save = false) {
    if (save && this.editDetail) {
      await this.$refs.markdownEditor.compileValue();
      await this.save(this.editDetail);
    }
    this.editDetail = null;
    this.modified = false;
    this.$store.mutations.setFullMainColumn(false);
  }

  onNoteLinkClick(note: api.NoteSummary) {
    this.$store.mutations.setFullMainColumn(true);
    this.viewingRelatedNoteId = note.id;
  }

  onNoteLinkViewerClose() {
    this.$store.mutations.setFullMainColumn(false);
    this.viewingRelatedNoteId = null;
  }

  onNoteLinkViewerEdit(note: api.Note) {
    this.$router.push({
      name: 'note',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
        noteId: note.id.toString(),
      },
      query: {
        edit: 'true',
      },
    });
  }

  onEnterWideScreen() {
    this.wideScreen = true;
    this.$store.mutations.setFullMainColumn(this.wideScreen);
  }

  onExitWideScreen() {
    this.wideScreen = false;
    this.$store.mutations.setFullMainColumn(this.wideScreen);
  }

  onNoteEdited(ev: { note: api.Note }) {
    if (this.note && this.note.id === ev.note.id) {
      this.note = Object.assign({}, ev.note);
    }
  }

  onNoteDeleted(ev: { noteId: number }) {
    if (this.note && this.note.id === ev.noteId) {
      this.note = null;
    }
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    const options = await initData(to);
    store.mutations.setFullMainColumn(false);
    next((vm) => {
      (Object.keys(options) as (keyof typeof options)[]).forEach((k) => {
        (vm as any)[k] = options[k]!;
      });
      if (to.query.edit === 'true') {
        (vm as this).startEditDetail();
      }
    });
  }

  @Watch('$route')
  async onRouteChange(to: Route) {
    if (to.name !== 'note') return;
    const options = await initData(to);
    store.mutations.setFullMainColumn(false);
    (Object.keys(options) as (keyof typeof options)[]).forEach((k) => {
      (this as any)[k] = options[k]!;
    });
    this.saving = false;
    if (to.query.edit === 'true') {
      this.startEditDetail();
    }
  }

  beforeRouteLeave(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    store.mutations.setFullMainColumn(false);
    next();
  }

  beforeMount() {
    this.$appOn('note-edited', this.onNoteEdited);
    this.$appOn('note-deleted', this.onNoteDeleted);
  }

  beforeDestroy() {
    this.$appOff('note-edited', this.onNoteEdited);
    this.$appOff('note-deleted', this.onNoteDeleted);
  }
}
</script>
