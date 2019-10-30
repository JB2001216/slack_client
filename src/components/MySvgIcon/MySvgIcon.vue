<template>
  <component :is="svgClass" class="mySvgIcon" :class="{[svgName]: true}" />
</template>


<style lang="stylus">
@import '../../stylus/_settings'

.mySvgIcon
  box-sizing: border-box
  width: var(--mySvgIconSize, 18px)
  height: var(--mySvgIconSize, 18px)
  &_fill
    fill: var(--mySvgIconColor, $colors.gray)
  &_stroke
    stroke: var(--mySvgIconColor, $colors.gray)
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import svgs from './svgs';

type SvgName = keyof typeof svgs;
const svgNames = Object.keys(svgs);


@Component({
  components: svgs,
})
export default class MySvgIcon extends Vue {
  @Prop({ type: String, required: true })
  name!: string;

  get svgName(): SvgName {
    const svgName = `Svg${this.name.replace(/^[a-z]/, (s) => s.toUpperCase())}`;
    return (svgNames.includes(svgName) ? svgName : svgNames[0]) as SvgName;
  }

  get svgClass() {
    return svgs[this.svgName];
  }
}
</script>
