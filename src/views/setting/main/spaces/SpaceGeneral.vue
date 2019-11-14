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
        <button class="basicButtonPrimary wide" :disabled="saving || !changes" @click="save">
          {{ $t('views.setting.main.spaceGeneral.saveBtn') }}
        </button>
      </div>
      <div class="option_spaceGeneral_addButton clearfix">
        <button class="basicButtonDanger wide" :disabled="deleting" @click="confirmDeleting = true">
          {{ $t('views.setting.main.spaceGeneral.deleteBtn') }}
        </button>
      </div>
    </div>

    <my-confirm-change-discard-dialog
      v-if="!deleting"
      :changes="changes"
      :next="!!nextForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscardDialog"
    />

    <my-modal
      v-if="confirmDeleting"
      :value="true"
      class="modalDialog"
      content-class="modalDialog_content"
      @input="space"
    >
      <p class="modalDialog_content_title">
        {{ $t('views.setting.main.spaceGeneral.confirmDeleteSpace', { spaceName: space.displayName || space.account }) }}
      </p>

      <div class="modalDialog_content_footerButtons">
        <button class="basicButtonDanger modalDialog_content_footerButtons_button" @click="deleteSpace">
          {{ $t('common.confirm') }}
        </button>
        <button class="basicButtonNormal modalDialog_content_footerButtons_button" @click="confirmDeleting = false">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </my-modal>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_settings'

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
          border: 2px dashed $colors.primaryBlue
          border-radius: 4px
          left: -1px
          top: -1px
          right: -1px
          bottom: -1px
          box-sizing: border-box
          pointer-events: none
        img
          opacity: 0.3

  &_uploadButton_btn
    display: inline-block
    margin-top: 15px
</style>


<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { apiRegistry, SpacesApi, Space, SpacesSpaceIdAvatarPostRequest } from '@/lib/api';
import { Route, NavigationGuard } from 'vue-router';
import ConfirmChangeDiscardForSettingMixin from '@/mixins/ConfirmChangeDiscardForSettingMixin';
import EventsSub from '@/events-subscription';

@Component
export default class SpaceGeneral extends Mixins(ConfirmChangeDiscardForSettingMixin) {

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
  deleting: boolean = false;

  confirmDeleting: boolean = false;
  deletingSpace: any = null;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get space() {
    return this.myUser.space;
  }

  get api() {
    return apiRegistry.load(SpacesApi, this.myUser.token);
  }

  get avatarInputAccept() {
    return this.avatarFileMimes.join(',');
  }

  get changes() {
    if (!this.space) return false;
    return (
      !!this.avatar ||
      this.displayName !== (this.space.displayName || this.space.account)
    );
  }

  clearAvatarInput() {
    this.$refs.avatarInput.value = '';
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

    if (this.saving || !this.space) return;

    try {

      this.saving = true;

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

        await this.api.spacesSpaceIdAvatarPost(Object.assign(clip, {
          spaceId: this.space.id,
          avatar: this.avatar,
        }));

        this.avatar = null;

      }

      await this.api.spacesSpaceIdPut({
        spaceId: this.space.id,
        displayName: this.displayName.trim() === '' ? null : this.displayName.trim(),
      });

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  async deleteSpace() {

    if (this.deleting || !this.space) return;

    try {

      this.deleting = true;
      this.confirmDeleting = false;

      await this.api.spacesSpaceIdDelete({
        spaceId: this.space.id,
      });

    } catch (err) {
      this.$appEmit('error', { err });
      this.deleting = false;
    }

  }

  beforeMount() {
    if (!this.space) return;
    this.avatarUrl = this.space.avatarUrl;
    this.displayName = this.space.displayName || this.space.account;
  }

}
</script>
