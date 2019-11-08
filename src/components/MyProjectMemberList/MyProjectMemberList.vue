<template>
  <div class="myChargerInput" :class="{disabled}">
    <canvas ref="canvas" class="myChargerInput_canvas" />
    <div ref="main" class="myChargerInput_main">
      <div v-if="projectUsers" class="myChargerInput_chargeUsers">
        <div class="myChargerInput_chargeUsers_item editButton" @click="onAddProjectMember()">
          <div class="myChargerInput_chargeUsers_item_name">
            <span class="myChargerInput_chargeUsers_item_name_box">{{ $t('components.myChargerInput.addMembers') }}</span>
          </div>
          <span class="editButton_icon">
            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 13h-19.99999v-2h19.99999z" /><path d="m11 22v-20.00003h2v20.00003z" /></svg>
          </span>
        </div>
        <div v-if="projectUsers.length - displayChargeUsers.length > 0" class="myChargerInput_chargeUsers_item otherCount" @click="onAddProjectMemberSettings()">
          <span>+{{ projectUsers.length - displayChargeUsers.length }}</span>
        </div>
        <template>
          <my-space-user
            v-for="userId in displayChargeUsersReverse"
            :key="userId"
            v-slot="{user}"
            tag="div"
            :user-id="userId"
            class="myChargerInput_chargeUsers_item user"
          >
            <div class="myChargerInput_chargeUsers_item_name">
              <span v-if="user" class="myChargerInput_chargeUsers_item_name_box">{{ user.displayName || user.account }}</span>
            </div>
            <my-space-user-avatar class="myChargerInput_chargeUsers_item_avatar" :user="user" :size="32" shape="circle" />
          </my-space-user>
        </template>
      </div>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../stylus/_settings'

.myChargerInput
  width: 100%
  &_main
    display: flex
    flex-wrap: nowrap
    user-select: none
    width: 100%
  &_canvas
    display: none
  &_batonUser
    &_item
      max-width: 244px
      height: 40px
      border-radius: 20px
      background-color: $colors.whiteDarken1
      position: relative
      padding-right: 8px
      &_avatar
        position: absolute
        left: 4px
        top: 4px
      &_name
        font-size: 13px
        font-weight: bold
        display: block
        width: 100%
        padding-left: 44px
        padding-top: 10px
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
      &_badge
        background-color: $themeColors.active
        display: inline-block
        position: absolute
        top: -7px
        left: calc(50% - 17px)
        width: 34px
        height: 15px
        line-height: 15px
        text-align: center
        border-radius: 8px
        font-weight: bold
        color: #fff
        font-size: 9px

  &_chargeUsers
    display: flex
    flex-wrap: nowrap
    flex-direction: row-reverse
    align-items: center
    margin-left: 4px
    height: 40px
    &_item
      margin-right: -4px
      cursor: pointer
      transition: all 0.5s
      height: 36px
      position: relative
      &_avatar
        border: #fff 2px solid
        box-sizing: content-box !important
        transition: transform 0.5s
      &_name
        position: absolute
        top: -40px
        width: 100%
        left: 0
        display: none
        justify-content: center
        align-items: center
        &_box
          font-size: 12px
          color: $colors.white
          background $colors.grayDarken3
          padding: 4px 8px
          white-space: nowrap
          border-radius: 4px
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
          z-index: 1
        &:before
          content: ''
          position: absolute
          top: 100%
          left: 50%
          margin-left: -8px
          border: 8px solid transparent
          border-top: 8px solid $colors.grayDarken3
          transform: scaleX(0.75)
          z-index: 2
        &:after
          content: ''
          position: absolute
          top: 100%
          left: 50%
          margin-left: -8px
          border: 8px solid transparent
          border-top: 8px solid $colors.grayDarken3
          transform: scaleX(0.75)
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.16))

      &.user
        .myChargerInput_chargeUsers_item_delete
          display: flex
          position: absolute
          border-radius: 50%
          right: 5px
          bottom: -5px
          height: 17px
          width: 17px
          border: 1px solid #FFFFFF
          background-color: $themeColors.icon
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
          text-align: center
          font-size: 10px
          line-height: 10px
          color: #fff
          font-weight: bold
          justify-content: center
          align-items: center
          opacity: 0
          transition: opacity 0.7s, transform 0.5s
          transform: scale(0.75, 0.75)
          pointer-events: none
          &:hover
            background-color: $themeColors.iconDarken1
        &:hover
          padding: 0 12px
          .myChargerInput_chargeUsers_item_name
            display: flex
          .myChargerInput_chargeUsers_item_avatar
            border: 2px solid $themeColors.active
            transform: scale(1.25, 1.25)
          .myChargerInput_chargeUsers_item_delete
            opacity: 1
            transform: scale(1, 1)
            pointer-events: auto

      &.otherCount
        span
          display: block
          width: 32px
          line-height: 32px
          border: #fff 2px solid
          border-radius: 50%
          font-size: 12px
          color: #333
          background: $colors.lightGrayLighten2
          white-space: nowrap
          text-align: center
          box-sizing: content-box
          &:hover
            background: #E2E2E2
      &.editButton
        margin-left: 6px
        .editButton_icon
          display: flex
          justify-content: center
          align-items: center
          width: 32px
          height: 32px
          border: #E0E0E0 1px dotted
          border-radius: 50%
          margin-top: 2px
          svg
            stroke: #6E6E6E
            fill: #6E6E6E
            stroke-width: 0.1
        &:hover
          .editButton_icon
            background: $colors.whiteDarken1
          .myChargerInput_chargeUsers_item_name
            display: flex
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { LoggedInUser } from '@/store/root';
import { TranslateResult } from 'vue-i18n';
import * as api from '@/lib/api';
import store from '@/store';

