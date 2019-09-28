<template>
  <div class="option_mainColumn">
    <div class="option_spaceGeneral">

      <h3 class="option_mainColumn_title">
        {{$t('views.setting.main.spaceGeneral.title')}}
      </h3>

      <div class="option_spaceGeneral_img">
        <div class="option_spaceGeneral_img_thumbnail">
          <input type="file" :accept="avatarInputAccept"
                 ref="avatarInput1"
                 @change="inputFileChange">
          <img v-if="avatarUrl" :src="avatarUrl" ref="avatarImage" alt="pic">
          <img v-else src="~@/assets/images/parts/img_option_space_sample.jpg" alt="pic">
        </div>
        <div/><!-- separator -->
        <div class="option_spaceGeneral_uploadButton">
          <input type="file" :accept="avatarInputAccept"
                 ref="avatarInput2"
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


<style lang="stylus">
.option_spaceGeneral
  &_img_thumbnail
    img
      object-fit: cover

</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, SpacesApi, SpacesSpaceIdAvatarPostRequest } from '@/lib/api';

@Component
export default class SpaceGeneral extends Vue {
  $refs!: {
    avatarInput1: HTMLInputElement;
    avatarInput2: HTMLInputElement;
    avatarImage: HTMLImageElement;
  };

  avatarUrl: string | null = null;
  avatar: File | null = null;
  avatarInputAccept = 'image/png,image/jpeg,image/gif';

  displayName: string = '';

  saving: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  clearAvatarInput() {
    this.$refs.avatarInput1.value = '';
    this.$refs.avatarInput2.value = '';
  }

  beforeMount() {
    this.avatarUrl = this.myUser.space.avatarUrl;
    this.displayName = this.myUser.space.displayName || this.myUser.space.account;
  }

  async inputFileChange(ev: any) {
    const target = ev.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      this.avatarUrl = this.myUser.space.avatarUrl;
      this.avatar = null;
      return;
    }

    const myReader: FileReader = new FileReader();
    try {
      myReader.onloadend = () => {
        if (myReader.result) {
          this.avatar = target.files![0];
          this.avatarUrl = myReader.result as string;
        }
        myReader.onloadend = null;
        this.clearAvatarInput();
      };
      myReader.readAsDataURL(target.files[0]);

    } catch {
      myReader.onloadend = null;
      this.clearAvatarInput();
    }
  }

  async save() {
    if (this.saving) return;

    try {
      this.saving = true;
      const spaceApi = apiRegistry.load(SpacesApi, this.myUser.token);
      const space = await spaceApi.spacesSpaceIdPut({
        spaceId: this.myUser.space.id,
        displayName: this.displayName,
      });
      if (this.avatar && this.$refs.avatarImage) {
        const image = this.$refs.avatarImage;
        const clip: Pick<SpacesSpaceIdAvatarPostRequest, 'left' | 'top' | 'width' | 'height'> = image.naturalWidth <= image.naturalHeight ? {
          left: 0,
          width: image.naturalWidth,
          top: Math.floor((image.naturalHeight - image.naturalWidth) / 2),
          height: image.naturalWidth,
        } : {
          top: 0,
          height: image.naturalHeight,
          left: Math.floor((image.naturalWidth - image.naturalHeight) / 2),
          width: image.naturalHeight,
        };
        const avatarPostResponse = await spaceApi.spacesSpaceIdAvatarPost(Object.assign(clip, {
          spaceId: this.myUser.space.id,
          avatar: this.avatar,
        }));
        space.avatarUrl = avatarPostResponse.avatarUrl;
        space.avatarSmallUrl = avatarPostResponse.avatarSmallUrl;
        this.clearAvatarInput();
      }
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
