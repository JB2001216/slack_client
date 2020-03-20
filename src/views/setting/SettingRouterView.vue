<template>
  <div v-if="currentRoute" class="optionWrap">
    <div class="option">
      <h2 class="option_title" :class="{noShadow: !currentRoute.title}">
        {{ currentRoute.title ? currentRoute.title() : '' }}<button @click="$store.actions.settingRouter.close()" />
      </h2>
      <div class="option_container clearfix">
        <component :is="currentRoute.main" v-if="currentRoute.main" />
        <component :is="currentRoute.sub" v-if="currentRoute.sub" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Constructor as VueConstructor } from 'vue-property-decorator';
import SpacesSub from './sub/SpacesSub.vue';
import SpaceGeneral from './main/spaces/SpaceGeneral.vue';
import SpaceMembers from './main/spaces/SpaceMembers.vue';
import SpaceMemberInvite from './main/spaces/SpaceMemberInvite.vue';
import SpaceUserSub from './sub/SpaceUserSub.vue';
import SpaceUserProfile from './main/spaces/SpaceUserProfile.vue';
import SpaceUserAccount from './main/spaces/SpaceUserAccount.vue';
import ProjectsSub from './sub/ProjectsSub.vue';
import ProjectGeneral from './main/projects/ProjectGeneral.vue';
import ProjectMembers from './main/projects/ProjectMembers.vue';
import ProjectMemberAdd from './main/projects/ProjectMemberAdd.vue';
import StatusFlow from './main/projects/StatusFlow.vue';
import { TranslateResult } from 'vue-i18n';
import i18n from '@/i18n';

@Component({
  components: {
    SpacesSub,
    SpaceGeneral,
    SpaceMembers,
    SpaceMemberInvite,
    ProjectsSub,
    ProjectGeneral,
    ProjectMembers,
    ProjectMemberAdd,
    SpaceUserSub,
    SpaceUserProfile,
    SpaceUserAccount,
  },
})
export default class SettingRouterView extends Vue {

  routes: {
    [name: string]: {
      title?: () => TranslateResult;
      sub: VueConstructor | null;
      main: VueConstructor;
    };
  } = {
    'space-general': {
      title: () => i18n.t('views.setting.sub.spaces.title'),
      sub: SpacesSub,
      main: SpaceGeneral,
    },
    'space-members': {
      title: () => i18n.t('views.setting.sub.spaces.title'),
      sub: SpacesSub,
      main: SpaceMembers,
    },
    'space-member-invite': {
      title: () => this.myUser ? i18n.t('views.setting.main.spaceMemberInvite.title', { spaceName: this.myUser.space.displayName || this.myUser.space.account }) : '',
      sub: null,
      main: SpaceMemberInvite,
    },
    'project-general': {
      title: () => i18n.t('views.setting.sub.projects.title'),
      sub: ProjectsSub,
      main: ProjectGeneral,
    },
    'project-members': {
      title: () => i18n.t('views.setting.sub.projects.title'),
      sub: ProjectsSub,
      main: ProjectMembers,
    },
    'project-member-add': {
      sub: null,
      main: ProjectMemberAdd,
    },
    'task-status': {
      title: () => i18n.t('views.setting.sub.projects.title'),
      sub: ProjectsSub,
      main: StatusFlow,
    },
    'note-status': {
      title: () => i18n.t('views.setting.sub.projects.title'),
      sub: ProjectsSub,
      main: StatusFlow,
    },
    'space-user-profile': {
      title: () => i18n.t('views.setting.sub.spaces.profileAndAccount'),
      sub: SpaceUserSub,
      main: SpaceUserProfile,
    },
    'space-user-account': {
      title: () => i18n.t('views.setting.sub.spaces.profileAndAccount'),
      sub: SpaceUserSub,
      main: SpaceUserAccount,
    },
  };

  get myUser() {
    return this.$store.state.activeUser.myUser;
  }

  get currentRouterName() {
    return this.$store.state.settingRouter.name;
  }

  get currentRoute() {
    if (!this.myUser || !this.currentRouterName) {
      return undefined;
    }
    return this.routes[this.currentRouterName];
  }

  @Watch('$route')
  onRouteChange() {
    this.$store.actions.settingRouter.close();
  }
}
</script>
