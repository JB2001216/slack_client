<template>
  <sub-column-layout active-tab="note">
    <div class="tab_note">
      <div class="note_menu">
        <div class="note_menu_left">
          <my-svg-icon name="bookmark" class="note_menu_favorite" :class="{active: isFavorite}" @click.prevent="favorite(!isFavorite)" />
        </div>
        <div class="note_menu_right">
          <a
            ref="filterButton"
            class="note_menu_search"
            :class="{active: activeFilter}"
            href="#"
            @click.prevent="showedFilter = !showedFilter"
          >
            <my-svg-icon name="filter" />
            <span class="t-caption">{{ $t('views.notesColumn.filter') }}</span>
          </a>
          <my-simple-menu>
            <template v-slot="{open, close, opened}">
              <a class="note_menu_sort" href="#" @click.stop.prevent="opened ? close() : open()">
                <span class="t-caption">{{ $t(`views.notesColumn.ordering.${currentSort.i18nKey}`) }}</span>
                <my-svg-icon name="pulldown" />
              </a>
            </template>
            <template v-slot:items>
              <li v-for="s in sorts" :key="`${s.field}_${s.type}`" @click="onCurrentSortChange(s)">
                <span>
                  <template v-if="s === currentSort">→</template>
                  {{ $t(`views.notesColumn.ordering.${s.i18nKey}`) }}
                </span>
              </li>
            </template>
          </my-simple-menu>
        </div>
      </div>
      <div class="note_list">
        <template v-if="noteAddable">
          <a v-if="!adding" class="note_add" @click.prevent="onInlineNoteAddStart()">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m22 13h-19.99999v-2h19.99999z" />
              <path d="m11 22v-20.00003h2v20.00003z" />
            </svg>
            {{ $t('views.notesColumn.addANewNote') }}
          </a>
          <div v-if="adding" class="note_add adding">
            <input
              ref="addingNoteSubjectInput"
              v-model="addingNoteSubject"
              class="note_add_input"
              type="text"
              @keydown.esc="adding = false"
              @blur="onInlineNoteAddEnd()"
              @change="$event.target.blur()"
            >
          </div>
        </template>
        <div
          ref="noteListContainer"
          class="noteListContainer"
          :class="{dropHoverRoot: !currentSort.droppableBetween && dragData && dropHover && dropHover.position !== 'child'}"
        >
          <nested-list
            :notes="notes"
            :status-options="statusOptions"
            :fetch-notes="fetchNotes"
            :item-draggable="currentSort.droppableBetween"
            :item-droppable-between="currentSort.droppableBetween"
            :drag-data="dragData"
            :drop-hover="dropHover"
            @drag-data-change="dragData = $event"
            @drop-hover-change="dropHover = $event"
            @drop-note="onDropNote"
            @item-click="onNoteItemClick"
          />
          <infinite-loading :identifier="infiniteId" @infinite="onInfinite" />
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

.note_item
  cursor: pointer
.tab_note
  .note_menu
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

  .noteListContainer
    max-height: calc(100vh - 225px)
    overflow-y: scroll
    position: relative
    &.dropHoverRoot
      outline: solid 3px rgba(125,200,255,0.8)
      outline-offset: -3px
  a.note_add
    cursor: pointer
  .note_add.adding
    padding: 0 20px;
    .note_add_input
      margin: 6px 0
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
import SubColumnLayout from '../SubColumnLayout.vue';
import store from '@/store';
import { StateChanger } from 'vue-infinite-loading';
import FilterForm from './FilterForm.vue';
import NestedList from './NestedList.vue';
import { MyUser, Project, Note, NoteStatus, NotesApi, apiRegistry, NotesGetRequest, NotesNoteIdPriorityPostRequestBody } from '@/lib/api';
import { BasicError } from '@/lib/errors';
import { ProjectStatusCategory } from '@/consts';
import { toSnakeCase } from '@/lib/utils/string-util';
import { NoteWithChilds, DragNoteData, DropNoteData, DropNoteEvent, DropItemPosition, FilterFormValue } from './types';
import { Perm } from '@/lib/permissions';

