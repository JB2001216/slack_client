<template>
  <div class="taskColumn_taskComment" v-if="comments">
    <div class="dashboardWrap_post">
      <my-space-user tag="small" :user-id="task.writeUser" v-slot="{user}">
        {{task.createdAt | dateFormat('YYYY/M/D')}} <span v-if="user">{{user.displayName || user.account}} が</span>課題を作成しました。
      </my-space-user>
      <div class="dashboardWrap_post_board">
        <table>
          <tr v-for="c in comments" :key="c.id">
            <th class="dashboardWrap_post_board_user">
              <img src="@/assets/images/mainColumn/icn_post-user-heavyGreen.svg" alt="">
            </th>
            <td class="dashboardWrap_post_board_text">
              <my-space-user tag="h3" :user-id="c.writeUser" v-slot="{user}">
                <template v-if="user">{{user.displayName || user.account}}</template>
              </my-space-user>
              <p>{{c.body}}</p>
            </td>
            <td class="dashboardWrap_post_board_log">
              <!-- <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.5">
                  <path d="M13.6419 0.151417C13.734 0.0565617 13.86 0.00212747 13.9922 6.08852e-05C14.059 -0.000982093 14.1253 0.0113843 14.1872 0.036429C14.2491 0.0614737 14.3053 0.0986872 14.3526 0.145865C14.3999 0.193043 14.4372 0.249227 14.4624 0.311089C14.4875 0.37295 14.5 0.439232 14.4991 0.50601V3.50076H17.4938C17.5599 3.49983 17.6256 3.51205 17.687 3.53671C17.7483 3.56137 17.8042 3.59799 17.8513 3.64443C17.8984 3.69087 17.9358 3.74621 17.9613 3.80723C17.9869 3.86825 18 3.93374 18 3.99989C18 4.06603 17.9869 4.13152 17.9613 4.19254C17.9358 4.25356 17.8984 4.3089 17.8513 4.35534C17.8042 4.40179 17.7483 4.4384 17.687 4.46307C17.6256 4.48773 17.5599 4.49995 17.4938 4.49901H14.4991V7.49376C14.5 7.5599 14.4878 7.62557 14.4632 7.68695C14.4385 7.74832 14.4019 7.80419 14.3554 7.85129C14.309 7.89839 14.2537 7.93579 14.1926 7.96132C14.1316 7.98685 14.0661 8 14 8C13.9339 8 13.8684 7.98685 13.8073 7.96132C13.7463 7.93579 13.691 7.89839 13.6446 7.85129C13.5981 7.80419 13.5615 7.74832 13.5368 7.68695C13.5122 7.62557 13.5 7.5599 13.5009 7.49376V4.49901H10.5062C10.4401 4.49995 10.3744 4.48773 10.313 4.46307C10.2517 4.4384 10.1958 4.40179 10.1487 4.35534C10.1016 4.3089 10.0642 4.25356 10.0387 4.19254C10.0131 4.13152 10 4.06603 10 3.99989C10 3.93374 10.0131 3.86825 10.0387 3.80723C10.0642 3.74621 10.1016 3.69087 10.1487 3.64443C10.1958 3.59799 10.2517 3.56137 10.313 3.53671C10.3744 3.51205 10.4401 3.49983 10.5062 3.50076H13.5009V0.50601C13.4991 0.3738 13.5498 0.246273 13.6419 0.151417Z" fill="#333333" fill-opacity="0.72"/>
                  <path d="M8 2C3.5816 2 0 5.5816 0 10C0 14.4184 3.5816 18 8 18C12.4184 18 16 14.4184 16 10C16 9.2824 15.8963 8.58973 15.7188 7.92812C15.6179 8.00332 15.5159 8.07778 15.4031 8.15938L14.9359 8.49688L14.3063 8.95C14.3631 9.2924 14.4 9.6416 14.4 10C14.4 13.5344 11.5344 16.4 8 16.4C4.4656 16.4 1.6 13.5344 1.6 10C1.6 6.4656 4.4656 3.6 8 3.6C8.3144 3.6 8.62104 3.631 8.92344 3.675C8.78664 3.1278 8.76867 2.586 8.87187 2.05C8.58547 2.0188 8.2952 2 8 2ZM5.2 6.8C4.53726 6.8 4 7.33726 4 8C4 8.66274 4.53726 9.2 5.2 9.2C5.86274 9.2 6.4 8.66274 6.4 8C6.4 7.33726 5.86274 6.8 5.2 6.8ZM10.8 6.8C10.1373 6.8 9.6 7.33726 9.6 8C9.6 8.66274 10.1373 9.2 10.8 9.2C11.4627 9.2 12 8.66274 12 8C12 7.33726 11.4627 6.8 10.8 6.8ZM3.9125 11.6C4.5525 13.232 6.136 14.4 8 14.4C9.864 14.4 11.4475 13.232 12.0875 11.6H3.9125Z" fill="#333333" fill-opacity="0.72"/>
                </g>
              </svg> -->
              <p>{{c.createdAt | fromNow}}</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="dashboardWrap_comment">
      <div class="dashboardWrap_comment_box">
        <label class="dashboardWrap_comment_box_upload" for="file_upload">
          <input type="file" id="file">
          <input type="text" id="file_upload" value="">
        </label>
        <textarea
          type="text"
          class="dashboardWrap_comment_box_content"
          placeholder="コメントを追加"
          v-model="newComment.body"
          :disabled="saving"
          @keydown="onTextKeydown($event)" />
      </div>
      <div class="dashboardWrap_comment_text show">
        <!-- <p>Satoshi Hashimotoさんが入力中です</p> -->
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.dashboardWrap_post_board_text
  white-space: pre-wrap
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import { first } from 'rxjs/operators';
import * as api from '@/lib/api';

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
]);
@Component
export default class TaskCommment extends Vue {
  @Prop({ required: true })
  task!: api.Task;

