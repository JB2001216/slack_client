<template>
  <div class="option_spaceMemberAdd">
    <h3 class="option_spaceMemberAdd_title">
      {{ $t('views.setting.main.projectMemberAdd.title', {projectName: activeProject.displayName}) }}
    </h3>
    <my-space-user-search-input
      class="option_spaceMemberAdd_search"
      :my-user="myUser"
      :project-id-not-exact="activeProject.id"
      :selected-user-ids="selectedUserIds"
      @select="onSearchUserSelect"
    />
    <div v-if="users.length" class="option_spaceMemberAdd_table">
      <table>
        <tr>
          <th />
          <th>{{ $t('views.setting.main.projectMemberAdd.email') }}</th>
          <th>{{ $t('views.setting.main.projectMemberAdd.name') }}</th>
          <th>{{ $t('views.setting.main.projectMemberAdd.role') }}</th>
        </tr>
        <tr v-for="data in users" :key="data.user.id">
          <td>
            <div class="option_spaceMember_table_img">
              <my-space-user-avatar :user="data.user" :size="40" shape="roundedSquare" />
            </div>
          </td>
          <td>{{ data.user.email }}</td>
          <td>{{ data.user.displayName || data.user.account }}</td>
          <td class="clearfix">
            <my-project-role-select
              v-model="data.body.projectRoleId"
              class="select basicSelect"
              :my-space-role="mySpaceRole"
              :my-project-role="myProjectRole"
              :current-space-role="getSpaceRole(data.user.spaceRoleId)"
            />
            <button @click="onRemove(data.user.id)" />
          </td>
        </tr>
      </table>
      <div class="option_spaceMemberAdd_addButton clearfix">
        <button class="basicButtonPrimary wide" @click="save()">
          {{ $t('views.setting.main.projectMemberAdd.addMembers') }}
        </button>
      </div>
    </div>

    <my-confirm-change-discard-dialog
      :changes="changes"
      :next="nextRouteForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscard"
    />
  </div>
</template>


<style lang="stylus">
.option_spaceMemberAdd
  &_search
    margin-top: 25px
    padding-bottom: 40px
    border-bottom: 1px solid #e0e0e0
</style>


<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { apiRegistry, SpacesApi, ProjectsApi, ApiErrors, getJsonFromResponse, SpaceUser, ProjectsProjectIdUsersPostRequestBody } from '@/lib/api';
import { SpaceRoles, SpaceRole, ProjectRoles } from '@/lib/permissions';
import MyProjectRoleSelect from '@/components/MyProjectRoleSelect.vue';
import ConfirmChangeDiscardForSettingMixin from '@/mixins/ConfirmChangeDiscardForSettingMixin';

@Component({
  components: {
    MyProjectRoleSelect,
  },
})
export default class ProjectMemberAdd extends Mixins(ConfirmChangeDiscardForSettingMixin) {
  users: { user: SpaceUser; body: ProjectsProjectIdUsersPostRequestBody }[] = [];
  page = 1;
  limit = 10;
  infiniteId = +new Date();
  searchText = '';
  searchedUsers: SpaceUser[] = [];
  searchNextTimeId: NodeJS.Timeout | null = null;
  searchIntervalMsec = 1000;
  saving = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get activeProject() {
    return this.$store.getters.activeUser.activeProject!;
  }

  get selectedUserIds() {
    return this.users.map((d) => d.user.id);
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

  get defaultRole() {
    const roles = this.selectableRoles;
    return roles[roles.length - 1];
  }

  get changes() {
    return !!this.users.length;
  }

  getSpaceRole(spaceRoleId: number) {
    return SpaceRoles.get(spaceRoleId);
  }

  onSearchUserSelect(user: SpaceUser) {
    if (this.users.find((d) => d.user.id === user.id)) {
      return;
    }
    this.users.push({
      user,
      body: {
        userId: user.id,
        projectRoleId: this.defaultRole.id,
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

    const projectsApi = apiRegistry.load(ProjectsApi, this.myUser.token);
    const errorUsers: this['users'] = [];

    for (const data of this.users) {

      await projectsApi.projectsProjectIdUsersPost({
        spaceId: this.myUser.space.id,
        projectId: this.activeProject.id,
        projectsProjectIdUsersPostRequestBody: data.body,
      }).then(() => {
        this.$flash(this.$t('views.setting.main.projectMemberAdd.addedMessage').toString(), 'success');
      }).catch((err) => {
        errorUsers.push(data);
        this.$appEmit('error', { err });
      });

    }

    if (!errorUsers.length) { this.$store.mutations.settingRouter.setName('project-members'); }

    this.users = errorUsers;
    this.saving = false;

  }

}
</script>
