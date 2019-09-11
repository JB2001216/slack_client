<template>
  <div class="mainColumn noteColumn" :class="{fullMainColumn}" v-if="note">
    <div class="mainColumn_head columnTitle">
      <h2>
        <input v-if="editMode" v-model="note.subject" type="text" style="background:none;">
        <span v-else>{{note.subject}}</span>
        <a v-if="!isAdd && !editMode" href="" class="edit" @click.prevent="editMode = true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1501 0.333313C10.9705 0.333313 10.7908 0.401712 10.6539 0.538905L9.45605 1.73682L12.263 4.54384L13.4609 3.34592C13.7353 3.07154 13.7353 2.62728 13.4609 2.3536L11.6463 0.538905C11.5091 0.401712 11.3297 0.333313 11.1501 0.333313ZM8.40343 2.78945L0.333374 10.8596V13.6666H3.14035L11.2104 5.59647L8.40343 2.78945Z" fill="#333333"/>
          </svg>
        </a>
      </h2>

      <div class="search">
        <input type="search" :placeholder="$t('common.filterByKeyword')">
        <button class="search_button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.607 0.666656C3.78223 0.666656 0.666748 3.78213 0.666748 7.60691C0.666748 11.4317 3.78223 14.5472 7.607 14.5472C9.27024 14.5472 10.7977 13.9565 11.9948 12.9761L16.1386 17.1199C16.2026 17.1865 16.2792 17.2397 16.3639 17.2764C16.4487 17.313 16.5399 17.3323 16.6323 17.3333C16.7246 17.3342 16.8162 17.3167 16.9017 17.2818C16.9872 17.2469 17.0648 17.1953 17.1301 17.13C17.1954 17.0647 17.247 16.9871 17.2819 16.9016C17.3168 16.8161 17.3343 16.7245 17.3334 16.6322C17.3324 16.5398 17.3131 16.4486 17.2765 16.3639C17.2398 16.2791 17.1866 16.2025 17.12 16.1385L12.9762 11.9947C13.9566 10.7976 14.5473 9.27015 14.5473 7.60691C14.5473 3.78213 11.4318 0.666656 7.607 0.666656ZM7.607 2.05471C10.6816 2.05471 13.1592 4.53229 13.1592 7.60691C13.1592 10.6815 10.6816 13.1591 7.607 13.1591C4.53238 13.1591 2.0548 10.6815 2.0548 7.60691C2.0548 4.53229 4.53238 2.05471 7.607 2.05471Z" fill="#C4C4C4"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="mainColumn_body">
      <div class="noteEditWrap">
        <div class="noteEditWrap_list">
          <dl class="noteEditWrap_list_user">
            <dd class="active">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#6FCF97"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#56CCF2"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#4F9589"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#DE6868"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#BB6BD9"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd class="dots">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.61537 12.3077C6.61537 13.5822 5.58219 14.6154 4.30769 14.6154C3.03319 14.6154 2 13.5822 2 12.3077C2 11.0332 3.03319 10 4.30769 10C5.58219 10 6.61537 11.0332 6.61537 12.3077ZM14.3078 12.3077C14.3078 13.5822 13.2746 14.6154 12.0001 14.6154C10.7256 14.6154 9.69242 13.5822 9.69242 12.3077C9.69242 11.0332 10.7256 10 12.0001 10C13.2746 10 14.3078 11.0332 14.3078 12.3077ZM19.6924 14.6154C20.9669 14.6154 22.0001 13.5822 22.0001 12.3077C22.0001 11.0332 20.9669 10 19.6924 10C18.4179 10 17.3847 11.0332 17.3847 12.3077C17.3847 13.5822 18.4179 14.6154 19.6924 14.6154Z" fill="#333333"/>
              </svg>
            </dd>
          </dl>
          <dl v-if="!editMode" class="noteEditWrap_list_menu">
            <dd>
              <svg @click="favorite(!isFavorite)" class="favoriteIcon" :class="{active: isFavorite}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.5L14.3574 8.75532H21.9861L15.8143 13.2394L18.1717 20.4947L12 16.0106L5.82825 20.4947L8.18565 13.2394L2.01391 8.75532H9.6426L12 1.5Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
            <!-- <dd>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4161 1.50552C16.0844 1.56935 14.8038 2.15025 13.8139 3.13969L9.93066 7.02087C10.5406 6.40805 12.8047 6.82936 13.354 7.37834L15.7044 5.02921C16.2249 4.50896 16.8764 4.18978 17.5438 4.16105C17.9973 4.13871 18.6391 4.23447 19.2044 4.79941C19.7313 5.32604 19.8431 5.93886 19.8431 6.35698C19.8431 7.05598 19.5237 7.75178 18.9745 8.29757L14.8869 12.4085C13.8586 13.4363 12.2938 13.5193 11.3869 12.6128C10.8695 12.0958 10.0169 12.0926 9.49635 12.6128C8.97582 13.1331 8.97582 13.9821 9.49635 14.5023C10.4288 15.4343 11.6551 15.9067 12.9197 15.9067C14.2865 15.9067 15.682 15.3481 16.7518 14.2725L20.865 10.1871C21.9092 9.14657 22.5 7.75497 22.5 6.35698C22.5 5.05794 22.0082 3.82273 21.0949 2.90989C20.1177 1.93321 18.8052 1.44168 17.4161 1.50552ZM11.0803 8.09329C9.7135 8.09329 8.29562 8.65504 7.22263 9.72747L3.13504 13.8129C2.09078 14.8534 1.5 16.245 1.5 17.643C1.5 18.9421 1.99179 20.1773 2.90511 21.0901C3.8823 22.0668 5.1948 22.5583 6.58394 22.4945C7.9156 22.4307 9.19617 21.8498 10.1861 20.8603L14.0693 16.9791C13.4562 17.592 11.1953 17.1706 10.646 16.6217L8.29562 18.9708C7.77509 19.491 7.12363 19.807 6.4562 19.8389C6.00274 19.8613 5.36086 19.7655 4.79562 19.2006C4.2687 18.674 4.15693 18.0579 4.15693 17.643C4.15693 16.944 4.47628 16.2482 5.02555 15.7024L9.11314 11.5915C10.1414 10.5637 11.7062 10.4839 12.6131 11.3872C13.1337 11.9074 13.9863 11.9074 14.5036 11.3872C15.0242 10.8669 15.0242 10.0179 14.5036 9.49767C13.5712 8.56567 12.3417 8.09329 11.0803 8.09329Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
            <dd>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5V18.3H3.6V3.6H18.3V1.5H1.5ZM5.7 5.7V22.5H22.5V5.7H5.7ZM7.8 7.8H20.4V20.4H7.8V7.8Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd> -->
            <dd>
              <svg @click="destroy()" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.9375 1.5L8.90625 2.55H3.75V4.65H20.25V2.55H15.0938L14.0625 1.5H9.9375ZM4.78125 6.75V20.4C4.78125 21.555 5.70938 22.5 6.84375 22.5H17.1562C18.2906 22.5 19.2188 21.555 19.2188 20.4V6.75H4.78125ZM7.875 8.85H9.9375V20.4H7.875V8.85ZM14.0625 8.85H16.125V20.4H14.0625V8.85Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
          </dl>
        </div>
        <my-project-status-input
          v-model="note.status"
          :options="statusOptions"
          :disabled="!editMode"
        />
        <my-markdown-editor
          v-model="note.body"
          class="noteEditWrap_post"
          editor-class="noteEditWrap_post_edit"
          preview-class="noteEditWrap_post_view"
          :hide-editor="!editMode"
        />
        <div class="noteEditWrap_submit">
          <button v-if="editMode" @click="save()">{{$t('views.noteColumn.save')}}</button>
          <button v-if="fullMainColumn" @click="setFullMainColumn(false)" class="noteEditWrap_submit_changePreview">{{$t('views.noteColumn.exitWideScreen')}}</button>
          <button v-else @click="setFullMainColumn(true)" class="noteEditWrap_submit_changePreview">{{$t('views.noteColumn.enterWideScreen')}}</button>
          <button v-if="editMode"><svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.87825 8.65579V7.77579C2.87825 7.54112 2.88892 7.34379 2.91026 7.18379C2.94226 7.01312 2.99026 6.86379 3.05426 6.73579C3.12892 6.59712 3.21959 6.46912 3.32625 6.35179C3.44359 6.22379 3.58226 6.07446 3.74225 5.90379L4.97426 4.65579C5.24092 4.38912 5.37426 4.04246 5.37426 3.61579C5.37426 3.19979 5.23559 2.86379 4.95825 2.60779C4.69159 2.34112 4.35026 2.20779 3.93426 2.20779C3.48626 2.20779 3.11826 2.36246 2.83026 2.67179C2.54226 2.97046 2.37692 3.33846 2.33426 3.77579L0.286255 3.61579C0.350255 3.10379 0.483588 2.65046 0.686255 2.25579C0.888922 1.85046 1.15026 1.50912 1.47026 1.23179C1.80092 0.954455 2.17959 0.746455 2.60626 0.607789C3.03292 0.458456 3.50226 0.383789 4.01426 0.383789C4.49426 0.383789 4.93692 0.453122 5.34226 0.591788C5.75826 0.730455 6.11559 0.933122 6.41426 1.19979C6.72359 1.45579 6.96359 1.78112 7.13425 2.17579C7.30492 2.55979 7.39025 3.00246 7.39025 3.50379C7.39025 3.85579 7.34226 4.16512 7.24626 4.43179C7.15026 4.69846 7.02226 4.94379 6.86226 5.16779C6.70226 5.39179 6.51559 5.60512 6.30226 5.80779C6.09959 6.01046 5.88092 6.22379 5.64626 6.44779C5.49692 6.58646 5.36892 6.70912 5.26226 6.81579C5.15559 6.92246 5.06492 7.03446 4.99026 7.15179C4.92626 7.25846 4.87826 7.38646 4.84626 7.53579C4.81426 7.67446 4.79825 7.84512 4.79825 8.04779V8.65579H2.87825ZM2.55826 10.8798C2.55826 10.5385 2.68092 10.2451 2.92626 9.99979C3.18226 9.75445 3.48626 9.63179 3.83826 9.63179C4.17959 9.63179 4.47826 9.74912 4.73426 9.98379C4.99026 10.2185 5.11826 10.5065 5.11826 10.8478C5.11826 11.1891 4.99026 11.4825 4.73426 11.7278C4.48892 11.9731 4.19026 12.0958 3.83826 12.0958C3.66759 12.0958 3.50225 12.0638 3.34226 11.9998C3.19292 11.9358 3.05959 11.8505 2.94226 11.7438C2.82492 11.6371 2.72892 11.5091 2.65426 11.3598C2.59026 11.2105 2.55826 11.0505 2.55826 10.8798Z" fill="#C4C4C4"/>
          </svg>{{$t('views.noteColumn.markdownHelp')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.noteColumn
  .favoriteIcon
    &.active path
      fill: #EDA62A !important
  .noteEditWrap_submit_changePreview
    background: #e6f0ff !important
    color: #2f80ed !important
    border: none !important
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import {
  Note, NoteStatus, NotesPostRequestBody, NotesNoteIdPutRequestBody,
  apiRegistry, NotesApi,
} from '@/lib/api';
import store from '@/store';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';

async function initData(to: Route): Promise<Partial<Pick<NoteColumn, 'isAdd' | 'isFavorite' | 'editMode' | 'statusOptions' | 'note'>>> {
  const myUser = store.state.activeUser.myUser!;
  const notesApi = apiRegistry.load(NotesApi, myUser.token);
  const spaceId = myUser.space.id;
  const projectId = store.getters.activeUser.activeProjectId;
  const statusOptionsPromise = notesApi.notesStatusGet({
    spaceId: store.state.activeUser.myUser!.space.id,
    projectId: store.getters.activeUser.activeProjectId!,
  });

  if (to.name === 'note-add') {
    // 新規
    return {
      isAdd: true,
      isFavorite: false,
      editMode: true,
      statusOptions: await statusOptionsPromise,
      note: {
        subject: 'New note',
        chargeUsers: [],
      },
    };
  } else {
    // 既存
    const [statusOptions, note, resFavorite] = await Promise.all([
      statusOptionsPromise,
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
      isAdd: false,
      isFavorite: resFavorite.value,
      editMode: false,
      statusOptions,
      note,
    };
  }
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
  note: NotesPostRequestBody | NotesNoteIdPutRequestBody = null as any;
  statusOptions: NoteStatus[] = null as any;
  isFavorite = false;
  isAdd = false;
  editMode = false;
  saving = false;

  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  setFullMainColumn(v: boolean) {
    this.$store.mutations.setFullMainColumn(v);
  }

  async save() {
    if (this.saving) {
      return;
    }
    const loginUser = store.state.activeUser.myUser!;
    const projectId = store.getters.activeUser.activeProjectId!;
    const notesApi = apiRegistry.load(NotesApi, loginUser.token);
    try {
      this.saving = true;

      if (this.isAdd) {
        const note = await notesApi.notesPost({
          spaceId: loginUser.space.id,
          projectId,
          notesPostRequestBody: this.note as NotesPostRequestBody,
        });

        this.$store.actions.activeUser.replaceInNotes(note);
        this.$router.replace({
          name: 'note',
          params: {
            userId: loginUser.id.toString(),
            projectId: projectId.toString(),
            noteId: note.id.toString(),
          },
        });

      } else {
        const note = await notesApi.notesNoteIdPut({
          spaceId: loginUser.space.id,
          projectId,
          noteId: parseInt(this.$route.params.noteId),
          notesNoteIdPutRequestBody: this.note as NotesNoteIdPutRequestBody,
        });
        this.$store.actions.activeUser.replaceInNotes(note);
        this.editMode = false;
      }

    } catch (err) {
      this.$appEmit('error', { err });
    }

    this.saving = false;
  }

  async destroy() {
    if (this.saving) {
      return;
    }
    const loginUser = store.state.activeUser.myUser!;
    const projectId = store.getters.activeUser.activeProjectId!;
    const notesApi = apiRegistry.load(NotesApi, loginUser.token);

    try {
      this.saving = true;
      await notesApi.notesNoteIdDelete({
        spaceId: loginUser.space.id,
        projectId,
        noteId: parseInt(this.$route.params.noteId),
      });
      this.$store.mutations.activeUser.deleteNote(parseInt(this.$route.params.noteId));
      this.$flash('削除しました', 'success');
      this.$router.replace({
        name: 'notes',
        params: {
          userId: loginUser.id.toString(),
          projectId: projectId.toString(),
        },
      });

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
    const notesApi = apiRegistry.load(NotesApi, loginUser.token);
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
}
</script>
