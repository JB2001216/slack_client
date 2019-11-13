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
        <div v-for="(recent, i) in list" :key="recent.id">
          <div v-if="isNewDate(i)" class="dateBar">
            <span class="date">{{ getFormatedDate(recent) }}</span>
            <span class="bar" />
          </div>
          <my-project-recent :recent="recent" />
        </div>
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
  .dateBar
    display: flex
    align-items: center
    margin: 5px 0
    .date
      font-weight: bold
      font-size: 16px
    .bar
      flex: 1
      background-color: #f5f5f5
      height: 2px
      margin-left: 5px
</style>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import InfiniteLoading from 'vue-infinite-loading';
import store from '@/store';
import * as api from '@/lib/api';
import { BaseError } from '../../../../lib/errors';

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

  isNewDate(i: number) {
    if (i === 0) return true;
    const date = this.getDateFromRecent(this.list[i]);
    if (this.getDateFromRecent(this.list[i - 1]) !== date && date !== '') {
      return true;
    }
    return false;
  }

  getDateFromRecent(recent: api.Recent) {
    const timeField = recent.data.find((data) => data.field === 'updatedAt');
    if (timeField === undefined) return '';
    return new Date(timeField.afterValue as string).toLocaleDateString();
  }

  getFormatedDate(recent: api.Recent) {
    const timeField = recent.data.find((data) => data.field === 'updatedAt');
    if (timeField === undefined) return '';
    const updatedAt = new Date(timeField.afterValue as string);
    if (this.$i18n.locale === 'en') {
      return updatedAt.toLocaleDateString() + ' ' + this.$t(`common.weekdays[${updatedAt.getDay()}]`);
    }
    let str = updatedAt.getFullYear().toString() + this.$t('common.time.year');
    str = str + (updatedAt.getMonth() + 1).toString() + this.$t('common.time.month');
    str = str + updatedAt.getDate().toString() + this.$t('common.time.day');
    str = `${str} (${this.$t(`common.weekdays[${updatedAt.getDay()}]`)})`;
    return str;
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
