<template>
  <div class="home">
    <team-column />
    <router-view v-show="!fullMainColumn" name="projectColumn" />
    <router-view v-show="!fullMainColumn" name="subColumn" />
    <router-view name="mainColumn" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import store from '@/store';
import TeamColumn from './columns/team/TeamColumn.vue';

async function beforeRouteChange(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
  if (to.name === 'users') {
    return next();
  }

  const userId = parseInt(to.params.userId);
  const user = store.state.loggedInUsers.find((u) => u.id === userId);
  if (!user) {
    return next({ name: 'users' });
  }

  if (!store.state.activeUser.loggedInUser || user.id !== store.state.activeUser.loggedInUser.id) {
    await store.actions.activeUser.init(user);
  }

  // プロジェクト未選択の場合、プロジェクトが存在するなら選択
  if (to.name === 'user') {
    const projects = store.state.activeUser.projects;
    if (projects && projects.length) {
      return next({
        name: 'project',
        params: {
          userId: to.params.userId,
          projectId: projects[0].id.toString(),
        },
      });
    }
  }

  return next();
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
]);
@Component({
  components: {
    TeamColumn,
  },
})
export default class MainContainer extends Vue {
  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    try {
      await beforeRouteChange(to, from, next);
    } catch (err) {
      return next((vm) => {
        vm.$showApiError(vm, err);
        vm.$router.replace({ name: 'users' });
      });
    }
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    try {
      await beforeRouteChange(to, from, next);
    } catch (err) {
      this.$showApiError(this, err);
      this.$router.replace({ name: 'users' });
    }
  }
}
</script>
