<template>
  <div class="setting_main_spaceMemberInvite">
    <!-- <h3 class="option_mainColumn_title">{{$t('views.setting.main.spaceMemberInvite.invitationLink')}}</h3> -->
    <div class="option_spaceMemberInvite">
      <!-- <div class="option_spaceMemberInvite_link">
        <table>
          <tr>
            <th>
              <p>https://a.ernie.space/invide/testassa</p>
            </th>
            <td>
              <button class="option_spaceMemberInvite_button">{{$t('views.setting.main.spaceMemberInvite.copy')}}</button>
            </td>
          </tr>
        </table>
      </div> -->
      <form class="option_spaceMemberInvite_table" @submit.prevent="save()">
        <table>
          <tr>
            <th>{{$t('views.setting.main.spaceMemberInvite.email')}}</th>
            <th>{{$t('views.setting.main.spaceMemberInvite.account')}}</th>
            <th>{{$t('views.setting.main.spaceMemberInvite.role')}}</th>
          </tr>
          <template v-for="(r, i) in rows">
            <tr :key="`body_${i}`">
              <td>
                <input type="email" v-model="r.body.email" :class="{error: r.errors.email || r.errors.nonFieldErrors}" placeholder="sample@gmail.com">
              </td>
              <td>
                <input type="text" v-model="r.body.account" :class="{error: r.errors.account}" :placeholder="$t('views.setting.main.spaceMemberInvite.accountSample')">
              </td>
              <td class="clearfix">
                <div class="select" :class="{error: r.errors.spaceRoleId}" >
                  <my-space-role-select v-model="r.body.spaceRoleId" :my-role="myRole" />
                </div>
                <button v-if="rows.length > 1" @click="deleteRow(i)" type="button" />
              </td>
            </tr>
            <tr :key="`errors_${i}`" v-if="r.errors" class="errors">
              <td colspan="3">
                <template v-for="(errors, f) in r.errors">
                  <div v-for="(e, errorIndex) in errors" :key="errorIndex">
                    <span v-if="errorFields.includes(f)">[{{$t(`views.setting.main.spaceMemberInvite.${f}`)}}] </span>
                    <span>{{e}}</span>
                  </div>
                </template>
              </td>
            </tr>
          </template>
        </table>
        <div class="option_spaceMemberInvite_addButton clearfix">
          <button class="option_spaceMemberInvite_addButton_button" @click="addRow()" type="button">{{$t('views.setting.main.spaceMemberInvite.addAnEntryField')}}</button>
          <button class="option_spaceMemberInvite_button" type="submit">{{$t('views.setting.main.spaceMemberInvite.sendInvitation')}}</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style lang="stylus">
.setting_main_spaceMemberInvite
  .option_spaceMemberInvite_table
    input.error, .select.error select
      background: #fbeeee
    tr.errors
      td
        padding-top: 0
        padding-left: 10px
        color: #e02d2d
        font-size: 13px
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { apiRegistry, SpacesApi, SpacesSpaceIdUsersInviteByEmailPostRequestBody, ApiErrors, getJsonFromResponse } from '@/lib/api';
import { SpaceRoles, SpaceRole } from '@/lib/permissions';

import MySpaceRoleSelect from '@/components/MySpaceRoleSelect.vue';

@Component({
  components: {
    MySpaceRoleSelect,
  },
})
export default class SpaceMemberInvite extends Vue {
  rows: {
    body: SpacesSpaceIdUsersInviteByEmailPostRequestBody;
    errors: {[field: string]: string[]};
  }[] = [];

  initialRowCount = 3;
  saving = false;
  // フィールド名を翻訳可能なエラーフィールド名
  errorFields = ['email', 'account', 'spaceRoleId'];

  get myRole() {
    return this.$store.getters.activeUser.mySpaceRole!;
  }

  get selectableRoles() {
    return [...SpaceRoles.getSelectables(this.myRole)];
  }

  addRow() {
    if (this.saving) return;
    this.rows.push({
      body: {
        email: '',
        account: '',
        spaceRoleId: this.selectableRoles[this.selectableRoles.length - 1].id,
      },
      errors: {},
    });
  }

  deleteRow(index: number) {
    if (this.saving) return;
    if (index < this.rows.length) {
      this.rows.splice(index, 1);
    }
  }

  async save() {
    if (this.saving) return;

    this.rows.forEach((r) => {
      r.errors = {};
    });

    let rows = this.rows.filter((r) => r.body.email.trim() !== '' || r.body.account.trim() !== '');
    if (!rows.length) return;

    const myUser = this.$store.state.activeUser.myUser!;
    const spacesApi = apiRegistry.load(SpacesApi, myUser.token);

    try {
      this.saving = true;
      await spacesApi.spacesSpaceIdUsersInviteByEmailPost({
        spaceId: myUser.space.id,
        spacesSpaceIdUsersInviteByEmailPostRequestBody: rows.map((r) => r.body),
      });
      this.$flash(this.$t('views.setting.main.spaceMemberInvite.invitedMessage').toString(), 'success');
      this.$store.mutations.settingRouter.to('space-members');

    } catch (err) {
      if (err instanceof Response) {
        const json = await getJsonFromResponse(err);
        if (json && json.error) {
          if (ApiErrors.ValidationError === json.error) {
            rows.forEach((r, i) => {
              r.errors = json.data[i];
            });
          }
        }
      }
      this.$appEmit('error', { err });

    } finally {
      this.saving = false;
    }
  }

  beforeMount() {
    [...Array(this.initialRowCount)].forEach(() => {
      this.addRow();
    });
  }
}
</script>
