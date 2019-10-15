<template>
  <div class="mySpaceUserSearchInput">
    <input
      class="mySpaceUserSearchInput_input basicInput"
      type="text"
      :value="searchText"
      :placeholder="$t('components.mySpaceUserSearchInput.searchTextPlaceholder')"
      @input="onSearchTextInput($event)"
      @focus="showedSelect = true"
      @blur="showedSelect = false"
    >
    <transition name="fade">
      <div v-if="showedSelect && !searchNextTimeId" class="mySpaceUserSearchInput_select">
        <div v-if="!searchedUsersWithoutSelected.length" class="mySpaceUserSearchInput_select_notfound">
          {{ $t('components.mySpaceUserSearchInput.notfound') }}
        </div>
        <div
          v-for="user in searchedUsersWithoutSelected"
          :key="user.id"
          class="mySpaceUserSearchInput_select_item"
          @mousedown="onSearchUserSelect(user)"
        >
          <div class="mySpaceUserSearchInput_select_item_avatar">
            <my-space-user-avatar :user="user" :size="30" shape="roundedSquare" />
          </div>
          <div class="mySpaceUserSearchInput_select_item_name">
            {{ user.displayName || user.account }}（{{ user.email }}）
          </div>
        </div>
        <infinite-loading :identifier="infiniteId" @infinite="onInfinite" />
      </div>
    </transition>
  </div>
</template>


<style lang="stylus">
@import '../stylus/_fixed/base/themes/_backgroundColor'

.mySpaceUserSearchInput
  position: relative
  .infinite-loading-container
    min-height: 20px
  &_input
    display: block
    width: 100%
  &_select
    position: absolute
    top: 42px
    width: calc(100% + 10px)
    left: -5px
    max-height: 200px
    background: #fff
    z-index: 2
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
    border: 1px solid #E0E0E0
    border-radius: 4px
    overflow-y: scroll
    padding: 16px 0 0
    &_notfound
      color: #999
      text-align: center
    &_item
      font-size: 14px
      padding: 0 24px
      height: 40px
      display: flex
      align-items: center
      cursor: pointer
      &:hover
        @extends .themeBackgroundColor
        color: #fff
      &_avatar
        width: 30px
        height: 30px
        overflow: hidden
        img
          width: 30px
      &_name
        padding-left: 15px
        width: calc(100% - 30px)
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { StateChanger } from 'vue-infinite-loading';
import { apiRegistry, SpacesApi, SpaceUser, MyUser } from '@/lib/api';
import { LoggedInUser } from '@/store/root';

@Component
export default class MySpaceUserSearchInput extends Vue {
  @Prop({ type: Array, default: [] })
  selectedUserIds!: number[];

  @Prop({ required: true })
  myUser!: LoggedInUser;

  @Prop({ default: null })
  projectIdExact!: number | null;

  @Prop({ default: null })
  projectIdNotExact!: number | null;

  page = 1;
  limit = 10;
  infiniteId = +new Date();
  searchText = '';
  searchedUsers: SpaceUser[] = [];
  searchNextTimeId: NodeJS.Timeout | null = null;
  searchIntervalMsec = 1000;
  showedSelect = false;

  get searchedUsersWithoutSelected() {
    return this.searchedUsers.filter((u) => this.selectedUserIds.indexOf(u.id) < 0);
  }

  onSearchTextInput(ev: Event) {
    this.searchText = (ev.target! as HTMLInputElement).value;
    if (this.searchNextTimeId) {
      clearTimeout(this.searchNextTimeId);
    }
    this.searchNextTimeId = setTimeout(() => {
      this.page = 1;
      this.searchedUsers = [];
      this.infiniteId = +new Date();
      this.searchNextTimeId = null;
    }, this.searchIntervalMsec);
  }

  onSearchUserSelect(user: SpaceUser) {
    this.$emit('select', Object.assign({}, user));
  }

  async onInfinite($state: StateChanger) {
    const spacesApi = apiRegistry.load(SpacesApi, this.myUser.token);
    const keyword = this.searchText.trim() === '' ? undefined : this.searchText.trim();

    try {
      const res = await spacesApi.spacesSpaceIdUsersGet({
        spaceId: this.myUser.space.id,
        projectIdExact: this.projectIdExact || undefined,
        projectIdNotExact: this.projectIdNotExact || undefined,
        keyword,
        page: this.page,
        limit: this.limit,
      });
      if (res.results.length) {
        this.$store.mutations.activeUser.addSpaceUser(...res.results);
      }
      const addData: SpaceUser[] = res.results.filter((r) => !this.searchedUsers.find((u) => u.id === r.id));
      if (addData.length) {
        this.searchedUsers.push(...addData);
      }

      if (res.next) {
        this.page += 1;
        $state.loaded();
      } else {
        $state.complete();
      }

    } catch (err) {
      this.$appEmit('error', { err });
    }
  }
}
</script>
