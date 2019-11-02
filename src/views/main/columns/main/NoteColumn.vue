<template>
  <div v-if="note && activeProjectId" class="mainColumn noteColumn" :class="{fullMainColumn, updatable, editDetail}">
    <template v-if="editDetail">
      <div class="mainColumn_head columnTitle">
        <h2>
          <my-input
            v-model="editDetail.subject"
            type="text"
            class="basicInput borderless"
            placeholder="No Title"
            auto-resize
          />
        </h2>
      </div>
      <div class="mainColumn_body">
        <div class="dashboardWrap">
          <div class="dashboardWrap_detail">
            <my-markdown-editor
              v-model="editDetail.body"
              class="noteEditWrap_post"
              editor-class="noteEditWrap_post_edit"
              :editor-placeholder="$t('views.noteColumn.enterDetails')"
              preview-class="noteEditWrap_post_view"
              :preview-placeholder="$t('views.noteColumn.detailsAreEmpty')"
            />
          </div>
          <div class="dashboardWrap_submit">
            <button @click="endEditDetail(true)">
              {{ $t('common.save') }}
            </button>
            <button @click="endEditDetail()">
              {{ $t('common.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="mainColumn_head columnTitle">
        <h2>
          <!--input v-if="updatable" v-model="note.subject" @change="onSubjectChange" type="text" style="background:none;"-->
          <span>{{ note.subject }}</span>
          <a v-if="updatable" href="" class="edit" @click.prevent="startEditDetail()">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.1501 0.333313C10.9705 0.333313 10.7908 0.401712 10.6539 0.538905L9.45605 1.73682L12.263 4.54384L13.4609 3.34592C13.7353 3.07154 13.7353 2.62728 13.4609 2.3536L11.6463 0.538905C11.5091 0.401712 11.3297 0.333313 11.1501 0.333313ZM8.40343 2.78945L0.333374 10.8596V13.6666H3.14035L11.2104 5.59647L8.40343 2.78945Z" fill="#333333" />
            </svg>
          </a>
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
            <my-markdown-editor
              v-model="note.body"
              class="noteEditWrap_post"
              editor-class="noteEditWrap_post_edit"
              :editor-placeholder="$t('views.noteColumn.enterDetails')"
              preview-class="noteEditWrap_post_view"
              :preview-placeholder="$t('views.noteColumn.detailsAreEmpty')"
              :hide-editor="true"
            />
          </div>
          <div class="noteEditWrap_submit noEdit">
            <button v-if="!wideScreen" @click="onEnterWideScreen()">
              {{ $t('views.noteColumn.enterWideScreen') }}
            </button>
            <button v-else @click="onExitWideScreen()">
              {{ $t('views.noteColumn.exitWideScreen') }}
            </button>
            <button>
              <svg
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.87825 8.65579V7.77579C2.87825 7.54112 2.88892 7.34379 2.91026 7.18379C2.94226 7.01312 2.99026 6.86379 3.05426 6.73579C3.12892 6.59712 3.21959 6.46912 3.32625 6.35179C3.44359 6.22379 3.58226 6.07446 3.74225 5.90379L4.97426 4.65579C5.24092 4.38912 5.37426 4.04246 5.37426 3.61579C5.37426 3.19979 5.23559 2.86379 4.95825 2.60779C4.69159 2.34112 4.35026 2.20779 3.93426 2.20779C3.48626 2.20779 3.11826 2.36246 2.83026 2.67179C2.54226 2.97046 2.37692 3.33846 2.33426 3.77579L0.286255 3.61579C0.350255 3.10379 0.483588 2.65046 0.686255 2.25579C0.888922 1.85046 1.15026 1.50912 1.47026 1.23179C1.80092 0.954455 2.17959 0.746455 2.60626 0.607789C3.03292 0.458456 3.50226 0.383789 4.01426 0.383789C4.49426 0.383789 4.93692 0.453122 5.34226 0.591788C5.75826 0.730455 6.11559 0.933122 6.41426 1.19979C6.72359 1.45579 6.96359 1.78112 7.13425 2.17579C7.30492 2.55979 7.39025 3.00246 7.39025 3.50379C7.39025 3.85579 7.34226 4.16512 7.24626 4.43179C7.15026 4.69846 7.02226 4.94379 6.86226 5.16779C6.70226 5.39179 6.51559 5.60512 6.30226 5.80779C6.09959 6.01046 5.88092 6.22379 5.64626 6.44779C5.49692 6.58646 5.36892 6.70912 5.26226 6.81579C5.15559 6.92246 5.06492 7.03446 4.99026 7.15179C4.92626 7.25846 4.87826 7.38646 4.84626 7.53579C4.81426 7.67446 4.79825 7.84512 4.79825 8.04779V8.65579H2.87825ZM2.55826 10.8798C2.55826 10.5385 2.68092 10.2451 2.92626 9.99979C3.18226 9.75445 3.48626 9.63179 3.83826 9.63179C4.17959 9.63179 4.47826 9.74912 4.73426 9.98379C4.99026 10.2185 5.11826 10.5065 5.11826 10.8478C5.11826 11.1891 4.99026 11.4825 4.73426 11.7278C4.48892 11.9731 4.19026 12.0958 3.83826 12.0958C3.66759 12.0958 3.50225 12.0638 3.34226 11.9998C3.19292 11.9358 3.05959 11.8505 2.94226 11.7438C2.82492 11.6371 2.72892 11.5091 2.65426 11.3598C2.59026 11.2105 2.55826 11.0505 2.55826 10.8798Z" fill="#C4C4C4" />
              </svg>{{ $t('views.noteColumn.markdownHelp') }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="stylus">
@import '../../../../stylus/_settings'

.noteColumn
  .favoriteIcon
    &.active
      --mySvgIconColor: $colors.primaryBlue
    &.active:hover
      --mySvgIconColor: $colors.primaryBlueDarken1
  .dashboardWrap_submit button:nth-child(2)
    background: #e6f0ff
    color: $themeColors.active
  .dashboardWrap_note
    margin-top: 24px;
    zoom: 1;
    position: relative
    &_editButton
      position: absolute
      right: 0px
      top: 20px
    .noteEditWrap_post
      margin-top: 0
      &_view,
      &_edit
        height: auto
      &.hideEditor
        height: 210px
        overflow-y: scroll
        .noteEditWrap_post_view
          padding: 24px
  .dashboardWrap_submit
    display: block
    width: 100%
    min-height: 60px
    padding: 9px 20px 24px 20px
    background: #fff
    border-top: 2px solid $colors.lightGrayLighten2
    text-align: center
    display: inline-block
    position: absolute
    bottom: 0
    left: 0
    button
      display: inline-block
      width: 220px
      padding: 10px
      margin: 15px 1.5% 0 1.5%
      border: none
      border-radius: 90px
      cursor: pointer
      font-family: $fontFamilyBody
      font-size: 14px
      line-height: 1
      text-align: center
      &:first-child
        background-color: $themeColors.active
        color: #fff
  .dashboardWrap_detail
    .noteEditWrap_post
      margin-top: 0
      &_view,
      &_edit
        height: calc(100vh - 184px)
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import * as api from '@/lib/api';
import store from '@/store';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';
import { MyChargerInputChangeEvent } from '@/components/MyChargerInput/types';

async function initData(to: Route): Promise<Partial<Pick<NoteColumn, 'isFavorite' | 'note'>>> {
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
    note,
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
  },
})
export default class NoteColumn extends Vue {
  $refs!: {
  };

  note: api.Note | null = null;
  isFavorite = false;
  editDetail: Pick<api.Note, 'subject' | 'body'> | null = null;
  wideScreen = false;
  saving = false;

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
    this.editDetail = {
      subject: this.note!.subject,
      body: this.note!.body || '',
    };
    //    this.$store.mutations.setFullMainColumn(true);
  }

  async endEditDetail(save = false) {
    if (save && this.editDetail) {
      await this.save(this.editDetail);
    }
    this.editDetail = null;
    //     this.$store.mutations.setFullMainColumn(false);
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
    this.$appOn('note-edited', this.onNoteEdited);
    this.$appOn('note-deleted', this.onNoteDeleted);
  }

  beforeDestroy() {
    this.$appOff('note-edited', this.onNoteEdited);
    this.$appOff('note-deleted', this.onNoteDeleted);
  }
}
</script>
