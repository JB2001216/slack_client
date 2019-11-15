<template>
  <div class="nestedList">
    <div
      v-for="(t,i) in notes"
      :key="t.id"
      class="note_itemContaner"
      :class="{
        dragging: dragData,
        dragCurrent: dragData && dragData.note === t,
      }"
      :draggable="allNoteUpdatable && itemDraggable"
      @dragstart.stop="onItemDragStart($event, t)"
      @dragend.stop.prevent="onItemDragEnd($event, t)"
    >
      <div
        v-if="dragData && t !== dragData.note && (i<=0 || (i>0 && notes[i-1] !== dragData.note))"
        class="note_item_top"
        :class="{
          dropHover: dropHover && dropHover.position === 'before' && dropHover.note === t,
          between: itemDroppableBetween,
        }"
        @dragenter.stop.prevent="onItemDragEnterTop($event, t)"
        @dragleave.stop.prevent="onItemDragLeaveTop($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDropTop($event, t)"
      >
        <div class="note_item_top_line" />
      </div>
      <div
        v-if="dragData && t !== dragData.note && i === notes.length - 1"
        class="note_item_bottom"
        :class="{
          dropHover: dropHover && dropHover.position === 'after' && dropHover.note === t,
          between: itemDroppableBetween,
        }"
        @dragenter.stop.prevent="onItemDragEnterBottom($event, t)"
        @dragleave.stop.prevent="onItemDragLeaveBottom($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDropBottom($event, t)"
      >
        <div class="note_item_bottom_line" />
      </div>
      <div
        class="note_item"
        :class="{
          active: t.id === activeNoteId,
        }"
        @click.stop="onItemClick($event, t)"
      >
        <div class="note_item_accordionIcon">
          <template v-if="t.hasChilds">
            <img v-if="t.childs && t.childs.length" src="~@/assets/images/icn/accordion-expand.svg" @click.stop="onContractChilds(t)">
            <img v-else src="~@/assets/images/icn/accordion-collapse.svg" @click.stop="onExpandChilds(t)">
          </template>
        </div>
        <my-space-user v-slot="{user}" tag="div" class="note_item_image" :user-id="t.batonUser">
          <my-space-user-avatar :user="user" :size="24" shape="circle" />
        </my-space-user>
        <template v-if="!editingNote || editingNote.id !== t.id">
          <div class="note_item_name" @dblclick="onInlineNoteEditStart(t)">
            {{ t.subject }}
          </div>
          <a v-if="noteAddable" class="note_item_add" href="#" @click.stop.prevent="onInlineNoteAddStart(t)">
            <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 13h-19.99999v-2h19.99999z" /><path d="m11 22v-20.00003h2v20.00003z" /></svg>
          </a>
          <my-project-status :option="getStatusOption(t.status)" />
        </template>
        <template v-else>
          <input
            ref="editingNoteSubjectInputs"
            v-model="editingNoteSubject"
            class="note_edit_input"
            type="text"
            @keydown.esc="editingNote = null"
            @blur="onInlineNoteEditEnd()"
            @change="$event.target.blur()"
          >
        </template>
      </div>
      <div v-if="noteAddable && addingParentNote && addingParentNote.id === t.id" class="nestedList_add_item">
        <input
          ref="addingNoteSubjectInputs"
          v-model="addingNoteSubject"
          type="text"
          @keydown.esc="addingParentNote = null"
          @blur="onInlineNoteAddEnd()"
          @change="$event.target.blur()"
        >
      </div>
      <nested-list
        v-if="t.hasChilds && t.childs && t.childs.length"
        :parent-note="t"
        :notes="t.childs"
        :status-options="statusOptions"
        :fetch-notes="fetchNotes"
        :item-draggable="itemDraggable"
        :item-droppable-between="itemDroppableBetween"
        :drag-data="dragData"
        :drop-hover="dropHover"
        :added-child-note="addedChildNote"
        @drag-data-change="emitDragDataChange($event)"
        @drop-hover-change="emitDropHoverChange($event)"
        @drop-note="emitDropNote($event)"
        @item-click="onItemClick"
      />
    </div>
  </div>
</template>


