<template>
  <div class="option_subColumn">
    <p class="option_subColumn_title">{{$t('views.setting.sub.projects.general')}}</p>
    <button class="option_subColumn_button green">{{$t('views.setting.sub.projects.members')}}</button>
    <p class="option_subColumn_title">{{$t('views.setting.sub.projects.taskSettings')}}</p>
    <p class="option_subColumn_title">{{$t('views.setting.sub.projects.noteSettings')}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProjectsSub extends Vue {
}
</script>
