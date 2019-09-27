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
        <button class="option_spaceGeneral_button" :disabled="saving || (!file && !displayName)" @click="save">
          {{$t('views.setting.main.spaceGeneral.saveBtn')}}
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, SpacesApi } from '@/lib/api';

interface SpaceIdPutRequest {
  displayName: string | null;
  avatar: Blob | null;
}

type SpaceIdPut = (req: SpaceIdPutRequest) => Promise<any>;

@Component
export default class SpaceGeneral extends Vue {

  avatarUrl: string = '';
  file: any = null;

  displayName: string = '';

  saving: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get api(): { update: SpaceIdPut } {
    const spaceApi = apiRegistry.load(SpacesApi, this.myUser.token);
    return {
      update: async(req: SpaceIdPutRequest) => {
        await spaceApi.spacesSpaceIdPut({
          spaceId: this.myUser.space.id,
          displayName: req.displayName,
          avatar: req.avatar,
        });
      },
    };
  }

  created() {
    const spaceInfo = this.myUser.space;
    this.avatarUrl = spaceInfo.avatarUrl ? spaceInfo.avatarUrl : '';
    this.displayName = spaceInfo.displayName ? spaceInfo.displayName : '';
  }

  async inputFileChange(event: any) {
    const target = event.target;
    if (target.files.length === 0) {
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
    if (!this.api) return;
    try {
      this.saving = true;
      await this.api.update({ avatar: this.file, displayName: this.displayName });
      this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

}
</script>