<style lang="stylus">
.nestedList
  .note_itemContaner
    position: relative
    padding-top: 1px
    &.dragging
      .note_item,
      .note_item_top,
      .note_item_bottom
        *
          pointer-events: none
    &.dragCurrent
      .note_item
        background: rgba(0,0,0,0.1)
        opacity: 0.3
  .note_item
    cursor: pointer
    padding-left: 4px
    background: transparent
    &_accordionIcon
      width: 10px
      text-align: center
      margin-left: 1px
      margin-right: 5px
    .note_item_date
      font-size: 12px
      .myDateRangeInput_view_icon
        width: 19px
        height: 19px
    .note_item_date.disabled
      display: none
    &:not(:hover)
      .note_item_date
        .myDateRangeInput_view_icon
          opacity: 0
    .note_edit_input
      padding: 5px
      width: calc(100% - 30px)
      box-sizing: border-box
    &.dropHover
      background: rgba(125,200,255,0.5)

  .note_item_top,
  .note_item_bottom
    position: absolute
    z-index: 1
    left: 0
    right: 0
    height: 20px
    &_line
      height: 4px
      width: 100%
    &.dropHover.between
      .note_item_top_line,
      .note_item_bottom_line
        background: rgba(125,200,255,0.5)
  .note_item_top
    top: -7px
    &_line
      margin-top: 5px
  .note_item_bottom
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
  MyUser, Project, Note, NoteStatus, NotesApi, apiRegistry,
  NotesGetResponse, NotesPostRequestBody, NotesNoteIdPatchRequestBody,
} from '@/lib/api';
import { NoteWithChilds, DragNoteData, DropNoteData, DropNoteEvent } from './types';
import { ProjectStatusCategory } from '@/consts';
import { Perm } from '@/lib/permissions';
import EventsSub from '@/events-subscription';

@Component({
  name: 'nested-list',
})
export default class NestedList extends Vue {

  $refs!: {
    addingNoteSubjectInputs: HTMLInputElement[];
    editingNoteSubjectInputs: HTMLInputElement[];
  };

  @Prop({ default: null })
  parentNote!: NoteWithChilds | null;

  @Prop({ required: true })
  notes!: NoteWithChilds[];

  @Prop({ required: true })
  statusOptions!: NoteStatus[];

  @Prop({ required: true })
  fetchNotes!: (options: { parent?: number; limit?: number; page?: number }) => Promise<NotesGetResponse>;

  @Prop({ type: Boolean, default: false })
  itemDraggable!: boolean;

  @Prop({ type: Boolean, default: false })
  itemDroppableBetween!: boolean;

  @Prop({ default: null })
  dragData: DragNoteData | null = null;

  @Prop({ default: null })
  dropHover: DropNoteData | null = null;

  @Prop({ default: null })
  addedChildNote!: Note | null;

  saving = false;
  addingParentNote: NoteWithChilds | null = null;
  addingNoteSubject = '';
  editingNote: NoteWithChilds | null = null;
  editingNoteSubject = '';

  isDebug: boolean = true;

  addedChildNoteId: number | null = null;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get activeProjectId() {
    return this.$store.getters.activeUser.activeProjectId!;
  }

  get api() {
    return apiRegistry.load(NotesApi, this.myUser.token);
  }

  get myPerms() {
    return this.$store.getters.activeUser.activeProjectMyPerms!;
  }

  get noteAddable() {
    return this.myPerms.includes(Perm.ADD_NOTE);
  }

  get allNoteUpdatable() {
    return this.myPerms.includes(Perm.UPDATE_ALL_NOTE);
  }

  get activeNoteId() {
    if (this.$route.name === 'note') {
      return parseInt(this.$route.params.noteId);
    }
    return null;
  }

  created(): void {
    EventsSub.source.addEventListener('updateNote', this.updateNote);
    EventsSub.source.addEventListener('deleteNote', this.deleteNote);
  }

  @Watch('addedChildNote')
  onAddChildNote(note: this['addedChildNote']): void {

    if (!note) { return; }

    const childNote = this.notes.find((t) => t.parent === note.parent);
    if (childNote) { this.notes.unshift(note!); }

    const parentNote = this.notes.find((t) => t.id === note.parent);
    if (parentNote) {
      parentNote.hasChilds = true;
      if (note.id === this.activeNoteId) {
        this.onExpandChilds(parentNote);
      }
    }

  }

  updateNote(e: any): void {

    const data = JSON.parse(e.data);
    const index = this.notes.findIndex((n) => n.id === data.params.noteId);

    if (index >= 0) {

      this.getNote(data)
        .then((note: Note) => {

          this.notes[index] = Object.assign(this.notes[index], note);

          if (this.isDebug) { console.log('updateNote(column): ' + note.subject); }

        }).catch((err) => {
          this.$appEmit('error', { err });
        });

    }

  }

