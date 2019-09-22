<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">{{$t('views.setting.main.projectGeneral.title')}}</h3>
    <div class="option_commonColumn option_spaceProjectsGeneral">
      <div class="option_spaceProjectsGeneral_input">
        <input type="text">
      </div>
      <div class="option_spaceProjectsGeneral_addButton">
        <button class="option_spaceProjectsGeneral_button" type="button">{{$t('views.setting.main.projectGeneral.save')}}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class ProjectGeneral extends Vue {}
</script>
