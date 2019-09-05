<template>
  <div class="optionWrap" v-if="currentRoute">
    <div class="option">
      <h2 class="option_title">{{$t(currentRoute.title)}}<button @click="$store.mutations.settingRouter.close()"/></h2>
      <div class="option_container clearfix">
        <component v-if="currentRoute.main" :is="currentRoute.main"/>
        <component v-if="currentRoute.sub" :is="currentRoute.sub"/>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Constructor as VueConstructor } from 'vue-property-decorator';
import SpacesSub from './sub/SpacesSub.vue';
import SpaceMembers from './main/spaces/SpaceMembers.vue';

@Component({
  components: {
    SpacesSub,
    SpaceMembers,
  },
})
export default class SettingView extends Vue {

  routes: {
    [name: string]: {
      title: string;
      sub: VueConstructor;
      main: VueConstructor;
    };
  } = {
    'space-members': {
      title: 'views.setting.sub.spaces.title',
      sub: SpacesSub,
      main: SpaceMembers,
    },
  };

  get currentRoute() {
    if (!this.$store.state.settingRouter.name) return undefined;
    return this.routes[this.$store.state.settingRouter.name];
  }
}
</script>