  async deleteNote(e: any): Promise<void> {

    const data = JSON.parse(e.data);
    const index = this.notes.findIndex((n) => n.id === data.params.noteId);

    if (index >= 0) {

      const isFireUser = data.userId === this.myUser.id;
      const note = this.notes[index];
      const isActiveNote = note.id === this.activeNoteId;
      let isActiveTree = false;

      if (!isFireUser && !isActiveNote && (this.activeNoteId || this.activeNoteId === 0)) {
        await this.getNote({
          spaceId: this.myUser.space.id,
          params: { projectId: this.activeProjectId, noteId: this.activeNoteId },
        }).catch((err) => {
          if (err.status === 404) { isActiveTree = true; }
        });
      }

      this.notes.splice(index, 1);

      if (this.isDebug) { console.log('deleteNote: ' + note.subject); }

      if (!this.notes.length && this.parentNote) { this.parentNote.hasChilds = false; }

      if (isFireUser || isActiveNote || isActiveTree) {

        if (this.notes.length || this.parentNote) {

          const noteId: number = this.notes.length ? this.notes[index ? (index - 1) : 0].id : this.parentNote!.id;

          this.$router.push({
            name: 'note',
            params: { projectId: this.activeProjectId + '', userId: this.myUser.id + '', noteId: noteId + '' },
          });

        } else {

          this.$router.push({
            name: 'project',
            params: { projectId: this.activeProjectId + '', userId: this.myUser.id + '' },
          });

        }

      }

      if (isFireUser) {
        this.$flash(this.$t('notifications.note.deleted', { noteName: note.subject }).toString(), 'success');
      } else if (isActiveNote || isActiveTree) {
        this.$flash(this.$t('notifications.note.noLongerAvailable', { noteName: note.subject }).toString(), 'success');
      }

    }

  }

  getNote(data: any): Promise<Note> {
    return this.api.notesNoteIdGet({
      spaceId: data.spaceId,
      projectId: data.params.projectId,
      noteId: data.params.noteId,
    });
  }

  getNoteUpdatable(note: Note) {
    return this.$store.getters.activeUser.noteUpdatable(note);
  }

  getStatusOption(optionId: number | null) {
    if (!optionId || !this.statusOptions) {
      return null;
    }
    return this.statusOptions.find((o) => o.id === optionId) || null;
  }

  // async addNote(requestBody: NotesPostRequestBody) {
  //   const loginUser = this.$store.state.activeUser.myUser!;
  //   const projectId = this.$store.getters.activeUser.activeProjectId!;
  //   const notesApi = apiRegistry.load(NotesApi, loginUser.token);
  //   return notesApi.notesPost({
  //     spaceId: loginUser.space.id,
  //     projectId,
  //     notesPostRequestBody: requestBody,
  //   });
  // }

  async patchNote(noteId: number, requestBody: NotesNoteIdPatchRequestBody) {
    return this.api.notesNoteIdPatch({
      spaceId: this.myUser.space.id,
      projectId: this.activeProjectId,
      noteId,
      notesNoteIdPatchRequestBody: requestBody,
    });
  }

  async onInlineNoteAddStart(parent: Note) {
    if (this.addingParentNote || this.saving) return;
    this.addingParentNote = parent;
    this.addingNoteSubject = '';
    await this.$nextTick();
    this.$refs.addingNoteSubjectInputs[0].focus();
  }

  async onInlineNoteAddEnd() {

    if (!this.addingParentNote || this.saving) return;

    if (this.addingNoteSubject.trim() !== '') {

      this.saving = true;

      const statusOptions = this.statusOptions!
        .filter((o) => o.category === ProjectStatusCategory.Progress)
        .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);

      this.api.notesPost({
        spaceId: this.myUser.space.id,
        projectId: this.activeProjectId,
        notesPostRequestBody: {
          parent: this.addingParentNote.id,
          subject: this.addingNoteSubject.trim(),
          status: statusOptions[0].id,
          chargeUsers: [],
        },
      }).catch((err) => {
        this.$appEmit('error', { err });
      }).finally(() => {
        this.saving = false;
      });

    }

