<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">{{$t('views.setting.main.userAccount.title')}}</h3>
    <div class="option_commonColumn option_spaceProfileAccount">

      <p class="option_spaceProfileAccount_description">{{$t('views.setting.main.userAccount.emailDescription')}} <strong>Arteluni.dev@protonmail.com</strong></p>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SpaceUserAccount extends Vue {
}
</script>