type SearchScrollType = 'next' | 'prev';
type SearchOrderField = 'priority' | 'limitedAt' | 'status';
type SearchOrderType = 'asc' | 'desc';

interface NotesGetConditions {
  filter: Pick<NotesGetRequest, 'subject' | 'batonUser' | 'writeUser' | 'favorite'>;
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
export default class NotesColumn extends Vue {
  $refs!: {
    addingNoteSubjectInput: HTMLInputElement;
    noteListContainer: HTMLDivElement;
    filterForm: FilterForm;
    filterButton: HTMLAnchorElement;
  };

  sorts: {field: SearchOrderField; type: SearchOrderType; i18nKey: string; droppableBetween: boolean}[] = [
    { field: 'priority', type: 'desc', i18nKey: 'priorityOrder', droppableBetween: true },
    { field: 'status', type: 'asc', i18nKey: 'statusOrder', droppableBetween: false },
  ];

  initialConditions: NotesGetConditions = {
    'filter': {},
    'order': {
      field: this.sorts[0].field,
      type: this.sorts[0].type,
    },
  };

  showedFilter = false;
  filter: FilterFormValue = {};

  conditions = Object.assign({}, this.initialConditions);

  notes: NoteWithChilds[] = [];
  page = 1;
  limit = 30;
  infiniteId = +new Date();

  initialized = false;
  saving = false;
  adding = false;
  addingNoteSubject = '';

  dragData: DragNoteData | null = null;
  dropHover: DropNoteData | null = null;

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

