<template>
  <div v-if="note" class="noteColumn_noteLinkViewer">
    <div class="noteColumn_noteLinkViewer_header">
      <div class="noteColumn_noteLinkViewer_header_subject">
        {{ note.subject }}
      </div>
      <div class="noteColumn_noteLinkViewer_header_bottom">
        <div class="noteColumn_noteLinkViewer_header_bottom_toolbar">
          <my-svg-icon name="pen" @click="onEditClick" />
        </div>
        <div class="noteColumn_noteLinkViewer_header_bottom_info">
          <div class="noteColumn_noteLinkViewer_header_bottom_info_status">
            {{ $t('views.noteColumn.status') }}：<my-project-status class="noteColumn_noteLinkViewer_header_bottom_info_value" :option="statusOption" />
          </div>
          <my-space-user
            v-if="note.batonUser"
            v-slot="{user}"
            tag="div"
            :user-id="note.batonUser"
            class="noteColumn_noteLinkViewer_header_bottom_info_batonUser"
          >
            <template v-if="user">
              {{ $t('views.noteColumn.baton') }}：<span class="noteColumn_noteLinkViewer_header_bottom_info_value">{{ user.displayName || user.account }}</span>
            </template>
          </my-space-user>
          <div class="noteColumn_noteLinkViewer_header_bottom_info_updatedAt">
            {{ $t('views.noteColumn.lastUpdated') }}：<span class="noteColumn_noteLinkViewer_header_bottom_info_value">{{ note.updatedAt | dateFormat('YYYY/M/D') }}</span>
          </div>
        </div>
      </div>
    </div>
    <my-markdown-editor
      v-model="note.body"
      class="noteColumn_noteLinkViewer_content"
      :preview-placeholder="$t('views.noteColumn.detailsAreEmpty')"
      hide-editor
      enabled-note-link
      :my-user="myUser"
      :project-id="projectId"
      @note-link-click="onNoteLinkClick"
    />
  </div>
</template>


<style lang="stylus">
@import '../../../../../stylus/_settings'

.noteColumn_noteLinkViewer
  display: grid
  grid-template-rows: 96px 1fr
  height: 100%
  &_header
    padding: 20px
    &_subject
      font-size: 18px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
    &_bottom
      margin-top: 16px
      &_info
        display: flex
        flex-wrap: nowrap
        font-size: 12px
        padding-right: 16px
        > *
          white-space: nowrap
        > *:not(:first-child)
          margin-left: 14px
        &_value
          display: inline-block
          max-width: 100px
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: top
        &_status
          .myProjectStatus
            display: inline-block
            font-size: 12px
      &_toolbar
        float: right
        .mySvgIcon
          cursor: pointer
          --mySvgIconSize: 19px;
          --mySvgIconColor: $themeColors.icon
          &:hover
            --mySvgIconColor: $themeColors.iconDarken1
  &_content
    border-top: solid 1px $colors.lightGrayLighten2
    .markdownEditor_preview
      height: 100%
      overflow-y: scroll
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Note, NoteSummary, NoteStatus, NotesApi, apiRegistry } from '@/lib/api';
import { LoggedInUser } from '@/store/root';

@Component
export default class NoteLinkViewer extends Vue {
  /** noteId */
  @Prop({ type: Number, required: true })
  value!: number;

  @Prop({ required: true })
  statusOptions!: NoteStatus[];

  @Prop({ required: true })
  myUser!: LoggedInUser;

  @Prop({ required: true })
  projectId!: number;

  note: Note | null = null;

  get statusOption() {
    const note = this.note;
    if (!note || !note.status || !this.statusOptions) {
      return null;
    }
    return this.statusOptions.find((o) => o.id === note.status) || null;
  }

  async fetchNote() {
    const notesApi = apiRegistry.load(NotesApi, this.myUser.token);
    this.note = await notesApi.notesNoteIdGet({
      spaceId: this.myUser.space.id,
      projectId: this.projectId,
      noteId: this.value,
    });
  }

  onNoteLinkClick(note: NoteSummary) {
    this.$emit('input', note.id);
  }

  onEditClick() {
    if (this.note) {
      this.$emit('note-edit', this.note);
    }
  }

  @Watch('value')
  async onValueChange() {
    await this.fetchNote();
  }

  async beforeMount() {
    await this.fetchNote();
  }
}
</script>
