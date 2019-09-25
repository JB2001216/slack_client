<template>
  <div class="option_mainColumn">
    <div class="option_spaceGeneral">

      <h3 class="option_mainColumn_title">
        {{$t('views.setting.main.spaceGeneral.title')}}
      </h3>

      <div class="option_spaceGeneral_img">
        <div class="option_spaceGeneral_img_thumbnail">
          <input type="file" accept="image/png, .jpeg, .jpg"
                 @change="inputFileChange">
          <img v-if="url" :src="url" alt="pic">
          <img v-if="!url" src="~@/assets/images/parts/img_option_space_sample.jpg" alt="pic">
        </div>
        <div/><!-- separator -->
        <div class="option_spaceGeneral_uploadButton">
          <input type="file" accept="image/png, .jpeg, .jpg"
                 @drop.prevent
                 @change="inputFileChange">
          <button>
            {{$t('views.setting.main.spaceGeneral.uploadBtn')}}
          </button>
        </div>
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

  url: string = '';
  file: any;

  async inputFileChange(event: any) {

    const target = event.target;

    if (target.files.length === 0) return;

    this.file = target.files[0];

    const myReader: FileReader = new FileReader();

    myReader.onloadend = (event: any) => {
      this.url = event.target.result;
    };

    myReader.readAsDataURL(this.file);

  }

}
</script>
