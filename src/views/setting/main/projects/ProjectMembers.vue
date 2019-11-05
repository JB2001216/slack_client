<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">
      {{ $t('views.setting.main.projectMembers.memberList') }}
    </h3>
    <div class="option_spaceMember_table">
      <table>
        <tr>
          <th />
          <th>{{ $t('views.setting.main.projectMembers.email') }}</th>
          <th>{{ $t('views.setting.main.projectMembers.name') }}</th>
          <th>{{ $t('views.setting.main.projectMembers.role') }}</th>
        </tr>
        <my-space-user
          v-for="puser in pusers"
          :key="puser.userId"
          v-slot="{user}"
          tag="tr"
          :user-id="puser.userId"
        >
          <td>
            <div class="option_spaceMember_table_img">
              <my-space-user-avatar :user="user" :size="40" shape="roundedSquare" />
            </div>
          </td>
          <td>{{ user ? user.email : '' }}</td>
          <td>{{ user ? (user.displayName || user.account) : '' }}</td>
          <td class="clearfix">
            <div class="select">
              <my-project-role-select
                :value="puser.projectRoleId"
                :my-space-role="mySpaceRole"
                :my-project-role="myProjectRole"
                :current-space-role="puser.currentSpaceRole"
                :current-project-role="puser.currentProjectRole"
                @input="onProjectRoleChange($event, puser)"
              />
            </div>
            <button v-if="user && getRemovable(puser)" @click="removingUser = removingUser || user" />
          </td>
        </my-space-user>
        <infinite-loading v-if="pusersInit" :identifier="infiniteId" @infinite="onInfinite" />
      </table>
      <!-- メンバーが少ない場合 -->
      <!--
          <div v-if="projectUserAddable" class="option_spaceMember_addButton">
          <button @click="$store.mutations.settingRouter.to('project-member-add')">{{$t('views.setting.main.projectMembers.addMember')}}</button>
          </div>
          -->
    </div>
    <!-- メンバーが多い場合 -->
    <div v-if="projectUserAddable" class="option_spaceMember_addBar">
      <button @click="$store.mutations.settingRouter.to('project-member-add')">
        {{ $t('views.setting.main.projectMembers.addMember') }}
      </button>
    </div>

    <my-modal
      v-if="removingUser"
      :value="!!removingUser"
      class="modalDialog"
      content-class="modalDialog_content"
      @input="removingUser = null"
    >
      <p class="modalDialog_content_title">
        {{ $t('views.setting.main.projectMembers.removeConfirmMessage', { name: removingUser.displayName || removingUser.account, email: removingUser.email }) }}
      </p>
      <div class="modalDialog_content_footerButtons">
        <button class="basicButtonNormal modalDialog_content_footerButtons_button" @click="removingUser = null">
          {{ $t('common.no') }}
        </button>
        <button class="basicButtonDanger modalDialog_content_footerButtons_button" @click="remove()">
          {{ $t('common.yes') }}
        </button>
      </div>
    </my-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StateChanger } from 'vue-infinite-loading';
import { apiRegistry, SpaceUser, ProjectsApi, ProjectUser } from '@/lib/api';
import { SpaceRoles, SpaceRole, ProjectRoles, ProjectRole, Perm } from '@/lib/permissions';
import MyProjectRoleSelect from '@/components/MyProjectRoleSelect.vue';
import EventsSub from '@/events-subscription';

interface ProjectUserWithCurrentRole extends ProjectUser {
  currentSpaceRole: SpaceRole;
  currentProjectRole: ProjectRole | null;
}

@Component({
  components: {
    MyProjectRoleSelect,
  },
})
export default class SpaceMembers extends Vue {

  page = 1;
  limit = 30;
  infiniteId = +new Date();
  pusersInit: boolean = true;
  pusers: ProjectUserWithCurrentRole[] = [];
  saving = false;
  removingUser: SpaceUser | null = null;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get projectId() {
    return this.$store.state.activeUser.activeProjectData!.id;
  }

