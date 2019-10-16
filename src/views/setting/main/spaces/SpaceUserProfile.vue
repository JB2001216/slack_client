<template>
  <div class="option_mainColumn option_spaceProfileGeneral">
    <h3 class="option_mainColumn_title">
      {{ $t('views.setting.main.userProfile.userAvatar') }}
    </h3>
    <div class="option_spaceProfileGeneral_img">
      <input
        id="avatarInput"
        ref="avatarInput"
        type="file"
        :accept="avatarInputAccept"
        @change="avatarInputChange"
      >
      <div class="option_spaceProfileGeneral_img_thumbnail" :class="{ avatarFileDragging }">
        <label
          for="avatarInput"
          @dragover.prevent.stop="onAvatarImageDragOver"
          @dragleave.prevent.stop="avatarFileDragging = false"
          @dragend.prevent.stop="avatarFileDragging = false"
          @drop.prevent.stop="onAvatarImageDrop"
        >
          <img v-if="avatarUrl" ref="avatarImage" :src="avatarUrl" alt="pic">
          <my-space-user-avatar v-else :user="myUser" :size="160" shape="roundedSquare" />
        </label>
      </div>
      <label class="option_spaceProfileGeneral_uploadButton" for="avatarInput">
        <div class="formButtonLight option_spaceProfileGeneral_uploadButton_button">
          {{ $t('views.setting.main.userProfile.uploadBtn') }}
        </div>
      </label>
      <p>{{ $t('views.setting.main.userProfile.uploadDescription') }}</p>
    </div>
    <div class="option_spaceProfileGeneral_input">
      <h3 class="option_mainColumn_title">
        {{ $t('views.setting.main.userProfile.userName') }}
      </h3>
      <input v-model="displayName" type="text" class="basicInput">
    </div>
    <div class="option_spaceProfileGeneral_addButton clearfix">
      <button class="basicButtonPrimary wide" :disabled="saving" @click="save">
        {{ $t('views.setting.main.userProfile.saveBtn') }}
      </button>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_fixed/base/_variable'

.option_spaceProfileGeneral
  input[type="file"]
    display: none
  label[for="avatarInput"]
    cursor: pointer

  &_img_thumbnail
    label
      width: 160px
      height: 160px
      display: inline-block
      position: relative
    img
      width: 100%
      height: 100%
      object-fit: cover
      border: 1px solid #c4c4c4;
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
        >img,
        .mySpaceUserAvatar
          opacity: 0.3

  &_uploadButton_button
    display: inline-block
    margin-top: 15px
</style>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, SpacesApi, UsersApi, SpacesSpaceIdUsersUserIdAvatarPostRequestBody } from '@/lib/api';

@Component
export default class SpaceUserProfile extends Vue {
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

  init() {
    this.clearAvatarInput();
    this.displayName = this.myUser.displayName || this.myUser.account;
    this.avatarUrl = null;
    this.avatar = null;
  }

  mounted() {
    this.init();
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
      const spacesApi = apiRegistry.load(SpacesApi, this.myUser.token);
      const usersApi = apiRegistry.load(UsersApi, this.myUser.token);
      const user = await usersApi.usersMePatch({
        usersMePatchRequestBody: {
          displayName: this.displayName.trim() === '' ? null : this.displayName.trim(),
        },
      });
      if (this.avatar && this.$refs.avatarImage) {
        const image = this.$refs.avatarImage;
        const clip: Pick<SpacesSpaceIdUsersUserIdAvatarPostRequestBody, 'left' | 'top' | 'width' | 'height'> = image.naturalWidth <= image.naturalHeight ? {
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
        const avatarPostResponse = await spacesApi.spacesSpaceIdUsersUserIdAvatarPost(Object.assign(clip, {
          spaceId: this.myUser.space.id,
          userId: this.myUser.id,
          avatar: this.avatar,
        }));
        user.avatarUrl = avatarPostResponse.avatarUrl;
        user.avatarSmallUrl = avatarPostResponse.avatarSmallUrl;
      }
      this.$appEmit('my-user-edited', { myUser: user });
      this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');
      this.init();

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }
}
</script>
