<template>
  <div class="option_spaceMemberAdd">
    <h3 class="option_spaceMemberAdd_title">{{$t('views.setting.main.projectMemberAdd.title', {projectName: activeProject.displayName})}}</h3>
    <div class="option_spaceMemberAdd_input">
      <input
        type="text"
        :value="searchText"
        @input="onSearchTextInput($event)"
        :placeholder="$t('views.setting.main.projectMemberAdd.searchTextPlaceholder')"
      >
      <div :class="{hide: searchNextTimeId || !searchedUsersWithoutSelected.length}" class="option_spaceMemberAdd_input_autocomplete">
        <div
          v-for="user in searchedUsersWithoutSelected"
          :key="user.id"
          class="option_spaceMemberAdd_input_autocomplete_item"
          @mousedown="onSearchUserSelect(user)"
        >
          <div class="option_spaceMemberAdd_input_autocomplete_item_avatar">
            <img src="~@/assets/images/parts/img_option_space_member_01.jpg" alt="">
          </div>
          <div class="option_spaceMemberAdd_input_autocomplete_item_name">{{user.displayName || user.account}}（{{user.email}}）</div>
        </div>
        <infinite-loading :identifier="infiniteId" @infinite="onInfinite" />
      </div>
    </div>
    <div class="option_spaceMemberAdd_table">
      <table>
        <tr>
          <th/>
          <th>{{$t('views.setting.main.projectMemberAdd.email')}}</th>
          <th>{{$t('views.setting.main.projectMemberAdd.name')}}</th>
          <th>{{$t('views.setting.main.projectMemberAdd.role')}}</th>
        </tr>
        <tr v-for="data in users" :key="data.user.id">
          <td>
            <div class="option_spaceMember_table_img">
              <img src="~@/assets/images/parts/img_option_space_member_01.jpg" alt="">
            </div>
          </td>
          <td>{{data.user.email}}</td>
          <td>{{data.user.displayName || data.user.account}}</td>
          <td class="clearfix">
            <div class="select">
              <my-project-role-select
                v-model="data.body.projectRoleId"
                :my-space-role="mySpaceRole"
                :my-project-role="myProjectRole"
                :current-space-role="getSpaceRole(data.user.spaceRoleId)"
              />
            </div>
            <button @click="onRemove(data.user.id)" />
          </td>
        </tr>
      </table>
      <div class="option_spaceMemberAdd_addButton clearfix">
        <button @click="save()" class="option_spaceMemberAdd_button">{{$t('views.setting.main.projectMemberAdd.addMembers')}}</button>
      </div>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_fixed/base/_theme'

.option_spaceMemberAdd
  .infinite-loading-container
    min-height: 20px
  &_input
    position: relative
    input:not(:focus) + .option_spaceMemberAdd_input_autocomplete,
    .option_spaceMemberAdd_input_autocomplete.hide
      opacity: 0
      pointer-events: none
    &_autocomplete
      position: absolute
      top: 52px
      width: 100%
      max-height: 200px
      background: #fff
      z-index: 2
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
      border: 1px solid #E0E0E0
      border-radius: 4px
      overflow-y: scroll
      padding: 16px 0 0
      &_item
        font-size: 14px
        padding: 0 24px
        height: 40px
        display: flex
        align-items: center
        cursor: pointer
        &:hover
          @extends .themeMenuItemHover
        &_avatar
          width: 30px
          height: 30px
          overflow: hidden
          img
            width: 30px
        &_name
          padding-left: 15px
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StateChanger } from 'vue-infinite-loading';
import { apiRegistry, SpacesApi, ProjectsApi, ApiErrors, getJsonFromResponse, SpaceUser, ProjectsProjectIdUsersPostRequestBody } from '@/lib/api';
import { SpaceRoles, SpaceRole, ProjectRoles } from '@/lib/permissions';
import MyProjectRoleSelect from '@/components/MyProjectRoleSelect.vue';

@Component({
  components: {
    MyProjectRoleSelect,
  },
})
export default class ProjectMemberAdd extends Vue {
  users: { user: SpaceUser; body: ProjectsProjectIdUsersPostRequestBody }[] = [];
  page = 1;
  limit = 10;
  infiniteId = +new Date();
  searchText = '';
  searchTextFocused = false;
  searchedUsers: SpaceUser[] = [];
  searchNextTimeId: NodeJS.Timeout | null = null;
  searchIntervalMsec = 1000;
  saving = false;

  get activeProject() {
    return this.$store.getters.activeUser.activeProject;
  }

  get searchedUsersWithoutSelected() {
    return this.searchedUsers.filter((u) => !this.users.find((d) => d.user.id === u.id));
  }

  get mySpaceRole() {
    return this.$store.getters.activeUser.mySpaceRole!;
  }

  get myProjectRole() {
    return this.$store.getters.activeUser.activeProjectMyRole;
  }

  get selectableRoles() {
    return [...ProjectRoles.getSelectables(this.mySpaceRole, this.myProjectRole)];
  }

  getSpaceRole(spaceRoleId: number) {
    return SpaceRoles.get(spaceRoleId);
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
    if (this.users.find((d) => d.user.id === user.id)) {
      return;
    }
    this.users.push({
      user,
      body: {
        userId: user.id,
        projectRoleId: this.selectableRoles[this.selectableRoles.length - 1].id,
      },
    });
  }

  onRemove(userId: number) {
    const index = this.users.findIndex((d) => d.user.id === userId);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  async save() {
    if (this.saving || !this.users.length) return;

    this.saving = true;
    const myUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const projectsApi = apiRegistry.load(ProjectsApi, myUser.token);
    for (const data of this.users.concat()) {
      try {
        await projectsApi.projectsProjectIdUsersPost({
          spaceId: myUser.space.id,
          projectId,
          projectsProjectIdUsersPostRequestBody: data.body,
        });
        this.users.splice(this.users.findIndex((d) => data === d), 1);
      } catch (err) {
        this.$appEmit('error', { err });
      }
    }

    this.saving = false;
  }

  async onInfinite($state: StateChanger) {
    const myUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
    const keyword = this.searchText.trim() === '' ? undefined : this.searchText.trim();

    try {
      const res = await spacesApi.spacesSpaceIdUsersGet({
        spaceId: myUser.space.id,
        projectIdNotExact: projectId,
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
