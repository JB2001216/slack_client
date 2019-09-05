<template>
  <div class="option_subColumn">
    <p class="option_subColumn_title">{{$t('views.setting.sub.spaces.general')}}</p>
    <button class="option_subColumn_button green">{{$t('views.setting.sub.spaces.members')}}</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SpacesSub extends Vue {
}
</script>