const styles = {
  projectUserHoverWidth: 60 - 4,
  projectUserWidth: 32,
  editButtonWidth: 32,
  editButtonMarginLeft: 6,
};

@Component
export default class MyProjectMemberList extends Vue {
  $refs!: {
    canvas: HTMLCanvasElement;
    main: HTMLDivElement;
  }

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({ required: true })
  myUser!: LoggedInUser;

  @Prop({ default: null })
  projectIdExact!: number | null;

  @Prop({ default: null })
  dialogTitle!: string | TranslateResult | null;

  componentWidth: number = 0;
  resizeObserver: ResizeObserver = null as any;
  projectUsers: number[] = [];

  showedDialog = false;

  get displayChargeUserCount() {
    const componentWidth = this.componentWidth;
    if (!this.$refs.canvas) return 0;

    const restWidth = componentWidth - styles.projectUserHoverWidth - styles.editButtonWidth - styles.editButtonMarginLeft;
    return Math.floor(restWidth / styles.projectUserWidth);
  }

  get displayChargeUsers() {
    if (!this.projectUsers) return [];
    const chargeUsers = this.projectUsers;
    if (chargeUsers.length <= this.displayChargeUserCount) return chargeUsers;
    return chargeUsers.slice(0, this.displayChargeUserCount);
  }

  get displayChargeUsersReverse() {
    return this.displayChargeUsers.concat().reverse();
  }

  setTimeoutForProjectUsers() {
    setTimeout(() => {
      if (this.$store.state.settingRouter.name === null) {
        this.initProjectUsers();
      } else {
        this.setTimeoutForProjectUsers();
      }
    }, 100);
  }

  onAddProjectMember() {
    this.$store.actions.settingRouter.to('project-member-add');
    this.setTimeoutForProjectUsers();
  }

  onAddProjectMemberSettings() {
    this.$store.actions.settingRouter.to('project-members');
    this.setTimeoutForProjectUsers();
  }

  onResize(entries: ResizeObserverEntry[]) {
    for (const el of entries) {
      this.componentWidth = el.contentRect.width;
    }
  }

  async initProjectUsers() {
    const loginUser = store.state.activeUser.myUser!;
    const ProjectsApi = api.apiRegistry.load(api.ProjectsApi, loginUser.token);

    const users = await ProjectsApi.projectsProjectIdUsersGet({
      spaceId: store.state.activeUser.myUser!.space.id,
      projectId: store.getters.activeUser.activeProjectId!,
    });
    this.projectUsers = users.results.map((user) => user.userId);
  }

  mounted() {
    this.resizeObserver = new window.ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.$refs.main);
    this.initProjectUsers();
  }

  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$el);
      this.resizeObserver.disconnect();
    }
  }
}
</script>
