<template>
  <div class="option_mainColumn option_spaceProfileGeneral">
    <h3 class="option_mainColumn_title">{{$t('views.setting.main.userProfile.userAvatar')}}</h3>
    <div class="option_spaceProfileGeneral_img">
      <input
        type="file"
        :accept="avatarInputAccept"
        id="avatarInput"
        ref="avatarInput"
        @change="inputFileChange">
      <div class="option_spaceProfileGeneral_img_thumbnail">
        <label for="avatarInput">
          <img v-if="avatarUrl" :src="avatarUrl" ref="avatarImage" alt="pic">
          <my-space-user-avatar v-else :user="myUser" :size="160" shape="roundedSquare" />
        </label>
      </div>
      <label class="option_spaceProfileGeneral_uploadButton" for="avatarInput">
        <div class="option_spaceProfileGeneral_uploadButton_button">
          {{$t('views.setting.main.userProfile.uploadBtn')}}
        </div>
      </label>
      <p>{{$t('views.setting.main.userProfile.uploadDescription')}}</p>
    </div>
    <div class="option_spaceProfileGeneral_input">
      <h3 class="option_mainColumn_title">
        {{$t('views.setting.main.userProfile.userName')}}
      </h3>
      <input type="text" v-model="displayName">
    </div>
    <div class="option_spaceProfileGeneral_addButton clearfix">
      <button class="option_spaceProfileGeneral_button" :disabled="saving" @click="save">
        {{$t('views.setting.main.userProfile.saveBtn')}}
      </button>
    </div>
  </div>
</template>


<style lang="stylus">
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
    img
      width: 100%
      height: 100%
      object-fit: cover

  &_uploadButton_button
    display: inline-block
    padding: 10px 15px
    margin-top: 15px
    background: #fff
    border: 1px solid #ccc
    border-radius: 4px
    cursor: pointer
    color: #333
    font-size: 16px
    font-weight: bold
    line-height: 24px
    text-align: center

  &_button:disabled
    opacity: 0.3
    cursor: default
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
  avatarInputAccept = 'image/png,image/jpeg,image/gif';

  displayName: string = '';

  saving: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
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

  async inputFileChange(ev: any) {
    const target = ev.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      this.avatarUrl = this.myUser.avatarUrl;
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
