<template>
  <div class="optionWrap" v-if="currentRoute">
    <div class="option">
      <h2 class="option_title">{{currentRoute.title()}}<button @click="$store.mutations.settingRouter.close()"/></h2>
      <div class="option_container clearfix">
        <component v-if="currentRoute.main" :is="currentRoute.main"/>
        <component v-if="currentRoute.sub" :is="currentRoute.sub"/>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Watch, Constructor as VueConstructor } from 'vue-property-decorator';
import SpacesSub from './sub/SpacesSub.vue';
import SpaceMembers from './main/spaces/SpaceMembers.vue';
import SpaceMemberInvite from './main/spaces/SpaceMemberInvite.vue';
import { TranslateResult } from 'vue-i18n';
import i18n from '@/i18n';

@Component({
  components: {
    SpacesSub,
    SpaceMembers,
    SpaceMemberInvite,
  },
})
export default class SettingRouterView extends Vue {

  routes: {
    [name: string]: {
      title: () => TranslateResult;
      sub: VueConstructor | null;
      main: VueConstructor;
    };
  } = {
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
    this.$store.mutations.settingRouter.close();
  }
}
</script>
