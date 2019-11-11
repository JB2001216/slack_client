<template>
  <div>
    <div v-if="user" class="recentTitle">
      <my-space-user-avatar class="myChargerInput_chargeUsers_item_avatar" :user="user" :size="32" shape="circle" />
      <span class="recentTitleText"> {{ user.displayName }} </span>
      <span class="recentTitleText"> {{ activityTextBeforeFocus }} </span>
      <span class="recentTitleText activityTextFocus"> {{ activityTextFocus }} </span>
      <span class="recentTitleText"> {{ activityTextAfterFocus }} </span>
    </div>
    <div>
      <div v-if="data.event==='updateTask'" />
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.recentTitle
  display: flex
  font-weight: bold
  align-items: center
  .recentTitleText
    margin-left: 5px
  .activityTextFocus
    background-color: #2F80ED
    padding: 0px 5px
    border-radius: 10px
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as api from '@/lib/api';

@Component
export default class MyProjectRecent extends Vue {

  @Prop()
  data!: api.Recent;
  task: api.Task | null = null;

  get user(): api.SpaceUser | null {
    if (!this.data.user) return null;
    return this.$store.state.activeUser.spaceUsers.find((su) => su.id === this.data.user) || null;
  }

  get activityTextBeforeFocus(): string {
    const str = this.$t('views.homeColumn.recent.' + this.data.event + '.title').toString();
    return str.split('"')[0];
  }

  get activityTextAfterFocus(): string {
    const str = this.$t('views.homeColumn.recent.' + this.data.event + '.title').toString();
    return str.split('"')[2];
  }

  get activityTextFocus(): string {
    const str = this.$t('views.homeColumn.recent.' + this.data.event + '.title').toString();
    return str.split('"')[1];
  }

  async beforeCreate() {
    if (!this.data.pk) return;
    const loginUser = this.$store.state.activeUser.myUser!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, loginUser.token);

    const task = await tasksApi.tasksTaskIdGet({
      spaceId: this.$store.state.activeUser.myUser!.space.id,
      projectId: this.$store.getters.activeUser.activeProjectId!,
      taskId: this.data.pk,
    });

    console.log(task);
    this.task = task;
  }

  get taskLink() {
    if (this.task === null) return '';

  }
}
</script>
