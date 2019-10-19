<template>
  <div class="myChargerDialog" @click="onClose()">
    <div class="myChargerDialog_content" @click.stop>
      <div class="myChargerDialog_content_close" @click="onClose()">
        ×
      </div>
      <div class="myChargerDialog_content_header">
        <div class="myChargerDialog_content_header_title">
          {{ dialogTitle ? dialogTitle : $t('components.myChargerDialog.title') }}
        </div>
        <my-space-user-search-input
          v-if="!disabled"
          class="myChargerDialog_content_header_search"
          :my-user="myUser"
          :project-id-exact="projectIdExact"
          :selected-user-ids="chargeUsers"
          @select="addUser($event.id)"
        />
      </div>
      <div class="myChargerDialog_content_body">
        <table v-if="chargeUsers.length" class="myChargerDialog_content_body_list">
          <tbody>
            <my-space-user
              v-for="userId in chargeUsers"
              :key="userId"
              v-slot="{user}"
              tag="tr"
              class="myChargerDialog_content_body_list_item"
              :user-id="userId"
              :tag-class="{hover: hoverUser === userId}"
              @mouseenter="hoverUser = userId"
              @mouseleave="hoverUser = null"
              @click="baton(userId)"
            >
              <td class="myChargerDialog_content_body_list_item_avatar">
                <my-space-user-avatar :user="user" :size="40" shape="circle" />
              </td>
              <td class="myChargerDialog_content_body_list_item_info">
                <template v-if="user">
                  <span class="myChargerDialog_content_body_list_item_info_name">{{ user.displayName || user.account }}</span>
                  <span class="myChargerDialog_content_body_list_item_info_email">{{ user.email }}</span>
                </template>
              </td>
              <td class="myChargerDialog_content_body_list_item_badge">
                <span
                  v-if="value.batonUser === userId || (!hoverDeleteUser && hoverUser === userId && !disabled)"
                  :class="{old: value.batonUser === userId && !hoverDeleteUser && hoverUser && hoverUser !== userId && !disabled}"
                >{{ $t('components.myChargerDialog.baton') }}</span>
              </td>
              <td class="myChargerDialog_content_body_list_item_delete">
                <span
                  v-if="!disabled"
                  :class="{hover: hoverDeleteUser === userId}"
                  @mouseenter="hoverDeleteUser = userId"
                  @mouseleave="hoverDeleteUser = null"
                  @click="deleteUser(userId)"
                >×</span>
              </td>
            </my-space-user>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../stylus/_fixed/base/_variable'
@import '../../stylus/_fixed/base/_theme'

.myChargerDialog
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  display: flex
  justify-content: center
  align-items: center
  background: rgba(0, 0, 0, 0.32)
  z-index: 100
  &_content
    width: 640px
    height: 640px
    max-height: calc(100vh - 20px)
    border-radius: 4px
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
    background: #fff
    position: relative
    &_close
      position: absolute
      right: 20px
      top: 20px
      font-size: 24px
      line-height: 24px
      color: $colors.gray
      cursor: pointer
    &_header
      border-bottom: solid 1px $colors.lightGrayLighten2
      padding: 26px
      &_title
        font-size: 20px
        font-weight: bold
      &_search
        margin-top: 18px
    &_body
      height: calc(100% - 145px)
      padding-top: 10px
      padding-bottom: 50px
      overflow-y: scroll
      &_list
        width: 511px
        margin: auto
        &_item
          border-bottom: solid 1px $colors.lightGrayLighten2
          height: 72px
          cursor: pointer
          user-select: none
          background: #fff
          &.hover
            background: $colors.whiteDarken1
          td
            vertical-align: middle
          &_avatar
            width: 76px
            text-align: center
            .mySpaceUserAvatar
              vertical-align: middle
          &_info
            &_name
              font-size 14px
              display: block
            &_email
              font-size: 12px
              color: #999
              display: block
          &_badge
            width: 54px
            text-align: center
            span
              themeBackgroundColor('active')
              display: inline-block
              line-height: 24px
              width: 48px
              border-radius: 12px
              text-align: center
              font-weight: bold
              font-size: 12px
              color: #fff
              &.old
                opacity: 0.4
          &_delete
            width: 44px
            text-align: center
            span
              font-size: 18px
              line-height: 18px
              color: $colors.gray
              &.hover
                font-size: 19px
                line-height: 19px
                font-weight: 900
</style>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { colorPickerDefaultColors } from '@/consts';
import { MyChargerDialogValue, MyChargerDialogChangeEvent } from './types';
import { LoggedInUser } from '@/store/root';
import { TranslateResult } from 'vue-i18n';

@Component
export default class MyChargerDialog extends Vue {
  @Prop({ default: null })
  value!: MyChargerDialogValue;

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({ required: true })
  myUser!: LoggedInUser;

  @Prop({ default: null })
  projectIdExact!: number | null;

  @Prop({ default: null })
  dialogTitle!: string | TranslateResult | null;

  originalBatonUser: number | null = null;
  hoverUser: number | null = null;
  hoverDeleteUser: number | null = null;

  get chargeUsers() {
    if (!this.value) return [];

    const chargeUsers = this.value.chargeUsers.concat();
    if (this.originalBatonUser) {
      const index = chargeUsers.indexOf(this.originalBatonUser);
      if (index >= 0) {
        chargeUsers.splice(index, 1);
      }
      chargeUsers.unshift(this.originalBatonUser);
    }
    return chargeUsers;
  }

  addUser(id: number) {
    if (this.value!.chargeUsers.includes(id)) return;
    this.emitInput(
      {
        batonUser: this.value!.batonUser ? this.value!.batonUser : id,
        chargeUsers: this.value!.chargeUsers.concat([id]),
      },
      { id, action: 'add' }
    );
  }

  baton(id: number) {
    if (!this.value!.chargeUsers.includes(id)) return;
    if (this.value!.batonUser === id || this.hoverDeleteUser || this.hoverUser !== id) return;

    const chargeUsers = this.value!.chargeUsers.concat();
    if (this.originalBatonUser && this.originalBatonUser !== id && !chargeUsers.includes(this.originalBatonUser)) {
      chargeUsers.push(this.originalBatonUser);
    }
    this.emitInput(
      {
        batonUser: id,
        chargeUsers: chargeUsers,
      },
      { id, action: 'baton' }
    );
  }

  deleteUser(id: number) {
    if (!this.value!.chargeUsers.includes(id)) return;
    if (this.originalBatonUser === id) {
      this.originalBatonUser = null;
    }
    const chargeUsers = this.value!.chargeUsers.filter((cid) => cid !== id);
    this.emitInput(
      {
        batonUser: this.value!.batonUser === id ? (chargeUsers.length ? chargeUsers[0] : null) : this.value!.batonUser,
        chargeUsers,
      },
      { id, action: 'delete' }
    );
  }

  emitInput(value: this['value'], target?: MyChargerDialogChangeEvent['target']) {
    if (this.disabled) return;
    this.$emit('input', value);
    this.$emit('change', { value, target });
  }

  onClose() {
    this.$emit('close');
  }

  beforeMount() {
    this.originalBatonUser = this.value ? this.value.batonUser : null;
  }
}
</script>
