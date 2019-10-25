<template>
  <div class="option_mainColumn">
    <div class="option_spaceGeneral">
      <h3 class="option_mainColumn_title">
        {{ $t('views.setting.main.spaceGeneral.title') }}
      </h3>

      <div class="option_spaceGeneral_img">
        <input
          id="avatarInput"
          ref="avatarInput"
          type="file"
          :accept="avatarInputAccept"
          @change="avatarInputChange"
        >
        <div class="option_spaceGeneral_img_thumbnail" :class="{ avatarFileDragging }">
          <label
            for="avatarInput"
            @dragover.prevent.stop="onAvatarImageDragOver"
            @dragleave.prevent.stop="avatarFileDragging = false"
            @dragend.prevent.stop="avatarFileDragging = false"
            @drop.prevent.stop="onAvatarImageDrop"
          >
            <img v-if="avatarUrl" ref="avatarImage" :src="avatarUrl" alt="pic">
            <img v-else src="~@/assets/images/parts/img_option_space_sample.jpg" alt="pic">
          </label>
        </div>
        <div /><!-- separator -->
        <label class="option_spaceGeneral_uploadButtonContainer" for="avatarInput">
          <div class="formButtonLight option_spaceGeneral_uploadButton_btn">
            {{ $t('views.setting.main.spaceGeneral.uploadBtn') }}
          </div>
        </label>
        <p>{{ $t('views.setting.main.spaceGeneral.uploadDescription') }}</p>
      </div>

      <div class="option_spaceGeneral_input">
        <h3 class="option_mainColumn_title">
          {{ $t('views.setting.main.spaceGeneral.title2') }}
        </h3>
        <input v-model="displayName" type="text" class="basicInput">
      </div>

      <div class="option_spaceGeneral_addButton clearfix">
        <button class="basicButtonPrimary wide" :disabled="saving" @click="save">
          {{ $t('views.setting.main.spaceGeneral.saveBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_fixed/base/_variable'

.option_spaceGeneral
  input[type="file"]
    display: none
  label[for="avatarInput"]
    cursor: pointer

  &_img_thumbnail
    overflow: visible !important
    label
      width: 160px
      height: 160px
      display: inline-block
      position: relative
    img
      width: 100%
      height: 100%
      object-fit: cover
      border-radius: 4px
    &.avatarFileDragging
      label
        &:before
          content: ''
          display: block
          position: absolute
          border: 4px dashed $colors.primaryBlue
          border-radius: 4px
          left: -2px
          top: -2px
          right: -2px
          bottom: -2px
          box-sizing: border-box
          pointer-events: none
        img
          opacity: 0.3

  &_uploadButton_btn
    display: inline-block
    margin-top: 15px
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, SpacesApi, SpacesSpaceIdAvatarPostRequest } from '@/lib/api';

@Component
export default class SpaceGeneral extends Vue {
  $refs!: {
    avatarInput: HTMLInputElement;
    avatarImage: HTMLImageElement;
  };

  avatarUrl: string | null = null;
  avatar: File | null = null;
  avatarFileMimes = ['image/png', 'image/jpeg', 'image/gif'];
  avatarFileDragging = false;

  displayName: string = '';

  saving: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get avatarInputAccept() {
    return this.avatarFileMimes.join(',');
  }

  clearAvatarInput() {
    this.$refs.avatarInput.value = '';
  }

  beforeMount() {
    this.avatarUrl = this.myUser.space.avatarUrl;
    this.displayName = this.myUser.space.displayName || this.myUser.space.account;
  }

  avatarInputChange(ev: any) {
    const target = ev.target as HTMLInputElement;
    if (!target.files) {
      this.clearAvatarInput();
      return;
    }
    const files = target.files;
    this.setAvatarFile(files);
    this.clearAvatarInput();
  }

  onAvatarImageDragOver(ev: DragEvent) {
    this.avatarFileDragging = ev.dataTransfer!.types.includes('Files');
  }

  onAvatarImageDrop(ev: DragEvent) {
    this.avatarFileDragging = false;
    this.setAvatarFile(ev.dataTransfer!.files);
  }

  setAvatarFile(files: FileList) {
    let file: File | null = null;
    for (let i = 0; i < files.length; i++) {
      if (this.avatarFileMimes.includes(files[i].type)) {
        file = files[i];
        break;
      }
    }
    if (!file) return;

    const myReader: FileReader = new FileReader();
    try {
      myReader.onloadend = () => {
        if (myReader.result) {
          this.avatar = file;
          this.avatarUrl = myReader.result as string;
        }
        myReader.onloadend = null;
      };
      myReader.readAsDataURL(file);

    } catch {
      myReader.onloadend = null;
    }
  }

  async save() {
    if (this.saving) return;

    try {
      this.saving = true;
      const spaceApi = apiRegistry.load(SpacesApi, this.myUser.token);
      const space = await spaceApi.spacesSpaceIdPut({
        spaceId: this.myUser.space.id,
        displayName: this.displayName.trim() === '' ? null : this.displayName.trim(),
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
      }
      // - this.$store.mutations.editSpace(space);
      // - this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }
}
</script>
