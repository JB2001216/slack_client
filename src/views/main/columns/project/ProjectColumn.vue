<template>
  <div class="projectColumn">
    <div class="projectColumn_head">
      <my-simple-menu class="projectColumn_spaceMenu">
        <template v-slot="{open, close, opened}">
          <h1 class="t-sub" @click.stop="opened ? close() : open()">{{loggedInUser.space.displayName || loggedInUser.space.account}}</h1>
        </template>
        <template v-slot:items>
          <li><span>{{$t(`views.projectColumn.spaceMenu.profileAndAccount`)}}</span></li>
          <li><span>{{$t(`views.projectColumn.spaceMenu.inviteMembers`)}}</span></li>
          <li><span @click="$store.mutations.settingRouter.to('space-members')">{{$t(`views.projectColumn.spaceMenu.spaceSettings`)}}</span></li>
        </template>
      </my-simple-menu>
    </div>
    <div class="projectColumn_body">
      <ul>
        <li><router-link class="projectColumn_add" :to="{name: 'project-add', params: { userId: loggedInUser.id }}">{{$t('views.projectColumn.project')}}
          <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m22 13h-19.99999v-2h19.99999z" />
            <path d="m11 22v-20.00003h2v20.00003z" />
          </svg>
        </router-link></li>
        <li v-for="p in projects" :key="p.id">
          <router-link
            :class="{active: p.id === activeProjectId}"
            :to="{
              name: 'project',
              params: {
                userId: loggedInUser.id.toString(),
                projectId: p.id.toString(),
              },
            }"
          >{{p.displayName}}</router-link>
        </li>
      </ul>
    </div>

    <div class="projectColumn_foot">
      <a href="#">
        <svg fill="none" width="16" height="18" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
          <path d="m9.9375 1.5-1.03125 1.05h-5.15625v2.1h16.5v-2.1h-5.1562l-1.0313-1.05zm-5.15625 5.25v13.65c0 1.155.92813 2.1 2.0625 2.1h10.31245c1.1344 0 2.0626-.945 2.0626-2.1v-13.65zm3.09375 2.1h2.0625v11.55h-2.0625zm6.1875 0h2.0625v11.55h-2.0625z" />
        </svg>
        {{$t('views.projectColumn.archive')}}
      </a>
    </div>
  </div>
</template>


<style lang="stylus">
.projectColumn
  .t-sub
    cursor: pointer
  &_spaceMenu.mySimpleMenu
    .other_status
      width: auto
      ul
        width: auto
        padding: 14px 0
        li
          font-size: 14px
          padding: 10px 24px
          white-space: nowrap
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import store from '@/store';

async function beforeRouteChange(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
  if (to.params.projectId) {
    const projectId = parseInt(to.params.projectId);
    const project = store.state.activeUser.projects!.find((p) => p.id === projectId);
    if (!project) {
      return next({ name: 'user', params: { userId: to.params.userId } });
    }

    if (project.id !== store.state.activeUser.activeProjectId) {
      store.mutations.activeUser.setActiveProjectId(project.id);
    }
  }

  // タブ未選択の場合タスクを選択
  if (to.name === 'project') {
    return next({
      name: 'tasks',
      params: {
        userId: to.params.userId,
        projectId: to.params.projectId,
      },
    });
  }
  return next();
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
]);
@Component
export default class ProjectColumn extends Vue {
  get loggedInUser() {
    return this.$store.state.activeUser.loggedInUser;
  }
  get projects() {
    return this.$store.state.activeUser.projects;
  }
  get activeProjectId() {
    return this.$store.state.activeUser.activeProjectId;
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    await beforeRouteChange(to, from, next);
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    await beforeRouteChange(to, from, next);
  }
}
</script>
