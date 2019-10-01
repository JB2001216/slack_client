<template>
  <dl class="myProjectStatusInput list_status" :class="{disabled}">
    <template v-for="(o,i) in progressOptions">
      <dd
        :key="`dd-${o.id}`"
        :style="{
          '--task-startColor': getColor(o),
          '--task-endColor': i + 1 < progressOptions.length ? getColor(progressOptions[i+1]) : ' ',
        }"
        class="item"
        @click="select(o)"
      >{{o.name}}</dd>
    </template>
    <dd
      v-if="etcOptions.length"
      @click.stop="showOtherDialog()"
      class="other"
      :style="{'background-color': isEtc(selectedOption) ? (selectedOption.color || defaultColor) : undefined}"
    >
      <span>{{isEtc(selectedOption) ? selectedOption.name : $t('components.myProjectStatusInput.others')}}</span>
      <div v-if="selectingEtc" class="other_dialog">
        <div
          v-for="o in etcOptions"
          :key="o.id"
          :style="{'background-color': o.color || defaultColor}"
          class="other_dialog_item item"
          @click="select(o)"
        >{{o.name}}</div>
      </div>
    </dd>
    <dd v-else style="display:none;" />
  </dl>
</template>

<style lang="stylus" scoped>
.myProjectStatusInput
  .item
    cursor: pointer
  .other
    position: relative
    width: auto
    background-color: #C4C4C4
    &_dialog
      position: absolute
      top: 34px
      left: 0
      z-index: 4;
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
import { ProjectStatusCategory } from '@/consts';

interface ProjectStatusOption {
  id: number;
  category: ProjectStatusCategory;
  name: string;
  sort: number;
  color: string | null;
}

@Component
export default class MyProjectStatusInput extends Vue {
  @Prop({ required: true })
  options!: ProjectStatusOption[] | null;

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({ type: Number, default: null })
  value!: number | null;

  selectingEtc = false;
  inactiveColor = '#C4C4C4';
  defaultColor = '#6FCF97';

  get progressOptions() {
    if (!this.options) return [];
    return this.options.filter((o) => this.isProgress(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get etcOptions() {
    if (!this.options) return [];
    return this.options.filter((o) => this.isEtc(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get selectedOption() {
    if (!this.options) return null;
    if (this.value) {
      const option = this.options.find((o) => o.id === this.value);
      if (option) {
        return option;
      }
    }
    return null;
  }

  select(o: ProjectStatusOption) {
    if (this.disabled) return;
    this.$emit('input', o.id);
  }

  showOtherDialog() {
    if (this.disabled) return;
    this.selectingEtc = !this.selectingEtc;
  }

  isActive(o: ProjectStatusOption) {
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

  getColor(o: ProjectStatusOption) {
    return this.isActive(o) ? (o.color || this.defaultColor) : this.inactiveColor;
  }

  isProgress(o: ProjectStatusOption | null) {
    return o && o.category === ProjectStatusCategory.Progress;
  }

  isEtc(o: ProjectStatusOption | null) {
    return o && o.category === ProjectStatusCategory.Etc;
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