  comments: api.TaskComment[] = [];
  newComment: api.TaskCommmentsPostRequestBody = {
    body: '',
  };
  saving = false;

  resetNewComment() {
    this.newComment = {
      body: '',
    };
  }

  async save() {
    if (this.saving) {
      return;
    }
    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectId = this.$store.state.activeUser.activeProjectId!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);
    try {
      this.saving = true;
      const comment = await tasksApi.taskCommmentsPost({
        spaceId: loginUser.space.id,
        projectId,
        taskId: this.task.id,
        taskCommmentsPostRequestBody: this.newComment,
      }).pipe(first()).toPromise();
      this.resetNewComment();
      await this.scrollComments('next', true);

    } catch (err) {
      this.$showApiError(this, err);
    }

    this.saving = false;
  }

  async destroy() {
    if (this.saving) {
      return;
    }
    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectId = this.$store.state.activeUser.activeProjectId!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);

    try {
      this.saving = true;
      await tasksApi.tasksTaskIdDelete({
        spaceId: loginUser.space.id,
        projectId,
        taskId: parseInt(this.$route.params.taskId),
      }).pipe(first()).toPromise();
      this.$store.mutations.activeUser.deleteTask(parseInt(this.$route.params.taskId));
      this.$flash('削除しました', 'error');
      this.$router.replace({
        name: 'tasks',
        params: {
          userId: loginUser.id.toString(),
          projectId: projectId.toString(),
        },
      });

    } catch (err) {
      this.$showApiError(this, err);
    }

    this.saving = false;
  }

  async fetchComments() {
    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectId = this.$store.state.activeUser.activeProjectId!;
    const taskApi = api.apiRegistry.load(api.TasksApi, loginUser.token);

    if (this.comments.length && this.comments[0].task !== this.task.id) {
      this.comments = [];
    }

    try {
      const res = await taskApi.taskCommmentsGet({
        spaceId: loginUser.space.id,
        projectId: projectId,
        taskId: this.task.id,
      }).pipe(first()).toPromise();
      this.comments = res.results.reverse();
    } catch (err) {
      this.$flash('コメントの取得に失敗しました', 'error');
    }
  }

  async scrollComments(type: 'next' | 'prev', full: boolean = false) {
    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectId = this.$store.state.activeUser.activeProjectId!;
    const taskApi = api.apiRegistry.load(api.TasksApi, loginUser.token);
    const comments = this.comments;

    if (!comments.length) {
      await this.fetchComments();
      return;
    }

    let current = type === 'next' ? comments[comments.length - 1] : comments[0];
    const d = type === 'next' ? 'higher' : 'lower';
    const idGtLt = d === 'higher' ? 'idGt' : 'idLt';
    const field = 'createdAt';
    const fieldGtLt = d === 'higher' ? `${field}Gt` : `${field}Lt`;
    const ordering = [field, 'id'].map((f) => d === 'higher' ? f : `-${f}`).join(',');
    let limit = 30;
    if (full) {
      limit = 500;
    }

    const res = await taskApi.taskCommmentsGet({
      spaceId: loginUser.space.id,
      projectId: projectId,
      taskId: this.task.id,
    }).pipe(first()).toPromise();

    const req: api.TaskCommmentsGetRequest = {
      spaceId: loginUser.space.id,
      projectId: projectId,
      taskId: this.task.id,
    };

    try {
      const addComments: api.TaskComment[] = [];
      while (true) {
        console.log(current);
        const res1 = await taskApi.taskCommmentsGet(Object.assign({
          [idGtLt]: current.id,
          [field]: current[field],
          limit,
          ordering,
        }, req)).pipe(first()).toPromise();
        const tempComments = res1.results;
        if (tempComments.length < limit) {
          const res2 = await taskApi.taskCommmentsGet(Object.assign({
            [fieldGtLt]: current[field],
            limit: limit - tempComments.length,
            ordering,
          }, req)).pipe(first()).toPromise();
          tempComments.push(...res2.results);
        }
        addComments.push(...tempComments);
        if (!full || tempComments.length < limit || !tempComments.length) {
          break;
        }
        current = tempComments[tempComments.length - 1];
      }
      if (type === 'prev') {
        this.comments = addComments.reverse().concat(comments);
      } else {
        this.comments = comments.concat(addComments);
      }

    } catch (err) {
      console.log(err);
      this.$flash('コメントの取得に失敗しました', 'error');
    }
  }

  async onTextKeydown(ev: KeyboardEvent) {
    if (ev.ctrlKey && ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
      await this.save();
    }
  }

  @Watch('task')
  async onTaskChange(newVal: api.Task, oldVal?: api.Task) {
    if (oldVal && newVal.id === oldVal.id) {
      return;
    }
    await this.fetchComments();
    this.resetNewComment();
  }

  async beforeMount() {
    await this.fetchComments();
    this.resetNewComment();
  }
}
</script>