  get api() {
    return apiRegistry.load(ProjectsApi, this.myUser.token);
  }

  get mySpaceRole() {
    return this.$store.getters.activeUser.mySpaceRole!;
  }

  get myProjectRole() {
    return this.$store.getters.activeUser.activeProjectMyRole!;
  }

  get projectUserAddable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.ADD_PROJECT_USER);
  }

  created() {
    EventsSub.source.addEventListener('createProjectUser', this.createProjectUserTask);
    EventsSub.source.addEventListener('deleteProjectUser', this.deleteProjectUserTask);
  }

  createProjectUserTask(e: any): void {
    this.pusersInit = false;
    setTimeout(() => { this.pusersInit = true; }, 100);
  }

  deleteProjectUserTask(e: any): void {

    const data = JSON.parse(e.data);
    const isFireUser = data.userId === this.myUser.id;
    const currentUser = data.params.userId === this.myUser.id;

    if (currentUser) {
      this.$store.mutations.settingRouter.close();
      this.$flash(this.$t('views.setting.main.projectMembers.removedCrntUserMessage').toString(), 'success');
    }

    const index = this.pusers.findIndex((pu) => pu.userId === data.params.userId);
    if (index >= 0) { this.pusers.splice(index, 1); }

    if (isFireUser) { this.$flash(this.$t('views.setting.main.projectMembers.removedMessage').toString(), 'success'); }

  }

  async onInfinite($state: StateChanger) {

    try {

      const res = await this.api.projectsProjectIdUsersGet({
        spaceId: this.myUser.space.id,
        projectId: this.projectId,
        page: this.page,
        limit: this.limit,
      });

      const addData: ProjectUserWithCurrentRole[] = res.results.filter((r) => !this.pusers.find((pu) => pu.userId === r.userId))
        .map((pu) => Object.assign({}, pu, {
          currentSpaceRole: SpaceRoles.get(pu.spaceRoleId),
          currentProjectRole: pu.projectRoleId ? ProjectRoles.get(pu.projectRoleId) : null,
        }));

      if (addData.length) {
        this.pusers.push(...addData);
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

  async onProjectRoleChange(projectRoleId: number, user: ProjectUserWithCurrentRole) {
    if (this.saving) return;

    try {
      this.saving = true;
      const myUser = this.$store.state.activeUser.myUser!;
      const projectId = this.$store.state.activeUser.activeProjectData!.id;
      const projectsApi = apiRegistry.load(ProjectsApi, myUser.token);
      await projectsApi.projectsProjectIdUsersUserIdPut({
        spaceId: myUser.space.id,
        projectId,
        userId: user.userId,
        projectsProjectIdUsersUserIdPutRequestBody: {
          projectRoleId,
        },
      });
      user.projectRoleId = projectRoleId;
      user.currentProjectRole = ProjectRoles.get(projectRoleId);
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  async remove() {

    if (this.saving || !this.removingUser) return;

    try {

      this.saving = true;

      await this.api.projectsProjectIdUsersUserIdDelete({
        spaceId: this.myUser.space.id,
        projectId: this.projectId,
        userId: this.removingUser.id,
      });

      this.removingUser = null;

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }

  }

  getRemovable(puser: ProjectUserWithCurrentRole) {
    if (!this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.DELETE_PROJECT_USER)) {
      return false;
    }
    if (puser.currentSpaceRole.joinAllProjects) {
      return false;
    }
    if (this.myProjectRole && puser.currentProjectRole && !this.myProjectRole.checkManageable(puser.currentProjectRole)) {
      return false;
    }
    return true;
  }

  destroyed() {
    EventsSub.source.removeEventListener('createProjectUser', this.createProjectUserTask);
    EventsSub.source.removeEventListener('deleteProjectUser', this.deleteProjectUserTask);
  }

}
</script>
