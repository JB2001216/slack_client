<template>
  <div class="option_subColumn">
    <p v-if="projectUpdatable" class="option_subColumn_title">{{$t('views.setting.sub.projects.general')}}</p>
    <button class="option_subColumn_button green">{{$t('views.setting.sub.projects.members')}}</button>
    <p v-if="projectUpdatable" class="option_subColumn_title">{{$t('views.setting.sub.projects.taskSettings')}}</p>
    <p v-if="projectUpdatable" class="option_subColumn_title">{{$t('views.setting.sub.projects.noteSettings')}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Perm } from '@/lib/permissions';

@Component
export default class ProjectsSub extends Vue {
  get projectUpdatable() {
    return this.$store.getters.activeUser.activeProjectMyPerms.includes(Perm.UPDATE_PROJECT);
  }
}
</script>
