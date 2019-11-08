<template>
  <div v-if="activeProjectId" class="mainColumn homeColumn" :class="{fullMainColumn}">
    <div class="mainColumn_head columnTitle">
      <h2>
        {{ $t('views.homeColumn.title') }}
      </h2>
    </div>
    <div class="mainColumn_body">
      <div class="dashboardWrap dashboardWrap_list">
        <my-project-member-list
          :my-user="myUser"
          :project-id-exact="activeProjectId"
        />
      </div>
      <div class="dashboardWrap dashboardWrap_home" />
      <infinite-loading @infinite="infiniteLoadData" />
    </div>
  </div>
</template>

<style lang="stylus">
@import '../../../../stylus/_settings'

.homeColumn
  .dashboardWrap_home
    border-top: 1px solid lightgray
    position: relative
</style>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import InfiniteLoading from 'vue-infinite-loading';
import store from '@/store';
import * as api from '@/lib/api';

@Component({
  components: {
    InfiniteLoading,
  },
})
export default class HomeColumn extends Vue {
  $refs!: {
  };

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }
  get myPerms() {
    return this.$store.getters.activeUser.activeProjectMyPerms!;
  }
  get activeProjectId() {
    return this.$store.getters.activeUser.activeProjectId;
  }

  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  async infiniteLoadData() {
    const loginUser = store.state.activeUser.myUser!;
    const SpacesApi = api.apiRegistry.load(api.SpacesApi, loginUser.token);

  }

  @Watch('$route')
  onRouteChange() {
    if (name !== 'home') {
      store.mutations.setFullMainColumn(false);
    }
  }
}
</script>
