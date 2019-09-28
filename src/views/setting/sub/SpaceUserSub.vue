<template>
  <div class="option_subColumn">
    <template v-for="(item, $index) in menu">
      <button
        :key="`item-${$index}-b`"
        :class="{active: item.routeName === currentRouterName}"
        class="option_subColumn_button green"
        @click="$store.mutations.settingRouter.to(item.routeName)">{{item.title()}}</button>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';
import i18n from '@/i18n';

@Component
export default class SpaceUserSub extends Vue {

  menu: {
    title: () => TranslateResult;
    routeName: string;
  }[] = [
    {
      title: () => i18n.t('views.setting.sub.spaces.userProfile'),
      routeName: 'space-user-profile',
    },
    {
      title: () => i18n.t('views.setting.sub.spaces.userAccount'),
      routeName: 'space-user-account',
    },
  ];

  get currentRouterName() {
    return this.$store.state.settingRouter.name;
  }

}
</script>
