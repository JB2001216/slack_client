<template>
  <div class="projectColumn">
    <div class="projectColumn_head">
      <my-simple-menu class="projectColumn_spaceMenu">
        <template v-slot="{open, close, opened}">
          <h1 class="projectColumn_head_title t-sub" @click.stop="opened ? close() : open()">
            <span class="projectColumn_head_title_text">{{ myUser.space.displayName || myUser.space.account }}</span>
            <my-svg-icon class="projectColumn_head_title_icon" name="pulldown" />
          </h1>
        </template>
        <template v-slot:items>
          <li class="projectColumn_spaceMenu_profile notHover" @click.prevent.stop>
            <div class="projectColumn_spaceMenu_profile_avatar">
              <my-space-user-avatar :user="myUser" :size="40" shape="roundedSquare" />
            </div>
            <div class="projectColumn_spaceMenu_profile_name">
              {{ myUser.displayName || myUser.account }}
            </div>
          </li>
          <li @click="$store.actions.settingRouter.to('space-user-profile')">
            <span>{{ $t(`views.projectColumn.spaceMenu.profileAndAccount`) }}</span>
          </li>
          <li v-if="spaceUserAddable" @click="$store.actions.settingRouter.to('space-member-invite')">
            <span>{{ $t(`views.projectColumn.spaceMenu.inviteMembers`) }}</span>
          </li>
          <li v-if="spaceUserListable" @click="$store.actions.settingRouter.to('space-general')">
            <span>{{ $t(`views.projectColumn.spaceMenu.spaceSettings`) }}</span>
          </li>
        </template>
      </my-simple-menu>
    </div>
    <div class="projectColumn_body">
      <ul>
        <li v-if="projectAddable">
          <router-link class="projectColumn_add" :to="{name: 'project-add', params: { userId: myUser.id }}">
            {{ $t('views.projectColumn.project') }}
            <span class="projectColumn_add_plus">＋</span>
          </router-link>
        </li>
        <li v-for="p in projects" :key="p.id">
          <a
            :class="{active: p.id === activeProjectId}"
            @click.prevent="$router.push(getProjectLastLocation(myUser.id, p.id))"
          >
            {{ p.displayName }}
          </a>
        </li>
      </ul>
    </div>

    <div class="projectColumn_foot">
      <a href="#">
        <svg
          fill="none"
          width="16"
          height="18"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m9.9375 1.5-1.03125 1.05h-5.15625v2.1h16.5v-2.1h-5.1562l-1.0313-1.05zm-5.15625 5.25v13.65c0 1.155.92813 2.1 2.0625 2.1h10.31245c1.1344 0 2.0626-.945 2.0626-2.1v-13.65zm3.09375 2.1h2.0625v11.55h-2.0625zm6.1875 0h2.0625v11.55h-2.0625z" />
        </svg>
        {{ $t('views.projectColumn.archive') }}
      </a>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_settings'

.projectColumn
  color: $colors.white;
  background-color: $themeColors.sub
  user-select: none
  box-shadow: 8px 0px 32px rgba(0, 0, 0, 0.05)
  position: relative
  a
    color: $colors.white
    text-decoration: none
  &_head
    padding: $sizes.windowMarginTop 20px 20px
    &_title
      display: inline-block
      cursor: pointer
      position: relative
      max-width: 100%
      white-space: nowrap
      &_text
        max-width: calc(100% - 18px)
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis
        display: inline-block
        padding-right: 10px
      &_icon
        vertical-align: top
        margin-top: 10px
        --mySvgIconColor: $colors.white
        --mySvgIconSize: 9px
  &_add
    position: relative
    &_plus
      color: $colors.white
      position: absolute
      font-size: 16px
      top: 4px
      right: 20px
  &_body
    max-height: calc(100vh - 150px)
    overflow-y: auto
    ul
      a
        display: block
        padding: 6px 20px
        transition: 0.5s
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        cursor: pointer
        &.active
          font-weight: bold
          background-color: $themeColors.accent
          box-shadow: 8px 0px 32px rgba(0, 0, 0, 0.05)
        &:not(.active):hover
          background-color: $themeColors.subDarken1
  &_foot
    display: block
    text-align: center
    position: absolute
    bottom: 8px
    left: 0
    right: 0
    padding: 8px 20px 8px 10px
    transition: 0.5s
    opacity: 0.5
    &:hover
      opacity: 1
    svg
      vertical-align: sub
      fill: $colors.white
      margin-right: 4px

  &_spaceMenu.mySimpleMenu
    display: block
    height: 28px
    .mySimpleMenu_popup
      width: auto
      ul
        width: auto
        min-width: 220px
        padding: 14px 0
        li
          font-size: 14px
          padding: 10px 24px
          white-space: nowrap
          &.notHover
            cursor: default
            background: transparent
          &:not(.notHover):hover
            background-color: $themeColors.accent
            color: $colors.white
        .projectColumn_spaceMenu_profile
          display: flex
          align-items: center
          &_avatar
            width: 40px
            height: 40px
            overflow: hidden
            display: inline-block
          &_name
            flex: 1
            padding-left: 10px
            font-weight: bold
            font-size: 14px
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import store from '@/store';
import { apiRegistry, ProjectsApi, Project, ProjectUser } from '@/lib/api';
import { Perm } from '@/lib/permissions';
import { SubColumnTabNames } from '@/consts';
import { getProjectLastLocation } from '@/router';
import EventsSub from '@/events-subscription';

