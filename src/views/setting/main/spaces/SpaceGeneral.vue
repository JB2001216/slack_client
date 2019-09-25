<template>
  <div class="option_mainColumn">
    <div class="option_spaceGeneral">

      <h3 class="option_mainColumn_title">
        {{$t('views.setting.main.spaceGeneral.title')}}
      </h3>

      <div class="option_spaceGeneral_img">
        <div class="option_spaceGeneral_img_thumbnail">
          <img src="~@/assets/images/parts/img_option_space_sample.jpg" alt="pic">
        </div>
        <button>
          {{$t('views.setting.main.spaceGeneral.uploadBtn')}}
        </button>
        <p>{{$t('views.setting.main.spaceGeneral.uploadDescription')}}</p>
      </div>

      <div class="option_spaceGeneral_input">
        <h3 class="option_mainColumn_title">
          {{$t('views.setting.main.spaceGeneral.title')}}
        </h3>
        <input type="text" value="Ernie,Inc.">
      </div>

      <div class="option_spaceGeneral_addButton clearfix">
        <button class="option_spaceGeneral_button">
          {{$t('views.setting.main.spaceGeneral.saveBtn')}}
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SpaceGeneral extends Vue {
}
</script>