    this.addingParentNote = null;

  }

  async onInlineNoteEditStart(note: Note) {
    if (!this.getNoteUpdatable(note) || this.editingNote || this.saving) return;
    this.editingNote = note;
    this.editingNoteSubject = note.subject;
    await this.$nextTick();
    this.$refs.editingNoteSubjectInputs[0].focus();
  }

  onInlineNoteEditEnd(): void {

    if (!this.editingNote || this.saving) return;

    if (this.editingNoteSubject.trim() !== '') {

      this.saving = true;

      this.patchNote(this.editingNote.id, {
        subject: this.editingNoteSubject.trim(),
      }).catch((err) => {
        this.$appEmit('error', { err });
      }).finally(() => {
        this.saving = false;
      });

    }

    this.editingNote = null;

  }

  async onDateRangeChange(note: Note, range: {start: Date; end: Date} | null) {
    // if (this.saving) {
    //   return;
    // }
    // try {
    //   this.saving = true;
    //   const updatedNote = await this.patchNote(note.id, {
    //     startedAt: range ? range.start : (null as any),
    //     limitedAt: range ? range.end : (null as any),
    //   });
    //   this.$appEmit('note-edited', { note: updatedNote });
    // } catch (err) {
    //   this.$appEmit('error', { err });
    // }
    // this.saving = false;
  }

  async onExpandChilds(note: NoteWithChilds) {
    try {
      const res = await this.fetchNotes({ parent: note.id, limit: 500 });
      if (res.count <= 0) {
        note.hasChilds = false;
      } else if (!note.hasChilds) {
        note.hasChilds = true;
      }
      this.$set(note, 'childs', res.results);
    } catch (err) {
      this.$appEmit('error', { err });
    }
  }

  async onContractChilds(note: NoteWithChilds) {
    this.$delete(note, 'childs');
  }

  onItemClick(ev: MouseEvent, note: NoteWithChilds) {
    this.$emit('item-click', ev, note);
  }

  emitDragDataChange(value: this['dragData']) {
    this.$emit('drag-data-change', value);
  }

  emitDropHoverChange(value: this['dropHover']) {
    this.$emit('drop-hover-change', value);
  }

  emitDropNote(value: DropNoteEvent) {
    this.$emit('drop-note', value);
  }

  onItemDragStart(ev: DragEvent, note: NoteWithChilds) {
    ev.dataTransfer!.effectAllowed = 'move';
    this.emitDragDataChange({
      note,
      noteParent: this.parentNote,
    });
    this.emitDropHoverChange(null);
  }

  onItemDragEnter(ev: DragEvent, note: NoteWithChilds) {
    this.emitDropHoverChange(this.dragData!.note === note ? null : {
      note,
      noteParent: this.parentNote,
      position: 'child',
    });
  }

  onItemDragLeave(ev: DragEvent, note: NoteWithChilds) {
    if (this.dropHover && this.dropHover.position === 'child' && this.dropHover.note === note) {
      this.emitDropHoverChange(null);
    }
  }

  onItemDragEnd(ev: DragEvent, note: NoteWithChilds) {
    this.emitDragDataChange(null);
    this.emitDropHoverChange(null);
  }

  onItemDrop(ev: DragEvent, note: NoteWithChilds) {
    this.emitDropNote({
      dragData: this.dragData!,
      dropData: {
        note,
        noteParent: this.parentNote,
        position: 'child',
      },
    });
  }

  onItemDragEnterTop(ev: DragEvent, note: NoteWithChilds) {
    this.emitDropHoverChange(this.dragData!.note === note ? null : {
      note,
      noteParent: this.parentNote,
      position: 'before',
    });
  }

  onItemDragLeaveTop(ev: DragEvent, note: NoteWithChilds) {
    if (this.dropHover && this.dropHover.position === 'before' && this.dropHover.note === note) {
      this.emitDropHoverChange(null);
    }
  }

  onItemDropTop(ev: DragEvent, note: NoteWithChilds) {
    this.emitDropNote({
      dragData: this.dragData!,
      dropData: {
        note,
        noteParent: this.parentNote,
        position: 'before',
      },
    });
  }

  onItemDragEnterBottom(ev: DragEvent, note: NoteWithChilds) {
    this.emitDropHoverChange(this.dragData!.note === note ? null : {
      note,
      noteParent: this.parentNote,
      position: 'after',
    });
  }

  onItemDragLeaveBottom(ev: DragEvent, note: NoteWithChilds) {
    if (this.dropHover && this.dropHover.position === 'after' && this.dropHover.note === note) {
      this.emitDropHoverChange(null);
    }
  }

  onItemDropBottom(ev: DragEvent, note: NoteWithChilds) {
    this.emitDropNote({
      dragData: this.dragData!,
      dropData: {
        note,
        noteParent: this.parentNote,
        position: 'after',
      },
    });
  }

  destroyed() {
    EventsSub.source.removeEventListener('updateNote', this.updateNote);
    EventsSub.source.removeEventListener('deleteNote', this.deleteNote);
  }

}
</script>
