<template>
  <div class="option_subColumn">
    <template v-for="(item, $index) in menu">
      <template v-if="item.showable()">
        <button
          :key="`item-${$index}-b`"
          :class="{active: item.routeName === currentRouterName}"
          class="option_subColumn_button green"
          @click="$store.actions.settingRouter.to(item.routeName)"
        >
          {{ item.title() }}
        </button>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Perm } from '@/lib/permissions';
import { TranslateResult } from 'vue-i18n';
import i18n from '@/i18n';

@Component
export default class ProjectsSub extends Vue {
  menu: {
    title: () => TranslateResult;
    showable: () => boolean;
    routeName: string;
  }[] = [
    {
      title: () => i18n.t('views.setting.sub.projects.general'),
      showable: () => this.projectUpdatable,
      routeName: 'project-general',
    },
    {
      title: () => i18n.t('views.setting.sub.projects.members'),
      showable: () => true,
      routeName: 'project-members',
    },
    {
      title: () => i18n.t('views.setting.sub.projects.taskSettings'),
      showable: () => this.projectUpdatable,
      routeName: 'task-status',
    },
    {
      title: () => i18n.t('views.setting.sub.projects.noteSettings'),
      showable: () => this.projectUpdatable,
      routeName: 'note-status',
    },
  ];

  get currentRouterName() {
    return this.$store.state.settingRouter.name;
  }

  get projectUpdatable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.UPDATE_PROJECT);
  }
}
</script>
