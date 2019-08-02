<template>
  <dl class="myProjectStatusInput" :class="{disabled}">
    <template v-for="(o,i) in progressOptions">
      <dd
        :key="`dd-${o.id}`"
        :style="{'background-color': isActive(o) ? (o.color || defaultColor) : inactiveColor}"
        class="item"
        @click="select(o)"
      >{{o.name}}</dd>
      <svg :key="`svg1-${o.id}`" v-if="i < progressOptions.length - 1" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0.5 C0 0.5 4.5 5.69231 10 5.69231 C15.5 5.69231 20 0.5 20 0.5 V15.5 C20 15.5 15.5 10.3077 10 10.3077C4.5 10.3077 0 15.5 0 15.5 V0.5Z" :fill="inactiveColor"/>
      </svg>
    </template>
    <dd
      v-if="etcOptions.length"
      @click.stop="showOtherDialog()"
      class="other"
      :style="{'background-color': isEtc(selectedOption) ? (selectedOption.color || defaultColor) : undefined}"
    >
      <span>{{isEtc(selectedOption) ? selectedOption.name : 'その他'}}</span>
      <div v-if="selectingEtc" class="other_dialog">
        <div
          v-for="o in etcOptions"
          :key="o.id"
          :style="{'background-color': isActive(o) ? (o.color || defaultColor) : inactiveColor}"
          class="other_dialog_item item"
          @click="select(o)"
        >{{o.name}}</div>
      </div>
    </dd>
  </dl>
</template>

<style lang="stylus" scoped>
.myProjectStatusInput
  .item
    cursor: pointer
  .other
    position: relative
    width: auto;
    &_dialog
      position: absolute
      top: 34px
      left: 0
      &_item
        white-space: nowrap
        height: 32px
        padding: 9px 20px
        border-radius: 18px
        line-height: 1
        text-align: center
        margin-top: 6px
  &.disabled
    .item
      cursor: default
    .other
      cursor: default
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

enum ProjectStatusCategory {
  progress = 1,
  etc = 90,
}

interface ProjectStatus {
  id: number;
  category: ProjectStatusCategory;
  name: string;
  sort: number;
  color: string | null;
}

@Component
export default class MyProjectStatusInput extends Vue {
  @Prop({ type: Array, required: true })
  options!: ProjectStatus[];

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({ type: Number, default: null })
  value!: number | null;

  selectingEtc = false;
  inactiveColor = '#C4C4C4';
  defaultColor = '#6FCF97';

  get progressOptions() {
    return this.options.filter((o) => this.isProgress(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get etcOptions() {
    return this.options.filter((o) => this.isEtc(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get selectedOption() {
    if (this.value) {
      const option = this.options.find((o) => o.id === this.value);
      if (option) {
        return option;
      }
    }
    return null;
  }

  select(o: ProjectStatus) {
    if (this.disabled) return;
    this.$emit('input', o.id);
  }

  showOtherDialog() {
    if (this.disabled) return;
    this.selectingEtc = !this.selectingEtc;
  }

  isActive(o: ProjectStatus) {
    const selectedOption = this.selectedOption;
    if (!selectedOption) {
      return false;
    }
    if (o === selectedOption) {
      return true;
    }
    if (this.isProgress(selectedOption) &&
        this.isProgress(o) &&
        o.sort <= selectedOption.sort
    ) {
      return true;
    }
    return false;
  }

  isProgress(o: ProjectStatus | null) {
    return o && o.category === ProjectStatusCategory.progress;
  }

  isEtc(o: ProjectStatus | null) {
    return o && o.category === ProjectStatusCategory.etc;
  }

  onDocumentClick(ev: MouseEvent) {
    this.selectingEtc = false;
  }

  mounted() {
    document.addEventListener('click', this.onDocumentClick);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  }
}
</script>
