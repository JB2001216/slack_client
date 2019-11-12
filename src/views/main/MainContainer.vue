<template>
  <div class="mainContainer" :class="{fullMainColumn}">
    <team-column />
    <div class="mainContainer_slide">
      <router-view name="projectColumn" />
      <router-view name="subColumn" />
      <router-view name="mainColumn" />
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../stylus/_settings'

$mainColumnWidth = 'calc(100vw - %s - %s - %s)' % ($views.main.teamColumnWidth $views.main.projectColumnWidth $views.main.subColumnWidth)
$slideGridAreas = 'projectColumn subColumn mainColumn'
$slideGridColumns = $views.main.projectColumnWidth $views.main.subColumnWidth $mainColumnWidth
$slideGridColumnsOnFullMainColumnAnimation = $views.main.projectColumnWidth $views.main.subColumnWidth ('calc(100vw - %s)' % ($views.main.teamColumnWidth))
$slideTransformXOnFullMainColumnAnimation = 'translateX(calc((%s + %s) * -1))' % ($views.main.projectColumnWidth $views.main.subColumnWidth)
$mainContainerWidthOnFullMainColumnAnimation = 'calc(100vw + %s + %s)' % ($views.main.projectColumnWidth $views.main.subColumnWidth)

@keyframes mainContainerEnableFullMainColumnForMainContainer
  0%
  100%
    width: $mainContainerWidthOnFullMainColumnAnimation

@keyframes mainContainerEnableFullMainColumnForMainContainerSlide
  0%
  100%
    grid-template-areas: $slideGridAreas
    grid-template-columns: $slideGridColumnsOnFullMainColumnAnimation
  0%
    transform: translateX(0)
  100%
    transform: $slideTransformXOnFullMainColumnAnimation

@keyframes mainContainerEnableFullMainColumnForHideColumn
  0%
  100%
    width: auto
    height: 100%
    opacity: 1

@keyframes mainContainerDisableFullMainColumnForMainContainer
  0%
  100%
    width: $mainContainerWidthOnFullMainColumnAnimation

@keyframes mainContainerDisableFullMainColumnForMainContainerSlide
  0%
    transform: $slideTransformXOnFullMainColumnAnimation
  100%
    transform: translateX(0)

.mainContainer
  height: 100vh
  display: grid
  grid-template-areas: 'teamColumn slide'
  grid-template-columns: $views.main.teamColumnWidth 1fr
  grid-template-rows: 1fr
  grid-gap: 0
  .teamColumn
    grid-area: teamColumn
    z-index: 2
  &_slide
    grid-area: slide
    height: 100%
    display: grid
    grid-template-areas: $slideGridAreas
    grid-template-columns: $slideGridColumns
    grid-template-rows: 1fr
    grid-gap: 0
    .projectColumn
      grid-area: projectColumn
    .subColumn
      grid-area: subColumn
    .mainColumn
      grid-area: mainColumn
      position: relative
  &.fullMainColumn
    animation: mainContainerEnableFullMainColumnForMainContainer $views.main.fullMainColumnAnimeDuration $views.main.fullMainColumnAnimeTiming
    .teamColumn
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.7)
    .mainContainer_slide
      animation: mainContainerEnableFullMainColumnForMainContainerSlide $views.main.fullMainColumnAnimeDuration $views.main.fullMainColumnAnimeTiming
      grid-template-areas: 'mainColumn'
      grid-template-columns: 1fr
      .projectColumn,
      .subColumn
        animation: mainContainerEnableFullMainColumnForHideColumn $views.main.fullMainColumnAnimeDuration $views.main.fullMainColumnAnimeTiming
        width: 0
        height: 0
        opacity: 0
        pointer-events: none
  &:not(.fullMainColumn)
    animation: mainContainerDisableFullMainColumnForMainContainer $views.main.fullMainColumnAnimeDuration $views.main.fullMainColumnAnimeTiming
    .mainContainer_slide
      animation: mainContainerDisableFullMainColumnForMainContainerSlide $views.main.fullMainColumnAnimeDuration $views.main.fullMainColumnAnimeTiming
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import store from '@/store';
import TeamColumn from './columns/team/TeamColumn.vue';

async function beforeRouteChange(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
  if (to.name === 'users') {
    return next();
  }

  const userId = parseInt(to.params.userId);
  const user = store.state.loggedInUsers.find((u) => u.id === userId);
  if (!user) {
    return next({ name: 'users' });
  }

  if (!store.state.activeUser.myUser || user.id !== store.state.activeUser.myUser.id) {
    await store.actions.activeUser.init(user);
  }

  // プロジェクト未選択の場合、プロジェクトが存在するなら選択
  if (to.name === 'user') {
    const projects = store.state.activeUser.projects;
    if (projects && projects.length) {
      return next({
        name: 'project',
        params: {
          userId: to.params.userId,
          projectId: projects[0].id.toString(),
        },
      });
    }
  }

  return next();
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
]);
@Component({
  components: {
    TeamColumn,
  },
})
export default class MainContainer extends Vue {
  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    try {
      await beforeRouteChange(to, from, next);
    } catch (err) {
      return next((vm) => {
        vm.$appEmit('error', { err });
        vm.$router.replace({ name: 'users' });
      });
    }
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    try {
      await beforeRouteChange(to, from, next);
    } catch (err) {
      this.$appEmit('error', { err });
      this.$router.replace({ name: 'users' });
    }
  }
}
</script>
