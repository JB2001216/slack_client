<template>
  <div
    v-if="option && type === 'simple'"
    class="myProjectStatus"
    :class="{[`type-${type}`]: true}"
    :style="{'color': option.color || defaultColor}"
  >
    {{ option.name }}
  </div>
</template>


<style lang="stylus">
.myProjectStatus
  &.type-simple
    font-size: 12px
    font-weight: bold
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface ProjectStatus {
  name: string;
  color: string | null;
}

@Component
export default class MyProjectStatus extends Vue {
  @Prop({ default: null })
  option!: ProjectStatus | null;

  @Prop({ type: String, default: 'simple' })
  type!: string;

  defaultColor = '#6FCF97';
}
</script>