const tabs = {
  [SubColumnTabNames.task]: 'tasks',
  [SubColumnTabNames.file]: 'files',
  [SubColumnTabNames.note]: 'notes',
  [SubColumnTabNames.ganttChart]: 'notes',
};

@Component
export default class ProjectColumn extends Vue {

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get projects() {
    const projects: Project[] = this.$store.state.activeUser.projects ? this.$store.state.activeUser.projects : [];
    return projects;
  }

  get activeProjectId() {
    const activeProjectId: number | null = this.$store.getters.activeUser.activeProjectId ? this.$store.getters.activeUser.activeProjectId : null;
    return activeProjectId;
  }

  get api() {
    return apiRegistry.load(ProjectsApi, this.myUser.token);
  }

  get mySpaceRole() {
    return this.$store.getters.activeUser.mySpaceRole;
  }

  get projectAddable() {
    if (!this.mySpaceRole) return false;
    return this.mySpaceRole.perms.includes(Perm.ADD_PROJECT);
  }

  get spaceUserAddable() {
    if (!this.mySpaceRole) return false;
    return this.mySpaceRole.perms.includes(Perm.ADD_SPACE_USER);
  }

  get spaceUserListable() {
    if (!this.mySpaceRole) return false;
    return this.mySpaceRole.perms.includes(Perm.UPDATE_SPACE_USER) ||
      this.mySpaceRole.perms.includes(Perm.DELETE_SPACE_USER);
  }

  created() {
    EventsSub.source.addEventListener('createProjectUser', this.createProjectUserTask);
    EventsSub.source.addEventListener('deleteProjectUser', this.deleteProjectUserTask);
    EventsSub.source.addEventListener('updateProjectUser', this.updateProjectUserTask);
  }

  createProjectUserTask(e: any): void {

    const data = JSON.parse(e.data);
    const isCurrentUser = data.params.userId === this.myUser.id;

    if (!isCurrentUser) return;

    this.api.projectsProjectIdGet({
      spaceId: data.spaceId,
      projectId: data.params.projectId,
    }).then((project: Project) => {
      this.$store.mutations.activeUser.addProject(project);
    }).catch((err) => { console.log(err); });

  }

  deleteProjectUserTask(e: any): void {

    const data = JSON.parse(e.data);
    const isCurrentUser = data.params.userId === this.myUser.id;
    const isActiveProject = data.params.projectId === this.activeProjectId;

    if (isCurrentUser) {

      const project = this.projects.find((p) => p.id === data.params.projectId);
      if (!project) return;
      const projectName = project.displayName;

      this.$store.mutations.activeUser.removeProject(project);

      if (isActiveProject) {

        this.$store.actions.activeUser.setActiveProject(null);
        this.$store.actions.settingRouter.close();
        this.$router.push({ name: 'user', params: { userId: this.myUser.id + '' } });

        this.$flash(this.$t('views.setting.main.projectMembers.removedCrntUserMessage', { projectName }).toString(), 'success');

      }

    }

  }

  updateProjectUserTask(e: any): void {

    const data = JSON.parse(e.data);
    const isCurrentUser = data.params.userId === this.myUser.id;
    const isActiveProject = data.params.projectId === this.activeProjectId;
    const isSettings = store.state.settingRouter.name !== null;

    if (!isCurrentUser || !isActiveProject) return;

    this.api.projectsProjectIdUsersUserIdGet({
      spaceId: data.spaceId,
      projectId: data.params.projectId,
      userId: data.params.userId,
    }).then((user: ProjectUser) => {

      this.$store.mutations.activeUser.setActiveProjectData({ id: data.params.projectId, user: user });

      this.$flash(this.$t('views.setting.main.projectMembers.changedProjectRole').toString(), 'success');

      if (!isSettings) return;

      if (user.projectRoleId === 10101) {
        store.actions.settingRouter.to('project-members');
      }

    }).catch((err) => { console.log(err); });

  }

  getProjectLastLocation(userId: number, projectId: number) {
    return getProjectLastLocation(userId, projectId);
  }

  destroyed() {
    EventsSub.source.removeEventListener('createProjectUser', this.createProjectUserTask);
    EventsSub.source.removeEventListener('deleteProjectUser', this.deleteProjectUserTask);
    EventsSub.source.removeEventListener('updateProjectUser', this.updateProjectUserTask);
  }

}
</script>
