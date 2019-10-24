<template>
  <div class="subColumn">
    <div class="subColumn_head columnTitle">
      <h2>{{ project ? project.displayName : '' }}</h2>
      <my-simple-menu class="subColumn_head_menuContainer">
        <template v-slot="{open, close, opened}">
          <a class="subColumn_head_menu" href="#" @click.stop.prevent="opened ? close() : open()">
            <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path
                clip-rule="evenodd"
                d="m6.61537 12.3077c0 1.2745-1.03318 2.3077-2.30768 2.3077s-2.30769-1.0332-2.30769-2.3077 1.03319-2.3077 2.30769-2.3077 2.30768 1.0332 2.30768 2.3077zm7.69243 0c0 1.2745-1.0332 2.3077-2.3077 2.3077s-2.30768-1.0332-2.30768-2.3077 1.03318-2.3077 2.30768-2.3077 2.3077 1.0332 2.3077 2.3077zm5.3846 2.3077c1.2745 0 2.3077-1.0332 2.3077-2.3077s-1.0332-2.3077-2.3077-2.3077-2.3077 1.0332-2.3077 2.3077 1.0332 2.3077 2.3077 2.3077z"
                fill-rule="evenodd"
              />
            </svg>
          </a>
        </template>
        <template v-slot:items>
          <li v-if="projectUserAddable" @click="$store.mutations.settingRouter.to('project-member-add')">
            <span>{{ $t(`views.subColumn.projectMenu.addMembers`) }}</span>
          </li>
          <li @click="$store.mutations.settingRouter.to(projectUpdatable ? 'project-general' : 'project-members')">
            <span>{{ $t(`views.subColumn.projectMenu.projectSettings`) }}</span>
          </li>
        </template>
      </my-simple-menu>
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
@import '../../../../stylus/_fixed/base/_theme'
.subColumn
  &_head_menuContainer
    .other_status
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
            themeBackgroundColor('accent')
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
