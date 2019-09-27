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
          <img v-if="avatarUrl" :src="avatarUrl" alt="pic">
          <img v-else src="~@/assets/images/parts/img_option_space_sample.jpg" alt="pic">
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
          {{$t('views.setting.main.spaceGeneral.title2')}}
        </h3>
        <input type="text" v-model="displayName">
      </div>

      <div class="option_spaceGeneral_addButton clearfix">
        <button class="option_spaceGeneral_button" :disabled="saving" @click="save">
          {{$t('views.setting.main.spaceGeneral.saveBtn')}}
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, SpacesApi } from '@/lib/api';

@Component
export default class SpaceGeneral extends Vue {

  avatarUrl: string = '';
  file: File | null = null;

  displayName: string = '';

  saving: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  beforeMount() {
    const spaceInfo = this.myUser.space;
    this.avatarUrl = spaceInfo.avatarUrl ? spaceInfo.avatarUrl : '';
    this.displayName = spaceInfo.displayName ? spaceInfo.displayName : '';
  }

  async inputFileChange(event: any) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      this.avatarUrl = '';
      this.file = null;
      return;
    }
    this.file = target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (event: any) => {
      this.avatarUrl = event.target.result;
    };
    myReader.readAsDataURL(this.file);
  }

  async save() {
    if (this.saving) return;

    try {
      this.saving = true;
      const spaceApi = apiRegistry.load(SpacesApi, this.myUser.token);
      const space = await spaceApi.spacesSpaceIdPut({
        spaceId: this.myUser.space.id,
        displayName: this.displayName,
        avatar: this.file,
      });
      this.$store.mutations.editSpace(space);
      this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }
}
</script>
