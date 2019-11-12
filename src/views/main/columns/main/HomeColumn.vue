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
      <div class="dashboardWrap dashboardWrap_home">
        <my-project-recent v-for="recent in list" :key="recent.id" :recent="recent" />
        <infinite-loading @infinite="infiniteLoadData" />
      </div>
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

  page : number = 1;
  list : api.Recent[] = [];

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

  async infiniteLoadData($state: any) {
    const loginUser = store.state.activeUser.myUser!;
    const SpacesApi = api.apiRegistry.load(api.SpacesApi, loginUser.token);

    SpacesApi.spacesSpaceIdRecentsGet({
      spaceId: store.state.activeUser.myUser!.space.id,
      projectId: store.getters.activeUser.activeProjectId!,
      page: this.page,
    }).then((data) => {
      if (data.results.length) {
        this.page += 1;
        this.list.push(...data.results);
      }
      if (data.count > this.list.length) {
        $state.loaded();
      } else {
        $state.complete();
        console.log(this.list);
      }
    },
    (error) => console.log(error));
  }

  @Watch('$route')
  onRouteChange() {
    if (name !== 'home') {
      store.mutations.setFullMainColumn(false);
    }
  }
}
</script>
