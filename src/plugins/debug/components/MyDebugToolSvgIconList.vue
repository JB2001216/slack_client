<template>
  <my-modal :value="value" class="debugToolSvgIconList" @input="$emit('input', value)">
    <div v-for="n in svgNames" :key="n" class="debugToolSvgIconList_item" @click="onIconClick(n)">
      <span>{{ n }}</span>
      <my-svg-icon :name="n" />
    </div>
  </my-modal>
</template>

<style lang="stylus">
.debugToolSvgIconList
  background: rgba(0,0,0,0.5)
  .myModal_content
    width: 470px
    padding: 30px
    background: #fff
    border-radius: 4px
    display: flex
    flex-wrap: wrap
    justify-content: flex-start
  &_item
    font-size: 11px
    text-align: center
    padding: 10px 0
    width: 90px
    cursor: pointer
    &:hover
      background: #fee
    span
      display: block
      margin-bottom: 4px
    svg
      --my-svg-icon-size: 30px
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { clipboard } from 'electron';
import svgs from '@/components/MySvgIcon/svgs';

@Component
export default class MyDebugToolSvgIconList extends Vue {

  @Prop({ type: Boolean, required: true })
  value!: boolean;

  get svgNames() {
    return Object.keys(svgs).map((s) => s.replace(/^Svg/, '').replace(/^[A-Z]/, (s) => s.toLowerCase()));
  }

  onIconClick(name: string) {
    clipboard.writeText(`<my-svg-icon :name="${name}" />`);
    this.$flash('Copied code to clipboard.', 'success');
  }
}
</script>
