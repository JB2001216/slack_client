<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">
      {{ $t('views.setting.main.spaceMembers.memberList') }}
    </h3>
    <div class="option_spaceMember_table">
      <table>
        <tr>
          <th />
          <th>{{ $t('views.setting.main.spaceMembers.email') }}</th>
          <th>{{ $t('views.setting.main.spaceMembers.name') }}</th>
          <th>{{ $t('views.setting.main.spaceMembers.role') }}</th>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td>
            <div class="option_spaceMember_table_img">
              <my-space-user-avatar :user="user" :size="40" shape="roundedSquare" />
            </div>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.displayName || user.account }}</td>
          <td class="clearfix">
            <my-space-role-select
              class="select basicSelect"
              :value="user.spaceRoleId"
              :my-role="myRole"
              :current-role="user.currentRole"
              @input="onSpaceRoleChange($event, user)"
            />
            <button v-if="myRole.checkManageable(user.currentRole)" @click="removingUser = removingUser || user" />
          </td>
        </tr>
        <infinite-loading :identifier="infiniteId" @infinite="onInfinite" />
      </table>
      <!-- メンバーが少ない場合 -->
      <!--
          <div class="option_spaceMember_addButton">
          <button @click="$store.actions.settingRouter.to('space-member-invite')">{{$t('views.setting.main.spaceMembers.addMember')}}</button>
          </div>
          -->
    </div>
    <!-- メンバーが多い場合 -->
    <div class="option_spaceMember_addBar">
      <button @click="$store.actions.settingRouter.to('space-member-invite')">
        {{ $t('views.setting.main.spaceMembers.addMember') }}
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
        {{ $t('views.setting.main.spaceMembers.deleteConfirmMessage', { name: removingUser.displayName || removingUser.account, email: removingUser.email }) }}
      </p>
      <p class="modalDialog_content_description">
        {{ $t('views.setting.main.spaceMembers.deleteAttentionMessage') }}
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
import { apiRegistry, SpacesApi, SpaceUser } from '@/lib/api';
import { SpaceRoles, SpaceRole } from '@/lib/permissions';
import MySpaceRoleSelect from '@/components/MySpaceRoleSelect.vue';

interface SpaceUserWithCurrentRole extends SpaceUser {
  currentRole: SpaceRole;
}

@Component({
  components: {
    MySpaceRoleSelect,
  },
})
export default class SpaceMembers extends Vue {
  page = 1;
  limit = 30;
  infiniteId = +new Date();
  users: SpaceUserWithCurrentRole[] = [];
  saving = false;
  removingUser: SpaceUser | null = null;

  get myRole() {
    return this.$store.getters.activeUser.mySpaceRole!;
  }

  async onInfinite($state: StateChanger) {
    const myUser = this.$store.state.activeUser.myUser!;
    const spacesApi = apiRegistry.load(SpacesApi, myUser.token);

    try {
      const res = await spacesApi.spacesSpaceIdUsersGet({
        spaceId: myUser.space.id,
        page: this.page,
        limit: this.limit,
      });
      if (res.results.length) {
        this.$store.mutations.activeUser.addSpaceUser(...res.results);
      }
      const addData: SpaceUserWithCurrentRole[] = res.results.filter((r) => !this.users.find((u) => u.id === r.id))
        .map((u) => Object.assign({}, u, { currentRole: SpaceRoles.get(u.spaceRoleId) }));
      if (addData.length) {
        this.users.push(...addData);
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

  async onSpaceRoleChange(spaceRoleId: number, user: SpaceUserWithCurrentRole) {
    if (this.saving) return;

    try {
      this.saving = true;
      const myUser = this.$store.state.activeUser.myUser!;
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      await spacesApi.spacesSpaceIdUsersUserIdPut({
        spaceId: myUser.space.id,
        userId: user.id,
        spacesSpaceIdUsersUserIdPutRequestBody: {
          spaceRoleId,
        },
      });
      user.spaceRoleId = spaceRoleId;
      user.currentRole = SpaceRoles.get(spaceRoleId);
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  async remove() {
    if (this.saving) return;
    if (!this.removingUser) return;

    try {
      this.saving = true;
      const myUser = this.$store.state.activeUser.myUser!;
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      await spacesApi.spacesSpaceIdUsersUserIdDelete({
        spaceId: myUser.space.id,
        userId: this.removingUser.id,
      });
      const index = this.users.findIndex((u) => u === this.removingUser);
      if (index >= 0) {
        this.users.splice(index, 1);
      }
      this.removingUser = null;

    } catch (err) {
      this.$appEmit('error', { err });

    } finally {
      this.saving = false;
    }
  }
}
</script>