  get noteAddable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.ADD_NOTE);
  }

  get statusOptions() {
    return this.$store.state.activeUser.noteStatusList;
  }

  async fetchNotes(options: { parent?: number; limit?: number; page?: number } = {}) {
    const cond = this.conditions;
    const user = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const notesApi = apiRegistry.load(NotesApi, user.token);
    const req: NotesGetRequest = Object.assign({
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

    return notesApi.notesGet(req);
  }

  async onInfinite($state: StateChanger) {
    try {
      if (this.$refs.noteListContainer) {
        this.$refs.noteListContainer.scrollTop = 0;
      }

      const res = await this.fetchNotes({
        page: this.page,
        limit: this.limit,
      });
      const addNotes = res.results.filter((r) => !this.notes.find((t) => t.id === r.id));
      if (addNotes.length) {
        this.notes.push(...addNotes);
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

  changeCondition(cond: NotesGetConditions) {
    this.conditions = cond;
    this.page = 1;
    this.notes = [];
    this.infiniteId += 1;
  }

  getNoteAddTo(): Location {
    return {
      name: 'note-add',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
      },
    };
  }

  getNoteTo(noteId: number): Location {
    return {
      name: 'note',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
        noteId: noteId.toString(),
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

  onNoteItemClick(ev: MouseEvent, note: Note) {
    if (this.$route.name !== 'note' || this.$route.params['noteId'] !== note.id.toString()) {
      this.$router.push(this.getNoteTo(note.id));
    }
  }

  async onInlineNoteAddStart() {
    if (this.adding || this.saving) return;
    this.addingNoteSubject = '';
    this.adding = true;
    await this.$nextTick();
    this.$refs.addingNoteSubjectInput.focus();
  }

  async onInlineNoteAddEnd() {
    if (!this.adding || this.saving) return;
    if (this.addingNoteSubject.trim() !== '') {
      const myUser = this.$store.state.activeUser.myUser!;
      const projectId = this.$store.getters.activeUser.activeProjectId!;
      const notesApi = apiRegistry.load(NotesApi, myUser.token);
      const statusOptions = this.statusOptions!
        .filter((o) => o.category === ProjectStatusCategory.Progress)
        .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
      try {
        this.saving = true;
        const updatedNote = await notesApi.notesPost({
          spaceId: myUser.space.id,
          projectId,
          notesPostRequestBody: {
            subject: this.addingNoteSubject.trim(),
            status: statusOptions[0].id,
            chargeUsers: [],
            related: [],
          },
        });
        this.$appEmit('note-added', { note: updatedNote });
      } catch (err) {
        this.$appEmit('error', { err });
        return;
      } finally {
        this.saving = false;
      }
    }
    this.adding = false;
  }

  onNoteAdded(ev: { note: Note }) {
    if (!this.notes || ev.note.parent) return;
    if (!this.notes.find((t) => t.id === ev.note.id)) {
      this.notes.unshift(ev.note);
    }
  }

  onNoteEdited(ev: { note: Note }) {
    if (!this.notes) return;
    const index = this.notes.findIndex((t) => t.id === ev.note.id);
    if (index >= 0) {
      this.notes.splice(index, 1, ev.note);
    }
  }

  onNoteDeleted(ev: { noteId: number }) {
    if (!this.notes) return;
    const index = this.notes.findIndex((t) => t.id === ev.noteId);
    if (index >= 0) {
      this.notes.splice(index, 1);
    }
  }


  async onDropNote(ev: DropNoteEvent) {
    if (this.saving) return;

    // 循環参照によるPropの直接変更対策
    this.dragData = null;
    this.dropHover = null;
    await this.$nextTick();

    const dragData = ev.dragData;
    let dropData: {
      note: NoteWithChilds | null;
      noteParent: NoteWithChilds | null;
      position: DropItemPosition;
    } = ev.dropData;
    if (!this.currentSort.droppableBetween && dropData.position !== 'child') {
      dropData = {
        note: null,
        noteParent: null,
        position: 'child',
      };
    }

    if (dragData.note === dropData.note) {
      return;
    }
    if (dropData.position === 'child') {
      if ((dropData.note && dragData.noteParent === dropData.note) ||
          (!dropData.note && !dragData.noteParent)
      ) {
        return;
      }
    }

    // 現在の親グループから脱退
    if (dragData.noteParent) {
      dragData.noteParent.childs!.splice(dragData.noteParent.childs!.indexOf(dragData.note), 1);
      if (!dragData.noteParent.childs!.length) {
        this.$delete(dragData.noteParent, 'childs');
        dragData.noteParent.hasChilds = false;
      }
    } else {
      this.notes!.splice(this.notes!.indexOf(dragData.note), 1);
    }

    const myUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const notesApi = apiRegistry.load(NotesApi, myUser.token);
    const body: NotesNoteIdPriorityPostRequestBody = {};

    // 指定の親グループに加入
    if (dropData.position === 'child') {
      if (dropData.note) {
        if (dropData.note.childs) {
          dropData.note.childs.push(dragData.note);
        } else if (!dropData.note.hasChilds) {
          dropData.note.hasChilds = true;
        }
        body.parent = dropData.note.id;
      } else {
        this.notes.push(dragData.note);
        body.parent = null;
      }

    } else if (dropData.position === 'before') {
      const targetNotes = dropData.noteParent ? dropData.noteParent.childs! : this.notes;
      targetNotes.splice(targetNotes.indexOf(dropData.note!), 0, dragData.note);
      body.parent = dropData.note!.parent;
      body.nextHighestNote = dropData.note!.id;

    } else if (dropData.position === 'after') {
      const targetNotes = dropData.noteParent ? dropData.noteParent.childs! : this.notes;
      targetNotes.push(dragData.note);
      body.parent = dropData.note!.parent;
      body.nextHighestNote = null;
    }

    try {
      this.saving = true;
      await notesApi.notesNoteIdPriorityPost({
        spaceId: myUser.space.id,
        projectId,
        noteId: dragData.note.id,
        notesNoteIdPriorityPostRequestBody: body,
      });
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  async init(to: Route, from: Route) {
    if (to.name === 'notes' || !from || from.params.projectId !== to.params.projectId) {
      await this.$store.actions.activeUser.fetchNoteStatus();
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
    this.$appOn('note-added', this.onNoteAdded);
    this.$appOn('note-edited', this.onNoteEdited);
    this.$appOn('note-deleted', this.onNoteDeleted);
    window.addEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  beforeDestroy() {
    this.$appOff('note-added', this.onNoteAdded);
    this.$appOff('note-edited', this.onNoteEdited);
    this.$appOff('note-deleted', this.onNoteDeleted);
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
