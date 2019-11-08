<template>
  <div class="subColumn">
    <div class="subColumn_head columnTitle">
      <h2>{{ project ? project.displayName : '' }}</h2>
      <div class="subColumn_head_toolbar">
        <router-link :to="{name: 'home' }">
          <my-svg-icon class="subColumn_head_toolbar_item" name="home" />
        </router-link>
        <my-svg-icon class="subColumn_head_toolbar_item" name="atsign" />
        <my-svg-icon class="subColumn_head_toolbar_item" name="star" />
        <my-svg-icon class="subColumn_head_toolbar_item" name="search" />
        <my-simple-menu class="subColumn_head_toolbar_item subColumn_head_menuContainer">
          <template v-slot="{open, close, opened}">
            <my-svg-icon name="menu" @click.stop.prevent="opened ? close() : open()" />
          </template>
          <template v-slot:items>
            <li v-if="projectUserAddable" @click="$store.actions.settingRouter.to('project-member-add')">
              <span>{{ $t(`views.subColumn.projectMenu.addMembers`) }}</span>
            </li>
            <li @click="$store.actions.settingRouter.to(projectUpdatable ? 'project-general' : 'project-members')">
              <span>{{ $t(`views.subColumn.projectMenu.projectSettings`) }}</span>
            </li>
          </template>
        </my-simple-menu>
      </div>
    </div>
    <ul class="subColumn_tab">
      <li v-for="t in tabs" :key="t.name">
        <router-link
          :class="{[`open_tab_${t.name}`]: true, active: activeTab === t.name}"
          :to="{name: t.toName, params: tabToParams }"
        >
          {{ $t(`views.subColumn.tabs.${t.name}`) }}
        </router-link>
      </li>
    </ul>
    <div class="subColumn_body">
      <slot />
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_settings'

.subColumn
  box-sizing: border-box
  background: #FFF
  border-right: 1px solid $colors.lightGrayLighten2
  .columnTitle
    padding: $sizes.windowMarginTop 20px 27px
    display: flex
    justify-content: space-between
    align-items: center
    h2
      display: block
      width: calc(100% - 32px)
      font-size: 18px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
  &_tab
    display: flex
    justify-content: flex-start
    margin-left: 10px
    overflow: hidden
    a
      box-sizing: border-box
      display: block
      color: #999999
      text-decoration: none
      white-space: nowrap
      padding: 0 0 10px
      margin: 0 10px
      &.active
        color: #333333
        border-bottom: 4px solid $themeColors.active
      &:hover
        color: $themeColors.active
  &_head
    &_toolbar
      display: flex
      &_item
        cursor: pointer
        --mySvgIconSize: 19px
        --mySvgIconColor: $themeColors.icon
        &:hover
          --mySvgIconColor: $themeColors.iconDarken1
        &:not(:first-child)
          margin-left: 16px
    &_menuContainer
      .mySimpleMenu_popup
        width: auto
        ul
          width: auto
          min-width: 220px
          padding: 14px 0
          li
            font-size: 14px
            padding: 10px 24px
            white-space: nowrap
            &:hover
              background-color: $themeColors.accent
              color: #fff
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Perm } from '@/lib/permissions';
import { SubColumnTabNames } from '@/consts';

@Component
export default class SubColumnLayout extends Vue {
  @Prop({ type: String, default: null })
  activeTab!: SubColumnTabNames | null;

  tabs = [
    { name: SubColumnTabNames.task, toName: 'tasks' },
    { name: SubColumnTabNames.file, toName: 'files' },
    { name: SubColumnTabNames.note, toName: 'notes' },
    { name: SubColumnTabNames.ganttChart, toName: 'notes' },
  ];

  get tabToParams() {
    return {
      userId: this.$route.params.userId,
      projectId: this.$route.params.projectId,
    };
  }

  get project() {
    return this.$store.getters.activeUser.activeProject;
  }

  get projectUpdatable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.UPDATE_PROJECT);
  }

  get projectUserAddable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.ADD_PROJECT_USER);
  }
}
</script>
