<template>
  <div
    v-if="option"
    class="status"
    :style="{'background-color': option.color || defaultColor}"
  >
    {{ option.name }}
  </div>
</template>

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

  defaultColor = '#6FCF97';
}
</script>
