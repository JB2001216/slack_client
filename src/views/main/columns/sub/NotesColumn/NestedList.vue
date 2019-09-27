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
      :draggable="allNoteUpdatable"
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
        :class="{dropHover: dropHover && dropHover.position === 'child' && dropHover.note === t}"
        @click.stop="onItemClick($event, t)"
        @dragenter.stop.prevent="onItemDragEnter($event, t)"
        @dragleave.stop.prevent="onItemDragLeave($event, t)"
        @dragover.stop.prevent="$event.dataTransfer.dropEffect = 'move'"
        @drop.stop.prevent="onItemDrop($event, t)"
      >
        <template v-if="t.hasChilds">
          <span v-if="t.childs && t.childs.length" @click.stop="onContractChilds(t)">▼</span>
          <span v-else @click.stop="onExpandChilds(t)">＞</span>
        </template>
        <div class="note_item_image">
          <img src="~@/assets/images/subColumn/note_user.svg" alt="">
        </div>
        <template v-if="!editingNote || editingNote.id !== t.id">
          <div class="note_item_name" @dblclick="onInlineNoteEditStart(t)">{{t.subject}}</div>
          <a v-if="noteAddable" class="note_item_add" href="#" @click.stop.prevent="onInlineNoteAddStart(t)" />
          <my-project-status class="note_item_status status status_1" :option="getStatusOption(t.status)" />
        </template>
        <template v-else>
          <input
            ref="editingNoteSubjectInputs"
            class="note_edit_input"
            type="text"
            v-model="editingNoteSubject"
            @keydown.esc="editingNote = null"
            @blur="onInlineNoteEditEnd()"
            @change="$event.target.blur()">
        </template>
      </div>
      <div v-if="noteAddable && addingParentNote && addingParentNote.id === t.id" class="nestedList_add_item">
        <input
          ref="addingNoteSubjectInputs"
          type="text"
          v-model="addingNoteSubject"
          @keydown.esc="addingParentNote = null"
          @blur="onInlineNoteAddEnd()"
          @change="$event.target.blur()">
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
        @drag-data-change="emitDragDataChange($event)"
        :drop-hover="dropHover"
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
    padding-left: 5px
    background: transparent
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  MyUser, Project, Note, NoteStatus, NotesApi, apiRegistry,
  NotesGetResponse, NotesPostRequestBody, NotesNoteIdPatchRequestBody,
} from '@/lib/api';
import { NoteWithChilds, DragNoteData, DropNoteData, DropNoteEvent } from './types';
import { ProjectStatusCategory } from '@/consts';
import { Perm } from '@/lib/permissions';

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

  saving = false;
  addingParentNote: NoteWithChilds | null = null;
  addingNoteSubject = '';
  editingNote: NoteWithChilds | null = null;
  editingNoteSubject = '';

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get myPerms() {
    return this.$store.getters.activeUser.activeProjectMyPerms!;
  }

  get noteAddable() {
    return this.myPerms.includes(Perm.ADD_TASK);
  }

  get allNoteUpdatable() {
    return this.myPerms.includes(Perm.UPDATE_ALL_TASK);
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

  async addNote(requestBody: NotesPostRequestBody) {
    const loginUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const notesApi = apiRegistry.load(NotesApi, loginUser.token);
    return notesApi.notesPost({
      spaceId: loginUser.space.id,
      projectId,
      notesPostRequestBody: requestBody,
    });
  }

  async patchNote(noteId: number, requestBody: NotesNoteIdPatchRequestBody) {
    const loginUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const notesApi = apiRegistry.load(NotesApi, loginUser.token);
    return notesApi.notesNoteIdPatch({
      spaceId: loginUser.space.id,
      projectId,
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
      try {
        this.saving = true;
        const statusOptions = this.statusOptions!
          .filter((o) => o.category === ProjectStatusCategory.Progress)
          .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
        const addedNote = await this.addNote({
          parent: this.addingParentNote.id,
          subject: this.addingNoteSubject.trim(),
          status: statusOptions[0].id,
          chargeUsers: [],
        });
        this.$appEmit('note-added', { note: addedNote });
        if (!this.addingParentNote.childs || !this.addingParentNote.childs.length) {
          await this.onExpandChilds(this.addingParentNote);
        }

      } catch (err) {
        this.$appEmit('error', { err });
        return;
      } finally {
        this.saving = false;
      }
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

  async onInlineNoteEditEnd() {
    if (!this.editingNote || this.saving) return;
    if (this.editingNoteSubject.trim() !== '') {
      try {
        this.saving = true;
        const updatedNote = await this.patchNote(this.editingNote.id, {
          subject: this.editingNoteSubject.trim(),
        });
        this.$appEmit('note-edited', { note: updatedNote });
      } catch (err) {
        this.$appEmit('error', { err });
        return;
      } finally {
        this.saving = false;
      }
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
        return;
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

  onNoteAdded(ev: { note: Note }) {
    if (!ev.note.parent) return;

    const parentNote = this.notes.find((t) => t.id === ev.note.parent);
    if (!parentNote || !parentNote.childs || !parentNote.childs) return;

    if (!parentNote.childs.find((t) => t.id === ev.note.id)) {
      parentNote.childs.unshift(ev.note);
    }
  }

  onNoteEdited(ev: { note: Note }) {
    if (!ev.note.parent) return;

    const parentNote = this.notes.find((t) => t.id === ev.note.parent);
    if (!parentNote || !parentNote.childs || !parentNote.childs) return;

    const index = parentNote.childs.findIndex((t) => t.id === ev.note.id);
    if (index >= 0) {
      parentNote.childs.splice(index, 1, ev.note);
    }
  }

  onNoteDeleted(ev: { noteId: number }) {
    this.notes.forEach((parent) => {
      if (parent.childs) {
        const index = parent.childs.findIndex((t) => t.id === ev.noteId);
        if (index >= 0) {
          parent.childs.splice(index, 1);
          if (!parent.childs.length) {
            this.$delete(parent, 'childs');
            parent.hasChilds = false;
          }
        }
      }
    });
  }

  beforeMount() {
    this.$appOn('note-added', this.onNoteAdded);
    this.$appOn('note-edited', this.onNoteEdited);
    this.$appOn('note-deleted', this.onNoteDeleted);
  }

  beforeDestroy() {
    this.$appOff('note-added', this.onNoteAdded);
    this.$appOff('note-edited', this.onNoteEdited);
    this.$appOff('note-deleted', this.onNoteDeleted);
  }
}
</script>
