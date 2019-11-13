<template>
  <div>
    <div v-if="user" class="recentTitle">
      <my-space-user-avatar class="myChargerInput_chargeUsers_item_avatar" :user="user" :size="32" shape="circle" />
      <span class="recentTitleText"> {{ user.displayName }} </span>
      <span class="recentTitleText"> {{ activityTextBeforeFocus }} </span>
      <span class="recentTitleText activityTextFocus"> {{ activityTextFocus }} </span>
      <span class="recentTitleText"> {{ activityTextAfterFocus }} </span>
      <span class="timeAgo">{{ timeAgo }}</span>
    </div>
    <div class="recentContent">
      <a v-if="isShowLinkEvent && data" class="link" href="#" @click="onClickLink()">{{ dataSubject }}</a>

      <div v-if="isUpdateEvent && data">
        <div v-for="update in updateList" :key="update" class="update">
          {{ update }}
        </div>
      </div>

      <div v-if="recent.event==='createTaskComment' && comment">
        <div class="comment">
          {{ displayComment }}
        </div>
        <a v-if="isCommentOutOfRange" class="readMore" href="#" @click="onClickLink()">{{ '...' + $t('views.homeColumn.recent.createTaskComment.readMore') }}</a>
      </div>

      <div v-if="recent.event==='createProjectUser' && addedUser" class="recent_createProjectUser">
        <my-space-user-avatar class="myChargerInput_chargeUsers_item_avatar" :user="addedUser" :size="24" shape="circle" />
        <span class="recent_createProjectUser_text">{{ addedUser.displayName ? addedUser.displayName : '' + $t('views.homeColumn.recent.createProjectUser.content') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.recentTitle
  display: flex
  align-items: center
  .recentTitleText
    margin-left: 5px
    font-weight: bold
  .activityTextFocus
    background-color: #2F80ED
    padding: 0px 5px
    border-radius: 10px
    color: white
  .timeAgo
    color: #999999
    margin-left: 5px
.recentContent
  display: inline-block
  margin-left: 40px
  .link
    padding: 0 5px
    text-decoration: none
    color: #007EFE
    background-color: #DEEEF6
  .update
    padding: 0 10px
    margin-top: 3px
    border-radius: 10px
    background-color: #F5F5F5
  .comment
    margin: 10px 0px
  .readMore
    padding: 0 5px
    text-decoration: none
    color: #007EFE
  .recent_createProjectUser
    display: flex
    align-items: center
    .recent_createProjectUser_text
      margin-left: 5px
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as api from '@/lib/api';
import { escapeHtml } from '@/lib/utils/string-util';

@Component
export default class MyProjectRecent extends Vue {

  @Prop()
  recent!: api.Recent;
  data: api.Note | api.Task | null = null;
  comment: string | null = null;

  get user(): api.SpaceUser | null {
    if (!this.recent.user) return null;
    return this.$store.state.activeUser.spaceUsers.find((su) => su.id === this.recent.user) || null;
  }

  get addedUser(): api.SpaceUser | null {
    if (this.recent.event !== 'createProjectUser') return null;
    const userId = this.recent.data.find((data) => data.field === 'userId')!.afterValue as number;
    return this.$store.state.activeUser.spaceUsers.find((su) => su.id === userId) || null;
  }

  get timeAgo(): string {
    const timeField = this.recent.data.find((data) => data.field === 'updatedAt');
    if (timeField === undefined) return '';
    const updatedAt = timeField.afterValue as string;
    let time = Math.floor((new Date().getTime() - new Date(updatedAt).getTime()) / 1000);
    let unit = '';
    if (time < 60) {
      unit = this.$t('common.time.second').toString();
    } else if (time < 3600) {
      time = Math.floor(time / 60);
      unit = this.$t('common.time.minute').toString();
    } else if (time < 86400) {
      time = Math.floor(time / 3600);
      unit = this.$t('common.time.hour').toString();
    } else {
      time = Math.floor(time / 86400);
      unit = this.$t('common.time.day').toString();
    }

    let str = time.toString();
    if (this.$i18n.locale === 'en') str = str + ' ';
    str = str + unit;
    if (this.$i18n.locale === 'en') str = str + 's ';
    return str + this.$t('common.time.ago');
  }

  get activityTextBeforeFocus(): string {
    const str = this.$t('views.homeColumn.recent.' + this.recent.event + '.title').toString();
    return str.split('"')[0];
  }

  get activityTextAfterFocus(): string {
    const str = this.$t('views.homeColumn.recent.' + this.recent.event + '.title').toString();
    return str.split('"')[2];
  }

  get activityTextFocus(): string {
    const str = this.$t('views.homeColumn.recent.' + this.recent.event + '.title').toString();
    return str.split('"')[1];
  }

  get dataSubject() {
    if (!this.data) return null;
    return escapeHtml(this.data.subject);
  }

  get updateList() {
    let list: string[] = [];
    this.recent.data.forEach((update) => {
      if (update.field !== 'updatedAt') {
        list.push(update.field + ' : ' + update.afterValue);
      }
    });
    return list;
  }

  get isShowLinkEvent() {
    switch (this.recent.event) {
      case 'createTask':
      case 'updateTask':
      case 'createNote':
      case 'updateNote':
      case 'createTaskComment':
        return true;
    }
    return false;
  }

  get isUpdateEvent() {
    switch (this.recent.event) {
      case 'updateTask':
      case 'updateNote':
        return true;
    }
    return false;
  }

  get isCommentOutOfRange() {
    if (this.comment === null) return false;
    return this.comment.length > 100;
  }

  get displayComment() {
    if (this.isCommentOutOfRange) {
      return this.comment!.slice(0, 100);
    }
    return this.comment;
  }

  onClickLink() {
    let name = '';
    if (this.recent.table === 'Task' || this.recent.table === 'TaskComment') {
      this.$router.push({
        name: 'task',
        params: {
          userId: this.$route.params.userId,
          projectId: this.$route.params.projectId,
          taskId: this.data!.id.toString(),
        },
      });
    }
    if (this.recent.table === 'Note') {
      this.$router.push({
        name: 'note',
        params: {
          userId: this.$route.params.userId,
          projectId: this.$route.params.projectId,
          noteId: this.data!.id.toString(),
        },
      });
    }
  }

  async mounted() {
    if (!this.recent.pk) return;

    if (this.recent.table === 'Task') {
      this.initTask(this.recent.pk);
    }

    if (this.recent.table === 'TaskComment') {
      this.initTaskComment();
    }

    if (this.recent.table === 'Note') {
      this.initNote(this.recent.pk);
    }
  }

  async initTaskComment() {
    const bodyField = this.recent.data.find((update) => update.field === 'body');
    if (bodyField !== undefined) {
      this.comment = bodyField.afterValue as string;
    }
    const taskField = this.recent.data.find((update) => update.field === 'task');
    if (taskField !== undefined) {
      this.initTask(taskField.afterValue as number);
    }
  }

  async initTask(taskId: number) {
    const loginUser = this.$store.state.activeUser.myUser!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);

    this.data = await tasksApi.tasksTaskIdGet({
      spaceId: this.$store.state.activeUser.myUser!.space.id,
      projectId: this.$store.getters.activeUser.activeProjectId!,
      taskId: taskId,
    });
  }

  async initNote(noteId: number) {
    const loginUser = this.$store.state.activeUser.myUser!;
    const notesApi = api.apiRegistry.load(api.NotesApi, loginUser.token);

    this.data = await notesApi.notesNoteIdGet({
      spaceId: this.$store.state.activeUser.myUser!.space.id,
      projectId: this.$store.getters.activeUser.activeProjectId!,
      noteId: noteId,
    });
  }
}
</script>
